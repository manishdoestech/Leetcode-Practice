"use client";

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { markdown } from "@codemirror/lang-markdown";
import { sql } from "@codemirror/lang-sql";
import { json } from "@codemirror/lang-json";

interface CodeBlockProps {
  readonly code: string;
  readonly language: string;
  readonly filename?: string;
}

function getLanguageExtension(language: string) {
  switch (language) {
    case "python":
      return python();
    case "javascript":
    case "js":
      return javascript();
    case "java":
      return java();
    case "cpp":
    case "c++":
      return cpp();
    case "markdown":
      return markdown();
    case "sql":
      return sql();
    case "json":
      return json();
    default:
      return [];
  }
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  return (
    <div className="w-full">
      {filename && (
        <div className="bg-gray-100 px-4 py-2 text-sm text-gray-700 font-mono border border-gray-200 rounded-t-lg">
          {filename}
        </div>
      )}
      <CodeMirror
        value={code}
        height="auto"
        minHeight="120px"
        maxHeight="400px"
        theme={oneDark}
        extensions={[getLanguageExtension(language)]}
        readOnly
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: false,
          highlightActiveLineGutter: false,
        }}
        style={{
          fontSize: 14,
          borderTopLeftRadius: filename ? 0 : 8,
          borderTopRightRadius: filename ? 0 : 8,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          border: "1px solid #e5e7eb",
          margin: 0,
          background: "#18181b",
        }}
      />
    </div>
  );
}
