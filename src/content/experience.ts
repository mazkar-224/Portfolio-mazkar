// Section 3, professional experience. Copy: landing-page-copy.md "3. Professional experience".
// Numbers stay in their own context (brief hard rules 3, 6 and 7).

import { repos } from "./site";
import type { Link } from "./shared";

export type Role = {
  title: string;
  company: string;
  /** The copy's heading line, exactly. */
  heading: string;
  where: string;
  period: string;
  /** Machine-readable dates for <time dateTime>. */
  start: string;
  end: string;
  highlights: string[];
  links: Link[];
};

export const experience = {
  sectionLabel: "Professional experience",
  roles: [
    {
      title: "Back-End AI Engineering Intern",
      company: "FlyRank AI",
      heading: "Back-End AI Engineering Intern, FlyRank AI",
      where: "Remote, with a distributed team (Chicago, IL, USA)",
      period: "July to September 2026",
      start: "2026-07",
      end: "2026-09",
      highlights: [
        "Built FastAPI REST APIs with JWT authentication (bcrypt) on PostgreSQL, SQLite and SQL Server through a repository pattern, containerised with Docker Compose. Wrote a 17-test pytest suite for the auth service.",
        "Designed a job-processing service for long-running AI tasks, with retries and backoff, dead-lettering, idempotent submission, rate limiting, structured logs and Prometheus metrics. Wrote 43 unit and integration tests for it.",
        "Built RuleGuard AI. It retrieves API and security rules, asks Gemini for a risk judgement, validates the answer against a strict schema, retries once, then quarantines bad output. It has an 8-case evaluation set that includes a prompt-injection case.",
        "Built an AI architecture copilot that asks clarifying questions, plans from a knowledge base and reviews code diffs, with 48 offline tests.",
        "Built an n8n research pipeline (web search, LLM summaries, a quality-review gate, Google Drive and Gmail), then extended it with Model Context Protocol (MCP) tool access.",
        'Capstone, "Your 10x Solution": an AI-integration backend with API contracts, RAG and LLM evaluation, accepted by the program\'s lead track mentor.',
      ],
      links: [{ label: "Internship code on GitHub", href: repos.flyrank, external: true }],
    },
  ] satisfies Role[],
} as const;
