/**
 * ファイル概要：
 * 提出コード自動採点・実行判定 Route Handler (POST /api/problems/submit)
 *
 * 主な処理：
 * 1. レート制限の適用（同一IP・問題に対する1.5秒以内の連続提出連打スパムを遮断）
 * 2. コース受講権限（ロック状態）のサーバーサイド検証（ロック中コースへの不正提出を403でブロック）
 * 3. 公開テストケースおよび非公開テストケース（is_hidden = true）の取得
 *    （サービスロールキーを用いた特権クライアントで非公開テストを安全に取得）
 * 4. 自作Javaインタプリタ / 自作SQLクエリエンジンによるサーバー側サンドボックス実行・出力比較
 * 5. セキュリティ保護：非公開テストの入力値・期待出力・実行時スタックトレースをレスポンスから完全隠蔽
 * 6. 判定結果および学習記録のDB永続化：
 *    - submissions テーブル：提出コード、合否、実行時間、消費メモリ等の履歴保存
 *    - progress テーブル：問題別の挑戦回数、学習所要時間、合格ステータス（completed）の更新
 *    - study_logs テーブル：学習カレンダー・草グラフ用の当日の学習分数・クリア問数の集計
 *    - profiles テーブル：連続学習日数（ストリークカウント）と最終学習日の自動更新
 *
 * 注意事項：
 * - 外部APIやDocker等のコンテナ環境に依存せず、Node.js内の自作インタプリタで完結して高速採点を行います。
 */

import { NextRequest, NextResponse } from "next/server";
import { runJavaCode, compareOutputs } from "@/lib/java";
import { runSqlCode } from "@/lib/sql";
import { createInitialGitState, executeGitScript, compareGitStates } from "@/lib/git/git-engine";
import { evaluateExcelSubmission } from "@/lib/excel/excel-engine";
import { evaluateHtmlCssSubmission } from "@/lib/htmlcss/htmlcss-evaluator";
import {
  evaluateLiteracySubmission,
  evaluateProjectSubmission,
} from "@/lib/curriculum-evaluators";
import {
  SEED_CHAPTERS,
  SEED_PROBLEMS,
  SEED_COURSE_ID,
  SEED_SQL_COURSE_ID,
  SEED_GIT_COURSE_ID,
  detectProblemLanguage,
} from "@/lib/seed-data";
import { isSupabaseConfigured, getCoursesWithProgress } from "@/lib/data-service";
import { requireApiAuth } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { SubmissionStatus, TestCase } from "@/types/database";

/** 提出コードのUTF-8最大バイト長（64KB） */
const MAX_CODE_BYTES = 65536;

/**
 * 簡易レート制限用のユーザー/IP・問題キーごとの最終提出タイムスタンプ管理マップ
 */
const recentSubmitMap = new Map<string, number>();

/**
 * クライアントに返却するテストケースごとの判定結果型
 */
export interface TestCaseClientJudgeResult {
  /** テストケース名（非公開テストの場合は「〇〇（非公開テスト）」と表示） */
  name: string;
  /** 非公開テストフラグ */
  isHidden: boolean;
  /** 合格フラグ（期待出力と実出力が完全一致したか） */
  passed: boolean;
  /** 実行所要時間（ミリ秒） */
  executionTimeMs: number;
  /** 実行された命令ステップ数（計算量指標） */
  stepsExecuted: number;
  /** 入力データ（公開テストのみ差分表示用に格納。非公開テストではセキュリティ上undefined） */
  input?: string;
  /** 期待される標準出力（公開テストのみ格納） */
  expectedOutput?: string;
  /** 実際の標準出力（公開テストのみ格納） */
  actualOutput?: string;
  /** エラー詳細メッセージ（公開テストのみ格納） */
  errorDetail?: string;
}

