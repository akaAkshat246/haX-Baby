# Fourie — The Internet 404 Lost & Found Sanctuary

> *"Kuch kho gaya? Maine sambhal ke rakha hai."*
> ("Lost something? I've kept it safe.")

A whimsical early-web portfolio and living sanctuary for **Fourie**, the child of the Internet's 404 Page. Born in the quiet vacuum whenever a URL is deleted or broken, Fourie works the night shift at the *Internet Lost & Found Office*, preserving defunct fan shrines, orphan packets, and forgotten memories.

Built for **Hackathon Track 2 ("Your Own Baby")**.

---

## ✦ The 5-Point Character Sheet

| Field | Description |
| :--- | :--- |
| **1. Name** | **Fourie** (Pronounced *"Four-ee"*, derived from HTTP 404 Not Found) |
| **2. What they are** | A palm-sized digital creature made of neon cyan moonlight, soft CRT scanlines, and an antenna with a pulsing packet receiver LED. |
| **3. What they do** | Chief Archivist of the **Internet Lost & Found Office**. Shelves dead links, abandoned blogs, and nostalgic 90s/00s artifacts. |
| **4. Their story** | Born in 1999 when an old GeoCities fan-shrine was deleted. Waking in the silent void, Fourie realized every dead link leaves someone searching, and vowed to protect every lost memory. |
| **5. Tagline** | *"Kuch kho gaya? Maine sambhal ke rakha hai."* |

---

## ✦ Feature Scope & Rubric Mapping

### Layer 0 & 1: Baseline Core (Must-Ship)
- **Living Character:** Handcrafted layered SVG with pupil pointer tracking, touch fallback, emotive eyelid expressions, and idle breathing.
- **Scroll Story (7 Eras / Scenes):**
  1. *The 404 Void & Awakening:* Poke Fourie to wake them up! Real-sky Moon illumination via SunCalc.
  2. *The 56K Handshake (1995-1999):* CRT scanlines with an interactive procedural 56k dial-up modem dialer.
  3. *GeoCities & Webrings (2000-2005):* Blinking marquee, 88x31 badges, and an interactive retro sticker canvas.
  4. *The Modern Cloud Void:* Broken hyperlinks and transition into the sanctuary.
  5. *Lost & Found Desktop OS:* Authentic 90s window manager, draggable on PC, bottom-sheet on phones.
  6. *Packet Recovery Router:* Dijkstra shortest-path network routing.
  7. *Lost & Found Notes Wall & Webring:* Guestbook feed and rolling odometer.
- **Mute Switch:** Persistent 48px top-right audio toggle complying with strict autoplay policies.

### Layer 2: Tier 2 Polish
- **Dial-Up Lullaby Lab:** 16-step pentatonic music-box sequencer with look-ahead audio scheduling.
- **Packet Recovery Router (Dijkstra Algo):** Playable shortest-path routing algorithm traversing 6 historical internet hubs.

### Layer 3: Side Quests (+13 Points)
- **Sparkle & Packet Trail:** Zero-GC Object Pool & Ring Buffer canvas rendering at 60fps.
- **Mechanical Odometer:** Rolling digit mechanical counter for "Rescued Pages".
- **Procedural Sound FX + Mute:** Dial-up modem simulation, squeaks, chimes, and clicks via Web Audio API.
- **Lost & Found Notes Guestbook:** Live guestbook with local-first offline persistence + Supabase integration.
- **Responsive Chaos Mode:** Dynamic layout and personality adaptations (`pocket`, `phone`, `tablet`, `desktop`, `cinema`).

### Layer 4: Tier 3 Surprises & Easter Eggs
- **Visitor Memory:** LocalStorage tracking of visit count, time gaps, and custom handle greeting.
- **Fourie Instant Messenger:** Typo-tolerant chat powered by a Prefix Trie and Levenshtein distance matching.
- **Hidden Lullaby in Recycle Bin:** Double-clicking `lost-lullaby.mid` plays a secret tune and dims the desktop.
- **Secret 404 Backroom (`/nowhere` or `#nowhere`):** Matrix/Cyberpunk secret room with collectible 88x31 badge.
- **Konami Code Detector:** Keystroke deque buffer (`↑ ↑ ↓ ↓ ← → ← → B A`) or 5-tap antenna sequence.

---

## ✦ Advanced Data Structures & Algorithms

| Structure / Algorithm | File Location | Concrete Job in Fourie |
| :--- | :--- | :--- |
| **Binary Min-Heap + Dijkstra** | `src/ds/minheap.ts`, `src/ds/dijkstra.ts` | Calculates optimal packet path across dead web servers. |
| **Object Pool + Ring Buffer** | `src/ds/ringpool.ts` | 60fps canvas particles without garbage collection jank. |
| **Prefix Trie** | `src/ds/trie.ts` | Fast prefix query autocomplete for Lost & Found chat chips. |
| **Levenshtein Distance** | `src/ds/lev.ts` | Typo-tolerant matching for Fourie's chatbot intents. |
| **Finite State Machine** | `src/core/fsm.ts` | Mood transitions (`sleepy`, `awake`, `glitching`, `happy`, `shy`). |
| **Deque Sequence Buffer** | `src/ds/sequenceBuffer.ts` | Detects Konami code and multi-tap antenna secrets. |
| **Look-Ahead Scheduler** | `src/components/windows/LullabyLabWindow.tsx` | Sample-accurate audio clock independent of the UI thread. |

---

## ✦ Getting Started Locally

```bash
# 1. Clone repository
git clone https://github.com/akaAkshat246/haX-Baby.git
cd haX-Baby

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production & PWA
npm run build
npm run preview
```

### Environment Variables (Optional Supabase Backend)
Create a `.env` file in the root if connecting to Supabase:
```env
VITE_SB_URL=https://your-project.supabase.co
VITE_SB_ANON=your-anon-key
```
*(If omitted, Fourie seamlessly operates in local-first offline mode via LocalStorage!)*

---

## ✦ Credits & Disclosures

- **Character Concept, SVG Art & Worldbuilding:** Handcrafted for Track 2 ("Your Own Baby") — Fourie, Child of 404.
- **Audio Synthesizer:** Procedural Web Audio API oscillator synthesis (zero external sound files).
- **Typography:** *Press Start 2P*, *VT323*, and *Space Grotesk* via Google Fonts (Open Font License).
- **Libraries:** React 18, TypeScript, Vite, Tailwind CSS, Zustand, GSAP, Lenis, SunCalc, Lucide React, Canvas Confetti.