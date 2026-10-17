import { createClient, SupabaseClient } from "@supabase/supabase-js";

export type LostNote = {
  id: string | number;
  name: string;
  item_lost: string;
  message: string;
  era: string;
  created_at: string;
};

const SB_URL = import.meta.env.VITE_SB_URL;
const SB_ANON = import.meta.env.VITE_SB_ANON;

export const supabase: SupabaseClient | null =
  SB_URL && SB_ANON ? createClient(SB_URL, SB_ANON) : null;

const LOCAL_NOTES_KEY = "fourie:notes:local";

const INITIAL_NOTES: LostNote[] = [
  {
    id: 1,
    name: "CyberDreamer99",
    item_lost: "GeoCities Dragonball Z Fanpage",
    message: "Had a spinning skull gif, uncompressed midi music, and a webring banner. Fourie found it in sector 404!",
    era: "1999",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 2,
    name: "PixelNomad",
    item_lost: "MSN Messenger Status Quotes",
    message: "Those angst-filled lyrics in italics with ~* aesthetic stars *~. Safe in Fourie's floppy satchel.",
    era: "2003",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 3,
    name: "Aetheria",
    item_lost: "Flash Game: Heli Attack 2",
    message: "When browser plugins died, this game vanished into the void. Thank you Fourie for keeping it alive.",
    era: "2006",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 4,
    name: "StarSurfer",
    item_lost: "My Blue Shoyru on Neopets",
    message: "Left them in the Neolodge 18 years ago. Fourie says they're eating giant omelettes in peace.",
    era: "2004",
    created_at: new Date().toISOString(),
  },
];

export function getLocalNotes(): LostNote[] {
  try {
    const raw = localStorage.getItem(LOCAL_NOTES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return INITIAL_NOTES;
}

export async function fetchNotes(): Promise<LostNote[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("lost_notes")
        .select("*")
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(30);

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to local notes", e);
    }
  }
  return getLocalNotes();
}

export async function addLostNote(
  name: string,
  item: string,
  message: string,
  era = "2000s"
): Promise<LostNote> {
  // Client side validation
  const cleanName = name.trim().slice(0, 24);
  const cleanItem = item.trim().slice(0, 40);
  const cleanMessage = message.trim().slice(0, 160);

  if (!cleanName || !cleanItem || !cleanMessage) {
    throw new Error("Please fill in your name, what was lost, and a memory note!");
  }

  // Rate limiting
  const lastWish = Number(localStorage.getItem("fourie:lastWish") ?? 0);
  if (Date.now() - lastWish < 15000) {
    throw new Error("Fourie is still cataloging your previous note! Please wait a moment.");
  }

  // Kind word check
  const rudeWords = ["spam", "hate", "scam"];
  const combined = `${cleanName} ${cleanItem} ${cleanMessage}`.toLowerCase();
  if (rudeWords.some((w) => combined.includes(w))) {
    throw new Error("Please keep notes gentle and kind for the 404 sanctuary.");
  }

  const newNote: LostNote = {
    id: Date.now(),
    name: cleanName,
    item_lost: cleanItem,
    message: cleanMessage,
    era,
    created_at: new Date().toISOString(),
  };

  // If Supabase is connected
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("lost_notes")
        .insert({
          name: cleanName,
          item_lost: cleanItem,
          message: cleanMessage,
          era,
        })
        .select()
        .single();

      if (!error && data) {
        localStorage.setItem("fourie:lastWish", String(Date.now()));
        return data;
      }
    } catch (e) {
      console.warn("Supabase insert error, persisting locally", e);
    }
  }

  // Local fallback
  const current = getLocalNotes();
  const updated = [newNote, ...current];
  try {
    localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(updated));
    localStorage.setItem("fourie:lastWish", String(Date.now()));
  } catch {}

  return newNote;
}

export async function getRescuedCount(): Promise<number> {
  const defaultCount = 404;
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc("bump_rescued");
      if (!error && typeof data === "number") {
        return data;
      }
    } catch {}
  }

  try {
    const raw = localStorage.getItem("fourie:odometer");
    const val = raw ? parseInt(raw, 10) + 1 : defaultCount + 1;
    localStorage.setItem("fourie:odometer", String(val));
    return val;
  } catch {
    return defaultCount;
  }
}
