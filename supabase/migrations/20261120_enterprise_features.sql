-- =============================================================================
-- DevSkillStudio 商用運用・エンタープライズ機能一括マイグレーション
-- 1. 遅れアラート閾値の企業別カスタマイズ（companies.delay_alert_days）
-- 2. 研修スケジュール（目標マイルストーン）永続テーブル（training_milestones）
-- 3. 問題別「講師へ質問」テーブル（student_questions）
-- 4. 監査ログテーブル（audit_logs）
-- 5. お知らせ既読管理テーブル（announcement_reads）
-- =============================================================================

-- 1. 企業別 遅れアラート日数閾値（デフォルト5日）＆ 質問通知専用Slack Webhook設定
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS delay_alert_days INTEGER NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS question_slack_webhook_url TEXT,
  ADD COLUMN IF NOT EXISTS question_slack_channel_name TEXT;

-- 2. 研修スケジュール（目標マイルストーン）
CREATE TABLE IF NOT EXISTS public.training_milestones (
  id TEXT PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_date TEXT NOT NULL,
  course_id UUID,
  target_problem_count INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_training_milestones_company
  ON public.training_milestones (company_id, target_date);

-- 3. 受講生からの問題別質問（Slack連携）
CREATE TABLE IF NOT EXISTS public.student_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  student_name TEXT NOT NULL,
  problem_id TEXT NOT NULL,
  problem_title TEXT NOT NULL,
  question_text TEXT NOT NULL,
  code_snippet TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'answered')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. 監査ログ（ログイン・PW変更・管理者操作・評価保存等）
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id TEXT,
  actor_email TEXT,
  actor_role TEXT NOT NULL DEFAULT 'system',
  action TEXT NOT NULL,
  target_summary TEXT,
  detail_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created
  ON public.audit_logs (created_at DESC);

-- 5. お知らせ既読管理
CREATE TABLE IF NOT EXISTS public.announcement_reads (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  announcement_id TEXT NOT NULL,
  read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, announcement_id)
);

-- 権限付与（permission denied 防止）
-- 6. 100点修了判定テーブル（未作成環境でも確実に作成＋権限付与）
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

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE
  public.training_milestones,
  public.student_questions,
  public.audit_logs,
  public.announcement_reads,
  public.graduation_evaluations
TO authenticated, service_role;

ALTER TABLE public.training_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.graduation_evaluations ENABLE ROW LEVEL SECURITY;

-- 最小権限RLSポリシー（ロール・本人・自社テナント単位で厳格分離）

-- 1) training_milestones：管理者は全操作可、受講生・企業担当者は自社または全体のみ閲覧可
DROP POLICY IF EXISTS "Authenticated manage milestones" ON public.training_milestones;
DROP POLICY IF EXISTS "Admin manage milestones" ON public.training_milestones;
DROP POLICY IF EXISTS "Tenant read milestones" ON public.training_milestones;
CREATE POLICY "Admin manage milestones" ON public.training_milestones
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
CREATE POLICY "Tenant read milestones" ON public.training_milestones
  FOR SELECT TO authenticated
  USING (
    company_id IS NULL
    OR company_id = (SELECT p.company_id FROM public.profiles p WHERE p.id = auth.uid())
  );

-- 2) student_questions：本人のみ投稿可、閲覧は本人・自社担当者・管理者のみ
DROP POLICY IF EXISTS "Authenticated manage questions" ON public.student_questions;
DROP POLICY IF EXISTS "Student insert own questions" ON public.student_questions;
DROP POLICY IF EXISTS "Tenant read questions" ON public.student_questions;
CREATE POLICY "Student insert own questions" ON public.student_questions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Tenant read questions" ON public.student_questions
  FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND (p.role = 'admin' OR (p.role = 'company' AND p.company_id = student_questions.company_id))
    )
  );

-- 3) audit_logs：閲覧は管理者のみ、記録は認証済みユーザー（操作イベント記録用）
DROP POLICY IF EXISTS "Authenticated manage audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admin read audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Authenticated insert audit_logs" ON public.audit_logs;
CREATE POLICY "Admin read audit_logs" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
CREATE POLICY "Authenticated insert audit_logs" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- 4) announcement_reads：本人の既読レコードのみ操作可
DROP POLICY IF EXISTS "Authenticated manage announcement_reads" ON public.announcement_reads;
DROP POLICY IF EXISTS "User manage own announcement_reads" ON public.announcement_reads;
CREATE POLICY "User manage own announcement_reads" ON public.announcement_reads
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5) graduation_evaluations：管理者・自社企業担当者のみ管理可、受講生は本人のみ閲覧可
DROP POLICY IF EXISTS "Authenticated manage graduation_evaluations" ON public.graduation_evaluations;
DROP POLICY IF EXISTS "Admin or company manage graduation_evaluations" ON public.graduation_evaluations;
DROP POLICY IF EXISTS "Student read own graduation_evaluations" ON public.graduation_evaluations;
CREATE POLICY "Admin or company manage graduation_evaluations" ON public.graduation_evaluations
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND (p.role = 'admin' OR (p.role = 'company' AND p.company_id = graduation_evaluations.company_id))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND (p.role = 'admin' OR (p.role = 'company' AND p.company_id = graduation_evaluations.company_id))
    )
  );
CREATE POLICY "Student read own graduation_evaluations" ON public.graduation_evaluations
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

NOTIFY pgrst, 'reload schema';
