// AI automation, the one light section. Beats:
//   "wipe"     the section wipes from void to paper, left to right (clip-path, 1.2s, once)
//   "heading"  label and title (generic)
//   "cards"    each workflow screenshot wipes in inside its frame; the text fades up (generic)
//
// The wipe starts when the section's top passes 90% of the viewport. At that point only
// the section's top padding is on screen (it is taller than 10% of the viewport at every
// breakpoint), so no text sits in the uncovered void. It plays in full once, never scrubbed.
//
// The slit-scan hover itself is CSS (Automation.module.scss); this file only gives the
// bands their image, on desktop and near the viewport.

import { durations, gsap, ScrollTrigger } from "./gsap";
import { queries } from "./media";
import { belowFold, ease, revealGeneric } from "./reveal";

/** How far each of the six bands starts out of line, as a share of the image width. */
const BAND_OFFSETS = ["5%", "-3%", "6%", "-5%", "3%", "-6%"];

/** Fill one card's slit-scan container with bands showing the card's own loaded image. */
function buildBands(slits: HTMLElement, img: HTMLImageElement) {
  if (slits.childElementCount > 0 || !img.currentSrc) return;
  slits.style.setProperty("--slit-img", `url("${img.currentSrc}")`);
  BAND_OFFSETS.forEach((offset, i) => {
    const band = document.createElement("span");
    band.style.setProperty("--b", String(i));
    band.style.setProperty("--off", offset);
    slits.append(band);
  });
}

/**
 * The slit-scan hover needs a real mouse, so bands are only built on such devices, once
 * a card is within a screen of the viewport and its image has loaded. They reuse the
 * image's own URL (already in the cache), so they add nothing to the page or the network.
 */
function armSlitScan(scope: HTMLElement) {
  if (!window.matchMedia(queries.finePointer).matches) return;
  for (const slits of Array.from(scope.querySelectorAll<HTMLElement>("[data-slits]"))) {
    const img = slits.parentElement?.querySelector("img");
    if (!img) continue;
    ScrollTrigger.create({
      trigger: slits,
      start: "top bottom+=100%",
      once: true,
      onEnter: () => {
        if (img.complete) buildBands(slits, img);
        else img.addEventListener("load", () => buildBands(slits, img), { once: true });
      },
    });
    // The bands stay if this context reverts: at rest they are invisible (opacity 0), and
    // their hover animation only exists under (prefers-reduced-motion: no-preference).
  }
}

export function automationSection(scope: HTMLElement) {
  if (belowFold(scope)) {
    gsap
      .timeline({ scrollTrigger: { trigger: scope, start: "top 90%", once: true } })
      .addLabel("wipe")
      .fromTo(
        scope,
        { clipPath: "inset(0% 100% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: durations.reveal, ease, clearProps: "clipPath" },
        "wipe",
      );
  }

  revealGeneric(scope);
  armSlitScan(scope);
}
