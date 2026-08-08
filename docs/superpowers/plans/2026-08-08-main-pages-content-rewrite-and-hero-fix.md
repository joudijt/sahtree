# Main-Pages Content Rewrite + Hero Image Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the copy on the 6 main pages in all three locales so headlines name the product and read plainly, remove buy buttons from every hero, rename "Flavours" to "Fruit-Inspired Tastes", reorder the homepage — and rebuild the hero so its photo is never cropped.

**Architecture:** Two independent workstreams. The hero fix is CSS-only in `src/style.css` (desktop keeps its composition with a corrected crop anchor and a stronger scrim; below 968px a `::after` band at the photo's own 16/9 ratio shows it whole above text on the brand gradient). The content rewrite is string edits across 18 HTML files, one page at a time, all three locales in the same task so they can never drift. A committed audit script gates the hero work and is re-run at the end.

**Tech Stack:** Static Vite multi-page site, no framework. Plain HTML + `src/style.css`. Playwright (`@playwright/test`, already a devDependency) for verification. AOS for scroll reveals. Font Awesome 6.0.0.

**Spec:** `docs/superpowers/specs/2026-08-08-main-pages-content-rewrite-and-hero-fix-design.md`

**Baseline:** commit `96c2107`, working tree clean. Run everything from `D:\sahtree`.

## Global Constraints

Every task's requirements implicitly include this section.

- **Scope is 18 files:** `index/products/benefits/retail/wholesale/contact.html` in the repo root, `ms/`, and `ar/`. Plus `src/style.css` and `scripts/audit-crop.mjs`. **Never** touch `blog.html`, `ms/blog.html`, `ar/blog.html`, or anything under `blog/`, `ms/blog/`, `ar/blog/`.
- **All three locales change together or not at all.** A task that edits `index.html` also edits `ms/index.html` and `ar/index.html`.
- **No Halal-certificate claim** in any language. Never write or restore "Halal-certified", "follows JAKIM's Halal guidelines", `garis panduan Halal`, `panduan Halal`, or any certificate number. Approved wording only: EN "naturally suitable for Halal consumers", MS "sesuai secara semula jadi untuk pengguna Halal", AR "مناسب بطبيعته للمستهلكين المسلمين". The existing trust pills "Halal-Friendly" / "Mesra Halal" / "متوافق مع الحلال" are approved and stay.
- **"Prebiotic-style" stays hedged.** Never "prebiotic" bare, never a gut-health promise, never a medical or therapeutic claim. Every existing disclaimer survives the rewrite verbatim.
- **Berkat Madinah Store is the supplier**, never a retail partner. Arabic name is exactly `متجر بركات المدينة` — never `بركة المدينة`, never `بيركات مدينة ستور`.
- **JSON-LD must match visible text.** If a task reworders an FAQ question or any string that also appears in a `<script type="application/ld+json">` block on the same page, the schema copy gets the identical edit in the same commit.
- **Malay register, not Indonesian.** Use `pembungkusan` not `kemasan`, `pek` not `poket`. Malay `kemasan` means neatness, not packaging.
- **Terminology:** "Flavour(s)" → "Fruit-Inspired Tastes" (plural label) or "Taste" (singular). MS `Rasa Buah Semula Jadi`. AR `نكهات فاكهية طبيعية`. The five product names — Original, Berry Blend, Mango, Pineapple, Pomegranate — are unchanged in all locales.
- **No hero contains** the words Shop, Buy, Order, Inquiry, Beli, Pesan, Pertanyaan, تسوّق, استفسار.
- **Titles ≤ 60 characters, meta descriptions ≤ 159 characters** on every page a task touches.
- **Measure Arabic strings with `node -e '...' ` reading `"utf8"`.** PowerShell `Get-Content -Raw` reads UTF-8 as cp1252 and roughly doubles the count.
- **Font Awesome 6.0.0 is missing icons.** Confirmed broken here: `fa-wheat-awn`, `fa-people-group`, `fa-stomach`, `fa-band-aid`, `fa-mango`, `fa-bag-shopping`. Only use icon names already rendering somewhere in this repo. Any new icon must be confirmed by screenshot, never by `getComputedStyle(el,'::before').content` — that reports empty even for icons that render fine.
- **Never leave temp scripts in the repo root.** `scripts/audit-crop.mjs` is the one intentionally committed script; delete anything else before committing.
- **Dev server:** `npm run dev`, port 5173.

---

## File Structure

| File | Responsibility | Tasks |
|---|---|---|
| `scripts/audit-crop.mjs` | Create. Reports any cropped image or horizontal overflow at a given viewport. The gate for Task 1 and the final check in Task 10. | 1, 10 |
| `package.json` | Modify. Add the `audit:crop` script alongside the existing `audit:*` entries. | 1 |
| `src/style.css` | Modify. Hero crop anchor, scrim, mobile stacked band (~line 3014–3062 and the `@media (max-width: 968px)` block at ~3583). Plus the standalone highlights band in Task 3. | 1, 3 |
| `index.html`, `ms/index.html`, `ar/index.html` | Modify. Hero copy, section reorder, tastes section, metadata. | 2, 3, 4 |
| `products.html`, `ms/`, `ar/` | Modify. H1, sub, hero buttons, Taste 01–05 eyebrows, metadata. | 5 |
| `benefits.html`, `ms/`, `ar/` | Modify. H1, sub, hero buttons, essay intro replaced by 4 cards, H2s, body simplification, metadata. | 6 |
| `retail.html`, `ms/`, `ar/` | Modify. H1, sub, hero buttons, taste wording, metadata. | 7 |
| `wholesale.html`, `ms/`, `ar/` | Modify. H1, sub, hero buttons, metadata. | 8 |
| `contact.html`, `ms/`, `ar/` | Modify. H1, sub, metadata. | 9 |

Tasks 5–9 are mutually independent and each self-contained. Tasks 2→3→4 are ordered (3 moves markup that 4 edits). Task 1 is independent of all content work.

---

### Task 1: Hero rebuild — nothing cropped at any width

**Files:**
- Create: `scripts/audit-crop.mjs`
- Modify: `package.json` (scripts block)
- Modify: `src/style.css:3039-3062` and the `@media (max-width: 968px)` block starting at `src/style.css:3583`

**Interfaces:**
- Consumes: nothing.
- Produces: `npm run audit:crop` — exits non-zero and prints one line per problem when any element paints a `background-size: cover` image into a box whose aspect ratio differs from the source by more than 12%, when any `<img>` with `object-fit: cover` is similarly distorted, or when the document scrolls horizontally. Task 10 re-runs it.

**Context the implementer needs:**

The hero paints its photo as a CSS background, not an `<img>`. `.se-hero--photo-en` (used by `index.html` **and** `ms/index.html`) draws `hero-bg-mango-tree-en.webp`, 1671×941, aspect 1.776. `.se-hero--photo-ar` (used by `ar/index.html`) draws `hero-bg-mango-tree-ar.webp`, 1376×768, aspect 1.792 — a *mirrored* copy, which is why the AR anchor is the mirror of EN's rather than the same value.

At 390×844 the hero box measures 390×680, aspect 0.57. `cover` scales the photo to 1210px wide inside 390px and discards 68% of its width from the centre outward. The product pack sits on the right, so it is sliced to a single letter.

`.se-hero::before` is a blurred decorative overlay of green/orange/pink radials at 0.3–0.35 alpha, masked to sit only over the text half. It paints **above** the background image and below the content, which is why the dark scrim in the background stack currently reads as pale foliage. Strengthening the background gradient alone will be partly defeated by it — the blob alphas have to come down too on the photo variants.

`.se-hero` is `display: flex; align-items: center; overflow: hidden`.

- [ ] **Step 1: Write the failing audit script**

Create `scripts/audit-crop.mjs`:

```js
import { chromium } from '@playwright/test';

const BASE = process.env.AUDIT_BASE ?? 'http://localhost:5173';
const PAGES = ['/', '/products', '/benefits', '/retail', '/wholesale', '/contact',
                '/ms/', '/ar/'];
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];
const TOLERANCE = 0.12;

const SOURCES = {
  'hero-bg-mango-tree-en.webp': 1671 / 941,
  'hero-bg-mango-tree-ar.webp': 1376 / 768,
};

const browser = await chromium.launch();
let problems = 0;

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();

  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    // AOS reveals on scroll; a scripted jump catches elements at opacity 0.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(600);

    const found = await page.evaluate((sources) => {
      const out = [];
      for (const el of document.querySelectorAll('*')) {
        const cs = getComputedStyle(el);
        if (!cs.backgroundImage.includes('url(') || !cs.backgroundSize.startsWith('cover')) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 100 || r.height < 100) continue;
        const file = Object.keys(sources).find((f) => cs.backgroundImage.includes(f));
        if (!file) continue;
        out.push({
          kind: 'bg', file,
          sel: '.' + el.className.toString().trim().split(/\s+/).join('.'),
          box: Math.round(r.width) + 'x' + Math.round(r.height),
          shown: r.width / r.height, natural: sources[file],
        });
      }
      for (const img of document.querySelectorAll('img')) {
        const r = img.getBoundingClientRect();
        if (r.width < 20 || r.height < 20) continue;
        if (getComputedStyle(img).objectFit !== 'cover') continue;
        out.push({
          kind: 'img', file: img.currentSrc.split('/').pop(), sel: 'img',
          box: Math.round(r.width) + 'x' + Math.round(r.height),
          shown: r.width / r.height, natural: img.naturalWidth / img.naturalHeight,
        });
      }
      return {
        found: out,
        overflow: document.documentElement.scrollWidth > window.innerWidth
          ? document.documentElement.scrollWidth : 0,
      };
    }, SOURCES);

    if (found.overflow) {
      console.log(`FAIL ${vp.name} ${path} horizontal overflow: document is ${found.overflow}px wide`);
      problems++;
    }
    for (const f of found.found) {
      const lost = Math.round((1 - Math.min(f.natural, f.shown) / Math.max(f.natural, f.shown)) * 100);
      if (Math.abs(f.natural - f.shown) / f.natural > TOLERANCE) {
        console.log(`FAIL ${vp.name} ${path} ${f.sel} ${f.file} box ${f.box} ` +
          `natural ${f.natural.toFixed(2)} shown ${f.shown.toFixed(2)} — ~${lost}% of the frame lost`);
        problems++;
      } else {
        console.log(`ok   ${vp.name} ${path} ${f.sel} ${f.file} (~${lost}% lost)`);
      }
    }
  }
  await ctx.close();
}

await browser.close();
console.log(problems ? `\n${problems} problem(s)` : '\nno cropped images, no overflow');
process.exit(problems ? 1 : 0);
```

- [ ] **Step 2: Register the npm script**

In `package.json`, add to the `scripts` block beside the existing `audit:*` entries:

```json
"audit:crop": "node scripts/audit-crop.mjs"
```

- [ ] **Step 3: Run the audit to verify it fails**

Start the dev server in one shell (`npm run dev`), then:

Run: `npm run audit:crop`
Expected: FAIL. Exactly one failing line, on mobile, naming `.se-hero.se-hero--photo-en` at `390x680` with natural 1.78 / shown 0.57 and roughly 68% of the frame lost — repeated for `/`, `/ms/`, and `/ar/` (the AR page reports `.se-hero--photo-ar`). Desktop lines should print `ok`. Exit code 1.

If any *other* element fails, stop and report it — the spec's audit found the hero to be the only cropped image on the site, so a second failure means something changed since.

- [ ] **Step 4: Fix the desktop crop anchor and scrim**

In `src/style.css`, replace lines 3039–3051 (the two photo-variant rules):

```css
.se-hero--photo-en {
    background-image: linear-gradient(90deg, rgba(15, 13, 36, 0.92) 0%, rgba(15, 13, 36, 0.75) 42%, rgba(15, 13, 36, 0.3) 66%, rgba(15, 13, 36, 0.45) 100%), url('/images/hero-bg-mango-tree-en.webp');
    background-size: cover;
    background-position: right center;
    background-repeat: no-repeat;
}

.se-hero--photo-ar {
    background-image: linear-gradient(270deg, rgba(15, 13, 36, 0.92) 0%, rgba(15, 13, 36, 0.75) 42%, rgba(15, 13, 36, 0.3) 66%, rgba(15, 13, 36, 0.45) 100%), url('/images/hero-bg-mango-tree-ar.webp');
    background-size: cover;
    background-position: left center;
    background-repeat: no-repeat;
}
```

Then add, immediately after the existing `.se-hero--photo-ar::before` rule (currently ending at line 3062), a blob-alpha reduction so the scrim survives the decorative overlay:

```css
/* The blurred blob overlay paints above the background scrim; at full strength
   it washes the text half out. Photo variants get a calmer version. */
.se-hero--photo-en::before,
.se-hero--photo-ar::before {
    background:
        radial-gradient(circle at 15% 20%, rgba(127, 188, 59, 0.16), transparent 45%),
        radial-gradient(circle at 85% 15%, rgba(249, 171, 64, 0.14), transparent 40%),
        radial-gradient(circle at 75% 85%, rgba(186, 52, 126, 0.14), transparent 45%);
}
```

- [ ] **Step 5: Measure desktop contrast and tune**

The numbers above are a starting point, not a guarantee. Measure the real rendered pixels — not the intended scrim — behind the H1 and the sub.

Run the dev server, then in a scratch Playwright session at 1440×900 on `/`, `/ms/`, `/ar/`: screenshot the hero, sample the lightest pixel in the rectangle behind `.se-hero h1` and behind `.se-hero-sub`, and compute the WCAG contrast ratio against the text colour (H1 is `--white`; `.se-hero-sub` is `rgba(255,255,255,0.78)` over that background).

Target: **≥ 4.5:1 for both, in all three locales.** If either falls short, raise the first two stops of the element gradient in 0.04 increments (0.92 → 0.96, 0.75 → 0.79) and re-measure. Do not lower the blob alphas below 0.10 — they are the brand decoration the user asked to keep.

Delete the scratch script when done; it does not get committed.

- [ ] **Step 6: Rebuild the mobile hero as a stacked band**

In `src/style.css`, inside the existing `@media (max-width: 968px)` block, replace the current `.se-hero` rule (line 3584–3587) with:

```css
    .se-hero {
        padding: 7rem 5% 3rem;
        min-height: auto;
        flex-direction: column;
        align-items: stretch;
        gap: 2rem;
    }

    /* Below 968px the photo stops being a background crop and becomes its own
       band at the source's native 16/9, so cover discards nothing. */
    .se-hero--photo-en,
    .se-hero--photo-ar {
        background-image: linear-gradient(135deg, var(--primary-color) 0%, #241f42 55%, var(--primary-color) 100%);
    }

    .se-hero--photo-en::after,
    .se-hero--photo-ar::after {
        content: "";
        order: -1;
        position: relative;
        z-index: 1;
        width: 100%;
        aspect-ratio: 16 / 9;
        border-radius: 20px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }

    .se-hero--photo-en::after {
        background-image: url('/images/hero-bg-mango-tree-en.webp');
    }

    .se-hero--photo-ar::after {
        background-image: url('/images/hero-bg-mango-tree-ar.webp');
    }

    /* The blurred radials exist to decorate a photo backdrop. There is no
       photo backdrop here, and they wash out the band. */
    .se-hero::before {
        display: none;
    }
```

Three things that will bite if skipped:

1. `align-items: stretch` is required. `.se-hero` is `align-items: center`; in column direction that shrink-wraps both the text and the photo band to content width instead of filling the hero.
2. The `.se-hero--photo-*` background override must sit **after** the base rules in source order. Specificity is equal (0,1,0), so source order decides. This media block is at line ~3583 and the base rules are at ~3039, so it wins — but keep it inside this block, don't hoist it.
3. `order: -1` works because `::after` is a real flex item of `.se-hero`. It is only defined inside this media query, so on desktop the pseudo-element does not exist at all and the desktop background layer is untouched. One source file, one download, at both widths.

- [ ] **Step 7: Run the audit to verify it passes**

Run: `npm run audit:crop`
Expected: PASS, exit code 0, final line `no cropped images, no overflow`. The mobile hero line now reads `ok` with the `::after` box at 16/9. Desktop lines still `ok`.

- [ ] **Step 8: Look at it**

Screenshot `/`, `/ms/`, `/ar/` at 1440×900 and 390×844 and **actually view the images**. Confirm by eye, not by CSS:

- Desktop: the pack, the glass and the bowl are all fully inside the frame. White H1 is comfortably readable.
- Mobile: the whole photo is visible with the pack intact, sitting above the text. Text is on the brand gradient, not on foliage.
- AR: the photo is anchored on the opposite side from EN, and the composition is not double-mirrored.
- The nav logo has not changed size on scroll. That was an explicit requirement of the 2026-07-28 hero work and this task must not regress it.

- [ ] **Step 9: Commit**

```bash
git add scripts/audit-crop.mjs package.json src/style.css
git commit -m "Stop the hero photo being cropped on mobile

The hero paints a 1.78-aspect photo with background-size: cover. On a
390x680 mobile hero that scales it to 1210px wide and discards 68% of its
width from the centre out, slicing the product pack in half.

Desktop keeps its composition and gains a corrected crop anchor plus a
scrim strong enough to carry white text. Below 968px the photo becomes
its own band locked to the source's native 16/9, so cover crops nothing.

Adds scripts/audit-crop.mjs and npm run audit:crop, which fails on any
cover-painted image whose box ratio drifts more than 12% from the source.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Homepage hero copy

**Files:**
- Modify: `index.html:179-199`, `ms/index.html` (same block), `ar/index.html` (same block)

**Interfaces:**
- Consumes: nothing. Independent of Task 1.
- Produces: the hero markup Task 3 reorders around. Task 3 assumes `.se-hero-actions` no longer exists in `index.html`.

- [ ] **Step 1: Replace the EN hero copy**

In `index.html`, the block currently reading:

```html
        <span class="se-hero-eyebrow">Nature's Essence, Reimagined</span>
        <h1>Gum Arabic..<br><em>nature's gentle touch for lifelong wellness.</em></h1>
        <p class="se-hero-sub">Sihatree brings Arabic Gum Powder into a modern, easy-to-enjoy ritual — crafted for
          daily use, retail customers, and wholesale partners across Malaysia.</p>
```

becomes:

```html
        <span class="se-hero-eyebrow">Pure Arabic Gum Powder</span>
        <h1>One Scoop. A World of Goodness.<br><em>Nature's fibre, in every sip.</em></h1>
        <p class="se-hero-sub">Arabic Gum is the natural sap of the acacia tree, dried into a soft powder. Stir one
          scoop into any drink — that's the whole routine.</p>
```

- [ ] **Step 2: Delete the EN hero buttons**

Delete this entire block from `index.html` (lines 187–190), including the blank line after it:

```html
        <div class="se-hero-actions">
          <a href="#" class="btn btn-primary retail-cta">Shop Retail</a>
          <a href="#wholesale" class="btn btn-outline wholesale-cta" style="background: white;">Wholesale Inquiry</a>
        </div>
```

Do **not** touch the `.sticky-cta` block near line 160 — it carries the same two links and is the intended buying path once the reader scrolls. Do not touch the retail modal.

- [ ] **Step 3: Update the EN trust pill**

`5 Vibrant Flavours` → `5 Fruit-Inspired Tastes`. The `fa-palette` icon stays.

- [ ] **Step 4: Apply the same three edits to `ms/index.html`**

```html
        <span class="se-hero-eyebrow">Serbuk Gam Arab Tulen</span>
        <h1>Satu Sudu. Penuh Kebaikan.<br><em>Serat semula jadi, dalam setiap teguk.</em></h1>
        <p class="se-hero-sub">Gam Arab ialah getah semula jadi daripada pokok akasia, dikeringkan menjadi serbuk
          halus. Kacau satu sudu ke dalam mana-mana minuman — itu sahaja rutinnya.</p>
```

Delete the `.se-hero-actions` block containing `Beli Runcit` / `Pertanyaan Borong`. Trust pill `5 Perisa Menarik` → `5 Rasa Buah Semula Jadi`.

- [ ] **Step 5: Apply the same three edits to `ar/index.html`**

```html
        <span class="se-hero-eyebrow">مسحوق صمغ عربي نقي</span>
        <h1>ملعقة واحدة. عالم من الفائدة.<br><em>ألياف الطبيعة، في كل رشفة.</em></h1>
        <p class="se-hero-sub">الصمغ العربي هو رحيق شجرة الأكاسيا الطبيعي، يُجفَّف ليصبح مسحوقًا ناعمًا. حرّك ملعقة
          واحدة في أي مشروب — هذا هو الروتين كله.</p>
```

Delete the `.se-hero-actions` block containing `تسوّق بالتجزئة` / `استفسار الجملة`. Trust pill `5 نكهات زاهية` → `5 نكهات فاكهية طبيعية`. Leave `متوافق مع الحلال` exactly as it is.

- [ ] **Step 6: Update titles and meta descriptions on all three**

Read the current `<title>` and `<meta name="description">` on each of the three files. Rewrite them to lead with the new positioning, keeping titles ≤ 60 characters and descriptions ≤ 159. Measure with node, not PowerShell:

```bash
node -e "const fs=require('fs');for(const f of ['index.html','ms/index.html','ar/index.html']){const h=fs.readFileSync(f,'utf8');const t=h.match(/<title>([\s\S]*?)<\/title>/)[1].trim();const d=h.match(/<meta name=\"description\" content=\"([\s\S]*?)\"/)[1].trim();console.log(f,'title',t.length,'|','desc',d.length);}"
```

Expected after the edit: every title ≤ 60, every description ≤ 159.

Any `og:title` / `og:description` / `twitter:` tag mirroring these strings gets the same edit. If the homepage JSON-LD contains the old tagline, update it too.

- [ ] **Step 7: Verify the heroes render**

Run the dev server. Screenshot `/`, `/ms/`, `/ar/` at 1440×900 and 390×844 and view them. Confirm: no buttons in any hero, the new H1 sits on two lines without overlapping the sub, and AR reads right-to-left with the nav row still LTR.

Arabic and Malay headlines are shorter than the strings the current font sizing was tuned against in the 2026-07-28 pass. If a locale's H1 now looks undersized or the two lines sit too far apart, adjust `.se-hero--photo-en h1 em { margin-top }` / `.se-hero--photo-ar h1 em { margin-top }` per locale and note the change. The EN line gap needed a *negative* margin-top historically because the first line's line-height is inflated — a smaller positive value will not close it.

- [ ] **Step 8: Commit**

```bash
git add index.html ms/index.html ar/index.html src/style.css
git commit -m "Rewrite the homepage hero and drop its buy buttons

The old H1 named a feeling rather than the product. The new one leads
with the routine and names Arabic Gum Powder in the eyebrow, so a cold
reader learns what the site sells without scrolling.

Both hero buttons are gone in all three locales; the sticky CTA bar
already surfaces the same two links once the reader scrolls.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Homepage section reorder

**Files:**
- Modify: `index.html:202-251`, `ms/index.html`, `ar/index.html` (same sections)
- Modify: `src/style.css:3294-3299` and the `@media (max-width: 968px)` block at ~3647

**Interfaces:**
- Consumes: Task 2's hero markup.
- Produces: a standalone `.se-highlights-band` section that Task 4 does not touch.

**Context:**

Today the six-point strip lives *inside* `.se-story` as `<div class="se-story-highlights">`, appearing at the end of the story section. The user wants it, and "Why Sihatree", above the story.

| | before | after |
|---|---|---|
| 1 | Hero | Hero |
| 2 | From Tree to Table (strip nested at its end) | **Six-point strip** (own section) |
| 3 | Why Sihatree | **Why Sihatree** |
| 4 | Flavours | From Tree to Table |
| 5 | Trust panel | Fruit-Inspired Tastes |
| 6 | … | Trust panel, then unchanged |

**The trap:** `.se-story-highlights` currently inherits its width from `.se-story-inner`, which carries the page frame. Lifted out, it has no frame and will sit at a different width from every other section on the page — the exact bug class fixed in the 2026-07-30 width unification. The new wrapper must carry the frame itself.

- [ ] **Step 1: Add the standalone band styling**

In `src/style.css`, immediately before `.se-story-highlights` (line 3294), add:

```css
/* The six-point strip used to be nested inside .se-story-inner and inherited
   the page frame from it. Standing alone, it has to carry the frame itself. */
.se-highlights-band {
    padding: 3rem 0 1rem;
    width: var(--page-width);
    margin: 0 auto;
}
```

Then change `.se-story-highlights`'s `margin-top: 2rem` to `margin-top: 0`, since it is no longer trailing a block of story cards.

- [ ] **Step 2: Move the strip in `index.html`**

Cut the `<div class="se-story-highlights" data-aos="fade-up"> … </div>` block (lines 241–248) out of `.se-story`. Insert it immediately after the closing `</header>` of the hero, wrapped:

```html
  <!-- Six-point strip -->
  <section class="se-highlights-band">
    <div class="se-story-highlights" data-aos="fade-up">
      <div class="se-highlight"><i class="fas fa-seedling"></i><span>Rich in natural fibre</span></div>
      <div class="se-highlight"><i class="fas fa-bacteria"></i><span>Prebiotic-style fibre</span></div>
      <div class="se-highlight"><i class="fas fa-mug-hot"></i><span>Easy daily habit</span></div>
      <div class="se-highlight"><i class="fas fa-leaf"></i><span>Naturally sourced</span></div>
      <div class="se-highlight"><i class="fas fa-tint"></i><span>Refreshing fruit-inspired tastes</span></div>
      <div class="se-highlight"><i class="fas fa-box-open"></i><span>Convenient powder format</span></div>
    </div>
  </section>
```

Only one string changed: `Refreshing flavour choices` → `Refreshing fruit-inspired tastes`. All six icons are already rendering on this page today — do not swap any of them.

- [ ] **Step 3: Move "Why Sihatree" above the story in `index.html`**

Move the whole `<section class="se-benefits">` block (lines 253–283, "Why Sihatree" / "Built for Real Daily Life" and its four cards) to sit immediately after the new highlights band and before `<section id="benefits" class="se-story">`.

Keep every string inside it exactly as it is — the user supplied that copy verbatim as what they want.

Note `id="benefits"` stays on `.se-story`. Check whether any in-page anchor or nav link points at it; if the anchor's intent was the "Why Sihatree" block, leave it where it is anyway and report the ambiguity rather than guessing.

- [ ] **Step 4: Repeat Steps 2–3 in `ms/index.html` and `ar/index.html`**

Same structural move. The MS strip item becomes `Rasa buah yang menyegarkan`; the AR item becomes `نكهات فاكهية منعشة`. Every other string in both moved blocks stays byte-identical.

- [ ] **Step 5: Check the AOS reveal order**

The `data-aos-delay` values were tuned for the old order. Load `/` and scroll slowly, watching the reveal sequence. Sections must fade in top-to-bottom as they enter the viewport, with no block appearing before one above it and none stuck at `opacity: 0`.

If a card grid reveals out of order, renumber its `data-aos-delay` values in 100ms steps down the visual order. Verify by watching, not by reading markup — and give each section a real 1s+ settle before judging, since a scripted jump catches AOS elements mid-animation.

- [ ] **Step 6: Verify the widths actually match**

The whole point of Step 1. In a Playwright session at 1440, 1280 and 1024, measure the *content* box — `rect.x + paddingLeft` and `rect.width - horizontal padding` — of `.se-highlights-band`, `.se-benefits`, `.se-story-inner` and `.se-trust-section` on `/`, `/ms/` and `/ar/`.

Expected: all four report the same left edge and the same width at each viewport — 120 / 1200 at 1440. A mismatch means the frame did not apply; fix it before committing. Delete the measurement script afterwards.

- [ ] **Step 7: Commit**

```bash
git add index.html ms/index.html ar/index.html src/style.css
git commit -m "Move the six-point strip and Why Sihatree above the story

Both blocks now sit directly under the hero, so a reader gets the quick
scannable case before the longer origin story rather than after it.

The strip was nested inside .se-story-inner and inherited the page frame
from it, so lifting it out needed a .se-highlights-band wrapper carrying
the frame directly — otherwise it renders at a different width from every
other section on the page.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Homepage tastes section and story wording

**Files:**
- Modify: `index.html:285-291` and the story card at `index.html:235-239`, plus `ms/index.html`, `ar/index.html`

**Interfaces:**
- Consumes: Task 3's reordered markup.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Rename the tastes section in `index.html`**

```html
        <span class="se-eyebrow">Fruit-Inspired Tastes</span>
        <h2>Five Tastes. One Natural Fibre.</h2>
```

(was `Our Vibrant Range` / `Find Your Favourite Flavour`.)

The five card headings — Original, Berry Blend, Mango, Pineapple, Pomegranate — do not change. Do not touch the `--pineapple` / `--pomegranate` background tints in `style.css`; those are original styling, not leftovers from the reverted "Coming Soon" treatment.

- [ ] **Step 2: Fix the story card wording in `index.html`**

In the "Today / A Fresh Way to Enjoy It" card, `fruit-inspired flavours` → `fruit-inspired tastes`. That is the only edit to the story section — its heading and three card titles stay.

- [ ] **Step 3: Sweep the rest of the page**

```bash
grep -in 'flavour' index.html
```

Replace every remaining hit with the taste wording, including any inside `<title>`, `<meta>`, `alt` attributes and JSON-LD. Re-run until it returns nothing.

- [ ] **Step 4: Repeat for `ms/index.html`**

Eyebrow `Rasa Buah Semula Jadi`, H2 `Lima Rasa. Satu Serat Semula Jadi.` Then `grep -in 'perisa' ms/index.html` and clear every hit.

- [ ] **Step 5: Repeat for `ar/index.html`**

Eyebrow `نكهات فاكهية طبيعية`, H2 `خمس نكهات. ليف طبيعي واحد.` Then check for `زاهية` and any stale flavour phrasing and clear it.

- [ ] **Step 6: Verify**

Run: `npm run build`
Expected: clean.

Then `grep -ic 'flavour' index.html` → `0`, and view all three homepages in a browser at 1440 and 390.

- [ ] **Step 7: Commit**

```bash
git add index.html ms/index.html ar/index.html
git commit -m "Rename the homepage flavour section to fruit-inspired tastes

\"Flavour\" implies added flavouring, which contradicts how the product is
positioned. The section now leads with the tastes being fruit-inspired and
the fibre being the constant across all five.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Products page

**Files:**
- Modify: `products.html`, `ms/products.html`, `ar/products.html`

**Interfaces:**
- Consumes: nothing. Independent of Tasks 2–4.
- Produces: nothing.

This page has the heaviest terminology load — 42 occurrences of "flavour" in the EN file alone.

- [ ] **Step 1: Rewrite the EN hero**

```html
      <h1>Same Natural Fibre. Five Fruit-Inspired Tastes.</h1>
      <p class="sp-hero-sub">Every pack holds the same Arabic Gum from the acacia tree. Pick the taste you'll
        actually look forward to.</p>
```

Then delete the whole `<div class="sp-hero-actions">` block containing `Shop Retail` and `Wholesale Inquiry`.

- [ ] **Step 2: Rename the section furniture in EN**

- `Jump to a Flavour` → `Jump to a Taste`
- `Flavour 01` … `Flavour 05` → `Taste 01` … `Taste 05`
- Keep `The Range`, `What's Inside Every Pack`, `How to Use Sihatree`, `Scoop` / `Mix` / `Enjoy`, and `Product FAQ`.

- [ ] **Step 3: Clear the remaining EN hits**

```bash
grep -in 'flavour' products.html
```

Work through all remaining hits — body copy, `<title>`, meta description, `alt` text, and the JSON-LD block. Where a visible FAQ question changes, make the identical edit in the schema copy. Re-run until it returns nothing.

Watch for the internal contradiction flagged in the 2026-07-30 proofread: Original was described as "the flavour most people reach for first" while Mango was "most often picked by first-time buyers". Both were already hedged into suitability statements — do not reintroduce either popularity claim while rewording.

- [ ] **Step 4: Repeat for `ms/products.html`**

```html
      <h1>Serat Semula Jadi Yang Sama. Lima Rasa Buah.</h1>
      <p class="sp-hero-sub">Setiap pek mengandungi Gam Arab yang sama daripada pokok akasia. Pilih rasa yang anda
        benar-benar nantikan.</p>
```

Delete the hero buttons. `Perisa 01`…`05` → `Rasa 01`…`05`. Then clear every `perisa` hit.

**Known open question, do not guess:** `ms/index.html` uses translated product names (Asli, Mangga) while `ms/products.html` uses Original/Mango but translated Nanas/Delima. Resolving that needs to know what the physical pack labels say. Leave both as they are and report the inconsistency; do not unify it in this task.

- [ ] **Step 5: Repeat for `ar/products.html`**

```html
      <h1>الألياف الطبيعية نفسها. خمس نكهات فاكهية.</h1>
      <p class="sp-hero-sub">كل عبوة تحتوي على الصمغ العربي نفسه من شجرة الأكاسيا. اختر النكهة التي تتطلّع إليها فعلًا.</p>
```

Delete the hero buttons.

**The AR eyebrows already read `النكهة 01`…`النكهة 05` (lines 173, 198, 222, 246, 270) and must be left exactly as they are.** Arabic `نكهة` carries no additive or synthetic connotation the way English "flavour" does, so the AR page needs no per-item rename — only the section-level label changes to `نكهات فاكهية طبيعية`. Do not invent a longer construction like `النكهة الفاكهية 01`.

Keep `متوافق مع الحلال` untouched — it appears 12× in this file and is the canonical AR phrasing.

- [ ] **Step 6: Verify**

```bash
npm run build
node -e "const fs=require('fs');for(const f of ['products.html','ms/products.html','ar/products.html']){const h=fs.readFileSync(f,'utf8');const t=h.match(/<title>([\s\S]*?)<\/title>/)[1].trim();const d=h.match(/<meta name=\"description\" content=\"([\s\S]*?)\"/)[1].trim();console.log(f,'title',t.length,'desc',d.length);}"
grep -ic 'flavour' products.html
grep -ic 'perisa' ms/products.html
```

Expected: build clean, every title ≤ 60 and description ≤ 159, both greps `0`. Then view all three pages at 1440 and 390.

- [ ] **Step 7: Commit**

```bash
git add products.html ms/products.html ar/products.html
git commit -m "Rewrite the products page around tastes rather than flavours

The H1 now says what is constant across the range and what varies, and
the hero no longer opens with two buy buttons. Flavour 01-05 become
Taste 01-05 throughout, including in the JSON-LD.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Benefits page

**Files:**
- Modify: `benefits.html:87-208`, `ms/benefits.html`, `ar/benefits.html`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing.

This is the page the user reacted to most strongly — "wtf is this, are we reading an article". Two paragraphs of meta-commentary about the page replace themselves with four cards.

- [ ] **Step 1: Rewrite the EN hero**

Replace lines 92–99:

```html
      <span class="se-eyebrow">Natural Soluble Fibre</span>
      <h1>What Arabic Gum Actually Does</h1>
      <p class="sp-hero-sub">One natural fibre from the acacia tree. Here's what it does, what it doesn't, and how
        little effort it takes.</p>
```

The `<div class="sp-hero-actions">` block with `See the Range` / `Shop Retail` is deleted entirely. Keep the `<p class="sp-breadcrumb">` line above.

- [ ] **Step 2: Replace the essay intro with four cards**

Delete the whole `<section class="sp-section sp-section--tight">` at lines 104–114 — both paragraphs, starting "Most fibre habits fail for the same reason" and "The four things below aren't marketing claims". Replace with:

```html
  <!-- At a glance -->
  <section class="se-highlights-band">
    <div class="se-story-highlights" data-aos="fade-up">
      <div class="se-highlight"><i class="fas fa-tree"></i><span><strong>From a real tree.</strong> Arabic Gum is dried acacia sap, not something built in a lab.</span></div>
      <div class="se-highlight"><i class="fas fa-bacteria"></i><span><strong>Prebiotic-style fibre.</strong> A soluble fibre that can feed the good bacteria already in your gut.</span></div>
      <div class="se-highlight"><i class="fas fa-mug-hot"></i><span><strong>One scoop, no prep.</strong> Stir it into water, juice or a smoothie. No soaking, no cooking.</span></div>
      <div class="se-highlight"><i class="fas fa-utensils"></i><span><strong>Drinks and cooking.</strong> It also works in baking and recipes that call for soluble fibre.</span></div>
    </div>
  </section>
```

This reuses `.se-highlight` and the `.se-highlights-band` wrapper from Task 3 rather than inventing a component. `.se-story-highlights` is `grid-template-columns: repeat(3, 1fr)`; with four children that lays out 3 + 1. Add, next to the existing six-child rule in `src/style.css`:

```css
.se-story-highlights:has(> :nth-child(4)):not(:has(> :nth-child(5))) {
    grid-template-columns: repeat(2, 1fr);
}
```

so four cards lay out 2×2. Confirm the existing `@media (max-width: 968px)` rule collapsing `.se-story-highlights` to one column still applies.

All four icons — `fa-tree`, `fa-bacteria`, `fa-mug-hot`, `fa-utensils` — must be confirmed **by screenshot** of the grid before this task is called done. `fa-bacteria`, `fa-mug-hot` and `fa-utensils` already render elsewhere in this repo; `fa-tree` does not, so it is the one to check hardest. If it renders blank, swap to `fa-seedling` and note it.

- [ ] **Step 3: Simplify the EN body copy**

Rework the four detail rows under the voice rules — short ordinary words, sentences under about 20 words, paragraphs under three sentences. Specific strings to kill: *sidesteps*, *friction*, *a much better predictor*, *This is deliberate, not incidental*, *stacked on top of each other*.

Heading changes:
- `Built for a Real Daily Routine` → `One Scoop. No Prep.`
- `Straight From the Acacia Tree`, `Prebiotic-Style Fibre Support` and `More Than Just a Drink Mix` keep their headings; only their bodies get simplified.

Keep intact, word for word in substance: the probiotic-vs-prebiotic distinction (it is the most useful passage on the page — shorten the sentences, don't drop the content), the `sp-chip` rows, and the internal link to `/blog/what-is-arabic-gum-benefits-uses-dosage`.

- [ ] **Step 4: Repeat for `ms/benefits.html`**

```html
      <span class="se-eyebrow">Serat Larut Semula Jadi</span>
      <h1>Apa Sebenarnya Yang Gam Arab Berikan</h1>
      <p class="sp-hero-sub">Satu serat semula jadi daripada pokok akasia. Ini yang ia lakukan, yang ia tidak
        lakukan, dan betapa mudahnya.</p>
```

Cards: `Daripada pokok sebenar` / `Serat bergaya prebiotik` / `Satu sudu, tanpa penyediaan` / `Minuman dan masakan`, with the same four supporting sentences translated. Delete the hero buttons and the essay intro.

- [ ] **Step 5: Repeat for `ar/benefits.html`**

```html
      <span class="se-eyebrow">ألياف طبيعية قابلة للذوبان</span>
      <h1>ماذا يفعل الصمغ العربي فعلًا</h1>
      <p class="sp-hero-sub">ليف طبيعي واحد من شجرة الأكاسيا. إليك ما يفعله، وما لا يفعله، وكم هو سهل الاستخدام.</p>
```

Cards: `من شجرة حقيقية` / `ألياف شبيهة بالبريبايوتيك` / `ملعقة واحدة بلا تحضير` / `مشروبات وطبخ`. Delete the hero buttons and the essay intro.

Write natural MSA, not literal translation of the English. Preserve every medical disclaimer exactly.

- [ ] **Step 6: Verify the guardrails survived**

```bash
grep -in 'halal-certified\|JAKIM\|garis panduan Halal\|panduan Halal' benefits.html ms/benefits.html ar/benefits.html
grep -in 'sidesteps\|friction\|predictor\|incidental' benefits.html
grep -ic 'flavour' benefits.html
npm run build
```

Expected: the first grep returns nothing, the second returns nothing, the third returns `0`, the build is clean.

Then confirm every disclaimer that existed before still exists: diff the three files and read each removed line to check none of them was a hedge or a "consult a doctor" line.

- [ ] **Step 7: Screenshot the four-card grid and look at it**

Use `elementHandle.boundingBox()` plus `page.screenshot({ clip })` — not `elementHandle.screenshot()`, which times out here waiting for post-AOS stability. View the image and confirm all four icons render as recognisable glyphs at card size and the grid is 2×2 at 1440 and single-column at 390.

- [ ] **Step 8: Commit**

```bash
git add benefits.html ms/benefits.html ar/benefits.html src/style.css
git commit -m "Replace the benefits essay intro with four at-a-glance cards

The page opened with two paragraphs of commentary about the page itself
rather than the benefits it promises. Those are gone; the reader now hits
the four benefits immediately and scrolls into the existing detail rows.

The H1 names the product, the hero no longer carries buy buttons, and the
detail-row prose drops the essay register.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Retail page

**Files:**
- Modify: `retail.html`, `ms/retail.html`, `ar/retail.html`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing.

- [ ] **Step 1: Rewrite the EN hero**

```html
      <h1>Where to Buy Sihatree Arabic Gum</h1>
      <p class="sp-hero-sub">Sihatree is sold online and in store across Malaysia. Here's every place you can
        get it.</p>
```

Delete the `sp-hero-actions` block. The three store cards below are the buying path and stay exactly as they are — including Berkat Madinah Store as a card with the navy `--madinah` icon variant.

- [ ] **Step 2: Fix the store-count claim**

The intro paragraph says Sihatree is sold through "two dedicated stores — TikTok Shop and Shopee". There are three cards, and Berkat Madinah has real physical branches. Reword so the count matches what the page shows and does not exclude the physical stores. Berkat Madinah is the **supplier**, not a retail partner.

- [ ] **Step 3: Rename the taste furniture**

`Pick a Flavour` → `Pick a Taste`. `Five Ways to Enjoy Sihatree` stays. Then `grep -in 'flavour' retail.html` and clear the rest, JSON-LD included.

- [ ] **Step 4: Repeat for `ms/retail.html`**

```html
      <h1>Di Mana Untuk Membeli Gam Arab Sihatree</h1>
      <p class="sp-hero-sub">Sihatree dijual dalam talian dan di kedai di seluruh Malaysia. Ini setiap tempat anda
        boleh mendapatkannya.</p>
```

**Check specifically for `garis panduan Halal`** — this file carried it in two places plus its JSON-LD copy as recently as the 2026-07-30 pass, and it implies JAKIM compliance. If present, replace with `sesuai secara semula jadi untuk pengguna Halal` in all three places.

- [ ] **Step 5: Repeat for `ar/retail.html`**

```html
      <h1>أين تشتري الصمغ العربي من سيهاتري</h1>
      <p class="sp-hero-sub">يُباع سيهاتري أونلاين وفي المتاجر في أنحاء ماليزيا. إليك كل مكان يمكنك الحصول عليه منه.</p>
```

This file had the longest title on the site at 82 characters. Bring it under 60.

- [ ] **Step 6: Verify**

```bash
npm run build
grep -in 'halal-certified\|JAKIM\|garis panduan Halal\|panduan Halal' retail.html ms/retail.html ar/retail.html
grep -in 'بركة المدينة' ar/retail.html
grep -ic 'flavour' retail.html
```

Expected: build clean; the Halal grep returns nothing; the Arabic grep returns nothing (the correct form is `بركات المدينة`); the flavour grep returns `0`.

Then check the store-card buttons still align: they are `flex column` with `margin-top: auto` plus `align-self: stretch`, because Malay's "Lawati Berkat Madinah" needs 216px against a 215px card interior and wraps without it. Confirm at 1024 in MS specifically.

- [ ] **Step 7: Commit**

```bash
git add retail.html ms/retail.html ar/retail.html
git commit -m "Rewrite the retail hero as a where-to-buy answer

The H1 now names the product and answers the question the visitor arrived
with, instead of issuing an instruction. The hero buttons are gone; the
three store cards below already are the buying path.

Also corrects the intro, which claimed two stores while the page shows
three and Berkat Madinah has physical branches.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: Wholesale page

**Files:**
- Modify: `wholesale.html`, `ms/wholesale.html`, `ar/wholesale.html`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing.

- [ ] **Step 1: Rewrite the EN hero**

```html
      <h1>Put Arabic Gum on Your Shelves</h1>
      <p class="sp-hero-sub">We supply retailers, cafes, distributors and corporate buyers across Malaysia — with
        bulk pricing and marketing support behind every order.</p>
```

Delete the `sp-hero-actions` block carrying `Submit an Inquiry` and `WhatsApp Us`. The inquiry form and the WhatsApp button further down the page are the conversion path and stay.

- [ ] **Step 2: Clear the unsupported popularity claims**

This page carried several, hedged in the 2026-07-30 pass: "our best-sellers", "a product your customers already recognise", "a common choice for HR wellness", "built to move". Do not reintroduce any of them while rewording. Suitability statements only.

Then `grep -in 'flavour' wholesale.html` and clear the remaining hits.

- [ ] **Step 3: Repeat for `ms/wholesale.html`**

```html
      <h1>Letakkan Gam Arab di Rak Anda</h1>
      <p class="sp-hero-sub">Kami membekalkan peruncit, kafe, pengedar dan pembeli korporat di seluruh Malaysia —
        dengan harga pukal dan sokongan pemasaran di sebalik setiap pesanan.</p>
```

Malay register check: `pembungkusan` not `kemasan`, `pek` not `poket`, no `komited` anglicism.

- [ ] **Step 4: Repeat for `ar/wholesale.html`**

```html
      <h1>ضع الصمغ العربي على رفوفك</h1>
      <p class="sp-hero-sub">نورّد لتجار التجزئة والمقاهي والموزّعين والمشترين من الشركات في أنحاء ماليزيا — بأسعار
        الجملة ودعم تسويقي مع كل طلب.</p>
```

- [ ] **Step 5: Verify**

```bash
npm run build
grep -ic 'flavour' wholesale.html
```

Expected: build clean, grep `0`. Then load `/wholesale` at 1440 and confirm the form card still sits inside the page frame — it overflowed by 121px once via a CSS Grid min-content blowout, fixed with `grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)` on `.wholesale-layout`. At 390 confirm the full-bleed card still uses `width: 100vw; margin-inline: calc(50% - 50vw)` and lines up on both edges.

- [ ] **Step 6: Commit**

```bash
git add wholesale.html ms/wholesale.html ar/wholesale.html
git commit -m "Rewrite the wholesale hero to name the product

