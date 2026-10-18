import React, { useState, useEffect } from "react";
import { getVisitorProfile, saveVisitorName } from "../../core/memory";
import { audio } from "../../core/audio";
import { useStore } from "../../core/store";
import { Heart, Sparkles, Moon, ArrowUpRight } from "lucide-react";

export const AboutWindow: React.FC = () => {
  const [visitorGreeting, setVisitorGreeting] = useState("");
  const [visits, setVisits] = useState(1);
  const [name, setName] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const sendMood = useStore((s) => s.sendMood);

  useEffect(() => {
    const { profile, greeting } = getVisitorProfile();
    setVisitorGreeting(greeting);
    setVisits(profile.visits);
    if (profile.name) {
      setName(profile.name);
    }
  }, []);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    saveVisitorName(name.trim());
    setIsSaved(true);
    audio.squeak();
    sendMood("HAPPY" as any);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleTickleFourie = () => {
    audio.squeak();
    sendMood("POKE");
  };

  return (
    <div className="space-y-4 font-sans text-sm">
      {/* Personalized Greeting Card */}
      <div className="p-4 bg-[#0e1117] rounded-xl border border-white/10 space-y-2.5">
        <div className="flex items-center gap-2 text-white font-mono text-xs">
          <Moon className="w-4 h-4 text-[#00ff66]" />
          <span>VISITOR LEDGER // GREETING</span>
        </div>
        <p className="text-xs text-[#9da3b4] italic font-sans leading-relaxed">
          "{visitorGreeting}"
        </p>
        <div className="flex items-center justify-between text-[11px] font-mono text-[#555c6d]">
          <span>VISIT #{visits}</span>
          <span>LOCATION: 404 SANCTUARY</span>
        </div>

        {/* Visitor name tag input */}
        <form onSubmit={handleSaveName} className="flex gap-2 pt-1.5">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tell baby Fourie your name..."
            maxLength={20}
            className="flex-1 px-3 py-1.5 bg-[#090b10] border border-white/10 rounded-lg text-xs text-[#f4f4f6] focus:outline-none focus:border-[#00ff66] font-mono"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 text-xs font-mono font-medium bg-[#00ff66] text-black rounded-lg hover:bg-[#00f59b] transition-colors"
          >
            {isSaved ? "Saved! ✦" : "Sign"}
          </button>
        </form>
      </div>

      {/* 5-Point Character Sheet (Track 2 Rubric) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h3 className="font-mono text-xs text-white uppercase flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#00ff66]" />
            <span>Character Dossier</span>
          </h3>
          <span className="text-[11px] font-mono bg-white/[0.04] text-[#00ff66] border border-[#00ff66]/30 px-2.5 py-0.5 rounded-full">
            Track 2 Baby
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 text-xs">
          {/* 1. Name */}
          <div className="bg-[#0e1117] p-3 border border-white/10 rounded-xl space-y-1">
            <span className="font-mono text-[10px] text-[#555c6d] uppercase tracking-wider block">1. NAME</span>
            <div className="font-bold text-sm text-white">Fourie</div>
            <div className="text-[#9da3b4] text-[11px]">
              (Internet ke 404 page ka baby spirit)
            </div>
          </div>

          {/* 2. What they are */}
          <div className="bg-[#0e1117] p-3 border border-white/10 rounded-xl space-y-1">
            <span className="font-mono text-[10px] text-[#555c6d] uppercase tracking-wider block">2. WHAT THEY ARE</span>
            <p className="text-[#9da3b4] leading-relaxed">
              A palm-sized digital baby spirit made of soft night aura, two anime eyes with starry reflections, and a glowing star antenna wick.
            </p>
          </div>

          {/* 3. What they do */}
          <div className="bg-[#0e1117] p-3 border border-white/10 rounded-xl space-y-1">
            <span className="font-mono text-[10px] text-[#555c6d] uppercase tracking-wider block">3. WHAT THEY DO</span>
            <p className="text-[#9da3b4] leading-relaxed">
              Caretaker of the <strong className="text-white">Internet Lost &amp; Found Office</strong>. Shelves deleted web pages, broken bookmarks, and orphan media into sweet slumber.
            </p>
          </div>

          {/* 4. Their story */}
          <div className="bg-[#0e1117] p-3 border border-white/10 rounded-xl space-y-1">
            <span className="font-mono text-[10px] text-[#555c6d] uppercase tracking-wider block">4. THEIR STORY</span>
            <p className="text-[#9da3b4] leading-relaxed">
              Jab internet par koi webpage delete ho jaata hai, uski jagah ek khaali gap reh jaata hai. Us gap se ek chhota sa creature paida hua: Fourie. Wo khoye hue pages ko sambhal ke rakhta hai taaki koi yaad hamesha ke liye na kho jaye.
            </p>
          </div>

          {/* 5. Tagline */}
          <div className="bg-[#0e1117] p-3 border border-[#00ff66]/30 rounded-xl space-y-1">
            <span className="font-mono text-[10px] text-[#00ff66] uppercase tracking-wider block">5. TAGLINE</span>
            <p className="font-semibold text-sm text-white italic">
              "Kuch kho gaya? Maine sambhal ke rakha hai."
            </p>
            <span className="text-[11px] text-[#9da3b4]">
              ("Lost something? I've kept it safe.")
            </span>
          </div>
        </div>

        {/* Interactive Baby Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleTickleFourie}
            className="w-full py-2.5 bg-white text-black font-medium text-xs rounded-xl hover:bg-[#00ff66] transition-colors flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Tickle Baby Fourie's Star Charm</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
