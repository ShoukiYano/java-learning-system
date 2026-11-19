"use client";

/**
 * ファイル概要：
 * インタラクティブGitツリーグラフ可視化コンポーネント（高視認性ライトテーマSVG描画）
 *
 * 主な処理：
 * 1. GitState（コミットDAG・ブランチ・HEAD）からノードの階層レイアウトを自動計算
 * 2. 大きく見やすいコミットノード（C0, C1...）、親コミットへの太めの有向矢印、高コントラストなブランチタグ＆HEADポインタを描画
 * 3. 通常ビューおよび目標達成判定用のゴール比較ビューに対応
 */

import React, { useMemo } from "react";
import { GitState } from "@/lib/git/git-engine";

interface GitGraphVisualizerProps {
  state: GitState;
  isGoalView?: boolean;
  className?: string;
}

interface NodeLayout {
  id: string;
  x: number;
  y: number;
  depth: number;
  lane: number;
  branches: string[];
  isHeadDirect: boolean;
  headBranch?: string;
  message: string;
}

// ブランチごとの高コントラストカラーパレット（白文字がくっきり映える塗りつぶし）
const BRANCH_COLORS: Record<string, { fill: string; stroke: string; text: string }> = {
  main: { fill: "#059669", stroke: "#047857", text: "#ffffff" },
  master: { fill: "#059669", stroke: "#047857", text: "#ffffff" },
  feature: { fill: "#7c3aed", stroke: "#6d28d9", text: "#ffffff" },
  bugfix: { fill: "#0284c7", stroke: "#0369a1", text: "#ffffff" },
  hotfix: { fill: "#e11d48", stroke: "#be123c", text: "#ffffff" },
  develop: { fill: "#d97706", stroke: "#b45309", text: "#ffffff" },
};

function getBranchColor(name: string) {
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(BRANCH_COLORS)) {
    if (lower.includes(key)) return val;
  }
  return { fill: "#2563eb", stroke: "#1d4ed8", text: "#ffffff" };
}

