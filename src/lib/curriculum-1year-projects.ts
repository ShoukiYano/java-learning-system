import type { SeedChapter, SeedProblem } from "@/lib/seed-data";
import type { ProjectStepSpec } from "@/lib/curriculum-evaluators";

export const SEED_SPRINGBOOT_PROJECT_COURSE_ID = "11111111-1111-4111-8111-111111111114";
export const SEED_TEAM_PROJECT_COURSE_ID = "11111111-1111-4111-8111-111111111115";

const PRODUCT_SPEC_PATH = "/docs/product-management-design-spec.xlsx";
const TEAM_SPEC_PATH = "/docs/team-project-design-spec.xlsx";

function projStarter(spec: ProjectStepSpec): string {
  return JSON.stringify(spec);
}

function projSolution(spec: ProjectStepSpec, repoName: string): string {
  return JSON.stringify({
    githubUrl: `https://github.com/sample-student/${repoName}/pull/${spec.stepNumber}`,
    checkedItems: spec.checklist.map((_, i) => i),
    summaryNote: "推奨ブランチで実装・動作確認を完了し、Pull Requestを作成しました。",
  });
}

// =============================================================================
// 1. Spring Boot＋SQL 個人開発：商品管理システム構築（2か月・6ステップ）
// =============================================================================
export const SPRINGBOOT_PROJECT_CHAPTERS: SeedChapter[] = [
  {
    id: "22222222-2222-4222-8222-222222221401",
    course_id: SEED_SPRINGBOOT_PROJECT_COURSE_ID,
    title: "第1章（1〜2週目）：開発環境構築（Eclipse・Spring Boot・PostgreSQL・GitHub）",
    description: "はじめての方でも迷わず進められるよう、IDE・DB・GitHubの導入から疎通確認までをステップバイステップで進めます。",
    order_index: 1,
    lesson_id: "33333333-3333-4333-8333-333333331401",
    lesson_title: "Eclipse / PostgreSQL / Spring Boot 導入と接続確認",
  },
  {
    id: "22222222-2222-4222-8222-222222221402",
    course_id: SEED_SPRINGBOOT_PROJECT_COURSE_ID,
    title: "第2章（3〜5週目）：Excel詳細設計書の読み解き＆商品CRUD実装",
    description: "配布のExcel詳細設計書を見ながら、DB構築・商品一覧・検索・詳細・新規登録・編集・論理削除・バリデーションを実装します。",
    order_index: 2,
    lesson_id: "33333333-3333-4333-8333-333333331402",
    lesson_title: "詳細設計書ベースでの商品管理CRUD構築",
  },
  {
    id: "22222222-2222-4222-8222-222222221403",
    course_id: SEED_SPRINGBOOT_PROJECT_COURSE_ID,
    title: "第3章（6〜8週目）：ログイン認証・単体/結合テスト＆GitHub最終提出",
    description: "Spring Securityによるログイン認証とテスト仕様書に基づく全項目検証を行い、GitHub URLで最終提出します。",
    order_index: 3,
    lesson_id: "33333333-3333-4333-8333-333333331403",
    lesson_title: "認証機能・品質検証・GitHub最終提出",
  },
];

const SB_STEP1: ProjectStepSpec = {
  stepNumber: 1,
  recommendedBranch: "feature/step1-setup",
  designDocPath: PRODUCT_SPEC_PATH,
  designDocLabel: "商品管理システム 開発者向け詳細設計書 v1.1.0（Excel・全12シート）",
  checklist: [
    "Eclipse（Pleiades All in One / Java 21）をインストールし、ワークスペース文字コードをUTF-8に設定した",
    "PostgreSQL 16をインストールし、pgAdmin 4 または psql でデータベース `product_mgmt_db` を作成した",
    "GitHubリポジトリ（例：product-manager）の `main` に初回READMEを作成後、`feature/step1-setup` ブランチを切って `.gitignore` 等を追加し **Pull Request** を作成した",
    "配布のExcel詳細設計書 v1.1.0（全12シート）をダウンロードし、00_表紙〜02_機能要件に目を通した",
  ],
};

const SB_STEP2: ProjectStepSpec = {
  stepNumber: 2,
  recommendedBranch: "feature/step2-spring-db",
  designDocPath: PRODUCT_SPEC_PATH,
  designDocLabel: "商品管理システム 開発者向け詳細設計書 v1.1.0（Excel・全12シート）",
  checklist: [
    "Spring Initializr（Maven / Java 21）で依存関係（Web / JPA / Thymeleaf / Validation / PostgreSQL Driver）入りプロジェクトを作成した",
    "`application.properties` にPostgreSQL接続情報（URL・ユーザー名・パスワード）を設定した",
    "EclipseからSpring Bootを起動し、コンソールエラーなく `http://localhost:8080` に接続できた",
    "`feature/step2-spring-db` ブランチをPushして **Pull Request** を作成した",
  ],
};

