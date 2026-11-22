"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Code2,
  Monitor,
  Smartphone,
  RotateCcw,
  Send,
  Lightbulb,
  Loader2,
  Eye,
} from "lucide-react";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { AskInstructorButton } from "@/components/student/ask-instructor-modal";
import {
  buildLivePreviewHtml,
  evaluateHtmlCssSubmission,
  parseHtmlCssStarter,
} from "@/lib/htmlcss/htmlcss-evaluator";
import type { Hint, Problem, Progress } from "@/types/database";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-900 text-slate-400 text-xs">
      エディタを読み込み中...
    </div>
  ),
});

interface Props {
  problem: Problem;
  hints: Hint[];
  initialProgress: Progress | null;
  nextProblemId: string | null;
  courseId: string;
}

export function HtmlCssWorkspaceClient({
  problem,
  hints,
  initialProgress,
  nextProblemId,
}: Props) {
  const spec = useMemo(() => parseHtmlCssStarter(problem.starter_code), [problem.starter_code]);
  const [htmlCode, setHtmlCode] = useState(spec?.html ?? "");
  const [cssCode, setCssCode] = useState(spec?.css ?? "");
  const [activeTab, setActiveTab] = useState<"html" | "css">("html");
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [showHintStep, setShowHintStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(initialProgress?.status === "completed");
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const previewDoc = useMemo(() => buildLivePreviewHtml(htmlCode, cssCode), [htmlCode, cssCode]);

  const liveGrade = useMemo(() => {
    if (!spec) return null;
    return evaluateHtmlCssSubmission(
      problem.starter_code,
      JSON.stringify({ html: htmlCode, css: cssCode })
    );
  }, [spec, problem.starter_code, htmlCode, cssCode]);

  function handleReset() {
    setHtmlCode(spec?.html ?? "");
    setCssCode(spec?.css ?? "");
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
          code: JSON.stringify({ html: htmlCode, css: cssCode }),
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
          text: `🎉 全 ${data.totalCount} 項目の条件をクリアしました！`,
        });
      } else {
        setSubmitMessage({
          type: "error",
          text: `${data.passedCount} / ${data.totalCount} 項目クリア。未達の条件を確認して修正しましょう。`,
        });
      }
    } catch {
      setSubmitMessage({ type: "error", text: "通信エラーが発生しました。" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white px-5 py-3">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/student/courses"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-orange-600 transition shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              一覧へ
            </Link>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 shrink-0">
              <Code2 className="h-3 w-3" />
              HTML &amp; CSS ライブ演習
            </span>
            <h1 className="text-sm md:text-base font-bold text-slate-900 truncate">
              {problem.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <AskInstructorButton
              problemId={problem.id}
              problemTitle={problem.title}
              contextSnippet={`<!-- HTML -->\n${htmlCode}\n\n/* CSS */\n${cssCode}`}
              contextLabel="編集中のHTML/CSSコードを質問に添える"
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
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition"
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

      {submitMessage && (
        <div className="max-w-[1600px] w-full mx-auto px-4 pt-3">
          <div
            className={`rounded-xl border px-4 py-2.5 text-xs font-semibold ${
              submitMessage.type === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            {submitMessage.text}
          </div>
        </div>
      )}

      {/* 3-Pane Progate-Style Workspace */}
      <div className="max-w-[1600px] w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
        {/* Pane 1: Instructions + Real-time Checklist */}
        <div className="lg:col-span-3 space-y-4 overflow-y-auto lg:max-h-[calc(100vh-110px)] pr-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <MarkdownRenderer content={problem.description_md} />
          </div>

          {liveGrade && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900">
                  達成条件（{liveGrade.passedCount} / {liveGrade.totalCount}）
                </h3>
                <span className="text-[10px] text-slate-500">リアルタイム判定</span>
              </div>
              <div className="space-y-1.5">
                {liveGrade.checks.map((chk) => (
                  <div
                    key={chk.id}
                    className={`rounded-lg border px-3 py-2 text-xs flex items-start gap-2 ${
                      chk.passed
                        ? "border-emerald-200 bg-emerald-50/70 text-emerald-900"
                        : "border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  >
                    {chk.passed ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <span>{chk.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hints.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Lightbulb className="h-4 w-4 text-amber-600" />
                  ヒント
                </span>
                {showHintStep < hints.length && (
                  <button
                    type="button"
                    onClick={() => setShowHintStep((n) => n + 1)}
                    className="text-xs font-semibold text-amber-800 underline"
                  >
                    開く
                  </button>
                )}
              </div>
              {hints.slice(0, showHintStep).map((h) => (
                <p key={h.id} className="text-xs text-amber-950 bg-white/80 p-2 rounded border border-amber-100">
                  {h.content_md}
                </p>
              ))}
            </div>
          )}

          {completed && problem.explanation_md && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-950">
              <div className="font-bold mb-1">💡 クリア解説</div>
              <MarkdownRenderer content={problem.explanation_md} />
            </div>
          )}
        </div>

        {/* Pane 2: HTML / CSS Code Editor */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-sm min-h-[460px] lg:h-[calc(100vh-110px)]">
          <div className="flex items-center justify-between bg-slate-900 border-b border-slate-800 px-3 pt-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("html")}
                className={`px-4 py-2 text-xs font-bold rounded-t-lg transition ${
                  activeTab === "html"
                    ? "bg-slate-950 text-orange-400 border-t-2 border-orange-500"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                index.html
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("css")}
                className={`px-4 py-2 text-xs font-bold rounded-t-lg transition ${
                  activeTab === "css"
                    ? "bg-slate-950 text-sky-400 border-t-2 border-sky-500"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                style.css
              </button>
            </div>
            <span className="text-[11px] text-slate-400 pr-2">入力すると右画面へ即時反映</span>
          </div>

          <div className="flex-1 min-h-[380px]">
            <MonacoEditor
              height="100%"
              language={activeTab === "html" ? "html" : "css"}
              theme="vs-dark"
              value={activeTab === "html" ? htmlCode : cssCode}
              onChange={(val) => {
                if (activeTab === "html") setHtmlCode(val ?? "");
                else setCssCode(val ?? "");
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                tabSize: 2,
                wordWrap: "on",
                automaticLayout: true,
                padding: { top: 12 },
              }}
            />
          </div>
        </div>

        {/* Pane 3: Real-time Live Preview */}
        <div className="lg:col-span-4 flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm min-h-[460px] lg:h-[calc(100vh-110px)]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-3 py-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Eye className="h-4 w-4 text-orange-600" />
              リアルタイムプレビュー
            </div>
            <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5">
              <button
                type="button"
                onClick={() => setViewport("desktop")}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                  viewport === "desktop"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Monitor className="h-3 w-3" />
                PC
              </button>
              <button
                type="button"
                onClick={() => setViewport("mobile")}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                  viewport === "mobile"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Smartphone className="h-3 w-3" />
                スマホ
              </button>
            </div>
          </div>

          <div className="flex-1 bg-slate-200/60 p-3 flex justify-center overflow-auto">
            <iframe
              title="HTML/CSS ライブプレビュー"
              srcDoc={previewDoc}
              sandbox=""
              className={`bg-white border border-slate-300 rounded-xl shadow-sm transition-all duration-200 h-full ${
                viewport === "mobile" ? "w-[375px] max-w-full" : "w-full"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
