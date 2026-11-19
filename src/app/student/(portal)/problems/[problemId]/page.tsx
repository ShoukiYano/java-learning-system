import React from "react";
import Link from "next/link";
import {
  getCurrentProfile,
  getProblemDetailForStudent,
  getCoursesWithProgress,
} from "@/lib/data-service";
import { ProblemWorkspaceClient } from "@/components/problem/problem-workspace-client";
import { GitWorkspaceClient } from "@/components/git/git-workspace-client";
import { Lock, ArrowLeft, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function StudentProblemPage({
  params,
}: {
  params: Promise<{ problemId: string }>;
}) {
  const { problemId } = await params;
  const profile = await getCurrentProfile();
  const [detail, courses] = await Promise.all([
    getProblemDetailForStudent(problemId, profile.id),
    getCoursesWithProgress(profile.id, profile.company_id),
  ]);

  // コースがロックされているかチェック
  const currentCourse = courses.find((c) => c.id === detail.courseId);
  if (currentCourse?.isLocked) {
    return (
      <div className="container mx-auto px-6 py-16 max-w-xl">
        <Card className="border-amber-200 bg-amber-50/50 shadow-sm text-center">
          <CardHeader className="space-y-3 pb-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Lock className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl text-slate-900">
              この演習問題は現在ロックされています
            </CardTitle>
            <CardDescription className="text-slate-600 text-sm">
              所属コース「{currentCourse.title}」は受講制限中です。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <div className="p-3.5 rounded-lg bg-white border border-amber-200 text-xs text-amber-900 text-left flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                {currentCourse.lockReason}
                <br />
                ※先行受講が必要な場合は、自社の研修担当者様へロック解除をご相談ください。
              </span>
            </div>

            <div className="flex justify-center">
              <Link
                href="/student/courses"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition"
              >
                <ArrowLeft className="h-4 w-4" />
                カリキュラム一覧へ戻る
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isGit =
    detail.problem.language === "git" ||
    detail.problem.tags?.some((t) => t.toUpperCase().includes("GIT"));

  if (isGit) {
    return (
      <GitWorkspaceClient
        problem={detail.problem}
        initialProgress={detail.progress}
        nextProblemId={detail.nextProblemId}
        courseId={detail.courseId}
      />
    );
  }

  return (
    <ProblemWorkspaceClient
      problem={detail.problem}
      publicTestCases={detail.publicTestCases}
      hints={detail.hints}
      initialProgress={detail.progress}
      nextProblemId={detail.nextProblemId}
      courseId={detail.courseId}
    />
  );
}
