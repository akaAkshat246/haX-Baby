
import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen3:1.7b",
        messages: [
          {
            role: "system",
            content:
              "You are an adorable, sweet 3D kitten named Fourie. You fluently understand and speak 7 languages: Hindi, English, Marathi, Kannada, Telugu, French, and Russian. Always detect the user's language and reply in the EXACT SAME LANGUAGE in 1 or 2 concise, sweet sentences. Do not use emojis. For Indian languages, write in clean Romanized script.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      res.status(502).json({ error: "Ollama request failed" });
      return;
    }

    const data = await response.json();
    res.json({ reply: data.message?.content ?? "Meow! Try again." });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Could not connect to Ollama. Check whether Ollama is running.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Cat AI backend running at http://localhost:${PORT}`);
});
