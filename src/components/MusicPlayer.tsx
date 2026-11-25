"use client";

import React, { useState, useRef, useEffect } from "react";

export interface MusicPlayerProps {
  className?: string;
  visible?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  className = "",
  visible = true,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Set comfortable initial volume and sync playback state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.75;
    }
  }, []);

  if (!visible) {
    return null;
  }

  const toggleMusic = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.warn("Audio playback was prevented by the browser:", error);
          setIsPlaying(false);
        });
    }
  };

  return (
    <div
      className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[200] group select-none music-player-entrance ${className}`}
    >
      <style>{`
        @keyframes musicPlayerEntrance {
          0% {
            opacity: 0;
            transform: scale(0.75) translateY(12px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .music-player-entrance {
          animation: musicPlayerEntrance 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Hidden audio element pointing to bg_music.mp3 in public folder */}
      <audio
        ref={audioRef}
        src="/bg_music.mp3"
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Floating Tooltip */}
      <div
        className="pointer-events-none absolute bottom-full right-0 mb-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 whitespace-nowrap z-10"
        aria-hidden="true"
      >
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fdf9f2]/95 border border-[#cda95a]/60 shadow-[0_4px_16px_rgba(180,140,61,0.25)] text-[#8a6825] text-xs font-serif tracking-wider backdrop-blur-md">
          <span className="text-[10px]">♫</span>
          <span>{isPlaying ? "توقف موسیقی / Pause" : "پخش موسیقی / Play"}</span>
        </div>
      </div>

      {/* Animated Sound Ripple Aura (Visible only while playing) */}
      {isPlaying && (
        <>
          <span
            className="absolute inset-0 rounded-full bg-[#cda95a]/30 animate-ping pointer-events-none"
            style={{ animationDuration: "2.2s" }}
          />
          <span
            className="absolute -inset-1 rounded-full border border-[#cda95a]/40 animate-pulse pointer-events-none"
            style={{ animationDuration: "1.8s" }}
          />
        </>
      )}

      {/* Main Music Player Button */}
      <button
        onClick={toggleMusic}
        type="button"
        aria-label={isPlaying ? "توقف موسیقی (Pause Music)" : "پخش موسیقی (Play Music)"}
        title={isPlaying ? "توقف موسیقی (Pause Music)" : "پخش موسیقی (Play Music)"}
        className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-[0_4px_20px_rgba(180,140,61,0.35)] hover:shadow-[0_6px_28px_rgba(180,140,61,0.55)] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#cda95a]/60"
      >
        <svg
          viewBox="0 0 512 512"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Rich Royal Gold Gradient matching the page theme */}
            <linearGradient id="musicGoldGrad" x1="15%" y1="0%" x2="85%" y2="100%">
              <stop offset="0%" stopColor="#e2caa0" />
              <stop offset="25%" stopColor="#cfab65" />
              <stop offset="60%" stopColor="#B48C3D" />
              <stop offset="100%" stopColor="#7e5a1b" />
            </linearGradient>

            {/* Rim Gradient for metallic depth */}
            <linearGradient id="musicGoldRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff8e8" />
              <stop offset="50%" stopColor="#d8ba72" />
              <stop offset="100%" stopColor="#634510" />
            </linearGradient>
          </defs>

          {/* Outer Rim */}
          <circle cx="256" cy="256" r="250" fill="url(#musicGoldRim)" />

          {/* Main Gold Disc matching music_player.png */}
          <circle cx="256" cy="256" r="240" fill="url(#musicGoldGrad)" />

          {/* Inner luxury highlight ring */}
          <circle
            cx="256"
            cy="256"
            r="234"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="3"
          />

          {isPlaying ? (
            /* Pause Icon (Two vertical rounded bars matching music_player geometry) */
            <g fill="#fdfaf3" className="drop-shadow-[0_1px_2px_rgba(59,45,34,0.3)]">
              <rect x="180" y="145" width="46" height="222" rx="14" />
              <rect x="286" y="145" width="46" height="222" rx="14" />
            </g>
          ) : (
            /* Play Triangle (Matching exact coordinates and rounded styling of music_player.png) */
            <path
              d="M194 146C194 135.5 205.5 129 214.5 134.5L372 244.5C380.5 250 380.5 262 372 267.5L214.5 377.5C205.5 383 194 376.5 194 366V146Z"
              fill="#fdfaf3"
              className="drop-shadow-[0_1px_2px_rgba(59,45,34,0.3)]"
            />
          )}
        </svg>

        {/* Small floating sound indicator dot when playing */}
        {isPlaying && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#cda95a] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#8a6825] border border-[#fdfaf3]" />
          </span>
        )}
      </button>
    </div>
  );
};

export default MusicPlayer;
