import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white border rounded-2xl shadow-sm p-6 sm:p-10 space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                プライバシーポリシー（個人情報の取扱いについて）
              </h1>
              <p className="text-xs text-slate-500">
                DevSkillStudio 法人向けエンジニア研修プラットフォーム
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            トップへ戻る
          </Link>
        </div>

        <section className="space-y-2 text-sm text-slate-700 leading-relaxed">
          <h2 className="font-bold text-slate-900">1. 取得する個人情報</h2>
          <p>
            当サービス（DevSkillStudio）は、法人向けエンジニア研修の提供にあたり、受講生および企業担当者から以下の個人情報を取得します。
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-600">
            <li>氏名、メールアドレス、所属企業情報（企業コード）</li>
            <li>学習進捗履歴、提出コード、評価コメント、質問内容、ログイン履歴</li>
          </ul>
        </section>

        <section className="space-y-2 text-sm text-slate-700 leading-relaxed">
          <h2 className="font-bold text-slate-900">2. 利用目的</h2>
          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-600">
            <li>受講生アカウントの本人認証および研修ポータルの提供</li>
            <li>所属企業の研修担当者に対する学習進捗・修了判定レポートの共有</li>
            <li>講師からの技術指導・質問対応（Slack通知連携を含む）</li>
            <li>不正アクセス防止・監査ログ記録によるセキュリティ確保</li>
          </ul>
        </section>

        <section className="space-y-2 text-sm text-slate-700 leading-relaxed">
          <h2 className="font-bold text-slate-900">3. 安全管理措置（セキュリティ対策）</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            個人情報保護法に基づき、通信の常時暗号化（HTTPS/TLS）、パスワードのハッシュ化保管、ロール別アクセス権限制御、企業テナント間の厳格なデータ分離（Row Level Security）、ブルートフォース対策、および監査ログ記録を実施し、個人情報の漏えい・滅失・毀損を防止します。
          </p>
        </section>

        <section className="space-y-2 text-sm text-slate-700 leading-relaxed">
          <h2 className="font-bold text-slate-900">4. 第三者提供・委託</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            法令に基づく場合を除き、本人の同意なく所属企業およびシステム運営委託先以外の第三者へ個人情報を提供することはありません。
          </p>
        </section>

        <section className="space-y-2 text-sm text-slate-700 leading-relaxed">
          <h2 className="font-bold text-slate-900">5. 開示・訂正・削除のご請求</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            ご自身の個人情報の開示・訂正・削除・利用停止をご希望の場合は、所属企業の研修担当者またはシステム運営管理者までご連絡ください。契約終了時は所定の手順に従い速やかにデータを削除します。
          </p>
        </section>
      </div>
    </div>
  );
}
