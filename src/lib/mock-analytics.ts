// =============================================================================
// 管理者・企業担当者用の受講生サンプル分析データ（DB未接続・デモ時にも即座に可視化）
// =============================================================================

export interface StudentAnalyticsRecord {
  id: string;
  fullName: string;
  email: string;
  companyId: string;
  companyName: string;
  companyCode: string;
  progressPercent: number;
  completedProblems: number;
  totalProblems: number;
  weeklyMinutes: number;
  totalMinutes: number;
  streakDays: number;
  lastLoginAt: string;
  isDelayed: boolean; // 遅れている受講生アラート（進捗30%未満 または 5日以上未ログイン）
  delayReason?: string;
  chapterProgress: {
    chapterTitle: string;
    completed: number;
    total: number;
  }[];
  skillScores: {
    tag: string;
    score: number;
    fullMark: number;
  }[];
  evaluations: {
    id: string;
    adminName: string;
    rating: number;
    comment: string;
    createdAt: string;
  }[];
}

export const DEMO_STUDENTS_ANALYTICS: StudentAnalyticsRecord[] = [
  {
    id: "a0000000-0000-4000-8000-000000000101",
    fullName: "鈴木 次郎",
    email: "jiro.suzuki@acme-tech.example.com",
    companyId: "00000000-0000-4000-8000-000000000001",
    companyName: "株式会社ACMEテクノロジーズ",
    companyCode: "ACME2025",
    progressPercent: 85,
    completedProblems: 58,
    totalProblems: 68,
    weeklyMinutes: 185,
    totalMinutes: 940,
    streakDays: 7,
    lastLoginAt: "2026-11-22 09:30",
    isDelayed: false,
    chapterProgress: [
      { chapterTitle: "第1章：出力と変数", completed: 3, total: 3 },
      { chapterTitle: "第2章：条件分岐とループ", completed: 3, total: 3 },
      { chapterTitle: "第3章：配列とメソッド", completed: 3, total: 3 },
      { chapterTitle: "第4章：クラスとオブジェクト", completed: 3, total: 3 },
    ],
    skillScores: [
      { tag: "出力と変数", score: 100, fullMark: 100 },
      { tag: "算術演算", score: 100, fullMark: 100 },
      { tag: "条件分岐", score: 95, fullMark: 100 },
      { tag: "ループ", score: 95, fullMark: 100 },
      { tag: "配列", score: 90, fullMark: 100 },
      { tag: "メソッド", score: 90, fullMark: 100 },
      { tag: "オブジェクト指向", score: 85, fullMark: 100 },
    ],
    evaluations: [
      {
        id: "eval-1",
        adminName: "佐藤 健一（主任講師）",
        rating: 5,
        comment:
          "配列・オブジェクト指向・SQL結合まで一発合格が多く、理解度・実装スピードともに非常に優秀です。実践課題でも安定した設計ができています。",
        createdAt: "2026-11-21",
      },
    ],
  },
  {
    id: "a0000000-0000-4000-8000-000000000102",
    fullName: "山田 花子",
    email: "hanako.yamada@acme-tech.example.com",
    companyId: "00000000-0000-4000-8000-000000000001",
    companyName: "株式会社ACMEテクノロジーズ",
    companyCode: "ACME2025",
    progressPercent: 55,
    completedProblems: 37,
    totalProblems: 68,
    weeklyMinutes: 110,
    totalMinutes: 520,
    streakDays: 3,
    lastLoginAt: "2026-11-21 18:15",
    isDelayed: false,
    chapterProgress: [
      { chapterTitle: "第1章：出力と変数", completed: 3, total: 3 },
      { chapterTitle: "第2章：条件分岐とループ", completed: 3, total: 3 },
      { chapterTitle: "第3章：配列とメソッド", completed: 2, total: 3 },
      { chapterTitle: "第4章：クラスとオブジェクト", completed: 1, total: 3 },
    ],
    skillScores: [
      { tag: "出力と変数", score: 100, fullMark: 100 },
      { tag: "算術演算", score: 90, fullMark: 100 },
      { tag: "条件分岐", score: 85, fullMark: 100 },
      { tag: "ループ", score: 80, fullMark: 100 },
      { tag: "配列", score: 65, fullMark: 100 },
      { tag: "メソッド", score: 55, fullMark: 100 },
      { tag: "オブジェクト指向", score: 45, fullMark: 100 },
    ],
    evaluations: [
      {
        id: "eval-2",
        adminName: "佐藤 健一（主任講師）",
        rating: 4,
        comment:
          "基礎構文とループは着実に定着しており、計画通りのペースで進んでいます。オブジェクト指向とSQL集計を次回メンタリングでさらに強化しましょう。",
        createdAt: "2026-11-20",
      },
    ],
  },
  {
    id: "a0000000-0000-4000-8000-000000000103",
    fullName: "佐藤 三郎",
    email: "saburo.sato@acme-tech.example.com",
    companyId: "00000000-0000-4000-8000-000000000001",
    companyName: "株式会社ACMEテクノロジーズ",
    companyCode: "ACME2025",
    progressPercent: 18,
    completedProblems: 12,
    totalProblems: 68,
    weeklyMinutes: 15,
    totalMinutes: 140,
    streakDays: 0,
    lastLoginAt: "2026-11-14 14:20",
    isDelayed: true,
    delayReason: "最終ログインから8日経過・第2章で停滞中",
    chapterProgress: [
      { chapterTitle: "第1章：出力と変数", completed: 3, total: 3 },
      { chapterTitle: "第2章：条件分岐とループ", completed: 1, total: 3 },
      { chapterTitle: "第3章：配列とメソッド", completed: 0, total: 3 },
      { chapterTitle: "第4章：クラスとオブジェクト", completed: 0, total: 3 },
    ],
    skillScores: [
      { tag: "出力と変数", score: 90, fullMark: 100 },
      { tag: "算術演算", score: 75, fullMark: 100 },
      { tag: "条件分岐", score: 35, fullMark: 100 },
      { tag: "ループ", score: 15, fullMark: 100 },
      { tag: "配列", score: 0, fullMark: 100 },
      { tag: "メソッド", score: 0, fullMark: 100 },
      { tag: "オブジェクト指向", score: 0, fullMark: 100 },
    ],
    evaluations: [
      {
        id: "eval-3",
        adminName: "佐藤 健一（主任講師）",
        rating: 2,
        comment:
          "第2章のループ問題でつまずいており、直近8日間ログインが途絶えています。早めの1on1フォロー・声かけを推奨します。",
        createdAt: "2026-11-15",
      },
    ],
  },
  {
    id: "demo-student-4",
    fullName: "高橋 健太",
    email: "kenta.takahashi@next-sys.example.com",
    companyId: "00000000-0000-4000-8000-000000000002",
    companyName: "ネクストシステムズ株式会社",
    companyCode: "TECH2025",
    progressPercent: 100,
    completedProblems: 12,
    totalProblems: 12,
    weeklyMinutes: 210,
    totalMinutes: 560,
    streakDays: 10,
    lastLoginAt: "2025-05-12 11:05",
    isDelayed: false,
    chapterProgress: [
      { chapterTitle: "第1章：出力と変数", completed: 3, total: 3 },
      { chapterTitle: "第2章：条件分岐とループ", completed: 3, total: 3 },
      { chapterTitle: "第3章：配列とメソッド", completed: 3, total: 3 },
      { chapterTitle: "第4章：クラスとオブジェクト", completed: 3, total: 3 },
    ],
    skillScores: [
      { tag: "出力と変数", score: 100, fullMark: 100 },
      { tag: "算術演算", score: 100, fullMark: 100 },
      { tag: "条件分岐", score: 100, fullMark: 100 },
      { tag: "ループ", score: 100, fullMark: 100 },
      { tag: "配列", score: 100, fullMark: 100 },
      { tag: "メソッド", score: 100, fullMark: 100 },
      { tag: "オブジェクト指向", score: 100, fullMark: 100 },
    ],
    evaluations: [
      {
        id: "eval-4",
        adminName: "佐藤 健一（主任講師）",
        rating: 5,
        comment: "全12問を完走しました。継承とオーバーライドの設計も完璧です。",
        createdAt: "2025-05-12",
      },
    ],
  },
];
