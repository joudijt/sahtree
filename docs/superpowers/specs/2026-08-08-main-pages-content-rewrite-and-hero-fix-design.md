# Main-Pages Content Rewrite + Hero Image Fix — Design

**Date:** 2026-08-08
**Scope:** the 6 main pages × 3 locales = 18 files (`index`, `products`, `benefits`, `retail`, `wholesale`, `contact` in EN root, `ms/`, `ar/`), plus `src/style.css` for the hero rebuild and the homepage section reorder.
**Out of scope:** `blog.html` / `ms/blog.html` / `ar/blog.html` and all 129 article files. Nav markup. The sticky CTA bar.
**Baseline:** commit `e4e055d`, working tree clean.

## Problem

Two separate complaints, delivered together.

**Content.** The main pages read like a brochure written by someone selling, not explaining. Three specific failures:

1. Headlines don't say what the product is. The homepage H1 is "Gum Arabic.. nature's gentle touch for lifelong wellness." — a reader scanning it learns almost nothing. Benefits leads with "A Natural Fibre Habit, Made Simple", which contains neither the product name nor a benefit.
2. Every hero opens with two buy buttons ("Shop Retail" / "Wholesale Inquiry"), including on Benefits, whose job is to explain rather than sell. The sticky CTA bar already surfaces both once the reader scrolls, so the hero buttons are redundant as well as pushy.
3. The prose drifts into essay register. The Benefits intro ("Most fibre habits fail for the same reason: they ask too much of the day… The four things below aren't marketing claims stacked on top of each other") is meta-commentary about the page instead of the benefits the page promises.

Separately, the word "Flavours" implies added flavouring chemistry. The product is positioned as wholly natural, so the label contradicts the positioning.

**Hero image.** Measured at 390×844: the hero box is 390×680 (aspect 0.57) and the photo is 1671×941 (aspect 1.78). `background-size: cover` scales the photo to 1210px wide inside a 390px box, discarding **68% of its width**, centred — and the product pack sits on the right, so it is sliced to a single letter. On desktop 1440×900 the box is 1440×828 (1.74) which crops less, but still clips the glass at the right edge and the bowl at the bottom. The dark scrim is also ineffective: the `linear-gradient(90deg, …)` is authored for a left-text/right-photo split, so on a stacked mobile layout it darkens nothing useful and white text lands on bright foliage.

A 390px audit across all 6 pages found the hero is the **only** cropped image on the site. No other `<img>` is cropped, and there is zero horizontal overflow. The fix is bounded to the hero.

## Decisions taken

| Question | Decision |
|---|---|
| Locale scope | All three locales in one pass — 18 files |
| Replacement for "Flavours" | **Fruit-Inspired Tastes** |
| Hero CTAs | Removed from every page hero, all 6 pages |
| Homepage H1 | "One Scoop. A World of Goodness." / "Nature's fibre, in every sip." |
| Hero rebuild | Keep the desktop composition; rebuild mobile so nothing crops |
| Benefits essay intro | Replaced by four at-a-glance benefit cards |

## Part A — Hero rebuild

Desktop keeps the composition the user iterated on in the 2026-07-28 redesign. Only two things change:

- `background-position` moves from `center` to `right center` on `.se-hero--photo-en` (and `left center` on `.se-hero--photo-ar`, whose source is mirrored), so the crop eats empty foliage on the far side instead of the pack, glass and bowl.
- The scrim becomes strong enough to actually carry white text. The existing `linear-gradient(90deg, …)` layer is kept for the photo variants but its stops are tuned so the text half reaches a contrast ratio of at least 4.5:1 against the lightest pixel underneath.

Below 968px the hero stops being a background image and becomes two stacked bands:

```
+----------------+   .se-hero::after — the photo in a box locked to
|  WHOLE PHOTO   |                     aspect-ratio 16/9, so cover crops
|  pack visible  |                     nothing (source is 1.78 ≈ 16/9)
+----------------+
| brand gradient |   .se-hero-layout — text on the existing brand gradient,
| H1 + sub       |                     not on the photo, so contrast is a
| trust pills    |                     property of the design rather than
+----------------+                     of whichever pixels land behind it
```

Implementation notes:

