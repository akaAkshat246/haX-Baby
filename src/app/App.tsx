import React, { useEffect } from "react";
import { AndroidDesktop } from "../android/AndroidDesktop";
import { StoryLanding } from "../story/StoryLanding";
import { TalkingPandaApp } from "../panda3d/TalkingPandaApp";
import { initChaosObserver } from "../core/shape";
import { useStore } from "../core/store";
import { audio } from "../core/audio";
import { SequenceBuffer } from "../ds/sequenceBuffer";

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
  const viewMode = useStore((s) => s.viewMode);
  const openWindow = useStore((s) => s.openWindow);
  const unlockSecret = useStore((s) => s.unlockSecret);
  const showToast = useStore((s) => s.showToast);

  useEffect(() => {
    // 1. Initialize Responsive Chaos Mode
    const unbindChaos = initChaosObserver((shape) => {
      useStore.getState().setShape(shape);
    });

    // 2. Konami Code detector
    const konamiBuffer = new SequenceBuffer<string>(KONAMI_SEQUENCE.length);
    const handleKeyDown = (e: KeyboardEvent) => {
      konamiBuffer.push(e.key);
      if (konamiBuffer.matches(KONAMI_SEQUENCE, (a, b) => a.toLowerCase() === b.toLowerCase())) {
        audio.glitch();
        unlockSecret();
        openWindow("nowhere");
        showToast("Easter Egg: Secret Backroom Unlocked!");
        konamiBuffer.clear();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // 3. Easter egg /nowhere URL detector
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

    return () => {
      unbindChaos();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", checkNowhereRoute);
    };
  }, [openWindow, unlockSecret, showToast]);

  // The entire website runs persistently in Three.js and WebGL
  return <TalkingPandaApp />;
};

