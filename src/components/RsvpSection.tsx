"use client";

import React, { useState, useEffect } from "react";

interface RsvpSectionProps {
  className?: string;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({ className = "" }) => {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<"yes" | "no" | null>("yes");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Load saved RSVP from localStorage if exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wedding_rsvp_response");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) {
          setName(parsed.name);
          setAttendance(parsed.attendance || "yes");
          setMessage(parsed.message || "");
          setIsSubmitted(true);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("لطفاً نام و نام خانوادگی خود را وارد کنید");
      return;
    }
    if (!attendance) {
      setErrorMessage("لطفاً وضعیت حضور خود را مشخص نمایید");
      return;
    }

    setErrorMessage("");
    const responseData = {
      name: name.trim(),
      attendance,
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("wedding_rsvp_response", JSON.stringify(responseData));
    } catch {
      // Ignore
    }

    setIsSubmitted(true);
  };

  const handleEdit = () => {
    setIsSubmitted(false);
  };

  const handleWhatsAppSend = () => {
    const statusText =
      attendance === "yes"
        ? "بله با کمال میل می‌آیم 🎉"
        : "نه متاسفانه نمیتوانم 🕊️";

    const text =
      `*اعلام حضور در جشن عروسی*\n\n` +
      `*نام و نام خانوادگی:* ${name}\n` +
      `*وضعیت حضور:* ${statusText}\n` +
      (message ? `*پیام تبریک:* ${message}\n` : "");

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section
      className={`relative z-20 w-full max-w-[480px] mx-auto px-4 ${className}`}
      dir="rtl"
    >
      <div className="relative w-full">
        {/* Form Title & Subtitle */}
        <div className="text-center pb-5">
          <h2
            className="font-amiri text-2xl sm:text-3xl font-bold text-[#8a6825] leading-relaxed select-none"
            style={{
              textShadow:
                "0 1px 2px rgba(255,255,255,0.85), 0 2px 6px rgba(180,140,61,0.2)",
            }}
          >
            فرم اعلام حضور
          </h2>
          <p className="font-amiri text-sm sm:text-base text-[#6b5847] mt-1.5 leading-relaxed select-none">
            خوشحال میشویم با حضورتان جشن مارا کامل کنید
          </p>

          {/* Golden Divider */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#c5a054]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#c5a054]" />
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#c5a054]" />
          </div>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            {/* 1. Name Input */}
            <div className="space-y-1.5">
              <label className="block font-amiri text-sm sm:text-base font-bold text-[#5a4636]">
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="لطفاً نام و نام خانوادگی خود را وارد کنید..."
                className="w-full px-4 py-3 rounded-xl bg-white/95 border border-[#c5a054]/60 text-[#3b2d22] font-amiri text-sm sm:text-base placeholder:text-[#a89889] focus:outline-none focus:border-[#b58e3e] focus:ring-2 focus:ring-[#b58e3e]/25 transition-all shadow-sm"
              />
            </div>

            {/* 2. Attendance Radio Group */}
            <div className="space-y-2 pt-1">
              <label className="block font-amiri text-sm sm:text-base font-bold text-[#5a4636]">
                آیا در مراسم حضور دارید؟
              </label>

              <div className="grid grid-cols-1 gap-2.5">
                {/* Yes Option */}
                <label
                  onClick={() => setAttendance("yes")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none ${attendance === "yes"
                    ? "bg-[#b58e3e]/15 border-[#b58e3e] shadow-sm text-[#3b2d22]"
                    : "bg-white/80 border-[#c5a054]/40 hover:bg-[#fbf4e8] text-[#5a4636]"
                    }`}
                >
                  <input
                    type="radio"
                    name="attendance"
                    value="yes"
                    checked={attendance === "yes"}
                    onChange={() => setAttendance("yes")}
                    className="w-4 h-4 text-[#b58e3e] accent-[#b58e3e] cursor-pointer"
                  />
                  <span className="font-amiri text-sm sm:text-base font-semibold">
                    بله با کمال میل می‌آیم
                  </span>
                </label>

                {/* No Option */}
                <label
                  onClick={() => setAttendance("no")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none ${attendance === "no"
                    ? "bg-[#5A0F1B]/10 border-[#5A0F1B]/80 shadow-sm text-[#3b2d22]"
                    : "bg-white/80 border-[#c5a054]/40 hover:bg-[#fbf4e8] text-[#5a4636]"
                    }`}
                >
                  <input
                    type="radio"
                    name="attendance"
                    value="no"
                    checked={attendance === "no"}
                    onChange={() => setAttendance("no")}
                    className="w-4 h-4 text-[#5A0F1B] accent-[#5A0F1B] cursor-pointer"
                  />
                  <span className="font-amiri text-sm sm:text-base font-semibold">
                    نه متاسفانه نمیتوانم
                  </span>
                </label>
              </div>
            </div>

            {/* 3. Greeting Message Textarea */}
            <div className="space-y-1.5 pt-1">
              <label className="block font-amiri text-sm sm:text-base font-bold text-[#5a4636]">
                پیام تبریک
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="پیام یا دعای خیر خود را برای عروس و داماد بنویسید..."
                className="w-full px-4 py-3 rounded-xl bg-white/95 border border-[#c5a054]/60 text-[#3b2d22] font-amiri text-sm sm:text-base placeholder:text-[#a89889] focus:outline-none focus:border-[#b58e3e] focus:ring-2 focus:ring-[#b58e3e]/25 transition-all resize-none shadow-sm"
              />
            </div>

            {errorMessage && (
              <p className="font-amiri text-xs sm:text-sm text-[#b22222] font-medium text-center">
                {errorMessage}
              </p>
            )}

            {/* 4. Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#9e762c] via-[#b58e3e] to-[#9e762c] hover:from-[#b58e3e] hover:to-[#8a6825] text-[#fdfaf3] font-amiri text-base sm:text-lg font-bold tracking-wide shadow-[0_4px_18px_rgba(180,140,61,0.4)] hover:shadow-[0_6px_24px_rgba(180,140,61,0.55)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer select-none"
              >
                ثبت و ارسال پاسخ
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation Success View */
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#b58e3e]/15 border-2 border-[#b58e3e] flex items-center justify-center text-[#8a6825] text-2xl shadow-sm">
              ✓
            </div>

            <div className="space-y-1">
              <h3 className="font-amiri text-xl sm:text-2xl font-bold text-[#3b2d22]">
                پاسخ شما با موفقیت ثبت شد
              </h3>
              <p className="font-amiri text-sm sm:text-base text-[#6b5847]">
                {name} عزیز، از اینکه پاسخ دادید سپاسگزاریم ✨
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 border border-[#c5a054]/40 text-sm font-amiri space-y-1.5 text-right">
              <p className="text-[#5a4636]">
                <strong className="text-[#8a6825]">وضعیت حضور:</strong>{" "}
                {attendance === "yes" ? "بله با کمال میل می‌آیم" : "نه متاسفانه نمیتوانم"}
              </p>
              {message && (
                <p className="text-[#5a4636]">
                  <strong className="text-[#8a6825]">پیام تبریک:</strong> {message}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2 justify-center">
              <button
                type="button"
                onClick={handleWhatsAppSend}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-amiri text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer select-none"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                </svg>
                <span>ارسال در واتس‌اپ</span>
              </button>

              <button
                type="button"
                onClick={handleEdit}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#f4ebd9] hover:bg-[#e8ddcf] text-[#6a5140] font-amiri text-sm font-medium border border-[#c5a054]/50 transition-colors cursor-pointer select-none"
              >
                ویرایش پاسخ
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RsvpSection;
