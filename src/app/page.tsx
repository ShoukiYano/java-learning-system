import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Code2, BarChart3, Building2, ShieldCheck, ArrowRight } from "lucide-react";

export default async function HomePage() {
  // 環境変数が設定されている場合、ログイン済みならロール別画面へ自動リダイレクト
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id")
  ) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role === "admin") redirect("/admin");
        if (profile?.role === "company") redirect("/company");
        redirect("/app");
      }
    } catch {
      // 未接続時はランディング画面を表示
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white">
      <header className="container mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            JavaSkill<span className="text-blue-400">Studio</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white transition"
          >
            ログイン
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-500 transition shadow"
          >
            新規受講登録
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-20 flex flex-col items-center text-center">
        <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
          受講生・研修企業・講師のための統合Java学習基盤
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl leading-tight mb-6">
          受講生も企業側も、
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            学習状況とスキルが一目で分かる
          </span>
        </h1>
        <p className="text-slate-300 max-w-2xl text-base md:text-lg mb-10 leading-relaxed">
          ブラウザ上のMonaco EditorでJavaコードを書き、その場で実行・自動採点。
          タグ別の正答率レーダーチャートや学習カレンダーで、エンジニアリングスキルの定着をリアルタイムに可視化します。
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold shadow-lg shadow-blue-600/25 transition"
          >
            学習をはじめる
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-semibold transition"
          >
            企業コードで登録する
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full text-left">
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/70">
            <Code2 className="h-8 w-8 text-blue-400 mb-4" />
            <h2 className="text-lg font-bold mb-2">受講生（Student）</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              3ペインのJava演習環境、段階的ヒント、日本語コンパイルエラー解説、スキルマップとGitHub風学習カレンダーで着実にステップアップ。
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/70">
            <Building2 className="h-8 w-8 text-emerald-400 mb-4" />
            <h2 className="text-lg font-bold mb-2">企業担当者（Company）</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              自社受講生の進捗率・学習時間・遅れアラート・講師からの評価を一覧で確認。ワンクリックで研修レポートCSVを出力。
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/70">
            <BarChart3 className="h-8 w-8 text-amber-400 mb-4" />
            <h2 className="text-lg font-bold mb-2">管理者・講師（Admin）</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              つまずき問題TOP5の分析、模範解答での事前テスト実行機能付き問題エディタ、提出コードへの個別フィードバック・評価管理。
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-400">
        <div className="container mx-auto px-6 flex items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Supabase RLS + Next.js Middleware によるロールベース二重保護対応</span>
        </div>
      </footer>
    </div>
  );
}
