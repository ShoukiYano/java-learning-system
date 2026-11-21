/**
 * ファイル概要：
 * 問題別「講師へ質問する」＆ 受講生Q&A一覧取得 API（GET / POST /api/student/questions）
 * - GET: ログイン受講生の質問一覧＋講師回答スレッド（?summary=1 で軽量未読チェック対応）
 * - POST: 質問内容をDBへ記録し、Slack Bot API（スレッド双方向同期）または Incoming Webhook へ通知
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getCompanySlackSettingsFromDb,
  isSupabaseConfigured,
} from "@/lib/data-service";
import { requireApiAuth } from "@/lib/api-auth";
import { postSlackBotQuestion, sendSlackQuestionAlert } from "@/lib/slack";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { recordAuditLog } from "@/lib/audit-log";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth(["student", "company", "admin"]);
    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(request.url);
    const summaryOnly = searchParams.get("summary") === "1";

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        ok: true,
        unreadCount: 0,
        latestUnread: null,
        questions: [],
      });
    }

    const db =
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
        ? createAdminClient()
        : await createClient();

    if (summaryOnly) {
      const { data: unreadRows, error } = await db
        .from("student_questions")
        .select("id, problem_title, updated_at")
        .eq("user_id", auth.profile.id)
        .eq("has_unread_reply", true)
        .order("updated_at", { ascending: false })
        .limit(5);

      if (error) {
        // マイグレーション未適用でもポーリングでエラーにしない
        return NextResponse.json({
          ok: true,
          unreadCount: 0,
          latestUnread: null,
        });
      }

      const list = unreadRows ?? [];
      return NextResponse.json({
        ok: true,
        unreadCount: list.length,
        latestUnread: list[0]
          ? {
              id: list[0].id,
              problemTitle: list[0].problem_title,
              updatedAt: list[0].updated_at,
            }
          : null,
      });
    }

    const { data: questions, error: qErr } = await db
      .from("student_questions")
      .select("*")
      .eq("user_id", auth.profile.id)
      .order("updated_at", { ascending: false })
      .limit(50);

    if (qErr) {
      return NextResponse.json({
        ok: true,
        unreadCount: 0,
        latestUnread: null,
        questions: [],
      });
    }

    const qList = (questions ?? []) as Array<{
      id: string;
      problem_id: string;
      problem_title: string;
      question_text: string;
      code_snippet: string | null;
      status: string;
      has_unread_reply?: boolean;
      slack_channel_id?: string | null;
      slack_thread_ts?: string | null;
      created_at: string;
      updated_at?: string;
    }>;

    const qIds = qList.map((q) => q.id);
    let repliesByQ: Record<
      string,
      Array<{
        id: string;
        question_id: string;
        sender_role: "instructor" | "student";
        sender_name: string;
        body: string;
        image_urls: string[];
        created_at: string;
      }>
    > = {};

    if (qIds.length > 0) {
      const { data: repRows } = await db
        .from("student_question_replies")
        .select("*")
        .in("question_id", qIds)
        .order("created_at", { ascending: true });

      if (repRows) {
        repliesByQ = {};
        for (const r of repRows as Array<{
          id: string;
          question_id: string;
          sender_role: "instructor" | "student";
          sender_name: string;
          body: string;
          image_urls: string[];
          created_at: string;
        }>) {
          if (!repliesByQ[r.question_id]) repliesByQ[r.question_id] = [];
          repliesByQ[r.question_id].push({
            ...r,
            image_urls: Array.isArray(r.image_urls) ? r.image_urls : [],
          });
        }
      }
    }

    const enriched = qList.map((q) => ({
      ...q,
      has_unread_reply: Boolean(q.has_unread_reply),
      replies: repliesByQ[q.id] ?? [],
    }));

    const unreadList = enriched.filter((q) => q.has_unread_reply);

    return NextResponse.json({
      ok: true,
      unreadCount: unreadList.length,
      latestUnread: unreadList[0]
        ? {
            id: unreadList[0].id,
            problemTitle: unreadList[0].problem_title,
            updatedAt: unreadList[0].updated_at ?? unreadList[0].created_at,
          }
        : null,
      questions: enriched,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "質問一覧の取得中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(["student", "company", "admin"]);
    if (!auth.ok) return auth.response;

    const body = await request.json();
    const problemId = String(body.problemId ?? "").trim();
    const problemTitle = String(body.problemTitle ?? "演習問題").trim();
    const questionText = String(body.questionText ?? "").trim();
    const rawSnippet = body.codeSnippet ?? body.codeSnapshot;
    const codeSnippet = rawSnippet ? String(rawSnippet) : undefined;

    if (!questionText) {
      return NextResponse.json(
        { error: "質問内容を入力してください。" },
        { status: 400 }
      );
    }

    const profile = auth.profile;
    const companyId =
      profile.company_id ?? "00000000-0000-4000-8000-000000000001";
    const companyName =
      profile.companies?.name ?? "株式会社ACMEテクノロジーズ";

    // Slack通知：Bot Token ＋ チャンネルID が揃っていれば双方向スレッド同期モードで投稿、なければWebhookへフォールバック
    let slackNotified = false;
    let slackChannelId: string | null = null;
    let slackThreadTs: string | null = null;

    const slackSettings = await getCompanySlackSettingsFromDb(companyId);
    const botToken = process.env.SLACK_BOT_TOKEN || "";
    const targetChannelId =
      slackSettings.questionChannelId ||
      process.env.SLACK_DEFAULT_QUESTION_CHANNEL_ID ||
      "";

    if (botToken && targetChannelId) {
      const botRes = await postSlackBotQuestion({
        botToken,
        channelId: targetChannelId,
        companyName,
        studentName: profile.full_name,
        problemTitle,
        questionText,
        codeSnippet,
      });
      if (botRes.ok) {
        slackNotified = true;
        slackChannelId = botRes.channelId ?? targetChannelId;
        slackThreadTs = botRes.threadTs ?? null;
      } else {
        console.error("[POST /api/student/questions] Bot post error:", botRes.error);
      }
    }

    if (!slackNotified) {
      const targetWebhookUrl =
        slackSettings.questionWebhookUrl || slackSettings.webhookUrl;
      if (targetWebhookUrl) {
        const slackRes = await sendSlackQuestionAlert({
          webhookUrl: targetWebhookUrl,
          companyName,
          studentName: profile.full_name,
          problemTitle,
          questionText,
          codeSnippet,
        });
        slackNotified = slackRes.ok;
      }
    }

    if (isSupabaseConfigured()) {
      const db =
        process.env.SUPABASE_SERVICE_ROLE_KEY &&
        !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
          ? createAdminClient()
          : await createClient();

      const { error: insErr } = await db.from("student_questions").insert({
        user_id: profile.id,
        company_id: companyId,
        student_name: profile.full_name,
        problem_id: problemId,
        problem_title: problemTitle,
        question_text: questionText,
        code_snippet: codeSnippet ?? null,
        status: "open",
        slack_channel_id: slackChannelId,
        slack_thread_ts: slackThreadTs,
        has_unread_reply: false,
        updated_at: new Date().toISOString(),
      });

      if (insErr) {
        // 新カラム未マイグレーション環境への後方互換フォールバック
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
      }
    }

    await recordAuditLog({
      actorId: profile.id,
      actorEmail: profile.email,
      actorRole: "student",
      action: "student_question",
      targetSummary: `${profile.full_name} が「${problemTitle}」について質問（Slack通知: ${slackNotified ? (slackThreadTs ? "双方向スレッド連携済" : "Webhook済") : "未設定"}）`,
    });

    return NextResponse.json({
      ok: true,
      slackNotified,
      twoWaySynced: Boolean(slackThreadTs),
      message: slackNotified
        ? "質問を送信し、担当講師のSlackチャンネルへ通知しました！回答が届くと画面上でお知らせします。"
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