const SB_STEP3: ProjectStepSpec = {
  stepNumber: 3,
  recommendedBranch: "feature/step3-db-entity",
  designDocPath: PRODUCT_SPEC_PATH,
  designDocLabel: "商品管理システム 詳細設計書 v1.1.0（06_DB設計）",
  checklist: [
    "詳細設計書 06_DB設計 のテーブル定義から `users`・`categories`・`products` の3テーブルを作成し、`ddl-auto=validate` で起動整合を確認した",
    "初期データ（カテゴリ3件以上、サンプル商品5件以上）をINSERTした",
    "Entityクラス（`User`, `Category`, `Product`）とRepositoryインターフェースを作成した",
    "`feature/step3-db-entity` ブランチでDDL・Entity・RepositoryをPushし **Pull Request** を作成した",
  ],
};

const SB_STEP4: ProjectStepSpec = {
  stepNumber: 4,
  recommendedBranch: "feature/step4-product-list",
  designDocPath: PRODUCT_SPEC_PATH,
  designDocLabel: "商品管理システム 詳細設計書 v1.1.0（03_画面設計・04_URL・05_クラス設計）",
  checklist: [
    "`GET /products` で論理削除されていない商品一覧（カテゴリ名付き）が表示される",
    "在庫数が10未満の商品に赤色の警告バッジが表示される",
    "商品名（部分一致）とカテゴリ選択による複合検索が動作し、検索条件が画面に保持される",
    "`feature/step4-product-list` ブランチで商品一覧・検索・詳細をPushし **Pull Request** を作成した",
  ],
};

const SB_STEP5: ProjectStepSpec = {
  stepNumber: 5,
  recommendedBranch: "feature/step5-product-crud",
  designDocPath: PRODUCT_SPEC_PATH,
  designDocLabel: "商品管理システム 詳細設計書 v1.1.0（07_処理詳細・08_検証・エラー）",
  checklist: [
    "商品新規登録（`GET /products/new` → `POST /products`）がPRGパターンで動作しフラッシュメッセージが出る",
    "08_検証・エラー の入力バリデーション（必須・SKU形式・単価0〜1000万・在庫0〜999,999・SKU重複チェック）がすべて動作する",
    "商品編集（`GET /products/{id}/edit` → `POST /products/{id}`）と論理削除（`is_deleted = true`）が動作する",
    "`feature/step5-product-crud` ブランチをPushし **Pull Request** を作成した",
  ],
};

const SB_STEP6: ProjectStepSpec = {
  stepNumber: 6,
  recommendedBranch: "feature/step6-security-final",
  designDocPath: PRODUCT_SPEC_PATH,
  designDocLabel: "商品管理システム 詳細設計書 v1.1.0（10_テスト仕様：TC-001〜TC-022）",
  checklist: [
    "Spring Securityによるログイン・ログアウト（BCrypt暗号化・未ログイン時 `/login` リダイレクト）を実装した",
    "詳細設計書 10_テスト仕様 の単体・結合テスト（TC-001〜TC-022）をすべて実施し合格を確認した",
    "`README.md` にDB作成手順・起動方法・テスト用ログインID/パスワードを記載した",
    "`feature/step6-security-final` ブランチから最終 **Pull Request** を作成し、PR URLを提出した",
  ],
};

