import React from "react";
import { getAllChaptersForAdmin } from "@/lib/data-service";
import { ProblemEditorForm } from "@/components/admin/problem-editor-form";

export const dynamic = "force-dynamic";

export default async function AdminNewProblemPage() {
  const chapters = await getAllChaptersForAdmin();
  return <ProblemEditorForm mode="create" chapters={chapters} />;
}
