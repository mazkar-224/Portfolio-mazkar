import { nav, sectionIds, ui } from "@/content";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import styles from "./Header.module.scss";

// No logo, wordmark, initials or name here (CLAUDE.md rule 8).
// Left: the open-to-work status. Right: the nav on desktop, the menu button on phones.
export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href={`/#${sectionIds.contact}`} className={styles.status}>
          <span className={styles.dot} aria-hidden="true" />
          {ui.headerStatus}
        </a>

        <nav aria-label={ui.mainNavLabel} className={styles.desktopNav}>
          <NavLinks items={nav} listClassName={styles.list} linkClassName={styles.link} roll />
        </nav>

        {/* Without JavaScript the menu button can't open, so this jumps to the footer nav. */}
        <a href="#footer-nav" className={`${styles.menuFallback} no-js-only`}>
          {ui.menuOpen}
        </a>
        <MobileMenu items={nav} />
      </div>
    </header>
  );
}
