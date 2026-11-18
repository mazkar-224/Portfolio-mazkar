"use client";

// Loads the preloader's GSAP exit (and the hero intro it hands into) as soon as the page
// hydrates, but only on a visit that shows the preloader. Every other visit loads nothing
// here. If this arrives too late, the CSS fallback has already ended the preloader and the
// exit module just tidies up. Renders nothing.

import { useEffect } from "react";

export function PreloaderExit() {
  useEffect(() => {
    if (!document.documentElement.classList.contains("preload")) return;
    let cancelled = false;
    void import("@/animations/preloader").then(({ runPreloaderExit }) => {
      if (!cancelled) runPreloaderExit();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
