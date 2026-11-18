import React from "react";
import { getStudentsAnalyticsFromDb } from "@/lib/data-service";
import { AdminStudentsListClient } from "@/components/admin/admin-students-list-client";

export default async function AdminStudentsListPage() {
  const students = await getStudentsAnalyticsFromDb();

  return <AdminStudentsListClient students={students} />;
}
