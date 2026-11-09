import React from "react";
import "@/components/PageLoader.css";

export default function Loading() {
  return (
    <div className="page-loader-overlay" aria-live="polite" dir="rtl">
      <div className="loader" role="status" aria-label="Loading..." />
      <p className="loader-text">
        صفحه در حال بارگذاری است...
      </p>
    </div>
  );
}
