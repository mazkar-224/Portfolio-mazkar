import Image from "next/image";
import { CiBadge } from "@/components/CiBadge/CiBadge";
import { Frame } from "@/components/Frame/Frame";
import { LinkList } from "@/components/LinkList/LinkList";
import { NeedsMarker } from "@/components/NeedsMarker/NeedsMarker";
import { Section } from "@/components/Section/Section";
import { cloudCostGuard as ccg, features, isNeeds, sectionIds, type CaseStudyBlock } from "@/content";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { SignalShot } from "./SignalShot";
import styles from "./CloudCostGuard.module.scss";

function Block({ block, children }: { block: CaseStudyBlock; children?: React.ReactNode }) {
  return (
    <div className={styles.block}>
      <h3 className={styles.blockTitle}>{block.heading}</h3>
      <p className={styles.text}>{block.body}</p>
      {children}
    </div>
  );
}

// Section 2. Copy from src/content/cloudcostguard.ts (landing-page-copy.md, word for word).
export function CloudCostGuard() {
  const [main, emptyState] = ccg.screenshots;

  return (
    <Section
      id={sectionIds.cloudCostGuard}
      label={ccg.context}
      titleClassName={styles.title}
      title={
        <>
          <span className={styles.name}>{ccg.headingParts.name}</span>
          <span className="visually-hidden">: </span>
          <span className={styles.descriptor}>{ccg.headingParts.descriptor}</span>
        </>
      }
    >
      <dl className={styles.meta} data-anim="stagger">
        {ccg.meta.map((item) => (
          <div key={item.label} className={styles.metaItem}>
            <dt className={styles.metaLabel}>{item.label}</dt>
            <dd className={styles.metaValue}>{item.value}</dd>
          </div>
        ))}
      </dl>

      <div className={styles.media}>
        {/* The walkthrough video goes here once it exists; until then, the screenshots. */}
        {isNeeds(ccg.video) && <NeedsMarker gap={ccg.video} className={styles.needs} />}
        <Frame className={styles.mainShot}>
          <Image
            src={main.src}
            width={main.width}
            height={main.height}
            alt={main.alt}
            sizes="(min-width: 90rem) 90rem, 100vw"
          />
          {/* Phase 8: the "signal from noise" WebGL layer, desktop-class devices only. */}
          {features.webglEffect && <SignalShot />}
        </Frame>
      </div>

      <div className={styles.introRow}>
        <p className={styles.intro} data-anim="fade">
          {ccg.intro}
        </p>
        <Frame className={styles.sideShot}>
          <Image
            src={emptyState.src}
            width={emptyState.width}
            height={emptyState.height}
            alt={emptyState.alt}
            sizes="(min-width: 90rem) 36rem, (min-width: 64rem) 40vw, 100vw"
          />
        </Frame>
      </div>

      <div className={styles.blocks} data-anim="log">
        <Block block={ccg.built} />
        <Block block={ccg.shipped}>
          <CiBadge />
        </Block>
        <Block block={ccg.fixed} />
        <Block block={ccg.next} />
      </div>

      <ArchitectureDiagram />

      <div className={styles.footer} data-anim="fade">
        <p className={styles.offline}>{ccg.offlineNote}</p>
        <LinkList links={ccg.links} />
      </div>
    </Section>
  );
}
