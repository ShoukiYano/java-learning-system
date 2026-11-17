// =============================================================================
// 自作Javaインタプリタ：意味チェック（Semantic Analyzer）
// ・Mainクラス / mainメソッドの存在確認
// ・未宣言変数の検出（行番号・列番号・日本語補足）
// ・基本的な型の不一致（例: int x = "abc";）の検出
// ・abstract メソッドの実装チェック
// =============================================================================

import {
  BlockStmtNode,
  ClassDeclNode,
  ExprNode,
  JavaDiagnostic,
  ProgramNode,
  StmtNode,
  TypeNode,
} from "./types";
import { createDiagnostic } from "./errors";

const BUILTIN_GLOBAL_IDENTIFIERS = new Set([
  "System",
  "Math",
  "Integer",
  "Long",
  "Double",
  "Boolean",
  "Character",
  "String",
  "StringBuilder",
  "Arrays",
  "Collections",
  "Scanner",
  "ArrayList",
  "List",
  "HashMap",
  "Map",
  "HashSet",
  "Set",
  "Object",
  "Exception",
  "RuntimeException",
  "ArithmeticException",
  "ArrayIndexOutOfBoundsException",
  "IndexOutOfBoundsException",
  "NullPointerException",
  "NumberFormatException",
  "IllegalArgumentException",
  "IllegalStateException",
]);

function isNumericType(t: string): boolean {
  return (
    t === "int" ||
    t === "long" ||
    t === "double" ||
    t === "float" ||
    t === "short" ||
    t === "byte" ||
    t === "char" ||
    t === "Integer" ||
    t === "Long" ||
    t === "Double"
  );
}

export function analyzeProgram(program: ProgramNode): JavaDiagnostic[] {
  const diagnostics: JavaDiagnostic[] = [];

  if (program.classes.length === 0) {
    diagnostics.push(
      createDiagnostic(
        1,
        1,
        "クラス宣言が見つかりません。",
        "public class Main { public static void main(String[] args) { ... } } の形式でクラスを定義してください。"
      )
    );
    return diagnostics;
  }

  const classMap = new Map<string, ClassDeclNode>();
  for (const cls of program.classes) {
    classMap.set(cls.name, cls);
  }

  // main メソッドを持つクラスが存在するかチェック
  const hasMain = program.classes.some((cls) =>
    cls.methods.some(
      (m) =>
        m.name === "main" &&
        m.modifiers.includes("static")
    )
  );

  if (!hasMain) {
    const firstClass = program.classes[0];
    diagnostics.push(
      createDiagnostic(
        firstClass.line,
        firstClass.column,
        "実行開始地点となる public static void main(String[] args) メソッドが見つかりません。",
        "プログラムを実行するには public static void main(String[] args) メソッドが必要です。"
      )
    );
  }

  // クラスごとの変数・型チェック
  for (const cls of program.classes) {
    // 親クラス・自クラスのフィールドを収集
    const collectClassFields = (c: ClassDeclNode | undefined): Map<string, TypeNode> => {
      const map = new Map<string, TypeNode>();
      if (!c) return map;
      if (c.superClass && classMap.has(c.superClass)) {
        for (const [k, v] of collectClassFields(classMap.get(c.superClass))) {
          map.set(k, v);
        }
      }
      for (const f of c.fields) {
        map.set(f.name, f.type);
      }
      return map;
    };

    const fieldScopes = collectClassFields(cls);

    // 具象クラスが abstract クラスや interface を継承・実装している場合、未実装の抽象メソッドがないか確認
    if (!cls.isAbstract && !cls.isInterface) {
      const implementedMethods = new Set<string>();
      let curr: ClassDeclNode | undefined = cls;
      while (curr) {
        for (const m of curr.methods) {
          if (m.body !== null) {
            implementedMethods.add(m.name);
          }
        }
        curr = curr.superClass ? classMap.get(curr.superClass) : undefined;
      }

      if (cls.superClass && classMap.has(cls.superClass)) {
        const sup = classMap.get(cls.superClass)!;
        for (const m of sup.methods) {
          if (m.modifiers.includes("abstract") && !implementedMethods.has(m.name)) {
            diagnostics.push(
              createDiagnostic(
                cls.line,
                cls.column,
                `クラス ${cls.name} は抽象メソッド ${m.name}() を実装していません。`,
                `親クラス ${sup.name} の abstract メソッド「${m.name}」をオーバーライドして実装してください。`
              )
            );
          }
        }
      }

      for (const ifaceName of cls.interfaces) {
        const iface = classMap.get(ifaceName);
        if (iface) {
          for (const m of iface.methods) {
            if (m.body === null && !implementedMethods.has(m.name)) {
              diagnostics.push(
                createDiagnostic(
                  cls.line,
                  cls.column,
                  `クラス ${cls.name} はインターフェース ${ifaceName} のメソッド ${m.name}() を実装していません。`,
                  `implements ${ifaceName} で指定されたメソッド「${m.name}」を実装してください。`
                )
              );
            }
          }
        }
      }
    }

    // コンストラクタとメソッド内のスコープチェック
    for (const ctor of cls.constructors) {
      const scope = new Map<string, TypeNode>(fieldScopes);
      for (const p of ctor.params) {
        scope.set(p.name, p.type);
      }
      checkBlock(ctor.body, scope, classMap, diagnostics, null);
    }

    for (const method of cls.methods) {
      if (!method.body) continue;
      const scope = new Map<string, TypeNode>(fieldScopes);
      for (const p of method.params) {
        scope.set(p.name, p.type);
      }
      checkBlock(method.body, scope, classMap, diagnostics, method.returnType);
    }
  }

  return diagnostics;
}

