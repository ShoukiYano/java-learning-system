import React from "react";
import Link from "next/link";
import { DEMO_STUDENTS_ANALYTICS } from "@/lib/mock-analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { Users, AlertTriangle, Building2, ArrowRight } from "lucide-react";

export default function AdminStudentsListPage() {
  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          全テナント受講生一覧・進捗監視
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          全導入企業の受講生の進捗率・学習時間・遅れアラートを確認し、個別フィードバックを入力できます。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-600" />
            登録受講生一覧
          </CardTitle>
          <CardDescription className="text-xs">
            「詳細・フィードバック」から提出コードのレビューと5段階評価の登録が可能です。
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          {DEMO_STUDENTS_ANALYTICS.map((st) => (
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
                  今週の学習: <strong>{st.weeklyMinutes}分</strong>
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
