// Iconic Talking Kitty Voice Engine & Sound Effects with Natural Hindi Support

export class TalkingTomAudio {
  private ctx: AudioContext | null = null;
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  public isListening: boolean = false;
  public isSpeaking: boolean = false;
  public onSpeechStart?: () => void;
  public onSpeechEnd?: () => void;

  // Real Audio Audio Elements
  private meowAudio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.synth = window.speechSynthesis || null;

      // Preload real cat meow recording
      try {
        this.meowAudio = new Audio("/assets/cat/meow2.mp3");
        this.meowAudio.volume = 0.85;
      } catch (e) {
        console.warn("Could not preload real meow audio", e);
      }

      const SpeechRec =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRec) {
        this.recognition = new SpeechRec();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        // Support Hindi and Indian bilingual voice recognition!
        this.recognition.lang = "hi-IN";
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

  // Play Real Authentic Cat Meow Audio!
  public playMeow() {
    if (this.meowAudio) {
      this.meowAudio.currentTime = 0;
      this.meowAudio.play().catch(() => {
        this.playSyntheticMeow();
      });
    } else {
      this.playSyntheticMeow();
    }
  }

  // Sweet Kawaii Kitten Meow synthesizer fallback
  public playSyntheticMeow() {
    if (!this.initCtx()) return;
    const c = this.ctx!;
    const t = c.currentTime;

    const osc = c.createOscillator();
    const g = c.createGain();

    osc.type = "sine";
    // Pitch envelope: starts 460Hz, peaks gently at 740Hz, then glides to 510Hz
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

  // Cute cartoon giggle (poke belly)
  public playGiggle() {
    this.playTone(660, 0.08, "sine", 0.3);
    setTimeout(() => this.playTone(880, 0.08, "sine", 0.32), 60);
    setTimeout(() => this.playTone(1320, 0.12, "sine", 0.35), 130);
    setTimeout(() => this.playTone(990, 0.1, "sine", 0.25), 220);
    setTimeout(() => this.playTone(1480, 0.15, "sine", 0.35), 300);
  }

  // Cartoon boing (poke head / obstacle bump)
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

  // Tuna fish / food crunch
  public playMunch() {
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        this.playTone(450 + Math.random() * 200, 0.06, "triangle", 0.2);
      }, i * 90);
    }
  }

  // Cute Milk Slurp
  public playMilkSlurp() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.playTone(600 + Math.random() * 150, 0.04, "sine", 0.18);
      }, i * 110);
    }
  }

  // Sleepy yawn
  public playYawn() {
    this.playTone(440, 0.4, "sine", 0.18);
    setTimeout(() => this.playTone(330, 0.6, "sine", 0.15), 350);
  }

  // Smooth, Sweet, Natural Voice Repeater with Native Hindi Support!
  public repeatInTomVoice(text: string) {
    if (!this.synth) return;
    this.synth.cancel();

    // Clean text: strip out asterisks, multiple emojis that cause robotic pauses
    const cleanSpeech = text
      .replace(/\*[^*]+\*/g, "") // remove *purrs*
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, "") // remove emojis for natural speech
      .trim();

    const spokenText = cleanSpeech || text;
    const utt = new SpeechSynthesisUtterance(spokenText);

    // Detect if text contains Hindi or Hinglish
    const isHindi =
      /[\u0900-\u097F]/.test(spokenText) ||
      /\b(namaste|kya|hai|hoon|billi|dost|karo|batao|kaise|achha|pyari|meow|miau|haan|nahi|khelte|khalo|sunao)\b/i.test(
        spokenText
      );

    const voices = this.synth.getVoices();

    if (isHindi) {
      // Find native Hindi voice (Google Hindi, Microsoft Swara / Madhur / Kalpana / Hemant)
      const hindiVoice = voices.find(
        (v) =>
          v.lang === "hi-IN" ||
          v.lang.startsWith("hi") ||
          v.name.toLowerCase().includes("hindi") ||
          v.name.toLowerCase().includes("swara") ||
          v.name.toLowerCase().includes("madhur") ||
          v.name.toLowerCase().includes("kalpana") ||
          v.name.toLowerCase().includes("hemant")
      );

      if (hindiVoice) {
        utt.voice = hindiVoice;
      }
      utt.lang = "hi-IN";
      // Sweet, melodious, cheerful kitten pitch (smooth natural Hindi)
      utt.pitch = 1.35;
      utt.rate = 1.02;
    } else {
      // English cute cartoon voice
      const cartoonVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("victoria") ||
          v.name.toLowerCase().includes("karen") ||
          v.lang.startsWith("en")
      );
      if (cartoonVoice) utt.voice = cartoonVoice;
      utt.pitch = 1.45;
      utt.rate = 1.05;
    }

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

  // Alias
  public repeatInCatVoice(text: string) {
    this.repeatInTomVoice(text);
  }

  // Listen to microphone in speech recognition
  public listen(onResult: (text: string) => void) {
    if (!this.recognition) {
      this.repeatInTomVoice("Tap me to talk or type in the chat box.");
      return;
    }

    try {
      this.isListening = true;
      this.recognition.lang = navigator.language || "en-US";
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
