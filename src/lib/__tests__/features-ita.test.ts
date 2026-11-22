import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { SEED_PROBLEMS, detectProblemLanguage } from "@/lib/seed-data";
import {
  getCoursesWithProgress,
  getCompanyProgressMatrix,
  getGraduationEvaluationFromDb,
  getCompanyDelayAlertDays,
  getReadAnnouncementIdsFromDb,
} from "@/lib/data-service";
import { POST as submitProblemPost } from "@/app/api/problems/submit/route";
import { POST as bulkImportPost } from "@/app/api/company/students/bulk-import/route";
import { POST as graduationPost } from "@/app/api/company/graduation/route";
import { POST as companySettingsPost } from "@/app/api/company/settings/route";
import { POST as studentQuestionPost } from "@/app/api/student/questions/route";
import { POST as announcementReadPost } from "@/app/api/student/announcements/read/route";
import { POST as changePasswordPost } from "@/app/api/auth/change-password/route";
import { POST as forgotPasswordPost } from "@/app/api/auth/forgot-password/route";
import { POST as adminActionsPost } from "@/app/api/admin/actions/route";
import { GET as cronSlackGet } from "@/app/api/cron/slack-digest/route";
import { getAuditLogs } from "@/lib/audit-log";

describe("全機能結合テスト（Features ITA：全問題採点・企業・受講生・管理者）", () => {
  it("F-ITA-01: 全問題（1年間カリキュラム全110問）の模範解答が /api/problems/submit で全テスト合格する", async () => {
    expect(SEED_PROBLEMS.length).toBe(110);
    const failedProblems: Array<{
      id: string;
      title: string;
      lang: string;
      status: string;
      detail: unknown;
    }> = [];
    let ipCounter = 1;

    for (const prob of SEED_PROBLEMS) {
      const lang = detectProblemLanguage(prob);
      // Git問題は startState(=starter_code実行済) に対して追加コマンドのみを提出する仕様
      let submitCode = prob.solution_code;
      if (lang === "git" && prob.starter_code && prob.solution_code.startsWith(prob.starter_code)) {
        submitCode = prob.solution_code.slice(prob.starter_code.length).trim();
      }

      const req = new NextRequest("http://localhost:3000/api/problems/submit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": `10.9.0.${ipCounter++}`,
        },
        body: JSON.stringify({
          problemId: prob.id,
          code: submitCode,
          timeSpentSeconds: 60,
        }),
      });
      const res = await submitProblemPost(req);
      const json = await res.json();
      if (res.status !== 200 || !json.allPassed) {
        failedProblems.push({
          id: prob.id,
          title: prob.title,
          lang,
          status: `${res.status}/${json.status}`,
          detail:
            json.compileError ||
            json.error ||
            json.results?.filter((r: { passed: boolean }) => !r.passed),
        });
      }
    }

    expect(failedProblems).toEqual([]);
  }, 30000);

  it("F-ITA-02: Java不正解コード・コンパイルエラーが適切に不合格判定される", async () => {
    const p1 = SEED_PROBLEMS[0];
    const wrongRes = await submitProblemPost(
      new NextRequest("http://localhost:3000/api/problems/submit", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": "10.1.0.1" },
        body: JSON.stringify({
          problemId: p1.id,
          code: `public class Main { public static void main(String[] args) { System.out.println("WRONG"); } }`,
        }),
      })
    );
    const wrongJson = await wrongRes.json();
    expect(wrongRes.status).toBe(200);
    expect(wrongJson.allPassed).toBe(false);

    const errRes = await submitProblemPost(
      new NextRequest("http://localhost:3000/api/problems/submit", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": "10.1.0.2" },
        body: JSON.stringify({
          problemId: p1.id,
          code: `public class Main { broken syntax`,
        }),
      })
    );
    const errJson = await errRes.json();
    expect(errRes.status).toBe(200);
    expect(errJson.status).toBe("compile_error");
  });

  it("F-ITA-03: コース前提解放チェーン（ITリテラシー→Excel→HTML&CSS→Java入門〜上級→SQL→Git→Spring Boot個人開発→チーム開発）が正しく構成されている", async () => {
    const courses = await getCoursesWithProgress(
      "demo-student-id",
      "00000000-0000-4000-8000-000000000001"
    );
    const byTitle = (kw: string) => courses.find((c) => c.title.includes(kw));
    const lit = byTitle("ITリテラシー");
    const excel = byTitle("Excel");
    const html = byTitle("HTML");
    const intro = byTitle("Java入門");
    const beg = byTitle("Java初級");
    const mid = byTitle("Java中級");
    const adv = byTitle("Java上級");
    const sql = byTitle("SQL実践");
    const git = byTitle("Git実践");
    const sb = byTitle("Spring Boot");
    const team = byTitle("チーム開発");

    expect(lit?.isLocked).toBe(false);
    expect(excel?.prerequisite_course_id).toBe(lit?.id);
    expect(html?.prerequisite_course_id).toBe(excel?.id);
    expect(intro?.prerequisite_course_id).toBe(html?.id);
    expect(beg?.prerequisite_course_id).toBe(intro?.id);
    expect(mid?.prerequisite_course_id).toBe(beg?.id);
    expect(adv?.prerequisite_course_id).toBe(mid?.id);
    expect(sql?.prerequisite_course_id).toBe(adv?.id);
    expect(git?.prerequisite_course_id).toBe(sql?.id);
    expect(sb?.prerequisite_course_id).toBe(git?.id);
    expect(team?.prerequisite_course_id).toBe(sb?.id);
  });

  it("F-ITA-04: 企業機能（CSV一括登録・100点修了判定保存・遅れアラート基準・進捗マトリクス）", async () => {
    const emptyRes = await bulkImportPost(
      new NextRequest("http://localhost:3000/api/company/students/bulk-import", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ rows: [] }),
      })
    );
    expect(emptyRes.status).toBe(400);

    const importRes = await bulkImportPost(
      new NextRequest("http://localhost:3000/api/company/students/bulk-import", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          rows: [
            { fullName: "テスト太郎", email: "ita-taro@example.com" },
            { fullName: "不正メール", email: "invalid-email" },
          ],
        }),
      })
    );
    const importJson = await importRes.json();
    expect(importRes.status).toBe(200);
    expect(importJson.results[0].status).toBe("created");
    expect(importJson.results[1].status).toBe("skipped");

    const gradRes = await graduationPost(
      new NextRequest("http://localhost:3000/api/company/graduation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          studentId: "ita-student-1",
          studentName: "テスト太郎",
          scores: {
            java_oop: 20,
            java_api_collections: 10,
            sql_db: 10,
            spring_boot_api: 20,
            git_workflow: 10,
            junit_testing: 10,
            final_project: 15,
          },
          mandatoryPassed: true,
          comment: "非常に優秀",
        }),
      })
    );
    expect(gradRes.status).toBe(200);
    const loadedGrad = await getGraduationEvaluationFromDb("ita-student-1");
    expect(loadedGrad?.mandatoryPassed).toBe(true);
    expect(loadedGrad?.comment).toBe("非常に優秀");
    expect(loadedGrad?.scores.java_oop).toBe(20);

    const setRes = await companySettingsPost(
      new NextRequest("http://localhost:3000/api/company/settings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ delayAlertDays: 7 }),
      })
    );
    expect(setRes.status).toBe(200);
    const loadedDays = await getCompanyDelayAlertDays(
      "00000000-0000-4000-8000-000000000001"
    );
    expect(loadedDays).toBe(7);

    const singleMatrix = await getCompanyProgressMatrix(
      "00000000-0000-4000-8000-000000000001"
    );
    const allMatrix = await getCompanyProgressMatrix();
    expect(singleMatrix.courses.length).toBeGreaterThan(0);
    expect(allMatrix.students.length).toBeGreaterThanOrEqual(
      singleMatrix.students.length
    );
  });

  it("F-ITA-05: 受講生機能（講師へ質問・お知らせ既読・PW変更/再設定）", async () => {
    const qEmpty = await studentQuestionPost(
      new NextRequest("http://localhost:3000/api/student/questions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ problemId: "p1", questionText: "" }),
      })
    );
    expect(qEmpty.status).toBe(400);

    const qOk = await studentQuestionPost(
      new NextRequest("http://localhost:3000/api/student/questions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          problemId: "p1",
          problemTitle: "1-1",
          questionText: "エラーが出ます",
        }),
      })
    );
    expect(qOk.status).toBe(200);

    const annRes = await announcementReadPost(
      new NextRequest("http://localhost:3000/api/student/announcements/read", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ announcementId: "ann-ita-1" }),
      })
    );
    expect(annRes.status).toBe(200);
    const readIds = await getReadAnnouncementIdsFromDb("demo-student-id");
    expect(readIds).toContain("ann-ita-1");

    const pwShort = await changePasswordPost(
      new NextRequest("http://localhost:3000/api/auth/change-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ newPassword: "123" }),
      })
    );
    expect(pwShort.status).toBe(400);

    const fpInvalid = await forgotPasswordPost(
      new NextRequest("http://localhost:3000/api/auth/forgot-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "not-an-email" }),
      })
    );
    expect(fpInvalid.status).toBe(400);
  });

  it("F-ITA-06: 管理者機能（マイルストーン保存/削除・Cron週次Slack配信・監査ログ）", async () => {
    const saveMs = await adminActionsPost(
      new NextRequest("http://localhost:3000/api/admin/actions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "save_milestone",
          payload: {
            companyId: "00000000-0000-4000-8000-000000000001",
            title: "ITAテストマイルストーン",
            targetDate: "2026-12-01",
            targetProblemCount: 10,
            orderIndex: 99,
          },
        }),
      })
    );
    const saveMsJson = await saveMs.json();
    expect(saveMs.status).toBe(200);
    expect(saveMsJson.ok).toBe(true);

    const delMs = await adminActionsPost(
      new NextRequest("http://localhost:3000/api/admin/actions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "delete_milestone",
          payload: { id: saveMsJson.milestone.id },
        }),
      })
    );
    expect(delMs.status).toBe(200);

    const cronRes = await cronSlackGet(
      new NextRequest("http://localhost:3000/api/cron/slack-digest")
    );
    expect(cronRes.status).toBe(200);

    const logs = await getAuditLogs(20);
    expect(logs.length).toBeGreaterThan(0);
  });
});
