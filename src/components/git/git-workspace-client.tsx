"use client";

/**
 * ファイル概要：
 * インタラクティブGit学習ワークスペースコンポーネント（高視認性ライトUI）
 *
 * 主な処理：
 * 1. 2ペイン構成（左: 白背景ミッション説明＆見やすいWebターミナル / 右: 明るい方眼キャンバス上のリアルタイムSVG Gitツリーグラフ）
 * 2. 仮想Gitエンジンによるコマンド逐次実行とエラー・ログ出力
 * 3. 到達目標（Goal Tree）とのリアルタイム自動比較と合格判定
 * 4. 紙吹雪アニメーション（canvas-confetti）および進捗提出API連携
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  GitState,
  createInitialGitState,
  executeGitCommand,
  executeGitScript,
  compareGitStates,
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
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Clock,
  Sparkles,
  GitBranch,
  ChevronDown,
  ChevronUp,
  Send,
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
  { label: "git commit", cmd: "commit" },
  { label: "git branch", cmd: "branch " },
  { label: "git switch", cmd: "switch " },
  { label: "git merge", cmd: "merge " },
  { label: "git status", cmd: "status" },
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
      output: `DevSkill Git Simulator 起動完了\n下の入力欄に git コマンドを入力して Enter を押してください（例: commit, branch bugfix, help）。`,
    },
  ]);

  const [isGoalAchieved, setIsGoalAchieved] = useState<boolean>(
    initialProgress?.status === "completed"
  );
  const [showGoalModal, setShowGoalModal] = useState<boolean>(true);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [executedCommands, setExecutedCommands] = useState<string[]>([]);

  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
            output: "🎉 CLEAR! 目標のGitツリーと完全一致しました！合格記録を保存しました。",
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
        command: raw.startsWith("git ") ? raw : `git ${raw}`,
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

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 overflow-hidden">
      {/* 1. トップナビゲーションバー（清潔なライトテーマ） */}
      <header className="flex flex-wrap items-center justify-between gap-2 px-5 py-2.5 bg-white border-b border-slate-200 shadow-xs text-sm">
        <div className="flex items-center space-x-3">
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
            variant={showGoalModal ? "default" : "outline"}
            className={
              showGoalModal
                ? "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
            }
            onClick={() => setShowGoalModal(!showGoalModal)}
          >
            <Target className="w-4 h-4 mr-1.5" />
            {showGoalModal ? "到達目標を隠す" : "到達目標を表示"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="bg-white border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            リセット
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

      {/* 2. メイン 2ペインレイアウト */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* 左側ペイン (lg:col-span-5): ミッション指示（白背景） & Webターミナル（高コントラスト） */}
        <div className="lg:col-span-5 flex flex-col border-r border-slate-200 bg-white overflow-hidden">
          {/* 上部: ミッション説明カード（白背景でくっきり可読） */}
          <div className="p-5 border-b border-slate-200 bg-white overflow-y-auto max-h-[46%]">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                <Sparkles className="w-3.5 h-3.5" />
                ミッション内容
              </span>
              <div className="flex items-center text-xs font-medium text-slate-500 gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>目安: {formatDuration(problem.estimated_minutes)}</span>
              </div>
            </div>

            <div className="text-slate-800 text-sm leading-relaxed">
              <MarkdownRenderer content={problem.description_md} />
            </div>

            {/* ヒントアコーディオン */}
            {problem.explanation_md && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-xs text-amber-900 font-bold transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    解法のヒントを見る
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

          {/* 下部: Webターミナル（高コントラスト・大きめ文字） */}
          <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 font-mono text-sm overflow-hidden">
            {/* ターミナルヘッダー */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 select-none">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="ml-1 text-slate-200 text-xs font-sans font-semibold flex items-center gap-1.5">
                  <TerminalIcon className="w-3.5 h-3.5 text-sky-400" />
                  Git コマンドターミナル
                </span>
              </div>
              <div className="text-xs text-slate-300 font-sans">
                現在のブランチ:{" "}
                <span className="font-mono font-bold text-emerald-400">
                  {gitState.head.isDetached
                    ? `(detached: ${gitState.head.target})`
                    : gitState.head.target}
                </span>
              </div>
            </div>

            {/* ログ出力領域 */}
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
                          ? "text-rose-300 bg-rose-950/50 p-2 rounded border border-rose-500/30"
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

            {/* クイックコマンド補助チップ */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 border-t border-slate-700 overflow-x-auto">
              <span className="text-[11px] font-sans text-slate-400 shrink-0 mr-1">
                入力補助:
              </span>
              {QUICK_COMMANDS.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => handleQuickInsert(q.cmd)}
                  className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-mono shrink-0 transition-colors"
                >
                  {q.label}
                </button>
              ))}
            </div>

            {/* コマンド入力フォーム */}
            <form
              onSubmit={handleExecute}
              className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-t-2 border-blue-500"
            >
              <span className="text-emerald-400 font-bold select-none shrink-0">
                $ git
              </span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="commit / branch bugfix / switch bugfix / merge feature ..."
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

        {/* 右側ペイン (lg:col-span-7): 明るく見やすいビジュアルGitツリーグラフ */}
        <div className="lg:col-span-7 relative flex flex-col bg-slate-50 overflow-hidden">
          {/* グラフステータスバー */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2.5 bg-white border-b border-slate-200">
            <div className="flex items-center gap-2.5 text-xs">
              <span className="font-bold text-slate-700">現在のリポジトリ:</span>
              <span className="font-mono font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                コミット数: {Object.keys(gitState.commits).length}
              </span>
              <span className="font-mono font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                HEAD →{" "}
                {gitState.head.isDetached
                  ? `(${gitState.head.target})`
                  : gitState.head.target}
              </span>
            </div>

            {isGoalAchieved ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ミッション達成！CLEAR</span>
              </div>
            ) : (
              <span className="text-xs font-medium text-slate-500">
                コマンドを実行すると下のツリーがリアルタイムに変化します
              </span>
            )}
          </div>

          {/* 明るい方眼ドット背景上のSVG Gitツリーグラフ */}
          <div className="flex-1 w-full h-full relative overflow-auto bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:20px_20px]">
            <GitGraphVisualizer state={gitState} />

            {/* クリア時のお祝いバナー */}
            {isGoalAchieved && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4 px-5 py-3 rounded-xl bg-emerald-600 text-white shadow-xl z-20">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <div className="text-sm font-bold">
                  🎉 ミッションクリア！目標のGitツリーと完全一致しました！
                </div>
                {nextProblemId && (
                  <Link href={`/student/problems/${nextProblemId}`}>
                    <Button
                      size="sm"
                      className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold"
                    >
                      次の問題へ
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            )}

            {/* フローティング到達目標（Goal Tree）カード（明るい白カード） */}
            {showGoalModal && (
              <div className="absolute top-4 right-4 w-72 md:w-80 rounded-xl bg-white/95 border-2 border-indigo-200 shadow-xl backdrop-blur-sm overflow-hidden z-20">
                <div className="flex items-center justify-between px-3.5 py-2 bg-indigo-50 border-b border-indigo-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                    <Target className="w-4 h-4 text-indigo-600" />
                    <span>到達目標 (Goal Tree)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowGoalModal(false)}
                    className="text-slate-500 hover:text-slate-800 text-xs font-bold px-1.5 py-0.5 rounded hover:bg-indigo-100"
                    aria-label="閉じる"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-2 bg-slate-50/70 max-h-80 overflow-auto">
                  <GitGraphVisualizer state={goalTargetState} isGoalView={true} />
                </div>
                <div className="px-3 py-2 bg-white border-t border-slate-200 text-[11px] font-medium text-slate-600 text-center">
                  この図と同じブランチ・コミット構造を作ればクリア！
                </div>
              </div>
            )}
          </div>
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
