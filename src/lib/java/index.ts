// =============================================================================
// 自作Javaインタプリタ 統合エントリポイント＆採点ユーティリティ
// ブラウザ（Web Worker）および Node.js（Route Handler）の両方で同一動作
// =============================================================================

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
 * Javaソースコードをコンパイルチェック（字句解析・構文解析・意味解析）し、
 * エラーがなければツリーウォーキング評価器で実行する。
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

export function compareOutputs(actual: string, expected: string): boolean {
  return normalizeOutput(actual) === normalizeOutput(expected);
}
