/**
 * ファイル概要：
 * サーバー側特権（管理者・サービスロール）Supabase クライアント生成
 *
 * 主な処理：
 * - SUPABASE_SERVICE_ROLE_KEY を用いた特権クライアントの生成
 * - RLS（Row Level Security）をバイパスした非公開テストケースの取得、auth.admin API（ユーザー作成・パスワード更新・削除）の実行
 *
 * 注意事項：
 * - このクライアントは全権限を持つため、クライアントコンポーネント（"use client"）や外部公開APIから直接触れられないサーバー内部でのみ使用してください。
 */

import { createClient } from "@supabase/supabase-js";

/**
 * 処理概要：
 * サービスロールキー（特権キー）を用いたSupabase Adminクライアントを生成する
 *
 * 処理詳細：
 * 1. 環境変数 SUPABASE_SERVICE_ROLE_KEY および NEXT_PUBLIC_SUPABASE_URL の存在を検証
 * 2. autoRefreshToken / persistSession を無効化したステートレスな管理者クライアントを生成
 *
 * @returns SupabaseClient 特権クライアントインスタンス
 * @throws Error 環境変数が未設定の場合に例外を送出
 */
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
