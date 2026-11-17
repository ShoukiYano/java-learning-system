// =============================================================================
// 自作Javaインタプリタ 共通型・AST定義・実行オプション
// （ブラウザ Web Worker と Node.js Route Handler の両方で動作、DOM/Node API非依存）
// =============================================================================

export interface JavaDiagnostic {
  line: number;
  column: number;
  endColumn?: number;
  message: string;
  japaneseHint: string; // 初心者向けの日本語補足
  severity: "error" | "warning";
}

export interface JavaRuntimeErrorInfo {
  exceptionClass: string; // 例: "ArithmeticException", "NullPointerException"
  message: string;
  japaneseHint: string;
  line: number;
  stackTrace: string[];
}

export interface JavaExecutionOptions {
  stdin?: string;
  maxSteps?: number; // デフォルト: 10,000,000 ステップ（無限ループ対策）
  maxCallDepth?: number; // デフォルト: 500（StackOverflowError対策）
  maxOutputLength?: number; // デフォルト: 100,000 文字（過剰出力対策）
  args?: string[];
}

export interface JavaExecutionResult {
  status:
    | "success"
    | "compile_error"
    | "runtime_error"
    | "step_limit_exceeded"
    | "output_limit_exceeded";
  stdout: string;
  stderr: string;
  diagnostics: JavaDiagnostic[];
  runtimeError?: JavaRuntimeErrorInfo;
  executionTimeMs: number;
  stepsExecuted: number;
}

// =============================================================================
// トークン定義
// =============================================================================
export type TokenType =
  | "KEYWORD"
  | "IDENTIFIER"
  | "INT_LITERAL"
  | "LONG_LITERAL"
  | "DOUBLE_LITERAL"
  | "CHAR_LITERAL"
  | "STRING_LITERAL"
  | "BOOLEAN_LITERAL"
  | "NULL_LITERAL"
  | "OPERATOR"
  | "PUNCTUATION"
  | "EOF";

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

// =============================================================================
// 抽象構文木（AST）ノード定義
// =============================================================================
export interface SourceLocation {
  line: number;
  column: number;
}

export interface TypeNode {
  baseType: string; // "int", "double", "String", "ArrayList", カスタムクラス名など
  dimensions: number; // 0 = スカラー, 1 = 1次元配列, 2 = 2次元配列
  typeArgs?: TypeNode[]; // ジェネリクス型引数（構文として保持）
}

export interface ParameterNode {
  type: TypeNode;
  name: string;
  isVarArgs?: boolean;
}

export interface ProgramNode {
  kind: "Program";
  classes: ClassDeclNode[];
}

export interface ClassDeclNode extends SourceLocation {
  kind: "ClassDecl";
  name: string;
  isInterface: boolean;
  isAbstract: boolean;
  isPublic: boolean;
  superClass: string | null;
  interfaces: string[];
  fields: FieldDeclNode[];
  constructors: ConstructorDeclNode[];
  methods: MethodDeclNode[];
}

export interface FieldDeclNode extends SourceLocation {
  kind: "FieldDecl";
  modifiers: string[];
  type: TypeNode;
  name: string;
  initializer: ExprNode | null;
}

export interface ConstructorDeclNode extends SourceLocation {
  kind: "ConstructorDecl";
  modifiers: string[];
  name: string;
  params: ParameterNode[];
  body: BlockStmtNode;
}

export interface MethodDeclNode extends SourceLocation {
  kind: "MethodDecl";
  modifiers: string[];
  returnType: TypeNode;
  name: string;
  params: ParameterNode[];
  body: BlockStmtNode | null; // abstract または interface の場合は null
}

// --- 文（Statements） ---
export type StmtNode =
  | BlockStmtNode
  | VarDeclStmtNode
  | ExprStmtNode
  | IfStmtNode
  | WhileStmtNode
  | DoWhileStmtNode
  | ForStmtNode
  | ForEachStmtNode
  | SwitchStmtNode
  | ReturnStmtNode
  | BreakStmtNode
  | ContinueStmtNode
  | TryStmtNode
  | ThrowStmtNode
  | SuperConstructorCallStmtNode
  | ThisConstructorCallStmtNode
  | EmptyStmtNode;

export interface BlockStmtNode extends SourceLocation {
  kind: "BlockStmt";
  statements: StmtNode[];
}

export interface VarDeclItem {
  name: string;
  dimensions: number;
  initializer: ExprNode | null;
}

export interface VarDeclStmtNode extends SourceLocation {
  kind: "VarDeclStmt";
  isFinal: boolean;
  type: TypeNode;
  declarations: VarDeclItem[];
}

export interface ExprStmtNode extends SourceLocation {
  kind: "ExprStmt";
  expr: ExprNode;
}

export interface IfStmtNode extends SourceLocation {
  kind: "IfStmt";
  condition: ExprNode;
  thenBranch: StmtNode;
  elseBranch: StmtNode | null;
}

export interface WhileStmtNode extends SourceLocation {
  kind: "WhileStmt";
  condition: ExprNode;
  body: StmtNode;
}

export interface DoWhileStmtNode extends SourceLocation {
  kind: "DoWhileStmt";
  body: StmtNode;
  condition: ExprNode;
}

