# Java全34問 模範解答・解説・コード実行順序ガイド（講師・受講生サポート用）

本ドキュメントは、**DevSkillStudio の Java全4コース（計34問）** について、受講生への質問対応や振り返り解説でそのまま使える **模範解答・コードの実行順序・分かりやすい説明ポイント・よくあるミス** をまとめたマニュアルです。

---

## 目次

- [はじめに：Javaコードが動く「基本の順番」](#はじめにjavaコードが動く基本の順番)
- [Java入門コース（全16問）](#java入門コース全16問)
  - [第1章：出力と変数（1-1 〜 1-5）](#第1章出力と変数)
  - [第2章：条件分岐とループ（2-1 〜 2-5）](#第2章条件分岐とループ)
  - [第3章：配列とメソッド（3-1 〜 3-3）](#第3章配列とメソッド)
  - [第4章：クラスとオブジェクト（4-1 〜 4-3）](#第4章クラスとオブジェクト)
- [Java初級コース（全6問）](#java初級コース全6問)
  - [初級第1章：二次元配列とメソッド設計（初級 1-1 〜 1-3）](#初級第1章二次元配列とメソッド設計)
  - [初級第2章：static・インターフェース・ポリモーフィズム（初級 2-1 〜 2-3）](#初級第2章staticインターフェースポリモーフィズム)
- [Java中級コース（全6問）](#java中級コース全6問)
  - [中級第1章：コレクション（ArrayList / HashMap）実務活用（中級 1-1 〜 1-3）](#中級第1章コレクションarraylist--hashmap実務活用)
  - [中級第2章：文字列API・CSV処理・例外ハンドリング（中級 2-1 〜 2-3）](#中級第2章文字列apicsv処理例外ハンドリング)
- [Java上級コース（全6問）](#java上級コース全6問)
  - [上級第1章：DAOパターンとAPIバリデーション設計（上級 1-1 〜 1-3）](#上級第1章daoパターンとapiバリデーション設計)
  - [上級第2章：顧客・案件管理ロジック＆単体テスト設計（上級 2-1 〜 2-3）](#上級第2章顧客案件管理ロジック単体テスト設計)

---

## はじめに：Javaコードが動く「基本の順番」

受講生が最初につまずきやすいのは「コードがどの順番で読まれて実行されているか」です。以下の4ルールを最初に伝えておくと理解が一気に早まります。

1. **必ず `public static void main(String[] args)` の中からスタートする**
   - 上に他のクラスやメソッドが書いてあっても、最初に実行されるのは常に `main` メソッドの1行目です。
2. **`main` の中は原則「上から下へ1行ずつ」実行される**
   - 処理の基本型は常に **「① 入力を受け取る → ② 計算・判定する → ③ 結果を出力する」** の3ステップです。
3. **分岐（`if` / `switch`）やループ（`for` / `while`）で流れが変わる**
   - `if` は条件に当てはまるブロックだけを1つ実行します。
   - `for` / `while` は条件が `true` の間、ブロック内を何度も繰り返します。
4. **別メソッドやクラスは「呼び出された瞬間」にジャンプして実行され、終わると元の行に戻る**
   - `new クラス名(...)` でコンストラクタが呼ばれ、`obj.メソッド名()` でそのメソッドの中へ処理が移ります。

---

# Java入門コース（全16問）

## 第1章：出力と変数

---

### 1-1. Hello Java! と複数行の出力
- **難易度**: 初級（目安：5分） / **テーマ**: 標準出力・基本構文

#### 模範解答
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
        System.out.println("Let's start programming!");
    }
}
```

#### コードが動く順番
1. `main` メソッドが開始される。
2. 3行目：`Hello, Java!` を画面に出力し、自動で改行する。
3. 4行目：`Let's start programming!` を画面に出力し、自動で改行する。
4. `main` メソッドが終了する。

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**: `println` の末尾の `ln` は「Line（改行）」の意味。1回呼ぶごとに1行出力されると説明すると覚えやすいです。
- **よくあるミス**:
  - 末尾のセミコロン `;` の付け忘れ。
  - カンマ `,` や感嘆符 `!`、大文字・小文字の1文字違い（`hello` と `Hello` は別物）。

---

### 1-2. 長方形の面積と周囲の長さ
- **難易度**: 初級（目安：10分） / **テーマ**: `Scanner` 入力・変数・四則演算

#### 模範解答
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int h = sc.nextInt();
        int w = sc.nextInt();
        int area = h * w;
        int perimeter = 2 * (h + w);
        System.out.println(area + " " + perimeter);
    }
}
```

#### コードが動く順番
1. 1行目：`Scanner` を使うための準備（`import`）。
2. 5行目：入力を読み取る道具 `sc` を作る。
3. 6〜7行目：1つ目の整数を `h`、2つ目の整数を `w` に保存する（例：`h = 3`, `w = 5`）。
4. 8行目：面積 `h * w` を計算して `area` に保存する（`15`）。
5. 9行目：`h + w` を先に足してから2倍し、`perimeter` に保存する（`16`）。
6. 10行目：`area` と `perimeter` の間に半角スペース `" "` を挟んで1行で出力する（`15 16`）。

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**: 数学と同じく掛け算 `*` が足し算 `+` より優先されるため、`2 * (h + w)` と丸括弧 `()` で囲む理由を伝えましょう。
- **よくあるミス**:
  - `area + perimeter` と書いてしまい、空白区切りではなく足し算の結果（`31`）が出てしまう。間に `" "` を入れることで文字列結合になります。

---

### 1-3. 秒数の時間変換（時・分・秒）
- **難易度**: 初級（目安：10分） / **テーマ**: 整数除算 `/` と剰余 `%`

#### 模範解答
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int totalSeconds = sc.nextInt();
        int h = totalSeconds / 3600;
        int m = (totalSeconds % 3600) / 60;
        int s = totalSeconds % 60;
        System.out.println(h + ":" + m + ":" + s);
    }
}
```

#### コードが動く順番
1. 6行目：総秒数 `totalSeconds` を受け取る（例：`46979`）。
2. 7行目：1時間＝3600秒なので、`46979 / 3600` の商（整数部分）を `h` に入れる（`13`）。
3. 8行目：`46979 % 3600` で「時間を取り除いた残りの秒数（`179`秒）」を求め、それを `60` で割って `m` に入れる（`2`）。
4. 9行目：`46979 % 60` で60秒に満たない端数の秒を求め、`s` に入れる（`59`）。
5. 10行目：`:` でつないで `13:2:59` と出力する。

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**: Javaの `int` 同士の割り算 `/` は「小数点以下を自動で切り捨てる」性質を利用しています。`%` は「割り算の余り」です。
- **よくあるミス**:
  - `m` を `totalSeconds / 60` だけにしてしまい、時間分も含まれた大きな分数（`782`分など）になってしまう。

---

### 1-4. 変数とデータ型による社員プロフィール出力
- **難易度**: 初級（目安：8分） / **テーマ**: 基本データ型（`int`, `double`, `boolean`）と `String`

#### 模範解答
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        int age = Integer.parseInt(sc.nextLine());
        double score = Double.parseDouble(sc.nextLine());
        boolean active = Boolean.parseBoolean(sc.nextLine());

        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Score: " + score);
        System.out.println("Active: " + active);
    }
}
```

#### コードが動く順番
1. 6行目：1行目の氏名（文字列）をそのまま `name` に格納する。
2. 7行目：2行目を文字列として読み込み、`Integer.parseInt(...)` で整数（`int`）に変換して `age` に格納する。
3. 8行目：3行目を小数（`double`）に変換して `score` に格納する。
4. 9行目：4行目を真偽値（`boolean`）に変換して `active` に格納する。
5. 11〜14行目：指定のラベル（`Name: ` など）と変数を `+` で連結して4行出力する。

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**: 氏名にスペースが入る場合があるため、全部 `sc.nextLine()` で1行ずつ読んでから型変換（`parseInt` 等）するのが安全です。
- **よくあるミス**:
  - `Name:` の後ろの半角スペースを忘れる（`Name:山田` になりテスト不一致）。

---

### 1-5. 消費税（10%）込みの商品合計金額計算
- **難易度**: 初級（目安：10分） / **テーマ**: 整数演算による切り捨て計算

#### 模範解答
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int price = sc.nextInt();
        int qty = sc.nextInt();
        int subtotal = price * qty;
        int total = (subtotal * 110) / 100;
        System.out.println("Subtotal: " + subtotal);
        System.out.println("Total: " + total);
    }
}
```

#### コードが動く順番
1. 6〜7行目：単価 `price` と個数 `qty` を読み込む。
2. 8行目：税抜合計 `subtotal = price * qty` を計算する。
3. 9行目：`(subtotal * 110) / 100` で1.1倍（整数除算により小数点以下切り捨て）を計算し `total` に格納する。
4. 10〜11行目：`Subtotal:` と `Total:` をそれぞれ出力する。

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**: `(int)(subtotal * 1.1)` と書くと、コンピュータ内部の2進数小数の誤差（例：`100 * 1.1` が `109.999999...` になり `109` に切り捨てられる等）が起きることがあります。**「実務のお金計算は整数で掛けてから割る（`* 110 / 100`）」** と教えると現場意識が高まります。

---

## 第2章：条件分岐とループ

---

### 2-1. テストの成績判定（if-else分岐）
- **難易度**: 初級（目安：10分） / **テーマ**: `if / else if / else` の上から順の評価

#### 模範解答
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int score = sc.nextInt();
        if (score >= 80) {
            System.out.println("A");
        } else if (score >= 60) {
            System.out.println("B");
        } else if (score >= 40) {
            System.out.println("C");
        } else {
            System.out.println("D");
        }
    }
}
```

#### コードが動く順番
1. 6行目：点数 `score` を受け取る（例：`75`）。
2. 7行目：`75 >= 80` は偽（`false`）なので次へ。
3. 9行目：`75 >= 60` は真（`true`）なので `B` を出力し、以降の `else if` / `else` はすべてスキップして終了する。

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**: `else if` は「上の条件に当てはまらなかった人だけ」がチェックされるため、高い点数から順に並べると `score >= 60 && score < 80` のように重複して書かずに済みます。
- **よくあるミス**: `>`（より大きい）と `>=`（以上）の取り違え。ちょうど80点のときは `A` になる必要があります。

---

### 2-2. FizzBuzz問題（ループと条件分岐）
- **難易度**: 中級（目安：15分） / **テーマ**: `for` ループ＋条件の優先順位

#### 模範解答
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 1; i <= n; i++) {
            if (i % 15 == 0) {
                System.out.println("FizzBuzz");
            } else if (i % 3 == 0) {
                System.out.println("Fizz");
            } else if (i % 5 == 0) {
                System.out.println("Buzz");
            } else {
                System.out.println(i);
            }
        }
    }
}
```

#### コードが動く順番
1. 6行目：上限値 `n` を読み込む。
2. 7行目：`i` を `1` からスタートし、`i <= n` の間、1周ごとに `i++`（+1）しながらループする。
3. 8〜16行目（毎周回）：
   - まず「3かつ5の倍数（＝15の倍数）」か判定 → 当てはまれば `FizzBuzz`。
   - 次に「3の倍数」→ `Fizz`。
   - 次に「5の倍数」→ `Buzz`。
   - どれにも当てはまらなければ数値 `i` をそのまま出力。

#### 受講生への説明ポイント・よくあるミス
- **一番多いミス**: `if (i % 3 == 0)` を一番上に書いてしまい、`15` のときに `FizzBuzz` ではなく `Fizz` が出力されてしまうケース。**「厳しい（狭い）条件を一番上に書く」** のが鉄則と伝えましょう。

---

### 2-3. 各桁の和（whileループの活用）
- **難易度**: 中級（目安：15分） / **テーマ**: `while` ループ・桁の分解アルゴリズム

#### 模範解答
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int sum = 0;
        while (n > 0) {
            sum += n % 10;
            n /= 10;
        }
        System.out.println(sum);
    }
}
```

#### コードが動く順番（`n = 1234` の場合）
1. 初期状態：`n = 1234`, `sum = 0`。
2. 1周目：`n % 10` は `4` → `sum = 4`、`n /= 10` で `n = 123`。
3. 2周目：`n % 10` は `3` → `sum = 7`、`n /= 10` で `n = 12`。
4. 3周目：`n % 10` は `2` → `sum = 9`、`n /= 10` で `n = 1`。
5. 4周目：`n % 10` は `1` → `sum = 10`、`n /= 10` で `n = 0`。
6. `n > 0` が偽になりループ終了 → `10` を出力。

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**: 「`% 10` は一番右の桁を取り出す魔法、`/ 10` は一番右の桁を消しゴムで消す魔法」と例えると一発でイメージできます。
- **よくあるミス**: `n /= 10` を書き忘れて無限ループになる。

---

### 2-4. 会員ランクと割引適用の複合条件判定（AND / OR）
- **難易度**: 初級（目安：10分） / **テーマ**: 論理演算子 `||`（または）

#### 模範解答
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int amount = sc.nextInt();
        int isPremium = sc.nextInt();
        if (isPremium == 1 || amount >= 5000) {
            System.out.println("FREE_SHIPPING");
        } else {
            System.out.println("STANDARD_SHIPPING");
        }
    }
}
```

#### コードが動く順番
1. 6〜7行目：購入金額 `amount` と会員フラグ `isPremium`（`1` または `0`）を読み込む。
2. 8行目：`isPremium == 1` または `amount >= 5000` のどちらか一方でも真なら `FREE_SHIPPING` を出力。
3. 両方とも偽なら 11行目で `STANDARD_SHIPPING` を出力。

#### 受講生への説明ポイント・よくあるミス
- **よくあるミス**: `||`（OR：または）と `&&`（AND：かつ）の取り違え。また `=`（代入）と `==`（等しいか比較）の書き間違い。

---

### 2-5. HTTPステータスコードの種別判定（switch文）
- **難易度**: 初級（目安：10分） / **テーマ**: `switch` 文と `break`

#### 模範解答
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int code = sc.nextInt();
        switch (code) {
            case 200:
                System.out.println("OK");
                break;
            case 201:
                System.out.println("CREATED");
                break;
            case 400:
                System.out.println("BAD_REQUEST");
                break;
            case 404:
                System.out.println("NOT_FOUND");
                break;
            case 500:
                System.out.println("INTERNAL_SERVER_ERROR");
                break;
            default:
                System.out.println("UNKNOWN");
                break;
        }
    }
}
```

#### コードが動く順番
1. 6行目：ステータスコード `code` を受け取る。
2. 7行目：`code` の値に一致する `case` へ直接ジャンプする。
3. 一致した `case` の処理を実行し、`break;` で `switch` ブロックから抜ける。
4. どの `case` にも一致しない場合は `default:` が実行される。

#### 受講生への説明ポイント・よくあるミス
- **よくあるミス**: `break;` を書き忘れると、下の `case` まで連続して実行されてしまう（フォールスルー）ため、必ず `case` と `break;` をセットで書く習慣をつけましょう。

---

## 第3章：配列とメソッド

---

### 3-1. 配列の最大値と合計値
- **難易度**: 初級（目安：15分） / **テーマ**: 1次元配列・拡張for文・最大値の初期化

#### 模範解答
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }
        int max = nums[0];
        int sum = 0;
        for (int v : nums) {
            if (v > max) {
                max = v;
            }
            sum += v;
        }
        System.out.println(max + " " + sum);
    }
}
```

#### コードが動く順番
1. 6〜7行目：要素数 `n` を読み込み、長さ `n` の配列 `nums` を用意する。
2. 8〜10行目：入力値を `nums[0]` 〜 `nums[n - 1]` へ順番に格納する。
3. 11〜12行目：暫定チャンピオン `max` を先頭要素 `nums[0]` で初期化し、`sum` を `0` で初期化する。
4. 13〜18行目：配列の全要素 `v` を順番に確認し、`max` より大きければ塗り替え、同時に `sum` へ足し込む。
5. 19行目：`max` と `sum` を空白区切りで出力する。

#### 受講生への説明ポイント・よくあるミス
- **よくあるミス**: `int max = 0;` と初期化してしまうケース。もし配列の中身が全部マイナスの数（例：`-5, -10, -2`）だった場合、答えが `0` になってしまいます。**「最大値の初期値は必ず配列の先頭 `nums[0]`」** と覚えさせましょう。

---

### 3-2. 素数判定メソッドの実装
- **難易度**: 中級（目安：15分） / **テーマ**: `static` メソッド定義・早期 `return`

#### 模範解答
```java
import java.util.Scanner;

public class Main {
    public static boolean isPrime(int x) {
        if (x < 2) return false;
        for (int i = 2; i * i <= x; i++) {
            if (x % i == 0) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (isPrime(n)) {
            System.out.println("Prime");
        } else {
            System.out.println("Not Prime");
        }
    }
}
```

#### コードが動く順番
1. 14行目：`main` から開始し、整数 `n` を読み込む。
2. 17行目：`isPrime(n)` を呼び出し、4行目の `isPrime` メソッドへ処理がジャンプする。
3. 5行目：`x < 2`（1以下）なら即座に `false` を返して呼び出し元に戻る。
4. 6〜10行目：`i = 2` から `i * i <= x`（ルート `x`）まで割り切れるか調べ、1つでも割り切れたら即座に `false` を返す。
5. 11行目：最後まで割り切れなかったら `true` を返す。
6. 17〜21行目：`main` に戻り、結果が `true` なら `Prime`、`false` なら `Not Prime` を出力する。

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**: 「メソッドの中で `return` されると、その瞬間にメソッドは終了して答えを持って `main` に帰る」という流れを図解すると分かりやすいです。
- **よくあるミス**: `1` を素数と誤判定してしまう（`if (x < 2) return false;` が必須）。

---

### 3-3. 再帰メソッドによる階乗計算
- **難易度**: 中級（目安：15分） / **テーマ**: 再帰呼び出し・ベースケース（終了条件）

#### 模範解答
```java
import java.util.Scanner;

public class Main {
    public static int factorial(int n) {
        if (n <= 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(factorial(n));
    }
}
```

#### コードが動く順番（`n = 4` の場合）
1. `main` が `factorial(4)` を呼ぶ。
2. `factorial(4)` は `4 * factorial(3)` を計算しようとして `factorial(3)` を呼ぶ。
3. `factorial(3)` → `3 * factorial(2)` → `factorial(2)` → `2 * factorial(1)` と掘り下げる。
4. `factorial(1)` は `n <= 1` なので **`1` を返す**（ここで折り返し！）。
5. 帰り道で順番に掛け算が確定する：`2 * 1 = 2` → `3 * 2 = 6` → `4 * 6 = 24`。
6. `main` に `24` が返り、画面に出力される。

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**: 「行き（掘り下げ）」と「帰り（計算確定）」の2段階に分けてホワイトボード等で書くと一気に理解できます。
- **よくあるミス**: 終了条件 `if (n <= 1) return 1;` を書き忘れて無限再帰（スタックオーバーフロー）になる。`0! = 1` もカバーするため `n <= 1` にするのが安全です。

---

## 第4章：クラスとオブジェクト

---

### 4-1. 商品クラス（Product）の定義とコンストラクタ
- **難易度**: 中級（目安：15分） / **テーマ**: クラス定義・フィールド・コンストラクタ・`this`

#### 模範解答
```java
import java.util.Scanner;

class Product {
    String name;
    int price;

    public Product(String name, int price) {
        this.name = name;
        this.price = price;
    }

    public int getTotalPrice(int quantity) {
        return this.price * quantity;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        int price = sc.nextInt();
        int quantity = sc.nextInt();

        Product p = new Product(name, price);
        System.out.println(p.name + ": " + p.getTotalPrice(quantity) + "円");
    }
}
```

#### コードが動く順番
1. 18行目：`main` 開始。入力から `name`, `price`, `quantity` を読み込む。
2. 24行目：`new Product(name, price)` が実行され、7行目のコンストラクタへジャンプ。`this.name` と `this.price` に値がセットされた商品オブジェクト `p` が誕生する。
3. 25行目：`p.getTotalPrice(quantity)` が呼ばれ、12行目へジャンプ。`this.price * quantity` を計算して返す。
4. 25行目に戻り、`Coffee: 1050円` の形式で出力する。

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**: クラスは「たい焼きの金型（設計図）」、`new Product(...)` で作る `p` が「実物のたい焼き（インスタンス）」。`this.name` は「自分自身のフィールド側の `name`」という意味です。

---

### 4-2. 銀行口座クラス（カプセル化と残高チェック）
- **難易度**: 中級（目安：20分） / **テーマ**: `private` カプセル化・メソッド経由の状態変更

#### 模範解答
```java
import java.util.Scanner;

class BankAccount {
    private int balance;

    public BankAccount(int initialBalance) {
        this.balance = initialBalance;
    }

    public void deposit(int amount) {
        this.balance += amount;
    }

    public void withdraw(int amount) {
        if (this.balance >= amount) {
            this.balance -= amount;
        } else {
            System.out.println("Insufficient funds");
        }
    }

    public int getBalance() {
        return this.balance;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int initial = sc.nextInt();
        int dep = sc.nextInt();
        int wit = sc.nextInt();

        BankAccount account = new BankAccount(initial);
        account.deposit(dep);
        account.withdraw(wit);
        System.out.println(account.getBalance());
    }
}
```

#### コードが動く順番
1. 28〜32行目：初期残高 `initial`、預入額 `dep`、引出額 `wit` を読み込む。
2. 34行目：`new BankAccount(initial)` で残高 `initial` の口座を作成。
3. 35行目：`account.deposit(dep)` で残高を増やす。
4. 36行目：`account.withdraw(wit)` で「残高が足りているか？」をチェック。足りていれば引き落とし、足りなければ残高を変えず `Insufficient funds` を出力。
5. 37行目：`account.getBalance()` で最終残高を取得して出力する。

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**: なぜ `balance` を `private` にするのか？ → 「外から `account.balance = -999999;` のように勝手に書き換えられないようにし、必ず窓口（`deposit` / `withdraw`）を通すため（銀行のATMと同じ）」と例えると納得感が高いです。

---

### 4-3. クラスの継承とメソッドのオーバーライド
- **難易度**: 上級（目安：20分） / **テーマ**: `extends`・`@Override`・ポリモーフィズム

#### 模範解答
```java
import java.util.Scanner;

class Member {
    public int getDiscountedPrice(int price) {
        return price * 95 / 100;
    }
}

class VipMember extends Member {
    @Override
    public int getDiscountedPrice(int price) {
        return price * 80 / 100;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        int price = sc.nextInt();

        Member m;
        if (type.equals("vip")) {
            m = new VipMember();
        } else {
            m = new Member();
        }
        System.out.println(m.getDiscountedPrice(price));
    }
}
```

#### コードが動く順番
1. 19〜20行目：会員種別 `type`（`"vip"` 等）と金額 `price` を読み込む。
2. 22〜27行目：親クラス型の変数 `Member m` を用意し、`type.equals("vip")` なら `VipMember`、それ以外なら `Member` の実体を代入する。
3. 28行目：`m.getDiscountedPrice(price)` を呼ぶ。**変数の型は `Member` でも、中身の実体が `VipMember` なら自動的に20%引きのメソッドが実行される**。

#### 受講生への説明ポイント・よくあるミス
- **よくあるミス**: 文字列比較を `type == "vip"` と書いてしまうケース。Javaの文字列比較は必ず `type.equals("vip")` を使う点を強く強調しましょう。

---

# Java初級コース（全6問）

## 初級第1章：二次元配列とメソッド設計

---

### 初級 1-1. 店舗別・日別売上の二次元配列集計
- **難易度**: 中級（目安：15分） / **テーマ**: 二次元配列・二重ループ

#### 模範解答
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        int[][] sales = new int[r][c];
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) {
                sales[i][j] = sc.nextInt();
            }
        }
        int grandTotal = 0;
        for (int i = 0; i < r; i++) {
            int rowSum = 0;
            for (int j = 0; j < c; j++) {
                rowSum += sales[i][j];
            }
            grandTotal += rowSum;
            System.out.println("Store " + (i + 1) + ": " + rowSum);
        }
        System.out.println("GrandTotal: " + grandTotal);
    }
}
```

#### コードが動く順番
1. 6〜8行目：行数 `r`（店舗数）と列数 `c`（日数）を読み込み、`r × c` の表 `sales` を作る。
2. 9〜13行目：二重ループで1行目（店舗1）の1日目〜C日目、次に2行目…と順にデータを格納する。
3. 14〜22行目：店舗 `i` ごとに `rowSum = 0` をリセットし、内側ループでその店舗の全日程を合計する。合計を `grandTotal` に足し、`Store (i + 1): rowSum` を出力。
4. 23行目：全店舗ループが終わったら `GrandTotal` を出力する。

#### 受講生への説明ポイント・よくあるミス
- **よくあるミス**:
  - `int rowSum = 0;` を外側ループの外に書いてしまい、前の店舗の売上がリセットされず加算され続けてしまう。
  - `"Store " + i + 1` と括弧なしで書いてしまい、`Store 01` のように文字列連結されてしまう（必ず `(i + 1)` と括弧をつける）。

---

### 初級 1-2. 割引計算メソッドのオーバーロード設計
- **難易度**: 中級（目安：12分） / **テーマ**: メソッドのオーバーロード（多重定義）

#### 模範解答
```java
import java.util.Scanner;

