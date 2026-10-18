// AI Engine for Interactive Room Character
export class PandaAiEngine {
  private isListening = false;

  public processMessage(userMessage: string): { text: string; action: string } {
    const clean = userMessage.trim().toLowerCase();
    if (!clean) return { text: "Hello friend, I am here listening to you.", action: "wave" };

    if (clean.includes("dance")) {
      return { text: "Watch my happy dance moves!", action: "dance" };
    }

    if (clean.includes("food") || clean.includes("eat")) {
      return { text: "Delicious treats, crunch crunch!", action: "sit" };
    }

    if (clean.includes("sleep")) {
      return { text: "Sweet dreams, taking a cozy nap.", action: "sleep" };
    }

    return { text: `I heard you say: "${userMessage}". It is wonderful talking to you!`, action: "wave" };
  }

  public speak(text: string, onEnd?: () => void) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (onEnd) onEnd();
      return;
    }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1.05;
    utt.pitch = 1.35;
    if (onEnd) utt.onend = onEnd;
    window.speechSynthesis.speak(utt);
  }

  public startListening(onResult: (text: string) => void) {
    this.isListening = true;
  }

  public stopListening() {
    this.isListening = false;
  }
}

export const pandaAi = new PandaAiEngine();
