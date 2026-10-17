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

  // 1. Core Idle Loop with Anime.js: Gentle Bedtime Respiration & Float
  useEffect(() => {
    if (!bodyRef.current || !shadowRef.current || !auraRef.current) return;

    // Soothing gentle floating and breathing
    idleAnimRef.current = animate(bodyRef.current, {
      translateY: [-6, 6],
      scaleY: [0.97, 1.03],
      scaleX: [1.025, 0.975],
      duration: mood === "sleepy" ? 2800 : 2000,
      alternate: true,
      loop: true,
      ease: "inOutSine",
    });

    // Dynamic ground shadow expansion
    const shadowAnim = animate(shadowRef.current, {
      scaleX: [1.12, 0.88],
      scaleY: [1.12, 0.88],
      opacity: [0.4, 0.2],
      duration: mood === "sleepy" ? 2800 : 2000,
      alternate: true,
      loop: true,
      ease: "inOutSine",
    });

    // Warm aura pulse
    const auraAnim = animate(auraRef.current, {
      r: [72, 84],
      opacity: [0.15, 0.35],
      duration: 2400,
      alternate: true,
      loop: true,
      ease: "inOutSine",
    });

    // Antenna sleepy sway
    let antennaAnim: any = null;
    if (antennaRef.current) {
      antennaAnim = animate(antennaRef.current, {
        rotate: [-5, 5],
        transformOrigin: "100px 52px",
        duration: 1600,
        alternate: true,
        loop: true,
        ease: "inOutQuad",
      });
    }

    // Glowing butter star orb pulsing
    let orbGlowAnim: any = null;
    if (antennaOrbRef.current) {
      orbGlowAnim = animate(antennaOrbRef.current, {
        r: [7.5, 10],
        opacity: [0.85, 1],
        duration: 950,
        alternate: true,
        loop: true,
        ease: "inOutSine",
      });
    }

    // Little cloud tail wisps floating
    let tailAnim: any = null;
    if (tailRef.current) {
      tailAnim = animate(tailRef.current, {
        translateY: [-3, 3],
        rotate: [-6, 6],
        transformOrigin: "100px 165px",
        duration: 1800,
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

      animate([leftLid, rightLid], {
        scaleY: [0, 1, 0],
        transformOrigin: "center center",
        duration: 170,
        ease: "inOutQuad",
        onComplete: () => {
          if (Math.random() < 0.35) {
            setTimeout(() => {
              if (leftEyelidRef.current && rightEyelidRef.current) {
                animate([leftEyelidRef.current, rightEyelidRef.current], {
                  scaleY: [0, 1, 0],
                  transformOrigin: "center center",
                  duration: 140,
                  ease: "inOutQuad",
                });
              }
            }, 100);
          }
        },
      });

      const nextInterval = 2800 + Math.random() * 3200;
      blinkTimeout = window.setTimeout(executeBlink, nextInterval);
    };

    blinkTimeout = window.setTimeout(executeBlink, 2200);
    return () => clearTimeout(blinkTimeout);
  }, [mood]);

  // 3. Smooth Pointer-Tracking Head Tilt
  useEffect(() => {
    let targetTilt = 0;
    let currentTilt = 0;
    let raf = 0;

    const onPointerMove = (e: PointerEvent) => {
      if (!rootRef.current) return;
      const rect = rootRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const diffX = (e.clientX - centerX) / (window.innerWidth / 2);
      targetTilt = Math.max(-10, Math.min(10, diffX * 8));
    };

    const tick = () => {
      currentTilt += (targetTilt - currentTilt) * 0.08;
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

  // 4. Hover State: Cuddly Blushing & Soft Hand Wave
  const handlePointerEnter = useCallback(() => {
    if (!interactive) return;
    setIsHovered(true);

    if (mood === "awake") {
      audio.click();
    }

    if (cheeksRef.current) {
      animate(cheeksRef.current, {
        opacity: [0.45, 0.95],
        scale: [1, 1.3],
        transformOrigin: "center center",
        duration: 350,
        ease: "outQuad",
      });
    }

    if (rightHandRef.current) {
      waveAnimRef.current = animate(rightHandRef.current, {
        translateY: -12,
        rotate: [-24, 24],
        transformOrigin: "42px 110px",
        duration: 320,
        alternate: true,
        loop: true,
        ease: "inOutSine",
      });
    }
  }, [interactive, mood]);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);

    if (cheeksRef.current) {
      animate(cheeksRef.current, {
        opacity: 0.45,
        scale: 1,
        duration: 400,
        ease: "outQuad",
      });
    }

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

  // 5. Jump & Soft Bounce on Poke
  const handlePoke = useCallback(
    (e: React.PointerEvent) => {
      if (!interactive) return;

      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(15);
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

      const jumpTimeline = createTimeline();

      jumpTimeline
        .add(bodyEl, {
          translateY: 8,
          scaleY: 0.86,
          scaleX: 1.14,
          duration: 120,
          ease: "inQuad",
        })
        .add(bodyEl, {
          translateY: -26,
          scaleY: 1.14,
          scaleX: 0.9,
          duration: 260,
          ease: "outCubic",
        })
        .add(bodyEl, {
          translateY: -22,
          rotate: [-4, 4, 0],
          duration: 180,
          ease: "inOutSine",
        })
        .add(bodyEl, {
          translateY: 0,
          scaleY: 0.9,
          scaleX: 1.1,
          duration: 220,
          ease: "inQuad",
        })
        .add(bodyEl, {
          scaleY: 1,
          scaleX: 1,
          duration: 320,
          ease: "outElastic",
        });

      if (rightHandRef.current && leftHandRef.current) {
        animate([rightHandRef.current, leftHandRef.current], {
          translateY: [-6, -20, 0],
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

    audio.chime();
    bus.emit("poke", { x: e.clientX, y: e.clientY });

    if (antennaRef.current) {
      animate(antennaRef.current, {
        translateX: [-3, 3, -1, 1, 0],
        duration: 250,
        ease: "inOutSine",
      });
    }

    if (count >= 5) {
      setTapCount(0);
      bus.emit("secret", undefined);
      useStore.getState().unlockSecret();

      if (bodyRef.current) {
        animate(bodyRef.current, {
          rotate: [0, 360],
          scale: [1, 1.2, 1],
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
      aria-label={`Baby Fourie, the 404 nursery spirit, currently ${mood}`}
      style={{ width: size, height: size }}
      className={`relative select-none cursor-pointer overflow-visible ${className}`}
      onPointerDown={handlePoke}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full overflow-visible drop-shadow-[0_12px_32px_rgba(168,155,240,0.35)]"
      >
        <defs>
          {/* Soothing Baby Body Gradient: Deep Velvet Twilight to Pastel Lavender */}
          <radialGradient id="babyFourieGlow" cx="42%" cy="36%" r="68%">
            <stop offset="0%" stopColor="#2c275e" />
            <stop offset="55%" stopColor="#1a163e" />
            <stop offset="90%" stopColor="#120f2c" />
            <stop offset="100%" stopColor="#0c0a20" />
          </radialGradient>

          {/* Warm Butter Star Glow */}
          <radialGradient id="butterStarGlow" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#ffd97a" />
            <stop offset="100%" stopColor="#ffb347" />
          </radialGradient>

          {/* Sweet Anime Eye Shimmer */}
          <linearGradient id="sweetEyeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a89bf0" />
            <stop offset="60%" stopColor="#7c6fd6" />
            <stop offset="100%" stopColor="#43377d" />
          </linearGradient>

          {/* Dreamy Cloud Blur Filter */}
          <filter id="dreamyBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Soft Dream Halo Aura */}
        <circle
          ref={auraRef}
          cx="100"
          cy="110"
          r="76"
          fill="#a89bf0"
          opacity="0.22"
          filter="url(#dreamyBlur)"
        />

        {/* Dynamic Soft Bedtime Shadow */}
        <ellipse
          ref={shadowRef}
          cx="100"
          cy="184"
          rx="52"
          ry="11"
          fill="#0a081a"
          opacity="0.35"
          className="origin-center"
        />

        {/* Floating Little Sleepy Cloud Wisps */}
        <g ref={tailRef} opacity="0.7">
          <ellipse cx="80" cy="168" rx="14" ry="7" fill="#7c6fd6" opacity="0.4" />
          <ellipse cx="120" cy="168" rx="14" ry="7" fill="#7c6fd6" opacity="0.4" />
          <ellipse cx="100" cy="172" rx="18" ry="8" fill="#ffd97a" opacity="0.3" />
          {/* Floating Bedtime Sparkles */}
          <circle cx="68" cy="160" r="2.5" fill="#ffd97a" opacity="0.8" />
          <circle cx="132" cy="160" r="2.5" fill="#ffd97a" opacity="0.8" />
        </g>

        {/* RIGGED BABY CHARACTED BODY GROUP */}
        <g ref={bodyRef} className="origin-bottom">
          {/* Animated Sleepy Antenna & Butter Star */}
          <g ref={antennaRef}>
            {/* Soft Curled Wick / Antenna */}
            <path
              d="M 100 50 C 94 34, 91 26, 100 16"
              fill="none"
              stroke="#ffd97a"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Soft decorative pearl beads */}
            <circle cx="97" cy="36" r="3.2" fill="#a89bf0" />
            <circle cx="98" cy="26" r="3.2" fill="#ff9ec0" />

            {/* Glowing Butter Star Charm on Top */}
            <g className="cursor-pointer" onPointerDown={handleAntennaTap}>
              <circle cx="100" cy="14" r="16" fill="transparent" />
              {/* Radiating Dream Pulse */}
              <circle
                cx="100"
                cy="14"
                r="13"
                fill="none"
                stroke="#ffd97a"
                strokeWidth="1.5"
                opacity={isHovered ? 0.8 : 0.4}
                className="animate-ping origin-center"
              />
              {/* Star / Pearl Orb */}
              <circle
                ref={antennaOrbRef}
                cx="100"
                cy="14"
                r="8"
                fill="url(#butterStarGlow)"
                stroke="#ffffff"
                strokeWidth="1.8"
              />
            </g>
          </g>

          {/* Main Cuddly Rounded Ghost Spirit Body */}
          <rect
            x="44"
            y="46"
            width="112"
            height="118"
            rx="42"
            fill="url(#babyFourieGlow)"
            stroke="#a89bf0"
            strokeWidth="3"
          />

          {/* Soft Pastel Highlights on Head & Tummy */}
          <ellipse cx="100" cy="58" rx="34" ry="7" fill="#ffffff" opacity="0.12" />

          {/* Sweet Rosy Cheeks (Blushing) */}
          <g ref={cheeksRef} opacity="0.55">
            <circle cx="66" cy="118" r="8" fill="#ff9ec0" filter="url(#dreamyBlur)" />
            <circle cx="134" cy="118" r="8" fill="#ff9ec0" filter="url(#dreamyBlur)" />
            <circle cx="66" cy="118" r="5" fill="#ffb3c6" />
            <circle cx="134" cy="118" r="5" fill="#ffb3c6" />
          </g>

          {/* Sweet Large Baby Eye Sockets */}
          <ellipse
            cx="75"
            cy="93"
            rx="16"
            ry="19"
            fill="#09071c"
            stroke="#a89bf0"
            strokeWidth="1.8"
          />
          <ellipse
            cx="125"
            cy="93"
            rx="16"
            ry="19"
            fill="#09071c"
            stroke="#a89bf0"
            strokeWidth="1.8"
          />

          {/* Big Adorable Pupils with Starry Glints */}
          <g ref={pupilsRef} id="fourie-pupils">
            {mood !== "sleepy" && (
              <>
                {/* Left Pupil */}
                <g ref={leftEyeRef} className="origin-center">
                  <circle cx="75" cy="93" r={isHovered ? 9.5 : 8.2} fill="url(#sweetEyeGrad)" />
                  {/* Starry Glints */}
                  <circle cx="72" cy="89" r="3.2" fill="#ffffff" />
                  <circle cx="77" cy="96" r="1.5" fill="#ffffff" opacity="0.9" />
                </g>

                {/* Right Pupil */}
                <g ref={rightEyeRef} className="origin-center">
                  <circle cx="125" cy="93" r={isHovered ? 9.5 : 8.2} fill="url(#sweetEyeGrad)" />
                  {/* Starry Glints */}
                  <circle cx="122" cy="89" r="3.2" fill="#ffffff" />
                  <circle cx="127" cy="96" r="1.5" fill="#ffffff" opacity="0.9" />
                </g>
              </>
            )}
          </g>

          {/* Animated Eyelids (Spontaneous Blinking via Anime.js) */}
          <path
            ref={leftEyelidRef}
            d="M 59 74 C 59 74, 75 97, 91 74 L 91 97 C 91 97, 75 114, 59 97 Z"
            fill="#1c183e"
            stroke="#a89bf0"
            strokeWidth="2.5"
            style={{ transform: "scaleY(0)" }}
          />
          <path
            ref={rightEyelidRef}
            d="M 109 74 C 109 74, 125 97, 141 74 L 141 97 C 141 97, 125 114, 109 97 Z"
            fill="#1c183e"
            stroke="#a89bf0"
            strokeWidth="2.5"
            style={{ transform: "scaleY(0)" }}
          />

          {/* Sleepy Half-Lids / Dreaming Eyes */}
          {mood === "sleepy" && (
            <g>
              <path
                d="M 64 96 Q 75 108 86 96"
                fill="none"
                stroke="#ffd97a"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 114 96 Q 125 108 136 96"
                fill="none"
                stroke="#ffd97a"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <text x="144" y="66" fill="#ffd97a" fontFamily="'Press Start 2P', monospace" fontSize="12">Z</text>
              <text x="158" y="50" fill="#ff9ec0" fontFamily="'Press Start 2P', monospace" fontSize="9" opacity="0.8">z</text>
            </g>
          )}

          {/* Happy Eye Crescents */}
          {mood === "happy" && (
            <g>
              <path
                d="M 63 95 Q 75 82 87 95"
                fill="none"
                stroke="#ffd97a"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 113 95 Q 125 82 137 95"
                fill="none"
                stroke="#ffd97a"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Sweet Little Baby Mouth */}
          {mood === "happy" || isHovered ? (
            <path
              d="M 91 118 Q 100 131 109 118"
              fill="#ff9ec0"
              stroke="#ffd97a"
              strokeWidth="2"
            />
          ) : mood === "sleepy" ? (
            <ellipse cx="100" cy="119" rx="3.5" ry="2.2" fill="#ffd97a" opacity="0.8" />
          ) : (
            <path
              d="M 93 119 Q 100 124 107 119"
              fill="none"
              stroke="#ffd97a"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Baby's 404 Rescued Tummy Patch */}
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
              x="65"
              y="136"
              width="70"
              height="20"
              rx="10"
              fill="#100e26"
              stroke={isHovered ? "#ffd97a" : "#a89bf0"}
              strokeWidth="2"
            />
            <text
              x="100"
              y="150"
              fill="#ffd97a"
              fontFamily="'Press Start 2P', monospace"
              fontSize="9"
              textAnchor="middle"
              className="tracking-wider"
            >
              ✦ 404 ✦
            </text>
          </g>

          {/* Adorable Pastel Floppy Satchel (Cozy baby pouch with heart charm) */}
          <g transform="translate(136, 116)">
            {/* Soft Ribbon Strap */}
            <line
              x1="-38"
              y1="-28"
              x2="8"
              y2="12"
              stroke="#ff9ec0"
              strokeWidth="2.8"
            />
            {/* Pastel Floppy Body */}
            <rect
              x="0"
              y="6"
              width="24"
              height="22"
              rx="4"
              fill="#251f50"
              stroke="#a89bf0"
              strokeWidth="2"
            />
            <rect x="4" y="8" width="16" height="8" rx="2" fill="#fffaf5" />
            {/* Cute Little Heart on Floppy */}
            <circle cx="12" cy="20" r="3" fill="#ff9ec0" />
          </g>

          {/* Rigged Floating Baby Left Hand */}
          <g ref={leftHandRef} className="origin-center">
            <ellipse
              cx="38"
              cy="124"
              rx="8"
              ry="10"
              fill="#251f50"
              stroke="#a89bf0"
              strokeWidth="2.2"
            />
            <circle cx="38" cy="124" r="3" fill="#ff9ec0" opacity="0.7" />
          </g>

          {/* Rigged Floating Baby Right Hand (Waves gently on hover) */}
          <g ref={rightHandRef} className="origin-top-left">
            <ellipse
              cx="162"
              cy="124"
              rx="8"
              ry="10"
              fill="#251f50"
              stroke="#a89bf0"
              strokeWidth="2.2"
            />
            <circle cx="162" cy="124" r="3" fill="#ff9ec0" opacity="0.7" />
          </g>
        </g>
      </svg>
    </div>
  );
};
