import React from "react";
import { useStore } from "../../core/store";
import { audio } from "../../core/audio";
import { FolderArchive, Music, Network, Sparkles, ExternalLink } from "lucide-react";

export const ProjectsWindow: React.FC = () => {
  const openWindow = useStore((s) => s.openWindow);

  const projects = [
    {
      id: "geocities",
      title: "GeoCities Shrine & Glitch Archive",
      year: "Circa 1999",
      tag: "CULTURE ARTIFACT",
      icon: <FolderArchive className="w-5 h-5 text-glitch-amber" />,
      desc: "A fully authentic 90s web shrine preserved from the void. Features animated marquees, classic 'Under Construction' GIFs, 88x31 badges, and an interactive sticker playground.",
      actionLabel: "Scroll to Shrine Scene",
      action: () => {
        audio.click();
        const el = document.getElementById("scene-geocities");
        el?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "lullaby",
      title: "Dial-Up Lullaby Lab",
      year: "Circa 2001",
      tag: "AUDIO SYNTHESIZER",
      icon: <Music className="w-5 h-5 text-glitch-magenta" />,
      desc: "A procedural 16-step pentatonic music box inspired by 56k dial-up carrier frequencies. Built purely with the Web Audio API with a look-ahead scheduler and custom modem presets.",
      actionLabel: "Open Lullaby Lab",
      action: () => {
        audio.click();
        openWindow("lullaby");
      },
    },
    {
      id: "router",
      title: "Packet Recovery Router",
      year: "Circa 2004",
      tag: "DIJKSTRA GRAPH ALGO",
      icon: <Network className="w-5 h-5 text-glitch-cyan" />,
      desc: "An interactive network topology map where Fourie traces lost data packets. Computes the optimal path through dead DNS servers and BBS hubs using Dijkstra's shortest-path algorithm.",
      actionLabel: "Scroll to Recovery Map",
      action: () => {
        audio.click();
        const el = document.getElementById("scene-router");
        el?.scrollIntoView({ behavior: "smooth" });
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-win-header text-white p-2 text-xs font-pixel flex items-center justify-between">
        <span>ARCHIVE DIRECTORY: /LOST_AND_FOUND/PARCELS</span>
        <span>COUNT: 3 RESCUED</span>
      </div>

      <p className="text-xs text-gray-700 leading-relaxed font-display">
        Fourie caught these three digital monuments as they were slipping into the void. Each artifact is fully functional and interactive!
      </p>

      <div className="space-y-3">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-3 bg-white border-2 border-gray-400 rounded shadow-sm hover:border-win-header transition-colors space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {proj.icon}
                <div>
                  <h4 className="font-bold text-xs text-ink">{proj.title}</h4>
                  <span className="text-[10px] text-gray-500 font-pixel">
                    {proj.year}
                  </span>
                </div>
              </div>
              <span className="text-[9px] font-pixel bg-gray-200 text-gray-800 px-1.5 py-0.5 border border-gray-400">
                {proj.tag}
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed font-display">
              {proj.desc}
            </p>

            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={proj.action}
                className="px-3 py-1.5 bg-winborder text-ink font-pixel text-[10px] retro-bevel active:retro-bevel-inset flex items-center gap-1.5 hover:bg-gray-300"
              >
                <span>{proj.actionLabel}</span>
                <ExternalLink className="w-3 h-3 text-win-header" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
