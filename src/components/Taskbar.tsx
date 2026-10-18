import React, { useState, useEffect } from "react";
import { useStore, WindowId } from "../core/store";
import { audio } from "../core/audio";
import { Sun, Moon, Heart, FolderArchive, Music, MessageSquare, Trash2, HelpCircle } from "lucide-react";

interface TaskbarProps {
  visible: boolean;
}

export const Taskbar: React.FC<TaskbarProps> = ({ visible }) => {
  const openWindows = useStore((s) => s.openWindows);
  const openWindow = useStore((s) => s.openWindow);
  const focusWindow = useStore((s) => s.focusWindow);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(
        d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStartToggle = () => {
    audio.click();
    setStartMenuOpen(!startMenuOpen);
  };

  const handleAppLaunch = (id: WindowId) => {
    audio.click();
    openWindow(id);
    setStartMenuOpen(false);
  };

  return (
    <>
      {/* Start Menu Popup */}
      {startMenuOpen && (
        <div
          role="menu"
          aria-label="Start menu"
          className="fixed bottom-[68px] left-1/2 -translate-x-1/2 md:translate-x-0 md:left-6 z-[1001] w-72 bg-[#090b10] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-3 font-sans text-xs text-[#f4f4f6] backdrop-blur-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[11px] font-mono text-[#9da3b4]">
            <span className="flex items-center gap-1.5 text-white font-medium">
              <span className="status-dot"></span>
              <span>FOURIE OS v4.04</span>
            </span>
            <span className="text-[#555c6d]">SANCTUARY</span>
          </div>

          <div className="space-y-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => handleAppLaunch("about")}
              className="w-full text-left p-2 flex items-center gap-2.5 hover:bg-white/[0.06] rounded-xl transition-colors text-white/90 hover:text-white"
            >
              <Heart className="w-4 h-4 text-[#00ff66]" />
              <span className="font-medium">About Baby Fourie</span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => handleAppLaunch("rescued")}
              className="w-full text-left p-2 flex items-center gap-2.5 hover:bg-white/[0.06] rounded-xl transition-colors text-white/90 hover:text-white"
            >
              <FolderArchive className="w-4 h-4 text-[#00e5ff]" />
              <span className="font-medium">Rescued Parcels (3)</span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => handleAppLaunch("lullaby")}
              className="w-full text-left p-2 flex items-center gap-2.5 hover:bg-white/[0.06] rounded-xl transition-colors text-white/90 hover:text-white"
            >
              <Music className="w-4 h-4 text-[#ffb703]" />
              <span className="font-medium">Dial-Up Lullaby Lab</span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => handleAppLaunch("notes")}
              className="w-full text-left p-2 flex items-center gap-2.5 hover:bg-white/[0.06] rounded-xl transition-colors text-white/90 hover:text-white"
            >
              <MessageSquare className="w-4 h-4 text-[#a3f7bf]" />
              <span className="font-medium">Lost Wish Guestbook</span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => handleAppLaunch("chat")}
              className="w-full text-left p-2 flex items-center gap-2.5 hover:bg-white/[0.06] rounded-xl transition-colors text-white/90 hover:text-white"
            >
              <HelpCircle className="w-4 h-4 text-[#00ff66]" />
              <span className="font-medium">Chat with Baby Fourie</span>
            </button>

            <div className="h-[1px] bg-white/10 my-1.5" />

            <button
              type="button"
              role="menuitem"
              onClick={() => handleAppLaunch("bin")}
              className="w-full text-left p-2 flex items-center gap-2.5 hover:bg-white/[0.06] rounded-xl transition-colors text-[#9da3b4] hover:text-white"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
              <span>Recycle Basket (Relics)</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating OLED Dock Taskbar */}
      <nav
        aria-label="Desktop taskbar"
        className={`taskbar ${visible ? "on" : ""}`}
      >
        {/* Start Button */}
        <button
          type="button"
          aria-expanded={startMenuOpen}
          aria-haspopup="true"
          onClick={handleStartToggle}
          className="font-medium flex items-center gap-2 !text-white !bg-white/10 hover:!bg-[#00ff66] hover:!text-black"
        >
          <span className="status-dot"></span>
          <span>Menu</span>
        </button>

        {/* Open Windows Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[40vw]">
          {openWindows.map((id) => (
            <button
              key={id}
              type="button"
              aria-current="true"
              onClick={() => {
                audio.click();
                focusWindow(id);
              }}
              className="text-[11px] px-3 py-1 font-mono truncate max-w-[120px]"
            >
              {id === "about" && "About"}
              {id === "rescued" && "Parcels"}
              {id === "lullaby" && "Lullaby"}
              {id === "notes" && "Wishes"}
              {id === "bin" && "Basket"}
              {id === "chat" && "Chat"}
              {id === "nowhere" && "Secret"}
            </button>
          ))}
        </div>

        {/* Day / Night Sky Toggle */}
        <button
          type="button"
          aria-label={`Toggle theme, current is ${theme}`}
          onClick={() => {
            audio.click();
            toggleTheme();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-[#9da3b4]"
        >
          {theme === "night" ? (
            <Moon className="w-3.5 h-3.5 text-[#ffb703]" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-[#ffb703]" />
          )}
        </button>

        {/* Digital Clock */}
        <div className="px-2.5 py-1 text-[11px] font-mono text-[#9da3b4] select-none">
          <time>{timeStr || "12:00"}</time>
        </div>
      </nav>
    </>
  );
};
