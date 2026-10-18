import React, { useEffect } from "react";
import { AndroidStatusBar } from "./AndroidStatusBar";
import { AndroidTaskbar } from "./AndroidTaskbar";
import { AndroidQuickSettings } from "./AndroidQuickSettings";
import { AndroidAppDrawer } from "./AndroidAppDrawer";
import { AndroidRecents } from "./AndroidRecents";
import { AndroidAtAGlance } from "./AndroidAtAGlance";
import { AndroidSearchBar } from "./AndroidSearchBar";
import { AndroidWindow } from "./AndroidWindow";
import { AndroidToast } from "./AndroidToast";

import { FourieCharacter } from "../components/FourieCharacter";
import { SparkCanvas } from "../components/SparkCanvas";
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

import { useStore, WindowId } from "../core/store";
import { audio } from "../core/audio";
import { bus } from "../core/bus";
import {
  Heart,
  FolderArchive,
  Music,
  MessageSquare,
  Network,
  Globe,
  Trash2,
  Award,
  Key,
  Sparkles,
  BookOpen,
  Compass,
  Star,
} from "lucide-react";

interface DesktopAppIcon {
  id: WindowId | "story";
  label: string;
  icon: React.ReactNode;
  bg: string;
}

export const AndroidDesktop: React.FC = () => {
  const openWindow = useStore((s) => s.openWindow);
  const mood = useStore((s) => s.mood);
  const sendMood = useStore((s) => s.sendMood);
  const showToast = useStore((s) => s.showToast);
  const enterStory = useStore((s) => s.enterStory);
  const enterPanda = useStore((s) => s.enterPanda);

  const desktopApps: DesktopAppIcon[] = [
    {
      id: "panda" as any,
      label: "Talking Kitty",
      icon: <Sparkles className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-tr from-[#ec4899] via-[#f472b6] to-[#a855f7]",
    },
    {
      id: "story",
      label: "Story Mode",
      icon: <BookOpen className="w-6 h-6 text-[#3d001e]" />,
      bg: "bg-gradient-to-tr from-[#ff85b8] via-[#ffa8d0] to-[#ffd1e6]",
    },
    {
      id: "about",
      label: "About Fourie",
      icon: <Heart className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-tr from-[#ff6b9d] to-[#ff85b8]",
    },
    {
      id: "rescued",
      label: "Parcels",
      icon: <FolderArchive className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-tr from-[#ff9100] to-[#ffd740]",
    },
    {
      id: "lullaby",
      label: "Lullaby Lab",
      icon: <Music className="w-6 h-6 text-black" />,
      bg: "bg-gradient-to-tr from-[#5eead4] to-[#99f6e4]",
    },
    {
      id: "chat",
      label: "Messages",
      icon: <MessageSquare className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-tr from-[#c084fc] to-[#e879f9]",
    },
    {
      id: "notes",
      label: "Lost Notes",
      icon: <Heart className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-tr from-[#ff3377] to-[#ff7597]",
    },
    {
      id: "router",
      label: "Star Router",
      icon: <Network className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-tr from-[#818cf8] to-[#a5b4fc]",
    },
    {
      id: "geocities",
      label: "Web Archive",
      icon: <Globe className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-tr from-[#e879f9] to-[#f472b6]",
    },
    {
      id: "bin",
      label: "Recycle Basket",
      icon: <Trash2 className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-tr from-[#64748b] to-[#94a3b8]",
    },
    {
      id: "webring",
      label: "Webring Hub",
      icon: <Award className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-tr from-[#2dd4bf] to-[#5eead4]",
    },
  ];

  const handleAppLaunch = (id: WindowId | "story" | "panda") => {
    if (id === "story") {
      audio.click();
      enterStory();
      return;
    }
    if (id === "panda") {
      audio.click();
      enterPanda();
      return;
    }
    audio.click();
    openWindow(id);
  };

  const handleCompanionTap = async (e: React.MouseEvent) => {
    await audio.unlock();
    audio.squeak();
    sendMood("POKE");
    bus.emit("poke", { x: e.clientX, y: e.clientY });
    showToast(mood === "sleepy" ? "Woke Baby Fourie!" : "Tickled star charm!");
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0e0714] text-[#fff0f7] font-sans select-none selection:bg-[#ff85b8] selection:text-[#3d001e]">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/3 w-[550px] h-[550px] bg-[#ff85b8]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#c084fc]/8 rounded-full blur-[130px] pointer-events-none" />

      {/* Zero-GC Particle Canvas Overlay */}
      <SparkCanvas />

      {/* Top Android Status Bar */}
      <AndroidStatusBar />

      {/* Desktop Main Stage */}
      <main className="relative w-full h-[calc(100vh-36px-64px)] mt-9 overflow-y-auto overflow-x-hidden p-4 sm:p-8 flex flex-col justify-between z-10">
        {/* Top Desktop Widgets: At a Glance + Google Search Bar */}
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <AndroidAtAGlance />
          <AndroidSearchBar />
        </div>

        {/* Centerpiece: Fourie Living Mascot Companion */}
        <div className="relative my-4 flex flex-col items-center justify-center text-center">
          {/* Material You Speech Bubble */}
          <div className="mb-2 px-4 py-1.5 rounded-full bg-[#1b0e24]/90 border border-[#ff85b8]/35 shadow-[0_4px_20px_rgba(255,133,184,0.3)] text-xs font-sans text-white/95 flex items-center gap-2 animate-bounce">
            <Heart className="w-3.5 h-3.5 text-[#ff85b8] fill-[#ff85b8]" />
            <span>"Kuch kho gaya? Maine sambhal ke rakha hai."</span>
          </div>

          <div
            onClick={handleCompanionTap}
            className="cursor-pointer group hover:scale-105 active:scale-95 transition-transform"
            title="Tap to interact with Baby Fourie!"
          >
            <FourieCharacter size={200} />
          </div>

          <div className="mt-2 text-[11px] font-mono text-[#d8b4c8]/70 uppercase tracking-widest">
            Tap companion to tickle star charm
          </div>
        </div>

        {/* Desktop App Grid (Squircle Adaptive Icons) */}
        <div className="w-full max-w-4xl mx-auto grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-3 sm:gap-4 py-2">
          {desktopApps.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => handleAppLaunch(app.id)}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              <div
                className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl ${app.bg} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 active:scale-92 group-hover:-translate-y-1`}
              >
                {app.icon}
              </div>
              <span className="text-[11px] font-medium text-white/90 mt-1.5 max-w-[70px] truncate leading-tight drop-shadow">
                {app.label}
              </span>
            </button>
          ))}
        </div>
      </main>

      {/* Freeform Android Windows System */}
      <AndroidWindow id="about" title="About Baby Fourie.txt" icon={<Heart className="w-4 h-4 text-pink-400" />} defaultX={-30} width={500}>
        <AboutWindow />
      </AndroidWindow>

      <AndroidWindow id="rescued" title="Rescued Parcels (3 Artifacts)" icon={<FolderArchive className="w-4 h-4 text-cyan-400" />} defaultX={30} width={520}>
        <ProjectsWindow />
      </AndroidWindow>

      <AndroidWindow id="lullaby" title="Dial-Up Lullaby Lab v1.0" icon={<Music className="w-4 h-4 text-purple-400" />} defaultX={0} width={540}>
        <LullabyLabWindow />
      </AndroidWindow>

      <AndroidWindow id="chat" title="Messages with Fourie" icon={<MessageSquare className="w-4 h-4 text-emerald-400" />} defaultX={-20} width={480}>
        <ChatWindow />
      </AndroidWindow>

      <AndroidWindow id="notes" title="Lost Wish Wall" icon={<Sparkles className="w-4 h-4 text-amber-400" />} defaultX={20} width={500}>
        <NotesWindow />
      </AndroidWindow>

      <AndroidWindow id="router" title="Star Router (Dijkstra Map)" icon={<Compass className="w-4 h-4 text-blue-400" />} defaultX={0} width={580}>
        <RouterWindow />
      </AndroidWindow>

      <AndroidWindow id="geocities" title="Web Archive (1999 Shrine)" icon={<Globe className="w-4 h-4 text-green-400" />} defaultX={-25} width={520}>
        <GeoCitiesWindow />
      </AndroidWindow>

      <AndroidWindow id="bin" title="Recycle Basket (Relics)" icon={<Trash2 className="w-4 h-4 text-rose-400" />} defaultX={25} width={500}>
        <RecycleBinWindow />
      </AndroidWindow>

      <AndroidWindow id="webring" title="Webring Hub & Odometer" icon={<Award className="w-4 h-4 text-amber-300" />} defaultX={0} width={480}>
        <WebringWindow />
      </AndroidWindow>

      <AndroidWindow id="nowhere" title="Secret Backroom /nowhere" icon={<Star className="w-4 h-4 text-yellow-400" />} defaultX={0} width={480}>
        <SecretRoomWindow />
      </AndroidWindow>

      {/* Overlay Panels */}
      <AndroidQuickSettings />
      <AndroidAppDrawer />
      <AndroidRecents />
      <AndroidToast />

      {/* Bottom Android Taskbar */}
      <AndroidTaskbar />
    </div>
  );
};
