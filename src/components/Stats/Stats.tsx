import { stats } from "@/content";
import styles from "./Stats.module.scss";

// The strip under the hero (reference site): big serif numbers with a red suffix. Real
// numbers only, each with its own context from the brief; nothing rounded or added together.
export function Stats() {
  return (
    <section className={styles.stats} aria-label="In numbers" data-anim-section="stats">
      <div className={styles.wrap}>
      <ul className={styles.list} role="list" data-anim="stagger">
        {stats.map((s) => (
          <li key={s.label} className={styles.item}>
            <p className={styles.value}>
              {s.value}
              {s.suffix && <span className={styles.suffix}>{s.suffix}</span>}
            </p>
            <p className={styles.label}>{s.label}</p>
          </li>
        ))}
      </ul>
      </div>
    </section>
  );
}
