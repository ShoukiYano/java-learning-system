"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { StudentCourseStatusItem, CourseLockStatus } from "@/types/database";
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
  Lock,
  Unlock,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Database,
  Code2,
  HelpCircle,
} from "lucide-react";

interface StudentCourseLockManagerProps {
  studentId: string;
  studentName: string;
  initialCourseStatuses: StudentCourseStatusItem[];
}

export function StudentCourseLockManager({
  studentId,
  studentName,
  initialCourseStatuses,
}: StudentCourseLockManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [courses, setCourses] = useState<StudentCourseStatusItem[]>(
    initialCourseStatuses
  );
  const [updatingCourseId, setUpdatingCourseId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUpdateLock = async (
    courseId: string,
    courseTitle: string,
    newStatus: CourseLockStatus
  ) => {
    setUpdatingCourseId(courseId);
    setToastMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set_student_course_lock",
          payload: {
            userId: studentId,
            courseId,
            status: newStatus,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "設定の保存に失敗しました。");
      }

      // ローカル state を即時更新
      setCourses((prev) =>
        prev.map((c) => {
          if (c.courseId !== courseId) return c;

          let isEffectiveLocked = false;
          let lockReason = "受講可能です";

          if (newStatus === "unlocked") {
            isEffectiveLocked = false;
            lockReason = "企業担当者により特別解放されています（先行受講可能）";
          } else if (newStatus === "locked") {
            isEffectiveLocked = true;
            lockReason = "企業担当者により受講制限されています";
          } else {
            // auto
            if (c.prerequisiteCourseId && !c.isPrerequisiteCompleted) {
              isEffectiveLocked = true;
              lockReason = `前提コース「${c.prerequisiteCourseTitle ?? "前提コース"}」の全問クリアが必要です`;
            }
          }

          return {
            ...c,
            lockStatus: newStatus,
            isEffectiveLocked,
            lockReason,
          };
        })
      );

      const statusLabels: Record<CourseLockStatus, string> = {
        auto: "自動（前提条件に準拠）",
        unlocked: "🔓 特別解放（先行受講を許可）",
        locked: "🔒 手動ロック（受講制限）",
      };

      setToastMessage(
        `「${courseTitle}」の受講設定を【${statusLabels[newStatus]}】に更新しました。`
      );

      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "更新中にエラーが発生しました。"
      );
    } finally {
      setUpdatingCourseId(null);
    }
  };

  return (
    <Card className="border-indigo-100 shadow-sm">
      <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50/70 via-white to-slate-50 border-b">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-indigo-950 font-bold">
              <Sliders className="h-4 w-4 text-indigo-600" />
              教材・コース受講権限管理（個別ロック・解放設定）
            </CardTitle>
            <CardDescription className="text-xs text-slate-600 mt-1">
              受講生一人ひとりに合わせて、前提条件（Java入門完了）の自動ロックを解除してSQLを先行受講させたり、特定の教材を受講制限したりできます。
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {toastMessage && (
          <div className="p-3 text-xs rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 text-xs rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {courses.map((course) => {
            const isSql = course.courseTitle.toUpperCase().includes("SQL");
            const isUpdating = updatingCourseId === course.courseId;

            return (
              <div
                key={course.courseId}
                className={`p-4 rounded-xl border transition-all ${
                  course.isEffectiveLocked
                    ? "bg-slate-50/90 border-slate-200"
                    : course.lockStatus === "unlocked"
                    ? "bg-emerald-50/40 border-emerald-200 shadow-sm"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* コース情報 */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={isSql ? "warning" : "default"}>
                        {isSql ? "SQL Database Track" : "Java Programming Track"}
                      </Badge>

                      {/* 実効ステータスバッジ */}
                      {course.lockStatus === "unlocked" ? (
                        <Badge
                          variant="success"
                          className="gap-1 bg-emerald-600 text-white font-semibold"
                        >
                          <Unlock className="h-3 w-3" />
                          🔓 特別解放中（先行受講可能）
                        </Badge>
                      ) : course.lockStatus === "locked" ? (
                        <Badge variant="destructive" className="gap-1 font-semibold">
                          <Lock className="h-3 w-3" />
                          🔒 手動ロック中（受講制限）
                        </Badge>
                      ) : course.isEffectiveLocked ? (
                        <Badge
                          variant="outline"
                          className="gap-1 text-slate-700 bg-slate-200 border-slate-300"
                        >
                          <Lock className="h-3 w-3" />
                          自動ロック中（前提コース未完了）
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="gap-1 text-blue-700 bg-blue-50 border-blue-200"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          受講可能（前提条件クリア）
                        </Badge>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-1">
                      {isSql ? (
                        <Database className="h-4 w-4 text-amber-600" />
                      ) : (
                        <Code2 className="h-4 w-4 text-blue-600" />
                      )}
                      {course.courseTitle}
                    </h4>

                    <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                      {course.lockReason}
                    </p>

                    {course.prerequisiteCourseTitle && (
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <HelpCircle className="h-3 w-3 text-slate-400" />
                        標準の前提条件: {course.prerequisiteCourseTitle}
                      </p>
                    )}
                  </div>

                  {/* 進捗 ＆ 設定ボタングループ */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                    <div className="text-right sm:w-28 space-y-1">
                      <div className="text-[11px] text-slate-500">進捗率</div>
                      <div className="text-xs font-bold text-slate-800">
                        {course.completedProblems} / {course.totalProblems} 問 (
                        {course.progressPercent}%)
                      </div>
                      <ProgressBar
                        value={course.progressPercent}
                        indicatorClassName={
                          course.progressPercent === 100
                            ? "bg-emerald-600"
                            : "bg-blue-600"
                        }
                      />
                    </div>

                    {/* 3段階切替ボタングループ */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                      <button
                        type="button"
                        disabled={isUpdating || isPending}
                        onClick={() =>
                          handleUpdateLock(
                            course.courseId,
                            course.courseTitle,
                            "auto"
                          )
                        }
                        title="前提コースの完了状況に応じて自動判定します"
                        className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1 ${
                          course.lockStatus === "auto"
                            ? "bg-white text-slate-900 font-bold shadow-sm"
                            : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                        }`}
                      >
                        <RefreshCw
                          className={`h-3 w-3 ${
                            isUpdating && course.lockStatus === "auto"
                              ? "animate-spin"
                              : ""
                          }`}
                        />
                        自動（前提準拠）
                      </button>

                      <button
                        type="button"
                        disabled={isUpdating || isPending}
                        onClick={() =>
                          handleUpdateLock(
                            course.courseId,
                            course.courseTitle,
                            "unlocked"
                          )
                        }
                        title="前提コースが未完了でも、この受講生に今すぐ特別解放します"
                        className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1 ${
                          course.lockStatus === "unlocked"
                            ? "bg-emerald-600 text-white font-bold shadow-sm"
                            : "text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100/60"
                        }`}
                      >
                        <Unlock className="h-3 w-3" />
                        特別解放
                      </button>

                      <button
                        type="button"
                        disabled={isUpdating || isPending}
                        onClick={() =>
                          handleUpdateLock(
                            course.courseId,
                            course.courseTitle,
                            "locked"
                          )
                        }
                        title="前提コース修了に関わらず、この受講生の受講を制限します"
                        className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1 ${
                          course.lockStatus === "locked"
                            ? "bg-red-600 text-white font-bold shadow-sm"
                            : "text-red-700 hover:text-red-900 hover:bg-red-100/60"
                        }`}
                      >
                        <Lock className="h-3 w-3" />
                        手動ロック
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
