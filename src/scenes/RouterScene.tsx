import React, { useState } from "react";
import { findShortestPath, NetworkGraph, NetworkNode } from "../ds/dijkstra";
import { audio } from "../core/audio";
import { bus } from "../core/bus";
import { CheckCircle2, Moon, Sparkles } from "lucide-react";

const NODES: Record<string, NetworkNode> = {
  dns: {
    id: "dns",
    name: "ARPANET Cradle",
    era: "1995",
    x: 60,
    y: 80,
    description: "Where early digital memories took their first steps.",
    recoveredItem: "Original .com record",
  },
  usenet: {
    id: "usenet",
    name: "Usenet Whispers",
    era: "1997",
    x: 220,
    y: 40,
    description: "Late-night discussion threads among friends.",
    recoveredItem: "ASCII star art",
  },
  geocities: {
    id: "geocities",
    name: "GeoCities Garden",
    era: "1999",
    x: 180,
    y: 180,
    description: "Handcrafted webring page neighborhood.",
    recoveredItem: "Glittering star GIF",
  },
  wayback: {
    id: "wayback",
    name: "Wayback Archive",
    era: "2001",
    x: 340,
    y: 60,
    description: "The giant photo album preserving the web.",
    recoveredItem: "Old blog bedtime story",
  },
  flash: {
    id: "flash",
    name: "Flash Cloud Castle",
    era: "2004",
    x: 360,
    y: 190,
    description: "Whimsical interactive cartoons and games.",
    recoveredItem: "Vector music animation",
  },
  sanctuary: {
    id: "sanctuary",
    name: "Fourie's Cozy Crib",
    era: "Present",
    x: 480,
    y: 120,
    description: "The warm final haven where lost memories rest.",
    recoveredItem: "Golden Floppy Disk",
  },
};

const GRAPH: NetworkGraph = {
  dns: [
    { to: "usenet", weight: 32 },
    { to: "geocities", weight: 24 },
  ],
  usenet: [
    { to: "wayback", weight: 45 },
    { to: "geocities", weight: 18 },
  ],
  geocities: [
    { to: "flash", weight: 50 },
    { to: "wayback", weight: 28 },
  ],
  wayback: [
    { to: "sanctuary", weight: 22 },
    { to: "flash", weight: 15 },
  ],
  flash: [
    { to: "sanctuary", weight: 19 },
  ],
  sanctuary: [],
};

