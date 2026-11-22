import type { SeedProblem } from "@/lib/seed-data";

/**
 * Java入門コース 基礎強化ドリル（新規14問）
 * 既存16問（第1章5問・第2章5問・第3章3問・第4章3問）に各章3〜4問ずつ追加し、
 * Java入門コースを全30問の充実した基礎カリキュラムへ拡充します。
 * ※ヒントは2-4以降の非ネタバレ方針（思考誘導型）に準拠しています。
 */

const CH1_ID = "22222222-2222-4222-8222-222222222201";
const L1_ID = "33333333-3333-4333-8333-333333333301";
const CH2_ID = "22222222-2222-4222-8222-222222222202";
const L2_ID = "33333333-3333-4333-8333-333333333302";
const CH3_ID = "22222222-2222-4222-8222-222222222203";
const L3_ID = "33333333-3333-4333-8333-333333333303";
const CH4_ID = "22222222-2222-4222-8222-222222222204";
const L4_ID = "33333333-3333-4333-8333-333333333304";

export const JAVA_INTRO_EXTRA_PROBLEMS: SeedProblem[] = [
  // =========================================================================
  // 第1章 基礎強化（1-6 〜 1-9）
  // =========================================================================
  {
    id: "44444444-4444-4444-8444-444444442101",
    chapter_id: CH1_ID,
    lesson_id: L1_ID,
    language: "java",
    title: "1-6. 整数の割り算と余り（/ と %）による割り勘計算",
    description_md: `## 問題文
合計金額 \`total\`（円）と人数 \`people\`（人）が標準入力から2行で与えられます。
1人あたりの支払額（整数・切り捨て）と、割り切れなかった余りの金額を計算し、以下の形式で出力してください。

### 出力形式
\`\`\`
1人あたり: <支払額>円
余り: <余り>円
\`\`\`

### 入力例
\`\`\`
10000
3
\`\`\`

### 出力例
\`\`\`
1人あたり: 3333円
余り: 1円
\`\`\``,
    difficulty: "easy",
    estimated_minutes: 10,
    tags: ["出力と変数", "四則演算", "剰余"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int total = sc.nextInt();
        int people = sc.nextInt();
        // ここに計算と出力を記述してください
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int total = sc.nextInt();
        int people = sc.nextInt();
        int perPerson = total / people;
        int remainder = total % people;
        System.out.println("1人あたり: " + perPerson + "円");
        System.out.println("余り: " + remainder + "円");
    }
}`,
    explanation_md: "Javaで `int` 同士を `/` で割ると小数点以下は自動で切り捨てられ、`%` で余り（剰余）を取得できます。",
    order_index: 6,
    test_cases: [
      { name: "公開テスト1：10000円を3人で割り勘", input: "10000\n3\n", expected_output: "1人あたり: 3333円\n余り: 1円", is_hidden: false, order_index: 1 },
      { name: "公開テスト2：ちょうど割り切れる場合", input: "12000\n4\n", expected_output: "1人あたり: 3000円\n余り: 0円", is_hidden: false, order_index: 2 },
      { name: "非公開テスト：端数あり", input: "5555\n6\n", expected_output: "1人あたり: 925円\n余り: 5円", is_hidden: true, order_index: 3 },
    ],
    hints: [
      { step_number: 1, content_md: "商（割り算の答え）を求める演算子 `/` と、余りを求める演算子 `%` の2つを使います。" },
      { step_number: 2, content_md: "`int perPerson = total / people;` のように変数へ入れてから文字列連結で出力しましょう。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442102",
    chapter_id: CH1_ID,
    lesson_id: L1_ID,
    language: "java",
    title: "1-7. 小数計算と型キャスト（3科目の合計点・平均点）",
    description_md: `## 問題文
国語・数学・英語の3科目の点数（整数）が標準入力から3行で与えられます。
合計点（整数）と、小数点を含む正確な平均点（\`double\` 型・小数第1位まで、または切り捨てではなく \`/ 3.0\` での計算結果）を出力してください。
※平均点は小数第1位まで出力（\`String.format("%.1f", avg)\` または \`Math.round(avg * 10) / 10.0\` 等）してください。

### 出力形式
\`\`\`
合計: <合計>
平均: <小数第1位までの平均>
\`\`\`

### 入力例
\`\`\`
80
75
90
\`\`\`

### 出力例
\`\`\`
合計: 245
平均: 81.7
\`\`\``,
    difficulty: "easy",
    estimated_minutes: 12,
    tags: ["出力と変数", "データ型", "キャスト"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        // 合計と平均（小数第1位まで）を出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        int sum = a + b + c;
        double avg = (double) sum / 3.0;
        System.out.println("合計: " + sum);
        System.out.println("平均: " + String.format("%.1f", avg));
    }
}`,
    explanation_md: "`int / int` は小数点以下が切り捨てられるため、正確な小数の平均を求めるには `(double) sum / 3.0` のように浮動小数点型へ変換（キャスト）します。",
    order_index: 7,
    test_cases: [
      { name: "公開テスト1：80, 75, 90", input: "80\n75\n90\n", expected_output: "合計: 245\n平均: 81.7", is_hidden: false, order_index: 1 },
      { name: "公開テスト2：100, 100, 100", input: "100\n100\n100\n", expected_output: "合計: 300\n平均: 100.0", is_hidden: false, order_index: 2 },
      { name: "非公開テスト：61, 62, 63", input: "61\n62\n63\n", expected_output: "合計: 186\n平均: 62.0", is_hidden: true, order_index: 3 },
    ],
    hints: [
      { step_number: 1, content_md: "整数同士の割り算 `sum / 3` では小数が消えてしまうため、`3.0` で割るか `(double)` でキャストしましょう。" },
      { step_number: 2, content_md: "小数第1位までの整形には `String.format(\"%.1f\", avg)` が便利です。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442103",
    chapter_id: CH1_ID,
    lesson_id: L1_ID,
    language: "java",
    title: "1-8. 文字列の基本操作（文字数・大文字変換・先頭3文字抽出）",
    description_md: `## 問題文
商品コードの文字列（半角英数字・3文字以上）が1行で与えられます。
以下の3つを順番に出力してください。
1. 文字数（\`length()\`）
2. すべて大文字に変換した文字列（\`toUpperCase()\`）
3. 大文字変換後の先頭3文字（\`substring(0, 3)\`）

### 入力例
\`\`\`
prd-0042
\`\`\`

### 出力例
\`\`\`
8
PRD-0042
PRD
\`\`\``,
    difficulty: "easy",
    estimated_minutes: 12,
    tags: ["出力と変数", "文字列操作", "String"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String code = sc.next();
        // 文字数、大文字変換、先頭3文字を順に出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String code = sc.next();
        String upper = code.toUpperCase();
        System.out.println(code.length());
        System.out.println(upper);
        System.out.println(upper.substring(0, 3));
    }
}`,
    explanation_md: "`String` クラスの `length()`, `toUpperCase()`, `substring(start, end)` は業務データ整形で最もよく使う基本メソッドです。",
    order_index: 8,
    test_cases: [
      { name: "公開テスト1：prd-0042", input: "prd-0042\n", expected_output: "8\nPRD-0042\nPRD", is_hidden: false, order_index: 1 },
      { name: "公開テスト2：abc123", input: "abc123\n", expected_output: "6\nABC123\nABC", is_hidden: false, order_index: 2 },
      { name: "非公開テスト：dev_999", input: "dev_999\n", expected_output: "7\nDEV_999\nDEV", is_hidden: true, order_index: 3 },
    ],
    hints: [
      { step_number: 1, content_md: "文字列の長さは `.length()`、大文字化は `.toUpperCase()` で取得できます。" },
      { step_number: 2, content_md: "先頭から3文字取り出すときは、開始インデックス `0`・終了インデックス `3` を `substring` に渡します。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442104",
    chapter_id: CH1_ID,
    lesson_id: L1_ID,
    language: "java",
    title: "1-9. 文字列の一致判定（equals）による簡易ログインチェック",
    description_md: `## 問題文
