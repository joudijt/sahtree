#!/usr/bin/env node
/**
 * build.mjs — emits every machine-readable file from AI-FACTS.yml.
 *
 * Usage:
 *   node scripts/build.mjs --facts AI-FACTS.yml --out public
 *   node scripts/build.mjs --out dist --robots        # also write robots.txt
 *
 * Contract: a blank answer is skipped. No placeholder text ever reaches an
 * emitted file, and no optional gap can fail the build. Only the three
 * required fields stop it, and they stop it loudly.
 */

import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import {
  loadFacts, has, get, list, str, abs, baseUrl,
  languages, defaultLanguage,
} from '../../lib/facts.mjs';

/* ---------------- args ---------------- */

const argv = process.argv.slice(2);
const arg = (name, dflt) => {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : dflt;
};
const flag = name => argv.includes(`--${name}`);

const FACTS_PATH = arg('facts', 'AI-FACTS.yml');
const OUT = arg('out', 'out');

/* ---------------- load ---------------- */

const { ok, facts, missingRequired, error } = loadFacts(FACTS_PATH);

if (error) {
  console.error(`\n  FAIL  ${error}`);
  console.error(`        Copy AI-FACTS.yml into this project and fill the three required fields.\n`);
  process.exit(1);
}
if (!ok) {
  console.error(`\n  FAIL  Required fields are blank in ${FACTS_PATH}:`);
  for (const p of missingRequired) console.error(`          ${p}`);
  console.error(`\n        These three are the only hard requirements. Everything else may stay blank.\n`);
  process.exit(1);
}

const emitted = [];
const skipped = [];

function write(relPath, content) {
  const full = join(OUT, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, 'utf8');
  emitted.push(relPath);
}
function skip(what, why) { skipped.push({ what, why }); }

/* ---------------- shared pieces ---------------- */

const NAME = str(facts, 'site.name');
const BASE = baseUrl(facts);
const LANGS = languages(facts);
const DEFAULT_LANG = defaultLanguage(facts);
const TODAY = str(facts, 'site.updated') || new Date().toISOString().slice(0, 10);

/**
 * Language-aware value: site.definition, or site.definition_ar for lang "ar".
 * A missing translation falls back to the default language so the build never
 * breaks — but that fallback is exactly how a wrong-language body ships, so
 * every fallback is recorded and reported loudly at the end.
 */
const missingTranslations = new Set();
function localised(path, lang) {
  if (lang && lang !== DEFAULT_LANG) {
    const v = get(facts, `${path}_${lang}`);
    if (v) return String(v);
    missingTranslations.add(`${path}_${lang}`);
  }
  return str(facts, path);
}

/** Prefix a site-relative path with the language segment. */
function langUrl(path, lang) {
  const p = path.startsWith('/') ? path : '/' + path;
  if (!lang || lang === DEFAULT_LANG) return BASE + p;
  return `${BASE}/${lang}${p}`;
}

function languagesBlock(lang) {
  if (LANGS.length < 2) return '';
  const lines = LANGS.map(l => {
    const code = l.code || l;
    const label = l.name || code;
    const url = code === DEFAULT_LANG ? `${BASE}/llms.txt` : `${BASE}/${code}/llms.txt`;
    const tag = code === DEFAULT_LANG ? ' (default)' : '';
    return `- [${label}](${url}): ${label}${tag}`;
  });
  return `\n## Languages\n${lines.join('\n')}\n`;
}

/* ---------------- llms.txt ---------------- */

