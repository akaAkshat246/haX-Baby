import React, { useState } from "react";
import { audio } from "../../core/audio";
import { bus } from "../../core/bus";
import { Globe } from "lucide-react";

interface Sticker {
  id: number;
  x: number;
  y: number;
  type: string;
}

export const GeoCitiesWindow: React.FC = () => {
  const [stickers, setStickers] = useState<Sticker[]>([
    { id: 1, x: 22, y: 35, type: "star" },
    { id: 2, x: 76, y: 28, type: "heart" },
    { id: 3, x: 48, y: 65, type: "moon" },
  ]);
  const [selectedSticker, setSelectedSticker] = useState("star");

  const handleBoardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    audio.click();
    bus.emit("poke", { x: e.clientX, y: e.clientY });

    setStickers((prev) => [
      ...prev.slice(-14),
      { id: Date.now(), x, y, type: selectedSticker },
    ]);
  };

  return (
    <div className="space-y-4 font-sans text-sm">
      <div className="p-3 bg-[#0e1117] rounded-xl border border-white/10 text-xs font-mono flex items-center justify-between text-[#9da3b4]">
        <span className="flex items-center gap-2 text-white">
          <Globe className="w-4 h-4 text-[#00ff66]" />
          <span>GEOCITIES MEMORY SHRINE &amp; CORKBOARD</span>
        </span>
        <span className="text-[#00ff66]">EST. 1999</span>
      </div>

      {/* Marquee Banner */}
      <div className="w-full bg-[#090b10] border border-white/10 py-1.5 rounded-lg overflow-hidden text-xs font-mono text-[#00ff66]">
        <div className="animate-marquee whitespace-nowrap flex gap-8">
          <span>✦ WELCOME TO BABY FOURIE'S SHRINE</span>
          <span className="text-white/60">✦ 88x31 BADGES PRESERVED</span>
          <span>✦ TAP ANYWHERE TO STAMP BABY MEMORIES</span>
        </div>
      </div>

      {/* Stamp Selector */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <span className="text-[#555c6d] uppercase text-[10px]">Stamp:</span>
        {[
          { id: "star", label: "⭐ Star" },
          { id: "heart", label: "💖 Heart" },
          { id: "moon", label: "🌙 Moon" },
          { id: "teddy", label: "🧸 Baby" },
          { id: "cloud", label: "☁️ Cloud" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              audio.click();
              setSelectedSticker(item.id);
            }}
            className={`px-3 py-1 rounded-full border text-xs transition-colors ${
              selectedSticker === item.id
                ? "bg-[#00ff66] text-black border-[#00ff66] font-semibold"
                : "bg-white/[0.04] text-[#9da3b4] border-white/10 hover:border-white/20"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Corkboard */}
      <div
        onClick={handleBoardClick}
        className="w-full h-[220px] bg-[#090b10] border border-white/10 rounded-xl relative overflow-hidden cursor-crosshair group shadow-inner"
        title="Tap to stamp sticker"
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#00ff66_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center font-mono text-[#555c6d] text-xs">
          [ TAP TO STAMP MEMORIES ]
        </div>

        {stickers.map((s) => (
          <div
            key={s.id}
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none text-2xl animate-bounce"
          >
            {s.type === "star" && "⭐"}
            {s.type === "heart" && "💖"}
            {s.type === "moon" && "🌙"}
            {s.type === "teddy" && "🧸"}
            {s.type === "cloud" && "☁️"}
          </div>
        ))}
      </div>

      {/* 88x31 Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        <div className="w-[88px] h-[31px] bg-[#0e1117] border border-white/10 rounded flex flex-col items-center justify-center text-[7px] text-white font-mono">
          <span>BEDTIME</span>
          <span className="text-[#00ff66]">CERTIFIED</span>
        </div>
        <div className="w-[88px] h-[31px] bg-[#0e1117] border border-white/10 rounded flex flex-col items-center justify-center text-[7px] text-white font-mono">
          <span>SWEET DREAMS</span>
          <span className="text-[#ff3366]">404 ARCHIVE</span>
        </div>
        <div className="w-[88px] h-[31px] bg-[#0e1117] border border-[#00ff66]/40 rounded flex flex-col items-center justify-center text-[7px] text-[#00ff66] font-mono">
          <span>BABY SPIRIT</span>
          <span className="text-white">TRACK 2</span>
        </div>
      </div>
    </div>
  );
};
