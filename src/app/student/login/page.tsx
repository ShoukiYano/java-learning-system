import React from "react";
import { RoleLoginForm } from "@/components/auth/role-login-form";

export default function StudentLoginPage() {
  return (
    <RoleLoginForm
      expectedRole="student"
      portalTitle="受講生ポータル ログイン"
      portalSubtitle="Java・SQLカリキュラムの受講・コード演習を行う受講生専用ゲートウェイです。"
      badgeText="Student Portal (/student/login)"
      accentColor="blue"
      targetHomePath="/student"
    />
  );
}
