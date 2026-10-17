// Zero-GC Object Pool & Ring Buffer for 60fps Canvas Particle Animation

export class Particle {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  life = 0;
  maxLife = 1;
  size = 3;
  color = "#00f0ff";
  text = "";
  active = false;
}

export class ParticlePool {
  private particles: Particle[];
  private head = 0;

  constructor(size = 100) {
    this.particles = Array.from({ length: size }, () => new Particle());
  }

  public emit(
    x: number,
    y: number,
    color = "#00f0ff",
    text = "",
    size = 3
  ): void {
    const p = this.particles[this.head];
    this.head = (this.head + 1) % this.particles.length;

    p.active = true;
    p.x = x;
    p.y = y;
    p.vx = (Math.random() - 0.5) * 1.6;
    p.vy = (Math.random() - 0.7) * 1.8;
    p.maxLife = 0.7 + Math.random() * 0.6;
    p.life = p.maxLife;
    p.size = size;
    p.color = color;
    p.text = text;
  }

  public step(dt: number, ctx: CanvasRenderingContext2D): void {
    for (const p of this.particles) {
      if (!p.active) continue;

      p.life -= dt;
      if (p.life <= 0) {
        p.active = false;
        continue;
      }

      p.x += p.vx * dt * 60;
      p.y += p.vy * dt * 60;

      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;

      if (p.text) {
        ctx.fillStyle = p.color;
        ctx.font = `${Math.floor(p.size * 3)}px "Press Start 2P", monospace`;
        ctx.fillText(p.text, p.x, p.y);
      } else {
        // Draw 8-point pixel retro star
        this.drawPixelStar(ctx, p.x, p.y, p.size, p.color);
      }
    }
    ctx.globalAlpha = 1;
  }

  private drawPixelStar(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r: number,
    color: string
  ): void {
    ctx.fillStyle = color;
    // Retro cross / diamond shape
    ctx.fillRect(cx - r, cy, r * 2, 1);
    ctx.fillRect(cx, cy - r, 1, r * 2);
    ctx.fillRect(cx - r * 0.5, cy - r * 0.5, r, r);
  }

  public clear(): void {
    for (const p of this.particles) {
      p.active = false;
    }
  }
}
