import React from "react";
import { getAdminCourseDetailFromDb } from "@/lib/data-service";
import { AdminCourseChaptersClient } from "@/components/admin/admin-course-chapters-client";

export const dynamic = "force-dynamic";

export default async function AdminCourseChaptersPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const { course, chapters, problems } = await getAdminCourseDetailFromDb(
    courseId
  );

  return (
    <AdminCourseChaptersClient
      course={course}
      initialChapters={chapters}
      problems={problems}
    />
  );
}