Javaでは文字列の中身が同じかどうかを比較するとき、\`==\` ではなく **\`.equals()\`** を使います。
ユーザーIDとパスワードが2行で入力されます。
ユーザーIDが \`"admin"\` かつパスワードが \`"java2025"\` の場合は \`LOGIN_OK\`、それ以外は \`LOGIN_NG\` と出力してください。

### 入力例
\`\`\`
admin
java2025
\`\`\`

### 出力例
\`\`\`
LOGIN_OK
\`\`\``,
    difficulty: "easy",
    estimated_minutes: 10,
    tags: ["出力と変数", "文字列比較", "equals"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String userId = sc.next();
        String password = sc.next();
        // equals() を使ってログイン判定を行ってください
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String userId = sc.next();
        String password = sc.next();
        if (userId.equals("admin") && password.equals("java2025")) {
            System.out.println("LOGIN_OK");
        } else {
            System.out.println("LOGIN_NG");
        }
    }
}`,
    explanation_md: "文字列の `==` は参照先（メモリアドレス）の比較になるため、値の一致チェックには必ず `equals()` を使用します。",
    order_index: 9,
    test_cases: [
      { name: "公開テスト1：正常ログイン", input: "admin\njava2025\n", expected_output: "LOGIN_OK", is_hidden: false, order_index: 1 },
      { name: "公開テスト2：パスワード誤り", input: "admin\nwrong\n", expected_output: "LOGIN_NG", is_hidden: false, order_index: 2 },
      { name: "非公開テスト：ID誤り", input: "guest\njava2025\n", expected_output: "LOGIN_NG", is_hidden: true, order_index: 3 },
    ],
    hints: [
      { step_number: 1, content_md: "文字列同士の比較は `==` ではなく `.equals(...)` を使いましょう。" },
      { step_number: 2, content_md: "IDとパスワードの両方が一致する条件は論理積 `&&` でつなぎます。" },
    ],
  },

  // =========================================================================
  // 第2章 基礎強化（2-6 〜 2-9）※非ネタバレヒント方針厳守
  // =========================================================================
  {
    id: "44444444-4444-4444-8444-444444442105",
    chapter_id: CH2_ID,
    lesson_id: L2_ID,
    language: "java",
    title: "2-6. 1からNまでの合計と偶数合計（forループ基礎）",
    description_md: `## 問題文
