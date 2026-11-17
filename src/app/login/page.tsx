"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, KeyRound, Mail, AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("メールアドレスまたはパスワードが正しくありません。");
        setLoading(false);
        return;
      }

      if (data.user) {
        // 最終ログイン日時を更新し、ロールに応じた画面へリダイレクト
        await supabase
          .from("profiles")
          .update({ last_login_at: new Date().toISOString() })
          .eq("id", data.user.id);

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profile?.role === "admin") {
          router.push("/admin");
        } else if (profile?.role === "company") {
          router.push("/company");
        } else {
          router.push("/app");
        }
        router.refresh();
      }
    } catch {
      setError("ログイン処理中にエラーが発生しました。Supabase接続設定を確認してください。");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      const supabase = createClient();
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${appUrl}/login`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setInfoMessage("パスワード再設定用のメールを送信しました。メール内のリンクをご確認ください。");
      }
    } catch {
      setError("パスワードリセット送信に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2.5 mb-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              JavaSkill<span className="text-blue-400">Studio</span>
            </span>
          </Link>
          <p className="text-sm text-slate-400">
            受講生・企業担当者・講師 共通ログイン
          </p>
        </div>

        <Card className="border-slate-800 bg-slate-950/90 text-slate-100 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl">
              {resetMode ? "パスワードの再設定" : "アカウントにログイン"}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {resetMode
                ? "登録済みのメールアドレスを入力してください。再設定リンクを送信します。"
                : "登録したメールアドレスとパスワードを入力してください。"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {infoMessage && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>{infoMessage}</span>
              </div>
            )}

            {!resetMode ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    メールアドレス
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                      <KeyRound className="h-3.5 w-3.5 text-slate-400" />
                      パスワード
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setResetMode(true);
                        setError(null);
                        setInfoMessage(null);
                      }}
                      className="text-xs text-blue-400 hover:underline"
                    >
                      パスワードをお忘れですか？
                    </button>
                  </div>
                  <Input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "ログイン中..." : "ログイン"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    登録メールアドレス
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "送信中..." : "再設定メールを送信"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-slate-400 hover:text-white"
                  onClick={() => setResetMode(false)}
                >
                  ログイン画面に戻る
                </Button>
              </form>
            )}

            <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
              アカウントをお持ちでない方は{" "}
              <Link href="/signup" className="text-blue-400 font-semibold hover:underline">
                新規登録（企業コード対応）
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