\"Bring Sihatree to Your Shelves\" assumed the reader already knew what
Sihatree is. The new H1 names Arabic Gum. Hero buttons removed; the
inquiry form and WhatsApp button below are the conversion path.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 9: Contact page

**Files:**
- Modify: `contact.html`, `ms/contact.html`, `ar/contact.html`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing.

Smallest task — one occurrence of "flavour" in the EN file.

- [ ] **Step 1: Rewrite the EN hero**

```html
      <h1>Ask Us Anything About Arabic Gum</h1>
      <p class="sp-hero-sub">Questions about a taste, an order, or stocking Sihatree? Write to us — we reply within
        1–2 business days.</p>
```

The "1–2 business days" figure must stay consistent with the same claim in the page's sidebar and in the form's confirmation copy. Check all three before committing.

- [ ] **Step 2: Repeat for `ms/contact.html`**

```html
      <h1>Tanya Kami Apa Sahaja Tentang Gam Arab</h1>
      <p class="sp-hero-sub">Soalan tentang rasa, pesanan, atau menstok Sihatree? Tulis kepada kami — kami membalas
        dalam 1–2 hari bekerja.</p>
```

- [ ] **Step 3: Repeat for `ar/contact.html`**

```html
      <h1>اسألنا أي شيء عن الصمغ العربي</h1>
      <p class="sp-hero-sub">أسئلة عن نكهة أو طلب أو تخزين سيهاتري؟ راسلنا — نردّ خلال يوم إلى يومَي عمل.</p>
```

