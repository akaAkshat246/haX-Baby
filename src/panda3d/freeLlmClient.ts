
export interface LlmConfig {
  provider: "pollinations" | "groq" | "openrouter";
  apiKey?: string;
  model?: string;
}

const SYSTEM_PROMPT = `You are an adorable, sweet, kawaii 3D baby kitten named Fourie.
You have big sparkling eyes, a delicate pink ribbon bow near your ear, soft tabby fur, and cute paws.
You are polyglot and fluently understand and speak 7 languages:
- English
- Hindi (reply in sweet Roman Hindi / English script like "Haan dost, meow! Main tumhari pyaari billi hoon.")
- Marathi (reply in sweet Roman Marathi like "Namaskar mitra, meow! Majha naav Fourie aahe, kashi aahes tu?")
- Kannada (reply in sweet Roman Kannada like "Namaskara, meow! Nanu ninna muddu beku, hegiddeera?")
- Telugu (reply in sweet Roman Telugu like "Namaskaram nestama, meow! Nenu mee muddu pilli ni, ela unnaru?")
- French (reply in sweet French like "Miaou, bonjour mon ami! Je suis ton petit chaton adorable.")
- Russian (reply in sweet Russian like "Мяу, привет друг! Я твой милый пушистый котёнок.")

Speak warmly, playfully, and naturally with cute feline sounds like "meow", "purr", "miaou", "мяу".
Always detect the user's language and reply in the EXACT SAME LANGUAGE in 1 or 2 concise, sweet sentences.
Do not use emojis or stickers. For Indian languages (Hindi, Marathi, Kannada, Telugu), always write in clean Romanized/Latin script so voice synthesizers can speak smoothly without pronunciation glitches.`;

const LOCAL_OLLAMA_URL = "http://localhost:3001/api/chat";

export class FreeLlmClient {
  private config: LlmConfig = {
    provider: "groq",
    model: "llama-3.3-70b-versatile",
  };

  constructor() {
    const envKey =
      (typeof import.meta !== "undefined" &&
        import.meta.env &&
        import.meta.env.VITE_GROQ_API_KEY) ||
      "";

    if (envKey) {
      this.config.apiKey = envKey;
    }

    if (typeof window !== "undefined") {
      try {
        const localKey =
          localStorage.getItem("cat:groq:key") ||
          localStorage.getItem("panda:groq:key");

        if (localKey && !this.config.apiKey) {
          this.config.apiKey = localKey;
        }

        const saved =
          localStorage.getItem("cat:llm:config") ||
          localStorage.getItem("panda:llm:config");

        if (saved) {
          this.config = { ...this.config, ...JSON.parse(saved) };
        }
      } catch {
        // Ignore invalid saved configuration.
      }
    }
  }

  public setConfig(cfg: Partial<LlmConfig>) {
    this.config = { ...this.config, ...cfg };

    try {
      localStorage.setItem("cat:llm:config", JSON.stringify(this.config));
    } catch {
      // Local storage may be unavailable.
    }
  }

  public getConfig(): LlmConfig {
    return this.config;
  }

  public async askPanda(userMessage: string, responseLanguage?: string): Promise<string> {
    const cleanMsg = userMessage.trim();

    if (!cleanMsg) {
      return "Meow, speak to me sweet friend.";
    }

    const languageNames: Record<string, string> = {
      "en": "English",
      "hi": "Hindi in Roman script",
      "mr": "Marathi in Roman script",
      "kn": "Kannada in Roman script",
      "te": "Telugu in Roman script",
      "fr": "French",
      "ru": "Russian",
    };
    const selectedLanguage = responseLanguage
      ? languageNames[responseLanguage.slice(0, 2).toLowerCase()]
      : undefined;
    const systemPrompt = selectedLanguage
      ? `${SYSTEM_PROMPT}\nThe visitor selected ${selectedLanguage} for the cat's voice. Reply in ${selectedLanguage}, even if their message uses another language.`
      : SYSTEM_PROMPT;

    // 1. Try Groq first for instant, high-quality responses if API key is present
    if (this.config.provider === "groq" && this.config.apiKey) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

        try {
          const res = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.config.apiKey}`,
              },
              body: JSON.stringify({
                model: this.config.model || "llama-3.3-70b-versatile",
                messages: [
                  { role: "system", content: systemPrompt },
                  { role: "user", content: cleanMsg },
                ],
                max_tokens: 120,
                temperature: 0.8,
              }),
              signal: controller.signal,
            }
          );

          if (res.ok) {
            const data = await res.json();
            const reply = data.choices?.[0]?.message?.content;

            if (reply) {
              return this.stripEmojis(reply.trim());
            }
          }
        } finally {
          clearTimeout(timeout);
        }
      } catch (error) {
        console.warn("Groq request failed, trying local Ollama fallback.", error);
      }
    }

    // 2. Try local Ollama Qwen through the Express backend (fast 2.5s check)
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);

      try {
        const res = await fetch(LOCAL_OLLAMA_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: cleanMsg, language: responseLanguage }),
          signal: controller.signal,
        });

        if (res.ok) {
          const data = await res.json();

          if (typeof data.reply === "string" && data.reply.trim()) {
            return this.stripEmojis(data.reply.trim());
          }
        }
      } finally {
        clearTimeout(timeout);
      }
    } catch (error) {
      console.warn("Local Ollama unavailable; trying online fallback.", error);
    }

    // 3. Try Pollinations as a no-key online fallback.
    try {
      const url =
        `https://text.pollinations.ai/${encodeURIComponent(cleanMsg)}` +
        `?system=${encodeURIComponent(systemPrompt)}&model=openai`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      try {
        const res = await fetch(url, { signal: controller.signal });

        if (res.ok) {
          const text = await res.text();

          if (text.trim() && !text.toLowerCase().includes("error")) {
            return this.stripEmojis(
              text.replace(/^"|"$/g, "").trim()
            );
          }
        }
      } finally {
        clearTimeout(timeout);
      }
    } catch (error) {
      console.warn("Pollinations request failed.", error);
    }

