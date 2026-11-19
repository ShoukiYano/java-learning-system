import React from "react";
import { notFound } from "next/navigation";
import { getCurrentProfile, getStudentDashboardData } from "@/lib/data-service";
import { getCurriculumDay } from "@/lib/curriculum/days-plan";
import { getInMemoryDeliverables } from "@/lib/curriculum/graduation";
import { SEED_PROBLEMS, detectProblemLanguage } from "@/lib/seed-data";
import { DayDetailClient } from "@/components/curriculum/day-detail-client";

export default async function StudentRoadmapDayPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day } = await params;
  const dayNum = Number(day);
  const dayPlan = getCurriculumDay(dayNum);

  if (!dayPlan) {
    notFound();
  }

  const profile = await getCurrentProfile();
  const dashboard = await getStudentDashboardData(
    profile.id,
    profile.company_id
  );
  const completedSet = new Set(dashboard.completedProblemIds ?? []);

  const linkedProblems = dayPlan.problemIds
    .map((pid) => SEED_PROBLEMS.find((p) => p.id === pid))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map((p) => ({
      id: p.id,
      title: p.title,
      difficulty: p.difficulty,
      language: detectProblemLanguage(p),
      completed: completedSet.has(p.id),
    }));

  const initialDeliverables = getInMemoryDeliverables(profile.id).filter(
    (d) => d.day === dayNum
  );

  return (
    <DayDetailClient
      dayPlan={dayPlan}
      linkedProblems={linkedProblems}
      initialDeliverables={initialDeliverables}
    />
  );
}
