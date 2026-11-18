import React from "react";
import { PortalPageSkeleton } from "@/components/ui/portal-page-skeleton";

export default function CompanyPortalLoading() {
  return (
    <PortalPageSkeleton
      accentColor="emerald"
      label="自社受講生の進捗・分析データを読み込んでいます..."
    />
  );
}
