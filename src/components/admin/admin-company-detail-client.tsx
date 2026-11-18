"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StudentAnalyticsRecord } from "@/lib/mock-analytics";
import { exportStudentsProgressToCsv } from "@/lib/csv-export";
import { AdminCourseItem, AdminCompanyBasic } from "./admin-courses-client";
import { CompanyManager } from "@/types/database";
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
import { ProgressBar } from "@/components/ui/progress";
import {
  ArrowLeft,
  Building2,
  Save,
  Trash2,
  BookOpen,
  Users,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Mail,
  ArrowRight,
  Loader2,
  Download,
  UserCheck,
  Plus,
  Lock,
  Edit2,
  X,
  ShieldCheck,
} from "lucide-react";

export function AdminCompanyDetailClient({
  company,
  students,
  courses,
  initialCourseVisibility,
  initialManagers = [],
}: {
  company: AdminCompanyBasic;
  students: StudentAnalyticsRecord[];
  courses: AdminCourseItem[];
  initialCourseVisibility: Record<string, boolean>;
  initialManagers?: CompanyManager[];
}) {
  const router = useRouter();
  const [name, setName] = useState(company.name);
  const [companyCode, setCompanyCode] = useState(company.company_code);
  const [contactEmail, setContactEmail] = useState(company.contact_email);
  const [newManagerPassword, setNewManagerPassword] = useState("");
  const [courseVisibility, setCourseVisibility] = useState<
    Record<string, boolean>
  >(initialCourseVisibility);

  // 企業担当者（マネージャー）アカウント管理用の state
  const [managers, setManagers] = useState<CompanyManager[]>(initialManagers);
  const [isAddingManager, setIsAddingManager] = useState(false);
  const [newMgrName, setNewMgrName] = useState("");
  const [newMgrEmail, setNewMgrEmail] = useState("");
  const [newMgrPassword, setNewMgrPassword] = useState("");
  const [mgrSubmitting, setMgrSubmitting] = useState(false);

  // パスワード再設定用 state
  const [resettingMgrId, setResettingMgrId] = useState<string | null>(null);
  const [resetPasswordInput, setResetPasswordInput] = useState("");

  // 編集用 state
  const [editingMgrId, setEditingMgrId] = useState<string | null>(null);
  const [editMgrName, setEditMgrName] = useState("");
  const [editMgrEmail, setEditMgrEmail] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. 担当者の新規追加
  const handleCreateManager = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMgrEmail.trim() || !newMgrPassword.trim() || mgrSubmitting) return;
    setMgrSubmitting(true);
    setNotice(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_company_manager",
          payload: {
            companyId: company.id,
            fullName: newMgrName.trim() || `${name} 研修担当者`,
            email: newMgrEmail.trim(),
            password: newMgrPassword.trim(),
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "担当者アカウントの作成に失敗しました。");
      }

      const created: CompanyManager = data.manager ?? {
        id: `mgr-${Date.now()}`,
        email: newMgrEmail.trim(),
        full_name: newMgrName.trim() || `${name} 研修担当者`,
        role: "company",
        company_id: company.id,
        created_at: new Date().toISOString(),
        last_login_at: null,
      };

      setManagers((prev) => [...prev.filter((m) => m.email !== created.email), created]);
      setNewMgrName("");
      setNewMgrEmail("");
      setNewMgrPassword("");
      setIsAddingManager(false);
      setNotice(
        `✅ 企業担当者「${created.full_name} (${created.email})」のアカウントを発行しました。企業コード「${companyCode}」と設定したパスワードで企業ポータル（/company/login）にログインできます。`
      );
      router.refresh();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "作成エラーが発生しました。");
    } finally {
      setMgrSubmitting(false);
    }
  };

  // 2. 担当者のパスワード再設定
  const handleResetPassword = async (managerId: string, email: string) => {
    if (!resetPasswordInput.trim() || resetPasswordInput.trim().length < 6) {
      setErrorMsg("パスワードは6文字以上で入力してください。");
      return;
    }
    setMgrSubmitting(true);
    setNotice(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset_company_manager_password",
          payload: {
            managerId,
            email,
            newPassword: resetPasswordInput.trim(),
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "パスワードの再設定に失敗しました。");
      }

      setResettingMgrId(null);
      setResetPasswordInput("");
      setNotice(
        `✅ 担当者（${email}）のログインパスワードを再設定しました。企業コード「${companyCode}」と新パスワードで企業ポータル（/company/login）へログイン可能です。`
      );
      router.refresh();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "更新エラーが発生しました。");
    } finally {
      setMgrSubmitting(false);
    }
  };

  // 3. 担当者の氏名・メールアドレス更新
  const handleUpdateManager = async (managerId: string) => {
    if (!editMgrEmail.trim() || !editMgrName.trim()) return;
    setMgrSubmitting(true);
    setNotice(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_company_manager",
          payload: {
            managerId,
            fullName: editMgrName.trim(),
            email: editMgrEmail.trim(),
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "更新に失敗しました。");
      }

      setManagers((prev) =>
        prev.map((m) =>
          m.id === managerId
            ? { ...m, full_name: editMgrName.trim(), email: editMgrEmail.trim() }
            : m
        )
      );
      setEditingMgrId(null);
      setNotice(`✅ 担当者情報を更新しました。`);
      router.refresh();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "更新エラーが発生しました。");
    } finally {
      setMgrSubmitting(false);
    }
  };

  // 4. 担当者アカウントの削除
  const handleDeleteManager = async (managerId: string, email: string) => {
    if (!confirm(`担当者アカウント「${email}」を削除してもよろしいですか？\n削除すると企業ポータルにログインできなくなります。`)) {
      return;
    }
    setMgrSubmitting(true);
    setNotice(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_company_manager",
          payload: { managerId },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "削除に失敗しました。");
      }

      setManagers((prev) => prev.filter((m) => m.id !== managerId));
      setNotice(`✅ 担当者アカウント（${email}）を削除しました。`);
      router.refresh();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "削除エラーが発生しました。");
    } finally {
      setMgrSubmitting(false);
    }
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !companyCode.trim() || saving) return;
    setSaving(true);
    setNotice(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_company",
          payload: {
            companyId: company.id,
            name: name.trim(),
            company_code: companyCode.trim().toUpperCase(),
            contact_email: contactEmail.trim(),
            new_manager_password: newManagerPassword.trim() || undefined,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "更新に失敗しました。");
      } else {
        setNewManagerPassword("");
        setNotice(
          data.managerUpdated
            ? `✅ テナント情報（${name} / コード: ${companyCode.toUpperCase()}）および企業担当者アカウントのパスワードを更新しました。`
            : `✅ テナント情報（${name} / コード: ${companyCode.toUpperCase()}）を保存しました。`
        );
        router.refresh();
      }
    } catch {
      setErrorMsg("保存中に通信エラーが発生しました。");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleCourseVisibility = async (
    courseId: string,
    courseTitle: string
  ) => {
    const current = courseVisibility[courseId] ?? true;
    const nextVal = !current;
    setCourseVisibility((prev) => ({
      ...prev,
      [courseId]: nextVal,
    }));

    await fetch("/api/admin/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "toggle_company_course_visibility",
        payload: {
          companyId: company.id,
          courseId,
          is_visible: nextVal,
        },
      }),
    });

    setNotice(
      `「${name}」に対する「${courseTitle}」の表示設定を【${
        nextVal ? "ON（表示）" : "OFF（非表示）"
      }】に更新しました。`
    );
  };

  const handleDeleteCompany = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_company",
          payload: { companyId: company.id },
        }),
      });
      if (res.ok) {
        router.push("/admin/companies");
        router.refresh();
      } else {
        setErrorMsg("テナント削除に失敗しました。");
        setDeleting(false);
      }
    } catch {
      setErrorMsg("通信エラーが発生しました。");
      setDeleting(false);
    }
  };

  const avgProgress =
    students.length > 0
      ? Math.round(
          students.reduce((a, c) => a + c.progressPercent, 0) / students.length
        )
      : 0;

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/companies"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          テナント企業一覧へ戻る
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant="outline">所属受講生: {students.length} 名</Badge>
          <Badge variant="default">平均進捗: {avgProgress}%</Badge>
          <Button
            type="button"
            size="sm"
            onClick={() =>
              exportStudentsProgressToCsv(
                students,
                `tenant_report_${companyCode}`
              )
            }
            className="bg-emerald-700 hover:bg-emerald-600 text-white"
          >
            <Download className="h-3.5 w-3.5" />
            この企業の受講生進捗をCSV出力
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Building2 className="h-6 w-6 text-indigo-600" />
          {name} — テナント詳細・編集
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          企業情報や企業コードの編集、担当者アカウントのパスワード再設定、この企業に公開するカリキュラムのON/OFF、所属受講生の進捗を一元管理できます。
        </p>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左カラム：テナント基本情報の編集 ＆ カリキュラム表示トグル */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                1. テナント基本情報・企業コード編集
              </CardTitle>
              <CardDescription className="text-xs">
                企業名・企業コード・企業担当者連絡先を変更して保存できます。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveCompany} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    テナント企業名
                  </label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    配布用企業コード（受講生登録・企業ログインで使用）
                  </label>
                  <Input
                    required
                    value={companyCode}
                    onChange={(e) =>
                      setCompanyCode(e.target.value.toUpperCase())
                    }
                    className="uppercase font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    企業担当者メールアドレス
                  </label>
                  <Input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="hr@example.com"
                  />
                </div>

                <div className="space-y-1.5 pt-2 border-t">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <KeyRound className="h-3.5 w-3.5 text-indigo-600" />
                    企業担当者ログイン用パスワードの再設定（任意）
                  </label>
                  <Input
                    type="password"
                    minLength={6}
                    value={newManagerPassword}
                    onChange={(e) => setNewManagerPassword(e.target.value)}
                    placeholder="変更する場合のみ6文字以上で入力"
                  />
                  <p className="text-[11px] text-slate-400">
                    ※ 入力して保存すると、上記メールアドレスの企業担当者アカウントを作成（またはパスワード更新）します。
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        保存中...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        変更を保存する
                      </>
                    )}
                  </Button>

                  {!confirmDelete ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmDelete(true)}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      テナント削除
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={deleting}
                        onClick={handleDeleteCompany}
                      >
                        {deleting ? "削除中..." : "本当に削除する"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmDelete(false)}
                      >
                        キャンセル
                      </Button>
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* カリキュラム（コース）表示／非表示トグルカード */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald-600" />
                2. この企業に公開するカリキュラム設定
              </CardTitle>
              <CardDescription className="text-xs">
                トグルでON/OFFを切り替えると、この企業の受講生と企業担当者の画面に即時反映されます。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {courses.map((crs) => {
                const isVisible = courseVisibility[crs.id] ?? true;
                return (
                  <div
                    key={crs.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                      isVisible
                        ? "bg-emerald-50/40 border-emerald-200"
                        : "bg-slate-100 border-slate-200 opacity-75"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900">
                        {crs.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        収録問題: {crs.problemCount} 問 ・ 状態:{" "}
                        <strong
                          className={
                            isVisible ? "text-emerald-700" : "text-slate-500"
                          }
                        >
                          {isVisible ? "表示（受講可能）" : "非表示"}
                        </strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={isVisible}
                      onClick={() =>
                        handleToggleCourseVisibility(crs.id, crs.title)
                      }
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isVisible ? "bg-emerald-600" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isVisible ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* 右カラム：企業担当者ユーザー管理 ＆ 所属受講生一覧 */}
        <div className="lg:col-span-7 space-y-6">
          {/* ★ 2. 企業担当者（マネージャー）ユーザー管理（新規作成・PW再設定） */}
          <Card className="border-indigo-100 shadow-sm">
            <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50/70 via-white to-slate-50 border-b">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base flex items-center gap-2 text-indigo-950 font-bold">
                    <UserCheck className="h-4 w-4 text-indigo-600" />
                    2. 企業担当者（マネージャー）ユーザー管理（{managers.length} 名）
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-600 mt-1">
                    企業ポータル（/company/login）へログインできる担当者アカウントです。メールアドレスやパスワードの設定・再設定が可能です。
                  </CardDescription>
                </div>

                {!isAddingManager && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      setIsAddingManager(true);
                      setNewMgrName(`${name} 研修担当`);
                      setNewMgrEmail("");
                      setNewMgrPassword("");
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white gap-1 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    担当者アカウントを追加
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {/* 新規担当者アカウント追加フォーム */}
              {isAddingManager && (
                <form
                  onSubmit={handleCreateManager}
                  className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                      <Plus className="h-3.5 w-3.5 text-indigo-600" />
                      新規企業担当者の登録・アカウント発行
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAddingManager(false)}
                      className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700">
                        担当者氏名・部署名
                      </label>
                      <Input
                        required
                        value={newMgrName}
                        onChange={(e) => setNewMgrName(e.target.value)}
                        placeholder="例: 人事部 研修担当 山田"
                        className="bg-white text-xs h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700">
                        ログイン用メールアドレス
                      </label>
                      <Input
                        required
                        type="email"
                        value={newMgrEmail}
                        onChange={(e) => setNewMgrEmail(e.target.value)}
                        placeholder="hr@example.com"
                        className="bg-white text-xs h-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">
                      初期パスワード（6文字以上）
                    </label>
                    <Input
                      required
                      type="password"
                      minLength={6}
                      value={newMgrPassword}
                      onChange={(e) => setNewMgrPassword(e.target.value)}
                      placeholder="6文字以上の強固なパスワード"
                      className="bg-white text-xs h-9 font-mono"
                    />
                    <p className="text-[10px] text-slate-500">
                      ※ 企業側ログイン画面（/company/login）で、企業コード「<strong>{companyCode}</strong>」と上記メール・パスワードを入力してログインします。
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddingManager(false)}
                      className="text-xs h-8"
                    >
                      キャンセル
                    </Button>
                    <Button
                      type="submit"
                      disabled={mgrSubmitting}
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-8 gap-1.5"
                    >
                      {mgrSubmitting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <ShieldCheck className="h-3.5 w-3.5" />
                      )}
                      アカウントを発行する
                    </Button>
                  </div>
                </form>
              )}

              {/* 担当者一覧 */}
              {managers.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  担当者アカウントがまだ登録されていません。「担当者アカウントを追加」ボタンから発行してください。
                </div>
              ) : (
                <div className="divide-y border rounded-xl overflow-hidden bg-white">
                  {managers.map((mgr) => {
                    const isResetting = resettingMgrId === mgr.id;
                    const isEditing = editingMgrId === mgr.id;

                    return (
                      <div key={mgr.id} className="p-3.5 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900">
                                {mgr.full_name}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-slate-50 text-indigo-700 border-indigo-200"
                              >
                                企業担当者
                              </Badge>
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-2">
                              <span>{mgr.email}</span>
                              <span className="text-slate-300">・</span>
                              <span>
                                最終ログイン:{" "}
                                {mgr.last_login_at
                                  ? mgr.last_login_at.slice(0, 16).replace("T", " ")
                                  : "未ログイン"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={mgrSubmitting}
                              onClick={() => {
                                setResettingMgrId(isResetting ? null : mgr.id);
                                setResetPasswordInput("");
                                setEditingMgrId(null);
                              }}
                              className="h-7 text-xs gap-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                            >
                              <KeyRound className="h-3 w-3 text-indigo-600" />
                              パスワード再設定
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={mgrSubmitting}
                              onClick={() => {
                                setEditingMgrId(isEditing ? null : mgr.id);
                                setEditMgrName(mgr.full_name);
                                setEditMgrEmail(mgr.email);
                                setResettingMgrId(null);
                              }}
                              className="h-7 w-7 p-0 text-slate-500 hover:text-slate-800"
                              title="編集"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={mgrSubmitting}
                              onClick={() => handleDeleteManager(mgr.id, mgr.email)}
                              className="h-7 w-7 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                              title="削除"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>

                        {/* パスワード再設定フォーム（インライン） */}
                        {isResetting && (
                          <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                                <KeyRound className="h-3.5 w-3.5 text-amber-600" />
                                {mgr.email} のパスワード再設定
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setResettingMgrId(null)}
                                className="h-5 w-5 p-0 text-slate-400"
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              <Input
                                type="password"
                                minLength={6}
                                value={resetPasswordInput}
                                onChange={(e) =>
                                  setResetPasswordInput(e.target.value)
                                }
                                placeholder="新しいパスワード（6文字以上）"
                                className="bg-white text-xs h-8 flex-1 font-mono"
                              />
                              <Button
                                type="button"
                                disabled={
                                  mgrSubmitting || resetPasswordInput.length < 6
                                }
                                size="sm"
                                onClick={() =>
                                  handleResetPassword(mgr.id, mgr.email)
                                }
                                className="bg-amber-600 hover:bg-amber-500 text-white text-xs h-8 whitespace-nowrap"
                              >
                                {mgrSubmitting ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Save className="h-3.5 w-3.5" />
                                )}
                                パスワードを更新
                              </Button>
                            </div>
                            <p className="text-[10px] text-amber-800">
                              ※保存すると即座に認証情報が更新され、新パスワードで企業ポータルにログイン可能になります。
                            </p>
                          </div>
                        )}

                        {/* 氏名・メールアドレス編集フォーム（インライン） */}
                        {isEditing && (
                          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                <Edit2 className="h-3.5 w-3.5 text-indigo-600" />
                                担当者情報の編集
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingMgrId(null)}
                                className="h-5 w-5 p-0 text-slate-400"
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <Input
                                value={editMgrName}
                                onChange={(e) => setEditMgrName(e.target.value)}
                                placeholder="担当者氏名"
                                className="bg-white text-xs h-8"
                              />
                              <Input
                                type="email"
                                value={editMgrEmail}
                                onChange={(e) => setEditMgrEmail(e.target.value)}
                                placeholder="メールアドレス"
                                className="bg-white text-xs h-8"
                              />
                            </div>

                            <div className="flex justify-end gap-1.5 pt-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingMgrId(null)}
                                className="text-xs h-7"
                              >
                                キャンセル
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                disabled={mgrSubmitting}
                                onClick={() => handleUpdateManager(mgr.id)}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-7"
                              >
                                変更を保存
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3. 所属受講生一覧 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                3. 所属受講生一覧（{students.length} 名）
              </CardTitle>
              <CardDescription className="text-xs">
                企業コード「{companyCode}」で紐づいている受講生の学習進捗一覧です。
              </CardDescription>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-500 space-y-2">
                  <p>このテナント企業にはまだ受講生が登録されていません。</p>
                  <p>
                    受講生が新規登録画面（/student/signup）で企業コード{" "}
                    <code className="px-2 py-0.5 rounded bg-slate-900 text-emerald-300 font-mono">
                      {companyCode}
                    </code>{" "}
                    を入力すると自動でここに追加されます。
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {students.map((st) => (
                    <div
                      key={st.id}
                      className="py-3.5 first:pt-0 last:pb-0 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5 min-w-[180px]">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">
                            {st.fullName}
                          </span>
                          {st.isDelayed ? (
                            <Badge variant="destructive" className="text-[10px]">
                              遅れアラート
                            </Badge>
                          ) : (
                            <Badge variant="success" className="text-[10px]">
                              順調
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">{st.email}</div>
                      </div>

                      <div className="w-44 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">
                            {st.completedProblems}/{st.totalProblems}問
                          </span>
                          <span className="font-bold text-indigo-600">
                            {st.progressPercent}%
                          </span>
                        </div>
                        <ProgressBar value={st.progressPercent} />
                      </div>

                      <Link
                        href={`/admin/students/${st.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border bg-white hover:bg-slate-50 text-xs font-semibold text-indigo-600"
                      >
                        受講生詳細・評価
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
