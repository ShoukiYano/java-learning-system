import React from "react";
import {
  getAdminCompaniesList,
  isSupabaseConfigured,
} from "@/lib/data-service";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  AdminAnnouncementsClient,
  type AdminAnnouncementViewItem,
} from "@/components/admin/admin-announcements-client";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  const companies = await getAdminCompaniesList();
  const companyMap = new Map(companies.map((c) => [c.id, c.name]));

  let initialItems: AdminAnnouncementViewItem[] = [];

  if (isSupabaseConfigured()) {
    try {
      const db =
        process.env.SUPABASE_SERVICE_ROLE_KEY &&
        !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
          ? createAdminClient()
          : await createClient();
      const { data } = await db
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (data) {
        initialItems = (
          data as Array<{
            id: string;
            title: string;
            content_md: string;
            company_id: string | null;
            created_at: string;
          }>
        ).map((row) => ({
          id: row.id,
          title: row.title,
          content_md: row.content_md,
          company_id: row.company_id,
          targetLabel: row.company_id
            ? `${companyMap.get(row.company_id) ?? "指定テナント"} 限定`
            : "全テナント公開",
          createdAt: new Date(row.created_at).toISOString().slice(0, 10),
        }));
      }
    } catch {
      // ignore
    }
  } else {
    initialItems = [
      {
        id: "ann-1",
        title: "Java入門コース・SQL実践コース開講のお知らせ",
        content_md:
          "Javaの基礎からオブジェクト指向、およびSQLのデータ抽出・集計・JOIN結合までブラウザ上で学習できます。",
        company_id: null,
        targetLabel: "全テナント公開",
        createdAt: "2025-05-01",
      },
    ];
  }

  return (
    <AdminAnnouncementsClient
      initialItems={initialItems}
      companies={companies.map((c) => ({
        id: c.id,
        name: c.name,
        company_code: c.company_code,
      }))}
    />
  );
}
