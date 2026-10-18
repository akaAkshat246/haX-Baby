import React, { useState } from "react";
import { useStore, WindowId } from "../core/store";
import { audio } from "../core/audio";
import {
  X,
  Search,
  Heart,
  FolderArchive,
  Music,
  MessageSquare,
  Network,
  Globe,
  Trash2,
  Key,
  Award,
} from "lucide-react";

interface DrawerApp {
  id: WindowId;
  name: string;
  category: string;
  icon: React.ReactNode;
  bg: string;
}

export const AndroidAppDrawer: React.FC = () => {
  const appDrawerOpen = useStore((s) => s.appDrawerOpen);
  const setAppDrawerOpen = useStore((s) => s.setAppDrawerOpen);
  const openWindow = useStore((s) => s.openWindow);
  const [filter, setFilter] = useState("");

  if (!appDrawerOpen) return null;

  const allApps: DrawerApp[] = [
    {
      id: "about",
      name: "About Fourie",
      category: "System / Dossier",
      icon: <Heart className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-tr from-[#00b0ff] to-[#00e5ff]",
    },
    {
      id: "rescued",
      name: "Rescued Parcels",
      category: "Files / 3 Artifacts",
      icon: <FolderArchive className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-tr from-[#ff9100] to-[#ffd740]",
    },
    {
      id: "lullaby",
      name: "Lullaby Lab",
      category: "Media / 16-Step Sequencer",
      icon: <Music className="w-7 h-7 text-black" />,
      bg: "bg-gradient-to-tr from-[#00e676] to-[#69f0ae]",
    },
    {
      id: "notes",
      name: "Lost Wish Wall",
      category: "Notes / Guestbook",
      icon: <Heart className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-tr from-[#ff1744] to-[#ff5252]",
    },
    {
      id: "chat",
      name: "Messages",
      category: "Chat / Assistant",
      icon: <MessageSquare className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-tr from-[#7c4dff] to-[#b388ff]",
    },
    {
      id: "router",
      name: "Star Router",
      category: "Maps / Dijkstra Routing",
      icon: <Network className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-tr from-[#2979ff] to-[#448aff]",
    },
    {
      id: "geocities",
      name: "Web Archive",
      category: "Web / GeoCities Shrine",
      icon: <Globe className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-tr from-[#aa00ff] to-[#ea80fc]",
    },
    {
      id: "bin",
      name: "Recycle Basket",
      category: "Storage / Relics",
      icon: <Trash2 className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-tr from-[#78909c] to-[#b0bec5]",
    },
    {
      id: "webring",
      name: "Webring Hub",
      category: "Preservation Ring",
      icon: <Award className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-tr from-[#00bfa5] to-[#64ffda]",
    },
    {
      id: "nowhere",
      name: "Secret Backroom",
      category: "Developer /portal",
      icon: <Key className="w-7 h-7 text-white" />,
      bg: "bg-gradient-to-tr from-[#d500f9] to-[#f50057]",
    },
  ];

  const filteredApps = allApps.filter((a) =>
    a.name.toLowerCase().includes(filter.toLowerCase()) ||
    a.category.toLowerCase().includes(filter.toLowerCase())
  );

  const handleLaunch = (id: WindowId) => {
    audio.click();
    openWindow(id);
    setAppDrawerOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-label="App Drawer"
      className="fixed inset-0 z-[1400] bg-black/75 backdrop-blur-2xl flex flex-col items-center justify-start pt-14 pb-20 px-4 select-none overflow-y-auto animate-fade-in"
      onClick={() => setAppDrawerOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-[#121620] border border-white/10 rounded-3xl p-6 shadow-[0_24px_70px_rgba(0,0,0,0.85)] space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex-1 flex items-center gap-2.5 px-4 py-2 bg-white/[0.04] rounded-full border border-white/10">
            <Search className="w-4 h-4 text-[#9da3b4]" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search apps..."
              className="bg-transparent text-sm text-white placeholder-white/40 focus:outline-none flex-1 font-sans"
              autoFocus
            />
          </div>

          <button
            type="button"
            onClick={() => setAppDrawerOpen(false)}
            className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
          {filteredApps.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => handleLaunch(app.id)}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              <div
                className={`w-15 h-15 rounded-2xl ${app.bg} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 active:scale-95 group-hover:-translate-y-1`}
              >
                {app.icon}
              </div>
              <span className="text-xs font-medium text-white/90 mt-2.5 max-w-[85px] leading-tight truncate">
                {app.name}
              </span>
              <span className="text-[10px] text-[#555c6d] font-mono mt-0.5 truncate max-w-[85px]">
                {app.category.split("/")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
