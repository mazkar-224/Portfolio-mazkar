import { Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";

// Archivo and JetBrains Mono are self-hosted, trimmed to the axes and characters the site
// uses (see src/fonts/README.md): 88 KB -> 53 KB and 40 KB -> 13 KB. Only Archivo is
// preloaded, because it renders the hero heading and the hero text (the LCP elements).

// Variable: wdth 125 for display, 100 for body; wght 400 to 800.
export const archivo = localFont({
  src: "../fonts/archivo-latin-var.woff2",
  weight: "400 800",
  style: "normal",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  declarations: [{ prop: "font-stretch", value: "100% 125%" }],
  variable: "--font-archivo",
});

// Accent: one italic word per heading at most. Below the fold, so not preloaded.
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
  preload: false,
  adjustFontFallback: true,
  variable: "--font-instrument-serif",
});

// Labels, data and the HUD, weights 400 and 500.
// Fallback is a system monospace, not an adjusted Arial: monospace glyphs are ~0.6em wide
// like JetBrains Mono, so HUD lines wrap the same before and after the swap
// (the Arial fallback caused a 0.08 layout shift on throttled mobile).
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

export const fontVariables = [
  archivo.variable,
  instrumentSerif.variable,
  jetbrainsMono.variable,
].join(" ");
