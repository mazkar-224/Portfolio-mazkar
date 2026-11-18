"use client";

// Decides whether the CloudCostGuard screenshot gets the WebGL "signal from noise" effect, and
// loads it only when it can't cost anything (CLAUDE.md "WebGL / Three.js" 2 to 4):
// - desktop with a real mouse only (hover + fine pointer): parsing a 239 KB 3D library
//   mid-scroll would make phones stutter, and the pointer half of the effect needs a mouse
// - never under reduced motion, without WebGL, with Save-Data, or on low-powered machines
//   (under 4 CPU cores or under 4 GB of memory, where the browser reports them)
// - only after the visitor's first scroll, wheel, touch, click or key press (like the rest of
//   the animation code, so nothing loads during page load: measured, loading it at idle
//   raised mobile TBT from about 60 ms to 380-1,030 ms), then when the browser is idle and
//   the screenshot is within a screen and a half of the viewport
// - through next/dynamic with ssr: false, so Three.js is never in the initial bundle
// The static fallback is the real <img> already in the frame: same size, always there for
// screen readers and for anyone without the effect. The canvas is laid over it only after
// its first frame is drawn, so nothing shifts or flashes. Renders nothing on its own.

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { whenIdle } from "@/animations/idle";
import { queries } from "@/animations/media";
import styles from "./SignalShot.module.scss";

const SignalImage = dynamic(() => import("@/webgl/SignalImage"), { ssr: false });

type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

function canRunEffect() {
  if (window.matchMedia(queries.reduceMotion).matches) return false;
  if (!window.matchMedia(queries.finePointer).matches) return false;
  if (!("WebGL2RenderingContext" in window || "WebGLRenderingContext" in window)) return false;
  const nav = navigator as NavigatorHints;
  if (nav.connection?.saveData) return false;
  if (nav.hardwareConcurrency && nav.hardwareConcurrency < 4) return false;
  if (nav.deviceMemory && nav.deviceMemory < 4) return false;
  return true;
}

/** If WebGL fails at runtime, drop the canvas and keep the plain screenshot. */
class Fallback extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type Load = { src: string; reveal: boolean; pointer: boolean; host: HTMLElement };

export function SignalShot() {
  const marker = useRef<HTMLSpanElement>(null);
  const [load, setLoad] = useState<Load | null>(null);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const host = marker.current?.parentElement; // the frame's clip box
    const img = host?.querySelector("img");
    if (!host || !img || !canRunEffect()) return;

    // Tell the scroll reveals to leave this frame alone: the effect is its reveal.
    host.closest<HTMLElement>("[data-anim='frame']")?.setAttribute("data-webgl", "");

    let cancelIdle = () => {};
    let io: IntersectionObserver | null = null;
    const start = () => {
      io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          io?.disconnect();
          // Start the (lazy) screenshot download now, so the noise state can be ready
          // before the frame scrolls into view.
          img.loading = "eager";
          cancelIdle = whenIdle(() => {
            const begin = () =>
              setLoad({
                src: img.currentSrc || img.src,
                // Only resolve from noise if the visitor can't see the image yet.
                reveal: host.getBoundingClientRect().top > window.innerHeight,
                pointer: true, // canRunEffect() already required a real mouse
                host,
              });
            if (img.complete) begin();
            else img.addEventListener("load", begin, { once: true });
          });
        },
        { rootMargin: "150% 0px" },
      );
      io.observe(host);
    };

    // After load and after the first interaction, whichever comes last.
    const interactions = ["scroll", "wheel", "touchstart", "pointerdown", "keydown"] as const;
    let interacted = window.scrollY > 0;
    let loaded = document.readyState === "complete";
    let started = false;
    const maybeStart = () => {
      if (started || !interacted || !loaded) return;
      started = true;
      start();
    };
    const onInteract = () => {
      interacted = true;
      interactions.forEach((type) => window.removeEventListener(type, onInteract));
      maybeStart();
    };
    const onLoad = () => {
      loaded = true;
      maybeStart();
    };
    interactions.forEach((type) => window.addEventListener(type, onInteract, { passive: true }));
    if (!loaded) window.addEventListener("load", onLoad, { once: true });
    maybeStart();

    return () => {
      interactions.forEach((type) => window.removeEventListener(type, onInteract));
      window.removeEventListener("load", onLoad);
      io?.disconnect();
      cancelIdle();
    };
  }, []);

  return (
    <span ref={marker} className={styles.layer} data-ready={ready || undefined} aria-hidden="true">
      {load && (
        <Fallback>
          <SignalImage {...load} onReady={onReady} />
        </Fallback>
      )}
    </span>
  );
}
