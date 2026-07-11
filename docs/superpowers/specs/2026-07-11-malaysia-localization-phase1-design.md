# Malaysia Market Localization — Phase 1 (Foundation + Homepage)

## Context

Sihatree (Arabic Gum Powder brand, sold via retail + wholesale) is targeting Malaysia as its
market. Product already holds Halal certification (cert number/logo pending from client). Goal:
optimize the site for Malaysia across SEO, AEO (answer engine optimization), AIO (AI Overviews),
GEO (generative engine optimization), and SXO (search experience optimization).

This is Phase 1 of two. Phase 2 (blog bilingual content strategy/workflow) follows once this is
built and approved.

## Decisions from brainstorming

- **Language**: Bilingual English + Bahasa Malaysia from day one.
- **Site scope**: No other market is live. The existing `sihatree.com` becomes the single
  MY-targeted site (no separate subdomain/site).
- **Domain**: Keep `.com`, geo-target via `hreflang` + Google Search Console country target.
  `.com.my` explicitly declined.
- **Retail links** (Shopee Malaysia, TikTok Shop Malaysia): not yet available — ship with clearly
  marked placeholders, not silent `#` links.
- **Halal cert number/logo + MY phone/WhatsApp**: not yet available — ship with clearly marked
  placeholders.
- **Pricing**: site currently displays no prices anywhere (confirmed by scan of `index.html`) —
  `Product` schema `offers.price` stays a placeholder; `priceCurrency` is set to `MYR` now since
  that part is known regardless of the number.

## Approach

Three options considered for EN/BM bilingual delivery:

- **A — Separate crawlable URLs** (`/index.html` EN, `/ms/index.html` BM) with `hreflang`
  cross-links between every page pair. **Chosen.** Every crawler — including AI crawlers that
  don't execute JS (GPTBot, ClaudeBot, PerplexityBot) — sees full static content per language.
  Directly serves the AEO/GEO requirement that content be extractable without rendering.
- **B — Single URL, JS-toggled language.** Rejected — content behind a JS toggle is invisible to
  non-JS crawlers, actively hurts AEO/GEO.
- **C — Hybrid** (JS toggle on homepage, real URLs for blog only). Rejected — inconsistent,
  leaves half the site with the JS-invisibility problem.

## Structure

```
index.html                  EN homepage (existing, path unchanged, stays canonical default)
ms/index.html                BM homepage (new)
blog.html  /  ms/blog.html   EN / BM blog listing (ms/blog.html scaffolded now, empty-state
                              copy in BM; full BM article content is Phase 2)
blog/<slug>.html             existing EN articles (unchanged)
robots.txt                    new — explicit allow for AI crawlers
sitemap.xml                   new — every EN+BM URL with inline hreflang alternates
```

Every page pair carries:

```html
<link rel="alternate" hreflang="en-MY" href="https://sihatree.com/index.html" />
<link rel="alternate" hreflang="ms-MY" href="https://sihatree.com/ms/index.html" />
<link rel="alternate" hreflang="x-default" href="https://sihatree.com/index.html" />
```

## Homepage changes (EN `index.html` + new BM `ms/index.html`)

- **Language switcher** — "EN | BM" links added to `nav-right` and footer `Quick Links`, each
  pointing to its sibling page.
- **Halal trust badge** — new visual badge block placed near the benefits section, using a
  placeholder cert number token (`{{JAKIM_CERT_NO}}`) that's unambiguous to find-and-replace later,
  not a fake-looking real number.
- **Schema additions**:
  - `Organization` gains `areaServed: "MY"` and a `hasCredential` entry
    (`schema.org/EducationalOccupationalCredential`-style Certification block) for the Halal cert,
    also placeholder-valued.
  - New `Product` schema block per flavor (5 flavors), `offers.priceCurrency: "MYR"`,
    `offers.price` left as an explicit placeholder token, `areaServed: "MY"`.
- **Retail CTA links** — Shopee/TikTok buttons get placeholder hrefs like `#todo-shopee-my` /
  `#todo-tiktok-my` instead of bare `#`, so pending-vs-broken is unambiguous at a glance.
- **BM homepage copy** — full translation of all homepage sections (hero, acacia-tree story,
  benefits, product range, wholesale form labels, footer), written for natural Malaysian search
  phrasing (e.g. "gam arab", "serat larut", "kesihatan usus"), not literal machine translation.
  `<html lang="ms">` on the BM page.

## robots.txt + sitemap.xml (currently missing entirely — confirmed by scan)

- **`robots.txt`**: allow-all baseline; explicit `Allow:` lines naming GPTBot, ClaudeBot,
  PerplexityBot, Google-Extended, Bingbot; explicit `Disallow:` for CCBot (training-only crawler,
  no citation value, per AI-SEO guidance); `Sitemap:` line pointing to `sitemap.xml`.
- **`sitemap.xml`**: lists `index.html`, `ms/index.html`, `blog.html`, `ms/blog.html`, and all
  existing `blog/<slug>.html` pages; each `<url>` entry includes `<xhtml:link>` hreflang alternates
  for its language sibling where one exists.

## Explicitly out of scope for Phase 1

- Blog bilingual article content and BM article template (Phase 2)
- Real Shopee MY / TikTok Shop MY URLs (waiting on client)
- Real Halal cert number/logo and MY contact number (waiting on client)
- `.com.my` domain acquisition (declined)
- Any deploy/push — this phase is local-files-only, same as prior work on this project

## Testing / verification

Static site, no backend — verification is:

- `vite dev` serves `/`, `/ms/index.html`, `/blog.html`, `/ms/blog.html` all at 200
- Every hreflang pair resolves both directions (EN page links to BM sibling and vice versa)
- `robots.txt` and `sitemap.xml` are valid (well-formed XML for sitemap, correct directive syntax
  for robots.txt) and served at site root
- JSON-LD blocks (Organization, Product, Halal credential) validate as well-formed JSON
- Visual spot-check of BM homepage in browser alongside EN to confirm layout parity
