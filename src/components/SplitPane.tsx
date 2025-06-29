"use client";
import type React from "react";
import { type ReactNode, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { GlowingEffect } from "@/components/ui/glowing-effect";

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
    <div className="relative">
      <GlowingEffect glow={true} disabled={false} className="rounded-xl" />
      <div
        ref={containerRef}
        className="split-pane-container flex flex-col md:flex-row w-full h-auto md:h-[70vh] md:min-h-[400px] md:max-h-[80vh] border border-border rounded-xl overflow-hidden bg-white dark:bg-black text-black dark:text-white shadow"
        style={{ resize: "none" }}
      >
        <div
          className="relative split-pane-left w-full md:h-full overflow-y-auto overflow-x-hidden bg-white dark:bg-black text-black dark:text-white custom-scrollbar"
          style={{
            width: leftWidth,
            minWidth: minLeft,
            maxWidth: `calc(100% - ${minRight}px)`,
          }}
        >
          <GlowingEffect glow={true} disabled={false} />
          {left}
        </div>
        <button
          type="button"
          className="split-pane-separator hidden md:flex cursor-col-resize h-full m-0 relative overflow-hidden items-center justify-center splitter-gradient bg-transparent border-none p-0"
          style={{
            width: 4,
          }}
          onMouseDown={onMouseDown}
          draggable={false}
        >
          <GlowingEffect glow={true} disabled={false} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 via-transparent to-purple-500/10 animate-bounce"></div>
          <div className="absolute transform -rotate-90 select-none pointer-events-none flex items-center justify-center">
            <Image
              src="/hand.svg"
              alt="Drag"
              width={16}
              height={16}
              className="drop-shadow-lg"
            />
          </div>
        </button>
        <div className="relative split-pane-right w-full flex-1 md:min-w-[250px] h-auto md:h-full overflow-y-auto overflow-x-hidden bg-white dark:bg-black text-black dark:text-white custom-scrollbar">
          <GlowingEffect glow={true} disabled={false} />
          {right}
        </div>
      </div>
    </div>
  );
}

export default SplitPane;
