// Section 4, AI automation (the light section). Copy: landing-page-copy.md "4. AI automation".
// Folder links: profile-brief.md <proof_assets>. No usage numbers exist (hard rule 2).

import { repos } from "./site";
import type { ImageAsset, Link } from "./shared";

export type Workflow = {
  id: string;
  name: string;
  description: string;
  /** Its folder in the automation-portfolio repo. */
  href: string;
  /** The first image is the card image; any others are extra views. */
  images: ImageAsset[];
};

const folder = (name: string) => `${repos.automation}/tree/main/${name}`;

// New strings (listed for Muhammad): the alt text on every screenshot.
export const automation = {
  sectionLabel: "AI automation",
  heading: "n8n agents and workflows",
  // The same heading split for display: "n8n" keeps its lowercase (the uppercase display
  // title would otherwise print it as "N8N").
  headingParts: { accent: "n8n", rest: "agents and workflows" },
  intro:
    "I build n8n agents that take repetitive work off a team. Each one has importable JSON, a screenshot and a setup guide in the repo, with credentials removed.",
  workflows: [
    {
      id: "lead-reactivation",
      name: "Lead reactivation engine",
      description:
        "Emails leads who went quiet, then handles the replies: it strips quoted history, drops auto-replies, verifies the sender, sorts each reply into 5 kinds, scores intent from 0 to 100, updates the Google Sheet, and answers only the interested leads.",
      href: folder("01-lead-reactivation-engine"),
      images: [
        {
          src: "/images/projects/n8n-lead-reactivation.png",
          width: 3494,
          height: 1718,
          alt: "n8n canvas of the lead reactivation engine: an outbound row that reads leads from Google Sheets and loops them through an AI agent with a Groq model and a Gmail tool, and an inbound row that starts from a Gmail trigger, cleans and filters replies, and passes them to a second agent with a Gemini model, Gmail and Google Sheets tools.",
        },
      ],
    },
    {
      id: "browser-agent",
      name: "Browser agent",
      description:
        "Drives a real cloud browser through 7 tools and checks the page after every action, for up to 50 steps.",
      href: folder("03-autonomous-browser-agent"),
      images: [
        {
          src: "/images/projects/n8n-browser-agent.png",
          width: 3480,
          height: 1730,
          alt: "n8n canvas of the browser agent: a chat trigger feeds an AI agent with a model and memory, wired to seven tools: think, create browser, typing, clicking, query, load URL and terminate.",
        },
        {
          src: "/images/projects/n8n-browser-agent-session.png",
          width: 3482,
          height: 1718,
          alt: "n8n sub-workflow that creates the browser: when called by another workflow, it creates a session and then a window.",
        },
      ],
    },
    {
      id: "rag-agent",
      name: "RAG agent",
      description:
        "Loads Google Drive documents into Pinecone with Gemini embeddings and answers only from them.",
      href: folder("04-rag-agent-gemini-pinecone"),
      images: [
        {
          src: "/images/projects/n8n-rag-ingest.png",
          width: 3496,
          height: 1732,
          alt: "n8n ingestion workflow: download a file from Google Drive, split it with a recursive character text splitter, embed it with Google Gemini and store it in a Pinecone vector store.",
        },
        {
          src: "/images/projects/n8n-rag-chat.png",
          width: 3510,
          height: 1736,
          alt: "n8n chat workflow of the RAG agent: a chat trigger feeds an AI agent with a Google Gemini chat model, simple memory and a Pinecone vector store tool that uses Gemini embeddings.",
        },
      ],
    },
    {
      id: "email-responder",
      name: "Email responder",
      description:
        "Classifies incoming Gmail and saves a reply as a draft for a person to approve.",
      href: folder("05-email-responder-agent"),
      images: [
        {
          src: "/images/projects/n8n-email-responder.png",
          width: 3582,
          height: 1750,
          alt: "n8n canvas of the email responder: a Gmail trigger feeds a text classifier that splits mail into payments and withdrawals or offer letters and internships; each branch writes a reply with Gemini and saves it as a Gmail draft.",
        },
      ],
    },
    {
      id: "research-linkedin",
      name: "Research and LinkedIn post pipeline",
      description:
        "Researches a topic with Tavily, writes a post, generates an image and publishes to LinkedIn.",
      href: folder("02-linkedin-research-post-system"),
      images: [
        {
          src: "/images/projects/n8n-research-linkedin.png",
          width: 3496,
          height: 1730,
          alt: "n8n canvas of the research and LinkedIn post pipeline: a form submission goes to a research agent with a Tavily search tool, then an image agent, an image generator and a LinkedIn create post step, with both agents on an OpenRouter chat model.",
        },
      ],
    },
    {
      id: "inventory-agent",
      name: "Inventory agent",
      description: "A chat assistant that reads and updates a shop's stock in Google Sheets.",
      href: folder("06-tech-shop-inventory-agent"),
      images: [
        {
          src: "/images/projects/n8n-inventory-agent.png",
          width: 3494,
          height: 1728,
          alt: "n8n canvas of the inventory agent: a chat trigger feeds an AI agent with a Google Gemini chat model, simple memory, and Google Sheets tools to read and update the inventory.",
        },
      ],
    },
  ] satisfies Workflow[],
  repoNote: "Each item links to its folder in the automation-portfolio repo.",
  cta: {
    lead: "Want something like this for your team?",
    link: { label: "See what I can build for you", href: "/services" } satisfies Link,
  },
} as const;
