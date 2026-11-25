/**
 * ファイル概要：
 * 監査ログ（ログイン履歴・PW変更・管理者CRUD・修了評価保存など）記録・取得ユーティリティ
 */

import { isSupabaseConfigured } from "@/lib/data-service";
import { createAdminClient } from "@/lib/supabase/admin";

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

function hasValidServiceRoleKey(): boolean {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(key && !key.includes("your-service-role-key"));
}

export async function recordAuditLog(params: {
  actorId?: string | null;
  actorEmail?: string | null;
  actorRole: string;
  action: string;
  targetSummary: string;
  detail?: Record<string, unknown>;
}) {
  const isProd = process.env.NODE_ENV === "production";
  const supabaseEnabled = isSupabaseConfigured();

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

  // インメモリ保持は非本番ローカルデモ時のみに限定（本番でのメモリ内PII滞留を禁止）
  if (!isProd && !supabaseEnabled) {
    getDemoStore().unshift(entry);
    if (getDemoStore().length > 200) {
      getDemoStore().length = 200;
    }
  }

  if (supabaseEnabled) {
    if (!hasValidServiceRoleKey()) {
      console.error(
        "[recordAuditLog] SUPABASE_SERVICE_ROLE_KEY is missing; audit log was not persisted.",
        { action: entry.action, actorRole: entry.actor_role }
      );
      return;
    }

    try {
      const db = createAdminClient();
      const { error } = await db.from("audit_logs").insert({
        actor_id: entry.actor_id,
        actor_email: entry.actor_email,
        actor_role: entry.actor_role,
        action: entry.action,
        target_summary: entry.target_summary,
        detail_json: entry.detail_json,
      });
      if (error) {
        console.error("[recordAuditLog] DB insert failed:", error);
      }
    } catch (err) {
      console.error("[recordAuditLog] DB insert failed:", err);
    }
  }
}

export async function getAuditLogs(limit = 100): Promise<AuditLogEntry[]> {
  const isProd = process.env.NODE_ENV === "production";

  if (isSupabaseConfigured()) {
    if (!hasValidServiceRoleKey()) {
      console.error("[getAuditLogs] SUPABASE_SERVICE_ROLE_KEY is missing.");
      return isProd ? [] : getDemoStore().slice(0, limit);
    }

    try {
      const db = createAdminClient();
      const { data, error } = await db
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) {
        console.error("[getAuditLogs] DB select failed:", error);
        return isProd ? [] : getDemoStore().slice(0, limit);
      }
      if (data && data.length > 0) {
        return data as AuditLogEntry[];
      }
      return isProd ? [] : getDemoStore().slice(0, limit);
    } catch (err) {
      console.error("[getAuditLogs] DB select failed:", err);
      return isProd ? [] : getDemoStore().slice(0, limit);
    }
  }

  if (isProd) {
    return [];
  }
  return getDemoStore().slice(0, limit);
}
