// The /services page. Copy: landing-page-copy.md "/services page", word for word.
// Every row links to a project he built; he has no past clients (hard rule 2).

import { automation } from "./automation";
import { ciBadge, mailto, repos } from "./site";
import { needs, type Link, type Needs } from "./shared";

export type Service = {
  service: string;
  /** "See it working": each proof is a link to the project that shows it. */
  proof: Link[];
};

const workflow = (id: string) => {
  const w = automation.workflows.find((item) => item.id === id);
  if (!w) throw new Error(`Unknown workflow id: ${id}`);
  return w.href;
};

// New strings (listed for Muhammad): the mono label "Services" (the approved nav label)
// and the page title "What I can build for you | Muhammad Azkar", built from the heading.
export const services = {
  pageLabel: "Services",
  metaTitle: "What I can build for you | Muhammad Azkar",
  heading: "What I can build for you",
  intro:
    "Each service links to a project I built that does the same kind of work, so you can see the code before we talk.",
  columns: { service: "Service", proof: "See it working" },
  rows: [
    {
      service: "Business automation in n8n: email, Google Sheets, follow-ups",
      proof: [
        { label: "Lead reactivation engine", href: workflow("lead-reactivation"), external: true },
        { label: "email responder", href: workflow("email-responder"), external: true },
        { label: "inventory agent", href: workflow("inventory-agent"), external: true },
      ],
    },
    {
      service: "AI agents that answer from your own documents (RAG)",
      proof: [{ label: "RAG agent", href: workflow("rag-agent"), external: true }],
    },
    {
      service: "Email and lead-reply assistants that draft or reply safely",
      proof: [
        { label: "Lead reactivation engine", href: workflow("lead-reactivation"), external: true },
        { label: "email responder", href: workflow("email-responder"), external: true },
      ],
    },
    {
      service: "Web research and content automation",
      proof: [
        { label: "Research and LinkedIn pipeline", href: workflow("research-linkedin"), external: true },
        { label: "FlyRank research pipeline", href: repos.flyrank, external: true },
      ],
    },
    {
      service: "AWS cost review: finding idle and wasted resources",
      proof: [
        { label: "CloudCostGuard waste scanner", href: repos.cloudCostGuard, external: true },
        { label: "AWS resource tracker", href: repos.awsResourceTracker, external: true },
      ],
    },
    {
      service: "Dockerising an app and deploying it on EC2 with HTTPS",
      proof: [
        {
          label: "CloudCostGuard deployment",
          href: "https://github.com/mazkar-224/Cloud-cost-guard/blob/main/docs/ARCHITECTURE.md",
          external: true,
        },
      ],
    },
    {
      service: "CI with GitHub Actions and automated tests",
      proof: [{ label: "CloudCostGuard's 100-test pipeline", href: ciBadge.href, external: true }],
    },
    {
      service: "Python and FastAPI backends with PostgreSQL",
      proof: [
        { label: "CloudCostGuard", href: repos.cloudCostGuard, external: true },
        { label: "FlyRank FastAPI services", href: repos.flyrank, external: true },
      ],
    },
  ] satisfies Service[],
  closing: "Tell me what you do by hand today and I'll tell you what I'd automate first.",
  primaryAction: { label: "Email me", href: mailto } satisfies Link,
  /** TODO: only if he wants them listed, and only real URLs. */
  platformProfiles: needs("profile URLs, if any exist") as Link[] | Needs,
} as const;
