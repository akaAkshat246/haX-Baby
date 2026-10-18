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
import { Heart, FolderArchive, Music, MessageSquare, Trash2, Sparkles, HelpCircle } from "lucide-react";

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
      icon: <Heart className="w-6 h-6 text-[#00ff66]" />,
    },
    {
      id: "rescued",
      label: "Rescued Parcels",
      icon: <FolderArchive className="w-6 h-6 text-[#00e5ff]" />,
    },
    {
      id: "lullaby",
      label: "Lullaby Lab",
      icon: <Music className="w-6 h-6 text-[#ffb703]" />,
    },
    {
      id: "notes",
      label: "Lost Wish Wall",
      icon: <MessageSquare className="w-6 h-6 text-[#a3f7bf]" />,
    },
    {
      id: "chat",
      label: "Chat with Baby",
      icon: <HelpCircle className="w-6 h-6 text-[#b266ff]" />,
    },
    {
      id: "bin",
      label: "Recycle Basket",
      icon: <Trash2 className="w-6 h-6 text-[#ff3366]" />,
    },
  ];

  const handleLaunch = (id: WindowId) => {
    audio.click();
    openWindow(id);
  };

  return (
    <section
      id="scene-desktop"
      className="relative min-h-[100dvh] w-full bg-[#040404] border-t border-b border-white/10 p-6 flex flex-col justify-between overflow-hidden select-none"
    >
      {/* OS Wallpaper Title Banner */}
      <div className="flex items-center justify-between text-xs font-mono text-[#9da3b4] border-b border-white/10 pb-3 z-10 w-full max-w-6xl mx-auto">
        <div className="editorial-index">
          <span>05</span>
          <span>/</span>
          <span>Fourie 404 Sanctuary Desktop OS v4.04</span>
        </div>
        <span className="text-[#555c6d] hidden sm:inline font-mono text-[11px]">CLICK ANY ICON TO LAUNCH</span>
      </div>

      {/* Desktop Main Grid */}
      <div className="relative flex-1 flex flex-col md:flex-row items-center justify-between gap-8 py-8 z-10 w-full max-w-6xl mx-auto">
        {/* Desktop Icons Array */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3.5 w-full md:w-auto">
          {apps.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => handleLaunch(app.id)}
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#090b10] hover:bg-[#0e1117] border border-white/10 hover:border-[#00ff66]/50 transition-all text-center group shadow-[0_8px_24px_rgba(0,0,0,0.6)] hover:scale-105 active:scale-95"
            >
              <div className="p-3 bg-white/[0.03] rounded-xl border border-white/10 group-hover:border-[#00ff66]/40 transition-colors">
                {app.icon}
              </div>
              <span className="font-mono text-xs text-white/90 mt-2.5 max-w-[100px] leading-tight truncate">
                {app.label}
              </span>
            </button>
          ))}
        </div>

        {/* Fourie Living in the Center of their Desktop Bedroom */}
        <div className="flex flex-col items-center justify-center text-center">
          <FourieCharacter size="var(--fourie-size, 215px)" />
          <div className="hax-badge mt-4">
            <span className="status-dot"></span>
            <span>LOST &amp; FOUND SANCTUARY KEEPER</span>
          </div>
        </div>

        {/* Cozy Baby Bedroom Corner Info */}
        <div className="hidden lg:block w-72 bg-[#090b10] border border-white/10 rounded-2xl p-5 text-xs text-[#9da3b4] space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-white font-mono text-xs pb-1 border-b border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#00ff66]" />
            <span className="font-semibold uppercase tracking-wider">Sanctuary Guide</span>
          </div>
          <p className="leading-relaxed">
            • Tap any parcel on the left to inspect Fourie's rescued treasures.
          </p>
          <p className="leading-relaxed">
            • Press <span className="font-mono text-[11px] text-[#00ff66] bg-white/[0.04] px-1 py-0.5 rounded border border-white/10">ESC</span> to close any active window.
          </p>
          <p className="leading-relaxed">
            • Check the Recycle Basket for a forgotten MIDI lullaby!
          </p>
        </div>
      </div>

      {/* Render Active Windows Modal System */}
      <RetroWindow id="about" title="About Baby Fourie.txt" icon={<Heart className="w-3.5 h-3.5 text-pink-400" />} defaultXOffset={-40}>
        <AboutWindow />
      </RetroWindow>

      <RetroWindow id="rescued" title="Rescued Parcels" icon={<FolderArchive className="w-3.5 h-3.5 text-cyan-400" />} defaultXOffset={30}>
        <ProjectsWindow />
      </RetroWindow>

      <RetroWindow id="lullaby" title="Dial-Up Lullaby Lab v1.0" icon={<Music className="w-3.5 h-3.5 text-purple-400" />} defaultXOffset={0}>
        <LullabyLabWindow />
      </RetroWindow>

      <RetroWindow id="notes" title="Lost Wish Guestbook" icon={<Sparkles className="w-3.5 h-3.5 text-amber-400" />} defaultXOffset={-20}>
        <NotesWindow />
      </RetroWindow>

      <RetroWindow id="bin" title="Recycle Basket (Relics)" icon={<Trash2 className="w-3.5 h-3.5 text-rose-400" />} defaultXOffset={50}>
        <RecycleBinWindow />
      </RetroWindow>

      <RetroWindow id="chat" title="Chat with Baby Fourie" icon={<MessageSquare className="w-3.5 h-3.5 text-emerald-400" />} defaultXOffset={-10}>
        <ChatWindow />
      </RetroWindow>

      <RetroWindow id="nowhere" title="Secret Backroom: /nowhere" icon={<Sparkles className="w-3.5 h-3.5 text-yellow-400" />} defaultXOffset={0}>
        <SecretRoomWindow />
      </RetroWindow>
    </section>
  );
};
