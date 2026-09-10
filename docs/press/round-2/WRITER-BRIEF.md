# WRITER BRIEF — Sihatree PRESS round 2

You write **one** article. You write **one** file. Nobody else touches it.

Read `docs/press/round-2/facts-shared.md` first, in full. It is the legal ceiling and the fact
source for this round. Read your cluster's row in `docs/press/ROUND-2-MAP.md`.

## Output

Write exactly one file: `E:\sahtree\docs\press\round-2\draft-<ID>.json`, UTF-8, valid JSON.
Do not create any other file. Do not touch any `.html`, `.css`, `.js`, the sitemap or any llms.txt.

```jsonc
{
  "id": "A1",
  "lang": "ms",                       // "ms" or "en" — given to you
  "slug": "kedai-barangan-arab-berhampiran-saya",
  "focus": "kedai barangan arab near me",
  "title": "...",                     // <= 49 chars. " | Sihatree" is appended by the builder.
  "h1": "...",                        // may be longer than title; must contain the focus keyword
  "breadcrumbName": "...",            // <= 45 chars, the short name for the breadcrumb trail
  "description": "...",               // meta description, 130-155 chars, contains the focus keyword
  "ogTitle": "...",                   // may equal h1 if short; written for a social feed
  "ogDescription": "...",             // <= 200 chars, may differ from description
  "twitterDescription": "...",        // <= 200 chars, different wording again
  "tag": "...",                       // 1-3 word category pill, in the article's language
  "excerpt": "...",                   // ONE sentence for the blog index card, <= 130 chars
  "heroCaption": "...",               // one short italic line under the hero image
  "lede": "<strong>...</strong> ...", // 40-60 WORDS. See "Key takeaway" below.
  "bodyHtml": "...",                  // see "Body" below
  "faqs": [ { "q": "...", "a": "..." } ],   // 6 to 8 entries. Plain text, no HTML, no quotes issues.
  "wordsDraft": 0                     // your own count: lede + bodyHtml visible text + faqs
}
```

The builder generates the `<head>`, all meta tags, hreflang, `BlogPosting`, `FAQPage`,
`BreadcrumbList`, the nav, the visible FAQ accordion, the related-articles rail and the footer.
**The visible FAQ and the `FAQPage` schema are both generated from your `faqs` array**, so they
cannot diverge. Do not write a FAQ section inside `bodyHtml`.

## Key takeaway (`lede`)

40-60 words, no more. First sentence wrapped in `<strong>`, directly answering the H1's question.
It must survive being quoted alone with nothing around it — no "as mentioned above", no "in this
article". It must contain the focus keyword.

## Body (`bodyHtml`)

The inner HTML of the article body **after** the lede. Plain HTML string in JSON (escape `"` as
`\"`; use `\n` for newlines or just write it on one line — formatting does not matter).

Hard structural rules — these are gate checks, not preferences:

1. **5 to 7 `<h2>` sections.** Every `<h2>` is phrased as a question a real person would type.
2. **Directly after every `<h2>` there is a `<p>`.** Not a `<div>`, not a `<ul>`, not an `<h3>`,
   not an image. That `<p>` is the answer paragraph: **40-70 words, standalone, quotable cold.**
   A control run proved that putting a callout box straight under an H2 fails the gate — put the
   callout *after* the answer paragraph.
3. **Exactly one real `<table>`**, wrapped like this (the wrapper gives it mobile scroll):
   ```html
   <div class="blog-table-wrap"><table><caption>...</caption><thead><tr><th>...</th></tr></thead><tbody><tr><th>...</th><td>...</td></tr></tbody></table></div>
   ```
   Use it for a genuine comparison or a lookup — 3-6 rows. Never a table of adjectives.
4. **3 to 5 internal links**, with descriptive anchor text. Never "klik di sini", "click here",
   "baca lagi", "read more" or a bare URL. Your map row names the links you must carry. Money-page
   links: MS articles use `/ms/products` and `/ms/retail`; EN articles use `/products` and
   `/retail`.
5. **One `.blog-inline-cta` block**, placed roughly mid-article, in your language:
   ```html
   <div class="blog-inline-cta"><h3>HEADING</h3><p>ONE LINE</p><div class="footer-cta-group"><a href="/ms/products" class="btn btn-primary">LABEL</a><a href="https://madinah.com.my/en/" target="_blank" rel="noopener" class="btn btn-outline">LABEL</a></div></div>
   ```
