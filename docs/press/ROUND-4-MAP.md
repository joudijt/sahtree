# ROUND-4-MAP — Sihatree PRESS round 4

Written by PRESS Stage 1, 2026-09-15. Branch `press-round-4`. Pre-round sha `98115f5`
(post round-3 merge to `main`).

## Round shape

**5 new EN articles** (`/blog/`). No MS or AR twins this round (non-negotiable #4: each language
gets its own demand research, never a translation). English was the language behind — 52 EN
articles vs 61 MS and 49 AR at round start — and none of the 5 chosen topics collides with an
existing MS/AR topic's search space, so there was no translation obligation created either way.

## Why English, and why these five

Round 3's full `page,query` GSC pull (2026-06-17 to 2026-09-15) showed **every genuine AR demand
signal already lands on a live AR page** — that's what turned round 3 into a strengthen-only round
with zero new articles. Re-running that same live-keyword-research step for round 4 (no GSC
constraint this time, per the user's plain "press sihatree 5 articles" with no GSC qualifier) found
the clearest gap sitting in EN: five evergreen wellness angles with real, ordinary search volume
that no EN, MS or AR article on the site currently owns, confirmed by grepping every existing
`<title>`/`<h1>` for each candidate term before writing anything (see Cannibalisation check below).

Each of the five follows the exact claim-refusal pattern the site already established on
diabetes, weight loss and the round-2 men's-health cluster — capture the query, refuse the
unlawful/unproven claim in the same breath — rather than inventing new territory:

| id | slug | focus keyword | why it's a gap |
|---|---|---|---|
| R4-1 | `arabic-gum-cholesterol` | arabic gum cholesterol | MS already has `gam-arab-untuk-kolesterol` (round 2); no EN counterpart existed. Independently researched and written for an EN audience, not translated. |
| R4-2 | `arabic-gum-blood-pressure` | arabic gum blood pressure | No article on the site, any language, addresses blood pressure at all. |
| R4-3 | `arabic-gum-while-breastfeeding` | arabic gum while breastfeeding | Pregnancy is covered (`is-arabic-gum-safe-during-pregnancy`); breastfeeding/postpartum is a distinct intent the existing FAQ only gestures at in one line. |
| R4-4 | `arabic-gum-metabolism-energy` | does arabic gum boost metabolism | No article addresses the "boosts metabolism/energy" claim family directly — an obvious claim shoppers encounter on other sellers' pages. |
| R4-5 | `arabic-gum-detox-water-trend` | arabic gum detox water | "Detox water" is a real online trend format; no article on the site addresses it, and it's the one topic in this round that required active claim-refusal discipline around the word "detox" itself (see Gate). |

## Cannibalisation check

Before writing, every existing EN/MS/AR `<title>` and `<h1>` across the full site (162 articles at
round start) was grepped for `cholesterol|blood pressure|breastfeed|metabolism|detox`. Four
existing articles matched incidentally — `acacia-gum-benefits-evidence` (cholesterol and detox
both appear inside its own refutation table, as refused claims, not its focus),
`arabic-gum-side-effects-safety-malaysia`, `is-arabic-gum-safe-during-pregnancy` and
`what-is-arabic-gum-benefits-uses-dosage` (each has a single incidental "breastfeeding" mention in
a caution line or FAQ). None of the four owns any of these five terms as its focus keyword or
title. All five round-4 focus keywords are confirmed unique across the site.

## Legal ceiling — same as every round

Malaysia Food Regulations 1985 Reg. 18(6): no food may claim to prevent, treat or cure. All five
articles capture a claim-adjacent query and refuse the claim in the same breath, matching the
site's existing pattern (round 2 B-cluster, C2, diabetes, pregnancy). No prices in any currency.
Only Berkat Madinah Store named as supplier.

## Grounding

Every fact used (E414, ~85% soluble fibre, EFSA/FDA-GRAS/JECFA assessments, 5 flavours, 150 g
pouch, Malaysia Food Regulations 1985) is already published on the site — `AI-FACTS.yml`,
`public/llms.txt`, and the existing `arabic-gum-scientific-research` / `acacia-gum-benefits-evidence`
articles. Nothing new was invented. No testimonials, no counts, no ratings, no founding-year
claims used anywhere in this round.

## Images — reuse only, second genuinely different crops

All 5 heroes are second crops of existing site photographs, cropped locally with PIL, nothing
generated. See `round-4/IMAGE-INVENTORY.md` for the full source→crop table and a note on one
mid-round correction (two of the five initial crops landed on near-duplicate source photos and
were swapped before publishing).

## Internal linking

Each article links to 2 money pages (`/products` + `/retail`) and 2-3 sibling articles chosen for
genuine topical relevance (e.g. the cholesterol and blood-pressure articles cross-link each other
and the diabetes/blood-sugar article; the detox-water article links to the existing bloating and
mixing-recipe guides). Inbound: all 5 added to `blog.html`'s grid and `Blog` JSON-LD `blogPost[]`
array. The optional "extra card on a matched existing article's Related Articles rail" enhancement
that earlier rounds used was **not done this round** — scope decision, see DECISIONS.

## Round payload

5 new HTML files + 5 new images (total ~532 KB for the 5 images, largest 174 KB). Well under any
round payload ceiling previously set.

## Rollback

Pre-round sha `98115f5` on `main`; all work on `press-round-4`. Revert:
`git checkout main && git branch -D press-round-4`.

## Stage 7 — shipped 2026-09-15

- **Build**: `npm run build` exit 0. All 5 new files confirmed in `dist/blog/`.
- **Local check** (Playwright, desktop 1280px + phone 375px, preview server, 5 pages × 2 widths =
  10 runs): **10/10 PASS**. No horizontal overflow, hero renders, FAQ accordion (6 items each)
  toggles, tables render inside their own scroll wrapper only, 3 related-article cards each, zero
  console errors.
- **Deploy**: `python scripts/ftp-deploy.py`. **First attempt crashed mid-run** —
  `FileNotFoundError` on `dist/blog/acacia-gum-benefits-evidence.html`, a file that existed both
  before and after the crash (confirmed on disk), so a transient filesystem/AV hiccup, not a
  missing file. The crash landed before any `/blog/*.html` file uploaded, so the 5 new round-4
  articles were **not** live after the first attempt — verified (`/blog/arabic-gum-cholesterol`
  served no title) before treating anything as shipped. **Re-ran the deploy**: clean full pass,
  **307 uploaded, 0 skipped, 0 failed; verify: checked 307, mismatched 0.**
- **Live verification by content**: all 5 new URLs fetched and confirmed to serve the correct
  `<title>` — status-code-only checks were not used.
- **Live browser check**: same 10-run Playwright suite re-run against `sihatree.com` — **10/10
  PASS**, same criteria as local.
- **Merge/push**: `press-round-4` → `main`, clean fast-forward `98115f5..fd58c1b`, pushed to
  `origin/main`. Branch left intact as history. Commits `00a5fd4`, `fd58c1b`.
