import { describe, it, expect } from "vitest";
import { runSqlCode } from "@/lib/sql";
import { parseSqlTableOutput } from "@/components/problem/sql-result-grid";
import { recordAuditLog, getAuditLogs } from "@/lib/audit-log";
import { sendSlackQuestionAlert } from "@/lib/slack";

describe("SQLエンジン・監査ログ・Slack UT / IT", () => {
  it("UT-SQL-01: CASE WHEN 複数分岐・ELSE・境界値が正しく動作する", () => {
    const setupSql = `
      CREATE TABLE scores (id INT, name TEXT, pt INT);
      INSERT INTO scores VALUES (1, 'A', 90), (2, 'B', 70), (3, 'C', 40);
    `;
    const res = runSqlCode(
      `SELECT name, CASE WHEN pt >= 80 THEN 'S' WHEN pt >= 60 THEN 'A' ELSE 'B' END AS rank FROM scores ORDER BY id ASC;`,
      { setupSql }
    );
    expect(res.status).toBe("success");
    expect(res.stdout.trim()).toBe("name | rank\nA | S\nB | A\nC | B");
  });

  it("UT-SQL-02: スカラーサブクエリ・INサブクエリ・NOT INサブクエリが正しく動作する", () => {
    const setupSql = `
      CREATE TABLE emp (id INT, name TEXT, salary INT);
      CREATE TABLE bonus (id INT, emp_id INT);
      INSERT INTO emp VALUES (1, 'A', 400), (2, 'B', 600), (3, 'C', 800);
      INSERT INTO bonus VALUES (1, 2), (2, 3);
    `;
    const rScalar = runSqlCode(
      `SELECT name FROM emp WHERE salary > (SELECT AVG(salary) FROM emp);`,
      { setupSql }
    );
    expect(rScalar.status).toBe("success");
    expect(rScalar.stdout.trim()).toBe("name\nC");

    const rIn = runSqlCode(
      `SELECT name FROM emp WHERE id IN (SELECT emp_id FROM bonus) ORDER BY id ASC;`,
      { setupSql }
    );
    expect(rIn.status).toBe("success");
    expect(rIn.stdout.trim()).toBe("name\nB\nC");

    const rNotIn = runSqlCode(
      `SELECT name FROM emp WHERE id NOT IN (SELECT emp_id FROM bonus) ORDER BY id ASC;`,
      { setupSql }
    );
    expect(rNotIn.status).toBe("success");
    expect(rNotIn.stdout.trim()).toBe("name\nA");
  });

  it("UT-SQL-03: INSERT / UPDATE / DELETE の連続CRUDと WHERE 条件が正確に動作する", () => {
    const setupSql = `
      CREATE TABLE items (id INT, name TEXT, qty INT);
      INSERT INTO items VALUES (1, 'Pen', 5), (2, 'Book', 0);
    `;
    const res = runSqlCode(
      `
      INSERT INTO items (id, name, qty) VALUES (3, 'Bag', 10);
      UPDATE items SET qty = 20 WHERE id = 1;
      DELETE FROM items WHERE qty <= 0;
      SELECT id, name, qty FROM items ORDER BY id ASC;
      `,
      { setupSql }
    );
    expect(res.status).toBe("success");
    expect(res.stdout.trim()).toBe("id | name | qty\n1 | Pen | 20\n3 | Bag | 10");
  });

  it("UT-SQL-04: 構文エラー・存在しないテーブル時にクラッシュせずエラーを返す", () => {
    const r1 = runSqlCode("SELECT * FROM non_existent_table;");
    expect(r1.status).not.toBe("success");
    expect(r1.stderr.length).toBeGreaterThan(0);

    const r2 = runSqlCode("INVALID SQL STATEMENT;");
    expect(r2.status).not.toBe("success");
  });

  it("UT-AUDIT-01: 監査ログの記録と最新順取得が正しく動作する", async () => {
    await recordAuditLog({
      actorId: "u-ut-1",
      actorEmail: "ut@example.com",
      actorRole: "admin",
      action: "ut_test_event",
      targetSummary: "UT監査ログテスト",
    });
    const logs = await getAuditLogs(5);
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].action).toBe("ut_test_event");
  });

  it("UT-SLACK-01: 不正なSlack Webhook URLがエラーとして安全に拒否される", async () => {
    const res = await sendSlackQuestionAlert({
      webhookUrl: "https://example.com/not-slack",
      companyName: "TestCo",
      studentName: "山田",
      problemTitle: "1-1",
      questionText: "質問です",
    });
    expect(res.ok).toBe(false);
  });

  it("UT-SQL-GRID-01: parseSqlTableOutput が複数列・単一列・区切り線あり出力をExcelグリッド用データへ変換できる", () => {
    const multi = parseSqlTableOutput(
      "department | member_count | avg_score\n---\nBackend | 12 | 94.5\nSQL | 9 | 91.0"
    );
    expect(multi).toEqual({
      headers: ["department", "member_count", "avg_score"],
      rows: [
        ["Backend", "12", "94.5"],
        ["SQL", "9", "91.0"],
      ],
    });

    const single = parseSqlTableOutput("city\nOsaka\nTokyo");
    expect(single).toEqual({
      headers: ["city"],
      rows: [["Osaka"], ["Tokyo"]],
    });

    expect(parseSqlTableOutput("(出力なし)")).toBeNull();
  });
});
