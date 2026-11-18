// Section 2, CloudCostGuard. Copy: landing-page-copy.md "2. CloudCostGuard", word for word.
// Facts: profile-brief.md 4.2 and <proof_assets>. Diagram: the repo's docs/ARCHITECTURE.md.

import { ciBadge, repos } from "./site";
import { needs, type ImageAsset, type LabelValue, type Link, type Needs } from "./shared";

export type CaseStudyBlock = {
  heading: string;
  body: string;
};

export type DiagramNode = {
  id: string;
  label: string;
  detail?: string;
  /** Which box it sits in: the EC2 instance, or outside it. */
  group: "outside" | "ec2" | "aws";
};

export type DiagramEdge = {
  from: string;
  to: string;
  label?: string;
};

export const cloudCostGuard = {
  name: "CloudCostGuard",
  heading: "CloudCostGuard: AWS cost monitoring and waste detection",
  /** The heading split for display: the name large, the descriptor after it. */
  headingParts: { name: "CloudCostGuard", descriptor: "AWS cost monitoring and waste detection" },
  context: "Final year project, 2026",

  // New strings (listed for Muhammad): the metadata grid values, each from brief 4.2.
  meta: [
    { label: "Project", value: "CloudCostGuard" },
    { label: "Role", value: "Sole developer, database to dashboard" },
    { label: "Stack", value: "FastAPI, PostgreSQL 16, React, Docker, AWS" },
    { label: "Status", value: "Live demo offline, code public" },
    { label: "Year", value: "2026" },
  ] satisfies LabelValue[],

  /** TODO: the walkthrough is not recorded yet. Until it exists the screenshots show in its place. */
  video: needs("walkthrough video URL") as string | Needs,

  // New strings (listed for Muhammad): alt text.
  // Note: both screenshots show the app's earlier name, "CloudGuard", in the sidebar.
  screenshots: [
    {
      src: "/images/projects/cloudcostguard-dashboard.png",
      width: 1919,
      height: 944,
      alt: "CloudCostGuard dashboard with real cost data: cards for the 30-day total, 7-day total, yesterday and the change on last week, a 30-day daily spend line chart, and a donut chart of the top AWS services led by Amazon EC2 and Amazon RDS.",
    },
    {
      src: "/images/projects/cloudcostguard-empty-state.png",
      width: 1919,
      height: 946,
      alt: "CloudCostGuard dashboard for a new account before its first sync: zero totals, a flat daily spend chart, and an empty top services panel with a Run first sync button.",
    },
  ] satisfies ImageAsset[],

  intro:
    "CloudCostGuard shows what an AWS account costs, flags unusual days, and lists resources that are wasting money, each with an estimated monthly saving. I built all of it myself in six phases from 13 May 2026, from the database to the dashboard, starting from an empty repo and ending with a tested, deployed app.",

  built: {
    heading: "How it's built",
    body: "FastAPI, PostgreSQL 16, and boto3 against Cost Explorer, STS, EC2 and CloudWatch. Costs sync every 6 hours and resources are scanned daily. A z-score detector compares each day with the previous 14 and sends alerts through SendGrid. Sign-in is multi-user with JWT. AWS keys must be read-only; they're validated before saving and encrypted at rest with Fernet. I also wrote the dashboard: React with React Router, TanStack Query, Recharts, Tailwind CSS and Vite, with dark mode and an empty state for new accounts.",
  } satisfies CaseStudyBlock,

  shipped: {
    heading: "How I shipped it",
    body: "Four Docker containers on one EC2 instance behind Caddy with automatic HTTPS. 100 automated tests at 82% coverage run in GitHub Actions on every push.",
  } satisfies CaseStudyBlock,

  /** Shown right after "How I shipped it", linked to the Actions page. */
  ciBadge,

  fixed: {
    heading: "What broke, and how I fixed it",
    body: "Tiny spikes of $0.01 to $0.05 produced huge z-scores, so a day now has to cost at least $1 before it can be flagged. With only 2 or 3 days of data the baseline was noise, so the detector won't give a verdict until it has 7 days of history. On 16 Nov 2026 I found that AWS credits were cancelling every service's cost to about $0. I filtered credits and refunds out of the Cost Explorer query so real costs show.",
  } satisfies CaseStudyBlock,

  next: {
    heading: "What I'd do next",
    body: "Trend-aware baselines (EWMA), day-of-week seasonality, and per-service thresholds.",
  } satisfies CaseStudyBlock,

  offlineNote:
    "The live demo is offline to avoid AWS charges. The walkthrough, screenshots and code show how it works.",

  links: [
    { label: "Code on GitHub", context: "CloudCostGuard", href: repos.cloudCostGuard, external: true },
    {
      label: "Architecture",
      href: "https://github.com/mazkar-224/Cloud-cost-guard/blob/main/docs/ARCHITECTURE.md",
      external: true,
    },
    {
      label: "How anomaly detection works",
      href: "https://github.com/mazkar-224/Cloud-cost-guard/blob/main/docs/anomaly-detection.md",
      external: true,
    },
  ] satisfies Link[],

  // New strings (listed for Muhammad): diagram labels and its text description.
  // Drawn only from docs/ARCHITECTURE.md: four containers on one EC2 instance, only Caddy
  // is public, nginx serves the dashboard and passes /api to FastAPI.
  diagram: {
    title: "CloudCostGuard architecture",
    description:
      "A browser connects over HTTPS to Caddy. Caddy, the nginx frontend, the FastAPI backend and PostgreSQL 16 run as four Docker containers on one EC2 instance. nginx serves the React dashboard and passes /api requests to FastAPI. FastAPI stores data in PostgreSQL, calls Cost Explorer, STS, EC2 and CloudWatch through boto3, and sends alerts through SendGrid.",
    containerCaption: "One EC2 instance, four Docker containers",
    // New string (listed for Muhammad): the label on the box of AWS APIs.
    awsCaption: "AWS APIs via boto3",
    nodes: [
      { id: "browser", label: "Browser", group: "outside" },
      { id: "caddy", label: "Caddy", detail: "Automatic HTTPS", group: "ec2" },
      { id: "frontend", label: "nginx", detail: "React dashboard", group: "ec2" },
      { id: "backend", label: "FastAPI", detail: "Sync every 6 hours", group: "ec2" },
      { id: "db", label: "PostgreSQL 16", group: "ec2" },
      { id: "costExplorer", label: "Cost Explorer", group: "aws" },
      { id: "sts", label: "STS", group: "aws" },
      { id: "ec2Api", label: "EC2", group: "aws" },
      { id: "cloudwatch", label: "CloudWatch", group: "aws" },
      { id: "sendgrid", label: "SendGrid", detail: "Alerts", group: "outside" },
    ] satisfies DiagramNode[],
    edges: [
      { from: "browser", to: "caddy", label: "HTTPS" },
      { from: "caddy", to: "frontend" },
      { from: "frontend", to: "backend", label: "/api" },
      { from: "backend", to: "db" },
      { from: "backend", to: "costExplorer", label: "boto3" },
      { from: "backend", to: "sts", label: "boto3" },
      { from: "backend", to: "ec2Api", label: "boto3" },
      { from: "backend", to: "cloudwatch", label: "boto3" },
      { from: "backend", to: "sendgrid" },
    ] satisfies DiagramEdge[],
  },
} as const;
