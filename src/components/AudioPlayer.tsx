"use client";

import React, { useState, useEffect, useRef } from "react";

interface AudioPlayerProps {
  src?: string;
  autoPlay?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src = "/sacred-garden/music.mp3",
  autoPlay = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.65;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [src]);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.log("Audio autoplay prevented", e);
      });
    }
  }, [autoPlay]);


  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => console.log("Audio playback failed", e));
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? "Mute music" : "Play music"}
        className="group relative flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#fcf8f0]/95 backdrop-blur-md border border-[#cda95a]/60 shadow-[0_4px_20px_rgba(180,140,61,0.25)] hover:border-[#B48C3D] hover:shadow-[0_6px_25px_rgba(180,140,61,0.4)] transition-all duration-300"
      >
        {/* Animated Sound Wave or Vinyl Icon */}
        <div className={`relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-[#9e762c] to-[#d8ba72] text-[#fff] shadow-inner ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </div>

        {/* Text / Status label */}
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8a6825]">
            Soundtrack
          </span>
          <span className="text-xs font-serif italic text-[#3b2d22]">
            {isPlaying ? "Playing Music" : "Click to Play"}
          </span>
        </div>

        {/* Pulse indicator */}
        <span className="relative flex h-2.5 w-2.5">
          {isPlaying && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B48C3D] opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isPlaying ? "bg-[#B48C3D]" : "bg-neutral-300"}`}></span>
        </span>
      </button>
    </div>
  );
};

export default AudioPlayer;
