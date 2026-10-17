import { create } from "zustand";
import { Mood, Ev, nextMood } from "./fsm";
import { ScreenShape } from "./shape";
import { audio } from "./audio";

export type WindowId = "about" | "rescued" | "lullaby" | "notes" | "bin" | "nowhere" | "chat";

interface AppState {
  // Character State
  mood: Mood;
  sendMood: (event: Ev) => void;
  setMoodDirect: (mood: Mood) => void;

  // Environment & Theme
  theme: "night" | "day";
  setTheme: (theme: "night" | "day") => void;
  toggleTheme: () => void;

  // Audio
  muted: boolean;
  toggleMute: () => void;

  // Responsive Shape
  shape: ScreenShape;
  setShape: (shape: ScreenShape) => void;

  // Metrics
  rescuedCount: number;
  incrementRescued: () => void;

  // Window Management Queue
  openWindows: WindowId[];
  topZ: number;
  zIndices: Record<string, number>;
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  closeAllWindows: () => void;
  focusWindow: (id: WindowId) => void;

  // Secret state
  secretUnlocked: boolean;
  unlockSecret: () => void;
}

export const maxWindowsForShape = (shape: ScreenShape): number => {
  return shape === "pocket" || shape === "phone" ? 1 : 2;
};

export const useStore = create<AppState>((set, get) => ({
  mood: "sleepy",
  sendMood: (ev: Ev) =>
    set((state) => ({
      mood: nextMood(state.mood, ev),
    })),
  setMoodDirect: (mood: Mood) => set({ mood }),

  theme: "night",
  setTheme: (theme) => {
    document.body.dataset.theme = theme;
    set({ theme });
  },
  toggleTheme: () => {
    const nextTheme = get().theme === "night" ? "day" : "night";
    document.body.dataset.theme = nextTheme;
    set({ theme: nextTheme });
  },

  muted: audio.muted,
  toggleMute: () => {
    const nextMuted = !get().muted;
    audio.setMuted(nextMuted);
    set({ muted: nextMuted });
  },

  shape: "desktop",
  setShape: (shape) => set({ shape }),

  rescuedCount: 404,
  incrementRescued: () =>
    set((state) => ({ rescuedCount: state.rescuedCount + 1 })),

  openWindows: [],
  topZ: 20,
  zIndices: {
    about: 20,
    rescued: 20,
    lullaby: 20,
    notes: 20,
    bin: 20,
    nowhere: 25,
    chat: 20,
  },

  openWindow: (id: WindowId) => {
    const state = get();
    const maxAllowed = maxWindowsForShape(state.shape);
    const newOpen = state.openWindows.includes(id)
      ? [...state.openWindows]
      : [...state.openWindows, id];

    while (newOpen.length > maxAllowed) {
      newOpen.shift(); // FIFO: close oldest window cleanly
    }

    const nextTop = state.topZ + 1;
    set({
      openWindows: newOpen,
      topZ: nextTop,
      zIndices: {
        ...state.zIndices,
        [id]: nextTop,
      },
    });
  },

  closeWindow: (id: WindowId) => {
    set((state) => ({
      openWindows: state.openWindows.filter((winId) => winId !== id),
    }));
  },

  closeAllWindows: () => set({ openWindows: [] }),

  focusWindow: (id: WindowId) => {
    const state = get();
    const nextTop = state.topZ + 1;
    set({
      topZ: nextTop,
      zIndices: {
        ...state.zIndices,
        [id]: nextTop,
      },
    });
  },

  secretUnlocked: false,
  unlockSecret: () => set({ secretUnlocked: true }),
}));