export const SPRINGBOOT_PROJECT_PROBLEMS: SeedProblem[] = [
  {
    id: "44444444-4444-4444-8444-444444441401",
    lesson_id: "33333333-3333-4333-8333-333333331401",
    chapter_id: "22222222-2222-4222-8222-222222221401",
    language: "project",
    title: "Step 1：開発環境構築（Eclipse・PostgreSQL・GitHub）＆詳細設計書ダウンロード",
    description_md: `## はじめてのSpring Boot開発：全体構成をつかもう

ここから2か月かけて、実務と同じ **Excel詳細設計書** を読み解きながら **「商品管理システム」** を自分の手でゼロから構築します。

\`\`\`mermaid
flowchart LR
    Dev["Eclipse（Java 21）<br/>コード作成・起動"] --> App["Spring Boot 3<br/>Controller / Service / JPA"]
    App <--> DB[("PostgreSQL 16<br/>product_mgmt_db")]
    App --> View["Thymeleaf HTML/CSS<br/>ブラウザ画面"]
    Dev -->|git push| GH["GitHub リポジトリ<br/>（課題の提出先）"]
\`\`\`

### 1. ツールの導入手順
1. **Eclipse（Pleiades All in One Java Full Edition）**：公式サイトからダウンロードし、フォルダ解凍後に起動。メニュー「ウィンドウ → 設定 → 一般 → ワークスペース」でテキストファイル・エンコードを **UTF-8** に設定します。
2. **PostgreSQL 16**：インストーラーを実行（ポート \`5432\`、スーパーユーザー \`postgres\` のパスワードを控えておく）。付属の **pgAdmin 4** を開き、データベース \`product_mgmt_db\` を作成します。
3. **GitHub**：個人開発用のリポジトリ（例：\`product-manager\`）を作成し、ローカルPCに \`git clone\` しておきます。

### 2. ブランチ分割＆Pull Request URL提出ルール（講師レビューを確実にする進め方）
このコースでは \`main\` ブランチへ直接上書きPushせず、**各Stepごとにブランチを切って Pull Request（PR）URL を提出** します。これにより、講師がレビューする前に次のStepを進めていても、各Stepの差分（Files changed）を正確にレビューできます。

\`\`\`mermaid
gitGraph
    commit id: "main初回: README.md"
    branch feature/step1-setup
    checkout feature/step1-setup
    commit id: "Step1: .gitignore等 → PR#1提出"
    branch feature/step2-spring-db
    checkout feature/step2-spring-db
    commit id: "Step2: Spring Boot作成 → PR#2提出"
    checkout main
    merge feature/step1-setup id: "レビューOK後マージ"
\`\`\`

- **初回準備**：GitHubでリポジトリ作成時に「Add a README file」にチェックを入れて \`main\` の初期コミットを作る
- **各Stepの提出**：\`git switch -c feature/step1-setup\` のようにブランチを切り、Commit → Push → GitHubで **Pull Request作成** → \`https://github.com/ユーザー名/リポジトリ名/pull/1\` を提出する
- **レビュー待ちで先へ進むとき**：前のStepブランチから次のブランチ（例：\`git switch -c feature/step2-spring-db\`）を切れば、レビューを待たずに開発を継続できます

### 3. Excel詳細設計書をダウンロードしよう
右側の **「詳細設計書（Excel）ダウンロード」** ボタンから \`product-management-design-spec.xlsx\` を保存し、ExcelまたはGoogleスプレッドシートで開いて **00_表紙・読み方 / 01_システム概要・環境 / 02_機能要件** を確認してください。`,
    difficulty: "easy",
    estimated_minutes: 90,
    tags: ["Spring Boot", "Eclipse", "PostgreSQL", "GitHub", "環境構築"],
    starter_code: projStarter(SB_STEP1),
    solution_code: projSolution(SB_STEP1, "product-manager"),
    explanation_md: "環境構築はエンジニア実務の第一歩です。つまずいた場合はエラー画面のスクリーンショットを撮って講師質問チャットで相談しましょう。",
    order_index: 1,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "WindowsではEclipseの展開先を `C:\\pleiades` のように短い英数字パスにすると、パス長エラーを防げます。" },
      { step_number: 2, content_md: "GitHubリポジトリは講師がコードレビューできるよう **Public**（または講師をCollaborator招待）にしておきましょう。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441402",
    lesson_id: "33333333-3333-4333-8333-333333331401",
    chapter_id: "22222222-2222-4222-8222-222222221401",
    language: "project",
    title: "Step 2：Spring Bootプロジェクト作成とPostgreSQL接続確認",
    description_md: `## Spring BootとPostgreSQLを繋ぐ

### 1. Spring InitializrでMavenプロジェクト雛形を作成
Eclipseの「新規 → Spring スターター・プロジェクト」（または [start.spring.io](https://start.spring.io/)）で以下を選択します。
- **Type（ビルドツール）**: **Maven**（実務で最もよく使われる \`pom.xml\` 管理方式）
- **Language**: Java / **Java**: 21 / **Packaging**: Jar
- **Dependencies（依存関係）**:
  - \`Spring Web\`
  - \`Thymeleaf\`
  - \`Spring Data JPA\`
  - \`Validation\`
  - \`PostgreSQL Driver\`
  - \`Spring Boot DevTools\`

> **Maven（\`pom.xml\`）の基本操作**
> - ライブラリを追加・変更したときは、Eclipseでプロジェクトを右クリック → **「Maven → プロジェクトの更新（Alt + F5）」** を実行します。
> - ターミナルから起動・ビルドするときは \`./mvnw spring-boot:run\`（Windowsは \`mvnw.cmd spring-boot:run\`）や \`mvn clean package\` を使用します。

### 2. \`src/main/resources/application.properties\` の設定例
\`\`\`properties
spring.datasource.url=jdbc:postgresql://localhost:5432/product_mgmt_db
spring.datasource.username=postgres
spring.datasource.password=あなたのパスワード
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
\`\`\`

※パスワードをGitHubに公開したくない場合は \`\${DB_PASSWORD:postgres}\` のように環境変数化すると実務レベルです！`,
    difficulty: "easy",
    estimated_minutes: 90,
    tags: ["Spring Boot", "PostgreSQL", "application.properties"],
    starter_code: projStarter(SB_STEP2),
    solution_code: projSolution(SB_STEP2, "product-manager"),
    explanation_md: "`Started Application in X.XXX seconds` とコンソールに出ればSpring BootとPostgreSQLの疎通は成功です。",
    order_index: 2,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "`Connection refused` が出る場合はPostgreSQLサービスが起動しているか、ポート5432が合っているか確認しましょう。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441403",
    lesson_id: "33333333-3333-4333-8333-333333331402",
    chapter_id: "22222222-2222-4222-8222-222222221402",
    language: "project",
    title: "Step 3：詳細設計書（06_DB設計）からDB構築・Entity・Repository実装",
    description_md: `## データベース構造（ER図）とJPAマッピング

Excel詳細設計書の **06_DB設計（テーブル定義・制約・初期データ）** を開いて、3つのテーブルの関係を確認しましょう。

\`\`\`mermaid
erDiagram
    categories ||--o{ products : "1対多 (category_id)"
    categories {
        bigint id PK
        varchar name UK
        int sort_order
    }
    products {
        bigint id PK
        varchar sku UK
        varchar name
        bigint category_id FK
        int price
        int stock
        text description
        boolean is_deleted
    }
    users {
        bigint id PK
        varchar email UK
        varchar password_hash
        varchar full_name
        varchar role
    }
\`\`\`

### 作業内容
1. 06_DB設計 のテーブル定義をもとに \`CREATE TABLE\` 文を作成（参考DDL骨格で答え合わせ可）して pgAdmin 4 で実行し、\`ddl-auto=validate\` で整合確認する
2. カテゴリ3件以上・商品5件以上のテストデータを \`INSERT\` する
3. \`entity\` パッケージに \`Category\`, \`Product\`, \`User\` を、\`repository\` パッケージに各 \`JpaRepository\` を実装する`,
    difficulty: "medium",
    estimated_minutes: 120,
    tags: ["PostgreSQL", "DDL", "JPA", "Entity"],
    starter_code: projStarter(SB_STEP3),
    solution_code: projSolution(SB_STEP3, "product-manager"),
    explanation_md: "06_DB設計 のカラム名・型・NOT NULL制約とEntityのフィールド（論理削除は `deleted`・D-05）を一致させ、`ddl-auto=validate` を通すのがポイントです。",
    order_index: 3,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "`Product` から `Category` への外部キーは `@ManyToOne @JoinColumn(name = \"category_id\")` で関連付けます。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441404",
    lesson_id: "33333333-3333-4333-8333-333333331402",
    chapter_id: "22222222-2222-4222-8222-222222221402",
    language: "project",
    title: "Step 4：商品一覧・複合検索・詳細表示（MVCアーキテクチャ実装）",
    description_md: `## Spring BootのMVC処理フロー

Excel詳細設計書の **03_画面設計・04_URL・IF設計・05_クラス設計** に従って一覧・検索・詳細機能を実装します。

\`\`\`mermaid
sequenceDiagram
    participant Browser as ブラウザ
    participant Ctrl as ProductController
    participant Svc as ProductService
    participant Repo as ProductRepository
    participant DB as PostgreSQL

    Browser->>Ctrl: GET /products?keyword=PC&categoryId=1
    Ctrl->>Svc: search(keyword, categoryId)
    Svc->>Repo: findActiveByCondition(...)
    Repo->>DB: SELECT ... WHERE is_deleted = false ...
    DB-->>Repo: 商品リスト
    Repo-->>Svc: List<Product>
    Svc-->>Ctrl: List<Product>
    Ctrl-->>Browser: templates/products/list.html
\`\`\`

### 実装ポイント
- \`is_deleted = false\` の商品だけを取得する
- 在庫数（\`stock\`）が \`10\` 未満の行に \`th:if="\${p.stock < 10}"\` で警告バッジを出す
- 商品名クリックで \`/products/{id}\` の詳細画面へ遷移できるようにする`,
    difficulty: "medium",
    estimated_minutes: 180,
    tags: ["Spring Boot", "Thymeleaf", "一覧・検索"],
    starter_code: projStarter(SB_STEP4),
    solution_code: projSolution(SB_STEP4, "product-manager"),
    explanation_md: "Controllerはリクエスト受付と画面返却だけを担当し、検索条件の組み立てや業務ルールはService層へ分離しましょう。",
    order_index: 4,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "検索フォームの入力値保持は `model.addAttribute(\"keyword\", keyword)` でHTMLの `th:value` へ渡します。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441405",
    lesson_id: "33333333-3333-4333-8333-333333331402",
    chapter_id: "22222222-2222-4222-8222-222222221402",
    language: "project",
    title: "Step 5：商品新規登録・編集・論理削除＆バリデーション実装",
    description_md: `## 二重送信を防ぐPRGパターンと入力チェック

Excel詳細設計書の **07_処理詳細・08_検証・エラー** の全ルール（新規=\`existsBySku\` / 編集=\`existsBySkuAndIdNot\` 等）を \`ProductForm\` と \`ProductService\` に実装しましょう。

\`\`\`mermaid
flowchart LR
    Form["登録・編集画面<br/>form.html"] -->|POST /products| Val{"@Valid 検証 &<br/>SKU重複チェック"}
    Val -->|エラーあり| Back["form.htmlを再表示<br/>入力値保持＋赤字エラー"]
    Val -->|OK| Save["ServiceでDB保存<br/>@Transactional"]
    Save -->|Redirect 302| List["GET /products<br/>完了フラッシュ表示"]
\`\`\`

### 実装ポイント
- **PRG（Post-Redirect-Get）パターン**：登録・更新・削除のPOST後は必ず \`return "redirect:/products";\` を使い、ブラウザのリロードによる二重登録を防止します。
- **論理削除**：\`DELETE FROM\` は使わず、\`product.setDeleted(true)\` に更新してデータを保全します。`,
    difficulty: "hard",
    estimated_minutes: 240,
    tags: ["Spring Boot", "CRUD", "Validation", "論理削除"],
    starter_code: projStarter(SB_STEP5),
    solution_code: projSolution(SB_STEP5, "product-manager"),
    explanation_md: "Bean Validation（`@NotBlank`, `@Min`, `@Pattern`）＋業務バリデーション（SKU重複チェック）の組み合わせは実務の必須スキルです。",
    order_index: 5,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "フラッシュメッセージは Controller 引数に `RedirectAttributes ra` を受け取り `ra.addFlashAttribute(\"message\", \"登録しました\")` を使います。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441406",
    lesson_id: "33333333-3333-4333-8333-333333331403",
    chapter_id: "22222222-2222-4222-8222-222222221403",
    language: "project",
    title: "Step 6：ログイン認証・テスト仕様書（10_テスト仕様）全件確認＆GitHub最終PR提出",
    description_md: `## ログイン認証の組み込みと最終品質チェック

1. **Spring Security の導入**：
   - \`pom.xml\` に \`spring-boot-starter-security\` を追加
   - \`SecurityConfig\` で \`/login\`・静的CSS以外の全URLを認証必須に設定
   - \`BCryptPasswordEncoder\` でパスワードを安全に照合
2. **テスト仕様書（10_テスト仕様）の実施**：
   - \`TC-001\`〜\`TC-022\`（基本12件＋推奨境界/セキュリティ10件）をブラウザとPostgreSQLで確認し、Excelの判定欄をすべて「合格」にする
3. **README.md の整備＆最終Push**：
   - 別のエンジニアが \`git clone\` して動かせるよう、DB作成SQL・起動コマンド・テストアカウント情報を \`README.md\` に記載
   - 最終ステップの **GitHub Pull Request URL（\`/pull/番号\`）** を下のフォームから提出してください！`,
    difficulty: "hard",
    estimated_minutes: 180,
    tags: ["Spring Security", "テスト", "GitHub提出"],
    starter_code: projStarter(SB_STEP6),
    solution_code: projSolution(SB_STEP6, "product-manager"),
    explanation_md: "商品管理システムの完遂おめでとうございます！この開発経験と設計書読解力を武器に、いよいよ最終段階の「3人1組チーム開発」へ挑戦しましょう。",
    order_index: 6,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "テスト用ユーザーのBCryptハッシュは、Spring Boot起動時に `CommandLineRunner` で `passwordEncoder.encode(...)` して初期投入すると確実です。" },
    ],
  },
];

