import React from "react";
import { Loader2, Code2 } from "lucide-react";

export default function GlobalRootLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-4">
      <div className="h-12 w-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shadow-lg">
        <Code2 className="h-6 w-6 text-blue-400" />
      </div>
      <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-200">
        <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
        <span>画面を読み込んでいます...</span>
      </div>
    </div>
  );
}
