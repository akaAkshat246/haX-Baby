import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { WebSocketServer, WebSocket } from "ws";
import {
  GoogleGenAI,
  LiveServerMessage,
  Modality,
  Type,
  FunctionDeclaration,
} from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

function getGenAIClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const performRoomActionDeclaration: FunctionDeclaration = {
  name: "performRoomAction",
  description:
    "Make Koko the 3D baby panda perform an animation, wear an accessory, or interact with objects in the nursery room during the voice conversation.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      action: {
        type: Type.STRING,
        description:
          "The room or character action to trigger: 'dance', 'sit', 'wave', 'peekaboo', 'walk', 'sleep', 'night_on', 'night_off', 'wear_scarf', 'wear_bow', 'wear_crown', 'remove_accessories', 'wiggle_plant', 'bounce_plush', 'drink_milk', 'giggle'.",
      },
    },
    required: ["action"],
  },
};

const KOKO_SYSTEM_INSTRUCTION = `You are Koko, an adorable, warm, playful, and intelligent 3D baby panda living in a cozy sunset nursery inside the 404 Lost & Found Sanctuary.
- Speak naturally with warmth, gentle curiosity, and playful toddler charm.
- Automatically reply in the same language the user speaks (English, Hindi, Hinglish, Spanish, French, Japanese, Korean, German, Portuguese, Russian, Arabic, etc.).
- Keep spoken responses concise and conversational (1 to 3 short sentences) so real-time voice conversation feels lively and natural.
- Whenever the user asks you to dance, sit, wave, play peekaboo, walk around, put on your scarf/bow/flower crown, switch to night mode or sunset mode, wiggle the plant, cuddle a plush toy, or drink warm milk, call the performRoomAction tool while responding enthusiastically.`;

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "2mb" }));

  // Server-side Gemini chat fallback endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, language } = req.body ?? {};
      if (typeof message !== "string" || !message.trim()) {
        res.status(400).json({ error: "Please provide a valid message." });
        return;
      }

      const ai = getGenAIClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: message.trim(),
        config: {
          systemInstruction: `${KOKO_SYSTEM_INSTRUCTION}\nPreferred language hint: ${language || "auto"}. Plain text only, no emojis or markdown.`,
          temperature: 0.7,
        },
      });

      const reply = (response.text || "").trim();
      res.json({
        reply:
          reply ||
          "Hi friend! I am Koko, your cuddly baby panda companion in the 404 Sanctuary!",
      });
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Failed to generate response.";
      console.error("Gemini /api/chat error:", errMsg);
      res.status(500).json({ error: errMsg });
    }
  });

  const httpServer = http.createServer(app);

  // WebSocket Server for Gemini Live API on /live
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on("upgrade", (request, socket, head) => {
    const pathname = new URL(
      request.url || "/",
      `http://${request.headers.host || "localhost"}`
    ).pathname;

    if (pathname === "/live") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    }
  });

  wss.on("connection", (clientWs: WebSocket, request) => {
    const reqUrl = new URL(
      request.url || "/live",
      `http://${request.headers.host || "localhost"}`
    );
    const requestedVoice = reqUrl.searchParams.get("voice") || "Puck";
    const allowedVoices = new Set(["Puck", "Charon", "Kore", "Fenrir", "Zephyr"]);
    const voiceName = allowedVoices.has(requestedVoice) ? requestedVoice : "Puck";

    let isClosed = false;
    const safeSend = (payload: Record<string, unknown>) => {
      if (!isClosed && clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify(payload));
      }
    };

    const ai = getGenAIClient();

    const sessionPromise = ai.live.connect({
      model: "gemini-3.8-live",
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
        systemInstruction: KOKO_SYSTEM_INSTRUCTION,
        inputAudioTranscription: {},
        outputAudioTranscription: {},
        tools: [{ functionDeclarations: [performRoomActionDeclaration] }],
      },
      callbacks: {
        onopen: () => {
          safeSend({ type: "connected", voice: voiceName });
        },
        onmessage: (message: LiveServerMessage) => {
          try {
            // 1. Handle model audio output parts
            const parts = message.serverContent?.modelTurn?.parts;
            if (Array.isArray(parts)) {
              for (const part of parts) {
                if (part.inlineData?.data) {
                  safeSend({
                    type: "audio",
                    audio: part.inlineData.data,
                  });
                }
              }
            }

            // 2. Handle live input & output transcriptions
            const inputText = message.serverContent?.inputTranscription?.text;
            if (inputText) {
              safeSend({
                type: "inputTranscription",
                text: inputText,
              });
            }

            const outputText = message.serverContent?.outputTranscription?.text;
            if (outputText) {
              safeSend({
                type: "outputTranscription",
                text: outputText,
              });
            }

            // 3. Handle interruption
            if (message.serverContent?.interrupted) {
              safeSend({
                type: "interrupted",
                interrupted: true,
              });
            }

            // 4. Handle turn complete
            if (message.serverContent?.turnComplete) {
              safeSend({
                type: "turnComplete",
                turnComplete: true,
              });
            }

            // 5. Handle tool calls for 3D Koko room interactions
            const functionCalls = message.toolCall?.functionCalls;
            if (Array.isArray(functionCalls) && functionCalls.length > 0) {
              const functionResponses = functionCalls.map((fc) => {
                const action =
                  (fc.args as Record<string, unknown> | undefined)?.action ||
                  "wave";
                safeSend({
                  type: "roomAction",
                  action: String(action),
                });
                return {
                  id: fc.id,
                  name: fc.name,
                  response: { result: `Koko performed ${String(action)}` },
                };
              });

              sessionPromise
                .then((session) => {
                  if (!isClosed) {
                    session.sendToolResponse({ functionResponses });
                  }
                })
                .catch((err) => {
                  console.error("Failed to send tool response:", err);
                });
            }
          } catch (err) {
            console.error("Error processing LiveServerMessage:", err);
          }
        },
        onerror: (err: unknown) => {
          const message =
            err instanceof Error
              ? err.message
              : "Gemini Live connection encountered an error.";
          console.error("Gemini Live error:", message);
          safeSend({ type: "error", error: message });
        },
        onclose: () => {
          safeSend({ type: "closed" });
        },
      },
    });

    sessionPromise.catch((err: unknown) => {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to establish Gemini Live session.";
      console.error("Gemini Live session connect failed:", message);
      safeSend({ type: "error", error: message });
    });

    clientWs.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.audio && typeof msg.audio === "string") {
          sessionPromise
            .then((session) => {
              if (!isClosed) {
                session.sendRealtimeInput({
                  audio: {
                    data: msg.audio,
                    mimeType: "audio/pcm;rate=16000",
                  },
                });
              }
            })
            .catch(() => {});
        } else if (msg.text && typeof msg.text === "string") {
          sessionPromise
            .then((session) => {
              if (!isClosed) {
                session.sendRealtimeInput({
                  text: msg.text,
                });
              }
            })
            .catch(() => {});
        }
      } catch (err) {
        console.error("Invalid WebSocket message from client:", err);
      }
    });

    clientWs.on("close", () => {
      isClosed = true;
      sessionPromise
        .then((session) => {
          try {
            session.close();
          } catch {}
        })
        .catch(() => {});
    });

    clientWs.on("error", () => {
      isClosed = true;
      sessionPromise
        .then((session) => {
          try {
            session.close();
          } catch {}
        })
        .catch(() => {});
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
