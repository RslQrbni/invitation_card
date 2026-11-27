"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { GalleryFile } from "@/app/api/gallery/route";

export interface WeddingGallerySectionProps {
  className?: string;
  gridClassName?: string;
}

type MediaFilter = "all" | "photos" | "videos";

function isVideoFile(file: GalleryFile): boolean {
  return file.mimeType.toLowerCase().startsWith("video/");
}

function getImageThumbnailUrl(file: GalleryFile): string {
  return `https://lh3.googleusercontent.com/d/${file.id}=w800`;
}

function getImageFullUrl(file: GalleryFile): string {
  return `https://lh3.googleusercontent.com/d/${file.id}=w1600`;
}

function getVideoThumbnailUrl(file: GalleryFile): string {
  if (file.thumbnailLink) {
    return file.thumbnailLink.replace(/=s\d+/, "=s800");
  }
  return `https://lh3.googleusercontent.com/d/${file.id}=w800`;
}

function getVideoEmbedUrl(file: GalleryFile): string {
  return `https://drive.google.com/file/d/${file.id}/preview`;
}

interface GalleryCardProps {
  file: GalleryFile;
  onOpen: () => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ file, onOpen }) => {
  const isVideo = isVideoFile(file);
  const [thumbSrc, setThumbSrc] = useState<string>(
    isVideo ? getVideoThumbnailUrl(file) : getImageThumbnailUrl(file)
  );
  const [thumbFailed, setThumbFailed] = useState(false);

  const handleImgError = () => {
    // Try secondary Google thumbnail URL before falling back to styled placeholder
    if (!isVideo && file.thumbnailLink && thumbSrc !== file.thumbnailLink) {
      setThumbSrc(file.thumbnailLink.replace(/=s\d+/, "=s800"));
      return;
    }
    if (isVideo && thumbSrc !== `https://lh3.googleusercontent.com/d/${file.id}=w800`) {
      setThumbSrc(`https://lh3.googleusercontent.com/d/${file.id}=w800`);
      return;
    }
    setThumbFailed(true);
  };

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={isVideo ? `Play video ${file.name}` : `View photo ${file.name}`}
      className="group relative w-full overflow-hidden rounded-2xl border border-[#c5a054]/45 bg-[#e9dec6] shadow-[0_6px_18px_rgba(70,50,30,0.12)] hover:shadow-[0_10px_26px_rgba(70,50,30,0.22)] transition-all duration-300 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#b58e3e] aspect-square"
    >
      {!thumbFailed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbSrc}
          alt={file.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={handleImgError}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#3a2d21] to-[#5e4733] text-[#f3e3be] p-3 text-center">
          <span className="text-2xl opacity-80">{isVideo ? "▶" : "✦"}</span>
          <span className="mt-1.5 text-xs font-cormorant truncate max-w-full opacity-90">
            {file.name}
          </span>
        </div>
      )}

      {/* Subtle gold inner vignette on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none" />

      {/* Video Play Overlay */}
      {isVideo && (
        <>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/50 border-2 border-[#e6ca85]/90 backdrop-blur-xs flex items-center justify-center text-[#fff8ec] shadow-[0_4px_16px_rgba(0,0,0,0.4)] group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-6 h-6 ml-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8 5.14v14l11-7-11-7z" />
              </svg>
            </span>
          </div>
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/55 border border-[#e6ca85]/50 text-[#fdf6e7] text-[10px] font-cormorant tracking-wider uppercase backdrop-blur-xs">
            Video
          </span>
        </>
      )}
    </button>
  );
};

