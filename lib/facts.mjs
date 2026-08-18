/**
 * facts.mjs — loads AI-FACTS.yml and reports what is present.
 *
 * Design rule for this whole kit: a blank answer is a normal state, never an
 * error. Anything missing is skipped silently in the output and reported in
 * the coverage report. Only three fields are genuinely required.
 *
 * Zero dependencies. Parses a deliberately small YAML subset — see PARSER
 * NOTES at the bottom of this file for exactly what is supported.
 */

import { readFileSync, existsSync } from 'node:fs';

/* ------------------------------------------------------------------ *
 * Minimal YAML subset parser
 * ------------------------------------------------------------------ */

function stripQuotes(v) {
  if (v.length >= 2) {
    const a = v[0], b = v[v.length - 1];
    if ((a === '"' && b === '"') || (a === "'" && b === "'")) return v.slice(1, -1);
  }
  return v;
}

function coerce(raw) {
  const v = stripQuotes(raw.trim());
  if (v === '') return null;
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v === 'null' || v === '~') return null;
  return v;
}

/** Tokenise into { indent, kind, key, value } ignoring blanks and comments. */
function tokenise(text) {
  const out = [];
  // Strip a UTF-8 BOM. Notepad and PowerShell's `Out-File -Encoding utf8`
  // both write one by default on Windows. Left in place it fuses onto the
  // first key, that line fails to match, and the entire top-level block
  // vanishes silently — which reads as "you left the required fields blank".
  const lines = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n').split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') continue;
    if (/^\s*#/.test(line)) continue;          // full-line comment only

    const indent = line.match(/^ */)[0].length;
    let body = line.slice(indent);

    if (body.startsWith('- ')) {
      const rest = body.slice(2);
      const m = rest.match(/^([A-Za-z0-9_.-]+):\s*(.*)$/);
      if (m) {
        out.push({ indent, kind: 'item-key', key: m[1], value: m[2], line: i + 1 });
      } else {
        out.push({ indent, kind: 'item', value: rest, line: i + 1 });
      }
      continue;
    }
    if (body === '-') { out.push({ indent, kind: 'item', value: '', line: i + 1 }); continue; }

    const m = body.match(/^([A-Za-z0-9_.-]+):\s*(.*)$/);
    if (m) {
      out.push({ indent, kind: 'key', key: m[1], value: m[2], line: i + 1 });
      continue;
    }
    // Unrecognised line: ignore rather than throw. A malformed answer must
    // never take the build down.
  }
  return out;
}

function parse(text) {
  const toks = tokenise(text);
  let pos = 0;

  function parseBlock(indent) {
    // Peek: is this block a list or a map?
    if (pos >= toks.length) return null;
    if (toks[pos].indent < indent) return null;

    if (toks[pos].kind === 'item' || toks[pos].kind === 'item-key') {
      const arr = [];
      while (pos < toks.length && toks[pos].indent === indent &&
             (toks[pos].kind === 'item' || toks[pos].kind === 'item-key')) {
        const t = toks[pos];
        if (t.kind === 'item') {
          pos++;
          const v = coerce(t.value);
          if (v !== null) arr.push(v);
        } else {
          // "- key: value" starts an object; its siblings sit at indent + 2
          pos++;
          const obj = {};
          const v = coerce(t.value);
          if (v === null && pos < toks.length && toks[pos].indent > indent + 2) {
            obj[t.key] = parseBlock(toks[pos].indent);
          } else {
            obj[t.key] = v;
          }
          const childIndent = indent + 2;
          while (pos < toks.length && toks[pos].indent === childIndent && toks[pos].kind === 'key') {
            const c = toks[pos]; pos++;
            const cv = coerce(c.value);
            if (cv === null && pos < toks.length && toks[pos].indent > childIndent) {
              obj[c.key] = parseBlock(toks[pos].indent);
            } else {
              obj[c.key] = cv;
            }
          }
          arr.push(obj);
        }
      }
      return arr;
    }

    const obj = {};
    while (pos < toks.length && toks[pos].indent === indent && toks[pos].kind === 'key') {
      const t = toks[pos]; pos++;
      const v = coerce(t.value);
      if (v === null && pos < toks.length && toks[pos].indent > indent) {
        obj[t.key] = parseBlock(toks[pos].indent);
      } else {
        obj[t.key] = v;
      }
    }
    return obj;
  }

  const root = parseBlock(toks.length ? toks[0].indent : 0);
  return root && typeof root === 'object' && !Array.isArray(root) ? root : {};
}

