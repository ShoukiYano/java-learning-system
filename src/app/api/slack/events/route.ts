/**
 * ファイル概要：
 * Slack Event Subscriptions 受信エンドポイント（POST /api/slack/events）
 *
 * 主な処理：
 * 1. Slack App設定時の url_verification チャレンジ応答
 * 2. SLACK_SIGNING_SECRET による HMAC-SHA256 署名検証
 * 3. 講師によるスレッド返信（テキスト＋画像添付）を検知し、画像を Supabase Storage (`qa-attachments`) へ保存
 * 4. student_question_replies へ回答を登録し、student_questions.has_unread_reply = true に更新
 */

import { NextRequest, NextResponse } from "next/server";
import {
  verifySlackSignature,
  fetchSlackUserName,
  downloadSlackFileBuffer,
} from "@/lib/slack";
import { isSupabaseConfigured } from "@/lib/data-service";
import { createAdminClient } from "@/lib/supabase/admin";

interface SlackFileItem {
  id?: string;
  name?: string;
  mimetype?: string;
  url_private_download?: string;
  url_private?: string;
}

interface SlackEventPayload {
  type?: string;
  challenge?: string;
  event?: {
    type?: string;
    subtype?: string;
    bot_id?: string;
    user?: string;
    text?: string;
    channel?: string;
    ts?: string;
    thread_ts?: string;
    files?: SlackFileItem[];
  };
}

function extFromMime(mime: string): string {
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  if (mime.includes("gif")) return "gif";
  if (mime.includes("webp")) return "webp";
  return "png";
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    let payload: SlackEventPayload;
    try {
      payload = JSON.parse(rawBody) as SlackEventPayload;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // 1. Slack Event Subscriptions の URL 疎通確認（url_verification）
    if (payload.type === "url_verification" && payload.challenge) {
      return NextResponse.json({ challenge: payload.challenge });
    }

    // 2. Slack 署名検証（SLACK_SIGNING_SECRET）
    const signingSecret = process.env.SLACK_SIGNING_SECRET || "";
    if (process.env.NODE_ENV === "production" && !signingSecret) {
      return NextResponse.json(
        { error: "SLACK_SIGNING_SECRET が未設定です。" },
        { status: 401 }
      );
    }
    if (signingSecret) {
      const valid = verifySlackSignature({
        signingSecret,
        timestamp: request.headers.get("x-slack-request-timestamp"),
        rawBody,
        signature: request.headers.get("x-slack-signature"),
      });
      if (!valid) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    // 3. イベントフィルタリング（Bot投稿・削除・編集・親メッセージ自体は除外し、スレッド返信のみ処理）
    const ev = payload.event;
    if (
      !ev ||
      ev.type !== "message" ||
      ev.bot_id ||
      (ev.subtype &&
        ev.subtype !== "file_share" &&
        ev.subtype !== "thread_broadcast") ||
      !ev.channel ||
      !ev.thread_ts ||
      !ev.ts ||
      ev.thread_ts === ev.ts
    ) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    if (
      !isSupabaseConfigured() ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
    ) {
      return NextResponse.json({ ok: true, skipped: "no_db" });
    }

    const adminClient = createAdminClient();

    // 4. 該当スレッドに紐づく質問レコードを検索
    const { data: question } = await adminClient
      .from("student_questions")
      .select("id, user_id, problem_title")
      .eq("slack_channel_id", ev.channel)
      .eq("slack_thread_ts", ev.thread_ts)
      .maybeSingle();

    if (!question) {
      console.warn(
        `[POST /api/slack/events] thread_not_linked channel=${ev.channel} thread_ts=${ev.thread_ts}`
      );
      return NextResponse.json({ ok: true, ignored: "thread_not_linked" });
    }

    const botToken = process.env.SLACK_BOT_TOKEN || "";
    const senderName =
      botToken && ev.user
        ? await fetchSlackUserName(botToken, ev.user)
        : "担当講師";

    // 5. 添付画像がある場合は Slack から取得して Supabase Storage (qa-attachments) へ永続保存
    const uploadedImageUrls: string[] = [];
    const imageFiles = (ev.files ?? []).filter((f) =>
      (f.mimetype || "").startsWith("image/")
    );

    if (botToken && imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        const f = imageFiles[i];
        const url = f.url_private_download || f.url_private;
        if (!url) continue;
        const downloaded = await downloadSlackFileBuffer(botToken, url);
        if (!downloaded) continue;

        const ext = extFromMime(downloaded.contentType);
        const storagePath = `${question.id}/${Date.now()}-${i}.${ext}`;
        const { error: uploadErr } = await adminClient.storage
          .from("qa-attachments")
          .upload(storagePath, downloaded.buffer, {
            contentType: downloaded.contentType,
            upsert: false,
          });

        if (!uploadErr) {
          const { data: pub } = adminClient.storage
            .from("qa-attachments")
            .getPublicUrl(storagePath);
          if (pub?.publicUrl) {
            uploadedImageUrls.push(pub.publicUrl);
          }
        } else {
          console.error("[Slack Events] Storage upload error:", uploadErr);
        }
      }
    }

    const replyBody = String(ev.text ?? "").trim();
    if (!replyBody && uploadedImageUrls.length === 0) {
      return NextResponse.json({ ok: true, ignored: "empty_reply" });
    }

    // 6. 回答をDBへ保存（slack_ts の UNIQUE 制約でリトライ重複を防止）
    const { error: repErr } = await adminClient
      .from("student_question_replies")
      .upsert(
        {
          question_id: question.id,
          sender_role: "instructor",
          sender_name: senderName,
          body: replyBody,
          image_urls: uploadedImageUrls,
          slack_ts: ev.ts,
        },
        { onConflict: "slack_ts", ignoreDuplicates: true }
      );

    if (repErr) {
      console.error("[Slack Events] reply insert error:", repErr);
      return NextResponse.json({ error: repErr.message }, { status: 500 });
    }

    // 7. 質問ステータスを「回答済み」＋「受講生未読」に更新
    await adminClient
      .from("student_questions")
      .update({
        status: "answered",
        has_unread_reply: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", question.id);

    return NextResponse.json({
      ok: true,
      questionId: question.id,
      imagesSaved: uploadedImageUrls.length,
    });
  } catch (err) {
    console.error("[POST /api/slack/events] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Slack event error" },
      { status: 500 }
    );
  }
}
