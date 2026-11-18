# Phase 0 plan: Muhammad Azkar portfolio

Discovery only. No code yet. Written 18 Nov 2026. Everything below waits for your approval.

---

## 1. Files found

**Markdown (content and design):**

| File | Role |
|---|---|
| `source/profile-brief.md` (v2.1, copied from Desktop) | The only source of facts. Its hard rules win. |
| `source/landing-page-copy.md` (copied from Desktop) | Page copy, used word for word |
| `source/theme-direction.md` (copied from Desktop) | The authoritative design spec: Signal / Noise |
| `source/notes.md` | Detailed fact base behind the brief |
| `source/links.md` | Email, GitHub, LinkedIn, repos |
| `source/next-steps.md` (copied from Desktop) | Your to-do list. Not site content. |
| `source/README.md` | Folder guide |
| `CLAUDE.md` | Project rules, rewritten 18 Nov from your build prompt and the five attached files |
| `~/Desktop/portfolio-build-prompt.md` | An older build prompt (React + Vite + Tailwind). Superseded by your new prompt, so not copied in. |

**Images:**
- `source/headshot.jpg`: 896×1152, the Gemini portrait
- `source/screenshots/`: 10 real project screenshots
  - `cloudguard-1-charts.png`, `cloudguard-2-empty-state.png`
  - 8 n8n canvases: lead reactivation, browser agent ×2, RAG ×2, email responder, LinkedIn post, inventory
- No other photos of you exist in the project or on your Desktop.

---

## 2. Your profile in six lines

1. Muhammad Azkar, **DevOps & AI Automation Engineer** in Islamabad (PKT, UTC+5). An entry-level 2026 BS Computer Science graduate from the University of Peshawar (CGPA 3.43).
2. Remote Back-End AI Engineering Intern at FlyRank AI, July to September 2026:
   - FastAPI services containerised with Docker Compose
   - a job service with Prometheus metrics
   - schema-validated LLM services (RuleGuard), and an architecture copilot with 48 offline tests
3. Flagship project: **CloudCostGuard**, an AWS cost and waste monitor he built end to end, from database to dashboard. It runs as 4 Docker containers on EC2 behind Caddy, with 100 tests at 82% coverage in GitHub Actions, and real bugs fixed (including the AWS credits that netted every cost to $0).
4. Six public n8n AI agents: lead reactivation, browser agent, RAG, email drafts, research-to-LinkedIn, and an inventory chat. Plus Bash and AWS CLI tooling and an EC2 Linux deployment.
5. Wants an entry-level DevOps, cloud or AI automation job (remote international, or in Pakistan), freelance clients (Fiverr and direct), and good connections. Learning Kubernetes now.
6. Main reader: a founder of a small remote company arriving from outreach. Then recruiters, engineers and freelance clients (who get their own `/services` page).

---

## 3. Design tokens (from `theme-direction.md`)