正の整数 \`N\` が与えられます。
1から \`N\` までの「すべての整数の合計」と「偶数のみの合計」をそれぞれ1行ずつ出力してください。

### 入力例
\`\`\`
10
\`\`\`

### 出力例
\`\`\`
55
30
\`\`\``,
    difficulty: "easy",
    estimated_minutes: 12,
    tags: ["ループ", "for文", "条件分岐"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // 1〜nの全合計と偶数合計を求めて出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int totalSum = 0;
        int evenSum = 0;
        for (int i = 1; i <= n; i++) {
            totalSum += i;
            if (i % 2 == 0) {
                evenSum += i;
            }
        }
        System.out.println(totalSum);
        System.out.println(evenSum);
    }
}`,
    explanation_md: "1つのループの中で2つの集計変数（全体用と偶数用）を同時に更新すると効率的です。",
    order_index: 6,
    test_cases: [
      { name: "公開テスト1：N=10", input: "10\n", expected_output: "55\n30", is_hidden: false, order_index: 1 },
      { name: "公開テスト2：N=5", input: "5\n", expected_output: "15\n6", is_hidden: false, order_index: 2 },
      { name: "非公開テスト：N=1", input: "1\n", expected_output: "1\n0", is_hidden: true, order_index: 3 },
    ],
    hints: [
      { step_number: 1, content_md: "合計を貯める変数を2つ（全合計用・偶数合計用）用意し、ループ前に0で初期化しましょう。" },
      { step_number: 2, content_md: "偶数かどうかは2で割った余り（`%` 演算子）が0かどうかで判定できます。" },
      { step_number: 3, content_md: "ループ終了後、全合計・偶数合計の順に2行で出力できているか確認しましょう。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442106",
    chapter_id: CH2_ID,
    lesson_id: L2_ID,
    language: "java",
    title: "2-7. 指定した段の九九を出力しよう（forループ反復）",
    description_md: `## 問題文
1〜9の整数 \`dan\` が与えられます。
その段の九九（1から9まで掛けた結果）を以下の形式で9行出力してください。

### 入力例
\`\`\`
3
\`\`\`

### 出力例
\`\`\`
3 x 1 = 3
3 x 2 = 6
3 x 3 = 9
3 x 4 = 12
3 x 5 = 15
3 x 6 = 18
3 x 7 = 21
3 x 8 = 24
3 x 9 = 27
\`\`\``,
    difficulty: "easy",
    estimated_minutes: 10,
    tags: ["ループ", "for文", "出力フォーマット"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int dan = sc.nextInt();
        // 1〜9まで掛けて9行出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int dan = sc.nextInt();
        for (int i = 1; i <= 9; i++) {
            System.out.println(dan + " x " + i + " = " + (dan * i));
        }
    }
}`,
    explanation_md: "`x` や `=` の前後の半角スペースを出力仕様どおりに揃える練習です。",
    order_index: 7,
    test_cases: [
      {
        name: "公開テスト1：3の段",
        input: "3\n",
        expected_output: "3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト：7の段",
        input: "7\n",
        expected_output: "7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63",
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      { step_number: 1, content_md: "ループ変数を1から9まで1ずつ増やしながら繰り返します。" },
      { step_number: 2, content_md: "半角小文字の `x` と `=` の前後に半角スペースが1つずつ入っているか注意しましょう。" },
      { step_number: 3, content_md: "文字列連結の中で掛け算を書くときは、括弧で囲んで優先順位を明確にすると安全です。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442107",
    chapter_id: CH2_ID,
    lesson_id: L2_ID,
    language: "java",
    title: "2-8. N件のテスト点数から合格者数をカウントしよう",
    description_md: `## 問題文
