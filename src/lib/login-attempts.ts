/**
 * ファイル概要：
 * ログイン試行制限およびマルチテナント型ブルートフォース保護ユーティリティ
 *
 * 主な処理：
 * 1. 接続元IP・ロール・企業コード・メールアドレスを組み合わせた複合キーでの試行回数管理
 * 2. 5回連続失敗時の15分間ロックアウト判定
 * 3. 管理者によるパスワード再設定時やログイン成功時の試行カウンターのリセット
 *
 * 注意事項：
 * - Next.js App RouterのRoute Handlerファイルから関数を直接exportするとNext.jsの型制約に抵触するため、
 *   共通ユーティリティとして独立定義しています。
 */

/**
 * 試行回数およびロックアウト期限の記録インターフェース
 */
export interface AttemptRecord {
  /** 連続失敗回数 */
  count: number;
  /** ロック解除予定時刻（UNIXミリ秒、ロック中でない場合はnull） */
  lockedUntil: number | null;
}

/** 同一IP × 同一企業コード × 同一メールのアカウント単位の上限試行回数（5回） */
export const MAX_ACCOUNT_FAILED_ATTEMPTS = 5;
/** 同一IPからの無差別ボット攻撃の上限試行回数（30回） */
export const MAX_BOT_IP_FAILED_ATTEMPTS = 30;
/** ロックアウト継続時間（15分間） */
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

/** メモリ上の試行回数トラッキングマップ */
export const loginAttemptsMap = new Map<string, AttemptRecord>();

/**
 * 処理概要：
 * ログイン失敗回数をインクリメントし、上限超過時にロックアウト時刻を設定する
 *
 * @param key トラッキング用キー（複合キーまたはボット検知用IPキー）
 * @param maxLimit 許容される最大試行回数
 * @returns 更新後のAttemptRecord
 */
export function recordFailedAttempt(
  key: string,
  maxLimit: number
): AttemptRecord {
  const now = Date.now();
  const prev = loginAttemptsMap.get(key) ?? { count: 0, lockedUntil: null };
  const nextCount = prev.count + 1;
  const lockedUntil =
    nextCount >= maxLimit ? now + LOCKOUT_DURATION_MS : null;
  const updated = { count: nextCount, lockedUntil };
  loginAttemptsMap.set(key, updated);
  return updated;
}

/**
 * 処理概要：
 * 認証成功時に該当キーの試行回数レコードを削除（リセット）する
 *
 * @param key トラッキング用キー
 */
export function clearAttempts(key: string) {
  loginAttemptsMap.delete(key);
}

/**
 * 処理概要：
 * 特定メールアドレスに関連する試行回数ロックを解除（リセット）する
 * 管理者によるパスワード再設定時などに呼び出される
 *
 * @param email 対象のメールアドレス
 */
export function resetLoginAttemptsForEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  for (const key of loginAttemptsMap.keys()) {
    if (key.includes(`:${normalized}`)) {
      loginAttemptsMap.delete(key);
    }
  }
}
