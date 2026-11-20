"use client";

/**
 * ファイル概要：
 * 企業担当者向け「受講生全体進捗表（マトリクス表）」クライアントコンポーネント
 *
 * 主な機能：
 * - Excel表形式の3段ヘッダー（1段目: コース名 / 2段目: 章名 / 3段目: 問題番号 1-1, 1-2...）
 * - 左固定列（企業名・氏名・進捗率）＋ 各問題のクリア日付（YYYY/MM/DD）表示
 * - 受講生の名前（・メール）リアルタイム検索
 * - 氏名・進捗率・各問題のクリア日付による昇順／降順ソート
 * - コース切り替えフィルタ（全コース / 個別コース）
 * - Excel対応（BOM付きUTF-8）CSVダウンロード
 */

import React, { useMemo, useState } from "react";
import Link from "next/link";
import type {
  ProgressMatrixCourse,
  ProgressMatrixStudentRow,
} from "@/lib/data-service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Table2,
  Users,
} from "lucide-react";

interface CompanyProgressMatrixClientProps {
  companyName: string;
  courses: ProgressMatrixCourse[];
  students: ProgressMatrixStudentRow[];
}

type SortKey = "fullName" | "companyName" | "progress" | `problem:${string}`;
type SortDirection = "asc" | "desc";

