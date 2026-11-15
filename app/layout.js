import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const sans = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "SWAN Beauty Essence | Cleanser + Facewash with Anti-Acne Beads",
  description:
    "SWAN Cleanser + Facewash with Anti-Acne Beads. A 2-in-1 formula with Vitamin D, Salicylic Acid and Glycolic Acid. Clear skin, confident you. Delivered across Pakistan.",
};

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#fdf8ee" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