export function GitGraphVisualizer({
  state,
  isGoalView = false,
  className = "",
}: GitGraphVisualizerProps) {
  const { nodes, edges, width, height } = useMemo(() => {
    const commitIds = Object.keys(state.commits);
    if (commitIds.length === 0) {
      return { nodes: [], edges: [], width: 320, height: 200 };
    }

    // 1. 各コミットの深さ（Root C0 からの距離）を計算
    const depthMap: Record<string, number> = {};
    const queue = ["C0"];
    depthMap["C0"] = 0;

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
      if (depthMap[cId] === undefined) {
        depthMap[cId] = 0;
      }
    }

    // 2. レーン（X座標の列）の割り当て
    const laneMap: Record<string, number> = { C0: 0 };
    let rightLane = 1;

    const sortedIds = [...commitIds].sort((a, b) => (depthMap[a] ?? 0) - (depthMap[b] ?? 0));

    for (const cId of sortedIds) {
      if (cId === "C0") continue;
      const commit = state.commits[cId];
      const pId = commit.parents[0];
      const parentLane = pId ? (laneMap[pId] ?? 0) : 0;

      const siblings = sortedIds.filter(
        (id) => id !== cId && state.commits[id]?.parents[0] === pId && depthMap[id] === depthMap[cId]
      );

      if (siblings.length > 0 && siblings.indexOf(cId) > 0) {
        laneMap[cId] = rightLane++;
      } else if (parentLane !== 0) {
        laneMap[cId] = parentLane;
      } else {
        const isBranching = Object.entries(state.branches).some(
          ([b, target]) => target === cId && b !== "main" && b !== "master"
        );
        if (isBranching && laneMap[cId] === undefined) {
          laneMap[cId] = rightLane++;
        } else {
          laneMap[cId] = parentLane;
        }
      }
    }

    // 3. ピクセル座標の決定（見やすくゆったりとした間隔）
    const nodeSpacingY = isGoalView ? 64 : 96;
    const nodeSpacingX = isGoalView ? 95 : 140;
    const startY = isGoalView ? 38 : 64;

    const lanes = Object.values(laneMap);
    const minLane = Math.min(...lanes, 0);
    const maxLane = Math.max(...lanes, 0);
    const totalLanes = maxLane - minLane + 1;

    // 右側にブランチバッジ用の十分な余白を確保
    const calculatedWidth = Math.max(
      isGoalView ? 260 : 480,
      totalLanes * nodeSpacingX + (isGoalView ? 140 : 220)
    );
    const centerX = isGoalView
      ? calculatedWidth * 0.36 - ((maxLane + minLane) / 2) * nodeSpacingX
      : calculatedWidth * 0.42 - ((maxLane + minLane) / 2) * nodeSpacingX;

    const maxDepth = Math.max(...Object.values(depthMap), 0);
    const calculatedHeight = Math.max(
      isGoalView ? 180 : 340,
      maxDepth * nodeSpacingY + (isGoalView ? 76 : 140)
    );

    const layoutNodes: NodeLayout[] = sortedIds.map((cId) => {
      const depth = depthMap[cId] ?? 0;
      const lane = laneMap[cId] ?? 0;
      const x = centerX + lane * nodeSpacingX;
      const y = startY + depth * nodeSpacingY;

      const pointingBranches = Object.entries(state.branches)
        .filter(([, targetId]) => targetId === cId)
        .map(([name]) => name);

      const isHeadDirect = state.head.isDetached && state.head.target === cId;
      const headBranch =
        !state.head.isDetached && state.branches[state.head.target] === cId
          ? state.head.target
          : undefined;

      return {
        id: cId,
        x,
        y,
        depth,
        lane,
        branches: pointingBranches,
        isHeadDirect,
        headBranch,
        message: state.commits[cId]?.message ?? "",
      };
    });

    // 4. エッジ（親へのリンク）の生成
    const layoutEdges: { fromX: number; fromY: number; toX: number; toY: number; key: string }[] = [];
    const nodeDict = new Map<string, NodeLayout>(layoutNodes.map((n) => [n.id, n]));

    for (const node of layoutNodes) {
      const commit = state.commits[node.id];
      if (!commit) continue;

      for (const pId of commit.parents) {
        const parentNode = nodeDict.get(pId);
        if (parentNode) {
          layoutEdges.push({
            fromX: node.x,
            fromY: node.y,
            toX: parentNode.x,
            toY: parentNode.y,
            key: `${node.id}->${pId}`,
          });
        }
      }
    }

    return {
      nodes: layoutNodes,
      edges: layoutEdges,
      width: calculatedWidth,
      height: calculatedHeight,
    };
  }, [state, isGoalView]);

  const radius = isGoalView ? 18 : 26;

  return (
    <div
      className={`relative w-full h-full overflow-auto flex items-center justify-center select-none ${className}`}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="transition-all duration-300"
      >
        <defs>
          {/* 親方向へのクッキリ矢印マーカー */}
          <marker
            id={isGoalView ? "arrow-goal-light" : "arrow-main-light"}
            viewBox="0 0 10 10"
            refX={isGoalView ? "24" : "29"}
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill={isGoalView ? "#6366f1" : "#475569"} />
          </marker>

          {/* ノードのドロップシャドウ */}
          <filter id="node-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.16" />
          </filter>
        </defs>

        {/* コミット間の接続線（矢印） */}
        {edges.map((edge) => {
          const deltaY = edge.toY - edge.fromY;
          const ctrlY1 = edge.fromY + deltaY * 0.45;
          const ctrlY2 = edge.fromY + deltaY * 0.55;
          const pathD = `M ${edge.fromX} ${edge.fromY} C ${edge.fromX} ${ctrlY1}, ${edge.toX} ${ctrlY2}, ${edge.toX} ${edge.toY}`;

          return (
            <path
              key={edge.key}
              d={pathD}
              fill="none"
              stroke={isGoalView ? "#818cf8" : "#64748b"}
              strokeWidth={isGoalView ? "2.5" : "3"}
              markerEnd={`url(#${isGoalView ? "arrow-goal-light" : "arrow-main-light"})`}
              className="transition-all duration-300"
            />
          );
        })}

        {/* コミットノードの描画 */}
        {nodes.map((node) => {
          const isCurrentHead = node.isHeadDirect || !!node.headBranch;

          return (
            <g key={node.id} className="group">
              {/* HEADハイライトリング */}
              {isCurrentHead && !isGoalView && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius + 7}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeDasharray="5 3"
                  className="animate-spin"
                  style={{ transformOrigin: `${node.x}px ${node.y}px`, animationDuration: "14s" }}
                />
              )}

              {/* コミット本体の円 */}
              <circle
                cx={node.x}
                cy={node.y}
                r={radius}
                fill={
                  isGoalView
                    ? isCurrentHead
                      ? "#4f46e5"
                      : "#64748b"
                    : isCurrentHead
                    ? "#2563eb"
                    : "#334155"
                }
                stroke={
                  isGoalView
                    ? isCurrentHead
                      ? "#312e81"
                      : "#475569"
                    : isCurrentHead
                    ? "#1d4ed8"
                    : "#1e293b"
                }
                strokeWidth="2.5"
                filter="url(#node-shadow)"
                className="transition-all duration-200"
              />

              {/* コミットIDラベル（C0, C1...） */}
              <text
                x={node.x}
                y={node.y}
                dy=".35em"
                textAnchor="middle"
                fill="#ffffff"
                fontSize={isGoalView ? "11" : "14"}
                fontWeight="bold"
                className="pointer-events-none font-mono"
              >
                {node.id}
              </text>

              {/* 通常ビュー時のみコミットメッセージを左横に薄く表示 */}
              {!isGoalView && node.message && (
                <text
                  x={node.x - radius - 12}
                  y={node.y}
                  dy=".35em"
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="12"
                  className="pointer-events-none font-sans"
                >
                  {node.message.length > 18 ? `${node.message.slice(0, 18)}…` : node.message}
                </text>
              )}

              {/* ブランチラベルバッジ（右横にクッキリ表示） */}
              {node.branches.map((branchName, bIdx) => {
                const color = getBranchColor(branchName);
                const isHeadOnThisBranch = node.headBranch === branchName;
                const badgeX = node.x + radius + (isGoalView ? 12 : 18);
                const badgeH = isGoalView ? 22 : 28;
                const badgeY = node.y - badgeH / 2 + bIdx * (badgeH + 6);
                const branchWidth = Math.max(
                  isGoalView ? 46 : 58,
                  branchName.length * (isGoalView ? 7.5 : 9) + 18
                );
                const headBadgeWidth = isGoalView ? 42 : 52;

                return (
                  <g key={branchName}>
                    {/* ノードからバッジへの接続ライン */}
                    <line
                      x1={node.x + radius + 2}
                      y1={node.y}
                      x2={badgeX}
                      y2={badgeY + badgeH / 2}
                      stroke={color.fill}
                      strokeWidth="2"
                    />

                    {/* ブランチピル */}
                    <rect
                      x={badgeX}
                      y={badgeY}
                      width={branchWidth}
                      height={badgeH}
                      rx="6"
                      fill={color.fill}
                      stroke={color.stroke}
                      strokeWidth="1.5"
                      filter="url(#node-shadow)"
                    />
                    <text
                      x={badgeX + branchWidth / 2}
                      y={badgeY + badgeH / 2}
                      dy=".35em"
                      textAnchor="middle"
                      fill={color.text}
                      fontSize={isGoalView ? "10.5" : "12.5"}
                      fontWeight="bold"
                      className="font-mono pointer-events-none"
                    >
                      {branchName}
                    </text>

                    {/* HEAD バッジ（ブランチのすぐ右に独立したピルで表示） */}
                    {isHeadOnThisBranch && (
                      <g>
                        <rect
                          x={badgeX + branchWidth + 5}
                          y={badgeY}
                          width={headBadgeWidth}
                          height={badgeH}
                          rx="6"
                          fill="#1e293b"
                          stroke="#0f172a"
                          strokeWidth="1.5"
                        />
                        <text
                          x={badgeX + branchWidth + 5 + headBadgeWidth / 2}
                          y={badgeY + badgeH / 2}
                          dy=".35em"
                          textAnchor="middle"
                          fill="#38bdf8"
                          fontSize={isGoalView ? "9.5" : "11"}
                          fontWeight="bold"
                          className="font-mono pointer-events-none"
                        >
                          HEAD
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Detached HEAD（コミットに直接HEADがある場合） */}
              {node.isHeadDirect && (
                <g>
                  <rect
                    x={node.x + radius + 14}
                    y={node.y - (isGoalView ? 11 : 14)}
                    width={isGoalView ? 54 : 64}
                    height={isGoalView ? 22 : 28}
                    rx="6"
                    fill="#1e293b"
                    stroke="#0284c7"
                    strokeWidth="2"
                  />
                  <text
                    x={node.x + radius + 14 + (isGoalView ? 27 : 32)}
                    y={node.y}
                    dy=".35em"
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize={isGoalView ? "10" : "12"}
                    fontWeight="bold"
                    className="font-mono pointer-events-none"
                  >
                    HEAD*
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
