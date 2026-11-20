"use client";

/**
 * ファイル概要：
 * モバイル画面（md未満）専用ナビゲーションドロワー（ハンバーガーメニュー）
 * - PC版（md以上）では完全に非表示（md:hidden）となり、PCレイアウトへ一切影響を与えません。
 */

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export interface MobileNavItem {
  href: string;
  label: string;
}

interface MobileNavMenuProps {
  items: MobileNavItem[];
  variant?: "light" | "emerald";
  subtitle?: string;
}

export function MobileNavMenu({
  items,
  variant = "light",
  subtitle,
}: MobileNavMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isEmerald = variant === "emerald";

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="メニューを開く"
        aria-expanded={open}
        className={`p-2 rounded-lg border transition ${
          isEmerald
            ? "border-emerald-800 bg-emerald-900/80 text-emerald-100 hover:bg-emerald-800"
            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
        }`}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div
          className={`fixed inset-x-0 top-14 z-40 border-b shadow-xl ${
            isEmerald
              ? "bg-emerald-950 border-emerald-800 text-white"
              : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          {subtitle && (
            <div
              className={`px-4 py-2 text-xs font-medium border-b ${
                isEmerald
                  ? "border-emerald-900 text-emerald-300 bg-emerald-900/40"
                  : "border-slate-100 text-slate-500 bg-slate-50"
              }`}
            >
              {subtitle}
            </div>
          )}
          <nav className="flex flex-col p-2 gap-1">
            {items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold transition ${
                    active
                      ? isEmerald
                        ? "bg-emerald-800 text-white"
                        : "bg-blue-50 text-blue-700"
                      : isEmerald
                      ? "text-emerald-100 hover:bg-emerald-900"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