function checkBlock(
  block: BlockStmtNode,
  parentScope: Map<string, TypeNode>,
  classMap: Map<string, ClassDeclNode>,
  diagnostics: JavaDiagnostic[],
  returnType: TypeNode | null
) {
  const scope = new Map<string, TypeNode>(parentScope);
  for (const stmt of block.statements) {
    checkStmt(stmt, scope, classMap, diagnostics, returnType);
  }
}

function checkStmt(
  stmt: StmtNode,
  scope: Map<string, TypeNode>,
  classMap: Map<string, ClassDeclNode>,
  diagnostics: JavaDiagnostic[],
  returnType: TypeNode | null
) {
  switch (stmt.kind) {
    case "BlockStmt":
      checkBlock(stmt, scope, classMap, diagnostics, returnType);
      break;

    case "VarDeclStmt": {
      for (const decl of stmt.declarations) {
        const varType: TypeNode = {
          ...stmt.type,
          dimensions: decl.dimensions,
        };
        if (decl.initializer) {
          checkExpr(decl.initializer, scope, classMap, diagnostics);
          const initType = inferSimpleExprType(decl.initializer, scope);
          if (initType && !isAssignable(varType, initType, classMap)) {
            diagnostics.push(
              createDiagnostic(
                stmt.line,
                stmt.column,
                `型の不一致：${formatType(initType)} を ${formatType(varType)} 型の変数「${decl.name}」に代入できません。`,
                `変数「${decl.name}」の型（${formatType(varType)}）と代入する値の型（${formatType(initType)}）が一致しているか確認してください。`
              )
            );
          }
        }
        scope.set(decl.name, varType);
      }
      break;
    }

    case "ExprStmt":
      checkExpr(stmt.expr, scope, classMap, diagnostics);
      break;

    case "IfStmt":
      checkExpr(stmt.condition, scope, classMap, diagnostics);
      checkStmt(stmt.thenBranch, new Map(scope), classMap, diagnostics, returnType);
      if (stmt.elseBranch) {
        checkStmt(stmt.elseBranch, new Map(scope), classMap, diagnostics, returnType);
      }
      break;

    case "WhileStmt":
      checkExpr(stmt.condition, scope, classMap, diagnostics);
      checkStmt(stmt.body, new Map(scope), classMap, diagnostics, returnType);
      break;

    case "DoWhileStmt":
      checkStmt(stmt.body, new Map(scope), classMap, diagnostics, returnType);
      checkExpr(stmt.condition, scope, classMap, diagnostics);
      break;

    case "ForStmt": {
      const forScope = new Map(scope);
      if (stmt.init) {
        if ("kind" in stmt.init && stmt.init.kind === "VarDeclStmt") {
          checkStmt(stmt.init, forScope, classMap, diagnostics, returnType);
        } else {
          checkExpr(stmt.init as ExprNode, forScope, classMap, diagnostics);
        }
      }
      if (stmt.condition) {
        checkExpr(stmt.condition, forScope, classMap, diagnostics);
      }
      for (const u of stmt.update) {
        checkExpr(u, forScope, classMap, diagnostics);
      }
      checkStmt(stmt.body, forScope, classMap, diagnostics, returnType);
      break;
    }

    case "ForEachStmt": {
      checkExpr(stmt.iterable, scope, classMap, diagnostics);
      const forScope = new Map(scope);
      forScope.set(stmt.varName, stmt.varType);
      checkStmt(stmt.body, forScope, classMap, diagnostics, returnType);
      break;
    }

    case "SwitchStmt": {
      checkExpr(stmt.expr, scope, classMap, diagnostics);
      const switchScope = new Map(scope);
      for (const c of stmt.cases) {
        for (const l of c.labels) {
          if (l) checkExpr(l, switchScope, classMap, diagnostics);
        }
        for (const s of c.statements) {
          checkStmt(s, switchScope, classMap, diagnostics, returnType);
        }
      }
      break;
    }

    case "ReturnStmt": {
      if (stmt.value) {
        checkExpr(stmt.value, scope, classMap, diagnostics);
        if (returnType && returnType.baseType === "void") {
          diagnostics.push(
            createDiagnostic(
              stmt.line,
              stmt.column,
              "戻り値が void のメソッドから値を返すことはできません。",
              "void メソッドでは return; のみ記述するか、メソッドの戻り値型を変更してください。"
            )
          );
        } else if (returnType) {
          const valType = inferSimpleExprType(stmt.value, scope);
          if (valType && !isAssignable(returnType, valType, classMap)) {
            diagnostics.push(
              createDiagnostic(
                stmt.line,
                stmt.column,
                `型の不一致：戻り値の型 ${formatType(returnType)} に対して ${formatType(valType)} を返しています。`,
                `メソッドの宣言された戻り値型（${formatType(returnType)}）と return する値の型を合わせてください。`
              )
            );
          }
        }
      } else if (returnType && returnType.baseType !== "void") {
        diagnostics.push(
          createDiagnostic(
            stmt.line,
            stmt.column,
            `戻り値が必要です（${formatType(returnType)} 型の値を返してください）。`,
            "return の後ろに返す値を記述してください。"
          )
        );
      }
      break;
    }

    case "TryStmt": {
      checkBlock(stmt.tryBlock, scope, classMap, diagnostics, returnType);
      for (const c of stmt.catches) {
        const catchScope = new Map(scope);
        catchScope.set(c.varName, {
          baseType: c.exceptionTypes[0] || "Exception",
          dimensions: 0,
        });
        checkBlock(c.body, catchScope, classMap, diagnostics, returnType);
      }
      if (stmt.finallyBlock) {
        checkBlock(stmt.finallyBlock, scope, classMap, diagnostics, returnType);
      }
      break;
    }

    case "ThrowStmt":
      checkExpr(stmt.expr, scope, classMap, diagnostics);
      break;

    case "SuperConstructorCallStmt":
    case "ThisConstructorCallStmt":
      for (const a of stmt.args) {
        checkExpr(a, scope, classMap, diagnostics);
      }
      break;
  }
}

