// =============================================================================
// シードデータ定義（Java入門コース：4章 × 各3問 ＝ 全12問）
// - SQLマイグレーション生成・自動テスト（全問題の模範解答が全テストに通るか検証）・
//   およびDBフォールバック表示で共通利用するマスターデータ
// =============================================================================

import { Difficulty, ProblemLanguage, CompanyManager, TrainingMilestone } from "@/types/database";
import {
  SEED_JAVA_BEGINNER_COURSE_ID,
  SEED_JAVA_INTERMEDIATE_COURSE_ID,
  SEED_JAVA_ADVANCED_COURSE_ID,
  EXTRA_JAVA_CHAPTERS,
  EXTRA_JAVA_PROBLEMS,
} from "@/lib/java-curriculum-problems";
import {
  EXTRA_SQL_CHAPTERS,
  EXTRA_SQL_PROBLEMS,
} from "@/lib/sql-curriculum-problems";

export {
  SEED_JAVA_BEGINNER_COURSE_ID,
  SEED_JAVA_INTERMEDIATE_COURSE_ID,
  SEED_JAVA_ADVANCED_COURSE_ID,
};

export interface SeedTestCase {
  name: string;
  input: string;
  expected_output: string;
  is_hidden: boolean;
  order_index: number;
}

export interface SeedHint {
  step_number: 1 | 2 | 3;
  content_md: string;
}

export interface SeedProblem {
  id: string;
  lesson_id: string;
  chapter_id: string;
  language?: ProblemLanguage;
  title: string;
  description_md: string;
  difficulty: Difficulty;
  estimated_minutes: number;
  tags: string[];
  starter_code: string;
  solution_code: string;
  explanation_md: string;
  order_index: number;
  test_cases: SeedTestCase[];
  hints: SeedHint[];
}

export interface SeedChapter {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order_index: number;
  lesson_id: string;
  lesson_title: string;
}

export const SEED_COURSE_ID = "11111111-1111-4111-8111-111111111101";
export const SEED_SQL_COURSE_ID = "11111111-1111-4111-8111-111111111102";
export const SEED_GIT_COURSE_ID = "4107aaa5-10f0-41ca-8c22-a3a99eeebcbb";

export const SEED_COURSES = [
  {
    id: SEED_COURSE_ID,
    title: "Java入門コース：ゼロから学ぶ基礎文法とオブジェクト指向入門",
    description:
      "標準出力・変数・データ型・四則演算・Scanner入力・条件分岐（if/switch）・ループ・配列・メソッド・クラス設計の基礎まで全16問のコーディング演習で体系的に習得します。",
    order_index: 1,
    is_published: true,
    prerequisite_course_id: null,
  },
  {
    id: SEED_JAVA_BEGINNER_COURSE_ID,
    title: "Java初級コース：二次元配列・メソッド設計・オブジェクト指向応用",
    description:
      "店舗売上の二次元配列集計、オーバーロード設計、staticによる自動採番、決済インターフェースとポリモーフィズムなど実務基礎へ直結するオブジェクト指向応用を習得します。",
    order_index: 2,
    is_published: true,
    prerequisite_course_id: SEED_COURSE_ID,
  },
  {
    id: SEED_JAVA_INTERMEDIATE_COURSE_ID,
    title: "Java中級コース：コレクション・標準API・CSV処理・例外ハンドリング",
    description:
      "実務で毎日使う ArrayList / HashMap による顧客検索・売上集計、CSVデータのパース処理、try-catch / throw を使った安全な在庫引当・例外制御を習得します。",
    order_index: 3,
    is_published: true,
    prerequisite_course_id: SEED_JAVA_BEGINNER_COURSE_ID,
  },
  {
    id: SEED_JAVA_ADVANCED_COURSE_ID,
    title: "Java上級コース：DAO設計・APIバリデーション・顧客案件管理実践",
    description:
      "DAOリポジトリ設計、REST API入力バリデーション＆ステータス判定、顧客・案件管理システムのService層集計、境界値単体テスト検証など案件参画レベルの実践力を養います。",
    order_index: 4,
    is_published: true,
    prerequisite_course_id: SEED_JAVA_INTERMEDIATE_COURSE_ID,
  },
  {
    id: SEED_SQL_COURSE_ID,
    title: "SQL実践コース：データ抽出・集計・テーブル結合マスター",
    description:
      "SELECT文の基本とWHERE条件指定からスタートし、GROUP BY / HAVING による集計分析、INNER JOIN / LEFT JOIN による複数テーブル結合まで実践クエリ演習で習得します。",
    order_index: 5,
    is_published: true,
    prerequisite_course_id: SEED_JAVA_INTERMEDIATE_COURSE_ID,
  },
  {
    id: SEED_GIT_COURSE_ID,
    title: "Git実践マスター：ビジュアル分岐・マージ演習",
    description:
      "ブラウザ上でコミットやブランチの分岐・マージをリアルタイムに視覚化しながら学ぶ、実践的Gitトレーニング。コマンドライン操作とツリー構造の直感的理解を深めます。",
    order_index: 6,
    is_published: true,
    prerequisite_course_id: null,
  },
];

// デモ・インメモリ環境用の受講生別コースロック状態保存ストア（key: `${userId}:${courseId}` -> "auto" | "unlocked" | "locked"）
// デモ・インメモリ環境用の企業担当者アカウントストア
export interface DemoManagerWithPassword extends CompanyManager {
  password?: string;
}

const INITIAL_DEMO_MANAGERS: DemoManagerWithPassword[] = [
  {
    id: "a0000000-0000-4000-8000-000000000004",
    email: "hr@acme-tech.example.com",
    full_name: "ACMEテクノロジーズ 研修担当",
    role: "company",
    company_id: "00000000-0000-4000-8000-000000000001", // ACME
    created_at: "2025-01-01T00:00:00.000Z",
    last_login_at: "2025-05-12T09:30:00.000Z",
    password: "Password123!",
  },
  {
    id: "a0000000-0000-4000-8000-000000000002",
    email: "company@example.com",
    full_name: "ACME人事 担当者",
    role: "company",
    company_id: "00000000-0000-4000-8000-000000000001", // ACME
    created_at: "2025-01-01T00:00:00.000Z",
    last_login_at: "2025-05-11T16:00:00.000Z",
    password: "Password123!",
  },
  {
    id: "a0000000-0000-4000-8000-000000000005",
    email: "training@next-sys.example.com",
    full_name: "ネクストシステムズ 研修部",
    role: "company",
    company_id: "00000000-0000-4000-8000-000000000002", // NEXT
    created_at: "2025-01-01T00:00:00.000Z",
    last_login_at: "2025-05-10T11:20:00.000Z",
    password: "Password123!",
  },
];

export interface DemoCompanySlackSettings {
  webhookUrl?: string | null;
  channelName?: string | null;
  questionWebhookUrl?: string | null;
  questionChannelName?: string | null;
}

const INITIAL_DEMO_SLACK_SETTINGS: Record<string, DemoCompanySlackSettings> = {
  "00000000-0000-4000-8000-000000000001": {
    webhookUrl: "",
    channelName: "#client-acme2025",
    questionWebhookUrl: "",
    questionChannelName: "#qa-acme2025",
  },
  "00000000-0000-4000-8000-000000000002": {
    webhookUrl: "",
    channelName: "#client-nextsys2025",
    questionWebhookUrl: "",
    questionChannelName: "#qa-nextsys2025",
  },
};

export const INITIAL_DEMO_MILESTONES: TrainingMilestone[] = [
  {
    id: "milestone-1",
    company_id: "00000000-0000-4000-8000-000000000001", // ACME
    title: "Java基礎完了（第1・2章）",
    target_date: "2025-05-15",
    course_id: SEED_COURSE_ID,
    target_problem_count: 6,
    description: "変数・四則演算・条件分岐・ループの全6問をクリアする目標ライン",
    order_index: 1,
  },
  {
    id: "milestone-2",
    company_id: "00000000-0000-4000-8000-000000000001", // ACME
    title: "Java入門コース全問修了",
    target_date: "2025-05-25",
    course_id: SEED_COURSE_ID,
    target_problem_count: 12,
    description: "配列・メソッド・クラス設計を含むJava入門全12問を完全制覇",
    order_index: 2,
  },
  {
    id: "milestone-3",
    company_id: "00000000-0000-4000-8000-000000000001", // ACME
    title: "実践SQL演習修了",
    target_date: "2025-06-10",
    course_id: SEED_SQL_COURSE_ID,
    target_problem_count: 20,
    description: "データベース抽出・集計・JOINを含む全クエリ課題をクリア",
    order_index: 3,
  },
  {
    id: "milestone-4",
    company_id: "00000000-0000-4000-8000-000000000001", // ACME
    title: "Git基礎・ブランチマージ習得",
    target_date: "2025-06-30",
    course_id: SEED_GIT_COURSE_ID,
    target_problem_count: 24,
    description: "Gitコマンドによるコミット・ブランチ作成・マージ・リベース演習を全問クリア",
    order_index: 4,
  },
];

