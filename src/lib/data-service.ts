// =============================================================================
// サーバー側・受講生／管理者／企業担当者用 データ取得サービス（シードフォールバック付き）
// Supabase接続時は実DB＋RLSを参照し、未設定時や空データ時はシードデータで完全動作する
// =============================================================================

import { createClient } from "@/lib/supabase/server";
import {
  SEED_CHAPTERS,
  SEED_COURSE_ID,
  SEED_COURSES,
  SEED_PROBLEMS,
} from "@/lib/seed-data";
import {
  Announcement,
  Course,
  Feedback,
  Hint,
  Problem,
  Profile,
  Progress,
  StudyLog,
  Submission,
  TestCase,
} from "@/types/database";

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes("your-project-id"));
}

export async function getCurrentProfile(): Promise<Profile> {
  const fallbackProfile: Profile = {
    id: "demo-student-id",
    email: "student@acme-tech.example.com",
    full_name: "山田 太郎（デモ受講生）",
    role: "student",
    company_id: "00000000-0000-4000-8000-000000000001",
    avatar_url: null,
    streak_days: 5,
    last_study_date: new Date().toISOString().slice(0, 10),
    last_login_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    companies: {
      id: "00000000-0000-4000-8000-000000000001",
      name: "株式会社ACMEテクノロジーズ",
      company_code: "ACME2025",
      contact_email: "hr@acme-tech.example.com",
      created_at: new Date().toISOString(),
    },
  };

  if (!isSupabaseConfigured()) return fallbackProfile;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return fallbackProfile;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*, companies(*)")
      .eq("id", user.id)
      .single();

    return (profile as Profile) ?? fallbackProfile;
  } catch {
    return fallbackProfile;
  }
}

export interface CourseWithStats extends Course {
  totalProblems: number;
  completedProblems: number;
  inProgressProblems: number;
  isLocked: boolean;
}

export async function getCoursesWithProgress(userId: string): Promise<CourseWithStats[]> {
  const fallbackList: CourseWithStats[] = SEED_COURSES.map((c, idx) => {
    const chIds = SEED_CHAPTERS.filter((ch) => ch.course_id === c.id).map((ch) => ch.id);
    const probs = SEED_PROBLEMS.filter((p) => chIds.includes(p.chapter_id));
    return {
      ...c,
      created_at: new Date().toISOString(),
      totalProblems: probs.length,
      completedProblems: idx === 0 ? 3 : 1,
      inProgressProblems: 1,
      isLocked: false,
    };
  });

  if (!isSupabaseConfigured()) {
    return fallbackList;
  }

  try {
    const supabase = await createClient();
    const { data: courses } = await supabase
      .from("courses")
      .select("*")
      .order("order_index", { ascending: true });

    const { data: problems } = await supabase
      .from("problems")
      .select("id, lesson_id, lessons!inner(chapter_id, chapters!inner(course_id))")
      .eq("is_published", true);

    const { data: progresses } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", userId);

    if (!courses || courses.length === 0) {
      return fallbackList;
    }

    const progressMap = new Map<string, Progress>();
    (progresses ?? []).forEach((p: Progress) => progressMap.set(p.problem_id, p));

    // コースごとの問題ID集計
    const courseProblemsMap = new Map<string, string[]>();
    for (const c of courses) courseProblemsMap.set(c.id, []);

    if (problems && problems.length > 0) {
      for (const p of problems as unknown as Array<{
        id: string;
        lessons: { chapters: { course_id: string } };
      }>) {
        const cId = p.lessons?.chapters?.course_id;
        if (cId && courseProblemsMap.has(cId)) {
          courseProblemsMap.get(cId)!.push(p.id);
        }
      }
    } else {
      courseProblemsMap.set(
        SEED_COURSE_ID,
        SEED_PROBLEMS.map((sp) => sp.id)
      );
    }

    return courses.map((course: Course) => {
      const pIds = courseProblemsMap.get(course.id) ?? [];
      let completed = 0;
      let inProg = 0;
      for (const pid of pIds) {
        const st = progressMap.get(pid)?.status;
        if (st === "completed") completed++;
        else if (st === "in_progress") inProg++;
      }

      // 前提コースが設定されている場合、前提コースが100%完了していなければロック
      let isLocked = false;
      if (course.prerequisite_course_id) {
        const preIds = courseProblemsMap.get(course.prerequisite_course_id) ?? [];
        const preCompleted = preIds.filter(
          (id) => progressMap.get(id)?.status === "completed"
        ).length;
        if (preIds.length > 0 && preCompleted < preIds.length) {
          isLocked = true;
        }
      }

      return {
        ...course,
        totalProblems: pIds.length,
        completedProblems: completed,
        inProgressProblems: inProg,
        isLocked,
      };
    });
  } catch {
    return fallbackList;
  }
}

