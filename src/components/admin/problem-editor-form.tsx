"use client";

import React, { useState } from "react";
import Link from "next/link";
import { runJavaCode, compareOutputs } from "@/lib/java";
import { runSqlCode } from "@/lib/sql";
import { SEED_CHAPTERS, SeedProblem, SeedTestCase, detectProblemLanguage } from "@/lib/seed-data";
import { Difficulty, ProblemLanguage } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wand2,
  FlaskConical,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Eye,
  Code2,
} from "lucide-react";

interface ProblemEditorFormProps {
  initialProblem?: SeedProblem;
  mode: "create" | "edit";
}

export function ProblemEditorForm({
  initialProblem,
  mode,
}: ProblemEditorFormProps) {
  const [problemLanguage, setProblemLanguage] = useState<ProblemLanguage>(
    initialProblem ? detectProblemLanguage(initialProblem) : "java"
  );
  const [title, setTitle] = useState(
    initialProblem?.title ?? "新規演習問題"
  );
  const [chapterId, setChapterId] = useState(
    initialProblem?.chapter_id ?? SEED_CHAPTERS[0].id
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(
    initialProblem?.difficulty ?? "easy"
  );
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(
    initialProblem?.estimated_minutes ?? 15
  );
  const [tagsInput, setTagsInput] = useState<string>(
    initialProblem?.tags.join(", ") ?? "出力と変数, 算術演算"
  );

  const [descriptionMd, setDescriptionMd] = useState<string>(
    initialProblem?.description_md ??
      `### 問題概要\n標準入力から2つの整数 A, B が与えられます。A + B の結果を出力してください。\n\n### 入力例\n\`\`\`\n10 25\n\`\`\`\n\n### 出力例\n\`\`\`\n35\n\`\`\``
  );
  const [previewMode, setPreviewMode] = useState(false);

  const [starterCode, setStarterCode] = useState<string>(
    initialProblem?.starter_code ??
      `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        // ここに処理を記述してください\n        \n    }\n}`
  );

  const [solutionCode, setSolutionCode] = useState<string>(
    initialProblem?.solution_code ??
      `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}`
  );

  const [hint1, setHint1] = useState<string>(
    initialProblem?.hints.find((h) => h.step_number === 1)?.content_md ??
      "Scanner の nextInt() で2つの整数を読み取ります。"
  );
  const [hint2, setHint2] = useState<string>(
    initialProblem?.hints.find((h) => h.step_number === 2)?.content_md ??
      "a + b を計算して System.out.println に渡します。"
  );
  const [hint3, setHint3] = useState<string>(
    initialProblem?.hints.find((h) => h.step_number === 3)?.content_md ??
      "System.out.println(a + b); と記述すれば正解です。"
  );

  const [explanationMd, setExplanationMd] = useState<string>(
    initialProblem?.explanation_md ??
      "`sc.nextInt()` で空白や改行区切りの整数を順番に取得できます。"
  );

  const [testCases, setTestCases] = useState<SeedTestCase[]>(
    initialProblem?.test_cases ?? [
      {
        name: "公開テスト1：基本ケース",
        input: "10 25",
        expected_output: "35",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：大きな数値",
        input: "1200 3400",
        expected_output: "4600",
        is_hidden: true,
        order_index: 2,
      },
    ]
  );

  const [verifyReport, setVerifyReport] = useState<{
    allPassed: boolean;
    summary: string;
    details: {
      name: string;
      passed: boolean;
      actual: string;
      expected: string;
      timeMs: number;
    }[];
  } | null>(null);

  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // ★「期待出力を自動生成」ボタン：模範解答を自作インタプリタ（JavaまたはSQL）で実行して各テストケースの期待出力を自動入力する
  const handleAutoGenerateExpectedOutputs = () => {
    const updated: SeedTestCase[] = [];
    for (const tc of testCases) {
      const res =
        problemLanguage === "sql"
          ? runSqlCode(solutionCode, { setupSql: tc.input })
          : runJavaCode(solutionCode, { stdin: tc.input });
      if (res.status !== "success") {
        setVerifyReport({
          allPassed: false,
          summary: `模範解答の実行中にエラーが発生しました：${res.stderr}`,
          details: [],
        });
        return;
      }
      updated.push({
        ...tc,
        expected_output: res.stdout.replace(/\n+$/, ""),
      });
    }
    setTestCases(updated);
    setSaveMessage(
      "✨ 模範解答を実行し、全テストケースの「期待出力」を自動生成して入力しました。"
    );
  };

  // ★「模範解答でテスト」ボタン：保存前に模範解答で全テストに通るか確認する
  const handleVerifyWithSolution = () => {
    const details: {
      name: string;
      passed: boolean;
      actual: string;
      expected: string;
      timeMs: number;
    }[] = [];
    let allPassed = true;

    for (const tc of testCases) {
      const res =
        problemLanguage === "sql"
          ? runSqlCode(solutionCode, { setupSql: tc.input })
          : runJavaCode(solutionCode, { stdin: tc.input });
      const passed =
        res.status === "success" &&
        compareOutputs(res.stdout, tc.expected_output);

      if (!passed) allPassed = false;
      details.push({
        name: `${tc.name} (${tc.is_hidden ? "非公開" : "公開"})`,
        passed,
        actual: res.status === "success" ? res.stdout.trim() : res.stderr,
        expected: tc.expected_output.trim(),
        timeMs: res.executionTimeMs,
      });
    }

    setVerifyReport({
      allPassed,
      summary: allPassed
        ? `✅ 模範解答が全 ${testCases.length} 件のテストケース（公開・非公開）に完全通過しました！問題として正常に成立しています。`
        : "❌ 一部のテストケースで模範解答の出力と期待出力が一致しませんでした。詳細を確認してください。",
      details,
    });
  };

  const handleSaveProblem = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage(
      `問題「${title}」（テストケース ${testCases.length}件、ヒント3段階）を保存しました。`
    );
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          コース管理へ戻る
        </Link>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleAutoGenerateExpectedOutputs}
          >
            <Wand2 className="h-4 w-4 text-purple-600" />
            期待出力を自動生成
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleVerifyWithSolution}
          >
            <FlaskConical className="h-4 w-4 text-amber-600" />
            模範解答でテスト実行
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {mode === "create" ? "新規Java問題の作成" : `問題の編集：${title}`}
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          問題文・初期コード・模範解答・段階的ヒント（最大3つ）・公開/非公開テストケースを設定します。
        </p>
      </div>

      {saveMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* 模範解答でのテスト検証レポート */}
      {verifyReport && (
        <Card
          className={
            verifyReport.allPassed
              ? "border-emerald-300 bg-emerald-50/50"
              : "border-rose-300 bg-rose-50/50"
          }
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              {verifyReport.allPassed ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <XCircle className="h-4 w-4 text-rose-600" />
              )}
              {verifyReport.summary}
            </CardTitle>
          </CardHeader>
          {verifyReport.details.length > 0 && (
            <CardContent className="space-y-2 text-xs">
              {verifyReport.details.map((d, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded border bg-white flex flex-wrap items-center justify-between gap-2"
                >
                  <span className="font-semibold">
                    {d.passed ? "✅" : "❌"} {d.name}
                  </span>
                  <span className="font-mono text-slate-600">
                    期待値: &quot;{d.expected}&quot; / 模範解答出力: &quot;{d.actual}&quot; ({d.timeMs}ms)
                  </span>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      )}

      <form onSubmit={handleSaveProblem} className="space-y-6">
        {/* 基本設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. 基本設定・メタ情報</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">演習言語種別（Java / SQL）</label>
              <select
                value={problemLanguage}
                onChange={(e) => {
                  const lang = e.target.value as ProblemLanguage;
                  setProblemLanguage(lang);
                  if (lang === "sql" && starterCode.includes("public class Main")) {
                    setStarterCode("-- ここにSQLクエリを記述してください\nSELECT * FROM employees;");
                    setSolutionCode("SELECT name, salary FROM employees WHERE department = 'Engineering';");
                    setTagsInput("SQL抽出, 基礎構文");
                  }
                }}
                className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm font-semibold"
              >
                <option value="java">Java（オブジェクト指向・アルゴリズム演習）</option>
                <option value="sql">SQL（データベース抽出・集計・JOIN演習）</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">問題タイトル</label>
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">所属する章</label>
              <select
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm"
              >
                {SEED_CHAPTERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">難易度</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm"
                >
                  <option value="easy">初級 (Easy)</option>
                  <option value="medium">中級 (Medium)</option>
                  <option value="hard">上級 (Hard)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">想定時間（分）</label>
                <Input
                  type="number"
                  min={1}
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">
                スキルタグ（カンマ区切り：レーダーチャート集計に使用）
              </label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="出力と変数, 条件分岐, ループ, 配列, メソッド, オブジェクト指向"
              />
            </div>
          </CardContent>
        </Card>

        {/* 問題文（Markdown ＋ プレビュー切替） */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                2. 問題文（Markdown ＋ プレビュー）
              </CardTitle>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setPreviewMode((p) => !p)}
              >
                <Eye className="h-3.5 w-3.5" />
                {previewMode ? "編集に戻る" : "プレビュー表示"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {previewMode ? (
              <div className="p-4 rounded-xl border bg-slate-50 whitespace-pre-wrap text-sm leading-relaxed">
                {descriptionMd}
              </div>
            ) : (
              <Textarea
                rows={7}
                value={descriptionMd}
                onChange={(e) => setDescriptionMd(e.target.value)}
                className="font-mono text-xs"
              />
            )}
          </CardContent>
        </Card>

        {/* 初期コード ＆ 模範解答 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Code2 className="h-4 w-4 text-blue-600" />
                3. 初期コード（受講生に最初から表示）
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={12}
                value={starterCode}
                onChange={(e) => setStarterCode(e.target.value)}
                className="font-mono text-xs bg-slate-900 text-slate-100"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Code2 className="h-4 w-4 text-emerald-600" />
                4. 模範解答コード（自動生成・検証用）
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={12}
                value={solutionCode}
                onChange={(e) => setSolutionCode(e.target.value)}
                className="font-mono text-xs bg-slate-900 text-emerald-300"
              />
            </CardContent>
          </Card>
        </div>

        {/* テストケース（公開・非公開の区別 ＋ 自動出力生成） */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base">
                  5. テストケース管理（公開・非公開の区別）
                </CardTitle>
                <CardDescription className="text-xs">
                  「非公開（提出時のみ判定）」にチェックを入れたケースはRLSにより受講生には一切送信されません。
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAutoGenerateExpectedOutputs}
                >
                  <Wand2 className="h-3.5 w-3.5 text-purple-600" />
                  模範解答から期待出力を自動生成
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    setTestCases((prev) => [
                      ...prev,
                      {
                        name: `テストケース ${prev.length + 1}`,
                        input: "",
                        expected_output: "",
                        is_hidden: true,
                        order_index: prev.length + 1,
                      },
                    ])
                  }
                >
                  <Plus className="h-3.5 w-3.5" />
                  ケース追加
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {testCases.map((tc, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border bg-slate-50/70 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Input
                      value={tc.name}
                      onChange={(e) => {
                        const next = [...testCases];
                        next[idx].name = e.target.value;
                        setTestCases(next);
                      }}
                      className="w-64 h-8 text-xs font-semibold"
                    />
                    <label className="inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tc.is_hidden}
                        onChange={(e) => {
                          const next = [...testCases];
                          next[idx].is_hidden = e.target.checked;
                          setTestCases(next);
                        }}
                      />
                      <span>非公開テスト（is_hidden = true）</span>
                    </label>
                    {tc.is_hidden ? (
                      <Badge variant="secondary">非公開</Badge>
                    ) : (
                      <Badge variant="success">公開</Badge>
                    )}
                  </div>

                  {testCases.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setTestCases((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="text-rose-600 hover:text-rose-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      標準入力 (stdin)
                    </label>
                    <Textarea
                      rows={2}
                      value={tc.input}
                      onChange={(e) => {
                        const next = [...testCases];
                        next[idx].input = e.target.value;
                        setTestCases(next);
                      }}
                      className="font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      期待出力 (expected_output)
                    </label>
                    <Textarea
                      rows={2}
                      value={tc.expected_output}
                      onChange={(e) => {
                        const next = [...testCases];
                        next[idx].expected_output = e.target.value;
                        setTestCases(next);
                      }}
                      className="font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 段階的ヒント（最大3つ）とクリア後解説 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              6. 段階的ヒント（最大3つ）＆クリア後解説
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-amber-800">
                  ヒント 1（考え方の方向性）
                </label>
                <Textarea
                  rows={3}
                  value={hint1}
                  onChange={(e) => setHint1(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-amber-800">
                  ヒント 2（使う構文・メソッド）
                </label>
                <Textarea
                  rows={3}
                  value={hint2}
                  onChange={(e) => setHint2(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-amber-800">
                  ヒント 3（具体的な実装のヒント）
                </label>
                <Textarea
                  rows={3}
                  value={hint3}
                  onChange={(e) => setHint3(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-emerald-800">
                解説（全テスト合格後に受講生へ解放されます）
              </label>
              <Textarea
                rows={3}
                value={explanationMd}
                onChange={(e) => setExplanationMd(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleVerifyWithSolution}
          >
            <FlaskConical className="h-4 w-4 text-amber-600" />
            模範解答でテスト実行
          </Button>
          <Button type="submit" size="lg">
            <Save className="h-4 w-4" />
            問題を保存する
          </Button>
        </div>
      </form>
    </div>
  );
}