public class Main {
    public static int calcPrice(int price) {
        return (price * 110) / 100;
    }

    public static int calcPrice(int price, int discount) {
        int base = price - discount;
        if (base < 0) {
            base = 0;
        }
        return calcPrice(base);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int price = sc.nextInt();
        int discount = sc.nextInt();
        System.out.println(calcPrice(price));
        System.out.println(calcPrice(price, discount));
    }
}
```

#### コードが動く順番
1. 17〜18行目：`price` と `discount` を読み込む。
2. 19行目：引数が1つなので **4行目の `calcPrice(int price)`** が呼ばれ、税込価格を出力。
3. 20行目：引数が2つなので **8行目の `calcPrice(int price, int discount)`** が呼ばれる。
4. 9〜13行目：割引後価格 `base` を求め、0未満なら0に補正し、さらに1引数版 `calcPrice(base)` を呼び出して税率計算を再利用する。

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**: 同じメソッド名でも「引数の数・型が違えばJavaが自動で見分けてくれる」のがオーバーロードです。2引数版から1引数版を呼ぶことで、税率変更時に修正箇所が1か所で済む設計の良さも伝えましょう。

---

### 初級 1-3. 配列の昇順ソートと中央値（メソッド設計）
- **難易度**: 中級（目安：15分） / **テーマ**: バブルソート・配列の参照渡し・中央値

#### 模範解答
```java
import java.util.Scanner;

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
}
```

#### コードが動く順番
1. 18〜22行目：要素数 `n` と配列 `nums` を読み込む。
2. 23行目：`sortAsc(nums)` を呼び出し、二重ループで隣り合う要素を比較・交換して小さい順に並び替える。
3. 24〜26行目：並び替え完了後、先頭 `nums[0]`（最小）、真ん中 `nums[n / 2]`（中央値）、末尾 `nums[n - 1]`（最大）を出力する。

#### 受講生への説明ポイント・よくあるミス
- **よくあるミス**: 2つの値を入れ替えるときに一時変数 `tmp` を忘れると片方の値が上書きされて消えてしまいます（「2つのコップの中身を入れ替えるには空のコップが1つ必要」と例えると分かりやすいです）。

---

## 初級第2章：static・インターフェース・ポリモーフィズム

---

### 初級 2-1. static フィールドによる自動採番チケット管理クラス
- **難易度**: 中級（目安：15分） / **テーマ**: `static` フィールド・`static` メソッド

#### 模範解答
```java
import java.util.Scanner;