function buildLlms(lang) {
  const L = [];
  const name = localised('site.name', lang);
  const definition = localised('site.definition', lang);

  L.push(`# ${name}`, '');

  // The blockquote summary. Highest-value line in the file — and the line the
  // language gate diffs, so it must genuinely differ per language.
  definition.match(/.{1,76}(\s|$)/g).forEach(chunk => L.push(`> ${chunk.trim()}`));
  L.push('');

  // Context lines — each independently optional.
  const ctx = [];
  if (has(facts, 'site.category'))     ctx.push(`Category: ${localised('site.category', lang)}`);
  if (has(facts, 'site.serving_area')) ctx.push(`Serving: ${localised('site.serving_area', lang)}`);
  if (has(facts, 'site.audience'))     ctx.push(`For: ${localised('site.audience', lang)}`);
  if (has(facts, 'site.founded'))      ctx.push(`Operating since: ${str(facts, 'site.founded')}`);
  if (has(facts, 'trust.registration'))ctx.push(`Registration: ${str(facts, 'trust.registration')}`);
  for (const lic of list(facts, 'trust.licences')) {
    ctx.push(`Licence: ${typeof lic === 'string' ? lic : [lic.authority, lic.number].filter(Boolean).join(' ')}`);
  }
  for (const s of list(facts, 'trust.stats')) {
    ctx.push(typeof s === 'string' ? s : [s.claim, s.source && `(${s.source})`].filter(Boolean).join(' '));
  }
  if (has(facts, 'contact.email')) ctx.push(`Contact: ${str(facts, 'contact.email')}`);
  if (has(facts, 'contact.phone')) ctx.push(`Phone: ${str(facts, 'contact.phone')}`);
  ctx.push(`Last updated: ${TODAY}`);
  L.push(...ctx, '');

  // Sections of links.
  const sections = list(facts, 'sections');
  if (sections.length) {
    for (const sec of sections) {
      const title = localised_sec(sec, 'title', lang);
      const links = Array.isArray(sec.links) ? sec.links : [];
      const usable = links.filter(x => x && x.url && (x.title || x.title_ar));
      if (!usable.length) continue;
      L.push(`## ${title || 'Pages'}`);
      for (const link of usable) {
        const t = (lang && lang !== DEFAULT_LANG && link[`title_${lang}`]) || link.title;
        const d = (lang && lang !== DEFAULT_LANG && link[`description_${lang}`]) || link.description;
        const u = /^https?:/i.test(link.url) ? link.url : langUrl(link.url, lang);
        L.push(d ? `- [${t}](${u}): ${d}` : `- [${t}](${u})`);
      }
      L.push('');
    }
  }

  // Machine-readable siblings, only if they were actually emitted.
  const extras = [];
  if (has(facts, 'pricing'))       extras.push(`- [Pricing data](${BASE}/pricing.md): Machine-readable plans, limits and prices.`);
  if (has(facts, 'faq'))           extras.push(`- [FAQ](${BASE}/faq.md): Common questions, plain text.`);
  if (has(facts, 'agent_actions')) extras.push(`- [Agent actions](${BASE}/AGENTS.md): What an agent can do here and where.`);
  if (extras.length) L.push('## Machine-readable', ...extras, '');

  const langBlock = languagesBlock(lang);
  if (langBlock) L.push(langBlock.trim(), '');

  return L.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

function localised_sec(sec, key, lang) {
  if (lang && lang !== DEFAULT_LANG && sec[`${key}_${lang}`]) return sec[`${key}_${lang}`];
  return sec[key];
}

write('llms.txt', buildLlms(DEFAULT_LANG));
for (const l of LANGS) {
  const code = l.code || l;
  if (code === DEFAULT_LANG) continue;
  write(`${code}/llms.txt`, buildLlms(code));
}
if (LANGS.length < 2) skip('per-language llms.txt', 'site.languages lists fewer than two languages');

/* ---------------- llms-full.txt ---------------- */

{
  const parts = [buildLlms(DEFAULT_LANG).trimEnd(), ''];
  if (has(facts, 'pricing')) parts.push('---', '', buildPricing().trimEnd(), '');
  if (has(facts, 'faq'))     parts.push('---', '', buildFaq().trimEnd(), '');
  if (has(facts, 'trust.stats') || has(facts, 'site.founded')) parts.push('---', '', buildAbout().trimEnd(), '');
  write('llms-full.txt', parts.join('\n') + '\n');
}

/* ---------------- pricing.md ---------------- */

function buildPricing() {
  const L = [`# Pricing — ${NAME}`, ''];
  for (const plan of list(facts, 'pricing')) {
    if (typeof plan === 'string') { L.push(`- ${plan}`); continue; }
    if (!plan.name) continue;
    L.push(`## ${plan.name}`);
    if (plan.price)    L.push(`- Price: ${plan.price}`);
    if (plan.billing)  L.push(`- Billing: ${plan.billing}`);
    if (plan.limits)   L.push(`- Limits: ${plan.limits}`);
    const inc = Array.isArray(plan.includes) ? plan.includes : (plan.includes ? [plan.includes] : []);
    if (inc.length)    L.push(`- Included: ${inc.join(', ')}`);
    if (plan.notes)    L.push(`- Notes: ${plan.notes}`);
    L.push('');
  }
  if (has(facts, 'pricing_notes')) L.push(str(facts, 'pricing_notes'), '');
  L.push(`Last updated: ${TODAY}`);
  return L.join('\n') + '\n';
}
if (has(facts, 'pricing')) write('pricing.md', buildPricing());
else skip('pricing.md', 'no pricing entries given — agents shortlisting on price will skip you');

/* ---------------- faq.md ---------------- */

function buildFaq() {
  const L = [`# FAQ — ${NAME}`, ''];
  for (const item of list(facts, 'faq')) {
    if (!item || !item.q || !item.a) continue;
    L.push(`## ${item.q}`, '', item.a, '');
  }
  L.push(`Last updated: ${TODAY}`);
  return L.join('\n') + '\n';
}
if (has(facts, 'faq')) write('faq.md', buildFaq());
else skip('faq.md', 'no FAQ entries given — loses direct Q&A extraction and FAQPage schema');

/* ---------------- about.md ---------------- */

function buildAbout() {
  const L = [`# About — ${NAME}`, '', str(facts, 'site.definition'), ''];
  const rows = [];
  if (has(facts, 'site.founded'))       rows.push(`- Operating since: ${str(facts, 'site.founded')}`);
  if (has(facts, 'site.category'))      rows.push(`- Category: ${str(facts, 'site.category')}`);
  if (has(facts, 'site.serving_area'))  rows.push(`- Serving area: ${str(facts, 'site.serving_area')}`);
  if (has(facts, 'trust.registration')) rows.push(`- Registration: ${str(facts, 'trust.registration')}`);
  for (const lic of list(facts, 'trust.licences')) {
    rows.push(`- Licence: ${typeof lic === 'string' ? lic : [lic.authority, lic.number].filter(Boolean).join(' ')}`);
  }
  for (const c of list(facts, 'trust.certifications')) rows.push(`- Certification: ${c}`);
  for (const s of list(facts, 'trust.stats')) {
    rows.push(`- ${typeof s === 'string' ? s : [s.claim, s.source && `(source: ${s.source})`, s.date && `[${s.date}]`].filter(Boolean).join(' ')}`);
  }
  if (has(facts, 'address.street')) {
    const addr = ['address.street','address.city','address.postcode','address.country']
      .filter(p => has(facts, p)).map(p => str(facts, p)).join(', ');
    rows.push(`- Address: ${addr}`);
  }
  if (has(facts, 'contact.email')) rows.push(`- Email: ${str(facts, 'contact.email')}`);
  if (has(facts, 'contact.phone')) rows.push(`- Phone: ${str(facts, 'contact.phone')}`);
  if (rows.length) L.push('## Facts', ...rows, '');
  const ids = list(facts, 'identities');
  if (ids.length) {
    L.push('## Profiles');
    for (const id of ids) L.push(typeof id === 'string' ? `- ${id}` : `- ${id.name || 'Profile'}: ${id.url}`);
    L.push('');
  }
  L.push(`Last updated: ${TODAY}`);
  return L.join('\n') + '\n';
}
if (has(facts, 'site.founded') || has(facts, 'trust.registration') || has(facts, 'trust.stats') || has(facts, 'identities')) {
  write('about.md', buildAbout());
} else {
  skip('about.md', 'no entity facts given (founded / registration / stats / identities)');
}

/* ---------------- AGENTS.md ---------------- */

if (has(facts, 'agent_actions')) {
  const L = [`# Agent actions — ${NAME}`, '',
    `What an automated agent can do on this site, and where.`, ''];
  for (const a of list(facts, 'agent_actions')) {
    if (!a || !a.action) continue;
    L.push(`## ${a.action}`);
    if (a.url)      L.push(`- URL: ${abs(facts, a.url)}`);
    if (a.method)   L.push(`- Method: ${a.method}`);
    if (a.inputs)   L.push(`- Inputs: ${Array.isArray(a.inputs) ? a.inputs.join(', ') : a.inputs}`);
    if (a.auth)     L.push(`- Auth: ${a.auth}`);
    if (a.notes)    L.push(`- Notes: ${a.notes}`);
    L.push('');
  }
  L.push(`Last updated: ${TODAY}`);
  write('AGENTS.md', L.join('\n') + '\n');
} else {
  skip('AGENTS.md', 'no agent actions given — only matters if an agent could transact with you');
}

/* ---------------- robots ---------------- */

const AI_BOTS = [
  'GPTBot','OAI-SearchBot','ChatGPT-User','PerplexityBot','Perplexity-User',
  'ClaudeBot','Claude-User','anthropic-ai','Google-Extended','Applebot-Extended',
  'Amazonbot','meta-externalagent','Bingbot','DuckAssistBot','cohere-ai',
];
{
  const L = ['# --- AI answer engines: allow (generated by ai-visibility-kit) ---'];
  for (const b of AI_BOTS) L.push(`User-agent: ${b}`);
  L.push('Allow: /');
  for (const p of list(facts, 'ops.blocked_paths')) L.push(`Disallow: ${p}`);
  L.push('', '# --- bulk training scraper: opt out, keeps answer engines ---',
         'User-agent: CCBot', 'Disallow: /', '');
  if (has(facts, 'ops.sitemap')) L.push(`Sitemap: ${abs(facts, str(facts, 'ops.sitemap'))}`);
  L.push(`# llms.txt: ${BASE}/llms.txt`);
  const body = L.join('\n') + '\n';

  // Never clobber an existing robots.txt — emit a snippet to append instead.
  const target = join(OUT, 'robots.txt');
  if (flag('robots') && !existsSync(target)) {
    write('robots.txt', body);
  } else if (flag('robots') && existsSync(target)) {
    const cur = readFileSync(target, 'utf8');
    if (cur.includes('GPTBot')) skip('robots.txt', 'already contains an AI bot block — left untouched');
    else { write('robots.txt', cur.trimEnd() + '\n\n' + body); }
  } else {
    write('robots.snippet.txt', body);
  }
}

/* ---------------- schema.jsonld ---------------- */

{
  const graph = [];
  const orgId = `${BASE}/#organization`;
  const hasAddress = ['address.street','address.city','address.country'].every(p => has(facts, p));

  const org = {
    '@type': hasAddress ? 'LocalBusiness' : 'Organization',
    '@id': orgId,
    name: NAME,
    description: str(facts, 'site.definition'),
    url: BASE,
  };
  if (has(facts, 'site.logo'))    org.logo = abs(facts, str(facts, 'site.logo'));
  if (has(facts, 'site.founded')) org.foundingDate = str(facts, 'site.founded');
  if (has(facts, 'contact.email'))org.email = str(facts, 'contact.email');
  if (has(facts, 'contact.phone'))org.telephone = str(facts, 'contact.phone');
  if (hasAddress) {
    org.address = {
      '@type': 'PostalAddress',
      streetAddress: str(facts, 'address.street'),
      addressLocality: str(facts, 'address.city'),
      postalCode: str(facts, 'address.postcode') || undefined,
      addressCountry: str(facts, 'address.country'),
    };
  }
  const sameAs = list(facts, 'identities')
    .map(i => (typeof i === 'string' ? i : i.url))
    .filter(Boolean);
  if (sameAs.length) org.sameAs = sameAs;
  if (has(facts, 'site.serving_area')) org.areaServed = str(facts, 'site.serving_area');
  graph.push(org);

  const faqItems = list(facts, 'faq').filter(f => f && f.q && f.a);
  if (faqItems.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${BASE}/#faq`,
      mainEntity: faqItems.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  write('schema.jsonld', JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2) + '\n');
}

/* ---------------- report ---------------- */

console.log(`\n  ${NAME} — built into ${OUT}/\n`);
for (const f of emitted) console.log(`  emitted   ${f}`);
if (skipped.length) {
  console.log('');
  for (const s of skipped) console.log(`  skipped   ${s.what}\n            ${s.why}`);
}
if (missingTranslations.size) {
  const critical = [...missingTranslations].filter(k => /^site\.(name|definition)_/.test(k));
  console.log('');
  console.log(`  TRANSLATIONS MISSING — ${missingTranslations.size} field(s) fell back to ${DEFAULT_LANG}:`);
  for (const k of [...missingTranslations].sort()) console.log(`            ${k}`);
  if (critical.length) {
    console.log('');
    console.log(`  !!      ${critical.length} of those are the name or the summary sentence.`);
    console.log(`          Those language files now carry a ${DEFAULT_LANG} body under a translated`);
    console.log(`          heading — the exact shape where shared chrome hides a wrong-language`);
    console.log(`          page. scripts/gate.mjs will fail on this once deployed.`);
  }
}

console.log(`\n  ${emitted.length} file(s) emitted, ${skipped.length} skipped. Blanks are fine — run coverage.mjs to see what each one costs.\n`);
