// =============================================================================
// 自作Javaインタプリタ：字句解析器（Lexer）
// =============================================================================

import { JavaDiagnostic, Token } from "./types";
import { createDiagnostic } from "./errors";

const JAVA_KEYWORDS = new Set([
  "abstract",
  "boolean",
  "break",
  "byte",
  "case",
  "catch",
  "char",
  "class",
  "const",
  "continue",
  "default",
  "do",
  "double",
  "else",
  "enum",
  "extends",
  "final",
  "finally",
  "float",
  "for",
  "goto",
  "if",
  "implements",
  "import",
  "instanceof",
  "int",
  "interface",
  "long",
  "native",
  "new",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "short",
  "static",
  "strictfp",
  "super",
  "switch",
  "synchronized",
  "this",
  "throw",
  "throws",
  "transient",
  "try",
  "void",
  "volatile",
  "while",
  "var",
]);

const UNSUPPORTED_KEYWORDS: Record<string, string> = {
  synchronized:
    "スレッド同期（synchronized）は本カリキュラムでは未対応です。",
  native: "nativeメソッドは本カリキュラムでは未対応です。",
};

const MULTI_CHAR_OPERATORS = [
  ">>>=",
  "<<=",
  ">>=",
  ">>>",
  "==",
  "!=",
  "<=",
  ">=",
  "&&",
  "||",
  "++",
  "--",
  "+=",
  "-=",
  "*=",
  "/=",
  "%=",
  "&=",
  "|=",
  "^=",
  "<<",
  ">>",
  "->",
  "::",
];

const SINGLE_CHAR_OPERATORS = new Set([
  "+",
  "-",
  "*",
  "/",
  "%",
  "=",
  "<",
  ">",
  "!",
  "&",
  "|",
  "^",
  "~",
  "?",
  ":",
]);

const PUNCTUATIONS = new Set(["(", ")", "{", "}", "[", "]", ";", ",", "."]);

export interface LexerResult {
  tokens: Token[];
  diagnostics: JavaDiagnostic[];
}

