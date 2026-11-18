import React from "react";
import Link from "next/link";
import { getCurrentProfile, getCoursesWithProgress } from "@/lib/data-service";
import {
  SEED_CHAPTERS,
  SEED_COURSES,
  SEED_PROBLEMS,
  detectProblemLanguage,
} from "@/lib/seed-data";
import { difficultyLabel } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import {
  BookOpen,
  Code2,
  Database,
  Clock,
  Layers,
  Tag,
  Lock,
} from "lucide-react";

export default async function CompanyCurriculumViewPage() {
  const profile = await getCurrentProfile();
  const visibleCourseList = await getCoursesWithProgress(
    profile.id,
    profile.company_id ?? "00000000-0000-4000-8000-000000000001"
  );
  const visibleIds = new Set(visibleCourseList.map((c) => c.id));
  const targetCourses = SEED_COURSES.filter((c) => visibleIds.has(c.id));

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            提供カリキュラム・演習問題一覧（企業担当者向け確認ビュー）
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            貴社の受講生に公開されているカリキュラムコースの全章・全演習問題・到達目標を確認できます。
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-200/80 px-3 py-1 rounded-full">
          <Lock className="h-3 w-3" />
          閲覧専用モード
        </span>
      </div>

      <div className="space-y-8">
        {targetCourses.map((course) => {
          const isSql = course.title.toUpperCase().includes("SQL");
          const chapters = SEED_CHAPTERS.filter(
            (ch) => ch.course_id === course.id
          );
          const courseProblems = SEED_PROBLEMS.filter((p) =>
            chapters.some((c) => c.id === p.chapter_id)
          );

          return (
            <Card key={course.id} className="border-slate-300 shadow-sm">
              <CardHeader className="bg-slate-900 text-white rounded-t-xl">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={isSql ? "warning" : "default"}>
                      {isSql ? "SQL Database Track" : "Java Programming Track"}
                    </Badge>
                    <span className="text-xs text-slate-300">
                      全 {chapters.length} 章 ／ 演習 {courseProblems.length} 問
                    </span>
                  </div>
                  <Link
                    href="/company"
                    className="text-xs text-emerald-300 hover:underline"
                  >
                    自社受講生の進捗一覧へ戻る →
                  </Link>
                </div>
                <CardTitle className="text-xl mt-2 flex items-center gap-2">
                  {isSql ? (
                    <Database className="h-5 w-5 text-amber-400" />
                  ) : (
                    <Code2 className="h-5 w-5 text-blue-400" />
                  )}
                  {course.title}
                </CardTitle>
                <CardDescription className="text-slate-300 text-xs">
                  {course.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {chapters.map((ch) => {
                  const probs = SEED_PROBLEMS.filter(
                    (p) => p.chapter_id === ch.id
                  );
                  return (
                    <div
                      key={ch.id}
                      className="rounded-xl border border-slate-200 overflow-hidden"
                    >
                      <div className="bg-slate-100 px-4 py-3 border-b flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-emerald-700" />
                          <span className="font-bold text-sm text-slate-900">
                            {ch.title}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {ch.description}
                        </span>
                      </div>

                      <div className="divide-y">
                        {probs.map((prob) => {
                          const diff = difficultyLabel(prob.difficulty);
                          const lang = detectProblemLanguage(prob);

                          return (
                            <div
                              key={prob.id}
                              className="p-4 bg-white space-y-2"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={
                                      lang === "sql" ? "warning" : "default"
                                    }
                                  >
                                    {lang === "sql" ? "SQL" : "Java"}
                                  </Badge>
                                  <span className="font-bold text-sm text-slate-900">
                                    {prob.title}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 text-xs">
                                  <span
                                    className={`px-2 py-0.5 rounded border font-semibold ${diff.color}`}
                                  >
                                    {diff.label}
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-slate-500">
                                    <Clock className="h-3.5 w-3.5" />
                                    想定 {prob.estimated_minutes}分
                                  </span>
                                </div>
                              </div>

                              <div className="bg-slate-50 p-3 rounded-lg border">
                                <MarkdownRenderer content={prob.description_md} />
                              </div>

                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                                <span className="text-[11px] text-slate-500">
                                  評価スキルタグ:
                                </span>
                                {prob.tags.map((t) => (
                                  <span
                                    key={t}
                                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                                  >
                                    <Tag className="h-3 w-3 text-slate-400" />
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
