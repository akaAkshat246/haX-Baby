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
      className="relative w-full bg-[#0d0b1f] border-t-2 border-[#382f64] text-[#fffaf5] p-8 pb-32 text-center font-display space-y-8 select-none"
    >
      {/* Rescued Pages Global Odometer */}
      <div className="max-w-md mx-auto p-4 bg-[#1a153c] border-2 border-[#7c6fd6] rounded-2xl shadow-xl space-y-2.5">
        <span className="font-pixel text-[10px] text-[#ffd97a] flex items-center justify-center gap-1.5">
          <Moon className="w-3.5 h-3.5 text-[#ffd97a]" />
          <span>GLOBAL RESCUED DREAMS &amp; PAGES</span>
        </span>
        <div className="flex justify-center">
          <Odometer value={rescuedTotal} digits={6} />
        </div>
        <p className="text-[11px] text-[#c8bffd]">
          Tucked into bed on every visit and memory shared across the 404 nursery.
        </p>
      </div>

      {/* Retro 90s Webring Navigation Bar */}
      <div className="max-w-xl mx-auto p-4 bg-[#181338]/90 border border-[#483d7a] rounded-2xl space-y-2.5 shadow-md">
        <div className="flex items-center justify-center gap-2 font-pixel text-xs text-[#ffd97a]">
          <Globe className="w-4 h-4 text-[#ff9ec0]" />
          <span>THE LOST WEB 404 BABY RING</span>
        </div>

        <p className="text-xs text-[#c8bffd]">
          This site is baby member <strong>#0404</strong> in the Old-Web Preservation Ring.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 font-pixel text-[9px]">
          <button
            type="button"
            onClick={() => handleWebringNav("Previous Baby Webring Member")}
            className="px-3 py-1.5 bg-[#251f50] border border-[#524484] hover:border-[#ffd97a] rounded-xl text-[#c8bffd]"
          >
            &lt;&lt; Prev Baby
          </button>
          <button
            type="button"
            onClick={() => handleWebringNav("Ring Directory")}
            className="px-3 py-1.5 bg-[#251f50] border border-[#524484] hover:border-[#ffd97a] rounded-xl text-[#ffd97a]"
          >
            [Ring Hub]
          </button>
          <button
            type="button"
            onClick={() => handleWebringNav("Random Lost Site")}
            className="px-3 py-1.5 bg-[#251f50] border border-[#524484] hover:border-[#ffd97a] rounded-xl text-[#c8bffd]"
          >
            Random ➔
          </button>
          <button
            type="button"
            onClick={() => handleWebringNav("Next Baby Webring Member")}
            className="px-3 py-1.5 bg-[#251f50] border border-[#524484] hover:border-[#ffd97a] rounded-xl text-[#c8bffd]"
          >
            Next Baby &gt;&gt;
          </button>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="w-[88px] h-[31px] bg-gradient-to-r from-[#483d8b] to-[#6a5acd] border border-[#a89bf0] rounded flex flex-col items-center justify-center text-[7px] text-white font-pixel shadow-sm">
          <span>BEDTIME</span>
          <span className="text-[#ffd97a]">CERTIFIED</span>
        </div>

        <div className="w-[88px] h-[31px] bg-gradient-to-r from-[#b53471] to-[#ee5253] border border-[#ff9ec0] rounded flex flex-col items-center justify-center text-[7px] text-white font-pixel shadow-sm">
          <span>SWEET DREAMS</span>
          <span className="text-[#ffd97a]">404 ARCHIVE</span>
        </div>

        <div className="w-[88px] h-[31px] bg-[#1a1438] border border-[#ffd97a] rounded flex flex-col items-center justify-center text-[7px] text-[#ffd97a] font-pixel shadow-sm">
          <span>BABY SPIRIT</span>
          <span className="text-white">TRACK 2</span>
        </div>

        <div className="w-[88px] h-[31px] bg-[#5f27cd] border border-[#ff9ec0] rounded flex flex-col items-center justify-center text-[7px] text-white font-pixel shadow-sm">
          <span>WEBRING</span>
          <span className="text-[#ff9ec0]">#404 BABY</span>
        </div>

        {/* Secret Unlocked Badge */}
        {secretUnlocked ? (
          <div
            onClick={handleSecretClick}
            className="w-[88px] h-[31px] bg-gradient-to-r from-[#ff9ec0] to-[#7c6fd6] border-2 border-[#ffd97a] rounded flex flex-col items-center justify-center text-[7px] text-white font-pixel cursor-pointer animate-pulse shadow-[0_0_12px_#ffd97a]"
            title="Click to revisit the Secret Backroom!"
          >
            <span className="text-[#1c1838] font-bold">BABY MASTER</span>
            <span className="text-[6px] text-white">SECRET UNLOCKED</span>
          </div>
        ) : (
          <div
            onClick={handleSecretClick}
            className="w-[88px] h-[31px] bg-[#161234] border border-dashed border-[#524484] rounded flex flex-col items-center justify-center text-[7px] text-[#8d7eb8] font-pixel cursor-pointer hover:border-[#ffd97a]"
            title="A secret badge is sleeping here... check the Recycle Basket or antenna!"
          >
            <span>??? SECRET</span>
            <span className="text-[6px]">LOCKED</span>
          </div>
        )}
      </div>

      {/* Secret Hint */}
      <p className="text-xs text-[#8d7eb8] italic max-w-md mx-auto">
        "psst... have you checked inside the Recycle Basket, tapped baby Fourie's star charm 5 times, or visited <span className="font-mono text-[#ffd97a]">/nowhere</span> in the address bar?"
      </p>

      {/* Required Attribution & Open Source Credits */}
      <div className="pt-6 border-t border-[#2d2558] max-w-2xl mx-auto text-[11px] text-[#8d7eb8] leading-relaxed space-y-2">
        <p>
          <strong>Character, SVG Art &amp; Worldbuilding:</strong> Designed for Hackathon Track 2 ("Your Own Baby") featuring Fourie, child of the 404 page.
        </p>
        <p>
          <strong>Audio:</strong> Procedurally synthesized via Web Audio API (soothing sinusoidal music-box envelopes; zero external audio samples).
        </p>
        <p>
          <strong>Typography:</strong> "Press Start 2P", "VT323", and "Space Grotesk" via Google Fonts.
        </p>
        <p>
          <strong>Animation &amp; Tech Stack:</strong> React 18, Anime.js v4, TypeScript, Vite, Tailwind CSS, Zustand, SunCalc, and Supabase.
        </p>
        <p className="text-[#a89bf0] text-[10px] pt-2 flex items-center justify-center gap-1">
          <Heart className="w-3 h-3 text-[#ff9ec0] fill-[#ff9ec0]" />
          <span>© 2026 Fourie 404 Sanctuary. "Kuch kho gaya? Maine sambhal ke rakha hai."</span>
        </p>
      </div>
    </footer>
  );
};
