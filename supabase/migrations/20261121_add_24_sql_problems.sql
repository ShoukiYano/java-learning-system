-- =============================================================================
-- SQL実践コース拡充マイグレーション（第4章・第5章＋新規24問＝既存6問と合わせて計30問）
-- 自己完結・冪等（chapters -> lessons -> problems -> test_cases -> hints）
-- =============================================================================

-- 1. SQLコース説明文を更新（全30問対応）
UPDATE public.courses SET description = 'SELECT/WHERE/LIKE/BETWEEN/IN/DISTINCT/NULL・集計・多段JOIN・INSERT/UPDATE/DELETE・CASE式・サブクエリまで全30問で実務SQLを完全習得します。' WHERE id = '11111111-1111-4111-8111-111111111102';

-- 2. 新規章（第4章・第5章）を登録
INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('161492c6-3dbf-4334-ae62-f8663398bff2', '11111111-1111-4111-8111-111111111102', 'SQL第4章：データ登録・更新・削除（CRUD実践）', 'INSERT / UPDATE / DELETE による安全なデータ操作と、WHERE句による影響範囲の制御を実践します。', 4, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = true;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('571de134-3ea0-4199-a153-d8f6d849dc00', '11111111-1111-4111-8111-111111111102', 'SQL第5章：CASE式・サブクエリ・実務総合', 'CASE WHENによる条件分類、スカラー/IN/NOT INサブクエリ、JOINと組み合わせた実務レポート作成を習得します。', 5, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = true;

-- 3. 新規単元（第4章・第5章）を登録
INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('519b8ab3-20c4-42e5-b1d5-fde2c14f90e9', '161492c6-3dbf-4334-ae62-f8663398bff2', '4-1. INSERT / UPDATE / DELETE の実務操作', 'INSERT / UPDATE / DELETE による安全なデータ操作と、WHERE句による影響範囲の制御を実践します。', 1, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content_md = EXCLUDED.content_md,
  is_published = true;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('f9136887-f979-41ad-a902-654f1eaef5bd', '571de134-3ea0-4199-a153-d8f6d849dc00', '5-1. CASE式・サブクエリ・実務総合演習', 'CASE WHENによる条件分類、スカラー/IN/NOT INサブクエリ、JOINと組み合わせた実務レポート作成を習得します。', 1, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content_md = EXCLUDED.content_md,
  is_published = true;

-- 4. 新規SQL問題 24問＋テストケース＋ヒント
-- SQL 1-3. 複合条件での商品検索（AND / OR）
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('66f2b715-e922-4c41-a71e-f45ed57c973b', '33333333-3333-4333-8333-333333333311', 'SQL 1-3. 複合条件での商品検索（AND / OR）', '### 問題概要
商品テーブル `products` から、カテゴリ（`category`）が `''Book''` **かつ** 価格（`price`）が `2000` 円以下の商品名（`name`）と価格（`price`）を価格の安い順に抽出してください。

### 期待される出力カラム
`name`, `price`', 'easy', 8, ARRAY['SQL抽出', '基礎構文']::text[], 'SELECT name, price
FROM products
', 'SELECT name, price
FROM products
WHERE category = ''Book'' AND price <= 2000
ORDER BY price ASC;', '複数条件をすべて満たす行を抽出するときは `AND` でつなぎます。並び替えは `ORDER BY price ASC` で昇順にします。', 3, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = '66f2b715-e922-4c41-a71e-f45ed57c973b';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('66f2b715-e922-4c41-a71e-f45ed57c973b', '公開テスト1：書籍かつ2000円以下', 'CREATE TABLE products (id INT, name TEXT, category TEXT, price INT);
INSERT INTO products VALUES (1, ''Java Intro'', ''Book'', 2800), (2, ''SQL Pocket'', ''Book'', 1500), (3, ''Git Guide'', ''Book'', 2000), (4, ''Mouse'', ''Hardware'', 1800);', 'name | price
SQL Pocket | 1500
Git Guide | 2000', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('66f2b715-e922-4c41-a71e-f45ed57c973b', '非公開テスト1：別データセット', 'CREATE TABLE products (id INT, name TEXT, category TEXT, price INT);
INSERT INTO products VALUES (1, ''Clean Code'', ''Book'', 1900), (2, ''Notebook'', ''Stationery'', 500), (3, ''Alg Book'', ''Book'', 1200);', 'name | price
Alg Book | 1200
Clean Code | 1900', true, 2);

DELETE FROM public.hints WHERE problem_id = '66f2b715-e922-4c41-a71e-f45ed57c973b';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('66f2b715-e922-4c41-a71e-f45ed57c973b', 1, '`WHERE category = ''Book'' AND price <= 2000` と記述します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('66f2b715-e922-4c41-a71e-f45ed57c973b', 2, '末尾に `ORDER BY price ASC;` を付けて昇順に並べます。');

-- SQL 1-4. 部分一致と範囲指定での検索（LIKE / BETWEEN）
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('32aa5331-3236-479e-83f2-89f32aca9f5c', '33333333-3333-4333-8333-333333333311', 'SQL 1-4. 部分一致と範囲指定での検索（LIKE / BETWEEN）', '### 問題概要
商品テーブル `products` から、商品名（`name`）に `''Java''` を含み、**かつ** 価格（`price`）が `1000` 以上 `3000` 以下の `name`, `price` を `id` 昇順で取得してください。

### 期待される出力カラム
`name`, `price`', 'easy', 10, ARRAY['SQL抽出', 'LIKE', 'BETWEEN']::text[], 'SELECT name, price
FROM products
', 'SELECT name, price
FROM products
WHERE name LIKE ''%Java%'' AND price BETWEEN 1000 AND 3000
ORDER BY id ASC;', '部分一致検索には `LIKE ''%文字列%''`、両端を含む範囲指定には `BETWEEN 下限 AND 上限` を使います。', 4, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = '32aa5331-3236-479e-83f2-89f32aca9f5c';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('32aa5331-3236-479e-83f2-89f32aca9f5c', '公開テスト1：Javaを含む1000〜3000円の商品', 'CREATE TABLE products (id INT, name TEXT, price INT);
INSERT INTO products VALUES (1, ''Java Basic'', 2500), (2, ''Java Master'', 4200), (3, ''SQL Basic'', 2000), (4, ''Effective Java'', 3000);', 'name | price
Java Basic | 2500
Effective Java | 3000', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('32aa5331-3236-479e-83f2-89f32aca9f5c', '非公開テスト1：境界値1000円', 'CREATE TABLE products (id INT, name TEXT, price INT);
INSERT INTO products VALUES (1, ''Mini Java'', 1000), (2, ''Tiny Java'', 999);', 'name | price
Mini Java | 1000', true, 2);

DELETE FROM public.hints WHERE problem_id = '32aa5331-3236-479e-83f2-89f32aca9f5c';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('32aa5331-3236-479e-83f2-89f32aca9f5c', 1, '部分一致は `name LIKE ''%Java%''` を使います。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('32aa5331-3236-479e-83f2-89f32aca9f5c', 2, '範囲指定は `price BETWEEN 1000 AND 3000` を使います。');

-- SQL 1-5. 複数候補の一致と重複除外（IN / DISTINCT）
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('dc0322b7-ee2e-4c18-8a68-aaeacf0c9f73', '33333333-3333-4333-8333-333333333311', 'SQL 1-5. 複数候補の一致と重複除外（IN / DISTINCT）', '### 問題概要
社員テーブル `employees` から、部門（`department`）が `''Engineering''` または `''Design''` に所属する社員の **勤務地（`city`）一覧を重複なしで昇順** に取得してください。

### 期待される出力カラム
`city`', 'easy', 10, ARRAY['SQL抽出', 'IN', 'DISTINCT']::text[], 'SELECT DISTINCT city
FROM employees
', 'SELECT DISTINCT city
FROM employees
WHERE department IN (''Engineering'', ''Design'')
ORDER BY city ASC;', '複数候補のいずれかに一致する条件は `IN (''A'', ''B'')` で簡潔に書けます。結果の重複を消すには `SELECT DISTINCT` を使います。', 5, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = 'dc0322b7-ee2e-4c18-8a68-aaeacf0c9f73';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('dc0322b7-ee2e-4c18-8a68-aaeacf0c9f73', '公開テスト1：重複除外とIN句', 'CREATE TABLE employees (id INT, name TEXT, department TEXT, city TEXT);
INSERT INTO employees VALUES (1, ''A'', ''Engineering'', ''Tokyo''), (2, ''B'', ''Design'', ''Osaka''), (3, ''C'', ''Engineering'', ''Tokyo''), (4, ''D'', ''Sales'', ''Fukuoka'');', 'city
Osaka
Tokyo', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('dc0322b7-ee2e-4c18-8a68-aaeacf0c9f73', '非公開テスト1：単一都市のみ', 'CREATE TABLE employees (id INT, name TEXT, department TEXT, city TEXT);
INSERT INTO employees VALUES (1, ''X'', ''Design'', ''Nagoya''), (2, ''Y'', ''Design'', ''Nagoya''), (3, ''Z'', ''HR'', ''Sapporo'');', 'city
Nagoya', true, 2);

DELETE FROM public.hints WHERE problem_id = 'dc0322b7-ee2e-4c18-8a68-aaeacf0c9f73';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('dc0322b7-ee2e-4c18-8a68-aaeacf0c9f73', 1, '`WHERE department IN (''Engineering'', ''Design'')` で対象部門を絞ります。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('dc0322b7-ee2e-4c18-8a68-aaeacf0c9f73', 2, '`SELECT DISTINCT city` と `ORDER BY city ASC;` で重複除外・昇順出力します。');

-- SQL 1-6. NULL判定とページネーション（IS NOT NULL / LIMIT / OFFSET）
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('d760fcde-22a2-46a5-8490-06f98162dd6f', '33333333-3333-4333-8333-333333333311', 'SQL 1-6. NULL判定とページネーション（IS NOT NULL / LIMIT / OFFSET）', '### 問題概要
顧客テーブル `customers` から、メールアドレス（`email`）が **未登録（`NULL`）でない** 顧客を `id` 昇順に並べ、**2ページ目（1ページ2件＝先頭2件を飛ばして次の2件）** の `id`, `name`, `email` を取得してください。

### 期待される出力カラム
`id`, `name`, `email`', 'medium', 12, ARRAY['SQL抽出', 'NULL', 'LIMIT']::text[], 'SELECT id, name, email
FROM customers
', 'SELECT id, name, email
FROM customers
WHERE email IS NOT NULL
ORDER BY id ASC
LIMIT 2 OFFSET 2;', 'NULLの比較には `!=` ではなく必ず `IS NOT NULL`（または `IS NULL`）を使います。Web一覧画面のページングでは `LIMIT 件数 OFFSET スキップ件数` を組み合わせます。', 6, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = 'd760fcde-22a2-46a5-8490-06f98162dd6f';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('d760fcde-22a2-46a5-8490-06f98162dd6f', '公開テスト1：NULL除外後の2ページ目', 'CREATE TABLE customers (id INT, name TEXT, email TEXT);
INSERT INTO customers VALUES (1, ''A'', ''a@ex.com''), (2, ''B'', NULL), (3, ''C'', ''c@ex.com''), (4, ''D'', ''d@ex.com''), (5, ''E'', ''e@ex.com''), (6, ''F'', ''f@ex.com'');', 'id | name | email
4 | D | d@ex.com
5 | E | e@ex.com', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('d760fcde-22a2-46a5-8490-06f98162dd6f', '非公開テスト1：端数1件の2ページ目', 'CREATE TABLE customers (id INT, name TEXT, email TEXT);
INSERT INTO customers VALUES (1, ''U1'', ''u1@ex.com''), (2, ''U2'', ''u2@ex.com''), (3, ''U3'', NULL), (4, ''U4'', ''u4@ex.com'');', 'id | name | email
4 | U4 | u4@ex.com', true, 2);

DELETE FROM public.hints WHERE problem_id = 'd760fcde-22a2-46a5-8490-06f98162dd6f';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('d760fcde-22a2-46a5-8490-06f98162dd6f', 1, '`WHERE email IS NOT NULL` でメールアドレス登録済みの行だけを残します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('d760fcde-22a2-46a5-8490-06f98162dd6f', 2, '`ORDER BY id ASC LIMIT 2 OFFSET 2;` で3件目・4件目を取得します。');

-- SQL 2-3. カテゴリ別の最高価格・最低価格・商品数（MAX / MIN / COUNT）
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('641d1fa4-6ed1-4fb5-ab6a-9b70eef328ac', '33333333-3333-4333-8333-333333333312', 'SQL 2-3. カテゴリ別の最高価格・最低価格・商品数（MAX / MIN / COUNT）', '### 問題概要
商品テーブル `products` から、カテゴリ（`category`）ごとの **商品数（`item_count`）**・**最高価格（`max_price`）**・**最低価格（`min_price`）** を `category` 昇順で取得してください。

### 期待される出力カラム
`category`, `item_count`, `max_price`, `min_price`', 'easy', 10, ARRAY['SQL集計', 'GROUP BY']::text[], 'SELECT category, COUNT(*) AS item_count
FROM products
', 'SELECT category, COUNT(*) AS item_count, MAX(price) AS max_price, MIN(price) AS min_price
FROM products
GROUP BY category
ORDER BY category ASC;', '`GROUP BY` と `COUNT(*)`, `MAX()`, `MIN()` を組み合わせることで、カテゴリごとの価格レンジと登録件数を1クエリで集計できます。', 3, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = '641d1fa4-6ed1-4fb5-ab6a-9b70eef328ac';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('641d1fa4-6ed1-4fb5-ab6a-9b70eef328ac', '公開テスト1：2カテゴリの価格帯集計', 'CREATE TABLE products (id INT, category TEXT, price INT);
INSERT INTO products VALUES (1, ''Book'', 1500), (2, ''Book'', 3200), (3, ''Book'', 2000), (4, ''Device'', 8000), (5, ''Device'', 12000);', 'category | item_count | max_price | min_price
Book | 3 | 3200 | 1500
Device | 2 | 12000 | 8000', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('641d1fa4-6ed1-4fb5-ab6a-9b70eef328ac', '非公開テスト1：単一商品カテゴリ', 'CREATE TABLE products (id INT, category TEXT, price INT);
INSERT INTO products VALUES (1, ''Food'', 500), (2, ''App'', 980), (3, ''App'', 300);', 'category | item_count | max_price | min_price
App | 2 | 980 | 300
Food | 1 | 500 | 500', true, 2);

DELETE FROM public.hints WHERE problem_id = '641d1fa4-6ed1-4fb5-ab6a-9b70eef328ac';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('641d1fa4-6ed1-4fb5-ab6a-9b70eef328ac', 1, '`MAX(price) AS max_price, MIN(price) AS min_price` をSELECTに追加します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('641d1fa4-6ed1-4fb5-ab6a-9b70eef328ac', 2, '`GROUP BY category ORDER BY category ASC;` を末尾に書きます。');

-- SQL 2-4. ユニーク購入者数の集計（COUNT(DISTINCT)）
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('cfb56f31-f8ed-45fc-9170-f7d43b16fb28', '33333333-3333-4333-8333-333333333312', 'SQL 2-4. ユニーク購入者数の集計（COUNT(DISTINCT)）', '### 問題概要
注文テーブル `orders` から、全体の **注文件数（`total_orders`）** と **ユニーク顧客数（重複を除いた `customer_id` の数：`unique_customers`）** を出力してください。

### 期待される出力カラム
`total_orders`, `unique_customers`', 'medium', 10, ARRAY['SQL集計', 'DISTINCT']::text[], 'SELECT COUNT(*) AS total_orders
FROM orders;', 'SELECT COUNT(*) AS total_orders, COUNT(DISTINCT customer_id) AS unique_customers
FROM orders;', 'リピート購入がある注文テーブルから「何人の顧客が購入したか（UU数）」を求めるには `COUNT(DISTINCT customer_id)` を使います。', 4, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = 'cfb56f31-f8ed-45fc-9170-f7d43b16fb28';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('cfb56f31-f8ed-45fc-9170-f7d43b16fb28', '公開テスト1：リピート注文を含む5件', 'CREATE TABLE orders (id INT, customer_id INT, amount INT);
INSERT INTO orders VALUES (1, 101, 3000), (2, 101, 2000), (3, 102, 5000), (4, 103, 1000), (5, 102, 4000);', 'total_orders | unique_customers
5 | 3', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('cfb56f31-f8ed-45fc-9170-f7d43b16fb28', '非公開テスト1：全員同一顧客', 'CREATE TABLE orders (id INT, customer_id INT, amount INT);
INSERT INTO orders VALUES (1, 9, 100), (2, 9, 200), (3, 9, 300);', 'total_orders | unique_customers
3 | 1', true, 2);

DELETE FROM public.hints WHERE problem_id = 'cfb56f31-f8ed-45fc-9170-f7d43b16fb28';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('cfb56f31-f8ed-45fc-9170-f7d43b16fb28', 1, '重複を除いたカウントは `COUNT(DISTINCT customer_id)` と記述します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('cfb56f31-f8ed-45fc-9170-f7d43b16fb28', 2, '別名 `AS unique_customers` を付けて出力カラム名を揃えます。');

-- SQL 2-5. 複数カラムでのグループ集計（部門 × 役職別人数）
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('66e180b1-3cc6-4e27-a4cf-33a4c3cd13e3', '33333333-3333-4333-8333-333333333312', 'SQL 2-5. 複数カラムでのグループ集計（部門 × 役職別人数）', '### 問題概要
社員テーブル `employees` から、**部門（`department`）と役職（`role`）の組み合わせごとの社員数（`cnt`）** を算出し、`department` 昇順、次に `role` 昇順で出力してください。

### 期待される出力カラム
`department`, `role`, `cnt`', 'medium', 12, ARRAY['SQL集計', 'GROUP BY']::text[], 'SELECT department, role, COUNT(*) AS cnt
FROM employees
', 'SELECT department, role, COUNT(*) AS cnt
FROM employees
GROUP BY department, role
ORDER BY department ASC, role ASC;', '`GROUP BY col1, col2` のように複数列を指定すると、2軸のクロス集計（例：部門×役職）ができます。', 5, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = '66e180b1-3cc6-4e27-a4cf-33a4c3cd13e3';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('66e180b1-3cc6-4e27-a4cf-33a4c3cd13e3', '公開テスト1：部門×役職クロス集計', 'CREATE TABLE employees (id INT, department TEXT, role TEXT);
INSERT INTO employees VALUES (1, ''Eng'', ''Dev''), (2, ''Eng'', ''Dev''), (3, ''Eng'', ''Lead''), (4, ''Sales'', ''Rep''), (5, ''Sales'', ''Lead'');', 'department | role | cnt
Eng | Dev | 2
Eng | Lead | 1
Sales | Lead | 1
Sales | Rep | 1', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('66e180b1-3cc6-4e27-a4cf-33a4c3cd13e3', '非公開テスト1：別データ', 'CREATE TABLE employees (id INT, department TEXT, role TEXT);
INSERT INTO employees VALUES (1, ''HR'', ''Staff''), (2, ''HR'', ''Staff'');', 'department | role | cnt
HR | Staff | 2', true, 2);

DELETE FROM public.hints WHERE problem_id = '66e180b1-3cc6-4e27-a4cf-33a4c3cd13e3';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('66e180b1-3cc6-4e27-a4cf-33a4c3cd13e3', 1, '`GROUP BY department, role` で2列グループ化します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('66e180b1-3cc6-4e27-a4cf-33a4c3cd13e3', 2, '`ORDER BY department ASC, role ASC;` で並び順を固定します。');

-- SQL 2-6. WHERE と HAVING を組み合わせた有効売上集計
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('a3e29656-8f82-40c1-8088-14daf1525b58', '33333333-3333-4333-8333-333333333312', 'SQL 2-6. WHERE と HAVING を組み合わせた有効売上集計', '### 問題概要
注文テーブル `orders` から、ステータス（`status`）が `''COMPLETED''` の注文のみを対象に顧客（`customer_id`）ごとの合計金額（`total_amount`）を集計し、**合計が `10000` 円以上の顧客** を `total_amount` 降順で抽出してください。

### 期待される出力カラム
`customer_id`, `total_amount`', 'medium', 12, ARRAY['SQL集計', 'WHERE', 'HAVING']::text[], 'SELECT customer_id, SUM(amount) AS total_amount
FROM orders
', 'SELECT customer_id, SUM(amount) AS total_amount
FROM orders
WHERE status = ''COMPLETED''
GROUP BY customer_id
HAVING SUM(amount) >= 10000
ORDER BY total_amount DESC;', '**集計前の行の絞り込みは `WHERE`**（キャンセル注文を除外）、**集計後のグループ絞り込みは `HAVING`**（合計10000円以上）と役割を明確に使い分けます。', 6, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = 'a3e29656-8f82-40c1-8088-14daf1525b58';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('a3e29656-8f82-40c1-8088-14daf1525b58', '公開テスト1：完了注文のみで10000円以上', 'CREATE TABLE orders (id INT, customer_id INT, status TEXT, amount INT);
INSERT INTO orders VALUES (1, 1, ''COMPLETED'', 6000), (2, 1, ''COMPLETED'', 5000), (3, 2, ''CANCELLED'', 20000), (4, 2, ''COMPLETED'', 3000), (5, 3, ''COMPLETED'', 15000);', 'customer_id | total_amount
3 | 15000
1 | 11000', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('a3e29656-8f82-40c1-8088-14daf1525b58', '非公開テスト1：ちょうど10000円', 'CREATE TABLE orders (id INT, customer_id INT, status TEXT, amount INT);
INSERT INTO orders VALUES (1, 10, ''COMPLETED'', 10000), (2, 11, ''COMPLETED'', 9999);', 'customer_id | total_amount
10 | 10000', true, 2);

DELETE FROM public.hints WHERE problem_id = 'a3e29656-8f82-40c1-8088-14daf1525b58';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('a3e29656-8f82-40c1-8088-14daf1525b58', 1, '`WHERE status = ''COMPLETED''` を `GROUP BY` より前に書きます。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('a3e29656-8f82-40c1-8088-14daf1525b58', 2, '`HAVING SUM(amount) >= 10000` を `GROUP BY` の後に書きます。');

-- SQL 3-3. 未注文顧客の抽出（LEFT JOIN + IS NULL）
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('1eceb9e4-19dc-4676-baa6-d130d7966f63', '33333333-3333-4333-8333-333333333313', 'SQL 3-3. 未注文顧客の抽出（LEFT JOIN + IS NULL）', '### 問題概要
顧客テーブル `customers` と注文テーブル `orders` を結合し、**1回も注文実績がない顧客** の `id` と `name` を `id` 昇順で抽出してください。

### 期待される出力カラム
`id`, `name`', 'medium', 12, ARRAY['SQL結合', 'LEFT JOIN', 'NULL']::text[], 'SELECT c.id, c.name
FROM customers c
', 'SELECT c.id, c.name
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL
ORDER BY c.id ASC;', '`LEFT JOIN` で結合した際に右テーブル（`orders`）に一致行がないと右側のカラムがすべて `NULL` になります。これを利用して `WHERE o.id IS NULL` で「未購入顧客」を高速抽出する実務定番テクニックです。', 3, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = '1eceb9e4-19dc-4676-baa6-d130d7966f63';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('1eceb9e4-19dc-4676-baa6-d130d7966f63', '公開テスト1：未注文顧客を抽出', 'CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE orders (id INT, customer_id INT, amount INT);
INSERT INTO customers VALUES (1, ''Alice''), (2, ''Bob''), (3, ''Charlie'');
INSERT INTO orders VALUES (10, 1, 3000), (11, 1, 2000);', 'id | name
2 | Bob
3 | Charlie', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('1eceb9e4-19dc-4676-baa6-d130d7966f63', '非公開テスト1：1名のみ未注文', 'CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE orders (id INT, customer_id INT, amount INT);
INSERT INTO customers VALUES (1, ''Sato''), (2, ''Tanaka'');
INSERT INTO orders VALUES (1, 2, 1000);', 'id | name
1 | Sato', true, 2);

DELETE FROM public.hints WHERE problem_id = '1eceb9e4-19dc-4676-baa6-d130d7966f63';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('1eceb9e4-19dc-4676-baa6-d130d7966f63', 1, '`LEFT JOIN orders o ON c.id = o.customer_id` で全顧客を残します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('1eceb9e4-19dc-4676-baa6-d130d7966f63', 2, '`WHERE o.id IS NULL` で注文が存在しない顧客だけに絞ります。');

-- SQL 3-4. 3テーブル結合による注文明細レポート
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('fcd146b1-919a-4be4-a2c9-583211f92433', '33333333-3333-4333-8333-333333333313', 'SQL 3-4. 3テーブル結合による注文明細レポート', '### 問題概要
注文テーブル `orders`、顧客テーブル `customers`、商品テーブル `products` の **3テーブルを結合** し、各注文の **注文ID（`order_id`）**・**顧客名（`customer_name`）**・**商品名（`product_name`）**・**単価（`price`）** を `order_id` 昇順で取得してください。

### 期待される出力カラム
`order_id`, `customer_name`, `product_name`, `price`', 'medium', 15, ARRAY['SQL結合', 'INNER JOIN']::text[], 'SELECT o.id AS order_id, c.name AS customer_name, p.name AS product_name, p.price
FROM orders o
', 'SELECT o.id AS order_id, c.name AS customer_name, p.name AS product_name, p.price
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
INNER JOIN products p ON o.product_id = p.id
ORDER BY o.id ASC;', '`INNER JOIN` を連続して記述することで3つ以上のテーブルを連結できます。カラム名が重複（`id`, `name`）するため、必ずテーブル別名（`o.`, `c.`, `p.`）と `AS` 別名を指定します。', 4, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = 'fcd146b1-919a-4be4-a2c9-583211f92433';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('fcd146b1-919a-4be4-a2c9-583211f92433', '公開テスト1：3テーブル結合明細', 'CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE products (id INT, name TEXT, price INT);
CREATE TABLE orders (id INT, customer_id INT, product_id INT);
INSERT INTO customers VALUES (1, ''Yamada''), (2, ''Suzuki'');
INSERT INTO products VALUES (10, ''Keyboard'', 8000), (20, ''Mouse'', 3000);
INSERT INTO orders VALUES (100, 1, 10), (101, 2, 20), (102, 1, 20);', 'order_id | customer_name | product_name | price
100 | Yamada | Keyboard | 8000
101 | Suzuki | Mouse | 3000
102 | Yamada | Mouse | 3000', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('fcd146b1-919a-4be4-a2c9-583211f92433', '非公開テスト1：1件のみ', 'CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE products (id INT, name TEXT, price INT);
CREATE TABLE orders (id INT, customer_id INT, product_id INT);
INSERT INTO customers VALUES (5, ''Ito'');
INSERT INTO products VALUES (7, ''Monitor'', 25000);
INSERT INTO orders VALUES (1, 5, 7);', 'order_id | customer_name | product_name | price
1 | Ito | Monitor | 25000', true, 2);

DELETE FROM public.hints WHERE problem_id = 'fcd146b1-919a-4be4-a2c9-583211f92433';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('fcd146b1-919a-4be4-a2c9-583211f92433', 1, '1つ目は `INNER JOIN customers c ON o.customer_id = c.id` です。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('fcd146b1-919a-4be4-a2c9-583211f92433', 2, '2つ目は `INNER JOIN products p ON o.product_id = p.id` です。');

-- SQL 3-5. 3テーブル結合＋カテゴリ別売上ランキング
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('1af94d21-6240-4026-9abe-6784b2807333', '33333333-3333-4333-8333-333333333313', 'SQL 3-5. 3テーブル結合＋カテゴリ別売上ランキング', '### 問題概要
`orders`・`products`・`categories` の3テーブルを結合し、カテゴリ名（`category_name`）ごとの **売上合計（`total_sales` = `SUM(o.qty * p.price)` または `SUM(o.amount)`）** を集計してください（※本問題では `orders` に `amount` 列あり）。売上合計の降順で出力してください。

### 期待される出力カラム
`category_name`, `total_sales`', 'hard', 15, ARRAY['SQL結合', 'SQL集計', 'GROUP BY']::text[], 'SELECT cat.name AS category_name, SUM(o.amount) AS total_sales
FROM orders o
', 'SELECT cat.name AS category_name, SUM(o.amount) AS total_sales
FROM orders o
INNER JOIN products p ON o.product_id = p.id
INNER JOIN categories cat ON p.category_id = cat.id
GROUP BY cat.name
ORDER BY total_sales DESC;', 'トランザクション表（`orders`）→ 商品マスタ（`products`）→ カテゴリマスタ（`categories`）と連結して集計するのは、BIダッシュボードや売上集計バッチで最もよく使うパターンです。', 5, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = '1af94d21-6240-4026-9abe-6784b2807333';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('1af94d21-6240-4026-9abe-6784b2807333', '公開テスト1：カテゴリ別売上ランキング', 'CREATE TABLE categories (id INT, name TEXT);
CREATE TABLE products (id INT, category_id INT, name TEXT);
CREATE TABLE orders (id INT, product_id INT, amount INT);
INSERT INTO categories VALUES (1, ''Books''), (2, ''Hardware'');
INSERT INTO products VALUES (10, 1, ''Java''), (11, 1, ''SQL''), (20, 2, ''PC'');
INSERT INTO orders VALUES (1, 10, 3000), (2, 11, 2500), (3, 20, 120000);', 'category_name | total_sales
Hardware | 120000
Books | 5500', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('1af94d21-6240-4026-9abe-6784b2807333', '非公開テスト1：同カテゴリ複数注文', 'CREATE TABLE categories (id INT, name TEXT);
CREATE TABLE products (id INT, category_id INT, name TEXT);
CREATE TABLE orders (id INT, product_id INT, amount INT);
INSERT INTO categories VALUES (1, ''Food''), (2, ''Drink'');
INSERT INTO products VALUES (1, 1, ''Curry''), (2, 2, ''Coffee'');
INSERT INTO orders VALUES (1, 1, 900), (2, 1, 900), (3, 2, 400);', 'category_name | total_sales
Food | 1800
Drink | 400', true, 2);

DELETE FROM public.hints WHERE problem_id = '1af94d21-6240-4026-9abe-6784b2807333';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('1af94d21-6240-4026-9abe-6784b2807333', 1, '`orders` → `products` → `categories` の順に `INNER JOIN` します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('1af94d21-6240-4026-9abe-6784b2807333', 2, '`GROUP BY cat.name ORDER BY total_sales DESC;` で集計・並び替えします。');

-- SQL 3-6. 結合テーブルに対する条件絞り込み（部門別高額社員）
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('bd201519-7e4c-4558-91c7-346ce39f66dd', '33333333-3333-4333-8333-333333333313', 'SQL 3-6. 結合テーブルに対する条件絞り込み（部門別高額社員）', '### 問題概要
社員テーブル `employees` と部門テーブル `departments` を結合し、拠点（`location`）が `''Tokyo''` かつ 給与（`salary`）が `600` 以上の社員について、**社員名（`emp_name`）**・**部門名（`dept_name`）**・**給与（`salary`）** を給与降順で取得してください。

### 期待される出力カラム
`emp_name`, `dept_name`, `salary`', 'medium', 12, ARRAY['SQL結合', 'WHERE']::text[], 'SELECT e.name AS emp_name, d.name AS dept_name, e.salary
FROM employees e
', 'SELECT e.name AS emp_name, d.name AS dept_name, e.salary
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id
WHERE d.location = ''Tokyo'' AND e.salary >= 600
ORDER BY e.salary DESC;', 'JOINした後の `WHERE` 句では、左右それぞれのテーブルのカラム（`d.location` と `e.salary`）を組み合わせて絞り込むことができます。', 6, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = 'bd201519-7e4c-4558-91c7-346ce39f66dd';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('bd201519-7e4c-4558-91c7-346ce39f66dd', '公開テスト1：東京拠点かつ給与600以上', 'CREATE TABLE departments (id INT, name TEXT, location TEXT);
CREATE TABLE employees (id INT, name TEXT, dept_id INT, salary INT);
INSERT INTO departments VALUES (1, ''Eng'', ''Tokyo''), (2, ''Sales'', ''Osaka'');
INSERT INTO employees VALUES (1, ''Tanaka'', 1, 750), (2, ''Sato'', 1, 550), (3, ''Suzuki'', 2, 800), (4, ''Ito'', 1, 600);', 'emp_name | dept_name | salary
Tanaka | Eng | 750
Ito | Eng | 600', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('bd201519-7e4c-4558-91c7-346ce39f66dd', '非公開テスト1：複数東京部門', 'CREATE TABLE departments (id INT, name TEXT, location TEXT);
CREATE TABLE employees (id INT, name TEXT, dept_id INT, salary INT);
INSERT INTO departments VALUES (1, ''Dev'', ''Tokyo''), (2, ''QA'', ''Tokyo'');
INSERT INTO employees VALUES (1, ''A'', 1, 700), (2, ''B'', 2, 650);', 'emp_name | dept_name | salary
A | Dev | 700
B | QA | 650', true, 2);

DELETE FROM public.hints WHERE problem_id = 'bd201519-7e4c-4558-91c7-346ce39f66dd';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('bd201519-7e4c-4558-91c7-346ce39f66dd', 1, '`INNER JOIN departments d ON e.dept_id = d.id` で結合します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('bd201519-7e4c-4558-91c7-346ce39f66dd', 2, '`WHERE d.location = ''Tokyo'' AND e.salary >= 600` で絞り込みます。');

-- SQL 4-1. 新規顧客レコードの登録（INSERT INTO）
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('e44a7449-3f8e-4360-ba6b-47d9b0481b68', '519b8ab3-20c4-42e5-b1d5-fde2c14f90e9', 'SQL 4-1. 新規顧客レコードの登録（INSERT INTO）', '### 問題概要
顧客テーブル `customers (id, name, plan)` に、新しい顧客 `(3, ''Takahashi'', ''PRO'')` を `INSERT INTO` で登録し、そのあと全件を `id` 昇順で `SELECT` して確認してください。

### 期待される出力カラム
`id`, `name`, `plan`', 'easy', 8, ARRAY['SQL更新', 'INSERT']::text[], '-- 1. 新規顧客 (3, ''Takahashi'', ''PRO'') を登録してください

-- 2. 登録後の全件を確認出力してください
SELECT id, name, plan FROM customers ORDER BY id ASC;', 'INSERT INTO customers (id, name, plan) VALUES (3, ''Takahashi'', ''PRO'');
SELECT id, name, plan FROM customers ORDER BY id ASC;', '`INSERT INTO テーブル名 (列1, 列2, ...) VALUES (値1, 値2, ...);` のようにカラム名を明示して登録するのが、将来のテーブル変更にも強い安全な書き方です。', 1, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = 'e44a7449-3f8e-4360-ba6b-47d9b0481b68';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('e44a7449-3f8e-4360-ba6b-47d9b0481b68', '公開テスト1：新規顧客1件の追加', 'CREATE TABLE customers (id INT, name TEXT, plan TEXT);
INSERT INTO customers VALUES (1, ''Yamada'', ''FREE''), (2, ''Suzuki'', ''PRO'');', 'id | name | plan
1 | Yamada | FREE
2 | Suzuki | PRO
3 | Takahashi | PRO', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('e44a7449-3f8e-4360-ba6b-47d9b0481b68', '非公開テスト1：空テーブルへの追加', 'CREATE TABLE customers (id INT, name TEXT, plan TEXT);', 'id | name | plan
3 | Takahashi | PRO', true, 2);

DELETE FROM public.hints WHERE problem_id = 'e44a7449-3f8e-4360-ba6b-47d9b0481b68';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('e44a7449-3f8e-4360-ba6b-47d9b0481b68', 1, '`INSERT INTO customers (id, name, plan) VALUES (3, ''Takahashi'', ''PRO'');` を先頭に記述します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('e44a7449-3f8e-4360-ba6b-47d9b0481b68', 2, '各SQL文の末尾にはセミコロン `;` を付けます。');

-- SQL 4-2. 複数レコードの一括登録（マルチ行INSERT）
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('773f64d4-992b-4036-a081-3337bfa2547a', '519b8ab3-20c4-42e5-b1d5-fde2c14f90e9', 'SQL 4-2. 複数レコードの一括登録（マルチ行INSERT）', '### 問題概要
タスクテーブル `tasks (id, title, status)` に以下2件を登録し、全件を `id` 昇順で出力してください。
- `(2, ''Write Tests'', ''TODO'')`
- `(3, ''Deploy App'', ''TODO'')`

### 期待される出力カラム
`id`, `title`, `status`', 'easy', 8, ARRAY['SQL更新', 'INSERT']::text[], '-- 2件のタスクを一括登録してください

SELECT id, title, status FROM tasks ORDER BY id ASC;', 'INSERT INTO tasks (id, title, status) VALUES (2, ''Write Tests'', ''TODO''), (3, ''Deploy App'', ''TODO'');
SELECT id, title, status FROM tasks ORDER BY id ASC;', '`VALUES (...), (...)` のようにカンマ区切りで複数行をまとめて登録すると、DBへの通信回数を減らして高速化できます。', 2, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = '773f64d4-992b-4036-a081-3337bfa2547a';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('773f64d4-992b-4036-a081-3337bfa2547a', '公開テスト1：既存1件＋新規2件', 'CREATE TABLE tasks (id INT, title TEXT, status TEXT);
INSERT INTO tasks VALUES (1, ''Design DB'', ''DONE'');', 'id | title | status
1 | Design DB | DONE
2 | Write Tests | TODO
3 | Deploy App | TODO', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('773f64d4-992b-4036-a081-3337bfa2547a', '非公開テスト1：空テーブルへ2件登録', 'CREATE TABLE tasks (id INT, title TEXT, status TEXT);', 'id | title | status
2 | Write Tests | TODO
3 | Deploy App | TODO', true, 2);

DELETE FROM public.hints WHERE problem_id = '773f64d4-992b-4036-a081-3337bfa2547a';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('773f64d4-992b-4036-a081-3337bfa2547a', 1, '`INSERT INTO tasks (id, title, status) VALUES (2, ''Write Tests'', ''TODO''), (3, ''Deploy App'', ''TODO'');` と記述します。');

-- SQL 4-3. 特定商品の価格改定（UPDATE / WHERE）
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('fb3b34fb-b994-49e5-b043-4372d18900da', '519b8ab3-20c4-42e5-b1d5-fde2c14f90e9', 'SQL 4-3. 特定商品の価格改定（UPDATE / WHERE）', '### 問題概要
商品テーブル `products (id, name, price)` で、`id = 2` の商品の価格（`price`）を `2500` に更新し、更新後の全件を `id` 昇順で出力してください。

### 期待される出力カラム
`id`, `name`, `price`', 'easy', 8, ARRAY['SQL更新', 'UPDATE']::text[], '-- id = 2 の price を 2500 に更新してください

SELECT id, name, price FROM products ORDER BY id ASC;', 'UPDATE products SET price = 2500 WHERE id = 2;
SELECT id, name, price FROM products ORDER BY id ASC;', '`UPDATE テーブル名 SET 列 = 値 WHERE 条件;` で特定行だけを更新します。**`WHERE` 句を忘れるとテーブル全行が書き換わってしまう重大事故になる**ため、実務では必ず `WHERE` を確認しましょう。', 3, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = 'fb3b34fb-b994-49e5-b043-4372d18900da';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('fb3b34fb-b994-49e5-b043-4372d18900da', '公開テスト1：id=2のみ更新', 'CREATE TABLE products (id INT, name TEXT, price INT);
INSERT INTO products VALUES (1, ''Pen'', 200), (2, ''Book'', 1800), (3, ''Bag'', 5000);', 'id | name | price
1 | Pen | 200
2 | Book | 2500
3 | Bag | 5000', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('fb3b34fb-b994-49e5-b043-4372d18900da', '非公開テスト1：別データセット', 'CREATE TABLE products (id INT, name TEXT, price INT);
INSERT INTO products VALUES (2, ''Mouse'', 1200), (5, ''Desk'', 9000);', 'id | name | price
2 | Mouse | 2500
5 | Desk | 9000', true, 2);

DELETE FROM public.hints WHERE problem_id = 'fb3b34fb-b994-49e5-b043-4372d18900da';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('fb3b34fb-b994-49e5-b043-4372d18900da', 1, '`UPDATE products SET price = 2500 WHERE id = 2;` を記述します。');

-- SQL 4-4. 条件一致レコードの一括ステータス更新（UPDATE + 複数条件）
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('b9be0172-8055-4103-93a7-09254e510d52', '519b8ab3-20c4-42e5-b1d5-fde2c14f90e9', 'SQL 4-4. 条件一致レコードの一括ステータス更新（UPDATE + 複数条件）', '### 問題概要
注文テーブル `orders (id, status, amount)` について、`status = ''PENDING''` かつ `amount >= 5000` の注文の `status` を `''APPROVED''` に一括更新し、更新後の全件を `id` 昇順で出力してください。

### 期待される出力カラム
`id`, `status`, `amount`', 'medium', 10, ARRAY['SQL更新', 'UPDATE']::text[], '-- 条件に合う注文を APPROVED に更新してください

SELECT id, status, amount FROM orders ORDER BY id ASC;', 'UPDATE orders SET status = ''APPROVED'' WHERE status = ''PENDING'' AND amount >= 5000;
SELECT id, status, amount FROM orders ORDER BY id ASC;', 'バッチ処理でよく行う一括ステータス更新では、現在のステータス（`PENDING`）も `WHERE` 条件に含めることで、すでにキャンセル済みや完了済みのデータを誤って上書きするのを防ぎます。', 4, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = 'b9be0172-8055-4103-93a7-09254e510d52';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('b9be0172-8055-4103-93a7-09254e510d52', '公開テスト1：PENDINGかつ5000円以上のみ承認', 'CREATE TABLE orders (id INT, status TEXT, amount INT);
INSERT INTO orders VALUES (1, ''PENDING'', 6000), (2, ''PENDING'', 3000), (3, ''CANCELLED'', 8000), (4, ''PENDING'', 5000);', 'id | status | amount
1 | APPROVED | 6000
2 | PENDING | 3000
3 | CANCELLED | 8000
4 | APPROVED | 5000', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('b9be0172-8055-4103-93a7-09254e510d52', '非公開テスト1：対象0件', 'CREATE TABLE orders (id INT, status TEXT, amount INT);
INSERT INTO orders VALUES (1, ''DONE'', 9000);', 'id | status | amount
1 | DONE | 9000', true, 2);

DELETE FROM public.hints WHERE problem_id = 'b9be0172-8055-4103-93a7-09254e510d52';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('b9be0172-8055-4103-93a7-09254e510d52', 1, '`WHERE status = ''PENDING'' AND amount >= 5000` を指定します。');

-- SQL 4-5. キャンセル済みデータの削除（DELETE FROM / WHERE）
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('dd80d396-210a-41ae-9c8a-fbfc484081db', '519b8ab3-20c4-42e5-b1d5-fde2c14f90e9', 'SQL 4-5. キャンセル済みデータの削除（DELETE FROM / WHERE）', '### 問題概要
注文テーブル `orders (id, status, amount)` から、`status = ''CANCELLED''` のレコードを削除し、残った全件を `id` 昇順で出力してください。

### 期待される出力カラム
`id`, `status`, `amount`', 'easy', 8, ARRAY['SQL更新', 'DELETE']::text[], '-- CANCELLED の注文を削除してください

SELECT id, status, amount FROM orders ORDER BY id ASC;', 'DELETE FROM orders WHERE status = ''CANCELLED'';
SELECT id, status, amount FROM orders ORDER BY id ASC;', '`DELETE FROM テーブル名 WHERE 条件;` で条件に一致する行を削除します。`UPDATE` 同様に `WHERE` の付け忘れは全データ消失につながるため厳重注意です。', 5, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = 'dd80d396-210a-41ae-9c8a-fbfc484081db';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('dd80d396-210a-41ae-9c8a-fbfc484081db', '公開テスト1：CANCELLEDのみ削除', 'CREATE TABLE orders (id INT, status TEXT, amount INT);
INSERT INTO orders VALUES (1, ''COMPLETED'', 4000), (2, ''CANCELLED'', 3000), (3, ''PENDING'', 2000), (4, ''CANCELLED'', 1000);', 'id | status | amount
1 | COMPLETED | 4000
3 | PENDING | 2000', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('dd80d396-210a-41ae-9c8a-fbfc484081db', '非公開テスト1：削除対象なし', 'CREATE TABLE orders (id INT, status TEXT, amount INT);
INSERT INTO orders VALUES (1, ''COMPLETED'', 5000);', 'id | status | amount
1 | COMPLETED | 5000', true, 2);

DELETE FROM public.hints WHERE problem_id = 'dd80d396-210a-41ae-9c8a-fbfc484081db';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('dd80d396-210a-41ae-9c8a-fbfc484081db', 1, '`DELETE FROM orders WHERE status = ''CANCELLED'';` を記述します。');

-- SQL 4-6. 在庫テーブルのCRUD総合シナリオ（INSERT / UPDATE / DELETE）
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('ac2df28a-733d-427f-a9e6-4e1d3277cd74', '519b8ab3-20c4-42e5-b1d5-fde2c14f90e9', 'SQL 4-6. 在庫テーブルのCRUD総合シナリオ（INSERT / UPDATE / DELETE）', '### 問題概要
在庫テーブル `stocks (id, item, qty)` に対して以下3つの操作を順番に実行し、最終状態を `id` 昇順で出力してください。
1. 新商品 `(4, ''Cable'', 20)` を登録する
2. `id = 1` の商品の `qty` を `15` に更新する
3. 在庫が `0` 以下の商品（`qty <= 0`）を削除する

### 期待される出力カラム
`id`, `item`, `qty`', 'medium', 12, ARRAY['SQL更新', 'INSERT', 'UPDATE', 'DELETE']::text[], '-- 1. INSERT

-- 2. UPDATE

-- 3. DELETE

SELECT id, item, qty FROM stocks ORDER BY id ASC;', 'INSERT INTO stocks (id, item, qty) VALUES (4, ''Cable'', 20);
UPDATE stocks SET qty = 15 WHERE id = 1;
DELETE FROM stocks WHERE qty <= 0;
SELECT id, item, qty FROM stocks ORDER BY id ASC;', '1つのトランザクション内で登録・更新・削除を順に実行する実務シナリオです。順番によって結果が変わることもあるため、仕様通りの順序で記述します。', 6, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = 'ac2df28a-733d-427f-a9e6-4e1d3277cd74';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('ac2df28a-733d-427f-a9e6-4e1d3277cd74', '公開テスト1：CRUD連続実行', 'CREATE TABLE stocks (id INT, item TEXT, qty INT);
INSERT INTO stocks VALUES (1, ''Mouse'', 5), (2, ''Keyboard'', 0), (3, ''Monitor'', 8);', 'id | item | qty
1 | Mouse | 15
3 | Monitor | 8
4 | Cable | 20', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('ac2df28a-733d-427f-a9e6-4e1d3277cd74', '非公開テスト1：初期在庫0がid=1の場合（更新後に削除判定）', 'CREATE TABLE stocks (id INT, item TEXT, qty INT);
INSERT INTO stocks VALUES (1, ''Hub'', 0), (2, ''Stand'', 0);', 'id | item | qty
1 | Hub | 15
4 | Cable | 20', true, 2);

DELETE FROM public.hints WHERE problem_id = 'ac2df28a-733d-427f-a9e6-4e1d3277cd74';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('ac2df28a-733d-427f-a9e6-4e1d3277cd74', 1, '1行目：`INSERT INTO stocks (id, item, qty) VALUES (4, ''Cable'', 20);`');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('ac2df28a-733d-427f-a9e6-4e1d3277cd74', 2, '2行目：`UPDATE stocks SET qty = 15 WHERE id = 1;`');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('ac2df28a-733d-427f-a9e6-4e1d3277cd74', 3, '3行目：`DELETE FROM stocks WHERE qty <= 0;`');

-- SQL 5-1. CASE WHEN による顧客ランク判定
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('7d64347b-b6df-4c25-83d1-1c63ce0ab4ea', 'f9136887-f979-41ad-a902-654f1eaef5bd', 'SQL 5-1. CASE WHEN による顧客ランク判定', '### 問題概要
顧客テーブル `customers (id, name, total_spent)` について、累計購入金額（`total_spent`）に応じて `rank` 列を付与し、`id` 昇順で出力してください。
- `100000` 以上：`''VIP''`
- `30000` 以上 `100000` 未満：`''STANDARD''`
- `30000` 未満：`''LIGHT''`

### 期待される出力カラム
`name`, `rank`', 'medium', 12, ARRAY['CASE式', 'SQL抽出']::text[], 'SELECT name,
  CASE
    -- 条件を記述してください
  END AS rank
FROM customers
ORDER BY id ASC;', 'SELECT name,
  CASE
    WHEN total_spent >= 100000 THEN ''VIP''
    WHEN total_spent >= 30000 THEN ''STANDARD''
    ELSE ''LIGHT''
  END AS rank
FROM customers
ORDER BY id ASC;', '`CASE WHEN 条件 THEN 値 ... ELSE デフォルト値 END` を使うと、SQLの結果セット上で直接ラベル分けができます。Javaの `if / else if / else` と同じく上から順に評価されます。', 1, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = '7d64347b-b6df-4c25-83d1-1c63ce0ab4ea';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('7d64347b-b6df-4c25-83d1-1c63ce0ab4ea', '公開テスト1：3ランクの境界判定', 'CREATE TABLE customers (id INT, name TEXT, total_spent INT);
INSERT INTO customers VALUES (1, ''A'', 120000), (2, ''B'', 50000), (3, ''C'', 10000), (4, ''D'', 30000);', 'name | rank
A | VIP
B | STANDARD
C | LIGHT
D | STANDARD', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('7d64347b-b6df-4c25-83d1-1c63ce0ab4ea', '非公開テスト1：ちょうど100000円', 'CREATE TABLE customers (id INT, name TEXT, total_spent INT);
INSERT INTO customers VALUES (1, ''X'', 100000), (2, ''Y'', 29999);', 'name | rank
X | VIP
Y | LIGHT', true, 2);

DELETE FROM public.hints WHERE problem_id = '7d64347b-b6df-4c25-83d1-1c63ce0ab4ea';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('7d64347b-b6df-4c25-83d1-1c63ce0ab4ea', 1, '高い金額の条件 `WHEN total_spent >= 100000 THEN ''VIP''` から順に書きます。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('7d64347b-b6df-4c25-83d1-1c63ce0ab4ea', 2, '最後に `ELSE ''LIGHT'' END AS rank` で閉じます。');

-- SQL 5-2. COALESCE と CASE WHEN による欠損データの整形表示
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('76e20c02-ff67-413f-91d7-41a2d0a2824a', 'f9136887-f979-41ad-a902-654f1eaef5bd', 'SQL 5-2. COALESCE と CASE WHEN による欠損データの整形表示', '### 問題概要
ユーザーテーブル `users (id, name, phone)` から以下を `id` 昇順で出力してください。
- `name`
- `contact`：`phone` が `NULL` の場合は `''UNREGISTERED''`、登録済みならそのまま `phone`（`COALESCE` を使用）
- `status`：`phone IS NULL` なら `''INCOMPLETE''`、そうでなければ `''READY''`

### 期待される出力カラム
`name`, `contact`, `status`', 'medium', 12, ARRAY['CASE式', 'NULL']::text[], 'SELECT name,
  COALESCE(phone, ''UNREGISTERED'') AS contact
FROM users
ORDER BY id ASC;', 'SELECT name,
  COALESCE(phone, ''UNREGISTERED'') AS contact,
  CASE WHEN phone IS NULL THEN ''INCOMPLETE'' ELSE ''READY'' END AS status
FROM users
ORDER BY id ASC;', '`COALESCE(値1, 値2)` は最初の非NULL値を返す標準SQL関数です。帳票やCSV出力で `NULL` をユーザー向けの表示文言へ置き換える際に必須です。', 2, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = '76e20c02-ff67-413f-91d7-41a2d0a2824a';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('76e20c02-ff67-413f-91d7-41a2d0a2824a', '公開テスト1：電話番号あり・なし混在', 'CREATE TABLE users (id INT, name TEXT, phone TEXT);
INSERT INTO users VALUES (1, ''Sato'', ''090-1111''), (2, ''Kato'', NULL), (3, ''Mori'', ''080-2222'');', 'name | contact | status
Sato | 090-1111 | READY
Kato | UNREGISTERED | INCOMPLETE
Mori | 080-2222 | READY', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('76e20c02-ff67-413f-91d7-41a2d0a2824a', '非公開テスト1：全員NULL', 'CREATE TABLE users (id INT, name TEXT, phone TEXT);
INSERT INTO users VALUES (1, ''Test'', NULL);', 'name | contact | status
Test | UNREGISTERED | INCOMPLETE', true, 2);

DELETE FROM public.hints WHERE problem_id = '76e20c02-ff67-413f-91d7-41a2d0a2824a';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('76e20c02-ff67-413f-91d7-41a2d0a2824a', 1, '`CASE WHEN phone IS NULL THEN ''INCOMPLETE'' ELSE ''READY'' END AS status` を追加します。');

-- SQL 5-3. スカラーサブクエリ：全体平均給与を上回る社員の抽出
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('cb7d7d57-0686-4da4-91f1-450fd7b6ddef', 'f9136887-f979-41ad-a902-654f1eaef5bd', 'SQL 5-3. スカラーサブクエリ：全体平均給与を上回る社員の抽出', '### 問題概要
社員テーブル `employees (id, name, salary)` から、**全社員の平均給与（`AVG(salary)`）より高い給与** を得ている社員の `name` と `salary` を `salary` 降順で取得してください。

### 期待される出力カラム
`name`, `salary`', 'hard', 15, ARRAY['サブクエリ', 'SQL集計']::text[], 'SELECT name, salary
FROM employees
', 'SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)
ORDER BY salary DESC;', '`WHERE` 句には直接 `AVG(salary)` を書けないため、`(SELECT AVG(salary) FROM employees)` のように **スカラーサブクエリ（1行1列を返す副問い合わせ）** を使って比較します。', 3, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = 'cb7d7d57-0686-4da4-91f1-450fd7b6ddef';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('cb7d7d57-0686-4da4-91f1-450fd7b6ddef', '公開テスト1：平均(600)より高い社員', 'CREATE TABLE employees (id INT, name TEXT, salary INT);
INSERT INTO employees VALUES (1, ''A'', 400), (2, ''B'', 600), (3, ''C'', 800), (4, ''D'', 600);', 'name | salary
C | 800', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('cb7d7d57-0686-4da4-91f1-450fd7b6ddef', '非公開テスト1：平均500より高い2名', 'CREATE TABLE employees (id INT, name TEXT, salary INT);
INSERT INTO employees VALUES (1, ''X'', 300), (2, ''Y'', 700), (3, ''Z'', 550), (4, ''W'', 450);', 'name | salary
Y | 700
Z | 550', true, 2);

DELETE FROM public.hints WHERE problem_id = 'cb7d7d57-0686-4da4-91f1-450fd7b6ddef';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('cb7d7d57-0686-4da4-91f1-450fd7b6ddef', 1, '平均給与は `(SELECT AVG(salary) FROM employees)` で求められます。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('cb7d7d57-0686-4da4-91f1-450fd7b6ddef', 2, '`WHERE salary > (SELECT AVG(salary) FROM employees) ORDER BY salary DESC;`');

-- SQL 5-4. INサブクエリ：高額注文実績のある顧客リスト抽出
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('de892216-f574-4344-80b9-7c18b631f0fc', 'f9136887-f979-41ad-a902-654f1eaef5bd', 'SQL 5-4. INサブクエリ：高額注文実績のある顧客リスト抽出', '### 問題概要
注文テーブル `orders` で **1回の注文金額（`amount`）が `10000` 円以上** の注文を行ったことがある顧客の `id` と `name` を、顧客テーブル `customers` から `id` 昇順で取得してください（`IN` サブクエリを使用）。

### 期待される出力カラム
`id`, `name`', 'hard', 15, ARRAY['サブクエリ', 'IN']::text[], 'SELECT id, name
FROM customers
', 'SELECT id, name
FROM customers
WHERE id IN (SELECT customer_id FROM orders WHERE amount >= 10000)
ORDER BY id ASC;', '`IN (SELECT ...)` を使うと、JOINしたときのように注文回数分だけ顧客行が重複するのを防ぎつつ、「条件に合う子レコードを持つ親レコード」をスマートに抽出できます。', 4, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = 'de892216-f574-4344-80b9-7c18b631f0fc';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('de892216-f574-4344-80b9-7c18b631f0fc', '公開テスト1：10000円以上注文ありの顧客', 'CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE orders (id INT, customer_id INT, amount INT);
INSERT INTO customers VALUES (1, ''ACME''), (2, ''Beta''), (3, ''Gamma'');
INSERT INTO orders VALUES (1, 1, 15000), (2, 1, 20000), (3, 2, 5000), (4, 3, 10000);', 'id | name
1 | ACME
3 | Gamma', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('de892216-f574-4344-80b9-7c18b631f0fc', '非公開テスト1：1社のみ該当', 'CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE orders (id INT, customer_id INT, amount INT);
INSERT INTO customers VALUES (10, ''One''), (20, ''Two'');
INSERT INTO orders VALUES (1, 20, 12000), (2, 10, 9999);', 'id | name
20 | Two', true, 2);

DELETE FROM public.hints WHERE problem_id = 'de892216-f574-4344-80b9-7c18b631f0fc';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('de892216-f574-4344-80b9-7c18b631f0fc', 1, '高額注文の顧客ID一覧は `SELECT customer_id FROM orders WHERE amount >= 10000` です。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('de892216-f574-4344-80b9-7c18b631f0fc', 2, '`WHERE id IN (SELECT customer_id FROM orders WHERE amount >= 10000)` と記述します。');

-- SQL 5-5. NOT IN サブクエリ：一度も売れていない商品の抽出
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('ed893a34-6f48-4219-8908-06db9bf32609', 'f9136887-f979-41ad-a902-654f1eaef5bd', 'SQL 5-5. NOT IN サブクエリ：一度も売れていない商品の抽出', '### 問題概要
商品テーブル `products (id, name, price)` のうち、注文テーブル `orders (id, product_id)` に **一度も登場していない（未販売の）商品** の `id` と `name` を `id` 昇順で取得してください。

### 期待される出力カラム
`id`, `name`', 'hard', 15, ARRAY['サブクエリ', 'NOT IN']::text[], 'SELECT id, name
FROM products
', 'SELECT id, name
FROM products
WHERE id NOT IN (SELECT product_id FROM orders)
ORDER BY id ASC;', '`NOT IN (SELECT ...)` を使うと「別テーブルに存在しないレコード（売れ残り商品・未提出受講生など）」を直感的に抽出できます。', 5, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = 'ed893a34-6f48-4219-8908-06db9bf32609';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('ed893a34-6f48-4219-8908-06db9bf32609', '公開テスト1：未販売商品を抽出', 'CREATE TABLE products (id INT, name TEXT, price INT);
CREATE TABLE orders (id INT, product_id INT);
INSERT INTO products VALUES (1, ''Pen'', 100), (2, ''Notebook'', 300), (3, ''Eraser'', 80);
INSERT INTO orders VALUES (10, 1), (11, 3);', 'id | name
2 | Notebook', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('ed893a34-6f48-4219-8908-06db9bf32609', '非公開テスト1：注文0件（全商品未販売）', 'CREATE TABLE products (id INT, name TEXT, price INT);
CREATE TABLE orders (id INT, product_id INT);
INSERT INTO products VALUES (1, ''A'', 100), (2, ''B'', 200);', 'id | name
1 | A
2 | B', true, 2);

DELETE FROM public.hints WHERE problem_id = 'ed893a34-6f48-4219-8908-06db9bf32609';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('ed893a34-6f48-4219-8908-06db9bf32609', 1, '`WHERE id NOT IN (SELECT product_id FROM orders) ORDER BY id ASC;` と記述します。');

-- SQL 5-6. 実務総合：高パフォーマンス社員レポート（JOIN + サブクエリ + CASE）
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('faa6e9de-c8ee-4a63-83d7-bb0b75584173', 'f9136887-f979-41ad-a902-654f1eaef5bd', 'SQL 5-6. 実務総合：高パフォーマンス社員レポート（JOIN + サブクエリ + CASE）', '### 問題概要
社員テーブル `employees` と部門テーブル `departments` を結合し、**全社員の平均給与以上** の社員について以下を `salary` 降順で出力してください。
- `emp_name`（社員名）
- `dept_name`（部門名）
- `salary`（給与）
- `grade`：給与が `800` 以上なら `''S''`、それ以外は `''A''`

### 期待される出力カラム
`emp_name`, `dept_name`, `salary`, `grade`', 'hard', 20, ARRAY['SQL結合', 'サブクエリ', 'CASE式']::text[], 'SELECT e.name AS emp_name, d.name AS dept_name, e.salary
FROM employees e
', 'SELECT e.name AS emp_name, d.name AS dept_name, e.salary,
  CASE WHEN e.salary >= 800 THEN ''S'' ELSE ''A'' END AS grade
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id
WHERE e.salary >= (SELECT AVG(salary) FROM employees)
ORDER BY e.salary DESC;', '`INNER JOIN`・スカラーサブクエリ・`CASE WHEN` をすべて組み合わせた実務レポートSQLです。これが書ければ業務システムの管理画面・集計バッチのSQL要件に十分対応できます。', 6, true)
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
  is_published = true;

DELETE FROM public.test_cases WHERE problem_id = 'faa6e9de-c8ee-4a63-83d7-bb0b75584173';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('faa6e9de-c8ee-4a63-83d7-bb0b75584173', '公開テスト1：平均(650)以上のS/Aランク社員', 'CREATE TABLE departments (id INT, name TEXT);
CREATE TABLE employees (id INT, name TEXT, dept_id INT, salary INT);
INSERT INTO departments VALUES (1, ''Eng''), (2, ''Sales'');
INSERT INTO employees VALUES (1, ''Tanaka'', 1, 900), (2, ''Sato'', 1, 700), (3, ''Suzuki'', 2, 500), (4, ''Ito'', 2, 500);', 'emp_name | dept_name | salary | grade
Tanaka | Eng | 900 | S
Sato | Eng | 700 | A', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('faa6e9de-c8ee-4a63-83d7-bb0b75584173', '非公開テスト1：境界値800', 'CREATE TABLE departments (id INT, name TEXT);
CREATE TABLE employees (id INT, name TEXT, dept_id INT, salary INT);
INSERT INTO departments VALUES (1, ''Dev'');
INSERT INTO employees VALUES (1, ''Top'', 1, 800), (2, ''Low'', 1, 400);', 'emp_name | dept_name | salary | grade
Top | Dev | 800 | S', true, 2);

DELETE FROM public.hints WHERE problem_id = 'faa6e9de-c8ee-4a63-83d7-bb0b75584173';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('faa6e9de-c8ee-4a63-83d7-bb0b75584173', 1, '`INNER JOIN departments d ON e.dept_id = d.id` で部門名を結合します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('faa6e9de-c8ee-4a63-83d7-bb0b75584173', 2, '`WHERE e.salary >= (SELECT AVG(salary) FROM employees)` で平均以上に絞ります。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('faa6e9de-c8ee-4a63-83d7-bb0b75584173', 3, '`CASE WHEN e.salary >= 800 THEN ''S'' ELSE ''A'' END AS grade` でランクを付与します。');

NOTIFY pgrst, 'reload schema';
