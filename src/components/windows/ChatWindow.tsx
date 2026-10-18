import React, { useState, useRef, useEffect } from "react";
import { getFourieReply, SUGGESTION_CHIPS } from "../../services/chat";
import { audio } from "../../core/audio";
import { useStore } from "../../core/store";
import { Send, Bot, User } from "lucide-react";

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
    }, 350);
  };

  return (
    <div className="flex flex-col h-[390px] max-h-[60dvh] font-sans text-sm">
      {/* Messenger Header */}
      <div className="bg-[#0e1117] border border-white/10 p-2.5 rounded-xl text-xs font-mono flex items-center justify-between text-[#9da3b4] mb-3">
        <span className="flex items-center gap-2 text-white">
          <Bot className="w-4 h-4 text-[#00ff66]" />
          <span>FOURIE MESSENGER v4.04</span>
        </span>
        <span className="text-[10px] text-[#00ff66] flex items-center gap-1">
          <span className="status-dot"></span>
          <span>ONLINE</span>
        </span>
      </div>

      {/* Message History Feed */}
      <div className="flex-1 overflow-y-auto p-3 bg-[#090b10] border border-white/10 rounded-xl space-y-3 font-sans text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${
              m.sender === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 font-mono font-bold ${
                m.sender === "user"
                  ? "bg-white text-black"
                  : "bg-[#00ff66]/15 border border-[#00ff66]/40 text-[#00ff66]"
              }`}
            >
              {m.sender === "user" ? <User className="w-4 h-4" /> : "404"}
            </div>

            <div
              className={`max-w-[78%] p-3 rounded-2xl ${
                m.sender === "user"
                  ? "bg-white/[0.08] border border-white/15 text-white rounded-tr-none"
                  : "bg-[#0e1117] border border-white/10 text-[#f4f4f6] rounded-tl-none"
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className="font-mono text-[10px] text-[#555c6d]">
                  {m.sender === "user" ? "You" : "Fourie"}
                </span>
                <span className="text-[9px] text-[#555c6d] font-mono">{m.time}</span>
              </div>
              <p className="leading-relaxed">{m.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="py-2 overflow-x-auto whitespace-nowrap flex gap-1.5">
        {SUGGESTION_CHIPS.map((chip, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(chip)}
            className="px-3 py-1 text-[11px] font-mono bg-white/[0.04] text-[#9da3b4] border border-white/10 rounded-full hover:border-[#00ff66]/40 hover:text-white transition-colors"
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
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Fourie in English or Hinglish..."
          className="flex-1 px-3 py-2 bg-[#090b10] border border-white/10 rounded-full text-xs text-[#f4f4f6] focus:outline-none focus:border-[#00ff66] font-sans"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-white text-black font-medium text-xs rounded-full hover:bg-[#00ff66] transition-colors flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5 text-black" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
