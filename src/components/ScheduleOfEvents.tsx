"use client";

import React, { useEffect, useRef, useState } from "react";

export interface ScheduleOfEventsProps {
  /** Optional container class name */
  className?: string;
  /** Image source for the moving rose. Defaults to '/little_flower.png' */
  roseImageSrc?: string;
}

interface TimelineEvent {
  time: string;
  titleLines: string[];
}

const EVENTS: TimelineEvent[] = [
  { time: "5 PM", titleLines: ["Guest", "Arrival"] },
  { time: "6 PM", titleLines: ["Nikkah", "Ceremony"] },
  { time: "7 PM", titleLines: ["Mocktail", "Hour"] },
  { time: "8 PM", titleLines: ["Dinner"] },
  { time: "9 PM", titleLines: ["Dance"] },
];

export const ScheduleOfEvents: React.FC<ScheduleOfEventsProps> = ({
  className = "",
  roseImageSrc = "/little_flower.png",
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const roseRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let animId: number;
    let targetProgress = 0.5; // Starts comfortably at middle event (Mocktail Hour)
    let currentProgress = 0.5;

    const updateTarget = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const triggerPoint = window.innerHeight * 0.52;
      const raw = (triggerPoint - rect.top) / (rect.height || 1);
      targetProgress = Math.max(0, Math.min(1, raw));
    };

    const loop = () => {
      // Lerp smoothing: current += (target - current) * 0.14
      currentProgress += (targetProgress - currentProgress) * 0.14;

      if (roseRef.current) {
        const topPercent = currentProgress * 100;
        const rotation = (currentProgress - 0.5) * 26; // gentle organic tilt as it travels
        roseRef.current.style.top = `${topPercent}%`;
        roseRef.current.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
      }

      animId = requestAnimationFrame(loop);
    };

    updateTarget();
    currentProgress = targetProgress;
    animId = requestAnimationFrame(loop);

    const onScrollOrResize = () => {
      updateTarget();
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    // CRITICAL: Support scrolling inside .envelope-page-container when invitation is open
    const getScrollContainer = () =>
      document.querySelector(".envelope-page-container");

    const scrollContainer = getScrollContainer();
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", onScrollOrResize, {
        passive: true,
      });
    }

    // Interval check in case .envelope-page-container becomes scrollable after envelope animation
    const checkInterval = setInterval(() => {
      const container = getScrollContainer();
      if (container) {
        container.removeEventListener("scroll", onScrollOrResize);
        container.addEventListener("scroll", onScrollOrResize, {
          passive: true,
        });
      }
      updateTarget();
    }, 800);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(checkInterval);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      const container = getScrollContainer();
      if (container) {
        container.removeEventListener("scroll", onScrollOrResize);
      }
    };
  }, []);

  return (
    <div
      className={`relative z-20 w-full px-4 sm:px-8 md:px-12 pt-10 sm:pt-14 md:pt-16 pb-12 sm:pb-16 md:pb-20 text-center drop-shadow-[0_12px_28px_rgba(60,40,20,0.14)] ${className}`}
      style={{
        backgroundImage: "url('/paper_back.webp')",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* 1. HEADER: 'Schedule of Events' flanked by ornamental gold flourishes */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-5 mb-6 sm:mb-8 md:mb-10 select-none">
        <img
          src="/sacred-garden/left-element_1.png.webp"
          alt=""
          className="w-10 sm:w-16 md:w-20 h-auto object-contain select-none pointer-events-none opacity-85"
          draggable={false}
          aria-hidden="true"
        />
        <h2
          className="font-pinyon text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#b58e3e] select-none capitalize tracking-wide whitespace-nowrap"
          style={{
            textShadow:
              "0 1px 1px rgba(255,255,255,0.85), 0 2px 4px rgba(181,142,62,0.18)",
          }}
        >
          Schedule of Events
        </h2>
        <img
          src="/sacred-garden/right-element_1.png.webp"
          alt=""
          className="w-10 sm:w-16 md:w-20 h-auto object-contain select-none pointer-events-none opacity-85"
          draggable={false}
          aria-hidden="true"
        />
      </div>

      {/* 2. TIMELINE 3-COLUMN LAYOUT (Time | Continuous Line + Nodes | Event Name) */}
      <div className="relative w-full max-w-[320px] sm:max-w-[400px] md:max-w-[460px] mx-auto select-none">
        {/* Continuous Center Timeline Track (Starts at center of row 1, ends at center of row 5) */}
        <div
          ref={trackRef}
          className="absolute left-1/2 -translate-x-1/2 top-[36px] sm:top-[42px] md:top-[46px] bottom-[36px] sm:bottom-[42px] md:bottom-[46px] w-[48px] sm:w-[64px] pointer-events-none z-10"
        >
          {/* Continuous 1px Vertical Line */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#9e8c7a]" />

          {/* 5 Heart Nodes (0%, 25%, 50%, 75%, 100%) to change the color of heart change heretext-[#b58e3e]*/}
          {[0, 25, 50, 75, 100].map((percent, index) => (
            <svg
              key={index}
              viewBox="0 0 24 24"
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#b58e3e] drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
              fill="currentColor"
              style={{ top: `${percent}%` }}
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ))}


          {/* Scroll-Driven Moving Rose */}
          <div
            ref={roseRef}
            className="absolute left-1/2 z-30 transition-none will-change-transform pointer-events-none"
            style={{
              top: "50%",
              transform: "translate(-50%, -50%) rotate(0deg)",
            }}
          >
            {!imageError ? (
              <img
                src={roseImageSrc}
                alt="Rose"
                className="w-10 sm:w-12 md:w-14 h-auto object-contain drop-shadow-[0_4px_12px_rgba(160,80,80,0.3)] select-none pointer-events-none"
                draggable={false}
                onError={() => setImageError(true)}
              />
            ) : (
              /* Fallback dusty-pink SVG rose */
              <svg
                viewBox="0 0 100 100"
                className="w-10 sm:w-12 md:w-14 h-auto drop-shadow-[0_4px_12px_rgba(160,80,80,0.3)]"
                fill="none"
              >
                <circle cx="50" cy="50" r="45" fill="#f4c2c2" />
                <path
                  d="M50 20 C35 30 35 70 50 80 C65 70 65 30 50 20 Z"
                  fill="#e5989b"
                />
                <circle cx="50" cy="50" r="18" fill="#b56576" />
                <circle cx="50" cy="50" r="8" fill="#6d597a" />
              </svg>
            )}
          </div>
        </div>

        {/* 5 Event Rows in 3-Column Grid */}
        <div className="grid grid-cols-[1fr_48px_1fr] sm:grid-cols-[1fr_64px_1fr] w-full">
          {EVENTS.map((event, index) => (
            <React.Fragment key={index}>
              {/* Left Column: Time in Cormorant Garamond */}
              <div className="h-[72px] sm:h-[84px] md:h-[92px] flex items-center justify-end pr-3 sm:pr-6 text-right">
                <span className="font-cormorant text-2xl sm:text-3xl text-[#7c6a5a] font-normal tracking-wide whitespace-nowrap">
                  {event.time}
                </span>
              </div>

              {/* Center Column: spacer matching the track width */}
              <div className="h-[72px] sm:h-[84px] md:h-[92px] w-full" />

              {/* Right Column: Event Title in Cormorant Garamond */}
              <div className="h-[72px] sm:h-[84px] md:h-[92px] flex flex-col items-start justify-center pl-3 sm:pr-6 text-left leading-tight sm:leading-snug">
                {event.titleLines.map((line, lineIdx) => (
                  <span
                    key={lineIdx}
                    className="font-cormorant text-lg sm:text-2xl text-[#7c6a5a] font-normal tracking-wide"
                  >
                    {line}
                  </span>
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleOfEvents;
