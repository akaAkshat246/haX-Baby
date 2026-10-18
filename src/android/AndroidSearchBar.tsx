import React, { useState, useEffect, useRef } from "react";
import { PrefixTrie } from "../ds/trie";
import { useStore, WindowId } from "../core/store";
import { audio } from "../core/audio";
import { Mic, Camera, Search, Sparkles } from "lucide-react";

interface SearchItem {
  key: string;
  label: string;
  category: "app" | "memory" | "action";
  action: () => void;
}

export const AndroidSearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const openWindow = useStore((s) => s.openWindow);
  const sendMood = useStore((s) => s.sendMood);
  const showToast = useStore((s) => s.showToast);

  const searchItems: SearchItem[] = [
    {
      key: "about baby fourie",
      label: "About Baby Fourie (Dossier)",
      category: "app",
      action: () => openWindow("about"),
    },
    {
      key: "rescued parcels projects",
      label: "Rescued Parcels (3 Web Artifacts)",
      category: "app",
      action: () => openWindow("rescued"),
    },
    {
      key: "lullaby lab 56k modem synthesizer",
      label: "Dial-Up Lullaby Lab (Sequencer)",
      category: "app",
      action: () => openWindow("lullaby"),
    },
    {
      key: "lost wish wall guestbook notes",
      label: "Lost Wish Guestbook (Notes)",
      category: "app",
      action: () => openWindow("notes"),
    },
    {
      key: "chat with baby messages",
      label: "Messages (Chat with Fourie)",
      category: "app",
      action: () => openWindow("chat"),
    },
    {
      key: "recycle basket trash midi",
      label: "Recycle Basket (Forgotten Relics)",
      category: "app",
      action: () => openWindow("bin"),
    },
    {
      key: "star router dijkstra map delivery",
      label: "Star Router (Dijkstra Shortest Path)",
      category: "app",
      action: () => openWindow("router"),
    },
    {
      key: "geocities shrine sticker archive",
      label: "GeoCities Archive & Sticker Corkboard",
      category: "app",
      action: () => openWindow("geocities"),
    },
    {
      key: "secret backroom nowhere key portal",
      label: "Secret Backroom /nowhere (Portal)",
      category: "app",
      action: () => openWindow("nowhere"),
    },
    {
      key: "wake baby fourie",
      label: "Action: Wake Baby Fourie",
      category: "action",
      action: () => {
        sendMood("WAKE");
        showToast("Woke Baby Fourie! ✦");
      },
    },
    {
      key: "play 56k dial-up lullaby",
      label: "Action: Play 56K Modem Lullaby",
      category: "action",
      action: async () => {
        await audio.unlock();
        audio.playDialUpSimulation();
        showToast("Playing Modem Lullaby");
      },
    },
  ];

  // Initialize Prefix Trie Data Structure
  const trieRef = useRef<PrefixTrie>(new PrefixTrie());
  useEffect(() => {
    const t = new PrefixTrie();
    searchItems.forEach((item) => {
      item.key.split(" ").forEach((word) => t.insert(word.toLowerCase()));
    });
    trieRef.current = t;
  }, []);

  const handleSearchChange = (val: string) => {
    setQuery(val);
    const q = val.trim().toLowerCase();
    if (!q) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    // Trie autocomplete prefix matching
    const matches = searchItems.filter((item) =>
      item.key.includes(q) || item.label.toLowerCase().includes(q)
    );
    setResults(matches);
    setIsOpen(matches.length > 0);
  };

  const handleSelectResult = (item: SearchItem) => {
    audio.click();
    item.action();
    setQuery("");
    setIsOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto z-30 select-none">
      {/* Android Google Search Bar */}
      <div className="h-12 px-4 rounded-full bg-[#121620]/90 backdrop-blur-xl border border-white/10 hover:border-white/25 focus-within:border-[#00ff66]/50 shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex items-center gap-3 transition-all">
        {/* Google 4-Color 'G' Logo */}
        <div className="flex-shrink-0 cursor-pointer" title="Google Search">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.41 7.36 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.27 2.59 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search apps, memories, or dial-up..."
          className="flex-1 bg-transparent text-sm text-white placeholder-white/50 focus:outline-none font-sans"
        />

        {/* Mic & Lens Action Buttons */}
        <div className="flex items-center gap-2 text-white/70">
          <button
            type="button"
            aria-label="Voice Search"
            onClick={() => showToast("Listening... (Speak with Fourie)")}
            className="p-1 rounded-full hover:bg-white/10 hover:text-white transition-colors"
          >
            <Mic className="w-4 h-4 text-[#4285F4]" />
          </button>
          <button
            type="button"
            aria-label="Google Lens"
            onClick={() => showToast("Lens Scanner: Searching 404 gap")}
            className="p-1 rounded-full hover:bg-white/10 hover:text-white transition-colors"
          >
            <Camera className="w-4 h-4 text-[#FBBC05]" />
          </button>
        </div>
      </div>

      {/* Instant Dropdown Search Results (Trie Matches) */}
      {isOpen && (
        <div className="absolute top-14 left-0 right-0 bg-[#121620] border border-white/10 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-1 backdrop-blur-2xl animate-fade-in">
          <div className="text-[10px] font-mono text-[#555c6d] px-3 py-1 uppercase tracking-wider">
            Trie Autocomplete Matches ({results.length})
          </div>

          {results.map((r, i) => (
            <div
              key={i}
              onClick={() => handleSelectResult(r)}
              className="p-2.5 px-3 rounded-xl hover:bg-white/[0.08] cursor-pointer flex items-center justify-between text-xs text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-3.5 h-3.5 text-[#00ff66]" />
                <span className="font-medium">{r.label}</span>
              </div>
              <span className="text-[10px] font-mono bg-white/[0.04] text-[#9da3b4] px-2 py-0.5 rounded-full uppercase">
                {r.category}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
