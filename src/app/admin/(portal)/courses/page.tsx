import React from "react";
import { getAdminCoursesAndCompanyMatrix } from "@/lib/data-service";
import { AdminCoursesClient } from "@/components/admin/admin-courses-client";

export default async function AdminCoursesPage() {
  const { courses, companies, visibilityMap } =
    await getAdminCoursesAndCompanyMatrix();

  return (
    <AdminCoursesClient
      initialCourses={courses}
      companies={companies}
      initialVisibilityMap={visibilityMap}
    />
  );
}
