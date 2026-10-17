import React from "react";
import { audio } from "../core/audio";
import { bus } from "../core/bus";
import { useStore } from "../core/store";
import { CloudOff, Sparkles, FolderDown, ArrowDownCircle } from "lucide-react";

export const CloudVoidScene: React.FC = () => {
  const openWindow = useStore((s) => s.openWindow);

  const brokenLinks = [
    { url: "http://angelfire.com/anime/coolgoku", status: "404 NULL" },
    { url: "http://myspace.com/top8_friends", status: "404 DELETED" },
    { url: "http://clubpenguin.com/miniclip/play", status: "404 ABANDONED" },
    { url: "http://geocities.ws/cyber_shrine", status: "404 EXPIRING" },
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
      className="relative min-h-[90dvh] w-full flex flex-col items-center justify-center p-6 text-center select-none"
    >
      <div className="max-w-2xl space-y-4 z-10 w-full">
        <div className="inline-block px-3 py-1 bg-void-800 border border-glitch-magenta text-glitch-magenta font-pixel text-xs rounded uppercase">
          Era 3: Modern Day // The Cloud Vacuum
        </div>

        <h2 className="text-2xl sm:text-4xl font-pixel text-paper tracking-wide">
          THE PACKET VACUUM
        </h2>

        <p className="font-display text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
          Today, the cloud replaces millions of pages every second. Fast, polished, but cold. Yet whenever a link rots or a server shuts down, the orphan packets fall through the cracks into Fourie's floppy satchel.
        </p>

        {/* Floating Broken Hyperlinks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg mx-auto">
          {brokenLinks.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => handleRescuePacket(item.url, e)}
              className="p-2.5 bg-void-800/80 border border-gray-700 hover:border-glitch-cyan rounded flex items-center justify-between text-left group transition-all"
              title="Click to rescue this packet!"
            >
              <div className="overflow-hidden">
                <span className="font-mono text-xs text-gray-400 group-hover:text-glitch-cyan truncate block">
                  {item.url}
                </span>
                <span className="font-pixel text-[9px] text-glitch-magenta">
                  {item.status}
                </span>
              </div>
              <Sparkles className="w-4 h-4 text-glitch-amber opacity-60 group-hover:opacity-100 group-hover:scale-110 flex-shrink-0" />
            </button>
          ))}
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={handleEnterOS}
            className="px-6 py-3 bg-gradient-to-r from-win-header to-indigo-700 text-white font-pixel text-xs rounded shadow-[0_0_15px_rgba(0,0,128,0.5)] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 retro-bevel"
          >
            <FolderDown className="w-4 h-4 text-glitch-cyan" />
            <span>Enter The Lost &amp; Found Desktop OS</span>
          </button>
        </div>
      </div>
    </section>
  );
};
