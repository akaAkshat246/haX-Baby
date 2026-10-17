import React, { useState } from "react";
import { findShortestPath, NetworkGraph, NetworkNode } from "../ds/dijkstra";
import { audio } from "../core/audio";
import { bus } from "../core/bus";
import { Network, Send, Zap, CheckCircle2 } from "lucide-react";

const NODES: Record<string, NetworkNode> = {
  dns: {
    id: "dns",
    name: "DNS Root Server",
    era: "1995",
    x: 60,
    y: 80,
    description: "The primary catalog of early domain names.",
    recoveredItem: "Original .com record",
  },
  usenet: {
    id: "usenet",
    name: "Usenet alt.binaries",
    era: "1997",
    x: 220,
    y: 40,
    description: "Decentralized discussion and file exchange threads.",
    recoveredItem: "ASCII art manifesto",
  },
  geocities: {
    id: "geocities",
    name: "GeoCities SoHo",
    era: "1999",
    x: 180,
    y: 180,
    description: "Handcrafted webring page neighborhood.",
    recoveredItem: "Spinning skull GIF",
  },
  wayback: {
    id: "wayback",
    name: "Wayback Machine",
    era: "2001",
    x: 340,
    y: 60,
    description: "Snapshot web crawlers indexing the past.",
    recoveredItem: "Archived fan-shrine HTML",
  },
  flash: {
    id: "flash",
    name: "Flash Game Hub",
    era: "2004",
    x: 360,
    y: 190,
    description: "Interactive vector animations and mini-games.",
    recoveredItem: "Alien Hominid demo .swf",
  },
  sanctuary: {
    id: "sanctuary",
    name: "Fourie's 404 Desk",
    era: "Present",
    x: 480,
    y: 120,
    description: "The final safe haven for all lost packets.",
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
  const [isRouting, setIsRouting] = useState(false);

  const handleSelectNode = async (nodeId: string) => {
    if (nodeId === "sanctuary") return;
    audio.click();
    setSelectedOrigin(nodeId);
    setIsRouting(true);

    const { path, distance } = findShortestPath(GRAPH, nodeId, "sanctuary");
    setActivePath(path);
    setPathLatency(distance);

    await audio.unlock();
    // Play step chime for each hop
    path.forEach((_, idx) => {
      setTimeout(() => {
        audio.note(440 + idx * 80, 0, 0.2, "triangle", 0.25);
      }, idx * 250);
    });

    setTimeout(() => {
      setIsRouting(false);
      audio.squeak();
      bus.emit("poke", { x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }, path.length * 250);
  };

  const isEdgeInPath = (from: string, to: string) => {
    const fromIdx = activePath.indexOf(from);
    return fromIdx !== -1 && activePath[fromIdx + 1] === to;
  };

  return (
    <section
      id="scene-router"
      className="relative min-h-[90dvh] w-full flex flex-col items-center justify-center p-6 text-center select-none"
    >
      <div className="max-w-3xl space-y-4 z-10 w-full">
        <div className="inline-block px-3 py-1 bg-void-800 border border-glitch-green text-glitch-green font-pixel text-xs rounded uppercase">
          Artifact 3 // Dijkstra Packet Recovery Router
        </div>

        <h2 className="text-2xl sm:text-4xl font-pixel text-paper tracking-wide">
          ROUTE THE LOST PACKET
        </h2>

        <p className="font-display text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
          When an old web server drops offline, its packets get stranded in the network. Tap any origin server below, and Fourie's Dijkstra algorithm will find the lowest-latency path to deliver it home!
        </p>

        {/* Network SVG Interactive Map */}
        <div className="w-full bg-void-900 border-4 border-winborder rounded-lg p-3 relative overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between text-[10px] font-pixel text-gray-400 mb-2 border-b border-gray-800 pb-2">
            <span>SELECTED ORIGIN: {NODES[selectedOrigin]?.name}</span>
            <span className="text-glitch-cyan">
              PATH LATENCY: {pathLatency}ms ({activePath.length - 1} HOPS)
            </span>
          </div>

          <svg
            viewBox="0 0 540 250"
            className="w-full h-auto overflow-visible select-none"
          >
            {/* Network Cable Lines */}
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
                      stroke={active ? "#00ff66" : "#2d325a"}
                      strokeWidth={active ? 3.5 : 1.5}
                      strokeDasharray={active ? "6 3" : undefined}
                      className={active ? "animate-pulse" : ""}
                    />
                    {/* Cable Weight Label */}
                    <text
                      x={(fromNode.x + toNode.x) / 2}
                      y={(fromNode.y + toNode.y) / 2 - 4}
                      fill={active ? "#00ff66" : "#60668a"}
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

            {/* Server Nodes */}
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
                  {/* Outer pulse circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isTarget ? 22 : 18}
                    fill={isTarget ? "#00f0ff" : isInPath ? "#00ff66" : "#1a1e38"}
                    opacity={isInPath ? 0.3 : 0.15}
                    className="group-hover:opacity-40 transition-opacity"
                  />

                  {/* Core Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isTarget ? 15 : 12}
                    fill={isTarget ? "#000080" : isSelected ? "#ffb703" : "#0c0d1e"}
                    stroke={isTarget ? "#00f0ff" : isInPath ? "#00ff66" : "#4a5180"}
                    strokeWidth={isSelected ? 3 : 2}
                  />

                  {/* Node icon label */}
                  <text
                    x={node.x}
                    y={node.y + 3}
                    fill="#ffffff"
                    fontSize="7"
                    fontFamily="'Press Start 2P', monospace"
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    {isTarget ? "404" : node.era.slice(2)}
                  </text>

                  {/* Node Name Title */}
                  <text
                    x={node.x}
                    y={node.y + (node.y > 140 ? 25 : -18)}
                    fill={isInPath ? "#ffffff" : "#9ca3af"}
                    fontSize="8"
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
          <div className="mt-3 p-2 bg-void-800 rounded flex flex-wrap items-center justify-between gap-2 text-xs font-display text-gray-300">
            <div className="flex items-center gap-1.5 font-pixel text-[10px]">
              <CheckCircle2 className="w-4 h-4 text-glitch-green" />
              <span>
                ROUTE: {activePath.map((id) => NODES[id]?.name).join(" ➔ ")}
              </span>
            </div>

            <div className="font-pixel text-[9px] text-glitch-amber">
              RESCUED: {NODES[selectedOrigin]?.recoveredItem}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