function checkExpr(
  expr: ExprNode,
  scope: Map<string, TypeNode>,
  classMap: Map<string, ClassDeclNode>,
  diagnostics: JavaDiagnostic[]
) {
  switch (expr.kind) {
    case "IdentifierExpr": {
      if (
        !scope.has(expr.name) &&
        !classMap.has(expr.name) &&
        !BUILTIN_GLOBAL_IDENTIFIERS.has(expr.name)
      ) {
        diagnostics.push(
          createDiagnostic(
            expr.line,
            expr.column,
            `未宣言の変数または識別子「${expr.name}」が使用されています。`,
            `変数「${expr.name}」を使う前に型を指定して宣言しているか、スペルミス（大文字・小文字の違い）がないか確認してください。`,
            expr.column + expr.name.length
          )
        );
      }
      break;
    }

    case "BinaryExpr":
      checkExpr(expr.left, scope, classMap, diagnostics);
      checkExpr(expr.right, scope, classMap, diagnostics);
      break;

    case "UnaryExpr":
    case "UpdateExpr":
      checkExpr(expr.operand, scope, classMap, diagnostics);
      break;

    case "AssignExpr": {
      checkExpr(expr.target, scope, classMap, diagnostics);
      checkExpr(expr.value, scope, classMap, diagnostics);
      if (expr.operator === "=") {
        const targetType = inferSimpleExprType(expr.target, scope);
        const valueType = inferSimpleExprType(expr.value, scope);
        if (
          targetType &&
          valueType &&
          !isAssignable(targetType, valueType, classMap)
        ) {
          diagnostics.push(
            createDiagnostic(
              expr.line,
              expr.column,
              `型の不一致：${formatType(valueType)} を ${formatType(targetType)} 型に代入できません。`,
              "代入先の変数の型と代入する値の型が合っているか確認してください。"
            )
          );
        }
      }
      break;
    }

    case "ConditionalExpr":
      checkExpr(expr.condition, scope, classMap, diagnostics);
      checkExpr(expr.consequent, scope, classMap, diagnostics);
      checkExpr(expr.alternate, scope, classMap, diagnostics);
      break;

    case "CallExpr":
      if (expr.callee) {
        checkExpr(expr.callee, scope, classMap, diagnostics);
      }
      for (const a of expr.args) {
        checkExpr(a, scope, classMap, diagnostics);
      }
      break;

    case "MemberExpr":
      checkExpr(expr.object, scope, classMap, diagnostics);
      break;

    case "ArrayAccessExpr":
      checkExpr(expr.array, scope, classMap, diagnostics);
      checkExpr(expr.index, scope, classMap, diagnostics);
      break;

    case "NewObjectExpr":
      for (const a of expr.args) {
        checkExpr(a, scope, classMap, diagnostics);
      }
      break;

    case "NewArrayExpr":
      for (const s of expr.sizeExprs) {
        if (s) checkExpr(s, scope, classMap, diagnostics);
      }
      if (expr.initializer) {
        checkExpr(expr.initializer, scope, classMap, diagnostics);
      }
      break;

    case "ArrayInitializerExpr":
      for (const e of expr.elements) {
        checkExpr(e, scope, classMap, diagnostics);
      }
      break;

    case "CastExpr":
    case "InstanceOfExpr":
      checkExpr(expr.expr, scope, classMap, diagnostics);
      break;

    case "LambdaExpr": {
      const lambdaScope = new Map(scope);
      for (const p of expr.paramNames) {
        lambdaScope.set(p, { baseType: "var", dimensions: 0 });
      }
      if (expr.body.kind === "BlockStmt") {
        checkBlock(expr.body, lambdaScope, classMap, diagnostics, null);
      } else {
        checkExpr(expr.body, lambdaScope, classMap, diagnostics);
      }
      break;
    }
  }
}