declare global {
  // eslint-disable-next-line no-var
  var __demoStudentCourseLocks: Map<string, "auto" | "unlocked" | "locked"> | undefined;
  // eslint-disable-next-line no-var
  var __demoCompanyManagers: DemoManagerWithPassword[] | undefined;
  // eslint-disable-next-line no-var
  var __demoCompanySlack: Record<string, DemoCompanySlackSettings> | undefined;
  // eslint-disable-next-line no-var
  var __demoMilestones: TrainingMilestone[] | undefined;
}

export function getInMemoryCompanySlackSettings(companyId: string): DemoCompanySlackSettings {
  if (!globalThis.__demoCompanySlack) {
    globalThis.__demoCompanySlack = { ...INITIAL_DEMO_SLACK_SETTINGS };
  }
  return (
    globalThis.__demoCompanySlack[companyId] ?? {
      webhookUrl: "",
      channelName: "",
    }
  );
}

export function updateInMemoryCompanySlackSettings(
  companyId: string,
  webhookUrl?: string | null,
  channelName?: string | null,
  questionWebhookUrl?: string | null,
  questionChannelName?: string | null
) {
  if (!globalThis.__demoCompanySlack) {
    globalThis.__demoCompanySlack = { ...INITIAL_DEMO_SLACK_SETTINGS };
  }
  const prev = globalThis.__demoCompanySlack[companyId] ?? {};
  globalThis.__demoCompanySlack[companyId] = {
    webhookUrl: webhookUrl !== undefined ? webhookUrl : prev.webhookUrl ?? null,
    channelName: channelName !== undefined ? channelName : prev.channelName ?? null,
    questionWebhookUrl:
      questionWebhookUrl !== undefined
        ? questionWebhookUrl
        : prev.questionWebhookUrl ?? null,
    questionChannelName:
      questionChannelName !== undefined
        ? questionChannelName
        : prev.questionChannelName ?? null,
  };
}

export function getInMemoryMilestones(companyId?: string): TrainingMilestone[] {
  if (!globalThis.__demoMilestones) {
    globalThis.__demoMilestones = [...INITIAL_DEMO_MILESTONES];
  }
  if (!companyId) return globalThis.__demoMilestones;
  return globalThis.__demoMilestones.filter(
    (m) => !m.company_id || m.company_id === companyId
  );
}

export function saveInMemoryMilestone(milestone: Omit<TrainingMilestone, "id"> & { id?: string }): TrainingMilestone {
  if (!globalThis.__demoMilestones) {
    globalThis.__demoMilestones = [...INITIAL_DEMO_MILESTONES];
  }
  const id = milestone.id || `milestone-${Date.now()}`;
  const record: TrainingMilestone = {
    ...milestone,
    id,
  };
  const idx = globalThis.__demoMilestones.findIndex((m) => m.id === id);
  if (idx >= 0) {
    globalThis.__demoMilestones[idx] = record;
  } else {
    globalThis.__demoMilestones.push(record);
  }
  return record;
}

export function deleteInMemoryMilestone(id: string): boolean {
  if (!globalThis.__demoMilestones) {
    globalThis.__demoMilestones = [...INITIAL_DEMO_MILESTONES];
  }
  const prevLen = globalThis.__demoMilestones.length;
  globalThis.__demoMilestones = globalThis.__demoMilestones.filter((m) => m.id !== id);
  return globalThis.__demoMilestones.length < prevLen;
}

export function getInMemoryCompanyManagers(companyId: string): CompanyManager[] {
  if (!globalThis.__demoCompanyManagers) {
    globalThis.__demoCompanyManagers = [...INITIAL_DEMO_MANAGERS];
  }
  return globalThis.__demoCompanyManagers
    .filter((m) => m.company_id === companyId)
    .map(({ password: _, ...rest }) => rest);
}

export function addInMemoryCompanyManager(
  manager: Omit<DemoManagerWithPassword, "id" | "created_at" | "last_login_at" | "role"> & {
    id?: string;
    role?: "company";
  }
): CompanyManager {
  if (!globalThis.__demoCompanyManagers) {
    globalThis.__demoCompanyManagers = [...INITIAL_DEMO_MANAGERS];
  }
  const newRecord: DemoManagerWithPassword = {
    id: manager.id ?? `demo-mgr-${Date.now()}`,
    email: manager.email.trim().toLowerCase(),
    full_name: manager.full_name.trim(),
    role: "company",
    company_id: manager.company_id,
    created_at: new Date().toISOString(),
    last_login_at: null,
    password: manager.password || "Password123!",
  };
  // 既存の同メールがあれば更新、なければ追加
  const existingIdx = globalThis.__demoCompanyManagers.findIndex(
    (m) => m.email === newRecord.email
  );
  if (existingIdx >= 0) {
    globalThis.__demoCompanyManagers[existingIdx] = {
      ...globalThis.__demoCompanyManagers[existingIdx],
      ...newRecord,
    };
  } else {
    globalThis.__demoCompanyManagers.push(newRecord);
  }
  const { password: _, ...clean } = newRecord;
  return clean;
}

export function updateInMemoryCompanyManagerPassword(
  emailOrId: string,
  newPassword: string
): boolean {
  if (!globalThis.__demoCompanyManagers) {
    globalThis.__demoCompanyManagers = [...INITIAL_DEMO_MANAGERS];
  }
  const target = globalThis.__demoCompanyManagers.find(
    (m) => m.id === emailOrId || m.email.toLowerCase() === emailOrId.toLowerCase()
  );
  if (target) {
    target.password = newPassword;
    return true;
  }
  return false;
}

export function updateInMemoryCompanyManagerInfo(
  id: string,
  fullName: string,
  email: string
): boolean {
  if (!globalThis.__demoCompanyManagers) {
    globalThis.__demoCompanyManagers = [...INITIAL_DEMO_MANAGERS];
  }
  const target = globalThis.__demoCompanyManagers.find((m) => m.id === id);
  if (target) {
    target.full_name = fullName.trim();
    target.email = email.trim().toLowerCase();
    return true;
  }
  return false;
}

export function deleteInMemoryCompanyManager(id: string): boolean {
  if (!globalThis.__demoCompanyManagers) {
    globalThis.__demoCompanyManagers = [...INITIAL_DEMO_MANAGERS];
  }
  const len = globalThis.__demoCompanyManagers.length;
  globalThis.__demoCompanyManagers = globalThis.__demoCompanyManagers.filter(
    (m) => m.id !== id
  );
  return globalThis.__demoCompanyManagers.length < len;
}

export function verifyInMemoryCompanyManagerLogin(
  email: string,
  pass: string
): DemoManagerWithPassword | null {
  if (!globalThis.__demoCompanyManagers) {
    globalThis.__demoCompanyManagers = [...INITIAL_DEMO_MANAGERS];
  }
  const found = globalThis.__demoCompanyManagers.find(
    (m) => m.email.toLowerCase() === email.trim().toLowerCase()
  );
  if (!found) return null;
  if (!found.password || found.password === pass) {
    return found;
  }
  return null;
}

export function getInMemoryStudentCourseLock(
  userId: string,
  courseId: string
): "auto" | "unlocked" | "locked" {
  if (!globalThis.__demoStudentCourseLocks) {
    globalThis.__demoStudentCourseLocks = new Map();
  }
  return globalThis.__demoStudentCourseLocks.get(`${userId}:${courseId}`) ?? "auto";
}

export function setInMemoryStudentCourseLock(
  userId: string,
  courseId: string,
  status: "auto" | "unlocked" | "locked"
) {
  if (!globalThis.__demoStudentCourseLocks) {
    globalThis.__demoStudentCourseLocks = new Map();
  }
  globalThis.__demoStudentCourseLocks.set(`${userId}:${courseId}`, status);
}

