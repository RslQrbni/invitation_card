"use client";

import React, { useEffect, useState } from "react";
import "./PageLoader.css";

export interface PageLoaderProps {
  /** Minimum time to show loader in milliseconds. Default: 1800 */
  minDuration?: number;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ minDuration = 1800 }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    let minTimerDone = false;
    let windowLoaded = typeof document !== "undefined" && document.readyState === "complete";

    const finishLoading = () => {
      if (minTimerDone && windowLoaded) {
        setIsFadingOut(true);
        setTimeout(() => {
          setIsMounted(false);
        }, 800);
      }
    };

    // Minimum display timer so visitors can see the spinning flag circle
    const minTimer = setTimeout(() => {
      minTimerDone = true;
      finishLoading();
    }, minDuration);

    const handleWindowLoad = () => {
      windowLoaded = true;
      finishLoading();
    };

    if (!windowLoaded && typeof window !== "undefined") {
      window.addEventListener("load", handleWindowLoad);
    }

    // Safety fallback so the page is never blocked indefinitely
    const fallbackTimer = setTimeout(() => {
      windowLoaded = true;
      minTimerDone = true;
      finishLoading();
    }, 5000);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(fallbackTimer);
      if (typeof window !== "undefined") {
        window.removeEventListener("load", handleWindowLoad);
      }
    };
  }, [minDuration]);

  if (!isMounted) return null;

  return (
    <div
      className={`page-loader-overlay ${isFadingOut ? "is-hidden" : ""}`}
      aria-live="polite"
      aria-label="صفحه در حال بارگذاری است"
      dir="rtl"
    >
      <div className="loader" role="status" aria-label="Loading..." />
      <p className="loader-text">
        صفحه در حال بارگذاری است...
      </p>
    </div>
  );
};

export default PageLoader;