class Ticket {
    private static int nextId = 1;
    private int id;
    private String title;

    public Ticket(String title) {
        this.id = nextId;
        nextId++;
        this.title = title;
    }

    public String getLabel() {
        return "#" + this.id + " " + this.title;
    }

    public static int getIssuedCount() {
        return nextId - 1;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine());
        for (int i = 0; i < n; i++) {
            Ticket t = new Ticket(sc.nextLine());
            System.out.println(t.getLabel());
        }
        System.out.println("Total: " + Ticket.getIssuedCount());
    }
}
```

#### コードが動く順番
1. プログラム開始時：クラス全体で1つだけの共通カウンター `Ticket.nextId` が `1` で用意される。
2. 26〜30行目：`n` 回ループし、`new Ticket(タイトル)` を実行するたびに：
   - 現在の `nextId` を自分の `this.id` にコピー
   - 共通の `nextId` を `+1`（次の人のために進める）
   - `t.getLabel()` で `#1 タイトル` のように出力
3. 31行目：クラス名から直接 `Ticket.getIssuedCount()` を呼び、`nextId - 1`（発行総数）を出力する。

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**: 普通のフィールド（`id`, `title`）は「チケット1枚ごとの持ち物」、`static` フィールド（`nextId`）は「受付の発券機にある共通の番号札カウンター」と例えると一発で分かります。

