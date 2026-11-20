/**
 * ファイル概要：
 * 受講生専用ポータル共通レイアウト（Server Component）
 *
 * 主な処理：
 * - 受講生ナビゲーションヘッダー（マイダッシュボード、カリキュラム受講、提出履歴、プロフィール）
 * - ログイン中の受講生名、所属企業名、連続学習ストリークバッジの表示
 * - ログアウトボタン（SignOutButton）の配置
 */

import React from "react";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/data-service";
import {
  Code2,
  LayoutDashboard,
  BookOpen,
  History,
  UserCircle,
  Flame,
  Building2,
} from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function StudentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-30 h-14 border-b bg-white/95 backdrop-blur px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/student"
            className="flex items-center gap-2 font-bold text-slate-900"
          >
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Code2 className="h-4 w-4" />
            </div>
            <span>
              DevSkill<span className="text-blue-600">Studio</span>
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              受講生ポータル
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <Link
              href="/student"
              className="px-3 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 flex items-center gap-1.5 transition"
            >
              <LayoutDashboard className="h-4 w-4 text-blue-600" />
              マイダッシュボード
            </Link>
            <Link
              href="/student/courses"
              className="px-3 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 flex items-center gap-1.5 transition"
            >
              <BookOpen className="h-4 w-4 text-emerald-600" />
              カリキュラム受講
            </Link>
            <Link
              href="/student/submissions"
              className="px-3 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 flex items-center gap-1.5 transition"
            >
              <History className="h-4 w-4 text-amber-600" />
              提出履歴
            </Link>
            <Link
              href="/student/profile"
              className="px-3 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 flex items-center gap-1.5 transition"
            >
              <UserCircle className="h-4 w-4 text-purple-600" />
              プロフィール
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {profile.companies && (
            <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border">
              <Building2 className="h-3.5 w-3.5 text-slate-500" />
              {profile.companies.name}
            </span>
          )}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 text-xs font-semibold">
            <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
            <span>{profile.streak_days}日連続</span>
          </div>
          <span className="text-xs font-medium text-slate-700 hidden sm:inline">
            {profile.full_name}
          </span>
          <SignOutButton redirectPath="/student/login" />
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
