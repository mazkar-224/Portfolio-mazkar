import type { ReactNode } from "react";
import styles from "./Frame.module.scss";

type Props = {
  children: ReactNode;
  className?: string;
  /** Wipe the contents in on scroll (Phase 6). Off for the diagram, which draws itself. */
  reveal?: boolean;
};

/**
 * Thin hairline frame with "+" crosshair marks at the corners, for images and diagrams.
 * The inner clip box is what the reveal wipes and what keeps the settling image's
 * 1.08 scale inside the frame; the border and corner marks never move.
 */
export function Frame({ children, className, reveal = true }: Props) {
  return (
    <div
      className={[styles.frame, className].filter(Boolean).join(" ")}
      data-anim={reveal ? "frame" : undefined}
    >
      <div className={styles.clip} data-anim-clip>
        {children}
      </div>
    </div>
  );
}
