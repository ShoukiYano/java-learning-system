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
import {
  QA_ATTACHMENTS_BUCKET,
  MAX_QA_IMAGE_BYTES,
  QA_SIGNED_URL_TTL_VIEW_SEC,
  QA_SIGNED_URL_TTL_SLACK_SEC,
  detectAndValidateImage,
  extractQaStoragePath,
  resolveQaAttachmentSignedUrls,
  resolveQaAttachmentSignedUrlBatch,
  type ValidatedImage,
} from "@/lib/qa-attachments";

function hasValidServiceRoleKey(): boolean {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(key && !key.includes("your-service-role-key"));
}

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
        const typedRepRows = repRows as Array<{
          id: string;
          question_id: string;
          sender_role: "instructor" | "student";
          sender_name: string;
          body: string;
          image_urls: string[];
          created_at: string;
        }>;

        const batchItems = typedRepRows
          .filter((r) => Array.isArray(r.image_urls) && r.image_urls.length > 0)
          .map((r) => ({
            entries: r.image_urls,
            allowedPrefixes: [
              `student/${auth.profile.id}/`,
              `${r.question_id}/`,
            ],
          }));

        const signedUrlMap =
          batchItems.length > 0
            ? await resolveQaAttachmentSignedUrlBatch(
                db,
                batchItems,
                QA_SIGNED_URL_TTL_VIEW_SEC
              )
            : new Map<string, string>();

        repliesByQ = {};
        for (const r of typedRepRows) {
          if (!repliesByQ[r.question_id]) repliesByQ[r.question_id] = [];
          const allowedPrefixes = [
            `student/${auth.profile.id}/`,
            `${r.question_id}/`,
          ];
          const rawUrls = Array.isArray(r.image_urls) ? r.image_urls : [];
          const resolvedUrls: string[] = [];
          for (const entry of rawUrls) {
            const normalized = extractQaStoragePath(entry);
            if (
              normalized &&
              allowedPrefixes.some((prefix) => normalized.startsWith(prefix))
            ) {
              const signed = signedUrlMap.get(normalized);
              if (signed) resolvedUrls.push(signed);
            }
          }
          repliesByQ[r.question_id].push({
            ...r,
            image_urls: resolvedUrls,
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
    console.error("[GET /api/student/questions] error:", err);
    return NextResponse.json(
      { error: "質問一覧の取得中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}

const MAX_IMAGE_COUNT = 3;

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(["student", "company", "admin"]);
    if (!auth.ok) return auth.response;

    const contentType = request.headers.get("content-type") || "";
    let problemId = "";
    let problemTitle = "演習問題";
    let questionText = "";
    let codeSnippet: string | undefined;
    const validatedImages: Array<{
      buffer: Buffer;
      mime: ValidatedImage["mime"];
      ext: ValidatedImage["ext"];
    }> = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      problemId = String(formData.get("problemId") ?? "").trim();
      problemTitle = String(formData.get("problemTitle") ?? "演習問題").trim();
      questionText = String(formData.get("questionText") ?? "").trim();
      const rawSnippet = formData.get("codeSnippet");
      codeSnippet = rawSnippet ? String(rawSnippet) : undefined;

      const rawImages = formData.getAll("images");
      for (const item of rawImages) {
        if (item instanceof File && item.size > 0) {
          if (item.size > MAX_QA_IMAGE_BYTES) {
            return NextResponse.json(
              { error: "画像サイズは1枚あたり5MB以内にしてください。" },
              { status: 400 }
            );
          }
          if (validatedImages.length >= MAX_IMAGE_COUNT) {
            return NextResponse.json(
              { error: `添付できる画像は最大${MAX_IMAGE_COUNT}枚までです。` },
              { status: 400 }
            );
          }
          const arrayBuf = await item.arrayBuffer();
          const buf = Buffer.from(arrayBuf);
          const check = detectAndValidateImage(buf);
          if (!check.valid) {
            return NextResponse.json({ error: check.reason }, { status: 400 });
          }
          validatedImages.push({
            buffer: buf,
            mime: check.mime,
            ext: check.ext,
          });
        }
      }
    } else {
      const body = await request.json();
      problemId = String(body.problemId ?? "").trim();
      problemTitle = String(body.problemTitle ?? "演習問題").trim();
      questionText = String(body.questionText ?? "").trim();
      const rawSnippet = body.codeSnippet ?? body.codeSnapshot;
      codeSnippet = rawSnippet ? String(rawSnippet) : undefined;
    }

    if (!questionText) {
      return NextResponse.json(
        { error: "質問内容を入力してください。" },
        { status: 400 }
      );
    }

    const profile = auth.profile;
    const supabaseConfigured = isSupabaseConfigured();
    // APP-L4: Supabase接続時は company_id 欠落時に他社IDへフォールバックしない
    const companyId: string | null = supabaseConfigured
      ? (profile.company_id ?? null)
      : (profile.company_id ?? "00000000-0000-4000-8000-000000000001");
    const companyName =
      profile.companies?.name ??
      (companyId ? "所属企業" : "未所属（個人受講）");

    // 画像を Supabase Storage (qa-attachments) へアップロード（DBにはストレージパスのみ保存）
    const uploadedImagePaths: string[] = [];
    let slackSignedImageUrls: string[] = [];
    let responseSignedImageUrls: string[] = [];

    if (validatedImages.length > 0 && supabaseConfigured) {
      const hasServiceRole = hasValidServiceRoleKey();
      if (!hasServiceRole && process.env.NODE_ENV === "production") {
        return NextResponse.json(
          {
            error:
              "画像アップロード機能が現在利用できません。管理者へお問い合わせください。",
          },
          { status: 503 }
        );
      }

      const storageClient = hasServiceRole
        ? createAdminClient()
        : await createClient();

      for (let i = 0; i < validatedImages.length; i++) {
        const img = validatedImages[i];
        const storagePath = `student/${profile.id}/${Date.now()}_${i}.${img.ext}`;
        const { error: upErr } = await storageClient.storage
          .from(QA_ATTACHMENTS_BUCKET)
          .upload(storagePath, img.buffer, {
            contentType: img.mime,
            upsert: false,
          });
        if (!upErr) {
          uploadedImagePaths.push(storagePath);
        } else {
          console.error(
            "[POST /api/student/questions] image upload error:",
            upErr
          );
        }
      }

      if (uploadedImagePaths.length > 0) {
        const allowedPrefixes = [`student/${profile.id}/`];
        [slackSignedImageUrls, responseSignedImageUrls] = await Promise.all([
          resolveQaAttachmentSignedUrls(
            storageClient,
            uploadedImagePaths,
            allowedPrefixes,
            QA_SIGNED_URL_TTL_SLACK_SEC
          ),
          resolveQaAttachmentSignedUrls(
            storageClient,
            uploadedImagePaths,
            allowedPrefixes,
            QA_SIGNED_URL_TTL_VIEW_SEC
          ),
        ]);
      }
    }

    const questionTextForSlack =
      slackSignedImageUrls.length > 0
        ? `${questionText}\n\n📎 添付画像:\n${slackSignedImageUrls.map((u, idx) => `・画像${idx + 1}: ${u}`).join("\n")}`
        : questionText;

    // Slack通知：companyId が存在する場合のみ自社Slack設定を参照（null時は他社Webhookを絶対に呼ばない）
    let slackNotified = false;
    let slackChannelId: string | null = null;
    let slackThreadTs: string | null = null;

    const botToken = process.env.SLACK_BOT_TOKEN || "";

    if (companyId !== null) {
      const slackSettings = await getCompanySlackSettingsFromDb(companyId);
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
          questionText: questionTextForSlack,
          codeSnippet,
        });
        if (botRes.ok) {
          slackNotified = true;
          slackChannelId = botRes.channelId ?? targetChannelId;
          slackThreadTs = botRes.threadTs ?? null;
        } else {
          console.error(
            "[POST /api/student/questions] Bot post error:",
            botRes.error
          );
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
            questionText: questionTextForSlack,
            codeSnippet,
          });
          slackNotified = slackRes.ok;
        }
      }
    } else {
      const defaultChannelId = process.env.SLACK_DEFAULT_QUESTION_CHANNEL_ID || "";
      if (botToken && defaultChannelId) {
        const botRes = await postSlackBotQuestion({
          botToken,
          channelId: defaultChannelId,
          companyName: "未所属（個人受講）",
          studentName: profile.full_name,
          problemTitle,
          questionText: questionTextForSlack,
          codeSnippet,
        });
        if (botRes.ok) {
          slackNotified = true;
          slackChannelId = botRes.channelId ?? defaultChannelId;
          slackThreadTs = botRes.threadTs ?? null;
        } else {
          console.error(
            "[POST /api/student/questions] Default channel Bot post error:",
            botRes.error
          );
        }
      } else {
        console.warn(
          "[POST /api/student/questions] company_id is null and SLACK_DEFAULT_QUESTION_CHANNEL_ID is not configured; skipped Slack notification."
        );
      }
    }

    if (supabaseConfigured) {
      const db = hasValidServiceRoleKey()
        ? createAdminClient()
        : await createClient();

      const { data: insertedQ, error: insErr } = await db
        .from("student_questions")
        .insert({
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
        })
        .select("id")
        .maybeSingle();

      let questionIdForImages = insertedQ?.id ?? null;

      if (insErr) {
        // 新カラム未マイグレーション環境への後方互換フォールバック
        const { data: fallbackQ } = await db
          .from("student_questions")
          .insert({
            user_id: profile.id,
            company_id: companyId,
            student_name: profile.full_name,
            problem_id: problemId,
            problem_title: problemTitle,
            question_text: questionText,
            code_snippet: codeSnippet ?? null,
            status: "open",
          })
          .select("id")
          .maybeSingle();
        questionIdForImages = fallbackQ?.id ?? null;
      }

      // 添付画像がある場合はスレッド側にもストレージパスを記録
      if (questionIdForImages && uploadedImagePaths.length > 0) {
        await db.from("student_question_replies").insert({
          question_id: questionIdForImages,
          sender_role: "student",
          sender_name: profile.full_name,
          body: "（スクリーンショットを添付しました）",
          image_urls: uploadedImagePaths,
        });
      }
    }

    await recordAuditLog({
      actorId: profile.id,
      actorEmail: profile.email,
      actorRole: "student",
      action: "student_question",
      targetSummary: `${profile.full_name} が「${problemTitle}」について質問（画像${uploadedImagePaths.length}枚・Slack通知: ${slackNotified ? (slackThreadTs ? "双方向スレッド連携済" : "Webhook済") : "未設定"}）`,
    });

    return NextResponse.json({
      ok: true,
      slackNotified,
      twoWaySynced: Boolean(slackThreadTs),
      imageCount: uploadedImagePaths.length,
      imageUrls: responseSignedImageUrls,
      message: slackNotified
        ? "質問を送信し、担当講師のSlackチャンネルへ通知しました！回答が届くと画面上でお知らせします。"
        : "質問を送信しました。講師からの回答をお待ちください。",
    });
  } catch (err) {
    console.error("[POST /api/student/questions] error:", err);
    return NextResponse.json(
      { error: "質問の送信中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
