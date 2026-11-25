import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

// =============================================================================
// モック制御用状態（各テストケースから動的に挙動を切り替え）
// =============================================================================
type MockQueryResult = { data: unknown; error: unknown };

interface MockSupabaseState {
  authUser: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  } | null;
  authError: unknown;
  signInError: unknown;
  signOutMock: ReturnType<typeof vi.fn>;
  /** テーブル名ごとのクエリ応答ハンドラ（(table, filters) => MockQueryResult） */
  tableResolver: (
    table: string,
    filters: Record<string, unknown>,
    selectCols?: string
  ) => MockQueryResult;
}

const mockState: MockSupabaseState = {
  authUser: null,
  authError: null,
  signInError: null,
  signOutMock: vi.fn().mockResolvedValue({ error: null }),
  tableResolver: () => ({ data: null, error: null }),
};

function createMockSupabaseClient() {
  return {
    auth: {
      getUser: vi.fn(async () => ({
        data: { user: mockState.authUser },
        error: mockState.authError,
      })),
      signInWithPassword: vi.fn(async () => ({
        data: { user: mockState.signInError ? null : mockState.authUser },
        error: mockState.signInError,
      })),
      signOut: mockState.signOutMock,
    },
    from: vi.fn((table: string) => {
      const filters: Record<string, unknown> = {};
      let selectCols: string | undefined;

      const builder = {
        select: vi.fn((cols?: string) => {
          selectCols = cols;
          return builder;
        }),
        eq: vi.fn((col: string, val: unknown) => {
          filters[col] = val;
          return builder;
        }),
        maybeSingle: vi.fn(async () =>
          mockState.tableResolver(table, filters, selectCols)
        ),
        single: vi.fn(async () =>
          mockState.tableResolver(table, filters, selectCols)
        ),
        update: vi.fn(() => builder),
        insert: vi.fn(() => builder),
        upsert: vi.fn(async () => ({ data: null, error: null })),
        delete: vi.fn(() => builder),
        then: (
          resolve: (value: MockQueryResult) => void,
          reject?: (reason: unknown) => void
        ) => {
          Promise.resolve(mockState.tableResolver(table, filters, selectCols)).then(
            resolve,
            reject
          );
        },
      };
      return builder;
    }),
  };
}

const mockGetCoursesWithProgress = vi.fn();
const mockSendCompanyDigestMessage = vi.fn().mockResolvedValue({ ok: true });
const mockSendSlackTestMessage = vi.fn().mockResolvedValue({ ok: true });

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => createMockSupabaseClient()),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(() => createMockSupabaseClient()),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => createMockSupabaseClient()),
}));

vi.mock("@/lib/data-service", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/data-service")>();
  return {
    ...actual,
    getCoursesWithProgress: (...args: unknown[]) =>
      mockGetCoursesWithProgress(...args),
  };
});

vi.mock("@/lib/audit-log", () => ({
  recordAuditLog: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/slack", () => ({
  sendCompanyDigestMessage: (...args: unknown[]) =>
    mockSendCompanyDigestMessage(...args),
  sendSlackTestMessage: (...args: unknown[]) => mockSendSlackTestMessage(...args),
}));

// モック宣言後にテスト対象をインポート
import { POST as adminActionsPost } from "@/app/api/admin/actions/route";
import { POST as secureLoginPost } from "@/app/api/auth/secure-login/route";
import { GET as sessionGet } from "@/app/api/auth/session/route";
import { POST as problemsSubmitPost } from "@/app/api/problems/submit/route";
import { middleware } from "@/middleware";
import { requireApiAuth } from "@/lib/api-auth";
import { loginAttemptsMap } from "@/lib/login-attempts";
import { SEED_COURSE_ID, SEED_PROBLEMS } from "@/lib/seed-data";

// =============================================================================
// 共通ヘルパー
// =============================================================================
const COMPANY_A_ID = "00000000-0000-4000-8000-000000000001";
const COMPANY_B_ID = "00000000-0000-4000-8000-000000000002";
const STUDENT_B_ID = "11111111-1111-4000-8000-000000000002";
const MANAGER_A_ID = "22222222-2222-4000-8000-000000000001";
const MANAGER_NULL_COMPANY_ID = "22222222-2222-4000-8000-000000000099";

const savedEnv: Record<string, string | undefined> = {};
const ENV_KEYS = [
  "NODE_ENV",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_GATE_KEY",
  "COMPANY_GATE_KEY",
  "ADMIN_MASTER_PIN",
] as const;

function setNodeEnv(val: string | undefined) {
  (process.env as Record<string, string | undefined>).NODE_ENV = val;
}

function enableSupabaseEnv() {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://p0-test-project.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "p0-test-anon-key";
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
}

