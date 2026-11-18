import React from "react";
import { getCurrentProfile, getStudentsAnalyticsFromDb } from "@/lib/data-service";
import { CompanyDashboardClient } from "@/components/company/company-dashboard-client";

export default async function CompanyDashboardPage() {
  const profile = await getCurrentProfile();
  const targetCompanyId =
    profile.company_id ?? "00000000-0000-4000-8000-000000000001";
  const companyName =
    profile.companies?.name ?? "株式会社ACMEテクノロジーズ";

  const companyStudents = await getStudentsAnalyticsFromDb(targetCompanyId);

  return (
    <CompanyDashboardClient
      companyName={companyName}
      companyStudents={companyStudents}
    />
  );
}
