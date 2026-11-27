"use client";

import React from "react";

export interface LocationSectionProps {
  className?: string;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  className = "",
}) => {
  return (
    <section
      aria-label="Venue Location and Directions"
      className={`relative z-20 w-full flex flex-col items-center text-center px-4 sm:px-6 md:px-8 ${className}`}
    >
      {/* ========================================================
          1. HEADER & VENUE INFO (ABOVE THE PHOTO)
          ======================================================== */}
      <div className="w-full flex flex-col items-center select-none">
        {/* Title in gold script */}
        <h2
          className="font-pinyon text-4xl sm:text-5xl md:text-6xl text-[#b58e3e] leading-tight select-none tracking-wide"
          style={{
            textShadow:
              "0 1px 1px rgba(255,255,255,0.85), 0 2px 4px rgba(181,142,62,0.18)",
          }}
        >
          مکان
        </h2>

        {/* Ornamental Gold Flourish Divider */}
        <div className="w-full flex justify-center items-center my-2 sm:my-3">
          <div
            className="relative w-56 sm:w-64 md:w-72 max-w-[85%] aspect-[888/124] overflow-hidden pointer-events-none select-none"
            aria-hidden="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/design-elem-center.png"
              alt=""
              draggable={false}
              className="absolute max-w-none h-auto block drop-shadow-sm opacity-95"
              style={{
                width: "115.65%",
                left: "-6.42%",
                top: "-74.19%",
              }}
            />
          </div>
        </div>

        {/* Hotel Name in Cormorant Garamond */}
        <h3 className="font-cormorant text-2xl sm:text-3xl text-[#5a4636] font-normal tracking-wide mt-1">
          تالار گوت که مال
        </h3>

        {/* Persian Address in Amiri with dir="rtl" */}
        <p
          dir="rtl"
          className="font-amiri text-base sm:text-lg md:text-xl text-[#7c6a5a] mt-1.5 sm:mt-2 leading-relaxed max-w-md mx-auto"
        >
          میزبان شما در سمنان، بلوار قائم، خیابان دانشگاه، هتل گوت که مال هستیم
        </p>
      </div>

      {/* ========================================================
          2. VENUE PHOTO (Matching Ornate Gold Frame & Crests)
          ======================================================== */}
      <div className="relative max-w-[440px] w-full aspect-square rounded-2xl border-2 border-[#c5a054] shadow-[0_12px_32px_rgba(70,50,30,0.14)] bg-[#eae3d2] mt-12 sm:mt-16 mx-auto">
        {/* Top Ornate Crest */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/design-elem-top.png"
          alt=""
          className="absolute -top-[28px] sm:-top-[49px] left-1/2 -translate-x-1/2 w-[240px] sm:w-[300px] max-w-[88%] h-auto z-20 pointer-events-none select-none"
          style={{
            filter:
              "sepia(0.32) saturate(1.45) brightness(1.06) drop-shadow(0 1px 2px rgba(70,50,30,0.18))",
          }}
          aria-hidden="true"
          draggable={false}
        />

        {/* Venue Photo Container */}
        <div className="w-full h-full rounded-[14px] overflow-hidden relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/talar_photo.webp"
            alt="Gotkemal Hotel Semnan"
            className="w-full h-full object-cover block"
            loading="lazy"
            draggable={false}
          />
        </div>

        {/* Bottom Ornate Crest */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/design-elem-button.png"
          alt=""
          className="absolute -bottom-[28px] sm:-bottom-[49px] left-1/2 -translate-x-1/2 w-[240px] sm:w-[300px] max-w-[88%] h-auto z-20 pointer-events-none select-none"
          style={{
            filter:
              "sepia(0.32) saturate(1.45) brightness(1.06) drop-shadow(0 1px 2px rgba(70,50,30,0.18))",
          }}
          aria-hidden="true"
          draggable={false}
        />
      </div>

      {/* ========================================================
          3. ORNATE MAP CARD (Google Maps + Iranian Navigation)
          ======================================================== */}
      <div className="relative max-w-[440px] w-full aspect-square rounded-2xl border-2 border-[#c5a054] shadow-[0_12px_32px_rgba(70,50,30,0.14)] bg-[#eae3d2] mt-20 sm:mt-24 mx-auto">
        {/* Top Ornate Crest overlapping top border */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/design-elem-top.png"
          alt=""
          className="absolute -top-[28px] sm:-top-[49px] left-1/2 -translate-x-1/2 w-[240px] sm:w-[300px] max-w-[88%] h-auto z-20 pointer-events-none select-none"
          style={{
            filter:
              "sepia(0.32) saturate(1.45) brightness(1.06) drop-shadow(0 1px 2px rgba(70,50,30,0.18))",
          }}
          aria-hidden="true"
          draggable={false}
        />

        {/* Map iframe Container */}
        <div className="w-full h-full rounded-[14px] overflow-hidden relative">
          <iframe
            src="https://maps.google.com/maps?q=35.5892,53.4216&hl=fa&z=16&output=embed"
            title="Gotkemal Hotel Semnan Location Map"
            className="w-full h-full border-0 filter saturate-[1.08] contrast-[1.02]"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Bottom Ornate Crest overlapping bottom border */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/design-elem-button.png"
          alt=""
          className="absolute -bottom-[28px] sm:-bottom-[49px] left-1/2 -translate-x-1/2 w-[240px] sm:w-[300px] max-w-[88%] h-auto z-20 pointer-events-none select-none"
          style={{
            filter:
              "sepia(0.32) saturate(1.45) brightness(1.06) drop-shadow(0 1px 2px rgba(70,50,30,0.18))",
          }}
          aria-hidden="true"
          draggable={false}
        />
      </div>

      {/* ========================================================
          4. NAVIGATION APPS (Google Maps, Neshan, Balad Icons)
          ======================================================== */}
      <div className="w-full max-w-[440px] mt-8 sm:mt-10 flex flex-col items-center gap-3">
        <p className="font-amiri text-sm sm:text-base text-[#7c6a5a] select-none" dir="rtl">
          مسیریابی با برنامه‌های نقشه:
        </p>

        <div className="flex items-center justify-center gap-5 sm:gap-7 mt-2" dir="rtl">
          {/* 1. Google Maps */}
          <a
            href="https://maps.app.goo.gl/SMCvrjqoz47hWKeF8"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 transition-transform duration-300 hover:-translate-y-1 active:translate-y-0"
            title="گوگل مپ (Google Maps)"
            aria-label="Google Maps"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#fbf7ee] border-2 border-[#c5a054]/50 shadow-[0_4px_12px_rgba(70,50,30,0.1)] group-hover:shadow-[0_8px_20px_rgba(197,160,84,0.35)] group-hover:border-[#c5a054] transition-all duration-300 flex items-center justify-center p-2.5 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/google_map.png"
                alt="Google Maps"
                className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-300"
                draggable={false}
              />
            </div>
            <span className="font-amiri text-xs sm:text-sm text-[#5a4636] font-medium group-hover:text-[#8a6825] transition-colors select-none">
              گوگل مپ
            </span>
          </a>

          {/* 2. Neshan */}
          <a
            href="https://nshn.ir/?lat=35.5892&lng=53.4216"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 transition-transform duration-300 hover:-translate-y-1 active:translate-y-0"
            title="نشان (Neshan)"
            aria-label="Neshan"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#fbf7ee] border-2 border-[#c5a054]/50 shadow-[0_4px_12px_rgba(70,50,30,0.1)] group-hover:shadow-[0_8px_20px_rgba(197,160,84,0.35)] group-hover:border-[#c5a054] transition-all duration-300 flex items-center justify-center p-2.5 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/neshan_map.png"
                alt="Neshan"
                className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-300"
                draggable={false}
              />
            </div>
            <span className="font-amiri text-xs sm:text-sm text-[#5a4636] font-medium group-hover:text-[#8a6825] transition-colors select-none">
              نشان
            </span>
          </a>

          {/* 3. Balad */}
          <a
            href="https://balad.ir/search?q=%D9%87%D8%AA%D9%84%20%DA%AF%D9%88%D8%AA%20%DA%A9%D9%87%20%D9%85%D8%A7%D9%84%20%D8%B3%D9%85%D9%86%D8%A7%D9%86"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 transition-transform duration-300 hover:-translate-y-1 active:translate-y-0"
            title="بلد (Balad)"
            aria-label="Balad"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#fbf7ee] border-2 border-[#c5a054]/50 shadow-[0_4px_12px_rgba(70,50,30,0.1)] group-hover:shadow-[0_8px_20px_rgba(197,160,84,0.35)] group-hover:border-[#c5a054] transition-all duration-300 flex items-center justify-center p-2.5 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/balad_map.png"
                alt="Balad"
                className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-300"
                draggable={false}
              />
            </div>
            <span className="font-amiri text-xs sm:text-sm text-[#5a4636] font-medium group-hover:text-[#8a6825] transition-colors select-none">
              بلد
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
