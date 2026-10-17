import React, { useState, useRef, useEffect } from "react";
import { getFourieReply, SUGGESTION_CHIPS } from "../../services/chat";
import { audio } from "../../core/audio";
import { useStore } from "../../core/store";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  sender: "fourie" | "user";
  text: string;
  time: string;
}

export const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "fourie",
      text: "Beep boop! I'm Fourie, keeper of the 404 gap. Kuch kho gaya? Ask me anything about lost sites, dial-up lullabies, or our rescued archives!",
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendMood = useStore((s) => s.sendMood);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    audio.click();
    const userMsg: Message = {
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate Fourie antenna processing
    sendMood("SEARCHING" as any);
    setTimeout(() => {
      audio.squeak();
      sendMood("HAPPY" as any);
      const replyText = getFourieReply(query);
      const fourieMsg: Message = {
        sender: "fourie",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fourieMsg]);
    }, 400);
  };

  return (
    <div className="flex flex-col h-[380px] max-h-[60dvh]">
      {/* Messenger Header */}
      <div className="bg-win-header text-white p-2 text-xs font-pixel flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Bot className="w-4 h-4 text-glitch-cyan" />
          <span>FOURIE INSTANT MESSENGER v4.04</span>
        </span>
        <span className="text-[9px] text-glitch-green animate-pulse">● ONLINE</span>
      </div>

      {/* Message History Feed */}
      <div className="flex-1 overflow-y-auto p-3 bg-[#eef1f6] space-y-3 font-display text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2 ${
              m.sender === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`w-7 h-7 rounded flex items-center justify-center text-xs flex-shrink-0 ${
                m.sender === "user"
                  ? "bg-win-header text-white"
                  : "bg-void-900 border border-glitch-cyan text-glitch-cyan"
              }`}
            >
              {m.sender === "user" ? <User className="w-4 h-4" /> : "404"}
            </div>

            <div
              className={`max-w-[78%] p-2.5 rounded shadow-sm text-ink ${
                m.sender === "user"
                  ? "bg-blue-100 border border-blue-300 rounded-tr-none"
                  : "bg-white border border-gray-300 rounded-tl-none"
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className="font-pixel text-[9px] font-bold text-gray-600">
                  {m.sender === "user" ? "You" : "Fourie"}
                </span>
                <span className="text-[9px] text-gray-400 font-mono">{m.time}</span>
              </div>
              <p className="leading-relaxed">{m.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips (Trie Topics) */}
      <div className="p-2 bg-gray-200 border-t border-gray-300 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-thin">
        {SUGGESTION_CHIPS.map((chip, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(chip)}
            className="px-2 py-1 text-[9px] font-pixel bg-white text-ink border border-gray-400 rounded-full hover:bg-win-header hover:text-white transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-2 bg-winborder border-t-2 border-white flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Fourie in English or Hinglish..."
          className="flex-1 px-2.5 py-1.5 bg-white border border-gray-400 text-xs font-display text-ink focus:outline-none focus:border-win-header"
        />
        <button
          type="submit"
          className="px-3 py-1.5 bg-winborder text-ink font-pixel text-xs retro-bevel active:retro-bevel-inset flex items-center gap-1 hover:bg-gray-200"
        >
          <Send className="w-3.5 h-3.5 text-win-header" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
