"use client";

import React, { useState, useEffect } from "react";
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
import { UserCircle, Building2, CheckCircle2, KeyRound, AlertCircle } from "lucide-react";

export default function StudentProfilePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  // パスワード変更用 state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, email, full_name, role, company_id, companies(id, name, company_code)")
          .eq("id", user.id)
          .single();
        if (profile) {
          setFullName(profile.full_name);
          setEmail(profile.email);
          const comp = Array.isArray(profile.companies)
            ? profile.companies[0]
            : profile.companies;
          setCompanyName(comp?.name ?? "未所属（個人受講）");
        }
      } catch {
        setFullName("山田 太郎");
        setEmail("student@acme-tech.example.com");
        setCompanyName("株式会社ACMEテクノロジーズ");
      } finally {
        setLoadingProfile(false);
      }
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg(null);
    setSaveErr(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { error: upErr } = await supabase
          .from("profiles")
          .update({ full_name: fullName.trim() })
          .eq("id", user.id);
        if (upErr) {
          setSaveErr(`保存に失敗しました: ${upErr.message}`);
          return;
        }
        router.refresh();
      }
      setSavedMsg("プロフィール情報を保存しました。");
    } catch {
      setSaveErr("保存中に通信エラーが発生しました。");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);

    if (newPassword.length < 8) {
      setPwError("新しいパスワードは8文字以上で入力してください。");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("確認用パスワードが一致しません。");
      return;
    }

    setPwSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwError(data.error || "パスワード変更に失敗しました。");
      } else {
        setPwSuccess(data.message || "パスワードを変更しました。");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPwError("通信エラーが発生しました。");
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">プロフィール編集</h1>
        <p className="text-sm text-slate-600 mt-1">
          氏名や所属企業（テナント）情報の確認・変更を行えます。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-blue-600" />
            受講生アカウント情報
          </CardTitle>
          <CardDescription>
            企業担当者ポータルに表示される受講生氏名を設定します。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {saveErr && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{saveErr}</span>
            </div>
          )}
          {savedMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{savedMsg}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                氏名
              </label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                メールアドレス（変更不可）
              </label>
              <Input value={email} disabled className="bg-slate-100" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-slate-500" />
                所属テナント企業
              </label>
              <Input value={companyName} disabled className="bg-slate-100" />
            </div>

            <Button type="submit" disabled={saving || loadingProfile}>
              {saving ? "保存中..." : "変更を保存する"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-indigo-600" />
            パスワード変更
          </CardTitle>
          <CardDescription>
            ログイン用パスワードを8文字以上の新しいパスワードへ変更できます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pwError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{pwError}</span>
            </div>
          )}
          {pwSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{pwSuccess}</span>
            </div>
          )}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                新しいパスワード（8文字以上）
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="8文字以上で入力"
                minLength={8}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                新しいパスワード（確認用）
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="もう一度入力してください"
                minLength={8}
                required
              />
            </div>
            <Button type="submit" disabled={pwSaving} variant="default">
              {pwSaving ? "変更中..." : "パスワードを変更する"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
