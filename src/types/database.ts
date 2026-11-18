// ==========================================
// データベース型定義（Supabase PostgreSQL スキーマ対応）
// ==========================================

export type UserRole = "admin" | "student" | "company";
export type Difficulty = "easy" | "medium" | "hard";
export type ProblemLanguage = "java" | "sql";
export type ProgressStatus = "not_started" | "in_progress" | "completed";
export type SubmissionStatus =
  | "passed"
  | "wrong_answer"
  | "compile_error"
  | "runtime_error"
  | "time_limit_exceeded";

export interface Company {
  id: string;
  name: string;
  company_code: string;
  contact_email: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  company_id: string | null;
  avatar_url: string | null;
  streak_days: number;
  last_study_date: string | null;
  last_login_at: string | null;
  created_at: string;
  companies?: Company | null;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  order_index: number;
  is_published: boolean;
  prerequisite_course_id: string | null;
  created_at: string;
}

export interface Chapter {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  is_published: boolean;
  created_at: string;
}

export interface Lesson {
  id: string;
  chapter_id: string;
  title: string;
  content_md: string | null;
  order_index: number;
  is_published: boolean;
  created_at: string;
}

export interface Problem {
  id: string;
  lesson_id: string;
  language?: ProblemLanguage; // "java" | "sql"（省略時はタグまたはコードから自動判定）
  title: string;
  description_md: string;
  difficulty: Difficulty;
  estimated_minutes: number;
  tags: string[];
  starter_code: string;
  solution_code: string;
  explanation_md: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
}

export interface TestCase {
  id: string;
  problem_id: string;
  name: string;
  input: string;
  expected_output: string;
  is_hidden: boolean;
  order_index: number;
}

export interface Hint {
  id: string;
  problem_id: string;
  step_number: 1 | 2 | 3;
  content_md: string;
}

export interface Submission {
  id: string;
  user_id: string;
  problem_id: string;
  code: string;
  status: SubmissionStatus;
  passed_count: number;
  total_count: number;
  execution_time_ms: number | null;
  memory_kb: number | null;
  compile_error: string | null;
  time_spent_seconds: number;
  created_at: string;
  problems?: Pick<Problem, "id" | "title" | "difficulty" | "tags">;
  profiles?: Pick<Profile, "id" | "full_name" | "email" | "company_id">;
}

export interface Progress {
  id: string;
  user_id: string;
  problem_id: string;
  status: ProgressStatus;
  attempts_count: number;
  total_time_spent_seconds: number;
  unlocked_hint_step: number;
  completed_at: string | null;
  updated_at: string;
}

export interface Feedback {
  id: string;
  student_id: string;
  admin_id: string;
  submission_id: string | null;
  rating: number | null; // 1〜5段階評価（企業担当者画面でも確認可能）
  comment: string;
  created_at: string;
  admin?: Pick<Profile, "id" | "full_name">;
  problem_title?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content_md: string;
  company_id: string | null; // null = 全体向け、指定あり = 特定企業向け
  created_by: string | null;
  created_at: string;
}

export interface StudyLog {
  id: string;
  user_id: string;
  study_date: string; // YYYY-MM-DD
  minutes: number;
  problems_solved: number;
}
