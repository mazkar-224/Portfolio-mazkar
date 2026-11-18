import { CiBadge } from "@/components/CiBadge/CiBadge";
import { LiveClock } from "@/components/LiveClock/LiveClock";
import { NavLinks } from "@/components/Header/NavLinks";
import { contact, nav, person, ui } from "@/content";
import styles from "./Footer.module.scss";

// Repeats the live clock and the CI badge (CLAUDE.md page flow). No name or wordmark.
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.col}>
          <p className={styles.label}>{ui.footer.localTime}</p>
          <p className={styles.value}>
            <LiveClock className={styles.clock} /> {person.location.city},{" "}
            {person.location.timeZoneLabel}
          </p>
        </div>

        <div className={styles.col}>
          <p className={styles.label}>{ui.footer.ci}</p>
          <CiBadge />
        </div>

        <nav id="footer-nav" aria-label={ui.footerNavLabel} className={styles.col} tabIndex={-1}>
          <p className={styles.label}>{ui.footer.sections}</p>
          <NavLinks items={nav} listClassName={styles.list} linkClassName={styles.link} />
        </nav>

        <div className={styles.col}>
          <p className={styles.label}>{ui.footer.contact}</p>
          <ul className={styles.list} role="list">
            <li>
              <a href={contact.primaryAction.href} className={styles.link}>
                {contact.email}
              </a>
            </li>
            {contact.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.link} rel="noopener">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
