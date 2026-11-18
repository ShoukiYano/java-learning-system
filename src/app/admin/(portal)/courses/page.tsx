"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SEED_CHAPTERS, SEED_COURSES, SEED_PROBLEMS } from "@/lib/seed-data";
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
  BookOpen,
  Database,
  Code2,
  Plus,
  Settings,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

interface AdminCourseItem {
  id: string;
  title: string;
  description: string;
  order_index: number;
  is_published: boolean;
  problemCount: number;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<AdminCourseItem[]>(
    SEED_COURSES.map((c) => {
      const chIds = SEED_CHAPTERS.filter((ch) => ch.course_id === c.id).map(
        (ch) => ch.id
      );
      const count = SEED_PROBLEMS.filter((p) =>
        chIds.includes(p.chapter_id)
      ).length;
      return {
        ...c,
        problemCount: count,
      };
    })
  );

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: AdminCourseItem = {
      id: `course-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || "新規カリキュラムコース",
      order_index: courses.length + 1,
      is_published: true,
      problemCount: 0,
    };

    setCourses((prev) => [...prev, created]);
    setNewTitle("");
    setNewDesc("");
    setMessage(`コース「${created.title}」を作成しました。`);
  };

  const togglePublish = (id: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, is_published: !c.is_published } : c
      )
    );
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          カリキュラム全体管理（Java / SQL コース一覧・作成・編集）
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          コースの新規作成、公開／非公開の切り替え、各コース内の章・単元・問題構成を管理します。
        </p>
      </div>

      {message && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
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
                  placeholder="例: SQL応用コース：ウィンドウ関数とパフォーマンスチューニング"
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

      <div className="space-y-4">
        {courses.map((course) => {
          const isSql = course.title.toUpperCase().includes("SQL");
          return (
            <Card key={course.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={isSql ? "warning" : "default"}>
                      {isSql ? "SQL Track" : "Java Track"} #{course.order_index}
                    </Badge>
                    {course.is_published ? (
                      <Badge variant="success">公開中</Badge>
                    ) : (
                      <Badge variant="secondary">非公開（下書き）</Badge>
                    )}
                    <span className="text-xs text-slate-500">
                      収録問題数: {course.problemCount} 問
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => togglePublish(course.id)}
                    >
                      {course.is_published ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5" />
                          非公開にする
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5" />
                          公開する
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
                  {isSql ? (
                    <Database className="h-5 w-5 text-amber-600" />
                  ) : (
                    <Code2 className="h-5 w-5 text-indigo-600" />
                  )}
                  {course.title}
                </CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
