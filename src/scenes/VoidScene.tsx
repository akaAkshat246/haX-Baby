import React, { useEffect, useState } from "react";
import { FourieCharacter } from "../components/FourieCharacter";
import { useStore } from "../core/store";
import { audio } from "../core/audio";
import { bus } from "../core/bus";
import SunCalc from "suncalc";
import { Moon, Sparkles, ArrowUpRight, ArrowDown } from "lucide-react";

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

  const scrollToDesktop = () => {
    audio.click();
    document.getElementById("scene-desktop")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="scene-void"
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden bg-[#040404]"
    >
      {/* Background Soft Glows matching hax.baby */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#00ff66]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-[#00e5ff]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row with Badges */}
      <div className="z-10 pt-10 pb-4 flex flex-wrap items-center justify-center gap-2.5">
        <div className="hax-badge">
          <span className="status-dot"></span>
          <span>haX Baby 2025 · Track 2</span>
        </div>

        <div className="hax-badge">
          <Moon className="w-3.5 h-3.5 text-[#ffb703] animate-pulse" />
          <span>Moonlight: {Math.round(moonIllumination * 100)}% illuminated</span>
        </div>
      </div>

      {/* Editorial Section Label */}
      <div className="editorial-index z-10 mb-2">
        <span>01</span>
        <span>/</span>
        <span>A small beginning in the 404 gap</span>
      </div>

      {/* Editorial Headline with Italic Keyword */}
      <div className="max-w-3xl space-y-4 z-10 px-4">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-bold tracking-tight text-white leading-[1.08]">
          Every deleted page <span className="headline-serif">finds a baby.</span>
        </h1>

        <p className="text-lg sm:text-2xl font-sans text-white/90 font-light max-w-xl mx-auto">
          "Kuch kho gaya? <span className="text-[#00ff66] font-normal">Maine sambhal ke rakha hai.</span>"
        </p>

        <p className="text-xs sm:text-sm text-[#9da3b4] max-w-lg mx-auto leading-relaxed font-sans">
          When a webpage is deleted on the web, a quiet gap remains. Out of that digital vacuum emerges <strong>Fourie</strong>, the palm-sized caretaker of the Lost &amp; Found sanctuary.
        </p>
      </div>

      {/* Interactive Mascot Centerpiece */}
      <div className="relative my-7 z-10 flex flex-col items-center">
        <FourieCharacter size={225} />

        {/* Action Buttons in hax.baby Pill Style */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
          <button
            type="button"
            onClick={handleWake}
            className="hax-button-primary group"
          >
            <Sparkles className="w-4 h-4 text-[#040404]" />
            <span>{mood === "sleepy" ? "Wake Baby Fourie" : "Tickle Star Charm"}</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          <button
            type="button"
            onClick={scrollToDesktop}
            className="hax-button-secondary group"
          >
            <span>Open Bedroom OS</span>
            <ArrowDown className="w-4 h-4 text-[#9da3b4] transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>
      </div>

      {/* Minimal Scroll Down Cue */}
      <div className="editorial-index text-[10px] text-[#555c6d] pt-4 z-10 flex items-center gap-1.5 animate-pulse">
        <span>SCROLL DOWN INTO ERAS</span>
        <span>↓</span>
      </div>
    </section>
  );
};
