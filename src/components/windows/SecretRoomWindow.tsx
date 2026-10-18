import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { audio } from "../../core/audio";
import { useStore } from "../../core/store";
import { Terminal, Sparkles, ArrowUpRight } from "lucide-react";

export const SecretRoomWindow: React.FC = () => {
  const unlockSecret = useStore((s) => s.unlockSecret);

  useEffect(() => {
    unlockSecret();
    audio.glitch();

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#00ff66", "#00e5ff", "#ffb703", "#ff3366"],
      });
    } catch {}
  }, [unlockSecret]);

  const playHandshake = async () => {
    await audio.unlock();
    audio.playDialUpSimulation();
  };

  return (
    <div className="space-y-4 bg-[#0e1117] text-[#00ff66] p-4 font-mono text-xs rounded-xl border border-[#00ff66]/30 shadow-[0_0_25px_rgba(0,255,102,0.15)]">
      {/* Glitch Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <span className="flex items-center gap-2 text-white">
          <Terminal className="w-4 h-4 text-[#00ff66] animate-pulse" />
          <span>PORTAL: /NOWHERE // 404 BACKROOM</span>
        </span>
        <span className="bg-[#ff3366] text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
          CLASSIFIED
        </span>
      </div>

      <div className="space-y-2 text-xs leading-relaxed">
        <p className="text-white font-medium">
          &gt; SYSTEM BREACH: YOU HAVE DISCOVERED THE DEEP VOID!
        </p>
        <p className="text-[#9da3b4]">
          This is where deleted subnets, forgotten FTP archives, and orphan packets gather before Fourie shelves them into eternal slumber.
        </p>
      </div>

      {/* Secret Badge Award */}
      <div className="p-4 bg-[#090b10] border border-white/10 rounded-xl flex flex-col items-center gap-2 text-center">
        <span className="text-xs text-[#00ff66] font-medium">
          ✦ UNLOCKED SECRET COLLECTIBLE BADGE ✦
        </span>

        <div className="w-[88px] h-[31px] bg-[#0e1117] border border-[#00ff66] rounded flex flex-col items-center justify-center text-[7px] text-white shadow-[0_0_12px_#00ff66]">
          <span className="text-[#00ff66] font-bold">FOURIE 404</span>
          <span className="text-[6px] text-white/80">LOST &amp; FOUND</span>
        </div>

        <span className="text-[11px] text-[#555c6d]">
          Added to your persistent footer trophy rack!
        </span>
      </div>

      {/* Procedural Dial-Up audio test */}
      <div className="pt-2">
        <button
          type="button"
          onClick={playHandshake}
          className="w-full py-2.5 bg-white text-black font-medium text-xs rounded-full hover:bg-[#00ff66] transition-colors flex items-center justify-center gap-2 group"
        >
          <Sparkles className="w-4 h-4 text-black" />
          <span>Trigger 56K Modem Handshake Sequence</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
};
