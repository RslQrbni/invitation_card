"use client";

import React from "react";

export interface DressCodeSectionProps {
  className?: string;
}

export const DressCodeSection: React.FC<DressCodeSectionProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`relative z-20 w-full min-h-[360px] sm:min-h-[430px] px-8 sm:px-14 md:px-16 py-12 sm:py-16 md:py-20 text-center drop-shadow-[0_12px_28px_rgba(60,40,20,0.14)] mb-16 sm:mb-24 flex flex-col items-center justify-center overflow-visible ${className}`}
      style={{
        backgroundImage: "url('/paper_back.webp')",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* TOP RIGHT CORNER FLOWER */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/flower_top_dress_code.webp"
        alt="Top Right Floral Arrangement"
        className="flower-motion-right absolute -top-3 sm:-top-4 md:-top-5 -right-10 sm:-right-15 md:-right-17 w-[52%] sm:w-[54%] md:w-[56%] max-w-[250px] sm:max-w-[290px] md:max-w-[320px] z-30 pointer-events-none drop-shadow-[0_4px_14px_rgba(70,50,30,0.15)]"
        style={{
          transformOrigin: "top right",
          backfaceVisibility: "hidden",
        }}
        draggable={false}
      />

      {/* BOTTOM LEFT CORNER FLOWER (Flipped right-side up with scale-y-[-1]) */}
      <div
        className="flower-motion-left absolute -bottom-3 sm:-bottom-4 md:-bottom-5 -left-10 sm:-left-11 md:-left-12 w-[36%] sm:w-[38%] md:w-[40%] max-w-[175px] sm:max-w-[210px] md:max-w-[235px] z-30 pointer-events-none drop-shadow-[0_4px_14px_rgba(70,50,30,0.15)]"
        style={{
          transformOrigin: "bottom left",
          backfaceVisibility: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/flower_button_dress_code.webp"
          alt="Bottom Left Floral Arrangement"
          className="w-full h-auto object-contain scale-y-[-1]"
          draggable={false}
        />
      </div>

      {/* DRESS CODE & GIFT PREFERENCE CONTENT */}
      <div className="relative z-20 max-w-[320px] sm:max-w-[380px] mx-auto space-y-8 sm:space-y-10">
        {/* Dress Code */}
        <div className="space-y-3 sm:space-y-4">
          <h2
            className="text-4xl sm:text-5xl font-pinyon text-[#b58e3e] leading-tight select-none"
            style={{
              textShadow:
                "0 1px 2px rgba(255,255,255,0.85), 0 2px 6px rgba(173,135,59,0.2)",
            }}
          >
            Dress Code
          </h2>
          <p className="font-cormorant text-lg sm:text-xl md:text-[22px] text-[#5e4b3c] leading-relaxed">
            We kindly ask guests to avoid deep red and maroon attire for the
            celebration.
          </p>
        </div>

        {/* Gift Preference */}
        <div className="space-y-3 sm:space-y-4">
          <h2
            className="text-4xl sm:text-5xl font-pinyon text-[#b58e3e] leading-tight select-none"
            style={{
              textShadow:
                "0 1px 2px rgba(255,255,255,0.85), 0 2px 6px rgba(173,135,59,0.2)",
            }}
          >
            Gift Preference
          </h2>
          <p className="font-cormorant text-lg sm:text-xl md:text-[22px] text-[#5e4b3c] leading-relaxed">
            Kindly, no boxed gifts please.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DressCodeSection;
