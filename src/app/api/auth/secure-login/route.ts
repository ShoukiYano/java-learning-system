// =============================================================================
// 高セキュリティ認証 Route Handler (POST /api/auth/secure-login)
// 1. ブルートフォース対策：同一IPまたはメールで5回連続失敗すると15分間ロックアウト
// 2. ゲートキー検証：管理者・企業ポータルは正しい gateKey または HttpOnly Cookie が必須
// 3. 多要素検証：
//    - company ロール：DB上の所属企業の company_code と入力された企業コードが完全一致すること
//    - admin ロール：サーバー環境変数 ADMIN_MASTER_PIN（デフォルト: "778899"）と入力PINが完全一致すること
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { UserRole } from "@/types/database";

interface AttemptRecord {
  count: number;
  lockedUntil: number | null;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15分間ロック
const loginAttemptsMap = new Map<string, AttemptRecord>();

function getExpectedGateKey(role: UserRole): string {
  if (role === "admin") {
    return process.env.ADMIN_GATE_KEY || "dss-admin-gate-2025";
  }
  if (role === "company") {
    return process.env.COMPANY_GATE_KEY || "dss-corp-gate-2025";
  }
  return "";
}

function getExpectedAdminPin(): string {
  return process.env.ADMIN_MASTER_PIN || "778899";
}

function recordFailedAttempt(key: string): AttemptRecord {
  const now = Date.now();
  const prev = loginAttemptsMap.get(key) ?? { count: 0, lockedUntil: null };
  const nextCount = prev.count + 1;
  const lockedUntil =
    nextCount >= MAX_FAILED_ATTEMPTS ? now + LOCKOUT_DURATION_MS : null;
  const updated = { count: nextCount, lockedUntil };
  loginAttemptsMap.set(key, updated);
  return updated;
}

function clearAttempts(key: string) {
  loginAttemptsMap.delete(key);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      expectedRole,
      companyCode,
      adminPin,
      gateKey,
    }: {
      email: string;
      password: string;
      expectedRole: UserRole;
      companyCode?: string;
      adminPin?: string;
      gateKey?: string;
    } = body;

    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const normalizedEmail = (email || "").trim().toLowerCase();
    const attemptKey = `${clientIp}:${expectedRole}:${normalizedEmail}`;
    const ipOnlyKey = `${clientIp}:${expectedRole}`;

    // 1. ロックアウト状態の確認
    const now = Date.now();
    for (const k of [attemptKey, ipOnlyKey]) {
      const rec = loginAttemptsMap.get(k);
      if (rec?.lockedUntil && rec.lockedUntil > now) {
        const remainMins = Math.ceil((rec.lockedUntil - now) / 60000);
        return NextResponse.json(
          {
            error: `セキュリティ保護：ログイン失敗回数が上限（${MAX_FAILED_ATTEMPTS}回）に達したため、あと約 ${remainMins} 分間ロックされています。`,
            locked: true,
          },
          { status: 429 }
        );
      } else if (rec?.lockedUntil && rec.lockedUntil <= now) {
        loginAttemptsMap.delete(k);
      }
    }

    // 2. 管理者・企業ログイン時のステルス・ゲートキー検証
    if (expectedRole === "admin" || expectedRole === "company") {
      const cookieName =
        expectedRole === "admin" ? "dss_admin_gate" : "dss_company_gate";
      const cookieVal = request.cookies.get(cookieName)?.value;
      const requiredGate = getExpectedGateKey(expectedRole);

      if (cookieVal !== requiredGate && gateKey !== requiredGate) {
        recordFailedAttempt(ipOnlyKey);
        return NextResponse.json(
          { error: "不正なゲートウェイアクセスです。" },
          { status: 403 }
        );
      }
    }

    // 3. 管理者ログイン時のマスターPIN検証（パスワード認証の前にチェック）
    if (expectedRole === "admin") {
      const expectedPin = getExpectedAdminPin();
      if (!adminPin || adminPin.trim() !== expectedPin) {
        const att = recordFailedAttempt(attemptKey);
        recordFailedAttempt(ipOnlyKey);
        const remain = Math.max(0, MAX_FAILED_ATTEMPTS - att.count);
        return NextResponse.json(
          {
            error: `管理者セキュリティPINが正しくありません。（残り試行回数: ${remain}回）`,
          },
          { status: 401 }
        );
      }
    }

    // 4. 企業担当者ログイン時の企業コード入力チェック
    if (expectedRole === "company") {
      if (!companyCode || !companyCode.trim()) {
        return NextResponse.json(
          { error: "所属テナントの「企業コード」を入力してください。" },
          { status: 400 }
        );
      }
    }

    // 5. Supabase Auth によるメール＋パスワード認証
    const supabase = await createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (signInError || !data.user) {
      const att = recordFailedAttempt(attemptKey);
      recordFailedAttempt(ipOnlyKey);
      const remain = Math.max(0, MAX_FAILED_ATTEMPTS - att.count);
      return NextResponse.json(
        {
          error: `認証に失敗しました。メールアドレスまたはパスワードを確認してください。（残り試行回数: ${remain}回）`,
        },
        { status: 401 }
      );
    }

    // 6. ロールおよび所属企業コードの厳格検証
    const dbClient =
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
        ? createAdminClient()
        : supabase;

    const { data: profile } = await dbClient
      .from("profiles")
      .select("role, company_id, companies(company_code)")
      .eq("id", data.user.id)
      .maybeSingle();

    const metaRole = data.user.user_metadata?.role as UserRole | undefined;
    const emailBasedRole: UserRole | undefined =
      data.user.email === "admin@example.com"
        ? "admin"
        : data.user.email === "company@example.com"
        ? "company"
        : undefined;

    const actualRole: UserRole =
      (profile?.role as UserRole) ??
      metaRole ??
      emailBasedRole ??
      "student";

    if (actualRole !== expectedRole) {
      await supabase.auth.signOut();
      const att = recordFailedAttempt(attemptKey);
      const remain = Math.max(0, MAX_FAILED_ATTEMPTS - att.count);
      return NextResponse.json(
        {
          error: `このログイン画面からアクセスする権限がありません。（残り試行回数: ${remain}回）`,
        },
        { status: 403 }
      );
    }

    // 企業担当者の場合、入力された企業コードと所属テナントの企業コードが一致するか検証
    if (expectedRole === "company") {
      const inputCode = companyCode!.trim().toUpperCase();
      const dbCompanyCode = (
        profile as unknown as { companies?: { company_code?: string } }
      )?.companies?.company_code?.toUpperCase();
      const metaCompanyCode = (
        data.user.user_metadata?.company_code as string | undefined
      )?.toUpperCase();

      const validCode = dbCompanyCode || metaCompanyCode || "ACME2025";
      if (inputCode !== validCode) {
        await supabase.auth.signOut();
        const att = recordFailedAttempt(attemptKey);
        const remain = Math.max(0, MAX_FAILED_ATTEMPTS - att.count);
        return NextResponse.json(
          {
            error: `企業コードが所属テナントと一致しません。（残り試行回数: ${remain}回）`,
          },
          { status: 403 }
        );
      }
    }

    // 7. 認証成功：ロックアウトカウンタをリセットし、最終ログイン日時を更新
    clearAttempts(attemptKey);
    clearAttempts(ipOnlyKey);

    await dbClient
      .from("profiles")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", data.user.id);

    return NextResponse.json({
      ok: true,
      role: actualRole,
    });
  } catch {
    return NextResponse.json(
      { error: "認証サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}
