/**
 * ファイル概要：
 * アプリケーション層セキュリティ共通ユーティリティ
 *
 * 主な機能：
 * - 定数時間文字列比較（timingSafeStringEqual）
 * - CSPRNG による安全な初期パスワード生成（generateSecureInitialPassword）
 * - パスワード強度ポリシー検証（validatePasswordStrength）
 * - authenticated ロール向け DB 安全カラム定数（DB-H4 / DB-H8 連携）
 */

import crypto from "crypto";

/**
 * authenticated ロールから参照可能な companies 安全5列
 * （Webhook URL列・contact_email 等の機密列を除外：DB-H4 連携）
 */
export const COMPANY_PUBLIC_COLUMNS =
  "id, name, company_code, delay_alert_days, created_at" as const;

/**
 * authenticated ロールから参照可能な problems 安全12列
 * （模範解答 solution_code を除外：DB-H8 連携）
 */
export const PROBLEM_STUDENT_COLUMNS =
  "id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, explanation_md, order_index, is_published, created_at" as const;

const UPPER_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const LOWER_CHARS = "abcdefghijkmnopqrstuvwxyz";
const DIGIT_CHARS = "23456789";
const SYMBOL_CHARS = "!@#$%^&*_-";
const ALL_PASSWORD_CHARS = `${UPPER_CHARS}${LOWER_CHARS}${DIGIT_CHARS}${SYMBOL_CHARS}`;

/**
 * タイミング攻撃を防ぐための定数時間文字列比較
 */
export function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * CSPRNG（crypto.randomInt）を用いて、英大文字・英小文字・数字・記号を
 * 各1文字以上含む安全な初期パスワードを生成する（最小12文字、既定14文字）
 */
export function generateSecureInitialPassword(length = 14): string {
  const targetLen = Math.max(12, Math.floor(length));
  const chars: string[] = [
    UPPER_CHARS[crypto.randomInt(0, UPPER_CHARS.length)],
    LOWER_CHARS[crypto.randomInt(0, LOWER_CHARS.length)],
    DIGIT_CHARS[crypto.randomInt(0, DIGIT_CHARS.length)],
    SYMBOL_CHARS[crypto.randomInt(0, SYMBOL_CHARS.length)],
  ];

  for (let i = chars.length; i < targetLen; i++) {
    chars.push(
      ALL_PASSWORD_CHARS[crypto.randomInt(0, ALL_PASSWORD_CHARS.length)]
    );
  }

  // Fisher-Yates シャッフル（CSPRNG使用）
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    const tmp = chars[i];
    chars[i] = chars[j];
    chars[j] = tmp;
  }

  return chars.join("");
}

/**
 * パスワード強度ポリシーを検証する
 * - 10文字以上 128文字以下
 * - 前後に空白を含まないこと
 * - 英大文字・英小文字・数字・記号のうち3種類以上を含むこと
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  error?: string;
} {
  if (typeof password !== "string" || password.length === 0) {
    return {
      valid: false,
      error:
        "パスワードは10文字以上で、英大文字・英小文字・数字・記号のうち3種類以上を含めてください。",
    };
  }

  if (password.trim() !== password) {
    return {
      valid: false,
      error: "パスワードの前後に空白文字を含めることはできません。",
    };
  }

  if (password.length < 10 || password.length > 128) {
    return {
      valid: false,
      error:
        "パスワードは10文字以上128文字以下で、英大文字・英小文字・数字・記号のうち3種類以上を含めてください。",
    };
  }

  let charClassCount = 0;
  if (/[A-Z]/.test(password)) charClassCount++;
  if (/[a-z]/.test(password)) charClassCount++;
  if (/[0-9]/.test(password)) charClassCount++;
  if (/[^A-Za-z0-9]/.test(password)) charClassCount++;

  if (charClassCount < 3) {
    return {
      valid: false,
      error:
        "パスワードは10文字以上で、英大文字・英小文字・数字・記号のうち3種類以上を含めてください。",
    };
  }

  return { valid: true };
}
