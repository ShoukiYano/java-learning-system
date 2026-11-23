import type { SeedChapter, SeedProblem } from "@/lib/seed-data";
import type { ExcelProblemSpec } from "@/lib/excel/excel-engine";
import type { LiteracyQuizSpec } from "@/lib/curriculum-evaluators";

export const SEED_LITERACY_COURSE_ID = "11111111-1111-4111-8111-111111111111";
export const SEED_EXCEL_COURSE_ID = "11111111-1111-4111-8111-111111111112";

// Helpers to keep definitions readable and strictly typed
function quizJson(spec: LiteracyQuizSpec): string {
  return JSON.stringify(spec);
}

function quizSolution(spec: LiteracyQuizSpec): string {
  const ans: Record<string, number> = {};
  for (const q of spec.questions) {
    ans[q.id] = q.correctIndex;
  }
  return JSON.stringify(ans);
}

function excelJson(spec: ExcelProblemSpec): string {
  return JSON.stringify(spec);
}

// =============================================================================
// 1. ITリテラシー導入コース（3日間・全6問）
// =============================================================================
export const LITERACY_CHAPTERS: SeedChapter[] = [
  {
    id: "22222222-2222-4222-8222-222222221101",
    course_id: SEED_LITERACY_COURSE_ID,
    title: "第1章（1日目）：ITとは？Webシステムが動く仕組み",
    description: "IT・ソフトウェア・ブラウザ・サーバー・データベースの役割を図解で理解します。",
    order_index: 1,
    lesson_id: "33333333-3333-4333-8333-333333331101",
    lesson_title: "Webアプリの全体像とPC基礎",
  },
  {
    id: "22222222-2222-4222-8222-222222221102",
    course_id: SEED_LITERACY_COURSE_ID,
    title: "第2章（2日目）：ネットワークと情報セキュリティの基礎",
    description: "HTTP/HTTPS・IPアドレス・DNS・パスワード管理や情報漏洩対策を学びます。",
    order_index: 2,
    lesson_id: "33333333-3333-4333-8333-333333331102",
    lesson_title: "インターネット通信とセキュリティ",
  },
  {
    id: "22222222-2222-4222-8222-222222221103",
    course_id: SEED_LITERACY_COURSE_ID,
    title: "第3章（3日目）：システム開発の流れとエンジニアの働き方",
    description: "要件定義〜詳細設計〜実装〜テストの工程と、現場で必要な設計書・報連相を学びます。",
    order_index: 3,
    lesson_id: "33333333-3333-4333-8333-333333331103",
    lesson_title: "開発プロセスとチームでの仕事の進め方",
  },
];

const L1_QUIZ: LiteracyQuizSpec = {
  questions: [
    {
      id: "q1",
      question: "Webサイトを開いたとき、画面のHTMLやデータを返す役割を担うコンピュータはどれですか？",
      options: ["Webサーバー", "マウス", "キーボード", "モニター"],
      correctIndex: 0,
      explanation: "ブラウザ（クライアント）からのリクエストを受け取り、HTMLやデータを返すのがWebサーバーです。",
    },
    {
      id: "q2",
      question: "商品データや会員情報などを永続的に保存・検索するソフトウェアはどれですか？",
      options: ["ブラウザ", "データベース（DB）", "テキストエディタ", "スライド作成ソフト"],
      correctIndex: 1,
      explanation: "データベース（PostgreSQLなど）は、データを表形式で安全に保管し、高速に検索・更新する役割を持ちます。",
    },
    {
      id: "q3",
      question: "HTML・CSS・JavaScriptのようにブラウザ側（画面側）で動く領域を何と呼びますか？",
      options: ["フロントエンド", "バックエンド", "インフラ", "データベース"],
      correctIndex: 0,
      explanation: "ユーザーが直接見る画面側をフロントエンド、サーバー側の処理（Java / Spring Boot等）をバックエンドと呼びます。",
    },
  ],
};

const L2_QUIZ: LiteracyQuizSpec = {
  questions: [
    {
      id: "q1",
      question: "日本語の文字化けを防ぐため、現代のWeb開発・Java・PostgreSQLで標準的に使われる文字コードはどれですか？",
      options: ["UTF-8", "ASCIIのみ", "モールス信号", "BMP"],
      correctIndex: 0,
      explanation: "UTF-8は世界中の文字を扱える国際標準の文字コードであり、Windows/Mac/Linux間で文字化けしにくいのが特長です。",
    },
    {
      id: "q2",
      question: "プログラムや設定ファイルの場所を示す「フォルダの階層」を文字列で表したものを何と言いますか？",
      options: ["パス（Path）", "ピクセル", "キャッシュ", "フレーム"],
      correctIndex: 0,
      explanation: "例：`src/main/java/App.java` のようなファイルの住所をパス（絶対パス／相対パス）と呼びます。",
    },
  ],
};

const L3_QUIZ: LiteracyQuizSpec = {
  questions: [
    {
      id: "q1",
      question: "通信内容を暗号化して盗聴や改ざんを防ぐ、現在のWeb標準プロトコルはどれですか？",
      options: ["HTTP", "HTTPS", "FTP", "Telnet"],
      correctIndex: 1,
      explanation: "HTTPSはHTTPにTLS/SSL暗号化を組み合わせた安全な通信方式です。ブラウザに鍵マークが表示されます。",
    },
    {
      id: "q2",
      question: "URLのドメイン名（例：`example.com`）をIPアドレスへ変換してくれる仕組みはどれですか？",
      options: ["DNS", "CSS", "SQL", "CPU"],
      correctIndex: 0,
      explanation: "DNS（Domain Name System）は、人間が覚えやすいドメイン名とネットワーク上の住所（IPアドレス）を結びつけます。",
    },
    {
      id: "q3",
      question: "Webページが見つからないときにサーバーが返すHTTPステータスコードはどれですか？",
      options: ["200 OK", "404 Not Found", "500 Internal Server Error", "302 Found"],
      correctIndex: 1,
      explanation: "200は成功、404はページ未存在、500はサーバー内部エラーを表します。開発時の原因調査で毎日使います。",
    },
  ],
};

const L4_QUIZ: LiteracyQuizSpec = {
  questions: [
    {
      id: "q1",
      question: "パスワードをデータベースに保存するとき、実務で必ず行うべき対策はどれですか？",
      options: ["そのまま平文で保存する", "BCrypt等でハッシュ化して保存する", "ファイル名に書く", "チャットに貼って共有する"],
      correctIndex: 1,
      explanation: "万が一DBが漏洩しても元のパスワードが分からないよう、復元不可能なハッシュ化（BCrypt等）を行います。",
    },
    {
      id: "q2",
      question: "顧客情報やAPIキー、本番DBのパスワードについて正しい行動はどれですか？",
      options: [
        "公開GitHubリポジトリにそのままPushする",
        "環境変数や管理外ファイルに分け、GitHubへ絶対に上げない",
        "メモ帳に書いてデスクトップに公開する",
        "パスワードは全員1234にする",
      ],
      correctIndex: 1,
      explanation: "秘密鍵やパスワードは `.gitignore` で除外し、GitHubに絶対にコミットしないのが鉄則です。",
    },
  ],
};