---

### 初級 2-2. 決済インターフェースとポリモーフィズム（第1回実技レベル）
- **難易度**: 上級（目安：15分） / **テーマ**: `interface`・`implements`・ポリモーフィズム

#### 模範解答
```java
import java.util.Scanner;

interface Payment {
    int calcFee(int amount);
}

class CreditCardPayment implements Payment {
    public int calcFee(int amount) {
        return (amount * 3) / 100;
    }
}

class BankTransferPayment implements Payment {
    public int calcFee(int amount) {
        if (amount <= 0) {
            return 0;
        }
        return 220;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        int amount = sc.nextInt();

        Payment payment;
        if (type.equals("CARD")) {
            payment = new CreditCardPayment();
        } else {
            payment = new BankTransferPayment();
        }
        System.out.println("Fee: " + payment.calcFee(amount));
    }
}
```

#### コードが動く順番
1. 3〜5行目：「`calcFee` メソッドを必ず持つこと」という約束事（`interface Payment`）を定義。
2. 25〜26行目：決済方式 `type` と金額 `amount` を読み込む。
3. 28〜33行目：`Payment` 型の変数 `payment` に、`CARD` なら `CreditCardPayment`、それ以外なら `BankTransferPayment` を代入。
4. 34行目：`payment.calcFee(amount)` を呼ぶと、代入された実装クラス側の手数料計算が自動実行される。

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**: `interface` は「家電のコンセントの規格」。規格さえ合っていれば、クレジットカードでも銀行振込でも PayPay でも同じ `payment.calcFee(amount)` で動かせる、と説明すると実務での価値が伝わります。

