import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import WeddingGallerySection from "@/components/WeddingGallerySection";

export const metadata: Metadata = {
  title: "Wedding Gallery — Salsal & Shahmama",
  description: "Public wedding photo and video album for Salsal & Shahmama.",
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen min-h-[100dvh] w-full bg-[#f4ecd8] text-[#3b2d22] flex flex-col items-center selection:bg-[#cda95a]/30">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 w-full bg-[#f4ecd8]/90 backdrop-blur-md border-b border-[#c5a054]/35">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fdf9f2] hover:bg-[#f7eedb] border border-[#c5a054]/55 text-[#7a5b20] hover:text-[#3b2d22] font-cormorant text-sm sm:text-base font-semibold shadow-xs transition-all"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            <span>Back to Invitation</span>
          </Link>

          <span className="font-pinyon text-2xl sm:text-3xl text-[#b58e3e] select-none">
            Salsal &amp; Shahmama
          </span>
        </div>
      </header>

      {/* Main Dedicated Gallery Content */}
      <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-8 sm:py-12 flex-1">
        <WeddingGallerySection gridClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4" />
      </div>

      {/* Subtle Closing Footer */}
      <footer className="w-full py-8 text-center select-none">
        <div className="flex items-center justify-center gap-2 opacity-70">
          <span className="w-12 sm:w-16 h-[1px] bg-[#c5a054]/60" />
          <span className="text-[#b58e3e] text-xs">❦</span>
          <span className="w-12 sm:w-16 h-[1px] bg-[#c5a054]/60" />
        </div>
        <p className="font-cormorant italic text-base sm:text-lg text-[#7c6a5a] mt-2">
          With Love &amp; Gratitude
        </p>
      </footer>
    </main>
  );
}