- The mobile band is a `::after` on `.se-hero`, so no HTML changes. Below 968px `.se-hero` becomes `flex-direction: column` and the pseudo-element becomes a flex item with `order: -1`, placing it above `.se-hero-layout`. The photo box is `aspect-ratio: 16 / 9` with `background-size: cover`; because the source is 1.78 and the box is 1.78, cover crops nothing. AR's source is 1.79, so under 1% is lost — acceptable.
- Above 968px the `::after` is `display: none` and the desktop background layer is unchanged. One source file, one download, at both widths.
- The `::before` blob overlay must be suppressed on mobile, or its blurred green/orange radials will wash out the photo band the way they currently wash out the desktop scrim.
- `.se-hero { overflow: hidden }` currently clips the bowl at the bottom on desktop; verify after the position change whether it still does.
- The AR variant uses `hero-bg-mango-tree-ar.webp` (1376×768, mirrored). Its anchor is the mirror of EN's — `left center`. This is a **physical** property on purpose: the image is mirrored per locale rather than flipped by CSS, so a logical property would double-mirror it.
- `min-height: 92vh` on desktop and `min-height: auto` on mobile both stay.

**Verification:** screenshots at 1440×900 and 390×844 for all three locales, plus a re-run of the 390px crop audit showing the hero no longer reports as cropped. Contrast of H1 and sub measured against the actual rendered pixels, not against the intended scrim.

## Part B — Content rewrite

### Voice rules (apply to every page)

1. **Short, ordinary words.** Ban list from the current copy: *sidesteps, friction, a much better predictor, this is deliberate not incidental, stacked on top of each other, genuinely simple*. If a sentence needs a second reading, rewrite it.
2. **The product name appears in or beside every H1.** A reader who lands cold must learn "this is Arabic Gum" without scrolling.
3. **No selling above the fold.** No hero contains the words Shop, Buy, Order or Inquiry. Buying lives in the sticky bar, the store cards, the mid-page CTA and the footer — all already built.
4. **Explain, don't assert.** Prefer "here's what it does" over "the best choice for you".
5. **Sentences under ~20 words**, paragraphs under 3 sentences.

### Preserved constraints (do not regress)

- No Halal-certificate claim of any kind, and no "follows JAKIM guidelines" paraphrase. Approved wording only.
- "Prebiotic-style" stays hedged. Never "prebiotic" bare, never a gut-health promise.
- No medical or therapeutic claims; every existing disclaimer survives the rewrite.
- Berkat Madinah Store is the **supplier**, never a retail partner. Arabic: **متجر بركات المدينة**.
- Existing JSON-LD FAQ questions must keep matching their visible accordion text. Any FAQ heading reworded in HTML gets the same edit in the schema block.

### Terminology change

"Flavour(s)" → "Fruit-Inspired Tastes" (plural label) / "Taste" (singular). Affected within scope: 91 occurrences across the 6 EN pages, plus their `ms/` and `ar/` equivalents. Includes eyebrows (`Flavour 01`…`Flavour 05` → `Taste 01`…`Taste 05`), section headings, body copy, `<title>`, meta descriptions, and trust-pill text.

- MS: **Rasa Buah Semula Jadi** (Malay register — not Indonesian; see the "kemasan/pembungkusan" class of error from the 2026-07-30 pass).
- AR: **نكهات فاكهية طبيعية**.

The five product names (Original, Berry Blend, Mango, Pineapple, Pomegranate) are unchanged.

**Known gap, accepted:** "flavour" also appears in 44 blog files, which are out of scope. The blog will use the old word until a separate sweep is approved.

### Page-by-page

#### Homepage

Hero:

- Eyebrow: `Nature's Essence, Reimagined` → **`Pure Arabic Gum Powder`**
- H1: **`One Scoop. A World of Goodness.`** / *`Nature's fibre, in every sip.`*
- Sub: **"Arabic Gum is the natural sap of the acacia tree, dried into a soft powder. Stir one scoop into any drink — that's the whole routine."**
- Trust pills: `Halal-Friendly` · `5 Fruit-Inspired Tastes` · `Made for Malaysia`
- Both hero buttons deleted.

Section order changes. The six-point strip currently lives *inside* `.se-story` as `.se-story-highlights`; it is lifted out into its own band, and both it and "Why Sihatree" move above the story:

| | before | after |
|---|---|---|
| 1 | Hero | Hero |
| 2 | From Tree to Table (strip nested at its end) | **Six-point strip** (own band) |
| 3 | Why Sihatree | **Why Sihatree** |
| 4 | Flavours | From Tree to Table |
| 5 | Trust panel | Fruit-Inspired Tastes |
| 6 | … | Trust panel, then unchanged |

Six-point strip content, one wording change only:

Rich in natural fibre · Prebiotic-style fibre · Easy daily habit · Naturally sourced · **Refreshing fruit-inspired tastes** · Convenient powder format

"Why Sihatree" ("Built for Real Daily Life", and its four cards Naturally Inspired / Easy for Everyday Use / Retail Ready / Growing Across Malaysia) keeps its current text — the user supplied it verbatim as what they want.

"From Tree to Table" keeps its heading and three cards. The only edit is "fruit-inspired flavours" → "fruit-inspired tastes" in the Today card.

