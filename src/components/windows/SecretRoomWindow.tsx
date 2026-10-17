import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { audio } from "../../core/audio";
import { useStore } from "../../core/store";
import { Key, ShieldAlert, Sparkles, Terminal } from "lucide-react";

export const SecretRoomWindow: React.FC = () => {
  const unlockSecret = useStore((s) => s.unlockSecret);

  useEffect(() => {
    unlockSecret();
    audio.glitch();

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#00f0ff", "#ff007f", "#ffb703", "#00ff66"],
      });
    } catch {}
  }, [unlockSecret]);

  const playHandshake = async () => {
    await audio.unlock();
    audio.playDialUpSimulation();
  };

  return (
    <div className="space-y-4 bg-black text-glitch-green p-3 font-pixel text-xs rounded border-2 border-glitch-green shadow-[0_0_15px_rgba(0,255,102,0.3)]">
      {/* Glitch Header */}
      <div className="flex items-center justify-between border-b border-glitch-green pb-2">
        <span className="flex items-center gap-2 text-glitch-cyan">
          <Terminal className="w-4 h-4 animate-pulse" />
          <span>PORTAL: /NOWHERE // 404 BACKROOM</span>
        </span>
        <span className="bg-glitch-magenta text-white px-1.5 py-0.5 text-[9px]">
          CLASSIFIED
        </span>
      </div>

      <div className="space-y-2 text-xs font-mono leading-relaxed">
        <p className="text-white">
          &gt; SYSTEM BREACH: YOU HAVE DISCOVERED THE DEEP VOID!
        </p>
        <p className="text-gray-300">
          This is where deleted subnets, forgotten FTP archives, and orphan packets gather before Fourie shelves them.
        </p>
      </div>

      {/* Secret 88x31 Badge Award */}
      <div className="p-3 bg-void-900 border border-glitch-green/60 rounded flex flex-col items-center gap-2 text-center">
        <span className="text-[10px] text-glitch-amber">
          ✦ UNLOCKED SECRET COLLECTIBLE BADGE ✦
        </span>

        <div className="w-[88px] h-[31px] bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 border border-glitch-cyan flex flex-col items-center justify-center text-[7px] text-white shadow-[0_0_8px_#00f0ff]">
          <span className="text-glitch-amber font-bold">FOURIE 404</span>
          <span className="text-[6px] text-glitch-cyan">LOST &amp; FOUND</span>
        </div>

        <span className="text-[9px] text-gray-400 font-display">
          Added to your persistent footer trophy rack!
        </span>
      </div>

      {/* Procedural Dial-Up audio test */}
      <div className="pt-2">
        <button
          type="button"
          onClick={playHandshake}
          className="w-full py-2 bg-glitch-green text-black font-pixel text-[10px] uppercase font-bold hover:bg-green-400 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-black" />
          <span>Trigger 56K Modem Handshake Sequence</span>
        </button>
      </div>
    </div>
  );
};
