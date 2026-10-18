import React, { useState, useEffect } from "react";
import { MotionArtwork } from "./MotionArtwork";
import { useStore } from "../core/store";
import { audio } from "../core/audio";
import { SparkCanvas } from "../components/SparkCanvas";
import {
  Sparkles,
  Music,
  Maximize2,
  Heart,
  ChevronDown,
  Volume2,
  VolumeX,
  ExternalLink,
  Layers,
  Compass,
} from "lucide-react";

export const StoryLanding: React.FC = () => {
  const enterDesktop = useStore((s) => s.enterDesktop);
  const muted = useStore((s) => s.muted);
  const toggleMute = useStore((s) => s.toggleMute);
  const [isPlayingLullaby, setIsPlayingLullaby] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);

  const toggleLullaby = async () => {
    await audio.unlock();
    const playing = audio.toggleLullaby();
    setIsPlayingLullaby(playing);
  };

  const handleDiveIn = async () => {
    await audio.unlock();
    audio.click();
    // Dive into Android Desktop mode with automatic fullscreen
    enterDesktop(true);
  };

  const storyChapters = [
    {
      id: "chapter-1",
      chapter: "Chapter I · 404 Se Janam",
      title: "The Birth from the Void Gap",
      subtitle: "Jab internet par webpage delete hota hai, Fourie paida hota hai",
      imageSrc: "/assets/story/fourie_origin.jpg",
      quote:
        "Jab bhi koi webpage hamesha ke liye delete ho jaata hai, uski jagah internet par ek khaali gap reh jaata hai. Us gap se, 404 stardust ke roop me, ek nanh sa creature paida hota hai: Fourie. Uski aankhein chamakti hain kyunki wo jaanta hai ki koi bhi yaari ya yaadein kabhi poori tarah nahi khoti.",
      tagline: "404 Stardust Se Bana Guardian",
      badges: ["Void Born", "404 Not Found", "Stardust Soul", "Celestial Pink"],
    },
    {
      id: "chapter-2",
      chapter: "Chapter II · Lost & Found Office",
      title: "The Sanctuary of Lost Memories",
      subtitle: "Internet ke khoye hue panno aur dial-up modem ki hifazat",
      imageSrc: "/assets/story/fourie_office.jpg",
      quote:
        "Fourie internet ke ek shaant 'Lost & Found Office' me rehta hai. Yahan puraane CRT monitors, 3.5-inch floppy disks, aur sparkling kaanch ki botlon me 1999 ke GeoCities glitter GIFs, purani chats, aur khoye hue blogs sambhal kar rakhe jaate hain. Har cheez jise duniya bhool gayi, Fourie use gale lagata hai.",
      tagline: "Kuch kho gaya? Maine sambhal ke rakha hai.",
      badges: ["CRT Glow", "Dial-Up Era", "GeoCities 1999", "Preserved Memories"],
    },
    {
      id: "chapter-3",
      chapter: "Chapter III · Lori Ki Mithas",
      title: "The 56K Modem Lullaby Cradle",
      subtitle: "Fiber-optic baadal aur modem beeps se buni sukoon bhari neend",
      imageSrc: "/assets/story/fourie_cradle.jpg",
      quote:
        "Raat ko jab web traffic tham jaata hai, Fourie ek narm baby-pink baadal ke palne me so jaata hai. Uski lori banti hai puraane 56K dial-up handshake tones se—wohi 'tshhh-krr-beep' jo kabhi humein pehli baar internet se jodti thi. Yahan aakar har bhatka hua musafir sukoon paata hai.",
      tagline: "56K Carrier Waves Se Buni Lori",
      badges: ["Cloud Cradle", "56K Lullaby", "Sweet Slumber", "Starry Night"],
    },
  ];

  const scrollToChapter = (index: number) => {
    setActiveChapter(index);
    const element = document.getElementById(storyChapters[index].id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0e0714] text-[#fff0f7] font-sans selection:bg-[#ff85b8] selection:text-[#3d001e] overflow-x-hidden">
      {/* Dynamic Background Nebulae & Baby Pink Ambient Aura */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#ff85b8]/12 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[650px] h-[650px] bg-[#c084fc]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#ff3377]/6 rounded-full blur-[180px] pointer-events-none" />

      {/* Floating Stardust Canvas */}
      <SparkCanvas />

      {/* Top Floating Glass Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3.5 bg-[#14081c]/75 backdrop-blur-xl border-b border-[#ff85b8]/20 flex items-center justify-between">
        {/* Brand & Companion Badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#ff85b8] to-[#ffb6d9] flex items-center justify-center shadow-[0_4px_16px_rgba(255,133,184,0.4)]">
            <Sparkles className="w-5 h-5 text-[#3d001e]" />
          </div>
          <div>
            <div className="text-sm font-bold font-sans tracking-wide text-white flex items-center gap-2">
              <span>FOURIE</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ff85b8]/20 text-[#ff85b8] border border-[#ff85b8]/30">
                404 Sanctuary
              </span>
            </div>
            <div className="text-[11px] text-[#d8b4c8] font-medium hidden sm:block">
              Internet ke 404 page ka bachcha
            </div>
          </div>
        </div>

        {/* Action Controls: Music + Sound + Dive into Desktop */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Lullaby Audio Player Pill */}
          <button
            type="button"
            onClick={toggleLullaby}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono flex items-center gap-2 border transition-all cursor-pointer ${
              isPlayingLullaby
                ? "bg-[#ff85b8] text-[#3d001e] border-[#ff85b8] shadow-[0_0_20px_rgba(255,133,184,0.5)] font-semibold"
                : "bg-[#1b0e24]/80 text-[#ffd1e6] border-[#ff85b8]/30 hover:border-[#ff85b8]/60"
            }`}
            title="Toggle dial-up ambient lullaby synthesizer"
          >
            <Music className={`w-3.5 h-3.5 ${isPlayingLullaby ? "animate-spin" : ""}`} />
            <span className="hidden md:inline">
              {isPlayingLullaby ? "Lullaby Playing" : "Play Lullaby"}
            </span>
          </button>

          {/* Mute Button */}
          <button
            type="button"
            onClick={toggleMute}
            className="w-8 h-8 rounded-full bg-[#1b0e24]/80 border border-white/10 flex items-center justify-center text-[#d8b4c8] hover:text-white transition-colors"
            title={muted ? "Unmute sounds" : "Mute sounds"}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Dive Into Fourie's World Button */}
          <button
            type="button"
            onClick={handleDiveIn}
            className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold font-sans bg-gradient-to-r from-[#ff85b8] via-[#ffa5cc] to-[#fde047] text-[#38001a] shadow-[0_4px_24px_rgba(255,133,184,0.5)] hover:shadow-[0_6px_30px_rgba(255,133,184,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-[#fff0f7]/40"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Dive Into World</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-40 pb-16 px-4 sm:px-8 max-w-5xl mx-auto flex flex-col items-center text-center z-10">
        {/* Soft Pink Glowing Pill Badge */}
        <div className="mb-6 px-4 py-1.5 rounded-full bg-[#1e0f29]/90 border border-[#ff85b8]/35 shadow-[0_0_25px_rgba(255,133,184,0.25)] text-xs sm:text-sm font-mono text-[#ffb6d9] flex items-center gap-2 animate-bounce">
          <Heart className="w-3.5 h-3.5 text-[#ff85b8] fill-[#ff85b8]" />
          <span>Kuch kho gaya? Maine sambhal ke rakha hai.</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-sans leading-[1.1] mb-6 drop-shadow-lg">
          Fourie, Internet Ke{" "}
          <span className="bg-gradient-to-r from-[#ff85b8] via-[#ffd1e6] to-[#fde047] bg-clip-text text-transparent">
            404 Page Ka Bachcha
          </span>
        </h1>

        {/* Story Subtitle & Premise */}
        <p className="text-base sm:text-xl text-[#e8c6da] max-w-3xl leading-relaxed mb-8 font-sans font-normal">
          Jab internet par koi webpage delete ho jaata hai, uski jagah ek khaali gap reh jaata hai.
          Us gap se ek chhota sa creature paida hota hai: <strong className="text-white font-semibold">Fourie</strong>.
          Wo internet ke <span className="text-[#ff85b8] font-medium">“Lost & Found office”</span> me kaam karta hai aur
          khoye hue pages ko sambhal ke rakhta hai.
        </p>

        {/* Story Quick Chapter Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {storyChapters.map((ch, idx) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => scrollToChapter(idx)}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer ${
                activeChapter === idx
                  ? "bg-[#ff85b8] text-[#3d001e] font-bold shadow-[0_0_15px_rgba(255,133,184,0.5)]"
                  : "bg-[#180c22]/80 text-[#d8b4c8] border border-[#ff85b8]/20 hover:border-[#ff85b8]/50"
              }`}
            >
              {ch.chapter.split("·")[1]?.trim() || ch.chapter}
            </button>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center gap-1.5 text-xs font-mono text-[#8b6880] animate-pulse">
          <span>SCROLL FOR FOURIE'S TALE</span>
          <ChevronDown className="w-4 h-4 text-[#ff85b8]" />
        </div>
      </section>

      {/* Story Chapters Sections with Generated Artwork in Motion */}
      <section className="relative px-4 sm:px-8 max-w-5xl mx-auto space-y-24 sm:space-y-32 pb-24 z-10">
        {storyChapters.map((chap, idx) => (
          <div key={chap.id} id={chap.id} className="scroll-mt-24 flex flex-col items-center">
            <MotionArtwork
              imageSrc={chap.imageSrc}
              title={chap.title}
              subtitle={chap.subtitle}
              chapter={chap.chapter}
              quote={chap.quote}
              tagline={chap.tagline}
              badges={chap.badges}
            />
          </div>
        ))}
      </section>

      {/* Grand Entrance Section: "Diving into Fourie's World" */}
      <section className="relative px-4 sm:px-8 max-w-4xl mx-auto pb-32 text-center z-10">
        <div className="relative rounded-[36px] p-8 sm:p-14 bg-gradient-to-b from-[#1c0e2a] to-[#12081a] border border-[#ff85b8]/35 shadow-[0_30px_90px_rgba(18,8,25,0.9),0_0_60px_rgba(255,133,184,0.2)] overflow-hidden">
          {/* Ambient Inner Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#ff85b8]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff85b8]/15 border border-[#ff85b8]/30 text-xs font-mono text-[#ff85b8]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EXPERIENCE THE DIGITAL SANCTUARY</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold font-sans text-white tracking-tight">
              Ready to Dive Into Fourie's World?
            </h2>

            <p className="text-sm sm:text-base text-[#d8b4c8] max-w-xl mx-auto leading-relaxed">
              Step directly into the full Android 15 Desktop Mode. Play the 16-step dial-up lullaby sequencer,
              explore the 1999 GeoCities sticker shrine, write on the Lost Notes wall, and interact with Baby Fourie.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 max-w-2xl mx-auto text-left">
              <div className="p-3.5 rounded-2xl bg-[#14081c]/80 border border-white/5">
                <div className="text-lg mb-1">🧸</div>
                <div className="text-xs font-bold text-white">Living Mascot</div>
                <div className="text-[11px] text-[#8b6880]">Reactive Companion</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#14081c]/80 border border-white/5">
                <div className="text-lg mb-1">🎹</div>
                <div className="text-xs font-bold text-white">Lullaby Lab</div>
                <div className="text-[11px] text-[#8b6880]">16-Step Synthesizer</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#14081c]/80 border border-white/5">
                <div className="text-lg mb-1">💌</div>
                <div className="text-xs font-bold text-white">Lost Notes</div>
                <div className="text-[11px] text-[#8b6880]">Sanctuary Guestbook</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#14081c]/80 border border-white/5">
                <div className="text-lg mb-1">🌐</div>
                <div className="text-xs font-bold text-white">1999 Shrine</div>
                <div className="text-[11px] text-[#8b6880]">GeoCities Relics</div>
              </div>
            </div>

            {/* Grand Glowing CTA Button */}
            <div className="pt-4 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={handleDiveIn}
                className="w-full sm:w-auto px-8 sm:px-12 py-4 rounded-full text-base sm:text-lg font-bold font-sans bg-gradient-to-r from-[#ff85b8] via-[#ffa8d0] to-[#fde047] text-[#340018] shadow-[0_8px_32px_rgba(255,133,184,0.6)] hover:shadow-[0_12px_45px_rgba(255,133,184,0.85)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer border border-white/40"
              >
                <Maximize2 className="w-5 h-5" />
                <span>✨ Dive Into Fourie's World · Launch Android OS ✨</span>
              </button>

              <div className="text-xs font-mono text-[#ffb6d9] flex items-center gap-2">
                <span>✦ Automatically switches browser to Fullscreen Mode ✦</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-4 text-center border-t border-[#ff85b8]/15 text-xs text-[#8b6880] font-mono z-10">
        <div>Fourie — Internet 404 Lost & Found Sanctuary · Built with Baby Pink & Contrasting Velvet Plum</div>
        <div className="mt-1 text-[#ff85b8]/80">“Kuch kho gaya? Maine sambhal ke rakha hai.”</div>
      </footer>
    </div>
  );
};
