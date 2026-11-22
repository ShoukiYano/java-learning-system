-- =============================================================================
-- 目標マイルストーン「登録日からの相対日数（target_days_offset）」対応マイグレーション
-- 例：登録から 7日後（10問）、14日後（16問）、21日後（22問）、28日後（28問）、35日後（34問）
-- 固定日付（target_date）と相対日数（target_days_offset）の両方に対応します。
-- =============================================================================

ALTER TABLE public.training_milestones
  ADD COLUMN IF NOT EXISTS target_days_offset INTEGER;

ALTER TABLE public.training_milestones
  ALTER COLUMN target_date SET DEFAULT '';

NOTIFY pgrst, 'reload schema';
