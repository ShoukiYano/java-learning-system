-- =============================================================================
-- 1年間ITエンジニア育成カリキュラム拡張マイグレーション（冪等・何度でも再実行可能）
-- 追加コース（5コース・17章・17単元・42演習）：
--   1. ITリテラシー導入コース（3日・6問）
--   2. Excel実務マスターコース（1か月・12問）
--   3. HTML＆CSS実践コース（1か月・12問）
--   4. Spring Boot＋SQL 個人開発：商品管理システム構築（2か月・6ステップ）
--   5. チーム開発実践（3人1組）：ログイン機能付き総合業務Webシステム（3か月・6ステップ）
-- ＋ 既存6コース（Java 4コース / SQL / Git）の並び順（order_index 1〜11）を更新
-- =============================================================================

-- 1. 全11コースの登録・並び順更新
INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('11111111-1111-4111-8111-111111111111', 'ITリテラシー導入コース：IT・Web開発の仕組みと現場基礎（3日間）', 'Webアプリが動く仕組み・PC/パス/UTF-8・HTTP/HTTPS・情報セキュリティ・開発工程（要件定義〜テスト）・現場の質問力まで、Mermaid図解と確認テストでわかりやすく習得します。', 1, true, NULL)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id;

INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('11111111-1111-4111-8111-111111111112', 'Excel実務マスターコース：調査・突合・報告レポート実践（1か月）', 'ブラウザ上のインタラクティブExcelシートで手を動かしながら、四則演算・SUM/AVERAGE・絶対参照・IF・COUNTIF/SUMIF・VLOOKUP/XLOOKUP・IFERROR・データ突合と月次報告集計を習得します。', 2, true, '11111111-1111-4111-8111-111111111111')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id;

INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('11111111-1111-4111-8111-111111111113', 'HTML＆CSS実践コース：リアルタイムプレビュー画面構築（1か月）', 'コードを書いた瞬間に右側のプレビュー画面へ反映される実践演習で、見出し・テーブル・入力フォーム・ボックスモデル・Flexbox・CSS Grid・レスポンシブ対応まで習得します。', 3, true, '11111111-1111-4111-8111-111111111112')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id;

INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('11111111-1111-4111-8111-111111111101', 'Java入門コース：ゼロから学ぶ基礎文法とオブジェクト指向入門（Java 4か月①）', '標準出力・変数・データ型・四則演算・Scanner入力・条件分岐（if/switch）・ループ・配列・メソッド・クラス設計の基礎まで全16問のコーディング演習で体系的に習得します。', 4, true, '11111111-1111-4111-8111-111111111113')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id;

INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('0b083361-6d07-47a9-a787-508913d9efa8', 'Java初級コース：二次元配列・メソッド設計・オブジェクト指向応用（Java 4か月②）', '店舗売上の二次元配列集計、オーバーロード設計、staticによる自動採番、決済インターフェースとポリモーフィズムなど実務基礎へ直結するオブジェクト指向応用を習得します。', 5, true, '11111111-1111-4111-8111-111111111101')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id;

INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('c4bd0c61-1a12-4d2a-af9d-ac2eb8a12165', 'Java中級コース：コレクション・標準API・CSV処理・例外ハンドリング（Java 4か月③）', '実務で毎日使う ArrayList / HashMap による顧客検索・売上集計、CSVデータのパース処理、try-catch / throw を使った安全な在庫引当・例外制御を習得します。', 6, true, '0b083361-6d07-47a9-a787-508913d9efa8')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id;

INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('bb827c60-3d1d-40db-ac42-5da47866d141', 'Java上級コース：DAO設計・APIバリデーション・顧客案件管理実践（Java 4か月④）', 'DAOリポジトリ設計、REST API入力バリデーション＆ステータス判定、顧客・案件管理システムのService層集計、境界値単体テスト検証など案件参画レベルの実践力を養います。', 7, true, 'c4bd0c61-1a12-4d2a-af9d-ac2eb8a12165')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id;

INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('11111111-1111-4111-8111-111111111102', 'SQL実践コース：データ抽出・集計・テーブル結合マスター（2か月）', 'SELECT文の基本とWHERE条件指定からスタートし、GROUP BY / HAVING による集計分析、INNER JOIN / LEFT JOIN による複数テーブル結合まで全30問の実践クエリ演習で習得します。', 8, true, 'bb827c60-3d1d-40db-ac42-5da47866d141')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id;

INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('4107aaa5-10f0-41ca-8c22-a3a99eeebcbb', 'Git実践マスター：ビジュアル分岐・マージ演習（3日間）', '以降の開発・チーム開発に不可欠なGit操作を、ブラウザ上でコミットやブランチ分岐・マージ・リベースを視覚化しながら直感的に習得します。', 9, true, '11111111-1111-4111-8111-111111111102')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id;

INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('11111111-1111-4111-8111-111111111114', 'Spring Boot＋SQL 個人開発：商品管理システム構築（2か月・詳細設計書付）', 'Eclipse・Spring Boot・PostgreSQL・GitHubの導入から、配布Excel詳細設計書（全7シート）を読み解いて商品管理システム（検索・CRUD・バリデーション・ログイン）を構築しGitHub URLで提出します。', 10, true, '4107aaa5-10f0-41ca-8c22-a3a99eeebcbb')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id;

INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('11111111-1111-4111-8111-111111111115', 'チーム開発実践（3人1組）：ログイン機能付き総合業務Webシステム（3か月・詳細設計書付）', 'Eclipse・Spring Boot・PostgreSQL・GitHub（ブランチ/PR/レビュー運用）を用い、3人1組・1人3ページ（計9画面）＋共通ログイン機能の業務システムをExcel詳細設計書から構築しGitHub URLで提出します。', 11, true, '11111111-1111-4111-8111-111111111114')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id;

-- 2. 新規17章の登録
INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221101', '11111111-1111-4111-8111-111111111111', '第1章（1日目）：ITとは？Webシステムが動く仕組み', 'IT・ソフトウェア・ブラウザ・サーバー・データベースの役割を図解で理解します。', 1, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221102', '11111111-1111-4111-8111-111111111111', '第2章（2日目）：ネットワークと情報セキュリティの基礎', 'HTTP/HTTPS・IPアドレス・DNS・パスワード管理や情報漏洩対策を学びます。', 2, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221103', '11111111-1111-4111-8111-111111111111', '第3章（3日目）：システム開発の流れとエンジニアの働き方', '要件定義〜詳細設計〜実装〜テストの工程と、現場で必要な設計書・報連相を学びます。', 3, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221201', '11111111-1111-4111-8111-111111111112', '第1章（1週目）：Excel基本数式・集計関数・絶対参照', '四則演算、SUM/AVERAGE/MAX/MIN、そして実務でつまずきやすい絶対参照（$）を画面上のシートで習得します。', 1, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221202', '11111111-1111-4111-8111-111111111112', '第2章（2週目）：IF・COUNTIF・SUMIFによる条件判定と集計', '目標達成の自動判定や、ステータス別件数調査・部署別金額集計を関数で自動化します。', 2, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221203', '11111111-1111-4111-8111-111111111112', '第3章（3週目）：VLOOKUP・XLOOKUP・IFERRORによるデータ参照', 'マスタ表からの情報自動取得と、実務で必須のエラーハンドリング（IFERROR）を習得します。', 3, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221204', '11111111-1111-4111-8111-111111111112', '第4章（4週目）：実務データ調査・突合チェック・報告レポート作成', '文字列整形、発注vs納品データの差異突合、月次報告サマリー表の作成まで実務シナリオで仕上げます。', 4, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221301', '11111111-1111-4111-8111-111111111113', '第1章（1週目）：HTML基礎（見出し・リスト・リンク・テーブル）', 'コードを書いた瞬間に右側のプレビュー画面が変わるライブ演習でHTMLの基本タグを習得します。', 1, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221302', '11111111-1111-4111-8111-111111111113', '第2章（2週目）：HTMLフォームとCSS装飾・ボックスモデル', '業務システムに必須の入力フォームと、CSSのクラス・色・余白（padding/margin/border）を学びます。', 2, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221303', '11111111-1111-4111-8111-111111111113', '第3章（3週目）：Flexbox & CSS Gridによるモダンレイアウト', 'ヘッダーナビゲーション、横並び商品カード、グリッドダッシュボードを自在に配置します。', 3, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221304', '11111111-1111-4111-8111-111111111113', '第4章（4週目）：レスポンシブ対応＆業務Web画面総合仕上げ', 'ホバー効果・バッジ配置・メディアクエリによるスマホ対応・Spring Boot画面を意識した一覧ページを完成させます。', 4, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221401', '11111111-1111-4111-8111-111111111114', '第1章（1〜2週目）：開発環境構築（Eclipse・Spring Boot・PostgreSQL・GitHub）', 'はじめての方でも迷わず進められるよう、IDE・DB・GitHubの導入から疎通確認までをステップバイステップで進めます。', 1, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221402', '11111111-1111-4111-8111-111111111114', '第2章（3〜5週目）：Excel詳細設計書の読み解き＆商品CRUD実装', '配布のExcel詳細設計書を見ながら、DB構築・商品一覧・検索・詳細・新規登録・編集・論理削除・バリデーションを実装します。', 2, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221403', '11111111-1111-4111-8111-111111111114', '第3章（6〜8週目）：ログイン認証・単体/結合テスト＆GitHub最終提出', 'Spring Securityによるログイン認証とテスト仕様書に基づく全項目検証を行い、GitHub URLで最終提出します。', 3, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221501', '11111111-1111-4111-8111-111111111115', '第1章（1か月目）：チーム開発の流れ・役割分担（1人3画面）＆共通基盤構築', '3人1組での役割分担・Gitブランチ運用ルール策定・共通ログイン＆6テーブルDBの土台を全員で構築します。', 1, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221502', '11111111-1111-4111-8111-111111111115', '第2章（2か月目）：担当3ページの並行開発・Pull Requestレビュー＆コンフリクト解消', '各自のfeatureブランチで担当3ページを実装し、GitHub Pull Requestによる相互コードレビューと競合解消を実践します。', 2, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221503', '11111111-1111-4111-8111-111111111115', '第3章（3か月目）：横断結合テスト・バグ改修・成果発表＆GitHub最終提出', '3名の機能を統合した全10画面の横断結合テストを実施し、実務品質のチームリポジトリをGitHub URLで提出します。', 3, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

-- 3. 新規17単元の登録
INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331101', '22222222-2222-4222-8222-222222221101', 'Webアプリの全体像とPC基礎', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331102', '22222222-2222-4222-8222-222222221102', 'インターネット通信とセキュリティ', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331103', '22222222-2222-4222-8222-222222221103', '開発プロセスとチームでの仕事の進め方', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331201', '22222222-2222-4222-8222-222222221201', '基本計算と絶対参照マスター', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331202', '22222222-2222-4222-8222-222222221202', '条件分岐と条件付き集計', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331203', '22222222-2222-4222-8222-222222221203', 'マスタ参照とエラー処理', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331204', '22222222-2222-4222-8222-222222221204', '実務調査・突合・レポート総合演習', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331301', '22222222-2222-4222-8222-222222221301', 'HTMLドキュメント構造と表組み', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331302', '22222222-2222-4222-8222-222222221302', 'フォーム作成とCSSスタイリング基礎', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331303', '22222222-2222-4222-8222-222222221303', 'FlexboxとGridレイアウト実践', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331304', '22222222-2222-4222-8222-222222221304', 'レスポンシブ設計と総合画面制作', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331401', '22222222-2222-4222-8222-222222221401', 'Eclipse / PostgreSQL / Spring Boot 導入と接続確認', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331402', '22222222-2222-4222-8222-222222221402', '詳細設計書ベースでの商品管理CRUD構築', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331403', '22222222-2222-4222-8222-222222221403', '認証機能・品質検証・GitHub最終提出', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331501', '22222222-2222-4222-8222-222222221501', 'チーム体制構築・Gitフロー・共通認証基盤', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331502', '22222222-2222-4222-8222-222222221502', 'ブランチ並行開発・PRレビュー・画面結合', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331503', '22222222-2222-4222-8222-222222221503', '結合テスト・品質仕上げ・最終発表提出', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

-- 4. 新規42演習問題の登録
INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441101', '33333333-3333-4333-8333-333333331101', 'ITリテラシー 1-1：ITとは？Webアプリが動く仕組みを図で理解しよう', '## ITとWebシステムの基本構造

これから1年間かけて、あなたは **「業務Webシステムを設計書から作れるITエンジニア」** を目指します。
まずは、普段スマホやPCで見ているWebアプリの裏側がどう動いているのかを図で確認しましょう。

```mermaid
sequenceDiagram
    actor User as ユーザー（ブラウザ）
    participant Web as Webサーバー（HTML/CSS）
    participant App as アプリサーバー（Java / Spring Boot）
    participant DB as データベース（PostgreSQL / SQL）

    User->>Web: 1. 画面を開きたい（HTTPリクエスト）
    Web->>App: 2. 業務処理・商品データ取得を依頼
    App->>DB: 3. SQLでデータを検索（SELECT）
    DB-->>App: 4. 検索結果を返却
    App-->>Web: 5. 画面データ（HTML）を組み立て
    Web-->>User: 6. ブラウザに画面を表示（HTTPレスポンス）
```

### これから学ぶ1年間のロードマップと対応関係
- **HTML & CSS**：ブラウザに表示される「見た目・画面」を作る技術（フロントエンド）
- **Java & Spring Boot**：ログイン判定・計算・検索などの「頭脳」を作る技術（バックエンド）
- **SQL & PostgreSQL**：商品や会員情報を安全に保存・検索する「記憶庫」（データベース）
- **Excel & Git**：現場でのデータ調査・設計書作成・チーム共同作業に欠かせない実務ツール

下の理解度チェックに全問正解して次へ進みましょう！',
  'easy', 15, ARRAY['ITリテラシー', 'Web仕組み', '基礎'],
  '{"questions":[{"id":"q1","question":"Webサイトを開いたとき、画面のHTMLやデータを返す役割を担うコンピュータはどれですか？","options":["Webサーバー","マウス","キーボード","モニター"],"correctIndex":0,"explanation":"ブラウザ（クライアント）からのリクエストを受け取り、HTMLやデータを返すのがWebサーバーです。"},{"id":"q2","question":"商品データや会員情報などを永続的に保存・検索するソフトウェアはどれですか？","options":["ブラウザ","データベース（DB）","テキストエディタ","スライド作成ソフト"],"correctIndex":1,"explanation":"データベース（PostgreSQLなど）は、データを表形式で安全に保管し、高速に検索・更新する役割を持ちます。"},{"id":"q3","question":"HTML・CSS・JavaScriptのようにブラウザ側（画面側）で動く領域を何と呼びますか？","options":["フロントエンド","バックエンド","インフラ","データベース"],"correctIndex":0,"explanation":"ユーザーが直接見る画面側をフロントエンド、サーバー側の処理（Java / Spring Boot等）をバックエンドと呼びます。"}]}', '{"q1":0,"q2":1,"q3":0}', 'ブラウザ（クライアント）→ Web/アプリサーバー → データベース の3層構造（Web 3層アーキテクチャ）は、今後のSpring Boot開発でもそのまま使います。',
  1, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441102', '33333333-3333-4333-8333-333333331101', 'ITリテラシー 1-2：PC・OS・フォルダ構造（パス）と文字コードの基礎', '## エンジニアが毎日意識する「パス」と「文字コード」

