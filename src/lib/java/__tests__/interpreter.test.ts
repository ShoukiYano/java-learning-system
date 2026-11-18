// =============================================================================
// 自作Javaインタプリタ 網羅ユニットテスト（Vitest）
// ・対応する全構文・全標準ライブラリ・エラーハンドリング・安全制限の検証
// ・シードデータ全12問の模範解答がすべての公開/非公開テストケースに通過することを自動検証
// =============================================================================

import { describe, it, expect } from "vitest";
import { runJavaCode, compareOutputs } from "../index";
import { runSqlCode } from "@/lib/sql";
import { SEED_PROBLEMS, detectProblemLanguage } from "@/lib/seed-data";

describe("Java Interpreter - 基本構文・型・演算子", () => {
  it("プリミティブ型（int, long, double, boolean, char, String）と算術・文字列連結が動作する", () => {
    const code = `
      public class Main {
        public static void main(String[] args) {
          int a = 15;
          long b = 10000000000L;
          double c = 3.5;
          boolean flag = true;
          char ch = 'A';
          String s = "Java";
          System.out.println(a / 2); // 整数除算 = 7
          System.out.println(b);
          System.out.println(a + c); // 18.5
          System.out.println(flag && (a > 10));
          System.out.println((char)(ch + 1)); // 'B'
          System.out.println(s + " " + 15);
        }
      }
    `;
    const res = runJavaCode(code);
    expect(res.status).toBe("success");
    expect(compareOutputs(res.stdout, "7\n10000000000\n18.5\ntrue\nB\nJava 15")).toBe(true);
  });

  it("複合代入、インクリメント／デクリメント（前置・後置）、三項演算子が動作する", () => {
    const code = `
      public class Main {
        public static void main(String[] args) {
          int x = 10;
          x += 5;
          int p1 = x++;
          int p2 = ++x;
          String label = (x >= 17) ? "HIGH" : "LOW";
          System.out.println(p1 + "," + p2 + "," + x + "," + label);
        }
      }
    `;
    const res = runJavaCode(code);
    expect(res.status).toBe("success");
    expect(res.stdout.trim()).toBe("15,17,17,HIGH");
  });
});

describe("Java Interpreter - 制御構文", () => {
  it("if / else if / else、従来のswitch、アロー構文のswitchが動作する", () => {
    const code = `
      public class Main {
        public static void main(String[] args) {
          int n = 2;
          switch (n) {
            case 1:
              System.out.println("ONE");
              break;
            case 2:
            case 3:
              System.out.println("TWO_OR_THREE");
              break;
            default:
              System.out.println("OTHER");
          }

          String day = "SUN";
          switch (day) {
            case "MON", "TUE" -> System.out.println("WEEKDAY");
            case "SAT", "SUN" -> System.out.println("WEEKEND");
            default -> System.out.println("UNKNOWN");
          }
        }
      }
    `;
    const res = runJavaCode(code);
    expect(res.status).toBe("success");
    expect(compareOutputs(res.stdout, "TWO_OR_THREE\nWEEKEND")).toBe(true);
  });

  it("for、拡張for、while、do-while、break、continueが動作する", () => {
    const code = `
      public class Main {
        public static void main(String[] args) {
          int sum = 0;
          for (int i = 1; i <= 10; i++) {
            if (i % 2 == 0) continue;
            if (i > 7) break;
            sum += i; // 1 + 3 + 5 + 7 = 16
          }

          int[] arr = {10, 20, 30};
          for (int v : arr) {
            sum += v;
          }

          int w = 3;
          do {
            sum += 1;
            w--;
          } while (w > 0);

          System.out.println(sum);
        }
      }
    `;
    const res = runJavaCode(code);
    expect(res.status).toBe("success");
    expect(res.stdout.trim()).toBe("79");
  });
});

