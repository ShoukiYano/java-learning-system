"use client";

import React, { useState } from "react";
import { Announcement } from "@/types/database";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Megaphone, Check, CheckCheck } from "lucide-react";

interface Props {
  announcements: Announcement[];
  initialReadIds: string[];
}

export function StudentAnnouncementsCard({
  announcements,
  initialReadIds,
}: Props) {
  const [readIds, setReadIds] = useState<string[]>(initialReadIds);
  const [markingId, setMarkingId] = useState<string | null>(null);

  if (announcements.length === 0) return null;

  const unreadCount = announcements.filter((a) => !readIds.includes(a.id)).length;

  const markAsRead = async (announcementId: string) => {
    if (readIds.includes(announcementId)) return;
    setMarkingId(announcementId);
    // 楽観的更新
    setReadIds((prev) => [...prev, announcementId]);
    try {
      await fetch("/api/student/announcements/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ announcementId }),
      });
    } catch {
      // 失敗してもUI上は維持（再読込で再同期）
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-amber-600" />
          お知らせ
          {unreadCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white">
              未読 {unreadCount}件
            </span>
          )}
        </CardTitle>
        {unreadCount === 0 && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <CheckCheck className="h-3.5 w-3.5" />
            すべて既読
          </span>
        )}
      </CardHeader>
      <CardContent className="divide-y">
        {announcements.map((ann) => {
          const isRead = readIds.includes(ann.id);
          return (
            <div
              key={ann.id}
              className={`py-3 first:pt-0 last:pb-0 space-y-1.5 transition ${
                isRead ? "opacity-80" : "bg-amber-50/40 -mx-3 px-3 rounded-lg"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                {!isRead && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                    未読
                  </span>
                )}
                <Badge variant="outline">
                  {ann.company_id ? "テナント限定" : "全体"}
                </Badge>
                <span className="font-semibold text-sm text-slate-900">
                  {ann.title}
                </span>
                <span className="text-xs text-slate-400 ml-auto">
                  {new Date(ann.created_at).toLocaleDateString("ja-JP")}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {ann.content_md}
                </p>
                {!isRead ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={markingId === ann.id}
                    onClick={() => markAsRead(ann.id)}
                    className="h-7 text-xs shrink-0 self-end border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    既読にする
                  </Button>
                ) : (
                  <span className="text-[11px] text-slate-400 shrink-0 self-end flex items-center gap-1">
                    <Check className="h-3 w-3 text-emerald-500" />
                    既読
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
