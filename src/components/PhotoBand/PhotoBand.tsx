import Image from "next/image";
import { band } from "@/content";
import styles from "./PhotoBand.module.scss";

// A full-width photo of him with a serif statement over it (the reference's speaking photo).
export function PhotoBand() {
  return (
    <section className={styles.band} aria-labelledby="band-title" data-anim-section="band">
      <div className={styles.inner}>
        <p className={styles.label}>
          <span className={styles.square} aria-hidden="true" />
          {band.label}
        </p>
        <div className={styles.frame} data-anim="frame">
          <div className={styles.clip} data-anim-clip>
            <Image src="/images/me/azkar-field-band-bw.jpg" alt={band.alt} width={960} height={794} sizes="(min-width: 90rem) 90rem, 100vw" className={styles.photo} />
          </div>
          <div className={styles.overlay}>
            <p className={styles.kicker}>A different kind of signal</p>
            <h2 id="band-title" className={styles.title}>
              {band.title.plain}
              <br />
              <em>{band.title.italic}</em>
            </h2>
            <p className={styles.line}>{band.line}</p>
            <a href={band.cta.href} className={styles.cta}>
              {band.cta.label} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
