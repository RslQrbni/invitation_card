"use client";

import React, { useEffect, useRef, useState } from "react";

export interface PhotoUploadSectionProps {
  className?: string;
}

type UploadStatus = "queued" | "preparing" | "uploading" | "done" | "error";

interface UploadItem {
  id: string;
  file: File;
  fileName: string;
  fileSize: number;
  mimeType: string;
  isVideo: boolean;
  previewUrl: string | null;
  progress: number;
  status: UploadStatus;
  error?: string;
}

const MAX_CONCURRENT_UPLOADS = 2;

function inferMimeType(file: File): string {
  if (file.type && file.type.trim().length > 0) {
    return file.type;
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    heic: "image/heic",
    heif: "image/heif",
    avif: "image/avif",
    mp4: "video/mp4",
    mov: "video/quicktime",
    m4v: "video/x-m4v",
    webm: "video/webm",
    avi: "video/x-msvideo",
    mkv: "video/x-matroska",
    "3gp": "video/3gpp",
  };

  return map[ext] || "application/octet-stream";
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function uploadFileViaXhr(
  uploadUrl: string,
  file: File,
  mimeType: string,
  onProgress: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl, true);
    xhr.setRequestHeader("Content-Type", mimeType);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        const percent = Math.min(99, Math.round((event.loaded / event.total) * 100));
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
      } else {
        reject(new Error(`Upload failed (${xhr.status}). Please try again.`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during upload. Please check your connection and retry."));
    };

    xhr.onabort = () => {
      reject(new Error("Upload was cancelled."));
    };

    xhr.send(file);
  });
}

