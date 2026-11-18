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

/** The overlay must be gone this long after a takeover, whatever happens (see below). */
const SAFETY_MS = 2500;
/** Never wait longer than this for the hairline's CSS fill to report that it finished. */
const FILL_WAIT_CAP_MS = 900;

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Runs at most once per page load, whichever PreloaderExit copy gets here first. */
let started = false;

export async function runPreloaderExit() {
  if (started) return;
  started = true;
  const html = document.documentElement;
  const overlay = document.querySelector<HTMLElement>("[data-preloader]");
  if (!overlay || !html.classList.contains("preload")) return finish();

  // Is the fallback still waiting? Its CSS animation's currentTime counts from first render.
  // A page opened in a hidden tab doesn't take over either: browsers pause its animations,
  // so the CSS fallback simply plays once the tab is shown.
  const fallback = overlay.getAnimations().find((a) => (a as CSSAnimation).animationName?.includes("fallback"));
  const elapsed = Number(fallback?.currentTime ?? Infinity);
  if (document.hidden || !(elapsed < FALLBACK_DELAY_MS - TAKEOVER_MARGIN_MS)) {
    // Let the CSS fade end it, then clean up. Bounded: never wait on it indefinitely.
    if (fallback) await Promise.race([fallback.finished.catch(() => {}), delay(SAFETY_MS)]);
    return finish();
  }

  // Take over: cancel the CSS fallback, and set the hero's start states while it's covered.
  html.classList.add("preload-js");
  const hero = document.querySelector<HTMLElement>("[data-anim-section='hero']");
  const intro = hero && html.dataset.intro === "covered" ? createHeroIntro(hero) : null;
  let tl: gsap.core.Timeline | null = null;

  // Safety net: having cancelled the CSS fallback, this code now owns the overlay. If
  // animation frames stop (the tab is hidden mid-exit, the browser pauses CSS animations),
  // jump everything to its end state and remove the overlay. Timers keep running in hidden
  // tabs, so the page can never be left covered.
  setTimeout(() => {
    if (!html.classList.contains("preload")) return;
    if (tl) tl.progress(1);
    else intro?.progress(1);
    finish();
  }, SAFETY_MS);

  // Hold until the hairline has filled (never past the 1.2s ceiling), but never wait on the
  // CSS animation without a time limit: a paused animation would never report finishing.
  const line = overlay.querySelector<HTMLElement>("[data-preloader-line]");
  const fill = line?.getAnimations()[0];
  if (fill) await Promise.race([fill.finished.catch(() => {}), delay(FILL_WAIT_CAP_MS)]);

  const label = overlay.querySelector<HTMLElement>("[data-preloader-label]");
  tl = gsap.timeline({ defaults: { ease }, onComplete: finish });
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
