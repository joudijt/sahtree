#!/usr/bin/env node
/**
 * answer-blocks.mjs — reports every <h2> section that does NOT open with a
 * standalone prose answer.
 *
 * Why it matters: an answer engine lifts the block under the heading it matched.
 * A section that opens with a card grid, a table or a bullet list gives it
 * fragments, so the heading ranks but nothing quotable comes out of it. The fix
 * is one 40–60 word paragraph, immediately after the <h2>, that answers the
 * heading on its own without needing the rest of the section.
 *
 * This script only MEASURES. It never writes — the paragraphs are copy on a
 * live health-claims-sensitive site in three languages, and they get written and
 * reviewed deliberately, not generated.
 *
 * Run:  node scripts/ai/answer-blocks.mjs            (summary)
 *       node scripts/ai/answer-blocks.mjs --list     (every gap)
 *       node scripts/ai/answer-blocks.mjs --lang ms  (one language)
 *
 * Always exits 0. This is a worklist, not a gate.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const argv = process.argv.slice(2);
const LIST = argv.includes('--list');
const ONLY = (() => { const i = argv.indexOf('--lang'); return i !== -1 ? argv[i + 1] : ''; })();

/** Headings whose section is structural, not prose — a card list under them is correct. */
// Arabic headings carry the definite article ("الأسئلة الشائعة"), so match the
// stem rather than the exact phrase — a word-boundary anchor does not work on Arabic script.
const STRUCTURAL = /frequently asked|related articles|faq|soalan lazim|artikel berkaitan|الأسئلة|أسئلة شائعة|مقالات ذات صلة/i;

const LANGS = [
  { code: 'en', dirs: ['.', 'blog'] },
  { code: 'ms', dirs: ['ms', 'ms/blog'] },
  { code: 'ar', dirs: ['ar', 'ar/blog'] },
];

function htmlIn(dir) {
  let out = [];
  try {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      if (!statSync(p).isFile() || !e.endsWith('.html')) continue;
      if (e.startsWith('_')) continue;               // _article-template.html
      out.push(p.replace(/\\/g, '/'));
    }
  } catch { /* directory absent — reported as zero files */ }
  return out;
}

const strip = h => h.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

function gapsIn(file) {
  const s = readFileSync(file, 'utf8');
  const gaps = [];
  const re = /<h2[^>]*>([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2|<\/main|<\/body)/g;
  for (const m of s.matchAll(re)) {
    const heading = strip(m[1]);
    if (!heading || STRUCTURAL.test(heading)) continue;
    const rest = m[2];
    const firstTag = (rest.match(/<(p|ul|ol|table|div|figure|h3)\b/) || [])[1] || null;
    const firstP = rest.match(/<p[^>]*>([\s\S]*?)<\/p>/);
    const words = firstP ? strip(firstP[1]).split(' ').filter(Boolean).length : 0;
    if (firstTag !== 'p' || words < 25) {
      gaps.push({ heading, firstTag: firstTag || 'nothing', words });
    }
  }
  return gaps;
}

let grand = 0;
for (const lang of LANGS) {
  if (ONLY && ONLY !== lang.code) continue;
  const files = lang.dirs.flatMap(htmlIn);
  let n = 0;
  for (const f of files) {
    const g = gapsIn(f);
    if (!g.length) continue;
    n += g.length;
    if (LIST) {
      console.log(`\n  ${f}`);
      for (const x of g) console.log(`      ${String(x.words).padStart(3)}w  opens with <${x.firstTag}>  —  ${x.heading}`);
    }
  }
  grand += n;
  console.log(`  ${lang.code}: ${n} section(s) with no standalone answer block, across ${files.length} pages`);
}
console.log(`\n  ${grand} total. Each one is a 40–60 word paragraph directly after the <h2>.`);
console.log(`  Rules that bind those paragraphs: no medical or therapeutic claim, no price,`);
console.log(`  no banned adjective (see scripts/check-llms.mjs G9), halal wording carries the`);
console.log(`  no-JAKIM-certificate sentence in the same block.\n`);
