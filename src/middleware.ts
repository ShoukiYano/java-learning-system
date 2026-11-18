import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@/types/database";

// =============================================================================
// ロールベース画面・パス分離アクセス制御（Middleware）
// 仕様：
// - 受講生（student）：/student/login, /student/signup, /student/...
// - 企業担当者（company）：/company/login, /company/...
// - 管理者（admin）：/admin/login, /admin/...
// - 旧パス（/app, /login, /signup）は /student 側の対応パスへ安全にリダイレクト
// =============================================================================

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
    return supabaseResponse;
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

  // 未ログイン時は該当ロール専用のログインURLへリダイレクト
  if (!user) {
    if (isStudentPortal) {
      const url = request.nextUrl.clone();
      url.pathname = "/student/login";
      return NextResponse.redirect(url);
    }
    if (isCompanyPortal) {
      const url = request.nextUrl.clone();
      url.pathname = "/company/login";
      return NextResponse.redirect(url);
    }
    if (isAdminPortal) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
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
      return NextResponse.redirect(url);
    }

    // 管理者ポータルは admin のみ
    if (isAdminPortal && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = roleHome;
      return NextResponse.redirect(url);
    }

    // 企業ポータルは company（または確認用のadmin）のみ
    if (isCompanyPortal && role !== "company" && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = roleHome;
      return NextResponse.redirect(url);
    }

    // 受講生ポータルは student（またはプレビュー用のadmin）のみ
    if (isStudentPortal && role !== "student" && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = roleHome;
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