プログラミングでは、たくさんのソースコードや設定ファイルをフォルダ（ディレクトリ）に分けて整理します。

```mermaid
graph TD
    Root["product-manager/（プロジェクトルート）"]
    Root --> Src["src/main/"]
    Root --> Pom["pom.xml（ライブラリ設定）"]
    Root --> Readme["README.md（説明書）"]
    Src --> Java["java/com/example/（Javaプログラム）"]
    Src --> Res["resources/"]
    Res --> Tpl["templates/（HTML画面）"]
    Res --> Prop["application.properties（DB設定）"]
```

### 覚えておくべき3つの基礎知識
1. **パス（Path）**：ファイルの場所を表す住所です。プロジェクトの階層を `/`（スラッシュ）でつなぎます。
2. **拡張子**：ファイル名の末尾（`.java`, `.html`, `.css`, `.sql`, `.xlsx`）でファイルの種類を識別します。
3. **文字コード（UTF-8）**：コンピュータは文字を数字（0と1）で記憶します。日本語の文字化けを防ぐため、開発現場では **UTF-8** に統一します。',
  'easy', 15, ARRAY['ITリテラシー', 'UTF-8', 'パス'],
  '{"questions":[{"id":"q1","question":"日本語の文字化けを防ぐため、現代のWeb開発・Java・PostgreSQLで標準的に使われる文字コードはどれですか？","options":["UTF-8","ASCIIのみ","モールス信号","BMP"],"correctIndex":0,"explanation":"UTF-8は世界中の文字を扱える国際標準の文字コードであり、Windows/Mac/Linux間で文字化けしにくいのが特長です。"},{"id":"q2","question":"プログラムや設定ファイルの場所を示す「フォルダの階層」を文字列で表したものを何と言いますか？","options":["パス（Path）","ピクセル","キャッシュ","フレーム"],"correctIndex":0,"explanation":"例：`src/main/java/App.java` のようなファイルの住所をパス（絶対パス／相対パス）と呼びます。"}]}', '{"q1":0,"q2":0}', 'EclipseやPostgreSQLの設定でも必ず「UTF-8」を選びます。パス構造を意識するとエラー時にどのファイルを直せばよいか迷わなくなります。',
  2, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441103', '33333333-3333-4333-8333-333333331102', 'ITリテラシー 2-1：インターネット・HTTP/HTTPS・DNSの仕組み', '## URLを入力してから画面が出るまでの通信の流れ

ブラウザに `https://shop.example.com/products` と入力したとき、裏側では次のような通信が行われています。

```mermaid
flowchart LR
    A["ブラウザにURL入力"] --> B["DNSサーバーに問い合わせ<br/>ドメイン名 → IPアドレス"]
    B --> C["HTTPS（暗号化通信）で<br/>Webサーバーへリクエスト"]
    C --> D{"ステータスコード判定"}
    D -->|200 OK| E["正常に画面を表示"]
    D -->|404 Not Found| F["ページが見つかりません"]
    D -->|500 Server Error| G["サーバー内部エラー"]
```

### 現場でよく使うHTTPメソッドとステータスコード
- **GET**：画面やデータを「取得」するとき（例：商品一覧を見る）
- **POST**：データを「登録・更新・削除」するとき（例：商品を新規登録する）
- **200 / 302**：正常完了・別ページへリダイレクト
- **403 / 404**：権限なし / URL間違い・データなし
- **500**：JavaプログラムやSQLのバグによるサーバーエラー',
  'easy', 15, ARRAY['ITリテラシー', 'HTTP', 'DNS'],
  '{"questions":[{"id":"q1","question":"通信内容を暗号化して盗聴や改ざんを防ぐ、現在のWeb標準プロトコルはどれですか？","options":["HTTP","HTTPS","FTP","Telnet"],"correctIndex":1,"explanation":"HTTPSはHTTPにTLS/SSL暗号化を組み合わせた安全な通信方式です。ブラウザに鍵マークが表示されます。"},{"id":"q2","question":"URLのドメイン名（例：`example.com`）をIPアドレスへ変換してくれる仕組みはどれですか？","options":["DNS","CSS","SQL","CPU"],"correctIndex":0,"explanation":"DNS（Domain Name System）は、人間が覚えやすいドメイン名とネットワーク上の住所（IPアドレス）を結びつけます。"},{"id":"q3","question":"Webページが見つからないときにサーバーが返すHTTPステータスコードはどれですか？","options":["200 OK","404 Not Found","500 Internal Server Error","302 Found"],"correctIndex":1,"explanation":"200は成功、404はページ未存在、500はサーバー内部エラーを表します。開発時の原因調査で毎日使います。"}]}', '{"q1":1,"q2":0,"q3":1}', 'Spring Boot開発では `@GetMapping` / `@PostMapping` や 404・500 エラーの切り分けでHTTPの知識をそのまま使います。',
  3, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441104', '33333333-3333-4333-8333-333333331102', 'ITリテラシー 2-2：情報セキュリティとエンジニアの守秘義務', '## エンジニアが絶対に守るべきセキュリティ原則

システム開発では、個人情報・売上データ・パスワードなど大切な情報を扱います。たった1つのミスが大きな事故につながるため、基本原則を最初に身につけましょう。

```mermaid
flowchart TD
    Sec["情報セキュリティの3要素（CIA）"]
    Sec --> C["機密性 (Confidentiality)<br/>許可された人だけが見られる"]
    Sec --> I["完全性 (Integrity)<br/>データが改ざんされない"]
    Sec --> A["可用性 (Availability)<br/>必要なときにいつでも使える"]
```

### 開発現場のNG行動と正しい対策
| リスク | NG行動 | 正しい対策 |
|---|---|---|
| パスワード漏洩 | DBに平文（そのままの文字）で保存 | **BCrypt等でハッシュ化**して保存 |
| 機密情報の流出 | APIキーやDBパスワードをGitHubへPush | **環境変数・.gitignore** で管理 |
| SQLインジェクション | 文字列連結でSQLを組み立てる | **プレースホルダ（JPA / PreparedStatement）** を使う |',
  'easy', 15, ARRAY['ITリテラシー', 'セキュリティ', 'コンプライアンス'],
  '{"questions":[{"id":"q1","question":"パスワードをデータベースに保存するとき、実務で必ず行うべき対策はどれですか？","options":["そのまま平文で保存する","BCrypt等でハッシュ化して保存する","ファイル名に書く","チャットに貼って共有する"],"correctIndex":1,"explanation":"万が一DBが漏洩しても元のパスワードが分からないよう、復元不可能なハッシュ化（BCrypt等）を行います。"},{"id":"q2","question":"顧客情報やAPIキー、本番DBのパスワードについて正しい行動はどれですか？","options":["公開GitHubリポジトリにそのままPushする","環境変数や管理外ファイルに分け、GitHubへ絶対に上げない","メモ帳に書いてデスクトップに公開する","パスワードは全員1234にする"],"correctIndex":1,"explanation":"秘密鍵やパスワードは `.gitignore` で除外し、GitHubに絶対にコミットしないのが鉄則です。"}]}', '{"q1":1,"q2":1}', 'Spring SecurityによるBCryptハッシュ化や `.gitignore` の設定は、後半の個人開発・チーム開発で実際に手を動かして実装します。',
  4, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441105', '33333333-3333-4333-8333-333333331103', 'ITリテラシー 3-1：システム開発の工程（要件定義〜設計〜実装〜テスト）', '## システムはどうやって作られるのか？（V字モデル）

実際の業務システムは、いきなりプログラミングを始めるのではなく、**「設計書」** を作ってチーム全員の認識を合わせてから開発します。

```mermaid
flowchart LR
    A["1. 要件定義<br/>何を作るか決める"] --> B["2. 基本設計<br/>画面・機能構成"]
    B --> C["3. 詳細設計<br/>DB・クラス・バリデーション"]
    C --> D["4. 実装（製造）<br/>Java / HTML / SQL"]
    D --> E["5. 単体テスト<br/>1機能ごとの確認"]
    E --> F["6. 結合テスト<br/>画面・DB連携確認"]
    F --> G["7. リリース・運用"]
```

### このカリキュラムのゴール
後半の「商品管理システム（個人開発）」と「チーム開発」では、実際の現場と同じ **Excel形式の詳細設計書** を配布します。
設計書を読み解いてシステムを完成させる力を身につければ、現場に配属されてもスムーズに活躍できます！',
  'easy', 15, ARRAY['ITリテラシー', '開発工程', '詳細設計書'],
  '{"questions":[{"id":"q1","question":"「何を作るか」を顧客と合意し、機能一覧や画面イメージをまとめる最初の工程はどれですか？","options":["要件定義","単体テスト","運用保守","コーディング"],"correctIndex":0,"explanation":"要件定義 → 基本設計 → 詳細設計 → 実装（製造） → テスト → リリース の流れで進めます。"},{"id":"q2","question":"詳細設計書を見て実装を始める前に、エンジニアが最初に行うべきこととして最も適切なのはどれですか？","options":["設計書を読まずに勘でコードを書く","画面一覧・テーブル定義・バリデーション仕様を確認し、不明点があれば先に質問する","いきなりテストをスキップして提出する","他の人の設計を勝手に変える"],"correctIndex":1,"explanation":"詳細設計書を正しく読み解き、仕様の認識ズレを実装前に解消することが手戻りを防ぐ最大のコツです。"}]}', '{"q1":0,"q2":1}', '要件定義→設計→実装→テストの流れを意識することで、今自分が何のためにコードを書いているのかが明確になります。',
  5, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441106', '33333333-3333-4333-8333-333333331103', 'ITリテラシー 3-2：現場で評価される質問力（報連相）とテストの考え方', '## 困ったときの「伝わる質問テンプレート」

システム開発はエラーとの戦いです。大切なのは「エラーを出さないこと」ではなく、**「素早く正確に原因を調査し、適切に相談できること」** です。

```mermaid
flowchart TD
    Err["エラー発生！"] --> Read["1. エラーメッセージを最後まで読む"]
    Read --> Try["2. 15〜30分自分で調査・切り分け"]
    Try --> Solved{"解決した？"}
    Solved -->|はい| Next["メモを残して次へ進む"]
    Solved -->|いいえ| Ask["3. 以下の3点をまとめて質問する<br/>①やりたいこと ②エラー全文 ③試したこと"]
```

### テストの基本：正常系と異常系
- **正常系**：正しい入力をしたときに期待通り登録・表示されること
- **異常系**：空欄やマイナス値、存在しないIDを入れたときにクラッシュせず適切なエラーメッセージが出ること

これで3日間のITリテラシー導入は完了です！次は **Excel実務マスター** へ進みましょう。',
  'easy', 15, ARRAY['ITリテラシー', '報連相', 'テスト'],
  '{"questions":[{"id":"q1","question":"エラーが起きて15〜30分調べても解決しないとき、現場で最も評価される質問の仕方はどれですか？","options":["「動きません。助けてください」とだけ送る","「やりたいこと・試したこと・出たエラー文（スクショ）」を整理して質問する","誰にも相談せず3日間ずっと黙って悩む","エラー画面を閉じて見なかったことにする"],"correctIndex":1,"explanation":"①ゴール（やりたいこと）②現状（エラー全文）③試したこと の3点を添えると回答者が即座に原因を特定できます。"},{"id":"q2","question":"「単体テスト」と「結合テスト」の違いとして正しいものはどれですか？","options":["単体テストは1つの機能・画面単位の確認、結合テストは複数画面やDB・他メンバー機能との連携確認","どちらも全く同じ意味である","単体テストはリリース後に行う","結合テストは設計書を見ないで行う"],"correctIndex":0,"explanation":"小さな部品が正しく動くか（単体）→ 繋げたときに全体が正しく動くか（結合）の順で品質を担保します。"}]}', '{"q1":1,"q2":0}', '「やりたいこと・エラー全文・試したこと」の3点セットは、この学習システムの講師質問チャットでもそのまま活用してください。',
  6, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441201', '33333333-3333-4333-8333-333333331201', 'Excel 1-1：四則演算とSUM関数で売上明細を集計しよう', '## 課題：売上明細の小計と合計を数式で計算する

Excelのすべての数式は **`=`（イコール）** から始まります。
手計算した数字を直接入力するのではなく、**セル番地を参照する数式** を入力すると、単価や数量が変わっても自動で再計算されます。

### 入力するセル（黄色ハイライト）
1. **`D2`〜`D4`**：単価（B列）× 数量（C列）を計算する数式（例：`=B2*C2`）
2. **`D5`**：`SUM` 関数を使って `D2` から `D4` の合計を計算する数式（例：`=SUM(D2:D4)`）',
  'easy', 15, ARRAY['Excel', '四則演算', 'SUM'],
  '{"sheetName":"売上明細","cols":4,"rows":5,"headerRows":[1],"cells":{"A1":"商品名","B1":"単価","C1":"数量","D1":"小計","A2":"ノートPC","B2":120000,"C2":2,"D2":"","A3":"ワイヤレスマウス","B3":3500,"C3":5,"D3":"","A4":"USB-Cハブ","B4":4800,"C4":3,"D4":"","A5":"合計","B5":"","C5":"","D5":""},"targets":[{"cell":"D2","expected":240000,"label":"ノートPC小計（=B2*C2）"},{"cell":"D3","expected":17500,"label":"マウス小計（=B3*C3）"},{"cell":"D4","expected":14400,"label":"ハブ小計（=B4*C4）"},{"cell":"D5","expected":271900,"requiredTokens":["SUM"],"label":"売上合計（=SUM(D2:D4)）"}]}', '{"D2":"=B2*C2","D3":"=B3*C3","D4":"=B4*C4","D5":"=SUM(D2:D4)"}', '`=B2*C2` のようにセル番地で掛算し、最後に `=SUM(D2:D4)` で範囲合計するのがExcel集計の基本形です。',
  1, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441202', '33333333-3333-4333-8333-333333331201', 'Excel 1-2：SUM・AVERAGE・MAX・MINで店舗売上を分析しよう', '## 課題：5店舗の売上データから4つの基本統計量を算出する

実務の報告資料では、合計だけでなく「平均・最大・最小」を並べて傾向を把握します。

