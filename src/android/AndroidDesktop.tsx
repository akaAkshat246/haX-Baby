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
} from "lucide-react";

interface DesktopAppIcon {
  id: WindowId;
  label: string;
  icon: React.ReactNode;
  bg: string;
}

export const AndroidDesktop: React.FC = () => {
  const openWindow = useStore((s) => s.openWindow);
  const mood = useStore((s) => s.mood);
  const sendMood = useStore((s) => s.sendMood);
  const showToast = useStore((s) => s.showToast);

  const desktopApps: DesktopAppIcon[] = [
    {
      id: "about",
      label: "About Fourie",
      icon: <Heart className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-tr from-[#00b0ff] to-[#00e5ff]",
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
      bg: "bg-gradient-to-tr from-[#00e676] to-[#69f0ae]",
    },
    {
      id: "chat",
      label: "Messages",
      icon: <MessageSquare className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-tr from-[#7c4dff] to-[#b388ff]",
    },
    {
      id: "notes",
      label: "Lost Notes",
      icon: <Heart className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-tr from-[#ff1744] to-[#ff5252]",
    },
    {
      id: "router",
      label: "Star Router",
      icon: <Network className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-tr from-[#2979ff] to-[#448aff]",
    },
    {
      id: "geocities",
      label: "Web Archive",
      icon: <Globe className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-tr from-[#aa00ff] to-[#ea80fc]",
    },
    {
      id: "bin",
      label: "Recycle Basket",
      icon: <Trash2 className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-tr from-[#78909c] to-[#b0bec5]",
    },
    {
      id: "webring",
      label: "Webring Hub",
      icon: <Award className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-tr from-[#00bfa5] to-[#64ffda]",
    },
    {
      id: "nowhere",
      label: "Secret Room",
      icon: <Key className="w-6 h-6 text-white" />,
      bg: "bg-gradient-to-tr from-[#d500f9] to-[#f50057]",
    },
  ];

  const handleAppLaunch = (id: WindowId) => {
    audio.click();
    openWindow(id);
  };

  const handleCompanionTap = async (e: React.MouseEvent) => {
    await audio.unlock();
    audio.squeak();
    sendMood("POKE");
    bus.emit("poke", { x: e.clientX, y: e.clientY });
    showToast(mood === "sleepy" ? "Woke Baby Fourie! ✦" : "Tickled star charm! ✨");
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#07090e] text-[#f4f4f6] font-sans select-none selection:bg-[#00ff66] selection:text-black">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#00ff66]/6 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#00e5ff]/5 rounded-full blur-[120px] pointer-events-none" />

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
          <div className="mb-2 px-4 py-1.5 rounded-full bg-[#121620]/90 border border-white/10 shadow-lg text-xs font-sans text-white/90 flex items-center gap-2 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-[#00ff66]" />
            <span>"Kuch kho gaya? Maine sambhal ke rakha hai."</span>
          </div>

          <div
            onClick={handleCompanionTap}
            className="cursor-pointer group hover:scale-105 active:scale-95 transition-transform"
            title="Tap to interact with Baby Fourie!"
          >
            <FourieCharacter size={200} />
          </div>

          <div className="mt-2 text-[11px] font-mono text-[#555c6d] uppercase tracking-widest">
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
      <AndroidWindow id="about" title="About Baby Fourie.txt" icon="🧸" defaultX={-30} width={500}>
        <AboutWindow />
      </AndroidWindow>

      <AndroidWindow id="rescued" title="Rescued Parcels (3 Artifacts)" icon="📦" defaultX={30} width={520}>
        <ProjectsWindow />
      </AndroidWindow>

      <AndroidWindow id="lullaby" title="Dial-Up Lullaby Lab v1.0" icon="🎵" defaultX={0} width={540}>
        <LullabyLabWindow />
      </AndroidWindow>

      <AndroidWindow id="chat" title="Messages with Fourie" icon="💬" defaultX={-20} width={480}>
        <ChatWindow />
      </AndroidWindow>

      <AndroidWindow id="notes" title="Lost Wish Wall" icon="📝" defaultX={20} width={500}>
        <NotesWindow />
      </AndroidWindow>

      <AndroidWindow id="router" title="Star Router (Dijkstra Map)" icon="🗺️" defaultX={0} width={580}>
        <RouterWindow />
      </AndroidWindow>

      <AndroidWindow id="geocities" title="Web Archive (1999 Shrine)" icon="🌐" defaultX={-25} width={520}>
        <GeoCitiesWindow />
      </AndroidWindow>

      <AndroidWindow id="bin" title="Recycle Basket (Relics)" icon="🧺" defaultX={25} width={500}>
        <RecycleBinWindow />
      </AndroidWindow>

      <AndroidWindow id="webring" title="Webring Hub & Odometer" icon="🎖️" defaultX={0} width={480}>
        <WebringWindow />
      </AndroidWindow>

      <AndroidWindow id="nowhere" title="Secret Backroom /nowhere" icon="⭐" defaultX={0} width={480}>
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
