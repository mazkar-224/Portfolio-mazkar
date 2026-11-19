import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { PageMotion } from "@/components/PageMotion/PageMotion";
import { Preloader } from "@/components/Preloader/Preloader";
import { MotionToggle } from "@/components/MotionToggle/MotionToggle";
import { SkipLink } from "@/components/SkipLink/SkipLink";
import { SmoothScroll } from "@/components/SmoothScroll/SmoothScroll";
import { features, person, site, siteUrl } from "@/content";
import { fontVariables } from "./fonts";
import "lenis/dist/lenis.css";
import "@/styles/globals.scss";

// Site-wide metadata. Pages add their own canonical path and titles. The share image
// (opengraph-image.tsx, twitter-image.tsx) and icons (icon.svg, apple-icon.png,
// favicon.ico) are picked up by file convention.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: site.title,
  description: site.description,
  applicationName: person.name,
  authors: [{ name: person.name }],
  creator: person.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: person.name,
    title: site.title,
    description: site.description,
    locale: "en",
    firstName: person.givenName,
    lastName: person.familyName,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

// Runs before first paint:
// 1. Marks <html> as "js", so JS-only controls never flash and the no-JS fallbacks hide.
//    If the visitor switched motion off before (the "Motion" toggle, localStorage), sets
//    data-motion="off" and skips the preloader.
// 2. Decides whether this visit gets the preloader: first visit in this browser session
//    only (sessionStorage), never under reduced motion. When it does, <html> gets the
//    "preload" class (CSS shows the overlay) and data-intro="covered" (the hero intro may
//    run behind it). Without JavaScript neither is set, so there is no preloader at all.
// If anything throws (storage blocked), the page simply loads without a preloader.
//
// It's a plain inline <script> in <head>, run by the HTML parser. next/script's
// "beforeInteractive" was used before, but Next queues inline scripts until its runtime has
// downloaded, so on a slow connection the classes arrived after first paint (measured: 2.6s
// with delayed chunks, and the preloader then appeared over a page already on screen).
const bootScript = `(function(){var h=document.documentElement;h.classList.add('js');try{
if(localStorage.getItem('motion')==='off'){h.setAttribute('data-motion','off');return;}
${features.preloader ? "" : "return;"}
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
if(sessionStorage.getItem('signal-acquired'))return;
sessionStorage.setItem('signal-acquired','1');
h.classList.add('preload');h.setAttribute('data-intro','covered');
}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the inline script adds the "js" class before React hydrates.
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        {/* A static string defined above, with no user input in it. */}
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        {features.preloader && <Preloader />}
        <SkipLink />
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <MotionToggle />
        <SmoothScroll />
        <PageMotion />
      </body>
    </html>
  );
}
