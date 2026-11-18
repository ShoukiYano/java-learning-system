import React from "react";
import Link from "next/link";
import { getCourseTree, getCurrentProfile } from "@/lib/data-service";
import { detectProblemLanguage } from "@/lib/seed-data";
import { difficultyLabel } from "@/lib/utils";
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
  CheckCircle2,
  Clock,
  CircleDot,
  Circle,
  ChevronRight,
  Layers,
  Tag,
  ArrowLeft,
} from "lucide-react";

export default async function StudentCourseDetailTreePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const profile = await getCurrentProfile();
  const { course, chapters } = await getCourseTree(courseId, profile.id);

  const allProblems = chapters.flatMap((c) =>
    c.lessons.flatMap((l) => l.problems)
  );
  const completedCount = allProblems.filter(
    (p) => p.status === "completed"
  ).length;
  const progressPercent =
    allProblems.length > 0
      ? Math.round((completedCount / allProblems.length) * 100)
      : 0;

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/student/courses"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          カリキュラム一覧へ戻る
        </Link>

        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="inline-flex items-center gap-1.5 text-slate-600">
            <span className="h-3 w-3 rounded-full bg-slate-300 inline-block" />
            未着手（グレー）
          </span>
          <span className="inline-flex items-center gap-1.5 text-amber-700">
            <span className="h-3 w-3 rounded-full bg-amber-400 inline-block" />
            挑戦中（黄）
          </span>
          <span className="inline-flex items-center gap-1.5 text-emerald-700">
            <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" />
            クリア（緑）
          </span>
        </div>
      </div>

      <Card className="border-blue-100 bg-gradient-to-r from-blue-50/70 to-indigo-50/40">
        <CardHeader>
          <CardTitle className="text-2xl">{course.title}</CardTitle>
          <CardDescription className="text-slate-600">
            {course.description}
          </CardDescription>
          <div className="pt-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>
                全体進捗：{completedCount} / {allProblems.length} 問クリア
              </span>
              <span className="text-blue-700">{progressPercent}%</span>
            </div>
            <ProgressBar value={progressPercent} />
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        {chapters.map((chapter) => {
          const chProblems = chapter.lessons.flatMap((l) => l.problems);
          const chCompleted = chProblems.filter(
            (p) => p.status === "completed"
          ).length;

          return (
            <Card key={chapter.id} className="overflow-hidden">
              <CardHeader className="bg-slate-100/80 border-b py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <Layers className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">{chapter.title}</CardTitle>
                  </div>
                  <Badge
                    variant={
                      chCompleted === chProblems.length && chProblems.length > 0
                        ? "success"
                        : "outline"
                    }
                  >
                    {chCompleted} / {chProblems.length} 問完了
                  </Badge>
                </div>
                {chapter.description && (
                  <CardDescription className="text-xs text-slate-600 mt-1">
                    {chapter.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="p-0 divide-y">
                {chapter.lessons.map((lesson) => (
                  <div key={lesson.id} className="p-5 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      単元：{lesson.title}
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 pl-3 border-l-2 border-slate-200">
                      {lesson.problems.map((problem) => {
                        const diff = difficultyLabel(problem.difficulty);
                        const lang = detectProblemLanguage(problem);
                        const statusStyles =
                          problem.status === "completed"
                            ? "border-emerald-300 bg-emerald-50/70 hover:bg-emerald-50"
                            : problem.status === "in_progress"
                            ? "border-amber-300 bg-amber-50/70 hover:bg-amber-50"
                            : "border-slate-200 bg-slate-50/70 hover:bg-slate-100/80";

                        return (
                          <Link
                            key={problem.id}
                            href={`/student/problems/${problem.id}`}
                            className={`flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-xl border transition ${statusStyles}`}
                          >
                            <div className="flex items-center gap-3">
                              {problem.status === "completed" ? (
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                                  <CheckCircle2 className="h-4 w-4" />
                                </span>
                              ) : problem.status === "in_progress" ? (
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-sm">
                                  <CircleDot className="h-4 w-4" />
                                </span>
                              ) : (
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 text-slate-600">
                                  <Circle className="h-4 w-4" />
                                </span>
                              )}

                              <div>
                                <div className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                                  <Badge
                                    variant={
                                      lang === "sql" ? "warning" : "default"
                                    }
                                    className="text-[10px] px-1.5 py-0"
                                  >
                                    {lang === "sql" ? "SQL" : "Java"}
                                  </Badge>
                                  {problem.title}
                                  {problem.status === "completed" && (
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                      クリア
                                    </span>
                                  )}
                                  {problem.status === "in_progress" && (
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                                      挑戦中
                                    </span>
                                  )}
                                  {problem.status === "not_started" && (
                                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                                      未着手
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  {problem.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="inline-flex items-center gap-1 text-[11px] text-slate-500"
                                    >
                                      <Tag className="h-3 w-3" />
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span
                                className={`text-xs px-2.5 py-0.5 rounded-md border font-semibold ${diff.color}`}
                              >
                                {diff.label}
                              </span>
                              <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                                <Clock className="h-3.5 w-3.5 text-slate-400" />
                                想定 {problem.estimated_minutes}分
                              </span>
                              <ChevronRight className="h-4 w-4 text-slate-400" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
