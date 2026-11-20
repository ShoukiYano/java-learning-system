-- =============================================================================
-- DevSkillStudio 商用運用・エンタープライズ機能一括マイグレーション
-- 1. 遅れアラート閾値の企業別カスタマイズ（companies.delay_alert_days）
-- 2. 研修スケジュール（目標マイルストーン）永続テーブル（training_milestones）
-- 3. 問題別「講師へ質問」テーブル（student_questions）
-- 4. 監査ログテーブル（audit_logs）
-- 5. お知らせ既読管理テーブル（announcement_reads）
-- =============================================================================

-- 1. 企業別 遅れアラート日数閾値（デフォルト5日）
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS delay_alert_days INTEGER NOT NULL DEFAULT 5;

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
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE
  public.training_milestones,
  public.student_questions,
  public.audit_logs,
  public.announcement_reads
TO authenticated, service_role;

ALTER TABLE public.training_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_reads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated manage milestones" ON public.training_milestones;
CREATE POLICY "Authenticated manage milestones" ON public.training_milestones FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated manage questions" ON public.student_questions;
CREATE POLICY "Authenticated manage questions" ON public.student_questions FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated manage audit_logs" ON public.audit_logs;
CREATE POLICY "Authenticated manage audit_logs" ON public.audit_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated manage announcement_reads" ON public.announcement_reads;
CREATE POLICY "Authenticated manage announcement_reads" ON public.announcement_reads FOR ALL TO authenticated USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
