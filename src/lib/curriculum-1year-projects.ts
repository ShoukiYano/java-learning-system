import type { SeedChapter, SeedProblem } from "@/lib/seed-data";
import type { ProjectStepSpec } from "@/lib/curriculum-evaluators";

export const SEED_SPRINGBOOT_PROJECT_COURSE_ID = "11111111-1111-4111-8111-111111111114";
export const SEED_TEAM_PROJECT_COURSE_ID = "11111111-1111-4111-8111-111111111115";

const PRODUCT_SPEC_PATH = "/docs/product-management-design-spec.xlsx";
const PRODUCT_MOCKUP_PATH = "/docs/product-management-mockup.xlsx";
const TEAM_SPEC_PATH = "/docs/team-project-design-spec.xlsx";
const TEAM_MOCKUP_PATH = "/docs/team-project-mockup.xlsx";

interface GuidedStepInput {
  id: string;
  chapterId: string;
  lessonId: string;
  orderIndex: number;
  stepNumber: number;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedMinutes: number;
  tags: string[];
  recommendedBranch: string;
  designDocPath: string;
  designDocLabel: string;
  isTeamProject?: boolean;
  repoName: string;
  goal: string;
  why: string;
  sheets: string;
  fileOrder: string[];
  starterSnippetTitle?: string;
  starterSnippetLang?: string;
  starterSnippet?: string;
  mermaidDiagram?: string;
  verifySteps: string[];
  commonPitfalls: string[];
  checklist: string[];
  explanation: string;
  hints: string[];
}

function projStarter(spec: ProjectStepSpec): string {
  const isTeam = spec.designDocPath === TEAM_SPEC_PATH;
  const enriched: ProjectStepSpec = {
    ...spec,
    mockupDocPath: spec.mockupDocPath ?? (isTeam ? TEAM_MOCKUP_PATH : PRODUCT_MOCKUP_PATH),
    mockupDocLabel:
      spec.mockupDocLabel ??
      (isTeam
        ? "TeamOps Hub 画面設計モックアップ（Excel・全11シート）"
        : "商品管理システム 画面設計モックアップ（Excel・全8シート）"),
  };
  return JSON.stringify(enriched);
}

function projSolution(spec: ProjectStepSpec, repoName: string): string {
  return JSON.stringify({
    githubUrl: `https://github.com/sample-student/${repoName}/pull/${spec.stepNumber}`,
    checkedItems: spec.checklist.map((_, i) => i),
    summaryNote: `推奨ブランチ（${spec.recommendedBranch}）で実装・動作確認を完了し、Pull Requestを作成しました。`,
  });
}

function buildGuidedProblem(input: GuidedStepInput): SeedProblem {
  const spec: ProjectStepSpec = {
    stepNumber: input.stepNumber,
    recommendedBranch: input.recommendedBranch,
    designDocPath: input.designDocPath,
    designDocLabel: input.designDocLabel,
    isTeamProject: input.isTeamProject,
    checklist: input.checklist,
  };

  const parts: string[] = [
    `### 🎯 この単元でやること（ゴール）`,
    input.goal,
    ``,
    `### 💡 なぜこの単元が必要か`,
    input.why,
    ``,
    `### 📖 見るべき設計書・モックアップ`,
    input.sheets,
  ];

  if (input.mermaidDiagram) {
    parts.push(``, input.mermaidDiagram);
  }

  parts.push(
    ``,
    `### 🛠️ 最初に作るファイルと書く順番`,
    ...input.fileOrder.map((line, i) => `${i + 1}. ${line}`)
  );

  if (input.starterSnippet) {
    parts.push(
      ``,
      `### 🧩 最初の一歩（${input.starterSnippetTitle ?? "書き出しイメージ"}）`,
      `\`\`\`${input.starterSnippetLang ?? "java"}`,
      input.starterSnippet.trim(),
      `\`\`\``
    );
  }

  parts.push(
    ``,
    `### ✅ 動作確認のしかた（成功のサイン）`,
    ...input.verifySteps.map((s) => `- ${s}`),
    ``,
    `### ⚠️ よくあるエラーと対処法`,
    ...input.commonPitfalls.map((p) => `- ${p}`),
    ``,
    `### 🔀 提出ブランチ＆Pull Request手順`,
    `\`\`\`bash`,
    `git switch -c ${input.recommendedBranch}`,
    `git add . && git commit -m "feat: Step ${input.stepNumber} 完了"`,
    `git push -u origin ${input.recommendedBranch}`,
    `\`\`\``,
    `GitHub上で Pull Request を作成し、**PR URL（\`/pull/番号\`）** を右側のフォームから提出してください。`
  );

  return {
    id: input.id,
    lesson_id: input.lessonId,
    chapter_id: input.chapterId,
    language: "project",
    title: input.title,
    description_md: parts.join("\n"),
    difficulty: input.difficulty,
    estimated_minutes: input.estimatedMinutes,
    tags: input.tags,
    starter_code: projStarter(spec),
    solution_code: projSolution(spec, input.repoName),
    explanation_md: input.explanation,
    order_index: input.orderIndex,
    test_cases: [],
    hints: input.hints.map((h, i) => ({
      step_number: ((i % 3) + 1) as 1 | 2 | 3,
      content_md: h,
    })),
  };
}

// =============================================================================
// 1. Spring Boot＋SQL 個人開発：商品管理システム構築（2か月・全4章・16ステップ）
// =============================================================================
const SB_CH1 = "22222222-2222-4222-8222-222222221401";
const SB_CH2 = "22222222-2222-4222-8222-222222221402";
const SB_CH3 = "22222222-2222-4222-8222-222222221403";
const SB_CH4 = "22222222-2222-4222-8222-222222221404";
const SB_LS1 = "33333333-3333-4333-8333-333333331401";
const SB_LS2 = "33333333-3333-4333-8333-333333331402";
const SB_LS3 = "33333333-3333-4333-8333-333333331403";
const SB_LS4 = "33333333-3333-4333-8333-333333331404";

export const SPRINGBOOT_PROJECT_CHAPTERS: SeedChapter[] = [
  {
    id: SB_CH1,
    course_id: SEED_SPRINGBOOT_PROJECT_COURSE_ID,
    title: "第1章（1〜2週目）：環境構築と「はじめてのSpring Boot画面」（Step 1〜4）",
    description: "Eclipse・PostgreSQL・Spring Boot導入から、はじめてブラウザに1画面と共通ヘッダーを出すまでを1歩ずつ進めます。",
    order_index: 1,
    lesson_id: SB_LS1,
    lesson_title: "環境構築・DB疎通・初画面表示",
  },
  {
    id: SB_CH2,
    course_id: SEED_SPRINGBOOT_PROJECT_COURSE_ID,
    title: "第2章（3〜4週目）：DB構築と「見る機能（Read）」（Step 5〜8）",
    description: "3テーブルDDL作成、Entity/Repositoryのvalidate突破、商品一覧・在庫少バッジ・複合検索・詳細画面を順に作ります。",
    order_index: 2,
    lesson_id: SB_LS2,
    lesson_title: "DB設計実装・商品一覧/検索/詳細",
  },
  {
    id: SB_CH3,
    course_id: SEED_SPRINGBOOT_PROJECT_COURSE_ID,
    title: "第3章（5〜6週目）：「作る・直す・消す（CRUD）」と入力チェック（Step 9〜12）",
    description: "新規登録（PRG）、形式＆業務バリデーション（SKU重複）、編集、論理削除を1機能ずつ丁寧に実装します。",
    order_index: 3,
    lesson_id: SB_LS3,
    lesson_title: "新規登録・バリデーション・編集・論理削除",
  },
  {
    id: SB_CH4,
    course_id: SEED_SPRINGBOOT_PROJECT_COURSE_ID,
    title: "第4章（7〜8週目）：ログイン認証・エラー画面・テスト＆最終提出（Step 13〜16）",
    description: "Spring Security認証、共通エラー画面、テスト仕様書TC-001〜022検証、README整備で実務品質へ仕上げます。",
    order_index: 4,
    lesson_id: SB_LS4,
    lesson_title: "Spring Security・品質検証・最終提出",
  },
];

