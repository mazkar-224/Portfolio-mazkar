import { ciBadge } from "@/content";
import styles from "./CiBadge.module.scss";

/** The live CloudCostGuard CI badge, linked to the Actions page. Never a dated CI claim. */
export function CiBadge({ className }: { className?: string }) {
  return (
    <a href={ciBadge.href} className={[styles.link, className].filter(Boolean).join(" ")} rel="noopener">
      {/* External SVG badge: next/image adds nothing for a 90x20 vector. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ciBadge.image}
        alt={ciBadge.alt}
        width={90}
        height={20}
        loading="lazy"
        decoding="async"
        className={styles.badge}
      />
    </a>
  );
}
