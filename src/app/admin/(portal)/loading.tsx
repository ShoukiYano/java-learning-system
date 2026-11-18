import React from "react";
import { PortalPageSkeleton } from "@/components/ui/portal-page-skeleton";

export default function AdminPortalLoading() {
  return (
    <PortalPageSkeleton
      accentColor="indigo"
      label="システム管理データを読み込んでいます..."
    />
  );
}
