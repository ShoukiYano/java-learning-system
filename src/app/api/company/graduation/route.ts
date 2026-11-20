/**
 * ファイル概要：
 * 企業担当者・管理者向け「100点満点修了判定スコア」DB永続保存 API（POST /api/company/graduation）
 */

import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, getCurrentProfile } from "@/lib/data-service";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { evaluateGraduation } from "@/lib/curriculum/graduation";
import { recordAuditLog } from "@/lib/audit-log";
import type { GraduationCategoryKey } from "@/types/curriculum";

declare global {
  // eslint-disable-next-line no-var
  var __demoGraduationEvaluations:
    | Record<
        string,
        {
          scores: Partial<Record<GraduationCategoryKey, number>>;
          mandatoryPassed: boolean;
          comment?: string;
          updatedAt: string;
        }
      >
    | undefined;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const studentId = String(body.studentId ?? "").trim();
    const studentName = String(body.studentName ?? studentId);
    const scores = (body.scores ?? {}) as Partial<
      Record<GraduationCategoryKey, number>
    >;
    const mandatoryPassed = Boolean(body.mandatoryPassed);
    const evaluatorComment = body.comment ? String(body.comment).trim() : "";

    if (!studentId) {
      return NextResponse.json(
        { error: "studentId が必要です。" },
        { status: 400 }
      );
    }

    const evaluation = evaluateGraduation(scores, mandatoryPassed);
    const caller = await getCurrentProfile();

    if (!globalThis.__demoGraduationEvaluations) {
      globalThis.__demoGraduationEvaluations = {};
    }
    globalThis.__demoGraduationEvaluations[studentId] = {
      scores,
      mandatoryPassed,
      comment: evaluatorComment,
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const db =
          process.env.SUPABASE_SERVICE_ROLE_KEY &&
          !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
            ? createAdminClient()
            : await createClient();

        await db.from("graduation_evaluations").upsert(
          {
            user_id: studentId,
            company_id: caller.company_id ?? null,
            scores_json: scores,
            total_score: evaluation.totalScore,
            mandatory_final_project_passed: mandatoryPassed,
            verdict: evaluation.verdict,
            evaluator_id: caller.id,
            evaluator_comment: evaluatorComment || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
      } catch {
        // テーブル未適用時はインメモリ保存で継続
      }
    }

    await recordAuditLog({
      actorId: caller.id,
      actorEmail: caller.email,
      actorRole: caller.role,
      action: "save_graduation_evaluation",
      targetSummary: `${studentName} の修了判定を保存（${evaluation.totalScore}点 / ${evaluation.verdictLabel}）`,
    });

    return NextResponse.json({
      ok: true,
      evaluation,
      message: `${studentName} の100点修了評価（${evaluation.totalScore}点・${evaluation.verdictLabel}）を保存しました。`,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "修了評価の保存中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