- [ ] **Step 4: Verify the form still works**

The contact form submits via a WhatsApp deep link built from labelled field values — it does not post anywhere. Load `/contact`, fill it, submit, and confirm the generated `wa.me/601111119912` URL still carries every field label and value. Repeat in MS and AR.

The email address on this page must be `cs@madinah.com.my`. There should be no `hello@sihatree.com` anywhere.

- [ ] **Step 5: Commit**

```bash
git add contact.html ms/contact.html ar/contact.html
git commit -m "Rewrite the contact hero to name the subject

\"We'd Love to Hear From You\" is a greeting, not a reason to write. The
new H1 invites the question the visitor actually has.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 10: Whole-site verification

**Files:**
- Modify: none, unless a check fails.

**Interfaces:**
- Consumes: everything from Tasks 1–9.
- Produces: the evidence that the work is done.

Do not skip a check because an earlier task already ran something similar. Earlier checks covered one page; these cover the set.

- [ ] **Step 1: Build**

Run: `npm run build`
Expected: clean, no warnings that were not present at baseline `96c2107`.

- [ ] **Step 2: html-validate against the baseline**

```bash
npx html-validate index.html products.html benefits.html retail.html wholesale.html contact.html ms/index.html ms/products.html ms/benefits.html ms/retail.html ms/wholesale.html ms/contact.html ar/index.html ar/products.html ar/benefits.html ar/retail.html ar/wholesale.html ar/contact.html
```

Expected: error counts equal to or lower than baseline. Pre-existing and acceptable: `no-inline-style`, `no-raw-characters`, `form-dup-name`, `no-implicit-button-type`, `long-title`. Any `parser-error` is a real regression — fix it.

**Use this explicit 18-file list.** A `ms/*.html ar/*.html` glob pulls in the two blog listing pages and fakes a regression.

- [ ] **Step 3: Crop audit**

Run: `npm run audit:crop`
Expected: exit 0, `no cropped images, no overflow`.

- [ ] **Step 4: Terminology sweep**

```bash
grep -ic 'flavour' index.html products.html benefits.html retail.html wholesale.html contact.html
grep -ic 'perisa' ms/index.html ms/products.html ms/benefits.html ms/retail.html ms/wholesale.html ms/contact.html
```

Expected: `0` for all twelve.

- [ ] **Step 5: Guardrail sweep**

```bash
grep -in 'halal-certified\|halal certified\|JAKIM\|garis panduan Halal\|panduan Halal' index.html products.html benefits.html retail.html wholesale.html contact.html ms/*.html ar/*.html
grep -rn 'بركة المدينة' ar/
grep -rn 'hello@sihatree.com' .
```

Expected: all three return nothing. (The second must not match `بركات المدينة`, which is correct.)

- [ ] **Step 6: No selling in any hero**

```bash
grep -n 'sp-hero-actions\|se-hero-actions' index.html products.html benefits.html retail.html wholesale.html contact.html ms/*.html ar/*.html
```

Expected: nothing. Every hero action block is gone from all 18 files.

- [ ] **Step 7: Metadata lengths**

```bash
node -e "
const fs=require('fs');
const files=['index.html','products.html','benefits.html','retail.html','wholesale.html','contact.html'];
const dirs=['','ms/','ar/'];
let bad=0;
for(const d of dirs)for(const f of files){
  const p=d+f, h=fs.readFileSync(p,'utf8');
  const t=(h.match(/<title>([\s\S]*?)<\/title>/)||[,''])[1].trim();
  const m=(h.match(/<meta name=\"description\" content=\"([\s\S]*?)\"/)||[,''])[1].trim();
  const flag=(t.length>60?' TITLE-LONG':'')+(m.length>159?' DESC-LONG':'');
  if(flag)bad++;
  console.log(p.padEnd(24), 'title', String(t.length).padStart(3), 'desc', String(m.length).padStart(3), flag);
}
process.exit(bad?1:0);"
```

Expected: exit 0, no `TITLE-LONG` or `DESC-LONG`.

- [ ] **Step 8: Render all 18 pages and read them**

Playwright at 1440×900 and 390×844, incremental scroll to settle AOS, dumping `document.body.innerText` and full-page screenshots for each of the 18 pages. Zero console errors on every page.

Read the dumped text of at least the homepage and benefits page in all three locales and confirm it reads like plain speech, not a brochure. **View the screenshots** — the homepage hero, the benefits four-card grid, and the reordered section sequence.

Delete the driver script afterwards.

- [ ] **Step 9: Confirm the diff touched only what it should**

```bash
git status --short
git diff --stat 96c2107..HEAD
```

Expected: the 18 HTML files, `src/style.css`, `scripts/audit-crop.mjs`, `package.json`, and the two docs files. **Nothing under `blog/`, `ms/blog/`, `ar/blog/`, and no `blog.html`.** No stray `_tmp-*.mjs` in the repo root.

- [ ] **Step 10: Report**

Report to the user: what changed per page, the before/after hero screenshots at both widths, the crop-audit output, and the two things deliberately left alone — the 44 blog files still saying "flavour", and the MS product-name inconsistency between `ms/index.html` and `ms/products.html` that needs the physical pack labels to resolve.

---

## Self-Review

**Spec coverage.** Hero rebuild → Task 1. Voice rules → applied in Tasks 2, 4–9, enforced by the Task 6 grep. Preserved constraints → Global Constraints plus explicit greps in Tasks 6, 7 and 10. Terminology change → Tasks 4–7, swept in Task 10 Step 4. Homepage hero → Task 2. Homepage reorder → Task 3. Six-point strip wording → Task 3 Step 2. Products, Benefits, Retail, Wholesale, Contact → Tasks 5–9. Metadata → folded into each page task, swept in Task 10 Step 7. All eight spec verification items → Task 10 Steps 1–9. All four spec risks → AOS in Task 3 Step 5, frame inheritance in Task 3 Steps 1 and 6, AR headline sizing in Task 2 Step 7, locale drift in the Global Constraints and every task's structure.

**Placeholder scan.** No TBD, no "add appropriate error handling", no "similar to Task N". Every string edit gives the exact before and after in all three locales. Two deliberate judgement calls are marked as such with instructions to report rather than guess: the `id="benefits"` anchor in Task 3 Step 3, and the MS product-name inconsistency in Task 5 Step 4.

**Type consistency.** `.se-highlights-band` is created in Task 3 Step 1 and reused in Task 6 Step 2 under the same name. `.se-story-highlights` keeps its existing name throughout. `npm run audit:crop` is defined in Task 1 Step 2 and called with that exact name in Task 1 Step 7 and Task 10 Step 3. `scripts/audit-crop.mjs` is the same path in all three references.
