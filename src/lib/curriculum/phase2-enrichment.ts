/**
 * ファイル概要：
 * 第2フェーズ（Day 31〜Day 60：Java実務基礎）全30日分の詳細解説・理解度確認テスト・提出課題定義
 */

import type { CurriculumDay } from "@/types/curriculum";
import { EXTRA_JAVA_PROBLEM_IDS } from "@/lib/java-curriculum-problems";

type DayEnrichment = Partial<
  Pick<
    CurriculumDay,
    "status" | "problemIds" | "lessonContentMd" | "quizzes" | "deliverable"
  >
>;

export const PHASE2_ENRICHMENTS: Record<number, DayEnrichment> = {
  31: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.intArrayListSearch],
    lessonContentMd: `### List と ArrayList
通常の配列は生成後に長さを変えられませんが、\`ArrayList\` は要素の追加・削除に応じて自動的にサイズが伸縮します。実務のJava開発で最も頻繁に使うコレクションです。

\`\`\`java
ArrayList<String> list = new ArrayList<>();
list.add("ACME");
list.add("NextSys");
System.out.println(list.size()); // 2
System.out.println(list.get(0)); // ACME
\`\`\`

### よく使うメソッド
- \`add(value)\`：末尾へ追加
- \`get(index)\`：指定位置を取得（0始まり）
- \`size()\`：要素数を取得（配列の \`length\` と混同しないこと）
- \`remove(index)\`：指定位置を削除`,
    quizzes: [
      {
        id: "q-d31-1",
        type: "multiple_choice",
        question: "`ArrayList` の要素数を取得する正しいメソッドはどれですか？",
        choices: ["list.length", "list.length()", "list.size()", "list.count()"],
        correctIndex: 2,
        explanation: "配列は `.length`、Stringは `.length()`、Collection（List/Map/Set）は `.size()` を使います。",
      },
    ],
  },
  32: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.intHashMapSales],
    lessonContentMd: `### Map と HashMap
\`HashMap<K, V>\` は「キー（重複不可）」と「値」をペアで保持するデータ構造です。社員番号から社員名を引く、カテゴリ別に売上を集計するといった処理で高速に動作します。

\`\`\`java
HashMap<String, Integer> sales = new HashMap<>();
sales.put("Food", 500);
int cur = sales.containsKey("Food") ? sales.get("Food") : 0;
sales.put("Food", cur + 800);
\`\`\`

### 注意点
存在しないキーに対して \`get(key)\` を呼ぶと \`null\` が返ります。そのまま \`int\` へ代入すると \`NullPointerException\` になるため、必ず \`containsKey\` 等で確認しましょう。`,
    quizzes: [
      {
        id: "q-d32-1",
        type: "multiple_choice",
        question: "`HashMap` で存在しないキーを `get()` したときの戻り値はどれですか？",
        choices: ["0", "空文字 \"\"", "null", "必ず例外が発生する"],
        correctIndex: 2,
        explanation: "キーが存在しない場合、`HashMap#get` は `null` を返します。",
      },
    ],
  },
  33: {
    status: "published",
    lessonContentMd: `### Set（HashSet）と重複データの扱い
\`HashSet<E>\` は **同じ要素の重複を許さない** コレクションです。
- 登録済みメールアドレスの重複チェック
- 対象タグの一覧抽出（ユニーク化）
といった業務要件でよく使われます。

\`\`\`java
HashSet<String> emails = new HashSet<>();
emails.add("a@example.com");
emails.add("a@example.com"); // 重複は無視される
System.out.println(emails.size()); // 1
\`\`\``,
    quizzes: [
      {
        id: "q-d33-1",
        type: "output_prediction",
        question: "`HashSet<String>` に `\"Java\"`, `\"SQL\"`, `\"Java\"` の順で `add` した場合、`size()` はいくつになりますか？",
        choices: ["1", "2", "3", "コンパイルエラー"],
        correctIndex: 1,
        explanation: "`HashSet` は重複要素を保持しないため、要素数は `2`（Java, SQL）になります。",
      },
    ],
  },
  34: {
    status: "published",
    lessonContentMd: `### ジェネリクスと拡張for文（for-each）
- **ジェネリクス（\`<String>\` 等）**：コレクションに入れられる型をコンパイル時に制限し、実行時の型エラーを防ぎます。
- **拡張for文**：添字を使わずに全要素を順番に取り出せる簡潔な構文です。

\`\`\`java
for (String name : customers) {
    System.out.println(name);
}
\`\`\``,
    quizzes: [
      {
        id: "q-d34-1",
        type: "multiple_choice",
        question: "ジェネリクス（例：`List<String>`）を使う最大のメリットはどれですか？",
        choices: [
          "実行速度が10倍になる",
          "異なる型のデータが誤って混入するのをコンパイル時に防げる",
          "メモリ使用量が半分になる",
          "null を一切扱わなくなる",
        ],
        correctIndex: 1,
        explanation: "ジェネリクスにより型安全性が保証され、実行時の ClassCastException を未然に防げます。",
      },
    ],
  },
  35: {
    status: "published",
    problemIds: [
      EXTRA_JAVA_PROBLEM_IDS.intArrayListSearch,
      EXTRA_JAVA_PROBLEM_IDS.intHashMapSales,
    ],
    lessonContentMd: `### 第5週総合演習：コレクションによる顧客・売上データ管理
今週学んだ \`ArrayList\` と \`HashMap\` を使い分け、検索フィルタリングとカテゴリ別集計の2題を自力で解き切りましょう。`,
  },
  36: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.intCsvParse],
    lessonContentMd: `### String の主要メソッド
業務データ（入力フォーム・CSV・APIリクエスト）の整形では以下のメソッドが必須です。
- \`trim()\`：前後の空白・改行を除去
- \`split(",")\`：区切り文字で配列に分割
- \`contains("abc")\`：部分一致チェック
- \`equals("abc")\`：完全一致チェック（\`==\` は禁止）
- \`substring(start, end)\`：部分文字列の切り出し`,
    quizzes: [
      {
        id: "q-d36-1",
        type: "output_prediction",
        question: "`\"  Java  \".trim().length()` の結果はいくつですか？",
        choices: ["4", "6", "8", "0"],
        correctIndex: 0,
        explanation: "`trim()` で前後空白が除去され `\"Java\"` になるため、長さは `4` です。",
      },
    ],
  },
  37: {
    status: "published",
    lessonContentMd: `### StringBuilder と日時処理（LocalDate）
- **\`StringBuilder\`**：\`String\` は不変（イミュータブル）のため、ループ内で \`+\` 結合を繰り返すと毎回新しいオブジェクトが生成されます。大量結合時は \`StringBuilder#append\` を使います。
- **\`LocalDate\`（java.time）**：Java 8以降の標準日付APIです。\`LocalDate.now()\`、\`LocalDate.of(2025, 4, 1)\`、\`plusDays(7)\` 等で安全に日付計算ができます。`,
    quizzes: [
      {
        id: "q-d37-1",
        type: "multiple_choice",
        question: "ループ内で数千回文字列を連結する場合、パフォーマンス面で推奨されるクラスはどれですか？",
        choices: ["String", "StringBuilder", "Character", "Object"],
        correctIndex: 1,
        explanation: "可変バッファを持つ `StringBuilder` を使うことで不要な一時オブジェクト生成を防げます。",
      },
    ],
  },
  38: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.intExceptionStock],
    lessonContentMd: `### 例外の種類と try-catch-finally
- **非検査例外（RuntimeException系）**：\`NullPointerException\`, \`IllegalArgumentException\`, \`ArrayIndexOutOfBoundsException\` 等。
- **検査例外（Checked Exception）**：\`IOException\`, \`SQLException\` 等（\`try-catch\` または \`throws\` が必須）。
- **\`finally\` ブロック**：例外が起きても起きなくても必ず実行される後始末処理を書きます。`,
    quizzes: [
      {
        id: "q-d38-1",
        type: "multiple_choice",
        question: "`try-catch-finally` 構文で、例外が発生しなかった場合に実行されるブロックはどれですか？",
        choices: [
          "try のみ",
          "try と catch",
          "try と finally",
          "finally のみ",
        ],
        correctIndex: 2,
        explanation: "`finally` は例外の有無にかかわらず必ず実行されます。",
      },
    ],
  },
  39: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.intExceptionStock],
    lessonContentMd: `### throw / throws と独自例外設計
- \`throw new IllegalArgumentException("メッセージ");\`：意図的に例外を発生させる
- \`throws IOException\`：メソッド内で処理せず呼び出し元へ例外を委譲する
実務では \`CustomerNotFoundException\` のように業務エラー専用の独自例外クラスを定義し、APIの404レスポンスへ変換します。`,
  },
  40: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.intCsvParse],
    lessonContentMd: `### ファイル入出力とCSVデータ処理
実際の業務では \`Files.readAllLines(Path.of("orders.csv"))\` や \`BufferedReader\` でファイルを1行ずつ読み込み、\`split(",")\` で列を抽出して集計・DB登録を行います。
ブラウザ演習では標準入力をCSVストリームに見立てて、パース・空白除去・数値変換・合計集計を実装しましょう。`,
  },
  41: {
    status: "published",
    lessonContentMd: `### デバッグ・スタックトレース・エラー調査手順
エラーが出たときに焦らず原因を特定する3ステップを習得しましょう。
1. **例外クラス名とメッセージを読む**（例：\`NullPointerException\` なのか \`NumberFormatException\` なのか）
2. **スタックトレースで自分のコードの行番号を探す**（\`at Main.java:14\` のように発生箇所が書かれている）
3. **直前の変数の値を確認する**（入力値・null・配列添字・境界値）`,
    quizzes: [
      {
        id: "q-d41-1",
        type: "error_spot",
        question: "`Integer.parseInt(\" 100 \")` を実行したときに発生する例外はどれですか？",
        choices: [
          "NullPointerException",
          "NumberFormatException",
          "ArithmeticException",
          "ClassCastException",
        ],
        correctIndex: 1,
        explanation: "空白が残った文字列は整数に変換できないため `NumberFormatException` になります。事前に `trim()` が必要です。",
      },
    ],
  },
  42: {
    status: "published",
    problemIds: [
      EXTRA_JAVA_PROBLEM_IDS.intCsvParse,
      EXTRA_JAVA_PROBLEM_IDS.intExceptionStock,
    ],
    lessonContentMd: `### 第6週総合実技課題：文字列処理・CSV・例外制御
今週学んだ文字列API・CSVパース・例外スロー＆キャッチを総動員して、異常データでも安全に振る舞うプログラムを完成させましょう。`,
  },
  43: {
    status: "published",
    lessonContentMd: `### JDK / IDE / Maven とプロジェクト構成
- **JDK（Java Development Kit）**：コンパイラ（\`javac\`）や実行環境（JVM）を含む開発キット
- **Maven（\`pom.xml\`）**：Spring Boot や PostgreSQL ドライバ等の外部ライブラリ依存関係とビルドを自動管理するツール
- **標準ディレクトリ構成**：
  - \`src/main/java\`：本番ソースコード
  - \`src/main/resources\`：設定ファイル（\`application.yml\` 等）
  - \`src/test/java\`：JUnitテストコード`,
    quizzes: [
      {
        id: "q-d43-1",
        type: "multiple_choice",
        question: "Mavenプロジェクトで依存ライブラリやビルド設定を記述するファイルはどれですか？",
        choices: ["package.json", "pom.xml", "build.ini", "java.config"],
        correctIndex: 1,
        explanation: "Mavenではプロジェクト直下の `pom.xml` に依存関係やプラグインを定義します。",
      },
    ],
  },
  44: {
    status: "published",
    lessonContentMd: `### package / import とコード分割
実務のJavaプロジェクトでは役割ごとにパッケージを分けます（例：\`com.example.crm.controller\`, \`service\`, \`repository\`, \`entity\`）。
別パッケージのクラスを使うときに先頭へ \`import\` を記述します。`,
    quizzes: [
      {
        id: "q-d44-1",
        type: "multiple_choice",
        question: "同じプロジェクト内でクラス名の衝突を防ぎ、機能ごとに整理するための仕組みはどれですか？",
        choices: ["package", "static", "extends", "override"],
        correctIndex: 0,
        explanation: "`package` 宣言によって名前空間とディレクトリ構造を整理します。",
      },
    ],
  },
  45: {
    status: "published",
    lessonContentMd: `### Gitの基本操作（commit / push / pull）
チーム開発では必ずGitで変更履歴を管理します。
- \`git status\`：現在の変更状態を確認
- \`git commit -m "メッセージ"\`：変更を履歴として記録
- \`git push\` / \`git pull\`：リモートリポジトリ（GitHub等）との送受信
下のビジュアルGit演習で、コマンド操作と履歴グラフの変化を体感しましょう。`,
  },
  46: {
    status: "published",
    lessonContentMd: `### ブランチ運用・マージ・Pull Request・競合の基本
実務では \`main\` ブランチを直接編集せず、\`feature/xxx\` ブランチを切って作業し、Pull Request（PR）でコードレビューを受けてからマージします。
同じファイルの同じ行を2人が同時に変更した場合は **コンフリクト（競合）** が発生するため、双方の意図を確認して手動解消します。`,
  },
  47: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.advBoundaryTest],
    lessonContentMd: `### JUnitによる単体テストの考え方
**単体テスト（Unit Test）** は、メソッド単位で仕様通りに動くことを自動検証する仕組みです。
基本の **AAAパターン** を覚えましょう：
1. **Arrange（準備）**：テストデータや対象クラスを用意
2. **Act（実行）**：テスト対象メソッドを呼び出す
3. **Assert（検証）**：\`assertEquals(期待値, 実測値)\` で結果を検証`,
    quizzes: [
      {
        id: "q-d47-1",
        type: "multiple_choice",
        question: "JUnit 5 でテストメソッドであることを示すアノテーションはどれですか？",
        choices: ["@Run", "@Test", "@Check", "@Unit"],
        correctIndex: 1,
        explanation: "JUnit 5 ではテストメソッドに `@Test` アノテーションを付与します。",
      },
    ],
  },
  48: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.advBoundaryTest],
    lessonContentMd: `### 正常系・異常系・境界値テスト
条件が「18歳以上65歳以下」の場合、バグが潜みやすいのは境界の前後（\`17\`, \`18\`, \`65\`, \`66\`）と異常値（\`-1\`）です。これらを網羅するテスト設計力を養いましょう。`,
    quizzes: [
      {
        id: "q-d48-1",
        type: "multiple_choice",
        question: "「18歳以上65歳以下」の仕様に対する境界値テストデータとして最も重要な組み合わせはどれですか？",
        choices: [
          "20, 30, 40, 50",
          "17, 18, 65, 66",
          "0, 50, 100",
          "18 と 65 のみ",
        ],
        correctIndex: 1,
        explanation: "境界の内側と外側（下限-1, 下限, 上限, 上限+1）をテストすることで `>` と `>=` のバグを確実に検出できます。",
      },
    ],
  },
  49: {
    status: "published",
    lessonContentMd: `### 第7週実務演習：GitとJUnitを使用した開発サイクル
ローカル環境で作業ブランチを切り、対象メソッドの実装とJUnitテスト（正常系・異常系・境界値）を作成してGitHubへPR提出してみましょう。`,
    deliverable: {
      title: "Gitブランチ＋JUnit単体テスト演習 提出",
      overview:
        "featureブランチでクラス実装およびJUnit 5テストケースを作成し、リポジトリURLと `mvn test` の実行結果を提出してください。",
      requiredItems: [
        "作業ブランチでのコミット履歴（GitHub URL）",
        "正常系・異常系・境界値を含むJUnitテストコード",
        "`mvn test` の全件PASS結果",
      ],
      evaluationCriteria: [
        "コミットメッセージが変更内容を適切に表しているか",
        "境界値・異常系が漏れなく検証されているか",
      ],
    },
  },
  50: {
    status: "published",
    lessonContentMd: `### RDBの基本（テーブル・主キー・外部キー）
- **テーブル**：行（レコード）と列（カラム）で表すデータの入れ物
- **主キー（Primary Key）**：行を一意に識別する列（重複不可・NULL不可）
- **外部キー（Foreign Key）**：別テーブルの主キーを参照し、データ整合性を保つ制約`,
    quizzes: [
      {
        id: "q-d50-1",
        type: "multiple_choice",
        question: "RDBの主キー（Primary Key）が満たすべき制約として正しいものはどれですか？",
        choices: [
          "重複してもよいが NULL は不可",
          "重複不可 かつ NULL 不可",
          "必ず文字列型でなければならない",
          "1テーブルに必ず2列以上必要",
        ],
        correctIndex: 1,
        explanation: "主キーは各レコードを一意に特定するため、一意性（重複不可）と非NULL制約の両方を満たします。",
      },
    ],
  },
  51: {
    status: "published",
    lessonContentMd: `### SQL基礎：SELECT / WHERE / ORDER BY
データベースから必要なデータを取り出す基本構文です。
\`\`\`sql
SELECT name, salary
FROM employees
WHERE department = 'Engineering'
ORDER BY salary DESC
LIMIT 3;
\`\`\`
下のSQL自動採点演習で実際にクエリを書いて確認しましょう。`,
  },
  52: {
    status: "published",
    lessonContentMd: `### SQLデータ更新：INSERT / UPDATE / DELETE
- \`INSERT INTO customers (name, email) VALUES ('ACME', 'hr@acme.jp');\`
- \`UPDATE customers SET name = 'ACME Inc.' WHERE id = 1;\`
- \`DELETE FROM customers WHERE id = 1;\`

### 現場で絶対に気をつけること
\`UPDATE\` や \`DELETE\` で **\`WHERE\` 句を書き忘れるとテーブル全件が書き換わる／消える大事故** になります。必ず先に同じ \`WHERE\` 条件で \`SELECT\` を実行して対象件数を確認する習慣をつけましょう。`,
    quizzes: [
      {
        id: "q-d52-1",
        type: "multiple_choice",
        question: "`UPDATE customers SET status = 'INACTIVE';` のように `WHERE` 句なしで実行するとどうなりますか？",
        choices: [
          "構文エラーになる",
          "1件目だけ更新される",
          "customers テーブルの全レコードが更新される",
          "何も更新されない",
        ],
        correctIndex: 2,
        explanation: "`WHERE` 句を省略するとテーブル内の全行が更新対象になります。",
      },
    ],
  },
  53: {
    status: "published",
    lessonContentMd: `### JavaとDBの接続（JDBC）
**JDBC** はJavaから各種RDB（PostgreSQL / MySQL等）へ接続する標準APIです。
- \`DriverManager.getConnection(url, user, pass)\` で接続を取得
- **\`try-with-resources\`** を使い、処理終了後に \`Connection\` / \`PreparedStatement\` / \`ResultSet\` を確実にクローズしてコネクションリークを防ぎます。`,
    deliverable: {
      title: "JDBC接続・SELECT取得コード提出",
      overview: "try-with-resources を用いてDBから顧客一覧を取得するJDBC実装コードを提出してください。",
      requiredItems: [
        "try-with-resources によるリソース自動解放",
        "ResultSet からのカラム値マッピング",
      ],
      evaluationCriteria: [
        "コネクション・ステートメントのクローズ漏れがないか",
        "SQLException のハンドリングが適切か",
      ],
    },
  },
  54: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.advCustomerDao],
    lessonContentMd: `### PreparedStatement と DAO パターン
- **\`PreparedStatement\`**：プレースホルダ \`?\` にバインド変数を設定することで **SQLインジェクション攻撃を根本防御** します（SQL文字列を \`+\` で連結してはいけません）。
- **DAO（Data Access Object）**：DBアクセス処理を専用クラスへ分離する設計パターンです。下の演習でDAOクラスを実装しましょう。`,
    quizzes: [
      {
        id: "q-d54-1",
        type: "multiple_choice",
        question: "SQLインジェクション対策として `Statement` ではなく `PreparedStatement` を使う理由はどれですか？",
        choices: [
          "SQL文を短く書けるから",
          "入力値をSQL構文ではなく単なるデータ（バインド変数）として安全に扱うから",
          "PostgreSQL専用だから",
          "トランザクションが不要になるから",
        ],
        correctIndex: 1,
        explanation: "バインド変数（`?`）を使うことで、入力値に含まれるシングルクォート等がSQL命令として解釈されるのを防ぎます。",
      },
    ],
  },
  55: {
    status: "published",
    lessonContentMd: `### トランザクション（commit / rollback）
銀行の振込処理のように「出金と入金が両方成功して初めて確定し、途中で失敗したら全部元に戻す」仕組みを **トランザクション** といいます。
- \`conn.setAutoCommit(false);\`
- 正常完了時：\`conn.commit();\`
- 例外発生時：\`conn.rollback();\`
Spring Boot では \`@Transactional\` アノテーションで宣言的に管理します。`,
    quizzes: [
      {
        id: "q-d55-1",
        type: "multiple_choice",
        question: "トランザクション処理の途中で例外が発生した際、これまでの変更をすべて取り消して元の状態に戻す操作はどれですか？",
        choices: ["commit", "rollback", "flush", "truncate"],
        correctIndex: 1,
        explanation: "`rollback` によってトランザクション開始前の整合性のある状態へ戻します。",
      },
    ],
  },
  56: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.advCustomerDao],
    lessonContentMd: `### 第8週総合課題：Javaによる顧客管理CRUD
DAOパターン・PreparedStatement・トランザクションの知識を統合し、顧客管理の登録・参照・更新・削除（CRUD）を実装しましょう。`,
    deliverable: {
      title: "Java顧客管理CRUD（DAO実装）提出",
      overview: "CustomerDao を使った登録・一覧・更新・削除の実装コードまたはGitHub URLを提出してください。",
      requiredItems: ["CustomerDao（CRUD4操作）", "PreparedStatementまたはインメモリ検証コード"],
      evaluationCriteria: ["SQLインジェクション対策・責務分離が適切か"],
    },
  },
  57: {
    status: "published",
    lessonContentMd: `### Webアプリケーションの仕組みとHTTP
ブラウザ（クライアント）とSpring Boot（サーバー）は **HTTP** で通信します。
実務で必須のHTTPステータスコード：
- \`200 OK\`：取得・更新成功
- \`201 Created\`：新規登録成功
- \`400 Bad Request\`：入力バリデーションエラー
- \`401 Unauthorized\` / \`403 Forbidden\`：未認証 / 権限不足
- \`404 Not Found\`：対象リソースが存在しない
- \`500 Internal Server Error\`：サーバー内部エラー`,
    quizzes: [
      {
        id: "q-d57-1",
        type: "multiple_choice",
        question: "APIリクエストの入力値チェック（必須項目抜けなど）でエラーとなった場合に返す標準的なHTTPステータスコードはどれですか？",
        choices: ["200", "201", "400", "500"],
        correctIndex: 2,
        explanation: "クライアント側の入力不備は `400 Bad Request` を返します。",
      },
    ],
  },
  58: {
    status: "published",
    lessonContentMd: `### REST API・JSON・HTTPメソッド
REST APIではURLでリソース（名詞の複数形：\`/api/customers\`）を表し、HTTPメソッドで操作を表します。
- \`GET /api/customers\`：一覧取得
- \`POST /api/customers\`：新規作成
- \`PUT /api/customers/{id}\`：更新
- \`DELETE /api/customers/{id}\`：削除`,
    quizzes: [
      {
        id: "q-d58-1",
        type: "multiple_choice",
        question: "REST APIで新しい顧客リソースを登録するときに使用するHTTPメソッドはどれですか？",
        choices: ["GET", "POST", "DELETE", "HEAD"],
        correctIndex: 1,
        explanation: "新規リソースの作成には `POST` メソッドを使用します。",
      },
    ],
  },
  59: {
    status: "published",
    lessonContentMd: `### Spring Boot の概要とレイヤードアーキテクチャ
Spring Boot は Java 実務開発のデファクトスタンダードフレームワークです。
3層（レイヤード）構成で責務を分離します：
1. **Controller層**：HTTPリクエスト受付・バリデーション・レスポンス返却
2. **Service層**：業務ロジック・トランザクション管理（\`@Transactional\`）
3. **Repository層**：データベースへの永続化・検索`,
    quizzes: [
      {
        id: "q-d59-1",
        type: "multiple_choice",
        question: "Spring Bootの3層構造で、業務ロジックやトランザクション制御を担当する層はどれですか？",
        choices: ["Controller層", "Service層", "Repository層", "View層"],
        correctIndex: 1,
        explanation: "Controllerは入出力受付、RepositoryはDB操作、Service層が業務ロジックとトランザクションを担います。",
      },
    ],
  },
  60: {
    status: "published",
    problemIds: [
      EXTRA_JAVA_PROBLEM_IDS.intArrayListSearch,
      EXTRA_JAVA_PROBLEM_IDS.intHashMapSales,
      EXTRA_JAVA_PROBLEM_IDS.intExceptionStock,
      EXTRA_JAVA_PROBLEM_IDS.advCustomerDao,
    ],
    lessonContentMd: `### 第2回実技試験（Java実務基礎：Day 31〜60 到達度確認）
第2フェーズの修了試験です。コレクション・例外処理・DAO設計の実装と理解度テストに合格し、いよいよ第3フェーズ（Spring Boot実務開発）へ進みましょう！`,
    quizzes: [
      {
        id: "q-d60-1",
        type: "multiple_choice",
        question: "PreparedStatement を使う主な目的はどれですか？",
        choices: ["画面デザインを整える", "SQLインジェクションを防ぐ", "Gitのマージを自動化する", "メモリを初期化する"],
        correctIndex: 1,
        explanation: "プレースホルダによるバインドでSQLインジェクションを防止します。",
      },
      {
        id: "q-d60-2",
        type: "multiple_choice",
        question: "REST APIで指定IDの顧客が存在しなかった場合に返すべきHTTPステータスコードはどれですか？",
        choices: ["200", "201", "404", "503"],
        correctIndex: 2,
        explanation: "対象リソース未存在の場合は `404 Not Found` を返します。",
      },
    ],
  },
};
