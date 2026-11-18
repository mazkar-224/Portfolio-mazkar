# Fonts for the generated share image

`opengraph-image.tsx` renders with `next/og`, which needs static TTF/OTF fonts (no WOFF2, no
variable axes). These are static instances of the site's own self-hosted fonts in `src/fonts/`
(SIL Open Font License 1.1), made with fonttools on 18 Nov 2026:

| File | From | Instance |
|---|---|---|
| `archivo-display-800.ttf` | `archivo-latin-var.woff2` | `wght` 800, `wdth` 125 (the display face) |
| `jetbrains-mono-500.ttf` | `jetbrains-mono-latin-var.woff2` | `wght` 500 |

Characters kept: U+0020–007E, U+00A0–00FF, U+2010–2027. They are read at build time only and
are never sent to visitors.
