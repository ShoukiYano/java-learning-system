import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";
import { POST as secureLoginPost } from "@/app/api/auth/secure-login/route";
import { POST as logoutPost } from "@/app/api/auth/logout/route";

describe("認証・ログイン・ログアウト結合テスト（ITA：受講生・企業・管理者）", () => {
  it("ITA-01: 旧URL /login, /signup, /app が正規受講生URLへリダイレクトされる", async () => {
    const r1 = await middleware(new NextRequest("http://localhost:3000/login"));
    expect(r1.status).toBe(307);
    expect(r1.headers.get("location")).toContain("/student/login");

    const r2 = await middleware(new NextRequest("http://localhost:3000/signup"));
    expect(r2.status).toBe(307);
    expect(r2.headers.get("location")).toContain("/student/signup");

    const r3 = await middleware(new NextRequest("http://localhost:3000/app"));
    expect(r3.status).toBe(307);
    expect(r3.headers.get("location")).toContain("/student");
  });

  it("ITA-02: ゲートキー無しの /company/login・/admin/login はステルス404＆セキュリティヘッダーを返す", async () => {
    const rCompany = await middleware(
      new NextRequest("http://localhost:3000/company/login")
    );
    expect(rCompany.status).toBe(404);
    expect(rCompany.headers.get("x-frame-options")).toBe("DENY");
    expect(rCompany.headers.get("x-robots-tag")).toContain("noindex");
    expect(rCompany.headers.get("cache-control")).toContain("no-store");

    const rAdmin = await middleware(
      new NextRequest("http://localhost:3000/admin/login")
    );
    expect(rAdmin.status).toBe(404);
    expect(rAdmin.headers.get("x-robots-tag")).toContain("noindex");
  });

  it("ITA-03: 正しいゲートキー付きアクセスでHttpOnlyゲートCookieが発行されクエリ無しURLへ遷移する", async () => {
    const rAdmin = await middleware(
      new NextRequest(
        "http://localhost:3000/admin/login?gate=dss-admin-gate-2025"
      )
    );
    expect(rAdmin.status).toBe(307);
    expect(rAdmin.headers.get("location")).toBe(
      "http://localhost:3000/admin/login"
    );
    const adminCookie = rAdmin.headers.get("set-cookie") || "";
    expect(adminCookie).toContain("dss_admin_gate=dss-admin-gate-2025");
    expect(adminCookie.toLowerCase()).toContain("httponly");

    const rCompany = await middleware(
      new NextRequest(
        "http://localhost:3000/company/login?gate=dss-corp-gate-2025"
      )
    );
    expect(rCompany.status).toBe(307);
    expect(rCompany.headers.get("location")).toBe(
      "http://localhost:3000/company/login"
    );
    const corpCookie = rCompany.headers.get("set-cookie") || "";
    expect(corpCookie).toContain("dss_company_gate=dss-corp-gate-2025");
    expect(corpCookie.toLowerCase()).toContain("httponly");
  });

  it("ITA-04: ゲート無しで管理者・企業ログインAPIへ直接POSTすると403で遮断される", async () => {
    const rAdmin = await secureLoginPost(
      new NextRequest("http://localhost:3000/api/auth/secure-login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "admin@example.com",
          password: "Password123!",
          expectedRole: "admin",
          adminPin: "778899",
        }),
      })
    );
    expect(rAdmin.status).toBe(403);

    const rCompany = await secureLoginPost(
      new NextRequest("http://localhost:3000/api/auth/secure-login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "company@example.com",
          password: "Password123!",
          expectedRole: "company",
          companyCode: "ACME2025",
        }),
      })
    );
    expect(rCompany.status).toBe(403);
  });

  it("ITA-05: 管理者誤PINは401、5回連続失敗で429ロックアウトが発動する", async () => {
    for (let i = 0; i < 5; i++) {
      const res = await secureLoginPost(
        new NextRequest("http://localhost:3000/api/auth/secure-login", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            cookie: "dss_admin_gate=dss-admin-gate-2025",
          },
          body: JSON.stringify({
            email: "ita-admin-lock@example.com",
            password: "Password123!",
            expectedRole: "admin",
            adminPin: "000000",
          }),
        })
      );
      expect(res.status).toBe(401);
    }

    const locked = await secureLoginPost(
      new NextRequest("http://localhost:3000/api/auth/secure-login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          cookie: "dss_admin_gate=dss-admin-gate-2025",
        },
        body: JSON.stringify({
          email: "ita-admin-lock@example.com",
          password: "Password123!",
          expectedRole: "admin",
          adminPin: "778899",
        }),
      })
    );
    expect(locked.status).toBe(429);
  });

  it("ITA-06: 企業ログインで誤った企業コードは403で拒否され、企業コードを変えても5回でロックされる", async () => {
    for (let i = 0; i < 5; i++) {
      const res = await secureLoginPost(
        new NextRequest("http://localhost:3000/api/auth/secure-login", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            cookie: "dss_company_gate=dss-corp-gate-2025",
          },
          body: JSON.stringify({
            email: "company@example.com",
            password: "Password123!",
            expectedRole: "company",
            companyCode: `WRONG_CODE_${i}`,
          }),
        })
      );
      expect(res.status).toBe(403);
    }

    // 6回目は正しいコードでもロックアウト(429)されること
    const locked = await secureLoginPost(
      new NextRequest("http://localhost:3000/api/auth/secure-login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          cookie: "dss_company_gate=dss-corp-gate-2025",
        },
        body: JSON.stringify({
          email: "company@example.com",
          password: "Password123!",
          expectedRole: "company",
          companyCode: "ACME2025",
        }),
      })
    );
    expect(locked.status).toBe(429);
  });

  it("ITA-07: 受講生ログインAPIが500エラーにならず正常応答し、ログアウトAPIが200(no-store)を返す", async () => {
    const loginRes = await secureLoginPost(
      new NextRequest("http://localhost:3000/api/auth/secure-login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "student@acme-tech.example.com",
          password: "Password123!",
          expectedRole: "student",
        }),
      })
    );
    expect(loginRes.status).toBe(200);

    const logoutRes = await logoutPost();
    expect(logoutRes.status).toBe(200);
    expect(logoutRes.headers.get("cache-control")).toBe("no-store");
  });
});
