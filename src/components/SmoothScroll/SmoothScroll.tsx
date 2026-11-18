"use client";

// One Lenis instance for the whole site, driven by the GSAP ticker so ScrollTrigger
// and smooth scrolling share one clock. Off under reduced motion: native scroll only.
// Native touch scrolling is kept (syncTouch stays false).
//
// Lenis and GSAP load after first paint, when the browser is idle, so they stay out of
// the first-load bundle (LCP, TBT). Until then scrolling and anchors are native.

import type Lenis from "lenis";
import { useEffect } from "react";
import { whenIdle } from "@/animations/idle";
import { queries } from "@/animations/media";

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
    const reduce = window.matchMedia(queries.reduceMotion);
    let disposed = false;
    let stop = () => {};

    const start = async () => {
      if (lenis || reduce.matches) return;
      const [{ default: LenisClass }, { gsap, ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("@/animations/gsap"),
      ]);
      if (disposed || lenis || reduce.matches) return;

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
      if (reduce.matches) stop();
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

    const cancelIdle = whenIdle(() => void start());
    reduce.addEventListener("change", onPreferenceChange);
    document.addEventListener("click", onClick);

    return () => {
      disposed = true;
      cancelIdle();
      reduce.removeEventListener("change", onPreferenceChange);
      document.removeEventListener("click", onClick);
      stop();
    };
  }, []);

  return null;
}
