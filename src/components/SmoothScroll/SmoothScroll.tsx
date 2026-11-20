"use client";

// One Lenis instance for the whole site, driven by the GSAP ticker so ScrollTrigger
// and smooth scrolling share one clock. Off under reduced motion or when the visitor switches
// motion off with the site toggle: native scroll only.
// Native touch scrolling is kept (syncTouch stays false).
//
// Lenis and GSAP load on the first scroll, tap or key press, or a few seconds after the page
// has settled, so they stay out of page load (LCP, TBT). Until then scrolling and anchors are native.

import type Lenis from "lenis";
import { useEffect } from "react";
import { whenIdle } from "@/animations/idle";
import { MOTION_EVENT, prefersReducedMotion } from "@/animations/media";

let lenis: Lenis | null = null;

/** The live Lenis instance, or null under reduced motion and before it loads. */
export const getLenis = () => lenis;

const headerOffset = () => {
  const root = getComputedStyle(document.documentElement);
  const value = root.getPropertyValue("--header-h").trim();
  const rem = parseFloat(root.fontSize) || 16;
  return (parseFloat(value) || 0) * (value.endsWith("rem") ? rem : 1);
};

/** Scroll to an element, smoothly when Lenis runs, then move keyboard focus to it. */
export function scrollToTarget(target: HTMLElement) {
  const focus = () => {
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };

  if (lenis) {
    lenis.scrollTo(target, { offset: -headerOffset(), onComplete: focus });
  } else {
    target.scrollIntoView({ block: "start" });
    focus();
  }
}

export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let stop = () => {};

    const start = async () => {
      if (lenis || prefersReducedMotion()) return;
      const [{ default: LenisClass }, { gsap, ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("@/animations/gsap"),
      ]);
      if (disposed || lenis || prefersReducedMotion()) return;

      const instance = new LenisClass({ autoRaf: false });
      const tick = (time: number) => instance.raf(time * 1000);
      instance.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      lenis = instance;

      stop = () => {
        gsap.ticker.remove(tick);
        instance.destroy();
        if (lenis === instance) lenis = null;
      };

      // Layout settles once the web fonts are in: recalculate every trigger.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    };

    const onPreferenceChange = () => {
      if (prefersReducedMotion()) stop();
      else void start();
    };

    // Same-page anchors ("#id" and "/#id" while on the home page) scroll with Lenis
    // and move focus to the section. Without JS they still jump natively.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href*='#']");
      if (!(link instanceof HTMLAnchorElement)) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      history.pushState(null, "", url.hash);
      scrollToTarget(target);
    };

    // Start on the first scroll-like interaction, or once the page has settled (a few seconds
    // after load, when idle), whichever comes first. Starting at the first idle moment put
    // GSAP's parse and setup (~50 KB) inside page load: ~100 ms more blocking time on mobile.
    const FIRST_INTERACTION = ["wheel", "touchstart", "pointerdown", "keydown", "scroll"] as const;
    const kick = () => {
      FIRST_INTERACTION.forEach((type) => window.removeEventListener(type, kick));
      void start();
    };
    FIRST_INTERACTION.forEach((type) => window.addEventListener(type, kick, { passive: true }));
    let cancelSettled = () => {};
    const settleTimer = window.setTimeout(() => (cancelSettled = whenIdle(kick)), 4000);
    const cancelIdle = () => {
      window.clearTimeout(settleTimer);
      cancelSettled();
      FIRST_INTERACTION.forEach((type) => window.removeEventListener(type, kick));
    };
    reduce.addEventListener("change", onPreferenceChange);
    window.addEventListener(MOTION_EVENT, onPreferenceChange);
    document.addEventListener("click", onClick);

    return () => {
      disposed = true;
      cancelIdle();
      reduce.removeEventListener("change", onPreferenceChange);
      window.removeEventListener(MOTION_EVENT, onPreferenceChange);
      document.removeEventListener("click", onClick);
      stop();
    };
  }, []);

  return null;
}
