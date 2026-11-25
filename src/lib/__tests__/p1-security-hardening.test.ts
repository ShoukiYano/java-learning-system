import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

// =============================================================================
// モック制御用状態
// =============================================================================
type MockQueryResult = { data: unknown; error: unknown };

interface RecordedInsert {
  table: string;
  payload: unknown;
}

interface MockSupabaseState {
  authUser: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  } | null;
  authError: unknown;
  tableResolver: (
    table: string,
    filters: Record<string, unknown>,
    selectCols?: string
  ) => MockQueryResult;
  insertResolver?: (table: string, payload: unknown) => MockQueryResult;
  insertedRows: RecordedInsert[];
  storageUploadMock: ReturnType<typeof vi.fn>;
  storageCreateSignedUrlsMock: ReturnType<typeof vi.fn>;
  createUserMock: ReturnType<typeof vi.fn>;
  updateUserByIdMock: ReturnType<typeof vi.fn>;
  listUsersMock: ReturnType<typeof vi.fn>;
}

const mockState: MockSupabaseState = {
  authUser: null,
  authError: null,
  tableResolver: () => ({ data: null, error: null }),
  insertResolver: undefined,
  insertedRows: [],
  storageUploadMock: vi.fn().mockResolvedValue({ data: { path: "ok" }, error: null }),
  storageCreateSignedUrlsMock: vi.fn(async (paths: string[]) => ({
    data: paths.map((p) => ({
      path: p,
      signedUrl: `https://example.supabase.co/storage/v1/object/sign/qa-attachments/${p}?token=mock-token`,
      error: null,
    })),
    error: null,
  })),
  createUserMock: vi.fn(async () => ({
    data: { user: { id: "created-mgr-uid-1" } },
    error: null,
  })),
  updateUserByIdMock: vi.fn(async () => ({ data: {}, error: null })),
  listUsersMock: vi.fn(async () => ({ data: { users: [] }, error: null })),
};

function createMockSupabaseClient() {
  return {
    auth: {
      getUser: vi.fn(async () => ({
        data: { user: mockState.authUser },
        error: mockState.authError,
      })),
      admin: {
        createUser: (...args: unknown[]) => mockState.createUserMock(...args),
        updateUserById: (...args: unknown[]) =>
          mockState.updateUserByIdMock(...args),
        listUsers: (...args: unknown[]) => mockState.listUsersMock(...args),
        deleteUser: vi.fn(async () => ({ data: {}, error: null })),
      },
    },
    storage: {
      from: vi.fn(() => ({
        upload: (...args: unknown[]) => mockState.storageUploadMock(...args),
        createSignedUrls: (paths: string[], expiresIn: number) =>
          mockState.storageCreateSignedUrlsMock(paths, expiresIn),
      })),
    },
    from: vi.fn((table: string) => {
      const filters: Record<string, unknown> = {};
      let selectCols: string | undefined;
      let pendingInsertPayload: unknown = undefined;
      let isInsert = false;

      const resolveQuery = (): MockQueryResult => {
        if (isInsert && mockState.insertResolver) {
          return mockState.insertResolver(table, pendingInsertPayload);
        }
        return mockState.tableResolver(table, filters, selectCols);
      };

      const builder = {
        select: vi.fn((cols?: string) => {
          selectCols = cols;
          return builder;
        }),
        eq: vi.fn((col: string, val: unknown) => {
          filters[col] = val;
          return builder;
        }),
        ilike: vi.fn((col: string, val: unknown) => {
          filters[col] = val;
          return builder;
        }),
        in: vi.fn((col: string, val: unknown) => {
          filters[col] = val;
          return builder;
        }),
        order: vi.fn(() => builder),
        limit: vi.fn(() => builder),
        insert: vi.fn((payload: unknown) => {
          isInsert = true;
          pendingInsertPayload = payload;
          mockState.insertedRows.push({ table, payload });
          return builder;
        }),
        upsert: vi.fn(async (payload: unknown) => {
          mockState.insertedRows.push({ table, payload });
          return { data: null, error: null };
        }),
        update: vi.fn(() => builder),
        delete: vi.fn(() => builder),
        maybeSingle: vi.fn(async () => resolveQuery()),
        single: vi.fn(async () => resolveQuery()),
        then: (
          resolve: (value: MockQueryResult) => void,
          reject?: (reason: unknown) => void
        ) => {
          Promise.resolve(resolveQuery()).then(resolve, reject);
        },
      };
      return builder;
    }),
  };
}

const mockGetCompanySlackSettingsFromDb = vi.fn(async (..._args: unknown[]) => ({
  webhookUrl: null,
  channelName: null,
  questionWebhookUrl: null,
  questionChannelName: null,
  questionChannelId: null,
}));
const mockGetAdminCompaniesList = vi.fn(async (..._args: unknown[]) => []);
const mockGetMilestonesFromDb = vi.fn(async (..._args: unknown[]) => []);
const mockGetStudentsAnalyticsFromDb = vi.fn(async (..._args: unknown[]) => []);

const mockPostSlackBotQuestion = vi.fn(async (..._args: unknown[]) => ({
  ok: true,
  channelId: "C_TEST",
  threadTs: "1700000000.000001",
}));
const mockSendSlackQuestionAlert = vi.fn(async (..._args: unknown[]) => ({
  ok: true,
}));
const mockSendCompanyDigestMessage = vi.fn(async (..._args: unknown[]) => ({
  ok: true,
}));
const mockSendSlackTestMessage = vi.fn(async (..._args: unknown[]) => ({
  ok: true,
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => createMockSupabaseClient()),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(() => createMockSupabaseClient()),
}));

