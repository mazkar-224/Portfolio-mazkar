import { Button } from "@/components/Button/Button";
import { Hud } from "@/components/Hud/Hud";
import { hero } from "@/content";
import styles from "./Hero.module.scss";

// Static hero (Phase 4). The H1 is the LCP element: server-rendered and visible at
// first paint, never hidden waiting for JavaScript. No photo until a real one exists.
export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title" data-anim-section="hero">
      <div className={styles.inner}>
        <p className={styles.label} data-hero="label">
          {hero.location}
        </p>

        <h1 id="hero-title" className={styles.name}>
          {/* Shown as "M.Azkar" (his decision); screen readers and crawlers get the full name. */}
          <span aria-hidden="true" className={styles.nameText} data-hero="name">
            {hero.displayName}
          </span>
          <span className="visually-hidden">{hero.name}</span>
        </h1>

        <div className={styles.body}>
          <div className={styles.intro}>
            <p className={styles.title} data-hero="copy">
              {hero.title}
            </p>
            <p className={styles.description} data-hero="copy">
              {hero.description}
            </p>
          </div>

          <div className={styles.side}>
            <p className={styles.availability} data-hero="actions">
              {hero.availability}
            </p>
            <div className={styles.actions} data-hero="actions">
              <Button href={hero.primaryAction.href} variant="primary">
                {hero.primaryAction.label}
              </Button>
              {hero.secondaryActions.map((action) => (
                <Button
                  key={action.href}
                  href={action.href}
                  download={action.href.endsWith(".pdf") ? "" : undefined}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Hud items={hero.hud} className={styles.hud} />
      </div>
    </section>
  );
}
