#!/usr/bin/env node
/**
 * gate.mjs — verifies the LIVE site, not the build output.
 *
 * Every check here fetches a real URL over the network. A build log that
 * says "ok" proves nothing about what a crawler in another country sees,
 * and a generator that writes after the dist copy exits 0 while shipping
 * nothing. So: assert on deployed bytes, always.
 *
 * Usage:
 *   node scripts/gate.mjs --url https://example.com
 *   node scripts/gate.mjs --url https://example.com --strict   # exit 1 on warnings too
 *
 * Exit codes: 0 = pass, 1 = at least one FAIL (or WARN with --strict).
 */

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf(`--${n}`); return i !== -1 && argv[i+1] && !argv[i+1].startsWith('--') ? argv[i+1] : d; };
const STRICT = argv.includes('--strict');
const BASE = (arg('url', '') || '').replace(/\/+$/, '');

if (!BASE) {
  console.error('\n  Usage: node scripts/gate.mjs --url https://example.com\n');
  process.exit(1);
}

// Label is carried explicitly — deriving it from the UA string produced
// "Mozilla" for every browser-shaped agent.
const AI_BOTS = [
  { label: 'GPTBot',          ua: 'GPTBot/1.0' },
  { label: 'OAI-SearchBot',   ua: 'OAI-SearchBot/1.0' },
  { label: 'PerplexityBot',   ua: 'PerplexityBot/1.0' },
  { label: 'ClaudeBot',       ua: 'ClaudeBot/1.0' },
  { label: 'Google-Extended', ua: 'Mozilla/5.0 (compatible; Google-Extended)' },
  { label: 'bingbot',         ua: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)' },
];
const UA = AI_BOTS[0].ua;

// Politeness gap between requests. Without it this script trips the target's
// own rate limiter and then reports the resulting 429 as a site failure —
// which is the gate inventing a defect that does not exist.
// 400 ms is not enough for every host. Some shared hosts 429 nearly every
// check at that rate, and every one of those is this script's own footprint
// rather than a defect — a run that reports imaginary failures is worse than
// no run at all. Override with --gap <ms>.
const GAP_MS = Number(arg('gap', '')) > 0 ? Number(arg('gap', '')) : 400;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const results = [];
const rec = (level, name, detail) => results.push({ level, name, detail });

async function fetchOnce(url, ua, timeoutMs) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': ua, 'Accept': '*/*' },
      redirect: 'follow',
      signal: ctl.signal,
    });
    const body = await res.text();
    return { status: res.status, headers: res.headers, body, url: res.url };
  } catch (e) {
    return { status: 0, headers: new Headers(), body: '', url, error: e.message };
  } finally {
    clearTimeout(t);
  }
}

/**
 * Throttled fetch with one backoff retry on 429/503. A rate-limit response is
 * this script's own footprint, not a defect in the site — reporting it as a
 * failure would be the gate manufacturing a bug.
 */
async function fetchAs(url, ua = UA, timeoutMs = 15000) {
  await sleep(GAP_MS);
  let r = await fetchOnce(url, ua, timeoutMs);
  if (r.status === 429 || r.status === 503) {
    const wait = Number(r.headers.get('retry-after')) * 1000 || 4000;
    await sleep(Math.min(wait, 10000));
    r = await fetchOnce(url, ua, timeoutMs);
    if (r.status === 429 || r.status === 503) r.rateLimited = true;
  }
  return r;
}

/* ---------------- 1. bot access ---------------- */

async function checkBotAccess() {
  for (const { label, ua } of AI_BOTS) {
    const r = await fetchAs(`${BASE}/llms.txt`, ua);
    if (r.status === 200) {
      rec('PASS', `bot access: ${label}`, `200 on /llms.txt`);
    } else if (r.status === 0) {
      rec('FAIL', `bot access: ${label}`, `request failed — ${r.error}`);
    } else if (r.rateLimited) {
      rec('WARN', `bot access: ${label}`,
        `${r.status} after a retry — rate limiting, most likely triggered by this ` +
        `script's own request rate. Re-run alone before treating it as a block.`);
    } else if ([403, 401].includes(r.status)) {
      rec('FAIL', `bot access: ${label}`,
        `${r.status} — blocked at the CDN/WAF, not in robots.txt. ` +
        `Check Cloudflare "Block AI Scrapers and Crawlers" and Bot Fight Mode.`);
    } else {
      rec('FAIL', `bot access: ${label}`, `${r.status} on /llms.txt`);
    }
  }
}

/* ---------------- 2. llms.txt shape ---------------- */

let rootBody = '';