### 入力するセル（範囲は `B2:B6`）
- **`D2`**：合計売上（`SUM`）
- **`D3`**：平均売上（`AVERAGE`）
- **`D4`**：最高売上（`MAX`）
- **`D5`**：最低売上（`MIN`）',
  'easy', 15, ARRAY['Excel', 'AVERAGE', 'MAX', 'MIN'],
  '{"sheetName":"月次売上分析","cols":4,"rows":7,"headerRows":[1],"cells":{"A1":"店舗名","B1":"売上（万円）","C1":"分析項目","D1":"集計結果","A2":"東京本店","B2":420,"C2":"合計売上","D2":"","A3":"大阪支店","B3":310,"C3":"平均売上","D3":"","A4":"名古屋支店","B4":260,"C4":"最高売上","D4":"","A5":"福岡支店","B5":210,"C5":"最低売上","D5":"","A6":"札幌支店","B6":180,"C6":"","D6":""},"targets":[{"cell":"D2","expected":1380,"requiredTokens":["SUM"],"label":"合計売上（SUM）"},{"cell":"D3","expected":276,"requiredTokens":["AVERAGE"],"label":"平均売上（AVERAGE）"},{"cell":"D4","expected":420,"requiredTokens":["MAX"],"label":"最高売上（MAX）"},{"cell":"D5","expected":180,"requiredTokens":["MIN"],"label":"最低売上（MIN）"}]}', '{"D2":"=SUM(B2:B6)","D3":"=AVERAGE(B2:B6)","D4":"=MAX(B2:B6)","D5":"=MIN(B2:B6)"}', '4大基本関数 `SUM`, `AVERAGE`, `MAX`, `MIN` はいずれも `(開始セル:終了セル)` の範囲を引数にとります。',
  2, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441203', '33333333-3333-4333-8333-333333331201', 'Excel 1-3：絶対参照（$B$1）で消費税込み価格を計算しよう', '## 課題：税率セルを固定して税込価格を求める

数式を下の行へコピーしたとき、参照先がズレてほしくないセルには **`$` を付けて絶対参照（`$B$1`）** にします。

### 入力するセル
- **`C4`〜`C6`**：税抜価格 × `(1 + $B$1)` で税込価格を計算してください。
- ※必ず **`$B$1`** を数式内に含めてください。',
  'easy', 15, ARRAY['Excel', '絶対参照'],
  '{"sheetName":"税込価格表","cols":4,"rows":6,"headerRows":[3],"cells":{"A1":"消費税率","B1":0.1,"C1":"","D1":"","A3":"商品名","B3":"税抜価格","C3":"税込価格","D3":"","A4":"モニター","B4":30000,"C4":"","D4":"","A5":"キーボード","B5":12000,"C5":"","D5":"","A6":"ヘッドセット","B6":8000,"C6":"","D6":""},"targets":[{"cell":"C4","expected":33000,"requiredTokens":["$B$1"],"label":"モニター税込（$B$1を使用）"},{"cell":"C5","expected":13200,"requiredTokens":["$B$1"],"label":"キーボード税込（$B$1を使用）"},{"cell":"C6","expected":8800,"requiredTokens":["$B$1"],"label":"ヘッドセット税込（$B$1を使用）"}]}', '{"C4":"=B4*(1+$B$1)","C5":"=B5*(1+$B$1)","C6":"=B6*(1+$B$1)"}', '実務のExcelでは `F4` キーを押すと `B1` → `$B$1` と素早く絶対参照へ切り替えられます。',
  3, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441204', '33333333-3333-4333-8333-333333331202', 'Excel 2-1：IF関数で営業目標の「達成／未達」を自動判定しよう', '## 課題：実績が目標以上なら「達成」、未満なら「未達」を表示

`IF(条件式, 真のときの値, 偽のときの値)` を使うと、データの条件に応じた自動ラベル付けができます。

### 入力するセル
- **`D2`〜`D5`**：売上実績（B列）が目標額（C列）**以上（`>=`）**なら `"達成"`、そうでなければ `"未達"` を表示する `IF` 式を入力してください。',
  'easy', 15, ARRAY['Excel', 'IF関数'],
  '{"sheetName":"営業達成判定","cols":4,"rows":6,"headerRows":[1],"cells":{"A1":"担当者","B1":"売上実績","C1":"目標額","D1":"判定","A2":"佐藤","B2":120,"C2":100,"D2":"","A3":"鈴木","B3":85,"C3":100,"D3":"","A4":"高橋","B4":100,"C4":100,"D4":"","A5":"田中","B5":92,"C5":100,"D5":""},"targets":[{"cell":"D2","expected":"達成","requiredTokens":["IF"],"label":"佐藤の判定"},{"cell":"D3","expected":"未達","requiredTokens":["IF"],"label":"鈴木の判定"},{"cell":"D4","expected":"達成","requiredTokens":["IF"],"label":"高橋の判定（同額は達成）"},{"cell":"D5","expected":"未達","requiredTokens":["IF"],"label":"田中の判定"}]}', '{"D2":"=IF(B2>=C2,\"達成\",\"未達\")","D3":"=IF(B3>=C3,\"達成\",\"未達\")","D4":"=IF(B4>=C4,\"達成\",\"未達\")","D5":"=IF(B5>=C5,\"達成\",\"未達\")"}', '文字列を数式内で指定するときは必ず半角ダブルクォーテーション `"達成"` で囲みます。',
  4, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441205', '33333333-3333-4333-8333-333333331202', 'Excel 2-2：COUNTIF関数で障害チケットのステータス別件数を調査しよう', '## 課題：条件に一致するセルの個数を数える

運用保守やテスト進捗報告では「対応中が何件、完了が何件か」を一覧から即座に数える作業が頻出します。
`COUNTIF(範囲, 条件)` を使いましょう。

### 入力するセル（対象範囲は `$B$2:$B$7`）
- **`E2`**：「対応中」の件数
- **`E3`**：「完了」の件数
- **`E4`**：「未着手」の件数',
  'easy', 15, ARRAY['Excel', 'COUNTIF', 'データ調査'],
  '{"sheetName":"障害チケット調査","cols":5,"rows":7,"headerRows":[1],"cells":{"A1":"チケットID","B1":"ステータス","C1":"","D1":"集計項目","E1":"件数","A2":"INC-01","B2":"対応中","C2":"","D2":"対応中の件数","E2":"","A3":"INC-02","B3":"完了","C3":"","D3":"完了の件数","E3":"","A4":"INC-03","B4":"未着手","C4":"","D4":"未着手の件数","E4":"","A5":"INC-04","B5":"対応中","C5":"","D5":"","E5":"","A6":"INC-05","B6":"完了","C6":"","D6":"","E6":"","A7":"INC-06","B7":"対応中","C7":"","D7":"","E7":""},"targets":[{"cell":"E2","expected":3,"requiredTokens":["COUNTIF"],"label":"対応中の件数"},{"cell":"E3","expected":2,"requiredTokens":["COUNTIF"],"label":"完了の件数"},{"cell":"E4","expected":1,"requiredTokens":["COUNTIF"],"label":"未着手の件数"}]}', '{"E2":"=COUNTIF($B$2:$B$7,\"対応中\")","E3":"=COUNTIF($B$2:$B$7,\"完了\")","E4":"=COUNTIF($B$2:$B$7,\"未着手\")"}', '`COUNTIF` を使うと行が増えても正確にステータス別の件数をリアルタイム把握できます。',
  5, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441206', '33333333-3333-4333-8333-333333331202', 'Excel 2-3：SUMIF関数で部署別の経費合計を自動集計しよう', '## 課題：指定した条件の行だけ合計する

`SUMIF(検索範囲, 条件, 合計範囲)` を使うと、明細表から部署別・カテゴリ別の金額を一瞬で集計できます。

### 入力するセル
- **`E2`**：`D2`（開発部）に一致する経費合計
- **`E3`**：`D3`（営業部）に一致する経費合計
- **`E4`**：`D4`（総務部）に一致する経費合計',
  'medium', 20, ARRAY['Excel', 'SUMIF', '集計'],
  '{"sheetName":"部署別経費集計","cols":5,"rows":7,"headerRows":[1],"cells":{"A1":"部署","B1":"経費（円）","C1":"","D1":"部署名","E1":"部署合計","A2":"開発部","B2":45000,"C2":"","D2":"開発部","E2":"","A3":"営業部","B3":18000,"C3":"","D3":"営業部","E3":"","A4":"開発部","B4":32000,"C4":"","D4":"総務部","E4":"","A5":"総務部","B5":12000,"C5":"","D5":"","E5":"","A6":"営業部","B6":27000,"C6":"","D6":"","E6":"","A7":"開発部","B7":15000,"C7":"","D7":"","E7":""},"targets":[{"cell":"E2","expected":92000,"requiredTokens":["SUMIF"],"label":"開発部の合計"},{"cell":"E3","expected":45000,"requiredTokens":["SUMIF"],"label":"営業部の合計"},{"cell":"E4","expected":12000,"requiredTokens":["SUMIF"],"label":"総務部の合計"}]}', '{"E2":"=SUMIF($A$2:$A$7,D2,$B$2:$B$7)","E3":"=SUMIF($A$2:$A$7,D3,$B$2:$B$7)","E4":"=SUMIF($A$2:$A$7,D4,$B$2:$B$7)"}', '条件にセル参照（`D2`）を使い、検索範囲と合計範囲を絶対参照にすると、何十部署あってもコピー1回で集計表が完成します。',
  6, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441207', '33333333-3333-4333-8333-333333331203', 'Excel 3-1：VLOOKUP関数でマスタ表から商品名と単価を引こう', '## 課題：実務最強の参照関数 VLOOKUP を習得する

```mermaid
flowchart LR
    Key["注文コード（A2: P002）"] --> Search["マスタ表の左端（D列）から一致行を検索"]
    Search --> Col2["2列目（E列）→ 商品名を取得"]
    Search --> Col3["3列目（F列）→ 単価を取得"]
```

`VLOOKUP(検索値, マスタ範囲, 列番号, FALSE)` ※完全一致のため第4引数は必ず **`FALSE`**（または `0`）にします。

### 入力するセル（マスタ範囲は `$D$2:$F$4`）
- **`B2`〜`B4`**：注文コードに対応する商品名（マスタの2列目）
- **`C2`〜`C4`**：注文コードに対応する単価（マスタの3列目）',
  'medium', 20, ARRAY['Excel', 'VLOOKUP', 'マスタ参照'],
  '{"sheetName":"注文マスタ参照","cols":6,"rows":6,"headerRows":[1],"cells":{"A1":"注文コード","B1":"商品名","C1":"単価","D1":"マスタCD","E1":"マスタ商品名","F1":"マスタ単価","A2":"P002","B2":"","C2":"","D2":"P001","E2":"ノートPC","F2":110000,"A3":"P003","B3":"","C3":"","D3":"P002","E3":"モニター","F3":28000,"A4":"P001","B4":"","C4":"","D4":"P003","E4":"キーボード","F4":9500},"targets":[{"cell":"B2","expected":"モニター","requiredTokens":["VLOOKUP"],"label":"P002の商品名"},{"cell":"C2","expected":28000,"requiredTokens":["VLOOKUP"],"label":"P002の単価"},{"cell":"B3","expected":"キーボード","requiredTokens":["VLOOKUP"],"label":"P003の商品名"},{"cell":"C3","expected":9500,"requiredTokens":["VLOOKUP"],"label":"P003の単価"},{"cell":"B4","expected":"ノートPC","requiredTokens":["VLOOKUP"],"label":"P001の商品名"},{"cell":"C4","expected":110000,"requiredTokens":["VLOOKUP"],"label":"P001の単価"}]}', '{"B2":"=VLOOKUP(A2,$D$2:$F$4,2,FALSE)","C2":"=VLOOKUP(A2,$D$2:$F$4,3,FALSE)","B3":"=VLOOKUP(A3,$D$2:$F$4,2,FALSE)","C3":"=VLOOKUP(A3,$D$2:$F$4,3,FALSE)","B4":"=VLOOKUP(A4,$D$2:$F$4,2,FALSE)","C4":"=VLOOKUP(A4,$D$2:$F$4,3,FALSE)"}', '`VLOOKUP` の第4引数を省略すると近似一致（意図しない値）になるため、実務では必ず `FALSE`（完全一致）を指定します。',
  7, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441208', '33333333-3333-4333-8333-333333331203', 'Excel 3-2：XLOOKUP関数で左方向の列参照と未存在時表示を行おう', '## 課題：VLOOKUPの弱点を克服する XLOOKUP

`VLOOKUP` は「検索キーより左にある列」を取得できませんが、モダンExcelの **`XLOOKUP`** は左右どちらの列でも取得でき、見つからないときの代替文字も第4引数で指定できます。

構文：`=XLOOKUP(検索値, 検索範囲, 戻り範囲, "見つからないときの文字")`

### 入力するセル
- **`B2`〜`B4`**：`D2:D4`（社員ID）から `A2`〜`A4` を探し、左隣の `C2:C4`（社員氏名）を取得してください。
- 見つからない場合（`E999`）は **`"該当なし"`** と表示してください。',
  'medium', 20, ARRAY['Excel', 'XLOOKUP'],
  '{"sheetName":"XLOOKUP社員検索","cols":5,"rows":5,"headerRows":[1],"cells":{"A1":"検索ID","B1":"氏名","C1":"社員氏名","D1":"社員ID","E1":"部署","A2":"E102","B2":"","C2":"山田太郎","D2":"E101","E2":"開発部","A3":"E103","B3":"","C3":"佐藤花子","D3":"E102","E3":"営業部","A4":"E999","B4":"","C4":"鈴木一郎","D4":"E103","E4":"人事部"},"targets":[{"cell":"B2","expected":"佐藤花子","requiredTokens":["XLOOKUP"],"label":"E102の氏名（左方向検索）"},{"cell":"B3","expected":"鈴木一郎","requiredTokens":["XLOOKUP"],"label":"E103の氏名"},{"cell":"B4","expected":"該当なし","requiredTokens":["XLOOKUP"],"label":"E999の未存在時フォールバック"}]}', '{"B2":"=XLOOKUP(A2,$D$2:$D$4,$C$2:$C$4,\"該当なし\")","B3":"=XLOOKUP(A3,$D$2:$D$4,$C$2:$C$4,\"該当なし\")","B4":"=XLOOKUP(A4,$D$2:$D$4,$C$2:$C$4,\"該当なし\")"}', '`XLOOKUP` は列を挿入しても列番号ズレが起きず、エラー処理も1つの関数で完結するため現在の実務で主流になっています。',
  8, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441209', '33333333-3333-4333-8333-333333331203', 'Excel 3-3：IFERROR関数で #N/A や #DIV/0! エラーを綺麗に処理しよう', '## 課題：報告資料からエラー表示をなくす

上司や顧客に提出するExcelシートに `#N/A` や `#DIV/0!` が残っていると、SUM集計まで壊れてしまいます。
`IFERROR(元の数式, エラー時の値)` で安全にラップしましょう。

