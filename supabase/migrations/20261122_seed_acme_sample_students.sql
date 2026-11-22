-- =============================================================================
-- 株式会社ACMEテクノロジーズ（ACME2025）サンプル受講生 3名 一括登録SQL
--   1. 鈴木 次郎（優秀）    : jiro.suzuki@acme-tech.example.com / Password123!
--   2. 山田 花子（普通）    : hanako.yamada@acme-tech.example.com / Password123!
--   3. 佐藤 三郎（遅れ気味）: saburo.sato@acme-tech.example.com / Password123!
-- 冪等性：何回実行しても安全です。
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  v_acme_id   UUID := '00000000-0000-4000-8000-000000000001';
  v_jiro_id   UUID := 'a0000000-0000-4000-8000-000000000101';
  v_hanako_id UUID := 'a0000000-0000-4000-8000-000000000102';
  v_saburo_id UUID := 'a0000000-0000-4000-8000-000000000103';
  v_admin_id  UUID;
  v_pw        TEXT := crypt('Password123!', gen_salt('bf'));
  v_total_p   INTEGER;
  v_first_pid UUID;
BEGIN
  -- ACME社レコードが存在しない場合は作成
  INSERT INTO public.companies (id, name, company_code, contact_email)
  VALUES (v_acme_id, '株式会社ACMEテクノロジーズ', 'ACME2025', 'hr@acme-tech.example.com')
  ON CONFLICT (id) DO NOTHING;

  -- 1. 鈴木 次郎（優秀）
  SELECT id INTO v_jiro_id FROM auth.users WHERE email = 'jiro.suzuki@acme-tech.example.com';
  IF v_jiro_id IS NULL THEN
    v_jiro_id := 'a0000000-0000-4000-8000-000000000101';
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      v_jiro_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'jiro.suzuki@acme-tech.example.com', v_pw, now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"鈴木 次郎","role":"student","company_code":"ACME2025"}',
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_jiro_id, v_jiro_id::text,
      format('{"sub":"%s","email":"jiro.suzuki@acme-tech.example.com"}', v_jiro_id)::jsonb,
      'email', now(), now(), now()
    );
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role, company_id, streak_days, last_study_date, last_login_at)
  VALUES (v_jiro_id, 'jiro.suzuki@acme-tech.example.com', '鈴木 次郎', 'student', v_acme_id, 7, CURRENT_DATE, now())
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = 'student',
    company_id = v_acme_id,
    streak_days = 7,
    last_study_date = CURRENT_DATE,
    last_login_at = now();

  -- 2. 山田 花子（普通）
  SELECT id INTO v_hanako_id FROM auth.users WHERE email = 'hanako.yamada@acme-tech.example.com';
  IF v_hanako_id IS NULL THEN
    v_hanako_id := 'a0000000-0000-4000-8000-000000000102';
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      v_hanako_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'hanako.yamada@acme-tech.example.com', v_pw, now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"山田 花子","role":"student","company_code":"ACME2025"}',
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_hanako_id, v_hanako_id::text,
      format('{"sub":"%s","email":"hanako.yamada@acme-tech.example.com"}', v_hanako_id)::jsonb,
      'email', now(), now(), now()
    );
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role, company_id, streak_days, last_study_date, last_login_at)
  VALUES (v_hanako_id, 'hanako.yamada@acme-tech.example.com', '山田 花子', 'student', v_acme_id, 3, CURRENT_DATE - 1, now() - interval '1 day')
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = 'student',
    company_id = v_acme_id,
    streak_days = 3,
    last_study_date = CURRENT_DATE - 1,
    last_login_at = now() - interval '1 day';

  -- 3. 佐藤 三郎（遅れ気味：8日未ログイン・低進捗）
  SELECT id INTO v_saburo_id FROM auth.users WHERE email = 'saburo.sato@acme-tech.example.com';
  IF v_saburo_id IS NULL THEN
    v_saburo_id := 'a0000000-0000-4000-8000-000000000103';
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      v_saburo_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'saburo.sato@acme-tech.example.com', v_pw, now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"佐藤 三郎","role":"student","company_code":"ACME2025"}',
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), v_saburo_id, v_saburo_id::text,
      format('{"sub":"%s","email":"saburo.sato@acme-tech.example.com"}', v_saburo_id)::jsonb,
      'email', now() - interval '8 days', now(), now()
    );
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role, company_id, streak_days, last_study_date, last_login_at)
  VALUES (v_saburo_id, 'saburo.sato@acme-tech.example.com', '佐藤 三郎', 'student', v_acme_id, 0, CURRENT_DATE - 8, now() - interval '8 days')
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = 'student',
    company_id = v_acme_id,
    streak_days = 0,
    last_study_date = CURRENT_DATE - 8,
    last_login_at = now() - interval '8 days';

  -- 4. 問題進捗（progress）をカリキュラム開放順（courses.order_index → chapters.order_index → problems.order_index）に厳密に従って投入
  -- 既存の混在進捗をクリーンアップしてから再投入
  DELETE FROM public.progress WHERE user_id IN (v_jiro_id, v_hanako_id, v_saburo_id);

  SELECT COUNT(*) INTO v_total_p FROM public.problems WHERE is_published = true;
  IF v_total_p > 0 THEN
    -- 鈴木 次郎（優秀）：Java入門(16)→初級(6)→中級(6)→上級(6)→SQL(20)→Git(4) = 58問（約85%）
    INSERT INTO public.progress (user_id, problem_id, status, attempts_count, total_time_spent_seconds, unlocked_hint_step, completed_at, updated_at)
    SELECT v_jiro_id, p.id, 'completed', 1, 420, 0, now() - interval '1 day', now()
    FROM public.problems p
    JOIN public.lessons l ON l.id = p.lesson_id
    JOIN public.chapters ch ON ch.id = l.chapter_id
    JOIN public.courses c ON c.id = ch.course_id
    WHERE p.is_published = true
      AND (
        c.order_index IN (1, 2, 3, 4, 6)
        OR (c.order_index = 5 AND p.id IN (
          SELECT p2.id
          FROM public.problems p2
          JOIN public.lessons l2 ON l2.id = p2.lesson_id
          JOIN public.chapters ch2 ON ch2.id = l2.chapter_id
          JOIN public.courses c2 ON c2.id = ch2.course_id
          WHERE p2.is_published = true AND c2.order_index = 5
          ORDER BY ch2.order_index, p2.order_index, p2.id
          LIMIT 20
        ))
      )
    ON CONFLICT (user_id, problem_id) DO UPDATE SET status = 'completed', attempts_count = 1, updated_at = now();

    -- 山田 花子（普通）：Java入門(16)→初級(6)→中級(6)完了（上級・SQL開放済）＋上級(2)＋SQL(2)＋Git(2) = 34問（50%）
    INSERT INTO public.progress (user_id, problem_id, status, attempts_count, total_time_spent_seconds, unlocked_hint_step, completed_at, updated_at)
    SELECT v_hanako_id, p.id, 'completed', 2, 660, 1, now() - interval '2 days', now() - interval '1 day'
    FROM public.problems p
    JOIN public.lessons l ON l.id = p.lesson_id
    JOIN public.chapters ch ON ch.id = l.chapter_id
    JOIN public.courses c ON c.id = ch.course_id
    WHERE p.is_published = true
      AND (
        c.order_index IN (1, 2, 3)
        OR (c.order_index = 4 AND p.id IN (
          SELECT p2.id FROM public.problems p2
          JOIN public.lessons l2 ON l2.id = p2.lesson_id
          JOIN public.chapters ch2 ON ch2.id = l2.chapter_id
          JOIN public.courses c2 ON c2.id = ch2.course_id
          WHERE p2.is_published = true AND c2.order_index = 4
          ORDER BY ch2.order_index, p2.order_index, p2.id
          LIMIT 2
        ))
        OR (c.order_index = 5 AND p.id IN (
          SELECT p2.id FROM public.problems p2
          JOIN public.lessons l2 ON l2.id = p2.lesson_id
          JOIN public.chapters ch2 ON ch2.id = l2.chapter_id
          JOIN public.courses c2 ON c2.id = ch2.course_id
          WHERE p2.is_published = true AND c2.order_index = 5
          ORDER BY ch2.order_index, p2.order_index, p2.id
          LIMIT 2
        ))
        OR (c.order_index = 6 AND p.id IN (
          SELECT p2.id FROM public.problems p2
          JOIN public.lessons l2 ON l2.id = p2.lesson_id
          JOIN public.chapters ch2 ON ch2.id = l2.chapter_id
          JOIN public.courses c2 ON c2.id = ch2.course_id
          WHERE p2.is_published = true AND c2.order_index = 6
          ORDER BY ch2.order_index, p2.order_index, p2.id
          LIMIT 2
        ))
      )
    ON CONFLICT (user_id, problem_id) DO UPDATE SET status = 'completed', attempts_count = 2, updated_at = now() - interval '1 day';

    -- 佐藤 三郎（遅れ気味）：Java入門の最初の7問のみクリア（第2章で停滞中・他コースは未開放のため0問）
    INSERT INTO public.progress (user_id, problem_id, status, attempts_count, total_time_spent_seconds, unlocked_hint_step, completed_at, updated_at)
    SELECT v_saburo_id, sub.id, 'completed', 3, 900, 2, now() - interval '9 days', now() - interval '8 days'
    FROM (
      SELECT p.id
      FROM public.problems p
      JOIN public.lessons l ON l.id = p.lesson_id
      JOIN public.chapters ch ON ch.id = l.chapter_id
      JOIN public.courses c ON c.id = ch.course_id
      WHERE p.is_published = true AND c.order_index = 1
      ORDER BY ch.order_index, p.order_index, p.id
      LIMIT 7
    ) sub
    ON CONFLICT (user_id, problem_id) DO UPDATE SET status = 'completed', attempts_count = 3, updated_at = now() - interval '8 days';

    INSERT INTO public.progress (user_id, problem_id, status, attempts_count, total_time_spent_seconds, unlocked_hint_step, completed_at, updated_at)
    SELECT v_saburo_id, sub.id, 'in_progress', 5, 1200, 3, NULL, now() - interval '8 days'
    FROM (
      SELECT p.id
      FROM public.problems p
      JOIN public.lessons l ON l.id = p.lesson_id
      JOIN public.chapters ch ON ch.id = l.chapter_id
      JOIN public.courses c ON c.id = ch.course_id
      WHERE p.is_published = true AND c.order_index = 1
      ORDER BY ch.order_index, p.order_index, p.id
      OFFSET 7 LIMIT 1
    ) sub
    ON CONFLICT (user_id, problem_id) DO UPDATE SET status = 'in_progress', attempts_count = 5, updated_at = now() - interval '8 days';

    -- 代表的な提出履歴（1件ずつ：Java入門の1問目）
    SELECT p.id INTO v_first_pid
    FROM public.problems p
    JOIN public.lessons l ON l.id = p.lesson_id
    JOIN public.chapters ch ON ch.id = l.chapter_id
    JOIN public.courses c ON c.id = ch.course_id
    WHERE p.is_published = true AND c.order_index = 1
    ORDER BY ch.order_index, p.order_index, p.id
    LIMIT 1;
    IF v_first_pid IS NOT NULL THEN
      INSERT INTO public.submissions (user_id, problem_id, code, status, passed_count, total_count, execution_time_ms, memory_kb, time_spent_seconds, created_at)
      SELECT v_jiro_id, id, solution_code, 'passed', 2, 2, 12, 256, 300, now() - interval '3 hours'
      FROM public.problems WHERE id = v_first_pid
      AND NOT EXISTS (SELECT 1 FROM public.submissions WHERE user_id = v_jiro_id);

      INSERT INTO public.submissions (user_id, problem_id, code, status, passed_count, total_count, execution_time_ms, memory_kb, time_spent_seconds, created_at)
      SELECT v_hanako_id, id, solution_code, 'passed', 2, 2, 18, 256, 540, now() - interval '1 day'
      FROM public.problems WHERE id = v_first_pid
      AND NOT EXISTS (SELECT 1 FROM public.submissions WHERE user_id = v_hanako_id);

      INSERT INTO public.submissions (user_id, problem_id, code, status, passed_count, total_count, execution_time_ms, memory_kb, time_spent_seconds, created_at)
      SELECT v_saburo_id, id, starter_code, 'wrong_answer', 0, 2, 15, 256, 780, now() - interval '8 days'
      FROM public.problems WHERE id = v_first_pid
      AND NOT EXISTS (SELECT 1 FROM public.submissions WHERE user_id = v_saburo_id);
    END IF;
  END IF;

  -- 5. 学習ログ（study_logs）
  INSERT INTO public.study_logs (user_id, study_date, minutes, problems_solved)
  VALUES
    (v_jiro_id, CURRENT_DATE,     65, 5),
    (v_jiro_id, CURRENT_DATE - 1, 60, 4),
    (v_jiro_id, CURRENT_DATE - 2, 60, 4),
    (v_hanako_id, CURRENT_DATE - 1, 55, 3),
    (v_hanako_id, CURRENT_DATE - 2, 55, 2),
    (v_saburo_id, CURRENT_DATE - 8, 25, 1)
  ON CONFLICT (user_id, study_date) DO UPDATE SET
    minutes = EXCLUDED.minutes,
    problems_solved = EXCLUDED.problems_solved;

  -- 6. 講師評価・コメント（feedbacks）
  SELECT id INTO v_admin_id FROM public.profiles WHERE role IN ('admin', 'company') ORDER BY role LIMIT 1;
  IF v_admin_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.feedbacks WHERE student_id = v_jiro_id) THEN
      INSERT INTO public.feedbacks (student_id, admin_id, rating, comment, created_at)
      VALUES (v_jiro_id, v_admin_id, 5, 'オブジェクト指向からSQL結合まで一発合格が多く非常に優秀です。実践課題もスムーズに進められています。', now() - interval '1 day');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.feedbacks WHERE student_id = v_hanako_id) THEN
      INSERT INTO public.feedbacks (student_id, admin_id, rating, comment, created_at)
      VALUES (v_hanako_id, v_admin_id, 4, '基礎構文とループが着実に定着しており順調なペースです。次回は配列とオブジェクト指向を重点的に復習しましょう。', now() - interval '2 days');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.feedbacks WHERE student_id = v_saburo_id) THEN
      INSERT INTO public.feedbacks (student_id, admin_id, rating, comment, created_at)
      VALUES (v_saburo_id, v_admin_id, 2, '第2章でつまずいており、直近8日間ログインが途絶えています。早めの1on1フォロー・声かけを推奨します。', now() - interval '7 days');
    END IF;
  END IF;
END $$;
