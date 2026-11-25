-- =============================================================================
-- P1 セキュリティ改修マイグレーション（DB-H4 / DB-H5 / DB-H6 / DB-H7 / DB-H8）
-- 対象：
--   1. DB-H4: companies の Slack Webhook URL 等機密列を authenticated から列権限で遮断
--   2. DB-H5: audit_logs の authenticated 直接 INSERT 禁止（service_role 専用化）
--   3. DB-H6: Storage バケット qa-attachments の非公開化＋全開放ポリシー削除
--   4. DB-H7: student_questions / graduation_evaluations / student_question_replies の RLS 厳格化
--   5. DB-H8: problems.solution_code の列権限遮断 ＋ 教材/お知らせポリシーへ TO authenticated 明示
-- 前提：必ずアプリ側改修（明示カラム選択・Signed URL対応）を先にデプロイしてから適用すること。
-- 冪等性：何度再実行しても安全です。
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. DB-H4: public.companies の列レベル権限（機密Slack Webhook URL等を遮断）
-- -----------------------------------------------------------------------------
REVOKE SELECT ON TABLE public.companies FROM PUBLIC, anon, authenticated;

GRANT SELECT (
  id,
  name,
  company_code,
  delay_alert_days,
  created_at
) ON TABLE public.companies TO authenticated;

-- -----------------------------------------------------------------------------
-- 2. DB-H5: public.audit_logs の authenticated 直接 INSERT 禁止
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated insert audit_logs" ON public.audit_logs;
REVOKE INSERT ON TABLE public.audit_logs FROM PUBLIC, anon, authenticated;

-- -----------------------------------------------------------------------------
-- 3. DB-H6: Storage バケット qa-attachments の非公開化（APP-M1 署名URL連携）
-- -----------------------------------------------------------------------------
UPDATE storage.buckets
SET public = false
WHERE id = 'qa-attachments';

DROP POLICY IF EXISTS "Public read qa-attachments" ON storage.objects;

-- -----------------------------------------------------------------------------
-- 4. DB-H7: テナント境界・なりすまし防止（3テーブルの RLS 厳格化）
-- -----------------------------------------------------------------------------

-- 4-1. student_questions: 受講生 INSERT 時は本人の所属企業IDと完全一致を強制
DROP POLICY IF EXISTS "Student insert own questions" ON public.student_questions;
CREATE POLICY "Student insert own questions" ON public.student_questions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND company_id IS NOT DISTINCT FROM public.current_user_company_id()
  );

-- 4-2. graduation_evaluations: 企業担当者は対象 user_id も自社所属の受講生であることを強制
DROP POLICY IF EXISTS "Admin or company manage graduation_evaluations" ON public.graduation_evaluations;
CREATE POLICY "Admin or company manage graduation_evaluations" ON public.graduation_evaluations
  FOR ALL
  TO authenticated
  USING (
    public.current_user_role() = 'admin'
    OR (
      public.current_user_role() = 'company'
      AND company_id = public.current_user_company_id()
      AND EXISTS (
        SELECT 1 FROM public.profiles s
        WHERE s.id = graduation_evaluations.user_id
          AND s.role = 'student'
          AND s.company_id = public.current_user_company_id()
      )
    )
  )
  WITH CHECK (
    public.current_user_role() = 'admin'
    OR (
      public.current_user_role() = 'company'
      AND company_id = public.current_user_company_id()
      AND EXISTS (
        SELECT 1 FROM public.profiles s
        WHERE s.id = graduation_evaluations.user_id
          AND s.role = 'student'
          AND s.company_id = public.current_user_company_id()
      )
    )
  );

-- 4-3. student_question_replies: 受講生は自分の質問かつ sender_role = 'student' かつ image_urls 空のみ許可（画像添付はサーバー service_role 限定）
DROP POLICY IF EXISTS "Insert own or tenant question replies" ON public.student_question_replies;
CREATE POLICY "Insert own or tenant question replies" ON public.student_question_replies
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.student_questions q
      WHERE q.id = student_question_replies.question_id
        AND (
          (
            q.user_id = auth.uid()
            AND sender_role = 'student'
            AND jsonb_typeof(image_urls) = 'array'
            AND jsonb_array_length(image_urls) = 0
          )
          OR public.current_user_role() = 'admin'
          OR (
            public.current_user_role() = 'company'
            AND q.company_id = public.current_user_company_id()
          )
        )
    )
  );

-- -----------------------------------------------------------------------------
-- 5. DB-H8: public.problems の solution_code 遮断 ＋ TO authenticated 明示
-- -----------------------------------------------------------------------------
REVOKE SELECT ON TABLE public.problems FROM PUBLIC, anon, authenticated;

GRANT SELECT (
  id,
  lesson_id,
  title,
  description_md,
  difficulty,
  estimated_minutes,
  tags,
  starter_code,
  explanation_md,
  order_index,
  is_published,
  created_at
) ON TABLE public.problems TO authenticated;

-- 教材・お知らせ SELECT ポリシーへ TO authenticated を明示（anon 遮断の多層防御）
DROP POLICY IF EXISTS "courses_select" ON public.courses;
CREATE POLICY "courses_select" ON public.courses
  FOR SELECT
  TO authenticated
  USING (is_published = true OR public.current_user_role() = 'admin');

DROP POLICY IF EXISTS "chapters_select" ON public.chapters;
CREATE POLICY "chapters_select" ON public.chapters
  FOR SELECT
  TO authenticated
  USING (is_published = true OR public.current_user_role() = 'admin');

DROP POLICY IF EXISTS "lessons_select" ON public.lessons;
CREATE POLICY "lessons_select" ON public.lessons
  FOR SELECT
  TO authenticated
  USING (is_published = true OR public.current_user_role() = 'admin');

DROP POLICY IF EXISTS "problems_select" ON public.problems;
CREATE POLICY "problems_select" ON public.problems
  FOR SELECT
  TO authenticated
  USING (is_published = true OR public.current_user_role() = 'admin');

DROP POLICY IF EXISTS "announcements_select" ON public.announcements;
CREATE POLICY "announcements_select" ON public.announcements
  FOR SELECT
  TO authenticated
  USING (
    public.current_user_role() = 'admin'
    OR company_id IS NULL
    OR company_id = public.current_user_company_id()
  );

COMMIT;

-- PostgREST スキーマキャッシュ再読み込み
NOTIFY pgrst, 'reload schema';
