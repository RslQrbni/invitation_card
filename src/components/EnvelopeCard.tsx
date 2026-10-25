"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Satisfy } from "next/font/google";
import "./EnvelopeCard.css";

const satisfyFont = Satisfy({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export interface EnvelopeCardProps {
  /** Optional video source for backward compatibility */
  videoSrc?: string;
  /** Callback fired when envelope starts opening */
  onOpen?: () => void;
  /** Callback fired when envelope finishes opening to transition to invitation page */
  onProceed?: () => void;
  /** Optional class name */
  className?: string;
}

export const EnvelopeCard: React.FC<EnvelopeCardProps> = ({
  onOpen,
  onProceed,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const topFlapRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLImageElement>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!topFlapRef.current || !shadowRef.current) return;

    const mm = gsap.matchMedia(containerRef);

    // --- 1. ANIMATION DESKTOP (> 768px) ---
    mm.add("(min-width: 769px)", () => {
      gsap.set(topFlapRef.current, { rotateX: 0, zIndex: 12 });
      if (sealRef.current) {
        gsap.set(sealRef.current, {
          xPercent: -50,
          yPercent: -50,
          scale: 1,
          opacity: 1,
          rotate: 0,
          y: 0,
        });
      }
      if (shadowRef.current) {
        gsap.set(shadowRef.current, { scaleX: 1, opacity: 1 });
      }

      const tl = gsap.timeline({
        paused: true,
        onStart: () => {
          setIsAnimating(true);
        },
        onComplete: () => {
          setIsOpen(true);
          setIsAnimating(false);
          // Directly proceed to the main invitation page with smooth transition
          if (onProceed) {
            onProceed();
          }
        },
        onReverseComplete: () => {
          setIsOpen(false);
          setIsAnimating(false);
        },
      });

      // 1. Sceau de cire : soulèvement délicat et disparition
      if (sealRef.current) {
        tl.to(
          sealRef.current,
          {
            duration: 0.35,
            scale: 1.14,
            y: -5,
            rotate: -6,
            ease: "power2.out",
          },
          0
        ).to(
          sealRef.current,
          {
            duration: 0.35,
            scale: 0.75,
            opacity: 0,
            ease: "power2.inOut",
          },
          0.18
        );
      }

      // 2. Rabat supérieur : déploiement en 3D
      tl.to(
        topFlapRef.current,
        {
          duration: 0.45,
          rotateX: 90,
          transformOrigin: "50% 0%",
          ease: "power2.in",
        },
        0.18
      )
        .to(
          topFlapRef.current,
          {
            duration: 0.45,
            filter: "drop-shadow(0 2px 4px rgba(45, 32, 20, 0.05))",
            ease: "power2.in",
          },
          0.18
        )
        .set(topFlapRef.current, {
          zIndex: 1,
        })
        .to(topFlapRef.current, {
          duration: 0.45,
          rotateX: 180,
          transformOrigin: "50% 0%",
          ease: "power2.out",
        })
        .to(
          shadowRef.current,
          {
            duration: 0.8,
            scaleX: 1.5,
            opacity: 0.45,
            ease: "power2.out",
          },
          0.5
        );

      timelineRef.current = tl;
    });

    // --- 2. ANIMATION MOBILE (<= 768px) ---
    mm.add("(max-width: 768px)", () => {
      gsap.set(topFlapRef.current, { rotateX: 0, zIndex: 12 });
      if (sealRef.current) {
        gsap.set(sealRef.current, {
          xPercent: -50,
          yPercent: -50,
          scale: 1,
          opacity: 1,
          rotate: 0,
          y: 0,
        });
      }

      const tl = gsap.timeline({
        paused: true,
        onStart: () => {
          setIsAnimating(true);
        },
        onComplete: () => {
          setIsOpen(true);
          setIsAnimating(false);
          // Directly proceed to the main invitation page with smooth transition
          if (onProceed) {
            onProceed();
          }
        },
        onReverseComplete: () => {
          setIsOpen(false);
          setIsAnimating(false);
        },
      });

      if (sealRef.current) {
        tl.to(
          sealRef.current,
          {
            duration: 0.35,
            scale: 1.15,
            y: -5,
            rotate: -6,
            ease: "power2.out",
          },
          0
        ).to(
          sealRef.current,
          {
            duration: 0.35,
            scale: 0.75,
            opacity: 0,
            ease: "power2.inOut",
          },
          0.18
        );
      }

      tl.to(
        topFlapRef.current,
        {
          duration: 0.45,
          rotateX: 90,
          transformOrigin: "50% 0%",
          ease: "power2.in",
        },
        0.18
      )
        .set(topFlapRef.current, {
          zIndex: 1,
        })
        .to(topFlapRef.current, {
          duration: 0.45,
          rotateX: 180,
          transformOrigin: "50% 0%",
          ease: "power2.out",
        });

      timelineRef.current = tl;
    });

    return () => mm.revert();
  }, [onProceed]);

  const handleEnvelopeClick = () => {
    if (!isOpen && !isAnimating && timelineRef.current && !timelineRef.current.isActive()) {
      setIsAnimating(true);
      timelineRef.current.play();
      onOpen?.();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`envelope-wrapper ${satisfyFont.className} ${className}`}
    >
      {/* 1. L'ENVELOPPE EXACTEMENT COMME LE DESIGN ORIGINAL */}
      <div
        className={`envelope ${isOpen ? "is-open" : ""}`}
        onClick={handleEnvelopeClick}
        role="button"
        tabIndex={0}
        aria-label="Ouvrir l'enveloppe"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleEnvelopeClick();
          }
        }}
      >
        <div ref={topFlapRef} className="envelope-top" />
        <div className="envelope-right" />
        <div className="envelope-bottom" />
        <div className="envelope-left" />
        <div ref={shadowRef} className="envelope-shadow" />

        {/* Sceau de cire au centre */}
        <img
          ref={sealRef}
          src="/seal.png"
          alt="Sceau en cire"
          className="envelope-seal"
          aria-hidden="true"
          draggable={false}
        />
      </div>

      {/* Tap prompt */}
      {!isOpen && !isAnimating && (
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-bounce">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#fdf8f0]/95 backdrop-blur-md border border-[#cda95a]/70 text-[#8a6825] font-serif text-xs uppercase tracking-[0.25em] shadow-lg">
            ✨ Tap to open
          </span>
        </div>
      )}
    </div>
  );
};

export default EnvelopeCard;
