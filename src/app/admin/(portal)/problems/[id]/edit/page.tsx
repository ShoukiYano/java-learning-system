import React from "react";
import { getProblemForAdminEdit } from "@/lib/data-service";
import { ProblemEditorForm } from "@/components/admin/problem-editor-form";

export default async function AdminEditProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const target = await getProblemForAdminEdit(id);

  return <ProblemEditorForm mode="edit" initialProblem={target} />;
}
