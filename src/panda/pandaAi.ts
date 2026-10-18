// Intelligent AI Dialogue & Voice Engine for 3D Talking Panda

export interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  response: string;
}

// Playful AI Panda knowledge and intent responses
const PANDA_RESPONSES = [
  {
    triggers: ["dance", "nacho", "naach", "party"],
    action: "dance",
    replies: [
      "Yay! Let's party! Dekho mere happy panda dance moves! 🎵✨",
      "Balle balle! Panda dance time! Watch me bounce! 💃🐾",
    ],
  },
  {
    triggers: ["sit", "baitho", "baith", "relax"],
    action: "sit",
    replies: [
      "Haan bhai, floor pe aaram se baith kar juicy bamboo khate hain! Crunch crunch! 🎋😋",
      "Thak gaya chal ke! Thoda baith kar chill karta hoon! 🎋",
    ],
  },
  {
    triggers: ["sleep", "so jao", "neend", "bed", "rest", "soja"],
    action: "sleep",
    replies: [
      "Bohot neend aa rahi hai... Sweet dreams! Zzz... 😴💤",
      "Shhh... baby panda is taking a cozy afternoon nap on the wooden floor! 🌙",
    ],
  },
  {
    triggers: ["wave", "hello", "hi", "hey", "namaste", "pranam"],
    action: "wave",
    replies: [
      "Hey! I'm your AI Panda! Kaise ho aap? 😊🐾",
      "Namaste dost! Main aapka pyara 3D talking companion hoon! ✨",
      "Hello friend! So happy to see you here in my room! 💖",
    ],
  },
  {
    triggers: ["joke", "chutkula", "hasao", "funny"],
    action: "dance",
    replies: [
      "Ek panda ne doctor se poocha: 'Meri aankhon ke neeche dark circles kyun hain?' Doctor ne bola: 'Kyunki tu PANDA hai bhai, human nahi!' 😂🐼",
      "Panda ka favorite exercise pata hai? Rolling down the hill! Zero gym membership, 100% fun! 🎾",
      "Ek panda doosre se bola: 'Aap black and white photo me bhi coloured lagte ho!' Haha! 📸",
    ],
  },
  {
    triggers: ["who are you", "kaun ho", "tum kaun ho", "what are you"],
    action: "wave",
    replies: [
      "Main hoon aapka AI Talking Panda! Main bolta hoon, chalta hoon, aur aapki har baat sunta hoon! 🐼✨",
    ],
  },
  {
    triggers: ["what can you do", "kya kar sakte ho", "features", "skills"],
    action: "dance",
    replies: [
      "Main floor par cursor follow kar sakta hoon, dance kar sakta hoon, bamboo kha sakta hoon, mic se aapki awaaz sun sakta hoon aur funny cartoon voice me reply kar sakta hoon! 🎤🚀",
    ],
  },
  {
    triggers: ["how are you", "kaise ho", "kya haal hai", "sab theek"],
    action: "wave",
    replies: [
      "Main bilkul maze me hoon! Room me dhoop mast aa rahi hai aur bamboo bohot fresh hai! Aap batao? ☀️🎋",
    ],
  },
];

export class PandaAiEngine {
  private recognition: any = null;
  private synth: SpeechSynthesis | null = null;
  public pitch: number = 1.6; // Cute cartoon high pitch
  public rate: number = 1.05;
  public volume: number = 1.0;

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

  public get isSpeechSupported(): boolean {
    return !!this.recognition;
  }

  public startListening(
    onResult: (text: string) => void,
    onError?: (err: any) => void
  ) {
    if (!this.recognition) {
      if (onError) onError("Speech Recognition not supported in this browser.");
      return;
    }

    try {
      this.recognition.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        onResult(text);
      };
      this.recognition.onerror = (e: any) => {
        if (onError) onError(e);
      };
      this.recognition.start();
    } catch (e) {
      console.warn("Could not start speech recognition:", e);
    }
  }

  public stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
    }
  }

  // Speak with high-pitch cute cartoon voice
  public speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (!this.synth) return;

    // Cancel current speaking
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = this.pitch;
    utterance.rate = this.rate;
    utterance.volume = this.volume;

    // Pick cute/female/child voice if available for best cartoon pitch
    const voices = this.synth.getVoices();
    const cartoonVoice = voices.find(
      (v) =>
        v.name.toLowerCase().includes("samantha") ||
        v.name.toLowerCase().includes("karen") ||
        v.name.toLowerCase().includes("victoria") ||
        v.name.toLowerCase().includes("zira") ||
        v.lang.startsWith("en")
    );
    if (cartoonVoice) {
      utterance.voice = cartoonVoice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  // Process message and return { reply: string, action?: string }
  public processMessage(input: string): { reply: string; action?: string } {
    const clean = input.toLowerCase().trim();

    for (const item of PANDA_RESPONSES) {
      if (item.triggers.some((t) => clean.includes(t))) {
        const randReply =
          item.replies[Math.floor(Math.random() * item.replies.length)];
        return { reply: randReply, action: item.action };
      }
    }

    // Default friendly response
    const defaultReplies = [
      `Aww dost! "${input}"? That's so interesting! Main bamboo chabate hue sun raha hoon! 🎋❤️`,
      `Sahi baat hai! Aap batao, aage kya karein? Dance ya thoda walk? 🐾`,
      `Hehe, you are awesome! Mere room ka sunlit view pasand aaya na? ☀️🐼`,
    ];
    return {
      reply: defaultReplies[Math.floor(Math.random() * defaultReplies.length)],
      action: "walk",
    };
  }
}

export const pandaAi = new PandaAiEngine();
