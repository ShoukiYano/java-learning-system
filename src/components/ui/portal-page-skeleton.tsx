import React from "react";
import { Loader2 } from "lucide-react";

export function PortalPageSkeleton({
  accentColor = "blue",
  label = "データを読み込んでいます...",
}: {
  accentColor?: "blue" | "emerald" | "indigo";
  label?: string;
}) {
  const spinnerColor =
    accentColor === "emerald"
      ? "text-emerald-600"
      : accentColor === "indigo"
      ? "text-indigo-600"
      : "text-blue-600";

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl space-y-6 animate-pulse">
      {/* 上部ステータスメッセージ */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-64 rounded-lg bg-slate-200" />
          <div className="h-4 w-96 max-w-full rounded bg-slate-200/80" />
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border shadow-sm text-xs font-semibold text-slate-600">
          <Loader2 className={`h-4 w-4 animate-spin ${spinnerColor}`} />
          <span>{label}</span>
        </div>
      </div>

      {/* 3カラムKPIカードスケルトン */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border bg-white p-6 space-y-3 shadow-sm"
          >
            <div className="h-4 w-36 rounded bg-slate-200" />
            <div className="h-8 w-24 rounded-lg bg-slate-200" />
            <div className="h-2.5 w-full rounded-full bg-slate-100" />
          </div>
        ))}
      </div>

      {/* メインコンテンツ領域スケルトン */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 rounded-xl border bg-white p-6 space-y-4 shadow-sm">
          <div className="h-5 w-44 rounded bg-slate-200" />
          <div className="h-64 w-full rounded-xl bg-slate-100" />
        </div>
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-xl border bg-white p-6 space-y-4 shadow-sm">
            <div className="h-5 w-40 rounded bg-slate-200" />
            <div className="h-28 w-full rounded-xl bg-slate-100" />
          </div>
          <div className="rounded-xl border bg-white p-6 space-y-3 shadow-sm">
            <div className="h-5 w-48 rounded bg-slate-200" />
            <div className="h-16 w-full rounded-xl bg-slate-100" />
            <div className="h-16 w-full rounded-xl bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