export const SPRINGBOOT_PROJECT_PROBLEMS: SeedProblem[] = [
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441401",
    chapterId: SB_CH1,
    lessonId: SB_LS1,
    orderIndex: 1,
    stepNumber: 1,
    title: "Step 1：ツール導入（Eclipse / PostgreSQL / GitHub）＆設計書・モックアップ確認",
    difficulty: "easy",
    estimatedMinutes: 60,
    tags: ["Spring Boot", "環境構築", "PostgreSQL", "GitHub"],
    recommendedBranch: "feature/step01-setup",
    designDocPath: PRODUCT_SPEC_PATH,
    designDocLabel: "商品管理システム 開発者向け詳細設計書 v1.1.0（全13シート）",
    repoName: "product-manager",
    goal: "Java 21のEclipse、PostgreSQL 16（DB `product_mgmt_db`）、GitHubリポジトリを準備し、配布Excel設計書と画面モックアップの全体像をつかみます。",
    why: "実務ではいきなりコードを書かず、最初に開発環境を揃え、設計書から「どんな画面・テーブルを作るか」を把握してから着手します。",
    sheets: "右のボタンから2つのExcelをダウンロードし、詳細設計書 `00_表紙・読み方`〜`02_機能要件` と、画面設計モックアップの全シートをざっと眺めてください。",
    mermaidDiagram: "```mermaid\nflowchart LR\n  Dev[\"Eclipse (Java 21)\"] --> App[\"Spring Boot 3.3\"]\n  App <--> DB[(\"PostgreSQL 16\\nproduct_mgmt_db\")]\n  App --> View[\"Thymeleaf HTML/CSS\"]\n  Dev -->|PR提出| GH[\"GitHub\"]\n```",
    fileOrder: [
      "Eclipse（Pleiades All in One Java 21）をインストールし、ワークスペース文字コードを **UTF-8** に設定する",
      "PostgreSQL 16 をインストールし、pgAdmin 4 でデータベース `product_mgmt_db`（UTF-8）を作成する",
      "GitHubで `product-manager` リポジトリを作成（`Add a README file` にチェック）し、ローカルへ `git clone` する",
      "リポジトリ直下に `.gitignore`（`target/` や `.env` を除外）を作成する",
    ],
    verifySteps: [
      "pgAdmin 4 で `product_mgmt_db` が表示されている",
      "ターミナルで `git status` がエラーなく動く",
      "詳細設計書（全13シート）とモックアップ（全8シート）を開いて確認できた",
    ],
    commonPitfalls: [
      "WindowsでEclipseを深いフォルダに解凍するとパス長エラーになります → `C:\\pleiades` など短い英数字パスへ配置しましょう。",
    ],
    checklist: [
      "Eclipse（Java 21）を導入し文字コードをUTF-8に設定した",
      "PostgreSQL 16 で `product_mgmt_db` を作成した",
      "詳細設計書（全13シート）と画面モックアップ（全8シート）を確認した",
      "`feature/step01-setup` ブランチから最初のPull Requestを作成した",
    ],
    explanation: "環境構築と設計書の読み込みが終われば、あとは1ステップずつ小さく作って動かすだけです！",
    hints: ["GitHubリポジトリは講師がレビューできるようPublic（またはCollaborator招待）にしておきましょう。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441402",
    chapterId: SB_CH1,
    lessonId: SB_LS1,
    orderIndex: 2,
    stepNumber: 2,
    title: "Step 2：Spring Initializr（Maven）雛形作成 ＆ PostgreSQL接続疎通確認",
    difficulty: "easy",
    estimatedMinutes: 60,
    tags: ["Spring Boot", "Maven", "PostgreSQL"],
    recommendedBranch: "feature/step02-spring-db",
    designDocPath: PRODUCT_SPEC_PATH,
    designDocLabel: "商品管理システム 詳細設計書 v1.1.0（01_システム概要・環境）",
    repoName: "product-manager",
    goal: "Spring Boot 3.3（Maven / Java 21）のプロジェクト雛形を作り、PostgreSQLへエラーなく起動接続できる状態にします。",
    why: "コードを書く前に「Spring BootとPostgreSQLが確実に繋がっている」状態を作っておくと、後でエラーが出たときに原因を切り分けやすくなります。",
    sheets: "詳細設計書 `01_システム概要・環境`（§2 技術スタック / §3 pom.xml / §6 application.properties）",
    fileOrder: [
      "Spring Initializr（start.spring.io または Eclipse新規）で **Maven / Java 21 / Jar** を選択する",
      "依存関係に `Spring Web`, `Thymeleaf`, `Spring Data JPA`, `Validation`, `PostgreSQL Driver`, `Spring Boot DevTools` を追加（※Spring SecurityはStep 13で追加）",
      "`src/main/resources/application.properties` にPostgreSQL接続設定を書く",
      "Eclipseから `ProductApplication.java` を「Spring Boot アプリケーション」として起動する",
    ],
    starterSnippetTitle: "src/main/resources/application.properties",
    starterSnippetLang: "properties",
    starterSnippet: `spring.datasource.url=jdbc:postgresql://localhost:5432/product_mgmt_db
spring.datasource.username=\${DB_USER:postgres}
spring.datasource.password=\${DB_PASSWORD:postgres}
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.open-in-view=false
spring.jpa.show-sql=true
spring.thymeleaf.cache=false`,
    verifySteps: [
      "Eclipseコンソールに `Started ProductApplication in X.XXX seconds` と表示される",
      "起動直後に赤い `Exception` や `Connection refused` が出ていない",
    ],
    commonPitfalls: [
      "`Connection refused` が出る → PostgreSQLサービスが起動しているか、ポート `5432` とパスワードが合っているか確認しましょう。",
      "Maven依存が反映されない → プロジェクト右クリック →「Maven → プロジェクトの更新（Alt+F5）」を実行します。",
    ],
    checklist: [
      "Maven / Java 21 のSpring Bootプロジェクトを作成した",
      "`application.properties` に `product_mgmt_db` への接続設定を記述した",
      "起動ログに `Started ProductApplication` がエラーなく出た",
      "`feature/step02-spring-db` ブランチをPushしてPRを作成した",
    ],
    explanation: "Spring BootとPostgreSQLの疎通確認が完了しました。次はいよいよブラウザに最初の1画面を表示します！",
    hints: ["Step 2時点ではまだEntityが無いので `ddl-auto=validate` のままエラーなく起動します。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441403",
    chapterId: SB_CH1,
    lessonId: SB_LS1,
    orderIndex: 3,
    stepNumber: 3,
    title: "Step 3：はじめての Controller ＋ Thymeleaf で「最初の1画面」を表示する",
    difficulty: "easy",
    estimatedMinutes: 60,
    tags: ["Spring Boot", "Controller", "Thymeleaf"],
    recommendedBranch: "feature/step03-first-page",
    designDocPath: PRODUCT_SPEC_PATH,
    designDocLabel: "商品管理システム 詳細設計書 v1.1.0（03_画面設計・04_URL・IF設計）",
    repoName: "product-manager",
    goal: "Spring BootのMVCの最小単位である「Controller（受付）→ Thymeleaf（HTML画面）」を自分で書き、`http://localhost:8080/products` に仮画面を表示します。",
    why: "いきなりDBと繋ぐ前に「URLにアクセスしたらControllerのメソッドが呼ばれ、HTMLが返る」仕組みを体で理解すると、この先の学習が圧倒的に楽になります。",
    sheets: "詳細設計書 `04_URL・IF設計`（URL一覧）",
    fileOrder: [
      "`src/main/java/com/example/product/controller/AuthController.java` を作り、`GET /` を `/products` へリダイレクトさせる",
      "`src/main/java/com/example/product/controller/ProductController.java` を作り、`@GetMapping(\"/products\")` で `\"products/list\"` を返す",
      "`src/main/resources/templates/products/list.html` を作り、`<h1>商品一覧（作成中）</h1>` と表示させる",
    ],
    starterSnippetTitle: "最初に書く ProductController.java（最小版）",
    starterSnippetLang: "java",
    starterSnippet: `@Controller
@RequestMapping("/products")
public class ProductController {
    @GetMapping
    public String list(Model model) {
        model.addAttribute("pageTitle", "商品一覧");
        return "products/list"; // templates/products/list.html を表示！
    }
}`,
    verifySteps: [
      "ブラウザで `http://localhost:8080/` を開くと自動で `/products` に移動する",
      "画面に `商品一覧` と日本語が文字化けせず表示される",
    ],
    commonPitfalls: [
      "`Whitelabel Error Page (404)` が出る → `@Controller` の付け忘れ、または `templates/products/list.html` のフォルダ名スペルミスを確認しましょう。",
    ],
    checklist: [
      "`AuthController` で `GET /` → `redirect:/products` を実装した",
      "`ProductController` で `GET /products` を受け取り `products/list` を返した",
      "ブラウザで `http://localhost:8080/products` にHTMLが表示された",
      "`feature/step03-first-page` ブランチからPRを作成した",
    ],
    explanation: "`@Controller` がURLを受け取り、戻り値の文字列に対応する `templates/*.html` を返すのがSpring MVCの基本です。",
    hints: ["`@RestController` ではなく `@Controller` を使う点に注意しましょう（HTMLを返すため）。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441404",
    chapterId: SB_CH1,
    lessonId: SB_LS1,
    orderIndex: 4,
    stepNumber: 4,
    title: "Step 4：共通ヘッダー（layout.html）＆ 共通CSS（style.css）の土台作成",
    difficulty: "easy",
    estimatedMinutes: 60,
    tags: ["Thymeleaf", "CSS", "共通部品"],
    recommendedBranch: "feature/step04-layout-css",
    designDocPath: PRODUCT_SPEC_PATH,
    designDocLabel: "商品管理システム 詳細設計書 v1.1.0（03_画面設計 §2 共通部品）",
    repoName: "product-manager",
    goal: "全画面で使い回す共通ヘッダー（`templates/fragments/layout.html`）と共通スタイルシート（`static/css/style.css`）を作成し、一覧画面から読み込みます。",
    why: "先に共通デザインとフラッシュメッセージ・赤バッジ・エラー文字のCSSクラスを用意しておくと、以降の画面作成で見た目に迷わずロジックに集中できます。",
    sheets: "詳細設計書 `03_画面設計 §2` ＋ 画面モックアップ（共通ヘッダー・色使い）",
    fileOrder: [
      "`src/main/resources/templates/fragments/layout.html` を作り、`th:fragment=\"header\"` でシステム名とヘッダー枠を定義する",
      "`src/main/resources/static/css/style.css` を作り、`.badge-low`（赤バッジ）・`.flash-success`・`.error`・`.data-table` の基本CSSを書く",
      "`templates/products/list.html` から `<link rel=\"stylesheet\" th:href=\"@{/css/style.css}\">` と `th:replace=\"~{fragments/layout :: header}\"` を読み込む",
    ],
    starterSnippetTitle: "templates/fragments/layout.html の書き出し",
    starterSnippetLang: "html",
    starterSnippet: `<header th:fragment="header" class="app-header">
  <a th:href="@{/products}" class="brand">商品管理システム</a>
  <!-- Step 13でここにログイン者氏名とログアウトボタンを追加します -->
</header>`,
    verifySteps: [
      "`http://localhost:8080/products` に共通ヘッダーとCSSスタイルが適用されて表示される",
      "ブラウザ開発者ツール（F12 → Network）で `style.css` が `200 OK` で読み込まれている",
    ],
    commonPitfalls: [
      "CSSが効かない → `static/css/style.css` の置き場所を確認し、`href=\"/css/style.css\"` ではなく `th:href=\"@{/css/style.css}\"` を使いましょう。",
    ],
    checklist: [
      "`templates/fragments/layout.html` に `th:fragment=\"header\"` を作成した",
      "`static/css/style.css` にテーブル・バッジ・フラッシュ・エラー用のスタイルを作成した",
      "`products/list.html` に共通ヘッダーとCSSが反映された",
      "`feature/step04-layout-css` ブランチからPRを作成した",
    ],
    explanation: "Thymeleafの `th:fragment` / `th:replace` を使うことで、ヘッダーを修正したいときも1ファイル直すだけで全画面へ反映できます。",
    hints: ["ヘッダーのログイン者表示・ログアウトボタンはStep 13でSpring Security導入後に組み込みます。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441405",
    chapterId: SB_CH2,
    lessonId: SB_LS2,
    orderIndex: 1,
    stepNumber: 5,
    title: "Step 5：PostgreSQL 3テーブルDDL作成（users / categories / products）＆初期データ投入",
    difficulty: "medium",
    estimatedMinutes: 90,
    tags: ["PostgreSQL", "SQL", "DDL"],
    recommendedBranch: "feature/step05-db-ddl",
    designDocPath: PRODUCT_SPEC_PATH,
    designDocLabel: "商品管理システム 詳細設計書 v1.1.0（06_DB設計）",
    repoName: "product-manager",
    goal: "詳細設計書 `06_DB設計` を読みながら、PostgreSQLに3つのテーブル（`users`, `categories`, `products`）を作成し、初期カテゴリ3件・初期商品5件を投入します。",
    why: "実務では「設計書のテーブル定義を見て自分でSQL(DDL)を書き、制約（PRIMARY KEY / UNIQUE / FOREIGN KEY / CHECK）をDB側にも張る」ことがデータ品質の要です。",
    sheets: "詳細設計書 `06_DB設計`（§1 ER図〜§6 初期データ）",
    mermaidDiagram: "```mermaid\nerDiagram\n  categories ||--o{ products : \"1対多 (category_id)\"\n  categories { bigint id PK\n varchar name UK\n int sort_order }\n  products { bigint id PK\n varchar sku UK\n varchar name\n bigint category_id FK\n int price\n int stock\n boolean is_deleted }\n  users { bigint id PK\n varchar email UK\n varchar password_hash\n varchar role }\n```",
    fileOrder: [
      "プロジェクト内に `sql/schema.sql` を作り、外部キーの依存順（①`users` → ②`categories` → ③`products`）で `CREATE TABLE` 文を書く",
      "`sql/data.sql` を作り、カテゴリ3件（PC・周辺機器 / 書籍 / オフィス用品）とサンプル商品5件（在庫10未満を含む）の `INSERT` 文を書く",
      "pgAdmin 4 のクエリツールで `schema.sql` → `data.sql` の順に実行する",
    ],
    starterSnippetTitle: "sql/schema.sql の書き出し例",
    starterSnippetLang: "sql",
    starterSnippet: `CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    sort_order INTEGER NOT NULL DEFAULT 0
);
-- 続けて users と products（price >= 0, stock >= 0, is_deleted DEFAULT FALSE）を作成`,
    verifySteps: [
      "pgAdmin 4 で `SELECT * FROM categories;` が3件、`SELECT * FROM products;` が5件返る",
      "`price = -1` を試しにINSERTすると `CHECK` 制約エラーで弾かれることを確認する",
    ],
    commonPitfalls: [
      "`products` を `categories` より先に作ろうとすると外部キーエラーになります → 親テーブル（`categories`）を先に作りましょう。",
    ],
    checklist: [
      "`sql/schema.sql` で `users`・`categories`・`products` の3テーブルと制約を作成した",
      "`sql/data.sql` で初期カテゴリ3件・初期商品5件を投入した",
      "pgAdmin 4 で `SELECT` してデータが入っていることを確認した",
      "`feature/step05-db-ddl` ブランチからPRを作成した",
    ],
    explanation: "DB側にも `UNIQUE` や `CHECK (price >= 0)` を張っておくことで、万一プログラムにバグがあっても不正データを防ぐ二重防御になります。",
    hints: ["`users` の初期データ（BCryptパスワード）はStep 13で安全に投入するので、今はテーブル作成だけでOKです。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441406",
    chapterId: SB_CH2,
    lessonId: SB_LS2,
    orderIndex: 2,
    stepNumber: 6,
    title: "Step 6：Entity 3クラス＆Repository作成 → `ddl-auto=validate` 起動整合を突破する",
    difficulty: "medium",
    estimatedMinutes: 90,
    tags: ["Spring Data JPA", "Entity", "Repository"],
    recommendedBranch: "feature/step06-entity-repo",
    designDocPath: PRODUCT_SPEC_PATH,
    designDocLabel: "商品管理システム 詳細設計書 v1.1.0（05_クラス設計・06_DB設計）",
    repoName: "product-manager",
    goal: "PostgreSQLの3テーブルに対応するJavaの `Entity` 3クラスと `Repository` 3インターフェースを作成し、`spring.jpa.hibernate.ddl-auto=validate` でエラーなく起動させます。",
    why: "EntityとDBテーブルの列名・型が1文字でもズレていると後々謎のバグになります。`validate` モードで起動成功させることが「DBとJavaが完全に噛み合った」証明です。",
    sheets: "詳細設計書 `05_クラス設計`（§3 Repository / §4 Entity）＋ `06_DB設計`",
    fileOrder: [
      "`entity/Category.java`, `entity/Product.java`, `entity/User.java` を作成する（Entityには `@Data` を付けず `@Getter` `@Setter` を個別に付与）",
      "`Product.java` の論理削除フラグはDB列 `is_deleted` に `@Column(name = \"is_deleted\") private boolean deleted = false;` とマッピングする（D-05）",
      "`repository/CategoryRepository.java`, `ProductRepository.java`, `UserRepository.java`（`JpaRepository` 継承）を作成する",
      "Spring Bootを起動して `validate` チェックを通す",
    ],
    starterSnippetTitle: "entity/Product.java の重要ポイント",
    starterSnippetLang: "java",
    starterSnippet: `@Entity
@Table(name = "products")
@Getter @Setter
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    @Column(name = "is_deleted", nullable = false)
    private boolean deleted = false;
}`,
    verifySteps: [
      "Eclipseから起動し、`Schema-validation` エラーが出ずに `Started ProductApplication` が表示される",
    ],
    commonPitfalls: [
      "`Schema-validation: missing column [is_deleted]` 等が出たら、`@Column(name = \"...\")` とPostgreSQLの列名を1文字ずつ見比べましょう。",
      "Java側フィールド名を `isDeleted` にするとLombokやJPAと衝突しやすいので、必ず `deleted` にしてください。",
    ],
    checklist: [
      "`Category`, `Product`, `User` の3 Entity を作成した（`Product` の論理削除は `deleted`）",
      "3つの `JpaRepository` インターフェースを作成した",
      "`ddl-auto=validate` のままエラーなく起動できた",
      "`feature/step06-entity-repo` ブランチからPRを作成した",
    ],
    explanation: "`ddl-auto=validate` を突破できれば、DBとJavaクラスの土台は完璧です！",
    hints: ["`@PrePersist` と `@PreUpdate` を `Product` に書いておくと、`createdAt`・`updatedAt` が自動設定されて便利です。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441407",
    chapterId: SB_CH2,
    lessonId: SB_LS2,
    orderIndex: 3,
    stepNumber: 7,
    title: "Step 7：商品一覧表示（GET /products）＆在庫少バッジ（10未満赤バッジ）実装",
    difficulty: "medium",
    estimatedMinutes: 90,
    tags: ["Spring Boot", "Thymeleaf", "Service", "一覧表示"],
    recommendedBranch: "feature/step07-product-list",
    designDocPath: PRODUCT_SPEC_PATH,
    designDocLabel: "商品管理システム 詳細設計書 v1.1.0（03_画面設計・05_クラス設計）",
    repoName: "product-manager",
    goal: "PostgreSQLに入れたサンプル商品5件を `Controller → Service → Repository` の3層経由で取得し、一覧テーブルと「在庫10未満の赤バッジ」を表示します。",
    why: "ここで初めてDBのデータがブラウザ画面に届きます！10未満のしきい値は定数クラス（`ProductConstants`）に置く実務作法も身につけます。",
    sheets: "詳細設計書 `03_画面設計`（SCR-02）＋ `05_クラス設計` ＋ モックアップ（商品一覧シート）",
    fileOrder: [
      "`constant/ProductConstants.java` を作り `public static final int LOW_STOCK_THRESHOLD = 10;` を定義する",
      "`ProductRepository` に `JOIN FETCH p.category` 付きの未削除全件取得クエリ（ID昇順）を書く",
      "`service/ProductService.java` と `service/CategoryService.java` を作成する（`@Transactional(readOnly = true)`）",
      "`ProductController#list` で `products` を `Model` に詰め、`templates/products/list.html` に `th:each` でテーブル描画する",
    ],
    starterSnippetTitle: "templates/products/list.html の在庫少バッジ部分",
    starterSnippetLang: "html",
    starterSnippet: `<tr th:each="p : \${products}">
  <td th:text="\${p.sku}"></td>
  <td th:text="\${p.name}"></td>
  <td th:text="\${p.category.name}"></td>
  <td th:text="\${#numbers.formatInteger(p.price, 1, 'COMMA') + '円'}"></td>
  <td>
    <span th:text="\${p.stock}"></span>
    <span th:if="\${p.stock < lowStockThreshold}" class="badge-low">在庫少</span>
  </td>
</tr>`,
    verifySteps: [
      "`http://localhost:8080/products` に初期商品5件がカテゴリ名・3桁カンマ単価付きで表示される",
      "在庫8の「メカニカルキーボード」と在庫3の「USB-Cハブ」にだけ赤色の「在庫少」バッジが出る",
    ],
    commonPitfalls: [
      "`LazyInitializationException` が出た → `ProductRepository` のJPQLに `JOIN FETCH p.category` を入れ忘れています。",
    ],
    checklist: [
      "`ProductConstants.LOW_STOCK_THRESHOLD = 10` を定義した",
      "Controller → Service → Repository 経由で未削除商品一覧を取得できた",
      "単価の3桁区切り＋「円」表示と、在庫10未満の赤バッジが表示された",
      "`feature/step07-product-list` ブランチからPRを作成した",
    ],
    explanation: "これでDBから画面までの1本の道（Read）が開通しました！次は検索と詳細画面を追加します。",
    hints: ["0件時の「該当する商品がありません」表示（`th:if=\"${#lists.isEmpty(products)}\"`）も一緒に入れておきましょう。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441408",
    chapterId: SB_CH2,
    lessonId: SB_LS2,
    orderIndex: 4,
    stepNumber: 8,
    title: "Step 8：複合検索（商品名＋カテゴリ＋LIKEエスケープ）＆ 商品詳細画面（GET /products/{id}）",
    difficulty: "medium",
    estimatedMinutes: 120,
    tags: ["Spring Boot", "JPQL", "複合検索", "詳細画面"],
    recommendedBranch: "feature/step08-search-detail",
    designDocPath: PRODUCT_SPEC_PATH,
    designDocLabel: "商品管理システム 詳細設計書 v1.1.0（02_機能要件 FN-004/005・07_処理詳細）",
    repoName: "product-manager",
    goal: "商品名（部分一致・大小無視）とカテゴリのAND検索（条件保持・クリア付き）と、商品名クリックで開く商品詳細画面（`/products/{id}`）を実装します。",
    why: "実務の一覧画面では複合検索＋条件保持が必須です。また `%` や `_` のLIKEエスケープを学ぶことでSQLの罠を防げるようになります。",
    sheets: "詳細設計書 `03_画面設計`（SCR-02/03）・`07_処理詳細`（P-02）＋ モックアップ（商品詳細シート）",
    fileOrder: [
      "`ProductService#search(keyword, categoryId)` で `null`→`\"\"`・`trim()`・`\\`/`%`/`_` エスケープを実装する",
      "`ProductRepository` に `searchActive(escapedKeyword, categoryId)` と `findActiveById(id)`（`JOIN FETCH`付き）を実装する",
      "`exception/ProductNotFoundException.java` を作り、`ProductService#findById` で未存在・削除済み時に投げる",
      "`ProductController#detail` と `templates/products/detail.html` を作り、一覧の商品名にリンクを張る",
    ],
    starterSnippetTitle: "ProductService#search のエスケープ処理",
    starterSnippetLang: "java",
    starterSnippet: `String normalized = (keyword == null) ? "" : keyword.trim();
String escaped = normalized
    .replace("\\\\", "\\\\\\\\")
    .replace("%", "\\\\%")
    .replace("_", "\\\\_");
return productRepository.searchActive(escaped, categoryId);`,
    verifySteps: [
      "「マウス」＋カテゴリ「PC・周辺機器」で検索し、該当商品だけが表示されフォームに検索条件が残る",
      "「クリア」リンクで全件に戻る。`%` だけ検索して全件ヒットしないこと（0件になること）を確認する",
      "商品名クリックで `/products/1` が開き、SKU・単価・在庫・説明・登録/更新日時が表示される",
    ],
    commonPitfalls: [
      "PostgreSQLで `keyword` に `null` を渡すと型推論エラーになることがあります → Serviceで必ず `\"\"` へ正規化してからRepositoryへ渡しましょう。",
    ],
    checklist: [
      "商品名（大小無視・部分一致）＋カテゴリの複合検索と検索条件保持が動く",
      "`%` や `_` を検索しても文字通りに検索される（LIKEエスケープ）",
      "商品詳細画面（`/products/{id}`）に全項目が表示される",
      "`feature/step08-search-detail` ブランチからPRを作成した",
    ],
    explanation: "これで「見る機能（一覧・検索・詳細）」がすべて完成しました！次の章からデータを書き換える機能（Create/Update/Delete）へ進みます。",
    hints: ["詳細画面の商品説明は `th:text`＋CSSの `white-space: pre-wrap;` にするとXSSを防ぎつつ改行を保持できます。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441409",
    chapterId: SB_CH3,
    lessonId: SB_LS3,
    orderIndex: 1,
    stepNumber: 9,
    title: "Step 9：商品新規登録（GET /products/new → POST /products）＆ PRGパターン実装",
    difficulty: "medium",
    estimatedMinutes: 90,
    tags: ["Spring Boot", "POST", "PRGパターン", "Thymeleaf"],
    recommendedBranch: "feature/step09-product-create",
    designDocPath: PRODUCT_SPEC_PATH,
    designDocLabel: "商品管理システム 詳細設計書 v1.1.0（03_画面設計 SCR-04・04_URL・IF設計）",
    repoName: "product-manager",
    goal: "新規登録画面（`form.html`）から商品を1件DBへ保存し、`redirect:/products`（PRGパターン）で一覧へ戻して緑の完了フラッシュメッセージを出します。",
    why: "まずはバリデーションを乗せる前に「フォーム入力 → POST → DBへINSERT → リダイレクト」という登録の基本パイプラインを確実に動かします。",
    sheets: "詳細設計書 `03_画面設計`（SCR-04）・`04_URL・IF設計`（No.7, 8）＋ モックアップ（商品登録シート）",
    fileOrder: [
      "`form/ProductForm.java` を作成する（Entityと分離した入力受け取り専用クラス）",
      "`ProductService#create(ProductForm)` を実装する（`@Transactional` で `Product` へ詰替えて `save`）",
      "`ProductController` に `GET /products/new` と `POST /products` を追加し、`RedirectAttributes` で完了メッセージを積んで `redirect:/products` を返す",
      "`templates/products/form.html` を作成し、一覧画面に「＋ 新規登録」ボタンを配置する",
    ],
    starterSnippetTitle: "PRGパターンの Controller 書き出し",
    starterSnippetLang: "java",
    starterSnippet: `@PostMapping
public String create(@ModelAttribute ProductForm productForm, RedirectAttributes ra) {
    productService.create(productForm);
    ra.addFlashAttribute("message", "商品を登録しました");
    return "redirect:/products"; // F5更新での二重登録を防ぐ！
}`,
    verifySteps: [
      "`/products/new` から新商品（例：`PRD-0099`）を登録すると `/products` へ移動し「商品を登録しました」が出る",
      "一覧画面でF5（リロード）を押しても、商品が二重登録されない",
      "pgAdmin 4 で `products` テーブルに新しい行が追加されている",
    ],
    commonPitfalls: [
      "カテゴリプルダウンの値が届かない → `<select th:field=\"*{categoryId}\">` の名前が `ProductForm` のフィールド名と一致しているか確認しましょう。",
    ],
    checklist: [
      "`ProductForm` と `templates/products/form.html` を作成した",
      "`GET /products/new` → `POST /products` でDBに新規登録できる",
      "PRGパターンでリダイレクトされ、完了フラッシュメッセージが表示される",
      "`feature/step09-product-create` ブランチからPRを作成した",
    ],
    explanation: "Entityを直接フォームに使わず `ProductForm` を挟むことで、次のStep 10のバリデーションがとても綺麗に書けるようになります。",
    hints: ["フラッシュメッセージ表示枠（`th:if=\"${message}\"`）は `list.html` の上部に配置しましょう。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441410",
    chapterId: SB_CH3,
    lessonId: SB_LS3,
    orderIndex: 2,
    stepNumber: 10,
    title: "Step 10：形式バリデーション（@Valid・messages.properties）＆入力エラー再表示",
    difficulty: "medium",
    estimatedMinutes: 90,
    tags: ["Bean Validation", "messages.properties", "エラー処理"],
    recommendedBranch: "feature/step10-form-validation",
    designDocPath: PRODUCT_SPEC_PATH,
    designDocLabel: "商品管理システム 詳細設計書 v1.1.0（08_検証・エラー）",
    repoName: "product-manager",
    goal: "`ProductForm` に全入力チェック（必須・SKU形式・文字数・単価0〜1000万・在庫0〜999,999）を実装し、NG時に「入力値を消さず・各欄の下に赤字エラー」を出します。",
    why: "画面入力のチェックを省くと、不正な値でDBエラー（500画面）になってしまいます。Bean ValidationはSpring Boot実務で毎回必ず使う必須技術です。",
    sheets: "詳細設計書 `08_検証・エラー`（全検証ルール・`messages.properties` 文言）",
    fileOrder: [
      "`ProductForm.java` に `@NotBlank`, `@Pattern(regexp = \"^[A-Z0-9-]{3,32}$\")`, `@Size`, `@NotNull`, `@Min`, `@Max` を付与する",
      "`src/main/resources/messages.properties` を作り、日本語エラーメッセージを定義する",
      "`ProductController` に `@InitBinder`（前後空白除去＋空文字→null）を追加し、`create` に `@Valid` と `BindingResult` を付ける",
      "`form.html` の各入力欄の下に `<p class=\"error\" th:if=\"${#fields.hasErrors('...')}\" th:errors=\"*{...}\"></p>` を追加する",
    ],
    starterSnippetTitle: "Controller の BindingResult チェック（重要ルール）",
    starterSnippetLang: "java",
    starterSnippet: `// ★BindingResult は必ず @Valid の直後に書くこと！
@PostMapping
public String create(@Valid @ModelAttribute ProductForm productForm,
                     BindingResult bindingResult, RedirectAttributes ra, Model model) {
    if (bindingResult.hasErrors()) {
        model.addAttribute("categories", categoryService.findAllOrdered()); // 再セット必須！
        return "products/form"; // リダイレクトせず直接返す
    }
    ...`,
    verifySteps: [
      "空のまま「登録する」を押すと、全必須項目の下に日本語の赤字エラーが表示される",
      "小文字SKU（`prd-1`）や単価 `-100` を入れると弾かれ、他の入力欄の値は消えずに保持される",
      "エラー再表示時もカテゴリプルダウンの選択肢が空にならない",
    ],
    commonPitfalls: [
      "エラー再表示時にカテゴリプルダウンが空になる → `if (bindingResult.hasErrors())` の中で `categories` を `Model` に詰め直すのを忘れています！",
    ],
    checklist: [
      "`ProductForm` に設計書 `08_検証・エラー` の全アノテーションを設定した",
      "`messages.properties` で日本語エラーメッセージが表示される",
      "`@InitBinder` で前後空白を除去し、エラー時に値とカテゴリ選択肢が保持される",
      "`feature/step10-form-validation` ブランチからPRを作成した",
    ],
    explanation: "形式チェック（`@Valid`）が整いました。次はDBを見ないと判定できない「SKU重複チェック」を実装します。",
    hints: ["`application.properties` に `spring.messages.basename=messages` があることを確認しましょう。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441411",
    chapterId: SB_CH3,
    lessonId: SB_LS3,
    orderIndex: 3,
    stepNumber: 11,
    title: "Step 11：業務バリデーション（SKU重複チェック・カテゴリ存在確認・saveAndFlush）",
    difficulty: "medium",
    estimatedMinutes: 90,
    tags: ["業務バリデーション", "BusinessException", "トランザクション"],
    recommendedBranch: "feature/step11-business-validation",
    designDocPath: PRODUCT_SPEC_PATH,
    designDocLabel: "商品管理システム 詳細設計書 v1.1.0（07_処理詳細・08_検証・エラー）",
    repoName: "product-manager",
    goal: "`BusinessException` を作成し、Service層で「既存SKU（削除済み含む）との重複」「存在しないカテゴリID」を検知してフォームの該当欄へ赤字エラーを表示します。",
    why: "「形式は正しいがDB上すでに使われているSKU」は `@Valid` では防げません。Service層で業務例外を投げてControllerで `bindingResult.rejectValue` する流れは実務の王道パターンです。",
    sheets: "詳細設計書 `06_DB設計 §7`・`07_処理詳細`・`08_検証・エラー`",
    fileOrder: [
      "`exception/BusinessException.java`（`field` と `messageCode` を持つ `RuntimeException`）を作成する",
      "`ProductRepository` に `existsBySku(String sku)` と `existsBySkuAndIdNot(String sku, Long id)` を追加する",
      "`ProductService#create` でカテゴリ存在確認→`existsBySku`→`saveAndFlush`（`DataIntegrityViolationException` も重複エラーへ変換）を実装する",
      "`ProductController#create` で `BusinessException` を `catch` し、`bindingResult.rejectValue(ex.getField(), ex.getMessageCode())` でフォーム再表示する",
    ],
    starterSnippetTitle: "ProductService#create の重複チェック＆競合防御",
    starterSnippetLang: "java",
    starterSnippet: `if (productRepository.existsBySku(form.getSku())) {
    throw new BusinessException("sku", "product.sku.duplicate");
}
try {
    return productRepository.saveAndFlush(p);
} catch (DataIntegrityViolationException e) {
    throw new BusinessException("sku", "product.sku.duplicate");
}`,
    verifySteps: [
      "既存の `PRD-0001` で新規登録すると、SKU欄の下に「このSKUはすでに登録されています」と赤字表示され登録されない",
      "存在しないカテゴリIDを送信しても500エラーにならず入力エラーとして扱われる",
    ],
    commonPitfalls: [
      "通常の `save()` だとメソッド終了時までSQLが飛ばず `try-catch` で一意制約違反を捕まえられません → `saveAndFlush()` を使うのがポイントです。",
    ],
    checklist: [
      "`BusinessException` を作成し、SKU重複・カテゴリ不正を検知できる",
      "`saveAndFlush` で同時登録のDB一意制約違反も業務エラーへ変換している",
      "重複SKUで登録すると500画面にならずSKU欄の下に赤字エラーが出る",
      "`feature/step11-business-validation` ブランチからPRを作成した",
    ],
    explanation: "これで形式チェック（Form）＋業務チェック（Service）＋DB制約（PostgreSQL）の3重防御が完成しました！",
    hints: ["`messages.properties` に `product.sku.duplicate=このSKUはすでに登録されています` を追加しておきましょう。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441412",
    chapterId: SB_CH3,
    lessonId: SB_LS3,
    orderIndex: 4,
    stepNumber: 12,
    title: "Step 12：商品編集（GET /products/{id}/edit → POST /products/{id}）＆ 論理削除実装",
    difficulty: "hard",
    estimatedMinutes: 120,
    tags: ["Spring Boot", "CRUD", "編集", "論理削除"],
    recommendedBranch: "feature/step12-edit-softdelete",
    designDocPath: PRODUCT_SPEC_PATH,
    designDocLabel: "商品管理システム 詳細設計書 v1.1.0（02_機能要件 FN-007/008・07_処理詳細）",
    repoName: "product-manager",
    goal: "新規と共通の `form.html` を使って商品編集（自分のSKU維持OK／他商品SKU重複NG）を実装し、確認ダイアログ付きの論理削除（`is_deleted = true`）を完成させます。",
    why: "編集時のSKU重複判定（`existsBySkuAndIdNot`）と、データを消さずに保全する論理削除（`deleted = true`）は業務システムで頻出の重要パターンです。",
    sheets: "詳細設計書 `03_画面設計`（SCR-05）・`07_処理詳細`（編集・論理削除）＋ モックアップ（商品編集シート）",
    fileOrder: [
      "`ProductService` に `findFormById(id)`・`update(id, form)`（`existsBySkuAndIdNot`使用）・`softDelete(id)`（`p.setDeleted(true)`）を追加する",
      "`ProductController` に `GET /products/{id}/edit`、`POST /products/{id}`、`POST /products/{id}/delete` を追加する",
      "`templates/products/form.html` で `productId != null` のとき見出しを「商品編集」、送信先を `/products/{id}` へ切り替える",
      "`list.html` と `detail.html` に編集リンクと `onsubmit=\"return confirm(...)\"` 付きのPOST削除フォームを追加する",
    ],
    starterSnippetTitle: "ProductService#softDelete（物理削除は絶対禁止！）",
    starterSnippetLang: "java",
    starterSnippet: `@Transactional
public void softDelete(Long id) {
    Product p = findById(id); // 未存在・削除済みは404例外
    p.setDeleted(true);       // DELETE文は使わずフラグだけtrueに更新！
}`,
    verifySteps: [
      "編集画面で既存値が初期表示され、SKUを変えずに商品名だけ変更して更新できる",
      "編集画面で他商品のSKU（例：`PRD-0002`）へ変更しようとすると重複エラーになる",
      "削除ボタン→キャンセルで何も起きず、OKで一覧から消える。pgAdmin 4 で行が残り `is_deleted = true` になっている",
    ],
    commonPitfalls: [
      "編集で `existsBySku` を使ってしまうと、自分のSKUとぶつかって毎回エラーになります → 編集は必ず `existsBySkuAndIdNot(sku, id)` を使います。",
    ],
    checklist: [
      "商品編集が動作し、自分自身のSKU維持OK・他商品SKU重複NGになっている",
      "更新時に `updated_at` のみ更新され `created_at` が変わらない",
      "論理削除で一覧から非表示になり、DB上は `is_deleted = true` で行が残っている",
      "`feature/step12-edit-softdelete` ブランチからPRを作成した",
    ],
    explanation: "これで商品管理の全CRUD機能（一覧・検索・詳細・登録・編集・論理削除）がすべて完成しました！",
    hints: ["削除済み商品の `/products/{id}` へ直接アクセスして404扱いになることも確認しましょう。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441413",
    chapterId: SB_CH4,
    lessonId: SB_LS4,
    orderIndex: 1,
    stepNumber: 13,
    title: "Step 13：Spring Security 導入（SecurityConfig・LoginUser・BCrypt初期ユーザー）",
    difficulty: "hard",
    estimatedMinutes: 120,
    tags: ["Spring Security", "BCrypt", "認証"],
    recommendedBranch: "feature/step13-security-core",
    designDocPath: PRODUCT_SPEC_PATH,
    designDocLabel: "商品管理システム 詳細設計書 v1.1.0（09_セキュリティ・06_DB設計 §6）",
    repoName: "product-manager",
    goal: "`spring-boot-starter-security` を導入し、PostgreSQLの `users` テーブル＋`BCryptPasswordEncoder` で認証するバックエンド基盤を構築します。",
    why: "実務の社内システムに認証は必須です。パスワードを平文で保存せずBCryptハッシュ化する仕組みと、`UserDetailsService` の動きを理解します。",
    sheets: "詳細設計書 `09_セキュリティ` ＋ `06_DB設計 §6`（初期ユーザー）",
    fileOrder: [
      "`pom.xml` に `spring-boot-starter-security` と `thymeleaf-extras-springsecurity6` を追加し、Maven更新を実行する",
      "`security/LoginUser.java`（`UserDetails` 実装・`fullName` を保持）と `security/CustomUserDetailsService.java`（`findByEmail`）を作成する",
      "`config/SecurityConfig.java` を作成し、`/login`・`/error`・`/css/**` 以外の全URLを `authenticated()` にし、`BCryptPasswordEncoder` をBean定義する",
      "`config/DataInitializer.java`（`CommandLineRunner`）で初期ユーザー（`admin@example.com` / `user@example.com`）をBCryptハッシュ化して自動投入する",
    ],
    starterSnippetTitle: "SecurityConfig.java の要点",
    starterSnippetLang: "java",
    starterSnippet: `.authorizeHttpRequests(auth -> auth
    .requestMatchers("/login", "/error", "/css/**", "/js/**", "/images/**").permitAll()
    .anyRequest().authenticated()
)
.formLogin(login -> login
    .loginPage("/login").usernameParameter("email")
    .defaultSuccessUrl("/products", true).failureUrl("/login?error").permitAll()
)`,
    verifySteps: [
      "未ログインで `http://localhost:8080/products` にアクセスすると `/login` へ自動リダイレクトされる",
      "pgAdmin 4 で `SELECT email, password_hash FROM users;` を実行し、`$2a$10$...` 形式のBCryptハッシュが入っている",
    ],
    commonPitfalls: [
      "HTMLのメールアドレス欄の `name` と `usernameParameter(\"email\")` がズレていると認証が通りません。両方 `email` に統一しましょう。",
    ],
    checklist: [
      "`pom.xml` にSpring Security依存関係を追加した",
      "`LoginUser`・`CustomUserDetailsService`・`SecurityConfig` を実装した",
      "初期ユーザーがBCryptハッシュで `users` テーブルに保存された",
      "`feature/step13-security-core` ブランチからPRを作成した",
    ],
    explanation: "認証バックエンドが完成しました。次は専用のログイン画面・ログアウトボタン・404/500エラー画面を整えます！",
    hints: ["`SecurityConfig` でCSRFは無効化せず、デフォルト有効のまま維持してください。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441414",
    chapterId: SB_CH4,
    lessonId: SB_LS4,
    orderIndex: 2,
    stepNumber: 14,
    title: "Step 14：ログイン画面・POSTログアウト・共通エラー画面（GlobalExceptionHandler 404/500）",
    difficulty: "medium",
    estimatedMinutes: 90,
    tags: ["Thymeleaf", "ログアウト", "例外処理", "エラー画面"],
    recommendedBranch: "feature/step14-login-error-ui",
    designDocPath: PRODUCT_SPEC_PATH,
    designDocLabel: "商品管理システム 詳細設計書 v1.1.0（03_画面設計 SCR-01/06・08_検証・エラー）",
    repoName: "product-manager",
    goal: "ログイン画面（`login.html`）、ヘッダーのログイン氏名＆POSTログアウトボタン、および404/500用の自作エラー画面（`GlobalExceptionHandler`＋`error.html`）を完成させます。",
    why: "Whitelabel Error Pageやスタックトレースをユーザーに見せないこと、ログアウトをCSRF保護付きPOSTにすることは実務セキュリティの必須要件です。",
    sheets: "詳細設計書 `03_画面設計`（SCR-01, SCR-06）・`08_検証・エラー`（例外→画面対応）",
    fileOrder: [
      "`AuthController` に `@GetMapping(\"/login\")` を追加し、`templates/login.html` を作成する（`param.error` / `param.logout` メッセージ表示付き）",
      "`templates/fragments/layout.html` にログイン者氏名（`#authentication.principal.fullName`）と `POST /logout` フォームを追加する",
      "`exception/GlobalExceptionHandler.java`（`@ControllerAdvice`）を作成し、404（商品未存在・URL不正）と500（想定外例外）を `templates/error.html` へ誘導する",
      "`application.properties` に `server.error.whitelabel.enabled=false` を設定し、`templates/error.html` を作成する",
    ],
    starterSnippetTitle: "GlobalExceptionHandler.java の書き出し",
    starterSnippetLang: "java",
    starterSnippet: `@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler({ProductNotFoundException.class, MethodArgumentTypeMismatchException.class})
    public String handleNotFound(Exception ex, HttpServletResponse res, Model model) {
        res.setStatus(HttpStatus.NOT_FOUND.value());
        model.addAttribute("status", 404);
        model.addAttribute("message", "お探しのページ（商品）は見つかりません");
        return "error";
    }
}`,
    verifySteps: [
      "`/login` で誤パスワードを入れると赤エラー、正しい情報で `/products` へ遷移しヘッダーに氏名が表示される",
      "ログアウトボタンで `/login?logout` へ移動し、ブラウザバックしても保護画面を操作できない",
      "`/products/999999` や `/products/abc` にアクセスすると自作の404エラー画面が表示される",
    ],
    commonPitfalls: [
      "ログアウトを `<a href=\"/logout\">`（GET）にすると404やCSRFエラーになります → 必ず `<form th:action=\"@{/logout}\" method=\"post\">` を使いましょう。",
    ],
    checklist: [
      "`login.html` でログイン・失敗エラー・ログアウトメッセージが正しく動く",
      "ヘッダーにログイン者氏名とPOSTログアウトボタンが表示される",
      "存在しないID・削除済みID・数値以外IDで自作の404画面が表示される",
      "`feature/step14-login-error-ui` ブランチからPRを作成した",
    ],
    explanation: "これで商品管理システムの全6画面と全機能（FN-001〜FN-010）が実装完了です！",
    hints: ["`th:action` を使えばThymeleafが自動でCSRFトークンの `<input type=\"hidden\" name=\"_csrf\">` を埋め込んでくれます。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441415",
    chapterId: SB_CH4,
    lessonId: SB_LS4,
    orderIndex: 3,
    stepNumber: 15,
    title: "Step 15：テスト仕様書（TC-001〜TC-022）全件実施 ＆ JUnit 5 単体テスト作成",
    difficulty: "hard",
    estimatedMinutes: 120,
    tags: ["テスト仕様書", "JUnit 5", "品質検証"],
    recommendedBranch: "feature/step15-testing",
    designDocPath: PRODUCT_SPEC_PATH,
    designDocLabel: "商品管理システム 詳細設計書 v1.1.0（10_テスト仕様：TC-001〜TC-022）",
    repoName: "product-manager",
    goal: "詳細設計書 `10_テスト仕様` の全22ケース（基本12＋推奨境界/セキュリティ10）を実機確認し、さらに `ProductServiceTest`（JUnit 5）で重要業務ロジックを自動テスト化します。",
    why: "「動く気がする」ではなく、仕様書の全テストケースを1件ずつ潰してエビデンスを残すのがプロの開発工程です。",
    sheets: "詳細設計書 `10_テスト仕様`（`TC-001`〜`TC-022`：判定プルダウンで合格率が自動集計されます）",
    fileOrder: [
      "`src/test/java/com/example/product/service/ProductServiceTest.java` を作成し、①SKU重複例外 ②論理削除（`deleted=true`） ③LIKEエスケープのJUnit 5テストを書く",
      "`./mvnw test`（またはEclipseでJUnit実行）を走らせて全テストGreenを確認する",
      "ブラウザとpgAdmin 4で `TC-001〜TC-022` を1件ずつ実行し、不具合があれば修正して全件「合格」にする",
    ],
    verifySteps: [
      "`./mvnw test` が `Failures: 0, Errors: 0` で完走する",
      "詳細設計書 `10_テスト仕様` の合格率が **100%** になっている",
    ],
    commonPitfalls: [
      "`TC-010`（論理削除）は画面から消えただけでなく、必ずPostgreSQLで `SELECT is_deleted FROM products` を実行して行が残っていることを確認してください。",
    ],
    checklist: [
      "`ProductServiceTest`（JUnit 5）を作成し `./mvnw test` が全件合格した",
      "詳細設計書 `10_テスト仕様`（`TC-001〜TC-022`）を全件実施し合格を確認した",
      "発見した不具合をすべて修正して再テストした",
      "`feature/step15-testing` ブランチからPRを作成した",
    ],
    explanation: "自動テスト＋仕様書ベースの手動検証の両輪が回せれば、品質保証の基礎はバッチリです！",
    hints: ["テスト中に見つかったバグは「原因→修正内容」をPR本文に書くと、講師からの評価がグッと上がります。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441416",
    chapterId: SB_CH4,
    lessonId: SB_LS4,
    orderIndex: 4,
    stepNumber: 16,
    title: "Step 16：README.md整備・新規クローン起動確認 ＆ 最終PR URL提出",
    difficulty: "medium",
    estimatedMinutes: 60,
    tags: ["README", "GitHub提出", "ポートフォリオ"],
    recommendedBranch: "feature/step16-final-release",
    designDocPath: PRODUCT_SPEC_PATH,
    designDocLabel: "商品管理システム 詳細設計書 v1.1.0（11_開発手順・TC-012）",
    repoName: "product-manager",
    goal: "第三者（講師・採用担当者）が `git clone` して迷わず動かせる `README.md` を整備し、別フォルダでの再現起動を確認して最終PR URLを提出します。",
    why: "どれだけ良いアプリを作っても、動かし方が書いていなければ評価されません。自分の環境以外でも動く再現性チェック（TC-012）が仕上げです。",
    sheets: "詳細設計書 `01_システム概要・環境 §7`・`11_開発手順`",
    fileOrder: [
      "`README.md` に ①システム概要・技術スタック ②PostgreSQL DB作成＆DDL実行手順 ③起動コマンド ④テスト用ログインID/PW ⑤工夫した点 を記載する",
      "PCの別フォルダに自分のリポジトリを新規 `git clone` し、READMEの手順通りに起動できるか確認する",
      "最終ブランチ `feature/step16-final-release` から最終Pull Requestを作成し、PR URLを提出する",
    ],
    verifySteps: [
      "別フォルダへの `git clone` → `./mvnw spring-boot:run` でエラーなく起動・ログイン・全操作ができる",
      "GitHub上にパスワード等の秘密情報が誤ってPushされていない",
    ],
    commonPitfalls: [
      "ローカルの `application.properties` に自分のDBパスワードを直書きしたままPushしないよう、`git diff` で提出前に確認しましょう。",
    ],
    checklist: [
      "`README.md` にDB作成手順・起動方法・テストアカウントを分かりやすく記載した",
      "別フォルダへ新規 `git clone` してエラーなく起動・動作確認できた（TC-012）",
      "秘密情報・不要ファイルがGitHubに含まれていないことを確認した",
      "`feature/step16-final-release` から最終PRを作成しPR URLを提出した",
    ],
    explanation: "個人開発「商品管理システム」全16ステップ完遂おめでとうございます！この開発力を武器に、いよいよ最終段階の3人1組チーム開発へ進みましょう！",
    hints: ["完成した画面のスクリーンショットを `README.md` に貼ると、ポートフォリオとしての見栄えが格段に良くなります。"],
  }),
];

// =============================================================================
// 2. チーム開発実践（3人1組）：総合業務Webシステム TeamOps Hub（3か月・全4章・16ステップ）
// =============================================================================
const TM_CH1 = "22222222-2222-4222-8222-222222221501";
const TM_CH2 = "22222222-2222-4222-8222-222222221502";
const TM_CH3 = "22222222-2222-4222-8222-222222221503";
const TM_CH4 = "22222222-2222-4222-8222-222222221504";
const TM_LS1 = "33333333-3333-4333-8333-333333331501";
const TM_LS2 = "33333333-3333-4333-8333-333333331502";
const TM_LS3 = "33333333-3333-4333-8333-333333331503";
const TM_LS4 = "33333333-3333-4333-8333-333333331504";

export const TEAM_PROJECT_CHAPTERS: SeedChapter[] = [
  {
    id: TM_CH1,
    course_id: SEED_TEAM_PROJECT_COURSE_ID,
    title: "第1章（1か月目）：チーム始動・Git運用・共通基盤の協働構築（Step 1〜5）",
    description: "3名分担と所有権合意、共通6テーブルDB、ADMIN/USER認証、403保護、共通ナビ＆IF契約スタブまで全員で土台を固めます。",
    order_index: 1,
    lesson_id: TM_LS1,
    lesson_title: "体制構築・6テーブルDB・共通認証・IFスタブ",
  },
  {
    id: TM_CH2,
    course_id: SEED_TEAM_PROJECT_COURSE_ID,
    title: "第2章（2か月目）：担当3画面の並行開発とPR相互レビュー（Step 6〜11）",
    description: "各自の専有パッケージで1画面ずつ小さくPRを出し合い、相互レビュー・状態遷移・排他ロック・単体テストを完遂します。",
    order_index: 2,
    lesson_id: TM_LS2,
    lesson_title: "担当3画面実装・PR相互レビュー・UT",
  },
  {
    id: TM_CH3,
    course_id: SEED_TEAM_PROJECT_COURSE_ID,
    title: "第3章（3か月目前半）：横断統合・コンフリクト解消・結合テスト（Step 12〜14）",
    description: "IF契約の本接続、コンフリクト解消実践、権限総当たり＆同時承認排他検証、横断結合テストIT-001〜012とIssue改修を行います。",
    order_index: 3,
    lesson_id: TM_LS3,
    lesson_title: "全10画面結合・権限/排他検証・結合テスト",
  },
  {
    id: TM_CH4,
    course_id: SEED_TEAM_PROJECT_COURSE_ID,
    title: "第4章（3か月目後半）：リリースPR・GitHub監査・デモ発表＆最終提出（Step 15〜16）",
    description: "develop→mainリリース、3名全員のGitHub貢献監査（IT-007）、README整備と最終デモ発表で集大成を迎えます。",
    order_index: 4,
    lesson_id: TM_LS4,
    lesson_title: "リリース・監査・最終発表提出",
  },
];

export const TEAM_PROJECT_PROBLEMS: SeedProblem[] = [
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441501",
    chapterId: TM_CH1,
    lessonId: TM_LS1,
    orderIndex: 1,
    stepNumber: 1,
    title: "Team Step 1：3名役割分担（A/B/C各3画面）・ファイル所有権＆Git Flow整備",
    difficulty: "medium",
    estimatedMinutes: 90,
    tags: ["チーム開発", "役割分担", "Git Flow", "PRテンプレート"],
    recommendedBranch: "feature/team-step01-rules",
    designDocPath: TEAM_SPEC_PATH,
    designDocLabel: "TeamOps Hub 開発者向け詳細設計書 v1.1.0（全16シート）",
    isTeamProject: true,
    repoName: "teamops-hub",
    goal: "3名の担当（A:社員＆ダッシュボード / B:案件＆タスク / C:備品＆貸出）と触ってよいファイル境界を合意し、`develop` ブランチとPRテンプレートを整えます。",
    why: "チーム開発のトラブルの8割は「誰がどのファイルを触るか決めていなかった」ことで起きます。最初に境界を設計書で揃えるのが成功の秘訣です。",
    sheets: "詳細設計書 `00_表紙`〜`03_Git・PR運用` ＋ 画面モックアップ（全11シート）",
    mermaidDiagram: "```mermaid\ngraph TD\n  Login[\"共通：SCR-00 ログイン\"]\n  Login --> A[\"メンバーA（3画面）\\nダッシュボード / 社員一覧 / 社員登録編集\"]\n  Login --> B[\"メンバーB（3画面）\\n案件一覧 / 案件詳細・タスク / タスク登録編集\"]\n  Login --> C[\"メンバーC（3画面）\\n備品一覧 / 貸出申請一覧 / 承認・返却詳細\"]\n```",
    fileOrder: [
      "チーム共有リポジトリ `teamops-hub` を作成し、3名全員をCollaboratorに登録する",
      "`main` から `develop` ブランチを作成し、直接Push禁止・PRレビュー必須のルールを合意する",
      "`.github/pull_request_template.md`（設計書 `03_Git・PR運用 §4`）と役割分担表を作成し、`develop` 宛の初回PRを出す",
    ],
    verifySteps: [
      "3名全員がリポジトリを `git clone` し、`develop` ブランチへ切り替えられる",
      "GitHubでPR作成時にテンプレートが自動入力される",
    ],
    commonPitfalls: [
      "いきなり `main` へ直接Pushしてしまう → Step 1で全員 `git switch develop` してから作業開始する習慣をつけましょう。",
    ],
    checklist: [
      "メンバーA/B/Cの担当3画面とファイル所有権を3名全員で合意した",
      "共有リポジトリを作成し、3名全員をCollaborator登録・`develop` を作成した",
      "`.github/pull_request_template.md` を追加し初回PRを作成した",
      "詳細設計書（全16シート）とモックアップ（全11シート）を全員で確認した",
    ],
    explanation: "役割分担とGitルールが整いました。次は全員で共通の6テーブルDBを構築します！",
    hints: ["毎日10分の朝会（昨日やったこと・今日やること・困っていること）を決めると進捗ズレを防げます。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441502",
    chapterId: TM_CH1,
    lessonId: TM_LS1,
    orderIndex: 2,
    stepNumber: 2,
    title: "Team Step 2：共通6テーブルDDL（teamops_db）＆初期データ構築",
    difficulty: "medium",
    estimatedMinutes: 90,
    tags: ["PostgreSQL", "6テーブルDDL", "チーム基盤"],
    recommendedBranch: "feature/team-step02-db-ddl",
    designDocPath: TEAM_SPEC_PATH,
    designDocLabel: "TeamOps Hub 詳細設計書 v1.1.0（08_DB設計）",
    isTeamProject: true,
    repoName: "teamops-hub",
    goal: "全員のローカルPostgreSQLに `teamops_db` と全6テーブル（`departments`, `users`, `projects`, `tasks`, `equipments`, `equipment_loans`）を構築します。",
    why: "3人の機能が外部キーで繋がるため、DB構造をStep 2で全員同じ状態に確定しておくことで、以降の並行開発でテーブル不整合を防ぎます。",
    sheets: "詳細設計書 `08_DB設計`（ER図・全6テーブル定義・制約・初期データ）",
    mermaidDiagram: "```mermaid\nerDiagram\n  departments ||--o{ users : \"所属\"\n  users ||--o{ projects : \"責任者\"\n  projects ||--o{ tasks : \"紐づく\"\n  users ||--o{ tasks : \"担当\"\n  equipments ||--o{ equipment_loans : \"貸出対象\"\n  users ||--o{ equipment_loans : \"申請者\"\n```",
    fileOrder: [
      "Spring Initializr（Maven / Java 21）で `teamops-hub` の雛形を `develop` に用意する",
      "`sql/schema.sql` に外部キー依存順（`departments` → `users` → `projects` → `tasks` → `equipments` → `equipment_loans`）でDDLを書く",
      "`sql/data.sql` に初期部署（開発部・営業部・総務部）、初期備品、サンプル案件・タスクを用意する",
      "3名全員がローカルPostgreSQL（`teamops_db`）で実行して同じテーブル状態にする",
    ],
    verifySteps: [
      "3名全員のpgAdmin 4で全6テーブルと外部キー・CHECK制約（`available_qty <= total_qty` 等）が作成されている",
      "全員のローカルで `application.properties`（`ddl-auto=validate`）がエラーなく起動する",
    ],
    commonPitfalls: [
      "メンバーごとに列名が微妙に違うとマージ後に起動エラーになります → 必ず `sql/schema.sql` をPRマージし、全員同じSQLを実行してください。",
    ],
    checklist: [
      "全6テーブルと制約・インデックスを `sql/schema.sql` に定義した",
      "初期マスタ・サンプルデータを `sql/data.sql` に用意した",
      "3名全員のローカルDB `teamops_db` に構築し整合を確認した",
      "`feature/team-step02-db-ddl` から `develop` 宛PRを作成した",
    ],
    explanation: "全員同じDBの土台ができました！次は共通のログイン認証とADMIN/USER権限の壁を作ります。",
    hints: ["担当別エラーメッセージの競合を防ぐため、`application.properties` に `spring.messages.basename=messages,messages-member,messages-project,messages-equipment` を設定しておきましょう。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441503",
    chapterId: TM_CH1,
    lessonId: TM_LS1,
    orderIndex: 3,
    stepNumber: 3,
    title: "Team Step 3：共通Entity（User / Department）＆ Spring Security URL認可マトリクス",
    difficulty: "medium",
    estimatedMinutes: 90,
    tags: ["Spring Security", "ロール認可", "ADMIN/USER"],
    recommendedBranch: "feature/team-step03-security-rules",
    designDocPath: TEAM_SPEC_PATH,
    designDocLabel: "TeamOps Hub 詳細設計書 v1.1.0（12_セキュリティ・07_クラス設計）",
    isTeamProject: true,
    repoName: "teamops-hub",
    goal: "全員が参照する `Role`・`Department`・`User` EntityとRepository、および `SecurityConfig` のURL認可マトリクス（ADMIN専用URLの403遮断）を実装します。",
    why: "URL認可ルールを最初に1か所（`SecurityConfig`）へ確定しておくと、メンバーA/B/Cが後から権限漏れを起こしにくくなります。",
    sheets: "詳細設計書 `12_セキュリティ §1`（URL認可マトリクス）・`07_クラス設計 §1`",
    fileOrder: [
      "`user/Role.java`（`ROLE_ADMIN`, `ROLE_USER`）、`user/Department.java`、`user/User.java`（有効フラグは `active`）を作成する",
      "`user/DepartmentRepository.java`、`user/UserRepository.java`（`findWithDepartmentByEmail`・`findAllByActiveTrueOrderByEmpCodeAsc`）を作成する",
      "`config/SecurityConfig.java` に具体的なADMIN専用URL（`/members/new`, `/members/*/edit`, `POST /members/**`, `POST /loans/*/approve|reject|return`）を先に書き、最後に `anyRequest().authenticated()` を配置する",
    ],
    starterSnippetTitle: "SecurityConfig の評価順序（具体的ルールを必ず先に書く！）",
    starterSnippetLang: "java",
    starterSnippet: `.requestMatchers("/login", "/error", "/css/**").permitAll()
.requestMatchers(HttpMethod.GET,  "/members/new", "/members/*/edit").hasRole("ADMIN")
.requestMatchers(HttpMethod.POST, "/members", "/members/**").hasRole("ADMIN")
.requestMatchers(HttpMethod.POST, "/loans/*/approve", "/loans/*/reject", "/loans/*/return").hasRole("ADMIN")
.anyRequest().authenticated()`,
    verifySteps: [
      "`ddl-auto=validate` で `Department` / `User` の起動整合が通る",
      "未ログインで `/dashboard` にアクセスすると `/login` へリダイレクトされる",
    ],
    commonPitfalls: [
      "`anyRequest().authenticated()` を先頭に書いてしまうと、その下の `.hasRole(\"ADMIN\")` が無視されて一般社員も管理操作できてしまいます！",
    ],
    checklist: [
      "`Role`・`Department`・`User` EntityとRepositoryを作成した",
      "`SecurityConfig` に設計書 `12_セキュリティ §1` 通りのURL認可マトリクスを実装した",
      "`ddl-auto=validate` でエラーなく起動確認できた",
      "`feature/team-step03-security-rules` から `develop` 宛PRを作成した",
    ],
    explanation: "URL単位の防御壁ができました。次はログイン画面・無効ユーザー拒否・403エラー保護を完成させます。",
    hints: ["`User.role` には必ず `@Enumerated(EnumType.STRING)` を付け、数値（ORDINAL）保存を禁止しましょう。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441504",
    chapterId: TM_CH1,
    lessonId: TM_LS1,
    orderIndex: 4,
    stepNumber: 4,
    title: "Team Step 4：ログイン画面（SCR-00）・LoginUser（無効拒否）・GlobalExceptionHandler（403保護）",
    difficulty: "medium",
    estimatedMinutes: 90,
    tags: ["ログイン認証", "GlobalExceptionHandler", "403保護"],
    recommendedBranch: "feature/team-step04-login-errors",
    designDocPath: TEAM_SPEC_PATH,
    designDocLabel: "TeamOps Hub 詳細設計書 v1.1.0（11_検証・エラー §5・12_セキュリティ）",
    isTeamProject: true,
    repoName: "teamops-hub",
    goal: "開発用3ユーザー（ADMIN 1名・USER 2名）でログインでき、無効ユーザーは拒否され、権限違反が正しく403（500に化けない）になる共通認証＆エラー基盤を完成させます。",
    why: "`GlobalExceptionHandler` で `AccessDeniedException` を再スローしないと、後半の `IT-001` や `UT-C15` で403のはずが500になる典型的な罠にはまります。",
    sheets: "詳細設計書 `11_検証・エラー §5`（設計判断 D-19）・`05_画面設計`（SCR-00）",
    fileOrder: [
      "`common/LoginUser.java`（`isEnabled()` が `user.isActive()` を返す）と `common/CustomUserDetailsService.java` を作成する",
      "`common/BusinessException.java`, `common/ResourceNotFoundException.java`, `common/GlobalExceptionHandler.java`（`AccessDeniedException` 再スロー必須！）を作成する",
      "`common/AuthController.java`, `templates/login.html`, `templates/error/{403,404,500}.html` を作成し、初期3ユーザーをBCrypt投入する",
    ],
    starterSnippetTitle: "GlobalExceptionHandler.java（403→500化け防止の必須コード）",
    starterSnippetLang: "java",
    starterSnippet: `@ExceptionHandler(AccessDeniedException.class)
public void handleAccessDenied(AccessDeniedException ex) {
    throw ex; // ★これを書かないと下の Exception.class に吸われて403が500になる！
}`,
    verifySteps: [
      "ADMIN / USER の3ユーザーでログインでき、ログイン失敗時は共通エラーメッセージが出る",
      "DBで `is_active = false` にしたユーザーはログインできない（`UT-X02`）",
      "USERで `/members/new` に直アクセスすると `templates/error/403.html` が表示される",
    ],
    commonPitfalls: [
      "USERで `/members/new` にアクセスしたとき 500 が出る場合は、`GlobalExceptionHandler` に `AccessDeniedException` 再スローがあるか確認してください。",
    ],
    checklist: [
      "`LoginUser` で無効ユーザー（`is_active=false`）のログインを拒否できる",
      "`GlobalExceptionHandler` で 404 / 500 を処理しつつ `AccessDeniedException` を再スローしている",
      "3ユーザーでのログイン・ログアウトとUSERの403画面を確認した",
      "`feature/team-step04-login-errors` から `develop` 宛PRを作成した",
    ],
    explanation: "これで認証・認可・例外ハンドリングの共通土台が盤石になりました！",
    hints: ["ログイン成功後は `/dashboard` へ遷移するよう `defaultSuccessUrl(\"/dashboard\", true)` に設定します。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441505",
    chapterId: TM_CH1,
    lessonId: TM_LS1,
    orderIndex: 5,
    stepNumber: 5,
    title: "Team Step 5：共通ナビ（layout.html）＆ モジュール間IF契約スタブ確定 → 全員develop同期",
    difficulty: "medium",
    estimatedMinutes: 90,
    tags: ["IF契約", "スタブ", "共通レイアウト", "並行開発準備"],
    recommendedBranch: "feature/team-step05-layout-stubs",
    designDocPath: TEAM_SPEC_PATH,
    designDocLabel: "TeamOps Hub 詳細設計書 v1.1.0（02_チーム分担・所有権・IF §3・§4）",
    isTeamProject: true,
    repoName: "teamops-hub",
    goal: "全10画面のリンク枠が入った `layout.html` と、AのダッシュボードがB・Cの完成を待たずに開発できる「IF契約スタブ」を `develop` に確定し、全員同期します。",
    why: "IF契約（メソッド名・引数・戻り値）とスタブを先にマージしておくことで、Step 6から3人が相手待ちゼロで同時並行開発できます！",
    sheets: "詳細設計書 `02_チーム分担・所有権・IF`（§3 IF契約 / §4 Step 2完了条件）",
    fileOrder: [
      "`templates/layout.html`（全5メニューリンク・氏名＋部署名・POSTログアウト・フラッシュ）と `static/css/common.css` を作成する",
      "メンバーB：`task/TaskService.java` に `countOpenByAssignee`（仮で `0L`）と `findUpcomingByAssignee`（仮で `List.of()`）のスタブを作成する",
      "メンバーC：`loan/LoanService.java` に `countByUserAndStatus`（仮で `0L`）のスタブを作成する",
      "`develop` へマージ後、3名全員が `git pull origin develop` してローカル起動確認する",
    ],
    verifySteps: [
      "3名全員のPCで最新の `develop` がエラーなく起動する",
      "ログイン後に共通ヘッダー（氏名・部署名・5つのナビリンク・ログアウト）が表示される",
    ],
    commonPitfalls: [
      "後から `layout.html` を各自バラバラに編集するとコンフリクトの温床になります → このStepで全リンク枠を確定しておきましょう。",
    ],
    checklist: [
      "`templates/layout.html` と `common.css` を作成し全ナビリンク枠を配置した",
      "`TaskService` / `LoanService` のIF契約スタブを確定して `develop` へマージした",
      "3名全員が最新の `develop` を `git pull` してローカル起動確認できた",
      "`feature/team-step05-layout-stubs` からPRを作成した",
    ],
    explanation: "共通基盤が完了しました！ここから第2章：3名それぞれの専有パッケージで並行開発スタートです！",
    hints: ["担当別メッセージファイル（`messages-member/project/equipment.properties`）も空ファイルで先に作っておくと競合しません。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441506",
    chapterId: TM_CH2,
    lessonId: TM_LS2,
    orderIndex: 1,
    stepNumber: 6,
    title: "Team Step 6：【担当画面①・土台】担当パッケージのEntity・Repository・Enum作成",
    difficulty: "medium",
    estimatedMinutes: 90,
    tags: ["並行開発", "Entity", "Repository", "Enum"],
    recommendedBranch: "feature/team-step06-domain-base",
    designDocPath: TEAM_SPEC_PATH,
    designDocLabel: "TeamOps Hub 詳細設計書 v1.1.0（07_クラス設計・08_DB設計）",
    isTeamProject: true,
    repoName: "teamops-hub",
    goal: "自分の担当パッケージ（A:`member`/`dashboard`、B:`project`/`task`、C:`equipment`/`loan`）に必要なEntity・Enum・Repositoryを作成し、`ddl-auto=validate` を通します。",
    why: "いきなりControllerやHTMLまで一気に書かず、まずは自分の担当テーブルとJavaのEntity/Repositoryを噛み合わせることでバグを最小化します。",
    sheets: "詳細設計書 `07_クラス設計`（§2〜§6）・`08_DB設計`",
    fileOrder: [
      "**メンバーA**：`member/MemberForm.java` と `UserRepository#search` / 重複確認メソッドを実装する",
      "**メンバーB**：`project/Project`, `ProjectStatus`, `ProjectRepository` と `task/Task`, `TaskStatus`, `TaskPriority`, `TaskRepository` を作成する",
      "**メンバーC**：`equipment/Equipment`, `EquipmentRepository`（`findByIdForUpdate`含む）と `loan/EquipmentLoan`, `LoanStatus`, `EquipmentLoanRepository`（`findByIdForUpdate`含む）を作成する",
      "ローカルで起動して `ddl-auto=validate` がエラーなく通ることを確認する",
    ],
    verifySteps: [
      "他担当のパッケージを一切変更せず、自分の担当領域だけで `ddl-auto=validate` が通る",
    ],
    commonPitfalls: [
      "列挙型（`ProjectStatus`, `TaskStatus`, `LoanStatus` 等）に `@Enumerated(EnumType.STRING)` を付け忘れると型不一致エラーになります。",
    ],
    checklist: [
      "自分の担当パッケージのEntity・Enum・Repositoryを作成した",
      "担当外ファイル（共通ファイルや他担当領域）を変更していない",
      "`ddl-auto=validate` でエラーなく起動確認できた",
      "`feature/team-step06-domain-base` から `develop` 宛PRを作成した",
    ],
    explanation: "担当データの土台ができました！次は1画面目を完成させて最初の相互PRレビューを体験します。",
    hints: ["毎朝必ず `git switch develop && git pull origin develop` してから新ブランチを切りましょう。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441507",
    chapterId: TM_CH2,
    lessonId: TM_LS2,
    orderIndex: 2,
    stepNumber: 7,
    title: "Team Step 7：【担当画面①・完成】1画面目の実装 ＆ 初回PR相互レビュー",
    difficulty: "medium",
    estimatedMinutes: 120,
    tags: ["担当画面①", "N+1回避", "PR相互レビュー"],
    recommendedBranch: "feature/team-step07-screen1",
    designDocPath: TEAM_SPEC_PATH,
    designDocLabel: "TeamOps Hub 詳細設計書 v1.1.0（05_画面設計・09_処理詳細）",
    isTeamProject: true,
    repoName: "teamops-hub",
    goal: "各担当の1画面目（A:社員一覧検索 `SCR-A2` / B:案件一覧・1クエリ進捗率 `SCR-B1` / C:備品一覧・在庫検索 `SCR-C1`）を実装し、チーム初のPR相互レビューを行います。",
    why: "まず1画面だけ小さくPRを出してレビューし合うことで、チーム全体のコード品質とレビューの流れが早めに安定します。",
    sheets: "詳細設計書 `05_画面設計`（A2/B1/C1）・`09_処理詳細` ＋ モックアップ該当シート",
    fileOrder: [
      "**メンバーA（SCR-A2 `/members`）**：部署×氏名のAND検索と、`sec:authorize=\"hasRole('ADMIN')\"` による操作ボタン出し分けを実装する",
      "**メンバーB（SCR-B1 `/projects`）**：`TaskRepository#countGroupByProject`（`GROUP BY` 1クエリ・N+1回避）で進捗率バーを実装する",
      "**メンバーC（SCR-C1 `/equipments`）**：カテゴリ×備品名検索と、`available_qty == 0` の「在庫切れ」表示＆申請ボタン無効化を実装する",
      "`develop` 宛にPRを作成し、他メンバー1名以上のレビュー＆Approveを受けてマージする",
    ],
    verifySteps: [
      "自分の1画面目がブラウザで正しく表示・検索できる",
      "他メンバーのPRを最低1件レビューし、コメント・Approveした",
    ],
    commonPitfalls: [
      "メンバーB：タスク0件の案件で `done * 100 / total` をそのまま計算するとゼロ除算エラーになります → `total == 0 ? 0 : ...` を必ず入れましょう。",
    ],
    checklist: [
      "自分の担当1画面目（A2 / B1 / C1）を仕様通り実装しローカル動作確認した",
      "PR本文に動作確認手順・スクショを記載して `develop` 宛PRを作成した",
      "他メンバーのPRを1件以上コードレビュー＆Approveした",
      "Approve後に `develop` へマージし、PR URLを提出した",
    ],
    explanation: "初回PRレビューお疲れさまでした！このリズム（小さく実装→PR→相互レビュー）で残りの画面も進めます。",
    hints: ["PRは400行以内を目安に小さく保つと、レビュアーも5〜10分で確認できて開発が止まりません。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441508",
    chapterId: TM_CH2,
    lessonId: TM_LS2,
    orderIndex: 3,
    stepNumber: 8,
    title: "Team Step 8：【担当画面②】2画面目（社員登録編集 / 案件詳細 / 貸出申請＆一覧）実装＆PR",
    difficulty: "hard",
    estimatedMinutes: 150,
    tags: ["担当画面②", "CRUD", "可視性制御"],
    recommendedBranch: "feature/team-step08-screen2",
    designDocPath: TEAM_SPEC_PATH,
    designDocLabel: "TeamOps Hub 詳細設計書 v1.1.0（05_画面設計・09_処理詳細・11_検証・エラー）",
    isTeamProject: true,
    repoName: "teamops-hub",
    goal: "各担当の2画面目（A:社員登録・編集 `SCR-A3` / B:案件詳細・タスク一覧 `SCR-B2` / C:貸出申請フォーム＆一覧 `SCR-C2`）を実装しPRレビューを受けます。",
    why: "入力検証やデータ可視性（C2：USERは自分のみ・ADMINは全件）など、業務アプリらしい実用ロジックが本格的に登場するステップです。",
    sheets: "詳細設計書 `05_画面設計`（A3/B2/C2）・`09_処理詳細`・`11_検証・エラー`",
    fileOrder: [
      "**メンバーA（SCR-A3 `/members/new`, `/{id}/edit`）**：社員番号・メール重複検証、新規パスワード必須／編集空欄なら変更なし（BCrypt）を実装する",
      "**メンバーB（SCR-B2 `/projects/{id}`）**：案件情報と期限昇順（NULL末尾）のタスク一覧を表示し、未存在IDで404を返す",
      "**メンバーC（SCR-C2 `GET/POST /loans`）**：申請フォーム（数量1以上・在庫以下・返却予定日今日以降）と可視性制御一覧（USER=自分のみ / ADMIN=全件）を実装する（申請時は在庫を減らさない！）",
    ],
    verifySteps: [
      "A：編集時にパスワード空欄で氏名だけ更新しても、元のパスワードでログインできる（`UT-A07`）",
      "B：`/projects/999999` で自作の404画面が出る（`UT-B03`）",
      "C：在庫超過数量で申請するとエラーになり登録されない（`IT-005`）。正常申請時は `PENDING` で在庫不変",
    ],
    commonPitfalls: [
      "メンバーC：貸出申請（`POST /loans`）の時点で在庫を減らしてしまうのは仕様違反です！在庫減算はStep 10の承認時のみ行います。",
    ],
    checklist: [
      "自分の担当2画面目（A3 / B2 / C2）とバリデーションを仕様通り実装した",
      "PRGパターンと担当別メッセージファイル（`messages-*.properties`）が正しく動く",
      "他メンバーのPRをレビューし、自PRもApproveを受けてマージした",
      "`feature/team-step08-screen2` のPR URLを提出した",
    ],
    explanation: "各担当2画面目が完成しました！次はいよいよ3画面目とチーム開発の核心ロジックに挑みます。",
    hints: ["C2で申請バリデーションエラー時に `loans/list` を再表示するとき、一覧データ（`loans`・`requestableEquipments`）の再セットを忘れないようにしましょう。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441509",
    chapterId: TM_CH2,
    lessonId: TM_LS2,
    orderIndex: 4,
    stepNumber: 9,
    title: "Team Step 9：【担当画面③・前半】3画面目の画面＆基本処理（無効化＆ダッシュボード / タスク登録編集 / 申請詳細403）",
    difficulty: "hard",
    estimatedMinutes: 150,
    tags: ["担当画面③", "データ認可403", "ダッシュボード"],
    recommendedBranch: "feature/team-step09-screen3-base",
    designDocPath: TEAM_SPEC_PATH,
    designDocLabel: "TeamOps Hub 詳細設計書 v1.1.0（05_画面設計・12_セキュリティ §2）",
    isTeamProject: true,
    repoName: "teamops-hub",
    goal: "各担当の3画面目の画面と基本処理（A:社員無効化＋ダッシュボードスタブ表示 / B:タスク登録・編集 / C:貸出詳細＋他人閲覧403認可）を実装します。",
    why: "複雑な状態遷移や排他ロックを載せる前に、まず3画面目の表示・データ単位認可（他人の貸出詳細を403で弾く等）を確実に仕上げます。",
    sheets: "詳細設計書 `05_画面設計`（A1/B3/C3）・`12_セキュリティ §2`（データ単位認可）",
    fileOrder: [
      "**メンバーA（A-04 & SCR-A1 `/dashboard`）**：社員無効化（自分自身は無効化不可）・有効化と、IF契約スタブ値を使った `DashboardController` / `DashboardService` / `dashboard.html` を実装する",
      "**メンバーB（SCR-B3 `/tasks/new`, `/{id}/edit`）**：有効ユーザーのみ出る担当者プルダウン（`findAllByActiveTrueOrderByEmpCodeAsc`）とタスク登録・編集を実装する",
      "**メンバーC（SCR-C3 `GET /loans/{id}`）**：`LoanService#findVisibleById` で「`!admin && !loan.user.id.equals(userId)` なら `AccessDeniedException`（403）」を実装し、`loans/detail.html` を作成する",
    ],
    verifySteps: [
      "A：管理者が自分自身を無効化するとエラーで拒否され、他社員は無効化できる（`UT-A08`）",
      "B：無効化した社員がタスク担当者プルダウンに出ない（`UT-B05`）",
      "C：USERが他人の `/loans/{id}` をURL直打ちすると **403画面**（500ではない）が表示される（`UT-C15`）",
    ],
    commonPitfalls: [
      "メンバーC：他人の貸出詳細で404を返すのではなく、設計書通り `AccessDeniedException`（403）を返すのがポイントです。",
    ],
    checklist: [
      "自分の担当3画面目の基本処理とHTML（A1 / B3 / C3）を実装した",
      "A:自己無効化拒否、B:有効ユーザー限定プルダウン、C:他人貸出詳細403 を確認した",
      "`develop` 宛PRを作成し、相互レビュー・Approveを得た",
      "`feature/team-step09-screen3-base` のPR URLを提出した",
    ],
    explanation: "全10画面の画面枠がすべて揃いました！次のStep 10で本システムの最難関コアロジックを仕上げます。",
    hints: ["Aのダッシュボードはこの段階ではB/Cのスタブ値（0件）で崩れず表示されれば合格です（Step 12で実データ接続）。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441510",
    chapterId: TM_CH2,
    lessonId: TM_LS2,
    orderIndex: 5,
    stepNumber: 10,
    title: "Team Step 10：【担当画面③・コア】状態遷移ガード・悲観的ロック承認/返却・IF契約本実装",
    difficulty: "hard",
    estimatedMinutes: 180,
    tags: ["状態遷移", "悲観的ロック", "排他制御", "IF契約本実装"],
    recommendedBranch: "feature/team-step10-core-logic",
    designDocPath: TEAM_SPEC_PATH,
    designDocLabel: "TeamOps Hub 詳細設計書 v1.1.0（10_状態遷移・排他）",
    isTeamProject: true,
    repoName: "teamops-hub",
    goal: "設計書 `10_状態遷移・排他` の核心ロジック（B:タスク状態遷移ガード＆IF本実装 / C:悲観的ロックによる承認・却下・返却＆IF本実装 / A:ダッシュボードUI仕上げ）を実装します。",
    why: "同時承認での在庫マイナスや二重返却を防ぐ「悲観的ロック（`FOR UPDATE`）＋ロック順序固定」は、実務バックエンド開発で最も差がつく重要スキルです。",
    sheets: "詳細設計書 `10_状態遷移・排他`（全員で必ず読み合わせてから実装！）",
    mermaidDiagram: "```mermaid\nsequenceDiagram\n  participant A1 as 管理者1\n  participant A2 as 管理者2(同時)\n  participant DB as PostgreSQL(FOR UPDATE)\n  A1->>DB: ①申請行ロック → ②備品行ロック → 在庫減算 → APPROVED → COMMIT\n  A2->>DB: ①申請行ロック(待機) → 解放後に最新取得(既にAPPROVED) → 状態エラーでロールバック\n```",
    fileOrder: [
      "**メンバーB**：`TaskStatus#canTransitionTo`（`TODO→IN_PROGRESS/DONE`, `IN_PROGRESS→DONE`, `DONE→不可`）と `POST /tasks/{id}/status`、さらに `countOpenByAssignee` / `findUpcomingByAssignee` の本実装を完了する",
      "**メンバーC**：`LoanService#approve` / `reject` / `returnLoan` を実装する（**全メソッドで「①申請行ロック → ②ステータス再確認 → ③備品行ロック → ④在庫再確認/更新」の順序を厳守**し、`BusinessException` はService内でcatchしない）＋ `countByUserAndStatus` 本実装",
      "**メンバーA**：ダッシュボードの期限間近タスク行クリック遷移や0件表示、社員一覧の細部仕上げを行う",
    ],
    verifySteps: [
      "B：`DONE` タスクへ `curl` で `status=TODO` をPOSTしても状態が変わらずエラーになる（`UT-B07`）",
      "C：在庫1の備品へPENDING 2件を連続承認すると、1件目成功(在庫0)・2件目は在庫不足エラーでPENDINGのまま（`UT-C17`）",
      "C：返却を2回送信しても在庫加算は1回のみ（`UT-C18`）",
    ],
    commonPitfalls: [
      "`BusinessException` を Service 内で `try-catch` してしまうとトランザクションがロールバックされなくなります → 必ず Controller で `catch` してください。",
    ],
    checklist: [
      "B：タスク状態遷移ガードとIF契約メソッドの本実装が完了した",
      "C：悲観的ロック（申請行→備品行の順）による承認・却下・返却とIF本実装が完了した",
      "A：ダッシュボードと社員管理の全UI・遷移が整った",
      "`feature/team-step10-core-logic` のPRを全員で重点レビューしマージした",
    ],
    explanation: "最難関のコアロジック実装おめでとうございます！次は担当別の単体テストで品質を固めます。",
    hints: ["Cの承認・返却PRは、メンバーA・Bも一緒に設計書 `10_状態遷移・排他` と突き合わせて全員レビューしましょう。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441511",
    chapterId: TM_CH2,
    lessonId: TM_LS2,
    orderIndex: 6,
    stepNumber: 11,
    title: "Team Step 11：担当別単体テスト（UT-A / UT-B / UT-C）全件実施＆レビュー改修",
    difficulty: "medium",
    estimatedMinutes: 120,
    tags: ["単体テスト", "UT", "品質保証"],
    recommendedBranch: "feature/team-step11-unit-tests",
    designDocPath: TEAM_SPEC_PATH,
    designDocLabel: "TeamOps Hub 詳細設計書 v1.1.0（13_テスト仕様：UT-X/A/B/C）",
    isTeamProject: true,
    repoName: "teamops-hub",
    goal: "詳細設計書 `13_テスト仕様` の自分の担当UTケース（A:`UT-A01〜08` / B:`UT-B01〜07` / C:`UT-C11〜19` ＋共通 `UT-X01〜03`）をすべて実施し、バグを潰します。",
    why: "統合前に各自の担当範囲を完璧にしておくことで、第3章の横断結合テストがスムーズに進みます。",
    sheets: "詳細設計書 `13_テスト仕様`（UT全ケース）",
    fileOrder: [
      "自分の担当UTケースをブラウザ・curl・PostgreSQLで1件ずつ実行する",
      "重要ロジック（進捗率計算、状態遷移、他人貸出403、在庫不足承認拒否等）のJUnit 5テストを作成する",
      "見つかった不具合を修正し、PR本文にUT結果一覧を貼って `develop` へマージする",
    ],
    verifySteps: [
      "`./mvnw test` が全件PASSする",
      "自分の担当UTケースがすべて「合格」になっている",
    ],
    commonPitfalls: [
      "画面からボタンを隠しただけで満足せず、`UT-B07` や `UT-C19` のように `curl` で直接POSTしたときもサーバー側が拒否することを必ず確認しましょう。",
    ],
    checklist: [
      "担当分のUTケース（UT-A / UT-B / UT-C）を全件実施し合格を確認した",
      "主要ロジックのJUnit 5単体テストを作成し `./mvnw test` がPASSした",
      "PR本文にテスト結果を記載し、レビュー後にマージした",
      "`feature/team-step11-unit-tests` のPR URLを提出した",
    ],
    explanation: "これで第2章（担当3画面の並行開発＋単体テスト）が完了です！いよいよ全10画面の横断結合へ進みます。",
    hints: ["異常系（0件・上限+1文字・権限外の直URLアクセス）を重点的に試すと実務力が上がります。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441512",
    chapterId: TM_CH3,
    lessonId: TM_LS3,
    orderIndex: 1,
    stepNumber: 12,
    title: "Team Step 12：IF契約の本接続（全10画面結合）＆ コンフリクト解消実践",
    difficulty: "hard",
    estimatedMinutes: 120,
    tags: ["統合", "コンフリクト解消", "IF契約"],
    recommendedBranch: "feature/team-step12-integration",
    designDocPath: TEAM_SPEC_PATH,
    designDocLabel: "TeamOps Hub 詳細設計書 v1.1.0（03_Git・PR運用 §7・02_チーム分担）",
    isTeamProject: true,
    repoName: "teamops-hub",
    goal: "3名全員の担当機能（全10画面）を `develop` 上で1つのアプリとして統合し、ダッシュボードの実データ連携とマージ時のコンフリクト解消を実践します。",
    why: "コンフリクトを自力で安全に解消してビルドを通せる経験は、現場配属後に即戦力として高く評価される必須スキルです。",
    sheets: "詳細設計書 `03_Git・PR運用 §7`（コンフリクト解消手順）",
    fileOrder: [
      "全員が `git fetch origin` → 自ブランチで `git merge origin/develop` を実行する",
      "コンフリクトが発生したファイルは `<<<<<<<` / `=======` / `>>>>>>>` を確認し、変更した相手と会話しながら両方の意図を残して解消する",
      "AのダッシュボードがBの未完了タスク数＆上位5件・Cの貸出中/申請中件数を実データで表示することを確認する（`IT-010`）",
      "全10画面のヘッダーリンクから相互遷移し、リンク切れ・404・崩れがないことを確認する（`IT-006`）",
    ],
    verifySteps: [
      "Cで新規申請→Aのダッシュボードの「申請中」が即時 +1、Bでタスク完了→「未完了」が即時 -1 になる",
      "全10画面のナビゲーションがエラーなく相互遷移できる",
    ],
    commonPitfalls: [
      "コンフリクト解消時に焦って「自分の変更だけ採用（Accept Current）」を押すと、相手の実装を消してしまいます → 必ず両方の変更内容を確認しましょう。",
    ],
    checklist: [
      "全10画面が `develop` に統合されエラーなく起動できる",
      "マージ時のコンフリクトを適切に解消できた",
      "ダッシュボードがB・Cの実データを正しく集計表示している（`IT-010`）",
      "全10画面の共通ナビ相互遷移（`IT-006`）を確認しPR URLを提出した",
    ],
    explanation: "3人のアプリが1つのシステムとして動き出しました！次はセキュリティと排他制御の徹底検証です。",
    hints: ["解消後は必ずEclipseでクリーンビルド＆起動して、他人の画面も開いて確認しましょう。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441513",
    chapterId: TM_CH3,
    lessonId: TM_LS3,
    orderIndex: 2,
    stepNumber: 13,
    title: "Team Step 13：ロール権限総当たり検証（IT-001/012）＆ 同時承認・在庫整合検証（IT-004/008/011）",
    difficulty: "hard",
    estimatedMinutes: 120,
    tags: ["セキュリティテスト", "排他制御検証", "在庫整合性"],
    recommendedBranch: "fix/team-step13-sec-concurrency",
    designDocPath: TEAM_SPEC_PATH,
    designDocLabel: "TeamOps Hub 詳細設計書 v1.1.0（12_セキュリティ §4・10_状態遷移・排他 §4）",
    isTeamProject: true,
    repoName: "teamops-hub",
    goal: "最も事故が起きやすい「ロール別権限（未ログイン/USER/ADMIN）」と「同時承認・返却の在庫整合性」を設計書の総当たり表と検証SQLで徹底検証します。",
    why: "権限漏れや在庫不整合は本番で最も重大な障害になります。ここで網羅チェックをやり切ることで実務品質を担保します。",
    sheets: "詳細設計書 `12_セキュリティ §4`（権限総当たり表）・`08_DB設計 §5`（在庫整合検証SQL）",
    fileOrder: [
      "未ログイン・USER・ADMINの3状態で `12_セキュリティ §4` の全行にアクセスし、期待ステータス（200/302/403）を検証する（`IT-012`）",
      "ADMINで2つのブラウザタブを開き、同じPENDING申請を続けて承認して片方成功・片方状態エラー・在庫減算1回のみを確認する（`IT-008`）",
      "pgAdmin 4 で在庫整合性検証SQL（`available_qty <> total_qty - SUM(APPROVED)`）を実行し **0行** であることを確認する（`IT-011`）",
      "見つかった不具合があれば `fix/` ブランチで修正してPRマージする",
    ],
    verifySteps: [
      "`IT-001`・`IT-012` の全行が仕様通り（特に他人の `/loans/{id}` が 403 で 500 にならない）",
      "`IT-004`・`IT-008` 実施後に在庫整合性検証SQLが **0行** である（`IT-011`）",
    ],
    commonPitfalls: [
      "検証時にブラウザのキャッシュや同一セッションが残っていると別ロールのテストが混ざります → シークレットウィンドウを活用しましょう。",
    ],
    checklist: [
      "権限総当たり表（`IT-001`, `IT-012`）を全行確認し合格した",
      "同時承認（`IT-008`）および承認→返却トランザクション（`IT-004`）を確認した",
      "在庫整合性検証SQL（`IT-011`）が 0 行であることを確認した",
      "検証・改修のPRを作成しPR URLを提出した",
    ],
    explanation: "セキュリティと在庫整合性の最難関関門を突破しました！",
    hints: ["不具合がゼロだった場合も、テスト証跡（実施ログ・SQL結果）をドキュメントへ記録してPRを出すと完璧です。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441514",
    chapterId: TM_CH3,
    lessonId: TM_LS3,
    orderIndex: 3,
    stepNumber: 14,
    title: "Team Step 14：横断結合テスト（IT-001〜IT-012）クロスチェック＆GitHub Issuesバグ改修",
    difficulty: "hard",
    estimatedMinutes: 120,
    tags: ["結合テスト", "クロスチェック", "GitHub Issues"],
    recommendedBranch: "fix/team-step14-it-fixes",
    designDocPath: TEAM_SPEC_PATH,
    designDocLabel: "TeamOps Hub 詳細設計書 v1.1.0（13_テスト仕様：IT-001〜IT-012）",
    isTeamProject: true,
    repoName: "teamops-hub",
    goal: "他メンバーが作った画面をクロスチェック（AがBを、BがCを、CがAをテスト）して `IT-001〜IT-012` を全件完了させ、不具合はGitHub Issues→`fix/`ブランチで改修します。",
    why: "自分で作った画面は思い込みで見落としがちです。他メンバーによるクロスチェックとIssue起票→PRクローズは現場の品質管理そのものです。",
    sheets: "詳細設計書 `13_テスト仕様`（`IT-001`〜`IT-012`）",
    fileOrder: [
      "クロスチェック担当を決め、`IT-002`（A→B連携）・`IT-003`（B進捗率）・`IT-005`（在庫超過）・`IT-009`（無効化影響）を含む全12件を実施する",
      "不具合を見つけたらGitHubの **Issues** タブに再現手順とスクショを起票する",
      "担当者が `fix/issue番号-内容` ブランチで修正→PRレビュー→マージしてIssueをクローズする",
      "`13_テスト仕様` の判定欄をすべて「合格」（合格率100%）にする",
    ],
    verifySteps: [
      "`IT-001〜IT-012` がすべて「合格」になり、未解決のバグIssueが 0 件である",
    ],
    commonPitfalls: [
      "`IT-009`（社員無効化）：担当者プルダウンからは消えますが、過去のタスク・貸出履歴の表示は消さずに残るのが正しい仕様です。",
    ],
    checklist: [
      "メンバー同士のクロスチェックで `IT-001〜IT-012` を全件実施した",
      "発見したバグをGitHub Issues起票→`fix/`ブランチPRで修正・クローズした",
      "詳細設計書 `13_テスト仕様` の合格率が 100% になった",
      "改修・確認完了のPR URLを提出した",
    ],
    explanation: "横断結合テスト全件合格おめでとうございます！いよいよ最終リリースと発表準備に入ります。",
    hints: ["PR本文に `Closes #Issue番号` と書くと、マージと同時に自動でIssueがクローズされて実務っぽくなります！"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441515",
    chapterId: TM_CH4,
    lessonId: TM_LS4,
    orderIndex: 1,
    stepNumber: 15,
    title: "Team Step 15：develop → main リリースPR作成 ＆ GitHub運用監査（IT-007）",
    difficulty: "medium",
    estimatedMinutes: 60,
    tags: ["リリースPR", "GitHub運用監査", "Merge commit"],
    recommendedBranch: "release/v1.0-teamops",
    designDocPath: TEAM_SPEC_PATH,
    designDocLabel: "TeamOps Hub 詳細設計書 v1.1.0（03_Git・PR運用・IT-007）",
    isTeamProject: true,
    repoName: "teamops-hub",
    goal: "テスト完了済みの `develop` から本番安定ブランチ `main` へリリースPRを作成し、3名全員のPR・レビュー・コミット履歴（`IT-007`）を確認します。",
    why: "実務では `develop` で統合テストを終えたあと、リリースPRを通じて `main` へ昇格させます。全員の開発貢献が履歴に残っているかも重要な評価基準です。",
    sheets: "詳細設計書 `03_Git・PR運用 §4・§6`（`IT-007` 対策）",
    fileOrder: [
      "`develop` の最新状態で `./mvnw test` と全10画面の最終スモークテストを実施する",
      "GitHub上で `base: main` ← `compare: develop` のリリースPRを作成する",
      "GitHubの `Pull Requests` タブおよび `Insights → Contributors` を開き、3名全員のPR・相互レビューコメント・コミット履歴が残っていることを確認する（`IT-007`）",
      "全員の最終確認後、**Merge commit**（全員のコミット履歴を残す方式）で `main` へマージする",
    ],
    verifySteps: [
      "`Insights → Contributors` にチーム3名全員の名前とコミットが表示されている",
      "`main` ブランチに全10画面の最新コードが反映されている",
    ],
    commonPitfalls: [
      "`develop → main` を Squash merge すると全員分のコミットが1つに潰れてしまいます → ここは必ず **Create a merge commit** を使いましょう。",
    ],
    checklist: [
      "`develop` 上で全自動テストと全10画面の動作を確認した",
      "`develop` → `main` のリリースPRを作成し全員で確認した",
      "`IT-007`（3名全員のPR・相互レビュー・コミット履歴）を確認した",
      "リリースPRのURLを提出した",
    ],
    explanation: "安定した `main` ブランチへのリリースが完了しました！残すは最終Step 16のREADME整備とデモ発表提出のみです。",
    hints: ["タグ `v1.0.0` を `main` に打っておくと、実務のリリース管理まで体験できます。"],
  }),
  buildGuidedProblem({
    id: "44444444-4444-4444-8444-444444441516",
    chapterId: TM_CH4,
    lessonId: TM_LS4,
    orderIndex: 2,
    stepNumber: 16,
    title: "Team Step 16：README.md整備・新規クローン起動確認・デモ発表 ＆ 最終PR URL提出",
    difficulty: "medium",
    estimatedMinutes: 90,
    tags: ["README", "デモ発表", "最終提出", "1年集大成"],
    recommendedBranch: "release/v1.0-final",
    designDocPath: TEAM_SPEC_PATH,
    designDocLabel: "TeamOps Hub 開発者向け詳細設計書 v1.1.0（全16シート）",
    isTeamProject: true,
    repoName: "teamops-hub",
    goal: "3名の担当一覧・環境構築手順・テストアカウント・工夫した点をまとめた `README.md` を仕上げ、新規クローン起動とデモシナリオを確認して最終PR URLを提出します。",
    why: "1年間カリキュラムの集大成として、「他人が動かせて、3人のチーム開発ストーリーが伝わるリポジトリ」を完成させます。",
    sheets: "詳細設計書 `00_表紙`〜`15_設計判断ログ`（全体振り返り）",
    fileOrder: [
      "`README.md` に ①システム概要と3名の担当画面一覧 ②PostgreSQL `teamops_db` 構築＆起動手順 ③ADMIN/USERテストアカウント ④工夫した点・コンフリクト解消や排他制御の学び を記載する",
      "`main` ブランチをPCの別フォルダへ新規 `git clone` し、README手順だけで起動・全10画面操作ができるか確認する",
      "デモ発表用の画面遷移シナリオ（ログイン→ダッシュボード→社員登録→タスク割当→進捗反映→備品申請→承認→返却）を3名でリハーサルする",
      "最終リリースPRの **GitHub Pull Request URL（`/pull/番号`）** を提出する",
    ],
    verifySteps: [
      "新規 `git clone` 環境でエラーなく起動し、全10画面がスムーズに動く",
      "デモ発表シナリオを5〜10分で澱みなく実演できる",
    ],
    commonPitfalls: [
      "デモ直前にDBデータが中途半端な状態になっていないか、`sql/data.sql` で初期状態へ戻せることを確認しておきましょう。",
    ],
    checklist: [
      "`README.md` に3名担当一覧・起動手順・テストアカウント・工夫点を記載した",
      "`main` を別フォルダへ新規 `git clone` してエラーなく起動・全10画面確認できた",
      "デモ発表シナリオを3名で確認した",
      "最終リリース用のGitHub Pull Request URLを提出した",
    ],
    explanation: "1年間カリキュラム全工程（全11コース）完遂、本当におめでとうございます！設計書読解・実装・テスト・排他制御・Gitチーム開発までやり切った実績は、現場配属後も確かな武器になります。",
    hints: ["提出URLは最終リリース用PRのURL（例：`https://github.com/team-xxx/teamops-hub/pull/16`）を入力してください。"],
  }),
];
