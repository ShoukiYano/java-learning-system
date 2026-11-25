/**
 * ファイル概要：
 * 質問添付画像（qa-attachments バケット）の安全性検証・署名付きURL発行ユーティリティ
 *
 * 主な機能：
 * - バイナリ先頭マジックバイト検証（PNG / JPEG / GIF / WebP のみ許可）
 * - ストレージパス抽出・正規化（URIデコード後のパストラバーサル／制御文字検証・旧公開URL後方互換）
 * - 許可プレフィックス検証付き一括署名付きURL発行（クロス・テナント IDOR 防止）
 */

export const QA_ATTACHMENTS_BUCKET = "qa-attachments";
export const MAX_QA_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
export const MAX_SLACK_EVENT_IMAGES = 5;
export const QA_SIGNED_URL_TTL_VIEW_SEC = 3600; // 画面表示用: 1時間
export const QA_SIGNED_URL_TTL_SLACK_SEC = 604800; // Slack通知用: 7日間

export interface ValidatedImage {
  valid: true;
  mime: "image/png" | "image/jpeg" | "image/gif" | "image/webp";
  ext: "png" | "jpg" | "gif" | "webp";
}

export type ImageValidationResult =
  | ValidatedImage
  | { valid: false; reason: string };

/**
 * バイナリ先頭のマジックバイトを実検証し、安全な画像形式（PNG/JPEG/GIF/WebP）のみ許可する。
 * クライアント送信の拡張子や Content-Type は信用せず、必ず本関数の戻り値（mime / ext）を使用する。
 */
export function detectAndValidateImage(
  buf: Uint8Array | Buffer
): ImageValidationResult {
  if (!buf || buf.length < 3) {
    return {
      valid: false,
      reason: "添付できる画像は PNG / JPEG / GIF / WebP 形式のみです。",
    };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return { valid: true, mime: "image/png", ext: "png" };
  }

  // JPEG: FF D8 FF
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { valid: true, mime: "image/jpeg", ext: "jpg" };
  }

  // GIF: "GIF87a" or "GIF89a"
  if (buf.length >= 6) {
    const header = String.fromCharCode(
      buf[0],
      buf[1],
      buf[2],
      buf[3],
      buf[4],
      buf[5]
    );
    if (header === "GIF87a" || header === "GIF89a") {
      return { valid: true, mime: "image/gif", ext: "gif" };
    }
  }

  // WebP: "RIFF" (0..3) and "WEBP" (8..11)
  if (buf.length >= 12) {
    const riff = String.fromCharCode(buf[0], buf[1], buf[2], buf[3]);
    const webp = String.fromCharCode(buf[8], buf[9], buf[10], buf[11]);
    if (riff === "RIFF" && webp === "WEBP") {
      return { valid: true, mime: "image/webp", ext: "webp" };
    }
  }

  return {
    valid: false,
    reason: "添付できる画像は PNG / JPEG / GIF / WebP 形式のみです。",
  };
}

const STORAGE_URL_PATTERN =
  /\/storage\/v1\/object\/(?:public|sign)\/qa-attachments\/([^?#]+)/;
const SAFE_STORAGE_PATH_PATTERN = /^[A-Za-z0-9/_.-]+$/;
const CONTROL_CHAR_PATTERN = /[\x00-\x1f\x7f]/;

/**
 * DB保存値（ストレージ相対パス または 旧形式のSupabase公開/署名URL）から
 * 正規化済みストレージパスを安全に抽出する。
 * URIデコード後にパストラバーサル（..）・バックスラッシュ・制御文字・許可外文字を拒否する。
 */
export function extractQaStoragePath(entry: string): string | null {
  if (typeof entry !== "string") return null;
  const trimmed = entry.trim();
  if (!trimmed) return null;

  let raw: string;
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    const match = trimmed.match(STORAGE_URL_PATTERN);
    if (!match || !match[1]) {
      return null;
    }
    raw = match[1];
  } else {
    raw = trimmed;
  }

  let decoded: string;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return null;
  }

  const normalized = decoded.replace(/^\/+/, "");
  if (!normalized) return null;
  if (normalized.includes("..")) return null;
  if (normalized.includes("\\")) return null;
  if (CONTROL_CHAR_PATTERN.test(normalized)) return null;
  if (!SAFE_STORAGE_PATH_PATTERN.test(normalized)) return null;

  return normalized;
}