// =============================================================================
// 2. チーム開発実践（3人1組）：ログイン機能付き総合業務Webシステム（3か月・6ステップ）
// =============================================================================
export const TEAM_PROJECT_CHAPTERS: SeedChapter[] = [
  {
    id: "22222222-2222-4222-8222-222222221501",
    course_id: SEED_TEAM_PROJECT_COURSE_ID,
    title: "第1章（1か月目）：チーム開発の流れ・役割分担（1人3画面）＆共通基盤構築",
    description: "3人1組での役割分担・Gitブランチ運用ルール策定・共通ログイン＆6テーブルDBの土台を全員で構築します。",
    order_index: 1,
    lesson_id: "33333333-3333-4333-8333-333333331501",
    lesson_title: "チーム体制構築・Gitフロー・共通認証基盤",
  },
  {
    id: "22222222-2222-4222-8222-222222221502",
    course_id: SEED_TEAM_PROJECT_COURSE_ID,
    title: "第2章（2か月目）：担当3ページの並行開発・Pull Requestレビュー＆コンフリクト解消",
    description: "各自のfeatureブランチで担当3ページを実装し、GitHub Pull Requestによる相互コードレビューと競合解消を実践します。",
    order_index: 2,
    lesson_id: "33333333-3333-4333-8333-333333331502",
    lesson_title: "ブランチ並行開発・PRレビュー・画面結合",
  },
  {
    id: "22222222-2222-4222-8222-222222221503",
    course_id: SEED_TEAM_PROJECT_COURSE_ID,
    title: "第3章（3か月目）：横断結合テスト・バグ改修・成果発表＆GitHub最終提出",
    description: "3名の機能を統合した全10画面の横断結合テストを実施し、実務品質のチームリポジトリをGitHub URLで提出します。",
    order_index: 3,
    lesson_id: "33333333-3333-4333-8333-333333331503",
    lesson_title: "結合テスト・品質仕上げ・最終発表提出",
  },
];

