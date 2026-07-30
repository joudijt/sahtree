# Sihatree — Project Memory

## What this is

Static bilingual (English + Bahasa Malaysia) marketing site for **Sihatree**, a Malaysia-focused
wellness brand selling **Arabic Gum Powder** (gum acacia / gum arabic — dried Acacia tree sap, a
natural soluble prebiotic fibre). 5 flavours: Original, Berry Blend, Mango, Pineapple, Pomegranate.
150g packs. Halal-friendly, in line with JAKIM Halal guidelines. Sold retail (TikTok Shop, Shopee) and wholesale (retailers,
supermarkets, cafés, distributors across Malaysia).

No backend, no CMS, no database. Every page is a hand-written static HTML file built with Vite as
a pure multi-page-app bundler.

Business name in code/schema: **Sihatree**. `package.json` name field is `sihatree` (legacy, harmless).

## Content-safety wording decision (2026-07-26)

Per an explicit site-owner content-safety instruction, words implying reliability, official
status, or accreditation — "certified", "certification", "official", "verified",
"verification", "accredited", "accreditation", "trusted", "authentic", "authenticity",
"guarantee", "guaranteed" — were deliberately removed site-wide (blog template, `public/llms.txt`,
and this file), even though several of these (notably "Halal-certified" and "official supplier")
were previously a deliberate AEO/GEO keyword-targeting choice documented elsewhere in this file.
**Do not reintroduce this wording by "fixing" it back to the old phrasing.** The underlying facts
are unchanged (JAKIM Halal guidelines still apply, Berkat Madinah Store is still the seller
behind Sihatree) — only the adjectives describing them were softened, e.g. "Halal-certified" →
"Halal-friendly" / "in line with JAKIM Halal guidelines"; "official supplier"/"official store" →
plain relationship phrasing like "the supplier" / "the seller behind".

## Stack & running it

- Vite 7 multi-page build — every route is a real `.html` file, registered as a Rollup input in
  `vite.config.js`. **Any new page must be added to `vite.config.js`'s `rollupOptions.input` or it
  won't be included in `npm run build`.**
- `src/main.js` — single shared JS: AOS init, retail modal (TikTok/Shopee choice popup), sticky
  CTA scroll logic, FAQ accordion + tab switching, wholesale form (client-side only — no real
  submit endpoint yet, just a fake success animation + confetti), floating hero particles.
- `src/style.css` — single shared stylesheet, all pages.
- `aos` (Animate On Scroll) — the only animation library. Every reveal uses `data-aos="fade-up"`
  etc. Do not introduce a second animation library.
- `.htaccess` in `public/` strips `.html` from URLs and 301-redirects `.html` hits to the clean
  URL — so canonical URLs are extensionless (`/products` not `/products.html`).
  **Do not add a `RewriteCond %{REQUEST_FILENAME} !-d` guard to the extensionless rewrite.** `/blog`
  is both a clean URL (`blog.html`) and a real directory (`blog/`); with `!-d` the rewrite is
  skipped, mod_dir 301s `/blog` → `/blog/`, and Apache serves a directory listing of every article
  file instead of the blog index. It ends in HTTP 200, so a status-code-only sweep passes — assert
  the served `<title>`. Same for `/ms/blog`. `Options -Indexes` is there as a second line of defence.
- No test suite. Verification = `npm run dev`, load pages, check console, mobile-width check at
  375px (project convention — flex/grid children need `min-width: 0` to avoid overflow).
- Commands: `npm run dev`, `npm run build`, `npm run preview`.

## Directory map

```
index.html, products.html, benefits.html, retail.html, wholesale.html, contact.html, blog.html
blog/
  _article-template.html       ← copy this for every new article, replace {{PLACEHOLDERS}}
  what-is-arabic-gum-benefits-uses-dosage.html
  is-arabic-gum-halal-malaysia.html
  where-to-buy-arabic-gum-malaysia.html
ms/                            ← Bahasa Malaysia mirror, same filenames, one-to-one
  index.html, products.html, benefits.html, retail.html, wholesale.html, contact.html, blog.html
  blog/
    apa-itu-gam-arab-faedah-kegunaan-dos.html          (= what-is-arabic-gum...)
    gam-arab-halal-panduan-malaysia.html               (= is-arabic-gum-halal...)
    di-mana-beli-gam-arab-malaysia.html                (= where-to-buy-arabic-gum...)
public/
  robots.txt        — explicit Allow for GPTBot/ChatGPT-User/ClaudeBot/anthropic-ai/PerplexityBot/
                       Google-Extended/Bingbot; explicit Disallow for CCBot (training-only, no
                       citation value); Sitemap: line.
  sitemap.xml        — every EN+BM URL pair, each with inline <xhtml:link> hreflang alternates.
  llms.txt           — AI-crawler summary of the brand in EN/BM/Arabic, key pages, Malaysia search
                       terms in EN+BM+Arabic. Read this file for the canonical keyword list.
  images/            — product shots, flavour images, acacia-tree/gum-crystals story images.
docs/superpowers/specs/  — design decision docs from prior work sessions (homepage redesign,
                       Malaysia localization phase 1). Read before redesigning; they record *why*
                       decisions were made, not just what.
```

