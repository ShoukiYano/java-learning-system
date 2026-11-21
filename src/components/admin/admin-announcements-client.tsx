"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Send, CheckCircle2, AlertTriangle } from "lucide-react";

export interface AdminAnnouncementViewItem {
  id: string;
  title: string;
  content_md: string;
  company_id: string | null;
  targetLabel: string;
  createdAt: string;
}

export interface AdminAnnouncementCompanyOption {
  id: string;
  name: string;
  company_code: string;
}

export function AdminAnnouncementsClient({
  initialItems,
  companies,
}: {
  initialItems: AdminAnnouncementViewItem[];
  companies: AdminAnnouncementCompanyOption[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<AdminAnnouncementViewItem[]>(initialItems);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [companyScope, setCompanyScope] = useState("ALL");
  const [sending, setSending] = useState(false);
  const [sentNotice, setSentNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || sending) return;
    setSending(true);
    setSentNotice(null);
    setErrorMsg(null);

    const selectedCompany =
      companyScope === "ALL"
        ? null
        : companies.find((c) => c.id === companyScope) ?? null;

    const targetLabel = selectedCompany
      ? `${selectedCompany.name} 限定`
      : "全テナント公開";
    const companyId = selectedCompany ? selectedCompany.id : null;

    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_announcement",
          payload: {
            title: title.trim(),
            content_md: content.trim(),
            company_id: companyId,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || "お知らせの保存・配信に失敗しました。");
        return;
      }

      setItems((prev) => [
        {
          id: data.announcement?.id ?? `ann-${Date.now()}`,
          title: title.trim(),
          content_md: content.trim(),
          company_id: companyId,
          targetLabel,
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ]);
      setTitle("");
      setContent("");
      setSentNotice(
        "✅ お知らせをデータベースに保存・配信しました。対象テナント受講生のダッシュボードに即時表示されます。"
      );
      router.refresh();
    } catch {
      setErrorMsg("通信エラーが発生しました。");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          お知らせ管理（全体／テナント企業別配信）
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          全受講生向けのお知らせ、または特定テナント企業の受講生だけに見える限定アナウンスを配信できます（RLSで保護）。
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {sentNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{sentNotice}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-indigo-600" />
            新規お知らせを作成
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePublish} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold">タイトル</label>
                <Input
                  required
                  placeholder="例：SQL実践コース追加のお知らせ"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">配信対象テナント</label>
                <select
                  value={companyScope}
                  onChange={(e) => setCompanyScope(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm"
                >
                  <option value="ALL">すべての受講生（全テナント公開）</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}（{c.company_code}）のみ
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">本文</label>
              <Textarea
                required
                rows={3}
                placeholder="お知らせ内容を入力してください..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={sending}>
              <Send className="h-3.5 w-3.5" />
              {sending ? "配信中..." : "お知らせを配信する"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {items.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-sm text-slate-500">
              配信済みのお知らせはまだありません。
            </CardContent>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        item.company_id === null ? "default" : "warning"
                      }
                    >
                      {item.targetLabel}
                    </Badge>
                    <span className="font-bold text-sm">{item.title}</span>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">
                    {item.createdAt}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.content_md}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