vi.mock("@/lib/data-service", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/data-service")>();
  return {
    ...actual,
    getCompanySlackSettingsFromDb: (...args: unknown[]) =>
      mockGetCompanySlackSettingsFromDb(...args),
    getAdminCompaniesList: (...args: unknown[]) =>
      mockGetAdminCompaniesList(...args),
    getMilestonesFromDb: (...args: unknown[]) =>
      mockGetMilestonesFromDb(...args),
    getStudentsAnalyticsFromDb: (...args: unknown[]) =>
      mockGetStudentsAnalyticsFromDb(...args),
  };
});

vi.mock("@/lib/slack", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/slack")>();
  return {
    ...actual,
    postSlackBotQuestion: (...args: unknown[]) =>
      mockPostSlackBotQuestion(...args),
    sendSlackQuestionAlert: (...args: unknown[]) =>
      mockSendSlackQuestionAlert(...args),
    sendCompanyDigestMessage: (...args: unknown[]) =>
      mockSendCompanyDigestMessage(...args),
    sendSlackTestMessage: (...args: unknown[]) =>
      mockSendSlackTestMessage(...args),
  };
});

// モック宣言後にテスト対象をインポート
import {
  detectAndValidateImage,
  extractQaStoragePath,
  resolveQaAttachmentSignedUrls,
  resolveQaAttachmentSignedUrlBatch,
  MAX_QA_IMAGE_BYTES,
  type QaStorageSignerClient,
} from "@/lib/qa-attachments";
import {
  timingSafeStringEqual,
  generateSecureInitialPassword,
  validatePasswordStrength,
  COMPANY_PUBLIC_COLUMNS,
  PROBLEM_STUDENT_COLUMNS,
} from "@/lib/security-utils";
import { downloadSlackFileBuffer } from "@/lib/slack";
import { recordAuditLog } from "@/lib/audit-log";
import { POST as studentQuestionsPost } from "@/app/api/student/questions/route";
import { POST as slackEventsPost } from "@/app/api/slack/events/route";
import { GET as cronSlackDigestGet } from "@/app/api/cron/slack-digest/route";
import { POST as adminActionsPost } from "@/app/api/admin/actions/route";

// =============================================================================
// 共通ヘルパー・環境変数退避
// =============================================================================
const ENV_KEYS = [
  "NODE_ENV",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SLACK_SIGNING_SECRET",
  "SLACK_BOT_TOKEN",
  "SLACK_DEFAULT_QUESTION_CHANNEL_ID",
  "CRON_SECRET",
] as const;

const savedEnv: Record<string, string | undefined> = {};

function setNodeEnv(val: string | undefined) {
  (process.env as Record<string, string | undefined>).NODE_ENV = val;
}

