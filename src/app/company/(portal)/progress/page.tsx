import React from "react";
import {
  getCurrentProfile,
  getCompanyProgressMatrix,
} from "@/lib/data-service";
import { CompanyProgressMatrixClient } from "@/components/company/company-progress-matrix-client";

export default async function CompanyProgressMatrixPage() {
  const profile = await getCurrentProfile();
  const targetCompanyId =
    profile.company_id ?? "00000000-0000-4000-8000-000000000001";
  const companyName =
    profile.companies?.name ?? "株式会社ACMEテクノロジーズ";

  const { courses, students } = await getCompanyProgressMatrix(targetCompanyId);

  return (
    <CompanyProgressMatrixClient
      companyName={companyName}
      courses={courses}
      students={students}
    />
  );
}
