-- =============================================================================
-- Javaカリキュラム管理・学習Webアプリ 初期スキーマ・RLS・トリガー定義
-- =============================================================================

-- UUID生成拡張
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. テーブル定義
-- =============================================================================

-- 1-1. companies（導入企業）
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company_code TEXT NOT NULL UNIQUE,
  contact_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1-2. profiles（ユーザープロファイル：auth.users と 1対1）
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '名称未設定',
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'student', 'company')),
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  avatar_url TEXT,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_study_date DATE,
  last_login_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1-3. courses（コース）
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 1,
  is_published BOOLEAN NOT NULL DEFAULT true,
  prerequisite_course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1-4. chapters（章）
CREATE TABLE IF NOT EXISTS public.chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 1,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1-5. lessons（単元）
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_md TEXT DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 1,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1-6. problems（Java演習問題）
CREATE TABLE IF NOT EXISTS public.problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description_md TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  estimated_minutes INTEGER NOT NULL DEFAULT 15,
  tags TEXT[] NOT NULL DEFAULT '{}',
  starter_code TEXT NOT NULL,
  solution_code TEXT NOT NULL,
  explanation_md TEXT NOT NULL DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 1,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1-7. test_cases（テストケース：is_hidden=true は受講生からRLSで隠蔽）
CREATE TABLE IF NOT EXISTS public.test_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  input TEXT NOT NULL DEFAULT '',
  expected_output TEXT NOT NULL,
  is_hidden BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 1
);

-- 1-8. hints（段階的ヒント：1〜3）
CREATE TABLE IF NOT EXISTS public.hints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL CHECK (step_number IN (1, 2, 3)),
  content_md TEXT NOT NULL,
  UNIQUE (problem_id, step_number)
);

-- 1-9. submissions（提出履歴）
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('passed', 'wrong_answer', 'compile_error', 'runtime_error', 'time_limit_exceeded')),
  passed_count INTEGER NOT NULL DEFAULT 0,
  total_count INTEGER NOT NULL DEFAULT 0,
  execution_time_ms INTEGER,
  memory_kb INTEGER,
  compile_error TEXT,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1-10. progress（問題別の学習進捗）
CREATE TABLE IF NOT EXISTS public.progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  attempts_count INTEGER NOT NULL DEFAULT 0,
  total_time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  unlocked_hint_step INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, problem_id)
);

-- 1-11. feedbacks（管理者・講師からのフィードバックと評価）
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES public.submissions(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1-12. announcements（お知らせ：全体または企業別）
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content_md TEXT NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1-13. study_logs（日別の学習時間・カレンダー草表示用）
CREATE TABLE IF NOT EXISTS public.study_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  study_date DATE NOT NULL DEFAULT CURRENT_DATE,
  minutes INTEGER NOT NULL DEFAULT 0,
  problems_solved INTEGER NOT NULL DEFAULT 0,
  UNIQUE (user_id, study_date)
);

-- =============================================================================
-- 2. auth.users 新規作成時の profiles 自動生成トリガー
-- =============================================================================
-- 新規登録時に raw_user_meta_data に含まれる full_name, company_code, role を読み取り、
-- 企業コードが一致する場合は自動的に該当企業 (company_id) に紐付ける。
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company_id UUID := NULL;
  v_company_code TEXT;
  v_role TEXT;
  v_full_name TEXT;
BEGIN
  v_company_code := NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'company_code', '')), '');
  v_full_name := COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''), split_part(NEW.email, '@', 1));
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');

  -- 不正なロール指定を防止（デフォルトは student）
  IF v_role NOT IN ('admin', 'student', 'company') THEN
    v_role := 'student';
  END IF;

  -- 企業コードが入力されている場合は companies テーブルから検索
  IF v_company_code IS NOT NULL THEN
    SELECT id INTO v_company_id
    FROM public.companies
    WHERE UPPER(company_code) = UPPER(v_company_code)
    LIMIT 1;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role, company_id)
  VALUES (NEW.id, NEW.email, v_full_name, v_role, v_company_id)
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        company_id = COALESCE(EXCLUDED.company_id, public.profiles.company_id);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 3. RLS（Row Level Security）補助関数とポリシー設定
-- =============================================================================

-- ログイン中ユーザーのロール取得関数（RLS内での再帰参照を防ぐため SECURITY DEFINER）
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- ログイン中ユーザーの所属企業ID取得関数
CREATE OR REPLACE FUNCTION public.current_user_company_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid();
$$;

-- 全テーブルで RLS を有効化
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_logs ENABLE ROW LEVEL SECURITY;

-- 3-1. companies ポリシー
CREATE POLICY "companies_select_policy" ON public.companies
  FOR SELECT USING (
    public.current_user_role() = 'admin'
    OR id = public.current_user_company_id()
  );

CREATE POLICY "companies_admin_all" ON public.companies
  FOR ALL USING (public.current_user_role() = 'admin');

