import React from "react";
import Link from "next/link";
import { SEED_PROBLEMS } from "@/lib/seed-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import {
  Users,
  Activity,
  BarChart2,
  AlertTriangle,
  History,
  FilePlus2,
  Edit3,
  ArrowRight,
} from "lucide-react";

export default async function AdminDashboardPage() {
  // つまずき問題TOP5（平均挑戦回数・失敗率が高い問題）
  const stumblingTop5 = [
    {
      id: SEED_PROBLEMS[11].id,
      title: SEED_PROBLEMS[11].title,
      avgAttempts: 4.2,
      failRate: 58,
      avgMinutes: 24,
    },
    {
      id: SEED_PROBLEMS[8].id,
      title: SEED_PROBLEMS[8].title,
      avgAttempts: 3.6,
      failRate: 49,
      avgMinutes: 19,
    },
    {
      id: SEED_PROBLEMS[10].id,
      title: SEED_PROBLEMS[10].title,
      avgAttempts: 3.1,
      failRate: 42,
      avgMinutes: 18,
    },
    {
      id: SEED_PROBLEMS[7].id,
      title: SEED_PROBLEMS[7].title,
      avgAttempts: 2.8,
      failRate: 36,
      avgMinutes: 16,
    },
    {
      id: SEED_PROBLEMS[4].id,
      title: SEED_PROBLEMS[4].title,
      avgAttempts: 2.3,
      failRate: 28,
      avgMinutes: 14,
    },
  ];

  const recentSubmissions = [
    {
      id: "adm-sub-1",
      studentId: "demo-student-1",
      studentName: "山田 太郎",
      companyName: "株式会社ACMEテクノロジーズ",
      problemId: SEED_PROBLEMS[4].id,
      problemTitle: SEED_PROBLEMS[4].title,
      status: "passed",
      submittedAt: "10分前",
    },
    {
      id: "adm-sub-2",
      studentId: "demo-student-2",
      studentName: "鈴木 花子",
      companyName: "株式会社ACMEテクノロジーズ",
      problemId: SEED_PROBLEMS[8].id,
      problemTitle: SEED_PROBLEMS[8].title,
      status: "wrong_answer",
      submittedAt: "25分前",
    },
    {
      id: "adm-sub-3",
      studentId: "demo-student-3",
      studentName: "高橋 健太",
      companyName: "ネクストシステムズ株式会社",
      problemId: SEED_PROBLEMS[1].id,
      problemTitle: SEED_PROBLEMS[1].title,
      status: "compile_error",
      submittedAt: "1時間前",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            管理者ダッシュボード
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            受講生全体のアクティブ状況、平均進捗、つまずき問題TOP5、直近の提出を一目で把握できます。
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/problems/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition"
          >
            <FilePlus2 className="h-4 w-4" />
            新規Java問題を作成
          </Link>
        </div>
      </div>

      {/* KPIカード（受講生数、アクティブ率、平均進捗） */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>総受講生数（法人・個人合計）</span>
              <Users className="h-4 w-4 text-blue-600" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold">28 名</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">
              導入企業 2社（ACMEテクノロジーズ / ネクストシステムズ）
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>週間アクティブ率（直近7日以内ログイン）</span>
              <Activity className="h-4 w-4 text-emerald-600" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold text-emerald-700">
              89.3%
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <ProgressBar value={89} indicatorClassName="bg-emerald-600" />
            <p className="text-xs text-slate-500">28名中 25名が今週演習を実施</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>全受講生の平均カリキュラム進捗率</span>
              <BarChart2 className="h-4 w-4 text-indigo-600" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold text-indigo-700">
              64.2%
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <ProgressBar value={64} indicatorClassName="bg-indigo-600" />
            <p className="text-xs text-slate-500">全12問中 平均 7.7 問クリア</p>
          </CardContent>
        </Card>
      </div>

      {/* つまずき問題TOP5 ＆ 直近の提出 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              つまずき問題 TOP5（失敗率・平均挑戦回数順）
            </CardTitle>
            <CardDescription className="text-xs">
              受講生が苦戦している問題を特定し、ヒントや解説の改善に役立てます。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stumblingTop5.map((item, idx) => (
              <div
                key={item.id}
                className="p-3 rounded-xl border bg-slate-50/70 flex items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-xs text-slate-900 truncate">
                      {item.title}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-3 pl-7">
                    <span>平均挑戦: <strong>{item.avgAttempts}回</strong></span>
                    <span>不通過率: <strong className="text-rose-600">{item.failRate}%</strong></span>
                    <span>平均所要: {item.avgMinutes}分</span>
                  </div>
                </div>

                <Link
                  href={`/admin/problems/${item.id}/edit`}
                  className="px-2.5 py-1.5 rounded border bg-white hover:bg-slate-100 text-xs font-medium inline-flex items-center gap-1 shrink-0"
                >
                  <Edit3 className="h-3 w-3" />
                  編集
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <History className="h-4 w-4 text-blue-600" />
              直近の提出（リアルタイム監視）
            </CardTitle>
            <CardDescription className="text-xs">
              受講生詳細ページから提出コードの確認と個別フィードバック送信が可能です。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="p-3 rounded-xl border bg-white flex items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">
                      {sub.studentName}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      （{sub.companyName}）
                    </span>
                    {sub.status === "passed" ? (
                      <Badge variant="success">AC (合格)</Badge>
                    ) : sub.status === "compile_error" ? (
                      <Badge variant="destructive">CE (コンパイルエラー)</Badge>
                    ) : (
                      <Badge variant="warning">WA (不正解)</Badge>
                    )}
                  </div>
                  <div className="text-xs text-slate-600">
                    問題: {sub.problemTitle} ・ <span className="text-slate-400">{sub.submittedAt}</span>
                  </div>
                </div>

                <Link
                  href={`/admin/students/${sub.studentId}`}
                  className="text-xs text-indigo-600 hover:underline font-semibold inline-flex items-center gap-1 shrink-0"
                >
                  コード確認・評価
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
