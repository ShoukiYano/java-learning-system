import React from "react";
import { RoleLoginForm } from "@/components/auth/role-login-form";

export default function StudentLoginPage() {
  return (
    <RoleLoginForm
      expectedRole="student"
      portalTitle="受講生ログイン"
      portalSubtitle="Java・SQLカリキュラムの受講・コード演習を行うためのログイン画面です。"
      badgeText="受講生ポータル"
      accentColor="blue"
      targetHomePath="/student"
    />
  );
}
