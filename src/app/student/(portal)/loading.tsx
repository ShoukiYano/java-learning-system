import React from "react";
import { PortalPageSkeleton } from "@/components/ui/portal-page-skeleton";

export default function StudentPortalLoading() {
  return (
    <PortalPageSkeleton
      accentColor="blue"
      label="カリキュラム・学習データを読み込んでいます..."
    />
  );
}
