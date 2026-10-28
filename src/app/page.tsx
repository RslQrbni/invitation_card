"use client";

import React, { useState } from "react";
import EnvelopeCard from "@/components/EnvelopeCard";
import SacredGardenInvitation from "@/components/SacredGardenInvitation";

export default function Home() {
  const [isAudioAutoPlay, setIsAudioAutoPlay] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleOpen = () => {
    // User interacted with the document: initiate music playback immediately
    setIsAudioAutoPlay(true);
  };

  const handleFullScreen = () => {
    setIsFullScreen(true);
  };

  return (
    <main className="relative min-h-screen bg-[#F9F0E0]">
      {/* ENVELOPE WITH EMBEDDED INVITATION PAGE */}
      <EnvelopeCard
        onOpen={handleOpen}
        onFullScreen={handleFullScreen}
      >
        <SacredGardenInvitation
          isAudioAutoPlay={isAudioAutoPlay}
        />
      </EnvelopeCard>

      {/* Re-open Envelope Floating Button */}
      {isFullScreen && (
        <button
          onClick={() => {
            setIsFullScreen(false);
            setIsAudioAutoPlay(false);
            window.scrollTo({ top: 0, behavior: "instant" });
            // Force full page reload to reset envelope state
            window.location.reload();
          }}
          aria-label="Replay envelope opening"
          className="fixed bottom-6 left-6 z-[200] flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#fdf9f2]/95 border border-[#cda95a]/60 shadow-[0_4px_16px_rgba(180,140,61,0.25)] text-[#8a6825] hover:text-[#3b2d22] hover:border-[#B48C3D] text-xs font-serif tracking-wider uppercase transition-all backdrop-blur-md hover:scale-105 active:scale-95"
        >
          <span>✉</span>
          <span className="hidden sm:inline">Envelope</span>
        </button>
      )}
    </main>
  );
}
