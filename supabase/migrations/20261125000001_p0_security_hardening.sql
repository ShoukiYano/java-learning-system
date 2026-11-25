-- =============================================================================
-- P0 セキュリティ改修マイグレーション（DB-H1 / DB-H2 / DB-H3）
-- 対象：
--   1. DB-H1: profiles 自己権限昇格・他社テナント移動の防止（RLS厳格化＋BEFORE UPDATEトリガー）
--   2. DB-H2: handle_new_user() のロール指定信頼排除（常に 'student' 初期化）
--   3. DB-H3: PUBLIC / authenticated / anon からの TRUNCATE 等過剰権限剥奪・audit_logs 追記専用化
-- 冪等性：何度再実行しても安全です。
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. DB-H1: profiles の自己更新ポリシー厳格化 ＋ 保護カラム改ざん防止トリガー
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    id = auth.uid()
    OR public.current_user_role() = 'admin'
  )
  WITH CHECK (
    public.current_user_role() = 'admin'
    OR (
      id = auth.uid()
      AND role = public.current_user_role()
      AND company_id IS NOT DISTINCT FROM public.current_user_company_id()
    )
  );

-- ※必ず SECURITY INVOKER とすること（SECURITY DEFINER だと current_user が常に postgres になり検証が迂回される）
CREATE OR REPLACE FUNCTION public.protect_profile_sensitive_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  -- DBスーパーユーザー / マイグレーション / service_role / システム管理者は全カラム更新可
  IF current_user IN ('postgres', 'supabase_admin', 'service_role')
     OR COALESCE(auth.role(), '') = 'service_role'
     OR public.current_user_role() = 'admin' THEN
    RETURN NEW;
  END IF;

  -- 一般ユーザー（student / company）による権限・所属・識別カラムの変更を遮断
  IF NEW.id IS DISTINCT FROM OLD.id
     OR NEW.role IS DISTINCT FROM OLD.role
     OR NEW.company_id IS DISTINCT FROM OLD.company_id
     OR NEW.email IS DISTINCT FROM OLD.email
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Forbidden: cannot modify protected profile columns (role, company_id, email, id, created_at).'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_sensitive_columns ON public.profiles;
CREATE TRIGGER trg_protect_profile_sensitive_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_sensitive_columns();

-- -----------------------------------------------------------------------------
-- 2. DB-H2: handle_new_user() トリガーのロール強制（常に 'student' で初期化）
--    ※ admin / company ロール付与はサーバー側 service_role API のみで行う
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company_id UUID := NULL;
  v_company_code TEXT;
  v_full_name TEXT;
BEGIN
  v_company_code := NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'company_code', '')), '');
  v_full_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    split_part(NEW.email, '@', 1)
  );

  -- 企業コードが入力されている場合は companies テーブルから検索
  IF v_company_code IS NOT NULL THEN
    SELECT id INTO v_company_id
    FROM public.companies
    WHERE UPPER(company_code) = UPPER(v_company_code)
    LIMIT 1;
  END IF;

  -- クライアント由来の raw_user_meta_data->>'role' は一切信頼せず常に 'student' 固定
  INSERT INTO public.profiles (id, email, full_name, role, company_id)
  VALUES (NEW.id, NEW.email, v_full_name, 'student', v_company_id)
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        company_id = COALESCE(EXCLUDED.company_id, public.profiles.company_id);

  RETURN NEW;
END;
$$;

-- -----------------------------------------------------------------------------
-- 3. DB-H3: TRUNCATE（RLSバイパス）および過剰権限の剥奪・最小権限再付与
-- -----------------------------------------------------------------------------
-- 3-1. public スキーマ全テーブルから PUBLIC / anon / authenticated の危険権限を一括剥奪
REVOKE TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public FROM PUBLIC, anon, authenticated;

-- 3-2. 20261120_enterprise_features.sql で GRANT ALL された5テーブルを厳格に最小権限化
REVOKE ALL ON TABLE
  public.training_milestones,
  public.student_questions,
  public.audit_logs,
  public.announcement_reads,
  public.graduation_evaluations
FROM anon, authenticated;

-- audit_logs：追記専用（UPDATE / DELETE / TRUNCATE を禁止）
GRANT SELECT, INSERT ON TABLE public.audit_logs TO authenticated;

-- student_questions：質問閲覧・投稿・既読/ステータス更新のみ（DELETE 禁止）
GRANT SELECT, INSERT, UPDATE ON TABLE public.student_questions TO authenticated;

-- training_milestones / announcement_reads / graduation_evaluations：RLS制御下の基本DMLのみ
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE
  public.training_milestones,
  public.announcement_reads,
  public.graduation_evaluations
TO authenticated;

COMMIT;

-- PostgREST スキーマキャッシュ再読み込み
NOTIFY pgrst, 'reload schema';
