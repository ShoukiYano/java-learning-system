/**
 * ファイル概要：
 * Next.js Edge Middleware（ロールベース画面・パス分離 ＋ ステルス404保護）
 *
 * 主な処理：
 * 1. レガシーURL互換リダイレクト（/login -> /student/login, /signup -> /student/signup, /app -> /student）
 * 2. 管理者・企業ログイン画面のステルス404偽装保護（正しいゲートキーまたはCookieがないアクセスを/_not-foundへRewrite）
 * 3. セキュリティヘッダー（X-Frame-Options, X-Content-Type-Options, Referrer-Policy, X-Robots-Tag, Cache-Control）の強制付与
 * 4. Supabase Authセッションの検証・Cookie同期
 * 5. 未ログイン時の保護（各ロールの正規ログイン画面へのリダイレクト、または404偽装）
 * 6. ロール境界の厳格チェック（受講生が/adminや/companyにアクセスした際に自ロールのホームへ追い出す等）
 *
 * 注意事項：
 * - Edgeランタイムで動作するため、Node.js専用APIは使用できません。
 * - ゲートキーの検証に失敗したリクエストはステータス404でRewriteし、ポータルの存在自体を外部ボットや不正アクセス者から隠蔽します。
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@/types/database";

/**
 * 処理概要：
 * レスポンスオブジェクトに対してセキュリティヘッダーを付与する
 *
 * 処理詳細：
 * 1. クリックジャッキング防止用（X-Frame-Options: DENY）
 * 2. MIMEタイプスニッフィング防止用（X-Content-Type-Options: nosniff）
 * 3. リファラー情報保護用（Referrer-Policy: same-origin）
 * 4. 管理者・企業ポータルの場合、検索エンジンのインデックスやキャッシュを完全に遮断
 *    （X-Robots-Tag: noindex, nofollow, noarchive / Cache-Control: no-store）
 *
 * @param res 適用対象のNextResponse
 * @param isSensitivePortal 管理者または企業向けの高機密ポータルであるかどうかのフラグ
 * @returns ヘッダー付与後のNextResponse
 */
function applySecurityHeaders(
  res: NextResponse,
  isSensitivePortal: boolean
): NextResponse {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "same-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  res.headers.set(
    "Content-Security-Policy",
    "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'"
  );
  if (process.env.NODE_ENV === "production") {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }
  if (isSensitivePortal) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
    res.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
  }
  return res;
}

