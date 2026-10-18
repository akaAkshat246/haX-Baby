import React, { useEffect, useState } from "react";
import { Odometer } from "../Odometer";
import { getRescuedCount } from "../../services/supabase";
import { audio } from "../../core/audio";
import { Globe, Award, Heart } from "lucide-react";

export const WebringWindow: React.FC = () => {
  const [rescuedTotal, setRescuedTotal] = useState(404);

  useEffect(() => {
    getRescuedCount().then((count) => setRescuedTotal(count));
  }, []);

  const handleNav = (label: string) => {
    audio.click();
    alert(`[404 Webring]: Navigating to ${label}`);
  };

  return (
    <div className="space-y-4 font-sans text-sm">
      <div className="p-3 bg-[#0e1117] rounded-xl border border-white/10 text-xs font-mono flex items-center justify-between text-[#9da3b4]">
        <span className="flex items-center gap-2 text-white">
          <Award className="w-4 h-4 text-[#00ff66]" />
          <span>404 PRESERVATION WEBRING HUB</span>
        </span>
        <span className="text-[#00ff66]">MEMBER #0404</span>
      </div>

      {/* Global Odometer Card */}
      <div className="p-4 bg-[#090b10] border border-white/10 rounded-xl text-center space-y-2">
        <span className="text-xs font-mono text-[#9da3b4]">TOTAL RESCUED PAGES &amp; WISHES</span>
        <div className="flex justify-center py-1">
          <Odometer value={rescuedTotal} digits={6} />
        </div>
        <p className="text-[11px] text-[#555c6d]">
          Safeguarded on every visit across the 404 sanctuary.
        </p>
      </div>

      {/* Webring Controls */}
      <div className="p-3 bg-[#0e1117] border border-white/10 rounded-xl space-y-2">
        <div className="text-xs font-medium text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#00e5ff]" />
          <span>Webring Navigation</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
          <button
            type="button"
            onClick={() => handleNav("Prev Baby")}
            className="px-3 py-1.5 bg-white/[0.04] border border-white/10 rounded-full text-[#9da3b4] hover:text-white"
          >
            &lt;&lt; Prev Baby
          </button>
          <button
            type="button"
            onClick={() => handleNav("Hub Directory")}
            className="px-3 py-1.5 bg-white/[0.04] border border-[#00ff66]/40 rounded-full text-[#00ff66]"
          >
            [Ring Hub]
          </button>
          <button
            type="button"
            onClick={() => handleNav("Random Lost Site")}
            className="px-3 py-1.5 bg-white/[0.04] border border-white/10 rounded-full text-[#9da3b4] hover:text-white"
          >
            Random ➔
          </button>
          <button
            type="button"
            onClick={() => handleNav("Next Baby")}
            className="px-3 py-1.5 bg-white/[0.04] border border-white/10 rounded-full text-[#9da3b4] hover:text-white"
          >
            Next Baby &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
};
