import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "DevSkillStudio | Java・SQLカリキュラム管理・マルチテナントエンジニア育成基盤",
  description:
    "受講生も企業担当者も管理者も、Java・SQLの学習進捗とスキル習得状況が一目で分かるマルチテナント対応学習プラットフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
