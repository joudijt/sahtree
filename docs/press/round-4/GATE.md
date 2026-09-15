# GATE — Sihatree PRESS round 4

Stage 6, 2026-09-15, branch `press-round-4`. Pre-round sha `98115f5`.

## 1. Word count (draft measurement: lede + body + FAQ answers)

Measured by stripping tags from `.blog-post-body` and the FAQ answers, per the same method round
2 calibrated against this site's rendered-word gap (see round-2/GATE.md item 0).

| Article | Words |
|---|---|
| `arabic-gum-cholesterol` | 845 |
| `arabic-gum-blood-pressure` | 851 |
| `arabic-gum-while-breastfeeding` | 792 |
| `arabic-gum-metabolism-energy` | 795 |
| `arabic-gum-detox-water-trend` | 848 |

All five in or effectively at the 800-1,000 target band (two initial drafts came in under-band —
breastfeeding at 677 and metabolism at 681 — and were expanded with genuinely new, on-topic
sections rather than padded, before this measurement).

## 2. `node scripts/check-llms.mjs`

**Before round**: exit 0, 3 files green.
**After adding round-4's 5 EN entries to `public/llms.txt`'s page index**: first run **failed** —
`G9-medical` flagged the word "Detox" in the new llms.txt index line for
`arabic-gum-detox-water-trend`, because that one-line index entry had no same-line negation word
for the checker's sentence-boundary logic to find. **Not a false positive** — a bare one-line
"Detox Water" claim in an AI-ingested index file is exactly the failure mode this gate exists to
catch. Fixed by rewording the index line to `Arabic Gum "Detox Water": Why It Doesn't Actually
Detox You` (the article's own on-page title was left as-is — see DECISIONS). Re-run: **exit 0, 3
files green**, en brand mentions 54/60 (was 54/59 — cap itself rose because word count rose), no
other violations.

## 3. Self-imposed banned-word and claim sweep on the 5 article HTML files

**No automated gate scans blog article HTML on this project** (`check-llms.mjs` scans only the 3
`public/llms.txt` files) — this section is a manual sweep run at the same standard, because round
3 already proved a self-introduced banned-word hit is easy to miss otherwise.

- `G9-medical` pattern (cures/treats/heals/lowers cholesterol/detox/boosts immunity): swept all 5
  files. Every hit in `arabic-gum-cholesterol.html` ("lower(s) cholesterol", 12 occurrences) sits
  inside a same-paragraph or same-line negation ("No study...", "not established", "cannot claim",
  a table cell paired with "Not established... unlawful"). All "detox" occurrences in
  `arabic-gum-detox-water-trend.html` (50+, expected — it's the article's own subject) were spot-
  checked in the head/meta block and confirmed each sits alongside "is not a detox product" /
  "does not detox" / "doesn't need a detox claim" within the same sentence. Zero hits in the other
  3 files.
- `G9-banned-adjectives` (certified/official/verified/trusted/authentic/guaranteed): zero hits,
  all 5 files.
- Fake-proof patterns (star ratings, review counts, awards): zero hits.
- Origin-country claims (Sudan/Chad/Nigeria/Senegal-as-origin): zero hits.
- Phantom-branch patterns (naming a city with no real Berkat Madinah Store branch): zero hits —
  none of the 5 articles mentions a location at all.
- Price/currency (RM, MYR, $): zero hits, all 5 files.

## 4. `npx html-validate` on the 5 new files

**Exit 0, zero errors.** Does not touch the site's pre-existing 132-error baseline (round 2's
GATE.md), because these are new files, not edits to files that carry the baseline errors.

## 5. Structural checks

- **JSON-LD validity**: all 15 `<script type="application/ld+json">` blocks across the 5 files
  (BlogPosting + FAQPage + BreadcrumbList each) parsed as valid JSON, byte-checked. `blog.html`'s
  updated `Blog` JSON-LD also re-validated.
- **Internal links**: every `href="/blog/..."` target across the 5 new files checked to exist on
  disk before wiring — 15 distinct targets, all present.
- **Images**: every `<img src>` across the 5 new files (heroes + related-article thumbnails)
  checked to exist on disk — 18 distinct paths, all present.
- **Cannibalisation**: see `ROUND-4-MAP.md` — all 5 focus keywords confirmed unique against every
  existing `<title>`/`<h1>` on the site before writing.
- **vite.config.js registration**: all 5 new files added to `rollupOptions.input`; confirmed
  present in `dist/blog/` after `npm run build` (Stage 7).

## 6. Scope decision recorded, not silently skipped

The "one extra `.blog-card` added to the Related Articles rail of a matched existing article"
inbound-linking enhancement that round 2 used was **not done this round** — all 5 articles are
discoverable via `blog.html`'s grid/sitemap/llms.txt, but no existing article's own Related
Articles rail was edited to point back at them. A scope decision under time constraint, not an
oversight; recorded in `DECISIONS.md`.
