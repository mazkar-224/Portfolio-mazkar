# Portfolio build: progress report

**As of 19 Nov 2026: final design approved and pushed.** Next step: deploy on Vercel's free Hobby plan by importing the GitHub repo (no settings to change).

## Final design (redesign 2, 19 Nov 2026)

After the reference site https://sarthak-sharma-portfolio-six.vercel.app/, in **pure black (#000) and red (#ff3d2e)**:
- **Hero:** your headshot, head and shoulders in neutral black and white, lit evenly on both sides, drawn as a fine dot screen by a WebGL shader (ripples under the mouse). Big serif "Muhammad *Azkar*", your job title in red under it, two-line tagline, "Explore my work" and "Start a conversation". No HUD cards, clock or CI badge.
- **Sections:** stats, About (red particle field that animates all the time and reacts to the mouse), Work, How I work (skills, with Kubernetes under "Familiar"), Experience, the black-and-white field photo band, Journey, Contact ("Something useful starts with *a hello.*"), and a footer with your links and a back-to-top button.
- **Motion on/off** button bottom-right; off stops smooth scroll, animations and 3D.
- Film grain removed so the black stays pitch black.
- Only two photos are used: `public/images/me/azkar-headshot-bw.png` and `azkar-field-band-bw.jpg`. Draft edits stay local, uncommitted.
- `.vercelignore` keeps `source/` (private CV with your phone number) out of any Vercel upload.

The sections below are history from the first redesign (purple), kept for reference.

---


**As of 18 Nov 2026.** All 11 original phases were built, approved and pushed. You then asked for a **redesign**:
- the look of https://sarthak-sharma-portfolio-six.vercel.app/, in **black and purple**
- your own photos
- the 3D chrome objects and effects from your 9 reference images

You also set aside the old `CLAUDE.md` rules. The redesign is built and running locally, and waiting for your review. It is **not committed or pushed yet**.

## The redesign (18 Nov 2026)

**Your photos:**
- The 5 originals are saved untouched in `source/photos/` (kept out of git).
- Backgrounds were removed on your Mac with Apple's built-in subject lifting (nothing uploaded).
- Each was graded into a black-chrome look with a violet tint.
- The hero uses photo 2 (blue suit). A full-width band uses photo 4 (the field). All edited files are in `public/images/me/`.

