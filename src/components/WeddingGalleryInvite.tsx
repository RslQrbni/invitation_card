"use client";

import React from "react";
import Link from "next/link";

export interface WeddingGalleryInviteProps {
  className?: string;
}

export const WeddingGalleryInvite: React.FC<WeddingGalleryInviteProps> = ({
  className = "",
}) => {
  return (
    <section
      aria-label="Wedding Gallery Link"
      className={`relative z-20 w-full mx-auto px-2 sm:px-0 ${className}`}
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#fbf6ea] via-[#f7eedb] to-[#f2e5c9] border border-[#c5a054]/55 shadow-[0_12px_32px_rgba(70,50,30,0.12)] px-6 sm:px-10 py-9 sm:py-12 text-center">
        {/* Delicate Inner Gold Frame */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-2.5 sm:inset-3.5 rounded-2xl border border-[#c5a054]/30"
        />

        {/* Decorative Gold Flourish */}
        <div className="relative z-10 flex items-center justify-center gap-2 mb-3 select-none">
          <span className="w-10 sm:w-14 h-[1px] bg-gradient-to-r from-transparent to-[#c5a054]" />
          <span className="text-[#b58e3e] text-xs">✦</span>
          <span className="w-10 sm:w-14 h-[1px] bg-gradient-to-l from-transparent to-[#c5a054]" />
        </div>

        {/* Album Emblem */}
        <div className="relative z-10 w-14 h-14 mx-auto mb-3.5 rounded-full bg-gradient-to-b from-[#fffaf0] to-[#efe1c1] border border-[#c5a054]/65 flex items-center justify-center text-[#8a6825] shadow-[0_4px_14px_rgba(181,142,62,0.2)]">
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </div>

        {/* Title & Subtitles */}
        <div className="relative z-10 space-y-2 select-none">
          <h2
            className="font-pinyon text-4xl sm:text-5xl text-[#b58e3e] leading-tight"
            style={{
              textShadow:
                "0 1px 2px rgba(255,255,255,0.9), 0 2px 6px rgba(173,135,59,0.22)",
            }}
          >
            Wedding Gallery
          </h2>

          <p className="font-cormorant text-base sm:text-lg text-[#5e4b3c] leading-relaxed max-w-sm mx-auto">
            در این قسمت تعدای از عکس ها و فیلم ها به اشتراک گذاشته خواهد شد
          </p>


        </div>

        {/* CTA Button to Dedicated /gallery Page */}
        <div className="relative z-10 mt-6">
          <Link
            href="/gallery"
            className="group inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-[#8a6825] via-[#b58e3e] to-[#8a6825] hover:from-[#9c762c] hover:via-[#c59d48] hover:to-[#9c762c] text-[#fdfaf3] font-cormorant text-base sm:text-lg font-semibold tracking-wide shadow-[0_6px_20px_rgba(180,140,61,0.38)] hover:shadow-[0_8px_26px_rgba(180,140,61,0.52)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>دیدن آلبوم عکس ها</span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WeddingGalleryInvite;
