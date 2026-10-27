"use client";

import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate?: string; // ISO date string e.g. "2026-09-18T17:00:00"
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate = "2026-09-18T17:00:00",
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const calculateTime = () => {
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
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const padZero = (n: number) => String(n).padStart(2, "0");

  const units = [
    { label: "Days", value: String(timeLeft.days) },
    { label: "Hours", value: padZero(timeLeft.hours) },
    { label: "Minutes", value: padZero(timeLeft.minutes) },
    { label: "Seconds", value: padZero(timeLeft.seconds) },
  ];

  return (
    <div className="flex flex-col items-center justify-center my-12 px-4">
      {/* Decorative subtitle */}
      <div className="text-center mb-6">
        <span className="text-[11px] md:text-xs uppercase tracking-[0.35em] text-[#937100] font-medium block">
          The Celebration Begins In
        </span>
      </div>

      {/* Timer Blocks */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-7">
        {units.map((unit, index) => (
          <React.Fragment key={unit.label}>
            <div className="flex flex-col items-center">
              <div className="relative flex items-center justify-center min-w-[58px] sm:min-w-[76px] md:min-w-[96px] h-14 sm:h-20 md:h-24 px-2 rounded-xl bg-gradient-to-b from-[#fffaf3] to-[#f5ebd8] border border-[#d8ba72]/60 shadow-[0_4px_16px_rgba(180,140,61,0.12)]">
                <span className="text-3xl sm:text-4xl md:text-5xl font-serif font-light tracking-tight gold-shimmer-text select-none">
                  {unit.value}
                </span>
                {/* Subtle metallic inner rim */}
                <div className="absolute inset-0 rounded-xl pointer-events-none border border-white/50" />
              </div>

              <span className="mt-2 text-[11px] sm:text-xs md:text-sm font-serif tracking-widest text-[#8a6825] uppercase">
                {unit.label}
              </span>
            </div>

            {/* Separator dots */}
            {index < units.length - 1 && (
              <span className="text-2xl sm:text-3xl md:text-4xl text-[#B48C3D] font-light self-center mb-6">
                :
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
