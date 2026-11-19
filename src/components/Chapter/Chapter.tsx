import type { ReactNode } from "react";
import styles from "./Chapter.module.scss";

type Props = {
  id: string;
  /** "02" etc.; omitted for interludes. */
  index?: string;
  label: string;
  aside?: string;
  title: { plain: string | readonly string[]; italic?: string };
  /** Text beside the title on wide screens. */
  side?: ReactNode;
  className?: string;
  children: ReactNode;
};

/**
 * One home chapter, in the reference site's pattern: a hairline, "■ 02 / LABEL" with a mono
 * aside on the right, then a large serif statement whose last line is italic.
 */
export function Chapter({ id, index, label, aside, title, side, className, children }: Props) {
  const lines = typeof title.plain === "string" ? [title.plain] : title.plain;
  return (
    <section id={id} tabIndex={-1} aria-labelledby={`${id}-title`} data-anim-section={id} className={[styles.chapter, className].filter(Boolean).join(" ")}>
      <div className={styles.inner}>
        <div className={styles.rule}>
          <p className={styles.label} data-anim="label">
            <span className={styles.square} aria-hidden="true" />
            {index ? `${index} / ` : ""}
            {label}
          </p>
          {aside && <p className={styles.aside}>{aside}</p>}
        </div>
        <div className={styles.head}>
          <h2 id={`${id}-title`} className={styles.title} data-anim="heading">
            {lines.map((line) => (
              <span key={line} className={styles.line}>
                {line}
              </span>
            ))}
            {title.italic && <em className={styles.line}>{title.italic}</em>}
          </h2>
          {side && (
            <div className={styles.side} data-anim="fade">
              {side}
            </div>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
