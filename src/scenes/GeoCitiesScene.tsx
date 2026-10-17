import React, { useState } from "react";
import { audio } from "../core/audio";
import { bus } from "../core/bus";
import { Sparkles, Stamp, Flame, AlertTriangle } from "lucide-react";

interface Sticker {
  id: number;
  x: number;
  y: number;
  type: string;
}

export const GeoCitiesScene: React.FC = () => {
  const [stickers, setStickers] = useState<Sticker[]>([
    { id: 1, x: 15, y: 30, type: "cone" },
    { id: 2, x: 80, y: 25, type: "flame" },
    { id: 3, x: 50, y: 70, type: "star" },
  ]);
  const [selectedSticker, setSelectedSticker] = useState("cone");

  const handleBoardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    audio.click();
    bus.emit("poke", { x: e.clientX, y: e.clientY });

    setStickers((prev) => [
      ...prev.slice(-14), // keep max 15 stickers
      { id: Date.now(), x, y, type: selectedSticker },
    ]);
  };

  return (
    <section
      id="scene-geocities"
      className="relative min-h-[90dvh] w-full flex flex-col items-center justify-center p-6 text-center select-none"
    >
      <div className="max-w-3xl space-y-4 z-10 w-full">
        <div className="inline-block px-3 py-1 bg-void-800 border border-glitch-amber text-glitch-amber font-pixel text-xs rounded uppercase">
          Era 2: 2000-2005 // The GeoCities & Webring Age
        </div>

        <h2 className="text-2xl sm:text-4xl font-pixel text-paper tracking-wide">
          GEOCITIES GLITCH SHRINE
        </h2>

        {/* Nostalgic Marquee Ticker */}
        <div className="w-full bg-void-900 border-y-2 border-glitch-cyan py-2 overflow-hidden text-xs font-pixel text-glitch-cyan">
          <div className="animate-marquee whitespace-nowrap flex gap-8">
            <span>✦ WELCOME TO FOURIE'S 404 SANCTUARY ✦</span>
            <span>✦ BEST VIEWED IN 800x600 RESOLUTION ✦</span>
            <span>✦ UNDER CONSTRUCTION FOREVER ✦</span>
            <span>✦ JOIN THE 404 WEBRING ✦</span>
          </div>
        </div>

        <p className="font-display text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
          In the 2000s, the web was built by hand with blinking text, spinning skulls, and hand-coded HTML. When whole neighborhoods of GeoCities and Angelfire dissolved, Fourie caught the lost glitter and built this eternal shrine.
        </p>

        {/* Sticker Selector Palette */}
        <div className="flex items-center justify-center gap-2 font-pixel text-[10px]">
          <span className="text-gray-400">PICK STAMP:</span>
          {[
            { id: "cone", label: "🚧 Cone" },
            { id: "flame", label: "🔥 Fire" },
            { id: "star", label: "✦ Star" },
            { id: "skull", label: "💀 Skull" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                audio.click();
                setSelectedSticker(item.id);
              }}
              className={`px-2.5 py-1 rounded border ${
                selectedSticker === item.id
                  ? "bg-glitch-amber text-black border-white font-bold"
                  : "bg-void-800 text-gray-300 border-gray-600 hover:border-gray-400"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Interactive Sticker Shrine Corkboard */}
        <div
          onClick={handleBoardClick}
          className="w-full h-[260px] bg-[#1a1429] border-4 border-winborder rounded-lg relative overflow-hidden cursor-crosshair shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
          title="Click anywhere to stamp your retro sticker!"
        >
          {/* Subtle starry background grid */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Prompt banner in center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center font-pixel text-gray-500 text-xs opacity-40 select-none">
            [ TAP ANYWHERE TO STAMP RETRO GLITTER ]
          </div>

          {/* Stamped Stickers */}
          {stickers.map((s) => (
            <div
              key={s.id}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none text-xl animate-bounce"
            >
              {s.type === "cone" && "🚧"}
              {s.type === "flame" && "🔥"}
              {s.type === "star" && "✨"}
              {s.type === "skull" && "💀"}
            </div>
          ))}
        </div>

        {/* Classic 88x31 Badges Showcase */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <div className="w-[88px] h-[31px] bg-gradient-to-r from-blue-900 to-indigo-900 border border-gray-400 flex flex-col items-center justify-center text-[7px] text-white font-pixel shadow-sm">
            <span>NETSCAPE</span>
            <span className="text-glitch-cyan">NOW 4.0</span>
          </div>

          <div className="w-[88px] h-[31px] bg-gradient-to-r from-red-900 to-yellow-900 border border-gray-400 flex flex-col items-center justify-center text-[7px] text-white font-pixel shadow-sm">
            <span>NOTEPAD</span>
            <span className="text-yellow-400">HAND-MADE</span>
          </div>

          <div className="w-[88px] h-[31px] bg-black border border-glitch-green flex flex-col items-center justify-center text-[7px] text-glitch-green font-pixel shadow-sm">
            <span>ANY BROWSER</span>
            <span className="text-white">COMPLIANT</span>
          </div>

          <div className="w-[88px] h-[31px] bg-purple-900 border border-glitch-magenta flex flex-col items-center justify-center text-[7px] text-white font-pixel shadow-sm">
            <span>WEBRING</span>
            <span className="text-glitch-magenta">#404 MEMBER</span>
          </div>
        </div>
      </div>
    </section>
  );
};
