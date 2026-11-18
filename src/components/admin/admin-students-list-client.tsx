"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StudentAnalyticsRecord } from "@/lib/mock-analytics";
import { exportStudentsProgressToCsv } from "@/lib/csv-export";
import { Button } from "@/components/ui/button";
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
  Users,
  AlertTriangle,
  Building2,
  ArrowRight,
  Download,
} from "lucide-react";

export function AdminStudentsListClient({
  students,
}: {
  students: StudentAnalyticsRecord[];
}) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("ALL");

  // 企業リストの重複排除
  const companyOptions = Array.from(
    new Map(
      students
        .filter((s) => s.companyId)
        .map((s) => [s.companyId, { id: s.companyId, name: s.companyName }])
    ).values()
  );

  const filteredStudents =
    selectedCompanyId === "ALL"
      ? students
      : students.filter((s) => s.companyId === selectedCompanyId);

  const handleExportCsv = () => {
    const label =
      selectedCompanyId === "ALL"
        ? "all_companies_students_report"
        : `company_students_report_${
            companyOptions.find((c) => c.id === selectedCompanyId)?.name ??
            "tenant"
          }`;
    exportStudentsProgressToCsv(filteredStudents, label);
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            全テナント受講生一覧・進捗監視・CSV出力
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            全導入企業（または選択した企業）の受講生の進捗率・章別内訳・スキル習得率・講師評価を一覧で確認し、CSVで出力できます。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* 企業フィルタ */}
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-800 shadow-sm"
          >
            <option value="ALL">
              すべての企業（全テナント合計 {students.length} 名）
            </option>
            {companyOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* CSV出力ボタン */}
          <Button
            onClick={handleExportCsv}
            className="bg-emerald-700 hover:bg-emerald-600 text-white"
          >
            <Download className="h-4 w-4" />
            {selectedCompanyId === "ALL"
              ? "全企業の受講生進捗をCSV一括出力"
              : "選択企業の受講生進捗をCSV出力"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-600" />
            対象受講生一覧（{filteredStudents.length} 名）
          </CardTitle>
          <CardDescription className="text-xs">
            「詳細・フィードバック」から提出コードのレビューと5段階評価の登録が可能です。
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          {filteredStudents.map((st) => (
            <div
              key={st.id}
              className="py-4 first:pt-0 last:pb-0 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="space-y-1 min-w-[240px]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">
                    {st.fullName}
                  </span>
                  {st.isDelayed ? (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      遅れアラート
                    </Badge>
                  ) : (
                    <Badge variant="success">順調</Badge>
                  )}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{st.companyName}</span>
                  <span>({st.email})</span>
                </div>
              </div>

              <div className="w-full sm:w-56 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">
                    進捗: {st.completedProblems}/{st.totalProblems}問
                  </span>
                  <span className="font-bold text-indigo-600">
                    {st.progressPercent}%
                  </span>
                </div>
                <ProgressBar value={st.progressPercent} />
              </div>

              <div className="text-xs text-slate-600 space-y-0.5">
                <div>
                  今週の学習: <strong>{st.weeklyMinutes}分</strong> ／ 累計:{" "}
                  <strong>{st.totalMinutes}分</strong>
                </div>
                <div className="text-slate-400">
                  最終ログイン: {st.lastLoginAt}
                </div>
              </div>

              <Link
                href={`/admin/students/${st.id}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                詳細・フィードバック
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
