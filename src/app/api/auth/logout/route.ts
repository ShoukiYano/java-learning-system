/**
 * ファイル概要：
 * サーバー側ログアウト Route Handler（POST /api/auth/logout）
 *
 * 主な処理：
 * - Supabase Auth のサーバー側セッションCookieを確実に破棄
 * - 監査ログ（audit_logs）へログアウト履歴を記録
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/data-service";
import { recordAuditLog } from "@/lib/audit-log";

export async function POST() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, full_name")
          .eq("id", user.id)
          .maybeSingle();

        await recordAuditLog({
          actorId: user.id,
          actorEmail: user.email ?? null,
          actorRole: (profile?.role as string) ?? "student",
          action: "logout",
          targetSummary: `${profile?.full_name ?? user.email ?? "ユーザー"} がログアウトしました`,
        });
      }

      await supabase.auth.signOut();
    }

    const res = NextResponse.json({ ok: true });
    res.headers.set("Cache-Control", "no-store");
    // ログアウト時に管理者・企業ゲートCookieも即座に破棄（共有PCリスク低減）
    res.cookies.set("dss_admin_gate", "", { path: "/admin", maxAge: 0, httpOnly: true, sameSite: "strict" });
    res.cookies.set("dss_company_gate", "", { path: "/company", maxAge: 0, httpOnly: true, sameSite: "strict" });
    return res;
  } catch {
    return NextResponse.json({ ok: true });
  }
}
