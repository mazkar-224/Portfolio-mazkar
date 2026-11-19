// Copy for the redesigned home page (18 Nov 2026, after the reference site and images).
// Headlines are new, in the reference's voice. Every fact, number and date comes from
// source/profile-brief.md, in its own context (no rounding, no merging, no invented proof).

import { automation } from "./automation";
import { awsWork } from "./aws";
import { cloudCostGuard } from "./cloudcostguard";
import { experience } from "./experience";
import { cv, mailto, person, profiles, repos } from "./site";
import type { Link } from "./shared";

export const homeIds = {
  about: "about",
  work: "work",
  approach: "approach",
  experience: "experience",
  journey: "journey",
  contact: "contact",
} as const;

export const homeNav: Link[] = [
  { label: "Work", href: `/#${homeIds.work}` },
  { label: "About", href: `/#${homeIds.about}` },
  { label: "Experience", href: `/#${homeIds.experience}` },
  { label: "Services", href: "/services" },
];

export const heroCopy = {
  kicker: "DevOps · Cloud · AI automation",
  sideLabel: "01 / Presence",
  sideList: ["Cloud infrastructure", "CI/CD and testing", "AI agents and workflows"],
  topRight: "Based in Islamabad · Open to remote work",
  /** The small mono line above his name. */
  above: person.jobTitle,
  first: person.givenName,
  last: person.familyName,
  line: "I deploy and monitor systems on AWS, and build the AI agents that take manual work off a team.",
  primary: { label: "Explore my work", href: `#${homeIds.work}` } satisfies Link,
  secondary: { label: "Start a conversation", href: mailto } satisfies Link,
  bottom: ["Scroll to discover", "Cloud & automation"],
  portraitAlt: "Muhammad Azkar in a dark suit, white shirt and tie, smiling at the camera, head and shoulders in black and white.",
};

/** Real numbers only, each with its own context (profile-brief hard rule 3). */
export const stats = [
  { value: "100", suffix: "", label: "Automated tests in CloudCostGuard, run in GitHub Actions on every push" },
  { value: "82", suffix: "%", label: "Test coverage on CloudCostGuard" },
  { value: "6", suffix: "", label: "Public n8n AI agents and workflows, each with a setup guide" },
  { value: "4", suffix: "", label: "Docker containers running CloudCostGuard on one EC2 instance" },
];

export const about = {
  index: "02",
  label: "The person behind the work",
  aside: "A systems perspective",
  title: { plain: ["Infrastructure is", "the starting point."], italic: "Reliability is the point." },
  lede: "I connect cloud infrastructure, testing and automation.",
  body:
    "I'm a 2026 computer science graduate from the University of Peshawar. I built CloudCostGuard end to end, from an empty repo to a tested app running on EC2, then spent a remote internship at FlyRank AI building backend AI services. Now I'm building my career in DevOps and cloud, and taking on automation work.",
  cv: cv,
  traits: ["Ships with tests.", "Checks before it acts.", "Keeps costs visible."],
  tabs: [
    {
      id: "cloud",
      label: "Cloud",
      shape: "grid",
      caption: "Infrastructure",
      title: "Ship it, then watch it.",
      body: "AWS, Docker, Linux and CI/CD. CloudCostGuard runs as four containers on EC2 behind Caddy, with 100 tests in GitHub Actions.",
      link: { label: "See CloudCostGuard", href: `#${homeIds.work}` },
    },
    {
      id: "automation",
      label: "Automate",
      shape: "vortex",
      caption: "Agents",
      title: "Take the manual work off.",
      body: "n8n agents on Gemini, Groq and Pinecone that read mail, sort leads and answer from documents. Six are public, with setup guides.",
      link: { label: "See the agents", href: `#${homeIds.work}` },
    },
    {
      id: "backend",
      label: "Build",
      shape: "sphere",
      caption: "Backend",
      title: "APIs that hold up.",
      body: "FastAPI and PostgreSQL services with real tests: a job service with retries and Prometheus metrics, auth with JWT, schema-checked LLM output.",
      link: { label: "See the internship", href: `#${homeIds.experience}` },
    },
  ],
} as const;

