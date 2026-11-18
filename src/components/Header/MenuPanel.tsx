"use client";

// The animated panel of the phone menu. Loaded on demand (next/dynamic) the first time
// the menu opens, so Motion never ships in the first-load bundle.
// Motion's only job here: mount and unmount with AnimatePresence (LazyMotion + m).

import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import { useEffect, type RefObject } from "react";
import { hero } from "@/content/hero";
import type { Link } from "@/content/shared";
import { ui } from "@/content/ui";
import { NavLinks } from "./NavLinks";
import styles from "./MobileMenu.module.scss";

const ease = [0.22, 1, 0.36, 1] as const;

type Props = {
  open: boolean;
  panelId: string;
  items: Link[];
  panelRef: RefObject<HTMLDivElement | null>;
  onNavigate: (event: React.MouseEvent<HTMLAnchorElement>, item: Link) => void;
};

export default function MenuPanel({ open, panelId, items, panelRef, onNavigate }: Props) {
  // Focus the first link once the panel is in the DOM.
  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLElement>("a")?.focus();
  }, [open, panelRef]);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <AnimatePresence>
          {open && (
            <m.div
              ref={panelRef}
              id={panelId}
              className={styles.panel}
              role="dialog"
              aria-modal="true"
              aria-label={ui.menuDialogLabel}
              data-lenis-prevent
              initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
              exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
              transition={{ duration: 0.45, ease }}
            >
              <nav aria-label={ui.mainNavLabel}>
                <NavLinks
                  items={items}
                  listClassName={styles.list}
                  linkClassName={styles.link}
                  onNavigate={onNavigate}
                />
              </nav>
              <a href={hero.primaryAction.href} className={styles.email}>
                {hero.primaryAction.label}
              </a>
            </m.div>
          )}
        </AnimatePresence>
      </MotionConfig>
    </LazyMotion>
  );
}
