import React, { useEffect, useRef } from "react";
import { ParticlePool } from "../ds/ringpool";
import { bus } from "../core/bus";

export const SparkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poolRef = useRef<ParticlePool | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Scale particle capacity according to hardware concurrency
    const cores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 4 : 4;
    const poolSize = cores <= 4 ? 60 : 120;
    const pool = new ParticlePool(poolSize);
    poolRef.current = pool;

    let rafId = 0;
    let lastTime = performance.now();
    let isVisible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Listen for poke events to trigger particle bursts
    const unbindPoke = bus.on("poke", ({ x, y }) => {
      const colors = ["#00f0ff", "#ff007f", "#ffb703", "#00ff66", "#ffffff"];
      const chars = ["4", "0", "4", "0", "1", "*", ""];
      for (let i = 0; i < 8; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const char = chars[Math.floor(Math.random() * chars.length)];
        pool.emit(x, y, color, char, char ? 3.5 : 3);
      }
    });

    const loop = (currentTime: number) => {
      if (!isVisible) {
        lastTime = currentTime;
        rafId = requestAnimationFrame(loop);
        return;
      }

      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      pool.step(dt, ctx);

      rafId = requestAnimationFrame(loop);
    };

    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      unbindPoke();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="star-canvas"
      aria-hidden="true"
    />
  );
};
