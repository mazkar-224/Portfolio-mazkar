// Section 8, contact. Copy: landing-page-copy.md "8. Contact".
// mailto and profile links only; no form (no backend).

import { mailto, person, profiles } from "./site";
import type { Link } from "./shared";

export const contact = {
  sectionLabel: "Contact",
  heading: "Let's talk",
  body: "If you're hiring for DevOps, cloud or AI automation, or you have manual work you'd like automated, email me. I'm in Islamabad (PKT, UTC+5) and work remotely.",
  primaryAction: { label: "Email me", href: mailto } satisfies Link,
  email: person.email,
  links: [profiles.linkedin, profiles.github] satisfies Link[],
  timeZone: person.location.timeZone,
  timeZoneLabel: person.location.timeZoneLabel,
} as const;
