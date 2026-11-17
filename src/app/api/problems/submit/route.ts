// =============================================================================
// 提出採点 Route Handler (POST /api/problems/submit)
// 仕様：
// - サーバー側（Route Handler）で、同じインタプリタを使って公開テストと非公開テストの両方を判定する
// - サービスロールキー（createAdminClient）を使うサーバー側だけで非公開テスト（is_hidden=true）を取得・判定する
// - 出力の比較では、末尾の空白と改行の違いは無視する（compareOutputs）
// - 結果を submissions テーブルに保存し、全テストに通過したら progress.status = 'completed' とする
// - 挑戦回数（attempts_count）と所要時間（time_spent_seconds）を記録する
// - 非公開テストの入力値・期待出力はクライアントレスポンスに含めない
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { runJavaCode, compareOutputs } from "@/lib/java";
import { SEED_PROBLEMS } from "@/lib/seed-data";
import { isSupabaseConfigured } from "@/lib/data-service";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { SubmissionStatus, TestCase } from "@/types/database";

// 簡易レート制限（同一IP/ユーザーからの連続提出スパム防止）
const recentSubmitMap = new Map<string, number>();

export interface TestCaseClientJudgeResult {
  name: string;
  isHidden: boolean;
  passed: boolean;
  executionTimeMs: number;
  stepsExecuted: number;
  // 公開テストのみ差分表示用に格納（非公開テストでは絶対に送らない）
  input?: string;
  expectedOutput?: string;
  actualOutput?: string;
  errorDetail?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      problemId,
      code,
      timeSpentSeconds = 0,
      unlockedHintStep = 0,
    }: {
      problemId: string;
      code: string;
      timeSpentSeconds?: number;
      unlockedHintStep?: number;
    } = body;

    if (!problemId || typeof code !== "string") {
      return NextResponse.json(
        { error: "problemId と code は必須です。" },
        { status: 400 }
      );
    }

    // レート制限（1.5秒以内の連打を防止）
    const clientIp = request.headers.get("x-forwarded-for") ?? "local";
    const lastTs = recentSubmitMap.get(`${clientIp}:${problemId}`) ?? 0;
    const now = Date.now();
    if (now - lastTs < 1500) {
      return NextResponse.json(
        { error: "提出間隔が短すぎます。数秒待ってから再度提出してください。" },
        { status: 429 }
      );
    }
    recentSubmitMap.set(`${clientIp}:${problemId}`, now);

    // 1. テストケース一覧（公開＋非公開）の取得
    // サービスロールキーが設定されている場合は特権クライアントで全テストケースを取得し、
    // 未設定時はシード定義から取得する
    let allTestCases: TestCase[] = [];
    const seedProb = SEED_PROBLEMS.find((p) => p.id === problemId);

    if (
      isSupabaseConfigured() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
    ) {
      const adminSupabase = createAdminClient();
      const { data: dbCases } = await adminSupabase
        .from("test_cases")
        .select("*")
        .eq("problem_id", problemId)
        .order("order_index", { ascending: true });

      if (dbCases && dbCases.length > 0) {
        allTestCases = dbCases as TestCase[];
      }
    }

    if (allTestCases.length === 0 && seedProb) {
      allTestCases = seedProb.test_cases.map((tc, idx) => ({
        id: `seed-tc-${idx}`,
        problem_id: problemId,
        ...tc,
      }));
    }

    if (allTestCases.length === 0) {
      return NextResponse.json(
        { error: "対象の問題またはテストケースが見つかりません。" },
        { status: 404 }
      );
    }

    // 2. 自作Javaインタプリタで全テストケースを実行・判定
    const results: TestCaseClientJudgeResult[] = [];
    let passedCount = 0;
    let totalExecTimeMs = 0;
    let totalSteps = 0;
    let overallStatus: SubmissionStatus = "passed";
    let compileErrorText: string | null = null;
    let compileDiagnostics = null;

    for (const tc of allTestCases) {
      const execRes = runJavaCode(code, {
        stdin: tc.input,
        maxSteps: 3_000_000,
        maxCallDepth: 400,
      });

      totalExecTimeMs += execRes.executionTimeMs;
      totalSteps += execRes.stepsExecuted;

      if (execRes.status === "compile_error") {
        overallStatus = "compile_error";
        compileErrorText = execRes.stderr;
        compileDiagnostics = execRes.diagnostics;
        break;
      }

      const isPass =
        execRes.status === "success" &&
        compareOutputs(execRes.stdout, tc.expected_output);

      if (isPass) {
        passedCount++;
      } else if (overallStatus === "passed") {
        if (execRes.status === "step_limit_exceeded") {
          overallStatus = "time_limit_exceeded";
        } else if (execRes.status === "runtime_error") {
          overallStatus = "runtime_error";
        } else {
          overallStatus = "wrong_answer";
        }
      }

      // ★ セキュリティ：非公開テスト（is_hidden === true）の入力・期待出力・実出力はクライアントに送らない
      if (tc.is_hidden) {
        results.push({
          name: `${tc.name}（非公開テスト）`,
          isHidden: true,
          passed: isPass,
          executionTimeMs: execRes.executionTimeMs,
          stepsExecuted: execRes.stepsExecuted,
          errorDetail:
            execRes.status !== "success"
              ? execRes.runtimeError?.exceptionClass ?? "実行時エラー"
              : undefined,
        });
      } else {
        results.push({
          name: tc.name,
          isHidden: false,
          passed: isPass,
          executionTimeMs: execRes.executionTimeMs,
          stepsExecuted: execRes.stepsExecuted,
          input: tc.input,
          expectedOutput: tc.expected_output,
          actualOutput: execRes.stdout,
          errorDetail: execRes.stderr || undefined,
        });
      }
    }

    const allPassed =
      overallStatus === "passed" && passedCount === allTestCases.length;

    // 3. Supabase が設定されている場合、submissions / progress / study_logs / profiles を更新
    let savedSubmissionId: string | null = null;
    let updatedAttemptsCount = 1;

    if (isSupabaseConfigured()) {
      try {
        const userSupabase = await createClient();
        const {
          data: { user },
        } = await userSupabase.auth.getUser();

        const dbClient =
          process.env.SUPABASE_SERVICE_ROLE_KEY &&
          !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
            ? createAdminClient()
            : userSupabase;

        if (user) {
          // 3-1. submissions に保存
          const { data: subRow } = await dbClient
            .from("submissions")
            .insert({
              user_id: user.id,
              problem_id: problemId,
              code,
              status: allPassed ? "passed" : overallStatus,
              passed_count: passedCount,
              total_count: allTestCases.length,
              execution_time_ms: totalExecTimeMs,
              memory_kb: Math.max(128, Math.round(totalSteps / 10)),
              compile_error: compileErrorText,
              time_spent_seconds: Math.max(1, Math.round(timeSpentSeconds)),
            })
            .select("id")
            .single();

          savedSubmissionId = subRow?.id ?? null;

          // 3-2. progress の挑戦回数・所要時間・ステータスを更新
          const { data: existingProg } = await dbClient
            .from("progress")
            .select("*")
            .eq("user_id", user.id)
            .eq("problem_id", problemId)
            .maybeSingle();

          updatedAttemptsCount = (existingProg?.attempts_count ?? 0) + 1;
          const newTotalTime =
            (existingProg?.total_time_spent_seconds ?? 0) +
            Math.max(1, Math.round(timeSpentSeconds));

          const newStatus =
            existingProg?.status === "completed" || allPassed
              ? "completed"
              : "in_progress";

          await dbClient.from("progress").upsert(
            {
              user_id: user.id,
              problem_id: problemId,
              status: newStatus,
              attempts_count: updatedAttemptsCount,
              total_time_spent_seconds: newTotalTime,
              unlocked_hint_step: Math.max(
                existingProg?.unlocked_hint_step ?? 0,
                unlockedHintStep
              ),
              completed_at: allPassed
                ? existingProg?.completed_at ?? new Date().toISOString()
                : existingProg?.completed_at ?? null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,problem_id" }
          );

          // 3-3. study_logs（学習カレンダー用）を更新
          const todayStr = new Date().toISOString().slice(0, 10);
          const addedMins = Math.max(1, Math.ceil(timeSpentSeconds / 60));

          const { data: todayLog } = await dbClient
            .from("study_logs")
            .select("*")
            .eq("user_id", user.id)
            .eq("study_date", todayStr)
            .maybeSingle();

          await dbClient.from("study_logs").upsert(
            {
              user_id: user.id,
              study_date: todayStr,
              minutes: (todayLog?.minutes ?? 0) + addedMins,
              problems_solved:
                (todayLog?.problems_solved ?? 0) + (allPassed ? 1 : 0),
            },
            { onConflict: "user_id,study_date" }
          );
        }
      } catch {
        // DB未接続時も採点結果自体は返す
      }
    }

    return NextResponse.json({
      status: allPassed ? "passed" : overallStatus,
      allPassed,
      passedCount,
      totalCount: allTestCases.length,
      executionTimeMs: totalExecTimeMs,
      stepsExecuted: totalSteps,
      compileError: compileErrorText,
      diagnostics: compileDiagnostics,
      results,
      submissionId: savedSubmissionId,
      attemptsCount: updatedAttemptsCount,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "サーバー採点処理中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
