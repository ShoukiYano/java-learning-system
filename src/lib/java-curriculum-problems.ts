/**
 * ファイル概要：
 * Java 4段階コース（入門・初級・中級・上級）拡充用の章・演習問題データ
 *
 * 設計方針：
 * - 既存のJava 12問（44444444-...-4401〜4412）のIDと内容は一切変更しない
 * - すべての新規Java問題の模範解答は、DevSkillStudio内蔵Javaインタプリタで
 *   公開・非公開テストケース全件に通過することをVitestで自動検証する
 */

import type { SeedChapter, SeedProblem } from "@/lib/seed-data";

export const SEED_JAVA_BEGINNER_COURSE_ID =
  "0b083361-6d07-47a9-a787-508913d9efa8";
export const SEED_JAVA_INTERMEDIATE_COURSE_ID =
  "c4bd0c61-1a12-4d2a-af9d-ac2eb8a12165";
export const SEED_JAVA_ADVANCED_COURSE_ID =
  "bb827c60-3d1d-40db-ac42-5da47866d141";

/** 推測・URL改ざん防止のため暗号論的ランダムUUID v4を割り当てた新規Java問題ID一覧 */
export const EXTRA_JAVA_PROBLEM_IDS = {
  introProfile: "63c36437-c01c-4fa4-9da1-ca7f5350b486",
  introTax: "09f376c6-3943-4a98-b718-5f9f3ff9b064",
  introShipping: "acbaf347-38d2-426c-8128-6ba18db82f02",
  introHttpSwitch: "ae05977e-4f08-4d96-b996-fe5d805662c6",
  begMatrixSales: "cdb7743b-7403-4297-9c4c-dc6156f4eb0b",
  begOverload: "a5a673fd-798d-4064-a5a0-e9ab3d50bf30",
  begStaticTicket: "73821690-4523-4036-a21e-cc4b4071f26c",
  begPaymentInterface: "832360ab-0091-4ec0-b81b-a88d1b969106",
  intArrayListSearch: "04fc00cc-c83f-4857-ac2f-ea8f79d703e7",
  intHashMapSales: "a68d7e1a-c9bc-4b04-91cb-20eeffe72c3e",
  intCsvParse: "8e305198-d8f9-47c2-9313-42f0928951f0",
  intExceptionStock: "338eceb9-a942-415f-ae2f-1012d8bc104c",
  advCustomerDao: "13f69b84-652e-4921-abe6-7d4703f0d86d",
  advApiValidation: "39a6ec73-6e56-43cc-8b6e-5d28d8769545",
  advDealService: "655b0d6e-f5a3-4a2d-be5b-70457fc0e1a4",
  advBoundaryTest: "80caf184-42ff-481e-b11f-d6db1a712fe7",
  // 追加問題（初級2問・中級2問・上級2問）
  begArraySortMedian: "338a21fc-7762-4df4-a061-f54b343c1bb8",
  begSalaryPolymorphism: "ffa3f051-92ef-4fd4-b4e2-3212736cde61",
  intWordFrequency: "49441e08-c36d-496d-aae6-962dfc4ad912",
  intCustomException: "2a104813-9e36-4021-a7c3-6432ef9baa12",
  advPagination: "4a04fb5a-3064-4215-8e35-21cdb617693e",
  advOrderStateMachine: "e6d68ef6-443f-4d0f-8c6e-3a3ecba9885e",
} as const;

export const EXTRA_JAVA_CHAPTERS: SeedChapter[] = [
  // --- Java初級コース（2章構成・4問） ---
  {
    id: "bf20e7ec-5d77-4543-bb06-f1a260271b59",
    course_id: SEED_JAVA_BEGINNER_COURSE_ID,
    title: "初級第1章：二次元配列とメソッド設計",
    description:
      "表形式データを扱う二次元配列の集計と、メソッドのオーバーロードによる実務的なAPI設計を学びます。",
    order_index: 1,
    lesson_id: "5347964f-04df-4e46-ae8a-a654826f9d73",
    lesson_title: "1-1. 二次元配列・オーバーロード実践",
  },
  {
    id: "f62233bb-0095-4a76-80d3-6a70846ee360",
    course_id: SEED_JAVA_BEGINNER_COURSE_ID,
    title: "初級第2章：static・インターフェース・ポリモーフィズム",
    description:
      "staticメンバーによる共通管理と、interfaceを活用したポリモーフィズム設計（第1回実技試験レベル）を習得します。",
    order_index: 2,
    lesson_id: "41302b0f-c345-4660-9dfe-6cf806c97783",
    lesson_title: "2-1. オブジェクト指向応用と実技課題",
  },

  // --- Java中級コース（2章構成・4問） ---
  {
    id: "f0721c45-037c-49d0-8393-98bb86ce3523",
    course_id: SEED_JAVA_INTERMEDIATE_COURSE_ID,
    title: "中級第1章：コレクション（ArrayList / HashMap）実務活用",
    description:
      "実務で最頻出の ArrayList と HashMap を使い、顧客検索やカテゴリ別売上集計を実装します。",
    order_index: 1,
    lesson_id: "1177c80b-bcc9-4745-a4f8-7caf1ef01327",
    lesson_title: "1-1. List・Mapによる業務データ管理",
  },
  {
    id: "7bb76c60-bac2-408b-a0f5-cb69f0546f13",
    course_id: SEED_JAVA_INTERMEDIATE_COURSE_ID,
    title: "中級第2章：文字列API・CSV処理・例外ハンドリング",
    description:
      "StringメソッドによるCSVパースと、try-catch-finally / throw を使った安全な例外処理を実装します。",
    order_index: 2,
    lesson_id: "06f2d4e3-729c-4392-8945-9af33d7833e5",
    lesson_title: "2-1. CSVデータ処理と例外制御",
  },

  // --- Java上級コース（2章構成・4問） ---
  {
    id: "b5486a57-160b-4bb3-9d1b-f5e9f7cc6590",
    course_id: SEED_JAVA_ADVANCED_COURSE_ID,
    title: "上級第1章：DAOパターンとAPIバリデーション設計",
    description:
      "DBアクセスを分離するDAOリポジトリ設計と、Spring Boot APIを想定した入力バリデーション・エラー応答を実装します。",
    order_index: 1,
    lesson_id: "d62467af-4c0c-45b3-be32-3224f0765b0d",
    lesson_title: "1-1. DAO設計とバリデーション",
  },
  {
    id: "446172d3-98c4-4c34-8277-7973f5953a36",
    course_id: SEED_JAVA_ADVANCED_COURSE_ID,
    title: "上級第2章：顧客・案件管理ロジック＆単体テスト設計",
    description:
      "最終模擬プロジェクトのコア業務ロジック実装と、正常系・異常系・境界値を網羅したテスト検証を行います。",
    order_index: 2,
    lesson_id: "3f313153-e5f5-466a-b5f2-51a43cefbf1d",
    lesson_title: "2-1. 実務模擬プロジェクトと単体テスト",
  },
];

