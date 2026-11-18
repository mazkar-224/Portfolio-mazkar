import type { MetadataRoute } from "next";
import { siteUrl } from "@/content";

/**
 * Everyone may crawl everything. AI crawlers are named explicitly so the intent is clear:
 * he wants to be found and cited by AI search and assistants (CLAUDE.md "SEO and AI
 * discoverability"). Tokens checked on 18 Nov 2026 against each company's own docs:
 * - OpenAI (developers.openai.com/api/docs/bots): GPTBot, OAI-SearchBot, ChatGPT-User
 * - Anthropic (support.claude.com, article 8896518): ClaudeBot, Claude-User, Claude-SearchBot
 * - Perplexity (docs.perplexity.ai/guides/bots): PerplexityBot, Perplexity-User
 * - Google (developers.google.com, common crawlers): Google-Extended
 * - Apple (support.apple.com/en-us/119829): Applebot, Applebot-Extended
 * - Common Crawl (commoncrawl.org/ccbot): CCBot
 * - Meta (developers.facebook.com, web crawlers): meta-externalagent, meta-externalfetcher, meta-webindexer
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "CCBot",
  "meta-externalagent",
  "meta-externalfetcher",
  "meta-webindexer",
];

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_CRAWLERS, allow: "/" },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
