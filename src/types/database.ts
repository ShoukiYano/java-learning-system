/**
 * ファイル概要：
 * データベース型定義（Supabase PostgreSQL スキーマ対応）
 *
 * 主な役割：
 * - システム全体で共通利用するデータモデル（企業、ユーザープロファイル、コース、章、問題、テストケース、提出、進捗など）のTypeScript型定義
 * - 各種ステータス型（UserRole, Difficulty, ProgressStatus, SubmissionStatus, CourseLockStatus等）の定義
 *
 * 注意事項：
 * - Supabaseのテーブル定義（supabase/migrations/配下）と整合性を保つ必要があります。
 * - カラム名や型を変更する場合は、DBマイグレーションおよび各APIの入出力と連動して修正してください。
 */

/**
 * ユーザー権限ロール
 * - admin: システム全体を統括するマスター管理者（カリキュラム作成、企業テナント管理等）
 * - student: 研修を受講するプログラミング学習者（カリキュラム受講、コード提出、ダッシュボード確認）
 * - company: 研修導入企業の担当者・メンター（自社受講生の進捗確認、評価・コメント投稿、受講ロック管理）
 */
export type UserRole = "admin" | "student" | "company";

/**
 * 演習問題の難易度レベル
 * - easy: 初級（基本文法・基礎概念）
 * - medium: 中級（応用文法・典型アルゴリズム）
 * - hard: 上級（複合演習・実務想定）
 */
export type Difficulty = "easy" | "medium" | "hard";

/**
 * 演習問題で扱うプログラミング言語・処理系種別
 * - java: 自作Javaインタプリタで実行
 * - sql: 自作SQLクエリエンジンで実行
 */
export type ProblemLanguage = "java" | "sql";

/**
 * 各問題に対する受講生の進捗ステータス
 * - not_started: 未着手（未提出）
 * - in_progress: 挑戦中（提出したが未合格、または下書き保存中）
 * - completed: 全テスト合格クリア済み
 */
export type ProgressStatus = "not_started" | "in_progress" | "completed";

/**
 * コード提出時の採点・実行結果ステータス
 * - passed: 全テストケース（公開＋非公開）に完全一致合格
 * - wrong_answer: 出力結果不一致（期待値と実際値の差分あり）
 * - compile_error: 構文エラー（JavaのパースエラーやSQLの構文エラー）
 * - runtime_error: 実行時例外（NullPointerException, 配列範囲外, ゼロ除算等）
 * - time_limit_exceeded: 制限時間・ステップ数超過（無限ループ防止）
 */
export type SubmissionStatus =
  | "passed"
  | "wrong_answer"
  | "compile_error"
  | "runtime_error"
  | "time_limit_exceeded";

/**
 * 企業テナントエンティティ（companiesテーブル対応）
 */
export interface Company {
  /** 企業一意ID（UUID） */
  id: string;
  /** 企業名（例: 株式会社ACMEテクノロジーズ） */
  name: string;
  /** 配布用企業コード（例: ACME2025。受講生登録時および企業ログイン時のテナント識別に利用） */
  company_code: string;
  /** 代表連絡先メールアドレス（未設定時はnull） */
  contact_email: string | null;
  /** レコード作成日時（ISO 8601文字列） */
  created_at: string;
}

/**
 * ユーザープロファイル（profilesテーブル対応）
 * Supabase Authのauth.usersと1対1で連動
 */
export interface Profile {
  /** ユーザーID（auth.users.idと一致するUUID） */
  id: string;
  /** メールアドレス */
  email: string;
  /** 氏名（表示名） */
  full_name: string;
  /** ロール（admin / student / company） */
  role: UserRole;
  /** 所属企業のID（受講生または企業担当者の場合に設定。システム管理者はnull） */
  company_id: string | null;
  /** アバター画像URL（未設定時はnull） */
  avatar_url: string | null;
  /** 連続学習日数（ストリークカウント） */
  streak_days: number;
  /** 最終学習日（YYYY-MM-DD形式、未学習時はnull） */
  last_study_date: string | null;
  /** 最終ログイン日時（ISO 8601形式、未ログイン時はnull） */
  last_login_at: string | null;
  /** アカウント作成日時（ISO 8601形式） */
  created_at: string;
  /** リレーション結合時の企業情報（結合クエリ時のみ存在） */
  companies?: Company | null;
}

