/**
 * ファイル概要：
 * 第3フェーズ（Day 61〜Day 90：Spring Boot・顧客案件管理システム実務模擬プロジェクト）
 * 全30日分の詳細解説・理解度確認テスト・実務成果物提出課題を定義
 */

import type { CurriculumDay } from "@/types/curriculum";
import { EXTRA_JAVA_PROBLEM_IDS } from "@/lib/java-curriculum-problems";

type DayEnrichment = Partial<
  Pick<
    CurriculumDay,
    "status" | "problemIds" | "lessonContentMd" | "quizzes" | "deliverable"
  >
>;

export const PHASE3_ENRICHMENTS: Record<number, DayEnrichment> = {
  61: {
    status: "published",
    lessonContentMd: `### Controller と GET API（@RestController / @GetMapping）
Spring Boot でJSONを返すAPIエンドポイントを作るには、クラスに \`@RestController\`、メソッドに \`@GetMapping\` を付けます。

\`\`\`java
@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    @GetMapping
    public List<CustomerDto> findAll() {
        return List.of(new CustomerDto(1L, "ACMEテクノロジーズ"));
    }
}
\`\`\`

ローカルPCで起動し、\`curl http://localhost:8080/api/customers\` でJSONが返ることを確認して提出しましょう。`,
    deliverable: {
      title: "Day 61: GET API 実装提出",
      overview: "@RestController + @GetMapping でJSONレスポンスを返すAPIを実装し、コードとcurl実行結果を提出してください。",
      requiredItems: ["CustomerController.java", "curl または Postman での200 OKレスポンス結果"],
      evaluationCriteria: ["エンドポイントURLとJSON構造が適切か"],
    },
  },
  62: {
    status: "published",
    lessonContentMd: `### @PathVariable と @RequestParam の使い分け
- **\`@PathVariable\`**：特定リソースのID指定（例：\`GET /api/customers/42\` → \`@GetMapping("/{id}")\`）
- **\`@RequestParam\`**：検索フィルタやページング条件（例：\`GET /api/customers?keyword=ACME\`）`,
    quizzes: [
      {
        id: "q-d62-1",
        type: "multiple_choice",
        question: "URL `GET /api/customers?keyword=Tech` の `keyword` を受け取るSpringアノテーションはどれですか？",
        choices: ["@PathVariable", "@RequestParam", "@RequestBody", "@RequestHeader"],
        correctIndex: 1,
        explanation: "クエリパラメータ（`?key=value`）は `@RequestParam` で受け取ります。",
      },
    ],
  },
  63: {
    status: "published",
    lessonContentMd: `### POST・@RequestBody・JSONデシリアライズ
クライアントから送信されたJSONボディをJavaのDTOオブジェクトへ自動変換するのが \`@RequestBody\` です。
新規作成成功時は \`ResponseEntity.status(HttpStatus.CREATED).body(created)\` で **\`201 Created\`** を返すのがベストプラクティスです。`,
  },
  64: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.advApiValidation],
    lessonContentMd: `### 入力値のバリデーション（Bean Validation）
リクエストDTOのフィールドに \`@NotBlank\`, \`@Email\`, \`@Size(max = 100)\` などを付与し、Controller引数に \`@Valid\` を付けることで自動検証できます。
まずは下のブラウザ演習で「複数エラーをまとめて400で返すバリデーションロジック」を実装し、ローカルSpring Bootにも適用しましょう。`,
  },
  65: {
    status: "published",
    lessonContentMd: `### Service層・DI（依存性注入）・責務分担
Controller に業務ロジックやDB操作を書くと肥大化しテスト困難になります。
\`@Service\` クラスを作成し、Controllerの **コンストラクタインジェクション**（\`private final CustomerService service;\`）で注入するのがSpring Bootの推奨設計です。`,
    quizzes: [
      {
        id: "q-d65-1",
        type: "multiple_choice",
        question: "Spring Bootで最も推奨されているDI（依存性注入）の方式はどれですか？",
        choices: [
          "フィールドインジェクション（@Autowired on field）",
          "コンストラクタインジェクション（private final フィールド）",
          "static変数への直接代入",
          "new 演算子での毎回生成",
        ],
        correctIndex: 1,
        explanation: "コンストラクタインジェクションは不変性（final）と単体テスト時のモック差し替えの容易さを両立できます。",
      },
    ],
  },
  66: {
    status: "published",
    lessonContentMd: `### Repository層とDB接続（Spring Data JPA / PostgreSQL）
\`JpaRepository<Customer, Long>\` を継承したインターフェースを定義するだけで、\`findAll\`, \`findById\`, \`save\`, \`deleteById\` が自動生成されます。\`application.yml\` にPostgreSQL接続情報を設定して疎通しましょう。`,
  },
  67: {
    status: "published",
    lessonContentMd: `### 第9週総合課題：PUT / DELETE を含むCRUD API完成
GET（一覧・詳細）・POST（登録）・PUT（更新）・DELETE（削除）の5エンドポイントをすべて実装し、PostgreSQLと連動するCRUD APIを提出してください。`,
    deliverable: {
      title: "Day 67: Spring Boot 基本CRUD API一式 提出",
      overview: "Controller / Service / Repository 3層構成のCRUD APIを実装し、GitHubリポジトリURLと全5エンドポイントの動作確認エビデンスを提出してください。",
      requiredItems: [
        "GET一覧 / GET詳細 / POST / PUT / DELETE の実装",
        "PostgreSQLとの永続化確認結果",
      ],
      evaluationCriteria: [
        "3層分離とDIが適切に実装されているか",
        "HTTPステータスコードが仕様通りか",
      ],
    },
  },
  68: {
    status: "published",
    lessonContentMd: `### 共通例外ハンドリング（@RestControllerAdvice）
各Controllerに \`try-catch\` を重複記述せず、\`@RestControllerAdvice\`＋\`@ExceptionHandler\` で独自例外やバリデーション例外を一元的にキャッチし、統一フォーマットのエラーJSON（code / message / details）を返却します。`,
  },
  69: {
    status: "published",
    lessonContentMd: `### ログ出力と障害調査（SLF4J / Logback）
本番環境では \`System.out.println\` を使わず、**SLF4J**（\`log.info\`, \`log.warn\`, \`log.error\`）を使用します。
- \`INFO\`：重要な業務イベント（登録完了など）
- \`WARN\`：想定内の業務エラー（入力不備など）
- \`ERROR\`：想定外の障害（DB接続断など、スタックトレースを必ず出力）
※パスワードや個人情報をログへ出力しないよう注意しましょう。`,
  },
  70: {
    status: "published",
    lessonContentMd: `### API仕様書とリクエスト・レスポンス設計
フロントエンドや他社システムと連携するため、エンドポイント・HTTPメソッド・リクエストJSON・レスポンスJSON・エラーコード一覧をAPI仕様書（Markdown / OpenAPI）として整理する手法を学びます。`,
  },
  71: {
    status: "published",
    lessonContentMd: `### Spring Boot の単体テスト
Service層の業務ロジックをJUnit 5で高速に検証します。DBを起動せずJVM上だけで数ミリ秒で実行できるため、リファクタリング時の安全網になります。`,
  },
  72: {
    status: "published",
    lessonContentMd: `### Mockitoによる依存関係のモック化
\`@ExtendWith(MockitoExtension.class)\`、\`@Mock\`、\`@InjectMocks\` を使い、Repository の戻り値を \`when(repo.findById(1L)).thenReturn(Optional.of(c))\` で偽装してServiceの正常系・異常系（未存在時の404例外等）を網羅テストします。`,
    quizzes: [
      {
        id: "q-d72-1",
        type: "multiple_choice",
        question: "Mockitoでモック化したRepositoryのメソッドが1回呼ばれたことを検証するメソッドはどれですか？",
        choices: ["assertCalled()", "verify(repo, times(1)).save(...)", "checkMock()", "expect()"],
        correctIndex: 1,
        explanation: "`verify(mock, times(1))` によって依存メソッドの呼び出し回数や引数を検証できます。",
      },
    ],
  },
  73: {
    status: "published",
    lessonContentMd: `### APIの結合テスト（MockMvc）
\`@WebMvcTest\` または \`@SpringBootTest\` + \`MockMvc\` を使い、\`mockMvc.perform(post("/api/customers")...)\` でHTTPステータスやJSONパス（\`jsonPath("$.name").value("ACME")\`）を自動検証します。`,
  },
  74: {
    status: "published",
    lessonContentMd: `### 認証（Authentication）と認可（Authorization）の基本
- **認証**：あなたが誰であるかを確認すること（ログインID＋パスワード／JWT検証）
- **認可**：そのユーザーに操作権限があるか確認すること（管理者のみ削除可、自社テナントデータのみ閲覧可）`,
    quizzes: [
      {
        id: "q-d74-1",
        type: "multiple_choice",
        question: "「ログイン済みユーザーが管理者専用APIを実行しようとしたが権限不足で拒否された」ときに返すHTTPステータスコードはどれですか？",
        choices: ["400 Bad Request", "401 Unauthorized", "403 Forbidden", "404 Not Found"],
        correctIndex: 2,
        explanation: "未認証は `401`、認証済みだが権限不足（認可エラー）は `403 Forbidden` を返します。",
      },
    ],
  },
  75: {
    status: "published",
    lessonContentMd: `### Webセキュリティの基礎（OWASP Top 10入門）
実務のJavaエンジニアが最低限防ぐべき4大脆弱性：
1. **SQLインジェクション**：PreparedStatement / JPAパラメータバインドで防御
2. **XSS（クロスサイトスクリプティング）**：HTMLエスケープとCSPで防御
3. **CSRF**：SameSite Cookie / CSRFトークンで防御
4. **認可不備（IDOR）**：連番IDを避け、必ずサーバー側で「操作対象が自社のデータか」を検証`,
    quizzes: [
      {
        id: "q-d75-1",
        type: "multiple_choice",
        question: "他社テナントのIDをURLに直打ちしてデータを盗み見られる脆弱性（IDOR）を防ぐ最も確実な対策はどれですか？",
        choices: [
          "画面上のリンクボタンを非表示にするだけ",
          "ランダムUUID化に加え、サーバー側で必ずログインユーザーの所属企業・権限を検証する",
          "JavaScriptでURLを隠す",
          "HTTPメソッドをPOSTに変えるだけ",
        ],
        correctIndex: 1,
        explanation: "UI制御だけでなく、必ずサーバー側で認可チェックを行うことが必須です。",
      },
    ],
  },
  76: {
    status: "published",
    lessonContentMd: `### コードレビュー・命名規則・リファクタリング
- クラス名は **UpperCamelCase**（\`CustomerService\`）、メソッド・変数名は **lowerCamelCase**（\`findActiveCustomers\`）、定数は **UPPER_SNAKE_CASE**（\`MAX_RETRY_COUNT\`）
- 1メソッドが長くなりすぎたら責務ごとに分割し、マジックナンバーを定数化しましょう。`,
  },
  77: {
    status: "published",
    lessonContentMd: `### 第11週総合演習：Spring Boot総合課題
例外ハンドリング・ログ出力・Mockito単体テスト・MockMvc結合テストまで備えた完成度の高いAPIリポジトリを仕上げましょう。`,
  },
  78: {
    status: "published",
    lessonContentMd: `### 要件定義書・基本設計書の読み方（顧客・案件管理システム）
最終模擬プロジェクト **「顧客・案件管理システム（CRM Mini）」** の要件定義を確認します。
- **顧客管理**：一覧・検索・詳細・登録・更新・削除（論理/物理）
- **案件管理**：顧客に紐づく案件の登録・一覧・ステータス管理（\`OPEN\` / \`WON\` / \`LOST\`）
- **非機能要件**：入力バリデーション、統一エラー応答、単体・結合テストカバレッジ`,
  },
  79: {
    status: "published",
    lessonContentMd: `### テーブル定義書・API設計書の作成
模擬プロジェクトの2テーブルを設計します：
1. \`customers (id, name, email, phone, created_at, updated_at)\`
2. \`deals (id, customer_id FK, title, status, budget, created_at)\`
設計書（Markdown）をリポジトリの \`docs/\` 配下に作成して提出しましょう。`,
  },
  80: {
    status: "published",
    lessonContentMd: `### Gitブランチ戦略とプロジェクト初期セットアップ
\`main\` から \`develop\`（または機能ごとに \`feature/xxx\`）を切るブランチ運用と、Spring Initializr によるプロジェクト初期化（Web / Data JPA / Validation / PostgreSQL / Test）を完了させましょう。`,
  },
  81: {
    status: "published",
    lessonContentMd: `### DB設計・DDL適用・Entity/Repository実装
PostgreSQLへ \`customers\` / \`deals\` テーブルを作成するSQL（Flyway または \`schema.sql\`）と、対応するJPA Entity / Repository を実装します。`,
  },
  82: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.advDealService],
  },
  83: {
    status: "published",
    lessonContentMd: `### 顧客更新・削除APIおよび案件管理API実装
- \`PUT /api/customers/{id}\`（存在しないIDは \`404\`）
- \`DELETE /api/customers/{id}\`（\`204 No Content\`）
- \`POST /api/customers/{id}/deals\` / \`GET /api/customers/{id}/deals\`（顧客に紐づく案件登録・一覧）`,
    deliverable: {
      title: "Day 83: 顧客更新・削除・案件API 実装提出",
      overview: "PUT / DELETE および顧客紐付けの案件登録・一覧APIを実装し、PR URLと動作確認結果を提出してください。",
      requiredItems: ["PUT / DELETE 実装", "案件登録・一覧API実装", "動作確認エビデンス"],
      evaluationCriteria: ["存在しないIDへの404応答・外部キー整合性が守られているか"],
    },
  },
  84: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.advApiValidation],
    lessonContentMd: `### バリデーション・共通エラーハンドリング実装
顧客名必須・メール形式・予算0以上などの Bean Validation と \`@RestControllerAdvice\` による統一エラーJSON応答を模擬プロジェクトへ組み込みます。`,
  },
  85: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.advBoundaryTest],
    lessonContentMd: `### 単体テスト・結合テストの作成（最終プロジェクト品質担保）
Service層のMockito単体テスト（正常系・404異常系・境界値）と、Controller層のMockMvc結合テストを作成し、\`mvn test\` 全件グリーンを確認して提出しましょう。`,
    deliverable: {
      title: "Day 85: 最終プロジェクト 単体・結合テスト提出",
      overview: "Service単体テスト・MockMvc結合テストを実装し、`mvn test` の全件合格ログを提出してください。",
      requiredItems: ["CustomerServiceTest / DealServiceTest", "Controller MockMvcテスト", "`mvn test` 成功ログ"],
      evaluationCriteria: ["正常系・400/404異常系・境界値がテストされているか"],
      isMandatoryForGraduation: true,
    },
  },
  86: {
    status: "published",
    lessonContentMd: `### 不具合票を使用したバグ修正演習
現場では以下のような **不具合票** を受け取って対応します：
> **【不具合票 #BUG-101】**
> - 現象：顧客検索API（\`GET /api/customers?keyword=\`）で空文字や前後空白を渡すと0件になる／大文字小文字でヒットしない
> - 期待結果：前後空白をトリムし、空文字なら全件返却、大文字小文字を区別せず部分一致検索できること

1. まず再現テストを書く → 2. 原因箇所を修正する → 3. 回帰テストがすべて通ることを確認 → 4. \`fix/bug-101\` ブランチでPR提出！`,
    deliverable: {
      title: "Day 86: 不具合票 #BUG-101 バグ修正PR提出",
      overview: "再現テストの追加・原因調査メモ・修正コミットのPR URLを提出してください。",
      requiredItems: ["原因分析メモ", "修正コードPR URL", "回帰テスト結果"],
      evaluationCriteria: ["再発防止のテストが追加されているか"],
    },
  },
  87: {
    status: "published",
    lessonContentMd: `### 仕様変更に伴う機能改修演習
現場では開発途中の仕様変更が日常茶飯事です：
> **【仕様変更依頼 #CHG-201】**
> - 要件：顧客一覧レスポンスに「その顧客の受注済み（\`WON\`）案件数と合計予算」を追加したい。

既存APIの後方互換性を壊さないよう、影響範囲（DTO / Service / Repository / テスト）を洗い出してから安全に改修しましょう。`,
  },
  88: {
    status: "published",
    lessonContentMd: `### Pull Request 作成とコードレビュー対応
良いPRには以下を必ず書きます：
1. **変更の概要（何を・なぜ変えたか）**
2. **影響範囲と動作確認方法**
3. **テスト結果（\`mvn test\` 全件PASS）**
研修担当者からのレビュー指摘に対し、修正コミットを積んで承認（Approve）＆マージまで完遂しましょう。`,
  },
  89: {
    status: "published",
    lessonContentMd: `### 成果物の説明・90日間の振り返り
明日の最終評価に向けて、開発した「顧客・案件管理システム」について以下を5分間で説明できるよう整理します：
- システム構成（Controller / Service / Repository / DBテーブル）
- 苦労したエラーや不具合調査で学んだこと
- テスト設計で工夫した点`,
  },
  90: {
    status: "published",
    problemIds: [
      EXTRA_JAVA_PROBLEM_IDS.advCustomerDao,
      EXTRA_JAVA_PROBLEM_IDS.advApiValidation,
      EXTRA_JAVA_PROBLEM_IDS.advDealService,
      EXTRA_JAVA_PROBLEM_IDS.advBoundaryTest,
    ],
    lessonContentMd: `### Day 90：最終実技試験・100点満点スキル判定・修了評価
90日間お疲れさまでした！最終成果物の最終提出と、企業研修担当者による **100点満点評価（80点以上 かつ 最終実務課題のCRUD・テスト合格で修了）** を受けましょう。`,
    deliverable: {
      title: "Day 90: 最終実務プロジェクト（顧客・案件管理システム）最終提出",
      overview:
        "完成した顧客・案件管理システムの最終GitHubリポジトリURL、API動作確認結果、テスト全件合格エビデンス、振り返りコメントを提出してください。",
      requiredItems: [
        "最終リポジトリURL（README・設計書含む）",
        "CRUD API全エンドポイント動作確認エビデンス",
        "単体・結合テスト全件合格結果",
        "90日間の振り返り・自己評価",
      ],
      evaluationCriteria: [
        "Java基本文法・OOP（20点） / 標準API・コレクション（10点）",
        "SQL・DB連携（10点） / Spring Boot・API開発（20点）",
        "Git・開発フロー（10点） / JUnit・テスト（10点）",
        "最終実務課題の完成度・必須CRUD＋テスト合格（20点）",
      ],
      isMandatoryForGraduation: true,
    },
  },
};
