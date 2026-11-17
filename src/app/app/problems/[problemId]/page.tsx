import React from "react";
import { getCurrentProfile, getProblemDetailForStudent } from "@/lib/data-service";
import { ProblemWorkspaceClient } from "@/components/problem/problem-workspace-client";

export default async function JavaProblemPage({
  params,
}: {
  params: Promise<{ problemId: string }>;
}) {
  const { problemId } = await params;
  const profile = await getCurrentProfile();
  const detail = await getProblemDetailForStudent(problemId, profile.id);

  return (
    <ProblemWorkspaceClient
      problem={detail.problem}
      publicTestCases={detail.publicTestCases}
      hints={detail.hints}
      initialProgress={detail.progress}
      nextProblemId={detail.nextProblemId}
      courseId={detail.courseId}
    />
  );
}
