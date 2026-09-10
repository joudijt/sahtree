# PROJECT-PROFILE — Sihatree

Written by PRESS Stage 0, 2026-08-25.

- **Stack**: Vite 7 static multi-page app, no CMS, no backend. Every route is a hand-written
  `.html` file registered in `vite.config.js` `rollupOptions.input`.
- **Languages**: trilingual, separate crawlable URLs — `en` (root), `ms` (`ms/`), `ar` (`ar/`,
  `dir="rtl"`). AR mirrors EN's blog filenames exactly (not translated slugs) — confirmed by
  diffing `blog/*.html` vs `ar/blog/*.html` basenames (identical, 0 diff). This round follows
  that existing convention rather than the PRESS default of native-script AR slugs, to keep
  the site's established file-parity architecture intact.
- **Existing inventory**: 43 EN + 43 BM + 43 AR articles already live (first round 2026-07-11,
  +20 on 07-16, +20 on 07-20). Full topic table in `CLAUDE.md`. No two existing articles
  overlap in search intent — new topics were chosen to not cannibalise any of the 43.
- **Legal ceiling**: Malaysia food-supplement content. No JAKIM certificate exists — never write
  "certified"/"official"/"verified"/"guaranteed" language (site-wide ban, 2026-07-26 ruling).
  No disease-treatment claims. No invented prices (site publishes none, in any currency). Only
  Berkat Madinah Store may be named as supplier/grocery. Location articles only for real branches.
- **Facts source of truth**: `AI-FACTS.yml` + `public/llms.txt` (EN/MS/AR). Real branches per
  madinah.com.my/en/branches.html: Ampang (HQ), Kajang, Shah Alam, Gombak — Klang Valley only.
