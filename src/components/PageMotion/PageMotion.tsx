"use client";

// Starts the page's animations on the visitor's first interaction (scroll, wheel, touch,
// pointer press or key). Every effect on the page is scroll-triggered, so nothing needs to
// animate before then, and loading GSAP any earlier only added blocking time to page load
// (measured: TBT 40 ms -> 160 ms with an idle-time start). Renders nothing. Re-runs on every
// route change (/ and /services).
//
// If JavaScript never runs, nothing is ever hidden: every element keeps its server-rendered,
// fully visible state. Content already on screen when the code arrives is never hidden.

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const FIRST_INTERACTION = ["scroll", "wheel", "touchstart", "pointerdown", "keydown"] as const;

export function PageMotion() {
  const pathname = usePathname();

  useEffect(() => {
    let disposed = false;
    let started = false;
    let stop = () => {};

    const start = async () => {
      if (started) return;
      started = true;
      removeListeners();
      const { startPageMotion } = await import("@/animations/run");
      if (!disposed) stop = startPageMotion();
    };

    const removeListeners = () => {
      for (const type of FIRST_INTERACTION) window.removeEventListener(type, start);
    };

    for (const type of FIRST_INTERACTION) {
      window.addEventListener(type, start, { once: true, passive: true });
    }
    // Arrived already scrolled (a /#section link or a restored position): start now.
    if (window.scrollY > 0) void start();

    return () => {
      disposed = true;
      removeListeners();
      stop();
    };
  }, [pathname]);

  return null;
}
