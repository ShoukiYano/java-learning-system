-- =============================================================================
-- DevSkillStudio 90日間Java実務研修カリキュラム拡張マイグレーション
-- 既存の courses / chapters / lessons / problems / progress / submissions を一切破壊せず、
-- 日別理解度テスト・実務成果物提出（Spring Boot / JDBC / 最終課題）・100点修了評価テーブルを追加します。
-- =============================================================================

-- 1. 日別理解度確認テスト受験履歴テーブル
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 90),
  correct_count INTEGER NOT NULL DEFAULT 0,
  total_count INTEGER NOT NULL DEFAULT 0,
  score_percent INTEGER NOT NULL DEFAULT 0 CHECK (score_percent BETWEEN 0 AND 100),
  answers_json JSONB DEFAULT '[]'::jsonb,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_day
  ON public.quiz_attempts (user_id, day_number);

-- 2. 実務成果物提出・レビューテーブル（Spring Boot / JDBC / Git+JUnit / 最終課題）
CREATE TABLE IF NOT EXISTS public.deliverable_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 90),
  repository_url TEXT,
  code_or_notes TEXT NOT NULL,
  test_evidence TEXT,
  review_status TEXT NOT NULL DEFAULT 'submitted'
    CHECK (review_status IN ('submitted', 'approved', 'needs_revision')),
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewer_comment TEXT,
  score INTEGER CHECK (score BETWEEN 0 AND 100),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_deliverable_submissions_user_day
  ON public.deliverable_submissions (user_id, day_number);

CREATE INDEX IF NOT EXISTS idx_deliverable_submissions_company
  ON public.deliverable_submissions (company_id, review_status);

-- 3. 100点満点修了評価テーブル（企業テナント分離対応）
CREATE TABLE IF NOT EXISTS public.graduation_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  scores_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_score INTEGER NOT NULL DEFAULT 0 CHECK (total_score BETWEEN 0 AND 100),
  mandatory_final_project_passed BOOLEAN NOT NULL DEFAULT false,
  verdict TEXT NOT NULL DEFAULT 'needs_review'
    CHECK (verdict IN ('graduated', 'conditional_review', 'needs_review')),
  evaluator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  evaluator_comment TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS有効化
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliverable_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.graduation_evaluations ENABLE ROW LEVEL SECURITY;
