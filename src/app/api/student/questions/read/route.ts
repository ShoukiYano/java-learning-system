/**
 * ファイル概要：
 * 受講生の質問回答「既読化」API（POST /api/student/questions/read）
 */

import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/data-service";
import { requireApiAuth } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(["student", "company", "admin"]);
    if (!auth.ok) return auth.response;

    const body = await request.json().catch(() => ({}));
    const questionId = body.questionId ? String(body.questionId).trim() : null;

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ ok: true });
    }

    const db =
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
        ? createAdminClient()
        : await createClient();

    let q = db
      .from("student_questions")
      .update({ has_unread_reply: false })
      .eq("user_id", auth.profile.id);

    if (questionId) {
      q = q.eq("id", questionId);
    }

    const { error } = await q;
    if (error) {
      return NextResponse.json(
        { error: `既読更新に失敗しました: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "既読更新中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
