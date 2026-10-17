import React, { useState, useRef, useEffect } from "react";
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
  const pupilsRef = useEyes(12);

  // Animation & Mascot States
  const [isWaving, setIsWaving] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  // Dynamic spring physics refs for 60fps continuous micro-movement
  const containerRef = useRef<HTMLDivElement>(null);
  const armRef = useRef<SVGGElement>(null);
  const antennaTipRef = useRef<SVGGElement>(null);
  const bodyMeshRef = useRef<SVGGElement>(null);
  const shadowRef = useRef<SVGEllipseElement>(null);
  const lastTapRef = useRef(0);

  // Natural spontaneous blinking loop (3-6s interval)
  useEffect(() => {
    if (mood === "sleepy") return;

    let timeoutId: number;
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
        // 30% chance of an authentic cute double-blink!
        if (Math.random() < 0.35) {
          setTimeout(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 90);
          }, 110);
        }
      }, 120);

      const nextDelay = 2800 + Math.random() * 3200;
      timeoutId = window.setTimeout(triggerBlink, nextDelay);
    };

    timeoutId = window.setTimeout(triggerBlink, 2500);
    return () => clearTimeout(timeoutId);
  }, [mood]);

  // Continuous physics loop: floating breathing + antenna secondary lag + body tilt
  useEffect(() => {
    let rafId = 0;
    let floatTime = 0;
    let targetTilt = 0;
    let currentTilt = 0;
    let antennaLag = 0;
    let waveTime = 0;

    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const dx = (e.clientX - centerX) / (window.innerWidth / 2);
      targetTilt = Math.max(-12, Math.min(12, dx * 10)); // Head/body tilt up to 10 deg
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const loop = (timestamp: number) => {
      floatTime = timestamp / 1000;

      // 1. Organic Breathing & Floating Oscillation (Squash & Stretch)
      const floatY = Math.sin(floatTime * 2.2) * 6; // +/- 6px gentle bobbing
      const breatheScaleY = 1 + Math.sin(floatTime * 2.2) * 0.025;
      const breatheScaleX = 1 - Math.sin(floatTime * 2.2) * 0.02;

      // 2. Smooth Lerp Tilt towards Pointer
      currentTilt += (targetTilt - currentTilt) * 0.1;

      // 3. Antenna Secondary Inertia / Lag
      const targetAntennaLag = -currentTilt * 1.8;
      antennaLag += (targetAntennaLag - antennaLag) * 0.12;

      // Apply body transform
      if (bodyMeshRef.current) {
        bodyMeshRef.current.style.transform = `translate(0px, ${floatY.toFixed(2)}px) rotate(${currentTilt.toFixed(2)}deg) scale(${breatheScaleX.toFixed(3)}, ${breatheScaleY.toFixed(3)})`;
      }

      // Apply shadow scaling (inverse of float altitude)
      if (shadowRef.current) {
        const shadowScale = 1 - floatY * 0.03;
        const shadowAlpha = 0.45 - floatY * 0.02;
        shadowRef.current.style.transform = `scale(${shadowScale.toFixed(3)})`;
        shadowRef.current.style.opacity = Math.max(0.2, shadowAlpha).toFixed(2);
      }

      // Apply antenna tip secondary lag
      if (antennaTipRef.current) {
        antennaTipRef.current.style.transform = `translate(${antennaLag.toFixed(2)}px, ${(floatY * 0.5).toFixed(2)}px)`;
      }

      // 4. Arm Waving Motion (if hovering or waving state active)
      if (armRef.current) {
        if (isWaving || isHovered) {
          waveTime += 0.22;
          const waveAngle = Math.sin(waveTime) * 22; // wave back and forth +/- 22 deg
          armRef.current.style.transform = `translate(42px, 112px) rotate(${(-35 + waveAngle).toFixed(2)}deg)`;
        } else {
          // Smoothly rest hand by Fourie's side
          armRef.current.style.transform = `translate(42px, 118px) rotate(0deg)`;
          waveTime = 0;
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [isWaving, isHovered]);

  // Interaction handlers
  const handlePointerEnter = () => {
    if (!interactive) return;
    setIsHovered(true);
    // Cute subtle chirp on hover curiosity
    if (mood === "awake") {
      audio.click();
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setIsWaving(false);
  };

  const handlePoke = (e: React.PointerEvent) => {
    if (!interactive) return;

    // Android haptics
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(15);
      } catch {}
    }

    // Play squeak sound
    audio.squeak();

    // Trigger spring jump and wave celebration
    setIsJumping(true);
    setIsWaving(true);
    setTimeout(() => setIsJumping(false), 550);
    setTimeout(() => setIsWaving(false), 2400);

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
      ref={containerRef}
      role="img"
      aria-label={`Fourie the 404 spirit, currently ${mood}`}
      style={{ width: size, height: size }}
      className={`relative select-none transition-transform duration-200 cursor-pointer ${
        isJumping ? "-translate-y-6 scale-105" : ""
      } ${className}`}
      onPointerDown={handlePoke}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full overflow-visible drop-shadow-[0_8px_24px_rgba(0,240,255,0.28)]"
      >
        <defs>
          {/* Holographic Body Gradient */}
          <radialGradient id="bodyGlow" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#1e2246" />
            <stop offset="60%" stopColor="#101228" />
            <stop offset="100%" stopColor="#070712" />
          </radialGradient>

          {/* Glowing Aura Filter */}
          <filter id="neonAura" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Glitch RGB Split Filter */}
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
          opacity={isHovered ? 0.35 : mood === "glitching" ? 0.4 : 0.15}
          className="transition-opacity duration-300 animate-pulse"
        />

        {/* Dynamic Ground Shadow underneath */}
        <ellipse
          ref={shadowRef}
          cx="100"
          cy="180"
          rx="48"
          ry="10"
          fill="#000000"
          opacity="0.45"
          className="transition-transform duration-100 origin-center"
        />

        {/* RIGGED CHARACTER MESH (Body, Head, Eyes, Antenna, Arms) */}
        <g
          ref={bodyMeshRef}
          className="origin-bottom transition-transform duration-75"
          filter={mood === "glitching" ? "url(#rgbGlitch)" : undefined}
        >
          {/* Antenna Stem */}
          <path
            d="M 100 50 Q 96 32 100 16"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Antenna LED / Packet Receiver with Secondary Lag Physics */}
          <g
            ref={antennaTipRef}
            className="cursor-pointer origin-center transition-transform duration-75"
            onPointerDown={handleAntennaTap}
          >
            <circle cx="100" cy="14" r="14" fill="transparent" />
            <circle
              cx="100"
              cy="14"
              r={isHovered ? 8 : 7}
              fill={mood === "glitching" ? "#ff007f" : isHovered ? "#ff007f" : "#ffb703"}
              stroke="#00f0ff"
              strokeWidth="2"
              className="transition-colors animate-pulse"
            />
            {/* Radiating Antenna Ping Waves */}
            <circle
              cx="100"
              cy="14"
              r="13"
              fill="none"
              stroke="#ffb703"
              strokeWidth="1"
              opacity={isHovered ? "0.7" : "0.4"}
              className="animate-ping"
            />
          </g>

          {/* Main Rounded Ghost Body */}
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

          {/* Emotive Cheeks (Blushes brighter on hover/shy) */}
          <circle
            cx="68"
            cy="116"
            r="6.5"
            fill="#ff007f"
            opacity={isHovered || mood === "shy" ? 0.8 : 0.35}
            className="transition-opacity duration-300"
          />
          <circle
            cx="132"
            cy="116"
            r="6.5"
            fill="#ff007f"
            opacity={isHovered || mood === "shy" ? 0.8 : 0.35}
            className="transition-opacity duration-300"
          />

          {/* Eye Sockets */}
          <ellipse cx="78" cy="94" rx="14" ry="16" fill="#070712" stroke="#00f0ff" strokeWidth="1.5" />
          <ellipse cx="122" cy="94" rx="14" ry="16" fill="#070712" stroke="#00f0ff" strokeWidth="1.5" />

          {/* Animated Moving Pupils (Hooked to pointer & touch) */}
          <g ref={pupilsRef} id="fourie-pupils">
            {mood !== "sleepy" && !isBlinking ? (
              <>
                {/* Left Eye Pupil */}
                <circle cx="78" cy="94" r={isHovered ? 7.5 : 7} fill="#00f0ff" />
                <circle cx="76" cy="91" r="2.5" fill="#ffffff" />

                {/* Right Eye Pupil */}
                <circle cx="122" cy="94" r={isHovered ? 7.5 : 7} fill="#00f0ff" />
                <circle cx="120" cy="91" r="2.5" fill="#ffffff" />
              </>
            ) : null}
          </g>

          {/* Natural Spontaneous Eyelid Blink Overlay */}
          {(isBlinking || mood === "sleepy") && (
            <g>
              {/* Closed curved sleepy/blinking lines */}
              <path
                d="M 68 96 Q 78 106 88 96"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 112 96 Q 122 106 132 96"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {mood === "sleepy" && (
                <>
                  <text x="142" y="72" fill="#ffb703" fontFamily="'Press Start 2P', monospace" fontSize="11" opacity="0.85">Z</text>
                  <text x="156" y="56" fill="#ffb703" fontFamily="'Press Start 2P', monospace" fontSize="8" opacity="0.65">z</text>
                </>
              )}
            </g>
          )}

          {mood === "happy" && !isBlinking && (
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

          {/* Cute Responsive Mouth */}
          {mood === "happy" || isHovered ? (
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

          {/* 404 Rescued Belly Badge */}
          <g
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              sendMood("PRAISE");
              setIsWaving(true);
              setTimeout(() => setIsWaving(false), 2000);
            }}
          >
            <rect
              x="68"
              y="134"
              width="64"
              height="18"
              rx="4"
              fill="#070712"
              stroke={isHovered ? "#00f0ff" : mood === "glitching" ? "#ff007f" : "#ffb703"}
              strokeWidth="1.5"
            />
            <text
              x="100"
              y="147"
              fill="#00f0ff"
              fontFamily="'Press Start 2P', monospace"
              fontSize="9"
              textAnchor="middle"
              className="tracking-wider select-none"
            >
              404 LOST
            </text>
          </g>

          {/* Rescued Floppy Satchel on the Left Side */}
          <g transform="translate(136, 118)">
            <line x1="-36" y1="-28" x2="6" y2="10" stroke="#ffb703" strokeWidth="2.5" strokeDasharray="3 2" />
            <rect x="0" y="4" width="22" height="20" rx="2" fill="#14162e" stroke="#00f0ff" strokeWidth="1.5" />
            <rect x="3" y="6" width="16" height="7" fill="#ffffff" opacity="0.8" />
            <circle cx="11" cy="18" r="2.5" fill="#ff007f" />
          </g>

          {/* Interactive Waving Ghost Hand/Arm on Right Side */}
          <g
            ref={armRef}
            className="origin-top-left transition-transform duration-100"
          >
            {/* Soft glowing rounded arm */}
            <path
              d="M 0 0 C -6 6, -14 10, -18 4 C -22 -2, -14 -8, -6 -6 Z"
              fill="#14162e"
              stroke="#00f0ff"
              strokeWidth="2"
            />
            {/* Tiny palm glow */}
            <circle cx="-14" cy="2" r="3" fill="#ffb703" opacity={isWaving ? "0.9" : "0.4"} />
          </g>
        </g>
      </svg>
    </div>
  );
};
