"use client";

/**
 * ファイル概要：
 * SQL実行結果をExcelスプレッドシート（セル・罫線・列記号・行番号）風に表示する共通コンポーネント
 *
 * 主な用途：
 * - 受講生の問題演習画面（SQL実行結果・テストケースの期待出力／実出力）
 * - サービスTOP画面（/）のSQLライブプレビュー出力
 */

import React from "react";
import { Table2 } from "lucide-react";

export interface ParsedSqlGrid {
  headers: string[];
  rows: string[][];
}

/**
 * SQL出力文字列（`col1 | col2\nval1 | val2` 形式、または単一列形式）をテーブル構造へパースする
 */
export function parseSqlTableOutput(raw: string): ParsedSqlGrid | null {
  const trimmed = (raw || "").trim();
  if (!trimmed) return null;

  const lines = trimmed
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !/^[-+|=\s]+$/.test(l));

  if (lines.length === 0) return null;

  const splitLine = (line: string) =>
    line.split("|").map((cell) => cell.trim());

  const headers = splitLine(lines[0]);
  if (headers.length === 0 || headers.every((h) => h === "")) return null;

  // エラーメッセージっぽい単一行（SQLエラー等）はテーブル化しない
  if (
    lines.length === 1 &&
    headers.length === 1 &&
    (headers[0].includes("エラー") ||
      headers[0].includes("Error") ||
      headers[0].startsWith("("))
  ) {
    return null;
  }

  const rows = lines.slice(1).map((line) => {
    const cols = splitLine(line);
    return headers.map((_, idx) => cols[idx] ?? "");
  });

  return { headers, rows };
}

function getExcelColLetter(index: number): string {
  let n = index;
  let result = "";
  while (n >= 0) {
    result = String.fromCharCode((n % 26) + 65) + result;
    n = Math.floor(n / 26) - 1;
  }
  return result;
}

function isNumericCell(val: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(val.trim());
}

interface SqlResultGridProps {
  output?: string | null;
  compact?: boolean;
  emptyText?: string;
  footerNote?: string;
}

export function SqlResultGrid({
  output,
  compact = false,
  emptyText = "(出力なし)",
  footerNote,
}: SqlResultGridProps) {
  const parsed = parseSqlTableOutput(output ?? "");

  if (!parsed) {
    return (
      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap">
        {output || emptyText}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-300 bg-white text-slate-900 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table
          className={`w-full border-collapse font-sans ${
            compact ? "text-[11px]" : "text-xs"
          }`}
        >
          <thead>
            {/* Excel風 列記号行 (A, B, C...) */}
            <tr className="bg-slate-200/90 text-slate-500 text-[10px] font-mono select-none">
              <th className="border border-slate-300 w-8 px-1.5 py-0.5 text-center bg-slate-200">
                <Table2 className="h-3 w-3 mx-auto text-emerald-700" />
              </th>
              {parsed.headers.map((_, colIdx) => (
                <th
                  key={`col-letter-${colIdx}`}
                  className="border border-slate-300 px-2 py-0.5 text-center font-semibold"
                >
                  {getExcelColLetter(colIdx)}
                </th>
              ))}
            </tr>
            {/* SQLカラム名ヘッダー行 */}
            <tr className="bg-emerald-50 text-emerald-950 font-bold">
              <th className="border border-slate-300 bg-slate-100 text-slate-500 font-mono text-[10px] text-center px-1.5 py-1">
                1
              </th>
              {parsed.headers.map((header, idx) => (
                <th
                  key={`hdr-${idx}`}
                  className={`border border-slate-300 text-left whitespace-nowrap font-mono ${
                    compact ? "px-2 py-1" : "px-3 py-1.5"
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parsed.rows.length === 0 ? (
              <tr>
                <td className="border border-slate-300 bg-slate-100 text-slate-400 font-mono text-[10px] text-center px-1.5 py-1.5">
                  2
                </td>
                <td
                  colSpan={parsed.headers.length}
                  className="border border-slate-300 px-3 py-2 text-center text-slate-400 italic"
                >
                  (0 件のレコード)
                </td>
              </tr>
            ) : (
              parsed.rows.map((row, rowIdx) => (
                <tr
                  key={`row-${rowIdx}`}
                  className={
                    rowIdx % 2 === 1
                      ? "bg-slate-50/80 hover:bg-blue-50/60"
                      : "bg-white hover:bg-blue-50/60"
                  }
                >
                  <td className="border border-slate-300 bg-slate-100 text-slate-500 font-mono text-[10px] text-center px-1.5 py-1 select-none">
                    {rowIdx + 2}
                  </td>
                  {row.map((cell, colIdx) => {
                    const isNull = cell.toUpperCase() === "NULL";
                    const isNum = !isNull && isNumericCell(cell);
                    return (
                      <td
                        key={`cell-${rowIdx}-${colIdx}`}
                        className={`border border-slate-300 whitespace-nowrap ${
                          compact ? "px-2 py-1" : "px-3 py-1.5"
                        } ${
                          isNull
                            ? "text-slate-400 italic bg-slate-50"
                            : isNum
                            ? "text-right font-mono text-slate-900"
                            : "text-left text-slate-800"
                        }`}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-2.5 py-1 bg-slate-100 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-600 font-sans">
        <span>
          シート1 ｜ <strong>{parsed.rows.length}</strong> 行 ×{" "}
          <strong>{parsed.headers.length}</strong> 列
        </span>
        {footerNote && (
          <span className="text-emerald-700 font-semibold">{footerNote}</span>
        )}
      </div>
    </div>
  );
}