### 入力するセル
1. **`B2`・`B3`**：`VLOOKUP` でマスタ（`$D$2:$E$3`）の2列目を引き、エラー時は **`"未登録"`** を表示
2. **`F4`**：売上（`B4`）÷ 件数（`D4`）を計算し、0除算エラー時は **`0`** を表示',
  'medium', 20, ARRAY['Excel', 'IFERROR', 'エラー処理'],
  '{"sheetName":"エラー処理","cols":6,"rows":5,"headerRows":[1],"cells":{"A1":"商品CD","B1":"商品名","C1":"売上/件数","D1":"マスタCD","E1":"マスタ名","F1":"","A2":"A01","B2":"","C2":0,"D2":"A01","E2":"クラウドS","F2":"","A3":"A99","B3":"","C3":"","D3":"A02","E3":"クラウドM","F3":"","A4":"売上","B4":50000,"C4":"件数","D4":0,"E4":"客単価","F4":""},"targets":[{"cell":"B2","expected":"クラウドS","requiredTokens":["IFERROR","VLOOKUP"],"label":"A01取得（正常）"},{"cell":"B3","expected":"未登録","requiredTokens":["IFERROR","VLOOKUP"],"label":"A99エラー時は「未登録」"},{"cell":"F4","expected":0,"requiredTokens":["IFERROR"],"label":"0除算時は 0 を表示"}]}', '{"B2":"=IFERROR(VLOOKUP(A2,$D$2:$E$3,2,FALSE),\"未登録\")","B3":"=IFERROR(VLOOKUP(A3,$D$2:$E$3,2,FALSE),\"未登録\")","F4":"=IFERROR(B4/D4,0)"}', 'エラーが出ても後続の集計が止まらないよう、割り算やVLOOKUPには `IFERROR` をセットで使うのが実務の定石です。',
  9, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441210', '33333333-3333-4333-8333-333333331204', 'Excel 4-1：LEFT関数と文字列結合でマスタデータを整形しよう', '## 課題：CSVやシステム出力データのクレンジング

システムから出力したCSVデータ（例：`DEV-001`）から部署略称を取り出したり、表示用のラベルを組み立てる作業は調査・移行業務でよく発生します。

### 入力するセル
1. **`C2`・`C3`**：`LEFT` 関数を使って社員コード（A列）の **先頭3文字** を抽出（例：`DEV`）
2. **`D2`・`D3`**：C列の略称とハイフン `"-"` とB列の氏名を結合して `"DEV-山田"` の形式を作成（`&` 演算子 または `CONCAT` 関数）',
  'medium', 20, ARRAY['Excel', 'LEFT', '文字列処理'],
  '{"sheetName":"データ整形","cols":4,"rows":5,"headerRows":[1],"cells":{"A1":"社員コード","B1":"氏名","C1":"部署略称(先頭3文字)","D1":"表示名（略称-氏名）","A2":"DEV-001","B2":"山田","C2":"","D2":"","A3":"SLS-014","B3":"佐藤","C3":"","D3":"","A4":"HRD-008","B4":"鈴木","C4":"","D4":""},"targets":[{"cell":"C2","expected":"DEV","requiredTokens":["LEFT"],"label":"先頭3文字抽出（DEV）"},{"cell":"C3","expected":"SLS","requiredTokens":["LEFT"],"label":"先頭3文字抽出（SLS）"},{"cell":"D2","expected":"DEV-山田","label":"表示名結合（C2&\"-\"&B2 等）"},{"cell":"D3","expected":"SLS-佐藤","label":"表示名結合（C3&\"-\"&B3 等）"}]}', '{"C2":"=LEFT(A2,3)","C3":"=LEFT(A3,3)","D2":"=C2&\"-\"&B2","D3":"=C3&\"-\"&B3"}', '`LEFT`, `RIGHT`, `MID`, `&`（または `CONCAT`）を使いこなすと、数千行のデータ加工が一瞬で終わります。',
  10, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441211', '33333333-3333-4333-8333-333333331204', 'Excel 4-2：【実務突合】発注データと納品データの差異を自動検知しよう', '## 課題：2つのデータ表を突合（照合）して不一致を見つける

実務で最もよく頼まれる作業の一つが **「2つのシステム／シートの突合（とつごう）」** です。

```mermaid
flowchart LR
    Order["発注データ（A〜B列）"] --> Lookup["VLOOKUP + IFERROR で<br/>納品データ（E〜F列）を照合"]
    Lookup --> Diff{"発注数 = 納品数？"}
    Diff -->|同じ| OK["一致"]
    Diff -->|違う・未納品| NG["差異あり"]
```

### 入力するセル
1. **`C2`〜`C4`**：`IFERROR`＋`VLOOKUP` で発注ID（A列）に対応する納品側数量（`$E$2:$F$4` の2列目）を取得。未納品（エラー）の場合は **`0`** にする。
2. **`D2`〜`D4`**：`IF` 関数で `B列 = C列` なら **`"一致"`**、違えば **`"差異あり"`** を表示。',
  'hard', 25, ARRAY['Excel', '突合', 'VLOOKUP', 'IFERROR', 'IF'],
  '{"sheetName":"発注・納品突合","cols":6,"rows":6,"headerRows":[1],"cells":{"A1":"発注ID","B1":"発注数","C1":"納品数(突合)","D1":"突合結果","E1":"納品側ID","F1":"納品側数量","A2":"ORD-01","B2":10,"C2":"","D2":"","E2":"ORD-01","F2":10,"A3":"ORD-02","B3":20,"C3":"","D3":"","E3":"ORD-02","F3":18,"A4":"ORD-03","B4":15,"C4":"","D4":"","E4":"ORD-04","F4":5},"targets":[{"cell":"C2","expected":10,"requiredTokens":["VLOOKUP"],"label":"ORD-01の納品数"},{"cell":"C3","expected":18,"requiredTokens":["VLOOKUP"],"label":"ORD-02の納品数"},{"cell":"C4","expected":0,"requiredTokens":["IFERROR"],"label":"ORD-03（未納品は0）"},{"cell":"D2","expected":"一致","requiredTokens":["IF"],"label":"ORD-01突合判定"},{"cell":"D3","expected":"差異あり","requiredTokens":["IF"],"label":"ORD-02突合判定"},{"cell":"D4","expected":"差異あり","requiredTokens":["IF"],"label":"ORD-03突合判定"}]}', '{"C2":"=IFERROR(VLOOKUP(A2,$E$2:$F$4,2,FALSE),0)","C3":"=IFERROR(VLOOKUP(A3,$E$2:$F$4,2,FALSE),0)","C4":"=IFERROR(VLOOKUP(A4,$E$2:$F$4,2,FALSE),0)","D2":"=IF(B2=C2,\"一致\",\"差異あり\")","D3":"=IF(B3=C3,\"一致\",\"差異あり\")","D4":"=IF(B4=C4,\"一致\",\"差異あり\")"}', '「データ移行前後の件数・金額突合」や「テスト結果と期待値の突合」はエンジニア実務でも毎週のように使う鉄板テクニックです。',
  11, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441212', '33333333-3333-4333-8333-333333331204', 'Excel 4-3：【総合演習】月次売上報告サマリー表を完成させよう', '## 総合課題：経営会議向けの月次サマリーレポートを作成する

これまで学んだ関数を総動員して、明細（`A2:B5`）から右側のサマリー表を完成させましょう。

### 入力するセル
- **`E2`**：`SUMIF` で「SaaS」カテゴリの売上合計を算出
- **`E3`**：`SUMIF` で「受託」カテゴリの売上合計を算出
- **`E4`**：`SUM` で全社売上合計（`B2:B5`）を算出
- **`E5`**：`AVERAGE` で1件あたりの平均売上（`B2:B5`）を算出
- **`F2`・`F3`**：`IF` で実績が **500以上** なら `"達成"`、未満なら `"未達"` を表示',
  'hard', 25, ARRAY['Excel', '総合演習', '報告レポート'],
  '{"sheetName":"月次報告サマリー","cols":6,"rows":7,"headerRows":[1],"cells":{"A1":"カテゴリ","B1":"売上","C1":"","D1":"レポート項目","E1":"実績","F1":"判定(目標500)","A2":"SaaS","B2":320,"C2":"","D2":"SaaS合計","E2":"","F2":"","A3":"受託","B3":280,"C3":"","D3":"受託合計","E3":"","F3":"","A4":"SaaS","B4":240,"C4":"","D4":"全社合計","E4":"","F4":"","A5":"受託","B5":160,"C5":"","D5":"1件平均売上","E5":"","F5":""},"targets":[{"cell":"E2","expected":560,"requiredTokens":["SUMIF"],"label":"SaaS合計（SUMIF）"},{"cell":"E3","expected":440,"requiredTokens":["SUMIF"],"label":"受託合計（SUMIF）"},{"cell":"E4","expected":1000,"requiredTokens":["SUM"],"label":"全社合計（SUM）"},{"cell":"E5","expected":250,"requiredTokens":["AVERAGE"],"label":"1件平均売上（AVERAGE）"},{"cell":"F2","expected":"達成","requiredTokens":["IF"],"label":"SaaS目標500達成判定"},{"cell":"F3","expected":"未達","requiredTokens":["IF"],"label":"受託目標500達成判定"}]}', '{"E2":"=SUMIF($A$2:$A$5,\"SaaS\",$B$2:$B$5)","E3":"=SUMIF($A$2:$A$5,\"受託\",$B$2:$B$5)","E4":"=SUM(B2:B5)","E5":"=AVERAGE(B2:B5)","F2":"=IF(E2>=500,\"達成\",\"未達\")","F3":"=IF(E3>=500,\"達成\",\"未達\")"}', 'おめでとうございます！これで実務の調査・突合・報告レポート作成に必要なExcelスキルが一通り揃いました。次はHTML＆CSSでWeb画面作りに進みましょう。',
  12, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441301', '33333333-3333-4333-8333-333333331301', 'HTML&CSS 1-1：見出し・段落・リストで自己紹介ページを作ろう', '## 課題：HTMLの基本タグで文章構造を作る

HTMLは **「タグ（`<...>`）」** で文章の意味をマークアップする言語です。エディタに書いたコードは右側のプレビュー画面へリアルタイム反映されます。

### 作成する要素
1. `<h1>` タグでタイトル（例：`エンジニア自己紹介`）を表示する
2. `<p>` タグで自己紹介文を1つ以上書く
3. `<ul>` の中に `<li>` タグを **3つ以上** 使って学習目標リストを作る',
  'easy', 15, ARRAY['HTML', '見出し', 'リスト'],
  '{"html":"<!-- ここに h1、p、ul > li(3つ以上) を書いてみましょう -->\n<h1></h1>\n","css":"h1 {\n  color: #1e3a8a;\n}\n","checks":[{"id":"c1","label":"<h1> タグが存在する","type":"htmlTag","tag":"h1"},{"id":"c2","label":"<p> タグが存在する","type":"htmlTag","tag":"p"},{"id":"c3","label":"<ul> タグが存在する","type":"htmlTag","tag":"ul"},{"id":"c4","label":"<li> タグが3つ以上存在する","type":"htmlTagMinCount","tag":"li","minCount":3}]}', '{"html":"<h1>エンジニア自己紹介</h1>\n<p>1年間のカリキュラムでWebアプリ開発を習得します。</p>\n<ul>\n  <li>HTMLとCSSで画面を作る</li>\n  <li>JavaとSQLでサーバー処理を作る</li>\n  <li>チーム開発を完遂する</li>\n</ul>","css":"h1 {\n  color: #1e3a8a;\n}\n"}', '`<h1>` はページの大見出し、`<p>` は段落、`<ul>` + `<li>` は箇条書きリストを表します。',
  1, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441302', '33333333-3333-4333-8333-333333331301', 'HTML&CSS 1-2：リンク（aタグ）とクラス属性を使ったナビメニュー', '## 課題：リンクとクラス名を設定する

Webサイトで別ページへ移動するには `<a href="URL">リンク文字</a>` を使います。

### 作成する要素
1. `<nav class="menu">` を作成する
2. その中に `<a href="...">` を **3つ以上** 配置する（例：`href="#home"` 等）
3. CSSで `.menu a` の文字色（`color`）を指定する',
  'easy', 15, ARRAY['HTML', 'aタグ', 'class'],
  '{"html":"<nav class=\"menu\">\n  <!-- ここにリンクを3つ以上追加してください -->\n  <a href=\"#home\">ホーム</a>\n</nav>\n","css":".menu a {\n  margin-right: 16px;\n  text-decoration: none;\n  /* color を指定してください */\n}\n","checks":[{"id":"c1","label":"<nav class=\"menu\"> が存在する","type":"htmlAttr","tag":"nav","attr":"class","value":"menu"},{"id":"c2","label":"<a> タグが3つ以上存在する","type":"htmlTagMinCount","tag":"a","minCount":3},{"id":"c3","label":"<a> タグに href 属性がある","type":"htmlAttr","tag":"a","attr":"href"},{"id":"c4","label":"CSSで .menu a に color が指定されている","type":"cssRule","selector":".menu a","property":"color"}]}', '{"html":"<nav class=\"menu\">\n  <a href=\"#home\">ホーム</a>\n  <a href=\"#products\">商品一覧</a>\n  <a href=\"#contact\">お問い合わせ</a>\n</nav>","css":".menu a {\n  margin-right: 16px;\n  text-decoration: none;\n  color: #2563eb;\n  font-weight: bold;\n}"}', '`class` 属性を付けることで、CSSから `.クラス名` セレクタで特定の要素だけにデザインを当てられます。',
  2, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441303', '33333333-3333-4333-8333-333333331301', 'HTML&CSS 1-3：商品一覧テーブル（table / thead / tbody）を作ろう', '## 課題：業務システムで必須のテーブル構造を作る

後半の「商品管理システム」でも一番よく使うのが `<table>` タグです。