-- 3-2. profiles ポリシー（本人、自社受講生を見る企業担当者、管理者）
CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT USING (
    id = auth.uid()
    OR public.current_user_role() = 'admin'
    OR (
      public.current_user_role() = 'company'
      AND company_id IS NOT NULL
      AND company_id = public.current_user_company_id()
    )
  );

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (id = auth.uid() OR public.current_user_role() = 'admin')
  WITH CHECK (id = auth.uid() OR public.current_user_role() = 'admin');

CREATE POLICY "profiles_admin_insert_delete" ON public.profiles
  FOR ALL USING (public.current_user_role() = 'admin');

-- 3-3. カリキュラム系（courses / chapters / lessons / problems / hints）
CREATE POLICY "courses_select" ON public.courses
  FOR SELECT USING (is_published = true OR public.current_user_role() = 'admin');
CREATE POLICY "courses_admin_all" ON public.courses
  FOR ALL USING (public.current_user_role() = 'admin');

CREATE POLICY "chapters_select" ON public.chapters
  FOR SELECT USING (is_published = true OR public.current_user_role() = 'admin');
CREATE POLICY "chapters_admin_all" ON public.chapters
  FOR ALL USING (public.current_user_role() = 'admin');

CREATE POLICY "lessons_select" ON public.lessons
  FOR SELECT USING (is_published = true OR public.current_user_role() = 'admin');
CREATE POLICY "lessons_admin_all" ON public.lessons
  FOR ALL USING (public.current_user_role() = 'admin');

CREATE POLICY "problems_select" ON public.problems
  FOR SELECT USING (is_published = true OR public.current_user_role() = 'admin');
CREATE POLICY "problems_admin_all" ON public.problems
  FOR ALL USING (public.current_user_role() = 'admin');

CREATE POLICY "hints_select" ON public.hints
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "hints_admin_all" ON public.hints
  FOR ALL USING (public.current_user_role() = 'admin');

-- 3-4. test_cases ポリシー（★重要：is_hidden = true の行は受講生・企業から読めないようにする）
CREATE POLICY "test_cases_select_public_only_for_students" ON public.test_cases
  FOR SELECT USING (
    public.current_user_role() = 'admin'
    OR (auth.uid() IS NOT NULL AND is_hidden = false)
  );
CREATE POLICY "test_cases_admin_all" ON public.test_cases
  FOR ALL USING (public.current_user_role() = 'admin');

-- 3-5. submissions ポリシー
CREATE POLICY "submissions_select" ON public.submissions
  FOR SELECT USING (
    user_id = auth.uid()
    OR public.current_user_role() = 'admin'
    OR (
      public.current_user_role() = 'company'
      AND EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = submissions.user_id
          AND p.company_id = public.current_user_company_id()
      )
    )
  );

CREATE POLICY "submissions_insert_own" ON public.submissions
  FOR INSERT WITH CHECK (user_id = auth.uid() OR public.current_user_role() = 'admin');

CREATE POLICY "submissions_admin_all" ON public.submissions
  FOR ALL USING (public.current_user_role() = 'admin');

-- 3-6. progress ポリシー
CREATE POLICY "progress_select" ON public.progress
  FOR SELECT USING (
    user_id = auth.uid()
    OR public.current_user_role() = 'admin'
    OR (
      public.current_user_role() = 'company'
      AND EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = progress.user_id
          AND p.company_id = public.current_user_company_id()
      )
    )
  );

CREATE POLICY "progress_write_own" ON public.progress
  FOR INSERT WITH CHECK (user_id = auth.uid() OR public.current_user_role() = 'admin');

CREATE POLICY "progress_update_own" ON public.progress
  FOR UPDATE USING (user_id = auth.uid() OR public.current_user_role() = 'admin');

-- 3-7. feedbacks ポリシー
CREATE POLICY "feedbacks_select" ON public.feedbacks
  FOR SELECT USING (
    student_id = auth.uid()
    OR public.current_user_role() = 'admin'
    OR (
      public.current_user_role() = 'company'
      AND EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = feedbacks.student_id
          AND p.company_id = public.current_user_company_id()
      )
    )
  );

CREATE POLICY "feedbacks_admin_all" ON public.feedbacks
  FOR ALL USING (public.current_user_role() = 'admin');

-- 3-8. announcements ポリシー（全体向け または 自社向け）
CREATE POLICY "announcements_select" ON public.announcements
  FOR SELECT USING (
    public.current_user_role() = 'admin'
    OR company_id IS NULL
    OR company_id = public.current_user_company_id()
  );

CREATE POLICY "announcements_admin_all" ON public.announcements
  FOR ALL USING (public.current_user_role() = 'admin');

-- 3-9. study_logs ポリシー
CREATE POLICY "study_logs_select" ON public.study_logs
  FOR SELECT USING (
    user_id = auth.uid()
    OR public.current_user_role() = 'admin'
    OR (
      public.current_user_role() = 'company'
      AND EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = study_logs.user_id
          AND p.company_id = public.current_user_company_id()
      )
    )
  );

CREATE POLICY "study_logs_write_own" ON public.study_logs
  FOR INSERT WITH CHECK (user_id = auth.uid() OR public.current_user_role() = 'admin');

CREATE POLICY "study_logs_update_own" ON public.study_logs
  FOR UPDATE USING (user_id = auth.uid() OR public.current_user_role() = 'admin');
