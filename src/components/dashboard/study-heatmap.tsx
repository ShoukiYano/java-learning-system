"use client";

import React from "react";
import { StudyLog } from "@/types/database";

// GitHub風の学習カレンダー（過去14週間＝98日分のヒートマップ草表示）
export function StudyHeatmap({ logs }: { logs: StudyLog[] }) {
  const logMap = new Map<string, StudyLog>();
  for (const l of logs) {
    logMap.set(l.study_date, l);
  }

  const weeks = 14;
  const daysPerWeek = 7;
  const totalDays = weeks * daysPerWeek;
  const today = new Date();

  const cells: {
    dateStr: string;
    minutes: number;
    problems: number;
  }[] = [];

  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const entry = logMap.get(dateStr);
    cells.push({
      dateStr,
      minutes: entry?.minutes ?? 0,
      problems: entry?.problems_solved ?? 0,
    });
  }

  const getIntensityClass = (minutes: number) => {
    if (minutes <= 0) return "bg-slate-200 border-slate-300/60";
    if (minutes < 20) return "bg-emerald-200 border-emerald-300";
    if (minutes < 40) return "bg-emerald-400 border-emerald-500";
    if (minutes < 60) return "bg-emerald-500 border-emerald-600";
    return "bg-emerald-700 border-emerald-800";
  };

  const columns: typeof cells[] = [];
  for (let w = 0; w < weeks; w++) {
    columns.push(cells.slice(w * 7, (w + 1) * 7));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        {columns.map((col, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-1.5">
            {col.map((cell) => (
              <div
                key={cell.dateStr}
                title={`${cell.dateStr}: 学習 ${cell.minutes}分 / クリア ${cell.problems}問`}
                className={`h-3.5 w-3.5 rounded-[3px] border transition hover:scale-125 ${getIntensityClass(
                  cell.minutes
                )}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span>過去14週間の学習アクティビティ</span>
        <div className="flex items-center gap-1">
          <span>少</span>
          <span className="h-3 w-3 rounded-[2px] bg-slate-200 inline-block" />
          <span className="h-3 w-3 rounded-[2px] bg-emerald-200 inline-block" />
          <span className="h-3 w-3 rounded-[2px] bg-emerald-400 inline-block" />
          <span className="h-3 w-3 rounded-[2px] bg-emerald-500 inline-block" />
          <span className="h-3 w-3 rounded-[2px] bg-emerald-700 inline-block" />
          <span>多</span>
        </div>
      </div>
    </div>
  );
}