export function tokenize(source: string): LexerResult {
  const tokens: Token[] = [];
  const diagnostics: JavaDiagnostic[] = [];

  let pos = 0;
  let line = 1;
  let col = 1;

  const length = source.length;

  const advance = (count = 1) => {
    for (let i = 0; i < count; i++) {
      if (source[pos] === "\n") {
        line++;
        col = 1;
      } else {
        col++;
      }
      pos++;
    }
  };

  while (pos < length) {
    const ch = source[pos];

    // 空白・改行のスキップ（全角スペースが混入した場合は親切にエラーを出す）
    if (ch === " " || ch === "\t" || ch === "\r" || ch === "\n") {
      advance();
      continue;
    }

    if (ch === "　") {
      diagnostics.push(
        createDiagnostic(
          line,
          col,
          "全角スペースが含まれています。",
          "Javaのコード内（文字列の外側）では全角スペースは使えません。半角スペースに直してください。",
          col + 1
        )
      );
      advance();
      continue;
    }

    // 単一行コメント //
    if (ch === "/" && source[pos + 1] === "/") {
      while (pos < length && source[pos] !== "\n") {
        advance();
      }
      continue;
    }

    // 複数行コメント /* ... */
    if (ch === "/" && source[pos + 1] === "*") {
      const startLine = line;
      const startCol = col;
      advance(2);
      while (pos < length && !(source[pos] === "*" && source[pos + 1] === "/")) {
        advance();
      }
      if (pos >= length) {
        diagnostics.push(
          createDiagnostic(
            startLine,
            startCol,
            "コメント /* が閉じられていません。",
            "複数行コメントの終わり（*/）が抜けています。"
          )
        );
      } else {
        advance(2);
      }
      continue;
    }

    // アノテーション (@Override 等) はスキップ
    if (ch === "@") {
      advance();
      while (pos < length && /[a-zA-Z0-9_]/.test(source[pos])) {
        advance();
      }
      continue;
    }

    // 文字列リテラル "..."
    if (ch === '"') {
      const startLine = line;
      const startCol = col;
      advance(); // '"'
      let value = "";
      let closed = false;
      while (pos < length) {
        const c = source[pos];
        if (c === '"') {
          advance();
          closed = true;
          break;
        }
        if (c === "\n" || c === "\r") {
          break;
        }
        if (c === "\\") {
          advance();
          if (pos >= length) break;
          const esc = source[pos];
          switch (esc) {
            case "n":
              value += "\n";
              break;
            case "t":
              value += "\t";
              break;
            case "r":
              value += "\r";
              break;
            case "\\":
              value += "\\";
              break;
            case '"':
              value += '"';
              break;
            case "'":
              value += "'";
              break;
            default:
              value += esc;
              break;
          }
          advance();
        } else {
          value += c;
          advance();
        }
      }
      if (!closed) {
        diagnostics.push(
          createDiagnostic(
            startLine,
            startCol,
            "文字列リテラルが閉じられていません。",
            'ダブルクォーテーション（"）で文字列を閉じてください。'
          )
        );
      }
      tokens.push({
        type: "STRING_LITERAL",
        value,
        line: startLine,
        column: startCol,
      });
      continue;
    }

    // 文字リテラル '...'
    if (ch === "'") {
      const startLine = line;
      const startCol = col;
      advance(); // "'"
      let value = "";
      if (pos < length && source[pos] === "\\") {
        advance();
        const esc = source[pos];
        switch (esc) {
          case "n":
            value = "\n";
            break;
          case "t":
            value = "\t";
            break;
          case "r":
            value = "\r";
            break;
          case "\\":
            value = "\\";
            break;
          case "'":
            value = "'";
            break;
          case '"':
            value = '"';
            break;
          default:
            value = esc;
            break;
        }
        advance();
      } else if (pos < length && source[pos] !== "'") {
        value = source[pos];
        advance();
      }

      if (pos < length && source[pos] === "'") {
        advance();
      } else {
        diagnostics.push(
          createDiagnostic(
            startLine,
            startCol,
            "文字リテラル（char）が正しく閉じられていません。",
            "シングルクォーテーション（'）には1文字だけを入れ、'A' のように閉じてください。2文字以上の文字列にはダブルクォーテーション（\"）を使います。"
          )
        );
        while (
          pos < length &&
          source[pos] !== "'" &&
          source[pos] !== "\n" &&
          source[pos] !== ";"
        ) {
          advance();
        }
        if (source[pos] === "'") advance();
      }

      tokens.push({
        type: "CHAR_LITERAL",
        value: value || "\0",
        line: startLine,
        column: startCol,
      });
      continue;
    }

    // 数値リテラル
    if (/[0-9]/.test(ch)) {
      const startLine = line;
      const startCol = col;
      let numStr = "";
      let isDouble = false;
      let isLong = false;

      if (ch === "0" && (source[pos + 1] === "x" || source[pos + 1] === "X")) {
        numStr += "0x";
        advance(2);
        while (pos < length && /[0-9a-fA-F_]/.test(source[pos])) {
          if (source[pos] !== "_") numStr += source[pos];
          advance();
        }
      } else {
        while (pos < length && /[0-9_]/.test(source[pos])) {
          if (source[pos] !== "_") numStr += source[pos];
          advance();
        }
        if (pos < length && source[pos] === "." && /[0-9]/.test(source[pos + 1] || "")) {
          isDouble = true;
          numStr += ".";
          advance();
          while (pos < length && /[0-9_]/.test(source[pos])) {
            if (source[pos] !== "_") numStr += source[pos];
            advance();
          }
        }
        if (pos < length && (source[pos] === "e" || source[pos] === "E")) {
          isDouble = true;
          numStr += source[pos];
          advance();
          if (pos < length && (source[pos] === "+" || source[pos] === "-")) {
            numStr += source[pos];
            advance();
          }
          while (pos < length && /[0-9_]/.test(source[pos])) {
            if (source[pos] !== "_") numStr += source[pos];
            advance();
          }
        }
      }

      if (pos < length) {
        const suffix = source[pos];
        if (suffix === "L" || suffix === "l") {
          isLong = true;
          advance();
        } else if (suffix === "d" || suffix === "D" || suffix === "f" || suffix === "F") {
          isDouble = true;
          advance();
        }
      }

      tokens.push({
        type: isDouble
          ? "DOUBLE_LITERAL"
          : isLong
          ? "LONG_LITERAL"
          : "INT_LITERAL",
        value: numStr,
        line: startLine,
        column: startCol,
      });
      continue;
    }

    // 識別子またはキーワード
    if (/[a-zA-Z_$]/.test(ch)) {
      const startLine = line;
      const startCol = col;
      let ident = "";
      while (pos < length && /[a-zA-Z0-9_$]/.test(source[pos])) {
        ident += source[pos];
        advance();
      }

      if (ident === "true" || ident === "false") {
        tokens.push({
          type: "BOOLEAN_LITERAL",
          value: ident,
          line: startLine,
          column: startCol,
        });
      } else if (ident === "null") {
        tokens.push({
          type: "NULL_LITERAL",
          value: ident,
          line: startLine,
          column: startCol,
        });
      } else if (JAVA_KEYWORDS.has(ident)) {
        if (UNSUPPORTED_KEYWORDS[ident]) {
          diagnostics.push(
            createDiagnostic(
              startLine,
              startCol,
              `この機能は本カリキュラムでは未対応です（${startLine}行目: ${ident}）`,
              UNSUPPORTED_KEYWORDS[ident],
              startCol + ident.length
            )
          );
        }
        tokens.push({
          type: "KEYWORD",
          value: ident,
          line: startLine,
          column: startCol,
        });
      } else {
        tokens.push({
          type: "IDENTIFIER",
          value: ident,
          line: startLine,
          column: startCol,
        });
      }
      continue;
    }

    // 可変長引数 `...`
    if (
      ch === "." &&
      source[pos + 1] === "." &&
      source[pos + 2] === "."
    ) {
      tokens.push({
        type: "PUNCTUATION",
        value: "...",
        line,
        column: col,
      });
      advance(3);
      continue;
    }

    // 複数文字の演算子
    let matchedOp: string | null = null;
    for (const op of MULTI_CHAR_OPERATORS) {
      if (source.startsWith(op, pos)) {
        matchedOp = op;
        break;
      }
    }
    if (matchedOp) {
      tokens.push({
        type: "OPERATOR",
        value: matchedOp,
        line,
        column: col,
      });
      advance(matchedOp.length);
      continue;
    }

    // 単一文字の演算子
    if (SINGLE_CHAR_OPERATORS.has(ch)) {
      tokens.push({
        type: "OPERATOR",
        value: ch,
        line,
        column: col,
      });
      advance();
      continue;
    }

    // 句読点
    if (PUNCTUATIONS.has(ch)) {
      tokens.push({
        type: "PUNCTUATION",
        value: ch,
        line,
        column: col,
      });
      advance();
      continue;
    }

    // 全角記号などのエラー検出
    diagnostics.push(
      createDiagnostic(
        line,
        col,
        `不正な文字「${ch}」が含まれています。`,
        "全角の記号（；や（）、”など）が混ざっていないか確認してください。Javaでは記号はすべて半角で入力します。",
        col + 1
      )
    );
    advance();
  }

  tokens.push({
    type: "EOF",
    value: "",
    line,
    column: col,
  });

  return { tokens, diagnostics };
}
