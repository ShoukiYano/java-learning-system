"use client";

/**
 * ファイル概要：
 * DevSkill Studio オリジナル・インタラクティブGit演習ワークスペース
 *
 * 主な処理：
 * 1. 左ペイン：ミッション説明（白カード）＋コマンド入力コンソール（入力補助チップ付き）
 * 2. 右ペイン：
 *    - 上段：現在のリポジトリ状態（横型タイムラインコミットカード）
 *    - 中段：リアルタイム・クリア条件チェックリスト（項目ごとの達成状況を即時反映）
 *    - 下段：目指すゴール構成（横型タイムライン比較カード・折りたたみ可能）
 * 3. 全条件達成時の紙吹雪演出（canvas-confetti）＆自動提出API連携
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  GitState,
  createInitialGitState,
  executeGitCommand,
  executeGitScript,
  compareGitStates,
  evaluateGitGoalChecklist,
} from "@/lib/git/git-engine";
import { GitGraphVisualizer } from "./git-graph-visualizer";
import { Problem, Progress } from "@/types/database";
import { difficultyLabel, formatDuration } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Terminal as TerminalIcon,
  RotateCcw,
  Target,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Clock,
  GitBranch,
  ChevronDown,
  ChevronUp,
  Send,
  BookOpen,
  ListChecks,
} from "lucide-react";

interface GitWorkspaceClientProps {
  problem: Problem;
  initialProgress: Progress | null;
  nextProblemId: string | null;
  courseId: string;
}

interface TerminalLogEntry {
  id: string;
  command?: string;
  output: string;
  isError?: boolean;
  type?: "system" | "user" | "success";
}

const QUICK_COMMANDS = [
  { label: "git commit", cmd: "git commit" },
  { label: "git branch", cmd: "git branch " },
  { label: "git switch", cmd: "git switch " },
  { label: "git merge", cmd: "git merge " },
  { label: "git rebase", cmd: "git rebase " },
  { label: "git status", cmd: "git status" },
];

export function GitWorkspaceClient({
  problem,
  initialProgress,
  nextProblemId,
  courseId,
}: GitWorkspaceClientProps) {
  const initialBaseState = useMemoInitialState(problem.starter_code);
  const goalTargetState = useMemoGoalState(problem.solution_code);
  const diff = difficultyLabel(problem.difficulty);

  const [gitState, setGitState] = useState<GitState>(initialBaseState);
  const [inputVal, setInputVal] = useState<string>("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [logs, setLogs] = useState<TerminalLogEntry[]>([
    {
      id: "init-1",
      type: "system",
      output: `Git演習コンソール準備完了。コマンドを入力して Enter を押してください（'help' でコマンド一覧）。`,
    },
  ]);

  const [isGoalAchieved, setIsGoalAchieved] = useState<boolean>(
    initialProgress?.status === "completed"
  );
  const [showGoalSection, setShowGoalSection] = useState<boolean>(true);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [executedCommands, setExecutedCommands] = useState<string[]>([]);

  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // リアルタイム・クリア条件チェックリスト
  const checklist = useMemo(
    () => evaluateGitGoalChecklist(gitState, goalTargetState),
    [gitState, goalTargetState]
  );

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const checkGoal = useCallback(
    (currentState: GitState, commands: string[]) => {
      const match = compareGitStates(currentState, goalTargetState);
      if (match.isMatch && !isGoalAchieved) {
        setIsGoalAchieved(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });

        fetch("/api/problems/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            problemId: problem.id,
            code: commands.join("\n"),
          }),
        }).catch((e) => console.error("Submit error:", e));

        setLogs((prev) => [
          ...prev,
          {
            id: `success-${Date.now()}`,
            type: "success",
            output:
              "CLEAR! すべてのクリア条件を達成しました。学習進捗を記録しました。",
          },
        ]);
      }
    },
    [goalTargetState, isGoalAchieved, problem.id]
  );

  const handleExecute = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const raw = inputVal.trim();
    if (!raw) return;

    setInputVal("");
    setCommandHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);

    if (raw.toLowerCase() === "clear") {
      setLogs([]);
      return;
    }

    if (raw.toLowerCase() === "reset") {
      handleReset();
      return;
    }

    const res = executeGitCommand(gitState, raw);
    const newCommands = [...executedCommands, raw];
    setExecutedCommands(newCommands);
    setGitState(res.state);

    setLogs((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: raw,
        output: res.output,
        isError: res.isError,
        type: res.isError ? "system" : "user",
      },
    ]);

    if (!res.isError) {
      checkGoal(res.state, newCommands);
    }
  };

  const handleReset = () => {
    setGitState(initialBaseState);
    setExecutedCommands([]);
    setLogs((prev) => [
      ...prev,
      {
        id: `reset-${Date.now()}`,
        type: "system",
        output: "リポジトリを初期状態にリセットしました。",
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx =
        historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(commandHistory[nextIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputVal("");
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      }
    }
  };

  const handleQuickInsert = (cmd: string) => {
    setInputVal(cmd);
    inputRef.current?.focus();
  };

  const passedCheckCount = checklist.filter((c) => c.passed).length;

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)] bg-slate-100/70 text-slate-900 lg:overflow-hidden">
      {/* 1. トップヘッダー */}
      <header className="flex flex-wrap items-center justify-between gap-2 px-4 md:px-5 py-2.5 bg-white border-b border-slate-200 text-sm shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href={`/student/courses/${courseId}`}
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-600 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>コース詳細へ</span>
          </Link>
          <span className="text-slate-300">/</span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-900 text-base">
              {problem.title}
            </span>
            <Badge
              variant="outline"
              className="text-xs border-purple-200 text-purple-700 bg-purple-50 font-semibold gap-1"
            >
              <GitBranch className="w-3 h-3" />
              Git演習
            </Badge>
            <span
              className={`px-2 py-0.5 rounded border text-xs font-semibold ${diff.color}`}
            >
              {diff.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-white border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            やり直す
          </Button>

          {isGoalAchieved && nextProblemId && (
            <Link href={`/student/problems/${nextProblemId}`}>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
              >
                次の問題へ
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* 2. メイン 2カラムワークスペース */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 lg:overflow-hidden">
        {/* 左カラム (lg:col-span-5): 問題説明 + コマンドコンソール */}
        <div className="lg:col-span-5 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 bg-white lg:overflow-hidden">
          {/* 上部: 問題文 */}
          <div className="p-4 md:p-5 border-b border-slate-200 lg:overflow-y-auto lg:max-h-[45%]">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                <BookOpen className="w-3.5 h-3.5" />
                課題の説明
              </span>
              <div className="flex items-center text-xs font-medium text-slate-500 gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>目安: {formatDuration(problem.estimated_minutes)}</span>
              </div>
            </div>

            <div className="text-slate-800 text-sm leading-relaxed">
              <MarkdownRenderer content={problem.description_md} />
            </div>

            {problem.explanation_md && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-xs text-amber-900 font-bold transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    解法のヒントを開く
                  </span>
                  {showHint ? (
                    <ChevronUp className="w-4 h-4 text-amber-700" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-amber-700" />
                  )}
                </button>
                {showHint && (
                  <div className="mt-2 p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-slate-800 leading-relaxed">
                    <MarkdownRenderer content={problem.explanation_md} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 下部: オリジナル コマンド入力コンソール */}
          <div className="flex-1 flex flex-col min-h-[300px] lg:min-h-0 bg-slate-900 text-slate-100 font-mono text-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 select-none">
              <span className="text-slate-100 text-xs font-sans font-bold flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-blue-400" />
                コマンド入力コンソール
              </span>
              <span className="text-xs font-sans text-slate-300 bg-slate-700/80 px-2 py-0.5 rounded">
                作業ブランチ:{" "}
                <strong className="font-mono text-emerald-400">
                  {gitState.head.isDetached
                    ? `(detached: ${gitState.head.target})`
                    : gitState.head.target}
                </strong>
              </span>
            </div>

            {/* 実行ログ */}
            <div
              className="flex-1 p-4 overflow-y-auto space-y-2.5 select-text"
              onClick={() => inputRef.current?.focus()}
            >
              {logs.map((log) => (
                <div key={log.id} className="space-y-1">
                  {log.command && (
                    <div className="flex items-center gap-2 text-sky-300">
                      <span className="text-emerald-400 font-bold select-none">
                        $
                      </span>
                      <span className="font-bold">{log.command}</span>
                    </div>
                  )}
                  {log.output && (
                    <div
                      className={`whitespace-pre-wrap pl-4 leading-relaxed text-[13px] ${
                        log.type === "success"
                          ? "text-emerald-200 font-bold bg-emerald-900/60 p-3 rounded-lg border border-emerald-500/50"
                          : log.isError
                          ? "text-rose-300 bg-rose-950/60 p-2 rounded border border-rose-500/30"
                          : log.type === "system"
                          ? "text-slate-300"
                          : "text-slate-200"
                      }`}
                    >
                      {log.output}
                    </div>
                  )}
                </div>
              ))}
              <div ref={terminalBottomRef} />
            </div>

            {/* ワンクリック入力補助バー */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 border-t border-slate-700 overflow-x-auto">
              <span className="text-[11px] font-sans text-slate-400 shrink-0 mr-1">
                入力補助:
              </span>
              {QUICK_COMMANDS.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => handleQuickInsert(q.cmd)}
                  className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs font-mono shrink-0 transition-colors"
                >
                  {q.label}
                </button>
              ))}
            </div>

            {/* コマンド入力欄 */}
            <form
              onSubmit={handleExecute}
              className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-t-2 border-blue-500"
            >
              <span className="text-emerald-400 font-bold select-none shrink-0">
                $
              </span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="git commit / git branch bugfix / git switch bugfix ..."
                className="flex-1 bg-transparent text-white outline-none placeholder:text-slate-400 font-mono text-sm"
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                実行
              </Button>
            </form>
          </div>
        </div>

        {/* 右カラム (lg:col-span-7): 構造化された3段ビジュアルパネル */}
        <div className="lg:col-span-7 flex flex-col overflow-y-auto p-4 md:p-5 gap-4">
          {/* クリア時のお祝いバナー */}
          {isGoalAchieved && (
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-emerald-600 text-white shadow-md">
              <div className="flex items-center gap-2.5 text-sm font-bold">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>
                  ミッションクリア！すべてのクリア条件を達成しました。
                </span>
              </div>
              {nextProblemId && (
                <Link href={`/student/problems/${nextProblemId}`}>
                  <Button
                    size="sm"
                    className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold"
                  >
                    次の問題へ進む
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          )}

          {/* パネル1: 現在のリポジトリ状態（横型コミットタイムライン） */}
          <section className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  現在のリポジトリ履歴（左 → 右へ進行）
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                  コミット: {Object.keys(gitState.commits).length}件
                </span>
                <span className="font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800">
                  HEAD →{" "}
                  {gitState.head.isDetached
                    ? gitState.head.target
                    : gitState.head.target}
                </span>
              </div>
            </div>
            <div className="p-4 min-h-[190px] flex items-center bg-white">
              <GitGraphVisualizer state={gitState} />
            </div>
          </section>

          {/* パネル2: リアルタイム・クリア条件チェックリスト */}
          <section className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  クリア条件チェックリスト
                </h2>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  passedCheckCount === checklist.length
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {passedCheckCount} / {checklist.length} 達成
              </span>
            </div>
            <ul className="divide-y divide-slate-100">
              {checklist.map((item) => (
                <li
                  key={item.id}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    item.passed ? "bg-emerald-50/40" : "bg-white"
                  }`}
                >
                  {item.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <span
                    className={
                      item.passed
                        ? "text-emerald-900 font-semibold"
                        : "text-slate-700"
                    }
                  >
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* パネル3: 目指すゴール構成（折りたたみ可能な比較タイムライン） */}
          <section className="rounded-xl bg-white border border-indigo-200 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => setShowGoalSection(!showGoalSection)}
              className="flex items-center justify-between w-full px-4 py-2.5 bg-indigo-50/70 hover:bg-indigo-50 border-b border-indigo-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-indigo-950">
                  目指すゴール構成（完成イメージ）
                </h2>
              </div>
              <span className="text-xs font-semibold text-indigo-700 flex items-center gap-1">
                {showGoalSection ? (
                  <>
                    折りたたむ <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    表示する <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </span>
            </button>
            {showGoalSection && (
              <div className="p-3 bg-indigo-50/20">
                <GitGraphVisualizer state={goalTargetState} isGoalView={true} />
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function useMemoInitialState(starterCode?: string): GitState {
  return React.useMemo(() => {
    const base = createInitialGitState();
    if (!starterCode || !starterCode.trim()) return base;
    const { state } = executeGitScript(base, starterCode);
    return state;
  }, [starterCode]);
}

function useMemoGoalState(solutionCode?: string): GitState {
  return React.useMemo(() => {
    const base = createInitialGitState();
    if (!solutionCode || !solutionCode.trim()) return base;
    const { state } = executeGitScript(base, solutionCode);
    return state;
  }, [solutionCode]);
}
