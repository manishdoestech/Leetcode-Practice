"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";

interface MarkdownContentProps {
  readonly content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const { theme } = useTheme();
  const processedContent = useMemo(() => {
    // Clean up the content and make it more readable
    const processed = content
      // Remove excessive whitespace
      .replace(/\n\s*\n\s*\n/g, "\n\n")
      // Fix spacing around HTML elements
      .replace(/>\s*</g, "><")
      // Add proper line breaks before certain elements
      .replace(/<(h[1-6]|p|div|ul|ol|li|pre|blockquote)/g, "\n<$1")
      // Add line breaks after certain closing tags
      .replace(/<\/(h[1-6]|p|div|ul|ol|pre|blockquote)>/g, "</$1>\n")
      // Clean up multiple newlines again
      .replace(/\n\s*\n\s*\n/g, "\n\n");

    return processed;
  }, [content]);

  return (
    <div
      className={`html-content prose max-w-none bg-white dark:bg-black text-gray-900 dark:text-white ${
        theme === "dark" ? "prose-invert" : ""
      }`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}
