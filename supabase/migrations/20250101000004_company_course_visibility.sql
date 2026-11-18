-- =============================================================================
-- テナント企業ごとのコース（カリキュラム）表示／非表示制御スキーマ
-- =============================================================================

-- 1. 企業 × コースの表示設定中間テーブル
CREATE TABLE IF NOT EXISTS public.company_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (company_id, course_id)
);

ALTER TABLE public.company_courses ENABLE ROW LEVEL SECURITY;

-- 管理者・所属企業の受講生/担当者が参照可能、変更は管理者のみ
CREATE POLICY "company_courses_select" ON public.company_courses
  FOR SELECT USING (
    public.current_user_role() = 'admin'
    OR company_id = public.current_user_company_id()
  );

CREATE POLICY "company_courses_admin_all" ON public.company_courses
  FOR ALL USING (public.current_user_role() = 'admin');

-- 初期データ：既存企業に対して全コースをデフォルト表示（is_visible = true）で登録
INSERT INTO public.company_courses (company_id, course_id, is_visible)
SELECT c.id, crs.id, true
FROM public.companies c
CROSS JOIN public.courses crs
ON CONFLICT (company_id, course_id) DO NOTHING;
