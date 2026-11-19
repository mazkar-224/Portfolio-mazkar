import { Chapter } from "@/components/Chapter/Chapter";
import { approach, homeIds, skills } from "@/content";
import styles from "./Approach.module.scss";

// How I work (reference site's "How I work" + the Kernel One glass panels): numbered steps on
// the left, and an accordion of real skill groups on the right (native <details>, no JS needed).
export function Approach() {
  return (
    <Chapter id={homeIds.approach} index={approach.index} label={approach.label} aside={approach.aside} title={approach.title}>
      <div className={styles.grid}>
        <div className={styles.left} data-anim="fade">
          <p className={styles.sub}>{approach.sub}</p>
          <p className={styles.kicker}>DevOps &amp; automation</p>
          <ol className={styles.steps} role="list">
            {approach.steps.map((s, i) => (
              <li key={s} className={styles.step}>
                <span className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.stepText}>{s}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className={styles.accordion} data-anim="stagger">
          {skills.groups.map((g, i) => (
            <details key={g.id} className={styles.item} open={i === 0}>
              <summary className={styles.summary}>
                <span className={styles.summaryTag}>
                  {String(i + 1).padStart(2, "0")} / {g.items.length} tools
                </span>
                <span className={styles.summaryTitle}>{g.label}</span>
                <span className={styles.icon} aria-hidden="true" />
              </summary>
              <ul className={styles.chips} role="list">
                {g.items.map((item) => (
                  <li key={item} className={styles.chip}>
                    {item}
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>
    </Chapter>
  );
}
