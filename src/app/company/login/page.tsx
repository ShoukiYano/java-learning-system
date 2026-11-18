import React from "react";
import { RoleLoginForm } from "@/components/auth/role-login-form";

export default function CompanyLoginPage() {
  return (
    <RoleLoginForm
      expectedRole="company"
      portalTitle="企業担当者ポータル ログイン"
      portalSubtitle="自社テナントの受講生一覧・学習進捗・カリキュラム内容を確認する企業担当者専用ゲートウェイです。"
      badgeText="Company Tenant Portal (/company/login)"
      accentColor="emerald"
      targetHomePath="/company"
    />
  );
}