export interface CourseTreeChapter {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  lessons: {
    id: string;
    title: string;
    order_index: number;
    problems: (Problem & {
      status: "not_started" | "in_progress" | "completed";
      attempts_count: number;
    })[];
  }[];
}

export async function getCourseTree(
  courseId: string,
  userId: string
): Promise<{ course: Course; chapters: CourseTreeChapter[] }> {
  const matchedCourse =
    SEED_COURSES.find((c) => c.id === courseId) ?? SEED_COURSES[0];

  const fallbackCourse: Course = {
    ...matchedCourse,
    created_at: new Date().toISOString(),
  };

  const buildFallbackTree = (progressMap: Map<string, Progress>) => {
    const targetChapters = SEED_CHAPTERS.filter(
      (ch) => ch.course_id === fallbackCourse.id
    );
    const chapters: CourseTreeChapter[] = targetChapters.map((ch) => {
      const chProblems = SEED_PROBLEMS.filter((p) => p.chapter_id === ch.id).map(
        (p, idx) => {
          const prog = progressMap.get(p.id);
          // デモ時の初期表示：第1章をクリア、2-1を挑戦中に設定
          const defaultStatus: "not_started" | "in_progress" | "completed" =
            !isSupabaseConfigured()
              ? ch.order_index === 1
                ? "completed"
                : ch.order_index === 2 && idx === 0
                ? "in_progress"
                : "not_started"
              : "not_started";
          return {
            id: p.id,
            lesson_id: p.lesson_id,
            title: p.title,
            description_md: p.description_md,
            difficulty: p.difficulty,
            estimated_minutes: p.estimated_minutes,
            tags: p.tags,
            starter_code: p.starter_code,
            solution_code: p.solution_code,
            explanation_md: p.explanation_md,
            order_index: p.order_index,
            is_published: true,
            created_at: new Date().toISOString(),
            status: prog?.status ?? defaultStatus,
            attempts_count: prog?.attempts_count ?? 0,
          };
        }
      );

      return {
        id: ch.id,
        title: ch.title,
        description: ch.description,
        order_index: ch.order_index,
        lessons: [
          {
            id: ch.lesson_id,
            title: ch.lesson_title,
            order_index: 1,
            problems: chProblems,
          },
        ],
      };
    });

    return { course: fallbackCourse, chapters };
  };

  if (!isSupabaseConfigured()) {
    return buildFallbackTree(new Map());
  }

  try {
    const supabase = await createClient();
    const { data: course } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    const { data: chaptersData } = await supabase
      .from("chapters")
      .select("*, lessons(*, problems(*))")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true });

    const { data: progresses } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", userId);

    const progressMap = new Map<string, Progress>();
    (progresses ?? []).forEach((p: Progress) => progressMap.set(p.problem_id, p));

    if (!course || !chaptersData || chaptersData.length === 0) {
      return buildFallbackTree(progressMap);
    }

    const chapters: CourseTreeChapter[] = chaptersData.map((ch: Record<string, unknown>) => {
      const rawLessons = (ch.lessons as Array<Record<string, unknown>>) ?? [];
      rawLessons.sort(
        (a, b) => (a.order_index as number) - (b.order_index as number)
      );

      return {
        id: ch.id as string,
        title: ch.title as string,
        description: (ch.description as string) ?? null,
        order_index: ch.order_index as number,
        lessons: rawLessons.map((les) => {
          const rawProbs = (les.problems as Problem[]) ?? [];
          rawProbs.sort((a, b) => a.order_index - b.order_index);
          return {
            id: les.id as string,
            title: les.title as string,
            order_index: les.order_index as number,
            problems: rawProbs.map((prob) => {
              const prog = progressMap.get(prob.id);
              return {
                ...prob,
                status: prog?.status ?? "not_started",
                attempts_count: prog?.attempts_count ?? 0,
              };
            }),
          };
        }),
      };
    });

    return { course: course as Course, chapters };
  } catch {
    return buildFallbackTree(new Map());
  }
}

