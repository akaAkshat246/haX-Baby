import React, { useState, useEffect, useRef } from "react";
import { Room3DScene, RoomStation } from "./Room3DScene";
import { tomAudio } from "./TalkingTomAudio";
import { freeLlm } from "./freeLlmClient";
import { useStore, WindowId } from "../core/store";
import { audio } from "../core/audio";
import {
  Mic,
  Send,
  Sparkles,
  Smartphone,
  Monitor,
  Maximize2,
  BookOpen,
  Music,
  Radio,
  Archive,
  LayoutGrid,
  Utensils,
  Play,
  Glasses,
  Coffee,
  Heart,
  Wind,
  Smile,
  Disc,
  Crown,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  X,
  FolderArchive,
  MessageSquare,
  Network,
  Globe,
  Trash2,
  Key,
  ShieldCheck,
  Zap,
} from "lucide-react";

// Android Window Components for Desktop Mode
import { AndroidWindow } from "../android/AndroidWindow";
import { AboutWindow } from "../components/windows/AboutWindow";
import { ProjectsWindow } from "../components/windows/ProjectsWindow";
import { LullabyLabWindow } from "../components/windows/LullabyLabWindow";
import { NotesWindow } from "../components/windows/NotesWindow";
import { RecycleBinWindow } from "../components/windows/RecycleBinWindow";
import { ChatWindow } from "../components/windows/ChatWindow";
import { RouterWindow } from "../components/windows/RouterWindow";
import { GeoCitiesWindow } from "../components/windows/GeoCitiesWindow";
import { WebringWindow } from "../components/windows/WebringWindow";
import { SecretRoomWindow } from "../components/windows/SecretRoomWindow";

const VOICE_LANGUAGES = [
  { label: "English", locale: "en-US" },
  { label: "हिन्दी", locale: "hi-IN" },
  { label: "मराठी", locale: "mr-IN" },
  { label: "ಕನ್ನಡ", locale: "kn-IN" },
  { label: "తెలుగు", locale: "te-IN" },
  { label: "Français", locale: "fr-FR" },
  { label: "Русский", locale: "ru-RU" },
];

function localizeKittyLine(text: string, locale: string) {
  if (locale.startsWith("en")) return text;
  const lower = text.toLowerCase();
  const key = /dance|playful kitten|strawberry/.test(lower)
    ? "dance"
    : /sleep|nap|yawn/.test(lower)
      ? "sleep"
      : /walk|explore|move/.test(lower)
        ? "walk"
        : /milk|slurp/.test(lower)
          ? "milk"
          : /fish|tuna|munch/.test(lower)
            ? "fish"
            : /hello|welcome|high-five|bonjour|namaste|namaskar|namaskara|namaskaram/.test(lower)
              ? "hello"
              : /purr|chin scratch|cozy|happy|tickle/.test(lower)
                ? "purr"
                : "hello";

  const lines: Record<string, Record<string, string>> = {
    "hi": { dance: "Chalo, mere saath dance karo! Meow!", sleep: "Main ab ek pyaari si nap leti hoon. Purr!", walk: "Chalo, saath mein kamra explore karte hain!", milk: "Garam doodh, kitna yummy! Shukriya!", fish: "Yummy machhli! Yeh meri favourite hai!", hello: "Namaste dost! Tumse milkar bahut khushi hui!", purr: "Purr, tumhare saath mujhe bahut achha lagta hai!" },
    "mr": { dance: "Chala, majhyasobat dance kara! Meow!", sleep: "Mi ata godashi vishranti ghete. Purr!", walk: "Chala, apan ekatra phiruya!", milk: "Garam doodh, khup chhan! Dhanyavaad!", fish: "Mast masali! Hi mazi aavadti aahe!", hello: "Namaskar mitra! Tula bhetun anand zala!", purr: "Purr, tujhya sobat mala khup chhan vatata!" },
    "kn": { dance: "Banni, nanna jothe dance maadi! Meow!", sleep: "Naanu iga muddaagi nidde maaduttene. Purr!", walk: "Banni, naavu ottige explore maadona!", milk: "Bisi haalu, tumba chennagide! Dhanyavaada!", fish: "Ruchiyaada meenu! Idhu nanna favourite!", hello: "Namaskara snehita! Nimmannu nodi khushi aayitu!", purr: "Purr, ninna jothe nanage tumba santosha!" },
    "te": { dance: "Randi, naatho kalisi dance cheyyandi! Meow!", sleep: "Nenu ippudu haayiga nidrapotanu. Purr!", walk: "Randi, manam kalisi explore cheddam!", milk: "Vedi paalu, chaala ruchiga unnayi!", fish: "Ruchikaramaina chepa! Naaku chaala ishtam!", hello: "Namaskaram nestama! Ninnu kalavadam santosham!", purr: "Purr, neetho unte naaku chaala santosham!" },
    "fr": { dance: "Dansons ensemble, mon ami ! Miaou !", sleep: "Je vais faire une petite sieste. Ronron !", walk: "Explorons la pièce ensemble !", milk: "Du lait chaud, quel délice ! Merci !", fish: "Miam, du poisson ! C'est mon préféré !", hello: "Bonjour mon ami ! Je suis ravie de te voir !", purr: "Ronron, je suis si heureuse avec toi !" },
    "ru": { dance: "Давай танцевать вместе! Мяу!", sleep: "Пора сладко вздремнуть. Мурр!", walk: "Давай вместе исследуем комнату!", milk: "Тёплое молочко, как вкусно!", fish: "Вкусная рыбка! Я её обожаю!", hello: "Привет, друг! Я так рада тебя видеть!", purr: "Мурр, мне так хорошо рядом с тобой!" },
  };
  const language = locale.slice(0, 2).toLowerCase();
  return lines[language]?.[key] || text;
}

