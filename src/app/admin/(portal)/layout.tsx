import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  LayoutDashboard,
  Building2,
  BookOpen,
  FilePlus2,
  Users,
  Megaphone,
  ExternalLink,
} from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <header className="sticky top-0 z-30 h-14 bg-slate-900 text-white px-6 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2 font-bold">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <ShieldAlert className="h-4 w-4 text-white" />
            </div>
            <span>
              DevSkill<span className="text-indigo-400">Studio</span>
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700">
              システム管理者コンソール
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-300">
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-md hover:bg-slate-800 hover:text-white flex items-center gap-1.5 transition"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-indigo-400" />
              全体統括ダッシュボード
            </Link>
            <Link
              href="/admin/companies"
              className="px-3 py-1.5 rounded-md hover:bg-slate-800 hover:text-white flex items-center gap-1.5 transition"
            >
              <Building2 className="h-3.5 w-3.5 text-purple-400" />
              テナント（企業）管理
            </Link>
            <Link
              href="/admin/courses"
              className="px-3 py-1.5 rounded-md hover:bg-slate-800 hover:text-white flex items-center gap-1.5 transition"
            >
              <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
              カリキュラム全体管理（Java / SQL）
            </Link>
            <Link
              href="/admin/problems/new"
              className="px-3 py-1.5 rounded-md hover:bg-slate-800 hover:text-white flex items-center gap-1.5 transition"
            >
              <FilePlus2 className="h-3.5 w-3.5 text-amber-400" />
              問題作成（Java / SQL）
            </Link>
            <Link
              href="/admin/students"
              className="px-3 py-1.5 rounded-md hover:bg-slate-800 hover:text-white flex items-center gap-1.5 transition"
            >
              <Users className="h-3.5 w-3.5 text-blue-400" />
              全テナント受講生・評価
            </Link>
            <Link
              href="/admin/announcements"
              className="px-3 py-1.5 rounded-md hover:bg-slate-800 hover:text-white flex items-center gap-1.5 transition"
            >
              <Megaphone className="h-3.5 w-3.5 text-rose-400" />
              お知らせ配信
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <SignOutButton redirectPath="/admin/login" />
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
