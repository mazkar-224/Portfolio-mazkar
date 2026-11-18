# Muhammad Azkar: portfolio

The personal site of Muhammad Azkar, DevOps & AI Automation Engineer in Islamabad, Pakistan.

- **Pages:** a one-page home and a `/services` page.
- **Stack:** Next.js 16 (App Router, TypeScript) with SCSS modules.
- **Animation:** GSAP, Lenis and Motion, plus one Three.js effect.
- **Hosting:** a fully static build, made for Vercel's free tier.

Everything a visitor reads lives in typed data files under `src/content/`, so editing the site rarely means touching a component.

---

## Run it locally

You need Node.js 20.9 or newer. It was built and tested on Node 26.

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000. Changes reload as you save.

To check the real production build:

```bash
npm run build
```

```bash
npm start
```

Before you publish anything, run all three checks. Each should finish with no errors.

```bash
npx tsc --noEmit
```

```bash
npm run lint
```

```bash
npm run build
```

---

## Where things are

| Folder | What's in it |
|---|---|
| `src/content/` | **All site text and links.** One file per section (see below). |
| `src/components/` | One folder per component: a `.tsx` file and its `.module.scss`. |
| `src/styles/` | Design tokens (`_tokens.scss`), mixins, typography and global styles. |
| `src/animations/` | Every animation: GSAP setup, one file per section, the preloader exit. |
| `src/webgl/` | The one WebGL effect: shader, character atlas and scene. |
| `src/app/` | Pages, layout, metadata, share image, icons, `robots`, `sitemap`, `llms.txt`. |
| `src/fonts/` | The self-hosted, trimmed fonts. Their README explains how they were made. |
| `public/images/projects/` | The real project screenshots. |
| `public/cv/` | The public CV, a copy without the phone number. |
| `source/` | Private source material: the brief, copy, notes, the full CV. **Never published**, and ignored by git. |

---

## Editing content

Open the file for the section you want to change, edit the text between the quotes, and save.

| Section | File |
|---|---|
| Name, title, email, profile links, repo links, page title and description | `src/content/site.ts` |
| Hero: description, availability, buttons, HUD strip | `src/content/hero.ts` |
| CloudCostGuard case study, metadata grid, diagram labels | `src/content/cloudcostguard.ts` |
| Professional experience | `src/content/experience.ts` |
| AI automation workflows (cards, screenshots, folder links) | `src/content/automation.ts` |
| Smaller AWS work | `src/content/aws.ts` |
| Skills | `src/content/skills.ts` |
| Education and certifications | `src/content/education.ts` |
| Contact | `src/content/contact.ts` |
| `/services` table | `src/content/services.ts` |
| Menu, footer and preloader labels | `src/content/ui.ts` |

**Rules that keep the site honest:**
- Only write facts that are true and that you can point to.
- No invented numbers, clients, testimonials or ratings.
- If something is missing, use the `needs("...")` helper, which shows a visible `[[NEEDS: ...]]` marker, instead of filling the gap with guesswork.
- Avoid em dashes and the overused words listed in `CLAUDE.md` ("passionate", "leverage", "seamless"...).

**The search and AI files update themselves.** `/llms.txt`, `/llms-full.txt`, the structured data and the share image are all built from these same files.

### Adding a workflow card
- Copy the screenshot into `public/images/projects/`.
- Add an entry to `workflows` in `src/content/automation.ts`, with the image's real width and height (open it in Preview, then Tools, then Show Inspector).
- Write alt text that describes what the screenshot shows.

### Gaps still open (`TODO:` in the content files)
- **Walkthrough video** (`cloudcostguard.ts`, `video`). The page shows a `[[NEEDS: walkthrough video URL]]` marker. Setting the URL removes the marker, but **no video player is built yet**, so plan that as a small follow-up before you add it.
- **Real photo** (`hero.ts`, `photo`). See below.
- **Fiverr or other profile links** (`services.ts`, `platformProfiles`), only if you want them. Nothing shows until then.

---

## Photos

The site has no photo of Muhammad yet. **No AI-generated, stock or retouched portraits, ever.** The Gemini headshot in `source/` must not be used. The shoot guide is in `source/next-steps.md`.

When real photos exist:
1. Rank them on sharpness, light on the face, eye contact, expression, a clean background and resolution. Use the best one in the hero and at most one or two elsewhere.
2. Copy the chosen files into `public/images/` with clean names, such as `muhammad-azkar-hero.jpg`. Never edit or delete the originals.
3. **The hero's photo frame isn't built yet.** Adding it is a small, separate task. It needs `next/image` with `priority`, correct `sizes`, a crosshair frame, a tuned `object-position`, and specific alt text (never "profile image"). After that, the photo goes in `hero.ts` in place of `needs("real photo")`.

Allowed on photos: cropping, consistent framing, a subtle frame, gentle reveals. **Not allowed:** filters, skin smoothing, any AI change to the face, or any WebGL or glitch effect on it.

