"use client";

import React from "react";
import Link from "next/link";

export default function ButterflyTestPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#88CEFF]">
      <iframe
        src="/test-butterfly.html"
        title="Butterfly Effect Test"
        className="w-full h-full border-none block"
      />
    </div>
  );
}

