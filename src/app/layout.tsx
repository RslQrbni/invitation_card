import type { Metadata } from "next";
import { Cinzel, Playfair_Display, Cormorant_Garamond, Inter, Pinyon_Script, Amiri } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Salsal & Shahmama — The Sacred Garden Wedding Invitation",
  description: "Royal Botanical Luxury Wedding Invitation for Salsal & Shahmama.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${playfair.variable} ${cormorant.variable} ${inter.variable} ${pinyon.variable} ${amiri.variable} h-full antialiased bg-[#F9F0E0]`}
    >
      <body className="min-h-full flex flex-col bg-[#F9F0E0] text-[#3b2d22]">
        {children}
      </body>
    </html>
  );
}