export function CompanyProgressMatrixClient({
  companyName,
  courses,
  students,
}: CompanyProgressMatrixClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    courses[0]?.id ?? "ALL"
  );
  const [sortKey, setSortKey] = useState<SortKey>("progress");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  // 表示対象のコース群
  const visibleCourses = useMemo(() => {
    if (selectedCourseId === "ALL") return courses;
    return courses.filter((c) => c.id === selectedCourseId);
  }, [courses, selectedCourseId]);

  // 表示対象の全問題ID（進捗率の分母）
  const visibleProblemIds = useMemo(() => {
    return visibleCourses.flatMap((c) =>
      c.chapters.flatMap((ch) => ch.problems.map((p) => p.id))
    );
  }, [visibleCourses]);

  // 各受講生の表示対象進捗率を計算
  const enrichedStudents = useMemo(() => {
    const total = visibleProblemIds.length || 1;
    return students.map((st) => {
      let cleared = 0;
      for (const pid of visibleProblemIds) {
        if (st.completedDates[pid]) cleared++;
      }
      const progressPercent = Math.round((cleared / total) * 100);
      return {
        ...st,
        clearedCount: cleared,
        totalCount: visibleProblemIds.length,
        progressPercent,
      };
    });
  }, [students, visibleProblemIds]);

  // 名前検索＆ソート適用
  const filteredAndSorted = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = q
      ? enrichedStudents.filter(
          (s) =>
            s.fullName.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q) ||
            s.companyName.toLowerCase().includes(q)
        )
      : enrichedStudents;

    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "fullName") {
        cmp = a.fullName.localeCompare(b.fullName, "ja");
      } else if (sortKey === "companyName") {
        cmp = a.companyName.localeCompare(b.companyName, "ja");
      } else if (sortKey === "progress") {
        cmp = a.progressPercent - b.progressPercent;
      } else if (sortKey.startsWith("problem:")) {
        const pid = sortKey.slice("problem:".length);
        const da = a.completedDates[pid] || "";
        const db = b.completedDates[pid] || "";
        // 未クリアは常に末尾寄りになるよう比較
        if (!da && !db) cmp = 0;
        else if (!da) cmp = 1;
        else if (!db) cmp = -1;
        else cmp = da.localeCompare(db);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [enrichedStudents, searchQuery, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "progress" ? "desc" : "asc");
    }
  };

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 inline ml-1" />;
    }
    return sortDir === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-emerald-600 inline ml-1" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-emerald-600 inline ml-1" />
    );
  };

  // Excel対応（BOM付きUTF-8）CSVエクスポート
  const handleExportCsv = () => {
    const headerCourse = ["企業名", "氏名", "進捗率"];
    const headerChapter = ["", "", ""];
    const headerProblem = ["", "", ""];

    for (const c of visibleCourses) {
      for (const ch of c.chapters) {
        for (const p of ch.problems) {
          headerCourse.push(c.shortTitle);
          headerChapter.push(ch.shortTitle);
          headerProblem.push(p.shortCode);
        }
      }
    }

    const rows = [
      headerCourse,
      headerChapter,
      headerProblem,
      ...filteredAndSorted.map((st) => [
        st.companyName,
        st.fullName,
        `${st.progressPercent}%`,
        ...visibleProblemIds.map((pid) => st.completedDates[pid] ?? ""),
      ]),
    ];

    const csvText = rows
      .map((r) =>
        r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csvText], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `進捗表_${companyName}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-[1600px] space-y-5">
      {/* タイトル＆CSVボタン */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Table2 className="w-6 h-6 text-emerald-600" />
            受講生 全体進捗表（{companyName}）
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            コース・章・問題ごとのクリア日付（YYYY/MM/DD）を一覧で確認できます。列見出しをクリックするとソートできます。
          </p>
        </div>

        <Button
          type="button"
          onClick={handleExportCsv}
          className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold gap-2"
        >
          <Download className="w-4 h-4" />
          この進捗表をCSV出力
        </Button>
      </div>

      {/* コース切り替えタブ＆検索・ソートバー */}
      <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-xs space-y-3">
        {/* コース選択ボタン群 */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCourseId("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
              selectedCourseId === "ALL"
                ? "bg-emerald-700 text-white border-emerald-700"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            全コース表示
          </button>
          {courses.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCourseId(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                selectedCourseId === c.id
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {c.shortTitle}
            </button>
          ))}
        </div>

        {/* 名前検索＆ソートコントロール */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="受講生の氏名・メールアドレスで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1 mr-1">
              <Users className="w-3.5 h-3.5" />
              表示: <strong className="text-slate-900">{filteredAndSorted.length}</strong> /{" "}
              {students.length} 名
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-semibold">並び替え:</span>
            <Button
              type="button"
              size="sm"
              variant={sortKey === "progress" ? "default" : "outline"}
              className={
                sortKey === "progress"
                  ? "bg-slate-800 text-white h-8 text-xs"
                  : "h-8 text-xs"
              }
              onClick={() => handleSort("progress")}
            >
              進捗率 {sortKey === "progress" ? (sortDir === "desc" ? "↓" : "↑") : ""}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={sortKey === "fullName" ? "default" : "outline"}
              className={
                sortKey === "fullName"
                  ? "bg-slate-800 text-white h-8 text-xs"
                  : "h-8 text-xs"
              }
              onClick={() => handleSort("fullName")}
            >
              氏名 {sortKey === "fullName" ? (sortDir === "asc" ? "↑" : "↓") : ""}
            </Button>
          </div>
        </div>
      </div>

      {/* Excelスタイル 3段ヘッダー全体進捗マトリクス表 */}
      <div className="rounded-xl bg-white border border-slate-300 shadow-sm overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            {/* 1段目：左固定3列（rowSpan=3）＋ コース名 */}
            <tr className="bg-slate-100 text-slate-900">
              <th
                rowSpan={3}
                onClick={() => handleSort("companyName")}
                className="sticky left-0 z-20 bg-slate-100 border border-slate-300 px-3 py-2.5 text-left font-bold min-w-[150px] cursor-pointer hover:bg-slate-200 select-none"
              >
                企業名
                {renderSortIcon("companyName")}
              </th>
              <th
                rowSpan={3}
                onClick={() => handleSort("fullName")}
                className="sticky left-[150px] z-20 bg-slate-100 border border-slate-300 px-3 py-2.5 text-left font-bold min-w-[130px] cursor-pointer hover:bg-slate-200 select-none"
              >
                氏名
                {renderSortIcon("fullName")}
              </th>
              <th
                rowSpan={3}
                onClick={() => handleSort("progress")}
                className="sticky left-[280px] z-20 bg-slate-100 border border-slate-300 px-3 py-2.5 text-center font-bold min-w-[88px] cursor-pointer hover:bg-slate-200 select-none shadow-[2px_0_4px_-2px_rgba(0,0,0,0.12)]"
              >
                進捗率
                {renderSortIcon("progress")}
              </th>

              {visibleCourses.map((course) => {
                const courseColSpan = course.chapters.reduce(
                  (sum, ch) => sum + ch.problems.length,
                  0
                );
                return (
                  <th
                    key={course.id}
                    colSpan={courseColSpan}
                    className="border border-slate-300 px-3 py-2 text-left font-extrabold bg-emerald-50 text-emerald-950 whitespace-nowrap"
                  >
                    {course.shortTitle}
                  </th>
                );
              })}
            </tr>

            {/* 2段目：章名 */}
            <tr className="bg-slate-50 text-slate-800">
              {visibleCourses.flatMap((course) =>
                course.chapters.map((ch) => (
                  <th
                    key={ch.id}
                    colSpan={ch.problems.length}
                    title={ch.title}
                    className="border border-slate-300 px-2.5 py-1.5 text-left font-bold whitespace-nowrap"
                  >
                    {ch.shortTitle}
                  </th>
                ))
              )}
            </tr>

            {/* 3段目：問題番号（1-1, 1-2...）クリックでクリア日ソート可能 */}
            <tr className="bg-white text-slate-700">
              {visibleCourses.flatMap((course) =>
                course.chapters.flatMap((ch) =>
                  ch.problems.map((prob) => {
                    const pSortKey: SortKey = `problem:${prob.id}`;
                    return (
                      <th
                        key={prob.id}
                        title={`${prob.title}（クリックでクリア日順に並び替え）`}
                        onClick={() => handleSort(pSortKey)}
                        className="border border-slate-300 px-2 py-1.5 text-center font-mono font-bold min-w-[94px] cursor-pointer hover:bg-blue-50 select-none whitespace-nowrap"
                      >
                        {prob.shortCode}
                        {sortKey === pSortKey && (
                          <span className="text-emerald-600 ml-0.5">
                            {sortDir === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                    );
                  })
                )
              )}
            </tr>
          </thead>

          <tbody>
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td
                  colSpan={3 + visibleProblemIds.length}
                  className="border border-slate-300 py-10 text-center text-slate-500"
                >
                  該当する受講生が見つかりませんでした。検索条件を変更してください。
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((st) => (
                <tr
                  key={st.studentId}
                  className="hover:bg-blue-50/40 transition-colors"
                >
                  <td className="sticky left-0 z-10 bg-white border border-slate-300 px-3 py-2 font-medium text-slate-700 whitespace-nowrap">
                    {st.companyName}
                  </td>
                  <td className="sticky left-[150px] z-10 bg-white border border-slate-300 px-3 py-2 font-bold text-slate-900 whitespace-nowrap">
                    <Link
                      href={`/company/students/${st.studentId}`}
                      className="text-blue-700 hover:underline"
                    >
                      {st.fullName}
                    </Link>
                  </td>
                  <td className="sticky left-[280px] z-10 bg-white border border-slate-300 px-3 py-2 text-right font-mono font-extrabold text-slate-900 whitespace-nowrap shadow-[2px_0_4px_-2px_rgba(0,0,0,0.12)]">
                    <span
                      className={
                        st.progressPercent >= 80
                          ? "text-emerald-700"
                          : st.progressPercent >= 40
                          ? "text-blue-700"
                          : "text-slate-700"
                      }
                    >
                      {st.progressPercent}%
                    </span>
                  </td>

                  {visibleCourses.flatMap((course) =>
                    course.chapters.flatMap((ch) =>
                      ch.problems.map((prob) => {
                        const clearedDate = st.completedDates[prob.id];
                        return (
                          <td
                            key={prob.id}
                            className={`border border-slate-300 px-2 py-2 text-center font-mono whitespace-nowrap ${
                              clearedDate
                                ? "bg-emerald-50/70 text-emerald-900 font-semibold"
                                : "bg-white text-slate-300"
                            }`}
                          >
                            {clearedDate || ""}
                          </td>
                        );
                      })
                    )
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
