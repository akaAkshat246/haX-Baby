import React from "react";
import { audio } from "../core/audio";
import { bus } from "../core/bus";
import { useStore } from "../core/store";
import { Sparkles, ArrowDown } from "lucide-react";

export const CloudVoidScene: React.FC = () => {
  const openWindow = useStore((s) => s.openWindow);

  const brokenLinks = [
    { url: "http://angelfire.com/anime/coolgoku", status: "LOST IN 2001", tag: "Angelfire" },
    { url: "http://myspace.com/top8_friends", status: "ASLEEP IN CACHE", tag: "MySpace" },
    { url: "http://clubpenguin.com/miniclip/play", status: "SAFE IN SATCHEL", tag: "Miniclip" },
    { url: "http://geocities.ws/cyber_shrine", status: "PROTECTED BY FOURIE", tag: "GeoCities" },
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
      className="relative min-h-[90dvh] w-full flex flex-col items-center justify-center p-6 text-center select-none bg-[#040404]"
    >
      <div className="max-w-3xl space-y-4 z-10 w-full px-4">
        {/* Editorial Section Index */}
        <div className="editorial-index justify-center">
          <span>04</span>
          <span>/</span>
          <span>Modern Web · Catching Falling Web Stars</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
          Catching falling <span className="headline-serif">web stars.</span>
        </h2>

        <p className="font-sans text-sm text-[#9da3b4] max-w-lg mx-auto leading-relaxed">
          In today's web, pages vanish quietly without notice. But whenever a link breaks or a server goes down, the lost packets fall straight into baby Fourie's floppy satchel.
        </p>

        {/* Floating Broken Hyperlinks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto pt-2">
          {brokenLinks.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => handleRescuePacket(item.url, e)}
              className="p-3.5 bg-[#090b10] border border-white/10 hover:border-[#00ff66]/50 rounded-xl flex items-center justify-between text-left group transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:scale-[1.02]"
              title="Click to rescue this memory!"
            >
              <div className="overflow-hidden space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-white/90 group-hover:text-[#00ff66] truncate block transition-colors">
                    {item.url}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#555c6d] block">
                  {item.status} · {item.tag}
                </span>
              </div>
              <Sparkles className="w-4 h-4 text-[#00ff66] opacity-40 group-hover:opacity-100 group-hover:scale-110 flex-shrink-0 transition-all ml-2" />
            </button>
          ))}
        </div>

        <div className="pt-5">
          <button
            type="button"
            onClick={handleEnterOS}
            className="hax-button-primary group"
          >
            <span>Enter Fourie's Bedroom OS</span>
            <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
