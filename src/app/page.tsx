"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Code2,
  Database,
  Play,
  CheckCircle2,
  Flame,
  Sparkles,
  ArrowRight,
  Terminal,
  Trophy,
  Lightbulb,
  Layers,
  Zap,
  ChevronRight,
} from "lucide-react";

const DEMO_SNIPPETS = {
  java: {
    label: "Java 演習プレビュー",
    file: "Main.java",
    badge: "Java Object-Oriented",
    code: `public class Main {
    public static void main(String[] args) {
        String[] skills = {"Java基礎", "クラス設計", "ポリモーフィズム"};
        for (int i = 0; i < skills.length; i++) {
            System.out.println("Step " + (i + 1) + ": " + skills[i] + " Clear! 🎉");
        }
    }
}`,
    output: `Step 1: Java基礎 Clear! 🎉
Step 2: クラス設計 Clear! 🎉
Step 3: ポリモーフィズム Clear! 🎉

✅ テストケース 2/2 合格（実行時間: 3ms）`,
  },
  sql: {
    label: "SQL 演習プレビュー",
    file: "query.sql",
    badge: "SQL Data Analysis",
    code: `SELECT department,
       COUNT(*) AS member_count,
       AVG(score) AS avg_score
FROM engineers
GROUP BY department
ORDER BY avg_score DESC;`,
    output: `department      | member_count | avg_score
------------------------------------------
Backend (Java)  | 12           | 94.5
Database (SQL)  | 9            | 91.0
Frontend        | 7            | 88.2

✅ テストケース 2/2 合格（実行時間: 2ms）`,
  },
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"java" | "sql">("java");
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(true);

  const snippet = DEMO_SNIPPETS[activeTab];

  const handleTriggerDemoRun = () => {
    setIsRunning(true);
    setHasRun(false);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 350);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-blue-500 selection:text-white overflow-x-hidden">
      {/* 背景のグラデーション装飾 */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[900px] rounded-full bg-gradient-to-tr from-blue-600/20 via-indigo-500/15 to-emerald-500/10 blur-3xl" />
        <div className="absolute top-[55%] -left-32 h-[380px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-[45%] -right-32 h-[380px] w-[500px] rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      {/* ナビゲーションヘッダー */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold shadow-lg shadow-blue-600/25">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">
              DevSkill<span className="text-blue-400">Studio</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/student/login"
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              ログイン
            </Link>
            <Link
              href="/student/signup"
              className="px-4 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition shadow-lg shadow-blue-600/25 inline-flex items-center gap-1.5"
            >
              無料で学習をはじめる
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ヒーローセクション（左：キャッチコピー＆CTA、右：インタラクティブIDEプレビュー） */}
        <section className="container mx-auto px-6 pt-14 pb-20 lg:pt-20 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* 左カラム */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>環境構築ゼロ・ブラウザを開いて3秒でコーディング開始</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.18]">
                コードを書いて動かす楽しさを、
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-300 to-amber-300">
                  あなたの一生モノの武器に。
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                <strong>Java オブジェクト指向開発</strong> から{" "}
                <strong>SQL データベース実践操作</strong> まで。
                ただ読むだけの教材ではなく、ゲーム感覚で課題をクリアしながら本物の現場スキルが身につくハンズオン学習スタジオです。
              </p>

              {/* アクションボタン */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/student/signup"
                  className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-sm shadow-xl shadow-blue-600/30 transition transform hover:-translate-y-0.5"
                >
                  <Zap className="h-4 w-4 text-amber-300 fill-amber-300" />
                  今すぐ学習をスタート
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/student/login"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 font-semibold text-sm text-slate-200 transition"
                >
                  ログインして続きから再開
                </Link>
              </div>

              {/* 受講生向けハイライト数値 */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
                <div>
                  <div className="text-2xl font-extrabold text-white">
                    Java & SQL
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    2大バックエンド技術を網羅
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-emerald-400">
                    3段階ヒント
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    初心者でも挫折しない設計
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-amber-400">
                    即時採点
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    日本語エラー解説つき
                  </div>
                </div>
              </div>
            </div>

            {/* 右カラム：触って試せるライブエディタモック */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/95 shadow-2xl shadow-blue-950/50 overflow-hidden">
                {/* エディタ上部タブバー */}
                <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5 mr-2">
                      <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                      <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                      <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("java");
                        setHasRun(true);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                        activeTab === "java"
                          ? "bg-blue-600 text-white shadow"
                          : "bg-slate-900 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Code2 className="h-3.5 w-3.5" />
                      Main.java
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("sql");
                        setHasRun(true);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                        activeTab === "sql"
                          ? "bg-amber-500 text-slate-950 shadow"
                          : "bg-slate-900 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Database className="h-3.5 w-3.5" />
                      query.sql
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleTriggerDemoRun}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow transition"
                  >
                    <Play className="h-3 w-3 fill-white" />
                    {isRunning ? "実行中..." : "実行を試す"}
                  </button>
                </div>

                {/* コード表示エリア */}
                <div className="p-5 font-mono text-xs sm:text-sm bg-slate-900/90 border-b border-slate-800 overflow-x-auto">
                  <pre className="text-slate-100 leading-relaxed">
                    {snippet.code}
                  </pre>
                </div>

                {/* 実行コンソール出力エリア */}
                <div className="p-4 bg-slate-950 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                      実行コンソール出力
                    </span>
                    <span className="text-emerald-400 font-semibold">
                      Ready
                    </span>
                  </div>
                  <pre className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/90 text-emerald-300 leading-relaxed min-h-[115px] overflow-x-auto">
                    {isRunning
                      ? "コンパイル＆テストケース検証中..."
                      : hasRun
                      ? snippet.output
                      : "「実行を試す」をクリックしてください"}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* カリキュラム・ロードマップ紹介セクション */}
        <section className="py-16 border-t border-slate-900 bg-slate-900/40">
          <div className="container mx-auto px-6 max-w-6xl space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                Learning Roadmap
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                基礎から現場レベルまで、迷わず進める2大トラック
              </h2>
              <p className="text-sm text-slate-400">
                1問あたり10〜20分のスモールステップ設計。クリアするごとに次の単元がアンロックされていきます。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Java トラック */}
              <div className="rounded-2xl border border-blue-500/25 bg-slate-900/80 p-6 space-y-5 hover:border-blue-500/50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
                      <Code2 className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-blue-400">
                        Track 01 • 全4章 / 12演習
                      </span>
                      <h3 className="text-lg font-bold text-white">
                        Java入門〜オブジェクト指向実践コース
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <span className="font-semibold text-slate-200">
                      第1章：標準入出力・変数・四則演算とScanner
                    </span>
                    <span className="text-emerald-400 font-semibold">3問</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <span className="font-semibold text-slate-200">
                      第2章：if-else分岐・FizzBuzz・whileループアルゴリズム
                    </span>
                    <span className="text-emerald-400 font-semibold">3問</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <span className="font-semibold text-slate-200">
                      第3章：配列走査・素数判定メソッド・再帰呼び出し
                    </span>
                    <span className="text-emerald-400 font-semibold">3問</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <span className="font-semibold text-slate-200">
                      第4章：クラス設計・カプセル化・継承とオーバーライド
                    </span>
                    <span className="text-emerald-400 font-semibold">3問</span>
                  </div>
                </div>
              </div>

              {/* SQL トラック */}
              <div className="rounded-2xl border border-amber-500/25 bg-slate-900/80 p-6 space-y-5 hover:border-amber-500/50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                      <Database className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-400">
                        Track 02 • 全3章 / 6演習
                      </span>
                      <h3 className="text-lg font-bold text-white">
                        SQL実践：データ抽出・集計・テーブル結合コース
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <span className="font-semibold text-slate-200">
                      SQL第1章：SELECT / WHERE 抽出と ORDER BY・LIMIT 上位取得
                    </span>
                    <span className="text-amber-400 font-semibold">2問</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <span className="font-semibold text-slate-200">
                      SQL第2章：COUNT / SUM / AVG と GROUP BY・HAVING 集計分析
                    </span>
                    <span className="text-amber-400 font-semibold">2問</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <span className="font-semibold text-slate-200">
                      SQL第3章：INNER JOIN 内部結合と LEFT JOIN 外部結合の実践
                    </span>
                    <span className="text-amber-400 font-semibold">2問</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-amber-200/90 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>
                      ブラウザ内インメモリRDBMSでテーブル作成〜クエリ採点まで即時実行
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* モチベーションが続く3つの仕組み */}
        <section className="py-16 container mx-auto px-6 max-w-6xl space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Why You Keep Going
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              一人で悩まない。成長が目に見えるから毎日続けられる
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/75 border border-slate-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="text-base font-bold">
                答えを見る前に気づける「3段階ヒント」
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                いきなり解答を見るのではなく、「考え方の方向性」→「使う構文」→「具体例」と1段階ずつヒントを開示。自力で解けた達成感を味わえます。
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/75 border border-slate-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
                <Flame className="h-5 w-5 text-orange-400 fill-orange-400" />
              </div>
              <h3 className="text-base font-bold">
                連続学習ストリーク＆GitHub風カレンダー
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                問題を解くたびにカレンダーに緑の草が積み上がり、連続学習日数を自動カウント。全テスト合格時には紙吹雪エフェクトがあなたのクリアを祝福します。
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/75 border border-slate-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold">
                スキルレーダー＆現役講師からのレビュー
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                「条件分岐」「ループ」「オブジェクト指向」「SQL集計」「JOIN結合」など8軸のレーダーチャートで自分の強みを可視化。提出コードには講師からのフィードバックも届きます。
              </p>
            </div>
          </div>

          {/* ボトムCTAバナー */}
          <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 border border-blue-500/30 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-200">
                <Layers className="h-4 w-4" />
                <span>全18問のハンズオン演習があなたを待っています</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                まずは1問、「Hello, Java!」の出力から始めよう。
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/student/signup"
                className="px-6 py-3.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-xs sm:text-sm inline-flex items-center gap-1.5 shadow-lg transition"
              >
                新規アカウント作成
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/student/login"
                className="px-5 py-3.5 rounded-xl bg-blue-950/60 hover:bg-blue-950 text-white border border-blue-400/30 font-semibold text-xs sm:text-sm transition"
              >
                ログインはこちら
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="container mx-auto px-6">
          <span>© DevSkillStudio — Hands-on Java & SQL Learning Platform</span>
        </div>
      </footer>
    </div>
  );
}