function enableSupabaseEnv(withServiceRole = false) {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://p1-test-project.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "p1-test-anon-key";
  if (withServiceRole) {
    process.env.SUPABASE_SERVICE_ROLE_KEY = "p1-test-service-role-key";
  } else {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
}

function makeSlackSignature(
  signingSecret: string,
  timestamp: string,
  rawBody: string
): string {
  const sigBase = `v0:${timestamp}:${rawBody}`;
  return (
    "v0=" +
    crypto
      .createHmac("sha256", signingSecret)
      .update(sigBase, "utf8")
      .digest("hex")
  );
}

function makeJsonPost(
  url: string,
  body: unknown,
  headers: Record<string, string> = {}
): NextRequest {
  return new NextRequest(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  for (const key of ENV_KEYS) {
    savedEnv[key] = process.env[key];
  }
  mockState.authUser = null;
  mockState.authError = null;
  mockState.tableResolver = () => ({ data: null, error: null });
  mockState.insertResolver = undefined;
  mockState.insertedRows = [];
  mockState.storageUploadMock = vi
    .fn()
    .mockResolvedValue({ data: { path: "ok" }, error: null });
  mockState.storageCreateSignedUrlsMock = vi.fn(async (paths: string[]) => ({
    data: paths.map((p) => ({
      path: p,
      signedUrl: `https://example.supabase.co/storage/v1/object/sign/qa-attachments/${p}?token=mock-token`,
      error: null,
    })),
    error: null,
  }));
  mockState.createUserMock = vi.fn(async () => ({
    data: { user: { id: "created-mgr-uid-1" } },
    error: null,
  }));
  mockState.updateUserByIdMock = vi.fn(async () => ({ data: {}, error: null }));
  mockState.listUsersMock = vi.fn(async () => ({
    data: { users: [] },
    error: null,
  }));

  mockGetCompanySlackSettingsFromDb.mockClear();
  mockGetAdminCompaniesList.mockClear();
  mockGetMilestonesFromDb.mockClear();
  mockGetStudentsAnalyticsFromDb.mockClear();
  mockPostSlackBotQuestion.mockClear();
  mockSendSlackQuestionAlert.mockClear();
  mockSendCompanyDigestMessage.mockClear();
  mockSendSlackTestMessage.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
  for (const key of ENV_KEYS) {
    if (savedEnv[key] === undefined) {
      delete (process.env as Record<string, string | undefined>)[key];
    } else {
      (process.env as Record<string, string | undefined>)[key] = savedEnv[key];
    }
  }
});

// =============================================================================
// 1. APP-M1 / DB-H6: 質問添付画像のマジックバイト検証・サイズ制限・署名付きURL・IDOR防止
// =============================================================================
describe("APP-M1 / DB-H6: 質問添付画像セキュリティ（マジックバイト・5MB上限・パス正規化・IDOR防止）", () => {
  it("M1-01: detectAndValidateImageが正当なPNG/JPEG/GIF/WebPバイナリを受け入れ正しい{valid:true, mime, ext}を返す", () => {
    const pngBuf = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00,
    ]);
    const jpegBuf = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    const gif87Buf = Buffer.from("GIF87a\x01\x00\x01\x00", "ascii");
    const gif89Buf = Buffer.from("GIF89a\x01\x00\x01\x00", "ascii");
    const webpBuf = Buffer.concat([
      Buffer.from("RIFF", "ascii"),
      Buffer.from([0x24, 0x00, 0x00, 0x00]),
      Buffer.from("WEBP", "ascii"),
      Buffer.from([0x56, 0x50, 0x38, 0x20]),
    ]);

    expect(detectAndValidateImage(pngBuf)).toEqual({
      valid: true,
      mime: "image/png",
      ext: "png",
    });
    expect(detectAndValidateImage(jpegBuf)).toEqual({
      valid: true,
      mime: "image/jpeg",
      ext: "jpg",
    });
    expect(detectAndValidateImage(gif87Buf)).toEqual({
      valid: true,
      mime: "image/gif",
      ext: "gif",
    });
    expect(detectAndValidateImage(gif89Buf)).toEqual({
      valid: true,
      mime: "image/gif",
      ext: "gif",
    });
    expect(detectAndValidateImage(webpBuf)).toEqual({
      valid: true,
      mime: "image/webp",
      ext: "webp",
    });
  });

  it("M1-02: SVG/HTML/JS/テキストを.png・image/png偽装で渡すとdetectAndValidateImageおよびPOST /api/student/questionsが400で拒否しStorageアップロードされない", async () => {
    const spoofedPayloads = [
      '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"></svg>',
      "<!DOCTYPE html><html><body><script>alert(1)</script></body></html>",
      "console.log('malicious');",
      "plain text disguised as png",
    ];

    for (const content of spoofedPayloads) {
      const check = detectAndValidateImage(Buffer.from(content, "utf8"));
      expect(check.valid).toBe(false);
    }

    // POST /api/student/questions での実挙動テスト
    enableSupabaseEnv(true);
    mockState.authUser = { id: "student-m1-02", email: "st@example.com" };
    mockState.tableResolver = (table) => {
      if (table === "profiles") {
        return {
          data: {
            id: "student-m1-02",
            email: "st@example.com",
            full_name: "テスト受講生",
            role: "student",
            company_id: "00000000-0000-4000-8000-000000000010",
            companies: { name: "テスト社" },
          },
          error: null,
        };
      }
      return { data: null, error: null };
    };

    for (const content of spoofedPayloads) {
      const formData = new FormData();
      formData.append("problemId", "prob-1");
      formData.append("problemTitle", "テスト問題");
      formData.append("questionText", "添付画像のテストです");
      const fakePngFile = new File([content], "evil.png", {
        type: "image/png",
      });
      formData.append("images", fakePngFile);

      const req = new NextRequest("http://localhost:3000/api/student/questions", {
        method: "POST",
        body: formData,
      });

      const res = await studentQuestionsPost(req);
      expect(res.status).toBe(400);
      expect(mockState.storageUploadMock).not.toHaveBeenCalled();
    }
  });

  it("M1-03: downloadSlackFileBufferが5MB超のContent-Lengthまたは5MB超の実ボディをnullで拒否する", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    // 1) Content-Length が 5MB 超
    fetchSpy.mockResolvedValueOnce(
      new Response(new Uint8Array(10), {
        status: 200,
        headers: {
          "content-type": "image/png",
          "content-length": String(MAX_QA_IMAGE_BYTES + 1),
        },
      })
    );
    const resOverHeader = await downloadSlackFileBuffer(
      "xoxb-test-token",
      "https://files.slack.com/files-pri/T1-F1/large.png"
    );
    expect(resOverHeader).toBeNull();

    // 2) Content-Length なし・実ボディが 5MB 超
    const oversizedBody = new Uint8Array(MAX_QA_IMAGE_BYTES + 1);
    fetchSpy.mockResolvedValueOnce(
      new Response(oversizedBody, {
        status: 200,
        headers: { "content-type": "image/png" },
      })
    );
    const resOverBody = await downloadSlackFileBuffer(
      "xoxb-test-token",
      "https://files.slack.com/files-pri/T1-F2/large-body.png"
    );
    expect(resOverBody).toBeNull();

    // 3) 境界値: 5MB ちょうどは許可される
    const exactLimitBody = new Uint8Array(MAX_QA_IMAGE_BYTES);
    fetchSpy.mockResolvedValueOnce(
      new Response(exactLimitBody, {
        status: 200,
        headers: {
          "content-type": "image/png",
          "content-length": String(MAX_QA_IMAGE_BYTES),
        },
      })
    );
    const resExact = await downloadSlackFileBuffer(
      "xoxb-test-token",
      "https://files.slack.com/files-pri/T1-F3/exact-5mb.png"
    );
    expect(resExact).not.toBeNull();
    expect(resExact?.buffer.byteLength).toBe(MAX_QA_IMAGE_BYTES);
  });

  it("M1-04: extractQaStoragePathが旧形式の公開URLからストレージパスを抽出する（後方互換）", () => {
    expect(
      extractQaStoragePath(
        "https://xyz.supabase.co/storage/v1/object/public/qa-attachments/a/b.png"
      )
    ).toBe("a/b.png");

    expect(
      extractQaStoragePath(
        "https://xyz.supabase.co/storage/v1/object/sign/qa-attachments/student/u1/img_0.jpg?token=abc"
      )
    ).toBe("student/u1/img_0.jpg");

    expect(extractQaStoragePath("student/u1/1700000000_0.png")).toBe(
      "student/u1/1700000000_0.png"
    );
  });

  it("M1-05: extractQaStoragePathが%2e%2e%2fパストラバーサル、不正%列、バックスラッシュ、制御文字をすべてnullで拒否する", () => {
    const maliciousInputs = [
      "%2e%2e%2fsecret.png",
      "student/u1/%2e%2e/%2e%2e/other/a.png",
      "../other/a.png",
      "https://xyz.supabase.co/storage/v1/object/public/qa-attachments/%2e%2e%2fother/a.png",
      "%E0%A4%A", // 不正なURIエンコード（URIError誘発）
      "student\\u1\\a.png",
      "student/u1/file%5csecret.png",
      "student/u1/file\x00.png",
      "student/u1/file%00.png",
      "student/u1/file\n.png",
      "https://evil.example.com/qa-attachments/a/b.png",
      "",
      "   ",
    ];

    for (const input of maliciousInputs) {
      expect(extractQaStoragePath(input)).toBeNull();
    }
  });

  it("M1-06: resolveQaAttachmentSignedUrls / resolveQaAttachmentSignedUrlBatchが許可プレフィックス一致パスのみ署名し他社・他受講生パスを除外する（IDOR防止）", async () => {
    const createSignedUrlsMock = vi.fn(async (paths: string[]) => ({
      data: paths.map((p) => ({
        path: p,
        signedUrl: `https://signed.example.com/${p}?token=sig`,
        error: null,
      })),
      error: null,
    }));
    const signerClient: QaStorageSignerClient = {
      storage: {
        from: () => ({ createSignedUrls: createSignedUrlsMock }),
      },
    };

    const allowedPrefixes = ["student/uid-own/", "q-own-1/"];
    const mixedEntries = [
      "student/uid-own/1700_0.png",
      "https://xyz.supabase.co/storage/v1/object/public/qa-attachments/q-own-1/reply.jpg",
      "student/uid-other-tenant/secret.png", // 他社受講生パス（IDOR試行）
      "q-other-999/reply.png", // 他質問パス（IDOR試行）
      "student/uid-own/%2e%2e/uid-other-tenant/secret.png", // パストラバーサル
    ];

    const signedList = await resolveQaAttachmentSignedUrls(
      signerClient,
      mixedEntries,
      allowedPrefixes,
      3600
    );

    expect(createSignedUrlsMock).toHaveBeenCalledTimes(1);
    expect(createSignedUrlsMock).toHaveBeenCalledWith(
      ["student/uid-own/1700_0.png", "q-own-1/reply.jpg"],
      3600
    );
    expect(signedList).toEqual([
      "https://signed.example.com/student/uid-own/1700_0.png?token=sig",
      "https://signed.example.com/q-own-1/reply.jpg?token=sig",
    ]);

    // バッチ版も同様に検証
    createSignedUrlsMock.mockClear();
    const batchMap = await resolveQaAttachmentSignedUrlBatch(
      signerClient,
      [
        {
          entries: mixedEntries,
          allowedPrefixes,
        },
      ],
      3600
    );

    expect(createSignedUrlsMock).toHaveBeenCalledTimes(1);
    expect(createSignedUrlsMock).toHaveBeenCalledWith(
      ["student/uid-own/1700_0.png", "q-own-1/reply.jpg"],
      3600
    );
    expect(batchMap.size).toBe(2);
    expect(batchMap.has("student/uid-other-tenant/secret.png")).toBe(false);
    expect(batchMap.has("q-other-999/reply.png")).toBe(false);
  });
});