export const SEED_CHAPTERS: SeedChapter[] = [
  {
    id: "22222222-2222-4222-8222-222222222201",
    course_id: SEED_COURSE_ID,
    title: "第1章：出力と変数",
    description: "System.out.println による標準出力、基本データ型、四則演算とScannerによる入力処理を学びます。",
    order_index: 1,
    lesson_id: "33333333-3333-4333-8333-333333333301",
    lesson_title: "1-1. 標準入出力と変数の基本",
  },
  {
    id: "22222222-2222-4222-8222-222222222202",
    course_id: SEED_COURSE_ID,
    title: "第2章：条件分岐とループ",
    description: "if-else文、switch文、forループ、whileループを組み合わせてアルゴリズムの基礎を身につけます。",
    order_index: 2,
    lesson_id: "33333333-3333-4333-8333-333333333302",
    lesson_title: "2-1. 制御構文（分岐・反復）のマスター",
  },
  {
    id: "22222222-2222-4222-8222-222222222203",
    course_id: SEED_COURSE_ID,
    title: "第3章：配列とメソッド",
    description: "1次元・2次元配列の操作、staticメソッドの定義、オーバーロードと再帰呼び出しを実践します。",
    order_index: 3,
    lesson_id: "33333333-3333-4333-8333-333333333303",
    lesson_title: "3-1. 配列処理とメソッド分割",
  },
  {
    id: "22222222-2222-4222-8222-222222222204",
    course_id: SEED_COURSE_ID,
    title: "第4章：クラスとオブジェクト",
    description: "フィールドとコンストラクタ、カプセル化、extendsによる継承とメソッドのオーバーライド、ポリモーフィズムを学びます。",
    order_index: 4,
    lesson_id: "33333333-3333-4333-8333-333333333304",
    lesson_title: "4-1. オブジェクト指向プログラミング実践",
  },
  // --- SQL実践コース（3章構成・全6問） ---
  {
    id: "22222222-2222-4222-8222-222222222211",
    course_id: SEED_SQL_COURSE_ID,
    title: "SQL第1章：SELECTとWHEREによるデータ抽出",
    description: "SELECTによるカラム選択、WHEREによる条件絞り込み、ORDER BYとLIMITによる並び替えを学びます。",
    order_index: 1,
    lesson_id: "33333333-3333-4333-8333-333333333311",
    lesson_title: "1-1. 基本クエリと条件フィルタリング",
  },
  {
    id: "22222222-2222-4222-8222-222222222212",
    course_id: SEED_SQL_COURSE_ID,
    title: "SQL第2章：集約関数とGROUP BYによるデータ集計",
    description: "COUNT, SUM, AVG, MAX, MIN と GROUP BY / HAVING を使って、部門別・カテゴリ別の集計レポートを作成します。",
    order_index: 2,
    lesson_id: "33333333-3333-4333-8333-333333333312",
    lesson_title: "2-1. グループ集計とHAVING条件",
  },
  {
    id: "22222222-2222-4222-8222-222222222213",
    course_id: SEED_SQL_COURSE_ID,
    title: "SQL第3章：JOINによる複数テーブル結合",
    description: "INNER JOIN と LEFT JOIN を使いこなし、正規化された複数テーブルから必要な情報を結合して抽出します。",
    order_index: 3,
    lesson_id: "33333333-3333-4333-8333-333333333313",
    lesson_title: "3-1. テーブル結合（INNER JOIN / LEFT JOIN）",
  },
  // --- Git実践コース（2章構成・全4問） ---
  {
    id: "c29397c4-6902-4601-94b7-c1c782ed0405",
    course_id: SEED_GIT_COURSE_ID,
    title: "Git第1章：コミットの基礎とブランチ作成",
    description: "コミットの作成（git commit）と新ブランチの分岐・切り替え（git branch / git switch）を学びます。",
    order_index: 1,
    lesson_id: "1c09eb0c-7300-440d-9894-8ccbee254d4d",
    lesson_title: "1-1. コミットとブランチの基本",
  },
  {
    id: "9ebaae70-bf77-46cb-a8a6-a827b7831cbd",
    course_id: SEED_GIT_COURSE_ID,
    title: "Git第2章：ブランチの統合と履歴操作",
    description: "Fast-forwardマージ、3-Wayマージ、およびRebaseによるコミット履歴の付け替えを学びます。",
    order_index: 2,
    lesson_id: "61a155fe-360f-41fc-b6de-2a9a00967f52",
    lesson_title: "2-1. マージとRebaseの実践",
  },
  ...EXTRA_JAVA_CHAPTERS,
  ...EXTRA_SQL_CHAPTERS,
];

