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
  const [speechBubbleText, setSpeechBubbleText] = useState("Hey! I'm your cute 3D Talking Panda! 🐾");
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

    // Connect audio speaking states to 3D Panda model
    tomAudio.onSpeechStart = () => {
      setIsSpeaking(true);
      if (sceneRef.current) sceneRef.current.panda.isSpeaking = true;
    };

    tomAudio.onSpeechEnd = () => {
      setIsSpeaking(false);
      if (sceneRef.current) sceneRef.current.panda.isSpeaking = false;
    };

    // Handle 3D Physical Obstacle Collision Bump!
    scene.onPandaBump = (obstacleName: string) => {
      tomAudio.playBoing();
      triggerReaction("💥");
      setSpeechBubbleText(`Oof! Bumped into ${obstacleName}! 😅🐾`);
    };

    // Handle 3D Raycasted Pokes like Talking Tom!
    scene.onPandaPoke = (part: string) => {
      if (part === "head") {
        tomAudio.playBoing();
        scene.panda.animState = "poke_head";
        setSpeechBubbleText("Ouch! My head is spinning! 💫");
        triggerReaction("💫");
        setTimeout(() => {
          if (scene.panda.animState === "poke_head") scene.panda.animState = "idle";
        }, 1200);
      } else if (part === "belly") {
        tomAudio.playGiggle();
        scene.panda.animState = "poke_belly";
        setSpeechBubbleText("Hehe! Ticklish! That tickles! 😂");
        triggerReaction("❤️");
        setTimeout(() => {
          if (scene.panda.animState === "poke_belly") scene.panda.animState = "idle";
        }, 1400);
      } else {
        tomAudio.playTone(550, 0.15);
        scene.panda.animState = "wave";
        setSpeechBubbleText("High-five friend! 🐾");
        triggerReaction("✨");
        setTimeout(() => {
          if (scene.panda.animState === "wave") scene.panda.animState = "idle";
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
      sceneRef.current.panda.walkSpeed = walkSpeed;
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
    setSpeechBubbleText("Listening to you... Speak something! 🎤");

    tomAudio.listen(async (transcript) => {
      setIsListening(false);
      if (!transcript || transcript.trim().length === 0) {
        setSpeechBubbleText("I couldn't hear clearly! Try speaking again! 🐾");
        return;
      }

      setSpeechBubbleText(`"${transcript}"`);

      if (aiChatMode) {
        // AI Brain Mode (Free LLM)
        setSpeechBubbleText(`Thinking... 🐾💭`);
        try {
          const reply = await freeLlm.askPanda(transcript);
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
    const p = sceneRef.current.panda;

    switch (action) {
      case "dance":
        p.animState = "dance";
        confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
        tomAudio.playTone(880, 0.3);
        setSpeechBubbleText("Party time! Dance with me! 🎵💃");
        tomAudio.repeatInTomVoice("Yay! Watch my happy 3D dance moves!");
        setTimeout(() => {
          if (p.animState === "dance") p.animState = "idle";
        }, 3200);
        break;

      case "sit":
        p.animState = "sit";
        setSpeechBubbleText("Sitting down on the warm wooden floor! 🎋");
        tomAudio.playMunch();
        break;

      case "sleep":
        p.animState = "sleep";
        tomAudio.playYawn();
        setSpeechBubbleText("Taking a cozy afternoon nap... Zzz... 😴");
        break;

      case "fart":
        p.animState = "fart";
        tomAudio.playFart();
        setSpeechBubbleText("Oops! Excuse me! Hahaha! 💨😂");
        triggerReaction("💨");
        setTimeout(() => {
          if (p.animState === "fart") p.animState = "idle";
        }, 1500);
        break;

      case "wave":
        p.animState = "wave";
        setSpeechBubbleText("Hello friend! Nice to meet you! 👋🐾");
        tomAudio.repeatInTomVoice("Hello! Welcome to my 3D room!");
        setTimeout(() => {
          if (p.animState === "wave") p.animState = "idle";
        }, 1800);
        break;

      case "walk":
        p.animState = "walk";
        setSpeechBubbleText("Walking around! Click on the floor or bump into furniture! 🐾");
        break;
    }
    setActiveMenu("none");
  };

  // Food System (Feed Panda)
  const handleFeed = (food: "bamboo" | "chili" | "icecream") => {
    if (!sceneRef.current) return;
    const p = sceneRef.current.panda;

    if (food === "bamboo") {
      p.animState = "sit";
      tomAudio.playMunch();
      setSpeechBubbleText("Mmm! Fresh juicy bamboo! Crunch crunch! 🎋😋");
      triggerReaction("🎋");
      setTimeout(() => {
        tomAudio.repeatInTomVoice("Super delicious bamboo! Thank you!");
      }, 800);
    } else if (food === "chili") {
      p.animState = "poke_head";
      tomAudio.playSpicyGasp();
      setSpeechBubbleText("TOO SPICY! HOT HOT HOT! 🔥🌶️");
      triggerReaction("🔥");
      setTimeout(() => {
        tomAudio.repeatInTomVoice("Woah! That red chili was on fire!");
        if (p.animState === "poke_head") p.animState = "idle";
      }, 1500);
    } else if (food === "icecream") {
      p.animState = "dance";
      tomAudio.playTone(950, 0.2);
      setSpeechBubbleText("Yummy ice cream! Brain freeze but so good! 🍦😍");
      triggerReaction("🍦");
      setTimeout(() => {
        tomAudio.repeatInTomVoice("Sweet sweet ice cream! My favorite!");
        if (p.animState === "dance") p.animState = "idle";
      }, 1500);
    }
    setActiveMenu("none");
  };

  // Toggle Wardrobe
  const toggleSunglasses = () => {
    if (sceneRef.current) {
      sceneRef.current.panda.toggleSunglasses();
      setHasSunglasses(!hasSunglasses);
      setSpeechBubbleText(hasSunglasses ? "Back to natural look!" : "Look at my cool shades! 😎");
      tomAudio.playTone(700, 0.15);
    }
  };

  const toggleHat = () => {
    if (sceneRef.current) {
      sceneRef.current.panda.toggleHat();
      setHasHat(!hasHat);
      setSpeechBubbleText(hasHat ? "Hat off!" : "Party hat on! Ready to celebrate! 🎉");
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
    if (lower.includes("dance") || lower.includes("nacho")) {
      handleAction("dance");
      return;
    } else if (lower.includes("bamboo") || lower.includes("eat") || lower.includes("khana")) {
      handleFeed("bamboo");
      return;
    } else if (lower.includes("chili") || lower.includes("mirchi")) {
      handleFeed("chili");
      return;
    } else if (lower.includes("sleep") || lower.includes("so jao")) {
      handleAction("sleep");
      return;
    } else if (lower.includes("fart")) {
      handleAction("fart");
      return;
    }

    // Ask Free LLM API
    try {
      const reply = await freeLlm.askPanda(query);
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
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[550px] h-[550px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Top Universal Ecosystem Switcher */}
      <header className="fixed top-3 left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
        {/* Left: 3D Talking Tom Brand Badge */}
        <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#141624]/90 backdrop-blur-xl border border-white/10 shadow-xl">
          <span className="text-xl">🐼</span>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Talking Panda 3D</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            </div>
            <div className="text-[10px] text-white/60 font-mono">
              Real-Time WebGL Engine
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
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20"
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
                ? "bg-indigo-600 text-white shadow-md"
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
                <span>98%</span>
              </div>
            </div>
          </>
        )}

        {/* 1. Real-Time Three.js 3D WebGL Canvas Mount */}
        <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-pointer" />

        {/* Reaction Overlay (e.g. hearts, sparks, chili fire) */}
        {reactionOverlay && (
          <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center animate-ping">
            <span className="text-7xl drop-shadow-2xl">{reactionOverlay}</span>
          </div>
        )}

        {/* 2. Floating Dynamic Speech Bubble */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 pointer-events-none max-w-sm w-[90%] text-center">
          <div className="relative inline-block px-5 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md text-gray-900 shadow-[0_12px_35px_rgba(0,0,0,0.35)] text-xs sm:text-sm font-semibold border border-gray-200 animate-bounce">
            {speechBubbleText}
            {/* Bubble pointer tail */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 rotate-45 border-r border-b border-gray-200" />
          </div>
        </div>

        {/* 3. Left Talking Tom Arcade Action Buttons */}
        <div className="absolute top-28 left-4 z-40 flex flex-col gap-2.5">
          {/* Feed Menu Button */}
          <button
            type="button"
            onClick={() => setActiveMenu(activeMenu === "feed" ? "none" : "feed")}
            className="w-12 h-12 rounded-full bg-amber-500/90 hover:bg-amber-400 text-white shadow-[0_8px_20px_rgba(245,158,11,0.5)] border-2 border-white/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-90 cursor-pointer"
            title="Feed Panda"
          >
            <Utensils className="w-5 h-5" />
          </button>

          {/* Action Menu Button */}
          <button
            type="button"
            onClick={() => setActiveMenu(activeMenu === "actions" ? "none" : "actions")}
            className="w-12 h-12 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white shadow-[0_8px_20px_rgba(99,102,241,0.5)] border-2 border-white/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-90 cursor-pointer"
            title="Panda Actions"
          >
            <Play className="w-5 h-5" />
          </button>

          {/* Wardrobe Button */}
          <button
            type="button"
            onClick={() => setActiveMenu(activeMenu === "wardrobe" ? "none" : "wardrobe")}
            className="w-12 h-12 rounded-full bg-pink-500/90 hover:bg-pink-400 text-white shadow-[0_8px_20px_rgba(236,72,153,0.5)] border-2 border-white/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-90 cursor-pointer"
            title="Wardrobe & Hats"
          >
            <Glasses className="w-5 h-5" />
          </button>

          {/* Fart Prank Button (Classic Talking Tom!) */}
          <button
            type="button"
            onClick={() => handleAction("fart")}
            className="w-12 h-12 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-[0_8px_20px_rgba(16,185,129,0.5)] border-2 border-white/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-90 cursor-pointer"
            title="Funny Fart Prank"
          >
            <Wind className="w-5 h-5" />
          </button>
        </div>

        {/* 4. Sub-Menus (Feed / Actions / Wardrobe Popups) */}
        {activeMenu === "feed" && (
          <div className="absolute top-28 left-20 z-40 p-3 rounded-2xl bg-[#141624]/95 backdrop-blur-2xl border border-white/15 shadow-2xl flex flex-col gap-2 animate-fadeIn">
            <div className="text-[10px] font-mono text-white/60 uppercase font-bold px-1">Feed Menu</div>
            <button
              type="button"
              onClick={() => handleFeed("bamboo")}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-emerald-500/30 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>🎋</span>
              <span>Fresh Bamboo</span>
            </button>
            <button
              type="button"
              onClick={() => handleFeed("chili")}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-rose-500/30 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>🌶️</span>
              <span>Red Hot Chili</span>
            </button>
            <button
              type="button"
              onClick={() => handleFeed("icecream")}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-cyan-500/30 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>🍦</span>
              <span>Sweet Ice Cream</span>
            </button>
          </div>
        )}

        {activeMenu === "actions" && (
          <div className="absolute top-28 left-20 z-40 p-3 rounded-2xl bg-[#141624]/95 backdrop-blur-2xl border border-white/15 shadow-2xl flex flex-col gap-2 animate-fadeIn">
            <div className="text-[10px] font-mono text-white/60 uppercase font-bold px-1">Actions</div>
            <button
              type="button"
              onClick={() => handleAction("dance")}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-indigo-500/30 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>💃</span>
              <span>Happy Dance</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction("sit")}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-amber-500/30 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>🧘</span>
              <span>Sit Down</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction("sleep")}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-purple-500/30 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>🛏️</span>
              <span>Sleep / Nap</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction("wave")}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-pink-500/30 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>👋</span>
              <span>Friendly Wave</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction("walk")}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-emerald-500/30 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>🚶</span>
              <span>Floor Walk</span>
            </button>
          </div>
        )}

        {activeMenu === "wardrobe" && (
          <div className="absolute top-28 left-20 z-40 p-3 rounded-2xl bg-[#141624]/95 backdrop-blur-2xl border border-white/15 shadow-2xl flex flex-col gap-2 animate-fadeIn">
            <div className="text-[10px] font-mono text-white/60 uppercase font-bold px-1">Accessories</div>
            <button
              type="button"
              onClick={toggleSunglasses}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                hasSunglasses ? "bg-cyan-600 text-white" : "bg-white/5 hover:bg-cyan-500/20 text-white"
              }`}
            >
              <span>🕶️</span>
              <span>Cool Sunglasses</span>
            </button>
            <button
              type="button"
              onClick={toggleHat}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                hasHat ? "bg-rose-600 text-white" : "bg-white/5 hover:bg-rose-500/20 text-white"
              }`}
            >
              <span>🎉</span>
              <span>Party Hat</span>
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
                ? "bg-emerald-500 text-white border-white animate-bounce"
                : "bg-gradient-to-r from-[#6366f1] via-[#818cf8] to-[#a855f7] text-white border-white/40 hover:scale-105 active:scale-95"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Mic className={`w-4 h-4 ${isListening ? "animate-spin" : ""}`} />
            </div>
            <span>
              {isListening ? "Listening... Speak!" : isSpeaking ? "Panda Speaking! 🐾" : "Tap to Talk & Repeat"}
            </span>
          </button>

          <span className="text-[10px] font-mono text-white/70 bg-black/40 px-2.5 py-0.5 rounded-full backdrop-blur-md">
            Tap Panda body to poke or drag to walk!
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
                placeholder="Talk with Panda..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-indigo-400"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex flex-wrap gap-1 text-[10px]">
              {[
                "Tell me a joke",
                "Who are you?",
                "Dance karo!",
                "Bamboo khao!",
                "Walk to table",
                "What is your room?",
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSendChat(undefined, chip)}
                  className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-indigo-500/25 text-white/85 border border-white/10 cursor-pointer transition-colors"
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
            <div className="text-[10px] font-semibold text-white/70">3D Walk Speed</div>
            <div className="flex items-center gap-1.5 text-xs">
              <span>🐢</span>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={walkSpeed}
                onChange={(e) => setWalkSpeed(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-white/20 rounded-lg"
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
                <Bot className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-base">Free LLM API Brain</h3>
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
              Panda uses free, high-speed LLM APIs recommended in{" "}
              <a
                href="https://github.com/open-free-llm-api/awesome-freellm-apis"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 underline hover:text-indigo-300 font-medium"
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
                      ? "bg-indigo-600/30 border-indigo-400 text-white"
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
                      ? "bg-indigo-600/30 border-indigo-400 text-white"
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
                    className="text-[10px] text-indigo-400 underline hover:text-indigo-300"
                  >
                    Get free Groq key ↗
                  </a>
                </div>
                <input
                  type="password"
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-400 font-mono"
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
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-lg"
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
