"use client";

import React from "react";

export interface BrideGroomSectionProps {
  className?: string;
}

export const BrideGroomSection: React.FC<BrideGroomSectionProps> = ({
  className = "",
}) => {
  return (
    <section
      aria-label="Bride & Groom Portrait"
      className={`relative z-20 w-full flex flex-col items-center text-center ${className}`}
    >
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

      {/* PHOTO CARD CONTAINER WITH CORNER FLOWERS OVERLAY */}
      <div className="relative w-full max-w-[480px] sm:max-w-[520px] overflow-visible">
        {/* BOTTOM LEFT CORNER FLOWER */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/button_flower_left.webp"
          alt="Bottom Left Floral Arrangement"
          className="flower-motion-left absolute -bottom-5 sm:-bottom-8 md:-bottom-10 -left-4 sm:-left-7 md:-left-9 w-[42%] sm:w-[46%] md:w-[48%] max-w-[210px] sm:max-w-[260px] md:max-w-[290px] z-30 pointer-events-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
          draggable={false}
        />

        {/* BOTTOM RIGHT CORNER FLOWER */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/button_flower_right.webp"
          alt="Bottom Right Floral Arrangement"
          className="flower-motion-right absolute -bottom-5 sm:-bottom-8 md:-bottom-10 -right-4 sm:-right-7 md:-right-9 w-[42%] sm:w-[46%] md:w-[48%] max-w-[210px] sm:max-w-[260px] md:max-w-[290px] z-30 pointer-events-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
          draggable={false}
        />

        {/* INNER PHOTO FRAME */}
        <div className="relative z-10 w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_16px_40px_rgba(70,50,30,0.22)] border-2 border-[#c5a054]/50 bg-[#2a241e]">
          {/* TEXT OVERLAY ON TOP OF THE PHOTO */}
          <div className="absolute top-0 inset-x-0 pt-7 pb-16 sm:pt-9 sm:pb-20 bg-gradient-to-b from-black/70 via-black/35 to-transparent flex flex-col items-center text-center px-4 z-20 pointer-events-none">
            {/* Subtle Golden Flourish Accent */}
            <div className="flex items-center justify-center gap-2 mb-1.5 opacity-85">
              <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-[#e8c87b]" />
              <span className="text-[#e8c87b] text-xs">✦</span>
              <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-[#e8c87b]" />
            </div>

            {/* Names in Pinyon Script */}
            <h2
              className="font-pinyon text-3xl sm:text-4xl md:text-5xl text-[#fff8ec] tracking-wide select-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] leading-tight"
              style={{
                textShadow:
                  "0 2px 4px rgba(0,0,0,0.9), 0 4px 14px rgba(212,175,98,0.45)",
              }}
            >
              Salsal & Shahmama
            </h2>
          </div>

          {/* BRIDE & GROOM PHOTO */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/bride_groom.webp"
            alt="Salsal & Shahmama"
            className="w-full h-auto object-cover block select-none"
            loading="lazy"
            draggable={false}
          />

          {/* SOFT BOTTOM INNER SHADOW GRADIENT TO GROUND THE PHOTO */}
          <div className="absolute bottom-0 inset-x-0 h-16 sm:h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* CLOSING FOOTER TEXT & FLOURISH */}
      <div className="mt-8 sm:mt-10 mb-8 sm:mb-12 flex flex-col items-center select-none">
        <p className="font-cormorant italic text-lg sm:text-xl text-[#7c6a5a] tracking-wider">
          With Love & Gratitude
        </p>
        <div className="flex items-center gap-2 mt-2 opacity-70">
          <span className="w-12 sm:w-16 h-[1px] bg-[#c5a054]/60" />
          <span className="text-[#b58e3e] text-xs">❦</span>
          <span className="w-12 sm:w-16 h-[1px] bg-[#c5a054]/60" />
        </div>
      </div>
    </section>
  );
};

export default BrideGroomSection;
