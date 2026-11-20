/**
 * ファイル概要：
 * パスワード再設定メール送信 API（POST /api/auth/forgot-password）
 */

import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/data-service";
import { createClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@/lib/audit-log";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "有効なメールアドレスを入力してください。" },
        { status: 400 }
      );
    }

    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/student/profile`,
      });
      if (error) {
        return NextResponse.json(
          { error: `再設定メールの送信に失敗しました: ${error.message}` },
          { status: 400 }
        );
      }
    }

    await recordAuditLog({
      actorEmail: email,
      actorRole: "guest",
      action: "forgot_password_request",
      targetSummary: `${email} 宛にパスワード再設定メールを送信`,
    });

    return NextResponse.json({
      ok: true,
      message:
        "ご入力のメールアドレス宛にパスワード再設定用の案内を送信しました。メールボックスをご確認ください。",
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "パスワード再設定リクエスト処理中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
