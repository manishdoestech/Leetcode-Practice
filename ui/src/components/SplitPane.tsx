"use client";
import React, { ReactNode, useRef, useState, useEffect } from "react";

interface SplitPaneProps {
  left: ReactNode;
  right: ReactNode;
  minLeft?: number;
  minRight?: number;
  initial?: number; // initial left width in px
}

export function SplitPane({
  left,
  right,
  minLeft = 250,
  minRight = 250,
  initial = 500,
}: Readonly<SplitPaneProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState<number>(initial);
  const [dragging, setDragging] = useState(false);

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    if (!dragging || !containerRef.current) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      let newLeft = e.clientX - rect.left;
      const maxLeft = rect.width - minRight;
      if (newLeft < minLeft) newLeft = minLeft;
      if (newLeft > maxLeft) newLeft = maxLeft;
      setLeftWidth(newLeft);
    };
    const handleMouseUp = () => setDragging(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, minLeft, minRight]);

  return (
    <div
      ref={containerRef}
      className="flex w-full h-[70vh] min-h-[400px] max-h-[80vh] border border-border rounded-xl overflow-hidden bg-white dark:bg-black text-black dark:text-white shadow"
      style={{ resize: "none" }}
    >
      <div
        className="h-full overflow-auto bg-white dark:bg-black text-black dark:text-white"
        style={{
          width: leftWidth,
          minWidth: minLeft,
          maxWidth: `calc(100% - ${minRight}px)`,
        }}
      >
        {left}
      </div>
      <hr
        className="w-2 cursor-col-resize bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors h-full m-0"
        style={{ width: 8 }}
        onMouseDown={onMouseDown}
        draggable={false}
      />
      <div className="flex-1 min-w-[250px] h-full overflow-auto bg-white dark:bg-black text-black dark:text-white">
        {right}
      </div>
    </div>
  );
}

export default SplitPane;
