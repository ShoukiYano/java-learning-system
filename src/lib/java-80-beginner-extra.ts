import type { SeedProblem } from "@/lib/seed-data";

/**
 * Java初級コース 拡充問題（新規12問 → 初級合計18問）
 * 既存6問に追加し、二次元配列・メソッド設計・static・継承・抽象クラス・インターフェース・ポリモーフィズムを徹底定着させます。
 */

const B1_CH = "bf20e7ec-5d77-4543-bb06-f1a260271b59";
const B1_LS = "5347964f-04df-4e46-ae8a-a654826f9d73";
const B2_CH = "f62233bb-0095-4a76-80d3-6a70846ee360";
const B2_LS = "41302b0f-c345-4660-9dfe-6cf806c97783";

export const JAVA_BEGINNER_80_EXTRA: SeedProblem[] = [
  // --- 初級第1章（order_index 4..9） ---
  {
    id: "44444444-4444-4444-8444-444444442201",
    chapter_id: B1_CH,
    lesson_id: B1_LS,
    language: "java",
    title: "初級 1-4. 二次元配列の列ごと合計と最大列の特定",
    description_md: `## 問題文
\`R\` 行 \`C\` 列の整数表（店舗×月別売上など）が与えられます。
各列（0列目〜C-1列目）の合計を1行目に半角スペース区切りで出力し、2行目に「合計が最大となった列番号（0始まり、同点時は小さい番号）」を出力してください。

### 入力例
\`\`\`
2 3
10 20 30
40 50 10
\`\`\`

### 出力例
\`\`\`
50 70 40
1
\`\`\``,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["二次元配列", "列集計"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        int[][] grid = new int[r][c];
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) {
                grid[i][j] = sc.nextInt();
            }
        }
        // 列ごとの合計と最大列番号を出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        int[][] grid = new int[r][c];
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) {
                grid[i][j] = sc.nextInt();
            }
        }
        int bestCol = 0;
        int bestSum = -2147483648;
        String line = "";
        for (int j = 0; j < c; j++) {
            int colSum = 0;
            for (int i = 0; i < r; i++) {
                colSum += grid[i][j];
            }
            if (j > 0) line += " ";
            line += colSum;
            if (colSum > bestSum) {
                bestSum = colSum;
                bestCol = j;
            }
        }
        System.out.println(line);
        System.out.println(bestCol);
    }
}`,
    explanation_md: "列方向を集計するときは、外側のループを列 `j`、内側のループを行 `i` にするとスッキリ書けます。",
    order_index: 4,
    test_cases: [
      { name: "公開テスト1：2x3", input: "2 3\n10 20 30\n40 50 10\n", expected_output: "50 70 40\n1", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：3x2同点", input: "3 2\n10 20\n20 10\n10 10\n", expected_output: "40 40\n0", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "列ごとに集計するため、外側のループで列インデックス `j` を回しましょう。" },
      { step_number: 2, content_md: "同点時に小さい番号を優先するには、最大値更新の条件を `>` にします。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442202",
    chapter_id: B1_CH,
    lesson_id: B1_LS,
    language: "java",
    title: "初級 1-5. 会議室座席表（二次元配列）の予約＆残空席カウント",
    description_md: `## 問題文
\`R\` 行 \`C\` 列の座席（初期はすべて空席 \`0\`）に対し、\`Q\` 件の予約リクエスト（行 \`r\` 列 \`c\`）が来ます。
空席なら予約済（\`1\`）にして \`OK\`、すでに予約済なら \`TAKEN\` と出力し、最後に残りの空席数を出力してください。

### 入力例
\`\`\`
2 2
3
0 1
0 1
1 0
\`\`\`

### 出力例
\`\`\`
OK
TAKEN
OK
2
\`\`\``,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["二次元配列", "状態管理"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int rows = sc.nextInt();
        int cols = sc.nextInt();
        int q = sc.nextInt();
        // 二次元配列で座席予約と残空席数を処理してください
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int rows = sc.nextInt();
        int cols = sc.nextInt();
        int q = sc.nextInt();
        int[][] seats = new int[rows][cols];
        int reserved = 0;
        for (int i = 0; i < q; i++) {
            int r = sc.nextInt();
            int c = sc.nextInt();
            if (seats[r][c] == 0) {
                seats[r][c] = 1;
                reserved++;
                System.out.println("OK");
            } else {
                System.out.println("TAKEN");
            }
        }
        System.out.println(rows * cols - reserved);
    }
}`,
    explanation_md: "二次元配列の要素をフラグ（`0`/`1`）として管理すると、重複予約防止と残数算出がO(1)で行えます。",
    order_index: 5,
    test_cases: [
      { name: "公開テスト1：2x2で3件", input: "2 2\n3\n0 1\n0 1\n1 0\n", expected_output: "OK\nTAKEN\nOK\n2", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：全席予約", input: "1 2\n2\n0 0\n0 1\n", expected_output: "OK\nOK\n0", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "`int[][] seats = new int[rows][cols];` は自動的にすべて `0` で初期化されます。" },
      { step_number: 2, content_md: "残りの空席数は「総席数 `rows * cols` − 予約成功回数」でも求められます。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442203",
    chapter_id: B1_CH,
    lesson_id: B1_LS,
    language: "java",
    title: "初級 1-6. メソッドのオーバーロード（2引数・3引数の最大値）",
    description_md: `## 問題文
