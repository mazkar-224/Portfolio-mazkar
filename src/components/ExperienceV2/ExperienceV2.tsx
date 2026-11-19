import { Chapter } from "@/components/Chapter/Chapter";
import { experienceCopy, homeIds } from "@/content";
import styles from "./ExperienceV2.module.scss";

export function ExperienceV2() {
  const r = experienceCopy.role;
  return (
    <Chapter
      id={homeIds.experience}
      index={experienceCopy.index}
      label={experienceCopy.label}
      aside={experienceCopy.aside}
      title={{ plain: `${r.title},`, italic: r.company }}
    >
      <div className={styles.grid}>
        <div className={styles.facts} data-anim="fade">
          <p className={styles.period}>
            <time dateTime={r.start}>{r.period}</time>
          </p>
          <p className={styles.where}>{r.where}</p>
          {r.links.map((l) => (
            <a key={l.href} href={l.href} rel="noopener" className={styles.link}>
              {l.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
        <ol className={styles.timeline} role="list">
          {r.highlights.map((h) => (
            <li key={h} className={styles.entry} data-anim="fade">
              <span className={styles.dot} aria-hidden="true" />
              <p>{h}</p>
            </li>
          ))}
        </ol>
      </div>
    </Chapter>
  );
}
