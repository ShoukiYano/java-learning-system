import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { NextRequest } from "next/server";
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
  isValidGithubPrUrl,
  isValidGithubUrl,
} from "@/lib/curriculum-evaluators";
import { getStudentCourseLockStatuses } from "@/lib/data-service";
import { POST as submitProblemPOST } from "@/app/api/problems/submit/route";
import { POST as studentQuestionsPOST } from "@/app/api/student/questions/route";
import { JAVA_INTRO_EXTRA_PROBLEMS } from "@/lib/java-intro-extra-problems";
import { JAVA_BEGINNER_80_EXTRA } from "@/lib/java-80-beginner-extra";
import { JAVA_INTERMEDIATE_80_EXTRA } from "@/lib/java-80-intermediate-extra";
import { JAVA_ADVANCED_80_EXTRA } from "@/lib/java-80-advanced-extra";
import { parseProjectStepSpec } from "@/lib/curriculum-evaluators";

/** Minimal ZIP entry extractor to verify real .xlsx OpenXML archives without external deps */
function extractZipEntries(buf: Buffer): Record<string, string> {
  const files: Record<string, string> = {};
  let offset = 0;
  while (offset + 30 <= buf.length) {
    const sig = buf.readUInt32LE(offset);
    if (sig !== 0x04034b50) break; // stop at Central Directory
    const method = buf.readUInt16LE(offset + 8);
    const compSize = buf.readUInt32LE(offset + 18);
    const nameLen = buf.readUInt16LE(offset + 26);
    const extraLen = buf.readUInt16LE(offset + 28);
    const name = buf.subarray(offset + 30, offset + 30 + nameLen).toString("utf8");
    const dataStart = offset + 30 + nameLen + extraLen;
    const compData = buf.subarray(dataStart, dataStart + compSize);
    const raw = method === 8 ? zlib.inflateRawSync(compData) : compData;
    files[name] = raw.toString("utf8");
    offset = dataStart + compSize;
  }
  return files;
}

