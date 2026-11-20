-- 企業テーブルへ管理者Slack通知連携（Incoming Webhook URL / チャンネル名メモ）カラムを追加
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS slack_webhook_url TEXT,
  ADD COLUMN IF NOT EXISTS slack_channel_name TEXT;
