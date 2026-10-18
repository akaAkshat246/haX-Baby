import React from "react";
import { useStore } from "../../core/store";
import { audio } from "../../core/audio";
import { FolderArchive, Music, Network, ArrowUpRight } from "lucide-react";

export const ProjectsWindow: React.FC = () => {
  const openWindow = useStore((s) => s.openWindow);

  const projects = [
    {
      id: "geocities",
      title: "GeoCities Shrine & Glitch Archive",
      year: "Circa 1999",
      tag: "CULTURE ARTIFACT",
      icon: <FolderArchive className="w-5 h-5 text-[#ffb703]" />,
      desc: "An authentic early web shrine preserved from the void. Features animated marquees, classic 'Under Construction' GIFs, 88x31 badges, and an interactive sticker playground.",
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
      icon: <Music className="w-5 h-5 text-[#00ff66]" />,
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
      icon: <Network className="w-5 h-5 text-[#00e5ff]" />,
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
    <div className="space-y-4 font-sans text-sm">
      <div className="p-3 bg-[#0e1117] rounded-xl border border-white/10 text-xs font-mono flex items-center justify-between text-[#9da3b4]">
        <span className="flex items-center gap-2 text-white">
          <span className="status-dot"></span>
          <span>/LOST_AND_FOUND/PARCELS</span>
        </span>
        <span className="text-[#00ff66]">3 RESCUED</span>
      </div>

      <p className="text-xs text-[#9da3b4] leading-relaxed">
        Fourie caught these three digital monuments as they were slipping into the void. Each artifact is fully functional and interactive!
      </p>

      <div className="space-y-3">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-3.5 bg-[#0e1117] border border-white/10 rounded-xl space-y-2 hover:border-white/20 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-white/[0.04] border border-white/10">
                  {proj.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-white">{proj.title}</h4>
                  <span className="text-[10px] text-[#555c6d] font-mono">
                    {proj.year}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-white/[0.04] text-[#9da3b4] border border-white/10 px-2 py-0.5 rounded-full">
                {proj.tag}
              </span>
            </div>

            <p className="text-xs text-[#9da3b4] leading-relaxed">
              {proj.desc}
            </p>

            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={proj.action}
                className="px-3.5 py-1.5 bg-white text-black font-mono font-medium text-[11px] rounded-full hover:bg-[#00ff66] transition-colors flex items-center gap-1.5 group"
              >
                <span>{proj.actionLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
