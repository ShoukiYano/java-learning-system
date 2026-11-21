import React, { Suspense } from "react";
import { getCurrentProfile, isSupabaseConfigured } from "@/lib/data-service";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  StudentQuestionsClient,
  StudentQuestionThread,
  QuestionReplyItem,
} from "@/components/dashboard/student-questions-client";

export const dynamic = "force-dynamic";

async function loadStudentQuestions(
  userId: string
): Promise<StudentQuestionThread[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const db =
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
        ? createAdminClient()
        : await createClient();

    const { data: qRows } = await db
      .from("student_questions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    const list = (qRows ?? []) as Array<
      Omit<StudentQuestionThread, "replies">
    >;
    if (list.length === 0) return [];

    const qIds = list.map((q) => q.id);
    const repliesMap: Record<string, QuestionReplyItem[]> = {};

    const { data: rRows } = await db
      .from("student_question_replies")
      .select("*")
      .in("question_id", qIds)
      .order("created_at", { ascending: true });

    for (const r of (rRows ?? []) as QuestionReplyItem[]) {
      if (!repliesMap[r.question_id]) repliesMap[r.question_id] = [];
      repliesMap[r.question_id].push({
        ...r,
        image_urls: Array.isArray(r.image_urls) ? r.image_urls : [],
      });
    }

    return list.map((q) => ({
      ...q,
      has_unread_reply: Boolean(q.has_unread_reply),
      replies: repliesMap[q.id] ?? [],
    }));
  } catch {
    return [];
  }
}

export default async function StudentQuestionsPage() {
  const profile = await getCurrentProfile();
  const questions = await loadStudentQuestions(profile.id);

  return (
    <Suspense fallback={null}>
      <StudentQuestionsClient initialQuestions={questions} />
    </Suspense>
  );
}
