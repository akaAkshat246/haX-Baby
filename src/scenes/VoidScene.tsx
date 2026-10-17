import React, { useEffect, useState } from "react";
import { FourieCharacter } from "../components/FourieCharacter";
import { useStore } from "../core/store";
import { audio } from "../core/audio";
import { bus } from "../core/bus";
import SunCalc from "suncalc";
import { Moon, Sparkles, ChevronDown } from "lucide-react";

export const VoidScene: React.FC = () => {
  const mood = useStore((s) => s.mood);
  const sendMood = useStore((s) => s.sendMood);
  const [moonIllumination, setMoonIllumination] = useState(0.85);

  useEffect(() => {
    try {
      const moon = SunCalc.getMoonIllumination(new Date());
      setMoonIllumination(moon.fraction);
    } catch {}
  }, []);

  const handleWake = async (e: React.MouseEvent) => {
    await audio.unlock();
    audio.squeak();
    sendMood("WAKE");
    bus.emit("poke", { x: e.clientX, y: e.clientY });
  };

  return (
    <section
      id="scene-void"
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden"
    >
      {/* Background Starry Glow & Sky Moon */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-void-800/80 border border-gray-700 rounded-full font-pixel text-[10px] text-glitch-cyan z-10 shadow-lg">
        <Moon className="w-3.5 h-3.5 text-glitch-amber" />
        <span>MOON ILLUMINATION: {Math.round(moonIllumination * 100)}%</span>
      </div>

      {/* Hero 404 Void Title */}
      <div className="max-w-2xl space-y-3 z-10 pt-12">
        <div className="inline-block px-3 py-1 bg-glitch-magenta/20 border border-glitch-magenta text-glitch-magenta font-pixel text-xs rounded tracking-widest uppercase">
          HTTP 404: Webpage Deleted
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-pixel text-glitch-cyan tracking-tight drop-shadow-[0_4px_16px_rgba(0,240,255,0.4)]">
          MEET FOURIE
        </h1>

        <p className="font-display text-base sm:text-lg text-gray-300 max-w-lg mx-auto italic">
          "Kuch kho gaya? Maine sambhal ke rakha hai."
        </p>

        <p className="font-display text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
          When a webpage is deleted, an empty vacuum remains. From that void, a tiny spirit is born: <strong>Fourie</strong>, curator of the Internet's Lost &amp; Found Office.
        </p>
      </div>

      {/* Fourie Interactive Canvas Centerpiece */}
      <div className="relative my-6 z-10 flex flex-col items-center">
        <FourieCharacter size={220} />

        {/* Poke Hint Callout */}
        <button
          type="button"
          onClick={handleWake}
          className="mt-4 px-4 py-2 bg-void-800 border-2 border-glitch-amber text-glitch-amber font-pixel text-xs rounded-full shadow-[0_0_12px_rgba(255,183,3,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>{mood === "sleepy" ? "Poke Fourie to Wake!" : "Tickle Fourie's Antenna"}</span>
        </button>
      </div>

      {/* Scroll Down Cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-500 font-pixel text-[9px] animate-bounce z-10">
        <span>SCROLL TO ENTER EARLY-WEB ERAS</span>
        <ChevronDown className="w-4 h-4 text-glitch-cyan" />
      </div>
    </section>
  );
};
