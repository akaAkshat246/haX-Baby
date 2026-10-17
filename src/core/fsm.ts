export type Mood = "sleepy" | "awake" | "glitching" | "happy" | "shy" | "searching";
export type Ev =
  | "WAKE"
  | "POKE"
  | "IDLE"
  | "PRAISE"
  | "GLITCH"
  | "RESTORE"
  | "NIGHT"
  | "DAY";

const TRANSITIONS: Record<Mood, Partial<Record<Ev, Mood>>> = {
  sleepy: {
    WAKE: "awake",
    POKE: "glitching",
    DAY: "awake",
    NIGHT: "sleepy",
  },
  awake: {
    POKE: "happy",
    IDLE: "sleepy",
    PRAISE: "shy",
    GLITCH: "glitching",
    NIGHT: "sleepy",
  },
  happy: {
    IDLE: "awake",
    POKE: "shy",
    GLITCH: "glitching",
  },
  glitching: {
    RESTORE: "awake",
    IDLE: "awake",
    POKE: "happy",
  },
  shy: {
    IDLE: "awake",
    POKE: "happy",
  },
  searching: {
    IDLE: "awake",
    RESTORE: "awake",
  },
};

export const nextMood = (current: Mood, event: Ev): Mood => {
  return TRANSITIONS[current]?.[event] ?? current;
};
