// Shared content types and the [[NEEDS: ...]] placeholder helper.
// Every string in src/content traces to source/profile-brief.md or source/landing-page-copy.md.

export type Link = {
  label: string;
  href: string;
  /** Opens another site (GitHub, LinkedIn). Rendered with rel="noopener". */
  external?: boolean;
  /**
   * Screen-reader-only words that say which item the link belongs to, when several links
   * share a visible label ("Code on GitHub"). Rendered visually hidden; never new visible copy.
   */
  context?: string;
};

export type ImageAsset = {
  src: string;
  /** Intrinsic pixel size, so next/image can reserve space (no layout shift). */
  width: number;
  height: number;
  alt: string;
};

export type LabelValue = {
  label: string;
  value: string;
};

/**
 * A gap in the facts. Never filled with plausible text: the page shows
 * the visible marker "[[NEEDS: <what>]]" until Muhammad supplies the real value.
 */
export type Needs = {
  needs: string;
};

export const needs = (what: string): Needs => ({ needs: what });

export const isNeeds = (value: unknown): value is Needs =>
  typeof value === "object" && value !== null && "needs" in value;

export const needsMarker = (gap: Needs) => `[[NEEDS: ${gap.needs}]]`;
