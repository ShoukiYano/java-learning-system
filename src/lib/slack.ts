/**
 * ファイル概要：
 * 管理者Slack連携通知ユーティリティ
 *
 * 主な処理：
 * 1. 企業別チャンネルへのIncoming Webhook経由のメッセージPOST送信
 * 2. 研修進捗ダイジェスト（受講生数、平均進捗、遅れアラート、マイルストーン状況）のBlock Kit / Markdownメッセージ生成
 * 3. 企業連携テスト通知の送信
 *
 * 注意事項：
 * - Slackの無料プラン（フリープラン）でもIncoming Webhooksは追加費用なし・送信数実質無制限で利用可能です。
 * - Webhook URLが未設定またはテスト環境の場合は、通信エラーにならず安全にシミュレーション結果を返します。
 */

import crypto from "crypto";
import { StudentAnalyticsRecord } from "@/lib/mock-analytics";
import { TrainingMilestone } from "@/types/database";

export interface SlackSendResult {
  ok: boolean;
  statusText?: string;
  simulated?: boolean;
  error?: string;
}

/**
 * 処理概要：
 * 指定されたSlack Incoming Webhook URLへペイロードをPOST送信する
 *
 * @param webhookUrl Slack Webhook URL
 * @param payload 送信するメッセージオブジェクト
 * @returns 処理結果
 */
export async function sendSlackWebhook(
  webhookUrl: string,
  payload: Record<string, unknown>
): Promise<SlackSendResult> {
  const cleanUrl = (webhookUrl || "").trim();
  if (!cleanUrl) {
    return {
      ok: false,
      error: "Slack Webhook URLが指定されていません。",
    };
  }

  // 有効なSlack Incoming Webhook URLのみ許可（SSRF防止＆URL貼り間違い検知）
  if (!cleanUrl.startsWith("https://hooks.slack.com/services/")) {
    return {
      ok: false,
      error:
        "有効なSlack Incoming Webhook URL（https://hooks.slack.com/services/...）を指定してください。",
    };
  }

  try {
    const res = await fetch(cleanUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        ok: false,
        error: `Slack送信失敗 (${res.status}): ${errText}`,
      };
    }

    return { ok: true, statusText: "送信完了" };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Slack通信エラーが発生しました。",
    };
  }
}

/**
 * 処理概要：
 * Slack連携テスト用のメッセージを送信する
 */
