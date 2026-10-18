import React, { useEffect, useState } from "react";
import { Odometer } from "../components/Odometer";
import { getRescuedCount } from "../services/supabase";
import { useStore } from "../core/store";
import { audio } from "../core/audio";
import { Globe, Heart, Sparkles, Moon } from "lucide-react";

export const FooterScene: React.FC = () => {
  const [rescuedTotal, setRescuedTotal] = useState(404);
  const secretUnlocked = useStore((s) => s.secretUnlocked);
  const openWindow = useStore((s) => s.openWindow);

  useEffect(() => {
    getRescuedCount().then((count) => setRescuedTotal(count));
  }, []);

  const handleWebringNav = (label: string) => {
    audio.click();
    alert(`[404 Baby Webring]: Hopping to ${label}! Fourie ensures you never hit a dead end.`);
  };

  const handleSecretClick = () => {
    audio.glitch();
    openWindow("nowhere");
  };

  return (
    <footer
      id="scene-footer"
      className="relative w-full bg-[#040404] border-t border-white/10 text-[#f4f4f6] p-8 pb-32 text-center font-sans space-y-8 select-none"
    >
      {/* Editorial Section Index */}
      <div className="editorial-index justify-center">
        <span>07</span>
        <span>/</span>
        <span>Preservation Ledger &amp; Field Notes</span>
      </div>

      {/* Rescued Pages Global Odometer */}
      <div className="max-w-md mx-auto p-5 bg-[#090b10] border border-white/10 rounded-2xl shadow-xl space-y-3">
        <span className="font-mono text-xs text-[#9da3b4] flex items-center justify-center gap-2">
          <Moon className="w-3.5 h-3.5 text-[#00ff66]" />
          <span>GLOBAL RESCUED MEMORIES &amp; PAGES</span>
        </span>
        <div className="flex justify-center">
          <Odometer value={rescuedTotal} digits={6} />
        </div>
        <p className="text-xs text-[#555c6d] font-sans">
          Preserved on every visit and memory shared across the 404 sanctuary.
        </p>
      </div>

      {/* Webring Navigation Bar */}
      <div className="max-w-xl mx-auto p-4 bg-[#090b10] border border-white/10 rounded-2xl space-y-3 shadow-md">
        <div className="flex items-center justify-center gap-2 font-mono text-xs text-white">
          <Globe className="w-4 h-4 text-[#00ff66]" />
          <span>THE 404 BABY WEBRING ARCHIVE</span>
        </div>

        <p className="text-xs text-[#9da3b4]">
          This site is member <strong>#0404</strong> in the Old-Web Preservation Ring.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 font-mono text-xs">
          <button
            type="button"
            onClick={() => handleWebringNav("Previous Baby Webring Member")}
            className="px-3 py-1.5 bg-white/[0.04] border border-white/10 hover:border-white/25 rounded-full text-[#9da3b4] hover:text-white transition-colors"
          >
            &lt;&lt; Prev Baby
          </button>
          <button
            type="button"
            onClick={() => handleWebringNav("Ring Directory")}
            className="px-3 py-1.5 bg-white/[0.04] border border-[#00ff66]/40 hover:border-[#00ff66] rounded-full text-[#00ff66] transition-colors"
          >
            [Ring Hub]
          </button>
          <button
            type="button"
            onClick={() => handleWebringNav("Random Lost Site")}
            className="px-3 py-1.5 bg-white/[0.04] border border-white/10 hover:border-white/25 rounded-full text-[#9da3b4] hover:text-white transition-colors"
          >
            Random ➔
          </button>
          <button
            type="button"
            onClick={() => handleWebringNav("Next Baby Webring Member")}
            className="px-3 py-1.5 bg-white/[0.04] border border-white/10 hover:border-white/25 rounded-full text-[#9da3b4] hover:text-white transition-colors"
          >
            Next Baby &gt;&gt;
          </button>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="flex flex-wrap items-center justify-center gap-3">
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

        {/* Secret Unlocked Badge */}
        {secretUnlocked ? (
          <div
            onClick={handleSecretClick}
            className="w-[88px] h-[31px] bg-[#00ff66] text-black rounded flex flex-col items-center justify-center text-[7px] font-mono cursor-pointer animate-pulse shadow-[0_0_15px_#00ff66]"
            title="Click to revisit the Secret Backroom!"
          >
            <span className="font-bold">BABY MASTER</span>
            <span className="text-[6px]">SECRET UNLOCKED</span>
          </div>
        ) : (
          <div
            onClick={handleSecretClick}
            className="w-[88px] h-[31px] bg-[#090b10] border border-dashed border-white/20 rounded flex flex-col items-center justify-center text-[7px] text-[#555c6d] font-mono cursor-pointer hover:border-[#00ff66]"
            title="A secret badge is sleeping here... check the Recycle Basket or antenna!"
          >
            <span>??? SECRET</span>
            <span className="text-[6px]">LOCKED</span>
          </div>
        )}
      </div>

      {/* Secret Hint */}
      <p className="text-xs text-[#555c6d] italic max-w-md mx-auto font-mono">
        "psst... have you checked inside the Recycle Basket, tapped baby Fourie's star charm 5 times, or visited <span className="text-[#00ff66]">/nowhere</span> in the address bar?"
      </p>

      {/* Required Attribution & Open Source Credits */}
      <div className="pt-6 border-t border-white/10 max-w-2xl mx-auto text-xs text-[#555c6d] leading-relaxed space-y-2 font-mono">
        <p>
          <strong className="text-white">Character, SVG Rig &amp; Worldbuilding:</strong> Designed for haX Baby Hackathon Track 2 ("Your Own Baby") featuring Fourie, child of the 404 page.
        </p>
        <p>
          <strong className="text-white">Audio:</strong> Procedurally synthesized via Web Audio API (sine-wave music box envelopes; zero external audio samples).
        </p>
        <p>
          <strong className="text-white">Stack:</strong> React 18, TypeScript, Anime.js v4, Vite, Tailwind CSS, Zustand, SunCalc, Supabase.
        </p>
        <p className="text-[#9da3b4] text-xs pt-3 flex items-center justify-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-[#00ff66] fill-[#00ff66]" />
          <span>© 2026 Fourie 404 Sanctuary. "Kuch kho gaya? Maine sambhal ke rakha hai."</span>
        </p>
      </div>
    </footer>
  );
};
