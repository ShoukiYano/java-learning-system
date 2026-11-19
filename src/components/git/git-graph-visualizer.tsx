"use client";

/**
 * ファイル概要：
 * DevSkill Studio オリジナル・横型タイムラインGitグラフ可視化コンポーネント
 *
 * 主な処理：
 * 1. 時間軸（左→右）とブランチレーン（上→下）で構成される実務志向のコミットカードグラフを描画
 * 2. コミットID・短縮ハッシュ・コミットメッセージ・マージ有無を角丸カードで分かりやすく表現
 * 3. ブランチラベルと現在作業中（HEAD）ポインタをカード上部にすっきり配置
 */

import React, { useMemo } from "react";
import { GitState } from "@/lib/git/git-engine";

interface GitGraphVisualizerProps {
  state: GitState;
  isGoalView?: boolean;
  className?: string;
}

interface CardNodeLayout {
  id: string;
  hash: string;
  message: string;
  isMerge: boolean;
  col: number;
  row: number;
  x: number;
  y: number;
  w: number;
  h: number;
  branches: string[];
  isHeadDirect: boolean;
  headBranch?: string;
  laneColor: string;
}

const LANE_PALETTE = [
  "#059669", // row 0 (main): emerald
  "#7c3aed", // row 1: violet
  "#0284c7", // row 2: sky
  "#d97706", // row 3: amber
  "#e11d48", // row 4: rose
];

function getBranchStyle(name: string) {
  const lower = name.toLowerCase();
  if (lower === "main" || lower === "master") {
    return { bg: "#059669", border: "#047857", text: "#ffffff" };
  }
  if (lower.includes("feature")) {
    return { bg: "#7c3aed", border: "#6d28d9", text: "#ffffff" };
  }
  if (lower.includes("bugfix")) {
    return { bg: "#0284c7", border: "#0369a1", text: "#ffffff" };
  }
  if (lower.includes("hotfix")) {
    return { bg: "#e11d48", border: "#be123c", text: "#ffffff" };
  }
  return { bg: "#2563eb", border: "#1d4ed8", text: "#ffffff" };
}