// =============================================================================
// 2. APP-M3: POST /api/slack/events 署名検証最優先・Fail-Closed
// =============================================================================
describe("APP-M3: POST /api/slack/events 署名検証最優先・Fail-Closed", () => {
  const SIGNING_SECRET = "test-slack-signing-secret-xyz";

  it("M3-01: 署名なし／不正署名のurl_verificationリクエストを401で拒否しchallengeを返さない", async () => {
    process.env.SLACK_SIGNING_SECRET = SIGNING_SECRET;
    const rawBody = JSON.stringify({
      type: "url_verification",
      challenge: "secret-challenge-token-123",
    });

    // 署名なし
    const resNoSig = await slackEventsPost(
      new NextRequest("http://localhost:3000/api/slack/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: rawBody,
      })
    );
    expect(resNoSig.status).toBe(401);
    const jsonNoSig = await resNoSig.json();
    expect(jsonNoSig.challenge).toBeUndefined();

    // 不正署名
    const ts = String(Math.floor(Date.now() / 1000));
    const resBadSig = await slackEventsPost(
      new NextRequest("http://localhost:3000/api/slack/events", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-slack-request-timestamp": ts,
          "x-slack-signature": "v0=0000000000000000000000000000000000000000000000000000000000000000",
        },
        body: rawBody,
      })
    );
    expect(resBadSig.status).toBe(401);
    const jsonBadSig = await resBadSig.json();
    expect(jsonBadSig.challenge).toBeUndefined();
  });

  it("M3-02: 正当なHMAC署名付きのurl_verificationリクエストへ200 {challenge}を返す", async () => {
    process.env.SLACK_SIGNING_SECRET = SIGNING_SECRET;
    const rawBody = JSON.stringify({
      type: "url_verification",
      challenge: "valid-challenge-999",
    });
    const ts = String(Math.floor(Date.now() / 1000));
    const sig = makeSlackSignature(SIGNING_SECRET, ts, rawBody);

    const res = await slackEventsPost(
      new NextRequest("http://localhost:3000/api/slack/events", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-slack-request-timestamp": ts,
          "x-slack-signature": sig,
        },
        body: rawBody,
      })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ challenge: "valid-challenge-999" });
  });

  it("M3-03: 本番(NODE_ENV=production)でSLACK_SIGNING_SECRET未設定時は401 Fail-Closedとなる", async () => {
    setNodeEnv("production");
    delete process.env.SLACK_SIGNING_SECRET;

    const rawBody = JSON.stringify({
      type: "url_verification",
      challenge: "should-not-echo",
    });
    const res = await slackEventsPost(
      new NextRequest("http://localhost:3000/api/slack/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: rawBody,
      })
    );
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.challenge).toBeUndefined();
  });
});

