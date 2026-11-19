/**
 * ファイル概要：
 * 90日間研修の100点満点修了判定ロジック・つまずき検知・デモ用インメモリストア
 */

import {
  DeliverableReviewStatus,
  DeliverableSubmissionRecord,
  GraduationCategoryKey,
  GraduationCategoryScore,
  GraduationEvaluation,
  LearningStumbleAlert,
  QuizAttemptRecord,
} from "@/types/curriculum";

export const DEFAULT_GRADUATION_RUBRIC: Array<{
  key: GraduationCategoryKey;
  label: string;
  maxPoints: number;
}> = [
  { key: "java_oop", label: "Java基本文法・オブジェクト指向", maxPoints: 20 },
  { key: "java_api_collections", label: "Java標準API・コレクション", maxPoints: 10 },
  { key: "sql_db", label: "SQL・DB連携", maxPoints: 10 },
  { key: "spring_boot_api", label: "Spring Boot・API開発", maxPoints: 20 },
  { key: "git_workflow", label: "Git・開発フロー", maxPoints: 10 },
  { key: "junit_testing", label: "JUnit・テスト", maxPoints: 10 },
  { key: "final_project", label: "最終実務課題（顧客・案件管理）", maxPoints: 20 },
];

/**
 * 100点満点の修了判定を算出する（80点以上かつ必須最終実技課題の合格が修了条件）
 */
export function evaluateGraduation(
  earnedMap: Partial<Record<GraduationCategoryKey, number>>,
  mandatoryFinalProjectPassed: boolean
): GraduationEvaluation {
  const categories: GraduationCategoryScore[] = DEFAULT_GRADUATION_RUBRIC.map(
    (item) => {
      const raw = earnedMap[item.key] ?? 0;
      const clamped = Math.max(0, Math.min(item.maxPoints, Math.round(raw)));
      return {
        key: item.key,
        label: item.label,
        maxPoints: item.maxPoints,
        earnedPoints: clamped,
      };
    }
  );

  const totalScore = categories.reduce((sum, c) => sum + c.earnedPoints, 0);

  if (totalScore >= 80 && mandatoryFinalProjectPassed) {
    return {
      categories,
      totalScore,
      mandatoryFinalProjectPassed,
      verdict: "graduated",
      verdictLabel: "修了",
      verdictReason:
        "合計80点以上かつ最終実務課題（CRUD実装・テスト）の合格基準を満たしています。",
    };
  }

  if (totalScore >= 80 && !mandatoryFinalProjectPassed) {
    return {
      categories,
      totalScore,
      mandatoryFinalProjectPassed,
      verdict: "conditional_review",
      verdictLabel: "条件付き修了候補（必須課題未合格）",
      verdictReason:
        "合計点は80点以上ですが、最終実務課題での基本的なCRUD実装・テスト合格が確認されていないため自動修了となりません。",
    };
  }

  if (totalScore >= 70) {
    return {
      categories,
      totalScore,
      mandatoryFinalProjectPassed,
      verdict: "conditional_review",
      verdictLabel: "条件付き修了候補（要レビュー）",
      verdictReason:
        "合計70〜79点です。研修担当者による成果物レビューおよび弱点補強後に修了可否を判定してください。",
    };
  }

  return {
    categories,
    totalScore,
    mandatoryFinalProjectPassed,
    verdict: "needs_review",
    verdictLabel: "要復習",
    verdictReason:
      "合計69点以下です。基礎分野および未達項目の復習を実施したうえで再評価してください。",
  };
}

/**
 * 受講生の提出・進捗データから学習のつまずきを検知し、復習推奨アラートを返す
 */
