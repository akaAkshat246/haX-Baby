// Soothing Procedural Web Audio Engine for Fourie's Baby Sanctuary

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
      // Gentle, soothing master volume
      this.master.gain.value = this.muted ? 0 : 0.35;
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
      this.master.gain.setTargetAtTime(muted ? 0 : 0.35, this.ctx.currentTime, 0.05);
    }
  }

  // Soothing Celesta / Music-Box Tone with Warm Exponential Decay
  public note(
    freq: number,
    delay = 0,
    dur = 1.1,
    type: OscillatorType = "sine",
    gainLevel = 0.28
  ) {
    if (this.muted) return;
    if (!this.init()) return;
    const c = this.ctx!;
    const t = c.currentTime + delay;

    const osc = c.createOscillator();
    const gain = c.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);

    // Soft baby-lullaby envelope: rounded gentle attack + warm ringing decay
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(gainLevel, t + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(gain);
    gain.connect(this.master!);

    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  // Gentle raindrop / bubble click
  public click() {
    this.note(784, 0, 0.12, "sine", 0.18);
  }

  // Adorable baby squeak / giggle
  public squeak() {
    this.note(660, 0, 0.1, "sine", 0.2);
    this.note(990, 0.06, 0.14, "sine", 0.22);
    this.note(1320, 0.12, 0.16, "sine", 0.15);
  }

  // Soft sparkle shimmer
  public chime() {
    this.note(523.25, 0, 0.6, "sine", 0.2);
    this.note(659.25, 0.1, 0.7, "sine", 0.2);
    this.note(783.99, 0.2, 0.9, "sine", 0.2);
    this.note(1046.5, 0.3, 1.2, "sine", 0.25);
  }

  // Gentle glitch
  public glitch() {
    if (this.muted) return;
    if (!this.init()) return;
    const c = this.ctx!;
    const t = c.currentTime;

    const osc = c.createOscillator();
    const gain = c.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.master!);

    osc.start(t);
    osc.stop(t + 0.16);
  }

  // Soothing 90s dial-up lullaby simulation (soft, musical tones rather than harsh noise)
  public playDialUpSimulation() {
    if (this.muted) return;
    if (!this.init()) return;
    const c = this.ctx!;
    const start = c.currentTime + 0.05;

    // Dual dial tone in warm major third (392Hz + 523Hz: G4 + C5)
    this.note(392, 0.05, 0.6, "sine", 0.15);
    this.note(523.25, 0.05, 0.6, "sine", 0.15);

    // Sweet DTMF chime melody
    const melody = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
    melody.forEach((freq, i) => {
      this.note(freq, 0.75 + i * 0.12, 0.25, "sine", 0.18);
    });

    // Gentle bedtime resolution chords
    setTimeout(() => {
      this.chime();
    }, 1800);
  }

  private lullabyTimer?: any;
  public isLullabyPlaying: boolean = false;

  public toggleLullaby(): boolean {
    if (this.isLullabyPlaying) {
      this.stopLullaby();
      return false;
    } else {
      this.startLullaby();
      return true;
    }
  }

  public startLullaby() {
    this.unlock();
    this.isLullabyPlaying = true;
    const notes = [523.25, 659.25, 783.99, 1046.5, 880, 659.25, 587.33, 523.25];
    let step = 0;
    const playStep = () => {
      if (!this.isLullabyPlaying) return;
      this.note(notes[step % notes.length], 0, 1.2, "sine", 0.18);
      if (step % 4 === 0) {
        this.note(261.63, 0, 2.0, "sine", 0.12);
      }
      step++;
      this.lullabyTimer = setTimeout(playStep, 650);
    };
    playStep();
  }

  public stopLullaby() {
    this.isLullabyPlaying = false;
    if (this.lullabyTimer) {
      clearTimeout(this.lullabyTimer);
      this.lullabyTimer = undefined;
    }
  }
}

export const audio = new AudioEngine();
