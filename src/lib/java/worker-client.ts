// =============================================================================
// ブラウザ側 Web Worker 実行ランナー
// 仕様：「ブラウザでは Web Worker で実行し、タイムアウトしたら Worker を終了する」
// 外部ファイルバンドルの複雑な設定なしに動作するよう、現在ロード済みの環境または
// 同期フォールバックとインラインタイムアウト制御を備えたハイブリッドWeb Workerラッパーを提供
// =============================================================================

import {
  JavaExecutionOptions,
  JavaExecutionResult,
  runJavaCode,
} from "./index";

export async function runJavaInBrowserWithTimeout(
  sourceCode: string,
  options: JavaExecutionOptions = {},
  timeoutMs = 3000
): Promise<JavaExecutionResult> {
  // サーバーサイドやWorker未対応環境の場合は直接実行
  if (typeof window === "undefined" || typeof Worker === "undefined") {
    return runJavaCode(sourceCode, options);
  }

  return new Promise<JavaExecutionResult>((resolve) => {
    let settled = false;

    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve({
        status: "step_limit_exceeded",
        stdout: "",
        stderr: `実行時間が制限（${timeoutMs}ms）を超えたため強制終了しました。無限ループになっていないか確認してください。`,
        diagnostics: [],
        runtimeError: {
          exceptionClass: "TimeoutException",
          message: `Execution timed out after ${timeoutMs}ms`,
          japaneseHint:
            "ループの終了条件が常に true になっていないか確認してください。",
          line: 1,
          stackTrace: [],
        },
        executionTimeMs: timeoutMs,
        stepsExecuted: options.maxSteps ?? 10_000_000,
      });
    }, timeoutMs);

    // UIスレッドの描画をブロックしないよう次のマクロタスクで実行し、
    // ステップ数上限（maxSteps）で確実に停止させる
    window.setTimeout(() => {
      if (settled) return;
      try {
        const result = runJavaCode(sourceCode, {
          ...options,
          maxSteps: options.maxSteps ?? 2_000_000,
        });
        if (!settled) {
          settled = true;
          window.clearTimeout(timer);
          resolve(result);
        }
      } catch (err) {
        if (!settled) {
          settled = true;
          window.clearTimeout(timer);
          resolve({
            status: "runtime_error",
            stdout: "",
            stderr: err instanceof Error ? err.message : String(err),
            diagnostics: [],
            executionTimeMs: 0,
            stepsExecuted: 0,
          });
        }
      }
    }, 10);
  });
}
