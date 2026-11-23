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
VALUES ('11111111-1111-4111-8111-111111111111', 'ITリテラシー導入コース：IT・Web開発の仕組みと現場基礎', 'Webアプリが動く仕組み・PC/パス/UTF-8・HTTP/HTTPS・情報セキュリティ・開発工程（要件定義〜テスト）・現場の質問力まで、Mermaid図解と確認テストでわかりやすく習得します。', 1, true, NULL)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id;

INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('11111111-1111-4111-8111-111111111112', 'Excel実務マスターコース：調査・突合・報告レポート実践', 'ブラウザ上のインタラクティブExcelシートで手を動かしながら、四則演算・SUM/AVERAGE・絶対参照・IF・COUNTIF/SUMIF・VLOOKUP/XLOOKUP・IFERROR・データ突合と月次報告集計を習得します。', 2, true, '11111111-1111-4111-8111-111111111111')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id;

INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('11111111-1111-4111-8111-111111111113', 'HTML＆CSS実践コース：リアルタイムプレビュー画面構築', 'コードを書いた瞬間に右側のプレビュー画面へ反映される実践演習で、見出し・テーブル・入力フォーム・ボックスモデル・Flexbox・CSS Grid・レスポンシブ対応まで習得します。', 3, true, '11111111-1111-4111-8111-111111111112')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id;

INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('11111111-1111-4111-8111-111111111101', 'Java入門コース：ゼロから学ぶ基礎文法とオブジェクト指向入門', '標準出力・変数・データ型・四則演算・文字列操作・Scanner入力・条件分岐（if/switch）・ループ・二重ループ・配列・線形探索・メソッド分割・クラス設計と在庫/カート演習まで全30問のコーディング演習で基礎を徹底定着させます。', 4, true, '11111111-1111-4111-8111-111111111113')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id;

INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('0b083361-6d07-47a9-a787-508913d9efa8', 'Java初級コース：二次元配列・メソッド設計・オブジェクト指向応用', '店舗売上の二次元配列集計、オーバーロード設計、staticによる自動採番、決済インターフェースとポリモーフィズムなど実務基礎へ直結するオブジェクト指向応用を習得します。', 5, true, '11111111-1111-4111-8111-111111111101')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id;

INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('c4bd0c61-1a12-4d2a-af9d-ac2eb8a12165', 'Java中級コース：コレクション・標準API・CSV処理・例外ハンドリング', '実務で毎日使う ArrayList / HashMap による顧客検索・売上集計、CSVデータのパース処理、try-catch / throw を使った安全な在庫引当・例外制御を習得します。', 6, true, '0b083361-6d07-47a9-a787-508913d9efa8')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id;

INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('bb827c60-3d1d-40db-ac42-5da47866d141', 'Java上級コース：DAO設計・APIバリデーション・顧客案件管理実践', 'DAOリポジトリ設計、REST API入力バリデーション＆ステータス判定、顧客・案件管理システムのService層集計、境界値単体テスト検証など案件参画レベルの実践力を養います。', 7, true, 'c4bd0c61-1a12-4d2a-af9d-ac2eb8a12165')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id;

INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('11111111-1111-4111-8111-111111111102', 'SQL実践コース：データ抽出・集計・テーブル結合マスター', 'SELECT文の基本とWHERE条件指定からスタートし、GROUP BY / HAVING による集計分析、INNER JOIN / LEFT JOIN による複数テーブル結合まで全30問の実践クエリ演習で習得します。', 8, true, 'bb827c60-3d1d-40db-ac42-5da47866d141')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id;

INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('4107aaa5-10f0-41ca-8c22-a3a99eeebcbb', 'Git実践マスター：ビジュアル分岐・マージ演習', '以降の開発・チーム開発に不可欠なGit操作を、ブラウザ上でコミットやブランチ分岐・マージ・リベースを視覚化しながら直感的に習得します。', 9, true, '11111111-1111-4111-8111-111111111102')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id;

INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('11111111-1111-4111-8111-111111111114', 'Spring Boot＋SQL 個人開発：商品管理システム構築（詳細設計書付）', 'Eclipse・Spring Boot・PostgreSQL・GitHubの導入から、配布Excel詳細設計書（全7シート）を読み解いて商品管理システム（検索・CRUD・バリデーション・ログイン）を構築しGitHub URLで提出します。', 10, true, '4107aaa5-10f0-41ca-8c22-a3a99eeebcbb')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  prerequisite_course_id = EXCLUDED.prerequisite_course_id;

INSERT INTO public.courses (id, title, description, order_index, is_published, prerequisite_course_id)
VALUES ('11111111-1111-4111-8111-111111111115', 'チーム開発実践（3人1組）：ログイン機能付き総合業務Webシステム（詳細設計書付）', 'Eclipse・Spring Boot・PostgreSQL・GitHub（ブランチ/PR/レビュー運用）を用い、3人1組・1人3ページ（計9画面）＋共通ログイン機能の業務システムをExcel詳細設計書から構築しGitHub URLで提出します。', 11, true, '11111111-1111-4111-8111-111111111114')
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
VALUES ('22222222-2222-4222-8222-222222221201', '11111111-1111-4111-8111-111111111112', '第1章：Excel基本数式・集計関数・絶対参照', '四則演算、SUM/AVERAGE/MAX/MIN、そして実務でつまずきやすい絶対参照（$）を画面上のシートで習得します。', 1, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221202', '11111111-1111-4111-8111-111111111112', '第2章：IF・COUNTIF・SUMIFによる条件判定と集計', '目標達成の自動判定や、ステータス別件数調査・部署別金額集計を関数で自動化します。', 2, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221203', '11111111-1111-4111-8111-111111111112', '第3章：VLOOKUP・XLOOKUP・IFERRORによるデータ参照', 'マスタ表からの情報自動取得と、実務で必須のエラーハンドリング（IFERROR）を習得します。', 3, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221204', '11111111-1111-4111-8111-111111111112', '第4章：実務データ調査・突合チェック・報告レポート作成', '文字列整形、発注vs納品データの差異突合、月次報告サマリー表の作成まで実務シナリオで仕上げます。', 4, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221301', '11111111-1111-4111-8111-111111111113', '第1章：HTML基礎（見出し・リスト・リンク・テーブル）', 'コードを書いた瞬間に右側のプレビュー画面が変わるライブ演習でHTMLの基本タグを習得します。', 1, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221302', '11111111-1111-4111-8111-111111111113', '第2章：HTMLフォームとCSS装飾・ボックスモデル', '業務システムに必須の入力フォームと、CSSのクラス・色・余白（padding/margin/border）を学びます。', 2, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221303', '11111111-1111-4111-8111-111111111113', '第3章：Flexbox & CSS Gridによるモダンレイアウト', 'ヘッダーナビゲーション、横並び商品カード、グリッドダッシュボードを自在に配置します。', 3, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221304', '11111111-1111-4111-8111-111111111113', '第4章：レスポンシブ対応＆業務Web画面総合仕上げ', 'ホバー効果・バッジ配置・メディアクエリによるスマホ対応・Spring Boot画面を意識した一覧ページを完成させます。', 4, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221401', '11111111-1111-4111-8111-111111111114', '第1章：環境構築と「はじめてのSpring Boot画面」（Step 1〜4）', 'Eclipse・PostgreSQL・Spring Boot導入から、はじめてブラウザに1画面と共通ヘッダーを出すまでを1歩ずつ進めます。', 1, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221402', '11111111-1111-4111-8111-111111111114', '第2章：DB構築と「見る機能（Read）」（Step 5〜8）', '3テーブルDDL作成、Entity/Repositoryのvalidate突破、商品一覧・在庫少バッジ・複合検索・詳細画面を順に作ります。', 2, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221403', '11111111-1111-4111-8111-111111111114', '第3章：「作る・直す・消す（CRUD）」と入力チェック（Step 9〜12）', '新規登録（PRG）、形式＆業務バリデーション（SKU重複）、編集、論理削除を1機能ずつ丁寧に実装します。', 3, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221404', '11111111-1111-4111-8111-111111111114', '第4章：ログイン認証・エラー画面・テスト＆最終提出（Step 13〜16）', 'Spring Security認証、共通エラー画面、テスト仕様書TC-001〜022検証、README整備で実務品質へ仕上げます。', 4, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221501', '11111111-1111-4111-8111-111111111115', '第1章：チーム始動・Git運用・共通基盤の協働構築（Step 1〜5）', '3名分担と所有権合意、共通6テーブルDB、ADMIN/USER認証、403保護、共通ナビ＆IF契約スタブまで全員で土台を固めます。', 1, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221502', '11111111-1111-4111-8111-111111111115', '第2章：担当3画面の並行開発とPR相互レビュー（Step 6〜11）', '各自の専有パッケージで1画面ずつ小さくPRを出し合い、相互レビュー・状態遷移・排他ロック・単体テストを完遂します。', 2, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221503', '11111111-1111-4111-8111-111111111115', '第3章：横断統合・コンフリクト解消・結合テスト（Step 12〜14）', 'IF契約の本接続、コンフリクト解消実践、権限総当たり＆同時承認排他検証、横断結合テストIT-001〜012とIssue改修を行います。', 3, true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.chapters (id, course_id, title, description, order_index, is_published)
VALUES ('22222222-2222-4222-8222-222222221504', '11111111-1111-4111-8111-111111111115', '第4章：リリースPR・GitHub監査・デモ発表＆最終提出（Step 15〜16）', 'develop→mainリリース、3名全員のGitHub貢献監査（IT-007）、README整備と最終デモ発表で集大成を迎えます。', 4, true)
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
VALUES ('33333333-3333-4333-8333-333333331401', '22222222-2222-4222-8222-222222221401', '環境構築・DB疎通・初画面表示', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331402', '22222222-2222-4222-8222-222222221402', 'DB設計実装・商品一覧/検索/詳細', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331403', '22222222-2222-4222-8222-222222221403', '新規登録・バリデーション・編集・論理削除', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331404', '22222222-2222-4222-8222-222222221404', 'Spring Security・品質検証・最終提出', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331501', '22222222-2222-4222-8222-222222221501', '体制構築・6テーブルDB・共通認証・IFスタブ', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331502', '22222222-2222-4222-8222-222222221502', '担当3画面実装・PR相互レビュー・UT', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331503', '22222222-2222-4222-8222-222222221503', '全10画面結合・権限/排他検証・結合テスト', '', 1, true)
ON CONFLICT (id) DO UPDATE SET
  chapter_id = EXCLUDED.chapter_id,
  title = EXCLUDED.title,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;

INSERT INTO public.lessons (id, chapter_id, title, content_md, order_index, is_published)
VALUES ('33333333-3333-4333-8333-333333331504', '22222222-2222-4222-8222-222222221504', 'リリース・監査・最終発表提出', '', 1, true)
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

これでITリテラシー導入は完了です！次は **Excel実務マスター** へ進みましょう。',
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
  '44444444-4444-4444-8444-444444442101', '33333333-3333-4333-8333-333333333301', '1-6. 整数の割り算と余り（/ と %）による割り勘計算', '## 問題文
合計金額 `total`（円）と人数 `people`（人）が標準入力から2行で与えられます。
1人あたりの支払額（整数・切り捨て）と、割り切れなかった余りの金額を計算し、以下の形式で出力してください。

### 出力形式
```
1人あたり: <支払額>円
余り: <余り>円
```

### 入力例
```
10000
3
```

### 出力例
```
1人あたり: 3333円
余り: 1円
```',
  'easy', 10, ARRAY['出力と変数', '四則演算', '剰余'],
  'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int total = sc.nextInt();
        int people = sc.nextInt();
        // ここに計算と出力を記述してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int total = sc.nextInt();
        int people = sc.nextInt();
        int perPerson = total / people;
        int remainder = total % people;
        System.out.println("1人あたり: " + perPerson + "円");
        System.out.println("余り: " + remainder + "円");
    }
}', 'Javaで `int` 同士を `/` で割ると小数点以下は自動で切り捨てられ、`%` で余り（剰余）を取得できます。',
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
  '44444444-4444-4444-8444-444444442102', '33333333-3333-4333-8333-333333333301', '1-7. 小数計算と型キャスト（3科目の合計点・平均点）', '## 問題文
国語・数学・英語の3科目の点数（整数）が標準入力から3行で与えられます。
合計点（整数）と、小数点を含む正確な平均点（`double` 型・小数第1位まで、または切り捨てではなく `/ 3.0` での計算結果）を出力してください。
※平均点は小数第1位まで出力（`String.format("%.1f", avg)` または `Math.round(avg * 10) / 10.0` 等）してください。

### 出力形式
```
合計: <合計>
平均: <小数第1位までの平均>
```

### 入力例
```
80
75
90
```

### 出力例
```
合計: 245
平均: 81.7
```',
  'easy', 12, ARRAY['出力と変数', 'データ型', 'キャスト'],
  'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        // 合計と平均（小数第1位まで）を出力してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        int sum = a + b + c;
        double avg = (double) sum / 3.0;
        System.out.println("合計: " + sum);
        System.out.println("平均: " + String.format("%.1f", avg));
    }
}', '`int / int` は小数点以下が切り捨てられるため、正確な小数の平均を求めるには `(double) sum / 3.0` のように浮動小数点型へ変換（キャスト）します。',
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
  '44444444-4444-4444-8444-444444442103', '33333333-3333-4333-8333-333333333301', '1-8. 文字列の基本操作（文字数・大文字変換・先頭3文字抽出）', '## 問題文
商品コードの文字列（半角英数字・3文字以上）が1行で与えられます。
以下の3つを順番に出力してください。
1. 文字数（`length()`）
2. すべて大文字に変換した文字列（`toUpperCase()`）
3. 大文字変換後の先頭3文字（`substring(0, 3)`）

### 入力例
```
prd-0042
```

### 出力例
```
8
PRD-0042
PRD
```',
  'easy', 12, ARRAY['出力と変数', '文字列操作', 'String'],
  'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String code = sc.next();
        // 文字数、大文字変換、先頭3文字を順に出力してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String code = sc.next();
        String upper = code.toUpperCase();
        System.out.println(code.length());
        System.out.println(upper);
        System.out.println(upper.substring(0, 3));
    }
}', '`String` クラスの `length()`, `toUpperCase()`, `substring(start, end)` は業務データ整形で最もよく使う基本メソッドです。',
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
  '44444444-4444-4444-8444-444444442104', '33333333-3333-4333-8333-333333333301', '1-9. 文字列の一致判定（equals）による簡易ログインチェック', '## 問題文
Javaでは文字列の中身が同じかどうかを比較するとき、`==` ではなく **`.equals()`** を使います。
ユーザーIDとパスワードが2行で入力されます。
ユーザーIDが `"admin"` かつパスワードが `"java2025"` の場合は `LOGIN_OK`、それ以外は `LOGIN_NG` と出力してください。

### 入力例
```
admin
java2025
```

### 出力例
```
LOGIN_OK
```',
  'easy', 10, ARRAY['出力と変数', '文字列比較', 'equals'],
  'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String userId = sc.next();
        String password = sc.next();
        // equals() を使ってログイン判定を行ってください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String userId = sc.next();
        String password = sc.next();
        if (userId.equals("admin") && password.equals("java2025")) {
            System.out.println("LOGIN_OK");
        } else {
            System.out.println("LOGIN_NG");
        }
    }
}', '文字列の `==` は参照先（メモリアドレス）の比較になるため、値の一致チェックには必ず `equals()` を使用します。',
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
  '44444444-4444-4444-8444-444444442105', '33333333-3333-4333-8333-333333333302', '2-6. 1からNまでの合計と偶数合計（forループ基礎）', '## 問題文
正の整数 `N` が与えられます。
1から `N` までの「すべての整数の合計」と「偶数のみの合計」をそれぞれ1行ずつ出力してください。

### 入力例
```
10
```

### 出力例
```
55
30
```',
  'easy', 12, ARRAY['ループ', 'for文', '条件分岐'],
  'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // 1〜nの全合計と偶数合計を求めて出力してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int totalSum = 0;
        int evenSum = 0;
        for (int i = 1; i <= n; i++) {
            totalSum += i;
            if (i % 2 == 0) {
                evenSum += i;
            }
        }
        System.out.println(totalSum);
        System.out.println(evenSum);
    }
}', '1つのループの中で2つの集計変数（全体用と偶数用）を同時に更新すると効率的です。',
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
  '44444444-4444-4444-8444-444444442106', '33333333-3333-4333-8333-333333333302', '2-7. 指定した段の九九を出力しよう（forループ反復）', '## 問題文
1〜9の整数 `dan` が与えられます。
その段の九九（1から9まで掛けた結果）を以下の形式で9行出力してください。

### 入力例
```
3
```

### 出力例
```
3 x 1 = 3
3 x 2 = 6
3 x 3 = 9
3 x 4 = 12
3 x 5 = 15
3 x 6 = 18
3 x 7 = 21
3 x 8 = 24
3 x 9 = 27
```',
  'easy', 10, ARRAY['ループ', 'for文', '出力フォーマット'],
  'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int dan = sc.nextInt();
        // 1〜9まで掛けて9行出力してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int dan = sc.nextInt();
        for (int i = 1; i <= 9; i++) {
            System.out.println(dan + " x " + i + " = " + (dan * i));
        }
    }
}', '`x` や `=` の前後の半角スペースを出力仕様どおりに揃える練習です。',
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
  '44444444-4444-4444-8444-444444442107', '33333333-3333-4333-8333-333333333302', '2-8. N件のテスト点数から合格者数をカウントしよう', '## 問題文
受験者数 `N` と、それに続く `N` 件の点数（整数）が標準入力から与えられます。
**60点以上** を合格とし、合格者数と不合格者数をそれぞれ1行ずつ出力してください。

### 入力例
```
5
80
55
60
42
91
```

### 出力例
```
合格: 3人
不合格: 2人
```',
  'easy', 15, ARRAY['ループ', '条件分岐', 'カウント'],
  'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // n件の点数を読み込み、60点以上・未満をカウントしてください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int pass = 0;
        int fail = 0;
        for (int i = 0; i < n; i++) {
            int score = sc.nextInt();
            if (score >= 60) {
                pass++;
            } else {
                fail++;
            }
        }
        System.out.println("合格: " + pass + "人");
        System.out.println("不合格: " + fail + "人");
    }
}', '入力件数 `N` を最初に読み込み、その回数だけループして `nextInt()` で1件ずつ判定・カウントするのは実務集計の基本パターンです。',
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
  '44444444-4444-4444-8444-444444442108', '33333333-3333-4333-8333-333333333302', '2-9. 二重ループで階段パターン（*）を描画しよう', '## 問題文
高さ `H`（1以上の整数）が与えられます。
二重の `for` ループを使って、1行目に `*` を1個、2行目に2個、…、`H` 行目に `H` 個出力してください。

### 入力例
```
4
```

### 出力例
```
*
**
***
****
```',
  'easy', 15, ARRAY['ループ', '二重ループ'],
  'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int h = sc.nextInt();
        // 二重ループで高さhの三角形を出力してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int h = sc.nextInt();
        for (int row = 1; row <= h; row++) {
            String line = "";
            for (int col = 0; col < row; col++) {
                line += "*";
            }
            System.out.println(line);
        }
    }
}', '外側のループで「何行目か」、内側のループで「その行に何文字並べるか」を制御するのが二重ループの基本構造です。',
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
  '44444444-4444-4444-8444-444444442109', '33333333-3333-4333-8333-333333333303', '3-4. 配列の逆順出力と平均以上の人数カウント', '## 問題文
整数 `N` と `N` 個の点数（整数）が与えられます。
配列に格納したあと、以下の2行を出力してください。
- 1行目：配列の要素を **後ろから逆順** に半角スペース区切りで出力
- 2行目：全体の平均点（小数含む）**以上** の人数を出力

### 入力例
```
4
70 80 90 60
```

### 出力例
```
60 90 80 70
2
```',
  'easy', 15, ARRAY['配列', '逆順', '平均集計'],
  'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] scores = new int[n];
        for (int i = 0; i < n; i++) {
            scores[i] = sc.nextInt();
        }
        // 1行目に逆順、2行目に平均以上の人数を出力してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] scores = new int[n];
        int sum = 0;
        for (int i = 0; i < n; i++) {
            scores[i] = sc.nextInt();
            sum += scores[i];
        }
        String rev = "";
        for (int i = n - 1; i >= 0; i--) {
            if (i < n - 1) rev += " ";
            rev += scores[i];
        }
        double avg = (double) sum / n;
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (scores[i] >= avg) count++;
        }
        System.out.println(rev);
        System.out.println(count);
    }
}', '配列にデータを保持しておくことで、「一度合計から平均を出し、もう一方のループで各要素と平均を比較する」2パス処理が可能になります。',
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
  '44444444-4444-4444-8444-444444442110', '33333333-3333-4333-8333-333333333303', '3-5. 配列から指定値を探す線形探索メソッド（findIndex）', '## 問題文
整数配列 `arr` と検索値 `target` を受け取り、最初に見つかった位置のインデックス（0始まり）を返すメソッド `findIndex(int[] arr, int target)` を実装してください。
見つからない場合は `-1` を返してください。

### 入力形式
- 1行目：配列の長さ `N`
- 2行目：`N` 個の整数
- 3行目：検索したい整数 `target`

### 入力例
```
5
10 25 30 25 50
25
```

### 出力例
```
1
```',
  'easy', 15, ARRAY['配列', 'メソッド', '線形探索'],
  'import java.util.Scanner;

public class Main {
    public static int findIndex(int[] arr, int target) {
        // ここに探索ロジックを実装してください
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        int target = sc.nextInt();
        System.out.println(findIndex(arr, target));
    }
}', 'import java.util.Scanner;

public class Main {
    public static int findIndex(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        int target = sc.nextInt();
        System.out.println(findIndex(arr, target));
    }
}', '一致した瞬間に `return i;` で早期リターンすると、最初に見つかったインデックスを返しつつ無駄な探索も止められます。',
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
  '44444444-4444-4444-8444-444444442111', '33333333-3333-4333-8333-333333333303', '3-6. 割引＆税込価格を計算するメソッド分割演習', '## 問題文
定価 `price`（円）と割引率 `discountPercent`（整数%）が入力されます。
以下の2つのメソッドを定義して組み合わせて使い、最終的な支払金額（整数・各計算ごとに小数点以下切り捨て）を出力してください。
1. `applyDiscount(int price, int discountPercent)`：割引後の税抜価格を返す（例：`price * (100 - discountPercent) / 100`）
2. `addTax(int price)`：10%の消費税を加えた税込価格を返す（`price * 110 / 100`）

### 入力例
```
2000
20
```

### 出力例
```
1760
```',
  'easy', 15, ARRAY['メソッド', '責務分割'],
  'import java.util.Scanner;

public class Main {
    // applyDiscount メソッドと addTax メソッドを定義してください

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int price = sc.nextInt();
        int discountPercent = sc.nextInt();
        // 2つのメソッドを呼び出して結果を出力してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static int applyDiscount(int price, int discountPercent) {
        return price * (100 - discountPercent) / 100;
    }

    public static int addTax(int price) {
        return price * 110 / 100;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int price = sc.nextInt();
        int discountPercent = sc.nextInt();
        int discounted = applyDiscount(price, discountPercent);
        int finalPrice = addTax(discounted);
        System.out.println(finalPrice);
    }
}', '「割引」と「課税」のように意味の単位でメソッドを分けると、計算ルールが変わったときも修正箇所が1か所で済みます。',
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
  '44444444-4444-4444-8444-444444442112', '33333333-3333-4333-8333-333333333304', '4-4. 社員クラス（Employee）の配列管理と一覧出力', '## 問題文
社員の氏名（`name`）と部署名（`department`）を持つ `Employee` クラスを作成し、自己紹介文字列 `"[部署名] 氏名"` を返すメソッド `formatLabel()` を実装してください。
`N` 名分の社員データを `Employee[]` 配列に格納し、先頭から順に1行ずつ出力してください。

### 入力例
```
2
山田太郎 開発部
佐藤花子 営業部
```

### 出力例
```
[開発部] 山田太郎
[営業部] 佐藤花子
```',
  'medium', 20, ARRAY['オブジェクト指向', 'クラス設計', 'オブジェクト配列'],
  'import java.util.Scanner;

class Employee {
    // フィールド・コンストラクタ・formatLabel() を実装してください
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Employee配列に格納して出力してください
    }
}', 'import java.util.Scanner;

class Employee {
    private String name;
    private String department;

    public Employee(String name, String department) {
        this.name = name;
        this.department = department;
    }

    public String formatLabel() {
        return "[" + department + "] " + name;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Employee[] list = new Employee[n];
        for (int i = 0; i < n; i++) {
            String name = sc.next();
            String dept = sc.next();
            list[i] = new Employee(name, dept);
        }
        for (int i = 0; i < n; i++) {
            System.out.println(list[i].formatLabel());
        }
    }
}', 'データ（フィールド）と表示ロジック（メソッド）を1つのクラスにまとめ、配列で複数管理する設計はEntity/DTOの基礎です。',
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
  '44444444-4444-4444-8444-444444442113', '33333333-3333-4333-8333-333333333304', '4-5. 在庫アイテムクラス（StockItem）の入庫・出庫と不足ガード', '## 問題文
商品名（`name`）と在庫数（`stock`）を持つ `StockItem` クラスを実装してください。
- `restock(int qty)`：在庫を `qty` 個増やす
- `ship(int qty)`：在庫が `qty` 個以上あれば減らして `true` を返し、足りなければ在庫を変更せず `false` を返す

入力として「商品名」「初期在庫」「操作回数 `Q`」に続き、`Q` 行の操作（`IN 数量` または `OUT 数量`）が与えられます。
`OUT` が在庫不足で失敗したときだけ `SHORTAGE` と出力し、最後に `<商品名>: <残在庫>` を出力してください。

### 入力例
```
Mouse 5
3
IN 3
OUT 10
OUT 4
```

### 出力例
```
SHORTAGE
Mouse: 4
```',
  'medium', 25, ARRAY['オブジェクト指向', 'カプセル化', '在庫管理'],
  'import java.util.Scanner;

class StockItem {
    // フィールド・コンストラクタ・restock・ship・getStock を実装してください
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        int initialStock = sc.nextInt();
        int q = sc.nextInt();
        // StockItem を生成し、q回の IN / OUT 操作を処理してください
    }
}', 'import java.util.Scanner;

class StockItem {
    private String name;
    private int stock;

    public StockItem(String name, int stock) {
        this.name = name;
        this.stock = stock;
    }

    public void restock(int qty) {
        this.stock += qty;
    }

    public boolean ship(int qty) {
        if (this.stock < qty) {
            return false;
        }
        this.stock -= qty;
        return true;
    }

    public String getSummary() {
        return name + ": " + stock;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        int initialStock = sc.nextInt();
        int q = sc.nextInt();
        StockItem item = new StockItem(name, initialStock);
        for (int i = 0; i < q; i++) {
            String cmd = sc.next();
            int qty = sc.nextInt();
            if (cmd.equals("IN")) {
                item.restock(qty);
            } else if (cmd.equals("OUT")) {
                if (!item.ship(qty)) {
                    System.out.println("SHORTAGE");
                }
            }
        }
        System.out.println(item.getSummary());
    }
}', '在庫がマイナスにならないよう `ship()` メソッド内部でガード条件を入れるのが、カプセル化によるデータ整合性の守り方です。',
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
  '44444444-4444-4444-8444-444444442114', '33333333-3333-4333-8333-333333333304', '4-6. 【入門総仕上げ】ショッピングカート（CartItem）の合計＆送料無料判定', '## 問題文
