// =============================================================================
// 自作Javaインタプリタ：再帰下降構文解析器（Parser）
// =============================================================================

import {
  ArrayInitializerExprNode,
  BlockStmtNode,
  CatchClauseNode,
  ClassDeclNode,
  ConstructorDeclNode,
  ExprNode,
  FieldDeclNode,
  JavaDiagnostic,
  MethodDeclNode,
  ParameterNode,
  ProgramNode,
  StmtNode,
  SwitchCaseNode,
  Token,
  TypeNode,
  VarDeclItem,
  VarDeclStmtNode,
} from "./types";
import { createDiagnostic } from "./errors";

const PRIMITIVE_TYPES = new Set([
  "int",
  "long",
  "double",
  "float",
  "boolean",
  "char",
  "byte",
  "short",
  "void",
  "var",
]);

const MODIFIERS = new Set([
  "public",
  "private",
  "protected",
  "static",
  "final",
  "abstract",
]);

export interface ParseResult {
  program: ProgramNode;
  diagnostics: JavaDiagnostic[];
}

export function parseJava(tokens: Token[], initialDiagnostics: JavaDiagnostic[] = []): ParseResult {
  const diagnostics: JavaDiagnostic[] = [...initialDiagnostics];
  let current = 0;

  const peek = (offset = 0): Token => {
    const idx = current + offset;
    return idx < tokens.length ? tokens[idx] : tokens[tokens.length - 1];
  };

  const isAtEnd = (): boolean => peek().type === "EOF";

  const advance = (): Token => {
    if (!isAtEnd()) current++;
    return tokens[current - 1];
  };

  const check = (type: Token["type"], value?: string, offset = 0): boolean => {
    const tok = peek(offset);
    if (tok.type !== type) return false;
    if (value !== undefined && tok.value !== value) return false;
    return true;
  };

  const checkValue = (value: string, offset = 0): boolean => {
    return peek(offset).value === value;
  };

  const matchValue = (...values: string[]): Token | null => {
    const tok = peek();
    if (values.includes(tok.value)) {
      return advance();
    }
    return null;
  };

  const expectValue = (
    value: string,
    message: string,
    japaneseHint: string
  ): Token => {
    if (checkValue(value)) {
      return advance();
    }
    const prev = tokens[Math.max(0, current - 1)];
    const target = value === ";" ? prev : peek();
    diagnostics.push(
      createDiagnostic(
        target.line,
        value === ";" ? target.column + target.value.length : target.column,
        message,
        japaneseHint,
        target.column + Math.max(1, target.value.length)
      )
    );
    return target;
  };

  const expectSemicolon = () => {
    expectValue(
      ";",
      "文の末尾にセミコロン（;）がありません。",
      "セミコロン（;）が抜けている可能性があります。前の行の末尾を確認してください。"
    );
  };

  // package / import 宣言の読み飛ばし（スレッド・ファイルIO等の未対応importはエラー通知）
  const skipPackageAndImports = () => {
    while (!isAtEnd()) {
      if (matchValue("package")) {
        while (!isAtEnd() && !checkValue(";")) advance();
        matchValue(";");
      } else if (matchValue("import")) {
        const importToken = tokens[current - 1];
        let importPath = "";
        while (!isAtEnd() && !checkValue(";")) {
          importPath += advance().value;
        }
        matchValue(";");
        if (
          importPath.startsWith("java.io.File") ||
          importPath.startsWith("java.nio.file") ||
          importPath.startsWith("java.net.") ||
          importPath.startsWith("java.lang.reflect")
        ) {
          diagnostics.push(
            createDiagnostic(
              importToken.line,
              importToken.column,
              `この機能は本カリキュラムでは未対応です（${importToken.line}行目: import ${importPath}）`,
              "ファイル入出力・ネットワーク・リフレクションは本カリキュラムの実行環境では使用できません。"
            )
          );
        }
      } else {
        break;
      }
    }
  };

  // 型（ジェネリクス・配列次元を含む）のパース
  const parseType = (): TypeNode => {
    const tok = advance();
    let baseType = tok.value;

    // パッケージ修飾名 (java.util.List 等) の場合は末尾のクラス名を採用
    while (checkValue(".") && peek(1).type === "IDENTIFIER") {
      advance(); // "."
      baseType = advance().value;
    }

    if (baseType === "float") baseType = "double";
    if (baseType === "short" || baseType === "byte") baseType = "int";

    let typeArgs: TypeNode[] | undefined;
    if (checkValue("<")) {
      advance(); // "<"
      typeArgs = [];
      if (!checkValue(">")) {
        // 다이アモンド演算子 <> 対応
        while (!isAtEnd() && !checkValue(">") && !checkValue(">>") && !checkValue(">>>")) {
          if (checkValue("?")) {
            advance();
            if (matchValue("extends", "super")) {
              parseType();
            }
          } else {
            typeArgs.push(parseType());
          }
          if (!matchValue(",")) break;
        }
      }
      if (checkValue(">")) {
        advance();
      } else if (checkValue(">>")) {
        // ネストしたジェネリクス List<List<Integer>> の末尾 >> を1つ消費
        tokens[current] = { ...peek(), value: ">" };
      }
    }

    let dimensions = 0;
    while (checkValue("[") && checkValue("]", 1)) {
      advance();
      advance();
      dimensions++;
    }

    return { baseType, dimensions, typeArgs };
  };

  // 現在位置が変数宣言の型として始まるかどうかの先読み判定
  const looksLikeTypeAndVarDecl = (): boolean => {
    let idx = current;
    if (tokens[idx]?.value === "final") idx++;
    const first = tokens[idx];
    if (!first) return false;

    if (PRIMITIVE_TYPES.has(first.value)) {
      return true;
    }

    if (first.type !== "IDENTIFIER") return false;

    idx++;
    // java.util.ArrayList などのドット連結
    while (tokens[idx]?.value === "." && tokens[idx + 1]?.type === "IDENTIFIER") {
      idx += 2;
    }

    // ジェネリクス <...>
    if (tokens[idx]?.value === "<") {
      let depth = 0;
      while (idx < tokens.length) {
        const v = tokens[idx].value;
        if (v === "<") depth++;
        else if (v === ">") {
          depth--;
          if (depth <= 0) {
            idx++;
            break;
          }
        } else if (v === ">>") {
          depth -= 2;
          if (depth <= 0) {
            idx++;
            break;
          }
        } else if (v === ";" || v === "{" || v === "}") {
          return false;
        }
        idx++;
      }
    }

    // 配列 []
    while (tokens[idx]?.value === "[" && tokens[idx + 1]?.value === "]") {
      idx += 2;
    }

    // 直後が識別子（変数名）であれば型宣言とみなす
    return tokens[idx]?.type === "IDENTIFIER";
  };

  // クラスまたはインターフェース宣言のパース
  const parseClassOrInterface = (): ClassDeclNode | null => {
    const modifiers: string[] = [];
    while (MODIFIERS.has(peek().value)) {
      modifiers.push(advance().value);
    }

    const isInterface = Boolean(matchValue("interface"));
    if (!isInterface && !matchValue("class")) {
      const badTok = advance();
      diagnostics.push(
        createDiagnostic(
          badTok.line,
          badTok.column,
          `クラス宣言の外に予期しないトークン「${badTok.value}」があります。`,
          "Javaではすべてのプログラムを class の中（波括弧 { } の内側）に記述する必要があります。"
        )
      );
      return null;
    }

    const nameTok = advance();
    const className = nameTok.value;

    // クラス宣言のジェネリクス型パラメータ <T> のスキップ
    if (checkValue("<")) {
      let depth = 0;
      while (!isAtEnd()) {
        const v = advance().value;
        if (v === "<") depth++;
        else if (v === ">") {
          depth--;
          if (depth <= 0) break;
        }
      }
    }

    let superClass: string | null = null;
    const interfaces: string[] = [];

    if (matchValue("extends")) {
      const sup = parseType();
      if (isInterface) {
        interfaces.push(sup.baseType);
      } else {
        superClass = sup.baseType;
      }
    }

    if (matchValue("implements")) {
      do {
        const iface = parseType();
        interfaces.push(iface.baseType);
      } while (matchValue(","));
    }

    expectValue(
      "{",
      `クラス ${className} の開始波括弧 '{' がありません。`,
      "クラス宣言の後ろには '{' が必要です。"
    );

    const fields: FieldDeclNode[] = [];
    const constructors: ConstructorDeclNode[] = [];
    const methods: MethodDeclNode[] = [];

    while (!isAtEnd() && !checkValue("}")) {
      if (matchValue(";")) continue;

      const memberMods: string[] = [];
      while (MODIFIERS.has(peek().value) || peek().value === "default") {
        memberMods.push(advance().value);
      }

      // メンバ先頭にジェネリクス <T> がある場合のスキップ
      if (checkValue("<")) {
        let depth = 0;
        while (!isAtEnd()) {
          const v = advance().value;
          if (v === "<") depth++;
          else if (v === ">") {
            depth--;
            if (depth <= 0) break;
          }
        }
      }

      if (checkValue("}")) break;

      // コンストラクタ判定: クラス名と同名 かつ 直後が '('
      if (peek().value === className && checkValue("(", 1)) {
        const ctorTok = advance();
        advance(); // "("
        const params = parseParameterList();
        expectValue(")", "コンストラクタの引数リストが ')' で閉じられていません。", "引数の後ろに ')' を記述してください。");
        skipThrowsClause();
        const body = parseBlockStmt();
        constructors.push({
          kind: "ConstructorDecl",
          name: className,
          modifiers: memberMods,
          params,
          body,
          line: ctorTok.line,
          column: ctorTok.column,
        });
        continue;
      }

      // 型 + 名前
      const memberType = parseType();
      const memberNameTok = advance();
      const memberName = memberNameTok.value;

      // メソッド宣言
      if (checkValue("(")) {
        advance(); // "("
        const params = parseParameterList();
        expectValue(")", `メソッド ${memberName} の引数リストが ')' で閉じられていません。`, "引数の後ろに ')' を記述してください。");
        skipThrowsClause();

        let body: BlockStmtNode | null = null;
        if (checkValue("{")) {
          body = parseBlockStmt();
        } else {
          expectSemicolon();
        }

        methods.push({
          kind: "MethodDecl",
          modifiers: memberMods,
          returnType: memberType,
          name: memberName,
          params,
          body,
          line: memberNameTok.line,
          column: memberNameTok.column,
        });
      } else {
        // フィールド宣言（カンマ区切り複数宣言・Cスタイル配列 int a[] に対応）
        let extraDims = 0;
        while (checkValue("[") && checkValue("]", 1)) {
          advance();
          advance();
          extraDims++;
        }
        let initializer: ExprNode | null = null;
        if (matchValue("=")) {
          if (checkValue("{")) {
            initializer = parseArrayInitializer();
          } else {
            initializer = parseExpression();
          }
        }
        fields.push({
          kind: "FieldDecl",
          modifiers: memberMods,
          type: {
            ...memberType,
            dimensions: memberType.dimensions + extraDims,
          },
          name: memberName,
          initializer,
          line: memberNameTok.line,
          column: memberNameTok.column,
        });

        while (matchValue(",")) {
          const nextFieldTok = advance();
          let nextDims = 0;
          while (checkValue("[") && checkValue("]", 1)) {
            advance();
            advance();
            nextDims++;
          }
          let nextInit: ExprNode | null = null;
          if (matchValue("=")) {
            nextInit = checkValue("{")
              ? parseArrayInitializer()
              : parseExpression();
          }
          fields.push({
            kind: "FieldDecl",
            modifiers: memberMods,
            type: {
              ...memberType,
              dimensions: memberType.dimensions + nextDims,
            },
            name: nextFieldTok.value,
            initializer: nextInit,
            line: nextFieldTok.line,
            column: nextFieldTok.column,
          });
        }
        expectSemicolon();
      }
    }

    expectValue(
      "}",
      `クラス ${className} の終了波括弧 '}' がありません。`,
      "波括弧 '{' と '}' の対応（数）が合っているか確認してください。"
    );

    return {
      kind: "ClassDecl",
      name: className,
      isInterface,
      isAbstract: isInterface || modifiers.includes("abstract"),
      isPublic: modifiers.includes("public"),
      superClass,
      interfaces,
      fields,
      constructors,
      methods,
      line: nameTok.line,
      column: nameTok.column,
    };
  };

  const skipThrowsClause = () => {
    if (matchValue("throws")) {
      do {
        advance();
      } while (matchValue(","));
    }
  };

  const parseParameterList = (): ParameterNode[] => {
    const params: ParameterNode[] = [];
    if (checkValue(")")) return params;

    do {
      matchValue("final");
      const pType = parseType();
      let isVarArgs = false;
      if (matchValue("...")) {
        isVarArgs = true;
        pType.dimensions += 1;
      }
      const pNameTok = advance();
      while (checkValue("[") && checkValue("]", 1)) {
        advance();
        advance();
        pType.dimensions++;
      }
      params.push({
        type: pType,
        name: pNameTok.value,
        isVarArgs,
      });
    } while (matchValue(","));

    return params;
  };

  // ブロック文 { ... }
  const parseBlockStmt = (): BlockStmtNode => {
    const openTok = expectValue(
      "{",
      "ブロックの開始 '{' が必要です。",
      "波括弧 '{' が抜けていないか確認してください。"
    );
    const statements: StmtNode[] = [];
    while (!isAtEnd() && !checkValue("}")) {
      statements.push(parseStatement());
    }
    expectValue(
      "}",
      "ブロックの終了 '}' がありません。",
      "波括弧 '}' を閉じ忘れていないか確認してください。"
    );
    return {
      kind: "BlockStmt",
      statements,
      line: openTok.line,
      column: openTok.column,
    };
  };

  // 文（Statement）のパース
  const parseStatement = (): StmtNode => {
    const tok = peek();

    if (checkValue("{")) {
      return parseBlockStmt();
    }

    if (matchValue(";")) {
      return { kind: "EmptyStmt", line: tok.line, column: tok.column };
    }

    if (matchValue("if")) {
      expectValue("(", "if の後ろには '(' が必要です。", "if (条件式) の形式で記述してください。");
      const condition = parseExpression();
      expectValue(")", "if の条件式の後ろに ')' がありません。", "条件式を ')' で閉じてください。");
      const thenBranch = parseStatement();
      let elseBranch: StmtNode | null = null;
      if (matchValue("else")) {
        elseBranch = parseStatement();
      }
      return {
        kind: "IfStmt",
        condition,
        thenBranch,
        elseBranch,
        line: tok.line,
        column: tok.column,
      };
    }

    if (matchValue("while")) {
      expectValue("(", "while の後ろには '(' が必要です。", "while (条件式) の形式で記述してください。");
      const condition = parseExpression();
      expectValue(")", "while の条件式の後ろに ')' がありません。", "条件式を ')' で閉じてください。");
      const body = parseStatement();
      return {
        kind: "WhileStmt",
        condition,
        body,
        line: tok.line,
        column: tok.column,
      };
    }

    if (matchValue("do")) {
      const body = parseStatement();
      expectValue("while", "do-while 文に while がありません。", "do { ... } while (条件式); の形式で記述してください。");
      expectValue("(", "while の後ろには '(' が必要です。", "while (条件式); の形式で記述してください。");
      const condition = parseExpression();
      expectValue(")", "while の条件式の後ろに ')' がありません。", "条件式を ')' で閉じてください。");
      expectSemicolon();
      return {
        kind: "DoWhileStmt",
        body,
        condition,
        line: tok.line,
        column: tok.column,
      };
    }

    if (matchValue("for")) {
      expectValue("(", "for の後ろには '(' が必要です。", "for (初期化; 条件; 更新) の形式で記述してください。");

      // 拡張for文 (for (Type var : iterable)) の判定
      const savedPos = current;
      const isEnhancedFor = (() => {
        try {
          matchValue("final");
          if (!looksLikeTypeAndVarDecl()) return false;
          parseType();
          if (peek().type !== "IDENTIFIER") return false;
          advance();
          return checkValue(":");
        } catch {
          return false;
        } finally {
          current = savedPos;
        }
      })();

      if (isEnhancedFor) {
        matchValue("final");
        const varType = parseType();
        const varNameTok = advance();
        expectValue(":", "拡張for文の ':' が必要です。", "for (型 変数名 : 配列やリスト) の形式で記述してください。");
        const iterable = parseExpression();
        expectValue(")", "拡張for文の ')' がありません。", "for文の括弧を ')' で閉じてください。");
        const body = parseStatement();
        return {
          kind: "ForEachStmt",
          varType,
          varName: varNameTok.value,
          iterable,
          body,
          line: tok.line,
          column: tok.column,
        };
      }

      // 通常の for (init; condition; update)
      let init: StmtNode | ExprNode | null = null;
      if (!checkValue(";")) {
        if (looksLikeTypeAndVarDecl()) {
          init = parseVarDeclWithoutSemi();
        } else {
          init = parseExpression();
        }
      }
      expectSemicolon();

      let condition: ExprNode | null = null;
      if (!checkValue(";")) {
        condition = parseExpression();
      }
      expectSemicolon();

      const update: ExprNode[] = [];
      if (!checkValue(")")) {
        do {
          update.push(parseExpression());
        } while (matchValue(","));
      }
      expectValue(")", "for文の ')' がありません。", "for文の括弧を ')' で閉じてください。");

      const body = parseStatement();
      return {
        kind: "ForStmt",
        init,
        condition,
        update,
        body,
        line: tok.line,
        column: tok.column,
      };
    }

    if (matchValue("switch")) {
      expectValue("(", "switch の後ろには '(' が必要です。", "switch (式) の形式で記述してください。");
      const expr = parseExpression();
      expectValue(")", "switch の式の後ろに ')' がありません。", "switch (式) の括弧を閉じてください。");
      expectValue("{", "switch ブロックの '{' がありません。", "switch (式) { case ... } の形式で記述してください。");

      const cases: SwitchCaseNode[] = [];
      while (!isAtEnd() && !checkValue("}")) {
        const caseTok = peek();
        const labels: (ExprNode | null)[] = [];
        let isArrow = false;

        if (matchValue("case")) {
          do {
            labels.push(parseExpression());
          } while (matchValue(","));

          if (matchValue("->")) {
            isArrow = true;
          } else {
            expectValue(":", "case ラベルの後ろに ':' または '->' がありません。", "case 値: または case 値 -> の形式で記述してください。");
          }
        } else if (matchValue("default")) {
          labels.push(null);
          if (matchValue("->")) {
            isArrow = true;
          } else {
            expectValue(":", "default の後ろに ':' または '->' がありません。", "default: の形式で記述してください。");
          }
        } else {
          // 不正なトークンによる無限ループ回避
          advance();
          continue;
        }

        const statements: StmtNode[] = [];
        if (isArrow) {
          if (checkValue("{")) {
            statements.push(parseBlockStmt());
          } else {
            statements.push(parseStatement());
          }
        } else {
          while (
            !isAtEnd() &&
            !checkValue("case") &&
            !checkValue("default") &&
            !checkValue("}")
          ) {
            statements.push(parseStatement());
          }
        }

        cases.push({
          labels,
          isArrow,
          statements,
          line: caseTok.line,
          column: caseTok.column,
        });
      }

      expectValue("}", "switch ブロックの '}' がありません。", "switch文の波括弧 '}' を閉じてください。");
      return {
        kind: "SwitchStmt",
        expr,
        cases,
        line: tok.line,
        column: tok.column,
      };
    }

    if (matchValue("return")) {
      let value: ExprNode | null = null;
      if (!checkValue(";")) {
        value = parseExpression();
      }
      expectSemicolon();
      return {
        kind: "ReturnStmt",
        value,
        line: tok.line,
        column: tok.column,
      };
    }

    if (matchValue("break")) {
      expectSemicolon();
      return { kind: "BreakStmt", line: tok.line, column: tok.column };
    }

    if (matchValue("continue")) {
      expectSemicolon();
      return { kind: "ContinueStmt", line: tok.line, column: tok.column };
    }

    if (matchValue("try")) {
      const tryBlock = parseBlockStmt();
      const catches: CatchClauseNode[] = [];
      while (matchValue("catch")) {
        const catchTok = tokens[current - 1];
        expectValue("(", "catch の後ろに '(' が必要です。", "catch (Exception e) の形式で記述してください。");
        const exceptionTypes: string[] = [];
        do {
          exceptionTypes.push(parseType().baseType);
        } while (matchValue("|"));
        const varNameTok = advance();
        expectValue(")", "catch の後ろに ')' が必要です。", "catch (Exception e) の括弧を閉じてください。");
        const body = parseBlockStmt();
        catches.push({
          exceptionTypes,
          varName: varNameTok.value,
          body,
          line: catchTok.line,
          column: catchTok.column,
        });
      }
      let finallyBlock: BlockStmtNode | null = null;
      if (matchValue("finally")) {
        finallyBlock = parseBlockStmt();
      }
      return {
        kind: "TryStmt",
        tryBlock,
        catches,
        finallyBlock,
        line: tok.line,
        column: tok.column,
      };
    }

    if (matchValue("throw")) {
      const expr = parseExpression();
      expectSemicolon();
      return {
        kind: "ThrowStmt",
        expr,
        line: tok.line,
        column: tok.column,
      };
    }

    // コンストラクタ内の super(...) / this(...) 呼び出し
    if (checkValue("super") && checkValue("(", 1)) {
      advance(); // super
      advance(); // (
      const args = parseArgList();
      expectValue(")", "super(...) の ')' がありません。", "super呼び出しの括弧を閉じてください。");
      expectSemicolon();
      return {
        kind: "SuperConstructorCallStmt",
        args,
        line: tok.line,
        column: tok.column,
      };
    }

    if (checkValue("this") && checkValue("(", 1)) {
      advance(); // this
      advance(); // (
      const args = parseArgList();
      expectValue(")", "this(...) の ')' がありません。", "this呼び出しの括弧を閉じてください。");
      expectSemicolon();
      return {
        kind: "ThisConstructorCallStmt",
        args,
        line: tok.line,
        column: tok.column,
      };
    }

    // ローカル変数宣言
    if (looksLikeTypeAndVarDecl()) {
      const decl = parseVarDeclWithoutSemi();
      expectSemicolon();
      return decl;
    }

    // 式文（メソッド呼び出し、代入、インクリメント等）
    const expr = parseExpression();
    expectSemicolon();
    return {
      kind: "ExprStmt",
      expr,
      line: tok.line,
      column: tok.column,
    };
  };

  const parseVarDeclWithoutSemi = (): VarDeclStmtNode => {
    const startTok = peek();
    const isFinal = Boolean(matchValue("final"));
    const type = parseType();
    const declarations: VarDeclItem[] = [];

    do {
      const nameTok = advance();
      let extraDims = 0;
      while (checkValue("[") && checkValue("]", 1)) {
        advance();
        advance();
        extraDims++;
      }
      let initializer: ExprNode | null = null;
      if (matchValue("=")) {
        if (checkValue("{")) {
          initializer = parseArrayInitializer();
        } else {
          initializer = parseExpression();
        }
      }
      declarations.push({
        name: nameTok.value,
        dimensions: type.dimensions + extraDims,
        initializer,
      });
    } while (matchValue(","));

    return {
      kind: "VarDeclStmt",
      isFinal,
      type,
      declarations,
      line: startTok.line,
      column: startTok.column,
    };
  };

  const parseArrayInitializer = (): ArrayInitializerExprNode => {
    const openTok = expectValue("{", "配列初期化子の '{' が必要です。", "配列の初期値は { 1, 2, 3 } のように記述します。");
    const elements: ExprNode[] = [];
    while (!isAtEnd() && !checkValue("}")) {
      if (checkValue("{")) {
        elements.push(parseArrayInitializer());
      } else {
        elements.push(parseExpression());
      }
      if (!matchValue(",")) break;
    }
    expectValue("}", "配列初期化子の '}' がありません。", "配列初期化子の '}' を閉じてください。");
    return {
      kind: "ArrayInitializerExpr",
      elements,
      line: openTok.line,
      column: openTok.column,
    };
  };

  // ===========================================================================
  // 式（Expressions）の再帰下降パース（優先順位順）
  // ===========================================================================

  const parseExpression = (): ExprNode => {
    // ラムダ式 x -> ... または (x, y) -> ... の先読み判定
    if (isLambdaAhead()) {
      return parseLambda();
    }
    return parseAssignment();
  };

  const isLambdaAhead = (): boolean => {
    if (peek().type === "IDENTIFIER" && checkValue("->", 1)) {
      return true;
    }
    if (checkValue("(")) {
      let idx = current + 1;
      let depth = 1;
      while (idx < tokens.length && depth > 0) {
        if (tokens[idx].value === "(") depth++;
        else if (tokens[idx].value === ")") depth--;
        idx++;
      }
      if (tokens[idx]?.value === "->") return true;
    }
    return false;
  };

  const parseLambda = (): ExprNode => {
    const startTok = peek();
    const paramNames: string[] = [];
    if (matchValue("(")) {
      if (!checkValue(")")) {
        do {
          // 型付きラムダ引数 (int x) -> ... にも対応
          if (
            peek(1).type === "IDENTIFIER" &&
            !checkValue(",", 1) &&
            !checkValue(")", 1)
          ) {
            parseType();
          }
          paramNames.push(advance().value);
        } while (matchValue(","));
      }
      expectValue(")", "ラムダ式の引数 ')' が必要です。", "ラムダ式の引数を ')' で閉じてください。");
    } else {
      paramNames.push(advance().value);
    }

    expectValue("->", "ラムダ式の '->' が必要です。", "引数 -> 処理 の形式で記述してください。");

    const body = checkValue("{") ? parseBlockStmt() : parseExpression();
    return {
      kind: "LambdaExpr",
      paramNames,
      body,
      line: startTok.line,
      column: startTok.column,
    };
  };

  const parseAssignment = (): ExprNode => {
    const left = parseConditional();
    const assignOps = [
      "=",
      "+=",
      "-=",
      "*=",
      "/=",
      "%=",
      "&=",
      "|=",
      "^=",
      "<<=",
      ">>=",
      ">>>=",
    ];
    if (assignOps.includes(peek().value)) {
      const opTok = advance();
      const right = parseAssignment();
      return {
        kind: "AssignExpr",
        operator: opTok.value,
        target: left,
        value: right,
        line: opTok.line,
        column: opTok.column,
      };
    }
    return left;
  };

  const parseConditional = (): ExprNode => {
    const expr = parseLogicalOr();
    if (matchValue("?")) {
      const consequent = parseExpression();
      expectValue(":", "三項演算子 '? :' の ':' がありません。", "条件 ? 真の値 : 偽の値 の形式で記述してください。");
      const alternate = parseConditional();
      return {
        kind: "ConditionalExpr",
        condition: expr,
        consequent,
        alternate,
        line: expr.line,
        column: expr.column,
      };
    }
    return expr;
  };

  const parseLogicalOr = (): ExprNode => {
    let left = parseLogicalAnd();
    while (matchValue("||")) {
      const op = tokens[current - 1];
      const right = parseLogicalAnd();
      left = {
        kind: "BinaryExpr",
        operator: op.value,
        left,
        right,
        line: op.line,
        column: op.column,
      };
    }
    return left;
  };

  const parseLogicalAnd = (): ExprNode => {
    let left = parseBitwiseOr();
    while (matchValue("&&")) {
      const op = tokens[current - 1];
      const right = parseBitwiseOr();
      left = {
        kind: "BinaryExpr",
        operator: op.value,
        left,
        right,
        line: op.line,
        column: op.column,
      };
    }
    return left;
  };

  const parseBitwiseOr = (): ExprNode => {
    let left = parseBitwiseXor();
    while (matchValue("|")) {
      const op = tokens[current - 1];
      const right = parseBitwiseXor();
      left = {
        kind: "BinaryExpr",
        operator: op.value,
        left,
        right,
        line: op.line,
        column: op.column,
      };
    }
    return left;
  };

  const parseBitwiseXor = (): ExprNode => {
    let left = parseBitwiseAnd();
    while (matchValue("^")) {
      const op = tokens[current - 1];
      const right = parseBitwiseAnd();
      left = {
        kind: "BinaryExpr",
        operator: op.value,
        left,
        right,
        line: op.line,
        column: op.column,
      };
    }
    return left;
  };

  const parseBitwiseAnd = (): ExprNode => {
    let left = parseEquality();
    while (matchValue("&")) {
      const op = tokens[current - 1];
      const right = parseEquality();
      left = {
        kind: "BinaryExpr",
        operator: op.value,
        left,
        right,
        line: op.line,
        column: op.column,
      };
    }
    return left;
  };

  const parseEquality = (): ExprNode => {
    let left = parseRelational();
    while (matchValue("==", "!=")) {
      const op = tokens[current - 1];
      const right = parseRelational();
      left = {
        kind: "BinaryExpr",
        operator: op.value,
        left,
        right,
        line: op.line,
        column: op.column,
      };
    }
    return left;
  };

  const parseRelational = (): ExprNode => {
    let left = parseShift();
    while (true) {
      if (matchValue("<", ">", "<=", ">=")) {
        const op = tokens[current - 1];
        const right = parseShift();
        left = {
          kind: "BinaryExpr",
          operator: op.value,
          left,
          right,
          line: op.line,
          column: op.column,
        };
      } else if (matchValue("instanceof")) {
        const op = tokens[current - 1];
        const checkType = parseType();
        left = {
          kind: "InstanceOfExpr",
          expr: left,
          checkType,
          line: op.line,
          column: op.column,
        };
      } else {
        break;
      }
    }
    return left;
  };

  const parseShift = (): ExprNode => {
    let left = parseAdditive();
    while (matchValue("<<", ">>", ">>>")) {
      const op = tokens[current - 1];
      const right = parseAdditive();
      left = {
        kind: "BinaryExpr",
        operator: op.value,
        left,
        right,
        line: op.line,
        column: op.column,
      };
    }
    return left;
  };

  const parseAdditive = (): ExprNode => {
    let left = parseMultiplicative();
    while (matchValue("+", "-")) {
      const op = tokens[current - 1];
      const right = parseMultiplicative();
      left = {
        kind: "BinaryExpr",
        operator: op.value,
        left,
        right,
        line: op.line,
        column: op.column,
      };
    }
    return left;
  };

  const parseMultiplicative = (): ExprNode => {
    let left = parseUnary();
    while (matchValue("*", "/", "%")) {
      const op = tokens[current - 1];
      const right = parseUnary();
      left = {
        kind: "BinaryExpr",
        operator: op.value,
        left,
        right,
        line: op.line,
        column: op.column,
      };
    }
    return left;
  };

  const parseUnary = (): ExprNode => {
    if (matchValue("++", "--")) {
      const op = tokens[current - 1];
      const operand = parseUnary();
      return {
        kind: "UpdateExpr",
        operator: op.value as "++" | "--",
        prefix: true,
        operand,
        line: op.line,
        column: op.column,
      };
    }

    if (matchValue("+", "-", "!", "~")) {
      const op = tokens[current - 1];
      const operand = parseUnary();
      return {
        kind: "UnaryExpr",
        operator: op.value,
        operand,
        line: op.line,
        column: op.column,
      };
    }

    // 型キャスト (int) x, (double) x, (CustomClass) obj の判定
    if (checkValue("(") && isCastAhead()) {
      const openTok = advance(); // "("
      const targetType = parseType();
      expectValue(")", "キャスト式の ')' がありません。", "(型名) 値 の形式で記述してください。");
      const expr = parseUnary();
      return {
        kind: "CastExpr",
        targetType,
        expr,
        line: openTok.line,
        column: openTok.column,
      };
    }

    return parsePostfix();
  };

  const isCastAhead = (): boolean => {
    const t1 = peek(1);
    const t2 = peek(2);
    if (!t1 || !t2) return false;
    // プリミティブ型のキャスト: (int) ...
    if (PRIMITIVE_TYPES.has(t1.value) && t2.value === ")") {
      return true;
    }
    // クラス型のキャスト: (String) expr / (Animal) obj
    if (t1.type === "IDENTIFIER" && t2.value === ")") {
      const t3 = peek(3);
      if (!t3) return false;
      // 直後が式の開始トークンかつ二項演算子でない場合
      if (
        t3.type === "IDENTIFIER" ||
        t3.type === "INT_LITERAL" ||
        t3.type === "DOUBLE_LITERAL" ||
        t3.type === "STRING_LITERAL" ||
        t3.value === "(" ||
        t3.value === "this" ||
        t3.value === "new"
      ) {
        return true;
      }
    }
    return false;
  };

  const parsePostfix = (): ExprNode => {
    let expr = parsePrimary();

    while (true) {
      if (matchValue(".")) {
        const propTok = advance();
        if (checkValue("(")) {
          advance(); // "("
          const args = parseArgList();
          expectValue(
            ")",
            `メソッド ${propTok.value} の呼び出しに ')' がありません。`,
            "メソッド呼び出しの括弧 ')' を閉じてください。"
          );
          expr = {
            kind: "CallExpr",
            callee: expr,
            methodName: propTok.value,
            args,
            line: propTok.line,
            column: propTok.column,
          };
        } else {
          expr = {
            kind: "MemberExpr",
            object: expr,
            property: propTok.value,
            line: propTok.line,
            column: propTok.column,
          };
        }
      } else if (matchValue("[")) {
        const bracketTok = tokens[current - 1];
        const index = parseExpression();
        expectValue("]", "配列アクセスの ']' がありません。", "配列の添字は array[i] のように ']' で閉じてください。");
        expr = {
          kind: "ArrayAccessExpr",
          array: expr,
          index,
          line: bracketTok.line,
          column: bracketTok.column,
        };
      } else if (matchValue("++", "--")) {
        const op = tokens[current - 1];
        expr = {
          kind: "UpdateExpr",
          operator: op.value as "++" | "--",
          prefix: false,
          operand: expr,
          line: op.line,
          column: op.column,
        };
      } else {
        break;
      }
    }

    return expr;
  };

  const parsePrimary = (): ExprNode => {
    const tok = peek();

    if (tok.type === "INT_LITERAL") {
      advance();
      const val = tok.value.startsWith("0x")
        ? parseInt(tok.value, 16)
        : parseInt(tok.value, 10);
      return {
        kind: "LiteralExpr",
        literalType: "int",
        value: val,
        line: tok.line,
        column: tok.column,
      };
    }

    if (tok.type === "LONG_LITERAL") {
      advance();
      return {
        kind: "LiteralExpr",
        literalType: "long",
        value: parseInt(tok.value, 10),
        line: tok.line,
        column: tok.column,
      };
    }

    if (tok.type === "DOUBLE_LITERAL") {
      advance();
      return {
        kind: "LiteralExpr",
        literalType: "double",
        value: parseFloat(tok.value),
        line: tok.line,
        column: tok.column,
      };
    }

    if (tok.type === "BOOLEAN_LITERAL") {
      advance();
      return {
        kind: "LiteralExpr",
        literalType: "boolean",
        value: tok.value === "true",
        line: tok.line,
        column: tok.column,
      };
    }

    if (tok.type === "CHAR_LITERAL") {
      advance();
      return {
        kind: "LiteralExpr",
        literalType: "char",
        value: tok.value,
        line: tok.line,
        column: tok.column,
      };
    }

    if (tok.type === "STRING_LITERAL") {
      advance();
      return {
        kind: "LiteralExpr",
        literalType: "String",
        value: tok.value,
        line: tok.line,
        column: tok.column,
      };
    }

    if (tok.type === "NULL_LITERAL") {
      advance();
      return {
        kind: "LiteralExpr",
        literalType: "null",
        value: null,
        line: tok.line,
        column: tok.column,
      };
    }

    if (matchValue("this")) {
      return { kind: "ThisExpr", line: tok.line, column: tok.column };
    }

    if (matchValue("super")) {
      return { kind: "SuperExpr", line: tok.line, column: tok.column };
    }

    if (matchValue("new")) {
      const baseTok = advance();
      let baseType = baseTok.value;
      while (checkValue(".") && peek(1).type === "IDENTIFIER") {
        advance();
        baseType = advance().value;
      }

      // ジェネリクス型引数 new ArrayList<String>() または new ArrayList<>()
      if (checkValue("<")) {
        let depth = 0;
        while (!isAtEnd()) {
          const v = advance().value;
          if (v === "<") depth++;
          else if (v === ">") {
            depth--;
            if (depth <= 0) break;
          } else if (v === ">>") {
            depth -= 2;
            if (depth <= 0) break;
          }
        }
      }

      // 配列生成 new int[5] または new int[]{1, 2, 3}
      if (checkValue("[")) {
        const sizeExprs: (ExprNode | null)[] = [];
        let dimensions = 0;
        while (matchValue("[")) {
          dimensions++;
          if (checkValue("]")) {
            sizeExprs.push(null);
            advance();
          } else {
            sizeExprs.push(parseExpression());
            expectValue("]", "配列サイズ指定の ']' がありません。", "new 型[サイズ] の形式で ']' を閉じてください。");
          }
        }
        let initializer: ArrayInitializerExprNode | null = null;
        if (checkValue("{")) {
          initializer = parseArrayInitializer();
        }
        return {
          kind: "NewArrayExpr",
          elementType: { baseType, dimensions },
          sizeExprs,
          initializer,
          line: tok.line,
          column: tok.column,
        };
      }

      // インスタンス生成 new ClassName(args)
      expectValue("(", `new ${baseType} の後ろに '(' が必要です。`, "インスタンス生成は new クラス名(...) の形式で記述します。");
      const args = parseArgList();
      expectValue(")", `new ${baseType}(...) の ')' がありません。`, "コンストラクタ引数の ')' を閉じてください。");

      return {
        kind: "NewObjectExpr",
        type: { baseType, dimensions: 0 },
        args,
        line: tok.line,
        column: tok.column,
      };
    }

    if (matchValue("(")) {
      const expr = parseExpression();
      expectValue(")", "括弧 '(' に対応する ')' がありません。", "丸括弧 '(' と ')' の数が合っているか確認してください。");
      return expr;
    }

    if (tok.type === "IDENTIFIER" || tok.type === "KEYWORD") {
      const idTok = advance();
      if (checkValue("(")) {
        advance(); // "("
        const args = parseArgList();
        expectValue(")", `メソッド ${idTok.value} の呼び出しに ')' がありません。`, "メソッド呼び出しの ')' を閉じてください。");
        return {
          kind: "CallExpr",
          callee: null,
          methodName: idTok.value,
          args,
          line: idTok.line,
          column: idTok.column,
        };
      }
      return {
        kind: "IdentifierExpr",
        name: idTok.value,
        line: idTok.line,
        column: idTok.column,
      };
    }

    // 予期しないトークン
    const badTok = advance();
    diagnostics.push(
      createDiagnostic(
        badTok.line,
        badTok.column,
        `構文エラー：予期しないトークン「${badTok.value}」です。`,
        "記号やキーワードの使い方に誤りがないか確認してください。"
      )
    );
    return {
      kind: "LiteralExpr",
      literalType: "null",
      value: null,
      line: badTok.line,
      column: badTok.column,
    };
  };

  const parseArgList = (): ExprNode[] => {
    const args: ExprNode[] = [];
    if (checkValue(")")) return args;
    do {
      args.push(parseExpression());
    } while (matchValue(","));
    return args;
  };

  // ===========================================================================
  // プログラム全体のエントリポイント
  // ===========================================================================
  skipPackageAndImports();

  const classes: ClassDeclNode[] = [];
  while (!isAtEnd()) {
    if (matchValue(";")) continue;
    const cls = parseClassOrInterface();
    if (cls) {
      classes.push(cls);
    } else {
      // エラー回復：次の class キーワードまたは末尾まで進める
      while (!isAtEnd() && !checkValue("class") && !checkValue("public") && !checkValue("abstract") && !checkValue("interface")) {
        advance();
      }
    }
  }

  return {
    program: { kind: "Program", classes },
    diagnostics,
  };
}
