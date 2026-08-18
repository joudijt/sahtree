#!/usr/bin/env node
/**
 * indexnow.mjs — pings IndexNow so new/changed pages reach the Bing index
 * in minutes instead of waiting weeks for a natural crawl.
 *
 * Why this matters more than it looks: ChatGPT search and Copilot both sit
 * on Bing. This is the shortest path between "I published a page" and "an
 * answer engine can cite it", and almost nobody does it.
 *
 * One ping covers Bing, Yandex, Seznam and Naver.
 *
 * Setup (once):
 *   node scripts/indexnow.mjs --genkey
 *     -> prints a key. Put it in AI-FACTS.yml under ops.indexnow_key,
 *        and place <key>.txt at your web root containing just the key.
 *
 * Use (every deploy):
 *   node scripts/indexnow.mjs --url https://example.com --sitemap
 *   node scripts/indexnow.mjs --url https://example.com /a /b /c
 */

import { randomBytes } from 'node:crypto';
import { loadFacts, str } from '../../lib/facts.mjs';

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf(`--${n}`); return i !== -1 && argv[i+1] && !argv[i+1].startsWith('--') ? argv[i+1] : d; };
const flag = n => argv.includes(`--${n}`);

if (flag('genkey')) {
  const key = randomBytes(16).toString('hex');
  console.log(`\n  IndexNow key: ${key}\n`);
  console.log(`  1. AI-FACTS.yml  ->  ops.indexnow_key: ${key}`);
  console.log(`  2. Create a file at your web root:  /${key}.txt`);
  console.log(`     containing exactly this one line: ${key}`);
  console.log(`  3. Verify it is live:  curl https://YOURSITE/${key}.txt\n`);
  process.exit(0);
}

const { facts } = loadFacts(arg('facts', 'AI-FACTS.yml'));
const BASE = (arg('url', '') || str(facts, 'site.url')).replace(/\/+$/, '');
const KEY = arg('key', '') || str(facts, 'ops.indexnow_key');

if (!BASE) { console.error('\n  Need --url or site.url in AI-FACTS.yml\n'); process.exit(1); }
if (!KEY) {
  console.error('\n  No IndexNow key. Run:  node scripts/indexnow.mjs --genkey\n');
  console.error('  Skipping is safe — you just wait for a natural crawl instead.\n');
  process.exit(0);   // absence of a key is not a build failure
}

const host = new URL(BASE).host;

async function urlsFromSitemap() {
  const smPath = str(facts, 'ops.sitemap') || '/sitemap.xml';
  const smUrl = /^https?:/i.test(smPath) ? smPath : BASE + smPath;
  const res = await fetch(smUrl);
  if (!res.ok) { console.error(`  Could not read ${smUrl} (HTTP ${res.status})`); return []; }
  const xml = await res.text();

  // Nested sitemap index?
  const children = [...xml.matchAll(/<sitemap>[\s\S]*?<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => m[1]);
  if (children.length) {
    const all = [];
    for (const c of children) {
      const r = await fetch(c);
      if (!r.ok) continue;
      const x = await r.text();
      all.push(...[...x.matchAll(/<url>[\s\S]*?<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => m[1]));
    }
    return all;
  }
  return [...xml.matchAll(/<url>[\s\S]*?<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => m[1]);
}

let urlList = argv.filter(a => !a.startsWith('--') && (a.startsWith('/') || a.startsWith('http')))
                   .map(u => (u.startsWith('http') ? u : BASE + u));

if (flag('sitemap') || !urlList.length) {
  urlList = await urlsFromSitemap();
}

if (!urlList.length) { console.log('\n  Nothing to submit.\n'); process.exit(0); }

// IndexNow accepts up to 10,000 URLs per request.
const BATCH = 10000;
let submitted = 0;

for (let i = 0; i < urlList.length; i += BATCH) {
  const batch = urlList.slice(i, i + BATCH);
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host,
      key: KEY,
      keyLocation: `${BASE}/${KEY}.txt`,
      urlList: batch,
    }),
  });
  // 200 = accepted, 202 = accepted, key validation pending.
  if (res.status === 200 || res.status === 202) {
    submitted += batch.length;
  } else {
    const body = await res.text().catch(() => '');
    console.error(`\n  IndexNow returned ${res.status}. ${body.slice(0, 200)}`);
    if (res.status === 403) {
      console.error(`  403 means the key file is missing or wrong. Check:  ${BASE}/${KEY}.txt\n`);
    }
    process.exit(1);
  }
}

console.log(`\n  IndexNow: submitted ${submitted} URL(s) for ${host}.`);
console.log(`  Covers Bing, Yandex, Seznam, Naver — and therefore ChatGPT search and Copilot.\n`);