/**
 * 処理概要：
 * 全HTTPリクエストに対する認証・認可・ステルスURL保護・ロールルーティング制御
 *
 * 処理詳細：
 * 1. 旧URL（/login, /signup, /app）からの後方互換リダイレクト
 * 2. ステルスゲートキーのチェック（/admin/login, /company/login に対する404偽装または認証Cookie発行）
 * 3. Supabase Authクライアントの初期化およびCookieの読み書き
 * 4. 未認証ユーザーのポータルアクセス遮断（受講生は/student/loginへ、企業・管理者はゲート認証有無により分岐）
 * 5. 認証済みユーザーのロール確認（profiles.role, user_metadata.role）
 * 6. ロール不一致アクセスの検知と正規ポータルへの強制リダイレクト（権限昇格攻撃の防止）
 *
 * @param request 受信したNextRequest
 * @returns 判定結果に応じたNextResponse（リダイレクト、リライト、または次のミドルウェアへの通過）
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. 旧パス互換リダイレクト
  if (pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/student/login";
    return NextResponse.redirect(url);
  }
  if (pathname === "/signup") {
    const url = request.nextUrl.clone();
    url.pathname = "/student/signup";
    return NextResponse.redirect(url);
  }
  if (pathname === "/app" || pathname.startsWith("/app/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/app/, "/student");
    return NextResponse.redirect(url);
  }

  const isAdminPath = pathname.startsWith("/admin");
  const isCompanyPath = pathname.startsWith("/company");
  const isSensitivePortal = isAdminPath || isCompanyPath;

  // 2. ステルス・ゲートキー検証（/admin/login と /company/login）
  // 本番環境（NODE_ENV=production）では既定フォールバックを一切使用せず、環境変数未設定時はフェイルクローズ（404）とする（DEBT-001対策）
  const isProd = process.env.NODE_ENV === "production";
  const expectedAdminGate = isProd
    ? process.env.ADMIN_GATE_KEY?.trim() || null
    : process.env.ADMIN_GATE_KEY?.trim() || "dss-admin-gate-2025";
  const expectedCompanyGate = isProd
    ? process.env.COMPANY_GATE_KEY?.trim() || null
    : process.env.COMPANY_GATE_KEY?.trim() || "dss-corp-gate-2025";

  if (pathname === "/admin/login") {
    const queryGate = request.nextUrl.searchParams.get("gate");
    const cookieGate = request.cookies.get("dss_admin_gate")?.value;

    if (!expectedAdminGate) {
      const notFoundUrl = request.nextUrl.clone();
      notFoundUrl.pathname = "/_not-found";
      return applySecurityHeaders(
        NextResponse.rewrite(notFoundUrl, { status: 404 }),
        true
      );
    }

    if (queryGate === expectedAdminGate) {
      // クエリパラメータに正しいキーがある場合は HttpOnly Cookie に保存してクエリ無しの綺麗で安全なURLへ遷移
      const cleanUrl = request.nextUrl.clone();
      cleanUrl.searchParams.delete("gate");
      const redirectRes = NextResponse.redirect(cleanUrl);
      redirectRes.cookies.set("dss_admin_gate", expectedAdminGate, {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        path: "/admin",
        maxAge: 60 * 10, // 10分間のみ有効（ログイン完了後は不要・共有PCリスク低減）
      });
      return applySecurityHeaders(redirectRes, true);
    }

    if (cookieGate !== expectedAdminGate) {
      // ゲートキーがない直接アクセスは 404 Not Found として偽装（管理画面の存在を隠蔽）
      const notFoundUrl = request.nextUrl.clone();
      notFoundUrl.pathname = "/_not-found";
      return applySecurityHeaders(
        NextResponse.rewrite(notFoundUrl, { status: 404 }),
        true
      );
    }
  }

  if (pathname === "/company/login") {
    const queryGate = request.nextUrl.searchParams.get("gate");
    const cookieGate = request.cookies.get("dss_company_gate")?.value;

    if (!expectedCompanyGate) {
      const notFoundUrl = request.nextUrl.clone();
      notFoundUrl.pathname = "/_not-found";
      return applySecurityHeaders(
        NextResponse.rewrite(notFoundUrl, { status: 404 }),
        true
      );
    }

    if (queryGate === expectedCompanyGate) {
      const cleanUrl = request.nextUrl.clone();
      cleanUrl.searchParams.delete("gate");
      const redirectRes = NextResponse.redirect(cleanUrl);
      redirectRes.cookies.set("dss_company_gate", expectedCompanyGate, {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        path: "/company",
        maxAge: 60 * 10, // 10分間のみ有効
      });
      return applySecurityHeaders(redirectRes, true);
    }

    if (cookieGate !== expectedCompanyGate) {
      const notFoundUrl = request.nextUrl.clone();
      notFoundUrl.pathname = "/_not-found";
      return applySecurityHeaders(
        NextResponse.rewrite(notFoundUrl, { status: 404 }),
        true
      );
    }
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Supabase未設定または初期値の場合
  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl.includes("your-project-id")
  ) {
    const isProtectedPortalPath =
      pathname.startsWith("/student") ||
      pathname.startsWith("/company") ||
      pathname.startsWith("/admin");
    if (isProd && isProtectedPortalPath) {
      return applySecurityHeaders(
        NextResponse.json(
          {
            error:
              "認証基盤が正しく構成されていません。管理者へお問い合わせください。",
          },
          { status: 503 }
        ),
        isSensitivePortal
      );
    }
    return applySecurityHeaders(supabaseResponse, isSensitivePortal);
  }

  // 3. Supabase Authクライアントの初期化（Next.js SSR用Cookieアダプタ）
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options?: Record<string, unknown>;
        }[]
      ) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // セッションユーザー情報の取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage =
    pathname === "/student/login" ||
    pathname === "/student/signup" ||
    pathname === "/company/login" ||
    pathname === "/admin/login";

  const isStudentPortal = pathname.startsWith("/student") && !isAuthPage;
  const isCompanyPortal = pathname.startsWith("/company") && !isAuthPage;
  const isAdminPortal = pathname.startsWith("/admin") && !isAuthPage;

  // 4. 未ログイン時の保護
  if (!user) {
    if (isStudentPortal) {
      const url = request.nextUrl.clone();
      url.pathname = "/student/login";
      return applySecurityHeaders(NextResponse.redirect(url), false);
    }
    if (isCompanyPortal) {
      const cookieGate = request.cookies.get("dss_company_gate")?.value;
      if (expectedCompanyGate && cookieGate === expectedCompanyGate) {
        const url = request.nextUrl.clone();
        url.pathname = "/company/login";
        return applySecurityHeaders(NextResponse.redirect(url), true);
      }
      // ゲートCookieもない状態で /company にアクセスされた場合は 404 Not Found に偽装
      const notFoundUrl = request.nextUrl.clone();
      notFoundUrl.pathname = "/_not-found";
      return applySecurityHeaders(
        NextResponse.rewrite(notFoundUrl, { status: 404 }),
        true
      );
    }
    if (isAdminPortal) {
      const cookieGate = request.cookies.get("dss_admin_gate")?.value;
      if (expectedAdminGate && cookieGate === expectedAdminGate) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        return applySecurityHeaders(NextResponse.redirect(url), true);
      }
      // ゲートCookieもない状態で /admin にアクセスされた場合は 404 Not Found に偽装
      const notFoundUrl = request.nextUrl.clone();
      notFoundUrl.pathname = "/_not-found";
      return applySecurityHeaders(
        NextResponse.rewrite(notFoundUrl, { status: 404 }),
        true
      );
    }
    return applySecurityHeaders(supabaseResponse, isSensitivePortal);
  }

  // 5. ログイン済みの場合、DB正本 profiles.role のみを参照してロール境界を厳格に強制
  if (isAuthPage || isStudentPortal || isCompanyPortal || isAdminPortal) {
    const validRoles: ReadonlySet<UserRole> = new Set([
      "admin",
      "company",
      "student",
    ]);
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (
      profileErr ||
      !profile?.role ||
      !validRoles.has(profile.role as UserRole)
    ) {
      if (isAuthPage) {
        return applySecurityHeaders(supabaseResponse, isSensitivePortal);
      }
      // プロファイル欠落・DBエラー時は高権限ポータルから確実に遮断し再認証へ誘導
      const url = request.nextUrl.clone();
      url.pathname = "/student/login";
      return applySecurityHeaders(NextResponse.redirect(url), isSensitivePortal);
    }

    const role = profile.role as UserRole;

    const roleHome =
      role === "admin"
        ? "/admin"
        : role === "company"
        ? "/company"
        : "/student";

    // 既にログイン済みで「自ロールと同じ」ログイン/サインアップ画面に訪れた場合のみホームへ誘導。
    // 別ロールのログイン画面（例: 企業ログイン中に /admin/login?gate=...）へ来た場合は
    // ログイン画面を表示し、画面上の「別ロールログイン中」バナーから安全に切り替えられるようにする。
    if (isAuthPage) {
      const isOwnAuthPage =
        (role === "admin" && pathname === "/admin/login") ||
        (role === "company" && pathname === "/company/login") ||
        (role === "student" &&
          (pathname === "/student/login" || pathname === "/student/signup"));
      if (isOwnAuthPage) {
        const url = request.nextUrl.clone();
        url.pathname = roleHome;
        return applySecurityHeaders(
          NextResponse.redirect(url),
          isSensitivePortal
        );
      }
      return applySecurityHeaders(supabaseResponse, isSensitivePortal);
    }

    // 他ロールポータルへの不正アクセス時の強制リダイレクト（権限外ポータルからの追い出し）
    // ※管理者も含め、各ロールは厳格に自ロールポータルのみへ分離（管理者が /company に入ってACME社フォールバックを踏む事故を防止）
    if (isAdminPortal && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = roleHome;
      return applySecurityHeaders(NextResponse.redirect(url), true);
    }

    if (isCompanyPortal && role !== "company") {
      const url = request.nextUrl.clone();
      url.pathname = roleHome;
      return applySecurityHeaders(NextResponse.redirect(url), true);
    }

    if (isStudentPortal && role !== "student") {
      const url = request.nextUrl.clone();
      url.pathname = roleHome;
      return applySecurityHeaders(NextResponse.redirect(url), false);
    }
  }

  return applySecurityHeaders(supabaseResponse, isSensitivePortal);
}

/**
 * Middlewareの適用対象パス（静的アセットや画像等を除外）
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
