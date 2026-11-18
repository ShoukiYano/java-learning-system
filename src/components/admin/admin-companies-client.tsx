"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Key,
  Mail,
  Plus,
  CheckCircle2,
  Settings,
  ArrowRight,
} from "lucide-react";

export interface CompanyListItem {
  id: string;
  name: string;
  company_code: string;
  contact_email: string;
  studentCount: number;
}

export function AdminCompaniesClient({
  initialCompanies,
}: {
  initialCompanies: CompanyListItem[];
}) {
  const [companies, setCompanies] =
    useState<CompanyListItem[]>(initialCompanies);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const generateRandomCode = () => {
    const prefix = name
      ? name.replace(/[^A-Za-z]/g, "").slice(0, 4).toUpperCase() || "CORP"
      : "DEV";
    const num = Math.floor(1000 + Math.random() * 9000);
    setCode(`${prefix}${num}`);
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || saving) return;
    setSaving(true);
    setNotice(null);

    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_company",
          payload: {
            name: name.trim(),
            company_code: code.trim().toUpperCase(),
            contact_email: contactEmail.trim(),
            initial_password: "Password123!",
          },
        }),
      });
      const data = await res.json();

      const item: CompanyListItem = {
        id: data.company?.id ?? `comp-${Date.now()}`,
        name: name.trim(),
        company_code: code.trim().toUpperCase(),
        contact_email: contactEmail.trim(),
        studentCount: 0,
      };
      setCompanies((prev) => [item, ...prev]);
      setName("");
      setCode("");
      setContactEmail("");
      setNotice(
        data.accountCreated
          ? `✅ テナント企業「${item.name}」（企業コード: ${item.company_code}）をDBに登録し、企業担当者アカウント（${item.contact_email} / 初期パスワード: Password123!）を自動発行しました！`
          : `✅ テナント企業「${item.name}」（企業コード: ${item.company_code}）をデータベースに登録しました。`
      );
    } catch {
      setNotice("企業登録中にエラーが発生しました。");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          テナント（導入企業）管理・企業コード発行・企業担当者招待
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          新規テナントの登録や、既存テナントの詳細確認・基本情報編集・企業別カリキュラム表示設定・所属受講生の確認を行えます。
        </p>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="h-4 w-4 text-indigo-600" />
            新規テナント企業の登録＆企業コード発行
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreateCompany}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">テナント企業名</label>
              <Input
                required
                placeholder="株式会社サンプルIT"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">企業コード</label>
              <div className="flex gap-2">
                <Input
                  required
                  placeholder="SAMPLE2025"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="uppercase font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateRandomCode}
                >
                  自動生成
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">
                企業担当者メールアドレス（招待先）
              </label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  required
                  placeholder="hr@sample.co.jp"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
                <Button type="submit" disabled={saving}>
                  {saving ? "登録中..." : "登録・招待"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {companies.map((c) => (
          <Card
            key={c.id}
            className="hover:border-indigo-300 transition shadow-sm"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span className="truncate">{c.name}</span>
                </CardTitle>
                <Badge variant="outline" className="shrink-0">
                  受講生 {c.studentCount} 名
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-1.5 text-xs pt-1">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  担当者: {c.contact_email || "未設定"}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-2 border-t text-xs">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-emerald-600" />
                <span>企業コード:</span>
                <code className="px-2.5 py-1 rounded bg-slate-900 text-emerald-300 font-mono font-bold">
                  {c.company_code}
                </code>
              </div>

              <Link
                href={`/admin/companies/${c.id}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition shadow-sm"
              >
                <Settings className="h-3.5 w-3.5" />
                詳細・編集
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
