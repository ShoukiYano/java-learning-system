-- =============================================================================
-- Git実践マスターコース（2章・2単元・全4問）シードマイグレーション
-- 目的：
--   courses / chapters / lessons / problems / test_cases / hints に
--   Gitコースおよび配下4問を登録し、company_courses / student_course_locks /
--   submissions / progress の外部キー制約をすべて満たすようにします。
-- 冪等性：何回実行しても安全です（ON CONFLICT DO UPDATE + 子テーブル洗い替え）。
-- =============================================================================

-- 1. コース登録
INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES (
  '4107aaa5-10f0-41ca-8c22-a3a99eeebcbb',
  'Git実践マスター：ビジュアル分岐・マージ演習',
  'ブラウザ上でコミットやブランチの分岐・マージをリアルタイムに視覚化しながら学ぶ、実践的Gitトレーニング。コマンドライン操作とツリー構造の直感的理解を深めます。',
  6,
  true,
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id;

-- 2. 章（2章）登録
INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES
  (
    'c29397c4-6902-4601-94b7-c1c782ed0405',
    '4107aaa5-10f0-41ca-8c22-a3a99eeebcbb',
    'Git第1章：コミットの基礎とブランチ作成',
    'コミットの作成（git commit）と新ブランチの分岐・切り替え（git branch / git switch）を学びます。',
    1,
    true
  ),
  (
    '9ebaae70-bf77-46cb-a8a6-a827b7831cbd',
    '4107aaa5-10f0-41ca-8c22-a3a99eeebcbb',
    'Git第2章：ブランチの統合と履歴操作',
    'Fast-forwardマージ、3-Wayマージ、およびRebaseによるコミット履歴の付け替えを学びます。',
    2,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

-- 3. 単元（2単元）登録
INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES
  (
    '1c09eb0c-7300-440d-9894-8ccbee254d4d',
    'c29397c4-6902-4601-94b7-c1c782ed0405',
    '1-1. コミットとブランチの基本',
    '',
    1,
    true
  ),
  (
    '61a155fe-360f-41fc-b6de-2a9a00967f52',
    '9ebaae70-bf77-46cb-a8a6-a827b7831cbd',
    '2-1. マージとRebaseの実践',
    '',
    1,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

-- 4. 問題（全4問）登録
INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES
  (
    'f1f2b638-0364-44fb-b855-88ce8a1eeb3b',
    '1c09eb0c-7300-440d-9894-8ccbee254d4d',
    'Git 1-1. 初めてのコミット作成（git commit）',
    E'### ミッション概要\nGitの最も基本的な操作であるコミット（`git commit`）を作成しましょう。\n\n現在、リポジトリには初期コミット `C0` が存在し、`main` ブランチがそれを指しています。\n`git commit` コマンドを **2回** 実行して、コミット `C1` と `C2` を追加し、`main` ブランチを進めてください。\n\n### 達成条件\n- `main` ブランチが新しく作成されたコミット（C2）を指していること。\n- 右上の「到達目標 (Goal)」と同じツリー構造にすること。',
    'easy',
    5,
    ARRAY['Git基礎', 'コミット操作'],
    '',
    E'git commit -m "first commit"\ngit commit -m "second commit"',
    '`git commit` を実行すると、現在のHEADが指しているコミットの直下に新しいコミットノードが作成され、ブランチのポインタが自動的に前進します。',
    1,
    true
  ),
  (
    'b05d7199-850f-4ce6-8c2d-50362abf643a',
    '1c09eb0c-7300-440d-9894-8ccbee254d4d',
    'Git 1-2. 新規ブランチの作成と切り替え（git branch / git switch）',
    E'### ミッション概要\n新しい機能開発やバグ修正を行うため、`bugfix` という名前の新しいブランチを作成して切り替え、コミットを作成しましょう。\n\n### 手順\n1. `git branch bugfix` で新ブランチ `bugfix` を作成する。\n2. `git switch bugfix` で `bugfix` ブランチに切り替える。\n   （または `git switch -c bugfix` で作成と切り替えを同時に行っても構いません）\n3. `git commit` を1回実行して、`bugfix` ブランチ上で作業を進める。\n\n### 達成条件\n- `main` ブランチは初期コミット `C0` のままであること。\n- `bugfix` ブランチが新コミット `C1` を指し、現在 `HEAD` が `bugfix` を指していること。',
    'easy',
    8,
    ARRAY['Gitブランチ', 'チェックアウト'],
    '',
    E'git branch bugfix\ngit switch bugfix\ngit commit -m "fix bug"',
    '`git branch <名前>` でブランチを作成し、`git switch <名前>` で作業ブランチを切り替えます。`git switch -c <名前>` を使えば1コマンドで両方を同時に実行できます。',
    2,
    true
  ),
  (
    'f3da9229-efeb-44bf-be80-926c2319811d',
    '61a155fe-360f-41fc-b6de-2a9a00967f52',
    'Git 2-1. ブランチの統合（git merge）',
    E'### ミッション概要\n独立して開発された `feature` ブランチを、本線である `main` ブランチに統合（マージ）しましょう。\n\n初期状態では、`main` でコミット `C1`、`feature` でコミット `C2` がそれぞれ分岐しています。\n\n### 手順\n1. `main` ブランチに切り替える（すでに `main` にいるか `git status` で確認）。\n2. `git merge feature` を実行して、`feature` ブランチの変更を `main` に統合する。\n\n### 達成条件\n- `main` ブランチに2つの親（C1とC2）を持つマージコミットが作成されていること。',
    'medium',
    10,
    ARRAY['Gitマージ', 'ブランチ統合'],
    E'git commit -m "main work"\ngit switch -c feature\ngit commit -m "feature work"\ngit switch main\ngit commit -m "main update"',
    E'git commit -m "main work"\ngit switch -c feature\ngit commit -m "feature work"\ngit switch main\ngit commit -m "main update"\ngit merge feature',
    '`git merge <ブランチ名>` を実行すると、現在のブランチに指定ブランチの履歴が統合されます。分岐している場合は、双方の親を持つマージコミットが新しく作成されます。',
    1,
    true
  ),
  (
    'ebc882bf-b24e-4d04-976b-1cb4933570ef',
    '61a155fe-360f-41fc-b6de-2a9a00967f52',
    'Git 2-2. 履歴の付け替え（git rebase）',
    E'### ミッション概要\nコミット履歴をきれいに一本化するため、`git rebase` を使って `feature` ブランチのコミットを `main` ブランチの先端に付け替えましょう。\n\n### 手順\n1. `feature` ブランチに切り替える（`git switch feature`）。\n2. `git rebase main` を実行して、`feature` のコミットを `main` の最新コミットの上に再配置する。\n\n### 達成条件\n- `feature` ブランチが `main` の上に一本の線として付け替えられていること。',
    'medium',
    10,
    ARRAY['Gitリベース', '履歴整理'],
    E'git commit -m "c1"\ngit switch -c feature\ngit commit -m "f1"\ngit switch main\ngit commit -m "c2"\ngit switch feature',
    E'git commit -m "c1"\ngit switch -c feature\ngit commit -m "f1"\ngit switch main\ngit commit -m "c2"\ngit switch feature\ngit rebase main',
    '`git rebase <ブランチ名>` は、現在のブランチのコミットをターゲットブランチの先端に順番にコピーして付け替えることで、直線的で見やすい履歴を作成するコマンドです。',
    2,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

-- 5. テストケース洗い替え登録
DELETE FROM public.test_cases
WHERE problem_id IN (
  'f1f2b638-0364-44fb-b855-88ce8a1eeb3b',
  'b05d7199-850f-4ce6-8c2d-50362abf643a',
  'f3da9229-efeb-44bf-be80-926c2319811d',
  'ebc882bf-b24e-4d04-976b-1cb4933570ef'
);

INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES
  ('f1f2b638-0364-44fb-b855-88ce8a1eeb3b', '公開テスト1：コミットの追加とブランチ前進', '', 'CLEAR: 目標ツリーと完全一致', false, 1),
  ('b05d7199-850f-4ce6-8c2d-50362abf643a', '公開テスト1：ブランチ作成と切り替えコミット', '', 'CLEAR: 目標ツリーと完全一致', false, 1),
  ('f3da9229-efeb-44bf-be80-926c2319811d', '公開テスト1：マージコミットの生成', '', 'CLEAR: 目標ツリーと完全一致', false, 1),
  ('ebc882bf-b24e-4d04-976b-1cb4933570ef', '公開テスト1：Rebaseによる履歴一本化', '', 'CLEAR: 目標ツリーと完全一致', false, 1);

-- 6. ヒント洗い替え登録
DELETE FROM public.hints
WHERE problem_id IN (
  'f1f2b638-0364-44fb-b855-88ce8a1eeb3b',
  'b05d7199-850f-4ce6-8c2d-50362abf643a',
  'f3da9229-efeb-44bf-be80-926c2319811d',
  'ebc882bf-b24e-4d04-976b-1cb4933570ef'
);

INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES
  ('f1f2b638-0364-44fb-b855-88ce8a1eeb3b', 1, 'ターミナルに `git commit` と入力して Enter キーを押してください。'),
  ('f1f2b638-0364-44fb-b855-88ce8a1eeb3b', 2, 'もう一度 `git commit` を実行して、2つ目のコミットを作成すれば目標達成です。'),
  ('b05d7199-850f-4ce6-8c2d-50362abf643a', 1, '`git branch bugfix` でブランチを作成します。'),
  ('b05d7199-850f-4ce6-8c2d-50362abf643a', 2, '`git switch bugfix` で切り替えてから、`git commit` を実行します。'),
  ('f3da9229-efeb-44bf-be80-926c2319811d', 1, 'まず `git switch main` で main ブランチにいることを確認します。'),
  ('f3da9229-efeb-44bf-be80-926c2319811d', 2, '`git merge feature` を実行すると、3-wayマージコミットが作成されます。'),
  ('ebc882bf-b24e-4d04-976b-1cb4933570ef', 1, 'まず `git switch feature` で feature ブランチに切り替えます。'),
  ('ebc882bf-b24e-4d04-976b-1cb4933570ef', 2, '`git rebase main` を実行すると、feature のコミットが main の先端に付け替えられます。');
