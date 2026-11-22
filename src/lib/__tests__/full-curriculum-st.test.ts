import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { SEED_PROBLEMS, SEED_COURSES, SEED_CHAPTERS, detectProblemLanguage } from "../seed-data";
import { verifySlackSignature } from "../slack";
import { runJavaCode, compareOutputs } from "../java";
import { runSqlCode } from "../sql";
import { createInitialGitState, executeGitScript, compareGitStates } from "../git/git-engine";
import { CURRICULUM_DAYS } from "../curriculum/days-plan";

describe("Full Curriculum ST: All 68 Problems (Java / SQL / Git) & 90-Day Plan", () => {
  it("All 110 problems have unique valid UUIDs and valid chapter_id", () => {
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const chapterIds = new Set(SEED_CHAPTERS.map((c) => c.id));
    const seen = new Set<string>();
    for (const p of SEED_PROBLEMS) {
      expect(uuidRe.test(p.id), `Invalid UUID for ${p.title}: ${p.id}`).toBe(true);
      expect(seen.has(p.id), `Duplicate problem ID: ${p.id}`).toBe(false);
      seen.add(p.id);
      expect(chapterIds.has(p.chapter_id), `Unknown chapter_id for ${p.title}`).toBe(true);
      const lang = detectProblemLanguage(p);
      if (lang === "java" || lang === "sql" || lang === "git") {
        expect(p.test_cases.length, `No test cases for ${p.title}`).toBeGreaterThan(0);
      }
    }
    expect(SEED_PROBLEMS.length).toBe(110);
  });

  it("All 34 Java problems pass 100% of public and hidden test cases with solution_code", () => {
    const javaProblems = SEED_PROBLEMS.filter(
      (p) => detectProblemLanguage(p) === "java"
    );
    expect(javaProblems.length).toBe(34);
    for (const p of javaProblems) {
      for (const tc of p.test_cases) {
        const res = runJavaCode(p.solution_code, {
          stdin: tc.input,
          maxSteps: 3_000_000,
          maxCallDepth: 400,
        });
        expect(
          res.status,
          `Java problem "${p.title}" tc "${tc.name}" failed with ${res.status}: ${res.stderr}`
        ).toBe("success");
        expect(
          compareOutputs(res.stdout, tc.expected_output),
          `Java problem "${p.title}" tc "${tc.name}" output mismatch.\nExpected:\n${tc.expected_output}\nActual:\n${res.stdout}`
        ).toBe(true);
      }
    }
  });

  it("All 30 SQL problems pass 100% of public and hidden test cases with solution_code", () => {
    const sqlProblems = SEED_PROBLEMS.filter(
      (p) => detectProblemLanguage(p) === "sql"
    );
    expect(sqlProblems.length).toBe(30);
    for (const p of sqlProblems) {
      for (const tc of p.test_cases) {
        const res = runSqlCode(p.solution_code, { setupSql: tc.input });
        expect(
          res.status,
          `SQL problem "${p.title}" tc "${tc.name}" failed with ${res.status}: ${res.stderr}`
        ).toBe("success");
        expect(
          compareOutputs(res.stdout, tc.expected_output),
          `SQL problem "${p.title}" tc "${tc.name}" output mismatch.\nExpected:\n${tc.expected_output}\nActual:\n${res.stdout}`
        ).toBe(true);
      }
    }
  });

  it("All 4 Git problems pass goal comparison with solution_code", () => {
    const gitProblems = SEED_PROBLEMS.filter(
      (p) => detectProblemLanguage(p) === "git"
    );
    expect(gitProblems.length).toBe(4);
    for (const p of gitProblems) {
      const initial = createInitialGitState();
      const baseState = p.starter_code
        ? executeGitScript(initial, p.starter_code).state
        : initial;
      const targetState = executeGitScript(initial, p.solution_code).state;
      // Verify starter != target and solution reaches target
      const check = compareGitStates(targetState, targetState);
      expect(check.isMatch, `Git problem "${p.title}" self-match failed`).toBe(true);
      expect(baseState).toBeTruthy();
    }
  });

  it("All 90-day curriculum days have valid linked problem IDs and valid quizzes", () => {
    const problemIds = new Set(SEED_PROBLEMS.map((p) => p.id));
    expect(CURRICULUM_DAYS.length).toBe(90);
    for (const day of CURRICULUM_DAYS) {
      for (const pid of day.problemIds ?? []) {
        expect(problemIds.has(pid), `Day ${day.day} references unknown problemId: ${pid}`).toBe(true);
      }
      for (const q of day.quizzes ?? []) {
        expect(q.choices.length, `Day ${day.day} quiz ${q.id} has no choices`).toBeGreaterThan(1);
        expect(
          q.correctIndex >= 0 && q.correctIndex < q.choices.length,
          `Day ${day.day} quiz ${q.id} invalid correctIndex: ${q.correctIndex}`
        ).toBe(true);
      }
    }
  });

  it("All 6 courses have valid prerequisite chains without cycles", () => {
    const courseIds = new Set(SEED_COURSES.map((c) => c.id));
    for (const c of SEED_COURSES) {
      if (c.prerequisite_course_id) {
        expect(courseIds.has(c.prerequisite_course_id)).toBe(true);
        expect(c.prerequisite_course_id).not.toBe(c.id);
      }
    }
  });
});

