/**
 * ファイル概要：
 * 90日間Java実務研修カリキュラム・理解度テスト・成果物提出・100点修了判定の型定義
 */

export type CurriculumPhase = 1 | 2 | 3;

export type CurriculumExecutionMode =
  | "auto_java"
  | "auto_sql"
  | "auto_git"
  | "quiz_only"
  | "deliverable_review";

export type CurriculumDayStatus = "published" | "planned";

export type QuizQuestionType =
  | "multiple_choice"
  | "output_prediction"
  | "error_spot"
  | "fill_blank";

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  question: string;
  codeSnippet?: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export interface DeliverableAssignment {
  title: string;
  overview: string;
  requiredItems: string[];
  evaluationCriteria: string[];
  isMandatoryForGraduation?: boolean;
}

export interface CurriculumDay {
  day: number; // 1 〜 90
  phase: CurriculumPhase;
  week: number; // 1 〜 13
  chapterTitle: string;
  title: string;
  learningGoal: string;
  prerequisites: string[];
  estimatedMinutes: number;
  executionMode: CurriculumExecutionMode;
  status: CurriculumDayStatus;
  isReviewDay?: boolean;
  isExamDay?: boolean;
  /** 既存の SEED_PROBLEMS と紐づく問題ID一覧（互換性維持） */
  problemIds: string[];
  /** 詳細解説教材（Markdown） */
  lessonContentMd?: string;
  /** 理解度確認テスト */
  quizzes?: QuizQuestion[];
  /** Spring Boot・JDBC・最終プロジェクト用の成果物提出課題 */
  deliverable?: DeliverableAssignment;
}

export interface QuizAttemptRecord {
  id: string;
  userId: string;
  day: number;
  scorePercent: number;
  correctCount: number;
  totalCount: number;
  submittedAt: string;
}

export type DeliverableReviewStatus =
  | "submitted"
  | "approved"
  | "needs_revision";

export interface DeliverableSubmissionRecord {
  id: string;
  userId: string;
  companyId?: string | null;
  day: number;
  repositoryUrl?: string;
  codeOrNotes: string;
  testEvidence?: string;
  reviewStatus: DeliverableReviewStatus;
  reviewerComment?: string;
  score?: number;
  submittedAt: string;
  reviewedAt?: string;
}

export type GraduationCategoryKey =
  | "java_oop"
  | "java_api_collections"
  | "sql_db"
  | "spring_boot_api"
  | "git_workflow"
  | "junit_testing"
  | "final_project";

export interface GraduationCategoryScore {
  key: GraduationCategoryKey;
  label: string;
  maxPoints: number;
  earnedPoints: number;
  note?: string;
}

export type GraduationVerdict =
  | "graduated"
  | "conditional_review"
  | "needs_review";

export interface GraduationEvaluation {
  categories: GraduationCategoryScore[];
  totalScore: number; // 0〜100
  mandatoryFinalProjectPassed: boolean;
  verdict: GraduationVerdict;
  verdictLabel: string;
  verdictReason: string;
}

export interface LearningStumbleAlert {
  severity: "warning" | "info";
  title: string;
  detail: string;
  recommendedDay?: number;
}
