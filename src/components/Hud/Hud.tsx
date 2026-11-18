import { LiveClock } from "@/components/LiveClock/LiveClock";
import type { HudItem } from "@/content";
import styles from "./Hud.module.scss";

/**
 * The monitoring-console strip under the hero: 4 columns, each a dim label line
 * over a bright value line. Every value is real data (location, live clock, status).
 */
export function Hud({ items, className }: { items: HudItem[]; className?: string }) {
  return (
    <dl className={[styles.hud, className].filter(Boolean).join(" ")}>
      {items.map((item) => (
        <div key={item.label} className={styles.item} data-hero="hud">
          <dt className={styles.label}>{item.label}</dt>
          <dd className={styles.value}>
            {item.statusDot && <span className={styles.dot} aria-hidden="true" />}
            <span>{item.value}</span>
            {item.detail && <span className={styles.detail}>{item.detail}</span>}
            {item.liveClock && <LiveClock className={styles.clock} />}
          </dd>
        </div>
      ))}
    </dl>
  );
}
