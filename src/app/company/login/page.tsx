import React from "react";
import { RoleLoginForm } from "@/components/auth/role-login-form";

export default function CompanyLoginPage() {
  return (
    <RoleLoginForm
      expectedRole="company"
      portalTitle="企業担当者ログイン"
      portalSubtitle="貴社受講生の学習進捗・評価・カリキュラム内容を確認するための専用ログイン画面です。"
      badgeText="企業担当者専用ポータル"
      accentColor="emerald"
      targetHomePath="/company"
    />
  );
}
