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
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      this.synth = window.speechSynthesis || null;

      if (this.synth) {
        this.voices = this.synth.getVoices();
        if (typeof this.synth.onvoiceschanged !== "undefined") {
          this.synth.onvoiceschanged = () => {
            if (this.synth) this.voices = this.synth.getVoices();
          };
        }
      }

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

  public unlockAudio() {
    this.initCtx();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    if (this.synth && this.synth.paused) {
      this.synth.resume();
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
  public repeatInTomVoice(text: string, preferredLanguage?: string) {
    if (!this.synth) return;
    this.synth.cancel();

    // Clean text: strip out asterisks, multiple emojis that cause robotic pauses
    const cleanSpeech = text
      .replace(/\*[^*]+\*/g, "") // remove *purrs*
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, "") // remove emojis for natural speech
      .trim();

    const spokenText = cleanSpeech || text;
    const utt = new SpeechSynthesisUtterance(spokenText);
    const voices = (this.synth.getVoices && this.synth.getVoices().length > 0)
      ? this.synth.getVoices()
      : this.voices;

    // Multilingual Voice Detection
    // 1. Russian
    const isRussian =
      /[\u0400-\u04FF]/.test(spokenText) ||
      /\b(привет|как|дела|мяу|спасибо|котёнок|друг|хорошо)\b/i.test(spokenText);

    // 2. French
    const isFrench =
      /[éèêëàâîïôûùçœ]/.test(spokenText) ||
      /\b(bonjour|salut|comment|chat|chaton|merci|miaou|oui|ami|bien)\b/i.test(spokenText);

    // 3. Telugu
    const isTelugu =
      /[\u0C00-\u0C7F]/.test(spokenText) ||
      /\b(namaskaram|ela|unnaru|nenu|pilli|bagunara|enti|cheppu|nestama)\b/i.test(spokenText);

    // 4. Kannada
    const isKannada =
      /[\u0C80-\u0CFF]/.test(spokenText) ||
      /\b(namaskara|hegiddeera|hegiddiya|beku|nanu|chennagiddira|oota|aytha|snehitha)\b/i.test(spokenText);

    // 5. Marathi
    const isMarathi =
      /\b(namaskar|kashi|aahes|aahat|majha|naav|kuthe|kay|kartos|marathi|khelayla)\b/i.test(spokenText);

    // 6. Hindi / Hinglish
    const isHindi =
      /[\u0900-\u097F]/.test(spokenText) ||
      /\b(namaste|kya|hai|hoon|billi|dost|karo|batao|kaise|achha|pyari|haan|nahi|khelte|khalo|sunao|shukriya|bahut)\b/i.test(
        spokenText
      );

    let chosenVoice: SpeechSynthesisVoice | undefined;
    let chosenLang = "en-US";
    let chosenPitch = 1.78;
    let chosenRate = 1.15;

    if (isRussian) {
      chosenVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith("ru") ||
          v.name.toLowerCase().includes("russian") ||
          v.name.toLowerCase().includes("milena") ||
          v.name.toLowerCase().includes("dmitry") ||
          v.name.toLowerCase().includes("tatyana")
      );
      chosenLang = chosenVoice?.lang || "ru-RU";
      chosenPitch = 1.75;
      chosenRate = 1.12;
    } else if (isFrench) {
      chosenVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith("fr") ||
          v.name.toLowerCase().includes("french") ||
          v.name.toLowerCase().includes("thomas") ||
          v.name.toLowerCase().includes("audrey") ||
          v.name.toLowerCase().includes("amelie")
      );
      chosenLang = chosenVoice?.lang || "fr-FR";
      chosenPitch = 1.8;
      chosenRate = 1.15;
    } else if (isTelugu) {
      chosenVoice =
        voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith("te") ||
            v.name.toLowerCase().includes("telugu") ||
            v.name.toLowerCase().includes("mohan") ||
            v.name.toLowerCase().includes("chitra")
        ) ||
        voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith("hi") ||
            v.lang.toLowerCase().includes("in") ||
            v.name.toLowerCase().includes("hindi")
        );
      chosenLang = chosenVoice?.lang || "hi-IN";
      chosenPitch = 1.76;
      chosenRate = 1.15;
    } else if (isKannada) {
      chosenVoice =
        voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith("kn") ||
            v.name.toLowerCase().includes("kannada") ||
            v.name.toLowerCase().includes("sapna") ||
            v.name.toLowerCase().includes("gagan")
        ) ||
        voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith("hi") ||
            v.lang.toLowerCase().includes("in") ||
            v.name.toLowerCase().includes("hindi")
        );
      chosenLang = chosenVoice?.lang || "hi-IN";
      chosenPitch = 1.76;
      chosenRate = 1.15;
    } else if (isMarathi) {
      chosenVoice =
        voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith("mr") ||
            v.name.toLowerCase().includes("marathi") ||
            v.name.toLowerCase().includes("aarohi") ||
            v.name.toLowerCase().includes("manohar")
        ) ||
        voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith("hi") ||
            v.name.toLowerCase().includes("hindi") ||
            v.lang.toLowerCase().includes("in")
        );
      chosenLang = chosenVoice?.lang || "hi-IN";
      chosenPitch = 1.76;
      chosenRate = 1.15;
    } else if (isHindi) {
      chosenVoice = voices.find(
        (v) =>
          v.lang.toLowerCase() === "hi-in" ||
          v.lang.toLowerCase().startsWith("hi") ||
          v.name.toLowerCase().includes("hindi") ||
          v.name.toLowerCase().includes("swara") ||
          v.name.toLowerCase().includes("madhur") ||
          v.name.toLowerCase().includes("kalpana") ||
          v.name.toLowerCase().includes("hemant")
      );
      chosenLang = chosenVoice?.lang || "hi-IN";
      chosenPitch = 1.75;
      chosenRate = 1.15;
    } else {
      // English cute cartoon cat voice
      chosenVoice =
        voices.find(
          (v) =>
            v.name.toLowerCase().includes("samantha") ||
            v.name.toLowerCase().includes("victoria") ||
            v.name.toLowerCase().includes("karen") ||
            v.name.toLowerCase().includes("zira") ||
            v.lang.toLowerCase().startsWith("en")
        ) || (voices.length > 0 ? voices[0] : undefined);
      chosenLang = chosenVoice?.lang || "en-US";
      chosenPitch = 1.8;
      chosenRate = 1.18;
    }

    if (preferredLanguage) {
      const languagePrefix = preferredLanguage.toLowerCase().split("-")[0];
      chosenVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith(languagePrefix));
      chosenLang = chosenVoice?.lang || preferredLanguage;
    }

    if (chosenVoice) {
      utt.voice = chosenVoice;
    }
    utt.lang = chosenLang;
    utt.pitch = chosenPitch;
    utt.rate = chosenRate;
    utt.volume = 1.0;

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

    // Unlock and ensure speech synthesis resume in Chromium
    this.unlockAudio();

    setTimeout(() => {
      try {
        if (this.synth) {
          if (this.synth.paused) this.synth.resume();
          this.synth.speak(utt);
        }
      } catch (e) {
        console.warn("Speech synthesis error:", e);
      }
    }, 40);
  }

  // Alias
  public repeatInCatVoice(text: string, preferredLanguage?: string) {
    this.repeatInTomVoice(text, preferredLanguage);
  }

  // Listen to microphone in speech recognition
  public listen(onResult: (text: string) => void, language = "en-US", onStop?: () => void) {
    if (!this.recognition) {
      return false;
    }

    try {
      this.isListening = true;
      this.recognition.lang = language || navigator.language || "en-US";
      this.recognition.onresult = (e: any) => {
        this.isListening = false;
        const transcript = e.results[0][0].transcript;
        onResult(transcript);
      };
      this.recognition.onerror = () => {
        this.isListening = false;
        onStop?.();
      };
      this.recognition.onend = () => {
        this.isListening = false;
        onStop?.();
      };
      this.recognition.start();
      return true;
    } catch {
      this.isListening = false;
      onStop?.();
      return false;
    }
  }
}

export const tomAudio = new TalkingTomAudio();
