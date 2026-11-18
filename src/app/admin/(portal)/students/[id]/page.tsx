import React from "react";
import { getStudentDetailForAdminOrCompany } from "@/lib/data-service";
import { AdminStudentDetailClient } from "@/components/admin/admin-student-detail-client";

export default async function AdminStudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { student, submissions } = await getStudentDetailForAdminOrCompany(id);

  return (
    <AdminStudentDetailClient student={student} submissions={submissions} />
  );
}
