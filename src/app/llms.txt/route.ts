import { llmsTxt } from "@/lib/llms";

// /llms.txt, generated from src/content at build time (static).
export function GET() {
  return new Response(llmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
