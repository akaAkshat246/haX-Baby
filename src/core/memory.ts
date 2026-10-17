// Visitor Memory with LocalStorage

export type VisitorProfile = {
  first: number;
  last: number;
  visits: number;
  name?: string;
  secretFound?: boolean;
};

const MEMORY_KEY = "fourie:visitor:v1";

export function getVisitorProfile(): { profile: VisitorProfile; greeting: string } {
  const now = Date.now();
  let profile: VisitorProfile = {
    first: now,
    last: now,
    visits: 0,
  };

  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    if (raw) {
      profile = JSON.parse(raw);
    }
  } catch {}

  const gapHours = (now - profile.last) / 3.6e6;
  profile.visits += 1;
  profile.last = now;

  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(profile));
  } catch {}

  let greeting = "";
  if (profile.visits === 1) {
    greeting = "Oh! A new traveler fell into the 404 gap. Don't worry, nothing is lost forever here.";
  } else if (gapHours > 24) {
    const days = Math.max(1, Math.round(gapHours / 24));
    greeting = `You came back! It's been ${days} day(s). I kept all the rescued pages dusted and safe.`;
  } else {
    greeting = "Back so soon? My packet antenna is glowing bright cyan!";
  }

  return { profile, greeting };
}

export function saveVisitorName(name: string): void {
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    const profile: VisitorProfile = raw ? JSON.parse(raw) : { first: Date.now(), last: Date.now(), visits: 1 };
    profile.name = name;
    localStorage.setItem(MEMORY_KEY, JSON.stringify(profile));
  } catch {}
}

export function markSecretFound(): void {
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    const profile: VisitorProfile = raw ? JSON.parse(raw) : { first: Date.now(), last: Date.now(), visits: 1 };
    profile.secretFound = true;
    localStorage.setItem(MEMORY_KEY, JSON.stringify(profile));
    localStorage.setItem("fourie:secret", "1");
  } catch {}
}
