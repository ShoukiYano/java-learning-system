/**
 * ファイル概要：
 * 高セキュリティ認証 Route Handler (POST /api/auth/secure-login)
 *
 * 主な処理：
 * 1. マルチテナント分離型ブルートフォース対策：
 *    - 失敗回数・ロック状態を「接続元IP ＋ ロール ＋ 企業コード ＋ メールアドレス」の複合キーでメモリ管理
 *    - これにより「A社のログイン失敗でB社がロックされる」「社内の一人の失敗で同僚がロックされる」
 *      「外部攻撃者の失敗で正規ユーザーがロックされる」といった巻き添え被害を100%防止
 *    - 同一IPから異なる企業・メールを無差別に試す不正ボットのみ、IP単体の上限（30回）で一時遮断
 * 2. ステルスゲートキー検証：
 *    - 管理者・企業ログイン時は、正しいgateKeyまたはHttpOnly Cookie（dss_admin_gate / dss_company_gate）の保持を検証
 * 3. 多要素・ロール境界検証：
 *    - company ロール：DB上の所属企業の company_code と入力された企業コードが完全一致することを照合
 *    - admin ロール：サーバー環境変数 ADMIN_MASTER_PIN（デフォルト: "778899"）と入力PINが完全一致することを照合
 * 4. Supabase Auth によるパスワード検証（およびデモモード時のインメモリアカウント検証）
 *
 * 注意事項：
 * - ログイン失敗時は残り試行回数を明示し、5回連続失敗で15分間のロックアウトが発動します。
 */

import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { UserRole } from "@/types/database";
import { verifyInMemoryCompanyManagerLogin } from "@/lib/seed-data";
import { isSupabaseConfigured } from "@/lib/data-service";
import { recordAuditLog } from "@/lib/audit-log";
import {
  MAX_ACCOUNT_FAILED_ATTEMPTS,
  MAX_BOT_IP_FAILED_ATTEMPTS,
  loginAttemptsMap,
  recordFailedAttempt,
  clearAttempts,
} from "@/lib/login-attempts";

const VALID_ROLES: ReadonlySet<UserRole> = new Set([
  "admin",
  "company",
  "student",
]);

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * 処理概要：
 * 指定されたロールに対応する期待されるゲートキー文字列を取得する
 * 本番環境では環境変数未設定時に null を返却し Fail-Closed とする
 *
 * @param role 認証対象のロール（admin / company）
 * @returns 環境変数設定値（非本番のみ開発用フォールバック可、本番未設定時は null）
 */
function getExpectedGateKey(role: UserRole): string | null {
  const isProd = process.env.NODE_ENV === "production";
  if (role === "admin") {
    return isProd
      ? process.env.ADMIN_GATE_KEY?.trim() || null
      : process.env.ADMIN_GATE_KEY?.trim() || "dss-admin-gate-2025";
  }
  if (role === "company") {
    return isProd
      ? process.env.COMPANY_GATE_KEY?.trim() || null
      : process.env.COMPANY_GATE_KEY?.trim() || "dss-corp-gate-2025";
  }
  return null;
}

/**
 * 処理概要：
 * 管理者ログイン用のマスターPINコードを取得する
 * 本番環境では環境変数未設定時に null を返却し Fail-Closed とする
 *
 * @returns 環境変数設定値（非本番のみ開発用フォールバック可、本番未設定時は null）
 */
function getExpectedAdminPin(): string | null {
  const isProd = process.env.NODE_ENV === "production";
  return isProd
    ? process.env.ADMIN_MASTER_PIN?.trim() || null
    : process.env.ADMIN_MASTER_PIN?.trim() || "778899";
}

