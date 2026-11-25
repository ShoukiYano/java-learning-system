/**
 * ファイル概要：
 * 現在の認証セッション状態確認 API（GET /api/auth/session）
 * ログイン画面で「別ロールとしてログイン中」の注意バナーを表示するために使用します。
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/data-service";
import type { UserRole } from "@/types/database";

const VALID_ROLES: ReadonlySet<UserRole> = new Set([
  "admin",
  "company",
  "student",
]);

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ authenticated: false });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .maybeSingle();

    if (
      profileError ||
      !profile?.role ||
      !VALID_ROLES.has(profile.role as UserRole)
    ) {
      const unauthRes = NextResponse.json({ authenticated: false });
      unauthRes.headers.set("Cache-Control", "no-store");
      return unauthRes;
    }

    const role = profile.role as UserRole;

    const res = NextResponse.json({
      authenticated: true,
      role,
      email: user.email ?? "",
      fullName: profile.full_name ?? "",
    });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
