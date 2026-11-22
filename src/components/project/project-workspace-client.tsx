"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Github,
  Lightbulb,
  Loader2,
  Send,
  Users,
  Rocket,
  CheckSquare,
  Square,
} from "lucide-react";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { isValidGithubUrl, parseProjectStepSpec } from "@/lib/curriculum-evaluators";
import type { Hint, Problem, Progress } from "@/types/database";

interface Props {
  problem: Problem;
  hints: Hint[];
  initialProgress: Progress | null;
  nextProblemId: string | null;
  courseId: string;
}

export function ProjectWorkspaceClient({
  problem,
  hints,
  initialProgress,
  nextProblemId,
}: Props) {
  const spec = useMemo(() => parseProjectStepSpec(problem.starter_code), [problem.starter_code]);
  const [githubUrl, setGithubUrl] = useState("");
  const [summaryNote, setSummaryNote] = useState("");
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(initialProgress?.status === "completed");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  function toggleItem(idx: number) {
    setCheckedItems((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
    setFeedback(null);
  }

  const allChecked =
    spec !== null && spec.checklist.every((_, idx) => checkedItems.includes(idx));
  const urlValid = isValidGithubUrl(githubUrl);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!spec) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const payload = {
        githubUrl: githubUrl.trim(),
        checkedItems,
        summaryNote: summaryNote.trim(),
      };
      const res = await fetch("/api/problems/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: problem.id,
          code: JSON.stringify(payload),
          timeSpentSeconds: 300,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: "error", text: data.error || "提出に失敗しました。" });
        return;
      }
      if (data.allPassed) {
        setCompleted(true);
        setFeedback({
          type: "success",
          text: "🎉 GitHubリポジトリURLと完了チェックを受け付けました！このステップをクリアしました！",
        });
      } else {
        const firstErr = data.results?.find((r: { passed: boolean }) => !r.passed);
        setFeedback({
          type: "error",
          text: firstErr?.errorDetail || "提出条件を満たしていません。URLとチェックリストを確認してください。",
        });
      }
    } catch {
      setFeedback({ type: "error", text: "通信エラーが発生しました。" });
    } finally {
      setSubmitting(false);
    }
  }

  if (!spec) {
    return (
      <div className="p-8 text-center text-slate-600">
        プロジェクト課題データの読み込みに失敗しました。
      </div>
    );
  }

  const isTeam = Boolean(spec.isTeamProject);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/student/courses"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 transition shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              一覧へ
            </Link>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                isTeam
                  ? "bg-purple-100 text-purple-800"
                  : "bg-indigo-100 text-indigo-800"
              }`}
            >
              {isTeam ? <Users className="h-3 w-3" /> : <Rocket className="h-3 w-3" />}
              {isTeam ? "チーム開発（3人1組）" : "Spring Boot 個人開発"}
            </span>
            <h1 className="text-sm md:text-base font-bold text-slate-900 truncate">
              {problem.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {completed && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                提出済・クリア
              </span>
            )}
            {nextProblemId && (
              <Link
                href={`/student/problems/${nextProblemId}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
              >
                次のステップへ
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-6 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Step Guide with Mermaid Diagrams */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <MarkdownRenderer content={problem.description_md} />
          </div>

          {hints.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-900">
                  <Lightbulb className="h-4 w-4 text-amber-600" />
                  つまずきやすいポイント・ヒント
                </span>
                <button
                  type="button"
                  onClick={() => setShowHint((v) => !v)}
                  className="text-xs font-semibold text-amber-800 underline"
                >
                  {showHint ? "閉じる" : "表示する"}
                </button>
              </div>
              {showHint &&
                hints.map((h) => (
                  <div
                    key={h.id}
                    className="text-xs text-amber-950 bg-white/80 rounded-lg p-3 border border-amber-100"
                  >
                    <strong>ヒント {h.step_number}:</strong> {h.content_md}
                  </div>
                ))}
            </div>
          )}

          {completed && problem.explanation_md && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
              <h3 className="text-sm font-bold text-emerald-900 mb-2">ステップ完了メモ</h3>
              <MarkdownRenderer content={problem.explanation_md} />
            </div>
          )}
        </div>

        {/* Right: Excel Spec Download + Checklist + GitHub URL Submission */}
        <div className="lg:col-span-5 space-y-5">
          {/* Excel Design Spec Download Card */}
          <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5 shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  公式開発ドキュメント（.xlsx）
                </div>
                <h2 className="text-sm font-bold text-slate-900 mt-0.5">
                  {spec.designDocLabel}
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  画面一覧・テーブル定義＆DDL・クラス設計・バリデーション・テスト仕様書まで全7シート収録。ExcelまたはGoogleスプレッドシートで開いて開発を進めましょう。
                </p>
              </div>
            </div>

            <a
              href={spec.designDocPath}
              download
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition"
            >
              <Download className="h-4 w-4" />
              詳細設計書（Excel）をダウンロード
            </a>
          </div>

          {/* Checklist & GitHub Submission Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-5"
          >
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-indigo-600" />
                ステップ {spec.stepNumber} 完了チェックリスト（{checkedItems.length}/{spec.checklist.length}）
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                手元のEclipse・PostgreSQL・GitHubで完了した項目すべてにチェックを入れてください。
              </p>

              <div className="mt-3 space-y-2">
                {spec.checklist.map((item, idx) => {
                  const checked = checkedItems.includes(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleItem(idx)}
                      className={`w-full text-left rounded-xl border p-3 text-xs transition flex items-start gap-2.5 ${
                        checked
                          ? "border-emerald-300 bg-emerald-50/70 text-emerald-950 font-medium"
                          : "border-slate-200 bg-slate-50/70 hover:border-indigo-300 text-slate-700"
                      }`}
                    >
                      {checked ? (
                        <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      )}
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="block space-y-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Github className="h-4 w-4 text-slate-900" />
                  提出用 GitHubリポジトリURL <span className="text-rose-500">*</span>
                </span>
                <input
                  type="url"
                  required
                  value={githubUrl}
                  onChange={(e) => {
                    setGithubUrl(e.target.value);
                    setFeedback(null);
                  }}
                  placeholder={
                    isTeam
                      ? "https://github.com/your-team/teamops-hub"
                      : "https://github.com/your-id/product-manager"
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                />
                {githubUrl && !urlValid && (
                  <p className="text-[11px] text-rose-600">
                    `https://github.com/ユーザー名/リポジトリ名` の形式で入力してください。
                  </p>
                )}
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-bold text-slate-700">
                  実装メモ・工夫した点・講師へのコメント（任意）
                </span>
                <textarea
                  rows={3}
                  value={summaryNote}
                  onChange={(e) => setSummaryNote(e.target.value)}
                  placeholder="例：商品検索でカテゴリ＋キーワードの複合検索を実装し、PRGパターンを確認しました。"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
                />
              </label>
            </div>

            {feedback && (
              <div
                className={`rounded-xl border px-3.5 py-2.5 text-xs font-semibold ${
                  feedback.type === "success"
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                    : "border-rose-200 bg-rose-50 text-rose-800"
                }`}
              >
                {feedback.text}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !urlValid || !allChecked}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-bold shadow-sm transition"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              GitHub URLを提出してステップ完了する
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
