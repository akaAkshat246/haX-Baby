import React from "react";
import { useStore } from "../core/store";
import { audio } from "../core/audio";
import { Volume2, VolumeX, Heart } from "lucide-react";

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
      aria-label={muted ? "Unmute soothing audio" : "Mute audio"}
      aria-pressed={muted}
      onClick={handleClick}
      className={`fixed top-4 right-4 z-50 min-w-[48px] min-h-[48px] px-3.5 py-2.5 flex items-center justify-center gap-2 rounded-full backdrop-blur-md border-2 transition-all shadow-[0_6px_20px_rgba(10,8,25,0.4)] ${
        muted
          ? "bg-[#251f50]/90 border-[#ff9ec0] text-[#ff9ec0]"
          : "bg-[#251f50]/90 border-[#ffd97a] text-[#ffd97a]"
      } hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd97a]`}
      title={muted ? "Unmute Bedtime Lullaby" : "Mute Sound"}
    >
      {muted ? (
        <VolumeX className="w-5 h-5" />
      ) : (
        <Volume2 className="w-5 h-5 animate-pulse" />
      )}
      <span className="font-pixel text-[9px] uppercase hidden sm:inline font-bold">
        {muted ? "Muted" : "Lullaby"}
      </span>
    </button>
  );
};