## Bilingual architecture (why it's built this way)

Three approaches were considered (see `docs/superpowers/specs/2026-07-11-malaysia-localization-phase1-design.md`);
**separate crawlable URLs** (`/page` EN, `/ms/page` BM) was chosen over a JS toggle specifically
because AI crawlers (GPTBot, ClaudeBot, PerplexityBot) don't execute JS — content behind a JS
toggle is invisible to them, which directly hurts AEO/GEO citation eligibility. This is the reason
the whole site is duplicated file-for-file under `ms/` rather than using any i18n framework.

Every page pair must carry, in `<head>`:
```html
<link rel="canonical" href="https://sihatree.com/{path}" />
<link rel="alternate" hreflang="en-MY" href="https://sihatree.com/{path}" />
<link rel="alternate" hreflang="ms-MY" href="https://sihatree.com/ms/{path}" />
<link rel="alternate" hreflang="x-default" href="https://sihatree.com/{path}" />
```
and a lang-switch `EN | BM` link pair in both the nav (`.lang-switch` li) and footer
(`.footer-lang-switch`), each pointing at its sibling page's exact URL (not just `/` or `/ms/`).

Domain stays `.com` (not `.com.my`) — geo-targeting is via hreflang + Search Console country
target, not domain. This was an explicit client decision, don't suggest `.com.my` again.

## SEO/AEO/AIO/SXO/GEO schema conventions — apply to every page

This is the load-bearing pattern of the whole site. Every page type has an established JSON-LD
recipe; **new pages must match the recipe for their type**, not invent a new one.

| Page type | Schema blocks present |
|---|---|
| Homepage (`index.html`/`ms/index.html`) | `Organization` (with `hasCredential` Halal-credential block, `areaServed: MY`, `sameAs` WhatsApp) + `ItemList` of 5 `Product`s + `FAQPage` |
| Standard subpage (products/benefits/retail/wholesale) | `BreadcrumbList` + `FAQPage` (products also gets `ItemList`) |
| Contact page | `BreadcrumbList` + `ContactPage` (no FAQ) |
| Blog listing (`blog.html`/`ms/blog.html`) | `Blog` type with a `blogPost[]` array of `BlogPosting` stubs (headline/url/datePublished/author) — **must be updated every time an article is added** |
| Blog article | `BlogPosting` (full, with `mainEntityOfPage`, `publisher.logo` as `ImageObject`) + `FAQPage` **only if the article answers 2+ direct questions** (template comment says delete the FAQ block otherwise) |

Every page also carries standard `<meta og:*>` + `<meta twitter:*>` (summary_large_image) tags and
a plain `<meta name="description">` (140–160 chars target).

All 6 articles (3 EN + 3 BM) now carry `BreadcrumbList` (`Home > Blog > {Article}`), matching every
other subpage type. New articles must include it too — copy the pattern from any published article.

### AEO/GEO content convention (from the article template, keep following it)

The **first paragraph** of every article body must directly answer the core question in one bold
opening sentence + one supporting sentence, ~40–60 words, fully self-contained — this is the
passage AI Overviews/ChatGPT/Perplexity lift as a citable snippet. Every `<h2>` should be phrased
as a question a searcher would actually type. Include a stat or concrete number where possible —
the template notes this "measurably raises AI-citation rate."

## Blog content system

`blog/_article-template.html` is the master template — duplicate it for every new post, replace
every `{{PLACEHOLDER}}`, then:
1. Add a matching `<article class="blog-card">` to `blog.html`'s grid (and `ms/blog.html`'s grid
   for the BM version).
2. Add a matching `BlogPosting` stub to `blog.html`'s `Blog` JSON-LD `blogPost[]` array.
3. Add both new URLs (EN + BM) to `public/sitemap.xml` with reciprocal `hreflang` alternates.
4. Add both new pages to `public/llms.txt`'s "Key Pages" list.
5. Register both new files in `vite.config.js` `rollupOptions.input`.

