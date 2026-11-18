// CloudCostGuard section. Beats, in scroll order:
//   "heading"  label and title (generic)
//   "meta"     metadata grid cells arrive left to right (generic stagger)
//   "shots"    both screenshots wipe in inside their frames (generic)
//   "log"      the four case-study blocks arrive one after another, like lines in a log
//   "diagram"  the architecture diagram draws itself (DrawSVG), then its labels appear
//
// The case-study steps are not pinned and scrubbed. A pinned scrub would hold text hidden
// for as long as the reader pauses mid-scroll, which CLAUDE.md's anti-slop list forbids
// ("no effect may hide content or delay it more than 1.2s").

import { durations, gsap } from "./gsap";
import { belowFold, ease, revealFade, revealGeneric, revealStart } from "./reveal";

/** The diagram draws: group outlines, then node boxes and edges, then the text fades in. */
function drawDiagram(scope: HTMLElement) {
  // Only the SVG laid out at this breakpoint (horizontal on desktop, vertical on phones).
  const svg = Array.from(scope.querySelectorAll<SVGSVGElement>("[data-anim='diagram'] svg")).find(
    (el) => el.getClientRects().length > 0,
  );
  if (!svg || !belowFold(svg)) return;

  const strokes = Array.from(svg.querySelectorAll<SVGElement>("[data-draw]"));
  const labels = Array.from(svg.querySelectorAll<SVGElement>("text"));
  const arrowheads = Array.from(svg.querySelectorAll<SVGElement>("marker path"));

  const tl = gsap.timeline({
    scrollTrigger: { trigger: svg, start: revealStart, once: true },
    defaults: { ease },
  });
  tl.addLabel("draw")
    .from(strokes, { drawSVG: "0%", duration: durations.reveal, stagger: 0.03 }, "draw")
    .addLabel("labels", "draw+=0.5")
    .from([...labels, ...arrowheads], { opacity: 0, duration: durations.small, stagger: 0.01 }, "labels");
}

export function cloudCostGuardSection(scope: HTMLElement) {
  revealGeneric(scope);

  const log = scope.querySelector<HTMLElement>("[data-anim='log']");
  if (log) revealFade(Array.from(log.children) as HTMLElement[], { stagger: 0.15 });

  drawDiagram(scope);
}
