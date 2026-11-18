"use client";

import React, { useState } from "react";
import { StudyLog } from "@/types/database";
import { ChevronLeft, ChevronRight, Calendar, LayoutGrid } from "lucide-react";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function toLocalDateStr(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatJapaneseFullDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const w = WEEKDAYS[dt.getDay()];
  return `${y}年${m}月${d}日（${w}）`;
}

export function StudyHeatmap({ logs }: { logs: StudyLog[] }) {
  const today = new Date();
  const todayStr = toLocalDateStr(today);

  // 表示モード：直感的な「月間カレンダー（日付入り）」と「14週間ヒートマップ（月・曜日ラベル入り）」を切り替え可能
  const [viewMode, setViewMode] = useState<"month" | "heatmap">("month");
  const [currentMonth, setCurrentMonth] = useState<{ year: number; month: number }>({
    year: today.getFullYear(),
    month: today.getMonth(), // 0-indexed
  });
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  const logMap = new Map<string, StudyLog>();
  for (const l of logs) {
    logMap.set(l.study_date, l);
  }

  const getIntensityClass = (minutes: number, isZeroLight = true) => {
    if (minutes <= 0) {
      return isZeroLight
        ? "bg-slate-100 text-slate-500 border-slate-200"
        : "bg-slate-200 border-slate-300/70";
    }
    if (minutes < 20)
      return "bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold";
    if (minutes < 40)
      return "bg-emerald-300 text-emerald-950 border-emerald-400 font-semibold";
    if (minutes < 60)
      return "bg-emerald-500 text-white border-emerald-600 font-bold";
    return "bg-emerald-700 text-white border-emerald-800 font-bold";
  };

  // ===========================================================================
  // 1. 月間カレンダー用データ生成（年月日・曜日・日付数字つき）
  // ===========================================================================
  const firstDayOfMonth = new Date(currentMonth.year, currentMonth.month, 1);
  const lastDayOfMonth = new Date(currentMonth.year, currentMonth.month + 1, 0);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0(日)〜6(土)
  const daysInMonth = lastDayOfMonth.getDate();

  const monthCells: (
    | {
        day: number;
        dateStr: string;
        minutes: number;
        problems: number;
        isToday: boolean;
      }
    | null
  )[] = [];

  for (let i = 0; i < startDayOfWeek; i++) {
    monthCells.push(null);
  }

  let monthTotalMinutes = 0;
  let monthTotalProblems = 0;
  let monthActiveDays = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const dt = new Date(currentMonth.year, currentMonth.month, day);
    const dateStr = toLocalDateStr(dt);
    const entry = logMap.get(dateStr);
    const minutes = entry?.minutes ?? 0;
    const problems = entry?.problems_solved ?? 0;

    if (minutes > 0 || problems > 0) {
      monthActiveDays++;
      monthTotalMinutes += minutes;
      monthTotalProblems += problems;
    }

    monthCells.push({
      day,
      dateStr,
      minutes,
      problems,
      isToday: dateStr === todayStr,
    });
  }

  const prevMonth = () => {
    setCurrentMonth((prev) =>
      prev.month === 0
        ? { year: prev.year - 1, month: 11 }
        : { year: prev.year, month: prev.month - 1 }
    );
  };

  const nextMonth = () => {
    setCurrentMonth((prev) =>
      prev.month === 11
        ? { year: prev.year + 1, month: 0 }
        : { year: prev.year, month: prev.month + 1 }
    );
  };

  // ===========================================================================
  // 2. 14週間ヒートマップ用データ生成（上部に年月ラベル・左に曜日ラベルつき）
  // ===========================================================================
  const weeksCount = 14;
  // 今週の土曜日を右端の基準にする
  const endOfThisWeek = new Date(today);
  endOfThisWeek.setDate(today.getDate() + (6 - today.getDay()));

  const heatmapWeeks: {
    monthLabel: string | null;
    days: {
      dateStr: string;
      minutes: number;
      problems: number;
      isToday: boolean;
      isFuture: boolean;
    }[];
  }[] = [];

  let lastLabeledMonth = -1;

  for (let w = weeksCount - 1; w >= 0; w--) {
    const weekDays: {
      dateStr: string;
      minutes: number;
      problems: number;
      isToday: boolean;
      isFuture: boolean;
    }[] = [];
    let monthLabel: string | null = null;

    for (let dow = 0; dow < 7; dow++) {
      const offsetDays = w * 7 + (6 - dow);
      const d = new Date(endOfThisWeek);
      d.setDate(endOfThisWeek.getDate() - offsetDays);
      const dateStr = toLocalDateStr(d);
      const entry = logMap.get(dateStr);

      if (dow === 0) {
        const m = d.getMonth() + 1;
        if (m !== lastLabeledMonth) {
          monthLabel = `${d.getFullYear()}/${m}月`;
          lastLabeledMonth = m;
        }
      }

      weekDays.push({
        dateStr,
        minutes: entry?.minutes ?? 0,
        problems: entry?.problems_solved ?? 0,
        isToday: dateStr === todayStr,
        isFuture: dateStr > todayStr,
      });
    }

    heatmapWeeks.push({ monthLabel, days: weekDays });
  }

  const selectedLog = logMap.get(selectedDateStr);

  return (
    <div className="space-y-4">
      {/* 上部バー：年月表示 ＆ 表示モード切替 */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
        {viewMode === "month" ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-lg border bg-white hover:bg-slate-50 text-slate-700 transition"
              title="前の月"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-extrabold text-slate-900 min-w-[110px] text-center">
              {currentMonth.year}年 {currentMonth.month + 1}月
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-lg border bg-white hover:bg-slate-50 text-slate-700 transition"
              title="次の月"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentMonth({
                  year: today.getFullYear(),
                  month: today.getMonth(),
                });
                setSelectedDateStr(todayStr);
              }}
              className="ml-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              今月（今日）
            </button>
          </div>
        ) : (
          <div className="text-xs font-bold text-slate-700">
            直近14週間の学習推移（{heatmapWeeks[0]?.days[0]?.dateStr} 〜{" "}
            {todayStr}）
          </div>
        )}

        {/* 表示切替ボタン */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setViewMode("month")}
            className={`px-2.5 py-1 rounded-md font-semibold inline-flex items-center gap-1 transition ${
              viewMode === "month"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            月間カレンダー
          </button>
          <button
            type="button"
            onClick={() => setViewMode("heatmap")}
            className={`px-2.5 py-1 rounded-md font-semibold inline-flex items-center gap-1 transition ${
              viewMode === "heatmap"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            14週草グラフ
          </button>
        </div>
      </div>

      {/* メイン表示エリア */}
      {viewMode === "month" ? (
        <div className="space-y-3">
          {/* 月間サマリーバッジ */}
          <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/80">
            <span className="text-slate-600">
              {currentMonth.month + 1}月の学習日数:{" "}
              <strong className="text-slate-900">{monthActiveDays}日</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">
              月間学習時間:{" "}
              <strong className="text-emerald-700">{monthTotalMinutes}分</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">
              クリア問題数:{" "}
              <strong className="text-blue-700">{monthTotalProblems}問</strong>
            </span>
          </div>

          {/* 曜日ヘッダー */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold">
            {WEEKDAYS.map((w, idx) => (
              <div
                key={w}
                className={
                  idx === 0
                    ? "text-rose-500"
                    : idx === 6
                    ? "text-blue-600"
                    : "text-slate-500"
                }
              >
                {w}
              </div>
            ))}
          </div>

          {/* 日付グリッド */}
          <div className="grid grid-cols-7 gap-1.5">
            {monthCells.map((cell, idx) => {
              if (!cell) {
                return <div key={`empty-${idx}`} className="h-10 rounded-lg" />;
              }
              const isSelected = cell.dateStr === selectedDateStr;
              return (
                <button
                  key={cell.dateStr}
                  type="button"
                  onClick={() => setSelectedDateStr(cell.dateStr)}
                  title={`${formatJapaneseFullDate(cell.dateStr)}: 学習 ${
                    cell.minutes
                  }分 / クリア ${cell.problems}問`}
                  className={`relative h-10 rounded-lg border text-xs flex flex-col items-center justify-center transition hover:scale-105 ${getIntensityClass(
                    cell.minutes,
                    true
                  )} ${
                    cell.isToday
                      ? "ring-2 ring-blue-600 ring-offset-1"
                      : ""
                  } ${isSelected ? "outline outline-2 outline-slate-900" : ""}`}
                >
                  <span className="text-[11px] leading-none">{cell.day}</span>
                  {cell.minutes > 0 && (
                    <span className="text-[9px] leading-none mt-0.5 opacity-90">
                      {cell.minutes}分
                    </span>
                  )}
                  {cell.isToday && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* 14週間ヒートマップ（年月ラベル＋曜日ラベル付き） */
        <div className="overflow-x-auto pb-1">
          <div className="inline-flex flex-col gap-1 min-w-full">
            {/* 上部：年月ラベル行 */}
            <div className="flex items-center gap-1.5 pl-7 text-[10px] font-semibold text-slate-500 h-4">
              {heatmapWeeks.map((week, wIdx) => (
                <div key={wIdx} className="w-5 shrink-0 whitespace-nowrap">
                  {week.monthLabel ?? ""}
                </div>
              ))}
            </div>

            <div className="flex items-start gap-1.5">
              {/* 左端：曜日ラベル列 */}
              <div className="flex flex-col gap-1.5 pr-1 text-[10px] font-semibold text-slate-500 w-6 shrink-0">
                {WEEKDAYS.map((w, idx) => (
                  <div
                    key={w}
                    className={`h-5 flex items-center ${
                      idx === 0
                        ? "text-rose-500"
                        : idx === 6
                        ? "text-blue-600"
                        : ""
                    }`}
                  >
                    {w}
                  </div>
                ))}
              </div>

              {/* マス目本体（各マスの中に日付「日」も小さく表示） */}
              {heatmapWeeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1.5 shrink-0">
                  {week.days.map((cell) => {
                    if (cell.isFuture) {
                      return (
                        <div
                          key={cell.dateStr}
                          className="h-5 w-5 rounded-[4px] bg-slate-50 border border-dashed border-slate-200"
                        />
                      );
                    }
                    const dayNum = Number(cell.dateStr.slice(-2));
                    const isSelected = cell.dateStr === selectedDateStr;
                    return (
                      <button
                        key={cell.dateStr}
                        type="button"
                        onClick={() => setSelectedDateStr(cell.dateStr)}
                        title={`${formatJapaneseFullDate(
                          cell.dateStr
                        )}: 学習 ${cell.minutes}分 / クリア ${cell.problems}問`}
                        className={`h-5 w-5 rounded-[4px] border text-[9px] flex items-center justify-center transition hover:scale-125 ${getIntensityClass(
                          cell.minutes,
                          false
                        )} ${
                          cell.isToday ? "ring-2 ring-blue-600" : ""
                        } ${isSelected ? "outline outline-2 outline-slate-900" : ""}`}
                      >
                        {dayNum}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 選択した年月日の詳細＆色凡例フッター */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border">
          <span className="font-bold text-slate-900">
            📅 {formatJapaneseFullDate(selectedDateStr)}
            {selectedDateStr === todayStr && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">
                今日
              </span>
            )}
          </span>
          <span>：</span>
          <span>
            学習 <strong>{selectedLog?.minutes ?? 0}分</strong> ／ クリア{" "}
            <strong>{selectedLog?.problems_solved ?? 0}問</strong>
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <span>少 (0分)</span>
          <span className="h-3 w-3 rounded-[3px] bg-slate-100 border border-slate-200 inline-block" />
          <span className="h-3 w-3 rounded-[3px] bg-emerald-100 border border-emerald-300 inline-block" />
          <span className="h-3 w-3 rounded-[3px] bg-emerald-300 border border-emerald-400 inline-block" />
          <span className="h-3 w-3 rounded-[3px] bg-emerald-500 border border-emerald-600 inline-block" />
          <span className="h-3 w-3 rounded-[3px] bg-emerald-700 border border-emerald-800 inline-block" />
          <span>多 (60分+)</span>
        </div>
      </div>
    </div>
  );
}
