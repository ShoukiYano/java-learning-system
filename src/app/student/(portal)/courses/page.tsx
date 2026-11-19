import React from "react";
import Link from "next/link";
import { getCurrentProfile, getCoursesWithProgress } from "@/lib/data-service";
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
  BookOpen,
  Database,
  Code2,
  GitBranch,
  Lock,
  Unlock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default async function StudentCoursesPage() {
  const profile = await getCurrentProfile();
  const courses = await getCoursesWithProgress(profile.id, profile.company_id);

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          カリキュラム一覧
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          受講するコースを選択し、章・単元・実践コーディング演習へ進みましょう。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {courses.map((course) => {
          const percent =
            course.totalProblems > 0
              ? Math.round(
                  (course.completedProblems / course.totalProblems) * 100
                )
              : 0;
          const isGit = course.title.toUpperCase().includes("GIT");
          const isSql = course.title.toUpperCase().includes("SQL");

          return (
            <Card
              key={course.id}
              className={
                course.isLocked
                  ? "opacity-70 bg-slate-100 border-slate-300"
                  : "hover:border-blue-300 transition shadow-sm"
              }
            >
              <CardHeader className="pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        isGit ? "secondary" : isSql ? "warning" : "default"
                      }
                      className={
                        isGit
                          ? "bg-purple-100 text-purple-700 border-purple-300"
                          : ""
                      }
                    >
                      {isGit
                        ? "Git Version Control Track"
                        : isSql
                        ? "SQL Database Track"
                        : "Java Programming Track"}
                    </Badge>
                    {course.lockStatus === "unlocked" ? (
                      <Badge
                        variant="success"
                        className="gap-1 bg-emerald-600 text-white font-semibold"
                      >
                        <Unlock className="h-3 w-3" />
                        🔓 企業特別解放中（先行受講可能）
                      </Badge>
                    ) : course.lockStatus === "locked" ? (
                      <Badge variant="destructive" className="gap-1">
                        <Lock className="h-3 w-3" />
                        受講制限中（企業設定）
                      </Badge>
                    ) : course.isLocked ? (
                      <Badge variant="outline" className="gap-1 text-slate-700 bg-slate-200 border-slate-300">
                        <Lock className="h-3 w-3" />
                        前提コース未完了（ロック中）
                      </Badge>
                    ) : percent === 100 ? (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        全問クリア達成
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 text-blue-700 border-blue-200 bg-blue-50">
                        <Sparkles className="h-3 w-3" />
                        受講可能
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-600">
                    クリア済み: {course.completedProblems} / {course.totalProblems}{" "}
                    問（挑戦中: {course.inProgressProblems} 問）
                  </span>
                </div>
                <CardTitle className="text-xl mt-2 flex items-center gap-2">
                  {isGit ? (
                    <GitBranch className="h-5 w-5 text-purple-600" />
                  ) : isSql ? (
                    <Database className="h-5 w-5 text-amber-600" />
                  ) : (
                    <Code2 className="h-5 w-5 text-blue-600" />
                  )}
                  {course.title}
                </CardTitle>
                <CardDescription className="text-slate-600 leading-relaxed">
                  {course.description}
                </CardDescription>
                {course.isLocked && (
                  <div className="mt-2 p-2 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span>{course.lockReason}（企業担当者へご相談いただくことで特別解放が可能です）</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-600">コース進捗率</span>
                    <span className="text-blue-600 font-bold">{percent}%</span>
                  </div>
                  <ProgressBar
                    value={percent}
                    indicatorClassName={
                      percent === 100 ? "bg-emerald-600" : "bg-blue-600"
                    }
                  />
                </div>

                <div className="flex justify-end pt-2">
                  {course.isLocked ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-200 text-slate-600 text-xs font-medium cursor-not-allowed">
                      <Lock className="h-4 w-4 text-slate-500" />
                      受講制限中（前提コース完了または企業による解放が必要です）
                    </span>
                  ) : (
                    <Link
                      href={`/student/courses/${course.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-sm transition"
                    >
                      <BookOpen className="h-4 w-4" />
                      章・問題ツリーを開く
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
