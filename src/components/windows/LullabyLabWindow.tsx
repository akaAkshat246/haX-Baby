import React, { useState, useEffect, useRef } from "react";
import { audio } from "../../core/audio";
import { useStore } from "../../core/store";
import { Play, Square, RotateCcw, Volume2, Sparkles } from "lucide-react";

const SCALE = [
  { note: "C5", freq: 523.25 },
  { note: "A4", freq: 440.0 },
  { note: "G4", freq: 392.0 },
  { note: "E4", freq: 329.63 },
  { note: "D4", freq: 293.66 },
  { note: "C4", freq: 261.63 },
];

const STEPS = 16;

const PRESETS: Record<string, boolean[][]> = {
  dialup: [
    [false, false, true, false, false, false, true, false, false, true, false, false, true, false, false, true],
    [false, true, false, false, false, true, false, false, true, false, false, true, false, false, true, false],
    [true, false, false, true, false, false, false, true, false, false, true, false, false, true, false, false],
    [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
    [false, false, true, false, false, false, true, false, false, false, false, true, false, false, false, false],
    [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
  ],
  sleepy: [
    [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
    [false, false, true, false, false, false, false, false, false, false, true, false, false, false, false, false],
    [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
    [false, false, false, false, false, false, true, false, false, false, false, false, false, false, true, false],
    [false, true, false, false, false, false, false, false, false, true, false, false, false, false, false, false],
    [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
  ],
};

export const LullabyLabWindow: React.FC = () => {
  const [grid, setGrid] = useState<boolean[][]>(() => PRESETS.dialup);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(88);
  const muted = useStore((s) => s.muted);

  const isPlayingRef = useRef(false);
  const gridRef = useRef(grid);
  const bpmRef = useRef(bpm);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  const stopPlayback = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    isPlayingRef.current = false;
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const startPlayback = async () => {
    await audio.unlock();
    stopPlayback();

    isPlayingRef.current = true;
    setIsPlaying(true);

    let step = 0;
    let nextTime = audio.now + 0.05;

    timerRef.current = window.setInterval(() => {
      if (!isPlayingRef.current) return;

      while (nextTime < audio.now + 0.12) {
        SCALE.forEach((scaleItem, rowIndex) => {
          if (gridRef.current[rowIndex]?.[step]) {
            audio.note(scaleItem.freq, Math.max(0, nextTime - audio.now), 0.9, "sine", 0.3);
          }
        });

        setCurrentStep(step);
        nextTime += 60 / bpmRef.current / 2;
        step = (step + 1) % STEPS;
      }
    }, 25);
  };

  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  const toggleCell = (row: number, col: number) => {
    audio.click();
    setGrid((prev) => {
      const next = prev.map((r, rIdx) =>
        r.map((val, cIdx) => (rIdx === row && cIdx === col ? !val : val))
      );
      return next;
    });
  };

  const loadPreset = (name: "dialup" | "sleepy") => {
    audio.click();
    setGrid(PRESETS[name]);
  };

  const clearGrid = () => {
    audio.click();
    setGrid(SCALE.map(() => Array(STEPS).fill(false)));
  };

  return (
    <div className="space-y-4 font-sans text-sm">
      {/* Sequencer Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 bg-[#0e1117] rounded-xl border border-white/10">
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button
              type="button"
              onClick={stopPlayback}
              className="px-3.5 py-1.5 bg-[#ff3366] text-white font-mono text-xs rounded-full flex items-center gap-1.5 font-medium hover:bg-[#ff4d79] transition-colors"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startPlayback}
              className="px-3.5 py-1.5 bg-[#00ff66] text-black font-mono text-xs rounded-full flex items-center gap-1.5 font-medium hover:bg-[#00f59b] transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Play Lullaby</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 ml-2 font-mono text-xs text-[#9da3b4]">
            <span>BPM:</span>
            <input
              type="range"
              min="60"
              max="130"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-18 cursor-pointer accent-[#00ff66]"
            />
            <span className="w-6 text-right text-white">{bpm}</span>
          </div>
        </div>

        {/* Preset buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => loadPreset("dialup")}
            className="px-2.5 py-1 text-[11px] font-mono bg-white/[0.04] text-[#9da3b4] border border-white/10 rounded-full hover:text-white hover:border-white/25 transition-colors"
          >
            56k Modem
          </button>
          <button
            type="button"
            onClick={() => loadPreset("sleepy")}
            className="px-2.5 py-1 text-[11px] font-mono bg-white/[0.04] text-[#9da3b4] border border-white/10 rounded-full hover:text-white hover:border-white/25 transition-colors"
          >
            Sleepy Void
          </button>
          <button
            type="button"
            onClick={clearGrid}
            title="Clear All"
            className="p-1.5 bg-white/[0.04] text-[#9da3b4] border border-white/10 rounded-full hover:text-white hover:border-white/25 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {muted && (
        <div className="p-2 bg-[#ffb703]/10 text-[#ffb703] border border-[#ffb703]/30 rounded-xl text-xs flex items-center gap-2 font-mono">
          <Volume2 className="w-4 h-4 flex-shrink-0" />
          <span>Note: Sound is currently muted! Unmute at the top-right button to listen.</span>
        </div>
      )}

      {/* 16-Step Pentatonic Grid */}
      <div className="p-3 bg-[#090b10] rounded-xl border border-white/10 overflow-x-auto">
        <div className="min-w-[340px] space-y-1.5">
          {SCALE.map((scaleItem, rowIdx) => (
            <div key={scaleItem.note} className="flex items-center gap-1.5">
              {/* Pitch Note Label */}
              <span className="w-7 text-[10px] font-mono text-[#00ff66] select-none text-right pr-1">
                {scaleItem.note}
              </span>

              {/* 16 Beat Triggers */}
              <div className="flex-1 grid grid-cols-16 gap-1">
                {Array.from({ length: STEPS }).map((_, stepIdx) => {
                  const active = grid[rowIdx]?.[stepIdx];
                  const isCurrent = isPlaying && currentStep === stepIdx;

                  return (
                    <button
                      key={stepIdx}
                      type="button"
                      aria-label={`${scaleItem.note} at step ${stepIdx + 1}`}
                      onClick={() => toggleCell(rowIdx, stepIdx)}
                      className={`h-5 rounded-sm transition-all border ${
                        active
                          ? isCurrent
                            ? "bg-white border-[#00ff66] shadow-[0_0_8px_#00ff66]"
                            : "bg-[#00ff66] border-[#00ff66]"
                          : isCurrent
                          ? "bg-white/20 border-white/40"
                          : "bg-white/[0.02] border-white/10 hover:border-white/30"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Microcopy in Fourie's voice */}
      <div className="flex items-center gap-2 text-xs text-[#9da3b4] italic">
        <Sparkles className="w-4 h-4 text-[#00ff66] flex-shrink-0" />
        <span>"Every modem handshake is just two computers singing a goodnight lullaby." — Fourie</span>
      </div>
    </div>
  );
};
