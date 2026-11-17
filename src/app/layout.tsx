import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Javaラーニングシステム | 実践型カリキュラム・スキル可視化プラットフォーム",
  description:
    "受講生も企業担当者も、Javaの学習進捗とスキル習得状況が一目で分かるカリキュラム管理・学習Webアプリ",
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
