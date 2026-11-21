"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MessageSquareText, X, ArrowRight } from "lucide-react";

interface UnreadSummary {
  id: string;
  problemTitle: string;
  updatedAt: string;
}

export function StudentQaNotifier({
  initialUnreadCount = 0,
  initialLatestUnread = null,
}: {
  initialUnreadCount?: number;
  initialLatestUnread?: UnreadSummary | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [toast, setToast] = useState<UnreadSummary | null>(null);
  const shownKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      initialUnreadCount > 0 &&
      initialLatestUnread &&
      pathname !== "/student/questions"
    ) {
      const key = `${initialLatestUnread.id}:${initialLatestUnread.updatedAt}`;
      if (shownKeyRef.current !== key) {
        shownKeyRef.current = key;
        setToast(initialLatestUnread);
      }
    }
  }, [initialUnreadCount, initialLatestUnread, pathname]);

  useEffect(() => {
    let active = true;

    const checkUnread = async () => {
      if (!active || document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/student/questions?summary=1", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          ok?: boolean;
          unreadCount?: number;
          latestUnread?: UnreadSummary | null;
        };
        if (!active || !data.ok) return;

        if (data.unreadCount && data.unreadCount > 0 && data.latestUnread) {
          const key = `${data.latestUnread.id}:${data.latestUnread.updatedAt}`;
          if (shownKeyRef.current !== key) {
            shownKeyRef.current = key;
            if (pathname !== "/student/questions") {
              setToast(data.latestUnread);
            }
            router.refresh();
          }
        }
      } catch {
        // ignore transient network errors
      }
    };

    const interval = setInterval(checkUnread, 30000);
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        checkUnread();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      active = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pathname, router]);

  if (!toast || pathname === "/student/questions") return null;

  return (
    <div className="fixed top-16 right-4 z-50 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl border border-indigo-200 bg-white shadow-2xl p-4 animate-in fade-in slide-in-from-top-3 duration-200">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <MessageSquareText className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-extrabold text-indigo-700">
              講師から回答が届きました！
            </span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
              aria-label="閉じる"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed truncate">
            対象：{toast.problemTitle}
          </p>
          <div className="pt-1">
            <Link
              href={`/student/questions?id=${encodeURIComponent(toast.id)}`}
              onClick={() => setToast(null)}
              className="inline-flex items-center gap-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg transition"
            >
              回答を確認する
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
