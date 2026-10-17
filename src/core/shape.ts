// Responsive Chaos Mode detector

export type ScreenShape = "pocket" | "phone" | "tablet" | "desktop" | "cinema";

export function getScreenShape(w: number, h: number): ScreenShape {
  if (w < 360) return "pocket";
  if (w / h > 2.1) return "cinema";
  if (w < 768) return "phone";
  if (w < 1100) return "tablet";
  return "desktop";
}

export function initChaosObserver(onShapeChange?: (shape: ScreenShape) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const shape = getScreenShape(w, h);
    document.body.dataset.shape = shape;
    onShapeChange?.(shape);
  };

  const observer = new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;
    const shape = getScreenShape(width, height);
    document.body.dataset.shape = shape;
    onShapeChange?.(shape);
  });

  observer.observe(document.documentElement);
  handler();

  return () => observer.disconnect();
}
