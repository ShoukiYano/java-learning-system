import React from "react";
import { getCompanyProgressMatrix } from "@/lib/data-service";
import { CompanyProgressMatrixClient } from "@/components/company/company-progress-matrix-client";

export const dynamic = "force-dynamic";

export default async function AdminProgressMatrixPage() {
  const { courses, students } = await getCompanyProgressMatrix();

  return (
    <CompanyProgressMatrixClient
      companyName="全テナント横断"
      courses={courses}
      students={students}
      showCompanyFilter
      studentDetailBasePath="/admin/students"
    />
  );
}