**Current inventory: 43 EN + 43 BM articles** (first 3 published 2026-07-11, next 20 on 2026-07-16,
20 more on 2026-07-20), all translated (not machine-translated — natural Malaysian search phrasing
per the localization spec). Each targets a distinct search intent/keyword set — no two articles
overlap. **Standing rule confirmed 2026-07-20**: only Berkat Madinah Store may be named as a
grocery/supplier in any article — never mention or imply any other Arabic grocery store or
supplier, even generically. Location-based articles must not claim a physical branch in a city
Berkat Madinah Store doesn't actually have one in — verified real branches (checked
madinah.com.my/en/branches 2026-07-20): Ampang (HQ + Cash & Carry), Kajang, Shah Alam, Gombak
(KL) — all Klang Valley. No branch in PJ/Subang, Johor Bahru, or Penang; frame those as
delivery-only (Shopee/Lazada/TikTok Shop) if written later, never as a store visit.

| EN slug | BM slug | Topic |
|---|---|---|
| `what-is-arabic-gum-benefits-uses-dosage` | `apa-itu-gam-arab-faedah-kegunaan-dos` | What it is, benefits, daily dosage |
| `is-arabic-gum-halal-malaysia` | `gam-arab-halal-panduan-malaysia` | Halal/JAKIM guidelines guide |
| `where-to-buy-arabic-gum-malaysia` | `di-mana-beli-gam-arab-malaysia` | Retail/wholesale buying guide, KL/Ampang angle |
| `best-arabic-gum-provider-malaysia` | `pembekal-gam-arab-terbaik-malaysia` | Provider/supplier criteria; establishes Berkat Madinah Store as the supplier |
| `arabic-gum-side-effects-safety-malaysia` | `kesan-sampingan-gam-arab-keselamatan-malaysia` | Side effects, safety, who should be cautious |
| `arabic-gum-weight-loss-malaysia` | `gam-arab-turun-berat-badan-malaysia` | Weight-management deep dive, realistic-expectations framing |
| `how-to-mix-arabic-gum-powder-recipes` | `cara-campur-serbuk-gam-arab-resipi` | Mixing technique + 5 serving/recipe ideas per flavour |
| `arabic-gum-vs-psyllium-husk-malaysia` | `gam-arab-vs-psyllium-husk-malaysia` | Comparison vs psyllium husk (dissolving, fermentation, bulking) |
| `is-arabic-gum-safe-for-kids` | `adakah-gam-arab-selamat-untuk-kanak-kanak` | Paediatric safety — defers to doctor, no invented child dosing |
| `arabic-gum-for-skin-benefits-topical-use` | `gam-arab-untuk-kulit-faedah-kegunaan-luaran` | Topical/cosmetic use — clear that Sihatree's pack is sold for drinking, not skin |
| `arabic-gum-storage-shelf-life` | `penyimpanan-jangka-hayat-gam-arab` | Storage, shelf life, signs it's gone bad |
| `is-arabic-gum-safe-during-pregnancy` | `adakah-gam-arab-selamat-semasa-hamil` | Pregnancy safety — defers to doctor, no invented dosing |
| `arabic-gum-vs-inulin` | `gam-arab-vs-inulin-malaysia` | Comparison vs inulin (source, fermentation speed, sweetness) |
| `arabic-gum-nutrition-facts` | `fakta-pemakanan-gam-arab` | Calories/carbs/fibre/protein/fat/sugar breakdown, reading the label |
| `arabic-gum-for-diabetics-blood-sugar` | `gam-arab-untuk-pesakit-diabetes-gula-darah` | Diabetes-specific safety — not a treatment, medication-timing caution |
| `arabic-gum-for-constipation` | `gam-arab-untuk-sembelit` | Constipation-specific deep dive (bulk vs stimulant laxative framing) |
| `arabic-gum-for-hair-growth-shine` | `gam-arab-untuk-rambut-pertumbuhan-kilauan` | Hair/topical use — not a hair-loss treatment, product sold for drinking not hair |
| `how-to-verify-genuine-arabic-gum` | `cara-sahkan-gam-arab-tulen` | Counterfeit-avoidance checklist, packaging/Halal-guideline signs |
| `arabic-gum-price-malaysia` | `harga-gam-arab-malaysia` | Pricing factors — no invented MYR figures, defers to live official listing |
| `best-arabic-gum-flavour-for-beginners` | `perisa-gam-arab-terbaik-untuk-pemula` | First-flavour decision guide across all 5 flavours, beginner-focused |
| `arabic-gum-for-ramadan-suhoor-iftar` | `gam-arab-untuk-ramadan-suhoor-iftar` | Suhoor/iftar routine ideas, fasting-hour hydration, stock-up-before-Ramadan angle |
| `arabic-gum-gift-sets-raya-malaysia` | `set-hadiah-gam-arab-raya-malaysia` | Raya/gift-giving angle — assembling a gift set from existing packs, not an official product SKU |
| `gum-arabic-malaysian-traditional-medicine-history` | `gam-arab-perubatan-tradisional-malaysia-sejarah` | Historical/heritage angle — traditional uses framed as history/culture, explicitly separated from modern dietary-fibre claims |
| `arabic-grocery-ampang-berkat-madinah-store` | `kedai-barangan-arab-ampang-berkat-madinah-store` | Ampang local guide — Berkat Madinah Store's real HQ/branches, nationwide delivery for everyone else, Berkat-Madinah-only (no other stores named) |
| `berkat-madinah-store-history-charity-work` | `sejarah-berkat-madinah-store-kerja-kebajikan` | Brand story — 2010 Ampang founding, mission/values, orphanage support, food donation, growth stats |
| `berkat-madinah-store-connection-malaysia` | `hubungan-berkat-madinah-store-malaysia` | Brand story — mission statement, 500K+ daily customers, Syrian/Yemeni café culture, local/inclusive hiring |
| `sourcing-arab-products-wholesale-berkat-madinah` | `sumber-produk-arab-borong-berkat-madinah` | Business guide — honest framing of the real wholesale line for small/home-based buyers, no fabricated "support programme" |
| `berkat-madinah-store-quality-halal-trust` | `kualiti-kepercayaan-halal-berkat-madinah-store` | Brand story — quality/credibility values, 5-star rating, Halal identity, sustainable packaging, direct import sourcing, branch consistency |
| `berkat-madinah-store-growth-story` | `kisah-perkembangan-berkat-madinah-store` | Brand story — definitive numbers/timeline: 2010 founding → 5 branches, 6,000+ products, 15+ countries, 150+ employees, 500K+ customers, 6-branches-by-2030 goal |
| `arabic-gum-malaysia-reviews` | `ulasan-gam-arab-malaysia` | Customer-experience patterns (compliant wording, no fabricated named testimonials/quotes) — first gum-arabic-product topic in the 2026-07-20 batch |
| `arabic-gum-flavours-comparison` | `perbandingan-perisa-gam-arab` | Full head-to-head comparison of all 5 flavours (taste/texture/best pairing per flavour) — distinct from the existing beginner-pick article |
| `arabic-gum-best-time-to-drink` | `masa-terbaik-minum-gam-arab` | Morning-vs-night timing guide — conclusion is consistency over clock time, not one "correct" hour |
| `arabic-gum-daily-routine` | `rutin-harian-gam-arab` | Habit-stacking/routine-integration guide (work-from-home, gym, family) — distinct from the mixing/recipes article, which covers technique only |
| `why-arabic-gum-popular-malaysia` | `kenapa-gam-arab-popular-malaysia` | Trend-explainer (social media discovery, traditional-ingredient revival) — no fabricated stats/numbers, honest hedged framing throughout |
| `arabic-gum-gut-health` | `gam-arab-kesihatan-usus` | Prebiotic-fibre/microbiome angle, distinct from the existing constipation article (bulk/regularity only) — completes the full 12-topic plan approved 2026-07-20 |
| `arabic-grocery-shah-alam-berkat-madinah-store` | `kedai-barangan-arab-shah-alam-berkat-madinah-store` | Real branch guide (No. 46, Jln Pegaga C U12/C, Desa Alam, Shah Alam) — second content round, approved 2026-07-20 |
| `arabic-grocery-kajang-berkat-madinah-store` | `kedai-barangan-arab-kajang-berkat-madinah-store` | Real branch guide (Pearl Avenue Shop, Jalan Pasir Emas, Kajang), also captures Bangi-area searches |
| `arabic-gum-scientific-research` | `kajian-saintifik-gam-arab` | E414/EFSA/FDA/JECFA food-safety facts (verified via WebSearch, not fabricated) — ~85% soluble fibre, GRAS status, explicitly states research does NOT establish disease treatment |
| `arabic-gum-for-athletes` | `gam-arab-untuk-atlet` | Active-lifestyle/fitness angle — explicitly disclaims any performance/recovery/energy claims, frames as habit-stacking only |
| `arabic-gum-for-seniors` | `gam-arab-untuk-warga-emas` | Safety-deference framing (same pattern as kids/pregnancy) — no senior-specific dosing invented, doctor consultation emphasized throughout |
| `arabic-gum-myths` | `mitos-gam-arab` | Myth/Fact format, 6 misconceptions (chewing-gum confusion, disease-cure, more-is-better, product-quality-varies, instant-effect, new-trend) |
| `arabic-gum-for-travel` | `gam-arab-semasa-bermusafir` | Packing/routine-continuity angle — TSA-liquid-rules caveat framed as "check current regulations," not legal advice |
| `arabic-gum-for-students` | `gam-arab-untuk-pelajar` | Explicitly disclaims focus/memory/cognitive claims and caffeine-alternative claims — framed strictly as a budget-friendly routine habit, completes the full 8-article round-2 plan approved 2026-07-20 |

