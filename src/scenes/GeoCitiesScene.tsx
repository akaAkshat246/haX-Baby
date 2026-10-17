import React, { useState } from "react";
import { audio } from "../core/audio";
import { bus } from "../core/bus";
import { Sparkles, Heart } from "lucide-react";

interface Sticker {
  id: number;
  x: number;
  y: number;
  type: string;
}

export const GeoCitiesScene: React.FC = () => {
  const [stickers, setStickers] = useState<Sticker[]>([
    { id: 1, x: 20, y: 35, type: "star" },
    { id: 2, x: 78, y: 30, type: "heart" },
    { id: 3, x: 50, y: 65, type: "moon" },
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
      className="relative min-h-[90dvh] w-full flex flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-b from-[#161234] via-[#1c1742] to-[#14112e]"
    >
      <div className="max-w-3xl space-y-4 z-10 w-full">
        <div className="inline-block px-3.5 py-1 bg-[#231d4e] border border-[#ff9ec0]/50 text-[#ffccd5] font-pixel text-xs rounded-full uppercase">
          Era 2: 2000-2005 // The GeoCities Dream Shrine
        </div>

        <h2 className="text-2xl sm:text-4xl font-pixel text-[#ffffff] tracking-wide drop-shadow">
          PASTEL SHRINE &amp; DREAMS
        </h2>

        {/* Nostalgic Soothing Marquee */}
        <div className="w-full bg-[#1e1948] border-y-2 border-[#7c6fd6] py-2 overflow-hidden text-xs font-pixel text-[#ffd97a]">
          <div className="animate-marquee whitespace-nowrap flex gap-8">
            <span>✦ WELCOME TO BABY FOURIE'S COZY CORNER ✦</span>
            <span>✦ SLEEP TIGHT IN THE 404 NURSERY ✦</span>
            <span>✦ NO DIGITAL MEMORY IS EVER FORGOTTEN ✦</span>
            <span>✦ BEST VIEWED IN BEDTIME RESOLUTION ✦</span>
          </div>
        </div>

        <p className="font-display text-sm text-[#c8bffd] max-w-lg mx-auto leading-relaxed">
          In the 2000s, websites were cozy handmade scrapbooks with animated glitter, starry backgrounds, and webrings. When whole GeoCities neighborhoods went dark, Fourie caught all the glitter in their floppy pouch.
        </p>

        {/* Cuddly Baby Sticker Palette */}
        <div className="flex flex-wrap items-center justify-center gap-2 font-pixel text-[10px]">
          <span className="text-[#a89bf0]">STICKER STAMP:</span>
          {[
            { id: "star", label: "⭐ Star" },
            { id: "heart", label: "💖 Heart" },
            { id: "moon", label: "🌙 Moon" },
            { id: "teddy", label: "🧸 Teddy" },
            { id: "cloud", label: "☁️ Cloud" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                audio.click();
                setSelectedSticker(item.id);
              }}
              className={`px-3 py-1.5 rounded-full border transition-all ${
                selectedSticker === item.id
                  ? "bg-[#ffd97a] text-[#1c1838] border-white font-bold scale-105 shadow-[0_2px_10px_rgba(255,217,122,0.4)]"
                  : "bg-[#251f50] text-[#c8bffd] border-[#4b3f80] hover:border-[#ffd97a]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Interactive Sticker Scrapbook Corkboard */}
        <div
          onClick={handleBoardClick}
          className="w-full h-[270px] bg-[#1a153c] border-3 border-[#7c6fd6] rounded-2xl relative overflow-hidden cursor-crosshair shadow-[0_12px_36px_rgba(0,0,0,0.5)]"
          title="Click anywhere to stamp cozy stickers!"
        >
          {/* Subtle starry background grid */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffd97a_1.5px,transparent_1.5px)] [background-size:20px_20px]" />

          {/* Prompt banner in center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center font-pixel text-[#8d7eb8] text-xs opacity-50 select-none">
            [ TAP ANYWHERE TO STAMP BABY GLITTER ]
          </div>

          {/* Stamped Stickers */}
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

        {/* Soothing Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <div className="w-[88px] h-[31px] bg-gradient-to-r from-[#483d8b] to-[#6a5acd] border border-[#a89bf0] rounded flex flex-col items-center justify-center text-[7px] text-white font-pixel shadow-sm">
            <span>BEDTIME</span>
            <span className="text-[#ffd97a]">CERTIFIED</span>
          </div>

          <div className="w-[88px] h-[31px] bg-gradient-to-r from-[#b53471] to-[#ee5253] border border-[#ff9ec0] rounded flex flex-col items-center justify-center text-[7px] text-white font-pixel shadow-sm">
            <span>SWEET DREAMS</span>
            <span className="text-[#ffd97a]">404 ARCHIVE</span>
          </div>

          <div className="w-[88px] h-[31px] bg-[#120f2c] border border-[#ffd97a] rounded flex flex-col items-center justify-center text-[7px] text-[#ffd97a] font-pixel shadow-sm">
            <span>BABY SPIRIT</span>
            <span className="text-white">TRACK 2</span>
          </div>

          <div className="w-[88px] h-[31px] bg-[#5f27cd] border border-[#ff9ec0] rounded flex flex-col items-center justify-center text-[7px] text-white font-pixel shadow-sm">
            <span>WEBRING</span>
            <span className="text-[#ff9ec0]">#404 BABY</span>
          </div>
        </div>
      </div>
    </section>
  );
};