/**
 * コース定義（coursesテーブル対応）
 * 例: Java入門コース、SQL実践コース
 */
export interface Course {
  /** コース一意ID（UUID） */
  id: string;
  /** コース名 */
  title: string;
  /** コースの概要・習得目標説明 */
  description: string;
  /** 一覧画面での表示順序番号（昇順ソート用） */
  order_index: number;
  /** 公開フラグ（falseの場合は管理者以外には非公開） */
  is_published: boolean;
  /** 前提条件となるコースのID（nullの場合は前提なし。他コースID指定時はその修了が受講条件となる） */
  prerequisite_course_id: string | null;
  /** 作成日時 */
  created_at: string;
}

/**
 * 章定義（chaptersテーブル対応）
 * コース配下に複数存在（例: 第1章 出力と変数）
 */
export interface Chapter {
  /** 章一意ID（UUID） */
  id: string;
  /** 所属コースID */
  course_id: string;
  /** 章タイトル */
  title: string;
  /** 章の学習内容詳細（null許容） */
  description: string | null;
  /** コース内での表示順序番号 */
  order_index: number;
  /** 公開フラグ */
  is_published: boolean;
  /** 作成日時 */
  created_at: string;
}

/**
 * 単元定義（lessonsテーブル対応）
 * 章配下に複数存在（例: 1-1 標準入出力と変数の基本）
 */
export interface Lesson {
  /** 単元一意ID（UUID） */
  id: string;
  /** 所属章ID */
  chapter_id: string;
  /** 単元タイトル */
  title: string;
  /** 解説Markdown本文（null許容） */
  content_md: string | null;
  /** 章内での表示順序番号 */
  order_index: number;
  /** 公開フラグ */
  is_published: boolean;
  /** 作成日時 */
  created_at: string;
}

/**
 * 演習問題定義（problemsテーブル対応）
 */
export interface Problem {
  /** 問題一意ID（UUID） */
  id: string;
  /** 所属単元ID */
  lesson_id: string;
  /** 言語種別（"java" | "sql"。省略時はタグまたは初期コードから自動判定） */
  language?: ProblemLanguage;
  /** 問題タイトル */
  title: string;
  /** 問題文・仕様説明（Markdown形式） */
  description_md: string;
  /** 難易度（easy / medium / hard） */
  difficulty: Difficulty;
  /** 想定解答所要時間（分単位） */
  estimated_minutes: number;
  /** 分野・トピックのタグ一覧（例: ["変数", "算術演算"]） */
  tags: string[];
  /** エディタ初期表示用コード（スターターコード） */
  starter_code: string;
  /** 模範解答コード（管理者参照および自動テスト基準） */
  solution_code: string;
  /** 解答後の解説文（Markdown形式） */
  explanation_md: string;
  /** 単元内での表示順序番号 */
  order_index: number;
  /** 公開フラグ */
  is_published: boolean;
  /** 作成日時 */
  created_at: string;
}

/**
 * 自動採点用テストケース定義（test_casesテーブル対応）
 */
export interface TestCase {
  /** テストケース一意ID（UUID） */
  id: string;
  /** 対象問題ID */
  problem_id: string;
  /** テストケース名（例: 基本ケース1） */
  name: string;
  /** 入力データ（標準入力文字列またはSQL初期化DDL/DML） */
  input: string;
  /** 期待される標準出力文字列またはSQL結果テーブルJSON */
  expected_output: string;
  /** 非公開テストフラグ（trueの場合はクライアントに期待値を送らずサーバー側のみで検証） */
  is_hidden: boolean;
  /** テスト実行順序番号 */
  order_index: number;
}

