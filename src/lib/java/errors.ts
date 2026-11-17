// =============================================================================
// 受講生向けエラーメッセージ＆日本語補足ヘルパー
// =============================================================================

import { JavaDiagnostic } from "./types";

export class JavaCompileError extends Error {
  public diagnostics: JavaDiagnostic[];

  constructor(diagnostics: JavaDiagnostic[]) {
    super(diagnostics.map((d) => `Line ${d.line}: ${d.message}`).join("\n"));
    this.name = "JavaCompileError";
    this.diagnostics = diagnostics;
  }
}

export function createDiagnostic(
  line: number,
  column: number,
  message: string,
  japaneseHint: string,
  endColumn?: number
): JavaDiagnostic {
  return {
    line,
    column,
    endColumn: endColumn ?? column + 1,
    message,
    japaneseHint,
    severity: "error",
  };
}

// 実行時例外に対する初心者向け日本語ヒントを生成
export function getRuntimeExceptionHint(
  exceptionClass: string,
  message: string
): string {
  switch (exceptionClass) {
    case "ArithmeticException":
      return "0で割り算（/ や %）を行っていませんか？割る数が0にならないか確認してください。";
    case "ArrayIndexOutOfBoundsException":
      return "配列の範囲外のインデックスにアクセスしています。配列の添字は 0 から「配列名.length - 1」までです。";
    case "IndexOutOfBoundsException":
    case "StringIndexOutOfBoundsException":
      return "リストまたは文字列の範囲外のインデックスを指定しています。長さを確認してください。";
    case "NullPointerException":
      return "中身が null（未初期化）の変数に対してメソッド呼び出しやフィールド参照を行っています。new でインスタンスを生成したか確認してください。";
    case "NumberFormatException":
      return "数値に変換できない文字列を Integer.parseInt や Double.parseDouble に渡しています。";
    case "ClassCastException":
      return "互換性のない型へキャスト（型変換）しようとしています。";
    case "NoSuchElementException":
      return "Scanner で入力を読み取ろうとしましたが、これ以上読み取れる入力データがありません。hasNext() で確認するか、入力値を確認してください。";
    case "StackOverflowError":
      return "メソッドの再帰呼び出しが深すぎます。再帰の終了条件（ベースケース）が正しく機能しているか確認してください。";
    default:
      return message
        ? `例外「${exceptionClass}」が発生しました（詳細: ${message}）。発生行の処理を確認してください。`
        : `例外「${exceptionClass}」が発生しました。`;
  }
}
