import { Fragment } from "react";
import { LinkList } from "@/components/LinkList/LinkList";
import { Section } from "@/components/Section/Section";
import { awsWork, sectionIds } from "@/content";
import styles from "./AwsWork.module.scss";

/** Renders `backtick` spans in a content string as <code>. */
function withCode(text: string) {
  return text.split(/(`[^`]+`)/).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code key={i} className={styles.code}>
        {part.slice(1, -1)}
      </code>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

// Section 5: the resource tracker and the static EC2 site. The VPC design stays on the CV.
// Copy from src/content/aws.ts (landing-page-copy.md, word for word).
export function AwsWork() {
  return (
    <Section id={sectionIds.aws} label={awsWork.sectionLabel} title={awsWork.heading}>
      <ul className={styles.list} role="list" data-anim="stagger">
        {awsWork.projects.map((project) => (
          <li key={project.id} className={styles.item}>
            <h3 className={styles.name}>{project.name}</h3>
            <p className={styles.text}>{withCode(project.description)}</p>
            <LinkList links={[project.link]} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
