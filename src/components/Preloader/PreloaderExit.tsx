"use client";

// Tidies up after the first-visit preloader. The overlay's exit and the hero intro are pure
// CSS (Preloader.module.scss), so no animation library loads during page load (it added
// ~100-150 ms of blocking time on mobile). Once those CSS animations have finished, this
// removes the classes that drive them, and the page is left exactly as server-rendered.
// Renders nothing.

import { useEffect } from "react";

/** Never wait longer than this (ms after navigation start), e.g. in a hidden tab. */
const CAP_MS = 4000;

const isIntroAnimation = (a: Animation) => /preloader-|intro-/.test((a as CSSAnimation).animationName ?? "");

export function PreloaderExit() {
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("preload")) return;

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      html.classList.remove("preload");
      html.removeAttribute("data-intro");
    };

    const running = document.getAnimations().filter(isIntroAnimation);
    void Promise.all(running.map((a) => a.finished.catch(() => {}))).then(finish);
    const timer = window.setTimeout(finish, Math.max(0, CAP_MS - performance.now()));
    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
