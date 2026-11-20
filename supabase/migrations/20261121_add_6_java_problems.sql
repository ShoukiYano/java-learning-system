-- =============================================================================
-- Java 4段階コース（初級・中級・上級）＋追加全22問（入門+4・初級6・中級6・上級6）
-- 自己完結・冪等マイグレーション（courses -> chapters -> lessons -> problems）
-- =============================================================================

-- 1. Java初級・中級・上級コースを登録（既存コースがあれば更新）
INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('0b083361-6d07-47a9-a787-508913d9efa8', 'Java初級コース：二次元配列・メソッド設計・オブジェクト指向応用', '店舗売上の二次元配列集計、オーバーロード設計、staticによる自動採番、決済インターフェースとポリモーフィズムなど実務基礎へ直結するオブジェクト指向応用を習得します。', 2, true, '11111111-1111-4111-8111-111111111101')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id,
  is_published = true;

INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('c4bd0c61-1a12-4d2a-af9d-ac2eb8a12165', 'Java中級コース：コレクション・標準API・CSV処理・例外ハンドリング', '実務で毎日使う ArrayList / HashMap による顧客検索・売上集計、CSVデータのパース処理、try-catch / throw を使った安全な在庫引当・例外制御を習得します。', 3, true, '0b083361-6d07-47a9-a787-508913d9efa8')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id,
  is_published = true;

INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('bb827c60-3d1d-40db-ac42-5da47866d141', 'Java上級コース：DAO設計・APIバリデーション・顧客案件管理実践', 'DAOリポジトリ設計、REST API入力バリデーション＆ステータス判定、顧客・案件管理システムのService層集計、境界値単体テスト検証など案件参画レベルの実践力を養います。', 4, true, 'c4bd0c61-1a12-4d2a-af9d-ac2eb8a12165')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id,
  is_published = true;

-- SQLコースの前提条件をJava中級クリアに設定
UPDATE public.courses SET prerequisite_course_id = 'c4bd0c61-1a12-4d2a-af9d-ac2eb8a12165' WHERE id = '11111111-1111-4111-8111-111111111102';

