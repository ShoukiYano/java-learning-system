"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Key, Mail, Plus, CheckCircle2 } from "lucide-react";

interface CompanyItem {
  id: string;
  name: string;
  company_code: string;
  contact_email: string;
  studentCount: number;
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<CompanyItem[]>([
    {
      id: "00000000-0000-4000-8000-000000000001",
      name: "株式会社ACMEテクノロジーズ",
      company_code: "ACME2025",
      contact_email: "hr@acme-tech.example.com",
      studentCount: 18,
    },
    {
      id: "00000000-0000-4000-8000-000000000002",
      name: "ネクストシステムズ株式会社",
      company_code: "TECH2025",
      contact_email: "training@next-sys.example.com",
      studentCount: 10,
    },
  ]);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const generateRandomCode = () => {
    const prefix = name
      ? name.replace(/[^A-Za-z]/g, "").slice(0, 4).toUpperCase() || "CORP"
      : "JAVA";
    const num = Math.floor(1000 + Math.random() * 9000);
    setCode(`${prefix}${num}`);
  };

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;
    const item: CompanyItem = {
      id: `comp-${Date.now()}`,
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
      `企業「${item.name}」（企業コード: ${item.company_code}）を登録し、担当者招待案内を発行しました。`
    );
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          企業登録・企業コード発行・企業担当者の招待
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          発行した企業コードを受講生が新規登録画面（/signup）で入力すると、自動的にその企業に紐付きます。
        </p>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="h-4 w-4 text-indigo-600" />
            新規企業の登録＆企業コード発行
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreateCompany}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">企業名</label>
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
                <Button type="submit">登録・招待</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {companies.map((c) => (
          <Card key={c.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-indigo-600" />
                  {c.name}
                </CardTitle>
                <Badge variant="outline">受講生 {c.studentCount} 名</Badge>
              </div>
              <CardDescription className="flex items-center gap-1.5 text-xs pt-1">
                <Mail className="h-3.5 w-3.5" />
                担当者: {c.contact_email}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-0 text-xs">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-emerald-600" />
                <span>配布用企業コード:</span>
                <code className="px-2.5 py-1 rounded bg-slate-900 text-emerald-300 font-mono font-bold">
                  {c.company_code}
                </code>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
