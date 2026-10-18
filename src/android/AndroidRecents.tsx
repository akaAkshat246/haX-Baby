import React from "react";
import { useStore, WindowId } from "../core/store";
import { audio } from "../core/audio";
import { X, Trash2 } from "lucide-react";

export const AndroidRecents: React.FC = () => {
  const recentsOpen = useStore((s) => s.recentsOpen);
  const setRecentsOpen = useStore((s) => s.setRecentsOpen);
  const openWindows = useStore((s) => s.openWindows);
  const focusWindow = useStore((s) => s.focusWindow);
  const closeWindow = useStore((s) => s.closeWindow);
  const closeAllWindows = useStore((s) => s.closeAllWindows);

  if (!recentsOpen) return null;

  const appMeta: Record<WindowId, { title: string; icon: string }> = {
    about: { title: "About Baby Fourie", icon: "🧸" },
    rescued: { title: "Rescued Parcels", icon: "📦" },
    lullaby: { title: "Lullaby Lab", icon: "🎵" },
    notes: { title: "Lost Wish Wall", icon: "📝" },
    chat: { title: "Messages", icon: "💬" },
    router: { title: "Star Router", icon: "🗺️" },
    geocities: { title: "Web Archive", icon: "🌐" },
    bin: { title: "Recycle Basket", icon: "🧺" },
    webring: { title: "Webring Hub", icon: "🎖️" },
    nowhere: { title: "Secret Backroom", icon: "⭐" },
  };

  const handleSelectWindow = (id: WindowId) => {
    audio.click();
    focusWindow(id);
    setRecentsOpen(false);
  };

  const handleCloseSingle = (e: React.MouseEvent, id: WindowId) => {
    e.stopPropagation();
    audio.click();
    closeWindow(id);
  };

  const handleClearAll = () => {
    audio.click();
    closeAllWindows();
    setRecentsOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Recent Apps Overview"
      className="fixed inset-0 z-[1400] bg-black/75 backdrop-blur-2xl flex flex-col items-center justify-center p-6 select-none animate-fade-in"
      onClick={() => setRecentsOpen(false)}
    >
      <div
        className="w-full max-w-4xl flex flex-col items-center space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-xs font-mono text-[#9da3b4] uppercase tracking-widest">
          Recent Applications ({openWindows.length})
        </div>

        {openWindows.length === 0 ? (
          <div className="text-center py-16 text-[#555c6d] font-sans text-sm">
            No recent apps open. Launch an app from the dock or desktop.
          </div>
        ) : (
          <div className="flex items-center gap-6 overflow-x-auto py-4 px-2 w-full max-w-3xl justify-center">
            {openWindows.map((id) => {
              const meta = appMeta[id] || { title: id, icon: "📁" };

              return (
                <div
                  key={id}
                  onClick={() => handleSelectWindow(id)}
                  className="w-64 h-80 rounded-2xl bg-[#171d29] border border-white/10 hover:border-[#00ff66]/50 shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-pointer flex flex-col overflow-hidden transition-all hover:scale-105 group flex-shrink-0"
                >
                  {/* Card Header */}
                  <div className="p-3 bg-[#1e2636] border-b border-white/10 flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-2 truncate">
                      <span>{meta.icon}</span>
                      <span className="font-semibold truncate">{meta.title}</span>
                    </div>

                    <button
                      type="button"
                      aria-label="Close app"
                      onClick={(e) => handleCloseSingle(e, id)}
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card Body Snapshot */}
                  <div className="flex-1 p-4 bg-[#0e121a] text-xs text-[#9da3b4] flex flex-col justify-center items-center text-center space-y-2">
                    <span className="text-4xl">{meta.icon}</span>
                    <span className="font-mono text-[11px] text-[#00ff66]">ACTIVE IN MEMORY</span>
                    <span className="text-[10px] text-[#555c6d]">Tap to bring window to front</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Clear All Pill Button */}
        {openWindows.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-[#ff3366] hover:text-white transition-all shadow-lg flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear all apps</span>
          </button>
        )}
      </div>
    </div>
  );
};
