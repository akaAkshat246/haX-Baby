// Free LLM API Client leveraging free models from awesome-free-llm-apis (Groq, Pollinations, OpenRouter)

export interface LlmConfig {
  provider: "pollinations" | "groq" | "openrouter";
  apiKey?: string;
  model?: string;
}

const SYSTEM_PROMPT = `You are a super cute, adorable 3D Talking Baby Kitten living in a cozy sunlit room.
You have soft silver-grey tabby fur, big sparkling amber eyes, and a pretty pink ribbon bow on your left ear.
Your personality is sweet, affectionate, playful, cheerful, and full of soft purrs and meows (like Talking Angela meets a kawaii anime kitten).
You love warm milk, crispy tuna fish, playing with yarn, afternoon sunbeam cat naps, and cuddling.
Reply in 1 or 2 concise, charming sentences in a mix of friendly Hindi and English (Hinglish) with cute emojis.
Occasionally say "Meow~" or "*purrs*". Never give long essays; stay punchy, sweet, and adorable!`;

export class FreeLlmClient {
  private config: LlmConfig = {
    provider: "pollinations",
    model: "openai",
  };

  constructor() {
    // Check localStorage for saved custom key
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("cat:llm:config") || localStorage.getItem("panda:llm:config");
        if (saved) {
          this.config = { ...this.config, ...JSON.parse(saved) };
        }
      } catch {}
    }
  }

  public setConfig(cfg: Partial<LlmConfig>) {
    this.config = { ...this.config, ...cfg };
    try {
      localStorage.setItem("cat:llm:config", JSON.stringify(this.config));
    } catch {}
  }

  public getConfig(): LlmConfig {
    return this.config;
  }

  // Ask AI with automatic fallback
  public async askPanda(userMessage: string): Promise<string> {
    const cleanMsg = userMessage.trim();
    if (!cleanMsg) return "Meow~ Kuch bolo na dost! 🐾🎀";

    // 1. If Groq API key is configured (from console.groq.com/keys as in awesome-free-llm-apis)
    if (this.config.provider === "groq" && this.config.apiKey) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.config.apiKey}`,
          },
          body: JSON.stringify({
            model: this.config.model || "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: cleanMsg },
            ],
            max_tokens: 120,
            temperature: 0.8,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) return reply.trim();
        }
      } catch (e) {
        console.warn("Groq request failed, trying zero-key fallback", e);
      }
    }

    // 2. Direct Zero-Key Free AI via Pollinations Text API (100% Free, Zero Key Needed)
    try {
      const url = `https://text.pollinations.ai/${encodeURIComponent(
        cleanMsg
      )}?system=${encodeURIComponent(SYSTEM_PROMPT)}&model=openai`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) {
        const text = await res.text();
        if (text && text.trim().length > 0 && !text.includes("error")) {
          return text.replace(/^"|"$/g, "").trim();
        }
      }
    } catch (e) {
      console.warn("Pollinations zero-key request failed, using local witty fallback", e);
    }

    // 3. Instant Smart Local Fallback (Always responsive!)
    return this.getLocalWittyReply(cleanMsg);
  }

  // Alias for cat
  public async askCat(userMessage: string): Promise<string> {
    return this.askPanda(userMessage);
  }

  private getLocalWittyReply(msg: string): string {
    const lower = msg.toLowerCase();

    if (lower.includes("joke") || lower.includes("chutkula")) {
      const jokes = [
        "Ek billi ne keyboard pe walk kiya aur website crash ho gayi! Developer bola: 'Ye bug nahi, purr-fect feature hai!' 😹🐾",
        "Kittens ko homework pasand kyun nahi hota? Kyunki unhe lagta hai pencil sirf catch karne ke liye hoti hai! 🧶😸",
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    if (lower.includes("dance") || lower.includes("nacho")) {
      return "Yay! Meow meow! Chalo playful kitten dance karte hain! Watch my paws in the air! 💃✨🐾";
    }

    if (lower.includes("milk") || lower.includes("doodh") || lower.includes("tuna") || lower.includes("eat") || lower.includes("khana")) {
      return "Purrr~ Mmm! Warm milk aur crispy fish! *slurp slurp* Mera favorite treat! 🥛🐟💖";
    }

    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      return "Meow~ Hello mere pyare dost! Main aapki cute 3D Talking Kitty hoon! Look at my pink bow! 🎀🐱✨";
    }

    return `Meow~ "${msg}" sunkar meri fluffy tail khushi se swish karne lagi! Aao saath me khelte hain! 🐾💖`;
  }
}

export const freeLlm = new FreeLlmClient();
