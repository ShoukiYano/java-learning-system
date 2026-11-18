"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { LocalMonacoEditor } from "./local-monaco-editor";
import { runJavaInBrowserWithTimeout } from "@/lib/java/worker-client";
import { compareOutputs, JavaDiagnostic } from "@/lib/java";
import { runSqlCode } from "@/lib/sql";
import { detectProblemLanguage } from "@/lib/seed-data";
import { difficultyLabel, formatDuration } from "@/lib/utils";
import { Hint, Problem, Progress, TestCase } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ProgressBar } from "@/components/ui/progress";
import type { TestCaseClientJudgeResult } from "@/app/api/problems/submit/route";
import {
  Play,
  FlaskConical,
  Send,
  Lightbulb,
  BookOpenCheck,
  RotateCcw,
  Sun,
  Moon,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Terminal,
  Sparkles,
} from "lucide-react";

interface ProblemWorkspaceClientProps {
  problem: Problem;
  publicTestCases: TestCase[];
  hints: Hint[];
  initialProgress: Progress | null;
  nextProblemId: string | null;
  courseId: string;
}

export function ProblemWorkspaceClient({
  problem,
  publicTestCases,
  hints,
  initialProgress,
  nextProblemId,
  courseId,
}: ProblemWorkspaceClientProps) {
  const storageKey = `code_draft_${problem.id}`;
  const problemLanguage = detectProblemLanguage(problem);

  const [code, setCode] = useState<string>(problem.starter_code);
  const [editorTheme, setEditorTheme] = useState<"vs-dark" | "light">("vs-dark");
  const [fontSize, setFontSize] = useState<number>(14);
  const [customStdin, setCustomStdin] = useState<string>(
    publicTestCases[0]?.input ?? ""
  );

  // 左ペインタブとヒント段階開示
  const [unlockedHintStep, setUnlockedHintStep] = useState<number>(
    initialProgress?.unlocked_hint_step ?? 0
  );
  const [isCleared, setIsCleared] = useState<boolean>(
    initialProgress?.status === "completed"
  );
  const [attemptsCount, setAttemptsCount] = useState<number>(
    initialProgress?.attempts_count ?? 0
  );

  // 下部ペイン：コンソール／テスト結果タブ
  const [bottomTab, setBottomTab] = useState<"console" | "tests">("console");
  const [runningMode, setRunningMode] = useState<
    "idle" | "run" | "test" | "submit"
  >("idle");

  // 実行結果・診断エラー状態
  const [consoleStdout, setConsoleStdout] = useState<string>("");
  const [consoleStderr, setConsoleStderr] = useState<string>("");
  const [diagnostics, setDiagnostics] = useState<JavaDiagnostic[]>([]);
  const [execMeta, setExecMeta] = useState<{
    timeMs: number;
    steps: number;
  } | null>(null);
  const [testResults, setTestResults] = useState<TestCaseClientJudgeResult[]>(
    []
  );
  const [submitBanner, setSubmitBanner] = useState<{
    passed: boolean;
    message: string;
  } | null>(null);

  // 所要時間タイマー（秒）
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const sessionStartRef = useRef<number>(Date.now());

  // localStorage からの下書き復元
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved && saved.trim().length > 0) {
        setCode(saved);
      } else {
        setCode(problem.starter_code);
      }
    } catch {
      setCode(problem.starter_code);
    }
    sessionStartRef.current = Date.now();
    setElapsedSeconds(0);
  }, [problem.id, problem.starter_code, storageKey]);

  // コード変更時に localStorage へ自動下書き保存
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    try {
      window.localStorage.setItem(storageKey, newCode);
    } catch {
      // ignore storage quota errors
    }
  };

  // 1秒ごとの経過時間カウント
  useEffect(() => {
    const interval = window.setInterval(() => {
      setElapsedSeconds(
        Math.floor((Date.now() - sessionStartRef.current) / 1000)
      );
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  // 1. 「実行」（Ctrl+Enter）：ブラウザ内で任意の標準入力（またはセットアップSQL）を与えて実行
  const handleRun = useCallback(async () => {
    if (runningMode !== "idle") return;
    setRunningMode("run");
    setBottomTab("console");
    setSubmitBanner(null);

    const res =
      problemLanguage === "sql"
        ? runSqlCode(code, { setupSql: customStdin })
        : await runJavaInBrowserWithTimeout(code, {
            stdin: customStdin,
            maxSteps: 3_000_000,
          });

    setConsoleStdout(res.stdout);
    setConsoleStderr(res.stderr);
    setDiagnostics(res.diagnostics);
    setExecMeta({
      timeMs: res.executionTimeMs,
      steps: res.stepsExecuted,
    });
    setRunningMode("idle");
  }, [code, customStdin, problemLanguage, runningMode]);

  // 2. 「テスト」：ブラウザ内で公開テストを実行し、✅/❌と期待値・実際の出力の差分を表示
  const handlePublicTest = useCallback(async () => {
    if (runningMode !== "idle") return;
    setRunningMode("test");
    setBottomTab("tests");
    setSubmitBanner(null);

    const results: TestCaseClientJudgeResult[] = [];
    let totalTime = 0;
    let totalSteps = 0;
    let foundDiagnostics: JavaDiagnostic[] = [];

    for (const tc of publicTestCases) {
      const res =
        problemLanguage === "sql"
          ? runSqlCode(code, { setupSql: tc.input })
          : await runJavaInBrowserWithTimeout(code, {
              stdin: tc.input,
              maxSteps: 3_000_000,
            });

      totalTime += res.executionTimeMs;
      totalSteps += res.stepsExecuted;

      if (res.status === "compile_error") {
        foundDiagnostics = res.diagnostics;
        setConsoleStderr(res.stderr);
        setBottomTab("console");
        break;
      }

      const passed =
        res.status === "success" &&
        compareOutputs(res.stdout, tc.expected_output);

      results.push({
        name: tc.name,
        isHidden: false,
        passed,
        executionTimeMs: res.executionTimeMs,
        stepsExecuted: res.stepsExecuted,
        input: tc.input,
        expectedOutput: tc.expected_output,
        actualOutput: res.stdout,
        errorDetail: res.stderr || undefined,
      });
    }

      setDiagnostics(foundDiagnostics);
    setTestResults(results);
    setExecMeta({ timeMs: totalTime, steps: totalSteps });
    setRunningMode("idle");
  }, [code, problemLanguage, publicTestCases, runningMode]);

  // 3. 「提出」（Ctrl+Shift+Enter）：サーバー側（Route Handler）で公開＋非公開テストの両方を判定
  const handleSubmit = useCallback(async () => {
    if (runningMode !== "idle") return;
    setRunningMode("submit");
    setBottomTab("tests");
    setSubmitBanner(null);

    try {
      const res = await fetch("/api/problems/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: problem.id,
          code,
          timeSpentSeconds: elapsedSeconds,
          unlockedHintStep,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setConsoleStderr(data.error || "提出エラーが発生しました。");
        setBottomTab("console");
        setRunningMode("idle");
        return;
      }

      setAttemptsCount((prev) => data.attemptsCount ?? prev + 1);
      setExecMeta({
        timeMs: data.executionTimeMs ?? 0,
        steps: data.stepsExecuted ?? 0,
      });

      if (data.status === "compile_error") {
        setDiagnostics(data.diagnostics ?? []);
        setConsoleStderr(data.compileError ?? "コンパイルエラー");
        setBottomTab("console");
        setSubmitBanner({
          passed: false,
          message: "コンパイルエラーがあります。赤く表示された行と日本語補足を確認してください。",
        });
      } else {
        setDiagnostics([]);
        setTestResults(data.results ?? []);

        if (data.allPassed) {
          setIsCleared(true);
          setSubmitBanner({
            passed: true,
            message: `🎉 全 ${data.totalCount} 件のテスト（非公開テスト含む）に合格しました！問題クリアです！`,
          });
          // クリア時の紙吹雪アニメーション演出
          try {
            confetti({
              particleCount: 90,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch {
            // Canvas未対応環境ではスキップ
          }
        } else {
          setSubmitBanner({
            passed: false,
            message: `テスト結果：${data.passedCount} / ${data.totalCount} 件通過。通過しなかったケースを確認して再挑戦しましょう。`,
          });
        }
      }
    } catch {
      setConsoleStderr("サーバー通信エラーが発生しました。");
      setBottomTab("console");
    } finally {
      setRunningMode("idle");
    }
  }, [code, elapsedSeconds, problem.id, runningMode, unlockedHintStep]);

  // グローバルキーボードショートカット（エディタ外にフォーカスがある場合も動作）
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleRun, handleSubmit]);

  const diff = difficultyLabel(problem.difficulty);

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-slate-100">
      {/* 上部ツールバー */}
      <div className="h-12 bg-white border-b px-4 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/student/courses/${courseId}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            章一覧へ
          </Link>
          <span className="text-slate-300">|</span>
          <Badge variant={problemLanguage === "sql" ? "warning" : "default"}>
            {problemLanguage === "sql" ? "SQL" : "Java"}
          </Badge>
          <h1 className="font-bold text-sm text-slate-900 truncate">
            {problem.title}
          </h1>
          <span
            className={`text-[11px] px-2 py-0.5 rounded border font-semibold shrink-0 ${diff.color}`}
          >
            {diff.label}
          </span>
          {isCleared && (
            <Badge variant="success" className="gap-1 shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5" />
              クリア済
            </Badge>
          )}
        </div>

        {/* クリア時の進捗バーと「次の問題へ」ボタン、挑戦回数・所要時間 */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-md">
            <span>挑戦回数: <strong>{attemptsCount}回</strong></span>
            <span>|</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-500" />
              所要時間: <strong>{formatDuration(elapsedSeconds)}</strong>
            </span>
          </div>

          {/* 実行（Ctrl+Enter） */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleRun}
            disabled={runningMode !== "idle"}
            title="任意の標準入力で実行 (Ctrl+Enter)"
          >
            <Play className="h-3.5 w-3.5 text-blue-600 fill-blue-600" />
            {runningMode === "run" ? "実行中..." : "実行 (Ctrl+Enter)"}
          </Button>

          {/* テスト（公開テスト） */}
          <Button
            size="sm"
            variant="secondary"
            onClick={handlePublicTest}
            disabled={runningMode !== "idle"}
            title="公開テストケースで検証"
          >
            <FlaskConical className="h-3.5 w-3.5 text-amber-600" />
            {runningMode === "test" ? "テスト中..." : "テスト"}
          </Button>

          {/* 提出（Ctrl+Shift+Enter） */}
          <Button
            size="sm"
            variant="success"
            onClick={handleSubmit}
            disabled={runningMode !== "idle"}
            title="非公開テストを含めてサーバー採点 (Ctrl+Shift+Enter)"
          >
            <Send className="h-3.5 w-3.5" />
            {runningMode === "submit"
              ? "採点中..."
              : "提出 (Ctrl+Shift+Enter)"}
          </Button>

          {isCleared && nextProblemId && (
            <Link
              href={`/student/problems/${nextProblemId}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow animate-pulse"
            >
              次の問題へ
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* クリア通知バナー */}
      {submitBanner && (
        <div
          className={`px-4 py-2.5 border-b flex items-center justify-between text-xs font-semibold ${
            submitBanner.passed
              ? "bg-emerald-600 text-white"
              : "bg-amber-50 text-amber-900 border-amber-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>{submitBanner.message}</span>
          </div>
          {submitBanner.passed && (
            <div className="flex items-center gap-3">
              <div className="w-32 hidden sm:block">
                <ProgressBar
                  value={100}
                  className="bg-emerald-800 h-2"
                  indicatorClassName="bg-white"
                />
              </div>
              {nextProblemId && (
                <Link
                  href={`/student/problems/${nextProblemId}`}
                  className="px-3 py-1 rounded bg-white text-emerald-800 font-bold hover:bg-emerald-50 inline-flex items-center gap-1"
                >
                  次の問題へ進む
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* ★ 3ペイン構成（react-resizable-panels でドラッグ幅調整） */}
      <PanelGroup direction="horizontal" className="flex-1 overflow-hidden">
        {/* 左ペイン：問題文、入出力例、段階的ヒント（1段階ずつ開示）、解説（クリア後に解放） */}
        <Panel defaultSize={36} minSize={22} className="bg-white flex flex-col">
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* タグと想定時間 */}
            <div className="flex flex-wrap items-center gap-2">
              {problem.tags.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
              <span className="text-xs text-slate-500 ml-auto">
                想定時間: {problem.estimated_minutes}分
              </span>
            </div>

            {/* 問題文 */}
            <div className="prose prose-sm max-w-none space-y-3 text-slate-800">
              <div className="whitespace-pre-wrap text-sm leading-relaxed font-sans bg-slate-50 p-4 rounded-xl border border-slate-200">
                {problem.description_md}
              </div>
            </div>

            {/* 公開テストケースの入出力例 */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                公開テストケース（入出力例）
              </h3>
              {publicTestCases.map((tc) => (
                <div
                  key={tc.id}
                  className="rounded-lg border border-slate-200 p-3 bg-slate-50/60 space-y-2 text-xs"
                >
                  <div className="font-semibold text-slate-700">{tc.name}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">
                        標準入力 (stdin)
                      </span>
                      <pre className="p-2 rounded bg-slate-900 text-slate-100 font-mono overflow-x-auto">
                        {tc.input || "(入力なし)"}
                      </pre>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">
                        期待される出力
                      </span>
                      <pre className="p-2 rounded bg-slate-900 text-emerald-300 font-mono overflow-x-auto">
                        {tc.expected_output}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 段階的ヒント（ボタンを押すたびに1段階ずつ開示、最大3つ） */}
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  段階的ヒント（{unlockedHintStep} / {hints.length} 段階開示中）
                </h3>
                {unlockedHintStep < hints.length && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setUnlockedHintStep((prev) =>
                        Math.min(hints.length, prev + 1)
                      )
                    }
                    className="h-7 text-xs border-amber-300 text-amber-800 hover:bg-amber-50"
                  >
                    ヒント {unlockedHintStep + 1} を開く
                  </Button>
                )}
              </div>

              {unlockedHintStep === 0 ? (
                <p className="text-xs text-slate-500">
                  手がかりが必要な場合は「ヒント 1 を開く」ボタンを押してください。
                </p>
              ) : (
                <div className="space-y-2">
                  {hints
                    .filter((h) => h.step_number <= unlockedHintStep)
                    .map((h) => (
                      <div
                        key={h.step_number}
                        className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1"
                      >
                        <div className="font-bold text-amber-800">
                          💡 ヒント {h.step_number}
                        </div>
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {h.content_md}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* 解説（クリア後に解放） */}
            <div className="space-y-2 pt-2 border-t">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <BookOpenCheck className="h-4 w-4 text-emerald-600" />
                問題の解説
              </h3>
              {isCleared ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 leading-relaxed whitespace-pre-wrap">
                  {problem.explanation_md}
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-500">
                  🔒 解説は「提出」で全テストケースに合格（クリア）すると解放されます。
                </div>
              )}
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className="w-1.5 bg-slate-200 hover:bg-blue-500 transition cursor-col-resize" />

        {/* 右側：中央エディタ ＋ 下部コンソール・テスト結果ペイン */}
        <Panel defaultSize={64} minSize={35}>
          <PanelGroup direction="vertical">
            {/* 中央：Monaco Editor（ダーク／ライト切替、フォントサイズ変更、初期コードリセット） */}
            <Panel defaultSize={62} minSize={25} className="flex flex-col">
              <div className="h-9 bg-slate-800 text-slate-200 px-3 flex items-center justify-between text-xs border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-blue-400">
                    {problemLanguage === "sql" ? "query.sql" : "Main.java"}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    （下書きはブラウザに自動保存されます）
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* フォントサイズ変更 */}
                  <label className="text-[11px] text-slate-300 flex items-center gap-1">
                    文字サイズ:
                    <select
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="bg-slate-700 text-white rounded px-1.5 py-0.5 text-xs"
                    >
                      <option value={12}>12px</option>
                      <option value={14}>14px</option>
                      <option value={16}>16px</option>
                      <option value={18}>18px</option>
                      <option value={20}>20px</option>
                    </select>
                  </label>

                  {/* ダーク／ライト切替 */}
                  <button
                    type="button"
                    onClick={() =>
                      setEditorTheme((t) =>
                        t === "vs-dark" ? "light" : "vs-dark"
                      )
                    }
                    className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 inline-flex items-center gap-1"
                  >
                    {editorTheme === "vs-dark" ? (
                      <>
                        <Sun className="h-3.5 w-3.5 text-amber-400" />
                        ライト
                      </>
                    ) : (
                      <>
                        <Moon className="h-3.5 w-3.5 text-blue-300" />
                        ダーク
                      </>
                    )}
                  </button>

                  {/* 初期コードに戻す */}
                  <button
                    type="button"
                    onClick={() => handleCodeChange(problem.starter_code)}
                    className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 inline-flex items-center gap-1"
                    title="初期コードにリセット"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    リセット
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                <LocalMonacoEditor
                  value={code}
                  onChange={handleCodeChange}
                  language={problemLanguage}
                  theme={editorTheme}
                  fontSize={fontSize}
                  diagnostics={diagnostics}
                  onRunShortcut={handleRun}
                  onSubmitShortcut={handleSubmit}
                />
              </div>
            </Panel>

            <PanelResizeHandle className="h-1.5 bg-slate-300 hover:bg-blue-500 transition cursor-row-resize" />

            {/* 下ペイン：コンソール（標準入力・標準出力・エラー）とテスト結果のタブ */}
            <Panel defaultSize={38} minSize={20} className="bg-slate-950 text-slate-100 flex flex-col">
              <div className="h-9 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between text-xs shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setBottomTab("console")}
                    className={`px-3 py-1.5 rounded-t font-semibold flex items-center gap-1.5 transition ${
                      bottomTab === "console"
                        ? "bg-slate-950 text-blue-400 border-t-2 border-blue-500"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Terminal className="h-3.5 w-3.5" />
                    コンソール・標準入力
                    {diagnostics.length > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px]">
                        {diagnostics.length}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setBottomTab("tests")}
                    className={`px-3 py-1.5 rounded-t font-semibold flex items-center gap-1.5 transition ${
                      bottomTab === "tests"
                        ? "bg-slate-950 text-emerald-400 border-t-2 border-emerald-500"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <FlaskConical className="h-3.5 w-3.5" />
                    テスト結果
                    {testResults.length > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-200 text-[10px]">
                        {testResults.filter((r) => r.passed).length}/
                        {testResults.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* 実行時間と実行ステップ数の表示 */}
                {execMeta && (
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>実行時間: <strong className="text-slate-200">{execMeta.timeMs} ms</strong></span>
                    <span>実行ステップ数: <strong className="text-slate-200">{execMeta.steps.toLocaleString()} steps</strong></span>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4 text-xs">
                {bottomTab === "console" ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-400 block">
                        {problemLanguage === "sql"
                          ? "テスト用初期テーブル・データSQL (CREATE / INSERT)"
                          : "任意の標準入力 (Scanner 用 stdin)"}
                      </label>
                      <Textarea
                        value={customStdin}
                        onChange={(e) => setCustomStdin(e.target.value)}
                        placeholder="標準入力をここに入力..."
                        className="bg-slate-900 border-slate-800 text-slate-100 font-mono text-xs min-h-[110px]"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-3">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                          標準出力 (stdout)
                        </span>
                        <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-emerald-300 min-h-[60px] whitespace-pre-wrap">
                          {consoleStdout || "(出力なし)"}
                        </pre>
                      </div>

                      {(consoleStderr || diagnostics.length > 0) && (
                        <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-200 space-y-2">
                          <div className="font-bold flex items-center gap-1.5 text-rose-300">
                            <AlertTriangle className="h-4 w-4" />
                            エラー診断・日本語補足
                          </div>
                          <pre className="font-mono whitespace-pre-wrap leading-relaxed">
                            {consoleStderr}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {testResults.length === 0 ? (
                      <p className="text-slate-400">
                        上部の「テスト」または「提出」ボタンを押すと、ここに各テストケースの判定結果と差分が表示されます。
                      </p>
                    ) : (
                      testResults.map((tr, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg border space-y-2 ${
                            tr.passed
                              ? "bg-emerald-950/30 border-emerald-800/70"
                              : "bg-rose-950/40 border-rose-800/80"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-bold flex items-center gap-2">
                              {tr.passed ? (
                                <span className="text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="h-4 w-4" /> ✅ {tr.name}
                                </span>
                              ) : (
                                <span className="text-rose-400 flex items-center gap-1">
                                  <XCircle className="h-4 w-4" /> ❌ {tr.name}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">
                              {tr.executionTimeMs} ms / {tr.stepsExecuted.toLocaleString()} steps
                            </span>
                          </div>

                          {/* 公開テストの場合は入力・期待値・実際の出力の差分を表示 */}
                          {!tr.isHidden ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
                              <div>
                                <span className="text-[10px] text-slate-400 block">
                                  入力値
                                </span>
                                <pre className="p-2 rounded bg-slate-900 font-mono text-slate-200 overflow-x-auto">
                                  {tr.input || "(なし)"}
                                </pre>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 block">
                                  期待される出力
                                </span>
                                <pre className="p-2 rounded bg-slate-900 font-mono text-emerald-300 overflow-x-auto">
                                  {tr.expectedOutput}
                                </pre>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 block">
                                  あなたの出力
                                </span>
                                <pre
                                  className={`p-2 rounded bg-slate-900 font-mono overflow-x-auto ${
                                    tr.passed ? "text-emerald-300" : "text-rose-300"
                                  }`}
                                >
                                  {tr.actualOutput || tr.errorDetail || "(出力なし)"}
                                </pre>
                              </div>
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400">
                              ※ 非公開テストケースのため、入力値と期待出力の詳細は非表示です。
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
}