export const work = {
  index: "03",
  label: "Selected work",
  aside: "Built, tested, shipped",
  title: { plain: "Ideas are cheap.", italic: "This is what shipped." },
  intro: "From a cost monitor running on EC2 to agents that answer email. Every project links to its code.",
  featured: {
    tag: "DevOps & full stack",
    name: cloudCostGuard.name,
    descriptor: cloudCostGuard.headingParts.descriptor,
    body: cloudCostGuard.intro,
    shot: cloudCostGuard.screenshots[0],
    domain: "cloudcostguard · dashboard",
    meta: cloudCostGuard.meta,
    links: cloudCostGuard.links,
    offline: cloudCostGuard.offlineNote,
  },
  cards: automation.workflows.slice(0, 2).map((w, i) => ({
    index: String(i + 2).padStart(2, "0"),
    tag: "AI automation · n8n",
    name: w.name,
    body: w.description,
    href: w.href,
    image: w.images[0],
  })),
  moreLabel: "More ways I build",
  more: [
    ...automation.workflows.slice(2).map((w) => ({ tag: "AI automation", name: w.name, href: w.href })),
    ...awsWork.projects.map((p) => ({ tag: "AWS", name: p.name, href: p.link.href })),
    { tag: "Backend AI", name: "FlyRank AI internship code", href: repos.flyrank },
  ],
  allWork: { label: "All my code on GitHub", href: profiles.github.href },
};

export const approach = {
  index: "04",
  label: "How I think & work",
  aside: "Depth meets reliability",
  title: { plain: "How I work.", italic: "From idea to running system." },
  sub: "Pick a discipline. Follow the thinking.",
  steps: ["Understand the problem", "Build it small, with tests", "Ship it through CI", "Watch it and fix it"],
};

export const experienceCopy = {
  index: "05",
  label: "Professional experience",
  aside: "Remote, with a distributed team",
  role: experience.roles[0],
};

export const band = {
  label: "06 / Off the screen",
  title: { plain: "Built to run.", italic: "Made to last." },
  line: "I like systems that stay quiet: tested before they ship, watched after.",
  cta: { label: "Email me", href: mailto } satisfies Link,
  alt: "Muhammad Azkar in a dark suit standing in a field of flowers, looking to the side, in black and white.",
};

export const journey = {
  label: "Interlude / Still becoming",
  aside: "A journey in motion",
  title: { plain: "Started with code.", italic: "Kept asking why." },
  steps: [
    { when: "2022", title: "Computer science, and people.", body: "Started a BS in Computer Science at the University of Peshawar. Media Head at the Computing Students Society, and on the GDG on Campus management team." },
    { when: "Early 2026", title: "First cloud work.", body: "A Bash script that audits an AWS account and reports S3, EC2, Lambda and IAM resources, and a static website on EC2, documented step by step." },
    { when: "May to June 2026", title: "CloudCostGuard.", body: "A self-hosted AWS cost monitor, built in six phases from an empty repo to a deployed, tested app." },
    { when: "July to September 2026", title: "FlyRank AI internship.", body: "A remote backend AI engineering track with a distributed team, ending in a capstone accepted by the lead track mentor." },
    { when: "Now", title: "DevOps, cloud and automation.", body: "Open to work, and publishing my n8n agents for anyone to use." },
  ],
};

export const close = {
  index: "07",
  label: "The next chapter",
  aside: "Let's make it reliable",
  kicker: "Open to roles and projects",
  title: { plain: "Something useful", rest: "starts with", italic: "a hello." },
  body: "Hiring for DevOps, cloud or AI automation, or have manual work you'd like automated? Email me. I'm in Islamabad (PKT, UTC+5) and work remotely.",
  email: person.email,
  primary: { label: "Let's connect", href: mailto } satisfies Link,
};

/** The footer under every page (the reference's pattern: wordmark, links, a back-to-top button). */
export const footerCopy = {
  links: [profiles.linkedin, profiles.github, { label: cv.label, href: cv.href }, { label: "Email", href: mailto }],
  place: "Islamabad, PK",
  reach: "Remote, worldwide",
  backToTop: "Back to top",
};