const TEAM_STEP1: ProjectStepSpec = {
  stepNumber: 1,
  recommendedBranch: "feature/team-step1-rules",
  designDocPath: TEAM_SPEC_PATH,
  designDocLabel: "TeamOps Hub 開発者向け詳細設計書 v1.1.0（Excel・全13シート）",
  isTeamProject: true,
  checklist: [
    "チーム3名の役割分担（メンバーA：社員・ダッシュボード3画面 / メンバーB：案件・タスク3画面 / メンバーC：備品貸出3画面）を決定した",
    "チーム共有GitHubリポジトリを作成し、3名全員をCollaboratorに登録した",
    "`main` ブランチから `develop` ブランチを作成し、03_Git・PR運用 のルール（直接Push禁止・PRレビュー必須）を合意し、役割分担表のPRを作成した",
    "Excel詳細設計書 v1.1.0（全13シート）を3名全員で読み込み、02_チーム分担・所有権・IF で担当画面とファイル所有権・IF契約を確認した",
  ],
};

const TEAM_STEP2: ProjectStepSpec = {
  stepNumber: 2,
  recommendedBranch: "feature/team-step2-common-base",
  designDocPath: TEAM_SPEC_PATH,
  designDocLabel: "TeamOps Hub 詳細設計書 v1.1.0（05_画面設計・08_DB設計）",
  isTeamProject: true,
  checklist: [
    "08_DB設計 のテーブル定義から共通6テーブルを全員のローカルPostgreSQL（`teamops_db`）へ構築し、`ddl-auto=validate` を通して `develop` へPRマージした",
    "共通ログイン機能（SCR-00 `/login`・Spring Security・ADMIN/USERロール制御）が動作する",
    "共通ヘッダー／ナビゲーションレイアウト（`layout.html`）を作成し、全10画面へのリンク枠を配置した",
    "3名全員が最新の `develop` を `git pull` してローカルで起動確認できた",
  ],
};

