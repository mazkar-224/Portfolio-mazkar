// Shared reveal beats, used by every section factory. Rules (CLAUDE.md "Animation architecture"):
//   - Only transform, opacity and clip-path are animated.
//   - Content is never hidden before JavaScript runs: the server HTML is fully visible, and a
//     "from" state is applied only to elements that are still below the fold when this code
//     loads (on idle). Anything the visitor can already see is left exactly as it is.
//   - Every reveal plays once, never scrubbed, and finishes within 1.2s of starting, so no
//     effect can hold content hidden while the reader pauses.
//   - Called only inside a gsap.matchMedia() branch for (prefers-reduced-motion: no-preference).
//
// Markup hooks are data attributes, because CSS-module class names are hashed:
//   data-anim="label"    small mono label above a heading (fades with the heading)
//   data-anim="heading"  display heading: lines rise from a mask (SplitText)
//   data-anim="fade"     body text or a block: fades up 12px
//   data-anim="stagger"  a container whose children fade up one after another
//   data-anim="frame"    a crosshair Frame holding an image: clip-path wipe plus a slow scale

import { durations, gsap, ScrollTrigger, SplitText } from "./gsap";

/** The theme's --ease, cubic-bezier(0.22, 1, 0.36, 1), as a GSAP ease. */
export const ease = "expo.out";

/** Where a reveal starts: when the element's top passes 85% of the viewport height. */
export const revealStart = "top 85%";

/** True while the element is entirely below the viewport, so hiding it can't be seen. */
export function belowFold(el: Element) {
  return el.getBoundingClientRect().top > window.innerHeight;
}

const all = <T extends Element = HTMLElement>(scope: ParentNode, selector: string) =>
  Array.from(scope.querySelectorAll<T & HTMLElement>(selector));

// ---------------------------------------------------------------------------
// Headlines: rise line by line from a mask (y 100% to 0, 0.9s, stagger 0.08).
// ---------------------------------------------------------------------------

/**
 * Split a heading into masked lines and raise them when it scrolls in.
 *
 * Screen readers: a plain heading is split with aria "auto" (SplitText puts the original
 * text in aria-label and hides the pieces). A heading built from parts that include a
 * visually hidden joiner (": ", ", ") is split part by part with lines only and aria
 * "none", so the words stay in the DOM in reading order and are read as one sentence.
 *
 * autoSplit re-splits on resize and font loads; after the first play the new lines are
 * left in place instead of animating again.
 */
export function revealHeading(heading: HTMLElement, label?: HTMLElement | null) {
  if (!belowFold(heading)) return;

  const hasParts = heading.querySelector(".visually-hidden") !== null;
  const parts = hasParts
    ? Array.from(heading.children).filter(
        (child): child is HTMLElement =>
          child instanceof HTMLElement && !child.classList.contains("visually-hidden"),
      )
    : [heading];

  let played = false;
  const trigger = { trigger: heading, start: revealStart, once: true, onEnter: () => (played = true) };

  if (label && belowFold(label)) {
    gsap.from(label, { opacity: 0, duration: durations.small, ease, scrollTrigger: { ...trigger } });
  }

  for (const part of parts) {
    SplitText.create(part, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      aria: hasParts ? "none" : "auto",
      onSplit(self) {
        if (played) return;
        return gsap.from(self.lines, {
          yPercent: 100,
          duration: durations.heading,
          stagger: 0.08,
          ease,
          scrollTrigger: { ...trigger },
        });
      },
    });
  }
}

// ---------------------------------------------------------------------------
// Body text and blocks: fade up 12px. Never letter by letter.
// ---------------------------------------------------------------------------

export function revealFade(targets: HTMLElement[], { stagger = 0.08, delay = 0 } = {}) {
  const hidden = targets.filter(belowFold);
  if (hidden.length === 0) return;

  // One trigger per group, so items in the same row arrive together. Long groups get a
  // tighter stagger so the last item still lands within 1.2s.
  const each = hidden.length > 1 ? Math.min(stagger, durations.small / (hidden.length - 1)) : 0;
  gsap.from(hidden, {
    y: 12,
    opacity: 0,
    duration: durations.small,
    stagger: each,
    delay,
    ease,
    scrollTrigger: { trigger: hidden[0], start: revealStart, once: true },
  });
}

// ---------------------------------------------------------------------------
// Images: clip-path wipe inside the crosshair frame (1.2s), the image settling from 1.08.
// The frame's border and "+" marks stay put; only its contents are revealed.
// ---------------------------------------------------------------------------

export function revealFrame(frame: HTMLElement) {
  // A frame with the WebGL effect (data-webgl) gets that as its reveal instead.
  if (!belowFold(frame) || frame.hasAttribute("data-webgl")) return;
  const clip = frame.querySelector<HTMLElement>("[data-anim-clip]");
  if (!clip) return;
  const media = clip.querySelector<HTMLElement>("img, svg");

  const tl = gsap.timeline({
    scrollTrigger: { trigger: frame, start: revealStart, once: true },
    defaults: { duration: durations.reveal, ease },
  });
  tl.addLabel("wipe").fromTo(
    clip,
    { clipPath: "inset(0% 0% 100% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)", clearProps: "clipPath" },
    "wipe",
  );
  if (media) tl.from(media, { scale: 1.08, clearProps: "transform" }, "wipe");
}

// ---------------------------------------------------------------------------
// The generic pass every section gets: label + heading, fades, staggers and frames.
// Section factories call this, then add their own signature beats.
// ---------------------------------------------------------------------------

export function revealGeneric(scope: HTMLElement, { frames = true } = {}) {
  for (const heading of all(scope, "[data-anim='heading']")) {
    const label = heading.parentElement?.querySelector<HTMLElement>("[data-anim='label']");
    revealHeading(heading, label);
  }

  for (const el of all(scope, "[data-anim='fade']")) revealFade([el]);

  for (const group of all(scope, "[data-anim='stagger']")) {
    revealFade(Array.from(group.children) as HTMLElement[]);
  }

  if (frames) for (const frame of all(scope, "[data-anim='frame']")) revealFrame(frame);
}

/**
 * Recalculate every trigger once the web fonts are in (text reflows when they swap).
 * Images need no refresh: every next/image has explicit dimensions, so loading one
 * never moves the layout.
 */
export function refreshWhenFontsLoad() {
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
