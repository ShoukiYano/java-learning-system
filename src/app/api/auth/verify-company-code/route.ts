/**
 * ファイル概要：
 * 受講生新規登録前の「企業コード存在検証」API（POST /api/auth/verify-company-code）
 * 登録済みの企業コードのみ新規受講登録を許可するため、companies テーブルと照合します。
 */

import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/data-service";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const DEMO_VALID_COMPANY_CODES: Record<string, string> = {
  ACME2025: "株式会社ACMEテクノロジーズ",
  TECH2025: "ネクストシステムズ株式会社",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cleanCode = String(body.companyCode ?? "").trim().toUpperCase();

    if (!cleanCode) {
      return NextResponse.json(
        {
          valid: false,
          error: "企業コードを入力してください。",
        },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      const demoName = DEMO_VALID_COMPANY_CODES[cleanCode];
      if (!demoName) {
        return NextResponse.json(
          {
            valid: false,
            error:
              "入力された企業コードは登録されていません。所属企業の担当者から配布された正しい企業コードを入力してください。",
          },
          { status: 404 }
        );
      }
      return NextResponse.json({ valid: true, companyName: demoName });
    }

    const db =
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
        ? createAdminClient()
        : await createClient();

    const { data: company, error } = await db
      .from("companies")
      .select("id, name, company_code")
      .ilike("company_code", cleanCode)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        {
          valid: false,
          error: `企業コードの確認中にエラーが発生しました: ${error.message}`,
        },
        { status: 500 }
      );
    }

    if (!company) {
      return NextResponse.json(
        {
          valid: false,
          error:
            "入力された企業コードは登録されていません。所属企業の担当者から配布された正しい企業コードを入力してください。",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      companyName: company.name,
    });
  } catch {
    return NextResponse.json(
      {
        valid: false,
        error: "企業コードの確認処理中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