- **Gate**: `node scripts/check-llms.mjs` (llms.txt prose gate) + this round's manual mechanical/
  adversarial pass (no `bin/press_gate.py` run in this project — html-validate + check-llms are
  the project's own gates).
- **Deploy**: `python scripts/ftp-deploy.py` after `npm run build`. Verify by bytes, not status
  code (SPA-style `.htaccess` rewrite answers 200 for missing files).
- **Images**: reuse-first. This round generated 5 new photos via `imgen.py` (pollinations
  provider; zimage token expired/401) because the existing asset bank's fitting photos were
  already reused 2-7x each on the 43-article inventory, and one reuse (fiber/grains crop) was
  used with a genuinely different crop box. See `round-1/IMAGE-INVENTORY.md`.

---

## Refresh — PRESS Stage 0, 2026-09-10 (round 2)

Re-read from the repo. Every line below was proved by a file, not remembered.

| Question | Answer | Proof |
|---|---|---|
| Where do articles live? | Hand-written `.html`, one per route: `blog/<slug>.html` (EN), `ms/blog/<slug>.html`, `ar/blog/<slug>.html`. No CMS, no content collection, no front-matter. | `ls blog ms/blog ar/blog` |
| Article data shape | The HTML file itself is the data. Nearest thing to a schema is `blog/_article-template.html`. | `blog/_article-template.html` |
| Slug registry / drift assert | **None.** There is no `slugs.json` and nothing throws on mismatch. The only registry is `vite.config.js` `rollupOptions.input` — a slug missing from it silently does not build. | `vite.config.js` |
| Languages | 3 — `en` at root, `ms` under `ms/`, `ar` under `ar/` (`dir="rtl"`). Separate crawlable URLs, deliberately (AI crawlers do not run JS). | `CLAUDE.md`, directory listing |
| Route generation | Vite 7 multi-page: every route is an explicit Rollup input. **168 `.html` entries.** Enumerated from source, not memory. | `grep -c '\.html' vite.config.js` |
| Build / deploy | `npm run build` (prebuild runs `scripts/ai/surfaces.mjs`), then `python scripts/ftp-deploy.py` — FTPS to `162.0.215.47`, chrooted to the docroot, dotfiles included or `.htaccess` never ships. | `package.json`, `CLAUDE.md` |
| Existing gates | `npm run check:llms` (`scripts/check-llms.mjs`), `npm run audit:html` (html-validate), `ai:coverage`, `ai:gate`, `ai:answers`. `check:llms` was **green before this round** and must be green after. | run at Stage 0, exit 0 |
| AI-visibility surfaces | `public/llms.txt` + `public/ms/llms.txt` + `public/ar/llms.txt` (three hand-written natives, 66/67/69 Q&A), `public/llms-full.txt`, `public/about.md`, `public/faq.md`, `public/AGENTS.md`, `AI-FACTS.yml`, `AI-VISIBILITY.md`, IndexNow key file. | `ls public` |
| **Does the kit overwrite llms.txt?** | **No — checked, not assumed.** `scripts/ai/surfaces.mjs` builds into `.beacon-out/`, adopts only `about.md`, `faq.md` and `AGENTS.md` into `public/`, and its header says in as many words that it deliberately does not overwrite the three hand-written `llms.txt` files. The standing warning does not bite on this project. | `scripts/ai/surfaces.mjs` lines 8-20 |
| Source of truth for facts | `AI-FACTS.yml` (+ the three `llms.txt`). `trust.certifications` is blank **on purpose** — there is no JAKIM certificate. | `AI-FACTS.yml` |
| Live inventory | Live sitemap pulled 2026-09-10: **168 URLs** = 49 EN + 49 MS + 49 AR blog + 21 commercial. | `https://sihatree.com/sitemap.xml` |
| Market / legal ceiling | Malaysia only. Food Regulations 1985 Reg. 18(6): a food may not claim to prevent, treat or cure. Plus the site's own bans: no "certified/official/verified/trusted/authentic/guaranteed", no prices in any currency, no grocery named but Berkat Madinah Store, no branch outside Ampang / Kajang / Shah Alam / Gombak. | `CLAUDE.md`, `AI-FACTS.yml` |
| Known live defect | `{{PRICE_MYR}}` is unrendered in the `Product` schema on `index.html`, `products.html` and their `ms/`/`ar/` twins (10 files including `dist/`). Not touched and not propagated this round — no article emits a Product/Offer node. | `grep -rl '{{PRICE_MYR}}'` |

### Capability probe — run, and the output looked at

| Tool | Result |
|---|---|
| `node scripts/check-llms.mjs` | **exit 0**, all 3 files green — the pre-round baseline |
| Pillow | 12.3.0, present — Stage 4 crops run locally |
| `bin/press_gate.py --help` | runs |
| `bin/imgen.py` | **not probed and not used** — images are reuse-only on this project |
| Live site fetch | `curl --ssl-no-revoke` returns the sitemap, 95,783 bytes, 168 `<loc>` |

### Control run — the finding that changed how this round is gated

`bin/press_gate.py` was run against articles that have been **live and verified since round 1**
before any new article existed. They fail:

| Live article | gate word-count | its draft count | structured-block | answer-first |
|---|---|---|---|---|
| `ms/blog/panduan-pemula-30-hari-pertama-gam-arab` | 693 | 916 | FAIL | FAIL |
| `blog/arabic-gum-for-bloating` | 671 | 996 | FAIL | FAIL |
| `blog/arabic-gum-first-30-days-beginners-guide` | 753 | 997 | FAIL | pass |

Three conclusions, all acted on:

1. **The gate's rendered-region counter reads ~70% of this template's draft count.** Gating this
   round at the raw 800-1,060 band would fail a compliant round on the gate's own framing. The
   draft band is enforced separately, before rendering.
2. **`structured-block` fails on 100% of the existing corpus** — and that one is a *real* site
   defect, not a gate artefact: the design system had no table styling, so no article has ever
   contained a `<table>` or a `<ul>`. Fixed this round (see DECISIONS #13); every new article
   carries a real comparison table.
3. **`answer-first` fires on "Artikel Berkaitan"** — the gate's Malay boilerplate list is missing
   the site's own related-rail heading, so a boilerplate H2 is judged as an article section. A
   gate framing defect; recorded as a known-benign class in `round-2/GATE.md`, not "fixed" by
   changing the site.
