"use client";

import { Editor } from "@monaco-editor/react";

const LANGUAGE_MAP = {
  javascript: "javascript",
  python: "python",
  java: "java",
} as const;

type SupportedLanguage = keyof typeof LANGUAGE_MAP;

type CodeEditorProps = {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: SupportedLanguage;
};

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
}: CodeEditorProps) {
  return (
    <div className="rounded-md border bg-slate-950 text-slate-50">
      <div className="border-b bg-slate-800 px-4 py-2 font-mono text-sm">
        {language}
      </div>

      <div className="h-75 w-full">
        <Editor
          height="300px"
          defaultLanguage={LANGUAGE_MAP[language]}
          theme="vs-dark"
          value={value}
          onChange={onChange}
          options={{
            minimap: { enabled: false },
            fontSize: 18,
            lineNumbers: "on",
            readOnly: false,
            wordWrap: "on",
            formatOnPaste: true,
            formatOnType: true,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}