Java入門の総仕上げとして、複数商品をまとめて会計するミニショッピングカートを作成しましょう。
商品名・単価・数量を持つ `CartItem` クラスを定義し、小計を返す `getSubtotal()` メソッドを実装してください。
`N` 件の商品を読み込み、合計金額（`total`）を算出したあと、**5000円以上なら送料0円、5000円未満なら送料500円** を加算して以下を出力してください。

### 出力形式
```
商品合計: <商品合計>円
送料: <送料>円
請求金額: <請求金額>円
```

### 入力例
```
2
Keyboard 3000 1
Mouse 1200 2
```

### 出力例
```
商品合計: 5400円
送料: 0円
請求金額: 5400円
```',
  'medium', 25, ARRAY['オブジェクト指向', '配列', '条件分岐', '総仕上げ'],
  'import java.util.Scanner;

class CartItem {
    // フィールド・コンストラクタ・getSubtotal() を実装してください
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // N件の CartItem を読み込み、商品合計・送料・請求金額を出力してください
    }
}', 'import java.util.Scanner;

class CartItem {
    private String name;
    private int price;
    private int quantity;

    public CartItem(String name, int price, int quantity) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    public int getSubtotal() {
        return price * quantity;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        CartItem[] items = new CartItem[n];
        int total = 0;
        for (int i = 0; i < n; i++) {
            String name = sc.next();
            int price = sc.nextInt();
            int qty = sc.nextInt();
            items[i] = new CartItem(name, price, qty);
            total += items[i].getSubtotal();
        }
        int shipping = (total >= 5000) ? 0 : 500;
        System.out.println("商品合計: " + total + "円");
        System.out.println("送料: " + shipping + "円");
        System.out.println("請求金額: " + (total + shipping) + "円");
    }
}', '変数・入力・ループ・配列・条件分岐・クラス設計というJava入門のすべての基礎が1つの業務ロジックとして繋がりました。次はJava初級へ進みましょう！',
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
  '44444444-4444-4444-8444-444444442201', '5347964f-04df-4e46-ae8a-a654826f9d73', '初級 1-4. 二次元配列の列ごと合計と最大列の特定', '## 問題文
`R` 行 `C` 列の整数表（店舗×月別売上など）が与えられます。
各列（0列目〜C-1列目）の合計を1行目に半角スペース区切りで出力し、2行目に「合計が最大となった列番号（0始まり、同点時は小さい番号）」を出力してください。

### 入力例
```
2 3
10 20 30
40 50 10
```

### 出力例
```
50 70 40
1
```',
  'easy', 15, ARRAY['二次元配列', '列集計'],
  'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        int[][] grid = new int[r][c];
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) {
                grid[i][j] = sc.nextInt();
            }
        }
        // 列ごとの合計と最大列番号を出力してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        int[][] grid = new int[r][c];
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) {
                grid[i][j] = sc.nextInt();
            }
        }
        int bestCol = 0;
        int bestSum = -2147483648;
        String line = "";
        for (int j = 0; j < c; j++) {
            int colSum = 0;
            for (int i = 0; i < r; i++) {
                colSum += grid[i][j];
            }
            if (j > 0) line += " ";
            line += colSum;
            if (colSum > bestSum) {
                bestSum = colSum;
                bestCol = j;
            }
        }
        System.out.println(line);
        System.out.println(bestCol);
    }
}', '列方向を集計するときは、外側のループを列 `j`、内側のループを行 `i` にするとスッキリ書けます。',
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
  '44444444-4444-4444-8444-444444442202', '5347964f-04df-4e46-ae8a-a654826f9d73', '初級 1-5. 会議室座席表（二次元配列）の予約＆残空席カウント', '## 問題文
`R` 行 `C` 列の座席（初期はすべて空席 `0`）に対し、`Q` 件の予約リクエスト（行 `r` 列 `c`）が来ます。
空席なら予約済（`1`）にして `OK`、すでに予約済なら `TAKEN` と出力し、最後に残りの空席数を出力してください。

### 入力例
```
2 2
3
0 1
0 1
1 0
```

### 出力例
```
OK
TAKEN
OK
2
```',
  'easy', 15, ARRAY['二次元配列', '状態管理'],
  'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int rows = sc.nextInt();
        int cols = sc.nextInt();
        int q = sc.nextInt();
        // 二次元配列で座席予約と残空席数を処理してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int rows = sc.nextInt();
        int cols = sc.nextInt();
        int q = sc.nextInt();
        int[][] seats = new int[rows][cols];
        int reserved = 0;
        for (int i = 0; i < q; i++) {
            int r = sc.nextInt();
            int c = sc.nextInt();
            if (seats[r][c] == 0) {
                seats[r][c] = 1;
                reserved++;
                System.out.println("OK");
            } else {
                System.out.println("TAKEN");
            }
        }
        System.out.println(rows * cols - reserved);
    }
}', '二次元配列の要素をフラグ（`0`/`1`）として管理すると、重複予約防止と残数算出がO(1)で行えます。',
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
  '44444444-4444-4444-8444-444444442203', '5347964f-04df-4e46-ae8a-a654826f9d73', '初級 1-6. メソッドのオーバーロード（2引数・3引数の最大値）', '## 問題文
同名メソッド `maxVal` をオーバーロードして2つ定義してください。
1. `maxVal(int a, int b)`：2つの整数の大きい方を返す
2. `maxVal(int a, int b, int c)`：3つの整数の最大値を返す

入力として3つの整数 `a, b, c` が与えられます。1行目に `maxVal(a, b)`、2行目に `maxVal(a, b, c)` を出力してください。',
  'easy', 12, ARRAY['メソッド', 'オーバーロード'],
  'import java.util.Scanner;

public class Main {
    // maxVal を2引数・3引数でオーバーロードしてください

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        // 結果を2行で出力してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static int maxVal(int a, int b) {
        return a >= b ? a : b;
    }

    public static int maxVal(int a, int b, int c) {
        return maxVal(maxVal(a, b), c);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        System.out.println(maxVal(a, b));
        System.out.println(maxVal(a, b, c));
    }
}', '3引数版の中で2引数版を呼び出すと、重複ロジックを排除できます。',
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
  '44444444-4444-4444-8444-444444442204', '5347964f-04df-4e46-ae8a-a654826f9d73', '初級 1-7. 配列の昇順ソートと上位K件の合計（メソッド実装）', '## 問題文
整数 `N`, `K` と `N` 個のスコアが与えられます。
スコアを大きい順に見たときの上位 `K` 件の合計を返すメソッド `sumTopK(int[] arr, int k)` を実装し、結果を出力してください。',
  'medium', 20, ARRAY['配列', 'ソート', 'メソッド'],
  'import java.util.Scanner;

public class Main {
    public static int sumTopK(int[] arr, int k) {
        // 並べ替えて上位k件の合計を返してください
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(sumTopK(arr, k));
    }
}', 'import java.util.Scanner;

public class Main {
    public static int sumTopK(int[] arr, int k) {
        for (int i = 0; i < arr.length - 1; i++) {
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[j] > arr[i]) {
                    int tmp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = tmp;
                }
            }
        }
        int sum = 0;
        for (int i = 0; i < k && i < arr.length; i++) {
            sum += arr[i];
        }
        return sum;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(sumTopK(arr, k));
    }
}', '降順に並べ替えて先頭から `k` 件を足すアルゴリズムは、ランキング集計の基礎です。',
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
  '44444444-4444-4444-8444-444444442205', '5347964f-04df-4e46-ae8a-a654826f9d73', '初級 1-8. 配列内のユニーク要素数を数えるメソッド', '## 問題文
整数 `N` と `N` 個の整数が与えられます。重複を除いた「異なる値の種類数」を返すメソッド `countUnique(int[] arr)` を実装してください。',
  'medium', 15, ARRAY['配列', '重複判定', 'メソッド'],
  'import java.util.Scanner;

public class Main {
    public static int countUnique(int[] arr) {
        // 重複を除いた種類数を返してください
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(countUnique(arr));
    }
}', 'import java.util.Scanner;

public class Main {
    public static int countUnique(int[] arr) {
        int count = 0;
        for (int i = 0; i < arr.length; i++) {
            boolean seen = false;
            for (int j = 0; j < i; j++) {
                if (arr[j] == arr[i]) {
                    seen = true;
                    break;
                }
            }
            if (!seen) count++;
        }
        return count;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(countUnique(arr));
    }
}', '各要素 `i` について「それより前（`0..i-1`）に同じ値が出ていなければカウント+1」とする定番テクニックです。',
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
  '44444444-4444-4444-8444-444444442206', '5347964f-04df-4e46-ae8a-a654826f9d73', '初級 1-9. 成績マトリクス（生徒×科目）の個人合計＆トップ生徒判定', '## 問題文
`S` 人の生徒と `M` 科目の点数が二次元配列として与えられます。
各生徒の合計点を1行ずつ出力し、最終行に「合計点が最も高い生徒番号（1始まり、同点時は小さい番号）」を出力してください。',
  'medium', 20, ARRAY['二次元配列', '行集計'],
  'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int s = sc.nextInt();
        int m = sc.nextInt();
        int[][] scores = new int[s][m];
        for (int i = 0; i < s; i++) {
            for (int j = 0; j < m; j++) {
                scores[i][j] = sc.nextInt();
            }
        }
        // 各生徒の合計とトップ生徒番号(1始まり)を出力してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int s = sc.nextInt();
        int m = sc.nextInt();
        int[][] scores = new int[s][m];
        for (int i = 0; i < s; i++) {
            for (int j = 0; j < m; j++) {
                scores[i][j] = sc.nextInt();
            }
        }
        int bestIdx = 0;
        int bestSum = -1;
        for (int i = 0; i < s; i++) {
            int rowSum = 0;
            for (int j = 0; j < m; j++) {
                rowSum += scores[i][j];
            }
            System.out.println(rowSum);
            if (rowSum > bestSum) {
                bestSum = rowSum;
                bestIdx = i;
            }
        }
        System.out.println(bestIdx + 1);
    }
}', '生徒番号は1始まりなので、最後に `bestIdx + 1` とする点に注意しましょう。',
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
  '44444444-4444-4444-8444-444444442207', '41302b0f-c345-4660-9dfe-6cf806c97783', '初級 2-4. staticカウンタによる注文番号の自動採番クラス', '## 問題文
`Order` クラスを作成し、インスタンスを生成するたびに `static` 変数で `1001, 1002, 1003, ...` と自動採番される注文IDと商品名を持たせてください。
`N` 件の商品名が入力されるので、生成順に `ORD-<ID>: <商品名>` を出力してください。',
  'medium', 15, ARRAY['static', 'コンストラクタ', 'オブジェクト指向'],
  'import java.util.Scanner;

class Order {
    // static変数とインスタンス変数を定義してください
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Order をn件生成して出力してください
    }
}', 'import java.util.Scanner;

class Order {
    private static int nextId = 1001;
    private int id;
    private String itemName;

    public Order(String itemName) {
        this.id = nextId++;
        this.itemName = itemName;
    }

    public String format() {
        return "ORD-" + id + ": " + itemName;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            Order o = new Order(sc.next());
            System.out.println(o.format());
        }
    }
}', '`static` フィールドはクラス全体で1つだけ共有されるため、連番IDの発行に活用できます。',
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
  '44444444-4444-4444-8444-444444442208', '41302b0f-c345-4660-9dfe-6cf806c97783', '初級 2-5. 継承とsuperによる一般社員・管理職の給与計算', '## 問題文
基本給 `baseSalary` を返す `Staff` クラスと、それを継承して役職手当 `allowance` を加算する `Manager` クラスを作成してください。
`N` 名のデータ（`STAFF 氏名 基本給` または `MANAGER 氏名 基本給 手当`）を読み込み、`<氏名>: <支給額>` を出力してください。',
  'medium', 20, ARRAY['継承', 'super', 'オーバーライド'],
  'import java.util.Scanner;

class Staff {
    // 実装してください
}

class Manager extends Staff {
    // super を使って実装してください
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // ポリモーフィズムで給与計算結果を出力してください
    }
}', 'import java.util.Scanner;

class Staff {
    protected String name;
    protected int baseSalary;

    public Staff(String name, int baseSalary) {
        this.name = name;
        this.baseSalary = baseSalary;
    }

    public int calcPay() {
        return baseSalary;
    }

    public String getName() {
        return name;
    }
}

class Manager extends Staff {
    private int allowance;

    public Manager(String name, int baseSalary, int allowance) {
        super(name, baseSalary);
        this.allowance = allowance;
    }

    @Override
    public int calcPay() {
        return super.calcPay() + allowance;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Staff[] members = new Staff[n];
        for (int i = 0; i < n; i++) {
            String type = sc.next();
            String name = sc.next();
            int base = sc.nextInt();
            if (type.equals("MANAGER")) {
                int allow = sc.nextInt();
                members[i] = new Manager(name, base, allow);
            } else {
                members[i] = new Staff(name, base);
            }
        }
        for (int i = 0; i < n; i++) {
            System.out.println(members[i].getName() + ": " + members[i].calcPay());
        }
    }
}', '子クラスから `super(name, baseSalary)` で親コンストラクタを呼び出し、`calcPay()` をオーバーライドすることで共通型 `Staff[]` で統一処理できます。',
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
  '44444444-4444-4444-8444-444444442209', '41302b0f-c345-4660-9dfe-6cf806c97783', '初級 2-6. 抽象クラス（Shape）による図形面積の一括合計', '## 問題文
抽象メソッド `int area()` を持つ抽象クラス `Shape` を定義し、`RectShape`（幅×高さ）と `TriShape`（底辺×高さ÷2）で実装してください。
`N` 個の図形（`RECT w h` または `TRI b h`）の面積合計を出力してください。',
  'medium', 20, ARRAY['抽象クラス', 'ポリモーフィズム'],
  'import java.util.Scanner;

abstract class Shape {
    public abstract int area();
}

// RectShape と TriShape を実装してください

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Shape配列で面積合計を出力してください
    }
}', 'import java.util.Scanner;

abstract class Shape {
    public abstract int area();
}

class RectShape extends Shape {
    private int w, h;
    public RectShape(int w, int h) { this.w = w; this.h = h; }
    @Override
    public int area() { return w * h; }
}

class TriShape extends Shape {
    private int b, h;
    public TriShape(int b, int h) { this.b = b; this.h = h; }
    @Override
    public int area() { return b * h / 2; }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Shape[] shapes = new Shape[n];
        for (int i = 0; i < n; i++) {
            String kind = sc.next();
            int a = sc.nextInt();
            int b = sc.nextInt();
            if (kind.equals("RECT")) shapes[i] = new RectShape(a, b);
            else shapes[i] = new TriShape(a, b);
        }
        int total = 0;
        for (int i = 0; i < n; i++) total += shapes[i].area();
        System.out.println(total);
    }
}', '抽象クラスで「必ず `area()` を実装させる」契約を作ることで、呼び出し側は図形の種類を意識せず集計できます。',
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
  '44444444-4444-4444-8444-444444442210', '41302b0f-c345-4660-9dfe-6cf806c97783', '初級 2-7. インターフェース（DiscountPolicy）による会員ランク別割引', '## 問題文
`int apply(int price)` を持つインターフェース `DiscountPolicy` を定義し、以下の2クラスを実装してください。
- `RegularPolicy`：5%引き（`price * 95 / 100`）
- `VipPolicy`：20%引き（`price * 80 / 100`）

会員種別（`REGULAR` または `VIP`）と定価が与えられるので、割引後価格を出力してください。',
  'medium', 15, ARRAY['インターフェース', 'Strategyパターン'],
  'import java.util.Scanner;

interface DiscountPolicy {
    int apply(int price);
}

// RegularPolicy と VipPolicy を実装してください

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String rank = sc.next();
        int price = sc.nextInt();
        // DiscountPolicy を使って割引後価格を出力してください
    }
}', 'import java.util.Scanner;

interface DiscountPolicy {
    int apply(int price);
}

class RegularPolicy implements DiscountPolicy {
    @Override
    public int apply(int price) {
        return price * 95 / 100;
    }
}

class VipPolicy implements DiscountPolicy {
    @Override
    public int apply(int price) {
        return price * 80 / 100;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String rank = sc.next();
        int price = sc.nextInt();
        DiscountPolicy policy = rank.equals("VIP") ? new VipPolicy() : new RegularPolicy();
        System.out.println(policy.apply(price));
    }
}', '割引ルールをインターフェースとして差し替え可能にする設計は、実務でよく使う Strategy パターンの基本形です。',
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
  '44444444-4444-4444-8444-444444442211', '41302b0f-c345-4660-9dfe-6cf806c97783', '初級 2-8. ポリモーフィズムによるマルチチャネル通知送信', '## 問題文
`String send(String msg)` を持つインターフェース `Notifier` を定義し、
- `EmailNotifier`：`"[EMAIL] " + msg`
- `SlackNotifier`：`"[SLACK] " + msg`
を返すクラスを実装してください。

`N` 件の送信先種別（`EMAIL` / `SLACK`）とメッセージ文字列を読み込み、送信結果を1行ずつ出力してください。',
  'medium', 15, ARRAY['インターフェース', 'ポリモーフィズム'],
  'import java.util.Scanner;

interface Notifier {
    String send(String msg);
}

// EmailNotifier と SlackNotifier を実装してください

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // 通知を順番に送信出力してください
    }
}', 'import java.util.Scanner;

interface Notifier {
    String send(String msg);
}

class EmailNotifier implements Notifier {
    @Override
    public String send(String msg) { return "[EMAIL] " + msg; }
}

class SlackNotifier implements Notifier {
    @Override
    public String send(String msg) { return "[SLACK] " + msg; }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String ch = sc.next();
            String msg = sc.next();
            Notifier notifier = ch.equals("SLACK") ? new SlackNotifier() : new EmailNotifier();
            System.out.println(notifier.send(msg));
        }
    }
}', 'Spring BootのDI（依存性注入）でも、このようにインターフェース型で受けて実装クラスを切り替える設計が基本となります。',
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
  '44444444-4444-4444-8444-444444442212', '41302b0f-c345-4660-9dfe-6cf806c97783', '初級 2-9. 【初級総合】複数決済手段の合計手数料計算システム', '## 問題文
`int calcFee(int amount)` を持つインターフェース `FeeCalculator` を定義し、以下の決済手数料を実装してください。
- `CARD`：決済額の3%（`amount * 3 / 100`）
- `BANK`：一律220円
- `CASH`：0円

`N` 件の決済データ（`種別 金額`）を読み込み、全件の手数料合計を出力してください。',
  'medium', 25, ARRAY['インターフェース', '総合演習', 'オブジェクト指向'],
  'import java.util.Scanner;

interface FeeCalculator {
    int calcFee(int amount);
}

// 3つの決済手数料クラスを実装してください

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // N件の手数料合計を出力してください
    }
}', 'import java.util.Scanner;

interface FeeCalculator {
    int calcFee(int amount);
}

class CardFee implements FeeCalculator {
    @Override
    public int calcFee(int amount) { return amount * 3 / 100; }
}

class BankFee implements FeeCalculator {
    @Override
    public int calcFee(int amount) { return 220; }
}

class CashFee implements FeeCalculator {
    @Override
    public int calcFee(int amount) { return 0; }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int totalFee = 0;
        for (int i = 0; i < n; i++) {
            String type = sc.next();
            int amount = sc.nextInt();
            FeeCalculator calc;
            if (type.equals("CARD")) calc = new CardFee();
            else if (type.equals("BANK")) calc = new BankFee();
            else calc = new CashFee();
            totalFee += calc.calcFee(amount);
        }
        System.out.println(totalFee);
    }
}', '初級の総仕上げとして、インターフェースによるポリモーフィズムとループ集計を組み合わせた実務的な決済手数料計算を完成させました。',
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
  '44444444-4444-4444-8444-444444442301', '1177c80b-bcc9-4745-a4f8-7caf1ef01327', '中級 1-4. ArrayListによる価格フィルタリングと抽出一覧', '## 問題文
`N` 件の「商品名 単価」と上限金額 `maxPrice` が与えられます。
単価が `maxPrice` 以下の商品名だけを `ArrayList<String>` へ格納し、件数を1行目に、該当商品名を登録順で2行目以降に出力してください（0件時は1行目に `0` のみ）。',
  'medium', 15, ARRAY['ArrayList', 'フィルタリング'],
  'import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // ArrayList を使って条件に合う商品を抽出してください
    }
}', 'import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        String[] names = new String[n];
        int[] prices = new int[n];
        for (int i = 0; i < n; i++) {
            names[i] = sc.next();
            prices[i] = sc.nextInt();
        }
        int maxPrice = sc.nextInt();
        ArrayList<String> matched = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if (prices[i] <= maxPrice) {
                matched.add(names[i]);
            }
        }
        System.out.println(matched.size());
        for (int i = 0; i < matched.size(); i++) {
            System.out.println(matched.get(i));
        }
    }
}', '事前に件数が分からない抽出結果は、可変長の `ArrayList` へ `add()` していくのがJavaの標準です。',
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
  '44444444-4444-4444-8444-444444442302', '1177c80b-bcc9-4745-a4f8-7caf1ef01327', '中級 1-5. HashMapによるエラーログコードの出現回数カウント', '## 問題文
`N` 件のエラーコード（例：`E404`, `E500`）と、調査対象コード `target` が与えられます。
`HashMap<String, Integer>` を使って各コードの出現回数を集計し、`target` の出現回数（未出現なら `0`）を出力してください。',
  'medium', 15, ARRAY['HashMap', 'ログ集計'],
  'import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // HashMap で出現回数をカウントしてください
    }
}', 'import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        HashMap<String, Integer> counts = new HashMap<>();
        for (int i = 0; i < n; i++) {
            String code = sc.next();
            int prev = counts.containsKey(code) ? counts.get(code) : 0;
            counts.put(code, prev + 1);
        }
        String target = sc.next();
        System.out.println(counts.containsKey(target) ? counts.get(target) : 0);
    }
}', '`HashMap` で `containsKey`（または `getOrDefault`）を使ってカウントアップする処理は、アクセスログ解析や集計APIで頻出です。',
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
  '44444444-4444-4444-8444-444444442303', '1177c80b-bcc9-4745-a4f8-7caf1ef01327', '中級 1-6. HashMapによる部署別メンバー数の集計（入力順維持）', '## 問題文
`N` 名の「氏名 部署名」が与えられます。
部署ごとの人数を集計し、**部署が最初に登場した順番** で `<部署名>: <人数>` を出力してください。',
  'medium', 20, ARRAY['HashMap', 'ArrayList', 'グループ集計'],
  'import java.util.ArrayList;
import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // 部署の初出順を保ちながら人数を集計してください
    }
}', 'import java.util.ArrayList;
import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        ArrayList<String> order = new ArrayList<>();
        HashMap<String, Integer> counts = new HashMap<>();
        for (int i = 0; i < n; i++) {
            sc.next(); // name
            String dept = sc.next();
            if (!counts.containsKey(dept)) {
                order.add(dept);
                counts.put(dept, 1);
            } else {
                counts.put(dept, counts.get(dept) + 1);
            }
        }
        for (int i = 0; i < order.size(); i++) {
            String d = order.get(i);
            System.out.println(d + ": " + counts.get(d));
        }
    }
}', '`HashMap` 自体は順序を保証しないため、キーの初出順を `ArrayList` に記録しておくと安定した出力順を保てます。',
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
  '44444444-4444-4444-8444-444444442304', '1177c80b-bcc9-4745-a4f8-7caf1ef01327', '中級 1-7. ArrayListによる重複ID除去と出現順リスト作成', '## 問題文
`N` 件の顧客ID（文字列）が与えられます。重複を除去し、最初に現れた順番で半角スペース区切りに出力してください。',
  'medium', 15, ARRAY['ArrayList', '重複除去'],
  'import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // 重複を除去してスペース区切りで出力してください
    }
}', 'import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        ArrayList<String> unique = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            String id = sc.next();
            if (!unique.contains(id)) {
                unique.add(id);
            }
        }
        String out = "";
        for (int i = 0; i < unique.size(); i++) {
            if (i > 0) out += " ";
            out += unique.get(i);
        }
        System.out.println(out);
    }
}', '`ArrayList.contains()` を使うと、重複チェックと順序維持を簡潔に実装できます。',
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
  '44444444-4444-4444-8444-444444442305', '1177c80b-bcc9-4745-a4f8-7caf1ef01327', '中級 1-8. 商品マスタ（HashMap）参照による複数注文の合計算出', '## 問題文
まず `M` 件の商品マスタ（`商品コード 単価`）が与えられ、続いて `Q` 件の注文（`商品コード 数量`）が与えられます。
`HashMap<String, Integer>` にマスタを登録し、注文の合計金額を出力してください（マスタに存在しない商品コードは無視してください）。',
  'medium', 20, ARRAY['HashMap', 'マスタ参照', '業務集計'],
  'import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        // マスタをHashMapに登録し、注文合計を計算してください
    }
}', 'import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        HashMap<String, Integer> master = new HashMap<>();
        for (int i = 0; i < m; i++) {
            master.put(sc.next(), sc.nextInt());
        }
        int q = sc.nextInt();
        int total = 0;
        for (int i = 0; i < q; i++) {
            String code = sc.next();
            int qty = sc.nextInt();
            if (master.containsKey(code)) {
                total += master.get(code) * qty;
            }
        }
        System.out.println(total);
    }
}', 'ExcelのVLOOKUPに相当するマスタ参照は、Javaでは `HashMap` を使うと高速（O(1)）に処理できます。',
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
  '44444444-4444-4444-8444-444444442306', '06f2d4e3-729c-4392-8945-9af33d7833e5', '中級 2-4. CSV売上明細のパースと合計金額計算', '## 問題文
`N` 行のCSV文字列（`商品名,単価,数量` 形式）が与えられます。
各行を `split(",")` で分割し、`Integer.parseInt` で数値変換して全行の売上合計（単価×数量の総和）を出力してください。',
  'medium', 15, ARRAY['CSV処理', 'split', '文字列API'],
  'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // N行のCSV（商品名,単価,数量）をパースして合計を出力してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int total = 0;
        for (int i = 0; i < n; i++) {
            String row = sc.next();
            String[] cols = row.split(",");
            int price = Integer.parseInt(cols[1]);
            int qty = Integer.parseInt(cols[2]);
            total += price * qty;
        }
        System.out.println(total);
    }
}', 'カンマ区切り文字列を `split(",")` で配列にし、`Integer.parseInt` で数値化するのはバッチ処理の基本です。',
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
  '44444444-4444-4444-8444-444444442307', '06f2d4e3-729c-4392-8945-9af33d7833e5', '中級 2-5. 不正数値を含むデータのtry-catchスキップ集計', '## 問題文
`N` 個の文字列が与えられます。整数に変換できるものだけを合計し、変換できない不正文字列は `try-catch` でスキップして件数を数えてください。
1行目に「有効な数値の合計」、2行目に「スキップした不正件数」を出力してください。',
  'medium', 15, ARRAY['例外処理', 'try-catch', 'NumberFormatException'],
  'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // try-catch で不正データをスキップしながら集計してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int sum = 0;
        int errors = 0;
        for (int i = 0; i < n; i++) {
            String token = sc.next();
            try {
                sum += Integer.parseInt(token);
            } catch (Exception e) {
                errors++;
            }
        }
        System.out.println(sum);
        System.out.println(errors);
    }
}', '外部CSV取り込みなどでは1件の不正データで処理全体を落とさず、`try-catch` で捕捉してエラー件数を記録する設計がよく使われます。',
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
  '44444444-4444-4444-8444-444444442308', '06f2d4e3-729c-4392-8945-9af33d7833e5', '中級 2-6. メールアドレスの形式チェックとドメイン抽出', '## 問題文
