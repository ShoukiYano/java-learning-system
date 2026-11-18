import React from "react";
import Link from "next/link";
import { getCurrentProfile, getStudentDashboardData } from "@/lib/data-service";
import { SkillRadarChart } from "@/components/dashboard/skill-radar-chart";
import { StudyHeatmap } from "@/components/dashboard/study-heatmap";
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
  Play,
  Flame,
  Clock,
  Trophy,
  MessageSquareQuote,
  CalendarDays,
  Target,
  Megaphone,
  Star,
  ArrowRight,
  BookOpen,
} from "lucide-react";

export default async function StudentDashboardPage() {
  const profile = await getCurrentProfile();
  const dashboard = await getStudentDashboardData(profile.id);

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl space-y-8">
      {/* ヒーロー＆「続きから再開」カード */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-6 md:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
            <span>👋 おかえりなさい、{profile.full_name} さん</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Java・SQLカリキュラムで実践スキルを習得しましょう
          </h1>
          <p className="text-blue-100 text-sm">
            次に解くべき問題：
            <strong className="text-white underline ml-1">
              {dashboard.resumeProblem?.title ?? "1-1. Hello Java!"}
            </strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {dashboard.resumeProblem && (
            <Link
              href={`/student/problems/${dashboard.resumeProblem.id}`}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-xl transition"
            >
              <Play className="h-4 w-4 fill-blue-700" />
              続きから再開する
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          <Link
            href="/student/courses"
            className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-blue-800/70 hover:bg-blue-800 text-white font-semibold text-sm border border-blue-400/30 transition"
          >
            <BookOpen className="h-4 w-4" />
            コース一覧（Java / SQL）
          </Link>
        </div>
      </div>

      {/* 主要KPI 3指標 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>全カリキュラム進捗率（Java＋SQL）</span>
              <Trophy className="h-4 w-4 text-blue-600" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold text-slate-900">
              {dashboard.overallProgressPercent}%
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ProgressBar value={dashboard.overallProgressPercent} />
            <p className="text-xs text-slate-500">
              全 {dashboard.totalCount} 問中 {dashboard.completedCount} 問クリア済み
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>今週の学習時間</span>
              <Clock className="h-4 w-4 text-emerald-600" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold text-slate-900">
              {dashboard.weeklyMinutes}{" "}
              <span className="text-base font-semibold">分</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">
              目標の週120分まであと {Math.max(0, 120 - dashboard.weeklyMinutes)} 分
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>連続学習日数（ストリーク）</span>
              <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold text-slate-900">
              {profile.streak_days}{" "}
              <span className="text-base font-semibold">日連続</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">
              毎日1問でも提出するとストリークが継続します
            </p>
          </CardContent>
        </Card>
      </div>

      {/* スキルマップ（Java & SQLレーダーチャート） ＋ 学習カレンダー（草）＆フィードバック */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              エンジニアスキルマップ（Java & SQL タグ別習得率）
            </CardTitle>
            <CardDescription className="text-xs">
              Java（変数・分岐・ループ・配列・OOP）とSQL（抽出・集計・結合）の正答率を可視化
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SkillRadarChart data={dashboard.skillRadarData} />
          </CardContent>
        </Card>

        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-emerald-600" />
                学習カレンダー
              </CardTitle>
              <CardDescription className="text-xs">
                日々の演習時間とクリア問題数の記録
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StudyHeatmap logs={dashboard.studyLogs} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquareQuote className="h-4 w-4 text-purple-600" />
                講師・管理者からの最新フィードバック
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboard.recentFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-950">
                      {fb.admin?.full_name ?? "担当講師"}
                    </span>
                    <div className="flex items-center gap-2">
                      {fb.rating && (
                        <span className="inline-flex items-center gap-0.5 text-amber-600 font-bold">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                          {fb.rating} / 5
                        </span>
                      )}
                      <span className="text-slate-400">
                        {new Date(fb.created_at).toLocaleDateString("ja-JP")}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {fb.comment}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {dashboard.announcements.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-amber-600" />
              お知らせ
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {dashboard.announcements.map((ann) => (
              <div key={ann.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {ann.company_id ? "テナント限定" : "全体"}
                  </Badge>
                  <span className="font-semibold text-sm">{ann.title}</span>
                  <span className="text-xs text-slate-400 ml-auto">
                    {new Date(ann.created_at).toLocaleDateString("ja-JP")}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{ann.content_md}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
