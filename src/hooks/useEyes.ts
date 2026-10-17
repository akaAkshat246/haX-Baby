import { useEffect, useRef } from "react";

export function useEyes(maxOffset = 10) {
  const pupilsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const el = pupilsRef.current;
    if (!el) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = 0;
    let lastPointerTime = performance.now();

    const updateTargetFromPointer = (clientX: number, clientY: number) => {
      const svg = el.ownerSVGElement;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;

      const angle = Math.atan2(clientY - originY, clientX - originX);
      const distance = Math.min(1, Math.hypot(clientX - originX, clientY - originY) / 280);

      targetX = Math.cos(angle) * maxOffset * distance;
      targetY = Math.sin(angle) * maxOffset * distance;
      lastPointerTime = performance.now();
    };

    const onPointerMove = (e: PointerEvent) => {
      updateTargetFromPointer(e.clientX, e.clientY);
    };

    const tick = (time: number) => {
      // Natural idle wandering when pointer is still for > 2500ms
      if (time - lastPointerTime > 2500) {
        targetX = Math.sin(time / 1400) * maxOffset * 0.65;
        targetY = Math.cos(time / 1800) * maxOffset * 0.35;
      }

      // Smooth lerp easing
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;

      el.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerMove);
      cancelAnimationFrame(rafId);
    };
  }, [maxOffset]);

  return pupilsRef;
}
