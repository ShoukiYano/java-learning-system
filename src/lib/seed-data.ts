// =============================================================================
// シードデータ定義（Java入門コース：4章 × 各3問 ＝ 全12問）
// - SQLマイグレーション生成・自動テスト（全問題の模範解答が全テストに通るか検証）・
//   およびDBフォールバック表示で共通利用するマスターデータ
// =============================================================================

import { Difficulty } from "@/types/database";

export interface SeedTestCase {
  name: string;
  input: string;
  expected_output: string;
  is_hidden: boolean;
  order_index: number;
}

export interface SeedHint {
  step_number: 1 | 2 | 3;
  content_md: string;
}

export interface SeedProblem {
  id: string;
  lesson_id: string;
  chapter_id: string;
  title: string;
  description_md: string;
  difficulty: Difficulty;
  estimated_minutes: number;
  tags: string[];
  starter_code: string;
  solution_code: string;
  explanation_md: string;
  order_index: number;
  test_cases: SeedTestCase[];
  hints: SeedHint[];
}

export interface SeedChapter {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order_index: number;
  lesson_id: string;
  lesson_title: string;
}

export const SEED_COURSE_ID = "11111111-1111-4111-8111-111111111101";

export const SEED_CHAPTERS: SeedChapter[] = [
  {
    id: "22222222-2222-4222-8222-222222222201",
    course_id: SEED_COURSE_ID,
    title: "第1章：出力と変数",
    description: "System.out.println による標準出力、基本データ型、四則演算とScannerによる入力処理を学びます。",
    order_index: 1,
    lesson_id: "33333333-3333-4333-8333-333333333301",
    lesson_title: "1-1. 標準入出力と変数の基本",
  },
  {
    id: "22222222-2222-4222-8222-222222222202",
    course_id: SEED_COURSE_ID,
    title: "第2章：条件分岐とループ",
    description: "if-else文、switch文、forループ、whileループを組み合わせてアルゴリズムの基礎を身につけます。",
    order_index: 2,
    lesson_id: "33333333-3333-4333-8333-333333333302",
    lesson_title: "2-1. 制御構文（分岐・反復）のマスター",
  },
  {
    id: "22222222-2222-4222-8222-222222222203",
    course_id: SEED_COURSE_ID,
    title: "第3章：配列とメソッド",
    description: "1次元・2次元配列の操作、staticメソッドの定義、オーバーロードと再帰呼び出しを実践します。",
    order_index: 3,
    lesson_id: "33333333-3333-4333-8333-333333333303",
    lesson_title: "3-1. 配列処理とメソッド分割",
  },
  {
    id: "22222222-2222-4222-8222-222222222204",
    course_id: SEED_COURSE_ID,
    title: "第4章：クラスとオブジェクト",
    description: "フィールドとコンストラクタ、カプセル化、extendsによる継承とメソッドのオーバーライド、ポリモーフィズムを学びます。",
    order_index: 4,
    lesson_id: "33333333-3333-4333-8333-333333333304",
    lesson_title: "4-1. オブジェクト指向プログラミング実践",
  },
];

