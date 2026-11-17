-- =============================================================================
-- Java入門コース シードデータ（4章 × 各3問 ＝ 12問、テストケース、段階的ヒント、サンプル企業）
-- =============================================================================

-- サンプル企業（新規登録時に企業コード「ACME2025」または「TECH2025」を入力すると紐付く）
INSERT INTO public.companies (id, name, company_code, contact_email)
VALUES
  ('00000000-0000-4000-8000-000000000001', '株式会社ACMEテクノロジーズ', 'ACME2025', 'hr@acme-tech.example.com'),
  ('00000000-0000-4000-8000-000000000002', 'ネクストシステムズ株式会社', 'TECH2025', 'training@next-sys.example.com')
ON CONFLICT (id) DO NOTHING;

-- コース：Java入門コース（基礎からオブジェクト指向まで）
INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES
  (
    '11111111-1111-4111-8111-111111111101',
    'Java入門コース：ゼロから学ぶオブジェクト指向実践',
    '標準出力・変数・四則演算からスタートし、条件分岐とループ、配列とメソッド、クラス設計と継承・ポリモーフィズムまで全12問のコーディング演習で体系的に習得します。',
    1,
    true,
    NULL
  )
ON CONFLICT (id) DO NOTHING;

-- 章（4章構成）
INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES
  (
    '22222222-2222-4222-8222-222222222201',
    '11111111-1111-4111-8111-111111111101',
    '第1章：出力と変数',
    'System.out.println による標準出力、基本データ型、四則演算とScannerによる入力処理を学びます。',
    1,
    true
  ),
  (
    '22222222-2222-4222-8222-222222222202',
    '11111111-1111-4111-8111-111111111101',
    '第2章：条件分岐とループ',
    'if-else文、switch文、forループ、whileループを組み合わせてアルゴリズムの基礎を身につけます。',
    2,
    true
  ),
  (
    '22222222-2222-4222-8222-222222222203',
    '11111111-1111-4111-8111-111111111101',
    '第3章：配列とメソッド',
    '1次元・2次元配列の操作、staticメソッドの定義、オーバーロードと再帰呼び出しを実践します。',
    3,
    true
  ),
  (
    '22222222-2222-4222-8222-222222222204',
    '11111111-1111-4111-8111-111111111101',
    '第4章：クラスとオブジェクト',
    'フィールドとコンストラクタ、カプセル化、extendsによる継承とメソッドのオーバーライド、ポリモーフィズムを学びます。',
    4,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 単元（各章に単元を配置）
INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES
  (
    '33333333-3333-4333-8333-333333333301',
    '22222222-2222-4222-8222-222222222201',
    '1-1. 標準入出力と変数の基本',
    'Javaプログラムの基本構造と `System.out.println`、`Scanner` を使った入出力、四則演算を学びます。',
    1,
    true
  ),
  (
    '33333333-3333-4333-8333-333333333302',
    '22222222-2222-4222-8222-222222222202',
    '2-1. 制御構文（分岐・反復）のマスター',
    '`if / else if / else` による条件分岐と、`for`・`while` ループによる反復処理を学びます。',
    1,
    true
  ),
  (
    '33333333-3333-4333-8333-333333333303',
    '22222222-2222-4222-8222-222222222203',
    '3-1. 配列処理とメソッド分割',
    '複数のデータを扱う配列と、処理を部品化するメソッド・再帰呼び出しを学びます。',
    1,
    true
  ),
  (
    '33333333-3333-4333-8333-333333333304',
    '22222222-2222-4222-8222-222222222204',
    '4-1. オブジェクト指向プログラミング実践',
    'クラス定義・コンストラクタ・カプセル化・継承・オーバーライドを実践します。',
    1,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 問題（全12問）
-- =============================================================================

-- 第1章：1-1
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES (
  '44444444-4444-4444-8444-444444444401',
  '33333333-3333-4333-8333-333333333301',
  '1-1. Hello Java! と複数行の出力',
  E'### 問題概要\nJavaの標準出力 `System.out.println` を使って、以下の2行を順番に出力するプログラムを作成してください。\n\n```\nHello, Java!\nLet''s start programming!\n```\n\n### 条件\n- 大文字・小文字や記号（カンマ、エクスクラメーションマーク）を正確に出力してください。',
  'easy',
  5,
  ARRAY['出力と変数', '基礎構文'],
  E'public class Main {\n    public static void main(String[] args) {\n        // ここに System.out.println を記述してください\n        \n    }\n}',
  E'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n        System.out.println("Let''s start programming!");\n    }\n}',
  E'`System.out.println("文字列");` を使うと、文字列を出力したあとに自動で改行されます。2行出力する場合は `System.out.println` を2回呼び出します。',
  1,
  true
) ON CONFLICT (id) DO NOTHING;

-- 第1章：1-2
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES (
  '44444444-4444-4444-8444-444444444402',
  '33333333-3333-4333-8333-333333333301',
  '1-2. 長方形の面積と周囲の長さ',
  E'### 問題概要\n標準入力から2つの整数 H（縦の長さ）と W（横の長さ）が空白または改行区切りで与えられます。\n長方形の **面積**（H * W）と **周囲の長さ**（2 * (H + W)）を空白区切りで1行に出力してください。\n\n### 入力例\n```\n3 5\n```\n\n### 出力例\n```\n15 16\n```',
  'easy',
  10,
  ARRAY['出力と変数', '算術演算', 'Scanner'],
  E'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int h = sc.nextInt();\n        int w = sc.nextInt();\n        \n        // 面積と周囲の長さを計算して出力してください\n        \n    }\n}',
  E'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int h = sc.nextInt();\n        int w = sc.nextInt();\n        int area = h * w;\n        int perimeter = 2 * (h + w);\n        System.out.println(area + " " + perimeter);\n    }\n}',
  E'掛け算には `*` 演算子を使います。周囲の長さは足し算を先に計算させるため `2 * (h + w)` のように丸括弧で囲みます。',
  2,
  true
) ON CONFLICT (id) DO NOTHING;

-- 第1章：1-3
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES (
  '44444444-4444-4444-8444-444444444403',
  '33333333-3333-4333-8333-333333333301',
  '1-3. 秒数の時間変換（時・分・秒）',
  E'### 問題概要\n標準入力から秒数を表す整数 S が与えられます。\nこれを **時間 (h)**、**分 (m)**、**秒 (s)** に変換し、`h:m:s` の形式で出力してください。\n\n### 入力例\n```\n46979\n```\n\n### 出力例\n```\n13:2:59\n```',
  'easy',
  10,
  ARRAY['出力と変数', '算術演算'],
  E'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int totalSeconds = sc.nextInt();\n        \n        // h:m:s の形式で出力してください\n        \n    }\n}',
  E'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int totalSeconds = sc.nextInt();\n        int h = totalSeconds / 3600;\n        int m = (totalSeconds % 3600) / 60;\n        int s = totalSeconds % 60;\n        System.out.println(h + ":" + m + ":" + s);\n    }\n}',
  E'1時間は3600秒、1分は60秒です。整数の割り算 `/` と剰余（余り）演算子 `%` を組み合わせることで各単位を取り出せます。',
  3,
  true
) ON CONFLICT (id) DO NOTHING;

-- 第2章：2-1
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES (
  '44444444-4444-4444-8444-444444444404',
  '33333333-3333-4333-8333-333333333302',
  '2-1. テストの成績判定（if-else分岐）',
  E'### 問題概要\n標準入力からテストの点数 score（0 <= score <= 100）が与えられます。\n以下の基準に従ってランクを出力してください。\n\n- 80点以上： `A`\n- 60点以上 80点未満： `B`\n- 40点以上 60点未満： `C`\n- 40点未満： `D`\n\n### 入力例\n```\n75\n```\n\n### 出力例\n```\nB\n```',
  'easy',
  10,
  ARRAY['条件分岐', '基礎構文'],
  E'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int score = sc.nextInt();\n        \n        // if - else if - else を使って判定してください\n        \n    }\n}',
  E'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int score = sc.nextInt();\n        if (score >= 80) {\n            System.out.println("A");\n        } else if (score >= 60) {\n            System.out.println("B");\n        } else if (score >= 40) {\n            System.out.println("C");\n        } else {\n            System.out.println("D");\n        }\n    }\n}',
  E'上から順番に高い点数の条件（`score >= 80`）から判定していくことで、`else if (score >= 60)` の時点では自動的に80点未満であることが保証されます。',
  1,
  true
) ON CONFLICT (id) DO NOTHING;

-- 第2章：2-2
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES (
  '44444444-4444-4444-8444-444444444405',
  '33333333-3333-4333-8333-333333333302',
  '2-2. FizzBuzz問題（ループと条件分岐）',
  E'### 問題概要\n整数 N が与えられます。1 から N までの整数を順番に1行ずつ出力してください。\nただし：\n- 3の倍数かつ5の倍数のときは数値の代わりに `FizzBuzz`\n- 3の倍数のときは `Fizz`\n- 5の倍数のときは `Buzz`\nを出力してください。\n\n### 入力例\n```\n5\n```\n\n### 出力例\n```\n1\n2\nFizz\n4\nBuzz\n```',
  'medium',
  15,
  ARRAY['条件分岐', 'ループ', '算術演算'],
  E'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        \n        // 1 から n までループして出力してください\n        \n    }\n}',
  E'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        for (int i = 1; i <= n; i++) {\n            if (i % 15 == 0) {\n                System.out.println("FizzBuzz");\n            } else if (i % 3 == 0) {\n                System.out.println("Fizz");\n            } else if (i % 5 == 0) {\n                System.out.println("Buzz");\n            } else {\n                System.out.println(i);\n            }\n        }\n    }\n}',
  E'3と5の両方で割り切れる（つまり15で割り切れる `i % 15 == 0`）条件を最初に判定するのがポイントです。',
  2,
  true
) ON CONFLICT (id) DO NOTHING;

-- 第2章：2-3
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES (
  '44444444-4444-4444-8444-444444444406',
  '33333333-3333-4333-8333-333333333302',
  '2-3. 各桁の和（whileループの活用）',
  E'### 問題概要\n正の整数 N が与えられます。N の十進法表記における各桁の数字の和を求めて出力してください。\n例えば N = 1234 のとき、1 + 2 + 3 + 4 = 10 を出力します。\n\n### 入力例\n```\n1234\n```\n\n### 出力例\n```\n10\n```',
  'medium',
  15,
  ARRAY['ループ', '算術演算'],
  E'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        \n        // 各桁の和を計算して出力してください\n        \n    }\n}',
  E'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int sum = 0;\n        while (n > 0) {\n            sum += n % 10;\n            n /= 10;\n        }\n        System.out.println(sum);\n    }\n}',
  E'整数 `n` を 10 で割った余り（`n % 10`）が一の位の数字になります。それを `sum` に足したあと、`n /= 10` で一桁右にずらす処理を `n > 0` の間繰り返します。',
  3,
  true
) ON CONFLICT (id) DO NOTHING;

-- 第3章：3-1
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES (
  '44444444-4444-4444-8444-444444444407',
  '33333333-3333-4333-8333-333333333303',
  '3-1. 配列の最大値と合計値',
  E'### 問題概要\n最初に要素数 N が与えられ、続けて N 個の整数が与えられます。\nこれらを配列に格納し、**最大値** と **合計値** を空白区切りで出力してください。\n\n### 入力例\n```\n5\n12 45 7 23 19\n```\n\n### 出力例\n```\n45 106\n```',
  'easy',
  15,
  ARRAY['配列', 'ループ'],
  E'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) {\n            nums[i] = sc.nextInt();\n        }\n        \n        // 最大値と合計値を求めて出力してください\n        \n    }\n}',
  E'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) {\n            nums[i] = sc.nextInt();\n        }\n        int max = nums[0];\n        int sum = 0;\n        for (int v : nums) {\n            if (v > max) {\n                max = v;\n            }\n            sum += v;\n        }\n        System.out.println(max + " " + sum);\n    }\n}',
  E'最大値の初期値には配列の先頭要素 `nums[0]` を使うと、負の数が含まれる場合でも正しく最大値を求められます。',
  1,
  true
) ON CONFLICT (id) DO NOTHING;

-- 第3章：3-2
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES (
  '44444444-4444-4444-8444-444444444408',
  '33333333-3333-4333-8333-333333333303',
  '3-2. 素数判定メソッドの実装',
  E'### 問題概要\n整数 x が素数かどうかを判定する static メソッド `isPrime(int x)` を完成させ、標準入力から与えられた整数 N が素数なら `Prime`、そうでなければ `Not Prime` と出力してください。\n（※ 1 は素数ではありません）\n\n### 入力例\n```\n17\n```\n\n### 出力例\n```\nPrime\n```',
  'medium',
  15,
  ARRAY['メソッド', 'ループ', '条件分岐'],
  E'import java.util.Scanner;\n\npublic class Main {\n    public static boolean isPrime(int x) {\n        // ここを実装してください\n        return false;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        if (isPrime(n)) {\n            System.out.println("Prime");\n        } else {\n            System.out.println("Not Prime");\n        }\n    }\n}',
  E'import java.util.Scanner;\n\npublic class Main {\n    public static boolean isPrime(int x) {\n        if (x < 2) return false;\n        for (int i = 2; i * i <= x; i++) {\n            if (x % i == 0) {\n                return false;\n            }\n        }\n        return true;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        if (isPrime(n)) {\n            System.out.println("Prime");\n        } else {\n            System.out.println("Not Prime");\n        }\n    }\n}',
  E'2未満の数は素数ではありません。2以上の数については、2から √x（`i * i <= x`）までの整数で割り切れるものがあるかを調べます。',
  2,
  true
) ON CONFLICT (id) DO NOTHING;

-- 第3章：3-3
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES (
  '44444444-4444-4444-8444-444444444409',
  '33333333-3333-4333-8333-333333333303',
  '3-3. 再帰メソッドによる階乗計算',
  E'### 問題概要\n非負整数 N（0 <= N <= 10）が与えられます。\n再帰メソッド `factorial(int n)` を定義して N!（N の階乗）を計算し、出力してください。\nただし 0! = 1 とします。\n\n### 入力例\n```\n5\n```\n\n### 出力例\n```\n120\n```',
  'medium',
  15,
  ARRAY['メソッド', '再帰'],
  E'import java.util.Scanner;\n\npublic class Main {\n    public static int factorial(int n) {\n        // 再帰呼び出しを使って n! を返してください\n        \n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(factorial(n));\n    }\n}',
  E'import java.util.Scanner;\n\npublic class Main {\n    public static int factorial(int n) {\n        if (n <= 1) {\n            return 1;\n        }\n        return n * factorial(n - 1);\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(factorial(n));\n    }\n}',
  E'再帰メソッドでは必ず「終了条件（ベースケース）」を先に記述します。`n <= 1` のとき `1` を返し、それ以外は `n * factorial(n - 1)` を返します。',
  3,
  true
) ON CONFLICT (id) DO NOTHING;

-- 第4章：4-1
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES (
  '44444444-4444-4444-8444-444444444410',
  '33333333-3333-4333-8333-333333333304',
  '4-1. 商品クラス（Product）の定義とコンストラクタ',
  E'### 問題概要\n商品名 `name`（String）と単価 `price`（int）をフィールドに持つ `Product` クラスを作成してください。\n- コンストラクタ `Product(String name, int price)` でフィールドを初期化する\n- `getTotalPrice(int quantity)` メソッドで `price * quantity` を返す\n\n標準入力から「商品名 単価 個数」が与えられるので、`商品名: 合計金額円` の形式で出力してください。\n\n### 入力例\n```\nCoffee 350 3\n```\n\n### 出力例\n```\nCoffee: 1050円\n```',
  'medium',
  15,
  ARRAY['オブジェクト指向', 'クラス設計'],
  E'import java.util.Scanner;\n\nclass Product {\n    String name;\n    int price;\n\n    // コンストラクタと getTotalPrice メソッドを実装してください\n    \n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String name = sc.next();\n        int price = sc.nextInt();\n        int quantity = sc.nextInt();\n\n        Product p = new Product(name, price);\n        System.out.println(p.name + ": " + p.getTotalPrice(quantity) + "円");\n    }\n}',
  E'import java.util.Scanner;\n\nclass Product {\n    String name;\n    int price;\n\n    public Product(String name, int price) {\n        this.name = name;\n        this.price = price;\n    }\n\n    public int getTotalPrice(int quantity) {\n        return this.price * quantity;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String name = sc.next();\n        int price = sc.nextInt();\n        int quantity = sc.nextInt();\n\n        Product p = new Product(name, price);\n        System.out.println(p.name + ": " + p.getTotalPrice(quantity) + "円");\n    }\n}',
  E'コンストラクタ内で引数名とフィールド名が同じ場合は `this.name = name;` のように `this` キーワードを使って自身のフィールドを指し示します。',
  1,
  true
) ON CONFLICT (id) DO NOTHING;

-- 第4章：4-2
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES (
  '44444444-4444-4444-8444-444444444411',
  '33333333-3333-4333-8333-333333333304',
  '4-2. 銀行口座クラス（カプセル化と残高チェック）',
  E'### 問題概要\n銀行口座を表す `BankAccount` クラスを実装してください。\n- 初期残高 `balance` をコンストラクタで受け取る\n- `deposit(int amount)`：残高に `amount` を加算する\n- `withdraw(int amount)`：残高が `amount` 以上あれば減算し、足りない場合は減算せず `Insufficient funds` と出力する\n- `getBalance()`：現在の残高を返す\n\n### 入力例\n```\n1000\n500\n1200\n```\n\n### 出力例\n```\n300\n```',
  'medium',
  20,
  ARRAY['オブジェクト指向', 'クラス設計', '条件分岐'],
  E'import java.util.Scanner;\n\nclass BankAccount {\n    private int balance;\n\n    public BankAccount(int initialBalance) {\n        this.balance = initialBalance;\n    }\n\n    // deposit, withdraw, getBalance を実装してください\n    \n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int initial = sc.nextInt();\n        int dep = sc.nextInt();\n        int wit = sc.nextInt();\n\n        BankAccount account = new BankAccount(initial);\n        account.deposit(dep);\n        account.withdraw(wit);\n        System.out.println(account.getBalance());\n    }\n}',
  E'import java.util.Scanner;\n\nclass BankAccount {\n    private int balance;\n\n    public BankAccount(int initialBalance) {\n        this.balance = initialBalance;\n    }\n\n    public void deposit(int amount) {\n        this.balance += amount;\n    }\n\n    public void withdraw(int amount) {\n        if (this.balance >= amount) {\n            this.balance -= amount;\n        } else {\n            System.out.println("Insufficient funds");\n        }\n    }\n\n    public int getBalance() {\n        return this.balance;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int initial = sc.nextInt();\n        int dep = sc.nextInt();\n        int wit = sc.nextInt();\n\n        BankAccount account = new BankAccount(initial);\n        account.deposit(dep);\n        account.withdraw(wit);\n        System.out.println(account.getBalance());\n    }\n}',
  E'フィールドを `private` にし、メソッド経由でのみ値を変更できるようにする設計を「カプセル化」と呼びます。',
  2,
  true
) ON CONFLICT (id) DO NOTHING;

-- 第4章：4-3
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES (
  '44444444-4444-4444-8444-444444444412',
  '33333333-3333-4333-8333-333333333304',
  '4-3. クラスの継承とメソッドのオーバーライド',
  E'### 問題概要\n基底クラス `Member` を継承して、`VipMember` クラスを作成してください。\n- `Member` クラスは `getDiscountedPrice(int price)` で **5%引き**（`price * 95 / 100`）を返します。\n- `VipMember` クラスは `Member` を `extends` し、`getDiscountedPrice(int price)` をオーバーライドして **20%引き**（`price * 80 / 100`）を返すようにしてください。\n\n### 入力例\n```\nvip 10000\n```\n\n### 出力例\n```\n8000\n```',
  'hard',
  20,
  ARRAY['オブジェクト指向', '継承', 'ポリモーフィズム'],
  E'import java.util.Scanner;\n\nclass Member {\n    public int getDiscountedPrice(int price) {\n        return price * 95 / 100;\n    }\n}\n\n// Member を継承する VipMember クラスを実装してください\nclass VipMember extends Member {\n    \n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String type = sc.next();\n        int price = sc.nextInt();\n\n        Member m;\n        if (type.equals("vip")) {\n            m = new VipMember();\n        } else {\n            m = new Member();\n        }\n        System.out.println(m.getDiscountedPrice(price));\n    }\n}',
  E'import java.util.Scanner;\n\nclass Member {\n    public int getDiscountedPrice(int price) {\n        return price * 95 / 100;\n    }\n}\n\nclass VipMember extends Member {\n    @Override\n    public int getDiscountedPrice(int price) {\n        return price * 80 / 100;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String type = sc.next();\n        int price = sc.nextInt();\n\n        Member m;\n        if (type.equals("vip")) {\n            m = new VipMember();\n        } else {\n            m = new Member();\n        }\n        System.out.println(m.getDiscountedPrice(price));\n    }\n}',
  E'親クラス型の変数 `Member m` に `new VipMember()` を代入しても、実行時には実体のクラス（`VipMember`）でオーバーライドされたメソッドが呼ばれます（ポリモーフィズム）。',
  3,
  true
) ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- テストケース（公開・非公開）
-- =============================================================================
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES
  -- 1-1
  ('44444444-4444-4444-8444-444444444401', '公開テスト1：基本出力チェック', '', E'Hello, Java!\nLet''s start programming!', false, 1),
  ('44444444-4444-4444-8444-444444444401', '非公開テスト1：厳密出力チェック', '', E'Hello, Java!\nLet''s start programming!', true, 2),
  -- 1-2
  ('44444444-4444-4444-8444-444444444402', '公開テスト1：3×5の長方形', '3 5', '15 16', false, 1),
  ('44444444-4444-4444-8444-444444444402', '公開テスト2：正方形 (4×4)', '4 4', '16 16', false, 2),
  ('44444444-4444-4444-8444-444444444402', '非公開テスト1：大きな値 (12×25)', '12 25', '300 74', true, 3),
  -- 1-3
  ('44444444-4444-4444-8444-444444444403', '公開テスト1：46979秒', '46979', '13:2:59', false, 1),
  ('44444444-4444-4444-8444-444444444403', '公開テスト2：3661秒', '3661', '1:1:1', false, 2),
  ('44444444-4444-4444-8444-444444444403', '非公開テスト1：0秒', '0', '0:0:0', true, 3),
  -- 2-1
  ('44444444-4444-4444-8444-444444444404', '公開テスト1：75点 (B)', '75', 'B', false, 1),
  ('44444444-4444-4444-8444-444444444404', '公開テスト2：80点境界 (A)', '80', 'A', false, 2),
  ('44444444-4444-4444-8444-444444444404', '非公開テスト1：40点境界 (C)', '40', 'C', true, 3),
  ('44444444-4444-4444-8444-444444444404', '非公開テスト2：39点 (D)', '39', 'D', true, 4),
  -- 2-2
  ('44444444-4444-4444-8444-444444444405', '公開テスト1：N=5', '5', E'1\n2\nFizz\n4\nBuzz', false, 1),
  ('44444444-4444-4444-8444-444444444405', '公開テスト2：N=15', '15', E'1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz', false, 2),
  ('44444444-4444-4444-8444-444444444405', '非公開テスト1：N=3', '3', E'1\n2\nFizz', true, 3),
  -- 2-3
  ('44444444-4444-4444-8444-444444444406', '公開テスト1：1234', '1234', '10', false, 1),
  ('44444444-4444-4444-8444-444444444406', '公開テスト2：999', '999', '27', false, 2),
  ('44444444-4444-4444-8444-444444444406', '非公開テスト1：10005', '10005', '6', true, 3),
  -- 3-1
  ('44444444-4444-4444-8444-444444444407', '公開テスト1：5個の正整数', E'5\n12 45 7 23 19', '45 106', false, 1),
  ('44444444-4444-4444-8444-444444444407', '公開テスト2：負の数を含む配列', E'4\n-10 -3 -25 -8', '-3 -46', false, 2),
  ('44444444-4444-4444-8444-444444444407', '非公開テスト1：1要素のみ', E'1\n100', '100 100', true, 3),
  -- 3-2
  ('44444444-4444-4444-8444-444444444408', '公開テスト1：17 (Prime)', '17', 'Prime', false, 1),
  ('44444444-4444-4444-8444-444444444408', '公開テスト2：15 (Not Prime)', '15', 'Not Prime', false, 2),
  ('44444444-4444-4444-8444-444444444408', '非公開テスト1：1 (Not Prime)', '1', 'Not Prime', true, 3),
  ('44444444-4444-4444-8444-444444444408', '非公開テスト2：2 (Prime)', '2', 'Prime', true, 4),
  -- 3-3
  ('44444444-4444-4444-8444-444444444409', '公開テスト1：5! = 120', '5', '120', false, 1),
  ('44444444-4444-4444-8444-444444444409', '公開テスト2：0! = 1', '0', '1', false, 2),
  ('44444444-4444-4444-8444-444444444409', '非公開テスト1：7! = 5040', '7', '5040', true, 3),
  -- 4-1
  ('44444444-4444-4444-8444-444444444410', '公開テスト1：Coffee 350 3', 'Coffee 350 3', 'Coffee: 1050円', false, 1),
  ('44444444-4444-4444-8444-444444444410', '公開テスト2：Notebook 240 5', 'Notebook 240 5', 'Notebook: 1200円', false, 2),
  ('44444444-4444-4444-8444-444444444410', '非公開テスト1：Keyboard 12800 2', 'Keyboard 12800 2', 'Keyboard: 25600円', true, 3),
  -- 4-2
  ('44444444-4444-4444-8444-444444444411', '公開テスト1：引き落とし成功', E'1000\n500\n1200', '300', false, 1),
  ('44444444-4444-4444-8444-444444444411', '公開テスト2：残高不足', E'1000\n200\n1500', E'Insufficient funds\n1200', false, 2),
  ('44444444-4444-4444-8444-444444444411', '非公開テスト1：残高ぴったり', E'500\n500\n1000', '0', true, 3),
  -- 4-3
  ('44444444-4444-4444-8444-444444444412', '公開テスト1：vip 10000 (20% OFF)', 'vip 10000', '8000', false, 1),
  ('44444444-4444-4444-8444-444444444412', '公開テスト2：regular 10000 (5% OFF)', 'regular 10000', '9500', false, 2),
  ('44444444-4444-4444-8444-444444444412', '非公開テスト1：vip 2500', 'vip 2500', '2000', true, 3);

-- =============================================================================
-- 段階的ヒント（各問題3ステップ）
-- =============================================================================
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES
  ('44444444-4444-4444-8444-444444444401', 1, '文字列を画面に出力するには `System.out.println("...");` を使います。'),
  ('44444444-4444-4444-8444-444444444401', 2, '1行目に `System.out.println("Hello, Java!");` を書き、次の行にもう1つ `System.out.println` を書きます。'),
  ('44444444-4444-4444-8444-444444444401', 3, '文の末尾のセミコロン `;` を忘れないように注意しましょう。'),

  ('44444444-4444-4444-8444-444444444402', 1, '面積は `int area = h * w;` で求められます。'),
  ('44444444-4444-4444-8444-444444444402', 2, '周囲の長さは `int perimeter = 2 * (h + w);` です。'),
  ('44444444-4444-4444-8444-444444444402', 3, '空白区切りで出力するには `System.out.println(area + " " + perimeter);` と記述します。'),

  ('44444444-4444-4444-8444-444444444403', 1, '1時間は 3600 秒なので、時間 `h` は `totalSeconds / 3600` で計算できます。'),
  ('44444444-4444-4444-8444-444444444403', 2, '3600で割った余り `totalSeconds % 3600` をさらに 60 で割ると分 `m` になります。'),
  ('44444444-4444-4444-8444-444444444403', 3, '秒 `s` は `totalSeconds % 60` です。これらを `":"` で連結して出力しましょう。'),

  ('44444444-4444-4444-8444-444444444404', 1, '`if (score >= 80)` から判定を始めます。'),
  ('44444444-4444-4444-8444-444444444404', 2, '続けて `else if (score >= 60)`、`else if (score >= 40)`、最後に `else` を使います。'),
  ('44444444-4444-4444-8444-444444444404', 3, '境界値（80ちょうど、60ちょうど）を含むため `>` ではなく `>=` を使いましょう。'),

  ('44444444-4444-4444-8444-444444444405', 1, '`for (int i = 1; i <= n; i++)` で1からnまで繰り返します。'),
  ('44444444-4444-4444-8444-444444444405', 2, '倍数判定には余りを求める `%` 演算子を使います（例：3の倍数なら `i % 3 == 0`）。'),
  ('44444444-4444-4444-8444-444444444405', 3, '3と5の両方の倍数（`i % 15 == 0`）を一番最初の `if` に書きましょう。'),

  ('44444444-4444-4444-8444-444444444406', 1, '一の位の数字は `n % 10` で取り出すことができます。'),
  ('44444444-4444-4444-8444-444444444406', 2, '一の位を取り除いて桁を1つ減らすには `n /= 10;` とします。'),
  ('44444444-4444-4444-8444-444444444406', 3, '`while (n > 0)` のループ内で `sum += n % 10;` と `n /= 10;` を繰り返しましょう。'),

  ('44444444-4444-4444-8444-444444444407', 1, '最大値を保持する変数 `int max = nums[0];` と、合計用の `int sum = 0;` を用意します。'),
  ('44444444-4444-4444-8444-444444444407', 2, 'ループで各要素を見て、`if (nums[i] > max) { max = nums[i]; }` で最大値を更新します。'),
  ('44444444-4444-4444-8444-444444444407', 3, '最後に `System.out.println(max + " " + sum);` で出力します。'),

  ('44444444-4444-4444-8444-444444444408', 1, 'まず `if (x < 2) return false;` で 1 以下の数を除外します。'),
  ('44444444-4444-4444-8444-444444444408', 2, '`for (int i = 2; i * i <= x; i++)` で割り切れる数がないか調べます。'),
  ('44444444-4444-4444-8444-444444444408', 3, 'ループの中で `if (x % i == 0) return false;` とし、ループを抜けたら `return true;` を返します。'),

  ('44444444-4444-4444-8444-444444444409', 1, '再帰の終了条件として、`if (n <= 1) return 1;` を最初に書きます。'),
  ('44444444-4444-4444-8444-444444444409', 2, 'n! = n * (n - 1)! なので、自分自身を `factorial(n - 1)` として呼び出せます。'),
  ('44444444-4444-4444-8444-444444444409', 3, '`return n * factorial(n - 1);` を返せば完成です。'),

  ('44444444-4444-4444-8444-444444444410', 1, 'コンストラクタはクラス名と同じ名前 `public Product(String name, int price)` で定義します。'),
  ('44444444-4444-4444-8444-444444444410', 2, 'コンストラクタの中で `this.name = name; this.price = price;` を代入します。'),
  ('44444444-4444-4444-8444-444444444410', 3, '`public int getTotalPrice(int quantity) { return this.price * quantity; }` を追加します。'),

  ('44444444-4444-4444-8444-444444444411', 1, '`public void deposit(int amount) { this.balance += amount; }` で預け入れを実装します。'),
  ('44444444-4444-4444-8444-444444444411', 2, '`withdraw` では `if (this.balance >= amount)` のときだけ `this.balance -= amount;` を実行します。'),
  ('44444444-4444-4444-8444-444444444411', 3, '残高が足りない場合の `else` ブロックで `System.out.println("Insufficient funds");` を出力します。'),

  ('44444444-4444-4444-8444-444444444412', 1, '`VipMember` クラスの中に `public int getDiscountedPrice(int price)` メソッドを定義します。'),
  ('44444444-4444-4444-8444-444444444412', 2, '20%引きは元の価格の80%なので `return price * 80 / 100;` と計算できます。'),
  ('44444444-4444-4444-8444-444444444412', 3, '`@Override` アノテーションを付けておくと、メソッド名のタイポを防げます。')
ON CONFLICT (problem_id, step_number) DO NOTHING;

-- 初期お知らせ
INSERT INTO public.announcements (id, title, content_md, company_id)
VALUES
  (
    '55555555-5555-4555-8555-555555555501',
    'Java入門コース開講のお知らせ',
    '「第1章：出力と変数」から順番に演習問題へ挑戦しましょう。各問題には3段階のヒントが用意されています。',
    NULL
  )
ON CONFLICT (id) DO NOTHING;
