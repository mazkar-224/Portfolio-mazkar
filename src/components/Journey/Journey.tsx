import { Chapter } from "@/components/Chapter/Chapter";
import { education, homeIds, journey } from "@/content";
import styles from "./Journey.module.scss";

// "Started with code. Kept asking why." The real story from the brief, dated as written there,
// with the degree and certifications underneath.
export function Journey() {
  return (
    <Chapter id={homeIds.journey} label={journey.label} aside={journey.aside} title={journey.title}>
      <div className={styles.grid}>
        <ol className={styles.steps} role="list">
          {journey.steps.map((s) => (
            <li key={s.when} className={styles.step} data-anim="fade">
              <span className={styles.dot} aria-hidden="true" />
              <p className={styles.when}>{s.when}</p>
              <h3 className={styles.title}>{s.title}</h3>
              <p className={styles.body}>{s.body}</p>
            </li>
          ))}
        </ol>
        <aside className={styles.edu} data-anim="fade" aria-label={education.sectionLabel}>
          <div className={styles.card}>
            <p className={styles.cardLabel}>Education</p>
            <p className={styles.degree}>{education.degree.name}</p>
            <p className={styles.school}>
              {education.degree.school} · {education.degree.period}
            </p>
            <p className={styles.grade}>{education.degree.grade}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>{education.certificationsLabel}</p>
            <ul className={styles.certs} role="list">
              {education.certifications.map((c) => (
                <li key={c}>
                  <span aria-hidden="true">✦</span> {c}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </Chapter>
  );
}