describe("1年間カリキュラム 総合検証テスト (UT / IT / ST)", () => {
  // =========================================================================
  // UT: 単体テスト (Unit Tests)
  // =========================================================================
  describe("UT: Excel数式エンジン・エッジケース検証", () => {
    it("四則・小文字関数・空白入り範囲・VLOOKUP(0/FALSE)・XLOOKUP・IFERROR・循環参照", () => {
      const grid = evaluateSheet({
        A1: 10,
        A2: 20,
        A3: 30,
        B1: "=sum( a1 : a3 )",
        B2: "=AVERAGE(A1:A3)",
        B3: '=IF(B1>=50,"OK","NG")',
        B4: "=IFERROR(10/0, 999)",
        B5: "=10/0",
        C1: "=D1",
        D1: "=C1",
        E1: "P01",
        F1: "商品A",
        G1: "=VLOOKUP(\"P01\", E1:F1, 2, 0)",
        G2: "=VLOOKUP(\"P99\", E1:F1, 2, FALSE)",
        G3: '=IFERROR(VLOOKUP("P99", E1:F1, 2, FALSE), "未登録")',
      });
      expect(grid.B1.value).toBe(60);
      expect(grid.B2.value).toBe(20);
      expect(grid.B3.value).toBe("OK");
      expect(grid.B4.value).toBe(999);
      expect(grid.B5.error).toBe("#DIV/0!");
      expect(grid.C1.error).toBe("#REF!");
      expect(grid.G1.value).toBe("商品A");
      expect(grid.G2.error).toBe("#N/A");
      expect(grid.G3.value).toBe("未登録");
    });

    it("直値手入力（=なし）や必須関数未使用を自動採点が正しく不合格にする", () => {
      const e1 = EXCEL_PROBLEMS[0];
      // 数値だけ手入力した場合
      const hardcoded = evaluateExcelSubmission(
        e1.starter_code,
        JSON.stringify({ D2: "240000", D3: "17500", D4: "14400", D5: "271900" })
      );
      expect(hardcoded.passed).toBe(false);
      expect(hardcoded.passedCount).toBe(0);

      // D5でSUMを使わず足し算した場合
      const noSum = evaluateExcelSubmission(
        e1.starter_code,
        JSON.stringify({ D2: "=B2*C2", D3: "=B3*C3", D4: "=B4*C4", D5: "=D2+D3+D4" })
      );
      expect(noSum.passed).toBe(false);
      expect(noSum.passedCount).toBe(3);
    });
  });

  describe("UT: HTML&CSS評価器・XSSサニタイズ・コメント除外", () => {
    it("HTMLコメント内・CSSコメント内の偽コードは合格にならない", () => {
      const h1 = HTMLCSS_PROBLEMS[0];
      const fakeComment = evaluateHtmlCssSubmission(
        h1.starter_code,
        JSON.stringify({
          html: "<!-- <h1>Fake</h1><p>Fake</p><ul><li>1</li><li>2</li><li>3</li></ul> -->",
          css: "/* h1 { color: red; } */",
        })
      );
      expect(fakeComment.passed).toBe(false);
      expect(fakeComment.passedCount).toBe(0);
    });

    it("大文字タグを許容し、<script>タグはプレビューHTMLから確実に除去される", () => {
      const h1 = HTMLCSS_PROBLEMS[0];
      const upper = evaluateHtmlCssSubmission(
        h1.starter_code,
        JSON.stringify({
          html: "<H1>Title</H1><P>Body</P><UL><LI>1</LI><LI>2</LI><LI>3</LI></UL>",
          css: "",
        })
      );
      expect(upper.passed).toBe(true);

      const preview = buildLivePreviewHtml(
        "<h1>Safe</h1><script>alert('xss')</script>",
        "h1 { color: blue; }</style><script>alert(2)</script>"
      );
      expect(preview).toContain("<h1>Safe</h1>");
      expect(preview).not.toContain("<script>");
    });
  });

  describe("UT: GitHub URL検証＆プロジェクト提出チェック", () => {
    it("有効なGitHub Pull Request URLのみ許可し、リポジトリTOPや不正URLを拒否する", () => {
      expect(isValidGithubUrl("https://github.com/user-1/product-manager")).toBe(true);
      expect(isValidGithubPrUrl("https://github.com/user-1/product-manager/pull/1")).toBe(true);
      expect(isValidGithubPrUrl("https://github.com/team.org/teamops-hub/pull/12/files")).toBe(true);
      expect(isValidGithubPrUrl("https://github.com/user-1/product-manager")).toBe(false);
      expect(isValidGithubPrUrl("http://github.com/user/repo/pull/1")).toBe(false);
      expect(isValidGithubPrUrl("https://gitlab.com/user/repo/pull/1")).toBe(false);
      expect(isValidGithubPrUrl("javascript:alert(1)")).toBe(false);
    });

    it("PR URLが有効でもチェックリスト未完了なら不合格、リポジトリTOPのみの提出も不合格になる", () => {
      const p1 = SPRINGBOOT_PROJECT_PROBLEMS[0];
      const incomplete = evaluateProjectSubmission(
        p1.starter_code,
        JSON.stringify({
          githubUrl: "https://github.com/student/product-manager/pull/1",
          checkedItems: [0, 1],
        })
      );
      expect(incomplete.passed).toBe(false);

      const repoTopOnly = evaluateProjectSubmission(
        p1.starter_code,
        JSON.stringify({
          githubUrl: "https://github.com/student/product-manager",
          checkedItems: [0, 1, 2, 3],
        })
      );
      expect(repoTopOnly.passed).toBe(false);
    });
  });

  // =========================================================================
  // IT: 結合テスト (Integration Tests)
  // =========================================================================
  describe("IT: 新5コース全42問・API採点エンドポイント＆トラック分類結合", () => {
    it("ITリテラシー(6)・Excel(12)・HTML&CSS(12)・プロジェクト(12)の全模範解答が100%合格", () => {
      for (const p of LITERACY_PROBLEMS) {
        expect(detectProblemLanguage(p)).toBe("literacy");
        expect(evaluateLiteracySubmission(p.starter_code, p.solution_code).passed).toBe(true);
      }
      for (const p of EXCEL_PROBLEMS) {
        expect(detectProblemLanguage(p)).toBe("excel");
        expect(evaluateExcelSubmission(p.starter_code, p.solution_code).passed).toBe(true);
      }
      for (const p of HTMLCSS_PROBLEMS) {
        expect(detectProblemLanguage(p)).toBe("htmlcss");
        expect(evaluateHtmlCssSubmission(p.starter_code, p.solution_code).passed).toBe(true);
      }
      for (const p of [...SPRINGBOOT_PROJECT_PROBLEMS, ...TEAM_PROJECT_PROBLEMS]) {
        expect(detectProblemLanguage(p)).toBe("project");
        expect(evaluateProjectSubmission(p.starter_code, p.solution_code).passed).toBe(true);
      }
    });

    it("POST /api/problems/submit で新4種別の誤答提出が正しく wrong_answer を返す", async () => {
      const samples = [
        { prob: LITERACY_PROBLEMS[0], wrongCode: "{}" },
        { prob: EXCEL_PROBLEMS[0], wrongCode: "{}" },
        { prob: HTMLCSS_PROBLEMS[0], wrongCode: JSON.stringify({ html: "", css: "" }) },
        { prob: SPRINGBOOT_PROJECT_PROBLEMS[0], wrongCode: JSON.stringify({ githubUrl: "bad", checkedItems: [] }) },
      ];

      let ipCounter = 10;
      for (const { prob, wrongCode } of samples) {
        const req = new NextRequest("http://localhost:3000/api/problems/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": `10.10.0.${ipCounter++}`,
          },
          body: JSON.stringify({ problemId: prob.id, code: wrongCode }),
        });
        const res = await submitProblemPOST(req);
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.allPassed).toBe(false);
        expect(body.status).toBe("wrong_answer");
        expect(body.totalCount).toBeGreaterThan(0);
      }
    });

    it("企業ポータル用コースロック一覧で全11コースの trackLabel が正確に分類される", async () => {
      const locks = await getStudentCourseLockStatuses(
        "a0000000-0000-4000-8000-000000000001",
        "00000000-0000-4000-8000-000000000001"
      );
      expect(locks.length).toBe(11);
      const labels = locks.map((l) => l.trackLabel);
      expect(labels).toContain("ITリテラシー Track");
      expect(labels).toContain("Excel実務 Track");
      expect(labels).toContain("HTML & CSS Track");
      expect(labels).toContain("Java Programming Track");
      expect(labels).toContain("SQL Database Track");
      expect(labels).toContain("Git Version Control Track");
      expect(labels).toContain("Spring Boot 個人開発 Track");
      expect(labels).toContain("チーム開発 Track");
    });

    it("POST /api/student/questions：JSON後方互換・画像添付(FormData)正常系・不正MIME/4枚超/空本文のバリデーション", async () => {
      // 1. JSON 後方互換
      const jsonReq = new NextRequest("http://localhost:3000/api/student/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: SPRINGBOOT_PROJECT_PROBLEMS[0].id,
          problemTitle: SPRINGBOOT_PROJECT_PROBLEMS[0].title,
          questionText: "PostgreSQLのポート5432接続について質問です",
        }),
      });
      const jsonRes = await studentQuestionsPOST(jsonReq);
      expect(jsonRes.status).toBe(200);
      expect((await jsonRes.json()).ok).toBe(true);

      // 2. multipart/form-data 画像添付正常系（1x1 PNG）
      const pngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      const fdOk = new FormData();
      fdOk.append("problemId", TEAM_PROJECT_PROBLEMS[0].id);
      fdOk.append("problemTitle", TEAM_PROJECT_PROBLEMS[0].title);
      fdOk.append("questionText", "Eclipseエラー画面のスクショを送ります");
      fdOk.append("images", new File([pngBytes], "error.png", { type: "image/png" }));
      const fdOkRes = await studentQuestionsPOST(
        new NextRequest("http://localhost:3000/api/student/questions", {
          method: "POST",
          body: fdOk,
        })
      );
      expect(fdOkRes.status).toBe(200);
      expect((await fdOkRes.json()).ok).toBe(true);

      // 3. 不正MIME（PDF）拒否
      const fdBadMime = new FormData();
      fdBadMime.append("questionText", "PDFを貼ります");
      fdBadMime.append("images", new File([new Uint8Array([1, 2, 3])], "doc.pdf", { type: "application/pdf" }));
      const badMimeRes = await studentQuestionsPOST(
        new NextRequest("http://localhost:3000/api/student/questions", {
          method: "POST",
          body: fdBadMime,
        })
      );
      expect(badMimeRes.status).toBe(400);

      // 4. 4枚超拒否
      const fdTooMany = new FormData();
      fdTooMany.append("questionText", "4枚貼ります");
      for (let i = 0; i < 4; i++) {
        fdTooMany.append("images", new File([pngBytes], `img${i}.png`, { type: "image/png" }));
      }
      const tooManyRes = await studentQuestionsPOST(
        new NextRequest("http://localhost:3000/api/student/questions", {
          method: "POST",
          body: fdTooMany,
        })
      );
      expect(tooManyRes.status).toBe(400);

      // 5. 空本文拒否
      const fdEmpty = new FormData();
      fdEmpty.append("questionText", "   ");
      const emptyRes = await studentQuestionsPOST(
        new NextRequest("http://localhost:3000/api/student/questions", {
          method: "POST",
          body: fdEmpty,
        })
      );
      expect(emptyRes.status).toBe(400);
    });

    it("Java 4か月80問のコース配分（入門30/初級18/中級16/上級16）と単元内 order_index 一意性", () => {
      const chToCourse = new Map(SEED_CHAPTERS.map((ch) => [ch.id, ch.course_id]));
      const countByCourse = new Map<string, number>();
      const lessonOrderSet = new Set<string>();

      for (const p of SEED_PROBLEMS) {
        const cid = chToCourse.get(p.chapter_id)!;
        countByCourse.set(cid, (countByCourse.get(cid) ?? 0) + 1);
        const key = `${p.lesson_id}:${p.order_index}`;
        expect(lessonOrderSet.has(key), `Duplicate order_index ${key} for ${p.title}`).toBe(false);
        lessonOrderSet.add(key);
      }

      const introCourse = SEED_COURSES.find((c) => c.title.includes("Java入門"))!;
      const begCourse = SEED_COURSES.find((c) => c.title.includes("Java初級"))!;
      const midCourse = SEED_COURSES.find((c) => c.title.includes("Java中級"))!;
      const advCourse = SEED_COURSES.find((c) => c.title.includes("Java上級"))!;

      expect(countByCourse.get(introCourse.id)).toBe(30);
      expect(countByCourse.get(begCourse.id)).toBe(18);
      expect(countByCourse.get(midCourse.id)).toBe(16);
      expect(countByCourse.get(advCourse.id)).toBe(16);
    });

    it("全12プロジェクトステップに推奨ブランチが設定され、PR URLルールがAPIで強制される", async () => {
      const allProj = [...SPRINGBOOT_PROJECT_PROBLEMS, ...TEAM_PROJECT_PROBLEMS];
      for (const p of allProj) {
        const spec = parseProjectStepSpec(p.starter_code);
        expect(spec?.recommendedBranch, `Missing recommendedBranch for ${p.title}`).toBeTruthy();
      }
      // リポジトリTOP URL提出は wrong_answer になること
      const topReq = new NextRequest("http://localhost:3000/api/problems/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "10.99.0.1" },
        body: JSON.stringify({
          problemId: SPRINGBOOT_PROJECT_PROBLEMS[0].id,
          code: JSON.stringify({
            githubUrl: "https://github.com/student/product-manager",
            checkedItems: [0, 1, 2, 3],
          }),
        }),
      });
      const topRes = await submitProblemPOST(topReq);
      expect(topRes.status).toBe(200);
      expect((await topRes.json()).allPassed).toBe(false);
    });
  });

  // =========================================================================
  // ST: システムテスト (System Tests)
  // =========================================================================
  describe("ST: 11コース/110問整合性・Excel詳細設計書OpenXML内部構造・SQLマイグレーション", () => {
    it("11コース・全156問のマスターデータ整合性とUUID一意性、および1本道開放順チェーン", () => {
      expect(SEED_COURSES.length).toBe(11);
      expect(SEED_PROBLEMS.length).toBe(156);
      expect(new Set(SEED_COURSES.map((c) => c.id)).size).toBe(11);
      expect(new Set(SEED_CHAPTERS.map((c) => c.id)).size).toBe(SEED_CHAPTERS.length);
      expect(new Set(SEED_PROBLEMS.map((p) => p.id)).size).toBe(156);

      // ITリテラシー導入 -> Excel -> HTML&CSS -> Java(入門/初級/中級/上級) -> SQL -> Git -> Spring Boot個人開発 -> チーム開発
      const sorted = [...SEED_COURSES].sort((a, b) => a.order_index - b.order_index);
      expect(sorted[0].prerequisite_course_id).toBeNull();
      expect(sorted[0].title).toContain("ITリテラシー導入");
      for (let i = 1; i < sorted.length; i++) {
        expect(
          sorted[i].prerequisite_course_id,
          `Course #${i + 1} (${sorted[i].title}) must require Course #${i} (${sorted[i - 1].title})`
        ).toBe(sorted[i - 1].id);
      }
    });

    it("配布Excel詳細設計書 v1.1.0（.xlsx）2ファイルをZIP展開し全シートXML整合性・日本語UTF-8・v1.1.0仕様を検証", () => {
      const docsDir = path.resolve(process.cwd(), "public", "docs");
      const specs = [
        {
          file: "product-management-design-spec.xlsx",
          expectedSheets: 12,
          keywords: [
            "商品管理システム",
            "1.1.0",
            "Maven（pom.xml",
            "Pull Request",
            "CREATE TABLE products",
            "TC-001",
            "TC-022",
            "existsBySkuAndIdNot",
            "ProductController",
            "D-01",
          ],
        },
        {
          file: "team-project-design-spec.xlsx",
          expectedSheets: 13,
          keywords: [
            "TeamOps Hub",
            "1.1.0",
            "Maven（pom.xml",
            "Pull Request",
            "メンバーA",
            "SCR-00",
            "CREATE TABLE equipment_loans",
            "FOR UPDATE",
            "AccessDeniedException",
            "IT-001",
            "IT-012",
          ],
        },
      ];

      for (const { file, expectedSheets, keywords } of specs) {
        const fullPath = path.join(docsDir, file);
        expect(fs.existsSync(fullPath)).toBe(true);
        const buf = fs.readFileSync(fullPath);
        const entries = extractZipEntries(buf);

        // Must contain core OpenXML parts + all expected worksheets
        expect(entries["[Content_Types].xml"]).toBeDefined();
        expect(entries["_rels/.rels"]).toBeDefined();
        expect(entries["xl/workbook.xml"]).toBeDefined();
        expect(entries["xl/_rels/workbook.xml.rels"]).toBeDefined();
        expect(entries["xl/styles.xml"]).toBeDefined();
        expect(entries["xl/sharedStrings.xml"]).toBeDefined();
        for (let i = 1; i <= expectedSheets; i++) {
          expect(entries[`xl/worksheets/sheet${i}.xml`], `${file} sheet${i}`).toContain("</worksheet>");
        }

        // Verify Excel sheet name constraints (<= 31 chars, no illegal chars \ / ? * [ ] :)
        const sheetNameMatches = [...entries["xl/workbook.xml"].matchAll(/name="([^"]+)"/g)];
        expect(sheetNameMatches.length).toBe(expectedSheets);
        for (const m of sheetNameMatches) {
          const sName = m[1];
          expect(sName.length, `Sheet name too long: ${sName}`).toBeLessThanOrEqual(31);
          expect(/[\\/?*[\]:]/.test(sName), `Illegal char in sheet name: ${sName}`).toBe(false);
        }

        // Verify key Japanese & DDL content exists in sharedStrings.xml and Gradle is not referenced
        const ss = entries["xl/sharedStrings.xml"];
        expect(ss, `${file} should not contain Gradle`).not.toContain("Gradle");
        for (const kw of keywords) {
          expect(ss, `${file} should contain "${kw}"`).toContain(kw);
        }
      }
    });

    it("SupabaseマイグレーションSQLに全11コースID・新規88問IDとtest_casesがすべて含まれている", () => {
      const sqlPath = path.resolve(
        process.cwd(),
        "supabase",
        "migrations",
        "20261123_1year_curriculum_expansion.sql"
      );
      expect(fs.existsSync(sqlPath)).toBe(true);
      const sql = fs.readFileSync(sqlPath, "utf8");
      for (const c of SEED_COURSES) {
        expect(sql, `Course ${c.id} missing in migration`).toContain(c.id);
      }
      const newProblems = [
        ...LITERACY_PROBLEMS,
        ...EXCEL_PROBLEMS,
        ...HTMLCSS_PROBLEMS,
        ...JAVA_INTRO_EXTRA_PROBLEMS,
        ...JAVA_BEGINNER_80_EXTRA,
        ...JAVA_INTERMEDIATE_80_EXTRA,
        ...JAVA_ADVANCED_80_EXTRA,
        ...SPRINGBOOT_PROJECT_PROBLEMS,
        ...TEAM_PROJECT_PROBLEMS,
      ];
      expect(newProblems.length).toBe(88);
      for (const p of newProblems) {
        expect(sql, `Problem ${p.id} missing in migration`).toContain(p.id);
      }
      expect(sql).toContain("INSERT INTO public.test_cases");
    });
  });
});
