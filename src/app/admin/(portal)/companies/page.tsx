import React from "react";
import { getAdminCompaniesList } from "@/lib/data-service";
import { AdminCompaniesClient } from "@/components/admin/admin-companies-client";

export default async function AdminCompaniesPage() {
  const companies = await getAdminCompaniesList();

  return <AdminCompaniesClient initialCompanies={companies} />;
}
