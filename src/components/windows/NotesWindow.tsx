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
    <div className="space-y-4 font-sans text-sm">
      {/* Header with Odometer */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#0e1117] border border-white/10 rounded-xl">
        <div>
          <h3 className="font-mono text-xs flex items-center gap-2 text-white font-medium">
            <MessageSquare className="w-4 h-4 text-[#00ff66]" />
            <span>LOST &amp; FOUND GUESTBOOK</span>
          </h3>
          <p className="text-[11px] text-[#9da3b4] mt-0.5">
            Leave a memory of a website, game, or friend you lost on the web.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#555c6d]">TOTAL ARCHIVED:</span>
          <Odometer value={404 + notes.length} digits={5} />
        </div>
      </div>

      {/* Submission Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-[#0e1117] border border-white/10 rounded-xl space-y-3 font-sans text-xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[10px] text-[#9da3b4] block mb-1 uppercase tracking-wider">
              YOUR NAME / HANDLE:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. StarGazer98"
              maxLength={24}
              required
              className="w-full px-3 py-1.5 bg-[#090b10] border border-white/10 rounded-lg text-[#f4f4f6] focus:outline-none focus:border-[#00ff66] font-mono"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#9da3b4] block mb-1 uppercase tracking-wider">
              WHAT DID YOU LOSE?
            </label>
            <input
              type="text"
              value={itemLost}
              onChange={(e) => setItemLost(e.target.value)}
              placeholder="e.g. My GeoCities fan page"
              maxLength={40}
              required
              className="w-full px-3 py-1.5 bg-[#090b10] border border-white/10 rounded-lg text-[#f4f4f6] focus:outline-none focus:border-[#00ff66] font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="font-mono text-[10px] text-[#9da3b4] block mb-1 uppercase tracking-wider">
              MEMORY NOTE (UNDER 160 CHARS):
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell Fourie how it looked, how it felt, or why you miss it..."
              maxLength={160}
              rows={2}
              required
              className="w-full px-3 py-1.5 bg-[#090b10] border border-white/10 rounded-lg text-[#f4f4f6] focus:outline-none focus:border-[#00ff66] resize-none"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#9da3b4] block mb-1 uppercase tracking-wider">
              ERA / TIME:
            </label>
            <select
              value={era}
              onChange={(e) => setEra(e.target.value)}
              className="w-full px-2 py-1.5 bg-[#090b10] border border-white/10 rounded-lg text-[#f4f4f6] focus:outline-none focus:border-[#00ff66] text-xs h-[38px] font-mono"
            >
              <option value="90s Dial-Up">90s Dial-Up</option>
              <option value="2000s Web">2000s Webrings</option>
              <option value="2010s Flash">Flash Era</option>
              <option value="Modern Void">Modern Cloud</option>
            </select>
          </div>
        </div>

        {status && (
          <div className="text-xs font-mono text-[#00ff66] animate-pulse">
            {status}
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-white text-black font-mono font-medium text-xs rounded-full hover:bg-[#00ff66] transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5 text-black" />
            <span>{isSubmitting ? "Archiving..." : "Pin to Lost Wall"}</span>
          </button>
        </div>
      </form>

      {/* Notes Wall Feed */}
      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-3 bg-[#0e1117] border border-white/10 rounded-xl space-y-1.5 text-xs text-[#f4f4f6]"
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-[#9da3b4]">
              <span className="font-medium text-white">{note.name}</span>
              <span className="flex items-center gap-1 text-[#555c6d]">
                <Tag className="w-3 h-3 text-[#00ff66]" />
                <span>{note.era}</span>
              </span>
            </div>

            <div className="text-xs font-semibold text-[#00e5ff]">
              Lost: <span className="underline decoration-dotted">{note.item_lost}</span>
            </div>

            <p className="text-[#9da3b4] leading-relaxed italic">
              "{note.message}"
            </p>

            <div className="flex items-center gap-1 text-[10px] text-[#555c6d] font-mono pt-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(note.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
