"use client";

import React from "react";
import AudioPlayer from "./AudioPlayer";
import CountdownTimer from "./CountdownTimer";
import ScheduleOfEvents from "./ScheduleOfEvents";
import LocationSection from "./LocationSection";

export interface SacredGardenInvitationProps {
  isAudioAutoPlay?: boolean;
}

export const SacredGardenInvitation: React.FC<SacredGardenInvitationProps> = ({
  isAudioAutoPlay = false,
}) => {
  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full bg-[#f4ecd8] text-[#3b2d22] flex flex-col items-center justify-start p-0 sm:py-10 sm:px-6 overflow-x-hidden selection:bg-[#cda95a]/30">
      {/* Floating Background Soundtrack 
      the music */}
      {/* <AudioPlayer src="/sacred-garden/music.mp3" autoPlay={isAudioAutoPlay} /> */}

      {/* Keyframe animations for corner flower heartbeat motion */}
      <style>{`
        @keyframes flowerMotionLeft {
          0% {
            transform: rotate(0deg) scale(1, 1);
          }
          50% {
            transform: rotate(1deg) scale(1.02, 1.02);
          }
          100% {
            transform: rotate(0deg) scale(1, 1);
          }
        }

        @keyframes flowerMotionRight {
          0% {
            transform: rotate(0deg) scale(1, 1);
          }
          50% {
            transform: rotate(-1deg) scale(1.02, 1.02);
          }
          100% {
            transform: rotate(0deg) scale(1, 1);
          }
        }

        .flower-motion-left {
          animation: flowerMotionLeft 6.5s infinite ease-in-out;
          transform-origin: bottom left;
          backface-visibility: hidden;
          will-change: transform;
        }

        .flower-motion-right {
          animation: flowerMotionRight 6.5s infinite ease-in-out;
          transform-origin: bottom right;
          backface-visibility: hidden;
          will-change: transform;
        }
      `}</style>

      {/* ========================================================
          THE INVITATION CARD (Responsive for Mobile & Desktop)
          ======================================================== */}
      <div className="relative w-full max-w-[95%] sm:max-w-[520px] md:max-w-[560px] mx-auto flex flex-col items-center px-2 sm:px-4 md:px-0">
        {/* 1. TOP VIDEO CONTAINER WITH CORNER FLOWERS OVERLAY */}
        <div className="relative w-full overflow-visible">
          {/* LEFT CORNER FLOWER */}
          <img
            src="/corner_flower1.png"
            alt="Left Corner Floral Arrangement"
            className="flower-motion-left absolute -bottom-6 sm:-bottom-12 md:-bottom-16 -left-2 sm:-left-6 md:-left-8 w-[36%] sm:w-[42%] md:w-[44%] max-w-[180px] sm:max-w-[240px] md:max-w-[300px] z-30 pointer-events-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.22)]"
            draggable={false}
          />

          {/* RIGHT CORNER FLOWER */}
          <img
            src="/corner_flower2.png"
            alt="Right Corner Floral Arrangement"
            className="flower-motion-right absolute -bottom-6 sm:-bottom-12 md:-bottom-16 -right-2 sm:-right-6 md:-right-8 w-[36%] sm:w-[42%] md:w-[44%] max-w-[180px] sm:max-w-[240px] md:max-w-[300px] z-30 pointer-events-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.22)]"
            draggable={false}
          />

          {/* SWAN VIDEO CLIP - IN THE BACK LAYER (9:16 vertical ratio for 720x1280 clip) */}
          <div className="relative z-10 w-full aspect-[9/16] overflow-hidden rounded-t-xl md:rounded-t-2xl shadow-[0_8px_30px_rgba(70,50,30,0.18)] bg-[#2a241e]">
            <video
              src="/opening_clip.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover block"
            />
          </div>
        </div>

        {/* 2. PARCHMENT PAPER INVITATION SECTION WITH paper_back.webp BACKGROUND */}
        <div
          className="relative z-20 w-full -mt-6 sm:-mt-8 md:-mt-10 px-6 sm:px-10 md:px-16 pt-10 sm:pt-16 md:pt-20 pb-14 sm:pb-20 md:pb-24 text-center drop-shadow-[0_12px_28px_rgba(60,40,20,0.14)]"
          style={{
            backgroundImage: "url('/paper_back.webp')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          {/* BISMILLAH IN GOLD ARABIC CALLIGRAPHY */}
          <div
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#a88438] font-amiri tracking-wide leading-relaxed pt-2 pb-3 md:pb-5 select-none"
            style={{
              textShadow: "0 1px 1px rgba(255,255,255,0.8), 0 2px 4px rgba(168,132,56,0.15)",
            }}
          >
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>

          {/* THREE LINES OF GOLD CURSIVE SCRIPT */}
          <div className="space-y-2 sm:space-y-3 md:space-y-4 my-3 sm:my-5 md:my-7">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-pinyon text-[#ad873b] leading-[1.3] md:leading-[1.4] select-none"
              style={{
                textShadow: "0 1px 2px rgba(255,255,255,0.85), 0 2px 6px rgba(173,135,59,0.2)",
              }}
            >
              Two Souls
            </h2>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-pinyon text-[#ad873b] leading-[1.3] md:leading-[1.4] select-none"
              style={{
                textShadow: "0 1px 2px rgba(255,255,255,0.85), 0 2px 6px rgba(173,135,59,0.2)",
              }}
            >
              One destiny
            </h2>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-pinyon text-[#ad873b] leading-[1.3] md:leading-[1.4] select-none"
              style={{
                textShadow: "0 1px 2px rgba(255,255,255,0.85), 0 2px 6px rgba(173,135,59,0.2)",
              }}
            >
              A Lifetime written by Allah
            </h2>
          </div>

          {/* ELEGANT SERIF INVITATION MESSAGE */}
          <div className="mt-6 sm:mt-8 md:mt-12 space-y-2 md:space-y-3.5 text-[#5e4b3c] font-serif text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed md:leading-loose font-normal max-w-sm sm:max-w-md md:max-w-lg mx-auto">
            <p>Dear Friends and Family</p>
            <p>Join us for an evening of love,</p>
            <p>laughter, duas, and unforgettable</p>
            <p>memories as we begin our forever.</p>
          </div>
        </div>

        {/* 3. CEREMONY COUNTDOWN TIMER (Matches reference photo) */}
        <div className="relative z-20 w-full mt-4 sm:mt-6 md:mt-8 mb-8 sm:mb-12">
          <CountdownTimer
            title="The ceremony begin in"
            targetDate="2026-12-08T18:00:00"
            showBackground={false}
          />
        </div>

        {/* 4. SCHEDULE OF EVENTS TIMELINE SECTION */}
        <ScheduleOfEvents className="mb-14 sm:mb-20" />

        {/* 5. LOCATION & VENUE NAVIGATION SECTION */}
        <LocationSection className="mb-16 sm:mb-24" />
      </div>
    </div>
  );
};

export default SacredGardenInvitation;
