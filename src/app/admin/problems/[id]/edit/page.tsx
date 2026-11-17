import React from "react";
import { SEED_PROBLEMS } from "@/lib/seed-data";
import { ProblemEditorForm } from "@/components/admin/problem-editor-form";

export default async function AdminEditProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const target =
    SEED_PROBLEMS.find((p) => p.id === id) ?? SEED_PROBLEMS[0];

  return <ProblemEditorForm mode="edit" initialProblem={target} />;
}
