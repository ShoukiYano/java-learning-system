import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function sqlStr(val) {
  if (val === null || val === undefined) return "NULL";
  return "'" + String(val).replace(/'/g, "''") + "'";
}

function sqlTextArray(arr) {
  if (!arr || arr.length === 0) return "ARRAY[]::text[]";
  return `ARRAY[${arr.map((t) => sqlStr(t)).join(", ")}]`;
}

const server = await createServer({
  root,
  resolve: {
    alias: {
      "@": path.join(root, "src"),
    },
  },
  server: { middlewareMode: true },
  appType: "custom",
});

try {
  const seed = await server.ssrLoadModule("/src/lib/seed-data.ts");
  const litExcel = await server.ssrLoadModule("/src/lib/curriculum-1year-literacy-excel.ts");
  const htmlcss = await server.ssrLoadModule("/src/lib/curriculum-1year-htmlcss.ts");
  const proj = await server.ssrLoadModule("/src/lib/curriculum-1year-projects.ts");
  const javaIntroExtra = await server.ssrLoadModule("/src/lib/java-intro-extra-problems.ts");
  const javaBegExtra = await server.ssrLoadModule("/src/lib/java-80-beginner-extra.ts");
  const javaIntExtra = await server.ssrLoadModule("/src/lib/java-80-intermediate-extra.ts");
  const javaAdvExtra = await server.ssrLoadModule("/src/lib/java-80-advanced-extra.ts");

  const newChapters = [
    ...litExcel.LITERACY_CHAPTERS,
    ...litExcel.EXCEL_CHAPTERS,
    ...htmlcss.HTMLCSS_CHAPTERS,
    ...proj.SPRINGBOOT_PROJECT_CHAPTERS,
    ...proj.TEAM_PROJECT_CHAPTERS,
  ];

  const newProblems = [
    ...litExcel.LITERACY_PROBLEMS,
    ...litExcel.EXCEL_PROBLEMS,
    ...htmlcss.HTMLCSS_PROBLEMS,
    ...javaIntroExtra.JAVA_INTRO_EXTRA_PROBLEMS,
    ...javaBegExtra.JAVA_BEGINNER_80_EXTRA,
    ...javaIntExtra.JAVA_INTERMEDIATE_80_EXTRA,
    ...javaAdvExtra.JAVA_ADVANCED_80_EXTRA,
    ...proj.SPRINGBOOT_PROJECT_PROBLEMS,
    ...proj.TEAM_PROJECT_PROBLEMS,
  ];

  const lines = [];
  lines.push("-- =============================================================================");
  lines.push("-- 1年間ITエンジニア育成カリキュラム拡張マイグレーション（冪等・何度でも再実行可能）");
  lines.push("-- 追加コース（5コース・17章・17単元・42演習）：");
  lines.push("--   1. ITリテラシー導入コース（3日・6問）");
  lines.push("--   2. Excel実務マスターコース（1か月・12問）");
  lines.push("--   3. HTML＆CSS実践コース（1か月・12問）");
  lines.push("--   4. Spring Boot＋SQL 個人開発：商品管理システム構築（2か月・6ステップ）");
  lines.push("--   5. チーム開発実践（3人1組）：ログイン機能付き総合業務Webシステム（3か月・6ステップ）");
  lines.push("-- ＋ 既存6コース（Java 4コース / SQL / Git）の並び順（order_index 1〜11）を更新");
  lines.push("-- =============================================================================");
  lines.push("");

  lines.push("-- 1. 全11コースの登録・並び順更新");
  for (const c of seed.SEED_COURSES) {
    lines.push(
      `INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)\n` +
        `VALUES (${sqlStr(c.id)}, ${sqlStr(c.title)}, ${sqlStr(c.description)}, ${c.order_index}, ${c.is_published}, ${c.prerequisite_course_id ? sqlStr(c.prerequisite_course_id) : "NULL"})\n` +
        `ON CONFLICT (id) DO UPDATE SET\n` +
        `  title = EXCLUDED.title,\n` +
        `  description = EXCLUDED.description,\n` +
        `  order_index = EXCLUDED.order_index,\n` +
        `  is_published = EXCLUDED.is_published,\n` +
        `  prerequisite_course_id = EXCLUDED.prerequisite_course_id;\n`
    );
  }

  lines.push("-- 2. 新規17章の登録");
  for (const ch of newChapters) {
    lines.push(
      `INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)\n` +
        `VALUES (${sqlStr(ch.id)}, ${sqlStr(ch.course_id)}, ${sqlStr(ch.title)}, ${sqlStr(ch.description)}, ${ch.order_index}, true)\n` +
        `ON CONFLICT (id) DO UPDATE SET\n` +
        `  course_id = EXCLUDED.course_id,\n` +
        `  title = EXCLUDED.title,\n` +
        `  description = EXCLUDED.description,\n` +
        `  order_index = EXCLUDED.order_index,\n` +
        `  is_published = EXCLUDED.is_published;\n`
    );
  }

  lines.push("-- 3. 新規17単元の登録");
  for (const ch of newChapters) {
    lines.push(
      `INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)\n` +
        `VALUES (${sqlStr(ch.lesson_id)}, ${sqlStr(ch.id)}, ${sqlStr(ch.lesson_title)}, '', 1, true)\n` +
        `ON CONFLICT (id) DO UPDATE SET\n` +
        `  chapter_id = EXCLUDED.chapter_id,\n` +
        `  title = EXCLUDED.title,\n` +
        `  order_index = EXCLUDED.order_index,\n` +
        `  is_published = EXCLUDED.is_published;\n`
    );
  }

  lines.push("-- 4. 新規42演習問題の登録");
  for (const p of newProblems) {
    lines.push(
      `INSERT INTO public.problems (\n` +
        `  id, lesson_id, title, description_md, difficulty, estimated_minutes,\n` +
        `  tags, starter_code, solution_code, explanation_md, order_index, is_published\n` +
        `)\nVALUES (\n` +
        `  ${sqlStr(p.id)}, ${sqlStr(p.lesson_id)}, ${sqlStr(p.title)}, ${sqlStr(p.description_md)},\n` +
        `  ${sqlStr(p.difficulty)}, ${p.estimated_minutes}, ${sqlTextArray(p.tags)},\n` +
        `  ${sqlStr(p.starter_code)}, ${sqlStr(p.solution_code)}, ${sqlStr(p.explanation_md)},\n` +
        `  ${p.order_index}, true\n` +
        `)\nON CONFLICT (id) DO UPDATE SET\n` +
        `  lesson_id = EXCLUDED.lesson_id,\n` +
        `  title = EXCLUDED.title,\n` +
        `  description_md = EXCLUDED.description_md,\n` +
        `  difficulty = EXCLUDED.difficulty,\n` +
        `  estimated_minutes = EXCLUDED.estimated_minutes,\n` +
        `  tags = EXCLUDED.tags,\n` +
        `  starter_code = EXCLUDED.starter_code,\n` +
        `  solution_code = EXCLUDED.solution_code,\n` +
        `  explanation_md = EXCLUDED.explanation_md,\n` +
        `  order_index = EXCLUDED.order_index,\n` +
        `  is_published = EXCLUDED.is_published;\n`
    );
  }

  lines.push("-- 5. 新規演習問題のテストケース登録（冪等洗い替え）");
  const probIdList = newProblems.map((p) => sqlStr(p.id)).join(", ");
  lines.push(`DELETE FROM public.test_cases WHERE problem_id IN (${probIdList});\n`);
  for (const p of newProblems) {
    for (const tc of p.test_cases || []) {
      lines.push(
        `INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)\n` +
          `VALUES (${sqlStr(p.id)}, ${sqlStr(tc.name)}, ${sqlStr(tc.input)}, ${sqlStr(tc.expected_output)}, ${Boolean(tc.is_hidden)}, ${tc.order_index});`
      );
    }
  }

  lines.push("");
  lines.push("-- 6. 新規演習問題のヒント登録（冪等洗い替え）");
  lines.push(`DELETE FROM public.hints WHERE problem_id IN (${probIdList});\n`);
  for (const p of newProblems) {
    for (const h of p.hints || []) {
      lines.push(
        `INSERT INTO public.hints (problem_id, step_number, content_md)\n` +
          `VALUES (${sqlStr(p.id)}, ${h.step_number}, ${sqlStr(h.content_md)});`
      );
    }
  }

  lines.push("");
  lines.push("-- 7. 権限確認");
  lines.push("GRANT SELECT ON public.courses, public.chapters, public.lessons, public.problems, public.test_cases, public.hints TO authenticated;");
  lines.push("");

  const outPath = path.join(root, "supabase", "migrations", "20261123_1year_curriculum_expansion.sql");
  fs.writeFileSync(outPath, lines.join("\n"), "utf8");
  console.log(`Generated migration: ${outPath} (${newChapters.length} chapters, ${newProblems.length} problems)`);
} finally {
  await server.close();
}
