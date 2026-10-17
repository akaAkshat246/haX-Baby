import React, { useState } from "react";
import { audio } from "../core/audio";
import { bus } from "../core/bus";
import { Music, Radio, Sparkles, Volume2 } from "lucide-react";

export const DialUpScene: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "BEDTIME MUSIC BOX READY: Sportster 56K Lullaby Edition",
    "STATUS: COZY BEDROOM CARRIER ACTIVE",
    "LISTENING FOR FALLING NIGHT PACKETS...",
  ]);

  const handlePlayLullaby = async () => {
    if (playing) return;
    setPlaying(true);
    await audio.unlock();

    setLogs([
      "ATZ -> OK (NIGHT MODE ENGAGED)",
      "DIALING 1-800-404-LULLABY...",
      "WARMING UP BEDTIME CHIMES...",
    ]);

    audio.playDialUpSimulation();

    setTimeout(() => {
      setLogs((prev) => [...prev, "SWEET HARMONIC CARRIER DETECTED (392Hz + 523Hz)"]);
    }, 1200);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        "LULLABY RESOLUTION: 56,000 WARM BYTES DELIVERED",
        "PROTOCOL: COZY SLEEP // BABY FOURIE IS SMILING ✦",
      ]);
      setPlaying(false);
      bus.emit("poke", { x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }, 3000);
  };

  return (
    <section
      id="scene-dialup"
      className="relative min-h-[90dvh] w-full flex flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-b from-[#14112e] via-[#1a153c] to-[#161234]"
    >
      <div className="max-w-2xl space-y-4 z-10 w-full">
        <div className="inline-block px-3.5 py-1 bg-[#231d4e] border border-[#a89bf0]/50 text-[#c8bffd] font-pixel text-xs rounded-full uppercase">
          Era 1: 1995-1999 // The 56K Bedtime Lullaby
        </div>

        <h2 className="text-2xl sm:text-4xl font-pixel text-[#ffffff] tracking-wide drop-shadow">
          THE MODEM LULLABY
        </h2>

        <p className="font-display text-sm text-[#c8bffd] max-w-lg mx-auto leading-relaxed">
          Back when the whole world went quiet at night, dial-up modems sang in the dark like little glowing music boxes. Whenever someone accidentally picked up the landline, Fourie caught the sleepy dropped packets and tucked them into bed.
        </p>

        {/* Soothing Terminal Box */}
        <div className="w-full bg-[#120f2c] border-3 border-[#7c6fd6] rounded-2xl p-5 text-left font-mono text-xs shadow-[0_12px_36px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#30285a] pb-2.5 mb-3">
            <span className="flex items-center gap-2 text-[#ffd97a] font-pixel text-[10px]">
              <Music className="w-3.5 h-3.5" />
              <span>DIAL-UP LULLABY EMULATOR</span>
            </span>
            <span className="text-[10px] text-[#a89bf0] font-pixel">56K SOOTHING HARMONICS</span>
          </div>

          <div className="space-y-1.5 text-[#a3f7bf] min-h-[90px] text-[11px]">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-[#655896]">&gt;</span>
                <span className={i === logs.length - 1 ? "animate-pulse" : ""}>
                  {log}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3.5 border-t border-[#26204c] flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              disabled={playing}
              onClick={handlePlayLullaby}
              className={`px-5 py-2.5 font-pixel text-xs rounded-xl transition-all flex items-center gap-2 ${
                playing
                  ? "bg-[#2d2556] text-[#786b9e] cursor-not-allowed"
                  : "bg-gradient-to-r from-[#ffd97a] to-[#ff9ec0] text-[#1c1838] font-bold hover:scale-105 active:scale-95 shadow-[0_4px_16px_rgba(255,217,122,0.4)]"
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#1c1838]" />
              <span>{playing ? "Playing Lullaby..." : "Listen to Bedtime Modem"}</span>
            </button>

            <span className="text-[10px] font-pixel text-[#ffd97a] flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-[#ff9ec0]" />
              <span>Procedural Web Audio Celesta</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
