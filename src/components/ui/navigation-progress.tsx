"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  // URL（パスまたはクエリ）の遷移が完了したらバーを100%にして消す
  useEffect(() => {
    setIsNavigating(false);
    setProgress(100);
    const timeout = window.setTimeout(() => {
      setProgress(0);
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [pathname, searchParams]);

  // ページ内の <a> リンククリックを検知した瞬間にプログレスバーを開始する
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      const targetAttr = target.getAttribute("target");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("http") ||
        targetAttr === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // 現在のURLと異なるパスへの遷移なら即座にローディング開始
      const currentFull = window.location.pathname + window.location.search;
      if (href !== currentFull && href !== window.location.pathname) {
        setIsNavigating(true);
        setProgress(25);
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  // 遷移中にプログレスバーを少しずつ進める
  useEffect(() => {
    if (!isNavigating) return;
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 88) return prev;
        return prev + Math.max(2, Math.round((90 - prev) * 0.18));
      });
    }, 150);
    return () => window.clearInterval(interval);
  }, [isNavigating]);

  if (progress === 0 && !isNavigating) return null;

  return (
    <>
      {/* 画面最上部の高速プログレスバー */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-emerald-400 to-indigo-500 shadow-[0_0_12px_rgba(59,130,246,0.9)] transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 右下のスマートな読み込み中インジケーター */}
      {isNavigating && (
        <div className="fixed bottom-5 right-5 z-[9999] flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/95 text-white text-xs font-semibold shadow-xl border border-slate-700/80 animate-in fade-in duration-150 pointer-events-none">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
          <span>画面を読み込み中...</span>
        </div>
      )}
    </>
  );
}
