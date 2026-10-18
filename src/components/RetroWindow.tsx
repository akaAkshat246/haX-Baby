import React, { useEffect, useRef, useState } from "react";
import { useStore, WindowId } from "../core/store";
import { audio } from "../core/audio";

interface RetroWindowProps {
  id: WindowId;
  title: string;
  icon?: React.ReactNode;
  defaultXOffset?: number;
  children: React.ReactNode;
}

export const RetroWindow: React.FC<RetroWindowProps> = ({
  id,
  title,
  icon,
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
        <div className="flex items-center gap-3 select-none overflow-hidden text-ellipsis whitespace-nowrap">
          <div className="win__dots">
            <span className="win__dot win__dot--close" />
            <span className="win__dot win__dot--min" />
            <span className="win__dot win__dot--max" />
          </div>
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="text-sm">{icon}</span>
            <span className="font-mono text-xs text-white/90 truncate tracking-wide font-medium">{title}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            aria-label={`Close ${title}`}
            onClick={handleClose}
            onPointerDown={(e) => e.stopPropagation()}
            className="win__close-btn"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="win__body flex-1 overflow-y-auto font-sans text-sm text-[#f4f4f6]">
        {children}
      </div>

      {/* Sleek hax.baby Status Footer */}
      <div className="border-t border-white/10 px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-[#555c6d] bg-[#0e1117]/80">
        <span className="flex items-center gap-1.5">
          <span className="status-dot"></span>
          <span className="text-[#9da3b4]">PARCEL CACHE ACTIVE</span>
        </span>
        <span>404 SANCTUARY</span>
      </div>
    </div>
  );
};