export async function getProblemDetailForStudent(
  problemId: string,
  userId: string
): Promise<{
  problem: Problem;
  publicTestCases: TestCase[];
  hints: Hint[];
  progress: Progress | null;
  nextProblemId: string | null;
  courseId: string;
}> {
  const seedIdx = SEED_PROBLEMS.findIndex((p) => p.id === problemId);
  const seedProb = SEED_PROBLEMS[seedIdx >= 0 ? seedIdx : 0];
  const seedChapter = SEED_CHAPTERS.find((ch) => ch.id === seedProb.chapter_id);
  const resolvedCourseId = seedChapter?.course_id ?? SEED_COURSE_ID;
  const nextSeed =
    seedIdx >= 0 && seedIdx + 1 < SEED_PROBLEMS.length
      ? SEED_PROBLEMS[seedIdx + 1].id
      : null;

  const fallbackResult = {
    problem: {
      id: seedProb.id,
      lesson_id: seedProb.lesson_id,
      language: seedProb.language,
      title: seedProb.title,
      description_md: seedProb.description_md,
      difficulty: seedProb.difficulty,
      estimated_minutes: seedProb.estimated_minutes,
      tags: seedProb.tags,
      starter_code: seedProb.starter_code,
      solution_code: "", // 受講生側へは模範解答を渡さない
      explanation_md: seedProb.explanation_md,
      order_index: seedProb.order_index,
      is_published: true,
      created_at: new Date().toISOString(),
    },
    publicTestCases: seedProb.test_cases
      .filter((tc) => !tc.is_hidden)
      .map((tc, i) => ({
        id: `tc-${i}`,
        problem_id: seedProb.id,
        ...tc,
      })),
    hints: seedProb.hints.map((h, i) => ({
      id: `hint-${i}`,
      problem_id: seedProb.id,
      ...h,
    })),
    progress: null,
    nextProblemId: nextSeed,
    courseId: resolvedCourseId,
  };

  if (!isSupabaseConfigured()) {
    return fallbackResult;
  }

  try {
    const supabase = await createClient();
    const { data: problem } = await supabase
      .from("problems")
      .select("*")
      .eq("id", problemId)
      .single();

    if (!problem) return fallbackResult;

    // RLS により is_hidden = false の公開テストケースのみ返却される（二重保証として .eq("is_hidden", false) も付与）
    const { data: testCases } = await supabase
      .from("test_cases")
      .select("*")
      .eq("problem_id", problemId)
      .eq("is_hidden", false)
      .order("order_index", { ascending: true });

    const { data: hints } = await supabase
      .from("hints")
      .select("*")
      .eq("problem_id", problemId)
      .order("step_number", { ascending: true });

    const { data: progress } = await supabase
      .from("progress")
      .select("*")
      .eq("problem_id", problemId)
      .eq("user_id", userId)
      .maybeSingle();

    return {
      problem: { ...(problem as Problem), solution_code: "" },
      publicTestCases: (testCases as TestCase[]) ?? fallbackResult.publicTestCases,
      hints: (hints as Hint[]) ?? fallbackResult.hints,
      progress: (progress as Progress) ?? null,
      nextProblemId: nextSeed,
      courseId: SEED_COURSE_ID,
    };
  } catch {
    return fallbackResult;
  }
}