export function GitGraphVisualizer({
  state,
  isGoalView = false,
  className = "",
}: GitGraphVisualizerProps) {
  const { nodes, edges, width, height, rowCount } = useMemo(() => {
    const commitIds = Object.keys(state.commits);
    if (commitIds.length === 0) {
      return { nodes: [], edges: [], width: 320, height: 120, rowCount: 1 };
    }

    // 1. 深さ（col: 左→右の時系列）を計算
    const depthMap: Record<string, number> = { C0: 0 };
    const queue = ["C0"];
    while (queue.length > 0) {
      const curId = queue.shift()!;
      const curDepth = depthMap[curId] ?? 0;
      for (const [cId, commit] of Object.entries(state.commits)) {
        if (commit.parents.includes(curId)) {
          if (depthMap[cId] === undefined || depthMap[cId] < curDepth + 1) {
            depthMap[cId] = curDepth + 1;
            queue.push(cId);
          }
        }
      }
    }
    for (const cId of commitIds) {
      if (depthMap[cId] === undefined) depthMap[cId] = 0;
    }

    // 2. レーン（row: 上→下のブランチ列）を割り当て
    const rowMap: Record<string, number> = { C0: 0 };
    let nextRow = 1;
    const sortedIds = [...commitIds].sort(
      (a, b) => (depthMap[a] ?? 0) - (depthMap[b] ?? 0)
    );

    // 同じ列・行が重ならないように管理
    const occupied = new Set<string>(["0:0"]);

    for (const cId of sortedIds) {
      if (cId === "C0") continue;
      const commit = state.commits[cId];
      const pId = commit.parents[0];
      const parentRow = pId ? (rowMap[pId] ?? 0) : 0;
      const col = depthMap[cId] ?? 0;

      // main/master ブランチの祖先またはマージ先なら row 0 を優先
      const isMainTip =
        state.branches["main"] === cId || state.branches["master"] === cId;

      let assignedRow = parentRow;

      if (isMainTip && !occupied.has(`${col}:0`)) {
        assignedRow = 0;
      } else if (occupied.has(`${col}:${parentRow}`)) {
        assignedRow = nextRow++;
      } else if (
        parentRow === 0 &&
        !isMainTip &&
        commit.parents.length === 1 &&
        Object.entries(state.branches).some(
          ([b, tid]) => tid === cId && b !== "main" && b !== "master"
        )
      ) {
        // main以外のブランチ先端で、親がrow 0の場合は見やすく下レーンへ分岐
        const parentHasOtherChild = sortedIds.some(
          (id) => id !== cId && state.commits[id]?.parents[0] === pId
        );
        if (parentHasOtherChild || state.branches["main"] === pId) {
          assignedRow = nextRow++;
        }
      }

      rowMap[cId] = assignedRow;
      occupied.add(`${col}:${assignedRow}`);
    }

    // 3. カードサイズ・間隔設定
    const cardW = isGoalView ? 92 : 136;
    const cardH = isGoalView ? 42 : 62;
    const gapX = isGoalView ? 38 : 54;
    const gapY = isGoalView ? 36 : 52;
    const padX = isGoalView ? 24 : 36;
    const padTop = isGoalView ? 34 : 48;
    const padBottom = isGoalView ? 20 : 32;

    const maxCol = Math.max(...Object.values(depthMap), 0);
    const maxRow = Math.max(...Object.values(rowMap), 0);

    const calcWidth = Math.max(
      isGoalView ? 300 : 480,
      padX * 2 + (maxCol + 1) * cardW + maxCol * gapX
    );
    const calcHeight =
      padTop + (maxRow + 1) * cardH + maxRow * gapY + padBottom;

    const layoutNodes: CardNodeLayout[] = sortedIds.map((cId) => {
      const col = depthMap[cId] ?? 0;
      const row = rowMap[cId] ?? 0;
      const x = padX + col * (cardW + gapX);
      const y = padTop + row * (cardH + gapY);

      const pointingBranches = Object.entries(state.branches)
        .filter(([, targetId]) => targetId === cId)
        .map(([name]) => name);

      const isHeadDirect = state.head.isDetached && state.head.target === cId;
      const headBranch =
        !state.head.isDetached && state.branches[state.head.target] === cId
          ? state.head.target
          : undefined;

      const commit = state.commits[cId];

      return {
        id: cId,
        hash: commit?.hash ?? "",
        message: commit?.message ?? "",
        isMerge: (commit?.parents.length ?? 0) >= 2,
        col,
        row,
        x,
        y,
        w: cardW,
        h: cardH,
        branches: pointingBranches,
        isHeadDirect,
        headBranch,
        laneColor: LANE_PALETTE[row % LANE_PALETTE.length],
      };
    });

    // 4. 親（左）→ 子（右）への滑らかな接続曲線
    const nodeMap = new Map(layoutNodes.map((n) => [n.id, n]));
    const layoutEdges: {
      key: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      color: string;
      isMergeEdge: boolean;
    }[] = [];

    for (const child of layoutNodes) {
      const commit = state.commits[child.id];
      if (!commit) continue;

      commit.parents.forEach((pId, idx) => {
        const parent = nodeMap.get(pId);
        if (!parent) return;
        layoutEdges.push({
          key: `${pId}->${child.id}`,
          x1: parent.x + parent.w,
          y1: parent.y + parent.h / 2,
          x2: child.x,
          y2: child.y + child.h / 2,
          color: idx === 1 ? parent.laneColor : child.laneColor,
          isMergeEdge: idx === 1,
        });
      });
    }

    return {
      nodes: layoutNodes,
      edges: layoutEdges,
      width: calcWidth,
      height: calcHeight,
      rowCount: maxRow + 1,
    };
  }, [state, isGoalView]);

  return (
    <div
      className={`w-full overflow-x-auto overflow-y-auto flex items-center ${
        isGoalView ? "justify-start" : "justify-start md:justify-center"
      } select-none ${className}`}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="shrink-0"
      >
        <defs>
          <filter id="card-shadow" x="-10%" y="-10%" width="125%" height="135%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="3"
              floodColor="#0f172a"
              floodOpacity="0.08"
            />
          </filter>
          <marker
            id={isGoalView ? "git-arrow-goal" : "git-arrow-main"}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
          </marker>
        </defs>

        {/* ブランチレーンの薄い水平ガイドライン */}
        {Array.from({ length: rowCount }).map((_, rIdx) => {
          const cardH = isGoalView ? 42 : 62;
          const gapY = isGoalView ? 36 : 52;
          const padTop = isGoalView ? 34 : 48;
          const cy = padTop + rIdx * (cardH + gapY) + cardH / 2;
          return (
            <line
              key={`lane-${rIdx}`}
              x1={12}
              y1={cy}
              x2={width - 12}
              y2={cy}
              stroke="#e2e8f0"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* コミット間コネクタ（左: 親 → 右: 子） */}
        {edges.map((edge) => {
          const midX = (edge.x1 + edge.x2) / 2;
          const d = `M ${edge.x1} ${edge.y1} C ${midX} ${edge.y1}, ${midX} ${edge.y2}, ${edge.x2 - 2} ${edge.y2}`;
          return (
            <path
              key={edge.key}
              d={d}
              fill="none"
              stroke={edge.color}
              strokeWidth={isGoalView ? "2" : "2.5"}
              strokeDasharray={edge.isMergeEdge ? "5 3" : "none"}
              markerEnd={`url(#${isGoalView ? "git-arrow-goal" : "git-arrow-main"})`}
              opacity={0.85}
            />
          );
        })}

        {/* コミットカードノード */}
        {nodes.map((node) => {
          const isActiveHead = node.isHeadDirect || !!node.headBranch;

          return (
            <g key={node.id}>
              {/* カード上部のブランチ＆HEADピル */}
              {(() => {
                const pills: {
                  key: string;
                  label: string;
                  bg: string;
                  text: string;
                  isHead?: boolean;
                }[] = [];

                for (const b of node.branches) {
                  const st = getBranchStyle(b);
                  pills.push({
                    key: `b-${b}`,
                    label: b,
                    bg: st.bg,
                    text: st.text,
                  });
                }
                if (isActiveHead) {
                  pills.push({
                    key: "head-pill",
                    label: "HEAD",
                    bg: "#0f172a",
                    text: "#38bdf8",
                    isHead: true,
                  });
                }

                let curX = node.x;
                const pillH = isGoalView ? 18 : 22;
                const pillY = node.y - pillH - 6;

                return pills.map((p) => {
                  const pillW = Math.max(
                    isGoalView ? 38 : 46,
                    p.label.length * (isGoalView ? 6.8 : 7.8) + 14
                  );
                  const drawX = curX;
                  curX += pillW + 4;
                  return (
                    <g key={p.key}>
                      <rect
                        x={drawX}
                        y={pillY}
                        width={pillW}
                        height={pillH}
                        rx="5"
                        fill={p.bg}
                      />
                      <text
                        x={drawX + pillW / 2}
                        y={pillY + pillH / 2}
                        dy=".35em"
                        textAnchor="middle"
                        fill={p.text}
                        fontSize={isGoalView ? "9.5" : "11"}
                        fontWeight="bold"
                        className="font-mono"
                      >
                        {p.label}
                      </text>
                    </g>
                  );
                });
              })()}

              {/* カード本体 */}
              <rect
                x={node.x}
                y={node.y}
                width={node.w}
                height={node.h}
                rx="10"
                fill={isActiveHead ? "#eff6ff" : "#ffffff"}
                stroke={isActiveHead ? "#2563eb" : "#cbd5e1"}
                strokeWidth={isActiveHead ? "2.5" : "1.5"}
                filter="url(#card-shadow)"
              />

              {/* 左端のカラーアクセントバー */}
              <rect
                x={node.x + 1}
                y={node.y + 1}
                width="6"
                height={node.h - 2}
                rx="3"
                fill={node.laneColor}
              />

              {/* コミットID（C0, C1...） */}
              <text
                x={node.x + 16}
                y={node.y + (isGoalView ? 18 : 23)}
                fill="#0f172a"
                fontSize={isGoalView ? "12" : "14"}
                fontWeight="800"
                className="font-mono"
              >
                {node.id}
              </text>

              {/* 通常ビュー時：短縮ハッシュまたはMERGEタグ */}
              {!isGoalView && (
                <text
                  x={node.x + node.w - 10}
                  y={node.y + 22}
                  textAnchor="end"
                  fill={node.isMerge ? "#7c3aed" : "#94a3b8"}
                  fontSize="10"
                  fontWeight={node.isMerge ? "bold" : "normal"}
                  className="font-mono"
                >
                  {node.isMerge ? "MERGE" : `#${node.hash.slice(0, 6)}`}
                </text>
              )}

              {/* コミットメッセージ */}
              <text
                x={node.x + 16}
                y={node.y + (isGoalView ? 33 : 45)}
                fill="#475569"
                fontSize={isGoalView ? "9.5" : "11"}
                className="font-sans"
              >
                {node.message.length > (isGoalView ? 11 : 15)
                  ? `${node.message.slice(0, isGoalView ? 11 : 15)}…`
                  : node.message}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
