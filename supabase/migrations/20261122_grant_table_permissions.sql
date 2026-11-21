-- =============================================================================
-- public スキーマ全テーブルへの service_role / authenticated 権限付与
-- 目的：
--   Supabase 環境で `[42501] permission denied for table profiles` 等の
--   テーブル権限不足エラーを解消します。
--   ※ 全テーブルで RLS（Row Level Security）が有効なため、authenticated への
--      テーブル権限付与は RLS ポリシーの枠内でのみ機能します。
-- =============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- service_role（サーバー側特権クライアント）へ全テーブル・シーケンスの完全権限を付与
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- authenticated（ログイン済みユーザー：RLSポリシー制御下）へ基本DML権限を付与
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 今後作成されるテーブルにも同じデフォルト権限を適用
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO authenticated;

-- PostgREST スキーマキャッシュを再読み込み
NOTIFY pgrst, 'reload schema';
