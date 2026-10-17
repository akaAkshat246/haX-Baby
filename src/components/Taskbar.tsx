import React, { useState, useEffect } from "react";
import { useStore, WindowId } from "../core/store";
import { audio } from "../core/audio";
import { Sun, Moon, Laptop, FolderArchive, Music, MessageSquare, Trash2, HelpCircle } from "lucide-react";

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
          className="fixed bottom-[52px] left-2 z-[1001] w-64 bg-winborder border-2 border-white border-r-ink border-b-ink shadow-[4px_4px_0_#000] p-1 font-pixel text-xs text-ink"
        >
          {/* Start banner sidebar */}
          <div className="flex">
            <div className="w-8 bg-win-header text-white font-pixel text-[10px] flex items-end justify-center pb-2 uppercase tracking-widest writing-vertical-lr select-none rotate-180">
              FOURIE 404
            </div>

            <div className="flex-1 p-2 space-y-1">
              <button
                type="button"
                role="menuitem"
                onClick={() => handleAppLaunch("about")}
                className="w-full text-left p-1.5 flex items-center gap-2.5 hover:bg-win-header hover:text-white rounded"
              >
                <Laptop className="w-4 h-4 text-glitch-cyan" />
                <span>About Fourie.txt</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => handleAppLaunch("rescued")}
                className="w-full text-left p-1.5 flex items-center gap-2.5 hover:bg-win-header hover:text-white rounded"
              >
                <FolderArchive className="w-4 h-4 text-glitch-amber" />
                <span>Rescued Pages</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => handleAppLaunch("lullaby")}
                className="w-full text-left p-1.5 flex items-center gap-2.5 hover:bg-win-header hover:text-white rounded"
              >
                <Music className="w-4 h-4 text-glitch-magenta" />
                <span>Dial-Up Lullaby Lab</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => handleAppLaunch("notes")}
                className="w-full text-left p-1.5 flex items-center gap-2.5 hover:bg-win-header hover:text-white rounded"
              >
                <MessageSquare className="w-4 h-4 text-glitch-green" />
                <span>Lost & Found Notes</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => handleAppLaunch("chat")}
                className="w-full text-left p-1.5 flex items-center gap-2.5 hover:bg-win-header hover:text-white rounded"
              >
                <HelpCircle className="w-4 h-4 text-glitch-cyan" />
                <span>Chat with Fourie</span>
              </button>

              <div className="h-[2px] bg-gray-400 my-1" />

              <button
                type="button"
                role="menuitem"
                onClick={() => handleAppLaunch("bin")}
                className="w-full text-left p-1.5 flex items-center gap-2.5 hover:bg-win-header hover:text-white rounded"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
                <span>Recycle Bin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Retro Taskbar */}
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
          <span className="text-glitch-cyan font-pixel">✦</span>
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
              className="text-[9px] uppercase px-2 py-1 truncate max-w-[120px]"
            >
              {id === "about" && "About"}
              {id === "rescued" && "Rescued"}
              {id === "lullaby" && "Lullaby"}
              {id === "notes" && "Notes"}
              {id === "bin" && "Bin"}
              {id === "chat" && "Chat"}
              {id === "nowhere" && "404 Room"}
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
          className="flex items-center gap-1 px-2 py-1 text-[9px]"
        >
          {theme === "night" ? (
            <>
              <Moon className="w-3.5 h-3.5 text-glitch-cyan" />
              <span className="hidden md:inline">Night</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-glitch-amber" />
              <span className="hidden md:inline">Day</span>
            </>
          )}
        </button>

        {/* Retro Digital Clock */}
        <div className="retro-bevel-inset px-2.5 py-1 text-[10px] font-pixel bg-white text-ink select-none">
          <time>{timeStr || "12:00"}</time>
        </div>
      </nav>
    </>
  );
};
