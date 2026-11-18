"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export default function StudentSignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
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
        router.push("/student");
        router.refresh();
      } else {
        setSuccessMsg(
          "確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。"
        );
      }
    } catch {
      setError(
        "登録処理中にエラーが発生しました。環境変数設定を確認してください。"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
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
            受講生アカウント新規登録 (/student/signup)
          </span>
        </div>

        <Card className="border-slate-800 bg-slate-900/90 text-slate-100 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl">新規受講生登録</CardTitle>
            <CardDescription className="text-slate-400">
              所属企業（テナント）から配布された「企業コード」を入力すると、自動的に企業テナントへ紐付きます。
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
                  placeholder="taro.yamada@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-slate-400" />
                  パスワード（6文字以上）
                </label>
                <Input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                  テナント企業コード（法人研修の方は入力）
                </label>
                <Input
                  type="text"
                  placeholder="例: ACME2025"
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value)}
                  className="bg-slate-950 border-slate-700 text-white uppercase"
                />
                <p className="text-[11px] text-slate-400">
                  ※ サンプル企業コード:{" "}
                  <code className="text-emerald-400">ACME2025</code> または{" "}
                  <code className="text-emerald-400">TECH2025</code>
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? "アカウント作成中..."
                  : "受講生アカウントを作成して開始"}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
              すでにアカウントをお持ちの受講生は{" "}
              <Link
                href="/student/login"
                className="text-blue-400 font-semibold hover:underline"
              >
                受講生ログイン
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