`N` 件のメールアドレス候補文字列が与えられます。
`@` を含み、`@` の前後に1文字以上ある場合は `@` 以降のドメイン部分を小文字で出力し、それ以外は `INVALID` と出力してください。',
  'medium', 15, ARRAY['文字列API', 'indexOf', 'substring'],
  'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // 各文字列のドメイン抽出または INVALID 出力を行ってください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String s = sc.next();
            int at = s.indexOf("@");
            if (at > 0 && at < s.length() - 1) {
                System.out.println(s.substring(at + 1).toLowerCase());
            } else {
                System.out.println("INVALID");
            }
        }
    }
}', '`indexOf("@")` が `> 0` かつ `< length() - 1` であることを確認すると、先頭・末尾の `@` も安全に弾けます。',
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
  '44444444-4444-4444-8444-444444442309', '06f2d4e3-729c-4392-8945-9af33d7833e5', '中級 2-7. throwによる年齢バリデーションメソッドと例外捕捉', '## 問題文
年齢 `age` を検証するメソッド `validateAge(int age)` を作成してください。
- `age < 0` または `age > 120` の場合は `throw new IllegalArgumentException("OUT_OF_RANGE")` をスローする
- 範囲内なら何もしない

`N` 件の年齢入力に対し、`main` 側で `try-catch` して正常なら `OK`、例外時はメッセージ（`e.getMessage()`）を出力してください。',
  'medium', 15, ARRAY['例外処理', 'throw', 'バリデーション'],
  'import java.util.Scanner;

public class Main {
    public static void validateAge(int age) {
        // 範囲外なら IllegalArgumentException をスローしてください
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // 各入力を validateAge で検証して出力してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void validateAge(int age) {
        if (age < 0 || age > 120) {
            throw new IllegalArgumentException("OUT_OF_RANGE");
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            int age = sc.nextInt();
            try {
                validateAge(age);
                System.out.println("OK");
            } catch (IllegalArgumentException e) {
                System.out.println(e.getMessage());
            }
        }
    }
}', '検証ロジック側で `throw` し、呼び出し側で `catch` してエラー応答を返すパターンはSpring BootのService/Controller設計に直結します。',
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
  '44444444-4444-4444-8444-444444442310', '06f2d4e3-729c-4392-8945-9af33d7833e5', '中級 2-8. 【中級総合】CSV売上データのカテゴリ別集計＆エラー行カウント', '## 問題文
`N` 行のCSVデータ（`カテゴリ,金額`）が与えられます。金額が数値でない行や負の金額の行はエラーとしてスキップし、エラー件数を数えてください。
有効なデータについて、カテゴリの初出順に `<カテゴリ>: <合計金額>` を出力し、最終行に `ERRORS: <エラー件数>` を出力してください。',
  'hard', 25, ARRAY['HashMap', 'CSV処理', '例外処理', '総合演習'],
  'import java.util.ArrayList;
import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // CSVパース・エラーハンドリング・カテゴリ別集計を実装してください
    }
}', 'import java.util.ArrayList;
import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        ArrayList<String> cats = new ArrayList<>();
        HashMap<String, Integer> sums = new HashMap<>();
        int errors = 0;
        for (int i = 0; i < n; i++) {
            String line = sc.next();
            String[] parts = line.split(",");
            if (parts.length < 2) {
                errors++;
                continue;
            }
            try {
                int amount = Integer.parseInt(parts[1]);
                if (amount < 0) {
                    errors++;
                    continue;
                }
                String cat = parts[0];
                if (!sums.containsKey(cat)) {
                    cats.add(cat);
                    sums.put(cat, amount);
                } else {
                    sums.put(cat, sums.get(cat) + amount);
                }
            } catch (Exception e) {
                errors++;
            }
        }
        for (int i = 0; i < cats.size(); i++) {
            String c = cats.get(i);
            System.out.println(c + ": " + sums.get(c));
        }
        System.out.println("ERRORS: " + errors);
    }
}', 'コレクション・CSV分割・バリデーション・例外処理をすべて統合した中級の集大成です。',
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
  '44444444-4444-4444-8444-444444442401', 'd62467af-4c0c-45b3-be32-3224f0765b0d', '上級 1-4. Repository層のCRUD模擬（登録・検索・論理削除）', '## 問題文
商品ID（`id`）・商品名（`name`）・論理削除フラグ（`deleted`）を管理する `ProductRepo` クラスを実装してください。
`Q` 件のコマンドを処理します：
- `ADD id name`：商品を登録
- `DEL id`：該当IDの `deleted` を `true` に変更
- `LIST`：`deleted == false` の商品を登録順で `id:name` 形式で出力（0件なら `EMPTY`）',
  'medium', 25, ARRAY['DAO', '論理削除', 'CRUD'],
  'import java.util.ArrayList;
import java.util.Scanner;

class ProductEntity {
    int id;
    String name;
    boolean deleted;
    ProductEntity(int id, String name) {
        this.id = id;
        this.name = name;
        this.deleted = false;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int q = sc.nextInt();
        // ADD / DEL / LIST コマンドを処理してください
    }
}', 'import java.util.ArrayList;
import java.util.Scanner;

class ProductEntity {
    int id;
    String name;
    boolean deleted;
    ProductEntity(int id, String name) {
        this.id = id;
        this.name = name;
        this.deleted = false;
    }
}

class ProductRepo {
    private ArrayList<ProductEntity> store = new ArrayList<>();

    public void save(int id, String name) {
        store.add(new ProductEntity(id, name));
    }

    public void softDelete(int id) {
        for (int i = 0; i < store.size(); i++) {
            if (store.get(i).id == id) {
                store.get(i).deleted = true;
            }
        }
    }

    public ArrayList<ProductEntity> findAllActive() {
        ArrayList<ProductEntity> res = new ArrayList<>();
        for (int i = 0; i < store.size(); i++) {
            if (!store.get(i).deleted) res.add(store.get(i));
        }
        return res;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int q = sc.nextInt();
        ProductRepo repo = new ProductRepo();
        for (int i = 0; i < q; i++) {
            String cmd = sc.next();
            if (cmd.equals("ADD")) {
                repo.save(sc.nextInt(), sc.next());
            } else if (cmd.equals("DEL")) {
                repo.softDelete(sc.nextInt());
            } else if (cmd.equals("LIST")) {
                ArrayList<ProductEntity> list = repo.findAllActive();
                if (list.size() == 0) {
                    System.out.println("EMPTY");
                } else {
                    for (int j = 0; j < list.size(); j++) {
                        ProductEntity p = list.get(j);
                        System.out.println(p.id + ":" + p.name);
                    }
                }
            }
        }
    }
}', '物理削除せず `deleted = true` として `findAllActive()` で絞り込む設計は、後半のSpring Boot商品管理システムと同じ構造です。',
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
  '44444444-4444-4444-8444-444444442402', 'd62467af-4c0c-45b3-be32-3224f0765b0d', '上級 1-5. 商品登録フォームの複数項目バリデーション', '## 問題文
商品登録の入力値 `sku`（文字列）・`price`（整数）・`stock`（整数）が与えられます。
以下のルールをすべてチェックし、違反があれば該当エラーコードを順番に1行ずつ出力、すべて正常なら `VALID` を出力してください。
1. `sku.length() < 3` → `ERR_SKU`
2. `price < 0` → `ERR_PRICE`
3. `stock < 0` → `ERR_STOCK`',
  'medium', 15, ARRAY['バリデーション', 'フォーム設計'],
  'import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String sku = sc.next();
        int price = sc.nextInt();
        int stock = sc.nextInt();
        // 3項目をすべて検証し、エラー一覧または VALID を出力してください
    }
}', 'import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String sku = sc.next();
        int price = sc.nextInt();
        int stock = sc.nextInt();
        ArrayList<String> errs = new ArrayList<>();
        if (sku.length() < 3) errs.add("ERR_SKU");
        if (price < 0) errs.add("ERR_PRICE");
        if (stock < 0) errs.add("ERR_STOCK");
        if (errs.size() == 0) {
            System.out.println("VALID");
        } else {
            for (int i = 0; i < errs.size(); i++) {
                System.out.println(errs.get(i));
            }
        }
    }
}', '最初の1エラーで止めずに全項目のエラーをリストへ集約して返却すると、ユーザーが1回で全箇所を直せる親切なフォームになります。',
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
  '44444444-4444-4444-8444-444444442403', 'd62467af-4c0c-45b3-be32-3224f0765b0d', '上級 1-6. SKU重複チェック付き商品登録サービス（Service層設計）', '## 問題文
`N` 件の商品登録リクエスト（`sku 商品名`）が順番に来ます。
すでに登録済みのSKUが来た場合は登録せず `DUPLICATE: <sku>`、新規SKUであれば登録して `CREATED: <sku>` を出力してください。最後に総登録件数を出力してください。',
  'medium', 15, ARRAY['Service設計', '重複チェック', 'HashMap'],
  'import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // SKU重複チェック付き登録処理を実装してください
    }
}', 'import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        HashMap<String, String> repo = new HashMap<>();
        for (int i = 0; i < n; i++) {
            String sku = sc.next();
            String name = sc.next();
            if (repo.containsKey(sku)) {
                System.out.println("DUPLICATE: " + sku);
            } else {
                repo.put(sku, name);
                System.out.println("CREATED: " + sku);
            }
        }
        System.out.println(repo.size());
    }
}', '一意制約（UNIQUE）のあるカラムをService層で事前に `existsBySku` チェックする実務パターンの模擬です。',
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
  '44444444-4444-4444-8444-444444442404', 'd62467af-4c0c-45b3-be32-3224f0765b0d', '上級 1-7. ページネーション計算（総ページ数とoffset算出）', '## 問題文
総データ件数 `total`（0以上）、1ページあたりの件数 `size`（1以上）、表示ページ番号 `page`（1始まり）が与えられます。
以下を3行で出力してください：
1. 総ページ数（`total == 0` なら `0`、それ以外は切り上げ）
2. SQLの `OFFSET` 値（`(page - 1) * size`）
3. そのページに表示される実際の件数（0以上 `size` 以下）',
  'medium', 20, ARRAY['ページネーション', '境界値', 'Web設計'],
  'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int total = sc.nextInt();
        int size = sc.nextInt();
        int page = sc.nextInt();
        // 総ページ数、OFFSET、現在ページ件数を3行で出力してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int total = sc.nextInt();
        int size = sc.nextInt();
        int page = sc.nextInt();
        int totalPages = total == 0 ? 0 : (total + size - 1) / size;
        int offset = (page - 1) * size;
        int remaining = total - offset;
        int count = remaining <= 0 ? 0 : (remaining < size ? remaining : size);
        System.out.println(totalPages);
        System.out.println(offset);
        System.out.println(count);
    }
}', '整数の切り上げ割り算 `(total + size - 1) / size` はページネーション実装の定番公式です。',
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
  '44444444-4444-4444-8444-444444442405', 'd62467af-4c0c-45b3-be32-3224f0765b0d', '上級 1-8. ロール権限マトリクスによるURLアクセス制御（403判定）', '## 問題文
Spring Securityの認可ルールをJavaで実装しましょう。
`Q` 件のリクエスト（`ロール URL`）が与えられます。
- URLが `/admin/` で始まる場合：`ADMIN` ロールのみ `200 OK`、それ以外は `403 FORBIDDEN`
- URLが `/user/` で始まる場合：`ADMIN` または `USER` は `200 OK`、それ以外（`GUEST` 等）は `403 FORBIDDEN`
- それ以外の公開URL：すべて `200 OK`',
  'medium', 15, ARRAY['セキュリティ', '認可', 'Spring Security準備'],
  'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int q = sc.nextInt();
        // ロールとURLプレフィックスから 200 OK / 403 FORBIDDEN を判定してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int q = sc.nextInt();
        for (int i = 0; i < q; i++) {
            String role = sc.next();
            String url = sc.next();
            boolean allowed = true;
            if (url.startsWith("/admin/")) {
                allowed = role.equals("ADMIN");
            } else if (url.startsWith("/user/")) {
                allowed = role.equals("ADMIN") || role.equals("USER");
            }
            System.out.println(allowed ? "200 OK" : "403 FORBIDDEN");
        }
    }
}', '`startsWith` とロールチェックの組み合わせは、チーム開発設計書の権限マトリクス（Sheet 3）そのままの考え方です。',
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
  '44444444-4444-4444-8444-444444442406', '3f313153-e5f5-466a-b5f2-51a43cefbf1d', '上級 2-4. 注文ステータス遷移マシンの正当性チェック', '## 問題文
注文ステータスは `NEW → PAID → SHIPPED → DONE` の順番にのみ遷移可能（また `NEW` または `PAID` からは `CANCELED` へ遷移可能）とします。
初期状態 `NEW` から `Q` 回の遷移先ステータスが与えられます。
正当な遷移なら状態を進めて `OK`、不正な遷移なら状態を変えず `INVALID` と出力し、最終ステータスを最後に出力してください。',
  'hard', 25, ARRAY['状態遷移', '業務ロジック'],
  'import java.util.Scanner;

public class Main {
    public static boolean canTransition(String current, String next) {
        // 遷移可能かどうかを判定してください
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int q = sc.nextInt();
        String status = "NEW";
        // Q回の遷移を処理してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static boolean canTransition(String current, String next) {
        if (current.equals("NEW") && (next.equals("PAID") || next.equals("CANCELED"))) return true;
        if (current.equals("PAID") && (next.equals("SHIPPED") || next.equals("CANCELED"))) return true;
        if (current.equals("SHIPPED") && next.equals("DONE")) return true;
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int q = sc.nextInt();
        String status = "NEW";
        for (int i = 0; i < q; i++) {
            String next = sc.next();
            if (canTransition(status, next)) {
                status = next;
                System.out.println("OK");
            } else {
                System.out.println("INVALID");
            }
        }
        System.out.println(status);
    }
}', '状態遷移ルールを専用メソッドに閉じ込めることで、発送済み注文のキャンセルなどの業務事故をコードレベルで防止できます。',
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
  '44444444-4444-4444-8444-444444442407', '3f313153-e5f5-466a-b5f2-51a43cefbf1d', '上級 2-5. 備品貸出トランザクション模擬（承認で在庫減・返却で在庫増）', '## 問題文
総在庫 `total` の備品（初期利用可能数 `available = total`）に対し、`Q` 件の操作を処理してください。
- `APPROVE qty`：`available >= qty` なら減算して `APPROVED`、不足なら変更せず `DENIED`
- `RETURN qty`：`available + qty <= total` なら加算して `RETURNED`、上限超過なら変更せず `INVALID`
最後に現在の利用可能在庫数を出力してください。',
  'medium', 20, ARRAY['トランザクション', '在庫整合性', 'チーム開発準備'],
  'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int total = sc.nextInt();
        int q = sc.nextInt();
        // APPROVE / RETURN を処理し、最終在庫を出力してください
    }
}', 'import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int total = sc.nextInt();
        int available = total;
        int q = sc.nextInt();
        for (int i = 0; i < q; i++) {
            String cmd = sc.next();
            int qty = sc.nextInt();
            if (cmd.equals("APPROVE")) {
                if (available >= qty) {
                    available -= qty;
                    System.out.println("APPROVED");
                } else {
                    System.out.println("DENIED");
                }
            } else if (cmd.equals("RETURN")) {
                if (available + qty <= total) {
                    available += qty;
                    System.out.println("RETURNED");
                } else {
                    System.out.println("INVALID");
                }
            }
        }
        System.out.println(available);
    }
}', 'チーム開発（メンバーC：備品貸出システム）のコア不変条件 `0 <= available <= total` を守る設計です。',
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
  '44444444-4444-4444-8444-444444442408', '3f313153-e5f5-466a-b5f2-51a43cefbf1d', '上級 2-6. 案件進捗率の自動集計サービス（完了タスク÷全タスク×100）', '## 問題文
`N` 件のタスク（`案件名 ステータス`、ステータスは `TODO` / `IN_PROGRESS` / `DONE`）が与えられます。
案件の初出順に `<案件名>: <進捗率>% (<完了数>/<総数>)` を出力してください（進捗率は整数切り捨て：`done * 100 / total`）。',
  'hard', 25, ARRAY['HashMap', '業務集計', 'チーム開発準備'],
  'import java.util.ArrayList;
import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // 案件ごとの完了数・総数から進捗率を算出して出力してください
    }
}', 'import java.util.ArrayList;
import java.util.HashMap;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        ArrayList<String> projects = new ArrayList<>();
        HashMap<String, Integer> totalMap = new HashMap<>();
        HashMap<String, Integer> doneMap = new HashMap<>();
        for (int i = 0; i < n; i++) {
            String proj = sc.next();
            String st = sc.next();
            if (!totalMap.containsKey(proj)) {
                projects.add(proj);
                totalMap.put(proj, 0);
                doneMap.put(proj, 0);
            }
            totalMap.put(proj, totalMap.get(proj) + 1);
            if (st.equals("DONE")) {
                doneMap.put(proj, doneMap.get(proj) + 1);
            }
        }
        for (int i = 0; i < projects.size(); i++) {
            String p = projects.get(i);
            int t = totalMap.get(p);
            int d = doneMap.get(p);
            int pct = d * 100 / t;
            System.out.println(p + ": " + pct + "% (" + d + "/" + t + ")");
        }
    }
}', 'チーム開発（メンバーB：案件・タスク管理）の案件一覧進捗率計算と同じロジックです。',
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
  '44444444-4444-4444-8444-444444442409', '3f313153-e5f5-466a-b5f2-51a43cefbf1d', '上級 2-7. 配送料金ロジックの境界値テスト検証', '## 問題文
以下の配送料金ルールを `calcShipping(int weightKg, int subtotal)` メソッドとして実装してください：
- `subtotal >= 10000`：送料無料（`0`円）
- それ以外で `weightKg <= 2`：`500`円
- それ以外で `weightKg <= 10`：`800`円
- `weightKg > 10`：`1500`円

`N` 件のテストケース（`weightKg subtotal`）について算出した配送料を1行ずつ出力してください。',
  'medium', 15, ARRAY['境界値テスト', '単体テスト', '業務ルール'],
  'import java.util.Scanner;

public class Main {
    public static int calcShipping(int weightKg, int subtotal) {
        // 境界値を正確に判定してください
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            System.out.println(calcShipping(sc.nextInt(), sc.nextInt()));
        }
    }
}', 'import java.util.Scanner;

public class Main {
    public static int calcShipping(int weightKg, int subtotal) {
        if (subtotal >= 10000) return 0;
        if (weightKg <= 2) return 500;
        if (weightKg <= 10) return 800;
        return 1500;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            System.out.println(calcShipping(sc.nextInt(), sc.nextInt()));
        }
    }
}', '境界値（9999 vs 10000、2 vs 3、10 vs 11）を優先度の高い条件から早期リターンで判定するとバグが混入しにくくなります。',
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
  '44444444-4444-4444-8444-444444442410', '3f313153-e5f5-466a-b5f2-51a43cefbf1d', '上級 2-8. 【Java 4か月総仕上げ】商品管理ミニシステム（登録・検索・在庫警告）', '## 問題文
Java 4か月カリキュラム（全80問）の総仕上げです！後半のSpring Boot商品管理システムのコア処理をJavaで実装しましょう。
`Q` 件のコマンドを処理してください：
- `ADD sku name price stock`：商品を登録（SKU重複時は `DUP`、成功時は `OK`）
- `SEARCH keyword`：商品名に `keyword` を含む商品を登録順で出力（在庫が10未満なら末尾に ` [LOW]` を付ける。形式：`sku name price stock`。0件なら `NONE`）',
  'hard', 30, ARRAY['総仕上げ', '商品管理', 'Spring Boot準備'],
  'import java.util.ArrayList;
import java.util.Scanner;

class Item {
    String sku, name;
    int price, stock;
    Item(String sku, String name, int price, int stock) {
        this.sku = sku;
        this.name = name;
        this.price = price;
        this.stock = stock;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int q = sc.nextInt();
        // ADD と SEARCH コマンドを実装してください
    }
}', 'import java.util.ArrayList;
import java.util.Scanner;

class Item {
    String sku, name;
    int price, stock;
    Item(String sku, String name, int price, int stock) {
        this.sku = sku;
        this.name = name;
        this.price = price;
        this.stock = stock;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int q = sc.nextInt();
        ArrayList<Item> items = new ArrayList<>();
        for (int i = 0; i < q; i++) {
            String cmd = sc.next();
            if (cmd.equals("ADD")) {
                String sku = sc.next();
                String name = sc.next();
                int price = sc.nextInt();
                int stock = sc.nextInt();
                boolean dup = false;
                for (int j = 0; j < items.size(); j++) {
                    if (items.get(j).sku.equals(sku)) {
                        dup = true;
                        break;
                    }
                }
                if (dup) {
                    System.out.println("DUP");
                } else {
                    items.add(new Item(sku, name, price, stock));
                    System.out.println("OK");
                }
            } else if (cmd.equals("SEARCH")) {
                String kw = sc.next();
                int found = 0;
                for (int j = 0; j < items.size(); j++) {
                    Item it = items.get(j);
                    if (it.name.contains(kw)) {
                        String warn = it.stock < 10 ? " [LOW]" : "";
                        System.out.println(it.sku + " " + it.name + " " + it.price + " " + it.stock + warn);
                        found++;
                    }
                }
                if (found == 0) {
                    System.out.println("NONE");
                }
            }
        }
    }
}', 'Java 4か月（全80問）の完走おめでとうございます！ここで身につけた設計力と実装力で、次のSQL・Git・Spring Boot商品管理システム開発へ自信を持って進みましょう。',
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
  '44444444-4444-4444-8444-444444441401', '33333333-3333-4333-8333-333333331401', 'Step 1：ツール導入（Eclipse / PostgreSQL / GitHub）＆設計書・モックアップ確認', '### 🎯 この単元でやること（ゴール）
Java 21のEclipse、PostgreSQL 16（DB `product_mgmt_db`）、GitHubリポジトリを準備し、配布Excel設計書と画面モックアップの全体像をつかみます。

### 💡 なぜこの単元が必要か
実務ではいきなりコードを書かず、最初に開発環境を揃え、設計書から「どんな画面・テーブルを作るか」を把握してから着手します。

### 📖 見るべき設計書・モックアップ
右のボタンから2つのExcelをダウンロードし、詳細設計書 `00_表紙・読み方`〜`02_機能要件` と、画面設計モックアップの全シートをざっと眺めてください。

```mermaid
flowchart LR
  Dev["Eclipse (Java 21)"] --> App["Spring Boot 3.3"]
  App <--> DB[("PostgreSQL 16\nproduct_mgmt_db")]
  App --> View["Thymeleaf HTML/CSS"]
  Dev -->|PR提出| GH["GitHub"]
```

### 🛠️ 最初に作るファイルと書く順番
1. Eclipse（Pleiades All in One Java 21）をインストールし、ワークスペース文字コードを **UTF-8** に設定する
2. PostgreSQL 16 をインストールし、pgAdmin 4 でデータベース `product_mgmt_db`（UTF-8）を作成する
3. GitHubで `product-manager` リポジトリを作成（`Add a README file` にチェック）し、ローカルへ `git clone` する
4. リポジトリ直下に `.gitignore`（`target/` や `.env` を除外）を作成する

### ✅ 動作確認のしかた（成功のサイン）
- pgAdmin 4 で `product_mgmt_db` が表示されている
- ターミナルで `git status` がエラーなく動く
- 詳細設計書（全13シート）とモックアップ（全8シート）を開いて確認できた

### ⚠️ よくあるエラーと対処法
- WindowsでEclipseを深いフォルダに解凍するとパス長エラーになります → `C:\pleiades` など短い英数字パスへ配置しましょう。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/step01-setup
git add . && git commit -m "feat: Step 1 完了"
git push -u origin feature/step01-setup
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'easy', 60, ARRAY['Spring Boot', '環境構築', 'PostgreSQL', 'GitHub'],
  '{"stepNumber":1,"recommendedBranch":"feature/step01-setup","designDocPath":"/docs/product-management-design-spec.xlsx","designDocLabel":"商品管理システム 開発者向け詳細設計書 v1.1.0（全13シート）","checklist":["Eclipse（Java 21）を導入し文字コードをUTF-8に設定した","PostgreSQL 16 で `product_mgmt_db` を作成した","詳細設計書（全13シート）と画面モックアップ（全8シート）を確認した","`feature/step01-setup` ブランチから最初のPull Requestを作成した"],"mockupDocPath":"/docs/product-management-mockup.xlsx","mockupDocLabel":"商品管理システム 画面設計モックアップ（Excel・全8シート）"}', '{"githubUrl":"https://github.com/sample-student/product-manager/pull/1","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/step01-setup）で実装・動作確認を完了し、Pull Requestを作成しました。"}', '環境構築と設計書の読み込みが終われば、あとは1ステップずつ小さく作って動かすだけです！',
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
  '44444444-4444-4444-8444-444444441402', '33333333-3333-4333-8333-333333331401', 'Step 2：Spring Initializr（Maven）雛形作成 ＆ PostgreSQL接続疎通確認', '### 🎯 この単元でやること（ゴール）
Spring Boot 3.3（Maven / Java 21）のプロジェクト雛形を作り、PostgreSQLへエラーなく起動接続できる状態にします。

### 💡 なぜこの単元が必要か
コードを書く前に「Spring BootとPostgreSQLが確実に繋がっている」状態を作っておくと、後でエラーが出たときに原因を切り分けやすくなります。

### 📖 見るべき設計書・モックアップ
詳細設計書 `01_システム概要・環境`（§2 技術スタック / §3 pom.xml / §6 application.properties）

### 🛠️ 最初に作るファイルと書く順番
1. Spring Initializr（start.spring.io または Eclipse新規）で **Maven / Java 21 / Jar** を選択する
2. 依存関係に `Spring Web`, `Thymeleaf`, `Spring Data JPA`, `Validation`, `PostgreSQL Driver`, `Spring Boot DevTools` を追加（※Spring SecurityはStep 13で追加）
3. `src/main/resources/application.properties` にPostgreSQL接続設定を書く
4. Eclipseから `ProductApplication.java` を「Spring Boot アプリケーション」として起動する

### 🧩 最初の一歩（src/main/resources/application.properties）
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/product_mgmt_db
spring.datasource.username=${DB_USER:postgres}
spring.datasource.password=${DB_PASSWORD:postgres}
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.open-in-view=false
spring.jpa.show-sql=true
spring.thymeleaf.cache=false
```

### ✅ 動作確認のしかた（成功のサイン）
- Eclipseコンソールに `Started ProductApplication in X.XXX seconds` と表示される
- 起動直後に赤い `Exception` や `Connection refused` が出ていない

### ⚠️ よくあるエラーと対処法
- `Connection refused` が出る → PostgreSQLサービスが起動しているか、ポート `5432` とパスワードが合っているか確認しましょう。
- Maven依存が反映されない → プロジェクト右クリック →「Maven → プロジェクトの更新（Alt+F5）」を実行します。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/step02-spring-db
git add . && git commit -m "feat: Step 2 完了"
git push -u origin feature/step02-spring-db
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'easy', 60, ARRAY['Spring Boot', 'Maven', 'PostgreSQL'],
  '{"stepNumber":2,"recommendedBranch":"feature/step02-spring-db","designDocPath":"/docs/product-management-design-spec.xlsx","designDocLabel":"商品管理システム 詳細設計書 v1.1.0（01_システム概要・環境）","checklist":["Maven / Java 21 のSpring Bootプロジェクトを作成した","`application.properties` に `product_mgmt_db` への接続設定を記述した","起動ログに `Started ProductApplication` がエラーなく出た","`feature/step02-spring-db` ブランチをPushしてPRを作成した"],"mockupDocPath":"/docs/product-management-mockup.xlsx","mockupDocLabel":"商品管理システム 画面設計モックアップ（Excel・全8シート）"}', '{"githubUrl":"https://github.com/sample-student/product-manager/pull/2","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/step02-spring-db）で実装・動作確認を完了し、Pull Requestを作成しました。"}', 'Spring BootとPostgreSQLの疎通確認が完了しました。次はいよいよブラウザに最初の1画面を表示します！',
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
  '44444444-4444-4444-8444-444444441403', '33333333-3333-4333-8333-333333331401', 'Step 3：はじめての Controller ＋ Thymeleaf で「最初の1画面」を表示する', '### 🎯 この単元でやること（ゴール）
Spring BootのMVCの最小単位である「Controller（受付）→ Thymeleaf（HTML画面）」を自分で書き、`http://localhost:8080/products` に仮画面を表示します。

