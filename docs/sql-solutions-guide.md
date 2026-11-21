# SQL全30問 模範解答・解説・処理順序ガイド（講師・受講生サポート用）

本ドキュメントは、**DevSkillStudio の SQL実践コース（全5章・計30問）** について、受講生への質問対応や解説講義でそのまま使える **模範解答・SQLの処理順序・分かりやすい説明ポイント・よくあるミス** をまとめたマニュアルです。

---

## 目次

- [はじめに：SQLの「書く順番」と「処理される順番」](#はじめにsqlの書く順番と処理される順番)
- [第1章：SQL基礎とデータ抽出（SQL 1-1 〜 1-6）](#第1章sql基礎とデータ抽出)
- [第2章：集計関数とグループ化（SQL 2-1 〜 2-6）](#第2章集計関数とグループ化)
- [第3章：テーブル結合（JOIN）（SQL 3-1 〜 3-6）](#第3章テーブル結合join)
- [第4章：データ登録・更新・削除（CRUD実践）（SQL 4-1 〜 4-6）](#第4章データ登録更新削除crud実践)
- [第5章：CASE式・サブクエリ・実務総合（SQL 5-1 〜 5-6）](#第5章case式サブクエリ実務総合)

---

## はじめに：SQLの「書く順番」と「処理される順番」

受講生がSQLで最も混乱しやすいのは **「書く順番と、データベース内部で処理される順番が違う」** ことです。最初に以下を伝えると、`WHERE` と `HAVING` の違いや、`SELECT` の別名が `WHERE` で使えない理由まで一気に腹落ちします。

### 記述する順番（文法）
```sql
SELECT [DISTINCT] 列名
FROM テーブル名
[INNER / LEFT JOIN 結合先テーブル ON 結合条件]
[WHERE 抽出条件]
[GROUP BY グループ列]
[HAVING 集計後の抽出条件]
[ORDER BY 並び替え列 ASC|DESC]
[LIMIT 件数 [OFFSET 開始位置]];
```

### データベース内部で「実際に処理される順番」
1. **`FROM` / `JOIN`**：まず対象テーブルを読み込み、必要なら結合して大きな1枚の表を作る
2. **`WHERE`**：集計する前に、条件に合わない行をふるい落とす
3. **`GROUP BY`**：残った行を同じ値ごとにグループ化する
4. **`HAVING`**：グループごとに集計した結果（`SUM` や `COUNT` 等）に対して絞り込む
5. **`SELECT`**：画面に出す列を選び、計算式・`CASE`・`AS` 別名を適用する
6. **`DISTINCT`**：重複している行を1つにまとめる
7. **`ORDER BY`**：最終結果を並び替える（ここで初めて `SELECT` の `AS` 別名が使える）
8. **`LIMIT` / `OFFSET`**：先頭から何件飛ばして何件取り出すかを決める

> **※サブクエリ `(SELECT ...)` がある場合**：原則として **内側の括弧の `SELECT` が先に評価** され、その結果（値またはIDリスト）が外側の `WHERE` 等に埋め込まれてから実行されます。

---

# 第1章：SQL基礎とデータ抽出

---

### SQL 1-1. 条件に合う社員データの抽出（SELECT / WHERE）
- **難易度**: 初級（目安：10分） / **テーマ**: `SELECT`, `WHERE`

#### 模範解答
```sql
SELECT name, salary
FROM employees
WHERE department = 'Engineering';
```

#### 処理される順番
1. `FROM employees`：`employees` テーブルの全行を読み込む。
2. `WHERE department = 'Engineering'`：`department` が `'Engineering'` に一致する行だけを残す。
3. `SELECT name, salary`：残った行から `name` と `salary` の2列だけを取り出して表示する。

#### 受講生への説明ポイント・よくあるミス
- **よくあるミス**：文字列 `'Engineering'` をシングルクォート `'` で囲み忘れる、または大文字小文字を間違える。

---

### SQL 1-2. 高額商品の並び替えと上位取得（ORDER BY / LIMIT）
- **難易度**: 初級（目安：10分） / **テーマ**: `ORDER BY DESC`, `LIMIT`

#### 模範解答
```sql
SELECT name, price
FROM products
WHERE price >= 1000
ORDER BY price DESC
LIMIT 3;
```

#### 処理される順番
1. `FROM products`：商品テーブルを読み込む。
2. `WHERE price >= 1000`：1000円以上の商品だけに絞る。
3. `SELECT name, price`：商品名と価格を取り出す。
4. `ORDER BY price DESC`：価格が高い順（降順）に並び替える。
5. `LIMIT 3`：上位3件だけを切り出して返す。

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**：`ASC`＝昇順（小さい順：Ascending）、`DESC`＝降順（大きい順：Descending）。`LIMIT` は必ず `ORDER BY` で並び替えた**後**に実行される点がポイントです。

---

### SQL 1-3. 複合条件での商品検索（AND / OR）
- **難易度**: 初級（目安：8分） / **テーマ**: `AND`, 比較演算子, `ORDER BY ASC`

#### 模範解答
```sql
SELECT name, price
FROM products
WHERE category = 'Book' AND price <= 2000
ORDER BY price ASC;
```

#### 処理される順番
1. `FROM products`：全商品を読み込む。
2. `WHERE category = 'Book' AND price <= 2000`：「カテゴリが Book」かつ「2000円以下」の両方を満たす行だけを残す。
3. `SELECT name, price`：2列を抽出。
4. `ORDER BY price ASC`：価格が安い順（昇順）に並べる。

#### 受講生への説明ポイント・よくあるミス
- **よくあるミス**：`<=`（以下）と `<`（未満）の取り違え。ちょうど2000円を含める場合は `<=` を使います。

---

### SQL 1-4. 部分一致と範囲指定での検索（LIKE / BETWEEN）
- **難易度**: 初級（目安：10分） / **テーマ**: `LIKE '%...%'`, `BETWEEN ... AND ...`

#### 模範解答
```sql
SELECT name, price
FROM products
WHERE name LIKE '%Java%' AND price BETWEEN 1000 AND 3000
ORDER BY id ASC;
```

#### 処理される順番
1. `FROM products`：商品テーブルを読み込む。
2. `WHERE`：`name` の中に `Java` を含み、かつ `price` が 1000〜3000（両端含む）の行を残す。
3. `SELECT name, price` → `ORDER BY id ASC` で出力する。

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**：`%` は「0文字以上の何でもよい文字列」。`'%Java%'` で部分一致、`'Java%'` で前方一致になります。`BETWEEN 1000 AND 3000` は `1000` と `3000` を**含む**（`>= 1000 AND <= 3000` と同じ）ことを伝えましょう。

---

### SQL 1-5. 複数候補の一致と重複除外（IN / DISTINCT）
- **難易度**: 初級（目安：10分） / **テーマ**: `IN (...)`, `SELECT DISTINCT`

#### 模範解答
```sql
SELECT DISTINCT city
FROM employees
WHERE department IN ('Engineering', 'Design')
ORDER BY city ASC;
```

#### 処理される順番
1. `FROM employees` → `WHERE department IN ('Engineering', 'Design')` で対象2部門の社員を抽出。
2. `SELECT city` で都市列を取り出す。
3. `DISTINCT` で重複している都市（例：`Tokyo` が2行）を1行にまとめる。
4. `ORDER BY city ASC` でアルファベット順に並べる。

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**：`department = 'Engineering' OR department = 'Design'` と同じ意味ですが、候補が3つ4つと増えたときに `IN (...)` を使うと圧倒的に読みやすくなります。

---

### SQL 1-6. NULL判定とページネーション（IS NOT NULL / LIMIT / OFFSET）
- **難易度**: 中級（目安：12分） / **テーマ**: `IS NOT NULL`, `LIMIT / OFFSET`

#### 模範解答
```sql
SELECT id, name, email
FROM customers
WHERE email IS NOT NULL
ORDER BY id ASC
LIMIT 2 OFFSET 2;
```

#### 処理される順番
1. `FROM customers` → `WHERE email IS NOT NULL` でメール未登録（`NULL`）の顧客を除外。
2. `SELECT id, name, email` → `ORDER BY id ASC` でID順に整列。
3. `LIMIT 2 OFFSET 2`：先頭2件（1ページ目）を飛ばし、3件目〜4件目（2ページ目）の2件を返す。

#### 受講生への説明ポイント・よくあるミス
- **一番多いミス**：`WHERE email != NULL` と書いてしまう。SQLでは `NULL` は「不明な値」なので `=` や `!=` で比較できず、必ず **`IS NULL` / `IS NOT NULL`** を使う必要があります。

---

# 第2章：集計関数とグループ化

---

### SQL 2-1. 部門別の社員数と平均給与の集計（GROUP BY）
- **難易度**: 中級（目安：15分） / **テーマ**: `GROUP BY`, `COUNT(*)`, `AVG()`

#### 模範解答
```sql
SELECT department, COUNT(*) AS emp_count, AVG(salary) AS avg_salary
FROM employees
GROUP BY department
ORDER BY emp_count DESC;
```

#### 処理される順番
1. `FROM employees`：全社員を読み込む。
2. `GROUP BY department`：同じ `department` の行同士を1つの箱（グループ）にまとめる。
3. `SELECT`：各グループごとに件数 `COUNT(*)` と平均 `AVG(salary)` を計算し、別名（`emp_count`, `avg_salary`）を付ける。
4. `ORDER BY emp_count DESC`：人数の多い部門順に並べる。

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**：`GROUP BY` を使うときは、`SELECT` に書けるのは「`GROUP BY` に指定した列」か「集計関数（`COUNT`, `SUM`, `AVG` 等）」だけ、と覚えるとエラーを防げます。

---

### SQL 2-2. 売上合計が基準以上の顧客を抽出（GROUP BY / HAVING）
- **難易度**: 中級（目安：15分） / **テーマ**: `GROUP BY`, `HAVING`, `SUM()`

#### 模範解答
```sql
SELECT customer_id, SUM(amount) AS total_amount
FROM orders
GROUP BY customer_id
HAVING SUM(amount) >= 10000
ORDER BY total_amount DESC;
```

#### 処理される順番
1. `FROM orders` → `GROUP BY customer_id` で顧客ごとのグループを作成。
2. `HAVING SUM(amount) >= 10000`：グループごとの合計金額が 10000 以上の顧客だけを残す。
3. `SELECT` で出力列を確定し、`ORDER BY total_amount DESC` で降順に並べる。

#### 受講生への説明ポイント・よくあるミス
- **よくあるミス**：`WHERE SUM(amount) >= 10000` と書いてしまう。`WHERE` は `GROUP BY` より前に実行されるため、`SUM()` などの集計結果の絞り込みは必ず `HAVING` に書きます。

---

### SQL 2-3. カテゴリ別の最高価格・最低価格・商品数（MAX / MIN / COUNT）
- **難易度**: 初級（目安：10分） / **テーマ**: `MAX()`, `MIN()`, `COUNT(*)`

#### 模範解答
```sql
SELECT category, COUNT(*) AS item_count, MAX(price) AS max_price, MIN(price) AS min_price
FROM products
GROUP BY category
ORDER BY category ASC;
```

#### 処理される順番
1. `FROM products` → `GROUP BY category` でカテゴリごとにまとめる。
2. 各グループ内で件数・最大価格・最小価格を同時に算出。
3. `ORDER BY category ASC` でカテゴリ名昇順に出力する。

---

### SQL 2-4. ユニーク購入者数の集計（COUNT(DISTINCT)）
- **難易度**: 中級（目安：10分） / **テーマ**: `COUNT(DISTINCT col)`

#### 模範解答
```sql
SELECT COUNT(*) AS total_orders, COUNT(DISTINCT customer_id) AS unique_customers
FROM orders;
```

#### 処理される順番
1. `FROM orders`：全注文行を読み込む。
2. `COUNT(*)` で全行数（総注文件数）を数え、`COUNT(DISTINCT customer_id)` で重複を除いた顧客IDの種類数（UU数）を数える。

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**：同じ顧客が3回注文した場合、`COUNT(*)` は `3`、`COUNT(DISTINCT customer_id)` は `1` になります。ECサイトの「注文件数 vs 購入人数」の違いで例えると一発で理解できます。

---

### SQL 2-5. 複数カラムでのグループ集計（部門 × 役職別人数）
- **難易度**: 中級（目安：12分） / **テーマ**: 複数列 `GROUP BY`

#### 模範解答
```sql
SELECT department, role, COUNT(*) AS cnt
FROM employees
GROUP BY department, role
ORDER BY department ASC, role ASC;
```

#### 処理される順番
1. `FROM employees` → `GROUP BY department, role` で「部門と役職のペア」ごとにグループ化。
2. 各ペアの人数を `COUNT(*)` で集計。
3. まず `department` 昇順、同じ部門内では `role` 昇順で並び替えて出力。

---

### SQL 2-6. WHERE と HAVING を組み合わせた有効売上集計
- **難易度**: 中級（目安：12分） / **テーマ**: `WHERE`（集計前）＋ `HAVING`（集計後）

#### 模範解答
```sql
SELECT customer_id, SUM(amount) AS total_amount
FROM orders
WHERE status = 'COMPLETED'
GROUP BY customer_id
HAVING SUM(amount) >= 10000
ORDER BY total_amount DESC;
```

#### 処理される順番
1. `FROM orders` → `WHERE status = 'COMPLETED'`：まずキャンセル等を除外して完了注文だけを残す。
2. `GROUP BY customer_id`：残った有効注文だけを顧客ごとにまとめる。
3. `HAVING SUM(amount) >= 10000`：有効注文の合計が10000円以上の顧客だけを残す。
4. `SELECT` → `ORDER BY total_amount DESC` で出力。

---

# 第3章：テーブル結合（JOIN）

---

### SQL 3-1. 社員と部門テーブルの内部結合（INNER JOIN）
- **難易度**: 中級（目安：15分） / **テーマ**: `INNER JOIN`, テーブル別名

#### 模範解答
```sql
SELECT e.emp_name, d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id
ORDER BY e.id ASC;
```

#### 処理される順番
1. `FROM employees e INNER JOIN departments d ON e.dept_id = d.id`：社員の `dept_id` と部門の `id` が一致する行同士を横に連結する（一致しない未配属社員は除外される）。
2. `SELECT e.emp_name, d.dept_name` → `ORDER BY e.id ASC` で出力。

---

### SQL 3-2. 外部結合と注文実績のない顧客も含めた集計（LEFT JOIN）
- **難易度**: 上級（目安：20分） / **テーマ**: `LEFT JOIN`, `COUNT(o.id)`

#### 模範解答
```sql
SELECT c.name, COUNT(o.id) AS order_count
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY c.id ASC;
```

#### 処理される順番
1. `FROM customers c LEFT JOIN orders o ON c.id = o.customer_id`：左テーブル（全顧客）を残し、注文が無い顧客は右側を `NULL` で埋める。
2. `GROUP BY c.id, c.name` で顧客ごとにまとめる。
3. `COUNT(o.id)` は `NULL` を数えないため、未注文顧客は正しく `0` になる。

#### 受講生への説明ポイント・よくあるミス
- **一番多いミス**：`COUNT(*)` と書いてしまうと、`NULL` で埋められた1行もカウントされて未注文顧客が `1` 件になってしまう！**「LEFT JOIN後の件数集計は必ず右テーブルの列 `COUNT(o.id)` を使う」** のが鉄則です。

---

### SQL 3-3. 未注文顧客の抽出（LEFT JOIN + IS NULL）
- **難易度**: 中級（目安：12分） / **テーマ**: アンチ結合（`LEFT JOIN` + `WHERE o.id IS NULL`）

#### 模範解答
```sql
SELECT c.id, c.name
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL
ORDER BY c.id ASC;
```

#### 処理される順番
1. `LEFT JOIN` で全顧客に注文を紐付ける（未注文顧客は `o.id` が `NULL` になる）。
2. `WHERE o.id IS NULL` で「注文が紐付かなかった顧客」だけを残す。
3. `SELECT c.id, c.name` → `ORDER BY c.id ASC` で出力。

---

### SQL 3-4. 3テーブル結合による注文明細レポート
- **難易度**: 中級（目安：15分） / **テーマ**: 多段 `INNER JOIN`（3テーブル結合）

#### 模範解答
```sql
SELECT o.id AS order_id, c.name AS customer_name, p.name AS product_name, p.price
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
INNER JOIN products p ON o.product_id = p.id
ORDER BY o.id ASC;
```

#### 処理される順番
1. まず `orders` と `customers` を `customer_id = c.id` で結合。
2. その結果にさらに `products` を `product_id = p.id` で結合。
3. `SELECT` で各テーブルから必要な列を別名付きで抽出し、`o.id` 昇順で出力。

---

### SQL 3-5. 3テーブル結合＋カテゴリ別売上ランキング
- **難易度**: 上級（目安：15分） / **テーマ**: 3テーブル `JOIN` + `GROUP BY` + `SUM`

#### 模範解答
```sql
SELECT cat.name AS category_name, SUM(o.amount) AS total_sales
FROM orders o
INNER JOIN products p ON o.product_id = p.id
INNER JOIN categories cat ON p.category_id = cat.id
GROUP BY cat.name
ORDER BY total_sales DESC;
```

#### 処理される順番
1. `orders → products → categories` の順に3テーブルを連結。
2. `GROUP BY cat.name` でカテゴリ名ごとにまとめる。
3. `SUM(o.amount)` でカテゴリ別売上合計を算出し、降順で出力。

---

### SQL 3-6. 結合テーブルに対する条件絞り込み（部門別高額社員）
- **難易度**: 中級（目安：12分） / **テーマ**: `JOIN` 後の複合 `WHERE`

#### 模範解答
```sql
SELECT e.name AS emp_name, d.name AS dept_name, e.salary
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id
WHERE d.location = 'Tokyo' AND e.salary >= 600
ORDER BY e.salary DESC;
```

#### 処理される順番
1. `employees` と `departments` を結合し、社員ごとの拠点（`d.location`）を紐付ける。
2. `WHERE d.location = 'Tokyo' AND e.salary >= 600` で左右両テーブルの条件で絞り込む。
3. `SELECT` → `ORDER BY e.salary DESC` で出力。

---

# 第4章：データ登録・更新・削除（CRUD実践）

---

### SQL 4-1. 新規顧客レコードの登録（INSERT INTO）
- **難易度**: 初級（目安：8分） / **テーマ**: `INSERT INTO`

#### 模範解答
```sql
INSERT INTO customers (id, name, plan) VALUES (3, 'Takahashi', 'PRO');
SELECT id, name, plan FROM customers ORDER BY id ASC;
```

#### 処理される順番
1. 1文目：`customers` テーブルの `(id, name, plan)` 列に新しい1行を挿入する。
2. 2文目：挿入後のテーブル全件を `id` 昇順で `SELECT` して結果を表示する。

---

### SQL 4-2. 複数レコードの一括登録（マルチ行INSERT）
- **難易度**: 初級（目安：8分） / **テーマ**: 複数行 `INSERT`

#### 模範解答
```sql
INSERT INTO tasks (id, title, status) VALUES (2, 'Write Tests', 'TODO'), (3, 'Deploy App', 'TODO');
SELECT id, title, status FROM tasks ORDER BY id ASC;
```

#### 処理される順番
1. 1文目：`VALUES` 句にカンマ区切りで指定した2行をまとめて `tasks` へ追加する。
2. 2文目：追加後の全件を `id` 昇順で確認出力する。

---

### SQL 4-3. 特定商品の価格改定（UPDATE / WHERE）
- **難易度**: 初級（目安：8分） / **テーマ**: `UPDATE ... SET ... WHERE`

#### 模範解答
```sql
UPDATE products SET price = 2500 WHERE id = 2;
SELECT id, name, price FROM products ORDER BY id ASC;
```

#### 処理される順番
1. 1文目：`products` テーブルの中から `id = 2` に一致する行だけを特定し、`price` を `2500` に書き換える。
2. 2文目：更新後のテーブル全件を出力する。

#### 受講生への説明ポイント・よくあるミス
- **最重要注意点**：`WHERE id = 2` を書き忘れると **全商品の価格が2500円に書き換わる** 重大事故になります。「`UPDATE` と `DELETE` は最初に `WHERE` を確認する」と指導しましょう。

---

### SQL 4-4. 条件一致レコードの一括ステータス更新（UPDATE + 複数条件）
- **難易度**: 中級（目安：10分） / **テーマ**: 複数条件 `UPDATE`

#### 模範解答
```sql
UPDATE orders SET status = 'APPROVED' WHERE status = 'PENDING' AND amount >= 5000;
SELECT id, status, amount FROM orders ORDER BY id ASC;
```

#### 処理される順番
1. 1文目：`status = 'PENDING'` かつ `amount >= 5000` の行だけを抽出し、`status` を `'APPROVED'` に書き換える（`CANCELLED` や 5000円未満の行は触らない）。
2. 2文目：全件を `id` 昇順で出力する。

---

### SQL 4-5. キャンセル済みデータの削除（DELETE FROM / WHERE）
- **難易度**: 初級（目安：8分） / **テーマ**: `DELETE FROM ... WHERE`

#### 模範解答
```sql
DELETE FROM orders WHERE status = 'CANCELLED';
SELECT id, status, amount FROM orders ORDER BY id ASC;
```

#### 処理される順番
1. 1文目：`orders` テーブルから `status = 'CANCELLED'` の行だけを削除する。
2. 2文目：残った行を `id` 昇順で出力する。

---

### SQL 4-6. 在庫テーブルのCRUD総合シナリオ（INSERT / UPDATE / DELETE）
- **難易度**: 中級（目安：12分） / **テーマ**: CRUD連続操作と実行順序

#### 模範解答
```sql
INSERT INTO stocks (id, item, qty) VALUES (4, 'Cable', 20);
UPDATE stocks SET qty = 15 WHERE id = 1;
DELETE FROM stocks WHERE qty <= 0;
SELECT id, item, qty FROM stocks ORDER BY id ASC;
```

#### 処理される順番
1. `INSERT`：商品 `id=4`（在庫20）を追加。
2. `UPDATE`：`id=1` の在庫を `15` へ更新（もし元々 `0` でもここで `15` になる）。
3. `DELETE`：この時点で在庫が `0` 以下の行だけを削除（`UPDATE` より先に `DELETE` を実行すると `id=1` が消えてしまう場合があるため順番が重要！）。
4. `SELECT`：最終状態を `id` 昇順で出力。

---

# 第5章：CASE式・サブクエリ・実務総合

---

### SQL 5-1. CASE WHEN による顧客ランク判定
- **難易度**: 中級（目安：12分） / **テーマ**: `CASE WHEN ... THEN ... ELSE ... END`

#### 模範解答
```sql
SELECT name,
  CASE
    WHEN total_spent >= 100000 THEN 'VIP'
    WHEN total_spent >= 30000 THEN 'STANDARD'
    ELSE 'LIGHT'
  END AS rank
FROM customers
ORDER BY id ASC;
```

#### 処理される順番
1. `FROM customers`：全顧客を読み込む。
2. `SELECT` 内で1行ごとに `CASE` を上から評価し、最初に一致した `WHEN` の値を `rank` 列として生成する。
3. `ORDER BY id ASC` で並べて出力する。

---

### SQL 5-2. COALESCE と CASE WHEN による欠損データの整形表示
- **難易度**: 中級（目安：12分） / **テーマ**: `COALESCE`, `CASE WHEN`, `IS NULL`

#### 模範解答
```sql
SELECT name,
  COALESCE(phone, 'UNREGISTERED') AS contact,
  CASE WHEN phone IS NULL THEN 'INCOMPLETE' ELSE 'READY' END AS status
FROM users
ORDER BY id ASC;
```

#### 処理される順番
1. `FROM users` でユーザーを読み込む。
2. `COALESCE(phone, 'UNREGISTERED')` が `phone` が `NULL` のときだけ `'UNREGISTERED'` に置換する。
3. `CASE WHEN phone IS NULL ...` で未登録なら `'INCOMPLETE'`、登録済みなら `'READY'` を付与し、`id` 昇順で出力する。

---

### SQL 5-3. スカラーサブクエリ：全体平均給与を上回る社員の抽出
- **難易度**: 上級（目安：15分） / **テーマ**: スカラーサブクエリ

#### 模範解答
```sql
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)
ORDER BY salary DESC;
```

#### 処理される順番
1. **最初に内側のサブクエリ** `(SELECT AVG(salary) FROM employees)` が実行され、平均給与（例：`600`）という1つの数値が確定する。
2. 次に外側のクエリが `WHERE salary > 600` として実行され、平均より高い社員だけを抽出する。
3. `ORDER BY salary DESC` で高い順に出力する。

---

### SQL 5-4. INサブクエリ：高額注文実績のある顧客リスト抽出
- **難易度**: 上級（目安：15分） / **テーマ**: `IN (SELECT ...)` サブクエリ

#### 模範解答
```sql
SELECT id, name
FROM customers
WHERE id IN (SELECT customer_id FROM orders WHERE amount >= 10000)
ORDER BY id ASC;
```

#### 処理される順番
1. **最初に内側のサブクエリ** が実行され、10000円以上の注文をした `customer_id` の一覧（例：`(1, 3)`）を作る。
2. 外側のクエリが `WHERE id IN (1, 3)` として `customers` から該当顧客だけを重複なく抽出する。
3. `ORDER BY id ASC` で出力する。

---

### SQL 5-5. NOT IN サブクエリ：一度も売れていない商品の抽出
- **難易度**: 上級（目安：15分） / **テーマ**: `NOT IN (SELECT ...)` サブクエリ

#### 模範解答
```sql
SELECT id, name
FROM products
WHERE id NOT IN (SELECT product_id FROM orders)
ORDER BY id ASC;
```

#### 処理される順番
1. **最初に内側のサブクエリ** が実行され、注文実績のある `product_id` 一覧（例：`(1, 3)`）を取得する。
2. 外側のクエリが `WHERE id NOT IN (1, 3)` として、リストに含まれない商品（未販売商品）だけを抽出する。
3. `ORDER BY id ASC` で出力する。

---

### SQL 5-6. 実務総合：高パフォーマンス社員レポート（JOIN + サブクエリ + CASE）
- **難易度**: 上級（目安：20分） / **テーマ**: `JOIN` ＋ スカラーサブクエリ ＋ `CASE WHEN`

#### 模範解答
```sql
SELECT e.name AS emp_name, d.name AS dept_name, e.salary,
  CASE WHEN e.salary >= 800 THEN 'S' ELSE 'A' END AS grade
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id
WHERE e.salary >= (SELECT AVG(salary) FROM employees)
ORDER BY e.salary DESC;
```

#### 処理される順番
1. **内側サブクエリ**：全社員の平均給与 `AVG(salary)` を先に算出する（例：`650`）。
2. **`FROM` / `INNER JOIN`**：`employees` と `departments` を `dept_id = d.id` で結合する。
3. **`WHERE`**：給与が平均（`650`）以上の社員だけに絞り込む。
4. **`SELECT` / `CASE`**：社員名・部門名・給与を取り出し、800以上なら `'S'`、それ以外は `'A'` を `grade` 列として付与する。
5. **`ORDER BY e.salary DESC`**：給与の高い順に並べて最終出力する。
