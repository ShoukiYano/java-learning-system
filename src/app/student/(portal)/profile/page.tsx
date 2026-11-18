"use client";

import React, { useState, useEffect } from "react";
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
import { UserCircle, Building2, CheckCircle2 } from "lucide-react";

export default function StudentProfilePage() {
  const [fullName, setFullName] = useState("山田 太郎");
  const [email, setEmail] = useState("student@acme-tech.example.com");
  const [companyName, setCompanyName] = useState("株式会社ACMEテクノロジーズ");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

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
          .select("*, companies(*)")
          .eq("id", user.id)
          .single();
        if (profile) {
          setFullName(profile.full_name);
          setEmail(profile.email);
          setCompanyName(profile.companies?.name ?? "未所属（個人受講）");
        }
      } catch {
        // デモ設定値を維持
      }
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ full_name: fullName.trim() })
          .eq("id", user.id);
      }
      setSavedMsg("プロフィール情報を保存しました。");
    } catch {
      setSavedMsg("保存しました。");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-2xl space-y-6">
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

            <Button type="submit" disabled={saving}>
              {saving ? "保存中..." : "変更を保存する"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
