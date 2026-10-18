import React, { useState } from "react";
import { findShortestPath, NetworkGraph, NetworkNode } from "../ds/dijkstra";
import { audio } from "../core/audio";
import { bus } from "../core/bus";
import { CheckCircle2 } from "lucide-react";

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
    name: "Fourie's Sanctuary",
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
    path.forEach((_, idx) => {
      setTimeout(() => {
        audio.note(523.25 + idx * 65, 0, 0.4, "sine", 0.25);
      }, idx * 220);
    });

    setTimeout(() => {
      audio.squeak();
      bus.emit("poke", { x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }, path.length * 220);
  };

  const isEdgeInPath = (from: string, to: string) => {
    const fromIdx = activePath.indexOf(from);
    return fromIdx !== -1 && activePath[fromIdx + 1] === to;
  };

  return (
    <section
      id="scene-router"
      className="relative min-h-[90dvh] w-full flex flex-col items-center justify-center p-6 text-center select-none bg-[#040404]"
    >
      <div className="max-w-3xl space-y-4 z-10 w-full px-4">
        {/* Editorial Section Index */}
        <div className="editorial-index justify-center">
          <span>06</span>
          <span>/</span>
          <span>Dijkstra Shortest Path · Packet Routing Graph</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
          Deliver the <span className="headline-serif">lost memory.</span>
        </h2>

        <p className="font-sans text-sm text-[#9da3b4] max-w-lg mx-auto leading-relaxed">
          When an old web realm goes to sleep, its memories float adrift. Tap any star below, and Fourie will find the optimal path across the network using Dijkstra's algorithm.
        </p>

        {/* Network Map Card */}
        <div className="w-full bg-[#090b10] border border-white/10 rounded-2xl p-5 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          <div className="flex items-center justify-between text-xs font-mono text-[#9da3b4] mb-3 border-b border-white/10 pb-3">
            <span className="flex items-center gap-2">
              <span className="status-dot"></span>
              <span>ORIGIN: {NODES[selectedOrigin]?.name}</span>
            </span>
            <span className="text-[#00ff66]">
              LATENCY: {pathLatency}ms ({activePath.length - 1} HOPS)
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
                      stroke={active ? "#00ff66" : "rgba(255, 255, 255, 0.12)"}
                      strokeWidth={active ? 3 : 1.5}
                      strokeDasharray={active ? "6 3" : undefined}
                      className={active ? "animate-pulse" : ""}
                    />
                    <text
                      x={(fromNode.x + toNode.x) / 2}
                      y={(fromNode.y + toNode.y) / 2 - 4}
                      fill={active ? "#00ff66" : "#555c6d"}
                      fontSize="9"
                      fontFamily="ui-monospace, monospace"
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
                    r={isTarget ? 22 : 16}
                    fill={isTarget ? "#00ff66" : isInPath ? "#00e5ff" : "rgba(255, 255, 255, 0.05)"}
                    opacity={isInPath ? 0.3 : 0.15}
                    className="group-hover:opacity-40 transition-opacity"
                  />

                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isTarget ? 14 : 11}
                    fill={isTarget ? "#00ff66" : isSelected ? "#ffffff" : "#0e1117"}
                    stroke={isTarget ? "#00ff66" : isInPath ? "#00e5ff" : "rgba(255, 255, 255, 0.2)"}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                  />

                  <text
                    x={node.x}
                    y={node.y + 3.5}
                    fill={isTarget ? "#040404" : isSelected ? "#040404" : "#ffffff"}
                    fontSize="7"
                    fontFamily="ui-monospace, monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    {isTarget ? "404" : node.era.slice(2)}
                  </text>

                  <text
                    x={node.x}
                    y={node.y + (node.y > 140 ? 24 : -16)}
                    fill={isInPath ? "#00ff66" : "#9da3b4"}
                    fontSize="9"
                    fontFamily="Space Grotesk, sans-serif"
                    textAnchor="middle"
                    className="pointer-events-none font-medium"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Path Details Bar */}
          <div className="mt-4 p-3 bg-white/[0.03] border border-white/10 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#9da3b4]">
            <div className="flex items-center gap-2 text-white">
              <CheckCircle2 className="w-4 h-4 text-[#00ff66]" />
              <span>
                ROUTE: {activePath.map((id) => NODES[id]?.name).join(" ➔ ")}
              </span>
            </div>

            <div className="text-[11px] text-[#00ff66]">
              MEMORIZED: {NODES[selectedOrigin]?.recoveredItem}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
