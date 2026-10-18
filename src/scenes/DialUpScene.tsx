import React, { useState } from "react";
import { audio } from "../core/audio";
import { bus } from "../core/bus";
import { Music, ArrowUpRight, Volume2 } from "lucide-react";

export const DialUpScene: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "BEDTIME MUSIC BOX READY: Sportster 56K Lullaby Edition",
    "STATUS: BEDROOM CARRIER ACTIVE",
    "LISTENING FOR FALLING NIGHT PACKETS...",
  ]);

  const handlePlayLullaby = async () => {
    if (playing) return;
    setPlaying(true);
    await audio.unlock();

    setLogs([
      "ATZ -> OK (NIGHT MODE ENGAGED)",
      "DIALING 1-800-404-LULLABY...",
      "WARMING UP WEBAUDIO PENTATONIC CHIMES...",
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
      className="relative min-h-[90dvh] w-full flex flex-col items-center justify-center p-6 text-center select-none bg-[#040404]"
    >
      <div className="max-w-3xl space-y-4 z-10 w-full px-4">
        {/* Editorial Section Index */}
        <div className="editorial-index justify-center">
          <span>02</span>
          <span>/</span>
          <span>1995-1999 · The 56K Modem Lullaby</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
          The sound of <span className="headline-serif">bedtime dial-up.</span>
        </h2>

        <p className="font-sans text-sm text-[#9da3b4] max-w-lg mx-auto leading-relaxed">
          Back when the whole house went quiet at night, modems sang in the dark like little glowing music boxes. Whenever someone accidentally picked up the landline, Fourie caught the dropped packets and tucked them into bed.
        </p>

        {/* haX Baby Style 3D Terminal Card */}
        <div className="build-window w-full max-w-2xl mx-auto pt-2">
          <div className="build-window-inner bg-[#090b10] border border-white/10 rounded-2xl p-5 text-left font-mono text-xs shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden">
            {/* Window Bar with 3 Dots */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3.5">
              <div className="flex items-center gap-3">
                <div className="win__dots">
                  <span className="win__dot win__dot--close" />
                  <span className="win__dot win__dot--min" />
                  <span className="win__dot win__dot--max" />
                </div>
                <span className="flex items-center gap-2 text-white/90 text-xs font-medium">
                  <Music className="w-3.5 h-3.5 text-[#00ff66]" />
                  <span>MODEM_LULLABY.EMU</span>
                </span>
              </div>
              <span className="text-[11px] text-[#555c6d] font-mono">56K PROCEDURAL SYNTH</span>
            </div>

            {/* Terminal Feed */}
            <div className="space-y-2 text-[#00ff66] min-h-[96px] text-xs">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-[#555c6d]">&gt;</span>
                  <span className={i === logs.length - 1 ? "animate-pulse" : "text-white/80"}>
                    {log}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Actions Row */}
            <div className="mt-5 pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                disabled={playing}
                onClick={handlePlayLullaby}
                className={`hax-button-primary group ${
                  playing ? "!bg-white/20 !text-[#9da3b4] cursor-not-allowed" : ""
                }`}
              >
                <span>{playing ? "Playing 56K Lullaby..." : "Listen to Bedtime Modem"}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <span className="text-[11px] font-mono text-[#9da3b4] flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#00ff66]" />
                <span>Web Audio Sinusoidal Celesta</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