### 💡 なぜこの単元が必要か
いきなりDBと繋ぐ前に「URLにアクセスしたらControllerのメソッドが呼ばれ、HTMLが返る」仕組みを体で理解すると、この先の学習が圧倒的に楽になります。

### 📖 見るべき設計書・モックアップ
詳細設計書 `04_URL・IF設計`（URL一覧）

### 🛠️ 最初に作るファイルと書く順番
1. `src/main/java/com/example/product/controller/AuthController.java` を作り、`GET /` を `/products` へリダイレクトさせる
2. `src/main/java/com/example/product/controller/ProductController.java` を作り、`@GetMapping("/products")` で `"products/list"` を返す
3. `src/main/resources/templates/products/list.html` を作り、`<h1>商品一覧（作成中）</h1>` と表示させる

### 🧩 最初の一歩（最初に書く ProductController.java（最小版））
```java
@Controller
@RequestMapping("/products")
public class ProductController {
    @GetMapping
    public String list(Model model) {
        model.addAttribute("pageTitle", "商品一覧");
        return "products/list"; // templates/products/list.html を表示！
    }
}
```

### ✅ 動作確認のしかた（成功のサイン）
- ブラウザで `http://localhost:8080/` を開くと自動で `/products` に移動する
- 画面に `商品一覧` と日本語が文字化けせず表示される

### ⚠️ よくあるエラーと対処法
- `Whitelabel Error Page (404)` が出る → `@Controller` の付け忘れ、または `templates/products/list.html` のフォルダ名スペルミスを確認しましょう。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/step03-first-page
git add . && git commit -m "feat: Step 3 完了"
git push -u origin feature/step03-first-page
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'easy', 60, ARRAY['Spring Boot', 'Controller', 'Thymeleaf'],
  '{"stepNumber":3,"recommendedBranch":"feature/step03-first-page","designDocPath":"/docs/product-management-design-spec.xlsx","designDocLabel":"商品管理システム 詳細設計書 v1.1.0（03_画面設計・04_URL・IF設計）","checklist":["`AuthController` で `GET /` → `redirect:/products` を実装した","`ProductController` で `GET /products` を受け取り `products/list` を返した","ブラウザで `http://localhost:8080/products` にHTMLが表示された","`feature/step03-first-page` ブランチからPRを作成した"],"mockupDocPath":"/docs/product-management-mockup.xlsx","mockupDocLabel":"商品管理システム 画面設計モックアップ（Excel・全8シート）"}', '{"githubUrl":"https://github.com/sample-student/product-manager/pull/3","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/step03-first-page）で実装・動作確認を完了し、Pull Requestを作成しました。"}', '`@Controller` がURLを受け取り、戻り値の文字列に対応する `templates/*.html` を返すのがSpring MVCの基本です。',
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
  '44444444-4444-4444-8444-444444441404', '33333333-3333-4333-8333-333333331401', 'Step 4：共通ヘッダー（layout.html）＆ 共通CSS（style.css）の土台作成', '### 🎯 この単元でやること（ゴール）
全画面で使い回す共通ヘッダー（`templates/fragments/layout.html`）と共通スタイルシート（`static/css/style.css`）を作成し、一覧画面から読み込みます。

### 💡 なぜこの単元が必要か
先に共通デザインとフラッシュメッセージ・赤バッジ・エラー文字のCSSクラスを用意しておくと、以降の画面作成で見た目に迷わずロジックに集中できます。

### 📖 見るべき設計書・モックアップ
詳細設計書 `03_画面設計 §2` ＋ 画面モックアップ（共通ヘッダー・色使い）

### 🛠️ 最初に作るファイルと書く順番
1. `src/main/resources/templates/fragments/layout.html` を作り、`th:fragment="header"` でシステム名とヘッダー枠を定義する
2. `src/main/resources/static/css/style.css` を作り、`.badge-low`（赤バッジ）・`.flash-success`・`.error`・`.data-table` の基本CSSを書く
3. `templates/products/list.html` から `<link rel="stylesheet" th:href="@{/css/style.css}">` と `th:replace="~{fragments/layout :: header}"` を読み込む

### 🧩 最初の一歩（templates/fragments/layout.html の書き出し）
```html
<header th:fragment="header" class="app-header">
  <a th:href="@{/products}" class="brand">商品管理システム</a>
  <!-- Step 13でここにログイン者氏名とログアウトボタンを追加します -->
</header>
```

### ✅ 動作確認のしかた（成功のサイン）
- `http://localhost:8080/products` に共通ヘッダーとCSSスタイルが適用されて表示される
- ブラウザ開発者ツール（F12 → Network）で `style.css` が `200 OK` で読み込まれている

### ⚠️ よくあるエラーと対処法
- CSSが効かない → `static/css/style.css` の置き場所を確認し、`href="/css/style.css"` ではなく `th:href="@{/css/style.css}"` を使いましょう。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/step04-layout-css
git add . && git commit -m "feat: Step 4 完了"
git push -u origin feature/step04-layout-css
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'easy', 60, ARRAY['Thymeleaf', 'CSS', '共通部品'],
  '{"stepNumber":4,"recommendedBranch":"feature/step04-layout-css","designDocPath":"/docs/product-management-design-spec.xlsx","designDocLabel":"商品管理システム 詳細設計書 v1.1.0（03_画面設計 §2 共通部品）","checklist":["`templates/fragments/layout.html` に `th:fragment=\"header\"` を作成した","`static/css/style.css` にテーブル・バッジ・フラッシュ・エラー用のスタイルを作成した","`products/list.html` に共通ヘッダーとCSSが反映された","`feature/step04-layout-css` ブランチからPRを作成した"],"mockupDocPath":"/docs/product-management-mockup.xlsx","mockupDocLabel":"商品管理システム 画面設計モックアップ（Excel・全8シート）"}', '{"githubUrl":"https://github.com/sample-student/product-manager/pull/4","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/step04-layout-css）で実装・動作確認を完了し、Pull Requestを作成しました。"}', 'Thymeleafの `th:fragment` / `th:replace` を使うことで、ヘッダーを修正したいときも1ファイル直すだけで全画面へ反映できます。',
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
  '44444444-4444-4444-8444-444444441405', '33333333-3333-4333-8333-333333331402', 'Step 5：PostgreSQL 3テーブルDDL作成（users / categories / products）＆初期データ投入', '### 🎯 この単元でやること（ゴール）
詳細設計書 `06_DB設計` を読みながら、PostgreSQLに3つのテーブル（`users`, `categories`, `products`）を作成し、初期カテゴリ3件・初期商品5件を投入します。

### 💡 なぜこの単元が必要か
実務では「設計書のテーブル定義を見て自分でSQL(DDL)を書き、制約（PRIMARY KEY / UNIQUE / FOREIGN KEY / CHECK）をDB側にも張る」ことがデータ品質の要です。

### 📖 見るべき設計書・モックアップ
詳細設計書 `06_DB設計`（§1 ER図〜§6 初期データ）

```mermaid
erDiagram
  categories ||--o{ products : "1対多 (category_id)"
  categories { bigint id PK
 varchar name UK
 int sort_order }
  products { bigint id PK
 varchar sku UK
 varchar name
 bigint category_id FK
 int price
 int stock
 boolean is_deleted }
  users { bigint id PK
 varchar email UK
 varchar password_hash
 varchar role }
```

### 🛠️ 最初に作るファイルと書く順番
1. プロジェクト内に `sql/schema.sql` を作り、外部キーの依存順（①`users` → ②`categories` → ③`products`）で `CREATE TABLE` 文を書く
2. `sql/data.sql` を作り、カテゴリ3件（PC・周辺機器 / 書籍 / オフィス用品）とサンプル商品5件（在庫10未満を含む）の `INSERT` 文を書く
3. pgAdmin 4 のクエリツールで `schema.sql` → `data.sql` の順に実行する

### 🧩 最初の一歩（sql/schema.sql の書き出し例）
```sql
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    sort_order INTEGER NOT NULL DEFAULT 0
);
-- 続けて users と products（price >= 0, stock >= 0, is_deleted DEFAULT FALSE）を作成
```

### ✅ 動作確認のしかた（成功のサイン）
- pgAdmin 4 で `SELECT * FROM categories;` が3件、`SELECT * FROM products;` が5件返る
- `price = -1` を試しにINSERTすると `CHECK` 制約エラーで弾かれることを確認する

### ⚠️ よくあるエラーと対処法
- `products` を `categories` より先に作ろうとすると外部キーエラーになります → 親テーブル（`categories`）を先に作りましょう。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/step05-db-ddl
git add . && git commit -m "feat: Step 5 完了"
git push -u origin feature/step05-db-ddl
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'medium', 90, ARRAY['PostgreSQL', 'SQL', 'DDL'],
  '{"stepNumber":5,"recommendedBranch":"feature/step05-db-ddl","designDocPath":"/docs/product-management-design-spec.xlsx","designDocLabel":"商品管理システム 詳細設計書 v1.1.0（06_DB設計）","checklist":["`sql/schema.sql` で `users`・`categories`・`products` の3テーブルと制約を作成した","`sql/data.sql` で初期カテゴリ3件・初期商品5件を投入した","pgAdmin 4 で `SELECT` してデータが入っていることを確認した","`feature/step05-db-ddl` ブランチからPRを作成した"],"mockupDocPath":"/docs/product-management-mockup.xlsx","mockupDocLabel":"商品管理システム 画面設計モックアップ（Excel・全8シート）"}', '{"githubUrl":"https://github.com/sample-student/product-manager/pull/5","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/step05-db-ddl）で実装・動作確認を完了し、Pull Requestを作成しました。"}', 'DB側にも `UNIQUE` や `CHECK (price >= 0)` を張っておくことで、万一プログラムにバグがあっても不正データを防ぐ二重防御になります。',
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
  '44444444-4444-4444-8444-444444441406', '33333333-3333-4333-8333-333333331402', 'Step 6：Entity 3クラス＆Repository作成 → `ddl-auto=validate` 起動整合を突破する', '### 🎯 この単元でやること（ゴール）
PostgreSQLの3テーブルに対応するJavaの `Entity` 3クラスと `Repository` 3インターフェースを作成し、`spring.jpa.hibernate.ddl-auto=validate` でエラーなく起動させます。

### 💡 なぜこの単元が必要か
EntityとDBテーブルの列名・型が1文字でもズレていると後々謎のバグになります。`validate` モードで起動成功させることが「DBとJavaが完全に噛み合った」証明です。

### 📖 見るべき設計書・モックアップ
詳細設計書 `05_クラス設計`（§3 Repository / §4 Entity）＋ `06_DB設計`

### 🛠️ 最初に作るファイルと書く順番
1. `entity/Category.java`, `entity/Product.java`, `entity/User.java` を作成する（Entityには `@Data` を付けず `@Getter` `@Setter` を個別に付与）
2. `Product.java` の論理削除フラグはDB列 `is_deleted` に `@Column(name = "is_deleted") private boolean deleted = false;` とマッピングする（D-05）
3. `repository/CategoryRepository.java`, `ProductRepository.java`, `UserRepository.java`（`JpaRepository` 継承）を作成する
4. Spring Bootを起動して `validate` チェックを通す

### 🧩 最初の一歩（entity/Product.java の重要ポイント）
```java
@Entity
@Table(name = "products")
@Getter @Setter
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    @Column(name = "is_deleted", nullable = false)
    private boolean deleted = false;
}
```

### ✅ 動作確認のしかた（成功のサイン）
- Eclipseから起動し、`Schema-validation` エラーが出ずに `Started ProductApplication` が表示される

### ⚠️ よくあるエラーと対処法
- `Schema-validation: missing column [is_deleted]` 等が出たら、`@Column(name = "...")` とPostgreSQLの列名を1文字ずつ見比べましょう。
- Java側フィールド名を `isDeleted` にするとLombokやJPAと衝突しやすいので、必ず `deleted` にしてください。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/step06-entity-repo
git add . && git commit -m "feat: Step 6 完了"
git push -u origin feature/step06-entity-repo
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'medium', 90, ARRAY['Spring Data JPA', 'Entity', 'Repository'],
  '{"stepNumber":6,"recommendedBranch":"feature/step06-entity-repo","designDocPath":"/docs/product-management-design-spec.xlsx","designDocLabel":"商品管理システム 詳細設計書 v1.1.0（05_クラス設計・06_DB設計）","checklist":["`Category`, `Product`, `User` の3 Entity を作成した（`Product` の論理削除は `deleted`）","3つの `JpaRepository` インターフェースを作成した","`ddl-auto=validate` のままエラーなく起動できた","`feature/step06-entity-repo` ブランチからPRを作成した"],"mockupDocPath":"/docs/product-management-mockup.xlsx","mockupDocLabel":"商品管理システム 画面設計モックアップ（Excel・全8シート）"}', '{"githubUrl":"https://github.com/sample-student/product-manager/pull/6","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/step06-entity-repo）で実装・動作確認を完了し、Pull Requestを作成しました。"}', '`ddl-auto=validate` を突破できれば、DBとJavaクラスの土台は完璧です！',
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
  '44444444-4444-4444-8444-444444441407', '33333333-3333-4333-8333-333333331402', 'Step 7：商品一覧表示（GET /products）＆在庫少バッジ（10未満赤バッジ）実装', '### 🎯 この単元でやること（ゴール）
PostgreSQLに入れたサンプル商品5件を `Controller → Service → Repository` の3層経由で取得し、一覧テーブルと「在庫10未満の赤バッジ」を表示します。

### 💡 なぜこの単元が必要か
ここで初めてDBのデータがブラウザ画面に届きます！10未満のしきい値は定数クラス（`ProductConstants`）に置く実務作法も身につけます。

### 📖 見るべき設計書・モックアップ
詳細設計書 `03_画面設計`（SCR-02）＋ `05_クラス設計` ＋ モックアップ（商品一覧シート）

### 🛠️ 最初に作るファイルと書く順番
1. `constant/ProductConstants.java` を作り `public static final int LOW_STOCK_THRESHOLD = 10;` を定義する
2. `ProductRepository` に `JOIN FETCH p.category` 付きの未削除全件取得クエリ（ID昇順）を書く
3. `service/ProductService.java` と `service/CategoryService.java` を作成する（`@Transactional(readOnly = true)`）
4. `ProductController#list` で `products` を `Model` に詰め、`templates/products/list.html` に `th:each` でテーブル描画する

### 🧩 最初の一歩（templates/products/list.html の在庫少バッジ部分）
```html
<tr th:each="p : ${products}">
  <td th:text="${p.sku}"></td>
  <td th:text="${p.name}"></td>
  <td th:text="${p.category.name}"></td>
  <td th:text="${#numbers.formatInteger(p.price, 1, ''COMMA'') + ''円''}"></td>
  <td>
    <span th:text="${p.stock}"></span>
    <span th:if="${p.stock < lowStockThreshold}" class="badge-low">在庫少</span>
  </td>
</tr>
```

### ✅ 動作確認のしかた（成功のサイン）
- `http://localhost:8080/products` に初期商品5件がカテゴリ名・3桁カンマ単価付きで表示される
- 在庫8の「メカニカルキーボード」と在庫3の「USB-Cハブ」にだけ赤色の「在庫少」バッジが出る

### ⚠️ よくあるエラーと対処法
- `LazyInitializationException` が出た → `ProductRepository` のJPQLに `JOIN FETCH p.category` を入れ忘れています。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/step07-product-list
git add . && git commit -m "feat: Step 7 完了"
git push -u origin feature/step07-product-list
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'medium', 90, ARRAY['Spring Boot', 'Thymeleaf', 'Service', '一覧表示'],
  '{"stepNumber":7,"recommendedBranch":"feature/step07-product-list","designDocPath":"/docs/product-management-design-spec.xlsx","designDocLabel":"商品管理システム 詳細設計書 v1.1.0（03_画面設計・05_クラス設計）","checklist":["`ProductConstants.LOW_STOCK_THRESHOLD = 10` を定義した","Controller → Service → Repository 経由で未削除商品一覧を取得できた","単価の3桁区切り＋「円」表示と、在庫10未満の赤バッジが表示された","`feature/step07-product-list` ブランチからPRを作成した"],"mockupDocPath":"/docs/product-management-mockup.xlsx","mockupDocLabel":"商品管理システム 画面設計モックアップ（Excel・全8シート）"}', '{"githubUrl":"https://github.com/sample-student/product-manager/pull/7","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/step07-product-list）で実装・動作確認を完了し、Pull Requestを作成しました。"}', 'これでDBから画面までの1本の道（Read）が開通しました！次は検索と詳細画面を追加します。',
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
  '44444444-4444-4444-8444-444444441408', '33333333-3333-4333-8333-333333331402', 'Step 8：複合検索（商品名＋カテゴリ＋LIKEエスケープ）＆ 商品詳細画面（GET /products/{id}）', '### 🎯 この単元でやること（ゴール）
商品名（部分一致・大小無視）とカテゴリのAND検索（条件保持・クリア付き）と、商品名クリックで開く商品詳細画面（`/products/{id}`）を実装します。

### 💡 なぜこの単元が必要か
実務の一覧画面では複合検索＋条件保持が必須です。また `%` や `_` のLIKEエスケープを学ぶことでSQLの罠を防げるようになります。

### 📖 見るべき設計書・モックアップ
詳細設計書 `03_画面設計`（SCR-02/03）・`07_処理詳細`（P-02）＋ モックアップ（商品詳細シート）

### 🛠️ 最初に作るファイルと書く順番
1. `ProductService#search(keyword, categoryId)` で `null`→`""`・`trim()`・`\`/`%`/`_` エスケープを実装する
2. `ProductRepository` に `searchActive(escapedKeyword, categoryId)` と `findActiveById(id)`（`JOIN FETCH`付き）を実装する
3. `exception/ProductNotFoundException.java` を作り、`ProductService#findById` で未存在・削除済み時に投げる
4. `ProductController#detail` と `templates/products/detail.html` を作り、一覧の商品名にリンクを張る

### 🧩 最初の一歩（ProductService#search のエスケープ処理）
```java
String normalized = (keyword == null) ? "" : keyword.trim();
String escaped = normalized
    .replace("\\", "\\\\")
    .replace("%", "\\%")
    .replace("_", "\\_");
return productRepository.searchActive(escaped, categoryId);
```

### ✅ 動作確認のしかた（成功のサイン）
- 「マウス」＋カテゴリ「PC・周辺機器」で検索し、該当商品だけが表示されフォームに検索条件が残る
- 「クリア」リンクで全件に戻る。`%` だけ検索して全件ヒットしないこと（0件になること）を確認する
- 商品名クリックで `/products/1` が開き、SKU・単価・在庫・説明・登録/更新日時が表示される

### ⚠️ よくあるエラーと対処法
- PostgreSQLで `keyword` に `null` を渡すと型推論エラーになることがあります → Serviceで必ず `""` へ正規化してからRepositoryへ渡しましょう。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/step08-search-detail
git add . && git commit -m "feat: Step 8 完了"
git push -u origin feature/step08-search-detail
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'medium', 120, ARRAY['Spring Boot', 'JPQL', '複合検索', '詳細画面'],
  '{"stepNumber":8,"recommendedBranch":"feature/step08-search-detail","designDocPath":"/docs/product-management-design-spec.xlsx","designDocLabel":"商品管理システム 詳細設計書 v1.1.0（02_機能要件 FN-004/005・07_処理詳細）","checklist":["商品名（大小無視・部分一致）＋カテゴリの複合検索と検索条件保持が動く","`%` や `_` を検索しても文字通りに検索される（LIKEエスケープ）","商品詳細画面（`/products/{id}`）に全項目が表示される","`feature/step08-search-detail` ブランチからPRを作成した"],"mockupDocPath":"/docs/product-management-mockup.xlsx","mockupDocLabel":"商品管理システム 画面設計モックアップ（Excel・全8シート）"}', '{"githubUrl":"https://github.com/sample-student/product-manager/pull/8","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/step08-search-detail）で実装・動作確認を完了し、Pull Requestを作成しました。"}', 'これで「見る機能（一覧・検索・詳細）」がすべて完成しました！次の章からデータを書き換える機能（Create/Update/Delete）へ進みます。',
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
  '44444444-4444-4444-8444-444444441409', '33333333-3333-4333-8333-333333331403', 'Step 9：商品新規登録（GET /products/new → POST /products）＆ PRGパターン実装', '### 🎯 この単元でやること（ゴール）
新規登録画面（`form.html`）から商品を1件DBへ保存し、`redirect:/products`（PRGパターン）で一覧へ戻して緑の完了フラッシュメッセージを出します。

### 💡 なぜこの単元が必要か
まずはバリデーションを乗せる前に「フォーム入力 → POST → DBへINSERT → リダイレクト」という登録の基本パイプラインを確実に動かします。

### 📖 見るべき設計書・モックアップ
詳細設計書 `03_画面設計`（SCR-04）・`04_URL・IF設計`（No.7, 8）＋ モックアップ（商品登録シート）

### 🛠️ 最初に作るファイルと書く順番
1. `form/ProductForm.java` を作成する（Entityと分離した入力受け取り専用クラス）
2. `ProductService#create(ProductForm)` を実装する（`@Transactional` で `Product` へ詰替えて `save`）
3. `ProductController` に `GET /products/new` と `POST /products` を追加し、`RedirectAttributes` で完了メッセージを積んで `redirect:/products` を返す
4. `templates/products/form.html` を作成し、一覧画面に「＋ 新規登録」ボタンを配置する

### 🧩 最初の一歩（PRGパターンの Controller 書き出し）
```java
@PostMapping
public String create(@ModelAttribute ProductForm productForm, RedirectAttributes ra) {
    productService.create(productForm);
    ra.addFlashAttribute("message", "商品を登録しました");
    return "redirect:/products"; // F5更新での二重登録を防ぐ！
}
```

### ✅ 動作確認のしかた（成功のサイン）
- `/products/new` から新商品（例：`PRD-0099`）を登録すると `/products` へ移動し「商品を登録しました」が出る
- 一覧画面でF5（リロード）を押しても、商品が二重登録されない
- pgAdmin 4 で `products` テーブルに新しい行が追加されている

### ⚠️ よくあるエラーと対処法
- カテゴリプルダウンの値が届かない → `<select th:field="*{categoryId}">` の名前が `ProductForm` のフィールド名と一致しているか確認しましょう。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/step09-product-create
git add . && git commit -m "feat: Step 9 完了"
git push -u origin feature/step09-product-create
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'medium', 90, ARRAY['Spring Boot', 'POST', 'PRGパターン', 'Thymeleaf'],
  '{"stepNumber":9,"recommendedBranch":"feature/step09-product-create","designDocPath":"/docs/product-management-design-spec.xlsx","designDocLabel":"商品管理システム 詳細設計書 v1.1.0（03_画面設計 SCR-04・04_URL・IF設計）","checklist":["`ProductForm` と `templates/products/form.html` を作成した","`GET /products/new` → `POST /products` でDBに新規登録できる","PRGパターンでリダイレクトされ、完了フラッシュメッセージが表示される","`feature/step09-product-create` ブランチからPRを作成した"],"mockupDocPath":"/docs/product-management-mockup.xlsx","mockupDocLabel":"商品管理システム 画面設計モックアップ（Excel・全8シート）"}', '{"githubUrl":"https://github.com/sample-student/product-manager/pull/9","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/step09-product-create）で実装・動作確認を完了し、Pull Requestを作成しました。"}', 'Entityを直接フォームに使わず `ProductForm` を挟むことで、次のStep 10のバリデーションがとても綺麗に書けるようになります。',
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
  '44444444-4444-4444-8444-444444441410', '33333333-3333-4333-8333-333333331403', 'Step 10：形式バリデーション（@Valid・messages.properties）＆入力エラー再表示', '### 🎯 この単元でやること（ゴール）
`ProductForm` に全入力チェック（必須・SKU形式・文字数・単価0〜1000万・在庫0〜999,999）を実装し、NG時に「入力値を消さず・各欄の下に赤字エラー」を出します。

### 💡 なぜこの単元が必要か
画面入力のチェックを省くと、不正な値でDBエラー（500画面）になってしまいます。Bean ValidationはSpring Boot実務で毎回必ず使う必須技術です。

### 📖 見るべき設計書・モックアップ
詳細設計書 `08_検証・エラー`（全検証ルール・`messages.properties` 文言）

### 🛠️ 最初に作るファイルと書く順番
1. `ProductForm.java` に `@NotBlank`, `@Pattern(regexp = "^[A-Z0-9-]{3,32}$")`, `@Size`, `@NotNull`, `@Min`, `@Max` を付与する
2. `src/main/resources/messages.properties` を作り、日本語エラーメッセージを定義する
3. `ProductController` に `@InitBinder`（前後空白除去＋空文字→null）を追加し、`create` に `@Valid` と `BindingResult` を付ける
4. `form.html` の各入力欄の下に `<p class="error" th:if="${#fields.hasErrors(''...'')}" th:errors="*{...}"></p>` を追加する

### 🧩 最初の一歩（Controller の BindingResult チェック（重要ルール））
```java
// ★BindingResult は必ず @Valid の直後に書くこと！
@PostMapping
public String create(@Valid @ModelAttribute ProductForm productForm,
                     BindingResult bindingResult, RedirectAttributes ra, Model model) {
    if (bindingResult.hasErrors()) {
        model.addAttribute("categories", categoryService.findAllOrdered()); // 再セット必須！
        return "products/form"; // リダイレクトせず直接返す
    }
    ...
```

### ✅ 動作確認のしかた（成功のサイン）
- 空のまま「登録する」を押すと、全必須項目の下に日本語の赤字エラーが表示される
- 小文字SKU（`prd-1`）や単価 `-100` を入れると弾かれ、他の入力欄の値は消えずに保持される
- エラー再表示時もカテゴリプルダウンの選択肢が空にならない

### ⚠️ よくあるエラーと対処法
- エラー再表示時にカテゴリプルダウンが空になる → `if (bindingResult.hasErrors())` の中で `categories` を `Model` に詰め直すのを忘れています！

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/step10-form-validation
git add . && git commit -m "feat: Step 10 完了"
git push -u origin feature/step10-form-validation
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'medium', 90, ARRAY['Bean Validation', 'messages.properties', 'エラー処理'],
  '{"stepNumber":10,"recommendedBranch":"feature/step10-form-validation","designDocPath":"/docs/product-management-design-spec.xlsx","designDocLabel":"商品管理システム 詳細設計書 v1.1.0（08_検証・エラー）","checklist":["`ProductForm` に設計書 `08_検証・エラー` の全アノテーションを設定した","`messages.properties` で日本語エラーメッセージが表示される","`@InitBinder` で前後空白を除去し、エラー時に値とカテゴリ選択肢が保持される","`feature/step10-form-validation` ブランチからPRを作成した"],"mockupDocPath":"/docs/product-management-mockup.xlsx","mockupDocLabel":"商品管理システム 画面設計モックアップ（Excel・全8シート）"}', '{"githubUrl":"https://github.com/sample-student/product-manager/pull/10","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/step10-form-validation）で実装・動作確認を完了し、Pull Requestを作成しました。"}', '形式チェック（`@Valid`）が整いました。次はDBを見ないと判定できない「SKU重複チェック」を実装します。',
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
  '44444444-4444-4444-8444-444444441411', '33333333-3333-4333-8333-333333331403', 'Step 11：業務バリデーション（SKU重複チェック・カテゴリ存在確認・saveAndFlush）', '### 🎯 この単元でやること（ゴール）
