/**
 * ファイル概要：
 * 完全独立・インメモリSQLクエリ実行エンジン（自作RDBMS & クエリパーサー/評価器）
 *
 * 主な処理：
 * - 外部DBやWASMに一切依存せず、TypeScriptのみで完全実装されたインメモリリレーショナルデータベース
 * - ブラウザ（クライアント / Web Worker）とサーバー（Next.js Route Handler）の両環境で完全同一動作
 * - 対応構文：
 *   - CREATE TABLE / INSERT INTO / UPDATE / DELETE
 *   - SELECT (DISTINCT, *, カラム指定, AS別名, 算術計算式, 文字列連結)
 *   - 集約関数: COUNT(*), COUNT(col), SUM(col), AVG(col), MAX(col), MIN(col), ROUND(val, n), COALESCE(a, b)
 *   - テーブル結合: FROM / INNER JOIN / LEFT JOIN / ON
 *   - 絞り込み条件: WHERE (AND, OR, NOT, =, !=, <>, <, <=, >, >=, LIKE, IN, BETWEEN, IS NULL, IS NOT NULL)
 *   - グループ化・集計・ソート: GROUP BY / HAVING / ORDER BY (ASC / DESC, 複数列ソート) / LIMIT / OFFSET
 *
 * 注意事項：
 * - クエリ結果は標準的なテキストテーブルまたはJSON形式として整形され、自動採点エンジンで比較検証されます。
 */

import { JavaDiagnostic, JavaExecutionResult } from "@/lib/java/types";
import { createDiagnostic } from "@/lib/java/errors";

export interface SqlColumnResult {
  name: string;
}

export interface SqlTableResult {
  columns: string[];
  rows: (string | number | null)[][];
}

export interface SqlExecutionOptions {
  setupSql?: string; // 初期テーブル作成・データ投入用SQL（テストケースのinputや問題の初期スキーマ）
}

type SqlRow = Record<string, string | number | null>;

interface TableSchema {
  name: string;
  columns: string[];
  rows: SqlRow[];
}

class InMemoryDatabase {
  public tables = new Map<string, TableSchema>();

  createTable(name: string, columns: string[]) {
    this.tables.set(name.toLowerCase(), {
      name: name.toLowerCase(),
      columns: columns.map((c) => c.toLowerCase()),
      rows: [],
    });
  }

  insert(name: string, cols: string[] | null, valuesList: (string | number | null)[][]) {
    const tbl = this.tables.get(name.toLowerCase());
    if (!tbl) {
      throw new Error(`テーブル「${name}」が存在しません。テーブル名のスペルを確認してください。`);
    }
    const targetCols = cols ? cols.map((c) => c.toLowerCase()) : tbl.columns;
    for (const vals of valuesList) {
      const row: SqlRow = {};
      for (const col of tbl.columns) row[col] = null;
      for (let i = 0; i < targetCols.length; i++) {
        row[targetCols[i]] = vals[i] ?? null;
      }
      tbl.rows.push(row);
    }
  }

  getTable(name: string): TableSchema {
    const tbl = this.tables.get(name.toLowerCase());
    if (!tbl) {
      throw new Error(`テーブル「${name}」が見つかりません。`);
    }
    return tbl;
  }
}

// SQLのコメント除去とセミコロンでのステートメント分割
function splitSqlStatements(sql: string): { text: string; line: number }[] {
  const result: { text: string; line: number }[] = [];
  let current = "";
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let line = 1;
  let stmtStartLine = 1;

  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    const next = sql[i + 1];

    if (ch === "\n") line++;

    // 単一行コメント --
    if (!inSingleQuote && !inDoubleQuote && ch === "-" && next === "-") {
      while (i < sql.length && sql[i] !== "\n") i++;
      line++;
      continue;
    }

    // 複数行コメント /* ... */
    if (!inSingleQuote && !inDoubleQuote && ch === "/" && next === "*") {
      i += 2;
      while (i < sql.length && !(sql[i] === "*" && sql[i + 1] === "/")) {
        if (sql[i] === "\n") line++;
        i++;
      }
      i++;
      continue;
    }

    if (ch === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      current += ch;
      continue;
    }
    if (ch === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      current += ch;
      continue;
    }

    if (ch === ";" && !inSingleQuote && !inDoubleQuote) {
      if (current.trim().length > 0) {
        result.push({ text: current.trim(), line: stmtStartLine });
      }
      current = "";
      stmtStartLine = line;
      continue;
    }

    if (current.trim().length === 0 && !/\s/.test(ch)) {
      stmtStartLine = line;
    }
    current += ch;
  }

  if (current.trim().length > 0) {
    result.push({ text: current.trim(), line: stmtStartLine });
  }

  return result;
}

