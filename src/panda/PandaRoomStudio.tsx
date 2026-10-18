import React, { useState, useEffect, useRef, useCallback } from "react";
import { useStore } from "../core/store";
import { audio } from "../core/audio";
import { pandaAi } from "./pandaAi";
import { getTransparentImage } from "./imageUtils";
import confetti from "canvas-confetti";
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Smile,
  Crosshair,
  Smartphone,
  Maximize2,
  BookOpen,
  LayoutGrid,
  Settings,
  Music,
  Heart,
  User,
  Coffee,
} from "lucide-react";

type PandaAction = "walk" | "dance" | "sit" | "sleep" | "wave";

export const PandaRoomStudio: React.FC = () => {
  const enterStory = useStore((s) => s.enterStory);
  const enterDesktop = useStore((s) => s.enterDesktop);
  const muted = useStore((s) => s.muted);
  const toggleMute = useStore((s) => s.toggleMute);

  // Panda position & 3D floor state (percentages 0-100)
  const [pos, setPos] = useState({ x: 50, y: 72 });
  const [target, setTarget] = useState({ x: 50, y: 72 });
  const [facing, setFacing] = useState<"left" | "right">("right");
  const [currentAction, setCurrentAction] = useState<PandaAction>("walk");
  const [isMoving, setIsMoving] = useState(false);
  const [walkSpeed, setWalkSpeed] = useState<number>(3.5); // 1 (turtle) to 7 (rabbit)
  const [followCursor, setFollowCursor] = useState<boolean>(true);

  // Transparent Asset Cache
  const [assets, setAssets] = useState<{ [key: string]: string }>({});
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  // Voice & Chat State
  const [speechText, setSpeechText] = useState("Hey! I'm your AI Panda! 😊");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [showExpressions, setShowExpressions] = useState(false);
  const [expression, setExpression] = useState<string>("happy");
  const [showHint, setShowHint] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Pre-process and remove white studio backgrounds on client canvas
  useEffect(() => {
    let active = true;
    const loadAssets = async () => {
      const walk = await getTransparentImage("/assets/panda/panda_walk.jpg");
      const wave = await getTransparentImage("/assets/panda/panda_wave.jpg");
      const dance = await getTransparentImage("/assets/panda/panda_dance.jpg");
      const sit = await getTransparentImage("/assets/panda/panda_sit.jpg");
      const sleep = await getTransparentImage("/assets/panda/panda_sleep.jpg");

      if (active) {
        setAssets({
          walk,
          wave,
          dance,
          sit,
          sleep,
        });
        setAssetsLoaded(true);
      }
    };
    loadAssets();
    return () => {
      active = false;
    };
  }, []);

  // Floor Perspective boundaries:
  // minY: 48% (window/sofa edge in distance), maxY: 86% (foreground near camera)
  // minX: 18% (desk), maxX: 82% (sofa rug)
  const FLOOR = {
    minX: 18,
    maxX: 82,
    minY: 48,
    maxY: 86,
  };

  // 3D Perspective scale: smaller as Panda walks deeper into room
  const getScale = (y: number) => {
    const t = (y - FLOOR.minY) / (FLOOR.maxY - FLOOR.minY);
    return 0.65 + Math.max(0, Math.min(1, t)) * 0.55; // 0.65x to 1.2x
  };

  // Trigger Action with voice and animations
  const triggerAction = useCallback(
    (action: PandaAction, customReply?: string) => {
      setCurrentAction(action);
      audio.click();

      if (action === "dance") {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { x: pos.x / 100, y: pos.y / 100 },
          colors: ["#ff85b8", "#5eead4", "#fde047", "#c084fc"],
        });
        audio.squeak();
      } else if (action === "sit") {
        audio.note(520, 0, 0.2);
      } else if (action === "sleep") {
        audio.note(330, 0, 0.4);
      } else if (action === "wave") {
        audio.squeak();
      }

      if (customReply) {
        setSpeechText(customReply);
        setIsSpeaking(true);
        pandaAi.speak(
          customReply,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      }
    },
    [pos.x, pos.y]
  );

  // Mouse move handler over 3D room floor
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!followCursor || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
      const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

      // Only move if target is within walkable floor
      if (
        xPercent >= FLOOR.minX &&
        xPercent <= FLOOR.maxX &&
        yPercent >= FLOOR.minY &&
        yPercent <= FLOOR.maxY
      ) {
        setTarget({ x: xPercent, y: yPercent });
        if (showHint) setShowHint(false);
      }
    },
    [followCursor, showHint, FLOOR.minX, FLOOR.maxX, FLOOR.minY, FLOOR.maxY]
  );

  // Touch/Click to walk (Mobile & Desktop)
  const handleRoomClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(FLOOR.minX, Math.min(FLOOR.maxX, xPercent));
    const clampedY = Math.max(FLOOR.minY, Math.min(FLOOR.maxY, yPercent));

    setTarget({ x: clampedX, y: clampedY });
    if (currentAction !== "walk") setCurrentAction("walk");
    if (showHint) setShowHint(false);
  };

  // Smooth walking animation tick loop
  useEffect(() => {
    const step = () => {
      setPos((prev) => {
        const dx = target.x - prev.x;
        const dy = target.y - prev.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 0.6) {
          if (isMoving) setIsMoving(false);
          return prev;
        }

        if (!isMoving) setIsMoving(true);

        // Turn towards target
        if (dx < -0.3 && facing !== "left") setFacing("left");
        if (dx > 0.3 && facing !== "right") setFacing("right");

        // Move step proportional to walkSpeed
        const moveStep = (walkSpeed * 0.08) / Math.max(1, dist * 0.05);
        const nextX = prev.x + (dx / dist) * Math.min(dist, moveStep);
        const nextY = prev.y + (dy / dist) * Math.min(dist, moveStep);

        return { x: nextX, y: nextY };
      });

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [target, walkSpeed, isMoving, facing]);

  // Voice Listening
  const handleToggleListening = () => {
    if (isListening) {
      pandaAi.stopListening();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setSpeechText("Listening to you... Speak now! 🎤");
    pandaAi.startListening(
      (text) => {
        setIsListening(false);
        const res = pandaAi.processMessage(text);
        if (res.action) triggerAction(res.action as PandaAction, res.reply);
        else triggerAction("walk", res.reply);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  // Keyboard Spacebar for Voice Talk
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        handleToggleListening();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isListening]);

  // Handle chat submission
  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const query = chatInput;
    setChatInput("");

    const res = pandaAi.processMessage(query);
    if (res.action) {
      triggerAction(res.action as PandaAction, res.reply);
    } else {
      triggerAction("walk", res.reply);
    }
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

  // Determine current active image based on action
  const currentImg =
    currentAction === "dance"
      ? assets.dance || "/assets/panda/panda_dance.jpg"
      : currentAction === "sit"
      ? assets.sit || "/assets/panda/panda_sit.jpg"
      : currentAction === "sleep"
      ? assets.sleep || "/assets/panda/panda_sleep.jpg"
      : currentAction === "wave"
      ? assets.wave || "/assets/panda/panda_wave.jpg"
      : assets.walk || "/assets/panda/panda_walk.jpg";

  const currentScale = getScale(pos.y);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleRoomClick}
      className="relative w-screen h-screen overflow-hidden bg-black select-none font-sans"
    >
      {/* 1. Photorealistic Sunlit 3D Room Background */}
      <img
        src="/assets/panda/room_bg.jpg"
        alt="Cozy 3D Room"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />

      {/* Warm Ambient Sunbeam Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-rose-500/5 pointer-events-none" />

      {/* 2. Top-Left: AI Panda Status Card */}
      <div className="absolute top-4 left-4 z-40 flex items-center gap-2">
        <div className="px-4 py-2 rounded-2xl bg-[#141824]/85 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366f1] to-[#a855f7] flex items-center justify-center text-lg shadow-md">
            🐼
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <span>AI Panda</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            </div>
            <div className="text-[11px] text-emerald-400/90 font-mono">
              ● Online & Ready
            </div>
          </div>
        </div>

        {/* View Switchers: Story Sanctuary & Android Desktop */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-[#141824]/75 backdrop-blur-xl border border-white/10 shadow-lg">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              audio.click();
              enterStory();
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Open Story Landing"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#ff85b8]" />
            <span>Story</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              audio.click();
              enterDesktop(false);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Launch Android 15 Desktop"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#5eead4]" />
            <span>Android OS</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Top-Right: Click to Talk Card (Matching Image 1) */}
      <div className="absolute top-4 right-4 z-40">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleListening();
          }}
          className={`px-5 py-2.5 rounded-2xl backdrop-blur-xl border transition-all shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex items-center gap-3 cursor-pointer ${
            isListening
              ? "bg-[#6366f1] text-white border-[#818cf8] shadow-[0_0_25px_rgba(99,102,241,0.6)] animate-pulse"
              : "bg-[#141824]/85 text-white border-white/10 hover:border-indigo-400/50 hover:bg-[#1a2032]"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isListening ? "bg-white text-indigo-600" : "bg-indigo-500/20 text-indigo-400"
            }`}
          >
            <Mic className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold leading-tight">
              {isListening ? "Listening..." : "Click to talk"}
            </div>
            <div className="text-[10px] text-white/60 font-mono">
              or press space
            </div>
          </div>
        </button>
      </div>

      {/* 4. Left Sidebar Action Controls (Matching Image 1 Exactly) */}
      <div className="absolute top-24 left-4 z-30 flex flex-col gap-2 w-40 sm:w-44">
        {[
          { id: "walk", label: "Walk", icon: <User className="w-4 h-4" /> },
          { id: "dance", label: "Happy Dance", icon: <Music className="w-4 h-4" /> },
          { id: "sit", label: "Sit", icon: <Coffee className="w-4 h-4" /> },
          { id: "sleep", label: "Lie Down", icon: <Heart className="w-4 h-4" /> },
          { id: "wave", label: "Wave", icon: <Sparkles className="w-4 h-4" /> },
        ].map((item) => {
          const isActive = currentAction === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerAction(item.id as PandaAction);
              }}
              className={`w-full px-4 py-3 rounded-2xl backdrop-blur-xl border transition-all text-xs font-semibold flex items-center gap-3 cursor-pointer shadow-md ${
                isActive
                  ? "bg-gradient-to-r from-[#6366f1] to-[#818cf8] text-white border-indigo-400 shadow-[0_4px_20px_rgba(99,102,241,0.4)] scale-102"
                  : "bg-[#141824]/80 text-white/90 border-white/10 hover:bg-[#1d2335] hover:text-white"
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActive ? "bg-white/20 text-white" : "bg-white/5 text-indigo-300"
                }`}
              >
                {item.icon}
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Say Hello Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerAction("wave", "Hey there! I am your AI Panda friend! So happy to talk to you! 😊🐾");
          }}
          className="w-full px-4 py-3 rounded-2xl bg-[#141824]/80 hover:bg-[#1d2335] backdrop-blur-xl border border-white/10 transition-all text-xs font-semibold text-white/90 hover:text-white flex items-center gap-3 cursor-pointer shadow-md"
        >
          <div className="p-1 rounded-lg bg-white/5 text-pink-400">
            <Smile className="w-4 h-4" />
          </div>
          <span>Say Hello</span>
        </button>
      </div>

      {/* 5. Right Vertical Utility Buttons (Matching Image 1) */}
      <div className="absolute top-24 right-4 z-30 flex flex-col gap-2">
        {/* Voice Toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
          className={`p-3 rounded-2xl backdrop-blur-xl border shadow-md flex items-center gap-2 cursor-pointer transition-all ${
            muted
              ? "bg-[#141824]/80 text-rose-400 border-rose-500/30"
              : "bg-[#141824]/80 text-white hover:bg-[#1e2538] border-white/10"
          }`}
          title="Toggle Voice"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span className="text-xs font-medium pr-1">Voice</span>
        </button>

        {/* Expressions Toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowExpressions(!showExpressions);
          }}
          className="p-3 rounded-2xl bg-[#141824]/80 hover:bg-[#1e2538] backdrop-blur-xl border border-white/10 text-white shadow-md flex items-center gap-2 cursor-pointer transition-all"
          title="Toggle Expressions"
        >
          <Smile className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-medium pr-1">Expressions</span>
        </button>

        {/* Follow Cursor Toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setFollowCursor(!followCursor);
          }}
          className={`p-3 rounded-2xl backdrop-blur-xl border shadow-md flex items-center gap-2 cursor-pointer transition-all ${
            followCursor
              ? "bg-indigo-600/30 text-indigo-300 border-indigo-400/40"
              : "bg-[#141824]/80 text-white/60 border-white/10"
          }`}
          title="Follow Cursor Toggle"
        >
          <Crosshair className="w-4 h-4" />
          <span className="text-xs font-medium pr-1">Follow Cursor</span>
        </button>

        {/* Mobile Friendly Indicator */}
        <div className="p-3 rounded-2xl bg-[#141824]/80 backdrop-blur-xl border border-white/10 text-white/80 shadow-md flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium pr-1">Tap to Walk</span>
        </div>
      </div>

      {/* Expression Picker Dropdown */}
      {showExpressions && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-44 right-20 z-50 p-3 rounded-2xl bg-[#141824]/95 backdrop-blur-2xl border border-white/15 shadow-2xl flex flex-col gap-2 text-xs"
        >
          <div className="text-[11px] font-mono text-white/60 uppercase">Choose Expression</div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "happy", label: "Happy 😊", action: "wave" },
              { id: "dance", label: "Party 🎉", action: "dance" },
              { id: "bamboo", label: "Bamboo 🎋", action: "sit" },
              { id: "sleepy", label: "Sleepy 😴", action: "sleep" },
            ].map((exp) => (
              <button
                key={exp.id}
                type="button"
                onClick={() => {
                  setExpression(exp.id);
                  setShowExpressions(false);
                  triggerAction(exp.action as PandaAction);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-indigo-500/30 text-white transition-colors cursor-pointer text-center font-medium"
              >
                {exp.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 6. Dynamic Walking Panda & Floor Shadow on Parquet Floor */}
      <div
        className="absolute pointer-events-none transition-all duration-75 ease-out"
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          transform: `translate(-50%, -85%)`,
          zIndex: Math.floor(pos.y * 10),
        }}
      >
        {/* Soft Dynamic Contact Shadow on Floor */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 h-12 rounded-[50%] bg-black/45 blur-md pointer-events-none transition-transform"
          style={{
            transform: `translateX(-50%) scale(${currentScale * 0.95})`,
          }}
        />

        {/* Speech Bubble Floating Above Head */}
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-auto transition-transform"
          style={{
            transform: `translateX(-50%) scale(${Math.max(0.8, currentScale * 0.9)}) translateY(-20px)`,
          }}
        >
          <div className="relative px-5 py-2.5 rounded-2xl bg-white text-gray-900 shadow-[0_12px_35px_rgba(0,0,0,0.4)] text-xs sm:text-sm font-semibold max-w-xs text-center border border-gray-200">
            {speechText}
            {/* Speech Bubble Pointer Tail */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-gray-200" />
          </div>
        </div>

        {/* 3D Panda Character Model Sprite with Scale & Flip */}
        <div
          className={`relative cursor-pointer transition-transform duration-100 ${
            isMoving && currentAction === "walk" ? "animate-bounce" : ""
          } ${currentAction === "dance" ? "animate-pulse" : ""}`}
          style={{
            transform: `scale(${currentScale}) scaleX(${facing === "left" ? -1 : 1})`,
            filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.35))",
          }}
          onClick={(e) => {
            e.stopPropagation();
            triggerAction("wave", "Yay! You tapped me! High five! 🐾❤️");
          }}
          title="Click to interact with Panda!"
        >
          <img
            src={currentImg}
            alt="3D AI Panda"
            className="w-48 sm:w-56 h-auto object-contain select-none pointer-events-auto"
            style={{
              mixBlendMode: "multiply", // Blends white background cleanly with warm floor!
            }}
          />
        </div>
      </div>

      {/* 7. Bottom Center: Move Cursor Indicator Pill */}
      {showHint && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-bounce">
          <div className="px-5 py-2 rounded-full bg-[#141824]/90 backdrop-blur-xl border border-white/15 text-xs text-white/90 shadow-xl flex items-center gap-2 font-medium">
            <Crosshair className="w-3.5 h-3.5 text-indigo-400" />
            <span>Move your cursor to make Panda walk! ✨</span>
          </div>
        </div>
      )}

      {/* 8. Bottom-Left: Walking Speed Card (Matching Image 1) */}
      <div className="absolute bottom-6 left-4 z-40 w-52 sm:w-56">
        <div className="p-3.5 rounded-2xl bg-[#141824]/85 backdrop-blur-xl border border-white/10 shadow-xl space-y-2">
          <div className="text-[11px] font-semibold text-white/80">Walking Speed</div>
          <div className="flex items-center gap-2">
            <span className="text-sm">🐢</span>
            <input
              type="range"
              min="1"
              max="7"
              step="0.5"
              value={walkSpeed}
              onChange={(e) => setWalkSpeed(parseFloat(e.target.value))}
              onClick={(e) => e.stopPropagation()}
              className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-white/20 rounded-lg"
            />
            <span className="text-sm">🐇</span>
          </div>
        </div>

        {/* Companion Tagline */}
        <div className="mt-2 px-3 py-1.5 rounded-full bg-[#141824]/75 backdrop-blur-xl border border-white/10 text-[11px] text-white/70 flex items-center gap-1.5">
          <span>🐾</span>
          <span>A smarter, cuter companion ❤️</span>
        </div>
      </div>

      {/* 9. Bottom-Right: Interactive Chat Box (Matching Image 1) */}
      <div className="absolute bottom-6 right-4 z-40 w-80 sm:w-96 max-w-[calc(100vw-32px)]">
        <div className="p-3 rounded-2xl bg-[#141824]/85 backdrop-blur-xl border border-white/10 shadow-2xl space-y-2.5">
          {/* Text Input Row */}
          <form onSubmit={handleSendChat} className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-indigo-400 transition-colors"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer shadow-md"
              title="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]" onClick={(e) => e.stopPropagation()}>
            {[
              "What can you do?",
              "Tell me a joke",
              "How are you?",
              "Dance karo!",
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  const res = pandaAi.processMessage(chip);
                  if (res.action) triggerAction(res.action as PandaAction, res.reply);
                  else triggerAction("walk", res.reply);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-indigo-500/20 text-white/80 hover:text-white border border-white/10 transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
