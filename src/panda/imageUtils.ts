// Client-side image cutout utility to make pure white backgrounds transparent

const cache: Record<string, string> = {};

export async function getTransparentImage(src: string): Promise<string> {
  if (cache[src]) return cache[src];

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(src);
          return;
        }
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;

        // Process pixels: remove pure studio white background with soft antialiasing
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];

          // White threshold
          if (r > 235 && g > 235 && b > 235) {
            const minChannel = Math.min(r, g, b);
            if (minChannel >= 248) {
              d[i + 3] = 0; // Fully transparent
            } else {
              // Smooth edge feathering
              const alpha = Math.floor(((248 - minChannel) / 13) * 255);
              d[i + 3] = Math.min(d[i + 3], alpha);
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const dataUrl = canvas.toDataURL("image/png");
        cache[src] = dataUrl;
        resolve(dataUrl);
      } catch (e) {
        console.warn("Could not process canvas transparency, fallback to source", e);
        resolve(src);
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}
