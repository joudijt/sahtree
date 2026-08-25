# Facts sheet — Arabic Gum and Bloating article (round 1)

## Core facts used

| Fact | Value | Source |
|---|---|---|
| Introducing any new fibre source can itself cause temporary bloating/gas | Central honest caveat of the whole article — framed as normal adjustment, not a hidden downside | Task brief; consistent with `blog/what-is-arabic-gum-benefits-uses-dosage.html`'s own dosage section: "Starting low and increasing gradually helps avoid initial bloating as your gut adjusts to the added fiber." |
| Standard dosage: 5-10g/day starting, gradually increase to 15-30g as tolerated | Used verbatim, not re-derived | `blog/what-is-arabic-gum-benefits-uses-dosage.html` — "Most adults start with 5-10 grams per day, mixed into a glass of water, and gradually increase to 15-30 grams as tolerated." (same numbers appear in that article's FAQPage JSON-LD) |
| Serving method: one scoop into 250-300ml water, once or twice daily | Used verbatim | `blog/what-is-arabic-gum-benefits-uses-dosage.html` — "How to take Sihatree's Arabic Gum" section |
| Split-dose tip (morning + evening, gentler than one large serving) | Reused pattern | `blog/what-is-arabic-gum-benefits-uses-dosage.html` — existing `.blog-tip` box |
| Arabic Gum ferments more slowly/gently than inulin, a faster-fermenting prebiotic fibre | Used as the "gentler, not zero-effect" comparison point | `blog/what-is-arabic-gum-benefits-uses-dosage.html` — "Arabic Gum vs. other fiber supplements" section: "inulin... is more likely to cause gas and bloating in sensitive individuals due to faster fermentation. Arabic Gum's slower fermentation rate is one reason it's often recommended as a gentler starting point." |
| Fibre without enough water can worsen bloating/constipation | Reused established site framing | `blog/arabic-gum-for-constipation.html` (`.blog-tip`: "Taking fibre without enough water can worsen constipation rather than relieve it") — extended honestly to bloating, since the same water-dependent mechanism applies |
| Not a treatment for IBS/food intolerances/medical bloating conditions; food not medicine framing | Explicit disclaimer, matches site's doctor-deferral pattern | Task brief; same pattern as `blog/arabic-gum-gut-health.html` ("it isn't a standalone treatment for any digestive condition") and `blog/what-is-arabic-gum-benefits-uses-dosage.html`'s caution box (GI condition / medication / pregnancy → see a doctor) |
| No JAKIM cert claims, no cures/treats/eliminates language | Site-wide content-safety rule | `E:\sahtree\CLAUDE.md` — Halal wording rule + 2026-07-26 banned-adjective decision |
| Hero image: flat-lay of fibre-rich foods in bowls on marble counter | Pre-supplied, not generated in this task | `/images/arabic-gum-bloating-fiber-close.webp` — confirmed present in `public/images/` before writing |
| Related-article slugs (EN/MS/AR) | `arabic-gum-for-constipation` / `gam-arab-untuk-sembelit`, `arabic-gum-gut-health` / `gam-arab-kesihatan-usus`, `what-is-arabic-gum-benefits-uses-dosage` / `apa-itu-gam-arab-faedah-kegunaan-dos` (AR mirrors EN slugs for all three) | `E:\sahtree\CLAUDE.md` topic table; confirmed by reading each sibling article directly |

## Assumptions made (flagged per instructions)

- **Category tag**: Used "Digestive Comfort" (`راحة الجهاز الهضمي` / `Keselesaan Pencernaan`) rather than reusing the constipation article's exact "Digestive Health" tag, to keep the pill visually distinct while staying in the same topical family. Not specified in the brief; a reasonable editorial choice, easy to change.
- **FAQ question set**: Used the two examples given in the brief ("Can Arabic Gum cause bloating?", "How do I avoid bloating when starting Arabic Gum?") plus 4 more natural companion questions (fermentation-speed comparison, water amount, IBS/medical-condition scope, adjustment-period duration) to reach 6 — matching the sibling articles' FAQ depth.
- **Benefit grid**: Included a 6-card `.blog-benefit-grid` (not explicitly required, brief only said "if used, exactly 6") to make the honest caveats/benefits scannable — icons used: `fa-hourglass-half`, `fa-feather`, `fa-chart-line`, `fa-tint`, `fa-ban`, `fa-user-doctor`. None are on the known-broken list (`fa-wheat-awn`, `fa-people-group`, `fa-mango`, `fa-stomach`).
- **Read time**: Set to "5 min read" based on final word count (~900-1000 words at ~180-200 wpm), consistent with how sibling articles set this field.
- **AR slug**: Filename `arabic-gum-for-bloating.html` under `ar/blog/` per the brief's explicit instruction that AR mirrors the EN filename (confirmed site convention — same pattern already used by `ar/blog/arabic-gum-for-constipation.html` and `ar/blog/arabic-gum-gut-health.html`).
- **hreflang block**: All 3 new files carry the full 4-line block (en-MY, ms-MY, ar-MY, x-default), per the brief's explicit instruction — note this is *more complete* than the existing MS sibling articles (`gam-arab-untuk-sembelit.html`, `gam-arab-kesihatan-usus.html`), which currently only carry 3 lines (no ar-MY) since they predate the AR site section. This inconsistency was not touched/fixed on the older files, since this task's scope is limited to the 3 new files only.

- **Banned-word catch and fix**: First drafts used "guarantee" (EN), "jaminan" (MS), and "ضمان"/"المعتمد" (AR) in legitimate honest-hedging sentences ("not a guarantee it won't ever cause bloating" / dosage "approach"). These are on CLAUDE.md's word-level banned-adjective list (removed site-wide 2026-07-26) regardless of sentence context, so all were rephrased before publishing: "promise"/"janji"/"وعد" and "المتّبع" ("followed/established") respectively. `scripts/check-llms.mjs` only gates `public/llms.txt`, not blog articles, so this was caught by manual grep against the same word list, not by the script.
- **Meta description length**: EN first draft (153 chars) was already in range. MS (164 chars) and AR (120 chars) were adjusted to 150 and 149 chars respectively to land inside the 140-160 target — trimmed/expanded in the `<meta name="description">`, `og:description`, and `BlogPosting.description` JSON-LD field together (all three kept identical per file, matching sibling-article convention).

## Verification run

- FAQ JSON-LD question count == visible `.faq-item` count == 6, in all 3 files.
- `.blog-benefit-grid` has exactly 6 `.blog-benefit-card` entries in all 3 files.
- Body word count (lede → end of FAQ section, excluding Related Articles/nav/footer): EN 996, MS 954, AR 887 (whitespace-token count) — all within the 800-1000 target.
- No banned adjectives (certified/official/verified/accredited/trusted/authentic/guarantee/guaranteed etc.) used in any of the 3 files.
- No "cures/treats/eliminates bloating" language anywhere; explicit "food, not medicine" caution box present in all 3 languages.
- No prices, no JAKIM cert claims, no fabricated testimonials.
- Dosage numbers (5-10g start, 15-30g ceiling, 250-300ml water, once/twice daily) match `blog/what-is-arabic-gum-benefits-uses-dosage.html` verbatim in all 3 languages.
- Hero image path/alt present and descriptive in all 3 files; existing file at `public/images/arabic-gum-bloating-fiber-close.webp` confirmed, not generated new.
- Nav + footer lang-switch links point at real sibling URLs (EN ↔ MS ↔ AR) for this article, cross-checked against the exact slugs used in each file's own hreflang block.
