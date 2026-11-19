// =============================================================================
// 自作Javaインタプリタ：ツリーウォーキング評価器（Evaluator）
// ブラウザ（Web Worker）および Node.js（Route Handler）の両方で同一コードとして動作
// =============================================================================

import {
  ArrayInitializerExprNode,
  BlockStmtNode,
  ClassDeclNode,
  ConstructorDeclNode,
  ExprNode,
  JavaExecutionOptions,
  JavaExecutionResult,
  LambdaExprNode,
  MethodDeclNode,
  ProgramNode,
  StmtNode,
  TypeNode,
} from "./types";
import { getRuntimeExceptionHint } from "./errors";

// --- 実行時内部シグナル ---
class ReturnSignal {
  constructor(public value: JavaValue) {}
}

class BreakSignal {}

class ContinueSignal {}

export class JavaExceptionSignal {
  constructor(
    public exceptionClass: string,
    public message: string,
    public line: number,
    public customInstance: JavaObjectInstance | null = null
  ) {}
}

class StepLimitSignal {
  constructor(public line: number) {}
}

class OutputLimitSignal {
  constructor(public line: number) {}
}

// --- Java実行時値表現 ---
export type JavaValue =
  | number
  | boolean
  | string
  | null
  | JavaArrayInstance
  | JavaObjectInstance
  | JavaBuiltinInstance
  | JavaLambdaInstance
  | JavaStaticClassRef;

export interface JavaArrayInstance {
  kind: "JavaArray";
  elementType: string;
  dimensions: number;
  elements: JavaValue[];
}

export interface JavaObjectInstance {
  kind: "JavaObject";
  className: string;
  fields: Map<string, JavaValue>;
}

export interface JavaBuiltinInstance {
  kind: "JavaBuiltin";
  className: "Scanner" | "StringBuilder" | "ArrayList" | "HashMap" | "HashSet";
  state: unknown;
}

export interface JavaLambdaInstance {
  kind: "JavaLambda";
  node: LambdaExprNode;
  capturedEnv: Environment;
  thisRef: JavaObjectInstance | null;
  currentClass: string;
}

export interface JavaStaticClassRef {
  kind: "JavaStaticClass";
  className: string;
}

interface ScannerState {
  raw: string;
  pos: number;
}

// --- 変数スコープ環境 ---
class Environment {
  private values = new Map<string, JavaValue>();
  private types = new Map<string, TypeNode>();

  constructor(public parent: Environment | null = null) {}

  define(name: string, value: JavaValue, type?: TypeNode) {
    this.values.set(name, value);
    if (type) this.types.set(name, type);
  }

  has(name: string): boolean {
    if (this.values.has(name)) return true;
    return this.parent ? this.parent.has(name) : false;
  }

  get(name: string): JavaValue {
    if (this.values.has(name)) {
      return this.values.get(name)!;
    }
    if (this.parent) {
      return this.parent.get(name);
    }
    throw new Error(`Undefined variable: ${name}`);
  }

  getType(name: string): TypeNode | undefined {
    if (this.types.has(name)) return this.types.get(name);
    return this.parent?.getType(name);
  }

  assign(name: string, value: JavaValue): boolean {
    if (this.values.has(name)) {
      const targetType = this.types.get(name);
      this.values.set(
        name,
        targetType ? coerceToType(value, targetType) : value
      );
      return true;
    }
    if (this.parent) {
      return this.parent.assign(name, value);
    }
    return false;
  }
}

function defaultValueForType(type: TypeNode): JavaValue {
  if (type.dimensions > 0) return null;
  switch (type.baseType) {
    case "int":
    case "long":
    case "short":
    case "byte":
      return 0;
    case "double":
    case "float":
      return 0.0;
    case "boolean":
      return false;
    case "char":
      return "\0";
    default:
      return null;
  }
}

function coerceToType(val: JavaValue, type: TypeNode): JavaValue {
  if (val === null || type.dimensions > 0) return val;
  if (type.baseType === "int" || type.baseType === "long") {
    if (typeof val === "number") return Math.trunc(val);
    if (typeof val === "string" && val.length === 1) return val.charCodeAt(0);
  }
  if (type.baseType === "double") {
    if (typeof val === "number") return val;
    if (typeof val === "string" && val.length === 1) return val.charCodeAt(0);
  }
  if (type.baseType === "char") {
    if (typeof val === "number") return String.fromCharCode(val);
  }
  return val;
}

// printf / String.format 用のフォーマッタ実装
function formatJavaString(formatStr: string, args: JavaValue[], stringify: (v: JavaValue) => string): string {
  let argIdx = 0;
  return formatStr.replace(/%(-?\d+)?(?:\.(\d+))?([dfsxcbn%])/g, (match, widthStr, precStr, spec) => {
    if (spec === "%") return "%";
    if (spec === "n") return "\n";
    const arg = args[argIdx++];
    let formatted = "";

    switch (spec) {
      case "d": {
        const num = typeof arg === "number" ? Math.trunc(arg) : parseInt(stringify(arg), 10) || 0;
        formatted = String(num);
        break;
      }
      case "f": {
        const num = typeof arg === "number" ? arg : parseFloat(stringify(arg)) || 0.0;
        const prec = precStr !== undefined ? parseInt(precStr, 10) : 6;
        formatted = num.toFixed(prec);
        break;
      }
      case "x": {
        const num = typeof arg === "number" ? Math.trunc(arg) : 0;
        formatted = num.toString(16);
        break;
      }
      case "c":
      case "s":
      case "b":
      default:
        formatted = stringify(arg);
        break;
    }

    if (widthStr) {
      const width = parseInt(widthStr, 10);
      const absWidth = Math.abs(width);
      if (formatted.length < absWidth) {
        const pad = " ".repeat(absWidth - formatted.length);
        formatted = width < 0 ? formatted + pad : pad + formatted;
      }
    }
    return formatted;
  });
}

