import React, { useState } from "react";
import { useStore } from "../core/store";
import { audio } from "../core/audio";
import {
  Wifi,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Sparkles,
  Radio,
  BellOff,
  Eye,
  MapPin,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Sliders,
  X,
  MessageSquare,
  Network,
  Trash2,
} from "lucide-react";

export const AndroidQuickSettings: React.FC = () => {
  const quickSettingsOpen = useStore((s) => s.quickSettingsOpen);
  const setQuickSettingsOpen = useStore((s) => s.setQuickSettingsOpen);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const muted = useStore((s) => s.muted);
  const toggleMute = useStore((s) => s.toggleMute);
  const mood = useStore((s) => s.mood);
  const sendMood = useStore((s) => s.sendMood);
  const showToast = useStore((s) => s.showToast);
  const openWindow = useStore((s) => s.openWindow);

  const [brightness, setBrightness] = useState(85);
  const [dnd, setDnd] = useState(false);
  const [isPlayingLullaby, setIsPlayingLullaby] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "fourie-cache",
      app: "Fourie Caretaker",
      time: "2m ago",
      title: "Lost packets safely shelved",
      desc: "3 new memories from GeoCities and MySpace protected in cache.",
      icon: <Sparkles className="w-4 h-4 text-[#00ff66]" />,
      action: () => openWindow("rescued"),
    },
    {
      id: "router-lat",
      app: "Dijkstra Star Router",
      time: "8m ago",
      title: "Optimal Path Discovered",
      desc: "Fastest route through 1999 GeoCities to Sanctuary: 74ms.",
      icon: <Network className="w-4 h-4 text-[#00e5ff]" />,
      action: () => openWindow("router"),
    },
    {
      id: "guest-msg",
      app: "Messages",
      time: "15m ago",
      title: "Fourie is listening",
      desc: "Ask anything about forgotten dial-up sounds or old websites.",
      icon: <MessageSquare className="w-4 h-4 text-[#ffb703]" />,
      action: () => openWindow("chat"),
    },
  ]);

  if (!quickSettingsOpen) return null;

  const handleTileClick = (tileName: string, action: () => void) => {
    audio.click();
    action();
    showToast(`${tileName} toggled`);
  };

  const handlePlayMedia = async () => {
    await audio.unlock();
    audio.playDialUpSimulation();
    setIsPlayingLullaby(true);
    showToast("Playing 56K Modem Lullaby");
    setTimeout(() => setIsPlayingLullaby(false), 3200);
  };

  const handleClearNotifications = () => {
    audio.click();
    setNotifications([]);
    showToast("Notifications cleared");
  };

  return (
    <div
      role="dialog"
      aria-label="Android Quick Settings and Notifications"
      className="fixed inset-0 z-[1500] bg-black/60 backdrop-blur-md flex justify-end md:justify-center items-start pt-11 px-3 pb-20 select-none overflow-y-auto animate-fade-in"
      onClick={() => setQuickSettingsOpen(false)}
    >
      <div
        className="w-full max-w-md bg-[#121620] border border-white/10 rounded-3xl p-5 shadow-[0_24px_60px_rgba(0,0,0,0.85)] space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white text-sm">Quick Settings</span>
            <span className="text-xs text-[#555c6d] font-mono">• Android 15</span>
          </div>

          <button
            type="button"
            onClick={() => setQuickSettingsOpen(false)}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-white/80"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2x4 Quick Settings Tiles Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Tile 1: Internet */}
          <button
            type="button"
            onClick={() => handleTileClick("Wi-Fi", () => {})}
            className="m3-qs-tile active"
          >
            <div className="p-2 rounded-full bg-black/20">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold">Internet</div>
              <div className="text-[10px] tile-sub">Sanctuary_5G</div>
            </div>
          </button>

          {/* Tile 2: Sound / Lullaby Audio */}
          <button
            type="button"
            onClick={() => handleTileClick("Sound", toggleMute)}
            className={`m3-qs-tile ${!muted ? "active" : ""}`}
          >
            <div className="p-2 rounded-full bg-black/20">
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-xs font-semibold">Sound</div>
              <div className="text-[10px] tile-sub">{muted ? "Muted" : "Celesta On"}</div>
            </div>
          </button>

          {/* Tile 3: Dark / Light Theme */}
          <button
            type="button"
            onClick={() => handleTileClick("Theme", toggleTheme)}
            className="m3-qs-tile active"
          >
            <div className="p-2 rounded-full bg-black/20">
              {theme === "night" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-xs font-semibold">Theme</div>
              <div className="text-[10px] tile-sub">{theme === "night" ? "OLED Night" : "Daylight"}</div>
            </div>
          </button>

          {/* Tile 4: Fourie Companion */}
          <button
            type="button"
            onClick={() =>
              handleTileClick("Fourie Mascot", () => {
                sendMood(mood === "sleepy" ? "WAKE" : "TICKLE" as any);
              })
            }
            className={`m3-qs-tile ${mood !== "sleepy" ? "active" : ""}`}
          >
            <div className="p-2 rounded-full bg-black/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold">Companion</div>
              <div className="text-[10px] tile-sub">{mood === "sleepy" ? "Sleeping" : "Awake & Happy"}</div>
            </div>
          </button>

          {/* Tile 5: Hotspot */}
          <button
            type="button"
            onClick={() => handleTileClick("ARPANET BBS", () => {})}
            className="m3-qs-tile"
          >
            <div className="p-2 rounded-full bg-white/10">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold">Hotspot</div>
              <div className="text-[10px] text-[#9da3b4]">ARPANET BBS</div>
            </div>
          </button>

          {/* Tile 6: Do Not Disturb */}
          <button
            type="button"
            onClick={() => handleTileClick("Do Not Disturb", () => setDnd(!dnd))}
            className={`m3-qs-tile ${dnd ? "active" : ""}`}
          >
            <div className="p-2 rounded-full bg-white/10">
              <BellOff className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold">DND</div>
              <div className="text-[10px] text-[#9da3b4]">{dnd ? "On" : "Off"}</div>
            </div>
          </button>

          {/* Tile 7: Bedtime Eye Comfort */}
          <button
            type="button"
            onClick={() => handleTileClick("Bedtime Screen", () => {})}
            className="m3-qs-tile active"
          >
            <div className="p-2 rounded-full bg-black/20">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold">Night Light</div>
              <div className="text-[10px] tile-sub">Cozy Dim</div>
            </div>
          </button>

          {/* Tile 8: Location */}
          <button
            type="button"
            onClick={() => handleTileClick("Sanctuary GPS", () => {})}
            className="m3-qs-tile"
          >
            <div className="p-2 rounded-full bg-white/10">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold">Location</div>
              <div className="text-[10px] text-[#9da3b4]">Sector 404</div>
            </div>
          </button>
        </div>

        {/* Brightness Slider */}
        <div className="flex items-center gap-3 p-3 bg-white/[0.04] rounded-2xl border border-white/10">
          <Sun className="w-4 h-4 text-[#ffb703] flex-shrink-0" />
          <input
            type="range"
            min="20"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-full h-2 rounded-lg cursor-pointer accent-[#00ff66]"
          />
          <span className="text-xs font-mono text-[#9da3b4] w-8 text-right">{brightness}%</span>
        </div>

        {/* Material You Media Player Notification Card */}
        <div className="p-3.5 bg-gradient-to-r from-[#17202e] to-[#1a2838] border border-white/10 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between text-xs text-[#9da3b4] font-mono">
            <span>56K MODEM LULLABY PLAYER</span>
            <span className="text-[#00ff66] text-[10px]">WEB AUDIO SINUSOIDAL</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center flex-shrink-0">
              <Radio className="w-5 h-5 text-[#00ff66]" />
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="text-xs font-bold text-white truncate">Sportster 56K Goodnight Melody</div>
              <div className="text-[11px] text-[#9da3b4] truncate">Fourie &amp; The Lost Packets</div>
            </div>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={handlePlayMedia}
              className="w-10 h-10 rounded-full bg-[#00ff66] text-black flex items-center justify-center hover:bg-[#00f59b] transition-transform active:scale-95"
            >
              {isPlayingLullaby ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className={`h-full bg-[#00ff66] rounded-full ${
                isPlayingLullaby ? "animate-pulse w-3/4" : "w-1/3"
              }`}
            />
          </div>
        </div>

        {/* Notifications Section */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-[#9da3b4]">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Notifications</span>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleClearNotifications}
                className="text-[11px] text-[#00ff66] hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl text-center text-xs text-[#555c6d]">
              No active notifications
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    audio.click();
                    n.action();
                    setQuickSettingsOpen(false);
                  }}
                  className="p-3 bg-[#171d29] hover:bg-[#1e2636] border border-white/10 rounded-2xl cursor-pointer transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] text-[#9da3b4]">
                    <div className="flex items-center gap-1.5 font-medium text-white/90">
                      {n.icon}
                      <span>{n.app}</span>
                    </div>
                    <span>{n.time}</span>
                  </div>
                  <div className="text-xs font-semibold text-white">{n.title}</div>
                  <p className="text-[11px] text-[#9da3b4] leading-relaxed">{n.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