// =============================================================================
// 3. APP-M4: GET /api/cron/slack-digest 定数時間比較・Fail-Closed
// =============================================================================
describe("APP-M4: timingSafeStringEqual & GET /api/cron/slack-digest", () => {
  it("M4-01: timingSafeStringEqualが一致時true・不一致（同長/異長）時falseを返す", () => {
    expect(timingSafeStringEqual("Bearer secret-123", "Bearer secret-123")).toBe(
      true
    );
    expect(timingSafeStringEqual("Bearer secret-123", "Bearer secret-124")).toBe(
      false
    );
    expect(timingSafeStringEqual("Bearer secret-123", "Bearer short")).toBe(
      false
    );
    expect(timingSafeStringEqual("", "non-empty")).toBe(false);
    expect(timingSafeStringEqual("", "")).toBe(true);
  });

  it("M4-02: GET /api/cron/slack-digestが不正なAuthorizationヘッダおよび本番CRON_SECRET未設定時に401を返す", async () => {
    // 1) 不正な Authorization（同長・異長・欠落）
    process.env.CRON_SECRET = "super-secret-cron-token";

    const resSameLen = await cronSlackDigestGet(
      new NextRequest("http://localhost:3000/api/cron/slack-digest", {
        headers: { authorization: "Bearer super-secret-cron-tokeX" },
      })
    );
    expect(resSameLen.status).toBe(401);

    const resDiffLen = await cronSlackDigestGet(
      new NextRequest("http://localhost:3000/api/cron/slack-digest", {
        headers: { authorization: "Bearer wrong" },
      })
    );
    expect(resDiffLen.status).toBe(401);

    const resMissing = await cronSlackDigestGet(
      new NextRequest("http://localhost:3000/api/cron/slack-digest")
    );
    expect(resMissing.status).toBe(401);

    // 2) 本番で CRON_SECRET 未設定 → 401 Fail-Closed
    setNodeEnv("production");
    delete process.env.CRON_SECRET;

    const resProdNoSecret = await cronSlackDigestGet(
      new NextRequest("http://localhost:3000/api/cron/slack-digest", {
        headers: { authorization: "Bearer anything" },
      })
    );
    expect(resProdNoSecret.status).toBe(401);
  });
});

