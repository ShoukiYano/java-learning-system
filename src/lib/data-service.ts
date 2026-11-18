// =============================================================================
// サーバー側・受講生／管理者／企業担当者用 データ取得サービス（シードフォールバック付き）
// Supabase接続時は実DB＋RLSを参照し、未設定時や空データ時はシードデータで完全動作する
// =============================================================================

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  SEED_CHAPTERS,
  SEED_COURSE_ID,
  SEED_COURSES,
  SEED_PROBLEMS,
  SEED_SQL_COURSE_ID,
  detectProblemLanguage,
  getInMemoryStudentCourseLock,
  setInMemoryStudentCourseLock,
} from "@/lib/seed-data";
import { DEMO_STUDENTS_ANALYTICS, StudentAnalyticsRecord } from "@/lib/mock-analytics";
import {
  Announcement,
  Company,
  Course,
  CourseLockStatus,
  Feedback,
  Hint,
  Problem,
  Profile,
  Progress,
  StudentCourseLock,
  StudentCourseStatusItem,
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
  lockStatus?: CourseLockStatus; // 'auto' | 'unlocked' | 'locked'
  lockReason?: string;
  prerequisiteCourseTitle?: string | null;
}

export async function getCoursesWithProgress(
  userId: string,
  companyId?: string | null
): Promise<CourseWithStats[]> {
  // フォールバック用の計算ロジック
  const buildFallbackList = (): CourseWithStats[] => {
    // Javaコースの進捗（デモは3問クリア）
    const javaCompleted = 3;
    const javaTotal = 12;
    const isJavaCompleted = javaCompleted >= javaTotal;

    return SEED_COURSES.map((c, idx) => {
      const chIds = SEED_CHAPTERS.filter((ch) => ch.course_id === c.id).map((ch) => ch.id);
      const probs = SEED_PROBLEMS.filter((p) => chIds.includes(p.chapter_id));
      const totalProblems = probs.length;
      const completedProblems = idx === 0 ? javaCompleted : 1;
      const inProgressProblems = 1;

      // 手動オーバーライド状態を取得（デモインメモリ）
      const lockOverride = getInMemoryStudentCourseLock(userId, c.id);

      let isLocked = false;
      let lockReason = "受講可能です";
      let prereqTitle: string | null = null;

      if (c.prerequisite_course_id) {
        const pre = SEED_COURSES.find((item) => item.id === c.prerequisite_course_id);
        prereqTitle = pre ? pre.title : "前提コース";
      }

      if (lockOverride === "unlocked") {
        isLocked = false;
        lockReason = "企業担当者により特別解放されています（先行受講可能）";
      } else if (lockOverride === "locked") {
        isLocked = true;
        lockReason = "企業担当者により受講制限されています";
      } else {
        // 'auto' または未設定
        if (c.prerequisite_course_id) {
          if (!isJavaCompleted) {
            isLocked = true;
            lockReason = `前提コース「${prereqTitle}」の全問クリアが必要です`;
          }
        }
      }

      return {
        ...c,
        created_at: new Date().toISOString(),
        totalProblems,
        completedProblems,
        inProgressProblems,
        isLocked,
        lockStatus: lockOverride,
        lockReason,
        prerequisiteCourseTitle: prereqTitle,
      };
    });
  };

  const fallbackList = buildFallbackList();

  if (!isSupabaseConfigured()) {
    return fallbackList;
  }

  try {
    const supabase = await createClient();
    const { data: courses } = await supabase
      .from("courses")
      .select("*")
      .eq("is_published", true)
      .order("order_index", { ascending: true });

    // 所属企業（companyId）がある場合、company_courses で非表示（is_visible = false）に設定されたコースを除外する
    let hiddenCourseIds = new Set<string>();
    if (companyId) {
      const { data: visRows } = await supabase
        .from("company_courses")
        .select("course_id, is_visible")
        .eq("company_id", companyId);
      if (visRows) {
        for (const r of visRows as { course_id: string; is_visible: boolean }[]) {
          if (r.is_visible === false) {
            hiddenCourseIds.add(r.course_id);
          }
        }
      }
    }

    const { data: problems } = await supabase
      .from("problems")
      .select("id, lesson_id, lessons!inner(chapter_id, chapters!inner(course_id))")
      .eq("is_published", true);

    const { data: progresses } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", userId);

    // 受講生個別のコースロック・解放設定を取得
    let studentLocksMap = new Map<string, CourseLockStatus>();
    try {
      const { data: lockRows } = await supabase
        .from("student_course_locks")
        .select("course_id, status")
        .eq("user_id", userId);
      if (lockRows) {
        for (const lr of lockRows as { course_id: string; status: CourseLockStatus }[]) {
          studentLocksMap.set(lr.course_id, lr.status);
        }
      }
    } catch {
      // テーブル未マイグレーション時はインメモリフォールバック
      for (const sc of SEED_COURSES) {
        studentLocksMap.set(sc.id, getInMemoryStudentCourseLock(userId, sc.id));
      }
    }

    if (!courses || courses.length === 0) {
      return fallbackList.filter((c) => !hiddenCourseIds.has(c.id));
    }

    const visibleCourses = (courses as Course[]).filter(
      (c) => !hiddenCourseIds.has(c.id)
    );

    const courseMap = new Map<string, Course>();
    (courses as Course[]).forEach((c) => courseMap.set(c.id, c));

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

    return visibleCourses.map((course: Course) => {
      const pIds = courseProblemsMap.get(course.id) ?? [];
      let completed = 0;
      let inProg = 0;
      for (const pid of pIds) {
        const st = progressMap.get(pid)?.status;
        if (st === "completed") completed++;
        else if (st === "in_progress") inProg++;
      }

      // 前提コース情報
      let prereqTitle: string | null = null;
      let isPrereqCompleted = true;
      if (course.prerequisite_course_id) {
        const pre = courseMap.get(course.prerequisite_course_id);
        prereqTitle = pre ? pre.title : "前提コース";
        const preIds = courseProblemsMap.get(course.prerequisite_course_id) ?? [];
        const preCompleted = preIds.filter(
          (id) => progressMap.get(id)?.status === "completed"
        ).length;
        if (preIds.length > 0 && preCompleted < preIds.length) {
          isPrereqCompleted = false;
        }
      }

      // 個別ロックオーバーライドの判定
      const lockStatus: CourseLockStatus =
        studentLocksMap.get(course.id) ??
        getInMemoryStudentCourseLock(userId, course.id);

      let isLocked = false;
      let lockReason = "受講可能です";

      if (lockStatus === "unlocked") {
        isLocked = false;
        lockReason = "企業担当者により特別解放されています（先行受講可能）";
      } else if (lockStatus === "locked") {
        isLocked = true;
        lockReason = "企業担当者により受講制限されています";
      } else {
        // 'auto' または未設定
        if (course.prerequisite_course_id && !isPrereqCompleted) {
          isLocked = true;
          lockReason = `前提コース「${prereqTitle}」の全問クリアが必要です`;
        }
      }

      return {
        ...course,
        totalProblems: pIds.length,
        completedProblems: completed,
        inProgressProblems: inProg,
        isLocked,
        lockStatus,
        lockReason,
        prerequisiteCourseTitle: prereqTitle,
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

export async function getStudentDashboardData(
  userId: string,
  companyId?: string | null
) {
  const visibleCourses = await getCoursesWithProgress(userId, companyId);
  // ロックされていないコースのみから学習再開対象を抽出
  const accessibleCourses = visibleCourses.filter((c) => !c.isLocked);
  const targetCoursesForResume =
    accessibleCourses.length > 0 ? accessibleCourses : visibleCourses;

  const trees = await Promise.all(
    visibleCourses.map((c) => getCourseTree(c.id, userId))
  );
  const allChapters = trees.flatMap((t) => t.chapters);
  const allProblems = allChapters.flatMap((c) =>
    c.lessons.flatMap((l) => l.problems)
  );

  const completedCount = allProblems.filter((p) => p.status === "completed").length;
  const totalCount = allProblems.length || 1;
  const overallProgressPercent = Math.round((completedCount / totalCount) * 100);

  // アクセス可能なコースの問題一覧
  const accessibleCourseIds = new Set(targetCoursesForResume.map((c) => c.id));
  const accessibleProblems = allChapters
    .filter((ch) => accessibleCourseIds.has(ch.id) || true)
    .flatMap((c) => c.lessons.flatMap((l) => l.problems))
    .filter((p) => {
      // 問題が属するコースがアクセス可能か
      const isSql = p.tags.includes("SQL");
      const pCourseId = isSql ? SEED_SQL_COURSE_ID : SEED_COURSE_ID;
      return accessibleCourseIds.has(pCourseId);
    });

  const poolForResume =
    accessibleProblems.length > 0 ? accessibleProblems : allProblems;

  // 「続きから再開」で遷移する次の問題（挑戦中 または 最初の未着手問題）
  const resumeProblem =
    poolForResume.find((p) => p.status === "in_progress") ??
    poolForResume.find((p) => p.status === "not_started") ??
    poolForResume[0];

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

// =============================================================================
// 管理者・企業担当者向け リアルタイムDB集計サービス
// =============================================================================

function getServerQueryClient() {
  if (
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key")
  ) {
    return createAdminClient();
  }
  return null;
}

/**
 * 受講生一覧と各受講生の進捗・学習時間・遅れアラート・スキルマップ・評価をDBからリアルタイム集計
 * companyIdFilter が指定されている場合はその企業の受講生のみを返す
 */
export async function getStudentsAnalyticsFromDb(
  companyIdFilter?: string | null
): Promise<StudentAnalyticsRecord[]> {
  if (!isSupabaseConfigured()) {
    return companyIdFilter
      ? DEMO_STUDENTS_ANALYTICS.filter((s) => s.companyId === companyIdFilter)
      : DEMO_STUDENTS_ANALYTICS;
  }

  try {
    const adminOrUserClient = getServerQueryClient() ?? (await createClient());

    let query = adminOrUserClient
      .from("profiles")
      .select("*, companies(*)")
      .eq("role", "student")
      .order("created_at", { ascending: true });

    if (companyIdFilter) {
      query = query.eq("company_id", companyIdFilter);
    }

    const { data: students } = await query;

    if (!students || students.length === 0) {
      return companyIdFilter
        ? DEMO_STUDENTS_ANALYTICS.filter((s) => s.companyId === companyIdFilter)
        : DEMO_STUDENTS_ANALYTICS;
    }

    const studentIds = students.map((s: Profile) => s.id);

    const [
      { data: allProblemsDb },
      { data: allChaptersDb },
      { data: progressesDb },
      { data: studyLogsDb },
      { data: feedbacksDb },
    ] = await Promise.all([
      adminOrUserClient
        .from("problems")
        .select("id, title, tags, lesson_id, lessons(chapter_id)")
        .eq("is_published", true),
      adminOrUserClient
        .from("chapters")
        .select("id, title, order_index")
        .eq("is_published", true)
        .order("order_index", { ascending: true }),
      adminOrUserClient
        .from("progress")
        .select("*")
        .in("user_id", studentIds),
      adminOrUserClient
        .from("study_logs")
        .select("*")
        .in("user_id", studentIds),
      adminOrUserClient
        .from("feedbacks")
        .select("*, admin:profiles!feedbacks_admin_id_fkey(id, full_name)")
        .in("student_id", studentIds)
        .order("created_at", { ascending: false }),
    ]);

    const problemsList =
      allProblemsDb && allProblemsDb.length > 0
        ? (allProblemsDb as unknown as Array<{
            id: string;
            title: string;
            tags: string[];
            lessons?: { chapter_id?: string };
          }>)
        : SEED_PROBLEMS.map((sp) => ({
            id: sp.id,
            title: sp.title,
            tags: sp.tags,
            lessons: { chapter_id: sp.chapter_id },
          }));

    const chaptersList =
      allChaptersDb && allChaptersDb.length > 0
        ? (allChaptersDb as Array<{ id: string; title: string; order_index: number }>)
        : SEED_CHAPTERS.map((sc) => ({
            id: sc.id,
            title: sc.title,
            order_index: sc.order_index,
          }));

    const totalProblemsCount = problemsList.length || 1;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysStr = sevenDaysAgo.toISOString().slice(0, 10);

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

    return students.map((st: Profile) => {
      const userProgs = ((progressesDb ?? []) as Progress[]).filter(
        (p) => p.user_id === st.id
      );
      const progMap = new Map<string, Progress>();
      userProgs.forEach((p) => progMap.set(p.problem_id, p));

      const completedProblems = problemsList.filter(
        (prob) => progMap.get(prob.id)?.status === "completed"
      ).length;
      const progressPercent = Math.round(
        (completedProblems / totalProblemsCount) * 100
      );

      const userLogs = ((studyLogsDb ?? []) as StudyLog[]).filter(
        (l) => l.user_id === st.id
      );
      const totalMinutes = userLogs.reduce((acc, cur) => acc + cur.minutes, 0);
      const weeklyMinutes = userLogs
        .filter((l) => l.study_date >= sevenDaysStr)
        .reduce((acc, cur) => acc + cur.minutes, 0);

      // 最終ログインからの経過日数による遅れアラート判定
      const lastLoginDate = st.last_login_at
        ? new Date(st.last_login_at)
        : new Date(st.created_at);
      const daysSinceLogin = Math.floor(
        (Date.now() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const isDelayed =
        daysSinceLogin >= 5 || (progressPercent < 20 && totalMinutes < 30);
      const delayReason =
        daysSinceLogin >= 5
          ? `最終ログインから${daysSinceLogin}日経過`
          : isDelayed
          ? "進捗20%未満・学習時間不足"
          : undefined;

      // 章別進捗
      const chapterProgress = chaptersList.map((ch) => {
        const chProbs = problemsList.filter(
          (p) => p.lessons?.chapter_id === ch.id
        );
        const chDone = chProbs.filter(
          (p) => progMap.get(p.id)?.status === "completed"
        ).length;
        return {
          chapterTitle: ch.title,
          completed: chDone,
          total: chProbs.length || 1,
        };
      });

      // スキルレーダー
      const skillScores = skillTags.map((tag) => {
        const matched = problemsList.filter((p) => p.tags?.includes(tag));
        if (matched.length === 0) return { tag, score: 0, fullMark: 100 };
        const solved = matched.filter(
          (p) => progMap.get(p.id)?.status === "completed"
        ).length;
        const inProg = matched.filter(
          (p) => progMap.get(p.id)?.status === "in_progress"
        ).length;
        return {
          tag,
          score: Math.min(
            100,
            Math.round(((solved + inProg * 0.35) / matched.length) * 100)
          ),
          fullMark: 100,
        };
      });

      // 講師評価一覧
      const userFeedbacks = ((feedbacksDb ?? []) as Feedback[]).filter(
        (f) => f.student_id === st.id
      );
      const evaluations = userFeedbacks.map((f) => ({
        id: f.id,
        adminName: f.admin?.full_name ?? "システム管理者・講師",
        rating: f.rating ?? 5,
        comment: f.comment,
        createdAt: new Date(f.created_at).toISOString().slice(0, 10),
      }));

      return {
        id: st.id,
        fullName: st.full_name,
        email: st.email,
        companyId: st.company_id ?? "",
        companyName: st.companies?.name ?? "未所属（個人受講）",
        companyCode: st.companies?.company_code ?? "-",
        progressPercent,
        completedProblems,
        totalProblems: problemsList.length,
        weeklyMinutes,
        totalMinutes,
        streakDays: st.streak_days ?? 0,
        lastLoginAt: lastLoginDate.toLocaleString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
        isDelayed,
        delayReason,
        chapterProgress,
        skillScores,
        evaluations,
      };
    });
  } catch {
    return companyIdFilter
      ? DEMO_STUDENTS_ANALYTICS.filter((s) => s.companyId === companyIdFilter)
      : DEMO_STUDENTS_ANALYTICS;
  }
}

/**
 * 管理者統括ダッシュボード用データ（テナント数、受講生数、アクティブ率、平均進捗、つまずきTOP5、直近の提出）
 */
export async function getAdminOverviewFromDb() {
  const students = await getStudentsAnalyticsFromDb();

  let companyCount = 2;
  let courseCount = SEED_COURSES.length;
  let problemCount = SEED_PROBLEMS.length;
  let stumblingTop5 = [
    {
      id: SEED_PROBLEMS[17].id,
      title: SEED_PROBLEMS[17].title,
      track: "SQL",
      avgAttempts: 4.5,
      failRate: 61,
      avgMinutes: 22,
    },
    {
      id: SEED_PROBLEMS[11].id,
      title: SEED_PROBLEMS[11].title,
      track: "Java",
      avgAttempts: 4.2,
      failRate: 58,
      avgMinutes: 24,
    },
    {
      id: SEED_PROBLEMS[8].id,
      title: SEED_PROBLEMS[8].title,
      track: "Java",
      avgAttempts: 3.6,
      failRate: 49,
      avgMinutes: 19,
    },
    {
      id: SEED_PROBLEMS[15].id,
      title: SEED_PROBLEMS[15].title,
      track: "SQL",
      avgAttempts: 3.2,
      failRate: 44,
      avgMinutes: 17,
    },
    {
      id: SEED_PROBLEMS[10].id,
      title: SEED_PROBLEMS[10].title,
      track: "Java",
      avgAttempts: 3.1,
      failRate: 42,
      avgMinutes: 18,
    },
  ];

  let recentSubmissions = [
    {
      id: "adm-sub-1",
      studentId: students[0]?.id ?? "demo-student-1",
      studentName: students[0]?.fullName ?? "山田 太郎",
      companyName: students[0]?.companyName ?? "株式会社ACMEテクノロジーズ",
      problemId: SEED_PROBLEMS[12].id,
      problemTitle: SEED_PROBLEMS[12].title,
      status: "passed",
      submittedAt: "直近",
    },
  ];

  if (isSupabaseConfigured()) {
    try {
      const db = getServerQueryClient() ?? (await createClient());

      const [
        { count: compCnt },
        { count: crsCnt },
        { data: probsData },
        { data: subsData },
        { data: progsData },
      ] = await Promise.all([
        db.from("companies").select("*", { count: "exact", head: true }),
        db.from("courses").select("*", { count: "exact", head: true }),
        db.from("problems").select("id, title, tags, starter_code"),
        db
          .from("submissions")
          .select(
            "id, user_id, problem_id, status, time_spent_seconds, created_at, problems(id, title), profiles(id, full_name, companies(name))"
          )
          .order("created_at", { ascending: false })
          .limit(30),
        db.from("progress").select("problem_id, status, attempts_count, total_time_spent_seconds"),
      ]);

      if (compCnt !== null) companyCount = compCnt;
      if (crsCnt !== null && crsCnt > 0) courseCount = crsCnt;
      if (probsData && probsData.length > 0) problemCount = probsData.length;

      // 直近の提出リスト
      if (subsData && subsData.length > 0) {
        recentSubmissions = (
          subsData as unknown as Array<{
            id: string;
            user_id: string;
            problem_id: string;
            status: string;
            created_at: string;
            problems?: { title?: string };
            profiles?: { full_name?: string; companies?: { name?: string } };
          }>
        )
          .slice(0, 8)
          .map((s) => ({
            id: s.id,
            studentId: s.user_id,
            studentName: s.profiles?.full_name ?? "受講生",
            companyName: s.profiles?.companies?.name ?? "個人受講",
            problemId: s.problem_id,
            problemTitle: s.problems?.title ?? "演習問題",
            status: s.status,
            submittedAt: new Date(s.created_at).toLocaleString("ja-JP", {
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));
      }

      // つまずき問題TOP5のリアル集計（progressテーブルの平均試行回数・未完了率から算出）
      if (probsData && probsData.length > 0 && progsData && progsData.length > 0) {
        const statList = probsData.map(
          (prob: {
            id: string;
            title: string;
            tags: string[];
            starter_code: string;
          }) => {
            const pRows = (
              progsData as Array<{
                problem_id: string;
                status: string;
                attempts_count: number;
                total_time_spent_seconds: number;
              }>
            ).filter((r) => r.problem_id === prob.id);

            const count = pRows.length;
            const totalAttempts = pRows.reduce(
              (a, c) => a + (c.attempts_count || 1),
              0
            );
            const failedOrInProg = pRows.filter(
              (r) => r.status !== "completed"
            ).length;
            const totalSecs = pRows.reduce(
              (a, c) => a + (c.total_time_spent_seconds || 600),
              0
            );
            const lang = detectProblemLanguage(prob);

            return {
              id: prob.id,
              title: prob.title,
              track: lang === "sql" ? "SQL" : "Java",
              avgAttempts:
                count > 0 ? Number((totalAttempts / count).toFixed(1)) : 1.0,
              failRate:
                count > 0 ? Math.round((failedOrInProg / count) * 100) : 0,
              avgMinutes:
                count > 0 ? Math.max(1, Math.round(totalSecs / count / 60)) : 10,
              hasData: count > 0,
            };
          }
        );

        const activeStats = statList
          .filter((x) => x.hasData)
          .sort(
            (a, b) => b.failRate - a.failRate || b.avgAttempts - a.avgAttempts
          );
        if (activeStats.length > 0) {
          stumblingTop5 = activeStats.slice(0, 5);
        }
      }
    } catch {
      // フォールバック維持
    }
  }

  const totalStudents = students.length;
  const avgProgress =
    totalStudents > 0
      ? Math.round(
          students.reduce((a, c) => a + c.progressPercent, 0) / totalStudents
        )
      : 0;
  const activeCount = students.filter((s) => !s.isDelayed).length;
  const activeRate =
    totalStudents > 0 ? Math.round((activeCount / totalStudents) * 100) : 100;

  return {
    companyCount,
    totalStudents,
    courseCount,
    problemCount,
    avgProgress,
    activeRate,
    stumblingTop5,
    recentSubmissions,
  };
}

/**
 * 受講生ごとのコース受講制限・個別ロック/解放状態一覧を取得
 * （企業担当者ポータル・管理者ポータルの受講生詳細画面で使用）
 */
export async function getStudentCourseLockStatuses(
  studentId: string,
  companyId?: string | null
): Promise<StudentCourseStatusItem[]> {
  const coursesWithProg = await getCoursesWithProgress(studentId, companyId);

  return coursesWithProg.map((c) => {
    const isSql = c.title.toUpperCase().includes("SQL");
    const pct =
      c.totalProblems > 0
        ? Math.round((c.completedProblems / c.totalProblems) * 100)
        : 0;

    return {
      courseId: c.id,
      courseTitle: c.title,
      courseDescription: c.description,
      orderIndex: c.order_index,
      trackLabel: isSql ? "SQL Database Track" : "Java Programming Track",
      totalProblems: c.totalProblems,
      completedProblems: c.completedProblems,
      progressPercent: pct,
      prerequisiteCourseId: c.prerequisite_course_id,
      prerequisiteCourseTitle: c.prerequisiteCourseTitle ?? null,
      isPrerequisiteCompleted: !c.isLocked || c.lockStatus === "unlocked",
      lockStatus: c.lockStatus ?? "auto",
      isEffectiveLocked: c.isLocked,
      lockReason: c.lockReason ?? (c.isLocked ? "受講制限中" : "受講可能"),
    };
  });
}

/**
 * 管理画面・企業画面用：特定受講生の詳細＋最新の提出コード一覧＋コース別ロック状況をDBから取得
 */
export async function getStudentDetailForAdminOrCompany(studentId: string) {
  const allStudents = await getStudentsAnalyticsFromDb();
  const student =
    allStudents.find((s) => s.id === studentId) ?? allStudents[0];

  const courseLockStatuses = await getStudentCourseLockStatuses(
    student.id,
    student.companyId
  );

  let submissions: Submission[] = [];
  if (isSupabaseConfigured()) {
    try {
      const db = getServerQueryClient() ?? (await createClient());
      const { data } = await db
        .from("submissions")
        .select("*, problems(id, title, difficulty, tags)")
        .eq("user_id", student.id)
        .order("created_at", { ascending: false })
        .limit(10);
      if (data) submissions = data as Submission[];
    } catch {
      // ignore
    }
  }

  return {
    student,
    submissions,
    courseLockStatuses,
  };
}

/**
 * 管理画面用：テナント企業一覧と各企業の所属受講生数を取得
 */
export async function getAdminCompaniesList() {
  const defaultCompanies = [
    {
      id: "00000000-0000-4000-8000-000000000001",
      name: "株式会社ACMEテクノロジーズ",
      company_code: "ACME2025",
      contact_email: "hr@acme-tech.example.com",
      studentCount: 18,
    },
    {
      id: "00000000-0000-4000-8000-000000000002",
      name: "ネクストシステムズ株式会社",
      company_code: "TECH2025",
      contact_email: "training@next-sys.example.com",
      studentCount: 10,
    },
  ];

  if (!isSupabaseConfigured()) return defaultCompanies;

  try {
    const db = getServerQueryClient() ?? (await createClient());
    const { data: companies } = await db
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: profiles } = await db
      .from("profiles")
      .select("company_id")
      .eq("role", "student");

    if (!companies || companies.length === 0) return defaultCompanies;

    return (companies as Company[]).map((c) => {
      const cnt = ((profiles ?? []) as { company_id: string | null }[]).filter(
        (p) => p.company_id === c.id
      ).length;
      return {
        id: c.id,
        name: c.name,
        company_code: c.company_code,
        contact_email: c.contact_email ?? "",
        studentCount: cnt,
      };
    });
  } catch {
    return defaultCompanies;
  }
}

/**
 * 管理画面用：お知らせ一覧を取得
 */
export async function getAdminAnnouncementsList() {
  if (!isSupabaseConfigured()) {
    return {
      announcements: [
        {
          id: "ann-1",
          title: "Java入門コース・SQL実践コース開講のお知らせ",
          content_md:
            "Javaの基礎からオブジェクト指向、およびSQLのデータ抽出・集計・JOIN結合までブラウザ上で学習できます。",
          company_id: null,
          targetLabel: "全テナント公開",
          createdAt: "2025-05-01",
        },
      ],
      companies: await getAdminCompaniesList(),
    };
  }

  try {
    const db = getServerQueryClient() ?? (await createClient());
    const companies = await getAdminCompaniesList();
    const compMap = new Map(companies.map((c) => [c.id, c.name]));

    const { data } = await db
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    const list = ((data ?? []) as Announcement[]).map((a) => ({
      id: a.id,
      title: a.title,
      content_md: a.content_md,
      company_id: a.company_id,
      targetLabel: a.company_id
        ? `${compMap.get(a.company_id) ?? "特定企業"} 限定`
        : "全テナント公開",
      createdAt: new Date(a.created_at).toISOString().slice(0, 10),
    }));

    return {
      announcements: list,
      companies,
    };
  } catch {
    return {
      announcements: [],
      companies: await getAdminCompaniesList(),
    };
  }
}

/**
 * 管理画面の問題編集用：DBから問題・全テストケース（非公開含む）・全ヒントを取得
 */
/**
 * 管理画面のカリキュラム管理用：コース一覧・企業一覧・企業別の表示設定マトリクスを取得
 */
export async function getAdminCoursesAndCompanyMatrix() {
  const companies = await getAdminCompaniesList();
  const defaultCourses = SEED_COURSES.map((c) => {
    const chIds = SEED_CHAPTERS.filter((ch) => ch.course_id === c.id).map(
      (ch) => ch.id
    );
    const count = SEED_PROBLEMS.filter((p) =>
      chIds.includes(p.chapter_id)
    ).length;
    return {
      ...c,
      problemCount: count,
    };
  });

  // visibilityMap[courseId][companyId] = boolean (default true)
  const visibilityMap: Record<string, Record<string, boolean>> = {};
  for (const crs of defaultCourses) {
    visibilityMap[crs.id] = {};
    for (const comp of companies) {
      visibilityMap[crs.id][comp.id] = true;
    }
  }

  if (!isSupabaseConfigured()) {
    return { courses: defaultCourses, companies, visibilityMap };
  }

  try {
    const db = getServerQueryClient() ?? (await createClient());
    const [{ data: dbCourses }, { data: dbProblems }, { data: visRows }] =
      await Promise.all([
        db.from("courses").select("*").order("order_index", { ascending: true }),
        db
          .from("problems")
          .select("id, lessons!inner(chapters!inner(course_id))"),
        db.from("company_courses").select("company_id, course_id, is_visible"),
      ]);

    const coursesList =
      dbCourses && dbCourses.length > 0
        ? (dbCourses as Course[]).map((c) => {
            const cnt = (
              (dbProblems ?? []) as unknown as Array<{
                lessons?: { chapters?: { course_id?: string } };
              }>
            ).filter((p) => p.lessons?.chapters?.course_id === c.id).length;
            return {
              id: c.id,
              title: c.title,
              description: c.description,
              order_index: c.order_index,
              is_published: c.is_published,
              prerequisite_course_id: c.prerequisite_course_id,
              problemCount:
                cnt ||
                defaultCourses.find((dc) => dc.id === c.id)?.problemCount ||
                0,
            };
          })
        : defaultCourses;

    for (const crs of coursesList) {
      if (!visibilityMap[crs.id]) visibilityMap[crs.id] = {};
      for (const comp of companies) {
        visibilityMap[crs.id][comp.id] = true;
      }
    }

    if (visRows) {
      for (const row of visRows as {
        company_id: string;
        course_id: string;
        is_visible: boolean;
      }[]) {
        if (!visibilityMap[row.course_id]) visibilityMap[row.course_id] = {};
        visibilityMap[row.course_id][row.company_id] = row.is_visible;
      }
    }

    return { courses: coursesList, companies, visibilityMap };
  } catch {
    return { courses: defaultCourses, companies, visibilityMap };
  }
}

/**
 * 管理画面用：特定テナント企業の詳細・所属受講生一覧・担当者一覧・コース公開設定を取得
 */
export async function getAdminCompanyDetail(companyId: string) {
  const { courses, companies, visibilityMap } =
    await getAdminCoursesAndCompanyMatrix();

  const targetCompany =
    companies.find((c) => c.id === companyId) ?? companies[0];

  const students = await getStudentsAnalyticsFromDb(targetCompany.id);

  // この企業の各コースの表示設定（courseId -> boolean）
  const courseVisibility: Record<string, boolean> = {};
  for (const crs of courses) {
    courseVisibility[crs.id] =
      visibilityMap[crs.id]?.[targetCompany.id] ?? true;
  }

  return {
    company: targetCompany,
    students,
    courses,
    courseVisibility,
  };
}

export async function getProblemForAdminEdit(problemId: string) {
  const seedFallback =
    SEED_PROBLEMS.find((p) => p.id === problemId) ?? SEED_PROBLEMS[0];

  if (!isSupabaseConfigured()) return seedFallback;

  try {
    const db = getServerQueryClient() ?? (await createClient());
    const { data: prob } = await db
      .from("problems")
      .select("*, lessons(chapter_id)")
      .eq("id", problemId)
      .maybeSingle();

    if (!prob) return seedFallback;

    const [{ data: tcs }, { data: hints }] = await Promise.all([
      db
        .from("test_cases")
        .select("*")
        .eq("problem_id", problemId)
        .order("order_index", { ascending: true }),
      db
        .from("hints")
        .select("*")
        .eq("problem_id", problemId)
        .order("step_number", { ascending: true }),
    ]);

    const chapterId =
      (prob as unknown as { lessons?: { chapter_id?: string } }).lessons
        ?.chapter_id ?? seedFallback.chapter_id;

    return {
      id: prob.id,
      lesson_id: prob.lesson_id,
      chapter_id: chapterId,
      language: detectProblemLanguage(prob),
      title: prob.title,
      description_md: prob.description_md,
      difficulty: prob.difficulty,
      estimated_minutes: prob.estimated_minutes,
      tags: prob.tags ?? [],
      starter_code: prob.starter_code,
      solution_code: prob.solution_code,
      explanation_md: prob.explanation_md,
      order_index: prob.order_index,
      test_cases:
        tcs && tcs.length > 0
          ? (tcs as TestCase[]).map((t) => ({
              name: t.name,
              input: t.input,
              expected_output: t.expected_output,
              is_hidden: t.is_hidden,
              order_index: t.order_index,
            }))
          : seedFallback.test_cases,
      hints:
        hints && hints.length > 0
          ? (hints as Hint[]).map((h) => ({
              step_number: h.step_number,
              content_md: h.content_md,
            }))
          : seedFallback.hints,
    };
  } catch {
    return seedFallback;
  }
}