---

### 初級 2-3. 給与計算インターフェースと雇用形態別ポリモーフィズム
- **難易度**: 中級（目安：15分） / **テーマ**: `interface`＋フィールド保持＋ポリモーフィズム

#### 模範解答
```java
import java.util.Scanner;

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
}
```

#### コードが動く順番
1. 38〜40行目：種別 `type` と2つの数値 `a`, `b` を読み込む。
2. 42〜47行目：`FULL` なら `FullTimeEmployee`、それ以外なら `PartTimeEmployee` を生成し、`Payable` 型の変数 `emp` に代入する。
3. 48行目：`emp.calcMonthlyPay()` を呼び、代入された実体クラス側の給与計算を実行して出力する。

---

# Java中級コース（全6問）

## 中級第1章：コレクション（ArrayList / HashMap）実務活用

---

### 中級 1-1. ArrayList による顧客名の検索フィルタリング
- **難易度**: 中級（目安：15分） / **テーマ**: `ArrayList`・`String#contains`・該当なし判定

#### 模範解答
```java
import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine());
        ArrayList<String> customers = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            customers.add(sc.nextLine());
        }
        String keyword = sc.nextLine();
        int count = 0;
        for (int i = 0; i < customers.size(); i++) {
            String name = customers.get(i);
            if (name.contains(keyword)) {
                System.out.println(name);
                count++;
            }
        }
        if (count == 0) {
            System.out.println("NOT_FOUND");
        }
    }
}
```

