import React from "react";
import { useStore } from "../core/store";
import { audio } from "../core/audio";
import { Volume2, VolumeX } from "lucide-react";

export const MuteButton: React.FC = () => {
  const muted = useStore((s) => s.muted);
  const toggleMute = useStore((s) => s.toggleMute);

  const handleClick = async () => {
    await audio.unlock();
    audio.click();
    toggleMute();
  };

  return (
    <button
      id="global-mute-toggle"
      type="button"
      aria-label={muted ? "Unmute audio" : "Mute audio"}
      aria-pressed={muted}
      onClick={handleClick}
      className={`fixed top-4 right-4 z-50 min-h-[38px] px-3.5 py-1.5 flex items-center justify-center gap-2 rounded-full backdrop-blur-xl border transition-all shadow-[0_8px_24px_rgba(0,0,0,0.6)] ${
        muted
          ? "bg-[#090b10]/90 border-white/10 text-[#555c6d]"
          : "bg-[#090b10]/90 border-[#00ff66]/40 text-white hover:border-[#00ff66]"
      } hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff66]`}
      title={muted ? "Unmute Lullaby" : "Mute Sound"}
    >
      {muted ? (
        <VolumeX className="w-4 h-4 text-[#ff3366]" />
      ) : (
        <Volume2 className="w-4 h-4 text-[#00ff66] animate-pulse" />
      )}
      <span className="font-mono text-xs hidden sm:inline">
        {muted ? "Muted" : "Audio On"}
      </span>
      {!muted && <span className="status-dot"></span>}
    </button>
  );
};
