import React, { useEffect, useRef, useState } from "react";
import { useStore, WindowId } from "../core/store";
import { audio } from "../core/audio";
import { Minus, Square, Maximize2, Minimize2, X, Folder } from "lucide-react";

interface AndroidWindowProps {
  id: WindowId;
  title: string;
  icon?: React.ReactNode;
  defaultX?: number;
  defaultY?: number;
  width?: number;
  height?: number;
  children: React.ReactNode;
}

export const AndroidWindow: React.FC<AndroidWindowProps> = ({
  id,
  title,
  icon,
  defaultX = 0,
  defaultY = 0,
  width = 540,
  height = 580,
  children,
}) => {
  const isOpen = useStore((s) => s.openWindows.includes(id));
  const isMinimized = useStore((s) => s.minimizedWindows.includes(id));
  const isMaximized = useStore((s) => s.maximizedWindow === id);
  const zIndex = useStore((s) => s.zIndices[id] ?? 20);
  const closeWindow = useStore((s) => s.closeWindow);
  const focusWindow = useStore((s) => s.focusWindow);
  const minimizeWindow = useStore((s) => s.minimizeWindow);
  const toggleMaximizeWindow = useStore((s) => s.toggleMaximizeWindow);

  const [position, setPosition] = useState({ x: defaultX, y: defaultY });
  const dragStartRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeWindow(id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, id, closeWindow]);

  if (!isOpen || isMinimized) return null;

  const handlePointerDown = () => {
    focusWindow(id);
  };

  const handleHeaderPointerDown = (e: React.PointerEvent) => {
    if (isMaximized) return;
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

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    audio.click();
    minimizeWindow(id);
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    audio.click();
    toggleMaximizeWindow(id);
  };

  return (
    <div
      role="dialog"
      aria-label={title}
      tabIndex={-1}
      onPointerDown={handlePointerDown}
      style={{
        zIndex,
        width: isMaximized ? "100vw" : `${width}px`,
        maxWidth: "96vw",
        maxHeight: isMaximized ? undefined : `${height}px`,
        transform: isMaximized
          ? undefined
          : `translate3d(calc(-50% + ${position.x}px), ${position.y}px, 0)`,
        left: isMaximized ? 0 : "50%",
        top: isMaximized ? 0 : "7vh",
      }}
      className={`android-window ${isMaximized ? "maximized" : ""}`}
    >
      {/* Material 3 Window Header Bar */}
      <div
        className="android-window-header"
        onPointerDown={handleHeaderPointerDown}
      >
        {/* App Title & Icon */}
        <div className="flex items-center gap-2.5 overflow-hidden select-none">
          <span className="text-base">{icon}</span>
          <span className="font-sans font-semibold text-xs text-white/90 truncate tracking-wide">
            {title}
          </span>
        </div>

        {/* Freeform Action Controls (Minimize, Maximize, Close) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Minimize"
            onClick={handleMinimize}
            className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-[#9da3b4] hover:text-white transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            aria-label="Maximize / Restore"
            onClick={handleMaximize}
            className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-[#9da3b4] hover:text-white transition-colors"
          >
            {isMaximized ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            className="w-7 h-7 rounded-full hover:bg-[#ff3366] hover:text-white flex items-center justify-center text-[#9da3b4] transition-colors ml-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="android-window-body p-4 sm:p-5 font-sans text-sm text-[#f4f4f6]">
        {children}
      </div>
    </div>
  );
};
