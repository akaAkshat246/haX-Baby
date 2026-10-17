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
      className={`fixed top-4 right-4 z-50 min-w-[48px] min-h-[48px] p-2.5 flex items-center justify-center gap-2 rounded bg-void-800 text-paper border-2 ${
        muted ? "border-glitch-magenta text-glitch-magenta" : "border-glitch-cyan text-glitch-cyan"
      } shadow-[3px_3px_0px_#000] hover:scale-105 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-glitch-cyan`}
      title={muted ? "Unmute Sound" : "Mute Sound"}
    >
      {muted ? (
        <VolumeX className="w-5 h-5" />
      ) : (
        <Volume2 className="w-5 h-5 animate-pulse" />
      )}
      <span className="font-pixel text-[9px] uppercase hidden sm:inline">
        {muted ? "Muted" : "Sound"}
      </span>
    </button>
  );
};