const L5_QUIZ: LiteracyQuizSpec = {
  questions: [
    {
      id: "q1",
      question: "「何を作るか」を顧客と合意し、機能一覧や画面イメージをまとめる最初の工程はどれですか？",
      options: ["要件定義", "単体テスト", "運用保守", "コーディング"],
      correctIndex: 0,
      explanation: "要件定義 → 基本設計 → 詳細設計 → 実装（製造） → テスト → リリース の流れで進めます。",
    },
    {
      id: "q2",
      question: "詳細設計書を見て実装を始める前に、エンジニアが最初に行うべきこととして最も適切なのはどれですか？",
      options: [
        "設計書を読まずに勘でコードを書く",
        "画面一覧・テーブル定義・バリデーション仕様を確認し、不明点があれば先に質問する",
        "いきなりテストをスキップして提出する",
        "他の人の設計を勝手に変える",
      ],
      correctIndex: 1,
      explanation: "詳細設計書を正しく読み解き、仕様の認識ズレを実装前に解消することが手戻りを防ぐ最大のコツです。",
    },
  ],
};

const L6_QUIZ: LiteracyQuizSpec = {
  questions: [
    {
      id: "q1",
      question: "エラーが起きて15〜30分調べても解決しないとき、現場で最も評価される質問の仕方はどれですか？",
      options: [
        "「動きません。助けてください」とだけ送る",
        "「やりたいこと・試したこと・出たエラー文（スクショ）」を整理して質問する",
        "誰にも相談せず3日間ずっと黙って悩む",
        "エラー画面を閉じて見なかったことにする",
      ],
      correctIndex: 1,
      explanation: "①ゴール（やりたいこと）②現状（エラー全文）③試したこと の3点を添えると回答者が即座に原因を特定できます。",
    },
    {
      id: "q2",
      question: "「単体テスト」と「結合テスト」の違いとして正しいものはどれですか？",
      options: [
        "単体テストは1つの機能・画面単位の確認、結合テストは複数画面やDB・他メンバー機能との連携確認",
        "どちらも全く同じ意味である",
        "単体テストはリリース後に行う",
        "結合テストは設計書を見ないで行う",
      ],
      correctIndex: 0,
      explanation: "小さな部品が正しく動くか（単体）→ 繋げたときに全体が正しく動くか（結合）の順で品質を担保します。",
    },
  ],
};

