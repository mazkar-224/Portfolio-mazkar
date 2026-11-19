"use client";

// Decides when a 3D scene may load, so WebGL never costs page load:
// - never under reduced motion (or the site's motion toggle off), without WebGL, or with Save-Data
// - every device: only after the visitor's first interaction (mouse move, scroll, touch, key),
//   then after the load event, when the browser is idle (no WebGL work during page load)
// - and only while the scene's box is within one screen of the viewport; it unmounts again
//   when it's far away, so at most two or three WebGL contexts are ever alive

import { useEffect, useState, type RefObject } from "react";
import { whenIdle } from "@/animations/idle";
import { MOTION_EVENT, prefersReducedMotion } from "@/animations/media";
import { features } from "@/content/site";

type NavigatorHints = Navigator & { connection?: { saveData?: boolean } };

export function canRun3D() {
  if (typeof window === "undefined") return false;
  if (!features.webglEffect) return false; // the on/off switch in src/content/site.ts
  if (prefersReducedMotion()) return false; // system setting or the site's motion toggle
  if ((navigator as NavigatorHints).connection?.saveData) return false;
  if (!("WebGL2RenderingContext" in window || "WebGLRenderingContext" in window)) return false;
  return true;
}

let ready = false;
const waiters = new Set<() => void>();

/** Resolves once 3D may start at all (see the rules above). Shared by every scene. */
function onReady(cb: () => void) {
  if (ready) return cb();
  waiters.add(cb);
}

if (typeof window !== "undefined") {
  const release = () => {
    if (ready) return;
    ready = true;
    waiters.forEach((cb) => cb());
    waiters.clear();
  };
  // Every device waits for the visitor's first interaction (a mouse move counts, so on desktop
  // the effects appear almost at once), then for page load and an idle moment. Starting at
  // idle without that wait put Three.js parsing, shader compiles and the chrome reflection
  // maps inside page load (measured: TBT 1.0-10 s on mobile, 3.8 s on desktop).
  const events = ["pointermove", "scroll", "wheel", "touchstart", "pointerdown", "keydown"] as const;
  const afterLoad = () => whenIdle(release);
  const first = () => {
    events.forEach((type) => window.removeEventListener(type, first));
    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });
  };
  events.forEach((type) => window.addEventListener(type, first, { passive: true }));
}

/** True while the scene should be mounted. */
export function useSceneGate(box: RefObject<HTMLElement | null>, { margin = "100%" } = {}) {
  const [allowed, setAllowed] = useState(false);
  const [near, setNear] = useState(false);

  useEffect(() => {
    let alive = true;
    const check = () => {
      if (!canRun3D()) return setAllowed(false);
      onReady(() => alive && canRun3D() && setAllowed(true));
    };
    check();
    // The visitor can switch motion off (and on) at any time: unmount or remount the scene.
    window.addEventListener(MOTION_EVENT, check);
    return () => {
      alive = false;
      window.removeEventListener(MOTION_EVENT, check);
    };
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el || !allowed) return;
    const io = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: `${margin} 0px` });
    io.observe(el);
    return () => io.disconnect();
  }, [box, allowed, margin]);

  return allowed && near;
}
