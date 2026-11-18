import { ui } from "@/content";
import styles from "./SkipLink.module.scss";

/** First focusable element on every page: jumps keyboard users past the header. */
export function SkipLink() {
  return (
    <a href="#main" className={styles.skip}>
      {ui.skipLink}
    </a>
  );
}
