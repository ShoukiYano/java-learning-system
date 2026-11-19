"use client";

/**
 * ファイル概要：
 * インタラクティブGit学習ワークスペースコンポーネント
 *
 * 主な処理：
 * 1. 2ペイン構成（左: ミッション説明＆Webターミナル / 右: リアルタイムSVG Gitツリーグラフ）
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
  Layers,
  ChevronDown,
  ChevronUp,
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

export function GitWorkspaceClient({
  problem,
  initialProgress,
  nextProblemId,
  courseId,
}: GitWorkspaceClientProps) {
  // 初期Gitツリーおよび目標ツリーの生成
  // starter_code に初期コマンドスクリプト（あれば）、solution_code に目標コマンドスクリプトが格納される設計
  const initialBaseState = useMemoInitialState(problem.starter_code);
  const goalTargetState = useMemoGoalState(problem.solution_code);

  const [gitState, setGitState] = useState<GitState>(initialBaseState);
  const [inputVal, setInputVal] = useState<string>("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [logs, setLogs] = useState<TerminalLogEntry[]>([
    {
      id: "init-1",
      type: "system",
      output: `DevSkill Git Simulator v1.0.0 [Ready]\n対象課題: ${problem.title}\n'help' で使用可能コマンド一覧、'reset' で初期状態に戻せます。`,
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

  // ターミナルログが追加されたら自動スクロール
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // 目標達成のリアルタイム判定
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

        // 提出APIを呼び出して受講生進捗を更新
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
            output: "🎉 CLEAR! 目標のGitツリーと完全一致しました！おめでとうございます！",
          },
        ]);
      }
    },
    [goalTargetState, isGoalAchieved, problem.id]
  );

  // コマンド実行ハンドラー
  const handleExecute = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const raw = inputVal.trim();
    if (!raw) return;

    setInputVal("");
    setCommandHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);

    // clear コマンド
    if (raw.toLowerCase() === "clear") {
      setLogs([]);
      return;
    }

    // reset コマンド
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

    // ゴール照合
    if (!res.isError) {
      checkGoal(res.state, newCommands);
    }
  };

  // 初期化リセット
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

  // 履歴（↑/↓キー）ナビゲーション
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
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

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 overflow-hidden">
      {/* 1. トップナビゲーションバー */}
      <header className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-sm">
        <div className="flex items-center space-x-3">
          <Link
            href={`/student/courses/${courseId}`}
            className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>コース詳細へ</span>
          </Link>
          <span className="text-slate-600">/</span>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-200">{problem.title}</span>
            <Badge variant="outline" className="text-xs border-indigo-500/40 text-indigo-400 bg-indigo-500/10">
              <Layers className="w-3 h-3 mr-1" />
              Git演習
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {difficultyLabel(problem.difficulty).label}
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* 目標ツリー表示トグル */}
          <Button
            size="sm"
            variant={showGoalModal ? "default" : "outline"}
            className={showGoalModal ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "border-slate-700 text-slate-300"}
            onClick={() => setShowGoalModal(!showGoalModal)}
          >
            <Target className="w-3.5 h-3.5 mr-1.5" />
            到達目標 (Goal)
          </Button>

          {/* リセット */}
          <Button
            size="sm"
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
            onClick={handleReset}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            リセット
          </Button>

          {/* 次の問題ボタン（クリア時） */}
          {isGoalAchieved && nextProblemId && (
            <Link href={`/student/problems/${nextProblemId}`}>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse">
                次の問題へ
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* 2. メイン 2ペインレイアウト */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* 左側ペイン (md:col-span-5): ミッション指示 & Webターミナル */}
        <div className="md:col-span-5 flex flex-col border-r border-slate-800 bg-slate-900/60 overflow-hidden">
          {/* 上部: ミッション説明カード */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/40 overflow-y-auto max-h-[42%]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Mission Objective
              </span>
              <div className="flex items-center text-xs text-slate-400 space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatDuration(problem.estimated_minutes)}</span>
              </div>
            </div>

            <div className="text-slate-300 text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
              <MarkdownRenderer content={problem.description_md} />
            </div>

            {/* ヒントアコーディオン */}
            {problem.explanation_md && (
              <div className="mt-3 pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center justify-between w-full text-xs text-amber-400 hover:text-amber-300 font-medium"
                >
                  <span className="flex items-center">
                    <Lightbulb className="w-3.5 h-3.5 mr-1.5" />
                    解法のヒントを見る
                  </span>
                  {showHint ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {showHint && (
                  <div className="mt-2 p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
                    <MarkdownRenderer content={problem.explanation_md} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 下部: Webターミナル */}
          <div className="flex-1 flex flex-col bg-slate-950 font-mono text-xs overflow-hidden">
            {/* ターミナルヘッダー */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 select-none">
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-slate-400 text-[11px] font-sans flex items-center">
                  <TerminalIcon className="w-3 h-3 mr-1" />
                  git-bash (interactive)
                </span>
              </div>
              <div className="text-[10px] text-slate-500">
                ブランチ: <span className="text-emerald-400">{gitState.head.isDetached ? "(detached)" : gitState.head.target}</span>
              </div>
            </div>

            {/* ログ出力領域 */}
            <div
              className="flex-1 p-3 overflow-y-auto space-y-2 select-text"
              onClick={() => inputRef.current?.focus()}
            >
              {logs.map((log) => (
                <div key={log.id} className="space-y-0.5">
                  {log.command && (
                    <div className="flex items-center space-x-1.5 text-sky-400">
                      <span className="text-emerald-400 select-none">$</span>
                      <span className="font-semibold">{log.command}</span>
                    </div>
                  )}
                  {log.output && (
                    <div
                      className={`whitespace-pre-wrap pl-3 leading-relaxed ${
                        log.type === "success"
                          ? "text-emerald-400 font-bold bg-emerald-500/10 p-2 rounded border border-emerald-500/30"
                          : log.isError
                          ? "text-rose-400"
                          : log.type === "system"
                          ? "text-slate-400 italic"
                          : "text-slate-300"
                      }`}
                    >
                      {log.output}
                    </div>
                  )}
                </div>
              ))}
              <div ref={terminalBottomRef} />
            </div>

            {/* コマンド入力フォーム */}
            <form
              onSubmit={handleExecute}
              className="flex items-center px-3 py-2 bg-slate-900/90 border-t border-slate-800"
            >
              <span className="text-emerald-400 font-bold mr-2 select-none">$ git</span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="commit, branch <名>, switch <名>, merge <名>..."
                className="flex-1 bg-transparent text-slate-100 outline-none placeholder:text-slate-600 font-mono text-xs"
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
              <Button
                type="submit"
                size="sm"
                className="h-6 px-2.5 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                実行
              </Button>
            </form>
          </div>
        </div>

        {/* 右側ペイン (md:col-span-7): ビジュアルGitツリーグラフ */}
        <div className="md:col-span-7 relative flex flex-col bg-slate-950 overflow-hidden">
          {/* グラフヘッダー */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/40 border-b border-slate-800/80">
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400">現在のリポジトリ状態:</span>
              <span className="font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                コミット数: {Object.keys(gitState.commits).length}
              </span>
              <span className="font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                HEAD: {gitState.head.isDetached ? `(${gitState.head.target})` : gitState.head.target}
              </span>
            </div>

            {isGoalAchieved ? (
              <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>GOAL ACHIEVED!</span>
              </div>
            ) : (
              <span className="text-xs text-slate-500">コマンドを実行するとグラフがリアルタイム変化します</span>
            )}
          </div>

          {/* SVG Gitツリーグラフ */}
          <div className="flex-1 w-full h-full relative overflow-auto bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
            <GitGraphVisualizer state={gitState} />

            {/* フローティング目標ツリー (Goal Tree) ウィンドウ */}
            {showGoalModal && (
              <div className="absolute top-4 right-4 w-72 md:w-80 rounded-xl bg-slate-900/95 border border-indigo-500/30 shadow-2xl backdrop-blur-md overflow-hidden z-20 transition-all duration-200">
                <div className="flex items-center justify-between px-3 py-2 bg-indigo-950/50 border-b border-indigo-500/20">
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-300">
                    <Target className="w-3.5 h-3.5 text-indigo-400" />
                    <span>到達目標 (Goal Tree)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowGoalModal(false)}
                    className="text-slate-400 hover:text-slate-200 text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-2 max-h-56 overflow-auto">
                  <GitGraphVisualizer state={goalTargetState} isGoalView={true} />
                </div>
                <div className="px-3 py-1.5 bg-slate-950/70 border-t border-slate-800 text-[10px] text-slate-400 text-center">
                  このグラフと同じブランチ・コミット構造を作ればクリア！
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 初期状態スクリプトをパースしてGitStateを生成するフック
 */
function useMemoInitialState(starterCode?: string): GitState {
  return React.useMemo(() => {
    const base = createInitialGitState();
    if (!starterCode || !starterCode.trim()) return base;
    const { state } = executeGitScript(base, starterCode);
    return state;
  }, [starterCode]);
}

/**
 * 目標状態スクリプト（模範解答）をパースしてGoalのGitStateを生成するフック
 */
function useMemoGoalState(solutionCode?: string): GitState {
  return React.useMemo(() => {
    const base = createInitialGitState();
    if (!solutionCode || !solutionCode.trim()) return base;
    const { state } = executeGitScript(base, solutionCode);
    return state;
  }, [solutionCode]);
}
