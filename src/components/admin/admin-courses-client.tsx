"use client";

/**
 * ファイル概要：
 * カリキュラム（コース）管理・テナント企業別表示マトリクス設定画面コンポーネント
 *
 * 主な処理：
 * - コース一覧表示（Java / SQLおよび新規追加コース）
 * - 新規コースの作成および全社向け公開／非公開トグル
 * - テナント企業×コースの公開マトリクストグル（company_courses: 企業ごとにコースをON/OFF可能）
 * - コース詳細・章・問題管理（/admin/courses/[courseId]）への導線
 */

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Code2,
  GitBranch,
  Plus,
  Settings,
  Eye,
  EyeOff,
  CheckCircle2,
  Building2,
} from "lucide-react";

export interface AdminCourseItem {
  id: string;
  title: string;
  description: string;
  order_index: number;
  is_published: boolean;
  problemCount: number;
}

export interface AdminCompanyBasic {
  id: string;
  name: string;
  company_code: string;
  contact_email: string;
  studentCount: number;
}

export function AdminCoursesClient({
  initialCourses,
  companies,
  initialVisibilityMap,
}: {
  initialCourses: AdminCourseItem[];
  companies: AdminCompanyBasic[];
  initialVisibilityMap: Record<string, Record<string, boolean>>;
}) {
  const [courses, setCourses] = useState<AdminCourseItem[]>(initialCourses);
  const [visibilityMap, setVisibilityMap] =
    useState<Record<string, Record<string, boolean>>>(initialVisibilityMap);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const nextIndex = courses.length + 1;
    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_course",
          payload: {
            title: newTitle.trim(),
            description: newDesc.trim() || "新規カリキュラムコース",
            order_index: nextIndex,
          },
        }),
      });
      const data = await res.json();
      const newCourseId = data.course?.id ?? `course-${Date.now()}`;
      const created: AdminCourseItem = {
        id: newCourseId,
        title: newTitle.trim(),
        description: newDesc.trim() || "新規カリキュラムコース",
        order_index: nextIndex,
        is_published: true,
        problemCount: 0,
      };

      // 新規コースも全テナント企業に対してデフォルト表示 ON に初期化
      const nextVisForCourse: Record<string, boolean> = {};
      for (const comp of companies) {
        nextVisForCourse[comp.id] = true;
      }
      setVisibilityMap((prev) => ({
        ...prev,
        [newCourseId]: nextVisForCourse,
      }));
      setCourses((prev) => [...prev, created]);
      setNewTitle("");
      setNewDesc("");
      setMessage(`コース「${created.title}」を作成しました。`);
    } catch {
      setMessage("コース作成中にエラーが発生しました。");
    }
  };

  const toggleGlobalPublish = async (id: string) => {
    const target = courses.find((c) => c.id === id);
    if (!target) return;
    const nextState = !target.is_published;
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_published: nextState } : c))
    );
    await fetch("/api/admin/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "toggle_course_publish",
        payload: { courseId: id, is_published: nextState },
      }),
    });
    setMessage(
      `コース「${target.title}」の全体ステータスを${
        nextState ? "公開" : "非公開"
      }に更新しました。`
    );
  };

  // ★ テナント企業ごとのコース表示／非表示トグル切り替え
  const handleToggleCompanyCourse = async (
    courseId: string,
    courseTitle: string,
    companyId: string,
    companyName: string
  ) => {
    const currentVal = visibilityMap[courseId]?.[companyId] ?? true;
    const nextVal = !currentVal;

    setVisibilityMap((prev) => ({
      ...prev,
      [courseId]: {
        ...(prev[courseId] ?? {}),
        [companyId]: nextVal,
      },
    }));

    await fetch("/api/admin/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "toggle_company_course_visibility",
        payload: {
          companyId,
          courseId,
          is_visible: nextVal,
        },
      }),
    });

    setMessage(
      `「${companyName}」に対する「${courseTitle}」の表示を【${
        nextVal ? "ON（表示）" : "OFF（非表示）"
      }】に更新しました。`
    );
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          カリキュラム全体管理・テナント企業別表示設定
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          コースの新規作成、章・単元の構成管理、および契約企業（テナント）ごとにどのカリキュラムを表示／非表示にするかをトグルで調整できます。
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="h-4 w-4 text-indigo-600" />
            新しいカリキュラムコースを追加
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateCourse} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  コース名
                </label>
                <Input
                  required
                  placeholder="例: TypeScript & Next.js 実践コース"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4" />
                  コースを作成
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                コース説明文
              </label>
              <Textarea
                placeholder="このコースの到達目標や対象者を入力してください..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-5">
        {courses.map((course) => {
          const isGit = course.title.toUpperCase().includes("GIT");
          const isSql = course.title.toUpperCase().includes("SQL");
          return (
            <Card key={course.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        isGit ? "secondary" : isSql ? "warning" : "default"
                      }
                    >
                      コース #{course.order_index}
                    </Badge>
                    {course.is_published ? (
                      <Badge variant="success">全体公開中</Badge>
                    ) : (
                      <Badge variant="secondary">全体非公開（下書き）</Badge>
                    )}
                    <span className="text-xs text-slate-500">
                      収録問題数: {course.problemCount} 問
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleGlobalPublish(course.id)}
                    >
                      {course.is_published ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5" />
                          全体非公開にする
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5" />
                          全体公開する
                        </>
                      )}
                    </Button>

                    <Link
                      href={`/admin/courses/${course.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                    >
                      <Settings className="h-3.5 w-3.5" />
                      章・単元・並び替え管理
                    </Link>
                  </div>
                </div>

                <CardTitle className="text-lg mt-2 flex items-center gap-2">
                  {isGit ? (
                    <GitBranch className="h-5 w-5 text-purple-600" />
                  ) : isSql ? (
                    <Database className="h-5 w-5 text-amber-600" />
                  ) : (
                    <Code2 className="h-5 w-5 text-indigo-600" />
                  )}
                  {course.title}
                </CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>

              {/* ★ テナント企業ごとの表示／非表示トグルスイッチセクション */}
              <CardContent className="pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-indigo-600" />
                      企業（テナント）別のカリキュラム表示／非表示設定
                    </span>
                    <span className="text-[11px] text-slate-500">
                      トグルをOFFにすると該当企業の受講生・企業担当者のカリキュラム一覧から非表示になります
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {companies.map((comp) => {
                      const isVisible =
                        visibilityMap[course.id]?.[comp.id] ?? true;

                      return (
                        <div
                          key={comp.id}
                          className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition ${
                            isVisible
                              ? "bg-white border-emerald-200"
                              : "bg-slate-100/80 border-slate-200 opacity-75"
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {comp.name}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              コード: {comp.company_code}
                            </div>
                          </div>

                          {/* トグルスイッチ */}
                          <button
                            type="button"
                            role="switch"
                            aria-checked={isVisible}
                            onClick={() =>
                              handleToggleCompanyCourse(
                                course.id,
                                course.title,
                                comp.id,
                                comp.name
                              )
                            }
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              isVisible ? "bg-emerald-600" : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                isVisible ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