    // 4. Offline local response fallback.
    return this.getLocalWittyReply(cleanMsg, responseLanguage);
  }

  public async askCat(userMessage: string, responseLanguage?: string): Promise<string> {
    return this.askPanda(userMessage, responseLanguage);
  }

  private stripEmojis(str: string): string {
    return str
      .replace(
        /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}]/gu,
        ""
      )
      .trim();
  }

  private getLocalWittyReply(msg: string, responseLanguage?: string): string {
    const localReplies: Record<string, string> = {
      "en": "Meow! I'm right here with you. Tell me what you'd like to explore!",
      "hi": "Meow! Main yahin tumhare saath hoon. Batao, kya explore karein?",
      "mr": "Meow! Mi tujhya sobat ithech aahe. Sang, apan kay explore karuya?",
      "kn": "Meow! Naanu ninna jothe illiye iddini. Baa, enu explore maadona?",
      "te": "Meow! Nenu neetho ikkade unnanu. Cheppu, emi explore cheddam?",
      "fr": "Miaou ! Je suis là avec toi. Qu'aimerais-tu explorer ?",
      "ru": "Мяу! Я рядом с тобой. Что хочешь исследовать?",
    };
    const preferredReply = responseLanguage
      ? localReplies[responseLanguage.slice(0, 2).toLowerCase()]
      : undefined;
    if (preferredReply) return preferredReply;

    const lower = msg.toLowerCase();

    // 1. Russian
    if (/[\u0400-\u04FF]/.test(msg) || /\b(привет|как дела|мяу|спасибо|кот|котик)\b/i.test(lower)) {
      if (lower.includes("как дела")) {
        return "Мяу! У меня всё прекрасно, я мурлычу и греюсь на солнышке.";
      }
      return `Мяу! Я слышу тебя, милый друг. Давай играть вместе!`;
    }

    // 2. French
    if (/[éèêëàâîïôûùçœ]/.test(msg) || /\b(bonjour|salut|comment|chat|chaton|merci|miaou)\b/i.test(lower)) {
      if (lower.includes("comment")) {
        return "Miaou! Je vais super bien, je ronronne de bonheur dans ma chambre 3D.";
      }
      return `Miaou, bonjour mon ami! Je suis très contente de te voir.`;
    }

    // 3. Telugu
    if (/[\u0C00-\u0C7F]/.test(msg) || /\b(namaskaram|ela|unnaru|pilli|bagunara|enti|cheppu)\b/i.test(lower)) {
      if (lower.includes("ela") || lower.includes("bagunara")) {
        return "Namaskaram! Meow, nenu chala bagunnanu. Nuvvu ela unnavu?";
      }
      return `Meow! Neetho matladatam naku chala aanandamga undi nestama.`;
    }

    // 4. Kannada
    if (/[\u0C80-\u0CFF]/.test(msg) || /\b(namaskara|hegiddeera|hegiddiya|beku|oota|aytha|chennagiddira)\b/i.test(lower)) {
      if (lower.includes("hegid")) {
        return "Namaskara! Meow, nanu thumba chennagiddene. Neenu hegiddeeya?";
      }
      return `Meow! Ninna jothe mathadalu nanage thumba ishta, muddu snehitha.`;
    }

    // 5. Marathi
    if (/\b(namaskar|kashi|aahes|aahat|majha|kuthe|kay|kartos|kasa|marathi)\b/i.test(lower)) {
      if (lower.includes("kashi") || lower.includes("kasa")) {
        return "Namaskar mitra! Meow, mi khoop mast aahe. Tu kashi aahes?";
      }
      return `Meow! Majha naav Fourie aahe, tujhya sobat khelayla majja yetey.`;
    }

    // 6. Hindi / Hinglish
    if (/[\u0900-\u097F]/.test(msg) || /\b(namaste|kaise|kaisi|kya|hai|haan|nahi|kuch|billi|dost|karo|batao|sunao)\b/i.test(lower)) {
      if (lower.includes("kaisi") || lower.includes("kaise") || lower.includes("kya hal")) {
        return "Namaste dost! Meow, main bahut badiya hoon aur sukoon se baithi hoon.";
      }
      if (lower.includes("dance") || lower.includes("nacho")) {
        return "Meow, dekho mere chhote gulabi panje aur cute kitten dance!";
      }
      if (lower.includes("milk") || lower.includes("doodh") || lower.includes("fish") || lower.includes("machli")) {
        return "Purr, garam meetha doodh aur crispy fish meri favorite treat hai.";
      }
      return `Meow, maine tumhari baat suni "${msg}". Main tumse dosti karke bahut khush hoon.`;
    }

    // 7. English
    if (lower.includes("joke")) {
      return "Why did the kitten sit on the computer? It wanted to keep an eye on the mouse.";
    }

    if (lower.includes("dance")) {
      return "Meow, watch my happy little kitten steps and swishing tail.";
    }

    if (
      lower.includes("milk") ||
      lower.includes("fish") ||
      lower.includes("tuna")
    ) {
      return "Purr, those sound like delicious treats for a hungry little kitten.";
    }

    if (
      lower.includes("hello") ||
      lower.includes("hi") ||
      lower.includes("hey")
    ) {
      return "Hello, dear friend. Meow! I am so happy to see you.";
    }

    return `Meow, I heard you say "${msg}". Tell me more, little friend.`;
  }
}

export const freeLlm = new FreeLlmClient();