/**
 * 段階的ヒント定義（hintsテーブル対応）
 * 1問につき最大3段階のヒントを提供
 */
export interface Hint {
  /** ヒント一意ID（UUID） */
  id: string;
  /** 対象問題ID */
  problem_id: string;
  /** ヒント段階番号（1: 方針ヒント, 2: 構文ヒント, 3: 擬似コード/ほぼ正解） */
  step_number: 1 | 2 | 3;
  /** ヒント本文（Markdown形式） */
  content_md: string;
}

/**
 * 受講生によるコード提出履歴（submissionsテーブル対応）
 */
export interface Submission {
  /** 提出履歴一意ID（UUID） */
  id: string;
  /** 提出受講生のユーザーID */
  user_id: string;
  /** 提出対象の問題ID */
  problem_id: string;
  /** 提出されたソースコード本文 */
  code: string;
  /** 判定結果ステータス */
  status: SubmissionStatus;
  /** 通過テストケース数 */
  passed_count: number;
  /** 全テストケース数 */
  total_count: number;
  /** コード実行所要時間（ミリ秒、エラー等で未計測時はnull） */
  execution_time_ms: number | null;
  /** 推定消費メモリ（KB、未計測時はnull） */
  memory_kb: number | null;
  /** コンパイルエラーまたは構文エラーのメッセージ（正常時はnull） */
  compile_error: string | null;
  /** この提出にかかった解答所要時間（秒） */
  time_spent_seconds: number;
  /** 提出日時（ISO 8601） */
  created_at: string;
  /** リレーション結合時の問題サマリー情報 */
  problems?: Pick<Problem, "id" | "title" | "difficulty" | "tags">;
  /** リレーション結合時の受講生プロファイルサマリー情報 */
  profiles?: Pick<Profile, "id" | "full_name" | "email" | "company_id">;
}

/**
 * 受講生の問題別進捗ステータス（progressテーブル対応）
 */
export interface Progress {
  /** 進捗レコード一意ID（UUID） */
  id: string;
  /** 受講生ID */
  user_id: string;
  /** 問題ID */
  problem_id: string;
  /** 現在の進捗状態（not_started / in_progress / completed） */
  status: ProgressStatus;
  /** 累計提出回数（挑戦回数） */
  attempts_count: number;
  /** 累計学習所要時間（秒） */
  total_time_spent_seconds: number;
  /** 開放済みのヒント段階（0: 未開放, 1〜3: 開放済みレベル） */
  unlocked_hint_step: number;
  /** 初回合格クリア完了日時（未完了時はnull） */
  completed_at: string | null;
  /** 最終更新日時 */
  updated_at: string;
}

/**
 * 講師・企業担当者から受講生への評価・コメント（feedbacksテーブル対応）
 */
export interface Feedback {
  /** 評価レコード一意ID（UUID） */
  id: string;
  /** 対象受講生のユーザーID */
  student_id: string;
  /** 評価者（管理者または企業担当者）のユーザーID */
  admin_id: string;
  /** 関連するコード提出ID（全般フィードバックの場合はnull許容） */
  submission_id: string | null;
  /** 5段階評価スコア（1〜5、任意。未設定時はnull） */
  rating: number | null;
  /** フィードバックコメント本文 */
  comment: string;
  /** 投稿日時 */
  created_at: string;
  /** リレーション結合時の投稿者プロファイル */
  admin?: Pick<Profile, "id" | "full_name">;
  /** 結合時の対象問題タイトル（存在する場合） */
  problem_title?: string;
}

/**
 * システム内お知らせ情報（announcementsテーブル対応）
 */