async function checkLlms() {
  const r = await fetchAs(`${BASE}/llms.txt`);
  if (r.status !== 200) { rec('FAIL', 'llms.txt', `HTTP ${r.status}`); return; }
  rootBody = r.body;

  const ct = r.headers.get('content-type') || '';
  if (!/charset=utf-8/i.test(ct)) {
    rec('WARN', 'llms.txt charset',
      `Content-Type is "${ct}" — should include charset=utf-8. Mandatory once you have ` +
      `Arabic, CJK or accented text, or the file renders as mojibake.`);
  } else {
    rec('PASS', 'llms.txt charset', ct);
  }

  if (!/^#\s+\S/m.test(r.body)) rec('FAIL', 'llms.txt H1', 'no "# Name" heading found');
  else rec('PASS', 'llms.txt H1', 'present');

  if (!/^>\s+\S/m.test(r.body)) {
    rec('FAIL', 'llms.txt summary',
      'no "> summary" blockquote. This is the highest-value line in the file.');
  } else {
    rec('PASS', 'llms.txt summary', 'present');
  }

  const rel = [...r.body.matchAll(/\]\((?!https?:)([^)]+)\)/g)].map(m => m[1]);
  if (rel.length) {
    rec('FAIL', 'llms.txt absolute URLs',
      `${rel.length} relative link(s), e.g. "${rel[0]}". The file is fetched with no ` +
      `context — relative paths resolve to nothing.`);
  } else {
    rec('PASS', 'llms.txt absolute URLs', 'all links absolute');
  }
}

/* ---------------- 3. every link in llms.txt is alive ---------------- */

