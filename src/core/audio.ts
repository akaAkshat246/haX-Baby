// Web Audio API Procedural Synthesizer for Fourie

export class AudioEngine {
  private ctx?: AudioContext;
  private master?: GainNode;
  public muted: boolean = false;

  constructor() {
    try {
      this.muted = localStorage.getItem("fourie:muted") === "1";
    } catch {
      this.muted = false;
    }
  }

  public get now(): number {
    return this.ctx?.currentTime ?? 0;
  }

  private init(): boolean {
    if (this.ctx) return true;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.4;
      this.master.connect(this.ctx.destination);
      return true;
    } catch (e) {
      console.warn("Web Audio not supported in this environment", e);
      return false;
    }
  }

  public async unlock(): Promise<void> {
    if (!this.init()) return;
    if (this.ctx && this.ctx.state !== "running") {
      try {
        await this.ctx.resume();
      } catch (e) {
        console.warn("Could not resume AudioContext:", e);
      }
    }
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    try {
      localStorage.setItem("fourie:muted", muted ? "1" : "0");
    } catch {}
    if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.4, this.ctx.currentTime, 0.03);
    }
  }

  public note(
    freq: number,
    delay = 0,
    dur = 0.9,
    type: OscillatorType = "sine",
    gainLevel = 0.35
  ) {
    if (this.muted) return;
    if (!this.init()) return;
    const c = this.ctx!;
    const t = c.currentTime + delay;

    const osc = c.createOscillator();
    const gain = c.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(gainLevel, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(gain);
    gain.connect(this.master!);

    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  public click() {
    this.note(880, 0, 0.08, "triangle", 0.2);
  }

  public squeak() {
    this.note(720, 0, 0.08, "square", 0.15);
    this.note(1100, 0.06, 0.12, "sine", 0.2);
  }

  public glitch() {
    if (this.muted) return;
    if (!this.init()) return;
    const c = this.ctx!;
    const t = c.currentTime;

    const osc = c.createOscillator();
    const gain = c.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.linearRampToValueAtTime(1600, t + 0.04);
    osc.frequency.setValueAtTime(150, t + 0.07);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.master!);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  // Procedural 1990s 56k Dial-Up modem handshake
  public playDialUpSimulation() {
    if (this.muted) return;
    if (!this.init()) return;
    const c = this.ctx!;
    const start = c.currentTime + 0.05;

    // Phase 1: Dual dial tone (350Hz + 440Hz)
    const dt1 = c.createOscillator();
    const dt2 = c.createOscillator();
    const dtGain = c.createGain();
    dt1.frequency.value = 350;
    dt2.frequency.value = 440;
    dtGain.gain.setValueAtTime(0.12, start);
    dtGain.gain.setValueAtTime(0.12, start + 0.6);
    dtGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.7);

    dt1.connect(dtGain);
    dt2.connect(dtGain);
    dtGain.connect(this.master!);
    dt1.start(start);
    dt2.start(start);
    dt1.stop(start + 0.75);
    dt2.stop(start + 0.75);

    // Phase 2: DTMF dial beeps
    const beeps = [941, 1336, 770, 1209, 697, 1477, 852, 1209];
    let beepTime = start + 0.8;
    beeps.forEach((freq, idx) => {
      this.note(freq, beepTime - c.currentTime, 0.05, "sine", 0.15);
      if (idx % 2 === 1) beepTime += 0.09;
    });

    // Phase 3: Handshake whistling & screech
    const hsTime = start + 1.4;
    const carrier = c.createOscillator();
    const cGain = c.createGain();
    carrier.type = "sawtooth";
    carrier.frequency.setValueAtTime(1200, hsTime);
    carrier.frequency.exponentialRampToValueAtTime(2400, hsTime + 0.6);
    carrier.frequency.setValueAtTime(1800, hsTime + 0.7);

    cGain.gain.setValueAtTime(0.001, hsTime);
    cGain.gain.linearRampToValueAtTime(0.15, hsTime + 0.1);
    cGain.gain.linearRampToValueAtTime(0.08, hsTime + 0.9);
    cGain.gain.exponentialRampToValueAtTime(0.0001, hsTime + 1.4);

    carrier.connect(cGain);
    cGain.connect(this.master!);
    carrier.start(hsTime);
    carrier.stop(hsTime + 1.45);

    // Phase 4: Resolution chime
    setTimeout(() => {
      this.note(523.25, 0, 0.5, "sine", 0.3); // C5
      this.note(659.25, 0.12, 0.6, "sine", 0.3); // E5
      this.note(783.99, 0.24, 0.9, "sine", 0.3); // G5
    }, (start + 2.8 - c.currentTime) * 1000);
  }
}

export const audio = new AudioEngine();
