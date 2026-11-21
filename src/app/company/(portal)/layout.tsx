import React from "react";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/data-service";
import { Building2, Users, BookOpen, ShieldCheck, Table2, FileText } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { MobileNavMenu } from "@/components/layout/mobile-nav-menu";

export const dynamic = "force-dynamic";

export default async function CompanyPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  const companyName = profile.companies?.name ?? "研修担当企業";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-30 h-14 bg-emerald-950 text-white px-3 md:px-6 flex items-center justify-between gap-2 border-b border-emerald-900 print:hidden">
        <div className="flex items-center gap-3 md:gap-6 min-w-0">
          <MobileNavMenu
            variant="emerald"
            subtitle={`${companyName} 研修担当`}
            items={[
              { href: "/company", label: "自社受講生一覧・進捗CSV" },
              { href: "/company/progress", label: "受講生全体進捗表" },
              { href: "/company/report", label: "上長報告サマリーPDF" },
              { href: "/company/courses", label: "カリキュラム内容・問題一覧の確認" },
            ]}
          />
          <Link href="/company" className="flex items-center gap-2 font-bold shrink-0">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span>
              DevSkill<span className="text-emerald-400">Studio</span>
            </span>
            <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-900 text-emerald-200 border border-emerald-700">
              企業担当者ポータル
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-emerald-200">
            <Link
              href="/company"
              className="px-3 py-1.5 rounded-md hover:bg-emerald-900 hover:text-white flex items-center gap-1.5 transition"
            >
              <Users className="h-3.5 w-3.5 text-emerald-400" />
              自社受講生一覧・進捗CSV
            </Link>
            <Link
              href="/company/progress"
              className="px-3 py-1.5 rounded-md hover:bg-emerald-900 hover:text-white flex items-center gap-1.5 transition"
            >
              <Table2 className="h-3.5 w-3.5 text-sky-400" />
              受講生全体進捗表
            </Link>
            <Link
              href="/company/report"
              className="px-3 py-1.5 rounded-md hover:bg-emerald-900 hover:text-white flex items-center gap-1.5 transition"
            >
              <FileText className="h-3.5 w-3.5 text-rose-300" />
              上長報告PDF
            </Link>
            <Link
              href="/company/courses"
              className="px-3 py-1.5 rounded-md hover:bg-emerald-900 hover:text-white flex items-center gap-1.5 transition"
            >
              <BookOpen className="h-3.5 w-3.5 text-amber-400" />
              カリキュラム内容・問題一覧の確認
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-emerald-900/90 text-emerald-200 border border-emerald-800">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            {companyName} 研修担当
          </span>
          <SignOutButton redirectPath="/company/login" />
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