function inferSimpleExprType(
  expr: ExprNode,
  scope: Map<string, TypeNode>
): TypeNode | null {
  switch (expr.kind) {
    case "LiteralExpr":
      return { baseType: expr.literalType, dimensions: 0 };
    case "IdentifierExpr":
      return scope.get(expr.name) || null;
    case "NewObjectExpr":
      return expr.type;
    case "NewArrayExpr":
      return expr.elementType;
    default:
      return null;
  }
}

function isAssignable(
  target: TypeNode,
  source: TypeNode,
  classMap: Map<string, ClassDeclNode>
): boolean {
  if (target.baseType === "var" || source.baseType === "var") return true;
  if (target.baseType === "Object") return true;
  if (source.baseType === "null") {
    return (
      target.dimensions > 0 ||
      !["int", "long", "double", "boolean", "char"].includes(target.baseType)
    );
  }
  if (target.dimensions !== source.dimensions) return false;
  if (target.baseType === source.baseType) return true;

  // 数値型のワイドニング変換 (int -> long, int -> double, char -> int 等)
  if (target.baseType === "double" && isNumericType(source.baseType)) {
    return true;
  }
  if (
    target.baseType === "long" &&
    (source.baseType === "int" || source.baseType === "char" || source.baseType === "Integer")
  ) {
    return true;
  }
  if (
    target.baseType === "int" &&
    (source.baseType === "char" || source.baseType === "Integer")
  ) {
    return true;
  }
  // オートボクシング
  const boxMap: Record<string, string> = {
    int: "Integer",
    long: "Long",
    double: "Double",
    boolean: "Boolean",
    char: "Character",
  };
  if (
    boxMap[target.baseType] === source.baseType ||
    boxMap[source.baseType] === target.baseType
  ) {
    return true;
  }

  // コレクションインターフェース互換 (List <- ArrayList, Map <- HashMap, Set <- HashSet)
  if (target.baseType === "List" && source.baseType === "ArrayList") return true;
  if (target.baseType === "Map" && source.baseType === "HashMap") return true;
  if (target.baseType === "Set" && source.baseType === "HashSet") return true;

  // クラスの継承・インターフェース実装関係チェック
  let curr = classMap.get(source.baseType);
  while (curr) {
    if (curr.name === target.baseType) return true;
    if (curr.interfaces.includes(target.baseType)) return true;
    curr = curr.superClass ? classMap.get(curr.superClass) : undefined;
  }

  return false;
}

function formatType(t: TypeNode): string {
  return t.baseType + "[]".repeat(t.dimensions);
}
