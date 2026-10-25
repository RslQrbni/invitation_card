"use client";

import React, { useState } from "react";

interface RsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupleNames?: string;
  rsvpDeadline?: string;
}

export const RsvpModal: React.FC<RsvpModalProps> = ({
  isOpen,
  onClose,
  coupleNames = "Salsal & Shahmama",
  rsvpDeadline = "August 09, 2026",
}) => {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [guestCount, setGuestCount] = useState("1");
  const [song, setSong] = useState("");
  const [childrenInfo, setChildrenInfo] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitted(true);
  };

  const handleWhatsAppSend = () => {
    const statusText = attending === "yes" ? "Accepts with pleasure 🎉" : "Declines with regret 🕊️";
    const message = `*RSVP for ${coupleNames} Wedding*\n\n` +
      `*Name:* ${name}\n` +
      `*Attending:* ${statusText}\n` +
      (attending === "yes" ? `*Number of Guests:* ${guestCount}\n` : "") +
      (song ? `*Song Request:* ${song}\n` : "") +
      (childrenInfo ? `*Children:* ${childrenInfo}\n` : "");

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#fdf9f2] border border-[#d8ba72] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-[#f4ebd9] text-[#6a5140] hover:bg-[#e8ddcf] hover:text-[#3b2d22] transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#937100] font-semibold block mb-1">
                RSVP Confirmation
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#3b2d22] font-normal">
                Confirm Your Attendance
              </h3>
              <p className="text-xs sm:text-sm text-[#846f61] mt-1 font-serif italic">
                Please RSVP before {rsvpDeadline}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              {/* Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#6a5140] mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John & Sarah Doe"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/80 border border-[#d8ba72]/70 focus:border-[#B48C3D] focus:ring-1 focus:ring-[#B48C3D] outline-none text-[#3b2d22] text-sm placeholder:text-[#b49d8c]"
                />
              </div>

              {/* Attending Radio */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#6a5140] mb-2">
                  Will you be attending? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttending("yes")}
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 text-center ${attending === "yes"
                        ? "bg-[#B48C3D] border-[#B48C3D] text-white shadow-md shadow-[#B48C3D]/25"
                        : "bg-white/60 border-[#d8ba72]/60 text-[#6a5140] hover:bg-[#fbf4e8]"
                      }`}
                  >
                    ✨ Accepts with pleasure
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending("no")}
                    className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 text-center ${attending === "no"
                        ? "bg-[#5A0F1B] border-[#5A0F1B] text-white shadow-md shadow-[#5A0F1B]/25"
                        : "bg-white/60 border-[#d8ba72]/60 text-[#6a5140] hover:bg-[#fbf4e8]"
                      }`}
                  >
                    🕊️ Declines with regret
                  </button>
                </div>
              </div>

              {attending === "yes" && (
                <>
                  {/* Number of guests */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#6a5140] mb-1.5">
                      Number of Guests Attending
                    </label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-white/80 border border-[#d8ba72]/70 focus:border-[#B48C3D] outline-none text-[#3b2d22] text-sm"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5+">5+ Guests</option>
                    </select>
                  </div>

                  {/* Song request */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#6a5140] mb-1.5">
                      A Song That Gets You Dancing (Optional)
                    </label>
                    <input
                      type="text"
                      value={song}
                      onChange={(e) => setSong(e.target.value)}
                      placeholder="Share your favorite wedding track"
                      className="w-full px-4 py-2.5 rounded-lg bg-white/80 border border-[#d8ba72]/70 focus:border-[#B48C3D] outline-none text-[#3b2d22] text-sm placeholder:text-[#b49d8c]"
                    />
                  </div>

                  {/* Children info */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#6a5140] mb-1.5">
                      Children Attending (Names & Ages)
                    </label>
                    <input
                      type="text"
                      value={childrenInfo}
                      onChange={(e) => setChildrenInfo(e.target.value)}
                      placeholder="e.g. Liam (6), Sophia (3)"
                      className="w-full px-4 py-2.5 rounded-lg bg-white/80 border border-[#d8ba72]/70 focus:border-[#B48C3D] outline-none text-[#3b2d22] text-sm placeholder:text-[#b49d8c]"
                    />
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-[#9e762c] via-[#B48C3D] to-[#9e762c] text-white font-medium tracking-wide uppercase text-xs sm:text-sm shadow-[0_4px_16px_rgba(180,140,61,0.35)] hover:shadow-[0_6px_22px_rgba(180,140,61,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Submit RSVP
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#f4ebd9] flex items-center justify-center text-[#B48C3D] text-3xl">
              ✓
            </div>
            <h3 className="text-2xl font-serif text-[#3b2d22] mb-2">
              Thank You, {name}!
            </h3>
            <p className="text-sm text-[#846f61] mb-6 font-serif">
              {attending === "yes"
                ? `We are delighted to celebrate this sacred day with you!`
                : `Thank you for letting us know. You will be missed!`}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={handleWhatsAppSend}
                className="px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#20ba59] transition-colors shadow-md"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                </svg>
                Send via WhatsApp
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#f4ebd9] text-[#6a5140] text-xs font-semibold uppercase tracking-wider hover:bg-[#e8ddcf] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RsvpModal;
