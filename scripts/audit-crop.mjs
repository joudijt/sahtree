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
      // querySelectorAll('*') can never return a ::before/::after — they aren't
      // nodes. Without this pass, any cover-painted image moved onto a pseudo
      // element (as the mobile hero was) is invisible to the audit: it prints
      // a clean run not because nothing is cropped, but because it never looked.
      // getComputedStyle(el, pseudo) does return the pseudo's real used styles,
      // including a resolved width/height in px — but only when the pseudo
      // actually generates a box (content set, not display:none). When it
      // doesn't, width/height come back as 'auto', '0px', or '' depending on
      // the property, so the same positive-number-above-threshold guard used
      // for real elements also filters out pseudos that don't exist.
      for (const el of document.querySelectorAll('*')) {
        for (const pseudo of ['::before', '::after']) {
          const pcs = getComputedStyle(el, pseudo);
          if (!pcs.backgroundImage.includes('url(') || !pcs.backgroundSize.startsWith('cover')) continue;
          const w = parseFloat(pcs.width);
          const h = parseFloat(pcs.height);
          if (!(w > 100) || !(h > 100)) continue;
          const file = Object.keys(sources).find((f) => pcs.backgroundImage.includes(f));
          if (!file) continue;
          const base = el.className && el.className.toString().trim()
            ? '.' + el.className.toString().trim().split(/\s+/).join('.')
            : el.tagName.toLowerCase();
          out.push({
            kind: 'pseudo', file,
            sel: base + pseudo,
            box: Math.round(w) + 'x' + Math.round(h),
            shown: w / h, natural: sources[file],
          });
        }
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
