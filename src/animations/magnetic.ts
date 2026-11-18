// Magnetic primary buttons: desktop with a real mouse only (pointer: fine), called from a
// matchMedia branch that already excludes reduced motion. The real cursor is never hidden.
// gsap.quickTo keeps the pointer handler to two setter calls, which is cheap for INP.

import { gsap } from "./gsap";

/** How far the button follows the pointer, as a share of the pointer's offset. */
const PULL = 0.25;

/** Attaches the effect; returns a cleanup that removes the listeners and resets position. */
export function magnetic(buttons: Iterable<HTMLElement>) {
  const cleanups: Array<() => void> = [];

  for (const button of buttons) {
    const toX = gsap.quickTo(button, "x", { duration: 0.4, ease: "power3.out" });
    const toY = gsap.quickTo(button, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const box = button.getBoundingClientRect();
      toX((event.clientX - (box.left + box.width / 2)) * PULL);
      toY((event.clientY - (box.top + box.height / 2)) * PULL);
    };
    const onLeave = () => {
      toX(0);
      toY(0);
    };

    button.addEventListener("pointermove", onMove);
    button.addEventListener("pointerleave", onLeave);
    cleanups.push(() => {
      button.removeEventListener("pointermove", onMove);
      button.removeEventListener("pointerleave", onLeave);
      gsap.set(button, { clearProps: "transform" });
    });
  }

  return () => cleanups.forEach((cleanup) => cleanup());
}
