"use client";

// The reference site's "Motion on / off" switch, fixed bottom-right. Off stops smooth scroll,
// every GSAP animation, CSS transitions and the 3D effects; the choice is kept in this browser
// (localStorage) and applied before first paint by the boot script in app/layout.tsx.
// Hidden when the system already asks for reduced motion (motion is off and stays off).

import { useSyncExternalStore } from "react";
import { MOTION_EVENT, motionSwitchedOff } from "@/animations/media";
import styles from "./MotionToggle.module.scss";

const subscribe = (onChange: () => void) => {
  window.addEventListener(MOTION_EVENT, onChange);
  return () => window.removeEventListener(MOTION_EVENT, onChange);
};

export function MotionToggle() {
  const on = useSyncExternalStore(subscribe, () => !motionSwitchedOff(), () => true);

  const toggle = () => {
    const next = !on;
    const root = document.documentElement;
    if (next) root.removeAttribute("data-motion");
    else root.setAttribute("data-motion", "off");
    try {
      if (next) localStorage.removeItem("motion");
      else localStorage.setItem("motion", "off");
    } catch {
      // Storage blocked: the switch still works for this page view.
    }
    window.dispatchEvent(new Event(MOTION_EVENT));
  };

  return (
    <button type="button" className={styles.toggle} aria-pressed={on} onClick={toggle}>
      <span className={styles.icon} aria-hidden="true">
        {on ? "❚❚" : "▶"}
      </span>
      Motion {on ? "on" : "off"}
    </button>
  );
}
