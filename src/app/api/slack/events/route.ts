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
import {
  QA_ATTACHMENTS_BUCKET,
  MAX_QA_IMAGE_BYTES,
  MAX_SLACK_EVENT_IMAGES,
  detectAndValidateImage,
} from "@/lib/qa-attachments";

interface SlackFileItem {
  id?: string;
  name?: string;
  mimetype?: string;
  size?: number;
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

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    // 1. 最優先で Slack 署名検証（SLACK_SIGNING_SECRET）を実行（url_verification を含む全リクエストを保護）
    const signingSecret = process.env.SLACK_SIGNING_SECRET?.trim() || "";
    if (process.env.NODE_ENV === "production" && !signingSecret) {
      return NextResponse.json(
        { error: "認証設定が構成されていません。" },
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

    let payload: SlackEventPayload;
    try {
      payload = JSON.parse(rawBody) as SlackEventPayload;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // 2. 署名検証済みの Slack Event Subscriptions URL 疎通確認（url_verification）
    if (payload.type === "url_verification" && typeof payload.challenge === "string") {
      return NextResponse.json({ challenge: payload.challenge });
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

    // 5. 添付画像がある場合は Slack から取得してマジックバイト検証後に Supabase Storage (qa-attachments) へ保存（DBにはパスのみ保存）
    const uploadedImagePaths: string[] = [];
    const imageFiles = (ev.files ?? [])
      .filter((f) => (f.mimetype || "").startsWith("image/"))
      .slice(0, MAX_SLACK_EVENT_IMAGES);

    if (botToken && imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        const f = imageFiles[i];
        if (typeof f.size === "number" && f.size > MAX_QA_IMAGE_BYTES) {
          console.warn("[POST /api/slack/events] skipped oversized Slack attachment");
          continue;
        }
        const url = f.url_private_download || f.url_private;
        if (!url) continue;
        const downloaded = await downloadSlackFileBuffer(
          botToken,
          url,
          MAX_QA_IMAGE_BYTES
        );
        if (!downloaded) continue;

        const validated = detectAndValidateImage(downloaded.buffer);
        if (!validated.valid) {
          console.warn(
            "[POST /api/slack/events] skipped invalid Slack image attachment"
          );
          continue;
        }

        const storagePath = `${question.id}/${Date.now()}-${i}.${validated.ext}`;
        const { error: uploadErr } = await adminClient.storage
          .from(QA_ATTACHMENTS_BUCKET)
          .upload(storagePath, downloaded.buffer, {
            contentType: validated.mime,
            upsert: false,
          });

        if (!uploadErr) {
          uploadedImagePaths.push(storagePath);
        } else {
          console.error("[Slack Events] Storage upload error:", uploadErr);
        }
      }
    }

    const replyBody = String(ev.text ?? "").trim();
    if (!replyBody && uploadedImagePaths.length === 0) {
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
          image_urls: uploadedImagePaths,
          slack_ts: ev.ts,
        },
        { onConflict: "slack_ts", ignoreDuplicates: true }
      );

    if (repErr) {
      console.error("[Slack Events] reply insert error:", repErr);
      return NextResponse.json(
        { error: "回答の保存に失敗しました。" },
        { status: 500 }
      );
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
      imagesSaved: uploadedImagePaths.length,
    });
  } catch (err) {
    console.error("[POST /api/slack/events] error:", err);
    return NextResponse.json(
      { error: "イベント処理中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
