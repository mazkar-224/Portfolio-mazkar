import { close, homeIds } from "@/content";
import styles from "./Close.module.scss";

// The last chapter, after the reference site: label row, a red-dot kicker, a huge serif line
// ending in italic, an underlined "Let's connect" mail link and one short paragraph.
export function Close() {
  const id = homeIds.contact;
  return (
    <section id={id} tabIndex={-1} aria-labelledby={`${id}-title`} data-anim-section={id} className={styles.close}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.rule}>
          <p className={styles.label} data-anim="label">
            <span className={styles.square} aria-hidden="true" />
            {close.index} / {close.label}
          </p>
          <p className={styles.aside}>{close.aside}</p>
        </div>

        <p className={styles.kicker} data-anim="fade">
          <span className={styles.dot} aria-hidden="true" />
          {close.kicker}
        </p>
        <h2 id={`${id}-title`} className={styles.title} data-anim="heading">
          <span className={styles.line}>{close.title.plain}</span>
          <span className={styles.line}>
            {close.title.rest} <em>{close.title.italic}</em>
          </span>
        </h2>

        <a href={close.primary.href} className={styles.connect} data-anim="fade">
          {close.primary.label} <span aria-hidden="true">↗</span>
        </a>
        <p className={styles.body} data-anim="fade">
          {close.body}
        </p>
        <p className={styles.email} data-anim="fade">
          <a href={close.primary.href}>{close.email}</a>
        </p>
      </div>
    </section>
  );
}
