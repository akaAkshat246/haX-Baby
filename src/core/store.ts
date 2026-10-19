import { create } from "zustand";
import { Mood, Ev, nextMood } from "./fsm";
import { ScreenShape } from "./shape";
import { audio } from "./audio";

export type WindowId =
  | "about"
  | "rescued"
  | "lullaby"
  | "notes"
  | "bin"
  | "nowhere"
  | "chat"
  | "router"
  | "geocities"
  | "webring";

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
  minimizedWindows: WindowId[];
  maximizedWindow: WindowId | null;
  topZ: number;
  zIndices: Record<string, number>;
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  closeAllWindows: () => void;
  focusWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  toggleMaximizeWindow: (id: WindowId) => void;

  // Android Shell UI Panels
  quickSettingsOpen: boolean;
  setQuickSettingsOpen: (open: boolean) => void;
  toggleQuickSettings: () => void;

  appDrawerOpen: boolean;
  setAppDrawerOpen: (open: boolean) => void;
  toggleAppDrawer: () => void;

  recentsOpen: boolean;
  setRecentsOpen: (open: boolean) => void;
  toggleRecents: () => void;

  // Android Toast Notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // View mode: 3D WebGL room stations
  viewMode: "kitty" | "panda" | "story" | "lullaby" | "relics" | "desktop";
  setViewMode: (mode: "kitty" | "panda" | "story" | "lullaby" | "relics" | "desktop") => void;
  enterPanda: () => void;
  enterKitty: () => void;
  enterDesktop: (fullscreen?: boolean) => void;
  enterStory: () => void;
  enterLullaby: () => void;
  enterRelics: () => void;

  // Secret state
  secretUnlocked: boolean;
  unlockSecret: () => void;
}

export const maxWindowsForShape = (shape: ScreenShape): number => {
  return shape === "pocket" || shape === "phone" ? 1 : 4;
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
  minimizedWindows: [],
  maximizedWindow: null,
  topZ: 20,
  zIndices: {
    about: 20,
    rescued: 20,
    lullaby: 20,
    notes: 20,
    bin: 20,
    nowhere: 25,
    chat: 20,
    router: 20,
    geocities: 20,
    webring: 20,
  },

  openWindow: (id: WindowId) => {
    const state = get();
    const maxAllowed = maxWindowsForShape(state.shape);
    const wasOpen = state.openWindows.includes(id);
    const newOpen = wasOpen ? [...state.openWindows] : [...state.openWindows, id];

    while (newOpen.length > maxAllowed) {
      newOpen.shift();
    }

    const nextTop = state.topZ + 1;
    set({
      openWindows: newOpen,
      minimizedWindows: state.minimizedWindows.filter((winId) => winId !== id),
      topZ: nextTop,
      zIndices: {
        ...state.zIndices,
        [id]: nextTop,
      },
      appDrawerOpen: false,
      recentsOpen: false,
      quickSettingsOpen: false,
    });
  },

  closeWindow: (id: WindowId) => {
    set((state) => ({
      openWindows: state.openWindows.filter((winId) => winId !== id),
      minimizedWindows: state.minimizedWindows.filter((winId) => winId !== id),
      maximizedWindow: state.maximizedWindow === id ? null : state.maximizedWindow,
    }));
  },

  closeAllWindows: () =>
    set({
      openWindows: [],
      minimizedWindows: [],
      maximizedWindow: null,
      recentsOpen: false,
    }),

  focusWindow: (id: WindowId) => {
    const state = get();
    const nextTop = state.topZ + 1;
    set({
      topZ: nextTop,
      zIndices: {
        ...state.zIndices,
        [id]: nextTop,
      },
      minimizedWindows: state.minimizedWindows.filter((winId) => winId !== id),
    });
  },

  minimizeWindow: (id: WindowId) => {
    set((state) => ({
      minimizedWindows: state.minimizedWindows.includes(id)
        ? state.minimizedWindows
        : [...state.minimizedWindows, id],
    }));
  },

  toggleMaximizeWindow: (id: WindowId) => {
    set((state) => ({
      maximizedWindow: state.maximizedWindow === id ? null : id,
    }));
  },

  quickSettingsOpen: false,
  setQuickSettingsOpen: (open: boolean) => set({ quickSettingsOpen: open }),
  toggleQuickSettings: () =>
    set((state) => ({ quickSettingsOpen: !state.quickSettingsOpen, appDrawerOpen: false, recentsOpen: false })),

  appDrawerOpen: false,
  setAppDrawerOpen: (open: boolean) => set({ appDrawerOpen: open }),
  toggleAppDrawer: () =>
    set((state) => ({ appDrawerOpen: !state.appDrawerOpen, quickSettingsOpen: false, recentsOpen: false })),

  recentsOpen: false,
  setRecentsOpen: (open: boolean) => set({ recentsOpen: open }),
  toggleRecents: () =>
    set((state) => ({ recentsOpen: !state.recentsOpen, appDrawerOpen: false, quickSettingsOpen: false })),

  toastMessage: null,
  showToast: (msg: string) => {
    set({ toastMessage: msg });
    setTimeout(() => {
      if (get().toastMessage === msg) {
        set({ toastMessage: null });
      }
    }, 2800);
  },

  secretUnlocked: false,
  unlockSecret: () => set({ secretUnlocked: true }),

  viewMode: "kitty",
  setViewMode: (viewMode) => set({ viewMode }),
  enterPanda: () => {
    set({ viewMode: "kitty" });
  },
  enterKitty: () => {
    set({ viewMode: "kitty" });
  },
  enterDesktop: (fullscreen = true) => {
    if (fullscreen && typeof document !== "undefined") {
      try {
        const elem = document.documentElement as any;
        if (!document.fullscreenElement) {
          if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(() => {});
          } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
          } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
          }
        }
      } catch (err) {
        // fullscreen rejected or blocked by browser policy
      }
    }
    set({ viewMode: "desktop" });
  },
  enterStory: () => {
    set({ viewMode: "story" });
  },
  enterLullaby: () => {
    set({ viewMode: "lullaby" });
  },
  enterRelics: () => {
    set({ viewMode: "relics" });
  },
}));