**What's on the page, top to bottom:**
1. **Floating frosted pill nav:** your name in serif, the links, and "Let's talk".
2. **Hero:**
   - "AZKAR" huge in Anton behind you, a violet glow ring, and your chrome portrait with a **live WebGL shader**: engraving lines at rest, liquid violet chrome near the mouse, a violet rim light
   - your name in Instrument Serif with an italic "Azkar"
   - side labels, and frosted cards with live data (open to work, Islamabad time, CloudCostGuard's live CI badge)
   - a floating **3D chrome star** with an orbit ring
3. **Stats strip,** real numbers only: 100 tests, 82% coverage, 6 public agents, 4 containers.
4. **About:** a **3D particle field** (about 5,000 points) that morphs between a wave grid, a vortex and a sphere through three tabs (Cloud / Automate / Build), beside your story.
5. **Work:**
   - a **3D chrome chess queen**, turned on a lathe in code
   - CloudCostGuard featured in a browser-window frame, with its metadata, live CI and links
   - two n8n agent cards
   - a list of more projects that turns violet on hover
6. **How I work:** four numbered steps, and an accordion of your real skill groups.
7. **Experience:** the FlyRank AI internship as a timeline.
8. **A full-width photo** of you in the field: "Built to run. *Made to last.*"
9. **Journey:** your real story with dates, plus education and certification cards.
10. **Close:** "LET'S BUILD SOMETHING RELIABLE." in two-tone Anton, a wireframe globe with a star, and Email me.

**New design system:**
- **Colours:** black #07050C, violet #A78BFA (stronger #8B5CF6, deep #4C1D95), lavender-white text #EFEAF7.
- **Fonts:** Instrument Serif, DM Sans, Anton and JetBrains Mono.
- **Share image:** now purple, with your portrait.

**How the 3D loads:**
- Every 3D piece loads only after the visitor's first interaction (a mouse move counts), then when the browser is idle.
- Each scene runs only near the screen and is removed when far away.
- Under reduced motion or without WebGL, the plain graded photo and static glows show instead.
- `features.webglEffect` in `src/content/site.ts` turns all 3D off.

**Measured (production build, this Mac; the CPU benchmark had dropped to about 1,250 against about 2,100 earlier):**

| | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| Desktop | 99 | 100 | 100 | 100 | 0.3s | 0.7s | 10ms | 0.044 |
| Mobile (simulated), 3 runs | 71–77 | 100 | 100 | 100 | 1.2s | 3.3–4.0s | 600–650ms | 0.007 |

**Notes on the numbers:**
- Mobile is slower than the first design (about 95): the photo is now the largest element painted, and the new visuals are heavier.
- **Fixes made along the way:**
  - 3D at page load raised blocking time to 1–10s, so it now waits for interaction
  - frosted blur on cards was costly, so it's now on the nav only
  - the giant word shifted when its font loaded, so its box size is now fixed
- First-load JavaScript is 185 KB. Three.js is never in it.

**Not done yet:** a chess knight (needs a 3D model file); a photo-optimisation pass for mobile speed.

---

## Where each phase stands

| # | Phase | Status |
|---|---|---|
| 0 | Discovery and plan (`PLAN.md`) | Done, approved |
| 1 | Scaffold and design system | Done, approved |
| 2 | Content layer | Done, approved |
| 3 | Layout shell and animation setup | Done, approved |
| 4 | Static hero and Lighthouse baseline | Done, approved |
| 5 | Content sections, static | Done, approved |
| 6 | Animation pass | Done, approved |
| 7 | Preloader | Done, approved |
| 8 | WebGL effect (your pick: the CloudCostGuard screenshot resolving out of noise) | Done, approved |
| 9 | SEO and AI discoverability | Done, approved |
| 10 | QA | Done, approved |
| 11 | Handoff README | **Done**; waiting for your review |

---

## What each phase produced

### Phase 0: plan
- `PLAN.md` holds the design tokens with measured contrast, the site structure, the photo verdict, WebGL and favicon options, the animation storyboard, conflicts and content gaps.
- You approved WebGL option A (never on your face) and favicon 1 (the abstract "spike" line, no initials).
- `CLAUDE.md` was rewritten from scratch, using only your build prompt and your 5 attached files.

### Phase 1: scaffold and design system
- Next.js 16.4.6 (App Router, TypeScript) with SCSS modules. No Tailwind, no UI libraries.
- Design tokens are in `src/styles/_tokens.scss`. Colours, type scale, spacing, motion and layers are all CSS variables.
- New colour: `--ash-paper` (#565B63), because `--ash` fails contrast on the light section.
- Mixins (`_mixins.scss`) cover breakpoints, the focus ring, the light-section switch, the grid and the crosshair frame. Typography is in `_typography.scss`, and the reset, grain overlay and utilities are in `globals.scss`.
- **Your decision:** the hero shows **M.AZKAR on one line** (15vw, up to 220px). Screen readers and Google still get "Muhammad Azkar".

### Phase 2: content layer
- All site text lives in typed files in `src/content/`, never inside components.
- Copy is word for word from `landing-page-copy.md`. A script checked every line.
- Missing facts show as visible `[[NEEDS: ...]]` markers, never invented text.
- The 10 real screenshots are copied to `public/images/projects/` with clean names. Your originals are untouched.

### Phase 3: layout shell and animation setup
- **Public CV** at `/cv/Muhammad-Azkar-CV.pdf`:
  - phone number removed, "CloudGuard" renamed to "CloudCostGuard"
  - 2 pages
  - your source CV in `source/cv/` is untouched
- **Header:** the "Open to work" status, with no logo or name, and the nav. Phones get a "Menu" button that opens a full-screen menu. Keyboard handling (focus trap, Escape) and scroll lock are included.
- **Footer:** live Islamabad clock, live CloudCostGuard CI badge, section links, email, LinkedIn and GitHub.
- **Skip link** on every page.
- **Animation setup:** GSAP plugins are registered once, and Lenis smooth scrolling runs on the GSAP clock. With reduced motion turned on, smooth scrolling is off.
- **Without JavaScript,** the whole site still works and every link is in the HTML.

### Phase 4: static hero
- **Hero:** name, title, description, availability, three buttons (Email me, Download CV, GitHub), and the HUD strip with the live clock. No photo.
- **Performance fixes:**
  - **Layout shift:** removed (CLS 0.091 → 0).
  - **First-load JavaScript:** 240KB → 179KB. Animation libraries now load after first paint.
  - **CSS:** inlined into the page, which saves a network round trip.
  - **Fonts:** trimmed to the weights and characters actually used. Archivo went from 88KB to 53KB and JetBrains Mono from 40KB to 13KB. Details are in `src/fonts/README.md`.

### Phase 5, part 1: CloudCostGuard and Experience
- **CloudCostGuard:**
  - metadata grid and the `[[NEEDS: walkthrough video URL]]` marker
  - both screenshots in crosshair frames
  - the four case-study blocks, with the live CI badge
  - a thin-line **architecture diagram** drawn from your repo's `ARCHITECTURE.md`, horizontal on desktop and vertical on phones
  - the offline note and three doc links
- **Professional experience:** the FlyRank AI internship as a vertical timeline, with the repo link.

### Phase 5, part 2: AI automation and Smaller AWS work
- **AI automation, the light "paper" section:**
  - the heading, intro and repo note, word for word
  - six workflow cards, one column on phones and two from 768px. Each has its real n8n screenshot in a crosshair frame, the name, the one-line description, and the repo folder name in mono.
  - the whole card is the link to its folder: one tab stop per card, and keyboard focus rings the whole card
  - the "Want something like this for your team?" line with the "See what I can build for you →" button to `/services`
  - the void-to-paper wipe comes in Phase 6
- **Smaller AWS work:** the resource tracker and the static EC2 site side by side from 1024px, each with its GitHub link. `set -euo pipefail` is set as code. No VPC design.
- **Small shared fixes:**
  - the outlined button now follows the section colours, so it works on paper
  - the three "Code on GitHub" links each tell screen readers which project they belong to, with hidden text and no visible change
- **Checked:**
  - in the browser at 375, 768, 1280 and 1440px, with no sideways scroll
  - keyboard focus
  - type check, lint and production build all clean
- **Font trade-off:** I first set "n8n" in the italic accent serif. That loads a third font (16KB) and measured 0.3s slower simulated first paint (1.2s against 0.9s). "n8n" now stays lowercase in the heading face instead. Any accent word added later costs the same.
- **Left out on purpose:** the browser agent and the RAG agent each have a second screenshot. Cards show only the first, so all six cards stay the same shape.

### Phase 5, part 3: Skills and Education
- **Skills:**
  - the four evidence groups, word for word, as plain mono lists in each item's own case (n8n, boto3, moto). No bars, percentages, ratings or logos.
  - each group is a row: its dim label on the left, the list on the right from 1024px
  - 2 columns on phones and tablets, 3 on desktop. Two columns on a phone halve the scroll through the 33 shipped-project items.
  - Kubernetes appears only under "Learning now"
  - the VPC line stays off the site
- **Education and certifications:**
  - the title is the copy's own line, "BS Computer Science, University of Peshawar": the degree in the display face, the school under it
  - "2022 to 2026" and "CGPA 3.43/4.00" in mono on the left
  - the two society roles and the seven certifications on the right, one certificate per row under hairlines
  - no certification dates, because none were recorded
- **Checked:**
  - in the browser at 375, 768 and 1440px, with no sideways scroll
  - type check, lint and production build all clean
  - the UI checker found no duplicate link names now, and no new issues

### Phase 5, part 4: Contact and `/services`
- **Contact**, the last home section:
  - "Let's talk" and the sentence from the copy, which already gives the time zone. The footer right under it repeats the live clock.
  - a huge "Email me →" mailto link, up to 80px. An orange underline draws in on hover and keyboard focus.
  - your address in plain mono text under it, for people who copy it
  - LinkedIn and GitHub links
- **`/services`:**
  - its own page title, "What I can build for you | Muhammad Azkar"
  - one h1, "What I can build for you", then the intro
  - the 8-row services table, word for word, each row linking to its proof projects
  - on desktop it's a real two-column table. On phones each row stacks: the service, then "See it working", then its links.
  - the closing line and the orange "Email me" button
  - no testimonials, prices or ratings
  - the Fiverr-profile gap stays a `TODO:` in the data and isn't shown on the page, because you only want it if you have profiles
- **The `/services` prefetch 404 is gone.** The only 404 left is the favicon, which comes in Phase 9.
- **Checked:**
  - both pages in the browser at 375 and 1440px, with no sideways scroll
  - type check, lint and production build all clean
  - the UI checker found no new issues on either page

### Phase 6: animation pass
**What moves:**

| Where | Effect |
|---|---|
| Every section title | Lines rise from a mask (0.9s, 0.08s apart). The small label above fades in. |
| Body text and blocks | Fade up 12px (0.6s). Lists arrive one item after another, always finishing within 1.2s. |
| Screenshots | Wipe in top to bottom inside the crosshair frame, settling from 1.08 scale (1.2s). The frame and "+" marks stay still. |
| CloudCostGuard | The four case-study blocks arrive one after another like log lines. The architecture diagram draws itself (DrawSVG), then its labels appear. |
| Experience | The timeline hairline draws down as you scroll. Each highlight fades up. |
| AI automation | The section wipes from void to paper, left to right, in 1.2s. |
| Workflow cards (desktop) | Slit-scan on hover and keyboard focus: six bands slide back into line in 300ms and end clean. The "+" corners nudge outwards. |
| Desktop nav | Letter roll on hover and keyboard focus (0.4s, 15ms per letter). |
| Orange buttons (desktop) | Follow the mouse slightly (magnetic). They press to 0.98 on click. |

**Rules it keeps:**
- **Nothing is hidden before JavaScript, and nothing visible is ever hidden.** Content already on screen when the animation code arrives is left alone. Only content still below the fold gets its "before" state.
- **Without JavaScript, or with reduced motion on,** every element is fully visible. There's no smooth scroll, no split text and no scrubbing. Both were checked in Chrome.
- **Nothing hides content for longer than 1.2s.** Every reveal plays once and in full. The only scroll-linked effect is the decorative timeline hairline.
- **Screen readers** read every split heading as the original sentence.
- **Loading:**
  - the animation code loads on your first scroll, touch, click or key press, never during page load
  - section setup runs one section at a time, so it never blocks scrolling
  - the letter-roll markup is added after the page loads, and only on desktop
- **Hero intro:** built as one timeline (label, name, copy, actions, HUD). It plays only behind the Phase 7 preloader. The hero is already painted when JavaScript arrives, so replaying an intro then would hide visible text.

**Measured fixes along the way:**
- **Blocking time:** starting the animations at idle time raised it from 40ms to 160ms. Starting on first interaction brought it back to 40–60ms.
- **First paint:** the letter roll's per-letter markup in the server HTML cost 0.2s (0.9s to 1.1s), measured with an A/B build. Rendering it after the page loads brought first paint back to 0.9s.
- **Page weight:** the slit-scan bands are built in the browser from the image the card already loaded, so they add no HTML and no download.

**Left out on purpose:**
- **Pinning CloudCostGuard's steps while you scroll.** A pinned scroll would hold text hidden while the reader pauses, which CLAUDE.md forbids.
- **The nav colour flip over the paper section.** The header has its own solid background, so it stays readable there.

**One deviation from CLAUDE.md, explained:**
- CLAUDE.md asks for `useGSAP()` inside each component. Importing GSAP into a component puts it back in the first download (240KB instead of 179KB).
- Instead, one loader (`PageMotion`) loads `src/animations/run.ts` later. That runs each section's factory in its own `gsap.context()` inside `gsap.matchMedia()`, which gives the same scoping and cleanup that `useGSAP()` provides.
- The factories are `cloudcostguard.ts`, `experience.ts`, `automation.ts` and `hero.ts`, plus the shared reveals in `reveal.ts`.

**No new visible strings in Phase 6.**

### Phase 7: preloader
- **What it does:**
  - one mono line, `ACQUIRING SIGNAL`, and a 1px orange hairline filling left to right, on a dark overlay
  - no logo and no name
  - the page underneath is fully rendered and painted first
- **When it shows:** only on your first visit in a browser session. It never shows with reduced motion on or without JavaScript. A small script in `<head>` decides this before anything paints.
- **The exit:** at about 0.75s the label lifts away and the overlay clips off the page from the top, so it's gone by about 1.2s. As it lifts, the **hero intro** plays: the location line, then "M.AZKAR" rising from a mask, then the title and description, the buttons, and the HUD columns. Everything is visible by about 3s.
- **If JavaScript is slow or fails,** a CSS-only exit ends the overlay by 1.2s on its own, and the hero is never hidden. Tested with every script delayed 2.5s.
- **A Phase 3 bug found and fixed:** Next.js's `<Script strategy="beforeInteractive">` doesn't run until the Next runtime downloads. So the "js" class, and now the preloader decision, arrived after first paint on slow connections. With scripts delayed, the preloader appeared at 2.6s on top of a page already showing. It's now a plain inline script in `<head>`.
- **Checked in Chrome, at timed intervals:**
  - first visit: overlay gone at about 1.19s, everything visible after the intro
  - repeat visit: no overlay
  - reduced motion: none
  - no JavaScript: none
  - slow JavaScript: CSS exit at about 1.2s
  - type check, lint and build: clean
- **Measurement note:** today's Lighthouse runs drifted. The exact Phase 6 code now measures first paint 1.1s / largest paint 2.6s on this Mac, against 0.9s / 2.5s an hour earlier, with the same Chrome, Lighthouse and server response time. Compared within the same session, Phase 7 adds about 0.2–0.4s to the simulated mobile largest paint and nothing to first paint. Chrome's actual paint of the hero is unchanged, at about 0.19s.
- **New visible string:** "ACQUIRING SIGNAL", taken from CLAUDE.md and the theme's boot screen.

### Phase 8: WebGL, "signal from noise"
- **What it does:** when the CloudCostGuard case study scrolls in, the real dashboard screenshot arrives as monospace characters and grain on void. Its text, lines and coloured charts are the bright characters, and the white background is empty. It then resolves cell by cell into the clean screenshot in 1.2s. Near the mouse, it briefly breaks back into characters.
- **How it's built:**
  - one React Three Fiber canvas with one plane and one shader
  - shader code in `src/webgl/signalShader.ts`, every uniform commented
  - the character atlas drawn in JetBrains Mono (`glyphAtlas.ts`)
  - the scene in `SignalImage.tsx`, loaded by `SignalShot.tsx`
- **Fallback:** the real `<img>` never leaves the frame. The canvas is laid over it only after its first frame is drawn, so nothing shifts. It's never on a photo of you.
- **Who gets it:** desktop with a real mouse only. Not with reduced motion, without WebGL, with Save-Data, or on machines with under 4 CPU cores or 4 GB of memory.
  - Phones and tablets keep the plain screenshot. Parsing the 239 KB 3D library mid-scroll would stutter there, and the mouse half of the effect can't work on touch.
- **When it loads:** after the page load, after your first scroll, touch, click or key press, when the browser is idle, and only once the screenshot is within a screen and a half.
  - It renders only while something moves. It stops off-screen and when the tab is hidden.
  - The device pixel ratio is capped at 1.75.
  - Textures are disposed when it's removed. There's exactly one WebGL context, checked after navigating away and back.
- **It never turns a visible image back into noise.** If the screenshot is already on screen when everything is ready, it skips to the clean state.
- **Bundle:** Three.js is not in the first download. First-load JavaScript is still 183 KB; Three.js and React Three Fiber are a separate 239 KB lazy chunk.
- **Measured fix:** the first version loaded at idle time, and Lighthouse's mobile blocking time jumped to 380–1,030ms. Gating it on first interaction and desktop brought it back.
- **Checked:** desktop with a mouse (reveal and cursor effect, verified by screenshots), phone (plain screenshot), reduced motion and no JavaScript (plain screenshot); type check, lint and build all clean.
- **Known noise:** Three.js 0.187 logs a deprecation warning ("THREE.Clock … use THREE.Timer") from inside React Three Fiber. It's a warning, not an error.
- **npm audit:** 15 "high" advisories, all from one `picomatch` ReDoS issue in the dev-only lint tooling. Nothing ships to visitors, and none of it is from Three.js. It goes on the Phase 10 QA list.
- **No new visible strings.**

### Phase 9: SEO and AI discoverability
- **Your domain, with no guessing:** every absolute URL comes from one function, `siteUrl()` in `src/content/site.ts`.
  - It uses `SITE_URL` if you set it. Otherwise it uses the production address Vercel provides on every deploy (your `*.vercel.app` or custom domain), and `localhost` only for local builds.
  - Tested with a pretend Vercel address: the canonical link, share image, sitemap and robots.txt all switched to it.
- **Metadata on both pages:**
  - title, description and canonical link
  - Open Graph (a `profile` on home) and an X large-image card
  - author and robots tags
  - icons
- **Social share image:** generated by code (`src/app/opengraph-image.tsx`) at build time as a static 1200×630 PNG, on home and `/services`.
  - It shows your name, title, location, "Open to work" with the green dot, and the CLOUD and AUTOMATION HUD values.
  - It uses your own fonts (static copies in `src/app/og-assets/`), the hairline frame with "+" corners, one short orange line and a faint teal glow.
  - No photo, no logo.
- **Favicon, your pick 1, the spike:** `icon.svg`, plus a 16/32/48 px `favicon.ico` and a 180 px Apple touch icon. A flat bone line with one orange spike on void, and no initials.
- **`robots.txt`:** everyone may crawl everything, and the AI crawlers are named explicitly so search and assistants can cite you. The names were checked today against each company's own documentation:
  - OpenAI: GPTBot, OAI-SearchBot, ChatGPT-User
  - Anthropic: ClaudeBot, Claude-User, Claude-SearchBot
  - Perplexity: PerplexityBot, Perplexity-User
  - Google: Google-Extended
  - Apple: Applebot, Applebot-Extended
  - Common Crawl: CCBot
  - Meta: meta-externalagent, meta-externalfetcher, meta-webindexer
- **`sitemap.xml`:** home, `/services` and the public CV.
- **Structured data (JSON-LD) on home:** a `ProfilePage` whose main entity is a `Person`. It has your name, "M.Azkar", title, description, email, Islamabad, PK, the University of Peshawar, and `sameAs` links to GitHub and LinkedIn. There's no photo and no employer.
- **`/llms.txt` and `/llms-full.txt`:** generated from `src/content`, so they always match the site word for word. `llms.txt` is a map with links; `llms-full.txt` holds every section's text.
- **Everything is static:** every new route is prerendered at build time.
- **Checked:**
  - With JavaScript off, both pages show all their content: one h1, every link, the CV download and the structured data.
  - Type check, lint and build are clean.
- **New strings:**
  - the share image's alt text, "Muhammad Azkar, DevOps & AI Automation Engineer, Islamabad, Pakistan"
  - two `llms.txt` headings, "Pages" and "Full text for language models"

### Phase 10: QA (production build, this Mac, 18 Nov 2026)

| Check | Result |
|---|---|
| Type check, lint, build | Clean. Every route is static. |
| Layout at 375, 768, 1024, 1280, 1440px, both pages | No sideways scroll, no console errors, no clipped text. Full-page screenshots reviewed. |
| Keyboard | Home has 37 tab stops, `/services` 32. Skip link first. Every stop has a visible focus ring; the workflow cards draw theirs on the card (2px). Phone menu: a modal dialog that keeps focus inside; Escape closes it and focus returns to "Menu". Nav links read once ("CloudCostGuard", not doubled by the letter roll). |
| Links (26 on both pages) | 7 page anchors, the CV and `/services`, and all 16 GitHub links (repos, docs, workflow folders, CI) return 200. The live CI badge reads **passing**. LinkedIn answers bots with code 999, so it can't be checked by script: click it once yourself. |
| Reduced motion | No preloader, smooth scroll, split text or WebGL. Nothing hidden. |
| No JavaScript | All content, every link, the CV download and the JSON-LD are present; one h1 per page; no preloader. |
| Preloader | First visit: gone by about 1.2s, intro done by about 3s. Repeat visit: none. JavaScript delayed 2.5s: the CSS fallback ends it at about 1.2s, and the hero is never hidden. |
| WebGL | Desktop with a mouse: loads only after first interaction, one canvas. Phone and reduced motion: never loads. |
| Public CV | Rendered and read: no phone number, "CloudCostGuard" spelled right. |
| Copy | No anti-slop words and no em dashes in `src/content`. |

**Lighthouse, final:**

| Page | Mode | Perf | A11y | Best practices | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|---|
| Home | Mobile, simulated, 3 runs | 95–96 | 100 | 100 | 100 | 1.1s | 2.7–2.8s | 60–80ms | 0 |
| Home | Desktop, 2 runs | 99–100 | 100 | 100 | 100 | 0.3s | 0.7–0.8s | 0ms | 0 |
| `/services` | Mobile, simulated, 3 runs | 93–97 | 100 | 100 | 100 | 0.9s | 2.6s | 60–220ms* | 0 |
| `/services` | Desktop, 2 runs | 100 | 100 | 100 | 100 | 0.2s | 0.5–0.6s | 0ms | 0 |

\* The single 220ms run coincided with the Mac's lowest CPU benchmark (1,582); the other two runs were 60ms.

**Against the targets in CLAUDE.md:**
- **Met:** FCP under 1.2s, CLS under 0.05 and TBT under 150ms (typical runs), on mobile and desktop.
- **Not met:** simulated mobile LCP (2.6–2.8s against 2.0s). As measured since Phase 4, Chrome actually paints the hero at about 0.19s. The simulated number is mostly the download of the Next.js and React runtime (about 170 KB), which every page on this stack carries, plus today's measurement drift. You accepted this baseline in Phase 4.

**Bundle report.** `next analyze` (Turbopack's built-in analyzer) wrote its report to `.next/diagnostics/analyze/`; run `npx next analyze` to browse it. `@next/bundle-analyzer`, the one CLAUDE.md names, only works with webpack, not the Turbopack build this project uses.
- **First download:**
  - home: 43 KB of HTML plus 184 KB of JavaScript (compressed)
  - `/services`: 26 KB of HTML plus 178 KB of JavaScript
- **Loaded later, only when needed:**
  - Three.js and React Three Fiber, 238 KB, desktop only after first interaction
  - GSAP with its plugins, 47 KB, after first interaction
  - the Lenis chunk, 43 KB, at idle time; it may also hold other shared code
  - the preloader exit and section factories, about 1 KB each

**Fixed during QA:** `site.ts` still flagged "public CV PDF without the phone number" as missing, although that PDF has existed since Phase 3. The stale gap is removed.

**npm audit:** 15 "high" advisories, all one `picomatch` ReDoS issue inside the dev-only lint tools. The only fix npm offers is a downgrade of the Next.js lint config to version 14, which would break linting on Next 16. I tried `npm audit fix`: it changed nothing useful, so I restored the lockfile. Nothing affected ships to visitors. Check again when `eslint-config-next` updates.

**Remaining gaps (`TODO:` in `src/content`):**
1. **Real photo** (`hero.ts`). The hero ships without one.
2. **Walkthrough video URL** (`cloudcostguard.ts`). The page shows a `[[NEEDS: walkthrough video URL]]` marker, the only visible marker left.
3. **Fiverr or other profile URLs** (`services.ts`), only if you want them; nothing shows until then.
4. **Domain** (`site.ts`). This doesn't block launch: Vercel's address is used automatically.

### Phase 11: handoff
- **`README.md`** covers:
  - running it locally (Node 20.9+), plus the three checks before publishing
  - a folder map, and a table of which content file holds which section
  - the honesty rules, and how to add a workflow card
  - the open gaps, and how photos must be handled
  - every animation file and what it does
  - the two on/off switches
  - search and AI files
  - deploying to Vercel step by step, measuring speed and bundle size, font licences and known items
- **On/off switches** in `src/content/site.ts` (`features.preloader`, `features.webglEffect`). Tested in a real build with both off (no preloader markup, no canvas) and both back on.
- **`.gitignore` now protects your private files.** It keeps out `source/` (your full CV with the phone number, notes, the AI headshot), `.claude/` and `CLAUDE.md`, as well as `.env*`, `node_modules/` and `.next/`. Tested in a scratch repository.
- **Two things the README says plainly aren't built yet:**
  - the hero photo frame, which waits for a real photo
  - a video player for the walkthrough: setting the URL would only remove the marker
- **No new visible strings.**

### After handoff: two preloader fixes (found while showing you the site)
1. **Hydration race.** In development, the preloader started the hero intro before React had hydrated the hero, and React reported a mismatch. Now the hero starts its own intro after it hydrates, through a second `PreloaderExit` inside the hero. The layout's copy handles pages without a hero. Fresh first visits now log no errors.
2. **The overlay could get stuck.** The exit waited on the hairline's CSS animation. When a browser pauses animations (a page opened in a hidden or background tab), that wait never ended, and the CSS fallback had already been cancelled, so the page stayed covered. Now:
   - every wait has a time limit
   - a hidden tab keeps the CSS-only exit
   - a safety timer always removes the overlay within 2.5s of a takeover, and jumps the hero intro to its end state
   - Tested with all CSS animations frozen: the page is uncovered by 3s, on home and on `/services`. Normal visits are unchanged.

### Side work (18 Nov, your requests): Open Design
- **Installed:** Open Design 0.27.1, checked against its SHA-256 and notarized by Apple.
- **Connected:** its MCP server is in Claude Desktop's config, with absolute paths. The original config is backed up next to it.
- **Tried with your free credits:** a design review, preloader concepts, a share image and a hero study.
  - Three runs were rejected by the free plan's three-at-a-time limit.
  - The others stopped at a plan and waited for approval, then the free credits ran out.
  - Only a draft share image was written, and it was never reviewed.
- **At your request, Open Design was then removed from the Mac completely**, which freed about 1.2 GB:
  - the app, its data and settings, its agent runtime (`~/.amr`) and its temporary files
  - its Claude Desktop entry
  - the config backup
- **Your Open Design account** at open-design.ai still exists. Delete it on their site if you want it gone too.
- Nothing from Open Design is in the site.

---

## Measured performance

Production build on this Mac, Lighthouse 12.8.2, run 3 times each.

| When | Mode | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|
| Phase 4 (hero only) | Mobile, simulated (default) | 0.8s | 2.2–2.3s | 40ms | 0 |
| Phase 4 (hero only) | Mobile, real throttling | 0.8s | 0.8s | 110–240ms | 0 |
| Phase 5 part 1 | Mobile, simulated (default) | 0.9s | 2.4–2.5s | 40–130ms | 0 |
| Phase 5 part 1 | Mobile, real throttling | 0.9–1.0s | 0.9–1.0s | 130–230ms | 0 |
| Phase 5 part 1 | Desktop | 0.2s | 0.5s | 0ms | 0 |
| Phase 5 part 2 (accent serif on "n8n") | Mobile, simulated (default) | 1.2s | 2.5–2.6s | 40ms | 0 |
| Phase 5 part 2 (as shipped, no serif) | Mobile, simulated (default), 2 runs | 0.9s | 2.4–2.5s | 40–50ms | 0 |
| Phase 5 part 2 (accent serif on "n8n") | Desktop | 0.3s | 0.7s | 0ms | 0 |
| Phase 5 part 3 | Mobile, simulated (default) | 0.9s | 2.4–2.5s | 40ms | 0 |
| Phase 5 part 3 | Desktop | 0.2s | 0.5s | 0ms | 0 |
| **End of Phase 5: baseline for Phase 6**, home | Mobile, simulated (default), 3 runs | 0.9s | 2.5s | 40–50ms | 0 |
| **End of Phase 5**, home | Desktop | 0.2s | 0.5s | 0ms | 0 |
| **End of Phase 5**, `/services` | Mobile, simulated (default), 3 runs | 0.9s | 2.3–2.4s | 40–80ms | 0 |
| **End of Phase 5**, `/services` | Desktop | 0.2s | 0.5s | 0ms | 0 |
| **Phase 6**, home | Mobile, simulated (default), 3 runs | 0.9s | 2.4–2.5s | 40–60ms | 0 |
| **Phase 6**, home | Desktop | 0.2s | 0.5s | 0ms | 0 |
| **Phase 6**, `/services` | Mobile, simulated (default), 3 runs | 0.9s | 2.4s | 40ms | 0 |
| **Phase 6**, `/services` | Desktop | 0.2s | 0.5s | 0ms | 0 |
| Phase 6 code, re-measured an hour later (drift check), home | Mobile, simulated, 3 runs | 1.1s | 2.6s | n/a | 0 |
| **Phase 7** (preloader shows on every Lighthouse run), home | Mobile, simulated, 5 runs | 1.1s | 2.8–3.0s | 60–130ms | 0 |
| **Phase 7**, home | Desktop | 0.3s | 0.6s | 0ms | 0 |
| **Phase 7**, `/services` | Mobile, simulated, 3 runs | 0.9s | 2.5–2.6s | 60ms | 0 |
| **Phase 7**, `/services` | Desktop | 0.2s | 0.6s | 0ms | 0 |
| **Phase 8**, home (Three.js not loaded during the test, as intended) | Mobile, simulated, 3 runs | 1.1s | 2.8–3.0s | 60–240ms* | 0 |
| **Phase 8**, home | Desktop | 0.3s | 0.6s | 0ms | 0 |
| **Phase 8**, `/services` | Mobile, simulated, 3 runs | 0.9s | 2.4–2.5s | 60–210ms* | 0 |
| **Phase 8**, `/services` | Desktop | 0.2s | 0.6s | 0ms | 0 |

| **Phase 9**, home | Mobile, simulated, 3 runs | 1.1s | 2.7–2.8s | 70–80ms | 0 |
| **Phase 9**, home | Desktop | 0.3s | 0.6s | 0ms | 0 |
| **Phase 9**, `/services` | Mobile, simulated, 3 runs | 0.9s | 2.6s | 50–60ms | 0 |
| **Phase 9**, `/services` | Desktop | 0.2s | 0.5s | 0ms | 0 |

\* The Mac's CPU benchmark dropped during these runs (1,500 to 1,900, against about 2,100 earlier), and `/services`, which has no WebGL at all, varied the same way.

- **Scores (Phase 9):** Accessibility 100, Best Practices 100 and SEO 100 on both pages. Best Practices was 96 until the favicon existed.
- **The simulated LCP target (2.0s) is not met.** The text actually appears in under 0.1s. Lighthouse's simulation adds the download time of the Next.js and React runtime (about 170KB), which every page of this stack carries. You accepted 2.2–2.3s as the baseline.
- **The page will grow** as content is added. I suggest a fresh baseline at the end of Phase 5, and Phase 6's rule that animation must not make LCP or FCP worse is checked against that.

---

## New strings you approved, or that are waiting for approval

- **Approved:**
  - metadata grid values
  - nav labels
  - diagram labels
  - screenshot alt text
  - CI badge alt
  - "Skip to content", "Menu" / "Close", "Site menu"
  - footer labels: Local time, CloudCostGuard CI, Sections, Contact
- **Approved (Phase 5 part 1):** "AWS APIs via boto3", the label on the diagram's AWS box.
- **Approved (Phase 5 part 2):**
  - the "Cloud" label on Smaller AWS work
  - the repo folder names on the workflow cards
  - the hidden screen-reader text after each "Code on GitHub" link
- **Approved (Phase 5 part 3):** "Stack" on Skills.
- **Approved (Phase 5 part 4):** the "Services" label, the `/services` page title and its description.

---

## Still needed from you

1. **Walkthrough video URL** for CloudCostGuard. The shot list is in `source/next-steps.md`.
2. **A real photo.** The site shows none until one exists. The shoot guide is in `source/next-steps.md`.
3. **Site domain:** not blocking any more. Vercel's production address is picked up automatically. Set `SITE_URL` only if you add a custom domain.
4. **Fiverr or other profile URLs**, only if you want them on `/services`.
5. **Optional:** fresh CloudCostGuard screenshots. The current ones show the old name "CloudGuard" in the sidebar and a browser-extension bubble in the corner.
6. **Before launch, on your side:**
   - Apply the repo patches in `source/next-steps.md`. The CloudCostGuard README still says "CloudGuard", and the aws-resource-tracker README still links the old LinkedIn URL.
   - Update your GitHub and LinkedIn headlines.

## Open choices for later

- **Footer line:** add "Built with Next.js and SCSS, hosted on Vercel."? Not added; your call.
- **Your CV source** (`source/cv/`) still says "CloudGuard" and doesn't list React. Only the public copy was corrected.

---

## How to run it

```bash
cd ~/Downloads/azkar-portfolio
npm run dev
```

Then open http://localhost:3000. Use `npm run build` and `npm start` for the production version.