**Colour.** Contrast measured on 18 Nov 2026.

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--void` | #0A0B0D | Page background | |
| `--graphite` | #131519 | Panels | |
| `--line` | #262A30 | Hairlines, frame borders | decorative |
| `--bone` | #ECECEA | Main text | 16.64:1 on void, 15.45:1 on graphite |
| `--ash` | #8B9099 | Labels, secondary text on dark | 6.14:1 on void, 5.70:1 on graphite |
| `--signal` | #FF5A1F | The one accent: primary button, focus, active, boot hairline | 6.31:1 on void; void text on it 6.31:1 |
| `--paper` | #F2F1EE | The one light section (AI automation) | void text 17.43:1 |
| `--signal-deep` | #C2410C | Accent on paper only | 4.58:1 |
| `--teal-deep` | #0F3D45 | Atmosphere only, never text | |
| `--live` | #3DD68C | Only the open-to-work dot | 10.5:1 |
| **`--ash-paper` (new)** | **#565B63** | **Labels on paper** | **6.05:1** |

`--ash-paper` is a gap I found in the spec: `--ash` on paper is only 2.84:1 and fails AA. Without it, the light section's labels would be unreadable.

**Type.** All three faces are available on Google Fonts, checked for `next/font`.
- **Archivo (variable):** `wdth` axis 62–125, weights 100–900.
  - Display at width 125, weight 700–800, tracking -0.02em. The name at clamp(80px, 14vw, 220px), plus uppercase section titles.
  - Body at width 100, weights 400/500, 17–18px, line height 1.55, about 68ch.
- **Instrument Serif Italic 400:** at most one word per heading.
- **JetBrains Mono 400/500:** labels and HUD, 11–13px, uppercase, tracking +0.08em.
- Scale: 12 / 14 / 17 / 22 / 32 / 48 / 80 / clamp(80px, 14vw, 220px). Only Archivo is preloaded (it's the hero heading); the other two load with swap and fallback metrics.

**Space, shape, depth:**
- a 12-column grid with generous margins, and hairlines between sections
- radius 0 (no rounded cards)
- no shadows: depth comes from hairlines, graphite panels and grain
- a film grain overlay at 5–8% opacity
- image frames with "+" crosshair corners

**Motion style:**
- one easing curve everywhere, `cubic-bezier(0.22, 1, 0.36, 1)`
- durations: 0.6s small, 0.9s headlines, 1.2s big reveals, 150–300ms micro-interactions
- only `transform`, `opacity` and `clip-path` are animated

---

## 4. Site structure

From the brief's `<landing_page>`. This order puts proof first: a founder sees the strongest shipped work on the first scroll, before any biography.

**Home `/`:**

| # | Section | Purpose |
|---|---|---|
| 1 | Hero | Name (H1), title, one line, location and time zone, availability, level stated once, a 4-column HUD strip, buttons: Email me, Download CV, GitHub |
| 2 | CloudCostGuard (case) | Metadata grid, screenshots (video later), what it does, how it's built, how it shipped (live CI badge), what broke and how he fixed it, what's next, links |
| 3 | Professional experience | FlyRank AI timeline |
| 4 | AI automation (the paper section) | Six workflow cards with real screenshots, each linking to its folder, ending with a link to /services |
| 5 | Smaller AWS work | Resource tracker, EC2 site |
| 6 | Skills | Four evidence groups, as text lists |
| 7 | Education and certifications | Compact |
| 8 | Contact | A large "Email me", LinkedIn, GitHub, time zone |

**`/services`:** the services table, each row linked to its proof project, then Email me.

Your prompt mentions an About section. The brief's plan has none, because the hero and contact already cover it. I recommend no separate About section. Say if you want one, and I'll build it only from the brief's story section.

---

## 5. Photos

| Rank | File | Sharpness | Light on face | Eye contact | Expression | Background | Resolution | Verdict |
|---|---|---|---|---|---|---|---|---|
| 1 (only one) | `headshot.jpg` | good | soft, even | yes | neutral smile | plain beige | 896×1152, enough for the hero | **Not usable on the site** |

**Why it can't be used:** brief hard rule 13 and your older build prompt both say the AI-generated Gemini headshot must not appear on the site, only a real photo, and until one exists, no photo.

**Plan:**
- The hero ships **without a photo**. Its layout works with and without one, with a reserved crosshair frame shown only once a real photo exists.
- When you take real photos (guide in `next-steps.md`), I'll rank them by the criteria above. Allowed treatment: crop, consistent framing, a subtle frame. No filters, smoothing or effects on your face.

**Project screenshots:** all 10 are real.
- `cloudguard-1-charts.png` leads the case study.
- The two RAG shots and two browser-agent shots: use one each on cards, with the second in the case-study detail only.

---

## 6. WebGL options (pick one)

Your new prompt forbids WebGL on your face. That replaces the theme's original idea of an ASCII shader on your portrait. All three options below keep the Signal / Noise idea on real material instead.

| | Option | What it does | Cost and risk |
|---|---|---|---|
| **A (recommended)** | **Signal from noise on the CloudCostGuard screenshot** | When the case study scrolls into view, the real dashboard screenshot arrives as ASCII characters and grain, then resolves into the clean image over about 1.6s. Near the cursor it briefly breaks back into characters (desktop only). | One canvas below the fold, so it can't hurt LCP. Static fallback: the clean screenshot. It matches what CloudCostGuard does: real signal out of noisy cost data. |
| B | Hero noise field | A full-bleed animated grain field behind the hero text, with one thin orange "signal" line that slowly scans and leans with the pointer | Pure atmosphere with no real data behind it. It sits in the hero, so it must load after first paint. |
| C | Slit-scan on the n8n cards | Hovering a workflow screenshot smears it in horizontal bands for about 300ms, then it settles clean | Six textures and hover-only, so no effect on touch. It's lighter as CSS, which makes WebGL hard to justify here. |

I'd build A with Three.js through `@react-three/fiber` (one plane, one shader material), loaded with `next/dynamic` when idle and after the section is near the viewport.

**Favicon options (abstract, no initials):**
1. **Spike (recommended):** a flat bone-coloured line with one orange spike on void. It's an anomaly flag, which is CloudCostGuard's core idea.
2. **Status dot:** a single orange dot centred on void.
3. **Crosshair:** a thin "+" in bone with an orange centre point, echoing the image frames.

---

## 7. Animation storyboard

**Preloader (first visit per session only):**
- Plain HTML and CSS in the root layout: one mono line, `ACQUIRING SIGNAL`, and a 1px orange hairline filling left to right.
- It's an overlay; the page underneath is fully rendered and visible.
- It ends at about 1.2s or when fonts are ready, whichever is first. A GSAP exit (hairline completes, overlay fades in 0.4s) hands straight into the hero timeline.
- Skipped under reduced motion and on repeat visits.

**Hero master timeline** (the H1 is painted from the start and never hidden):
1. The name's letters get a slight clip-path wipe from an already-visible state. If this measurably delays LCP, the name stays still.
2. The title line and the one-line description rise 12px and fade in.
3. HUD strip: labels type in, the clock starts, the live dot pulses once.
4. Buttons fade in. The primary button's orange hairline draws underneath it.

**Sections on scroll:**

| Section | Behaviour |
|---|---|
| Section titles | Rise line by line from a mask (SplitText, 0.9s, stagger 0.08). Screen readers get the full sentence. |
| CloudCostGuard | Metadata grid fades up. The screenshot or WebGL resolves inside the crosshair frame. Four steps (what, built, shipped, broke) pin and play like a log stream on desktop, and stack normally on mobile. The architecture diagram draws itself (DrawSVG). |
| Experience | The timeline hairline draws down as you scroll. Each bullet fades up. |
| AI automation | The page wipes from void to paper with clip-path, and the nav colour flips at the boundary. Cards reveal through their frames. Hover is a CSS slit-scan, with the same treatment on focus. |
| AWS, skills, education | Simple fade-ups only, to keep motion to one or two things per view. |
| Contact | The huge "Email me" rises from a mask. The footer clock and CI badge stay static. |

**Micro-interactions:**
- nav letter roll on hover and focus
- underline draw on links
- button press scale 0.98
- crosshair corners nudge out on card hover

A magnetic primary button is desktop-only (`pointer: fine`). There's no custom cursor.

**Reduced motion:** no Lenis, no preloader, no SplitText, no pinning or scrubbing, no WebGL. Content appears with short opacity fades at most.

---

## 8. Conflicts that need your decision

1. **Stack: resolved 18 Nov.** The old `CLAUDE.md` was removed, and a new one was written only from your build prompt and the five attached files. It sets Next.js with SCSS, GSAP, Lenis, Motion and one Three.js effect.
2. **React, JavaScript, Vite and Tailwind: resolved by brief v2.1.** You wrote the CloudCostGuard dashboard yourself, so they go under "used in shipped projects" on the site. Your CV and resume don't list them yet; say if you want them added.
3. **Hero photo.** Your prompt wants your best headshot in the hero. The only photo is the Gemini portrait, which the brief bars from the site. Plan: no photo until you take a real one (see section 5).
4. **Three font families: resolved.** The new `CLAUDE.md` uses the theme's fonts (Archivo, Instrument Serif, JetBrains Mono).
5. **Known AI-site tells inside the theme.** The theme deliberately uses three things `CLAUDE.md`'s anti-slop list warns about:
   - numbered mono section labels ("02 / CASE: CLOUDCOSTGUARD")
   - one italic serif word in headings
   - an arrow appended to a link ("See what I can build for you →")

   I'll keep them as specified, unless you'd rather drop the numbers (my small recommendation: labels without numbers).
6. **Downloadable CV and your phone number.** Hard rule 14 allows the phone in CV text, but a public PDF on the site exposes it to scrapers. I recommend a website copy of the CV without the phone. Your private CV stays as it is.
7. **Footer credit line.** The older prompt said "Built by me with React, Vite and Tailwind CSS", which is wrong for this stack. New string: "Built with Next.js and SCSS, hosted on Vercel." This is a new string; please approve it.
8. **Lighthouse targets.** I'll use your new prompt's stricter targets (LCP < 2.0s, FCP < 1.2s, CLS < 0.05, TBT < 150ms) instead of the older "Performance 90".

---

## 9. Content gaps (`TODO:` in the data files)

- [ ] Real photo for the hero (shoot guide in `next-steps.md`)
- [ ] CloudCostGuard walkthrough video URL (the screenshots stand in until then)
- [ ] Fiverr or other platform profile URLs, only if you want them on /services
- [ ] Longer-term goals beyond the next role (optional)
- [ ] Your picks: WebGL option (A, B or C) and favicon (1, 2 or 3)

**Before launch (your side, from `next-steps.md`):**
- **CloudCostGuard README:** it still says "CloudGuard" (checked 18 Nov), while the site says CloudCostGuard. Apply the three repo patches.
- **aws-resource-tracker README:** it still links the old `linkedin.com/in/mazkar0107`.

**Checked 18 Nov:** all 7 proof links in the brief, and the live CI badge, return 200.

---

## 10. Planned packages (current versions, 18 Nov 2026)

| Package | Version | Note |
|---|---|---|
| next | 16.4.6 | |
| react | 19.3.1 | |
| sass | 1.108.2 | |
| gsap | 3.15.1 | ScrollTrigger, SplitText and DrawSVG are included free |
| @gsap/react | 2.1.2 | |
| lenis | 1.3.27 | |
| motion | 14.14.0 | `LazyMotion` and the `m` component for the mobile menu only |
| three | 0.187.0 | Only if WebGL option A or B is chosen; never in the first-load bundle |
| @react-three/fiber | 9.8.2 | Same condition |
| @next/bundle-analyzer | 16.4.6 | |
| @vercel/speed-insights | 2.1.0 | Loaded after idle |

No Tailwind, no CSS-in-JS, no UI kits, no Anime.js.

---

## Next

Once you approve this plan and answer section 8 (items 1, 2 and 6 matter most) plus the WebGL and favicon picks, Phase 1 starts: scaffold, SCSS tokens and fonts. It stops for you to review the tokens.
