#!/usr/bin/env node
/**
 * extract.mjs — reads a project and pre-fills AI-FACTS.yml from what is
 * already there. This is what makes the flow one-word: without it, "run the
 * flow" means "answer forty questions first".
 *
 * Usage:
 *   node scripts/extract.mjs --root . --out AI-FACTS.yml
 *   node scripts/extract.mjs --root . --dist dist --out AI-FACTS.yml
 *
 * HARD RULE: only facts genuinely found in the project are written. Anything
 * not found is emitted as a blank line with a comment saying where it looked.
 * Nothing is guessed, inferred, or filled with a plausible-sounding default.
 * A wrong licence number or invented client count is a verifiable false claim
 * published across every surface at once — blank beats wrong, always.
 */

import { readFileSync, existsSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf(`--${n}`); return i !== -1 && argv[i+1] && !argv[i+1].startsWith('--') ? argv[i+1] : d; };

const ROOT = arg('root', '.');
const OUT  = arg('out', 'AI-FACTS.yml');
const DIST_HINT = arg('dist', '');

const found = {};      // path -> value
const sources = {};    // path -> where it came from
const notes = [];

const set = (path, value, source) => {
  if (value === undefined || value === null || value === '') return;
  if (found[path] !== undefined) return;          // first finder wins
  found[path] = value;
  sources[path] = source;
};

const read = p => { try { return readFileSync(p, 'utf8').replace(/^﻿/, ''); } catch { return ''; } };
const exists = p => existsSync(p);

/* ------------------------------------------------------------------ *
 * locate the built output
 * ------------------------------------------------------------------ */

const DIST_CANDIDATES = [DIST_HINT, 'dist', 'build', 'out', 'public', '_site', '.output/public']
  .filter(Boolean).map(d => join(ROOT, d));
const DIST = DIST_CANDIDATES.find(d => exists(d) && statSync(d).isDirectory()) || '';
if (DIST) notes.push(`built output: ${relative(ROOT, DIST) || '.'}`);
else notes.push('no built output found — run a build first for much better extraction');

