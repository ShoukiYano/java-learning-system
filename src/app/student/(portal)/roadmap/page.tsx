import React from "react";
import { getCurrentProfile, getStudentDashboardData } from "@/lib/data-service";
import { CURRICULUM_DAYS } from "@/lib/curriculum/days-plan";
import {
  detectLearningStumbles,
  getInMemoryDeliverables,
  getInMemoryQuizAttempts,
} from "@/lib/curriculum/graduation";
import { RoadmapClient } from "@/components/curriculum/roadmap-client";

export default async function StudentRoadmapPage() {
  const profile = await getCurrentProfile();
  const dashboard = await getStudentDashboardData(
    profile.id,
    profile.company_id
  );

  const completedProblemIds = dashboard.completedProblemIds ?? [];

  const quizAttempts = getInMemoryQuizAttempts(profile.id);
  const completedQuizDays = Array.from(
    new Set(
      quizAttempts.filter((a) => a.scorePercent >= 70).map((a) => a.day)
    )
  );

  const deliverables = getInMemoryDeliverables(profile.id);
  const submittedDeliverableDays = Array.from(
    new Set(deliverables.map((d) => d.day))
  );

  const weakTags = (dashboard.skillRadarData ?? [])
    .filter((s) => s.score < 60 && s.score > 0)
    .map((s) => ({
      tag: s.tag,
      accuracy: s.score,
      recommendedDay: s.tag.includes("SQL") ? 51 : 7,
    }));

  const stumbleAlerts = detectLearningStumbles({
    progressPercent: dashboard.overallProgressPercent,
    failedSubmissionsCount: 0,
    weakTags,
  });

  return (
    <RoadmapClient
      days={CURRICULUM_DAYS}
      completedProblemIds={completedProblemIds}
      completedQuizDays={completedQuizDays}
      submittedDeliverableDays={submittedDeliverableDays}
      stumbleAlerts={stumbleAlerts}
    />
  );
}
