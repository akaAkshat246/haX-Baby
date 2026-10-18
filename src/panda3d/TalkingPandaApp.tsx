import React, { useState, useEffect, useRef } from "react";
import { Room3DScene } from "./Room3DScene";
import { tomAudio } from "./TalkingTomAudio";
import { freeLlm, LlmConfig } from "./freeLlmClient";
import { useStore } from "../core/store";
import confetti from "canvas-confetti";
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Smartphone,
  Monitor,
  Maximize2,
  BookOpen,
  LayoutGrid,
  Utensils,
  Play,
  Volume2,
  Smile,
  Zap,
  Glasses,
  PartyPopper,
  Flame,
  Coffee,
  Heart,
  Wind,
  Bot,
  Settings,
  HelpCircle,
  Check,
} from "lucide-react";

export const TalkingPandaApp: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Room3DScene | null>(null);

  const enterStory = useStore((s) => s.enterStory);
  const enterDesktop = useStore((s) => s.enterDesktop);

  // UI States
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [speechBubbleText, setSpeechBubbleText] = useState("Meow! I'm your cute 3D Talking Kitty! 🎀🐾");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [walkSpeed, setWalkSpeed] = useState(4.0);
  const [aiChatMode, setAiChatMode] = useState(true); // AI Brain vs Mimic Repeat
  const [showLlmModal, setShowLlmModal] = useState(false);
  const [llmProvider, setLlmProvider] = useState<"pollinations" | "groq">("pollinations");
  const [groqKey, setGroqKey] = useState("");
  const [isSavedKey, setIsSavedKey] = useState(false);

  // Sub-menus
  const [activeMenu, setActiveMenu] = useState<"none" | "feed" | "actions" | "wardrobe">("none");
  const [hasBow, setHasBow] = useState(true); // Pink bow enabled by default as in reference image!
  const [hasSunglasses, setHasSunglasses] = useState(false);
  const [hasHat, setHasHat] = useState(false);

  // Floating heart / particle animation trigger
  const [reactionOverlay, setReactionOverlay] = useState<string | null>(null);

  // Load initial LLM configuration
  useEffect(() => {
    const cfg = freeLlm.getConfig();
    setLlmProvider(cfg.provider === "groq" ? "groq" : "pollinations");
    if (cfg.apiKey) setGroqKey(cfg.apiKey);
  }, []);

  // Initialize Three.js 3D Room Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new Room3DScene(mountRef.current);
    sceneRef.current = scene;

    // Connect audio speaking states to 3D Cat model
    tomAudio.onSpeechStart = () => {
      setIsSpeaking(true);
      if (sceneRef.current) sceneRef.current.cat.isSpeaking = true;
    };

    tomAudio.onSpeechEnd = () => {
      setIsSpeaking(false);
      if (sceneRef.current) sceneRef.current.cat.isSpeaking = false;
    };

    // Handle 3D Physical Obstacle Collision Bump!
    scene.onCatBump = (obstacleName: string) => {
      tomAudio.playBoing();
      triggerReaction("💥");
      setSpeechBubbleText(`Oof! Bumped my little nose into the ${obstacleName}! 😅🐾`);
    };

    // Handle 3D Raycasted Pokes like Talking Tom / Talking Angela!
    scene.onCatPoke = (part: string) => {
      if (part === "head") {
        tomAudio.playPurr();
        scene.cat.animState = "purr";
        setSpeechBubbleText("Purrrr~ Chin scratches feel so heavenly! 😻💖");
        triggerReaction("💖");
        setTimeout(() => {
          if (scene.cat.animState === "purr") scene.cat.animState = "idle";
        }, 1600);
      } else if (part === "belly") {
        tomAudio.playGiggle();
        scene.cat.animState = "poke_belly";
        setSpeechBubbleText("Hehe! Tummy tickles! Wiggle wiggle! 😂💖");
        triggerReaction("❤️");
        setTimeout(() => {
          if (scene.cat.animState === "poke_belly") scene.cat.animState = "idle";
        }, 1400);
      } else {
        tomAudio.playMeow();
        scene.cat.animState = "wave";
        setSpeechBubbleText("High-five with my soft pink toe beans! 🐾🎀");
        triggerReaction("✨");
        setTimeout(() => {
          if (scene.cat.animState === "wave") scene.cat.animState = "idle";
        }, 1200);
      }
    };

    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  // Update walk speed
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.cat.walkSpeed = walkSpeed;
    }
  }, [walkSpeed]);

  const triggerReaction = (emoji: string) => {
    setReactionOverlay(emoji);
    setTimeout(() => setReactionOverlay(null), 1000);
  };

  // Talking Tom's Listen & Voice Interaction (AI Brain vs Repeat)
  const handleTalkButton = () => {
    if (isListening) return;
    setIsListening(true);
    setSpeechBubbleText("Listening to you... Speak to Kitty! 🎤🐾");

    tomAudio.listen(async (transcript) => {
      setIsListening(false);
      if (!transcript || transcript.trim().length === 0) {
        setSpeechBubbleText("Meow? I couldn't hear you clearly! Speak again! 🐾");
        return;
      }

      setSpeechBubbleText(`"${transcript}"`);

      if (aiChatMode) {
        // AI Brain Mode (Free LLM)
        setSpeechBubbleText(`Thinking... 🐾💭`);
        try {
          const reply = await freeLlm.askCat(transcript);
          setSpeechBubbleText(reply);
          tomAudio.repeatInTomVoice(reply);
        } catch {
          tomAudio.repeatInTomVoice(transcript);
        }
      } else {
        // Classic Talking Tom Mimic Repeat
        tomAudio.repeatInTomVoice(transcript);
      }
    });
  };

  // Actions Trigger
  const handleAction = (action: string) => {
    if (!sceneRef.current) return;
    const cat = sceneRef.current.cat;

    switch (action) {
      case "purr":
        cat.animState = "purr";
        tomAudio.playPurr();
        setSpeechBubbleText("Purrrrr~ Feeling so cozy and loved! 😽💖");
        triggerReaction("💖");
        setTimeout(() => {
          if (cat.animState === "purr") cat.animState = "idle";
        }, 2500);
        break;

      case "dance":
        cat.animState = "dance";
        confetti({ particleCount: 85, spread: 85, origin: { y: 0.6 } });
        tomAudio.playTone(880, 0.3);
        setSpeechBubbleText("Meow! Watch my happy kitten dance moves! 💃🎵");
        tomAudio.repeatInTomVoice("Yay! Watch my playful kitten dance moves!");
        setTimeout(() => {
          if (cat.animState === "dance") cat.animState = "idle";
        }, 3200);
        break;

      case "sit":
        cat.animState = "sit";
        setSpeechBubbleText("Tucked in my little paws! Perfect cat loaf pose! 🐾");
        tomAudio.playTone(660, 0.15);
        break;

      case "sleep":
        cat.animState = "sleep";
        tomAudio.playYawn();
        setSpeechBubbleText("Curling up in the warm sunbeam for a cat nap... Zzz... 😴");
        break;

      case "wave":
        cat.animState = "wave";
        tomAudio.playMeow();
        setSpeechBubbleText("Meow friend! High-five with my soft pink toe beans! 👋🐾");
        tomAudio.repeatInTomVoice("Meow! Welcome to my cozy sunlit room!");
        setTimeout(() => {
          if (cat.animState === "wave") cat.animState = "idle";
        }, 1800);
        break;

      case "walk":
        cat.animState = "walk";
        setSpeechBubbleText("Kitten trot! Click anywhere on the floor to walk! 🐾");
        break;

      case "pout":
        cat.animState = "pout";
        tomAudio.playBoing();
        setSpeechBubbleText("Startled jump! Swishing my tail! 😸💨");
        triggerReaction("💨");
        setTimeout(() => {
          if (cat.animState === "pout") cat.animState = "idle";
        }, 1200);
        break;
    }
    setActiveMenu("none");
  };

  // Food System (Feed Cat)
  const handleFeed = (food: "milk" | "fish" | "berry") => {
    if (!sceneRef.current) return;
    const cat = sceneRef.current.cat;

    if (food === "milk") {
      cat.animState = "sit";
      tomAudio.playMilkSlurp();
      setSpeechBubbleText("Slurp slurp! Warm sweet milk! So yummy! 🥛😻");
      triggerReaction("🥛");
      setTimeout(() => {
        tomAudio.playPurr();
        tomAudio.repeatInTomVoice("Purrr~ Delicious warm milk! Thank you!");
      }, 900);
    } else if (food === "fish") {
      cat.animState = "sit";
      tomAudio.playMunch();
      setSpeechBubbleText("Crunch crunch! Fresh crispy tuna fish! My favorite! 🐟😋");
      triggerReaction("🐟");
      setTimeout(() => {
        tomAudio.repeatInTomVoice("Meow! That tuna fish was purr-fect!");
        if (cat.animState === "sit") cat.animState = "idle";
      }, 1400);
    } else if (food === "berry") {
      cat.animState = "dance";
      tomAudio.playTone(950, 0.2);
      setSpeechBubbleText("Sweet strawberry cream! Brain freeze but so good! 🍓😍");
      triggerReaction("🍓");
      setTimeout(() => {
        tomAudio.repeatInTomVoice("Sweet sweet strawberry! Meow!");
        if (cat.animState === "dance") cat.animState = "idle";
      }, 1500);
    }
    setActiveMenu("none");
  };

  // Toggle Wardrobe
  const toggleBow = () => {
    if (sceneRef.current) {
      sceneRef.current.cat.toggleBow();
      setHasBow(!hasBow);
      setSpeechBubbleText(hasBow ? "Bow off!" : "Look at my pretty pink bow! 🎀✨");
      tomAudio.playTone(850, 0.15);
    }
  };

  const toggleSunglasses = () => {
    if (sceneRef.current) {
      sceneRef.current.cat.toggleSunglasses();
      setHasSunglasses(!hasSunglasses);
      setSpeechBubbleText(hasSunglasses ? "Back to natural look!" : "Look at my cool cat shades! 😎");
      tomAudio.playTone(700, 0.15);
    }
  };

  const toggleHat = () => {
    if (sceneRef.current) {
      sceneRef.current.cat.toggleHat();
      setHasHat(!hasHat);
      setSpeechBubbleText(hasHat ? "Hat off!" : "Princess party hat on! Ready to celebrate! 🎉");
      tomAudio.playTone(850, 0.15);
    }
  };

  // Chat message submit with Free LLM Brain
  const handleSendChat = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = (customQuery || chatInput).trim();
    if (!query) return;

    if (!customQuery) setChatInput("");
    setSpeechBubbleText(`Thinking... 🐾💭`);

    // Intelligent answers & voice repeat
    const lower = query.toLowerCase();
    if (lower.includes("purr") || lower.includes("love")) {
      handleAction("purr");
      return;
    } else if (lower.includes("dance") || lower.includes("nacho")) {
      handleAction("dance");
      return;
    } else if (lower.includes("milk") || lower.includes("doodh")) {
      handleFeed("milk");
      return;
    } else if (lower.includes("fish") || lower.includes("machli") || lower.includes("tuna")) {
      handleFeed("fish");
      return;
    } else if (lower.includes("sleep") || lower.includes("so jao")) {
      handleAction("sleep");
      return;
    }

    // Ask Free LLM API
    try {
      const reply = await freeLlm.askCat(query);
      setSpeechBubbleText(reply);
      tomAudio.repeatInTomVoice(reply);
    } catch {
      tomAudio.repeatInTomVoice(query);
    }
  };

  // Save LLM Config
  const handleSaveLlmConfig = () => {
    freeLlm.setConfig({
      provider: llmProvider,
      apiKey: groqKey.trim() || undefined,
    });
    setIsSavedKey(true);
    setTimeout(() => {
      setIsSavedKey(false);
      setShowLlmModal(false);
    }, 800);
  };

  // Fullscreen trigger
  const toggleFullscreen = () => {
    const elem = document.documentElement as any;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) elem.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0c0812] select-none font-sans flex items-center justify-center">
      {/* Dynamic Background Aura */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[550px] h-[550px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Top Universal Ecosystem Switcher */}
      <header className="fixed top-3 left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
        {/* Left: 3D Talking Cat Brand Badge */}
        <div className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-[#141624]/90 backdrop-blur-xl border border-white/10 shadow-xl">
          <span className="text-xl">🐱</span>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Talking Kitty 3D</span>
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse shadow-[0_0_8px_#f472b6]" />
            </div>
            <div className="text-[10px] text-white/60 font-mono">
              Real-Time WebGL Kitten
            </div>
          </div>
        </div>

        {/* Center / Right: View & Frame Switchers */}
        <div className="pointer-events-auto flex items-center gap-2 p-1 rounded-2xl bg-[#141624]/85 backdrop-blur-xl border border-white/10 shadow-xl">
          {/* AI Mode Toggle (Free LLM vs Mimic) */}
          <button
            type="button"
            onClick={() => setAiChatMode(!aiChatMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              aiChatMode
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-500/20"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
            title="Toggle between AI Conversational Brain (Free LLM) and Talking Tom Repeater"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{aiChatMode ? "AI Brain: ON" : "Mimic Mode"}</span>
          </button>

          {/* Free LLM Config Settings */}
          <button
            type="button"
            onClick={() => setShowLlmModal(true)}
            className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Free LLM API Settings (Groq / Pollinations)"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Mobile vs Desktop Frame Switcher */}
          <button
            type="button"
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              isMobileFrame
                ? "bg-pink-600 text-white shadow-md"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
            title="Toggle Android Mobile Phone Frame"
          >
            {isMobileFrame ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
            <span>{isMobileFrame ? "Android Mode" : "Desktop 3D"}</span>
          </button>

          {/* Switch to Story Sanctuary */}
          <button
            type="button"
            onClick={() => enterStory()}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="View Fourie Story Landing"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#ff85b8]" />
            <span className="hidden sm:inline">Story</span>
          </button>

          {/* Switch to Android Desktop OS */}
          <button
            type="button"
            onClick={() => enterDesktop(false)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Launch Android 15 Desktop Mode"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#5eead4]" />
            <span className="hidden sm:inline">Android OS</span>
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main 3D Container (Either Full Screen or Framed in Android Smartphone) */}
      <div
        className={`relative transition-all duration-500 overflow-hidden ${
          isMobileFrame
            ? "w-[390px] h-[780px] max-h-[92vh] rounded-[48px] border-[8px] border-[#22232a] shadow-[0_30px_90px_rgba(0,0,0,0.85),0_0_0_2px_rgba(255,255,255,0.1)] flex flex-col"
            : "w-full h-full"
        }`}
      >
        {/* Android Punch-Hole Camera and Speaker Bezel (In Mobile Mode) */}
        {isMobileFrame && (
          <>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 rounded-full bg-black z-50 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#111116] border border-white/10 mr-1" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#1e293b]" />
            </div>

            {/* Android Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-8 px-6 pt-1 z-40 flex items-center justify-between text-[11px] font-mono text-white/80 select-none">
              <span>12:00</span>
              <div className="flex items-center gap-1.5">
                <span>5G</span>
                <span>99%</span>
              </div>
            </div>
          </>
        )}

        {/* 1. Real-Time Three.js 3D WebGL Canvas Mount */}
        <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-pointer" />

        {/* Reaction Overlay (e.g. hearts, milk, fish, stars) */}
        {reactionOverlay && (
          <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center animate-ping">
            <span className="text-7xl drop-shadow-2xl">{reactionOverlay}</span>
          </div>
        )}

        {/* 2. Floating Dynamic Speech Bubble */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 pointer-events-none max-w-sm w-[90%] text-center">
          <div className="relative inline-block px-5 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md text-gray-900 shadow-[0_12px_35px_rgba(0,0,0,0.35)] text-xs sm:text-sm font-semibold border border-pink-200 animate-bounce">
            {speechBubbleText}
            {/* Bubble pointer tail */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 rotate-45 border-r border-b border-pink-200" />
          </div>
        </div>

        {/* 3. Left Talking Cat Arcade Action Buttons */}
        <div className="absolute top-28 left-4 z-40 flex flex-col gap-2.5">
          {/* Feed Menu Button */}
          <button
            type="button"
            onClick={() => setActiveMenu(activeMenu === "feed" ? "none" : "feed")}
            className="w-12 h-12 rounded-full bg-pink-500/90 hover:bg-pink-400 text-white shadow-[0_8px_20px_rgba(236,72,153,0.5)] border-2 border-white/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-90 cursor-pointer"
            title="Feed Kitty"
          >
            <Utensils className="w-5 h-5" />
          </button>

          {/* Action Menu Button */}
          <button
            type="button"
            onClick={() => setActiveMenu(activeMenu === "actions" ? "none" : "actions")}
            className="w-12 h-12 rounded-full bg-purple-600/90 hover:bg-purple-500 text-white shadow-[0_8px_20px_rgba(168,85,247,0.5)] border-2 border-white/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-90 cursor-pointer"
            title="Kitty Actions"
          >
            <Play className="w-5 h-5" />
          </button>

          {/* Wardrobe Button */}
          <button
            type="button"
            onClick={() => setActiveMenu(activeMenu === "wardrobe" ? "none" : "wardrobe")}
            className="w-12 h-12 rounded-full bg-rose-500/90 hover:bg-rose-400 text-white shadow-[0_8px_20px_rgba(244,63,94,0.5)] border-2 border-white/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-90 cursor-pointer"
            title="Pink Bow & Accessories"
          >
            <Glasses className="w-5 h-5" />
          </button>

          {/* Purr Button */}
          <button
            type="button"
            onClick={() => handleAction("purr")}
            className="w-12 h-12 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-[0_8px_20px_rgba(16,185,129,0.5)] border-2 border-white/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-90 cursor-pointer"
            title="Purr & Knead"
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* 4. Sub-Menus (Feed / Actions / Wardrobe Popups) */}
        {activeMenu === "feed" && (
          <div className="absolute top-28 left-20 z-40 p-3 rounded-2xl bg-[#141624]/95 backdrop-blur-2xl border border-white/15 shadow-2xl flex flex-col gap-2 animate-fadeIn">
            <div className="text-[10px] font-mono text-white/60 uppercase font-bold px-1">Feed Kitty</div>
            <button
              type="button"
              onClick={() => handleFeed("milk")}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-pink-500/30 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>🥛</span>
              <span>Warm Sweet Milk</span>
            </button>
            <button
              type="button"
              onClick={() => handleFeed("fish")}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-cyan-500/30 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>🐟</span>
              <span>Crispy Tuna Fish</span>
            </button>
            <button
              type="button"
              onClick={() => handleFeed("berry")}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-rose-500/30 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>🍓</span>
              <span>Strawberry Cream</span>
            </button>
          </div>
        )}

        {activeMenu === "actions" && (
          <div className="absolute top-28 left-20 z-40 p-3 rounded-2xl bg-[#141624]/95 backdrop-blur-2xl border border-white/15 shadow-2xl flex flex-col gap-2 animate-fadeIn">
            <div className="text-[10px] font-mono text-white/60 uppercase font-bold px-1">Kitten Actions</div>
            <button
              type="button"
              onClick={() => handleAction("purr")}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-pink-500/30 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>😻</span>
              <span>Purr & Knead</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction("dance")}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-purple-500/30 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>💃</span>
              <span>Playful Dance</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction("sit")}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-amber-500/30 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>🧘</span>
              <span>Cat Loaf / Sit</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction("sleep")}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-indigo-500/30 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>🛏️</span>
              <span>Sunbeam Cat Nap</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction("wave")}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-pink-500/30 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>👋</span>
              <span>Sweet Friendly Wave</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction("walk")}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-emerald-500/30 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>🐾</span>
              <span>Floor Trot</span>
            </button>
          </div>
        )}

        {activeMenu === "wardrobe" && (
          <div className="absolute top-28 left-20 z-40 p-3 rounded-2xl bg-[#141624]/95 backdrop-blur-2xl border border-white/15 shadow-2xl flex flex-col gap-2 animate-fadeIn">
            <div className="text-[10px] font-mono text-white/60 uppercase font-bold px-1">Accessories</div>
            <button
              type="button"
              onClick={toggleBow}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                hasBow ? "bg-pink-600 text-white" : "bg-white/5 hover:bg-pink-500/20 text-white"
              }`}
            >
              <span>🎀</span>
              <span>Pink Ribbon Bow</span>
            </button>
            <button
              type="button"
              onClick={toggleSunglasses}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                hasSunglasses ? "bg-cyan-600 text-white" : "bg-white/5 hover:bg-cyan-500/20 text-white"
              }`}
            >
              <span>🕶️</span>
              <span>Cool Cat Shades</span>
            </button>
            <button
              type="button"
              onClick={toggleHat}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                hasHat ? "bg-amber-600 text-white" : "bg-white/5 hover:bg-amber-500/20 text-white"
              }`}
            >
              <span>🎉</span>
              <span>Princess Party Hat</span>
            </button>
          </div>
        )}

        {/* 5. Center Bottom: The Iconic Glowing Microphone Repeat Button */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleTalkButton}
            className={`px-6 py-3.5 rounded-full font-bold text-sm tracking-wide flex items-center gap-3 transition-all cursor-pointer shadow-[0_12px_35px_rgba(0,0,0,0.5)] border-2 ${
              isListening
                ? "bg-rose-600 text-white border-white animate-pulse scale-110 shadow-[0_0_35px_rgba(225,29,72,0.8)]"
                : isSpeaking
                ? "bg-pink-500 text-white border-white animate-bounce shadow-[0_0_30px_rgba(236,72,153,0.7)]"
                : "bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#6366f1] text-white border-white/40 hover:scale-105 active:scale-95"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Mic className={`w-4 h-4 ${isListening ? "animate-spin" : ""}`} />
            </div>
            <span>
              {isListening ? "Listening... Speak to Kitty!" : isSpeaking ? "Kitty Speaking! 🎀🐾" : "Tap to Talk & Repeat"}
            </span>
          </button>

          <span className="text-[10px] font-mono text-white/70 bg-black/40 px-2.5 py-0.5 rounded-full backdrop-blur-md">
            Tap Kitty head to scratch, belly to tickle, or drag to walk!
          </span>
        </div>

        {/* 6. Bottom-Right: Interactive Chat & Quick Chips */}
        <div className="absolute bottom-6 right-4 z-40 w-72 sm:w-80 hidden md:block">
          <div className="p-3 rounded-2xl bg-[#141624]/90 backdrop-blur-xl border border-white/10 shadow-2xl space-y-2">
            <form onSubmit={handleSendChat} className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Talk with Kitty..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-pink-400"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex flex-wrap gap-1 text-[10px]">
              {[
                "Tell me a joke",
                "Who are you?",
                "Purr for me!",
                "Drink warm milk",
                "Eat crispy tuna",
                "Dance kitty!",
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSendChat(undefined, chip)}
                  className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-pink-500/25 text-white/85 border border-white/10 cursor-pointer transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 7. Bottom-Left: Walking Speed Slider */}
        <div className="absolute bottom-6 left-4 z-40 hidden sm:block w-44">
          <div className="p-2.5 rounded-2xl bg-[#141624]/85 backdrop-blur-xl border border-white/10 shadow-lg space-y-1">
            <div className="text-[10px] font-semibold text-white/70">3D Trot Speed</div>
            <div className="flex items-center gap-1.5 text-xs">
              <span>🐢</span>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={walkSpeed}
                onChange={(e) => setWalkSpeed(parseFloat(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer h-1.5 bg-white/20 rounded-lg"
              />
              <span>🐇</span>
            </div>
          </div>
        </div>

        {/* Android Navigation Bar (In Mobile Mode) */}
        {isMobileFrame && (
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/50 rounded-full z-50 pointer-events-none" />
        )}
      </div>

      {/* Free LLM API Settings Modal */}
      {showLlmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#141624] border border-white/15 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-pink-400" />
                <h3 className="font-bold text-base">Free LLM Kitty Brain</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLlmModal(false)}
                className="text-white/50 hover:text-white p-1 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              Kitty uses free, high-speed LLM APIs recommended in{" "}
              <a
                href="https://github.com/open-free-llm-api/awesome-freellm-apis"
                target="_blank"
                rel="noreferrer"
                className="text-pink-400 underline hover:text-pink-300 font-medium"
              >
                awesome-freellm-apis
              </a>
              . By default, Pollinations AI runs with 0 API keys needed!
            </p>

            {/* Provider selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/80">API Provider</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLlmProvider("pollinations")}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-colors cursor-pointer ${
                    llmProvider === "pollinations"
                      ? "bg-pink-600/30 border-pink-400 text-white"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>Pollinations AI</span>
                    {llmProvider === "pollinations" && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">100% Free · No Key Needed</div>
                </button>

                <button
                  type="button"
                  onClick={() => setLlmProvider("groq")}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-colors cursor-pointer ${
                    llmProvider === "groq"
                      ? "bg-pink-600/30 border-pink-400 text-white"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>Groq Cloud</span>
                    {llmProvider === "groq" && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <div className="text-[10px] text-amber-400 mt-0.5">Free Key · Llama 3.3 70B</div>
                </button>
              </div>
            </div>

            {llmProvider === "groq" && (
              <div className="space-y-1.5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white/80">Groq API Key</label>
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-pink-400 underline hover:text-pink-300"
                  >
                    Get free Groq key ↗
                  </a>
                </div>
                <input
                  type="password"
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-pink-400 font-mono"
                />
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLlmModal(false)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveLlmConfig}
                className="px-4 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                {isSavedKey ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : null}
                <span>{isSavedKey ? "Saved!" : "Save Settings"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const TalkingCatApp = TalkingPandaApp;