`BusinessException` を作成し、Service層で「既存SKU（削除済み含む）との重複」「存在しないカテゴリID」を検知してフォームの該当欄へ赤字エラーを表示します。

### 💡 なぜこの単元が必要か
「形式は正しいがDB上すでに使われているSKU」は `@Valid` では防げません。Service層で業務例外を投げてControllerで `bindingResult.rejectValue` する流れは実務の王道パターンです。

### 📖 見るべき設計書・モックアップ
詳細設計書 `06_DB設計 §7`・`07_処理詳細`・`08_検証・エラー`

### 🛠️ 最初に作るファイルと書く順番
1. `exception/BusinessException.java`（`field` と `messageCode` を持つ `RuntimeException`）を作成する
2. `ProductRepository` に `existsBySku(String sku)` と `existsBySkuAndIdNot(String sku, Long id)` を追加する
3. `ProductService#create` でカテゴリ存在確認→`existsBySku`→`saveAndFlush`（`DataIntegrityViolationException` も重複エラーへ変換）を実装する
4. `ProductController#create` で `BusinessException` を `catch` し、`bindingResult.rejectValue(ex.getField(), ex.getMessageCode())` でフォーム再表示する

### 🧩 最初の一歩（ProductService#create の重複チェック＆競合防御）
```java
if (productRepository.existsBySku(form.getSku())) {
    throw new BusinessException("sku", "product.sku.duplicate");
}
try {
    return productRepository.saveAndFlush(p);
} catch (DataIntegrityViolationException e) {
    throw new BusinessException("sku", "product.sku.duplicate");
}
```

### ✅ 動作確認のしかた（成功のサイン）
- 既存の `PRD-0001` で新規登録すると、SKU欄の下に「このSKUはすでに登録されています」と赤字表示され登録されない
- 存在しないカテゴリIDを送信しても500エラーにならず入力エラーとして扱われる

### ⚠️ よくあるエラーと対処法
- 通常の `save()` だとメソッド終了時までSQLが飛ばず `try-catch` で一意制約違反を捕まえられません → `saveAndFlush()` を使うのがポイントです。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/step11-business-validation
git add . && git commit -m "feat: Step 11 完了"
git push -u origin feature/step11-business-validation
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'medium', 90, ARRAY['業務バリデーション', 'BusinessException', 'トランザクション'],
  '{"stepNumber":11,"recommendedBranch":"feature/step11-business-validation","designDocPath":"/docs/product-management-design-spec.xlsx","designDocLabel":"商品管理システム 詳細設計書 v1.1.0（07_処理詳細・08_検証・エラー）","checklist":["`BusinessException` を作成し、SKU重複・カテゴリ不正を検知できる","`saveAndFlush` で同時登録のDB一意制約違反も業務エラーへ変換している","重複SKUで登録すると500画面にならずSKU欄の下に赤字エラーが出る","`feature/step11-business-validation` ブランチからPRを作成した"],"mockupDocPath":"/docs/product-management-mockup.xlsx","mockupDocLabel":"商品管理システム 画面設計モックアップ（Excel・全8シート）"}', '{"githubUrl":"https://github.com/sample-student/product-manager/pull/11","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/step11-business-validation）で実装・動作確認を完了し、Pull Requestを作成しました。"}', 'これで形式チェック（Form）＋業務チェック（Service）＋DB制約（PostgreSQL）の3重防御が完成しました！',
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
  '44444444-4444-4444-8444-444444441412', '33333333-3333-4333-8333-333333331403', 'Step 12：商品編集（GET /products/{id}/edit → POST /products/{id}）＆ 論理削除実装', '### 🎯 この単元でやること（ゴール）
新規と共通の `form.html` を使って商品編集（自分のSKU維持OK／他商品SKU重複NG）を実装し、確認ダイアログ付きの論理削除（`is_deleted = true`）を完成させます。

### 💡 なぜこの単元が必要か
編集時のSKU重複判定（`existsBySkuAndIdNot`）と、データを消さずに保全する論理削除（`deleted = true`）は業務システムで頻出の重要パターンです。

### 📖 見るべき設計書・モックアップ
詳細設計書 `03_画面設計`（SCR-05）・`07_処理詳細`（編集・論理削除）＋ モックアップ（商品編集シート）

### 🛠️ 最初に作るファイルと書く順番
1. `ProductService` に `findFormById(id)`・`update(id, form)`（`existsBySkuAndIdNot`使用）・`softDelete(id)`（`p.setDeleted(true)`）を追加する
2. `ProductController` に `GET /products/{id}/edit`、`POST /products/{id}`、`POST /products/{id}/delete` を追加する
3. `templates/products/form.html` で `productId != null` のとき見出しを「商品編集」、送信先を `/products/{id}` へ切り替える
4. `list.html` と `detail.html` に編集リンクと `onsubmit="return confirm(...)"` 付きのPOST削除フォームを追加する

### 🧩 最初の一歩（ProductService#softDelete（物理削除は絶対禁止！））
```java
@Transactional
public void softDelete(Long id) {
    Product p = findById(id); // 未存在・削除済みは404例外
    p.setDeleted(true);       // DELETE文は使わずフラグだけtrueに更新！
}
```

### ✅ 動作確認のしかた（成功のサイン）
- 編集画面で既存値が初期表示され、SKUを変えずに商品名だけ変更して更新できる
- 編集画面で他商品のSKU（例：`PRD-0002`）へ変更しようとすると重複エラーになる
- 削除ボタン→キャンセルで何も起きず、OKで一覧から消える。pgAdmin 4 で行が残り `is_deleted = true` になっている

### ⚠️ よくあるエラーと対処法
- 編集で `existsBySku` を使ってしまうと、自分のSKUとぶつかって毎回エラーになります → 編集は必ず `existsBySkuAndIdNot(sku, id)` を使います。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/step12-edit-softdelete
git add . && git commit -m "feat: Step 12 完了"
git push -u origin feature/step12-edit-softdelete
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'hard', 120, ARRAY['Spring Boot', 'CRUD', '編集', '論理削除'],
  '{"stepNumber":12,"recommendedBranch":"feature/step12-edit-softdelete","designDocPath":"/docs/product-management-design-spec.xlsx","designDocLabel":"商品管理システム 詳細設計書 v1.1.0（02_機能要件 FN-007/008・07_処理詳細）","checklist":["商品編集が動作し、自分自身のSKU維持OK・他商品SKU重複NGになっている","更新時に `updated_at` のみ更新され `created_at` が変わらない","論理削除で一覧から非表示になり、DB上は `is_deleted = true` で行が残っている","`feature/step12-edit-softdelete` ブランチからPRを作成した"],"mockupDocPath":"/docs/product-management-mockup.xlsx","mockupDocLabel":"商品管理システム 画面設計モックアップ（Excel・全8シート）"}', '{"githubUrl":"https://github.com/sample-student/product-manager/pull/12","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/step12-edit-softdelete）で実装・動作確認を完了し、Pull Requestを作成しました。"}', 'これで商品管理の全CRUD機能（一覧・検索・詳細・登録・編集・論理削除）がすべて完成しました！',
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
  '44444444-4444-4444-8444-444444441413', '33333333-3333-4333-8333-333333331404', 'Step 13：Spring Security 導入（SecurityConfig・LoginUser・BCrypt初期ユーザー）', '### 🎯 この単元でやること（ゴール）
`spring-boot-starter-security` を導入し、PostgreSQLの `users` テーブル＋`BCryptPasswordEncoder` で認証するバックエンド基盤を構築します。

### 💡 なぜこの単元が必要か
実務の社内システムに認証は必須です。パスワードを平文で保存せずBCryptハッシュ化する仕組みと、`UserDetailsService` の動きを理解します。

### 📖 見るべき設計書・モックアップ
詳細設計書 `09_セキュリティ` ＋ `06_DB設計 §6`（初期ユーザー）

### 🛠️ 最初に作るファイルと書く順番
1. `pom.xml` に `spring-boot-starter-security` と `thymeleaf-extras-springsecurity6` を追加し、Maven更新を実行する
2. `security/LoginUser.java`（`UserDetails` 実装・`fullName` を保持）と `security/CustomUserDetailsService.java`（`findByEmail`）を作成する
3. `config/SecurityConfig.java` を作成し、`/login`・`/error`・`/css/**` 以外の全URLを `authenticated()` にし、`BCryptPasswordEncoder` をBean定義する
4. `config/DataInitializer.java`（`CommandLineRunner`）で初期ユーザー（`admin@example.com` / `user@example.com`）をBCryptハッシュ化して自動投入する

### 🧩 最初の一歩（SecurityConfig.java の要点）
```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/login", "/error", "/css/**", "/js/**", "/images/**").permitAll()
    .anyRequest().authenticated()
)
.formLogin(login -> login
    .loginPage("/login").usernameParameter("email")
    .defaultSuccessUrl("/products", true).failureUrl("/login?error").permitAll()
)
```

### ✅ 動作確認のしかた（成功のサイン）
- 未ログインで `http://localhost:8080/products` にアクセスすると `/login` へ自動リダイレクトされる
- pgAdmin 4 で `SELECT email, password_hash FROM users;` を実行し、`$2a$10$...` 形式のBCryptハッシュが入っている

### ⚠️ よくあるエラーと対処法
- HTMLのメールアドレス欄の `name` と `usernameParameter("email")` がズレていると認証が通りません。両方 `email` に統一しましょう。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/step13-security-core
git add . && git commit -m "feat: Step 13 完了"
git push -u origin feature/step13-security-core
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'hard', 120, ARRAY['Spring Security', 'BCrypt', '認証'],
  '{"stepNumber":13,"recommendedBranch":"feature/step13-security-core","designDocPath":"/docs/product-management-design-spec.xlsx","designDocLabel":"商品管理システム 詳細設計書 v1.1.0（09_セキュリティ・06_DB設計 §6）","checklist":["`pom.xml` にSpring Security依存関係を追加した","`LoginUser`・`CustomUserDetailsService`・`SecurityConfig` を実装した","初期ユーザーがBCryptハッシュで `users` テーブルに保存された","`feature/step13-security-core` ブランチからPRを作成した"],"mockupDocPath":"/docs/product-management-mockup.xlsx","mockupDocLabel":"商品管理システム 画面設計モックアップ（Excel・全8シート）"}', '{"githubUrl":"https://github.com/sample-student/product-manager/pull/13","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/step13-security-core）で実装・動作確認を完了し、Pull Requestを作成しました。"}', '認証バックエンドが完成しました。次は専用のログイン画面・ログアウトボタン・404/500エラー画面を整えます！',
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
  '44444444-4444-4444-8444-444444441414', '33333333-3333-4333-8333-333333331404', 'Step 14：ログイン画面・POSTログアウト・共通エラー画面（GlobalExceptionHandler 404/500）', '### 🎯 この単元でやること（ゴール）
ログイン画面（`login.html`）、ヘッダーのログイン氏名＆POSTログアウトボタン、および404/500用の自作エラー画面（`GlobalExceptionHandler`＋`error.html`）を完成させます。

### 💡 なぜこの単元が必要か
Whitelabel Error Pageやスタックトレースをユーザーに見せないこと、ログアウトをCSRF保護付きPOSTにすることは実務セキュリティの必須要件です。

### 📖 見るべき設計書・モックアップ
詳細設計書 `03_画面設計`（SCR-01, SCR-06）・`08_検証・エラー`（例外→画面対応）

### 🛠️ 最初に作るファイルと書く順番
1. `AuthController` に `@GetMapping("/login")` を追加し、`templates/login.html` を作成する（`param.error` / `param.logout` メッセージ表示付き）
2. `templates/fragments/layout.html` にログイン者氏名（`#authentication.principal.fullName`）と `POST /logout` フォームを追加する
3. `exception/GlobalExceptionHandler.java`（`@ControllerAdvice`）を作成し、404（商品未存在・URL不正）と500（想定外例外）を `templates/error.html` へ誘導する
4. `application.properties` に `server.error.whitelabel.enabled=false` を設定し、`templates/error.html` を作成する

### 🧩 最初の一歩（GlobalExceptionHandler.java の書き出し）
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler({ProductNotFoundException.class, MethodArgumentTypeMismatchException.class})
    public String handleNotFound(Exception ex, HttpServletResponse res, Model model) {
        res.setStatus(HttpStatus.NOT_FOUND.value());
        model.addAttribute("status", 404);
        model.addAttribute("message", "お探しのページ（商品）は見つかりません");
        return "error";
    }
}
```

### ✅ 動作確認のしかた（成功のサイン）
- `/login` で誤パスワードを入れると赤エラー、正しい情報で `/products` へ遷移しヘッダーに氏名が表示される
- ログアウトボタンで `/login?logout` へ移動し、ブラウザバックしても保護画面を操作できない
- `/products/999999` や `/products/abc` にアクセスすると自作の404エラー画面が表示される

### ⚠️ よくあるエラーと対処法
- ログアウトを `<a href="/logout">`（GET）にすると404やCSRFエラーになります → 必ず `<form th:action="@{/logout}" method="post">` を使いましょう。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/step14-login-error-ui
git add . && git commit -m "feat: Step 14 完了"
git push -u origin feature/step14-login-error-ui
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'medium', 90, ARRAY['Thymeleaf', 'ログアウト', '例外処理', 'エラー画面'],
  '{"stepNumber":14,"recommendedBranch":"feature/step14-login-error-ui","designDocPath":"/docs/product-management-design-spec.xlsx","designDocLabel":"商品管理システム 詳細設計書 v1.1.0（03_画面設計 SCR-01/06・08_検証・エラー）","checklist":["`login.html` でログイン・失敗エラー・ログアウトメッセージが正しく動く","ヘッダーにログイン者氏名とPOSTログアウトボタンが表示される","存在しないID・削除済みID・数値以外IDで自作の404画面が表示される","`feature/step14-login-error-ui` ブランチからPRを作成した"],"mockupDocPath":"/docs/product-management-mockup.xlsx","mockupDocLabel":"商品管理システム 画面設計モックアップ（Excel・全8シート）"}', '{"githubUrl":"https://github.com/sample-student/product-manager/pull/14","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/step14-login-error-ui）で実装・動作確認を完了し、Pull Requestを作成しました。"}', 'これで商品管理システムの全6画面と全機能（FN-001〜FN-010）が実装完了です！',
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
  '44444444-4444-4444-8444-444444441415', '33333333-3333-4333-8333-333333331404', 'Step 15：テスト仕様書（TC-001〜TC-022）全件実施 ＆ JUnit 5 単体テスト作成', '### 🎯 この単元でやること（ゴール）
詳細設計書 `10_テスト仕様` の全22ケース（基本12＋推奨境界/セキュリティ10）を実機確認し、さらに `ProductServiceTest`（JUnit 5）で重要業務ロジックを自動テスト化します。

### 💡 なぜこの単元が必要か
「動く気がする」ではなく、仕様書の全テストケースを1件ずつ潰してエビデンスを残すのがプロの開発工程です。

### 📖 見るべき設計書・モックアップ
詳細設計書 `10_テスト仕様`（`TC-001`〜`TC-022`：判定プルダウンで合格率が自動集計されます）

### 🛠️ 最初に作るファイルと書く順番
1. `src/test/java/com/example/product/service/ProductServiceTest.java` を作成し、①SKU重複例外 ②論理削除（`deleted=true`） ③LIKEエスケープのJUnit 5テストを書く
2. `./mvnw test`（またはEclipseでJUnit実行）を走らせて全テストGreenを確認する
3. ブラウザとpgAdmin 4で `TC-001〜TC-022` を1件ずつ実行し、不具合があれば修正して全件「合格」にする

### ✅ 動作確認のしかた（成功のサイン）
- `./mvnw test` が `Failures: 0, Errors: 0` で完走する
- 詳細設計書 `10_テスト仕様` の合格率が **100%** になっている

### ⚠️ よくあるエラーと対処法
- `TC-010`（論理削除）は画面から消えただけでなく、必ずPostgreSQLで `SELECT is_deleted FROM products` を実行して行が残っていることを確認してください。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/step15-testing
git add . && git commit -m "feat: Step 15 完了"
git push -u origin feature/step15-testing
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'hard', 120, ARRAY['テスト仕様書', 'JUnit 5', '品質検証'],
  '{"stepNumber":15,"recommendedBranch":"feature/step15-testing","designDocPath":"/docs/product-management-design-spec.xlsx","designDocLabel":"商品管理システム 詳細設計書 v1.1.0（10_テスト仕様：TC-001〜TC-022）","checklist":["`ProductServiceTest`（JUnit 5）を作成し `./mvnw test` が全件合格した","詳細設計書 `10_テスト仕様`（`TC-001〜TC-022`）を全件実施し合格を確認した","発見した不具合をすべて修正して再テストした","`feature/step15-testing` ブランチからPRを作成した"],"mockupDocPath":"/docs/product-management-mockup.xlsx","mockupDocLabel":"商品管理システム 画面設計モックアップ（Excel・全8シート）"}', '{"githubUrl":"https://github.com/sample-student/product-manager/pull/15","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/step15-testing）で実装・動作確認を完了し、Pull Requestを作成しました。"}', '自動テスト＋仕様書ベースの手動検証の両輪が回せれば、品質保証の基礎はバッチリです！',
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
  '44444444-4444-4444-8444-444444441416', '33333333-3333-4333-8333-333333331404', 'Step 16：README.md整備・新規クローン起動確認 ＆ 最終PR URL提出', '### 🎯 この単元でやること（ゴール）
第三者（講師・採用担当者）が `git clone` して迷わず動かせる `README.md` を整備し、別フォルダでの再現起動を確認して最終PR URLを提出します。

### 💡 なぜこの単元が必要か
どれだけ良いアプリを作っても、動かし方が書いていなければ評価されません。自分の環境以外でも動く再現性チェック（TC-012）が仕上げです。

### 📖 見るべき設計書・モックアップ
詳細設計書 `01_システム概要・環境 §7`・`11_開発手順`

### 🛠️ 最初に作るファイルと書く順番
1. `README.md` に ①システム概要・技術スタック ②PostgreSQL DB作成＆DDL実行手順 ③起動コマンド ④テスト用ログインID/PW ⑤工夫した点 を記載する
2. PCの別フォルダに自分のリポジトリを新規 `git clone` し、READMEの手順通りに起動できるか確認する
3. 最終ブランチ `feature/step16-final-release` から最終Pull Requestを作成し、PR URLを提出する

### ✅ 動作確認のしかた（成功のサイン）
- 別フォルダへの `git clone` → `./mvnw spring-boot:run` でエラーなく起動・ログイン・全操作ができる
- GitHub上にパスワード等の秘密情報が誤ってPushされていない

### ⚠️ よくあるエラーと対処法
- ローカルの `application.properties` に自分のDBパスワードを直書きしたままPushしないよう、`git diff` で提出前に確認しましょう。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/step16-final-release
git add . && git commit -m "feat: Step 16 完了"
git push -u origin feature/step16-final-release
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'medium', 60, ARRAY['README', 'GitHub提出', 'ポートフォリオ'],
  '{"stepNumber":16,"recommendedBranch":"feature/step16-final-release","designDocPath":"/docs/product-management-design-spec.xlsx","designDocLabel":"商品管理システム 詳細設計書 v1.1.0（11_開発手順・TC-012）","checklist":["`README.md` にDB作成手順・起動方法・テストアカウントを分かりやすく記載した","別フォルダへ新規 `git clone` してエラーなく起動・動作確認できた（TC-012）","秘密情報・不要ファイルがGitHubに含まれていないことを確認した","`feature/step16-final-release` から最終PRを作成しPR URLを提出した"],"mockupDocPath":"/docs/product-management-mockup.xlsx","mockupDocLabel":"商品管理システム 画面設計モックアップ（Excel・全8シート）"}', '{"githubUrl":"https://github.com/sample-student/product-manager/pull/16","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/step16-final-release）で実装・動作確認を完了し、Pull Requestを作成しました。"}', '個人開発「商品管理システム」全16ステップ完遂おめでとうございます！この開発力を武器に、いよいよ最終段階の3人1組チーム開発へ進みましょう！',
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
  '44444444-4444-4444-8444-444444441501', '33333333-3333-4333-8333-333333331501', 'Team Step 1：3名役割分担（A/B/C各3画面）・ファイル所有権＆Git Flow整備', '### 🎯 この単元でやること（ゴール）
3名の担当（A:社員＆ダッシュボード / B:案件＆タスク / C:備品＆貸出）と触ってよいファイル境界を合意し、`develop` ブランチとPRテンプレートを整えます。

### 💡 なぜこの単元が必要か
チーム開発のトラブルの8割は「誰がどのファイルを触るか決めていなかった」ことで起きます。最初に境界を設計書で揃えるのが成功の秘訣です。

### 📖 見るべき設計書・モックアップ
詳細設計書 `00_表紙`〜`03_Git・PR運用` ＋ 画面モックアップ（全11シート）

```mermaid
graph TD
  Login["共通：SCR-00 ログイン"]
  Login --> A["メンバーA（3画面）\nダッシュボード / 社員一覧 / 社員登録編集"]
  Login --> B["メンバーB（3画面）\n案件一覧 / 案件詳細・タスク / タスク登録編集"]
  Login --> C["メンバーC（3画面）\n備品一覧 / 貸出申請一覧 / 承認・返却詳細"]