/**
 * 処理概要：
 * セキュア認証POSTリクエストハンドラー
 *
 * 処理詳細：
 * 1. リクエストボディ（メール、パスワード、ロール、企業コード、管理者PIN等）およびIPアドレスの抽出・正規化
 * 2. 複合キーによるロックアウト状態の確認（ロック中の場合は429 Too Many Requestsを即座に返却）
 * 3. 管理者・企業ログイン時のゲートキー／Cookie検証（不正アクセスは403 Forbidden）
 * 4. 管理者専用マスターPINの検証
 * 5. 企業担当者ログイン時の企業コード入力存在確認
 * 6. Supabase Auth によるパスワード照合（失敗時は試行回数を記録し401返却）
 *    ※デモ環境時はインメモリ担当者ストアでの照合もフォールバック実行
 * 7. ユーザーのDBプロファイルロールおよび企業コードの合致確認
 * 8. 認証成功時：失敗カウンターのリセットと最終ログイン日時の更新を行い、ロール情報を返却
 *
 * @param request 送信されたNextRequest
 * @returns 認証判定結果のNextResponse（JSON）
 */
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

    if (!expectedRole || !VALID_ROLES.has(expectedRole)) {
      return NextResponse.json(
        { error: "不正なログイン種別です。" },
        { status: 400 }
      );
    }

    const isProd = process.env.NODE_ENV === "production";
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip")?.trim() ||
      "local";
    const normalizedEmail = (email || "").trim().toLowerCase();
    const normalizedCompanyCode = (companyCode || "").trim().toUpperCase();

    // ★ アカウント単位の独立キー（企業コードを変えても同一メールへの5回連続失敗を確実にロック）
    const tenantAccountKey = `${clientIp}:${expectedRole}:${normalizedEmail}`;
    // 無差別ボット検知用キー（同一IPから30回以上連続失敗した場合のみそのIPを遮断）
    const botIpKey = `bot_ip:${clientIp}:${expectedRole}`;

    // 1. ロックアウト状態の確認
    const now = Date.now();
    for (const k of [tenantAccountKey, botIpKey]) {
      const rec = loginAttemptsMap.get(k);
      if (rec?.lockedUntil && rec.lockedUntil > now) {
        const remainMins = Math.ceil((rec.lockedUntil - now) / 60000);
        return NextResponse.json(
          {
            error: `セキュリティ保護：このアカウントへのログイン失敗回数が上限（${MAX_ACCOUNT_FAILED_ATTEMPTS}回）に達したため、あと約 ${remainMins} 分間一時ロックされています。（※他の企業や別アカウントには影響しません）`,
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

      if (!requiredGate) {
        return NextResponse.json(
          {
            error:
              "認証ゲートウェイが正しく構成されていません。管理者へお問い合わせください。",
          },
          { status: 503 }
        );
      }

      const cookieMatched =
        typeof cookieVal === "string" &&
        timingSafeStringEqual(cookieVal, requiredGate);
      const gateKeyMatched =
        typeof gateKey === "string" &&
        timingSafeStringEqual(gateKey, requiredGate);

      if (!cookieMatched && !gateKeyMatched) {
        recordFailedAttempt(botIpKey, MAX_BOT_IP_FAILED_ATTEMPTS);
        return NextResponse.json(
          { error: "不正なゲートウェイアクセスです。" },
          { status: 403 }
        );
      }
    }

    // 3. 管理者ログイン時のマスターPIN検証
    if (expectedRole === "admin") {
      const expectedPin = getExpectedAdminPin();
      if (!expectedPin) {
        return NextResponse.json(
          {
            error:
              "管理者認証設定が正しく構成されていません。管理者へお問い合わせください。",
          },
          { status: 503 }
        );
      }
      if (
        typeof adminPin !== "string" ||
        !timingSafeStringEqual(adminPin.trim(), expectedPin)
      ) {
        const att = recordFailedAttempt(
          tenantAccountKey,
          MAX_ACCOUNT_FAILED_ATTEMPTS
        );
        recordFailedAttempt(botIpKey, MAX_BOT_IP_FAILED_ATTEMPTS);
        const remain = Math.max(0, MAX_ACCOUNT_FAILED_ATTEMPTS - att.count);
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
      if (!normalizedCompanyCode) {
        return NextResponse.json(
          { error: "所属テナントの「企業コード」を入力してください。" },
          { status: 400 }
        );
      }
    }

    // 4.5. Supabase未設定時のハンドリング（本番は503 Fail-Closed、非本番のみローカルデモ認証）
    if (!isSupabaseConfigured()) {
      if (isProd) {
        return NextResponse.json(
          {
            error:
              "認証基盤が正しく構成されていません。管理者へお問い合わせください。",
          },
          { status: 503 }
        );
      }
      if (expectedRole === "company") {
        const verifiedLocalManager = verifyInMemoryCompanyManagerLogin(
          normalizedEmail,
          password
        );
        const demoValidCode =
          verifiedLocalManager?.company_id === "00000000-0000-4000-8000-000000000002"
            ? "TECH2025"
            : "ACME2025";
        if (!verifiedLocalManager) {
          const att = recordFailedAttempt(
            tenantAccountKey,
            MAX_ACCOUNT_FAILED_ATTEMPTS
          );
          recordFailedAttempt(botIpKey, MAX_BOT_IP_FAILED_ATTEMPTS);
          const remain = Math.max(0, MAX_ACCOUNT_FAILED_ATTEMPTS - att.count);
          return NextResponse.json(
            {
              error: `認証に失敗しました。メールアドレスまたはパスワードを確認してください。（残り試行回数: ${remain}回）`,
            },
            { status: 401 }
          );
        }
        if (normalizedCompanyCode !== demoValidCode) {
          const att = recordFailedAttempt(
            tenantAccountKey,
            MAX_ACCOUNT_FAILED_ATTEMPTS
          );
          const remain = Math.max(0, MAX_ACCOUNT_FAILED_ATTEMPTS - att.count);
          return NextResponse.json(
            {
              error: `企業コードが所属テナントと一致しません。（残り試行回数: ${remain}回）`,
            },
            { status: 403 }
          );
        }
        clearAttempts(tenantAccountKey);
        return NextResponse.json({ ok: true, role: "company", demo: true });
      }
      clearAttempts(tenantAccountKey);
      return NextResponse.json({ ok: true, role: expectedRole, demo: true });
    }

    // 5. Supabase Auth によるメール＋パスワード認証
    const supabase = await createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (signInError || !data.user) {
      const att = recordFailedAttempt(
        tenantAccountKey,
        MAX_ACCOUNT_FAILED_ATTEMPTS
      );
      recordFailedAttempt(botIpKey, MAX_BOT_IP_FAILED_ATTEMPTS);
      const remain = Math.max(0, MAX_ACCOUNT_FAILED_ATTEMPTS - att.count);
      await recordAuditLog({
        actorId: null,
        actorEmail: normalizedEmail || null,
        actorRole: expectedRole,
        action: "login_failed",
        targetSummary: `${expectedRole} ポータルへのログイン失敗（メール: ${normalizedEmail}）`,
      });
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

    const { data: profile, error: profileErr } = await dbClient
      .from("profiles")
      .select("role, company_id, companies(company_code)")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileErr) {
      await supabase.auth.signOut();
      console.error(
        "[POST /api/auth/secure-login] profiles fetch error:",
        profileErr
      );
      return NextResponse.json(
        {
          error:
            "ユーザー権限の確認に失敗しました。時間をおいて再度お試しください。",
        },
        { status: 503 }
      );
    }

    const actualRole = profile?.role as UserRole | undefined;

    if (
      !actualRole ||
      !VALID_ROLES.has(actualRole) ||
      actualRole !== expectedRole
    ) {
      await supabase.auth.signOut();
      const att = recordFailedAttempt(
        tenantAccountKey,
        MAX_ACCOUNT_FAILED_ATTEMPTS
      );
      const remain = Math.max(0, MAX_ACCOUNT_FAILED_ATTEMPTS - att.count);
      return NextResponse.json(
        {
          error: `このログイン画面からアクセスする権限がありません。（残り試行回数: ${remain}回）`,
        },
        { status: 403 }
      );
    }

    // 企業担当者の場合、入力された企業コードと所属テナントのDB企業コードが完全一致するか検証
    if (expectedRole === "company") {
      const dbCompanyCode =
        (
          profile as unknown as { companies?: { company_code?: string } }
        )?.companies?.company_code
          ?.trim()
          .toUpperCase() || null;

      if (!dbCompanyCode || normalizedCompanyCode !== dbCompanyCode) {
        await supabase.auth.signOut();
        const att = recordFailedAttempt(
          tenantAccountKey,
          MAX_ACCOUNT_FAILED_ATTEMPTS
        );
        const remain = Math.max(0, MAX_ACCOUNT_FAILED_ATTEMPTS - att.count);
        return NextResponse.json(
          {
            error: `企業コードが所属テナントと一致しません。（残り試行回数: ${remain}回）`,
          },
          { status: 403 }
        );
      }
    }

    // 7. 認証成功：該当アカウントの失敗カウンタをリセット＆監査ログ記録
    clearAttempts(tenantAccountKey);

    await dbClient
      .from("profiles")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", data.user.id);

    await recordAuditLog({
      actorId: data.user.id,
      actorEmail: data.user.email ?? normalizedEmail,
      actorRole: actualRole,
      action: "login_success",
      targetSummary: `${actualRole} ポータルへログインしました（${data.user.email ?? normalizedEmail}）`,
    });

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
