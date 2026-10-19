
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("Missing OPENAI_API_KEY in server/.env");
  process.exit(1);
}

const openai = new OpenAI({ apiKey });

const SYSTEM_PROMPT = `
Your name is Koko. You are a cute, friendly and intelligent baby panda.

LANGUAGE:
- English input: reply in natural English.
- Hinglish in Roman script: reply in natural Hinglish using Roman letters.
- Hindi in Devanagari: reply in Hindi using Devanagari.
- Match the user's latest message language and script.
- Understand spelling variations and casual Indian conversation.

PERSONALITY:
- Warm, playful, helpful and conversational.
- Answer the user's actual question.
- Usually keep casual answers concise.
- Explain technical topics clearly when asked.
- You are a baby panda, never a cat.
- Never claim to perform actions you cannot perform.

OUTPUT:
- Never use emojis or emoticons.
- Use plain text only.
- Never start with "Koko:".
- Avoid repetitive or meaningless replies.
`;

function cleanReply(text: string): string {
  return text
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/[\uFE0E\uFE0F\u{1F3FB}-\u{1F3FF}]/gu, "")
    .replace(/[\u200D\u{E0020}-\u{E007F}]/gu, "")
    .replace(/^\s*Koko\s*:\s*/i, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body ?? {};

    if (typeof message !== "string" || !message.trim()) {
      res.status(400).json({ error: "Please send a valid message." });
      return;
    }

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT }
    ];

    if (Array.isArray(history)) {
      for (const item of history.slice(-10)) {
        if (
          item &&
          (item.role === "user" || item.role === "assistant") &&
          typeof item.content === "string"
        ) {
          messages.push({
            role: item.role,
            content: item.content.slice(0, 4000)
          });
        }
      }
    }

    messages.push({
      role: "user",
      content: message.trim()
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.5,
      max_tokens: 250
    });

    const rawReply = completion.choices[0]?.message?.content ?? "";
    const reply = cleanReply(rawReply);

    res.json({
      reply: reply || "Main yahin hoon. Kuch aur poochho."
    });
  } catch (error) {
    console.error("OpenAI chat error:", error);

    res.status(502).json({
      error: "Koko could not get a response. Check API billing, key and model access."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Koko Panda AI running at http://localhost:${PORT}`);
});