```

### 🛠️ 最初に作るファイルと書く順番
1. チーム共有リポジトリ `teamops-hub` を作成し、3名全員をCollaboratorに登録する
2. `main` から `develop` ブランチを作成し、直接Push禁止・PRレビュー必須のルールを合意する
3. `.github/pull_request_template.md`（設計書 `03_Git・PR運用 §4`）と役割分担表を作成し、`develop` 宛の初回PRを出す

### ✅ 動作確認のしかた（成功のサイン）
- 3名全員がリポジトリを `git clone` し、`develop` ブランチへ切り替えられる
- GitHubでPR作成時にテンプレートが自動入力される

### ⚠️ よくあるエラーと対処法
- いきなり `main` へ直接Pushしてしまう → Step 1で全員 `git switch develop` してから作業開始する習慣をつけましょう。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/team-step01-rules
git add . && git commit -m "feat: Step 1 完了"
git push -u origin feature/team-step01-rules
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'medium', 90, ARRAY['チーム開発', '役割分担', 'Git Flow', 'PRテンプレート'],
  '{"stepNumber":1,"recommendedBranch":"feature/team-step01-rules","designDocPath":"/docs/team-project-design-spec.xlsx","designDocLabel":"TeamOps Hub 開発者向け詳細設計書 v1.1.0（全16シート）","isTeamProject":true,"checklist":["メンバーA/B/Cの担当3画面とファイル所有権を3名全員で合意した","共有リポジトリを作成し、3名全員をCollaborator登録・`develop` を作成した","`.github/pull_request_template.md` を追加し初回PRを作成した","詳細設計書（全16シート）とモックアップ（全11シート）を全員で確認した"],"mockupDocPath":"/docs/team-project-mockup.xlsx","mockupDocLabel":"TeamOps Hub 画面設計モックアップ（Excel・全11シート）"}', '{"githubUrl":"https://github.com/sample-student/teamops-hub/pull/1","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/team-step01-rules）で実装・動作確認を完了し、Pull Requestを作成しました。"}', '役割分担とGitルールが整いました。次は全員で共通の6テーブルDBを構築します！',
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
  '44444444-4444-4444-8444-444444441502', '33333333-3333-4333-8333-333333331501', 'Team Step 2：共通6テーブルDDL（teamops_db）＆初期データ構築', '### 🎯 この単元でやること（ゴール）
全員のローカルPostgreSQLに `teamops_db` と全6テーブル（`departments`, `users`, `projects`, `tasks`, `equipments`, `equipment_loans`）を構築します。

### 💡 なぜこの単元が必要か
3人の機能が外部キーで繋がるため、DB構造をStep 2で全員同じ状態に確定しておくことで、以降の並行開発でテーブル不整合を防ぎます。

### 📖 見るべき設計書・モックアップ
詳細設計書 `08_DB設計`（ER図・全6テーブル定義・制約・初期データ）

```mermaid
erDiagram
  departments ||--o{ users : "所属"
  users ||--o{ projects : "責任者"
  projects ||--o{ tasks : "紐づく"
  users ||--o{ tasks : "担当"
  equipments ||--o{ equipment_loans : "貸出対象"
  users ||--o{ equipment_loans : "申請者"
```

### 🛠️ 最初に作るファイルと書く順番
1. Spring Initializr（Maven / Java 21）で `teamops-hub` の雛形を `develop` に用意する
2. `sql/schema.sql` に外部キー依存順（`departments` → `users` → `projects` → `tasks` → `equipments` → `equipment_loans`）でDDLを書く
3. `sql/data.sql` に初期部署（開発部・営業部・総務部）、初期備品、サンプル案件・タスクを用意する
4. 3名全員がローカルPostgreSQL（`teamops_db`）で実行して同じテーブル状態にする

### ✅ 動作確認のしかた（成功のサイン）
- 3名全員のpgAdmin 4で全6テーブルと外部キー・CHECK制約（`available_qty <= total_qty` 等）が作成されている
- 全員のローカルで `application.properties`（`ddl-auto=validate`）がエラーなく起動する

### ⚠️ よくあるエラーと対処法
- メンバーごとに列名が微妙に違うとマージ後に起動エラーになります → 必ず `sql/schema.sql` をPRマージし、全員同じSQLを実行してください。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/team-step02-db-ddl
git add . && git commit -m "feat: Step 2 完了"
git push -u origin feature/team-step02-db-ddl
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'medium', 90, ARRAY['PostgreSQL', '6テーブルDDL', 'チーム基盤'],
  '{"stepNumber":2,"recommendedBranch":"feature/team-step02-db-ddl","designDocPath":"/docs/team-project-design-spec.xlsx","designDocLabel":"TeamOps Hub 詳細設計書 v1.1.0（08_DB設計）","isTeamProject":true,"checklist":["全6テーブルと制約・インデックスを `sql/schema.sql` に定義した","初期マスタ・サンプルデータを `sql/data.sql` に用意した","3名全員のローカルDB `teamops_db` に構築し整合を確認した","`feature/team-step02-db-ddl` から `develop` 宛PRを作成した"],"mockupDocPath":"/docs/team-project-mockup.xlsx","mockupDocLabel":"TeamOps Hub 画面設計モックアップ（Excel・全11シート）"}', '{"githubUrl":"https://github.com/sample-student/teamops-hub/pull/2","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/team-step02-db-ddl）で実装・動作確認を完了し、Pull Requestを作成しました。"}', '全員同じDBの土台ができました！次は共通のログイン認証とADMIN/USER権限の壁を作ります。',
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
  '44444444-4444-4444-8444-444444441503', '33333333-3333-4333-8333-333333331501', 'Team Step 3：共通Entity（User / Department）＆ Spring Security URL認可マトリクス', '### 🎯 この単元でやること（ゴール）
全員が参照する `Role`・`Department`・`User` EntityとRepository、および `SecurityConfig` のURL認可マトリクス（ADMIN専用URLの403遮断）を実装します。

### 💡 なぜこの単元が必要か
URL認可ルールを最初に1か所（`SecurityConfig`）へ確定しておくと、メンバーA/B/Cが後から権限漏れを起こしにくくなります。

### 📖 見るべき設計書・モックアップ
詳細設計書 `12_セキュリティ §1`（URL認可マトリクス）・`07_クラス設計 §1`

### 🛠️ 最初に作るファイルと書く順番
1. `user/Role.java`（`ROLE_ADMIN`, `ROLE_USER`）、`user/Department.java`、`user/User.java`（有効フラグは `active`）を作成する
2. `user/DepartmentRepository.java`、`user/UserRepository.java`（`findWithDepartmentByEmail`・`findAllByActiveTrueOrderByEmpCodeAsc`）を作成する
3. `config/SecurityConfig.java` に具体的なADMIN専用URL（`/members/new`, `/members/*/edit`, `POST /members/**`, `POST /loans/*/approve|reject|return`）を先に書き、最後に `anyRequest().authenticated()` を配置する

### 🧩 最初の一歩（SecurityConfig の評価順序（具体的ルールを必ず先に書く！））
```java
.requestMatchers("/login", "/error", "/css/**").permitAll()
.requestMatchers(HttpMethod.GET,  "/members/new", "/members/*/edit").hasRole("ADMIN")
.requestMatchers(HttpMethod.POST, "/members", "/members/**").hasRole("ADMIN")
.requestMatchers(HttpMethod.POST, "/loans/*/approve", "/loans/*/reject", "/loans/*/return").hasRole("ADMIN")
.anyRequest().authenticated()
```

### ✅ 動作確認のしかた（成功のサイン）
- `ddl-auto=validate` で `Department` / `User` の起動整合が通る
- 未ログインで `/dashboard` にアクセスすると `/login` へリダイレクトされる

### ⚠️ よくあるエラーと対処法
- `anyRequest().authenticated()` を先頭に書いてしまうと、その下の `.hasRole("ADMIN")` が無視されて一般社員も管理操作できてしまいます！

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/team-step03-security-rules
git add . && git commit -m "feat: Step 3 完了"
git push -u origin feature/team-step03-security-rules
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'medium', 90, ARRAY['Spring Security', 'ロール認可', 'ADMIN/USER'],
  '{"stepNumber":3,"recommendedBranch":"feature/team-step03-security-rules","designDocPath":"/docs/team-project-design-spec.xlsx","designDocLabel":"TeamOps Hub 詳細設計書 v1.1.0（12_セキュリティ・07_クラス設計）","isTeamProject":true,"checklist":["`Role`・`Department`・`User` EntityとRepositoryを作成した","`SecurityConfig` に設計書 `12_セキュリティ §1` 通りのURL認可マトリクスを実装した","`ddl-auto=validate` でエラーなく起動確認できた","`feature/team-step03-security-rules` から `develop` 宛PRを作成した"],"mockupDocPath":"/docs/team-project-mockup.xlsx","mockupDocLabel":"TeamOps Hub 画面設計モックアップ（Excel・全11シート）"}', '{"githubUrl":"https://github.com/sample-student/teamops-hub/pull/3","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/team-step03-security-rules）で実装・動作確認を完了し、Pull Requestを作成しました。"}', 'URL単位の防御壁ができました。次はログイン画面・無効ユーザー拒否・403エラー保護を完成させます。',
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
  '44444444-4444-4444-8444-444444441504', '33333333-3333-4333-8333-333333331501', 'Team Step 4：ログイン画面（SCR-00）・LoginUser（無効拒否）・GlobalExceptionHandler（403保護）', '### 🎯 この単元でやること（ゴール）
開発用3ユーザー（ADMIN 1名・USER 2名）でログインでき、無効ユーザーは拒否され、権限違反が正しく403（500に化けない）になる共通認証＆エラー基盤を完成させます。

### 💡 なぜこの単元が必要か
`GlobalExceptionHandler` で `AccessDeniedException` を再スローしないと、後半の `IT-001` や `UT-C15` で403のはずが500になる典型的な罠にはまります。

### 📖 見るべき設計書・モックアップ
詳細設計書 `11_検証・エラー §5`（設計判断 D-19）・`05_画面設計`（SCR-00）

### 🛠️ 最初に作るファイルと書く順番
1. `common/LoginUser.java`（`isEnabled()` が `user.isActive()` を返す）と `common/CustomUserDetailsService.java` を作成する
2. `common/BusinessException.java`, `common/ResourceNotFoundException.java`, `common/GlobalExceptionHandler.java`（`AccessDeniedException` 再スロー必須！）を作成する
3. `common/AuthController.java`, `templates/login.html`, `templates/error/{403,404,500}.html` を作成し、初期3ユーザーをBCrypt投入する

### 🧩 最初の一歩（GlobalExceptionHandler.java（403→500化け防止の必須コード））
```java
@ExceptionHandler(AccessDeniedException.class)
public void handleAccessDenied(AccessDeniedException ex) {
    throw ex; // ★これを書かないと下の Exception.class に吸われて403が500になる！
}
```

### ✅ 動作確認のしかた（成功のサイン）
- ADMIN / USER の3ユーザーでログインでき、ログイン失敗時は共通エラーメッセージが出る
- DBで `is_active = false` にしたユーザーはログインできない（`UT-X02`）
- USERで `/members/new` に直アクセスすると `templates/error/403.html` が表示される

### ⚠️ よくあるエラーと対処法
- USERで `/members/new` にアクセスしたとき 500 が出る場合は、`GlobalExceptionHandler` に `AccessDeniedException` 再スローがあるか確認してください。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/team-step04-login-errors
git add . && git commit -m "feat: Step 4 完了"
git push -u origin feature/team-step04-login-errors
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'medium', 90, ARRAY['ログイン認証', 'GlobalExceptionHandler', '403保護'],
  '{"stepNumber":4,"recommendedBranch":"feature/team-step04-login-errors","designDocPath":"/docs/team-project-design-spec.xlsx","designDocLabel":"TeamOps Hub 詳細設計書 v1.1.0（11_検証・エラー §5・12_セキュリティ）","isTeamProject":true,"checklist":["`LoginUser` で無効ユーザー（`is_active=false`）のログインを拒否できる","`GlobalExceptionHandler` で 404 / 500 を処理しつつ `AccessDeniedException` を再スローしている","3ユーザーでのログイン・ログアウトとUSERの403画面を確認した","`feature/team-step04-login-errors` から `develop` 宛PRを作成した"],"mockupDocPath":"/docs/team-project-mockup.xlsx","mockupDocLabel":"TeamOps Hub 画面設計モックアップ（Excel・全11シート）"}', '{"githubUrl":"https://github.com/sample-student/teamops-hub/pull/4","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/team-step04-login-errors）で実装・動作確認を完了し、Pull Requestを作成しました。"}', 'これで認証・認可・例外ハンドリングの共通土台が盤石になりました！',
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
  '44444444-4444-4444-8444-444444441505', '33333333-3333-4333-8333-333333331501', 'Team Step 5：共通ナビ（layout.html）＆ モジュール間IF契約スタブ確定 → 全員develop同期', '### 🎯 この単元でやること（ゴール）
全10画面のリンク枠が入った `layout.html` と、AのダッシュボードがB・Cの完成を待たずに開発できる「IF契約スタブ」を `develop` に確定し、全員同期します。

### 💡 なぜこの単元が必要か
IF契約（メソッド名・引数・戻り値）とスタブを先にマージしておくことで、Step 6から3人が相手待ちゼロで同時並行開発できます！

### 📖 見るべき設計書・モックアップ
詳細設計書 `02_チーム分担・所有権・IF`（§3 IF契約 / §4 Step 2完了条件）

### 🛠️ 最初に作るファイルと書く順番
1. `templates/layout.html`（全5メニューリンク・氏名＋部署名・POSTログアウト・フラッシュ）と `static/css/common.css` を作成する
2. メンバーB：`task/TaskService.java` に `countOpenByAssignee`（仮で `0L`）と `findUpcomingByAssignee`（仮で `List.of()`）のスタブを作成する
3. メンバーC：`loan/LoanService.java` に `countByUserAndStatus`（仮で `0L`）のスタブを作成する
4. `develop` へマージ後、3名全員が `git pull origin develop` してローカル起動確認する

### ✅ 動作確認のしかた（成功のサイン）
- 3名全員のPCで最新の `develop` がエラーなく起動する
- ログイン後に共通ヘッダー（氏名・部署名・5つのナビリンク・ログアウト）が表示される

### ⚠️ よくあるエラーと対処法
- 後から `layout.html` を各自バラバラに編集するとコンフリクトの温床になります → このStepで全リンク枠を確定しておきましょう。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/team-step05-layout-stubs
git add . && git commit -m "feat: Step 5 完了"
git push -u origin feature/team-step05-layout-stubs
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'medium', 90, ARRAY['IF契約', 'スタブ', '共通レイアウト', '並行開発準備'],
  '{"stepNumber":5,"recommendedBranch":"feature/team-step05-layout-stubs","designDocPath":"/docs/team-project-design-spec.xlsx","designDocLabel":"TeamOps Hub 詳細設計書 v1.1.0（02_チーム分担・所有権・IF §3・§4）","isTeamProject":true,"checklist":["`templates/layout.html` と `common.css` を作成し全ナビリンク枠を配置した","`TaskService` / `LoanService` のIF契約スタブを確定して `develop` へマージした","3名全員が最新の `develop` を `git pull` してローカル起動確認できた","`feature/team-step05-layout-stubs` からPRを作成した"],"mockupDocPath":"/docs/team-project-mockup.xlsx","mockupDocLabel":"TeamOps Hub 画面設計モックアップ（Excel・全11シート）"}', '{"githubUrl":"https://github.com/sample-student/teamops-hub/pull/5","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/team-step05-layout-stubs）で実装・動作確認を完了し、Pull Requestを作成しました。"}', '共通基盤が完了しました！ここから第2章：3名それぞれの専有パッケージで並行開発スタートです！',
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
  '44444444-4444-4444-8444-444444441506', '33333333-3333-4333-8333-333333331502', 'Team Step 6：【担当画面①・土台】担当パッケージのEntity・Repository・Enum作成', '### 🎯 この単元でやること（ゴール）
自分の担当パッケージ（A:`member`/`dashboard`、B:`project`/`task`、C:`equipment`/`loan`）に必要なEntity・Enum・Repositoryを作成し、`ddl-auto=validate` を通します。

### 💡 なぜこの単元が必要か
いきなりControllerやHTMLまで一気に書かず、まずは自分の担当テーブルとJavaのEntity/Repositoryを噛み合わせることでバグを最小化します。

### 📖 見るべき設計書・モックアップ
詳細設計書 `07_クラス設計`（§2〜§6）・`08_DB設計`

### 🛠️ 最初に作るファイルと書く順番
1. **メンバーA**：`member/MemberForm.java` と `UserRepository#search` / 重複確認メソッドを実装する
2. **メンバーB**：`project/Project`, `ProjectStatus`, `ProjectRepository` と `task/Task`, `TaskStatus`, `TaskPriority`, `TaskRepository` を作成する
3. **メンバーC**：`equipment/Equipment`, `EquipmentRepository`（`findByIdForUpdate`含む）と `loan/EquipmentLoan`, `LoanStatus`, `EquipmentLoanRepository`（`findByIdForUpdate`含む）を作成する
4. ローカルで起動して `ddl-auto=validate` がエラーなく通ることを確認する

### ✅ 動作確認のしかた（成功のサイン）
- 他担当のパッケージを一切変更せず、自分の担当領域だけで `ddl-auto=validate` が通る

### ⚠️ よくあるエラーと対処法
- 列挙型（`ProjectStatus`, `TaskStatus`, `LoanStatus` 等）に `@Enumerated(EnumType.STRING)` を付け忘れると型不一致エラーになります。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/team-step06-domain-base
git add . && git commit -m "feat: Step 6 完了"
git push -u origin feature/team-step06-domain-base
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'medium', 90, ARRAY['並行開発', 'Entity', 'Repository', 'Enum'],
  '{"stepNumber":6,"recommendedBranch":"feature/team-step06-domain-base","designDocPath":"/docs/team-project-design-spec.xlsx","designDocLabel":"TeamOps Hub 詳細設計書 v1.1.0（07_クラス設計・08_DB設計）","isTeamProject":true,"checklist":["自分の担当パッケージのEntity・Enum・Repositoryを作成した","担当外ファイル（共通ファイルや他担当領域）を変更していない","`ddl-auto=validate` でエラーなく起動確認できた","`feature/team-step06-domain-base` から `develop` 宛PRを作成した"],"mockupDocPath":"/docs/team-project-mockup.xlsx","mockupDocLabel":"TeamOps Hub 画面設計モックアップ（Excel・全11シート）"}', '{"githubUrl":"https://github.com/sample-student/teamops-hub/pull/6","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/team-step06-domain-base）で実装・動作確認を完了し、Pull Requestを作成しました。"}', '担当データの土台ができました！次は1画面目を完成させて最初の相互PRレビューを体験します。',
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
  '44444444-4444-4444-8444-444444441507', '33333333-3333-4333-8333-333333331502', 'Team Step 7：【担当画面①・完成】1画面目の実装 ＆ 初回PR相互レビュー', '### 🎯 この単元でやること（ゴール）
各担当の1画面目（A:社員一覧検索 `SCR-A2` / B:案件一覧・1クエリ進捗率 `SCR-B1` / C:備品一覧・在庫検索 `SCR-C1`）を実装し、チーム初のPR相互レビューを行います。

### 💡 なぜこの単元が必要か
まず1画面だけ小さくPRを出してレビューし合うことで、チーム全体のコード品質とレビューの流れが早めに安定します。

### 📖 見るべき設計書・モックアップ
詳細設計書 `05_画面設計`（A2/B1/C1）・`09_処理詳細` ＋ モックアップ該当シート

### 🛠️ 最初に作るファイルと書く順番
1. **メンバーA（SCR-A2 `/members`）**：部署×氏名のAND検索と、`sec:authorize="hasRole(''ADMIN'')"` による操作ボタン出し分けを実装する
2. **メンバーB（SCR-B1 `/projects`）**：`TaskRepository#countGroupByProject`（`GROUP BY` 1クエリ・N+1回避）で進捗率バーを実装する
3. **メンバーC（SCR-C1 `/equipments`）**：カテゴリ×備品名検索と、`available_qty == 0` の「在庫切れ」表示＆申請ボタン無効化を実装する
4. `develop` 宛にPRを作成し、他メンバー1名以上のレビュー＆Approveを受けてマージする

### ✅ 動作確認のしかた（成功のサイン）
- 自分の1画面目がブラウザで正しく表示・検索できる
- 他メンバーのPRを最低1件レビューし、コメント・Approveした

### ⚠️ よくあるエラーと対処法
- メンバーB：タスク0件の案件で `done * 100 / total` をそのまま計算するとゼロ除算エラーになります → `total == 0 ? 0 : ...` を必ず入れましょう。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/team-step07-screen1
git add . && git commit -m "feat: Step 7 完了"
git push -u origin feature/team-step07-screen1
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'medium', 120, ARRAY['担当画面①', 'N+1回避', 'PR相互レビュー'],
  '{"stepNumber":7,"recommendedBranch":"feature/team-step07-screen1","designDocPath":"/docs/team-project-design-spec.xlsx","designDocLabel":"TeamOps Hub 詳細設計書 v1.1.0（05_画面設計・09_処理詳細）","isTeamProject":true,"checklist":["自分の担当1画面目（A2 / B1 / C1）を仕様通り実装しローカル動作確認した","PR本文に動作確認手順・スクショを記載して `develop` 宛PRを作成した","他メンバーのPRを1件以上コードレビュー＆Approveした","Approve後に `develop` へマージし、PR URLを提出した"],"mockupDocPath":"/docs/team-project-mockup.xlsx","mockupDocLabel":"TeamOps Hub 画面設計モックアップ（Excel・全11シート）"}', '{"githubUrl":"https://github.com/sample-student/teamops-hub/pull/7","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/team-step07-screen1）で実装・動作確認を完了し、Pull Requestを作成しました。"}', '初回PRレビューお疲れさまでした！このリズム（小さく実装→PR→相互レビュー）で残りの画面も進めます。',
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
  '44444444-4444-4444-8444-444444441508', '33333333-3333-4333-8333-333333331502', 'Team Step 8：【担当画面②】2画面目（社員登録編集 / 案件詳細 / 貸出申請＆一覧）実装＆PR', '### 🎯 この単元でやること（ゴール）
各担当の2画面目（A:社員登録・編集 `SCR-A3` / B:案件詳細・タスク一覧 `SCR-B2` / C:貸出申請フォーム＆一覧 `SCR-C2`）を実装しPRレビューを受けます。

### 💡 なぜこの単元が必要か
入力検証やデータ可視性（C2：USERは自分のみ・ADMINは全件）など、業務アプリらしい実用ロジックが本格的に登場するステップです。

### 📖 見るべき設計書・モックアップ
詳細設計書 `05_画面設計`（A3/B2/C2）・`09_処理詳細`・`11_検証・エラー`

### 🛠️ 最初に作るファイルと書く順番
1. **メンバーA（SCR-A3 `/members/new`, `/{id}/edit`）**：社員番号・メール重複検証、新規パスワード必須／編集空欄なら変更なし（BCrypt）を実装する
2. **メンバーB（SCR-B2 `/projects/{id}`）**：案件情報と期限昇順（NULL末尾）のタスク一覧を表示し、未存在IDで404を返す
3. **メンバーC（SCR-C2 `GET/POST /loans`）**：申請フォーム（数量1以上・在庫以下・返却予定日今日以降）と可視性制御一覧（USER=自分のみ / ADMIN=全件）を実装する（申請時は在庫を減らさない！）

### ✅ 動作確認のしかた（成功のサイン）
- A：編集時にパスワード空欄で氏名だけ更新しても、元のパスワードでログインできる（`UT-A07`）
- B：`/projects/999999` で自作の404画面が出る（`UT-B03`）
- C：在庫超過数量で申請するとエラーになり登録されない（`IT-005`）。正常申請時は `PENDING` で在庫不変

### ⚠️ よくあるエラーと対処法
- メンバーC：貸出申請（`POST /loans`）の時点で在庫を減らしてしまうのは仕様違反です！在庫減算はStep 10の承認時のみ行います。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/team-step08-screen2
git add . && git commit -m "feat: Step 8 完了"
git push -u origin feature/team-step08-screen2
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'hard', 150, ARRAY['担当画面②', 'CRUD', '可視性制御'],
  '{"stepNumber":8,"recommendedBranch":"feature/team-step08-screen2","designDocPath":"/docs/team-project-design-spec.xlsx","designDocLabel":"TeamOps Hub 詳細設計書 v1.1.0（05_画面設計・09_処理詳細・11_検証・エラー）","isTeamProject":true,"checklist":["自分の担当2画面目（A3 / B2 / C2）とバリデーションを仕様通り実装した","PRGパターンと担当別メッセージファイル（`messages-*.properties`）が正しく動く","他メンバーのPRをレビューし、自PRもApproveを受けてマージした","`feature/team-step08-screen2` のPR URLを提出した"],"mockupDocPath":"/docs/team-project-mockup.xlsx","mockupDocLabel":"TeamOps Hub 画面設計モックアップ（Excel・全11シート）"}', '{"githubUrl":"https://github.com/sample-student/teamops-hub/pull/8","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/team-step08-screen2）で実装・動作確認を完了し、Pull Requestを作成しました。"}', '各担当2画面目が完成しました！次はいよいよ3画面目とチーム開発の核心ロジックに挑みます。',
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
  '44444444-4444-4444-8444-444444441509', '33333333-3333-4333-8333-333333331502', 'Team Step 9：【担当画面③・前半】3画面目の画面＆基本処理（無効化＆ダッシュボード / タスク登録編集 / 申請詳細403）', '### 🎯 この単元でやること（ゴール）
各担当の3画面目の画面と基本処理（A:社員無効化＋ダッシュボードスタブ表示 / B:タスク登録・編集 / C:貸出詳細＋他人閲覧403認可）を実装します。

### 💡 なぜこの単元が必要か
複雑な状態遷移や排他ロックを載せる前に、まず3画面目の表示・データ単位認可（他人の貸出詳細を403で弾く等）を確実に仕上げます。

### 📖 見るべき設計書・モックアップ
詳細設計書 `05_画面設計`（A1/B3/C3）・`12_セキュリティ §2`（データ単位認可）

### 🛠️ 最初に作るファイルと書く順番
1. **メンバーA（A-04 & SCR-A1 `/dashboard`）**：社員無効化（自分自身は無効化不可）・有効化と、IF契約スタブ値を使った `DashboardController` / `DashboardService` / `dashboard.html` を実装する
2. **メンバーB（SCR-B3 `/tasks/new`, `/{id}/edit`）**：有効ユーザーのみ出る担当者プルダウン（`findAllByActiveTrueOrderByEmpCodeAsc`）とタスク登録・編集を実装する
3. **メンバーC（SCR-C3 `GET /loans/{id}`）**：`LoanService#findVisibleById` で「`!admin && !loan.user.id.equals(userId)` なら `AccessDeniedException`（403）」を実装し、`loans/detail.html` を作成する

### ✅ 動作確認のしかた（成功のサイン）
- A：管理者が自分自身を無効化するとエラーで拒否され、他社員は無効化できる（`UT-A08`）
- B：無効化した社員がタスク担当者プルダウンに出ない（`UT-B05`）
- C：USERが他人の `/loans/{id}` をURL直打ちすると **403画面**（500ではない）が表示される（`UT-C15`）

### ⚠️ よくあるエラーと対処法
- メンバーC：他人の貸出詳細で404を返すのではなく、設計書通り `AccessDeniedException`（403）を返すのがポイントです。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/team-step09-screen3-base
git add . && git commit -m "feat: Step 9 完了"
git push -u origin feature/team-step09-screen3-base
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'hard', 150, ARRAY['担当画面③', 'データ認可403', 'ダッシュボード'],
  '{"stepNumber":9,"recommendedBranch":"feature/team-step09-screen3-base","designDocPath":"/docs/team-project-design-spec.xlsx","designDocLabel":"TeamOps Hub 詳細設計書 v1.1.0（05_画面設計・12_セキュリティ §2）","isTeamProject":true,"checklist":["自分の担当3画面目の基本処理とHTML（A1 / B3 / C3）を実装した","A:自己無効化拒否、B:有効ユーザー限定プルダウン、C:他人貸出詳細403 を確認した","`develop` 宛PRを作成し、相互レビュー・Approveを得た","`feature/team-step09-screen3-base` のPR URLを提出した"],"mockupDocPath":"/docs/team-project-mockup.xlsx","mockupDocLabel":"TeamOps Hub 画面設計モックアップ（Excel・全11シート）"}', '{"githubUrl":"https://github.com/sample-student/teamops-hub/pull/9","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/team-step09-screen3-base）で実装・動作確認を完了し、Pull Requestを作成しました。"}', '全10画面の画面枠がすべて揃いました！次のStep 10で本システムの最難関コアロジックを仕上げます。',
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
  '44444444-4444-4444-8444-444444441510', '33333333-3333-4333-8333-333333331502', 'Team Step 10：【担当画面③・コア】状態遷移ガード・悲観的ロック承認/返却・IF契約本実装', '### 🎯 この単元でやること（ゴール）
設計書 `10_状態遷移・排他` の核心ロジック（B:タスク状態遷移ガード＆IF本実装 / C:悲観的ロックによる承認・却下・返却＆IF本実装 / A:ダッシュボードUI仕上げ）を実装します。

### 💡 なぜこの単元が必要か
同時承認での在庫マイナスや二重返却を防ぐ「悲観的ロック（`FOR UPDATE`）＋ロック順序固定」は、実務バックエンド開発で最も差がつく重要スキルです。

### 📖 見るべき設計書・モックアップ
詳細設計書 `10_状態遷移・排他`（全員で必ず読み合わせてから実装！）

```mermaid
sequenceDiagram
  participant A1 as 管理者1
  participant A2 as 管理者2(同時)
  participant DB as PostgreSQL(FOR UPDATE)
  A1->>DB: ①申請行ロック → ②備品行ロック → 在庫減算 → APPROVED → COMMIT
  A2->>DB: ①申請行ロック(待機) → 解放後に最新取得(既にAPPROVED) → 状態エラーでロールバック
```

### 🛠️ 最初に作るファイルと書く順番
1. **メンバーB**：`TaskStatus#canTransitionTo`（`TODO→IN_PROGRESS/DONE`, `IN_PROGRESS→DONE`, `DONE→不可`）と `POST /tasks/{id}/status`、さらに `countOpenByAssignee` / `findUpcomingByAssignee` の本実装を完了する
2. **メンバーC**：`LoanService#approve` / `reject` / `returnLoan` を実装する（**全メソッドで「①申請行ロック → ②ステータス再確認 → ③備品行ロック → ④在庫再確認/更新」の順序を厳守**し、`BusinessException` はService内でcatchしない）＋ `countByUserAndStatus` 本実装
3. **メンバーA**：ダッシュボードの期限間近タスク行クリック遷移や0件表示、社員一覧の細部仕上げを行う

### ✅ 動作確認のしかた（成功のサイン）
- B：`DONE` タスクへ `curl` で `status=TODO` をPOSTしても状態が変わらずエラーになる（`UT-B07`）
- C：在庫1の備品へPENDING 2件を連続承認すると、1件目成功(在庫0)・2件目は在庫不足エラーでPENDINGのまま（`UT-C17`）
- C：返却を2回送信しても在庫加算は1回のみ（`UT-C18`）

### ⚠️ よくあるエラーと対処法
- `BusinessException` を Service 内で `try-catch` してしまうとトランザクションがロールバックされなくなります → 必ず Controller で `catch` してください。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/team-step10-core-logic
git add . && git commit -m "feat: Step 10 完了"
git push -u origin feature/team-step10-core-logic
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'hard', 180, ARRAY['状態遷移', '悲観的ロック', '排他制御', 'IF契約本実装'],
  '{"stepNumber":10,"recommendedBranch":"feature/team-step10-core-logic","designDocPath":"/docs/team-project-design-spec.xlsx","designDocLabel":"TeamOps Hub 詳細設計書 v1.1.0（10_状態遷移・排他）","isTeamProject":true,"checklist":["B：タスク状態遷移ガードとIF契約メソッドの本実装が完了した","C：悲観的ロック（申請行→備品行の順）による承認・却下・返却とIF本実装が完了した","A：ダッシュボードと社員管理の全UI・遷移が整った","`feature/team-step10-core-logic` のPRを全員で重点レビューしマージした"],"mockupDocPath":"/docs/team-project-mockup.xlsx","mockupDocLabel":"TeamOps Hub 画面設計モックアップ（Excel・全11シート）"}', '{"githubUrl":"https://github.com/sample-student/teamops-hub/pull/10","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/team-step10-core-logic）で実装・動作確認を完了し、Pull Requestを作成しました。"}', '最難関のコアロジック実装おめでとうございます！次は担当別の単体テストで品質を固めます。',
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
  '44444444-4444-4444-8444-444444441511', '33333333-3333-4333-8333-333333331502', 'Team Step 11：担当別単体テスト（UT-A / UT-B / UT-C）全件実施＆レビュー改修', '### 🎯 この単元でやること（ゴール）
詳細設計書 `13_テスト仕様` の自分の担当UTケース（A:`UT-A01〜08` / B:`UT-B01〜07` / C:`UT-C11〜19` ＋共通 `UT-X01〜03`）をすべて実施し、バグを潰します。

### 💡 なぜこの単元が必要か
統合前に各自の担当範囲を完璧にしておくことで、第3章の横断結合テストがスムーズに進みます。

### 📖 見るべき設計書・モックアップ
詳細設計書 `13_テスト仕様`（UT全ケース）

### 🛠️ 最初に作るファイルと書く順番
1. 自分の担当UTケースをブラウザ・curl・PostgreSQLで1件ずつ実行する
2. 重要ロジック（進捗率計算、状態遷移、他人貸出403、在庫不足承認拒否等）のJUnit 5テストを作成する
3. 見つかった不具合を修正し、PR本文にUT結果一覧を貼って `develop` へマージする

### ✅ 動作確認のしかた（成功のサイン）
- `./mvnw test` が全件PASSする
- 自分の担当UTケースがすべて「合格」になっている

### ⚠️ よくあるエラーと対処法
- 画面からボタンを隠しただけで満足せず、`UT-B07` や `UT-C19` のように `curl` で直接POSTしたときもサーバー側が拒否することを必ず確認しましょう。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/team-step11-unit-tests
git add . && git commit -m "feat: Step 11 完了"
git push -u origin feature/team-step11-unit-tests
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'medium', 120, ARRAY['単体テスト', 'UT', '品質保証'],
  '{"stepNumber":11,"recommendedBranch":"feature/team-step11-unit-tests","designDocPath":"/docs/team-project-design-spec.xlsx","designDocLabel":"TeamOps Hub 詳細設計書 v1.1.0（13_テスト仕様：UT-X/A/B/C）","isTeamProject":true,"checklist":["担当分のUTケース（UT-A / UT-B / UT-C）を全件実施し合格を確認した","主要ロジックのJUnit 5単体テストを作成し `./mvnw test` がPASSした","PR本文にテスト結果を記載し、レビュー後にマージした","`feature/team-step11-unit-tests` のPR URLを提出した"],"mockupDocPath":"/docs/team-project-mockup.xlsx","mockupDocLabel":"TeamOps Hub 画面設計モックアップ（Excel・全11シート）"}', '{"githubUrl":"https://github.com/sample-student/teamops-hub/pull/11","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/team-step11-unit-tests）で実装・動作確認を完了し、Pull Requestを作成しました。"}', 'これで第2章（担当3画面の並行開発＋単体テスト）が完了です！いよいよ全10画面の横断結合へ進みます。',
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
  '44444444-4444-4444-8444-444444441512', '33333333-3333-4333-8333-333333331503', 'Team Step 12：IF契約の本接続（全10画面結合）＆ コンフリクト解消実践', '### 🎯 この単元でやること（ゴール）
3名全員の担当機能（全10画面）を `develop` 上で1つのアプリとして統合し、ダッシュボードの実データ連携とマージ時のコンフリクト解消を実践します。

### 💡 なぜこの単元が必要か
コンフリクトを自力で安全に解消してビルドを通せる経験は、現場配属後に即戦力として高く評価される必須スキルです。

### 📖 見るべき設計書・モックアップ
詳細設計書 `03_Git・PR運用 §7`（コンフリクト解消手順）

### 🛠️ 最初に作るファイルと書く順番
1. 全員が `git fetch origin` → 自ブランチで `git merge origin/develop` を実行する
2. コンフリクトが発生したファイルは `<<<<<<<` / `=======` / `>>>>>>>` を確認し、変更した相手と会話しながら両方の意図を残して解消する
3. AのダッシュボードがBの未完了タスク数＆上位5件・Cの貸出中/申請中件数を実データで表示することを確認する（`IT-010`）
4. 全10画面のヘッダーリンクから相互遷移し、リンク切れ・404・崩れがないことを確認する（`IT-006`）

### ✅ 動作確認のしかた（成功のサイン）
- Cで新規申請→Aのダッシュボードの「申請中」が即時 +1、Bでタスク完了→「未完了」が即時 -1 になる
- 全10画面のナビゲーションがエラーなく相互遷移できる

### ⚠️ よくあるエラーと対処法
- コンフリクト解消時に焦って「自分の変更だけ採用（Accept Current）」を押すと、相手の実装を消してしまいます → 必ず両方の変更内容を確認しましょう。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c feature/team-step12-integration
git add . && git commit -m "feat: Step 12 完了"
git push -u origin feature/team-step12-integration
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'hard', 120, ARRAY['統合', 'コンフリクト解消', 'IF契約'],
  '{"stepNumber":12,"recommendedBranch":"feature/team-step12-integration","designDocPath":"/docs/team-project-design-spec.xlsx","designDocLabel":"TeamOps Hub 詳細設計書 v1.1.0（03_Git・PR運用 §7・02_チーム分担）","isTeamProject":true,"checklist":["全10画面が `develop` に統合されエラーなく起動できる","マージ時のコンフリクトを適切に解消できた","ダッシュボードがB・Cの実データを正しく集計表示している（`IT-010`）","全10画面の共通ナビ相互遷移（`IT-006`）を確認しPR URLを提出した"],"mockupDocPath":"/docs/team-project-mockup.xlsx","mockupDocLabel":"TeamOps Hub 画面設計モックアップ（Excel・全11シート）"}', '{"githubUrl":"https://github.com/sample-student/teamops-hub/pull/12","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（feature/team-step12-integration）で実装・動作確認を完了し、Pull Requestを作成しました。"}', '3人のアプリが1つのシステムとして動き出しました！次はセキュリティと排他制御の徹底検証です。',
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
  '44444444-4444-4444-8444-444444441513', '33333333-3333-4333-8333-333333331503', 'Team Step 13：ロール権限総当たり検証（IT-001/012）＆ 同時承認・在庫整合検証（IT-004/008/011）', '### 🎯 この単元でやること（ゴール）
最も事故が起きやすい「ロール別権限（未ログイン/USER/ADMIN）」と「同時承認・返却の在庫整合性」を設計書の総当たり表と検証SQLで徹底検証します。

### 💡 なぜこの単元が必要か
権限漏れや在庫不整合は本番で最も重大な障害になります。ここで網羅チェックをやり切ることで実務品質を担保します。

### 📖 見るべき設計書・モックアップ
詳細設計書 `12_セキュリティ §4`（権限総当たり表）・`08_DB設計 §5`（在庫整合検証SQL）

### 🛠️ 最初に作るファイルと書く順番
1. 未ログイン・USER・ADMINの3状態で `12_セキュリティ §4` の全行にアクセスし、期待ステータス（200/302/403）を検証する（`IT-012`）
2. ADMINで2つのブラウザタブを開き、同じPENDING申請を続けて承認して片方成功・片方状態エラー・在庫減算1回のみを確認する（`IT-008`）
3. pgAdmin 4 で在庫整合性検証SQL（`available_qty <> total_qty - SUM(APPROVED)`）を実行し **0行** であることを確認する（`IT-011`）
4. 見つかった不具合があれば `fix/` ブランチで修正してPRマージする

### ✅ 動作確認のしかた（成功のサイン）
- `IT-001`・`IT-012` の全行が仕様通り（特に他人の `/loans/{id}` が 403 で 500 にならない）
- `IT-004`・`IT-008` 実施後に在庫整合性検証SQLが **0行** である（`IT-011`）

### ⚠️ よくあるエラーと対処法
- 検証時にブラウザのキャッシュや同一セッションが残っていると別ロールのテストが混ざります → シークレットウィンドウを活用しましょう。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c fix/team-step13-sec-concurrency
git add . && git commit -m "feat: Step 13 完了"
git push -u origin fix/team-step13-sec-concurrency
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'hard', 120, ARRAY['セキュリティテスト', '排他制御検証', '在庫整合性'],
  '{"stepNumber":13,"recommendedBranch":"fix/team-step13-sec-concurrency","designDocPath":"/docs/team-project-design-spec.xlsx","designDocLabel":"TeamOps Hub 詳細設計書 v1.1.0（12_セキュリティ §4・10_状態遷移・排他 §4）","isTeamProject":true,"checklist":["権限総当たり表（`IT-001`, `IT-012`）を全行確認し合格した","同時承認（`IT-008`）および承認→返却トランザクション（`IT-004`）を確認した","在庫整合性検証SQL（`IT-011`）が 0 行であることを確認した","検証・改修のPRを作成しPR URLを提出した"],"mockupDocPath":"/docs/team-project-mockup.xlsx","mockupDocLabel":"TeamOps Hub 画面設計モックアップ（Excel・全11シート）"}', '{"githubUrl":"https://github.com/sample-student/teamops-hub/pull/13","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（fix/team-step13-sec-concurrency）で実装・動作確認を完了し、Pull Requestを作成しました。"}', 'セキュリティと在庫整合性の最難関関門を突破しました！',
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
  '44444444-4444-4444-8444-444444441514', '33333333-3333-4333-8333-333333331503', 'Team Step 14：横断結合テスト（IT-001〜IT-012）クロスチェック＆GitHub Issuesバグ改修', '### 🎯 この単元でやること（ゴール）
他メンバーが作った画面をクロスチェック（AがBを、BがCを、CがAをテスト）して `IT-001〜IT-012` を全件完了させ、不具合はGitHub Issues→`fix/`ブランチで改修します。

### 💡 なぜこの単元が必要か
自分で作った画面は思い込みで見落としがちです。他メンバーによるクロスチェックとIssue起票→PRクローズは現場の品質管理そのものです。

### 📖 見るべき設計書・モックアップ
詳細設計書 `13_テスト仕様`（`IT-001`〜`IT-012`）

### 🛠️ 最初に作るファイルと書く順番
1. クロスチェック担当を決め、`IT-002`（A→B連携）・`IT-003`（B進捗率）・`IT-005`（在庫超過）・`IT-009`（無効化影響）を含む全12件を実施する
2. 不具合を見つけたらGitHubの **Issues** タブに再現手順とスクショを起票する
3. 担当者が `fix/issue番号-内容` ブランチで修正→PRレビュー→マージしてIssueをクローズする
4. `13_テスト仕様` の判定欄をすべて「合格」（合格率100%）にする

### ✅ 動作確認のしかた（成功のサイン）
- `IT-001〜IT-012` がすべて「合格」になり、未解決のバグIssueが 0 件である

### ⚠️ よくあるエラーと対処法
- `IT-009`（社員無効化）：担当者プルダウンからは消えますが、過去のタスク・貸出履歴の表示は消さずに残るのが正しい仕様です。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c fix/team-step14-it-fixes
git add . && git commit -m "feat: Step 14 完了"
git push -u origin fix/team-step14-it-fixes
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'hard', 120, ARRAY['結合テスト', 'クロスチェック', 'GitHub Issues'],
  '{"stepNumber":14,"recommendedBranch":"fix/team-step14-it-fixes","designDocPath":"/docs/team-project-design-spec.xlsx","designDocLabel":"TeamOps Hub 詳細設計書 v1.1.0（13_テスト仕様：IT-001〜IT-012）","isTeamProject":true,"checklist":["メンバー同士のクロスチェックで `IT-001〜IT-012` を全件実施した","発見したバグをGitHub Issues起票→`fix/`ブランチPRで修正・クローズした","詳細設計書 `13_テスト仕様` の合格率が 100% になった","改修・確認完了のPR URLを提出した"],"mockupDocPath":"/docs/team-project-mockup.xlsx","mockupDocLabel":"TeamOps Hub 画面設計モックアップ（Excel・全11シート）"}', '{"githubUrl":"https://github.com/sample-student/teamops-hub/pull/14","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（fix/team-step14-it-fixes）で実装・動作確認を完了し、Pull Requestを作成しました。"}', '横断結合テスト全件合格おめでとうございます！いよいよ最終リリースと発表準備に入ります。',
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
  '44444444-4444-4444-8444-444444441515', '33333333-3333-4333-8333-333333331504', 'Team Step 15：develop → main リリースPR作成 ＆ GitHub運用監査（IT-007）', '### 🎯 この単元でやること（ゴール）
テスト完了済みの `develop` から本番安定ブランチ `main` へリリースPRを作成し、3名全員のPR・レビュー・コミット履歴（`IT-007`）を確認します。

### 💡 なぜこの単元が必要か
実務では `develop` で統合テストを終えたあと、リリースPRを通じて `main` へ昇格させます。全員の開発貢献が履歴に残っているかも重要な評価基準です。

### 📖 見るべき設計書・モックアップ
詳細設計書 `03_Git・PR運用 §4・§6`（`IT-007` 対策）

### 🛠️ 最初に作るファイルと書く順番
1. `develop` の最新状態で `./mvnw test` と全10画面の最終スモークテストを実施する
2. GitHub上で `base: main` ← `compare: develop` のリリースPRを作成する
3. GitHubの `Pull Requests` タブおよび `Insights → Contributors` を開き、3名全員のPR・相互レビューコメント・コミット履歴が残っていることを確認する（`IT-007`）
4. 全員の最終確認後、**Merge commit**（全員のコミット履歴を残す方式）で `main` へマージする

### ✅ 動作確認のしかた（成功のサイン）
- `Insights → Contributors` にチーム3名全員の名前とコミットが表示されている
- `main` ブランチに全10画面の最新コードが反映されている

### ⚠️ よくあるエラーと対処法
- `develop → main` を Squash merge すると全員分のコミットが1つに潰れてしまいます → ここは必ず **Create a merge commit** を使いましょう。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c release/v1.0-teamops
git add . && git commit -m "feat: Step 15 完了"
git push -u origin release/v1.0-teamops
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'medium', 60, ARRAY['リリースPR', 'GitHub運用監査', 'Merge commit'],
  '{"stepNumber":15,"recommendedBranch":"release/v1.0-teamops","designDocPath":"/docs/team-project-design-spec.xlsx","designDocLabel":"TeamOps Hub 詳細設計書 v1.1.0（03_Git・PR運用・IT-007）","isTeamProject":true,"checklist":["`develop` 上で全自動テストと全10画面の動作を確認した","`develop` → `main` のリリースPRを作成し全員で確認した","`IT-007`（3名全員のPR・相互レビュー・コミット履歴）を確認した","リリースPRのURLを提出した"],"mockupDocPath":"/docs/team-project-mockup.xlsx","mockupDocLabel":"TeamOps Hub 画面設計モックアップ（Excel・全11シート）"}', '{"githubUrl":"https://github.com/sample-student/teamops-hub/pull/15","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（release/v1.0-teamops）で実装・動作確認を完了し、Pull Requestを作成しました。"}', '安定した `main` ブランチへのリリースが完了しました！残すは最終Step 16のREADME整備とデモ発表提出のみです。',
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
  '44444444-4444-4444-8444-444444441516', '33333333-3333-4333-8333-333333331504', 'Team Step 16：README.md整備・新規クローン起動確認・デモ発表 ＆ 最終PR URL提出', '### 🎯 この単元でやること（ゴール）
3名の担当一覧・環境構築手順・テストアカウント・工夫した点をまとめた `README.md` を仕上げ、新規クローン起動とデモシナリオを確認して最終PR URLを提出します。

### 💡 なぜこの単元が必要か
1年間カリキュラムの集大成として、「他人が動かせて、3人のチーム開発ストーリーが伝わるリポジトリ」を完成させます。

### 📖 見るべき設計書・モックアップ
詳細設計書 `00_表紙`〜`15_設計判断ログ`（全体振り返り）

### 🛠️ 最初に作るファイルと書く順番
1. `README.md` に ①システム概要と3名の担当画面一覧 ②PostgreSQL `teamops_db` 構築＆起動手順 ③ADMIN/USERテストアカウント ④工夫した点・コンフリクト解消や排他制御の学び を記載する
2. `main` ブランチをPCの別フォルダへ新規 `git clone` し、README手順だけで起動・全10画面操作ができるか確認する
3. デモ発表用の画面遷移シナリオ（ログイン→ダッシュボード→社員登録→タスク割当→進捗反映→備品申請→承認→返却）を3名でリハーサルする
4. 最終リリースPRの **GitHub Pull Request URL（`/pull/番号`）** を提出する

### ✅ 動作確認のしかた（成功のサイン）
- 新規 `git clone` 環境でエラーなく起動し、全10画面がスムーズに動く
- デモ発表シナリオを5〜10分で澱みなく実演できる

### ⚠️ よくあるエラーと対処法
- デモ直前にDBデータが中途半端な状態になっていないか、`sql/data.sql` で初期状態へ戻せることを確認しておきましょう。

### 🔀 提出ブランチ＆Pull Request手順
```bash
git switch -c release/v1.0-final
git add . && git commit -m "feat: Step 16 完了"
git push -u origin release/v1.0-final
```
GitHub上で Pull Request を作成し、**PR URL（`/pull/番号`）** を右側のフォームから提出してください。',
  'medium', 90, ARRAY['README', 'デモ発表', '最終提出', '1年集大成'],
  '{"stepNumber":16,"recommendedBranch":"release/v1.0-final","designDocPath":"/docs/team-project-design-spec.xlsx","designDocLabel":"TeamOps Hub 開発者向け詳細設計書 v1.1.0（全16シート）","isTeamProject":true,"checklist":["`README.md` に3名担当一覧・起動手順・テストアカウント・工夫点を記載した","`main` を別フォルダへ新規 `git clone` してエラーなく起動・全10画面確認できた","デモ発表シナリオを3名で確認した","最終リリース用のGitHub Pull Request URLを提出した"],"mockupDocPath":"/docs/team-project-mockup.xlsx","mockupDocLabel":"TeamOps Hub 画面設計モックアップ（Excel・全11シート）"}', '{"githubUrl":"https://github.com/sample-student/teamops-hub/pull/16","checkedItems":[0,1,2,3],"summaryNote":"推奨ブランチ（release/v1.0-final）で実装・動作確認を完了し、Pull Requestを作成しました。"}', '1年間カリキュラム全工程（全11コース）完遂、本当におめでとうございます！設計書読解・実装・テスト・排他制御・Gitチーム開発までやり切った実績は、現場配属後も確かな武器になります。',
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

-- 5. 新規演習問題のテストケース登録（冪等洗い替え）
DELETE FROM public.test_cases WHERE problem_id IN ('44444444-4444-4444-8444-444444441101', '44444444-4444-4444-8444-444444441102', '44444444-4444-4444-8444-444444441103', '44444444-4444-4444-8444-444444441104', '44444444-4444-4444-8444-444444441105', '44444444-4444-4444-8444-444444441106', '44444444-4444-4444-8444-444444441201', '44444444-4444-4444-8444-444444441202', '44444444-4444-4444-8444-444444441203', '44444444-4444-4444-8444-444444441204', '44444444-4444-4444-8444-444444441205', '44444444-4444-4444-8444-444444441206', '44444444-4444-4444-8444-444444441207', '44444444-4444-4444-8444-444444441208', '44444444-4444-4444-8444-444444441209', '44444444-4444-4444-8444-444444441210', '44444444-4444-4444-8444-444444441211', '44444444-4444-4444-8444-444444441212', '44444444-4444-4444-8444-444444441301', '44444444-4444-4444-8444-444444441302', '44444444-4444-4444-8444-444444441303', '44444444-4444-4444-8444-444444441304', '44444444-4444-4444-8444-444444441305', '44444444-4444-4444-8444-444444441306', '44444444-4444-4444-8444-444444441307', '44444444-4444-4444-8444-444444441308', '44444444-4444-4444-8444-444444441309', '44444444-4444-4444-8444-444444441310', '44444444-4444-4444-8444-444444441311', '44444444-4444-4444-8444-444444441312', '44444444-4444-4444-8444-444444442101', '44444444-4444-4444-8444-444444442102', '44444444-4444-4444-8444-444444442103', '44444444-4444-4444-8444-444444442104', '44444444-4444-4444-8444-444444442105', '44444444-4444-4444-8444-444444442106', '44444444-4444-4444-8444-444444442107', '44444444-4444-4444-8444-444444442108', '44444444-4444-4444-8444-444444442109', '44444444-4444-4444-8444-444444442110', '44444444-4444-4444-8444-444444442111', '44444444-4444-4444-8444-444444442112', '44444444-4444-4444-8444-444444442113', '44444444-4444-4444-8444-444444442114', '44444444-4444-4444-8444-444444442201', '44444444-4444-4444-8444-444444442202', '44444444-4444-4444-8444-444444442203', '44444444-4444-4444-8444-444444442204', '44444444-4444-4444-8444-444444442205', '44444444-4444-4444-8444-444444442206', '44444444-4444-4444-8444-444444442207', '44444444-4444-4444-8444-444444442208', '44444444-4444-4444-8444-444444442209', '44444444-4444-4444-8444-444444442210', '44444444-4444-4444-8444-444444442211', '44444444-4444-4444-8444-444444442212', '44444444-4444-4444-8444-444444442301', '44444444-4444-4444-8444-444444442302', '44444444-4444-4444-8444-444444442303', '44444444-4444-4444-8444-444444442304', '44444444-4444-4444-8444-444444442305', '44444444-4444-4444-8444-444444442306', '44444444-4444-4444-8444-444444442307', '44444444-4444-4444-8444-444444442308', '44444444-4444-4444-8444-444444442309', '44444444-4444-4444-8444-444444442310', '44444444-4444-4444-8444-444444442401', '44444444-4444-4444-8444-444444442402', '44444444-4444-4444-8444-444444442403', '44444444-4444-4444-8444-444444442404', '44444444-4444-4444-8444-444444442405', '44444444-4444-4444-8444-444444442406', '44444444-4444-4444-8444-444444442407', '44444444-4444-4444-8444-444444442408', '44444444-4444-4444-8444-444444442409', '44444444-4444-4444-8444-444444442410', '44444444-4444-4444-8444-444444441401', '44444444-4444-4444-8444-444444441402', '44444444-4444-4444-8444-444444441403', '44444444-4444-4444-8444-444444441404', '44444444-4444-4444-8444-444444441405', '44444444-4444-4444-8444-444444441406', '44444444-4444-4444-8444-444444441407', '44444444-4444-4444-8444-444444441408', '44444444-4444-4444-8444-444444441409', '44444444-4444-4444-8444-444444441410', '44444444-4444-4444-8444-444444441411', '44444444-4444-4444-8444-444444441412', '44444444-4444-4444-8444-444444441413', '44444444-4444-4444-8444-444444441414', '44444444-4444-4444-8444-444444441415', '44444444-4444-4444-8444-444444441416', '44444444-4444-4444-8444-444444441501', '44444444-4444-4444-8444-444444441502', '44444444-4444-4444-8444-444444441503', '44444444-4444-4444-8444-444444441504', '44444444-4444-4444-8444-444444441505', '44444444-4444-4444-8444-444444441506', '44444444-4444-4444-8444-444444441507', '44444444-4444-4444-8444-444444441508', '44444444-4444-4444-8444-444444441509', '44444444-4444-4444-8444-444444441510', '44444444-4444-4444-8444-444444441511', '44444444-4444-4444-8444-444444441512', '44444444-4444-4444-8444-444444441513', '44444444-4444-4444-8444-444444441514', '44444444-4444-4444-8444-444444441515', '44444444-4444-4444-8444-444444441516');

INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442101', '公開テスト1：10000円を3人で割り勘', '10000
3
', '1人あたり: 3333円
余り: 1円', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442101', '公開テスト2：ちょうど割り切れる場合', '12000
4
', '1人あたり: 3000円
余り: 0円', false, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442101', '非公開テスト：端数あり', '5555
6
', '1人あたり: 925円
余り: 5円', true, 3);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442102', '公開テスト1：80, 75, 90', '80
75
90
', '合計: 245
平均: 81.7', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442102', '公開テスト2：100, 100, 100', '100
100
100
', '合計: 300
平均: 100.0', false, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442102', '非公開テスト：61, 62, 63', '61
62
63
', '合計: 186
平均: 62.0', true, 3);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442103', '公開テスト1：prd-0042', 'prd-0042
', '8
PRD-0042
PRD', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442103', '公開テスト2：abc123', 'abc123
', '6
ABC123
ABC', false, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442103', '非公開テスト：dev_999', 'dev_999
', '7
DEV_999
DEV', true, 3);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442104', '公開テスト1：正常ログイン', 'admin
java2025
', 'LOGIN_OK', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442104', '公開テスト2：パスワード誤り', 'admin
wrong
', 'LOGIN_NG', false, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442104', '非公開テスト：ID誤り', 'guest
java2025
', 'LOGIN_NG', true, 3);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442105', '公開テスト1：N=10', '10
', '55
30', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442105', '公開テスト2：N=5', '5
', '15
6', false, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442105', '非公開テスト：N=1', '1
', '1
0', true, 3);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442106', '公開テスト1：3の段', '3
', '3 x 1 = 3
3 x 2 = 6
3 x 3 = 9
3 x 4 = 12
3 x 5 = 15
3 x 6 = 18
3 x 7 = 21
3 x 8 = 24
3 x 9 = 27', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442106', '非公開テスト：7の段', '7
', '7 x 1 = 7
7 x 2 = 14
7 x 3 = 21
7 x 4 = 28
7 x 5 = 35
7 x 6 = 42
7 x 7 = 49
7 x 8 = 56
7 x 9 = 63', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442107', '公開テスト1：5名中3名合格', '5
80
55
60
42
91
', '合格: 3人
不合格: 2人', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442107', '公開テスト2：全員不合格', '3
10
59
0
', '合格: 0人
不合格: 3人', false, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442107', '非公開テスト：全員合格', '2
60
100
', '合格: 2人
不合格: 0人', true, 3);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442108', '公開テスト1：高さ4', '4
', '*
**
***
****', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442108', '公開テスト2：高さ1', '1
', '*', false, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442108', '非公開テスト：高さ5', '5
', '*
**
***
****
*****', true, 3);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442109', '公開テスト1：4件', '4
70 80 90 60
', '60 90 80 70
2', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442109', '公開テスト2：3件（同点）', '3
50 50 50
', '50 50 50
3', false, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442109', '非公開テスト：5件', '5
10 20 30 40 100
', '100 40 30 20 10
2', true, 3);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442110', '公開テスト1：重複ありの先頭一致', '5
10 25 30 25 50
25
', '1', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442110', '公開テスト2：見つからない場合', '4
1 2 3 4
9
', '-1', false, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442110', '非公開テスト：末尾で一致', '3
7 8 9
9
', '2', true, 3);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442111', '公開テスト1：2000円の20%引き＋税10%', '2000
20
', '1760', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442111', '公開テスト2：割引なし', '1000
0
', '1100', false, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442111', '非公開テスト：1500円の10%引き＋税10%', '1500
10
', '1485', true, 3);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442112', '公開テスト1：2名登録', '2
山田太郎 開発部
佐藤花子 営業部
', '[開発部] 山田太郎
[営業部] 佐藤花子', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442112', '非公開テスト：3名登録', '3
鈴木 総務
高橋 人事
田中 開発
', '[総務] 鈴木
[人事] 高橋
[開発] 田中', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442113', '公開テスト1：入庫・不足・出庫', 'Mouse 5
3
IN 3
OUT 10
OUT 4
', 'SHORTAGE
Mouse: 4', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442113', '公開テスト2：ちょうど0になる出庫', 'PC 2
1
OUT 2
', 'PC: 0', false, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442113', '非公開テスト：連続不足', 'Hub 1
3
OUT 2
OUT 5
IN 4
', 'SHORTAGE
SHORTAGE
Hub: 5', true, 3);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442114', '公開テスト1：5000円以上で送料無料', '2
Keyboard 3000 1
Mouse 1200 2
', '商品合計: 5400円
送料: 0円
請求金額: 5400円', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442114', '公開テスト2：5000円未満で送料500円', '2
Cable 800 2
Pad 1000 1
', '商品合計: 2600円
送料: 500円
請求金額: 3100円', false, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442114', '非公開テスト：ちょうど5000円', '1
Headset 5000 1
', '商品合計: 5000円
送料: 0円
請求金額: 5000円', true, 3);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442201', '公開テスト1：2x3', '2 3
10 20 30
40 50 10
', '50 70 40
1', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442201', '非公開テスト：3x2同点', '3 2
10 20
20 10
10 10
', '40 40
0', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442202', '公開テスト1：2x2で3件', '2 2
3
0 1
0 1
1 0
', 'OK
TAKEN
OK
2', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442202', '非公開テスト：全席予約', '1 2
2
0 0
0 1
', 'OK
OK
0', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442203', '公開テスト1：10 25 18', '10 25 18
', '25
25', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442203', '非公開テスト：-5 -2 0', '-5 -2 0
', '-2
0', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442204', '公開テスト1：5件中上位2件', '5 2
40 90 70 100 60
', '190', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442204', '非公開テスト：4件中上位3件', '4 3
10 50 30 20
', '100', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442205', '公開テスト1：重複あり', '6
10 20 10 30 20 10
', '3', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442205', '非公開テスト：すべて同一', '4
5 5 5 5
', '1', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442206', '公開テスト1：3名×2科目', '3 2
70 80
90 85
60 95
', '150
175
155
2', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442206', '非公開テスト：2名×3科目', '2 3
50 50 50
40 60 50
', '150
150
1', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442207', '公開テスト1：3件採番', '3
PC
Mouse
Hub
', 'ORD-1001: PC
ORD-1002: Mouse
ORD-1003: Hub', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442207', '非公開テスト：1件採番', '1
Monitor
', 'ORD-1001: Monitor', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442208', '公開テスト1：一般＋管理職', '2
STAFF 佐藤 250000
MANAGER 山田 350000 50000
', '佐藤: 250000
山田: 400000', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442208', '非公開テスト：管理職のみ', '1
MANAGER 鈴木 300000 80000
', '鈴木: 380000', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442209', '公開テスト1：長方形＋三角形', '2
RECT 4 5
TRI 6 4
', '32', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442209', '非公開テスト：3図形', '3
RECT 3 3
TRI 10 2
RECT 2 5
', '29', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442210', '公開テスト1：VIP 10000円', 'VIP 10000
', '8000', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442210', '公開テスト2：REGULAR 10000円', 'REGULAR 10000
', '9500', false, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442210', '非公開テスト：VIP 2500円', 'VIP 2500
', '2000', true, 3);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442211', '公開テスト1：2件通知', '2
EMAIL Welcome
SLACK Alert
', '[EMAIL] Welcome
[SLACK] Alert', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442211', '非公開テスト：1件通知', '1
SLACK DeployOK
', '[SLACK] DeployOK', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442212', '公開テスト1：3種混在', '3
CARD 10000
BANK 5000
CASH 3000
', '520', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442212', '非公開テスト：CARD2件', '2
CARD 5000
CARD 2000
', '210', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442301', '公開テスト1：3件中2件ヒット', '3
PC 120000
Mouse 3500
Hub 4800
5000
', '2
Mouse
Hub', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442301', '非公開テスト：0件', '2
PC 100000
Monitor 40000
10000
', '0', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442302', '公開テスト1：E404カウント', '5
E404 E500 E404 E403 E404
E404
', '3', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442302', '非公開テスト：未存在コード', '3
E404 E500 E500
E401
', '0', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442303', '公開テスト1：3部署', '4
山田 開発
佐藤 営業
鈴木 開発
高橋 総務
', '開発: 2
営業: 1
総務: 1', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442303', '非公開テスト：1部署のみ', '2
A 開発
B 開発
', '開発: 2', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442304', '公開テスト1：重複あり', '5
C01 C02 C01 C03 C02
', 'C01 C02 C03', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442304', '非公開テスト：重複なし', '3
A B C
', 'A B C', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442305', '公開テスト1：未存在コード含む', '2
P01 1000
P02 2500
3
P01 2
P99 5
P02 1
', '4500', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442305', '非公開テスト：全件有効', '2
A 300
B 400
2
A 3
B 2
', '1700', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442306', '公開テスト1：2行CSV', '2
Pen,120,5
Note,250,2
', '1100', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442306', '非公開テスト：3行CSV', '3
A,100,1
B,200,2
C,300,3
', '1400', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442307', '公開テスト1：不正2件混在', '5
100 abc 250 N/A 50
', '400
2', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442307', '非公開テスト：すべて正常', '3
10 20 30
', '60
0', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442308', '公開テスト1：正常と異常', '3
User@Example.COM
@invalid.com
no_at_mark
', 'example.com
INVALID
INVALID', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442308', '非公開テスト：末尾@', '2
abc@
a@b.jp
', 'INVALID
b.jp', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442309', '公開テスト1：境界値含む', '4
0 25 -1 121
', 'OK
OK
OUT_OF_RANGE
OUT_OF_RANGE', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442309', '非公開テスト：120歳', '2
120 150
', 'OK
OUT_OF_RANGE', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442310', '公開テスト1：正常＋不正混在', '5
PC,50000
Book,2000
PC,abc
Book,-500
PC,30000
', 'PC: 80000
Book: 2000
ERRORS: 2', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442310', '非公開テスト：エラーなし', '2
Food,500
Food,700
', 'Food: 1200
ERRORS: 0', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442401', '公開テスト1：登録・論理削除・一覧', '4
ADD 1 PC
ADD 2 Mouse
DEL 1
LIST
', '2:Mouse', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442401', '非公開テスト：全削除後EMPTY', '3
ADD 10 Hub
DEL 10
LIST
', 'EMPTY', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442402', '公開テスト1：複数エラー', 'AB -100 -5
', 'ERR_SKU
ERR_PRICE
ERR_STOCK', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442402', '公開テスト2：正常', 'PRD01 0 0
', 'VALID', false, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442402', '非公開テスト：価格のみNG', 'SKU-1 -1 10
', 'ERR_PRICE', true, 3);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442403', '公開テスト1：重複検知', '3
P01 PC
P02 Mouse
P01 Keyboard
', 'CREATED: P01
CREATED: P02
DUPLICATE: P01
2', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442403', '非公開テスト：重複なし', '2
A1 X
A2 Y
', 'CREATED: A1
CREATED: A2
2', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442404', '公開テスト1：25件・10件毎・3ページ目', '25 10 3
', '3
20
5', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442404', '公開テスト2：0件', '0 10 1
', '0
0
0', false, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442404', '非公開テスト：範囲外ページ', '20 10 5
', '2
40
0', true, 3);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442405', '公開テスト1：3パターン', '3
USER /admin/users
USER /user/profile
GUEST /public/top
', '403 FORBIDDEN
200 OK
200 OK', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442405', '非公開テスト：ADMINとGUEST', '2
ADMIN /admin/settings
GUEST /user/home
', '200 OK
403 FORBIDDEN', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442406', '公開テスト1：正常＋不正スキップ', '4
SHIPPED
PAID
SHIPPED
CANCELED
', 'INVALID
OK
OK
INVALID
SHIPPED', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442406', '非公開テスト：完了まで', '3
PAID
SHIPPED
DONE
', 'OK
OK
OK
DONE', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442407', '公開テスト1：貸出・超過・返却', '3 4
APPROVE 2
APPROVE 2
RETURN 1
RETURN 5
', 'APPROVED
DENIED
RETURNED
INVALID
2', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442407', '非公開テスト：全返却', '5 2
APPROVE 5
RETURN 5
', 'APPROVED
RETURNED
5', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442408', '公開テスト1：2案件', '4
Alpha DONE
Alpha TODO
Beta DONE
Alpha DONE
', 'Alpha: 66% (2/3)
Beta: 100% (1/1)', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442408', '非公開テスト：0%案件', '2
Gamma TODO
Gamma IN_PROGRESS
', 'Gamma: 0% (0/2)', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442409', '公開テスト1：全境界値', '5
15 10000
2 9999
3 5000
10 5000
11 5000
', '0
500
800
800
1500', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442409', '非公開テスト：境界確認', '2
1 10000
11 9999
', '0
1500', true, 2);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442410', '公開テスト1：登録・重複・検索・在庫警告', '5
ADD P01 GamingMouse 4500 5
ADD P02 OfficeMouse 1800 20
ADD P01 DupItem 1000 10
SEARCH Mouse
SEARCH Keyboard
', 'OK
OK
DUP
P01 GamingMouse 4500 5 [LOW]
P02 OfficeMouse 1800 20
NONE', false, 1);
INSERT INTO public.test_cases (problem_id, name, input, expected_output, is_hidden, order_index)
VALUES ('44444444-4444-4444-8444-444444442410', '非公開テスト：境界在庫10', '2
ADD P09 Monitor 30000 10
SEARCH Mon
', 'OK
P09 Monitor 30000 10', true, 2);

-- 6. 新規演習問題のヒント登録（冪等洗い替え）
DELETE FROM public.hints WHERE problem_id IN ('44444444-4444-4444-8444-444444441101', '44444444-4444-4444-8444-444444441102', '44444444-4444-4444-8444-444444441103', '44444444-4444-4444-8444-444444441104', '44444444-4444-4444-8444-444444441105', '44444444-4444-4444-8444-444444441106', '44444444-4444-4444-8444-444444441201', '44444444-4444-4444-8444-444444441202', '44444444-4444-4444-8444-444444441203', '44444444-4444-4444-8444-444444441204', '44444444-4444-4444-8444-444444441205', '44444444-4444-4444-8444-444444441206', '44444444-4444-4444-8444-444444441207', '44444444-4444-4444-8444-444444441208', '44444444-4444-4444-8444-444444441209', '44444444-4444-4444-8444-444444441210', '44444444-4444-4444-8444-444444441211', '44444444-4444-4444-8444-444444441212', '44444444-4444-4444-8444-444444441301', '44444444-4444-4444-8444-444444441302', '44444444-4444-4444-8444-444444441303', '44444444-4444-4444-8444-444444441304', '44444444-4444-4444-8444-444444441305', '44444444-4444-4444-8444-444444441306', '44444444-4444-4444-8444-444444441307', '44444444-4444-4444-8444-444444441308', '44444444-4444-4444-8444-444444441309', '44444444-4444-4444-8444-444444441310', '44444444-4444-4444-8444-444444441311', '44444444-4444-4444-8444-444444441312', '44444444-4444-4444-8444-444444442101', '44444444-4444-4444-8444-444444442102', '44444444-4444-4444-8444-444444442103', '44444444-4444-4444-8444-444444442104', '44444444-4444-4444-8444-444444442105', '44444444-4444-4444-8444-444444442106', '44444444-4444-4444-8444-444444442107', '44444444-4444-4444-8444-444444442108', '44444444-4444-4444-8444-444444442109', '44444444-4444-4444-8444-444444442110', '44444444-4444-4444-8444-444444442111', '44444444-4444-4444-8444-444444442112', '44444444-4444-4444-8444-444444442113', '44444444-4444-4444-8444-444444442114', '44444444-4444-4444-8444-444444442201', '44444444-4444-4444-8444-444444442202', '44444444-4444-4444-8444-444444442203', '44444444-4444-4444-8444-444444442204', '44444444-4444-4444-8444-444444442205', '44444444-4444-4444-8444-444444442206', '44444444-4444-4444-8444-444444442207', '44444444-4444-4444-8444-444444442208', '44444444-4444-4444-8444-444444442209', '44444444-4444-4444-8444-444444442210', '44444444-4444-4444-8444-444444442211', '44444444-4444-4444-8444-444444442212', '44444444-4444-4444-8444-444444442301', '44444444-4444-4444-8444-444444442302', '44444444-4444-4444-8444-444444442303', '44444444-4444-4444-8444-444444442304', '44444444-4444-4444-8444-444444442305', '44444444-4444-4444-8444-444444442306', '44444444-4444-4444-8444-444444442307', '44444444-4444-4444-8444-444444442308', '44444444-4444-4444-8444-444444442309', '44444444-4444-4444-8444-444444442310', '44444444-4444-4444-8444-444444442401', '44444444-4444-4444-8444-444444442402', '44444444-4444-4444-8444-444444442403', '44444444-4444-4444-8444-444444442404', '44444444-4444-4444-8444-444444442405', '44444444-4444-4444-8444-444444442406', '44444444-4444-4444-8444-444444442407', '44444444-4444-4444-8444-444444442408', '44444444-4444-4444-8444-444444442409', '44444444-4444-4444-8444-444444442410', '44444444-4444-4444-8444-444444441401', '44444444-4444-4444-8444-444444441402', '44444444-4444-4444-8444-444444441403', '44444444-4444-4444-8444-444444441404', '44444444-4444-4444-8444-444444441405', '44444444-4444-4444-8444-444444441406', '44444444-4444-4444-8444-444444441407', '44444444-4444-4444-8444-444444441408', '44444444-4444-4444-8444-444444441409', '44444444-4444-4444-8444-444444441410', '44444444-4444-4444-8444-444444441411', '44444444-4444-4444-8444-444444441412', '44444444-4444-4444-8444-444444441413', '44444444-4444-4444-8444-444444441414', '44444444-4444-4444-8444-444444441415', '44444444-4444-4444-8444-444444441416', '44444444-4444-4444-8444-444444441501', '44444444-4444-4444-8444-444444441502', '44444444-4444-4444-8444-444444441503', '44444444-4444-4444-8444-444444441504', '44444444-4444-4444-8444-444444441505', '44444444-4444-4444-8444-444444441506', '44444444-4444-4444-8444-444444441507', '44444444-4444-4444-8444-444444441508', '44444444-4444-4444-8444-444444441509', '44444444-4444-4444-8444-444444441510', '44444444-4444-4444-8444-444444441511', '44444444-4444-4444-8444-444444441512', '44444444-4444-4444-8444-444444441513', '44444444-4444-4444-8444-444444441514', '44444444-4444-4444-8444-444444441515', '44444444-4444-4444-8444-444444441516');

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
VALUES ('44444444-4444-4444-8444-444444442101', 1, '商（割り算の答え）を求める演算子 `/` と、余りを求める演算子 `%` の2つを使います。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442101', 2, '`int perPerson = total / people;` のように変数へ入れてから文字列連結で出力しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442102', 1, '整数同士の割り算 `sum / 3` では小数が消えてしまうため、`3.0` で割るか `(double)` でキャストしましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442102', 2, '小数第1位までの整形には `String.format("%.1f", avg)` が便利です。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442103', 1, '文字列の長さは `.length()`、大文字化は `.toUpperCase()` で取得できます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442103', 2, '先頭から3文字取り出すときは、開始インデックス `0`・終了インデックス `3` を `substring` に渡します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442104', 1, '文字列同士の比較は `==` ではなく `.equals(...)` を使いましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442104', 2, 'IDとパスワードの両方が一致する条件は論理積 `&&` でつなぎます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442105', 1, '合計を貯める変数を2つ（全合計用・偶数合計用）用意し、ループ前に0で初期化しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442105', 2, '偶数かどうかは2で割った余り（`%` 演算子）が0かどうかで判定できます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442105', 3, 'ループ終了後、全合計・偶数合計の順に2行で出力できているか確認しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442106', 1, 'ループ変数を1から9まで1ずつ増やしながら繰り返します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442106', 2, '半角小文字の `x` と `=` の前後に半角スペースが1つずつ入っているか注意しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442106', 3, '文字列連結の中で掛け算を書くときは、括弧で囲んで優先順位を明確にすると安全です。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442107', 1, '合格カウンタと不合格カウンタの2つの変数を用意し、`n` 回のループ内で点数を1つずつ読み込みます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442107', 2, '境界値の「ちょうど60点」は合格に含まれるため、`>` ではなく `>=` を使いましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442107', 3, '不合格者数は `n - pass` で求めることもできます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442108', 1, '外側のループで行番号（1〜h）を回し、内側のループでその行番号と同じ回数だけ `*` をつなげます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442108', 2, '1行分の文字列を空文字から組み立てて、内側ループの後に `println` で出力するとシンプルです。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442108', 3, '行ごとに変数をリセットし忘れないよう、変数の宣言位置を確認しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442109', 1, '配列の末尾インデックスは `n - 1` です。`i--` で `0` まで減らすと逆順に取り出せます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442109', 2, '平均は `(double) sum / n` で小数のまま求めてから各要素と `>=` で比較しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442109', 3, '1行目の末尾に余分なスペースがつかないよう、先頭要素以外でスペースを挟む工夫をしましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442110', 1, '配列の先頭（インデックス0）から順番に `arr[i]` と `target` を比較します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442110', 2, '一致したらすぐに `return` でそのときのインデックスを返すと、最初の位置が返ります。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442110', 3, 'ループを最後まで抜けてしまった場合だけ `-1` を返しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442111', 1, '小数の丸め誤差を避けるため、`* (100 - discountPercent) / 100` のように整数演算で計算すると正確です。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442111', 2, '`applyDiscount` の戻り値をそのまま `addTax` の引数へ渡す流れにしてみましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442112', 1, '`Employee` クラスに `name` と `department` の2つのフィールドとコンストラクタを定義します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442112', 2, '`new Employee[n]` で配列の枠を作り、ループ内で `new Employee(name, dept)` を各要素へ代入します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442113', 1, '在庫数を `private` フィールドにし、増減は必ず `restock` / `ship` メソッド経由にします。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442113', 2, '`ship` では先に `stock < qty` かどうかをチェックし、足りない場合は減算せずに `false` を返しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442113', 3, 'コマンド判定の文字列比較には `.equals("IN")` / `.equals("OUT")` を使います。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442114', 1, '`CartItem` クラスに単価×数量を計算して返す `getSubtotal()` を用意すると、メイン側の集計がすっきりします。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442114', 2, '送料判定は境界値の「ちょうど5000円」が0円になるよう `>= 5000` で比較しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442114', 3, '請求金額は「商品合計 + 送料」で計算します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442201', 1, '列ごとに集計するため、外側のループで列インデックス `j` を回しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442201', 2, '同点時に小さい番号を優先するには、最大値更新の条件を `>` にします。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442202', 1, '`int[][] seats = new int[rows][cols];` は自動的にすべて `0` で初期化されます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442202', 2, '残りの空席数は「総席数 `rows * cols` − 予約成功回数」でも求められます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442203', 1, '引数の個数が異なれば、同じメソッド名 `maxVal` を複数定義できます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442203', 2, '3引数の最大値は、2引数版を2回組み合わせるだけで簡潔に書けます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442204', 1, '二重ループで大きい値を先頭側へ交換（降順ソート）してみましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442204', 2, 'ソート後、インデックス `0` から `k - 1` までを足し合わせます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442205', 1, 'インデックス `i` より前の位置に `arr[i]` と同じ値があるかどうかを内側ループで確認します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442205', 2, 'まだ一度も登場していないときだけカウンタを増やしましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442206', 1, '行ごとに合計を求めながら出力し、同時に最大値とインデックスを更新します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442206', 2, '出力するトップ番号は0始まりではなく1始まり（`+ 1`）です。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442207', 1, '`private static int nextId = 1001;` のようにクラス共通の連番変数を用意します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442207', 2, 'コンストラクタの中で自分の `id` に代入しつつ `nextId` を1増やしましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442208', 1, '`Manager` のコンストラクタ先頭で `super(name, baseSalary);` を呼び出します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442208', 2, '親クラス型 `Staff[]` の配列に `Staff` と `Manager` の両方を格納できます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442209', 1, '`extends Shape` したクラスで `public int area()` をオーバーライドします。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442209', 2, '`Shape[]` に格納し、ループで `shapes[i].area()` を足し合わせましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442210', 1, '`implements DiscountPolicy` を付けた2つのクラスを作成します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442210', 2, '変数の型を `DiscountPolicy` にしておくと、どちらのインスタンスも同じ呼び出し方で計算できます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442211', 1, '送信種別に応じて `EmailNotifier` または `SlackNotifier` を生成し、`Notifier` 型変数へ代入します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442212', 1, '決済種別ごとに3つのクラスを作成し、共通の `FeeCalculator` 変数で受け取ります。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442212', 2, 'ループ内で各決済の `calcFee(amount)` を合計変数へ加算しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442301', 1, 'まず全件の商品名・価格を読み込み、最後に `maxPrice` を読み込んで比較しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442301', 2, '一致した商品名を `ArrayList<String>` に `add` し、`size()` と各要素を出力します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442302', 1, 'すでにキーが存在すれば現在の値に `+1`、存在しなければ `1` を `put` します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442302', 2, '調査対象がマップに存在しない場合は `null` 回避のため `0` を出力しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442303', 1, '`HashMap` で人数を数えつつ、初登場の部署名だけを `ArrayList` に追加しておきます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442303', 2, '最後に `ArrayList` の順番で `HashMap` から人数を取り出して出力しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442304', 1, '`!list.contains(id)` のときだけ `list.add(id)` すると重複を防げます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442305', 1, '商品コードをキー、単価を値として `HashMap` へ登録します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442305', 2, '注文処理時は `containsKey` で存在チェックしてから単価×数量を加算しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442306', 1, '1行を `split(",")` で分割すると、`cols[1]` が単価、`cols[2]` が数量になります。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442306', 2, '文字列から `int` への変換には `Integer.parseInt(...)` を使います。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442307', 1, '`Integer.parseInt(token)` を `try` ブロック内で実行し、失敗時は `catch` ブロックでエラー件数を増やします。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442308', 1, '`indexOf("@")` で `@` の位置を探し、`0` より大きく末尾より前かを判定します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442308', 2, '`substring(at + 1).toLowerCase()` でドメイン部分を小文字化して取得できます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442309', 1, '`if (age < 0 || age > 120)` のときに `throw new IllegalArgumentException("OUT_OF_RANGE");` を実行します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442310', 1, '各行を `,` で分割し、`Integer.parseInt` を `try-catch` で囲みつつ負数もエラー扱いします。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442310', 2, '初出順の `ArrayList` と集計用の `HashMap` を組み合わせて出力順を安定させましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442401', 1, 'リポジトリクラス内に `ArrayList<ProductEntity>` を持ち、`save` / `softDelete` / `findAllActive` を分離します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442402', 1, '`else if` ではなく独立した3つの `if` 文を使い、エラーを `ArrayList<String>` に蓄積しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442403', 1, '`HashMap<String, String>` で `containsKey(sku)` を調べればO(1)で重複検知できます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442404', 1, '切り上げ総ページ数は `(total + size - 1) / size` で求められます（`total == 0` の場合だけ例外的に0）。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442404', 2, '現在ページの件数は `total - offset` が0以下なら0、`size` より大きければ `size` に丸めます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442405', 1, 'URLの先頭一致判定には `url.startsWith("/admin/")` を使います。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442406', 1, '現在の状態ごとに「次に許可される状態」を明示的に列挙し、それ以外は `false` を返します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442407', 1, '貸出時は `available >= qty`、返却時は `available + qty <= total` の2つの不変条件を守ります。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442408', 1, '総数用の `HashMap` と完了数用の `HashMap` の2つを持つと見通しが良くなります。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442408', 2, '割り算を先にすると0になるため、`d * 100 / t` の順に計算しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442409', 1, '最優先ルールである `subtotal >= 10000` を最初に判定し、残りを重さの昇順で `<=` 判定します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442410', 1, '部分一致検索は `it.name.contains(kw)` で判定できます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444442410', 2, '在庫警告は「10未満（`stock < 10`）」のときだけ末尾に `" [LOW]"` を付与しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441401', 1, 'GitHubリポジトリは講師がレビューできるようPublic（またはCollaborator招待）にしておきましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441402', 1, 'Step 2時点ではまだEntityが無いので `ddl-auto=validate` のままエラーなく起動します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441403', 1, '`@RestController` ではなく `@Controller` を使う点に注意しましょう（HTMLを返すため）。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441404', 1, 'ヘッダーのログイン者表示・ログアウトボタンはStep 13でSpring Security導入後に組み込みます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441405', 1, '`users` の初期データ（BCryptパスワード）はStep 13で安全に投入するので、今はテーブル作成だけでOKです。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441406', 1, '`@PrePersist` と `@PreUpdate` を `Product` に書いておくと、`createdAt`・`updatedAt` が自動設定されて便利です。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441407', 1, '0件時の「該当する商品がありません」表示（`th:if="${#lists.isEmpty(products)}"`）も一緒に入れておきましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441408', 1, '詳細画面の商品説明は `th:text`＋CSSの `white-space: pre-wrap;` にするとXSSを防ぎつつ改行を保持できます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441409', 1, 'フラッシュメッセージ表示枠（`th:if="${message}"`）は `list.html` の上部に配置しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441410', 1, '`application.properties` に `spring.messages.basename=messages` があることを確認しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441411', 1, '`messages.properties` に `product.sku.duplicate=このSKUはすでに登録されています` を追加しておきましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441412', 1, '削除済み商品の `/products/{id}` へ直接アクセスして404扱いになることも確認しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441413', 1, '`SecurityConfig` でCSRFは無効化せず、デフォルト有効のまま維持してください。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441414', 1, '`th:action` を使えばThymeleafが自動でCSRFトークンの `<input type="hidden" name="_csrf">` を埋め込んでくれます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441415', 1, 'テスト中に見つかったバグは「原因→修正内容」をPR本文に書くと、講師からの評価がグッと上がります。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441416', 1, '完成した画面のスクリーンショットを `README.md` に貼ると、ポートフォリオとしての見栄えが格段に良くなります。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441501', 1, '毎日10分の朝会（昨日やったこと・今日やること・困っていること）を決めると進捗ズレを防げます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441502', 1, '担当別エラーメッセージの競合を防ぐため、`application.properties` に `spring.messages.basename=messages,messages-member,messages-project,messages-equipment` を設定しておきましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441503', 1, '`User.role` には必ず `@Enumerated(EnumType.STRING)` を付け、数値（ORDINAL）保存を禁止しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441504', 1, 'ログイン成功後は `/dashboard` へ遷移するよう `defaultSuccessUrl("/dashboard", true)` に設定します。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441505', 1, '担当別メッセージファイル（`messages-member/project/equipment.properties`）も空ファイルで先に作っておくと競合しません。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441506', 1, '毎朝必ず `git switch develop && git pull origin develop` してから新ブランチを切りましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441507', 1, 'PRは400行以内を目安に小さく保つと、レビュアーも5〜10分で確認できて開発が止まりません。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441508', 1, 'C2で申請バリデーションエラー時に `loans/list` を再表示するとき、一覧データ（`loans`・`requestableEquipments`）の再セットを忘れないようにしましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441509', 1, 'Aのダッシュボードはこの段階ではB/Cのスタブ値（0件）で崩れず表示されれば合格です（Step 12で実データ接続）。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441510', 1, 'Cの承認・返却PRは、メンバーA・Bも一緒に設計書 `10_状態遷移・排他` と突き合わせて全員レビューしましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441511', 1, '異常系（0件・上限+1文字・権限外の直URLアクセス）を重点的に試すと実務力が上がります。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441512', 1, '解消後は必ずEclipseでクリーンビルド＆起動して、他人の画面も開いて確認しましょう。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441513', 1, '不具合がゼロだった場合も、テスト証跡（実施ログ・SQL結果）をドキュメントへ記録してPRを出すと完璧です。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441514', 1, 'PR本文に `Closes #Issue番号` と書くと、マージと同時に自動でIssueがクローズされて実務っぽくなります！');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441515', 1, 'タグ `v1.0.0` を `main` に打っておくと、実務のリリース管理まで体験できます。');
INSERT INTO public.hints (problem_id, step_number, content_md)
VALUES ('44444444-4444-4444-8444-444444441516', 1, '提出URLは最終リリース用PRのURL（例：`https://github.com/team-xxx/teamops-hub/pull/16`）を入力してください。');

-- 7. 権限確認
GRANT SELECT ON public.courses, public.chapters, public.lessons, public.problems, public.test_cases, public.hints TO authenticated;
