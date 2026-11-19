"use client";

/**
 * ファイル概要：
 * 90日間Java実務研修ロードマップ クライアントコンポーネント（/student/roadmap）
 */

import React, { useState } from "react";
import Link from "next/link";
import {
  CurriculumDay,
  CurriculumExecutionMode,
  CurriculumPhase,
  LearningStumbleAlert,
} from "@/types/curriculum";
import { CURRICULUM_PHASES } from "@/lib/curriculum/days-plan";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import {
  CalendarDays,
  CheckCircle2,
  Code2,
  Database,
  GitBranch,
  FileCheck2,
  HelpCircle,
  Clock,
  ArrowRight,
  AlertTriangle,
  Award,
  RefreshCw,
} from "lucide-react";

interface RoadmapClientProps {
  days: CurriculumDay[];
  completedProblemIds: string[];
  completedQuizDays: number[];
  submittedDeliverableDays: number[];
  stumbleAlerts: LearningStumbleAlert[];
}

function executionModeBadge(mode: CurriculumExecutionMode) {
  switch (mode) {
    case "auto_java":
      return {
        label: "Java自動採点",
        icon: Code2,
        cls: "bg-blue-50 text-blue-700 border-blue-200",
      };
    case "auto_sql":
      return {
        label: "SQL自動採点",
        icon: Database,
        cls: "bg-amber-50 text-amber-800 border-amber-200",
      };
    case "auto_git":
      return {
        label: "Gitビジュアル演習",
        icon: GitBranch,
        cls: "bg-purple-50 text-purple-700 border-purple-200",
      };
    case "deliverable_review":
      return {
        label: "成果物提出・レビュー",
        icon: FileCheck2,
        cls: "bg-emerald-50 text-emerald-800 border-emerald-200",
      };
    case "quiz_only":
    default:
      return {
        label: "解説・理解度テスト",
        icon: HelpCircle,
        cls: "bg-slate-100 text-slate-700 border-slate-200",
      };
  }
}