function quickCatCommand(query: string) {
  const text = query.toLowerCase();
  if (/\b(purr|ronron|ronronner|purrr)\b/.test(text) || /мурр|пурр/.test(text)) return "purr";
  if (/\b(dance|dancing|naacho|nacha|nritya|maadi|cheyyandi|dansons|danse)\b/.test(text) || /танц|नाच|ನೃತ್ಯ|ನಾಚು|నాట్యం|ఆడు/.test(text)) return "dance";
  if (/\b(sleep|nap|so ja|nidra|nidde|nidrapo|sieste|dors)\b/.test(text) || /спать|спи|ನಿದ್ರೆ|నిద్ర|सो जा|सोने/.test(text)) return "sleep";
  if (/\b(walk|move|explore|chalo|phiruya|banni|randi|explorons)\b/.test(text) || /пойд|идём|चलो|चल|ನಡೆ|నడ/.test(text)) return "walk";
  if (/\b(milk|doodh|paalu|haalu|lait)\b/.test(text) || /молок|दूध|ಹಾಲು|పాలు/.test(text)) return "milk";
  if (/\b(fish|tuna|machhli|masali|meenu|chepa|poisson)\b/.test(text) || /рыб|मछली|मासा|ಮೀನು|చేప/.test(text)) return "fish";
  if (/\b(hello|hi|namaste|namaskar|namaskara|namaskaram|bonjour|salut)\b/.test(text) || /привет|नमस्ते|नमस्कार|ನಮಸ್ಕಾರ|నమస్కారం/.test(text)) return "wave";
  return null;
}

