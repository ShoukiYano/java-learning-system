/**
 * ファイル概要：
 * クライアントサイド（ブラウザ）用 Supabase クライアント生成
 *
 * 主な処理：
 * - Next.jsのClient Component（"use client"）内で利用するSupabaseブラウザクライアントの初期化
 * - ブラウザのCookieやlocalStorageと連動したセッション管理
 *
 * 注意事項：
 * - 公開用Anon Key（NEXT_PUBLIC_SUPABASE_ANON_KEY）のみを使用します。
 * - Service Role Keyなどの秘密情報をブラウザ側に露出させないでください。
 */

import { createBrowserClient } from "@supabase/ssr";

/**
 * 処理概要：
 * ブラウザ（Client Component）向けのSupabaseクライアントインスタンスを生成する
 *
 * @returns SupabaseClient ブラウザ用クライアントインスタンス
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
