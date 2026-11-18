/**
 * ファイル概要：
 * 自作Javaインタプリタ 統合エントリポイント＆採点ユーティリティ
 *
 * 主な処理：
 * - 字句解析（lexer）、構文解析（parser）、意味解析（analyzer）、評価器（evaluator）のパイプライン実行
 * - コンパイルエラー時の親切な日本語ヒント付き診断情報（JavaDiagnostic）の生成
 * - テストケース出力比較用の正規化（末尾改行・空白の無視）処理（compareOutputs）
 *
 * 注意事項：
 * - ブラウザ（Web Worker）および Node.js（Next.js Route Handler）の両方で完全同一に動作する共通ライブラリです。
 */

import { tokenize } from "./lexer";
import { parseJava } from "./parser";
import { analyzeProgram } from "./analyzer";
import { evaluateProgram } from "./evaluator";
import {
  JavaDiagnostic,
  JavaExecutionOptions,
  JavaExecutionResult,
} from "./types";

export * from "./types";
export * from "./errors";

/**
 * 処理概要：
 * Javaソースコードをコンパイルチェック（字句・構文・意味解析）し、AST評価器でサンドボックス実行する
 *
 * 処理詳細：
 * 1. tokenize: ソースコードを字句トークン列に分解
 * 2. parseJava: 再帰下降構文解析によりAST（抽象構文木）を生成
 * 3. analyzeProgram: 型チェック、スコープ検証、mainメソッド定義、抽象メソッド実装を検査
 * 4. evaluateProgram: ASTツリーウォーキング評価器でmainメソッドから実行
 *
 * @param sourceCode 実行対象のJavaソースコード文字列
 * @param options 標準入力文字列や最大ステップ数などの実行時オプション
 * @returns JavaExecutionResult 実行結果（標準出力、エラー、ステップ数、診断情報等）
 */
export function runJavaCode(
  sourceCode: string,
  options: JavaExecutionOptions = {}
): JavaExecutionResult {
  const startTime = performance.now();

  // 1. 字句解析
  const lexResult = tokenize(sourceCode);

  // 2. 構文解析
  const parseResult = parseJava(lexResult.tokens, lexResult.diagnostics);

  if (parseResult.diagnostics.length > 0) {
    return formatCompileErrorResult(
      parseResult.diagnostics,
      Math.max(1, Math.round(performance.now() - startTime))
    );
  }

  // 3. 意味解析（未宣言変数、型の不一致、main有無、抽象メソッド未実装など）
  const semanticDiagnostics = analyzeProgram(parseResult.program);

  if (semanticDiagnostics.length > 0) {
    return formatCompileErrorResult(
      semanticDiagnostics,
      Math.max(1, Math.round(performance.now() - startTime))
    );
  }

  // 4. ツリーウォーキング実行
  return evaluateProgram(parseResult.program, options);
}

function formatCompileErrorResult(
  diagnostics: JavaDiagnostic[],
  executionTimeMs: number
): JavaExecutionResult {
  const stderr = diagnostics
    .map(
      (d) =>
        `コンパイルエラー (${d.line}行目:${d.column}列目): ${d.message}\n💡 補足: ${d.japaneseHint}`
    )
    .join("\n\n");

  return {
    status: "compile_error",
    stdout: "",
    stderr,
    diagnostics,
    executionTimeMs,
    stepsExecuted: 0,
  };
}

/**
 * 出力比較用の正規化関数
 * 仕様：「出力の比較では、末尾の空白と改行の違いは無視する」
 * - CRLF を LF に統一
 * - 各行の末尾空白を除去
 * - 全体の末尾の空行・改行を除去
 */
export function normalizeOutput(output: string): string {
  return output
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n+$/g, "");
}

/**
 * 処理概要：
 * 提出コードの標準出力とテストケースの期待出力を正規化して比較判定する
 *
 * @param actual 実行結果の標準出力
 * @param expected テストケースに定義された期待出力
 * @returns true: 完全一致（合格）, false: 不一致
 */
export function compareOutputs(actual: string, expected: string): boolean {
  return normalizeOutput(actual) === normalizeOutput(expected);
}
