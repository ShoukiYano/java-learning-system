-- =============================================================================
-- マイグレーション: SQLコースの前提条件設定 ＆ 受講生別コースロック・個別解放管理
-- =============================================================================

-- 1. SQL実践コースの前提コースとしてJava入門コースを設定
UPDATE public.courses
SET prerequisite_course_id = '11111111-1111-4111-8111-111111111101'
WHERE id = '11111111-1111-4111-8111-111111111102';

-- 2. 受講生ごとのコース受講制限・個別ロック/解放テーブル
CREATE TABLE IF NOT EXISTS public.student_course_locks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'auto' CHECK (status IN ('auto', 'unlocked', 'locked')),
  note TEXT,
  updated_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_student_course_locks_user_id ON public.student_course_locks(user_id);
CREATE INDEX IF NOT EXISTS idx_student_course_locks_course_id ON public.student_course_locks(course_id);

-- RLS有効化
ALTER TABLE public.student_course_locks ENABLE ROW LEVEL SECURITY;

-- 管理者ポリシー: 全権限
CREATE POLICY "Admins full access on student_course_locks"
  ON public.student_course_locks FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- 企業担当者ポリシー: 自社の受講生に対する操作
CREATE POLICY "Companies can manage locks for own students"
  ON public.student_course_locks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS student_profile
      JOIN public.profiles AS my_profile ON my_profile.id = auth.uid()
      WHERE student_profile.id = student_course_locks.user_id
        AND my_profile.role = 'company'
        AND student_profile.company_id = my_profile.company_id
    )
  );

-- 受講生ポリシー: 自分の設定のみ閲覧可能
CREATE POLICY "Students can view own locks"
  ON public.student_course_locks FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
