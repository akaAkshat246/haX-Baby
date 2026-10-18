import React, { useState } from "react";
import { audio } from "../../core/audio";
import { bus } from "../../core/bus";
import { Globe, Star, Heart, Moon, Sun, Cloud } from "lucide-react";

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
      <div className="w-full bg-[#090b10] border border-white/10 rounded-lg py-1.5 overflow-hidden text-[11px] font-mono text-[#00ff66]">
        <div className="animate-marquee whitespace-nowrap flex gap-8">
          <span>WELCOME TO BABY FOURIE'S SHRINE</span>
          <span className="text-white/60">88x31 BADGES PRESERVED</span>
          <span>TAP ANYWHERE TO PLACE MEMORY MARKERS</span>
        </div>
      </div>

      {/* Stamp Selector */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <span className="text-[#555c6d] uppercase text-[10px]">Marker:</span>
        {[
          { id: "star", label: "Star", icon: <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> },
          { id: "heart", label: "Heart", icon: <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" /> },
          { id: "moon", label: "Moon", icon: <Moon className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" /> },
          { id: "sun", label: "Sun", icon: <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> },
          { id: "cloud", label: "Cloud", icon: <Cloud className="w-3.5 h-3.5 text-purple-400 fill-purple-400" /> },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              audio.click();
              setSelectedSticker(item.id);
            }}
            className={`px-3 py-1 rounded-full border text-xs flex items-center gap-1.5 transition-colors ${
              selectedSticker === item.id
                ? "bg-[#00ff66] text-black border-[#00ff66] font-semibold"
                : "bg-white/[0.04] text-[#9da3b4] border-white/10 hover:border-white/20"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Corkboard */}
      <div
        onClick={handleBoardClick}
        className="w-full h-[220px] bg-[#090b10] border border-white/10 rounded-xl relative overflow-hidden cursor-crosshair group shadow-inner"
        title="Tap to place marker"
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#00ff66_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center font-mono text-[#555c6d] text-xs">
          [ TAP TO PLACE MEMORIES ]
        </div>

        {stickers.map((s) => (
          <div
            key={s.id}
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          >
            {s.type === "star" && <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]" />}
            {s.type === "heart" && <Heart className="w-5 h-5 text-pink-400 fill-pink-400 drop-shadow-[0_0_6px_rgba(244,114,182,0.8)]" />}
            {s.type === "moon" && <Moon className="w-5 h-5 text-cyan-400 fill-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]" />}
            {s.type === "sun" && <Sun className="w-5 h-5 text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" />}
            {s.type === "cloud" && <Cloud className="w-5 h-5 text-purple-400 fill-purple-400 drop-shadow-[0_0_6px_rgba(192,132,252,0.8)]" />}
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
        <div className="w-[88px] h-[31px] bg-[#0e1117] border border-white/10 rounded flex flex-col items-center justify-center text-[7px] text-white font-mono">
          <span>WEBRING</span>
          <span className="text-[#00e5ff]">#404 BABY</span>
        </div>
      </div>
    </div>
  );
};
