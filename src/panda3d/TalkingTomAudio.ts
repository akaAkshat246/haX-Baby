// Iconic Talking Tom Voice Engine & Cartoon Sound Effects

export class TalkingTomAudio {
  private ctx: AudioContext | null = null;
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  public isListening: boolean = false;
  public isSpeaking: boolean = false;
  public onSpeechStart?: () => void;
  public onSpeechEnd?: () => void;

  constructor() {
    if (typeof window !== "undefined") {
      this.synth = window.speechSynthesis || null;

      const SpeechRec =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRec) {
        this.recognition = new SpeechRec();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = "en-US";
      }
    }
  }

  private initCtx(): boolean {
    if (this.ctx) return true;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();
      return true;
    } catch {
      return false;
    }
  }

  // Play synthesized procedural note
  public playTone(freq: number, dur: number = 0.2, type: OscillatorType = "sine", gainVal: number = 0.25) {
    if (!this.initCtx()) return;
    const c = this.ctx!;
    const t = c.currentTime;

    const osc = c.createOscillator();
    const g = c.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);

    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gainVal, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(g);
    g.connect(c.destination);

    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  // Cute cartoon giggle (poke belly)
  public playGiggle() {
    this.playTone(660, 0.08, "sine", 0.3);
    setTimeout(() => this.playTone(880, 0.08, "sine", 0.32), 60);
    setTimeout(() => this.playTone(1320, 0.12, "sine", 0.35), 130);
    setTimeout(() => this.playTone(990, 0.1, "sine", 0.25), 220);
    setTimeout(() => this.playTone(1480, 0.15, "sine", 0.35), 300);
  }

  // Cartoon boing (poke head)
  public playBoing() {
    if (!this.initCtx()) return;
    const c = this.ctx!;
    const t = c.currentTime;

    const osc = c.createOscillator();
    const g = c.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.25);

    g.gain.setValueAtTime(0.3, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(g);
    g.connect(c.destination);

    osc.start(t);
    osc.stop(t + 0.32);
  }

  // Bamboo munch / crunch
  public playMunch() {
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        this.playTone(450 + Math.random() * 200, 0.06, "triangle", 0.2);
      }, i * 90);
    }
  }

  // Spicy gasp & sneeze (chili)
  public playSpicyGasp() {
    this.playTone(800, 0.15, "sawtooth", 0.2);
    setTimeout(() => {
      this.playTone(1200, 0.25, "square", 0.25);
    }, 180);
  }

  // Goofy Talking Tom fart sound
  public playFart() {
    if (!this.initCtx()) return;
    const c = this.ctx!;
    const t = c.currentTime;

    const osc = c.createOscillator();
    const g = c.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.linearRampToValueAtTime(55, t + 0.35);

    g.gain.setValueAtTime(0.35, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

    osc.connect(g);
    g.connect(c.destination);

    osc.start(t);
    osc.stop(t + 0.4);

    // Followed by giggle
    setTimeout(() => this.playGiggle(), 450);
  }

  // Sleepy yawn
  public playYawn() {
    this.playTone(440, 0.4, "sine", 0.18);
    setTimeout(() => this.playTone(330, 0.6, "sine", 0.15), 350);
  }

  // Sweet Kawaii Kitten Meow
  public playMeow() {
    if (!this.initCtx()) return;
    const c = this.ctx!;
    const t = c.currentTime;

    const osc = c.createOscillator();
    const g = c.createGain();

    osc.type = "sine";
    // Pitch envelope: starts medium (440Hz), peaks playfully (680Hz), then gently glides down (520Hz)
    osc.frequency.setValueAtTime(460, t);
    osc.frequency.exponentialRampToValueAtTime(740, t + 0.12);
    osc.frequency.exponentialRampToValueAtTime(510, t + 0.42);

    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(0.28, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(g);
    g.connect(c.destination);

    osc.start(t);
    osc.stop(t + 0.48);
  }

  // Deep Contented Kitten Purr
  public playPurr() {
    if (!this.initCtx()) return;
    const c = this.ctx!;
    const t = c.currentTime;

    // Modulated low-frequency rumble
    const osc = c.createOscillator();
    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    const g = c.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(85, t);

    lfo.type = "sine";
    lfo.frequency.setValueAtTime(26, t); // 26Hz purr flutter
    lfoGain.gain.setValueAtTime(22, t);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(0.22, t + 0.1);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

    osc.connect(g);
    g.connect(c.destination);

    lfo.start(t);
    osc.start(t);
    lfo.stop(t + 1.25);
    osc.stop(t + 1.25);
  }

  // Cute Milk Slurp
  public playMilkSlurp() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.playTone(600 + Math.random() * 150, 0.04, "sine", 0.18);
      }, i * 110);
    }
  }

  // Talking Tom's Iconic Voice Repeat with cartoon helium pitch
  public repeatInTomVoice(text: string) {
    if (!this.synth) return;
    this.synth.cancel();

    const utt = new SpeechSynthesisUtterance(text);
    // Talking Tom Helium Pitch & Speed!
    utt.pitch = 1.72;
    utt.rate = 1.12;

    const voices = this.synth.getVoices();
    const cartoonVoice = voices.find(
      (v) =>
        v.name.toLowerCase().includes("samantha") ||
        v.name.toLowerCase().includes("victoria") ||
        v.name.toLowerCase().includes("karen") ||
        v.lang.startsWith("en")
    );
    if (cartoonVoice) utt.voice = cartoonVoice;

    utt.onstart = () => {
      this.isSpeaking = true;
      if (this.onSpeechStart) this.onSpeechStart();
    };

    utt.onend = () => {
      this.isSpeaking = false;
      if (this.onSpeechEnd) this.onSpeechEnd();
    };

    utt.onerror = () => {
      this.isSpeaking = false;
      if (this.onSpeechEnd) this.onSpeechEnd();
    };

    this.synth.speak(utt);
  }

  // Listen to microphone
  public listen(onResult: (text: string) => void) {
    if (!this.recognition) {
      this.repeatInTomVoice("Hello! Tap me or type in the chat!");
      return;
    }

    try {
      this.isListening = true;
      this.recognition.onresult = (e: any) => {
        this.isListening = false;
        const transcript = e.results[0][0].transcript;
        onResult(transcript);
      };
      this.recognition.onerror = () => {
        this.isListening = false;
      };
      this.recognition.onend = () => {
        this.isListening = false;
      };
      this.recognition.start();
    } catch {
      this.isListening = false;
    }
  }
}

export const tomAudio = new TalkingTomAudio();