const TEAM_STEP3: ProjectStepSpec = {
  stepNumber: 3,
  recommendedBranch: "feature/your-role-pages",
  designDocPath: TEAM_SPEC_PATH,
  designDocLabel: "TeamOps Hub 詳細設計書 v1.1.0（05_画面設計・07_クラス設計・10_状態遷移・排他）",
  isTeamProject: true,
  checklist: [
    "自分の担当3ページすべてについて、機能ごとに `feature/...` ブランチを切って実装した",
    "担当分のController / Service / Repository / Thymeleafテンプレートを 05_画面設計・07_クラス設計・10_状態遷移・排他 の仕様通りに実装した",
    "GitHub上で `develop` 宛のPull Requestを作成し、変更内容と動作確認スクショを記載した",
    "他メンバーのPRを最低1件以上コードレビューし、コメント・Approveを行った",
  ],
};

const TEAM_STEP4: ProjectStepSpec = {
  stepNumber: 4,
  recommendedBranch: "feature/team-step4-integration",
  designDocPath: TEAM_SPEC_PATH,
  designDocLabel: "TeamOps Hub 詳細設計書 v1.1.0（02_チーム分担・所有権・IF・03_Git・PR運用）",
  isTeamProject: true,
  checklist: [
    "全員の担当3ページ（計9ページ＋ログイン＝全10画面）が `develop` ブランチへマージされた",
    "マージ時に発生したコンフリクト（共通ナビ・設定ファイル等）を `git merge origin/develop` で適切に解消した",
    "メンバーAで登録した社員がメンバーBのタスク担当者やメンバーCの貸出申請者として正しく連携表示される",
    "権限マトリクス（05_画面設計・11_検証・セキュリティ：USERがADMIN専用URLや他人の貸出詳細へアクセスすると403になる等）を確認した",
  ],
};

const TEAM_STEP5: ProjectStepSpec = {
  stepNumber: 5,
  recommendedBranch: "fix/team-step5-test-fixes",
  designDocPath: TEAM_SPEC_PATH,
  designDocLabel: "TeamOps Hub 詳細設計書 v1.1.0（12_テスト仕様・計画・判断ログ）",
  isTeamProject: true,
  checklist: [
    "12_テスト仕様 の横断結合テスト（IT-001〜IT-012）をチーム全員で実施した",
    "見つかったバグをGitHub Issuesに登録し、`fix/...` ブランチ→PRで修正・クローズした",
    "備品貸出の承認/返却トランザクションや案件進捗率の自動計算など異常系も含めて動作確認した",
    "テスト完了済みの `develop` から `main` ブランチへリリースPRを作成した",
  ],
};

const TEAM_STEP6: ProjectStepSpec = {
  stepNumber: 6,
  recommendedBranch: "release/v1.0-final",
  designDocPath: TEAM_SPEC_PATH,
  designDocLabel: "TeamOps Hub 開発者向け詳細設計書 v1.1.0（Excel・全13シート）",
  isTeamProject: true,
  checklist: [
    "チーム共有リポジトリの `README.md` にシステム概要・3名の担当画面・環境構築＆起動手順・テストアカウントを記載した",
    "GitHubのPull Requests履歴・Insights/Contributorsで3名全員の開発貢献が確認できる",
    "デモ発表用の画面遷移シナリオを確認し、全10画面がエラーなく動作することを確認した",
    "最終リリース用の **GitHub Pull Request URL（`/pull/番号`）** を下のフォームから提出した",
  ],
};

