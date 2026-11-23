/**
 * ファイル概要：
 * API Route Handler 向け共通認証・認可ガードユーティリティ
 *
 * 主な処理：
 * - Supabase有効時に必ず `supabase.auth.getUser()` で実セッションを検証（未認証は 401）
 * - 指定された許可ロール（allowedRoles）と照合（権限外は 403）
 * - デモ環境（Supabase未設定）時のみデモプロファイルで継続動作
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, getCurrentProfile } from "@/lib/data-service";
import type { Profile, UserRole } from "@/types/database";

export type ApiAuthResult =
  | { ok: true; profile: Profile; role: UserRole }
  | { ok: false; response: NextResponse };

/**
 * 企業間データ分離（IDOR対策）チェック：
 * - admin は全社アクセス可
 * - company は actorCompanyId と targetCompanyId が完全一致する場合のみ許可
 * - それ以外は拒否
 */
export function isSameCompanyTenant(
  actorRole: UserRole,
  actorCompanyId: string | null | undefined,
  targetCompanyId: string | null | undefined
): boolean {
  if (actorRole === "admin") return true;
  if (actorRole !== "company") return false;
  if (!actorCompanyId || !targetCompanyId) return false;
  return actorCompanyId === targetCompanyId;
}

export async function requireApiAuth(
  allowedRoles?: UserRole[]
): Promise<ApiAuthResult> {
  const isProd = process.env.NODE_ENV === "production";

  if (!isSupabaseConfigured()) {
    // 本番環境では環境変数欠落時のデモ認証バイパスを完全禁止（フェイルクローズ：DEBT-002対策）
    if (isProd) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "認証基盤が正しく構成されていません。管理者へお問い合わせください。" },
          { status: 503 }
        ),
      };
    }
    const demoProfile = await getCurrentProfile();
    const role: UserRole = allowedRoles?.[0] ?? demoProfile.role;
    return { ok: true, profile: { ...demoProfile, role }, role };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "認証が必要です。ログインし直してください。" },
          { status: 401 }
        ),
      };
    }

    const { data: dbProfile } = await supabase
      .from("profiles")
      .select("*, companies(*)")
      .eq("id", user.id)
      .maybeSingle();

    const metaRole = user.user_metadata?.role as UserRole | undefined;
    // 本番環境ではメールアドレスによるロールフォールバックを行わず、DB/Authの正式ロールのみ採用（DEBT-002対策）
    const emailBasedRole: UserRole | undefined = isProd
      ? undefined
      : user.email === "admin@example.com"
      ? "admin"
      : user.email === "company@example.com"
      ? "company"
      : undefined;

    const role: UserRole =
      (dbProfile?.role as UserRole) ?? metaRole ?? emailBasedRole ?? "student";

    if (allowedRoles && !allowedRoles.includes(role)) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "この操作を実行する権限がありません。" },
          { status: 403 }
        ),
      };
    }

    const profile: Profile = (dbProfile as Profile) ?? {
      id: user.id,
      email: user.email ?? "",
      full_name: (user.user_metadata?.full_name as string) ?? "ユーザー",
      role,
      company_id: null,
      avatar_url: null,
      streak_days: 0,
      last_study_date: null,
      last_login_at: null,
      created_at: new Date().toISOString(),
    };

    return { ok: true, profile, role };
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "認証情報の検証に失敗しました。" },
        { status: 401 }
      ),
    };
  }
}
