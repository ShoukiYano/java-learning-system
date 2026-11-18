import React from "react";
import { Loader2, Code2 } from "lucide-react";

export default function ProblemWorkspaceLoading() {
  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-slate-100 animate-pulse">
      {/* 上部バーのスケルトン */}
      <div className="h-12 bg-white border-b px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-5 w-20 rounded bg-slate-200" />
          <div className="h-5 w-56 rounded bg-slate-200" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-28 rounded-md bg-slate-200" />
          <div className="h-8 w-20 rounded-md bg-slate-200" />
          <div className="h-8 w-32 rounded-md bg-emerald-200" />
        </div>
      </div>

      {/* 3ペイン構成のスケルトン */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        <div className="col-span-4 bg-white border-r p-5 space-y-4">
          <div className="h-5 w-32 rounded bg-slate-200" />
          <div className="h-44 w-full rounded-xl bg-slate-100" />
          <div className="h-28 w-full rounded-xl bg-slate-100" />
          <div className="h-24 w-full rounded-xl bg-amber-50/70" />
        </div>
        <div className="col-span-8 flex flex-col bg-slate-900">
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-3">
            <div className="h-12 w-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Code2 className="h-6 w-6 text-blue-400" />
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
              <span>演習環境とテストケースを準備しています...</span>
            </div>
          </div>
          <div className="h-48 bg-slate-950 border-t border-slate-800 p-4 space-y-2">
            <div className="h-4 w-40 rounded bg-slate-800" />
            <div className="h-24 w-full rounded-lg bg-slate-900" />
          </div>
        </div>
      </div>
    </div>
  );
}
