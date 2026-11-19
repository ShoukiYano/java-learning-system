/**
 * ファイル概要：
 * 日別理解度確認テスト結果保存 API（POST /api/curriculum/quiz）
 */

import { NextRequest, NextResponse } from "next/server";
import { getCurriculumDay } from "@/lib/curriculum/days-plan";
import { saveInMemoryQuizAttempt } from "@/lib/curriculum/graduation";
import { isSupabaseConfigured } from "@/lib/data-service";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dayNum = Number(body.day);
    const answers: Record<string, number> = body.answers ?? {};

    const dayPlan = getCurriculumDay(dayNum);
    if (!dayPlan || !dayPlan.quizzes || dayPlan.quizzes.length === 0) {
      return NextResponse.json(
        { error: "指定されたDayの理解度テストが見つかりません。" },
        { status: 404 }
      );
    }

    let correctCount = 0;
    const details = dayPlan.quizzes.map((q) => {
      const selected = answers[q.id];
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        selected,
        correctIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const totalCount = dayPlan.quizzes.length;
    const scorePercent = Math.round((correctCount / totalCount) * 100);

    let userId = "demo-student";
    let companyId: string | null = null;

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          userId = user.id;
          const { data: prof } = await supabase
            .from("profiles")
            .select("company_id")
            .eq("id", user.id)
            .maybeSingle();
          companyId = prof?.company_id ?? null;

          // テーブルがマイグレーション済みであれば保存（未作成時は安全にスキップ）
          await supabase.from("quiz_attempts").insert({
            user_id: userId,
            company_id: companyId,
            day_number: dayNum,
            correct_count: correctCount,
            total_count: totalCount,
            score_percent: scorePercent,
            answers_json: details,
          });
        }
      } catch {
        // マイグレーション未適用時はインメモリ保存にフォールバック
      }
    }

    const attempt = saveInMemoryQuizAttempt({
      userId,
      day: dayNum,
      correctCount,
      totalCount,
      scorePercent,
    });

    return NextResponse.json({
      ok: true,
      attempt,
      correctCount,
      totalCount,
      scorePercent,
      details,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "理解度テストの採点中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
