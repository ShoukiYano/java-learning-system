"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Code2,
  Building2,
  User,
  Mail,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from "lucide-react";

export default function StudentSignupPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isBusy = loading || redirecting || isPending;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBusy) return;
    if (!agreedPrivacy) {
      setError("プライバシーポリシーへの同意が必要です。");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            company_code: companyCode.trim().toUpperCase(),
            role: "student",
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        setRedirecting(true);
        startTransition(() => {
          router.push("/student");
          router.refresh();
        });
      } else {
        setSuccessMsg(
          "確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。"
        );
        setLoading(false);
      }
    } catch {
      setError(
        "登録処理中にエラーが発生しました。環境変数設定を確認してください。"
      );
      setLoading(false);
      setRedirecting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      {/* ★ 登録・画面遷移中のフルスクリーン・フィードバックオーバーレイ */}
      {isBusy && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 animate-in fade-in duration-150">
          <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-bold text-white">
              {redirecting
                ? "アカウント作成完了！学習ダッシュボードを準備しています..."
                : "受講生アカウントを作成しています..."}
            </p>
            <p className="text-xs text-slate-400">
              そのまま少々お待ちください
            </p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md space-y-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            トップページに戻る
          </Link>
        </div>

        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2.5 mb-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              DevSkill<span className="text-blue-400">Studio</span>
            </span>
          </Link>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            新規受講生アカウント作成
          </span>
        </div>

        <Card className="border-slate-800 bg-slate-900/90 text-slate-100 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl">新規受講登録</CardTitle>
            <CardDescription className="text-slate-400">
              所属企業から配布された「企業コード」をお持ちの場合は入力してください。
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  氏名（フルネーム）
                </label>
                <Input
                  type="text"
                  required
                  disabled={isBusy}
                  placeholder="山田 太郎"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  メールアドレス
                </label>
                <Input
                  type="email"
                  required
                  disabled={isBusy}
                  placeholder="taro.yamada@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-slate-400" />
                  パスワード（8文字以上）
                </label>
                <Input
                  type="password"
                  required
                  disabled={isBusy}
                  minLength={8}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                  企業コード（任意・法人研修の方は入力）
                </label>
                <Input
                  type="text"
                  disabled={isBusy}
                  placeholder="例: ACME2025"
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value)}
                  className="bg-slate-950 border-slate-700 text-white uppercase"
                />
              </div>

              <label className="flex items-start gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreedPrivacy}
                  onChange={(e) => setAgreedPrivacy(e.target.checked)}
                  required
                  disabled={isBusy}
                  className="mt-0.5 rounded border-slate-600 bg-slate-950 accent-blue-600"
                />
                <span>
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="text-blue-400 underline hover:text-blue-300 font-semibold"
                  >
                    プライバシーポリシー（個人情報の取扱い）
                  </Link>
                  を確認し、同意します（必須）
                </span>
              </label>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                disabled={isBusy || !agreedPrivacy}
              >
                {isBusy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {redirecting
                      ? "ダッシュボードへ移動中..."
                      : "アカウント作成中..."}
                  </>
                ) : (
                  "アカウントを作成して学習開始"
                )}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
              すでにアカウントをお持ちの方は{" "}
              <Link
                href="/student/login"
                className="text-blue-400 font-semibold hover:underline"
              >
                ログインはこちら
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
