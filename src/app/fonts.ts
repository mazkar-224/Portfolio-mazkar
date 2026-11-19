import { Anton, DM_Sans, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";

// The redesign's type system (18 Nov 2026, after the reference review):
// - Instrument Serif (roman + italic): the name and section statements, with italic accent words
// - DM Sans: body text and UI
// - Anton: huge condensed uppercase words (the giant word behind the portrait, the contact close)
// - JetBrains Mono: small uppercase labels, HUD values
// Instrument Serif is preloaded: the hero name is set in it.

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  variable: "--font-instrument-serif",
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  variable: "--font-dm-sans",
});

export const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  adjustFontFallback: true,
  variable: "--font-anton",
});

// Labels, data and the HUD, weights 400 and 500 (self-hosted, trimmed: see src/fonts/README.md).
export const jetbrainsMono = localFont({
  src: "../fonts/jetbrains-mono-latin-var.woff2",
  weight: "400 500",
  style: "normal",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "Liberation Mono", "monospace"],
  variable: "--font-jetbrains-mono",
});

export const fontVariables = [instrumentSerif.variable, dmSans.variable, anton.variable, jetbrainsMono.variable].join(" ");
