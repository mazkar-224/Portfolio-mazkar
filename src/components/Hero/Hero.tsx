import Image from "next/image";
import { Scene3D } from "@/components/Scene3D/Scene3D";
import { heroCopy } from "@/content";
import styles from "./Hero.module.scss";

// The hero (redesign 2, after the reference site): pitch black with faint vertical lines, his
// black-and-white headshot centred at the top with the live engraving shader over it, side
// labels, a small mono line, the huge serif name, a two-line tagline and two actions.
// The name and the photo are in the server HTML and paint first.
export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title" data-anim-section="hero">
      <div className={styles.lines} aria-hidden="true" />

      <Scene3D kind="portrait" src="/images/me/azkar-headshot-bw.webp" className={styles.portrait}>
        <Image
          src="/images/me/azkar-headshot-bw.png"
          alt={heroCopy.portraitAlt}
          width={896}
          height={743}
          priority
          fetchPriority="high"
          sizes="(min-width: 64rem) 46rem, 94vw"
          className={styles.photo}
        />
        <span className={styles.dots} aria-hidden="true" />
      </Scene3D>

      <div className={styles.top} data-hero="label">
        <p className={styles.kicker}>
          <span className={styles.dot} aria-hidden="true" />
          {heroCopy.kicker}
        </p>
        <p className={styles.topRight}>{heroCopy.topRight}</p>
      </div>

      <div className={styles.side} data-hero="copy">
        <p className={styles.sideLabel}>{heroCopy.sideLabel}</p>
        <span className={styles.plus} aria-hidden="true">
          +
        </span>
        <ul className={styles.sideList} role="list">
          {heroCopy.sideList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className={styles.center}>
        <h1 id="hero-title" className={styles.name}>
          <span className={styles.nameText} data-hero="name">
            {heroCopy.first} <em>{heroCopy.last}</em>
          </span>
        </h1>
        <p className={styles.above} data-hero="copy">
          {heroCopy.above}
        </p>
        <p className={styles.line} data-hero="copy">
          {heroCopy.line}
        </p>
        <div className={styles.actions} data-hero="actions">
          <a href={heroCopy.primary.href} className={styles.primary} data-magnetic="">
            {heroCopy.primary.label} <span aria-hidden="true">↓</span>
          </a>
          <a href={heroCopy.secondary.href} className={styles.secondary}>
            {heroCopy.secondary.label} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div className={styles.bottom} data-hero="hud">
        <p className={styles.bottomItem}>
          <span className={styles.bar} aria-hidden="true" />
          {heroCopy.bottom[0]}
          <span aria-hidden="true">↓</span>
        </p>
        <p className={styles.bottomItem}>{heroCopy.bottom[1]}</p>
      </div>

    </section>
  );
}
