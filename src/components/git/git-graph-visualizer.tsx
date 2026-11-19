"use client";

/**
 * ファイル概要：
 * インタラクティブGitツリーグラフ可視化コンポーネント（SVG描画）
 *
 * 主な処理：
 * 1. GitState（コミットDAG・ブランチ・HEAD）からノードの階層レイアウトを自動計算
 * 2. コミットノード（C0, C1...）、親コミットへの有向矢印、ブランチタグ、HEADポインタのリアルタイム描画
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
}

// ブランチごとのアクセントカラーパレット
const BRANCH_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  main: { bg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40", border: "#10b981", text: "#34d399" },
  master: { bg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40", border: "#10b981", text: "#34d399" },
  feature: { bg: "bg-purple-500/20 text-purple-400 border-purple-500/40", border: "#a855f7", text: "#c084fc" },
  bugfix: { bg: "bg-sky-500/20 text-sky-400 border-sky-500/40", border: "#0ea5e9", text: "#38bdf8" },
  hotfix: { bg: "bg-rose-500/20 text-rose-400 border-rose-500/40", border: "#f43f5e", text: "#fb7185" },
  develop: { bg: "bg-amber-500/20 text-amber-400 border-amber-500/40", border: "#f59e0b", text: "#fbbf24" },
};

function getBranchColor(name: string) {
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(BRANCH_COLORS)) {
    if (lower.includes(key)) return val;
  }
  return { bg: "bg-blue-500/20 text-blue-400 border-blue-500/40", border: "#3b82f6", text: "#60a5fa" };
}

export function GitGraphVisualizer({
  state,
  isGoalView = false,
  className = "",
}: GitGraphVisualizerProps) {
  // レイアウト座標の計算
  const { nodes, edges, width, height } = useMemo(() => {
    const commitIds = Object.keys(state.commits);
    if (commitIds.length === 0) {
      return { nodes: [], edges: [], width: 300, height: 200 };
    }

    // 1. 各コミットの深さ（Root C0 からの距離）を計算
    const depthMap: Record<string, number> = {};
    const queue = ["C0"];
    depthMap["C0"] = 0;

    while (queue.length > 0) {
      const curId = queue.shift()!;
      const curDepth = depthMap[curId] ?? 0;

      // このコミットを親として持つ子コミットを探す
      for (const [cId, commit] of Object.entries(state.commits)) {
        if (commit.parents.includes(curId)) {
          if (depthMap[cId] === undefined || depthMap[cId] < curDepth + 1) {
            depthMap[cId] = curDepth + 1;
            queue.push(cId);
          }
        }
      }
    }

    // 未訪問（孤立や別Root）コミットのフォールバック
    for (const cId of commitIds) {
      if (depthMap[cId] === undefined) {
        depthMap[cId] = 0;
      }
    }

    // 2. レーン（X座標の列）の割り当て
    // main ブランチの履歴を中央レーン（lane = 0）とし、他ブランチを左右に展開
    const laneMap: Record<string, number> = { C0: 0 };
    let leftLane = -1;
    let rightLane = 1;

    // 深さ順にソート
    const sortedIds = [...commitIds].sort((a, b) => (depthMap[a] ?? 0) - (depthMap[b] ?? 0));

    for (const cId of sortedIds) {
      if (cId === "C0") continue;
      const commit = state.commits[cId];
      const pId = commit.parents[0];
      const parentLane = pId ? (laneMap[pId] ?? 0) : 0;

      // 同じ親から分岐した2番目以降の子は別レーンへ
      const siblings = sortedIds.filter(
        (id) => id !== cId && state.commits[id]?.parents[0] === pId && depthMap[id] === depthMap[cId]
      );

      if (siblings.length > 0 && siblings.indexOf(cId) > 0) {
        laneMap[cId] = rightLane++;
      } else if (parentLane !== 0) {
        laneMap[cId] = parentLane;
      } else {
        // ブランチ名による判定
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

    // 3. ピクセル座標の決定
    const nodeSpacingY = isGoalView ? 65 : 85;
    const nodeSpacingX = isGoalView ? 80 : 110;
    const startY = isGoalView ? 40 : 50;

    // 最低レーンと最高レーンを求める
    const lanes = Object.values(laneMap);
    const minLane = Math.min(...lanes, 0);
    const maxLane = Math.max(...lanes, 0);
    const totalLanes = maxLane - minLane + 1;
    const calculatedWidth = Math.max(isGoalView ? 240 : 380, totalLanes * nodeSpacingX + (isGoalView ? 100 : 160));

    const centerX = calculatedWidth / 2 - ((maxLane + minLane) / 2) * nodeSpacingX;

    const maxDepth = Math.max(...Object.values(depthMap), 0);
    const calculatedHeight = Math.max(isGoalView ? 220 : 320, maxDepth * nodeSpacingY + (isGoalView ? 100 : 140));

    const layoutNodes: NodeLayout[] = sortedIds.map((cId) => {
      const depth = depthMap[cId] ?? 0;
      const lane = laneMap[cId] ?? 0;
      const x = centerX + lane * nodeSpacingX;
      const y = startY + depth * nodeSpacingY;

      // このコミットを指しているブランチ
      const pointingBranches = Object.entries(state.branches)
        .filter(([, targetId]) => targetId === cId)
        .map(([name]) => name);

      // HEADの判定
      const isHeadDirect = state.head.isDetached && state.head.target === cId;
      const headBranch = !state.head.isDetached && state.branches[state.head.target] === cId
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

  return (
    <div
      className={`relative w-full h-full overflow-auto flex items-center justify-center select-none ${className}`}
      style={{ minHeight: isGoalView ? "200px" : "320px" }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="transition-all duration-300"
      >
        <defs>
          {/* 親方向への矢印マーカー */}
          <marker
            id={isGoalView ? "arrow-goal" : "arrow-main"}
            viewBox="0 0 10 10"
            refX="22"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill={isGoalView ? "#94a3b8" : "#64748b"} />
          </marker>

          {/* コミットノードのグロー効果 */}
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* コミット間の接続線（矢印） */}
        {edges.map((edge) => {
          // ベジェ曲線で滑らかに結ぶ
          const deltaY = edge.toY - edge.fromY;
          const ctrlY1 = edge.fromY + deltaY * 0.4;
          const ctrlY2 = edge.fromY + deltaY * 0.6;
          const pathD = `M ${edge.fromX} ${edge.fromY} C ${edge.fromX} ${ctrlY1}, ${edge.toX} ${ctrlY2}, ${edge.toX} ${edge.toY}`;

          return (
            <path
              key={edge.key}
              d={pathD}
              fill="none"
              stroke={isGoalView ? "#64748b" : "#475569"}
              strokeWidth={isGoalView ? "2" : "2.5"}
              strokeDasharray={isGoalView ? "4 2" : "none"}
              markerEnd={`url(#${isGoalView ? "arrow-goal" : "arrow-main"})`}
              className="transition-all duration-300"
            />
          );
        })}

        {/* コミットノードの描画 */}
        {nodes.map((node) => {
          const isCurrentHead = node.isHeadDirect || !!node.headBranch;
          const radius = isGoalView ? 16 : 20;

          return (
            <g key={node.id} className="cursor-pointer group">
              {/* HEADハイライトリング */}
              {isCurrentHead && !isGoalView && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius + 6}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  className="animate-spin"
                  style={{ transformOrigin: `${node.x}px ${node.y}px`, animationDuration: "10s" }}
                />
              )}

              {/* コミット本体の円 */}
              <circle
                cx={node.x}
                cy={node.y}
                r={radius}
                fill={isGoalView ? "#334155" : isCurrentHead ? "#0284c7" : "#1e293b"}
                stroke={isGoalView ? "#94a3b8" : isCurrentHead ? "#38bdf8" : "#475569"}
                strokeWidth={isCurrentHead ? "3" : "2"}
                className="transition-all duration-200 group-hover:scale-110"
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              />

              {/* コミットIDラベル（C0, C1...） */}
              <text
                x={node.x}
                y={node.y}
                dy=".35em"
                textAnchor="middle"
                fill="#ffffff"
                fontSize={isGoalView ? "10" : "12"}
                fontWeight="bold"
                className="pointer-events-none font-mono"
              >
                {node.id}
              </text>

              {/* ブランチラベルバッジ（右横に描画） */}
              {node.branches.map((branchName, bIdx) => {
                const color = getBranchColor(branchName);
                const isHeadOnThisBranch = node.headBranch === branchName;
                const badgeX = node.x + radius + 10;
                const badgeY = node.y - 10 + bIdx * (isGoalView ? 20 : 26);

                return (
                  <g key={branchName}>
                    {/* ノードからバッジへの指示線 */}
                    <line
                      x1={node.x + radius}
                      y1={node.y}
                      x2={badgeX}
                      y2={badgeY + 9}
                      stroke={color.border}
                      strokeWidth="1.5"
                    />

                    {/* バッジの背景 */}
                    <rect
                      x={badgeX}
                      y={badgeY}
                      width={branchName.length * (isGoalView ? 6.5 : 8) + (isHeadOnThisBranch ? 38 : 16)}
                      height={isGoalView ? "18" : "22"}
                      rx="4"
                      fill="#0f172a"
                      stroke={color.border}
                      strokeWidth="1.5"
                    />

                    {/* ブランチテキスト */}
                    <text
                      x={badgeX + 6}
                      y={badgeY + (isGoalView ? 12 : 15)}
                      fill={color.text}
                      fontSize={isGoalView ? "9" : "11"}
                      fontWeight="bold"
                      className="font-mono pointer-events-none"
                    >
                      {branchName}
                    </text>

                    {/* HEAD ポインタマーク */}
                    {isHeadOnThisBranch && (
                      <text
                        x={badgeX + branchName.length * (isGoalView ? 6.5 : 8) + 8}
                        y={badgeY + (isGoalView ? 12 : 15)}
                        fill="#38bdf8"
                        fontSize={isGoalView ? "9" : "10"}
                        fontWeight="extrabold"
                        className="font-mono pointer-events-none animate-pulse"
                      >
                        *HEAD
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Detached HEAD（コミットに直接HEADがある場合） */}
              {node.isHeadDirect && (
                <g>
                  <rect
                    x={node.x - 30}
                    y={node.y - radius - (isGoalView ? 20 : 24)}
                    width="60"
                    height={isGoalView ? "16" : "20"}
                    rx="4"
                    fill="#0369a1"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                  />
                  <text
                    x={node.x}
                    y={node.y - radius - (isGoalView ? 9 : 10)}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize={isGoalView ? "9" : "11"}
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
