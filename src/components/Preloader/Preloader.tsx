import { ui } from "@/content";
import { PreloaderExit } from "./PreloaderExit";
import styles from "./Preloader.module.scss";

/**
 * The first-visit preloader (CLAUDE.md "Preloader"): plain HTML and CSS, in the server HTML.
 * - It's an overlay on a page that is already fully rendered and painted underneath; it never
 *   delays or hides the HTML below it (the hero still paints first, so LCP is unaffected).
 * - Shown only when the boot script in app/layout.tsx put "preload" on <html>: first visit
 *   per session, motion allowed, JavaScript running. Otherwise it is display: none.
 * - One mono line and a 1px --signal hairline filling left to right. No logo, no name.
 * - CSS alone runs the exit and the hero intro behind it (no animation library on first load),
 *   so it ends on time even if JavaScript is slow or fails. PreloaderExit only tidies up.
 * - aria-hidden: decorative; screen readers read the page underneath from the start.
 */
export function Preloader() {
  return (
    <div className={styles.preloader} aria-hidden="true" data-preloader>
      <div className={styles.inner}>
        <p className={styles.label} data-preloader-label>
          {ui.preloaderLabel}
        </p>
        <span className={styles.track}>
          <span className={styles.line} data-preloader-line />
        </span>
      </div>
      <PreloaderExit />
    </div>
  );
}