### 作成する要素
1. `<table>` の中に `<thead>` と `<tbody>` を作成する
2. 見出しセル `<th>` を **3つ以上**（例：商品名・価格・在庫）配置する
3. データセル `<td>` を **6つ以上**（2行×3列以上）配置する
4. CSSで `table` に `border-collapse: collapse` を指定する',
  'easy', 20, ARRAY['HTML', 'table', '業務画面'],
  '{"html":"<h2>商品一覧</h2>\n<table>\n  <thead>\n    <tr>\n      <th>商品名</th>\n      <!-- 価格・在庫の th を追加 -->\n    </tr>\n  </thead>\n  <tbody>\n    <!-- 2行分のデータ行 (tr > td) を追加 -->\n  </tbody>\n</table>\n","css":"table {\n  width: 100%;\n  /* border-collapse を指定してください */\n}\nth, td {\n  border: 1px solid #cbd5e1;\n  padding: 8px 12px;\n  text-align: left;\n}\nth {\n  background-color: #f1f5f9;\n}\n","checks":[{"id":"c1","label":"<table> と <thead> と <tbody> がある","type":"htmlTag","tag":"tbody"},{"id":"c2","label":"<th> が3つ以上ある","type":"htmlTagMinCount","tag":"th","minCount":3},{"id":"c3","label":"<td> が6つ以上ある","type":"htmlTagMinCount","tag":"td","minCount":6},{"id":"c4","label":"CSSで table に border-collapse: collapse がある","type":"cssRule","selector":"table","property":"border-collapse","value":"collapse"}]}', '{"html":"<h2>商品一覧</h2>\n<table>\n  <thead>\n    <tr>\n      <th>商品名</th>\n      <th>価格</th>\n      <th>在庫</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>ノートPC</td>\n      <td>120,000円</td>\n      <td>15</td>\n    </tr>\n    <tr>\n      <td>マウス</td>\n      <td>3,500円</td>\n      <td>42</td>\n    </tr>\n  </tbody>\n</table>","css":"table {\n  width: 100%;\n  border-collapse: collapse;\n}\nth, td {\n  border: 1px solid #cbd5e1;\n  padding: 8px 12px;\n  text-align: left;\n}\nth {\n  background-color: #f1f5f9;\n}"}', '`border-collapse: collapse;` を指定すると、セル同士の二重線がすっきり1本線になります。',
  3, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441304', '33333333-3333-4333-8333-333333331302', 'HTML&CSS 2-1：ログイン＆登録フォーム（form / label / input / button）', '## 課題：Spring Bootへ送信できる入力フォームを作る

### 作成する要素
1. `<form>` タグを作成する
2. `<label>` を **2つ以上** 配置する
3. `<input type="email">` と `<input type="password">` を配置する
4. `<button type="submit">` ボタンを配置する',
  'easy', 20, ARRAY['HTML', 'form', 'input'],
  '{"html":"<form class=\"login-form\">\n  <h2>ログイン</h2>\n  <!-- メールアドレス・パスワードの label/input と submit button を追加 -->\n</form>\n","css":".login-form {\n  max-width: 340px;\n  padding: 20px;\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n}\nlabel {\n  display: block;\n  margin-top: 12px;\n  font-size: 14px;\n  font-weight: bold;\n}\ninput {\n  width: 100%;\n  padding: 8px;\n  margin-top: 4px;\n  border: 1px solid #cbd5e1;\n  border-radius: 6px;\n}\nbutton {\n  margin-top: 16px;\n  width: 100%;\n  padding: 10px;\n  background-color: #2563eb;\n  color: #ffffff;\n  border: none;\n  border-radius: 6px;\n}\n","checks":[{"id":"c1","label":"<form> タグが存在する","type":"htmlTag","tag":"form"},{"id":"c2","label":"<label> が2つ以上存在する","type":"htmlTagMinCount","tag":"label","minCount":2},{"id":"c3","label":"type=\"email\" の input がある","type":"htmlAttr","tag":"input","attr":"type","value":"email"},{"id":"c4","label":"type=\"password\" の input がある","type":"htmlAttr","tag":"input","attr":"type","value":"password"},{"id":"c5","label":"type=\"submit\" の button がある","type":"htmlAttr","tag":"button","attr":"type","value":"submit"}]}', '{"html":"<form class=\"login-form\">\n  <h2>ログイン</h2>\n  <label for=\"email\">メールアドレス</label>\n  <input id=\"email\" type=\"email\" placeholder=\"user@example.com\" />\n  <label for=\"pw\">パスワード</label>\n  <input id=\"pw\" type=\"password\" />\n  <button type=\"submit\">ログイン</button>\n</form>","css":".login-form {\n  max-width: 340px;\n  padding: 20px;\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n}\nlabel { display: block; margin-top: 12px; font-size: 14px; font-weight: bold; }\ninput { width: 100%; padding: 8px; margin-top: 4px; border: 1px solid #cbd5e1; border-radius: 6px; }\nbutton { margin-top: 16px; width: 100%; padding: 10px; background-color: #2563eb; color: #fff; border: none; border-radius: 6px; }"}', '`type="email"` や `type="password"` を使うと、ブラウザ標準の入力補助や伏せ字表示が自動で有効になります。',
  4, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441305', '33333333-3333-4333-8333-333333331302', 'HTML&CSS 2-2：ボックスモデル（padding / margin / border-radius）を体感しよう', '## 課題：お知らせカードをCSSボックスモデルで整える

```mermaid
graph TD
    M["margin（外側の余白）"] --> B["border（枠線）"]
    B --> P["padding（内側の余白）"]
    P --> C["Content（文字や画像）"]
```

### CSSで `.card` に以下を指定してください
1. `background-color`（例：`#f8fafc`）
2. `padding`（例：`20px`）
3. `margin`（例：`16px`）
4. `border`（例：`1px solid #cbd5e1`）
5. `border-radius`（例：`12px`）',
  'easy', 15, ARRAY['CSS', 'ボックスモデル'],
  '{"html":"<div class=\"card\">\n  <h3>システムメンテナンスのお知らせ</h3>\n  <p>日曜日の午前2時〜4時はメンテナンスのため停止します。</p>\n</div>\n","css":".card {\n  /* background-color, padding, margin, border, border-radius を追加 */\n}\n","checks":[{"id":"c1","label":".card に background-color を指定","type":"cssRule","selector":".card","property":"background-color"},{"id":"c2","label":".card に padding を指定","type":"cssRule","selector":".card","property":"padding"},{"id":"c3","label":".card に margin を指定","type":"cssRule","selector":".card","property":"margin"},{"id":"c4","label":".card に border を指定","type":"cssRule","selector":".card","property":"border"},{"id":"c5","label":".card に border-radius を指定","type":"cssRule","selector":".card","property":"border-radius"}]}', '{"html":"<div class=\"card\">\n  <h3>システムメンテナンスのお知らせ</h3>\n  <p>日曜日の午前2時〜4時はメンテナンスのため停止します。</p>\n</div>","css":".card {\n  background-color: #f8fafc;\n  padding: 20px;\n  margin: 16px;\n  border: 1px solid #cbd5e1;\n  border-radius: 12px;\n}"}', '内側の余白が `padding`、外側の余白が `margin` です。この区別がつくとWebデザインの崩れが一気に減ります。',
  5, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441306', '33333333-3333-4333-8333-333333331302', 'HTML&CSS 2-3：モダンなボタンデザインと :hover 擬似クラス', '## 課題：マウスを乗せると色が変わるプライマリボタンを作る

### CSSの設定内容
1. `.btn-primary` に `background-color`・`color`・`padding`・`border-radius` を設定する
2. `.btn-primary:hover` にマウスホバー時の `background-color` を設定する',
  'easy', 15, ARRAY['CSS', 'hover', 'ボタン'],
  '{"html":"<button class=\"btn-primary\">新規商品を登録</button>\n","css":".btn-primary {\n  border: none;\n  cursor: pointer;\n  font-weight: bold;\n  /* ここにスタイルを追加 */\n}\n\n.btn-primary:hover {\n  /* ホバー時の背景色を指定 */\n}\n","checks":[{"id":"c1","label":".btn-primary に background-color","type":"cssRule","selector":".btn-primary","property":"background-color"},{"id":"c2","label":".btn-primary に color","type":"cssRule","selector":".btn-primary","property":"color"},{"id":"c3","label":".btn-primary に padding","type":"cssRule","selector":".btn-primary","property":"padding"},{"id":"c4","label":".btn-primary:hover に background-color","type":"cssRule","selector":".btn-primary:hover","property":"background-color"}]}', '{"html":"<button class=\"btn-primary\">新規商品を登録</button>","css":".btn-primary {\n  border: none;\n  cursor: pointer;\n  font-weight: bold;\n  background-color: #2563eb;\n  color: #ffffff;\n  padding: 10px 20px;\n  border-radius: 8px;\n}\n.btn-primary:hover {\n  background-color: #1d4ed8;\n}"}', '`:hover` 擬似クラスを付けると、操作できるボタンであることがユーザーに直感的に伝わります。',
  6, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441307', '33333333-3333-4333-8333-333333331303', 'HTML&CSS 3-1：Flexboxでアプリのヘッダーナビゲーションを作ろう', '## 課題：左にロゴ、右にメニューを配置する共通ヘッダー

Flexbox（`display: flex`）は現代のWebレイアウトの主役です。

### CSSで `.header` に以下を設定してください
1. `display: flex`
2. `justify-content: space-between`（左右に振り分ける）
3. `align-items: center`（上下中央揃え）',
  'medium', 20, ARRAY['CSS', 'Flexbox', 'ヘッダー'],
  '{"html":"<header class=\"header\">\n  <div class=\"logo\">ProductMgr</div>\n  <nav class=\"nav-links\">\n    <a href=\"#\">商品一覧</a>\n    <a href=\"#\">カテゴリ</a>\n    <a href=\"#\">ログアウト</a>\n  </nav>\n</header>\n","css":".header {\n  background-color: #1e293b;\n  color: #ffffff;\n  padding: 12px 20px;\n  border-radius: 8px;\n  /* Flexboxプロパティを3つ追加 */\n}\n.logo { font-weight: bold; font-size: 18px; }\n.nav-links { display: flex; gap: 16px; }\n.nav-links a { color: #e2e8f0; text-decoration: none; font-size: 14px; }\n","checks":[{"id":"c1","label":".header に display: flex","type":"cssRule","selector":".header","property":"display","value":"flex"},{"id":"c2","label":".header に justify-content: space-between","type":"cssRule","selector":".header","property":"justify-content","value":"space-between"},{"id":"c3","label":".header に align-items: center","type":"cssRule","selector":".header","property":"align-items","value":"center"}]}', '{"html":"<header class=\"header\">\n  <div class=\"logo\">ProductMgr</div>\n  <nav class=\"nav-links\">\n    <a href=\"#\">商品一覧</a>\n    <a href=\"#\">カテゴリ</a>\n    <a href=\"#\">ログアウト</a>\n  </nav>\n</header>","css":".header {\n  background-color: #1e293b;\n  color: #ffffff;\n  padding: 12px 20px;\n  border-radius: 8px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.logo { font-weight: bold; font-size: 18px; }\n.nav-links { display: flex; gap: 16px; }\n.nav-links a { color: #e2e8f0; text-decoration: none; font-size: 14px; }"}', '`display: flex; justify-content: space-between; align-items: center;` はあらゆる業務アプリのヘッダーで使える黄金の3行です。',
  7, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441308', '33333333-3333-4333-8333-333333331303', 'HTML&CSS 3-2：Flexboxで3枚横並びのKPIカードを作ろう', '## 課題：ダッシュボード上部の統計カードを横並びにする

### 作成・設定内容
1. HTMLの `.kpi-row` 内に `.kpi-card` を **3つ** 配置する
2. CSSで `.kpi-row` に `display: flex` と `gap` を指定する
3. CSSで `.kpi-card` に `flex: 1` を指定して均等幅にする',
  'medium', 20, ARRAY['CSS', 'Flexbox', 'ダッシュボード'],
  '{"html":"<div class=\"kpi-row\">\n  <div class=\"kpi-card\">\n    <div class=\"label\">登録商品数</div>\n    <div class=\"value\">128件</div>\n  </div>\n  <!-- あと2枚 kpi-card を追加してください -->\n</div>\n","css":".kpi-row {\n  /* display: flex と gap を指定 */\n}\n.kpi-card {\n  /* flex: 1 を指定 */\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 16px;\n}\n.label { font-size: 12px; color: #64748b; }\n.value { font-size: 22px; font-weight: bold; color: #0f172a; margin-top: 4px; }\n","checks":[{"id":"c1","label":"class=\"kpi-card\" が3つ以上ある","type":"htmlRegex","value":"(?:kpi-card[\\s\\S]*?){3}"},{"id":"c2","label":".kpi-row に display: flex","type":"cssRule","selector":".kpi-row","property":"display","value":"flex"},{"id":"c3","label":".kpi-row に gap","type":"cssRule","selector":".kpi-row","property":"gap"},{"id":"c4","label":".kpi-card に flex: 1","type":"cssRule","selector":".kpi-card","property":"flex","value":"1"}]}', '{"html":"<div class=\"kpi-row\">\n  <div class=\"kpi-card\"><div class=\"label\">登録商品数</div><div class=\"value\">128件</div></div>\n  <div class=\"kpi-card\"><div class=\"label\">在庫警告</div><div class=\"value\">4件</div></div>\n  <div class=\"kpi-card\"><div class=\"label\">今月売上</div><div class=\"value\">¥2.4M</div></div>\n</div>","css":".kpi-row {\n  display: flex;\n  gap: 12px;\n}\n.kpi-card {\n  flex: 1;\n  background: #f8fafc;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 16px;\n}\n.label { font-size: 12px; color: #64748b; }\n.value { font-size: 22px; font-weight: bold; color: #0f172a; margin-top: 4px; }"}', '`gap` を使うとカード間の余白が均等に空き、`flex: 1` で全カードが綺麗に同じ幅へ揃います。',
  8, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441309', '33333333-3333-4333-8333-333333331303', 'HTML&CSS 3-3：CSS Gridで2列の商品カタロググリッドを作ろう', '## 課題：CSS Gridで格子状レイアウトを組む

### CSSで `.product-grid` に以下を設定してください
1. `display: grid`
2. `grid-template-columns: repeat(2, 1fr)`（または `1fr 1fr`）
3. `gap`（例：`16px`）',
  'medium', 20, ARRAY['CSS', 'Grid'],
  '{"html":"<div class=\"product-grid\">\n  <div class=\"item\"><h4>ノートPC</h4><p>¥120,000</p></div>\n  <div class=\"item\"><h4>4Kモニター</h4><p>¥42,000</p></div>\n  <div class=\"item\"><h4>キーボード</h4><p>¥12,000</p></div>\n  <div class=\"item\"><h4>Webカメラ</h4><p>¥8,500</p></div>\n</div>\n","css":".product-grid {\n  /* display: grid, grid-template-columns, gap を指定 */\n}\n.item {\n  border: 1px solid #cbd5e1;\n  border-radius: 10px;\n  padding: 14px;\n  background: #ffffff;\n}\n.item h4 { margin: 0 0 6px; }\n.item p { margin: 0; color: #2563eb; font-weight: bold; }\n","checks":[{"id":"c1","label":".product-grid に display: grid","type":"cssRule","selector":".product-grid","property":"display","value":"grid"},{"id":"c2","label":".product-grid に grid-template-columns","type":"cssRule","selector":".product-grid","property":"grid-template-columns"},{"id":"c3","label":".product-grid に gap","type":"cssRule","selector":".product-grid","property":"gap"}]}', '{"html":"<div class=\"product-grid\">\n  <div class=\"item\"><h4>ノートPC</h4><p>¥120,000</p></div>\n  <div class=\"item\"><h4>4Kモニター</h4><p>¥42,000</p></div>\n  <div class=\"item\"><h4>キーボード</h4><p>¥12,000</p></div>\n  <div class=\"item\"><h4>Webカメラ</h4><p>¥8,500</p></div>\n</div>","css":".product-grid {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 16px;\n}\n.item { border: 1px solid #cbd5e1; border-radius: 10px; padding: 14px; background: #fff; }\n.item h4 { margin: 0 0 6px; }\n.item p { margin: 0; color: #2563eb; font-weight: bold; }"}', '1次元の並びにはFlexbox、2次元の格子レイアウトにはCSS Gridを使い分けるのがモダンCSSの定石です。',
  9, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441310', '33333333-3333-4333-8333-333333331304', 'HTML&CSS 4-1：position（relative / absolute）で在庫警告バッジを重ねよう', '## 課題：カードの右上にステータスバッジを配置する

