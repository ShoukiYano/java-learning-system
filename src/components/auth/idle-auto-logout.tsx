"use client";

/**
 * ファイル概要：
 * 無操作（アイドル）自動ログアウトコンポーネント
 *
 * 主な処理：
 * - マウス・キーボード・スクロール・タップ操作を監視し、最終操作時刻を記録（同一ブラウザ内の複数タブ間でも同期）
 * - 無操作が指定時間（デフォルト60分）に達したら、サーバー側ログアウトAPI（POST /api/auth/logout）＋クライアント側 signOut を実行し、ログイン画面へ自動遷移
 */

import { useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "dss_last_activity_at";

interface IdleAutoLogoutProps {
  redirectPath: string;
  timeoutMinutes?: number;
}

export function IdleAutoLogout({
  redirectPath,
  timeoutMinutes = 60,
}: IdleAutoLogoutProps) {
  const timeoutMs = timeoutMinutes * 60 * 1000;
  const lastActivityRef = useRef<number>(Date.now());
  const loggingOutRef = useRef<boolean>(false);

  const recordActivity = useCallback(() => {
    const now = Date.now();
    // 10秒以内の連続イベントはスロットリングして負荷を抑制
    if (now - lastActivityRef.current < 10_000) return;
    lastActivityRef.current = now;
    try {
      window.localStorage.setItem(STORAGE_KEY, String(now));
    } catch {
      // ignore storage errors
    }
  }, []);

  const performLogout = useCallback(async () => {
    if (loggingOutRef.current) return;
    loggingOutRef.current = true;
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    const separator = redirectPath.includes("?") ? "&" : "?";
    window.location.href = `${redirectPath}${separator}reason=idle_timeout`;
  }, [redirectPath]);

  useEffect(() => {
    const now = Date.now();
    lastActivityRef.current = now;
    try {
      window.localStorage.setItem(STORAGE_KEY, String(now));
    } catch {
      // ignore
    }

    const events: Array<keyof WindowEventMap> = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];
    for (const ev of events) {
      window.addEventListener(ev, recordActivity, { passive: true });
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const parsed = Number(e.newValue);
        if (Number.isFinite(parsed) && parsed > lastActivityRef.current) {
          lastActivityRef.current = parsed;
        }
      }
    };
    window.addEventListener("storage", onStorage);

    const checkIdle = () => {
      if (loggingOutRef.current) return;
      let latest = lastActivityRef.current;
      try {
        const stored = Number(window.localStorage.getItem(STORAGE_KEY));
        if (Number.isFinite(stored) && stored > latest) {
          latest = stored;
          lastActivityRef.current = stored;
        }
      } catch {
        // ignore
      }

      if (Date.now() - latest >= timeoutMs) {
        performLogout();
      }
    };

    const interval = setInterval(checkIdle, 15_000);
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        checkIdle();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      for (const ev of events) {
        window.removeEventListener(ev, recordActivity);
      }
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [timeoutMs, recordActivity, performLogout]);

  return null;
}
