"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Send,
  Loader2,
} from "lucide-react";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { parseLiteracyQuizSpec } from "@/lib/curriculum-evaluators";
import type { Hint, Problem, Progress } from "@/types/database";

interface Props {
  problem: Problem;
  hints: Hint[];
  initialProgress: Progress | null;
  nextProblemId: string | null;
  courseId: string;
}

export function LiteracyWorkspaceClient({
  problem,
  hints,
  initialProgress,
  nextProblemId,
}: Props) {
  const spec = useMemo(() => parseLiteracyQuizSpec(problem.starter_code), [problem.starter_code]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(initialProgress?.status === "completed");
  const [judgeResult, setJudgeResult] = useState<{
    allPassed: boolean;
    passedCount: number;
    totalCount: number;
    results: Array<{ name: string; passed: boolean; errorDetail?: string }>;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const allSelected =
    spec !== null && spec.questions.every((q) => typeof answers[q.id] === "number");

  async function handleSubmit() {
    if (!spec) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/problems/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: problem.id,
          code: JSON.stringify(answers),
          timeSpentSeconds: 60,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "提出に失敗しました。");
        return;
      }
      setJudgeResult(data);
      if (data.allPassed) {
        setCompleted(true);
      }
    } catch {
      setErrorMsg("通信エラーが発生しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur px-6 py-3">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/student/courses"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 transition shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              一覧へ
            </Link>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 shrink-0">
              ITリテラシー導入
            </span>
            <h1 className="text-sm md:text-base font-bold text-slate-900 truncate">
              {problem.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {completed && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                クリア済
              </span>
            )}
            {nextProblemId && (
              <Link
                href={`/student/problems/${nextProblemId}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
              >
                次の単元へ
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 pt-6 space-y-6">
        {/* Illustrated Textbook Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-2 text-sky-700 font-bold text-sm mb-4">
            <BookOpen className="h-4 w-4" />
            図解テキスト
          </div>
          <MarkdownRenderer content={problem.description_md} />
        </div>

        {/* Interactive Quiz Card */}
        {spec && (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900">理解度確認テスト</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  全 {spec.questions.length} 問に正解するとこの単元がクリアになります。
                </p>
              </div>
              {hints.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowHint((v) => !v)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-xs font-semibold hover:bg-amber-100 transition"
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  {showHint ? "ヒントを閉じる" : "ヒントを見る"}
                </button>
              )}
            </div>

            {showHint && hints.length > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 space-y-2 text-sm text-amber-950">
                {hints.map((h) => (
                  <p key={h.id}>
                    <strong>ヒント {h.step_number}:</strong> {h.content_md}
                  </p>
                ))}
              </div>
            )}

            <div className="space-y-5">
              {spec.questions.map((q, qIdx) => {
                const selected = answers[q.id];
                const gradedItem = judgeResult?.results[qIdx];
                return (
                  <div
                    key={q.id}
                    className={`rounded-xl border p-5 transition ${
                      gradedItem
                        ? gradedItem.passed
                          ? "border-emerald-200 bg-emerald-50/40"
                          : "border-rose-200 bg-rose-50/40"
                        : "border-slate-200 bg-slate-50/50"
                    }`}
                  >
                    <p className="text-sm font-bold text-slate-900 mb-3">
                      Q{qIdx + 1}. {q.question}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt, oIdx) => {
                        const isPicked = selected === oIdx;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() =>
                              setAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                            }
                            className={`text-left px-4 py-3 rounded-lg border text-sm transition flex items-center gap-2.5 ${
                              isPicked
                                ? "border-blue-600 bg-blue-50 text-blue-900 font-semibold ring-2 ring-blue-200"
                                : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                            }`}
                          >
                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                                isPicked
                                  ? "border-blue-600 bg-blue-600 text-white"
                                  : "border-slate-300 text-slate-500"
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                    {gradedItem && (
                      <div
                        className={`mt-3 text-xs flex items-start gap-2 rounded-lg p-2.5 ${
                          gradedItem.passed
                            ? "bg-emerald-100/70 text-emerald-900"
                            : "bg-rose-100/70 text-rose-900"
                        }`}
                      >
                        {gradedItem.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <span>
                          {gradedItem.passed ? "正解！ " : "もう一度見直してみましょう："}
                          {q.explanation}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {errorMsg && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 font-medium">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                {judgeResult ? (
                  judgeResult.allPassed ? (
                    <span className="text-emerald-700 font-bold text-sm">
                      🎉 全問正解！この単元をクリアしました！
                    </span>
                  ) : (
                    <span className="text-rose-700 font-semibold">
                      {judgeResult.passedCount} / {judgeResult.totalCount} 問正解（全問正解でクリア）
                    </span>
                  )
                ) : (
                  "すべての選択肢を選んで採点ボタンを押してください"
                )}
              </div>

              <button
                type="button"
                disabled={!allSelected || submitting}
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold shadow-sm transition"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                回答を提出して採点する
              </button>
            </div>
          </div>
        )}

        {completed && problem.explanation_md && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6">
            <h3 className="text-sm font-bold text-emerald-900 mb-2">クリア解説・現場ポイント</h3>
            <MarkdownRenderer content={problem.explanation_md} />
          </div>
        )}
      </div>
    </div>
  );
}
