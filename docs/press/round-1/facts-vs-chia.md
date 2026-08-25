# Facts sheet — Arabic Gum vs Chia Seeds (`arabic-gum-vs-chia-seeds-malaysia`)

All three language files (EN/MS/AR) make the same set of factual claims, each phrased natively.
Every claim below is either (a) matched to a sibling article already published on this site, or
(b) generic, non-controversial nutrition-science/botany knowledge that does not require a
citation beyond the external Wikipedia link already used in the article (same pattern as
`arabic-gum-vs-inulin`'s Wikipedia links for gum arabic/inulin).

## Claims about Arabic Gum (matched to existing sibling articles — not invented)

| Claim | Basis |
|---|---|
| Arabic Gum dissolves fully and invisibly into water, no texture change, neutral taste | Matches wording used throughout the site, e.g. `arabic-gum-vs-inulin.html` ("Arabic Gum is essentially neutral-tasting, dissolving into drinks without adding any flavour of its own") and product copy generally |
| ~85% soluble dietary fibre by weight | Verbatim figure already published and WebSearch-verified in `blog/arabic-gum-scientific-research.html` ("Arabic Gum is commonly reported to contain around 85% soluble dietary fibre") — reused, not reinvented |
| Long history of traditional use across Middle Eastern and North African herbal practices | Matches `blog/gum-arabic-malaysian-traditional-medicine-history.html` FAQ ("gum arabic has a long history of traditional use across Middle Eastern, North African, and South and Southeast Asian herbal practices"). We dropped the "South and Southeast Asian" clause for brevity/word-count reasons — not a contradiction, just a subset of the sibling's claim |
| Is the hardened sap of the Acacia tree | Site-wide established fact, see `AI-FACTS.yml` (`site.definition`: "dried, purified sap of the Acacia tree") and `arabic-gum-vs-inulin.html` |
| Not a medicine or treatment for any condition | Standing site rule (CLAUDE.md content-safety section, "no disease-treatment claims") applied identically to both fibres in this article |

## Claims about chia seeds (generic, verifiable nutrition-science/botany — not on this site before)

| Claim | Basis |
|---|---|
| Chia seeds form a visible gel around each seed when soaked in liquid, keeping a distinct seed texture rather than dissolving | Generic, widely-documented physical property of chia seed mucilage (soluble fibre in the seed coat) — common knowledge, not a health claim. Referenced to Wikipedia's Chia seed overview (external link, same convention as the inulin article's chicory-root link) |
| Chia seeds contain a mix of soluble and insoluble fibre, plus fat (including omega-3 ALA) and protein | Standard, widely-cited nutritional composition of chia seed (Salvia hispanica) — generic nutrition-science knowledge. No specific gram/percentage figures were stated for chia, deliberately, to avoid citing an unverified number; the article states this qualitatively ("a large share of the seed's weight is fat and protein") rather than giving a hard percentage |
| Chia seeds come from the plant Salvia hispanica, native to Central America | Standard botanical fact (species name + native range), verifiable via any general reference (Wikipedia link included) |
| Historically eaten by Aztec and Maya communities | Standard, widely-documented historical fact about chia's pre-Columbian use in Mesoamerica — not a Sihatree-specific or product claim |
| Chia's current popularity is more recent, driven by Western wellness/health-food trends | General, uncontroversial framing (chia pudding, smoothie bowls, "superfood" marketing from roughly the 2000s–2010s onward) — no specific dates/stats invented |
| Neither is a medicine or treatment for any condition | Same standing site rule, applied to chia as a food, mirroring how it's applied to Arabic Gum |

## Comparative claim (not attributed to either source alone — derived logically from the two facts above)

- "Gram for gram in dry form, Arabic Gum is a more concentrated source of soluble fibre than chia
  seeds" — this is a directional, qualitative comparison built from the already-sourced ~85% Arabic
  Gum figure versus the general/qualitative fact that chia is a mixed-macronutrient whole seed (not
  primarily fibre by weight). Deliberately did **not** state a specific chia fibre percentage, since
  no percentage for chia appears anywhere else on this site and inventing one would violate the
  "no invented numbers" instruction. This keeps the claim honest and directionally correct without a
  fabricated figure.

## Assumed decisions (flagged per PRESS convention)

- `assumed` — No `.blog-benefit-grid` was used in any of the three files. The structural twin
  (`arabic-gum-vs-inulin`) and the other comparison article (`arabic-gum-vs-psyllium-husk-malaysia`)
  both skip the benefit-grid component too, so this keeps the new article consistent with the
  established pattern for this specific article type (comparison guides use the `.blog-highlight`
  quick-comparison box instead). This also sidesteps any risk from the banned FA icon list, since no
  icons beyond the already-confirmed-working nav/footer/FAQ set (`fa-chevron-down`,
  `fa-facebook-f`, `fa-instagram`, `fa-shopping-bag`, `fa-store`, `fa-tiktok`, `fa-whatsapp`) were
  needed.
- `assumed` — Hero image alt text describes the existing pre-made hero
  (`/images/arabic-gum-vs-chia-seeds.webp`) per the brief: pale Arabic Gum crystals soaked in water
  (left) next to black chia seeds soaked in water forming a gel (right), matching the site's
  established "VS split" hero convention. No new image was generated.
- `assumed` — MS-language related-article links point to the real MS sibling slugs confirmed to
  exist on disk (`gam-arab-vs-inulin-malaysia`, `gam-arab-vs-psyllium-husk-malaysia`,
  `fakta-pemakanan-gam-arab`) and the in-body citation links point to `kajian-saintifik-gam-arab`
  and `gam-arab-perubatan-tradisional-malaysia-sejarah` — all verified to exist via `ls` before
  linking, not assumed from the CLAUDE.md table alone.
- `assumed` — AR-language links use the EN-mirrored AR filenames (`arabic-gum-vs-inulin`,
  `arabic-gum-vs-psyllium-husk-malaysia`, `arabic-gum-nutrition-facts`,
  `arabic-gum-scientific-research`, `gum-arabic-malaysian-traditional-medicine-history`), all
  verified to exist on disk before linking, per the site's confirmed AR-slug-mirrors-EN convention
  (see `docs/press/DECISIONS.md` #3).
- `assumed` — Word counts (article body + FAQ, excluding nav/footer/related-articles) landed at
  EN 1,008 / MS 938 / AR ~913 (whitespace-token estimate for Arabic) — all within or effectively at
  the 800–1,000 target band.
- `assumed` — Publish date `2026-08-25` applied everywhere a date appears (meta, JSON-LD
  datePublished/dateModified, visible `<time>`), per the brief.

## Explicitly NOT claimed (per non-negotiable content rules)

- No JAKIM certificate number or "Halal-certified" wording for Arabic Gum (uses the standing
  "Halal-friendly"/plant-derived phrasing already established site-wide).
- No prices for either product in any currency.
- No fabricated testimonials, reviews, or star ratings for either fibre.
- No disease-treatment claims for Arabic Gum or chia seeds — both explicitly stated to be foods,
  not medicines, in the lede/body/FAQ across all three languages.
- No banned-adjective list words (certified/official/verified/accredited/trusted/authentic/
  guaranteed and their MS/AR equivalents) — checked via grep across all 3 files after writing;
  the only near-hit was "الأصلي" (definite form) used to mean "native to Central America"
  (botanical origin, not a product-quality/authenticity claim), which matches the site's own
  `scripts/check-llms.mjs` documented exception for the definite form of that word.