export const TEAM_PROJECT_PROBLEMS: SeedProblem[] = [
  {
    id: "44444444-4444-4444-8444-444444441501",
    lesson_id: "33333333-3333-4333-8333-333333331501",
    chapter_id: "22222222-2222-4222-8222-222222221501",
    language: "project",
    title: "Team Step 1：チーム開発の流れ・役割分担（1人3ページ）＆Git運用ルール策定",
    description_md: `## 3人1組チーム開発：社内統合業務システム「TeamOps Hub」

1年間カリキュラムの集大成です！3人で力を合わせ、**共通ログイン機能（1画面）＋ 1人3ページ × 3名（計9画面）＝ 全10画面** の本格Webシステムを構築します。

\`\`\`mermaid
graph TD
    Login["共通：SCR-00 ログイン画面<br/>Spring Security + BCrypt"]
    Login --> A["メンバーA（3画面）<br/>①ダッシュボード<br/>②社員一覧・検索<br/>③社員登録・編集"]
    Login --> B["メンバーB（3画面）<br/>①案件一覧（進捗率）<br/>②案件詳細・タスクボード<br/>③タスク登録・編集"]
    Login --> C["メンバーC（3画面）<br/>①備品一覧・在庫検索<br/>②貸出申請・返却一覧<br/>③申請詳細・承認/返却"]
\`\`\`

### チーム開発の標準ブランチ運用（Git Flow簡易版）
\`\`\`mermaid
gitGraph
    commit id: "初期構築"
    branch develop
    checkout develop
    commit id: "共通ログイン＆DB基盤"
    branch feature/a-members
    checkout feature/a-members
    commit id: "社員一覧・登録実装"
    checkout develop
    branch feature/b-projects
    checkout feature/b-projects
    commit id: "案件・タスク実装"
    checkout develop
    merge feature/a-members id: "PR#1 レビュー後マージ"
    merge feature/b-projects id: "PR#2 レビュー後マージ"
    checkout main
    merge develop id: "最終リリース"
\`\`\`

まずは右側から **TeamOps Hub 詳細設計書 v1.1.0（Excel・全13シート）** をダウンロードし、3人で担当（A/B/C）・ファイル所有権・IF契約・Gitルールを決めましょう！`,
    difficulty: "medium",
    estimated_minutes: 120,
    tags: ["チーム開発", "Gitブランチ", "役割分担"],
    starter_code: projStarter(TEAM_STEP1),
    solution_code: projSolution(TEAM_STEP1, "teamops-hub"),
    explanation_md: "最初に「誰がどのファイル・テーブルを触るか」の境界を設計書で合意しておくと、チーム開発のトラブルの8割を未然に防げます。",
    order_index: 1,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "毎日10分の「朝会（昨日やったこと・今日やること・困っていること）」を行うと進捗ズレにすぐ気づけます。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441502",
    lesson_id: "33333333-3333-4333-8333-333333331501",
    chapter_id: "22222222-2222-4222-8222-222222221501",
    language: "project",
    title: "Team Step 2：共通基盤（6テーブルDB・ログイン認証・共通レイアウト）の構築",
    description_md: `## 全員が同じ土台の上で開発を始める

並行開発に入る前に、3人で共有する **データベース（6テーブル）・ログイン認証・共通ヘッダー** を最初に \`develop\` ブランチへ完成させます。

\`\`\`mermaid
erDiagram
    departments ||--o{ users : "所属"
    users ||--o{ projects : "責任者"
    projects ||--o{ tasks : "紐づく"
    users ||--o{ tasks : "担当"
    equipments ||--o{ equipment_loans : "貸出対象"
    users ||--o{ equipment_loans : "申請者"
\`\`\`

### 確認するExcelシート
- **05_画面設計 / 11_検証・セキュリティ**：全10画面のURLと ADMIN / USER 権限マトリクス
- **08_DB設計**：全6テーブル定義・制約・初期データ`,
    difficulty: "medium",
    estimated_minutes: 180,
    tags: ["チーム開発", "Spring Security", "DB設計"],
    starter_code: projStarter(TEAM_STEP2),
    solution_code: projSolution(TEAM_STEP2, "teamops-hub"),
    explanation_md: "共通基盤を先に `develop` へ確定させたことで、次ステップから3人が同時並行で高速開発できるようになります。",
    order_index: 2,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "Thymeleafの共通ヘッダーは `th:fragment` を使うと全10画面で同じナビゲーションを使い回せます。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441503",
    lesson_id: "33333333-3333-4333-8333-333333331502",
    chapter_id: "22222222-2222-4222-8222-222222221502",
    language: "project",
    title: "Team Step 3：担当3ページの実装とPull Request相互レビュー",
    description_md: `## 各自のブランチで3ページを実装し、PRでレビューし合う

Excel詳細設計書の **05_画面設計・07_クラス設計・10_状態遷移・排他** を見ながら、自分の担当3ページを実装しましょう。

### 毎日の開発サイクル
1. \`git switch develop && git pull origin develop\`
2. \`git switch -c feature/自分の担当-画面名\`
3. 実装＆ローカル動作確認 → Commit & Push
4. GitHubで \`develop\` 向け **Pull Request** を作成
5. チームメンバー1名以上がレビュー＆Approveしてからマージ！`,
    difficulty: "hard",
    estimated_minutes: 360,
    tags: ["チーム開発", "Pull Request", "コードレビュー"],
    starter_code: projStarter(TEAM_STEP3),
    solution_code: projSolution(TEAM_STEP3, "teamops-hub"),
    explanation_md: "他人のコードを読んでレビューすることで、自分では気づかなかった書き方やバグの防止策が身につきます。",
    order_index: 3,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "1つのPRが大きくなりすぎないよう、1画面（または一覧→登録→編集）単位でこまめにPRを出すとレビューしやすくなります。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441504",
    lesson_id: "33333333-3333-4333-8333-333333331502",
    chapter_id: "22222222-2222-4222-8222-222222221502",
    language: "project",
    title: "Team Step 4：コンフリクト解消と3名機能（全10画面）の横断結合",
    description_md: `## コンフリクトを恐れずに正しく解消する

チーム開発では、同じファイル（共通ナビや \`application.properties\` 等）を2人が編集して **コンフリクト（競合）** が起きるのが普通です。

\`\`\`mermaid
flowchart TD
    C["PRでコンフリクト発生！"] --> Pull["1. ローカルで git fetch origin"]
    Pull --> Merge["2. 自分のブランチ上で git merge origin/develop"]
    Merge --> Edit["3. <<<<<<< / ======= / >>>>>>> を確認し<br/>両方の必要な変更を残して保存"]
    Edit --> Test["4. Eclipseでビルド＆起動確認"]
    Test --> Push["5. git add . → git commit → git push"]
\`\`\`

### 確認ポイント
- メンバーA・B・Cすべての画面が \`develop\` 上で1つのアプリとしてシームレスに遷移できること
- 権限設定（ADMINのみ操作可能／USERは閲覧のみ）が仕様通り動くこと`,
    difficulty: "hard",
    estimated_minutes: 240,
    tags: ["チーム開発", "コンフリクト解消", "統合"],
    starter_code: projStarter(TEAM_STEP4),
    solution_code: projSolution(TEAM_STEP4, "teamops-hub"),
    explanation_md: "コンフリクトを自力で解消してビルドを通せた経験は、実務現場で即戦力として評価される大きな武器になります。",
    order_index: 4,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "コンフリクト解消時は、相手の変更を誤って消さないよう変更した本人と会話しながら確認するのが確実です。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441505",
    lesson_id: "33333333-3333-4333-8333-333333331503",
    chapter_id: "22222222-2222-4222-8222-222222221503",
    language: "project",
    title: "Team Step 5：横断結合テスト（12_テスト仕様：IT-001〜IT-012）実施＆バグ改修",
    description_md: `## 3人分の機能を横断する結合テスト

Excel詳細設計書の **12_テスト仕様・計画・判断ログ（IT-001〜IT-012）** を使って、担当者同士でクロスチェック（他人が作った画面をテスト）しましょう。

### バグが見つかったときの流れ
1. GitHub の **Issues** タブに再現手順とスクリーンショットを起票する
2. 担当者が \`fix/issue番号-内容\` ブランチを作成して修正する
3. PRレビュー後に \`develop\` へマージし、Issueをクローズする
4. 全テスト合格後、\`develop\` → \`main\` へリリースPRをマージする`,
    difficulty: "hard",
    estimated_minutes: 180,
    tags: ["チーム開発", "結合テスト", "GitHub Issues"],
    starter_code: projStarter(TEAM_STEP5),
    solution_code: projSolution(TEAM_STEP5, "teamops-hub"),
    explanation_md: "自分で作った画面は思い込みで見落としやすいため、他メンバーがテストするクロスチェックが品質向上の鍵です。",
    order_index: 5,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "在庫数の増減（承認時 -quantity、返却時 +quantity）は `@Transactional` を付けて不整合を防ぎましょう。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441506",
    lesson_id: "33333333-3333-4333-8333-333333331503",
    chapter_id: "22222222-2222-4222-8222-222222221503",
    language: "project",
    title: "Team Step 6：成果発表・README整備＆チームGitHubリポジトリ最終提出",
    description_md: `## 1年間カリキュラムの集大成：最終提出

チーム全員で以下の最終確認を行い、最終リリースPRの **GitHub Pull Request URL（\`/pull/番号\`）** を提出してください。

### 最終チェック
- \`README.md\` に以下が分かりやすくまとまっていること
  1. システム概要と3名の担当画面一覧
  2. ローカル起動手順（PostgreSQL DB作成・DDL投入・Spring Boot起動）
  3. テスト用アカウント（ADMIN / USER のメールアドレス・パスワード）
  4. 工夫した点・苦労した点（コンフリクト解消や設計工夫など）
- \`main\` ブランチを新規フォルダへ \`git clone\` してエラーなく起動できること`,
    difficulty: "hard",
    estimated_minutes: 120,
    tags: ["チーム開発", "最終提出", "GitHub提出"],
    starter_code: projStarter(TEAM_STEP6),
    solution_code: projSolution(TEAM_STEP6, "teamops-hub"),
    explanation_md: "1年間カリキュラムの全工程完遂、本当におめでとうございます！設計書読解・実装・テスト・Gitチーム開発までやり切った実績は、現場配属後も確かな自信になります。",
    order_index: 6,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "提出するURLは最終リリース用Pull RequestのURL（例：`https://github.com/team-xxx/teamops-hub/pull/6`）を入力してください。" },
    ],
  },
];
