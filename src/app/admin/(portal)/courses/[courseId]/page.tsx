"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { SEED_CHAPTERS, SEED_COURSES, SEED_PROBLEMS, detectProblemLanguage } from "@/lib/seed-data";
import { difficultyLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GripVertical,
  Plus,
  Edit3,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

interface EditableChapter {
  id: string;
  title: string;
  description: string;
  order_index: number;
  is_published: boolean;
  lesson_title: string;
}

export default function AdminCourseChaptersPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const currentCourse =
    SEED_COURSES.find((c) => c.id === courseId) ?? SEED_COURSES[0];

  const [chapters, setChapters] = useState<EditableChapter[]>(
    SEED_CHAPTERS.filter((c) => c.course_id === currentCourse.id).map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      order_index: c.order_index,
      is_published: true,
      lesson_title: c.lesson_title,
    }))
  );

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const handleDragStart = (idx: number) => {
    setDragIndex(idx);
  };

  const handleDrop = async (targetIdx: number) => {
    if (dragIndex === null || dragIndex === targetIdx) return;
    const updated = [...chapters];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(targetIdx, 0, moved);
    const reindexed = updated.map((ch, i) => ({
      ...ch,
      order_index: i + 1,
    }));
    setChapters(reindexed);
    setDragIndex(null);

    const res = await fetch("/api/admin/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "reorder_chapters",
        payload: {
          orderedChapters: reindexed.map((c) => ({
            id: c.id,
            order_index: c.order_index,
          })),
        },
      }),
    });
    setToast(
      res.ok
        ? "ドラッグ＆ドロップで章の並び順をデータベースに保存しました。"
        : "⚠️ 章の並び順の保存に失敗しました。"
    );
  };

  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;
    const nextIdx = chapters.length + 1;
    const lessonTitle = newLessonTitle.trim() || `${nextIdx}-1. 実践演習`;

    const res = await fetch("/api/admin/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_chapter_and_lesson",
        payload: {
          courseId: currentCourse.id,
          chapterTitle: newChapterTitle.trim(),
          lessonTitle,
          order_index: nextIdx,
        },
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setToast(`⚠️ 章の追加に失敗しました: ${data.error || "エラー"}`);
      return;
    }

    setChapters((prev) => [
      ...prev,
      {
        id: data.chapter?.id ?? `ch-${Date.now()}`,
        title: newChapterTitle.trim(),
        description: "新規作成された章",
        order_index: nextIdx,
        is_published: true,
        lesson_title: lessonTitle,
      },
    ]);
    setNewChapterTitle("");
    setNewLessonTitle("");
    setToast("新しい章と単元をデータベースに保存しました。");
  };

  const toggleChapterPublish = async (id: string) => {
    const target = chapters.find((c) => c.id === id);
    if (!target) return;
    const nextState = !target.is_published;
    setChapters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_published: nextState } : c))
    );
    const res = await fetch("/api/admin/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "toggle_chapter_publish",
        payload: { chapterId: id, is_published: nextState },
      }),
    });
    if (!res.ok) {
      setChapters((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_published: !nextState } : c))
      );
      setToast("⚠️ 章の公開設定の保存に失敗しました。");
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          コース一覧へ戻る
        </Link>

        <Link
          href="/admin/problems/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow"
        >
          <Plus className="h-4 w-4" />
          新しい問題を追加（Java / SQL）
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {currentCourse.title}：章・単元の管理＆並び替え
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          各章のカード左端のハンドルをドラッグ＆ドロップすると、章の表示順序を変更できます。
        </p>
      </div>

      {toast && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">新規の章・単元を追加</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleAddChapter}
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            <Input
              required
              placeholder="章タイトル"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
            />
            <Input
              placeholder="初期単元タイトル"
              value={newLessonTitle}
              onChange={(e) => setNewLessonTitle(e.target.value)}
            />
            <Button type="submit">
              <Plus className="h-4 w-4" />
              章と単元を追加
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {chapters.map((ch, idx) => {
          const chProblems = SEED_PROBLEMS.filter((p) => p.chapter_id === ch.id);

          return (
            <Card
              key={ch.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(idx)}
              className="cursor-grab active:cursor-grabbing hover:border-indigo-300 transition"
            >
              <CardHeader className="py-4 bg-slate-50 border-b">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-slate-400" />
                    <Badge variant="outline">#{ch.order_index}</Badge>
                    <CardTitle className="text-base">{ch.title}</CardTitle>
                    {ch.is_published ? (
                      <Badge variant="success">公開中</Badge>
                    ) : (
                      <Badge variant="secondary">非公開</Badge>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleChapterPublish(ch.id)}
                  >
                    {ch.is_published ? (
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
                </div>
                <CardDescription className="pl-8 text-xs">
                  単元：{ch.lesson_title} ／ {ch.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 space-y-2">
                {chProblems.length === 0 ? (
                  <p className="text-xs text-slate-500 pl-8">
                    まだ問題が登録されていません。「新しい問題を追加」から作成できます。
                  </p>
                ) : (
                  chProblems.map((prob) => {
                    const diff = difficultyLabel(prob.difficulty);
                    const lang = detectProblemLanguage(prob);
                    return (
                      <div
                        key={prob.id}
                        className="flex items-center justify-between p-2.5 rounded-lg border bg-white text-xs ml-8"
                      >
                        <div className="flex items-center gap-2.5">
                          <Badge
                            variant={lang === "git" ? "secondary" : lang === "sql" ? "warning" : "default"}
                          >
                            {lang === "git" ? "Git" : lang === "sql" ? "SQL" : "Java"}
                          </Badge>
                          <span className="font-semibold text-slate-900">
                            {prob.title}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${diff.color}`}
                          >
                            {diff.label}
                          </span>
                          <span className="text-slate-400">
                            テストケース {prob.test_cases.length}件
                          </span>
                        </div>

                        <Link
                          href={`/admin/problems/${prob.id}/edit`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded border hover:bg-slate-100 font-medium text-indigo-600"
                        >
                          <Edit3 className="h-3 w-3" />
                          問題を編集
                        </Link>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
