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
  const enterPanda = useStore((s) => s.enterPanda);
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
    {
      id: "chapter-4",
      chapter: "Chapter IV · Koko Ki Dosti",
      title: "The Sunlit Nursery & Koko's Voice",
      subtitle: "Sunehri dhoop, chamakta taara, aur nanhay panda Koko ki meethi aawaz",
      imageSrc: "/assets/story/fourie_koko_nursery.svg",
      quote:
        "Jab subah ki sunehri dhoop nursery me aati hai, Fourie apni chamakti yaadon ka taara nanhay panda Koko ko deta hai—jo har bhasha me pyaar se baat karta hai aur khilkhila kar hansta hai. Kyunki is 404 Sanctuary me har aawaz aur har dosti hamesha zinda rehti hai.",
      tagline: "Har Bhasha Me Pyaar Bhari Dosti",
      badges: ["Golden Sunset", "Baby Panda Koko", "Live Voice", "Eternal Friendship"],
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
    <div className="relative min-h-screen w-full bg-[#fffaf7] text-[#362238] font-sans selection:bg-[#ff85b8] selection:text-[#3d001e] overflow-x-hidden">
      {/* Soft Pastel Ambient Aura */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#ffd6e8]/50 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[650px] h-[650px] bg-[#f3e8ff]/60 rounded-full blur-[150px] pointer-events-none" />

      {/* Floating Stardust Canvas */}
      <SparkCanvas />

      {/* Top Navigation Header — Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 left-0 right-0 z-50 px-6 sm:px-10 py-4 bg-[#fffcfa]/90 backdrop-blur-xl border-b border-[#e879a9]/20 flex items-center justify-between gap-8">
        {/* Zone 1: Single Clean Brand Wordmark */}
        <a href="#hero" className="text-lg font-bold tracking-tight text-[#362238] whitespace-nowrap shrink-0">
          Fourie Sanctuary
        </a>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#664c69]">
          <a href="#chapter-1" className="hover:text-[#c43d74] transition-colors whitespace-nowrap shrink-0">01. Origin Tale</a>
          <a href="#chapter-2" className="hover:text-[#c43d74] transition-colors whitespace-nowrap shrink-0">02. Lost &amp; Found</a>
          <a href="#chapter-3" className="hover:text-[#c43d74] transition-colors whitespace-nowrap shrink-0">03. Cloud Cradle</a>
          <a href="#chapter-4" className="hover:text-[#c43d74] transition-colors whitespace-nowrap shrink-0">04. Koko Ki Dosti</a>
          <a href="#sanctuary-portal" className="hover:text-[#c43d74] transition-colors whitespace-nowrap shrink-0">3D Nursery</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative pt-16 sm:pt-24 pb-16 px-4 sm:px-8 max-w-5xl mx-auto flex flex-col items-center text-center z-10">
        {/* Clean Unboxed Kicker */}
        <div className="mb-4 text-xs sm:text-sm font-semibold text-[#c43d74] flex items-center gap-2">
          <span>404 Lost &amp; Found Sanctuary</span>
          <span aria-hidden="true">·</span>
          <span>Kuch kho gaya? Maine sambhal ke rakha hai</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#362238] leading-[1.12] mb-6 max-w-3xl">
          Fourie, Internet Ke{" "}
          <span className="text-[#e85d95]">
            404 Page Ka Bachcha
          </span>
        </h1>

        {/* Story Subtitle & Premise */}
        <p className="text-base sm:text-lg text-[#664c69] max-w-2xl leading-relaxed mb-8 font-normal">
          Jab internet par koi webpage delete ho jaata hai, uski jagah ek khaali gap reh jaata hai.
          Us gap se ek chhota sa creature paida hota hai: <strong className="text-[#362238] font-semibold">Fourie</strong>.
          Wo internet ke <span className="text-[#c43d74] font-semibold">Lost &amp; Found Nursery</span> me kaam karta hai aur
          khoye hue pages ko sambhal ke rakhta hai.
        </p>

        {/* Interactive Chapter & Audio Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-[#fff0f6] border border-[#e879a9]/25">
            {storyChapters.map((ch, idx) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => scrollToChapter(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  activeChapter === idx
                    ? "bg-white text-[#c43d74] shadow-sm"
                    : "text-[#664c69] hover:text-[#362238]"
                }`}
              >
                {ch.chapter.split("·")[1]?.trim() || ch.chapter}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={toggleLullaby}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              isPlayingLullaby
                ? "bg-[#e85d95] text-white border-[#e85d95]"
                : "bg-white text-[#664c69] border-[#e879a9]/30 hover:border-[#e879a9]"
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>{isPlayingLullaby ? "Lullaby Playing" : "Play Lullaby"}</span>
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#e879a9]/30 flex items-center gap-1.5 text-xs font-semibold text-[#664c69] hover:text-[#362238] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            title={muted ? "Unmute sounds" : "Mute sounds"}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{muted ? "Muted" : "Sound On"}</span>
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center gap-1 text-xs font-semibold text-[#9a7d9e]">
          <span>Read Fourie&apos;s Storybook</span>
          <ChevronDown className="w-4 h-4 text-[#e85d95]" />
        </div>
      </section>

      {/* Story Chapters Sections */}
      <section className="relative px-4 sm:px-8 max-w-5xl mx-auto space-y-20 sm:space-y-24 pb-24 z-10">
        {storyChapters.map((chap) => (
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

      {/* Grand Entrance Section */}
      <section id="sanctuary-portal" className="relative px-4 sm:px-8 max-w-4xl mx-auto pb-28 text-center z-10">
        <div className="relative rounded-[36px] p-8 sm:p-14 bg-gradient-to-b from-[#fff0f6] to-[#fde8f1] border border-[#e879a9]/30 overflow-hidden">
          <div className="relative z-10 space-y-5">
            <div className="text-xs font-bold text-[#c43d74]">
              Interactive Digital Sanctuary · Cozy Nursery
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#362238] tracking-tight">
              Ready to Step Inside Fourie&apos;s World?
            </h2>

            <p className="text-sm sm:text-base text-[#664c69] max-w-xl mx-auto leading-relaxed">
              Play the 16-step dial-up lullaby sequencer, explore the 1999 GeoCities relic collection, write on the Lost Notes wall, and care for your companion.
            </p>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleDiveIn}
                className="px-8 py-3.5 rounded-full text-sm sm:text-base font-bold bg-gradient-to-r from-[#ee6b9e] to-[#f4936a] text-white shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Step Inside Sanctuary</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  audio.click();
                  enterPanda();
                }}
                className="px-6 py-3.5 rounded-full text-sm font-semibold bg-white text-[#362238] border border-[#e879a9]/35 hover:border-[#e879a9] transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Open 3D Companion Room</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-4 text-center border-t border-[#e879a9]/20 text-xs text-[#664c69] z-10">
        <div>Fourie 404 Lost &amp; Found Sanctuary · Clean Storybook Edition</div>
        <div className="mt-1 text-[#9a7d9e]">Kuch kho gaya? Maine sambhal ke rakha hai.</div>
      </footer>
    </div>
  );
};
