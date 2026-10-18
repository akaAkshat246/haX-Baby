import React, { useState, useEffect } from "react";
import SunCalc from "suncalc";
import { useStore } from "../core/store";
import { Moon, Sparkles, CloudMoon } from "lucide-react";

export const AndroidAtAGlance: React.FC = () => {
  const [dateStr, setDateStr] = useState("");
  const [moonFraction, setMoonFraction] = useState(0.85);
  const mood = useStore((s) => s.mood);

  useEffect(() => {
    const now = new Date();
    setDateStr(
      now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    );

    try {
      const moon = SunCalc.getMoonIllumination(now);
      setMoonFraction(moon.fraction);
    } catch {}
  }, []);

  return (
    <div className="flex flex-col items-start space-y-1.5 select-none text-left">
      {/* Date */}
      <div className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
        {dateStr || "Sunday, Oct 18"}
      </div>

      {/* Glance Pills Row */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
        {/* Weather Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/90 backdrop-blur-md">
          <CloudMoon className="w-4 h-4 text-[#7ce8ff]" />
          <span>24°C · 404 Void Skies</span>
        </div>

        {/* Moon Phase Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[#ffd97a] backdrop-blur-md font-mono text-[11px]">
          <Moon className="w-3.5 h-3.5 text-[#ffd97a] animate-pulse" />
          <span>Moonlight: {Math.round(moonFraction * 100)}%</span>
        </div>

        {/* Fourie Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] backdrop-blur-md text-[11px] font-mono">
          <Sparkles className="w-3.5 h-3.5 text-[#00ff66]" />
          <span>Fourie: {mood.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};
