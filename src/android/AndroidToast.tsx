import React from "react";
import { useStore } from "../core/store";
import { Sparkles } from "lucide-react";

export const AndroidToast: React.FC = () => {
  const toastMessage = useStore((s) => s.toastMessage);

  if (!toastMessage) return null;

  return (
    <div className="android-toast" role="status" aria-live="polite">
      <Sparkles className="w-4 h-4 text-[#00ff66]" />
      <span>{toastMessage}</span>
    </div>
  );
};
