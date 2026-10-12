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
  /** Texte principal affiché sur la carte */
  text?: string;
  /** Contenu personnalisé optionnel */
  children?: React.ReactNode;
  /** Callback déclenché à l'ouverture de l'enveloppe */
  onOpen?: () => void;
  /** Callback déclenché à la fermeture de l'enveloppe */
  onClose?: () => void;
  /** Classe CSS optionnelle pour le wrapper */
  className?: string;
}

export const EnvelopeCard: React.FC<EnvelopeCardProps> = ({
  text = "hello world...",
  children,
  onOpen,
  onClose,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const topFlapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!topFlapRef.current || !cardRef.current || !shadowRef.current) return;

    const mm = gsap.matchMedia(containerRef);

    // --- 1. ANIMATION DESKTOP (> 768px) ---
    mm.add("(min-width: 769px)", () => {
      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          setIsOpen(true);
        },
        onReverseComplete: () => {
          setIsOpen(false);
        },
      });

      if (sealRef.current) {
        tl.to(
          sealRef.current,
          {
            duration: 0.35,
            scale: 0,
            opacity: 0,
            ease: "power2.in",
          },
          0
        );
      }

      tl.to(topFlapRef.current, {
        duration: 0.8,
        ease: "back",
        transformOrigin: "top",
        rotateX: 180,
        borderTop: "1px solid rgba(190, 180, 160, 0.6)",
        zIndex: 1,
      })
        .set(cardRef.current, {
          zIndex: 2,
        })
        .to(cardRef.current, {
          duration: 0.3,
          left: 30,
          top: 30,
          width: 250,
          height: 150,
        })
        .to(cardRef.current, {
          duration: 0.5,
          top: -220,
        })
        .set(cardRef.current, {
          zIndex: 10,
        })
        .to(cardRef.current, {
          duration: 0.7,
          scaleX: 1.4,
          scaleY: 1.6,
          top: 10,
          ease: "back",
        })
        .to(
          shadowRef.current,
          {
            duration: 0.7,
            scaleX: 2.1,
          },
          1.6
        );

      timelineRef.current = tl;
    });

    // --- 2. ANIMATION MOBILE (<= 768px : Plein Écran) ---
    mm.add("(max-width: 768px)", () => {
      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          setIsOpen(true);
        },
        onReverseComplete: () => {
          setIsOpen(false);
        },
      });

      // Disparition du sceau
      if (sealRef.current) {
        tl.to(
          sealRef.current,
          {
            duration: 0.35,
            scale: 0,
            opacity: 0,
            ease: "power2.in",
          },
          0
        );
      }

      // 1. Le grand rabat supérieur s'ouvre vers le haut
      tl.to(
        topFlapRef.current,
        {
          duration: 0.8,
          ease: "back",
          transformOrigin: "top",
          rotateX: 180,
          borderTop: "1px solid rgba(190, 180, 160, 0.6)",
          zIndex: 1,
        },
        0
      )
        // 2. Passage de la carte au z-index 2
        .set(cardRef.current, {
          zIndex: 2,
        })
        // 3. La carte glisse vers le haut pour sortir de l'enveloppe
        .to(cardRef.current, {
          duration: 0.6,
          y: "-70vh",
          ease: "power2.inOut",
        })
        // 4. La carte passe au premier plan devant tous les rabats
        .set(cardRef.current, {
          zIndex: 10,
        })
        // 5. La carte redescend se positionner au centre au premier plan
        .to(cardRef.current, {
          duration: 0.75,
          y: 0,
          ease: "back.out(1.1)",
        });

      timelineRef.current = tl;
    });

    return () => mm.revert();
  }, []);

  const handleEnvelopeClick = () => {
    if (!isOpen && timelineRef.current) {
      timelineRef.current.play();
      onOpen?.();
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timelineRef.current) {
      timelineRef.current.reverse();
      onClose?.();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`envelope-wrapper ${satisfyFont.className} ${className}`}
    >
      <div
        className="envelope"
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
        <div ref={cardRef} className="envelope-card">
          <button
            type="button"
            className="envelope-card-close"
            onClick={handleClose}
            aria-label="Fermer la carte"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {children ? (
            children
          ) : (
            <p className="envelope-card-text">{text}</p>
          )}
        </div>

        <div ref={topFlapRef} className="envelope-top" />
        <div className="envelope-right" />
        <div className="envelope-bottom" />
        <div className="envelope-left" />
        <div className="envelope-pattern" aria-hidden="true" />
        <div ref={shadowRef} className="envelope-shadow" />

        {/* Sceau de cire ivoire au centre */}
        <div ref={sealRef} className="envelope-seal" aria-hidden="true">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 21V9" />
            <path d="M12 16c-2.5-1-3.5-3-3.5-5 2.5 0 3.5 2 3.5 5z" fill="currentColor" fillOpacity="0.2" />
            <path d="M12 12c2.5-1 3.5-3 3.5-5-2.5 0-3.5 2-3.5 5z" fill="currentColor" fillOpacity="0.2" />
            <path d="M12 8c-2-1-3-2.5-3-4 2 0 3 1.5 3 4z" fill="currentColor" fillOpacity="0.2" />
            <circle cx="12" cy="4" r="1.5" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default EnvelopeCard;
