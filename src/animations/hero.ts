// The hero intro: one master timeline. Beats (labels):
//   "label"    the location line fades in
//   "name"     "M.Azkar" rises from a mask (clip-path plus transform, 1.2s)
//   "copy"     the title line and the description fade up
//   "actions"  availability and the three buttons fade up
//   "hud"      the four HUD columns arrive left to right
//
// The LCP rule (CLAUDE.md): the hero is in the server HTML and visible at first paint, and
// it must never be hidden while JavaScript loads. Animation code arrives on idle, after
// the hero has painted, so replaying an intro then would hide visible text and flash.
// The intro therefore plays only behind the preloader (first visit per session): the boot
// script sets <html data-intro="covered">, and preloader.ts builds this timeline while the
// overlay still covers the page, then plays it as the overlay lifts. On every other visit
// the hero simply stays as painted.

import { durations, gsap } from "./gsap";
import { ease } from "./reveal";

const pick = (scope: HTMLElement, name: string) =>
  Array.from(scope.querySelectorAll<HTMLElement>(`[data-hero='${name}']`));

/** Builds the paused master timeline. The preloader (Phase 7) calls play() on it. */
export function createHeroIntro(scope: HTMLElement) {
  const tl = gsap.timeline({ paused: true, defaults: { ease, duration: durations.small } });

  tl.addLabel("label")
    .from(pick(scope, "label"), { opacity: 0 }, "label")
    .addLabel("name", "label+=0.1")
    .fromTo(
      pick(scope, "name"),
      { yPercent: 100, clipPath: "inset(0% 0% 100% 0%)" },
      { yPercent: 0, clipPath: "inset(0% 0% 0% 0%)", duration: durations.reveal, clearProps: "clipPath,transform" },
      "name",
    )
    .addLabel("copy", "name+=0.45")
    .from(pick(scope, "copy"), { y: 12, opacity: 0, stagger: 0.08 }, "copy")
    .addLabel("actions", "copy+=0.15")
    .from(pick(scope, "actions"), { y: 12, opacity: 0, stagger: 0.08 }, "actions")
    .addLabel("hud", "actions+=0.15")
    .from(pick(scope, "hud"), { y: 12, opacity: 0, stagger: 0.06 }, "hud");

  return tl;
}