#### コードが動く順番
1. 7〜11行目：件数 `n` を読み、可変長リスト `customers` に `n` 件の顧客名を `.add()` で追加する。
2. 12行目：最終行の検索キーワード `keyword` を読み込む。
3. 13〜20行目：リストを先頭から末尾まで調べ、`name.contains(keyword)` が真なら出力して `count` を増やす。
4. 21〜23行目：ループ終了後に `count == 0`（1件もヒットしなかった）なら `NOT_FOUND` を出力する。

#### 受講生への説明ポイント・よくあるミス
- **よくあるミス**: `if (name.contains(keyword)) { ... } else { System.out.println("NOT_FOUND"); }` とループの中に `else` を書いてしまい、一致しない顧客のたびに何度も `NOT_FOUND` が出てしまう。**「該当なし判定は必ずループの外で `count == 0` を見る」** と伝えましょう。

---

### 中級 1-2. HashMap による商品カテゴリ別売上集計
- **難易度**: 中級（目安：15分） / **テーマ**: `HashMap`・キーごとの累積加算パターン

#### 模範解答
```java
import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        HashMap<String, Integer> map = new HashMap<>();
        for (int i = 0; i < n; i++) {
            String cat = sc.next();
            int amount = sc.nextInt();
            int current = map.containsKey(cat) ? map.get(cat) : 0;
            map.put(cat, current + amount);
        }
        String target = sc.next();
        int ans = map.containsKey(target) ? map.get(target) : 0;
        System.out.println(ans);
    }
}
```

#### コードが動く順番
1. 7〜8行目：件数 `n` を読み込み、「カテゴリ名 → 合計金額」を保存する辞書 `map` を用意する。
2. 9〜14行目：`n` 件分のカテゴリ `cat` と金額 `amount` を読み込み、
   - すでに `map` に登録済みなら現在の合計を取り出す（未登録なら `0`）
   - `current + amount` で上書き保存（`map.put`）する。
3. 15〜17行目：確認したいカテゴリ `target` を読み込み、`map` にあればその値、なければ `0` を出力する。

#### 受講生への説明ポイント・よくあるミス
- **よくあるミス**: 存在しないキーに対して `map.get(cat)` をそのまま足し算しようとして `NullPointerException` が発生する。必ず `containsKey`（または `getOrDefault`）で `0` 扱いにする習慣をつけましょう。

---

### 中級 1-3. HashMap によるアクセスログ種別カウントと最多項目抽出
- **難易度**: 中級（目安：15分） / **テーマ**: `HashMap` 集計＋最大値同時追跡

#### 模範解答
```java
import java.util.HashMap;
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
}
```

#### コードが動く順番
1. 7〜10行目：ログ件数 `n` を読み込み、回数管理用 `counts` と暫定1位（`topPath`, `topCount`）を初期化する。
2. 12〜20行目：ログを1件読むたびに `counts` の回数を `+1` し、暫定1位 `topCount` を超えたら即座に `topCount` と `topPath` を更新する。
3. 21行目：最終的な最多エンドポイントと回数を出力する。

---

## 中級第2章：文字列API・CSV処理・例外ハンドリング

---

### 中級 2-1. CSV注文データのパースと合計金額計算
- **難易度**: 中級（目安：15分） / **テーマ**: `split(",")`・`trim()`・`Integer.parseInt`

