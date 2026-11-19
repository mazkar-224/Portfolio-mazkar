import Link from "next/link";
import { homeNav, mailto, person, ui } from "@/content";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import styles from "./Header.module.scss";

// The floating frosted pill nav (from the reference site): his name as a serif wordmark on the
// left, the section links, and a "Let's talk" pill on the right. Phones get the name and Menu.
export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.pill}>
        <Link href="/" className={styles.wordmark}>
          {person.name}
        </Link>

        <nav aria-label={ui.mainNavLabel} className={styles.desktopNav}>
          <NavLinks items={homeNav} listClassName={styles.list} linkClassName={styles.link} roll />
        </nav>

        <a href={mailto} className={styles.talk}>
          Let&apos;s talk <span aria-hidden="true">↗</span>
        </a>

        {/* Without JavaScript the menu button can't open, so this jumps to the footer nav. */}
        <a href="#footer-nav" className={`${styles.menuFallback} no-js-only`}>
          {ui.menuOpen}
        </a>
        <MobileMenu items={homeNav} />
      </div>
    </header>
  );
}