Tastes section: eyebrow `Our Vibrant Range` → **`Fruit-Inspired Tastes`**; H2 `Find Your Favourite Flavour` → **`Five Tastes. One Natural Fibre.`**

#### Products

- H1: `Five Flavours, One Simple Daily Habit` → **`Same Natural Fibre. Five Fruit-Inspired Tastes.`**
- Sub: "Every pack holds the same Arabic Gum from the acacia tree. Pick the taste you'll actually look forward to."
- `Jump to a Flavour` → **`Jump to a Taste`**; `Flavour 01–05` → `Taste 01–05`
- Hero buttons deleted.

#### Benefits

- H1: `A Natural Fibre Habit, Made Simple` → **`What Arabic Gum Actually Does`**
- Eyebrow: **`Natural Soluble Fibre`**
- Sub: "One natural fibre from the acacia tree. Here's what it does, what it doesn't, and how little effort it takes."
- Hero buttons deleted.
- The two-paragraph essay intro is deleted and replaced with four at-a-glance cards, mirroring the four detail rows that follow: *From a real tree* · *Prebiotic-style fibre* · *One scoop, no prep* · *Drinks and cooking*. Reuse the existing `.se-highlight` / chip-card styling rather than inventing a component.
- Section H2 `Built for a Real Daily Routine` → **`One Scoop. No Prep.`**
- `Prebiotic-Style Fibre Support` and `More Than Just a Drink Mix` keep their headings; their bodies are simplified under the voice rules. The probiotic-vs-prebiotic distinction paragraph stays — it is the page's most useful passage — but in shorter sentences.
- `Straight From the Acacia Tree` keeps its heading.

#### Retail

- H1: `Shop Sihatree Online` → **`Where to Buy Sihatree Arabic Gum`**
- Sub: "Sihatree is sold online and in store across Malaysia. Here's every place you can get it."
- Hero buttons deleted; the three store cards below are the buying path and are untouched.
- `Pick a Flavour` / `Five Ways to Enjoy Sihatree` → `Pick a Taste` / heading kept.

#### Wholesale

- H1: `Bring Sihatree to Your Shelves` → **`Put Arabic Gum on Your Shelves`**
- Sub: plain-words rewrite of the current partner list.
- Hero buttons deleted; the inquiry form and WhatsApp button lower down are the conversion path and stay.

#### Contact

- H1: `We'd Love to Hear From You` → **`Ask Us Anything About Arabic Gum`**
- Sub: "Questions about a taste, an order, or stocking Sihatree? Write to us — we reply within 1–2 business days." (The 1–2 business days figure already appears elsewhere on the page and must stay consistent.)

### Metadata

Every changed H1 gets its `<title>` and meta description reviewed in the same edit — titles ≤ 60 characters, descriptions ≤ 159. Eight pages were already over 60 characters before this work (worst: `ar/retail.html` at 82); this rewrite is the occasion to bring them under.

## Verification

1. `npm run build` clean.
2. `npx html-validate` on the 18 files, error counts compared against the baseline **using the same explicit 18-file list**, never a `ms/*.html ar/*.html` glob — the glob pulls in the two blog listing pages and fakes a regression.
3. Playwright render of all 18 pages at 1440×900 and 390×844 with incremental scroll to settle AOS, dumping `innerText` and full-page screenshots; zero console errors.
4. Re-run the 390px crop audit: the hero must no longer be reported as cropped, and no new cropped image may appear.
5. Grep the 18 files for `flavour`/`Flavour` and their MS/AR equivalents — expect zero hits.
6. Grep for the banned Halal-certificate phrasings, in all three languages, including the non-"JAKIM" paraphrases (`garis panduan Halal`, `panduan Halal`).
7. Visual check in a real browser of the homepage and benefits page in all three locales before calling it done.
8. Confirm `git status` shows only the 18 HTML files, `src/style.css`, and this spec.

## Risks

- **Reordering the homepage may break AOS delays.** The `data-aos-delay` values are tuned per section; moving a section changes the order in which they fire. Check the reveal sequence visually after the move, not just the markup.
- **Lifting the six-point strip out of `.se-story` inherits styling from its old parent.** `.se-story-highlights` is styled as a child of `.se-story-inner`, which carries the page frame. The new band needs the frame applied directly or it will sit at a different width from every other section — the exact class of bug documented in the 2026-07-30 width unification.
- **AR headline lengths differ from EN.** The 2026-07-28 hero work sized AR first and matched EN/BM to it. New headlines are shorter, so the sizing relationship must be rechecked per locale, not assumed.
- **Three locales drift.** Every edit lands in all three files or none.
