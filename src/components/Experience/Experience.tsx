import { LinkList } from "@/components/LinkList/LinkList";
import { Section } from "@/components/Section/Section";
import { experience, sectionIds } from "@/content";
import styles from "./Experience.module.scss";

// Section 3: the FlyRank AI internship as a vertical timeline.
// Copy from src/content/experience.ts (landing-page-copy.md, word for word).
export function Experience() {
  const [role] = experience.roles;

  return (
    <Section
      id={sectionIds.experience}
      label={experience.sectionLabel}
      titleClassName={styles.title}
      title={
        <>
          <span className={styles.role}>{role.title},</span>{" "}
          <span className={styles.company}>{role.company}</span>
        </>
      }
    >
      <div className={styles.layout}>
        <div className={styles.facts} data-anim="fade">
          <p className={styles.fact}>{role.where}</p>
          <p className={styles.fact}>{role.period}</p>
          <LinkList links={role.links} className={styles.links} />
        </div>

        <ol className={styles.timeline} role="list">
          {/* The hairline is its own element so it can draw down (scaleY) on scroll. */}
          <li className={styles.line} aria-hidden="true" data-anim="line" />
          {role.highlights.map((text) => (
            <li key={text} className={styles.entry} data-anim="entry">
              <span className={styles.marker} aria-hidden="true" />
              <p className={styles.text}>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
