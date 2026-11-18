/**
 * ファイル概要：
 * アプリケーション共通ルートレイアウト（RootLayout）
 *
 * 主な処理：
 * - HTML基本構造（lang="ja"）およびグローバルスタイル（globals.css）の適用
 * - ページ遷移時のトッププログレスバー（NavigationProgress）の配置（Suspenseでラップ）
 * - SEOメタデータ（title, description）の設定
 */

import React, { Suspense } from "react";
import type { Metadata } from "next";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "DevSkillStudio | Java・SQLカリキュラム管理・マルチテナントエンジニア育成基盤",
  description:
    "受講生も企業担当者も管理者も、Java・SQLの学習進捗とスキル習得状況が一目で分かるマルチテナント対応学習プラットフォーム",
};

/**
 * 処理概要：
 * アプリケーション全体のルートレイアウトコンポーネント
 *
 * @param children ページコンポーネント
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
