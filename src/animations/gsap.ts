// The one place GSAP plugins are registered. Every component imports gsap from here,
// never from "gsap" directly, so plugins are registered exactly once.
// Import only from client components ("use client").

import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin);

  // The theme's --ease, cubic-bezier(0.22, 1, 0.36, 1), is close to expo.out.
  // Durations follow CLAUDE.md: 0.6s small, 0.9s headlines, 1.2s big reveals.
  gsap.defaults({ ease: "expo.out", duration: 0.6 });
}

/** Named durations in seconds, matching --duration-* in _tokens.scss. */
export const durations = {
  micro: 0.2,
  small: 0.6,
  heading: 0.9,
  reveal: 1.2,
} as const;

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP };
