"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserRole } from "@/types/database";
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
  ShieldAlert,
  KeyRound,
  Mail,
  AlertCircle,
  CheckCircle2,
  Lock,
  Loader2,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

interface RoleLoginFormProps {
  expectedRole: UserRole;
  portalTitle: string;
  portalSubtitle: string;
  badgeText: string;
  accentColor: "blue" | "emerald" | "indigo";
  targetHomePath: "/student" | "/company" | "/admin";
}

export function RoleLoginForm({
  expectedRole,
  portalTitle,
  portalSubtitle,
  badgeText,
  accentColor,
  targetHomePath,
}: RoleLoginFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [adminPin, setAdminPin] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const isBusy = loading || redirecting || isPending;

  const colorMap = {
    blue: {
      iconBg: "bg-blue-600",
      textAccent: "text-blue-400",
      badgeBg: "bg-blue-500/15 text-blue-300 border-blue-500/30",
      btnClass: "bg-blue-600 hover:bg-blue-500 text-white",
    },
    emerald: {
      iconBg: "bg-emerald-600",
      textAccent: "text-emerald-400",
      badgeBg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      btnClass: "bg-emerald-600 hover:bg-emerald-500 text-white",
    },
    indigo: {
      iconBg: "bg-indigo-600",
      textAccent: "text-indigo-400",
      badgeBg: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
      btnClass: "bg-indigo-600 hover:bg-indigo-500 text-white",
    },
  }[accentColor];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBusy) return;
    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      // サーバーサイドの高セキュリティ認証API（ブルートフォースロック＋多要素チェック＋Cookieセッション確立）を呼び出す
      const res = await fetch("/api/auth/secure-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          expectedRole,
          companyCode: expectedRole === "company" ? companyCode : undefined,
          adminPin: expectedRole === "admin" ? adminPin : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "認証に失敗しました。");
        setLoading(false);
        return;
      }

      setRedirecting(true);
      startTransition(() => {
        router.push(targetHomePath);
        router.refresh();
      });
    } catch {
      setError("ログイン処理中に通信エラーが発生しました。");
      setLoading(false);
      setRedirecting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      const supabase = createClient();
      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${appUrl}${targetHomePath}/login`,
        }
      );

      if (resetError) {
        setError(resetError.message);
      } else {
        setInfoMessage(
          "パスワード再設定用のメールを送信しました。メール内のリンクをご確認ください。"
        );
      }
    } catch {
      setError("パスワードリセット送信に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      {/* 認証・画面遷移中のフルスクリーン・フィードバックオーバーレイ */}
      {isBusy && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 animate-in fade-in duration-150">
          <div
            className={`h-12 w-12 rounded-2xl ${colorMap.iconBg} flex items-center justify-center shadow-xl`}
          >
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-bold text-white">
              {redirecting
                ? "セキュリティ認証完了！画面を移動しています..."
                : "セキュリティ検証・ログイン確認を行っています..."}
            </p>
            <p className="text-xs text-slate-400">
              そのまま少々お待ちください
            </p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md space-y-6">
        {/* 受講生ログイン画面（student）のみ「トップページに戻る」ボタンを表示 */}
        {expectedRole === "student" && (
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              トップページに戻る
            </Link>
          </div>
        )}

        <div className="flex flex-col items-center text-center">
          {expectedRole === "student" ? (
            <Link
              href="/"
              className="flex items-center gap-2.5 mb-3 hover:opacity-90 transition"
            >
              <div
                className={`h-10 w-10 rounded-xl ${colorMap.iconBg} flex items-center justify-center shadow-lg`}
              >
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                DevSkill<span className={colorMap.textAccent}>Studio</span>
              </span>
            </Link>
          ) : (
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className={`h-10 w-10 rounded-xl ${colorMap.iconBg} flex items-center justify-center shadow-lg`}
              >
                {expectedRole === "company" && (
                  <Building2 className="h-6 w-6 text-white" />
                )}
                {expectedRole === "admin" && (
                  <ShieldAlert className="h-6 w-6 text-white" />
                )}
              </div>
              <span className="text-xl font-bold text-white">
                DevSkill<span className={colorMap.textAccent}>Studio</span>
              </span>
            </div>
          )}

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${colorMap.badgeBg}`}
          >
            {badgeText}
          </span>
        </div>

        <Card className="border-slate-800 bg-slate-900/90 text-slate-100 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Lock className="h-4 w-4 text-slate-400" />
              {resetMode ? "パスワードの再設定" : portalTitle}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {resetMode
                ? "登録済みのメールアドレスを入力してください。再設定リンクを送信します。"
                : portalSubtitle}
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
                {/* ★ 企業担当者専用：自社テナント企業コードの必須入力 */}
                {expectedRole === "company" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-emerald-300 flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                      テナント企業コード（必須）
                    </label>
                    <Input
                      type="text"
                      required
                      disabled={isBusy}
                      placeholder="例: ACME2025"
                      value={companyCode}
                      onChange={(e) =>
                        setCompanyCode(e.target.value.toUpperCase())
                      }
                      className="bg-slate-950 border-slate-700 text-white uppercase font-mono"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    メールアドレス
                  </label>
                  <Input
                    type="email"
                    required
                    disabled={isBusy}
                    placeholder="メールアドレスを入力"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-950 border-slate-700 text-white"
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
                      disabled={isBusy}
                      onClick={() => {
                        setResetMode(true);
                        setError(null);
                        setInfoMessage(null);
                      }}
                      className={`text-xs ${colorMap.textAccent} hover:underline`}
                    >
                      パスワードをお忘れですか？
                    </button>
                  </div>
                  <Input
                    type="password"
                    required
                    disabled={isBusy}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-950 border-slate-700 text-white"
                  />
                </div>

                {/* ★ システム管理者専用：管理者マスターセキュリティPINの必須入力 */}
                {expectedRole === "admin" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-indigo-300 flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                      管理者セキュリティPIN（必須）
                    </label>
                    <Input
                      type="password"
                      required
                      disabled={isBusy}
                      placeholder="セキュリティPINコードを入力"
                      value={adminPin}
                      onChange={(e) => setAdminPin(e.target.value)}
                      className="bg-slate-950 border-indigo-500/50 text-white font-mono tracking-widest"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className={`w-full ${colorMap.btnClass}`}
                  disabled={isBusy}
                >
                  {isBusy ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {redirecting ? "画面を移動中..." : "認証中..."}
                    </>
                  ) : (
                    "ログイン"
                  )}
                </Button>

                {(expectedRole === "admin" || expectedRole === "company") && (
                  <p className="text-[11px] text-slate-500 text-center pt-1">
                    🔒 セキュリティ保護：5回連続で認証に失敗すると15分間ロックされます
                  </p>
                )}
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
                    disabled={isBusy}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-950 border-slate-700 text-white"
                  />
                </div>
                <Button
                  type="submit"
                  className={`w-full ${colorMap.btnClass}`}
                  disabled={isBusy}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      送信中...
                    </>
                  ) : (
                    "再設定メールを送信"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isBusy}
                  className="w-full text-slate-400 hover:text-white"
                  onClick={() => setResetMode(false)}
                >
                  ログイン画面に戻る
                </Button>
              </form>
            )}

            {expectedRole === "student" && (
              <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
                アカウントをお持ちでない方は{" "}
                <Link
                  href="/student/signup"
                  className="text-blue-400 font-semibold hover:underline"
                >
                  新規受講登録（企業コード対応）
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
