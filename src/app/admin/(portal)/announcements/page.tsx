"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Send, CheckCircle2 } from "lucide-react";

interface AnnouncementItem {
  id: string;
  title: string;
  content_md: string;
  targetLabel: string;
  createdAt: string;
}

export default function AdminAnnouncementsPage() {
  const [items, setItems] = useState<AnnouncementItem[]>([
    {
      id: "ann-1",
      title: "Java入門コース・SQL実践コース開講のお知らせ",
      content_md:
        "Javaの基礎からオブジェクト指向、およびSQLのデータ抽出・集計・JOIN結合までブラウザ上で学習できます。",
      targetLabel: "全テナント公開",
      createdAt: "2025-05-01",
    },
    {
      id: "ann-2",
      title: "【ACME社向け】今週末までの到達目標について",
      content_md:
        "ACMEテクノロジーズの新人研修受講生は、金曜17時までに「Java第3章」および「SQL第1章」までの完了を目指してください。",
      targetLabel: "株式会社ACMEテクノロジーズ 限定",
      createdAt: "2025-05-10",
    },
  ]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [companyScope, setCompanyScope] = useState("ALL");
  const [sentNotice, setSentNotice] = useState<string | null>(null);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const targetLabel =
      companyScope === "ALL"
        ? "全テナント公開"
        : companyScope === "ACME"
        ? "株式会社ACMEテクノロジーズ 限定"
        : "ネクストシステムズ株式会社 限定";

    setItems((prev) => [
      {
        id: `ann-${Date.now()}`,
        title: title.trim(),
        content_md: content.trim(),
        targetLabel,
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setTitle("");
    setContent("");
    setSentNotice(
      "お知らせを配信しました。対象テナント受講生のダッシュボードに表示されます。"
    );
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

      {sentNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
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
                  <option value="ACME">株式会社ACMEテクノロジーズのみ</option>
                  <option value="TECH">ネクストシステムズ株式会社のみ</option>
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

            <Button type="submit">
              <Send className="h-3.5 w-3.5" />
              お知らせを配信する
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      item.targetLabel === "全テナント公開"
                        ? "default"
                        : "warning"
                    }
                  >
                    {item.targetLabel}
                  </Badge>
                  <span className="font-bold text-sm">{item.title}</span>
                </div>
                <span className="text-xs text-slate-400">{item.createdAt}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.content_md}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
