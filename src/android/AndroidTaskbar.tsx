import React, { useState, useEffect } from "react";
import { useStore, WindowId } from "../core/store";
import { audio } from "../core/audio";
import {
  ChevronLeft,
  Circle,
  Square,
  LayoutGrid,
  Heart,
  FolderArchive,
  Music,
  MessageSquare,
  Network,
  Globe,
  Wifi,
  Volume2,
  VolumeX,
} from "lucide-react";

interface PinnedApp {
  id: WindowId;
  label: string;
  icon: React.ReactNode;
  bg: string;
}

export const AndroidTaskbar: React.FC = () => {
  const [timeStr, setTimeStr] = useState("");
  const openWindows = useStore((s) => s.openWindows);
  const openWindow = useStore((s) => s.openWindow);
  const closeWindow = useStore((s) => s.closeWindow);
  const closeAllWindows = useStore((s) => s.closeAllWindows);
  const toggleRecents = useStore((s) => s.toggleRecents);
  const toggleAppDrawer = useStore((s) => s.toggleAppDrawer);
  const toggleQuickSettings = useStore((s) => s.toggleQuickSettings);
  const muted = useStore((s) => s.muted);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(
        d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const pinnedApps: PinnedApp[] = [
    {
      id: "about",
      label: "About",
      icon: <Heart className="w-5 h-5 text-white" />,
      bg: "bg-gradient-to-tr from-[#00b0ff] to-[#00e5ff]",
    },
    {
      id: "rescued",
      label: "Parcels",
      icon: <FolderArchive className="w-5 h-5 text-white" />,
      bg: "bg-gradient-to-tr from-[#ff9100] to-[#ffd740]",
    },
    {
      id: "lullaby",
      label: "Lullaby",
      icon: <Music className="w-5 h-5 text-black" />,
      bg: "bg-gradient-to-tr from-[#00e676] to-[#69f0ae]",
    },
    {
      id: "chat",
      label: "Messages",
      icon: <MessageSquare className="w-5 h-5 text-white" />,
      bg: "bg-gradient-to-tr from-[#7c4dff] to-[#b388ff]",
    },
    {
      id: "notes",
      label: "Notes",
      icon: <Heart className="w-5 h-5 text-white" />,
      bg: "bg-gradient-to-tr from-[#ff1744] to-[#ff5252]",
    },
    {
      id: "router",
      label: "Router",
      icon: <Network className="w-5 h-5 text-white" />,
      bg: "bg-gradient-to-tr from-[#2979ff] to-[#448aff]",
    },
    {
      id: "geocities",
      label: "Archive",
      icon: <Globe className="w-5 h-5 text-white" />,
      bg: "bg-gradient-to-tr from-[#aa00ff] to-[#ea80fc]",
    },
  ];

  const handleBack = () => {
    audio.click();
    if (openWindows.length > 0) {
      const topWin = openWindows[openWindows.length - 1];
      closeWindow(topWin);
    }
  };

  const handleHome = () => {
    audio.click();
    closeAllWindows();
  };

  const handleRecents = () => {
    audio.click();
    toggleRecents();
  };

  const handleAppClick = (id: WindowId) => {
    audio.click();
    openWindow(id);
  };

  return (
    <nav
      aria-label="Android Taskbar"
      className="fixed bottom-0 left-0 right-0 h-16 z-[1200] px-3 md:px-5 flex items-center justify-between bg-[#0b0e14]/92 backdrop-blur-2xl border-t border-white/[0.08] select-none"
    >
      {/* Left: Android 3-Button Navigation (Back, Home, Recents) */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Back"
          className="android-nav-btn"
          title="Back (Esc / Close top window)"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleHome}
          aria-label="Home"
          className="android-nav-btn"
          title="Home (Minimize all to Desktop)"
        >
          <Circle className="w-4 h-4 fill-current" />
        </button>

        <button
          type="button"
          onClick={handleRecents}
          aria-label="Recent Apps"
          className="android-nav-btn"
          title="Overview / Recent Apps"
        >
          <Square className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      {/* Center: App Drawer + Pinned Favorite Apps Dock */}
      <div className="flex items-center gap-2.5 overflow-x-auto py-1 px-2">
        {/* App Drawer Launcher Button */}
        <button
          type="button"
          onClick={() => {
            audio.click();
            toggleAppDrawer();
          }}
          aria-label="Open App Drawer"
          className="w-11 h-11 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-92"
          title="All Apps"
        >
          <LayoutGrid className="w-5 h-5 text-[#00ff66]" />
        </button>

        <div className="w-[1px] h-6 bg-white/10 mx-0.5 hidden sm:block" />

        {/* Pinned App Icons */}
        {pinnedApps.map((app) => {
          const isOpen = openWindows.includes(app.id);

          return (
            <button
              key={app.id}
              type="button"
              onClick={() => handleAppClick(app.id)}
              className="relative group flex flex-col items-center"
              title={app.label}
            >
              <div
                className={`w-11 h-11 rounded-2xl ${app.bg} flex items-center justify-center shadow-md transition-all group-hover:scale-110 active:scale-95 group-hover:-translate-y-1`}
              >
                {app.icon}
              </div>

              {/* Running App Indicator Dot */}
              {isOpen && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] shadow-[0_0_6px_#00ff66] mt-1 absolute -bottom-1.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Right: Quick Settings Pill */}
      <button
        type="button"
        onClick={() => {
          audio.click();
          toggleQuickSettings();
        }}
        aria-label="Quick Settings Tray"
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/90 text-xs font-sans transition-colors"
      >
        <Wifi className="w-3.5 h-3.5" />
        {muted ? (
          <VolumeX className="w-3.5 h-3.5 text-[#ff3366]" />
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-[#00ff66]" />
        )}
        <span className="font-semibold text-xs ml-0.5">{timeStr || "12:00"}</span>
      </button>
    </nav>
  );
};