export async function sendSlackTestMessage(
  webhookUrl: string,
  companyName: string,
  channelName?: string | null
): Promise<SlackSendResult> {
  const payload = {
    text: `🔔 【DevSkillStudio】Slack連携テスト通知 - ${companyName}`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🚀 DevSkillStudio × Slack 連携テスト",
          emoji: true,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*対象企業:* ${companyName}\n*連携チャンネル:* \`${channelName || "指定チャンネル"}\`\n*送信日時:* ${new Date().toLocaleString("ja-JP")}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "✅ 管理者Slackワークスペースへの通知連携が正常に疎通しました。\n受講生の週次進捗ダイジェストや目標マイルストーンの遅れアラートがこのチャンネルへ配信されます。",
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "DevSkillStudio Training Management System",
          },
        ],
      },
    ],
  };

  return sendSlackWebhook(webhookUrl, payload);
}

/**
 * 処理概要：
 * 企業の受講生進捗ダイジェスト通知をSlackへ送信する
 */
export async function sendCompanyDigestMessage(
  webhookUrl: string,
  companyName: string,
  students: StudentAnalyticsRecord[],
  milestones: TrainingMilestone[] = [],
  channelName?: string | null
): Promise<SlackSendResult> {
  const total = students.length;
  const delayedStudents = students.filter((s) => s.isDelayed);
  const onTrackCount = total - delayedStudents.length;
  const avgProgress =
    total > 0
      ? Math.round(students.reduce((a, c) => a + c.progressPercent, 0) / total)
      : 0;

  // 直近のアクティブなマイルストーン
  const todayStr = new Date().toISOString().slice(0, 10);
  const upcomingMilestone =
    milestones.find(
      (m) => m.target_days_offset != null || m.target_date >= todayStr
    ) || milestones[0];

  const blocks: unknown[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `📢 【研修進捗速報】${companyName}`,
        emoji: true,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*👥 所属受講生数:* ${total} 名`,
        },
        {
          type: "mrkdwn",
          text: `*📈 全体平均進捗:* *${avgProgress}%*`,
        },
        {
          type: "mrkdwn",
          text: `*🟢 順調:* ${onTrackCount} 名`,
        },
        {
          type: "mrkdwn",
          text: `*🔴 要フォロー（遅れ）:* *${delayedStudents.length} 名*`,
        },
      ],
    },
  ];

  if (upcomingMilestone) {
    const deadlineLabel =
      upcomingMilestone.target_days_offset != null
        ? `登録から ${upcomingMilestone.target_days_offset}日後`
        : upcomingMilestone.target_date;
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `🎯 *直近の目標マイルストーン:* *${upcomingMilestone.title}*\n・目標目安: \`${deadlineLabel}\` ｜ 目標クリア数: \`${upcomingMilestone.target_problem_count}問\``,
      },
    });
  }

  if (delayedStudents.length > 0) {
    const delayedListText = delayedStudents
      .map(
        (s) =>
          `• *${s.fullName}* (${s.progressPercent}% / ${s.completedProblems}問完了)\n  └ 理由: _${s.delayReason || "進捗停滞中"}_`
      )
      .join("\n");

    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `⚠️ *要フォロー受講生一覧:*\n${delayedListText}`,
      },
    });
  } else {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: "✨ *現在、遅れアラートの受講生はいません。全員順調に進捗しています！*",
      },
    });
  }

  blocks.push({
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: `配信先チャンネル: ${channelName || "専用チャンネル"} ｜ 配信日時: ${new Date().toLocaleString("ja-JP")}`,
      },
    ],
  });

  const payload = {
    text: `【DevSkillStudio】${companyName}の研修進捗ダイジェスト（平均進捗: ${avgProgress}%）`,
    blocks,
  };

  return sendSlackWebhook(webhookUrl, payload);
}

/**
 * 処理概要：
 * 受講生からの問題別質問を企業の管理者Slackチャンネルへ即時通知する
 */
export async function sendSlackQuestionAlert(params: {
  webhookUrl: string;
  companyName: string;
  studentName: string;
  problemTitle: string;
  questionText: string;
  codeSnippet?: string;
}): Promise<SlackSendResult> {
  const snippetPreview = params.codeSnippet
    ? params.codeSnippet.slice(0, 600)
    : "";

  const blocks: unknown[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `🙋 受講生からの質問が届きました（${params.companyName}）`,
        emoji: true,
      },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*受講生:* ${params.studentName}` },
        { type: "mrkdwn", text: `*対象問題:* ${params.problemTitle}` },
      ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*質問内容:*\n${params.questionText}`,
      },
    },
  ];

  if (snippetPreview) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*提出時点のコード抜粋:*\n\`\`\`\n${snippetPreview}\n\`\`\``,
      },
    });
  }

  return sendSlackWebhook(params.webhookUrl, {
    text: `🙋 【質問】${params.studentName}（${params.problemTitle}）: ${params.questionText}`,
    blocks,
  });
}

/**
 * Slack Bot API（chat.postMessage）で質問を投稿し、スレッド同期用の channelId と threadTs を取得する
 */
