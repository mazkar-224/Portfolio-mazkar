import type { Link } from "@/content";
import styles from "./LinkList.module.scss";

/** A row of proof links (repo, docs), mono, each with a small arrow. */
export function LinkList({ links, className }: { links: Link[]; className?: string }) {
  return (
    <ul className={[styles.list, className].filter(Boolean).join(" ")} role="list">
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href} className={styles.link} rel={link.external ? "noopener" : undefined}>
            <span>
              {link.label}
              {link.context && <span className="visually-hidden">: {link.context}</span>}
            </span>
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