// =============================================================================
// メイン評価関数
// =============================================================================
export function evaluateProgram(
  program: ProgramNode,
  options: JavaExecutionOptions = {}
): JavaExecutionResult {
  const startTime = performance.now();
  const maxSteps = options.maxSteps ?? 10_000_000;
  const maxCallDepth = options.maxCallDepth ?? 500;
  const maxOutputLength = options.maxOutputLength ?? 100_000;
  const stdinText = options.stdin ?? "";

  let steps = 0;
  let callDepth = 0;
  let stdout = "";
  let stderr = "";
  const callStack: string[] = [];

  const classMap = new Map<string, ClassDeclNode>();
  const staticFields = new Map<string, Map<string, JavaValue>>();

  for (const cls of program.classes) {
    classMap.set(cls.name, cls);
    staticFields.set(cls.name, new Map());
  }

  const tick = (line: number) => {
    steps++;
    if (steps > maxSteps) {
      throw new StepLimitSignal(line);
    }
  };

  const appendOutput = (text: string, line: number) => {
    stdout += text;
    if (stdout.length > maxOutputLength) {
      stdout = stdout.slice(0, maxOutputLength);
      throw new OutputLimitSignal(line);
    }
  };

  // オブジェクトまたはプリミティブの文字列変換
  const javaToString = (val: JavaValue, line = 1): string => {
    if (val === null || val === undefined) return "null";
    if (typeof val === "number" || typeof val === "boolean" || typeof val === "string") {
      return String(val);
    }
    if (typeof val === "object") {
      if (val.kind === "JavaArray") {
        return `[${val.elements.map((e) => javaToString(e, line)).join(", ")}]`;
      }
      if (val.kind === "JavaBuiltin") {
        if (val.className === "StringBuilder") {
          return (val.state as { buf: string }).buf;
        }
        if (val.className === "ArrayList" || val.className === "HashSet") {
          const list = val.state as JavaValue[];
          return `[${list.map((e) => javaToString(e, line)).join(", ")}]`;
        }
        if (val.className === "HashMap") {
          const map = val.state as Map<string, { key: JavaValue; val: JavaValue }>;
          const entries: string[] = [];
          for (const [, entry] of map.entries()) {
            entries.push(`${javaToString(entry.key, line)}=${javaToString(entry.val, line)}`);
          }
          return `{${entries.join(", ")}}`;
        }
      }
      if (val.kind === "JavaObject") {
        const toStringMethod = findMethod(val.className, "toString", 0);
        if (toStringMethod) {
          const res = invokeMethod(val, val.className, toStringMethod.cls.name, toStringMethod.method, [], line);
          return String(res ?? "null");
        }
        return `${val.className}@instance`;
      }
    }
    return String(val);
  };

  // クラスの継承チェーン探索
  const isSubclassOf = (childName: string, targetName: string): boolean => {
    if (childName === targetName) return true;
    if (targetName === "Object") return true;
    if (
      targetName === "Exception" ||
      targetName === "RuntimeException" ||
      targetName === "Throwable"
    ) {
      if (childName.endsWith("Exception") || childName.endsWith("Error")) {
        return true;
      }
    }
    const cls = classMap.get(childName);
    if (!cls) return false;
    if (cls.interfaces.includes(targetName)) return true;
    if (cls.superClass) {
      return isSubclassOf(cls.superClass, targetName);
    }
    return false;
  };

  // オーバーロード対応のメソッド探索
  const findMethod = (
    className: string,
    methodName: string,
    argCount: number,
    argValues?: JavaValue[]
  ): { cls: ClassDeclNode; method: MethodDeclNode } | null => {
    let curr: ClassDeclNode | undefined = classMap.get(className);
    while (curr) {
      const candidates = curr.methods.filter(
        (m) =>
          m.name === methodName &&
          m.body !== null &&
          (m.params.length === argCount ||
            (m.params.length > 0 &&
              m.params[m.params.length - 1].isVarArgs &&
              argCount >= m.params.length - 1))
      );

      if (candidates.length === 1) {
        return { cls: curr, method: candidates[0] };
      }

      if (candidates.length > 1 && argValues) {
        // 引数の型で最も一致するオーバーロードを選択
        for (const cand of candidates) {
          let match = true;
          for (let i = 0; i < cand.params.length; i++) {
            const pType = cand.params[i].type;
            const v = argValues[i];
            if (pType.baseType === "String" && typeof v !== "string") match = false;
            else if (pType.baseType === "boolean" && typeof v !== "boolean") match = false;
            else if (
              (pType.baseType === "int" || pType.baseType === "long") &&
              (typeof v !== "number" || !Number.isInteger(v))
            ) {
              match = false;
            } else if (pType.baseType === "double" && typeof v !== "number") {
              match = false;
            }
          }
          if (match) return { cls: curr, method: cand };
        }
        return { cls: curr, method: candidates[0] };
      }

      curr = curr.superClass ? classMap.get(curr.superClass) : undefined;
    }
    return null;
  };

  // staticフィールドの初期化
  const initStaticFields = () => {
    for (const cls of program.classes) {
      const sMap = staticFields.get(cls.name)!;
      const env = new Environment(null);
      for (const f of cls.fields) {
        if (f.modifiers.includes("static")) {
          const val = f.initializer
            ? evalExpr(f.initializer, env, null, cls.name)
            : defaultValueForType(f.type);
          sMap.set(f.name, coerceToType(val, f.type));
        }
      }
    }
  };

  // インスタンス生成とフィールド・コンストラクタ初期化
  const instantiateClass = (
    className: string,
    args: JavaValue[],
    line: number
  ): JavaObjectInstance => {
    const cls = classMap.get(className);
    if (!cls) {
      // 標準の例外クラス生成（new IllegalArgumentException("msg") 等）
      if (className.endsWith("Exception") || className.endsWith("Error")) {
        const fields = new Map<string, JavaValue>();
        fields.set("message", args[0] !== undefined ? String(args[0]) : "");
        return { kind: "JavaObject", className, fields };
      }
      throw new JavaExceptionSignal(
        "RuntimeException",
        `クラス ${className} が見つかりません。`,
        line
      );
    }

    if (cls.isAbstract || cls.isInterface) {
      throw new JavaExceptionSignal(
        "InstantiationException",
        `抽象クラスまたはインターフェース ${className} は直接 new できません。`,
        line
      );
    }

    const instance: JavaObjectInstance = {
      kind: "JavaObject",
      className,
      fields: new Map<string, JavaValue>(),
    };

    // 継承ツリーを上ってフィールドを初期化
    const hierarchy: ClassDeclNode[] = [];
    let curr: ClassDeclNode | undefined = cls;
    while (curr) {
      hierarchy.unshift(curr);
      curr = curr.superClass ? classMap.get(curr.superClass) : undefined;
    }

    for (const c of hierarchy) {
      const env = new Environment(null);
      for (const f of c.fields) {
        if (!f.modifiers.includes("static")) {
          const initVal = f.initializer
            ? evalExpr(f.initializer, env, instance, c.name)
            : defaultValueForType(f.type);
          instance.fields.set(f.name, coerceToType(initVal, f.type));
        }
      }
    }

    // コンストラクタ実行
    invokeConstructor(instance, cls, args, line);
    return instance;
  };

  const invokeConstructor = (
    instance: JavaObjectInstance,
    cls: ClassDeclNode,
    args: JavaValue[],
    line: number
  ) => {
    const ctor = cls.constructors.find((c) => c.params.length === args.length);
    if (!ctor) {
      // 引数なしの場合はデフォルトコンストラクタとして親の引数なしコンストラクタを呼ぶ
      if (args.length === 0 && cls.superClass && classMap.has(cls.superClass)) {
        invokeConstructor(instance, classMap.get(cls.superClass)!, [], line);
      }
      return;
    }

    const env = new Environment(null);
    for (let i = 0; i < ctor.params.length; i++) {
      env.define(
        ctor.params[i].name,
        coerceToType(args[i], ctor.params[i].type),
        ctor.params[i].type
      );
    }

    // 先頭が super(...) または this(...) でない場合、親のデフォルトコンストラクタを自動実行
    const firstStmt = ctor.body.statements[0];
    if (
      cls.superClass &&
      classMap.has(cls.superClass) &&
      firstStmt?.kind !== "SuperConstructorCallStmt" &&
      firstStmt?.kind !== "ThisConstructorCallStmt"
    ) {
      invokeConstructor(instance, classMap.get(cls.superClass)!, [], line);
    }

    try {
      evalBlock(ctor.body, env, instance, cls.name, false);
    } catch (sig) {
      if (sig instanceof ReturnSignal) return;
      throw sig;
    }
  };

  // ユーザー定義メソッド呼び出し
  const invokeMethod = (
    thisRef: JavaObjectInstance | null,
    targetClassName: string,
    declaringClassName: string,
    method: MethodDeclNode,
    args: JavaValue[],
    callLine: number
  ): JavaValue => {
    callDepth++;
    callStack.push(`${declaringClassName}.${method.name}(line:${callLine})`);
    if (callDepth > maxCallDepth) {
      throw new JavaExceptionSignal(
        "StackOverflowError",
        `メソッド「${method.name}」の再帰呼び出しが上限（${maxCallDepth}回）を超えました。`,
        callLine
      );
    }

    try {
      const env = new Environment(null);
      for (let i = 0; i < method.params.length; i++) {
        const param = method.params[i];
        if (param.isVarArgs) {
          const rest = args.slice(i);
          env.define(
            param.name,
            {
              kind: "JavaArray",
              elementType: param.type.baseType,
              dimensions: 1,
              elements: rest,
            },
            param.type
          );
        } else {
          env.define(
            param.name,
            coerceToType(args[i], param.type),
            param.type
          );
        }
      }

      if (method.body) {
        evalBlock(method.body, env, thisRef, declaringClassName, false);
      }
      return defaultValueForType(method.returnType);
    } catch (sig) {
      if (sig instanceof ReturnSignal) {
        return coerceToType(sig.value, method.returnType);
      }
      throw sig;
    } finally {
      callDepth--;
      callStack.pop();
    }
  };

  // 多次元配列の再帰的生成
  const createMultiArray = (
    baseType: string,
    dimensions: number,
    sizes: number[],
    depth = 0
  ): JavaArrayInstance => {
    const size = sizes[depth];
    const elements: JavaValue[] = [];
    const remainingDims = dimensions - depth;
    for (let i = 0; i < size; i++) {
      if (depth + 1 < sizes.length && sizes[depth + 1] !== undefined) {
        elements.push(createMultiArray(baseType, dimensions, sizes, depth + 1));
      } else {
        elements.push(
          defaultValueForType({
            baseType,
            dimensions: remainingDims - 1,
          })
        );
      }
    }
    return {
      kind: "JavaArray",
      elementType: baseType,
      dimensions: remainingDims,
      elements,
    };
  };

  // ===========================================================================
  // 文（Statement）の実行
  // ===========================================================================
  const evalBlock = (
    block: BlockStmtNode,
    parentEnv: Environment,
    thisRef: JavaObjectInstance | null,
    currentClass: string,
    createNewScope = true
  ) => {
    const env = createNewScope ? new Environment(parentEnv) : parentEnv;
    for (const stmt of block.statements) {
      evalStmt(stmt, env, thisRef, currentClass);
    }
  };

  const evalStmt = (
    stmt: StmtNode,
    env: Environment,
    thisRef: JavaObjectInstance | null,
    currentClass: string
  ) => {
    tick(stmt.line);

    switch (stmt.kind) {
      case "EmptyStmt":
        return;

      case "BlockStmt":
        evalBlock(stmt, env, thisRef, currentClass, true);
        return;

      case "VarDeclStmt": {
        for (const decl of stmt.declarations) {
          const fullType: TypeNode = {
            ...stmt.type,
            dimensions: decl.dimensions,
          };
          const initVal = decl.initializer
            ? evalExpr(decl.initializer, env, thisRef, currentClass)
            : defaultValueForType(fullType);
          env.define(decl.name, coerceToType(initVal, fullType), fullType);
        }
        return;
      }

      case "ExprStmt":
        evalExpr(stmt.expr, env, thisRef, currentClass);
        return;

      case "IfStmt": {
        const cond = evalExpr(stmt.condition, env, thisRef, currentClass);
        if (Boolean(cond)) {
          evalStmt(stmt.thenBranch, new Environment(env), thisRef, currentClass);
        } else if (stmt.elseBranch) {
          evalStmt(stmt.elseBranch, new Environment(env), thisRef, currentClass);
        }
        return;
      }

      case "WhileStmt": {
        while (Boolean(evalExpr(stmt.condition, env, thisRef, currentClass))) {
          tick(stmt.line);
          try {
            evalStmt(stmt.body, new Environment(env), thisRef, currentClass);
          } catch (sig) {
            if (sig instanceof BreakSignal) break;
            if (sig instanceof ContinueSignal) continue;
            throw sig;
          }
        }
        return;
      }

      case "DoWhileStmt": {
        do {
          tick(stmt.line);
          try {
            evalStmt(stmt.body, new Environment(env), thisRef, currentClass);
          } catch (sig) {
            if (sig instanceof BreakSignal) break;
            if (sig instanceof ContinueSignal) {
              // continue時でも条件判定に進む
            } else {
              throw sig;
            }
          }
        } while (Boolean(evalExpr(stmt.condition, env, thisRef, currentClass)));
        return;
      }

      case "ForStmt": {
        const forEnv = new Environment(env);
        if (stmt.init) {
          if ("kind" in stmt.init && stmt.init.kind === "VarDeclStmt") {
            evalStmt(stmt.init, forEnv, thisRef, currentClass);
          } else {
            evalExpr(stmt.init as ExprNode, forEnv, thisRef, currentClass);
          }
        }
        while (
          stmt.condition === null ||
          Boolean(evalExpr(stmt.condition, forEnv, thisRef, currentClass))
        ) {
          tick(stmt.line);
          try {
            evalStmt(stmt.body, new Environment(forEnv), thisRef, currentClass);
          } catch (sig) {
            if (sig instanceof BreakSignal) break;
            if (sig instanceof ContinueSignal) {
              // update節を実行して次ループへ
            } else {
              throw sig;
            }
          }
          for (const u of stmt.update) {
            evalExpr(u, forEnv, thisRef, currentClass);
          }
        }
        return;
      }

      case "ForEachStmt": {
        const iterableVal = evalExpr(stmt.iterable, env, thisRef, currentClass);
        if (iterableVal === null || typeof iterableVal !== "object") {
          throw new JavaExceptionSignal(
            "NullPointerException",
            "拡張for文の対象が null です。",
            stmt.line
          );
        }

        let elements: JavaValue[] = [];
        if (iterableVal.kind === "JavaArray") {
          elements = iterableVal.elements;
        } else if (
          iterableVal.kind === "JavaBuiltin" &&
          (iterableVal.className === "ArrayList" ||
            iterableVal.className === "HashSet")
        ) {
          elements = [...(iterableVal.state as JavaValue[])];
        }

        for (const item of elements) {
          tick(stmt.line);
          const loopEnv = new Environment(env);
          loopEnv.define(
            stmt.varName,
            coerceToType(item, stmt.varType),
            stmt.varType
          );
          try {
            evalStmt(stmt.body, loopEnv, thisRef, currentClass);
          } catch (sig) {
            if (sig instanceof BreakSignal) break;
            if (sig instanceof ContinueSignal) continue;
            throw sig;
          }
        }
        return;
      }

      case "SwitchStmt": {
        const targetVal = evalExpr(stmt.expr, env, thisRef, currentClass);
        const switchEnv = new Environment(env);
        let matchedIndex = -1;
        let defaultIndex = -1;

        for (let i = 0; i < stmt.cases.length; i++) {
          const c = stmt.cases[i];
          for (const label of c.labels) {
            if (label === null) {
              defaultIndex = i;
            } else {
              const lVal = evalExpr(label, switchEnv, thisRef, currentClass);
              if (lVal === targetVal) {
                matchedIndex = i;
                break;
              }
            }
          }
          if (matchedIndex !== -1) break;
        }

        const startIdx = matchedIndex !== -1 ? matchedIndex : defaultIndex;
        if (startIdx === -1) return;

        // アロー構文 (case 1 -> ...) の場合はフォールスルーしない
        if (stmt.cases[startIdx].isArrow) {
          try {
            for (const s of stmt.cases[startIdx].statements) {
              evalStmt(s, new Environment(switchEnv), thisRef, currentClass);
            }
          } catch (sig) {
            if (sig instanceof BreakSignal) return;
            throw sig;
          }
          return;
        }

        // 従来の case : 構文（breakまでフォールスルー）
        try {
          for (let i = startIdx; i < stmt.cases.length; i++) {
            for (const s of stmt.cases[i].statements) {
              evalStmt(s, switchEnv, thisRef, currentClass);
            }
          }
        } catch (sig) {
          if (sig instanceof BreakSignal) return;
          throw sig;
        }
        return;
      }

      case "ReturnStmt": {
        const val = stmt.value
          ? evalExpr(stmt.value, env, thisRef, currentClass)
          : null;
        throw new ReturnSignal(val);
      }

      case "BreakStmt":
        throw new BreakSignal();

      case "ContinueStmt":
        throw new ContinueSignal();

      case "SuperConstructorCallStmt": {
        const cls = classMap.get(currentClass);
        const argVals = stmt.args.map((a) =>
          evalExpr(a, env, thisRef, currentClass)
        );
        if (cls?.superClass && thisRef) {
          if (classMap.has(cls.superClass)) {
            invokeConstructor(
              thisRef,
              classMap.get(cls.superClass)!,
              argVals,
              stmt.line
            );
          } else if (
            cls.superClass.endsWith("Exception") ||
            cls.superClass.endsWith("Error") ||
            cls.superClass === "Throwable"
          ) {
            if (argVals[0] !== undefined) {
              thisRef.fields.set("message", String(argVals[0]));
            }
          }
        }
        return;
      }

      case "ThisConstructorCallStmt": {
        const cls = classMap.get(currentClass);
        if (cls && thisRef) {
          const argVals = stmt.args.map((a) =>
            evalExpr(a, env, thisRef, currentClass)
          );
          invokeConstructor(thisRef, cls, argVals, stmt.line);
        }
        return;
      }

      case "ThrowStmt": {
        const exVal = evalExpr(stmt.expr, env, thisRef, currentClass);
        if (exVal && typeof exVal === "object" && exVal.kind === "JavaObject") {
          const msg = exVal.fields.get("message");
          throw new JavaExceptionSignal(
            exVal.className,
            msg !== undefined && msg !== null ? String(msg) : "",
            stmt.line,
            exVal
          );
        }
        throw new JavaExceptionSignal("RuntimeException", String(exVal), stmt.line);
      }

      case "TryStmt": {
        let pendingSignal: unknown = null;
        try {
          evalBlock(stmt.tryBlock, env, thisRef, currentClass, true);
        } catch (sig) {
          if (sig instanceof JavaExceptionSignal) {
            let caught = false;
            for (const c of stmt.catches) {
              const matches = c.exceptionTypes.some((t) =>
                isSubclassOf(sig.exceptionClass, t)
              );
              if (matches) {
                caught = true;
                const catchEnv = new Environment(env);
                const exObj: JavaObjectInstance = sig.customInstance ?? {
                  kind: "JavaObject",
                  className: sig.exceptionClass,
                  fields: new Map<string, JavaValue>([["message", sig.message]]),
                };
                catchEnv.define(c.varName, exObj);
                try {
                  evalBlock(c.body, catchEnv, thisRef, currentClass, false);
                } catch (innerSig) {
                  pendingSignal = innerSig;
                }
                break;
              }
            }
            if (!caught) {
              pendingSignal = sig;
            }
          } else {
            pendingSignal = sig;
          }
        } finally {
          if (stmt.finallyBlock) {
            evalBlock(stmt.finallyBlock, env, thisRef, currentClass, true);
          }
        }
        if (pendingSignal !== null) {
          throw pendingSignal;
        }
        return;
      }
    }
  };

  // ===========================================================================
  // 式（Expression）の評価
  // ===========================================================================
  const evalExpr = (
    expr: ExprNode,
    env: Environment,
    thisRef: JavaObjectInstance | null,
    currentClass: string
  ): JavaValue => {
    tick(expr.line);

    switch (expr.kind) {
      case "LiteralExpr":
        return expr.value;

      case "ThisExpr":
        return thisRef;

      case "SuperExpr":
        return thisRef;

      case "IdentifierExpr": {
        if (env.has(expr.name)) {
          return env.get(expr.name);
        }
        if (thisRef && thisRef.fields.has(expr.name)) {
          return thisRef.fields.get(expr.name)!;
        }
        const currStatic = staticFields.get(currentClass);
        if (currStatic && currStatic.has(expr.name)) {
          return currStatic.get(expr.name)!;
        }
        if (classMap.has(expr.name)) {
          return { kind: "JavaStaticClass", className: expr.name };
        }
        return { kind: "JavaStaticClass", className: expr.name };
      }

      case "ArrayInitializerExpr": {
        return evalArrayInitializer(expr, env, thisRef, currentClass);
      }

      case "NewArrayExpr": {
        if (expr.initializer) {
          return evalArrayInitializer(
            expr.initializer,
            env,
            thisRef,
            currentClass
          );
        }
        const sizes: number[] = [];
        for (const sExpr of expr.sizeExprs) {
          if (sExpr) {
            const sz = Number(evalExpr(sExpr, env, thisRef, currentClass));
            if (sz < 0) {
              throw new JavaExceptionSignal(
                "NegativeArraySizeException",
                `配列のサイズに負の値（${sz}）が指定されました。`,
                expr.line
              );
            }
            sizes.push(Math.trunc(sz));
          }
        }
        return createMultiArray(
          expr.elementType.baseType,
          expr.elementType.dimensions,
          sizes
        );
      }

      case "NewObjectExpr": {
        const argVals = expr.args.map((a) =>
          evalExpr(a, env, thisRef, currentClass)
        );
        const typeName = expr.type.baseType;

        // 標準ライブラリの組み込みクラス生成
        if (typeName === "Scanner") {
          const state: ScannerState = { raw: stdinText, pos: 0 };
          return { kind: "JavaBuiltin", className: "Scanner", state };
        }
        if (typeName === "StringBuilder") {
          const initial = argVals[0] !== undefined ? javaToString(argVals[0], expr.line) : "";
          return {
            kind: "JavaBuiltin",
            className: "StringBuilder",
            state: { buf: initial },
          };
        }
        if (typeName === "ArrayList") {
          const initialList: JavaValue[] = [];
          if (
            argVals[0] &&
            typeof argVals[0] === "object" &&
            argVals[0].kind === "JavaBuiltin" &&
            argVals[0].className === "ArrayList"
          ) {
            initialList.push(...(argVals[0].state as JavaValue[]));
          }
          return {
            kind: "JavaBuiltin",
            className: "ArrayList",
            state: initialList,
          };
        }
        if (typeName === "HashMap") {
          return {
            kind: "JavaBuiltin",
            className: "HashMap",
            state: new Map<string, { key: JavaValue; val: JavaValue }>(),
          };
        }
        if (typeName === "HashSet") {
          return {
            kind: "JavaBuiltin",
            className: "HashSet",
            state: [] as JavaValue[],
          };
        }

        return instantiateClass(typeName, argVals, expr.line);
      }

      case "ArrayAccessExpr": {
        const arrVal = evalExpr(expr.array, env, thisRef, currentClass);
        const idxVal = Number(evalExpr(expr.index, env, thisRef, currentClass));
        if (arrVal === null || typeof arrVal !== "object" || arrVal.kind !== "JavaArray") {
          throw new JavaExceptionSignal(
            "NullPointerException",
            "配列が null です。",
            expr.line
          );
        }
        const idx = Math.trunc(idxVal);
        if (idx < 0 || idx >= arrVal.elements.length) {
          throw new JavaExceptionSignal(
            "ArrayIndexOutOfBoundsException",
            `Index ${idx} out of bounds for length ${arrVal.elements.length}`,
            expr.line
          );
        }
        return arrVal.elements[idx];
      }

      case "MemberExpr": {
        const objVal = evalExpr(expr.object, env, thisRef, currentClass);
        if (objVal === null) {
          throw new JavaExceptionSignal(
            "NullPointerException",
            `null に対してフィールド「${expr.property}」を参照しました。`,
            expr.line
          );
        }
        if (typeof objVal === "object") {
          if (objVal.kind === "JavaArray" && expr.property === "length") {
            return objVal.elements.length;
          }
          if (objVal.kind === "JavaObject") {
            if (objVal.fields.has(expr.property)) {
              return objVal.fields.get(expr.property)!;
            }
          }
          if (objVal.kind === "JavaStaticClass") {
            if (objVal.className === "System" && expr.property === "out") {
              return { kind: "JavaStaticClass", className: "System.out" };
            }
            if (objVal.className === "System" && expr.property === "in") {
              return { kind: "JavaStaticClass", className: "System.in" };
            }
            if (objVal.className === "Integer") {
              if (expr.property === "MAX_VALUE") return 2147483647;
              if (expr.property === "MIN_VALUE") return -2147483648;
            }
            if (objVal.className === "Long") {
              if (expr.property === "MAX_VALUE") return Number.MAX_SAFE_INTEGER;
              if (expr.property === "MIN_VALUE") return Number.MIN_SAFE_INTEGER;
            }
            if (objVal.className === "Math") {
              if (expr.property === "PI") return Math.PI;
              if (expr.property === "E") return Math.E;
            }
            const sFields = staticFields.get(objVal.className);
            if (sFields && sFields.has(expr.property)) {
              return sFields.get(expr.property)!;
            }
          }
        }
        return null;
      }

      case "UnaryExpr": {
        const val = evalExpr(expr.operand, env, thisRef, currentClass);
        switch (expr.operator) {
          case "-":
            return -(typeof val === "string" ? val.charCodeAt(0) : Number(val));
          case "+":
            return +(typeof val === "string" ? val.charCodeAt(0) : Number(val));
          case "!":
            return !Boolean(val);
          case "~":
            return ~Math.trunc(Number(val));
          default:
            return val;
        }
      }

      case "UpdateExpr": {
        const currVal = evalExpr(expr.operand, env, thisRef, currentClass);
        const numVal =
          typeof currVal === "string" && currVal.length === 1
            ? currVal.charCodeAt(0)
            : Number(currVal);
        const nextVal = expr.operator === "++" ? numVal + 1 : numVal - 1;
        assignTarget(expr.operand, nextVal, env, thisRef, currentClass);
        return expr.prefix ? nextVal : numVal;
      }

      case "AssignExpr": {
        const rightVal = evalExpr(expr.value, env, thisRef, currentClass);
        if (expr.operator === "=") {
          assignTarget(expr.target, rightVal, env, thisRef, currentClass);
          return rightVal;
        }
        const leftVal = evalExpr(expr.target, env, thisRef, currentClass);
        const op = expr.operator.slice(0, -1); // "+=" -> "+"
        const combined = applyBinaryOp(
          op,
          leftVal,
          rightVal,
          expr.line,
          expr.target,
          expr.value,
          env
        );
        assignTarget(expr.target, combined, env, thisRef, currentClass);
        return combined;
      }

      case "BinaryExpr": {
        // 短絡評価
        if (expr.operator === "&&") {
          const l = evalExpr(expr.left, env, thisRef, currentClass);
          if (!Boolean(l)) return false;
          return Boolean(evalExpr(expr.right, env, thisRef, currentClass));
        }
        if (expr.operator === "||") {
          const l = evalExpr(expr.left, env, thisRef, currentClass);
          if (Boolean(l)) return true;
          return Boolean(evalExpr(expr.right, env, thisRef, currentClass));
        }

        const leftVal = evalExpr(expr.left, env, thisRef, currentClass);
        const rightVal = evalExpr(expr.right, env, thisRef, currentClass);
        return applyBinaryOp(
          expr.operator,
          leftVal,
          rightVal,
          expr.line,
          expr.left,
          expr.right,
          env
        );
      }

      case "ConditionalExpr": {
        const cond = evalExpr(expr.condition, env, thisRef, currentClass);
        return Boolean(cond)
          ? evalExpr(expr.consequent, env, thisRef, currentClass)
          : evalExpr(expr.alternate, env, thisRef, currentClass);
      }

      case "CastExpr": {
        const val = evalExpr(expr.expr, env, thisRef, currentClass);
        const t = expr.targetType.baseType;
        if (t === "int" || t === "long" || t === "short" || t === "byte") {
          if (typeof val === "string" && val.length === 1) {
            return val.charCodeAt(0);
          }
          return Math.trunc(Number(val));
        }
        if (t === "double" || t === "float") {
          if (typeof val === "string" && val.length === 1) {
            return val.charCodeAt(0);
          }
          return Number(val);
        }
        if (t === "char") {
          if (typeof val === "number") {
            return String.fromCharCode(Math.trunc(val));
          }
          return String(val)[0] || "\0";
        }
        if (val && typeof val === "object" && val.kind === "JavaObject") {
          if (!isSubclassOf(val.className, t)) {
            throw new JavaExceptionSignal(
              "ClassCastException",
              `${val.className} を ${t} にキャストすることはできません。`,
              expr.line
            );
          }
        }
        return val;
      }

      case "InstanceOfExpr": {
        const val = evalExpr(expr.expr, env, thisRef, currentClass);
        if (val === null) return false;
        const target = expr.checkType.baseType;
        if (typeof val === "string") return target === "String" || target === "Object";
        if (typeof val === "object") {
          if (val.kind === "JavaObject") {
            return isSubclassOf(val.className, target);
          }
          if (val.kind === "JavaBuiltin") {
            if (target === "List" && val.className === "ArrayList") return true;
            if (target === "Map" && val.className === "HashMap") return true;
            if (target === "Set" && val.className === "HashSet") return true;
            return val.className === target || target === "Object";
          }
        }
        return false;
      }

      case "LambdaExpr": {
        return {
          kind: "JavaLambda",
          node: expr,
          capturedEnv: env,
          thisRef,
          currentClass,
        };
      }

      case "CallExpr": {
        const argVals = expr.args.map((a) =>
          evalExpr(a, env, thisRef, currentClass)
        );
        return evalMethodCall(
          expr,
          argVals,
          env,
          thisRef,
          currentClass
        );
      }
    }
  };

  const evalArrayInitializer = (
    node: ArrayInitializerExprNode,
    env: Environment,
    thisRef: JavaObjectInstance | null,
    currentClass: string
  ): JavaArrayInstance => {
    const elements = node.elements.map((e) =>
      evalExpr(e, env, thisRef, currentClass)
    );
    const first = elements[0];
    const dims =
      first && typeof first === "object" && first.kind === "JavaArray"
        ? first.dimensions + 1
        : 1;
    return {
      kind: "JavaArray",
      elementType: "Object",
      dimensions: dims,
      elements,
    };
  };

  // 代入先への書き込み
  const assignTarget = (
    target: ExprNode,
    val: JavaValue,
    env: Environment,
    thisRef: JavaObjectInstance | null,
    currentClass: string
  ) => {
    if (target.kind === "IdentifierExpr") {
      if (env.assign(target.name, val)) return;
      if (thisRef && thisRef.fields.has(target.name)) {
        thisRef.fields.set(target.name, val);
        return;
      }
      const sMap = staticFields.get(currentClass);
      if (sMap && sMap.has(target.name)) {
        sMap.set(target.name, val);
        return;
      }
      env.define(target.name, val);
      return;
    }

    if (target.kind === "MemberExpr") {
      const obj = evalExpr(target.object, env, thisRef, currentClass);
      if (obj === null) {
        throw new JavaExceptionSignal(
          "NullPointerException",
          `null に対してフィールド「${target.property}」へ代入しました。`,
          target.line
        );
      }
      if (typeof obj === "object") {
        if (obj.kind === "JavaObject") {
          obj.fields.set(target.property, val);
          return;
        }
        if (obj.kind === "JavaStaticClass") {
          const sMap = staticFields.get(obj.className);
          if (sMap) sMap.set(target.property, val);
          return;
        }
      }
    }

    if (target.kind === "ArrayAccessExpr") {
      const arr = evalExpr(target.array, env, thisRef, currentClass);
      const idx = Math.trunc(
        Number(evalExpr(target.index, env, thisRef, currentClass))
      );
      if (arr === null || typeof arr !== "object" || arr.kind !== "JavaArray") {
        throw new JavaExceptionSignal(
          "NullPointerException",
          "配列が null です。",
          target.line
        );
      }
      if (idx < 0 || idx >= arr.elements.length) {
        throw new JavaExceptionSignal(
          "ArrayIndexOutOfBoundsException",
          `Index ${idx} out of bounds for length ${arr.elements.length}`,
          target.line
        );
      }
      arr.elements[idx] = val;
    }
  };

  // 式が整数型として扱われるべきかの判定（Javaの整数除算 5 / 2 == 2 を正確に再現）
  const isExprFloatingPoint = (
    node: ExprNode,
    val: JavaValue,
    env: Environment
  ): boolean => {
    if (typeof val === "number" && !Number.isInteger(val)) return true;
    if (node.kind === "LiteralExpr") return node.literalType === "double";
    if (node.kind === "IdentifierExpr") {
      const t = env.getType(node.name);
      return t?.baseType === "double" || t?.baseType === "float";
    }
    if (node.kind === "CastExpr") {
      return (
        node.targetType.baseType === "double" ||
        node.targetType.baseType === "float"
      );
    }
    if (node.kind === "BinaryExpr") {
      return (
        isExprFloatingPoint(node.left, val, env) ||
        isExprFloatingPoint(node.right, val, env)
      );
    }
    if (node.kind === "CallExpr") {
      if (
        node.methodName === "sqrt" ||
        node.methodName === "pow" ||
        node.methodName === "random" ||
        node.methodName === "parseDouble" ||
        node.methodName === "nextDouble"
      ) {
        return true;
      }
    }
    return false;
  };

  const applyBinaryOp = (
    op: string,
    left: JavaValue,
    right: JavaValue,
    line: number,
    leftNode: ExprNode,
    rightNode: ExprNode,
    env: Environment
  ): JavaValue => {
    // 文字列連結（ただし char 同士の '+' はJava仕様通り数値加算にする）
    const isLeftChar = isCharExpr(leftNode, env);
    const isRightChar = isCharExpr(rightNode, env);

    if (
      op === "+" &&
      ((typeof left === "string" && !isLeftChar) ||
        (typeof right === "string" && !isRightChar))
    ) {
      return javaToString(left, line) + javaToString(right, line);
    }

    if (op === "==") return left === right;
    if (op === "!=") return left !== right;

    const lNum =
      typeof left === "string" && left.length === 1
        ? left.charCodeAt(0)
        : Number(left);
    const rNum =
      typeof right === "string" && right.length === 1
        ? right.charCodeAt(0)
        : Number(right);

    const isFloatOp =
      isExprFloatingPoint(leftNode, left, env) ||
      isExprFloatingPoint(rightNode, right, env);

    switch (op) {
      case "+":
        return isFloatOp ? lNum + rNum : Math.trunc(lNum + rNum);
      case "-":
        return isFloatOp ? lNum - rNum : Math.trunc(lNum - rNum);
      case "*":
        return isFloatOp ? lNum * rNum : Math.trunc(lNum * rNum);
      case "/": {
        if (!isFloatOp && rNum === 0) {
          throw new JavaExceptionSignal(
            "ArithmeticException",
            "/ by zero",
            line
          );
        }
        return isFloatOp ? lNum / rNum : Math.trunc(lNum / rNum);
      }
      case "%": {
        if (!isFloatOp && rNum === 0) {
          throw new JavaExceptionSignal(
            "ArithmeticException",
            "/ by zero",
            line
          );
        }
        return isFloatOp ? lNum % rNum : Math.trunc(lNum % rNum);
      }
      case "<":
        return lNum < rNum;
      case "<=":
        return lNum <= rNum;
      case ">":
        return lNum > rNum;
      case ">=":
        return lNum >= rNum;
      case "&":
        if (typeof left === "boolean" && typeof right === "boolean") {
          return left && right;
        }
        return Math.trunc(lNum) & Math.trunc(rNum);
      case "|":
        if (typeof left === "boolean" && typeof right === "boolean") {
          return left || right;
        }
        return Math.trunc(lNum) | Math.trunc(rNum);
      case "^":
        if (typeof left === "boolean" && typeof right === "boolean") {
          return left !== right;
        }
        return Math.trunc(lNum) ^ Math.trunc(rNum);
      case "<<":
        return Math.trunc(lNum) << Math.trunc(rNum);
      case ">>":
        return Math.trunc(lNum) >> Math.trunc(rNum);
      case ">>>":
        return Math.trunc(lNum) >>> Math.trunc(rNum);
      default:
        return 0;
    }
  };

  const isCharExpr = (node: ExprNode, env: Environment): boolean => {
    if (node.kind === "LiteralExpr" && node.literalType === "char") return true;
    if (node.kind === "IdentifierExpr") {
      return env.getType(node.name)?.baseType === "char";
    }
    if (node.kind === "CastExpr") {
      return node.targetType.baseType === "char";
    }
    if (node.kind === "CallExpr" && node.methodName === "charAt") {
      return true;
    }
    return false;
  };

  // ===========================================================================
  // メソッド呼び出し（標準ライブラリ ＋ ユーザー定義メソッド）
  // ===========================================================================
  const evalMethodCall = (
    expr: Extract<ExprNode, { kind: "CallExpr" }>,
    args: JavaValue[],
    env: Environment,
    thisRef: JavaObjectInstance | null,
    currentClass: string
  ): JavaValue => {
    const mName = expr.methodName;

    // 1. 同一クラス内のメソッド呼び出し（callee === null）
    if (expr.callee === null) {
      const targetClass = thisRef ? thisRef.className : currentClass;
      const found = findMethod(targetClass, mName, args.length, args);
      if (found) {
        return invokeMethod(
          thisRef,
          targetClass,
          found.cls.name,
          found.method,
          args,
          expr.line
        );
      }
      throw new JavaExceptionSignal(
        "NoSuchMethodError",
        `メソッド ${mName}(引数${args.length}個) が見つかりません。`,
        expr.line
      );
    }

    // super.method(...) の特別処理
    if (expr.callee.kind === "SuperExpr") {
      const cls = classMap.get(currentClass);
      if (cls?.superClass) {
        const found = findMethod(cls.superClass, mName, args.length, args);
        if (found) {
          return invokeMethod(
            thisRef,
            cls.superClass,
            found.cls.name,
            found.method,
            args,
            expr.line
          );
        }
      }
    }

    const receiver = evalExpr(expr.callee, env, thisRef, currentClass);

    if (receiver === null) {
      throw new JavaExceptionSignal(
        "NullPointerException",
        `null に対してメソッド「${mName}()」を呼び出しました。`,
        expr.line
      );
    }

    // 2. String のメソッド
    if (typeof receiver === "string") {
      return evalStringMethod(receiver, mName, args, expr.line);
    }

    // 3. Static クラスメソッド (System.out, Math, Integer, Double, String, Arrays 等)
    if (typeof receiver === "object" && receiver.kind === "JavaStaticClass") {
      return evalStaticClassMethod(
        receiver.className,
        mName,
        args,
        expr.line,
        thisRef
      );
    }

    // 4. 組み込みオブジェクト (Scanner, StringBuilder, ArrayList, HashMap, HashSet)
    if (typeof receiver === "object" && receiver.kind === "JavaBuiltin") {
      return evalBuiltinMethod(receiver, mName, args, expr.line);
    }

    // 5. ユーザー定義クラスのインスタンスメソッド
    if (typeof receiver === "object" && receiver.kind === "JavaObject") {
      if (mName === "getMessage" && args.length === 0) {
        return receiver.fields.get("message") ?? "";
      }
      const found = findMethod(receiver.className, mName, args.length, args);
      if (found) {
        return invokeMethod(
          receiver,
          receiver.className,
          found.cls.name,
          found.method,
          args,
          expr.line
        );
      }
      if (mName === "equals" && args.length === 1) {
        return receiver === args[0];
      }
      if (mName === "toString" && args.length === 0) {
        return `${receiver.className}@instance`;
      }
      throw new JavaExceptionSignal(
        "NoSuchMethodError",
        `クラス ${receiver.className} にメソッド ${mName} が見つかりません。`,
        expr.line
      );
    }

    // 6. ラムダ式の直接実行
    if (typeof receiver === "object" && receiver.kind === "JavaLambda") {
      return invokeLambda(receiver, args);
    }

    return null;
  };

  // String メソッド群
  const evalStringMethod = (
    str: string,
    mName: string,
    args: JavaValue[],
    line: number
  ): JavaValue => {
    switch (mName) {
      case "length":
        return str.length;
      case "charAt": {
        const idx = Math.trunc(Number(args[0]));
        if (idx < 0 || idx >= str.length) {
          throw new JavaExceptionSignal(
            "StringIndexOutOfBoundsException",
            `String index out of range: ${idx}`,
            line
          );
        }
        return str[idx];
      }
      case "substring": {
        const start = Math.trunc(Number(args[0]));
        const end = args[1] !== undefined ? Math.trunc(Number(args[1])) : str.length;
        if (start < 0 || end > str.length || start > end) {
          throw new JavaExceptionSignal(
            "StringIndexOutOfBoundsException",
            `begin ${start}, end ${end}, length ${str.length}`,
            line
          );
        }
        return str.substring(start, end);
      }
      case "indexOf":
        return str.indexOf(String(args[0]), args[1] !== undefined ? Number(args[1]) : 0);
      case "lastIndexOf":
        return str.lastIndexOf(String(args[0]));
      case "equals":
        return str === args[0];
      case "equalsIgnoreCase":
        return typeof args[0] === "string" && str.toLowerCase() === args[0].toLowerCase();
      case "compareTo":
        return str === String(args[0]) ? 0 : str < String(args[0]) ? -1 : 1;
      case "contains":
        return str.includes(String(args[0]));
      case "startsWith":
        return str.startsWith(String(args[0]));
      case "endsWith":
        return str.endsWith(String(args[0]));
      case "isEmpty":
        return str.length === 0;
      case "isBlank":
        return str.trim().length === 0;
      case "toUpperCase":
        return str.toUpperCase();
      case "toLowerCase":
        return str.toLowerCase();
      case "trim":
      case "strip":
        return str.trim();
      case "replace":
        return str.split(String(args[0])).join(String(args[1]));
      case "replaceAll":
        return str.replace(new RegExp(String(args[0]), "g"), String(args[1]));
      case "repeat":
        return str.repeat(Math.max(0, Math.trunc(Number(args[0]))));
      case "toCharArray":
        return {
          kind: "JavaArray",
          elementType: "char",
          dimensions: 1,
          elements: str.split(""),
        };
      case "split": {
        const pattern = String(args[0]);
        let parts: string[];
        try {
          parts = str.split(new RegExp(pattern));
        } catch {
          parts = str.split(pattern);
        }
        return {
          kind: "JavaArray",
          elementType: "String",
          dimensions: 1,
          elements: parts,
        };
      }
      case "toString":
        return str;
      default:
        throw new JavaExceptionSignal(
          "NoSuchMethodError",
          `String.${mName} は未対応または存在しないメソッドです。`,
          line
        );
    }
  };

  // Static メソッド群 (System.out, Math, Integer, Double, String, Arrays 等)
  const evalStaticClassMethod = (
    className: string,
    mName: string,
    args: JavaValue[],
    line: number,
    thisRef: JavaObjectInstance | null
  ): JavaValue => {
    if (className === "System.out") {
      if (mName === "println") {
        const text = args.length > 0 ? javaToString(args[0], line) : "";
        appendOutput(text + "\n", line);
        return null;
      }
      if (mName === "print") {
        const text = args.length > 0 ? javaToString(args[0], line) : "";
        appendOutput(text, line);
        return null;
      }
      if (mName === "printf" || mName === "format") {
        const fmt = String(args[0] ?? "");
        const rest = args.slice(1);
        const formatted = formatJavaString(fmt, rest, (v) => javaToString(v, line));
        appendOutput(formatted, line);
        return null;
      }
    }

    if (className === "String") {
      if (mName === "format") {
        const fmt = String(args[0] ?? "");
        return formatJavaString(fmt, args.slice(1), (v) => javaToString(v, line));
      }
      if (mName === "valueOf") {
        return javaToString(args[0], line);
      }
      if (mName === "join") {
        const delim = String(args[0] ?? "");
        const second = args[1];
        if (second && typeof second === "object") {
          if (second.kind === "JavaArray") {
            return second.elements.map((e) => javaToString(e, line)).join(delim);
          }
          if (second.kind === "JavaBuiltin" && second.className === "ArrayList") {
            return (second.state as JavaValue[])
              .map((e) => javaToString(e, line))
              .join(delim);
          }
        }
        return args
          .slice(1)
          .map((e) => javaToString(e, line))
          .join(delim);
      }
    }

    if (className === "Math") {
      const a = Number(args[0]);
      const b = Number(args[1]);
      switch (mName) {
        case "max":
          return Math.max(a, b);
        case "min":
          return Math.min(a, b);
        case "abs":
          return Math.abs(a);
        case "pow":
          return Math.pow(a, b);
        case "sqrt":
          return Math.sqrt(a);
        case "floor":
          return Math.floor(a);
        case "ceil":
          return Math.ceil(a);
        case "round":
          return Math.round(a);
        case "random":
          return Math.random();
      }
    }

    if (className === "Integer" || className === "Long") {
      if (mName === "parseInt" || mName === "parseLong" || mName === "valueOf") {
        const raw = String(args[0]).trim();
        if (!/^[+-]?\d+$/.test(raw)) {
          throw new JavaExceptionSignal(
            "NumberFormatException",
            `For input string: "${args[0]}"`,
            line
          );
        }
        return parseInt(raw, 10);
      }
      if (mName === "toString") return String(Math.trunc(Number(args[0])));
      if (mName === "max") return Math.max(Number(args[0]), Number(args[1]));
      if (mName === "min") return Math.min(Number(args[0]), Number(args[1]));
    }

    if (className === "Double") {
      if (mName === "parseDouble" || mName === "valueOf") {
        const raw = String(args[0]).trim();
        const parsed = Number(raw);
        if (raw === "" || Number.isNaN(parsed)) {
          throw new JavaExceptionSignal(
            "NumberFormatException",
            `For input string: "${args[0]}"`,
            line
          );
        }
        return parsed;
      }
      if (mName === "toString") return String(Number(args[0]));
    }

    if (className === "Boolean") {
      if (mName === "parseBoolean" || mName === "valueOf") {
        return String(args[0]).trim().toLowerCase() === "true";
      }
      if (mName === "toString") return String(Boolean(args[0]));
    }

    if (className === "Character") {
      const c = String(args[0])[0] || "\0";
      if (mName === "isDigit") return /[0-9]/.test(c);
      if (mName === "isLetter") return /[a-zA-Z]/.test(c);
      if (mName === "isUpperCase") return /[A-Z]/.test(c);
      if (mName === "isLowerCase") return /[a-z]/.test(c);
      if (mName === "toUpperCase") return c.toUpperCase();
      if (mName === "toLowerCase") return c.toLowerCase();
    }

    if (className === "Arrays") {
      const arr = args[0];
      if (arr && typeof arr === "object" && arr.kind === "JavaArray") {
        if (mName === "sort") {
          arr.elements.sort((x, y) => {
            if (typeof x === "number" && typeof y === "number") return x - y;
            return String(x).localeCompare(String(y));
          });
          return null;
        }
        if (mName === "toString") {
          return `[${arr.elements.map((e) => javaToString(e, line)).join(", ")}]`;
        }
        if (mName === "fill") {
          arr.elements.fill(args[1]);
          return null;
        }
        if (mName === "equals") {
          const arr2 = args[1];
          if (!arr2 || typeof arr2 !== "object" || arr2.kind !== "JavaArray") {
            return false;
          }
          if (arr.elements.length !== arr2.elements.length) return false;
          return arr.elements.every((v, idx) => v === arr2.elements[idx]);
        }
      }
      if (mName === "asList") {
        return {
          kind: "JavaBuiltin",
          className: "ArrayList",
          state: [...args],
        };
      }
    }

    if (className === "Collections") {
      const listObj = args[0];
      if (
        listObj &&
        typeof listObj === "object" &&
        listObj.kind === "JavaBuiltin" &&
        listObj.className === "ArrayList"
      ) {
        const list = listObj.state as JavaValue[];
        if (mName === "sort") {
          list.sort((x, y) => {
            if (typeof x === "number" && typeof y === "number") return x - y;
            return String(x).localeCompare(String(y));
          });
          return null;
        }
        if (mName === "reverse") {
          list.reverse();
          return null;
        }
      }
    }

    // ユーザー定義クラスの static メソッド呼び出し
    if (classMap.has(className)) {
      const found = findMethod(className, mName, args.length, args);
      if (found) {
        return invokeMethod(
          thisRef,
          className,
          found.cls.name,
          found.method,
          args,
          line
        );
      }
    }

    throw new JavaExceptionSignal(
      "NoSuchMethodError",
      `${className}.${mName} が見つかりません。`,
      line
    );
  };

  // 組み込みクラスのメソッド群 (Scanner, StringBuilder, ArrayList, HashMap, HashSet)
  const evalBuiltinMethod = (
    builtin: JavaBuiltinInstance,
    mName: string,
    args: JavaValue[],
    line: number
  ): JavaValue => {
    if (builtin.className === "Scanner") {
      const sc = builtin.state as ScannerState;
      const skipWhitespace = () => {
        while (sc.pos < sc.raw.length && /\s/.test(sc.raw[sc.pos])) {
          sc.pos++;
        }
      };

      const readToken = (): string => {
        skipWhitespace();
        if (sc.pos >= sc.raw.length) {
          throw new JavaExceptionSignal(
            "NoSuchElementException",
            "Scanner で読み取れるトークンがありません（標準入力の不足）。",
            line
          );
        }
        let tok = "";
        while (sc.pos < sc.raw.length && !/\s/.test(sc.raw[sc.pos])) {
          tok += sc.raw[sc.pos++];
        }
        return tok;
      };

      switch (mName) {
        case "hasNext": {
          let tmp = sc.pos;
          while (tmp < sc.raw.length && /\s/.test(sc.raw[tmp])) tmp++;
          return tmp < sc.raw.length;
        }
        case "hasNextLine":
          return sc.pos < sc.raw.length;
        case "hasNextInt": {
          let tmp = sc.pos;
          while (tmp < sc.raw.length && /\s/.test(sc.raw[tmp])) tmp++;
          let tok = "";
          while (tmp < sc.raw.length && !/\s/.test(sc.raw[tmp])) {
            tok += sc.raw[tmp++];
          }
          return /^[+-]?\d+$/.test(tok);
        }
        case "next":
          return readToken();
        case "nextInt":
        case "nextLong": {
          const tok = readToken();
          if (!/^[+-]?\d+$/.test(tok)) {
            throw new JavaExceptionSignal(
              "NumberFormatException",
              `Scanner.nextInt() に整数以外の値 "${tok}" が入力されました。`,
              line
            );
          }
          return parseInt(tok, 10);
        }
        case "nextDouble": {
          const tok = readToken();
          const val = Number(tok);
          if (Number.isNaN(val)) {
            throw new JavaExceptionSignal(
              "NumberFormatException",
              `Scanner.nextDouble() に数値以外の値 "${tok}" が入力されました。`,
              line
            );
          }
          return val;
        }
        case "nextLine": {
          // 直前の nextInt() 等の直後に残った改行1つ分は調整または現在位置から行末まで取得
          if (sc.pos >= sc.raw.length) {
            return "";
          }
          if (sc.raw[sc.pos] === "\r") sc.pos++;
          if (sc.raw[sc.pos] === "\n") sc.pos++;
          let lineStr = "";
          while (
            sc.pos < sc.raw.length &&
            sc.raw[sc.pos] !== "\n" &&
            sc.raw[sc.pos] !== "\r"
          ) {
            lineStr += sc.raw[sc.pos++];
          }
          return lineStr;
        }
        case "close":
          return null;
      }
    }

    if (builtin.className === "StringBuilder") {
      const sb = builtin.state as { buf: string };
      switch (mName) {
        case "append":
          sb.buf += javaToString(args[0], line);
          return builtin;
        case "reverse":
          sb.buf = sb.buf.split("").reverse().join("");
          return builtin;
        case "length":
          return sb.buf.length;
        case "charAt":
          return sb.buf[Math.trunc(Number(args[0]))];
        case "deleteCharAt": {
          const idx = Math.trunc(Number(args[0]));
          sb.buf = sb.buf.slice(0, idx) + sb.buf.slice(idx + 1);
          return builtin;
        }
        case "toString":
          return sb.buf;
      }
    }

    if (builtin.className === "ArrayList") {
      const list = builtin.state as JavaValue[];
      switch (mName) {
        case "add":
          if (args.length === 1) {
            list.push(args[0]);
            return true;
          } else {
            list.splice(Math.trunc(Number(args[0])), 0, args[1]);
            return null;
          }
        case "get": {
          const idx = Math.trunc(Number(args[0]));
          if (idx < 0 || idx >= list.length) {
            throw new JavaExceptionSignal(
              "IndexOutOfBoundsException",
              `Index ${idx} out of bounds for length ${list.length}`,
              line
            );
          }
          return list[idx];
        }
        case "set": {
          const idx = Math.trunc(Number(args[0]));
          if (idx < 0 || idx >= list.length) {
            throw new JavaExceptionSignal(
              "IndexOutOfBoundsException",
              `Index ${idx} out of bounds for length ${list.length}`,
              line
            );
          }
          const prev = list[idx];
          list[idx] = args[1];
          return prev;
        }
        case "remove": {
          if (typeof args[0] === "number") {
            const idx = Math.trunc(args[0]);
            if (idx < 0 || idx >= list.length) {
              throw new JavaExceptionSignal(
                "IndexOutOfBoundsException",
                `Index ${idx} out of bounds for length ${list.length}`,
                line
              );
            }
            return list.splice(idx, 1)[0];
          }
          const pos = list.indexOf(args[0]);
          if (pos !== -1) {
            list.splice(pos, 1);
            return true;
          }
          return false;
        }
        case "size":
          return list.length;
        case "isEmpty":
          return list.length === 0;
        case "contains":
          return list.includes(args[0]);
        case "indexOf":
          return list.indexOf(args[0]);
        case "clear":
          list.length = 0;
          return null;
        case "forEach": {
          const fn = args[0];
          if (fn && typeof fn === "object" && fn.kind === "JavaLambda") {
            for (const item of list) {
              invokeLambda(fn, [item]);
            }
          }
          return null;
        }
        case "toString":
          return javaToString(builtin, line);
      }
    }

    if (builtin.className === "HashMap") {
      const map = builtin.state as Map<string, { key: JavaValue; val: JavaValue }>;
      const keyOf = (k: JavaValue) => `${typeof k}:${javaToString(k, line)}`;
      switch (mName) {
        case "put": {
          const k = keyOf(args[0]);
          const prev = map.get(k)?.val ?? null;
          map.set(k, { key: args[0], val: args[1] });
          return prev;
        }
        case "get": {
          const k = keyOf(args[0]);
          return map.has(k) ? map.get(k)!.val : null;
        }
        case "getOrDefault": {
          const k = keyOf(args[0]);
          return map.has(k) ? map.get(k)!.val : args[1];
        }
        case "containsKey":
          return map.has(keyOf(args[0]));
        case "containsValue": {
          for (const [, entry] of map.entries()) {
            if (entry.val === args[0]) return true;
          }
          return false;
        }
        case "remove": {
          const k = keyOf(args[0]);
          const prev = map.get(k)?.val ?? null;
          map.delete(k);
          return prev;
        }
        case "size":
          return map.size;
        case "isEmpty":
          return map.size === 0;
        case "clear":
          map.clear();
          return null;
        case "keySet": {
          const keys: JavaValue[] = [];
          for (const [, entry] of map.entries()) keys.push(entry.key);
          return { kind: "JavaBuiltin", className: "HashSet", state: keys };
        }
        case "values": {
          const vals: JavaValue[] = [];
          for (const [, entry] of map.entries()) vals.push(entry.val);
          return { kind: "JavaBuiltin", className: "ArrayList", state: vals };
        }
        case "forEach": {
          const fn = args[0];
          if (fn && typeof fn === "object" && fn.kind === "JavaLambda") {
            for (const [, entry] of map.entries()) {
              invokeLambda(fn, [entry.key, entry.val]);
            }
          }
          return null;
        }
        case "toString":
          return javaToString(builtin, line);
      }
    }

    if (builtin.className === "HashSet") {
      const setList = builtin.state as JavaValue[];
      switch (mName) {
        case "add":
          if (!setList.includes(args[0])) {
            setList.push(args[0]);
            return true;
          }
          return false;
        case "contains":
          return setList.includes(args[0]);
        case "remove": {
          const idx = setList.indexOf(args[0]);
          if (idx !== -1) {
            setList.splice(idx, 1);
            return true;
          }
          return false;
        }
        case "size":
          return setList.length;
        case "isEmpty":
          return setList.length === 0;
        case "clear":
          setList.length = 0;
          return null;
        case "forEach": {
          const fn = args[0];
          if (fn && typeof fn === "object" && fn.kind === "JavaLambda") {
            for (const item of setList) {
              invokeLambda(fn, [item]);
            }
          }
          return null;
        }
        case "toString":
          return javaToString(builtin, line);
      }
    }

    throw new JavaExceptionSignal(
      "NoSuchMethodError",
      `${builtin.className}.${mName} は未対応です。`,
      line
    );
  };

  const invokeLambda = (
    lambda: JavaLambdaInstance,
    args: JavaValue[]
  ): JavaValue => {
    const env = new Environment(lambda.capturedEnv);
    for (let i = 0; i < lambda.node.paramNames.length; i++) {
      env.define(lambda.node.paramNames[i], args[i] ?? null);
    }
    try {
      if (lambda.node.body.kind === "BlockStmt") {
        evalBlock(
          lambda.node.body,
          env,
          lambda.thisRef,
          lambda.currentClass,
          false
        );
        return null;
      } else {
        return evalExpr(
          lambda.node.body,
          env,
          lambda.thisRef,
          lambda.currentClass
        );
      }
    } catch (sig) {
      if (sig instanceof ReturnSignal) return sig.value;
      throw sig;
    }
  };

  // ===========================================================================
  // main(String[] args) の検索と起動
  // ===========================================================================
  try {
    initStaticFields();

    const mainClass =
      program.classes.find((c) => c.name === "Main") ??
      program.classes.find((c) =>
        c.methods.some((m) => m.name === "main" && m.modifiers.includes("static"))
      );

    if (!mainClass) {
      return {
        status: "compile_error",
        stdout,
        stderr: "Mainクラスまたはmainメソッドが見つかりません。",
        diagnostics: [],
        executionTimeMs: Math.round(performance.now() - startTime),
        stepsExecuted: steps,
      };
    }

    const mainMethod = mainClass.methods.find(
      (m) => m.name === "main" && m.modifiers.includes("static")
    );

    if (!mainMethod) {
      return {
        status: "compile_error",
        stdout,
        stderr: "public static void main(String[] args) メソッドが見つかりません。",
        diagnostics: [],
        executionTimeMs: Math.round(performance.now() - startTime),
        stepsExecuted: steps,
      };
    }

    const argsArray: JavaArrayInstance = {
      kind: "JavaArray",
      elementType: "String",
      dimensions: 1,
      elements: options.args ?? [],
    };

    invokeMethod(
      null,
      mainClass.name,
      mainClass.name,
      mainMethod,
      [argsArray],
      mainMethod.line
    );

    return {
      status: "success",
      stdout,
      stderr,
      diagnostics: [],
      executionTimeMs: Math.max(1, Math.round(performance.now() - startTime)),
      stepsExecuted: steps,
    };
  } catch (sig) {
    const elapsed = Math.max(1, Math.round(performance.now() - startTime));

    if (sig instanceof StepLimitSignal) {
      const msg = `実行ステップ数が上限（${maxSteps.toLocaleString()}ステップ）を超えました（${sig.line}行目付近）。無限ループになっていないか確認してください。`;
      return {
        status: "step_limit_exceeded",
        stdout,
        stderr: msg,
        diagnostics: [],
        runtimeError: {
          exceptionClass: "StepLimitExceededError",
          message: msg,
          japaneseHint:
            "while文やfor文の終了条件が常に true になっていないか、カウンタ変数が更新されているか確認してください。",
          line: sig.line,
          stackTrace: [...callStack].reverse(),
        },
        executionTimeMs: elapsed,
        stepsExecuted: steps,
      };
    }

    if (sig instanceof OutputLimitSignal) {
      const msg = `標準出力の文字数が上限（${maxOutputLength.toLocaleString()}文字）を超えました（${sig.line}行目付近）。`;
      return {
        status: "output_limit_exceeded",
        stdout,
        stderr: msg,
        diagnostics: [],
        runtimeError: {
          exceptionClass: "OutputLimitExceededError",
          message: msg,
          japaneseHint:
            "ループの中で System.out.println を過剰に呼び出していないか確認してください。",
          line: sig.line,
          stackTrace: [...callStack].reverse(),
        },
        executionTimeMs: elapsed,
        stepsExecuted: steps,
      };
    }

    if (sig instanceof JavaExceptionSignal) {
      const hint = getRuntimeExceptionHint(sig.exceptionClass, sig.message);
      const formattedErr = `Exception in thread "main" java.lang.${sig.exceptionClass}: ${sig.message} (at line ${sig.line})\n💡 ヒント: ${hint}`;
      return {
        status: "runtime_error",
        stdout,
        stderr: formattedErr,
        diagnostics: [],
        runtimeError: {
          exceptionClass: sig.exceptionClass,
          message: sig.message,
          japaneseHint: hint,
          line: sig.line,
          stackTrace: [...callStack].reverse(),
        },
        executionTimeMs: elapsed,
        stepsExecuted: steps,
      };
    }

    const unknownMsg = sig instanceof Error ? sig.message : String(sig);
    return {
      status: "runtime_error",
      stdout,
      stderr: `実行時エラー: ${unknownMsg}`,
      diagnostics: [],
      executionTimeMs: elapsed,
      stepsExecuted: steps,
    };
  }
}