function disableSupabaseEnv() {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
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
  loginAttemptsMap.clear();
  mockState.authUser = null;
  mockState.authError = null;
  mockState.signInError = null;
  mockState.signOutMock = vi.fn().mockResolvedValue({ error: null });
  mockState.tableResolver = () => ({ data: null, error: null });
  mockGetCoursesWithProgress.mockReset();
  mockSendCompanyDigestMessage.mockClear();
  mockSendSlackTestMessage.mockClear();
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (savedEnv[key] === undefined) {
      delete (process.env as Record<string, string | undefined>)[key];
    } else {
      (process.env as Record<string, string | undefined>)[key] = savedEnv[key];
    }
  }
});

// =============================================================================
// 1. APP-H1: POST /api/admin/actions
// =============================================================================
describe("APP-H1: POST /api/admin/actions 認証・認可・テナント分離・Fail-Closed", () => {
  it("H1-01: 本番(NODE_ENV=production)＋Supabase未設定は503でFail-Closed（デモ処理・Slack送信されない）", async () => {
    setNodeEnv("production");
    disableSupabaseEnv();

    const res = await adminActionsPost(
      makeJsonPost("http://localhost:3000/api/admin/actions", {
        action: "test_slack_notification",
        payload: {
          webhookUrl: "https://hooks.slack.com/services/T00/B00/XXX",
          companyName: "Evil",
        },
      })
    );
    expect(res.status).toBe(503);
    expect(mockSendSlackTestMessage).not.toHaveBeenCalled();
  });

  it("H1-02: Supabase有効・未認証リクエストは401を返す", async () => {
    enableSupabaseEnv();
    mockState.authUser = null;

    const res = await adminActionsPost(
      makeJsonPost("http://localhost:3000/api/admin/actions", {
        action: "create_course",
        payload: { title: "Test" },
      })
    );
    expect(res.status).toBe(401);
  });

  it("H1-03: 認証済みだがprofiles欠落（user_metadata.role='admin'偽装）は403でFail-Closed", async () => {
    enableSupabaseEnv();
    mockState.authUser = {
      id: "attacker-no-profile",
      email: "admin@example.com",
      user_metadata: { role: "admin" },
    };
    mockState.tableResolver = () => ({ data: null, error: null });

    const res = await adminActionsPost(
      makeJsonPost("http://localhost:3000/api/admin/actions", {
        action: "create_course",
        payload: { title: "Unauthorized Course" },
      })
    );
    expect(res.status).toBe(403);
  });

  it("H1-04: profiles.role='student'は403で拒否される", async () => {
    enableSupabaseEnv();
    mockState.authUser = {
      id: "student-1",
      email: "student@example.com",
      user_metadata: { role: "admin" },
    };
    mockState.tableResolver = (table) => {
      if (table === "profiles") {
        return {
          data: {
            id: "student-1",
            email: "student@example.com",
            full_name: "受講生",
            role: "student",
            company_id: COMPANY_A_ID,
          },
          error: null,
        };
      }
      return { data: null, error: null };
    };

    const res = await adminActionsPost(
      makeJsonPost("http://localhost:3000/api/admin/actions", {
        action: "create_feedback",
        payload: { student_id: STUDENT_B_ID, rating: 5, comment: "hack" },
      })
    );
    expect(res.status).toBe(403);
  });

  it("H1-05: profiles.role='company'でadmin専用アクション(create_company, create_course)は403", async () => {
    enableSupabaseEnv();
    mockState.authUser = { id: MANAGER_A_ID, email: "mgr@company-a.example.com" };
    mockState.tableResolver = (table) => {
      if (table === "profiles") {
        return {
          data: {
            id: MANAGER_A_ID,
            email: "mgr@company-a.example.com",
            full_name: "A社担当者",
            role: "company",
            company_id: COMPANY_A_ID,
          },
          error: null,
        };
      }
      return { data: null, error: null };
    };

    const resCompany = await adminActionsPost(
      makeJsonPost("http://localhost:3000/api/admin/actions", {
        action: "create_company",
        payload: { name: "New Corp", company_code: "NEW1" },
      })
    );
    expect(resCompany.status).toBe(403);

    const resCourse = await adminActionsPost(
      makeJsonPost("http://localhost:3000/api/admin/actions", {
        action: "create_course",
        payload: { title: "Forbidden Course" },
      })
    );
    expect(resCourse.status).toBe(403);
  });

  it("H1-06: profiles.role='company'かつcompany_id=nullで許可6アクション主要4種すべて403（null===null迂回禁止）", async () => {
    enableSupabaseEnv();
    mockState.authUser = {
      id: MANAGER_NULL_COMPANY_ID,
      email: "orphan-mgr@example.com",
    };
    mockState.tableResolver = (table, filters) => {
      if (table === "profiles") {
        if (filters.id === MANAGER_NULL_COMPANY_ID) {
          return {
            data: {
              id: MANAGER_NULL_COMPANY_ID,
              email: "orphan-mgr@example.com",
              full_name: "所属未設定担当者",
              role: "company",
              company_id: null,
            },
            error: null,
          };
        }
        // 対象受講生も company_id=null（旧実装で null !== null が false になり迂回できたケース）
        return {
          data: {
            id: STUDENT_B_ID,
            email: "orphan-st@example.com",
            full_name: "所属未設定受講生",
            role: "student",
            company_id: null,
          },
          error: null,
        };
      }
      return { data: null, error: null };
    };

    const r1 = await adminActionsPost(
      makeJsonPost("http://localhost:3000/api/admin/actions", {
        action: "create_feedback",
        payload: { student_id: STUDENT_B_ID, rating: 4, comment: "test" },
      })
    );
    expect(r1.status).toBe(403);

    const r2 = await adminActionsPost(
      makeJsonPost("http://localhost:3000/api/admin/actions", {
        action: "set_student_course_lock",
        payload: { userId: STUDENT_B_ID, courseId: SEED_COURSE_ID, status: "locked" },
      })
    );
    expect(r2.status).toBe(403);

    const r3 = await adminActionsPost(
      makeJsonPost("http://localhost:3000/api/admin/actions", {
        action: "delete_student",
        payload: { studentId: STUDENT_B_ID },
      })
    );
    expect(r3.status).toBe(403);

    const r4 = await adminActionsPost(
      makeJsonPost("http://localhost:3000/api/admin/actions", {
        action: "send_slack_digest",
        payload: {
          companyId: null,
          webhookUrl: "https://hooks.slack.com/services/T00/B00/EVIL",
        },
      })
    );
    expect(r4.status).toBe(403);
    expect(mockSendCompanyDigestMessage).not.toHaveBeenCalled();
  });

  it("H1-07: profiles.role='company'(A社)でB社受講生へのcreate_feedback/set_student_course_lock/delete_studentおよびB社send_slack_digestはすべて403", async () => {
    enableSupabaseEnv();
    mockState.authUser = { id: MANAGER_A_ID, email: "mgr@company-a.example.com" };
    mockState.tableResolver = (table, filters) => {
      if (table === "profiles") {
        if (filters.id === MANAGER_A_ID) {
          return {
            data: {
              id: MANAGER_A_ID,
              email: "mgr@company-a.example.com",
              full_name: "A社担当者",
              role: "company",
              company_id: COMPANY_A_ID,
            },
            error: null,
          };
        }
        if (filters.id === STUDENT_B_ID) {
          return {
            data: {
              id: STUDENT_B_ID,
              email: "student-b@company-b.example.com",
              full_name: "B社受講生",
              role: "student",
              company_id: COMPANY_B_ID,
            },
            error: null,
          };
        }
      }
      return { data: null, error: null };
    };

    const rFeedback = await adminActionsPost(
      makeJsonPost("http://localhost:3000/api/admin/actions", {
        action: "create_feedback",
        payload: { student_id: STUDENT_B_ID, rating: 3, comment: "cross-tenant" },
      })
    );
    expect(rFeedback.status).toBe(403);

    const rLock = await adminActionsPost(
      makeJsonPost("http://localhost:3000/api/admin/actions", {
        action: "set_student_course_lock",
        payload: { userId: STUDENT_B_ID, courseId: SEED_COURSE_ID, status: "locked" },
      })
    );
    expect(rLock.status).toBe(403);

    const rDelete = await adminActionsPost(
      makeJsonPost("http://localhost:3000/api/admin/actions", {
        action: "delete_student",
        payload: { studentId: STUDENT_B_ID },
      })
    );
    expect(rDelete.status).toBe(403);

    const rSlack = await adminActionsPost(
      makeJsonPost("http://localhost:3000/api/admin/actions", {
        action: "send_slack_digest",
        payload: {
          companyId: COMPANY_B_ID,
          webhookUrl: "https://hooks.slack.com/services/T00/B00/EVIL",
        },
      })
    );
    expect(rSlack.status).toBe(403);
    expect(mockSendCompanyDigestMessage).not.toHaveBeenCalled();
  });

  it("H1-08: create_feedbackで対象がrole='company'（非student）の場合は400を返す", async () => {
    enableSupabaseEnv();
    const OTHER_MANAGER_ID = "22222222-2222-4000-8000-000000000005";
    mockState.authUser = { id: MANAGER_A_ID, email: "mgr@company-a.example.com" };
    mockState.tableResolver = (table, filters) => {
      if (table === "profiles") {
        if (filters.id === MANAGER_A_ID) {
          return {
            data: {
              id: MANAGER_A_ID,
              email: "mgr@company-a.example.com",
              full_name: "A社担当者",
              role: "company",
              company_id: COMPANY_A_ID,
            },
            error: null,
          };
        }
        if (filters.id === OTHER_MANAGER_ID) {
          return {
            data: {
              id: OTHER_MANAGER_ID,
              role: "company",
              company_id: COMPANY_A_ID,
            },
            error: null,
          };
        }
      }
      return { data: null, error: null };
    };

    const res = await adminActionsPost(
      makeJsonPost("http://localhost:3000/api/admin/actions", {
        action: "create_feedback",
        payload: { student_id: OTHER_MANAGER_ID, rating: 5, comment: "not student" },
      })
    );
    expect(res.status).toBe(400);
  });

  it("H1-09: send_slack_digest(companyロール)でクライアント任意webhookUrlを送ってもDB未設定なら400で送信されない", async () => {
    enableSupabaseEnv();
    mockState.authUser = { id: MANAGER_A_ID, email: "mgr@company-a.example.com" };
    mockState.tableResolver = (table, filters) => {
      if (table === "profiles" && filters.id === MANAGER_A_ID) {
        return {
          data: {
            id: MANAGER_A_ID,
            email: "mgr@company-a.example.com",
            full_name: "A社担当者",
            role: "company",
            company_id: COMPANY_A_ID,
          },
          error: null,
        };
      }
      if (table === "companies" && filters.id === COMPANY_A_ID) {
        return {
          data: {
            name: "ACME社",
            slack_webhook_url: null,
            slack_channel_name: null,
          },
          error: null,
        };
      }
      return { data: null, error: null };
    };

    const res = await adminActionsPost(
      makeJsonPost("http://localhost:3000/api/admin/actions", {
        action: "send_slack_digest",
        payload: {
          companyId: COMPANY_A_ID,
          webhookUrl: "https://attacker.example.com/exfiltrate",
          companyName: "ACME社",
        },
      })
    );
    expect(res.status).toBe(400);
    expect(mockSendCompanyDigestMessage).not.toHaveBeenCalled();
  });
});

