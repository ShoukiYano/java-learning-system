import React from "react";
import {
  getCurrentProfile,
  getStudentsAnalyticsFromDb,
  getMilestonesFromDb,
  getCompanyDelayAlertDays,
} from "@/lib/data-service";
import { CompanyReportClient } from "@/components/company/company-report-client";

export const dynamic = "force-dynamic";

export default async function CompanyReportPage() {
  const profile = await getCurrentProfile();
  const targetCompanyId =
    profile.company_id ?? "00000000-0000-4000-8000-000000000001";
  const companyName =
    profile.companies?.name ?? "株式会社ACMEテクノロジーズ";

  const [students, milestones, delayAlertDays] = await Promise.all([
    getStudentsAnalyticsFromDb(targetCompanyId),
    getMilestonesFromDb(targetCompanyId),
    getCompanyDelayAlertDays(targetCompanyId),
  ]);

  const generatedAt = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });

  return (
    <CompanyReportClient
      companyName={companyName}
      students={students}
      milestones={milestones}
      delayAlertDays={delayAlertDays}
      generatedAt={generatedAt}
    />
  );
}
