import type { ReactNode } from "react";
import styles from "./Section.module.scss";

type Props = {
  id: string;
  /** Small mono label above the title. */
  label: string;
  /** The H2 content (can hold an accent span or a descriptor). */
  title: ReactNode;
  /** Extra class on the <h2>, e.g. a larger display size. */
  titleClassName?: string;
  tone?: "dark" | "paper";
  className?: string;
  children: ReactNode;
};

/**
 * Every home section: a hairline on top, a mono label, then the display title.
 * tabIndex -1 lets nav anchors move keyboard focus here.
 */
export function Section({ id, label, title, titleClassName, tone = "dark", className, children }: Props) {
  const headingId = `${id}-title`;
  return (
    <section
      id={id}
      tabIndex={-1}
      aria-labelledby={headingId}
      data-anim-section={id}
      className={[styles.section, tone === "paper" && styles.paper, className].filter(Boolean).join(" ")}
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.label} data-anim="label">
            {label}
          </p>
          <h2
            id={headingId}
            className={[styles.title, titleClassName].filter(Boolean).join(" ")}
            data-anim="heading"
          >
            {title}
          </h2>
        </header>
        {children}
      </div>
    </section>
  );
}
