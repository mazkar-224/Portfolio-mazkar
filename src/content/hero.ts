// Section 1, the hero. Copy: landing-page-copy.md "1. Hero", word for word.
// HUD values: CLAUDE.md "Layout language" (from his build prompt).

import { cv, mailto, person, profiles } from "./site";
import { needs, type LabelValue, type Link, type Needs } from "./shared";

export type HudItem = LabelValue & {
  /** Second value line, e.g. the time zone under the city. */
  detail?: string;
  /** LOCATION shows a live Islamabad clock after the value. */
  liveClock?: boolean;
  /** STATUS shows the --live dot. */
  statusDot?: boolean;
};

export const hero = {
  name: person.name,
  displayName: person.displayName,
  title: person.jobTitle,
  description:
    "I deploy and monitor systems on AWS, and I build the AI agents and workflows that take manual work off a team.",
  location: "Islamabad, Pakistan · PKT (UTC+5)",
  availability:
    "Entry-level, 2026 computer science graduate. Open to remote full-time roles with international teams, roles in Pakistan, and freelance projects.",
  primaryAction: { label: "Email me", href: mailto } satisfies Link,
  secondaryActions: [
    { label: cv.label, href: cv.href },
    profiles.github,
  ] satisfies Link[],
  hud: [
    { label: "Location", value: "Islamabad, PK", detail: "UTC+5", liveClock: true },
    { label: "Status", value: "Open to work", statusDot: true },
    { label: "Cloud", value: "AWS, Docker, Linux, CI/CD" },
    { label: "Automation", value: "n8n, Python, AI agents" },
  ] satisfies HudItem[],
  /**
   * TODO: no real photo exists yet. The hero ships without one (brief hard rule 13);
   * the Gemini headshot is never used on the site.
   */
  photo: needs("real photo") as Needs,
} as const;