受験者数 \`N\` と、それに続く \`N\` 件の点数（整数）が標準入力から与えられます。
**60点以上** を合格とし、合格者数と不合格者数をそれぞれ1行ずつ出力してください。

### 入力例
\`\`\`
5
80
55
60
42
91
\`\`\`

### 出力例
\`\`\`
合格: 3人
不合格: 2人
\`\`\``,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["ループ", "条件分岐", "カウント"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // n件の点数を読み込み、60点以上・未満をカウントしてください
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int pass = 0;
        int fail = 0;
        for (int i = 0; i < n; i++) {
            int score = sc.nextInt();
            if (score >= 60) {
                pass++;
            } else {
                fail++;
            }
        }
        System.out.println("合格: " + pass + "人");
        System.out.println("不合格: " + fail + "人");
    }
}`,
    explanation_md: "入力件数 `N` を最初に読み込み、その回数だけループして `nextInt()` で1件ずつ判定・カウントするのは実務集計の基本パターンです。",
    order_index: 8,
    test_cases: [
      { name: "公開テスト1：5名中3名合格", input: "5\n80\n55\n60\n42\n91\n", expected_output: "合格: 3人\n不合格: 2人", is_hidden: false, order_index: 1 },
      { name: "公開テスト2：全員不合格", input: "3\n10\n59\n0\n", expected_output: "合格: 0人\n不合格: 3人", is_hidden: false, order_index: 2 },
      { name: "非公開テスト：全員合格", input: "2\n60\n100\n", expected_output: "合格: 2人\n不合格: 0人", is_hidden: true, order_index: 3 },
    ],
    hints: [
      { step_number: 1, content_md: "合格カウンタと不合格カウンタの2つの変数を用意し、`n` 回のループ内で点数を1つずつ読み込みます。" },
      { step_number: 2, content_md: "境界値の「ちょうど60点」は合格に含まれるため、`>` ではなく `>=` を使いましょう。" },
      { step_number: 3, content_md: "不合格者数は `n - pass` で求めることもできます。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442108",
    chapter_id: CH2_ID,
    lesson_id: L2_ID,
    language: "java",
    title: "2-9. 二重ループで階段パターン（*）を描画しよう",
    description_md: `## 問題文
高さ \`H\`（1以上の整数）が与えられます。
二重の \`for\` ループを使って、1行目に \`*\` を1個、2行目に2個、…、\`H\` 行目に \`H\` 個出力してください。

### 入力例
\`\`\`
4
\`\`\`

### 出力例
\`\`\`
*
**
***
****
\`\`\``,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["ループ", "二重ループ"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int h = sc.nextInt();
        // 二重ループで高さhの三角形を出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int h = sc.nextInt();
        for (int row = 1; row <= h; row++) {
            String line = "";
            for (int col = 0; col < row; col++) {
                line += "*";
            }
            System.out.println(line);
        }
    }
}`,
    explanation_md: "外側のループで「何行目か」、内側のループで「その行に何文字並べるか」を制御するのが二重ループの基本構造です。",
    order_index: 9,
    test_cases: [
      { name: "公開テスト1：高さ4", input: "4\n", expected_output: "*\n**\n***\n****", is_hidden: false, order_index: 1 },
      { name: "公開テスト2：高さ1", input: "1\n", expected_output: "*", is_hidden: false, order_index: 2 },
      { name: "非公開テスト：高さ5", input: "5\n", expected_output: "*\n**\n***\n****\n*****", is_hidden: true, order_index: 3 },
    ],
    hints: [
      { step_number: 1, content_md: "外側のループで行番号（1〜h）を回し、内側のループでその行番号と同じ回数だけ `*` をつなげます。" },
      { step_number: 2, content_md: "1行分の文字列を空文字から組み立てて、内側ループの後に `println` で出力するとシンプルです。" },
      { step_number: 3, content_md: "行ごとに変数をリセットし忘れないよう、変数の宣言位置を確認しましょう。" },
    ],
  },

  // =========================================================================
  // 第3章 基礎強化（3-4 〜 3-6）
  // =========================================================================
  {
    id: "44444444-4444-4444-8444-444444442109",
    chapter_id: CH3_ID,
    lesson_id: L3_ID,
    language: "java",
    title: "3-4. 配列の逆順出力と平均以上の人数カウント",
    description_md: `## 問題文
