import React from "react";
import { audio } from "../core/audio";
import { bus } from "../core/bus";
import { useStore } from "../core/store";
import { Sparkles, FolderDown, Heart } from "lucide-react";

export const CloudVoidScene: React.FC = () => {
  const openWindow = useStore((s) => s.openWindow);

  const brokenLinks = [
    { url: "http://angelfire.com/anime/coolgoku", status: "LOST IN 2001" },
    { url: "http://myspace.com/top8_friends", status: "ASLEEP IN CACHE" },
    { url: "http://clubpenguin.com/miniclip/play", status: "SAFE IN POUCH" },
    { url: "http://geocities.ws/cyber_shrine", status: "PROTECTED BY FOURIE" },
  ];

  const handleRescuePacket = (linkUrl: string, e: React.MouseEvent) => {
    audio.squeak();
    bus.emit("poke", { x: e.clientX, y: e.clientY });
    useStore.getState().incrementRescued();
  };

  const handleEnterOS = () => {
    audio.click();
    const desktopEl = document.getElementById("scene-desktop");
    desktopEl?.scrollIntoView({ behavior: "smooth" });
    openWindow("about");
  };

  return (
    <section
      id="scene-cloud"
      className="relative min-h-[90dvh] w-full flex flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-b from-[#14112e] via-[#1a1438] to-[#13102d]"
    >
      <div className="max-w-2xl space-y-4 z-10 w-full">
        <div className="inline-block px-3.5 py-1 bg-[#231d4e] border border-[#a89bf0]/50 text-[#c8bffd] font-pixel text-xs rounded-full uppercase">
          Era 3: Modern Day // Catching Falling Web Stars
        </div>

        <h2 className="text-2xl sm:text-4xl font-pixel text-[#ffffff] tracking-wide drop-shadow">
          THE PACKET VACUUM
        </h2>

        <p className="font-display text-sm text-[#c8bffd] max-w-lg mx-auto leading-relaxed">
          In today's fast web, pages vanish quietly without a trace. But whenever a link breaks or a server goes to sleep, the sweet lost packets fall through the clouds straight into baby Fourie's floppy pouch.
        </p>

        {/* Floating Broken Hyperlinks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
          {brokenLinks.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => handleRescuePacket(item.url, e)}
              className="p-3 bg-[#1e1846]/70 border border-[#483d7a] hover:border-[#ffd97a] rounded-xl flex items-center justify-between text-left group transition-all shadow-md hover:scale-102"
              title="Click to tuck this lost memory into bed!"
            >
              <div className="overflow-hidden">
                <span className="font-mono text-xs text-[#c8bffd] group-hover:text-[#ffd97a] truncate block">
                  {item.url}
                </span>
                <span className="font-pixel text-[9px] text-[#ff9ec0]">
                  {item.status}
                </span>
              </div>
              <Sparkles className="w-4 h-4 text-[#ffd97a] opacity-60 group-hover:opacity-100 group-hover:scale-110 flex-shrink-0" />
            </button>
          ))}
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={handleEnterOS}
            className="px-6 py-3 bg-gradient-to-r from-[#7c6fd6] to-[#a29bfe] text-[#ffffff] font-pixel text-xs rounded-2xl shadow-[0_4px_24px_rgba(124,111,214,0.45)] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 font-bold"
          >
            <FolderDown className="w-4 h-4 text-[#ffd97a]" />
            <span>Enter Baby Fourie's Bedroom OS</span>
          </button>
        </div>
      </div>
    </section>
  );
};
