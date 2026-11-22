/**
 * Pure TypeScript Interactive Excel Formula Engine & Auto-Grader
 * Supports real spreadsheet evaluation in both browser (real-time cell preview)
 * and server (POST /api/problems/submit grading).
 */

export type ExcelCellRaw = string | number | boolean | null;

export interface ExcelTargetCell {
  /** Cell coordinate such as "D2" or "E6" */
  cell: string;
  /** Expected computed value (number or string) */
  expected: number | string;
  /** Require the user to write a formula starting with '=' (default: true) */
  requireFormula?: boolean;
  /** Optional list of function names or substrings that must appear in the formula (case-insensitive) */
  requiredTokens?: string[];
  /** Human-readable check label */
  label?: string;
}

export interface ExcelProblemSpec {
  sheetName: string;
  /** Number of columns (e.g., 6 -> A..F) */
  cols: number;
  /** Number of rows (e.g., 10 -> 1..10) */
  rows: number;
  /** Optional column widths in px */
  colWidths?: number[];
  /** Initial cell values & formulas keyed by uppercase cell ref (e.g. "A1": "商品名") */
  cells: Record<string, ExcelCellRaw>;
  /** Target cells the student must fill in */
  targets: ExcelTargetCell[];
  /** Optional header rows (1-based) to highlight as table headers */
  headerRows?: number[];
}

export interface ExcelCellEvalResult {
  raw: ExcelCellRaw;
  value: ExcelCellRaw;
  display: string;
  error?: string;
}

export interface ExcelCheckResult {
  cell: string;
  label: string;
  passed: boolean;
  expected: string;
  actual: string;
  formula: string;
  message: string;
}

export interface ExcelGradeResult {
  passed: boolean;
  passedCount: number;
  totalCount: number;
  checks: ExcelCheckResult[];
  evaluatedGrid: Record<string, ExcelCellEvalResult>;
}

// ---------------------------------------------------------------------------
// Coordinate helpers
// ---------------------------------------------------------------------------
export function colIndexToLetter(idx: number): string {
  let n = idx + 1;
  let out = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    out = String.fromCharCode(65 + rem) + out;
    n = Math.floor((n - 1) / 26);
  }
  return out;
}

export function letterToColIndex(letters: string): number {
  let out = 0;
  const upper = letters.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    out = out * 26 + (upper.charCodeAt(i) - 64);
  }
  return out - 1;
}

export function parseCellRef(ref: string): { col: number; row: number } | null {
  const m = /^\$?([A-Za-z]+)\$?(\d+)$/.exec(ref.trim());
  if (!m) return null;
  return {
    col: letterToColIndex(m[1]),
    row: parseInt(m[2], 10) - 1,
  };
}

export function normalizeCellRef(ref: string): string {
  return ref.replace(/\$/g, "").trim().toUpperCase();
}

export function expandRange(startRef: string, endRef: string): string[] {
  const a = parseCellRef(startRef);
  const b = parseCellRef(endRef);
  if (!a || !b) return [];
  const c1 = Math.min(a.col, b.col);
  const c2 = Math.max(a.col, b.col);
  const r1 = Math.min(a.row, b.row);
  const r2 = Math.max(a.row, b.row);
  const refs: string[] = [];
  for (let r = r1; r <= r2; r++) {
    for (let c = c1; c <= c2; c++) {
      refs.push(`${colIndexToLetter(c)}${r + 1}`);
    }
  }
  return refs;
}

export function expandRange2D(startRef: string, endRef: string): string[][] {
  const a = parseCellRef(startRef);
  const b = parseCellRef(endRef);
  if (!a || !b) return [];
  const c1 = Math.min(a.col, b.col);
  const c2 = Math.max(a.col, b.col);
  const r1 = Math.min(a.row, b.row);
  const r2 = Math.max(a.row, b.row);
  const grid: string[][] = [];
  for (let r = r1; r <= r2; r++) {
    const rowRefs: string[] = [];
    for (let c = c1; c <= c2; c++) {
      rowRefs.push(`${colIndexToLetter(c)}${r + 1}`);
    }
    grid.push(rowRefs);
  }
  return grid;
}

