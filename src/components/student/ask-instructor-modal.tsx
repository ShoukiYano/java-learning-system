"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  MessageCircleQuestion,
  X,
  ImagePlus,
  Trash2,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface AskInstructorButtonProps {
  problemId: string;
  problemTitle: string;
  /** Optional current snippet (e.g. GitHub PR URL, Excel formulas, HTML/CSS code) */
  contextSnippet?: string;
  /** Label for the optional snippet checkbox */
  contextLabel?: string;
}

interface AttachedImage {
  file: File;
  previewUrl: string;
}

const MAX_IMAGES = 3;
const MAX_BYTES = 5 * 1024 * 1024;

export function AskInstructorButton({
  problemId,
  problemTitle,
  contextSnippet,
  contextLabel = "現在の入力内容・URLを添える",
}: AskInstructorButtonProps) {
  const [open, setOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [includeContext, setIncludeContext] = useState(true);
  const [images, setImages] = useState<AttachedImage[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imagesRef = useRef<AttachedImage[]>([]);
  imagesRef.current = images;

  // Cleanup object URLs only on unmount (so adding a 2nd image doesn't revoke the 1st)
  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, []);

  function addFiles(files: FileList | File[]) {
    const incoming = Array.from(files);
    const next: AttachedImage[] = [];
    for (const f of incoming) {
      if (!f.type.startsWith("image/")) {
        setFeedback({ type: "error", text: "画像ファイル（PNG / JPEG / GIF / WebP）を選択してください。" });
        continue;
      }
      if (f.size > MAX_BYTES) {
        setFeedback({ type: "error", text: "画像サイズは1枚5MB以内にしてください。" });
        continue;
      }
      if (images.length + next.length >= MAX_IMAGES) {
        setFeedback({ type: "error", text: `画像は最大${MAX_IMAGES}枚まで添付できます。` });
        break;
      }
      next.push({ file: f, previewUrl: URL.createObjectURL(f) });
    }
    if (next.length > 0) {
      setImages((prev) => [...prev, ...next]);
      setFeedback(null);
    }
  }

  function removeImage(idx: number) {
    setImages((prev) => {
      const target = prev[idx];
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== idx);
    });
  }

  function handlePaste(e: React.ClipboardEvent) {
    const items = e.clipboardData?.items;
    if (!items) return;
    const pastedFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const f = item.getAsFile();
        if (f) pastedFiles.push(f);
      }
    }
    if (pastedFiles.length > 0) {
      addFiles(pastedFiles);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!questionText.trim()) return;
    setSubmitting(true);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.append("problemId", problemId);
      formData.append("problemTitle", problemTitle);
      formData.append("questionText", questionText.trim());
      if (includeContext && contextSnippet?.trim()) {
        formData.append("codeSnippet", contextSnippet.trim());
      }
      for (const img of images) {
        formData.append("images", img.file, img.file.name || "screenshot.png");
      }

      const res = await fetch("/api/student/questions", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: "error", text: data.error || "質問の送信に失敗しました。" });
        return;
      }

      setFeedback({
        type: "success",
        text: data.message || "講師へ質問を送信しました！",
      });
      setQuestionText("");
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
      setImages([]);
    } catch {
      setFeedback({ type: "error", text: "通信エラーが発生しました。" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setFeedback(null);
          setOpen(true);
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition"
      >
        <MessageCircleQuestion className="h-3.5 w-3.5" />
        講師に質問する
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
          onPaste={handlePaste}
        >
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3.5">
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <MessageCircleQuestion className="h-4 w-4 text-indigo-600" />
                  講師に質問する（画像・スクショ添付OK）
                </h2>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{problemTitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
                aria-label="閉じる"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="rounded-xl bg-sky-50 border border-sky-200 px-3.5 py-2.5 text-[11px] text-sky-900 leading-relaxed">
                <strong>伝わる質問のコツ：</strong>
                ①やりたかったこと ②出たエラー（画面スクショを <kbd className="px-1 py-0.5 rounded bg-white border border-sky-300 font-mono">Ctrl+V</kbd> で貼り付け可）③試したこと を書くとスムーズに解決できます。
              </div>

              <label className="block space-y-1.5">
                <span className="text-xs font-bold text-slate-800">
                  質問内容 <span className="text-rose-500">*</span>
                </span>
                <textarea
                  rows={5}
                  required
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="例：EclipseでSpring Bootを起動するとPostgreSQL接続エラーが出ます。application.propertiesとコンソールのスクリーンショットを添付しました。"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
                />
              </label>

              {/* Image Attachment Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    スクリーンショット・画像添付（最大{MAX_IMAGES}枚・各5MBまで）
                  </span>
                  <button
                    type="button"
                    disabled={images.length >= MAX_IMAGES}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 text-xs font-semibold text-slate-700 transition"
                  >
                    <ImagePlus className="h-3.5 w-3.5 text-indigo-600" />
                    画像を追加
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) addFiles(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-lg border border-slate-200 overflow-hidden bg-slate-100 aspect-video"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.previewUrl}
                          alt={`添付画像${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 rounded-full bg-slate-900/75 p-1 text-white hover:bg-rose-600 transition"
                          aria-label="画像を削除"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {contextSnippet && (
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeContext}
                    onChange={(e) => setIncludeContext(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600"
                  />
                  <span>{contextLabel}</span>
                </label>
              )}

              {feedback && (
                <div
                  className={`rounded-xl border px-3.5 py-2.5 text-xs font-semibold flex items-start gap-2 ${
                    feedback.type === "success"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                      : "border-rose-200 bg-rose-50 text-rose-800"
                  }`}
                >
                  {feedback.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p>{feedback.text}</p>
                    {feedback.type === "success" && (
                      <Link
                        href="/student/questions"
                        className="inline-block underline font-bold text-emerald-900"
                      >
                        質問・回答一覧（Q&amp;A）を開く →
                      </Link>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  閉じる
                </button>
                <button
                  type="submit"
                  disabled={submitting || !questionText.trim()}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition"
                >
                  {submitting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  講師へ送信する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
