import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@/types/database";

// =============================================================================
// ロールベース画面・パス分離 ＋ ステルス404保護（Middleware）
// 1. /admin/login および /company/login は、正しいゲートキー (?gate=...) または
//    承認済み HttpOnly Cookie がない限り /not-found へ Rewrite（404偽装）する
// 2. /admin/... と /company/... には X-Robots-Tag: noindex, nofollow, noarchive を強制付与
// 3. ロール境界の厳格チェック
// =============================================================================

function applySecurityHeaders(
  res: NextResponse,
  isSensitivePortal: boolean
): NextResponse {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "same-origin");
  if (isSensitivePortal) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
    res.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
  }
  return res;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 旧パス互換リダイレクト
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

  // ★ ステルス・ゲートキー検証（/admin/login と /company/login）
  const expectedAdminGate =
    process.env.ADMIN_GATE_KEY || "dss-admin-gate-2025";
  const expectedCompanyGate =
    process.env.COMPANY_GATE_KEY || "dss-corp-gate-2025";

  if (pathname === "/admin/login") {
    const queryGate = request.nextUrl.searchParams.get("gate");
    const cookieGate = request.cookies.get("dss_admin_gate")?.value;

    if (queryGate === expectedAdminGate) {
      // クエリパラメータに正しいキーがある場合は HttpOnly Cookie に保存してクエリ無しの綺麗で安全なURLへ遷移
      const cleanUrl = request.nextUrl.clone();
      cleanUrl.searchParams.delete("gate");
      const redirectRes = NextResponse.redirect(cleanUrl);
      redirectRes.cookies.set("dss_admin_gate", expectedAdminGate, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30日間有効
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

    if (queryGate === expectedCompanyGate) {
      const cleanUrl = request.nextUrl.clone();
      cleanUrl.searchParams.delete("gate");
      const redirectRes = NextResponse.redirect(cleanUrl);
      redirectRes.cookies.set("dss_company_gate", expectedCompanyGate, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
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

  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl.includes("your-project-id")
  ) {
    return applySecurityHeaders(supabaseResponse, isSensitivePortal);
  }

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

  // 未ログイン時の保護
  if (!user) {
    if (isStudentPortal) {
      const url = request.nextUrl.clone();
      url.pathname = "/student/login";
      return applySecurityHeaders(NextResponse.redirect(url), false);
    }
    if (isCompanyPortal) {
      const cookieGate = request.cookies.get("dss_company_gate")?.value;
      if (cookieGate === expectedCompanyGate) {
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
      if (cookieGate === expectedAdminGate) {
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

  // ログイン済みの場合、profiles.role（または user_metadata.role）を取得してロール境界を厳格に強制
  if (isAuthPage || isStudentPortal || isCompanyPortal || isAdminPortal) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const metaRole = user.user_metadata?.role as UserRole | undefined;
    const emailBasedRole: UserRole | undefined =
      user.email === "admin@example.com"
        ? "admin"
        : user.email === "company@example.com"
        ? "company"
        : undefined;

    const role: UserRole =
      (profile?.role as UserRole) ??
      metaRole ??
      emailBasedRole ??
      "student";

    const roleHome =
      role === "admin"
        ? "/admin"
        : role === "company"
        ? "/company"
        : "/student";

    if (isAuthPage) {
      const url = request.nextUrl.clone();
      url.pathname = roleHome;
      return applySecurityHeaders(
        NextResponse.redirect(url),
        isSensitivePortal
      );
    }

    if (isAdminPortal && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = roleHome;
      return applySecurityHeaders(NextResponse.redirect(url), true);
    }

    if (isCompanyPortal && role !== "company" && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = roleHome;
      return applySecurityHeaders(NextResponse.redirect(url), true);
    }

    if (isStudentPortal && role !== "student" && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = roleHome;
      return applySecurityHeaders(NextResponse.redirect(url), false);
    }
  }

  return applySecurityHeaders(supabaseResponse, isSensitivePortal);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
