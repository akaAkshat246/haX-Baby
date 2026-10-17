import React, { useState, useEffect } from "react";
import { LostNote, fetchNotes, addLostNote } from "../../services/supabase";
import { audio } from "../../core/audio";
import { bus } from "../../core/bus";
import { Odometer } from "../Odometer";
import { MessageSquare, Send, Clock, Tag } from "lucide-react";

export const NotesWindow: React.FC = () => {
  const [notes, setNotes] = useState<LostNote[]>([]);
  const [name, setName] = useState("");
  const [itemLost, setItemLost] = useState("");
  const [message, setMessage] = useState("");
  const [era, setEra] = useState("2000s Web");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchNotes().then((loaded) => setNotes(loaded));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !itemLost.trim() || !message.trim()) {
      setStatus("Please fill in all fields!");
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const added = await addLostNote(name, itemLost, message, era);
      setNotes((prev) => [added, ...prev]);
      setName("");
      setItemLost("");
      setMessage("");
      setStatus("Note safely archived in Fourie's floppy satchel! ✦");

      audio.squeak();
      bus.emit("poke", { x: window.innerWidth / 2, y: window.innerHeight / 2 });
    } catch (err: any) {
      setStatus(err.message || "Failed to catalog note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Odometer */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-win-header text-white rounded">
        <div>
          <h3 className="font-pixel text-xs flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-glitch-cyan" />
            <span>LOST & FOUND GUESTBOOK</span>
          </h3>
          <p className="text-[10px] text-gray-300 font-display">
            Leave a memory of a website, game, or friend you lost on the web.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-pixel text-[9px] text-glitch-green">TOTAL ARCHIVED:</span>
          <Odometer value={404 + notes.length} digits={5} />
        </div>
      </div>

      {/* Submission Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-white border-2 border-gray-400 rounded space-y-2.5 font-display text-xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="font-pixel text-[9px] text-gray-700 block mb-1">
              YOUR NAME / HANDLE:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. StarGazer98"
              maxLength={24}
              required
              className="w-full px-2 py-1 bg-gray-50 border border-gray-400 focus:outline-none focus:border-win-header"
            />
          </div>

          <div>
            <label className="font-pixel text-[9px] text-gray-700 block mb-1">
              WHAT DID YOU LOSE?
            </label>
            <input
              type="text"
              value={itemLost}
              onChange={(e) => setItemLost(e.target.value)}
              placeholder="e.g. My GeoCities fan page, MSN quotes"
              maxLength={40}
              required
              className="w-full px-2 py-1 bg-gray-50 border border-gray-400 focus:outline-none focus:border-win-header"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="sm:col-span-2">
            <label className="font-pixel text-[9px] text-gray-700 block mb-1">
              MEMORY NOTE (UNDER 160 CHARS):
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell Fourie how it looked, how it felt, or why you miss it..."
              maxLength={160}
              rows={2}
              required
              className="w-full px-2 py-1 bg-gray-50 border border-gray-400 focus:outline-none focus:border-win-header resize-none"
            />
          </div>

          <div>
            <label className="font-pixel text-[9px] text-gray-700 block mb-1">
              ERA / TIME:
            </label>
            <select
              value={era}
              onChange={(e) => setEra(e.target.value)}
              className="w-full px-2 py-1 bg-gray-50 border border-gray-400 focus:outline-none focus:border-win-header text-xs h-[34px]"
            >
              <option value="90s Dial-Up">90s Dial-Up</option>
              <option value="2000s Web">2000s Webrings</option>
              <option value="2010s Flash">Flash Era</option>
              <option value="Modern Void">Modern Cloud</option>
            </select>
          </div>
        </div>

        {status && (
          <div className="text-[11px] font-pixel text-win-header animate-pulse">
            {status}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-1.5 bg-winborder text-ink font-pixel text-xs retro-bevel active:retro-bevel-inset flex items-center gap-1.5 hover:bg-gray-200"
          >
            <Send className="w-3.5 h-3.5 text-win-header" />
            <span>{isSubmitting ? "Archiving..." : "Pin to Lost Wall"}</span>
          </button>
        </div>
      </form>

      {/* Notes Wall Feed */}
      <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-2.5 bg-[#fffdf0] border border-amber-300 rounded shadow-sm space-y-1.5 relative overflow-hidden font-display text-xs text-ink"
          >
            {/* Retro Post-It top strip */}
            <div className="h-1 bg-amber-400 absolute top-0 left-0 right-0" />

            <div className="flex items-center justify-between text-[10px] text-gray-600 font-pixel">
              <span className="font-bold text-win-header">{note.name}</span>
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-glitch-magenta" />
                <span>{note.era}</span>
              </span>
            </div>

            <div className="text-xs font-bold text-void-900">
              Lost: <span className="underline decoration-dotted">{note.item_lost}</span>
            </div>

            <p className="text-gray-700 leading-relaxed italic">
              "{note.message}"
            </p>

            <div className="flex items-center gap-1 text-[9px] text-gray-400 font-pixel">
              <Clock className="w-3 h-3" />
              <span>{new Date(note.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