// =============================================================================
// 2. APP-H2: secure-login / middleware / api-auth / session
// =============================================================================
describe("APP-H2: secure-login / middleware / api-auth / session のハードニングとDB正本化", () => {
  it("H2-01: 本番＋ADMIN_GATE_KEY未設定でadminログインは503（ハードコードキー通過不可）", async () => {
    setNodeEnv("production");
    enableSupabaseEnv();
    delete process.env.ADMIN_GATE_KEY;
    process.env.ADMIN_MASTER_PIN = "999999";

    const res = await secureLoginPost(
      makeJsonPost(
        "http://localhost:3000/api/auth/secure-login",
        {
          email: "admin@example.com",
          password: "Password123!",
          expectedRole: "admin",
          adminPin: "999999",
          gateKey: "dss-admin-gate-2025",
        },
        { cookie: "dss_admin_gate=dss-admin-gate-2025" }
      )
    );
    expect(res.status).toBe(503);
  });

  it("H2-02: 本番＋COMPANY_GATE_KEY未設定でcompanyログインは503（ハードコードキー通過不可）", async () => {
    setNodeEnv("production");
    enableSupabaseEnv();
    delete process.env.COMPANY_GATE_KEY;

    const res = await secureLoginPost(
      makeJsonPost(
        "http://localhost:3000/api/auth/secure-login",
        {
          email: "company@example.com",
          password: "Password123!",
          expectedRole: "company",
          companyCode: "ACME2025",
          gateKey: "dss-corp-gate-2025",
        },
        { cookie: "dss_company_gate=dss-corp-gate-2025" }
      )
    );
    expect(res.status).toBe(503);
  });

  it("H2-03: 本番＋ADMIN_MASTER_PIN未設定でadminログインは503（ハードコードPIN通過不可）", async () => {
    setNodeEnv("production");
    enableSupabaseEnv();
    process.env.ADMIN_GATE_KEY = "prod-admin-gate-secret";
    delete process.env.ADMIN_MASTER_PIN;

    const res = await secureLoginPost(
      makeJsonPost(
        "http://localhost:3000/api/auth/secure-login",
        {
          email: "admin@example.com",
          password: "Password123!",
          expectedRole: "admin",
          adminPin: "778899",
          gateKey: "prod-admin-gate-secret",
        },
        { cookie: "dss_admin_gate=prod-admin-gate-secret" }
      )
    );
    expect(res.status).toBe(503);
  });

  it("H2-04: 本番＋Supabase未設定でsecure-login(student/company/admin)はすべて503", async () => {
    setNodeEnv("production");
    disableSupabaseEnv();
    process.env.ADMIN_GATE_KEY = "prod-admin-gate-secret";
    process.env.COMPANY_GATE_KEY = "prod-company-gate-secret";
    process.env.ADMIN_MASTER_PIN = "123456";

    const rStudent = await secureLoginPost(
      makeJsonPost("http://localhost:3000/api/auth/secure-login", {
        email: "st@example.com",
        password: "Password123!",
        expectedRole: "student",
      })
    );
    expect(rStudent.status).toBe(503);

    const rCompany = await secureLoginPost(
      makeJsonPost(
        "http://localhost:3000/api/auth/secure-login",
        {
          email: "co@example.com",
          password: "Password123!",
          expectedRole: "company",
          companyCode: "ACME2025",
        },
        { cookie: "dss_company_gate=prod-company-gate-secret" }
      )
    );
    expect(rCompany.status).toBe(503);

    const rAdmin = await secureLoginPost(
      makeJsonPost(
        "http://localhost:3000/api/auth/secure-login",
        {
          email: "ad@example.com",
          password: "Password123!",
          expectedRole: "admin",
          adminPin: "123456",
        },
        { cookie: "dss_admin_gate=prod-admin-gate-secret" }
      )
    );
    expect(rAdmin.status).toBe(503);
  });

  it("H2-05: profiles.role='student'かつuser_metadata.role='admin'でadminログインは403かつsignOut()呼び出し", async () => {
    enableSupabaseEnv();
    process.env.ADMIN_GATE_KEY = "test-admin-gate";
    process.env.ADMIN_MASTER_PIN = "654321";

    mockState.authUser = {
      id: "spoof-student-id",
      email: "student@example.com",
      user_metadata: { role: "admin" },
    };
    mockState.tableResolver = (table) => {
      if (table === "profiles") {
        return {
          data: { role: "student", company_id: COMPANY_A_ID, companies: null },
          error: null,
        };
      }
      return { data: null, error: null };
    };

    const res = await secureLoginPost(
      makeJsonPost(
        "http://localhost:3000/api/auth/secure-login",
        {
          email: "student@example.com",
          password: "Password123!",
          expectedRole: "admin",
          adminPin: "654321",
        },
        { cookie: "dss_admin_gate=test-admin-gate" }
      )
    );
    expect(res.status).toBe(403);
    expect(mockState.signOutMock).toHaveBeenCalledTimes(1);
  });

  it("H2-06: profiles欠落かつemail='admin@example.com'かつuser_metadata.role='admin'は403（secure-login＆requireApiAuth）", async () => {
    enableSupabaseEnv();
    process.env.ADMIN_GATE_KEY = "test-admin-gate";
    process.env.ADMIN_MASTER_PIN = "654321";

    mockState.authUser = {
      id: "missing-profile-admin",
      email: "admin@example.com",
      user_metadata: { role: "admin" },
    };
    mockState.tableResolver = () => ({ data: null, error: null });

    const loginRes = await secureLoginPost(
      makeJsonPost(
        "http://localhost:3000/api/auth/secure-login",
        {
          email: "admin@example.com",
          password: "Password123!",
          expectedRole: "admin",
          adminPin: "654321",
        },
        { cookie: "dss_admin_gate=test-admin-gate" }
      )
    );
    expect(loginRes.status).toBe(403);
    expect(mockState.signOutMock).toHaveBeenCalledTimes(1);

    const apiAuth = await requireApiAuth(["admin"]);
    expect(apiAuth.ok).toBe(false);
    if (!apiAuth.ok) {
      expect(apiAuth.response.status).toBe(403);
    }
  });

  it("H2-07: companyログインでDB companies.company_code欠落（user_metadata.company_codeあり）は403かつsignOut()", async () => {
    enableSupabaseEnv();
    process.env.COMPANY_GATE_KEY = "test-company-gate";

    mockState.authUser = {
      id: MANAGER_A_ID,
      email: "company@example.com",
      user_metadata: { role: "company", company_code: "ACME2025" },
    };
    mockState.tableResolver = (table) => {
      if (table === "profiles") {
        return {
          data: {
            role: "company",
            company_id: COMPANY_A_ID,
            companies: { company_code: null },
          },
          error: null,
        };
      }
      return { data: null, error: null };
    };

    const res = await secureLoginPost(
      makeJsonPost(
        "http://localhost:3000/api/auth/secure-login",
        {
          email: "company@example.com",
          password: "Password123!",
          expectedRole: "company",
          companyCode: "ACME2025",
        },
        { cookie: "dss_company_gate=test-company-gate" }
      )
    );
    expect(res.status).toBe(403);
    expect(mockState.signOutMock).toHaveBeenCalledTimes(1);
  });

  it("H2-08: middlewareは本番＋Supabase未設定で/student, /company, /adminアクセスを503 JSONで遮断する", async () => {
    setNodeEnv("production");
    disableSupabaseEnv();

    for (const targetPath of ["/student", "/company", "/admin"]) {
      const res = await middleware(
        new NextRequest(`http://localhost:3000${targetPath}`)
      );
      expect(res.status).toBe(503);
      const json = await res.json();
      expect(typeof json.error).toBe("string");
      expect(json.error.length).toBeGreaterThan(0);
    }
  });

  it("H2-09: middlewareはprofiles.role='student'かつuser_metadata.role='admin'の/adminアクセスを/studentへ強制リダイレクトする", async () => {
    enableSupabaseEnv();
    mockState.authUser = {
      id: "student-spoof-mw",
      email: "admin@example.com",
      user_metadata: { role: "admin" },
    };
    mockState.tableResolver = (table) => {
      if (table === "profiles") {
        return { data: { role: "student" }, error: null };
      }
      return { data: null, error: null };
    };

    const res = await middleware(new NextRequest("http://localhost:3000/admin"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/student");
  });

  it("H2-10: GET /api/auth/sessionはprofiles欠落＋user_metadata.role='admin'時に{ authenticated: false }を返す", async () => {
    enableSupabaseEnv();
    mockState.authUser = {
      id: "missing-profile-session",
      email: "admin@example.com",
      user_metadata: { role: "admin" },
    };
    mockState.tableResolver = () => ({ data: null, error: null });

    const res = await sessionGet();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ authenticated: false });
  });
});

