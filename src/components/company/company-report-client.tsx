"use client";

import React from "react";
import Link from "next/link";
import { StudentAnalyticsRecord } from "@/lib/mock-analytics";
import { TrainingMilestone } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Printer,
  ArrowLeft,
  Building2,
  AlertTriangle,
  Flag,
  CheckCircle2,
} from "lucide-react";

interface Props {
  companyName: string;
  students: StudentAnalyticsRecord[];
  milestones: TrainingMilestone[];
  delayAlertDays: number;
  generatedAt: string;
}

export function CompanyReportClient({
  companyName,
  students,
  milestones,
  delayAlertDays,
  generatedAt,
}: Props) {
  const delayedStudents = students.filter((s) => s.isDelayed);
  const avgProgress = Math.round(
    students.reduce((acc, s) => acc + s.progressPercent, 0) /
      (students.length || 1)
  );
  const avgWeeklyMinutes = Math.round(
    students.reduce((acc, s) => acc + s.weeklyMinutes, 0) /
      (students.length || 1)
  );
  const totalCompleted = students.reduce((acc, s) => acc + s.completedProblems, 0);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-5xl space-y-6 print:max-w-none print:px-0 print:py-0 print:space-y-4">
      {/* 操作バー（印刷時は非表示） */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/company"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          企業ダッシュボードへ戻る
        </Link>
        <Button
          type="button"
          onClick={() => window.print()}
          className="bg-emerald-700 hover:bg-emerald-600 text-white"
        >
          <Printer className="h-4 w-4 mr-1.5" />
          PDFとして保存 / 印刷する
        </Button>
      </div>

      {/* A4 レポート本体 */}
      <div className="bg-white border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 print:border-0 print:shadow-none print:p-2">
        {/* レポートヘッダー */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1">
              <Building2 className="h-4 w-4" />
              DevSkillStudio 研修進捗サマリーレポート
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {companyName} 御中 エンジニア研修 進捗報告書
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              遅れアラート判定基準：未ログイン {delayAlertDays} 日以上
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>作成日時：{generatedAt}</div>
            <div>対象受講生：{students.length} 名</div>
          </div>
        </div>

        {/* KPI サマリー */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border">
            <div className="text-[11px] text-slate-500">対象受講生数</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {students.length} <span className="text-xs font-normal">名</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="text-[11px] text-emerald-800">平均カリキュラム進捗率</div>
            <div className="text-2xl font-extrabold text-emerald-700 mt-1">
              {avgProgress}%
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
            <div className="text-[11px] text-blue-800">平均週間学習時間</div>
            <div className="text-2xl font-extrabold text-blue-700 mt-1">
              {avgWeeklyMinutes} <span className="text-xs font-normal">分/週</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200">
            <div className="text-[11px] text-rose-800">要フォロー（遅れ）</div>
            <div className="text-2xl font-extrabold text-rose-700 mt-1">
              {delayedStudents.length} <span className="text-xs font-normal">名</span>
            </div>
          </div>
        </div>

        {/* 目標マイルストーン一覧 */}
        {milestones.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Flag className="h-4 w-4 text-amber-600" />
              研修目標マイルストーン達成状況
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {milestones.map((m) => {
                const achievedCount = students.filter(
                  (s) => s.completedProblems >= m.target_problem_count
                ).length;
                return (
                  <div
                    key={m.id}
                    className="p-3 rounded-lg border bg-amber-50/30 flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{m.title}</div>
                      <div className="text-slate-500">
                        {m.target_days_offset != null
                          ? `目安: 登録から ${m.target_days_offset}日後`
                          : `目標期日: ${m.target_date}`}{" "}
                        ／ 基準: {m.target_problem_count}問以上
                      </div>
                    </div>
                    <div className="text-right font-bold text-amber-800 shrink-0">
                      達成 {achievedCount} / {students.length} 名
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 要フォロー受講生サマリー */}
        {delayedStudents.length > 0 && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
            <h2 className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              要フォロー対象受講生（{delayedStudents.length}名）
            </h2>
            <ul className="text-xs text-rose-900 space-y-1 list-disc list-inside">
              {delayedStudents.map((s) => (
                <li key={s.id}>
                  <strong>{s.fullName}</strong>（進捗 {s.progressPercent}% / クリア{" "}
                  {s.completedProblems}問 / 最終ログイン: {s.lastLoginAt}）
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 受講生別 進捗一覧テーブル */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            受講生別 学習進捗一覧（総クリア問題数：{totalCompleted}問）
          </h2>
          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 border-b">
                <tr>
                  <th className="py-2.5 px-3">氏名</th>
                  <th className="py-2.5 px-3">ステータス</th>
                  <th className="py-2.5 px-3 text-right">進捗率</th>
                  <th className="py-2.5 px-3 text-right">クリア問数</th>
                  <th className="py-2.5 px-3 text-right">週間学習</th>
                  <th className="py-2.5 px-3 text-right">連続日数</th>
                  <th className="py-2.5 px-3">最終ログイン</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {students.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2 px-3 font-bold text-slate-900">
                      {s.fullName}
                    </td>
                    <td className="py-2 px-3">
                      <Badge
                        variant={s.isDelayed ? "destructive" : "success"}
                        className="text-[10px]"
                      >
                        {s.isDelayed ? "要フォロー" : "順調"}
                      </Badge>
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold">
                      {s.progressPercent}%
                    </td>
                    <td className="py-2 px-3 text-right font-mono">
                      {s.completedProblems} / {s.totalProblems}
                    </td>
                    <td className="py-2 px-3 text-right font-mono">
                      {s.weeklyMinutes}分
                    </td>
                    <td className="py-2 px-3 text-right font-mono">
                      {s.streakDays}日
                    </td>
                    <td className="py-2 px-3 text-slate-500">{s.lastLoginAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
