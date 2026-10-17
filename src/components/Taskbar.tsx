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
          className="fixed bottom-[60px] left-3 z-[1001] w-68 bg-[#1f194c] border-2 border-[#7c6fd6] rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.6)] p-2 font-pixel text-xs text-white overflow-hidden"
        >
          {/* Start banner sidebar */}
          <div className="flex">
            <div className="w-8 bg-gradient-to-t from-[#5f27cd] to-[#a29bfe] rounded-lg text-white font-pixel text-[9px] flex items-end justify-center pb-2 uppercase tracking-widest writing-vertical-lr select-none rotate-180">
              FOURIE 404
            </div>

            <div className="flex-1 p-2 space-y-1">
              <button
                type="button"
                role="menuitem"
                onClick={() => handleAppLaunch("about")}
                className="w-full text-left p-2 flex items-center gap-2.5 hover:bg-[#7c6fd6] rounded-xl transition-colors"
              >
                <Heart className="w-4 h-4 text-[#ff9ec0] fill-[#ff9ec0]" />
                <span>About Baby.txt</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => handleAppLaunch("rescued")}
                className="w-full text-left p-2 flex items-center gap-2.5 hover:bg-[#7c6fd6] rounded-xl transition-colors"
              >
                <FolderArchive className="w-4 h-4 text-[#ffd97a]" />
                <span>Cozy Parcels</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => handleAppLaunch("lullaby")}
                className="w-full text-left p-2 flex items-center gap-2.5 hover:bg-[#7c6fd6] rounded-xl transition-colors"
              >
                <Music className="w-4 h-4 text-[#a89bf0]" />
                <span>Bedtime Lullaby Lab</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => handleAppLaunch("notes")}
                className="w-full text-left p-2 flex items-center gap-2.5 hover:bg-[#7c6fd6] rounded-xl transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#a3f7bf]" />
                <span>Lost Wish Wall</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => handleAppLaunch("chat")}
                className="w-full text-left p-2 flex items-center gap-2.5 hover:bg-[#7c6fd6] rounded-xl transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-[#7ce8ff]" />
                <span>Chat with Fourie</span>
              </button>

              <div className="h-[1px] bg-[#3d3368] my-1" />

              <button
                type="button"
                role="menuitem"
                onClick={() => handleAppLaunch("bin")}
                className="w-full text-left p-2 flex items-center gap-2.5 hover:bg-[#7c6fd6] rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4 text-[#ff80bf]" />
                <span>Recycle Basket</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Soothing Taskbar */}
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
          className="font-bold flex items-center gap-1.5"
        >
          <span className="text-[#ffd97a] font-pixel">✦</span>
          <span>Start</span>
        </button>

        {/* Open Windows Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[50vw]">
          {openWindows.map((id) => (
            <button
              key={id}
              type="button"
              aria-current="true"
              onClick={() => {
                audio.click();
                focusWindow(id);
              }}
              className="text-[9px] uppercase px-3 py-1 truncate max-w-[125px]"
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

        <span className="flex-1" />

        {/* Day / Night Sky Toggle */}
        <button
          type="button"
          aria-label={`Toggle theme, current is ${theme}`}
          onClick={() => {
            audio.click();
            toggleTheme();
          }}
          className="flex items-center gap-1.5 px-3 py-1 text-[9px]"
        >
          {theme === "night" ? (
            <>
              <Moon className="w-3.5 h-3.5 text-[#ffd97a]" />
              <span className="hidden md:inline">Night</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-[#ffd97a]" />
              <span className="hidden md:inline">Morning</span>
            </>
          )}
        </button>

        {/* Digital Clock */}
        <div className="px-3 py-1 text-[10px] font-pixel bg-[#161234] border border-[#483d7a] rounded-lg text-[#ffd97a] select-none">
          <time>{timeStr || "12:00"}</time>
        </div>
      </nav>
    </>
  );
};
