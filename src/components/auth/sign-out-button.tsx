"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // 未接続時でもログイン画面へ遷移
    }
    router.push("/login");
    router.refresh();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSignOut}
      className="text-slate-500 hover:text-slate-900"
      title="ログアウト"
    >
      <LogOut className="h-4 w-4" />
      <span className="sr-only md:not-sr-only md:text-xs">ログアウト</span>
    </Button>
  );
}