親要素に `position: relative`、子要素に `position: absolute` を指定すると、親を基準に自由な位置へバッジを重ねられます。

### CSS設定
1. `.product-box` に `position: relative`
2. `.badge` に `position: absolute`・`top`・`right`',
  'medium', 20, ARRAY['CSS', 'position', 'バッジ'],
  '{"html":"<div class=\"product-box\">\n  <span class=\"badge\">残りわずか</span>\n  <h3>USB-C ドッキングステーション</h3>\n  <p>在庫数：3個</p>\n</div>\n","css":".product-box {\n  border: 1px solid #cbd5e1;\n  border-radius: 12px;\n  padding: 20px;\n  max-width: 320px;\n  /* position: relative を追加 */\n}\n.badge {\n  background: #ef4444;\n  color: #ffffff;\n  font-size: 12px;\n  font-weight: bold;\n  padding: 4px 10px;\n  border-radius: 999px;\n  /* position: absolute, top, right を追加 */\n}\n","checks":[{"id":"c1","label":".product-box に position: relative","type":"cssRule","selector":".product-box","property":"position","value":"relative"},{"id":"c2","label":".badge に position: absolute","type":"cssRule","selector":".badge","property":"position","value":"absolute"},{"id":"c3","label":".badge に top を指定","type":"cssRule","selector":".badge","property":"top"},{"id":"c4","label":".badge に right を指定","type":"cssRule","selector":".badge","property":"right"}]}', '{"html":"<div class=\"product-box\">\n  <span class=\"badge\">残りわずか</span>\n  <h3>USB-C ドッキングステーション</h3>\n  <p>在庫数：3個</p>\n</div>","css":".product-box {\n  border: 1px solid #cbd5e1;\n  border-radius: 12px;\n  padding: 20px;\n  max-width: 320px;\n  position: relative;\n}\n.badge {\n  background: #ef4444;\n  color: #fff;\n  font-size: 12px;\n  font-weight: bold;\n  padding: 4px 10px;\n  border-radius: 999px;\n  position: absolute;\n  top: 12px;\n  right: 12px;\n}"}', '「親に relative、子に absolute」は通知バッジやモーダルの閉じるボタンなどで頻出する定番パターンです。',
  10, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441311', '33333333-3333-4333-8333-333333331304', 'HTML&CSS 4-2：メディアクエリ（@media）でスマホ対応レスポンシブ設計', '## 課題：画面幅が狭いときは縦積みに切り替える

右上のプレビュー切替ボタン（PC／スマホ幅）で挙動をリアルタイム確認しましょう！

### CSS設定
1. 通常時は `.panel-wrap` を `display: flex` で横並びにする
2. `@media (max-width: 600px)` の中で `.panel-wrap` を `flex-direction: column` に変更する',
  'hard', 25, ARRAY['CSS', 'レスポンシブ', '@media'],
  '{"html":"<div class=\"panel-wrap\">\n  <aside class=\"sidebar\">サイドメニュー</aside>\n  <main class=\"content\">メインコンテンツエリア</main>\n</div>\n","css":".panel-wrap {\n  display: flex;\n  gap: 12px;\n}\n.sidebar {\n  width: 180px;\n  background: #eff6ff;\n  padding: 16px;\n  border-radius: 8px;\n}\n.content {\n  flex: 1;\n  background: #f8fafc;\n  padding: 16px;\n  border-radius: 8px;\n}\n\n/* ここに @media (max-width: 600px) を記述してください */\n","checks":[{"id":"c1","label":"@media ルールが存在する","type":"cssRegex","value":"@media\\s*\\([^)]*max-width"},{"id":"c2","label":".panel-wrap に flex-direction: column が指定されている","type":"cssRule","selector":".panel-wrap","property":"flex-direction","value":"column"}]}', '{"html":"<div class=\"panel-wrap\">\n  <aside class=\"sidebar\">サイドメニュー</aside>\n  <main class=\"content\">メインコンテンツエリア</main>\n</div>","css":".panel-wrap { display: flex; gap: 12px; }\n.sidebar { width: 180px; background: #eff6ff; padding: 16px; border-radius: 8px; }\n.content { flex: 1; background: #f8fafc; padding: 16px; border-radius: 8px; }\n@media (max-width: 600px) {\n  .panel-wrap {\n    flex-direction: column;\n  }\n  .sidebar {\n    width: 100%;\n  }\n}"}', 'プレビューの「スマホ幅」ボタンを押すと、横並びだったレイアウトが縦積みに切り替わるのが確認できます。',
  11, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441312', '33333333-3333-4333-8333-333333331304', 'HTML&CSS 4-3：【総合演習】商品管理システムのトップ画面モックを完成させよう', '## 総合課題：後半のSpring Boot開発で使う画面の土台を作る

これまで学んだ **ヘッダー（Flexbox）・検索フォーム・商品一覧テーブル・在庫警告バッジ** を1つの画面に統合しましょう！

### 必須要件
1. `<header class="app-header">`（CSSで `display: flex`）
2. 検索フォーム `<form>` 内に `<input>` と `<button>`
3. 商品一覧 `<table>` 内に `<th>`（3つ以上）と `<td>`（3つ以上）
4. 在庫警告用の `.badge-warn` クラス（CSSで `background-color` を赤系に指定）',
  'hard', 30, ARRAY['HTML', 'CSS', '総合演習', 'モックアップ'],
  '{"html":"<header class=\"app-header\">\n  <strong>商品管理システム</strong>\n  <a href=\"#\">+ 新規登録</a>\n</header>\n\n<!-- ここに検索フォーム (form > input + button) と 商品テーブル (table) を作成してください -->\n","css":".app-header {\n  /* Flexboxで左右配置 */\n  background: #1e3a8a;\n  color: #ffffff;\n  padding: 12px 18px;\n  border-radius: 8px;\n  margin-bottom: 16px;\n}\n.app-header a { color: #ffffff; text-decoration: none; font-size: 13px; }\n.badge-warn {\n  /* 赤系の警告バッジスタイルを指定 */\n  color: #ffffff;\n  padding: 2px 8px;\n  border-radius: 999px;\n  font-size: 12px;\n}\n","checks":[{"id":"c1","label":".app-header に display: flex","type":"cssRule","selector":".app-header","property":"display","value":"flex"},{"id":"c2","label":"検索用の <form> と <input> がある","type":"htmlTag","tag":"form"},{"id":"c3","label":"<input> がある","type":"htmlTag","tag":"input"},{"id":"c4","label":"<table> に <th> が3つ以上ある","type":"htmlTagMinCount","tag":"th","minCount":3},{"id":"c5","label":"<table> に <td> が3つ以上ある","type":"htmlTagMinCount","tag":"td","minCount":3},{"id":"c6","label":".badge-warn に background-color を指定","type":"cssRule","selector":".badge-warn","property":"background-color"}]}', '{"html":"<header class=\"app-header\">\n  <strong>商品管理システム</strong>\n  <a href=\"#\">+ 新規登録</a>\n</header>\n<form class=\"search-bar\">\n  <input type=\"text\" placeholder=\"商品名で検索...\" />\n  <button type=\"submit\">検索</button>\n</form>\n<table>\n  <thead><tr><th>SKU</th><th>商品名</th><th>在庫</th></tr></thead>\n  <tbody>\n    <tr><td>PRD-001</td><td>ノートPC</td><td>15</td></tr>\n    <tr><td>PRD-002</td><td>USBハブ</td><td><span class=\"badge-warn\">残3</span></td></tr>\n  </tbody>\n</table>","css":".app-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  background: #1e3a8a;\n  color: #fff;\n  padding: 12px 18px;\n  border-radius: 8px;\n  margin-bottom: 16px;\n}\n.app-header a { color: #fff; text-decoration: none; font-size: 13px; }\n.search-bar { display: flex; gap: 8px; margin-bottom: 14px; }\n.search-bar input { flex: 1; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; }\n.search-bar button { padding: 8px 16px; background: #2563eb; color: #fff; border: none; border-radius: 6px; }\ntable { width: 100%; border-collapse: collapse; }\nth, td { border: 1px solid #e2e8f0; padding: 8px 10px; text-align: left; }\n.badge-warn { background-color: #dc2626; color: #fff; padding: 2px 8px; border-radius: 999px; font-size: 12px; }"}', '素晴らしい！このHTML/CSSの構造はそのまま後半のSpring Boot（Thymeleaf）の商品一覧画面として再利用できます。',
  12, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441401', '33333333-3333-4333-8333-333333331401', 'Step 1：開発環境構築（Eclipse・PostgreSQL・GitHub）＆詳細設計書ダウンロード', '## はじめてのSpring Boot開発：全体構成をつかもう

ここから2か月かけて、実務と同じ **Excel詳細設計書** を読み解きながら **「商品管理システム」** を自分の手でゼロから構築します。

```mermaid
flowchart LR
    Dev["Eclipse（Java 21）<br/>コード作成・起動"] --> App["Spring Boot 3<br/>Controller / Service / JPA"]
    App <--> DB[("PostgreSQL 16<br/>product_mgmt_db")]
    App --> View["Thymeleaf HTML/CSS<br/>ブラウザ画面"]
    Dev -->|git push| GH["GitHub リポジトリ<br/>（課題の提出先）"]
```

### 1. ツールの導入手順
1. **Eclipse（Pleiades All in One Java Full Edition）**：公式サイトからダウンロードし、フォルダ解凍後に起動。メニュー「ウィンドウ → 設定 → 一般 → ワークスペース」でテキストファイル・エンコードを **UTF-8** に設定します。
2. **PostgreSQL 16**：インストーラーを実行（ポート `5432`、スーパーユーザー `postgres` のパスワードを控えておく）。付属の **pgAdmin 4** を開き、データベース `product_mgmt_db` を作成します。
3. **GitHub**：個人開発用のリポジトリ（例：`product-manager`）を作成し、ローカルPCに `git clone` しておきます。

### 2. Excel詳細設計書をダウンロードしよう
右側の **「詳細設計書（Excel）ダウンロード」** ボタンから `product-management-design-spec.xlsx` を保存し、ExcelまたはGoogleスプレッドシートで開いて **Sheet 1（表紙・読み方）と Sheet 2（機能要件）** を確認してください。',
  'easy', 90, ARRAY['Spring Boot', 'Eclipse', 'PostgreSQL', 'GitHub', '環境構築'],
  '{"stepNumber":1,"designDocPath":"/docs/product-management-design-spec.xlsx","designDocLabel":"商品管理システム 詳細設計書（Excel・全7シート）","checklist":["Eclipse（Pleiades All in One / Java 21）をインストールし、ワークスペース文字コードをUTF-8に設定した","PostgreSQL 16をインストールし、pgAdmin 4 または psql でデータベース `product_mgmt_db` を作成した","GitHubアカウントと新規リポジトリ（例：product-manager）を作成し、初回README.mdをPushした","配布のExcel詳細設計書（全7シート）をダウンロードし、Sheet 1〜2に目を通した"]}', '{"githubUrl":"https://github.com/sample-student/product-manager","checkedItems":[0,1,2,3],"summaryNote":"全チェック項目と動作確認を完了し、GitHubへPushしました。"}', '環境構築はエンジニア実務の第一歩です。つまずいた場合はエラー画面のスクリーンショットを撮って講師質問チャットで相談しましょう。',
  1, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441402', '33333333-3333-4333-8333-333333331401', 'Step 2：Spring Bootプロジェクト作成とPostgreSQL接続確認', '## Spring BootとPostgreSQLを繋ぐ