export interface QaStorageSignedUrlItem {
  path?: string | null;
  signedUrl?: string | null;
  error?: string | null;
}

export interface QaStorageSignerClient {
  storage: {
    from: (bucket: string) => {
      createSignedUrls: (
        paths: string[],
        expiresIn: number
      ) => Promise<{
        data: QaStorageSignedUrlItem[] | null;
        error: unknown;
      }>;
    };
  };
}

/**
 * 許可プレフィックス一致を検証したストレージパスのみを抽出し、
 * 一括 createSignedUrls で署名付きURLを発行する（クロス・テナント IDOR 防止）。
 */
export async function resolveQaAttachmentSignedUrls(
  adminClient: QaStorageSignerClient,
  entries: string[],
  allowedPrefixes: string[],
  expiresInSec = QA_SIGNED_URL_TTL_VIEW_SEC
): Promise<string[]> {
  if (!Array.isArray(entries) || entries.length === 0) return [];

  const normalizedPrefixes = allowedPrefixes
    .map((p) => p.replace(/^\/+/, ""))
    .filter((p) => p.length > 0);
  if (normalizedPrefixes.length === 0) return [];

  const validPaths: string[] = [];
  for (const entry of entries) {
    const path = extractQaStoragePath(entry);
    if (!path) {
      console.warn("[qa-attachments] skipped invalid attachment path entry");
      continue;
    }
    const isAllowed = normalizedPrefixes.some((prefix) =>
      path.startsWith(prefix)
    );
    if (!isAllowed) {
      console.warn("[qa-attachments] blocked out-of-scope attachment path");
      continue;
    }
    validPaths.push(path);
  }

  if (validPaths.length === 0) return [];

  try {
    const { data, error } = await adminClient.storage
      .from(QA_ATTACHMENTS_BUCKET)
      .createSignedUrls(validPaths, expiresInSec);

    if (error || !Array.isArray(data)) {
      console.error("[qa-attachments] createSignedUrls error:", error);
      return [];
    }

    const signedUrls: string[] = [];
    for (const item of data) {
      if (item && !item.error && typeof item.signedUrl === "string" && item.signedUrl) {
        signedUrls.push(item.signedUrl);
      } else if (item?.error) {
        console.warn("[qa-attachments] individual signedUrl failed:", item.error);
      }
    }
    return signedUrls;
  } catch (err) {
    console.error("[qa-attachments] unexpected createSignedUrls error:", err);
    return [];
  }
}

/**
 * 複数の質問・返信にまたがる添付パスを許可プレフィックス検証したうえで、
 * 1回の createSignedUrls バッチ呼び出しで署名付きURLマップ（normalizedPath -> signedUrl）へ解決する（N+1防止）。
 */
export async function resolveQaAttachmentSignedUrlBatch(
  adminClient: QaStorageSignerClient,
  items: Array<{ entries: string[]; allowedPrefixes: string[] }>,
  expiresInSec = QA_SIGNED_URL_TTL_VIEW_SEC
): Promise<Map<string, string>> {
  const uniquePaths = new Set<string>();

  for (const item of items) {
    const normalizedPrefixes = item.allowedPrefixes
      .map((p) => p.replace(/^\/+/, ""))
      .filter((p) => p.length > 0);
    if (normalizedPrefixes.length === 0) continue;

    for (const entry of item.entries) {
      const path = extractQaStoragePath(entry);
      if (!path) continue;
      if (normalizedPrefixes.some((prefix) => path.startsWith(prefix))) {
        uniquePaths.add(path);
      } else {
        console.warn("[qa-attachments] blocked out-of-scope attachment path");
      }
    }
  }

  const pathList = Array.from(uniquePaths);
  const result = new Map<string, string>();
  if (pathList.length === 0) return result;

  try {
    const { data, error } = await adminClient.storage
      .from(QA_ATTACHMENTS_BUCKET)
      .createSignedUrls(pathList, expiresInSec);

    if (error || !Array.isArray(data)) {
      console.error("[qa-attachments] batch createSignedUrls error:", error);
      return result;
    }

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const key = row?.path || pathList[i];
      if (key && row && !row.error && typeof row.signedUrl === "string" && row.signedUrl) {
        result.set(key, row.signedUrl);
      }
    }
  } catch (err) {
    console.error("[qa-attachments] unexpected batch createSignedUrls error:", err);
  }

  return result;
}
