/**
 * ファイル概要：
 * サーバーサイド用 Supabase クライアント生成（Next.js 15 App Router対応）
 *
 * 主な処理：
 * - Server Components / Server Actions / Route Handlers から安全にDB操作・セッション参照を行うためのクライアント初期化
 * - Next.js 15 の非同期 `cookies()` APIに対応したCookieハンドラーの設定
 *
 * 注意事項：
 * - Server Component内で `setAll` が呼ばれた場合はCookieの書き込みが無視されるため（Next.jsの仕様）、セッション更新処理はMiddleware側で実行されます。
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * 処理概要：
 * Next.jsのServer Components、Server Actions、またはRoute Handlers用のSupabaseクライアントを生成する
 *
 * 処理詳細：
 * 1. `await cookies()` によりNext.js 15の非同期クッキーストアを取得
 * 2. クッキーストアと連携するCookieアダプター（getAll, setAll）を構成
 * 3. ログイン中ユーザーのRLS（Row Level Security）ポリシーが適用されるクライアントを返却
 *
 * @returns Promise<SupabaseClient> サーバーサイド用クライアントインスタンス
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component から呼ばれた場合は Cookie 書き込みがスキップされる（Middleware で更新済み）
          }
        },
      },
    }
  );
}
