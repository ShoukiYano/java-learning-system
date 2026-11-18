"use client";

import React from "react";
import Link from "next/link";
import { DEMO_STUDENTS_ANALYTICS } from "@/lib/mock-analytics";
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
  Download,
  AlertTriangle,
  Users,
  Clock,
  BarChart3,
  Eye,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

export default function CompanyDashboardPage() {
  // 自社テナント（ACMEテクノロジーズ）に紐づく受講生のみフィルタリング（RLSでも同様に自社のみ取得）
  const companyStudents = DEMO_STUDENTS_ANALYTICS.filter(
    (s) => s.companyId === "00000000-0000-4000-8000-000000000001"
  );

  const delayedStudents = companyStudents.filter((s) => s.isDelayed);
  const avgProgress = Math.round(
    companyStudents.reduce((acc, cur) => acc + cur.progressPercent, 0) /
      (companyStudents.length || 1)
  );
  const avgWeeklyMinutes = Math.round(
    companyStudents.reduce((acc, cur) => acc + cur.weeklyMinutes, 0) /
      (companyStudents.length || 1)
  );

  // CSVエクスポート（Excelで文字化けしないBOM付きUTF-8）
  const handleExportCsv = () => {
    const headers = [
      "受講生氏名",
      "メールアドレス",
      "所属企業",
      "全体進捗率(%)",
      "クリア問題数",
      "全問題数",
      "今週の学習時間(分)",
      "累計学習時間(分)",
      "最終ログイン日時",
      "ステータス",
      "直近の講師評価(5段階)",
    ];

    const rows = companyStudents.map((s) => [
      s.fullName,
      s.email,
      s.companyName,
      String(s.progressPercent),
      String(s.completedProblems),
      String(s.totalProblems),
      String(s.weeklyMinutes),
      String(s.totalMinutes),
      s.lastLoginAt,
      s.isDelayed ? `要フォロー（${s.delayReason ?? "遅れ"}）` : "順調",
      String(s.evaluations[0]?.rating ?? "-"),
    ]);

    const csvContent =
      "\uFEFF" +
      [headers, ...rows]
        .map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        )
        .join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `devskill_training_report_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            自社受講生 研修状況一覧（株式会社ACMEテクノロジーズ）
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            自社テナントに所属する受講生の進捗率・学習時間・遅れアラート、および受講中のカリキュラム内容（Java・SQL）を確認できます。
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/company/courses"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border bg-white hover:bg-slate-100 text-xs font-semibold text-slate-800 shadow-sm"
          >
            <BookOpen className="h-4 w-4 text-emerald-600" />
            カリキュラム内容を確認
          </Link>
          <Button
            onClick={handleExportCsv}
            className="bg-emerald-700 hover:bg-emerald-600 text-white"
          >
            <Download className="h-4 w-4" />
            研修進捗レポートをCSV出力
          </Button>
        </div>
      </div>

      {/* 遅れている受講生のアラートバナー */}
      {delayedStudents.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-rose-950">
                遅れている受講生のアラート（{delayedStudents.length}名）
              </h3>
              <p className="text-xs text-rose-800 mt-0.5">
                {delayedStudents
                  .map((d) => `${d.fullName}（${d.delayReason}）`)
                  .join(" / ")}
              </p>
            </div>
          </div>

          <Link
            href={`/company/students/${delayedStudents[0].id}`}
            className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shrink-0"
          >
            該当受講生の詳細を確認
          </Link>
        </div>
      )}

      {/* 企業サマリーKPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>自社受講生数</span>
              <Users className="h-4 w-4 text-emerald-600" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold">
              {companyStudents.length} 名
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">
              順調: {companyStudents.length - delayedStudents.length}名 ／ 要フォロー:{" "}
              {delayedStudents.length}名
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>自社平均カリキュラム進捗率</span>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold text-blue-700">
              {avgProgress}%
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <ProgressBar value={avgProgress} />
            <p className="text-xs text-slate-500">Java・SQLカリキュラム基準</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>1人あたりの週間平均学習時間</span>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold">
              {avgWeeklyMinutes} 分
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">直近7日間の平均演習時間</p>
          </CardContent>
        </Card>
      </div>

      {/* 自社受講生テーブル */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">自社受講生一覧</CardTitle>
          <CardDescription className="text-xs">
            ※ 企業担当者アカウントは自社テナントの受講生データおよびカリキュラム内容の閲覧が可能です（編集不可）。
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b text-slate-500 bg-slate-50">
                <th className="py-3 px-3 font-semibold">受講生氏名</th>
                <th className="py-3 px-3 font-semibold">ステータス</th>
                <th className="py-3 px-3 font-semibold w-52">
                  カリキュラム進捗率
                </th>
                <th className="py-3 px-3 font-semibold">今週の学習時間</th>
                <th className="py-3 px-3 font-semibold">累計学習時間</th>
                <th className="py-3 px-3 font-semibold">最終ログイン</th>
                <th className="py-3 px-3 font-semibold">講師評価</th>
                <th className="py-3 px-3 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {companyStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900">{st.fullName}</div>
                    <div className="text-[11px] text-slate-500">{st.email}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    {st.isDelayed ? (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        遅れアラート
                      </Badge>
                    ) : (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        順調
                      </Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span>
                          {st.completedProblems}/{st.totalProblems}問
                        </span>
                        <span className="text-blue-600">
                          {st.progressPercent}%
                        </span>
                      </div>
                      <ProgressBar
                        value={st.progressPercent}
                        indicatorClassName={
                          st.isDelayed ? "bg-rose-500" : "bg-emerald-600"
                        }
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-semibold">
                    {st.weeklyMinutes} 分
                  </td>
                  <td className="py-3.5 px-3 text-slate-600">
                    {st.totalMinutes} 分
                  </td>
                  <td className="py-3.5 px-3 text-slate-600">
                    {st.lastLoginAt}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-amber-600">
                    ★ {st.evaluations[0]?.rating ?? "-"} / 5
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <Link
                      href={`/company/students/${st.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border bg-white hover:bg-slate-100 font-semibold text-slate-800"
                    >
                      <Eye className="h-3.5 w-3.5 text-emerald-600" />
                      詳細を見る
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
