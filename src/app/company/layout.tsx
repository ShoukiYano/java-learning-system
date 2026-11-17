import React from "react";
import Link from "next/link";
import { Building2, Users, ShieldCheck } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-30 h-14 bg-emerald-950 text-white px-6 flex items-center justify-between border-b border-emerald-900">
        <div className="flex items-center gap-6">
          <Link href="/company" className="flex items-center gap-2 font-bold">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span>
              JavaSkill<span className="text-emerald-400">Partner</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-emerald-200">
            <Link
              href="/company"
              className="px-3 py-1.5 rounded-md hover:bg-emerald-900 hover:text-white flex items-center gap-1.5 transition"
            >
              <Users className="h-3.5 w-3.5 text-emerald-400" />
              自社受講生一覧・CSV出力
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-emerald-900/90 text-emerald-200 border border-emerald-800">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            株式会社ACMEテクノロジーズ 研修担当（閲覧専用）
          </span>
          <SignOutButton />
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