// =============================================================================
// 4. APP-M6: DBエラー詳細非露出
// =============================================================================
describe("APP-M6: DBエラー詳細・環境変数名・SQLヒント非露出", () => {
  it("M6-01: POST /api/admin/actionsで内部エラー詳細を含む例外・DBエラーが発生しても500レスポンスに内部詳細が一切含まれない", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    enableSupabaseEnv(true);
    mockState.authUser = { id: "admin-m6", email: "admin@example.com" };
    mockState.tableResolver = (table) => {
      if (table === "profiles") {
        return {
          data: {
            id: "admin-m6",
            email: "admin@example.com",
            full_name: "管理者",
            role: "admin",
            company_id: null,
          },
          error: null,
        };
      }
      return { data: null, error: null };
    };

    // 1) create_company の DBエラー応答
    mockState.insertResolver = () => ({
      data: null,
      error: {
        code: "42501",
        message:
          "POSTGRES_DETAIL_LEAK: permission denied; check SUPABASE_SERVICE_ROLE_KEY and run NOTIFY pgrst, 'reload schema'",
        details: "secret internal schema detail",
        hint: "internal hint",
      },
    });

    const resDbErr = await adminActionsPost(
      makeJsonPost("http://localhost:3000/api/admin/actions", {
        action: "create_company",
        payload: { name: "Test Corp", company_code: "TEST01" },
      })
    );
    expect(resDbErr.status).toBe(500);
    const bodyDbErr = JSON.stringify(await resDbErr.json());
    expect(bodyDbErr).not.toContain("POSTGRES_DETAIL_LEAK");
    expect(bodyDbErr).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(bodyDbErr).not.toContain("NOTIFY pgrst");
    expect(bodyDbErr).not.toContain("42501");

    // 2) 未捕捉例外（catch 節）での内部詳細非露出
    mockState.insertResolver = () => {
      throw new Error(
        "POSTGRES_DETAIL_LEAK SUPABASE_SERVICE_ROLE_KEY NOTIFY pgrst"
      );
    };
    const resThrown = await adminActionsPost(
      makeJsonPost("http://localhost:3000/api/admin/actions", {
        action: "create_company",
        payload: { name: "Test Corp 2", company_code: "TEST02" },
      })
    );
    expect(resThrown.status).toBe(500);
    const bodyThrown = JSON.stringify(await resThrown.json());
    expect(bodyThrown).not.toContain("POSTGRES_DETAIL_LEAK");
    expect(bodyThrown).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(bodyThrown).not.toContain("NOTIFY pgrst");
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});

// =============================================================================
// 5. APP-M7: 初期パスワード自動生成＆強度ポリシー強化
// =============================================================================
describe("APP-M7: 初期パスワード自動生成＆強度ポリシー検証", () => {
  it("M7-01: generateSecureInitialPassword()を複数回実行し毎回異なる14文字かつ英大・小・数字・記号をすべて含む", () => {
    const generated = new Set<string>();
    const iterations = 50;

    for (let i = 0; i < iterations; i++) {
      const pw = generateSecureInitialPassword();
      expect(pw.length).toBe(14);
      expect(/[A-Z]/.test(pw)).toBe(true);
      expect(/[a-z]/.test(pw)).toBe(true);
      expect(/[0-9]/.test(pw)).toBe(true);
      expect(/[^A-Za-z0-9]/.test(pw)).toBe(true);
      expect(validatePasswordStrength(pw).valid).toBe(true);
      generated.add(pw);
    }

    expect(generated.size).toBe(iterations);
  });

  it("M7-02: validatePasswordStrengthが9文字以下・2文字種以下・前後空白ありを拒否し10文字以上・3種以上を許可する", () => {
    // 拒否ケース
    expect(validatePasswordStrength("").valid).toBe(false);
    expect(validatePasswordStrength("Ab1!56789").valid).toBe(false); // 9文字
    expect(validatePasswordStrength("abcdefgh12").valid).toBe(false); // 2文字種（小文字+数字）
    expect(validatePasswordStrength("ABCDEFGH12").valid).toBe(false); // 2文字種（大文字+数字）
    expect(validatePasswordStrength(" Abcdefg123").valid).toBe(false); // 先頭空白
    expect(validatePasswordStrength("Abcdefg123 ").valid).toBe(false); // 末尾空白
    expect(validatePasswordStrength("A".repeat(125) + "a1!a").valid).toBe(
      false
    ); // 129文字

    // 許可ケース
    expect(validatePasswordStrength("Abcdefgh12").valid).toBe(true); // 10文字・3種（大+小+数）
    expect(validatePasswordStrength("Abcdefgh!@").valid).toBe(true); // 10文字・3種（大+小+記）
    expect(validatePasswordStrength("Abcdef12!@").valid).toBe(true); // 10文字・4種
  });

  it("M7-03: create_company / reset_company_manager_passwordで弱いPWは400、未指定create_companyはgeneratedPasswordとCache-Control: no-storeを返す", async () => {
    enableSupabaseEnv(true);
    mockState.authUser = { id: "admin-m7", email: "admin@example.com" };
    mockState.tableResolver = (table) => {
      if (table === "profiles") {
        return {
          data: {
            id: "admin-m7",
            email: "admin@example.com",
            full_name: "管理者",
            role: "admin",
            company_id: null,
          },
          error: null,
        };
      }
      return { data: null, error: null };
    };

    // 1) create_company で弱いPW → 400
    const resWeakCreate = await adminActionsPost(
      makeJsonPost("http://localhost:3000/api/admin/actions", {
        action: "create_company",
        payload: {
          name: "Weak PW Corp",
          company_code: "WEAK01",
          contact_email: "mgr@weak.example.com",
          initial_password: "weak123",
        },
      })
    );
    expect(resWeakCreate.status).toBe(400);

    // 2) reset_company_manager_password で弱いPW → 400
    const resWeakReset = await adminActionsPost(
      makeJsonPost("http://localhost:3000/api/admin/actions", {
        action: "reset_company_manager_password",
        payload: {
          managerId: "mgr-1",
          email: "mgr@weak.example.com",
          newPassword: "password12", // 2文字種のみ
        },
      })
    );
    expect(resWeakReset.status).toBe(400);

    // 3) create_company で initial_password 未指定 → 自動生成PW + Cache-Control: no-store
    mockState.insertResolver = (table) => {
      if (table === "companies") {
        return {
          data: {
            id: "comp-new-1",
            name: "Auto PW Corp",
            company_code: "AUTO01",
            contact_email: "mgr@auto.example.com",
          },
          error: null,
        };
      }
      return { data: null, error: null };
    };

    const resAuto = await adminActionsPost(
      makeJsonPost("http://localhost:3000/api/admin/actions", {
        action: "create_company",
        payload: {
          name: "Auto PW Corp",
          company_code: "AUTO01",
          contact_email: "mgr@auto.example.com",
        },
      })
    );
    expect(resAuto.status).toBe(200);
    expect(resAuto.headers.get("cache-control")).toBe("no-store");

    const jsonAuto = await resAuto.json();
    expect(jsonAuto.ok).toBe(true);
    expect(jsonAuto.accountCreated).toBe(true);
    expect(typeof jsonAuto.generatedPassword).toBe("string");
    expect(jsonAuto.generatedPassword.length).toBe(14);
    expect(validatePasswordStrength(jsonAuto.generatedPassword).valid).toBe(
      true
    );

    // 監査ログに生成パスワードが平文で記録されていないこと
    const auditInserts = mockState.insertedRows.filter(
      (r) => r.table === "audit_logs"
    );
    expect(auditInserts.length).toBeGreaterThan(0);
    expect(JSON.stringify(auditInserts)).not.toContain(
      jsonAuto.generatedPassword
    );
  });
});

// =============================================================================
// 6. APP-L4: POST /api/student/questions の company_id=null 時 ACME社フォールバック廃止
// =============================================================================
describe("APP-L4: POST /api/student/questions company_id=null時の他社フォールバック廃止", () => {
  it("L4-01: Supabase有効・profile.company_id=nullの受講生が質問送信してもACME社UUIDへフォールバックせずgetCompanySlackSettingsFromDbが呼ばれない", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    enableSupabaseEnv(true);
    delete process.env.SLACK_BOT_TOKEN;
    delete process.env.SLACK_DEFAULT_QUESTION_CHANNEL_ID;

    mockState.authUser = { id: "solo-student-1", email: "solo@example.com" };
    mockState.tableResolver = (table) => {
      if (table === "profiles") {
        return {
          data: {
            id: "solo-student-1",
            email: "solo@example.com",
            full_name: "個人受講生",
            role: "student",
            company_id: null,
            companies: null,
          },
          error: null,
        };
      }
      return { data: null, error: null };
    };
    mockState.insertResolver = (table) => {
      if (table === "student_questions") {
        return { data: { id: "q-solo-1" }, error: null };
      }
      return { data: null, error: null };
    };

    const res = await studentQuestionsPost(
      makeJsonPost("http://localhost:3000/api/student/questions", {
        problemId: "prob-1",
        problemTitle: "変数と型",
        questionText: "個人受講生からの質問です",
      })
    );

    expect(res.status).toBe(200);
    expect(mockGetCompanySlackSettingsFromDb).not.toHaveBeenCalled();
    expect(mockSendSlackQuestionAlert).not.toHaveBeenCalled();
    expect(mockPostSlackBotQuestion).not.toHaveBeenCalled();

    // student_questions へ company_id: null で保存されていること（ACME社UUID混入なし）
    const qInsert = mockState.insertedRows.find(
      (r) => r.table === "student_questions"
    );
    expect(qInsert).toBeDefined();
    expect((qInsert?.payload as Record<string, unknown>).company_id).toBeNull();
    expect(JSON.stringify(qInsert?.payload)).not.toContain(
      "00000000-0000-4000-8000-000000000001"
    );
    expect(warnSpy).toHaveBeenCalled();
  });
});

