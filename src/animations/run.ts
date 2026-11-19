// Entry point for all page animation, loaded on idle by <PageMotion /> (never in the
// first-load bundle). It finds each section on the current page and runs its factory
// inside one gsap.matchMedia() context, scoped to that section.
//
// Why not useGSAP() in each component: importing GSAP into a component puts it in the
// first-load JavaScript (it was 240 KB before Phase 4 moved it to idle; now 179 KB).
// gsap.matchMedia() + gsap.context() give the same guarantees useGSAP() wraps: every
// tween is scoped, and revert() undoes all of them (route change, unmount, or the
// reduced-motion setting switching on).

import { experienceSection } from "./experience";
import { gsap } from "./gsap";
import { magnetic } from "./magnetic";
import { motionConditions } from "./media";
import { refreshWhenFontsLoad, revealGeneric } from "./reveal";

type Factory = (scope: HTMLElement) => void;

/**
 * One factory per section (data-anim-section="<id>"). Others get the generic reveals.
 * The hero has none here: its intro is driven by the preloader (preloader.ts), and it is
 * never hidden on scroll.
 */
const noop: Factory = () => {};
const factories: Record<string, Factory> = {
  hero: noop,
  experience: experienceSection,
};

/** Let the browser handle input and paint between sections (no long tasks). */
const yieldToMain = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

export function startPageMotion() {
  const mm = gsap.matchMedia();

  mm.add(motionConditions, (context) => {
    const { okMotion, finePointer } = context.conditions as Record<keyof typeof motionConditions, boolean>;
    // Reduced motion: no smooth scroll, parallax, scrubbing or split text. Content is
    // simply there, exactly as server-rendered.
    if (!okMotion) return;

    // Sections are set up one per task, so setup never blocks scrolling or input. Each
    // section gets its own gsap.context, kept here and reverted with this branch.
    const contexts: gsap.Context[] = [];
    let cancelled = false;

    void (async () => {
      for (const section of Array.from(document.querySelectorAll<HTMLElement>("[data-anim-section]"))) {
        await yieldToMain();
        if (cancelled) return;
        const factory = factories[section.dataset.animSection ?? ""] ?? revealGeneric;
        contexts.push(gsap.context(() => factory(section), section));
      }
      refreshWhenFontsLoad();
    })();

    const stopMagnetic = finePointer
      ? magnetic(document.querySelectorAll<HTMLElement>("[data-magnetic]"))
      : () => {};

    // Runs when this matchMedia branch reverts (route change, unmount, setting change).
    return () => {
      cancelled = true;
      contexts.forEach((ctx) => ctx.revert());
      stopMagnetic();
    };
  });

  return () => mm.revert();
}
