// Professional experience. Beats:
//   "heading"  label and title (generic)
//   "line"     the timeline hairline draws down as the reader scrolls through it
//   "entries"  each highlight fades up as it arrives
//
// The hairline is the one scrubbed effect on the site. It is decorative (aria-hidden) and
// hides no content: the entries reveal on their own triggers.

import { gsap } from "./gsap";
import { belowFold, revealFade, revealGeneric } from "./reveal";

export function experienceSection(scope: HTMLElement) {
  revealGeneric(scope);

  const line = scope.querySelector<HTMLElement>("[data-anim='line']");
  if (line && belowFold(line)) {
    gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: line, start: "top 80%", end: "bottom 60%", scrub: 0.6 },
      },
    );
  }

  for (const entry of Array.from(scope.querySelectorAll<HTMLElement>("[data-anim='entry']"))) {
    revealFade([entry]);
  }
}
