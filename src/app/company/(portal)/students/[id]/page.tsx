import React from "react";
import Link from "next/link";
import { getStudentDetailForAdminOrCompany } from "@/lib/data-service";
import { SkillRadarChart } from "@/components/dashboard/skill-radar-chart";
import { EvaluationCommentManager } from "@/components/dashboard/evaluation-comment-manager";
import { StudentCourseLockManager } from "@/components/dashboard/student-course-lock-manager";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { ArrowLeft, Target, Layers, Clock } from "lucide-react";

export default async function CompanyStudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { student, submissions, courseLockStatuses } =
    await getStudentDetailForAdminOrCompany(id);

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/company"
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          自社受講生一覧へ戻る
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{student.fullName}</CardTitle>
              <CardDescription className="mt-1">
                {student.companyName} ・ {student.email} ・ 最終ログイン:{" "}
                {student.lastLoginAt}
              </CardDescription>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-slate-500">カリキュラム進捗率</div>
                <div className="text-2xl font-extrabold text-emerald-700">
                  {student.progressPercent}%
                </div>
              </div>
              <Badge variant={student.isDelayed ? "destructive" : "success"}>
                {student.isDelayed ? "要フォロー" : "順調"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-0 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border">
            <span className="text-slate-500 block">クリア問題数</span>
            <strong className="text-base text-slate-900">
              {student.completedProblems} / {student.totalProblems} 問
            </strong>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border">
            <span className="text-slate-500 block">今週の学習時間</span>
            <strong className="text-base text-slate-900 flex items-center gap-1">
              <Clock className="h-4 w-4 text-emerald-600" />
              {student.weeklyMinutes} 分
            </strong>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border">
            <span className="text-slate-500 block">累計学習時間</span>
            <strong className="text-base text-slate-900">
              {student.totalMinutes} 分（連続 {student.streakDays} 日）
            </strong>
          </div>
        </CardContent>
      </Card>

      {/* ★ 企業担当者による教材コースの個別受講制限・特別解放管理 */}
      <StudentCourseLockManager
        studentId={student.id}
        studentName={student.fullName}
        initialCourseStatuses={courseLockStatuses}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-600" />
              スキルマップ（問題タグ別の正答・習得率）
            </CardTitle>
            <CardDescription className="text-xs">
              どの分野が得意で、どこでつまずいているかが一目で分かります。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SkillRadarChart data={student.skillScores} />
          </CardContent>
        </Card>

        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-600" />
                章ごとの進捗状況
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {student.chapterProgress.map((cp) => {
                const pct = Math.round((cp.completed / cp.total) * 100);
                return (
                  <div key={cp.chapterTitle} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>{cp.chapterTitle}</span>
                      <span className="text-slate-600">
                        {cp.completed} / {cp.total} 問クリア ({pct}%)
                      </span>
                    </div>
                    <ProgressBar
                      value={pct}
                      indicatorClassName={
                        pct === 100 ? "bg-emerald-600" : "bg-blue-600"
                      }
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* ★ 企業側からも「評価・コメント」を追加・編集・削除可能 */}
          <EvaluationCommentManager
            studentId={student.id}
            submissionId={submissions[0]?.id ?? null}
            initialEvaluations={student.evaluations}
            defaultAuthorLabel={`${student.companyName} 研修担当`}
          />
        </div>
      </div>
    </div>
  );
}
