// The preloader's exit, which hands straight into the hero intro (CLAUDE.md "Preloader" 4 and
// GSAP rule 4). Beats (labels on one timeline):
//   "hold"   the CSS hairline finishes filling (0.75s after first paint)
//   "exit"   the label fades up and away; the overlay's clip-path lifts off the page from the
//            top down, so the hero is uncovered first (0.5s, most of it in the first 0.25s)
//   "intro"  the hero master timeline (hero.ts) starts 0.1s into the exit
//
// Timing: the overlay is gone about 1.25s after first paint, and it never covers content
// that wasn't already painted (the page underneath rendered first).
// If this module arrives after the CSS fallback exit has begun (slow network, slow CPU), it
// does not take over: the fallback finishes on its own and the hero simply stays as painted.

import { gsap } from "./gsap";
import { createHeroIntro } from "./hero";
import { ease } from "./reveal";

/** The CSS fallback exit starts this long after the overlay first renders (Preloader.module.scss). */
const FALLBACK_DELAY_MS = 900;
/** Margin so the GSAP exit never collides with a fallback that is about to start. */
const TAKEOVER_MARGIN_MS = 120;

/** The overlay is gone: drop the classes that show it (it returns to display: none). */
function removeOverlay() {
  document.documentElement.classList.remove("preload", "preload-js");
}

/** Everything done, including the hero intro. */
function finish() {
  removeOverlay();
  document.documentElement.removeAttribute("data-intro");
}

export async function runPreloaderExit() {
  const html = document.documentElement;
  const overlay = document.querySelector<HTMLElement>("[data-preloader]");
  if (!overlay || !html.classList.contains("preload")) return finish();

  // Is the fallback still waiting? Its CSS animation's currentTime counts from first render.
  const fallback = overlay.getAnimations().find((a) => (a as CSSAnimation).animationName?.includes("fallback"));
  const elapsed = Number(fallback?.currentTime ?? Infinity);
  if (!(elapsed < FALLBACK_DELAY_MS - TAKEOVER_MARGIN_MS)) {
    // Too late to take over: let the CSS fade end it, then clean up.
    if (fallback) await fallback.finished.catch(() => {});
    return finish();
  }

  // Take over: cancel the CSS fallback, and set the hero's start states while it's covered.
  html.classList.add("preload-js");
  const hero = document.querySelector<HTMLElement>("[data-anim-section='hero']");
  const intro = hero && html.dataset.intro === "covered" ? createHeroIntro(hero) : null;

  // Hold until the hairline has filled (never past the 1.2s ceiling).
  const line = overlay.querySelector<HTMLElement>("[data-preloader-line]");
  const fill = line?.getAnimations()[0];
  if (fill) await fill.finished.catch(() => {});

  const label = overlay.querySelector<HTMLElement>("[data-preloader-label]");
  const tl = gsap.timeline({ defaults: { ease }, onComplete: finish });
  tl.addLabel("exit")
    .to(label, { y: -8, opacity: 0, duration: 0.3 }, "exit")
    .fromTo(
      overlay,
      { clipPath: "inset(0% 0% 0% 0%)" },
      { clipPath: "inset(100% 0% 0% 0%)", duration: 0.5, onComplete: removeOverlay },
      "exit",
    )
    .addLabel("intro", "exit+=0.1");
  if (intro) tl.add(intro.play(), "intro");
}
