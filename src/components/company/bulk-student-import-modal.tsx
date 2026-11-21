"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Download,
  Users,
  Loader2,
} from "lucide-react";

interface ParsedRow {
  fullName: string;
  email: string;
  password?: string;
}

interface ImportResultRow {
  fullName: string;
  email: string;
  password?: string;
  status: "created" | "skipped" | "error";
  message: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  companyName: string;
}

function parseCsvRows(raw: string): ParsedRow[] {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const rows: ParsedRow[] = [];

  for (let i = 0; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    if (cols.length < 2) continue;
    // ヘッダー行スキップ
    if (
      i === 0 &&
      (cols[0].includes("氏名") ||
        cols[0].toLowerCase().includes("name") ||
        cols[1].includes("メール") ||
        cols[1].toLowerCase().includes("email"))
    ) {
      continue;
    }
    rows.push({
      fullName: cols[0],
      email: cols[1],
      password: cols[2] || undefined,
    });
  }
  return rows;
}

export function BulkStudentImportModal({ open, onClose, companyName }: Props) {
  const router = useRouter();
  const [csvText, setCsvText] = useState(
    "氏名,メールアドレス,初期パスワード(任意)\n佐藤 健太,kenta.sato@example.com,\n高橋 美咲,misaki.takahashi@example.com,Pass2026!"
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ImportResultRow[] | null>(null);

  if (!open) return null;

  const parsedPreview = parseCsvRows(csvText);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCsvText(reader.result);
        setResults(null);
        setError(null);
      }
    };
    reader.readAsText(file, "UTF-8");
  };

  const handleSubmit = async () => {
    if (parsedPreview.length === 0) {
      setError("有効な受講生データ（氏名,メールアドレス）が1件もありません。");
      return;
    }
    setSubmitting(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch("/api/company/students/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: parsedPreview }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "一括登録に失敗しました。");
      } else {
        setResults(data.results || []);
        router.refresh();
      }
    } catch {
      setError("通信エラーが発生しました。");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadCredentials = () => {
    if (!results) return;
    const safeCell = (val: string) => {
      const s = String(val ?? "");
      const neutralized = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
      return `"${neutralized.replace(/"/g, '""')}"`;
    };
    const header = "氏名,メールアドレス,初期パスワード,結果,詳細";
    const lines = results.map(
      (r) =>
        [
          safeCell(r.fullName),
          safeCell(r.email),
          safeCell(r.password ?? ""),
          safeCell(r.status),
          safeCell(r.message),
        ].join(",")
    );
    const bom = "\uFEFF";
    const blob = new Blob([bom + [header, ...lines].join("\r\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `issued_students_${companyName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              受講生の一括CSV登録（{companyName}）
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              「氏名,メールアドレス,初期パスワード(省略時は自動発行)」形式で最大100名まで一括登録できます。
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!results ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer">
                  <Upload className="h-3.5 w-3.5 text-emerald-600" />
                  CSVファイルを選択（UTF-8）
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-500">
                  検出件数: <strong className="text-slate-900">{parsedPreview.length}</strong> 名
                </span>
              </div>

              <Textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                rows={7}
                className="font-mono text-xs"
                placeholder="氏名,メールアドレス,初期パスワード(任意)"
              />

              {parsedPreview.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600 border-b">
                    登録プレビュー（先頭5件）
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-white border-b text-slate-500">
                        <tr>
                          <th className="py-1.5 px-3">氏名</th>
                          <th className="py-1.5 px-3">メールアドレス</th>
                          <th className="py-1.5 px-3">初期パスワード</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {parsedPreview.slice(0, 5).map((r, i) => (
                          <tr key={i}>
                            <td className="py-1.5 px-3 font-medium">{r.fullName}</td>
                            <td className="py-1.5 px-3 font-mono text-slate-600">{r.email}</td>
                            <td className="py-1.5 px-3 text-slate-500">
                              {r.password ? "指定済み" : "自動生成"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>
                    処理完了：新規発行{" "}
                    <strong>{results.filter((r) => r.status === "created").length}</strong> 名 ／
                    スキップ・エラー{" "}
                    <strong>{results.filter((r) => r.status !== "created").length}</strong> 名
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleDownloadCredentials}
                  className="bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-100 h-7 text-xs"
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  発行結果CSV保存
                </Button>
              </div>

              <div className="border rounded-lg overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b text-slate-600">
                    <tr>
                      <th className="py-2 px-3">氏名</th>
                      <th className="py-2 px-3">メール</th>
                      <th className="py-2 px-3">初期PW</th>
                      <th className="py-2 px-3">結果</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {results.map((r, i) => (
                      <tr key={i}>
                        <td className="py-2 px-3 font-medium">{r.fullName}</td>
                        <td className="py-2 px-3 font-mono">{r.email}</td>
                        <td className="py-2 px-3 font-mono text-indigo-700">
                          {r.password ?? "-"}
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.status === "created"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {r.message}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t bg-slate-50 flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            閉じる
          </Button>
          {!results ? (
            <Button
              type="button"
              size="sm"
              onClick={handleSubmit}
              disabled={submitting || parsedPreview.length === 0}
              className="bg-emerald-700 hover:bg-emerald-600 text-white"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  一括登録中...
                </>
              ) : (
                `${parsedPreview.length}名を一括登録する`
              )}
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setResults(null)}
            >
              続けて登録する
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
