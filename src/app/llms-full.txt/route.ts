import { llmsFullTxt } from "@/lib/llms";

// /llms-full.txt, generated from src/content at build time (static).
export function GET() {
  return new Response(llmsFullTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
