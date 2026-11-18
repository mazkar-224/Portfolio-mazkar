import { Section } from "@/components/Section/Section";
import { sectionIds, skills } from "@/content";
import styles from "./Skills.module.scss";

// Section 6: the four evidence groups from the brief, as plain mono lists.
// No bars, percentages, ratings or logos. Copy from src/content/skills.ts (word for word).
export function Skills() {
  return (
    <Section id={sectionIds.skills} label={skills.sectionLabel} title={skills.heading}>
      <div className={styles.groups} data-anim="stagger">
        {/* Plain divs, not <section>: four extra landmark regions would only add noise. */}
        {skills.groups.map((group) => (
          <div key={group.id} className={styles.group}>
            <h3 className={styles.label}>{group.label}</h3>
            <ul className={styles.items} role="list">
              {group.items.map((item) => (
                <li key={item} className={styles.item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
