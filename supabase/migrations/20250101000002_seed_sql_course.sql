-- =============================================================================
-- SQL実践コース シードデータ（3章 × 各2問 ＝ 6問、テストケース、段階的ヒント）
-- =============================================================================

-- コース：SQL実践コース
INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES
  (
    '11111111-1111-4111-8111-111111111102',
    'SQL実践コース：データ抽出・集計・テーブル結合マスター',
    'SELECT文の基本とWHERE条件指定からスタートし、GROUP BY / HAVING による集計分析、INNER JOIN / LEFT JOIN による複数テーブル結合まで全6問の実践クエリ演習で習得します。',
    2,
    true,
    NULL
  )
ON CONFLICT (id) DO NOTHING;

-- 章（3章構成）
INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES
  (
    '22222222-2222-4222-8222-222222222211',
    '11111111-1111-4111-8111-111111111102',
    'SQL第1章：SELECTとWHEREによるデータ抽出',
    'SELECTによるカラム選択、WHEREによる条件絞り込み、ORDER BYとLIMITによる並び替えを学びます。',
    1,
    true
  ),
  (
    '22222222-2222-4222-8222-222222222212',
    '11111111-1111-4111-8111-111111111102',
    'SQL第2章：集約関数とGROUP BYによるデータ集計',
    'COUNT, SUM, AVG, MAX, MIN と GROUP BY / HAVING を使って、部門別・カテゴリ別の集計レポートを作成します。',
    2,
    true
  ),
  (
    '22222222-2222-4222-8222-222222222213',
    '11111111-1111-4111-8111-111111111102',
    'SQL第3章：JOINによる複数テーブル結合',
    'INNER JOIN と LEFT JOIN を使いこなし、正規化された複数テーブルから必要な情報を結合して抽出します。',
    3,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 単元
INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES
  (
    '33333333-3333-4333-8333-333333333311',
    '22222222-2222-4222-8222-222222222211',
    '1-1. 基本クエリと条件フィルタリング',
    'SELECT, FROM, WHERE, ORDER BY, LIMIT の基本構文を習得します。',
    1,
    true
  ),
  (
    '33333333-3333-4333-8333-333333333312',
    '22222222-2222-4222-8222-222222222212',
    '2-1. グループ集計とHAVING条件',
    'GROUP BY と集約関数（COUNT, SUM, AVG）、HAVING によるグループ絞り込みを習得します。',
    1,
    true
  ),
  (
    '33333333-3333-4333-8333-333333333313',
    '22222222-2222-4222-8222-222222222213',
    '3-1. テーブル結合（INNER JOIN / LEFT JOIN）',
    '複数テーブルを結合する INNER JOIN と LEFT JOIN の使い分けを習得します。',
    1,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- SQL問題（6問）
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES
  (
    '44444444-4444-4444-8444-444444444501',
    '33333333-3333-4333-8333-333333333311',
    'SQL 1-1. 条件に合う社員データの抽出（SELECT / WHERE）',
    E'### 問題概要\n社員テーブル `employees` から、部門（`department`）が `''Engineering''` である社員の **氏名（`name`）** と **給与（`salary`）** を抽出するSQLクエリを作成してください。',
    'easy',
    10,
    ARRAY['SQL抽出', '基礎構文'],
    E'-- Engineering 部門の name と salary を取得してください\nSELECT name, salary\nFROM employees\n',
    E'SELECT name, salary\nFROM employees\nWHERE department = ''Engineering'';',
    E'特定の条件に一致する行だけを抽出するには `WHERE カラム名 = ''値''` を使用します。',
    1,
    true
  ),
  (
    '44444444-4444-4444-8444-444444444502',
    '33333333-3333-4333-8333-333333333311',
    'SQL 1-2. 高額商品の並び替えと上位取得（ORDER BY / LIMIT）',
    E'### 問題概要\n商品テーブル `products` から、価格（`price`）が `1000` 以上の商品を抽出し、**価格の高い順（降順）** に並び替えて上位 **3件** の `name` と `price` を取得してください。',
    'easy',
    10,
    ARRAY['SQL抽出', 'ソート'],
    E'-- 価格1000以上の商品を価格の降順で上位3件取得してください\nSELECT name, price\nFROM products\n',
    E'SELECT name, price\nFROM products\nWHERE price >= 1000\nORDER BY price DESC\nLIMIT 3;',
    E'降順（大きい順）で並び替えるには `ORDER BY カラム名 DESC` を使い、取得件数を制限するには末尾に `LIMIT 件数` を指定します。',
    2,
    true
  ),
  (
    '44444444-4444-4444-8444-444444444503',
    '33333333-3333-4333-8333-333333333312',
    'SQL 2-1. 部門別の社員数と平均給与の集計（GROUP BY）',
    E'### 問題概要\n社員テーブル `employees` を部門（`department`）ごとにグループ化し、`department`、`COUNT(*) AS emp_count`、`AVG(salary) AS avg_salary` を取得し、`emp_count` の降順に並び替えてください。',
    'medium',
    15,
    ARRAY['SQL集計', 'GROUP BY'],
    E'SELECT department, COUNT(*) AS emp_count, AVG(salary) AS avg_salary\nFROM employees\n',
    E'SELECT department, COUNT(*) AS emp_count, AVG(salary) AS avg_salary\nFROM employees\nGROUP BY department\nORDER BY emp_count DESC;',
    E'`GROUP BY department` を指定すると部門ごとにレコードが集約されます。',
    1,
    true
  ),
  (
    '44444444-4444-4444-8444-444444444504',
    '33333333-3333-4333-8333-333333333312',
    'SQL 2-2. 売上合計が基準以上の顧客を抽出（GROUP BY / HAVING）',
    E'### 問題概要\n注文テーブル `orders` から顧客ID（`customer_id`）ごとの合計注文金額 `SUM(amount) AS total_amount` を集計し、合計金額が 10000 以上の顧客のみを `total_amount` の降順で抽出してください。',
    'medium',
    15,
    ARRAY['SQL集計', 'GROUP BY'],
    E'SELECT customer_id, SUM(amount) AS total_amount\nFROM orders\n',
    E'SELECT customer_id, SUM(amount) AS total_amount\nFROM orders\nGROUP BY customer_id\nHAVING SUM(amount) >= 10000\nORDER BY total_amount DESC;',
    E'グループ化した後の集約結果に対して条件を指定する場合は `HAVING` 句を使用します。',
    2,
    true
  ),
  (
    '44444444-4444-4444-8444-444444444505',
    '33333333-3333-4333-8333-333333333313',
    'SQL 3-1. 社員と部門テーブルの内部結合（INNER JOIN）',
    E'### 問題概要\n社員テーブル `employees` と部門テーブル `departments` を内部結合し、`emp_name` と `dept_name` を `employees.id` の昇順で取得してください。',
    'medium',
    15,
    ARRAY['SQL結合', 'JOIN'],
    E'SELECT e.emp_name, d.dept_name\nFROM employees e\n',
    E'SELECT e.emp_name, d.dept_name\nFROM employees e\nINNER JOIN departments d ON e.dept_id = d.id\nORDER BY e.id ASC;',
    E'`INNER JOIN` で両方のテーブルに存在するデータを結合して取得できます。',
    1,
    true
  ),
  (
    '44444444-4444-4444-8444-444444444506',
    '33333333-3333-4333-8333-333333333313',
    'SQL 3-2. 外部結合と注文実績のない顧客も含めた集計（LEFT JOIN）',
    E'### 問題概要\n顧客テーブル `customers` と注文テーブル `orders` を外部結合（`LEFT JOIN`）し、注文0件の顧客も含めて `name` と `COUNT(o.id) AS order_count` を顧客IDの昇順で取得してください。',
    'hard',
    20,
    ARRAY['SQL結合', 'JOIN', 'SQL集計'],
    E'SELECT c.name, COUNT(o.id) AS order_count\nFROM customers c\n',
    E'SELECT c.name, COUNT(o.id) AS order_count\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nGROUP BY c.id, c.name\nORDER BY c.id ASC;',
    E'`LEFT JOIN` と `COUNT(o.id)` を組み合わせることで、注文0件の顧客も正しく 0 として集計できます。',
    2,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- SQLテストケース
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES
  ('44444444-4444-4444-8444-444444444501', '公開テスト1：基本社員テーブル', E'CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);\nINSERT INTO employees VALUES (1, ''Tanaka'', ''Engineering'', 650), (2, ''Suzuki'', ''Sales'', 520), (3, ''Sato'', ''Engineering'', 720);', E'name | salary\nTanaka | 650\nSato | 720', false, 1),
  ('44444444-4444-4444-8444-444444444501', '非公開テスト1：別データセット検証', E'CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);\nINSERT INTO employees VALUES (10, ''Yamada'', ''HR'', 480), (11, ''Ito'', ''Engineering'', 800), (12, ''Watanabe'', ''Engineering'', 590);', E'name | salary\nIto | 800\nWatanabe | 590', true, 2),

  ('44444444-4444-4444-8444-444444444502', '公開テスト1：5商品のうち上位3件', E'CREATE TABLE products (id INT, name TEXT, price INT);\nINSERT INTO products VALUES (1, ''Mouse'', 2500), (2, ''Cable'', 800), (3, ''Keyboard'', 8500), (4, ''Monitor'', 32000), (5, ''Stand'', 4200);', E'name | price\nMonitor | 32000\nKeyboard | 8500\nStand | 4200', false, 1),
  ('44444444-4444-4444-8444-444444444502', '非公開テスト1：境界値1000円を含むケース', E'CREATE TABLE products (id INT, name TEXT, price INT);\nINSERT INTO products VALUES (1, ''ItemA'', 1000), (2, ''ItemB'', 999), (3, ''ItemC'', 5000), (4, ''ItemD'', 3000);', E'name | price\nItemC | 5000\nItemD | 3000\nItemA | 1000', true, 2),

  ('44444444-4444-4444-8444-444444444503', '公開テスト1：3部門の集計', E'CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);\nINSERT INTO employees VALUES (1, ''A'', ''Engineering'', 600), (2, ''B'', ''Engineering'', 800), (3, ''C'', ''Engineering'', 700), (4, ''D'', ''Sales'', 500), (5, ''E'', ''Sales'', 600), (6, ''F'', ''HR'', 450);', E'department | emp_count | avg_salary\nEngineering | 3 | 700\nSales | 2 | 550\nHR | 1 | 450', false, 1),
  ('44444444-4444-4444-8444-444444444503', '非公開テスト1：別データの部門集計', E'CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);\nINSERT INTO employees VALUES (1, ''X'', ''Marketing'', 500), (2, ''Y'', ''Marketing'', 700), (3, ''Z'', ''Support'', 400);', E'department | emp_count | avg_salary\nMarketing | 2 | 600\nSupport | 1 | 400', true, 2),

  ('44444444-4444-4444-8444-444444444504', '公開テスト1：顧客別売上フィルタ', E'CREATE TABLE orders (id INT, customer_id INT, amount INT);\nINSERT INTO orders VALUES (1, 101, 6000), (2, 101, 5500), (3, 102, 4000), (4, 103, 15000), (5, 102, 3000);', E'customer_id | total_amount\n103 | 15000\n101 | 11500', false, 1),
  ('44444444-4444-4444-8444-444444444504', '非公開テスト1：10000ちょうどの境界値', E'CREATE TABLE orders (id INT, customer_id INT, amount INT);\nINSERT INTO orders VALUES (1, 201, 5000), (2, 201, 5000), (3, 202, 9999);', E'customer_id | total_amount\n201 | 10000', true, 2),

  ('44444444-4444-4444-8444-444444444505', '公開テスト1：社員と部門の結合', E'CREATE TABLE departments (id INT, dept_name TEXT);\nCREATE TABLE employees (id INT, emp_name TEXT, dept_id INT);\nINSERT INTO departments VALUES (10, ''プラットフォーム開発部''), (20, ''クラウド営業部'');\nINSERT INTO employees VALUES (1, ''Yamada'', 10), (2, ''Suzuki'', 20), (3, ''Sato'', 10);', E'emp_name | dept_name\nYamada | プラットフォーム開発部\nSuzuki | クラウド営業部\nSato | プラットフォーム開発部', false, 1),
  ('44444444-4444-4444-8444-444444444505', '非公開テスト1：未配属社員を除外する内部結合の確認', E'CREATE TABLE departments (id INT, dept_name TEXT);\nCREATE TABLE employees (id INT, emp_name TEXT, dept_id INT);\nINSERT INTO departments VALUES (1, ''AI研究部'');\nINSERT INTO employees VALUES (1, ''Takahashi'', 1), (2, ''Kato'', 99);', E'emp_name | dept_name\nTakahashi | AI研究部', true, 2),

  ('44444444-4444-4444-8444-444444444506', '公開テスト1：注文0件の顧客を含む集計', E'CREATE TABLE customers (id INT, name TEXT);\nCREATE TABLE orders (id INT, customer_id INT);\nINSERT INTO customers VALUES (1, ''Alice''), (2, ''Bob''), (3, ''Charlie'');\nINSERT INTO orders VALUES (101, 1), (102, 1), (103, 3);', E'name | order_count\nAlice | 2\nBob | 0\nCharlie | 1', false, 1),
  ('44444444-4444-4444-8444-444444444506', '非公開テスト1：全員0件〜複数件の検証', E'CREATE TABLE customers (id INT, name TEXT);\nCREATE TABLE orders (id INT, customer_id INT);\nINSERT INTO customers VALUES (10, ''Ken''), (20, ''Miki'');\nINSERT INTO orders VALUES (1, 20), (2, 20), (3, 20);', E'name | order_count\nKen | 0\nMiki | 3', true, 2);

-- SQL段階的ヒント
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES
  ('44444444-4444-4444-8444-444444444501', 1, '取得するカラムは `SELECT name, salary`、テーブルは `FROM employees` です。'),
  ('44444444-4444-4444-8444-444444444501', 2, '条件の絞り込みには `WHERE` 句を使います。'),
  ('44444444-4444-4444-8444-444444444501', 3, '`WHERE department = ''Engineering'';` を追加すれば完成です。'),

  ('44444444-4444-4444-8444-444444444502', 1, 'まず `WHERE price >= 1000` で1000円以上の商品に絞り込みます。'),
  ('44444444-4444-4444-8444-444444444502', 2, '高い順に並べるには `ORDER BY price DESC` を指定します。'),
  ('44444444-4444-4444-8444-444444444502', 3, '最後に `LIMIT 3` を付けて上位3件だけを取得します。'),

  ('44444444-4444-4444-8444-444444444503', 1, '部門ごとにまとめるには `GROUP BY department` を使います。'),
  ('44444444-4444-4444-8444-444444444503', 2, 'SELECT句で付けた別名 `emp_count` は `ORDER BY` でもそのまま使えます。'),
  ('44444444-4444-4444-8444-444444444503', 3, '`GROUP BY department ORDER BY emp_count DESC;` を記述しましょう。'),

  ('44444444-4444-4444-8444-444444444504', 1, 'まず `GROUP BY customer_id` で顧客ごとにグループ化します。'),
  ('44444444-4444-4444-8444-444444444504', 2, '集約関数に対する条件は `HAVING SUM(amount) >= 10000` と記述します。'),
  ('44444444-4444-4444-8444-444444444504', 3, '最後に `ORDER BY total_amount DESC` で降順に並べます。'),

  ('44444444-4444-4444-8444-444444444505', 1, '`FROM employees e` に続けて `INNER JOIN departments d` と書きます。'),
  ('44444444-4444-4444-8444-444444444505', 2, '結合条件は `ON e.dept_id = d.id` です。'),
  ('44444444-4444-4444-8444-444444444505', 3, '`ORDER BY e.id ASC;` を末尾に付ければ完成です。'),

  ('44444444-4444-4444-8444-444444444506', 1, '注文がない顧客も残すため `LEFT JOIN orders o ON c.id = o.customer_id` を使います。'),
  ('44444444-4444-4444-8444-444444444506', 2, '`COUNT(*)` だと NULL 行も 1 と数えてしまうため、必ず `COUNT(o.id)` を使います。'),
  ('44444444-4444-4444-8444-444444444506', 3, '`GROUP BY c.id, c.name ORDER BY c.id ASC;` でグループ化と並び替えを行います。')
ON CONFLICT (problem_id, step_number) DO NOTHING;