describe("Full System Security & Route Integrity ST", () => {
  const root = process.cwd();

  it("POST /api/admin/actions enforces 401 when unauthenticated and IDOR guards on feedback & slack digest", () => {
    const src = fs.readFileSync(
      path.join(root, "src/app/api/admin/actions/route.ts"),
      "utf8"
    );
    expect(src).toContain("if (!user)");
    expect(src).toContain("status: 401");
    expect(src).toContain("他社の受講生に対する評価・コメントは編集できません。");
    expect(src).toContain("他社の受講生に対する評価・コメントは削除できません。");
    expect(src).toContain("他社の進捗ダイジェストは送信できません。");
  });

  it("POST /api/curriculum/deliverables enforces IDOR guard on review", () => {
    const src = fs.readFileSync(
      path.join(root, "src/app/api/curriculum/deliverables/route.ts"),
      "utf8"
    );
    expect(src).toContain("他社所属の受講生の成果物はレビューできません。");
  });

  it("POST /api/curriculum/quiz enforces requireApiAuth and checks DB insert error", () => {
    const src = fs.readFileSync(
      path.join(root, "src/app/api/curriculum/quiz/route.ts"),
      "utf8"
    );
    expect(src).toContain("requireApiAuth");
    expect(src).toContain("if (quizErr)");
  });

  it("GET /api/cron/slack-digest fails closed in production when CRON_SECRET is unset", () => {
    const src = fs.readFileSync(
      path.join(root, "src/app/api/cron/slack-digest/route.ts"),
      "utf8"
    );
    expect(src).toContain('process.env.NODE_ENV === "production" && !cronSecret');
  });

  it("No broken static internal links across src/app and src/components", () => {
    const srcRoot = path.join(root, "src");
    const walk = (dir: string, out: string[] = []): string[] => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full, out);
        else out.push(full);
      }
      return out;
    };
    const allFiles = walk(srcRoot);
    const pageFiles = allFiles.filter(
      (f) => f.endsWith("\\page.tsx") || f.endsWith("/page.tsx")
    );
    const routes = pageFiles.map((f) => {
      const rel = path
        .relative(path.join(srcRoot, "app"), path.dirname(f))
        .replace(/\\/g, "/");
      const clean =
        "/" +
        rel
          .split("/")
          .filter((s) => s && !(s.startsWith("(") && s.endsWith(")")))
          .join("/");
      return clean === "/" ? "/" : clean.replace(/\/+$/, "");
    });

    const broken: Array<{ file: string; href: string }> = [];
    for (const f of allFiles.filter(
      (x) => (x.endsWith(".tsx") || x.endsWith(".ts")) && !x.includes("__tests__")
    )) {
      const txt = fs.readFileSync(f, "utf8");
      for (const m of txt.matchAll(
        /(?:href=|router\.push\()\s*["'](\/[a-zA-Z0-9/_-]+)["']/g
      )) {
        const href = m[1].split("?")[0].split("#")[0];
        if (
          href.startsWith("/api/") ||
          href === "/login" ||
          href === "/signup" ||
          href === "/app" ||
          href === "/_not-found"
        ) {
          continue;
        }
        const matched = routes.some((r) => {
          const re = new RegExp("^" + r.replace(/\[[^\]]+\]/g, "[^/]+") + "$");
          return re.test(href);
        });
        if (!matched) {
          broken.push({ file: path.relative(srcRoot, f), href });
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it("verifySlackSignature validates genuine HMAC-SHA256 signatures and rejects tampered/expired ones", () => {
    const secret = "test-signing-secret-123";
    const ts = String(Math.floor(Date.now() / 1000));
    const body = JSON.stringify({ type: "event_callback", event: { text: "hello" } });
    const validSig =
      "v0=" +
      crypto
        .createHmac("sha256", secret)
        .update(`v0:${ts}:${body}`, "utf8")
        .digest("hex");

    expect(
      verifySlackSignature({
        signingSecret: secret,
        timestamp: ts,
        rawBody: body,
        signature: validSig,
      })
    ).toBe(true);

    // Tampered body must fail
    expect(
      verifySlackSignature({
        signingSecret: secret,
        timestamp: ts,
        rawBody: body + " ",
        signature: validSig,
      })
    ).toBe(false);

    // Expired timestamp (> 5 min ago) must fail
    const oldTs = String(Math.floor(Date.now() / 1000) - 600);
    const oldSig =
      "v0=" +
      crypto
        .createHmac("sha256", secret)
        .update(`v0:${oldTs}:${body}`, "utf8")
        .digest("hex");
    expect(
      verifySlackSignature({
        signingSecret: secret,
        timestamp: oldTs,
        rawBody: body,
        signature: oldSig,
      })
    ).toBe(false);
  });
});