export const LITERACY_PROBLEMS: SeedProblem[] = [
  {
    id: "44444444-4444-4444-8444-444444441101",
    lesson_id: "33333333-3333-4333-8333-333333331101",
    chapter_id: "22222222-2222-4222-8222-222222221101",
    language: "literacy",
    title: "ITリテラシー 1-1：ITとは？Webアプリが動く仕組みを図で理解しよう",
    description_md: `## ITとWebシステムの基本構造

これから1年間かけて、あなたは **「業務Webシステムを設計書から作れるITエンジニア」** を目指します。
まずは、普段スマホやPCで見ているWebアプリの裏側がどう動いているのかを図で確認しましょう。

\`\`\`mermaid
sequenceDiagram
    actor User as ユーザー（ブラウザ）
    participant Web as Webサーバー（HTML/CSS）
    participant App as アプリサーバー（Java / Spring Boot）
    participant DB as データベース（PostgreSQL / SQL）

    User->>Web: 1. 画面を開きたい（HTTPリクエスト）
    Web->>App: 2. 業務処理・商品データ取得を依頼
    App->>DB: 3. SQLでデータを検索（SELECT）
    DB-->>App: 4. 検索結果を返却
    App-->>Web: 5. 画面データ（HTML）を組み立て
    Web-->>User: 6. ブラウザに画面を表示（HTTPレスポンス）
\`\`\`

### これから学ぶ1年間のロードマップと対応関係
- **HTML & CSS**：ブラウザに表示される「見た目・画面」を作る技術（フロントエンド）
- **Java & Spring Boot**：ログイン判定・計算・検索などの「頭脳」を作る技術（バックエンド）
- **SQL & PostgreSQL**：商品や会員情報を安全に保存・検索する「記憶庫」（データベース）
- **Excel & Git**：現場でのデータ調査・設計書作成・チーム共同作業に欠かせない実務ツール

下の理解度チェックに全問正解して次へ進みましょう！`,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["ITリテラシー", "Web仕組み", "基礎"],
    starter_code: quizJson(L1_QUIZ),
    solution_code: quizSolution(L1_QUIZ),
    explanation_md: "ブラウザ（クライアント）→ Web/アプリサーバー → データベース の3層構造（Web 3層アーキテクチャ）は、今後のSpring Boot開発でもそのまま使います。",
    order_index: 1,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "上のMermaidシーケンス図の登場人物（ブラウザ・Webサーバー・アプリサーバー・データベース）の役割を見直してみましょう。" },
      { step_number: 2, content_md: "ユーザーが直接見る画面側を「フロントエンド」、裏側の処理側を「バックエンド」と呼びます。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441102",
    lesson_id: "33333333-3333-4333-8333-333333331101",
    chapter_id: "22222222-2222-4222-8222-222222221101",
    language: "literacy",
    title: "ITリテラシー 1-2：PC・OS・フォルダ構造（パス）と文字コードの基礎",
    description_md: `## エンジニアが毎日意識する「パス」と「文字コード」

プログラミングでは、たくさんのソースコードや設定ファイルをフォルダ（ディレクトリ）に分けて整理します。

\`\`\`mermaid
graph TD
    Root["product-manager/（プロジェクトルート）"]
    Root --> Src["src/main/"]
    Root --> Pom["pom.xml（ライブラリ設定）"]
    Root --> Readme["README.md（説明書）"]
    Src --> Java["java/com/example/（Javaプログラム）"]
    Src --> Res["resources/"]
    Res --> Tpl["templates/（HTML画面）"]
    Res --> Prop["application.properties（DB設定）"]
\`\`\`

### 覚えておくべき3つの基礎知識
1. **パス（Path）**：ファイルの場所を表す住所です。プロジェクトの階層を \`/\`（スラッシュ）でつなぎます。
2. **拡張子**：ファイル名の末尾（\`.java\`, \`.html\`, \`.css\`, \`.sql\`, \`.xlsx\`）でファイルの種類を識別します。
3. **文字コード（UTF-8）**：コンピュータは文字を数字（0と1）で記憶します。日本語の文字化けを防ぐため、開発現場では **UTF-8** に統一します。`,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["ITリテラシー", "UTF-8", "パス"],
    starter_code: quizJson(L2_QUIZ),
    solution_code: quizSolution(L2_QUIZ),
    explanation_md: "EclipseやPostgreSQLの設定でも必ず「UTF-8」を選びます。パス構造を意識するとエラー時にどのファイルを直せばよいか迷わなくなります。",
    order_index: 2,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "現代のWeb開発で文字化けを防ぐ国際標準の文字コードは `UTF-8` です。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441103",
    lesson_id: "33333333-3333-4333-8333-333333331102",
    chapter_id: "22222222-2222-4222-8222-222222221102",
    language: "literacy",
    title: "ITリテラシー 2-1：インターネット・HTTP/HTTPS・DNSの仕組み",
    description_md: `## URLを入力してから画面が出るまでの通信の流れ

ブラウザに \`https://shop.example.com/products\` と入力したとき、裏側では次のような通信が行われています。

\`\`\`mermaid
flowchart LR
    A["ブラウザにURL入力"] --> B["DNSサーバーに問い合わせ<br/>ドメイン名 → IPアドレス"]
    B --> C["HTTPS（暗号化通信）で<br/>Webサーバーへリクエスト"]
    C --> D{"ステータスコード判定"}
    D -->|200 OK| E["正常に画面を表示"]
    D -->|404 Not Found| F["ページが見つかりません"]
    D -->|500 Server Error| G["サーバー内部エラー"]
\`\`\`

### 現場でよく使うHTTPメソッドとステータスコード
- **GET**：画面やデータを「取得」するとき（例：商品一覧を見る）
- **POST**：データを「登録・更新・削除」するとき（例：商品を新規登録する）
- **200 / 302**：正常完了・別ページへリダイレクト
- **403 / 404**：権限なし / URL間違い・データなし
- **500**：JavaプログラムやSQLのバグによるサーバーエラー`,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["ITリテラシー", "HTTP", "DNS"],
    starter_code: quizJson(L3_QUIZ),
    solution_code: quizSolution(L3_QUIZ),
    explanation_md: "Spring Boot開発では `@GetMapping` / `@PostMapping` や 404・500 エラーの切り分けでHTTPの知識をそのまま使います。",
    order_index: 3,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "暗号化通信は末尾に S（Secure）がついた `HTTPS`、ドメイン→IP変換は `DNS` です。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441104",
    lesson_id: "33333333-3333-4333-8333-333333331102",
    chapter_id: "22222222-2222-4222-8222-222222221102",
    language: "literacy",
    title: "ITリテラシー 2-2：情報セキュリティとエンジニアの守秘義務",
    description_md: `## エンジニアが絶対に守るべきセキュリティ原則

システム開発では、個人情報・売上データ・パスワードなど大切な情報を扱います。たった1つのミスが大きな事故につながるため、基本原則を最初に身につけましょう。

\`\`\`mermaid
flowchart TD
    Sec["情報セキュリティの3要素（CIA）"]
    Sec --> C["機密性 (Confidentiality)<br/>許可された人だけが見られる"]
    Sec --> I["完全性 (Integrity)<br/>データが改ざんされない"]
    Sec --> A["可用性 (Availability)<br/>必要なときにいつでも使える"]
\`\`\`

### 開発現場のNG行動と正しい対策
| リスク | NG行動 | 正しい対策 |
|---|---|---|
| パスワード漏洩 | DBに平文（そのままの文字）で保存 | **BCrypt等でハッシュ化**して保存 |
| 機密情報の流出 | APIキーやDBパスワードをGitHubへPush | **環境変数・.gitignore** で管理 |
| SQLインジェクション | 文字列連結でSQLを組み立てる | **プレースホルダ（JPA / PreparedStatement）** を使う |`,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["ITリテラシー", "セキュリティ", "コンプライアンス"],
    starter_code: quizJson(L4_QUIZ),
    solution_code: quizSolution(L4_QUIZ),
    explanation_md: "Spring SecurityによるBCryptハッシュ化や `.gitignore` の設定は、後半の個人開発・チーム開発で実際に手を動かして実装します。",
    order_index: 4,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "パスワードは必ず復元できないハッシュ値にして保存し、秘密情報はGitHubに公開しないことが原則です。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441105",
    lesson_id: "33333333-3333-4333-8333-333333331103",
    chapter_id: "22222222-2222-4222-8222-222222221103",
    language: "literacy",
    title: "ITリテラシー 3-1：システム開発の工程（要件定義〜設計〜実装〜テスト）",
    description_md: `## システムはどうやって作られるのか？（V字モデル）

実際の業務システムは、いきなりプログラミングを始めるのではなく、**「設計書」** を作ってチーム全員の認識を合わせてから開発します。

\`\`\`mermaid
flowchart LR
    A["1. 要件定義<br/>何を作るか決める"] --> B["2. 基本設計<br/>画面・機能構成"]
    B --> C["3. 詳細設計<br/>DB・クラス・バリデーション"]
    C --> D["4. 実装（製造）<br/>Java / HTML / SQL"]
    D --> E["5. 単体テスト<br/>1機能ごとの確認"]
    E --> F["6. 結合テスト<br/>画面・DB連携確認"]
    F --> G["7. リリース・運用"]
\`\`\`

### このカリキュラムのゴール
後半の「商品管理システム（個人開発）」と「チーム開発」では、実際の現場と同じ **Excel形式の詳細設計書** を配布します。
設計書を読み解いてシステムを完成させる力を身につければ、現場に配属されてもスムーズに活躍できます！`,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["ITリテラシー", "開発工程", "詳細設計書"],
    starter_code: quizJson(L5_QUIZ),
    solution_code: quizSolution(L5_QUIZ),
    explanation_md: "要件定義→設計→実装→テストの流れを意識することで、今自分が何のためにコードを書いているのかが明確になります。",
    order_index: 5,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "最初の工程は「何を作るか」を合意する『要件定義』、実装前には設計書を読んで認識ズレを防ぎます。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441106",
    lesson_id: "33333333-3333-4333-8333-333333331103",
    chapter_id: "22222222-2222-4222-8222-222222221103",
    language: "literacy",
    title: "ITリテラシー 3-2：現場で評価される質問力（報連相）とテストの考え方",
    description_md: `## 困ったときの「伝わる質問テンプレート」

システム開発はエラーとの戦いです。大切なのは「エラーを出さないこと」ではなく、**「素早く正確に原因を調査し、適切に相談できること」** です。

\`\`\`mermaid
flowchart TD
    Err["エラー発生！"] --> Read["1. エラーメッセージを最後まで読む"]
    Read --> Try["2. 15〜30分自分で調査・切り分け"]
    Try --> Solved{"解決した？"}
    Solved -->|はい| Next["メモを残して次へ進む"]
    Solved -->|いいえ| Ask["3. 以下の3点をまとめて質問する<br/>①やりたいこと ②エラー全文 ③試したこと"]
\`\`\`

### テストの基本：正常系と異常系
- **正常系**：正しい入力をしたときに期待通り登録・表示されること
- **異常系**：空欄やマイナス値、存在しないIDを入れたときにクラッシュせず適切なエラーメッセージが出ること

これでITリテラシー導入は完了です！次は **Excel実務マスター** へ進みましょう。`,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["ITリテラシー", "報連相", "テスト"],
    starter_code: quizJson(L6_QUIZ),
    solution_code: quizSolution(L6_QUIZ),
    explanation_md: "「やりたいこと・エラー全文・試したこと」の3点セットは、この学習システムの講師質問チャットでもそのまま活用してください。",
    order_index: 6,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "質問時は「やりたいこと・エラー文・試したこと」を共有し、テストは「単体→結合」の順に行います。" },
    ],
  },
];

