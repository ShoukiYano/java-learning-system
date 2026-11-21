/**
 * ファイル概要：
 * Vercel Cron 定期実行エンドポイント（GET /api/cron/slack-digest）
 * 毎週月曜 09:00 JST（0 0 * * 1 UTC）に、Slack Webhook が登録されている全企業の
 * 専用チャンネルへ受講生進捗ダイジェストを自動配信します。
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getAdminCompaniesList,
  getCompanySlackSettingsFromDb,
  getMilestonesFromDb,
  getStudentsAnalyticsFromDb,
} from "@/lib/data-service";
import { sendCompanyDigestMessage } from "@/lib/slack";
import { recordAuditLog } from "@/lib/audit-log";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // CRON_SECRET による認証（本番環境で未設定の場合はフェイルクローズで401拒否）
    const cronSecret = process.env.CRON_SECRET;
    if (process.env.NODE_ENV === "production" && !cronSecret) {
      return NextResponse.json(
        { error: "CRON_SECRET が設定されていないため実行できません。" },
        { status: 401 }
      );
    }
    if (cronSecret) {
      const authHeader = request.headers.get("authorization");
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const companies = await getAdminCompaniesList();
    const deliveryResults: Array<{
      companyId: string;
      companyName: string;
      sent: boolean;
      reason?: string;
    }> = [];

    for (const comp of companies) {
      const slack = await getCompanySlackSettingsFromDb(comp.id);
      if (!slack.webhookUrl) {
        deliveryResults.push({
          companyId: comp.id,
          companyName: comp.name,
          sent: false,
          reason: "Webhook URL未設定のためスキップ",
        });
        continue;
      }

      const [students, milestones] = await Promise.all([
        getStudentsAnalyticsFromDb(comp.id),
        getMilestonesFromDb(comp.id),
      ]);

      const sendRes = await sendCompanyDigestMessage(
        slack.webhookUrl,
        comp.name,
        students,
        milestones,
        slack.channelName
      );

      deliveryResults.push({
        companyId: comp.id,
        companyName: comp.name,
        sent: sendRes.ok,
        reason: sendRes.ok ? "配信完了" : sendRes.error,
      });
    }

    const sentCount = deliveryResults.filter((r) => r.sent).length;
    await recordAuditLog({
      actorRole: "system",
      action: "cron_slack_digest",
      targetSummary: `定期Slack進捗速報を自動配信（成功 ${sentCount} / ${companies.length} 社）`,
    });

    return NextResponse.json({
      ok: true,
      executedAt: new Date().toISOString(),
      sentCount,
      deliveryResults,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Cron実行中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
