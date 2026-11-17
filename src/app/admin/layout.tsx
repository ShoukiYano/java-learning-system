import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  LayoutDashboard,
  BookOpen,
  FilePlus2,
  Users,
  Building2,
  Megaphone,
  ExternalLink,
} from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default function AdminLayout({
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
              JavaSkill<span className="text-indigo-400">Admin</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-300">
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-md hover:bg-slate-800 hover:text-white flex items-center gap-1.5 transition"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-indigo-400" />
              ダッシュボード
            </Link>
            <Link
              href="/admin/courses"
              className="px-3 py-1.5 rounded-md hover:bg-slate-800 hover:text-white flex items-center gap-1.5 transition"
            >
              <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
              コース・単元管理
            </Link>
            <Link
              href="/admin/problems/new"
              className="px-3 py-1.5 rounded-md hover:bg-slate-800 hover:text-white flex items-center gap-1.5 transition"
            >
              <FilePlus2 className="h-3.5 w-3.5 text-amber-400" />
              問題作成
            </Link>
            <Link
              href="/admin/students"
              className="px-3 py-1.5 rounded-md hover:bg-slate-800 hover:text-white flex items-center gap-1.5 transition"
            >
              <Users className="h-3.5 w-3.5 text-blue-400" />
              受講生管理
            </Link>
            <Link
              href="/admin/companies"
              className="px-3 py-1.5 rounded-md hover:bg-slate-800 hover:text-white flex items-center gap-1.5 transition"
            >
              <Building2 className="h-3.5 w-3.5 text-purple-400" />
              企業・コード管理
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
          <Link
            href="/app"
            className="text-xs text-slate-300 hover:text-white inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800"
          >
            受講生画面を確認
            <ExternalLink className="h-3 w-3" />
          </Link>
          <SignOutButton />
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
