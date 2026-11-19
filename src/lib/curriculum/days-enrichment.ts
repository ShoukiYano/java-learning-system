/**
 * ファイル概要：
 * 90日間カリキュラムの各Dayに、拡充した解説教材・理解度テスト・新規Java演習問題を紐付けるエンリッチメント定義
 */

import type { CurriculumDay } from "@/types/curriculum";

export const DAY_ENRICHMENTS: Record<
  number,
  Partial<Pick<CurriculumDay, "status" | "problemIds" | "lessonContentMd" | "quizzes">>
> = {
  3: {
    status: "published",
    problemIds: ["44444444-4444-4444-8444-444444444701"],
    lessonContentMd: `### 変数と基本データ型
Javaでは値を入れる箱（**変数**）を作るときに、必ず「何のデータを入れるか（**型**）」を指定します。

| 型 | 扱うデータ | 例 |
|---|---|---|
| \`int\` | 整数 | \`int age = 25;\` |
| \`double\` | 小数 | \`double score = 4.5;\` |
| \`boolean\` | 真偽値（true / false） | \`boolean active = true;\` |
| \`String\` | 文字列（参照型） | \`String name = "Tanaka";\` |

### 初学者が間違いやすいポイント
- \`String\` の先頭は大文字の \`S\` です。
- 文字列はダブルクォーテーション \`"\`、\`boolean\` の \`true\` / \`false\` はクォーテーションを付けずに書きます。`,
    quizzes: [
      {
        id: "q-d3-1",
        type: "multiple_choice",
        question: "在籍中かどうか（true または false）を保持するのに最も適切なデータ型はどれですか？",
        choices: ["int", "double", "boolean", "char"],
        correctIndex: 2,
        explanation: "真偽値（true / false）を表すデータ型は `boolean` です。",
      },
    ],
  },
  6: {
    status: "published",
    problemIds: ["44444444-4444-4444-8444-444444444702"],
    lessonContentMd: `### Scannerによる標準入力と業務計算
\`Scanner sc = new Scanner(System.in);\` を使うと、キーボードやテストデータから値を受け取れます。
- \`sc.nextInt()\`：整数を1つ読み込む
- \`sc.nextLine()\`：1行まるごと文字列として読み込む

### 金額計算の注意点
\`double\` 型の \`price * 1.1\` は2進数誤差（例: \`330.00000000000006\`）を生むことがあります。実務の金額計算では整数演算 \`(subtotal * 110) / 100\` のように誤差を出さない設計を心がけます。`,
    quizzes: [
      {
        id: "q-d6-1",
        type: "output_prediction",
        question: "`int subtotal = 375;` のとき、`(subtotal * 110) / 100` の計算結果はいくつになりますか？",
        choices: ["412", "412.5", "413", "375"],
        correctIndex: 0,
        explanation: "int同士の除算は小数点以下が切り捨てられるため、`41250 / 100 = 412` になります。",
      },
    ],
  },
  10: {
    status: "published",
    problemIds: ["44444444-4444-4444-8444-444444444703"],
    lessonContentMd: `### 論理演算子（AND / OR / NOT）
複数の条件を組み合わせるときに使います。
- \`A && B\`（AND）：A と B が **両方とも** true のとき true
- \`A || B\`（OR）：A または B の **どちらか一方でも** true のとき true
- \`!A\`（NOT）：true と false を反転`,
    quizzes: [
      {
        id: "q-d10-1",
        type: "multiple_choice",
        question: "「プレミアム会員（isPremium == 1）または 購入金額5000円以上（amount >= 5000）」を正しく表す式はどれですか？",
        choices: [
          "isPremium == 1 && amount >= 5000",
          "isPremium == 1 || amount >= 5000",
          "isPremium = 1 || amount > 5000",
          "!(isPremium == 1 && amount >= 5000)",
        ],
        correctIndex: 1,
        explanation: "「または」は `||`、「以上」は `>=`、等値比較は `==` を使います。",
      },
    ],
  },
  11: {
    status: "published",
    problemIds: ["44444444-4444-4444-8444-444444444704"],
    lessonContentMd: `### switch文とbreakの役割
ステータスコードや区分値など、1つの変数の値で多数の分岐を行う場合は \`switch\` 文が適しています。
各 \`case\` の最後に \`break;\` を書かないと次の \`case\` まで連続実行されてしまうため注意しましょう。`,
  },
  17: {
    status: "published",
    problemIds: ["44444444-4444-4444-8444-444444444711"],
    lessonContentMd: `### 二次元配列と二重forループ
\`int[][] sales = new int[r][c];\` は「\`r\` 行 × \`c\` 列」の表データを表現します。
外側の \`for (int i = 0; i < r; i++)\` で行を選び、内側の \`for (int j = 0; j < c; j++)\` で列を走査するのが基本パターンです。`,
  },
  19: {
    status: "published",
    problemIds: ["44444444-4444-4444-8444-444444444712"],
    lessonContentMd: `### メソッドのオーバーロード
同じ名前でも **引数の個数や型が異なるメソッド** を複数定義できる仕組みを **オーバーロード** と呼びます。呼び出し側の使いやすさを高める実務頻出テクニックです。`,
  },
  25: {
    status: "published",
    problemIds: ["44444444-4444-4444-8444-444444444713"],
    lessonContentMd: `### static フィールドと static メソッド
\`static\` を付けたメンバーはインスタンスごとではなく **クラス全体で1つ共有** されます。連番IDの発行カウンターや共通定数（\`static final\`）によく使われます。`,
  },
  27: {
    status: "published",
    problemIds: ["44444444-4444-4444-8444-444444444714"],
    lessonContentMd: `### インターフェースとポリモーフィズム
\`interface\` で「何ができるか（メソッドの約束）」だけを定義し、複数のクラスが \`implements\` で実装します。呼び出し側はインターフェース型で扱うことで、実装差し替えに強い設計（DIの土台）になります。`,
  },
  31: {
    status: "published",
    problemIds: ["44444444-4444-4444-8444-444444444721"],
    lessonContentMd: `### List と ArrayList
通常の配列はサイズ変更ができませんが、\`ArrayList<String>\` は \`add()\` で自由に要素を追加でき、\`size()\`・\`get(i)\` で参照できます。実務で最もよく使うコレクションです。`,
  },
  32: {
    status: "published",
    problemIds: ["44444444-4444-4444-8444-444444444722"],
    lessonContentMd: `### Map と HashMap
\`HashMap<String, Integer>\` は「キー → 値」のペアを高速に検索・集計できるデータ構造です。\`containsKey\`, \`get\`, \`put\` の3メソッドを確実に使いこなしましょう。`,
  },
  38: {
    status: "published",
    problemIds: ["44444444-4444-4444-8444-444444444724"],
    lessonContentMd: `### 例外処理（try-catch-finally / throw）
業務システムでは、不正入力や在庫不足などの異常系を \`throw new IllegalArgumentException(...)\` 等で明示的に通知し、上位で \`try-catch\` して安全にエラーメッセージへ変換します。`,
  },
  40: {
    status: "published",
    problemIds: ["44444444-4444-4444-8444-444444444723"],
    lessonContentMd: `### CSVデータ処理の基礎
\`line.split(",")\` でカンマ区切りの列に分解し、\`trim()\` で余分な空白を除去した上で \`Integer.parseInt()\` で数値変換する処理は、夜間バッチやデータ取込機能の基本です。`,
  },
  48: {
    status: "published",
    problemIds: ["44444444-4444-4444-8444-444444444734"],
    lessonContentMd: `### 正常系・異常系・境界値テスト
条件が「18歳以上65歳以下」の場合、バグが潜みやすいのは境界の前後（\`17\`, \`18\`, \`65\`, \`66\`）と異常値（\`-1\`）です。これらを網羅するテスト設計力を養いましょう。`,
  },
  54: {
    status: "published",
    problemIds: ["44444444-4444-4444-8444-444444444731"],
    lessonContentMd: `### DAO（Data Access Object）パターン
データの保存・検索・削除（CRUD）を専用のDAOクラスに分離することで、業務ロジックとDB操作を疎結合に保てます。ここではインメモリDAOで基本構造を実装します。`,
  },
  64: {
    status: "published",
    problemIds: ["44444444-4444-4444-8444-444444444732"],
    lessonContentMd: `### REST API 入力バリデーション設計
Spring Boot の Bean Validation（\`@NotBlank\`, \`@Email\` 等）が裏側で行っている「複数項目の入力検証 → エラー一覧を400 Bad Requestで返却」する流れをJavaコードで体得しましょう。`,
  },
  82: {
    problemIds: ["44444444-4444-4444-8444-444444444733"],
  },
};
