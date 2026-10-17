import { levenshtein, fuzzyMatches } from "../ds/lev";
import { PrefixTrie } from "../ds/trie";

export type ChatIntent = {
  id: string;
  keywords: string[];
  replies: string[];
};

export const CHAT_INTENTS: ChatIntent[] = [
  {
    id: "identity",
    keywords: ["who", "name", "fourie", "koun", "pehechan", "identity", "creature"],
    replies: [
      "I'm Fourie! When a webpage gets deleted, I'm born in the quiet gap. Kuch kho gaya? Maine sambhal ke rakha hai.",
      "Beep boop! I am Fourie, the child of the 404 page. Welcome to my digital sanctuary!",
    ],
  },
  {
    id: "tagline",
    keywords: ["lost", "kho", "kuch", "sambhal", "tagline", "motto"],
    replies: [
      "Kuch kho gaya? Maine sambhal ke rakha hai. Every lost file, dead blog, and broken URL has a home here.",
      "Don't worry about broken links! I catalog everything that slips through the network cracks.",
    ],
  },
  {
    id: "office",
    keywords: ["office", "job", "work", "kaam", "duty", "found", "desk"],
    replies: [
      "I'm the night-shift archivist at the Internet's Lost & Found Office! I rescue lost packets before the garbage collector sweeps them.",
      "I sort incoming 404 requests and preserve the good memories hidden inside old websites.",
    ],
  },
  {
    id: "dialup",
    keywords: ["dialup", "modem", "sound", "noise", "lullaby", "music", "sing"],
    replies: [
      "My favorite nursery rhyme is the 56k modem handshake! Beeep... booop... krshhhhh-pshhht! Check out the Lullaby Lab in my OS.",
      "Tap the Lullaby Lab on my desktop to hear procedural chiptunes composed from dial-up frequencies!",
    ],
  },
  {
    id: "projects",
    keywords: ["projects", "pages", "rescued", "portfolio", "saved", "archive"],
    replies: [
      "I've rescued three wondrous web relics: The GeoCities Shrine, Dial-Up Lullaby Lab, and the Packet Recovery Router! Open the Parcels window to explore.",
      "You can launch all 3 rescued artifacts from the desktop icons or the taskbar below!",
    ],
  },
  {
    id: "secret",
    keywords: ["secret", "egg", "nowhere", "hidden", "bin", "trash", "recycle"],
    replies: [
      "Psst... have you peeked inside the Recycle Bin? Or tapped my packet antenna 5 times? You might find something forgotten...",
      "There's also a rumor that typing /nowhere in the address bar takes you to the secret 404 backroom!",
    ],
  },
  {
    id: "sleepy",
    keywords: ["sleep", "nap", "soja", "tired", "rest", "night"],
    replies: [
      "Even 404 spirits need a nap. Leave a note on the guestbook wall while I rest my antenna!",
      "Yaaawn... 01110011 01101100 01100101 01100101 01110000...",
    ],
  },
];

// Initialize Trie with searchable topics
export const topicTrie = new PrefixTrie();
CHAT_INTENTS.forEach((intent) => {
  intent.keywords.forEach((keyword) => {
    topicTrie.insert(keyword, intent.id);
  });
});

// Common suggestions chips
export const SUGGESTION_CHIPS = [
  "Who are you?",
  "Kuch kho gaya?",
  "What is the Lost & Found office?",
  "Play dial-up lullaby",
  "Show rescued projects",
  "Any secrets?",
];

export function getFourieReply(userInput: string): string {
  const cleanInput = userInput
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();

  if (!cleanInput) {
    return "Mmm? Speak to my antenna! Ask me about lost websites, dial-up sounds, or the 404 office.";
  }

  const tokens = cleanInput.split(/\s+/);
  let bestIntent: ChatIntent | null = null;
  let bestScore = 0;

  for (const intent of CHAT_INTENTS) {
    let score = 0;
    for (const token of tokens) {
      for (const key of intent.keywords) {
        if (token === key) {
          score += 3;
        } else if (fuzzyMatches(token, key, 1)) {
          score += 2;
        }
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  if (bestIntent && bestScore >= 2) {
    const replies = bestIntent.replies;
    return replies[Math.floor(Math.random() * replies.length)];
  }

  const fallbackReplies = [
    "Kuch kho gaya? I checked my index, but couldn't locate that keyword. Try asking about 'who are you', 'dialup', 'projects', or 'secrets'!",
    "Blinking antenna... That sounds like an uncharted URL! Ask me about the 404 office or check the desktop parcels.",
    "01001110 01101111... My 404 cache missed that! But I'd love to chat about rescued pages or dial-up lullabies.",
  ];

  return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
}