---

## Animation: where the timelines live

GSAP is the only animation library for scroll and timelines. Lenis smooths scrolling. Motion only opens and closes the phone menu.

| File | What it does |
|---|---|
| `src/animations/gsap.ts` | Registers the GSAP plugins once. Always import `gsap` from here. |
| `src/animations/run.ts` | Starts all page animations on the visitor's first scroll, touch, click or key press. Runs one factory per section. |
| `src/animations/reveal.ts` | Shared reveals: headings rising from a mask, text fading up, image wipes. |
| `src/animations/cloudcostguard.ts` | CloudCostGuard: case-study blocks arriving like a log; the diagram drawing itself. |
| `src/animations/experience.ts` | Experience: the timeline line drawing down. |
| `src/animations/automation.ts` | AI automation: the void-to-paper wipe; the slit-scan hover images. |
| `src/animations/hero.ts` | The hero intro timeline, played behind the preloader. |
| `src/animations/preloader.ts` | The preloader's exit, which hands into the hero intro. |
| `src/animations/magnetic.ts` | Orange buttons following the mouse slightly (desktop only). |

Components mark what may animate with `data-anim` attributes. The animation files find them by those attributes, so most visual changes are made in these files, not in components.

**Built-in safety rules (keep them):**
- Content is never hidden before JavaScript runs.
- Only content below the fold gets a "before" state.
- Every reveal finishes within 1.2s.
- Under reduced motion, nothing animates and nothing is hidden.

---

## Turning off the preloader or the WebGL effect

Both are switches in `src/content/site.ts`:

```ts
export const features = {
  preloader: true,
  webglEffect: true,
} as const;
```

Set either to `false`, save, and rebuild:
- **`preloader: false`** removes the first-visit "ACQUIRING SIGNAL" overlay and the hero intro behind it. The hero shows as painted on every visit.
- **`webglEffect: false`** removes the CloudCostGuard "signal from noise" effect. The plain screenshot shows with the normal frame reveal, and Three.js is never downloaded.

---

## Search, social and AI discovery

- **The site address comes from one place,** `siteUrl()` in `src/content/site.ts`. On Vercel it uses the production address automatically. For a custom domain, set the `SITE_URL` environment variable (for example `https://example.com`).
- **Share image:** `src/app/opengraph-image.tsx` draws it at build time from the content files.
- **Favicon:** `src/app/icon.svg`, `favicon.ico` and `apple-icon.png`.
- **`robots.txt`:** lets everyone crawl, and names the major AI crawlers. Their names were checked on 18 Nov 2026 against each company's documentation. Recheck them once a year in `src/app/robots.ts`.
- **`sitemap.xml`, the JSON-LD `ProfilePage`, `/llms.txt` and `/llms-full.txt`** are all generated from `src/content/`.

---

## Deploy to Vercel (free)

1. **Put the project on GitHub.** In this folder:
   ```bash
   git init
   ```
   ```bash
   git add .
   ```
   ```bash
   git commit -m "Portfolio site"
   ```
   `.gitignore` already keeps out `source/` (your private CV with the phone number), `.claude/`, `CLAUDE.md`, `node_modules/` and `.next/`. Before the first commit, check with `git status` that none of those appear.

   Then create an empty repository on github.com and follow its "push an existing repository" steps.
2. **Import it on Vercel.** Go to vercel.com/new, sign in with GitHub, and pick the repository. Vercel detects Next.js; keep the defaults and press **Deploy**. No environment variables are needed.
3. **Check the live site:**
   - `/robots.txt` and `/sitemap.xml` show your Vercel address
   - pasting the link into LinkedIn or WhatsApp shows the share card
   - the CV downloads
4. **Optional custom domain:** add it under the project's **Settings, Domains**. Then set `SITE_URL` under **Settings, Environment Variables** and redeploy.

Every push to the main branch redeploys automatically.

---

## Measuring

- **Lighthouse:** run a production build (`npm run build`, then `npm start`) and test http://localhost:3000 in Chrome DevTools, Lighthouse tab, "Mobile". Measured results so far are in `PROGRESS.md`.
- **Bundle:** see what each page downloads with
  ```bash
  npx next analyze
  ```
  The first download is about 180 KB of JavaScript. GSAP and Three.js load later, only when needed.

---

## Fonts and licences

- **Archivo, JetBrains Mono and Instrument Serif** are under the SIL Open Font License 1.1. How they were trimmed is in `src/fonts/README.md` and `src/app/og-assets/README.md`.
- **Screenshots** are of Muhammad's own projects.

## Known items

- **`npm audit` reports 15 "high" advisories.** All come from one `picomatch` issue inside the developer-only lint tools, and nothing affected ships to visitors. The only fix npm offers would downgrade the Next.js lint config, so wait for an `eslint-config-next` update.
- **Three.js logs one deprecation warning** ("THREE.Clock") from inside React Three Fiber. It's harmless.
