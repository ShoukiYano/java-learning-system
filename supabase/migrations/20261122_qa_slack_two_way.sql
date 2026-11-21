-- =============================================================================
-- DevSkillStudio 質疑応答（Q&A）× Slack 双方向スレッド連携マイグレーション
-- 1. companies に質問用 Slack チャンネルID（question_slack_channel_id）を追加
-- 2. student_questions に Slack スレッド紐付け・未読回答フラグを追加
-- 3. student_question_replies テーブル（複数回やり取り＋添付画像URL対応）を作成
-- 4. Supabase Storage バケット `qa-attachments`（回答画像保存用）を作成
-- =============================================================================

-- 1. 企業ごとの質問投稿先 Slack チャンネルID（例: C0123456789）
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS question_slack_channel_id TEXT;

-- 2. student_questions テーブル拡張
ALTER TABLE public.student_questions
  ADD COLUMN IF NOT EXISTS slack_channel_id TEXT,
  ADD COLUMN IF NOT EXISTS slack_thread_ts TEXT,
  ADD COLUMN IF NOT EXISTS has_unread_reply BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_student_questions_slack_thread
  ON public.student_questions (slack_channel_id, slack_thread_ts);

CREATE INDEX IF NOT EXISTS idx_student_questions_user_updated
  ON public.student_questions (user_id, updated_at DESC);

-- 3. 質疑応答スレッド返信テーブル（講師・受講生の往復＋画像添付対応）
CREATE TABLE IF NOT EXISTS public.student_question_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.student_questions(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('instructor', 'student')),
  sender_name TEXT NOT NULL DEFAULT '講師',
  body TEXT NOT NULL DEFAULT '',
  image_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  slack_ts TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_student_question_replies_question
  ON public.student_question_replies (question_id, created_at ASC);

-- 権限・RLS設定
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.student_question_replies TO authenticated, service_role;
ALTER TABLE public.student_question_replies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Read own or tenant question replies" ON public.student_question_replies;
CREATE POLICY "Read own or tenant question replies"
  ON public.student_question_replies
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.student_questions q
      WHERE q.id = student_question_replies.question_id
        AND (
          q.user_id = auth.uid()
          OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
          OR EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
              AND p.role = 'company'
              AND p.company_id = q.company_id
          )
        )
    )
  );

DROP POLICY IF EXISTS "Insert own or tenant question replies" ON public.student_question_replies;
CREATE POLICY "Insert own or tenant question replies"
  ON public.student_question_replies
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.student_questions q
      WHERE q.id = student_question_replies.question_id
        AND (
          q.user_id = auth.uid()
          OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
          OR EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid()
              AND p.role = 'company'
              AND p.company_id = q.company_id
          )
        )
    )
  );

-- 4. Supabase Storage バケット作成（講師回答の添付画像保存用・無料枠1GB）
INSERT INTO storage.buckets (id, name, public)
VALUES ('qa-attachments', 'qa-attachments', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read qa-attachments" ON storage.objects;
CREATE POLICY "Public read qa-attachments"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'qa-attachments');

NOTIFY pgrst, 'reload schema';
