"use client";

// Phone and tablet menu: the button, state, scroll lock and keyboard handling.
// The animated panel (Motion) is a separate chunk loaded on first use; hovering or
// focusing the button starts the download early.
// Keyboard: Escape closes, Tab stays inside the open menu, focus returns to the button.

import dynamic from "next/dynamic";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { getLenis, scrollToTarget } from "@/components/SmoothScroll/SmoothScroll";
import type { Link } from "@/content/shared";
import { ui } from "@/content/ui";
import styles from "./MobileMenu.module.scss";

const loadPanel = () => import("./MenuPanel");
const MenuPanel = dynamic(loadPanel, { ssr: false });
const preloadPanel = () => void loadPanel();

export function MobileMenu({ items }: { items: Link[] }) {
  const [open, setOpen] = useState(false);
  const [panelWanted, setPanelWanted] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef(true);

  const close = useCallback((restoreFocus = true) => {
    returnFocus.current = restoreFocus;
    setOpen(false);
  }, []);

  // Lock page scroll while open; restore focus to the button when closed.
  const wasOpen = useRef(false);
  useEffect(() => {
    const root = document.documentElement;
    if (open) {
      wasOpen.current = true;
      root.classList.add("menu-open");
      getLenis()?.stop();
      return;
    }
    // Nothing to undo on the first render, and never steal focus on page load.
    if (!wasOpen.current) return;
    wasOpen.current = false;
    root.classList.remove("menu-open");
    getLenis()?.start();
    if (returnFocus.current) buttonRef.current?.focus({ preventScroll: true });
  }, [open]);

  // Close if the viewport grows past the breakpoint where the desktop nav shows.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onChange = () => desktop.matches && setOpen(false);
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab" || !panelRef.current || !buttonRef.current) return;
    // Focus cycles through the menu button and the links in the panel.
    const focusables = [
      buttonRef.current,
      ...panelRef.current.querySelectorAll<HTMLElement>("a[href]"),
    ];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  // Same-page section links: close first, then scroll once the page can scroll again.
  const onNavigate = (event: React.MouseEvent<HTMLAnchorElement>, item: Link) => {
    const url = new URL(item.href, location.href);
    const target =
      url.pathname === location.pathname && url.hash
        ? document.getElementById(url.hash.slice(1))
        : null;
    if (!target) {
      close(false);
      return;
    }
    event.preventDefault();
    close(false);
    history.pushState(null, "", url.hash);
    requestAnimationFrame(() => scrollToTarget(target));
  };

  return (
    <div className={`${styles.root} js-only`} onKeyDown={open ? onKeyDown : undefined}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={panelId}
        onPointerEnter={preloadPanel}
        onFocus={preloadPanel}
        onClick={() => {
          if (open) return close();
          setPanelWanted(true);
          setOpen(true);
        }}
      >
        {open ? ui.menuClose : ui.menuOpen}
      </button>

      {panelWanted && (
        <MenuPanel
          open={open}
          panelId={panelId}
          items={items}
          panelRef={panelRef}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}
