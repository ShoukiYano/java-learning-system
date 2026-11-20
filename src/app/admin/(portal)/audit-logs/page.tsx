import React from "react";
import { getAuditLogs } from "@/lib/audit-log";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollText, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

const ACTION_LABEL_MAP: Record<string, { label: string; color: string }> = {
  update_company: {
    label: "企業設定更新",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  reset_manager_password: {
    label: "担当者PW再設定",
    color: "bg-amber-100 text-amber-800 border-amber-200",
  },
  change_password: {
    label: "パスワード変更",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  forgot_password_request: {
    label: "PW再設定依頼",
    color: "bg-sky-100 text-sky-800 border-sky-200",
  },
  save_milestone: {
    label: "マイルストーン保存",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  delete_milestone: {
    label: "マイルストーン削除",
    color: "bg-rose-100 text-rose-800 border-rose-200",
  },
  bulk_import_students: {
    label: "受講生CSV一括登録",
    color: "bg-teal-100 text-teal-800 border-teal-200",
  },
  save_graduation_evaluation: {
    label: "修了判定保存",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  update_company_settings: {
    label: "遅れアラート基準変更",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  student_question_asked: {
    label: "受講生から質問送信",
    color: "bg-cyan-100 text-cyan-800 border-cyan-200",
  },
  cron_weekly_slack_digest: {
    label: "Slack週次定期配信",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
};

export default async function AdminAuditLogsPage() {
  const logs = await getAuditLogs(100);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <ScrollText className="h-6 w-6 text-indigo-600" />
          監査ログ（重要操作履歴）
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          パスワード変更・企業設定変更・受講生一括登録・修了判定保存・Slack定期配信などの重要操作を時系列で記録しています。
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            最新 {logs.length} 件の操作履歴
          </CardTitle>
          <CardDescription className="text-xs">
            Supabase `audit_logs` テーブルに自動記録されます（最新100件を表示）。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              まだ監査ログは記録されていません。
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b text-slate-600">
                  <tr>
                    <th className="py-2.5 px-3 whitespace-nowrap">日時</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">操作種別</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">実行者</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">ロール</th>
                    <th className="py-2.5 px-3">操作内容</th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white">
                  {logs.map((log) => {
                    const meta = ACTION_LABEL_MAP[log.action] ?? {
                      label: log.action,
                      color: "bg-slate-100 text-slate-700 border-slate-200",
                    };
                    return (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString("ja-JP", {
                            timeZone: "Asia/Tokyo",
                          })}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${meta.color}`}
                          >
                            {meta.label}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                          {log.actor_email || "system"}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <Badge variant="outline" className="text-[10px]">
                            {log.actor_role || "system"}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-slate-800">
                          {log.target_summary}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
