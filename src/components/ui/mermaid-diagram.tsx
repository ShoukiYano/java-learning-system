"use client";

import React, { useEffect, useId, useState } from "react";

interface MermaidDiagramProps {
  chart: string;
}

declare global {
  interface Window {
    __mermaidPromise?: Promise<{
      initialize: (cfg: Record<string, unknown>) => void;
      render: (id: string, text: string) => Promise<{ svg: string }>;
    }>;
  }
}

function loadMermaid() {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if (!window.__mermaidPromise) {
    const cdnUrl =
      "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
    // Dynamic ESM import via Function to avoid webpack bundling CDN URL
    const dynamicImport = new Function("u", "return import(u)") as (
      url: string
    ) => Promise<{ default: { initialize: (cfg: Record<string, unknown>) => void; render: (id: string, text: string) => Promise<{ svg: string }> } }>;
    window.__mermaidPromise = dynamicImport(cdnUrl).then((mod) => {
      const m = mod.default;
      m.initialize({
        startOnLoad: false,
        theme: "default",
        securityLevel: "strict",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
      });
      return m;
    });
  }
  return window.__mermaidPromise;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const reactId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);
    loadMermaid()
      .then((mermaid) => mermaid.render(`mmd-${reactId}-${Date.now()}`, chart))
      .then((res) => {
        if (!cancelled) setSvg(res.svg);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [chart, reactId]);

  if (failed) {
    return (
      <pre className="my-3 p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
        <code>{chart}</code>
      </pre>
    );
  }

  if (!svg) {
    return (
      <div className="my-3 p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500 text-center">
        図解（Mermaid）を描画中...
      </div>
    );
  }

  return (
    <div
      className="my-3 p-4 rounded-xl border border-slate-200 bg-white overflow-x-auto shadow-sm flex justify-center [&_svg]:max-w-full [&_svg]:h-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
