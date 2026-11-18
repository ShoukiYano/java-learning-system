-- =============================================================================
-- 3ロール（student / company / admin）初期ログインアカウント一括作成SQL
-- パスワードは全アカウント共通で: Password123!
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  v_student_id UUID := 'a0000000-0000-4000-8000-000000000001';
  v_company_id UUID := 'a0000000-0000-4000-8000-000000000002';
  v_admin_id   UUID := 'a0000000-0000-4000-8000-000000000003';
  v_acme_hr_id UUID := 'a0000000-0000-4000-8000-000000000004';
  v_tech_hr_id UUID := 'a0000000-0000-4000-8000-000000000005';
  v_encrypted_pw TEXT := crypt('Password123!', gen_salt('bf'));
BEGIN
  -- 1. 受講生アカウント (student@example.com / Password123!)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'student@example.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      v_student_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'student@example.com', v_encrypted_pw, now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"山田 太郎（受講生）","role":"student","company_code":"ACME2025"}',
      now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_student_id, v_student_id::text,
      format('{"sub":"%s","email":"student@example.com"}', v_student_id)::jsonb,
      'email', now(), now(), now()
    );
  END IF;

  -- 2. 企業担当者アカウント① (company@example.com / Password123! / 企業コード: ACME2025)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'company@example.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      v_company_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'company@example.com', v_encrypted_pw, now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"ACME人事 担当者","role":"company","company_code":"ACME2025"}',
      now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_company_id, v_company_id::text,
      format('{"sub":"%s","email":"company@example.com"}', v_company_id)::jsonb,
      'email', now(), now(), now()
    );
  END IF;

  -- 3. 企業担当者アカウント②：ACME社 (hr@acme-tech.example.com / Password123! / 企業コード: ACME2025)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'hr@acme-tech.example.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      v_acme_hr_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'hr@acme-tech.example.com', v_encrypted_pw, now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"ACMEテクノロジーズ 研修担当","role":"company","company_code":"ACME2025"}',
      now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_acme_hr_id, v_acme_hr_id::text,
      format('{"sub":"%s","email":"hr@acme-tech.example.com"}', v_acme_hr_id)::jsonb,
      'email', now(), now(), now()
    );
  END IF;

  -- 4. 企業担当者アカウント③：ネクストシステムズ社 (training@next-sys.example.com / Password123! / 企業コード: TECH2025)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'training@next-sys.example.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      v_tech_hr_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'training@next-sys.example.com', v_encrypted_pw, now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"ネクストシステムズ 研修担当","role":"company","company_code":"TECH2025"}',
      now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_tech_hr_id, v_tech_hr_id::text,
      format('{"sub":"%s","email":"training@next-sys.example.com"}', v_tech_hr_id)::jsonb,
      'email', now(), now(), now()
    );
  END IF;

  -- 5. システム管理者アカウント (admin@example.com / Password123!)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@example.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      v_admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'admin@example.com', v_encrypted_pw, now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"佐藤 健一（システム管理者）","role":"admin"}',
      now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_admin_id, v_admin_id::text,
      format('{"sub":"%s","email":"admin@example.com"}', v_admin_id)::jsonb,
      'email', now(), now(), now()
    );
  END IF;

  -- profiles のロールと企業紐付けを確実に反映
  UPDATE public.profiles
  SET role = 'student',
      company_id = '00000000-0000-4000-8000-000000000001'
  WHERE email = 'student@example.com';

  UPDATE public.profiles
  SET role = 'company',
      company_id = '00000000-0000-4000-8000-000000000001'
  WHERE email IN ('company@example.com', 'hr@acme-tech.example.com');

  UPDATE public.profiles
  SET role = 'company',
      company_id = '00000000-0000-4000-8000-000000000002'
  WHERE email = 'training@next-sys.example.com';

  UPDATE public.profiles
  SET role = 'admin',
      company_id = NULL
  WHERE email = 'admin@example.com';
END $$;
