import { Chapter } from "@/components/Chapter/Chapter";
import { about, homeIds } from "@/content";
import { AboutTabs } from "./AboutTabs";
import styles from "./About.module.scss";

export function About() {
  return (
    <Chapter id={homeIds.about} index={about.index} label={about.label} aside={about.aside} title={about.title}>
      <div className={styles.grid}>
        <AboutTabs tabs={about.tabs} />
        <div className={styles.text} data-anim="fade">
          <p className={styles.lede}>{about.lede}</p>
          <p className={styles.body}>{about.body}</p>
          <a href={about.cv.href} className={styles.textLink} download="">
            {about.cv.label} <span aria-hidden="true">↓</span>
          </a>
          <ul className={styles.traits} role="list">
            {about.traits.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </Chapter>
  );
}
