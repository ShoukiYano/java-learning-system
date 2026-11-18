import React from "react";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// LaTeX数式記法（$H \times W$ など）を読みやすいUnicode表記へ変換
function cleanLatexMath(text: string): string {
  return text
    .replace(/\\times/g, "×")
    .replace(/\\div/g, "÷")
    .replace(/\\le/g, "≤")
    .replace(/\\ge/g, "≥")
    .replace(/\\neq/g, "≠")
    .replace(/\\sqrt\{([^}]+)\}/g, "√($1)")
    .replace(/\$([^$]+)\$/g, "$1");
}

// インライン要素（**太字**, `コード`）のパース
function renderInline(rawText: string): React.ReactNode[] {
  const text = cleanLatexMath(rawText);
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

  return tokens.map((token, idx) => {
    if (token.startsWith("**") && token.endsWith("**") && token.length > 4) {
      return (
        <strong key={idx} className="font-bold text-slate-900">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith("`") && token.endsWith("`") && token.length > 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-200/80 text-slate-900 font-mono text-[0.85em] font-semibold"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={idx}>{token}</React.Fragment>;
  });
}

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  if (!content) return null;

  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 空行のスキップ
    if (line.trim() === "") {
      i++;
      continue;
    }

    // 1. コードブロック ``` ... ```
    if (line.trim().startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // 閉じ ``` をスキップ
      elements.push(
        <pre
          key={`code-${i}`}
          className="my-2.5 p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed shadow-sm"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      continue;
    }

    // 2. Markdown テーブル | ... |
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const tableLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim().startsWith("|") &&
        lines[i].trim().endsWith("|")
      ) {
        tableLines.push(lines[i].trim());
        i++;
      }

      const parseRow = (rowStr: string) =>
        rowStr
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());

      const headers = tableLines.length > 0 ? parseRow(tableLines[0]) : [];
      // 2行目が | :--- | などの区切り行ならスキップ
      const dataStartIdx =
        tableLines.length > 1 && /^[:\-\s|]+$/.test(tableLines[1].slice(1, -1))
          ? 2
          : 1;
      const bodyRows = tableLines.slice(dataStartIdx).map(parseRow);

      elements.push(
        <div
          key={`table-${i}`}
          className="my-3 overflow-x-auto rounded-lg border border-slate-200"
        >
          <table className="w-full text-left border-collapse text-xs">
            {headers.length > 0 && (
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                  {headers.map((h, hIdx) => (
                    <th key={hIdx} className="py-2 px-3 font-bold">
                      {renderInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-slate-200 bg-white">
              {bodyRows.map((r, rIdx) => (
                <tr key={rIdx}>
                  {r.map((cell, cIdx) => (
                    <td key={cIdx} className="py-2 px-3 text-slate-700">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // 3. 見出し (#, ##, ###)
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const titleText = headingMatch[2];
      elements.push(
        <div
          key={`h-${i}`}
          className={cn(
            "font-bold text-slate-900 mt-4 first:mt-0 mb-1.5 flex items-center gap-1.5",
            level === 1 && "text-base border-b pb-1",
            level === 2 && "text-sm border-b pb-1",
            level >= 3 &&
              "text-xs uppercase tracking-wider text-blue-800 bg-blue-50/80 px-2.5 py-1 rounded-md border border-blue-100"
          )}
        >
          {renderInline(titleText)}
        </div>
      );
      i++;
      continue;
    }

    // 4. 箇条書きリスト (- または * または 1.)
    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\s*([-*]|\d+\.)\s+/, ""));
        i++;
      }
      elements.push(
        <ul
          key={`ul-${i}`}
          className="my-2 pl-5 list-disc space-y-1 text-xs text-slate-700 leading-relaxed"
        >
          {listItems.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // 5. 通常の段落
    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith("#") &&
      !(lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) &&
      !/^\s*([-*]|\d+\.)\s+/.test(lines[i])
    ) {
      paragraphLines.push(lines[i]);
      i++;
    }

    elements.push(
      <p
        key={`p-${i}`}
        className="my-2 text-xs text-slate-700 leading-relaxed"
      >
        {paragraphLines.map((pLine, pIdx) => (
          <React.Fragment key={pIdx}>
            {pIdx > 0 && <br />}
            {renderInline(pLine)}
          </React.Fragment>
        ))}
      </p>
    );
  }

  return <div className={cn("space-y-1", className)}>{elements}</div>;
}
