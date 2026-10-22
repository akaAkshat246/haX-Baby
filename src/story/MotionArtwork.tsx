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
      {/* Storybook Card Shell */}
      <div
        className="relative w-full rounded-[30px] overflow-hidden bg-white border border-[#e879a9]/25 shadow-sm transition-all duration-300 group"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${isHovered ? 1.01 : 1}, ${isHovered ? 1.01 : 1}, 1)`,
        }}
      >
        {/* Artwork Image */}
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <img
            src={imageSrc}
            alt={title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Measured Contrast Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

          {/* Bottom Caption Overlay */}
          <div className="absolute bottom-5 left-6 right-6 z-20 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1 text-left">
              <div className="text-xs font-semibold text-[#ffb6d9]">
                {chapter}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-sans text-white">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-white/85 font-medium">
                {subtitle}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-medium text-white/90">
              <Volume2 className="w-3.5 h-3.5 text-[#ffb6d9]" />
              <span>{interacted ? "Playing gentle sound" : "Tap artwork to listen"}</span>
            </div>
          </div>
        </div>

        {/* Narrative Footer Card */}
        <div className="p-6 bg-[#fff6fa] border-t border-[#e879a9]/15 space-y-3 text-left">
          <p className="text-sm sm:text-base text-[#362238] leading-relaxed font-sans italic">
            &ldquo;{quote}&rdquo;
          </p>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#664c69] pt-2 border-t border-[#e879a9]/15">
            <span className="font-semibold text-[#c43d74]">
              {tagline}
            </span>
            <span className="text-[#9a7d9e]">
              {badges.join(" · ")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