同名メソッド \`maxVal\` をオーバーロードして2つ定義してください。
1. \`maxVal(int a, int b)\`：2つの整数の大きい方を返す
2. \`maxVal(int a, int b, int c)\`：3つの整数の最大値を返す

入力として3つの整数 \`a, b, c\` が与えられます。1行目に \`maxVal(a, b)\`、2行目に \`maxVal(a, b, c)\` を出力してください。`,
    difficulty: "easy",
    estimated_minutes: 12,
    tags: ["メソッド", "オーバーロード"],
    starter_code: `import java.util.Scanner;

public class Main {
    // maxVal を2引数・3引数でオーバーロードしてください

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        // 結果を2行で出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static int maxVal(int a, int b) {
        return a >= b ? a : b;
    }

    public static int maxVal(int a, int b, int c) {
        return maxVal(maxVal(a, b), c);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        System.out.println(maxVal(a, b));
        System.out.println(maxVal(a, b, c));
    }
}`,
    explanation_md: "3引数版の中で2引数版を呼び出すと、重複ロジックを排除できます。",
    order_index: 6,
    test_cases: [
      { name: "公開テスト1：10 25 18", input: "10 25 18\n", expected_output: "25\n25", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：-5 -2 0", input: "-5 -2 0\n", expected_output: "-2\n0", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "引数の個数が異なれば、同じメソッド名 `maxVal` を複数定義できます。" },
      { step_number: 2, content_md: "3引数の最大値は、2引数版を2回組み合わせるだけで簡潔に書けます。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442204",
    chapter_id: B1_CH,
    lesson_id: B1_LS,
    language: "java",
    title: "初級 1-7. 配列の昇順ソートと上位K件の合計（メソッド実装）",
    description_md: `## 問題文
整数 \`N\`, \`K\` と \`N\` 個のスコアが与えられます。
スコアを大きい順に見たときの上位 \`K\` 件の合計を返すメソッド \`sumTopK(int[] arr, int k)\` を実装し、結果を出力してください。`,
    difficulty: "medium",
    estimated_minutes: 20,
    tags: ["配列", "ソート", "メソッド"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static int sumTopK(int[] arr, int k) {
        // 並べ替えて上位k件の合計を返してください
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(sumTopK(arr, k));
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static int sumTopK(int[] arr, int k) {
        for (int i = 0; i < arr.length - 1; i++) {
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[j] > arr[i]) {
                    int tmp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = tmp;
                }
            }
        }
        int sum = 0;
        for (int i = 0; i < k && i < arr.length; i++) {
            sum += arr[i];
        }
        return sum;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(sumTopK(arr, k));
    }
}`,
    explanation_md: "降順に並べ替えて先頭から `k` 件を足すアルゴリズムは、ランキング集計の基礎です。",
    order_index: 7,
    test_cases: [
      { name: "公開テスト1：5件中上位2件", input: "5 2\n40 90 70 100 60\n", expected_output: "190", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：4件中上位3件", input: "4 3\n10 50 30 20\n", expected_output: "100", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "二重ループで大きい値を先頭側へ交換（降順ソート）してみましょう。" },
      { step_number: 2, content_md: "ソート後、インデックス `0` から `k - 1` までを足し合わせます。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442205",
    chapter_id: B1_CH,
    lesson_id: B1_LS,
    language: "java",
    title: "初級 1-8. 配列内のユニーク要素数を数えるメソッド",
    description_md: `## 問題文
整数 \`N\` と \`N\` 個の整数が与えられます。重複を除いた「異なる値の種類数」を返すメソッド \`countUnique(int[] arr)\` を実装してください。`,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["配列", "重複判定", "メソッド"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static int countUnique(int[] arr) {
        // 重複を除いた種類数を返してください
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(countUnique(arr));
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static int countUnique(int[] arr) {
        int count = 0;
        for (int i = 0; i < arr.length; i++) {
            boolean seen = false;
            for (int j = 0; j < i; j++) {
                if (arr[j] == arr[i]) {
                    seen = true;
                    break;
                }
            }
            if (!seen) count++;
        }
        return count;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(countUnique(arr));
    }
}`,
    explanation_md: "各要素 `i` について「それより前（`0..i-1`）に同じ値が出ていなければカウント+1」とする定番テクニックです。",
    order_index: 8,
    test_cases: [
      { name: "公開テスト1：重複あり", input: "6\n10 20 10 30 20 10\n", expected_output: "3", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：すべて同一", input: "4\n5 5 5 5\n", expected_output: "1", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "インデックス `i` より前の位置に `arr[i]` と同じ値があるかどうかを内側ループで確認します。" },
      { step_number: 2, content_md: "まだ一度も登場していないときだけカウンタを増やしましょう。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442206",
    chapter_id: B1_CH,
    lesson_id: B1_LS,
    language: "java",
    title: "初級 1-9. 成績マトリクス（生徒×科目）の個人合計＆トップ生徒判定",
    description_md: `## 問題文
\`S\` 人の生徒と \`M\` 科目の点数が二次元配列として与えられます。
各生徒の合計点を1行ずつ出力し、最終行に「合計点が最も高い生徒番号（1始まり、同点時は小さい番号）」を出力してください。`,
    difficulty: "medium",
    estimated_minutes: 20,
    tags: ["二次元配列", "行集計"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int s = sc.nextInt();
        int m = sc.nextInt();
        int[][] scores = new int[s][m];
        for (int i = 0; i < s; i++) {
            for (int j = 0; j < m; j++) {
                scores[i][j] = sc.nextInt();
            }
        }
        // 各生徒の合計とトップ生徒番号(1始まり)を出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int s = sc.nextInt();
        int m = sc.nextInt();
        int[][] scores = new int[s][m];
        for (int i = 0; i < s; i++) {
            for (int j = 0; j < m; j++) {
                scores[i][j] = sc.nextInt();
            }
        }
        int bestIdx = 0;
        int bestSum = -1;
        for (int i = 0; i < s; i++) {
            int rowSum = 0;
            for (int j = 0; j < m; j++) {
                rowSum += scores[i][j];
            }
            System.out.println(rowSum);
            if (rowSum > bestSum) {
                bestSum = rowSum;
                bestIdx = i;
            }
        }
        System.out.println(bestIdx + 1);
    }
}`,
    explanation_md: "生徒番号は1始まりなので、最後に `bestIdx + 1` とする点に注意しましょう。",
    order_index: 9,
    test_cases: [
      { name: "公開テスト1：3名×2科目", input: "3 2\n70 80\n90 85\n60 95\n", expected_output: "150\n175\n155\n2", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：2名×3科目", input: "2 3\n50 50 50\n40 60 50\n", expected_output: "150\n150\n1", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "行ごとに合計を求めながら出力し、同時に最大値とインデックスを更新します。" },
      { step_number: 2, content_md: "出力するトップ番号は0始まりではなく1始まり（`+ 1`）です。" },
    ],
  },

  // --- 初級第2章（order_index 4..9） ---
  {
    id: "44444444-4444-4444-8444-444444442207",
    chapter_id: B2_CH,
    lesson_id: B2_LS,
    language: "java",
    title: "初級 2-4. staticカウンタによる注文番号の自動採番クラス",
    description_md: `## 問題文
\`Order\` クラスを作成し、インスタンスを生成するたびに \`static\` 変数で \`1001, 1002, 1003, ...\` と自動採番される注文IDと商品名を持たせてください。
\`N\` 件の商品名が入力されるので、生成順に \`ORD-<ID>: <商品名>\` を出力してください。`,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["static", "コンストラクタ", "オブジェクト指向"],
    starter_code: `import java.util.Scanner;

class Order {
    // static変数とインスタンス変数を定義してください
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Order をn件生成して出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

class Order {
    private static int nextId = 1001;
    private int id;
    private String itemName;

    public Order(String itemName) {
        this.id = nextId++;
        this.itemName = itemName;
    }

    public String format() {
        return "ORD-" + id + ": " + itemName;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            Order o = new Order(sc.next());
            System.out.println(o.format());
        }
    }
}`,
    explanation_md: "`static` フィールドはクラス全体で1つだけ共有されるため、連番IDの発行に活用できます。",
    order_index: 4,
    test_cases: [
      { name: "公開テスト1：3件採番", input: "3\nPC\nMouse\nHub\n", expected_output: "ORD-1001: PC\nORD-1002: Mouse\nORD-1003: Hub", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：1件採番", input: "1\nMonitor\n", expected_output: "ORD-1001: Monitor", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "`private static int nextId = 1001;` のようにクラス共通の連番変数を用意します。" },
      { step_number: 2, content_md: "コンストラクタの中で自分の `id` に代入しつつ `nextId` を1増やしましょう。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442208",
    chapter_id: B2_CH,
    lesson_id: B2_LS,
    language: "java",
    title: "初級 2-5. 継承とsuperによる一般社員・管理職の給与計算",
    description_md: `## 問題文
基本給 \`baseSalary\` を返す \`Staff\` クラスと、それを継承して役職手当 \`allowance\` を加算する \`Manager\` クラスを作成してください。
\`N\` 名のデータ（\`STAFF 氏名 基本給\` または \`MANAGER 氏名 基本給 手当\`）を読み込み、\`<氏名>: <支給額>\` を出力してください。`,
    difficulty: "medium",
    estimated_minutes: 20,
    tags: ["継承", "super", "オーバーライド"],
    starter_code: `import java.util.Scanner;

class Staff {
    // 実装してください
}

class Manager extends Staff {
    // super を使って実装してください
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // ポリモーフィズムで給与計算結果を出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

class Staff {
    protected String name;
    protected int baseSalary;

    public Staff(String name, int baseSalary) {
        this.name = name;
        this.baseSalary = baseSalary;
    }

    public int calcPay() {
        return baseSalary;
    }

    public String getName() {
        return name;
    }
}

class Manager extends Staff {
    private int allowance;

    public Manager(String name, int baseSalary, int allowance) {
        super(name, baseSalary);
        this.allowance = allowance;
    }

    @Override
    public int calcPay() {
        return super.calcPay() + allowance;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Staff[] members = new Staff[n];
        for (int i = 0; i < n; i++) {
            String type = sc.next();
            String name = sc.next();
            int base = sc.nextInt();
            if (type.equals("MANAGER")) {
                int allow = sc.nextInt();
                members[i] = new Manager(name, base, allow);
            } else {
                members[i] = new Staff(name, base);
            }
        }
        for (int i = 0; i < n; i++) {
            System.out.println(members[i].getName() + ": " + members[i].calcPay());
        }
    }
}`,
    explanation_md: "子クラスから `super(name, baseSalary)` で親コンストラクタを呼び出し、`calcPay()` をオーバーライドすることで共通型 `Staff[]` で統一処理できます。",
    order_index: 5,
    test_cases: [
      { name: "公開テスト1：一般＋管理職", input: "2\nSTAFF 佐藤 250000\nMANAGER 山田 350000 50000\n", expected_output: "佐藤: 250000\n山田: 400000", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：管理職のみ", input: "1\nMANAGER 鈴木 300000 80000\n", expected_output: "鈴木: 380000", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "`Manager` のコンストラクタ先頭で `super(name, baseSalary);` を呼び出します。" },
      { step_number: 2, content_md: "親クラス型 `Staff[]` の配列に `Staff` と `Manager` の両方を格納できます。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442209",
    chapter_id: B2_CH,
    lesson_id: B2_LS,
    language: "java",
    title: "初級 2-6. 抽象クラス（Shape）による図形面積の一括合計",
    description_md: `## 問題文
抽象メソッド \`int area()\` を持つ抽象クラス \`Shape\` を定義し、\`RectShape\`（幅×高さ）と \`TriShape\`（底辺×高さ÷2）で実装してください。
\`N\` 個の図形（\`RECT w h\` または \`TRI b h\`）の面積合計を出力してください。`,
    difficulty: "medium",
    estimated_minutes: 20,
    tags: ["抽象クラス", "ポリモーフィズム"],
    starter_code: `import java.util.Scanner;

abstract class Shape {
    public abstract int area();
}

// RectShape と TriShape を実装してください

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Shape配列で面積合計を出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

abstract class Shape {
    public abstract int area();
}

class RectShape extends Shape {
    private int w, h;
    public RectShape(int w, int h) { this.w = w; this.h = h; }
    @Override
    public int area() { return w * h; }
}

class TriShape extends Shape {
    private int b, h;
    public TriShape(int b, int h) { this.b = b; this.h = h; }
    @Override
    public int area() { return b * h / 2; }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Shape[] shapes = new Shape[n];
        for (int i = 0; i < n; i++) {
            String kind = sc.next();
            int a = sc.nextInt();
            int b = sc.nextInt();
            if (kind.equals("RECT")) shapes[i] = new RectShape(a, b);
            else shapes[i] = new TriShape(a, b);
        }
        int total = 0;
        for (int i = 0; i < n; i++) total += shapes[i].area();
        System.out.println(total);
    }
}`,
    explanation_md: "抽象クラスで「必ず `area()` を実装させる」契約を作ることで、呼び出し側は図形の種類を意識せず集計できます。",
    order_index: 6,
    test_cases: [
      { name: "公開テスト1：長方形＋三角形", input: "2\nRECT 4 5\nTRI 6 4\n", expected_output: "32", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：3図形", input: "3\nRECT 3 3\nTRI 10 2\nRECT 2 5\n", expected_output: "29", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "`extends Shape` したクラスで `public int area()` をオーバーライドします。" },
      { step_number: 2, content_md: "`Shape[]` に格納し、ループで `shapes[i].area()` を足し合わせましょう。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442210",
    chapter_id: B2_CH,
    lesson_id: B2_LS,
    language: "java",
    title: "初級 2-7. インターフェース（DiscountPolicy）による会員ランク別割引",
    description_md: `## 問題文
\`int apply(int price)\` を持つインターフェース \`DiscountPolicy\` を定義し、以下の2クラスを実装してください。
- \`RegularPolicy\`：5%引き（\`price * 95 / 100\`）
- \`VipPolicy\`：20%引き（\`price * 80 / 100\`）

会員種別（\`REGULAR\` または \`VIP\`）と定価が与えられるので、割引後価格を出力してください。`,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["インターフェース", "Strategyパターン"],
    starter_code: `import java.util.Scanner;

interface DiscountPolicy {
    int apply(int price);
}

// RegularPolicy と VipPolicy を実装してください

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String rank = sc.next();
        int price = sc.nextInt();
        // DiscountPolicy を使って割引後価格を出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

interface DiscountPolicy {
    int apply(int price);
}

class RegularPolicy implements DiscountPolicy {
    @Override
    public int apply(int price) {
        return price * 95 / 100;
    }
}

class VipPolicy implements DiscountPolicy {
    @Override
    public int apply(int price) {
        return price * 80 / 100;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String rank = sc.next();
        int price = sc.nextInt();
        DiscountPolicy policy = rank.equals("VIP") ? new VipPolicy() : new RegularPolicy();
        System.out.println(policy.apply(price));
    }
}`,
    explanation_md: "割引ルールをインターフェースとして差し替え可能にする設計は、実務でよく使う Strategy パターンの基本形です。",
    order_index: 7,
    test_cases: [
      { name: "公開テスト1：VIP 10000円", input: "VIP 10000\n", expected_output: "8000", is_hidden: false, order_index: 1 },
      { name: "公開テスト2：REGULAR 10000円", input: "REGULAR 10000\n", expected_output: "9500", is_hidden: false, order_index: 2 },
      { name: "非公開テスト：VIP 2500円", input: "VIP 2500\n", expected_output: "2000", is_hidden: true, order_index: 3 },
    ],
    hints: [
      { step_number: 1, content_md: "`implements DiscountPolicy` を付けた2つのクラスを作成します。" },
      { step_number: 2, content_md: "変数の型を `DiscountPolicy` にしておくと、どちらのインスタンスも同じ呼び出し方で計算できます。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442211",
    chapter_id: B2_CH,
    lesson_id: B2_LS,
    language: "java",
    title: "初級 2-8. ポリモーフィズムによるマルチチャネル通知送信",
    description_md: `## 問題文
\`String send(String msg)\` を持つインターフェース \`Notifier\` を定義し、
- \`EmailNotifier\`：\`"[EMAIL] " + msg\`
- \`SlackNotifier\`：\`"[SLACK] " + msg\`
を返すクラスを実装してください。

\`N\` 件の送信先種別（\`EMAIL\` / \`SLACK\`）とメッセージ文字列を読み込み、送信結果を1行ずつ出力してください。`,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["インターフェース", "ポリモーフィズム"],
    starter_code: `import java.util.Scanner;

interface Notifier {
    String send(String msg);
}

// EmailNotifier と SlackNotifier を実装してください

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // 通知を順番に送信出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

interface Notifier {
    String send(String msg);
}

class EmailNotifier implements Notifier {
    @Override
    public String send(String msg) { return "[EMAIL] " + msg; }
}

class SlackNotifier implements Notifier {
    @Override
    public String send(String msg) { return "[SLACK] " + msg; }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String ch = sc.next();
            String msg = sc.next();
            Notifier notifier = ch.equals("SLACK") ? new SlackNotifier() : new EmailNotifier();
            System.out.println(notifier.send(msg));
        }
    }
}`,
    explanation_md: "Spring BootのDI（依存性注入）でも、このようにインターフェース型で受けて実装クラスを切り替える設計が基本となります。",
    order_index: 8,
    test_cases: [
      { name: "公開テスト1：2件通知", input: "2\nEMAIL Welcome\nSLACK Alert\n", expected_output: "[EMAIL] Welcome\n[SLACK] Alert", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：1件通知", input: "1\nSLACK DeployOK\n", expected_output: "[SLACK] DeployOK", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "送信種別に応じて `EmailNotifier` または `SlackNotifier` を生成し、`Notifier` 型変数へ代入します。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442212",
    chapter_id: B2_CH,
    lesson_id: B2_LS,
    language: "java",
    title: "初級 2-9. 【初級総合】複数決済手段の合計手数料計算システム",
    description_md: `## 問題文
\`int calcFee(int amount)\` を持つインターフェース \`FeeCalculator\` を定義し、以下の決済手数料を実装してください。
- \`CARD\`：決済額の3%（\`amount * 3 / 100\`）
- \`BANK\`：一律220円
- \`CASH\`：0円

\`N\` 件の決済データ（\`種別 金額\`）を読み込み、全件の手数料合計を出力してください。`,
    difficulty: "medium",
    estimated_minutes: 25,
    tags: ["インターフェース", "総合演習", "オブジェクト指向"],
    starter_code: `import java.util.Scanner;

interface FeeCalculator {
    int calcFee(int amount);
}

// 3つの決済手数料クラスを実装してください

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // N件の手数料合計を出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

interface FeeCalculator {
    int calcFee(int amount);
}

class CardFee implements FeeCalculator {
    @Override
    public int calcFee(int amount) { return amount * 3 / 100; }
}

class BankFee implements FeeCalculator {
    @Override
    public int calcFee(int amount) { return 220; }
}

class CashFee implements FeeCalculator {
    @Override
    public int calcFee(int amount) { return 0; }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int totalFee = 0;
        for (int i = 0; i < n; i++) {
            String type = sc.next();
            int amount = sc.nextInt();
            FeeCalculator calc;
            if (type.equals("CARD")) calc = new CardFee();
            else if (type.equals("BANK")) calc = new BankFee();
            else calc = new CashFee();
            totalFee += calc.calcFee(amount);
        }
        System.out.println(totalFee);
    }
}`,
    explanation_md: "初級の総仕上げとして、インターフェースによるポリモーフィズムとループ集計を組み合わせた実務的な決済手数料計算を完成させました。",
    order_index: 9,
    test_cases: [
      { name: "公開テスト1：3種混在", input: "3\nCARD 10000\nBANK 5000\nCASH 3000\n", expected_output: "520", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：CARD2件", input: "2\nCARD 5000\nCARD 2000\n", expected_output: "210", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "決済種別ごとに3つのクラスを作成し、共通の `FeeCalculator` 変数で受け取ります。" },
      { step_number: 2, content_md: "ループ内で各決済の `calcFee(amount)` を合計変数へ加算しましょう。" },
    ],
  },
];
