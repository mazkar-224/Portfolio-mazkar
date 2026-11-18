import type { ComponentPropsWithoutRef } from "react";
import styles from "./Button.module.scss";

type Props = ComponentPropsWithoutRef<"a"> & {
  href: string;
  variant?: "primary" | "outlined";
};

/**
 * The site's one button style, always a link (every action here navigates:
 * mailto, the CV, GitHub). Primary is --signal with void text; outlined is a hairline.
 */
export function Button({ variant = "outlined", className, children, ...rest }: Props) {
  const classes = [styles.button, styles[variant], className].filter(Boolean).join(" ");
  return (
    // Primary buttons follow the pointer a little on desktop (src/animations/magnetic.ts).
    <a className={classes} data-magnetic={variant === "primary" ? "" : undefined} {...rest}>
      {children}
    </a>
  );
}