// =============================================================================
// 7. DB-H4 / DB-H5 / DB-H6 / DB-H7 / DB-H8: マイグレーションSQL静的検証・定数検証・audit-log.ts
// =============================================================================
describe("DB-H4 / DB-H5 / DB-H6 / DB-H7 / DB-H8: DBマイグレーション・安全カラム定数・監査ログ検証", () => {
  it("DB-01: 20261125000002_p1_security_hardening.sqlに全5課題の必須DDL・RLS・列権限が含まれる", () => {
    const sqlPath = path.resolve(
      process.cwd(),
      "supabase/migrations/20261125000002_p1_security_hardening.sql"
    );
    expect(fs.existsSync(sqlPath)).toBe(true);
    const sql = fs.readFileSync(sqlPath, "utf8");

    // DB-H4: companies の REVOKE SELECT + 安全5列の GRANT SELECT（Webhook列・contact_email 除外）
    expect(sql).toMatch(
      /REVOKE\s+SELECT\s+ON\s+TABLE\s+public\.companies\s+FROM\s+PUBLIC,\s*anon,\s*authenticated/i
    );
    const companiesGrantMatch = sql.match(
      /GRANT\s+SELECT\s*\(([^)]*)\)\s*ON\s+TABLE\s+public\.companies\s+TO\s+authenticated/i
    );
    expect(companiesGrantMatch).not.toBeNull();
    const grantedCompanyCols = companiesGrantMatch![1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    expect(grantedCompanyCols).toEqual([
      "id",
      "name",
      "company_code",
      "delay_alert_days",
      "created_at",
    ]);
    expect(grantedCompanyCols).not.toContain("slack_webhook_url");
    expect(grantedCompanyCols).not.toContain("question_slack_webhook_url");
    expect(grantedCompanyCols).not.toContain("contact_email");

    // DB-H5: audit_logs の REVOKE INSERT + ポリシー削除
    expect(sql).toMatch(
      /DROP\s+POLICY\s+IF\s+EXISTS\s+"Authenticated insert audit_logs"\s+ON\s+public\.audit_logs/i
    );
    expect(sql).toMatch(
      /REVOKE\s+INSERT\s+ON\s+TABLE\s+public\.audit_logs\s+FROM\s+PUBLIC,\s*anon,\s*authenticated/i
    );

    // DB-H6: qa-attachments の public = false + 全開放ポリシー削除
    expect(sql).toMatch(
      /UPDATE\s+storage\.buckets[\s\S]*?SET\s+public\s*=\s*false[\s\S]*?WHERE\s+id\s*=\s*'qa-attachments'/i
    );
    expect(sql).toMatch(
      /DROP\s+POLICY\s+IF\s+EXISTS\s+"Public read qa-attachments"\s+ON\s+storage\.objects/i
    );

    // DB-H7: graduation_evaluations の s.role = 'student' & student_question_replies の image_urls (JSONB) 空制約
    expect(sql).toContain("s.role = 'student'");
    expect(sql).toContain("jsonb_typeof(image_urls) = 'array'");
    expect(sql).toContain("jsonb_array_length(image_urls) = 0");
    expect(sql).not.toMatch(/\barray_length\s*\(/i);
    expect(sql).toContain("sender_role = 'student'");

    // DB-H8: problems 安全12列（solution_code 除外）および TO authenticated
    expect(sql).toMatch(
      /REVOKE\s+SELECT\s+ON\s+TABLE\s+public\.problems\s+FROM\s+PUBLIC,\s*anon,\s*authenticated/i
    );
    const problemsGrantMatch = sql.match(
      /GRANT\s+SELECT\s*\(([^)]*)\)\s*ON\s+TABLE\s+public\.problems\s+TO\s+authenticated/i
    );
    expect(problemsGrantMatch).not.toBeNull();
    const grantedProblemCols = problemsGrantMatch![1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    expect(grantedProblemCols).toHaveLength(12);
    expect(grantedProblemCols).not.toContain("solution_code");

    for (const policyName of [
      "courses_select",
      "chapters_select",
      "lessons_select",
      "problems_select",
      "announcements_select",
    ]) {
      const policyRegex = new RegExp(
        `CREATE\\s+POLICY\\s+"${policyName}"[\\s\\S]*?TO\\s+authenticated`,
        "i"
      );
      expect(sql).toMatch(policyRegex);
    }
  });

  it("DB-02: COMPANY_PUBLIC_COLUMNS（安全5列）にWebhook列/contact_emailが含まれず、PROBLEM_STUDENT_COLUMNS（安全12列）にsolution_codeが含まれない", () => {
    const companyCols = COMPANY_PUBLIC_COLUMNS.split(",").map((c) => c.trim());
    expect(companyCols).toHaveLength(5);
    expect(companyCols).toEqual([
      "id",
      "name",
      "company_code",
      "delay_alert_days",
      "created_at",
    ]);
    expect(companyCols).not.toContain("slack_webhook_url");
    expect(companyCols).not.toContain("question_slack_webhook_url");
    expect(companyCols).not.toContain("contact_email");

    const problemCols = PROBLEM_STUDENT_COLUMNS.split(",").map((c) => c.trim());
    expect(problemCols).toHaveLength(12);
    expect(problemCols).not.toContain("solution_code");
  });

  it("DB-03: 本番設定のrecordAuditLogがインメモリ__demoAuditLogsへ書き込まず、SUPABASE_SERVICE_ROLE_KEY未設定時にconsole.errorで検知ログを出力する", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // 事前状態をクリア
    globalThis.__demoAuditLogs = undefined;

    // 1) 本番 + Supabase有効 + SUPABASE_SERVICE_ROLE_KEY 未設定
    setNodeEnv("production");
    enableSupabaseEnv(false);

    await recordAuditLog({
      actorId: "admin-1",
      actorEmail: "admin@example.com",
      actorRole: "admin",
      action: "test_prod_missing_key",
      targetSummary: "テスト監査ログ",
    });

    expect(globalThis.__demoAuditLogs).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("SUPABASE_SERVICE_ROLE_KEY is missing"),
      expect.objectContaining({
        action: "test_prod_missing_key",
        actorRole: "admin",
      })
    );
    expect(
      mockState.insertedRows.filter((r) => r.table === "audit_logs")
    ).toHaveLength(0);

    // 2) 本番 + Supabase有効 + SUPABASE_SERVICE_ROLE_KEY 設定あり → service_role で insert され、__demoAuditLogs には書き込まない
    consoleErrorSpy.mockClear();
    enableSupabaseEnv(true);

    await recordAuditLog({
      actorId: "admin-1",
      actorEmail: "admin@example.com",
      actorRole: "admin",
      action: "test_prod_with_key",
      targetSummary: "本番監査ログ記録テスト",
    });

    expect(globalThis.__demoAuditLogs).toBeUndefined();
    const auditInserts = mockState.insertedRows.filter(
      (r) => r.table === "audit_logs"
    );
    expect(auditInserts).toHaveLength(1);
    expect((auditInserts[0].payload as Record<string, unknown>).action).toBe(
      "test_prod_with_key"
    );
  });
});
