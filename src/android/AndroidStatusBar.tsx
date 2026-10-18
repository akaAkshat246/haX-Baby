import React, { useState, useEffect } from "react";
import { useStore } from "../core/store";
import { audio } from "../core/audio";
import { Wifi, Volume2, VolumeX, Sparkles, MessageSquare, Music, BookOpen } from "lucide-react";

export const AndroidStatusBar: React.FC = () => {
  const [timeStr, setTimeStr] = useState("");
  const muted = useStore((s) => s.muted);
  const quickSettingsOpen = useStore((s) => s.quickSettingsOpen);
  const toggleQuickSettings = useStore((s) => s.toggleQuickSettings);
  const enterStory = useStore((s) => s.enterStory);
  const enterPanda = useStore((s) => s.enterPanda);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(
        d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    audio.click();
    toggleQuickSettings();
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 h-9 z-[1200] px-4 flex items-center justify-between bg-[#120817]/90 backdrop-blur-xl border-b border-[#ff85b8]/20 select-none text-xs font-sans text-white/90"
    >
      {/* Left: Notification Icons & Time */}
      <div className="flex items-center gap-3">
        <span className="font-semibold text-white tracking-wide text-xs">
          {timeStr || "12:00"}
        </span>

        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/10 text-white/70">
          <span title="Fourie Companion Active" className="flex items-center gap-1 text-[11px] text-[#ff85b8]">
            <Sparkles className="w-3.5 h-3.5 text-[#ff85b8]" />
          </span>
          <span title="Dial-Up Sound Service" className="text-white/60">
            <Music className="w-3.5 h-3.5" />
          </span>
          <span title="Lost & Found Messages" className="text-white/60">
            <MessageSquare className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Center: Desktop Mode Pill & Return to Story */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            audio.click();
            enterStory();
          }}
          className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ff85b8]/20 border border-[#ff85b8]/40 text-[#ffb6d9] hover:bg-[#ff85b8]/30 text-[11px] font-mono transition-colors cursor-pointer"
          title="Return to Story Landing Page"
        >
          <BookOpen className="w-3 h-3 text-[#ff85b8]" />
          <span>Story Landing</span>
        </button>

        <button
          type="button"
          onClick={() => {
            audio.click();
            enterPanda();
          }}
          className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ec4899]/25 border border-pink-400/40 text-pink-300 hover:bg-[#ec4899]/40 text-[11px] font-mono transition-colors cursor-pointer"
          title="Open 3D AI Kitty Room"
        >
          <Sparkles className="w-3 h-3 text-pink-400" />
          <span>3D Kitty Room</span>
        </button>

        <div className="hidden md:flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-[#d8b4c8]">
          <span className="w-2 h-2 rounded-full bg-[#ff85b8] shadow-[0_0_8px_#ff85b8] animate-pulse"></span>
          <span>Android 15 Desktop · Baby Pink Edition</span>
        </div>
      </div>

      {/* Right: Quick Status Pill (Clickable to open Quick Settings) */}
      <button
        type="button"
        onClick={handleClick}
        aria-label="Toggle Quick Settings and Notifications"
        aria-expanded={quickSettingsOpen}
        className="flex items-center gap-2.5 px-2.5 py-1 rounded-full hover:bg-[#ff85b8]/15 transition-colors focus:outline-none cursor-pointer"
      >
        <span className="font-mono text-[10px] text-white/80 font-bold tracking-wider">5G</span>
        <Wifi className="w-3.5 h-3.5 text-white/90" />
        {muted ? (
          <VolumeX className="w-3.5 h-3.5 text-[#ff3377]" />
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-[#ff85b8]" />
        )}

        {/* Battery with charging indicator */}
        <div className="flex items-center gap-1 font-mono text-[11px] text-white/90">
          <span>98%</span>
          <div className="w-5 h-2.5 rounded-sm border border-white/60 p-0.5 flex items-center relative">
            <div className="h-full bg-[#ff85b8] rounded-2xs w-[90%]" />
            <div className="w-0.5 h-1 bg-white/60 absolute -right-1 top-0.5 rounded-r-xs" />
          </div>
        </div>
      </button>
    </header>
  );
};

