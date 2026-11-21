"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquareText,
  Send,
  Code2,
  CheckCircle2,
  Clock,
  ExternalLink,
  X,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

export interface QuestionReplyItem {
  id: string;
  question_id: string;
  sender_role: "instructor" | "student";
  sender_name: string;
  body: string;
  image_urls: string[];
  created_at: string;
}

export interface StudentQuestionThread {
  id: string;
  problem_id: string;
  problem_title: string;
  question_text: string;
  code_snippet: string | null;
  status: string;
  has_unread_reply: boolean;
  slack_thread_ts?: string | null;
  created_at: string;
  updated_at?: string;
  replies: QuestionReplyItem[];
}

export function StudentQuestionsClient({
  initialQuestions,
}: {
  initialQuestions: StudentQuestionThread[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedId = searchParams.get("id");

  const [questions, setQuestions] =
    useState<StudentQuestionThread[]>(initialQuestions);
  const [selectedId, setSelectedId] = useState<string | null>(
    requestedId && initialQuestions.some((q) => q.id === requestedId)
      ? requestedId
      : initialQuestions[0]?.id ?? null
  );
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const selected = questions.find((q) => q.id === selectedId) ?? null;

  // 選択された質問が未読回答ありなら自動で既読化
  useEffect(() => {
    if (!selected || !selected.has_unread_reply) return;
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === selected.id ? { ...q, has_unread_reply: false } : q
      )
    );
    fetch("/api/student/questions/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: selected.id }),
    })
      .then((res) => {
        if (res.ok) router.refresh();
      })
      .catch(() => {});
  }, [selected, router]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !replyText.trim() || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/student/questions/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: selected.id,
          body: replyText.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "返信の送信に失敗しました。");
        return;
      }
      if (data.reply) {
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === selected.id
              ? {
                  ...q,
                  status: "open",
                  replies: [...q.replies, data.reply as QuestionReplyItem],
                }
              : q
          )
        );
      }
      setReplyText("");
      router.refresh();
    } catch {
      setError("通信エラーが発生しました。");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-slate-900">
            <MessageSquareText className="h-6 w-6 text-indigo-600" />
            講師への質問・回答（Q&amp;A）
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            演習問題から送った質問と、講師からの回答（テキスト・解説画像）をスレッド形式で確認できます。
          </p>
        </div>
        <Link
          href="/student/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
        >
          カリキュラムへ戻る
        </Link>
      </div>

      {questions.length === 0 ? (
        <Card>
          <CardContent className="py-14 text-center space-y-3">
            <MessageSquareText className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">
              まだ質問履歴はありません
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              演習問題画面の右上にある「講師に質問する」ボタンから質問を送信すると、ここにスレッドが作成され、講師からの回答が届きます。
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左：質問一覧 */}
          <div className="lg:col-span-4 space-y-2.5">
            {questions.map((q) => {
              const active = q.id === selectedId;
              const isAnswered =
                q.status === "answered" ||
                q.replies.some((r) => r.sender_role === "instructor");
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setSelectedId(q.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition space-y-1.5 ${
                    active
                      ? "bg-indigo-50/70 border-indigo-400 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {q.has_unread_reply ? (
                        <Badge variant="destructive" className="text-[10px]">
                          新着回答あり
                        </Badge>
                      ) : isAnswered ? (
                        <Badge variant="success" className="text-[10px] gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          回答済み
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="text-[10px] gap-1">
                          <Clock className="h-3 w-3" />
                          回答待ち
                        </Badge>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(q.created_at).toLocaleDateString("ja-JP")}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {q.problem_title}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {q.question_text}
                  </p>
                  <div className="text-[10px] text-slate-400">
                    返信 {q.replies.length} 件
                  </div>
                </button>
              );
            })}
          </div>

          {/* 右：スレッド詳細 */}
          <div className="lg:col-span-8">
            {selected && (
              <Card>
                <CardHeader className="border-b bg-slate-50/70 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-base text-slate-900">
                        {selected.problem_title}
                      </CardTitle>
                      <p className="text-xs text-slate-500 mt-0.5">
                        質問日時：
                        {new Date(selected.created_at).toLocaleString("ja-JP")}
                      </p>
                    </div>
                    {selected.problem_id && (
                      <Link
                        href={`/student/problems/${selected.problem_id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                      >
                        問題を開く
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-5 space-y-5">
                  {/* 元の質問 */}
                  <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 space-y-3">
                    <div className="text-xs font-bold text-blue-800">
                      あなたの質問
                    </div>
                    <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                      {selected.question_text}
                    </p>
                    {selected.code_snippet && (
                      <div className="space-y-1">
                        <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                          <Code2 className="h-3.5 w-3.5" />
                          質問時に添付したコード
                        </div>
                        <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-56">
                          {selected.code_snippet}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* スレッド返信一覧 */}
                  <div className="space-y-3">
                    {selected.replies.length === 0 ? (
                      <div className="p-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
                        担当講師へ通知済みです。回答が届くと画面上でお知らせします。
                      </div>
                    ) : (
                      selected.replies.map((rep) => {
                        const isInstructor = rep.sender_role === "instructor";
                        return (
                          <div
                            key={rep.id}
                            className={`rounded-xl border p-4 space-y-2.5 ${
                              isInstructor
                                ? "bg-emerald-50/60 border-emerald-200"
                                : "bg-slate-50 border-slate-200 ml-6"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span
                                className={`font-bold ${
                                  isInstructor
                                    ? "text-emerald-800"
                                    : "text-slate-700"
                                }`}
                              >
                                {isInstructor
                                  ? `👨‍🏫 ${rep.sender_name}（講師からの回答）`
                                  : `あなた（追加質問）`}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {new Date(rep.created_at).toLocaleString(
                                  "ja-JP"
                                )}
                              </span>
                            </div>

                            {rep.body && (
                              <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                                {rep.body}
                              </p>
                            )}

                            {rep.image_urls && rep.image_urls.length > 0 && (
                              <div className="space-y-1.5 pt-1">
                                <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                                  <ImageIcon className="h-3.5 w-3.5" />
                                  添付画像（クリックで拡大）
                                </div>
                                <div className="flex flex-wrap gap-2.5">
                                  {rep.image_urls.map((imgUrl, idx) => (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => setLightboxUrl(imgUrl)}
                                      className="group relative rounded-lg overflow-hidden border border-slate-200 bg-white hover:border-indigo-400 transition"
                                    >
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={imgUrl}
                                        alt={`講師からの添付画像 ${idx + 1}`}
                                        className="max-h-48 max-w-[280px] object-contain"
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* 追加質問フォーム */}
                  <form
                    onSubmit={handleSendReply}
                    className="pt-3 border-t space-y-2.5"
                  >
                    <label className="text-xs font-semibold text-slate-700 block">
                      追加で質問・返信する
                    </label>
                    {error && (
                      <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                        {error}
                      </div>
                    )}
                    <Textarea
                      rows={3}
                      placeholder="分からない点や確認したいことを入力してください（講師のSlackスレッドにも自動で届きます）"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      disabled={sending}
                    />
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={sending || !replyText.trim()}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
                      >
                        {sending ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            送信中...
                          </>
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            返信を送信
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* 画像拡大ライトボックス */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2"
            aria-label="閉じる"
          >
            <X className="h-6 w-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxUrl}
            alt="拡大画像"
            className="max-h-[90vh] max-w-[92vw] rounded-xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
