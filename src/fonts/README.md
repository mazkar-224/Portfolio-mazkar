# Self-hosted fonts

Trimmed copies of two Google Fonts, both under the SIL Open Font License 1.1
(https://openfontlicense.org). Loaded with `next/font/local` in `src/app/fonts.ts`.

| File | Source | Kept |
|---|---|---|
| `archivo-latin-var.woff2` | Archivo (The Archivo Project Authors), Google Fonts Latin subset | `wght` 400–800, `wdth` 100–125; 88 KB → 53 KB |
| `jetbrains-mono-latin-var.woff2` | JetBrains Mono (The JetBrains Mono Project Authors), Google Fonts Latin subset | `wght` 400–500, no code ligatures; 40 KB → 13 KB |

Characters kept in both: U+0020–007E, U+00A0–00FF, U+0131, U+0152–0153, U+02C6, U+02DA,
U+02DC, U+2010–2027, U+2030–203A, U+2044, U+20AC, U+2122, U+2190–2193, U+2212.

Why: CLAUDE.md asks for fonts subset to the characters needed. `next/font/google` can only
pick whole language subsets, and the full variable files were the largest cost in
Lighthouse's simulated mobile LCP.

Rebuild (fonttools and brotli in any Python venv): instance the variable axes with
`fontTools.varLib.instancer`, then subset with `fontTools.subset` to the ranges above,
woff2 flavour. If a new character appears in the copy (another language, a symbol),
add its range and rebuild.

Instrument Serif (accent words, below the fold) still loads from `next/font/google`.
