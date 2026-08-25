# Facts sheet — "Adding Arabic Gum drinks to a café/F&B business menu"

Topic: `cafe-business` | EN slug `arabic-gum-cafe-menu-business-malaysia` | MS slug
`gam-arab-menu-kafe-perniagaan-malaysia` | AR slug `arabic-gum-cafe-menu-business-malaysia`
(mirrors EN filename, per site convention). Published 2026-08-25.

Every claim used in the three article files, with its basis. No claim in the articles falls
outside this list — nothing was invented beyond what's below.

## Product/mixing facts (source: `blog/what-is-arabic-gum-benefits-uses-dosage.html` line ~253
and AI-FACTS.yml lines 150-151)

- "Stir one scoop into 250–300ml of water or a drink of choice, once or twice daily, and it
  dissolves fully" — verbatim consumer serving guideline from the existing dosage article.
  Reframed in the café article as a *starting point for prep consistency*, not a food-service
  spec — explicitly caveated that a café should test the ratio against its own cup sizes/recipes
  before standardising, since this is an untested extrapolation, not a published catering figure.
- "Milled to a fine instant powder that disperses on stirring — no gritty texture, no soaking" —
  AI-FACTS.yml line 151 ("dissolves... disperses on stirring, no overnight soaking needed").
- "No strong flavour of its own" — consistent with the dosage article's framing that the powder
  is neutral enough to mix into a chosen drink rather than requiring a dedicated recipe; phrased
  as a general property with an explicit caveat that a café should still taste-test its own
  recipes (no absolute "flavourless" claim was made).

## Halal wording (source: CLAUDE.md's "Halal wording" instruction + AI-FACTS.yml lines 140-143)

Used the exact required pattern in all three languages, in the same block: **plant-derived — no
alcohol, no animal-derived ingredients — and Sihatree does not hold a JAKIM Halal certificate.**
No cert number, no "Halal-certified," no "in line with JAKIM Halal guidelines" phrasing, and no
Arabic «متوافق مع الحلال» overclaim was used. The no-certificate sentence sits directly beside the
plant-derived/no-alcohol/no-animal-ingredient claim in every language, in the FAQ JSON-LD, the
FAQ visible markup, and the body H2 section — matching the pattern already used in
`is-arabic-gum-halal-malaysia.html` / `gam-arab-halal-panduan-malaysia.html` /
`ar/blog/is-arabic-gum-halal-malaysia.html`.

## Sourcing / wholesale facts (source: `wholesale.html`, `ms/wholesale.html`, `ar/wholesale.html`,
and `blog/sourcing-arab-products-wholesale-berkat-madinah.html`)

- Berkat Madinah Store is the only supplier named — consistent with the standing site rule
  (CLAUDE.md: "only Berkat Madinah Store may be named as a grocery/supplier in any article").
- Cafés/F&B are explicitly one of `wholesale.html`'s stated partner types ("Cafes & F&B" card:
  "Add a functional-fibre drink option to your menu... mixes cleanly into existing drink recipes
  without needing new equipment or training") — this article's café framing is consistent with,
  not contradictory to, that existing page copy.
- **No price, no minimum order quantity, no margin figure was invented.** Every mention defers to
  "contact the wholesale team / wholesale inquiry form to confirm terms" — same non-committal
  framing `wholesale.html`'s own FAQ uses ("Minimum order quantities may vary... Our sales team
  will provide details during the inquiry process") and the same honest framing the sourcing
  article uses ("no published minimum order size").
- Sihatree's wholesale inquiries are fulfilled by Berkat Madinah Store — stated fact from the
  sourcing article, reused here for the café angle specifically.

## Trend/context reference (source: `blog/why-arabic-gum-popular-malaysia.html`)

- One sentence acknowledging "growing consumer interest" and linking to the existing trend
  article for that context, without repeating its content (no social-media-platform specifics,
  no repeated stats) — kept to a single framing sentence per the brief.

## No fabrications (explicit checks)

- No named café case studies, no customer/café testimonials or quotes, no "X cafés already serve
  this" claim, no invented sales/revenue/order figures, no invented MOQ or price, no JAKIM
  certificate number or "certified" language, no fabricated statistics of any kind.

## Assumed/decided items (not explicitly specified in the brief — flagged here per instructions)

- **Category tag**: "F&B Guide" (EN) / "Panduan F&B" (MS) / "دليل الأغذية والمشروبات" (AR) — a new
  tag not previously used on the site; chosen to distinguish this B2B/F&B angle from the existing
  "Business Guide" tag on the sourcing article, since this piece targets a narrower F&B-specific
  reader than the general small-reseller sourcing piece.
- **Read time**: set to "6 min read" (EN)/"6 minit bacaan" (MS)/"6 دقائق قراءة" (AR) — consistent
  with the ~900-word body length; the site doesn't compute this automatically.
- **Related articles** chosen: `sourcing-arab-products-wholesale-berkat-madinah` (closest sibling —
  general wholesale sourcing vs. this article's café-specific angle), `why-arabic-gum-popular-malaysia`
  (the trend article referenced in-body), `best-arabic-gum-provider-malaysia` (supplier-credibility
  angle, reused the same related-card image/copy `sourcing-arab-products-wholesale-berkat-madinah.html`
  already used for it, to stay consistent with existing site copy for that card).
- FAQPage schema uses 4 questions (2 minimum required by the brief) to cover ordering, taste,
  Halal framing, and MOQ — mirrors the visible `.faq-item` markup exactly in all three languages.
- Benefit grid uses exactly 6 cards, icons confirmed against the CLAUDE.md broken-icon list
  (`fa-wheat-awn`, `fa-people-group`, `fa-mango`, `fa-stomach` avoided) — used `fa-tint`,
  `fa-mug-hot`, `fa-blender`, `fa-leaf`, `fa-check-circle`, `fa-store` instead, none of which are
  on the known-broken list.
- Hero image reused as supplied at `/images/arabic-gum-cafe-business-malaysia.webp` (already
  created — not regenerated), with distinct descriptive alt text per language.

## Word counts (body `.blog-post-body` + `.blog-faq`, excluding nav/footer/related — per brief's
counting rule)

- EN: 971 words
- MS: 906 words
- AR: 867 words (whitespace-token count; Arabic script word-boundary counting is approximate but
  consistent with the same measurement method used for EN/MS)

## Files NOT touched (per instructions)

`blog.html`, `ms/blog.html`, `ar/blog.html`, `vite.config.js`, `public/sitemap.xml`,
`public/llms.txt`, `public/ms/llms.txt`, `public/ar/llms.txt` — left for central wiring as
instructed. This article is not yet linked from any listing page or registered in the Vite build
until that central step runs `node scripts/check-llms.mjs` and adds the entries described in
CLAUDE.md's "Blog content system" section.
