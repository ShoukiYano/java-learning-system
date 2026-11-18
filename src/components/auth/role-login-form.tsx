"use client";

import React, { useState } from "react";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const colorMap = {
    blue: {
      iconBg: "bg-blue-600",
      textAccent: "text-blue-400",
      badgeBg: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    },
    emerald: {
      iconBg: "bg-emerald-600",
      textAccent: "text-emerald-400",
      badgeBg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    },
    indigo: {
      iconBg: "bg-indigo-600",
      textAccent: "text-indigo-400",
      badgeBg: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    },
  }[accentColor];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      const supabase = createClient();
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError || !data.user) {
        setError("メールアドレスまたはパスワードが正しくありません。");
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      const actualRole: UserRole = (profile?.role as UserRole) ?? "student";

      // ★ セキュリティ制御：ログイン窓口のロールと実際のアカウントロールが異なる場合は遮断
      // （ただしシステム管理者 admin のみ検証目的で全ポータル通過を許可するか、厳格にロール一致を要求）
      if (actualRole !== expectedRole) {
        await supabase.auth.signOut();
        const roleNameMap: Record<UserRole, string> = {
          student: "受講生（/student/login）",
          company: "企業担当者（/company/login）",
          admin: "システム管理者（/admin/login）",
        };
        setError(
          `アクセス拒否：このアカウントは「${roleNameMap[actualRole]}」用です。セキュリティ保護のため、正しい専用ログインURLからログインしてください。`
        );
        setLoading(false);
        return;
      }

      await supabase
        .from("profiles")
        .update({ last_login_at: new Date().toISOString() })
        .eq("id", data.user.id);

      router.push(targetHomePath);
      router.refresh();
    } catch {
      setError(
        "ログイン処理中にエラーが発生しました。Supabase接続設定を確認してください。"
      );
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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2.5 mb-3">
            <div
              className={`h-10 w-10 rounded-xl ${colorMap.iconBg} flex items-center justify-center shadow-lg`}
            >
              {expectedRole === "student" && (
                <Code2 className="h-6 w-6 text-white" />
              )}
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
          </Link>

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
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    メールアドレス
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder={`${expectedRole}@example.com`}
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
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-950 border-slate-700 text-white"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "認証中..." : `${portalTitle}へログイン`}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-950 border-slate-700 text-white"
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

            {expectedRole === "student" && (
              <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
                新規の受講生の方は{" "}
                <Link
                  href="/student/signup"
                  className="text-blue-400 font-semibold hover:underline"
                >
                  受講生新規登録（企業コード対応）
                </Link>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>別ロールの専用ログイン窓口:</span>
              <div className="flex items-center gap-3">
                {expectedRole !== "student" && (
                  <Link href="/student/login" className="hover:text-slate-300">
                    受講生
                  </Link>
                )}
                {expectedRole !== "company" && (
                  <Link href="/company/login" className="hover:text-slate-300">
                    企業担当者
                  </Link>
                )}
                {expectedRole !== "admin" && (
                  <Link href="/admin/login" className="hover:text-slate-300">
                    管理者
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
