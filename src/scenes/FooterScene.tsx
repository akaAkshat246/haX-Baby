import React, { useEffect, useState } from "react";
import { Odometer } from "../components/Odometer";
import { getRescuedCount } from "../services/supabase";
import { useStore } from "../core/store";
import { audio } from "../core/audio";
import { Globe, Heart, Sparkles, Award } from "lucide-react";

export const FooterScene: React.FC = () => {
  const [rescuedTotal, setRescuedTotal] = useState(404);
  const secretUnlocked = useStore((s) => s.secretUnlocked);
  const openWindow = useStore((s) => s.openWindow);

  useEffect(() => {
    getRescuedCount().then((count) => setRescuedTotal(count));
  }, []);

  const handleWebringNav = (label: string) => {
    audio.click();
    alert(`[404 Webring]: Hopping to ${label}! Fourie ensures you never hit a dead end.`);
  };

  const handleSecretClick = () => {
    audio.glitch();
    openWindow("nowhere");
  };

  return (
    <footer
      id="scene-footer"
      className="relative w-full bg-void-950 border-t-2 border-gray-800 text-paper p-8 pb-32 text-center font-display space-y-8 select-none"
    >
      {/* Rescued Pages Global Odometer */}
      <div className="max-w-md mx-auto p-4 bg-void-900 border-2 border-winborder rounded-lg shadow-xl space-y-2">
        <span className="font-pixel text-[10px] text-glitch-cyan block">
          GLOBAL RESCUED PAGES ODOMETER
        </span>
        <div className="flex justify-center">
          <Odometer value={rescuedTotal} digits={6} />
        </div>
        <p className="text-[11px] text-gray-400">
          Updated on every visit and note preserved across the 404 sanctuary.
        </p>
      </div>

      {/* Retro 90s Webring Navigation Bar */}
      <div className="max-w-xl mx-auto p-3 bg-void-900/80 border border-gray-700 rounded-lg space-y-2">
        <div className="flex items-center justify-center gap-2 font-pixel text-xs text-glitch-amber">
          <Globe className="w-4 h-4" />
          <span>THE LOST WEB 404 RING</span>
        </div>

        <p className="text-xs text-gray-400">
          This site is member <strong>#0404</strong> in the Old-Web Preservation Ring.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 font-pixel text-[9px]">
          <button
            type="button"
            onClick={() => handleWebringNav("Previous Webring Member")}
            className="px-2.5 py-1 bg-void-800 border border-gray-600 hover:border-glitch-cyan rounded"
          >
            &lt;&lt; Prev Site
          </button>
          <button
            type="button"
            onClick={() => handleWebringNav("Ring Directory")}
            className="px-2.5 py-1 bg-void-800 border border-gray-600 hover:border-glitch-cyan rounded text-glitch-cyan"
          >
            [Ring Hub]
          </button>
          <button
            type="button"
            onClick={() => handleWebringNav("Random Lost Site")}
            className="px-2.5 py-1 bg-void-800 border border-gray-600 hover:border-glitch-cyan rounded"
          >
            Random ➔
          </button>
          <button
            type="button"
            onClick={() => handleWebringNav("Next Webring Member")}
            className="px-2.5 py-1 bg-void-800 border border-gray-600 hover:border-glitch-cyan rounded"
          >
            Next Site &gt;&gt;
          </button>
        </div>
      </div>

      {/* 88x31 Badges Grid */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="w-[88px] h-[31px] bg-gradient-to-r from-blue-900 to-indigo-900 border border-gray-500 flex flex-col items-center justify-center text-[7px] text-white font-pixel shadow-sm">
          <span>NETSCAPE</span>
          <span className="text-glitch-cyan">NOW 4.0</span>
        </div>

        <div className="w-[88px] h-[31px] bg-gradient-to-r from-red-900 to-yellow-900 border border-gray-500 flex flex-col items-center justify-center text-[7px] text-white font-pixel shadow-sm">
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

        {/* Secret Unlocked Badge */}
        {secretUnlocked ? (
          <div
            onClick={handleSecretClick}
            className="w-[88px] h-[31px] bg-gradient-to-r from-glitch-magenta to-indigo-900 border-2 border-glitch-amber flex flex-col items-center justify-center text-[7px] text-white font-pixel cursor-pointer animate-pulse shadow-[0_0_8px_#ffb703]"
            title="Click to revisit the Secret Backroom!"
          >
            <span className="text-glitch-amber font-bold">404 MASTER</span>
            <span className="text-[6px] text-glitch-cyan">SECRET UNLOCKED</span>
          </div>
        ) : (
          <div
            onClick={handleSecretClick}
            className="w-[88px] h-[31px] bg-gray-900 border border-dashed border-gray-600 flex flex-col items-center justify-center text-[7px] text-gray-500 font-pixel cursor-pointer hover:border-glitch-cyan"
            title="A secret badge is sleeping here... check the Recycle Bin or antenna!"
          >
            <span>??? SECRET</span>
            <span className="text-[6px]">LOCKED</span>
          </div>
        )}
      </div>

      {/* Secret Hint */}
      <p className="text-xs text-gray-500 italic max-w-md mx-auto">
        "psst... have you checked inside the Recycle Bin, tapped Fourie's antenna 5 times, or tried visiting <span className="font-mono text-glitch-cyan">/nowhere</span> in the URL?"
      </p>

      {/* Required Attribution & Open Source Credits */}
      <div className="pt-6 border-t border-gray-800 max-w-2xl mx-auto text-[11px] text-gray-400 leading-relaxed space-y-2">
        <p>
          <strong>Character, SVG Art &amp; Worldbuilding:</strong> Designed for Hackathon Track 2 ("Your Own Baby") featuring Fourie, child of the 404 page.
        </p>
        <p>
          <strong>Audio:</strong> Procedurally synthesized via Web Audio API (OscillatorNode &amp; Gain envelopes; zero audio file dependencies).
        </p>
        <p>
          <strong>Typography:</strong> "Press Start 2P", "VT323", and "Space Grotesk" via Google Fonts.
        </p>
        <p>
          <strong>Built with:</strong> React 18, TypeScript, Vite, Tailwind CSS, Zustand, GSAP, Lenis, SunCalc, and Supabase.
        </p>
        <p className="text-gray-500 text-[10px] pt-2">
          © 2026 Fourie 404 Lost &amp; Found Sanctuary. "Kuch kho gaya? Maine sambhal ke rakha hai."
        </p>
      </div>
    </footer>
  );
};
