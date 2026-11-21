/**
 * ファイル概要：
 * Supabase Auth メール認証・パスワード再設定コールバックハンドラー（GET /auth/callback）
 *
 * 主な処理：
 * - メール内リンクに含まれる `code`（PKCE）または `token_hash` + `type` を検証しセッションを確立
 * - オープンリダイレクト防止チェックを行った上で指定の遷移先（デフォルト `/student`）へリダイレクト
 */

import { NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

function getSafeNextPath(rawNext: string | null): string {
  if (!rawNext) return "/student";
  const trimmed = rawNext.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("\\")) {
    return "/student";
  }
  return trimmed;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const nextPath = getSafeNextPath(searchParams.get("next"));

  try {
    const supabase = await createClient();

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${nextPath}`);
      }
    } else if (tokenHash && type) {
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash: tokenHash,
      });
      if (!error) {
        return NextResponse.redirect(`${origin}${nextPath}`);
      }
    }
  } catch (err) {
    console.error("[GET /auth/callback] error:", err);
  }

  return NextResponse.redirect(
    `${origin}/student/login?error=auth_callback_failed`
  );
}