export async function postSlackBotQuestion(params: {
  botToken: string;
  channelId: string;
  companyName: string;
  studentName: string;
  problemTitle: string;
  questionText: string;
  codeSnippet?: string;
}): Promise<{
  ok: boolean;
  channelId?: string;
  threadTs?: string;
  error?: string;
}> {
  const snippetPreview = params.codeSnippet
    ? params.codeSnippet.slice(0, 600)
    : "";

  const blocks: unknown[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `🙋 受講生からの質問が届きました（${params.companyName}）`,
        emoji: true,
      },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*受講生:* ${params.studentName}` },
        { type: "mrkdwn", text: `*対象問題:* ${params.problemTitle}` },
      ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*質問内容:*\n${params.questionText}`,
      },
    },
  ];

  if (snippetPreview) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*提出時点のコード抜粋:*\n\`\`\`\n${snippetPreview}\n\`\`\``,
      },
    });
  }

  blocks.push({
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: "💡 このメッセージのスレッドに返信（テキスト・画像添付OK）すると、受講生画面に自動で回答が表示されます。",
      },
    ],
  });

  try {
    const res = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${params.botToken}`,
      },
      body: JSON.stringify({
        channel: params.channelId,
        text: `🙋 【質問】${params.studentName}（${params.problemTitle}）: ${params.questionText}`,
        blocks,
      }),
    });
    const data = (await res.json()) as {
      ok?: boolean;
      channel?: string;
      ts?: string;
      error?: string;
    };
    if (!data.ok) {
      return { ok: false, error: data.error || "Slack Bot投稿エラー" };
    }
    return { ok: true, channelId: data.channel, threadTs: data.ts };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Slack Bot通信エラー",
    };
  }
}

/**
 * 受講生の追加質問を既存のSlackスレッドへ投稿する
 */
export async function postSlackBotThreadReply(params: {
  botToken: string;
  channelId: string;
  threadTs: string;
  studentName: string;
  replyText: string;
}): Promise<{ ok: boolean; ts?: string; error?: string }> {
  try {
    const res = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${params.botToken}`,
      },
      body: JSON.stringify({
        channel: params.channelId,
        thread_ts: params.threadTs,
        text: `💬 *${params.studentName}（受講生からの返信）:*\n${params.replyText}`,
      }),
    });
    const data = (await res.json()) as {
      ok?: boolean;
      ts?: string;
      error?: string;
    };
    if (!data.ok) {
      return { ok: false, error: data.error || "Slackスレッド返信エラー" };
    }
    return { ok: true, ts: data.ts };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Slack Bot通信エラー",
    };
  }
}

/**
 * Slack Event API リクエスト署名（HMAC-SHA256）の検証
 */
export function verifySlackSignature(params: {
  signingSecret: string;
  timestamp: string | null;
  rawBody: string;
  signature: string | null;
}): boolean {
  if (!params.signingSecret || !params.timestamp || !params.signature) {
    return false;
  }
  const tsNum = Number(params.timestamp);
  if (!Number.isFinite(tsNum)) return false;
  // リプレイ攻撃防止（±5分以内）
  if (Math.abs(Math.floor(Date.now() / 1000) - tsNum) > 300) {
    return false;
  }
  const sigBase = `v0:${params.timestamp}:${params.rawBody}`;
  const computed =
    "v0=" +
    crypto
      .createHmac("sha256", params.signingSecret)
      .update(sigBase, "utf8")
      .digest("hex");

  const a = Buffer.from(computed, "utf8");
  const b = Buffer.from(params.signature, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * SlackユーザーIDから講師の表示名を取得する
 */
export async function fetchSlackUserName(
  botToken: string,
  slackUserId: string
): Promise<string> {
  try {
    const res = await fetch(
      `https://slack.com/api/users.info?user=${encodeURIComponent(slackUserId)}`,
      {
        headers: { Authorization: `Bearer ${botToken}` },
      }
    );
    const data = (await res.json()) as {
      ok?: boolean;
      user?: {
        real_name?: string;
        profile?: { display_name?: string; real_name?: string };
      };
    };
    if (data.ok && data.user) {
      return (
        data.user.profile?.display_name ||
        data.user.profile?.real_name ||
        data.user.real_name ||
        "担当講師"
      );
    }
  } catch {
    // ignore
  }
  return "担当講師";
}

/**
 * Slackのプライベート画像URLをBot Tokenでダウンロードする
 */
export async function downloadSlackFileBuffer(
  botToken: string,
  privateUrl: string
): Promise<{ buffer: Buffer; contentType: string } | null> {
  try {
    if (!privateUrl.startsWith("https://files.slack.com/")) {
      return null;
    }
    const res = await fetch(privateUrl, {
      headers: { Authorization: `Bearer ${botToken}` },
    });
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/png";
    return { buffer: Buffer.from(arrayBuffer), contentType };
  } catch {
    return null;
  }
}