function walk(dir, filter, max = 4000) {
  const out = [];
  const stack = [dir];
  while (stack.length && out.length < max) {
    const d = stack.pop();
    let entries = [];
    try { entries = readdirSync(d, { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      if (e.name === 'node_modules' || e.name === '.git') continue;
      const full = join(d, e.name);
      if (e.isDirectory()) stack.push(full);
      else if (filter(full)) out.push(full);
    }
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * 1. framework config — the most reliable source for url + languages
 * ------------------------------------------------------------------ */

for (const cfg of ['astro.config.mjs','astro.config.ts','astro.config.js']) {
  const p = join(ROOT, cfg);
  if (!exists(p)) continue;
  const src = read(p);
  const site = src.match(/site\s*:\s*['"`]([^'"`]+)['"`]/);
  if (site) set('site.url', site[1].replace(/\/+$/, ''), cfg);

  const defLocale = src.match(/defaultLocale\s*:\s*['"`]([^'"`]+)['"`]/);
  if (defLocale) set('site.default_language', defLocale[1], `${cfg} i18n.defaultLocale`);

  const localesBlock = src.match(/locales\s*:\s*\[([^\]]+)\]/s);
  if (localesBlock) {
    const codes = [...localesBlock[1].matchAll(/['"`]([a-zA-Z-]{2,7})['"`]/g)].map(m => m[1]);
    if (codes.length) set('site.languages', codes, `${cfg} i18n.locales`);
  }
  notes.push(`read ${cfg}`);
}

for (const cfg of ['next.config.js','next.config.mjs','nuxt.config.ts','svelte.config.js']) {
  const p = join(ROOT, cfg);
  if (!exists(p)) continue;
  const src = read(p);
  const locales = src.match(/locales\s*:\s*\[([^\]]+)\]/s);
  if (locales) {
    const codes = [...locales[1].matchAll(/['"`]([a-zA-Z-]{2,7})['"`]/g)].map(m => m[1]);
    if (codes.length) set('site.languages', codes, `${cfg}`);
  }
  const def = src.match(/defaultLocale\s*:\s*['"`]([^'"`]+)['"`]/);
  if (def) set('site.default_language', def[1], cfg);
  notes.push(`read ${cfg}`);
}

{
  const p = join(ROOT, 'package.json');
  if (exists(p)) {
    try {
      const pkg = JSON.parse(read(p));
      if (pkg.homepage) set('site.url', String(pkg.homepage).replace(/\/+$/, ''), 'package.json homepage');
      if (pkg.description) set('site.definition', pkg.description, 'package.json description');
      notes.push('read package.json');
    } catch { notes.push('package.json present but did not parse'); }
  }
}

/* ------------------------------------------------------------------ *
 * 2. an existing llms.txt is the single best source
 * ------------------------------------------------------------------ */

const llmsCandidates = [
  join(ROOT, 'public', 'llms.txt'),
  join(ROOT, 'static', 'llms.txt'),
  DIST && join(DIST, 'llms.txt'),
].filter(Boolean).filter(exists);

if (llmsCandidates.length) {
  const src = read(llmsCandidates[0]);
  const rel = relative(ROOT, llmsCandidates[0]);
  const h1 = src.match(/^#\s+(.+)$/m);
  if (h1) set('site.name', h1[1].trim(), `${rel} H1`);

  const quote = [...src.matchAll(/^>\s?(.*)$/gm)].map(m => m[1].trim()).join(' ').trim();
  if (quote) set('site.definition', quote, `${rel} summary`);

  // Language cross-links, markdown or bare.
  const langs = [...new Set([...src.matchAll(/\/([a-z]{2}(?:-[A-Z]{2})?)\/llms\.txt/g)].map(m => m[1]))];
  if (langs.length) set('site.languages', langs, `${rel} language links`);
  notes.push(`read existing ${rel}`);
}

/* ------------------------------------------------------------------ *
 * 3. built HTML — title, meta, JSON-LD, social links, contacts
 * ------------------------------------------------------------------ */

let homepageHtml = '';
if (DIST) {
  for (const c of ['index.html', 'en/index.html']) {
    const p = join(DIST, c);
    if (exists(p)) { homepageHtml = read(p); notes.push(`read ${c}`); break; }
  }
}

if (homepageHtml) {
  const title = homepageHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (title) {
    // Titles are usually "Page | Brand" or "Brand — Tagline". Take the longest
    // segment as a candidate only; the H1 of an existing llms.txt wins if present.
    const segs = title[1].split(/\s[|–—-]\s/).map(s => s.trim()).filter(Boolean);
    if (segs.length) set('site.name', segs[segs.length - 1], '<title>');
    set('site.tagline', title[1].trim(), '<title>');
  }

  const desc = homepageHtml.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
            || homepageHtml.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  if (desc) set('site.definition', desc[1].trim(), 'meta description');

  const htmlLang = homepageHtml.match(/<html[^>]+lang=["']([a-zA-Z-]+)["']/i);
  if (htmlLang) set('site.default_language', htmlLang[1].split('-')[0], '<html lang>');

  // JSON-LD is the richest source when it exists.
  for (const m of homepageHtml.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    let data;
    try { data = JSON.parse(m[1]); } catch { continue; }
    const nodes = [].concat(data['@graph'] || data);
    for (const n of nodes) {
      const t = String(n['@type'] || '');
      if (!/Organization|LocalBusiness|Corporation|Store/i.test(t)) continue;
      set('site.name', n.name, 'JSON-LD Organization');
      set('site.definition', n.description, 'JSON-LD description');
      set('site.url', n.url && String(n.url).replace(/\/+$/, ''), 'JSON-LD url');
      set('site.founded', n.foundingDate, 'JSON-LD foundingDate');
      set('contact.email', n.email, 'JSON-LD email');
      set('contact.phone', n.telephone, 'JSON-LD telephone');
      if (n.address) {
        set('address.street',   n.address.streetAddress,  'JSON-LD address');
        set('address.city',     n.address.addressLocality,'JSON-LD address');
        set('address.postcode', n.address.postalCode,     'JSON-LD address');
        set('address.country',  n.address.addressCountry, 'JSON-LD address');
      }
      if (Array.isArray(n.sameAs) && n.sameAs.length) {
        set('identities', n.sameAs.map(u => ({ name: hostLabel(u), url: u })), 'JSON-LD sameAs');
      }
      if (n.areaServed) set('site.serving_area', typeof n.areaServed === 'string' ? n.areaServed : undefined, 'JSON-LD areaServed');
    }
  }
}

function hostLabel(u) {
  try {
    const h = new URL(u).host.replace(/^www\./, '');
    const known = { 'linkedin.com':'LinkedIn','facebook.com':'Facebook','instagram.com':'Instagram',
      'x.com':'X','twitter.com':'X','youtube.com':'YouTube','tiktok.com':'TikTok',
      'trustpilot.com':'Trustpilot','g2.com':'G2','capterra.com':'Capterra',
      'crunchbase.com':'Crunchbase','github.com':'GitHub','wikidata.org':'Wikidata' };
    for (const [d, label] of Object.entries(known)) if (h.endsWith(d)) return label;
    return h;
  } catch { return 'Profile'; }
}

/* social + contact links across all built HTML */
if (DIST && !found['identities']) {
  const htmlFiles = walk(DIST, f => extname(f) === '.html', 400);
  const socials = new Map();
  let email = '', phone = '';
  const SOCIAL = /https?:\/\/(?:www\.)?(linkedin\.com|facebook\.com|instagram\.com|x\.com|twitter\.com|youtube\.com|tiktok\.com|trustpilot\.com|g2\.com|capterra\.com|crunchbase\.com|github\.com)\/[^\s"'<>)]+/gi;
  for (const f of htmlFiles.slice(0, 120)) {
    const html = read(f);
    for (const m of html.matchAll(SOCIAL)) {
      const url = m[0].replace(/[)"'>.,]+$/, '');
      const key = hostLabel(url);
      if (!socials.has(key)) socials.set(key, url);
    }
    if (!email) { const e = html.match(/mailto:([^"'?\s>]+)/i); if (e) email = e[1]; }
    if (!phone) { const t = html.match(/tel:([+0-9()\s-]{7,})/i); if (t) phone = t[1].trim(); }
  }
  if (socials.size) set('identities', [...socials].map(([name, url]) => ({ name, url })), 'social links in built HTML');
  set('contact.email', email, 'mailto: link');
  set('contact.phone', phone, 'tel: link');
}

/* ------------------------------------------------------------------ *
 * 4. sitemap -> candidate sections
 * ------------------------------------------------------------------ */

if (DIST) {
  const sm = ['sitemap.xml', 'sitemap-index.xml', 'sitemap-0.xml'].map(f => join(DIST, f)).find(exists);
  if (sm) {
    set('ops.sitemap', '/' + relative(DIST, sm).replace(/\\/g, '/'), 'built output');
    notes.push(`found ${relative(DIST, sm)}`);
  }

  // Build a section list from real pages, using each page's own <title> and
  // meta description. Only pages that actually have both are included — a
  // generated description would be exactly the invented-content failure.
  if (!found['sections']) {
    const htmlFiles = walk(DIST, f => f.endsWith('index.html'), 500)
      .map(f => ({ f, url: '/' + relative(DIST, f).replace(/\\/g, '/').replace(/index\.html$/, '') }))
      .filter(x => x.url !== '/' && x.url.split('/').filter(Boolean).length <= 2)
      .slice(0, 40);

    const links = [];
    for (const { f, url } of htmlFiles) {
      const html = read(f);
      const t = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const d = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
      if (!t || !d) continue;
      links.push({
        title: t[1].split(/\s[|–—-]\s/)[0].trim(),
        url: url.replace(/\/$/, '') || '/',
        description: d[1].trim(),
      });
    }
    if (links.length) {
      set('sections', [{ title: 'Pages', links }], `${links.length} built pages with title + meta description`);
    }
  }
}

/* ------------------------------------------------------------------ *
 * 5. emit
 * ------------------------------------------------------------------ */

const q = v => {
  const s = String(v);
  return /: |^\s|\s$|^["'#-]|:\s*$/.test(s) ? `"${s.replace(/"/g, '\\"')}"` : s;
};

/**
 * Provenance goes on the line ABOVE, never inline.
 *
 * The parser treats an inline `#` as literal text on purpose, so that URLs
 * with fragments and Arabic prose containing `#` survive intact. Emitting
 * inline comments here would therefore append "# from ..." to every value —
 * which produced, among other things, a directory literally named
 * "# from public\llms.txt language links".
 */
const push = (L, key, path, indent = '  ') => {
  if (sources[path]) L.push(`${indent}# from ${sources[path]}`);
  const v = found[path];
  L.push(v === undefined ? `${indent}${key}:` : `${indent}${key}: ${q(v)}`);
};

const L = [];
L.push('####################################################################');
L.push('#  AI-FACTS.yml — auto-extracted, then completed by hand');
L.push('####################################################################');
L.push('#');
L.push('#  Lines with a "# from ..." comment were read out of the project.');
L.push('#  Check them — extraction is literal, not smart.');
L.push('#');
L.push('#  Blank lines are facts that could NOT be found anywhere. They were');
L.push('#  deliberately NOT guessed. Fill the ones you know and leave the rest;');
L.push('#  blank is a supported state everywhere in this kit.');
L.push('#');
L.push('#  Never invent a licence number, registration, or client count. A');
L.push('#  false verifiable claim published across every surface destroys the');
L.push('#  exact trust this process builds. Blank beats wrong.');
L.push('#');
for (const n of notes) L.push(`#  - ${n}`);
L.push('####################################################################');
L.push('');

L.push('site:');
for (const [k, p] of [['name','site.name'],['url','site.url'],['definition','site.definition']]) push(L, k, p);
L.push('  # Not extractable — these are business decisions, not code:');
for (const [k, p] of [['category','site.category'],['serving_area','site.serving_area'],['audience','site.audience']]) push(L, k, p);
for (const [k, p] of [['founded','site.founded'],['tagline','site.tagline'],['default_language','site.default_language']]) push(L, k, p);

if (Array.isArray(found['site.languages'])) {
  // The default language almost never appears in the cross-links — those point
  // at the OTHER languages. Merging it in is required, or the generated
  // "## Languages" block silently omits the site's own primary language.
  const codes = [...found['site.languages']];
  const def = found['site.default_language'];
  if (def && !codes.includes(def)) codes.unshift(def);
  if (sources['site.languages']) L.push(`  # from ${sources['site.languages']}`);
  L.push('  # replace each name with the endonym, e.g. العربية / Bahasa Melayu');
  L.push('  languages:');
  for (const c of codes) L.push(`    - code: ${c}`, `      name: ${c}`);
} else {
  L.push('  languages:');
}
L.push(`  updated: ${new Date().toISOString().slice(0, 10)}`);
L.push('');

L.push('# Verifiable trust tokens. NOT extractable — never guessed.');
L.push('# Highest-value optional block in the file; leave blank if unsure.');
L.push('trust:');
L.push('  registration:');
L.push('  licences:');
L.push('  certifications:');
L.push('  stats:');
L.push('');

L.push('contact:');
push(L, 'email', 'contact.email');
push(L, 'phone', 'contact.phone');
L.push('');

L.push('address:');
for (const [k, p] of [['street','address.street'],['city','address.city'],['postcode','address.postcode'],['country','address.country']]) {
  push(L, k, p);
}
L.push('');

if (sources['identities']) L.push(`# from ${sources['identities']}`);
L.push('identities:');
if (Array.isArray(found['identities'])) {
  for (const i of found['identities']) L.push(`  - name: ${i.name}`, `    url: ${i.url}`);
} else {
  L.push('  # none found in the built HTML — add every profile you control');
}
L.push('');

if (sources['sections']) L.push(`# from ${sources['sections']}`);
L.push('sections:');
if (Array.isArray(found['sections'])) {
  for (const s of found['sections']) {
    L.push(`  - title: ${q(s.title)}`);
    L.push('    links:');
    for (const l of s.links) {
      L.push(`      - title: ${q(l.title)}`);
      L.push(`        url: ${l.url}`);
      L.push(`        description: ${q(l.description)}`);
    }
  }
} else {
  L.push('  # no pages with both a <title> and a meta description were found');
}
L.push('');

L.push('# Not extractable — real prices, real answers, real capabilities.');
L.push('pricing:');
L.push('pricing_notes:');
L.push('faq:');
L.push('agent_actions:');
L.push('');

L.push('ops:');
push(L, 'sitemap', 'ops.sitemap');
L.push('  indexnow_key:');
L.push('  blocked_paths:');
L.push('');

writeFileSync(OUT, L.join('\n'), 'utf8');

/* ---------------- report ---------------- */

const REQUIRED = ['site.name', 'site.url', 'site.definition'];
const gotReq = REQUIRED.filter(p => found[p] !== undefined);

console.log(`\n  Extracted into ${OUT}\n`);
for (const [p, s] of Object.entries(sources)) {
  const v = found[p];
  const shown = Array.isArray(v) ? `${v.length} item(s)` : String(v).slice(0, 64);
  console.log(`  found     ${p.padEnd(22)} ${shown}`);
  console.log(`            └─ ${s}`);
}
console.log('');
if (gotReq.length === 3) {
  console.log(`  All 3 required fields extracted — the build will run as-is.`);
} else {
  console.log(`  MISSING REQUIRED: ${REQUIRED.filter(p => !gotReq.includes(p)).join(', ')}`);
  console.log(`  Fill these by hand before building. Nothing else is mandatory.`);
}
console.log(`\n  Next:  node scripts/coverage.mjs --facts ${OUT}\n`);
