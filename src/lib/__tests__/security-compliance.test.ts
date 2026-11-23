import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";
import { isSameCompanyTenant, requireApiAuth } from "@/lib/api-auth";
import { DEMO_STUDENTS_ANALYTICS } from "@/lib/mock-analytics";
import { POST as graduationPost } from "@/app/api/company/graduation/route";
import { middleware } from "@/middleware";

describe("セキュリティ必須要件 UT / ITA（IDOR防止・ヘッダー・最小権限RLS）", () => {
  // === UT: 企業間データ分離ロジック ===
  it("UT-SEC-01: isSameCompanyTenant がロール・企業IDの組み合わせを厳格に判定する", () => {
    const ACME = "00000000-0000-4000-8000-000000000001";
    const NEXT = "00000000-0000-4000-8000-000000000002";

    // adminは全社アクセス可
    expect(isSameCompanyTenant("admin", null, ACME)).toBe(true);
    expect(isSameCompanyTenant("admin", null, NEXT)).toBe(true);

    // companyは自社のみ許可・他社やnullは拒否
    expect(isSameCompanyTenant("company", ACME, ACME)).toBe(true);
    expect(isSameCompanyTenant("company", ACME, NEXT)).toBe(false);
    expect(isSameCompanyTenant("company", ACME, null)).toBe(false);
    expect(isSameCompanyTenant("company", null, ACME)).toBe(false);

    // studentは常に拒否
    expect(isSameCompanyTenant("student", ACME, ACME)).toBe(false);
  });

  // === ITA: IDOR防止（他社受講生への修了判定保存を403遮断） ===
  it("ITA-SEC-02: /api/company/graduation へ他社受講生IDを送信すると403で遮断される", async () => {
    const otherCompanyStudent = DEMO_STUDENTS_ANALYTICS.find(
      (s) => s.companyId !== "00000000-0000-4000-8000-000000000001"
    );
    expect(otherCompanyStudent).toBeDefined();

    const res = await graduationPost(
      new NextRequest("http://localhost:3000/api/company/graduation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          studentId: otherCompanyStudent!.id,
          studentName: otherCompanyStudent!.fullName,
          scores: { java_oop: 20 },
          mandatoryPassed: true,
        }),
      })
    );
    expect(res.status).toBe(403);
  });

  it("ITA-SEC-03: /api/company/graduation へ自社受講生IDを送信すると200で保存できる", async () => {
    const ownCompanyStudent = DEMO_STUDENTS_ANALYTICS.find(
      (s) => s.companyId === "00000000-0000-4000-8000-000000000001"
    );
    expect(ownCompanyStudent).toBeDefined();

    const res = await graduationPost(
      new NextRequest("http://localhost:3000/api/company/graduation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          studentId: ownCompanyStudent!.id,
          studentName: ownCompanyStudent!.fullName,
          scores: { java_oop: 18 },
          mandatoryPassed: false,
        }),
      })
    );
    expect(res.status).toBe(200);
  });

  // === ITA: セキュリティヘッダー（XSS/クリックジャッキング/CSP/Permissions-Policy） ===
  it("ITA-SEC-04: /privacy やログイン画面に必須セキュリティヘッダーが付与される", async () => {
    const res = await middleware(new NextRequest("http://localhost:3000/privacy"));
    expect(res.status).toBe(200);
    expect(res.headers.get("x-frame-options")).toBe("DENY");
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("referrer-policy")).toBe("same-origin");
    expect(res.headers.get("permissions-policy")).toContain("camera=()");
    expect(res.headers.get("content-security-policy")).toContain(
      "frame-ancestors 'none'"
    );
  });

  // === UT: マイグレーションSQLの最小権限RLS検証 ===
  it("UT-SEC-05: 20261120_enterprise_features.sql に全開放の FOR ALL USING (true) が存在しない", () => {
    const sqlPath = path.resolve(
      process.cwd(),
      "supabase/migrations/20261120_enterprise_features.sql"
    );
    const sql = fs.readFileSync(sqlPath, "utf8");
    expect(sql).not.toMatch(/FOR\s+ALL\s+TO\s+authenticated\s+USING\s*\(\s*true\s*\)/i);
    expect(sql).toContain("Admin read audit_logs");
    expect(sql).toContain("Admin or company manage graduation_evaluations");
    expect(sql).toContain("User manage own announcement_reads");
  });

  // === ITA: 本番ハードニング検証（DEBT-001 / DEBT-002 対策） ===
  it("ITA-SEC-06: 本番環境でADMIN_GATE_KEY未設定時は既定フォールバックを許さず404でフェイルクローズする", async () => {
    const prevEnv = process.env.NODE_ENV;
    const prevKey = process.env.ADMIN_GATE_KEY;
    try {
      (process.env as Record<string, string | undefined>).NODE_ENV = "production";
      delete process.env.ADMIN_GATE_KEY;
      const res = await middleware(
        new NextRequest("http://localhost:3000/admin/login?gate=dss-admin-gate-2025")
      );
      expect(res.status).toBe(404);
    } finally {
      (process.env as Record<string, string | undefined>).NODE_ENV = prevEnv;
      if (prevKey !== undefined) process.env.ADMIN_GATE_KEY = prevKey;
    }
  });

  it("ITA-SEC-07: 本番環境でSupabase未設定時はデモ認証フォールバックを許さず503でフェイルクローズする", async () => {
    const prevEnv = process.env.NODE_ENV;
    const prevUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    try {
      (process.env as Record<string, string | undefined>).NODE_ENV = "production";
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      const auth = await requireApiAuth(["admin"]);
      expect(auth.ok).toBe(false);
      if (!auth.ok) {
        expect(auth.response.status).toBe(503);
      }
    } finally {
      (process.env as Record<string, string | undefined>).NODE_ENV = prevEnv;
      if (prevUrl !== undefined) process.env.NEXT_PUBLIC_SUPABASE_URL = prevUrl;
    }
  });
});
