/**
 * ファイル概要：
 * 企業別設定（遅れアラート基準日数 delay_alert_days）保存 API（POST /api/company/settings）
 */

import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/data-service";
import { requireApiAuth } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@/lib/audit-log";

declare global {
  // eslint-disable-next-line no-var
  var __demoCompanyDelayDays: Record<string, number> | undefined;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(["company", "admin"]);
    if (!auth.ok) return auth.response;

    const body = await request.json();
    const profile = auth.profile;
    // 企業担当者は必ず自社テナントIDに固定（他社設定の書き換えを防止）
    const companyId =
      auth.role === "company"
        ? profile.company_id || "00000000-0000-4000-8000-000000000001"
        : String(body.companyId ?? "").trim() ||
          profile.company_id ||
          "00000000-0000-4000-8000-000000000001";
    const delayAlertDays = Math.max(
      1,
      Math.min(30, Number(body.delayAlertDays ?? 5))
    );

    if (!companyId) {
      return NextResponse.json(
        { error: "companyId が必要です。" },
        { status: 400 }
      );
    }

    if (!globalThis.__demoCompanyDelayDays) {
      globalThis.__demoCompanyDelayDays = {};
    }
    globalThis.__demoCompanyDelayDays[companyId] = delayAlertDays;

    if (isSupabaseConfigured()) {
      const db =
        process.env.SUPABASE_SERVICE_ROLE_KEY &&
        !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
          ? createAdminClient()
          : await createClient();
      const { error: upErr } = await db
        .from("companies")
        .update({ delay_alert_days: delayAlertDays })
        .eq("id", companyId);
      if (upErr) {
        return NextResponse.json(
          {
            error: `設定のDB保存に失敗しました: ${upErr.message}`,
          },
          { status: 500 }
        );
      }
    }

    const caller = auth.profile;
    await recordAuditLog({
      actorId: caller.id,
      actorEmail: caller.email,
      actorRole: caller.role,
      action: "update_delay_alert_threshold",
      targetSummary: `遅れアラート基準を「${delayAlertDays}日未ログイン」へ更新`,
    });

    return NextResponse.json({
      ok: true,
      delayAlertDays,
      message: `遅れアラート基準を「${delayAlertDays}日未ログイン」に保存しました。`,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "設定の保存中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
