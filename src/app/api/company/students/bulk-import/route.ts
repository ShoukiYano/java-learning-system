/**
 * ファイル概要：
 * 企業担当者向け「受講生CSV一括アカウント発行」API（POST /api/company/students/bulk-import）
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { isSupabaseConfigured, getCurrentProfile } from "@/lib/data-service";
import { createAdminClient } from "@/lib/supabase/admin";
import { recordAuditLog } from "@/lib/audit-log";

interface ImportRow {
  fullName: string;
  email: string;
  password?: string;
}

function generateInitialPassword(): string {
  const rand = crypto.randomBytes(4).toString("hex");
  return `Dev${rand}!`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rows: ImportRow[] = Array.isArray(body.rows) ? body.rows : [];
    const companyId = String(body.companyId ?? "").trim();

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "登録対象の受講生データが空です。" },
        { status: 400 }
      );
    }
    if (rows.length > 100) {
      return NextResponse.json(
        { error: "1回に一括登録できるのは最大100名までです。" },
        { status: 400 }
      );
    }

    const caller = await getCurrentProfile();
    const targetCompanyId = companyId || caller.company_id || null;

    const results: Array<{
      fullName: string;
      email: string;
      password: string;
      status: "created" | "skipped" | "error";
      message: string;
    }> = [];

    const hasServiceKey =
      isSupabaseConfigured() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key");

    const adminClient = hasServiceKey ? createAdminClient() : null;

    for (const row of rows) {
      const fullName = String(row.fullName ?? "").trim();
      const email = String(row.email ?? "").trim().toLowerCase();
      const password =
        String(row.password ?? "").trim() || generateInitialPassword();

      if (!fullName || !email || !email.includes("@")) {
        results.push({
          fullName,
          email,
          password: "",
          status: "skipped",
          message: "氏名またはメールアドレスが不正です",
        });
        continue;
      }

      if (adminClient) {
        try {
          const { data: created, error: createErr } =
            await adminClient.auth.admin.createUser({
              email,
              password,
              email_confirm: true,
              user_metadata: {
                full_name: fullName,
                role: "student",
                company_id: targetCompanyId,
              },
            });

          if (createErr || !created.user) {
            results.push({
              fullName,
              email,
              password: "",
              status: "error",
              message: createErr?.message || "アカウント作成失敗",
            });
            continue;
          }

          await adminClient.from("profiles").upsert({
            id: created.user.id,
            email,
            full_name: fullName,
            role: "student",
            company_id: targetCompanyId,
          });

          results.push({
            fullName,
            email,
            password,
            status: "created",
            message: "登録完了",
          });
        } catch (e) {
          results.push({
            fullName,
            email,
            password: "",
            status: "error",
            message: e instanceof Error ? e.message : "登録エラー",
          });
        }
      } else {
        // デモ／サービスキー未設定時は発行プレビュー結果を返却
        results.push({
          fullName,
          email,
          password,
          status: "created",
          message: "登録完了（デモモード）",
        });
      }
    }

    const createdCount = results.filter((r) => r.status === "created").length;

    await recordAuditLog({
      actorId: caller.id,
      actorEmail: caller.email,
      actorRole: caller.role,
      action: "bulk_import_students",
      targetSummary: `受講生CSV一括登録（成功 ${createdCount} / ${rows.length} 名）`,
    });

    return NextResponse.json({
      ok: true,
      createdCount,
      totalCount: rows.length,
      results,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "CSV一括登録中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