export interface Announcement {
  /** お知らせ一意ID（UUID） */
  id: string;
  /** お知らせタイトル */
  title: string;
  /** お知らせ本文（Markdown形式） */
  content_md: string;
  /** 対象企業ID（null: 全体向け公開、特定企業ID指定: そのテナント企業専用） */
  company_id: string | null;
  /** 作成者のユーザーID */
  created_by: string | null;
  /** 配信作成日時 */
  created_at: string;
}

/**
 * 日々の学習アクティビティログ（study_logsテーブル対応）
 * 学習カレンダーやGitHub風草グラフの描画に利用
 */
export interface StudyLog {
  /** ログ一意ID（UUID） */
  id: string;
  /** 受講生ユーザーID */
  user_id: string;
  /** 学習日（YYYY-MM-DD形式） */
  study_date: string;
  /** 当日の合計学習時間（分単位） */
  minutes: number;
  /** 当日のクリア問題数 */
  problems_solved: number;
}

/**
 * 受講生ごとのコース受講制限オーバーライドステータス
 * - auto: 前提条件（前コースの全問クリア）に準拠した自動判定（デフォルト）
 * - unlocked: 前提条件に関わらず即座に受講可能とする特別解放
 * - locked: 前提条件クリア有無に関わらず受講不可とする手動ロック
 */
export type CourseLockStatus = "auto" | "unlocked" | "locked";

/**
 * 受講生別コースロック管理レコード（student_course_locksテーブル対応）
 */
export interface StudentCourseLock {
  /** レコード一意ID（UUID） */
  id: string;
  /** 対象受講生のユーザーID */
  user_id: string;
  /** 対象コースのID */
  course_id: string;
  /** 設定されたロックスタイル（auto / unlocked / locked） */
  status: CourseLockStatus;
  /** 管理メモ・設定理由（null許容） */
  note: string | null;
  /** 更新者のユーザーID */
  updated_by: string | null;
  /** レコード作成日時 */
  created_at: string;
  /** レコード更新日時 */
  updated_at: string;
}

/**
 * 受講生詳細画面やカリキュラム一覧で利用する、コース進捗＋ロック状態の集約表示用アイテム型
 */
export interface StudentCourseStatusItem {
  /** コースID */
  courseId: string;
  /** コースタイトル */
  courseTitle: string;
  /** コース説明文 */
  courseDescription: string;
  /** 表示順序番号 */
  orderIndex: number;
  /** トラック表示用ラベル（例: "Java Programming Track" / "SQL Database Track"） */
  trackLabel: string;
  /** コース内総問題数 */
  totalProblems: number;
  /** この受講生がクリアした問題数 */
  completedProblems: number;
  /** 進捗パーセンテージ（0〜100） */
  progressPercent: number;
  /** 前提コースのID（nullの場合は前提なし） */
  prerequisiteCourseId: string | null;
  /** 前提コースのタイトル（存在する場合） */
  prerequisiteCourseTitle: string | null;
  /** 前提コースがクリアされているかどうかの真偽値 */
  isPrerequisiteCompleted: boolean;
  /** 個別オーバーライド設定（auto / unlocked / locked） */
  lockStatus: CourseLockStatus;
  /** 最終的に現在受講がロックされているかどうかの実効フラグ */
  isEffectiveLocked: boolean;
  /** ロックまたは解放の理由説明文（受講生画面でのガイド表示用） */
  lockReason: string;
}

/**
 * 企業担当者（マネージャー）アカウント情報
 * 企業ポータル（/company/login）にログイン可能なユーザーアカウント
 */
export interface CompanyManager {
  /** ユーザー一意ID（UUID、auth.users.idおよびprofiles.idと一致） */
  id: string;
  /** ログイン用メールアドレス */
  email: string;
  /** 担当者氏名・部署名（例: ACME人事部 研修担当） */
  full_name: string;
  /** ロール種別（固定値: "company"） */
  role: "company";
  /** 所属テナント企業のID */
  company_id: string;
  /** アカウント作成日時 */
  created_at: string;
  /** 最終ログイン日時（未ログイン時はnull） */
  last_login_at: string | null;
}
