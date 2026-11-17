"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { DEMO_STUDENTS_ANALYTICS } from "@/lib/mock-analytics";
import { SEED_PROBLEMS } from "@/lib/seed-data";
import { SkillRadarChart } from "@/components/dashboard/skill-radar-chart";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import {
  ArrowLeft,
  Send,
  Star,
  Code2,
  CheckCircle2,
  MessageSquarePlus,
} from "lucide-react";

export default function AdminStudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const student =
    DEMO_STUDENTS_ANALYTICS.find((s) => s.id === id) ??
    DEMO_STUDENTS_ANALYTICS[0];

  const [evaluations, setEvaluations] = useState(student.evaluations);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const newEval = {
      id: `eval-${Date.now()}`,
      adminName: "佐藤 健一（主任講師）",
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setEvaluations((prev) => [newEval, ...prev]);
    setComment("");
    setSavedNotice(
      "フィードバックと評価を送信しました。受講生ダッシュボードおよび企業担当者画面に即時反映されます。"
    );
  };

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
            {student.fullName} さんの学習詳細・フィードバック管理
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            所属：{student.companyName} ／ メール：{student.email}
          </p>
        </div>
        <Badge variant={student.isDelayed ? "destructive" : "success"}>
          全体進捗 {student.progressPercent}% ({student.completedProblems}/
          {student.totalProblems}問)
        </Badge>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{savedNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左：スキルマップ ＆ 章別進捗 */}
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

        {/* 右：フィードバック送信フォーム ＆ 直近の提出コード */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-indigo-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquarePlus className="h-4 w-4 text-indigo-600" />
                講師フィードバック・評価の入力
              </CardTitle>
              <CardDescription className="text-xs">
                ここで入力した評価とコメントは、受講生本人および所属企業の研修担当者にも共有されます。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddFeedback} className="space-y-4">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold text-slate-700">
                    5段階スキル評価:
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className={`px-2.5 py-1 rounded border text-xs font-bold inline-flex items-center gap-1 ${
                          rating >= num
                            ? "bg-amber-50 border-amber-300 text-amber-700"
                            : "bg-slate-50 text-slate-400"
                        }`}
                      >
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <Textarea
                  required
                  rows={3}
                  placeholder="提出コードの良かった点や改善アドバイスを入力してください..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <Button type="submit">
                  <Send className="h-3.5 w-3.5" />
                  フィードバックを登録する
                </Button>
              </form>

              <div className="mt-6 pt-4 border-t space-y-3">
                <div className="text-xs font-bold text-slate-600">
                  送信済みフィードバック履歴
                </div>
                {evaluations.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-lg bg-slate-50 border text-xs space-y-1"
                  >
                    <div className="flex justify-between font-semibold">
                      <span>{ev.adminName}</span>
                      <span className="text-amber-600">
                        ★ {ev.rating} / 5 ({ev.createdAt})
                      </span>
                    </div>
                    <p className="text-slate-700">{ev.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Code2 className="h-4 w-4 text-blue-600" />
                直近の提出コード（{SEED_PROBLEMS[4].title}）
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
                {SEED_PROBLEMS[4].solution_code}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
