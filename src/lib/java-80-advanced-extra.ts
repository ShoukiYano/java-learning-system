import type { SeedProblem } from "@/lib/seed-data";

/**
 * Java上級コース 拡充問題（新規10問 → 上級合計16問）
 * Repository/Service設計・バリデーション・ページネーション・ロール権限・状態遷移・在庫トランザクションなど
 * 後半のSpring Boot個人開発＆チーム開発へ直結する実務設計ドリル
 */

const A1_CH = "b5486a57-160b-4bb3-9d1b-f5e9f7cc6590";
const A1_LS = "d62467af-4c0c-45b3-be32-3224f0765b0d";
const A2_CH = "446172d3-98c4-4c34-8277-7973f5953a36";
const A2_LS = "3f313153-e5f5-466a-b5f2-51a43cefbf1d";

export const JAVA_ADVANCED_80_EXTRA: SeedProblem[] = [
  // --- 上級第1章（order_index 4..8） ---
  {
    id: "44444444-4444-4444-8444-444444442401",
    chapter_id: A1_CH,
    lesson_id: A1_LS,
    language: "java",
    title: "上級 1-4. Repository層のCRUD模擬（登録・検索・論理削除）",
    description_md: `## 問題文
商品ID（\`id\`）・商品名（\`name\`）・論理削除フラグ（\`deleted\`）を管理する \`ProductRepo\` クラスを実装してください。
\`Q\` 件のコマンドを処理します：
- \`ADD id name\`：商品を登録
- \`DEL id\`：該当IDの \`deleted\` を \`true\` に変更
- \`LIST\`：\`deleted == false\` の商品を登録順で \`id:name\` 形式で出力（0件なら \`EMPTY\`）`,
    difficulty: "medium",
    estimated_minutes: 25,
    tags: ["DAO", "論理削除", "CRUD"],
    starter_code: `import java.util.ArrayList;
import java.util.Scanner;

class ProductEntity {
    int id;
    String name;
    boolean deleted;
    ProductEntity(int id, String name) {
        this.id = id;
        this.name = name;
        this.deleted = false;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int q = sc.nextInt();
        // ADD / DEL / LIST コマンドを処理してください
    }
}`,
    solution_code: `import java.util.ArrayList;
import java.util.Scanner;

class ProductEntity {
    int id;
    String name;
    boolean deleted;
    ProductEntity(int id, String name) {
        this.id = id;
        this.name = name;
        this.deleted = false;
    }
}

class ProductRepo {
    private ArrayList<ProductEntity> store = new ArrayList<>();

    public void save(int id, String name) {
        store.add(new ProductEntity(id, name));
    }

    public void softDelete(int id) {
        for (int i = 0; i < store.size(); i++) {
            if (store.get(i).id == id) {
                store.get(i).deleted = true;
            }
        }
    }

    public ArrayList<ProductEntity> findAllActive() {
        ArrayList<ProductEntity> res = new ArrayList<>();
        for (int i = 0; i < store.size(); i++) {
            if (!store.get(i).deleted) res.add(store.get(i));
        }
        return res;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int q = sc.nextInt();
        ProductRepo repo = new ProductRepo();
        for (int i = 0; i < q; i++) {
            String cmd = sc.next();
            if (cmd.equals("ADD")) {
                repo.save(sc.nextInt(), sc.next());
            } else if (cmd.equals("DEL")) {
                repo.softDelete(sc.nextInt());
            } else if (cmd.equals("LIST")) {
                ArrayList<ProductEntity> list = repo.findAllActive();
                if (list.size() == 0) {
                    System.out.println("EMPTY");
                } else {
                    for (int j = 0; j < list.size(); j++) {
                        ProductEntity p = list.get(j);
                        System.out.println(p.id + ":" + p.name);
                    }
                }
            }
        }
    }
}`,
    explanation_md: "物理削除せず `deleted = true` として `findAllActive()` で絞り込む設計は、後半のSpring Boot商品管理システムと同じ構造です。",
    order_index: 4,
    test_cases: [
      { name: "公開テスト1：登録・論理削除・一覧", input: "4\nADD 1 PC\nADD 2 Mouse\nDEL 1\nLIST\n", expected_output: "2:Mouse", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：全削除後EMPTY", input: "3\nADD 10 Hub\nDEL 10\nLIST\n", expected_output: "EMPTY", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "リポジトリクラス内に `ArrayList<ProductEntity>` を持ち、`save` / `softDelete` / `findAllActive` を分離します。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442402",
    chapter_id: A1_CH,
    lesson_id: A1_LS,
    language: "java",
    title: "上級 1-5. 商品登録フォームの複数項目バリデーション",
    description_md: `## 問題文
商品登録の入力値 \`sku\`（文字列）・\`price\`（整数）・\`stock\`（整数）が与えられます。
以下のルールをすべてチェックし、違反があれば該当エラーコードを順番に1行ずつ出力、すべて正常なら \`VALID\` を出力してください。
1. \`sku.length() < 3\` → \`ERR_SKU\`
2. \`price < 0\` → \`ERR_PRICE\`
3. \`stock < 0\` → \`ERR_STOCK\``,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["バリデーション", "フォーム設計"],
    starter_code: `import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String sku = sc.next();
        int price = sc.nextInt();
        int stock = sc.nextInt();
        // 3項目をすべて検証し、エラー一覧または VALID を出力してください
    }
}`,
    solution_code: `import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String sku = sc.next();
        int price = sc.nextInt();
        int stock = sc.nextInt();
        ArrayList<String> errs = new ArrayList<>();
        if (sku.length() < 3) errs.add("ERR_SKU");
        if (price < 0) errs.add("ERR_PRICE");
        if (stock < 0) errs.add("ERR_STOCK");
        if (errs.size() == 0) {
            System.out.println("VALID");
        } else {
            for (int i = 0; i < errs.size(); i++) {
                System.out.println(errs.get(i));
            }
        }
    }
}`,
    explanation_md: "最初の1エラーで止めずに全項目のエラーをリストへ集約して返却すると、ユーザーが1回で全箇所を直せる親切なフォームになります。",
    order_index: 5,
    test_cases: [
      { name: "公開テスト1：複数エラー", input: "AB -100 -5\n", expected_output: "ERR_SKU\nERR_PRICE\nERR_STOCK", is_hidden: false, order_index: 1 },
      { name: "公開テスト2：正常", input: "PRD01 0 0\n", expected_output: "VALID", is_hidden: false, order_index: 2 },
      { name: "非公開テスト：価格のみNG", input: "SKU-1 -1 10\n", expected_output: "ERR_PRICE", is_hidden: true, order_index: 3 },
    ],
    hints: [
      { step_number: 1, content_md: "`else if` ではなく独立した3つの `if` 文を使い、エラーを `ArrayList<String>` に蓄積しましょう。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442403",
    chapter_id: A1_CH,
    lesson_id: A1_LS,
    language: "java",
    title: "上級 1-6. SKU重複チェック付き商品登録サービス（Service層設計）",
    description_md: `## 問題文
\`N\` 件の商品登録リクエスト（\`sku 商品名\`）が順番に来ます。
すでに登録済みのSKUが来た場合は登録せず \`DUPLICATE: <sku>\`、新規SKUであれば登録して \`CREATED: <sku>\` を出力してください。最後に総登録件数を出力してください。`,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["Service設計", "重複チェック", "HashMap"],
    starter_code: `import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // SKU重複チェック付き登録処理を実装してください
    }
}`,
    solution_code: `import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        HashMap<String, String> repo = new HashMap<>();
        for (int i = 0; i < n; i++) {
            String sku = sc.next();
            String name = sc.next();
            if (repo.containsKey(sku)) {
                System.out.println("DUPLICATE: " + sku);
            } else {
                repo.put(sku, name);
                System.out.println("CREATED: " + sku);
            }
        }
        System.out.println(repo.size());
    }
}`,
    explanation_md: "一意制約（UNIQUE）のあるカラムをService層で事前に `existsBySku` チェックする実務パターンの模擬です。",
    order_index: 6,
    test_cases: [
      { name: "公開テスト1：重複検知", input: "3\nP01 PC\nP02 Mouse\nP01 Keyboard\n", expected_output: "CREATED: P01\nCREATED: P02\nDUPLICATE: P01\n2", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：重複なし", input: "2\nA1 X\nA2 Y\n", expected_output: "CREATED: A1\nCREATED: A2\n2", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "`HashMap<String, String>` で `containsKey(sku)` を調べればO(1)で重複検知できます。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442404",
    chapter_id: A1_CH,
    lesson_id: A1_LS,
    language: "java",
    title: "上級 1-7. ページネーション計算（総ページ数とoffset算出）",
    description_md: `## 問題文
総データ件数 \`total\`（0以上）、1ページあたりの件数 \`size\`（1以上）、表示ページ番号 \`page\`（1始まり）が与えられます。
以下を3行で出力してください：
1. 総ページ数（\`total == 0\` なら \`0\`、それ以外は切り上げ）
2. SQLの \`OFFSET\` 値（\`(page - 1) * size\`）
3. そのページに表示される実際の件数（0以上 \`size\` 以下）`,
    difficulty: "medium",
    estimated_minutes: 20,
    tags: ["ページネーション", "境界値", "Web設計"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int total = sc.nextInt();
        int size = sc.nextInt();
        int page = sc.nextInt();
        // 総ページ数、OFFSET、現在ページ件数を3行で出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int total = sc.nextInt();
        int size = sc.nextInt();
        int page = sc.nextInt();
        int totalPages = total == 0 ? 0 : (total + size - 1) / size;
        int offset = (page - 1) * size;
        int remaining = total - offset;
        int count = remaining <= 0 ? 0 : (remaining < size ? remaining : size);
        System.out.println(totalPages);
        System.out.println(offset);
        System.out.println(count);
    }
}`,
    explanation_md: "整数の切り上げ割り算 `(total + size - 1) / size` はページネーション実装の定番公式です。",
    order_index: 7,
    test_cases: [
      { name: "公開テスト1：25件・10件毎・3ページ目", input: "25 10 3\n", expected_output: "3\n20\n5", is_hidden: false, order_index: 1 },
      { name: "公開テスト2：0件", input: "0 10 1\n", expected_output: "0\n0\n0", is_hidden: false, order_index: 2 },
      { name: "非公開テスト：範囲外ページ", input: "20 10 5\n", expected_output: "2\n40\n0", is_hidden: true, order_index: 3 },
    ],
    hints: [
      { step_number: 1, content_md: "切り上げ総ページ数は `(total + size - 1) / size` で求められます（`total == 0` の場合だけ例外的に0）。" },
      { step_number: 2, content_md: "現在ページの件数は `total - offset` が0以下なら0、`size` より大きければ `size` に丸めます。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442405",
    chapter_id: A1_CH,
    lesson_id: A1_LS,
    language: "java",
    title: "上級 1-8. ロール権限マトリクスによるURLアクセス制御（403判定）",
    description_md: `## 問題文
Spring Securityの認可ルールをJavaで実装しましょう。
\`Q\` 件のリクエスト（\`ロール URL\`）が与えられます。
- URLが \`/admin/\` で始まる場合：\`ADMIN\` ロールのみ \`200 OK\`、それ以外は \`403 FORBIDDEN\`
- URLが \`/user/\` で始まる場合：\`ADMIN\` または \`USER\` は \`200 OK\`、それ以外（\`GUEST\` 等）は \`403 FORBIDDEN\`
- それ以外の公開URL：すべて \`200 OK\``,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["セキュリティ", "認可", "Spring Security準備"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int q = sc.nextInt();
        // ロールとURLプレフィックスから 200 OK / 403 FORBIDDEN を判定してください
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int q = sc.nextInt();
        for (int i = 0; i < q; i++) {
            String role = sc.next();
            String url = sc.next();
            boolean allowed = true;
            if (url.startsWith("/admin/")) {
                allowed = role.equals("ADMIN");
            } else if (url.startsWith("/user/")) {
                allowed = role.equals("ADMIN") || role.equals("USER");
            }
            System.out.println(allowed ? "200 OK" : "403 FORBIDDEN");
        }
    }
}`,
    explanation_md: "`startsWith` とロールチェックの組み合わせは、チーム開発設計書の権限マトリクス（Sheet 3）そのままの考え方です。",
    order_index: 8,
    test_cases: [
      { name: "公開テスト1：3パターン", input: "3\nUSER /admin/users\nUSER /user/profile\nGUEST /public/top\n", expected_output: "403 FORBIDDEN\n200 OK\n200 OK", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：ADMINとGUEST", input: "2\nADMIN /admin/settings\nGUEST /user/home\n", expected_output: "200 OK\n403 FORBIDDEN", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "URLの先頭一致判定には `url.startsWith(\"/admin/\")` を使います。" },
    ],
  },

  // --- 上級第2章（order_index 4..8） ---
  {
    id: "44444444-4444-4444-8444-444444442406",
    chapter_id: A2_CH,
    lesson_id: A2_LS,
    language: "java",
    title: "上級 2-4. 注文ステータス遷移マシンの正当性チェック",
    description_md: `## 問題文
注文ステータスは \`NEW → PAID → SHIPPED → DONE\` の順番にのみ遷移可能（また \`NEW\` または \`PAID\` からは \`CANCELED\` へ遷移可能）とします。
初期状態 \`NEW\` から \`Q\` 回の遷移先ステータスが与えられます。
正当な遷移なら状態を進めて \`OK\`、不正な遷移なら状態を変えず \`INVALID\` と出力し、最終ステータスを最後に出力してください。`,
    difficulty: "hard",
    estimated_minutes: 25,
    tags: ["状態遷移", "業務ロジック"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static boolean canTransition(String current, String next) {
        // 遷移可能かどうかを判定してください
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int q = sc.nextInt();
        String status = "NEW";
        // Q回の遷移を処理してください
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static boolean canTransition(String current, String next) {
        if (current.equals("NEW") && (next.equals("PAID") || next.equals("CANCELED"))) return true;
        if (current.equals("PAID") && (next.equals("SHIPPED") || next.equals("CANCELED"))) return true;
        if (current.equals("SHIPPED") && next.equals("DONE")) return true;
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int q = sc.nextInt();
        String status = "NEW";
        for (int i = 0; i < q; i++) {
            String next = sc.next();
            if (canTransition(status, next)) {
                status = next;
                System.out.println("OK");
            } else {
                System.out.println("INVALID");
            }
        }
        System.out.println(status);
    }
}`,
    explanation_md: "状態遷移ルールを専用メソッドに閉じ込めることで、発送済み注文のキャンセルなどの業務事故をコードレベルで防止できます。",
    order_index: 4,
    test_cases: [
      { name: "公開テスト1：正常＋不正スキップ", input: "4\nSHIPPED\nPAID\nSHIPPED\nCANCELED\n", expected_output: "INVALID\nOK\nOK\nINVALID\nSHIPPED", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：完了まで", input: "3\nPAID\nSHIPPED\nDONE\n", expected_output: "OK\nOK\nOK\nDONE", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "現在の状態ごとに「次に許可される状態」を明示的に列挙し、それ以外は `false` を返します。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442407",
    chapter_id: A2_CH,
    lesson_id: A2_LS,
    language: "java",
    title: "上級 2-5. 備品貸出トランザクション模擬（承認で在庫減・返却で在庫増）",
    description_md: `## 問題文
総在庫 \`total\` の備品（初期利用可能数 \`available = total\`）に対し、\`Q\` 件の操作を処理してください。
- \`APPROVE qty\`：\`available >= qty\` なら減算して \`APPROVED\`、不足なら変更せず \`DENIED\`
- \`RETURN qty\`：\`available + qty <= total\` なら加算して \`RETURNED\`、上限超過なら変更せず \`INVALID\`
最後に現在の利用可能在庫数を出力してください。`,
    difficulty: "medium",
    estimated_minutes: 20,
    tags: ["トランザクション", "在庫整合性", "チーム開発準備"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int total = sc.nextInt();
        int q = sc.nextInt();
        // APPROVE / RETURN を処理し、最終在庫を出力してください
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int total = sc.nextInt();
        int available = total;
        int q = sc.nextInt();
        for (int i = 0; i < q; i++) {
            String cmd = sc.next();
            int qty = sc.nextInt();
            if (cmd.equals("APPROVE")) {
                if (available >= qty) {
                    available -= qty;
                    System.out.println("APPROVED");
                } else {
                    System.out.println("DENIED");
                }
            } else if (cmd.equals("RETURN")) {
                if (available + qty <= total) {
                    available += qty;
                    System.out.println("RETURNED");
                } else {
                    System.out.println("INVALID");
                }
            }
        }
        System.out.println(available);
    }
}`,
    explanation_md: "チーム開発（メンバーC：備品貸出システム）のコア不変条件 `0 <= available <= total` を守る設計です。",
    order_index: 5,
    test_cases: [
      { name: "公開テスト1：貸出・超過・返却", input: "3 4\nAPPROVE 2\nAPPROVE 2\nRETURN 1\nRETURN 5\n", expected_output: "APPROVED\nDENIED\nRETURNED\nINVALID\n2", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：全返却", input: "5 2\nAPPROVE 5\nRETURN 5\n", expected_output: "APPROVED\nRETURNED\n5", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "貸出時は `available >= qty`、返却時は `available + qty <= total` の2つの不変条件を守ります。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442408",
    chapter_id: A2_CH,
    lesson_id: A2_LS,
    language: "java",
    title: "上級 2-6. 案件進捗率の自動集計サービス（完了タスク÷全タスク×100）",
    description_md: `## 問題文
\`N\` 件のタスク（\`案件名 ステータス\`、ステータスは \`TODO\` / \`IN_PROGRESS\` / \`DONE\`）が与えられます。
案件の初出順に \`<案件名>: <進捗率>% (<完了数>/<総数>)\` を出力してください（進捗率は整数切り捨て：\`done * 100 / total\`）。`,
    difficulty: "hard",
    estimated_minutes: 25,
    tags: ["HashMap", "業務集計", "チーム開発準備"],
    starter_code: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // 案件ごとの完了数・総数から進捗率を算出して出力してください
    }
}`,
    solution_code: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        ArrayList<String> projects = new ArrayList<>();
        HashMap<String, Integer> totalMap = new HashMap<>();
        HashMap<String, Integer> doneMap = new HashMap<>();
        for (int i = 0; i < n; i++) {
            String proj = sc.next();
            String st = sc.next();
            if (!totalMap.containsKey(proj)) {
                projects.add(proj);
                totalMap.put(proj, 0);
                doneMap.put(proj, 0);
            }
            totalMap.put(proj, totalMap.get(proj) + 1);
            if (st.equals("DONE")) {
                doneMap.put(proj, doneMap.get(proj) + 1);
            }
        }
        for (int i = 0; i < projects.size(); i++) {
            String p = projects.get(i);
            int t = totalMap.get(p);
            int d = doneMap.get(p);
            int pct = d * 100 / t;
            System.out.println(p + ": " + pct + "% (" + d + "/" + t + ")");
        }
    }
}`,
    explanation_md: "チーム開発（メンバーB：案件・タスク管理）の案件一覧進捗率計算と同じロジックです。",
    order_index: 6,
    test_cases: [
      { name: "公開テスト1：2案件", input: "4\nAlpha DONE\nAlpha TODO\nBeta DONE\nAlpha DONE\n", expected_output: "Alpha: 66% (2/3)\nBeta: 100% (1/1)", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：0%案件", input: "2\nGamma TODO\nGamma IN_PROGRESS\n", expected_output: "Gamma: 0% (0/2)", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "総数用の `HashMap` と完了数用の `HashMap` の2つを持つと見通しが良くなります。" },
      { step_number: 2, content_md: "割り算を先にすると0になるため、`d * 100 / t` の順に計算しましょう。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442409",
    chapter_id: A2_CH,
    lesson_id: A2_LS,
    language: "java",
    title: "上級 2-7. 配送料金ロジックの境界値テスト検証",
    description_md: `## 問題文
以下の配送料金ルールを \`calcShipping(int weightKg, int subtotal)\` メソッドとして実装してください：
- \`subtotal >= 10000\`：送料無料（\`0\`円）
- それ以外で \`weightKg <= 2\`：\`500\`円
- それ以外で \`weightKg <= 10\`：\`800\`円
- \`weightKg > 10\`：\`1500\`円

\`N\` 件のテストケース（\`weightKg subtotal\`）について算出した配送料を1行ずつ出力してください。`,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["境界値テスト", "単体テスト", "業務ルール"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static int calcShipping(int weightKg, int subtotal) {
        // 境界値を正確に判定してください
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            System.out.println(calcShipping(sc.nextInt(), sc.nextInt()));
        }
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static int calcShipping(int weightKg, int subtotal) {
        if (subtotal >= 10000) return 0;
        if (weightKg <= 2) return 500;
        if (weightKg <= 10) return 800;
        return 1500;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            System.out.println(calcShipping(sc.nextInt(), sc.nextInt()));
        }
    }
}`,
    explanation_md: "境界値（9999 vs 10000、2 vs 3、10 vs 11）を優先度の高い条件から早期リターンで判定するとバグが混入しにくくなります。",
    order_index: 7,
    test_cases: [
      { name: "公開テスト1：全境界値", input: "5\n15 10000\n2 9999\n3 5000\n10 5000\n11 5000\n", expected_output: "0\n500\n800\n800\n1500", is_hidden: false, order_index: 1 },
      { name: "非公開テスト：境界確認", input: "2\n1 10000\n11 9999\n", expected_output: "0\n1500", is_hidden: true, order_index: 2 },
    ],
    hints: [
      { step_number: 1, content_md: "最優先ルールである `subtotal >= 10000` を最初に判定し、残りを重さの昇順で `<=` 判定します。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444442410",
    chapter_id: A2_CH,
    lesson_id: A2_LS,
    language: "java",
    title: "上級 2-8. 【Java 4か月総仕上げ】商品管理ミニシステム（登録・検索・在庫警告）",
    description_md: `## 問題文
Java 4か月カリキュラム（全80問）の総仕上げです！後半のSpring Boot商品管理システムのコア処理をJavaで実装しましょう。
\`Q\` 件のコマンドを処理してください：
- \`ADD sku name price stock\`：商品を登録（SKU重複時は \`DUP\`、成功時は \`OK\`）
- \`SEARCH keyword\`：商品名に \`keyword\` を含む商品を登録順で出力（在庫が10未満なら末尾に \` [LOW]\` を付ける。形式：\`sku name price stock\`。0件なら \`NONE\`）`,
    difficulty: "hard",
    estimated_minutes: 30,
    tags: ["総仕上げ", "商品管理", "Spring Boot準備"],
    starter_code: `import java.util.ArrayList;
import java.util.Scanner;

class Item {
    String sku, name;
    int price, stock;
    Item(String sku, String name, int price, int stock) {
        this.sku = sku;
        this.name = name;
        this.price = price;
        this.stock = stock;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int q = sc.nextInt();
        // ADD と SEARCH コマンドを実装してください
    }
}`,
    solution_code: `import java.util.ArrayList;
import java.util.Scanner;

class Item {
    String sku, name;
    int price, stock;
    Item(String sku, String name, int price, int stock) {
        this.sku = sku;
        this.name = name;
        this.price = price;
        this.stock = stock;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int q = sc.nextInt();
        ArrayList<Item> items = new ArrayList<>();
        for (int i = 0; i < q; i++) {
            String cmd = sc.next();
            if (cmd.equals("ADD")) {
                String sku = sc.next();
                String name = sc.next();
                int price = sc.nextInt();
                int stock = sc.nextInt();
                boolean dup = false;
                for (int j = 0; j < items.size(); j++) {
                    if (items.get(j).sku.equals(sku)) {
                        dup = true;
                        break;
                    }
                }
                if (dup) {
                    System.out.println("DUP");
                } else {
                    items.add(new Item(sku, name, price, stock));
                    System.out.println("OK");
                }
            } else if (cmd.equals("SEARCH")) {
                String kw = sc.next();
                int found = 0;
                for (int j = 0; j < items.size(); j++) {
                    Item it = items.get(j);
                    if (it.name.contains(kw)) {
                        String warn = it.stock < 10 ? " [LOW]" : "";
                        System.out.println(it.sku + " " + it.name + " " + it.price + " " + it.stock + warn);
                        found++;
                    }
                }
                if (found == 0) {
                    System.out.println("NONE");
                }
            }
        }
    }
}`,
    explanation_md: "Java 4か月（全80問）の完走おめでとうございます！ここで身につけた設計力と実装力で、次のSQL・Git・Spring Boot商品管理システム開発へ自信を持って進みましょう。",
    order_index: 8,
    test_cases: [
      {
        name: "公開テスト1：登録・重複・検索・在庫警告",
        input: "5\nADD P01 GamingMouse 4500 5\nADD P02 OfficeMouse 1800 20\nADD P01 DupItem 1000 10\nSEARCH Mouse\nSEARCH Keyboard\n",
        expected_output: "OK\nOK\nDUP\nP01 GamingMouse 4500 5 [LOW]\nP02 OfficeMouse 1800 20\nNONE",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト：境界在庫10",
        input: "2\nADD P09 Monitor 30000 10\nSEARCH Mon\n",
        expected_output: "OK\nP09 Monitor 30000 10",
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      { step_number: 1, content_md: "部分一致検索は `it.name.contains(kw)` で判定できます。" },
      { step_number: 2, content_md: "在庫警告は「10未満（`stock < 10`）」のときだけ末尾に `\" [LOW]\"` を付与しましょう。" },
    ],
  },
];
