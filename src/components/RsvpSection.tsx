"use client";

import React, { useState, useEffect } from "react";

export interface RsvpSectionProps {
  className?: string;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({ className = "" }) => {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"Yes" | "No">("Yes");
  const [guests, setGuests] = useState<number>(1);
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Load previously saved RSVP from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wedding_rsvp_response");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) {
          setName(parsed.name);
          setAttending(parsed.attending === "No" ? "No" : "Yes");
          setGuests(typeof parsed.guests === "number" ? parsed.guests : 1);
          setMessage(parsed.message || "");
          setIsSubmitted(true);
        }
      }
    } catch {
      // Ignore localStorage issues
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage("لطفاً نام و نام خانوادگی خود را وارد کنید");
      return;
    }

    if (!attending) {
      setErrorMessage("لطفاً وضعیت حضور خود را مشخص نمایید");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          attending,
          guests: attending === "Yes" ? guests : 0,
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error || "خطا در ارسال پاسخ. لطفاً دوباره تلاش کنید."
        );
      }

      // Persist to local storage for returning visitor
      try {
        localStorage.setItem(
          "wedding_rsvp_response",
          JSON.stringify({
            name: trimmedName,
            attending,
            guests: attending === "Yes" ? guests : 0,
            message: message.trim(),
            submittedAt: new Date().toISOString(),
          })
        );
      } catch {
        // Ignore localStorage quota errors
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "خطا در برقراری ارتباط با سرور. لطفاً دوباره تلاش فرمایید.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetOrEdit = () => {
    setIsSubmitted(false);
    setErrorMessage("");
  };

  return (
    <section
      aria-label="اعلام حضور در جشن"
      className={`relative z-20 w-full max-w-[500px] mx-auto px-4 ${className}`}
      dir="rtl"
    >
      <div className="relative w-full rounded-3xl bg-[#fdfaf3]/95 backdrop-blur-sm border-2 border-[#c5a054]/40 shadow-[0_16px_36px_rgba(70,50,30,0.14)] p-6 sm:p-8 text-right">
        {/* ========================================================
            HEADER (Persian)
            ======================================================== */}
        <div className="text-center pb-5 select-none">
          {/* Decorative Gold Flourish */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-10 sm:w-14 h-[1px] bg-gradient-to-r from-transparent to-[#c5a054]" />
            <span className="text-[#b58e3e] text-xs">✦</span>
            <span className="w-10 sm:w-14 h-[1px] bg-gradient-to-l from-transparent to-[#c5a054]" />
          </div>

          <h2
            className="font-amiri text-2xl sm:text-3xl font-bold text-[#8a6825] leading-relaxed select-none"
            style={{
              textShadow:
                "0 1px 2px rgba(255,255,255,0.9), 0 2px 6px rgba(180,140,61,0.25)",
            }}
          >
            فرم اعلام حضور
          </h2>

          <p className="font-amiri text-sm sm:text-base text-[#6b5847] mt-1 leading-relaxed select-none">
            خوشحال می‌شویم با حضورتان جشن ما را کامل کنید
          </p>
        </div>

        {/* ========================================================
            FORM STATE: NOT SUBMITTED
            ======================================================== */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Full Name Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="rsvp-name"
                className="block font-amiri text-sm sm:text-base font-bold text-[#4a392b]"
              >
                نام و نام خانوادگی <span className="text-[#b58e3e]">*</span>
              </label>
              <input
                id="rsvp-name"
                type="text"
                required
                disabled={isSubmitting}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="لطفاً نام و نام خانوادگی خود را وارد کنید..."
                className="w-full px-4 py-3 rounded-2xl bg-white/95 border border-[#c5a054]/50 text-[#3b2d22] font-amiri text-sm sm:text-base placeholder:text-[#a89889] focus:outline-none focus:border-[#b58e3e] focus:ring-2 focus:ring-[#b58e3e]/30 transition-all shadow-inner disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* 2. Attendance Status */}
            <div className="space-y-2 pt-1">
              <label className="block font-amiri text-sm sm:text-base font-bold text-[#4a392b]">
                آیا در مراسم حضور دارید؟ <span className="text-[#b58e3e]">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1: Yes */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setAttending("Yes")}
                  className={`relative flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none ${
                    attending === "Yes"
                      ? "bg-gradient-to-b from-[#fbf4e5] to-[#f4ecd8] border-[#b58e3e] shadow-[0_4px_14px_rgba(181,142,62,0.25)] text-[#3b2d22]"
                      : "bg-white/80 border-[#c5a054]/30 hover:bg-[#faf4e8] text-[#6b5847] hover:border-[#c5a054]/60"
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                      attending === "Yes"
                        ? "border-[#b58e3e] bg-[#b58e3e]"
                        : "border-[#a89889] bg-transparent"
                    }`}
                  >
                    {attending === "Yes" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                    )}
                  </span>
                  <span className="font-amiri font-bold text-sm sm:text-base">
                    بله، با کمال میل می‌آیم
                  </span>
                </button>

                {/* Option 2: No */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setAttending("No")}
                  className={`relative flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none ${
                    attending === "No"
                      ? "bg-gradient-to-b from-[#f9ecee] to-[#f4e1e4] border-[#8a2538] shadow-[0_4px_14px_rgba(138,37,56,0.18)] text-[#3b2d22]"
                      : "bg-white/80 border-[#c5a054]/30 hover:bg-[#faf4e8] text-[#6b5847] hover:border-[#c5a054]/60"
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                      attending === "No"
                        ? "border-[#8a2538] bg-[#8a2538]"
                        : "border-[#a89889] bg-transparent"
                    }`}
                  >
                    {attending === "No" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                    )}
                  </span>
                  <span className="font-amiri font-bold text-sm sm:text-base">
                    نه، متأسفانه نمی‌توانم
                  </span>
                </button>
              </div>
            </div>

            {/* 3. Number of Guests (Only shown when attending === "Yes") */}
            {attending === "Yes" && (
              <div className="space-y-1.5 pt-1 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="rsvp-guests"
                    className="block font-amiri text-sm sm:text-base font-bold text-[#4a392b]"
                  >
                    تعداد نفرات همراه (شامل خودتان)
                  </label>
                  <span className="font-amiri text-xs text-[#8c745f]">
                    حداکثر ۱۰ نفر
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 p-2 rounded-2xl bg-white/95 border border-[#c5a054]/50 shadow-inner">
                  {/* Minus button */}
                  <button
                    type="button"
                    disabled={isSubmitting || guests <= 1}
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    className="w-10 h-10 rounded-xl bg-[#f4ecd8] hover:bg-[#e8dcbf] text-[#6b5133] font-bold text-lg flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none"
                    aria-label="کاهش تعداد مهمانان"
                  >
                    −
                  </button>

                  <div className="flex flex-col items-center">
                    <span className="font-amiri text-xl font-bold text-[#3b2d22]">
                      {guests} نفر
                    </span>
                  </div>

                  {/* Plus button */}
                  <button
                    type="button"
                    disabled={isSubmitting || guests >= 10}
                    onClick={() => setGuests((g) => Math.min(10, g + 1))}
                    className="w-10 h-10 rounded-xl bg-[#f4ecd8] hover:bg-[#e8dcbf] text-[#6b5133] font-bold text-lg flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none"
                    aria-label="افزایش تعداد مهمانان"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* 4. Wishes / Message for the Bride & Groom */}
            <div className="space-y-1.5 pt-1">
              <label
                htmlFor="rsvp-message"
                className="block font-amiri text-sm sm:text-base font-bold text-[#4a392b]"
              >
                پیام تبریک و دعای خیر
              </label>
              <textarea
                id="rsvp-message"
                rows={3}
                disabled={isSubmitting}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1500}
                placeholder="پیام یا دعای خیر خود را برای عروس و داماد بنویسید..."
                className="w-full px-4 py-3 rounded-2xl bg-white/95 border border-[#c5a054]/50 text-[#3b2d22] font-amiri text-sm sm:text-base placeholder:text-[#a89889] focus:outline-none focus:border-[#b58e3e] focus:ring-2 focus:ring-[#b58e3e]/30 transition-all resize-none shadow-inner disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Error Notification Alert */}
            {errorMessage && (
              <div
                role="alert"
                className="p-3.5 rounded-2xl bg-[#5A0F1B]/10 border border-[#5A0F1B]/30 text-[#6d1322] font-amiri text-sm text-center flex items-center justify-center gap-2"
              >
                <span>⚠</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#8a6825] via-[#b58e3e] to-[#8a6825] hover:from-[#9c762c] hover:via-[#c59d48] hover:to-[#9c762c] text-[#fdfaf3] font-amiri text-base sm:text-lg font-bold tracking-wide shadow-[0_4px_18px_rgba(180,140,61,0.4)] hover:shadow-[0_6px_24px_rgba(180,140,61,0.55)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer select-none flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>در حال ارسال...</span>
                  </>
                ) : (
                  <span>ثبت و ارسال پاسخ</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* ========================================================
              CONFIRMATION SUCCESS CARD (Persian)
              ======================================================== */
          <div className="text-center py-4 space-y-5 animate-fadeIn">
            {/* Elegant Checkmark Badge */}
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-b from-[#fbf4e5] to-[#f4ecd8] border-2 border-[#b58e3e] flex items-center justify-center text-[#8a6825] text-2xl shadow-[0_4px_16px_rgba(181,142,62,0.25)]">
              ✓
            </div>

            {/* Persian Heading */}
            <div>
              <h2
                className="font-amiri text-2xl sm:text-3xl font-bold text-[#8a6825] leading-tight select-none"
                style={{
                  textShadow:
                    "0 1px 2px rgba(255,255,255,0.9), 0 2px 8px rgba(180,140,61,0.25)",
                }}
              >
                پاسخ شما با موفقیت ثبت شد
              </h2>
              <p className="font-amiri text-base sm:text-lg text-[#5a432b] mt-1.5 font-medium">
                {name} عزیز، از اینکه پاسخ دادید سپاسگزاریم
              </p>
            </div>

            {/* Tailored Confirmation Message in Amiri */}
            <div className="max-w-md mx-auto space-y-2">
              {attending === "Yes" ? (
                <p className="font-amiri text-base sm:text-lg text-[#6b5847] leading-relaxed">
                  از اینکه در این شب خاطره‌انگیز کنار ما خواهید بود بی‌نهایت خوشحالیم ✨
                </p>
              ) : (
                <p className="font-amiri text-base sm:text-lg text-[#6b5847] leading-relaxed">
                  جای شما در این جشن بسیار خالی خواهد بود؛ از پیام پرمهر و دعای خیرتان صمیمانه سپاسگزاریم 🕊️
                </p>
              )}
            </div>

            {/* Response Summary Card */}
            <div className="p-4 rounded-2xl bg-white/90 border border-[#c5a054]/40 text-sm font-amiri space-y-2 text-right shadow-sm">
              <div className="flex items-center justify-between border-b border-[#c5a054]/20 pb-2">
                <span className="text-[#7c6652]">وضعیت حضور:</span>
                <span className="font-bold text-[#8a6825]">
                  {attending === "Yes" ? "بله، با کمال میل می‌آیم" : "نه، متأسفانه نمی‌توانم"}
                </span>
              </div>

              {attending === "Yes" && (
                <div className="flex items-center justify-between border-b border-[#c5a054]/20 pb-2">
                  <span className="text-[#7c6652]">تعداد مهمانان:</span>
                  <span className="font-bold text-[#8a6825]">{guests} نفر</span>
                </div>
              )}

              {message && (
                <div className="pt-1">
                  <span className="text-[#7c6652] block text-xs mb-1">پیام شما:</span>
                  <p className="text-[#4a392b] bg-[#fbf8f0] p-2.5 rounded-xl border border-[#c5a054]/25 leading-relaxed">
                    «{message}»
                  </p>
                </div>
              )}
            </div>

            {/* Action Button: Send Another Response */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleResetOrEdit}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#f4ecd8] hover:bg-[#ebdcc0] text-[#6a5140] font-amiri text-sm font-medium border border-[#c5a054]/50 transition-colors cursor-pointer select-none"
              >
                ویرایش یا ارسال پاسخ جدید
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RsvpSection;
