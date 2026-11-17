import { createClient } from "@supabase/supabase-js";

// サーバー側専用（Route Handler / Server Action）の特権クライアント
// 用途：提出時の非公開テストケース（is_hidden = true）の取得および採点結果の確実な記録
// 注意：クライアントコンポーネントからは絶対にインポートしないこと
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY または NEXT_PUBLIC_SUPABASE_URL が設定されていません。"
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
