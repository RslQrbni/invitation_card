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
  const sealRef = useRef<HTMLImageElement>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!topFlapRef.current || !cardRef.current || !shadowRef.current) return;

    const mm = gsap.matchMedia(containerRef);

    // --- 1. ANIMATION DESKTOP (> 768px) ---
    mm.add("(min-width: 769px)", () => {
      // Définition des états initiaux explicites
      gsap.set(topFlapRef.current, { rotateX: 0, zIndex: 12 });
      gsap.set(cardRef.current, { y: 0, scale: 1, zIndex: 1 });
      if (sealRef.current) {
        gsap.set(sealRef.current, { xPercent: -50, yPercent: -50, scale: 1, opacity: 1, rotate: 0, y: 0 });
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
        },
        onReverseComplete: () => {
          setIsOpen(false);
          setIsAnimating(false);
        },
      });

      // 1. Sceau de cire : soulèvement délicat et dissolution vaporeuse
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

      // 2. Rabat supérieur : déploiement réaliste en 3D
      // Étape A : ouverture de 0° à 90° (le rabat reste au premier plan avec sa drop-shadow qui s'atténue)
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
        // À 90° pile : bascule au z-index 1 pour passer derrière l'enveloppe
        .set(topFlapRef.current, {
          zIndex: 1,
        })
        // Étape B : repli doux de 90° à 180° derrière l'enveloppe
        .to(topFlapRef.current, {
          duration: 0.45,
          rotateX: 180,
          transformOrigin: "50% 0%",
          ease: "power2.out",
        })

        // 3. Ombre portée au sol : s'étend légèrement pour créer un sentiment de profondeur
        .to(
          shadowRef.current,
          {
            duration: 0.8,
            scaleX: 1.5,
            opacity: 0.45,
            ease: "power2.out",
          },
          0.5
        )

        // 4. Glissement élégant de la carte hors de la pochette
        // La carte monte avec fluidité le long de l'axe Y
        .to(
          cardRef.current,
          {
            duration: 0.68,
            y: -155,
            ease: "power2.inOut",
          },
          0.65
        )
        // Au sommet, la carte passe devant tous les pans de l'enveloppe
        .set(cardRef.current, {
          zIndex: 15,
        })
        // 5. Descente et mise en valeur majestueuse au premier plan avec un bel amorti
        .to(cardRef.current, {
          duration: 0.78,
          y: -12,
          scale: 1.25,
          boxShadow:
            "0 24px 50px rgba(50, 40, 30, 0.22), 0 6px 16px rgba(50, 40, 30, 0.12)",
          ease: "power3.out",
        });

      timelineRef.current = tl;
    });

    // --- 2. ANIMATION MOBILE (<= 768px : Plein Écran) ---
    mm.add("(max-width: 768px)", () => {
      // Définition des états initiaux explicites
      gsap.set(topFlapRef.current, { rotateX: 0, zIndex: 12 });
      gsap.set(cardRef.current, { y: 0, scale: 1, zIndex: 1 });
      if (sealRef.current) {
        gsap.set(sealRef.current, { xPercent: -50, yPercent: -50, scale: 1, opacity: 1, rotate: 0, y: 0 });
      }

      const tl = gsap.timeline({
        paused: true,
        onStart: () => {
          setIsAnimating(true);
        },
        onComplete: () => {
          setIsOpen(true);
          setIsAnimating(false);
        },
        onReverseComplete: () => {
          setIsOpen(false);
          setIsAnimating(false);
        },
      });

      // 1. Sceau : disparition fluide
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

      // 2. Déploiement du grand rabat supérieur
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
        })

        // 3. Montée fluide et rythmée de la carte hors de la pochette
        .to(
          cardRef.current,
          {
            duration: 0.72,
            y: "-38vh",
            ease: "power2.inOut",
          },
          0.65
        )
        // 4. Passage au premier plan
        .set(cardRef.current, {
          zIndex: 15,
        })
        // 5. Redescente douce et élégante au centre de l'écran
        .to(cardRef.current, {
          duration: 0.8,
          y: 0,
          scale: 1.02,
          boxShadow: "0 20px 45px rgba(0, 0, 0, 0.28)",
          ease: "power3.out",
        });

      timelineRef.current = tl;
    });

    return () => mm.revert();
  }, []);

  const handleEnvelopeClick = () => {
    if (!isOpen && !isAnimating && timelineRef.current && !timelineRef.current.isActive()) {
      setIsAnimating(true);
      timelineRef.current.play();
      onOpen?.();
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timelineRef.current && !timelineRef.current.isActive()) {
      setIsAnimating(true);
      setIsOpen(false);
      timelineRef.current.reverse();
      onClose?.();
    }
  };

  // Fermeture avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && timelineRef.current && !timelineRef.current.isActive()) {
        setIsAnimating(true);
        setIsOpen(false);
        timelineRef.current.reverse();
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      ref={containerRef}
      className={`envelope-wrapper ${satisfyFont.className} ${className}`}
    >
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
        <div
          ref={cardRef}
          className="envelope-card"
          onClick={(e) => {
            if (isOpen) {
              e.stopPropagation();
            }
          }}
        >
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
    </div>
  );
};

export default EnvelopeCard;