export function detectLearningStumbles(params: {
  progressPercent: number;
  failedSubmissionsCount: number;
  repeatedProblemFailures?: Array<{ title: string; failCount: number; recommendedDay?: number }>;
  weakTags?: Array<{ tag: string; accuracy: number; recommendedDay?: number }>;
}): LearningStumbleAlert[] {
  const alerts: LearningStumbleAlert[] = [];

  if (params.repeatedProblemFailures) {
    for (const item of params.repeatedProblemFailures) {
      if (item.failCount >= 3) {
        alerts.push({
          severity: "warning",
          title: `「${item.title}」で不正解が続いています（${item.failCount}回）`,
          detail:
            "同じ問題でつまずいています。該当Dayの解説教材と一行ずつのコード解説を見直してから再挑戦しましょう。",
          recommendedDay: item.recommendedDay,
        });
      }
    }
  }

  if (params.weakTags) {
    for (const wt of params.weakTags) {
      if (wt.accuracy < 60) {
        alerts.push({
          severity: "warning",
          title: `「${wt.tag}」の正答率が低下しています（${wt.accuracy}%）`,
          detail:
            "基礎理解が曖昧なまま先へ進むと後半のSpring Boot演習でつまずきやすくなります。復習日の教材を活用してください。",
          recommendedDay: wt.recommendedDay,
        });
      }
    }
  }

  if (params.failedSubmissionsCount >= 5 && alerts.length === 0) {
    alerts.push({
      severity: "info",
      title: "エラーメッセージの読み方・デバッグ手順を復習しましょう",
      detail:
        "提出エラーが増えています。コンパイルエラーの行番号と日本語解説を一つずつ確認する習慣をつけましょう。",
      recommendedDay: 2,
    });
  }

  return alerts;
}

// =============================================================================
// デモ・ローカル環境用インメモリストア（Supabase未設定時も動作）
// =============================================================================
declare global {
  // eslint-disable-next-line no-var
  var __demoQuizAttempts: QuizAttemptRecord[] | undefined;
  // eslint-disable-next-line no-var
  var __demoDeliverableSubmissions: DeliverableSubmissionRecord[] | undefined;
}

export function saveInMemoryQuizAttempt(
  record: Omit<QuizAttemptRecord, "id" | "submittedAt">
): QuizAttemptRecord {
  if (!globalThis.__demoQuizAttempts) {
    globalThis.__demoQuizAttempts = [];
  }
  const saved: QuizAttemptRecord = {
    ...record,
    id: `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    submittedAt: new Date().toISOString(),
  };
  globalThis.__demoQuizAttempts.push(saved);
  return saved;
}

export function getInMemoryQuizAttempts(userId: string): QuizAttemptRecord[] {
  if (!globalThis.__demoQuizAttempts) {
    globalThis.__demoQuizAttempts = [];
  }
  return globalThis.__demoQuizAttempts.filter((a) => a.userId === userId);
}

export function saveInMemoryDeliverable(
  record: Omit<DeliverableSubmissionRecord, "id" | "submittedAt" | "reviewStatus">
): DeliverableSubmissionRecord {
  if (!globalThis.__demoDeliverableSubmissions) {
    globalThis.__demoDeliverableSubmissions = [];
  }
  const saved: DeliverableSubmissionRecord = {
    ...record,
    id: `deliv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    reviewStatus: "submitted",
    submittedAt: new Date().toISOString(),
  };
  globalThis.__demoDeliverableSubmissions.push(saved);
  return saved;
}

export function getInMemoryDeliverables(
  userId?: string
): DeliverableSubmissionRecord[] {
  if (!globalThis.__demoDeliverableSubmissions) {
    globalThis.__demoDeliverableSubmissions = [];
  }
  if (!userId) return globalThis.__demoDeliverableSubmissions;
  return globalThis.__demoDeliverableSubmissions.filter(
    (d) => d.userId === userId
  );
}

export function reviewInMemoryDeliverable(
  submissionId: string,
  reviewStatus: DeliverableReviewStatus,
  reviewerComment?: string,
  score?: number
): DeliverableSubmissionRecord | null {
  if (!globalThis.__demoDeliverableSubmissions) return null;
  const target = globalThis.__demoDeliverableSubmissions.find(
    (d) => d.id === submissionId
  );
  if (!target) return null;
  target.reviewStatus = reviewStatus;
  target.reviewerComment = reviewerComment;
  target.score = score;
  target.reviewedAt = new Date().toISOString();
  return target;
}
