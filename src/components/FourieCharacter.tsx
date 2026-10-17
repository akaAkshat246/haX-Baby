import React, { useState, useRef, useEffect, useCallback } from "react";
import { animate, createTimeline } from "animejs";
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

  // States
  const [isHovered, setIsHovered] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const lastTapRef = useRef(0);

  // DOM Refs for Anime.js Targets
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const auraRef = useRef<SVGCircleElement>(null);
  const shadowRef = useRef<SVGEllipseElement>(null);
  const antennaRef = useRef<SVGGElement>(null);
  const antennaOrbRef = useRef<SVGCircleElement>(null);
  const leftEyeRef = useRef<SVGGElement>(null);
  const rightEyeRef = useRef<SVGGElement>(null);
  const leftEyelidRef = useRef<SVGPathElement>(null);
  const rightEyelidRef = useRef<SVGPathElement>(null);
  const cheeksRef = useRef<SVGGElement>(null);
  const rightHandRef = useRef<SVGGElement>(null);
  const leftHandRef = useRef<SVGGElement>(null);
  const tailRef = useRef<SVGGElement>(null);
  const bellyBadgeRef = useRef<SVGGElement>(null);

  // Active Anime.js animation instances
  const idleAnimRef = useRef<any>(null);
  const waveAnimRef = useRef<any>(null);

  // 1. Core Idle Loop with Anime.js: Breathing, Floating, Aura Pulsing, Tail Ripple
  useEffect(() => {
    if (!bodyRef.current || !shadowRef.current || !auraRef.current) return;

    // Organic floating and breathing with Anime.js
    idleAnimRef.current = animate(bodyRef.current, {
      translateY: [-7, 7],
      scaleY: [0.97, 1.03],
      scaleX: [1.02, 0.98],
      duration: mood === "sleepy" ? 2600 : 1800,
      alternate: true,
      loop: true,
      ease: "inOutSine",
    });

    // Dynamic ground shadow expansion
    const shadowAnim = animate(shadowRef.current, {
      scaleX: [1.1, 0.85],
      scaleY: [1.1, 0.85],
      opacity: [0.5, 0.25],
      duration: mood === "sleepy" ? 2600 : 1800,
      alternate: true,
      loop: true,
      ease: "inOutSine",
    });

    // Aura pulse
    const auraAnim = animate(auraRef.current, {
      r: [70, 80],
      opacity: [0.12, 0.28],
      duration: 2200,
      alternate: true,
      loop: true,
      ease: "inOutSine",
    });

    // Antenna sway
    let antennaAnim: any = null;
    if (antennaRef.current) {
      antennaAnim = animate(antennaRef.current, {
        rotate: [-6, 6],
        transformOrigin: "100px 52px",
        duration: 1400,
        alternate: true,
        loop: true,
        ease: "inOutQuad",
      });
    }

    // Glowing packet orb pulsing
    let orbGlowAnim: any = null;
    if (antennaOrbRef.current) {
      orbGlowAnim = animate(antennaOrbRef.current, {
        r: [7, 9.5],
        opacity: [0.85, 1],
        duration: 850,
        alternate: true,
        loop: true,
        ease: "inOutSine",
      });
    }

    // Tail wisps floating
    let tailAnim: any = null;
    if (tailRef.current) {
      tailAnim = animate(tailRef.current, {
        translateY: [-4, 4],
        rotate: [-8, 8],
        transformOrigin: "100px 165px",
        duration: 1600,
        alternate: true,
        loop: true,
        ease: "inOutSine",
      });
    }

    return () => {
      idleAnimRef.current?.pause?.();
      shadowAnim?.pause?.();
      antennaAnim?.pause?.();
      orbGlowAnim?.pause?.();
      tailAnim?.pause?.();
      auraAnim?.pause?.();
    };
  }, [mood]);

  // 2. Natural Spontaneous Blinking with Anime.js
  useEffect(() => {
    if (mood === "sleepy") return;

    let blinkTimeout: number;

    const executeBlink = () => {
      const leftLid = leftEyelidRef.current;
      const rightLid = rightEyelidRef.current;
      if (!leftLid || !rightLid) return;

      // Anime.js rapid snap shut and smooth open
      animate([leftLid, rightLid], {
        scaleY: [0, 1, 0],
        transformOrigin: "center center",
        duration: 160,
        ease: "inOutQuad",
        onComplete: () => {
          // Double-blink chance (30%)
          if (Math.random() < 0.3) {
            setTimeout(() => {
              if (leftEyelidRef.current && rightEyelidRef.current) {
                animate([leftEyelidRef.current, rightEyelidRef.current], {
                  scaleY: [0, 1, 0],
                  transformOrigin: "center center",
                  duration: 130,
                  ease: "inOutQuad",
                });
              }
            }, 100);
          }
        },
      });

      const nextInterval = 2800 + Math.random() * 3400;
      blinkTimeout = window.setTimeout(executeBlink, nextInterval);
    };

    blinkTimeout = window.setTimeout(executeBlink, 2000);
    return () => clearTimeout(blinkTimeout);
  }, [mood]);

  // 3. Smooth Pointer-Tracking 3D Head Tilt
  useEffect(() => {
    let targetTilt = 0;
    let currentTilt = 0;
    let raf = 0;

    const onPointerMove = (e: PointerEvent) => {
      if (!rootRef.current) return;
      const rect = rootRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const diffX = (e.clientX - centerX) / (window.innerWidth / 2);
      targetTilt = Math.max(-14, Math.min(14, diffX * 12));
    };

    const tick = () => {
      currentTilt += (targetTilt - currentTilt) * 0.1;
      if (bodyRef.current) {
        bodyRef.current.style.transform = `rotate(${currentTilt.toFixed(2)}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // 4. Hover State with Anime.js: Cheeks glow, Hand Waves, Pupils Dilate
  const handlePointerEnter = useCallback(() => {
    if (!interactive) return;
    setIsHovered(true);

    if (mood === "awake") {
      audio.click();
    }

    // Blush cheeks with Anime.js
    if (cheeksRef.current) {
      animate(cheeksRef.current, {
        opacity: [0.35, 0.85],
        scale: [1, 1.25],
        transformOrigin: "center center",
        duration: 350,
        ease: "outQuad",
      });
    }

    // Joyful Hand Wave with Anime.js
    if (rightHandRef.current) {
      waveAnimRef.current = animate(rightHandRef.current, {
        translateY: -14,
        rotate: [-28, 28],
        transformOrigin: "42px 110px",
        duration: 280,
        alternate: true,
        loop: true,
        ease: "inOutSine",
      });
    }
  }, [interactive, mood]);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);

    // Return cheeks to normal
    if (cheeksRef.current) {
      animate(cheeksRef.current, {
        opacity: 0.35,
        scale: 1,
        duration: 400,
        ease: "outQuad",
      });
    }

    // Smoothly rest hand back to Fourie's side
    if (rightHandRef.current) {
      waveAnimRef.current?.pause?.();
      animate(rightHandRef.current, {
        translateY: 0,
        rotate: 0,
        duration: 350,
        ease: "outBack",
      });
    }
  }, []);

  // 5. Jump & Squash/Stretch Timeline on Poke (Full Anime.js Choreography)
  const handlePoke = useCallback(
    (e: React.PointerEvent) => {
      if (!interactive) return;

      // Android haptics
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(18);
        } catch {}
      }

      audio.squeak();
      sendMood("POKE");

      const rect = e.currentTarget.getBoundingClientRect();
      bus.emit("poke", {
        x: e.clientX || rect.left + rect.width / 2,
        y: e.clientY || rect.top + rect.height / 2,
      });

      const bodyEl = bodyRef.current;
      if (!bodyEl) return;

      // Anime.js Character Jump & Squash/Stretch Choreography Timeline
      const jumpTimeline = createTimeline();

      jumpTimeline
        // Step 1: Anticipation (Squash down before jumping)
        .add(bodyEl, {
          translateY: 10,
          scaleY: 0.84,
          scaleX: 1.16,
          duration: 120,
          ease: "inQuad",
        })
        // Step 2: Launch into the air (Stretch vertically)
        .add(bodyEl, {
          translateY: -32,
          scaleY: 1.18,
          scaleX: 0.88,
          duration: 260,
          ease: "outCubic",
        })
        // Step 3: Peak float with wiggle
        .add(bodyEl, {
          translateY: -28,
          rotate: [-6, 6, 0],
          duration: 180,
          ease: "inOutSine",
        })
        // Step 4: Fall back down and land with impact squash
        .add(bodyEl, {
          translateY: 0,
          scaleY: 0.88,
          scaleX: 1.12,
          duration: 220,
          ease: "inQuad",
        })
        // Step 5: Elastic recovery back to natural shape
        .add(bodyEl, {
          scaleY: 1,
          scaleX: 1,
          duration: 320,
          ease: "outElastic",
        });

      // Synchronize floating hands during jump
      if (rightHandRef.current && leftHandRef.current) {
        animate([rightHandRef.current, leftHandRef.current], {
          translateY: [-8, -24, 0],
          duration: 600,
          ease: "outQuad",
        });
      }
    },
    [interactive, sendMood]
  );

  // 6. Antenna Tap Secret Sequence
  const handleAntennaTap = (e: React.PointerEvent) => {
    e.stopPropagation();
    const now = performance.now();
    const prev = lastTapRef.current;
    lastTapRef.current = now;

    const count = now - prev < 700 ? tapCount + 1 : 1;
    setTapCount(count);

    audio.glitch();
    bus.emit("poke", { x: e.clientX, y: e.clientY });

    // Glitch jitter with Anime.js
    if (antennaRef.current) {
      animate(antennaRef.current, {
        translateX: [-4, 4, -2, 2, 0],
        duration: 250,
        ease: "inOutSine",
      });
    }

    if (count >= 5) {
      setTapCount(0);
      bus.emit("secret", undefined);
      useStore.getState().unlockSecret();

      // Celebration spin
      if (bodyRef.current) {
        animate(bodyRef.current, {
          rotate: [0, 360],
          scale: [1, 1.25, 1],
          duration: 800,
          ease: "outElastic",
        });
      }
    }
  };

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label={`Fourie the 404 spirit, currently ${mood}`}
      style={{ width: size, height: size }}
      className={`relative select-none cursor-pointer overflow-visible ${className}`}
      onPointerDown={handlePoke}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full overflow-visible drop-shadow-[0_10px_28px_rgba(0,240,255,0.3)]"
      >
        <defs>
          {/* Luminous Body Hologram Shader */}
          <radialGradient id="fourieGlowGrad" cx="45%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#242b58" />
            <stop offset="50%" stopColor="#141838" />
            <stop offset="90%" stopColor="#0a0c20" />
            <stop offset="100%" stopColor="#060714" />
          </radialGradient>

          {/* Golden Orb Glow */}
          <radialGradient id="orbGlow" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#ffb703" />
            <stop offset="100%" stopColor="#ff5400" />
          </radialGradient>

          {/* Eye Glass Highlight */}
          <linearGradient id="eyeShine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#0080ff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0033aa" stopOpacity="0.9" />
          </linearGradient>

          {/* Ghost Aura Blur Filter */}
          <filter id="softAura" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Cyber Glitch Filter */}
          <filter id="cyberGlitch">
            <feOffset dx="-3" dy="0" result="red" />
            <feOffset dx="3" dy="0" result="blue" />
            <feBlend mode="screen" in="SourceGraphic" in2="red" />
          </filter>
        </defs>

        {/* Dynamic Luminous Aura */}
        <circle
          ref={auraRef}
          cx="100"
          cy="110"
          r="74"
          fill="#00f0ff"
          opacity="0.18"
          filter="url(#softAura)"
        />

        {/* Dynamic Ground Shadow */}
        <ellipse
          ref={shadowRef}
          cx="100"
          cy="184"
          rx="52"
          ry="11"
          fill="#000000"
          opacity="0.45"
          className="origin-center"
        />

        {/* Floating Digital Spirit Wisps / Tail */}
        <g ref={tailRef} opacity="0.6">
          <path
            d="M 80 155 Q 70 175 60 180 Q 75 170 85 158 Z"
            fill="#00f0ff"
            opacity="0.5"
          />
          <path
            d="M 120 155 Q 130 175 140 180 Q 125 170 115 158 Z"
            fill="#00f0ff"
            opacity="0.5"
          />
          <circle cx="70" cy="178" r="2.5" fill="#00f0ff" opacity="0.7" />
          <circle cx="130" cy="178" r="2.5" fill="#00f0ff" opacity="0.7" />
          <circle cx="100" cy="182" r="3" fill="#ffb703" opacity="0.6" />
        </g>

        {/* RIGGED CHARACTED BODY GROUP */}
        <g
          ref={bodyRef}
          className="origin-bottom"
          filter={mood === "glitching" ? "url(#cyberGlitch)" : undefined}
        >
          {/* Animated Antenna Assembly */}
          <g ref={antennaRef}>
            {/* Flexible Antenna Stem */}
            <path
              d="M 100 52 C 95 36, 92 28, 100 16"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Tiny Antenna Coil Rings */}
            <circle cx="98" cy="38" r="3" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
            <circle cx="99" cy="27" r="3" fill="none" stroke="#00f0ff" strokeWidth="1.5" />

            {/* Glowing Packet Receiver Orb (Tap 5x for Easter Egg) */}
            <g className="cursor-pointer" onPointerDown={handleAntennaTap}>
              <circle cx="100" cy="14" r="16" fill="transparent" />
              {/* Radiating Ping Ring */}
              <circle
                cx="100"
                cy="14"
                r="13"
                fill="none"
                stroke="#ffb703"
                strokeWidth="1.5"
                opacity={isHovered ? 0.8 : 0.4}
                className="animate-ping origin-center"
              />
              {/* Core Orb */}
              <circle
                ref={antennaOrbRef}
                cx="100"
                cy="14"
                r="7.5"
                fill={mood === "glitching" ? "#ff007f" : "url(#orbGlow)"}
                stroke="#ffffff"
                strokeWidth="1.8"
              />
            </g>
          </g>

          {/* Main Rounded Ghost Spirit Body */}
          <rect
            x="46"
            y="48"
            width="108"
            height="114"
            rx="36"
            fill="url(#fourieGlowGrad)"
            stroke="#00f0ff"
            strokeWidth="2.8"
          />

          {/* Cyber Grid Texture Lines inside Body */}
          <path
            d="M 54 82 L 146 82 M 54 112 L 146 112 M 54 142 L 146 142"
            stroke="#00f0ff"
            strokeWidth="0.6"
            strokeDasharray="4 4"
            opacity="0.18"
          />

          {/* Blushing Cheeks */}
          <g ref={cheeksRef} opacity="0.35">
            <circle cx="67" cy="118" r="7.5" fill="#ff007f" filter="url(#softAura)" />
            <circle cx="133" cy="118" r="7.5" fill="#ff007f" filter="url(#softAura)" />
            <circle cx="67" cy="118" r="5" fill="#ff4090" />
            <circle cx="133" cy="118" r="5" fill="#ff4090" />
          </g>

          {/* Eye Sockets */}
          <ellipse
            cx="76"
            cy="93"
            rx="15"
            ry="18"
            fill="#060814"
            stroke="#00f0ff"
            strokeWidth="1.8"
          />
          <ellipse
            cx="124"
            cy="93"
            rx="15"
            ry="18"
            fill="#060814"
            stroke="#00f0ff"
            strokeWidth="1.8"
          />

          {/* Animated Pupils (Track Pointer & Dilate on Hover) */}
          <g ref={pupilsRef} id="fourie-pupils">
            {mood !== "sleepy" && (
              <>
                {/* Left Pupil with Anime Highlights */}
                <g ref={leftEyeRef} className="origin-center">
                  <circle cx="76" cy="93" r={isHovered ? 8.5 : 7.2} fill="url(#eyeShine)" />
                  <circle cx="74" cy="90" r="2.8" fill="#ffffff" />
                  <circle cx="78" cy="95" r="1.2" fill="#ffffff" opacity="0.8" />
                </g>

                {/* Right Pupil with Anime Highlights */}
                <g ref={rightEyeRef} className="origin-center">
                  <circle cx="124" cy="93" r={isHovered ? 8.5 : 7.2} fill="url(#eyeShine)" />
                  <circle cx="122" cy="90" r="2.8" fill="#ffffff" />
                  <circle cx="126" cy="95" r="1.2" fill="#ffffff" opacity="0.8" />
                </g>
              </>
            )}
          </g>

          {/* Animated Eyelids (Spontaneous Blinking via Anime.js) */}
          <path
            ref={leftEyelidRef}
            d="M 61 75 C 61 75, 76 96, 91 75 L 91 95 C 91 95, 76 112, 61 95 Z"
            fill="#141838"
            stroke="#00f0ff"
            strokeWidth="2.5"
            style={{ transform: "scaleY(0)" }}
          />
          <path
            ref={rightEyelidRef}
            d="M 109 75 C 109 75, 124 96, 139 75 L 139 95 C 139 95, 124 112, 109 95 Z"
            fill="#141838"
            stroke="#00f0ff"
            strokeWidth="2.5"
            style={{ transform: "scaleY(0)" }}
          />

          {/* Sleepy Closed Eyes Fallback */}
          {mood === "sleepy" && (
            <g>
              <path
                d="M 65 95 Q 76 106 87 95"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 113 95 Q 124 106 135 95"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <text x="144" y="68" fill="#ffb703" fontFamily="'Press Start 2P', monospace" fontSize="12">Z</text>
              <text x="158" y="52" fill="#ffb703" fontFamily="'Press Start 2P', monospace" fontSize="9" opacity="0.7">z</text>
            </g>
          )}

          {/* Happy Eye Crescents */}
          {mood === "happy" && (
            <g>
              <path
                d="M 64 95 Q 76 83 88 95"
                fill="none"
                stroke="#ffb703"
                strokeWidth="3.8"
                strokeLinecap="round"
              />
              <path
                d="M 112 95 Q 124 83 136 95"
                fill="none"
                stroke="#ffb703"
                strokeWidth="3.8"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Expressive Mouth */}
          {mood === "happy" || isHovered ? (
            <path
              d="M 91 118 Q 100 130 109 118"
              fill="#ff007f"
              stroke="#00f0ff"
              strokeWidth="2"
            />
          ) : mood === "sleepy" ? (
            <ellipse cx="100" cy="119" rx="3.5" ry="2.2" fill="#00f0ff" opacity="0.7" />
          ) : (
            <path
              d="M 93 119 Q 100 124 107 119"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* 404 Rescued Belly Badge */}
          <g
            ref={bellyBadgeRef}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              sendMood("PRAISE");
              if (bellyBadgeRef.current) {
                animate(bellyBadgeRef.current, {
                  scale: [1, 1.25, 1],
                  duration: 400,
                  ease: "outElastic",
                });
              }
            }}
          >
            <rect
              x="66"
              y="134"
              width="68"
              height="20"
              rx="5"
              fill="#060714"
              stroke={isHovered ? "#00f0ff" : "#ffb703"}
              strokeWidth="2"
            />
            <text
              x="100"
              y="148"
              fill="#00f0ff"
              fontFamily="'Press Start 2P', monospace"
              fontSize="9.5"
              textAnchor="middle"
              className="tracking-wider"
            >
              404 LOST
            </text>
          </g>

          {/* Vintage Floppy Disk Satchel (Left Hip) */}
          <g transform="translate(136, 116)">
            {/* Leather Satchel Strap */}
            <line
              x1="-38"
              y1="-28"
              x2="8"
              y2="12"
              stroke="#ffb703"
              strokeWidth="2.8"
              strokeDasharray="4 2"
            />
            {/* Floppy Body */}
            <rect
              x="0"
              y="6"
              width="24"
              height="22"
              rx="3"
              fill="#101432"
              stroke="#00f0ff"
              strokeWidth="1.8"
            />
            {/* Metal Slider */}
            <rect x="4" y="8" width="16" height="8" rx="1" fill="#c0c0c0" />
            <circle cx="12" cy="20" r="3" fill="#ff007f" />
          </g>

          {/* Rigged Floating Left Hand */}
          <g ref={leftHandRef} className="origin-center">
            <ellipse
              cx="40"
              cy="124"
              rx="7"
              ry="9"
              fill="#1a2046"
              stroke="#00f0ff"
              strokeWidth="2"
            />
            <circle cx="40" cy="124" r="2.5" fill="#ffb703" opacity="0.6" />
          </g>

          {/* Rigged Floating Right Hand (Waves with Anime.js) */}
          <g ref={rightHandRef} className="origin-top-left">
            <ellipse
              cx="160"
              cy="124"
              rx="7"
              ry="9"
              fill="#1a2046"
              stroke="#00f0ff"
              strokeWidth="2"
            />
            <circle cx="160" cy="124" r="2.5" fill="#ffb703" opacity="0.6" />
          </g>
        </g>
      </svg>
    </div>
  );
};
