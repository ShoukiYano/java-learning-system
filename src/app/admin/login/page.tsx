import React from "react";
import { RoleLoginForm } from "@/components/auth/role-login-form";

export default function AdminLoginPage() {
  return (
    <RoleLoginForm
      expectedRole="admin"
      portalTitle="システム管理者ポータル ログイン"
      portalSubtitle="テナント（導入企業）管理およびカリキュラム全体（Java・SQL）の作成・管理を行う管理者専用ゲートウェイです。"
      badgeText="System Admin Console (/admin/login)"
      accentColor="indigo"
      targetHomePath="/admin"
    />
  );
}