#### 模範解答
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        int total = 0;
        for (int i = 0; i < n; i++) {
            String line = sc.nextLine();
            String[] cols = line.split(",");
            int price = Integer.parseInt(cols[1].trim());
            int qty = Integer.parseInt(cols[2].trim());
            total += price * qty;
        }
        System.out.println("TotalAmount: " + total);
    }
}
```

#### コードが動く順番
1. 6行目：行数 `n` を読み込む（前後の空白対策で `.trim()`）。
2. 8〜14行目：1行ずつ読み込み、`line.split(",")` で配列に分解する（`cols[0]`=商品名, `cols[1]`=単価, `cols[2]`=個数）。
3. 11〜12行目：`cols[1]` と `cols[2]` の前後スペースを `.trim()` で消してから `Integer.parseInt` で数値化。
4. 13行目：`price * qty` を `total` に加算。
5. 15行目：`TotalAmount: <合計>` を出力する。

#### 受講生への説明ポイント・よくあるミス
- **よくあるミス**: `"Apple, 100, 3"` のようにカンマの後ろにスペースがあると、`Integer.parseInt(" 100")` が `NumberFormatException` で落ちます。**「CSVの数値変換前は必ず `.trim()`」** が実務の鉄則です。

---

### 中級 2-2. 例外処理（try-catch / throw）による安全な在庫引当
- **難易度**: 中級（目安：15分） / **テーマ**: `throw`・`try-catch`・例外メッセージ取得

#### 模範解答
```java
import java.util.Scanner;

public class Main {
    public static int allocate(int stock, int qty) {
        if (qty <= 0) {
            throw new IllegalArgumentException("INVALID_QTY");
        }
        if (qty > stock) {
            throw new IllegalStateException("OUT_OF_STOCK");
        }
        return stock - qty;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int stock = sc.nextInt();
        int qty = sc.nextInt();
        try {
            int rem = allocate(stock, qty);
            System.out.println("Remaining: " + rem);
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
```

#### コードが動く順番
1. 16〜17行目：在庫数 `stock` と出庫数 `qty` を読み込む。
2. 18〜19行目：`try` ブロック内で `allocate(stock, qty)` を呼び出す。
3. 5〜10行目（`allocate` 内）：
   - `qty <= 0` なら例外を `throw` → **即座に処理中断し、21行目の `catch` へワープする**。
   - `qty > stock` なら例外を `throw` → 同様に `catch` へワープする。
   - どちらも問題なければ `stock - qty` を返す。
4. 正常時：20行目で `Remaining: <残在庫>` を出力し、`catch` はスキップ。
5. 例外時：22行目で `Error: <e.getMessage()>` を出力。

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**: `throw` は「異常事態の緊急通報ボタン」、`try-catch` は「通報を受け止める安全ネット」と説明すると分かりやすいです。`throw` した行より下（`return` や `Remaining:` の行）は一切実行されない点がポイントです。

---

### 中級 2-3. 例外処理（try-catch）による不正データ除外と安全集計
- **難易度**: 中級（目安：15分） / **テーマ**: ループ内 `try-catch`・バッチ処理の障害耐性

#### 模範解答
```java
import java.util.Scanner;

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
}
```

#### コードが動く順番
1. 6〜8行目：行数 `n` を読み込み、`sum = 0`, `skipped = 0` を初期化。
2. 10〜18行目：1行ずつ読み込み、ループの内側の `try` で `Integer.parseInt` を実行。数値なら `sum` に加算、変換失敗して例外が出たら `catch` へ飛んで `skipped++` して次の行へ進む。
3. 20〜21行目：有効数値の合計とスキップ件数を出力する。

#### 受講生への説明ポイント・よくあるミス
- **よくあるミス**: `try` を `for` ループの「外側」に書いてしまうと、最初の1件目の不正データでループ全体が中断してしまいます。

---

# Java上級コース（全6問）

## 上級第1章：DAOパターンとAPIバリデーション設計

---

### 上級 1-1. DAOパターンによる顧客CRUDリポジトリ実装
- **難易度**: 上級（目安：20分） / **テーマ**: DAOパターン・責務分離・CRUD操作

#### 模範解答
```java
import java.util.HashMap;
import java.util.Scanner;

class CustomerDao {
    private HashMap<Integer, String> store = new HashMap<>();

    public void save(int id, String name) {
        store.put(id, name);
    }

    public String findById(int id) {
        if (!store.containsKey(id)) {
            return "NOT_FOUND";
        }
        return store.get(id);
    }

    public void deleteById(int id) {
        store.remove(id);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int q = sc.nextInt();
        CustomerDao dao = new CustomerDao();
        for (int i = 0; i < q; i++) {
            String cmd = sc.next();
            int id = sc.nextInt();
            if (cmd.equals("ADD")) {
                String name = sc.next();
                dao.save(id, name);
            } else if (cmd.equals("GET")) {
                System.out.println(dao.findById(id));
            } else if (cmd.equals("DEL")) {
                dao.deleteById(id);
            }
        }
    }
}
```

#### コードが動く順番
1. 26〜27行目：コマンド回数 `q` を読み込み、データ管理専任の `CustomerDao` インスタンスを1つ作る。
2. 28〜39行目：`q` 回ループしてコマンド `cmd` と `id` を読み込み、
   - `ADD` → さらに `name` を読んで `dao.save(id, name)`
   - `GET` → `dao.findById(id)` の戻り値を出力（未登録なら `"NOT_FOUND"`）
   - `DEL` → `dao.deleteById(id)` で削除

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**: `main` の中に直接 `HashMap` を置かず `CustomerDao` に閉じ込めることで、「データの保存方法」と「画面/コマンド処理」を分離できます。これがSpring Bootの `Repository` 層そのものです。

---

### 上級 1-2. REST API入力バリデーション＆ステータス判定
- **難易度**: 上級（目安：15分） / **テーマ**: 複数エラー収集・HTTP 201/400設計

#### 模範解答
```java
import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        String email = sc.nextLine();

        ArrayList<String> errors = new ArrayList<>();
        if (name.trim().length() == 0) {
            errors.add("NAME_REQUIRED");
        }
        if (!email.contains("@")) {
            errors.add("INVALID_EMAIL");
        }

        if (errors.size() == 0) {
            System.out.println("201 CREATED");
        } else {
            System.out.println("400 BAD_REQUEST");
            for (int i = 0; i < errors.size(); i++) {
                System.out.println(errors.get(i));
            }
        }
    }
}
```

#### コードが動く順番
1. 7〜8行目：会社名 `name` とメール `email` を読み込む。
2. 10行目：エラー一覧を溜める空リスト `errors` を作る。
3. 11〜16行目：`name` と `email` を**それぞれ独立した `if` 文**でチェックし、不備があれば `errors` に追加する。
4. 18〜25行目：エラーが0件なら `201 CREATED`、1件以上あれば `400 BAD_REQUEST` のあとにエラーコードを全件出力する。

#### 受講生への説明ポイント・よくあるミス
- **よくあるミス**: 2つ目のチェックを `else if` にしてしまい、`name` も `email` も両方不正なときに `NAME_REQUIRED` しか出力されない。**「全項目のエラーを集めたいときは `if` を独立して並べる」** のが重要です。

---

### 上級 1-3. REST API ページネーション計算と対象ページ抽出
- **難易度**: 上級（目安：20分） / **テーマ**: ページング計算・境界チェック

#### 模範解答
```java
import java.util.ArrayList;
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
}
```

#### コードが動く順番
1. 7〜13行目：件数 `n`・ページ番号 `page`・1ページ件数 `size` と全アイテムを読み込む。
2. 15〜16行目：切り上げ公式 `(n + size - 1) / size` で総ページ数を計算し `Page: page/totalPages` を出力。
3. 18〜22行目：開始位置 `start = (page - 1) * size`、終了位置 `end = Math.min(start + size, n)` を計算。
4. 24〜30行目：範囲外なら `EMPTY`、範囲内なら `start` 〜 `end - 1` を順番に出力する。

---

## 上級第2章：顧客・案件管理ロジック＆単体テスト設計

---

### 上級 2-1. 顧客・案件管理サービス：受注済み案件の合計予算集計
- **難易度**: 上級（目安：15分） / **テーマ**: エンティティクラス＋リスト集計（Service層）

#### 模範解答
```java
import java.util.ArrayList;
import java.util.Scanner;