describe("Java Interpreter - 配列（1次元・2次元）・メソッド・オーバーロード・再帰", () => {
  it("1次元・2次元配列の初期化と要素アクセスが動作する", () => {
    const code = `
      public class Main {
        public static void main(String[] args) {
          int[][] grid = new int[2][3];
          grid[0][1] = 7;
          grid[1][2] = 9;
          int[][] literalGrid = {{1, 2}, {3, 4}};
          System.out.println(grid[0][1] + grid[1][2] + literalGrid[1][0]);
        }
      }
    `;
    const res = runJavaCode(code);
    expect(res.status).toBe("success");
    expect(res.stdout.trim()).toBe("19");
  });

  it("staticメソッドのオーバーロードと再帰呼び出しが動作する", () => {
    const code = `
      public class Main {
        public static int add(int a, int b) {
          return a + b;
        }
        public static double add(double a, double b) {
          return a + b;
        }
        public static int fib(int n) {
          if (n <= 1) return n;
          return fib(n - 1) + fib(n - 2);
        }
        public static void main(String[] args) {
          System.out.println(add(3, 4));
          System.out.println(add(1.5, 2.25));
          System.out.println(fib(7));
        }
      }
    `;
    const res = runJavaCode(code);
    expect(res.status).toBe("success");
    expect(compareOutputs(res.stdout, "7\n3.75\n13")).toBe(true);
  });
});

describe("Java Interpreter - オブジェクト指向（クラス、継承、super、abstract、interface、instanceof）", () => {
  it("extendsによる継承、superコンストラクタ、オーバーライド、interface、instanceofが動作する", () => {
    const code = `
      interface Printable {
        String format();
      }

      abstract class Shape implements Printable {
        String name;
        public Shape(String name) {
          this.name = name;
        }
        public abstract int area();
      }

      class Rectangle extends Shape {
        int w;
        int h;
        public Rectangle(int w, int h) {
          super("Rect");
          this.w = w;
          this.h = h;
        }
        @Override
        public int area() {
          return this.w * this.h;
        }
        @Override
        public String format() {
          return this.name + ":" + this.area();
        }
      }

      public class Main {
        public static void main(String[] args) {
          Shape s = new Rectangle(4, 6);
          System.out.println(s instanceof Rectangle);
          System.out.println(s instanceof Printable);
          System.out.println(s.format());
        }
      }
    `;
    const res = runJavaCode(code);
    expect(res.status).toBe("success");
    expect(compareOutputs(res.stdout, "true\ntrue\nRect:24")).toBe(true);
  });
});

describe("Java Interpreter - 例外処理（try / catch / finally / throw / カスタム例外）", () => {
  it("ArithmeticException のキャッチ、finally の実行、カスタム例外の throw が動作する", () => {
    const code = `
      class CustomAppException extends Exception {
        public CustomAppException(String msg) {
          super(msg);
        }
      }

      public class Main {
        public static void checkPositive(int v) throws CustomAppException {
          if (v < 0) {
            throw new CustomAppException("Negative:" + v);
          }
        }

        public static void main(String[] args) {
          try {
            int x = 10 / 0;
            System.out.println(x);
          } catch (ArithmeticException e) {
            System.out.println("Caught Arithmetic");
          } finally {
            System.out.println("Finally1");
          }

          try {
            checkPositive(-5);
          } catch (CustomAppException e) {
            System.out.println("Caught Custom: " + e.getMessage());
          }
        }
      }
    `;
    const res = runJavaCode(code);
    expect(res.status).toBe("success");
    expect(
      compareOutputs(
        res.stdout,
        "Caught Arithmetic\nFinally1\nCaught Custom: Negative:-5"
      )
    ).toBe(true);
  });
});

