import React, { useEffect, useState } from "react";
import { FourieCharacter } from "../components/FourieCharacter";
import { useStore } from "../core/store";
import { audio } from "../core/audio";
import { bus } from "../core/bus";
import SunCalc from "suncalc";
import { Moon, Sparkles, ChevronDown, Heart } from "lucide-react";

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
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden bg-gradient-to-b from-[#100e26] via-[#161338] to-[#14112e]"
    >
      {/* Background Floating Dream Lights */}
      <div className="absolute top-1/4 left-10 w-48 h-48 bg-[#7c6fd6]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-56 h-56 bg-[#ffd97a]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-[#ff9ec0]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Moon Illumination Badge */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 bg-[#201b44]/80 backdrop-blur-md border border-[#483d7a] rounded-full font-pixel text-[10px] text-[#ffd97a] z-10 shadow-lg">
        <Moon className="w-3.5 h-3.5 text-[#ffd97a] animate-pulse" />
        <span>MOONLIGHT: {Math.round(moonIllumination * 100)}% ILLUMINATED</span>
      </div>

      {/* Soothing Hero Baby Title */}
      <div className="max-w-2xl space-y-3.5 z-10 pt-14">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#ff9ec0]/15 border border-[#ff9ec0]/40 text-[#ffccd5] font-pixel text-[10px] rounded-full tracking-wider uppercase">
          <Heart className="w-3 h-3 text-[#ff9ec0] fill-[#ff9ec0]" />
          <span>Track 2: Your Own Baby // 404 Sanctuary</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-pixel text-[#ffffff] tracking-tight drop-shadow-[0_4px_24px_rgba(168,155,240,0.5)]">
          MEET FOURIE
        </h1>

        <p className="font-display text-lg sm:text-xl text-[#ffd97a] font-medium max-w-lg mx-auto italic drop-shadow">
          "Kuch kho gaya? Maine sambhal ke rakha hai."
        </p>

        <p className="font-display text-xs sm:text-sm text-[#c8bffd] max-w-md mx-auto leading-relaxed">
          Jab internet par koi webpage delete ho jaata hai, us gap se ek chhota sa baby spirit paida hota hai: <strong>Fourie</strong>. Wo Internet ke cozy *Lost &amp; Found Office* me khoye hue pages ko sambhal ke rakhta hai.
        </p>
      </div>

      {/* Fourie Interactive Mascot Centerpiece */}
      <div className="relative my-7 z-10 flex flex-col items-center">
        <FourieCharacter size={225} />

        {/* Gentle Wake / Tickle Button */}
        <button
          type="button"
          onClick={handleWake}
          className="mt-4 px-5 py-2.5 bg-[#251f50] border-2 border-[#ffd97a] text-[#ffd97a] font-pixel text-xs rounded-full shadow-[0_4px_20px_rgba(255,217,122,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#ffd97a] animate-spin" />
          <span>{mood === "sleepy" ? "Gently Wake Baby Fourie" : "Tickle Little Star Charm"}</span>
        </button>
      </div>

      {/* Soothing Scroll Down Cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#8b7db8] font-pixel text-[9px] animate-bounce z-10">
        <span>SCROLL DOWN INTO BEDTIME ERAS</span>
        <ChevronDown className="w-4 h-4 text-[#ffd97a]" />
      </div>
    </section>
  );
};
