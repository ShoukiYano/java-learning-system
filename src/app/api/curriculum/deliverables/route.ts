/**
 * ファイル概要：
 * 実務成果物提出・企業担当者レビュー API（POST /api/curriculum/deliverables）
 * Spring Boot / JDBC / Git+JUnit / 最終実務プロジェクトなど、ブラウザ自動実行外の課題提出を管理します。
 */

import { NextRequest, NextResponse } from "next/server";
import {
  saveInMemoryDeliverable,
  reviewInMemoryDeliverable,
} from "@/lib/curriculum/graduation";
import { isSupabaseConfigured } from "@/lib/data-service";
import { requireApiAuth } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action = "submit" } = body;

    const auth = await requireApiAuth(
      action === "review" ? ["company", "admin"] : ["student", "company", "admin"]
    );
    if (!auth.ok) return auth.response;

    const userId = auth.profile.id;
    const companyId: string | null = auth.profile.company_id ?? null;

    if (action === "review") {
      const { submissionId, reviewStatus, reviewerComment, score } = body;
      const numericScore =
        score !== undefined && score !== null && score !== ""
          ? Number(score)
          : undefined;
      const updated = reviewInMemoryDeliverable(
        submissionId,
        reviewStatus,
        reviewerComment,
        numericScore
      );

      if (isSupabaseConfigured()) {
        const db =
          process.env.SUPABASE_SERVICE_ROLE_KEY &&
          !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
            ? createAdminClient()
            : await createClient();

        // 企業担当者の場合、自社所属受講生の成果物か検証（IDOR防止）
        if (auth.role === "company") {
          const { data: targetSub } = await db
            .from("deliverable_submissions")
            .select("company_id")
            .eq("id", submissionId)
            .maybeSingle();
          if (!companyId || !targetSub || targetSub.company_id !== companyId) {
            return NextResponse.json(
              { error: "他社所属の受講生の成果物はレビューできません。" },
              { status: 403 }
            );
          }
        }

        const { data: dbUpdated, error: revErr } = await db
          .from("deliverable_submissions")
          .update({
            review_status: reviewStatus,
            reviewer_id: userId,
            reviewer_comment: reviewerComment ? String(reviewerComment).trim() : null,
            score: numericScore ?? null,
            reviewed_at: new Date().toISOString(),
          })
          .eq("id", submissionId)
          .select("*")
          .maybeSingle();

        if (revErr) {
          return NextResponse.json(
            { error: `レビュー結果のDB保存に失敗しました: ${revErr.message}` },
            { status: 500 }
          );
        }
        return NextResponse.json({ ok: true, submission: dbUpdated ?? updated });
      }

      return NextResponse.json({ ok: true, submission: updated });
    }

    const dayNum = Number(body.day);
    const repositoryUrl = body.repositoryUrl ? String(body.repositoryUrl).trim() : "";
    const codeOrNotes = String(body.codeOrNotes || "").trim();
    const testEvidence = body.testEvidence ? String(body.testEvidence).trim() : "";

    if (!dayNum || dayNum < 1 || dayNum > 90) {
      return NextResponse.json(
        { error: "有効なDay番号（1〜90）を指定してください。" },
        { status: 400 }
      );
    }
    if (!codeOrNotes && !repositoryUrl) {
      return NextResponse.json(
        { error: "GitHubリポジトリURLまたは提出コード・実装メモのいずれかを入力してください。" },
        { status: 400 }
      );
    }

    const saved = saveInMemoryDeliverable({
      userId,
      companyId,
      day: dayNum,
      repositoryUrl: repositoryUrl || undefined,
      codeOrNotes: codeOrNotes || "(リポジトリURL提出)",
      testEvidence: testEvidence || undefined,
    });

    let persistedSubmission: unknown = saved;
    if (isSupabaseConfigured()) {
      const db =
        process.env.SUPABASE_SERVICE_ROLE_KEY &&
        !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
          ? createAdminClient()
          : await createClient();
      const { data: inserted, error: insErr } = await db
        .from("deliverable_submissions")
        .insert({
          user_id: userId,
          company_id: companyId,
          day_number: dayNum,
          repository_url: repositoryUrl || null,
          code_or_notes: saved.codeOrNotes,
          test_evidence: testEvidence || null,
          review_status: "submitted",
        })
        .select("*")
        .single();
      if (insErr) {
        return NextResponse.json(
          { error: `成果物のDB保存に失敗しました: ${insErr.message}` },
          { status: 500 }
        );
      }
      if (inserted) {
        persistedSubmission = inserted;
      }
    }

    return NextResponse.json({
      ok: true,
      submission: persistedSubmission,
      message: `Day ${dayNum} の成果物を提出しました。研修担当者のレビューをお待ちください。`,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "成果物の提出処理中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