class Deal {
    String title;
    String status;
    int budget;

    public Deal(String title, String status, int budget) {
        this.title = title;
        this.status = status;
        this.budget = budget;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        ArrayList<Deal> deals = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            deals.add(new Deal(sc.next(), sc.next(), sc.nextInt()));
        }
        int wonCount = 0;
        int wonBudget = 0;
        for (int i = 0; i < deals.size(); i++) {
            Deal d = deals.get(i);
            if (d.status.equals("WON")) {
                wonCount++;
                wonBudget += d.budget;
            }
        }
        System.out.println("WonCount: " + wonCount);
        System.out.println("WonBudget: " + wonBudget);
    }
}
```

#### コードが動く順番
1. 19〜23行目：案件数 `n` を読み込み、1件ごとに `Deal` オブジェクトを作って `ArrayList<Deal>` に格納する。
2. 24〜32行目：リストを1件ずつ取り出し、`d.status.equals("WON")`（受注済み）のものだけ件数 `wonCount` と予算合計 `wonBudget` を加算する。
3. 33〜34行目：`WonCount:` と `WonBudget:` を出力する。

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**: 「データを入れる箱（`Deal` クラス）」と「複数件を束ねるリスト（`ArrayList<Deal>`）」の組み合わせは、実務の業務アプリで最もよく使う基本形です。

---

### 上級 2-2. 境界値・異常系を含む単体テスト検証メソッドの実装
- **難易度**: 中級（目安：12分） / **テーマ**: 範囲条件判定・境界値テスト（`PASS` / `FAIL`）

#### 模範解答
```java
import java.util.Scanner;

public class Main {
    public static boolean isEligible(int age) {
        return age >= 18 && age <= 65;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int t = sc.nextInt();
        for (int i = 0; i < t; i++) {
            int age = sc.nextInt();
            boolean expected = Boolean.parseBoolean(sc.next());
            boolean actual = isEligible(age);
            System.out.println(actual == expected ? "PASS" : "FAIL");
        }
    }
}
```

#### コードが動く順番
1. 10行目：テストケース数 `t` を読み込む。
2. 11〜16行目：`t` 回ループし、各ケースで：
   - 入力年齢 `age` と期待結果 `expected`（`true` / `false`）を読み込む
   - テスト対象メソッド `isEligible(age)` を実行して実測値 `actual` を得る
   - `actual == expected` なら `PASS`、異なれば `FAIL` を出力する。

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**: JUnit などの単体テストも本質はこれと全く同じ（**「テスト対象を呼ぶ → 期待値と一致するか比較する」**）です。境界値（`17`, `18`, `65`, `66`）をテストする意味を伝えると品質意識が高まります。

---

### 上級 2-3. 注文ステータス遷移バリデーション（状態遷移設計）
- **難易度**: 上級（目安：20分） / **テーマ**: ステートマシン・ホワイトリスト判定

#### 模範解答
```java
import java.util.Scanner;

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
}
```

#### コードが動く順番
1. 19行目：検証件数 `t` を読み込む。
2. 20〜24行目：1件ごとに `from`（現在状態）と `to`（遷移先）を読み込み、`canTransition(from, to)` を呼び出す。
3. 4〜15行目：許可された遷移ルート（`DRAFT→CONFIRMED/CANCELLED`, `CONFIRMED→SHIPPED/CANCELLED`, `SHIPPED→DELIVERED`）のみ `true` を返し、それ以外（終端状態 `DELIVERED` / `CANCELLED` を含む）はすべて `false` で拒否する。
4. 23行目：`true` なら `ALLOW`、`false` なら `DENY` を出力する。

#### 受講生への説明ポイント・よくあるミス
- **説明のコツ**: 「ダメな遷移を禁止する（ブラックリスト）」のではなく、「許可する遷移だけを書く（ホワイトリスト）」方が漏れがなく安全、という実務セキュリティの基本原則を伝えましょう。
