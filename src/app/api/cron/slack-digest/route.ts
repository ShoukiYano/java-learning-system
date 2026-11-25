/**
 * ファイル概要：
 * Vercel Cron 定期実行エンドポイント（GET /api/cron/slack-digest）
 * 毎週頭 09:00 JST（0 0 * * 1-5 UTC で平日毎朝起動し、日本の祝日・振替休日・国民の休日は
 * 翌営業日へ自動スライド）に、Slack Webhook が登録されている全企業の
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
import { isFirstBusinessDayOfWeekJst } from "@/lib/jp-holidays";
import { timingSafeStringEqual } from "@/lib/security-utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // CRON_SECRET による定数時間認証（本番環境で未設定の場合はフェイルクローズで401拒否）
    const cronSecret = process.env.CRON_SECRET?.trim() || "";
    if (process.env.NODE_ENV === "production" && !cronSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (cronSecret) {
      const authHeader = request.headers.get("authorization") ?? "";
      if (!timingSafeStringEqual(authHeader, `Bearer ${cronSecret}`)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // 週の初回営業日チェック（月曜が祝日なら火曜、連休なら次の平日 09:00 JST に配信）
    // 手動テスト用に ?force=true が指定された場合のみスキップ判定をバイパス
    const force = request.nextUrl.searchParams.get("force") === "true";
    const scheduleCheck = isFirstBusinessDayOfWeekJst(new Date());
    if (!force && !scheduleCheck.shouldRun) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        jstDate: scheduleCheck.jstDate,
        reason: scheduleCheck.reason,
      });
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
    console.error("[GET /api/cron/slack-digest] error:", err);
    return NextResponse.json(
      { error: "Cron実行中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
