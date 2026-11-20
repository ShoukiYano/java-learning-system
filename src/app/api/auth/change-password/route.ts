/**
 * ファイル概要：
 * ログイン中ユーザーのパスワード変更 API（POST /api/auth/change-password）
 */

import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/data-service";
import { createClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@/lib/audit-log";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newPassword = String(body.newPassword ?? "").trim();

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "新しいパスワードは8文字以上で入力してください。" },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      await recordAuditLog({
        actorEmail: "demo-user@example.com",
        actorRole: "student",
        action: "change_password",
        targetSummary: "デモモード パスワード変更",
      });
      return NextResponse.json({
        ok: true,
        demo: true,
        message: "パスワードを変更しました（ローカルデモモード）。",
      });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "ログインセッションが確認できません。再ログインしてください。" },
        { status: 401 }
      );
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      return NextResponse.json(
        { error: `パスワード更新に失敗しました: ${error.message}` },
        { status: 400 }
      );
    }

    await recordAuditLog({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: (user.user_metadata?.role as string) ?? "student",
      action: "change_password",
      targetSummary: `${user.email ?? user.id} がパスワードを変更`,
    });

    return NextResponse.json({
      ok: true,
      message: "パスワードを正常に変更しました。",
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "パスワード変更中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