// =============================================================================
// 2. Excel実務マスターコース（1か月・全12問）
// =============================================================================
export const EXCEL_CHAPTERS: SeedChapter[] = [
  {
    id: "22222222-2222-4222-8222-222222221201",
    course_id: SEED_EXCEL_COURSE_ID,
    title: "第1章：Excel基本数式・集計関数・絶対参照",
    description: "四則演算、SUM/AVERAGE/MAX/MIN、そして実務でつまずきやすい絶対参照（$）を画面上のシートで習得します。",
    order_index: 1,
    lesson_id: "33333333-3333-4333-8333-333333331201",
    lesson_title: "基本計算と絶対参照マスター",
  },
  {
    id: "22222222-2222-4222-8222-222222221202",
    course_id: SEED_EXCEL_COURSE_ID,
    title: "第2章：IF・COUNTIF・SUMIFによる条件判定と集計",
    description: "目標達成の自動判定や、ステータス別件数調査・部署別金額集計を関数で自動化します。",
    order_index: 2,
    lesson_id: "33333333-3333-4333-8333-333333331202",
    lesson_title: "条件分岐と条件付き集計",
  },
  {
    id: "22222222-2222-4222-8222-222222221203",
    course_id: SEED_EXCEL_COURSE_ID,
    title: "第3章：VLOOKUP・XLOOKUP・IFERRORによるデータ参照",
    description: "マスタ表からの情報自動取得と、実務で必須のエラーハンドリング（IFERROR）を習得します。",
    order_index: 3,
    lesson_id: "33333333-3333-4333-8333-333333331203",
    lesson_title: "マスタ参照とエラー処理",
  },
  {
    id: "22222222-2222-4222-8222-222222221204",
    course_id: SEED_EXCEL_COURSE_ID,
    title: "第4章：実務データ調査・突合チェック・報告レポート作成",
    description: "文字列整形、発注vs納品データの差異突合、月次報告サマリー表の作成まで実務シナリオで仕上げます。",
    order_index: 4,
    lesson_id: "33333333-3333-4333-8333-333333331204",
    lesson_title: "実務調査・突合・レポート総合演習",
  },
];

const E1_SPEC: ExcelProblemSpec = {
  sheetName: "売上明細",
  cols: 4,
  rows: 5,
  headerRows: [1],
  cells: {
    A1: "商品名", B1: "単価", C1: "数量", D1: "小計",
    A2: "ノートPC", B2: 120000, C2: 2, D2: "",
    A3: "ワイヤレスマウス", B3: 3500, C3: 5, D3: "",
    A4: "USB-Cハブ", B4: 4800, C4: 3, D4: "",
    A5: "合計", B5: "", C5: "", D5: "",
  },
  targets: [
    { cell: "D2", expected: 240000, label: "ノートPC小計（=B2*C2）" },
    { cell: "D3", expected: 17500, label: "マウス小計（=B3*C3）" },
    { cell: "D4", expected: 14400, label: "ハブ小計（=B4*C4）" },
    { cell: "D5", expected: 271900, requiredTokens: ["SUM"], label: "売上合計（=SUM(D2:D4)）" },
  ],
};

const E2_SPEC: ExcelProblemSpec = {
  sheetName: "月次売上分析",
  cols: 4,
  rows: 7,
  headerRows: [1],
  cells: {
    A1: "店舗名", B1: "売上（万円）", C1: "分析項目", D1: "集計結果",
    A2: "東京本店", B2: 420, C2: "合計売上", D2: "",
    A3: "大阪支店", B3: 310, C3: "平均売上", D3: "",
    A4: "名古屋支店", B4: 260, C4: "最高売上", D4: "",
    A5: "福岡支店", B5: 210, C5: "最低売上", D5: "",
    A6: "札幌支店", B6: 180, C6: "", D6: "",
  },
  targets: [
    { cell: "D2", expected: 1380, requiredTokens: ["SUM"], label: "合計売上（SUM）" },
    { cell: "D3", expected: 276, requiredTokens: ["AVERAGE"], label: "平均売上（AVERAGE）" },
    { cell: "D4", expected: 420, requiredTokens: ["MAX"], label: "最高売上（MAX）" },
    { cell: "D5", expected: 180, requiredTokens: ["MIN"], label: "最低売上（MIN）" },
  ],
};

const E3_SPEC: ExcelProblemSpec = {
  sheetName: "税込価格表",
  cols: 4,
  rows: 6,
  headerRows: [3],
  cells: {
    A1: "消費税率", B1: 0.1, C1: "", D1: "",
    A3: "商品名", B3: "税抜価格", C3: "税込価格", D3: "",
    A4: "モニター", B4: 30000, C4: "", D4: "",
    A5: "キーボード", B5: 12000, C5: "", D5: "",
    A6: "ヘッドセット", B6: 8000, C6: "", D6: "",
  },
  targets: [
    { cell: "C4", expected: 33000, requiredTokens: ["$B$1"], label: "モニター税込（$B$1を使用）" },
    { cell: "C5", expected: 13200, requiredTokens: ["$B$1"], label: "キーボード税込（$B$1を使用）" },
    { cell: "C6", expected: 8800, requiredTokens: ["$B$1"], label: "ヘッドセット税込（$B$1を使用）" },
  ],
};

const E4_SPEC: ExcelProblemSpec = {
  sheetName: "営業達成判定",
  cols: 4,
  rows: 6,
  headerRows: [1],
  cells: {
    A1: "担当者", B1: "売上実績", C1: "目標額", D1: "判定",
    A2: "佐藤", B2: 120, C2: 100, D2: "",
    A3: "鈴木", B3: 85, C3: 100, D3: "",
    A4: "高橋", B4: 100, C4: 100, D4: "",
    A5: "田中", B5: 92, C5: 100, D5: "",
  },
  targets: [
    { cell: "D2", expected: "達成", requiredTokens: ["IF"], label: "佐藤の判定" },
    { cell: "D3", expected: "未達", requiredTokens: ["IF"], label: "鈴木の判定" },
    { cell: "D4", expected: "達成", requiredTokens: ["IF"], label: "高橋の判定（同額は達成）" },
    { cell: "D5", expected: "未達", requiredTokens: ["IF"], label: "田中の判定" },
  ],
};

const E5_SPEC: ExcelProblemSpec = {
  sheetName: "障害チケット調査",
  cols: 5,
  rows: 7,
  headerRows: [1],
  cells: {
    A1: "チケットID", B1: "ステータス", C1: "", D1: "集計項目", E1: "件数",
    A2: "INC-01", B2: "対応中", C2: "", D2: "対応中の件数", E2: "",
    A3: "INC-02", B3: "完了", C3: "", D3: "完了の件数", E3: "",
    A4: "INC-03", B4: "未着手", C4: "", D4: "未着手の件数", E4: "",
    A5: "INC-04", B5: "対応中", C5: "", D5: "", E5: "",
    A6: "INC-05", B6: "完了", C6: "", D6: "", E6: "",
    A7: "INC-06", B7: "対応中", C7: "", D7: "", E7: "",
  },
  targets: [
    { cell: "E2", expected: 3, requiredTokens: ["COUNTIF"], label: "対応中の件数" },
    { cell: "E3", expected: 2, requiredTokens: ["COUNTIF"], label: "完了の件数" },
    { cell: "E4", expected: 1, requiredTokens: ["COUNTIF"], label: "未着手の件数" },
  ],
};

const E6_SPEC: ExcelProblemSpec = {
  sheetName: "部署別経費集計",
  cols: 5,
  rows: 7,
  headerRows: [1],
  cells: {
    A1: "部署", B1: "経費（円）", C1: "", D1: "部署名", E1: "部署合計",
    A2: "開発部", B2: 45000, C2: "", D2: "開発部", E2: "",
    A3: "営業部", B3: 18000, C3: "", D3: "営業部", E3: "",
    A4: "開発部", B4: 32000, C4: "", D4: "総務部", E4: "",
    A5: "総務部", B5: 12000, C5: "", D5: "", E5: "",
    A6: "営業部", B6: 27000, C6: "", D6: "", E6: "",
    A7: "開発部", B7: 15000, C7: "", D7: "", E7: "",
  },
  targets: [
    { cell: "E2", expected: 92000, requiredTokens: ["SUMIF"], label: "開発部の合計" },
    { cell: "E3", expected: 45000, requiredTokens: ["SUMIF"], label: "営業部の合計" },
    { cell: "E4", expected: 12000, requiredTokens: ["SUMIF"], label: "総務部の合計" },
  ],
};