export const EXTRA_JAVA_PROBLEMS: SeedProblem[] = [
  // ===========================================================================
  // Java入門コース 追加問題（既存の第1章・第2章を補強：4問）
  // ===========================================================================
  {
    id: EXTRA_JAVA_PROBLEM_IDS.introProfile,
    chapter_id: "22222222-2222-4222-8222-222222222201",
    lesson_id: "33333333-3333-4333-8333-333333333301",
    language: "java",
    title: "1-4. 変数とデータ型による社員プロフィール出力",
    description_md: `### 問題概要
社員情報（氏名・年齢・勤続年数・在籍フラグ）をそれぞれ適切な型の変数に格納し、指定フォーマットで出力するプログラムを作成してください。

### 入力仕様
標準入力から以下の4行が与えられます。
1. 氏名（文字列）
2. 年齢（整数）
3. 評価スコア（小数）
4. 在籍中フラグ（\`true\` または \`false\`）

### 出力仕様
\`\`\`
Name: <氏名>
Age: <年齢>
Score: <評価スコア>
Active: <在籍中フラグ>
\`\`\``,
    difficulty: "easy",
    estimated_minutes: 8,
    tags: ["出力と変数", "データ型"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        int age = Integer.parseInt(sc.nextLine());
        double score = Double.parseDouble(sc.nextLine());
        boolean active = Boolean.parseBoolean(sc.nextLine());

        // ここに出力処理を記述してください
    }
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `Javaの基本データ型（\`int\`, \`double\`, \`boolean\`）と参照型（\`String\`）を文字列結合演算子 \`+\` で連結して出力します。`,
    order_index: 4,
    test_cases: [
      {
        name: "公開テスト1：標準社員データ",
        input: "Tanaka\n25\n4.5\ntrue\n",
        expected_output: "Name: Tanaka\nAge: 25\nScore: 4.5\nActive: true",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：別社員データ",
        input: "Sato\n31\n3.8\nfalse\n",
        expected_output: "Name: Sato\nAge: 31\nScore: 3.8\nActive: false",
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      { step_number: 1, content_md: "文字列と変数を `+` でつないで `System.out.println` に渡します。" },
      { step_number: 2, content_md: "コロン `:` の後ろに半角スペースが1つ入っている点に注意してください。" },
      { step_number: 3, content_md: "`System.out.println(\"Name: \" + name);` の形式で4行出力します。" },
    ],
  },
  {
    id: EXTRA_JAVA_PROBLEM_IDS.introTax,
    chapter_id: "22222222-2222-4222-8222-222222222201",
    lesson_id: "33333333-3333-4333-8333-333333333301",
    language: "java",
    title: "1-5. 消費税（10%）込みの商品合計金額計算",
    description_md: `### 問題概要
商品の単価（円）と購入個数を受け取り、税抜合計金額と **消費税10%込みの税込金額（小数点以下切り捨て）** を出力してください。

### 入力仕様
標準入力から2つの整数がスペース区切りで与えられます。
\`<単価> <個数>\`

### 出力仕様
\`\`\`
Subtotal: <税抜合計>
Total: <税込合計>
\`\`\``,
    difficulty: "easy",
    estimated_minutes: 10,
    tags: ["出力と変数", "四則演算"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int price = sc.nextInt();
        int qty = sc.nextInt();

        // 税抜合計と税込合計（10%、切り捨て）を計算して出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `浮動小数点（\`double\`）の誤差を避けるため、実務の金額計算では \`(subtotal * 110) / 100\` のように整数演算で切り捨て計算を行うのが安全です。`,
    order_index: 5,
    test_cases: [
      {
        name: "公開テスト1：1000円×3個",
        input: "1000 3\n",
        expected_output: "Subtotal: 3000\nTotal: 3300",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：端数切り捨て検証",
        input: "125 3\n",
        expected_output: "Subtotal: 375\nTotal: 412",
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      { step_number: 1, content_md: "税抜合計は `price * qty` で求められます。" },
      { step_number: 2, content_md: "税込10%（切り捨て）は `(subtotal * 110) / 100` で正確に計算できます。" },
      { step_number: 3, content_md: "`Subtotal: ` と `Total: ` をそれぞれ出力してください。" },
    ],
  },
  {
    id: EXTRA_JAVA_PROBLEM_IDS.introShipping,
    chapter_id: "22222222-2222-4222-8222-222222222202",
    lesson_id: "33333333-3333-4333-8333-333333333302",
    language: "java",
    title: "2-4. 会員ランクと割引適用の複合条件判定（AND / OR）",
    description_md: `### 問題概要
ECサイトの送料無料・割引判定を実装してください。
購入金額（円）とプレミアム会員フラグ（1＝プレミアム会員、0＝通常会員）が与えられます。

### 判定ルール
- プレミアム会員 **または** 購入金額が \`5000\` 円以上の場合：\`FREE_SHIPPING\`
- それ以外の場合：\`STANDARD_SHIPPING\``,
    difficulty: "easy",
    estimated_minutes: 10,
    tags: ["条件分岐", "論理演算"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int amount = sc.nextInt();
        int isPremium = sc.nextInt();

        // 複合条件で判定して出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `「A または B」は論理和演算子 \`||\` を使います。業務システムでは境界値（ちょうど5000円）を \`>=\` で含めるかどうかが重要です。`,
    order_index: 4,
    test_cases: [
      {
        name: "公開テスト1：通常会員・5000円以上",
        input: "5000 0\n",
        expected_output: "FREE_SHIPPING",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：プレミアム会員・2000円",
        input: "2000 1\n",
        expected_output: "FREE_SHIPPING",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：通常会員・4999円",
        input: "4999 0\n",
        expected_output: "STANDARD_SHIPPING",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "送料無料になる条件が「どちらか一方を満たせばよい（論理和）」なのか「両方必須（論理積）」なのかを問題文から整理しましょう。",
      },
      {
        step_number: 2,
        content_md: "Javaの論理演算子（`||` / `&&`）と比較演算子を組み合わせて、2つの条件を1つの `if` 文にまとめます。",
      },
      {
        step_number: 3,
        content_md: "境界値（ちょうど基準金額のとき、通常会員かつ基準未満のとき）が仕様通りの文字列を出力するか確認してください。",
      },
    ],
  },
  {
    id: EXTRA_JAVA_PROBLEM_IDS.introHttpSwitch,
    chapter_id: "22222222-2222-4222-8222-222222222202",
    lesson_id: "33333333-3333-4333-8333-333333333302",
    language: "java",
    title: "2-5. HTTPステータスコードの種別判定（switch文）",
    description_md: `### 問題概要
HTTPステータスコード（整数）を受け取り、\`switch\` 文を使って対応するメッセージを出力してください。

### 対応表
- \`200\` → \`OK\`
- \`201\` → \`CREATED\`
- \`400\` → \`BAD_REQUEST\`
- \`404\` → \`NOT_FOUND\`
- \`500\` → \`INTERNAL_SERVER_ERROR\`
- それ以外 → \`UNKNOWN\``,
    difficulty: "easy",
    estimated_minutes: 10,
    tags: ["条件分岐", "switch文"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int code = sc.nextInt();

        // switch文でステータス名を表示してください
    }
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `特定の固定値による多岐分岐では \`switch\` 文を使うと可読性が高まります。各 \`case\` の末尾に \`break;\` を忘れると次の処理へ突き抜ける（フォールスルー）ので注意しましょう。`,
    order_index: 5,
    test_cases: [
      {
        name: "公開テスト1：200 OK",
        input: "200\n",
        expected_output: "OK",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：404 Not Found",
        input: "404\n",
        expected_output: "NOT_FOUND",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：未定義コード",
        input: "418\n",
        expected_output: "UNKNOWN",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "値ごとの固定分岐には `switch` 文を使うと、複数のステータスコードを見通しよく整理できます。",
      },
      {
        step_number: 2,
        content_md: "想定されている各ステータスコードに対応する分岐と、どれにも当てはまらない場合の既定分岐（`default`）を用意しましょう。",
      },
      {
        step_number: 3,
        content_md: "各分岐の末尾に `break` を書き忘れると次の分岐まで実行されてしまう（フォールスルー）ので注意してください。",
      },
    ],
  },

  // ===========================================================================
  // Java初級コース（4問：二次元配列 / オーバーロード / static / インターフェース）
  // ===========================================================================
  {
    id: EXTRA_JAVA_PROBLEM_IDS.begMatrixSales,
    chapter_id: "bf20e7ec-5d77-4543-bb06-f1a260271b59",
    lesson_id: "5347964f-04df-4e46-ae8a-a654826f9d73",
    language: "java",
    title: "初級 1-1. 店舗別・日別売上の二次元配列集計",
    description_md: `### 問題概要
\`R\` 店舗 × \`C\` 日間の売上データを二次元配列に読み込み、各店舗の合計売上と全店舗の総合計売上を出力してください。

### 入力仕様
- 1行目：店舗数 \`R\` と日数 \`C\`
- 続く \`R\` 行：各店舗の \`C\` 日分の売上（整数）

### 出力仕様
- 各店舗ごとに \`Store <番号>: <店舗合計>\`（番号は1始まり）
- 最後に \`GrandTotal: <総合計>\``,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["配列", "二次元配列"],
    starter_code: `import java.util.Scanner;

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
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `外側のループで行（店舗）を回し、内側のループで列（日数）を加算することで、表形式データの行合計と総計を効率よく求められます。`,
    order_index: 1,
    test_cases: [
      {
        name: "公開テスト1：2店舗×3日間",
        input: "2 3\n100 200 300\n150 250 100\n",
        expected_output: "Store 1: 600\nStore 2: 500\nGrandTotal: 1100",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：3店舗×2日間",
        input: "3 2\n50 50\n100 200\n300 400\n",
        expected_output: "Store 1: 100\nStore 2: 300\nStore 3: 700\nGrandTotal: 1100",
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "二重ループを使い、外側のループで「店舗（行）」、内側のループで「日別売上（列）」を順番に集計する構造を組み立てましょう。",
      },
      {
        step_number: 2,
        content_md: "店舗ごとの小計変数は「外側ループの開始ごとに初期化」、全店舗の総合計変数は「外側ループの外で初期化」するのがポイントです。",
      },
      {
        step_number: 3,
        content_md: "店舗番号は0始まりではなく1始まりで表示される点と、出力ラベルの綴り・空白を確認してください。",
      },
    ],
  },
  {
    id: EXTRA_JAVA_PROBLEM_IDS.begOverload,
    chapter_id: "bf20e7ec-5d77-4543-bb06-f1a260271b59",
    lesson_id: "5347964f-04df-4e46-ae8a-a654826f9d73",
    language: "java",
    title: "初級 1-2. 割引計算メソッドのオーバーロード設計",
    description_md: `### 問題概要
同じメソッド名 \`calcPrice\` を引数の個数違いで2つ定義（オーバーロード）してください。
1. \`calcPrice(int price)\`：標準税率10%込みの価格（\`(price * 110) / 100\`）を返す
2. \`calcPrice(int price, int discount)\`：\`price - discount\` に対して税率10%込みの価格を返す（割引後が0未満の場合は0とする）

### 入力仕様
標準入力から \`price\` と \`discount\` の2整数が与えられます。

### 出力仕様
1行目に \`calcPrice(price)\`、2行目に \`calcPrice(price, discount)\` の結果を出力してください。`,
    difficulty: "medium",
    estimated_minutes: 12,
    tags: ["メソッド", "オーバーロード"],
    starter_code: `import java.util.Scanner;

public class Main {
    // ここに calcPrice メソッドを2つオーバーロード定義してください

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int price = sc.nextInt();
        int discount = sc.nextInt();
        System.out.println(calcPrice(price));
        System.out.println(calcPrice(price, discount));
    }
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `オーバーロードを使うことで、呼び出し側は割引の有無を意識せず同じ \`calcPrice\` 名で直感的に呼び出せます。2引数版から1引数版を呼び出すと計算ロジックの重複も防げます。`,
    order_index: 2,
    test_cases: [
      {
        name: "公開テスト1：2000円・500円引き",
        input: "2000 500\n",
        expected_output: "2200\n1650",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：割引額が元値以上",
        input: "1000 1500\n",
        expected_output: "1100\n0",
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "同じメソッド名でも引数の個数が異なれば別メソッドとして定義できる「オーバーロード」を活用しましょう。",
      },
      {
        step_number: 2,
        content_md: "割引あり版では、割引額が元の価格を上回った場合に結果がマイナスにならないよう下限チェックを入れてください。",
      },
      {
        step_number: 3,
        content_md: "割引なし版と割引あり版で共通する計算ロジックがあれば、片方からもう片方を呼び出すと重複を減らせます。",
      },
    ],
  },
  {
    id: EXTRA_JAVA_PROBLEM_IDS.begStaticTicket,
    chapter_id: "f62233bb-0095-4a76-80d3-6a70846ee360",
    lesson_id: "41302b0f-c345-4660-9dfe-6cf806c97783",
    language: "java",
    title: "初級 2-1. static フィールドによる自動採番チケット管理クラス",
    description_md: `### 問題概要
インスタンスを生成するたびに \`1\` から連番のチケットIDを自動採番する \`Ticket\` クラスを実装してください。

### 仕様
- \`private static int nextId = 1;\` を持つ
- コンストラクタ \`Ticket(String title)\` で現在の \`nextId\` を自分の \`id\` に割り当て、\`nextId\` を1増やす
- \`getLabel()\` メソッドは \`"#<id> <title>"\` を返す
- 最後に生成された総チケット数を \`Ticket.getIssuedCount()\`（staticメソッド）で返す

### 入力仕様
- 1行目：件数 \`N\`
- 続く \`N\` 行：チケットタイトル`,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["クラスとオブジェクト", "static"],
    starter_code: `import java.util.Scanner;

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
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `\`static\` フィールドはクラス全体で1つだけ共有されるため、複数インスタンスにまたがる連番管理や件数カウントに利用されます。`,
    order_index: 1,
    test_cases: [
      {
        name: "公開テスト1：3件のチケット発番",
        input: "3\nLogin Bug\nAdd API\nFix SQL\n",
        expected_output: "#1 Login Bug\n#2 Add API\n#3 Fix SQL\nTotal: 3",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：1件のみ",
        input: "1\nDeploy\n",
        expected_output: "#1 Deploy\nTotal: 1",
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "インスタンスごとに持つ値（個別ID・タイトル）と、クラス全体で共有する値（次に採番する連番）を分けて考えましょう。",
      },
      {
        step_number: 2,
        content_md: "共有カウンタには `static` フィールドを使い、コンストラクタが呼ばれるたびに採番とカウントアップを行います。",
      },
      {
        step_number: 3,
        content_md: "これまで発行された総件数を返す静的メソッドで、初期値と採番タイミングによる1ズレが起きないか確認してください。",
      },
    ],
  },
  {
    id: EXTRA_JAVA_PROBLEM_IDS.begPaymentInterface,
    chapter_id: "f62233bb-0095-4a76-80d3-6a70846ee360",
    lesson_id: "41302b0f-c345-4660-9dfe-6cf806c97783",
    language: "java",
    title: "初級 2-2. 決済インターフェースとポリモーフィズム（第1回実技レベル）",
    description_md: `### 問題概要
複数の決済手段を統一的に扱う \`Payment\` インターフェースと2つの実装クラスを作成してください。

### 仕様
- インターフェース \`Payment\`：\`int calcFee(int amount);\` を定義
- \`CreditCardPayment\` クラス（\`implements Payment\`）：決済手数料は金額の **3%**（\`(amount * 3) / 100\`）
- \`BankTransferPayment\` クラス（\`implements Payment\`）：決済手数料は一律 **220円**（ただし金額が0以下の場合は0円）

### 入力仕様
- 1行目：決済方式（\`CARD\` または \`BANK\`）
- 2行目：決済金額（整数）

### 出力仕様
\`Fee: <手数料>\` を出力してください。`,
    difficulty: "hard",
    estimated_minutes: 15,
    tags: ["クラスとオブジェクト", "ポリモーフィズム"],
    starter_code: `import java.util.Scanner;

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
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `呼び出し側は \`Payment\` インターフェース型で受け取るため、新しい決済手段が増えても \`payment.calcFee(amount)\` の呼び出しコードを変更せずに拡張できます。これがSpring BootのDI設計の基礎になります。`,
    order_index: 2,
    test_cases: [
      {
        name: "公開テスト1：クレジットカード 10000円",
        input: "CARD 10000\n",
        expected_output: "Fee: 300",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：銀行振込 5000円",
        input: "BANK 5000\n",
        expected_output: "Fee: 220",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：銀行振込 0円",
        input: "BANK 0\n",
        expected_output: "Fee: 0",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "共通のインターフェースを各決済クラスで実装することで、呼び出し側は具体的な決済手段を意識せず同じメソッド名で処理できます。",
      },
      {
        step_number: 2,
        content_md: "決済手段ごとに異なる手数料ルール（割合計算か固定額か、0円以下のときの扱い）を各クラスの実装メソッド内に閉じ込めましょう。",
      },
      {
        step_number: 3,
        content_md: "割合計算を整数で行う場合、先に掛け算してから割り算しないと途中で0に切り捨てられてしまう点に注意してください。",
      },
    ],
  },

  // ===========================================================================
  // Java中級コース（4問：ArrayList / HashMap / CSVパース / 例外処理）
  // ===========================================================================
  {
    id: EXTRA_JAVA_PROBLEM_IDS.intArrayListSearch,
    chapter_id: "f0721c45-037c-49d0-8393-98bb86ce3523",
    lesson_id: "1177c80b-bcc9-4745-a4f8-7caf1ef01327",
    language: "java",
    title: "中級 1-1. ArrayList による顧客名の検索フィルタリング",
    description_md: `### 問題概要
\`ArrayList<String>\` に登録された顧客名一覧から、指定キーワードを含む顧客名だけを順番に出力してください。1件も一致しない場合は \`NOT_FOUND\` を出力します。

### 入力仕様
- 1行目：顧客数 \`N\`
- 続く \`N\` 行：顧客名
- 最終行：検索キーワード`,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["コレクション", "ArrayList"],
    starter_code: `import java.util.ArrayList;
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
}`,
    solution_code: `import java.util.ArrayList;
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
}`,
    explanation_md: `\`ArrayList\` の要素数は \`size()\`、要素取得は \`get(i)\` を使います。部分一致検索には \`String#contains(keyword)\` が便利です。`,
    order_index: 1,
    test_cases: [
      {
        name: "公開テスト1：Techを含む企業を検索",
        input: "3\nACME Tech\nGlobal Corp\nNext Tech\nTech\n",
        expected_output: "ACME Tech\nNext Tech",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：該当なし",
        input: "2\nAlpha\nBeta\nGamma\n",
        expected_output: "NOT_FOUND",
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "登録された顧客名を `ArrayList` に格納し、先頭から順に部分一致する要素だけを抽出して出力する流れを組み立てましょう。",
      },
      {
        step_number: 2,
        content_md: "文字列に特定キーワードが含まれるかどうかの判定には、`String` クラスの検索系メソッドが活用できます。",
      },
      {
        step_number: 3,
        content_md: "1件も一致しなかった場合にだけ専用メッセージを出すため、ヒット件数を数えるカウンタ（またはフラグ）を用意してください。",
      },
    ],
  },
  {
    id: EXTRA_JAVA_PROBLEM_IDS.intHashMapSales,
    chapter_id: "f0721c45-037c-49d0-8393-98bb86ce3523",
    lesson_id: "1177c80b-bcc9-4745-a4f8-7caf1ef01327",
    language: "java",
    title: "中級 1-2. HashMap による商品カテゴリ別売上集計",
    description_md: `### 問題概要
\`N\` 件の売上レコード（カテゴリ名と金額）を \`HashMap<String, Integer>\` で集計し、最後に指定された対象カテゴリの合計金額を出力してください（存在しないカテゴリは \`0\`）。

### 入力仕様
- 1行目：レコード数 \`N\`
- 続く \`N\` 行：\`<カテゴリ名> <金額>\`
- 最終行：集計を確認したい対象カテゴリ名`,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["コレクション", "HashMap"],
    starter_code: `import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        HashMap<String, Integer> map = new HashMap<>();
        // ここに集計処理を記述してください
    }
}`,
    solution_code: `import java.util.HashMap;
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
}`,
    explanation_md: `\`HashMap\` で集計するときは \`containsKey\` で既存値を確認してから加算して \`put\` するのが定番のイディオムです。`,
    order_index: 2,
    test_cases: [
      {
        name: "公開テスト1：Foodの合計集計",
        input: "4\nFood 500\nBook 1200\nFood 800\nDrink 300\nFood\n",
        expected_output: "1300",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：未登録カテゴリ",
        input: "2\nFood 500\nBook 1000\nElectronics\n",
        expected_output: "0",
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "カテゴリ名をキー、売上累計を値として保持する `HashMap` を使うと、カテゴリが増減しても柔軟に集計できます。",
      },
      {
        step_number: 2,
        content_md: "同じカテゴリが複数回登場したときは、すでに登録済みの累計額を取り出して今回の金額を加算し、上書き保存します。",
      },
      {
        step_number: 3,
        content_md: "最後に照会するカテゴリが一度も登場していない場合のデフォルト出力（0など）を忘れずに処理してください。",
      },
    ],
  },
  {
    id: EXTRA_JAVA_PROBLEM_IDS.intCsvParse,
    chapter_id: "7bb76c60-bac2-408b-a0f5-cb69f0546f13",
    lesson_id: "06f2d4e3-729c-4392-8945-9af33d7833e5",
    language: "java",
    title: "中級 2-1. CSV注文データのパースと合計金額計算",
    description_md: `### 問題概要
\`商品名,単価,個数\` の形式で与えられるCSV行を \`split(",")\` で分割し、全注文の合計金額を算出してください。

### 入力仕様
- 1行目：行数 \`N\`
- 続く \`N\` 行：\`<商品名>,<単価>,<個数>\`（余分な空白が含まれる場合があるため \`trim()\` で除去すること）

### 出力仕様
\`TotalAmount: <合計金額>\``,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["標準API", "CSV処理"],
    starter_code: `import java.util.Scanner;

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
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `業務バッチ処理で頻出するCSV読み込みでは、\`split(",")\` で列配列に分解し、前後空白を \`trim()\` で取り除いてから数値変換するのが鉄則です。`,
    order_index: 1,
    test_cases: [
      {
        name: "公開テスト1：3行のCSV注文",
        input: "3\nPen,120,5\nNotebook, 250, 2\nEraser,80,3\n",
        expected_output: "TotalAmount: 1340",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：1行のみ",
        input: "1\nMonitor, 32000, 2\n",
        expected_output: "TotalAmount: 64000",
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "1行のCSV文字列をカンマ区切りで配列に分割し、各列の役割（商品名・単価・数量など）に応じて取り出しましょう。",
      },
      {
        step_number: 2,
        content_md: "分割直後の各項目は文字列型（`String`）なので、計算に使う数値列は整数型へ変換する必要があります。",
      },
      {
        step_number: 3,
        content_md: "前後に空白が含まれる可能性や、行ごとの小計を全体合計へ加算し忘れていないかを確認してください。",
      },
    ],
  },
  {
    id: EXTRA_JAVA_PROBLEM_IDS.intExceptionStock,
    chapter_id: "7bb76c60-bac2-408b-a0f5-cb69f0546f13",
    lesson_id: "06f2d4e3-729c-4392-8945-9af33d7833e5",
    language: "java",
    title: "中級 2-2. 例外処理（try-catch / throw）による安全な在庫引当",
    description_md: `### 問題概要
在庫数 \`stock\` から出庫数 \`qty\` を引き当てるメソッド \`allocate(int stock, int qty)\` を実装してください。

### 仕様
- \`qty <= 0\` の場合：\`IllegalArgumentException("INVALID_QTY")\` を \`throw\` する
- \`qty > stock\` の場合：\`IllegalStateException("OUT_OF_STOCK")\` を \`throw\` する
- 正常時：残在庫 \`stock - qty\` を返す
- \`main\` メソッドで \`try-catch\` し、正常時は \`Remaining: <残在庫>\`、例外時は \`Error: <例外メッセージ>\` を出力してください。`,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["例外処理", "try-catch"],
    starter_code: `import java.util.Scanner;

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
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `不正な引数には \`IllegalArgumentException\`、状態不整合（在庫不足など）には \`IllegalStateException\` を投げるのがJava実務の標準プラクティスです。`,
    order_index: 2,
    test_cases: [
      {
        name: "公開テスト1：正常引当",
        input: "10 3\n",
        expected_output: "Remaining: 7",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：在庫不足",
        input: "5 8\n",
        expected_output: "Error: OUT_OF_STOCK",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：不正数量（0以下）",
        input: "10 0\n",
        expected_output: "Error: INVALID_QTY",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "不正な引数（0以下など）と、現在の業務状態によるエラー（在庫不足）を別の例外クラスで投げ分ける設計を考えましょう。",
      },
      {
        step_number: 2,
        content_md: "入力値の妥当性チェックを先に行い、続いて在庫数との比較チェック、最後に正常系の残数返却という順序で整理します。",
      },
      {
        step_number: 3,
        content_md: "呼び出し側で例外の種類ごとに適切にキャッチされるよう、スローする例外クラス名とメッセージが仕様と一致しているか確認してください。",
      },
    ],
  },

  // ===========================================================================
  // Java上級コース（4問：DAOパターン / APIバリデーション / 顧客案件ロジック / 単体テスト）
  // ===========================================================================
  {
    id: EXTRA_JAVA_PROBLEM_IDS.advCustomerDao,
    chapter_id: "b5486a57-160b-4bb3-9d1b-f5e9f7cc6590",
    lesson_id: "d62467af-4c0c-45b3-be32-3224f0765b0d",
    language: "java",
    title: "上級 1-1. DAOパターンによる顧客CRUDリポジトリ実装",
    description_md: `### 問題概要
データベース層を模した \`CustomerDao\` クラスを実装し、コマンド（\`ADD\`, \`GET\`, \`DEL\`）を処理してください。

### 仕様
- \`save(int id, String name)\`：顧客を登録または上書き更新する
- \`findById(int id)\`：顧客名を返す（未登録時は \`"NOT_FOUND"\`）
- \`deleteById(int id)\`：該当顧客を削除する

### 入力仕様
- 1行目：操作回数 \`Q\`
- 続く \`Q\` 行：\`ADD <id> <name>\` / \`GET <id>\` / \`DEL <id>\``,
    difficulty: "hard",
    estimated_minutes: 20,
    tags: ["DAO設計", "コレクション"],
    starter_code: `import java.util.HashMap;
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
}`,
    solution_code: `import java.util.HashMap;
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
}`,
    explanation_md: `DAO（Data Access Object）に永続化操作（CRUD）を閉じ込めることで、将来的に保存先が \`HashMap\` から PostgreSQL（JDBC / Spring Data JPA）へ変わっても業務ロジック層への影響を最小限にできます。`,
    order_index: 1,
    test_cases: [
      {
        name: "公開テスト1：登録→取得→削除→再取得",
        input: "5\nADD 1 ACME\nGET 1\nDEL 1\nGET 1\nGET 2\n",
        expected_output: "ACME\nNOT_FOUND\nNOT_FOUND",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：上書き更新検証",
        input: "4\nADD 10 OldCorp\nADD 10 NewCorp\nGET 10\nDEL 10\n",
        expected_output: "NewCorp",
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "データ保存層（DAO）の内部に `HashMap` を持たせ、登録・更新・検索・削除の各操作をメソッドとして切り出しましょう。",
      },
      {
        step_number: 2,
        content_md: "新規登録と既存更新は、同じキーに対する上書き挙動を利用すると1つの保存メソッドで統一的に扱えます。",
      },
      {
        step_number: 3,
        content_md: "存在しないIDで検索されたときの戻り値や、削除後に再検索したときの挙動が仕様通りか確認してください。",
      },
    ],
  },
  {
    id: EXTRA_JAVA_PROBLEM_IDS.advApiValidation,
    chapter_id: "b5486a57-160b-4bb3-9d1b-f5e9f7cc6590",
    lesson_id: "d62467af-4c0c-45b3-be32-3224f0765b0d",
    language: "java",
    title: "上級 1-2. REST API入力バリデーション＆ステータス判定",
    description_md: `### 問題概要
顧客登録API（\`POST /api/customers\`）の入力バリデーションを実装してください。

### 検証ルール（優先順ではなく全エラーを判定し、エラーが1件でもあれば 400）
1. 会社名（\`name\`）：前後空白除去後に空文字の場合はエラー（\`NAME_REQUIRED\`）
2. メール（\`email\`）：\`@\` を含まない場合はエラー（\`INVALID_EMAIL\`）

### 出力仕様
- エラーがない場合：\`201 CREATED\`
- エラーがある場合：1行目に \`400 BAD_REQUEST\`、2行目以降に該当エラーコードを順番に出力`,
    difficulty: "hard",
    estimated_minutes: 15,
    tags: ["バリデーション", "API設計"],
    starter_code: `import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        String email = sc.nextLine();

        ArrayList<String> errors = new ArrayList<>();
        // バリデーションを実装してください
    }
}`,
    solution_code: `import java.util.ArrayList;
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
}`,
    explanation_md: `実務のAPIバリデーションでは最初の1件で止めず、複数項目の入力不備をリストにまとめて \`400 BAD_REQUEST\` で返却するのがフロントエンドにとって親切な設計です。`,
    order_index: 2,
    test_cases: [
      {
        name: "公開テスト1：正常入力",
        input: "ACME Corp\nhr@acme.example.com\n",
        expected_output: "201 CREATED",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：両方エラー",
        input: "   \ninvalid-email\n",
        expected_output: "400 BAD_REQUEST\nNAME_REQUIRED\nINVALID_EMAIL",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：メールのみエラー",
        input: "NextSys\nnextsys.jp\n",
        expected_output: "400 BAD_REQUEST\nINVALID_EMAIL",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "複数の入力チェックを1つずつ実行し、違反があればエラーリストへ蓄積していく方式にすると、全エラーをまとめて返せます。",
      },
      {
        step_number: 2,
        content_md: "氏名の空文字・空白のみチェックや、メールアドレスの形式チェックには `String` の標準メソッドを活用しましょう。",
      },
      {
        step_number: 3,
        content_md: "すべてのチェックを終えたあと、エラーリストが空かどうかで成功ステータスと失敗ステータスを切り替えます。",
      },
    ],
  },
  {
    id: EXTRA_JAVA_PROBLEM_IDS.advDealService,
    chapter_id: "446172d3-98c4-4c34-8277-7973f5953a36",
    lesson_id: "3f313153-e5f5-466a-b5f2-51a43cefbf1d",
    language: "java",
    title: "上級 2-1. 顧客・案件管理サービス：受注済み案件の合計予算集計",
    description_md: `### 問題概要
最終模擬プロジェクト「顧客・案件管理システム」のService層ロジックを実装します。
\`N\` 件の案件データ（\`案件名 ステータス 予算(万円)\`）を受け取り、ステータスが \`WON\`（受注済み）の案件件数と合計予算を出力してください。

### 出力仕様
\`\`\`
WonCount: <件数>
WonBudget: <合計予算>
\`\`\``,
    difficulty: "hard",
    estimated_minutes: 15,
    tags: ["実務プロジェクト", "Service設計"],
    starter_code: `import java.util.ArrayList;
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
}`,
    solution_code: `import java.util.ArrayList;
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
}`,
    explanation_md: `エンティティクラス（\`Deal\`）のリストを走査し、文字列比較には必ず \`equals\` を使ってステータス判定を行います。`,
    order_index: 1,
    test_cases: [
      {
        name: "公開テスト1：4案件中2件受注",
        input: "4\nCRM WON 500\nERP OPEN 1200\nWebAPI WON 300\nMobile LOST 400\n",
        expected_output: "WonCount: 2\nWonBudget: 800",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：受注0件",
        input: "2\nA OPEN 100\nB LOST 200\n",
        expected_output: "WonCount: 0\nWonBudget: 0",
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "案件リストを走査し、指定されたステータスに一致する案件だけを抽出して件数と予算合計をそれぞれ集計しましょう。",
      },
      {
        step_number: 2,
        content_md: "Javaで文字列の中身が一致するかを比較する際は、参照比較（`==`）ではなく値比較メソッドを使う点に注意してください。",
      },
      {
        step_number: 3,
        content_md: "対象案件が0件のケースでもエラーにならず、件数0・合計0が正しく出力されるか確認しましょう。",
      },
    ],
  },
  {
    id: EXTRA_JAVA_PROBLEM_IDS.advBoundaryTest,
    chapter_id: "446172d3-98c4-4c34-8277-7973f5953a36",
    lesson_id: "3f313153-e5f5-466a-b5f2-51a43cefbf1d",
    language: "java",
    title: "上級 2-2. 境界値・異常系を含む単体テスト検証メソッドの実装",
    description_md: `### 問題概要
年齢 \`age\` がサービス利用可能範囲（\`18\`歳以上 \`65\`歳以下）かを判定する \`isEligible(int age)\` メソッドを実装し、入力された境界値テストケース群に対して \`PASS\` / \`FAIL\` を検証してください。

### 仕様
- \`isEligible(int age)\`：\`18 <= age && age <= 65\` なら \`true\`、それ以外は \`false\`
- 入力の1行目にテストケース数 \`T\`、続く \`T\` 行に \`<入力年齢> <期待値(true/false)>\` が与えられます。
- 各ケースで \`isEligible(age) == expected\` なら \`PASS\`、異なれば \`FAIL\` と出力してください。`,
    difficulty: "medium",
    estimated_minutes: 12,
    tags: ["単体テスト", "境界値分析"],
    starter_code: `import java.util.Scanner;

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
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `境界値テストでは、下限の前後（\`17\`, \`18\`）と上限の前後（\`65\`, \`66\`）、および異常値（\`-1\`）を必ずテストケースに含めることでオフバイワンバグ（\`>\` と \`>=\` の取り違え）を防ぎます。`,
    order_index: 2,
    test_cases: [
      {
        name: "公開テスト1：境界値フルセット（17, 18, 65, 66）",
        input: "4\n17 false\n18 true\n65 true\n66 false\n",
        expected_output: "PASS\nPASS\nPASS\nPASS",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：負数と中間値",
        input: "2\n-1 false\n30 true\n",
        expected_output: "PASS\nPASS",
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "境界値分析の基本として「下限ちょうど」「下限の1つ下」「上限ちょうど」「上限の1つ上」の4パターンを意識しましょう。",
      },
      {
        step_number: 2,
        content_md: "「以上」「以下」を含む範囲判定では、比較演算子に等号（`=`）が含まれているかが重要なチェックポイントです。",
      },
      {
        step_number: 3,
        content_md: "条件を満たす範囲を1つの論理式で簡潔に表現し、境界の前後で期待通りの真偽値が返るか検証してください。",
      },
    ],
  },

  // ===========================================================================
  // 追加問題：Java初級（+2問）
  // ===========================================================================
  {
    id: EXTRA_JAVA_PROBLEM_IDS.begArraySortMedian,
    chapter_id: "bf20e7ec-5d77-4543-bb06-f1a260271b59",
    lesson_id: "5347964f-04df-4e46-ae8a-a654826f9d73",
    language: "java",
    title: "初級 1-3. 配列の昇順ソートと中央値（メソッド設計）",
    description_md: `### 問題概要
奇数個 \`N\` 個の整数を配列に読み込み、昇順（小さい順）に並び替えたうえで **最小値・中央値・最大値** を出力するプログラムを作成してください。

### 入力仕様
- 1行目：要素数 \`N\`（奇数）
- 2行目：\`N\` 個の整数（スペース区切り）

### 出力仕様
\`Min: <最小値>\`
\`Median: <中央値>\`
\`Max: <最大値>\``,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["配列", "アルゴリズム", "メソッド"],
    starter_code: `import java.util.Scanner;

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
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `配列は参照渡しのため、\`sortAsc(nums)\` メソッド内で要素を入れ替えると元の配列 \`nums\` 自体が昇順に並び替わります。昇順ソート後は先頭が最小値、\`nums[n / 2]\` が中央値、末尾 \`nums[n - 1]\` が最大値になります。`,
    order_index: 3,
    test_cases: [
      {
        name: "公開テスト1：5要素のソートと中央値",
        input: "5\n40 10 50 20 30\n",
        expected_output: "Min: 10\nMedian: 30\nMax: 50",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：負数を含む3要素",
        input: "3\n-5 100 0\n",
        expected_output: "Min: -5\nMedian: 0\nMax: 100",
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "中央値を求めるには、まず配列を小さい順（昇順）に並べ替える必要があります。並べ替え処理と中央値算出をメソッドに分けましょう。",
      },
      {
        step_number: 2,
        content_md: "要素数が奇数のときは真ん中の1要素、偶数のときは中央2要素の平均になるため、要素数の偶奇で分岐させます。",
      },
      {
        step_number: 3,
        content_md: "ソート処理では配列の範囲外アクセスが起きないようループ上限に注意し、要素数1や同値を含むケースでも確認してください。",
      },
    ],
  },
  {
    id: EXTRA_JAVA_PROBLEM_IDS.begSalaryPolymorphism,
    chapter_id: "f62233bb-0095-4a76-80d3-6a70846ee360",
    lesson_id: "41302b0f-c345-4660-9dfe-6cf806c97783",
    language: "java",
    title: "初級 2-3. 給与計算インターフェースと雇用形態別ポリモーフィズム",
    description_md: `### 問題概要
雇用形態によって給与計算ロジックが異なる社員を統一的に扱う \`Payable\` インターフェースと2つのクラスを実装してください。

### 仕様
- インターフェース \`Payable\`：\`int calcMonthlyPay();\` を定義
- \`FullTimeEmployee\`（\`implements Payable\`）：月給 \`baseSalary\` と残業時間 \`overtimeHours\` を受け取り、\`baseSalary + overtimeHours * 2500\` を返す
- \`PartTimeEmployee\`（\`implements Payable\`）：時給 \`hourlyWage\` と勤務時間 \`workHours\` を受け取り、\`hourlyWage * workHours\` を返す

### 入力仕様
- 1行目：種別（\`FULL\` または \`PART\`）
- 2行目：数値2つ（\`FULL\` なら \`基本給 残業時間\`、\`PART\` なら \`時給 勤務時間\`）

### 出力仕様
\`Pay: <月次支給額>\``,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["クラスとオブジェクト", "ポリモーフィズム"],
    starter_code: `import java.util.Scanner;

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
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `正社員とアルバイトで給与計算式が異なっても、共通の \`Payable\` インターフェースで扱うことで、呼び出し側は \`emp.calcMonthlyPay()\` だけで統一的に支給額を算出できます。`,
    order_index: 3,
    test_cases: [
      {
        name: "公開テスト1：正社員（基本給250000・残業10h）",
        input: "FULL 250000 10\n",
        expected_output: "Pay: 275000",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：アルバイト（時給1200・80h）",
        input: "PART 1200 80\n",
        expected_output: "Pay: 96000",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：正社員残業0h",
        input: "FULL 300000 0\n",
        expected_output: "Pay: 300000",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "正社員とアルバイトで異なる給与計算ロジックを、共通インターフェースの実装クラスとしてそれぞれ表現しましょう。",
      },
      {
        step_number: 2,
        content_md: "各クラスに必要な入力値をフィールドとして保持し、コンストラクタで受け取って計算メソッドから参照できるようにします。",
      },
      {
        step_number: 3,
        content_md: "インターフェース型の変数や配列として扱うことで、雇用形態が異なっても統一的に給与を取得・出力できることを確認してください。",
      },
    ],
  },

  // ===========================================================================
  // 追加問題：Java中級（+2問）
  // ===========================================================================
  {
    id: EXTRA_JAVA_PROBLEM_IDS.intWordFrequency,
    chapter_id: "f0721c45-037c-49d0-8393-98bb86ce3523",
    lesson_id: "1177c80b-bcc9-4745-a4f8-7caf1ef01327",
    language: "java",
    title: "中級 1-3. HashMap によるアクセスログ種別カウントと最多項目抽出",
    description_md: `### 問題概要
\`N\` 件のHTTPリクエストログのエンドポイント名（例：\`/login\`, \`/courses\`）を \`HashMap<String, Integer>\` で集計し、**最もアクセス回数が多いエンドポイント名とその回数** を出力してください（同数の場合は最初に最大回数に到達したものを出力）。

### 入力仕様
- 1行目：ログ件数 \`N\`
- 続く \`N\` 行：エンドポイント文字列（空白なし）

### 出力仕様
\`Top: <エンドポイント> (<回数>)\``,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["コレクション", "HashMap"],
    starter_code: `import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        HashMap<String, Integer> counts = new HashMap<>();

        // 各エンドポイントの出現回数を集計し、最多エンドポイントを求めてください
    }
}`,
    solution_code: `import java.util.HashMap;
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
}`,
    explanation_md: `\`HashMap\` で出現回数を更新しながら同時に暫定最大値 \`topCount\` と \`topPath\` を追跡することで、1回のループ（$O(N)$）で最頻出ログを効率よく抽出できます。`,
    order_index: 3,
    test_cases: [
      {
        name: "公開テスト1：5件のアクセスログ集計",
        input: "5\n/login\n/courses\n/login\n/profile\n/login\n",
        expected_output: "Top: /login (3)",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：別エンドポイントが最多",
        input: "4\n/api\n/home\n/home\n/api\n",
        expected_output: "Top: /home (2)",
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "アクセス先ごとの出現回数を `HashMap` で数えながら、同時に「現時点での最多アクセス先と回数」を追跡しましょう。",
      },
      {
        step_number: 2,
        content_md: "マップへ加算した直後の回数と現在の最大回数を比較し、上回ったときだけ最多情報を更新するとシンプルに書けます。",
      },
      {
        step_number: 3,
        content_md: "同率1位が発生した場合の優先ルール（最初に出現したものを優先するか等）が比較演算子（`>` か `>=` か）に反映されているか確認してください。",
      },
    ],
  },
  {
    id: EXTRA_JAVA_PROBLEM_IDS.intCustomException,
    chapter_id: "7bb76c60-bac2-408b-a0f5-cb69f0546f13",
    lesson_id: "06f2d4e3-729c-4392-8945-9af33d7833e5",
    language: "java",
    title: "中級 2-3. 例外処理（try-catch）による不正データ除外と安全集計",
    description_md: `### 問題概要
外部CSVから読み込んだ \`N\` 行の文字列データの中には、数値に変換できない不正行（例：\`N/A\`, \`error\`）が混ざっています。
\`Integer.parseInt\` の例外を \`try-catch\` で捕捉し、**有効な数値だけの合計値** と **スキップした不正行数** を出力してください。

### 入力仕様
- 1行目：行数 \`N\`
- 続く \`N\` 行：任意の文字列

### 出力仕様
\`Sum: <有効数値の合計>\`
\`Skipped: <不正行数>\``,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["例外処理", "try-catch", "標準API"],
    starter_code: `import java.util.Scanner;

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
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `実務のバッチ処理では1件の不正データで処理全体を止めないよう、ループの「内側」に \`try-catch\` を配置して不正行だけを安全にスキップ・件数記録する設計がよく使われます。`,
    order_index: 3,
    test_cases: [
      {
        name: "公開テスト1：不正データ2件を含む5行",
        input: "5\n100\nN/A\n250\nerror\n50\n",
        expected_output: "Sum: 400\nSkipped: 2",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：全件不正データ",
        input: "2\nabc\nxyz\n",
        expected_output: "Sum: 0\nSkipped: 2",
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "不正な数値データが含まれていてもループ全体が止まらないよう、1件ごとの変換処理を例外ハンドリングで囲みましょう。",
      },
      {
        step_number: 2,
        content_md: "正常に変換できた値だけを合計へ加算し、変換に失敗して例外が発生した件数を別のカウンタで記録します。",
      },
      {
        step_number: 3,
        content_md: "例外を握りつぶすだけでなく「何件スキップしたか」を仕様通りの形式で出力できているか確認してください。",
      },
    ],
  },

  // ===========================================================================
  // 追加問題：Java上級（+2問）
  // ===========================================================================
  {
    id: EXTRA_JAVA_PROBLEM_IDS.advPagination,
    chapter_id: "b5486a57-160b-4bb3-9d1b-f5e9f7cc6590",
    lesson_id: "d62467af-4c0c-45b3-be32-3224f0765b0d",
    language: "java",
    title: "上級 1-3. REST API ページネーション計算と対象ページ抽出",
    description_md: `### 問題概要
一覧API（\`GET /api/items?page=P&size=S\`）のページネーション処理を実装してください。
\`N\` 件のアイテム一覧から、指定された \`page\`（1始まり）と \`size\`（1ページあたりの件数）に該当するアイテムを順番に出力し、総ページ数も算出してください。

### 仕様
- 総ページ数 \`totalPages = (N + size - 1) / size\`（ただし \`N == 0\` のときは \`0\`）
- 1行目に \`Page: <page>/<totalPages>\` を出力
- 続く行に該当ページのアイテムを1行ずつ出力（該当アイテムが0件の場合は \`EMPTY\` を1行出力）

### 入力仕様
- 1行目：\`N page size\`
- 続く \`N\` 行：アイテム名`,
    difficulty: "hard",
    estimated_minutes: 20,
    tags: ["API設計", "コレクション"],
    starter_code: `import java.util.ArrayList;
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
}`,
    solution_code: `import java.util.ArrayList;
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
}`,
    explanation_md: `一覧APIのページネーションでは、切り上げ総ページ数 \`(n + size - 1) / size\` と開始インデックス \`(page - 1) * size\`、範囲外ページ指定時の安全ガード（\`start >= n\` で \`EMPTY\`）が実務の定番パターンです。`,
    order_index: 3,
    test_cases: [
      {
        name: "公開テスト1：5件中 2ページ目（size=2）",
        input: "5 2 2\nA\nB\nC\nD\nE\n",
        expected_output: "Page: 2/3\nC\nD",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：最終ページ（端数1件）",
        input: "5 3 2\nA\nB\nC\nD\nE\n",
        expected_output: "Page: 3/3\nE",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：範囲外ページ指定",
        input: "3 5 2\nX\nY\nZ\n",
        expected_output: "Page: 5/2\nEMPTY",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "ページネーションでは「総ページ数（切り上げ計算）」「開始インデックス」「終了インデックス」の3つを整理するのがコツです。",
      },
      {
        step_number: 2,
        content_md: "1始まりのページ番号を0始まりの配列インデックスへ変換し、最終ページで配列の末尾を超えないよう上限を制限しましょう。",
      },
      {
        step_number: 3,
        content_md: "0以下や総ページ数を超えるページ番号が指定された場合の異常系出力も忘れずに分岐させてください。",
      },
    ],
  },
  {
    id: EXTRA_JAVA_PROBLEM_IDS.advOrderStateMachine,
    chapter_id: "446172d3-98c4-4c34-8277-7973f5953a36",
    lesson_id: "3f313153-e5f5-466a-b5f2-51a43cefbf1d",
    language: "java",
    title: "上級 2-3. 注文ステータス遷移バリデーション（状態遷移設計）",
    description_md: `### 問題概要
EC・案件管理システムにおける注文ステータスの状態遷移ルールを検証する \`canTransition(String from, String to)\` メソッドを実装してください。

### 許可される遷移ルール
- \`DRAFT\` → \`CONFIRMED\` または \`CANCELLED\`
- \`CONFIRMED\` → \`SHIPPED\` または \`CANCELLED\`
- \`SHIPPED\` → \`DELIVERED\` のみ
- \`DELIVERED\` / \`CANCELLED\` → どこにも遷移不可（終端状態）

### 入力仕様
- 1行目：検証件数 \`T\`
- 続く \`T\` 行：\`<現在ステータス> <遷移先ステータス>\`

### 出力仕様
許可されていれば \`ALLOW\`、禁止されていれば \`DENY\` を1行ずつ出力してください。`,
    difficulty: "hard",
    estimated_minutes: 20,
    tags: ["Service設計", "実務プロジェクト", "単体テスト"],
    starter_code: `import java.util.Scanner;

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
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `業務システムでは「出荷済み（SHIPPED）からキャンセル（CANCELLED）へ戻す」といった不正な状態遷移をService層で確実に防ぐステートマシン設計が不可欠です。許可リスト（ホワイトリスト方式）で記述し、それ以外はすべて \`false\` にするのが安全な実装です。`,
    order_index: 3,
    test_cases: [
      {
        name: "公開テスト1：正常遷移と不正遷移の検証",
        input: "4\nDRAFT CONFIRMED\nCONFIRMED SHIPPED\nSHIPPED CANCELLED\nDELIVERED DRAFT\n",
        expected_output: "ALLOW\nALLOW\nDENY\nDENY",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：キャンセルと配達完了",
        input: "3\nDRAFT CANCELLED\nSHIPPED DELIVERED\nCANCELLED CONFIRMED\n",
        expected_output: "ALLOW\nALLOW\nDENY",
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "状態遷移バリデーションでは、許可されている「遷移元 → 遷移先」の組み合わせだけをホワイトリスト方式で定義すると安全です。",
      },
      {
        step_number: 2,
        content_md: "文字列比較のメソッドを使って現在のステータスと次のステータスの組み合わせを判定し、許可ルートのみ `true` を返します。",
      },
      {
        step_number: 3,
        content_md: "完了・キャンセル済みからの再遷移や、想定外の文字列が渡された場合はすべて拒否（`false`）になるよう末尾を閉じておきましょう。",
      },
    ],
  },
];
