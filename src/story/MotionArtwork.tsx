import React, { useState, useRef } from "react";
import { Sparkles, Volume2, ShieldCheck, Star } from "lucide-react";
import { audio } from "../core/audio";

interface MotionArtworkProps {
  imageSrc: string;
  title: string;
  subtitle: string;
  chapter: string;
  quote: string;
  tagline: string;
  badges: string[];
}

export const MotionArtwork: React.FC<MotionArtworkProps> = ({
  imageSrc,
  title,
  subtitle,
  chapter,
  quote,
  tagline,
  badges,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [interacted, setInteracted] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const handleClick = () => {
    setInteracted(true);
    audio.squeak();
    setTimeout(() => setInteracted(false), 800);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="relative w-full rounded-[32px] p-1.5 cursor-pointer select-none transition-transform duration-300 ease-out"
      style={{
        perspective: 1200,
      }}
    >
      {/* Dynamic 3D Card Shell */}
      <div
        className="relative w-full rounded-[30px] overflow-hidden bg-[#160b22] border border-[#ff85b8]/25 shadow-[0_24px_60px_rgba(18,8,25,0.85)] transition-all duration-300 group"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${isHovered ? 1.015 : 1}, ${isHovered ? 1.015 : 1}, 1)`,
        }}
      >
        {/* Animated Light Sweep Aura */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#ff85b8]/10 via-transparent to-[#c084fc]/15 pointer-events-none z-10" />

        {/* Ambient Halo Ring Overlay */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-[#ff85b8]/20 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-[#c084fc]/15 to-transparent blur-3xl pointer-events-none" />

        {/* The Motion Image with Ken Burns Zoom & Breathing Effect */}
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover object-center motion-art-img group-hover:scale-105 transition-transform duration-1000 ease-out"
          />

          {/* Vignette & Contrast Gradients for Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#120817] via-[#120817]/40 to-transparent" />
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#120817]/60" />

          {/* Chapter Badge */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium tracking-wider bg-[#1b0e26]/85 backdrop-blur-md text-[#ff85b8] border border-[#ff85b8]/30 shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ff85b8] animate-pulse" />
              {chapter}
            </span>
          </div>

          {/* Sound / Tap Interaction Badge */}
          <div className="absolute top-4 right-4 z-20">
            <span className="px-3 py-1.5 rounded-full text-xs font-sans bg-[#1b0e26]/80 backdrop-blur-md text-[#fff0f7]/90 border border-white/10 shadow-lg flex items-center gap-1.5 group-hover:border-[#ff85b8]/50 transition-colors">
              <Volume2 className="w-3.5 h-3.5 text-[#ff85b8]" />
              <span>Tap artwork to listen</span>
            </span>
          </div>

          {/* Stardust Badges on image */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold font-sans text-white drop-shadow-md">
                  {title}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#ffb6d9] font-medium drop-shadow">
                {subtitle}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {badges.map((b) => (
                <span
                  key={b}
                  className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-[#14081c]/80 text-[#ffd1e6] border border-[#ff85b8]/20 backdrop-blur-sm"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Click Reaction Star Particles */}
          {interacted && (
            <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center animate-ping">
              <div className="p-4 rounded-full bg-[#ff85b8]/30 backdrop-blur-md border border-[#ff85b8]">
                <Star className="w-12 h-12 text-[#ff85b8] fill-[#ff85b8]" />
              </div>
            </div>
          )}
        </div>

        {/* Narrative Footer Card */}
        <div className="p-5 sm:p-6 bg-[#180d24] border-t border-[#ff85b8]/15 space-y-3">
          <p className="text-sm sm:text-base text-[#fff0f7]/90 leading-relaxed font-sans">
            "{quote}"
          </p>

          <div className="flex items-center justify-between text-xs text-[#d8b4c8] pt-2 border-t border-white/5 font-mono">
            <span className="flex items-center gap-1.5 text-[#ff85b8]">
              <ShieldCheck className="w-3.5 h-3.5" />
              {tagline}
            </span>
            <span className="text-[11px] text-[#8b6880] uppercase tracking-wider">
              ✦ 404 SANCTUARY RELIC ✦
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
