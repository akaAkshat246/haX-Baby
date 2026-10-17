import React, { useState } from "react";
import { audio } from "../core/audio";
import { bus } from "../core/bus";
import { PhoneCall, Radio, Terminal, Volume2 } from "lucide-react";

export const DialUpScene: React.FC = () => {
  const [dialing, setDialing] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "MODEM READY: USRobotics Sportster 56K Faxmodem",
    "PORT: COM2 / SPEED: 115200 BAUD",
    "AWAITING CARRIER SIGNAL...",
  ]);

  const handleDial = async () => {
    if (dialing) return;
    setDialing(true);
    await audio.unlock();

    setLogs([
      "ATZ -> OK",
      "ATDT 1-800-404-LOST...",
      "DIALING CARRIER NUMBER...",
    ]);

    audio.playDialUpSimulation();

    setTimeout(() => {
      setLogs((prev) => [...prev, "BEEP... BOOP... HIGH PITCH CARRIER (1200Hz) DETECTED"]);
    }, 1200);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        "CARRIER HANDSHAKE: V.90 56,000 BPS NEGOTIATED",
        "PROTOCOL: LAPM / COMPRESSION: V.42bis",
        "CONNECT 56000! ONLINE IN CYBERSPACE ✦",
      ]);
      setDialing(false);
      bus.emit("poke", { x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }, 3200);
  };

  return (
    <section
      id="scene-dialup"
      className="relative min-h-[90dvh] w-full flex flex-col items-center justify-center p-6 text-center select-none"
    >
      <div className="max-w-2xl space-y-4 z-10 w-full">
        <div className="inline-block px-3 py-1 bg-void-800 border border-glitch-cyan text-glitch-cyan font-pixel text-xs rounded uppercase">
          Era 1: 1995-1999 // The Dial-Up Age
        </div>

        <h2 className="text-2xl sm:text-4xl font-pixel text-paper tracking-wide">
          THE 56K HANDSHAKE
        </h2>

        <p className="font-display text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
          Before fiber-optics, the internet breathed through copper telephone lines. Fourie was lulled to sleep by the screech of dial-up modems singing in the dark. Whenever someone picked up the house phone and severed the link, Fourie caught the dropped packets.
        </p>

        {/* Retro CRT Terminal Box */}
        <div className="w-full bg-black border-4 border-winborder rounded p-4 text-left font-mono text-xs shadow-[0_0_20px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* CRT scanline highlight */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-glitch-green/5 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between border-b border-gray-700 pb-2 mb-3">
            <span className="flex items-center gap-1.5 text-glitch-green font-pixel text-[10px]">
              <Terminal className="w-3.5 h-3.5" />
              <span>TERMINAL DIAL-UP EMULATOR</span>
            </span>
            <span className="text-[10px] text-gray-500 font-pixel">COM2: 56K</span>
          </div>

          <div className="space-y-1 text-glitch-green min-h-[100px] text-[11px]">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-gray-600">&gt;</span>
                <span className={i === logs.length - 1 ? "animate-pulse" : ""}>
                  {log}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-800 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              disabled={dialing}
              onClick={handleDial}
              className={`px-4 py-2 font-pixel text-xs rounded transition-all flex items-center gap-2 ${
                dialing
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-glitch-cyan text-ink hover:bg-white active:scale-95 shadow-[0_0_12px_rgba(0,240,255,0.4)]"
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>{dialing ? "Dialing Carrier..." : "Dial 56K Modem"}</span>
            </button>

            <span className="text-[10px] font-pixel text-gray-400 flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-glitch-amber" />
              <span>Procedural Web Audio Synth</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
