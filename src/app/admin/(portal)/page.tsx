import React from "react";
import Link from "next/link";
import { getAdminOverviewFromDb } from "@/lib/data-service";
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
  Building2,
  BookOpen,
  Users,
  AlertTriangle,
  History,
  FilePlus2,
  Edit3,
  ArrowRight,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const overview = await getAdminOverviewFromDb();

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            システム管理者統括ダッシュボード（テナント管理・カリキュラム管理）
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            契約企業テナントの管理と、Java・SQLカリキュラム全体の作成・つまずき分析をデータベースからリアルタイムに一元管理します。
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/companies"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-sm transition"
          >
            <Building2 className="h-4 w-4 text-purple-600" />
            テナント（企業）管理
          </Link>
          <Link
            href="/admin/problems/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition"
          >
            <FilePlus2 className="h-4 w-4" />
            新規問題を作成（Java / SQL）
          </Link>
        </div>
      </div>

      {/* KPIカード（テナント数・カリキュラム数・全体アクティブ率） */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>契約テナント企業数 ／ 総受講生数</span>
              <Building2 className="h-4 w-4 text-purple-600" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold">
              {overview.companyCount} 社{" "}
              <span className="text-base font-medium text-slate-500">
                （計 {overview.totalStudents} 名）
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/companies"
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              テナント企業の追加・企業コード発行へ →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>公開カリキュラム全体構成</span>
              <BookOpen className="h-4 w-4 text-emerald-600" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold text-emerald-700">
              {overview.courseCount} コース / 全 {overview.problemCount} 問
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">
              Java入門コース ＋ SQL実践コース
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>全テナント受講生の平均進捗率</span>
              <Users className="h-4 w-4 text-indigo-600" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold text-indigo-700">
              {overview.avgProgress}%
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <ProgressBar
              value={overview.avgProgress}
              indicatorClassName="bg-indigo-600"
            />
            <p className="text-xs text-slate-500">
              週間アクティブ率: {overview.activeRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* つまずき問題TOP5（Java & SQL） ＆ 直近の提出 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              つまずき問題 TOP5（Java / SQL 横断分析）
            </CardTitle>
            <CardDescription className="text-xs">
              受講生が苦戦している問題を特定し、段階的ヒントや解説の改善に役立てます。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.stumblingTop5.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
                まだ演習の挑戦データがありません。受講生が課題を提出すると自動集計されます。
              </div>
            ) : (
              overview.stumblingTop5.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border bg-slate-50/70 flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <Badge
                        variant={item.track === "SQL" ? "warning" : "default"}
                        className="text-[10px] px-1.5 py-0"
                      >
                        {item.track}
                      </Badge>
                      <span className="font-semibold text-xs text-slate-900 truncate">
                        {item.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-3 pl-7">
                      <span>
                        平均挑戦: <strong>{item.avgAttempts}回</strong>
                      </span>
                      <span>
                        不通過率:{" "}
                        <strong className="text-rose-600">{item.failRate}%</strong>
                      </span>
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
              ))
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <History className="h-4 w-4 text-blue-600" />
              全テナント直近の提出（リアルタイム監視）
            </CardTitle>
            <CardDescription className="text-xs">
              受講生詳細ページから提出コードの確認と個別フィードバック送信が可能です。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.recentSubmissions.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
                まだ提出履歴がありません。受講生がコードを提出するとリアルタイムに表示されます。
              </div>
            ) : (
              overview.recentSubmissions.map((sub) => (
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
                      ) : (
                        <Badge variant="warning">WA (再挑戦中)</Badge>
                      )}
                    </div>
                    <div className="text-xs text-slate-600">
                      問題: {sub.problemTitle} ・{" "}
                      <span className="text-slate-400">{sub.submittedAt}</span>
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
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
