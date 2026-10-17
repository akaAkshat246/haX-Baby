import React from "react";
import { FourieCharacter } from "../components/FourieCharacter";
import { RetroWindow } from "../components/RetroWindow";
import { AboutWindow } from "../components/windows/AboutWindow";
import { ProjectsWindow } from "../components/windows/ProjectsWindow";
import { LullabyLabWindow } from "../components/windows/LullabyLabWindow";
import { NotesWindow } from "../components/windows/NotesWindow";
import { RecycleBinWindow } from "../components/windows/RecycleBinWindow";
import { ChatWindow } from "../components/windows/ChatWindow";
import { SecretRoomWindow } from "../components/windows/SecretRoomWindow";
import { useStore, WindowId } from "../core/store";
import { audio } from "../core/audio";
import { Laptop, FolderArchive, Music, MessageSquare, Trash2, HelpCircle } from "lucide-react";

interface DesktopApp {
  id: WindowId;
  label: string;
  icon: React.ReactNode;
}

export const DesktopScene: React.FC = () => {
  const openWindow = useStore((s) => s.openWindow);

  const apps: DesktopApp[] = [
    {
      id: "about",
      label: "About Fourie.txt",
      icon: <Laptop className="w-8 h-8 text-glitch-cyan" />,
    },
    {
      id: "rescued",
      label: "Rescued Parcels",
      icon: <FolderArchive className="w-8 h-8 text-glitch-amber" />,
    },
    {
      id: "lullaby",
      label: "Dial-Up Lullaby",
      icon: <Music className="w-8 h-8 text-glitch-magenta" />,
    },
    {
      id: "notes",
      label: "Lost Notes Wall",
      icon: <MessageSquare className="w-8 h-8 text-glitch-green" />,
    },
    {
      id: "chat",
      label: "Chat with Fourie",
      icon: <HelpCircle className="w-8 h-8 text-blue-400" />,
    },
    {
      id: "bin",
      label: "Recycle Bin",
      icon: <Trash2 className="w-8 h-8 text-red-400" />,
    },
  ];

  const handleLaunch = (id: WindowId) => {
    audio.click();
    openWindow(id);
  };

  return (
    <section
      id="scene-desktop"
      className="relative min-h-[100dvh] w-full bg-[#0a0f24] border-t-4 border-b-4 border-winborder p-4 flex flex-col justify-between overflow-hidden select-none"
    >
      {/* OS Wallpaper Title Banner */}
      <div className="flex items-center justify-between text-xs font-pixel text-gray-400 border-b border-gray-800 pb-2 z-10">
        <span className="text-glitch-cyan">FOURIE LOST &amp; FOUND OS v4.04</span>
        <span className="text-gray-500 hidden sm:inline">SINGLE TAP TO LAUNCH ARTIFACTS</span>
      </div>

      {/* Desktop Main Grid */}
      <div className="relative flex-1 flex flex-col md:flex-row items-center justify-between gap-6 py-6 z-10">
        {/* Desktop Icons Array */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-4 w-full md:w-auto">
          {apps.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => handleLaunch(app.id)}
              className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-white/10 active:bg-white/20 transition-all text-center group border border-transparent hover:border-glitch-cyan/40"
            >
              <div className="p-2 bg-void-800 rounded border border-gray-700 shadow-md group-hover:scale-110 transition-transform">
                {app.icon}
              </div>
              <span className="font-pixel text-[10px] text-paper mt-2 max-w-[90px] leading-tight drop-shadow">
                {app.label}
              </span>
            </button>
          ))}
        </div>

        {/* Fourie Living in the Center of their Desktop Sanctuary */}
        <div className="flex flex-col items-center justify-center text-center">
          <FourieCharacter size="var(--fourie-size, 210px)" />
          <div className="mt-2 px-3 py-1 bg-void-900/90 border border-glitch-cyan rounded font-pixel text-[10px] text-glitch-cyan shadow-lg">
            ✦ LOST &amp; FOUND CHIEF ARCHIVIST ✦
          </div>
        </div>

        {/* Quick Info & Tips Panel */}
        <div className="hidden lg:block w-64 bg-void-800/80 border border-gray-700 rounded p-3 text-xs font-display text-gray-300 space-y-2">
          <h4 className="font-pixel text-[10px] text-glitch-amber uppercase">
            DESKTOP SHORTCUTS
          </h4>
          <p className="text-[11px] leading-relaxed">
            • Tap any parcel above to launch retro windows.
          </p>
          <p className="text-[11px] leading-relaxed">
            • Press <span className="font-pixel text-[9px] text-glitch-cyan">ESC</span> to dismiss any window.
          </p>
          <p className="text-[11px] leading-relaxed">
            • Check the Recycle Bin for lost 90s audio relics!
          </p>
        </div>
      </div>

      {/* Render Active Windows Modal System */}
      <RetroWindow id="about" title="About Fourie.txt" icon="📄" defaultXOffset={-40}>
        <AboutWindow />
      </RetroWindow>

      <RetroWindow id="rescued" title="Rescued Parcels Archive" icon="📦" defaultXOffset={30}>
        <ProjectsWindow />
      </RetroWindow>

      <RetroWindow id="lullaby" title="Dial-Up Lullaby Lab v1.0" icon="🎵" defaultXOffset={0}>
        <LullabyLabWindow />
      </RetroWindow>

      <RetroWindow id="notes" title="Lost & Found Guestbook Wall" icon="📝" defaultXOffset={-20}>
        <NotesWindow />
      </RetroWindow>

      <RetroWindow id="bin" title="Recycle Bin (Discarded Relics)" icon="🗑️" defaultXOffset={50}>
        <RecycleBinWindow />
      </RetroWindow>

      <RetroWindow id="chat" title="Chat with Fourie (AIM v4.04)" icon="💬" defaultXOffset={-10}>
        <ChatWindow />
      </RetroWindow>

      <RetroWindow id="nowhere" title="Secret Backroom: /nowhere" icon="🔑" defaultXOffset={0}>
        <SecretRoomWindow />
      </RetroWindow>
    </section>
  );
};
