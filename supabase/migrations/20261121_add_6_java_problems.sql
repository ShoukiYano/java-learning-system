-- =============================================================================
-- Java初級・中級・上級 各2問（計6問）追加マイグレーション
-- =============================================================================

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
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index;

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
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index;

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
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index;

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
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index;

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
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index;

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
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index;

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