// 値をフォーマットして出力文字列（TSV風パイプ区切り＆比較用）に変換
function formatTableOutput(table: SqlTableResult): string {
  if (table.columns.length === 0) return "";
  const header = table.columns.join(" | ");
  const body = table.rows
    .map((r) =>
      r
        .map((cell) => {
          if (cell === null || cell === undefined) return "NULL";
          if (typeof cell === "number" && !Number.isInteger(cell)) {
            return Number(cell.toFixed(2)).toString();
          }
          return String(cell);
        })
        .join(" | ")
    )
    .join("\n");
  return body ? `${header}\n${body}` : header;
}

/**
 * SQLコードを実行し、JavaExecutionResult互換の形式で標準出力（テーブルテキスト）および診断エラーを返す
 */
export function runSqlCode(
  userSql: string,
  options: SqlExecutionOptions = {}
): JavaExecutionResult {
  const startTime = performance.now();
  const db = new InMemoryDatabase();
  const diagnostics: JavaDiagnostic[] = [];

  if (!userSql || userSql.trim().length === 0) {
    const diag = createDiagnostic(
      1,
      1,
      "SQLクエリが入力されていません。",
      "SELECT 文などのSQLクエリを入力してください。"
    );
    return {
      status: "compile_error",
      stdout: "",
      stderr: `SQL構文エラー (1行目): ${diag.message}\n💡 補足: ${diag.japaneseHint}`,
      diagnostics: [diag],
      executionTimeMs: 1,
      stepsExecuted: 0,
    };
  }

  // 全角空白チェック
  const fullWidthLineIdx = userSql.split("\n").findIndex((l) => l.includes("　"));
  if (fullWidthLineIdx !== -1) {
    const diag = createDiagnostic(
      fullWidthLineIdx + 1,
      1,
      "SQL内に全角スペースが含まれています。",
      "SQLキーワードやカラム名の区切りには半角スペースを使用してください。"
    );
    return {
      status: "compile_error",
      stdout: "",
      stderr: `SQL構文エラー (${diag.line}行目): ${diag.message}\n💡 補足: ${diag.japaneseHint}`,
      diagnostics: [diag],
      executionTimeMs: 1,
      stepsExecuted: 0,
    };
  }

  try {
    // 1. セットアップSQL（CREATE TABLE / INSERT INTO）の実行
    if (options.setupSql && options.setupSql.trim().length > 0) {
      const setupStmts = splitSqlStatements(options.setupSql);
      for (const stmt of setupStmts) {
        executeSingleSql(db, stmt.text);
      }
    }

    // 2. ユーザーのSQL実行
    const userStmts = splitSqlStatements(userSql);
    let lastTable: SqlTableResult | null = null;
    let steps = 0;

    for (const stmt of userStmts) {
      steps++;
      const res = executeSingleSql(db, stmt.text);
      if (res) {
        lastTable = res;
      }
    }

    const stdout = lastTable ? formatTableOutput(lastTable) : "";
    return {
      status: "success",
      stdout,
      stderr: "",
      diagnostics: [],
      executionTimeMs: Math.max(1, Math.round(performance.now() - startTime)),
      stepsExecuted: steps,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const hint = getSqlErrorJapaneseHint(msg);
    const diag = createDiagnostic(1, 1, msg, hint);
    diagnostics.push(diag);

    return {
      status: "compile_error",
      stdout: "",
      stderr: `SQLエラー: ${msg}\n💡 補足: ${hint}`,
      diagnostics,
      executionTimeMs: Math.max(1, Math.round(performance.now() - startTime)),
      stepsExecuted: 1,
    };
  }
}

function getSqlErrorJapaneseHint(msg: string): string {
  if (msg.includes("テーブル")) {
    return "FROM句やJOIN句に指定したテーブル名が問題文のテーブル定義と一致しているか確認してください。";
  }
  if (msg.includes("カラム")) {
    return "SELECT句やWHERE句に指定したカラム名にスペルミスがないか確認してください。";
  }
  if (msg.includes("構文")) {
    return "SELECT ... FROM ... WHERE ... の順番や、カンマ（,）・シングルクォート（'）の閉じ忘れがないか確認してください。";
  }
  return "SQLの構文（SELECT, FROM, WHERE, GROUP BY, ORDER BY）を確認してください。";
}

function executeSingleSql(
  db: InMemoryDatabase,
  rawSql: string
): SqlTableResult | null {
  const sql = rawSql.trim();

  // CREATE TABLE
  const createMatch = sql.match(/^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)\s*\(([\s\S]+)\)$/i);
  if (createMatch) {
    const tableName = createMatch[1];
    const body = createMatch[2];
    const colDefs = splitTopLevelComma(body);
    const cols: string[] = [];
    for (const def of colDefs) {
      const trimmed = def.trim();
      if (/^(PRIMARY|FOREIGN|UNIQUE|CHECK|CONSTRAINT)\b/i.test(trimmed)) continue;
      const colName = trimmed.split(/\s+/)[0].replace(/["`]/g, "");
      if (colName) cols.push(colName);
    }
    db.createTable(tableName, cols);
    return null;
  }

  // INSERT INTO
  const insertMatch = sql.match(
    /^INSERT\s+INTO\s+([a-zA-Z0-9_]+)\s*(?:\(([^)]+)\))?\s*VALUES\s*([\s\S]+)$/i
  );
  if (insertMatch) {
    const tableName = insertMatch[1];
    const colsPart = insertMatch[2]
      ? insertMatch[2].split(",").map((c) => c.trim().replace(/["`]/g, ""))
      : null;
    const valuesPart = insertMatch[3].trim();
    const tuples = parseInsertTuples(valuesPart);
    db.insert(tableName, colsPart, tuples);
    return null;
  }

  // UPDATE
  const updateMatch = sql.match(
    /^UPDATE\s+([a-zA-Z0-9_]+)\s+SET\s+([\s\S]+?)(?:\s+WHERE\s+([\s\S]+))?$/i
  );
  if (updateMatch) {
    const tbl = db.getTable(updateMatch[1]);
    const setClauses = splitTopLevelComma(updateMatch[2]);
    const whereClause = updateMatch[3]?.trim() ?? null;

    for (const row of tbl.rows) {
      if (!whereClause || evalWhereCondition(whereClause, row)) {
        for (const sc of setClauses) {
          const eqIdx = sc.indexOf("=");
          const col = sc.slice(0, eqIdx).trim().toLowerCase();
          const expr = sc.slice(eqIdx + 1).trim();
          row[col] = evalScalarExpr(expr, row);
        }
      }
    }
    return null;
  }

  // DELETE
  const deleteMatch = sql.match(
    /^DELETE\s+FROM\s+([a-zA-Z0-9_]+)(?:\s+WHERE\s+([\s\S]+))?$/i
  );
  if (deleteMatch) {
    const tbl = db.getTable(deleteMatch[1]);
    const whereClause = deleteMatch[2]?.trim() ?? null;
    tbl.rows = tbl.rows.filter(
      (r) => whereClause && !evalWhereCondition(whereClause, r)
    );
    return null;
  }

  // SELECT
  if (/^SELECT\b/i.test(sql)) {
    return executeSelectQuery(db, sql);
  }

  throw new Error(
    `構文エラー：認識できないSQL文です（先頭: "${sql.slice(0, 25)}..."）。SELECT / INSERT / UPDATE / DELETE / CREATE TABLE に対応しています。`
  );
}

// =============================================================================
// SELECT クエリ評価器
// =============================================================================
function toSqlLiteral(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "number") return String(val);
  return `'${String(val).replace(/'/g, "''")}'`;
}

/**
 * 括弧内のサブクエリ (SELECT ...) を先に評価し、リテラル値またはリテラルリストへ展開する
 * （IN (SELECT ...) / NOT IN (SELECT ...) / スカラー比較 = > < (SELECT ...) に対応）
 */
function resolveSubqueries(db: InMemoryDatabase, sql: string): string {
  let result = sql;
  let guard = 0;
  while (guard++ < 10) {
    const match = result.match(/\(\s*SELECT\s+/i);
    if (!match || match.index === undefined) break;

    const startIdx = match.index;
    let depth = 0;
    let inSingle = false;
    let endIdx = -1;
    for (let i = startIdx; i < result.length; i++) {
      const ch = result[i];
      if (ch === "'") inSingle = !inSingle;
      if (!inSingle) {
        if (ch === "(") depth++;
        else if (ch === ")") {
          depth--;
          if (depth === 0) {
            endIdx = i;
            break;
          }
        }
      }
    }
    if (endIdx === -1) break;

    const innerSql = result.slice(startIdx + 1, endIdx).trim();
    const innerTable = executeSelectQuery(db, innerSql);

    const before = result.slice(0, startIdx).trimEnd();
    const isInList = /\bIN$/i.test(before);

    let replacement: string;
    if (isInList) {
      const vals = innerTable.rows.map((r) => toSqlLiteral(r[0]));
      replacement = vals.length > 0 ? `(${vals.join(", ")})` : "(NULL)";
    } else {
      const scalar = innerTable.rows[0]?.[0] ?? null;
      replacement = toSqlLiteral(scalar);
    }

    result = result.slice(0, startIdx) + replacement + result.slice(endIdx + 1);
  }
  return result;
}

function executeSelectQuery(
  db: InMemoryDatabase,
  rawSql: string
): SqlTableResult {
  // 改行を空白に正規化（文字列リテラル内を除く）＋サブクエリ事前展開
  const normalized = resolveSubqueries(
    db,
    normalizeWhitespaceOutsideStrings(rawSql)
  );

  // 主要句の抽出（SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT ...）
  const clauseRegex =
    /^SELECT\s+(DISTINCT\s+)?([\s\S]+?)\s+FROM\s+([\s\S]+?)(?:\s+WHERE\s+([\s\S]+?))?(?:\s+GROUP\s+BY\s+([\s\S]+?))?(?:\s+HAVING\s+([\s\S]+?))?(?:\s+ORDER\s+BY\s+([\s\S]+?))?(?:\s+LIMIT\s+(\d+)(?:\s+OFFSET\s+(\d+))?)?$/i;

  const m = normalized.match(clauseRegex);
  if (!m) {
    throw new Error(
      "SELECT文の構文が正しくありません。SELECT カラム名 FROM テーブル名 の形式で記述してください。"
    );
  }

  const isDistinct = Boolean(m[1]);
  const selectPart = m[2].trim();
  const fromPart = m[3].trim();
  const wherePart = m[4]?.trim() ?? null;
  const groupByPart = m[5]?.trim() ?? null;
  const havingPart = m[6]?.trim() ?? null;
  const orderByPart = m[7]?.trim() ?? null;
  const limitNum = m[8] ? parseInt(m[8], 10) : null;
  const offsetNum = m[9] ? parseInt(m[9], 10) : 0;

  // 1. FROM & JOIN の解決
  let joinedRows = resolveFromAndJoins(db, fromPart);

  // 2. WHERE フィルタリング
  if (wherePart) {
    joinedRows = joinedRows.filter((row) => evalWhereCondition(wherePart, row));
  }

  // 3. SELECT 項目のパース
  const selectItems = splitTopLevelComma(selectPart).map((item) => {
    const asMatch = item.match(/^([\s\S]+?)\s+AS\s+([a-zA-Z0-9_"']+)$/i);
    if (asMatch) {
      return {
        expr: asMatch[1].trim(),
        alias: asMatch[2].trim().replace(/^["']|["']$/g, ""),
      };
    }
    // 空白区切りの別名（例: COUNT(*) cnt）
    const spaceAlias = item.trim().match(/^([a-zA-Z0-9_.*()]+\))\s+([a-zA-Z0-9_]+)$/);
    if (spaceAlias) {
      return {
        expr: spaceAlias[1].trim(),
        alias: spaceAlias[2].trim(),
      };
    }
    const cleanExpr = item.trim();
    const defaultLabel = cleanExpr.includes(".")
      ? cleanExpr.split(".")[1]
      : cleanExpr;
    return { expr: cleanExpr, alias: defaultLabel };
  });

  // 集約関数が含まれているか判定
  const hasAggregate =
    Boolean(groupByPart) ||
    selectItems.some((it) =>
      /\b(COUNT|SUM|AVG|MAX|MIN)\s*\(/i.test(it.expr)
    );

  let resultColumns: string[] = [];
  let resultObjects: SqlRow[] = [];

  if (hasAggregate) {
    const groupCols = groupByPart
      ? splitTopLevelComma(groupByPart).map((c) => c.trim().toLowerCase())
      : [];

    const groups = new Map<string, SqlRow[]>();
    if (groupCols.length === 0) {
      groups.set("__ALL__", joinedRows);
    } else {
      for (const row of joinedRows) {
        const key = groupCols
          .map((gc) => String(resolveColumnValue(row, gc) ?? "NULL"))
          .join("||");
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(row);
      }
    }

    resultColumns = selectItems.map((s) => s.alias);

    for (const [, groupRows] of groups.entries()) {
      if (havingPart && !evalHavingCondition(havingPart, groupRows)) {
        continue;
      }
      const outRow: SqlRow = {};
      const sampleRow = groupRows[0] ?? {};
      for (const item of selectItems) {
        const val = evalAggregateOrScalar(item.expr, groupRows, sampleRow);
        outRow[item.alias.toLowerCase()] = val;
        outRow[item.expr.toLowerCase()] = val;
      }
      // ORDER BY で元カラム名を参照できるよう sampleRow の値も引き継ぐ
      for (const [k, v] of Object.entries(sampleRow)) {
        if (!(k in outRow)) outRow[k] = v;
      }
      resultObjects.push(outRow);
    }
  } else {
    // 非集約クエリ（* 展開対応）
    if (selectItems.length === 1 && selectItems[0].expr === "*") {
      const firstFromTable = fromPart.split(/\s+/)[0].toLowerCase();
      const baseSchema = db.getTable(firstFromTable);
      resultColumns = [...baseSchema.columns];
      resultObjects = joinedRows.map((r) => ({ ...r }));
    } else {
      resultColumns = selectItems.map((s) => s.alias);
      resultObjects = joinedRows.map((row) => {
        const outRow: SqlRow = { ...row };
        for (const item of selectItems) {
          const val = evalScalarExpr(item.expr, row);
          outRow[item.alias.toLowerCase()] = val;
        }
        return outRow;
      });
    }
  }

  // 4. ORDER BY ソート
  if (orderByPart) {
    const orderSpecs = splitTopLevelComma(orderByPart).map((s) => {
      const parts = s.trim().split(/\s+/);
      const dir =
        parts[parts.length - 1]?.toUpperCase() === "DESC" ? "DESC" : "ASC";
      const colExpr =
        parts[parts.length - 1]?.toUpperCase() === "ASC" ||
        parts[parts.length - 1]?.toUpperCase() === "DESC"
          ? parts.slice(0, -1).join(" ")
          : parts.join(" ");
      return { colExpr: colExpr.toLowerCase(), dir };
    });

    resultObjects.sort((a, b) => {
      for (const spec of orderSpecs) {
        const va = resolveColumnValue(a, spec.colExpr);
        const vb = resolveColumnValue(b, spec.colExpr);
        if (va === vb) continue;
        if (va === null) return 1;
        if (vb === null) return -1;
        const cmp =
          typeof va === "number" && typeof vb === "number"
            ? va - vb
            : String(va).localeCompare(String(vb));
        return spec.dir === "DESC" ? -cmp : cmp;
      }
      return 0;
    });
  }

  // 5. Rows配列への射影と DISTINCT 処理
  let projectedRows: (string | number | null)[][] = resultObjects.map((obj) =>
    resultColumns.map((col) => {
      const v = resolveColumnValue(obj, col.toLowerCase());
      return v === undefined ? null : v;
    })
  );

  if (isDistinct) {
    const seen = new Set<string>();
    projectedRows = projectedRows.filter((r) => {
      const k = JSON.stringify(r);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }

  // 6. LIMIT / OFFSET
  if (limitNum !== null) {
    projectedRows = projectedRows.slice(offsetNum, offsetNum + limitNum);
  }

  return {
    columns: resultColumns,
    rows: projectedRows,
  };
}

function resolveFromAndJoins(
  db: InMemoryDatabase,
  fromPart: string
): SqlRow[] {
  // JOIN句の分解（INNER JOIN / LEFT JOIN / JOIN）
  const joinTokenRegex =
    /\b(INNER\s+JOIN|LEFT\s+(?:OUTER\s+)?JOIN|JOIN)\b/gi;
  const parts: { joinType: string; segment: string }[] = [];

  let lastIndex = 0;
  let lastJoinType = "FROM";
  let match: RegExpExecArray | null;

  while ((match = joinTokenRegex.exec(fromPart)) !== null) {
    parts.push({
      joinType: lastJoinType,
      segment: fromPart.slice(lastIndex, match.index).trim(),
    });
    lastJoinType = match[1].toUpperCase();
    lastIndex = match.index + match[0].length;
  }
  parts.push({
    joinType: lastJoinType,
    segment: fromPart.slice(lastIndex).trim(),
  });

  // ベーステーブル
  const baseTokens = parts[0].segment.split(/\s+/);
  const baseTableName = baseTokens[0];
  const baseAlias = (
    baseTokens[1]?.toUpperCase() === "AS" ? baseTokens[2] : baseTokens[1] || baseTableName
  ).toLowerCase();

  const baseTbl = db.getTable(baseTableName);
  let currentRows: SqlRow[] = baseTbl.rows.map((r) => {
    const nr: SqlRow = {};
    for (const [k, v] of Object.entries(r)) {
      nr[k] = v;
      nr[`${baseTableName.toLowerCase()}.${k}`] = v;
      nr[`${baseAlias}.${k}`] = v;
    }
    return nr;
  });

  // 各JOINの適用
  for (let i = 1; i < parts.length; i++) {
    const { joinType, segment } = parts[i];
    const onMatch = segment.match(/^([\s\S]+?)\s+ON\s+([\s\S]+)$/i);
    if (!onMatch) {
      throw new Error(`JOIN句に ON 条件がありません: ${segment}`);
    }
    const tableSpec = onMatch[1].trim().split(/\s+/);
    const joinTableName = tableSpec[0];
    const joinAlias = (
      tableSpec[1]?.toUpperCase() === "AS"
        ? tableSpec[2]
        : tableSpec[1] || joinTableName
    ).toLowerCase();
    const onCond = onMatch[2].trim();

    const rightTbl = db.getTable(joinTableName);
    const nextRows: SqlRow[] = [];
    const isLeftJoin = joinType.startsWith("LEFT");

    for (const leftRow of currentRows) {
      let matched = false;
      for (const rightRow of rightTbl.rows) {
        const combined: SqlRow = { ...leftRow };
        for (const [k, v] of Object.entries(rightRow)) {
          if (!(k in combined)) combined[k] = v;
          combined[`${joinTableName.toLowerCase()}.${k}`] = v;
          combined[`${joinAlias}.${k}`] = v;
        }
        if (evalWhereCondition(onCond, combined)) {
          matched = true;
          nextRows.push(combined);
        }
      }
      if (!matched && isLeftJoin) {
        const nullRight: SqlRow = { ...leftRow };
        for (const col of rightTbl.columns) {
          if (!(col in nullRight)) nullRight[col] = null;
          nullRight[`${joinTableName.toLowerCase()}.${col}`] = null;
          nullRight[`${joinAlias}.${col}`] = null;
        }
        nextRows.push(nullRight);
      }
    }
    currentRows = nextRows;
  }

  return currentRows;
}

function resolveColumnValue(
  row: SqlRow,
  colExpr: string
): string | number | null {
  const key = colExpr.trim().toLowerCase();
  if (key in row) return row[key];
  if (key.includes(".")) {
    const shortKey = key.split(".")[1];
    if (shortKey in row) return row[shortKey];
  }
  return null;
}

function evalAggregateOrScalar(
  expr: string,
  groupRows: SqlRow[],
  sampleRow: SqlRow
): string | number | null {
  const trimmed = expr.trim();

  // ROUND(集約式, 小数桁)
  const roundMatch = trimmed.match(/^ROUND\s*\(([\s\S]+),\s*(\d+)\)$/i);
  if (roundMatch) {
    const inner = Number(
      evalAggregateOrScalar(roundMatch[1], groupRows, sampleRow) ?? 0
    );
    const digits = parseInt(roundMatch[2], 10);
    const factor = Math.pow(10, digits);
    return Math.round(inner * factor) / factor;
  }

  const aggMatch = trimmed.match(
    /^(COUNT|SUM|AVG|MAX|MIN)\s*\(\s*(DISTINCT\s+)?([\s\S]+?)\s*\)$/i
  );
  if (aggMatch) {
    const fn = aggMatch[1].toUpperCase();
    const isDistinct = Boolean(aggMatch[2]);
    const target = aggMatch[3].trim();

    if (fn === "COUNT" && target === "*") {
      return groupRows.length;
    }

    let vals = groupRows
      .map((r) => evalScalarExpr(target, r))
      .filter((v) => v !== null && v !== undefined);

    if (isDistinct) {
      vals = Array.from(new Set(vals));
    }

    if (fn === "COUNT") return vals.length;
    if (vals.length === 0) return null;

    const nums = vals.map((v) => Number(v));
    if (fn === "SUM") return nums.reduce((a, b) => a + b, 0);
    if (fn === "AVG") {
      const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
      return Number.isInteger(avg) ? avg : Number(avg.toFixed(2));
    }
    if (fn === "MAX") return Math.max(...nums);
    if (fn === "MIN") return Math.min(...nums);
  }

  return evalScalarExpr(trimmed, sampleRow);
}

function evalHavingCondition(having: string, groupRows: SqlRow[]): boolean {
  // 例: COUNT(*) >= 2 または SUM(amount) > 1000
  const m = having
    .trim()
    .match(/^([\s\S]+?)\s*(>=|<=|!=|<>|=|>|<)\s*([\s\S]+)$/);
  if (!m) return true;
  const leftVal = evalAggregateOrScalar(m[1], groupRows, groupRows[0] ?? {});
  const op = m[2];
  const rightVal = evalAggregateOrScalar(m[3], groupRows, groupRows[0] ?? {});
  return compareSqlValues(leftVal, op, rightVal);
}

function evalWhereCondition(cond: string, row: SqlRow): boolean {
  const trimmed = cond.trim();

  // OR 分割
  const orParts = splitLogicalOperator(trimmed, "OR");
  if (orParts.length > 1) {
    return orParts.some((p) => evalWhereCondition(p, row));
  }

  // AND 分割
  const andParts = splitLogicalOperator(trimmed, "AND");
  if (andParts.length > 1) {
    return andParts.every((p) => evalWhereCondition(p, row));
  }

  // 外側の括弧を剥がす
  if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
    return evalWhereCondition(trimmed.slice(1, -1), row);
  }

  // NOT
  if (/^NOT\s+/i.test(trimmed)) {
    return !evalWhereCondition(trimmed.replace(/^NOT\s+/i, ""), row);
  }

  // IS NOT NULL / IS NULL
  const isNotNull = trimmed.match(/^([\s\S]+?)\s+IS\s+NOT\s+NULL$/i);
  if (isNotNull) {
    return evalScalarExpr(isNotNull[1], row) !== null;
  }
  const isNull = trimmed.match(/^([\s\S]+?)\s+IS\s+NULL$/i);
  if (isNull) {
    return evalScalarExpr(isNull[1], row) === null;
  }

  // BETWEEN a AND b
  const betweenMatch = trimmed.match(
    /^([\s\S]+?)\s+BETWEEN\s+([\s\S]+?)\s+AND\s+([\s\S]+)$/i
  );
  if (betweenMatch) {
    const v = Number(evalScalarExpr(betweenMatch[1], row));
    const low = Number(evalScalarExpr(betweenMatch[2], row));
    const high = Number(evalScalarExpr(betweenMatch[3], row));
    return v >= low && v <= high;
  }

  // NOT IN (...) / IN (...)
  const notInMatch = trimmed.match(/^([\s\S]+?)\s+NOT\s+IN\s*\(([^)]+)\)$/i);
  if (notInMatch) {
    const leftVal = evalScalarExpr(notInMatch[1], row);
    const list = splitTopLevelComma(notInMatch[2]).map((x) =>
      evalScalarExpr(x.trim(), row)
    );
    return !list.includes(leftVal);
  }

  const inMatch = trimmed.match(/^([\s\S]+?)\s+IN\s*\(([^)]+)\)$/i);
  if (inMatch) {
    const leftVal = evalScalarExpr(inMatch[1], row);
    const list = splitTopLevelComma(inMatch[2]).map((x) =>
      evalScalarExpr(x.trim(), row)
    );
    return list.includes(leftVal);
  }

  // LIKE
  const likeMatch = trimmed.match(/^([\s\S]+?)\s+LIKE\s+([\s\S]+)$/i);
  if (likeMatch) {
    const leftVal = String(evalScalarExpr(likeMatch[1], row) ?? "");
    const pattern = String(evalScalarExpr(likeMatch[2], row) ?? "");
    const regexStr =
      "^" +
      pattern
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/%/g, ".*")
        .replace(/_/g, ".") +
      "$";
    return new RegExp(regexStr, "i").test(leftVal);
  }

  // 比較演算子 (=, !=, <>, >=, <=, >, <)
  const cmpMatch = trimmed.match(
    /^([\s\S]+?)\s*(>=|<=|!=|<>|=|>|<)\s*([\s\S]+)$/
  );
  if (cmpMatch) {
    const leftVal = evalScalarExpr(cmpMatch[1], row);
    const op = cmpMatch[2];
    const rightVal = evalScalarExpr(cmpMatch[3], row);
    return compareSqlValues(leftVal, op, rightVal);
  }

  return Boolean(evalScalarExpr(trimmed, row));
}

function compareSqlValues(
  left: string | number | null,
  op: string,
  right: string | number | null
): boolean {
  if (left === null || right === null) return false;
  switch (op) {
    case "=":
      return left == right;
    case "!=":
    case "<>":
      return left != right;
    case ">":
      return Number(left) > Number(right);
    case ">=":
      return Number(left) >= Number(right);
    case "<":
      return Number(left) < Number(right);
    case "<=":
      return Number(left) <= Number(right);
    default:
      return false;
  }
}

function evalScalarExpr(
  expr: string,
  row: SqlRow
): string | number | null {
  const t = expr.trim();
  if (/^NULL$/i.test(t)) return null;
  if ((t.startsWith("'") && t.endsWith("'")) || (t.startsWith('"') && t.endsWith('"'))) {
    return t.slice(1, -1).replace(/''/g, "'");
  }
  if (/^[+-]?\d+(\.\d+)?$/.test(t)) {
    return Number(t);
  }

  // CASE WHEN <cond> THEN <val> [WHEN ...] [ELSE <val>] END
  const caseMatch = t.match(/^CASE\s+([\s\S]+)\s+END$/i);
  if (caseMatch) {
    const body = caseMatch[1].trim();
    const elseSplit = body.split(/\s+ELSE\s+/i);
    const whenPart = elseSplit[0];
    const elseExpr = elseSplit.length > 1 ? elseSplit.slice(1).join(" ELSE ").trim() : null;
    const branchRegex = /WHEN\s+([\s\S]+?)\s+THEN\s+([\s\S]+?)(?=\s+WHEN\s+|$)/gi;
    let bm: RegExpExecArray | null;
    while ((bm = branchRegex.exec(whenPart)) !== null) {
      if (evalWhereCondition(bm[1].trim(), row)) {
        return evalScalarExpr(bm[2].trim(), row);
      }
    }
    return elseExpr !== null ? evalScalarExpr(elseExpr, row) : null;
  }

  // COALESCE(a, b)
  const coalesceMatch = t.match(/^COALESCE\s*\(([\s\S]+)\)$/i);
  if (coalesceMatch) {
    const args = splitTopLevelComma(coalesceMatch[1]);
    for (const a of args) {
      const val = evalScalarExpr(a, row);
      if (val !== null && val !== undefined) return val;
    }
    return null;
  }

  // UPPER / LOWER / LENGTH
  const funcMatch = t.match(/^(UPPER|LOWER|LENGTH)\s*\(([\s\S]+)\)$/i);
  if (funcMatch) {
    const fn = funcMatch[1].toUpperCase();
    const arg = String(evalScalarExpr(funcMatch[2], row) ?? "");
    if (fn === "UPPER") return arg.toUpperCase();
    if (fn === "LOWER") return arg.toLowerCase();
    if (fn === "LENGTH") return arg.length;
  }

  // 簡単な四則演算 (col * 1.1 等)
  const mathMatch = t.match(/^([a-zA-Z0-9_.]+)\s*([+\-*/])\s*([a-zA-Z0-9_.]+)$/);
  if (mathMatch) {
    const l = Number(evalScalarExpr(mathMatch[1], row));
    const op = mathMatch[2];
    const r = Number(evalScalarExpr(mathMatch[3], row));
    if (op === "+") return l + r;
    if (op === "-") return l - r;
    if (op === "*") return Math.round(l * r * 100) / 100;
    if (op === "/") return r === 0 ? null : Math.round((l / r) * 100) / 100;
  }

  const resolved = resolveColumnValue(row, t);
  if (resolved !== undefined) return resolved;

  return null;
}

// --- パーサー補助関数 ---
function splitTopLevelComma(input: string): string[] {
  const res: string[] = [];
  let curr = "";
  let depth = 0;
  let inQuote = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch === "'") inQuote = !inQuote;
    if (!inQuote) {
      if (ch === "(") depth++;
      else if (ch === ")") depth--;
      else if (ch === "," && depth === 0) {
        res.push(curr.trim());
        curr = "";
        continue;
      }
    }
    curr += ch;
  }
  if (curr.trim()) res.push(curr.trim());
  return res;
}

function splitLogicalOperator(input: string, keyword: "AND" | "OR"): string[] {
  // BETWEEN ... AND ... を壊さないよう制御
  const res: string[] = [];
  let curr = "";
  let depth = 0;
  let inQuote = false;
  let pendingBetween = false;
  const upper = input.toUpperCase();

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch === "'") inQuote = !inQuote;
    if (!inQuote) {
      if (ch === "(") depth++;
      else if (ch === ")") depth--;

      if (depth === 0) {
        if (
          keyword === "AND" &&
          upper.startsWith("BETWEEN ", i) &&
          (i === 0 || /\s/.test(input[i - 1]))
        ) {
          pendingBetween = true;
        }
        const kwPattern = ` ${keyword} `;
        if (upper.startsWith(kwPattern, i)) {
          if (keyword === "AND" && pendingBetween) {
            pendingBetween = false;
          } else {
            res.push(curr.trim());
            curr = "";
            i += kwPattern.length - 1;
            continue;
          }
        }
      }
    }
    curr += ch;
  }
  if (curr.trim()) res.push(curr.trim());
  return res;
}

function parseInsertTuples(valuesPart: string): (string | number | null)[][] {
  const tuples: (string | number | null)[][] = [];
  let i = 0;
  while (i < valuesPart.length) {
    while (i < valuesPart.length && valuesPart[i] !== "(") i++;
    if (i >= valuesPart.length) break;
    i++; // "("
    let content = "";
    let inQuote = false;
    while (i < valuesPart.length) {
      const ch = valuesPart[i];
      if (ch === "'") inQuote = !inQuote;
      if (ch === ")" && !inQuote) {
        i++;
        break;
      }
      content += ch;
      i++;
    }
    const items = splitTopLevelComma(content).map((raw) =>
      evalScalarExpr(raw, {})
    );
    tuples.push(items);
  }
  return tuples;
}

function normalizeWhitespaceOutsideStrings(sql: string): string {
  let out = "";
  let inQuote = false;
  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    if (ch === "'") inQuote = !inQuote;
    if (!inQuote && /\s/.test(ch)) {
      if (out.length > 0 && out[out.length - 1] !== " ") {
        out += " ";
      }
    } else {
      out += ch;
    }
  }
  return out.trim();
}
