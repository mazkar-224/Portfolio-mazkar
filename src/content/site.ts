// Who he is, how to reach him, and site-wide settings.
// Sources: profile-brief.md <snapshot> and <proof_assets>, links.md, landing-page-copy.md "Page meta".

import type { Link } from "./shared";

export const person = {
  name: "Muhammad Azkar",
  /** How the hero shows his name (his decision, 18 Nov 2026). The H1 keeps the full name for screen readers. */
  displayName: "M.Azkar",
  givenName: "Muhammad",
  familyName: "Azkar",
  jobTitle: "DevOps & AI Automation Engineer",
  email: "mazkar0107@gmail.com",
  location: {
    city: "Islamabad",
    country: "Pakistan",
    countryCode: "PK",
    /** IANA zone for the live clock (Intl.DateTimeFormat). */
    timeZone: "Asia/Karachi",
    timeZoneLabel: "PKT (UTC+5)",
  },
  // The phone number is deliberately absent: brief hard rule 14 keeps it on the CV only.
} as const;

export const mailto = `mailto:${person.email}`;

export const profiles = {
  github: { label: "GitHub", href: "https://github.com/mazkar-224", external: true },
  linkedin: { label: "LinkedIn", href: "https://www.linkedin.com/in/mazkar/", external: true },
} satisfies Record<string, Link>;

/** Public repositories (all MIT licensed). Checked to exist on 18 Nov 2026. */
export const repos = {
  cloudCostGuard: "https://github.com/mazkar-224/Cloud-cost-guard",
  automation: "https://github.com/mazkar-224/automation-portfolio",
  flyrank: "https://github.com/mazkar-224/flyrank-backend-ai-engineering-internship",
  awsResourceTracker: "https://github.com/mazkar-224/aws-resource-tracker",
  staticSiteEc2: "https://github.com/mazkar-224/Deploying-a-Static-Website-on-AWS-EC2",
} as const;

/** The live CloudCostGuard CI badge. The site shows this, never a dated CI claim. */
export const ciBadge = {
  image: "https://github.com/mazkar-224/Cloud-cost-guard/actions/workflows/ci.yml/badge.svg?branch=main",
  href: "https://github.com/mazkar-224/Cloud-cost-guard/actions/workflows/ci.yml",
  // New string (listed for Muhammad): alt text for the badge image.
  alt: "CloudCostGuard CI status on GitHub Actions",
} as const;

/**
 * The CV download: public/cv/Muhammad-Azkar-CV.pdf, a public copy rendered on 18 Nov 2026
 * (approved in Phase 2) from source/cv/ with the phone number removed (brief hard rule 14)
 * and "CloudGuard" renamed to CloudCostGuard. His source CV is untouched.
 */
export const cv: Link = {
  label: "Download CV",
  href: "/cv/Muhammad-Azkar-CV.pdf",
};

export const site = {
  title: "Muhammad Azkar | DevOps & AI Automation Engineer",
  description:
    "DevOps & AI Automation Engineer in Islamabad. AWS, Docker, Linux and CI/CD, plus AI automation with n8n and Python. Every project links to its code.",
  locale: "en",
} as const;

/**
 * The site's absolute address, for canonical URLs, the sitemap, Open Graph and JSON-LD.
 * TODO: the production domain is not decided yet. Until it is, the address comes from:
 *   1. SITE_URL, if set (set it in Vercel when a custom domain is added), else
 *   2. VERCEL_PROJECT_PRODUCTION_URL, which Vercel provides automatically on every
 *      deploy (the project's *.vercel.app or custom production domain), else
 *   3. http://localhost:3000 for local builds only.
 * No guessed domain is ever written into the site.
 */
export function siteUrl(): string {
  const explicit = process.env.SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;
  return "http://localhost:3000";
}

/** In-page anchors, shared by the nav and the section components. */
export const sectionIds = {
  cloudCostGuard: "cloudcostguard",
  experience: "experience",
  automation: "automation",
  aws: "aws",
  skills: "skills",
  education: "education",
  contact: "contact",
} as const;

// New strings (listed for Muhammad): the nav labels, taken from the copy's section names.
export const nav: Link[] = [
  { label: "CloudCostGuard", href: `/#${sectionIds.cloudCostGuard}` },
  { label: "Experience", href: `/#${sectionIds.experience}` },
  { label: "Automation", href: `/#${sectionIds.automation}` },
  { label: "Skills", href: `/#${sectionIds.skills}` },
  { label: "Services", href: "/services" },
  { label: "Contact", href: `/#${sectionIds.contact}` },
];

/**
 * On/off switches for the two optional effects. Set either to false, save, and rebuild.
 * - preloader: the first-visit "ACQUIRING SIGNAL" overlay and the hero intro behind it.
 *   Off: the hero simply shows as painted on every visit.
 * - webglEffect: the CloudCostGuard screenshot resolving out of ASCII noise (desktop only).
 *   Off: the plain screenshot, with the normal frame reveal.
 */
export const features = {
  preloader: true,
  webglEffect: true,
} as const;
