"use client";

// Loads the preloader's GSAP exit (and the hero intro it hands into), only on a visit that
// shows the preloader. Every other visit loads nothing here. Renders nothing.
//
// Two copies exist, and exactly one runs:
// - in the root layout ("layout"): runs on pages without a hero (/services), overlay exit only
// - inside the hero ("hero"): runs once the hero itself has hydrated, so the intro's GSAP
//   styles are never applied to markup React hasn't hydrated yet (that caused a hydration
//   mismatch when the layout started the intro before the page segment had hydrated)
// If this arrives too late, the CSS fallback has already ended the preloader and the exit
// module just tidies up.

import { useEffect } from "react";

export function PreloaderExit({ owner }: { owner: "layout" | "hero" }) {
  useEffect(() => {
    if (!document.documentElement.classList.contains("preload")) return;
    // The layout copy steps aside when the page has a hero: the hero's copy runs instead.
    if (owner === "layout" && document.querySelector("[data-anim-section='hero']")) return;
    let cancelled = false;
    void import("@/animations/preloader").then(({ runPreloaderExit }) => {
      if (!cancelled) runPreloaderExit();
    });
    return () => {
      cancelled = true;
    };
  }, [owner]);

  return null;
}