All EN articles carry the `.lang-switch` nav link and `.footer-lang-switch` consistently.

**Known-broken Font Awesome icon names** (render as empty/blank glyph on this project's FA 6.0.0 CDN
version — confirmed broken, don't reuse): `fa-wheat-awn` (used `fa-bread-slice` instead),
`fa-people-group` (used `fa-users` instead), `fa-mango` (not a real icon at all, used
`fa-apple-whole` instead), `fa-stomach` (not in the free set, used `fa-water` instead). `fa-band-aid`
renders but as the wrong-looking glyph at card size — used `fa-kit-medical` instead for a wound-care
card. After adding any new icon to a `.blog-benefit-grid`, visually screenshot just that grid element
(via `elementHandle.boundingBox()` + `page.screenshot({clip})`, not `elementHandle.screenshot()`
directly — the latter can time out waiting for the element to be "stable" post-AOS-scroll) after a
real AOS-triggering scroll. Both `getComputedStyle(el, '::before').content` and reading
`document.styleSheets` rules are unreliable here (cross-origin CDN stylesheet blocks rule access,
and the computed-style check reports empty even for icons that render fine) — only a real screenshot
is trustworthy.

**Icon+sentence list rule**: any `.blog-benefit-grid` (icon + heading + one-sentence card) in a
**new** article must have exactly **6 cards** (confirmed 2026-07-16 on the storage article; not
retroactively applied to the skin article's 4-card grid — ask before backfilling older articles).

**Hero/card images — each article uses a distinct image, deliberately varied in style** (not
always a product-pack photo, per explicit client direction 2026-07-16; icon-grid graphics are for
in-article content only, never the hero — confirmed 2026-07-16):
- `gum-crystals.webp`, `acacia-tree.webp`, `plain.webp` — product/ingredient pack shots (first 3 articles)
- `newhero.webp` — lifestyle shot (pack + drink + honey jar at home)
- `confused-person-arabic-gum.jpg` — real Pexels photo (person scratching head) composited with a
  circular crop of `gum-crystals.png` in a card overlay, via `sharp` — see [[project_sahtree]] memory
  for the compositing recipe (no image-gen tool available in this environment)
- `arabic-gum-weight-loss-fruit-tape.jpg`, `arabic-gum-mixing-water-spoon.jpg`,
  `arabic-gum-kids-safety-child-drinking-water.jpg`, `arabic-gum-storage-jar.jpg`,
  `arabic-gum-pregnancy-safety.jpg`, `arabic-gum-nutrition-scale.jpg`,
  `arabic-gum-diabetes-blood-sugar.jpg` — real Pexels photos, thematically matched, no product bag
- `arabic-gum-skin-radiant-woman.jpg` — real Pexels photo, close-up portrait of a woman with
  radiant/clear skin during a skincare routine (fully clothed, headband, modest). The skin article's
  hero has changed twice on 2026-07-16: icon-grid SVG → two-panel cosmetics/glue split →
  this portrait, per successive client requests. Earlier assets
  (`arabic-gum-skin-icons.svg`/`.png`, `arabic-gum-skin-cosmetics-glue.jpg`) were deleted each time.
  When cropping a portrait stock photo to the site's 16:9 hero ratio, `fit:'cover'` with a
  `position` keyword can crop off the face entirely — check the result and use a manual
  `resize` + `extract` crop with a chosen offset if the default crop doesn't keep the subject's
  face in frame.
- `arabic-gum-vs-psyllium-husk.jpg` — composited "VS" split (real `gum-crystals.png` left, generic
  fibre-powder stock photo right — not labelled psyllium specifically, no verified free photo of it existed)
- `arabic-gum-vs-inulin.jpg` — composited "VS" split (real `gum-crystals.png` left, real blue
  chicory flower right — chicory genuinely is inulin's primary source, honestly labelled)
- `mango.webp`, `pomegranate.webp` — flavour pack shots, still unused as of 2026-07-16
- `arabic-gum-constipation-fiber-bowl.jpg` — real Pexels photo, oatmeal + berries fibre bowls
- `arabic-gum-hair-shine-comb.jpg` — real Pexels photo, wooden comb through hair from behind, no face
- `arabic-gum-verify-genuine-package.jpg` — real Pexels photo, hands unboxing a parcel (recropped
  twice via manual `sharp` extract with offset, to push a suspected shipping-brand logo out of frame)
- `arabic-gum-price-tags.jpg` — real Pexels photo, blank white price tags on orange background
- `arabic-gum-flavour-choice-fruits.jpg` — real Pexels photo, colourful fruit flat-lay (mango,
  berries, pineapple, citrus) representing the 5 flavours; distinct from the weight-loss article's
  fruit+tape-measure image (no tape measure/measuring element here)
- `arabic-gum-ramadan-iftar-dates-spread.jpg` — real Pexels photo, traditional iftar table spread
  (dates, tea, side dishes), no faces/logos. Two other Ramadan candidates were rejected for showing
  a visible open Quran page with legible verses in-frame — inappropriate as a commercial-article
  background; picked this food-only spread instead.
- `arabic-gum-gift-wrapped-parcels.jpg` — real Pexels photo, kraft-paper wrapped gift parcels tied
  with twine, no faces/logos/holiday-specific symbols. Several gift-hamper candidates were rejected
  for visible third-party brand logos in-frame (Cadbury, Kit Kat, a boutique bakery box, an energy
  drink can) — picked this neutral wrapped-gift shot instead.
- `arabic-gum-traditional-medicine-mortar-herbs.jpg` — real Pexels photo, stone mortar and pestle
  with dried herbs/botanicals on a wooden board, no faces/logos.
- `arabic-grocery-spice-shelf.jpg` — real Pexels photo, English-labelled bulk spice jars (Cumin
  Seeds, Curry Leaves, Curry Powder, Dill Seeds) on wooden shelving, no faces/logos. Rejected two
  similar shelf candidates for having Cyrillic labels (wrong market context) and one dramatic
  chili-market shot for Spanish labels/visible packaged-product branding.
- `berkat-madinah-food-donation-box.jpg` — real Pexels photo, gloved hands packing a box labelled
  "DONATIONS" with cooking oil/rice/canned goods, no visible face. Rejected a "CHARITY"-signage +
  party-cups staged shot (irrelevant prop) and a volunteer-branded-hoodie candidate in favour of
  this more neutral one.
- `berkat-madinah-malaysia-night-market.jpg` — real Pexels photo, colourful aerial view of a
  Malaysian night market, no faces/logos legible at that distance.
- `berkat-madinah-wholesale-warehouse.jpg` — real Pexels photo, clean warehouse pallet racking with
  generic-labelled boxes, no visible brand names. Rejected a similar warehouse shot for having
  visible third-party roaster-sack branding/logos.
- `berkat-madinah-five-star-quality.jpg` — real Pexels photo, five wooden stars on a plain blue
  background, no logos/text.
- `berkat-madinah-growth-story-sapling.jpg` — real Pexels photo, a hand holding a young sapling
  (growth metaphor), no logos/text. Rejected several grocery-shelf "abundance" candidates and small
  shopfront candidates for this slot — all had visible third-party brand logos or foreign-language
  storefront signage (Carlsberg, Lotte, Daikin, and similar recognisable brands/signage) in frame.
- `arabic-gum-customer-morning-routine.jpg` — real Pexels photo, woman in a modest long-sleeve
  sweater smiling with a warm drink at a kitchen table. Rejected two sleeveless/robe-styled
  candidates for bare-skin/immodest framing — same modesty bar as the pregnancy/kids articles.
- `arabic-gum-flavour-comparison-juices.jpg` — real Pexels photo, pineapple and fruit beside three
  glasses of different-coloured juice, outdoor sunny garden setting. Deliberately different
  composition from `arabic-gum-flavour-choice-fruits.jpg` (flat-lay, no glasses) to avoid reusing
  the same visual idea. Rejected a four-glasses candidate for reading too much like bar cocktails
  (ice + lime-wedge garnish styling) for this halal-focused brand.
- `arabic-gum-morning-water-light.jpg` — real Pexels photo, still-life glass of water in warm
  window light, no people/logos.
- `arabic-gum-daily-routine-flatlay.jpg` — real Pexels photo, flat-lay of a coffee cup, wristwatch,
  and goal-planning journal, no people/logos.
- `arabic-gum-popularity-trend-growth.jpg` — real Pexels photo, wooden blocks in an ascending
  staircase with a drawn upward trend line, teal background. Deliberately avoided any real social
  app screenshot/logo (TikTok etc.) for the trend-watch article — used this abstract growth visual
  instead to sidestep trademark/endorsement issues entirely.
- `arabic-gum-gut-health-fiber-grains.jpg` — real Pexels photo, flat-lay of assorted grains,
  legumes, nuts, and seeds in bowls with measuring scoops, marble surface. Deliberately different
  composition from `arabic-gum-constipation-fiber-bowl.jpg` (oatmeal + berries) to avoid repeating
  that visual for a related-but-distinct topic.
- `arabic-grocery-dates-baskets.jpg` — real Pexels photo, woven baskets piled with dates at a
  market stall, no logos/faces legible.
- `arabic-grocery-mixed-nuts-bowl.jpg` — real Pexels photo, rustic bowl of mixed almonds,
  pistachios, and cashews, no logos/people.
- `arabic-gum-lab-research.jpg` — real Pexels photo, lab bench with glassware, microscope, and a
  molecular-diagram worksheet, no logos, one blurred hand at frame edge (not a focal face).
- `arabic-gum-fitness-recovery-gym.jpg` — real Pexels photo, top-down flat lay of a water bottle,
  towel, and jump rope on a gym mat, no people/logos.
- `arabic-gum-seniors-glasses-cup.jpg` — real Pexels photo, reading glasses and a ceramic cup on a
  wooden table, moody green background, no faces.
- `arabic-gum-myths-magnifying-glass.jpg` — real Pexels photo, magnifying glass over "Frequently
  Asked Questions" text — fact-checking visual, no faces/logos.
- `arabic-gum-travel-packed-suitcase.jpg` — real Pexels photo, colourful rolled clothes in an open
  suitcase. Custom-cropped (sharp `.extract()`, not the default `cover` crop) to exclude a visible
  camera brand name in the original frame's top-left corner — check this gotcha if re-cropping the
  same source photo (Pexels ID 8212229) again.
- `arabic-gum-students-study-desk.jpg` — real Pexels photo, handwritten equations notebook next to
  a glass mug of tea, blurred laptop keyboard (no readable brand) in background, no faces.

**FA 6.0.0 icon gotcha added 2026-07-20**: `fa-house-laptop` and `fa-people-roof` were swapped out
before publishing (not confirmed broken, but both are FA6.1+ additions that may not exist in this
project's pinned 6.0.0 build) — used `fa-laptop` and `fa-users` instead. `fa-shuffle` was used and
confirmed rendering fine via screenshot. When adding a new icon, prefer names confirmed present in
FA 6.0.0's free set over newer additions, and always screenshot-verify per the existing icon gotcha
process above.

Before adding a new article image: check this list (and `public/images/`) for anything already
used as a hero/card, and prefer a genuinely new/unused asset or photo. Sensitive topics (pregnancy,
kids) — favour object-only photos (test/calendar, glass of water) over body-focused stock photos to
stay modest for this brand's audience; several body-focused candidates were rejected for this reason.

## Article design system (established — follow this for every new article)

`blog/_article-template.html` is the up-to-date reference; it carries all of the below. Every
component is CSS-only or a few lines of `src/blog.js`, none of it is `main.js` (articles don't load
`main.js` — it carries unrelated modal/wholesale-form/confetti logic; `src/blog.js` is the
article-only script, loaded via `<script type="module" src="/src/blog.js">`).

- **Hero**: `.blog-post-tag` category pill above the `<h1>`, `.blog-post-lede` on the opening
  answer-paragraph (left accent border, larger type), `.blog-post-hero-caption` under the hero
  image (small italic line, optional but preferred).
- **Table of contents**: auto-generated by `src/blog.js` (`buildToc()`) from the article's `<h2>`s
  — only fires at 4+ headings, nothing to add by hand. Renders as a `<details class="blog-toc">`
  (collapsed on mobile ≤640px, open on desktop) with active-section highlighting via
  `IntersectionObserver` (`initTocScrollSpy()`). Deliberately a `<div role="navigation">`-turned-
  `<details>`, not a bare `<nav>` — the sitewide `nav {}` rule (meant for `#main-nav`) matches any
  `<nav>` tag and forces `position:fixed` on mobile, which broke it once already.
- **Content components** (use only where they genuinely help, not in every section):
  `.blog-highlight` (green-tinted callout), `.blog-tip` (amber, "TIP" label), `.blog-caution`
  (red-tinted advisory), `.blog-quote` (pull-quote, big quotation-mark accent), `.blog-benefit-grid`
  + `.blog-benefit-card` (icon+heading+text cards — good for converting a 4+ item bullet list into
  something more scannable; already used for benefit lists, JAKIM-certification-confirms lists, and
  flavour lineups).
- **FAQ**: a visible `.blog-faq` section using the site's existing `.faq-item`/`.faq-question`/
  `.faq-answer` accordion (same component as `retail.html`) — its questions must mirror the
  article's `FAQPage` JSON-LD exactly, so schema and visible content never diverge. Toggle logic is
  in `src/blog.js` (`initFaqAccordion()`).
- **In-article CTA**: `.blog-inline-cta`, placed once mid-article (not stacked with Related
  Articles at the very end), linking to `/products` (`.btn.btn-primary`) and `/retail`
  (`.btn.btn-outline`).
- **Related Articles**: `.blog-related` section at the end, reuses `.blog-grid`/`.blog-card` from
  the listing page, 2 cards linking to real sibling articles.
- **Micro-interactions**: hero image and related-card thumbnails scale slightly on hover; CTA/
  highlight/tip/caution boxes lift with a soft shadow on hover; buttons lift + darken on hover, get
  a visible `:focus-visible` outline. All `transform`/`opacity`/`box-shadow` only (no layout thrash).
  Everything collapses under `@media (prefers-reduced-motion: reduce)`.
- **No-JS fallback**: every article has
  `<noscript><style>[data-aos]{opacity:1 !important;transform:none !important}</style></noscript>`
  right after the AOS stylesheet link — without it, content stays at `opacity:0` (AOS's default)
  until a scroll-triggered `IntersectionObserver` fires, which never happens if JS fails to load.
- **Accessibility-safe scoping pattern** — when fixing something only on article pages without
  touching the homepage/listing page/other pages that share the same global classes, scope with
  `.blog-post .whatever` or, for the shared footer, `body:has(.blog-post) footer.main-footer ...`.
  This is how `.btn-primary`, `.blog-card-meta`, and the footer's low-contrast text were fixed to
  WCAG AA on articles only, leaving every other page's colors untouched. `html:has(.blog-post)` is
  used the same way for article-only `scroll-behavior: smooth`.

## Placeholders still pending real values (do not silently invent these)

These are intentional, marked placeholders — not bugs — per explicit client decisions in the
localization spec. Find-and-replace tokens when the client supplies real values; don't guess:

- `{{JAKIM_CERT_NO}}` — Halal cert number, appears in schema + on-page badge text across many files.
- `{{PRICE_MYR}}` — every `Product` schema `offers.price`. Site displays no prices anywhere on
  purpose (confirmed decision) — `priceCurrency: MYR` is already correct and final.
- `#todo-shopee-my` / `#todo-tiktok-my` — retail modal buttons, real Shopee/TikTok Shop MY links
  pending from client. Deliberately not bare `#` so pending-vs-broken is unambiguous.
- `https://wa.me/yournumber` — WhatsApp contact link, appears in `Organization.sameAs`,
  `ContactPage.about.sameAs`, and footer social icons across every page. Needs real MY number.
- Footer social icons for TikTok/Facebook/Instagram are bare `#` (only WhatsApp has a real-format
  href, pointed at the placeholder number above).

## Other things worth knowing

- Site targets Malaysia exclusively — no other market/locale is live. See `public/llms.txt` for
  the full canonical list of Malaysia search terms (EN + BM + Arabic) this project is optimizing
  for — e.g. "arabic gum malaysia", "gam arab halal malaysia", "arabic gum kuala lumpur", city
  variants (Ampang, PJ, Shah Alam, Subang Jaya, JB, Penang, Ipoh, Klang).
- `docs/superpowers/specs/2026-07-11-homepage-redesign-vibrant-editorial-design.md` documents the
  current homepage's "Vibrant Editorial" redesign (already implemented) — origin story replaced a
  scroll-hijacked pinned section for accessibility/mobile reasons, flavour carousel now uses CSS
  scroll-snap instead of custom drag-JS. Read before touching homepage structure again.
- Treat any deploy/push as requiring explicit confirmation from the client.
- Working copy on this machine is `E:\sahtree` (an earlier note said `D:\sahtree`).

## Deploy — live on https://sihatree.com since 2026-07-22

Host: Namecheap cPanel. `npm run build`, then FTPS-mirror the whole `dist/` to the docroot.

- **`ftp.madinah.com.my` does not resolve (NXDOMAIN).** Real host is `162.0.215.47`
  (= `ftp.sihatree.com`, = `mail.madinah.com.my`). Pure-FTPd, explicit FTPS on port 21, PASV.
- User `claudesihatree@madinah.com.my` is **chrooted to the sihatree.com docroot** — `pwd` returns
  `/` and that already *is* the docroot. Upload to `/`, never to a `sihatree.com/` subfolder.
- The certificate does not match the bare IP → an FTPS client needs
  `check_hostname=False` + `verify_mode=CERT_NONE`, then `.prot_p()`. Password is not stored in
  this repo; pass it through an environment variable.
- The upload walk **must include dotfiles** or `.htaccess` silently never ships and every clean URL
  404s. Verify each `STOR` with `ftp.size()` against the local size — a failed transfer does not
  always raise.
- Do not delete `/.well-known/pki-validation/verify.txt` or `/.ftpquota` — both belong to the host,
  not to the build.
- Verify after deploying by asserting each route's served `<title>`, not its status code.
- Deployed 2026-07-22: 179 files, all size-verified, 19 routes checked green, `sihatree.com` A
  record now correctly points at `162.0.215.47`.
