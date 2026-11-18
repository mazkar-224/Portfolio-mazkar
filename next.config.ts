import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // ~6 KB of CSS in total, and most visitors arrive once from outreach: inlining it in
    // <head> removes a render-blocking round trip (FCP and LCP on slow mobile networks).
    inlineCss: true,
  },
  images: {
    // Modern formats first: AVIF, then WebP, for every next/image.
    formats: ["image/avif", "image/webp"],
  },
  sassOptions: {
    // Lets every *.module.scss write `@use "mixins" as *;` without relative paths.
    loadPaths: [path.join(process.cwd(), "src/styles")],
  },
};

export default nextConfig;