6. **One `.blog-benefit-grid` with exactly 6 `.blog-benefit-card` children** (icon + `<h3>` + one
   sentence). Site rule since 2026-07-16: six cards, never four, never eight.
   ```html
   <div class="blog-benefit-grid"><div class="blog-benefit-card"><i class="fas fa-water" aria-hidden="true"></i><h3>HEADING</h3><p>ONE SENTENCE</p></div> ...x6... </div>
   ```
   **Font Awesome 6.0.0 free set only.** Confirmed safe on this project: `fa-water`, `fa-tint`,
   `fa-leaf`, `fa-seedling`, `fa-store`, `fa-truck`, `fa-box`, `fa-bag-shopping`, `fa-clock`,
   `fa-hourglass-half`, `fa-calendar-days`, `fa-chart-line`, `fa-scale-balanced`, `fa-feather`,
   `fa-ban`, `fa-circle-check`, `fa-circle-question`, `fa-triangle-exclamation`, `fa-user-doctor`,
   `fa-kit-medical`, `fa-heart`, `fa-utensils`, `fa-mortar-pestle`, `fa-flask`, `fa-book`,
   `fa-magnifying-glass`, `fa-spoon`, `fa-glass-water`, `fa-mug-hot`, `fa-users`, `fa-person`,
   `fa-dumbbell`, `fa-location-dot`, `fa-map`, `fa-tag`, `fa-lightbulb`, `fa-arrow-trend-up`,
   `fa-apple-whole`, `fa-bread-slice`, `fa-jar`, `fa-basket-shopping`, `fa-cart-shopping`.
   **Confirmed BROKEN, never use:** `fa-wheat-awn`, `fa-people-group`, `fa-mango`, `fa-stomach`,
   `fa-house-laptop`, `fa-people-roof`, `fa-band-aid`.
7. Optional, use only where it genuinely helps — at most two of these per article:
   `<div class="blog-highlight"><p>...</p></div>`,
   `<div class="blog-tip"><p class="blog-tip-label"><i class="fas fa-lightbulb" aria-hidden="true"></i> Tip</p><p>...</p></div>`,
   `<div class="blog-caution"><p class="blog-caution-label"><i class="fas fa-triangle-exclamation" aria-hidden="true"></i> LABEL</p><p>...</p></div>`,
   `<p class="blog-quote">...</p>`.
8. **End with a conclusion paragraph that is a decision, not a summary** — what the reader should
   do now. It can be the `blog-quote` or a plain `<p>` under the last H2.
9. Do **not** write `<h1>`, a FAQ section, a related-articles rail, a `<script>`, a `<style>` or
   any `{{PLACEHOLDER}}` token. Do not write an `<img>`; the builder places the hero.

## Length

**800-1,000 words** of visible text (lede + body + FAQ answers). Count it and put the number in
`wordsDraft`. Below 800 the gate fails; above 1,000 the round reads bloated next to the existing
49 articles.

## FAQs

6 to 8. Each answer 40-70 words, plain text, self-contained. They must be questions a real
Malaysian searcher would type in that language — **not** a translation of another article's FAQ
list, and not structurally parallel to any sibling article in this round. At least two of them
should be questions the body does not already answer.

## Bans — these fail the round, not just the article

- No invented checkable fact: no price, no opening hours, no rating, no review count, no customer
  count, no delivery time in days, no certificate, no nutrition number, no named testimonial.
- No unprovable superlative stated as fact ("terbaik", "nombor satu", "the best", "paling
  berkesan"). Say something verifiable instead.
- No claim that the product prevents, treats, cures, manages, lowers, boosts or improves anything.
  Re-read the ceiling section of `facts-shared.md` before you write your first H2.
- No banned adjective: certified / official / verified / accredited / trusted / authentic /
  guaranteed, and their Malay equivalents.
- No Halal statement unless the "no JAKIM certificate" sentence sits in the same block.
- Never name any grocery, importer or supplier other than Berkat Madinah Store — not even
  generically.
- Never claim a branch in a town other than Ampang, Kajang, Shah Alam or Gombak.
- Malay articles are written natively in Malaysian Malay, not translated from English and not
  Indonesian. English articles are written natively in English.

## Before you finish

Re-read your own answer paragraphs one at a time, cold, with nothing around them. If one needs the
sentence before it, rewrite it. That is the single check that decides whether an answer engine can
quote you.

Then validate: `python -c "import json;json.load(open(r'PATH',encoding='utf-8'))"`. Report the
word count and the focus keyword back in your final message. Do not report success without running
that JSON check.