export async function getStudentDashboardData(userId: string) {
  const javaTree = await getCourseTree(SEED_COURSE_ID, userId);
  const sqlTree = await getCourseTree("11111111-1111-4111-8111-111111111102", userId);
  const allChapters = [...javaTree.chapters, ...sqlTree.chapters];
  const allProblems = allChapters.flatMap((c) =>
    c.lessons.flatMap((l) => l.problems)
  );

  const completedCount = allProblems.filter((p) => p.status === "completed").length;
  const totalCount = allProblems.length || 1;
  const overallProgressPercent = Math.round((completedCount / totalCount) * 100);

  // 「続きから再開」で遷移する次の問題（挑戦中 または 最初の未着手問題）
  const resumeProblem =
    allProblems.find((p) => p.status === "in_progress") ??
    allProblems.find((p) => p.status === "not_started") ??
    allProblems[0];

  // スキルマップ（Java＋SQL問題タグ別のクリア率・正答率）
  const skillTags = [
    "出力と変数",
    "条件分岐",
    "ループ",
    "配列",
    "オブジェクト指向",
    "SQL抽出",
    "SQL集計",
    "SQL結合",
  ];

  const skillRadarData = skillTags.map((tag) => {
    const matched = allProblems.filter((p) => p.tags.includes(tag));
    if (matched.length === 0) {
      return { tag, score: 0, fullMark: 100 };
    }
    const solved = matched.filter((p) => p.status === "completed").length;
    const inProg = matched.filter((p) => p.status === "in_progress").length;
    const score = Math.min(
      100,
      Math.round(((solved + inProg * 0.35) / matched.length) * 100)
    );
    return { tag, score, fullMark: 100 };
  });

  // 学習カレンダー（過去12週間 = 84日分のGitHub風の草データ）
  let studyLogs: StudyLog[] = [];
  let recentFeedbacks: Feedback[] = [];
  let recentSubmissions: Submission[] = [];
  let announcements: Announcement[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: logs } = await supabase
        .from("study_logs")
        .select("*")
        .eq("user_id", userId)
        .order("study_date", { ascending: true });
      studyLogs = (logs as StudyLog[]) ?? [];

      const { data: fbs } = await supabase
        .from("feedbacks")
        .select("*, admin:profiles!feedbacks_admin_id_fkey(id, full_name)")
        .eq("student_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);
      recentFeedbacks = (fbs as Feedback[]) ?? [];

      const { data: subs } = await supabase
        .from("submissions")
        .select("*, problems(id, title, difficulty, tags)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(15);
      recentSubmissions = (subs as Submission[]) ?? [];

      const { data: anns } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      announcements = (anns as Announcement[]) ?? [];
    } catch {
      // フォールバックへ
    }
  }

  // デモ・初期表示時にも視覚的に一目で分かるサンプル学習ログ＆フィードバックを用意
  if (studyLogs.length === 0 && !isSupabaseConfigured()) {
    const today = new Date();
    for (let i = 30; i >= 0; i--) {
      if (i % 3 !== 0 || i < 5) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        studyLogs.push({
          id: `log-${i}`,
          user_id: userId,
          study_date: d.toISOString().slice(0, 10),
          minutes: i < 5 ? 45 : (i % 4) * 20 + 15,
          problems_solved: i % 2 === 0 ? 2 : 1,
        });
      }
    }
  }

  if (recentFeedbacks.length === 0 && !isSupabaseConfigured()) {
    recentFeedbacks = [
      {
        id: "fb-demo-1",
        student_id: userId,
        admin_id: "admin-1",
        submission_id: null,
        rating: 5,
        comment:
          "第1章の標準入出力と時間変換問題、変数名が分かりやすく非常に綺麗に書けています！この調子で第2章のループ処理に進みましょう。",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        admin: { id: "admin-1", full_name: "佐藤 健一（主任講師）" },
      },
    ];
  }

  // 今週（直近7日間）の学習時間集計
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysStr = sevenDaysAgo.toISOString().slice(0, 10);
  const weeklyMinutes = studyLogs
    .filter((l) => l.study_date >= sevenDaysStr)
    .reduce((acc, cur) => acc + cur.minutes, 0);

  return {
    overallProgressPercent,
    completedCount,
    totalCount: allProblems.length,
    weeklyMinutes,
    resumeProblem,
    skillRadarData,
    studyLogs,
    recentFeedbacks,
    recentSubmissions,
    announcements,
    chapters: allChapters,
  };
}
