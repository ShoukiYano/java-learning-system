import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@/types/database";

// =============================================================================
// ロールベース画面アクセス制御（Middleware）
// 仕様：
// - admin（管理者）：すべてを管理（/admin/..., /app/..., /company/... 閲覧可）
// - student（受講生）：/app/... のみアクセス可（/admin, /company はリダイレクト）
// - company（企業担当者）：/company/... のみアクセス可（/admin, /app はリダイレクト）
// =============================================================================

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 環境変数が未設定またはプレースホルダーの場合はスキップ（ローカルデモ動作確認を妨げない）
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

  const pathname = request.nextUrl.pathname;
  const isProtectedPath =
    pathname.startsWith("/app") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/company");

  // 未ログインで保護ルートへアクセスした場合は /login へリダイレクト
  if (!user && isProtectedPath) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ログイン済みの場合、profiles.role を取得してロール別アクセス制御を行う
  if (user && (isProtectedPath || pathname === "/login" || pathname === "/signup")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role: UserRole = (profile?.role as UserRole) ?? "student";

    const roleHome =
      role === "admin"
        ? "/admin"
        : role === "company"
        ? "/company"
        : "/app";

    // ログイン済みで /login または /signup に来た場合は各ロールのホームへリダイレクト
    if (pathname === "/login" || pathname === "/signup") {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = roleHome;
      return NextResponse.redirect(homeUrl);
    }

    // /admin/... は admin ロールのみ許可
    if (pathname.startsWith("/admin") && role !== "admin") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = roleHome;
      return NextResponse.redirect(redirectUrl);
    }

    // /company/... は company または admin ロールのみ許可
    if (pathname.startsWith("/company") && role !== "company" && role !== "admin") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = roleHome;
      return NextResponse.redirect(redirectUrl);
    }

    // /app/... は student または admin ロールのみ許可
    if (pathname.startsWith("/app") && role === "company") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/company";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