export const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({
  className = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlsRef = useRef<string[]>([]);

  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [globalError, setGlobalError] = useState("");

  // Revoke any object URLs on unmount to prevent memory leaks on mobile browsers
  useEffect(() => {
    const urls = previewUrlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const updateItem = (id: string, patch: Partial<UploadItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const uploadSingleItem = async (item: UploadItem) => {
    updateItem(item.id, { status: "preparing", progress: 0, error: undefined });

    try {
      const res = await fetch("/api/get-upload-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: item.fileName,
          mimeType: item.mimeType,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        uploadUrl?: string;
        error?: string;
      };

      if (!res.ok || !data.uploadUrl) {
        throw new Error(data.error || "Could not start upload. Please try again.");
      }

      updateItem(item.id, { status: "uploading", progress: 2 });

      await uploadFileViaXhr(data.uploadUrl, item.file, item.mimeType, (percent) => {
        updateItem(item.id, { progress: percent });
      });

      updateItem(item.id, { status: "done", progress: 100 });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Upload failed. Please try again.";
      updateItem(item.id, { status: "error", error: message });
    }
  };

  const processQueue = async (newItems: UploadItem[]) => {
    let cursor = 0;

    const worker = async () => {
      while (cursor < newItems.length) {
        const current = newItems[cursor];
        cursor += 1;
        await uploadSingleItem(current);
      }
    };

    const workerCount = Math.min(MAX_CONCURRENT_UPLOADS, newItems.length);
    await Promise.all(Array.from({ length: workerCount }, () => worker()));
  };

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setGlobalError("");

    const selectedFiles = Array.from(fileList);
    const validItems: UploadItem[] = [];
    let skippedCount = 0;

    selectedFiles.forEach((file, index) => {
      const mimeType = inferMimeType(file);
      const isImage = mimeType.startsWith("image/");
      const isVideo = mimeType.startsWith("video/");

      if (!isImage && !isVideo) {
        skippedCount += 1;
        return;
      }

      let previewUrl: string | null = null;
      if (isImage) {
        try {
          previewUrl = URL.createObjectURL(file);
          previewUrlsRef.current.push(previewUrl);
        } catch {
          previewUrl = null;
        }
      }

      validItems.push({
        id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        fileName: file.name || `memory-${Date.now()}.${isVideo ? "mp4" : "jpg"}`,
        fileSize: file.size,
        mimeType,
        isVideo,
        previewUrl,
        progress: 0,
        status: "queued",
      });
    });

    if (skippedCount > 0) {
      setGlobalError(
        skippedCount === 1
          ? "1 unsupported file was skipped. Please choose photos or videos."
          : `${skippedCount} unsupported files were skipped. Please choose photos or videos.`
      );
    }

    if (validItems.length === 0) return;

    setItems((prev) => [...validItems, ...prev]);
    void processQueue(validItems);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilesSelected(e.target.files);
    // Reset input value so selecting the same file again still triggers onChange
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesSelected(e.dataTransfer.files);
  };

  const handleRetry = (item: UploadItem) => {
    void uploadSingleItem(item);
  };

  const handleClearFinished = () => {
    setItems((prev) => {
      prev.forEach((item) => {
        if (item.status === "done" && item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
      return prev.filter((item) => item.status !== "done");
    });
  };

  const activeCount = items.filter(
    (item) =>
      item.status === "queued" ||
      item.status === "preparing" ||
      item.status === "uploading"
  ).length;
  const doneCount = items.filter((item) => item.status === "done").length;
  const allUploadsCompleted = items.length > 0 && activeCount === 0 && doneCount > 0;

  return (
    <section
      aria-label="Share Your Photos & Videos"
      className={`relative z-20 w-full mx-auto ${className}`}
    >
      <div
        className="relative z-20 w-full px-6 sm:px-10 md:px-14 pt-10 sm:pt-14 md:pt-16 pb-12 sm:pb-16 md:pb-20 text-center drop-shadow-[0_12px_28px_rgba(60,40,20,0.14)]"
        style={{
          backgroundImage: "url('/paper_back.webp')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* Header */}
        <div className="text-center pb-5 select-none">
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
            به اشتراک گذاشتن عکس و فیلم.
          </h2>

          <p className="font-cormorant text-base sm:text-lg text-[#5e4b3c] mt-2 leading-relaxed max-w-sm mx-auto">
            اگر عکس و فیلمی جالب و قشنگی از مراسم گرفتین خوشحال میشیم با ما به اشتراک بگذارین.
          </p>

        </div>

        {/* Hidden Mobile-Friendly File Input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleInputChange}
          className="hidden"
          aria-label="Choose photos or videos to upload"
        />

        {/* Dropzone / Mobile Tap Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={`group relative rounded-2xl border-2 border-dashed p-6 sm:p-8 transition-all duration-300 cursor-pointer select-none ${isDragging
            ? "border-[#8a6825] bg-[#cda95a]/20 scale-[1.01]"
            : "border-[#c5a054]/70 bg-white/45 hover:bg-white/65 hover:border-[#b58e3e]"
            }`}
        >
          {/* Camera / Cloud Icon */}
          <div className="w-14 h-14 mx-auto mb-3.5 rounded-full bg-gradient-to-b from-[#fbf4e5] to-[#f1e4c6] border border-[#c5a054]/70 flex items-center justify-center text-[#8a6825] shadow-[0_4px_14px_rgba(181,142,62,0.2)] group-hover:scale-105 transition-transform">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.7}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
              />
            </svg>
          </div>

          <p className="font-cormorant text-lg sm:text-xl font-semibold text-[#4a392b]">
            برای اشتراک گذاری کلیک کنید
          </p>


          <div className="mt-4 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#8a6825] via-[#b58e3e] to-[#8a6825] text-[#fdfaf3] font-cormorant text-base sm:text-lg font-semibold tracking-wide shadow-[0_4px_16px_rgba(180,140,61,0.38)] group-hover:shadow-[0_6px_22px_rgba(180,140,61,0.52)] transition-all">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <span>انتخاب و آپلود عکس و فیلم</span>
          </div>
        </div>

        {/* Validation Warning */}
        {globalError && (
          <div
            role="alert"
            className="mt-4 p-3 rounded-2xl bg-[#5A0F1B]/10 border border-[#5A0F1B]/30 text-[#6d1322] font-cormorant text-sm sm:text-base"
          >
            {globalError}
          </div>
        )}

        {/* Thank-You Banner once all uploads finish */}
        {allUploadsCompleted && (
          <div className="mt-5 p-5 rounded-2xl bg-gradient-to-b from-[#fbf5e6] to-[#f4e9cf] border border-[#b58e3e]/60 shadow-[0_4px_18px_rgba(181,142,62,0.18)] space-y-2.5 text-center">
            <div className="w-11 h-11 mx-auto rounded-full bg-[#b58e3e] text-[#fdfaf3] flex items-center justify-center text-lg shadow-sm">
              ✓
            </div>
            <h3 className="font-cormorant text-xl sm:text-2xl font-bold text-[#6e501b]">
              Thank You for Sharing Your Memories!
            </h3>
            <p className="font-cormorant text-base text-[#5e4b3c] leading-relaxed">
              {doneCount === 1
                ? "Your photo/video has been received safely and will appear in our Wedding Gallery once reviewed."
                : `All ${doneCount} memories have been received safely and will appear in our Wedding Gallery once reviewed.`}
            </p>
            <p dir="rtl" className="font-amiri text-sm text-[#7c6652]">
              سپاسگزاریم! فایل‌های شما دریافت شد و پس از بررسی در گالری عروسی نمایش داده خواهد شد.
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-[#8a6825] via-[#b58e3e] to-[#8a6825] text-[#fdfaf3] font-cormorant text-sm sm:text-base font-semibold shadow-sm hover:opacity-95 transition cursor-pointer"
              >
                Upload More
              </button>
              <button
                type="button"
                onClick={handleClearFinished}
                className="px-4 py-2 rounded-full bg-white/70 hover:bg-white text-[#6b5847] border border-[#c5a054]/50 font-cormorant text-sm font-medium transition cursor-pointer"
              >
                Clear List
              </button>
            </div>
          </div>
        )}

        {/* Per-File Upload Progress List */}
        {items.length > 0 && (
          <div className="mt-5 space-y-2.5 text-left">
            <div className="flex items-center justify-between px-1 text-xs sm:text-sm font-cormorant text-[#7c6652]">
              <span>
                {activeCount > 0
                  ? `Uploading ${activeCount} ${activeCount === 1 ? "file" : "files"}...`
                  : `${doneCount} of ${items.length} uploaded`}
              </span>
              {activeCount === 0 && doneCount > 0 && !allUploadsCompleted && (
                <button
                  type="button"
                  onClick={handleClearFinished}
                  className="underline hover:text-[#4a392b] cursor-pointer"
                >
                  Clear completed
                </button>
              )}
            </div>

            <ul className="space-y-2.5 max-h-80 overflow-y-auto pr-0.5">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="p-3 rounded-2xl bg-white/75 border border-[#c5a054]/40 shadow-sm flex items-center gap-3"
                >
                  {/* Thumbnail or Video Icon */}
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#efe4cc] border border-[#c5a054]/40 flex-shrink-0 flex items-center justify-center text-[#8a6825]">
                    {item.previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.previewUrl}
                        alt={item.fileName}
                        className="w-full h-full object-cover"
                      />
                    ) : item.isVideo ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M8 5.14v14l11-7-11-7z" />
                      </svg>
                    ) : (
                      <span className="text-base">✦</span>
                    )}
                  </div>

                  {/* File info + Progress bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-cormorant text-sm sm:text-base font-semibold text-[#3b2d22] truncate">
                        {item.fileName}
                      </p>
                      <span className="text-xs font-medium flex-shrink-0 text-[#7c6652]">
                        {item.status === "done" && (
                          <span className="text-[#5e7c3a] font-semibold">✓ Sent</span>
                        )}
                        {item.status === "uploading" && `${item.progress}%`}
                        {item.status === "preparing" && "Starting..."}
                        {item.status === "queued" && "Waiting..."}
                        {item.status === "error" && (
                          <span className="text-[#7e1d2c] font-semibold">Failed</span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span className="text-[11px] text-[#8c745f]">
                        {formatBytes(item.fileSize)}
                      </span>
                      {item.status === "error" && (
                        <button
                          type="button"
                          onClick={() => handleRetry(item)}
                          className="text-xs font-semibold text-[#8a6825] hover:text-[#5c4314] underline cursor-pointer"
                        >
                          Retry
                        </button>
                      )}
                    </div>

                    {/* Real-time progress bar */}
                    {item.status !== "error" ? (
                      <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#e8dcc4] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-200 ${item.status === "done"
                            ? "bg-[#6b8e46]"
                            : "bg-gradient-to-r from-[#9e772c] via-[#cda95a] to-[#b58e3e]"
                            }`}
                          style={{
                            width: `${item.status === "preparing"
                              ? 8
                              : item.status === "done"
                                ? 100
                                : item.progress
                              }%`,
                          }}
                        />
                      </div>
                    ) : (
                      <p className="mt-1 text-xs text-[#7e1d2c] leading-snug">
                        {item.error}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default PhotoUploadSection;
