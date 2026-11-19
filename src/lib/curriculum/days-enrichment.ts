/**
 * ファイル概要：
 * 90日間カリキュラムのDay別詳細教材・理解度確認テスト・演習問題紐付け定義
 * - 第1フェーズ（Day 1〜Day 30）全30日分を完全公開（解説＋理解度テスト＋演習問題リンク）
 * - 第2・第3フェーズの新規Java中級・上級問題もランダムUUID v4（EXTRA_JAVA_PROBLEM_IDS）で紐付け
 */

import type { CurriculumDay } from "@/types/curriculum";
import { EXTRA_JAVA_PROBLEM_IDS } from "@/lib/java-curriculum-problems";

export const DAY_ENRICHMENTS: Record<
  number,
  Partial<Pick<CurriculumDay, "status" | "problemIds" | "lessonContentMd" | "quizzes">>
> = {
  3: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.introProfile],
    lessonContentMd: `### 変数と基本データ型
Javaでは値を入れる箱（**変数**）を作るときに、必ず「何のデータを入れるか（**型**）」を指定します。

| 型 | 扱うデータ | 例 |
|---|---|---|
| \`int\` | 整数 | \`int age = 25;\` |
| \`double\` | 小数 | \`double score = 4.5;\` |
| \`boolean\` | 真偽値（true / false） | \`boolean active = true;\` |
| \`char\` | 1文字 | \`char rank = 'A';\` |
| \`String\` | 文字列（参照型） | \`String name = "Tanaka";\` |

### 初学者が間違いやすいポイント
- \`String\` の先頭は大文字の \`S\` です。
- \`boolean\` の \`true\` / \`false\` にはダブルクォーテーションを付けません。`,
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
  4: {
    status: "published",
    lessonContentMd: `### String・文字列結合・型変換
\`String\` に対して \`+\` を使うと文字列同士や数値を連結できます。
また、入力文字列 \`"120"\` を計算に使う場合は \`Integer.parseInt("120")\` で \`int\` 型へ変換します。

\`\`\`java
String priceStr = "1200";
int price = Integer.parseInt(priceStr);
System.out.println("価格: " + (price + 100) + "円");
\`\`\`

### 注意点
\`"合計: " + 100 + 200\` は左から評価されるため \`"合計: 100200"\` になります。計算を先に行う場合は \`"合計: " + (100 + 200)\` のように括弧で囲みます。`,
    quizzes: [
      {
        id: "q-d4-1",
        type: "output_prediction",
        question: "`System.out.println(\"Total: \" + 10 + 20);` の実行結果はどれですか？",
        choices: ["Total: 30", "Total: 1020", "Total: 10 20", "コンパイルエラー"],
        correctIndex: 1,
        explanation: "左から文字列結合が行われるため `\"Total: 10\" + 20` となり `Total: 1020` が出力されます。",
      },
    ],
  },
  5: {
    status: "published",
    lessonContentMd: `### 四則演算・剰余演算・計算の優先順位
- \`+\`（加算）、\`-\`（減算）、\`*\`（乗算）、\`/\`（除算）、\`%\`（余り）
- **整数同士の割り算**（例：\`7 / 2\`）は小数点以下が切り捨てられ \`3\` になります。
- 秒数を「時・分・秒」に変換する処理など、実務では \`/\` と \`%\` の組み合わせが頻繁に登場します。`,
    quizzes: [
      {
        id: "q-d5-1",
        type: "output_prediction",
        question: "`int sec = 135;` のとき、`sec / 60` と `sec % 60` の結果はどれですか？",
        choices: ["2 と 15", "2.25 と 15", "2 と 35", "1 と 75"],
        correctIndex: 0,
        explanation: "135 ÷ 60 = 2 余り 15 なので、商は `2`、余りは `15` です。",
      },
    ],
  },
  6: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.introTax],
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
  7: {
    status: "published",
    problemIds: [
      EXTRA_JAVA_PROBLEM_IDS.introProfile,
      EXTRA_JAVA_PROBLEM_IDS.introTax,
    ],
    lessonContentMd: `### 第1週の総復習：出力・変数・演算・Scanner
Day 1〜6 で学んだ以下を振り返りましょう。
1. クラスと \`main\` メソッドの基本構造
2. 適切なデータ型（\`int\`, \`double\`, \`boolean\`, \`String\`）の選択
3. 整数除算・剰余演算 \`%\` を使った業務計算
4. \`Scanner\` による入力値の取得と出力フォーマットの統一

下の復習演習をヒントを見ずに自力でクリアできるか挑戦しましょう！`,
    quizzes: [
      {
        id: "q-d7-1",
        type: "multiple_choice",
        question: "次のうち、Javaのコードとしてコンパイルエラーにならないものはどれですか？",
        choices: [
          "int count = \"10\";",
          "double rate = 0.1;",
          "boolean ok = \"true\";",
          "String title = 100;",
        ],
        correctIndex: 1,
        explanation: "小数リテラル `0.1` を `double` 型に代入する `double rate = 0.1;` だけが正しい型一致です。",
      },
    ],
  },
  8: {
    status: "published",
    lessonContentMd: `### 比較演算子と条件式
条件分岐を書くためには、2つの値を比べて \`true\` または \`false\` を返す **比較演算子** を理解する必要があります。
- 等しい：\`==\`（※\`=\` は代入なので注意！）
- 等しくない：\`!=\`
- 以上・以下：\`>=\`, \`<=\`
- **文字列の比較**は \`==\` ではなく必ず \`str1.equals(str2)\` を使います。`,
    quizzes: [
      {
        id: "q-d8-1",
        type: "multiple_choice",
        question: "Javaで2つのString変数 `a` と `b` の中身が同じか比較する正しい書き方はどれですか？",
        choices: ["a = b", "a == b", "a.equals(b)", "a.same(b)"],
        correctIndex: 2,
        explanation: "参照型であるStringの内容比較には必ず `equals` メソッドを使用します。",
      },
    ],
  },
  9: {
    status: "published",
    lessonContentMd: `### if / else if / else による条件分岐
点数による成績判定や在庫チェックなど、条件に応じて処理を切り替える構文です。
上から順番に条件を評価し、**最初に \`true\` になったブロックだけが実行** されます。

\`\`\`java
if (score >= 80) {
    System.out.println("A");
} else if (score >= 60) {
    System.out.println("B");
} else {
    System.out.println("C");
}
\`\`\``,
    quizzes: [
      {
        id: "q-d9-1",
        type: "output_prediction",
        question: "上のコードで `score = 85` のとき出力される文字はどれですか？",
        choices: ["A", "A と B の両方", "B", "C"],
        correctIndex: 0,
        explanation: "最初の `score >= 80` が true になるため `A` が出力され、以降の `else if` / `else` は実行されません。",
      },
    ],
  },
  10: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.introShipping],
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
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.introHttpSwitch],
    lessonContentMd: `### switch文とbreakの役割
ステータスコードや区分値など、1つの変数の値で多数の分岐を行う場合は \`switch\` 文が適しています。
各 \`case\` の最後に \`break;\` を書かないと次の \`case\` まで連続実行（フォールスルー）してしまうため注意しましょう。`,
    quizzes: [
      {
        id: "q-d11-1",
        type: "multiple_choice",
        question: "switch文でどの `case` にも一致しなかったときに実行されるラベルはどれですか？",
        choices: ["else:", "other:", "default:", "finally:"],
        correctIndex: 2,
        explanation: "どの `case` にも合致しない場合の処理は `default:` に記述します。",
      },
    ],
  },
  12: {
    status: "published",
    lessonContentMd: `### for文による繰り返し処理
決まった回数だけ同じ処理を繰り返すときに \`for\` 文を使います。

\`\`\`java
for (int i = 1; i <= 5; i++) {
    System.out.println(i + "回目");
}
\`\`\`

- \`int i = 1\`：初期化（最初に1回だけ実行）
- \`i <= 5\`：継続条件（trueの間くり返す）
- \`i++\`：更新処理（1周ごとに実行）`,
    quizzes: [
      {
        id: "q-d12-1",
        type: "output_prediction",
        question: "`for (int i = 0; i < 4; i++)` のループ本体は何回実行されますか？",
        choices: ["3回", "4回", "5回", "無限ループ"],
        correctIndex: 1,
        explanation: "`i` は `0, 1, 2, 3` の4回実行され、`i == 4` で終了します。",
      },
    ],
  },
  13: {
    status: "published",
    lessonContentMd: `### while / do-while と break / continue
繰り返す回数が事前に分からない場合（例：数値を10で割り続けて0になるまで各桁を取り出す処理）には \`while\` 文を使います。
- \`break\`：ループを即座に抜ける
- \`continue\`：現在の周回の残り処理をスキップして次の周回へ進む`,
    quizzes: [
      {
        id: "q-d13-1",
        type: "multiple_choice",
        question: "ループ全体を終了するのではなく、その回の残り処理だけ飛ばして次の繰り返しへ進むキーワードはどれですか？",
        choices: ["break", "continue", "return", "skip"],
        correctIndex: 1,
        explanation: "`continue` は現在の反復をスキップして次の反復へ移ります。",
      },
    ],
  },
  14: {
    status: "published",
    lessonContentMd: `### 第2週総合演習：FizzBuzzと条件分岐×ループ
条件の判定順序が非常に重要です。例えば FizzBuzz では **「3と5の両方の倍数（15の倍数）」を最初に判定** しないと、\`3の倍数\` の分岐に先に吸い込まれてしまいます。`,
    quizzes: [
      {
        id: "q-d14-1",
        type: "multiple_choice",
        question: "FizzBuzz問題で `i % 15 == 0` の判定を `i % 3 == 0` より先に書く理由はどれですか？",
        choices: [
          "15の方が大きい数字だから",
          "`i % 3 == 0` を先に書くと15の倍数も `Fizz` と判定されて終わってしまうから",
          "Javaの文法で大きい数から書く決まりだから",
          "実行速度が速くなるから",
        ],
        correctIndex: 1,
        explanation: "`if - else if` は最初に一致した分岐のみ実行されるため、より厳しい条件（両方満たす条件）を先に書きます。",
      },
    ],
  },
  15: {
    status: "published",
    lessonContentMd: `### 配列の宣言・初期化・添字
同じ型のデータをまとめて管理するのが **配列** です。
- 宣言と初期化：\`int[] scores = {80, 95, 70};\` または \`int[] scores = new int[3];\`
- 添字（インデックス）は **0始まり**（先頭は \`scores[0]\`、末尾は \`scores[scores.length - 1]\`）。
- 範囲外へアクセスすると \`ArrayIndexOutOfBoundsException\` が発生します。`,
    quizzes: [
      {
        id: "q-d15-1",
        type: "error_spot",
        question: "要素数3の配列 `int[] a = new int[3];` に対して `a[3] = 10;` と書くとどうなりますか？",
        choices: [
          "4つ目の要素が自動追加される",
          "先頭要素が上書きされる",
          "ArrayIndexOutOfBoundsException が発生する",
          "何も起きない",
        ],
        correctIndex: 2,
        explanation: "要素数3の配列で有効な添字は `0, 1, 2` のみのため、`a[3]` は範囲外例外になります。",
      },
    ],
  },
  16: {
    status: "published",
    lessonContentMd: `### 配列の集計（合計・平均・最大値・最小値）
最大値を求めるときは、初期値を \`0\` ではなく **配列の先頭要素 \`arr[0]\`** にするのが実務の鉄則です（全要素が負の数のとき \`0\` だと誤答になるため）。`,
    quizzes: [
      {
        id: "q-d16-1",
        type: "multiple_choice",
        question: "配列の最大値を求める際、`int max = 0;` ではなく `int max = arr[0];` と初期化する理由はどれですか？",
        choices: [
          "コードが短くなるから",
          "配列の要素がすべて負の値だった場合、`0` だと存在しない最大値0が返ってしまうから",
          "0はint型で使えないから",
          "Javaのコンパイルエラーを防ぐため",
        ],
        correctIndex: 1,
        explanation: "負数のみの配列でも正しく最大値を求めるため、必ず配列内の実在要素 `arr[0]` で初期化します。",
      },
    ],
  },
  17: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.begMatrixSales],
    lessonContentMd: `### 二次元配列と二重forループ
\`int[][] sales = new int[r][c];\` は「\`r\` 行 × \`c\` 列」の表データを表現します。
外側の \`for (int i = 0; i < r; i++)\` で行を選び、内側の \`for (int j = 0; j < c; j++)\` で列を走査するのが基本パターンです。`,
  },
  18: {
    status: "published",
    lessonContentMd: `### メソッドの定義・引数・戻り値
よく使う処理に名前をつけて部品化する仕組みが **メソッド** です。
- **引数**：メソッドに渡す入力データ
- **戻り値**：\`return\` で呼び出し元へ返す計算結果（返さない場合は \`void\`）`,
    quizzes: [
      {
        id: "q-d18-1",
        type: "multiple_choice",
        question: "戻り値を返さないメソッドの定義に使うキーワードはどれですか？",
        choices: ["null", "empty", "void", "none"],
        correctIndex: 2,
        explanation: "戻り値がないメソッドは戻り値の型として `void` を指定します。",
      },
    ],
  },
  19: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.begOverload],
    lessonContentMd: `### メソッドのオーバーロードとスコープ
同じ名前でも **引数の個数や型が異なるメソッド** を複数定義できる仕組みを **オーバーロード** と呼びます。呼び出し側の使いやすさを高める実務頻出テクニックです。`,
  },
  20: {
    status: "published",
    lessonContentMd: `### 判定メソッドの設計（素数判定など）
「条件を満たすか判定するメソッド」は \`boolean\` を返し、名前を \`isPrime\` や \`isValid\` のように \`is〜\` で始めると現場で読みやすいコードになります。`,
  },
  21: {
    status: "published",
    lessonContentMd: `### 再帰処理と第3週総復習
メソッドの中で自分自身を呼び出す手法を **再帰** といいます。再帰では必ず **終了条件（ベースケース）** を書かないと無限再帰（\`StackOverflowError\`）になる点に注意しましょう。`,
  },
  22: {
    status: "published",
    lessonContentMd: `### クラスとオブジェクトの基本
- **クラス**：データ（フィールド）と処理（メソッド）をまとめた「設計図」
- **インスタンス（オブジェクト）**：\`new クラス名()\` でメモリ上に作られた「実体」
実務では「顧客（Customer）」「商品（Product）」「注文（Order）」などをクラスとして表現します。`,
    quizzes: [
      {
        id: "q-d22-1",
        type: "multiple_choice",
        question: "クラスからインスタンスを生成するために使うキーワードはどれですか？",
        choices: ["create", "new", "make", "instance"],
        correctIndex: 1,
        explanation: "`new クラス名()` でインスタンスを生成します。",
      },
    ],
  },
  23: {
    status: "published",
    lessonContentMd: `### フィールド・コンストラクタ・this
**コンストラクタ**はインスタンス生成時に自動実行される初期化メソッドで、クラス名と同じ名前にします（戻り値型は書きません）。引数名とフィールド名が同じときは \`this.name = name;\` と書いて区別します。`,
  },
  24: {
    status: "published",
    lessonContentMd: `### private・getter/setter・カプセル化
フィールドに \`private\` を付けて外部からの直接書き換えを禁止し、メソッド経由でのみ操作させる設計を **カプセル化** といいます。銀行口座の残高がマイナスにならないようチェックする処理などを安全に閉じ込められます。`,
  },
  25: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.begStaticTicket],
    lessonContentMd: `### static フィールドと static メソッド
\`static\` を付けたメンバーはインスタンスごとではなく **クラス全体で1つ共有** されます。連番IDの発行カウンターや共通定数（\`static final\`）によく使われます。`,
  },
  26: {
    status: "published",
    lessonContentMd: `### 継承（extends）とオーバーライド
既存クラスの機能を引き継いで新しいクラスを作る仕組みが **継承（\`extends\`）** です。親クラスのメソッドを子クラスで上書き再定義することを **オーバーライド** といいます。`,
  },
  27: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.begPaymentInterface],
    lessonContentMd: `### インターフェースとポリモーフィズム
\`interface\` で「何ができるか（メソッドの約束）」だけを定義し、複数のクラスが \`implements\` で実装します。呼び出し側はインターフェース型で扱うことで、実装差し替えに強い設計（Spring BootのDIの土台）になります。`,
  },
  28: {
    status: "published",
    problemIds: [
      "44444444-4444-4444-8444-444444444410",
      "44444444-4444-4444-8444-444444444411",
    ],
    lessonContentMd: `### オブジェクト指向総合演習：商品・口座管理プログラム
フィールド・コンストラクタ・カプセル化・メソッド設計を組み合わせて、業務ドメインをクラスとして表現する総仕上げを行います。`,
  },
  29: {
    status: "published",
    problemIds: [
      EXTRA_JAVA_PROBLEM_IDS.begMatrixSales,
      EXTRA_JAVA_PROBLEM_IDS.begStaticTicket,
    ],
    lessonContentMd: `### 第1フェーズ総復習（Day 1〜28）
明日の第1回実技試験に向けて、変数・分岐・ループ・配列・メソッド・クラス設計の中で迷った箇所を復習しましょう。`,
  },
  30: {
    status: "published",
    problemIds: [
      EXTRA_JAVA_PROBLEM_IDS.begPaymentInterface,
      "44444444-4444-4444-8444-444444444412",
    ],
    lessonContentMd: `### 第1回実技試験（Java基礎：Day 1〜30 到達度確認）
第1フェーズの修了試験です。ヒントを見ずに下の実技問題2問をクリアし、理解度確認テストで満点を目指しましょう！`,
    quizzes: [
      {
        id: "q-d30-1",
        type: "multiple_choice",
        question: "カプセル化の目的として最も適切な説明はどれですか？",
        choices: [
          "すべてのフィールドを public にしてどこからでも書き換えられるようにする",
          "フィールドを private にして不正な値への直接書き換えを防ぎ、安全なメソッド経由で操作させる",
          "クラスを1つにまとめてファイルを減らす",
          "処理速度を2倍にする",
        ],
        correctIndex: 1,
        explanation: "データ隠蔽と整合性保証（バリデーションの強制）がカプセル化の最大の目的です。",
      },
      {
        id: "q-d30-2",
        type: "multiple_choice",
        question: "インターフェースを実装するクラス宣言で使うキーワードはどれですか？",
        choices: ["extends", "implements", "inherits", "uses"],
        correctIndex: 1,
        explanation: "クラスの継承は `extends`、インターフェースの実装は `implements` を使います。",
      },
    ],
  },
  // 第2・第3フェーズの新規問題紐付け
  31: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.intArrayListSearch],
    lessonContentMd: `### List と ArrayList
通常の配列はサイズ変更ができませんが、\`ArrayList<String>\` は \`add()\` で自由に要素を追加でき、\`size()\`・\`get(i)\` で参照できます。実務で最もよく使うコレクションです。`,
  },
  32: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.intHashMapSales],
    lessonContentMd: `### Map と HashMap
\`HashMap<String, Integer>\` は「キー → 値」のペアを高速に検索・集計できるデータ構造です。\`containsKey\`, \`get\`, \`put\` の3メソッドを確実に使いこなしましょう。`,
  },
  38: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.intExceptionStock],
    lessonContentMd: `### 例外処理（try-catch-finally / throw）
業務システムでは、不正入力や在庫不足などの異常系を \`throw new IllegalArgumentException(...)\` 等で明示的に通知し、上位で \`try-catch\` して安全にエラーメッセージへ変換します。`,
  },
  40: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.intCsvParse],
    lessonContentMd: `### CSVデータ処理の基礎
\`line.split(",")\` でカンマ区切りの列に分解し、\`trim()\` で余分な空白を除去した上で \`Integer.parseInt()\` で数値変換する処理は、夜間バッチやデータ取込機能の基本です。`,
  },
  48: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.advBoundaryTest],
    lessonContentMd: `### 正常系・異常系・境界値テスト
条件が「18歳以上65歳以下」の場合、バグが潜みやすいのは境界の前後（\`17\`, \`18\`, \`65\`, \`66\`）と異常値（\`-1\`）です。これらを網羅するテスト設計力を養いましょう。`,
  },
  54: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.advCustomerDao],
    lessonContentMd: `### DAO（Data Access Object）パターン
データの保存・検索・削除（CRUD）を専用のDAOクラスに分離することで、業務ロジックとDB操作を疎結合に保てます。ここではインメモリDAOで基本構造を実装します。`,
  },
  64: {
    status: "published",
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.advApiValidation],
    lessonContentMd: `### REST API 入力バリデーション設計
Spring Boot の Bean Validation（\`@NotBlank\`, \`@Email\` 等）が裏側で行っている「複数項目の入力検証 → エラー一覧を400 Bad Requestで返却」する流れをJavaコードで体得しましょう。`,
  },
  82: {
    problemIds: [EXTRA_JAVA_PROBLEM_IDS.advDealService],
  },
};
