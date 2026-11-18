"use client";

// Media queries shared by gsap.matchMedia(), Lenis and Motion, plus a reduced-motion hook.

import { useSyncExternalStore } from "react";

export const queries = {
  reduceMotion: "(prefers-reduced-motion: reduce)",
  okMotion: "(prefers-reduced-motion: no-preference)",
  /** Desktop layout, where pinned and scrubbed sequences are allowed. */
  desktop: "(min-width: 64rem)",
  /** A real mouse: magnetic buttons and cursor effects only here. */
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;

/**
 * Conditions object for gsap.matchMedia().add(conditions, (ctx) => ...).
 * Read ctx.conditions.reduceMotion etc. inside the callback.
 */
export const motionConditions = {
  reduceMotion: queries.reduceMotion,
  okMotion: queries.okMotion,
  desktop: queries.desktop,
  finePointer: queries.finePointer,
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(queries.reduceMotion).matches;

const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(queries.reduceMotion);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

/**
 * True when the visitor asked for reduced motion. On the server it returns true,
 * so nothing animates before the browser has answered.
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => true);
}
