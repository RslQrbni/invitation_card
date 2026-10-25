"use client";

import React, { useState } from "react";
import EnvelopeCard from "@/components/EnvelopeCard";
import SacredGardenInvitation from "@/components/SacredGardenInvitation";

export default function Home() {
  const [isIntroActive, setIsIntroActive] = useState(true);
  const [isAudioAutoPlay, setIsAudioAutoPlay] = useState(false);

  const handleOpen = () => {
    // User interacted with the document: initiate music playback immediately
    setIsAudioAutoPlay(true);
  };

  const handleProceed = () => {
    setIsIntroActive(false);
    // Smooth scroll to top of invitation
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="relative min-h-screen bg-[#F9F0E0]">
      {/* 1. INITIAL FULLSCREEN ENVELOPE INTRO OVERLAY */}
      <div
        className={`fixed inset-0 z-50 bg-[#F9F0E0] transition-opacity duration-1000 ease-in-out ${isIntroActive
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
      >
        <EnvelopeCard
          onOpen={handleOpen}
          onProceed={handleProceed}
        />
      </div>

      {/* 2. THE SACRED GARDEN WEDDING INVITATION PAGE */}
      <div
        className={`transition-opacity duration-1000 ease-in-out ${isIntroActive ? "opacity-0" : "opacity-100"
          }`}
      >
        <SacredGardenInvitation
          isAudioAutoPlay={isAudioAutoPlay}
        />

        {/* Re-open Envelope Floating Button */}
        {!isIntroActive && (
          <button
            onClick={() => {
              setIsIntroActive(true);
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
            aria-label="Replay envelope opening"
            className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#fdf9f2]/95 border border-[#cda95a]/60 shadow-[0_4px_16px_rgba(180,140,61,0.25)] text-[#8a6825] hover:text-[#3b2d22] hover:border-[#B48C3D] text-xs font-serif tracking-wider uppercase transition-all backdrop-blur-md hover:scale-105 active:scale-95"
          >
            <span>✉</span>
            <span className="hidden sm:inline">Envelope</span>
          </button>
        )}
      </div>
    </main>
  );
}
