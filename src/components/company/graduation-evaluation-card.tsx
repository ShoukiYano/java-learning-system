"use client";

/**
 * ファイル概要：
 * 企業研修担当者・運営管理者向け「90日間研修 100点満点修了判定パネル」
 *
 * 主な処理：
 * - 7カテゴリ（合計100点）の配点基準に基づくスキルスコア調整・確認
 * - 最終実務課題（CRUD実装・テスト）の必須合格ゲート判定
 * - 80点以上＋必須合格＝修了 / 70〜79点または必須未達＝条件付き修了候補 / 69点以下＝要復習 の自動算出
 */

import React, { useState, useMemo } from "react";
import {
  DEFAULT_GRADUATION_RUBRIC,
  evaluateGraduation,
} from "@/lib/curriculum/graduation";
import { GraduationCategoryKey } from "@/types/curriculum";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { Award, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";

interface GraduationEvaluationCardProps {
  studentName: string;
  initialScores: Partial<Record<GraduationCategoryKey, number>>;
  initialMandatoryPassed?: boolean;
}

export function GraduationEvaluationCard({
  studentName,
  initialScores,
  initialMandatoryPassed = false,
}: GraduationEvaluationCardProps) {
  const [scores, setScores] =
    useState<Partial<Record<GraduationCategoryKey, number>>>(initialScores);
  const [mandatoryPassed, setMandatoryPassed] = useState<boolean>(
    initialMandatoryPassed
  );

  const evaluation = useMemo(
    () => evaluateGraduation(scores, mandatoryPassed),
    [scores, mandatoryPassed]
  );

  const badgeVariant =
    evaluation.verdict === "graduated"
      ? "success"
      : evaluation.verdict === "conditional_review"
      ? "warning"
      : "destructive";

  return (
    <Card className="border-indigo-200 shadow-xs">
      <CardHeader className="pb-3 bg-indigo-50/40 border-b border-indigo-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-slate-900">
              <Award className="w-5 h-5 text-indigo-600" />
              90日間研修 修了判定・100点スキル評価（{studentName}）
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              80点以上かつ最終実務課題（CRUD実装・単体テスト）合格で「修了」と判定されます。
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[11px] text-slate-500">総合スコア</div>
              <div className="text-2xl font-extrabold text-indigo-700">
                {evaluation.totalScore}
                <span className="text-xs font-medium text-slate-500"> / 100点</span>
              </div>
            </div>
            <Badge variant={badgeVariant} className="text-xs py-1 px-2.5">
              {evaluation.verdictLabel}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* 7評価項目の配点スライダー・バー */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DEFAULT_GRADUATION_RUBRIC.map((item) => {
            const val = scores[item.key] ?? 0;
            const pct = Math.round((val / item.maxPoints) * 100);
            return (
              <div
                key={item.key}
                className="p-3 rounded-lg border bg-slate-50/70 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{item.label}</span>
                  <span className="font-mono font-bold text-indigo-700">
                    {val} / {item.maxPoints}点
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={item.maxPoints}
                  value={val}
                  onChange={(e) =>
                    setScores((prev) => ({
                      ...prev,
                      [item.key]: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <ProgressBar value={pct} className="h-1.5" />
              </div>
            );
          })}
        </div>

        {/* 必須実技課題ゲート */}
        <div className="p-3.5 rounded-lg border bg-white flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={mandatoryPassed}
              onChange={(e) => setMandatoryPassed(e.target.checked)}
              className="h-4 w-4 accent-emerald-600"
            />
            最終実務課題（顧客・案件管理システムのCRUD実装＋テスト）の必須合格を確認済み
          </label>
          <span className="text-[11px] text-slate-500">
            ※未チェックの場合、80点以上でも自動修了になりません
          </span>
        </div>

        {/* 判定理由サマリー */}
        <div
          className={`p-3.5 rounded-lg border text-xs flex items-start gap-2 ${
            evaluation.verdict === "graduated"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : evaluation.verdict === "conditional_review"
              ? "bg-amber-50 border-amber-200 text-amber-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
        >
          {evaluation.verdict === "graduated" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : evaluation.verdict === "conditional_review" ? (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-bold">判定結果：{evaluation.verdictLabel}</span>
            <p className="mt-0.5">{evaluation.verdictReason}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