### 1. Spring Initializrでプロジェクト雛形を作成
Eclipseの「新規 → Spring スターター・プロジェクト」（または [start.spring.io](https://start.spring.io/)）で以下を選択します。
- **Project**: Maven / **Language**: Java / **Java**: 21
- **Dependencies（依存関係）**:
  - `Spring Web`
  - `Thymeleaf`
  - `Spring Data JPA`
  - `Validation`
  - `PostgreSQL Driver`
  - `Spring Boot DevTools`

### 2. `src/main/resources/application.properties` の設定例
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/product_mgmt_db
spring.datasource.username=postgres
spring.datasource.password=あなたのパスワード
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
```

※パスワードをGitHubに公開したくない場合は `${DB_PASSWORD:postgres}` のように環境変数化すると実務レベルです！',
  'easy', 90, ARRAY['Spring Boot', 'PostgreSQL', 'application.properties'],
  '{"stepNumber":2,"designDocPath":"/docs/product-management-design-spec.xlsx","designDocLabel":"商品管理システム 詳細設計書（Excel・全7シート）","checklist":["Spring Initializr（またはEclipseのSpring Starter Project）で依存関係（Web / JPA / Thymeleaf / Validation / PostgreSQL Driver）入りプロジェクトを作成した","`application.properties` にPostgreSQL接続情報（URL・ユーザー名・パスワード）を設定した","EclipseからSpring Bootを起動し、コンソールエラーなく `http://localhost:8080` に接続できた","プロジェクト初期一式をGitHubリポジトリへCommit & Pushした"]}', '{"githubUrl":"https://github.com/sample-student/product-manager","checkedItems":[0,1,2,3],"summaryNote":"全チェック項目と動作確認を完了し、GitHubへPushしました。"}', '`Started Application in X.XXX seconds` とコンソールに出ればSpring BootとPostgreSQLの疎通は成功です。',
  2, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441403', '33333333-3333-4333-8333-333333331402', 'Step 3：詳細設計書（Sheet 4）からDB構築・Entity・Repository実装', '## データベース構造（ER図）とJPAマッピング

Excel詳細設計書の **Sheet 4（テーブル定義・DDL）** を開いて、3つのテーブルの関係を確認しましょう。

```mermaid
erDiagram
    categories ||--o{ products : "1対多 (category_id)"
    categories {
        bigint id PK
        varchar name UK
        int sort_order
    }
    products {
        bigint id PK
        varchar sku UK
        varchar name
        bigint category_id FK
        int price
        int stock
        text description
        boolean is_deleted
    }
    users {
        bigint id PK
        varchar email UK
        varchar password_hash
        varchar full_name
        varchar role
    }
```

### 作業内容
1. Sheet 4 末尾の `CREATE TABLE` 文を pgAdmin 4 で実行し、3テーブルを作成する
2. カテゴリ3件以上・商品5件以上のテストデータを `INSERT` する
3. `entity` パッケージに `Category`, `Product`, `User` を、`repository` パッケージに各 `JpaRepository` を実装する',
  'medium', 120, ARRAY['PostgreSQL', 'DDL', 'JPA', 'Entity'],
  '{"stepNumber":3,"designDocPath":"/docs/product-management-design-spec.xlsx","designDocLabel":"商品管理システム 詳細設計書（Excel・Sheet 4 テーブル定義）","checklist":["詳細設計書 Sheet 4 のDDLを実行し、`users`・`categories`・`products` の3テーブルを作成した","初期データ（カテゴリ3件以上、サンプル商品5件以上）をINSERTした","Entityクラス（`User`, `Category`, `Product`）とRepositoryインターフェースを作成した","DDLファイル（`schema.sql` / `data.sql`）とEntity/RepositoryをGitHubへPushした"]}', '{"githubUrl":"https://github.com/sample-student/product-manager","checkedItems":[0,1,2,3],"summaryNote":"全チェック項目と動作確認を完了し、GitHubへPushしました。"}', 'テーブル定義書（Sheet 4）のカラム名・型・NOT NULL制約とEntityのフィールドを一致させるのがポイントです。',
  3, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441404', '33333333-3333-4333-8333-333333331402', 'Step 4：商品一覧・複合検索・詳細表示（MVCアーキテクチャ実装）', '## Spring BootのMVC処理フロー

Excel詳細設計書の **Sheet 3（画面一覧・項目定義）** と **Sheet 5（クラス・URL設計）** に従って一覧・検索・詳細機能を実装します。

```mermaid
sequenceDiagram
    participant Browser as ブラウザ
    participant Ctrl as ProductController
    participant Svc as ProductService
    participant Repo as ProductRepository
    participant DB as PostgreSQL

    Browser->>Ctrl: GET /products?keyword=PC&categoryId=1
    Ctrl->>Svc: search(keyword, categoryId)
    Svc->>Repo: findActiveByCondition(...)
    Repo->>DB: SELECT ... WHERE is_deleted = false ...
    DB-->>Repo: 商品リスト
    Repo-->>Svc: List<Product>
    Svc-->>Ctrl: List<Product>
    Ctrl-->>Browser: templates/products/list.html
```

### 実装ポイント
- `is_deleted = false` の商品だけを取得する
- 在庫数（`stock`）が `10` 未満の行に `th:if="${p.stock < 10}"` で警告バッジを出す
- 商品名クリックで `/products/{id}` の詳細画面へ遷移できるようにする',
  'medium', 180, ARRAY['Spring Boot', 'Thymeleaf', '一覧・検索'],
  '{"stepNumber":4,"designDocPath":"/docs/product-management-design-spec.xlsx","designDocLabel":"商品管理システム 詳細設計書（Excel・Sheet 3 & 5）","checklist":["`GET /products` で論理削除されていない商品一覧（カテゴリ名付き）が表示される","在庫数が10未満の商品に赤色の警告バッジが表示される","商品名（部分一致）とカテゴリ選択による複合検索が動作し、検索条件が画面に保持される","`GET /products/{id}` で商品詳細画面が表示され、変更をGitHubへPushした"]}', '{"githubUrl":"https://github.com/sample-student/product-manager","checkedItems":[0,1,2,3],"summaryNote":"全チェック項目と動作確認を完了し、GitHubへPushしました。"}', 'Controllerはリクエスト受付と画面返却だけを担当し、検索条件の組み立てや業務ルールはService層へ分離しましょう。',
  4, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441405', '33333333-3333-4333-8333-333333331402', 'Step 5：商品新規登録・編集・論理削除＆バリデーション実装', '## 二重送信を防ぐPRGパターンと入力チェック

Excel詳細設計書の **Sheet 6（バリデーション・エラー）** の全ルールを `ProductForm` と `ProductService` に実装しましょう。

```mermaid
flowchart LR
    Form["登録・編集画面<br/>form.html"] -->|POST /products| Val{"@Valid 検証 &<br/>SKU重複チェック"}
    Val -->|エラーあり| Back["form.htmlを再表示<br/>入力値保持＋赤字エラー"]
    Val -->|OK| Save["ServiceでDB保存<br/>@Transactional"]
    Save -->|Redirect 302| List["GET /products<br/>完了フラッシュ表示"]
```

### 実装ポイント
- **PRG（Post-Redirect-Get）パターン**：登録・更新・削除のPOST後は必ず `return "redirect:/products";` を使い、ブラウザのリロードによる二重登録を防止します。
- **論理削除**：`DELETE FROM` は使わず、`product.setDeleted(true)` に更新してデータを保全します。',
  'hard', 240, ARRAY['Spring Boot', 'CRUD', 'Validation', '論理削除'],
  '{"stepNumber":5,"designDocPath":"/docs/product-management-design-spec.xlsx","designDocLabel":"商品管理システム 詳細設計書（Excel・Sheet 5 & 6）","checklist":["商品新規登録（`GET /products/new` → `POST /products`）がPRGパターンで動作しフラッシュメッセージが出る","Sheet 6 の入力バリデーション（必須・SKU形式・単価/在庫0以上・SKU重複チェック）がすべて動作する","商品編集（`GET /products/{id}/edit` → `POST /products/{id}`）と論理削除（`is_deleted = true`）が動作する","実装コードをGitHubへPushした"]}', '{"githubUrl":"https://github.com/sample-student/product-manager","checkedItems":[0,1,2,3],"summaryNote":"全チェック項目と動作確認を完了し、GitHubへPushしました。"}', 'Bean Validation（`@NotBlank`, `@Min`, `@Pattern`）＋業務バリデーション（SKU重複チェック）の組み合わせは実務の必須スキルです。',
  5, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441406', '33333333-3333-4333-8333-333333331403', 'Step 6：ログイン認証・テスト仕様書（Sheet 7）全件確認＆GitHub最終提出', '## ログイン認証の組み込みと最終品質チェック

1. **Spring Security の導入**：
   - `pom.xml` に `spring-boot-starter-security` を追加
   - `SecurityConfig` で `/login`・静的CSS以外の全URLを認証必須に設定
   - `BCryptPasswordEncoder` でパスワードを安全に照合
2. **テスト仕様書（Sheet 7）の実施**：
   - `TC-001`〜`TC-012` を1つずつ自分のブラウザとPostgreSQLで確認し、Excelの判定欄をすべて「OK」にする
3. **README.md の整備＆最終Push**：
   - 別のエンジニアが `git clone` して動かせるよう、DB作成SQL・起動コマンド・テストアカウント情報を `README.md` に記載
   - 最終版のGitHub URLを下のフォームから提出してください！',
  'hard', 180, ARRAY['Spring Security', 'テスト', 'GitHub提出'],
  '{"stepNumber":6,"designDocPath":"/docs/product-management-design-spec.xlsx","designDocLabel":"商品管理システム 詳細設計書（Excel・Sheet 7 テスト仕様書）","checklist":["Spring Securityによるログイン・ログアウト（BCrypt暗号化・未ログイン時 `/login` リダイレクト）を実装した","詳細設計書 Sheet 7 の単体・結合テスト（TC-001〜TC-012）をすべて実施し合格を確認した","`README.md` にDB作成手順・起動方法・テスト用ログインID/パスワードを記載した","最終版ソースコードをGitHubの `main` ブランチへPushし、リポジトリURLを提出した"]}', '{"githubUrl":"https://github.com/sample-student/product-manager","checkedItems":[0,1,2,3],"summaryNote":"全チェック項目と動作確認を完了し、GitHubへPushしました。"}', '商品管理システムの完遂おめでとうございます！この開発経験と設計書読解力を武器に、いよいよ最終段階の「3人1組チーム開発」へ挑戦しましょう。',
  6, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441501', '33333333-3333-4333-8333-333333331501', 'Team Step 1：チーム開発の流れ・役割分担（1人3ページ）＆Git運用ルール策定', '## 3人1組チーム開発：社内統合業務システム「TeamOps Hub」

1年間カリキュラムの集大成です！3人で力を合わせ、**共通ログイン機能（1画面）＋ 1人3ページ × 3名（計9画面）＝ 全10画面** の本格Webシステムを構築します。

```mermaid
graph TD
    Login["共通：SCR-00 ログイン画面<br/>Spring Security + BCrypt"]
    Login --> A["メンバーA（3画面）<br/>①ダッシュボード<br/>②社員一覧・検索<br/>③社員登録・編集"]
    Login --> B["メンバーB（3画面）<br/>①案件一覧（進捗率）<br/>②案件詳細・タスクボード<br/>③タスク登録・編集"]
    Login --> C["メンバーC（3画面）<br/>①備品一覧・在庫検索<br/>②貸出申請・返却一覧<br/>③申請詳細・承認/返却"]
```

### チーム開発の標準ブランチ運用（Git Flow簡易版）
```mermaid
gitGraph
    commit id: "初期構築"
    branch develop
    checkout develop
    commit id: "共通ログイン＆DB基盤"
    branch feature/a-members
    checkout feature/a-members
    commit id: "社員一覧・登録実装"
    checkout develop
    branch feature/b-projects
    checkout feature/b-projects
    commit id: "案件・タスク実装"
    checkout develop
    merge feature/a-members id: "PR#1 レビュー後マージ"
    merge feature/b-projects id: "PR#2 レビュー後マージ"
    checkout main
    merge develop id: "最終リリース"
```

まずは右側から **チーム開発 詳細設計書（Excel・全7シート）** をダウンロードし、3人で担当（A/B/C）とGitルールを決めましょう！',
  'medium', 120, ARRAY['チーム開発', 'Gitブランチ', '役割分担'],
  '{"stepNumber":1,"designDocPath":"/docs/team-project-design-spec.xlsx","designDocLabel":"チーム開発（3人1組）総合業務Webシステム 詳細設計書（Excel・全7シート）","isTeamProject":true,"checklist":["チーム3名の役割分担（メンバーA：社員・ダッシュボード3画面 / メンバーB：案件・タスク3画面 / メンバーC：備品貸出3画面）を決定した","チーム共有GitHubリポジトリを作成し、3名全員をCollaboratorに登録した","`main` ブランチから `develop` ブランチを作成し、Sheet 2 のGit運用ルール（直接Push禁止・PRレビュー必須）を合意した","Excel詳細設計書（全7シート）を3名全員で読み込み、担当画面と共有テーブルの境界を確認した"]}', '{"githubUrl":"https://github.com/sample-student/teamops-hub","checkedItems":[0,1,2,3],"summaryNote":"全チェック項目と動作確認を完了し、GitHubへPushしました。"}', '最初に「誰がどのファイル・テーブルを触るか」の境界を設計書で合意しておくと、チーム開発のトラブルの8割を未然に防げます。',
  1, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441502', '33333333-3333-4333-8333-333333331501', 'Team Step 2：共通基盤（6テーブルDB・ログイン認証・共通レイアウト）の構築', '## 全員が同じ土台の上で開発を始める

並行開発に入る前に、3人で共有する **データベース（6テーブル）・ログイン認証・共通ヘッダー** を最初に `develop` ブランチへ完成させます。

```mermaid
erDiagram
    departments ||--o{ users : "所属"
    users ||--o{ projects : "責任者"
    projects ||--o{ tasks : "紐づく"
    users ||--o{ tasks : "担当"
    equipments ||--o{ equipment_loans : "貸出対象"
    users ||--o{ equipment_loans : "申請者"
```

### 確認するExcelシート
- **Sheet 3**：全10画面のURLと ADMIN / USER 権限マトリクス
- **Sheet 5**：全6テーブルのDDL（`schema.sql`）',
  'medium', 180, ARRAY['チーム開発', 'Spring Security', 'DB設計'],
  '{"stepNumber":2,"designDocPath":"/docs/team-project-design-spec.xlsx","designDocLabel":"チーム開発 詳細設計書（Excel・Sheet 3 & 5）","isTeamProject":true,"checklist":["Sheet 5 の共通DDL（6テーブル）を全員のローカルPostgreSQLに投入し、共通 `schema.sql` / `data.sql` を `develop` へマージした","共通ログイン機能（SCR-00 `/login`・Spring Security・ADMIN/USERロール制御）が動作する","共通ヘッダー／ナビゲーションレイアウト（`layout.html`）を作成し、全10画面へのリンク枠を配置した","3名全員が最新の `develop` を `git pull` してローカルで起動確認できた"]}', '{"githubUrl":"https://github.com/sample-student/teamops-hub","checkedItems":[0,1,2,3],"summaryNote":"全チェック項目と動作確認を完了し、GitHubへPushしました。"}', '共通基盤を先に `develop` へ確定させたことで、次ステップから3人が同時並行で高速開発できるようになります。',
  2, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441503', '33333333-3333-4333-8333-333333331502', 'Team Step 3：担当3ページの実装とPull Request相互レビュー', '## 各自のブランチで3ページを実装し、PRでレビューし合う

Excel詳細設計書の **Sheet 4（画面項目詳細設計）** と **Sheet 6（クラス・API担当設計）** を見ながら、自分の担当3ページを実装しましょう。

### 毎日の開発サイクル
1. `git switch develop && git pull origin develop`
2. `git switch -c feature/自分の担当-画面名`
3. 実装＆ローカル動作確認 → Commit & Push
4. GitHubで `develop` 向け **Pull Request** を作成
5. チームメンバー1名以上がレビュー＆Approveしてからマージ！',
  'hard', 360, ARRAY['チーム開発', 'Pull Request', 'コードレビュー'],
  '{"stepNumber":3,"designDocPath":"/docs/team-project-design-spec.xlsx","designDocLabel":"チーム開発 詳細設計書（Excel・Sheet 4 & 6）","isTeamProject":true,"checklist":["自分の担当3ページすべてについて、機能ごとに `feature/...` ブランチを切って実装した","担当分のController / Service / Repository / Thymeleafテンプレートを Sheet 4・Sheet 6 の仕様通りに実装した","GitHub上で `develop` 宛のPull Requestを作成し、変更内容と動作確認スクショを記載した","他メンバーのPRを最低1件以上コードレビューし、コメント・Approveを行った"]}', '{"githubUrl":"https://github.com/sample-student/teamops-hub","checkedItems":[0,1,2,3],"summaryNote":"全チェック項目と動作確認を完了し、GitHubへPushしました。"}', '他人のコードを読んでレビューすることで、自分では気づかなかった書き方やバグの防止策が身につきます。',
  3, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441504', '33333333-3333-4333-8333-333333331502', 'Team Step 4：コンフリクト解消と3名機能（全10画面）の横断結合', '## コンフリクトを恐れずに正しく解消する

チーム開発では、同じファイル（共通ナビや `application.properties` 等）を2人が編集して **コンフリクト（競合）** が起きるのが普通です。

```mermaid
flowchart TD
    C["PRでコンフリクト発生！"] --> Pull["1. ローカルで git fetch origin"]
    Pull --> Merge["2. 自分のブランチ上で git merge origin/develop"]
    Merge --> Edit["3. <<<<<<< / ======= / >>>>>>> を確認し<br/>両方の必要な変更を残して保存"]
    Edit --> Test["4. Eclipseでビルド＆起動確認"]
    Test --> Push["5. git add . → git commit → git push"]
```

### 確認ポイント
- メンバーA・B・Cすべての画面が `develop` 上で1つのアプリとしてシームレスに遷移できること
- 権限設定（ADMINのみ操作可能／USERは閲覧のみ）が仕様通り動くこと',
  'hard', 240, ARRAY['チーム開発', 'コンフリクト解消', '統合'],
  '{"stepNumber":4,"designDocPath":"/docs/team-project-design-spec.xlsx","designDocLabel":"チーム開発 詳細設計書（Excel・Sheet 2 & 6）","isTeamProject":true,"checklist":["全員の担当3ページ（計9ページ＋ログイン＝全10画面）が `develop` ブランチへマージされた","マージ時に発生したコンフリクト（共通ナビ・設定ファイル等）を `git merge origin/develop` で適切に解消した","メンバーAで登録した社員がメンバーBのタスク担当者やメンバーCの貸出申請者として正しく連携表示される","権限マトリクス（Sheet 3：USERがADMIN専用URLへアクセスすると403になる等）を確認した"]}', '{"githubUrl":"https://github.com/sample-student/teamops-hub","checkedItems":[0,1,2,3],"summaryNote":"全チェック項目と動作確認を完了し、GitHubへPushしました。"}', 'コンフリクトを自力で解消してビルドを通せた経験は、実務現場で即戦力として評価される大きな武器になります。',
  4, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441505', '33333333-3333-4333-8333-333333331503', 'Team Step 5：横断結合テスト（Sheet 7）実施＆GitHub Issueでのバグ改修', '## 3人分の機能を横断する結合テスト

Excel詳細設計書の **Sheet 7（結合・受入テスト仕様書：IT-001〜IT-007）** を使って、担当者同士でクロスチェック（他人が作った画面をテスト）しましょう。

### バグが見つかったときの流れ
1. GitHub の **Issues** タブに再現手順とスクリーンショットを起票する
2. 担当者が `fix/issue番号-内容` ブランチを作成して修正する
3. PRレビュー後に `develop` へマージし、Issueをクローズする
4. 全テスト合格後、`develop` → `main` へリリースPRをマージする',
  'hard', 180, ARRAY['チーム開発', '結合テスト', 'GitHub Issues'],
  '{"stepNumber":5,"designDocPath":"/docs/team-project-design-spec.xlsx","designDocLabel":"チーム開発 詳細設計書（Excel・Sheet 7 結合テスト仕様書）","isTeamProject":true,"checklist":["Sheet 7 の横断結合テスト（IT-001〜IT-007）をチーム全員で実施した","見つかったバグをGitHub Issuesに登録し、`fix/...` ブランチ→PRで修正・クローズした","備品貸出の承認/返却トランザクションや案件進捗率の自動計算など異常系も含めて動作確認した","テスト完了済みの `develop` から `main` ブランチへリリースPRをマージした"]}', '{"githubUrl":"https://github.com/sample-student/teamops-hub","checkedItems":[0,1,2,3],"summaryNote":"全チェック項目と動作確認を完了し、GitHubへPushしました。"}', '自分で作った画面は思い込みで見落としやすいため、他メンバーがテストするクロスチェックが品質向上の鍵です。',
  5, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.problems (
  id, lesson_id, title, description_md, difficulty, estimated_minutes,
  tags, starter_code, solution_code, explanation_md, order_index, is_published
)
VALUES (
  '44444444-4444-4444-8444-444444441506', '33333333-3333-4333-8333-333333331503', 'Team Step 6：成果発表・README整備＆チームGitHubリポジトリ最終提出', '## 1年間カリキュラムの集大成：最終提出

チーム全員で以下の最終確認を行い、**チーム共有GitHubリポジトリURL** を提出してください。

### 最終チェック
- `README.md` に以下が分かりやすくまとまっていること
  1. システム概要と3名の担当画面一覧
  2. ローカル起動手順（PostgreSQL DB作成・DDL投入・Spring Boot起動）
  3. テスト用アカウント（ADMIN / USER のメールアドレス・パスワード）
  4. 工夫した点・苦労した点（コンフリクト解消や設計工夫など）
- `main` ブランチを新規フォルダへ `git clone` してエラーなく起動できること',
  'hard', 120, ARRAY['チーム開発', '最終提出', 'GitHub提出'],
  '{"stepNumber":6,"designDocPath":"/docs/team-project-design-spec.xlsx","designDocLabel":"チーム開発 詳細設計書（Excel・全7シート）","isTeamProject":true,"checklist":["チーム共有リポジトリの `README.md` にシステム概要・3名の担当画面・環境構築＆起動手順・テストアカウントを記載した","GitHubのPull Requests履歴・Insights/Contributorsで3名全員の開発貢献が確認できる","デモ発表用の画面遷移シナリオを確認し、全10画面がエラーなく動作することを確認した","チーム共有GitHubリポジトリURLを下のフォームから提出した"]}', '{"githubUrl":"https://github.com/sample-student/teamops-hub","checkedItems":[0,1,2,3],"summaryNote":"全チェック項目と動作確認を完了し、GitHubへPushしました。"}', '1年間カリキュラムの全工程完遂、本当におめでとうございます！設計書読解・実装・テスト・Gitチーム開発までやり切った実績は、現場配属後も確かな自信になります。',
  6, true
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  title = EXCLUDED.title,
  description_md = EXCLUDED.description_md,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  tags = EXCLUDED.tags,
  starter_code = EXCLUDED.starter_code,
  solution_code = EXCLUDED.solution_code,
  explanation_md = EXCLUDED.explanation_md,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

-- 5. 新規42演習問題のヒント登録（冪等洗い替え）
DELETE FROM public.hints WHERE problem_id IN ('44444444-4444-4444-8444-444444441101', '44444444-4444-4444-8444-444444441102', '44444444-4444-4444-8444-444444441103', '44444444-4444-4444-8444-444444441104', '44444444-4444-4444-8444-444444441105', '44444444-4444-4444-8444-444444441106', '44444444-4444-4444-8444-444444441201', '44444444-4444-4444-8444-444444441202', '44444444-4444-4444-8444-444444441203', '44444444-4444-4444-8444-444444441204', '44444444-4444-4444-8444-444444441205', '44444444-4444-4444-8444-444444441206', '44444444-4444-4444-8444-444444441207', '44444444-4444-4444-8444-444444441208', '44444444-4444-4444-8444-444444441209', '44444444-4444-4444-8444-444444441210', '44444444-4444-4444-8444-444444441211', '44444444-4444-4444-8444-444444441212', '44444444-4444-4444-8444-444444441301', '44444444-4444-4444-8444-444444441302', '44444444-4444-4444-8444-444444441303', '44444444-4444-4444-8444-444444441304', '44444444-4444-4444-8444-444444441305', '44444444-4444-4444-8444-444444441306', '44444444-4444-4444-8444-444444441307', '44444444-4444-4444-8444-444444441308', '44444444-4444-4444-8444-444444441309', '44444444-4444-4444-8444-444444441310', '44444444-4444-4444-8444-444444441311', '44444444-4444-4444-8444-444444441312', '44444444-4444-4444-8444-444444441401', '44444444-4444-4444-8444-444444441402', '44444444-4444-4444-8444-444444441403', '44444444-4444-4444-8444-444444441404', '44444444-4444-4444-8444-444444441405', '44444444-4444-4444-8444-444444441406', '44444444-4444-4444-8444-444444441501', '44444444-4444-4444-8444-444444441502', '44444444-4444-4444-8444-444444441503', '44444444-4444-4444-8444-444444441504', '44444444-4444-4444-8444-444444441505', '44444444-4444-4444-8444-444444441506');

INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441101', 1, '上のMermaidシーケンス図の登場人物（ブラウザ・Webサーバー・アプリサーバー・データベース）の役割を見直してみましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441101', 2, 'ユーザーが直接見る画面側を「フロントエンド」、裏側の処理側を「バックエンド」と呼びます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441102', 1, '現代のWeb開発で文字化けを防ぐ国際標準の文字コードは `UTF-8` です。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441103', 1, '暗号化通信は末尾に S（Secure）がついた `HTTPS`、ドメイン→IP変換は `DNS` です。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441104', 1, 'パスワードは必ず復元できないハッシュ値にして保存し、秘密情報はGitHubに公開しないことが原則です。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441105', 1, '最初の工程は「何を作るか」を合意する『要件定義』、実装前には設計書を読んで認識ズレを防ぎます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441106', 1, '質問時は「やりたいこと・エラー文・試したこと」を共有し、テストは「単体→結合」の順に行います。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441201', 1, '掛け算の記号は `×` ではなく半角アスタリスク `*` を使います。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441201', 2, '合計は `=SUM(開始セル:終了セル)` の形式で記述します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441202', 1, '対象データは `B2` から `B6` です。`B2:B6` を各関数の括弧内に入れます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441202', 2, '平均は `AVERAGE`、最大は `MAX`、最小は `MIN` を使用します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441203', 1, '税抜価格に10%上乗せする式は `税抜価格*(1+税率)` です。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441203', 2, '税率セル `B1` を固定するため `$B$1` と書きます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441204', 1, '「以上」を表す比較演算子は `>=` です（同額も含みます）。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441204', 2, '構文は `=IF(条件, "達成", "未達")` です。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441205', 1, '第1引数にステータス列の範囲 `B2:B7`、第2引数に探したい文字列を入れます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441205', 2, '例：`=COUNTIF($B$2:$B$7, "対応中")` のように記述します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441206', 1, '`SUMIF` の引数は `(部署の範囲, 部署名セル, 金額の範囲)` の3つです。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441206', 2, '部署の範囲は `$A$2:$A$7`、金額の範囲は `$B$2:$B$7` です。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441207', 1, '検索値は `A2`、マスタ範囲は `$D$2:$F$4` です。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441207', 2, '商品名は範囲の左から2列目、単価は3列目です。第4引数には `FALSE` を指定します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441208', 1, '検索範囲は `$D$2:$D$4`、戻り範囲は `$C$2:$C$4` です。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441208', 2, '第4引数に `"該当なし"` を指定すると、未存在時に `#N/A` の代わりに表示されます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441209', 1, '`IFERROR` の第1引数に通常の `VLOOKUP` や `B4/D4` をそのまま入れます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441209', 2, '第2引数にエラー時の代替値（`"未登録"` や `0`）を指定します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441210', 1, '左から3文字取り出す関数は `=LEFT(A2, 3)` です。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441210', 2, '文字をつなぐときは `=C2&"-"&B2` のように `&` で連結できます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441211', 1, 'C列は `=IFERROR(VLOOKUP(A2,$E$2:$F$4,2,FALSE), 0)` の形にすると未納品が0になります。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441211', 2, 'D列は発注数と納品数を比較する `=IF(B2=C2, "一致", "差異あり")` です。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441212', 1, 'E2は `=SUMIF($A$2:$A$5, "SaaS", $B$2:$B$5)`、E3は `"受託"` を条件にします。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441212', 2, 'F列は `=IF(E2>=500, "達成", "未達")` のように目標500と比較します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441301', 1, '箇条書きは `<ul>` で囲み、その中に `<li>項目</li>` を3つ並べます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441302', 1, '`<a href="#products">商品一覧</a>` のように3つ並べ、CSSの `.menu a` 内に `color: #2563eb;` などを追加します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441303', 1, '1行は `<tr>...</tr>`、見出しセルは `<th>`、データセルは `<td>` で記述します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441304', 1, '`<input type="email" />`、`<input type="password" />`、`<button type="submit">ログイン</button>` を `<form>` 内に入れます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441305', 1, 'CSSタブに切り替え、`.card { ... }` の中に5つのプロパティを追記しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441306', 1, 'ホバー時は通常色（`#2563eb`）より少し濃い青（`#1d4ed8`）などにすると自然です。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441307', 1, '`.header` の中に `display: flex;`、`justify-content: space-between;`、`align-items: center;` を追加します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441308', 1, 'HTMLに `.kpi-card` を2つ追加し、CSSの `.kpi-row` に `display: flex; gap: 12px;`、`.kpi-card` に `flex: 1;` を書きます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441309', 1, '`grid-template-columns: repeat(2, 1fr);` と書くと2等分の列になります。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441310', 1, '`.badge` には `position: absolute; top: 12px; right: 12px;` を設定してみましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441311', 1, '`@media (max-width: 600px) { .panel-wrap { flex-direction: column; } }` のように書きます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441312', 1, '`.app-header` に `display: flex; justify-content: space-between;`、`.badge-warn` に `background-color: #dc2626;` を指定し、HTMLに検索フォームと商品テーブルを記述します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441401', 1, 'WindowsではEclipseの展開先を `C:\pleiades` のように短い英数字パスにすると、パス長エラーを防げます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441401', 2, 'GitHubリポジトリは講師がコードレビューできるよう **Public**（または講師をCollaborator招待）にしておきましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441402', 1, '`Connection refused` が出る場合はPostgreSQLサービスが起動しているか、ポート5432が合っているか確認しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441403', 1, '`Product` から `Category` への外部キーは `@ManyToOne @JoinColumn(name = "category_id")` で関連付けます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441404', 1, '検索フォームの入力値保持は `model.addAttribute("keyword", keyword)` でHTMLの `th:value` へ渡します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441405', 1, 'フラッシュメッセージは Controller 引数に `RedirectAttributes ra` を受け取り `ra.addFlashAttribute("message", "登録しました")` を使います。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441406', 1, 'テスト用ユーザーのBCryptハッシュは、Spring Boot起動時に `CommandLineRunner` で `passwordEncoder.encode(...)` して初期投入すると確実です。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441501', 1, '毎日10分の「朝会（昨日やったこと・今日やること・困っていること）」を行うと進捗ズレにすぐ気づけます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441502', 1, 'Thymeleafの共通ヘッダーは `th:fragment` を使うと全10画面で同じナビゲーションを使い回せます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441503', 1, '1つのPRが大きくなりすぎないよう、1画面（または一覧→登録→編集）単位でこまめにPRを出すとレビューしやすくなります。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441504', 1, 'コンフリクト解消時は、相手の変更を誤って消さないよう変更した本人と会話しながら確認するのが確実です。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441505', 1, '在庫数の増減（承認時 -quantity、返却時 +quantity）は `@Transactional` を付けて不整合を防ぎましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441506', 1, '提出するURLはチーム共有リポジトリのトップURL（例：`https://github.com/team-xxx/teamops-hub`）を入力してください。');

-- 6. 権限確認
GRANT SELECT ON public.courses, public.chapters, public.lessons, public.problems, public.hints TO authenticated;
