/**
 * ファイル概要：
 * 受講生進捗レポート CSVエクスポーター（管理者・企業担当者共通）
 *
 * 主な処理：
 * - 受講生一覧データ（基本進捗＋章別内訳＋スキル分野別スコア＋評価・コメント）を整形してCSV化
 * - Excelでの文字化けを防止するBOM（\uFEFF）付きUTF-8エンコーディング
 * - ブラウザ上での動的Blob生成と自動ダウンロード処理
 *
 * 注意事項：
 * - クライアントサイド専用関数（windowオブジェクトが必要）です。サーバーサイドでの実行時は早期リターンします。
 */

import { StudentAnalyticsRecord } from "./mock-analytics";

/**
 * 処理概要：
 * 受講生の学習進捗データをCSV形式に変換し、ブラウザでダウンロードさせる
 *
 * 処理詳細：
 * 1. クライアント環境（windowオブジェクトの存在）を確認
 * 2. 受講生データから章タイトル一覧およびスキルタグ一覧を動的抽出してヘッダー列を構築
 * 3. 各受講生のデータを走査し、進捗率・学習時間・章別クリア率・レーダースコア・最新評価を1行ずつマッピング
 * 4. セル内のダブルクォーテーションをエスケープ処理し、カンマ区切りおよびCRLF改行で結合
 * 5. 先頭にUTF-8 BOM（\uFEFF）を付与してBlobを作成し、aタグのクリックシミュレーションでファイル保存
 *
 * @param students 出力対象の受講生アナリティクスレコード配列
 * @param filenamePrefix ダウンロード時のファイル名プレフィックス（デフォルト: "training_progress_report"）
 * @returns なし（ブラウザによるファイルダウンロードが発火する）
 */
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

  // Excel文字化け防止のため、先頭にUTF-8 BOM (\uFEFF) を付与
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
