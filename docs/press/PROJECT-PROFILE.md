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
