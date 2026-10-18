import React from "react";
import { useStore, WindowId } from "../core/store";
import { audio } from "../core/audio";
import {
  X,
  Trash2,
  Heart,
  FolderArchive,
  Music,
  Sparkles,
  MessageSquare,
  Compass,
  Globe,
  Award,
  Star,
  Folder,
} from "lucide-react";

export const AndroidRecents: React.FC = () => {
  const recentsOpen = useStore((s) => s.recentsOpen);
  const setRecentsOpen = useStore((s) => s.setRecentsOpen);
  const openWindows = useStore((s) => s.openWindows);
  const focusWindow = useStore((s) => s.focusWindow);
  const closeWindow = useStore((s) => s.closeWindow);
  const closeAllWindows = useStore((s) => s.closeAllWindows);

  if (!recentsOpen) return null;

  const appMeta: Record<WindowId, { title: string; icon: React.ReactNode }> = {
    about: { title: "About Baby Fourie", icon: <Heart className="w-4 h-4 text-pink-400" /> },
    rescued: { title: "Rescued Parcels", icon: <FolderArchive className="w-4 h-4 text-cyan-400" /> },
    lullaby: { title: "Lullaby Lab", icon: <Music className="w-4 h-4 text-purple-400" /> },
    notes: { title: "Lost Wish Wall", icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
    chat: { title: "Messages", icon: <MessageSquare className="w-4 h-4 text-emerald-400" /> },
    router: { title: "Star Router", icon: <Compass className="w-4 h-4 text-blue-400" /> },
    geocities: { title: "Web Archive", icon: <Globe className="w-4 h-4 text-green-400" /> },
    bin: { title: "Recycle Basket", icon: <Trash2 className="w-4 h-4 text-rose-400" /> },
    webring: { title: "Webring Hub", icon: <Award className="w-4 h-4 text-amber-300" /> },
    nowhere: { title: "Secret Backroom", icon: <Star className="w-4 h-4 text-yellow-400" /> },
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

  return (
    <div
      onClick={() => setRecentsOpen(false)}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl flex flex-col items-center gap-6"
      >
        {/* Recents Header */}
        <div className="flex items-center justify-between w-full max-w-3xl px-2">
          <div className="flex items-center gap-2 text-white font-sans font-semibold text-lg">
            <span>Recent Applications</span>
            <span className="text-xs font-mono text-[#00ff66] bg-[#00ff66]/10 px-2.5 py-0.5 rounded-full border border-[#00ff66]/20">
              {openWindows.length} Active
            </span>
          </div>

          {openWindows.length > 0 && (
            <button
              type="button"
              onClick={() => {
                audio.click();
                closeAllWindows();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-red-500/20 text-[#9da3b4] hover:text-red-400 border border-white/10 text-xs font-mono transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {openWindows.length === 0 ? (
          <div className="text-center py-16 text-[#555c6d] font-sans text-sm">
            No recent apps open. Launch an app from the dock or desktop.
          </div>
        ) : (
          <div className="flex items-center gap-6 overflow-x-auto py-4 px-2 w-full max-w-3xl justify-center">
            {openWindows.map((id) => {
              const meta = appMeta[id] || { title: id, icon: <Folder className="w-4 h-4 text-pink-400" /> };

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
                      <span className="truncate font-medium">{meta.title}</span>
                    </div>

                    <button
                      type="button"
                      aria-label="Close window"
                      onClick={(e) => handleCloseSingle(e, id)}
                      className="p-1 rounded-full hover:bg-white/10 text-[#9da3b4] hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card Thumbnail / Preview Placeholder */}
                  <div className="flex-1 p-4 bg-[#0e1117] flex flex-col items-center justify-center text-[#555c6d] text-center gap-2 font-mono text-xs">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:scale-110 transition-transform">
                      {meta.icon}
                    </div>
                    <span className="text-[11px] text-[#9da3b4]">{meta.title}</span>
                    <span className="text-[9px] text-[#555c6d]">Tap card to bring to front</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