const E7_SPEC: ExcelProblemSpec = {
  sheetName: "注文マスタ参照",
  cols: 6,
  rows: 6,
  headerRows: [1],
  cells: {
    A1: "注文コード", B1: "商品名", C1: "単価", D1: "マスタCD", E1: "マスタ商品名", F1: "マスタ単価",
    A2: "P002", B2: "", C2: "", D2: "P001", E2: "ノートPC", F2: 110000,
    A3: "P003", B3: "", C3: "", D3: "P002", E3: "モニター", F3: 28000,
    A4: "P001", B4: "", C4: "", D4: "P003", E4: "キーボード", F4: 9500,
  },
  targets: [
    { cell: "B2", expected: "モニター", requiredTokens: ["VLOOKUP"], label: "P002の商品名" },
    { cell: "C2", expected: 28000, requiredTokens: ["VLOOKUP"], label: "P002の単価" },
    { cell: "B3", expected: "キーボード", requiredTokens: ["VLOOKUP"], label: "P003の商品名" },
    { cell: "C3", expected: 9500, requiredTokens: ["VLOOKUP"], label: "P003の単価" },
    { cell: "B4", expected: "ノートPC", requiredTokens: ["VLOOKUP"], label: "P001の商品名" },
    { cell: "C4", expected: 110000, requiredTokens: ["VLOOKUP"], label: "P001の単価" },
  ],
};

const E8_SPEC: ExcelProblemSpec = {
  sheetName: "XLOOKUP社員検索",
  cols: 5,
  rows: 5,
  headerRows: [1],
  cells: {
    A1: "検索ID", B1: "氏名", C1: "社員氏名", D1: "社員ID", E1: "部署",
    A2: "E102", B2: "", C2: "山田太郎", D2: "E101", E2: "開発部",
    A3: "E103", B3: "", C3: "佐藤花子", D3: "E102", E3: "営業部",
    A4: "E999", B4: "", C4: "鈴木一郎", D4: "E103", E4: "人事部",
  },
  targets: [
    { cell: "B2", expected: "佐藤花子", requiredTokens: ["XLOOKUP"], label: "E102の氏名（左方向検索）" },
    { cell: "B3", expected: "鈴木一郎", requiredTokens: ["XLOOKUP"], label: "E103の氏名" },
    { cell: "B4", expected: "該当なし", requiredTokens: ["XLOOKUP"], label: "E999の未存在時フォールバック" },
  ],
};

const E9_SPEC: ExcelProblemSpec = {
  sheetName: "エラー処理",
  cols: 6,
  rows: 5,
  headerRows: [1],
  cells: {
    A1: "商品CD", B1: "商品名", C1: "売上/件数", D1: "マスタCD", E1: "マスタ名", F1: "",
    A2: "A01", B2: "", C2: 0, D2: "A01", E2: "クラウドS", F2: "",
    A3: "A99", B3: "", C3: "", D3: "A02", E3: "クラウドM", F3: "",
    A4: "売上", B4: 50000, C4: "件数", D4: 0, E4: "客単価", F4: "",
  },
  targets: [
    { cell: "B2", expected: "クラウドS", requiredTokens: ["IFERROR", "VLOOKUP"], label: "A01取得（正常）" },
    { cell: "B3", expected: "未登録", requiredTokens: ["IFERROR", "VLOOKUP"], label: "A99エラー時は「未登録」" },
    { cell: "F4", expected: 0, requiredTokens: ["IFERROR"], label: "0除算時は 0 を表示" },
  ],
};

const E10_SPEC: ExcelProblemSpec = {
  sheetName: "データ整形",
  cols: 4,
  rows: 5,
  headerRows: [1],
  cells: {
    A1: "社員コード", B1: "氏名", C1: "部署略称(先頭3文字)", D1: "表示名（略称-氏名）",
    A2: "DEV-001", B2: "山田", C2: "", D2: "",
    A3: "SLS-014", B3: "佐藤", C3: "", D3: "",
    A4: "HRD-008", B4: "鈴木", C4: "", D4: "",
  },
  targets: [
    { cell: "C2", expected: "DEV", requiredTokens: ["LEFT"], label: "先頭3文字抽出（DEV）" },
    { cell: "C3", expected: "SLS", requiredTokens: ["LEFT"], label: "先頭3文字抽出（SLS）" },
    { cell: "D2", expected: "DEV-山田", label: "表示名結合（C2&\"-\"&B2 等）" },
    { cell: "D3", expected: "SLS-佐藤", label: "表示名結合（C3&\"-\"&B3 等）" },
  ],
};

const E11_SPEC: ExcelProblemSpec = {
  sheetName: "発注・納品突合",
  cols: 6,
  rows: 6,
  headerRows: [1],
  cells: {
    A1: "発注ID", B1: "発注数", C1: "納品数(突合)", D1: "突合結果", E1: "納品側ID", F1: "納品側数量",
    A2: "ORD-01", B2: 10, C2: "", D2: "", E2: "ORD-01", F2: 10,
    A3: "ORD-02", B3: 20, C3: "", D3: "", E3: "ORD-02", F3: 18,
    A4: "ORD-03", B4: 15, C4: "", D4: "", E4: "ORD-04", F4: 5,
  },
  targets: [
    { cell: "C2", expected: 10, requiredTokens: ["VLOOKUP"], label: "ORD-01の納品数" },
    { cell: "C3", expected: 18, requiredTokens: ["VLOOKUP"], label: "ORD-02の納品数" },
    { cell: "C4", expected: 0, requiredTokens: ["IFERROR"], label: "ORD-03（未納品は0）" },
    { cell: "D2", expected: "一致", requiredTokens: ["IF"], label: "ORD-01突合判定" },
    { cell: "D3", expected: "差異あり", requiredTokens: ["IF"], label: "ORD-02突合判定" },
    { cell: "D4", expected: "差異あり", requiredTokens: ["IF"], label: "ORD-03突合判定" },
  ],
};

const E12_SPEC: ExcelProblemSpec = {
  sheetName: "月次報告サマリー",
  cols: 6,
  rows: 7,
  headerRows: [1],
  cells: {
    A1: "カテゴリ", B1: "売上", C1: "", D1: "レポート項目", E1: "実績", F1: "判定(目標500)",
    A2: "SaaS", B2: 320, C2: "", D2: "SaaS合計", E2: "", F2: "",
    A3: "受託", B3: 280, C3: "", D3: "受託合計", E3: "", F3: "",
    A4: "SaaS", B4: 240, C4: "", D4: "全社合計", E4: "", F4: "",
    A5: "受託", B5: 160, C5: "", D5: "1件平均売上", E5: "", F5: "",
  },
  targets: [
    { cell: "E2", expected: 560, requiredTokens: ["SUMIF"], label: "SaaS合計（SUMIF）" },
    { cell: "E3", expected: 440, requiredTokens: ["SUMIF"], label: "受託合計（SUMIF）" },
    { cell: "E4", expected: 1000, requiredTokens: ["SUM"], label: "全社合計（SUM）" },
    { cell: "E5", expected: 250, requiredTokens: ["AVERAGE"], label: "1件平均売上（AVERAGE）" },
    { cell: "F2", expected: "達成", requiredTokens: ["IF"], label: "SaaS目標500達成判定" },
    { cell: "F3", expected: "未達", requiredTokens: ["IF"], label: "受託目標500達成判定" },
  ],
};

