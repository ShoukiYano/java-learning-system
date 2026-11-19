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

  // デモやローカル検証用（実際のSlack URLではない場合）
  if (!cleanUrl.startsWith("https://hooks.slack.com/")) {
    return {
      ok: true,
      simulated: true,
      statusText: "テスト用URLのため送信シミュレーション成功と判定しました。",
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
  const upcomingMilestone = milestones.find((m) => m.target_date >= todayStr) || milestones[0];

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
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `🎯 *直近の目標マイルストーン:* *${upcomingMilestone.title}*\n・目標期日: \`${upcomingMilestone.target_date}\` ｜ 目標クリア数: \`${upcomingMilestone.target_problem_count}問\``,
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