/**
 * 処理概要：
 * 提出コードの自動採点実行および学習履歴保存POSTハンドラー
 *
 * 処理詳細：
 * 1. リクエストパラメータ（problemId, code, timeSpentSeconds, unlockedHintStep）のバリデーション
 * 2. 1.5秒以内の連打リクエストに対するレート制限（429 Too Many Requests）
 * 3. 認証ユーザーの場合、所属コースが受講制限（ロック）されていないかサーバー側検証
 * 4. テストケース（公開＋非公開）をSupabaseまたはシードデータからロード
 * 5. 問題の対象言語（JavaまたはSQL）を自動判別し、全テストケースをサンドボックス実行
 * 6. 出力比較関数（末尾空白・改行の違いを吸収するcompareOutputs）で成否を厳格判定
 * 7. 非公開テストの機密情報をマスクしたクライアント返却用オブジェクト（results）を構成
 * 8. Supabase接続時は提出履歴、問題進捗、学習ログ、連続学習ストリーク日数をトランザクション的に更新
 * 9. 総合判定結果（passed / wrong_answer / compile_error 等）をJSONレスポンスとして返却
 *
 * @param request 送信されたNextRequest
 * @returns 採点結果オブジェクトのNextResponse
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 共通認証・認可ガード（本番Supabase未設定は503、未認証は401、profiles欠落・ロール外は403）
    const auth = await requireApiAuth(["student", "company", "admin"]);
    if (!auth.ok) {
      return auth.response;
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "リクエスト形式が不正です。" },
        { status: 400 }
      );
    }

    const {
      problemId: rawProblemId,
      code,
      timeSpentSeconds: rawTimeSpent = 0,
      unlockedHintStep: rawHintStep = 0,
    }: {
      problemId?: unknown;
      code?: unknown;
      timeSpentSeconds?: unknown;
      unlockedHintStep?: unknown;
    } = body ?? {};

    // 2. パラメータ型検証・サイズ上限チェック（UTF-8 64KB）
    if (
      typeof rawProblemId !== "string" ||
      rawProblemId.trim().length < 1 ||
      rawProblemId.trim().length > 128 ||
      typeof code !== "string"
    ) {
      return NextResponse.json(
        { error: "problemId と code は必須です。" },
        { status: 400 }
      );
    }
    const problemId = rawProblemId.trim();

    if (Buffer.byteLength(code, "utf8") > MAX_CODE_BYTES) {
      return NextResponse.json(
        {
          error:
            "提出コードのサイズが上限（64KB）を超えています。コードを短くして再提出してください。",
        },
        { status: 413 }
      );
    }

    const parsedTimeSpent = Number(rawTimeSpent);
    const timeSpentSeconds = Number.isFinite(parsedTimeSpent)
      ? Math.min(86400, Math.max(0, parsedTimeSpent))
      : 0;

    const parsedHintStep = Number(rawHintStep);
    const unlockedHintStep = Number.isFinite(parsedHintStep)
      ? Math.min(3, Math.max(0, Math.trunc(parsedHintStep)))
      : 0;

    // 3. レート制限（1.5秒以内の連打を防止）
    const supabaseEnabled = isSupabaseConfigured();
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip")?.trim() ||
      "local";
    const rateLimitKey = supabaseEnabled
      ? `${auth.profile.id}:${problemId}`
      : `demo:${clientIp}:${problemId}`;
    const lastTs = recentSubmitMap.get(rateLimitKey) ?? 0;
    const now = Date.now();
    if (now - lastTs < 1500) {
      return NextResponse.json(
        { error: "提出間隔が短すぎます。数秒待ってから再度提出してください。" },
        { status: 429 }
      );
    }
    recentSubmitMap.set(rateLimitKey, now);

    const seedProb = SEED_PROBLEMS.find((p) => p.id === problemId);

    // 4. シード外（管理画面で新規作成された問題）のメタデータをDBから取得（エラー時は503 Fail-Closed）
    let dbProblemMeta: {
      tags: string[];
      starter_code: string;
      solution_code: string;
      course_id: string | null;
    } | null = null;

    if (!seedProb && supabaseEnabled) {
      try {
        const metaClient =
          process.env.SUPABASE_SERVICE_ROLE_KEY &&
          !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
            ? createAdminClient()
            : await createClient();
        const { data: probRow, error: probErr } = await metaClient
          .from("problems")
          .select("tags, starter_code, solution_code, lessons(chapters(course_id))")
          .eq("id", problemId)
          .maybeSingle();
        if (probErr) {
          console.error(
            "[POST /api/problems/submit] problem metadata fetch error:",
            probErr
          );
          return NextResponse.json(
            {
              error:
                "問題情報の取得に失敗しました。時間をおいて再度お試しください。",
            },
            { status: 503 }
          );
        }
        if (probRow) {
          const typed = probRow as unknown as {
            tags?: string[];
            starter_code?: string;
            solution_code?: string;
            lessons?: { chapters?: { course_id?: string } };
          };
          dbProblemMeta = {
            tags: Array.isArray(typed.tags) ? typed.tags : [],
            starter_code: typed.starter_code ?? "",
            solution_code: typed.solution_code ?? "",
            course_id: typed.lessons?.chapters?.course_id ?? null,
          };
        }
      } catch (metaErr) {
        console.error(
          "[POST /api/problems/submit] problem metadata fetch exception:",
          metaErr
        );
        return NextResponse.json(
          {
            error:
              "問題情報の取得に失敗しました。時間をおいて再度お試しください。",
          },
          { status: 503 }
        );
      }
    }

    // 5. コース受講権限・ロックのサーバー側ガード（例外握りつぶし廃止・Fail-Closed）
    if (supabaseEnabled) {
      try {
        const userCourses = await getCoursesWithProgress(
          auth.profile.id,
          auth.profile.company_id ?? null,
          { throwOnError: true }
        );
        const seedChRef = seedProb
          ? SEED_CHAPTERS.find((ch) => ch.id === seedProb.chapter_id)
          : undefined;
        const metaTags = seedProb?.tags ?? dbProblemMeta?.tags ?? [];
        const isGit =
          seedProb?.language === "git" ||
          metaTags.some((t) => t.toUpperCase().includes("GIT"));
        const isSql =
          seedProb?.language === "sql" ||
          metaTags.some((t) => t.toUpperCase().includes("SQL"));
        const targetCourseId =
          dbProblemMeta?.course_id ??
          seedChRef?.course_id ??
          (isGit
            ? SEED_GIT_COURSE_ID
            : isSql
            ? SEED_SQL_COURSE_ID
            : SEED_COURSE_ID);

        const matchedCourse = userCourses.find((c) => c.id === targetCourseId);
        if (!matchedCourse) {
          return NextResponse.json(
            { error: "この問題が属するコースは現在受講できません。" },
            { status: 403 }
          );
        }
        if (matchedCourse.isLocked) {
          return NextResponse.json(
            {
              error: `この問題が属するコースは現在受講制限（ロック）されています。（${matchedCourse.lockReason}）`,
            },
            { status: 403 }
          );
        }
      } catch (lockErr) {
        console.error(
          "[POST /api/problems/submit] course lock check failed:",
          lockErr
        );
        return NextResponse.json(
          {
            error:
              "コース受講権限の確認に失敗しました。時間をおいて再度お試しください。",
          },
          { status: 503 }
        );
      }
    }

    // 1. テストケース一覧（公開＋非公開）の取得
    // サービスロールキーが設定されている場合は特権クライアントで全テストケースを取得し、
    // 未設定時はシード定義から取得する
    let allTestCases: TestCase[] = [];

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

    // 2. 問題言語（Java / SQL / Git / ITリテラシー / Excel / HTML&CSS / Project）を判定
    const starterSpecSource = seedProb?.starter_code ?? dbProblemMeta?.starter_code ?? "";
    const problemLanguage = detectProblemLanguage({
      language: seedProb?.language,
      tags: seedProb?.tags ?? dbProblemMeta?.tags,
      starter_code: starterSpecSource || code,
    });

    const isEmbeddedSpecLanguage =
      problemLanguage === "literacy" ||
      problemLanguage === "excel" ||
      problemLanguage === "htmlcss" ||
      problemLanguage === "project";

    if (!isEmbeddedSpecLanguage && allTestCases.length === 0) {
      return NextResponse.json(
        { error: "対象の問題またはテストケースが見つかりません。" },
        { status: 404 }
      );
    }

    const results: TestCaseClientJudgeResult[] = [];
    let passedCount = 0;
    let totalExecTimeMs = 0;
    let totalSteps = 0;
    let overallStatus: SubmissionStatus = "passed";
    let compileErrorText: string | null = null;
    let compileDiagnostics = null;

    if (problemLanguage === "literacy") {
      const grade = evaluateLiteracySubmission(starterSpecSource, code);
      for (const d of grade.details) {
        results.push({
          name: d.question,
          isHidden: false,
          passed: d.passed,
          executionTimeMs: 1,
          stepsExecuted: 1,
          actualOutput: d.passed ? "正解" : "不正解",
          expectedOutput: "正解",
          errorDetail: d.passed ? undefined : d.explanation,
        });
      }
      passedCount = grade.passedCount;
      overallStatus = grade.passed ? "passed" : "wrong_answer";
    } else if (problemLanguage === "excel") {
      const grade = evaluateExcelSubmission(starterSpecSource, code);
      for (const chk of grade.checks) {
        results.push({
          name: `${chk.cell}: ${chk.label}`,
          isHidden: false,
          passed: chk.passed,
          executionTimeMs: 2,
          stepsExecuted: 1,
          expectedOutput: chk.expected,
          actualOutput: chk.actual,
          errorDetail: chk.passed ? undefined : chk.message,
        });
      }
      passedCount = grade.passedCount;
      overallStatus = grade.passed ? "passed" : "wrong_answer";
    } else if (problemLanguage === "htmlcss") {
      const grade = evaluateHtmlCssSubmission(starterSpecSource, code);
      for (const chk of grade.checks) {
        results.push({
          name: chk.label,
          isHidden: false,
          passed: chk.passed,
          executionTimeMs: 2,
          stepsExecuted: 1,
          expectedOutput: "OK",
          actualOutput: chk.passed ? "OK" : chk.message,
          errorDetail: chk.passed ? undefined : chk.message,
        });
      }
      passedCount = grade.passedCount;
      overallStatus = grade.passed ? "passed" : "wrong_answer";
    } else if (problemLanguage === "project") {
      const grade = evaluateProjectSubmission(starterSpecSource, code);
      for (const chk of grade.checks) {
        results.push({
          name: chk.label,
          isHidden: false,
          passed: chk.passed,
          executionTimeMs: 2,
          stepsExecuted: 1,
          expectedOutput: "提出要件クリア",
          actualOutput: chk.message,
          errorDetail: chk.passed ? undefined : chk.message,
        });
      }
      passedCount = grade.passedCount;
      overallStatus = grade.passed ? "passed" : "wrong_answer";
    }

    for (const tc of isEmbeddedSpecLanguage ? [] : allTestCases) {
      if (problemLanguage === "git") {
        const initial = createInitialGitState();
        const baseState = seedProb?.starter_code
          ? executeGitScript(initial, seedProb.starter_code).state
          : initial;
        const targetState = seedProb?.solution_code
          ? executeGitScript(initial, seedProb.solution_code).state
          : baseState;

        const { state: userFinalState, results: userResults } = executeGitScript(
          baseState,
          code
        );
        const hasErr = userResults.some((r) => r.isError);
        const check = compareGitStates(userFinalState, targetState);

        const isPass = !hasErr && check.isMatch;
        results.push({
          name: tc.name || "Gitツリー整合性判定",
          isHidden: !!tc.is_hidden,
          passed: isPass,
          actualOutput: isPass
            ? "CLEAR: 目標ツリーと完全一致"
            : check.reason || "目標ツリーと一致しません",
          expectedOutput: "CLEAR: 目標ツリーと完全一致",
          executionTimeMs: 5,
          stepsExecuted: userResults.length,
        });

        if (isPass) {
          passedCount++;
        } else {
          overallStatus = "wrong_answer";
        }
        continue;
      }

      const execRes =
        problemLanguage === "sql"
          ? runSqlCode(code, { setupSql: tc.input })
          : runJavaCode(code, {
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

    const totalTestsCount = isEmbeddedSpecLanguage
      ? results.length
      : allTestCases.length;
    const allPassed =
      overallStatus === "passed" &&
      totalTestsCount > 0 &&
      passedCount === totalTestsCount;

    // 3. Supabase が設定されている場合、submissions / progress / study_logs / profiles を更新
    let savedSubmissionId: string | null = null;
    let updatedAttemptsCount = 1;
    let dbSaved = !supabaseEnabled;

    if (supabaseEnabled) {
      try {
        const userId = auth.profile.id;
        const dbClient =
          process.env.SUPABASE_SERVICE_ROLE_KEY &&
          !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
            ? createAdminClient()
            : await createClient();

        // 3-1. submissions に保存
        const { data: subRow, error: subErr } = await dbClient
          .from("submissions")
          .insert({
            user_id: userId,
            problem_id: problemId,
            code,
            status: allPassed ? "passed" : overallStatus,
            passed_count: passedCount,
            total_count: totalTestsCount,
            execution_time_ms: totalExecTimeMs,
            memory_kb: Math.max(128, Math.round(totalSteps / 10)),
            compile_error: compileErrorText,
            time_spent_seconds: Math.max(1, Math.round(timeSpentSeconds)),
          })
          .select("id")
          .single();

        if (subErr) {
          console.error("[POST /api/problems/submit] submissions insert error:", subErr);
        } else {
          savedSubmissionId = subRow?.id ?? null;
        }

        // 3-2. progress の挑戦回数・所要時間・ステータスを更新
        const { data: existingProg } = await dbClient
          .from("progress")
          .select("*")
          .eq("user_id", userId)
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

        const { error: progErr } = await dbClient.from("progress").upsert(
          {
            user_id: userId,
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
        if (progErr) {
          console.error("[POST /api/problems/submit] progress upsert error:", progErr);
        }

        // 3-3. study_logs（学習カレンダー用）を更新
        const todayStr = new Date().toISOString().slice(0, 10);
        const addedMins = Math.max(1, Math.ceil(timeSpentSeconds / 60));

        const { data: todayLog } = await dbClient
          .from("study_logs")
          .select("*")
          .eq("user_id", userId)
          .eq("study_date", todayStr)
          .maybeSingle();

        const { error: logErr } = await dbClient.from("study_logs").upsert(
          {
            user_id: userId,
            study_date: todayStr,
            minutes: (todayLog?.minutes ?? 0) + addedMins,
            problems_solved:
              (todayLog?.problems_solved ?? 0) + (allPassed ? 1 : 0),
          },
          { onConflict: "user_id,study_date" }
        );
        if (logErr) {
          console.error("[POST /api/problems/submit] study_logs upsert error:", logErr);
        }

        // 3-4. profiles の連続学習日数（streak_days）と last_study_date を自動更新
        const { data: prof } = await dbClient
          .from("profiles")
          .select("streak_days, last_study_date")
          .eq("id", userId)
          .maybeSingle();

        if (prof) {
          const lastDateStr = prof.last_study_date;
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().slice(0, 10);

          let newStreak = prof.streak_days ?? 0;
          if (lastDateStr === todayStr) {
            // 今日すでに学習済みの場合は維持（最低1日）
            newStreak = Math.max(1, newStreak);
          } else if (lastDateStr === yesterdayStr) {
            // 昨日学習していた場合はストリーク +1
            newStreak = newStreak + 1;
          } else {
            // 2日以上空いていた、または初回学習の場合は 1 から再スタート
            newStreak = 1;
          }

          const { error: profErr } = await dbClient
            .from("profiles")
            .update({
              streak_days: newStreak,
              last_study_date: todayStr,
            })
            .eq("id", userId);
          if (profErr) {
            console.error("[POST /api/problems/submit] profiles update error:", profErr);
          }
        }

        dbSaved = !subErr && !progErr && !logErr;
      } catch (dbEx) {
        console.error("[POST /api/problems/submit] DB persistence error:", dbEx);
      }
    }

    return NextResponse.json({
      status: allPassed ? "passed" : overallStatus,
      allPassed,
      passedCount,
      totalCount: totalTestsCount,
      executionTimeMs: totalExecTimeMs,
      stepsExecuted: totalSteps,
      compileError: compileErrorText,
      diagnostics: compileDiagnostics,
      results,
      submissionId: savedSubmissionId,
      attemptsCount: updatedAttemptsCount,
      dbSaved,
    });
  } catch (err) {
    console.error("[POST /api/problems/submit] error:", err);
    return NextResponse.json(
      { error: "サーバー採点処理中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