// ---------------------------------------------------------------------------
// Formula Tokenizer & Recursive-Descent Parser
// ---------------------------------------------------------------------------
type TokenType = "NUMBER" | "STRING" | "IDENT" | "OP" | "LPAREN" | "RPAREN" | "COMMA" | "COLON" | "EOF";

interface Token {
  type: TokenType;
  value: string;
}

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const len = expr.length;

  while (i < len) {
    const ch = expr[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === '"') {
      let str = "";
      i++;
      while (i < len) {
        if (expr[i] === '"' && expr[i + 1] === '"') {
          str += '"';
          i += 2;
        } else if (expr[i] === '"') {
          i++;
          break;
        } else {
          str += expr[i++];
        }
      }
      tokens.push({ type: "STRING", value: str });
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      let num = "";
      while (i < len && /[0-9.]/.test(expr[i])) {
        num += expr[i++];
      }
      tokens.push({ type: "NUMBER", value: num });
      continue;
    }
    if (/[A-Za-z_$]/.test(ch)) {
      let id = "";
      while (i < len && /[A-Za-z0-9_$.]/.test(expr[i])) {
        id += expr[i++];
      }
      tokens.push({ type: "IDENT", value: id });
      continue;
    }
    // Two-character operators
    const two = expr.slice(i, i + 2);
    if (two === "<=" || two === ">=" || two === "<>" || two === "!=") {
      tokens.push({ type: "OP", value: two });
      i += 2;
      continue;
    }
    if ("+-*/^=<>&".includes(ch)) {
      tokens.push({ type: "OP", value: ch });
      i++;
      continue;
    }
    if (ch === "(") {
      tokens.push({ type: "LPAREN", value: ch });
      i++;
      continue;
    }
    if (ch === ")") {
      tokens.push({ type: "RPAREN", value: ch });
      i++;
      continue;
    }
    if (ch === ",") {
      tokens.push({ type: "COMMA", value: ch });
      i++;
      continue;
    }
    if (ch === ":") {
      tokens.push({ type: "COLON", value: ch });
      i++;
      continue;
    }
    throw new Error("#VALUE!");
  }

  tokens.push({ type: "EOF", value: "" });
  return tokens;
}

type EvalValue = number | string | boolean | null | RangeVal;

interface RangeVal {
  __range: true;
  start: string;
  end: string;
}

function isRange(v: EvalValue): v is RangeVal {
  return typeof v === "object" && v !== null && "__range" in v;
}

function toNumber(v: EvalValue): number {
  if (typeof v === "number") return v;
  if (typeof v === "boolean") return v ? 1 : 0;
  if (v === null || v === "") return 0;
  if (typeof v === "string") {
    const cleaned = v.replace(/,/g, "").trim();
    if (cleaned === "") return 0;
    const n = Number(cleaned);
    if (!Number.isNaN(n)) return n;
  }
  throw new Error("#VALUE!");
}

function toStr(v: EvalValue): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
  if (isRange(v)) return "";
  return String(v);
}