describe("Java Interpreter - 標準ライブラリ（Scanner, String, Math, StringBuilder, コレクション, Arrays, ラムダ式）", () => {
  it("Scanner, String, StringBuilder, Math, Integer, Double, Arrays が動作する", () => {
    const code = `
      import java.util.*;

      public class Main {
        public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          String word = sc.next();
          int num = sc.nextInt();

          StringBuilder sb = new StringBuilder(word.toUpperCase());
          sb.reverse();

          int[] arr = {5, 1, 9, 3};
          Arrays.sort(arr);

          System.out.printf("%s-%d-%s-max:%d\\n",
            sb.toString(),
            Integer.parseInt("42") + num,
            Arrays.toString(arr),
            Math.max(10, 25)
          );
        }
      }
    `;
    const res = runJavaCode(code, { stdin: "hello 8" });
    expect(res.status).toBe("success");
    expect(res.stdout.trim()).toBe("OLLEH-50-[1, 3, 5, 9]-max:25");
  });

  it("ArrayList, HashMap, HashSet とラムダ式 forEach が動作する", () => {
    const code = `
      import java.util.*;

      public class Main {
        public static void main(String[] args) {
          ArrayList<Integer> list = new ArrayList<>();
          list.add(10);
          list.add(20);
          list.add(30);

          final int[] sum = {0};
          list.forEach(x -> {
            sum[0] += x;
          });

          HashMap<String, Integer> map = new HashMap<>();
          map.put("apple", 3);
          map.put("banana", map.getOrDefault("banana", 0) + 5);

          HashSet<String> set = new HashSet<>();
          set.add("A");
          set.add("A");
          set.add("B");

          System.out.println(sum[0] + "/" + map.get("apple") + "/" + map.get("banana") + "/" + set.size());
        }
      }
    `;
    const res = runJavaCode(code);
    expect(res.status).toBe("success");
    expect(res.stdout.trim()).toBe("60/3/5/2");
  });
});

describe("Java Interpreter - エラー診断（コンパイルエラー＆日本語補足）と安全制限", () => {
  it("セミコロン忘れ・未宣言変数・型不一致を行番号と日本語補足付きで検出する", () => {
    const missingSemi = `
      public class Main {
        public static void main(String[] args) {
          int a = 10
          System.out.println(a);
        }
      }
    `;
    const res1 = runJavaCode(missingSemi);
    expect(res1.status).toBe("compile_error");
    expect(res1.diagnostics.length).toBeGreaterThan(0);
    expect(res1.diagnostics[0].japaneseHint).toContain("セミコロン");

    const undeclaredVar = `
      public class Main {
        public static void main(String[] args) {
          System.out.println(unknownVariable);
        }
      }
    `;
    const res2 = runJavaCode(undeclaredVar);
    expect(res2.status).toBe("compile_error");
    expect(res2.diagnostics[0].line).toBe(4);
    expect(res2.diagnostics[0].message).toContain("unknownVariable");

    const typeMismatch = `
      public class Main {
        public static void main(String[] args) {
          int num = "not a number";
        }
      }
    `;
    const res3 = runJavaCode(typeMismatch);
    expect(res3.status).toBe("compile_error");
    expect(res3.diagnostics[0].message).toContain("型の不一致");
  });

  it("無限ループ時にステップ数上限で安全に停止し、無限再帰時にStackOverflowErrorを返す", () => {
    const infiniteLoop = `
      public class Main {
        public static void main(String[] args) {
          int x = 0;
          while (true) {
            x++;
          }
        }
      }
    `;
    const resLoop = runJavaCode(infiniteLoop, { maxSteps: 5000 });
    expect(resLoop.status).toBe("step_limit_exceeded");

    const infiniteRecursion = `
      public class Main {
        public static int recurse(int n) {
          return recurse(n + 1);
        }
        public static void main(String[] args) {
          recurse(1);
        }
      }
    `;
    const resRec = runJavaCode(infiniteRecursion, { maxCallDepth: 80 });
    expect(resRec.status).toBe("runtime_error");
    expect(resRec.runtimeError?.exceptionClass).toBe("StackOverflowError");
  });
});

describe("Seed Data Verification - Java全12問＋SQL全6問の模範解答が全テストケースに通過する", () => {
  for (const problem of SEED_PROBLEMS) {
    it(`問題「${problem.title}」の模範解答が全${problem.test_cases.length}件のテストケースに合格する`, () => {
      const lang = detectProblemLanguage(problem);
      for (const tc of problem.test_cases) {
        const result =
          lang === "sql"
            ? runSqlCode(problem.solution_code, { setupSql: tc.input })
            : runJavaCode(problem.solution_code, { stdin: tc.input });
        expect(result.status).toBe("success");
        expect(compareOutputs(result.stdout, tc.expected_output)).toBe(true);
      }
    });
  }
});
