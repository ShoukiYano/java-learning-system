"use client";

import React from "react";
import Link from "next/link";
import { StudentAnalyticsRecord } from "@/lib/mock-analytics";
import { Submission, StudentCourseStatusItem } from "@/types/database";
import { SkillRadarChart } from "@/components/dashboard/skill-radar-chart";
import { EvaluationCommentManager } from "@/components/dashboard/evaluation-comment-manager";
import { StudentCourseLockManager } from "@/components/dashboard/student-course-lock-manager";
import { DeleteStudentButton } from "@/components/dashboard/delete-student-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { ArrowLeft, Code2 } from "lucide-react";

export function AdminStudentDetailClient({
  student,
  submissions,
  courseLockStatuses = [],
}: {
  student: StudentAnalyticsRecord;
  submissions: Submission[];
  courseLockStatuses?: StudentCourseStatusItem[];
}) {
  const latestSubmission = submissions[0] ?? null;
  const latestCode = latestSubmission?.code ?? null;
  const latestProblemTitle = latestSubmission?.problems?.title ?? null;

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl space-y-6">
      <Link
        href="/admin/students"
        className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        受講生一覧へ戻る
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {student.fullName} さんの学習詳細・評価・コメント管理
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            所属テナント：{student.companyName} ／ メール：{student.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={student.isDelayed ? "destructive" : "success"}>
            全体進捗 {student.progressPercent}% ({student.completedProblems}/
            {student.totalProblems}問)
          </Badge>
          <DeleteStudentButton
            studentId={student.id}
            studentName={student.fullName}
            studentEmail={student.email}
            redirectTo="/admin/students"
          />
        </div>
      </div>

      {/* ★ 管理者による教材コースの個別受講制限・特別解放管理 */}
      <StudentCourseLockManager
        studentId={student.id}
        studentName={student.fullName}
        initialCourseStatuses={courseLockStatuses}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">スキル習得レーダー</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillRadarChart data={student.skillScores} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">章ごとの進捗内訳</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {student.chapterProgress.map((cp) => {
                const pct = Math.round((cp.completed / cp.total) * 100);
                return (
                  <div key={cp.chapterTitle} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{cp.chapterTitle}</span>
                      <span>
                        {cp.completed}/{cp.total} 問 ({pct}%)
                      </span>
                    </div>
                    <ProgressBar value={pct} />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {/* ★ 管理者側からも「評価・コメント」を追加・編集・削除可能 */}
          <EvaluationCommentManager
            studentId={student.id}
            submissionId={submissions[0]?.id ?? null}
            initialEvaluations={student.evaluations}
            defaultAuthorLabel="システム管理者"
          />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Code2 className="h-4 w-4 text-blue-600" />
                {latestProblemTitle
                  ? `直近の提出コード（${latestProblemTitle}）`
                  : "直近の提出コード"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {latestCode ? (
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
                  {latestCode}
                </pre>
              ) : (
                <div className="p-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
                  まだ提出されたコードはありません。受講生が課題を提出すると、ここに最新のコードが表示されます。
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
