import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  SEED_COURSES,
  SEED_CHAPTERS,
  SEED_PROBLEMS,
  detectProblemLanguage,
} from "@/lib/seed-data";
import {
  LITERACY_PROBLEMS,
  EXCEL_PROBLEMS,
} from "@/lib/curriculum-1year-literacy-excel";
import { HTMLCSS_PROBLEMS } from "@/lib/curriculum-1year-htmlcss";
import {
  SPRINGBOOT_PROJECT_PROBLEMS,
  TEAM_PROJECT_PROBLEMS,
} from "@/lib/curriculum-1year-projects";
import {
  evaluateExcelSubmission,
  evaluateSheet,
} from "@/lib/excel/excel-engine";
import {
  buildLivePreviewHtml,
  evaluateHtmlCssSubmission,
} from "@/lib/htmlcss/htmlcss-evaluator";
import {
  evaluateLiteracySubmission,
  evaluateProjectSubmission,
  isValidGithubUrl,
} from "@/lib/curriculum-evaluators";

describe("1年間カリキュラム 総合自動テスト (UT/ST)", () => {
  it("11コース・全110問のマスターデータ整合性とUUID一意性", () => {
    expect(SEED_COURSES.length).toBe(11);
    expect(SEED_PROBLEMS.length).toBe(110);

    const courseIds = new Set(SEED_COURSES.map((c) => c.id));
    expect(courseIds.size).toBe(11);

    const chapterIds = new Set(SEED_CHAPTERS.map((c) => c.id));
    expect(chapterIds.size).toBe(SEED_CHAPTERS.length);

    const problemIds = new Set(SEED_PROBLEMS.map((p) => p.id));
    expect(problemIds.size).toBe(110);

    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    for (const p of SEED_PROBLEMS) {
      expect(uuidRe.test(p.id)).toBe(true);
      expect(chapterIds.has(p.chapter_id)).toBe(true);
    }
  });

  it("ITリテラシー導入コース（6問）：全模範解答が100%合格し、未回答は不合格", () => {
    expect(LITERACY_PROBLEMS.length).toBe(6);
    for (const p of LITERACY_PROBLEMS) {
      expect(detectProblemLanguage(p)).toBe("literacy");
      const passRes = evaluateLiteracySubmission(p.starter_code, p.solution_code);
      expect(passRes.passed, `${p.title} should pass`).toBe(true);
      expect(passRes.passedCount).toBe(passRes.totalCount);

      const failRes = evaluateLiteracySubmission(p.starter_code, "{}");
      expect(failRes.passed).toBe(false);
    }
  });

  it("Excel数式エンジン単体テスト：四則・関数・エラー処理が正確に計算される", () => {
    const grid = evaluateSheet({
      A1: 10,
      A2: 20,
      A3: 30,
      B1: "=SUM(A1:A3)",
      B2: "=AVERAGE(A1:A3)",
      B3: "=IF(B1>=50,\"OK\",\"NG\")",
      B4: "=IFERROR(10/0, 999)",
    });
    expect(grid.B1.value).toBe(60);
    expect(grid.B2.value).toBe(20);
    expect(grid.B3.value).toBe("OK");
    expect(grid.B4.value).toBe(999);
  });

  it("Excel実務マスターコース（12問）：全模範解答が100%合格し、空入力は不合格", () => {
    expect(EXCEL_PROBLEMS.length).toBe(12);
    for (const p of EXCEL_PROBLEMS) {
      expect(detectProblemLanguage(p)).toBe("excel");
      const passRes = evaluateExcelSubmission(p.starter_code, p.solution_code);
      expect(
        passRes.passed,
        `${p.title} failed: ${JSON.stringify(passRes.checks.filter((c) => !c.passed))}`
      ).toBe(true);
      expect(passRes.passedCount).toBe(passRes.totalCount);

      const failRes = evaluateExcelSubmission(p.starter_code, "{}");
      expect(failRes.passed).toBe(false);
    }
  });

  it("HTML＆CSS実践コース（12問）：全模範解答が100%合格し、安全なライブプレビューHTMLを生成", () => {
    expect(HTMLCSS_PROBLEMS.length).toBe(12);
    for (const p of HTMLCSS_PROBLEMS) {
      expect(detectProblemLanguage(p)).toBe("htmlcss");
      const passRes = evaluateHtmlCssSubmission(p.starter_code, p.solution_code);
      expect(
        passRes.passed,
        `${p.title} failed: ${JSON.stringify(passRes.checks.filter((c) => !c.passed))}`
      ).toBe(true);
      expect(passRes.passedCount).toBe(passRes.totalCount);
    }

    const preview = buildLivePreviewHtml("<h1>Test</h1><script>alert(1)</script>", "h1 { color: red; }");
    expect(preview).toContain("<h1>Test</h1>");
    expect(preview).not.toContain("<script>");
    expect(preview).toContain("h1 { color: red; }");
  });

  it("Spring Boot個人開発（6ステップ）＆チーム開発（6ステップ）：GitHub URL検証と全模範提出が合格", () => {
    expect(isValidGithubUrl("https://github.com/user/product-manager")).toBe(true);
    expect(isValidGithubUrl("http://example.com/not-github")).toBe(false);
    expect(isValidGithubUrl("https://github.com/only-user")).toBe(false);

    const allProjectProblems = [...SPRINGBOOT_PROJECT_PROBLEMS, ...TEAM_PROJECT_PROBLEMS];
    expect(allProjectProblems.length).toBe(12);

    for (const p of allProjectProblems) {
      expect(detectProblemLanguage(p)).toBe("project");
      const passRes = evaluateProjectSubmission(p.starter_code, p.solution_code);
      expect(passRes.passed, `${p.title} should pass`).toBe(true);

      const failRes = evaluateProjectSubmission(
        p.starter_code,
        JSON.stringify({ githubUrl: "invalid-url", checkedItems: [] })
      );
      expect(failRes.passed).toBe(false);
    }
  });

  it("配布Excel詳細設計書（.xlsx）2ファイルが存在し有効なOpenXMLアーカイブである", () => {
    const docsDir = path.resolve(process.cwd(), "public", "docs");
    const files = [
      "product-management-design-spec.xlsx",
      "team-project-design-spec.xlsx",
    ];
    for (const f of files) {
      const fullPath = path.join(docsDir, f);
      expect(fs.existsSync(fullPath), `${f} must exist`).toBe(true);
      const buf = fs.readFileSync(fullPath);
      expect(buf.length).toBeGreaterThan(5000);
      // ZIP magic bytes: PK\x03\x04
      expect(buf[0]).toBe(0x50);
      expect(buf[1]).toBe(0x4b);
      expect(buf[2]).toBe(0x03);
      expect(buf[3]).toBe(0x04);
    }
  });
});
