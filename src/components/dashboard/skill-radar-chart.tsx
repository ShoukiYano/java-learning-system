"use client";

/**
 * ファイル概要：
 * スキル分野別習得度レーダーチャートコンポーネント（Recharts利用）
 *
 * 主な処理：
 * - 受講生の分野別（変数、ループ、オブジェクト指向、SQL抽出/集計/結合など）の正答・習得率をレーダーチャートで可視化
 *
 * 注意事項：
 * - Rechartsを使用しているため、Client Component（"use client"）として動作します。
 */

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export interface SkillRadarPoint {
  tag: string;
  score: number;
  fullMark: number;
}

export function SkillRadarChart({ data }: { data: SkillRadarPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="74%" data={data}>
          <PolarGrid stroke="#cbd5e1" />
          <PolarAngleAxis
            dataKey="tag"
            tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "#64748b", fontSize: 10 }}
          />
          <Radar
            name="習得度 (%)"
            dataKey="score"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.45}
          />
          <Tooltip
            formatter={(val: number) => [`${val}%`, "正答・習得率"]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
