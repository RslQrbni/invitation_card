"use client";

import React from "react";
import CountdownTimer from "./CountdownTimer";
import ScheduleOfEvents from "./ScheduleOfEvents";
import LocationSection from "./LocationSection";
// import DressCodeSection from "./DressCodeSection";
import RsvpSection from "./RsvpSection";
import PhotoUploadSection from "./PhotoUploadSection";
import WeddingGalleryInvite from "./WeddingGalleryInvite";
import BrideGroomSection from "./BrideGroomSection";

export interface SacredGardenInvitationProps { }

export const SacredGardenInvitation: React.FC<SacredGardenInvitationProps> = () => {
  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full bg-[#f4ecd8] text-[#3b2d22] flex flex-col items-center justify-start p-0 sm:pt-0 sm:px-6 overflow-x-hidden selection:bg-[#cda95a]/30">
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
      <div className="relative w-full max-w-[99%] sm:max-w-[520px] md:max-w-[560px] mx-auto flex flex-col items-center px-0 sm:px-4 md:px-0">
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

            {/* ARCH CALLIGRAPHY: به نام عشق (straight centered text beneath the shrine arch above the names) */}
            <div
              className="absolute top-[13.5%] sm:top-[14.5%] md:top-[15.5%] inset-x-0 flex items-center justify-center z-20 pointer-events-none select-none px-6"
              style={{
                fontFamily:
                  "var(--font-nastaliq), 'IranNastaliq', 'Noto Nastaliq Urdu', serif",
              }}
              dir="rtl"
            >
              <span
                className="text-2xl sm:text-3xl md:text-4xl text-[#fdf4e1] font-normal leading-loose inline-block whitespace-nowrap"
                style={{
                  textShadow:
                    "0 2px 7px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.75), 0 0 22px rgba(212,175,98,0.5)",
                }}
              >
                به نام عشق
              </span>
            </div>

            {/* TEXT ON TOP OF THE VIDEO: صلصال و شهمامه (CASCADING NASTALIQ CALLIGRAPHY) */}
            <div className="absolute top-[23%] sm:top-[24%] md:top-[26%] inset-x-0 flex flex-col items-center justify-center z-20 pointer-events-none select-none px-6">
              <div
                className="w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] flex flex-col font-nastaliq"
                style={{
                  fontFamily: "var(--font-nastaliq), 'IranNastaliq', 'Noto Nastaliq Urdu', serif",
                }}
                dir="rtl"
              >
                {/* 1. TOP RIGHT: صلصال */}
                <div className="text-center">
                  <span
                    className="text-4xl sm:text-5xl md:text-6xl text-[#fff8ec] font-normal leading-loose inline-block"
                    style={{
                      textShadow:
                        "0 2px 8px rgba(0,0,0,0.95), 0 4px 18px rgba(0,0,0,0.85), 0 0 24px rgba(212,175,98,0.5)",
                    }}
                  >
                    صلصال
                  </span>
                </div>

                {/* 2. MIDDLE CENTER: و */}
                <div className="text-center -my-2 sm:-my-3">
                  <span
                    className="text-2xl sm:text-3xl md:text-4xl text-[#f3e3be] font-normal leading-loose inline-block"
                    style={{
                      textShadow:
                        "0 2px 6px rgba(0,0,0,0.95), 0 4px 14px rgba(0,0,0,0.8)",
                    }}
                  >
                    و
                  </span>
                </div>

                {/* 3. BOTTOM LEFT (FORWARD): شهمامه */}
                <div className="text-center">
                  <span
                    className="text-4xl sm:text-5xl md:text-6xl text-[#fff8ec] font-normal leading-loose inline-block"
                    style={{
                      textShadow:
                        "0 2px 8px rgba(0,0,0,0.95), 0 4px 18px rgba(0,0,0,0.85), 0 0 24px rgba(212,175,98,0.5)",
                    }}
                  >
                    شهمامه
                  </span>
                </div>
              </div>
            </div>
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
          <div className="w-[78%] sm:w-[72%] md:w-[68%] max-w-[320px] mx-auto pt-1 pb-2 md:pb-4 select-none">
            <div className="w-full aspect-[10/3.2] overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/bismellah.png"
                alt="بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ"
                draggable={false}
                className="w-full h-auto max-w-none block pointer-events-none"
                style={{
                  filter:
                    "saturate(0.58) sepia(0.18) brightness(0.76) contrast(1.06) drop-shadow(0 1px 1px rgba(255,255,255,0.8)) drop-shadow(0 2px 4px rgba(168,132,56,0.18))",
                }}
              />
            </div>
          </div>

          {/* PERSIAN POETIC COUPLET IN NASTALIQ CALLIGRAPHY */}
          <div
            className="space-y-1.5 sm:space-y-3 my-3 sm:my-5 md:my-6 select-none"
            dir="rtl"
            style={{
              fontFamily: "var(--font-nastaliq), 'IranNastaliq', 'Noto Nastaliq Urdu', var(--font-amiri), serif",
            }}
          >
            <h3
              className="text-[15px] sm:text-[19px] md:text-[23px] text-[#ad873b] leading-[2.2] sm:leading-[2.4] font-normal whitespace-nowrap"
              style={{
                textShadow:
                  "0 1px 2px rgba(255,255,255,0.85), 0 2px 6px rgba(173,135,59,0.25)",
              }}
            >
              همه عمر بر ندارم سر ازین خمار مستی
            </h3>
            <h3
              className="text-[15px] sm:text-[19px] md:text-[23px] text-[#ad873b] leading-[2.2] sm:leading-[2.4] font-normal whitespace-nowrap"
              style={{
                textShadow:
                  "0 1px 2px rgba(255,255,255,0.85), 0 2px 6px rgba(173,135,59,0.25)",
              }}
            >
              که هنوز من نبودم که تو در دلم نشستی
            </h3>
          </div>

          {/* DECORATIVE GOLD DIVIDER */}
          <div className="flex items-center justify-center gap-2 my-4 sm:my-5 select-none opacity-75">
            <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-[#c5a054]" />
            <span className="text-[#b58e3e] text-xs">✦</span>
            <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-[#c5a054]" />
          </div>

          {/* PERSIAN INVITATION MESSAGE */}
          <div
            className="mt-4 sm:mt-6 md:mt-8 space-y-2 md:space-y-2.5 font-amiri text-[#5e4b3c] text-base sm:text-lg md:text-xl leading-loose font-medium max-w-sm sm:max-w-md md:max-w-lg mx-auto select-none"
            dir="rtl"
            style={{
              textShadow: "0 1px 1px rgba(255,255,255,0.85)",
            }}
          >
            <p>در شبی که عشق،</p>
            <p>بهانه‌ی کنار هم بودنمان شده،</p>
            <p>خوشحالیم که شادی این آغاز را</p>
            <p>با حضور پر مهرتان قسمت کنیم.</p>
          </div>
        </div>

        {/* 3. CEREMONY COUNTDOWN TIMER (Matches reference photo) */}
        <div className="relative z-20 w-full mt-4 sm:mt-6 md:mt-8 mb-8 sm:mb-12">
          <CountdownTimer
            title="شروع جشن در"
            targetDate="2026-12-08T18:00:00"
            showBackground={false}
          />
        </div>

        {/* 4. SCHEDULE OF EVENTS TIMELINE SECTION */}
        <ScheduleOfEvents className="mb-14 sm:mb-20" />

        {/* 5. LOCATION & VENUE NAVIGATION SECTION */}
        <LocationSection className="mb-14 sm:mb-20" />

        {/* 6. PARCHMENT PAPER SECTION (Dress Code & Gift Preference — commented out for now, remove outer comment wrapper to restore)
        <div
          className="relative z-20 w-full min-h-[360px] sm:min-h-[430px] px-8 sm:px-14 md:px-16 py-12 sm:py-16 md:py-20 text-center drop-shadow-[0_12px_28px_rgba(60,40,20,0.14)] mb-16 sm:mb-24 flex flex-col items-center justify-center overflow-visible"
          style={{
            backgroundImage: "url('/paper_back.webp')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
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

          <div
            className="flower-motion-left absolute -bottom-3 sm:-bottom-4 md:-bottom-5 -left-10 sm:-left-11 md:-left-12 w-[36%] sm:w-[38%] md:w-[40%] max-w-[175px] sm:max-w-[210px] md:max-w-[235px] z-30 pointer-events-none drop-shadow-[0_4px_14px_rgba(70,50,30,0.15)]"
            style={{
              transformOrigin: "bottom left",
              backfaceVisibility: "hidden",
            }}
          >
            <img
              src="/flower_button_dress_code.webp"
              alt="Bottom Left Floral Arrangement"
              className="w-full h-auto object-contain scale-y-[-1]"
              draggable={false}
            />
          </div>

          <div className="relative z-20 max-w-[320px] sm:max-w-[380px] mx-auto space-y-8 sm:space-y-10">
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
        */}

        {/* 7. RSVP ATTENDANCE FORM SECTION */}
        <RsvpSection className="mb-16 sm:mb-24" />

        {/* 8. SHARE YOUR PHOTOS & VIDEOS UPLOAD SECTION */}
        <PhotoUploadSection className="mb-16 sm:mb-24" />

        {/* 9. PUBLIC WEDDING ALBUM CTA (guides guests to /gallery) */}
        <WeddingGalleryInvite className="mb-16 sm:mb-24" />

        {/* 10. BRIDE & GROOM PORTRAIT SECTION */}
        <BrideGroomSection className="mb-8 sm:mb-14" />

      </div>

    </div>

  );

};

export default SacredGardenInvitation;
