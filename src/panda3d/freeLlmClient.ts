// Free LLM API Client leveraging free models from awesome-free-llm-apis (Groq, Pollinations, OpenRouter)

export interface LlmConfig {
  provider: "pollinations" | "groq" | "openrouter";
  apiKey?: string;
  model?: string;
}

const SYSTEM_PROMPT = `You are an adorable, sweet, kawaii 3D baby kitten.
You have big sparkling eyes, a delicate pink ribbon bow near your ear, soft tabby fur, and cute paws.
You speak in a gentle, warm, and playful manner with cat sounds like "meow", "purr", and happy giggles.
Always reply in 1 or 2 concise, sweet sentences. Never include emojis or stickers in your output. Never use Hindi font.`;

export class FreeLlmClient {
  private config: LlmConfig = {
    provider: "groq",
    model: "llama-3.3-70b-versatile",
  };

  constructor() {
    const envKey = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_GROQ_API_KEY) || "";
    if (envKey) {
      this.config.provider = "groq";
      this.config.apiKey = envKey;
      this.config.model = "llama-3.3-70b-versatile";
    }

    // Check localStorage for saved custom key
    if (typeof window !== "undefined") {
      try {
        const localKey = localStorage.getItem("cat:groq:key") || localStorage.getItem("panda:groq:key");
        if (localKey && !this.config.apiKey) {
          this.config.apiKey = localKey;
          this.config.provider = "groq";
        }
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
    if (!cleanMsg) return "Meow, speak to me sweet friend.";

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
          if (reply) return this.stripEmojis(reply.trim());
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
          return this.stripEmojis(text.replace(/^"|"$/g, "").trim());
        }
      }
    } catch (e) {
      console.warn("Pollinations zero-key request failed, using local fallback", e);
    }

    // 3. Instant Smart Local Fallback (Always responsive!)
    return this.getLocalWittyReply(cleanMsg);
  }

  // Alias for cat
  public async askCat(userMessage: string): Promise<string> {
    return this.askPanda(userMessage);
  }

  private stripEmojis(str: string): string {
    return str
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}]/gu, "")
      .trim();
  }

  private getLocalWittyReply(msg: string): string {
    const lower = msg.toLowerCase();

    if (lower.includes("joke")) {
      const jokes = [
        "A kitten walked across the keyboard and the app worked faster. The engineer said it was a purr-fect feature.",
        "Why do kittens like laptops so much? Because they are made of warm mouse pads.",
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    if (lower.includes("dance")) {
      return "Meow, watch my happy little kitten steps and playful swishing tail.";
    }

    if (lower.includes("milk") || lower.includes("fish") || lower.includes("tuna")) {
      return "Purr, delicious warm milk and crispy tuna are my favorite treats.";
    }

    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      return "Hello dear friend. I am your cute 3D kawaii kitten. It is so nice to meet you.";
    }

    return `Meow, I heard you say "${msg}". I am so happy to spend time with you.`;
  }
}

export const freeLlm = new FreeLlmClient();
