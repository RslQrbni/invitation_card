"use client";

import React, { useEffect, useRef, useState, type ReactNode } from "react";
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
  /** Callback fired when the page has fully expanded to fullscreen */
  onFullScreen?: () => void;
  /** The actual page content to emerge from the envelope */
  children?: ReactNode;
  /** Optional class name */
  className?: string;
}

export const EnvelopeCard: React.FC<EnvelopeCardProps> = ({
  onOpen,
  onFullScreen,
  children,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const topFlapRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLImageElement>(null);
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (!topFlapRef.current || !shadowRef.current || !pageContainerRef.current || !envelopeRef.current) return;

    const mm = gsap.matchMedia(containerRef);

    // --- DESKTOP (> 768px) ---
    mm.add("(min-width: 769px)", () => {
      const startScale = Math.min(270 / window.innerWidth, 175 / window.innerHeight);

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
      // Page container starts tucked inside the envelope pocket behind flaps
      gsap.set(pageContainerRef.current, {
        xPercent: -50,
        yPercent: -50,
        scale: startScale,
        y: 0,
        zIndex: 2,
        borderRadius: "8px",
        pointerEvents: "none",
        opacity: 1,
      });

      const tl = gsap.timeline({
        paused: true,
        onStart: () => {
          setIsAnimating(true);
        },
        onComplete: () => {
          setIsOpen(true);
          setIsAnimating(false);
          setIsFullScreen(true);
          if (onFullScreen) onFullScreen();
        },
        onReverseComplete: () => {
          setIsOpen(false);
          setIsAnimating(false);
        },
      });

      // Wax seal fades smoothly
      if (sealRef.current) {
        tl.to(
          sealRef.current,
          {
            duration: 0.6,
            scale: 1.15,
            y: -8,
            opacity: 0,
            ease: "power2.out",
          },
          0
        );
      }

      // 1. Top flap opens smoothly and slowly
      tl.to(
        topFlapRef.current,
        {
          duration: 1.2,
          ease: "power2.inOut",
          transformOrigin: "top",
          rotateX: 180,
        },
        0.1
      )
        .set(
          topFlapRef.current,
          {
            zIndex: 1,
          },
          0.65
        )
        .to(
          topFlapRef.current,
          {
            duration: 0.8,
            filter: "drop-shadow(0px 0px 0px rgba(0, 0, 0, 0))",
            ease: "power2.out",
          },
          0.1
        );

      // 2. Paper motion — smooth, slower emergence and expansion
      tl.set(pageContainerRef.current, { zIndex: 2 }, 0.5)
        // Paper slides UP out of envelope pocket (duration 1.2s)
        .to(
          pageContainerRef.current,
          {
            duration: 1.2,
            y: -210,
            zIndex: 2,
            ease: "power2.inOut",
          },
          1.2
        )
        // Paper switches to front (zIndex 100), glides down to center,
        // and scales up to fill the full screen (duration 1.4s)
        .set(pageContainerRef.current, { zIndex: 100 }, 2.4)
        .to(
          pageContainerRef.current,
          {
            duration: 1.4,
            y: 0,
            scale: 1,
            borderRadius: "0px",
            ease: "power2.out",
          },
          2.4
        );

      if (shadowRef.current) {
        tl.to(
          shadowRef.current,
          {
            duration: 1.4,
            scaleX: 1.6,
            ease: "power2.out",
          },
          2.4
        );
      }

      timelineRef.current = tl;
    });

    // --- MOBILE (<= 768px) ---
    mm.add("(max-width: 768px)", () => {
      const startScale = 0.85;

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
      // Page container starts tucked inside the mobile envelope pocket behind flaps
      gsap.set(pageContainerRef.current, {
        xPercent: -50,
        yPercent: -50,
        scale: startScale,
        y: 0,
        zIndex: 2,
        borderRadius: "8px",
        pointerEvents: "none",
        opacity: 1,
      });

      const tl = gsap.timeline({
        paused: true,
        onStart: () => {
          setIsAnimating(true);
        },
        onComplete: () => {
          setIsOpen(true);
          setIsAnimating(false);
          setIsFullScreen(true);
          if (onFullScreen) onFullScreen();
        },
        onReverseComplete: () => {
          setIsOpen(false);
          setIsAnimating(false);
        },
      });

      // Wax seal fades smoothly
      if (sealRef.current) {
        tl.to(
          sealRef.current,
          {
            duration: 0.6,
            scale: 1.15,
            y: -8,
            opacity: 0,
            ease: "power2.out",
          },
          0
        );
      }

      // 1. Top flap opens smoothly and slowly
      tl.to(
        topFlapRef.current,
        {
          duration: 1.2,
          ease: "power2.inOut",
          transformOrigin: "top",
          rotateX: 180,
        },
        0.1
      )
        .set(
          topFlapRef.current,
          {
            zIndex: 1,
          },
          0.65
        )
        .to(
          topFlapRef.current,
          {
            duration: 0.8,
            filter: "drop-shadow(0px 0px 0px rgba(0, 0, 0, 0))",
            ease: "power2.out",
          },
          0.1
        );

      // 2. Paper motion — smooth, slower emergence and expansion
      tl.set(pageContainerRef.current, { zIndex: 2 }, 0.5)
        // Slide up out of envelope pocket (duration 1.2s)
        .to(
          pageContainerRef.current,
          {
            duration: 1.2,
            y: "-55vh",
            zIndex: 2,
            ease: "power2.inOut",
          },
          1.2
        )
        // Switch to front and zoom to fullscreen (duration 1.4s)
        .set(pageContainerRef.current, { zIndex: 100 }, 2.4)
        .to(
          pageContainerRef.current,
          {
            duration: 1.4,
            y: 0,
            scale: 1,
            borderRadius: "0px",
            ease: "power2.out",
          },
          2.4
        );

      timelineRef.current = tl;
    });

    return () => mm.revert();
  }, [onFullScreen]);

  useEffect(() => {
    if (isFullScreen) {
      document.documentElement.classList.add("envelope-opened");
      document.body.classList.add("envelope-opened");
      if (pageContainerRef.current) {
        pageContainerRef.current.scrollTop = 0;
      }
      return () => {
        document.documentElement.classList.remove("envelope-opened");
        document.body.classList.remove("envelope-opened");
      };
    }
  }, [isFullScreen]);

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
      className={`envelope-wrapper ${satisfyFont.className} ${className} ${isFullScreen ? "is-fullscreen" : ""}`}
    >
      {/* THE ENVELOPE */}
      <div
        ref={envelopeRef}
        className={`envelope ${isOpen ? "is-open" : ""} ${isFullScreen ? "is-fullscreen" : ""}`}
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
        {/* PAGE CONTAINER — inside the envelope pocket, emerging and zooming to fullscreen! */}
        <div
          ref={pageContainerRef}
          className={`envelope-page-container ${isFullScreen ? "is-fullscreen" : ""}`}
        >
          {children}
        </div>

        <div ref={topFlapRef} className="envelope-top" />
        <div className="envelope-right" />
        <div className="envelope-bottom" />
        <div className="envelope-left" />
        <div ref={shadowRef} className="envelope-shadow" />

        {/* Wax seal */}
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
