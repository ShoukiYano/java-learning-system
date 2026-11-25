"use client";

/**
 * ファイル概要：
 * テナント（導入企業）管理・企業コード発行画面クライアントコンポーネント
 *
 * 主な処理：
 * - 登録済み企業テナント一覧と所属受講生数の表示
 * - 新規テナント登録・企業コード自動生成および担当者招待
 * - テナント詳細・編集画面（/admin/companies/[companyId]）への遷移導線
 */

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  AlertTriangle,
  Settings,
  ArrowRight,
  Copy,
  Check,
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
  const router = useRouter();
  const [companies, setCompanies] =
    useState<CompanyListItem[]>(initialCompanies);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedCreds, setGeneratedCreds] = useState<{
    companyName: string;
    email: string;
    password: string;
  } | null>(null);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const handleCopyPassword = async () => {
    if (!generatedCreds?.password) return;
    try {
      await navigator.clipboard.writeText(generatedCreds.password);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    } catch {
      // clipboard API unavailable
    }
  };

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
    setErrorMsg(null);
    setGeneratedCreds(null);
    setCopiedPassword(false);

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
          },
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMsg(
          data.error ||
            "テナント企業のDB登録に失敗しました。企業コードの重複や権限設定を確認してください。"
        );
        return;
      }

      const item: CompanyListItem = {
        id: data.company?.id ?? `comp-${Date.now()}`,
        name: data.company?.name ?? name.trim(),
        company_code: data.company?.company_code ?? code.trim().toUpperCase(),
        contact_email: data.company?.contact_email ?? contactEmail.trim(),
        studentCount: 0,
      };
      setCompanies((prev) => [item, ...prev]);
      setName("");
      setCode("");
      setContactEmail("");
      if (data.accountError) {
        setErrorMsg(
          `テナント企業「${item.name}」は登録されましたが、企業担当者アカウントの自動発行に失敗しました：${data.accountError}（企業詳細画面から担当者アカウントを追加してください）`
        );
      } else {
        if (data.accountCreated && typeof data.generatedPassword === "string" && data.generatedPassword) {
          setGeneratedCreds({
            companyName: item.name,
            email: item.contact_email,
            password: data.generatedPassword,
          });
        }
        setNotice(
          data.accountCreated
            ? `✅ テナント企業「${item.name}」（企業コード: ${item.company_code}）をDBに登録し、企業担当者アカウント（${item.contact_email}）を自動発行しました。`
            : `✅ テナント企業「${item.name}」（企業コード: ${item.company_code}）をデータベースに登録しました。`
        );
      }
      router.refresh();
    } catch {
      setErrorMsg("企業登録中に通信エラーが発生しました。");
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

      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {generatedCreds && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="font-bold flex items-center gap-1.5">
              <Key className="h-4 w-4 text-amber-700 shrink-0" />
              <span>
                発行された初期パスワード（{generatedCreds.companyName} / {generatedCreds.email}）
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-amber-900 hover:bg-amber-100"
              onClick={() => setGeneratedCreds(null)}
            >
              閉じる
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <code className="px-3 py-1.5 rounded bg-slate-900 text-emerald-300 font-mono text-sm font-bold select-all">
              {generatedCreds.password}
            </code>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 bg-white"
              onClick={handleCopyPassword}
            >
              {copiedPassword ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  コピーしました
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  パスワードをコピー
                </>
              )}
            </Button>
          </div>
          <p className="text-amber-900 font-medium">
            ※ この初期パスワードはセキュリティ上、今回限り表示され再表示できません。必ず控えて企業担当者へ安全に共有し、初回ログイン後に変更するよう案内してください。
          </p>
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
