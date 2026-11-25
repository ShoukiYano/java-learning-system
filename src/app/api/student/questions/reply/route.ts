/**
 * ファイル概要：
 * 質疑応答スレッドへの返信 API（POST /api/student/questions/reply）
 * - 受講生が追加質問を送信した場合、紐づくSlackスレッドにも自動投稿します。
 * - 管理者・企業担当者がアプリ内から回答した場合もDB保存＆受講生未読フラグをONにします。
 */

import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/data-service";
import { requireApiAuth } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { postSlackBotThreadReply } from "@/lib/slack";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(["student", "company", "admin"]);
    if (!auth.ok) return auth.response;

    const body = await request.json();
    const questionId = String(body.questionId ?? "").trim();
    const replyText = String(body.body ?? "").trim();

    if (!questionId || !replyText) {
      return NextResponse.json(
        { error: "返信内容を入力してください。" },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        ok: true,
        demo: true,
        reply: {
          id: `demo-reply-${Date.now()}`,
          question_id: questionId,
          sender_role: auth.role === "student" ? "student" : "instructor",
          sender_name: auth.profile.full_name,
          body: replyText,
          image_urls: [],
          created_at: new Date().toISOString(),
        },
      });
    }

    const db =
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
        ? createAdminClient()
        : await createClient();

    const { data: question } = await db
      .from("student_questions")
      .select("id, user_id, company_id, slack_channel_id, slack_thread_ts")
      .eq("id", questionId)
      .maybeSingle();

    if (!question) {
      return NextResponse.json(
        { error: "対象の質問が見つかりませんでした。" },
        { status: 404 }
      );
    }

    // 権限チェック（受講生は自分の質問のみ、企業担当者は自社のみ）
    if (auth.role === "student" && question.user_id !== auth.profile.id) {
      return NextResponse.json(
        { error: "他の受講生の質問には返信できません。" },
        { status: 403 }
      );
    }
    if (
      auth.role === "company" &&
      (!auth.profile.company_id || question.company_id !== auth.profile.company_id)
    ) {
      return NextResponse.json(
        { error: "他社の質問には返信できません。" },
        { status: 403 }
      );
    }

    const isStudent = auth.role === "student";
    let slackTs: string | null = null;

    // 受講生の追加質問かつSlackスレッド紐付け済みなら、同じSlackスレッドへ投稿
    const botToken = process.env.SLACK_BOT_TOKEN || "";
    if (
      isStudent &&
      botToken &&
      question.slack_channel_id &&
      question.slack_thread_ts
    ) {
      const slackRes = await postSlackBotThreadReply({
        botToken,
        channelId: question.slack_channel_id,
        threadTs: question.slack_thread_ts,
        studentName: auth.profile.full_name,
        replyText,
      });
      if (slackRes.ok && slackRes.ts) {
        slackTs = slackRes.ts;
      }
    }

    const { data: inserted, error: insErr } = await db
      .from("student_question_replies")
      .insert({
        question_id: questionId,
        sender_role: isStudent ? "student" : "instructor",
        sender_name: auth.profile.full_name,
        body: replyText,
        image_urls: [],
        slack_ts: slackTs,
      })
      .select("*")
      .single();

    if (insErr) {
      console.error("[POST /api/student/questions/reply] insert error:", insErr);
      return NextResponse.json(
        { error: "返信の保存に失敗しました。時間をおいて再度お試しください。" },
        { status: 500 }
      );
    }

    await db
      .from("student_questions")
      .update({
        status: isStudent ? "open" : "answered",
        has_unread_reply: !isStudent,
        updated_at: new Date().toISOString(),
      })
      .eq("id", questionId);

    return NextResponse.json({ ok: true, reply: inserted });
  } catch (err) {
    console.error("[POST /api/student/questions/reply] error:", err);
    return NextResponse.json(
      { error: "返信の送信中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
