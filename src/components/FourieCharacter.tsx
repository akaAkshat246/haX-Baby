import React, { useState, useRef } from "react";
import { useStore } from "../core/store";
import { bus } from "../core/bus";
import { audio } from "../core/audio";
import { useEyes } from "../hooks/useEyes";

interface FourieProps {
  size?: number | string;
  interactive?: boolean;
  className?: string;
}

export const FourieCharacter: React.FC<FourieProps> = ({
  size = "var(--fourie-size, 210px)",
  interactive = true,
  className = "",
}) => {
  const mood = useStore((s) => s.mood);
  const sendMood = useStore((s) => s.sendMood);
  const pupilsRef = useEyes(10);
  const [tapCount, setTapCount] = useState(0);
  const lastTapRef = useRef(0);
  const [isWiggling, setIsWiggling] = useState(false);

  const handlePoke = (e: React.PointerEvent) => {
    if (!interactive) return;

    // Haptic feedback for Android
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(15);
      } catch {}
    }

    // Play cute procedural sound
    audio.squeak();

    // Trigger wiggle animation
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 450);

    // Emit event bus for sparkles & mood
    const rect = e.currentTarget.getBoundingClientRect();
    bus.emit("poke", {
      x: e.clientX || rect.left + rect.width / 2,
      y: e.clientY || rect.top + rect.height / 2,
    });

    sendMood("POKE");
  };

  const handleAntennaTap = (e: React.PointerEvent) => {
    e.stopPropagation();
    const now = performance.now();
    const prev = lastTapRef.current;
    lastTapRef.current = now;

    const count = now - prev < 700 ? tapCount + 1 : 1;
    setTapCount(count);

    audio.glitch();
    bus.emit("poke", { x: e.clientX, y: e.clientY });

    if (count >= 5) {
      setTapCount(0);
      bus.emit("secret", undefined);
      useStore.getState().unlockSecret();
    }
  };

  return (
    <div
      role="img"
      aria-label={`Fourie the 404 spirit, currently ${mood}`}
      style={{ width: size, height: size }}
      className={`relative select-none transition-transform duration-300 ${
        isWiggling ? "scale-105 rotate-2" : ""
      } ${className}`}
      onPointerDown={handlePoke}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full overflow-visible drop-shadow-[0_8px_24px_rgba(0,240,255,0.25)]"
      >
        <defs>
          {/* Holographic Body Gradient */}
          <radialGradient id="bodyGlow" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#1e2246" />
            <stop offset="60%" stopColor="#101228" />
            <stop offset="100%" stopColor="#070712" />
          </radialGradient>

          {/* Outer Cyan Aura */}
          <filter id="neonAura" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Glitch RGB Split */}
          <filter id="rgbGlitch">
            <feOffset dx="-2" dy="0" result="red" />
            <feOffset dx="2" dy="0" result="blue" />
            <feBlend mode="screen" in="SourceGraphic" in2="red" />
          </filter>
        </defs>

        {/* Ambient Pulsing Glow Circle */}
        <circle
          cx="100"
          cy="110"
          r="72"
          fill="#00f0ff"
          opacity={mood === "glitching" ? 0.35 : 0.15}
          className="animate-pulse"
        />

        {/* Soft Shadow under Fourie */}
        <ellipse cx="100" cy="180" rx="48" ry="10" fill="#000000" opacity="0.45" />

        {/* Antenna Stem */}
        <path
          d="M 100 50 Q 94 30 100 16"
          fill="none"
          stroke="#00f0ff"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Antenna LED / Packet Receiver (Tap 5x for Easter Egg) */}
        <g
          className="cursor-pointer group"
          onPointerDown={handleAntennaTap}
        >
          <circle
            cx="100"
            cy="14"
            r="12"
            fill="transparent"
          />
          <circle
            cx="100"
            cy="14"
            r="7"
            fill={mood === "glitching" ? "#ff007f" : "#ffb703"}
            stroke="#00f0ff"
            strokeWidth="2"
            className="transition-colors animate-pulse"
          />
          {/* Radiating Antenna Ping Waves */}
          <circle
            cx="100"
            cy="14"
            r="12"
            fill="none"
            stroke="#ffb703"
            strokeWidth="1"
            opacity="0.4"
            className="animate-ping"
          />
        </g>

        {/* Main Body: Soft rounded pixel-cornered digital ghost */}
        <g filter={mood === "glitching" ? "url(#rgbGlitch)" : undefined}>
          <rect
            x="48"
            y="48"
            width="104"
            height="112"
            rx="32"
            fill="url(#bodyGlow)"
            stroke="#00f0ff"
            strokeWidth="2.5"
          />

          {/* Internal subtle CRT circuit lines */}
          <line x1="56" y1="80" x2="144" y2="80" stroke="#00f0ff" strokeWidth="0.5" opacity="0.15" />
          <line x1="56" y1="110" x2="144" y2="110" stroke="#00f0ff" strokeWidth="0.5" opacity="0.15" />
          <line x1="56" y1="140" x2="144" y2="140" stroke="#00f0ff" strokeWidth="0.5" opacity="0.15" />

          {/* Emotive Cheeks (Blushing) */}
          <circle cx="68" cy="116" r="6" fill="#ff007f" opacity={mood === "shy" ? 0.75 : 0.35} />
          <circle cx="132" cy="116" r="6" fill="#ff007f" opacity={mood === "shy" ? 0.75 : 0.35} />

          {/* Eyes Sockets */}
          <ellipse cx="78" cy="94" rx="14" ry="16" fill="#070712" stroke="#00f0ff" strokeWidth="1.5" />
          <ellipse cx="122" cy="94" rx="14" ry="16" fill="#070712" stroke="#00f0ff" strokeWidth="1.5" />

          {/* Animated Moving Pupils (Track pointer & touch) */}
          <g ref={pupilsRef} id="fourie-pupils">
            {mood !== "sleepy" ? (
              <>
                {/* Left Eye Pupil */}
                <circle cx="78" cy="94" r="7" fill="#00f0ff" />
                <circle cx="76" cy="91" r="2.5" fill="#ffffff" />

                {/* Right Eye Pupil */}
                <circle cx="122" cy="94" r="7" fill="#00f0ff" />
                <circle cx="120" cy="91" r="2.5" fill="#ffffff" />
              </>
            ) : null}
          </g>

          {/* Sleepy / Eyelids Overlays based on FSM Mood */}
          {mood === "sleepy" && (
            <g>
              {/* Closed curved sleepy lines */}
              <path
                d="M 68 96 Q 78 106 88 96"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 112 96 Q 122 106 132 96"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Floating 'Zzz' */}
              <text x="142" y="72" fill="#ffb703" fontFamily="'Press Start 2P', monospace" fontSize="11" opacity="0.85">Z</text>
              <text x="156" y="56" fill="#ffb703" fontFamily="'Press Start 2P', monospace" fontSize="8" opacity="0.65">z</text>
            </g>
          )}

          {mood === "happy" && (
            /* Happy upward crescents */
            <g>
              <path
                d="M 67 96 Q 78 86 89 96"
                fill="none"
                stroke="#ffb703"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 111 96 Q 122 86 133 96"
                fill="none"
                stroke="#ffb703"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Cute Mouth */}
          {mood === "happy" ? (
            <path
              d="M 92 118 Q 100 128 108 118"
              fill="#ff007f"
              stroke="#00f0ff"
              strokeWidth="1.5"
            />
          ) : mood === "sleepy" ? (
            <ellipse cx="100" cy="119" rx="3" ry="2" fill="#00f0ff" opacity="0.6" />
          ) : mood === "glitching" ? (
            <rect x="94" y="117" width="12" height="3" fill="#ff007f" />
          ) : (
            <path
              d="M 94 119 Q 100 123 106 119"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}

          {/* 404 Rescued Badge on Belly */}
          <g className="cursor-pointer" onClick={(e) => { e.stopPropagation(); sendMood("PRAISE"); }}>
            <rect
              x="68"
              y="134"
              width="64"
              height="18"
              rx="4"
              fill="#070712"
              stroke={mood === "glitching" ? "#ff007f" : "#ffb703"}
              strokeWidth="1.5"
            />
            <text
              x="100"
              y="147"
              fill="#00f0ff"
              fontFamily="'Press Start 2P', monospace"
              fontSize="9"
              textAnchor="middle"
              className="tracking-wider"
            >
              404 LOST
            </text>
          </g>

          {/* Rescued Floppy Satchel on the side */}
          <g transform="translate(136, 118)">
            {/* Satchel Strap */}
            <line x1="-36" y1="-28" x2="6" y2="10" stroke="#ffb703" strokeWidth="2.5" strokeDasharray="3 2" />
            {/* Tiny Floppy Disk */}
            <rect x="0" y="4" width="22" height="20" rx="2" fill="#14162e" stroke="#00f0ff" strokeWidth="1.5" />
            <rect x="3" y="6" width="16" height="7" fill="#ffffff" opacity="0.8" />
            <circle cx="11" cy="18" r="2.5" fill="#ff007f" />
          </g>
        </g>
      </svg>
    </div>
  );
};
