"use client";

// The nav list. Client only to mark the current page with aria-current.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import type { Link as NavItem } from "@/content/shared";
import styles from "./NavLinks.module.scss";

type Props = {
  items: NavItem[];
  listClassName?: string;
  linkClassName?: string;
  onNavigate?: (event: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => void;
  /** Letter roll on hover and keyboard focus (desktop header only). Pure CSS. */
  roll?: boolean;
};

/** Desktop with a real mouse and motion allowed: the only place the letter roll runs. */
const ROLL_QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

const subscribeRoll = (onChange: () => void) => {
  const mq = window.matchMedia(ROLL_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

/**
 * False on the server and during hydration, so the server HTML carries plain labels (the
 * per-letter spans in the HTML cost 0.2s of simulated mobile FCP). After hydration it
 * switches to the letter markup only where the roll can actually be seen.
 */
const useRoll = () =>
  useSyncExternalStore(subscribeRoll, () => window.matchMedia(ROLL_QUERY).matches, () => false);

/**
 * The label split into letters, each with a copy of itself just below (drawn by ::after).
 * On hover or focus every letter slides up one line, 15ms after the one before it.
 * Screen readers get the plain label; the letters are aria-hidden.
 */
function Roll({ label }: { label: string }) {
  return (
    <>
      <span className={styles.roll} aria-hidden="true">
        {Array.from(label).map((char, i) => {
          const glyph = char === " " ? "\u00a0" : char;
          return (
            <span key={i} className={styles.char} data-char={glyph} style={{ "--i": i } as React.CSSProperties}>
              {glyph}
            </span>
          );
        })}
      </span>
      <span className="visually-hidden">{label}</span>
    </>
  );
}

export function NavLinks({ items, listClassName, linkClassName, onNavigate, roll = false }: Props) {
  const pathname = usePathname();
  const canRoll = useRoll();

  return (
    <ul className={listClassName} role="list">
      {items.map((item) => {
        const isPage = !item.href.includes("#");
        const current = isPage && pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={linkClassName}
              aria-current={current ? "page" : undefined}
              onClick={onNavigate ? (event) => onNavigate(event, item) : undefined}
            >
              {roll && canRoll ? <Roll label={item.label} /> : item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
