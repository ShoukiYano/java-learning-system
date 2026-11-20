/**
 * ファイル概要：
 * 監査ログ（ログイン履歴・PW変更・管理者CRUD・修了評価保存など）記録・取得ユーティリティ
 */

import { isSupabaseConfigured } from "@/lib/data-service";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export interface AuditLogEntry {
  id: string;
  actor_id?: string | null;
  actor_email?: string | null;
  actor_role: string;
  action: string;
  target_summary: string;
  detail_json?: Record<string, unknown>;
  created_at: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __demoAuditLogs: AuditLogEntry[] | undefined;
}

function getDemoStore(): AuditLogEntry[] {
  if (!globalThis.__demoAuditLogs) {
    globalThis.__demoAuditLogs = [
      {
        id: "audit-seed-1",
        actor_email: "admin@devskill.example.com",
        actor_role: "admin",
        action: "update_company",
        target_summary: "株式会社ACMEテクノロジーズ（Slack連携設定更新）",
        created_at: new Date(Date.now() - 3600_000 * 2).toISOString(),
      },
      {
        id: "audit-seed-2",
        actor_email: "hr@acme-tech.example.com",
        actor_role: "company",
        action: "login_success",
        target_summary: "企業担当者ポータル ログイン",
        created_at: new Date(Date.now() - 3600_000 * 5).toISOString(),
      },
    ];
  }
  return globalThis.__demoAuditLogs;
}

export async function recordAuditLog(params: {
  actorId?: string | null;
  actorEmail?: string | null;
  actorRole: string;
  action: string;
  targetSummary: string;
  detail?: Record<string, unknown>;
}) {
  const entry: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    actor_id: params.actorId ?? null,
    actor_email: params.actorEmail ?? null,
    actor_role: params.actorRole,
    action: params.action,
    target_summary: params.targetSummary,
    detail_json: params.detail ?? {},
    created_at: new Date().toISOString(),
  };

  getDemoStore().unshift(entry);
  if (getDemoStore().length > 200) {
    getDemoStore().length = 200;
  }

  if (isSupabaseConfigured()) {
    try {
      const db =
        process.env.SUPABASE_SERVICE_ROLE_KEY &&
        !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
          ? createAdminClient()
          : await createClient();
      await db.from("audit_logs").insert({
        actor_id: entry.actor_id,
        actor_email: entry.actor_email,
        actor_role: entry.actor_role,
        action: entry.action,
        target_summary: entry.target_summary,
        detail_json: entry.detail_json,
      });
    } catch {
      // テーブル未作成時はインメモリのみで継続
    }
  }
}

export async function getAuditLogs(limit = 100): Promise<AuditLogEntry[]> {
  if (isSupabaseConfigured()) {
    try {
      const db =
        process.env.SUPABASE_SERVICE_ROLE_KEY &&
        !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
          ? createAdminClient()
          : await createClient();
      const { data } = await db
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (data && data.length > 0) {
        return data as AuditLogEntry[];
      }
    } catch {
      // fallback
    }
  }
  return getDemoStore().slice(0, limit);
}
