import { describe, it, expect } from "vitest";
import { CURRICULUM_DAYS } from "../days-plan";
import {
  DEFAULT_GRADUATION_RUBRIC,
  evaluateGraduation,
  detectLearningStumbles,
} from "../graduation";

describe("90-Day Java Curriculum & Graduation Evaluation", () => {
  it("Day 1〜Day 90 まで欠番・重複なく90日分の学習計画が定義されていること", () => {
    expect(CURRICULUM_DAYS).toHaveLength(90);
    for (let i = 0; i < 90; i++) {
      expect(CURRICULUM_DAYS[i].day).toBe(i + 1);
    }
  });

  it("既存のJava基礎12問のIDがすべて第1フェーズ（Day 1〜30）に紐付けられていること", () => {
    const phase1ProblemIds = new Set(
      CURRICULUM_DAYS.filter((d) => d.phase === 1).flatMap((d) => d.problemIds)
    );
    for (let n = 1; n <= 12; n++) {
      const id = `44444444-4444-4444-8444-4444444444${String(n).padStart(2, "0")}`;
      expect(phase1ProblemIds.has(id)).toBe(true);
    }
  });

  it("修了評価ルーブリックの配点合計がちょうど100点であること", () => {
    const sum = DEFAULT_GRADUATION_RUBRIC.reduce((a, c) => a + c.maxPoints, 0);
    expect(sum).toBe(100);
  });

  it("80点以上かつ最終実務課題合格の場合のみ「修了」となること", () => {
    const res = evaluateGraduation(
      {
        java_oop: 18,
        java_api_collections: 9,
        sql_db: 8,
        spring_boot_api: 16,
        git_workflow: 8,
        junit_testing: 8,
        final_project: 17,
      },
      true
    );
    expect(res.totalScore).toBe(84);
    expect(res.verdict).toBe("graduated");
  });

  it("80点以上でも最終実務課題が未合格の場合は自動修了にならず条件付き修了候補となること", () => {
    const res = evaluateGraduation(
      {
        java_oop: 20,
        java_api_collections: 10,
        sql_db: 10,
        spring_boot_api: 20,
        git_workflow: 10,
        junit_testing: 10,
        final_project: 5,
      },
      false
    );
    expect(res.totalScore).toBe(85);
    expect(res.verdict).toBe("conditional_review");
  });

  it("69点以下の場合は「要復習」と判定されること", () => {
    const res = evaluateGraduation(
      {
        java_oop: 12,
        java_api_collections: 6,
        sql_db: 6,
        spring_boot_api: 10,
        git_workflow: 6,
        junit_testing: 5,
        final_project: 10,
      },
      false
    );
    expect(res.totalScore).toBe(55);
    expect(res.verdict).toBe("needs_review");
  });

  it("同じ問題での連続不正解や正答率低下からつまずきアラートを検知できること", () => {
    const alerts = detectLearningStumbles({
      progressPercent: 20,
      failedSubmissionsCount: 4,
      repeatedProblemFailures: [
        { title: "2-2. FizzBuzz問題", failCount: 3, recommendedDay: 14 },
      ],
    });
    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts[0].recommendedDay).toBe(14);
  });
});
