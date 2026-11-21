"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteStudentButtonProps {
  studentId: string;
  studentName: string;
  studentEmail: string;
  redirectTo?: string;
  onDeleted?: (studentId: string) => void;
  compact?: boolean;
}

export function DeleteStudentButton({
  studentId,
  studentName,
  studentEmail,
  redirectTo,
  onDeleted,
  compact = false,
}: DeleteStudentButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleting) return;
    const ok = window.confirm(
      `受講生「${studentName}（${studentEmail}）」を完全に削除しますか？\n\nログインアカウント・提出履歴・進捗データもすべて削除され、元に戻せません。`
    );
    if (!ok) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_student",
          payload: { studentId },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        window.alert(data.error || "受講生の削除に失敗しました。");
        setDeleting(false);
        return;
      }

      onDeleted?.(studentId);
      if (redirectTo) {
        router.push(redirectTo);
      }
      router.refresh();
    } catch {
      window.alert("通信エラーが発生しました。もう一度お試しください。");
      setDeleting(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size={compact ? "sm" : "default"}
      disabled={deleting}
      onClick={handleDelete}
      className={
        compact
          ? "h-8 px-2.5 text-xs border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          : "border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 text-xs font-semibold"
      }
    >
      {deleting ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}
      {compact ? "削除" : "受講生を削除"}
    </Button>
  );
}
