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
      className="split-pane-container flex flex-col md:flex-row w-full h-auto md:h-[70vh] md:min-h-[400px] md:max-h-[80vh] border border-border rounded-xl overflow-hidden bg-white dark:bg-black text-black dark:text-white shadow"
      style={{ resize: "none" }}
    >
      <div
        className="split-pane-left w-full md:h-full overflow-auto bg-white dark:bg-black text-black dark:text-white"
        style={{
          width: leftWidth,
          minWidth: minLeft,
          maxWidth: `calc(100% - ${minRight}px)`,
        }}
      >
        {left}
      </div>
      <hr
        className="split-pane-separator hidden md:block cursor-col-resize bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors h-full m-0"
        style={{ width: 8 }}
        onMouseDown={onMouseDown}
        draggable={false}
      />
      <div className="split-pane-right w-full flex-1 md:min-w-[250px] h-auto md:h-full overflow-auto bg-white dark:bg-black text-black dark:text-white">
        {right}
      </div>
    </div>
  );
}

export default SplitPane;
