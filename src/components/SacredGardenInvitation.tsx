"use client";

import React from "react";
import AudioPlayer from "./AudioPlayer";

export interface SacredGardenInvitationProps {
  isAudioAutoPlay?: boolean;
}

export const SacredGardenInvitation: React.FC<SacredGardenInvitationProps> = ({
  isAudioAutoPlay = false,
}) => {
  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full bg-[#f4ecd8] text-[#3b2d22] flex flex-col items-center justify-start p-0 sm:py-10 sm:px-6 overflow-x-hidden selection:bg-[#cda95a]/30">
      {/* Floating Background Soundtrack */}
      <AudioPlayer src="/sacred-garden/music.mp3" autoPlay={isAudioAutoPlay} />

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
          THE INVITATION CARD (Matches user's reference photo)
          ======================================================== */}
      <div className="relative w-full sm:max-w-[540px] mx-auto flex flex-col items-center">
        {/* 1. TOP VIDEO CONTAINER WITH CORNER FLOWERS OVERLAY */}
        <div className="relative w-full overflow-visible">
          {/* LEFT CORNER FLOWER - AT THE BOTTOM-LEFT CORNER OF THE VIDEO CLIP */}
          <img
            src="/corner_flower1.png"
            alt="Left Corner Floral Arrangement"
            className="flower-motion-left absolute -bottom-10 sm:-bottom-16 -left-3 sm:-left-6 w-[40%] sm:w-[44%] max-w-[230px] z-30 pointer-events-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.22)]"
            style={{
              animation: "flowerMotionLeft 6.5s infinite ease-in-out",
              transformOrigin: "bottom left",
              backfaceVisibility: "hidden",
            }}
            draggable={false}
          />

          {/* RIGHT CORNER FLOWER - AT THE BOTTOM-RIGHT CORNER OF THE VIDEO CLIP */}
          <img
            src="/corner_flower2.png"
            alt="Right Corner Floral Arrangement"
            className="flower-motion-right absolute -bottom-10 sm:-bottom-16 -right-3 sm:-right-6 w-[40%] sm:w-[44%] max-w-[230px] z-30 pointer-events-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.22)]"
            style={{
              animation: "flowerMotionRight 6.5s infinite ease-in-out",
              transformOrigin: "bottom right",
              backfaceVisibility: "hidden",
            }}
            draggable={false}
          />

          {/* SWAN VIDEO CLIP - IN THE BACK LAYER */}
          <div className="relative z-10 w-full overflow-hidden shadow-[0_8px_30px_rgba(70,50,30,0.18)] bg-[#2a241e]">
            <video
              src="/opening_clip.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-auto object-cover block"
            />
          </div>
        </div>

        {/* 2. PARCHMENT PAPER INVITATION SECTION WITH paper_back.webp BACKGROUND */}
        <div
          className="relative z-20 w-full -mt-6 sm:-mt-10 px-6 sm:px-10 pt-10 sm:pt-14 pb-12 sm:pb-16 text-center drop-shadow-[0_12px_28px_rgba(60,40,20,0.14)]"
          style={{
            backgroundImage: "url('/paper_back.webp')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          {/* BISMILLAH IN GOLD ARABIC CALLIGRAPHY */}
          <div
            className="text-2xl sm:text-3xl md:text-4xl text-[#a88438] font-amiri tracking-wide leading-relaxed pt-2 pb-3 select-none"
            style={{
              textShadow: "0 1px 1px rgba(255,255,255,0.8), 0 2px 4px rgba(168,132,56,0.15)",
            }}
          >
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>

          {/* THREE LINES OF GOLD CURSIVE SCRIPT */}
          <div className="space-y-0.5 sm:space-y-1 my-2">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-pinyon text-[#ad873b] leading-tight select-none"
              style={{
                textShadow: "0 1px 2px rgba(255,255,255,0.85), 0 2px 6px rgba(173,135,59,0.2)",
              }}
            >
              Two Souls
            </h2>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-pinyon text-[#ad873b] leading-tight select-none"
              style={{
                textShadow: "0 1px 2px rgba(255,255,255,0.85), 0 2px 6px rgba(173,135,59,0.2)",
              }}
            >
              One destiny
            </h2>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-pinyon text-[#ad873b] leading-tight select-none"
              style={{
                textShadow: "0 1px 2px rgba(255,255,255,0.85), 0 2px 6px rgba(173,135,59,0.2)",
              }}
            >
              A Lifetime written by Allah
            </h2>
          </div>

          {/* ELEGANT SERIF INVITATION MESSAGE */}
          <div className="mt-5 sm:mt-7 space-y-1.5 text-[#5e4b3c] font-serif text-sm sm:text-base md:text-lg leading-relaxed tracking-wide font-normal max-w-sm mx-auto">
            <p>Dear Friends and Family</p>
            <p>Join us for an evening of love,</p>
            <p>laughter, duas, and unforgettable</p>
            <p>memories as we begin our forever.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SacredGardenInvitation;
