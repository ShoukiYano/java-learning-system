/**
 * ファイル概要：
 * 問題別「講師へ質問する」API（POST /api/student/questions）
 * 質問内容をDBへ記録し、所属企業のSlack Webhookが設定されていれば即座にSlack通知します。
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getCurrentProfile,
  getCompanySlackSettingsFromDb,
  isSupabaseConfigured,
} from "@/lib/data-service";
import { sendSlackQuestionAlert } from "@/lib/slack";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { recordAuditLog } from "@/lib/audit-log";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const problemId = String(body.problemId ?? "").trim();
    const problemTitle = String(body.problemTitle ?? "演習問題").trim();
    const questionText = String(body.questionText ?? "").trim();
    const codeSnippet = body.codeSnippet ? String(body.codeSnippet) : undefined;

    if (!questionText) {
      return NextResponse.json(
        { error: "質問内容を入力してください。" },
        { status: 400 }
      );
    }

    const profile = await getCurrentProfile();
    const companyId =
      profile.company_id ?? "00000000-0000-4000-8000-000000000001";
    const companyName =
      profile.companies?.name ?? "株式会社ACMEテクノロジーズ";

    if (isSupabaseConfigured()) {
      try {
        const db =
          process.env.SUPABASE_SERVICE_ROLE_KEY &&
          !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
            ? createAdminClient()
            : await createClient();
        await db.from("student_questions").insert({
          user_id: profile.id,
          company_id: companyId,
          student_name: profile.full_name,
          problem_id: problemId,
          problem_title: problemTitle,
          question_text: questionText,
          code_snippet: codeSnippet ?? null,
          status: "open",
        });
      } catch {
        // テーブル未適用時はSlack通知のみ継続
      }
    }

    // 所属企業のSlack Webhookが設定されていれば自動通知
    let slackNotified = false;
    const slackSettings = await getCompanySlackSettingsFromDb(companyId);
    if (slackSettings.webhookUrl) {
      const slackRes = await sendSlackQuestionAlert({
        webhookUrl: slackSettings.webhookUrl,
        companyName,
        studentName: profile.full_name,
        problemTitle,
        questionText,
        codeSnippet,
      });
      slackNotified = slackRes.ok;
    }

    await recordAuditLog({
      actorId: profile.id,
      actorEmail: profile.email,
      actorRole: "student",
      action: "student_question",
      targetSummary: `${profile.full_name} が「${problemTitle}」について質問（Slack通知: ${slackNotified ? "済" : "未設定"}）`,
    });

    return NextResponse.json({
      ok: true,
      slackNotified,
      message: slackNotified
        ? "質問を送信し、担当講師のSlackチャンネルへ通知しました！"
        : "質問を送信しました。講師からの回答をお待ちください。",
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "質問の送信中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
