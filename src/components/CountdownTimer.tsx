"use client";

import React, { useState, useEffect } from "react";

export interface CountdownTimerProps {
  /** Target ceremony date in ISO format (e.g. "2026-12-08T18:00:00") */
  targetDate?: string;
  /** Header title above the timer. Default: "The ceremony begin in" */
  title?: string;
  /** Optional container class name */
  className?: string;
  /** Whether to render with the envelope paper parchment background */
  showBackground?: boolean;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate = "2026-12-08T18:00:00",
  title = "The ceremony begin in",
  className = "",
  showBackground = false,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 42,
    hours: 2,
    minutes: 45,
    seconds: 30,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const padZero = (n: number) => String(n).padStart(2, "0");

  const units = [
    { label: "Days", value: padZero(timeLeft.days) },
    { label: "Hours", value: padZero(timeLeft.hours) },
    { label: "Minutes", value: padZero(timeLeft.minutes) },
    { label: "Seconds", value: padZero(timeLeft.seconds) },
  ];

  const content = (
    <div className="w-full flex flex-col items-center justify-center text-center select-none">
      {/* 1. CALLIGRAPHIC HEADER (Matches photo cursive script) */}
      <h3
        className="font-pinyon text-2xl sm:text-3xl md:text-4xl text-[#ad873b] leading-normal mb-3 sm:mb-4 md:mb-5 select-none capitalize"
        style={{
          textShadow:
            "0 1px 1px rgba(255,255,255,0.85), 0 2px 4px rgba(173,135,59,0.18)",
        }}
      >
        {title}
      </h3>

      {/* 2. TIMER DIGITS & LABELS ROW */}
      <div className="flex items-start justify-center gap-1.5 sm:gap-3 md:gap-5 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
        {units.map((unit, index) => (
          <React.Fragment key={unit.label}>
            {/* Unit block: digit on top, label below */}
            <div className="flex flex-col items-center flex-1 min-w-[42px] sm:min-w-[55px] md:min-w-[65px]">
              <span
                className="font-cormorant text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#ad873b] tabular-nums font-normal tracking-tight leading-none"
                style={{
                  textShadow:
                    "0 1px 1px rgba(255,255,255,0.7), 0 2px 4px rgba(173,135,59,0.15)",
                }}
              >
                {unit.value}
              </span>
              <span
                className="mt-1 sm:mt-1.5 font-cormorant text-[11px] sm:text-xs md:text-sm text-[#ad873b] font-normal tracking-wider capitalize"
                style={{
                  textShadow: "0 1px 1px rgba(255,255,255,0.6)",
                }}
              >
                {unit.label}
              </span>
            </div>

            {/* Colon separator between units (vertically aligned with the digits) */}
            {index < units.length - 1 && (
              <span
                className="font-cormorant text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#ad873b] font-light leading-none self-start pt-0.5 sm:pt-1"
                style={{
                  textShadow:
                    "0 1px 1px rgba(255,255,255,0.7), 0 2px 4px rgba(173,135,59,0.15)",
                }}
                aria-hidden="true"
              >
                :
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  if (!showBackground) {
    return <div className={`w-full ${className}`}>{content}</div>;
  }

  return (
    <div
      className={`relative w-full rounded-2xl md:rounded-3xl envelope-paper-card border border-[#d8ba72]/45 px-5 sm:px-10 md:px-14 py-8 sm:py-12 md:py-16 text-center overflow-hidden ${className}`}
    >
      {/* Elegant inner gold hairline border */}
      <div className="absolute inset-2 sm:inset-3 md:inset-4 rounded-xl md:rounded-2xl border border-[#d8ba72]/30 pointer-events-none" />
      {content}
    </div>
  );
};

export default CountdownTimer;