export const SEED_PROBLEMS: SeedProblem[] = [
  // ===========================================================================
  // 第1章：出力と変数（3問）
  // ===========================================================================
  {
    id: "44444444-4444-4444-8444-444444444401",
    chapter_id: "22222222-2222-4222-8222-222222222201",
    lesson_id: "33333333-3333-4333-8333-333333333301",
    title: "1-1. Hello Java! と複数行の出力",
    description_md: `### 問題概要
Javaの標準出力 \`System.out.println\` を使って、以下の2行を順番に出力するプログラムを作成してください。

\`\`\`
Hello, Java!
Let's start programming!
\`\`\`

### 条件
- 大文字・小文字や記号（カンマ、エクスクラメーションマーク）を正確に出力してください。`,
    difficulty: "easy",
    estimated_minutes: 5,
    tags: ["出力と変数", "基礎構文"],
    starter_code: `public class Main {
    public static void main(String[] args) {
        // ここに System.out.println を記述してください
        
    }
}`,
    solution_code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
        System.out.println("Let's start programming!");
    }
}`,
    explanation_md: `\`System.out.println("文字列");\` を使うと、文字列を出力したあとに自動で改行されます。2行出力する場合は \`System.out.println\` を2回呼び出します。`,
    order_index: 1,
    test_cases: [
      {
        name: "公開テスト1：基本出力チェック",
        input: "",
        expected_output: "Hello, Java!\nLet's start programming!",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：厳密出力チェック",
        input: "",
        expected_output: "Hello, Java!\nLet's start programming!",
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `文字列を画面に出力するには \`System.out.println("...");\` を使います。`,
      },
      {
        step_number: 2,
        content_md: `1行目に \`System.out.println("Hello, Java!");\` を書き、次の行にもう1つ \`System.out.println\` を書きます。`,
      },
      {
        step_number: 3,
        content_md: `文の末尾のセミコロン \`;\` を忘れないように注意しましょう。`,
      },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444444402",
    chapter_id: "22222222-2222-4222-8222-222222222201",
    lesson_id: "33333333-3333-4333-8333-333333333301",
    title: "1-2. 長方形の面積と周囲の長さ",
    description_md: `### 問題概要
標準入力から2つの整数 $H$（縦の長さ）と $W$（横の長さ）が空白または改行区切りで与えられます。
長方形の **面積**（$H \\times W$）と **周囲の長さ**（$2 \\times (H + W)$）を空白区切りで1行に出力してください。

### 入力例
\`\`\`
3 5
\`\`\`

### 出力例
\`\`\`
15 16
\`\`\``,
    difficulty: "easy",
    estimated_minutes: 10,
    tags: ["出力と変数", "算術演算", "Scanner"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int h = sc.nextInt();
        int w = sc.nextInt();
        
        // 面積と周囲の長さを計算して出力してください
        
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int h = sc.nextInt();
        int w = sc.nextInt();
        int area = h * w;
        int perimeter = 2 * (h + w);
        System.out.println(area + " " + perimeter);
    }
}`,
    explanation_md: `掛け算には \`*\` 演算子を使います。周囲の長さは足し算を先に計算させるため \`2 * (h + w)\` のように丸括弧で囲みます。`,
    order_index: 2,
    test_cases: [
      {
        name: "公開テスト1：3×5の長方形",
        input: "3 5",
        expected_output: "15 16",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：正方形 (4×4)",
        input: "4 4",
        expected_output: "16 16",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：大きな値 (12×25)",
        input: "12 25",
        expected_output: "300 74",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `面積は \`int area = h * w;\` で求められます。`,
      },
      {
        step_number: 2,
        content_md: `周囲の長さは \`int perimeter = 2 * (h + w);\` です。`,
      },
      {
        step_number: 3,
        content_md: `空白区切りで出力するには \`System.out.println(area + " " + perimeter);\` と記述します。`,
      },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444444403",
    chapter_id: "22222222-2222-4222-8222-222222222201",
    lesson_id: "33333333-3333-4333-8333-333333333301",
    title: "1-3. 秒数の時間変換（時・分・秒）",
    description_md: `### 問題概要
標準入力から秒数を表す整数 $S$ が与えられます。
これを **時間 ($h$)**、**分 ($m$)**、**秒 ($s$)** に変換し、\`h:m:s\` の形式で出力してください。

### 入力例
\`\`\`
46979
\`\`\`

### 出力例
\`\`\`
13:2:59
\`\`\``,
    difficulty: "easy",
    estimated_minutes: 10,
    tags: ["出力と変数", "算術演算"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int totalSeconds = sc.nextInt();
        
        // h:m:s の形式で出力してください
        
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int totalSeconds = sc.nextInt();
        int h = totalSeconds / 3600;
        int m = (totalSeconds % 3600) / 60;
        int s = totalSeconds % 60;
        System.out.println(h + ":" + m + ":" + s);
    }
}`,
    explanation_md: `1時間は3600秒、1分は60秒です。整数の割り算 \`/\` と剰余（余り）演算子 \`%\` を組み合わせることで各単位を取り出せます。`,
    order_index: 3,
    test_cases: [
      {
        name: "公開テスト1：46979秒",
        input: "46979",
        expected_output: "13:2:59",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：3661秒",
        input: "3661",
        expected_output: "1:1:1",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：0秒",
        input: "0",
        expected_output: "0:0:0",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `1時間は 3600 秒なので、時間 \`h\` は \`totalSeconds / 3600\` で計算できます。`,
      },
      {
        step_number: 2,
        content_md: `3600で割った余り \`totalSeconds % 3600\` をさらに 60 で割ると分 \`m\` になります。`,
      },
      {
        step_number: 3,
        content_md: `秒 \`s\` は \`totalSeconds % 60\` です。これらを \`":"\` で連結して出力しましょう。`,
      },
    ],
  },

  // ===========================================================================
  // 第2章：条件分岐とループ（3問）
  // ===========================================================================
  {
    id: "44444444-4444-4444-8444-444444444404",
    chapter_id: "22222222-2222-4222-8222-222222222202",
    lesson_id: "33333333-3333-4333-8333-333333333302",
    title: "2-1. テストの成績判定（if-else分岐）",
    description_md: `### 問題概要
標準入力からテストの点数 $score$（$0 \\le score \\le 100$）が与えられます。
以下の基準に従ってランクを出力してください。

- 80点以上： \`A\`
- 60点以上 80点未満： \`B\`
- 40点以上 60点未満： \`C\`
- 40点未満： \`D\`

### 入力例
\`\`\`
75
\`\`\`

### 出力例
\`\`\`
B
\`\`\``,
    difficulty: "easy",
    estimated_minutes: 10,
    tags: ["条件分岐", "基礎構文"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int score = sc.nextInt();
        
        // if - else if - else を使って判定してください
        
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int score = sc.nextInt();
        if (score >= 80) {
            System.out.println("A");
        } else if (score >= 60) {
            System.out.println("B");
        } else if (score >= 40) {
            System.out.println("C");
        } else {
            System.out.println("D");
        }
    }
}`,
    explanation_md: `上から順番に高い点数の条件（\`score >= 80\`）から判定していくことで、\`else if (score >= 60)\` の時点では自動的に80点未満であることが保証されます。`,
    order_index: 1,
    test_cases: [
      {
        name: "公開テスト1：75点 (B)",
        input: "75",
        expected_output: "B",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：80点境界 (A)",
        input: "80",
        expected_output: "A",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：40点境界 (C)",
        input: "40",
        expected_output: "C",
        is_hidden: true,
        order_index: 3,
      },
      {
        name: "非公開テスト2：39点 (D)",
        input: "39",
        expected_output: "D",
        is_hidden: true,
        order_index: 4,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `\`if (score >= 80)\` から判定を始めます。`,
      },
      {
        step_number: 2,
        content_md: `続けて \`else if (score >= 60)\`、\`else if (score >= 40)\`、最後に \`else\` を使います。`,
      },
      {
        step_number: 3,
        content_md: `境界値（80ちょうど、60ちょうど）を含むため \`>\` ではなく \`>=\` を使いましょう。`,
      },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444444405",
    chapter_id: "22222222-2222-4222-8222-222222222202",
    lesson_id: "33333333-3333-4333-8333-333333333302",
    title: "2-2. FizzBuzz問題（ループと条件分岐）",
    description_md: `### 問題概要
整数 $N$ が与えられます。$1$ から $N$ までの整数を順番に1行ずつ出力してください。
ただし：
- 3の倍数かつ5の倍数のときは数値の代わりに \`FizzBuzz\`
- 3の倍数のときは \`Fizz\`
- 5の倍数のときは \`Buzz\`
を出力してください。

### 入力例
\`\`\`
5
\`\`\`

### 出力例
\`\`\`
1
2
Fizz
4
Buzz
\`\`\``,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["条件分岐", "ループ", "算術演算"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        // 1 から n までループして出力してください
        
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 1; i <= n; i++) {
            if (i % 15 == 0) {
                System.out.println("FizzBuzz");
            } else if (i % 3 == 0) {
                System.out.println("Fizz");
            } else if (i % 5 == 0) {
                System.out.println("Buzz");
            } else {
                System.out.println(i);
            }
        }
    }
}`,
    explanation_md: `3と5の両方で割り切れる（つまり15で割り切れる \`i % 15 == 0\`）条件を最初に判定するのがポイントです。先に \`i % 3 == 0\` を判定してしまうと、15のときにも \`Fizz\` になってしまいます。`,
    order_index: 2,
    test_cases: [
      {
        name: "公開テスト1：N=5",
        input: "5",
        expected_output: "1\n2\nFizz\n4\nBuzz",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：N=15",
        input: "15",
        expected_output:
          "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：N=3",
        input: "3",
        expected_output: "1\n2\nFizz",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `\`for (int i = 1; i <= n; i++)\` で1からnまで繰り返します。`,
      },
      {
        step_number: 2,
        content_md: `倍数判定には余りを求める \`%\` 演算子を使います（例：3の倍数なら \`i % 3 == 0\`）。`,
      },
      {
        step_number: 3,
        content_md: `3と5の両方の倍数（\`i % 3 == 0 && i % 5 == 0\`）を一番最初の \`if\` に書きましょう。`,
      },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444444406",
    chapter_id: "22222222-2222-4222-8222-222222222202",
    lesson_id: "33333333-3333-4333-8333-333333333302",
    title: "2-3. 各桁の和（whileループの活用）",
    description_md: `### 問題概要
正の整数 $N$ が与えられます。$N$ の十進法表記における各桁の数字の和を求めて出力してください。
例えば $N = 1234$ のとき、$1 + 2 + 3 + 4 = 10$ を出力します。

### 入力例
\`\`\`
1234
\`\`\`

### 出力例
\`\`\`
10
\`\`\``,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["ループ", "算術演算"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        // 各桁の和を計算して出力してください
        
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int sum = 0;
        while (n > 0) {
            sum += n % 10;
            n /= 10;
        }
        System.out.println(sum);
    }
}`,
    explanation_md: `整数 \`n\` を 10 で割った余り（\`n % 10\`）が一の位の数字になります。それを \`sum\` に足したあと、\`n /= 10\` で一桁右にずらす処理を \`n > 0\` の間繰り返します。`,
    order_index: 3,
    test_cases: [
      {
        name: "公開テスト1：1234",
        input: "1234",
        expected_output: "10",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：999",
        input: "999",
        expected_output: "27",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：10005",
        input: "10005",
        expected_output: "6",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `一の位の数字は \`n % 10\` で取り出すことができます。`,
      },
      {
        step_number: 2,
        content_md: `一の位を取り除いて桁を1つ減らすには \`n = n / 10;\`（または \`n /= 10;\`）とします。`,
      },
      {
        step_number: 3,
        content_md: `\`while (n > 0)\` のループ内で \`sum += n % 10;\` と \`n /= 10;\` を繰り返しましょう。`,
      },
    ],
  },

  // ===========================================================================
  // 第3章：配列とメソッド（3問）
  // ===========================================================================
  {
    id: "44444444-4444-4444-8444-444444444407",
    chapter_id: "22222222-2222-4222-8222-222222222203",
    lesson_id: "33333333-3333-4333-8333-333333333303",
    title: "3-1. 配列の最大値と合計値",
    description_md: `### 問題概要
最初に要素数 $N$ が与えられ、続けて $N$ 個の整数が与えられます。
これらを配列に格納し、**最大値** と **合計値** を空白区切りで出力してください。

### 入力例
\`\`\`
5
12 45 7 23 19
\`\`\`

### 出力例
\`\`\`
45 106
\`\`\``,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["配列", "ループ"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }
        
        // 最大値と合計値を求めて出力してください
        
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }
        int max = nums[0];
        int sum = 0;
        for (int v : nums) {
            if (v > max) {
                max = v;
            }
            sum += v;
        }
        System.out.println(max + " " + sum);
    }
}`,
    explanation_md: `最大値の初期値には配列の先頭要素 \`nums[0]\` を使うと、負の数が含まれる場合でも正しく最大値を求められます。拡張for文 \`for (int v : nums)\` を使うと簡潔に書けます。`,
    order_index: 1,
    test_cases: [
      {
        name: "公開テスト1：5個の正整数",
        input: "5\n12 45 7 23 19",
        expected_output: "45 106",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：負の数を含む配列",
        input: "4\n-10 -3 -25 -8",
        expected_output: "-3 -46",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：1要素のみ",
        input: "1\n100",
        expected_output: "100 100",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `最大値を保持する変数 \`int max = nums[0];\` と、合計用の \`int sum = 0;\` を用意します。`,
      },
      {
        step_number: 2,
        content_md: `ループで各要素を見て、\`if (nums[i] > max) { max = nums[i]; }\` で最大値を更新します。`,
      },
      {
        step_number: 3,
        content_md: `最後に \`System.out.println(max + " " + sum);\` で出力します。`,
      },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444444408",
    chapter_id: "22222222-2222-4222-8222-222222222203",
    lesson_id: "33333333-3333-4333-8333-333333333303",
    title: "3-2. 素数判定メソッドの実装",
    description_md: `### 問題概要
整数 $x$ が素数かどうかを判定する static メソッド \`isPrime(int x)\` を完成させ、標準入力から与えられた整数 $N$ が素数なら \`Prime\`、そうでなければ \`Not Prime\` と出力してください。
（※ 1 は素数ではありません）

### 入力例
\`\`\`
17
\`\`\`

### 出力例
\`\`\`
Prime
\`\`\``,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["メソッド", "ループ", "条件分岐"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static boolean isPrime(int x) {
        // ここを実装してください
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (isPrime(n)) {
            System.out.println("Prime");
        } else {
            System.out.println("Not Prime");
        }
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static boolean isPrime(int x) {
        if (x < 2) return false;
        for (int i = 2; i * i <= x; i++) {
            if (x % i == 0) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (isPrime(n)) {
            System.out.println("Prime");
        } else {
            System.out.println("Not Prime");
        }
    }
}`,
    explanation_md: `2未満の数は素数ではありません。2以上の数については、$2$ から $\\sqrt{x}$（\`i * i <= x\`）までの整数で割り切れるものがあるかを調べ、1つでも割り切れれば \`false\`、最後まで割り切れなければ \`true\` を返します。`,
    order_index: 2,
    test_cases: [
      {
        name: "公開テスト1：17 (Prime)",
        input: "17",
        expected_output: "Prime",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：15 (Not Prime)",
        input: "15",
        expected_output: "Not Prime",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：1 (Not Prime)",
        input: "1",
        expected_output: "Not Prime",
        is_hidden: true,
        order_index: 3,
      },
      {
        name: "非公開テスト2：2 (Prime)",
        input: "2",
        expected_output: "Prime",
        is_hidden: true,
        order_index: 4,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `まず \`if (x < 2) return false;\` で 1 以下の数を除外します。`,
      },
      {
        step_number: 2,
        content_md: `\`for (int i = 2; i < x; i++)\`（または \`i * i <= x\`）で割り切れる数がないか調べます。`,
      },
      {
        step_number: 3,
        content_md: `ループの中で \`if (x % i == 0) return false;\` とし、ループを抜けたら \`return true;\` を返します。`,
      },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444444409",
    chapter_id: "22222222-2222-4222-8222-222222222203",
    lesson_id: "33333333-3333-4333-8333-333333333303",
    title: "3-3. 再帰メソッドによる階乗計算",
    description_md: `### 問題概要
非負整数 $N$（$0 \\le N \\le 10$）が与えられます。
再帰メソッド \`factorial(int n)\` を定義して $N!$（$N$ の階乗）を計算し、出力してください。
ただし $0! = 1$ とします。

### 入力例
\`\`\`
5
\`\`\`

### 出力例
\`\`\`
120
\`\`\``,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["メソッド", "再帰"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static int factorial(int n) {
        // 再帰呼び出しを使って n! を返してください
        
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(factorial(n));
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static int factorial(int n) {
        if (n <= 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(factorial(n));
    }
}`,
    explanation_md: `再帰メソッドでは必ず「終了条件（ベースケース）」を先に記述します。\`n <= 1\` のとき \`1\` を返し、それ以外は \`n * factorial(n - 1)\` を返します。`,
    order_index: 3,
    test_cases: [
      {
        name: "公開テスト1：5! = 120",
        input: "5",
        expected_output: "120",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：0! = 1",
        input: "0",
        expected_output: "1",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：7! = 5040",
        input: "7",
        expected_output: "5040",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `再帰の終了条件として、\`if (n <= 1) return 1;\` を最初に書きます。`,
      },
      {
        step_number: 2,
        content_md: `$n! = n \\times (n - 1)!$ なので、自分自身を \`factorial(n - 1)\` として呼び出せます。`,
      },
      {
        step_number: 3,
        content_md: `\`return n * factorial(n - 1);\` を返せば完成です。`,
      },
    ],
  },

  // ===========================================================================
  // 第4章：クラスとオブジェクト（3問）
  // ===========================================================================
  {
    id: "44444444-4444-4444-8444-444444444410",
    chapter_id: "22222222-2222-4222-8222-222222222204",
    lesson_id: "33333333-3333-4333-8333-333333333304",
    title: "4-1. 商品クラス（Product）の定義とコンストラクタ",
    description_md: `### 問題概要
商品名 \`name\`（String）と単価 \`price\`（int）をフィールドに持つ \`Product\` クラスを作成してください。
- コンストラクタ \`Product(String name, int price)\` でフィールドを初期化する
- \`getTotalPrice(int quantity)\` メソッドで \`price * quantity\` を返す

標準入力から「商品名 単価 個数」が与えられるので、\`商品名: 合計金額円\` の形式で出力してください。

### 入力例
\`\`\`
Coffee 350 3
\`\`\`

### 出力例
\`\`\`
Coffee: 1050円
\`\`\``,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["オブジェクト指向", "クラス設計"],
    starter_code: `import java.util.Scanner;

class Product {
    String name;
    int price;

    // コンストラクタと getTotalPrice メソッドを実装してください
    
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        int price = sc.nextInt();
        int quantity = sc.nextInt();

        Product p = new Product(name, price);
        System.out.println(p.name + ": " + p.getTotalPrice(quantity) + "円");
    }
}`,
    solution_code: `import java.util.Scanner;

class Product {
    String name;
    int price;

    public Product(String name, int price) {
        this.name = name;
        this.price = price;
    }

    public int getTotalPrice(int quantity) {
        return this.price * quantity;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        int price = sc.nextInt();
        int quantity = sc.nextInt();

        Product p = new Product(name, price);
        System.out.println(p.name + ": " + p.getTotalPrice(quantity) + "円");
    }
}`,
    explanation_md: `コンストラクタ内で引数名とフィールド名が同じ場合は \`this.name = name;\` のように \`this\` キーワードを使って自身のフィールドを指し示します。`,
    order_index: 1,
    test_cases: [
      {
        name: "公開テスト1：Coffee 350 3",
        input: "Coffee 350 3",
        expected_output: "Coffee: 1050円",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：Notebook 240 5",
        input: "Notebook 240 5",
        expected_output: "Notebook: 1200円",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：Keyboard 12800 2",
        input: "Keyboard 12800 2",
        expected_output: "Keyboard: 25600円",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `コンストラクタはクラス名と同じ名前 \`public Product(String name, int price)\` で定義します（戻り値型は書きません）。`,
      },
      {
        step_number: 2,
        content_md: `コンストラクタの中で \`this.name = name; this.price = price;\` を代入します。`,
      },
      {
        step_number: 3,
        content_md: `\`public int getTotalPrice(int quantity) { return this.price * quantity; }\` を追加します。`,
      },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444444411",
    chapter_id: "22222222-2222-4222-8222-222222222204",
    lesson_id: "33333333-3333-4333-8333-333333333304",
    title: "4-2. 銀行口座クラス（カプセル化と残高チェック）",
    description_md: `### 問題概要
銀行口座を表す \`BankAccount\` クラスを実装してください。
- 初期残高 \`balance\` をコンストラクタで受け取る
- \`deposit(int amount)\`：残高に \`amount\` を加算する
- \`withdraw(int amount)\`：残高が \`amount\` 以上あれば減算し、足りない場合は減算せず \`Insufficient funds\` と出力する
- \`getBalance()\`：現在の残高を返す

### 入力例
\`\`\`
1000
500
1200
\`\`\`
（※初期残高 1000、預入 500、引出 1200）

### 出力例
\`\`\`
300
\`\`\``,
    difficulty: "medium",
    estimated_minutes: 20,
    tags: ["オブジェクト指向", "クラス設計", "条件分岐"],
    starter_code: `import java.util.Scanner;

class BankAccount {
    private int balance;

    public BankAccount(int initialBalance) {
        this.balance = initialBalance;
    }

    // deposit, withdraw, getBalance を実装してください
    
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int initial = sc.nextInt();
        int dep = sc.nextInt();
        int wit = sc.nextInt();

        BankAccount account = new BankAccount(initial);
        account.deposit(dep);
        account.withdraw(wit);
        System.out.println(account.getBalance());
    }
}`,
    solution_code: `import java.util.Scanner;

class BankAccount {
    private int balance;

    public BankAccount(int initialBalance) {
        this.balance = initialBalance;
    }

    public void deposit(int amount) {
        this.balance += amount;
    }

    public void withdraw(int amount) {
        if (this.balance >= amount) {
            this.balance -= amount;
        } else {
            System.out.println("Insufficient funds");
        }
    }

    public int getBalance() {
        return this.balance;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int initial = sc.nextInt();
        int dep = sc.nextInt();
        int wit = sc.nextInt();

        BankAccount account = new BankAccount(initial);
        account.deposit(dep);
        account.withdraw(wit);
        System.out.println(account.getBalance());
    }
}`,
    explanation_md: `フィールドを \`private\` にし、メソッド経由でのみ値を変更できるようにする設計を「カプセル化」と呼びます。\`withdraw\` メソッド内で不正な引き落としを防ぐチェックを入れられます。`,
    order_index: 2,
    test_cases: [
      {
        name: "公開テスト1：引き落とし成功 (1000 + 500 - 1200)",
        input: "1000\n500\n1200",
        expected_output: "300",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：残高不足 (1000 + 200 - 1500)",
        input: "1000\n200\n1500",
        expected_output: "Insufficient funds\n1200",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：残高ぴったり (500 + 500 - 1000)",
        input: "500\n500\n1000",
        expected_output: "0",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `\`public void deposit(int amount) { this.balance += amount; }\` で預け入れを実装します。`,
      },
      {
        step_number: 2,
        content_md: `\`withdraw\` では \`if (this.balance >= amount)\` のときだけ \`this.balance -= amount;\` を実行します。`,
      },
      {
        step_number: 3,
        content_md: `残高が足りない場合の \`else\` ブロックで \`System.out.println("Insufficient funds");\` を出力します。`,
      },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444444412",
    chapter_id: "22222222-2222-4222-8222-222222222204",
    lesson_id: "33333333-3333-4333-8333-333333333304",
    title: "4-3. クラスの継承とメソッドのオーバーライド",
    description_md: `### 問題概要
基底クラス \`Member\` を継承して、\`VipMember\` クラスを作成してください。
- \`Member\` クラスは \`getDiscountedPrice(int price)\` で **5%引き**（\`price * 95 / 100\`）を返します。
- \`VipMember\` クラスは \`Member\` を \`extends\` し、\`getDiscountedPrice(int price)\` をオーバーライドして **20%引き**（\`price * 80 / 100\`）を返すようにしてください。

### 入力例
\`\`\`
vip 10000
\`\`\`

### 出力例
\`\`\`
8000
\`\`\``,
    difficulty: "hard",
    estimated_minutes: 20,
    tags: ["オブジェクト指向", "継承", "ポリモーフィズム"],
    starter_code: `import java.util.Scanner;

class Member {
    public int getDiscountedPrice(int price) {
        return price * 95 / 100;
    }
}

// Member を継承する VipMember クラスを実装してください
class VipMember extends Member {
    
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        int price = sc.nextInt();

        Member m;
        if (type.equals("vip")) {
            m = new VipMember();
        } else {
            m = new Member();
        }
        System.out.println(m.getDiscountedPrice(price));
    }
}`,
    solution_code: `import java.util.Scanner;

class Member {
    public int getDiscountedPrice(int price) {
        return price * 95 / 100;
    }
}

class VipMember extends Member {
    @Override
    public int getDiscountedPrice(int price) {
        return price * 80 / 100;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        int price = sc.nextInt();

        Member m;
        if (type.equals("vip")) {
            m = new VipMember();
        } else {
            m = new Member();
        }
        System.out.println(m.getDiscountedPrice(price));
    }
}`,
    explanation_md: `親クラス型の変数 \`Member m\` に \`new VipMember()\` を代入しても、実行時には実体のクラス（\`VipMember\`）でオーバーライドされた \`getDiscountedPrice\` が呼ばれます。これをポリモーフィズム（多態性）と呼びます。`,
    order_index: 3,
    test_cases: [
      {
        name: "公開テスト1：vip 10000 (20% OFF)",
        input: "vip 10000",
        expected_output: "8000",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：regular 10000 (5% OFF)",
        input: "regular 10000",
        expected_output: "9500",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：vip 2500",
        input: "vip 2500",
        expected_output: "2000",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `\`VipMember\` クラスの中に \`public int getDiscountedPrice(int price)\` メソッドを定義します。`,
      },
      {
        step_number: 2,
        content_md: `20%引きは元の価格の80%なので \`return price * 80 / 100;\` と計算できます。`,
      },
      {
        step_number: 3,
        content_md: `\`@Override\` アノテーションを付けておくと、メソッド名のタイポを防げます。`,
      },
    ],
  },
];
