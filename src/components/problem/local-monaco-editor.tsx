"use client";

import React, { useEffect, useState } from "react";
import Editor, { loader, OnMount } from "@monaco-editor/react";
import { JavaDiagnostic } from "@/lib/java";

interface LocalMonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  theme: "vs-dark" | "light";
  fontSize: number;
  diagnostics: JavaDiagnostic[];
  onRunShortcut?: () => void;
  onSubmitShortcut?: () => void;
}

export function LocalMonacoEditor({
  value,
  onChange,
  theme,
  fontSize,
  diagnostics,
  onRunShortcut,
  onSubmitShortcut,
}: LocalMonacoEditorProps) {
  const [ready, setReady] = useState(false);
  const [editorInstance, setEditorInstance] = useState<Parameters<OnMount>[0] | null>(null);
  const [monacoInstance, setMonacoInstance] = useState<Parameters<OnMount>[1] | null>(null);

  useEffect(() => {
    let mounted = true;
    // ★ 外部CDN（jsdelivr等）を一切使わず、npmパッケージの monaco-editor をローカルロードする
    import("monaco-editor").then((monaco) => {
      if (typeof window !== "undefined") {
        (window as unknown as { MonacoEnvironment?: unknown }).MonacoEnvironment = {
          getWorker() {
            const blob = new Blob(["self.onmessage = function() {};"], {
              type: "text/javascript",
            });
            return new Worker(URL.createObjectURL(blob));
          },
        };
      }
      loader.config({ monaco });
      if (mounted) setReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // コンパイルエラーの行・列に赤い波線（Marker）と行ハイライトを表示
  useEffect(() => {
    if (!editorInstance || !monacoInstance) return;
    const model = editorInstance.getModel();
    if (!model) return;

    const markers = diagnostics.map((d) => ({
      startLineNumber: d.line,
      startColumn: Math.max(1, d.column),
      endLineNumber: d.line,
      endColumn: Math.max(d.column + 1, d.endColumn ?? model.getLineMaxColumn(d.line)),
      message: `${d.message}\n💡 ${d.japaneseHint}`,
      severity: monacoInstance.MarkerSeverity.Error,
    }));

    monacoInstance.editor.setModelMarkers(model, "java-interpreter", markers);

    const decorations = diagnostics.map((d) => ({
      range: new monacoInstance.Range(d.line, 1, d.line, 1),
      options: {
        isWholeLine: true,
        className: "monaco-compile-error-line",
        glyphMarginClassName: "monaco-compile-error-glyph",
      },
    }));

    const collection = editorInstance.createDecorationsCollection(decorations);
    return () => {
      collection.clear();
    };
  }, [diagnostics, editorInstance, monacoInstance]);

  const handleEditorMount: OnMount = (editor, monaco) => {
    setEditorInstance(editor);
    setMonacoInstance(monaco);

    // Ctrl+Enter で「実行」
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunShortcut?.();
    });

    // Ctrl+Shift+Enter で「提出」
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
      () => {
        onSubmitShortcut?.();
      }
    );
  };

  if (!ready) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-900 text-slate-400 text-xs">
        ローカルJavaエディタを初期化中...
      </div>
    );
  }

  return (
    <Editor
      height="100%"
      defaultLanguage="java"
      language="java"
      theme={theme}
      value={value}
      onChange={(val) => onChange(val ?? "")}
      onMount={handleEditorMount}
      options={{
        fontSize,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        insertSpaces: true,
        glyphMargin: true,
        lineNumbers: "on",
        padding: { top: 12, bottom: 12 },
      }}
    />
  );
}