// =============================================================================
// 3. APP-H3: POST /api/problems/submit
// =============================================================================
describe("APP-H3: POST /api/problems/submit 認証・サイズ上限・パラメータ検証・Fail-Closedロック検証", () => {
  const sampleProblemId = SEED_PROBLEMS[0].id;

  it("H3-01: Supabase有効・未認証リクエストは401を返す", async () => {
    enableSupabaseEnv();
    mockState.authUser = null;

    const res = await problemsSubmitPost(
      makeJsonPost("http://localhost:3000/api/problems/submit", {
        problemId: sampleProblemId,
        code: "public class Main {}",
      })
    );
    expect(res.status).toBe(401);
  });

  it("H3-02: 本番(NODE_ENV=production)＋Supabase未設定は503でFail-Closed", async () => {
    setNodeEnv("production");
    disableSupabaseEnv();

    const res = await problemsSubmitPost(
      makeJsonPost("http://localhost:3000/api/problems/submit", {
        problemId: sampleProblemId,
        code: "public class Main {}",
      })
    );
    expect(res.status).toBe(503);
  });

  it("H3-03: codeサイズ境界値：65,536 bytes(UTF-8)は413にならず通過し、65,537 bytes(ASCII＆マルチバイト日本語)は413を返す", async () => {
    // 非本番・デモモードで境界値を直接検証（各リクエストでIPを変えてレート制限を回避）
    setNodeEnv("test");
    disableSupabaseEnv();

    // 1. ちょうど 65,536 bytes (ASCII) -> 413にならず通過(200)
    const exactAscii64k = " ".repeat(65536);
    expect(Buffer.byteLength(exactAscii64k, "utf8")).toBe(65536);
    const resAsciiOk = await problemsSubmitPost(
      makeJsonPost(
        "http://localhost:3000/api/problems/submit",
        { problemId: sampleProblemId, code: exactAscii64k },
        { "x-forwarded-for": "10.0.1.1" }
      )
    );
    expect(resAsciiOk.status).not.toBe(413);
    expect(resAsciiOk.status).toBe(200);

    // 2. ちょうど 65,536 bytes (日本語3バイト文字×21845 + "a" = 65536 bytes) -> 413にならず通過(200)
    const exactMb64k = "あ".repeat(21845) + "a";
    expect(Buffer.byteLength(exactMb64k, "utf8")).toBe(65536);
    const resMbOk = await problemsSubmitPost(
      makeJsonPost(
        "http://localhost:3000/api/problems/submit",
        { problemId: sampleProblemId, code: exactMb64k },
        { "x-forwarded-for": "10.0.1.2" }
      )
    );
    expect(resMbOk.status).not.toBe(413);
    expect(resMbOk.status).toBe(200);

    // 3. 65,537 bytes (ASCII) -> 413
    const overAscii = "a".repeat(65537);
    expect(Buffer.byteLength(overAscii, "utf8")).toBe(65537);
    const resAsciiOver = await problemsSubmitPost(
      makeJsonPost(
        "http://localhost:3000/api/problems/submit",
        { problemId: sampleProblemId, code: overAscii },
        { "x-forwarded-for": "10.0.1.3" }
      )
    );
    expect(resAsciiOver.status).toBe(413);

    // 4. 65,537 bytes (日本語マルチバイト：文字数は21847文字だがUTF-8バイト長は65,537 bytes) -> 413
    const overMb = "あ".repeat(21845) + "aa";
    expect(Buffer.byteLength(overMb, "utf8")).toBe(65537);
    const resMbOver = await problemsSubmitPost(
      makeJsonPost(
        "http://localhost:3000/api/problems/submit",
        { problemId: sampleProblemId, code: overMb },
        { "x-forwarded-for": "10.0.1.4" }
      )
    );
    expect(resMbOver.status).toBe(413);
  });

  it("H3-04: problemId空文字・129文字超過・code非文字列はすべて400を返す", async () => {
    setNodeEnv("test");
    disableSupabaseEnv();

    const rEmpty = await problemsSubmitPost(
      makeJsonPost("http://localhost:3000/api/problems/submit", {
        problemId: "   ",
        code: "public class Main {}",
      })
    );
    expect(rEmpty.status).toBe(400);

    const rTooLong = await problemsSubmitPost(
      makeJsonPost("http://localhost:3000/api/problems/submit", {
        problemId: "p".repeat(129),
        code: "public class Main {}",
      })
    );
    expect(rTooLong.status).toBe(400);

    const rNonStringCode = await problemsSubmitPost(
      makeJsonPost("http://localhost:3000/api/problems/submit", {
        problemId: sampleProblemId,
        code: 12345,
      })
    );
    expect(rNonStringCode.status).toBe(400);
  });

  it("H3-05: コースロック検証(getCoursesWithProgress)で例外発生時は握りつぶさず503を返す", async () => {
    enableSupabaseEnv();
    mockState.authUser = {
      id: "student-lock-err-1",
      email: "st1@example.com",
    };
    mockState.tableResolver = (table) => {
      if (table === "profiles") {
        return {
          data: {
            id: "student-lock-err-1",
            email: "st1@example.com",
            full_name: "受講生1",
            role: "student",
            company_id: COMPANY_A_ID,
          },
          error: null,
        };
      }
      return { data: null, error: null };
    };
    mockGetCoursesWithProgress.mockRejectedValueOnce(
      new Error("student_course_locks DB connection failed")
    );

    const res = await problemsSubmitPost(
      makeJsonPost("http://localhost:3000/api/problems/submit", {
        problemId: sampleProblemId,
        code: "public class Main {}",
      })
    );
    expect(res.status).toBe(503);
    expect(mockGetCoursesWithProgress).toHaveBeenCalledWith(
      "student-lock-err-1",
      COMPANY_A_ID,
      { throwOnError: true }
    );
  });

  it("H3-06: 対象コース非表示(!matchedCourse)またはロック中(isLocked=true)は403を返す", async () => {
    enableSupabaseEnv();

    // ケース1: 対象コースが非表示でリストに含まれない
    mockState.authUser = {
      id: "student-hidden-course",
      email: "st-hidden@example.com",
    };
    mockState.tableResolver = (table) => {
      if (table === "profiles") {
        return {
          data: {
            id: "student-hidden-course",
            email: "st-hidden@example.com",
            full_name: "受講生非表示",
            role: "student",
            company_id: COMPANY_A_ID,
          },
          error: null,
        };
      }
      return { data: null, error: null };
    };
    mockGetCoursesWithProgress.mockResolvedValueOnce([]);

    const resHidden = await problemsSubmitPost(
      makeJsonPost("http://localhost:3000/api/problems/submit", {
        problemId: sampleProblemId,
        code: "public class Main {}",
      })
    );
    expect(resHidden.status).toBe(403);

    // ケース2: 対象コースがロック中
    mockState.authUser = {
      id: "student-locked-course",
      email: "st-locked@example.com",
    };
    mockState.tableResolver = (table) => {
      if (table === "profiles") {
        return {
          data: {
            id: "student-locked-course",
            email: "st-locked@example.com",
            full_name: "受講生ロック中",
            role: "student",
            company_id: COMPANY_A_ID,
          },
          error: null,
        };
      }
      return { data: null, error: null };
    };
    mockGetCoursesWithProgress.mockResolvedValueOnce([
      {
        id: SEED_COURSE_ID,
        isLocked: true,
        lockReason: "企業担当者により手動ロックされています",
      },
    ]);

    const resLocked = await problemsSubmitPost(
      makeJsonPost("http://localhost:3000/api/problems/submit", {
        problemId: sampleProblemId,
        code: "public class Main {}",
      })
    );
    expect(resLocked.status).toBe(403);
    const lockedJson = await resLocked.json();
    expect(lockedJson.error).toContain("企業担当者により手動ロックされています");
  });
});

