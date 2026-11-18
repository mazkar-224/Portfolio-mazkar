import { needsMarker, type Needs } from "@/content";
import styles from "./NeedsMarker.module.scss";

/**
 * A visible gap in the facts (CLAUDE.md rule 1): shows "[[NEEDS: ...]]" on the page
 * until Muhammad supplies the real value. Never replaced with plausible text.
 */
export function NeedsMarker({ gap, className }: { gap: Needs; className?: string }) {
  return <p className={[styles.needs, className].filter(Boolean).join(" ")}>{needsMarker(gap)}</p>;
}
