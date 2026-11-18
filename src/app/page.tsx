import Link from "next/link";
import {
  Code2,
  Database,
  Building2,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  Lock,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white">
      <header className="container mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            DevSkill<span className="text-blue-400">Studio</span>
          </span>
          <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 ml-2">
            Java & SQL Multi-Tenant Platform
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/student/login"
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 transition shadow"
          >
            受講生ログイン
          </Link>
          <Link
            href="/company/login"
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-600 transition"
          >
            企業担当者ログイン
          </Link>
          <Link
            href="/admin/login"
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
          >
            管理者ログイン
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-16 flex flex-col items-center text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30 inline-flex items-center gap-1.5">
            <Code2 className="h-3.5 w-3.5" />
            Java オブジェクト指向演習
          </span>
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5" />
            SQL データ抽出・集計・JOIN演習
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl leading-tight mb-6">
          受講生も企業側も、
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-300">
            学習状況と開発スキルが一目で分かる
          </span>
        </h1>
        <p className="text-slate-300 max-w-2xl text-base md:text-lg mb-12 leading-relaxed">
          ブラウザ上のMonaco Editorで <strong>Java</strong> と{" "}
          <strong>SQL</strong> を書き、その場で実行・自動採点。
          セキュリティを高めるため「受講生」「企業担当者」「システム管理者」の3ロールで専用パスを分離したマルチテナント学習基盤です。
        </p>

        {/* 3ロール完全に分離された専用ポータルカード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full text-left">
          {/* 1. 受講生ポータル */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-blue-500/30 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
                  <Code2 className="h-5 w-5 text-blue-400" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  /student/...
                </span>
              </div>
              <h2 className="text-lg font-bold mb-2 text-white">
                受講生側（Student）
              </h2>
              <p className="text-xs font-semibold text-blue-400 mb-2">
                役割：カリキュラム受講（Java・SQL）
              </p>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                3ペイン演習環境でJava・SQLコースを受講。段階的ヒント、日本語エラー補足、スキルマップとGitHub風学習カレンダーで着実に習得します。
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800">
              <Link
                href="/student/login"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Lock className="h-3.5 w-3.5" />
                受講生ログイン (/student/login)
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <Link
                  href="/student/signup"
                  className="text-blue-400 hover:underline font-medium"
                >
                  新規受講登録（企業コード対応）
                </Link>
                <Link
                  href="/student"
                  className="text-slate-400 hover:text-white underline"
                >
                  デモ画面を見る →
                </Link>
              </div>
            </div>
          </div>

          {/* 2. 企業担当者ポータル */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-emerald-400" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  /company/...
                </span>
              </div>
              <h2 className="text-lg font-bold mb-2 text-white">
                企業側（Company）
              </h2>
              <p className="text-xs font-semibold text-emerald-400 mb-2">
                役割：自社受講生一覧・進捗管理とカリキュラム内容確認
              </p>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                自社テナントに紐づく受講生の進捗率・学習時間・遅れアラート・講師評価の閲覧、CSVレポート出力、および提供カリキュラム内容の確認を行えます。
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800">
              <Link
                href="/company/login"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Lock className="h-3.5 w-3.5" />
                企業担当者ログイン (/company/login)
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <Link
                  href="/company/courses"
                  className="text-emerald-400 hover:underline font-medium"
                >
                  カリキュラム内容一覧
                </Link>
                <Link
                  href="/company"
                  className="text-slate-400 hover:text-white underline"
                >
                  デモ画面を見る →
                </Link>
              </div>
            </div>
          </div>

          {/* 3. システム管理者ポータル */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/30 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
                  <ShieldAlert className="h-5 w-5 text-indigo-400" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  /admin/...
                </span>
              </div>
              <h2 className="text-lg font-bold mb-2 text-white">
                管理者側（Admin）
              </h2>
              <p className="text-xs font-semibold text-indigo-400 mb-2">
                役割：テナント管理とカリキュラム全体の作成・管理
              </p>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                導入企業（テナント）の登録・企業コード発行・担当者招待、およびJava・SQLカリキュラム全体（コース・章・問題・自動テスト検証）の作成と管理を行います。
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800">
              <Link
                href="/admin/login"
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Lock className="h-3.5 w-3.5" />
                管理者ログイン (/admin/login)
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <Link
                  href="/admin/companies"
                  className="text-indigo-400 hover:underline font-medium"
                >
                  テナント管理
                </Link>
                <Link
                  href="/admin"
                  className="text-slate-400 hover:text-white underline"
                >
                  デモ画面を見る →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-400">
        <div className="container mx-auto px-6 flex items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>
            DevSkillStudio — 3ロール完全パス分離（/student・/company・/admin）＋
            Supabase RLS 二重保護
          </span>
        </div>
      </footer>
    </div>
  );
}
