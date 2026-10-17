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
import { Heart, FolderArchive, Music, MessageSquare, Trash2, Sparkles } from "lucide-react";

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
      label: "About Baby.txt",
      icon: <Heart className="w-7 h-7 text-[#ff9ec0] fill-[#ff9ec0]" />,
    },
    {
      id: "rescued",
      label: "Cozy Parcels",
      icon: <FolderArchive className="w-7 h-7 text-[#ffd97a]" />,
    },
    {
      id: "lullaby",
      label: "Bedtime Lullaby",
      icon: <Music className="w-7 h-7 text-[#a89bf0]" />,
    },
    {
      id: "notes",
      label: "Lost Wish Wall",
      icon: <MessageSquare className="w-7 h-7 text-[#a3f7bf]" />,
    },
    {
      id: "chat",
      label: "Chat with Baby",
      icon: <Sparkles className="w-7 h-7 text-[#7ce8ff]" />,
    },
    {
      id: "bin",
      label: "Recycle Basket",
      icon: <Trash2 className="w-7 h-7 text-[#ff80bf]" />,
    },
  ];

  const handleLaunch = (id: WindowId) => {
    audio.click();
    openWindow(id);
  };

  return (
    <section
      id="scene-desktop"
      className="relative min-h-[100dvh] w-full bg-gradient-to-b from-[#13102d] via-[#1a153c] to-[#120f2a] border-t-3 border-b-3 border-[#7c6fd6] p-4 flex flex-col justify-between overflow-hidden select-none"
    >
      {/* OS Wallpaper Title Banner */}
      <div className="flex items-center justify-between text-xs font-pixel text-[#ffd97a] border-b border-[#30285a] pb-2 z-10">
        <span className="flex items-center gap-1.5">
          <span>✦</span>
          <span>BABY FOURIE'S BEDROOM OS v4.04</span>
        </span>
        <span className="text-[#a89bf0] hidden sm:inline">SINGLE TAP TO LAUNCH SLEEPY TOYS</span>
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
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#1e1948]/70 hover:bg-[#2e266b]/90 border border-[#483d7a] hover:border-[#ffd97a] transition-all text-center group shadow-md hover:scale-105 active:scale-95"
            >
              <div className="p-2.5 bg-[#120f2c] rounded-xl border border-[#524484] shadow-sm group-hover:scale-110 transition-transform">
                {app.icon}
              </div>
              <span className="font-pixel text-[10px] text-[#ffffff] mt-2 max-w-[95px] leading-tight drop-shadow">
                {app.label}
              </span>
            </button>
          ))}
        </div>

        {/* Fourie Living in the Center of their Desktop Bedroom */}
        <div className="flex flex-col items-center justify-center text-center">
          <FourieCharacter size="var(--fourie-size, 215px)" />
          <div className="mt-2.5 px-4 py-1.5 bg-[#251f50]/90 border border-[#a89bf0] rounded-full font-pixel text-[10px] text-[#ffd97a] shadow-lg flex items-center gap-2">
            <span>✦</span>
            <span>LOST &amp; FOUND NURSERY KEEPER</span>
            <span>✦</span>
          </div>
        </div>

        {/* Cozy Baby Bedroom Corner Info */}
        <div className="hidden lg:block w-64 bg-[#1f194c]/80 border border-[#483d7a] rounded-2xl p-4 text-xs font-display text-[#c8bffd] space-y-2.5 shadow-xl">
          <h4 className="font-pixel text-[10px] text-[#ffd97a] uppercase flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#ff9ec0] fill-[#ff9ec0]" />
            <span>NURSERY NOTES</span>
          </h4>
          <p className="text-[11px] leading-relaxed">
            • Tap any parcel on the left to play with Fourie's rescued treasures.
          </p>
          <p className="text-[11px] leading-relaxed">
            • Press <span className="font-pixel text-[9px] text-[#ffd97a]">ESC</span> to close any open dialog window.
          </p>
          <p className="text-[11px] leading-relaxed">
            • Check the Recycle Basket for a sweet forgotten lullaby!
          </p>
        </div>
      </div>

      {/* Render Active Windows Modal System */}
      <RetroWindow id="about" title="About Baby Fourie.txt" icon="🧸" defaultXOffset={-40}>
        <AboutWindow />
      </RetroWindow>

      <RetroWindow id="rescued" title="Rescued Cozy Parcels" icon="📦" defaultXOffset={30}>
        <ProjectsWindow />
      </RetroWindow>

      <RetroWindow id="lullaby" title="Bedtime Lullaby Lab v1.0" icon="🎵" defaultXOffset={0}>
        <LullabyLabWindow />
      </RetroWindow>

      <RetroWindow id="notes" title="Lost Wish Wall &amp; Notes" icon="📝" defaultXOffset={-20}>
        <NotesWindow />
      </RetroWindow>

      <RetroWindow id="bin" title="Recycle Basket (Forgotten Relics)" icon="🧺" defaultXOffset={50}>
        <RecycleBinWindow />
      </RetroWindow>

      <RetroWindow id="chat" title="Chat with Baby Fourie" icon="💬" defaultXOffset={-10}>
        <ChatWindow />
      </RetroWindow>

      <RetroWindow id="nowhere" title="Secret Dream Backroom: /nowhere" icon="⭐" defaultXOffset={0}>
        <SecretRoomWindow />
      </RetroWindow>
    </section>
  );
};