-- 2. 初級・中級・上級の章（6章）を登録
INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('bf20e7ec-5d77-4543-bb06-f1a260271b59', '0b083361-6d07-47a9-a787-508913d9efa8', '初級第1章：二次元配列とメソッド設計', '表形式データを扱う二次元配列の集計と、メソッドのオーバーロードによる実務的なAPI設計を学びます。', 1, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = true;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('f62233bb-0095-4a76-80d3-6a70846ee360', '0b083361-6d07-47a9-a787-508913d9efa8', '初級第2章：static・インターフェース・ポリモーフィズム', 'staticメンバーによる共通管理と、interfaceを活用したポリモーフィズム設計（第1回実技試験レベル）を習得します。', 2, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = true;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('f0721c45-037c-49d0-8393-98bb86ce3523', 'c4bd0c61-1a12-4d2a-af9d-ac2eb8a12165', '中級第1章：コレクション（ArrayList / HashMap）実務活用', '実務で最頻出の ArrayList と HashMap を使い、顧客検索やカテゴリ別売上集計を実装します。', 1, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = true;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('7bb76c60-bac2-408b-a0f5-cb69f0546f13', 'c4bd0c61-1a12-4d2a-af9d-ac2eb8a12165', '中級第2章：文字列API・CSV処理・例外ハンドリング', 'StringメソッドによるCSVパースと、try-catch-finally / throw を使った安全な例外処理を実装します。', 2, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = true;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('b5486a57-160b-4bb3-9d1b-f5e9f7cc6590', 'bb827c60-3d1d-40db-ac42-5da47866d141', '上級第1章：DAOパターンとAPIバリデーション設計', 'DBアクセスを分離するDAOリポジトリ設計と、Spring Boot APIを想定した入力バリデーション・エラー応答を実装します。', 1, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = true;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('446172d3-98c4-4c34-8277-7973f5953a36', 'bb827c60-3d1d-40db-ac42-5da47866d141', '上級第2章：顧客・案件管理ロジック＆単体テスト設計', '最終模擬プロジェクトのコア業務ロジック実装と、正常系・異常系・境界値を網羅したテスト検証を行います。', 2, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = true;

-- 3. 初級・中級・上級の単元（6単元）を登録
INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('5347964f-04df-4e46-ae8a-a654826f9d73', 'bf20e7ec-5d77-4543-bb06-f1a260271b59', '1-1. 二次元配列・オーバーロード実践', '表形式データを扱う二次元配列の集計と、メソッドのオーバーロードによる実務的なAPI設計を学びます。', 1, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content_md = EXCLUDED.content_md,
  is_published = true;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('41302b0f-c345-4660-9dfe-6cf806c97783', 'f62233bb-0095-4a76-80d3-6a70846ee360', '2-1. オブジェクト指向応用と実技課題', 'staticメンバーによる共通管理と、interfaceを活用したポリモーフィズム設計（第1回実技試験レベル）を習得します。', 1, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content_md = EXCLUDED.content_md,
  is_published = true;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('1177c80b-bcc9-4745-a4f8-7caf1ef01327', 'f0721c45-037c-49d0-8393-98bb86ce3523', '1-1. List・Mapによる業務データ管理', '実務で最頻出の ArrayList と HashMap を使い、顧客検索やカテゴリ別売上集計を実装します。', 1, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content_md = EXCLUDED.content_md,
  is_published = true;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('06f2d4e3-729c-4392-8945-9af33d7833e5', '7bb76c60-bac2-408b-a0f5-cb69f0546f13', '2-1. CSVデータ処理と例外制御', 'StringメソッドによるCSVパースと、try-catch-finally / throw を使った安全な例外処理を実装します。', 1, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content_md = EXCLUDED.content_md,
  is_published = true;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('d62467af-4c0c-45b3-be32-3224f0765b0d', 'b5486a57-160b-4bb3-9d1b-f5e9f7cc6590', '1-1. DAO設計とバリデーション', 'DBアクセスを分離するDAOリポジトリ設計と、Spring Boot APIを想定した入力バリデーション・エラー応答を実装します。', 1, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content_md = EXCLUDED.content_md,
  is_published = true;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('3f313153-e5f5-466a-b5f2-51a43cefbf1d', '446172d3-98c4-4c34-8277-7973f5953a36', '2-1. 実務模擬プロジェクトと単体テスト', '最終模擬プロジェクトのコア業務ロジック実装と、正常系・異常系・境界値を網羅したテスト検証を行います。', 1, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content_md = EXCLUDED.content_md,
  is_published = true;

-- 4. 全追加Java問題（入門+4問・初級6問・中級6問・上級6問＝計22問）＋テストケース＋ヒント
-- 1-4. 変数とデータ型による社員プロフィール出力
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('63c36437-c01c-4fa4-9da1-ca7f5350b486', '33333333-3333-4333-8333-333333333301', '1-4. 変数とデータ型による社員プロフィール出力', '### 問題概要
社員情報（氏名・年齢・勤続年数・在籍フラグ）をそれぞれ適切な型の変数に格納し、指定フォーマットで出力するプログラムを作成してください。

### 入力仕様
標準入力から以下の4行が与えられます。
1. 氏名（文字列）
2. 年齢（整数）
3. 評価スコア（小数）
4. 在籍中フラグ（`true` または `false`）

### 出力仕様
```
Name: <氏名>
Age: <年齢>
Score: <評価スコア>
Active: <在籍中フラグ>
```', 'easy', 8, ARRAY['出力と変数', 'データ型']::text[], 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        int age = Integer.parseInt(sc.nextLine());
        double score = Double.parseDouble(sc.nextLine());
        boolean active = Boolean.parseBoolean(sc.nextLine());

        // ここに出力処理を記述してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        int age = Integer.parseInt(sc.nextLine());
        double score = Double.parseDouble(sc.nextLine());
        boolean active = Boolean.parseBoolean(sc.nextLine());

        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Score: " + score);
        System.out.println("Active: " + active);
    }
}', 'Javaの基本データ型（`int`, `double`, `boolean`）と参照型（`String`）を文字列結合演算子 `+` で連結して出力します。', 4, true)
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

DELETE FROM public.test_cases WHERE problem_id = '63c36437-c01c-4fa4-9da1-ca7f5350b486';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('63c36437-c01c-4fa4-9da1-ca7f5350b486', '公開テスト1：標準社員データ', 'Tanaka
25
4.5
true
', 'Name: Tanaka
Age: 25
Score: 4.5
Active: true', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('63c36437-c01c-4fa4-9da1-ca7f5350b486', '非公開テスト1：別社員データ', 'Sato
31
3.8
false
', 'Name: Sato
Age: 31
Score: 3.8
Active: false', true, 2);

DELETE FROM public.hints WHERE problem_id = '63c36437-c01c-4fa4-9da1-ca7f5350b486';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('63c36437-c01c-4fa4-9da1-ca7f5350b486', 1, '文字列と変数を `+` でつないで `System.out.println` に渡します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('63c36437-c01c-4fa4-9da1-ca7f5350b486', 2, 'コロン `:` の後ろに半角スペースが1つ入っている点に注意してください。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('63c36437-c01c-4fa4-9da1-ca7f5350b486', 3, '`System.out.println("Name: " + name);` の形式で4行出力します。');

-- 1-5. 消費税（10%）込みの商品合計金額計算
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('09f376c6-3943-4a98-b718-5f9f3ff9b064', '33333333-3333-4333-8333-333333333301', '1-5. 消費税（10%）込みの商品合計金額計算', '### 問題概要
商品の単価（円）と購入個数を受け取り、税抜合計金額と **消費税10%込みの税込金額（小数点以下切り捨て）** を出力してください。

### 入力仕様
標準入力から2つの整数がスペース区切りで与えられます。
`<単価> <個数>`

### 出力仕様
```
Subtotal: <税抜合計>
Total: <税込合計>
```', 'easy', 10, ARRAY['出力と変数', '四則演算']::text[], 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int price = sc.nextInt();
        int qty = sc.nextInt();

        // 税抜合計と税込合計（10%、切り捨て）を計算して出力してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int price = sc.nextInt();
        int qty = sc.nextInt();
        int subtotal = price * qty;
        int total = (subtotal * 110) / 100;
        System.out.println("Subtotal: " + subtotal);
        System.out.println("Total: " + total);
    }
}', '浮動小数点（`double`）の誤差を避けるため、実務の金額計算では `(subtotal * 110) / 100` のように整数演算で切り捨て計算を行うのが安全です。', 5, true)
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

DELETE FROM public.test_cases WHERE problem_id = '09f376c6-3943-4a98-b718-5f9f3ff9b064';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('09f376c6-3943-4a98-b718-5f9f3ff9b064', '公開テスト1：1000円×3個', '1000 3
', 'Subtotal: 3000
Total: 3300', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('09f376c6-3943-4a98-b718-5f9f3ff9b064', '非公開テスト1：端数切り捨て検証', '125 3
', 'Subtotal: 375
Total: 412', true, 2);

DELETE FROM public.hints WHERE problem_id = '09f376c6-3943-4a98-b718-5f9f3ff9b064';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('09f376c6-3943-4a98-b718-5f9f3ff9b064', 1, '税抜合計は `price * qty` で求められます。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('09f376c6-3943-4a98-b718-5f9f3ff9b064', 2, '税込10%（切り捨て）は `(subtotal * 110) / 100` で正確に計算できます。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('09f376c6-3943-4a98-b718-5f9f3ff9b064', 3, '`Subtotal: ` と `Total: ` をそれぞれ出力してください。');

-- 2-4. 会員ランクと割引適用の複合条件判定（AND / OR）
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('acbaf347-38d2-426c-8128-6ba18db82f02', '33333333-3333-4333-8333-333333333302', '2-4. 会員ランクと割引適用の複合条件判定（AND / OR）', '### 問題概要
ECサイトの送料無料・割引判定を実装してください。
購入金額（円）とプレミアム会員フラグ（1＝プレミアム会員、0＝通常会員）が与えられます。

### 判定ルール
- プレミアム会員 **または** 購入金額が `5000` 円以上の場合：`FREE_SHIPPING`
- それ以外の場合：`STANDARD_SHIPPING`', 'easy', 10, ARRAY['条件分岐', '論理演算']::text[], 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int amount = sc.nextInt();
        int isPremium = sc.nextInt();

        // 複合条件で判定して出力してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int amount = sc.nextInt();
        int isPremium = sc.nextInt();
        if (isPremium == 1 || amount >= 5000) {
            System.out.println("FREE_SHIPPING");
        } else {
            System.out.println("STANDARD_SHIPPING");
        }
    }
}', '「A または B」は論理和演算子 `||` を使います。業務システムでは境界値（ちょうど5000円）を `>=` で含めるかどうかが重要です。', 4, true)
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

DELETE FROM public.test_cases WHERE problem_id = 'acbaf347-38d2-426c-8128-6ba18db82f02';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('acbaf347-38d2-426c-8128-6ba18db82f02', '公開テスト1：通常会員・5000円以上', '5000 0
', 'FREE_SHIPPING', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('acbaf347-38d2-426c-8128-6ba18db82f02', '公開テスト2：プレミアム会員・2000円', '2000 1
', 'FREE_SHIPPING', false, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('acbaf347-38d2-426c-8128-6ba18db82f02', '非公開テスト1：通常会員・4999円', '4999 0
', 'STANDARD_SHIPPING', true, 3);

DELETE FROM public.hints WHERE problem_id = 'acbaf347-38d2-426c-8128-6ba18db82f02';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('acbaf347-38d2-426c-8128-6ba18db82f02', 1, '「または」は `||` 演算子で記述します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('acbaf347-38d2-426c-8128-6ba18db82f02', 2, '条件式は `isPremium == 1 || amount >= 5000` となります。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('acbaf347-38d2-426c-8128-6ba18db82f02', 3, '条件を満たせば `FREE_SHIPPING`、そうでなければ `STANDARD_SHIPPING` を出力します。');

-- 2-5. HTTPステータスコードの種別判定（switch文）
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('ae05977e-4f08-4d96-b996-fe5d805662c6', '33333333-3333-4333-8333-333333333302', '2-5. HTTPステータスコードの種別判定（switch文）', '### 問題概要
HTTPステータスコード（整数）を受け取り、`switch` 文を使って対応するメッセージを出力してください。

### 対応表
- `200` → `OK`
- `201` → `CREATED`
- `400` → `BAD_REQUEST`
- `404` → `NOT_FOUND`
- `500` → `INTERNAL_SERVER_ERROR`
- それ以外 → `UNKNOWN`', 'easy', 10, ARRAY['条件分岐', 'switch文']::text[], 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int code = sc.nextInt();

        // switch文でステータス名を表示してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int code = sc.nextInt();
        switch (code) {
            case 200:
                System.out.println("OK");
                break;
            case 201:
                System.out.println("CREATED");
                break;
            case 400:
                System.out.println("BAD_REQUEST");
                break;
            case 404:
                System.out.println("NOT_FOUND");
                break;
            case 500:
                System.out.println("INTERNAL_SERVER_ERROR");
                break;
            default:
                System.out.println("UNKNOWN");
                break;
        }
    }
}', '特定の固定値による多岐分岐では `switch` 文を使うと可読性が高まります。各 `case` の末尾に `break;` を忘れると次の処理へ突き抜ける（フォールスルー）ので注意しましょう。', 5, true)
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

DELETE FROM public.test_cases WHERE problem_id = 'ae05977e-4f08-4d96-b996-fe5d805662c6';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('ae05977e-4f08-4d96-b996-fe5d805662c6', '公開テスト1：200 OK', '200
', 'OK', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('ae05977e-4f08-4d96-b996-fe5d805662c6', '公開テスト2：404 Not Found', '404
', 'NOT_FOUND', false, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('ae05977e-4f08-4d96-b996-fe5d805662c6', '非公開テスト1：未定義コード', '418
', 'UNKNOWN', true, 3);

DELETE FROM public.hints WHERE problem_id = 'ae05977e-4f08-4d96-b996-fe5d805662c6';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('ae05977e-4f08-4d96-b996-fe5d805662c6', 1, '`switch (code) { case 200: ... break; default: ... }` の構文を使います。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('ae05977e-4f08-4d96-b996-fe5d805662c6', 2, 'どの `case` にも一致しない場合は `default:` で `UNKNOWN` を出力します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('ae05977e-4f08-4d96-b996-fe5d805662c6', 3, 'すべての `case` に `break;` が入っているか確認してください。');

-- 初級 1-1. 店舗別・日別売上の二次元配列集計
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('cdb7743b-7403-4297-9c4c-dc6156f4eb0b', '5347964f-04df-4e46-ae8a-a654826f9d73', '初級 1-1. 店舗別・日別売上の二次元配列集計', '### 問題概要
`R` 店舗 × `C` 日間の売上データを二次元配列に読み込み、各店舗の合計売上と全店舗の総合計売上を出力してください。

### 入力仕様
- 1行目：店舗数 `R` と日数 `C`
- 続く `R` 行：各店舗の `C` 日分の売上（整数）

### 出力仕様
- 各店舗ごとに `Store <番号>: <店舗合計>`（番号は1始まり）
- 最後に `GrandTotal: <総合計>`', 'medium', 15, ARRAY['配列', '二次元配列']::text[], 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        int[][] sales = new int[r][c];
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) {
                sales[i][j] = sc.nextInt();
            }
        }
        // 各店舗の合計と総合計を出力してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        int[][] sales = new int[r][c];
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) {
                sales[i][j] = sc.nextInt();
            }
        }
        int grandTotal = 0;
        for (int i = 0; i < r; i++) {
            int rowSum = 0;
            for (int j = 0; j < c; j++) {
                rowSum += sales[i][j];
            }
            grandTotal += rowSum;
            System.out.println("Store " + (i + 1) + ": " + rowSum);
        }
        System.out.println("GrandTotal: " + grandTotal);
    }
}', '外側のループで行（店舗）を回し、内側のループで列（日数）を加算することで、表形式データの行合計と総計を効率よく求められます。', 1, true)
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

DELETE FROM public.test_cases WHERE problem_id = 'cdb7743b-7403-4297-9c4c-dc6156f4eb0b';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('cdb7743b-7403-4297-9c4c-dc6156f4eb0b', '公開テスト1：2店舗×3日間', '2 3
100 200 300
150 250 100
', 'Store 1: 600
Store 2: 500
GrandTotal: 1100', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('cdb7743b-7403-4297-9c4c-dc6156f4eb0b', '非公開テスト1：3店舗×2日間', '3 2
50 50
100 200
300 400
', 'Store 1: 100
Store 2: 300
Store 3: 700
GrandTotal: 1100', true, 2);

DELETE FROM public.hints WHERE problem_id = 'cdb7743b-7403-4297-9c4c-dc6156f4eb0b';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('cdb7743b-7403-4297-9c4c-dc6156f4eb0b', 1, '店舗ごとの合計変数 `rowSum` は外側ループの中で毎回 `0` にリセットします。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('cdb7743b-7403-4297-9c4c-dc6156f4eb0b', 2, '店舗番号は `i + 1` と括弧で囲んで文字列結合します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('cdb7743b-7403-4297-9c4c-dc6156f4eb0b', 3, '各行の `rowSum` を `grandTotal` に加算し、ループ後に `GrandTotal: ` を出力します。');

-- 初級 1-2. 割引計算メソッドのオーバーロード設計
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('a5a673fd-798d-4064-a5a0-e9ab3d50bf30', '5347964f-04df-4e46-ae8a-a654826f9d73', '初級 1-2. 割引計算メソッドのオーバーロード設計', '### 問題概要
同じメソッド名 `calcPrice` を引数の個数違いで2つ定義（オーバーロード）してください。
1. `calcPrice(int price)`：標準税率10%込みの価格（`(price * 110) / 100`）を返す
2. `calcPrice(int price, int discount)`：`price - discount` に対して税率10%込みの価格を返す（割引後が0未満の場合は0とする）

### 入力仕様
標準入力から `price` と `discount` の2整数が与えられます。

### 出力仕様
1行目に `calcPrice(price)`、2行目に `calcPrice(price, discount)` の結果を出力してください。', 'medium', 12, ARRAY['メソッド', 'オーバーロード']::text[], 'import java.util.Scanner;

public class Main {
    // ここに calcPrice メソッドを2つオーバーロード定義してください

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int price = sc.nextInt();
        int discount = sc.nextInt();
        System.out.println(calcPrice(price));
        System.out.println(calcPrice(price, discount));
    }
}', 'import java.util.Scanner;

public class Main {
    public static int calcPrice(int price) {
        return (price * 110) / 100;
    }

    public static int calcPrice(int price, int discount) {
        int base = price - discount;
        if (base < 0) {
            base = 0;
        }
        return calcPrice(base);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int price = sc.nextInt();
        int discount = sc.nextInt();
        System.out.println(calcPrice(price));
        System.out.println(calcPrice(price, discount));
    }
}', 'オーバーロードを使うことで、呼び出し側は割引の有無を意識せず同じ `calcPrice` 名で直感的に呼び出せます。2引数版から1引数版を呼び出すと計算ロジックの重複も防げます。', 2, true)
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

DELETE FROM public.test_cases WHERE problem_id = 'a5a673fd-798d-4064-a5a0-e9ab3d50bf30';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('a5a673fd-798d-4064-a5a0-e9ab3d50bf30', '公開テスト1：2000円・500円引き', '2000 500
', '2200
1650', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('a5a673fd-798d-4064-a5a0-e9ab3d50bf30', '非公開テスト1：割引額が元値以上', '1000 1500
', '1100
0', true, 2);

DELETE FROM public.hints WHERE problem_id = 'a5a673fd-798d-4064-a5a0-e9ab3d50bf30';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('a5a673fd-798d-4064-a5a0-e9ab3d50bf30', 1, '`public static int calcPrice(int price)` と `public static int calcPrice(int price, int discount)` の2つを定義します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('a5a673fd-798d-4064-a5a0-e9ab3d50bf30', 2, '2引数版では `price - discount` が負になったときに `0` に丸めます。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('a5a673fd-798d-4064-a5a0-e9ab3d50bf30', 3, '最後に `calcPrice(base)` を呼び出すとコードがスッキリします。');

-- 初級 2-1. static フィールドによる自動採番チケット管理クラス
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('73821690-4523-4036-a21e-cc4b4071f26c', '41302b0f-c345-4660-9dfe-6cf806c97783', '初級 2-1. static フィールドによる自動採番チケット管理クラス', '### 問題概要
インスタンスを生成するたびに `1` から連番のチケットIDを自動採番する `Ticket` クラスを実装してください。

### 仕様
- `private static int nextId = 1;` を持つ
- コンストラクタ `Ticket(String title)` で現在の `nextId` を自分の `id` に割り当て、`nextId` を1増やす
- `getLabel()` メソッドは `"#<id> <title>"` を返す
- 最後に生成された総チケット数を `Ticket.getIssuedCount()`（staticメソッド）で返す

### 入力仕様
- 1行目：件数 `N`
- 続く `N` 行：チケットタイトル', 'medium', 15, ARRAY['クラスとオブジェクト', 'static']::text[], 'import java.util.Scanner;

class Ticket {
    // static フィールド、コンストラクタ、メソッドを実装してください
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine());
        for (int i = 0; i < n; i++) {
            Ticket t = new Ticket(sc.nextLine());
            System.out.println(t.getLabel());
        }
        System.out.println("Total: " + Ticket.getIssuedCount());
    }
}', 'import java.util.Scanner;

class Ticket {
    private static int nextId = 1;
    private int id;
    private String title;

    public Ticket(String title) {
        this.id = nextId;
        nextId++;
        this.title = title;
    }

    public String getLabel() {
        return "#" + this.id + " " + this.title;
    }

    public static int getIssuedCount() {
        return nextId - 1;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine());
        for (int i = 0; i < n; i++) {
            Ticket t = new Ticket(sc.nextLine());
            System.out.println(t.getLabel());
        }
        System.out.println("Total: " + Ticket.getIssuedCount());
    }
}', '`static` フィールドはクラス全体で1つだけ共有されるため、複数インスタンスにまたがる連番管理や件数カウントに利用されます。', 1, true)
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

DELETE FROM public.test_cases WHERE problem_id = '73821690-4523-4036-a21e-cc4b4071f26c';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('73821690-4523-4036-a21e-cc4b4071f26c', '公開テスト1：3件のチケット発番', '3
Login Bug
Add API
Fix SQL
', '#1 Login Bug
#2 Add API
#3 Fix SQL
Total: 3', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('73821690-4523-4036-a21e-cc4b4071f26c', '非公開テスト1：1件のみ', '1
Deploy
', '#1 Deploy
Total: 1', true, 2);

DELETE FROM public.hints WHERE problem_id = '73821690-4523-4036-a21e-cc4b4071f26c';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('73821690-4523-4036-a21e-cc4b4071f26c', 1, '`private static int nextId = 1;` とインスタンス変数 `id`, `title` を宣言します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('73821690-4523-4036-a21e-cc4b4071f26c', 2, 'コンストラクタ内で `this.id = nextId; nextId++;` を行います。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('73821690-4523-4036-a21e-cc4b4071f26c', 3, '発行済み件数は `nextId - 1` で求められます。');

-- 初級 2-2. 決済インターフェースとポリモーフィズム（第1回実技レベル）
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('832360ab-0091-4ec0-b81b-a88d1b969106', '41302b0f-c345-4660-9dfe-6cf806c97783', '初級 2-2. 決済インターフェースとポリモーフィズム（第1回実技レベル）', '### 問題概要
複数の決済手段を統一的に扱う `Payment` インターフェースと2つの実装クラスを作成してください。

### 仕様
- インターフェース `Payment`：`int calcFee(int amount);` を定義
- `CreditCardPayment` クラス（`implements Payment`）：決済手数料は金額の **3%**（`(amount * 3) / 100`）
- `BankTransferPayment` クラス（`implements Payment`）：決済手数料は一律 **220円**（ただし金額が0以下の場合は0円）

### 入力仕様
- 1行目：決済方式（`CARD` または `BANK`）
- 2行目：決済金額（整数）

### 出力仕様
`Fee: <手数料>` を出力してください。', 'hard', 15, ARRAY['クラスとオブジェクト', 'ポリモーフィズム']::text[], 'import java.util.Scanner;

interface Payment {
    int calcFee(int amount);
}

// CreditCardPayment と BankTransferPayment を実装してください

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        int amount = sc.nextInt();

        Payment payment;
        if (type.equals("CARD")) {
            payment = new CreditCardPayment();
        } else {
            payment = new BankTransferPayment();
        }
        System.out.println("Fee: " + payment.calcFee(amount));
    }
}', 'import java.util.Scanner;

interface Payment {
    int calcFee(int amount);
}

class CreditCardPayment implements Payment {
    public int calcFee(int amount) {
        return (amount * 3) / 100;
    }
}

class BankTransferPayment implements Payment {
    public int calcFee(int amount) {
        if (amount <= 0) {
            return 0;
        }
        return 220;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        int amount = sc.nextInt();

        Payment payment;
        if (type.equals("CARD")) {
            payment = new CreditCardPayment();
        } else {
            payment = new BankTransferPayment();
        }
        System.out.println("Fee: " + payment.calcFee(amount));
    }
}', '呼び出し側は `Payment` インターフェース型で受け取るため、新しい決済手段が増えても `payment.calcFee(amount)` の呼び出しコードを変更せずに拡張できます。これがSpring BootのDI設計の基礎になります。', 2, true)
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

DELETE FROM public.test_cases WHERE problem_id = '832360ab-0091-4ec0-b81b-a88d1b969106';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('832360ab-0091-4ec0-b81b-a88d1b969106', '公開テスト1：クレジットカード 10000円', 'CARD 10000
', 'Fee: 300', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('832360ab-0091-4ec0-b81b-a88d1b969106', '公開テスト2：銀行振込 5000円', 'BANK 5000
', 'Fee: 220', false, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('832360ab-0091-4ec0-b81b-a88d1b969106', '非公開テスト1：銀行振込 0円', 'BANK 0
', 'Fee: 0', true, 3);

DELETE FROM public.hints WHERE problem_id = '832360ab-0091-4ec0-b81b-a88d1b969106';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('832360ab-0091-4ec0-b81b-a88d1b969106', 1, '`class CreditCardPayment implements Payment` のようにインターフェースを実装します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('832360ab-0091-4ec0-b81b-a88d1b969106', 2, 'カード手数料は `(amount * 3) / 100` です。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('832360ab-0091-4ec0-b81b-a88d1b969106', 3, '銀行振込は `amount <= 0` なら `0`、それ以外は `220` を返します。');

-- 中級 1-1. ArrayList による顧客名の検索フィルタリング
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('04fc00cc-c83f-4857-ac2f-ea8f79d703e7', '1177c80b-bcc9-4745-a4f8-7caf1ef01327', '中級 1-1. ArrayList による顧客名の検索フィルタリング', '### 問題概要
`ArrayList<String>` に登録された顧客名一覧から、指定キーワードを含む顧客名だけを順番に出力してください。1件も一致しない場合は `NOT_FOUND` を出力します。

### 入力仕様
- 1行目：顧客数 `N`
- 続く `N` 行：顧客名
- 最終行：検索キーワード', 'medium', 15, ARRAY['コレクション', 'ArrayList']::text[], 'import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine());
        ArrayList<String> customers = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            customers.add(sc.nextLine());
        }
        String keyword = sc.nextLine();

        // keyword を含む顧客名を出力してください（0件なら NOT_FOUND）
    }
}', 'import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine());
        ArrayList<String> customers = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            customers.add(sc.nextLine());
        }
        String keyword = sc.nextLine();
        int count = 0;
        for (int i = 0; i < customers.size(); i++) {
            String name = customers.get(i);
            if (name.contains(keyword)) {
                System.out.println(name);
                count++;
            }
        }
        if (count == 0) {
            System.out.println("NOT_FOUND");
        }
    }
}', '`ArrayList` の要素数は `size()`、要素取得は `get(i)` を使います。部分一致検索には `String#contains(keyword)` が便利です。', 1, true)
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

DELETE FROM public.test_cases WHERE problem_id = '04fc00cc-c83f-4857-ac2f-ea8f79d703e7';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('04fc00cc-c83f-4857-ac2f-ea8f79d703e7', '公開テスト1：Techを含む企業を検索', '3
ACME Tech
Global Corp
Next Tech
Tech
', 'ACME Tech
Next Tech', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('04fc00cc-c83f-4857-ac2f-ea8f79d703e7', '非公開テスト1：該当なし', '2
Alpha
Beta
Gamma
', 'NOT_FOUND', true, 2);

DELETE FROM public.hints WHERE problem_id = '04fc00cc-c83f-4857-ac2f-ea8f79d703e7';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('04fc00cc-c83f-4857-ac2f-ea8f79d703e7', 1, '`customers.size()` 回ループして `customers.get(i)` を取り出します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('04fc00cc-c83f-4857-ac2f-ea8f79d703e7', 2, '`name.contains(keyword)` が true なら出力し、ヒット件数をカウントします。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('04fc00cc-c83f-4857-ac2f-ea8f79d703e7', 3, 'ループ終了後にヒット件数が 0 なら `NOT_FOUND` を出力します。');

-- 中級 1-2. HashMap による商品カテゴリ別売上集計
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('a68d7e1a-c9bc-4b04-91cb-20eeffe72c3e', '1177c80b-bcc9-4745-a4f8-7caf1ef01327', '中級 1-2. HashMap による商品カテゴリ別売上集計', '### 問題概要
`N` 件の売上レコード（カテゴリ名と金額）を `HashMap<String, Integer>` で集計し、最後に指定された対象カテゴリの合計金額を出力してください（存在しないカテゴリは `0`）。

### 入力仕様
- 1行目：レコード数 `N`
- 続く `N` 行：`<カテゴリ名> <金額>`
- 最終行：集計を確認したい対象カテゴリ名', 'medium', 15, ARRAY['コレクション', 'HashMap']::text[], 'import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        HashMap<String, Integer> map = new HashMap<>();
        // ここに集計処理を記述してください
    }
}', 'import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        HashMap<String, Integer> map = new HashMap<>();
        for (int i = 0; i < n; i++) {
            String cat = sc.next();
            int amount = sc.nextInt();
            int current = map.containsKey(cat) ? map.get(cat) : 0;
            map.put(cat, current + amount);
        }
        String target = sc.next();
        int ans = map.containsKey(target) ? map.get(target) : 0;
        System.out.println(ans);
    }
}', '`HashMap` で集計するときは `containsKey` で既存値を確認してから加算して `put` するのが定番のイディオムです。', 2, true)
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

DELETE FROM public.test_cases WHERE problem_id = 'a68d7e1a-c9bc-4b04-91cb-20eeffe72c3e';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('a68d7e1a-c9bc-4b04-91cb-20eeffe72c3e', '公開テスト1：Foodの合計集計', '4
Food 500
Book 1200
Food 800
Drink 300
Food
', '1300', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('a68d7e1a-c9bc-4b04-91cb-20eeffe72c3e', '非公開テスト1：未登録カテゴリ', '2
Food 500
Book 1000
Electronics
', '0', true, 2);

DELETE FROM public.hints WHERE problem_id = 'a68d7e1a-c9bc-4b04-91cb-20eeffe72c3e';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('a68d7e1a-c9bc-4b04-91cb-20eeffe72c3e', 1, '`map.containsKey(cat)` でキーの存在を確認します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('a68d7e1a-c9bc-4b04-91cb-20eeffe72c3e', 2, '既存値に `amount` を足して `map.put(cat, current + amount)` で更新します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('a68d7e1a-c9bc-4b04-91cb-20eeffe72c3e', 3, '最後の `target` がマップに無い場合は `0` を出力します。');

-- 中級 2-1. CSV注文データのパースと合計金額計算
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('8e305198-d8f9-47c2-9313-42f0928951f0', '06f2d4e3-729c-4392-8945-9af33d7833e5', '中級 2-1. CSV注文データのパースと合計金額計算', '### 問題概要
`商品名,単価,個数` の形式で与えられるCSV行を `split(",")` で分割し、全注文の合計金額を算出してください。

### 入力仕様
- 1行目：行数 `N`
- 続く `N` 行：`<商品名>,<単価>,<個数>`（余分な空白が含まれる場合があるため `trim()` で除去すること）

### 出力仕様
`TotalAmount: <合計金額>`', 'medium', 15, ARRAY['標準API', 'CSV処理']::text[], 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        int total = 0;
        for (int i = 0; i < n; i++) {
            String line = sc.nextLine();
            // split と trim と Integer.parseInt を使って合計に加算してください
        }
        System.out.println("TotalAmount: " + total);
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        int total = 0;
        for (int i = 0; i < n; i++) {
            String line = sc.nextLine();
            String[] cols = line.split(",");
            int price = Integer.parseInt(cols[1].trim());
            int qty = Integer.parseInt(cols[2].trim());
            total += price * qty;
        }
        System.out.println("TotalAmount: " + total);
    }
}', '業務バッチ処理で頻出するCSV読み込みでは、`split(",")` で列配列に分解し、前後空白を `trim()` で取り除いてから数値変換するのが鉄則です。', 1, true)
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

DELETE FROM public.test_cases WHERE problem_id = '8e305198-d8f9-47c2-9313-42f0928951f0';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('8e305198-d8f9-47c2-9313-42f0928951f0', '公開テスト1：3行のCSV注文', '3
Pen,120,5
Notebook, 250, 2
Eraser,80,3
', 'TotalAmount: 1340', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('8e305198-d8f9-47c2-9313-42f0928951f0', '非公開テスト1：1行のみ', '1
Monitor, 32000, 2
', 'TotalAmount: 64000', true, 2);

DELETE FROM public.hints WHERE problem_id = '8e305198-d8f9-47c2-9313-42f0928951f0';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('8e305198-d8f9-47c2-9313-42f0928951f0', 1, '`String[] cols = line.split(",");` でカンマ分割します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('8e305198-d8f9-47c2-9313-42f0928951f0', 2, '単価は `cols[1].trim()`、個数は `cols[2].trim()` を `Integer.parseInt` に渡します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('8e305198-d8f9-47c2-9313-42f0928951f0', 3, '`total += price * qty;` で累積加算します。');

-- 中級 2-2. 例外処理（try-catch / throw）による安全な在庫引当
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('338eceb9-a942-415f-ae2f-1012d8bc104c', '06f2d4e3-729c-4392-8945-9af33d7833e5', '中級 2-2. 例外処理（try-catch / throw）による安全な在庫引当', '### 問題概要
在庫数 `stock` から出庫数 `qty` を引き当てるメソッド `allocate(int stock, int qty)` を実装してください。

### 仕様
- `qty <= 0` の場合：`IllegalArgumentException("INVALID_QTY")` を `throw` する
- `qty > stock` の場合：`IllegalStateException("OUT_OF_STOCK")` を `throw` する
- 正常時：残在庫 `stock - qty` を返す
- `main` メソッドで `try-catch` し、正常時は `Remaining: <残在庫>`、例外時は `Error: <例外メッセージ>` を出力してください。', 'medium', 15, ARRAY['例外処理', 'try-catch']::text[], 'import java.util.Scanner;

public class Main {
    public static int allocate(int stock, int qty) {
        // ここにバリデーションと throw を実装してください
        return stock - qty;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int stock = sc.nextInt();
        int qty = sc.nextInt();
        try {
            int rem = allocate(stock, qty);
            System.out.println("Remaining: " + rem);
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}', 'import java.util.Scanner;

public class Main {
    public static int allocate(int stock, int qty) {
        if (qty <= 0) {
            throw new IllegalArgumentException("INVALID_QTY");
        }
        if (qty > stock) {
            throw new IllegalStateException("OUT_OF_STOCK");
        }
        return stock - qty;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int stock = sc.nextInt();
        int qty = sc.nextInt();
        try {
            int rem = allocate(stock, qty);
            System.out.println("Remaining: " + rem);
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}', '不正な引数には `IllegalArgumentException`、状態不整合（在庫不足など）には `IllegalStateException` を投げるのがJava実務の標準プラクティスです。', 2, true)
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

DELETE FROM public.test_cases WHERE problem_id = '338eceb9-a942-415f-ae2f-1012d8bc104c';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('338eceb9-a942-415f-ae2f-1012d8bc104c', '公開テスト1：正常引当', '10 3
', 'Remaining: 7', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('338eceb9-a942-415f-ae2f-1012d8bc104c', '公開テスト2：在庫不足', '5 8
', 'Error: OUT_OF_STOCK', false, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('338eceb9-a942-415f-ae2f-1012d8bc104c', '非公開テスト1：不正数量（0以下）', '10 0
', 'Error: INVALID_QTY', true, 3);

DELETE FROM public.hints WHERE problem_id = '338eceb9-a942-415f-ae2f-1012d8bc104c';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('338eceb9-a942-415f-ae2f-1012d8bc104c', 1, 'まず `qty <= 0` をチェックし、`throw new IllegalArgumentException("INVALID_QTY");` を実行します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('338eceb9-a942-415f-ae2f-1012d8bc104c', 2, '次に `qty > stock` をチェックし、`throw new IllegalStateException("OUT_OF_STOCK");` を実行します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('338eceb9-a942-415f-ae2f-1012d8bc104c', 3, '両方通過したら `return stock - qty;` を返します。');

-- 上級 1-1. DAOパターンによる顧客CRUDリポジトリ実装
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('13f69b84-652e-4921-abe6-7d4703f0d86d', 'd62467af-4c0c-45b3-be32-3224f0765b0d', '上級 1-1. DAOパターンによる顧客CRUDリポジトリ実装', '### 問題概要
データベース層を模した `CustomerDao` クラスを実装し、コマンド（`ADD`, `GET`, `DEL`）を処理してください。

### 仕様
- `save(int id, String name)`：顧客を登録または上書き更新する
- `findById(int id)`：顧客名を返す（未登録時は `"NOT_FOUND"`）
- `deleteById(int id)`：該当顧客を削除する

### 入力仕様
- 1行目：操作回数 `Q`
- 続く `Q` 行：`ADD <id> <name>` / `GET <id>` / `DEL <id>`', 'hard', 20, ARRAY['DAO設計', 'コレクション']::text[], 'import java.util.HashMap;
import java.util.Scanner;

class CustomerDao {
    private HashMap<Integer, String> store = new HashMap<>();

    // save, findById, deleteById を実装してください
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int q = sc.nextInt();
        CustomerDao dao = new CustomerDao();
        for (int i = 0; i < q; i++) {
            String cmd = sc.next();
            int id = sc.nextInt();
            if (cmd.equals("ADD")) {
                String name = sc.next();
                dao.save(id, name);
            } else if (cmd.equals("GET")) {
                System.out.println(dao.findById(id));
            } else if (cmd.equals("DEL")) {
                dao.deleteById(id);
            }
        }
    }
}', 'import java.util.HashMap;
import java.util.Scanner;

class CustomerDao {
    private HashMap<Integer, String> store = new HashMap<>();

    public void save(int id, String name) {
        store.put(id, name);
    }

    public String findById(int id) {
        if (!store.containsKey(id)) {
            return "NOT_FOUND";
        }
        return store.get(id);
    }

    public void deleteById(int id) {
        store.remove(id);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int q = sc.nextInt();
        CustomerDao dao = new CustomerDao();
        for (int i = 0; i < q; i++) {
            String cmd = sc.next();
            int id = sc.nextInt();
            if (cmd.equals("ADD")) {
                String name = sc.next();
                dao.save(id, name);
            } else if (cmd.equals("GET")) {
                System.out.println(dao.findById(id));
            } else if (cmd.equals("DEL")) {
                dao.deleteById(id);
            }
        }
    }
}', 'DAO（Data Access Object）に永続化操作（CRUD）を閉じ込めることで、将来的に保存先が `HashMap` から PostgreSQL（JDBC / Spring Data JPA）へ変わっても業務ロジック層への影響を最小限にできます。', 1, true)
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

DELETE FROM public.test_cases WHERE problem_id = '13f69b84-652e-4921-abe6-7d4703f0d86d';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('13f69b84-652e-4921-abe6-7d4703f0d86d', '公開テスト1：登録→取得→削除→再取得', '5
ADD 1 ACME
GET 1
DEL 1
GET 1
GET 2
', 'ACME
NOT_FOUND
NOT_FOUND', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('13f69b84-652e-4921-abe6-7d4703f0d86d', '非公開テスト1：上書き更新検証', '4
ADD 10 OldCorp
ADD 10 NewCorp
GET 10
DEL 10
', 'NewCorp', true, 2);

DELETE FROM public.hints WHERE problem_id = '13f69b84-652e-4921-abe6-7d4703f0d86d';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('13f69b84-652e-4921-abe6-7d4703f0d86d', 1, '`save` は `store.put(id, name);` で登録・更新の両方に対応できます。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('13f69b84-652e-4921-abe6-7d4703f0d86d', 2, '`findById` は `store.containsKey(id)` が false なら `"NOT_FOUND"` を返します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('13f69b84-652e-4921-abe6-7d4703f0d86d', 3, '`deleteById` は `store.remove(id);` を呼び出します。');

-- 上級 1-2. REST API入力バリデーション＆ステータス判定
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('39a6ec73-6e56-43cc-8b6e-5d28d8769545', 'd62467af-4c0c-45b3-be32-3224f0765b0d', '上級 1-2. REST API入力バリデーション＆ステータス判定', '### 問題概要
顧客登録API（`POST /api/customers`）の入力バリデーションを実装してください。

### 検証ルール（優先順ではなく全エラーを判定し、エラーが1件でもあれば 400）
1. 会社名（`name`）：前後空白除去後に空文字の場合はエラー（`NAME_REQUIRED`）
2. メール（`email`）：`@` を含まない場合はエラー（`INVALID_EMAIL`）

### 出力仕様
- エラーがない場合：`201 CREATED`
- エラーがある場合：1行目に `400 BAD_REQUEST`、2行目以降に該当エラーコードを順番に出力', 'hard', 15, ARRAY['バリデーション', 'API設計']::text[], 'import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        String email = sc.nextLine();

        ArrayList<String> errors = new ArrayList<>();
        // バリデーションを実装してください
    }
}', 'import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        String email = sc.nextLine();

        ArrayList<String> errors = new ArrayList<>();
        if (name.trim().length() == 0) {
            errors.add("NAME_REQUIRED");
        }
        if (!email.contains("@")) {
            errors.add("INVALID_EMAIL");
        }

        if (errors.size() == 0) {
            System.out.println("201 CREATED");
        } else {
            System.out.println("400 BAD_REQUEST");
            for (int i = 0; i < errors.size(); i++) {
                System.out.println(errors.get(i));
            }
        }
    }
}', '実務のAPIバリデーションでは最初の1件で止めず、複数項目の入力不備をリストにまとめて `400 BAD_REQUEST` で返却するのがフロントエンドにとって親切な設計です。', 2, true)
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

DELETE FROM public.test_cases WHERE problem_id = '39a6ec73-6e56-43cc-8b6e-5d28d8769545';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('39a6ec73-6e56-43cc-8b6e-5d28d8769545', '公開テスト1：正常入力', 'ACME Corp
hr@acme.example.com
', '201 CREATED', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('39a6ec73-6e56-43cc-8b6e-5d28d8769545', '公開テスト2：両方エラー', '   
invalid-email
', '400 BAD_REQUEST
NAME_REQUIRED
INVALID_EMAIL', false, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('39a6ec73-6e56-43cc-8b6e-5d28d8769545', '非公開テスト1：メールのみエラー', 'NextSys
nextsys.jp
', '400 BAD_REQUEST
INVALID_EMAIL', true, 3);

DELETE FROM public.hints WHERE problem_id = '39a6ec73-6e56-43cc-8b6e-5d28d8769545';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('39a6ec73-6e56-43cc-8b6e-5d28d8769545', 1, '`name.trim().length() == 0` で空文字・空白のみを検知します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('39a6ec73-6e56-43cc-8b6e-5d28d8769545', 2, '`!email.contains("@")` でメール形式エラーを検知します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('39a6ec73-6e56-43cc-8b6e-5d28d8769545', 3, '`errors.size() == 0` なら `201 CREATED`、それ以外は `400 BAD_REQUEST` と各エラーを出力します。');

-- 上級 2-1. 顧客・案件管理サービス：受注済み案件の合計予算集計
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('655b0d6e-f5a3-4a2d-be5b-70457fc0e1a4', '3f313153-e5f5-466a-b5f2-51a43cefbf1d', '上級 2-1. 顧客・案件管理サービス：受注済み案件の合計予算集計', '### 問題概要
最終模擬プロジェクト「顧客・案件管理システム」のService層ロジックを実装します。
`N` 件の案件データ（`案件名 ステータス 予算(万円)`）を受け取り、ステータスが `WON`（受注済み）の案件件数と合計予算を出力してください。

### 出力仕様
```
WonCount: <件数>
WonBudget: <合計予算>
```', 'hard', 15, ARRAY['実務プロジェクト', 'Service設計']::text[], 'import java.util.ArrayList;
import java.util.Scanner;

class Deal {
    String title;
    String status;
    int budget;

    public Deal(String title, String status, int budget) {
        this.title = title;
        this.status = status;
        this.budget = budget;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        ArrayList<Deal> deals = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            deals.add(new Deal(sc.next(), sc.next(), sc.nextInt()));
        }
        // WON案件の件数と合計予算を出力してください
    }
}', 'import java.util.ArrayList;
import java.util.Scanner;

class Deal {
    String title;
    String status;
    int budget;

    public Deal(String title, String status, int budget) {
        this.title = title;
        this.status = status;
        this.budget = budget;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        ArrayList<Deal> deals = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            deals.add(new Deal(sc.next(), sc.next(), sc.nextInt()));
        }
        int wonCount = 0;
        int wonBudget = 0;
        for (int i = 0; i < deals.size(); i++) {
            Deal d = deals.get(i);
            if (d.status.equals("WON")) {
                wonCount++;
                wonBudget += d.budget;
            }
        }
        System.out.println("WonCount: " + wonCount);
        System.out.println("WonBudget: " + wonBudget);
    }
}', 'エンティティクラス（`Deal`）のリストを走査し、文字列比較には必ず `equals` を使ってステータス判定を行います。', 1, true)
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

DELETE FROM public.test_cases WHERE problem_id = '655b0d6e-f5a3-4a2d-be5b-70457fc0e1a4';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('655b0d6e-f5a3-4a2d-be5b-70457fc0e1a4', '公開テスト1：4案件中2件受注', '4
CRM WON 500
ERP OPEN 1200
WebAPI WON 300
Mobile LOST 400
', 'WonCount: 2
WonBudget: 800', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('655b0d6e-f5a3-4a2d-be5b-70457fc0e1a4', '非公開テスト1：受注0件', '2
A OPEN 100
B LOST 200
', 'WonCount: 0
WonBudget: 0', true, 2);

DELETE FROM public.hints WHERE problem_id = '655b0d6e-f5a3-4a2d-be5b-70457fc0e1a4';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('655b0d6e-f5a3-4a2d-be5b-70457fc0e1a4', 1, '文字列の一致判定は `==` ではなく `d.status.equals("WON")` を使います。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('655b0d6e-f5a3-4a2d-be5b-70457fc0e1a4', 2, '一致するたびに `wonCount++` と `wonBudget += d.budget` を行います。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('655b0d6e-f5a3-4a2d-be5b-70457fc0e1a4', 3, '指定の2行フォーマットで出力してください。');

-- 上級 2-2. 境界値・異常系を含む単体テスト検証メソッドの実装
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('80caf184-42ff-481e-b11f-d6db1a712fe7', '3f313153-e5f5-466a-b5f2-51a43cefbf1d', '上級 2-2. 境界値・異常系を含む単体テスト検証メソッドの実装', '### 問題概要
年齢 `age` がサービス利用可能範囲（`18`歳以上 `65`歳以下）かを判定する `isEligible(int age)` メソッドを実装し、入力された境界値テストケース群に対して `PASS` / `FAIL` を検証してください。

### 仕様
- `isEligible(int age)`：`18 <= age && age <= 65` なら `true`、それ以外は `false`
- 入力の1行目にテストケース数 `T`、続く `T` 行に `<入力年齢> <期待値(true/false)>` が与えられます。
- 各ケースで `isEligible(age) == expected` なら `PASS`、異なれば `FAIL` と出力してください。', 'medium', 12, ARRAY['単体テスト', '境界値分析']::text[], 'import java.util.Scanner;

public class Main {
    public static boolean isEligible(int age) {
        // 18歳以上65歳以下の判定を実装してください
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int t = sc.nextInt();
        for (int i = 0; i < t; i++) {
            int age = sc.nextInt();
            boolean expected = Boolean.parseBoolean(sc.next());
            boolean actual = isEligible(age);
            System.out.println(actual == expected ? "PASS" : "FAIL");
        }
    }
}', 'import java.util.Scanner;

public class Main {
    public static boolean isEligible(int age) {
        return age >= 18 && age <= 65;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int t = sc.nextInt();
        for (int i = 0; i < t; i++) {
            int age = sc.nextInt();
            boolean expected = Boolean.parseBoolean(sc.next());
            boolean actual = isEligible(age);
            System.out.println(actual == expected ? "PASS" : "FAIL");
        }
    }
}', '境界値テストでは、下限の前後（`17`, `18`）と上限の前後（`65`, `66`）、および異常値（`-1`）を必ずテストケースに含めることでオフバイワンバグ（`>` と `>=` の取り違え）を防ぎます。', 2, true)
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

DELETE FROM public.test_cases WHERE problem_id = '80caf184-42ff-481e-b11f-d6db1a712fe7';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('80caf184-42ff-481e-b11f-d6db1a712fe7', '公開テスト1：境界値フルセット（17, 18, 65, 66）', '4
17 false
18 true
65 true
66 false
', 'PASS
PASS
PASS
PASS', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('80caf184-42ff-481e-b11f-d6db1a712fe7', '非公開テスト1：負数と中間値', '2
-1 false
30 true
', 'PASS
PASS', true, 2);

DELETE FROM public.hints WHERE problem_id = '80caf184-42ff-481e-b11f-d6db1a712fe7';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('80caf184-42ff-481e-b11f-d6db1a712fe7', 1, '「以上」「以下」なので `>=` と `<=` を使用します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('80caf184-42ff-481e-b11f-d6db1a712fe7', 2, '`return age >= 18 && age <= 65;` の1行で表現できます。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('80caf184-42ff-481e-b11f-d6db1a712fe7', 3, '17→false, 18→true, 65→true, 66→false になるか確認してください。');

-- 初級 1-3. 配列の昇順ソートと中央値（メソッド設計）
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('338a21fc-7762-4df4-a061-f54b343c1bb8', '5347964f-04df-4e46-ae8a-a654826f9d73', '初級 1-3. 配列の昇順ソートと中央値（メソッド設計）', '### 問題概要
奇数個 `N` 個の整数を配列に読み込み、昇順（小さい順）に並び替えたうえで **最小値・中央値・最大値** を出力するプログラムを作成してください。

### 入力仕様
- 1行目：要素数 `N`（奇数）
- 2行目：`N` 個の整数（スペース区切り）

### 出力仕様
`Min: <最小値>`
`Median: <中央値>`
`Max: <最大値>`', 'medium', 15, ARRAY['配列', 'アルゴリズム', 'メソッド']::text[], 'import java.util.Scanner;

public class Main {
    public static void sortAsc(int[] arr) {
        // 昇順ソート（バブルソートまたは選択ソート）を実装してください
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }
        sortAsc(nums);
        System.out.println("Min: " + nums[0]);
        System.out.println("Median: " + nums[n / 2]);
        System.out.println("Max: " + nums[n - 1]);
    }
}', 'import java.util.Scanner;

public class Main {
    public static void sortAsc(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            for (int j = 0; j < arr.length - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    int tmp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = tmp;
                }
            }
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }
        sortAsc(nums);
        System.out.println("Min: " + nums[0]);
        System.out.println("Median: " + nums[n / 2]);
        System.out.println("Max: " + nums[n - 1]);
    }
}', '配列は参照渡しのため、`sortAsc(nums)` メソッド内で要素を入れ替えると元の配列 `nums` 自体が昇順に並び替わります。昇順ソート後は先頭が最小値、`nums[n / 2]` が中央値、末尾 `nums[n - 1]` が最大値になります。', 3, true)
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

DELETE FROM public.test_cases WHERE problem_id = '338a21fc-7762-4df4-a061-f54b343c1bb8';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('338a21fc-7762-4df4-a061-f54b343c1bb8', '公開テスト1：5要素のソートと中央値', '5
40 10 50 20 30
', 'Min: 10
Median: 30
Max: 50', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('338a21fc-7762-4df4-a061-f54b343c1bb8', '非公開テスト1：負数を含む3要素', '3
-5 100 0
', 'Min: -5
Median: 0
Max: 100', true, 2);

DELETE FROM public.hints WHERE problem_id = '338a21fc-7762-4df4-a061-f54b343c1bb8';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('338a21fc-7762-4df4-a061-f54b343c1bb8', 1, '二重ループで隣り合う要素 `arr[j]` と `arr[j + 1]` を比較します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('338a21fc-7762-4df4-a061-f54b343c1bb8', 2, '`arr[j] > arr[j + 1]` のとき、一時変数 `tmp` を使って2つの値を交換します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('338a21fc-7762-4df4-a061-f54b343c1bb8', 3, 'ソート後、中央値は `nums[n / 2]` で取得できます。');

-- 初級 2-3. 給与計算インターフェースと雇用形態別ポリモーフィズム
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('ffa3f051-92ef-4fd4-b4e2-3212736cde61', '41302b0f-c345-4660-9dfe-6cf806c97783', '初級 2-3. 給与計算インターフェースと雇用形態別ポリモーフィズム', '### 問題概要
雇用形態によって給与計算ロジックが異なる社員を統一的に扱う `Payable` インターフェースと2つのクラスを実装してください。

### 仕様
- インターフェース `Payable`：`int calcMonthlyPay();` を定義
- `FullTimeEmployee`（`implements Payable`）：月給 `baseSalary` と残業時間 `overtimeHours` を受け取り、`baseSalary + overtimeHours * 2500` を返す
- `PartTimeEmployee`（`implements Payable`）：時給 `hourlyWage` と勤務時間 `workHours` を受け取り、`hourlyWage * workHours` を返す

### 入力仕様
- 1行目：種別（`FULL` または `PART`）
- 2行目：数値2つ（`FULL` なら `基本給 残業時間`、`PART` なら `時給 勤務時間`）

### 出力仕様
`Pay: <月次支給額>`', 'medium', 15, ARRAY['クラスとオブジェクト', 'ポリモーフィズム']::text[], 'import java.util.Scanner;

interface Payable {
    int calcMonthlyPay();
}

// FullTimeEmployee と PartTimeEmployee を実装してください

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        int a = sc.nextInt();
        int b = sc.nextInt();

        Payable emp;
        if (type.equals("FULL")) {
            emp = new FullTimeEmployee(a, b);
        } else {
            emp = new PartTimeEmployee(a, b);
        }
        System.out.println("Pay: " + emp.calcMonthlyPay());
    }
}', 'import java.util.Scanner;

interface Payable {
    int calcMonthlyPay();
}

class FullTimeEmployee implements Payable {
    private int baseSalary;
    private int overtimeHours;

    public FullTimeEmployee(int baseSalary, int overtimeHours) {
        this.baseSalary = baseSalary;
        this.overtimeHours = overtimeHours;
    }

    public int calcMonthlyPay() {
        return this.baseSalary + this.overtimeHours * 2500;
    }
}

class PartTimeEmployee implements Payable {
    private int hourlyWage;
    private int workHours;

    public PartTimeEmployee(int hourlyWage, int workHours) {
        this.hourlyWage = hourlyWage;
        this.workHours = workHours;
    }

    public int calcMonthlyPay() {
        return this.hourlyWage * this.workHours;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        int a = sc.nextInt();
        int b = sc.nextInt();

        Payable emp;
        if (type.equals("FULL")) {
            emp = new FullTimeEmployee(a, b);
        } else {
            emp = new PartTimeEmployee(a, b);
        }
        System.out.println("Pay: " + emp.calcMonthlyPay());
    }
}', '正社員とアルバイトで給与計算式が異なっても、共通の `Payable` インターフェースで扱うことで、呼び出し側は `emp.calcMonthlyPay()` だけで統一的に支給額を算出できます。', 3, true)
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

DELETE FROM public.test_cases WHERE problem_id = 'ffa3f051-92ef-4fd4-b4e2-3212736cde61';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('ffa3f051-92ef-4fd4-b4e2-3212736cde61', '公開テスト1：正社員（基本給250000・残業10h）', 'FULL 250000 10
', 'Pay: 275000', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('ffa3f051-92ef-4fd4-b4e2-3212736cde61', '公開テスト2：アルバイト（時給1200・80h）', 'PART 1200 80
', 'Pay: 96000', false, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('ffa3f051-92ef-4fd4-b4e2-3212736cde61', '非公開テスト1：正社員残業0h', 'FULL 300000 0
', 'Pay: 300000', true, 3);

DELETE FROM public.hints WHERE problem_id = 'ffa3f051-92ef-4fd4-b4e2-3212736cde61';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('ffa3f051-92ef-4fd4-b4e2-3212736cde61', 1, '`FullTimeEmployee` と `PartTimeEmployee` にそれぞれ2つの `private int` フィールドとコンストラクタを用意します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('ffa3f051-92ef-4fd4-b4e2-3212736cde61', 2, '両クラスに `implements Payable` を付け、`public int calcMonthlyPay()` を実装します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('ffa3f051-92ef-4fd4-b4e2-3212736cde61', 3, '正社員は `baseSalary + overtimeHours * 2500`、アルバイトは `hourlyWage * workHours` を返します。');

-- 中級 1-3. HashMap によるアクセスログ種別カウントと最多項目抽出
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('49441e08-c36d-496d-aae6-962dfc4ad912', '1177c80b-bcc9-4745-a4f8-7caf1ef01327', '中級 1-3. HashMap によるアクセスログ種別カウントと最多項目抽出', '### 問題概要
`N` 件のHTTPリクエストログのエンドポイント名（例：`/login`, `/courses`）を `HashMap<String, Integer>` で集計し、**最もアクセス回数が多いエンドポイント名とその回数** を出力してください（同数の場合は最初に最大回数に到達したものを出力）。

### 入力仕様
- 1行目：ログ件数 `N`
- 続く `N` 行：エンドポイント文字列（空白なし）

### 出力仕様
`Top: <エンドポイント> (<回数>)`', 'medium', 15, ARRAY['コレクション', 'HashMap']::text[], 'import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        HashMap<String, Integer> counts = new HashMap<>();

        // 各エンドポイントの出現回数を集計し、最多エンドポイントを求めてください
    }
}', 'import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        HashMap<String, Integer> counts = new HashMap<>();
        String topPath = "";
        int topCount = 0;

        for (int i = 0; i < n; i++) {
            String path = sc.next();
            int next = (counts.containsKey(path) ? counts.get(path) : 0) + 1;
            counts.put(path, next);
            if (next > topCount) {
                topCount = next;
                topPath = path;
            }
        }
        System.out.println("Top: " + topPath + " (" + topCount + ")");
    }
}', '`HashMap` で出現回数を更新しながら同時に暫定最大値 `topCount` と `topPath` を追跡することで、1回のループ（$O(N)$）で最頻出ログを効率よく抽出できます。', 3, true)
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

DELETE FROM public.test_cases WHERE problem_id = '49441e08-c36d-496d-aae6-962dfc4ad912';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('49441e08-c36d-496d-aae6-962dfc4ad912', '公開テスト1：5件のアクセスログ集計', '5
/login
/courses
/login
/profile
/login
', 'Top: /login (3)', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('49441e08-c36d-496d-aae6-962dfc4ad912', '非公開テスト1：別エンドポイントが最多', '4
/api
/home
/home
/api
', 'Top: /home (2)', true, 2);

DELETE FROM public.hints WHERE problem_id = '49441e08-c36d-496d-aae6-962dfc4ad912';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('49441e08-c36d-496d-aae6-962dfc4ad912', 1, '`counts.containsKey(path)` で既存回数を確認し、`+ 1` して `counts.put(path, next)` します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('49441e08-c36d-496d-aae6-962dfc4ad912', 2, '`if (next > topCount)` のとき `topCount = next; topPath = path;` を更新します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('49441e08-c36d-496d-aae6-962dfc4ad912', 3, '最後に `"Top: " + topPath + " (" + topCount + ")"` の形式で出力します。');

-- 中級 2-3. 例外処理（try-catch）による不正データ除外と安全集計
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('2a104813-9e36-4021-a7c3-6432ef9baa12', '06f2d4e3-729c-4392-8945-9af33d7833e5', '中級 2-3. 例外処理（try-catch）による不正データ除外と安全集計', '### 問題概要
外部CSVから読み込んだ `N` 行の文字列データの中には、数値に変換できない不正行（例：`N/A`, `error`）が混ざっています。
`Integer.parseInt` の例外を `try-catch` で捕捉し、**有効な数値だけの合計値** と **スキップした不正行数** を出力してください。

### 入力仕様
- 1行目：行数 `N`
- 続く `N` 行：任意の文字列

### 出力仕様
`Sum: <有効数値の合計>`
`Skipped: <不正行数>`', 'medium', 15, ARRAY['例外処理', 'try-catch', '標準API']::text[], 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        int sum = 0;
        int skipped = 0;

        // 各行を Integer.parseInt で変換し、失敗時は skipped をカウントしてください

        System.out.println("Sum: " + sum);
        System.out.println("Skipped: " + skipped);
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        int sum = 0;
        int skipped = 0;

        for (int i = 0; i < n; i++) {
            String raw = sc.nextLine().trim();
            try {
                int val = Integer.parseInt(raw);
                sum += val;
            } catch (Exception e) {
                skipped++;
            }
        }

        System.out.println("Sum: " + sum);
        System.out.println("Skipped: " + skipped);
    }
}', '実務のバッチ処理では1件の不正データで処理全体を止めないよう、ループの「内側」に `try-catch` を配置して不正行だけを安全にスキップ・件数記録する設計がよく使われます。', 3, true)
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

DELETE FROM public.test_cases WHERE problem_id = '2a104813-9e36-4021-a7c3-6432ef9baa12';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('2a104813-9e36-4021-a7c3-6432ef9baa12', '公開テスト1：不正データ2件を含む5行', '5
100
N/A
250
error
50
', 'Sum: 400
Skipped: 2', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('2a104813-9e36-4021-a7c3-6432ef9baa12', '非公開テスト1：全件不正データ', '2
abc
xyz
', 'Sum: 0
Skipped: 2', true, 2);

DELETE FROM public.hints WHERE problem_id = '2a104813-9e36-4021-a7c3-6432ef9baa12';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('2a104813-9e36-4021-a7c3-6432ef9baa12', 1, '`for` ループの内側に `try { ... } catch (Exception e) { ... }` を書きます。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('2a104813-9e36-4021-a7c3-6432ef9baa12', 2, '`try` 内で `Integer.parseInt(raw)` して `sum` に足します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('2a104813-9e36-4021-a7c3-6432ef9baa12', 3, '`catch` 内で `skipped++` を実行します。');

-- 上級 1-3. REST API ページネーション計算と対象ページ抽出
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('4a04fb5a-3064-4215-8e35-21cdb617693e', 'd62467af-4c0c-45b3-be32-3224f0765b0d', '上級 1-3. REST API ページネーション計算と対象ページ抽出', '### 問題概要
一覧API（`GET /api/items?page=P&size=S`）のページネーション処理を実装してください。
`N` 件のアイテム一覧から、指定された `page`（1始まり）と `size`（1ページあたりの件数）に該当するアイテムを順番に出力し、総ページ数も算出してください。

### 仕様
- 総ページ数 `totalPages = (N + size - 1) / size`（ただし `N == 0` のときは `0`）
- 1行目に `Page: <page>/<totalPages>` を出力
- 続く行に該当ページのアイテムを1行ずつ出力（該当アイテムが0件の場合は `EMPTY` を1行出力）

### 入力仕様
- 1行目：`N page size`
- 続く `N` 行：アイテム名', 'hard', 20, ARRAY['API設計', 'コレクション']::text[], 'import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int page = sc.nextInt();
        int size = sc.nextInt();
        ArrayList<String> items = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            items.add(sc.next());
        }

        // totalPages と start/end インデックスを計算して出力してください
    }
}', 'import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int page = sc.nextInt();
        int size = sc.nextInt();
        ArrayList<String> items = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            items.add(sc.next());
        }

        int totalPages = n == 0 ? 0 : (n + size - 1) / size;
        System.out.println("Page: " + page + "/" + totalPages);

        int start = (page - 1) * size;
        int end = start + size;
        if (end > n) {
            end = n;
        }

        if (page < 1 || start >= n) {
            System.out.println("EMPTY");
        } else {
            for (int i = start; i < end; i++) {
                System.out.println(items.get(i));
            }
        }
    }
}', '一覧APIのページネーションでは、切り上げ総ページ数 `(n + size - 1) / size` と開始インデックス `(page - 1) * size`、範囲外ページ指定時の安全ガード（`start >= n` で `EMPTY`）が実務の定番パターンです。', 3, true)
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

DELETE FROM public.test_cases WHERE problem_id = '4a04fb5a-3064-4215-8e35-21cdb617693e';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('4a04fb5a-3064-4215-8e35-21cdb617693e', '公開テスト1：5件中 2ページ目（size=2）', '5 2 2
A
B
C
D
E
', 'Page: 2/3
C
D', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('4a04fb5a-3064-4215-8e35-21cdb617693e', '公開テスト2：最終ページ（端数1件）', '5 3 2
A
B
C
D
E
', 'Page: 3/3
E', false, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('4a04fb5a-3064-4215-8e35-21cdb617693e', '非公開テスト1：範囲外ページ指定', '3 5 2
X
Y
Z
', 'Page: 5/2
EMPTY', true, 3);

DELETE FROM public.hints WHERE problem_id = '4a04fb5a-3064-4215-8e35-21cdb617693e';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('4a04fb5a-3064-4215-8e35-21cdb617693e', 1, '総ページ数の切り上げは `(n + size - 1) / size` で計算できます。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('4a04fb5a-3064-4215-8e35-21cdb617693e', 2, '開始位置は `start = (page - 1) * size`、終了位置は `Math.min(start + size, n)`（または `if (end > n) end = n;`）です。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('4a04fb5a-3064-4215-8e35-21cdb617693e', 3, '`page < 1 || start >= n` のときは `EMPTY` を出力します。');

-- 上級 2-3. 注文ステータス遷移バリデーション（状態遷移設計）
INSERT INTO public.problems (id, lesson_id, title, description_md, difficulty, estimated_minutes, tags, starter_code, solution_code, explanation_md, order_index, is_published)
VALUES ('e6d68ef6-443f-4d0f-8c6e-3a3ecba9885e', '3f313153-e5f5-466a-b5f2-51a43cefbf1d', '上級 2-3. 注文ステータス遷移バリデーション（状態遷移設計）', '### 問題概要
EC・案件管理システムにおける注文ステータスの状態遷移ルールを検証する `canTransition(String from, String to)` メソッドを実装してください。

### 許可される遷移ルール
- `DRAFT` → `CONFIRMED` または `CANCELLED`
- `CONFIRMED` → `SHIPPED` または `CANCELLED`
- `SHIPPED` → `DELIVERED` のみ
- `DELIVERED` / `CANCELLED` → どこにも遷移不可（終端状態）

### 入力仕様
- 1行目：検証件数 `T`
- 続く `T` 行：`<現在ステータス> <遷移先ステータス>`

### 出力仕様
許可されていれば `ALLOW`、禁止されていれば `DENY` を1行ずつ出力してください。', 'hard', 20, ARRAY['Service設計', '実務プロジェクト', '単体テスト']::text[], 'import java.util.Scanner;

public class Main {
    public static boolean canTransition(String from, String to) {
        // 状態遷移ルールを実装してください
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int t = sc.nextInt();
        for (int i = 0; i < t; i++) {
            String from = sc.next();
            String to = sc.next();
            System.out.println(canTransition(from, to) ? "ALLOW" : "DENY");
        }
    }
}', 'import java.util.Scanner;

public class Main {
    public static boolean canTransition(String from, String to) {
        if (from.equals("DRAFT")) {
            return to.equals("CONFIRMED") || to.equals("CANCELLED");
        }
        if (from.equals("CONFIRMED")) {
            return to.equals("SHIPPED") || to.equals("CANCELLED");
        }
        if (from.equals("SHIPPED")) {
            return to.equals("DELIVERED");
        }
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int t = sc.nextInt();
        for (int i = 0; i < t; i++) {
            String from = sc.next();
            String to = sc.next();
            System.out.println(canTransition(from, to) ? "ALLOW" : "DENY");
        }
    }
}', '業務システムでは「出荷済み（SHIPPED）からキャンセル（CANCELLED）へ戻す」といった不正な状態遷移をService層で確実に防ぐステートマシン設計が不可欠です。許可リスト（ホワイトリスト方式）で記述し、それ以外はすべて `false` にするのが安全な実装です。', 3, true)
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

DELETE FROM public.test_cases WHERE problem_id = 'e6d68ef6-443f-4d0f-8c6e-3a3ecba9885e';
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('e6d68ef6-443f-4d0f-8c6e-3a3ecba9885e', '公開テスト1：正常遷移と不正遷移の検証', '4
DRAFT CONFIRMED
CONFIRMED SHIPPED
SHIPPED CANCELLED
DELIVERED DRAFT
', 'ALLOW
ALLOW
DENY
DENY', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index) VALUES ('e6d68ef6-443f-4d0f-8c6e-3a3ecba9885e', '非公開テスト1：キャンセルと配達完了', '3
DRAFT CANCELLED
SHIPPED DELIVERED
CANCELLED CONFIRMED
', 'ALLOW
ALLOW
DENY', true, 2);

DELETE FROM public.hints WHERE problem_id = 'e6d68ef6-443f-4d0f-8c6e-3a3ecba9885e';
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('e6d68ef6-443f-4d0f-8c6e-3a3ecba9885e', 1, '文字列比較には必ず `from.equals("...")` を使います。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('e6d68ef6-443f-4d0f-8c6e-3a3ecba9885e', 2, '`DRAFT`, `CONFIRMED`, `SHIPPED` の3つの許可ルートだけ `true` を返します。');
INSERT INTO public.hints (problem_id, step_number, content_md) VALUES ('e6d68ef6-443f-4d0f-8c6e-3a3ecba9885e', 3, '`DELIVERED` や `CANCELLED` や未知の遷移はすべて末尾の `return false;` で拒否します。');

NOTIFY pgrst, 'reload schema';
