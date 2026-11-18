/**
 * ファイル概要：
 * アプリケーション共通ユーティリティ関数群
 *
 * 主な処理：
 * - Tailwind CSSクラス名マージ処理（clsx + tailwind-merge）
 * - 秒数から日本語時間表記（分・秒・時間）へのフォーマット処理
 * - 問題難易度（easy / medium / hard）のラベル名およびTailwindバッジカラー定義
 *
 * 注意事項：
 * - UIコンポーネント全体で広く利用される基本ユーティリティのため、引数仕様の破壊的変更に注意してください。
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 処理概要：
 * 複数のCSSクラス名を条件付きで結合し、Tailwind CSSのクラス競合を自動解消してマージする
 *
 * @param inputs クラス名、条件付きオブジェクト、配列などのClassValue可変引数
 * @returns 競合解消済みの最適化されたクラス名文字列
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 処理概要：
 * 秒単位の学習所要時間を人間が読みやすい日本語表記に整形する
 *
 * 処理詳細：
 * - 60秒未満: 「〇〇秒」
 * - 60分未満: 「〇〇分〇〇秒」または「〇〇分」
 * - 1時間以上: 「〇〇時間〇〇分」
 *
 * @param seconds 所要時間（秒）
 * @returns フォーマットされた日本語文字列（例: "1時間25分", "45秒"）
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}秒`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) return secs > 0 ? `${mins}分${secs}秒` : `${mins}分`;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hours}時間${remMins}分`;
}

/**
 * 処理概要：
 * 難易度コードに対応する日本語表示ラベルおよびTailwind CSSバッジ用配色クラスを取得する
 *
 * @param difficulty 難易度（"easy" | "medium" | "hard"）
 * @returns ラベル名（初級/中級/上級）とTailwindクラス文字列（背景・文字色・枠線）のオブジェクト
 */
export function difficultyLabel(difficulty: "easy" | "medium" | "hard"): {
  label: string;
  color: string;
} {
  switch (difficulty) {
    case "easy":
      return {
        label: "初級",
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      };
    case "medium":
      return {
        label: "中級",
        color: "bg-amber-100 text-amber-800 border-amber-200",
      };
    case "hard":
      return {
        label: "上級",
        color: "bg-rose-100 text-rose-800 border-rose-200",
      };
  }
}