export const EXCEL_PROBLEMS: SeedProblem[] = [
  {
    id: "44444444-4444-4444-8444-444444441201",
    lesson_id: "33333333-3333-4333-8333-333333331201",
    chapter_id: "22222222-2222-4222-8222-222222221201",
    language: "excel",
    title: "Excel 1-1：四則演算とSUM関数で売上明細を集計しよう",
    description_md: `## 課題：売上明細の小計と合計を数式で計算する

Excelのすべての数式は **\`=\`（イコール）** から始まります。
手計算した数字を直接入力するのではなく、**セル番地を参照する数式** を入力すると、単価や数量が変わっても自動で再計算されます。

### 入力するセル（黄色ハイライト）
1. **\`D2\`〜\`D4\`**：単価（B列）× 数量（C列）を計算する数式（例：\`=B2*C2\`）
2. **\`D5\`**：\`SUM\` 関数を使って \`D2\` から \`D4\` の合計を計算する数式（例：\`=SUM(D2:D4)\`）`,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["Excel", "四則演算", "SUM"],
    starter_code: excelJson(E1_SPEC),
    solution_code: JSON.stringify({ D2: "=B2*C2", D3: "=B3*C3", D4: "=B4*C4", D5: "=SUM(D2:D4)" }),
    explanation_md: "`=B2*C2` のようにセル番地で掛算し、最後に `=SUM(D2:D4)` で範囲合計するのがExcel集計の基本形です。",
    order_index: 1,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "掛け算の記号は `×` ではなく半角アスタリスク `*` を使います。" },
      { step_number: 2, content_md: "合計は `=SUM(開始セル:終了セル)` の形式で記述します。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441202",
    lesson_id: "33333333-3333-4333-8333-333333331201",
    chapter_id: "22222222-2222-4222-8222-222222221201",
    language: "excel",
    title: "Excel 1-2：SUM・AVERAGE・MAX・MINで店舗売上を分析しよう",
    description_md: `## 課題：5店舗の売上データから4つの基本統計量を算出する

実務の報告資料では、合計だけでなく「平均・最大・最小」を並べて傾向を把握します。

### 入力するセル（範囲は \`B2:B6\`）
- **\`D2\`**：合計売上（\`SUM\`）
- **\`D3\`**：平均売上（\`AVERAGE\`）
- **\`D4\`**：最高売上（\`MAX\`）
- **\`D5\`**：最低売上（\`MIN\`）`,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["Excel", "AVERAGE", "MAX", "MIN"],
    starter_code: excelJson(E2_SPEC),
    solution_code: JSON.stringify({
      D2: "=SUM(B2:B6)",
      D3: "=AVERAGE(B2:B6)",
      D4: "=MAX(B2:B6)",
      D5: "=MIN(B2:B6)",
    }),
    explanation_md: "4大基本関数 `SUM`, `AVERAGE`, `MAX`, `MIN` はいずれも `(開始セル:終了セル)` の範囲を引数にとります。",
    order_index: 2,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "対象データは `B2` から `B6` です。`B2:B6` を各関数の括弧内に入れます。" },
      { step_number: 2, content_md: "平均は `AVERAGE`、最大は `MAX`、最小は `MIN` を使用します。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441203",
    lesson_id: "33333333-3333-4333-8333-333333331201",
    chapter_id: "22222222-2222-4222-8222-222222221201",
    language: "excel",
    title: "Excel 1-3：絶対参照（$B$1）で消費税込み価格を計算しよう",
    description_md: `## 課題：税率セルを固定して税込価格を求める

数式を下の行へコピーしたとき、参照先がズレてほしくないセルには **\`$\` を付けて絶対参照（\`$B$1\`）** にします。

### 入力するセル
- **\`C4\`〜\`C6\`**：税抜価格 × \`(1 + $B$1)\` で税込価格を計算してください。
- ※必ず **\`$B$1\`** を数式内に含めてください。`,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["Excel", "絶対参照"],
    starter_code: excelJson(E3_SPEC),
    solution_code: JSON.stringify({
      C4: "=B4*(1+$B$1)",
      C5: "=B5*(1+$B$1)",
      C6: "=B6*(1+$B$1)",
    }),
    explanation_md: "実務のExcelでは `F4` キーを押すと `B1` → `$B$1` と素早く絶対参照へ切り替えられます。",
    order_index: 3,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "税抜価格に10%上乗せする式は `税抜価格*(1+税率)` です。" },
      { step_number: 2, content_md: "税率セル `B1` を固定するため `$B$1` と書きます。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441204",
    lesson_id: "33333333-3333-4333-8333-333333331202",
    chapter_id: "22222222-2222-4222-8222-222222221202",
    language: "excel",
    title: "Excel 2-1：IF関数で営業目標の「達成／未達」を自動判定しよう",
    description_md: `## 課題：実績が目標以上なら「達成」、未満なら「未達」を表示

\`IF(条件式, 真のときの値, 偽のときの値)\` を使うと、データの条件に応じた自動ラベル付けができます。

### 入力するセル
- **\`D2\`〜\`D5\`**：売上実績（B列）が目標額（C列）**以上（\`>=\`）**なら \`"達成"\`、そうでなければ \`"未達"\` を表示する \`IF\` 式を入力してください。`,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["Excel", "IF関数"],
    starter_code: excelJson(E4_SPEC),
    solution_code: JSON.stringify({
      D2: '=IF(B2>=C2,"達成","未達")',
      D3: '=IF(B3>=C3,"達成","未達")',
      D4: '=IF(B4>=C4,"達成","未達")',
      D5: '=IF(B5>=C5,"達成","未達")',
    }),
    explanation_md: "文字列を数式内で指定するときは必ず半角ダブルクォーテーション `\"達成\"` で囲みます。",
    order_index: 4,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "「以上」を表す比較演算子は `>=` です（同額も含みます）。" },
      { step_number: 2, content_md: '構文は `=IF(条件, "達成", "未達")` です。' },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441205",
    lesson_id: "33333333-3333-4333-8333-333333331202",
    chapter_id: "22222222-2222-4222-8222-222222221202",
    language: "excel",
    title: "Excel 2-2：COUNTIF関数で障害チケットのステータス別件数を調査しよう",
    description_md: `## 課題：条件に一致するセルの個数を数える

運用保守やテスト進捗報告では「対応中が何件、完了が何件か」を一覧から即座に数える作業が頻出します。
\`COUNTIF(範囲, 条件)\` を使いましょう。

### 入力するセル（対象範囲は \`$B$2:$B$7\`）
- **\`E2\`**：「対応中」の件数
- **\`E3\`**：「完了」の件数
- **\`E4\`**：「未着手」の件数`,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["Excel", "COUNTIF", "データ調査"],
    starter_code: excelJson(E5_SPEC),
    solution_code: JSON.stringify({
      E2: '=COUNTIF($B$2:$B$7,"対応中")',
      E3: '=COUNTIF($B$2:$B$7,"完了")',
      E4: '=COUNTIF($B$2:$B$7,"未着手")',
    }),
    explanation_md: "`COUNTIF` を使うと行が増えても正確にステータス別の件数をリアルタイム把握できます。",
    order_index: 5,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "第1引数にステータス列の範囲 `B2:B7`、第2引数に探したい文字列を入れます。" },
      { step_number: 2, content_md: '例：`=COUNTIF($B$2:$B$7, "対応中")` のように記述します。' },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441206",
    lesson_id: "33333333-3333-4333-8333-333333331202",
    chapter_id: "22222222-2222-4222-8222-222222221202",
    language: "excel",
    title: "Excel 2-3：SUMIF関数で部署別の経費合計を自動集計しよう",
    description_md: `## 課題：指定した条件の行だけ合計する

\`SUMIF(検索範囲, 条件, 合計範囲)\` を使うと、明細表から部署別・カテゴリ別の金額を一瞬で集計できます。

### 入力するセル
- **\`E2\`**：\`D2\`（開発部）に一致する経費合計
- **\`E3\`**：\`D3\`（営業部）に一致する経費合計
- **\`E4\`**：\`D4\`（総務部）に一致する経費合計`,
    difficulty: "medium",
    estimated_minutes: 20,
    tags: ["Excel", "SUMIF", "集計"],
    starter_code: excelJson(E6_SPEC),
    solution_code: JSON.stringify({
      E2: "=SUMIF($A$2:$A$7,D2,$B$2:$B$7)",
      E3: "=SUMIF($A$2:$A$7,D3,$B$2:$B$7)",
      E4: "=SUMIF($A$2:$A$7,D4,$B$2:$B$7)",
    }),
    explanation_md: "条件にセル参照（`D2`）を使い、検索範囲と合計範囲を絶対参照にすると、何十部署あってもコピー1回で集計表が完成します。",
    order_index: 6,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "`SUMIF` の引数は `(部署の範囲, 部署名セル, 金額の範囲)` の3つです。" },
      { step_number: 2, content_md: "部署の範囲は `$A$2:$A$7`、金額の範囲は `$B$2:$B$7` です。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441207",
    lesson_id: "33333333-3333-4333-8333-333333331203",
    chapter_id: "22222222-2222-4222-8222-222222221203",
    language: "excel",
    title: "Excel 3-1：VLOOKUP関数でマスタ表から商品名と単価を引こう",
    description_md: `## 課題：実務最強の参照関数 VLOOKUP を習得する

\`\`\`mermaid
flowchart LR
    Key["注文コード（A2: P002）"] --> Search["マスタ表の左端（D列）から一致行を検索"]
    Search --> Col2["2列目（E列）→ 商品名を取得"]
    Search --> Col3["3列目（F列）→ 単価を取得"]
\`\`\`

\`VLOOKUP(検索値, マスタ範囲, 列番号, FALSE)\` ※完全一致のため第4引数は必ず **\`FALSE\`**（または \`0\`）にします。

### 入力するセル（マスタ範囲は \`$D$2:$F$4\`）
- **\`B2\`〜\`B4\`**：注文コードに対応する商品名（マスタの2列目）
- **\`C2\`〜\`C4\`**：注文コードに対応する単価（マスタの3列目）`,
    difficulty: "medium",
    estimated_minutes: 20,
    tags: ["Excel", "VLOOKUP", "マスタ参照"],
    starter_code: excelJson(E7_SPEC),
    solution_code: JSON.stringify({
      B2: "=VLOOKUP(A2,$D$2:$F$4,2,FALSE)",
      C2: "=VLOOKUP(A2,$D$2:$F$4,3,FALSE)",
      B3: "=VLOOKUP(A3,$D$2:$F$4,2,FALSE)",
      C3: "=VLOOKUP(A3,$D$2:$F$4,3,FALSE)",
      B4: "=VLOOKUP(A4,$D$2:$F$4,2,FALSE)",
      C4: "=VLOOKUP(A4,$D$2:$F$4,3,FALSE)",
    }),
    explanation_md: "`VLOOKUP` の第4引数を省略すると近似一致（意図しない値）になるため、実務では必ず `FALSE`（完全一致）を指定します。",
    order_index: 7,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "検索値は `A2`、マスタ範囲は `$D$2:$F$4` です。" },
      { step_number: 2, content_md: "商品名は範囲の左から2列目、単価は3列目です。第4引数には `FALSE` を指定します。" },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441208",
    lesson_id: "33333333-3333-4333-8333-333333331203",
    chapter_id: "22222222-2222-4222-8222-222222221203",
    language: "excel",
    title: "Excel 3-2：XLOOKUP関数で左方向の列参照と未存在時表示を行おう",
    description_md: `## 課題：VLOOKUPの弱点を克服する XLOOKUP

\`VLOOKUP\` は「検索キーより左にある列」を取得できませんが、モダンExcelの **\`XLOOKUP\`** は左右どちらの列でも取得でき、見つからないときの代替文字も第4引数で指定できます。

構文：\`=XLOOKUP(検索値, 検索範囲, 戻り範囲, "見つからないときの文字")\`

### 入力するセル
- **\`B2\`〜\`B4\`**：\`D2:D4\`（社員ID）から \`A2\`〜\`A4\` を探し、左隣の \`C2:C4\`（社員氏名）を取得してください。
- 見つからない場合（\`E999\`）は **\`"該当なし"\`** と表示してください。`,
    difficulty: "medium",
    estimated_minutes: 20,
    tags: ["Excel", "XLOOKUP"],
    starter_code: excelJson(E8_SPEC),
    solution_code: JSON.stringify({
      B2: '=XLOOKUP(A2,$D$2:$D$4,$C$2:$C$4,"該当なし")',
      B3: '=XLOOKUP(A3,$D$2:$D$4,$C$2:$C$4,"該当なし")',
      B4: '=XLOOKUP(A4,$D$2:$D$4,$C$2:$C$4,"該当なし")',
    }),
    explanation_md: "`XLOOKUP` は列を挿入しても列番号ズレが起きず、エラー処理も1つの関数で完結するため現在の実務で主流になっています。",
    order_index: 8,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "検索範囲は `$D$2:$D$4`、戻り範囲は `$C$2:$C$4` です。" },
      { step_number: 2, content_md: '第4引数に `"該当なし"` を指定すると、未存在時に `#N/A` の代わりに表示されます。' },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441209",
    lesson_id: "33333333-3333-4333-8333-333333331203",
    chapter_id: "22222222-2222-4222-8222-222222221203",
    language: "excel",
    title: "Excel 3-3：IFERROR関数で #N/A や #DIV/0! エラーを綺麗に処理しよう",
    description_md: `## 課題：報告資料からエラー表示をなくす

上司や顧客に提出するExcelシートに \`#N/A\` や \`#DIV/0!\` が残っていると、SUM集計まで壊れてしまいます。
\`IFERROR(元の数式, エラー時の値)\` で安全にラップしましょう。

### 入力するセル
1. **\`B2\`・\`B3\`**：\`VLOOKUP\` でマスタ（\`$D$2:$E$3\`）の2列目を引き、エラー時は **\`"未登録"\`** を表示
2. **\`F4\`**：売上（\`B4\`）÷ 件数（\`D4\`）を計算し、0除算エラー時は **\`0\`** を表示`,
    difficulty: "medium",
    estimated_minutes: 20,
    tags: ["Excel", "IFERROR", "エラー処理"],
    starter_code: excelJson(E9_SPEC),
    solution_code: JSON.stringify({
      B2: '=IFERROR(VLOOKUP(A2,$D$2:$E$3,2,FALSE),"未登録")',
      B3: '=IFERROR(VLOOKUP(A3,$D$2:$E$3,2,FALSE),"未登録")',
      F4: "=IFERROR(B4/D4,0)",
    }),
    explanation_md: "エラーが出ても後続の集計が止まらないよう、割り算やVLOOKUPには `IFERROR` をセットで使うのが実務の定石です。",
    order_index: 9,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "`IFERROR` の第1引数に通常の `VLOOKUP` や `B4/D4` をそのまま入れます。" },
      { step_number: 2, content_md: '第2引数にエラー時の代替値（`"未登録"` や `0`）を指定します。' },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441210",
    lesson_id: "33333333-3333-4333-8333-333333331204",
    chapter_id: "22222222-2222-4222-8222-222222221204",
    language: "excel",
    title: "Excel 4-1：LEFT関数と文字列結合でマスタデータを整形しよう",
    description_md: `## 課題：CSVやシステム出力データのクレンジング

システムから出力したCSVデータ（例：\`DEV-001\`）から部署略称を取り出したり、表示用のラベルを組み立てる作業は調査・移行業務でよく発生します。

### 入力するセル
1. **\`C2\`・\`C3\`**：\`LEFT\` 関数を使って社員コード（A列）の **先頭3文字** を抽出（例：\`DEV\`）
2. **\`D2\`・\`D3\`**：C列の略称とハイフン \`"-"\` とB列の氏名を結合して \`"DEV-山田"\` の形式を作成（\`&\` 演算子 または \`CONCAT\` 関数）`,
    difficulty: "medium",
    estimated_minutes: 20,
    tags: ["Excel", "LEFT", "文字列処理"],
    starter_code: excelJson(E10_SPEC),
    solution_code: JSON.stringify({
      C2: "=LEFT(A2,3)",
      C3: "=LEFT(A3,3)",
      D2: '=C2&"-"&B2',
      D3: '=C3&"-"&B3',
    }),
    explanation_md: "`LEFT`, `RIGHT`, `MID`, `&`（または `CONCAT`）を使いこなすと、数千行のデータ加工が一瞬で終わります。",
    order_index: 10,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "左から3文字取り出す関数は `=LEFT(A2, 3)` です。" },
      { step_number: 2, content_md: '文字をつなぐときは `=C2&"-"&B2` のように `&` で連結できます。' },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441211",
    lesson_id: "33333333-3333-4333-8333-333333331204",
    chapter_id: "22222222-2222-4222-8222-222222221204",
    language: "excel",
    title: "Excel 4-2：【実務突合】発注データと納品データの差異を自動検知しよう",
    description_md: `## 課題：2つのデータ表を突合（照合）して不一致を見つける

実務で最もよく頼まれる作業の一つが **「2つのシステム／シートの突合（とつごう）」** です。

\`\`\`mermaid
flowchart LR
    Order["発注データ（A〜B列）"] --> Lookup["VLOOKUP + IFERROR で<br/>納品データ（E〜F列）を照合"]
    Lookup --> Diff{"発注数 = 納品数？"}
    Diff -->|同じ| OK["一致"]
    Diff -->|違う・未納品| NG["差異あり"]
\`\`\`

### 入力するセル
1. **\`C2\`〜\`C4\`**：\`IFERROR\`＋\`VLOOKUP\` で発注ID（A列）に対応する納品側数量（\`$E$2:$F$4\` の2列目）を取得。未納品（エラー）の場合は **\`0\`** にする。
2. **\`D2\`〜\`D4\`**：\`IF\` 関数で \`B列 = C列\` なら **\`"一致"\`**、違えば **\`"差異あり"\`** を表示。`,
    difficulty: "hard",
    estimated_minutes: 25,
    tags: ["Excel", "突合", "VLOOKUP", "IFERROR", "IF"],
    starter_code: excelJson(E11_SPEC),
    solution_code: JSON.stringify({
      C2: "=IFERROR(VLOOKUP(A2,$E$2:$F$4,2,FALSE),0)",
      C3: "=IFERROR(VLOOKUP(A3,$E$2:$F$4,2,FALSE),0)",
      C4: "=IFERROR(VLOOKUP(A4,$E$2:$F$4,2,FALSE),0)",
      D2: '=IF(B2=C2,"一致","差異あり")',
      D3: '=IF(B3=C3,"一致","差異あり")',
      D4: '=IF(B4=C4,"一致","差異あり")',
    }),
    explanation_md: "「データ移行前後の件数・金額突合」や「テスト結果と期待値の突合」はエンジニア実務でも毎週のように使う鉄板テクニックです。",
    order_index: 11,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: "C列は `=IFERROR(VLOOKUP(A2,$E$2:$F$4,2,FALSE), 0)` の形にすると未納品が0になります。" },
      { step_number: 2, content_md: 'D列は発注数と納品数を比較する `=IF(B2=C2, "一致", "差異あり")` です。' },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444441212",
    lesson_id: "33333333-3333-4333-8333-333333331204",
    chapter_id: "22222222-2222-4222-8222-222222221204",
    language: "excel",
    title: "Excel 4-3：【総合演習】月次売上報告サマリー表を完成させよう",
    description_md: `## 総合課題：経営会議向けの月次サマリーレポートを作成する

これまで学んだ関数を総動員して、明細（\`A2:B5\`）から右側のサマリー表を完成させましょう。

### 入力するセル
- **\`E2\`**：\`SUMIF\` で「SaaS」カテゴリの売上合計を算出
- **\`E3\`**：\`SUMIF\` で「受託」カテゴリの売上合計を算出
- **\`E4\`**：\`SUM\` で全社売上合計（\`B2:B5\`）を算出
- **\`E5\`**：\`AVERAGE\` で1件あたりの平均売上（\`B2:B5\`）を算出
- **\`F2\`・\`F3\`**：\`IF\` で実績が **500以上** なら \`"達成"\`、未満なら \`"未達"\` を表示`,
    difficulty: "hard",
    estimated_minutes: 25,
    tags: ["Excel", "総合演習", "報告レポート"],
    starter_code: excelJson(E12_SPEC),
    solution_code: JSON.stringify({
      E2: '=SUMIF($A$2:$A$5,"SaaS",$B$2:$B$5)',
      E3: '=SUMIF($A$2:$A$5,"受託",$B$2:$B$5)',
      E4: "=SUM(B2:B5)",
      E5: "=AVERAGE(B2:B5)",
      F2: '=IF(E2>=500,"達成","未達")',
      F3: '=IF(E3>=500,"達成","未達")',
    }),
    explanation_md: "おめでとうございます！これで実務の調査・突合・報告レポート作成に必要なExcelスキルが一通り揃いました。次はHTML＆CSSでWeb画面作りに進みましょう。",
    order_index: 12,
    test_cases: [],
    hints: [
      { step_number: 1, content_md: 'E2は `=SUMIF($A$2:$A$5, "SaaS", $B$2:$B$5)`、E3は `"受託"` を条件にします。' },
      { step_number: 2, content_md: 'F列は `=IF(E2>=500, "達成", "未達")` のように目標500と比較します。' },
    ],
  },
];