export const WeddingGallerySection: React.FC<WeddingGallerySectionProps> = ({
  className = "",
  gridClassName = "grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4",
}) => {
  const [files, setFiles] = useState<GalleryFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filter, setFilter] = useState<MediaFilter>("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [lightboxImageLoaded, setLightboxImageLoaded] = useState(false);

  // Initial fetch on mount (keeps setState strictly in async continuation)
  useEffect(() => {
    let cancelled = false;

    const fetchInitial = async () => {
      try {
        const res = await fetch("/api/gallery");
        const data = (await res.json().catch(() => ({}))) as {
          files?: GalleryFile[];
          error?: string;
        };

        if (cancelled) return;

        if (!res.ok) {
          throw new Error(data.error || "Unable to load wedding gallery.");
        }

        setFiles(Array.isArray(data.files) ? data.files : []);
        setErrorMessage("");
      } catch (err: unknown) {
        if (cancelled) return;
        setErrorMessage(
          err instanceof Error ? err.message : "Unable to load wedding gallery."
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchInitial();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/gallery?refresh=1");
      const data = (await res.json().catch(() => ({}))) as {
        files?: GalleryFile[];
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error || "Unable to load wedding gallery.");
      }

      setFiles(Array.isArray(data.files) ? data.files : []);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Unable to load wedding gallery."
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const photoCount = files.filter((f) => !isVideoFile(f)).length;
  const videoCount = files.filter((f) => isVideoFile(f)).length;

  const visibleFiles = files.filter((file) => {
    if (filter === "photos") return !isVideoFile(file);
    if (filter === "videos") return isVideoFile(file);
    return true;
  });

  const visibleCount = visibleFiles.length;

  const activeFile =
    selectedIndex !== null && visibleFiles[selectedIndex]
      ? visibleFiles[selectedIndex]
      : null;

  const openItem = (index: number) => {
    setLightboxImageLoaded(false);
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goToPrev = () => {
    if (visibleCount === 0) return;
    setLightboxImageLoaded(false);
    setSelectedIndex((prev) =>
      prev === null ? null : (prev - 1 + visibleCount) % visibleCount
    );
  };

  const goToNext = () => {
    if (visibleCount === 0) return;
    setLightboxImageLoaded(false);
    setSelectedIndex((prev) =>
      prev === null ? null : (prev + 1) % visibleCount
    );
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedIndex === null || visibleCount === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIndex(null);
      } else if (e.key === "ArrowLeft") {
        setLightboxImageLoaded(false);
        setSelectedIndex((prev) =>
          prev === null ? null : (prev - 1 + visibleCount) % visibleCount
        );
      } else if (e.key === "ArrowRight") {
        setLightboxImageLoaded(false);
        setSelectedIndex((prev) =>
          prev === null ? null : (prev + 1) % visibleCount
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, visibleCount]);

  return (
    <section
      aria-label="Wedding Gallery"
      className={`relative z-20 w-full mx-auto ${className}`}
    >
      <div className="relative z-20 w-full px-4 sm:px-6 pt-4 pb-6 text-center">
        {/* Header */}
        <div className="text-center pb-6 select-none">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-10 sm:w-14 h-[1px] bg-gradient-to-r from-transparent to-[#c5a054]" />
            <span className="text-[#b58e3e] text-xs">✦</span>
            <span className="w-10 sm:w-14 h-[1px] bg-gradient-to-l from-transparent to-[#c5a054]" />
          </div>

          <h2
            className="font-pinyon text-4xl sm:text-5xl text-[#b58e3e] leading-tight"
            style={{
              textShadow:
                "0 1px 2px rgba(255,255,255,0.9), 0 2px 6px rgba(173,135,59,0.22)",
            }}
          >
            Wedding Gallery
          </h2>

          <p className="font-cormorant text-base sm:text-lg text-[#5e4b3c] mt-1.5 leading-relaxed">
            Our Public Wedding Album
          </p>
          <p
            dir="rtl"
            className="font-amiri text-sm sm:text-base text-[#7c6652] mt-0.5 leading-relaxed"
          >
            گالری لحظات به‌یادماندنی جشن ما
          </p>
        </div>

        {/* Filter Pills & Refresh (only shown when gallery has items) */}
        {!isLoading && !errorMessage && files.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            {photoCount > 0 && videoCount > 0 && (
              <>
                {(
                  [
                    { key: "all", label: `All (${files.length})` },
                    { key: "photos", label: `Photos (${photoCount})` },
                    { key: "videos", label: `Videos (${videoCount})` },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      setSelectedIndex(null);
                      setFilter(tab.key);
                    }}
                    className={`px-4 py-1.5 rounded-full font-cormorant text-sm sm:text-base font-medium border transition-all cursor-pointer ${
                      filter === tab.key
                        ? "bg-[#b58e3e] text-[#fdfaf3] border-[#b58e3e] shadow-sm"
                        : "bg-[#fbf6ea] text-[#6b5847] border-[#c5a054]/50 hover:border-[#b58e3e]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </>
            )}

            <button
              type="button"
              onClick={() => void handleRefresh()}
              disabled={isRefreshing}
              className="px-3.5 py-1.5 rounded-full bg-[#fbf6ea] hover:bg-[#f3e9d2] text-[#7c6652] border border-[#c5a054]/45 font-cormorant text-sm inline-flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              aria-label="Refresh gallery"
            >
              <svg
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className={`grid ${gridClassName}`}>
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-2xl bg-[#eadec5]/80 border border-[#c5a054]/30 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && errorMessage && (
          <div className="p-6 rounded-2xl bg-[#fbf6ea]/90 border border-[#c5a054]/45 shadow-sm space-y-3">
            <p className="font-cormorant text-base sm:text-lg text-[#6d1322]">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={() => void handleRefresh()}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#8a6825] via-[#b58e3e] to-[#8a6825] text-[#fdfaf3] font-cormorant text-sm sm:text-base font-semibold shadow-sm cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State Placeholder */}
        {!isLoading && !errorMessage && files.length === 0 && (
          <div className="p-8 sm:p-10 rounded-3xl bg-[#fbf6ea]/85 border border-[#c5a054]/45 shadow-[0_8px_24px_rgba(70,50,30,0.08)] space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-b from-[#fbf4e5] to-[#efe2c4] border border-[#c5a054]/60 flex items-center justify-center text-[#9c782d]">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </div>
            <p className="font-cormorant text-xl sm:text-2xl font-semibold text-[#5e4b3c]">
              Our wedding gallery will appear here soon!
            </p>
            <p
              dir="rtl"
              className="font-amiri text-sm sm:text-base text-[#7c6652] leading-relaxed"
            >
              به‌زودی عکس‌ها و ویدیوهای منتخب جشن در این آلبوم قرار خواهند گرفت
            </p>
          </div>
        )}

        {/* Responsive Media Grid */}
        {!isLoading && !errorMessage && visibleFiles.length > 0 && (
          <div className={`grid ${gridClassName}`}>
            {visibleFiles.map((file, idx) => (
              <GalleryCard
                key={file.id}
                file={file}
                onOpen={() => openItem(idx)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Full-Screen Lightbox Modal (portaled to body above butterflies & floating buttons) */}
      {activeFile &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeFile.name}
            onClick={closeLightbox}
            className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8"
          >
            {/* Top Bar: Counter & Close Button */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-4 inset-x-4 sm:top-6 sm:inset-x-8 flex items-center justify-between text-[#fdf6e7] z-20"
            >
              <span className="px-3.5 py-1 rounded-full bg-white/10 border border-white/15 font-cormorant text-sm sm:text-base tracking-wider">
                {(selectedIndex ?? 0) + 1} / {visibleFiles.length}
              </span>

              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Close lightbox"
                className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Prev / Next Navigation Arrows */}
            {visibleFiles.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrev();
                  }}
                  aria-label="Previous item"
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/75 border border-[#e6ca85]/40 text-[#fdf6e7] flex items-center justify-center transition cursor-pointer"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  aria-label="Next item"
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/75 border border-[#e6ca85]/40 text-[#fdf6e7] flex items-center justify-center transition cursor-pointer"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Media Content */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[82vh] flex items-center justify-center"
            >
              {isVideoFile(activeFile) ? (
                <div className="w-full aspect-video max-h-[80vh] rounded-2xl overflow-hidden border border-[#c5a054]/40 bg-black shadow-2xl">
                  <iframe
                    key={activeFile.id}
                    src={getVideoEmbedUrl(activeFile)}
                    title={activeFile.name}
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative flex items-center justify-center max-h-[82vh] max-w-full">
                  {!lightboxImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full border-2 border-[#e6ca85]/30 border-t-[#e6ca85] animate-spin" />
                    </div>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={activeFile.id}
                    src={getImageFullUrl(activeFile)}
                    alt={activeFile.name}
                    referrerPolicy="no-referrer"
                    onLoad={() => setLightboxImageLoaded(true)}
                    className={`max-h-[82vh] max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl border border-[#c5a054]/30 transition-opacity duration-300 ${
                      lightboxImageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};

export default WeddingGallerySection;
