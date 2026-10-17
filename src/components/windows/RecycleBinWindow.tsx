import React, { useState } from "react";
import { audio } from "../../core/audio";
import { useStore } from "../../core/store";
import { bus } from "../../core/bus";
import { markSecretFound } from "../../core/memory";
import { Trash2, FileMusic, Image, FileText, Key, Sparkles } from "lucide-react";

export const RecycleBinWindow: React.FC = () => {
  const [playingSecret, setPlayingSecret] = useState(false);
  const sendMood = useStore((s) => s.sendMood);
  const unlockSecret = useStore((s) => s.unlockSecret);
  const openWindow = useStore((s) => s.openWindow);

  const binItems = [
    {
      id: "lullaby",
      name: "lost-lullaby.mid",
      size: "4.2 KB",
      date: "10/17/1999",
      icon: <FileMusic className="w-5 h-5 text-glitch-magenta" />,
      action: async () => {
        setPlayingSecret(true);
        await audio.unlock();

        // Authentic secret pentatonic sequence from Section 4.6 of Addendum
        const SECRET_MELODY = [
          392, 440, 523.25, 440, 392, 329.63, 392, 0, 293.66, 329.63, 392, 329.63, 293.66, 261.63,
        ];

        SECRET_MELODY.forEach((freq, i) => {
          if (freq > 0) {
            audio.note(freq, i * 0.38, 1.1, "sine", 0.3);
          }
        });

        sendMood("IDLE");
        document.body.classList.add("dim");
        markSecretFound();
        unlockSecret();
        bus.emit("secret", undefined);

        setTimeout(() => {
          document.body.classList.remove("dim");
          setPlayingSecret(false);
        }, 6500);
      },
    },
    {
      id: "gif",
      name: "dancing_baby_under_construction.gif",
      size: "24.8 KB",
      date: "04/02/1998",
      icon: <Image className="w-5 h-5 text-glitch-amber" />,
      action: () => {
        audio.squeak();
      },
    },
    {
      id: "aim",
      name: "away_message_deep_thoughts.txt",
      size: "1.1 KB",
      date: "08/14/2002",
      icon: <FileText className="w-5 h-5 text-glitch-cyan" />,
      action: () => {
        audio.click();
      },
    },
    {
      id: "backroom",
      name: "secret_backroom_portal.key",
      size: "512 B",
      date: "TODAY",
      icon: <Key className="w-5 h-5 text-glitch-green animate-pulse" />,
      action: () => {
        audio.glitch();
        openWindow("nowhere");
      },
    },
  ];

  return (
    <div className="space-y-4 font-display">
      <div className="bg-win-header text-white p-2 text-xs font-pixel flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Trash2 className="w-4 h-4 text-red-400" />
          <span>RECYCLE BIN // DISCARDED BYTES</span>
        </span>
        <span>4 ITEMS</span>
      </div>

      <p className="text-xs text-gray-700 leading-relaxed">
        Everything deleted from the surface web ends up here. Fourie sifted through the trash and labeled these relics:
      </p>

      {playingSecret && (
        <div className="p-2.5 bg-void-900 border-2 border-glitch-cyan rounded text-glitch-cyan text-xs font-pixel flex items-center gap-2 animate-pulse">
          <Sparkles className="w-4 h-4 text-glitch-amber animate-spin" />
          <span>PLAYING LOST LULLABY... DIMMING LIGHTS FOR FOURIE</span>
        </div>
      )}

      {/* Retro File List Table */}
      <div className="bg-white border-2 border-gray-400 rounded overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-200 border-b border-gray-400 font-pixel text-[9px] text-gray-700 select-none">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Size</th>
              <th className="p-2">Origin Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {binItems.map((item) => (
              <tr
                key={item.id}
                onClick={item.action}
                className="hover:bg-blue-100 cursor-pointer select-none transition-colors"
                title="Double click or tap to inspect"
              >
                <td className="p-2 flex items-center gap-2 font-medium text-ink">
                  {item.icon}
                  <span>{item.name}</span>
                </td>
                <td className="p-2 text-gray-500 font-mono text-[11px]">{item.size}</td>
                <td className="p-2 text-gray-500 font-mono text-[11px]">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-[11px] font-pixel text-gray-600 bg-gray-100 p-2 border border-gray-300">
        💡 Hint: Tap <span className="text-win-header underline font-bold">lost-lullaby.mid</span> to hear the forgotten song or <span className="text-win-header underline font-bold">secret_backroom_portal.key</span> to access the 404 Backroom!
      </div>
    </div>
  );
};
