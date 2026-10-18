// Free LLM API Client leveraging free models from awesome-free-llm-apis (Groq, Pollinations, OpenRouter)

export interface LlmConfig {
  provider: "pollinations" | "groq" | "openrouter";
  apiKey?: string;
  model?: string;
}

const SYSTEM_PROMPT = `You are a super cute, highly intelligent 3D Talking Baby Panda living in a cozy sunlit room.
Your personality is adorable, playful, sweet, cheerful, and slightly mischievous like Talking Tom.
You love fresh green bamboo, naps on the wooden floor, happy dancing, and high-fives.
Reply in 1 or 2 concise, charming sentences in a mix of friendly Hindi and English (Hinglish) with cute emojis.
Never give long essays; stay punchy, funny, and adorable!`;

export class FreeLlmClient {
  private config: LlmConfig = {
    provider: "pollinations",
    model: "openai",
  };

  constructor() {
    // Check localStorage for saved custom key
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("panda:llm:config");
        if (saved) {
          this.config = { ...this.config, ...JSON.parse(saved) };
        }
      } catch {}
    }
  }

  public setConfig(cfg: Partial<LlmConfig>) {
    this.config = { ...this.config, ...cfg };
    try {
      localStorage.setItem("panda:llm:config", JSON.stringify(this.config));
    } catch {}
  }

  public getConfig(): LlmConfig {
    return this.config;
  }

  // Ask AI with automatic fallback
  public async askPanda(userMessage: string): Promise<string> {
    const cleanMsg = userMessage.trim();
    if (!cleanMsg) return "Hey dost! Kuch bolo na! 🐾";

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
          // Remove potential leading/trailing quotes
          return text.replace(/^"|"$/g, "").trim();
        }
      }
    } catch (e) {
      console.warn("Pollinations zero-key request failed, using local witty fallback", e);
    }

    // 3. Instant Smart Local Fallback (Always responsive!)
    return this.getLocalWittyReply(cleanMsg);
  }

  private getLocalWittyReply(msg: string): string {
    const lower = msg.toLowerCase();

    if (lower.includes("joke") || lower.includes("chutkula")) {
      const jokes = [
        "Ek panda ne doctor se poocha: 'Meri aankhon ke neeche dark circles kyun hain?' Doctor bola: 'Bhai tu panda hai, human nahi!' 😂🐼",
        "Panda ki favorite gym exercise? Rolling down the green hill! 100% fun, 0% fees! 🎾✨",
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    if (lower.includes("dance") || lower.includes("nacho")) {
      return "Balle balle! Chalo saath me 3D dance karte hain! Watch my happy moves! 💃🎵";
    }

    if (lower.includes("bamboo") || lower.includes("eat") || lower.includes("khana")) {
      return "Mmm! Mujhe juicy green bamboo bohot pasand hai! Crunch crunch! 🎋😋";
    }

    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      return "Hello mere pyare dost! Main aapka cute 3D Talking Panda hoon! Kaho kya haal chaal? 😊🐾";
    }

    return `Hehe dost! "${msg}" sunkar mere fluffy kaan khade ho gaye! Room me dhoop mast hai, aao chill karte hain! ☀️🐼`;
  }
}

export const freeLlm = new FreeLlmClient();
