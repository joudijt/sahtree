# Facts sheet — Gombak branch article (round 1)

## Core facts used

| Fact | Value | Source |
|---|---|---|
| Branch address | 289, Jalan Gombak No 95-G, (Block E) KL Traders Square, 53100 Kuala Lumpur | Task brief, verified against madinah.com.my/en/branches.html (as instructed — not independently re-fetched in this session; brief states it was already WebSearch-verified) |
| Trading name | "Arabian Village" — locally used trading name for the Gombak branch, same trading name used on Shopee (Arabian Village Malaysia) | Task brief |
| Gombak = 4th real Klang Valley branch | Confirmed real branches: Ampang (HQ + Cash & Carry), Kajang, Shah Alam, Gombak — all Klang Valley, no branch in PJ/Subang, JB, or Penang | `E:\sahtree\CLAUDE.md` (verified 2026-07-20 against madinah.com.my/en/branches) |
| Founded 2010, 6,000+ products, 5 Klang Valley branches (org-wide) | Berkat Madinah Store self-published stats | `E:\sahtree\AI-FACTS.yml` (trust.stats) and `E:\sahtree\CLAUDE.md` |
| Wholesale sourcing pipeline covers 15+ countries | Matches sibling Ampang/Kajang/Shah Alam articles | `E:\sahtree\blog\arabic-grocery-shah-alam-berkat-madinah-store.html` (same claim, reused verbatim pattern) |
| Sihatree sold only through Berkat Madinah Store and its channels (TikTok Shop, Shopee/Arabian Village Malaysia, madinah.com.my, WhatsApp) | Standing site rule — only Berkat Madinah Store may be named as a grocery/supplier | `E:\sahtree\CLAUDE.md`, `E:\sahtree\AI-FACTS.yml` (faq: "Where can I buy...") |
| No JAKIM Halal certificate; "Halal-friendly" / plant-derived wording only | Owner instruction 2026-08-14, content-safety wording decision 2026-07-26 | `E:\sahtree\CLAUDE.md`, `E:\sahtree\AI-FACTS.yml` (trust.certifications blank) |
| No prices published anywhere | Confirmed site-wide decision | `E:\sahtree\AI-FACTS.yml` (pricing_notes) |
| Branch opening hours not published online | "Opening hours are not published anywhere online" — agent_actions note | `E:\sahtree\AI-FACTS.yml` (agent_actions: "Ask before buying") — mirrored honestly in this article's FAQ rather than inventing hours |
| WhatsApp contact | +60 11-1111 9912 / wa.me/601111119912 | `E:\sahtree\AI-FACTS.yml` (contact, identities) — same number used across the site |
| Shopee storefront name | Arabian Village Malaysia — shopee.com.my/arabianvillagemalaysia | `E:\sahtree\AI-FACTS.yml` (identities) |
| Hero image | `/images/arabic-grocery-gombak-berkat-madinah-store.webp`, 1024x576, grocery-aisle interior, no readable text/logos/people | Pre-generated, already placed in `public/images/` before this task — dimensions read directly from the file's VP8 header |

## Assumptions made (not explicitly covered by the brief — flagged here per instructions)

- **FAQ question set**: Chose 6 questions (mirroring the Shah Alam sibling's 5 + the brief's explicitly requested "opening hours" question) rather than inventing more. All 6 are real questions a Gombak-area searcher would plausibly type.
- **Read time**: Kept "5 min read" to match all 3 sibling branch articles (Ampang/Kajang/Shah Alam) — no word-count-based recalculation tool exists on this site, so consistency with siblings was preferred over inventing a different number.
- **Related Articles**: Linked to all 3 other real branch guides (Ampang, Kajang, Shah Alam) — 3 cards, within the "2-3" range specified. Did not link `where-to-buy-arabic-gum-malaysia` to avoid overcrowding the related grid; the in-body "supplier guide" link (`best-arabic-gum-provider-malaysia`) and Ampang branch-guide link already cover cross-linking depth, matching the sibling articles' pattern of 2 body links + a related-articles grid.
- **KL Traders Square description**: Added one descriptive sentence ("a commercial block along Jalan Gombak... among other retail units rather than a standalone shopfront") to help word count and orient a first-time visitor. This is a reasonable inference from the address format ("(Block E) KL Traders Square") indicating a multi-unit commercial development, not a fabricated fact — no specific claim about neighbouring tenants, size, or amenities was made.
- **Meta descriptions trimmed**: Initial drafts (EN 169 chars, MS 188 chars) exceeded the 140-160 char target; both were shortened by dropping "KL Traders Square" from the meta/og description only (kept in full in the JSON-LD `description` and in-body copy) to hit 149 (EN) and 158 (MS) chars. AR was 155 chars on first draft, no change needed.
- **Hero caption/alt wording**: Followed the brief's explicit instruction — described generically ("shelves of imported pantry goods... illustrative of the kind of stock a Berkat Madinah Store branch carries") rather than captioning it as literally "the Gombak branch," since the image is a generated stock-style photo, not a real photo of this specific branch.

## Verification run

- FAQ JSON-LD question count == visible `.faq-item` count == 6, in all 3 files.
- `.blog-benefit-grid` has exactly 6 `.blog-benefit-card` entries, in all 3 files (icons used: fa-seedling, fa-pepper-hot, fa-bread-slice, fa-box, fa-mug-hot, fa-flask — none are on the known-broken list `fa-wheat-awn`/`fa-people-group`/`fa-mango`/`fa-stomach`).
- Body word count (article open → FAQ close, excluding Related Articles/nav/footer): EN 872, MS 840, AR 802 — all within the 800-1000 target.
- No banned adjectives found (certified/official/verified/accredited/trusted/authentic/guarantee/guaranteed etc.) in any of the 3 files.
- 4-line hreflang block (en-MY, ms-MY, ar-MY, x-default) present in all 3 files' `<head>`.
- No price/currency mentioned; no fabricated testimonials; no branch claimed anywhere except the 4 real ones; only Berkat Madinah Store named as grocery/supplier.
