import React, { useState } from "react";
import { audio } from "../core/audio";
import { bus } from "../core/bus";
import { Star, Heart, Moon, Sun, Cloud } from "lucide-react";

interface Sticker {
  id: number;
  x: number;
  y: number;
  type: string;
}

export const GeoCitiesScene: React.FC = () => {
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
    <section
      id="scene-geocities"
      className="relative min-h-[90dvh] w-full flex flex-col items-center justify-center p-6 text-center select-none bg-[#040404]"
    >
      <div className="max-w-3xl space-y-4 z-10 w-full px-4">
        {/* Editorial Section Index */}
        <div className="editorial-index justify-center">
          <span>03</span>
          <span>/</span>
          <span>2000-2005 · The GeoCities Dream Shrine</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
          Handmade webs &amp; <span className="headline-serif">forgotten glitter.</span>
        </h2>

        {/* Nostalgic hax.baby Marquee */}
        <div className="w-full bg-[#090b10] border-y border-white/10 py-2.5 overflow-hidden text-xs font-mono text-[#00ff66]">
          <div className="animate-marquee whitespace-nowrap flex gap-10">
            <span>WELCOME TO BABY FOURIE'S COZY CORNER</span>
            <span className="text-white/60">SLEEP TIGHT IN THE 404 SANCTUARY</span>
            <span>NO DIGITAL MEMORY IS EVER LOST</span>
            <span className="text-white/60">BEST VIEWED IN 800x600 NOSTALGIA</span>
          </div>
        </div>

        <p className="font-sans text-sm text-[#9da3b4] max-w-lg mx-auto leading-relaxed">
          In the 2000s, websites were intimate personal scrapbooks with animated glitter, starry backgrounds, and webrings. When whole GeoCities neighborhoods went dark, Fourie caught the sparkle in their satchel.
        </p>

        {/* Pin Stamp Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xs pt-1">
          <span className="text-[#555c6d] uppercase tracking-wider text-[11px]">MARKER:</span>
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
              className={`px-3.5 py-1.5 rounded-full border transition-all text-xs flex items-center gap-1.5 ${
                selectedSticker === item.id
                  ? "bg-[#00ff66] text-black border-[#00ff66] font-semibold shadow-[0_0_12px_rgba(0,255,102,0.4)]"
                  : "bg-white/[0.04] text-[#9da3b4] border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Interactive Pin Corkboard */}
        <div
          onClick={handleBoardClick}
          className="w-full h-[280px] bg-[#090b10] border border-white/10 rounded-2xl relative overflow-hidden cursor-crosshair shadow-[0_20px_50px_rgba(0,0,0,0.85)] group"
          title="Click anywhere to place neon memory markers!"
        >
          {/* Subtle dot-grid pattern */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#00ff66_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Prompt banner in center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center font-mono text-[#555c6d] text-xs select-none">
            [ CLICK ANYWHERE TO PLACE NEON MEMORY MARKERS ]
          </div>

          {/* Stamped Markers */}
          {stickers.map((s) => (
            <div
              key={s.id}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
            >
              {s.type === "star" && <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />}
              {s.type === "heart" && <Heart className="w-6 h-6 text-pink-400 fill-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]" />}
              {s.type === "moon" && <Moon className="w-6 h-6 text-cyan-400 fill-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />}
              {s.type === "sun" && <Sun className="w-6 h-6 text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />}
              {s.type === "cloud" && <Cloud className="w-6 h-6 text-purple-400 fill-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" />}
            </div>
          ))}
        </div>

        {/* 88x31 Badges in hax.baby Showcase */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <div className="w-[88px] h-[31px] bg-[#0e1117] border border-white/10 rounded flex flex-col items-center justify-center text-[7px] text-white font-mono shadow-sm">
            <span>BEDTIME</span>
            <span className="text-[#00ff66]">CERTIFIED</span>
          </div>

          <div className="w-[88px] h-[31px] bg-[#0e1117] border border-white/10 rounded flex flex-col items-center justify-center text-[7px] text-white font-mono shadow-sm">
            <span>SWEET DREAMS</span>
            <span className="text-[#ff3366]">404 ARCHIVE</span>
          </div>

          <div className="w-[88px] h-[31px] bg-[#0e1117] border border-[#00ff66]/40 rounded flex flex-col items-center justify-center text-[7px] text-[#00ff66] font-mono shadow-sm">
            <span>BABY SPIRIT</span>
            <span className="text-white">TRACK 2</span>
          </div>

          <div className="w-[88px] h-[31px] bg-[#0e1117] border border-white/10 rounded flex flex-col items-center justify-center text-[7px] text-white font-mono shadow-sm">
            <span>WEBRING</span>
            <span className="text-[#00e5ff]">#404 BABY</span>
          </div>
        </div>
      </div>
    </section>
  );
};