export interface ForStmtNode extends SourceLocation {
  kind: "ForStmt";
  init: StmtNode | ExprNode | null;
  condition: ExprNode | null;
  update: ExprNode[];
  body: StmtNode;
}

export interface ForEachStmtNode extends SourceLocation {
  kind: "ForEachStmt";
  varType: TypeNode;
  varName: string;
  iterable: ExprNode;
  body: StmtNode;
}

export interface SwitchCaseNode extends SourceLocation {
  labels: (ExprNode | null)[]; // null は default
  isArrow: boolean;
  statements: StmtNode[];
}

export interface SwitchStmtNode extends SourceLocation {
  kind: "SwitchStmt";
  expr: ExprNode;
  cases: SwitchCaseNode[];
}

export interface ReturnStmtNode extends SourceLocation {
  kind: "ReturnStmt";
  value: ExprNode | null;
}

export interface BreakStmtNode extends SourceLocation {
  kind: "BreakStmt";
}

export interface ContinueStmtNode extends SourceLocation {
  kind: "ContinueStmt";
}

export interface CatchClauseNode extends SourceLocation {
  exceptionTypes: string[];
  varName: string;
  body: BlockStmtNode;
}

export interface TryStmtNode extends SourceLocation {
  kind: "TryStmt";
  tryBlock: BlockStmtNode;
  catches: CatchClauseNode[];
  finallyBlock: BlockStmtNode | null;
}

export interface ThrowStmtNode extends SourceLocation {
  kind: "ThrowStmt";
  expr: ExprNode;
}

export interface SuperConstructorCallStmtNode extends SourceLocation {
  kind: "SuperConstructorCallStmt";
  args: ExprNode[];
}

export interface ThisConstructorCallStmtNode extends SourceLocation {
  kind: "ThisConstructorCallStmt";
  args: ExprNode[];
}

export interface EmptyStmtNode extends SourceLocation {
  kind: "EmptyStmt";
}

// --- 式（Expressions） ---
export type ExprNode =
  | LiteralExprNode
  | IdentifierExprNode
  | ThisExprNode
  | SuperExprNode
  | BinaryExprNode
  | UnaryExprNode
  | UpdateExprNode
  | AssignExprNode
  | ConditionalExprNode
  | CallExprNode
  | MemberExprNode
  | ArrayAccessExprNode
  | NewObjectExprNode
  | NewArrayExprNode
  | ArrayInitializerExprNode
  | CastExprNode
  | InstanceOfExprNode
  | LambdaExprNode;

export interface LiteralExprNode extends SourceLocation {
  kind: "LiteralExpr";
  literalType: "int" | "long" | "double" | "boolean" | "char" | "String" | "null";
  value: number | boolean | string | null;
}

export interface IdentifierExprNode extends SourceLocation {
  kind: "IdentifierExpr";
  name: string;
}

export interface ThisExprNode extends SourceLocation {
  kind: "ThisExpr";
}

export interface SuperExprNode extends SourceLocation {
  kind: "SuperExpr";
}

export interface BinaryExprNode extends SourceLocation {
  kind: "BinaryExpr";
  operator: string;
  left: ExprNode;
  right: ExprNode;
}

export interface UnaryExprNode extends SourceLocation {
  kind: "UnaryExpr";
  operator: string; // "+", "-", "!", "~"
  operand: ExprNode;
}

export interface UpdateExprNode extends SourceLocation {
  kind: "UpdateExpr";
  operator: "++" | "--";
  prefix: boolean;
  operand: ExprNode;
}

export interface AssignExprNode extends SourceLocation {
  kind: "AssignExpr";
  operator: string; // "=", "+=", "-=", "*=", "/=", "%=" など
  target: ExprNode;
  value: ExprNode;
}

export interface ConditionalExprNode extends SourceLocation {
  kind: "ConditionalExpr";
  condition: ExprNode;
  consequent: ExprNode;
  alternate: ExprNode;
}

export interface CallExprNode extends SourceLocation {
  kind: "CallExpr";
  callee: ExprNode | null; // null の場合は同一クラス内のメソッド呼び出し
  methodName: string;
  args: ExprNode[];
}

export interface MemberExprNode extends SourceLocation {
  kind: "MemberExpr";
  object: ExprNode;
  property: string;
}

export interface ArrayAccessExprNode extends SourceLocation {
  kind: "ArrayAccessExpr";
  array: ExprNode;
  index: ExprNode;
}

export interface NewObjectExprNode extends SourceLocation {
  kind: "NewObjectExpr";
  type: TypeNode;
  args: ExprNode[];
}

export interface NewArrayExprNode extends SourceLocation {
  kind: "NewArrayExpr";
  elementType: TypeNode;
  sizeExprs: (ExprNode | null)[];
  initializer: ArrayInitializerExprNode | null;
}

export interface ArrayInitializerExprNode extends SourceLocation {
  kind: "ArrayInitializerExpr";
  elements: ExprNode[];
}

export interface CastExprNode extends SourceLocation {
  kind: "CastExpr";
  targetType: TypeNode;
  expr: ExprNode;
}

export interface InstanceOfExprNode extends SourceLocation {
  kind: "InstanceOfExpr";
  expr: ExprNode;
  checkType: TypeNode;
}

export interface LambdaExprNode extends SourceLocation {
  kind: "LambdaExpr";
  paramNames: string[];
  body: BlockStmtNode | ExprNode;
}