export const RouterScene: React.FC = () => {
  const [selectedOrigin, setSelectedOrigin] = useState<string>("dns");
  const [activePath, setActivePath] = useState<string[]>(["dns", "geocities", "wayback", "sanctuary"]);
  const [pathLatency, setPathLatency] = useState<number>(74);

  const handleSelectNode = async (nodeId: string) => {
    if (nodeId === "sanctuary") return;
    audio.click();
    setSelectedOrigin(nodeId);

    const { path, distance } = findShortestPath(GRAPH, nodeId, "sanctuary");
    setActivePath(path);
    setPathLatency(distance);

    await audio.unlock();
    // Play sweet music-box notes for each hop
    path.forEach((_, idx) => {
      setTimeout(() => {
        audio.note(523.25 + idx * 65, 0, 0.4, "sine", 0.25);
      }, idx * 260);
    });

    setTimeout(() => {
      audio.squeak();
      bus.emit("poke", { x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }, path.length * 260);
  };

  const isEdgeInPath = (from: string, to: string) => {
    const fromIdx = activePath.indexOf(from);
    return fromIdx !== -1 && activePath[fromIdx + 1] === to;
  };

  return (
    <section
      id="scene-router"
      className="relative min-h-[90dvh] w-full flex flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-b from-[#13102a] via-[#1b153d] to-[#120f28]"
    >
      <div className="max-w-3xl space-y-4 z-10 w-full">
        <div className="inline-block px-3.5 py-1 bg-[#231d4e] border border-[#a89bf0]/50 text-[#ffd97a] font-pixel text-xs rounded-full uppercase">
          Artifact 3 // The Starry Delivery Map (Dijkstra Algo)
        </div>

        <h2 className="text-2xl sm:text-4xl font-pixel text-[#ffffff] tracking-wide drop-shadow">
          DELIVER THE LOST MEMORY
        </h2>

        <p className="font-display text-sm text-[#c8bffd] max-w-lg mx-auto leading-relaxed">
          When an old web realm goes to sleep, its sweet memories float adrift. Tap any star below, and Fourie will find the shortest path across the night sky to tuck it into bed!
        </p>

        {/* Soothing Network SVG Map */}
        <div className="w-full bg-[#151132] border-3 border-[#7c6fd6] rounded-2xl p-4 relative overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between text-[10px] font-pixel text-[#c8bffd] mb-3 border-b border-[#2d2558] pb-2.5">
            <span>STARTING REALM: {NODES[selectedOrigin]?.name}</span>
            <span className="text-[#ffd97a]">
              PATH TIME: {pathLatency}ms ({activePath.length - 1} HOPS)
            </span>
          </div>

          <svg
            viewBox="0 0 540 250"
            className="w-full h-auto overflow-visible select-none"
          >
            {/* Soft Starry Cable Lines */}
            {Object.entries(GRAPH).flatMap(([fromId, edges]) => {
              const fromNode = NODES[fromId];
              return edges.map((edge) => {
                const toNode = NODES[edge.to];
                const active = isEdgeInPath(fromId, edge.to);

                return (
                  <g key={`${fromId}-${edge.to}`}>
                    <line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={active ? "#ffd97a" : "#322a5e"}
                      strokeWidth={active ? 3.5 : 1.8}
                      strokeDasharray={active ? "6 3" : undefined}
                      className={active ? "animate-pulse" : ""}
                    />
                    <text
                      x={(fromNode.x + toNode.x) / 2}
                      y={(fromNode.y + toNode.y) / 2 - 4}
                      fill={active ? "#ffd97a" : "#655896"}
                      fontSize="8"
                      fontFamily="'Press Start 2P', monospace"
                      textAnchor="middle"
                    >
                      {edge.weight}ms
                    </text>
                  </g>
                );
              });
            })}

            {/* Star Nodes */}
            {Object.values(NODES).map((node) => {
              const isSelected = selectedOrigin === node.id;
              const isInPath = activePath.includes(node.id);
              const isTarget = node.id === "sanctuary";

              return (
                <g
                  key={node.id}
                  className="cursor-pointer group"
                  onClick={() => handleSelectNode(node.id)}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isTarget ? 24 : 18}
                    fill={isTarget ? "#ffd97a" : isInPath ? "#ff9ec0" : "#241d48"}
                    opacity={isInPath ? 0.35 : 0.2}
                    className="group-hover:opacity-50 transition-opacity"
                  />

                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isTarget ? 15 : 12}
                    fill={isTarget ? "#7c6fd6" : isSelected ? "#ffd97a" : "#19143a"}
                    stroke={isTarget ? "#ffd97a" : isInPath ? "#ff9ec0" : "#5a4d8c"}
                    strokeWidth={isSelected ? 3 : 2}
                  />

                  <text
                    x={node.x}
                    y={node.y + 3.5}
                    fill="#ffffff"
                    fontSize="7"
                    fontFamily="'Press Start 2P', monospace"
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    {isTarget ? "404" : node.era.slice(2)}
                  </text>

                  <text
                    x={node.x}
                    y={node.y + (node.y > 140 ? 25 : -18)}
                    fill={isInPath ? "#ffd97a" : "#a89bf0"}
                    fontSize="8.5"
                    fontFamily="'Press Start 2P', monospace"
                    textAnchor="middle"
                    className="pointer-events-none font-bold"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Path Details Bar */}
          <div className="mt-3.5 p-3 bg-[#1e1846] rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs font-display text-[#c8bffd]">
            <div className="flex items-center gap-2 font-pixel text-[10px] text-[#ffd97a]">
              <CheckCircle2 className="w-4 h-4 text-[#ffd97a]" />
              <span>
                ROUTE: {activePath.map((id) => NODES[id]?.name).join(" ➔ ")}
              </span>
            </div>

            <div className="font-pixel text-[9px] text-[#ffccd5]">
              MEMORIZED: {NODES[selectedOrigin]?.recoveredItem}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
