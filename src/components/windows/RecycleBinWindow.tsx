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
      icon: <FileMusic className="w-4 h-4 text-[#00ff66]" />,
      action: async () => {
        setPlayingSecret(true);
        await audio.unlock();

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
      icon: <Image className="w-4 h-4 text-[#ffb703]" />,
      action: () => {
        audio.squeak();
      },
    },
    {
      id: "aim",
      name: "away_message_deep_thoughts.txt",
      size: "1.1 KB",
      date: "08/14/2002",
      icon: <FileText className="w-4 h-4 text-[#00e5ff]" />,
      action: () => {
        audio.click();
      },
    },
    {
      id: "backroom",
      name: "secret_backroom_portal.key",
      size: "512 B",
      date: "TODAY",
      icon: <Key className="w-4 h-4 text-[#00ff66] animate-pulse" />,
      action: () => {
        audio.glitch();
        openWindow("nowhere");
      },
    },
  ];

  return (
    <div className="space-y-4 font-sans text-sm">
      <div className="bg-[#0e1117] border border-white/10 p-3 rounded-xl text-xs font-mono flex items-center justify-between text-[#9da3b4]">
        <span className="flex items-center gap-2 text-white">
          <Trash2 className="w-4 h-4 text-red-400" />
          <span>RECYCLE BASKET // DISCARDED BYTES</span>
        </span>
        <span className="text-[#00ff66]">4 ITEMS</span>
      </div>

      <p className="text-xs text-[#9da3b4] leading-relaxed">
        Everything deleted from the surface web ends up here. Fourie sifted through the basket and cataloged these relics:
      </p>

      {playingSecret && (
        <div className="p-3 bg-[#090b10] border border-[#00ff66] rounded-xl text-[#00ff66] text-xs font-mono flex items-center gap-2 animate-pulse">
          <Sparkles className="w-4 h-4 text-[#00ff66] animate-spin" />
          <span>PLAYING FORGOTTEN LULLABY... DIMMING LIGHTS FOR BABY FOURIE</span>
        </div>
      )}

      {/* Dark Table */}
      <div className="bg-[#0e1117] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#141822] border-b border-white/10 font-mono text-[10px] text-[#555c6d] uppercase select-none">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Size</th>
              <th className="p-3">Origin Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {binItems.map((item) => (
              <tr
                key={item.id}
                onClick={item.action}
                className="hover:bg-white/[0.04] cursor-pointer select-none transition-colors"
                title="Click to inspect or play"
              >
                <td className="p-3 flex items-center gap-2.5 font-medium text-white">
                  {item.icon}
                  <span className="font-mono text-xs">{item.name}</span>
                </td>
                <td className="p-3 text-[#555c6d] font-mono text-[11px]">{item.size}</td>
                <td className="p-3 text-[#555c6d] font-mono text-[11px]">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs font-mono text-[#555c6d] bg-white/[0.02] p-3 rounded-xl border border-white/10">
        Hint: Tap <span className="text-[#00ff66] underline">lost-lullaby.mid</span> to hear the forgotten song or <span className="text-[#00ff66] underline">secret_backroom_portal.key</span> to access the 404 Backroom!
      </div>
    </div>
  );
};
