# ROUND-3-MAP — Sihatree PRESS round 3 (GSC-driven, strengthen not compete)

Written by PRESS Stage 1, 2026-09-15. Branch `press-round-3-ar-strengthen`. Pre-round sha `cc2d58b`
(post round-2 merge to `main`).

## Round shape

**0 new articles. 6 existing Arabic (`/ar/blog/`) pages strengthened.** This is a deliberate
departure from the user's initial "5 new AR articles" framing — see Decision below.

## Demand data

Pulled from **live GSC (90-day, 2026-06-17 to 2026-09-15), via `gsc_probe.py` (standing OAuth
token already covers `sc-domain:sihatree.com` — no Cogny quota spent)**, dimensions `page,query`.

| Existing page | Top queries it already ranks for | Impr (90d) | Position |
|---|---|---|---|
| `arabic-gum-for-skin-benefits-topical-use` | الصمغ العربي للبشرة, فوائد الصمغ العربي للبشرة, استخدام الصمغ العربي للبشرة, + ~15 more skin/face variants | ~155 | 8.0-19.0 (cluster ~9-12) |
| `arabic-gum-for-hair-growth-shine` | فوائد الصمغ العربي للشعر, الصمغ العربي للشعر, تجربتي مع الصمغ العربي للشعر | ~44 | 7.0-11.5 |
| `what-is-arabic-gum-benefits-uses-dosage` | الصمغ العربي, فوائد الصمغ العربي, ما هو الصمغ العربي, صمغ العربي | ~43 | 19.5-49.0 (worst position of the six — biggest headroom) |
| `is-arabic-gum-safe-during-pregnancy` | الصمغ العربي للحامل, هل الصمغ العربي يضر الحامل, فوائد الصمغ العربي للحامل | ~19 | 9.3-12.0 |
| `arabic-gum-for-diabetics-blood-sugar` | الصمغ العربي والسكري, فوائد الصمغ العربي لمرضى السكري, الصمغ العربي للسكر | ~13 | 9.0-11.7 |
| `arabic-gum-for-constipation` | الصمغ العربي للامساك, فوائد الصمغ العربي للامساك | ~4 | 9.7-11.0 |

Zero clicks across all 72 AR page+query rows in the 90-day window.

## Decision: strengthen, don't write new (the pivot)

The session's initial framing to the user was "biggest gap is an AR skin/hair/face demand cluster
— no AR article targets it." That framing was **wrong**, caught before any new article was
written: a `page,query` pull (not just `query`) showed **every one of these queries already lands
on an existing, live AR article**, all clustered at position 9-20. This is not a coverage gap, it
is a position/depth problem on pages that already exist.

Writing 5 new AR articles on the same terms would have **cannibalised these six live pages** —
exactly the trap PRESS non-negotiable #8 and round 2's own `/ms/benefits` and 4-branch-page
decisions exist to avoid. Surfaced to the user with the corrected picture; **user decision,
2026-09-15: strengthen the 6 existing pages instead of writing new ones.**

On inspection, five of the six pages' `<title>`/meta/H1 were **already well-led with their exact
head query** (e.g. the skin page's title literally opens with "الصمغ العربي للبشرة"). Rewriting
already-correct title/meta tags would have no upside and risks losing the position they already
hold. The real, honest lever left is **content depth** — the same defect class round 2's GATE.md
proved site-wide: these six pages were written 2026-07-16/07-11, before round 2 added
`.blog-post-body table` CSS, so none of them carries a real `<table>` (the `structured-block` gate
class). Answer engines lift tables preferentially, and the site's own table CSS is already
RTL-ready (`[dir="rtl"] .blog-post-body table caption`, added round 2, DECISIONS #13).

## What changed on each page

Per page: one genuine fact-grounded `<table>` (no invented figures — skin/hair tables restate
already-published prose as a scannable comparison; the "what is" table reuses the site's own
published E414/85%-soluble-fibre/EFSA/FDA-GRAS/JECFA facts, already live on
`blog/arabic-gum-scientific-research` and its AR twin; diabetes/pregnancy/constipation tables
restate already-published caution/comparison content as a table), one new FAQ Q&A (both the visible
`.faq-item` and the `FAQPage` JSON-LD, verbatim-matched) grounded in a real near-miss GSC query the
page did not yet explicitly answer, and `dateModified` bumped to 2026-09-15 in the `BlogPosting`
JSON-LD (the visible publish-date badge is untouched — it is a historical fact, not a freshness
signal).

| Page | New FAQ grounded in query | Legal-ceiling handling |
|---|---|---|
| skin | "طريقة استخدام الصمغ العربي للوجه خطوة بخطوة؟" (كيفية استخدام...للوجه, ~7 impr) | Restates the existing 4-step benefit-grid content, no new claim |
| hair | "ماذا يُقال عادة عن تجربة استخدام الصمغ العربي على الشعر؟" (تجربتي مع...للشعر, 8 impr, the query's only click in the whole 90-day pull) | Answered as a general reported pattern, not a fabricated named testimonial (non-negotiable #1) |
| what-is | "هل الصمغ العربي مسجّل كمادة مضافة غذائية (E414)؟" (فوائد الصمغ العربي / ما هو الصمغ العربي) | Reused already-published E414/EFSA/FDA/JECFA facts verbatim from the site's own scientific-research article; **caught and fixed a self-introduced banned-word hit** — first draft used "معتمدة" (certified/accredited), which is on the project's own AR-banned-adjectives list (`scripts/check-llms.mjs` `AR-banned-adjectives`); reworded to "مسجّل" (registered) before this was gated |
| pregnancy | "هل للصمغ العربي فوائد محددة للحامل أو للجنين؟" (فوائد الصمغ العربي للحامل والجنين) | Explicit refusal — no fetal/pregnancy-specific benefit claimed, defers to doctor |
| diabetes | "هل يؤثر الصمغ العربي على السكر التراكمي (HbA1c)؟" (هل الصمغ العربي يرفع/ينزل السكر التراكمي) | Explicit "insufficient data" refusal, not a claim either direction |
| constipation | "هل يمكن أن يسبب الصمغ العربي انزعاجًا في المعدة؟" (أضرار الصمغ العربي للمعدة) | Restates the existing side-effects-guide caution, links out to it |

## Gate

- `node scripts/check-llms.mjs`: exit 0, unaffected (scans `public/llms.txt` only, not blog HTML).
- `npx html-validate` on the 6 changed files: **exit 0, zero errors** — the changes stay clear of
  the site's 132 pre-existing baseline errors (`no-raw-characters`, `no-inline-style`, etc.); no new
  inline styles were introduced, the table markup reuses round 2's existing CSS classes only.
- All 18 new/changed `<script type="application/ld+json">` blocks parsed as valid JSON (byte check).
- Full AR-banned-adjectives sweep (`معتمد|معتمدة|موثوق|موثوقة|رسمي|رسمية|مضمون|مضمونة|ضمان|أصالة`)
  run against all 6 files post-edit: one self-introduced hit found and fixed (see table above); the
  two remaining hits (`موثوق` on the diabetics page, `رسمية` on the what-is page) are **pre-existing
  in the live site since before this round** and out of this round's scope, same convention round 2
  used for the pre-existing 132 html-validate errors.
- Every new FAQ mirrors its JSON-LD `Question`/`Answer` pair to the visible `.faq-item` verbatim.

## Rollback

Pre-round sha `cc2d58b` on `main`; all work on `press-round-3-ar-strengthen`. Revert:
`git checkout main && git branch -D press-round-3-ar-strengthen`.