async function checkLinks() {
  if (!rootBody) return;
  const urls = [...new Set([...rootBody.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(m => m[1]))];

  if (!urls.length) {
    // Two very different situations produce zero markdown links, and calling
    // both a problem would make this gate untrustworthy:
    //   - a stub file with nothing in it            -> real defect
    //   - a long-form llms.txt that IS the content  -> a valid style
    if (rootBody.length > 2000) {
      rec('SKIP', 'llms.txt links',
        `no markdown link list, but the file is ${(rootBody.length / 1024).toFixed(0)}KB of prose ` +
        `— this is the long-form style where the file carries the content itself. Nothing to check.`);
    } else {
      rec('WARN', 'llms.txt links',
        `no links and only ${rootBody.length}B of content — this file is a stub.`);
    }
    return;
  }

  let dead = [];
  // Three at a time defeats the point of --gap: the sleep lives inside fetchAs,
  // so a 3-wide batch still puts three requests on the wire per interval, and a
  // host's budget is cumulative over the run rather than instantaneous. Seen in
  // the wild: 21/21 links reported 429 at --gap 2500, while the same 21 fetched
  // one at a time all returned 200. Serialise whenever a gap has been set.
  const CONC = GAP_MS >= 1000 ? 1 : 3;
  for (let i = 0; i < urls.length; i += CONC) {
    const batch = urls.slice(i, i + CONC);
    const out = await Promise.all(batch.map(async u => {
      const r = await fetchAs(u, UA, 12000);
      // Soft-404 check: some hosts return 200 with an error page. A body
      // under ~500 bytes on a content URL is the usual tell.
      const soft = r.status === 200 && r.body.length < 500;
      return { u, status: r.status, soft, len: r.body.length };
    }));
    dead.push(...out.filter(x => x.status !== 200 || x.soft));
  }

  if (dead.length) {
    rec('FAIL', 'llms.txt link liveness',
      `${dead.length}/${urls.length} bad:\n` +
      dead.slice(0, 8).map(d => `           ${d.soft ? `200 but only ${d.len}B (soft-404?)` : d.status}  ${d.u}`).join('\n'));
  } else {
    rec('PASS', 'llms.txt link liveness', `${urls.length}/${urls.length} return 200`);
  }
}

/* ---------------- 4. per-language summary must differ ---------------- */

async function checkLanguages() {
  if (!rootBody) return;
  // Match BOTH forms. Cross-links are just as often written as bare URLs in
  // the summary as in a markdown "## Languages" list, and only recognising
  // the markdown form reports a correctly-linked site as broken.
  const seenUrl = new Set();
  const langUrls = [];
  for (const m of rootBody.matchAll(/(https?:\/\/[^\s)>"']*?\/([a-z]{2}(?:-[A-Z]{2})?)\/llms\.txt)/g)) {
    if (seenUrl.has(m[1])) continue;
    seenUrl.add(m[1]);
    langUrls.push({ url: m[1], code: m[2] });
  }

  if (!langUrls.length) {
    // Careful: absence of links is NOT proof of a monolingual site. It equally
    // means a multilingual site whose per-language files exist but are
    // unreachable from the root — which is the more damaging of the two.
    rec('SKIP', 'language summaries',
      'no /{lang}/llms.txt links in the root file. Correct for a monolingual site — ' +
      'but if this site does publish other languages, those files are undiscoverable ' +
      'and need a "## Languages" block here.');
    return;
  }

  const summaryOf = body => (body.match(/^>\s*(.+)$/m) || [, ''])[1].trim();
  const seen = new Map();
  seen.set(summaryOf(rootBody), 'root');

  const dupes = [];
  for (const { url, code } of langUrls) {
    const r = await fetchAs(url);
    if (r.status !== 200) { rec('FAIL', `language file: ${code}`, `HTTP ${r.status} at ${url}`); continue; }
    const s = summaryOf(r.body);
    if (!s) { rec('FAIL', `language file: ${code}`, 'no summary blockquote'); continue; }
    if (seen.has(s)) dupes.push(`${code} has the same summary as ${seen.get(s)}`);
    else seen.set(s, code);
  }

  if (dupes.length) {
    rec('FAIL', 'language summaries',
      `identical summary text across languages — the body was never translated:\n` +
      dupes.map(d => `           ${d}`).join('\n') +
      `\n           (Shared boilerplate hides this. Comparing titles would have passed.)`);
  } else {
    rec('PASS', 'language summaries', `${seen.size} distinct summaries across ${seen.size} files`);
  }
}

/* ---------------- 5. robots.txt ---------------- */

async function checkRobots() {
  const r = await fetchAs(`${BASE}/robots.txt`);
  if (r.status !== 200) { rec('WARN', 'robots.txt', `HTTP ${r.status}`); return; }

  const blocked = [];
  const lines = r.body.split(/\r?\n/);
  let current = [];
  for (const line of lines) {
    const ua = line.match(/^\s*User-agent:\s*(.+)$/i);
    if (ua) { current.push(ua[1].trim()); continue; }
    const dis = line.match(/^\s*Disallow:\s*(.*)$/i);
    if (dis && dis[1].trim() === '/') {
      for (const u of current) {
        if (/GPTBot|OAI-SearchBot|PerplexityBot|ClaudeBot|Google-Extended|anthropic|bingbot|\*/i.test(u)) {
          blocked.push(u);
        }
      }
    }
    if (dis || /^\s*Allow:/i.test(line)) { /* keep group */ } else if (line.trim() === '') current = [];
  }

  if (blocked.length) {
    rec('FAIL', 'robots.txt AI bots',
      `Disallow: / applies to: ${[...new Set(blocked)].join(', ')} — those platforms cannot cite you.`);
  } else {
    rec('PASS', 'robots.txt AI bots', 'no blanket disallow on answer-engine bots');
  }

  if (/sitemap:/i.test(r.body)) rec('PASS', 'robots.txt sitemap', 'declared');
  else rec('WARN', 'robots.txt sitemap', 'no Sitemap: line — still the primary discovery mechanism');
}

/* ---------------- 6. homepage is readable without JS ---------------- */

async function checkHomepageHtml() {
  const r = await fetchAs(BASE + '/');
  if (r.rateLimited) {
    rec('WARN', 'homepage',
      `HTTP ${r.status} after a retry — rate limited. Almost certainly this script's ` +
      `own request volume, not a real block. Re-run on its own to confirm.`);
    return;
  }
  if (r.status !== 200) { rec('FAIL', 'homepage', `HTTP ${r.status}`); return; }

  // Strip tags, see how much actual text survives.
  const text = r.body
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length < 400) {
    rec('FAIL', 'homepage text in raw HTML',
      `only ${text.length} chars of text before JavaScript runs. Most AI fetchers do not ` +
      `execute JS — your content effectively does not exist to them.`);
  } else {
    rec('PASS', 'homepage text in raw HTML', `${text.length} chars server-rendered`);
  }

  if (/application\/ld\+json/i.test(r.body)) {
    const blocks = [...r.body.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
    let bad = 0, types = new Set();
    for (const b of blocks) {
      try {
        const j = JSON.parse(b[1]);
        const nodes = j['@graph'] || [j];
        for (const n of [].concat(nodes)) if (n['@type']) types.add(n['@type']);
      } catch { bad++; }
    }
    if (bad) rec('FAIL', 'JSON-LD', `${bad} block(s) failed to parse`);
    else rec('PASS', 'JSON-LD', `valid — ${[...types].join(', ') || 'no @type found'}`);
    if (!/Organization|LocalBusiness/i.test([...types].join(','))) {
      rec('WARN', 'JSON-LD Organization',
        'no Organization/LocalBusiness node — this is what carries the sameAs entity chain');
    }
  } else {
    rec('FAIL', 'JSON-LD', 'no structured data on the homepage');
  }
}

/* ---------------- run ---------------- */

console.log(`\n  Gating live site: ${BASE}`);
console.log(`  ${'='.repeat(64)}\n`);

await checkBotAccess();
await checkLlms();
await checkLinks();
await checkLanguages();
await checkRobots();
await checkHomepageHtml();

const COLOR = { PASS: '  ok  ', FAIL: ' FAIL ', WARN: ' warn ', SKIP: ' skip ' };
for (const r of results) {
  console.log(`  [${COLOR[r.level]}] ${r.name}`);
  console.log(`           ${r.detail}`);
}

const fails = results.filter(r => r.level === 'FAIL').length;
const warns = results.filter(r => r.level === 'WARN').length;
console.log(`\n  ${results.filter(r => r.level === 'PASS').length} passed, ${warns} warning(s), ${fails} failure(s).\n`);

process.exit(fails > 0 || (STRICT && warns > 0) ? 1 : 0);
