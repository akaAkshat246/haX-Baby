import React, { useEffect, useState, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { VoidScene } from "../scenes/VoidScene";
import { DialUpScene } from "../scenes/DialUpScene";
import { GeoCitiesScene } from "../scenes/GeoCitiesScene";
import { CloudVoidScene } from "../scenes/CloudVoidScene";
import { DesktopScene } from "../scenes/DesktopScene";
import { RouterScene } from "../scenes/RouterScene";
import { FooterScene } from "../scenes/FooterScene";
import { Taskbar } from "../components/Taskbar";
import { MuteButton } from "../components/MuteButton";
import { SparkCanvas } from "../components/SparkCanvas";
import { initChaosObserver } from "../core/shape";
import { useStore } from "../core/store";
import { audio } from "../core/audio";
import { bus } from "../core/bus";
import { SequenceBuffer } from "../ds/sequenceBuffer";

gsap.registerPlugin(ScrollTrigger);

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export const App: React.FC = () => {
  const [taskbarVisible, setTaskbarVisible] = useState(false);
  const [booting, setBooting] = useState(false);
  const openWindow = useStore((s) => s.openWindow);
  const closeAllWindows = useStore((s) => s.closeAllWindows);
  const unlockSecret = useStore((s) => s.unlockSecret);
  const bootedRef = useRef(false);

  useEffect(() => {
    // 1. Initialize Responsive Chaos Mode
    const unbindChaos = initChaosObserver((shape) => {
      useStore.getState().setShape(shape);
    });

    // 2. Initialize Lenis Smooth Scroll on desktop (keep native touch on mobile)
    let lenis: Lenis | null = null;
    if (window.matchMedia("(pointer:fine)").matches) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis?.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // 3. Konami Code detector
    const konamiBuffer = new SequenceBuffer<string>(KONAMI_SEQUENCE.length);
    const handleKeyDown = (e: KeyboardEvent) => {
      konamiBuffer.push(e.key);
      if (konamiBuffer.matches(KONAMI_SEQUENCE, (a, b) => a.toLowerCase() === b.toLowerCase())) {
        audio.glitch();
        unlockSecret();
        openWindow("nowhere");
        konamiBuffer.clear();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // 4. Easter egg /nowhere URL detector
    const checkNowhereRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes("nowhere") || hash.includes("nowhere") || path.includes("404")) {
        unlockSecret();
        openWindow("nowhere");
      }
    };
    checkNowhereRoute();
    window.addEventListener("popstate", checkNowhereRoute);

    // 5. IntersectionObserver for Desktop Section & Taskbar
    const desktopEl = document.getElementById("scene-desktop");
    if (desktopEl) {
      const desktopObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTaskbarVisible(true);
              if (!bootedRef.current) {
                bootedRef.current = true;
                // Boot moment on initial desktop scroll
                if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                  setBooting(true);
                  setTimeout(() => setBooting(false), 1400);
                }
              }
            } else {
              // Hide taskbar and auto-close windows when scrolled back up
              setTaskbarVisible(false);
              closeAllWindows();
            }
          });
        },
        { threshold: 0.15 }
      );
      desktopObserver.observe(desktopEl);

      return () => {
        desktopObserver.disconnect();
        unbindChaos();
        lenis?.destroy();
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("popstate", checkNowhereRoute);
      };
    }

    return () => {
      unbindChaos();
      lenis?.destroy();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", checkNowhereRoute);
    };
  }, [openWindow, closeAllWindows, unlockSecret]);

  return (
    <div className="relative min-h-screen bg-[#040404] text-[#f4f4f6] overflow-x-hidden selection:bg-[#00ff66] selection:text-black">
      {/* Subtle Dot Grid Background Overlay */}
      <div className="hax-grid-bg" aria-hidden="true" />

      {/* 60fps Zero-GC Particle Canvas Overlay */}
      <SparkCanvas />

      {/* Subtle CRT Scanline Filter */}
      <div className="scanlines" aria-hidden="true" />

      {/* Global Fixed Mute Toggle */}
      <MuteButton />

      {/* haX Baby Style Boot Moment Overlay */}
      {booting && (
        <div
          role="status"
          aria-live="polite"
          onClick={() => setBooting(false)}
          className="fixed inset-0 z-[2000] bg-[#040404]/95 backdrop-blur-xl text-[#00ff66] font-mono text-xs p-6 flex flex-col justify-center items-center text-center cursor-pointer select-none space-y-3"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-white tracking-wider">
            <span className="status-dot"></span>
            <span>FOURIE 404 SANCTUARY // BOOT SEQUENCE</span>
          </div>
          <div className="text-[#9da3b4] text-xs">
            VERIFYING RECOVERED SECTORS... [OK]
          </div>
          <div className="text-[#9da3b4] text-xs">
            CALIBRATING 56K WEBAUDIO CELESTA... [OK]
          </div>
          <div className="text-[#00ff66] text-xs pt-2">
            LOST &amp; FOUND SANCTUARY READY. CLICK ANYWHERE TO ENTER.
          </div>
        </div>
      )}

      {/* 7 Progressive Interactive Scroll Scenes */}
      <main className="relative z-20 flex flex-col items-center w-full">
        <VoidScene />
        <DialUpScene />
        <GeoCitiesScene />
        <CloudVoidScene />
        <DesktopScene />
        <RouterScene />
        <FooterScene />
      </main>

      {/* Floating Taskbar Dock */}
      <Taskbar visible={taskbarVisible} />
    </div>
  );
};