export function RoadmapClient({
  days,
  completedProblemIds,
  completedQuizDays,
  submittedDeliverableDays,
  stumbleAlerts,
}: RoadmapClientProps) {
  const [selectedPhase, setSelectedPhase] = useState<CurriculumPhase>(1);

  const completedProbSet = new Set(completedProblemIds);
  const quizDaySet = new Set(completedQuizDays);
  const delivDaySet = new Set(submittedDeliverableDays);

  const isDayCompleted = (d: CurriculumDay) => {
    if (d.problemIds.length > 0) {
      return d.problemIds.every((pid) => completedProbSet.has(pid));
    }
    if (d.executionMode === "deliverable_review") {
      return delivDaySet.has(d.day);
    }
    return quizDaySet.has(d.day);
  };

  const completedDaysCount = days.filter(isDayCompleted).length;
  const publishedDaysCount = days.filter((d) => d.status === "published").length;
  const overallPercent = Math.round((completedDaysCount / 90) * 100);

  const phaseInfo = CURRICULUM_PHASES.find((p) => p.phase === selectedPhase)!;
  const phaseDays = days.filter((d) => d.phase === selectedPhase);

  // 次に学習すべきDay（実装済みで未完了の最初）
  const nextRecommendedDay =
    days.find((d) => d.status === "published" && !isDayCompleted(d)) ?? days[0];

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl space-y-6">
      {/* ヘッダー＆90日間全体サマリー */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 md:p-8 shadow-lg space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-sky-200">
              <CalendarDays className="w-3.5 h-3.5" />
              90日間 Java実務エンジニア育成プログラム
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Java 90日間研修ロードマップ
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Java完全未経験から、基本文法・オブジェクト指向・コレクション・SQL/JDBC・Git・Spring Boot REST API開発・実務模擬プロジェクト（顧客・案件管理システム）までを毎日2〜3時間のステップで習得します。
            </p>
          </div>

          {nextRecommendedDay && (
            <Link
              href={`/student/roadmap/${nextRecommendedDay.day}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm shadow-md transition shrink-0"
            >
              Day {nextRecommendedDay.day} を学習する
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="rounded-xl bg-white/10 p-3.5">
            <div className="text-xs text-slate-300">90日間 全体進捗率</div>
            <div className="text-2xl font-extrabold mt-0.5">
              {overallPercent}%{" "}
              <span className="text-xs font-normal text-slate-300">
                （{completedDaysCount} / 90日完了）
              </span>
            </div>
            <ProgressBar
              value={overallPercent}
              className="mt-2 bg-white/20"
              indicatorClassName="bg-emerald-400"
            />
          </div>
          <div className="rounded-xl bg-white/10 p-3.5">
            <div className="text-xs text-slate-300">現在の到達レベル</div>
            <div className="text-lg font-bold mt-1">
              {completedDaysCount >= 60
                ? "第3フェーズ（Spring Boot実践）"
                : completedDaysCount >= 30
                ? "第2フェーズ（Java実務基礎）"
                : "第1フェーズ（Java基礎習得）"}
            </div>
          </div>
          <div className="rounded-xl bg-white/10 p-3.5">
            <div className="text-xs text-slate-300">教材公開ステータス</div>
            <div className="text-lg font-bold mt-1">
              公開済み: {publishedDaysCount}日{" "}
              <span className="text-xs font-normal text-slate-300">
                / 設計済み: {90 - publishedDaysCount}日
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* つまずき検知アラート */}
      {stumbleAlerts.length > 0 && (
        <div className="space-y-2">
          {stumbleAlerts.map((al, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950"
            >
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold">{al.title}</div>
                  <div className="text-xs text-amber-800 mt-0.5">{al.detail}</div>
                </div>
              </div>
              {al.recommendedDay && (
                <Link
                  href={`/student/roadmap/${al.recommendedDay}`}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Day {al.recommendedDay} を復習する
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* フェーズ切り替えタブ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {CURRICULUM_PHASES.map((p) => {
          const active = selectedPhase === p.phase;
          return (
            <button
              key={p.phase}
              type="button"
              onClick={() => setSelectedPhase(p.phase)}
              className={`text-left p-4 rounded-xl border-2 transition ${
                active
                  ? "bg-white border-blue-600 shadow-sm"
                  : "bg-white/70 border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    active
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {p.dayRange}
                </span>
              </div>
              <div className="font-bold text-slate-900 mt-2 text-sm">
                {p.title}
              </div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {p.goalSummary}
              </p>
            </button>
          );
        })}
      </div>

      {/* 選択フェーズの到達目標カード */}
      <Card className="border-blue-100 bg-blue-50/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-slate-900">
            {phaseInfo.title}（{phaseInfo.dayRange}）の到達目標
          </CardTitle>
          <CardDescription className="text-xs text-slate-700">
            {phaseInfo.goalSummary}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {phaseInfo.milestones.map((m, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-blue-200 text-xs font-medium text-slate-800"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                {m}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 日別カード一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {phaseDays.map((d) => {
          const done = isDayCompleted(d);
          const modeInfo = executionModeBadge(d.executionMode);
          const ModeIcon = modeInfo.icon;

          return (
            <Link
              key={d.day}
              href={`/student/roadmap/${d.day}`}
              className={`block rounded-xl border p-4 bg-white transition hover:shadow-md ${
                done
                  ? "border-emerald-300 bg-emerald-50/20"
                  : d.isExamDay
                  ? "border-indigo-300 bg-indigo-50/20"
                  : "border-slate-200 hover:border-blue-300"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`font-mono text-xs font-extrabold px-2.5 py-1 rounded-md ${
                      done
                        ? "bg-emerald-600 text-white"
                        : d.isExamDay
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-900 text-white"
                    }`}
                  >
                    Day {d.day}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${modeInfo.cls}`}
                  >
                    <ModeIcon className="w-3 h-3" />
                    {modeInfo.label}
                  </span>
                  {d.isExamDay && (
                    <Badge className="bg-indigo-600 text-white text-[10px] gap-1">
                      <Award className="w-3 h-3" />
                      実技試験
                    </Badge>
                  )}
                  {d.isReviewDay && (
                    <Badge
                      variant="outline"
                      className="text-[10px] border-amber-300 bg-amber-50 text-amber-800 gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      復習日
                    </Badge>
                  )}
                </div>

                {done ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                    完了
                  </span>
                ) : d.status === "published" ? (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 shrink-0">
                    学習可能
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0">
                    詳細教材準備中
                  </span>
                )}
              </div>

              <div className="mt-2.5">
                <div className="text-[11px] text-slate-500 font-medium">
                  {d.chapterTitle}
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-0.5">
                  {d.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {d.learningGoal}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  目安 {d.estimatedMinutes}分
                </span>
                <span className="font-semibold text-blue-600 inline-flex items-center gap-1">
                  詳細を開く
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
