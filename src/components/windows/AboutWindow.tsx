import React, { useState, useEffect } from "react";
import { getVisitorProfile, saveVisitorName } from "../../core/memory";
import { audio } from "../../core/audio";
import { useStore } from "../../core/store";
import { Heart, Sparkles, Moon, Award } from "lucide-react";

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
    <div className="space-y-4">
      {/* Personalized Soothing Nursery Card */}
      <div className="p-3.5 bg-gradient-to-br from-[#241e4c] to-[#1a153c] text-paper rounded-xl border border-[#7c6fd6]/50 shadow-md space-y-2">
        <div className="flex items-center gap-2 text-[#ffd97a] font-pixel text-[11px]">
          <Moon className="w-4 h-4 text-[#ffd97a] animate-pulse" />
          <span>BEDTIME NURSERY // VISITOR GREETING</span>
        </div>
        <p className="text-xs text-[#c8bffd] italic font-display leading-relaxed">
          "{visitorGreeting}"
        </p>
        <div className="flex items-center justify-between text-[10px] font-pixel text-[#8d7eb8]">
          <span>SWEET VISIT #{visits}</span>
          <span>LOCATION: COZY 404 SANCTUARY</span>
        </div>

        {/* Visitor name tag input */}
        <form onSubmit={handleSaveName} className="flex gap-2 pt-1">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tell baby Fourie your name..."
            maxLength={20}
            className="flex-1 px-3 py-1.5 bg-[#120f2c] border border-[#524484] rounded-lg text-xs font-display text-paper focus:outline-none focus:border-[#ffd97a]"
          />
          <button
            type="submit"
            className="px-3 py-1.5 text-[10px] font-pixel bg-[#ffd97a] text-[#1c1838] font-bold rounded-lg hover:scale-105 active:scale-95 transition-transform"
          >
            {isSaved ? "Saved! 💖" : "Sign"}
          </button>
        </form>
      </div>

      {/* 5-Point Character Sheet (Track 2 Rubric) */}
      <div className="space-y-3 font-display">
        <div className="flex items-center justify-between border-b-2 border-[#e6defa] pb-1.5">
          <h3 className="font-pixel text-xs text-[#5f27cd] uppercase flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#ff9ec0] fill-[#ff9ec0]" />
            <span>Official Baby Dossier</span>
          </h3>
          <span className="text-[10px] font-pixel bg-[#ff9ec0] text-[#1c1838] px-2 py-0.5 rounded-full font-bold">
            TRACK 2 BABY
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 text-xs text-[#1e1b38]">
          {/* 1. Name */}
          <div className="bg-white p-2.5 border border-[#e6defa] rounded-xl shadow-sm">
            <span className="font-pixel text-[10px] text-[#7c6fd6] block">1. NAME</span>
            <span className="font-bold text-sm text-[#1e1b38]">Fourie</span>
            <span className="text-[11px] text-gray-500 block">
              (Internet ke 404 page ka baby spirit)
            </span>
          </div>

          {/* 2. What they are */}
          <div className="bg-white p-2.5 border border-[#e6defa] rounded-xl shadow-sm">
            <span className="font-pixel text-[10px] text-[#7c6fd6] block">2. WHAT THEY ARE</span>
            <p className="text-gray-700 leading-relaxed">
              A palm-sized baby digital spirit made of warm moonlight, soft lavender night aura, two sleepy anime eyes with starry glints, and a little golden star wick on top.
            </p>
          </div>

          {/* 3. What they do */}
          <div className="bg-white p-2.5 border border-[#e6defa] rounded-xl shadow-sm">
            <span className="font-pixel text-[10px] text-[#7c6fd6] block">3. WHAT THEY DO</span>
            <p className="text-gray-700 leading-relaxed">
              Night-shift caretaker of the <strong>Internet Lost &amp; Found Office</strong>. Shelves deleted web pages, broken bookmarks, and orphan media into sweet slumber.
            </p>
          </div>

          {/* 4. Their story */}
          <div className="bg-white p-2.5 border border-[#e6defa] rounded-xl shadow-sm">
            <span className="font-pixel text-[10px] text-[#7c6fd6] block">4. THEIR STORY</span>
            <p className="text-gray-700 leading-relaxed">
              Jab internet par koi webpage delete ho jaata hai, uski jagah ek khaali gap reh jaata hai. Us gap se ek chhota sa creature paida hua: Fourie. Wo khoye hue pages ko sambhal ke rakhta hai taaki koi yaad hamesha ke liye na kho jaye.
            </p>
          </div>

          {/* 5. Tagline */}
          <div className="bg-[#fff9e6] p-3 border-2 border-[#ffd97a] rounded-xl shadow-sm">
            <span className="font-pixel text-[10px] text-[#b8860b] block">5. TAGLINE</span>
            <p className="font-bold text-sm text-[#1e1b38] italic">
              "Kuch kho gaya? Maine sambhal ke rakha hai."
            </p>
            <span className="text-[11px] text-gray-600">
              ("Lost something? I've kept it safe.")
            </span>
          </div>
        </div>

        {/* Interactive Baby Action Button */}
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={handleTickleFourie}
            className="w-full py-2.5 bg-gradient-to-r from-[#7c6fd6] to-[#a29bfe] text-white font-pixel text-xs rounded-xl shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#ffd97a] animate-spin" />
            <span>Tickle Baby Fourie's Star</span>
          </button>
        </div>
      </div>
    </div>
  );
};
