"use client";

/**
 * ファイル概要：
 * 受講生への「評価・コメント」管理コンポーネント（管理者・企業担当者共通）
 *
 * 主な処理：
 * - 5段階の星評価（★1〜★5）およびフィードバックコメントの一覧表示
 * - 新規評価・コメントの投稿処理（/api/admin/actions: create_feedback）
 * - 既存コメントのインライン編集・保存処理（update_feedback）
 * - コメントの削除処理（delete_feedback）
 *
 * 注意事項：
 * - 企業担当者が操作する場合、自社所属の受講生に対する操作のみ許可されます。
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MessageSquareQuote,
  Star,
  Send,
  Edit3,
  Trash2,
  Check,
  X,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export interface EvaluationEntry {
  id: string;
  adminName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export function EvaluationCommentManager({
  studentId,
  submissionId,
  initialEvaluations,
  defaultAuthorLabel = "担当者",
}: {
  studentId: string;
  submissionId?: string | null;
  initialEvaluations: EvaluationEntry[];
  defaultAuthorLabel?: string;
}) {
  const [evaluations, setEvaluations] =
    useState<EvaluationEntry[]>(initialEvaluations);

  // 新規作成用ステート
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>("");
  const [creating, setCreating] = useState(false);

  // 既存アイテムのインライン編集用ステート
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number>(5);
  const [editComment, setEditComment] = useState<string>("");
  const [updating, setUpdating] = useState(false);

  const [notice, setNotice] = useState<string | null>(null);

  // 1. 新規「評価・コメント」の追加
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || creating) return;
    setCreating(true);
    setNotice(null);

    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_feedback",
          payload: {
            student_id: studentId,
            submission_id: submissionId ?? null,
            rating: newRating,
            comment: newComment.trim(),
          },
        }),
      });
      const data = await res.json();

      const added: EvaluationEntry = {
        id: data.feedback?.id ?? `eval-${Date.now()}`,
        adminName: data.authorName ?? defaultAuthorLabel,
        rating: newRating,
        comment: newComment.trim(),
        createdAt: new Date().toISOString().slice(0, 10),
      };

      setEvaluations((prev) => [added, ...prev]);
      setNewComment("");
      setNotice("✅ 評価・コメントを登録しました。");
    } catch {
      setNotice("登録中にエラーが発生しました。");
    } finally {
      setCreating(false);
    }
  };

  // 2. 既存の「評価・コメント」をインライン編集して保存
  const startEdit = (ev: EvaluationEntry) => {
    setEditingId(ev.id);
    setEditRating(ev.rating);
    setEditComment(ev.comment);
    setNotice(null);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editComment.trim() || updating) return;
    setUpdating(true);
    setNotice(null);

    try {
      await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_feedback",
          payload: {
            feedback_id: id,
            rating: editRating,
            comment: editComment.trim(),
          },
        }),
      });

      setEvaluations((prev) =>
        prev.map((ev) =>
          ev.id === id
            ? { ...ev, rating: editRating, comment: editComment.trim() }
            : ev
        )
      );
      setEditingId(null);
      setNotice("✅ 評価・コメントを更新しました。");
    } catch {
      setNotice("更新中にエラーが発生しました。");
    } finally {
      setUpdating(false);
    }
  };

  // 3. 評価・コメントの削除
  const handleDelete = async (id: string) => {
    setNotice(null);
    setEvaluations((prev) => prev.filter((ev) => ev.id !== id));
    await fetch("/api/admin/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "delete_feedback",
        payload: { feedback_id: id },
      }),
    });
    setNotice("評価・コメントを削除しました。");
  };

  return (
    <Card className="border-amber-200/90">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquareQuote className="h-4 w-4 text-amber-600" />
          評価・コメント
        </CardTitle>
        <CardDescription className="text-xs">
          受講生の学習状況に対する5段階評価とコメントを追加・編集できます（受講生画面・企業画面・管理者画面で共有されます）。
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {notice && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* 新規登録フォーム */}
        <form
          onSubmit={handleAdd}
          className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700">
              新しい評価・コメントを追加
            </span>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-600 font-medium mr-1">
                5段階評価:
              </span>
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setNewRating(num)}
                  className={`px-2 py-1 rounded border text-xs font-bold inline-flex items-center gap-0.5 transition ${
                    newRating >= num
                      ? "bg-amber-100 border-amber-300 text-amber-800"
                      : "bg-white text-slate-400"
                  }`}
                >
                  <Star className="h-3 w-3 fill-current" />
                  {num}
                </button>
              ))}
            </div>
          </div>

          <Textarea
            required
            rows={2}
            placeholder="学習の進捗や理解度に関する評価・コメントを入力してください..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="bg-white text-xs"
          />

          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={creating}>
              {creating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  登録中...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  評価・コメントを追加
                </>
              )}
            </Button>
          </div>
        </form>

        {/* 登録済みの評価・コメント一覧（インライン編集・削除対応） */}
        <div className="space-y-3">
          {evaluations.length === 0 ? (
            <p className="text-xs text-slate-500">
              まだ登録された評価・コメントはありません。
            </p>
          ) : (
            evaluations.map((ev) => {
              const isEditing = editingId === ev.id;

              return (
                <div
                  key={ev.id}
                  className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2.5"
                >
                  {!isEditing ? (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-bold text-slate-900">
                          {ev.adminName}
                        </span>

                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1 font-bold text-amber-700">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                            総合評価 {ev.rating} / 5
                          </span>
                          <span className="text-slate-400">{ev.createdAt}</span>

                          <div className="flex items-center gap-1 ml-1">
                            <button
                              type="button"
                              onClick={() => startEdit(ev)}
                              className="px-2 py-1 rounded border bg-white hover:bg-slate-100 text-slate-700 font-semibold inline-flex items-center gap-1 transition"
                              title="この評価・コメントを編集"
                            >
                              <Edit3 className="h-3 w-3 text-blue-600" />
                              編集
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(ev.id)}
                              className="p-1 rounded border bg-white hover:bg-rose-50 text-rose-600 transition"
                              title="削除"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                        {ev.comment}
                      </p>
                    </>
                  ) : (
                    /* 編集モード */
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          評価・コメントを編集中（{ev.adminName}）
                        </span>

                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setEditRating(num)}
                              className={`px-2 py-0.5 rounded border text-xs font-bold inline-flex items-center gap-0.5 ${
                                editRating >= num
                                  ? "bg-amber-200 border-amber-400 text-amber-900"
                                  : "bg-white text-slate-400"
                              }`}
                            >
                              <Star className="h-3 w-3 fill-current" />
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Textarea
                        rows={3}
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className="bg-white text-xs"
                      />

                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                        >
                          <X className="h-3.5 w-3.5" />
                          キャンセル
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          disabled={updating}
                          onClick={() => handleSaveEdit(ev.id)}
                        >
                          <Check className="h-3.5 w-3.5" />
                          {updating ? "保存中..." : "変更を保存"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
