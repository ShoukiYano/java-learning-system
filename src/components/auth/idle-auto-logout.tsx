"use client";

/**
 * ファイル概要：
 * 無操作（アイドル）自動ログアウトコンポーネント
 *
 * 主な処理：
 * - マウス・キーボード・スクロール・タップ操作を監視し、最終操作時刻を記録（同一ブラウザ内の複数タブ間でも同期）
 * - 無操作が指定時間（デフォルト60分）に達したら、サーバー側ログアウトAPI（POST /api/auth/logout）＋クライアント側 signOut を実行し、ログイン画面へ自動遷移
 * - ログアウト5分前からは画面右下にカウントダウン警告バナーを表示（「操作を続ける」で即延長可能）
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Clock, LogOut } from "lucide-react";

const STORAGE_KEY = "dss_last_activity_at";

interface IdleAutoLogoutProps {
  redirectPath: string;
  timeoutMinutes?: number;
  warningMinutesBefore?: number;
}

export function IdleAutoLogout({
  redirectPath,
  timeoutMinutes = 60,
  warningMinutesBefore = 5,
}: IdleAutoLogoutProps) {
  const timeoutMs = timeoutMinutes * 60 * 1000;
  const warningMs = Math.max(1, warningMinutesBefore) * 60 * 1000;

  const lastActivityRef = useRef<number>(Date.now());
  const loggingOutRef = useRef<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  const recordActivity = useCallback(() => {
    const now = Date.now();
    // 10秒以内の連続イベントはスロットリングして負荷を抑制
    if (now - lastActivityRef.current < 10_000) return;
    lastActivityRef.current = now;
    setRemainingSeconds(null);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(now));
    } catch {
      // ignore storage errors
    }
  }, []);

  const keepAlive = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;
    setRemainingSeconds(null);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(now));
    } catch {
      // ignore
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
    // 初期マウント時に現在時刻を最終操作時刻として記録
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
          setRemainingSeconds(null);
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

      const elapsed = Date.now() - latest;
      if (elapsed >= timeoutMs) {
        performLogout();
        return;
      }

      const remain = timeoutMs - elapsed;
      if (remain <= warningMs) {
        setRemainingSeconds(Math.max(1, Math.ceil(remain / 1000)));
      } else {
        setRemainingSeconds(null);
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
  }, [timeoutMs, warningMs, recordActivity, performLogout]);

  if (remainingSeconds === null) return null;

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl border border-amber-300 bg-amber-50 shadow-2xl p-4 print:hidden">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
          <Clock className="h-4 w-4" />
        </div>
        <div className="flex-1 space-y-1.5">
          <div className="text-xs font-extrabold text-amber-900">
            まもなく自動ログアウトされます
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            操作がない状態が続いています。あと{" "}
            <strong>
              {mins > 0 ? `${mins}分${secs}秒` : `${secs}秒`}
            </strong>{" "}
            で自動的にログアウトされます。
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={keepAlive}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition"
            >
              操作を続ける
            </button>
            <button
              type="button"
              onClick={performLogout}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white hover:bg-amber-100 text-amber-900 text-xs font-semibold transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              今すぐログアウト
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
