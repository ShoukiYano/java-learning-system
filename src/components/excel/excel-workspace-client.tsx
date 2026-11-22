"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Table2,
  RotateCcw,
  Send,
  Lightbulb,
  Loader2,
  FunctionSquare,
} from "lucide-react";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { AskInstructorButton } from "@/components/student/ask-instructor-modal";
import {
  colIndexToLetter,
  evaluateExcelSubmission,
  evaluateSheet,
  normalizeCellRef,
  parseExcelProblemSpec,
} from "@/lib/excel/excel-engine";
import type { Hint, Problem, Progress } from "@/types/database";

interface Props {
  problem: Problem;
  hints: Hint[];
  initialProgress: Progress | null;
  nextProblemId: string | null;
  courseId: string;
}

export function ExcelWorkspaceClient({
  problem,
  hints,
  initialProgress,
  nextProblemId,
}: Props) {
  const spec = useMemo(() => parseExcelProblemSpec(problem.starter_code), [problem.starter_code]);

  const targetRefSet = useMemo(() => {
    const s = new Set<string>();
    spec?.targets.forEach((t) => s.add(normalizeCellRef(t.cell)));
    return s;
  }, [spec]);

  const [userCells, setUserCells] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    spec?.targets.forEach((t) => {
      init[normalizeCellRef(t.cell)] = "";
    });
    return init;
  });

  const [selectedCell, setSelectedCell] = useState<string>(() =>
    spec?.targets[0] ? normalizeCellRef(spec.targets[0].cell) : "A1"
  );
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [showHintStep, setShowHintStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(initialProgress?.status === "completed");
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Merge base cells + student inputs and compute live values
  const mergedRaw = useMemo(() => {
    const base = { ...(spec?.cells ?? {}) };
    for (const [k, v] of Object.entries(userCells)) {
      base[k] = v;
    }
    return base;
  }, [spec, userCells]);

  const evaluatedGrid = useMemo(() => evaluateSheet(mergedRaw), [mergedRaw]);

  const liveGrade = useMemo(() => {
    if (!spec) return null;
    return evaluateExcelSubmission(problem.starter_code, JSON.stringify(userCells));
  }, [spec, problem.starter_code, userCells]);

  function updateCell(ref: string, val: string) {
    const norm = normalizeCellRef(ref);
    if (!targetRefSet.has(norm)) return;
    setUserCells((prev) => ({ ...prev, [norm]: val }));
    setSubmitMessage(null);
  }

  function handleReset() {
    const resetObj: Record<string, string> = {};
    spec?.targets.forEach((t) => {
      resetObj[normalizeCellRef(t.cell)] = "";
    });
    setUserCells(resetObj);
    setSubmitMessage(null);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitMessage(null);
    try {
      const res = await fetch("/api/problems/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: problem.id,
          code: JSON.stringify(userCells),
          timeSpentSeconds: 90,
          unlockedHintStep: showHintStep,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitMessage({ type: "error", text: data.error || "提出に失敗しました。" });
        return;
      }
      if (data.allPassed) {
        setCompleted(true);
        setSubmitMessage({
          type: "success",
          text: `🎉 全 ${data.totalCount} セルの数式・計算結果が正解です！この演習をクリアしました！`,
        });
      } else {
        setSubmitMessage({
          type: "error",
          text: `${data.passedCount} / ${data.totalCount} セル正解です。左側のチェック結果を確認して修正しましょう。`,
        });
      }
    } catch {
      setSubmitMessage({ type: "error", text: "通信エラーが発生しました。" });
    } finally {
      setSubmitting(false);
    }
  }

  if (!spec) {
    return (
      <div className="p-8 text-center text-slate-600">
        Excel演習データの読み込みに失敗しました。
      </div>
    );
  }

  const isSelectedEditable = targetRefSet.has(selectedCell);
  const formulaBarValue = isSelectedEditable
    ? userCells[selectedCell] ?? ""
    : String(mergedRaw[selectedCell] ?? "");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white px-5 py-3">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/student/courses"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-emerald-700 transition shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              一覧へ
            </Link>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
              <Table2 className="h-3 w-3" />
              Excel実務演習
            </span>
            <h1 className="text-sm md:text-base font-bold text-slate-900 truncate">
              {problem.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <AskInstructorButton
              problemId={problem.id}
              problemTitle={problem.title}
              contextSnippet={JSON.stringify(userCells, null, 2)}
              contextLabel="入力中のExcel数式を質問に添える"
            />
            {completed && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                クリア済
              </span>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              リセット
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition"
            >
              {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              採点して提出
            </button>
            {nextProblemId && (
              <Link
                href={`/student/problems/${nextProblemId}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
              >
                次へ
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="max-w-[1440px] w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 p-5">
        {/* Left: Instructions + Live Check List + Hints */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <MarkdownRenderer content={problem.description_md} />
          </div>

          {/* Target Cells Live Status */}
          {liveGrade && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  採点チェック（{liveGrade.passedCount} / {liveGrade.totalCount}）
                </h3>
                <span className="text-[11px] text-slate-500">入力と同時にリアルタイム判定</span>
              </div>
              <div className="space-y-2">
                {liveGrade.checks.map((chk) => (
                  <button
                    key={chk.cell}
                    type="button"
                    onClick={() => setSelectedCell(chk.cell)}
                    className={`w-full text-left rounded-xl border p-3 text-xs transition flex items-start gap-2.5 ${
                      chk.passed
                        ? "border-emerald-200 bg-emerald-50/60 text-emerald-900"
                        : "border-slate-200 bg-slate-50/70 hover:border-amber-300 text-slate-800"
                    }`}
                  >
                    {chk.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-bold flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[11px]">
                          {chk.cell}
                        </span>
                        <span className="truncate">{chk.label}</span>
                      </div>
                      <div className="text-[11px] mt-1 opacity-80">{chk.message}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Hints */}
          {hints.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Lightbulb className="h-4 w-4 text-amber-600" />
                  段階的ヒント（{showHintStep}/{hints.length}）
                </span>
                {showHintStep < hints.length && (
                  <button
                    type="button"
                    onClick={() => setShowHintStep((n) => Math.min(hints.length, n + 1))}
                    className="text-xs font-semibold text-amber-800 underline hover:text-amber-950"
                  >
                    次のヒントを開く
                  </button>
                )}
              </div>
              {hints.slice(0, showHintStep).map((h) => (
                <div key={h.id} className="text-xs text-amber-950 bg-white/80 rounded-lg p-2.5 border border-amber-100">
                  <strong>ヒント{h.step_number}:</strong> {h.content_md}
                </div>
              ))}
            </div>
          )}

          {completed && problem.explanation_md && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-emerald-950">
              <div className="font-bold mb-1">💡 クリア解説</div>
              <MarkdownRenderer content={problem.explanation_md} />
            </div>
          )}
        </div>

        {/* Right: Interactive Excel Spreadsheet */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {submitMessage && (
            <div
              className={`rounded-xl border px-4 py-3 text-xs font-semibold ${
                submitMessage.type === "success"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : "border-rose-200 bg-rose-50 text-rose-800"
              }`}
            >
              {submitMessage.text}
            </div>
          )}

          <div className="rounded-2xl border border-slate-300 bg-white shadow-sm overflow-hidden">
            {/* Excel Green Title Bar */}
            <div className="bg-emerald-700 text-white px-4 py-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold">
                <Table2 className="h-4 w-4" />
                <span>{spec.sheetName}.xlsx</span>
              </div>
              <span className="text-emerald-100 text-[11px]">
                黄色のセルをクリックして「=」から始まる数式を入力してください
              </span>
            </div>

            {/* Formula Bar */}
            <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 flex items-center gap-2">
              <div className="w-14 text-center font-mono text-xs font-bold bg-white border border-slate-300 rounded px-2 py-1.5 text-slate-800">
                {selectedCell}
              </div>
              <div className="flex items-center gap-1 text-slate-400 px-1">
                <FunctionSquare className="h-4 w-4 text-emerald-600" />
              </div>
              <input
                type="text"
                value={formulaBarValue}
                disabled={!isSelectedEditable}
                onChange={(e) => updateCell(selectedCell, e.target.value)}
                placeholder={
                  isSelectedEditable
                    ? "例: =SUM(D2:D4) または =VLOOKUP(A2,$D$2:$F$4,2,FALSE)"
                    : "このセルは読み取り専用です（黄色のセルを選択してください）"
                }
                className={`flex-1 font-mono text-sm px-3 py-1.5 rounded border outline-none transition ${
                  isSelectedEditable
                    ? "bg-white border-emerald-400 focus:ring-2 focus:ring-emerald-200 text-slate-900"
                    : "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
                }`}
              />
            </div>

            {/* Spreadsheet Grid */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600">
                    <th className="w-10 border border-slate-300 py-1.5 text-center font-mono text-[11px]"></th>
                    {Array.from({ length: spec.cols }).map((_, cIdx) => (
                      <th
                        key={cIdx}
                        className="min-w-[115px] border border-slate-300 py-1.5 text-center font-mono font-bold text-[11px]"
                      >
                        {colIndexToLetter(cIdx)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: spec.rows }).map((_, rIdx) => {
                    const rowNum = rIdx + 1;
                    const isHeaderRow = spec.headerRows?.includes(rowNum);
                    return (
                      <tr key={rowNum}>
                        <td className="bg-slate-100 border border-slate-300 text-center font-mono text-[11px] text-slate-500 font-semibold py-2">
                          {rowNum}
                        </td>
                        {Array.from({ length: spec.cols }).map((__, cIdx) => {
                          const ref = `${colIndexToLetter(cIdx)}${rowNum}`;
                          const isTarget = targetRefSet.has(ref);
                          const isSelected = selectedCell === ref;
                          const isEditing = editingCell === ref && isTarget;
                          const evalCell = evaluatedGrid[ref];
                          const checkObj = liveGrade?.checks.find((c) => c.cell === ref);

                          let bgClass = isHeaderRow
                            ? "bg-slate-200/70 font-bold text-slate-800"
                            : "bg-white text-slate-800";
                          if (isTarget) {
                            bgClass = checkObj?.passed
                              ? "bg-emerald-50 text-emerald-900 font-semibold"
                              : "bg-amber-50/90 text-slate-900";
                          }

                          return (
                            <td
                              key={ref}
                              onClick={() => {
                                setSelectedCell(ref);
                                if (isTarget) setEditingCell(ref);
                                else setEditingCell(null);
                              }}
                              className={`border border-slate-300 p-0 relative cursor-pointer transition ${bgClass} ${
                                isSelected ? "ring-2 ring-inset ring-emerald-600 z-10" : ""
                              }`}
                            >
                              {isEditing ? (
                                <input
                                  type="text"
                                  autoFocus
                                  value={userCells[ref] ?? ""}
                                  onChange={(e) => updateCell(ref, e.target.value)}
                                  onBlur={() => setEditingCell(null)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === "Escape") {
                                      setEditingCell(null);
                                    }
                                  }}
                                  className="w-full h-full px-2.5 py-2 font-mono text-xs bg-white text-slate-900 outline-none"
                                />
                              ) : (
                                <div
                                  className={`px-2.5 py-2 min-h-[34px] flex items-center ${
                                    typeof evalCell?.value === "number"
                                      ? "justify-end font-mono"
                                      : "justify-start"
                                  }`}
                                >
                                  {evalCell?.error ? (
                                    <span className="text-rose-600 font-mono font-bold">
                                      {evalCell.error}
                                    </span>
                                  ) : evalCell?.display ? (
                                    <span>{evalCell.display}</span>
                                  ) : isTarget ? (
                                    <span className="text-amber-500/80 italic text-[11px]">
                                      数式を入力...
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Sheet Tab Footer */}
            <div className="bg-slate-100 border-t border-slate-200 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-600">
              <div className="inline-flex items-center gap-1.5 bg-white border border-slate-300 border-b-emerald-600 border-b-2 px-3 py-1 rounded-t font-bold text-emerald-800">
                {spec.sheetName}
              </div>
              <div>対応関数: SUM / AVERAGE / MAX / MIN / IF / COUNTIF / SUMIF / VLOOKUP / XLOOKUP / IFERROR / LEFT / CONCAT</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