export const SEED_PROBLEMS: SeedProblem[] = [
  // ===========================================================================
  // 第1章：出力と変数（3問）
  // ===========================================================================
  {
    id: "44444444-4444-4444-8444-444444444401",
    chapter_id: "22222222-2222-4222-8222-222222222201",
    lesson_id: "33333333-3333-4333-8333-333333333301",
    title: "1-1. Hello Java! と複数行の出力",
    description_md: `### 問題概要
Javaの標準出力 \`System.out.println\` を使って、以下の2行を順番に出力するプログラムを作成してください。

\`\`\`
Hello, Java!
Let's start programming!
\`\`\`

### 条件
- 大文字・小文字や記号（カンマ、エクスクラメーションマーク）を正確に出力してください。`,
    difficulty: "easy",
    estimated_minutes: 5,
    tags: ["出力と変数", "基礎構文"],
    starter_code: `public class Main {
    public static void main(String[] args) {
        // ここに System.out.println を記述してください
        
    }
}`,
    solution_code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
        System.out.println("Let's start programming!");
    }
}`,
    explanation_md: `\`System.out.println("文字列");\` を使うと、文字列を出力したあとに自動で改行されます。2行出力する場合は \`System.out.println\` を2回呼び出します。`,
    order_index: 1,
    test_cases: [
      {
        name: "公開テスト1：基本出力チェック",
        input: "",
        expected_output: "Hello, Java!\nLet's start programming!",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：厳密出力チェック",
        input: "",
        expected_output: "Hello, Java!\nLet's start programming!",
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `文字列を画面に出力するには \`System.out.println("...");\` を使います。`,
      },
      {
        step_number: 2,
        content_md: `1行目に \`System.out.println("Hello, Java!");\` を書き、次の行にもう1つ \`System.out.println\` を書きます。`,
      },
      {
        step_number: 3,
        content_md: `文の末尾のセミコロン \`;\` を忘れないように注意しましょう。`,
      },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444444402",
    chapter_id: "22222222-2222-4222-8222-222222222201",
    lesson_id: "33333333-3333-4333-8333-333333333301",
    title: "1-2. 長方形の面積と周囲の長さ",
    description_md: `### 問題概要
標準入力から2つの整数 $H$（縦の長さ）と $W$（横の長さ）が空白または改行区切りで与えられます。
長方形の **面積**（$H \\times W$）と **周囲の長さ**（$2 \\times (H + W)$）を空白区切りで1行に出力してください。

### 入力例
\`\`\`
3 5
\`\`\`

### 出力例
\`\`\`
15 16
\`\`\``,
    difficulty: "easy",
    estimated_minutes: 10,
    tags: ["出力と変数", "算術演算", "Scanner"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int h = sc.nextInt();
        int w = sc.nextInt();
        
        // 面積と周囲の長さを計算して出力してください
        
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int h = sc.nextInt();
        int w = sc.nextInt();
        int area = h * w;
        int perimeter = 2 * (h + w);
        System.out.println(area + " " + perimeter);
    }
}`,
    explanation_md: `掛け算には \`*\` 演算子を使います。周囲の長さは足し算を先に計算させるため \`2 * (h + w)\` のように丸括弧で囲みます。`,
    order_index: 2,
    test_cases: [
      {
        name: "公開テスト1：3×5の長方形",
        input: "3 5",
        expected_output: "15 16",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：正方形 (4×4)",
        input: "4 4",
        expected_output: "16 16",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：大きな値 (12×25)",
        input: "12 25",
        expected_output: "300 74",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `面積は \`int area = h * w;\` で求められます。`,
      },
      {
        step_number: 2,
        content_md: `周囲の長さは \`int perimeter = 2 * (h + w);\` です。`,
      },
      {
        step_number: 3,
        content_md: `空白区切りで出力するには \`System.out.println(area + " " + perimeter);\` と記述します。`,
      },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444444403",
    chapter_id: "22222222-2222-4222-8222-222222222201",
    lesson_id: "33333333-3333-4333-8333-333333333301",
    title: "1-3. 秒数の時間変換（時・分・秒）",
    description_md: `### 問題概要
標準入力から秒数を表す整数 $S$ が与えられます。
これを **時間 ($h$)**、**分 ($m$)**、**秒 ($s$)** に変換し、\`h:m:s\` の形式で出力してください。

### 入力例
\`\`\`
46979
\`\`\`

### 出力例
\`\`\`
13:2:59
\`\`\``,
    difficulty: "easy",
    estimated_minutes: 10,
    tags: ["出力と変数", "算術演算"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int totalSeconds = sc.nextInt();
        
        // h:m:s の形式で出力してください
        
    }
}`,
    solution_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int totalSeconds = sc.nextInt();
        int h = totalSeconds / 3600;
        int m = (totalSeconds % 3600) / 60;
        int s = totalSeconds % 60;
        System.out.println(h + ":" + m + ":" + s);
    }
}`,
    explanation_md: `1時間は3600秒、1分は60秒です。整数の割り算 \`/\` と剰余（余り）演算子 \`%\` を組み合わせることで各単位を取り出せます。`,
    order_index: 3,
    test_cases: [
      {
        name: "公開テスト1：46979秒",
        input: "46979",
        expected_output: "13:2:59",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：3661秒",
        input: "3661",
        expected_output: "1:1:1",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：0秒",
        input: "0",
        expected_output: "0:0:0",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `1時間は 3600 秒なので、時間 \`h\` は \`totalSeconds / 3600\` で計算できます。`,
      },
      {
        step_number: 2,
        content_md: `3600で割った余り \`totalSeconds % 3600\` をさらに 60 で割ると分 \`m\` になります。`,
      },
      {
        step_number: 3,
        content_md: `秒 \`s\` は \`totalSeconds % 60\` です。これらを \`":"\` で連結して出力しましょう。`,
      },
    ],
  },

  // ===========================================================================
  // 第2章：条件分岐とループ（3問）
  // ===========================================================================
  {
    id: "44444444-4444-4444-8444-444444444404",
    chapter_id: "22222222-2222-4222-8222-222222222202",
    lesson_id: "33333333-3333-4333-8333-333333333302",
    title: "2-1. テストの成績判定（if-else分岐）",
    description_md: `### 問題概要
標準入力からテストの点数 $score$（$0 \\le score \\le 100$）が与えられます。
以下の基準に従ってランクを出力してください。

- 80点以上： \`A\`
- 60点以上 80点未満： \`B\`
- 40点以上 60点未満： \`C\`
- 40点未満： \`D\`

### 入力例
\`\`\`
75
\`\`\`

### 出力例
\`\`\`
B
\`\`\``,
    difficulty: "easy",
    estimated_minutes: 10,
    tags: ["条件分岐", "基礎構文"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int score = sc.nextInt();
        
        // if - else if - else を使って判定してください
        
    }
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `上から順番に高い点数の条件（\`score >= 80\`）から判定していくことで、\`else if (score >= 60)\` の時点では自動的に80点未満であることが保証されます。`,
    order_index: 1,
    test_cases: [
      {
        name: "公開テスト1：75点 (B)",
        input: "75",
        expected_output: "B",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：80点境界 (A)",
        input: "80",
        expected_output: "A",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：40点境界 (C)",
        input: "40",
        expected_output: "C",
        is_hidden: true,
        order_index: 3,
      },
      {
        name: "非公開テスト2：39点 (D)",
        input: "39",
        expected_output: "D",
        is_hidden: true,
        order_index: 4,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `\`if (score >= 80)\` から判定を始めます。`,
      },
      {
        step_number: 2,
        content_md: `続けて \`else if (score >= 60)\`、\`else if (score >= 40)\`、最後に \`else\` を使います。`,
      },
      {
        step_number: 3,
        content_md: `境界値（80ちょうど、60ちょうど）を含むため \`>\` ではなく \`>=\` を使いましょう。`,
      },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444444405",
    chapter_id: "22222222-2222-4222-8222-222222222202",
    lesson_id: "33333333-3333-4333-8333-333333333302",
    title: "2-2. FizzBuzz問題（ループと条件分岐）",
    description_md: `### 問題概要
整数 $N$ が与えられます。$1$ から $N$ までの整数を順番に1行ずつ出力してください。
ただし：
- 3の倍数かつ5の倍数のときは数値の代わりに \`FizzBuzz\`
- 3の倍数のときは \`Fizz\`
- 5の倍数のときは \`Buzz\`
を出力してください。

### 入力例
\`\`\`
5
\`\`\`

### 出力例
\`\`\`
1
2
Fizz
4
Buzz
\`\`\``,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["条件分岐", "ループ", "算術演算"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        // 1 から n までループして出力してください
        
    }
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `3と5の両方で割り切れる（つまり15で割り切れる \`i % 15 == 0\`）条件を最初に判定するのがポイントです。先に \`i % 3 == 0\` を判定してしまうと、15のときにも \`Fizz\` になってしまいます。`,
    order_index: 2,
    test_cases: [
      {
        name: "公開テスト1：N=5",
        input: "5",
        expected_output: "1\n2\nFizz\n4\nBuzz",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：N=15",
        input: "15",
        expected_output:
          "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：N=3",
        input: "3",
        expected_output: "1\n2\nFizz",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `\`for (int i = 1; i <= n; i++)\` で1からnまで繰り返します。`,
      },
      {
        step_number: 2,
        content_md: `倍数判定には余りを求める \`%\` 演算子を使います（例：3の倍数なら \`i % 3 == 0\`）。`,
      },
      {
        step_number: 3,
        content_md: `3と5の両方の倍数（\`i % 3 == 0 && i % 5 == 0\`）を一番最初の \`if\` に書きましょう。`,
      },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444444406",
    chapter_id: "22222222-2222-4222-8222-222222222202",
    lesson_id: "33333333-3333-4333-8333-333333333302",
    title: "2-3. 各桁の和（whileループの活用）",
    description_md: `### 問題概要
正の整数 $N$ が与えられます。$N$ の十進法表記における各桁の数字の和を求めて出力してください。
例えば $N = 1234$ のとき、$1 + 2 + 3 + 4 = 10$ を出力します。

### 入力例
\`\`\`
1234
\`\`\`

### 出力例
\`\`\`
10
\`\`\``,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["ループ", "算術演算"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        
        // 各桁の和を計算して出力してください
        
    }
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `整数 \`n\` を 10 で割った余り（\`n % 10\`）が一の位の数字になります。それを \`sum\` に足したあと、\`n /= 10\` で一桁右にずらす処理を \`n > 0\` の間繰り返します。`,
    order_index: 3,
    test_cases: [
      {
        name: "公開テスト1：1234",
        input: "1234",
        expected_output: "10",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：999",
        input: "999",
        expected_output: "27",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：10005",
        input: "10005",
        expected_output: "6",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `一の位の数字は \`n % 10\` で取り出すことができます。`,
      },
      {
        step_number: 2,
        content_md: `一の位を取り除いて桁を1つ減らすには \`n = n / 10;\`（または \`n /= 10;\`）とします。`,
      },
      {
        step_number: 3,
        content_md: `\`while (n > 0)\` のループ内で \`sum += n % 10;\` と \`n /= 10;\` を繰り返しましょう。`,
      },
    ],
  },

  // ===========================================================================
  // 第3章：配列とメソッド（3問）
  // ===========================================================================
  {
    id: "44444444-4444-4444-8444-444444444407",
    chapter_id: "22222222-2222-4222-8222-222222222203",
    lesson_id: "33333333-3333-4333-8333-333333333303",
    title: "3-1. 配列の最大値と合計値",
    description_md: `### 問題概要
最初に要素数 $N$ が与えられ、続けて $N$ 個の整数が与えられます。
これらを配列に格納し、**最大値** と **合計値** を空白区切りで出力してください。

### 入力例
\`\`\`
5
12 45 7 23 19
\`\`\`

### 出力例
\`\`\`
45 106
\`\`\``,
    difficulty: "easy",
    estimated_minutes: 15,
    tags: ["配列", "ループ"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }
        
        // 最大値と合計値を求めて出力してください
        
    }
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `最大値の初期値には配列の先頭要素 \`nums[0]\` を使うと、負の数が含まれる場合でも正しく最大値を求められます。拡張for文 \`for (int v : nums)\` を使うと簡潔に書けます。`,
    order_index: 1,
    test_cases: [
      {
        name: "公開テスト1：5個の正整数",
        input: "5\n12 45 7 23 19",
        expected_output: "45 106",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：負の数を含む配列",
        input: "4\n-10 -3 -25 -8",
        expected_output: "-3 -46",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：1要素のみ",
        input: "1\n100",
        expected_output: "100 100",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `最大値を保持する変数 \`int max = nums[0];\` と、合計用の \`int sum = 0;\` を用意します。`,
      },
      {
        step_number: 2,
        content_md: `ループで各要素を見て、\`if (nums[i] > max) { max = nums[i]; }\` で最大値を更新します。`,
      },
      {
        step_number: 3,
        content_md: `最後に \`System.out.println(max + " " + sum);\` で出力します。`,
      },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444444408",
    chapter_id: "22222222-2222-4222-8222-222222222203",
    lesson_id: "33333333-3333-4333-8333-333333333303",
    title: "3-2. 素数判定メソッドの実装",
    description_md: `### 問題概要
整数 $x$ が素数かどうかを判定する static メソッド \`isPrime(int x)\` を完成させ、標準入力から与えられた整数 $N$ が素数なら \`Prime\`、そうでなければ \`Not Prime\` と出力してください。
（※ 1 は素数ではありません）

### 入力例
\`\`\`
17
\`\`\`

### 出力例
\`\`\`
Prime
\`\`\``,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["メソッド", "ループ", "条件分岐"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static boolean isPrime(int x) {
        // ここを実装してください
        return false;
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
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `2未満の数は素数ではありません。2以上の数については、$2$ から $\\sqrt{x}$（\`i * i <= x\`）までの整数で割り切れるものがあるかを調べ、1つでも割り切れれば \`false\`、最後まで割り切れなければ \`true\` を返します。`,
    order_index: 2,
    test_cases: [
      {
        name: "公開テスト1：17 (Prime)",
        input: "17",
        expected_output: "Prime",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：15 (Not Prime)",
        input: "15",
        expected_output: "Not Prime",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：1 (Not Prime)",
        input: "1",
        expected_output: "Not Prime",
        is_hidden: true,
        order_index: 3,
      },
      {
        name: "非公開テスト2：2 (Prime)",
        input: "2",
        expected_output: "Prime",
        is_hidden: true,
        order_index: 4,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `まず \`if (x < 2) return false;\` で 1 以下の数を除外します。`,
      },
      {
        step_number: 2,
        content_md: `\`for (int i = 2; i < x; i++)\`（または \`i * i <= x\`）で割り切れる数がないか調べます。`,
      },
      {
        step_number: 3,
        content_md: `ループの中で \`if (x % i == 0) return false;\` とし、ループを抜けたら \`return true;\` を返します。`,
      },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444444409",
    chapter_id: "22222222-2222-4222-8222-222222222203",
    lesson_id: "33333333-3333-4333-8333-333333333303",
    title: "3-3. 再帰メソッドによる階乗計算",
    description_md: `### 問題概要
非負整数 $N$（$0 \\le N \\le 10$）が与えられます。
再帰メソッド \`factorial(int n)\` を定義して $N!$（$N$ の階乗）を計算し、出力してください。
ただし $0! = 1$ とします。

### 入力例
\`\`\`
5
\`\`\`

### 出力例
\`\`\`
120
\`\`\``,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["メソッド", "再帰"],
    starter_code: `import java.util.Scanner;

public class Main {
    public static int factorial(int n) {
        // 再帰呼び出しを使って n! を返してください
        
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(factorial(n));
    }
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `再帰メソッドでは必ず「終了条件（ベースケース）」を先に記述します。\`n <= 1\` のとき \`1\` を返し、それ以外は \`n * factorial(n - 1)\` を返します。`,
    order_index: 3,
    test_cases: [
      {
        name: "公開テスト1：5! = 120",
        input: "5",
        expected_output: "120",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：0! = 1",
        input: "0",
        expected_output: "1",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：7! = 5040",
        input: "7",
        expected_output: "5040",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `再帰の終了条件として、\`if (n <= 1) return 1;\` を最初に書きます。`,
      },
      {
        step_number: 2,
        content_md: `$n! = n \\times (n - 1)!$ なので、自分自身を \`factorial(n - 1)\` として呼び出せます。`,
      },
      {
        step_number: 3,
        content_md: `\`return n * factorial(n - 1);\` を返せば完成です。`,
      },
    ],
  },

  // ===========================================================================
  // 第4章：クラスとオブジェクト（3問）
  // ===========================================================================
  {
    id: "44444444-4444-4444-8444-444444444410",
    chapter_id: "22222222-2222-4222-8222-222222222204",
    lesson_id: "33333333-3333-4333-8333-333333333304",
    title: "4-1. 商品クラス（Product）の定義とコンストラクタ",
    description_md: `### 問題概要
商品名 \`name\`（String）と単価 \`price\`（int）をフィールドに持つ \`Product\` クラスを作成してください。
- コンストラクタ \`Product(String name, int price)\` でフィールドを初期化する
- \`getTotalPrice(int quantity)\` メソッドで \`price * quantity\` を返す

標準入力から「商品名 単価 個数」が与えられるので、\`商品名: 合計金額円\` の形式で出力してください。

### 入力例
\`\`\`
Coffee 350 3
\`\`\`

### 出力例
\`\`\`
Coffee: 1050円
\`\`\``,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["オブジェクト指向", "クラス設計"],
    starter_code: `import java.util.Scanner;

class Product {
    String name;
    int price;

    // コンストラクタと getTotalPrice メソッドを実装してください
    
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
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `コンストラクタ内で引数名とフィールド名が同じ場合は \`this.name = name;\` のように \`this\` キーワードを使って自身のフィールドを指し示します。`,
    order_index: 1,
    test_cases: [
      {
        name: "公開テスト1：Coffee 350 3",
        input: "Coffee 350 3",
        expected_output: "Coffee: 1050円",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：Notebook 240 5",
        input: "Notebook 240 5",
        expected_output: "Notebook: 1200円",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：Keyboard 12800 2",
        input: "Keyboard 12800 2",
        expected_output: "Keyboard: 25600円",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `コンストラクタはクラス名と同じ名前 \`public Product(String name, int price)\` で定義します（戻り値型は書きません）。`,
      },
      {
        step_number: 2,
        content_md: `コンストラクタの中で \`this.name = name; this.price = price;\` を代入します。`,
      },
      {
        step_number: 3,
        content_md: `\`public int getTotalPrice(int quantity) { return this.price * quantity; }\` を追加します。`,
      },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444444411",
    chapter_id: "22222222-2222-4222-8222-222222222204",
    lesson_id: "33333333-3333-4333-8333-333333333304",
    title: "4-2. 銀行口座クラス（カプセル化と残高チェック）",
    description_md: `### 問題概要
銀行口座を表す \`BankAccount\` クラスを実装してください。
- 初期残高 \`balance\` をコンストラクタで受け取る
- \`deposit(int amount)\`：残高に \`amount\` を加算する
- \`withdraw(int amount)\`：残高が \`amount\` 以上あれば減算し、足りない場合は減算せず \`Insufficient funds\` と出力する
- \`getBalance()\`：現在の残高を返す

### 入力例
\`\`\`
1000
500
1200
\`\`\`
（※初期残高 1000、預入 500、引出 1200）

### 出力例
\`\`\`
300
\`\`\``,
    difficulty: "medium",
    estimated_minutes: 20,
    tags: ["オブジェクト指向", "クラス設計", "条件分岐"],
    starter_code: `import java.util.Scanner;

class BankAccount {
    private int balance;

    public BankAccount(int initialBalance) {
        this.balance = initialBalance;
    }

    // deposit, withdraw, getBalance を実装してください
    
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
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `フィールドを \`private\` にし、メソッド経由でのみ値を変更できるようにする設計を「カプセル化」と呼びます。\`withdraw\` メソッド内で不正な引き落としを防ぐチェックを入れられます。`,
    order_index: 2,
    test_cases: [
      {
        name: "公開テスト1：引き落とし成功 (1000 + 500 - 1200)",
        input: "1000\n500\n1200",
        expected_output: "300",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：残高不足 (1000 + 200 - 1500)",
        input: "1000\n200\n1500",
        expected_output: "Insufficient funds\n1200",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：残高ぴったり (500 + 500 - 1000)",
        input: "500\n500\n1000",
        expected_output: "0",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `\`public void deposit(int amount) { this.balance += amount; }\` で預け入れを実装します。`,
      },
      {
        step_number: 2,
        content_md: `\`withdraw\` では \`if (this.balance >= amount)\` のときだけ \`this.balance -= amount;\` を実行します。`,
      },
      {
        step_number: 3,
        content_md: `残高が足りない場合の \`else\` ブロックで \`System.out.println("Insufficient funds");\` を出力します。`,
      },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444444412",
    chapter_id: "22222222-2222-4222-8222-222222222204",
    lesson_id: "33333333-3333-4333-8333-333333333304",
    title: "4-3. クラスの継承とメソッドのオーバーライド",
    description_md: `### 問題概要
基底クラス \`Member\` を継承して、\`VipMember\` クラスを作成してください。
- \`Member\` クラスは \`getDiscountedPrice(int price)\` で **5%引き**（\`price * 95 / 100\`）を返します。
- \`VipMember\` クラスは \`Member\` を \`extends\` し、\`getDiscountedPrice(int price)\` をオーバーライドして **20%引き**（\`price * 80 / 100\`）を返すようにしてください。

### 入力例
\`\`\`
vip 10000
\`\`\`

### 出力例
\`\`\`
8000
\`\`\``,
    difficulty: "hard",
    estimated_minutes: 20,
    tags: ["オブジェクト指向", "継承", "ポリモーフィズム"],
    starter_code: `import java.util.Scanner;

class Member {
    public int getDiscountedPrice(int price) {
        return price * 95 / 100;
    }
}

// Member を継承する VipMember クラスを実装してください
class VipMember extends Member {
    
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
}`,
    solution_code: `import java.util.Scanner;

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
}`,
    explanation_md: `親クラス型の変数 \`Member m\` に \`new VipMember()\` を代入しても、実行時には実体のクラス（\`VipMember\`）でオーバーライドされた \`getDiscountedPrice\` が呼ばれます。これをポリモーフィズム（多態性）と呼びます。`,
    order_index: 3,
    test_cases: [
      {
        name: "公開テスト1：vip 10000 (20% OFF)",
        input: "vip 10000",
        expected_output: "8000",
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "公開テスト2：regular 10000 (5% OFF)",
        input: "regular 10000",
        expected_output: "9500",
        is_hidden: false,
        order_index: 2,
      },
      {
        name: "非公開テスト1：vip 2500",
        input: "vip 2500",
        expected_output: "2000",
        is_hidden: true,
        order_index: 3,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `\`VipMember\` クラスの中に \`public int getDiscountedPrice(int price)\` メソッドを定義します。`,
      },
      {
        step_number: 2,
        content_md: `20%引きは元の価格の80%なので \`return price * 80 / 100;\` と計算できます。`,
      },
      {
        step_number: 3,
        content_md: `\`@Override\` アノテーションを付けておくと、メソッド名のタイポを防げます。`,
      },
    ],
  },

  // ===========================================================================
  // SQL実践コース（全6問：SELECT / WHERE / GROUP BY / HAVING / JOIN）
  // ===========================================================================
  {
    id: "44444444-4444-4444-8444-444444444501",
    chapter_id: "22222222-2222-4222-8222-222222222211",
    lesson_id: "33333333-3333-4333-8333-333333333311",
    language: "sql",
    title: "SQL 1-1. 条件に合う社員データの抽出（SELECT / WHERE）",
    description_md: `### 問題概要
社員テーブル \`employees\` から、部門（\`department\`）が \`'Engineering'\` である社員の **氏名（\`name\`）** と **給与（\`salary\`）** を抽出するSQLクエリを作成してください。

### テーブル定義：\`employees\`
| カラム名 | 型 | 説明 |
| :--- | :--- | :--- |
| \`id\` | INT | 社員ID |
| \`name\` | TEXT | 氏名 |
| \`department\` | TEXT | 所属部門 |
| \`salary\` | INT | 給与（万円） |

### 期待される出力カラム
\`name\`, \`salary\``,
    difficulty: "easy",
    estimated_minutes: 10,
    tags: ["SQL抽出", "基礎構文"],
    starter_code: `-- Engineering 部門の name と salary を取得してください
SELECT name, salary
FROM employees
`,
    solution_code: `SELECT name, salary
FROM employees
WHERE department = 'Engineering';`,
    explanation_md: `特定の条件に一致する行だけを抽出するには \`WHERE カラム名 = '値'\` を使用します。文字列リテラルはシングルクォート \`'Engineering'\` で囲みます。`,
    order_index: 1,
    test_cases: [
      {
        name: "公開テスト1：基本社員テーブル",
        input: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1, 'Tanaka', 'Engineering', 650), (2, 'Suzuki', 'Sales', 520), (3, 'Sato', 'Engineering', 720);`,
        expected_output: `name | salary\nTanaka | 650\nSato | 720`,
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：別データセット検証",
        input: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (10, 'Yamada', 'HR', 480), (11, 'Ito', 'Engineering', 800), (12, 'Watanabe', 'Engineering', 590);`,
        expected_output: `name | salary\nIto | 800\nWatanabe | 590`,
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `取得するカラムは \`SELECT name, salary\`、テーブルは \`FROM employees\` です。`,
      },
      {
        step_number: 2,
        content_md: `条件の絞り込みには \`WHERE\` 句を使います。`,
      },
      {
        step_number: 3,
        content_md: `\`WHERE department = 'Engineering';\` を追加すれば完成です。`,
      },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444444502",
    chapter_id: "22222222-2222-4222-8222-222222222211",
    lesson_id: "33333333-3333-4333-8333-333333333311",
    language: "sql",
    title: "SQL 1-2. 高額商品の並び替えと上位取得（ORDER BY / LIMIT）",
    description_md: `### 問題概要
商品テーブル \`products\` から、価格（\`price\`）が \`1000\` 以上の商品を抽出し、**価格の高い順（降順）** に並び替えて上位 **3件** の \`name\` と \`price\` を取得してください。

### テーブル定義：\`products\`
- \`id\` (INT)
- \`name\` (TEXT)
- \`price\` (INT)`,
    difficulty: "easy",
    estimated_minutes: 10,
    tags: ["SQL抽出", "ソート"],
    starter_code: `-- 価格1000以上の商品を価格の降順で上位3件取得してください
SELECT name, price
FROM products
`,
    solution_code: `SELECT name, price
FROM products
WHERE price >= 1000
ORDER BY price DESC
LIMIT 3;`,
    explanation_md: `降順（大きい順）で並び替えるには \`ORDER BY カラム名 DESC\` を使い、取得件数を制限するには末尾に \`LIMIT 件数\` を指定します。`,
    order_index: 2,
    test_cases: [
      {
        name: "公開テスト1：5商品のうち上位3件",
        input: `CREATE TABLE products (id INT, name TEXT, price INT);
INSERT INTO products VALUES (1, 'Mouse', 2500), (2, 'Cable', 800), (3, 'Keyboard', 8500), (4, 'Monitor', 32000), (5, 'Stand', 4200);`,
        expected_output: `name | price\nMonitor | 32000\nKeyboard | 8500\nStand | 4200`,
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：境界値1000円を含むケース",
        input: `CREATE TABLE products (id INT, name TEXT, price INT);
INSERT INTO products VALUES (1, 'ItemA', 1000), (2, 'ItemB', 999), (3, 'ItemC', 5000), (4, 'ItemD', 3000);`,
        expected_output: `name | price\nItemC | 5000\nItemD | 3000\nItemA | 1000`,
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `まず \`WHERE price >= 1000\` で1000円以上の商品に絞り込みます。`,
      },
      {
        step_number: 2,
        content_md: `高い順に並べるには \`ORDER BY price DESC\` を指定します。`,
      },
      {
        step_number: 3,
        content_md: `最後に \`LIMIT 3\` を付けて上位3件だけを取得します。`,
      },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444444503",
    chapter_id: "22222222-2222-4222-8222-222222222212",
    lesson_id: "33333333-3333-4333-8333-333333333312",
    language: "sql",
    title: "SQL 2-1. 部門別の社員数と平均給与の集計（GROUP BY）",
    description_md: `### 問題概要
社員テーブル \`employees\` を部門（\`department\`）ごとにグループ化し、以下の3項目を取得してください。
1. \`department\`（部門名）
2. \`COUNT(*) AS emp_count\`（社員数）
3. \`AVG(salary) AS avg_salary\`（平均給与）

さらに、結果は社員数（\`emp_count\`）の多い順（降順）に並び替えてください。`,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["SQL集計", "GROUP BY"],
    starter_code: `-- 部門ごとの社員数(emp_count)と平均給与(avg_salary)を集計してください
SELECT department, COUNT(*) AS emp_count, AVG(salary) AS avg_salary
FROM employees
`,
    solution_code: `SELECT department, COUNT(*) AS emp_count, AVG(salary) AS avg_salary
FROM employees
GROUP BY department
ORDER BY emp_count DESC;`,
    explanation_md: `\`GROUP BY department\` を指定すると部門ごとにレコードが集約され、各グループに対する \`COUNT(*)\`（件数）や \`AVG(salary)\`（平均値）を計算できます。`,
    order_index: 1,
    test_cases: [
      {
        name: "公開テスト1：3部門の集計",
        input: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1, 'A', 'Engineering', 600), (2, 'B', 'Engineering', 800), (3, 'C', 'Engineering', 700), (4, 'D', 'Sales', 500), (5, 'E', 'Sales', 600), (6, 'F', 'HR', 450);`,
        expected_output: `department | emp_count | avg_salary\nEngineering | 3 | 700\nSales | 2 | 550\nHR | 1 | 450`,
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：別データの部門集計",
        input: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1, 'X', 'Marketing', 500), (2, 'Y', 'Marketing', 700), (3, 'Z', 'Support', 400);`,
        expected_output: `department | emp_count | avg_salary\nMarketing | 2 | 600\nSupport | 1 | 400`,
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `部門ごとにまとめるには \`GROUP BY department\` を使います。`,
      },
      {
        step_number: 2,
        content_md: `SELECT句で付けた別名 \`emp_count\` は \`ORDER BY\` でもそのまま使えます。`,
      },
      {
        step_number: 3,
        content_md: `\`GROUP BY department ORDER BY emp_count DESC;\` を記述しましょう。`,
      },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444444504",
    chapter_id: "22222222-2222-4222-8222-222222222212",
    lesson_id: "33333333-3333-4333-8333-333333333312",
    language: "sql",
    title: "SQL 2-2. 売上合計が基準以上の顧客を抽出（GROUP BY / HAVING）",
    description_md: `### 問題概要
注文テーブル \`orders\` から、顧客ID（\`customer_id\`）ごとの合計注文金額 \`SUM(amount) AS total_amount\` を集計し、**合計金額が 10000 以上** の顧客のみを \`total_amount\` の降順で抽出してください。

### テーブル定義：\`orders\`
- \`id\` (INT)
- \`customer_id\` (INT)
- \`amount\` (INT)`,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["SQL集計", "GROUP BY"],
    starter_code: `-- 顧客ごとの合計金額(total_amount)が10000以上のデータを抽出してください
SELECT customer_id, SUM(amount) AS total_amount
FROM orders
`,
    solution_code: `SELECT customer_id, SUM(amount) AS total_amount
FROM orders
GROUP BY customer_id
HAVING SUM(amount) >= 10000
ORDER BY total_amount DESC;`,
    explanation_md: `グループ化した後の集約結果（\`SUM(amount)\` など）に対して条件を指定する場合は、\`WHERE\` ではなく \`HAVING\` 句を使用します。`,
    order_index: 2,
    test_cases: [
      {
        name: "公開テスト1：顧客別売上フィルタ",
        input: `CREATE TABLE orders (id INT, customer_id INT, amount INT);
INSERT INTO orders VALUES (1, 101, 6000), (2, 101, 5500), (3, 102, 4000), (4, 103, 15000), (5, 102, 3000);`,
        expected_output: `customer_id | total_amount\n103 | 15000\n101 | 11500`,
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：10000ちょうどの境界値",
        input: `CREATE TABLE orders (id INT, customer_id INT, amount INT);
INSERT INTO orders VALUES (1, 201, 5000), (2, 201, 5000), (3, 202, 9999);`,
        expected_output: `customer_id | total_amount\n201 | 10000`,
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `まず \`GROUP BY customer_id\` で顧客ごとにグループ化します。`,
      },
      {
        step_number: 2,
        content_md: `集約関数に対する条件は \`HAVING SUM(amount) >= 10000\` と記述します。`,
      },
      {
        step_number: 3,
        content_md: `最後に \`ORDER BY total_amount DESC\` で降順に並べます。`,
      },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444444505",
    chapter_id: "22222222-2222-4222-8222-222222222213",
    lesson_id: "33333333-3333-4333-8333-333333333313",
    language: "sql",
    title: "SQL 3-1. 社員と部門テーブルの内部結合（INNER JOIN）",
    description_md: `### 問題概要
社員テーブル \`employees\` と部門テーブル \`departments\` を \`dept_id\` と \`id\` で内部結合（\`INNER JOIN\`）し、社員名 \`emp_name\` と部門名 \`dept_name\` を社員ID（\`employees.id\`）の昇順で取得してください。

### テーブル定義
- \`employees\`: \`id\` (INT), \`emp_name\` (TEXT), \`dept_id\` (INT)
- \`departments\`: \`id\` (INT), \`dept_name\` (TEXT)`,
    difficulty: "medium",
    estimated_minutes: 15,
    tags: ["SQL結合", "JOIN"],
    starter_code: `-- employees と departments を結合して emp_name, dept_name を取得してください
SELECT e.emp_name, d.dept_name
FROM employees e
`,
    solution_code: `SELECT e.emp_name, d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id
ORDER BY e.id ASC;`,
    explanation_md: `2つのテーブルに共通するキー（\`e.dept_id = d.id\`）を \`ON\` 句に指定して \`INNER JOIN\` することで、両方のテーブルに存在するデータを結合して取得できます。`,
    order_index: 1,
    test_cases: [
      {
        name: "公開テスト1：社員と部門の結合",
        input: `CREATE TABLE departments (id INT, dept_name TEXT);
CREATE TABLE employees (id INT, emp_name TEXT, dept_id INT);
INSERT INTO departments VALUES (10, 'プラットフォーム開発部'), (20, 'クラウド営業部');
INSERT INTO employees VALUES (1, 'Yamada', 10), (2, 'Suzuki', 20), (3, 'Sato', 10);`,
        expected_output: `emp_name | dept_name\nYamada | プラットフォーム開発部\nSuzuki | クラウド営業部\nSato | プラットフォーム開発部`,
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：未配属社員を除外する内部結合の確認",
        input: `CREATE TABLE departments (id INT, dept_name TEXT);
CREATE TABLE employees (id INT, emp_name TEXT, dept_id INT);
INSERT INTO departments VALUES (1, 'AI研究部');
INSERT INTO employees VALUES (1, 'Takahashi', 1), (2, 'Kato', 99);`,
        expected_output: `emp_name | dept_name\nTakahashi | AI研究部`,
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `\`FROM employees e\` に続けて \`INNER JOIN departments d\` と書きます。`,
      },
      {
        step_number: 2,
        content_md: `結合条件は \`ON e.dept_id = d.id\` です。`,
      },
      {
        step_number: 3,
        content_md: `\`ORDER BY e.id ASC;\` を末尾に付ければ完成です。`,
      },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444444506",
    chapter_id: "22222222-2222-4222-8222-222222222213",
    lesson_id: "33333333-3333-4333-8333-333333333313",
    language: "sql",
    title: "SQL 3-2. 外部結合と注文実績のない顧客も含めた集計（LEFT JOIN）",
    description_md: `### 問題概要
顧客テーブル \`customers\` と注文テーブル \`orders\` を外部結合（\`LEFT JOIN\`）し、**まだ一度も注文していない顧客も含めて**、各顧客の \`name\` と注文回数 \`COUNT(o.id) AS order_count\` を顧客ID（\`c.id\`）の昇順で取得してください。

### テーブル定義
- \`customers\`: \`id\` (INT), \`name\` (TEXT)
- \`orders\`: \`id\` (INT), \`customer_id\` (INT)`,
    difficulty: "hard",
    estimated_minutes: 20,
    tags: ["SQL結合", "JOIN", "SQL集計"],
    starter_code: `-- 注文が0件の顧客も含めて注文回数(order_count)を集計してください
SELECT c.name, COUNT(o.id) AS order_count
FROM customers c
`,
    solution_code: `SELECT c.name, COUNT(o.id) AS order_count
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY c.id ASC;`,
    explanation_md: `\`LEFT JOIN\` を使うと、右側の \`orders\` テーブルに一致する行がない場合でも左側の \`customers\` の行が残り、\`o.id\` は \`NULL\` になります。\`COUNT(*)\` ではなく \`COUNT(o.id)\` を使うことで、\`NULL\` の行を 0 件として正しくカウントできます。`,
    order_index: 2,
    test_cases: [
      {
        name: "公開テスト1：注文0件の顧客を含む集計",
        input: `CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE orders (id INT, customer_id INT);
INSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie');
INSERT INTO orders VALUES (101, 1), (102, 1), (103, 3);`,
        expected_output: `name | order_count\nAlice | 2\nBob | 0\nCharlie | 1`,
        is_hidden: false,
        order_index: 1,
      },
      {
        name: "非公開テスト1：全員0件〜複数件の検証",
        input: `CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE orders (id INT, customer_id INT);
INSERT INTO customers VALUES (10, 'Ken'), (20, 'Miki');
INSERT INTO orders VALUES (1, 20), (2, 20), (3, 20);`,
        expected_output: `name | order_count\nKen | 0\nMiki | 3`,
        is_hidden: true,
        order_index: 2,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: `注文がない顧客も残すため \`LEFT JOIN orders o ON c.id = o.customer_id\` を使います。`,
      },
      {
        step_number: 2,
        content_md: `\`COUNT(*)\` だと NULL 行も 1 と数えてしまうため、必ず \`COUNT(o.id)\` を使います。`,
      },
      {
        step_number: 3,
        content_md: `\`GROUP BY c.id, c.name ORDER BY c.id ASC;\` でグループ化と並び替えを行います。`,
      },
    ],
  },
  // ===========================================================================
  // Git実践コース（全4問：commit / branch / switch / merge / rebase）
  // ===========================================================================
  {
    id: "f1f2b638-0364-44fb-b855-88ce8a1eeb3b",
    chapter_id: "c29397c4-6902-4601-94b7-c1c782ed0405",
    lesson_id: "1c09eb0c-7300-440d-9894-8ccbee254d4d",
    language: "git",
    title: "Git 1-1. 初めてのコミット作成（git commit）",
    description_md: `### ミッション概要
Gitの最も基本的な操作であるコミット（\`git commit\`）を作成しましょう。

現在、リポジトリには初期コミット \`C0\` が存在し、\`main\` ブランチがそれを指しています。
\`git commit\` コマンドを **2回** 実行して、コミット \`C1\` と \`C2\` を追加し、\`main\` ブランチを進めてください。

### 達成条件
- \`main\` ブランチが新しく作成されたコミット（C2）を指していること。
- 右上の「到達目標 (Goal)」と同じツリー構造にすること。`,
    difficulty: "easy",
    estimated_minutes: 5,
    tags: ["Git基礎", "コミット操作"],
    starter_code: "",
    solution_code: `git commit -m "first commit"\ngit commit -m "second commit"`,
    explanation_md: `\`git commit\` を実行すると、現在のHEADが指しているコミットの直下に新しいコミットノードが作成され、ブランチのポインタが自動的に前進します。`,
    order_index: 1,
    test_cases: [
      {
        name: "公開テスト1：コミットの追加とブランチ前進",
        input: "",
        expected_output: "CLEAR: 目標ツリーと完全一致",
        is_hidden: false,
        order_index: 1,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "ターミナルに `git commit` と入力して Enter キーを押してください。",
      },
      {
        step_number: 2,
        content_md: "もう一度 `git commit` を実行して、2つ目のコミットを作成すれば目標達成です。",
      },
    ],
  },
  {
    id: "b05d7199-850f-4ce6-8c2d-50362abf643a",
    chapter_id: "c29397c4-6902-4601-94b7-c1c782ed0405",
    lesson_id: "1c09eb0c-7300-440d-9894-8ccbee254d4d",
    language: "git",
    title: "Git 1-2. 新規ブランチの作成と切り替え（git branch / git switch）",
    description_md: `### ミッション概要
新しい機能開発やバグ修正を行うため、\`bugfix\` という名前の新しいブランチを作成して切り替え、コミットを作成しましょう。

### 手順
1. \`git branch bugfix\` で新ブランチ \`bugfix\` を作成する。
2. \`git switch bugfix\` で \`bugfix\` ブランチに切り替える。
   （または \`git switch -c bugfix\` で作成と切り替えを同時に行っても構いません）
3. \`git commit\` を1回実行して、\`bugfix\` ブランチ上で作業を進める。

### 達成条件
- \`main\` ブランチは初期コミット \`C0\` のままであること。
- \`bugfix\` ブランチが新コミット \`C1\` を指し、現在 \`HEAD\` が \`bugfix\` を指していること。`,
    difficulty: "easy",
    estimated_minutes: 8,
    tags: ["Gitブランチ", "チェックアウト"],
    starter_code: "",
    solution_code: `git branch bugfix\ngit switch bugfix\ngit commit -m "fix bug"`,
    explanation_md: `\`git branch <名前>\` でブランチを作成し、\`git switch <名前>\` で作業ブランチを切り替えます。\`git switch -c <名前>\` を使えば1コマンドで両方を同時に実行できます。`,
    order_index: 2,
    test_cases: [
      {
        name: "公開テスト1：ブランチ作成と切り替えコミット",
        input: "",
        expected_output: "CLEAR: 目標ツリーと完全一致",
        is_hidden: false,
        order_index: 1,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "`git branch bugfix` でブランチを作成します。",
      },
      {
        step_number: 2,
        content_md: "`git switch bugfix` で切り替えてから、`git commit` を実行します。",
      },
    ],
  },
  {
    id: "f3da9229-efeb-44bf-be80-926c2319811d",
    chapter_id: "9ebaae70-bf77-46cb-a8a6-a827b7831cbd",
    lesson_id: "61a155fe-360f-41fc-b6de-2a9a00967f52",
    language: "git",
    title: "Git 2-1. ブランチの統合（git merge）",
    description_md: `### ミッション概要
独立して開発された \`feature\` ブランチを、本線である \`main\` ブランチに統合（マージ）しましょう。

初期状態では、\`main\` でコミット \`C1\`、\`feature\` でコミット \`C2\` がそれぞれ分岐しています。

### 手順
1. \`main\` ブランチに切り替える（すでに \`main\` にいるか \`git status\` で確認）。
2. \`git merge feature\` を実行して、\`feature\` ブランチの変更を \`main\` に統合する。

### 達成条件
- \`main\` ブランチに2つの親（C1とC2）を持つマージコミットが作成されていること。`,
    difficulty: "medium",
    estimated_minutes: 10,
    tags: ["Gitマージ", "ブランチ統合"],
    starter_code: `git commit -m "main work"\ngit switch -c feature\ngit commit -m "feature work"\ngit switch main\ngit commit -m "main update"`,
    solution_code: `git commit -m "main work"\ngit switch -c feature\ngit commit -m "feature work"\ngit switch main\ngit commit -m "main update"\ngit merge feature`,
    explanation_md: `\`git merge <ブランチ名>\` を実行すると、現在のブランチに指定ブランチの履歴が統合されます。分岐している場合は、双方の親を持つマージコミットが新しく作成されます。`,
    order_index: 1,
    test_cases: [
      {
        name: "公開テスト1：マージコミットの生成",
        input: "",
        expected_output: "CLEAR: 目標ツリーと完全一致",
        is_hidden: false,
        order_index: 1,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "まず `git switch main` で main ブランチにいることを確認します。",
      },
      {
        step_number: 2,
        content_md: "`git merge feature` を実行すると、3-wayマージコミットが作成されます。",
      },
    ],
  },
  {
    id: "ebc882bf-b24e-4d04-976b-1cb4933570ef",
    chapter_id: "9ebaae70-bf77-46cb-a8a6-a827b7831cbd",
    lesson_id: "61a155fe-360f-41fc-b6de-2a9a00967f52",
    language: "git",
    title: "Git 2-2. 履歴の付け替え（git rebase）",
    description_md: `### ミッション概要
コミット履歴をきれいに一本化するため、\`git rebase\` を使って \`feature\` ブランチのコミットを \`main\` ブランチの先端に付け替えましょう。

### 手順
1. \`feature\` ブランチに切り替える（\`git switch feature\`）。
2. \`git rebase main\` を実行して、\`feature\` のコミットを \`main\` の最新コミットの上に再配置する。

### 達成条件
- \`feature\` ブランチが \`main\` の上に一本の線として付け替えられていること。`,
    difficulty: "medium",
    estimated_minutes: 10,
    tags: ["Gitリベース", "履歴整理"],
    starter_code: `git commit -m "c1"\ngit switch -c feature\ngit commit -m "f1"\ngit switch main\ngit commit -m "c2"\ngit switch feature`,
    solution_code: `git commit -m "c1"\ngit switch -c feature\ngit commit -m "f1"\ngit switch main\ngit commit -m "c2"\ngit switch feature\ngit rebase main`,
    explanation_md: `\`git rebase <ブランチ名>\` は、現在のブランチのコミットをターゲットブランチの先端に順番にコピーして付け替えることで、直線的で見やすい履歴を作成するコマンドです。`,
    order_index: 2,
    test_cases: [
      {
        name: "公開テスト1：Rebaseによる履歴一本化",
        input: "",
        expected_output: "CLEAR: 目標ツリーと完全一致",
        is_hidden: false,
        order_index: 1,
      },
    ],
    hints: [
      {
        step_number: 1,
        content_md: "まず `git switch feature` で feature ブランチに切り替えます。",
      },
      {
        step_number: 2,
        content_md: "`git rebase main` を実行すると、feature のコミットが main の先端に付け替えられます。",
      },
    ],
  },
  ...EXTRA_JAVA_PROBLEMS,
  ...EXTRA_SQL_PROBLEMS,
];

export function detectProblemLanguage(problem: {
  language?: ProblemLanguage;
  tags?: string[];
  starter_code?: string;
}): ProblemLanguage {
  if (problem.language === "git" || problem.language === "sql" || problem.language === "java") {
    return problem.language;
  }
  if (problem.tags?.some((t) => t.toUpperCase().includes("GIT"))) {
    return "git";
  }
  if (problem.tags?.some((t) => t.toUpperCase().includes("SQL"))) {
    return "sql";
  }
  if (problem.starter_code && /^\s*(--|SELECT|INSERT|UPDATE|DELETE|CREATE)\b/i.test(problem.starter_code)) {
    return "sql";
  }
  if (problem.starter_code && /^\s*(git\b|#\s*git)/i.test(problem.starter_code)) {
    return "git";
  }
  return "java";
}

