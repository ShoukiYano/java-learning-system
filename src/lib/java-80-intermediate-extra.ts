import type { SeedProblem } from "@/lib/seed-data";

/**
 * Java中級コース 拡充問題（新規10問 → 中級合計16問）
 * ArrayList / HashMap / CSVパース / 文字列クレンジング / 例外ハンドリングの実務反復ドリル
 */

const I1_CH = "f0721c45-037c-49d0-8393-98bb86ce3523";
const I1_LS = "1177c80b-bcc9-4745-a4f8-7caf1ef01327";
const I2_CH = "7bb76c60-bac2-408b-a0f5-cb69f0546f13";
const I2_LS = "06f2d4e3-729c-4392-8945-9af33d7833e5";

export const JAVA_INTERMEDIATE_80_EXTRA: SeedProblem[] = [
  // --- 中級第1章（order_index 4..8） ---
  {
    id: "44444444-4444-4444-8444-444444442301",
    chapter_id: I1_CH,
    lesson_id: I1_LS,
    language: "java",
    title: "中級 1-4. ArrayListによる価格フィルタリングと抽出一覧",
    description_md: `## 問題文
\`N\` 件の「商品名 単価」と上限金額 \`maxPrice\` が与えられます。
単価が \`maxPrice\` 以下の商品名だけを \`ArrayList<String>\` へ格納し、件数を1行目に、該当商品名を登録順で2行目以降に出力してください（0件時は1行目に \`0\` のみ）。`,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["ArrayList", "フィルタリング"],
    starter_code: `import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // ArrayList を使って条件に合う商品を抽出してください
    }
}`,
    solution_code: `import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        String[] names = new String[n];
        int[] prices = new int[n];
        for (int i = 0; i < n; i++) {
            names[i] = sc.next();
            prices[i] = sc.nextInt();
        }
        int maxPrice = sc.nextInt();
        ArrayList<String> matched = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if (prices[i] <= maxPrice) {
                matched.add(names[i]);
            }
        }
        System.out.println(matched.size());
        for (int i = 0; i < matched.size(); i++) {
            System.out.println(matched.get(i));
        }
    }
}`,
    explanation_md: "事前に件数が分からない抽出結果は、可変長の `ArrayList` へ `add()` していくのがJavaの標準です。",
    order_index: 4,
    test_cases: [
      { name: "公開テスト1：3件中2件ヒット", input: "3\nPC 120000\nMouse 3500\nHub 4800\n5000\n", expected_output: "2\nMouse\nHub", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：0件", input: "2\nPC 100000\nMonitor 40000\n10000\n", expected_output: "0", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "まず全件の商品名・価格を読み込み、最後に `maxPrice` を読み込んで比較しましょう。" },
      { step_number: 2, content_md: "一致した商品名を `ArrayList<String>` に `add` し、`size()` と各要素を出力します。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442302",
    chapter_id: I1_CH,
    lesson_id: I1_LS,
    language: "java",
    title: "中級 1-5. HashMapによるエラーログコードの出現回数カウント",
    description_md: `## 問題文
\`N\` 件のエラーコード（例：\`E404\`, \`E500\`）と、調査対象コード \`target\` が与えられます。
\`HashMap<String, Integer>\` を使って各コードの出現回数を集計し、\`target\` の出現回数（未出現なら \`0\`）を出力してください。`,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["HashMap", "ログ集計"],
    starter_code: `import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // HashMap で出現回数をカウントしてください
    }
}`,
    solution_code: `import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        HashMap<String, Integer> counts = new HashMap<>();
        for (int i = 0; i < n; i++) {
            String code = sc.next();
            int prev = counts.containsKey(code) ? counts.get(code) : 0;
            counts.put(code, prev + 1);
        }
        String target = sc.next();
        System.out.println(counts.containsKey(target) ? counts.get(target) : 0);
    }
}`,
    explanation_md: "`HashMap` で `containsKey`（または `getOrDefault`）を使ってカウントアップする処理は、アクセスログ解析や集計APIで頻出です。",
    order_index: 5,
    test_cases: [
      { name: "公開テスト1：E404カウント", input: "5\nE404 E500 E404 E403 E404\nE404\n", expected_output: "3", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：未存在コード", input: "3\nE404 E500 E500\nE401\n", expected_output: "0", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "すでにキーが存在すれば現在の値に `+1`、存在しなければ `1` を `put` します。" },
      { step_number: 2, content_md: "調査対象がマップに存在しない場合は `null` 回避のため `0` を出力しましょう。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442303",
    chapter_id: I1_CH,
    lesson_id: I1_LS,
    language: "java",
    title: "中級 1-6. HashMapによる部署別メンバー数の集計（入力順維持）",
    description_md: `## 問題文
\`N\` 名の「氏名 部署名」が与えられます。
部署ごとの人数を集計し、**部署が最初に登場した順番** で \`<部署名>: <人数>\` を出力してください。`,
    difficulty: "medium",
    estimated_minutes: 20,
    tags: ["HashMap", "ArrayList", "グループ集計"],
    starter_code: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // 部署の初出順を保ちながら人数を集計してください
    }
}`,
    solution_code: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        ArrayList<String> order = new ArrayList<>();
        HashMap<String, Integer> counts = new HashMap<>();
        for (int i = 0; i < n; i++) {
            sc.next(); // name
            String dept = sc.next();
            if (!counts.containsKey(dept)) {
                order.add(dept);
                counts.put(dept, 1);
            } else {
                counts.put(dept, counts.get(dept) + 1);
            }
        }
        for (int i = 0; i < order.size(); i++) {
            String d = order.get(i);
            System.out.println(d + ": " + counts.get(d));
        }
    }
}`,
    explanation_md: "`HashMap` 自体は順序を保証しないため、キーの初出順を `ArrayList` に記録しておくと安定した出力順を保てます。",
    order_index: 6,
    test_cases: [
      { name: "公開テスト1：3部署", input: "4\n山田 開発\n佐藤 営業\n鈴木 開発\n高橋 総務\n", expected_output: "開発: 2\n営業: 1\n総務: 1", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：1部署のみ", input: "2\nA 開発\nB 開発\n", expected_output: "開発: 2", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "`HashMap` で人数を数えつつ、初登場の部署名だけを `ArrayList` に追加しておきます。" },
      { step_number: 2, content_md: "最後に `ArrayList` の順番で `HashMap` から人数を取り出して出力しましょう。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442304",
    chapter_id: I1_CH,
    lesson_id: I1_LS,
    language: "java",
    title: "中級 1-7. ArrayListによる重複ID除去と出現順リスト作成",
    description_md: `## 問題文
\`N\` 件の顧客ID（文字列）が与えられます。重複を除去し、最初に現れた順番で半角スペース区切りに出力してください。`,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["ArrayList", "重複除去"],
    starter_code: `import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // 重複を除去してスペース区切りで出力してください
    }
}`,
    solution_code: `import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        ArrayList<String> unique = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            String id = sc.next();
            if (!unique.contains(id)) {
                unique.add(id);
            }
        }
        String out = "";
        for (int i = 0; i < unique.size(); i++) {
            if (i > 0) out += " ";
            out += unique.get(i);
        }
        System.out.println(out);
    }
}`,
    explanation_md: "`ArrayList.contains()` を使うと、重複チェックと順序維持を簡潔に実装できます。",
    order_index: 7,
    test_cases: [
      { name: "公開テスト1：重複あり", input: "5\nC01 C02 C01 C03 C02\n", expected_output: "C01 C02 C03", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：重複なし", input: "3\nA B C\n", expected_output: "A B C", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "`!list.contains(id)` のときだけ `list.add(id)` すると重複を防げます。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442305",
    chapter_id: I1_CH,
    lesson_id: I1_LS,
    language: "java",
    title: "中級 1-8. 商品マスタ（HashMap）参照による複数注文の合計算出",
    description_md: `## 問題文
まず \`M\` 件の商品マスタ（\`商品コード 単価\`）が与えられ、続いて \`Q\` 件の注文（\`商品コード 数量\`）が与えられます。
\`HashMap<String, Integer>\` にマスタを登録し、注文の合計金額を出力してください（マスタに存在しない商品コードは無視してください）。`,
    difficulty: "medium",
    estimated_minutes: 20,
    tags: ["HashMap", "マスタ参照", "業務集計"],
    starter_code: `import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        // マスタをHashMapに登録し、注文合計を計算してください
    }
}`,
    solution_code: `import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        HashMap<String, Integer> master = new HashMap<>();
        for (int i = 0; i < m; i++) {
            master.put(sc.next(), sc.nextInt());
        }
        int q = sc.nextInt();
        int total = 0;
        for (int i = 0; i < q; i++) {
            String code = sc.next();
            int qty = sc.nextInt();
            if (master.containsKey(code)) {
                total += master.get(code) * qty;
            }
        }
        System.out.println(total);
    }
}`,
    explanation_md: "ExcelのVLOOKUPに相当するマスタ参照は、Javaでは `HashMap` を使うと高速（O(1)）に処理できます。",
    order_index: 8,
    test_cases: [
      { name: "公開テスト1：未存在コード含む", input: "2\nP01 1000\nP02 2500\n3\nP01 2\nP99 5\nP02 1\n", expected_output: "4500", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：全件有効", input: "2\nA 300\nB 400\n2\nA 3\nB 2\n", expected_output: "1700", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "商品コードをキー、単価を値として `HashMap` へ登録します。" },
      { step_number: 2, content_md: "注文処理時は `containsKey` で存在チェックしてから単価×数量を加算しましょう。" },
    ],
  },

  // --- 中級第2章（order_index 4..8） ---
  {
    id: "44444444-4444-4444-8444-444444442306",
    chapter_id: I2_CH,
    lesson_id: I2_LS,
    language: "java",
    title: "中級 2-4. CSV売上明細のパースと合計金額計算",
    description_md: `## 問題文
\`N\` 行のCSV文字列（\`商品名,単価,数量\` 形式）が与えられます。
各行を \`split(",")\` で分割し、\`Integer.parseInt\` で数値変換して全行の売上合計（単価×数量の総和）を出力してください。`,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["CSV処理", "split", "文字列API"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // N行のCSV（商品名,単価,数量）をパースして合計を出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int total = 0;
        for (int i = 0; i < n; i++) {
            String row = sc.next();
            String[] cols = row.split(",");
            int price = Integer.parseInt(cols[1]);
            int qty = Integer.parseInt(cols[2]);
            total += price * qty;
        }
        System.out.println(total);
    }
}`,
    explanation_md: "カンマ区切り文字列を `split(\",\")` で配列にし、`Integer.parseInt` で数値化するのはバッチ処理の基本です。",
    order_index: 4,
    test_cases: [
      { name: "公開テスト1：2行CSV", input: "2\nPen,120,5\nNote,250,2\n", expected_output: "1100", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：3行CSV", input: "3\nA,100,1\nB,200,2\nC,300,3\n", expected_output: "1400", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "1行を `split(\",\")` で分割すると、`cols[1]` が単価、`cols[2]` が数量になります。" },
      { step_number: 2, content_md: "文字列から `int` への変換には `Integer.parseInt(...)` を使います。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442307",
    chapter_id: I2_CH,
    lesson_id: I2_LS,
    language: "java",
    title: "中級 2-5. 不正数値を含むデータのtry-catchスキップ集計",
    description_md: `## 問題文
\`N\` 個の文字列が与えられます。整数に変換できるものだけを合計し、変換できない不正文字列は \`try-catch\` でスキップして件数を数えてください。
1行目に「有効な数値の合計」、2行目に「スキップした不正件数」を出力してください。`,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["例外処理", "try-catch", "NumberFormatException"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // try-catch で不正データをスキップしながら集計してください
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int sum = 0;
        int errors = 0;
        for (int i = 0; i < n; i++) {
            String token = sc.next();
            try {
                sum += Integer.parseInt(token);
            } catch (Exception e) {
                errors++;
            }
        }
        System.out.println(sum);
        System.out.println(errors);
    }
}`,
    explanation_md: "外部CSV取り込みなどでは1件の不正データで処理全体を落とさず、`try-catch` で捕捉してエラー件数を記録する設計がよく使われます。",
    order_index: 5,
    test_cases: [
      { name: "公開テスト1：不正2件混在", input: "5\n100 abc 250 N/A 50\n", expected_output: "400\n2", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：すべて正常", input: "3\n10 20 30\n", expected_output: "60\n0", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "`Integer.parseInt(token)` を `try` ブロック内で実行し、失敗時は `catch` ブロックでエラー件数を増やします。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442308",
    chapter_id: I2_CH,
    lesson_id: I2_LS,
    language: "java",
    title: "中級 2-6. メールアドレスの形式チェックとドメイン抽出",
    description_md: `## 問題文
\`N\` 件のメールアドレス候補文字列が与えられます。
\`@\` を含み、\`@\` の前後に1文字以上ある場合は \`@\` 以降のドメイン部分を小文字で出力し、それ以外は \`INVALID\` と出力してください。`,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["文字列API", "indexOf", "substring"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // 各文字列のドメイン抽出または INVALID 出力を行ってください
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String s = sc.next();
            int at = s.indexOf("@");
            if (at > 0 && at < s.length() - 1) {
                System.out.println(s.substring(at + 1).toLowerCase());
            } else {
                System.out.println("INVALID");
            }
        }
    }
}`,
    explanation_md: "`indexOf(\"@\")` が `> 0` かつ `< length() - 1` であることを確認すると、先頭・末尾の `@` も安全に弾けます。",
    order_index: 6,
    test_cases: [
      { name: "公開テスト1：正常と異常", input: "3\nUser@Example.COM\n@invalid.com\nno_at_mark\n", expected_output: "example.com\nINVALID\nINVALID", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：末尾@", input: "2\nabc@\na@b.jp\n", expected_output: "INVALID\nb.jp", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "`indexOf(\"@\")` で `@` の位置を探し、`0` より大きく末尾より前かを判定します。" },
      { step_number: 2, content_md: "`substring(at + 1).toLowerCase()` でドメイン部分を小文字化して取得できます。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442309",
    chapter_id: I2_CH,
    lesson_id: I2_LS,
    language: "java",
    title: "中級 2-7. throwによる年齢バリデーションメソッドと例外捕捉",
    description_md: `## 問題文
年齢 \`age\` を検証するメソッド \`validateAge(int age)\` を作成してください。
- \`age < 0\` または \`age > 120\` の場合は \`throw new IllegalArgumentException("OUT_OF_RANGE")\` をスローする
- 範囲内なら何もしない

\`N\` 件の年齢入力に対し、\`main\` 側で \`try-catch\` して正常なら \`OK\`、例外時はメッセージ（\`e.getMessage()\`）を出力してください。`,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["例外処理", "throw", "バリデーション"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void validateAge(int age) {
        // 範囲外なら IllegalArgumentException をスローしてください
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // 各入力を validateAge で検証して出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void validateAge(int age) {
        if (age < 0 || age > 120) {
            throw new IllegalArgumentException("OUT_OF_RANGE");
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            int age = sc.nextInt();
            try {
                validateAge(age);
                System.out.println("OK");
            } catch (IllegalArgumentException e) {
                System.out.println(e.getMessage());
            }
        }
    }
}`,
    explanation_md: "検証ロジック側で `throw` し、呼び出し側で `catch` してエラー応答を返すパターンはSpring BootのService/Controller設計に直結します。",
    order_index: 7,
    test_cases: [
      { name: "公開テスト1：境界値含む", input: "4\n0 25 -1 121\n", expected_output: "OK\nOK\nOUT_OF_RANGE\nOUT_OF_RANGE", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：120歳", input: "2\n120 150\n", expected_output: "OK\nOUT_OF_RANGE", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "`if (age < 0 || age > 120)` のときに `throw new IllegalArgumentException(\"OUT_OF_RANGE\");` を実行します。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442310",
    chapter_id: I2_CH,
    lesson_id: I2_LS,
    language: "java",
    title: "中級 2-8. 【中級総合】CSV売上データのカテゴリ別集計＆エラー行カウント",
    description_md: `## 問題文
\`N\` 行のCSVデータ（\`カテゴリ,金額\`）が与えられます。金額が数値でない行や負の金額の行はエラーとしてスキップし、エラー件数を数えてください。
有効なデータについて、カテゴリの初出順に \`<カテゴリ>: <合計金額>\` を出力し、最終行に \`ERRORS: <エラー件数>\` を出力してください。`,
    difficulty: "hard",
    estimated_minutes: 25,
    tags: ["HashMap", "CSV処理", "例外処理", "総合演習"],
    starter_code: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // CSVパース・エラーハンドリング・カテゴリ別集計を実装してください
    }
}`,
    solution_code: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        ArrayList<String> cats = new ArrayList<>();
        HashMap<String, Integer> sums = new HashMap<>();
        int errors = 0;
        for (int i = 0; i < n; i++) {
            String line = sc.next();
            String[] parts = line.split(",");
            if (parts.length < 2) {
                errors++;
                continue;
            }
            try {
                int amount = Integer.parseInt(parts[1]);
                if (amount < 0) {
                    errors++;
                    continue;
                }
                String cat = parts[0];
                if (!sums.containsKey(cat)) {
                    cats.add(cat);
                    sums.put(cat, amount);
                } else {
                    sums.put(cat, sums.get(cat) + amount);
                }
            } catch (Exception e) {
                errors++;
            }
        }
        for (int i = 0; i < cats.size(); i++) {
            String c = cats.get(i);
            System.out.println(c + ": " + sums.get(c));
        }
        System.out.println("ERRORS: " + errors);
    }
}`,
    explanation_md: "コレクション・CSV分割・バリデーション・例外処理をすべて統合した中級の集大成です。",
    order_index: 8,
    test_cases: [
      { name: "公開テスト1：正常＋不正混在", input: "5\nPC,50000\nBook,2000\nPC,abc\nBook,-500\nPC,30000\n", expected_output: "PC: 80000\nBook: 2000\nERRORS: 2", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：エラーなし", input: "2\nFood,500\nFood,700\n", expected_output: "Food: 1200\nERRORS: 0", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "各行を `,` で分割し、`Integer.parseInt` を `try-catch` で囲みつつ負数もエラー扱いします。" },
      { step_number: 2, content_md: "初出順の `ArrayList` と集計用の `HashMap` を組み合わせて出力順を安定させましょう。" },
    ],
  },
];
