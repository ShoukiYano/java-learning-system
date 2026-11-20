import React from "react";
import {
  getCurrentProfile,
  getStudentsAnalyticsFromDb,
  getCompanySlackSettingsFromDb,
} from "@/lib/data-service";
import { getInMemoryMilestones } from "@/lib/seed-data";
import { CompanyDashboardClient } from "@/components/company/company-dashboard-client";

export default async function CompanyDashboardPage() {
  const profile = await getCurrentProfile();
  const targetCompanyId =
    profile.company_id ?? "00000000-0000-4000-8000-000000000001";
  const companyName =
    profile.companies?.name ?? "株式会社ACMEテクノロジーズ";

  const [companyStudents, slackSettings] = await Promise.all([
    getStudentsAnalyticsFromDb(targetCompanyId),
    getCompanySlackSettingsFromDb(targetCompanyId),
  ]);
  const milestones = getInMemoryMilestones(targetCompanyId);

  return (
    <CompanyDashboardClient
      companyId={targetCompanyId}
      companyName={companyName}
      companyStudents={companyStudents}
      slackSettings={slackSettings}
      milestones={milestones}
    />
  );
}
