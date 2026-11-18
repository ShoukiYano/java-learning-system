import React from "react";
import { getAdminCompanyDetail } from "@/lib/data-service";
import { AdminCompanyDetailClient } from "@/components/admin/admin-company-detail-client";

export default async function AdminCompanyDetailPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const detail = await getAdminCompanyDetail(companyId);

  return (
    <AdminCompanyDetailClient
      company={detail.company}
      students={detail.students}
      courses={detail.courses}
      initialCourseVisibility={detail.courseVisibility}
    />
  );
}
