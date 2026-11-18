import Image from "next/image";
import { Button } from "@/components/Button/Button";
import { Frame } from "@/components/Frame/Frame";
import { Section } from "@/components/Section/Section";
import { automation, sectionIds, type Workflow } from "@/content";
import styles from "./Automation.module.scss";

/** The repo folder name, read from the link itself (e.g. "01-lead-reactivation-engine"). */
const folderName = (href: string) => href.split("/").pop() ?? href;

// One workflow: its real screenshot, name, one-line description and repo folder.
// The whole card is clickable through the title link (stretched over the card), so there
// is one link per card and one tab stop.
function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const [image] = workflow.images;
  return (
    <li className={styles.card}>
      <Frame className={styles.frame}>
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt={image.alt}
          sizes="(min-width: 90rem) 44rem, (min-width: 48rem) 48vw, 100vw"
        />
        {/* Slit-scan hover: the animation code fills this with six bands of the same image. */}
        <span className={styles.slits} aria-hidden="true" data-slits />
      </Frame>
      <div className={styles.body} data-anim="fade">
        <h3 className={styles.name}>
          <a href={workflow.href} className={styles.link} rel="noopener">
            {workflow.name}
          </a>
        </h3>
        <p className={styles.description}>{workflow.description}</p>
        <p className={styles.folder}>
          <span>{folderName(workflow.href)}</span>
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </p>
      </div>
    </li>
  );
}

// Section 4, the one light section. Copy from src/content/automation.ts
// (landing-page-copy.md, word for word). The void-to-paper wipe is added in Phase 6.
export function Automation() {
  return (
    <Section
      id={sectionIds.automation}
      label={automation.sectionLabel}
      tone="paper"
      title={
        <>
          <span className={styles.accent}>{automation.headingParts.accent}</span>{" "}
          {automation.headingParts.rest}
        </>
      }
    >
      <div className={styles.intro} data-anim="fade">
        <p className={styles.lede}>{automation.intro}</p>
        <p className={styles.note}>{automation.repoNote}</p>
      </div>

      <ul className={styles.grid} role="list">
        {automation.workflows.map((workflow) => (
          <WorkflowCard key={workflow.id} workflow={workflow} />
        ))}
      </ul>

      <div className={styles.cta} data-anim="fade">
        <p className={styles.ctaLead}>{automation.cta.lead}</p>
        <Button href={automation.cta.link.href}>
          {automation.cta.link.label}
          <span className={styles.ctaArrow} aria-hidden="true">
            →
          </span>
        </Button>
      </div>
    </Section>
  );
}
