import Link from "next/link";
import {
  Code2,
  Database,
  BarChart3,
  BookOpenCheck,
  ArrowRight,
  Sparkles,
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
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/student/login"
            className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white transition"
          >
            ログイン
          </Link>
          <Link
            href="/student/signup"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 transition shadow"
          >
            新規受講登録
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-20 flex flex-col items-center text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30 inline-flex items-center gap-1.5">
            <Code2 className="h-3.5 w-3.5" />
            Java プログラミング実践
          </span>
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5" />
            SQL データベース実践
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl leading-tight mb-6">
          書いて動かす、実践型カリキュラムで
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-300">
            エンジニアリングスキルをを着実に習得
          </span>
        </h1>
        <p className="text-slate-300 max-w-2xl text-base md:text-lg mb-10 leading-relaxed">
          ブラウザ上のエディタで <strong>Java</strong> と <strong>SQL</strong>{" "}
          のコードを書き、その場で実行・自動テスト。
          段階的なヒントとスキルマップで、着実にステップアップできる学習プラットフォームです。
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            href="/student/login"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm shadow-lg shadow-blue-600/25 transition"
          >
            ログインして学習を再開する
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/student/signup"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-semibold text-sm transition"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            新規アカウント登録（企業コード対応）
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full text-left">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
            <Code2 className="h-8 w-8 text-blue-400 mb-4" />
            <h2 className="text-lg font-bold mb-2">Java & SQL ブラウザ演習</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              環境構築不要。3ペインのコードエディタ上でJavaプログラムやSQLクエリを即座に実行し、テストケースで正誤を確認できます。
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
            <BookOpenCheck className="h-8 w-8 text-emerald-400 mb-4" />
            <h2 className="text-lg font-bold mb-2">段階的ヒント＆日本語補足</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              つまずいたときは3段階のヒントを順番に開いて自力解決をサポート。エラー発生時も初心者向けの日本語補足が表示されます。
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
            <BarChart3 className="h-8 w-8 text-amber-400 mb-4" />
            <h2 className="text-lg font-bold mb-2">スキルマップ＆学習記録</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              単元タグ別の習得度レーダーチャートや日々の学習カレンダーで、自分の成長と得意・苦手分野が一目で把握できます。
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="container mx-auto px-6">
          <span>© DevSkillStudio. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
