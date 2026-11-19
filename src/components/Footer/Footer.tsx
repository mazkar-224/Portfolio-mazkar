import { footerCopy, person, ui } from "@/content";
import styles from "./Footer.module.scss";

// The footer under every page, after the reference site: his name as a serif wordmark, the
// contact links with arrows, a round back-to-top button, then a thin row of small print.
export function Footer() {
  const year = 2026;
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <p className={styles.wordmark}>{person.name}.</p>
          <nav id="footer-nav" aria-label={ui.footerNavLabel} tabIndex={-1} className={styles.nav}>
            <ul className={styles.links} role="list">
              {footerCopy.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={styles.link}
                    rel={link.href.startsWith("http") ? "noopener" : undefined}
                    download={link.href.endsWith(".pdf") ? "" : undefined}
                  >
                    {link.label} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a href="#main" className={styles.up}>
            <span aria-hidden="true">↑</span>
            <span className="visually-hidden">{footerCopy.backToTop}</span>
          </a>
        </div>
        <div className={styles.bottom}>
          <p>
            © {year} {person.name}
          </p>
          <p className={styles.middle}>{person.jobTitle}</p>
          <p>
            {footerCopy.place} <span aria-hidden="true">↗</span> {footerCopy.reach}
          </p>
        </div>
      </div>
    </footer>
  );
}