整数 \`N\` と \`N\` 個の点数（整数）が与えられます。
配列に格納したあと、以下の2行を出力してください。
- 1行目：配列の要素を **後ろから逆順** に半角スペース区切りで出力
- 2行目：全体の平均点（小数含む）**以上** の人数を出力

### 入力例
\`\`\`
4
70 80 90 60
\`\`\`

### 出力例
\`\`\`
60 90 80 70
2
\`\`\``,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["配列", "逆順", "平均集計"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] scores = new int[n];
        for (int i = 0; i < n; i++) {
            scores[i] = sc.nextInt();
        }
        // 1行目に逆順、2行目に平均以上の人数を出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] scores = new int[n];
        int sum = 0;
        for (int i = 0; i < n; i++) {
            scores[i] = sc.nextInt();
            sum += scores[i];
        }
        String rev = "";
        for (int i = n - 1; i >= 0; i--) {
            if (i < n - 1) rev += " ";
            rev += scores[i];
        }
        double avg = (double) sum / n;
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (scores[i] >= avg) count++;
        }
        System.out.println(rev);
        System.out.println(count);
    }
}`,
    explanation_md: "配列にデータを保持しておくことで、「一度合計から平均を出し、もう一方のループで各要素と平均を比較する」2パス処理が可能になります。",
    order_index: 4,
    test_cases: [
      { name: "公開テスト1：4件", input: "4\n70 80 90 60\n", expected_output: "60 90 80 70\n2", is_hidden: false, order_index: 1 },
      { name: "公開テスト2：3件（同点）", input: "3\n50 50 50\n", expected_output: "50 50 50\n3", is_hidden: false, order_index: 2 },
      { name: "非公開テスト：5件", input: "5\n10 20 30 40 100\n", expected_output: "100 40 30 20 10\n2", is_hidden: true, order_index: 3 },
    ],
    hints: [
      { step_number: 1, content_md: "配列の末尾インデックスは `n - 1` です。`i--` で `0` まで減らすと逆順に取り出せます。" },
      { step_number: 2, content_md: "平均は `(double) sum / n` で小数のまま求めてから各要素と `>=` で比較しましょう。" },
      { step_number: 3, content_md: "1行目の末尾に余分なスペースがつかないよう、先頭要素以外でスペースを挟む工夫をしましょう。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442110",
    chapter_id: CH3_ID,
    lesson_id: L3_ID,
    language: "java",
    title: "3-5. 配列から指定値を探す線形探索メソッド（findIndex）",
    description_md: `## 問題文
