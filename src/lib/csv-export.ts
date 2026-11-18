// =============================================================================
// 受講生進捗レポート CSVエクスポーター（管理者・企業担当者共通）
// Excelでそのまま開いても文字化けしない BOM付きUTF-8 形式で、
// 研修報告・評価に必要な全項目（基本進捗＋章別内訳＋スキル分野別スコア＋講師評価）を出力
// =============================================================================

import { StudentAnalyticsRecord } from "./mock-analytics";

export function exportStudentsProgressToCsv(
  students: StudentAnalyticsRecord[],
  filenamePrefix = "training_progress_report"
) {
  if (typeof window === "undefined") return;

  // 章タイトル一覧（先頭受講生または標準構成から動的取得）
  const chapterTitles =
    students[0]?.chapterProgress.map((cp) => cp.chapterTitle) ?? [];

  // スキルタグ一覧
  const skillTags =
    students[0]?.skillScores.map((sk) => sk.tag) ?? [];

  const headers = [
    "所属企業名",
    "企業コード",
    "受講生氏名",
    "メールアドレス",
    "受講ステータス",
    "全体進捗率(%)",
    "クリア問題数",
    "全問題数",
    "今週の学習時間(分)",
    "累計学習時間(分)",
    "連続学習日数(日)",
    "最終ログイン日時",
    ...chapterTitles.map((title) => `【章進捗】${title}`),
    ...skillTags.map((tag) => `【スキル習得率】${tag}(%)`),
    "直近の講師評価(5段階)",
    "講師評価日",
    "講師フィードバックコメント",
  ];

  const rows = students.map((st) => {
    const chapterMap = new Map(
      st.chapterProgress.map((cp) => [
        cp.chapterTitle,
        `${cp.completed}/${cp.total}問 (${Math.round(
          (cp.completed / (cp.total || 1)) * 100
        )}%)`,
      ])
    );

    const skillMap = new Map(
      st.skillScores.map((sk) => [sk.tag, String(sk.score)])
    );

    const latestEval = st.evaluations[0];

    return [
      st.companyName,
      st.companyCode,
      st.fullName,
      st.email,
      st.isDelayed ? `要フォロー（${st.delayReason ?? "遅れ"}）` : "順調",
      String(st.progressPercent),
      String(st.completedProblems),
      String(st.totalProblems),
      String(st.weeklyMinutes),
      String(st.totalMinutes),
      String(st.streakDays),
      st.lastLoginAt,
      ...chapterTitles.map((t) => chapterMap.get(t) ?? "0/0問 (0%)"),
      ...skillTags.map((tag) => skillMap.get(tag) ?? "0"),
      latestEval ? String(latestEval.rating) : "未評価",
      latestEval ? latestEval.createdAt : "-",
      latestEval ? latestEval.comment : "",
    ];
  });

  const csvContent =
    "\uFEFF" +
    [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const dateStr = new Date().toISOString().slice(0, 10);
  link.download = `${filenamePrefix}_${dateStr}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