// =============================================================================
// 4. DB-H1 / DB-H2 / DB-H3: マイグレーションSQL静的検証
// =============================================================================
describe("DB-H1 / DB-H2 / DB-H3: 20261125000001_p0_security_hardening.sql 静的検証", () => {
  const migrationPath = path.resolve(
    process.cwd(),
    "supabase/migrations/20261125000001_p0_security_hardening.sql"
  );
  const sql = fs.readFileSync(migrationPath, "utf8");

  it("DB-H1-01: protect_profile_sensitive_columns()がSECURITY INVOKERで定義されSECURITY DEFINERでない", () => {
    const fnMatch = sql.match(
      /CREATE\s+OR\s+REPLACE\s+FUNCTION\s+public\.protect_profile_sensitive_columns\(\)[\s\S]*?\$\$\s*;/i
    );
    expect(fnMatch).not.toBeNull();
    const fnBody = fnMatch![0];
    expect(fnBody).toMatch(/SECURITY\s+INVOKER/i);
    expect(fnBody).not.toMatch(/SECURITY\s+DEFINER/i);
    expect(fnBody).toMatch(/ERRCODE\s*=\s*'42501'/i);
  });

  it("DB-H1-02: profiles_update_ownポリシーにWITH CHECKが含まれroleとcompany_idの変更を禁止している", () => {
    const policyMatch = sql.match(
      /CREATE\s+POLICY\s+"profiles_update_own"\s+ON\s+public\.profiles[\s\S]*?;/i
    );
    expect(policyMatch).not.toBeNull();
    const policySql = policyMatch![0];
    expect(policySql).toMatch(/TO\s+authenticated/i);
    expect(policySql).toMatch(/WITH\s+CHECK\s*\(/i);
    expect(policySql).toMatch(/role\s*=\s*public\.current_user_role\(\)/i);
    expect(policySql).toMatch(
      /company_id\s+IS\s+NOT\s+DISTINCT\s+FROM\s+public\.current_user_company_id\(\)/i
    );
  });

  it("DB-H2-01: handle_new_user()実行部にraw_user_meta_data->>'role'が含まれず'student'固定である", () => {
    const fnMatch = sql.match(
      /CREATE\s+OR\s+REPLACE\s+FUNCTION\s+public\.handle_new_user\(\)[\s\S]*?\$\$\s*;/i
    );
    expect(fnMatch).not.toBeNull();
    // SQLコメント行（-- ...）を除外して実行コード本体のみ検査
    const executableBody = fnMatch![0]
      .split(/\r?\n/)
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n");
    expect(executableBody).not.toMatch(/raw_user_meta_data\s*->>\s*'role'/i);
    expect(executableBody).toMatch(
      /VALUES\s*\(\s*NEW\.id\s*,\s*NEW\.email\s*,\s*v_full_name\s*,\s*'student'\s*,\s*v_company_id\s*\)/i
    );
  });

  it("DB-H3-01: REVOKE TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public FROM PUBLIC, anon, authenticated が含まれる", () => {
    expect(sql).toMatch(
      /REVOKE\s+TRUNCATE\s*,\s*REFERENCES\s*,\s*TRIGGER\s+ON\s+ALL\s+TABLES\s+IN\s+SCHEMA\s+public\s+FROM\s+PUBLIC\s*,\s*anon\s*,\s*authenticated\s*;/i
    );
  });

  it("DB-H3-02: audit_logsはauthenticatedに対してGRANT SELECT, INSERTのみが付与されている", () => {
    const sqlNoComments = sql
      .split(/\r?\n/)
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n");
    // まずREVOKE ALLの対象にaudit_logsが含まれること
    expect(sqlNoComments).toMatch(
      /REVOKE\s+ALL\s+ON\s+TABLE[\s\S]*?public\.audit_logs[\s\S]*?FROM\s+anon\s*,\s*authenticated\s*;/i
    );
    // audit_logs に対する GRANT 文を全抽出して確認（コメント行除外済）
    const auditGrants =
      sqlNoComments.match(/GRANT\s+[^;]*public\.audit_logs[^;]*;/gi) ?? [];
    expect(auditGrants.length).toBe(1);
    expect(auditGrants[0]).toMatch(
      /^GRANT\s+SELECT\s*,\s*INSERT\s+ON\s+TABLE\s+public\.audit_logs\s+TO\s+authenticated\s*;$/i
    );
    expect(auditGrants[0]).not.toMatch(/\b(UPDATE|DELETE|TRUNCATE|ALL)\b/i);
  });
});