整数配列 \`arr\` と検索値 \`target\` を受け取り、最初に見つかった位置のインデックス（0始まり）を返すメソッド \`findIndex(int[] arr, int target)\` を実装してください。
見つからない場合は \`-1\` を返してください。

### 入力形式
- 1行目：配列の長さ \`N\`
- 2行目：\`N\` 個の整数
- 3行目：検索したい整数 \`target\`

### 入力例
\`\`\`
5
10 25 30 25 50
25
\`\`\`

### 出力例
\`\`\`
1
\`\`\``,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["配列", "メソッド", "線形探索"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static int findIndex(int[] arr, int target) {
        // ここに探索ロジックを実装してください
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        int target = sc.nextInt();
        System.out.println(findIndex(arr, target));
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static int findIndex(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        int target = sc.nextInt();
        System.out.println(findIndex(arr, target));
    }
}`,
    explanation_md: "一致した瞬間に `return i;` で早期リターンすると、最初に見つかったインデックスを返しつつ無駄な探索も止められます。",
    order_index: 5,
    test_cases: [
      { name: "公開テスト1：重複ありの先頭一致", input: "5\n10 25 30 25 50\n25\n", expected_output: "1", is_hidden: false, order_index: 1 },
      { name: "公開テスト2：見つからない場合", input: "4\n1 2 3 4\n9\n", expected_output: "-1", is_hidden: false, order_index: 2 },
      { name: "非公開テスト：末尾で一致", input: "3\n7 8 9\n9\n", expected_output: "2", is_hidden: true, order_index: 3 },
    ],
    hints: [
      { step_number: 1, content_md: "配列の先頭（インデックス0）から順番に `arr[i]` と `target` を比較します。" },
      { step_number: 2, content_md: "一致したらすぐに `return` でそのときのインデックスを返すと、最初の位置が返ります。" },
      { step_number: 3, content_md: "ループを最後まで抜けてしまった場合だけ `-1` を返しましょう。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442111",
    chapter_id: CH3_ID,
    lesson_id: L3_ID,
    language: "java",
    title: "3-6. 割引＆税込価格を計算するメソッド分割演習",
    description_md: `## 問題文
定価 \`price\`（円）と割引率 \`discountPercent\`（整数%）が入力されます。
以下の2つのメソッドを定義して組み合わせて使い、最終的な支払金額（整数・各計算ごとに小数点以下切り捨て）を出力してください。
1. \`applyDiscount(int price, int discountPercent)\`：割引後の税抜価格を返す（例：\`price * (100 - discountPercent) / 100\`）
2. \`addTax(int price)\`：10%の消費税を加えた税込価格を返す（\`price * 110 / 100\`）

### 入力例
\`\`\`
2000
20
\`\`\`

### 出力例
\`\`\`
1760
\`\`\``,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["メソッド", "責務分割"],
    starter_code: `import java.util.Scanner;

public class Main {
    // applyDiscount メソッドと addTax メソッドを定義してください

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int price = sc.nextInt();
        int discountPercent = sc.nextInt();
        // 2つのメソッドを呼び出して結果を出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static int applyDiscount(int price, int discountPercent) {
        return price * (100 - discountPercent) / 100;
    }

    public static int addTax(int price) {
        return price * 110 / 100;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int price = sc.nextInt();
        int discountPercent = sc.nextInt();
        int discounted = applyDiscount(price, discountPercent);
        int finalPrice = addTax(discounted);
        System.out.println(finalPrice);
    }
}`,
    explanation_md: "「割引」と「課税」のように意味の単位でメソッドを分けると、計算ルールが変わったときも修正箇所が1か所で済みます。",
    order_index: 6,
    test_cases: [
      { name: "公開テスト1：2000円の20%引き＋税10%", input: "2000\n20\n", expected_output: "1760", is_hidden: false, order_index: 1 },
      { name: "公開テスト2：割引なし", input: "1000\n0\n", expected_output: "1100", is_hidden: false, order_index: 2 },
      { name: "非公開テスト：1500円の10%引き＋税10%", input: "1500\n10\n", expected_output: "1485", is_hidden: true, order_index: 3 },
    ],
    hints: [
      { step_number: 1, content_md: "小数の丸め誤差を避けるため、`* (100 - discountPercent) / 100` のように整数演算で計算すると正確です。" },
      { step_number: 2, content_md: "`applyDiscount` の戻り値をそのまま `addTax` の引数へ渡す流れにしてみましょう。" },
    ],
  },

  // =========================================================================
  // 第4章 基礎強化（4-4 〜 4-6）
  // =========================================================================
  {
    id: "44444444-4444-4444-8444-444444442112",
    chapter_id: CH4_ID,
    lesson_id: L4_ID,
    language: "java",
    title: "4-4. 社員クラス（Employee）の配列管理と一覧出力",
    description_md: `## 問題文
社員の氏名（\`name\`）と部署名（\`department\`）を持つ \`Employee\` クラスを作成し、自己紹介文字列 \`"[部署名] 氏名"\` を返すメソッド \`formatLabel()\` を実装してください。
\`N\` 名分の社員データを \`Employee[]\` 配列に格納し、先頭から順に1行ずつ出力してください。

### 入力例
\`\`\`
2
山田太郎 開発部
佐藤花子 営業部
\`\`\`

### 出力例
\`\`\`
[開発部] 山田太郎
[営業部] 佐藤花子
\`\`\``,
    difficulty: "medium",
    estimated_minutes: 20,
    tags: ["オブジェクト指向", "クラス設計", "オブジェクト配列"],
    starter_code: `import java.util.Scanner;

class Employee {
    // フィールド・コンストラクタ・formatLabel() を実装してください
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Employee配列に格納して出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

class Employee {
    private String name;
    private String department;

    public Employee(String name, String department) {
        this.name = name;
        this.department = department;
    }

    public String formatLabel() {
        return "[" + department + "] " + name;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Employee[] list = new Employee[n];
        for (int i = 0; i < n; i++) {
            String name = sc.next();
            String dept = sc.next();
            list[i] = new Employee(name, dept);
        }
        for (int i = 0; i < n; i++) {
            System.out.println(list[i].formatLabel());
        }
    }
}`,
    explanation_md: "データ（フィールド）と表示ロジック（メソッド）を1つのクラスにまとめ、配列で複数管理する設計はEntity/DTOの基礎です。",
    order_index: 4,
    test_cases: [
      { name: "公開テスト1：2名登録", input: "2\n山田太郎 開発部\n佐藤花子 営業部\n", expected_output: "[開発部] 山田太郎\n[営業部] 佐藤花子", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：3名登録", input: "3\n鈴木 総務\n高橋 人事\n田中 開発\n", expected_output: "[総務] 鈴木\n[人事] 高橋\n[開発] 田中", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "`Employee` クラスに `name` と `department` の2つのフィールドとコンストラクタを定義します。" },
      { step_number: 2, content_md: "`new Employee[n]` で配列の枠を作り、ループ内で `new Employee(name, dept)` を各要素へ代入します。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442113",
    chapter_id: CH4_ID,
    lesson_id: L4_ID,
    language: "java",
    title: "4-5. 在庫アイテムクラス（StockItem）の入庫・出庫と不足ガード",
    description_md: `## 問題文
商品名（\`name\`）と在庫数（\`stock\`）を持つ \`StockItem\` クラスを実装してください。
- \`restock(int qty)\`：在庫を \`qty\` 個増やす
- \`ship(int qty)\`：在庫が \`qty\` 個以上あれば減らして \`true\` を返し、足りなければ在庫を変更せず \`false\` を返す

入力として「商品名」「初期在庫」「操作回数 \`Q\`」に続き、\`Q\` 行の操作（\`IN 数量\` または \`OUT 数量\`）が与えられます。
\`OUT\` が在庫不足で失敗したときだけ \`SHORTAGE\` と出力し、最後に \`<商品名>: <残在庫>\` を出力してください。

### 入力例
\`\`\`
Mouse 5
3
IN 3
OUT 10
OUT 4
\`\`\`

### 出力例
\`\`\`
SHORTAGE
Mouse: 4
\`\`\``,
    difficulty: "medium",
    estimated_minutes: 25,
    tags: ["オブジェクト指向", "カプセル化", "在庫管理"],
    starter_code: `import java.util.Scanner;

class StockItem {
    // フィールド・コンストラクタ・restock・ship・getStock を実装してください
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        int initialStock = sc.nextInt();
        int q = sc.nextInt();
        // StockItem を生成し、q回の IN / OUT 操作を処理してください
    }
}`,
    solution_code: `import java.util.Scanner;

class StockItem {
    private String name;
    private int stock;

    public StockItem(String name, int stock) {
        this.name = name;
        this.stock = stock;
    }

    public void restock(int qty) {
        this.stock += qty;
    }

    public boolean ship(int qty) {
        if (this.stock < qty) {
            return false;
        }
        this.stock -= qty;
        return true;
    }

    public String getSummary() {
        return name + ": " + stock;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        int initialStock = sc.nextInt();
        int q = sc.nextInt();
        StockItem item = new StockItem(name, initialStock);
        for (int i = 0; i < q; i++) {
            String cmd = sc.next();
            int qty = sc.nextInt();
            if (cmd.equals("IN")) {
                item.restock(qty);
            } else if (cmd.equals("OUT")) {
                if (!item.ship(qty)) {
                    System.out.println("SHORTAGE");
                }
            }
        }
        System.out.println(item.getSummary());
    }
}`,
    explanation_md: "在庫がマイナスにならないよう `ship()` メソッド内部でガード条件を入れるのが、カプセル化によるデータ整合性の守り方です。",
    order_index: 5,
    test_cases: [
      { name: "公開テスト1：入庫・不足・出庫", input: "Mouse 5\n3\nIN 3\nOUT 10\nOUT 4\n", expected_output: "SHORTAGE\nMouse: 4", is_hidden: false, order_index: 1 },
      { name: "公開テスト2：ちょうど0になる出庫", input: "PC 2\n1\nOUT 2\n", expected_output: "PC: 0", is_hidden: false, order_index: 2 },
      { name: "非公開テスト：連続不足", input: "Hub 1\n3\nOUT 2\nOUT 5\nIN 4\n", expected_output: "SHORTAGE\nSHORTAGE\nHub: 5", is_hidden: true, order_index: 3 },
    ],
    hints: [
      { step_number: 1, content_md: "在庫数を `private` フィールドにし、増減は必ず `restock` / `ship` メソッド経由にします。" },
      { step_number: 2, content_md: "`ship` では先に `stock < qty` かどうかをチェックし、足りない場合は減算せずに `false` を返しましょう。" },
      { step_number: 3, content_md: "コマンド判定の文字列比較には `.equals(\"IN\")` / `.equals(\"OUT\")` を使います。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442114",
    chapter_id: CH4_ID,
    lesson_id: L4_ID,
    language: "java",
    title: "4-6. 【入門総仕上げ】ショッピングカート（CartItem）の合計＆送料無料判定",
    description_md: `## 問題文
Java入門の総仕上げとして、複数商品をまとめて会計するミニショッピングカートを作成しましょう。
商品名・単価・数量を持つ \`CartItem\` クラスを定義し、小計を返す \`getSubtotal()\` メソッドを実装してください。
\`N\` 件の商品を読み込み、合計金額（\`total\`）を算出したあと、**5000円以上なら送料0円、5000円未満なら送料500円** を加算して以下を出力してください。

### 出力形式
\`\`\`
商品合計: <商品合計>円
送料: <送料>円
請求金額: <請求金額>円
\`\`\`

### 入力例
\`\`\`
2
Keyboard 3000 1
Mouse 1200 2
\`\`\`

### 出力例
\`\`\`
商品合計: 5400円
送料: 0円
請求金額: 5400円
\`\`\``,
    difficulty: "medium",
    estimated_minutes: 25,
    tags: ["オブジェクト指向", "配列", "条件分岐", "総仕上げ"],
    starter_code: `import java.util.Scanner;

class CartItem {
    // フィールド・コンストラクタ・getSubtotal() を実装してください
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // N件の CartItem を読み込み、商品合計・送料・請求金額を出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

class CartItem {
    private String name;
    private int price;
    private int quantity;

    public CartItem(String name, int price, int quantity) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    public int getSubtotal() {
        return price * quantity;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        CartItem[] items = new CartItem[n];
        int total = 0;
        for (int i = 0; i < n; i++) {
            String name = sc.next();
            int price = sc.nextInt();
            int qty = sc.nextInt();
            items[i] = new CartItem(name, price, qty);
            total += items[i].getSubtotal();
        }
        int shipping = (total >= 5000) ? 0 : 500;
        System.out.println("商品合計: " + total + "円");
        System.out.println("送料: " + shipping + "円");
        System.out.println("請求金額: " + (total + shipping) + "円");
    }
}`,
    explanation_md: "変数・入力・ループ・配列・条件分岐・クラス設計というJava入門のすべての基礎が1つの業務ロジックとして繋がりました。次はJava初級へ進みましょう！",
    order_index: 6,
    test_cases: [
      { name: "公開テスト1：5000円以上で送料無料", input: "2\nKeyboard 3000 1\nMouse 1200 2\n", expected_output: "商品合計: 5400円\n送料: 0円\n請求金額: 5400円", is_hidden: false, order_index: 1 },
      { name: "公開テスト2：5000円未満で送料500円", input: "2\nCable 800 2\nPad 1000 1\n", expected_output: "商品合計: 2600円\n送料: 500円\n請求金額: 3100円", is_hidden: false, order_index: 2 },
      { name: "非公開テスト：ちょうど5000円", input: "1\nHeadset 5000 1\n", expected_output: "商品合計: 5000円\n送料: 0円\n請求金額: 5000円", is_hidden: true, order_index: 3 },
    ],
    hints: [
      { step_number: 1, content_md: "`CartItem` クラスに単価×数量を計算して返す `getSubtotal()` を用意すると、メイン側の集計がすっきりします。" },
      { step_number: 2, content_md: "送料判定は境界値の「ちょうど5000円」が0円になるよう `>= 5000` で比較しましょう。" },
      { step_number: 3, content_md: "請求金額は「商品合計 + 送料」で計算します。" },
    ],
  },
];
