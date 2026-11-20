"use client";

/**
 * ファイル概要：
 * ログアウト実行ボタンコンポーネント
 *
 * 主な処理：
 * - Supabase Auth の signOut API を呼び出してセッションを破棄
 * - 指定のリダイレクト先パス（デフォルト: "/"）へ遷移し、ルーターをリフレッシュ
 */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";

export function SignOutButton({
  redirectPath = "/",
}: {
  redirectPath?: string;
}) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      // 1. サーバー側ログアウトAPIでセッションCookie破棄＆監査ログ記録
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    try {
      // 2. ブラウザ側のSupabaseセッションも確実に破棄
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // 未接続時でも指定画面へ遷移
    }
    // 3. Next.jsクライアントルーターキャッシュを残さないようハード遷移
    if (typeof window !== "undefined") {
      window.location.href = redirectPath;
    } else {
      router.push(redirectPath);
      router.refresh();
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={signingOut}
      onClick={handleSignOut}
      className="text-slate-400 hover:text-slate-600"
      title="ログアウト"
    >
      {signingOut ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="sr-only md:not-sr-only md:text-xs">
            ログアウト中...
          </span>
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          <span className="sr-only md:not-sr-only md:text-xs">ログアウト</span>
        </>
      )}
    </Button>
  );
}
