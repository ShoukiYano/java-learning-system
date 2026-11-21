import React from "react";
import {
  getProblemForAdminEdit,
  getAllChaptersForAdmin,
} from "@/lib/data-service";
import { ProblemEditorForm } from "@/components/admin/problem-editor-form";

export const dynamic = "force-dynamic";

export default async function AdminEditProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [target, chapters] = await Promise.all([
    getProblemForAdminEdit(id),
    getAllChaptersForAdmin(),
  ]);

  return (
    <ProblemEditorForm
      mode="edit"
      initialProblem={target}
      chapters={chapters}
    />
  );
}
