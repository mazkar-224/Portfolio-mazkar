import { Section } from "@/components/Section/Section";
import { education, sectionIds } from "@/content";
import styles from "./Education.module.scss";

// Section 7, compact: the degree, its period and grade, the two society roles, and the
// certifications. Copy from src/content/education.ts (landing-page-copy.md, word for word).
// The title is the copy's own line, "BS Computer Science, University of Peshawar".
export function Education() {
  const { degree } = education;

  return (
    <Section
      id={sectionIds.education}
      label={education.sectionLabel}
      titleClassName={styles.title}
      title={
        <>
          <span>{degree.name}</span>
          <span className="visually-hidden">, </span>
          <span className={styles.school}>{degree.school}</span>
        </>
      }
    >
      <div className={styles.layout}>
        <div className={styles.facts} data-anim="fade">
          <p className={styles.fact}>
            <time dateTime={degree.start}>{degree.start}</time> to <time dateTime={degree.end}>{degree.end}</time>
          </p>
          <p className={styles.fact}>{degree.grade}</p>
        </div>

        <div className={styles.main}>
          <ul className={styles.activities} role="list" data-anim="fade">
            {degree.activities.map((activity) => (
              <li key={activity} className={styles.activity}>
                {activity}
              </li>
            ))}
          </ul>

          <div className={styles.certs}>
            <h3 className={styles.certsLabel}>{education.certificationsLabel}</h3>
            <ul className={styles.certList} role="list" data-anim="stagger">
              {education.certifications.map((cert) => (
                <li key={cert} className={styles.cert}>
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