export const TalkingPandaApp: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Room3DScene | null>(null);

  // Store bindings
  const viewMode = useStore((s) => s.viewMode);
  const setViewMode = useStore((s) => s.setViewMode);
  const muted = useStore((s) => s.muted);
  const toggleMute = useStore((s) => s.toggleMute);
  const rescuedCount = useStore((s) => s.rescuedCount);
  const incrementRescued = useStore((s) => s.incrementRescued);
  const openWindow = useStore((s) => s.openWindow);
  const openWindows = useStore((s) => s.openWindows);
  const closeAllWindows = useStore((s) => s.closeAllWindows);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);

  // Local UI States
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [lastSpeechText, setLastSpeechText] = useState("Hello friend! I am your cute 3D kawaii kitten.");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [voiceLanguage, setVoiceLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem("fourie:voice-language");
      return VOICE_LANGUAGES.some((language) => language.locale === saved) ? saved! : "en-US";
    } catch {
      return "en-US";
    }
  });
  const voiceLanguageRef = useRef(voiceLanguage);
  voiceLanguageRef.current = voiceLanguage;
  const [walkSpeed, setWalkSpeed] = useState(4.0);
  const [activeStoryChapter, setActiveStoryChapter] = useState(0);
  const [isLullabyPlaying, setIsLullabyPlaying] = useState(false);
  const [selectedRelic, setSelectedRelic] = useState<number>(0);

  // Sub-menus
  const [activeMenu, setActiveMenu] = useState<"none" | "feed" | "actions" | "wardrobe">("none");
  const [hasBow, setHasBow] = useState(true);
  const [hasSunglasses, setHasSunglasses] = useState(false);
  const [hasHat, setHasHat] = useState(false);

  const speakKitty = (text: string, translate = true) =>
    tomAudio.repeatInTomVoice(
      translate ? localizeKittyLine(text, voiceLanguageRef.current) : text,
      voiceLanguageRef.current
    );

  useEffect(() => {
    try {
      localStorage.setItem("fourie:voice-language", voiceLanguage);
    } catch {
      // Keep the current selection for this visit if storage is unavailable.
    }
  }, [voiceLanguage]);

  // Initialize Three.js 3D Room Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new Room3DScene(mountRef.current);
    sceneRef.current = scene;

    // Apply lighting theme
    scene.setLightingTheme(theme);

    // Initial station
    scene.setStation(viewMode as RoomStation);

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
      const bumpMsg = `Ouch! Bumped into the ${obstacleName}! Meow!`;
      setLastSpeechText(bumpMsg);
        speakKitty(bumpMsg);
    };

    // Handle 3D Raycasted Station Clicks
    scene.onStationClick = (station: RoomStation) => {
      audio.click();
      setViewMode(station);
    };

    // Handle 3D Raycasted Pokes with spoken cartoon cat voice
    scene.onCatPoke = (part: string) => {
      tomAudio.unlockAudio();
      if (part === "head") {
        tomAudio.playPurr();
        scene.cat.animState = "purr";
        const msg = "Purr, chin scratches feel so wonderful! Meow!";
        setLastSpeechText(msg);
        speakKitty(msg);
        setTimeout(() => {
          if (scene.cat.animState === "purr") scene.cat.animState = "idle";
        }, 1800);
      } else if (part === "belly") {
        tomAudio.playGiggle();
        scene.cat.animState = "poke_belly";
        const msg = "Hehe, tummy tickles! Wiggle wiggle!";
        setLastSpeechText(msg);
        speakKitty(msg);
        setTimeout(() => {
          if (scene.cat.animState === "poke_belly") scene.cat.animState = "idle";
        }, 1600);
      } else {
        tomAudio.playMeow();
        scene.cat.animState = "wave";
        const msg = "Meow! High-five with my soft pink kitten paws!";
        setLastSpeechText(msg);
        speakKitty(msg);
        setTimeout(() => {
          if (scene.cat.animState === "wave") scene.cat.animState = "idle";
        }, 1500);
      }
    };

    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  // Sync viewMode changes with 3D Camera Glide
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setStation(viewMode as RoomStation);
    }
  }, [viewMode]);

  // Sync theme changes with 3D Room Lighting
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setLightingTheme(theme);
    }
  }, [theme]);

  // Update walk speed
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.cat.walkSpeed = walkSpeed;
    }
  }, [walkSpeed]);

  // Talking Tom's Listen & Voice Interaction (Powered by Groq AI)
  const handleTalkButton = () => {
    tomAudio.unlockAudio();
    if (isListening) return;
    setIsListening(true);
    setLastSpeechText("Listening to you... Speak to Kitty");

    const listeningStarted = tomAudio.listen(async (transcript) => {
      setIsListening(false);
      if (!transcript || transcript.trim().length === 0) {
        setLastSpeechText("Meow, I could not hear you clearly. Please try again.");
        return;
      }

      setLastSpeechText(`"${transcript}"`);

      const command = quickCatCommand(transcript);
      if (command === "milk" || command === "fish") {
        handleFeed(command);
        return;
      }
      if (command) {
        handleAction(command);
        return;
      }

      // Query AI Cat Brain
      try {
        const reply = await freeLlm.askCat(transcript, voiceLanguageRef.current);
        setLastSpeechText(reply);
        speakKitty(reply, false);
      } catch {
        speakKitty(transcript, false);
      }
    }, voiceLanguageRef.current, () => setIsListening(false));
    if (!listeningStarted) {
      setIsListening(false);
      setLastSpeechText("Voice input is unavailable here. Type a message to Kitty instead.");
    }
  };

  // Actions Trigger
  const handleAction = (action: string) => {
    if (!sceneRef.current) return;
    const cat = sceneRef.current.cat;

    switch (action) {
      case "purr":
        cat.animState = "purr";
        tomAudio.playPurr();
        const purrMsg = "Purr, feeling so cozy and happy with you!";
        setLastSpeechText(purrMsg);
        speakKitty(purrMsg);
        setTimeout(() => {
          if (cat.animState === "purr") cat.animState = "idle";
        }, 2500);
        break;

      case "dance":
        cat.animState = "dance";
        tomAudio.playTone(880, 0.3);
        const danceMsg = "Watch my playful kitten dance moves!";
        setLastSpeechText(danceMsg);
        speakKitty(danceMsg);
        setTimeout(() => {
          if (cat.animState === "dance") cat.animState = "idle";
        }, 3200);
        break;

      case "sit":
        cat.animState = "sit";
        tomAudio.playMeow();
        const sitMsg = "Sitting quietly in a sweet kitten loaf pose. Meow!";
        setLastSpeechText(sitMsg);
        speakKitty(sitMsg);
        break;

      case "sleep":
        cat.animState = "sleep";
        tomAudio.playYawn();
        const sleepMsg = "Curling up for a warm cozy cat nap. Purr.";
        setLastSpeechText(sleepMsg);
        speakKitty(sleepMsg);
        break;

      case "wave":
        cat.animState = "wave";
        tomAudio.playMeow();
        const waveMsg = "Hello dear friend! Welcome to my cozy room!";
        setLastSpeechText(waveMsg);
        speakKitty(waveMsg);
        setTimeout(() => {
          if (cat.animState === "wave") cat.animState = "idle";
        }, 1800);
        break;

      case "walk":
        sceneRef.current.roamCat();
        const walkMsg = "Let's explore the room together! Meow!";
        setLastSpeechText(walkMsg);
        speakKitty(walkMsg);
        break;

      case "pout":
        cat.animState = "pout";
        tomAudio.playBoing();
        const poutMsg = "Boing! Playful little kitten jump!";
        setLastSpeechText(poutMsg);
        speakKitty(poutMsg);
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
      setLastSpeechText("Warm sweet milk! Delicious!");
      setTimeout(() => {
        tomAudio.playPurr();
        speakKitty("Delicious warm milk, thank you!");
      }, 900);
    } else if (food === "fish") {
      cat.animState = "sit";
      tomAudio.playMunch();
      setLastSpeechText("Crispy tuna fish, my absolute favorite!");
      setTimeout(() => {
        speakKitty("That crispy tuna fish was purr-fect!");
        if (cat.animState === "sit") cat.animState = "idle";
      }, 1400);
    } else if (food === "berry") {
      cat.animState = "dance";
      tomAudio.playTone(950, 0.2);
      setLastSpeechText("Sweet strawberry cream!");
      setTimeout(() => {
        speakKitty("Sweet strawberry cream, yummy!");
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
      setLastSpeechText(hasBow ? "Pink ribbon bow removed." : "Wearing the pink ribbon bow.");
      tomAudio.playTone(850, 0.15);
    }
  };

  const toggleSunglasses = () => {
    if (sceneRef.current) {
      sceneRef.current.cat.toggleSunglasses();
      setHasSunglasses(!hasSunglasses);
      setLastSpeechText(hasSunglasses ? "Glasses removed." : "Wearing cool sunglasses.");
      tomAudio.playTone(700, 0.15);
    }
  };

  const toggleHat = () => {
    if (sceneRef.current) {
      sceneRef.current.cat.toggleHat();
      setHasHat(!hasHat);
      setLastSpeechText(hasHat ? "Party hat removed." : "Wearing princess party hat.");
      tomAudio.playTone(850, 0.15);
    }
  };

  // Chat message submit with Groq LLM Brain
  const handleSendChat = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = (customQuery || chatInput).trim();
    if (!query) return;

    tomAudio.unlockAudio();
    if (!customQuery) setChatInput("");
    setLastSpeechText("Thinking...");

    const command = quickCatCommand(query);
    if (command === "milk" || command === "fish") {
      handleFeed(command);
      return;
    }
    if (command) {
      handleAction(command);
      return;
    }

    try {
      const reply = await freeLlm.askCat(query, voiceLanguageRef.current);
      setLastSpeechText(reply);
      speakKitty(reply, false);
    } catch {
      speakKitty(query, false);
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

  // Story Chapters
  const storyChapters = [
    {
      id: "chapter-1",
      number: "Chapter I",
      tagline: "Void Born Guardian",
      title: "The Birth from the Void Gap",
      subtitle: "When a digital page vanishes into darkness, Fourie is formed from stardust",
      description:
        "Whenever a webpage is deleted from the global web, an empty gap remains in digital space. From that void, composed of shimmering 404 stardust, a gentle guardian is born: Fourie. With glowing eyes and a soft pink coat, he ensures that digital memories and connections are never forgotten.",
      badges: ["Void Born", "404 Stardust", "Celestial Soul", "Pink Guardian"],
    },
    {
      id: "chapter-2",
      number: "Chapter II",
      tagline: "Sanctuary of Lost Pages",
      title: "The Sanctuary of Lost Memories",
      subtitle: "Preserving CRT monitors, dial-up handshakes, and early web archives",
      description:
        "Fourie resides in a serene digital Lost and Found sanctuary. Here, vintage CRT monitors, 3.5-inch floppy disks, sparkling glass jars containing 1999 GeoCities glitter GIFs, chat logs, and forgotten web journals are carefully organized and preserved with care.",
      badges: ["CRT Glow", "GeoCities 1999", "Floppy Disk", "Preserved Memory"],
    },
    {
      id: "chapter-3",
      number: "Chapter III",
      tagline: "56K Dial-Up Slumber",
      title: "The 56K Modem Lullaby Cradle",
      subtitle: "A peaceful rest woven from analog carrier waves and soft chimes",
      description:
        "At night, when global internet traffic calms down, Fourie rests within a soft cloud cradle. His lullaby is woven from nostalgic 56K dial-up handshake tones and gentle celesta melodies. In this cozy haven, every tired digital traveler finds tranquility.",
      badges: ["Cloud Cradle", "56K Carrier", "Sweet Slumber", "Celesta Chimes"],
    },
  ];

  // Relics Data
  const relics = [
    {
      id: "floppy",
      name: "3.5\" Stardust Floppy Disk",
      type: "Magnetic Media",
      year: "1998",
      desc: "Contains 1.44 MB of vintage forum messages and hand-crafted personal homepages.",
      capacity: "1.44 MB",
      status: "Rescued & Intact",
    },
    {
      id: "geocities",
      name: "GeoCities 1999 Crystal Prism",
      type: "Hypertext Archive",
      year: "1999",
      desc: "A multifaceted iridescent crystal storing animated web badges, hit counters, and guestbooks.",
      capacity: "12,400 Pages",
      status: "Rescued & Shimmering",
    },
    {
      id: "modem",
      name: "56K Modem Carrier Ring",
      type: "Audio Frequency Gem",
      year: "1996",
      desc: "Forged from V.90 modulation frequencies, echoing the beloved dial-up handshake tone.",
      capacity: "56 kbps",
      status: "Rescued & Resonating",
    },
    {
      id: "stardust",
      name: "Stardust Archive Sphere",
      type: "Cosmic Vessel",
      year: "2001",
      desc: "A floating celestial orb storing 404 lost parcels and comforting late-night chat logs.",
      capacity: "404 Records",
      status: "Rescued & Glowing",
    },
  ];

  const handleRescueAction = () => {
    audio.chime();
    incrementRescued();
  };

  const handleToggleLullaby = async () => {
    await audio.unlock();
    const playing = audio.toggleLullaby();
    setIsLullabyPlaying(playing);
  };

  const handlePlayDialUp = async () => {
    await audio.unlock();
    audio.playDialUpSimulation();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0c0812] select-none font-sans flex items-center justify-center">
      {/* Dynamic Background Aura */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[550px] h-[550px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Top Universal 3D WebGL Navigation & Control Bar */}
      <header className="fixed top-3 left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
        {/* Left: 3D Sanctuary Brand & WebGL Engine Badge */}
        <div className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-[#141624]/90 backdrop-blur-xl border border-white/10 shadow-xl">
          <div className="w-6 h-6 rounded-lg bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Fourie 3D Sanctuary</span>
            </div>
            <div className="text-[10px] text-white/60 font-mono">
              Three.js WebGL Sanctuary
            </div>
          </div>
        </div>

        {/* Center: 3D Station Glide Switcher */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-2xl bg-[#141624]/90 backdrop-blur-xl border border-white/10 shadow-xl">
          {/* Station 1: Kitty */}
          <button
            type="button"
            onClick={() => setViewMode("kitty")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "kitty" || viewMode === "panda"
                ? "bg-pink-600 text-white shadow-[0_2px_12px_rgba(236,72,153,0.5)]"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
            title="Focus on Kawaii Kitten"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kitten Lounge</span>
          </button>

          {/* Station 2: 404 Story */}
          <button
            type="button"
            onClick={() => setViewMode("story")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "story"
                ? "bg-cyan-600 text-white shadow-[0_2px_12px_rgba(6,182,212,0.5)]"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
            title="Glide to 404 Story Terminal"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Story Terminal</span>
          </button>

          {/* Station 3: Lullaby Lab */}
          <button
            type="button"
            onClick={() => setViewMode("lullaby")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "lullaby"
                ? "bg-emerald-600 text-white shadow-[0_2px_12px_rgba(16,185,129,0.5)]"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
            title="Glide to Dial-Up Synthesizer"
          >
            <Music className="w-3.5 h-3.5" />
            <span>Lullaby Lab</span>
          </button>

          {/* Station 4: Rescued Relics */}
          <button
            type="button"
            onClick={() => setViewMode("relics")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "relics"
                ? "bg-purple-600 text-white shadow-[0_2px_12px_rgba(168,85,247,0.5)]"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
            title="Glide to Floating Relics"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Relics ({rescuedCount})</span>
          </button>

          {/* Station 5: Android Desktop */}
          <button
            type="button"
            onClick={() => setViewMode("desktop")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "desktop"
                ? "bg-indigo-600 text-white shadow-[0_2px_12px_rgba(99,102,241,0.5)]"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
            title="Panoramic View with Android Workspace"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cyber Desktop</span>
          </button>
        </div>

        {/* Right: Audio, Lighting Theme & Fullscreen Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-2xl bg-[#141624]/90 backdrop-blur-xl border border-white/10 shadow-xl">
          {/* Day / Night 3D Lighting Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={`Switch to ${theme === "night" ? "Daylight" : "Night"} Lighting`}
          >
            {theme === "night" ? <Moon className="w-4 h-4 text-purple-300" /> : <Sun className="w-4 h-4 text-amber-300" />}
          </button>

          {/* Audio Mute/Unmute */}
          <button
            type="button"
            onClick={toggleMute}
            className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={muted ? "Unmute Audio" : "Mute Audio"}
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Mobile Frame Toggle (Available when in Kitty station) */}
          {(viewMode === "kitty" || viewMode === "panda") && (
            <button
              type="button"
              onClick={() => setIsMobileFrame(!isMobileFrame)}
              className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Toggle Android Smartphone Frame"
            >
              {isMobileFrame ? <Smartphone className="w-4 h-4 text-pink-400" /> : <Monitor className="w-4 h-4" />}
            </button>
          )}

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main 3D Container (Full Screen or Framed in Android Smartphone) */}
      <div
        className={`relative transition-all duration-500 overflow-hidden ${
          isMobileFrame && (viewMode === "kitty" || viewMode === "panda")
            ? "w-[390px] h-[780px] max-h-[92vh] rounded-[48px] border-[8px] border-[#22232a] shadow-[0_30px_90px_rgba(0,0,0,0.85),0_0_0_2px_rgba(255,255,255,0.1)] flex flex-col"
            : "w-full h-full"
        }`}
      >
        {/* Android Punch-Hole Bezel in Mobile Mode */}
        {isMobileFrame && (viewMode === "kitty" || viewMode === "panda") && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 rounded-full bg-black z-50 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#111116] border border-white/10 mr-1" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#1e293b]" />
          </div>
        )}

        {/* 1. Real-Time Three.js 3D WebGL Canvas Mount */}
        <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-pointer" />

        {/* ========================================================= */}
        {/* STATION OVERLAY 1: KITTEN SANCTUARY HUD                   */}
        {/* ========================================================= */}
        {(viewMode === "kitty" || viewMode === "panda") && (
          <>
            {/* Left Action Buttons */}
            <div className="absolute top-24 left-4 z-40 flex flex-col gap-2.5">
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
                title="Accessories"
              >
                <Glasses className="w-5 h-5" />
              </button>

              {/* Purr Button */}
              <button
                type="button"
                onClick={() => handleAction("purr")}
                className="w-12 h-12 rounded-full bg-emerald-500/90 hover:bg-emerald-400 text-white shadow-[0_8px_20px_rgba(16,185,129,0.5)] border-2 border-white/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-90 cursor-pointer"
                title="Pet & Purr"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Submenu Popups */}
            {activeMenu === "feed" && (
              <div className="absolute top-24 left-20 z-50 bg-[#161726]/95 backdrop-blur-2xl border border-pink-500/30 rounded-3xl p-3 shadow-2xl flex flex-col gap-2 min-w-[150px]">
                <div className="text-[11px] font-bold text-pink-300 uppercase tracking-wider px-2">Feed Kitty</div>
                <button
                  type="button"
                  onClick={() => handleFeed("milk")}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-pink-500/20 text-white text-xs cursor-pointer"
                >
                  <Coffee className="w-4 h-4 text-pink-300" />
                  <span>Warm Milk</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFeed("fish")}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-pink-500/20 text-white text-xs cursor-pointer"
                >
                  <Utensils className="w-4 h-4 text-cyan-300" />
                  <span>Crispy Tuna</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFeed("berry")}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-pink-500/20 text-white text-xs cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-rose-300" />
                  <span>Strawberry</span>
                </button>
              </div>
            )}

            {activeMenu === "actions" && (
              <div className="absolute top-36 left-20 z-50 bg-[#161726]/95 backdrop-blur-2xl border border-purple-500/30 rounded-3xl p-3 shadow-2xl flex flex-col gap-2 min-w-[150px]">
                <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider px-2">Animations</div>
                <button
                  type="button"
                  onClick={() => handleAction("dance")}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-purple-500/20 text-white text-xs cursor-pointer"
                >
                  <Music className="w-4 h-4 text-purple-300" />
                  <span>Dance</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAction("wave")}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-purple-500/20 text-white text-xs cursor-pointer"
                >
                  <Smile className="w-4 h-4 text-yellow-300" />
                  <span>Wave Paws</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAction("sit")}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-purple-500/20 text-white text-xs cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-pink-300" />
                  <span>Sit Loaf</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAction("sleep")}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-purple-500/20 text-white text-xs cursor-pointer"
                >
                  <Wind className="w-4 h-4 text-cyan-300" />
                  <span>Cat Nap</span>
                </button>
              </div>
            )}

            {activeMenu === "wardrobe" && (
              <div className="absolute top-48 left-20 z-50 bg-[#161726]/95 backdrop-blur-2xl border border-rose-500/30 rounded-3xl p-3 shadow-2xl flex flex-col gap-2 min-w-[160px]">
                <div className="text-[11px] font-bold text-rose-300 uppercase tracking-wider px-2">Wardrobe</div>
                <button
                  type="button"
                  onClick={toggleBow}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer ${
                    hasBow ? "bg-rose-500 text-white" : "bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span>Pink Bow</span>
                  </div>
                  <span className="text-[10px] opacity-75">{hasBow ? "ON" : "OFF"}</span>
                </button>
                <button
                  type="button"
                  onClick={toggleSunglasses}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer ${
                    hasSunglasses ? "bg-rose-500 text-white" : "bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Glasses className="w-4 h-4" />
                    <span>Sunglasses</span>
                  </div>
                  <span className="text-[10px] opacity-75">{hasSunglasses ? "ON" : "OFF"}</span>
                </button>
                <button
                  type="button"
                  onClick={toggleHat}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer ${
                    hasHat ? "bg-rose-500 text-white" : "bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    <span>Princess Hat</span>
                  </div>
                  <span className="text-[10px] opacity-75">{hasHat ? "ON" : "OFF"}</span>
                </button>
              </div>
            )}

            {/* Bottom Right: Speech & AI Response Card */}
            <div className="absolute bottom-24 right-4 z-40 max-w-sm pointer-events-auto">
              <div className="bg-[#141624]/90 backdrop-blur-2xl border border-pink-500/20 rounded-2xl p-4 shadow-2xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    <span className="text-xs font-bold text-white">Kitty Voice</span>
                  </div>
                  {isSpeaking && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-mono animate-pulse">
                      Speaking...
                    </span>
                  )}
                </div>
                <div className="text-sm text-pink-100 font-medium leading-relaxed">
                  {lastSpeechText}
                </div>
              </div>
            </div>

            {/* Bottom Floating Interactive Chat & Voice Bar with 7-Language Support */}
            <div className="absolute bottom-4 left-4 right-4 z-40 flex flex-col items-center gap-2 pointer-events-none">
              {/* Multilingual Quick Selector Chips */}
              <div className="pointer-events-auto flex items-center gap-1.5 flex-wrap justify-center bg-[#10121d]/85 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-2xl shadow-xl">
                <label htmlFor="kitty-voice-language" className="text-[10px] text-white/60 font-mono uppercase tracking-wider mr-1">
                  Voice
                </label>
                <select
                  id="kitty-voice-language"
                  value={voiceLanguage}
                  onChange={(event) => setVoiceLanguage(event.target.value)}
                  className="rounded-lg bg-[#202236] border border-white/15 px-2 py-1 text-[11px] text-white outline-none focus:border-pink-400"
                  aria-label="Choose the cat's spoken language"
                >
                  {VOICE_LANGUAGES.map((language) => (
                    <option key={language.locale} value={language.locale}>{language.label}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleSendChat(undefined, "Namaste Fourie, kaise ho?")}
                  className="px-2 py-0.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/30 text-[11px] text-pink-300 border border-pink-500/20 cursor-pointer"
                  title="Hindi: Namaste Fourie"
                >
                  Hindi
                </button>
                <button
                  type="button"
                  onClick={() => handleSendChat(undefined, "Namaskar Fourie, kashi aahes tu?")}
                  className="px-2 py-0.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/30 text-[11px] text-purple-300 border border-purple-500/20 cursor-pointer"
                  title="Marathi: Namaskar Fourie"
                >
                  Marathi
                </button>
                <button
                  type="button"
                  onClick={() => handleSendChat(undefined, "Namaskara Fourie, hegiddeera?")}
                  className="px-2 py-0.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/30 text-[11px] text-amber-300 border border-amber-500/20 cursor-pointer"
                  title="Kannada: Namaskara Fourie"
                >
                  Kannada
                </button>
                <button
                  type="button"
                  onClick={() => handleSendChat(undefined, "Namaskaram Fourie, ela unnaru?")}
                  className="px-2 py-0.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/30 text-[11px] text-cyan-300 border border-cyan-500/20 cursor-pointer"
                  title="Telugu: Namaskaram Fourie"
                >
                  Telugu
                </button>
                <button
                  type="button"
                  onClick={() => handleSendChat(undefined, "Bonjour Fourie, comment vas-tu?")}
                  className="px-2 py-0.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/30 text-[11px] text-blue-300 border border-blue-500/20 cursor-pointer"
                  title="French: Bonjour Fourie"
                >
                  French
                </button>
                <button
                  type="button"
                  onClick={() => handleSendChat(undefined, "Привет Фури, как дела?")}
                  className="px-2 py-0.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/30 text-[11px] text-emerald-300 border border-emerald-500/20 cursor-pointer"
                  title="Russian: Привет Фури"
                >
                  Russian
                </button>
                <button
                  type="button"
                  onClick={() => handleSendChat(undefined, "Hello Fourie, how are you today?")}
                  className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] text-white border border-white/10 cursor-pointer"
                  title="English: Hello Fourie"
                >
                  English
                </button>
              </div>

              {/* Chat Input Bar */}
              <div className="pointer-events-auto max-w-xl w-full bg-[#121422]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl flex items-center gap-2">
                {/* Voice Record / Listen Button */}
                <button
                  type="button"
                  onClick={handleTalkButton}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isListening
                      ? "bg-rose-500 text-white animate-ping shadow-[0_0_20px_#f43f5e]"
                      : "bg-pink-600 hover:bg-pink-500 text-white shadow-[0_4px_12px_rgba(236,72,153,0.4)]"
                  }`}
                  title="Speak to Kitty (Hindi, English, Marathi, Kannada, Telugu, French, Russian)"
                >
                  <Mic className="w-5 h-5" />
                </button>

                {/* Text Input */}
                <form onSubmit={handleSendChat} className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Speak or type in Hindi, English, Marathi, Kannada, Telugu, French, Russian..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick Action Chips */}
                <div className="hidden sm:flex items-center gap-1.5 border-l border-white/10 pl-2">
                  <button
                    type="button"
                    onClick={() => handleSendChat(undefined, "purr for me")}
                    className="px-2 py-1 rounded-lg bg-white/5 hover:bg-pink-500/20 text-[11px] text-pink-300 cursor-pointer"
                  >
                    Purr
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendChat(undefined, "dance kitty")}
                    className="px-2 py-1 rounded-lg bg-white/5 hover:bg-purple-500/20 text-[11px] text-purple-300 cursor-pointer"
                  >
                    Dance
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendChat(undefined, "crispy tuna")}
                    className="px-2 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-[11px] text-cyan-300 cursor-pointer"
                  >
                    Tuna
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* STATION OVERLAY 2: 404 CYBER STORY TERMINAL HUD           */}
        {/* ========================================================= */}
        {viewMode === "story" && (
          <div className="absolute inset-0 z-40 flex items-center justify-end p-6 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-lg bg-[#0d111d]/90 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(6,182,212,0.15)] flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
                      <span>404 SANCTUARY LORE</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                        TERMINAL ONLINE
                      </span>
                    </div>
                    <div className="text-[10px] text-cyan-400/70 font-mono">
                      Restored Digital Memories
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {storyChapters.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        audio.click();
                        setActiveStoryChapter(idx);
                      }}
                      className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        activeStoryChapter === idx
                          ? "bg-cyan-500 text-black shadow-[0_0_12px_#06b6d4]"
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Chapter Content */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    {storyChapters[activeStoryChapter].number} · {storyChapters[activeStoryChapter].tagline}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white leading-tight">
                  {storyChapters[activeStoryChapter].title}
                </h2>
                <div className="text-xs text-cyan-200/80 italic">
                  "{storyChapters[activeStoryChapter].subtitle}"
                </div>
                <p className="text-sm text-white/85 leading-relaxed bg-white/5 p-3.5 rounded-2xl border border-white/5">
                  {storyChapters[activeStoryChapter].description}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {storyChapters[activeStoryChapter].badges.map((badge, bIdx) => (
                    <span
                      key={bIdx}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono"
                    >
                      #{badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Navigation & Audio Action Triggers */}
              <div className="flex items-center justify-between pt-3 border-t border-cyan-500/20">
                <button
                  type="button"
                  onClick={() => {
                    audio.click();
                    setActiveStoryChapter((prev) => (prev > 0 ? prev - 1 : storyChapters.length - 1));
                  }}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePlayDialUp}
                    className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Radio className="w-4 h-4" />
                    <span>56K Carrier Tone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      audio.click();
                      setViewMode("lullaby");
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-[0_4px_16px_rgba(6,182,212,0.4)] cursor-pointer"
                  >
                    <span>Lullaby Lab</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STATION OVERLAY 3: DIAL-UP LULLABY LAB HUD                */}
        {/* ========================================================= */}
        {viewMode === "lullaby" && (
          <div className="absolute inset-0 z-40 flex items-center justify-start p-6 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-lg bg-[#0d141b]/90 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(16,185,129,0.15)] flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <Music className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
                      <span>DIAL-UP LULLABY SYNTHESIZER</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                        WEB AUDIO V.90
                      </span>
                    </div>
                    <div className="text-[10px] text-emerald-400/70 font-mono">
                      10-Band Real-Time WebGL Equalizer
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleLullaby}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isLullabyPlaying
                      ? "bg-emerald-500 text-black shadow-[0_0_16px_#10b981]"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  <Play className={`w-3.5 h-3.5 ${isLullabyPlaying ? "animate-spin" : ""}`} />
                  <span>{isLullabyPlaying ? "Playing Lullaby" : "Play Lullaby"}</span>
                </button>
              </div>

              {/* Description */}
              <div className="text-xs text-white/80 leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/5">
                The soothing sounds of Fourie's sanctuary are generated procedurally using web audio oscillators and harmonic resonance. The 3D equalizer bars on the table dance to the live audio synthesis!
              </div>

              {/* Synthesizer Keyboard Tones */}
              <div>
                <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-2">
                  Manual Celesta Keys
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {[
                    { label: "C4", freq: 261.63 },
                    { label: "E4", freq: 329.63 },
                    { label: "G4", freq: 392.0 },
                    { label: "A4", freq: 440.0 },
                    { label: "C5", freq: 523.25 },
                    { label: "E5", freq: 659.25 },
                  ].map((key, kIdx) => (
                    <button
                      key={kIdx}
                      type="button"
                      onClick={() => {
                        audio.unlock();
                        audio.note(key.freq, 0, 1.2, "sine", 0.25);
                      }}
                      className="py-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-500 hover:text-black text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold transition-colors text-center cursor-pointer active:scale-95"
                    >
                      {key.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Preset Generators */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handlePlayDialUp}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 text-white text-xs flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <Radio className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium">56K Modem</span>
                </button>
                <button
                  type="button"
                  onClick={() => audio.chime()}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 text-white text-xs flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="font-medium">Celesta Chime</span>
                </button>
                <button
                  type="button"
                  onClick={() => audio.squeak()}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 text-white text-xs flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span className="font-medium">Sparkle Drop</span>
                </button>
              </div>

              {/* Bottom Nav */}
              <div className="flex items-center justify-between pt-2 border-t border-emerald-500/20">
                <button
                  type="button"
                  onClick={() => setViewMode("story")}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Story Terminal</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("relics")}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-[0_4px_16px_rgba(16,185,129,0.4)] cursor-pointer"
                >
                  <span>Rescued Relics</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STATION OVERLAY 4: RESCUED RELICS ARCHIVE HUD             */}
        {/* ========================================================= */}
        {viewMode === "relics" && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-6 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-xl bg-[#110d1d]/90 backdrop-blur-2xl border border-purple-500/30 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(168,85,247,0.15)] flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                    <Archive className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
                      <span>FLOATING RELICS ARCHIVE</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                        {rescuedCount} RESCUED
                      </span>
                    </div>
                    <div className="text-[10px] text-purple-400/70 font-mono">
                      Real-Time WebGL 3D Orbit
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRescueAction}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_16px_rgba(168,85,247,0.5)] cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Rescue New Relic</span>
                </button>
              </div>

              {/* Relic Selector Chips */}
              <div className="grid grid-cols-4 gap-2">
                {relics.map((relic, idx) => (
                  <button
                    key={relic.id}
                    type="button"
                    onClick={() => {
                      audio.click();
                      setSelectedRelic(idx);
                    }}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      selectedRelic === idx
                        ? "bg-purple-500/20 border-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-[10px] font-mono opacity-60">0{idx + 1}</span>
                    <span className="text-xs font-bold truncate">{relic.name}</span>
                  </button>
                ))}
              </div>

              {/* Active Relic Details */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">
                    {relics[selectedRelic].name}
                  </h3>
                  <span className="text-[11px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-lg border border-purple-500/30">
                    Circa {relics[selectedRelic].year}
                  </span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed">
                  {relics[selectedRelic].desc}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono">
                  <div className="bg-black/30 p-2 rounded-xl">
                    <span className="text-white/40 block">Capacity:</span>
                    <span className="text-purple-300 font-bold">{relics[selectedRelic].capacity}</span>
                  </div>
                  <div className="bg-black/30 p-2 rounded-xl">
                    <span className="text-white/40 block">Status:</span>
                    <span className="text-emerald-400 font-bold">{relics[selectedRelic].status}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="flex items-center justify-between pt-2 border-t border-purple-500/20">
                <button
                  type="button"
                  onClick={() => setViewMode("lullaby")}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Lullaby Lab</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("desktop")}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_4px_16px_rgba(168,85,247,0.4)] cursor-pointer"
                >
                  <span>Launch Cyber Desktop</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STATION OVERLAY 5: CYBER ANDROID DESKTOP HUD              */}
        {/* ========================================================= */}
        {viewMode === "desktop" && (
          <div className="absolute inset-0 z-40 pointer-events-none flex flex-col justify-between p-4">
            {/* Top Workspace Indicator */}
            <div className="flex items-center justify-between pointer-events-auto">
              <div className="px-3.5 py-1.5 rounded-2xl bg-[#141624]/90 backdrop-blur-xl border border-indigo-500/30 text-xs text-white flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-indigo-400" />
                <span className="font-bold">Android 15 Floating Workspace</span>
                <span className="text-[10px] text-white/50 font-mono">
                  ({openWindows.length} windows active)
                </span>
              </div>

              {openWindows.length > 0 && (
                <button
                  type="button"
                  onClick={closeAllWindows}
                  className="px-3 py-1.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Close All Windows</span>
                </button>
              )}
            </div>

            {/* Draggable Active Android Windows */}
            <div className="absolute inset-0 z-40 pointer-events-none">
              <AndroidWindow id="about" title="About Fourie Sanctuary" icon={<Heart className="w-4 h-4 text-pink-400" />}>
                <AboutWindow />
              </AndroidWindow>

              <AndroidWindow id="rescued" title="Rescued Parcels" icon={<FolderArchive className="w-4 h-4 text-amber-400" />}>
                <ProjectsWindow />
              </AndroidWindow>

              <AndroidWindow id="lullaby" title="Lullaby Lab" icon={<Music className="w-4 h-4 text-emerald-400" />}>
                <LullabyLabWindow />
              </AndroidWindow>

              <AndroidWindow id="notes" title="Lost Notes" icon={<Heart className="w-4 h-4 text-rose-400" />}>
                <NotesWindow />
              </AndroidWindow>

              <AndroidWindow id="bin" title="Recycle Bin" icon={<Trash2 className="w-4 h-4 text-gray-400" />}>
                <RecycleBinWindow />
              </AndroidWindow>

              <AndroidWindow id="chat" title="Guestbook Messages" icon={<MessageSquare className="w-4 h-4 text-purple-400" />}>
                <ChatWindow />
              </AndroidWindow>

              <AndroidWindow id="router" title="Router Diagnostics" icon={<Network className="w-4 h-4 text-cyan-400" />}>
                <RouterWindow />
              </AndroidWindow>

              <AndroidWindow id="geocities" title="GeoCities 1999" icon={<Globe className="w-4 h-4 text-yellow-400" />}>
                <GeoCitiesWindow />
              </AndroidWindow>

              <AndroidWindow id="webring" title="Webring Hub" icon={<Globe className="w-4 h-4 text-pink-400" />}>
                <WebringWindow />
              </AndroidWindow>

              <AndroidWindow id="nowhere" title="Secret Backroom" icon={<Key className="w-4 h-4 text-red-400" />}>
                <SecretRoomWindow />
              </AndroidWindow>
            </div>

            {/* Bottom Cyber App Launcher Dock */}
            <div className="flex items-center justify-center pointer-events-auto pb-2">
              <div className="bg-[#121422]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl flex items-center gap-2">
                {[
                  { id: "about" as WindowId, label: "About", icon: <Heart className="w-4 h-4 text-pink-400" /> },
                  { id: "rescued" as WindowId, label: "Parcels", icon: <FolderArchive className="w-4 h-4 text-amber-400" /> },
                  { id: "lullaby" as WindowId, label: "Synthesizer", icon: <Music className="w-4 h-4 text-emerald-400" /> },
                  { id: "notes" as WindowId, label: "Notes", icon: <Heart className="w-4 h-4 text-rose-400" /> },
                  { id: "bin" as WindowId, label: "Recycle Bin", icon: <Trash2 className="w-4 h-4 text-gray-300" /> },
                  { id: "chat" as WindowId, label: "Messages", icon: <MessageSquare className="w-4 h-4 text-purple-400" /> },
                  { id: "router" as WindowId, label: "Router", icon: <Network className="w-4 h-4 text-cyan-400" /> },
                  { id: "geocities" as WindowId, label: "GeoCities", icon: <Globe className="w-4 h-4 text-yellow-400" /> },
                ].map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => {
                      audio.click();
                      openWindow(app.id);
                    }}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer min-w-[58px]"
                    title={app.label}
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      {app.icon}
                    </div>
                    <span className="text-[10px] font-medium">{app.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
