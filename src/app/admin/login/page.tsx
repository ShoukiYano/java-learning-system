import React from "react";
import { RoleLoginForm } from "@/components/auth/role-login-form";

export default function AdminLoginPage() {
  return (
    <RoleLoginForm
      expectedRole="admin"
      portalTitle="システム管理者ログイン"
      portalSubtitle="テナント管理およびカリキュラム全体の作成・管理を行う管理者専用コンソールです。"
      badgeText="管理者専用コンソール"
      accentColor="indigo"
      targetHomePath="/admin"
    />
  );
}
