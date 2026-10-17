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
        // Play note for active row in this step
        SCALE.forEach((scaleItem, rowIndex) => {
          if (gridRef.current[rowIndex]?.[step]) {
            audio.note(scaleItem.freq, Math.max(0, nextTime - audio.now), 0.9, "sine", 0.3);
          }
        });

        setCurrentStep(step);
        nextTime += 60 / bpmRef.current / 2; // eighth notes
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
    <div className="space-y-4">
      {/* Sequencer Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-winborder retro-bevel">
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button
              type="button"
              onClick={stopPlayback}
              className="px-3 py-1.5 bg-red-600 text-white font-pixel text-xs retro-bevel active:retro-bevel-inset flex items-center gap-1.5"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startPlayback}
              className="px-3 py-1.5 bg-green-700 text-white font-pixel text-xs retro-bevel active:retro-bevel-inset flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Play Lullaby</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 ml-2 font-pixel text-[10px] text-ink">
            <span>BPM:</span>
            <input
              type="range"
              min="60"
              max="130"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-20 cursor-pointer"
            />
            <span className="w-6 text-right">{bpm}</span>
          </div>
        </div>

        {/* Preset buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => loadPreset("dialup")}
            className="px-2 py-1 text-[9px] font-pixel bg-white text-ink border border-gray-400 active:bg-gray-200"
          >
            Modem 56k
          </button>
          <button
            type="button"
            onClick={() => loadPreset("sleepy")}
            className="px-2 py-1 text-[9px] font-pixel bg-white text-ink border border-gray-400 active:bg-gray-200"
          >
            Sleepy Void
          </button>
          <button
            type="button"
            onClick={clearGrid}
            title="Clear All"
            className="p-1 bg-white text-ink border border-gray-400 active:bg-gray-200"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {muted && (
        <div className="p-1.5 bg-amber-100 text-amber-900 border border-amber-300 rounded text-xs flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-amber-600" />
          <span>Note: Sound is currently muted! Unmute at the top-right button to listen.</span>
        </div>
      )}

      {/* 16-Step Pentatonic Grid */}
      <div className="p-2 bg-void-900 rounded retro-bevel-inset overflow-x-auto">
        <div className="min-w-[340px] space-y-1">
          {SCALE.map((scaleItem, rowIdx) => (
            <div key={scaleItem.note} className="flex items-center gap-1">
              {/* Pitch Note Label */}
              <span className="w-7 text-[9px] font-pixel text-glitch-cyan select-none text-right pr-1">
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
                            ? "bg-white border-glitch-cyan shadow-[0_0_8px_#00f0ff]"
                            : "bg-glitch-cyan border-white"
                          : isCurrent
                          ? "bg-void-600 border-glitch-cyan"
                          : "bg-void-800 border-void-700 hover:border-gray-500"
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
      <div className="flex items-center gap-2 text-xs text-gray-700 italic font-display">
        <Sparkles className="w-4 h-4 text-glitch-amber flex-shrink-0" />
        <span>"Every modem handshake is just two computers singing a goodnight lullaby." — Fourie</span>
      </div>
    </div>
  );
};
