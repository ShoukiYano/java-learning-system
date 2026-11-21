/**
 * ファイル概要：
 * お知らせ既読登録 API（POST /api/student/announcements/read）
 */

import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/data-service";
import { requireApiAuth } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

declare global {
  // eslint-disable-next-line no-var
  var __demoAnnouncementReads: Record<string, string[]> | undefined;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(["student", "company", "admin"]);
    if (!auth.ok) return auth.response;

    const body = await request.json();
    const announcementId = String(body.announcementId ?? "").trim();
    if (!announcementId) {
      return NextResponse.json(
        { error: "announcementId が必要です。" },
        { status: 400 }
      );
    }

    const profile = auth.profile;
    if (!globalThis.__demoAnnouncementReads) {
      globalThis.__demoAnnouncementReads = {};
    }
    const list = new Set(globalThis.__demoAnnouncementReads[profile.id] ?? []);
    list.add(announcementId);
    globalThis.__demoAnnouncementReads[profile.id] = Array.from(list);

    if (isSupabaseConfigured()) {
      const db =
        process.env.SUPABASE_SERVICE_ROLE_KEY &&
        !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
          ? createAdminClient()
          : await createClient();
      const { error: readErr } = await db.from("announcement_reads").upsert(
        {
          user_id: profile.id,
          announcement_id: announcementId,
          read_at: new Date().toISOString(),
        },
        { onConflict: "user_id,announcement_id" }
      );
      if (readErr) {
        return NextResponse.json(
          { error: `既読状態の保存に失敗しました: ${readErr.message}` },
          { status: 500 }
        );
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