function matchesCriteria(cellVal: ExcelCellRaw, criteriaRaw: EvalValue): boolean {
  const critStr = toStr(criteriaRaw);
  const opMatch = /^(<=|>=|<>|!=|=|<|>)(.*)$/.exec(critStr);
  if (opMatch) {
    const op = opMatch[1];
    const rhsRaw = opMatch[2].trim();
    const rhsNum = Number(rhsRaw);
    const lhsNum = typeof cellVal === "number" ? cellVal : Number(cellVal);
    if (rhsRaw !== "" && !Number.isNaN(rhsNum) && cellVal !== null && cellVal !== "" && !Number.isNaN(lhsNum)) {
      switch (op) {
        case "=": return lhsNum === rhsNum;
        case "<>":
        case "!=": return lhsNum !== rhsNum;
        case "<": return lhsNum < rhsNum;
        case "<=": return lhsNum <= rhsNum;
        case ">": return lhsNum > rhsNum;
        case ">=": return lhsNum >= rhsNum;
      }
    }
    const lhsStr = toStr(cellVal).toLowerCase();
    const rhsStr = rhsRaw.toLowerCase();
    switch (op) {
      case "=": return lhsStr === rhsStr;
      case "<>":
      case "!=": return lhsStr !== rhsStr;
      case "<": return lhsStr < rhsStr;
      case "<=": return lhsStr <= rhsStr;
      case ">": return lhsStr > rhsStr;
      case ">=": return lhsStr >= rhsStr;
    }
  }

  // Wildcard support (* and ?)
  if (typeof criteriaRaw === "string" && (criteriaRaw.includes("*") || criteriaRaw.includes("?"))) {
    const escaped = criteriaRaw
      .replace(/[.+^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*")
      .replace(/\?/g, ".");
    return new RegExp(`^${escaped}$`, "i").test(toStr(cellVal));
  }

  if (typeof cellVal === "number" && typeof criteriaRaw === "number") {
    return cellVal === criteriaRaw;
  }
  return toStr(cellVal).toLowerCase() === critStr.toLowerCase();
}

// ---------------------------------------------------------------------------
// Sheet Evaluator
// ---------------------------------------------------------------------------
export function evaluateSheet(rawCells: Record<string, ExcelCellRaw>): Record<string, ExcelCellEvalResult> {
  const normalized: Record<string, ExcelCellRaw> = {};
  for (const [k, v] of Object.entries(rawCells)) {
    normalized[normalizeCellRef(k)] = v;
  }

  const cache = new Map<string, ExcelCellEvalResult>();
  const visiting = new Set<string>();

  function evalCell(ref: string): ExcelCellEvalResult {
    const norm = normalizeCellRef(ref);
    if (cache.has(norm)) return cache.get(norm)!;
    if (visiting.has(norm)) {
      return { raw: normalized[norm] ?? "", value: "#REF!", display: "#REF!", error: "#REF!" };
    }

    const raw = normalized[norm] ?? null;
    if (raw === null || raw === "") {
      const res: ExcelCellEvalResult = { raw: raw ?? "", value: null, display: "" };
      cache.set(norm, res);
      return res;
    }

    if (typeof raw === "number" || typeof raw === "boolean") {
      const res: ExcelCellEvalResult = {
        raw,
        value: raw,
        display: typeof raw === "boolean" ? (raw ? "TRUE" : "FALSE") : String(raw),
      };
      cache.set(norm, res);
      return res;
    }

    const strRaw = String(raw).trim();
    if (!strRaw.startsWith("=")) {
      const numCandidate = Number(strRaw);
      if (strRaw !== "" && !Number.isNaN(numCandidate) && /^-?\d+(\.\d+)?$/.test(strRaw)) {
        const res: ExcelCellEvalResult = { raw, value: numCandidate, display: String(numCandidate) };
        cache.set(norm, res);
        return res;
      }
      const res: ExcelCellEvalResult = { raw, value: strRaw, display: strRaw };
      cache.set(norm, res);
      return res;
    }

    visiting.add(norm);
    try {
      const tokens = tokenize(strRaw.slice(1));
      const val = parseAndEval(tokens, evalCell);
      const finalVal: ExcelCellRaw = isRange(val) ? "#VALUE!" : val;
      const display =
        finalVal === null
          ? ""
          : typeof finalVal === "number"
            ? String(Math.round(finalVal * 1e10) / 1e10)
            : typeof finalVal === "boolean"
              ? finalVal
                ? "TRUE"
                : "FALSE"
              : String(finalVal);
      const res: ExcelCellEvalResult = { raw, value: finalVal, display };
      cache.set(norm, res);
      return res;
    } catch (err) {
      const code = err instanceof Error && err.message.startsWith("#") ? err.message : "#ERROR!";
      const res: ExcelCellEvalResult = { raw, value: code, display: code, error: code };
      cache.set(norm, res);
      return res;
    } finally {
      visiting.delete(norm);
    }
  }

  for (const key of Object.keys(normalized)) {
    evalCell(key);
  }

  const output: Record<string, ExcelCellEvalResult> = {};
  for (const [k, v] of cache.entries()) {
    output[k] = v;
  }
  return output;
}

function parseAndEval(
  tokens: Token[],
  evalCell: (ref: string) => ExcelCellEvalResult
): EvalValue {
  let pos = 0;

  function peek(): Token {
    return tokens[pos] ?? { type: "EOF", value: "" };
  }
  function consume(): Token {
    return tokens[pos++];
  }

  function getRangeValues(val: EvalValue): ExcelCellRaw[] {
    if (isRange(val)) {
      return expandRange(val.start, val.end).map((r) => {
        const c = evalCell(r);
        if (c.error) throw new Error(c.error);
        return c.value;
      });
    }
    return [val as ExcelCellRaw];
  }

  function parseComparison(): EvalValue {
    let left = parseConcat();
    while (
      peek().type === "OP" &&
      ["=", "<>", "!=", "<", "<=", ">", ">="].includes(peek().value)
    ) {
      const op = consume().value;
      const right = parseConcat();
      if (typeof left === "number" && typeof right === "number") {
        switch (op) {
          case "=": left = Math.abs(left - right) < 1e-9; break;
          case "<>":
          case "!=": left = Math.abs(left - right) >= 1e-9; break;
          case "<": left = left < right; break;
          case "<=": left = left <= right; break;
          case ">": left = left > right; break;
          case ">=": left = left >= right; break;
        }
      } else {
        const ls = toStr(left).toLowerCase();
        const rs = toStr(right).toLowerCase();
        switch (op) {
          case "=": left = ls === rs; break;
          case "<>":
          case "!=": left = ls !== rs; break;
          case "<": left = ls < rs; break;
          case "<=": left = ls <= rs; break;
          case ">": left = ls > rs; break;
          case ">=": left = ls >= rs; break;
        }
      }
    }
    return left;
  }

  function parseConcat(): EvalValue {
    let left = parseAddSub();
    while (peek().type === "OP" && peek().value === "&") {
      consume();
      const right = parseAddSub();
      left = toStr(left) + toStr(right);
    }
    return left;
  }

  function parseAddSub(): EvalValue {
    let left = parseMulDiv();
    while (peek().type === "OP" && (peek().value === "+" || peek().value === "-")) {
      const op = consume().value;
      const right = parseMulDiv();
      left = op === "+" ? toNumber(left) + toNumber(right) : toNumber(left) - toNumber(right);
    }
    return left;
  }

  function parseMulDiv(): EvalValue {
    let left = parsePower();
    while (peek().type === "OP" && (peek().value === "*" || peek().value === "/")) {
      const op = consume().value;
      const right = parsePower();
      if (op === "*") {
        left = toNumber(left) * toNumber(right);
      } else {
        const denom = toNumber(right);
        if (denom === 0) throw new Error("#DIV/0!");
        left = toNumber(left) / denom;
      }
    }
    return left;
  }

  function parsePower(): EvalValue {
    let left = parseUnary();
    if (peek().type === "OP" && peek().value === "^") {
      consume();
      const right = parsePower();
      left = Math.pow(toNumber(left), toNumber(right));
    }
    return left;
  }

  function parseUnary(): EvalValue {
    if (peek().type === "OP" && peek().value === "-") {
      consume();
      return -toNumber(parseUnary());
    }
    if (peek().type === "OP" && peek().value === "+") {
      consume();
      return toNumber(parseUnary());
    }
    return parsePrimary();
  }

  function parsePrimary(): EvalValue {
    const tok = peek();
    if (tok.type === "NUMBER") {
      consume();
      return Number(tok.value);
    }
    if (tok.type === "STRING") {
      consume();
      return tok.value;
    }
    if (tok.type === "LPAREN") {
      consume();
      const val = parseComparison();
      if (peek().type !== "RPAREN") throw new Error("#VALUE!");
      consume();
      return val;
    }
    if (tok.type === "IDENT") {
      consume();
      const upper = tok.value.toUpperCase();

      // Function call
      if (peek().type === "LPAREN") {
        consume();
        return evalFunction(upper);
      }

      if (upper === "TRUE") return true;
      if (upper === "FALSE") return false;

      // Range (e.g. A1:B5 or $A$1:$B$5)
      if (peek().type === "COLON") {
        consume();
        const endTok = consume();
        if (endTok.type !== "IDENT") throw new Error("#REF!");
        return { __range: true, start: tok.value, end: endTok.value };
      }

      // Single cell reference
      if (parseCellRef(tok.value)) {
        const cellRes = evalCell(tok.value);
        if (cellRes.error) throw new Error(cellRes.error);
        return cellRes.value;
      }

      throw new Error("#NAME?");
    }

    throw new Error("#VALUE!");
  }

  function evalFunction(name: string): EvalValue {
    // Special lazy-eval functions: IFERROR and IF
    if (name === "IFERROR") {
      const startPos = pos;
      let firstVal: EvalValue = null;
      let errored = false;
      try {
        firstVal = parseComparison();
      } catch {
        errored = true;
        // Skip remaining tokens of arg1 until top-level COMMA
        pos = startPos;
        let depth = 0;
        while (peek().type !== "EOF") {
          const t = peek();
          if (t.type === "LPAREN") depth++;
          else if (t.type === "RPAREN") {
            if (depth === 0) break;
            depth--;
          } else if (t.type === "COMMA" && depth === 0) {
            break;
          }
          consume();
        }
      }
      if (peek().type === "COMMA") consume();
      const fallbackVal = parseComparison();
      if (peek().type === "RPAREN") consume();
      if (errored || (typeof firstVal === "string" && firstVal.startsWith("#"))) {
        return fallbackVal;
      }
      return firstVal;
    }

    const args: EvalValue[] = [];
    if (peek().type !== "RPAREN") {
      while (true) {
        args.push(parseComparison());
        if (peek().type === "COMMA") {
          consume();
        } else {
          break;
        }
      }
    }
    if (peek().type !== "RPAREN") throw new Error("#VALUE!");
    consume();

    switch (name) {
      case "SUM": {
        let sum = 0;
        for (const a of args) {
          for (const v of getRangeValues(a)) {
            if (typeof v === "number") sum += v;
          }
        }
        return sum;
      }
      case "AVERAGE": {
        let sum = 0;
        let count = 0;
        for (const a of args) {
          for (const v of getRangeValues(a)) {
            if (typeof v === "number") {
              sum += v;
              count++;
            }
          }
        }
        if (count === 0) throw new Error("#DIV/0!");
        return sum / count;
      }
      case "COUNT": {
        let count = 0;
        for (const a of args) {
          for (const v of getRangeValues(a)) {
            if (typeof v === "number") count++;
          }
        }
        return count;
      }
      case "COUNTA": {
        let count = 0;
        for (const a of args) {
          for (const v of getRangeValues(a)) {
            if (v !== null && v !== "") count++;
          }
        }
        return count;
      }
      case "MAX": {
        const nums: number[] = [];
        for (const a of args) {
          for (const v of getRangeValues(a)) {
            if (typeof v === "number") nums.push(v);
          }
        }
        return nums.length === 0 ? 0 : Math.max(...nums);
      }
      case "MIN": {
        const nums: number[] = [];
        for (const a of args) {
          for (const v of getRangeValues(a)) {
            if (typeof v === "number") nums.push(v);
          }
        }
        return nums.length === 0 ? 0 : Math.min(...nums);
      }
      case "ROUND": {
        const n = toNumber(args[0] ?? 0);
        const digits = toNumber(args[1] ?? 0);
        const factor = Math.pow(10, digits);
        return Math.round(n * factor) / factor;
      }
      case "ROUNDUP": {
        const n = toNumber(args[0] ?? 0);
        const digits = toNumber(args[1] ?? 0);
        const factor = Math.pow(10, digits);
        return n >= 0 ? Math.ceil(n * factor) / factor : Math.floor(n * factor) / factor;
      }
      case "ROUNDDOWN": {
        const n = toNumber(args[0] ?? 0);
        const digits = toNumber(args[1] ?? 0);
        const factor = Math.pow(10, digits);
        return n >= 0 ? Math.floor(n * factor) / factor : Math.ceil(n * factor) / factor;
      }
      case "INT":
        return Math.floor(toNumber(args[0] ?? 0));
      case "ABS":
        return Math.abs(toNumber(args[0] ?? 0));
      case "IF": {
        const cond = Boolean(args[0]);
        return cond ? (args[1] ?? true) : (args[2] ?? false);
      }
      case "AND":
        return args.every((a) => Boolean(a));
      case "OR":
        return args.some((a) => Boolean(a));
      case "NOT":
        return !Boolean(args[0]);
      case "COUNTIF": {
        if (args.length < 2) throw new Error("#VALUE!");
        const vals = getRangeValues(args[0]);
        const crit = args[1];
        return vals.filter((v) => matchesCriteria(v, crit)).length;
      }
      case "SUMIF": {
        if (args.length < 2) throw new Error("#VALUE!");
        const critVals = getRangeValues(args[0]);
        const crit = args[1];
        const sumVals = args.length >= 3 ? getRangeValues(args[2]) : critVals;
        let total = 0;
        for (let i = 0; i < critVals.length; i++) {
          if (matchesCriteria(critVals[i], crit)) {
            const sv = sumVals[i];
            if (typeof sv === "number") total += sv;
          }
        }
        return total;
      }
      case "AVERAGEIF": {
        if (args.length < 2) throw new Error("#VALUE!");
        const critVals = getRangeValues(args[0]);
        const crit = args[1];
        const avgVals = args.length >= 3 ? getRangeValues(args[2]) : critVals;
        let total = 0;
        let cnt = 0;
        for (let i = 0; i < critVals.length; i++) {
          if (matchesCriteria(critVals[i], crit)) {
            const sv = avgVals[i];
            if (typeof sv === "number") {
              total += sv;
              cnt++;
            }
          }
        }
        if (cnt === 0) throw new Error("#DIV/0!");
        return total / cnt;
      }
      case "VLOOKUP": {
        if (args.length < 3 || !isRange(args[1])) throw new Error("#VALUE!");
        const lookupVal = args[0];
        const tableRefs = expandRange2D(args[1].start, args[1].end);
        const colIdx = Math.floor(toNumber(args[2])) - 1;
        if (colIdx < 0 || (tableRefs[0] && colIdx >= tableRefs[0].length)) {
          throw new Error("#REF!");
        }
        const approx = args.length >= 4 ? Boolean(args[3]) : true;
        if (!approx) {
          for (const rowRefs of tableRefs) {
            const keyVal = evalCell(rowRefs[0]).value;
            if (toStr(keyVal).toLowerCase() === toStr(lookupVal).toLowerCase()) {
              return evalCell(rowRefs[colIdx]).value;
            }
          }
          throw new Error("#N/A");
        } else {
          let bestIdx = -1;
          const targetNum = toNumber(lookupVal);
          for (let i = 0; i < tableRefs.length; i++) {
            const keyVal = evalCell(tableRefs[i][0]).value;
            if (typeof keyVal === "number" && keyVal <= targetNum) {
              bestIdx = i;
            }
          }
          if (bestIdx === -1) throw new Error("#N/A");
          return evalCell(tableRefs[bestIdx][colIdx]).value;
        }
      }
      case "XLOOKUP": {
        if (args.length < 3 || !isRange(args[1]) || !isRange(args[2])) throw new Error("#VALUE!");
        const lookupVal = args[0];
        const lookupRefs = expandRange(args[1].start, args[1].end);
        const returnRefs = expandRange(args[2].start, args[2].end);
        const notFound = args.length >= 4 ? args[3] : undefined;
        for (let i = 0; i < lookupRefs.length; i++) {
          const kv = evalCell(lookupRefs[i]).value;
          if (toStr(kv).toLowerCase() === toStr(lookupVal).toLowerCase()) {
            return i < returnRefs.length ? evalCell(returnRefs[i]).value : null;
          }
        }
        if (notFound !== undefined) return notFound;
        throw new Error("#N/A");
      }
      case "LEN":
        return toStr(args[0]).length;
      case "LEFT":
        return toStr(args[0]).slice(0, toNumber(args[1] ?? 1));
      case "RIGHT": {
        const s = toStr(args[0]);
        const n = toNumber(args[1] ?? 1);
        return s.slice(Math.max(0, s.length - n));
      }
      case "MID": {
        const s = toStr(args[0]);
        const start = Math.max(1, toNumber(args[1] ?? 1)) - 1;
        const count = toNumber(args[2] ?? 0);
        return s.slice(start, start + count);
      }
      case "CONCAT":
      case "CONCATENATE":
        return args
          .flatMap((a) => getRangeValues(a))
          .map((v) => toStr(v))
          .join("");
      case "UPPER":
        return toStr(args[0]).toUpperCase();
      case "LOWER":
        return toStr(args[0]).toLowerCase();
      case "TRIM":
        return toStr(args[0]).trim().replace(/\s+/g, " ");
      case "ISBLANK":
        return args[0] === null || args[0] === "";
      default:
        throw new Error("#NAME?");
    }
  }

  return parseComparison();
}

// ---------------------------------------------------------------------------
// Auto-Grader for Student Submissions
// ---------------------------------------------------------------------------
export function parseExcelProblemSpec(starterCode: string): ExcelProblemSpec | null {
  try {
    const parsed = JSON.parse(starterCode) as ExcelProblemSpec;
    if (parsed && typeof parsed.cols === "number" && typeof parsed.rows === "number" && Array.isArray(parsed.targets)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function evaluateExcelSubmission(
  starterCodeJson: string,
  userSubmissionJson: string
): ExcelGradeResult {
  const spec = parseExcelProblemSpec(starterCodeJson);
  if (!spec) {
    return {
      passed: false,
      passedCount: 0,
      totalCount: 0,
      checks: [],
      evaluatedGrid: {},
    };
  }

  let userInputs: Record<string, string> = {};
  try {
    const parsed = JSON.parse(userSubmissionJson);
    if (parsed && typeof parsed === "object") {
      userInputs = parsed as Record<string, string>;
    }
  } catch {
    userInputs = {};
  }

  const mergedCells: Record<string, ExcelCellRaw> = { ...spec.cells };
  for (const [k, v] of Object.entries(userInputs)) {
    mergedCells[normalizeCellRef(k)] = v;
  }

  const evaluatedGrid = evaluateSheet(mergedCells);
  const checks: ExcelCheckResult[] = spec.targets.map((target) => {
    const ref = normalizeCellRef(target.cell);
    const label = target.label || `${ref} セル`;
    const userFormula = String(userInputs[ref] ?? "").trim();
    const evalCell = evaluatedGrid[ref] ?? { raw: "", value: null, display: "" };
    const requireFormula = target.requireFormula !== false;

    if (!userFormula) {
      return {
        cell: ref,
        label,
        passed: false,
        expected: String(target.expected),
        actual: "(未入力)",
        formula: "",
        message: `${ref} に数式または値を入力してください`,
      };
    }

    if (requireFormula && !userFormula.startsWith("=")) {
      return {
        cell: ref,
        label,
        passed: false,
        expected: String(target.expected),
        actual: evalCell.display,
        formula: userFormula,
        message: `${ref} は手入力の数値ではなく「=」から始まる数式で入力してください`,
      };
    }

    if (target.requiredTokens && target.requiredTokens.length > 0) {
      const upperFormula = userFormula.toUpperCase();
      const missing = target.requiredTokens.filter((tk) => !upperFormula.includes(tk.toUpperCase()));
      if (missing.length > 0) {
        return {
          cell: ref,
          label,
          passed: false,
          expected: String(target.expected),
          actual: evalCell.display,
          formula: userFormula,
          message: `${ref} の数式に指定の関数・記号（${missing.join(", ")}）を使用してください`,
        };
      }
    }

    if (evalCell.error) {
      return {
        cell: ref,
        label,
        passed: false,
        expected: String(target.expected),
        actual: evalCell.error,
        formula: userFormula,
        message: `${ref} で数式エラー（${evalCell.error}）が発生しています`,
      };
    }

    let valueMatches = false;
    if (typeof target.expected === "number") {
      const actualNum = typeof evalCell.value === "number" ? evalCell.value : Number(evalCell.value);
      valueMatches = !Number.isNaN(actualNum) && Math.abs(actualNum - target.expected) < 1e-4;
    } else {
      valueMatches = String(evalCell.value ?? "").trim() === target.expected.trim();
    }

    return {
      cell: ref,
      label,
      passed: valueMatches,
      expected: String(target.expected),
      actual: evalCell.display || "(空)",
      formula: userFormula,
      message: valueMatches
        ? `OK（結果: ${evalCell.display}）`
        : `期待値「${target.expected}」に対し、計算結果は「${evalCell.display || "(空)"}」です`,
    };
  });

  const passedCount = checks.filter((c) => c.passed).length;
  return {
    passed: checks.length > 0 && passedCount === checks.length,
    passedCount,
    totalCount: checks.length,
    checks,
    evaluatedGrid,
  };
}
