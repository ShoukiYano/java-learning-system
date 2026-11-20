/**
 * ファイル概要：
 * お知らせ既読登録 API（POST /api/student/announcements/read）
 */

import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile, isSupabaseConfigured } from "@/lib/data-service";
import { createClient } from "@/lib/supabase/server";

declare global {
  // eslint-disable-next-line no-var
  var __demoAnnouncementReads: Record<string, string[]> | undefined;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const announcementId = String(body.announcementId ?? "").trim();
    if (!announcementId) {
      return NextResponse.json(
        { error: "announcementId が必要です。" },
        { status: 400 }
      );
    }

    const profile = await getCurrentProfile();
    if (!globalThis.__demoAnnouncementReads) {
      globalThis.__demoAnnouncementReads = {};
    }
    const list = new Set(globalThis.__demoAnnouncementReads[profile.id] ?? []);
    list.add(announcementId);
    globalThis.__demoAnnouncementReads[profile.id] = Array.from(list);

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        await supabase.from("announcement_reads").upsert(
          {
            user_id: profile.id,
            announcement_id: announcementId,
            read_at: new Date().toISOString(),
          },
          { onConflict: "user_id,announcement_id" }
        );
      } catch {
        // テーブル未適用時はインメモリのみで継続
      }
    }

    return NextResponse.json({
      ok: true,
      readIds: globalThis.__demoAnnouncementReads[profile.id],
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "既読更新中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