/* ------------------------------------------------------------------ *
 * Access helpers — every read is blank-safe
 * ------------------------------------------------------------------ */

/**
 * Reads a dotted path. Checks the literal flat key FIRST, because the
 * translation fields are documented as top-level `site.definition_ar:`
 * lines — a key that genuinely contains a dot. Without this, a translated
 * summary silently falls back to the default language and every language
 * file ships with the same body.
 */
export function get(obj, path) {
  if (obj != null && Object.prototype.hasOwnProperty.call(obj, path)) return obj[path];
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

/** Truthy-and-non-empty. Empty string, null, [], {} all count as absent. */
export function has(obj, path) {
  const v = get(obj, path);
  if (v === undefined || v === null || v === '') return false;
  if (Array.isArray(v)) return v.filter(x => x !== null && x !== '').length > 0;
  if (typeof v === 'object') return Object.keys(v).length > 0;
  return true;
}

/** Always returns an array, never null. */
export function list(obj, path) {
  const v = get(obj, path);
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(x => x !== null && x !== '');
  return [v];
}

export function str(obj, path, fallback = '') {
  const v = get(obj, path);
  return (v === null || v === undefined) ? fallback : String(v);
}

/* ------------------------------------------------------------------ *
 * Field registry — drives validation and the coverage report.
 * `cost` is what you lose by leaving the field blank. Nothing here
 * except the three `required` fields can stop a build.
 * ------------------------------------------------------------------ */

export const REGISTRY = [
  // --- required ---
  { path: 'site.name',        layer: 0, required: true,
    cost: 'BLOCKER — nothing can be generated without a canonical name.' },
  { path: 'site.url',         layer: 0, required: true,
    cost: 'BLOCKER — every emitted link must be absolute.' },
  { path: 'site.definition',  layer: 0, required: true,
    cost: 'BLOCKER — this sentence is the highest-value line in every file.' },

  // --- layer 0: entity ---
  { path: 'site.category',    layer: 0,
    cost: 'You are not placed in any category, so "best [category]" queries cannot retrieve you. High impact.' },
  { path: 'site.default_language', layer: 0,
    cost: 'Root llms.txt language is assumed to be the first entry in languages, or English.' },
  { path: 'site.languages',   layer: 0,
    cost: 'Only a single root llms.txt is emitted. Fine for a monolingual site.' },
  { path: 'site.serving_area',layer: 0,
    cost: 'Local and "in [place]" queries lose their anchor. High impact for a local business.' },
  { path: 'site.audience',    layer: 0,
    cost: 'Minor. The summary reads slightly less targeted.' },
  { path: 'site.founded',     layer: 0,
    cost: 'Loses a cheap longevity signal and the schema foundingDate.' },
  { path: 'site.tagline',     layer: 0,
    cost: 'Cosmetic. Definition sentence carries the load.' },

  // --- trust tokens ---
  { path: 'trust.registration', layer: 3,
    cost: 'Loses a verifiable legitimacy signal. Notably weakens "is X legit / trustworthy" answers.' },
  { path: 'trust.licences',     layer: 3,
    cost: 'Same as above. Strongest single trust token when a licence exists.' },
  { path: 'trust.certifications', layer: 3,
    cost: 'Minor unless certification is a buying criterion in your category.' },
  { path: 'trust.stats',        layer: 4,
    cost: 'Statistics carry a measured ~+37% citation lift. Highest-value optional block in the file.' },

  // --- contact / place ---
  { path: 'contact.email',   layer: 3, cost: 'Agents cannot route an enquiry. Minor for SEO, real for agent use.' },
  { path: 'contact.phone',   layer: 3, cost: 'Same, plus weakens LocalBusiness schema.' },
  { path: 'address.street',  layer: 3, cost: 'No LocalBusiness schema is emitted. Skip freely if you have no premises.' },
  { path: 'address.city',    layer: 3, cost: 'As above.' },
  { path: 'address.postcode',layer: 3, cost: 'As above.' },
  { path: 'address.country', layer: 3, cost: 'As above.' },

  // --- identities ---
  { path: 'identities',      layer: 3,
    cost: 'No sameAs array. This is the entity-resolution mechanism — without it your profiles stay unlinked. High impact.' },

  // --- content ---
  { path: 'sections',        layer: 2,
    cost: 'llms.txt falls back to auto-discovering pages from the sitemap. Works, but link descriptions will be generic.' },
  { path: 'pricing',         layer: 2,
    cost: 'No pricing.md emitted. Agents shortlisting on price will skip you.' },
  { path: 'faq',             layer: 4,
    cost: 'No faq.md and no FAQPage schema. Loses direct Q&A extraction.' },
  { path: 'agent_actions',   layer: 2,
    cost: 'No AGENTS.md. Only matters if an agent could transact with you.' },

  // --- ops ---
  { path: 'ops.sitemap',     layer: 1, cost: 'Auto-discovery of pages is disabled; sections must be listed by hand.' },
  { path: 'ops.indexnow_key',layer: 6, cost: 'IndexNow ping is skipped. You wait for a natural crawl instead of minutes.' },
  { path: 'ops.blocked_paths', layer: 1, cost: 'Nothing is excluded from robots.txt beyond the defaults.' },
];

export const REQUIRED = REGISTRY.filter(f => f.required).map(f => f.path);

/* ------------------------------------------------------------------ *
 * Public loader
 * ------------------------------------------------------------------ */

export function loadFacts(path = 'AI-FACTS.yml') {
  if (!existsSync(path)) {
    return { ok: false, facts: {}, missingRequired: REQUIRED, error: `${path} not found` };
  }
  const facts = parse(readFileSync(path, 'utf8'));
  const missingRequired = REQUIRED.filter(p => !has(facts, p));
  return { ok: missingRequired.length === 0, facts, missingRequired, error: null };
}

export function coverage(facts) {
  return REGISTRY.map(f => ({ ...f, present: has(facts, f.path) }));
}

/** Trailing slash removed, so path joins are predictable. */
export function baseUrl(facts) {
  return str(facts, 'site.url').replace(/\/+$/, '');
}

/** Absolute-ise a possibly-relative URL against site.url. */
export function abs(facts, url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return baseUrl(facts) + (url.startsWith('/') ? url : '/' + url);
}

export function languages(facts) {
  const langs = list(facts, 'site.languages');
  if (!langs.length) return [];
  return langs.map(l => (typeof l === 'string' ? { code: l, name: l, path: l } : l));
}

export function defaultLanguage(facts) {
  const explicit = str(facts, 'site.default_language');
  if (explicit) return explicit;
  const langs = languages(facts);
  return langs.length ? (langs[0].code || '') : '';
}

/* ------------------------------------------------------------------ *
 * PARSER NOTES — the supported subset
 *
 *   key: value
 *   key:
 *     nested: value
 *   key:
 *     - item
 *     - item
 *   key:
 *     - name: a
 *       url: b
 *
 * Comments must be on their own line. An inline `#` is treated as literal
 * text, so URLs with fragments and prose containing `#` survive intact.
 * Values may be quoted; quotes are stripped. A blank value is null.
 * Unrecognised lines are ignored rather than fatal — a typo in an optional
 * answer must never break a deploy.
 * ------------------------------------------------------------------ */
