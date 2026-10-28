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
          Location
        </h2>

        {/* Ornamental Gold Flourish Divider */}
        <div className="w-full flex justify-center items-center my-2 sm:my-3">
          <svg
            viewBox="0 0 240 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-40 sm:w-52 h-auto text-[#b58e3e] drop-shadow-sm opacity-90 pointer-events-none select-none"
            aria-hidden="true"
          >
            {/* Symmetrical flourish lines and center palmette petals */}
            <path
              d="M10 16h60c12 0 22-8 30-10 8 4 14 10 20 10s12-6 20-10c8 2 18 10 30 10h60"
              stroke="#b58e3e"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
            {/* Center triple petal flourish */}
            <path
              d="M120 6c-2 4-3 7-3 10 2 0 4-1 6-4 2 3 4 4 6 4 0-3-1-6-3-10-1.5-2.5-4.5-2.5-6 0z"
              fill="#b58e3e"
            />
            <path
              d="M108 9c1 3 3 5 5 7-1 1-3 1-5 0-2-2-2-5 0-7z"
              fill="#b58e3e"
            />
            <path
              d="M132 9c-1 3-3 5-5 7 1 1 3 1 5 0 2-2 2-5 0-7z"
              fill="#b58e3e"
            />
            {/* Elegant scroll curls at ends */}
            <circle cx="20" cy="16" r="2" fill="#b58e3e" />
            <circle cx="220" cy="16" r="2" fill="#b58e3e" />
          </svg>
        </div>

        {/* Hotel Name in Cormorant Garamond */}
        <h3 className="font-cormorant text-2xl sm:text-3xl text-[#5a4636] font-normal tracking-wide mt-1">
          Gotkemal Hotel
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
          2. VENUE PHOTO
          ======================================================== */}
      <div className="max-w-[540px] w-full rounded-md shadow-[0_10px_28px_rgba(70,50,30,0.12)] overflow-hidden mt-6 sm:mt-8 mx-auto border border-[#c5a054]/25 bg-[#efe6d3]/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/talar_photo.webp"
          alt="Gotkemal Hotel Semnan"
          className="w-full h-auto object-cover block"
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* ========================================================
          3. ORNATE MAP CARD (Google Maps + Iranian Navigation)
          ======================================================== */}
      <div className="relative max-w-[440px] w-full aspect-square rounded-2xl border-2 border-[#c5a054] shadow-[0_12px_32px_rgba(70,50,30,0.14)] bg-[#eae3d2] mt-10 sm:mt-14 mx-auto">
        {/* Top Ornate Crest overlapping top border */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/sacred-garden/noroot(11).png.webp"
          alt=""
          className="absolute -top-[16px] sm:-top-[22px] left-1/2 -translate-x-1/2 w-[220px] sm:w-[280px] max-w-[85%] h-auto z-20 pointer-events-none drop-shadow-sm select-none"
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

          {/* Overlay: Burgundy Pill Button (OPEN IN GOOGLE MAPS) */}
          <a
            href="https://maps.app.goo.gl/SMCvrjqoz47hWKeF8"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#5A0F1B] hover:bg-[#721524] text-[#fdf9f2] font-sans text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-[0_4px_16px_rgba(90,15,27,0.4)] transition-all duration-300 transform hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer select-none"
          >
            <span>OPEN IN GOOGLE MAPS</span>
            <svg
              className="w-4 h-4 text-[#fdf9f2]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        {/* Bottom Ornate Crest overlapping bottom border */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/sacred-garden/noroot(12).png.webp"
          alt=""
          className="absolute -bottom-[16px] sm:-bottom-[22px] left-1/2 -translate-x-1/2 w-[220px] sm:w-[280px] max-w-[85%] h-auto z-20 pointer-events-none drop-shadow-sm select-none"
          aria-hidden="true"
          draggable={false}
        />
      </div>

      {/* ========================================================
          4. IRANIAN NAVIGATION APPS (Neshan, Balad, Mobile Geo)
          ======================================================== */}
      <div className="w-full max-w-[440px] mt-8 sm:mt-10 flex flex-col items-center gap-3">
        <p className="font-amiri text-sm sm:text-base text-[#7c6a5a] select-none" dir="rtl">
          مسیریابی مستقیم با برنامه‌های نقشه و بلد/نشان:
        </p>

        <div className="w-full flex flex-col sm:flex-row items-stretch justify-center gap-2.5 sm:gap-3">
          {/* 1. Neshan Button */}
          <a
            href="https://nshn.ir/?lat=35.5892&lng=53.4216"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#fbf7ee] hover:bg-[#f3ead4] text-[#5a4636] border border-[#c5a054] shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-xs sm:text-sm font-amiri font-medium select-none"
            dir="rtl"
          >
            <svg
              className="w-4 h-4 text-[#b58e3e] flex-shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
            </svg>
            <span>مسیریابی با نشان (Neshan)</span>
          </a>

          {/* 2. Balad Button */}
          <a
            href="https://balad.ir/search?q=%D9%87%D8%AA%D9%84%20%DA%AF%D9%88%D8%AA%20%DA%A9%D9%87%20%D9%85%D8%A7%D9%84%20%D8%B3%D9%85%D9%86%D8%A7%D9%86"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#fbf7ee] hover:bg-[#f3ead4] text-[#5a4636] border border-[#c5a054] shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-xs sm:text-sm font-amiri font-medium select-none"
            dir="rtl"
          >
            <svg
              className="w-4 h-4 text-[#b58e3e] flex-shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span>مسیریابی با بلد (Balad)</span>
          </a>
        </div>

        {/* 3. Mobile Device Native Intent Link */}
        <a
          href="geo:35.5892,53.4216?q=هتل گوت که مال سمنان"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#fbf7ee] hover:bg-[#f3ead4] text-[#5a4636] border border-[#c5a054]/80 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-xs sm:text-sm font-amiri font-medium select-none"
          dir="rtl"
        >
          <svg
            className="w-4 h-4 text-[#b58e3e] flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <path d="M12 18h.01" />
          </svg>
          <span>مسیریابی با گوگل</span>
        </a>
      </div>
    </section>
  );
};

export default LocationSection;
