import React, { useEffect, useRef, useState } from "react";
import { useStore, WindowId } from "../core/store";
import { audio } from "../core/audio";

interface RetroWindowProps {
  id: WindowId;
  title: string;
  icon?: string;
  defaultXOffset?: number;
  children: React.ReactNode;
}

export const RetroWindow: React.FC<RetroWindowProps> = ({
  id,
  title,
  icon = "📁",
  defaultXOffset = 0,
  children,
}) => {
  const isOpen = useStore((s) => s.openWindows.includes(id));
  const zIndex = useStore((s) => s.zIndices[id] ?? 20);
  const shape = useStore((s) => s.shape);
  const closeWindow = useStore((s) => s.closeWindow);
  const focusWindow = useStore((s) => s.focusWindow);

  const isSheet = shape === "pocket" || shape === "phone";
  const windowRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: defaultXOffset, y: 0 });
  const dragStartRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Esc key closes top window
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeWindow(id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Focus window when opened
    windowRef.current?.focus();

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, id, closeWindow]);

  if (!isOpen) return null;

  const handlePointerDown = () => {
    focusWindow(id);
  };

  const handleBarPointerDown = (e: React.PointerEvent) => {
    if (isSheet) return; // Disable drag on phone bottom-sheets
    focusWindow(id);

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: position.x,
      origY: position.y,
    };

    const handlePointerMove = (ev: PointerEvent) => {
      if (!dragStartRef.current) return;
      const dx = ev.clientX - dragStartRef.current.startX;
      const dy = ev.clientY - dragStartRef.current.startY;
      setPosition({
        x: dragStartRef.current.origX + dx,
        y: dragStartRef.current.origY + dy,
      });
    };

    const handlePointerUp = () => {
      dragStartRef.current = null;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    audio.click();
    closeWindow(id);
  };

  return (
    <div
      ref={windowRef}
      role="dialog"
      aria-label={title}
      tabIndex={-1}
      onPointerDown={handlePointerDown}
      style={{
        zIndex,
        transform: isSheet
          ? undefined
          : `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
      className={`win ${isSheet ? "win--sheet" : ""}`}
    >
      {/* Title Bar */}
      <div
        className="win__bar flex items-center justify-between"
        onPointerDown={handleBarPointerDown}
      >
        <div className="flex items-center gap-2 select-none overflow-hidden text-ellipsis whitespace-nowrap">
          <span>{icon}</span>
          <span className="font-pixel text-[11px] truncate tracking-wide">{title}</span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            aria-label={`Close ${title}`}
            onClick={handleClose}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-6 h-6 flex items-center justify-center font-bold text-xs"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="win__body flex-1 overflow-y-auto font-display text-sm">
        {children}
      </div>

      {/* Retro Status Bar */}
      <div className="retro-bevel-inset mx-2 mb-2 px-2 py-1 flex items-center justify-between text-[10px] font-pixel text-gray-700 bg-gray-200">
        <span>STATUS: RESCUED</span>
        <span>404 OFFICE</span>
      </div>
    </div>
  );
};
