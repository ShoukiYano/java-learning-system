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
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action = "submit" } = body;

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
        }
      } catch {
        // ignore
      }
    }

    if (action === "review") {
      const { submissionId, reviewStatus, reviewerComment, score } = body;
      const updated = reviewInMemoryDeliverable(
        submissionId,
        reviewStatus,
        reviewerComment,
        score !== undefined ? Number(score) : undefined
      );
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

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        await supabase.from("deliverable_submissions").insert({
          user_id: userId,
          company_id: companyId,
          day_number: dayNum,
          repository_url: repositoryUrl || null,
          code_or_notes: saved.codeOrNotes,
          test_evidence: testEvidence || null,
          review_status: "submitted",
        });
      } catch {
        // テーブル未マイグレーション時はインメモリで継続
      }
    }

    return NextResponse.json({
      ok: true,
      submission: saved,
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
