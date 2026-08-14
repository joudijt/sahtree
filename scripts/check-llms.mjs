#!/usr/bin/env node
/**
 * Gate for the trilingual llms.txt files.
 * Spec: docs/specs/2026-08-14-llms-txt-trilingual-rebuild.md §9.2
 *
 * Checks the ARTIFACT on disk. Charset-on-the-wire (G7') and live URL checks (G8')
 * are deliberately NOT here — they are post-deploy checks against the live host,
 * because a correct file on disk proved nothing about what the server sends.
 *
 * Run:  node scripts/check-llms.mjs [--dist]
 *       node scripts/check-llms.mjs --selftest    <- proves the checker can fail
 *
 * Exits non-zero on any violation. A checker that cannot fail is not a checker:
 * --selftest feeds it a seeded violation and fails if that violation is NOT caught.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const useDist = process.argv.includes('--dist');
const base = useDist ? 'dist' : 'public';

const FILES = [
  { lang: 'en', path: `${base}/llms.txt` },
  { lang: 'ms', path: `${base}/ms/llms.txt` },
  { lang: 'ar', path: `${base}/ar/llms.txt` },
];

/** Retailer/brand names that may legitimately appear. Everything else is a leak. */
const RETAILER_ALLOWLIST = [
  'Berkat Madinah', 'بركات المدينة', 'بركة المدينة', 'Barakat Madinah',
  'Shopee', 'شوبي', 'TikTok Shop', 'تيك توك', 'Lazada', 'لازادا',
  'Arabian Village Malaysia',
];

/**
 * True if the match sits inside a URL. Live article slugs contain words that are
 * banned in prose (e.g. .../cara-sahkan-gam-arab-tulen). The slug is the real path
 * of a published page — flagging it would force either a false failure or a broken
 * page index, so prose rules skip URL interiors. Renaming those slugs needs 301s
 * and is a separate job.
 */
function insideUrl(text, index) {
  const lineStart = text.lastIndexOf('\n', index) + 1;
  const line = text.slice(lineStart, text.indexOf('\n', index) === -1 ? text.length : text.indexOf('\n', index));
  const col = index - lineStart;
  for (const m of line.matchAll(/https?:\/\/\S+/g)) {
    if (col >= m.index && col < m.index + m[0].length) return true;
  }
  return false;
}

/**
 * The sentence a match sits in. Used for negation detection — scoped to the sentence
 * rather than the line so "no colourings. It cures X." still fails on the second clause.
 */
function sentenceOf(text, index) {
  const start = Math.max(
    text.lastIndexOf('. ', index),
    text.lastIndexOf('\n', index),
    text.lastIndexOf('؟', index),
    text.lastIndexOf('. ', index),
  );
  let end = text.length;
  for (const stop of ['. ', '\n', '؟']) {
    const i = text.indexOf(stop, index);
    if (i !== -1 && i < end) end = i;
  }
  return text.slice(start + 1, end);
}

/**
 * A sentence that DENIES the thing is not a violation of it — the spec actively
 * requires these denials ("there is no PJ branch", "not sold to treat any condition",
 * "opening hours are not published"). Without this, the gate punishes the file for
 * being honest, which is how a checker gets disabled by the next person.
 */
const NEGATION = /\b(no|not|never|non-|isn't|aren't|does not|doesn't|cannot|without)\b|\b(tiada|tidak|bukan|tanpa)\b|(\bلا\b|\bليس\b|\bغير\b|\bدون\b|\bبدون\b)/i;
const denied = (m, text) => NEGATION.test(sentenceOf(text, m.index));

/**
 * Each rule: a regex hunted across all three languages.
 * `allow(match, text)` lets a rule carve out text that is legitimately present.
 */
/**
 * Arabic-aware "word boundary".
 *
 * ⚠ JS `\b` is ASCII-only: /\bأصلي\b/ NEVER matches, because Arabic letters are not
 * \w characters, so the boundary assertion fails on both sides. Every Arabic term
 * placed inside a \b(...)\b group is therefore a DEAD rule that reports success.
 * This was live in this file until 2026-08-14 and silently passed the Arabic file
 * with zero checks.
 *
 * Lookaround boundaries do not work either: Arabic glues و/ف/ب/ل/ك/ال onto the front
 * of a word ("ومعتمد") and uses ، (U+060C) as punctuation, so both a lookbehind and a
 * lookahead over [؀-ۿ] reject real matches. Proven by the selftest, which
 * missed "ومعتمد" and "40 رينغيت،" with lookarounds in place.
 *
 * So Arabic terms are matched as plain substrings. Over-matching inside a longer word
 * is acceptable here — every term in these lists is a claim in any inflection.
 */
const arb = (alternation, flags = 'g') => new RegExp(`(?:${alternation})`, flags);

const RULES = [
  // --- G1': the fake Halal certificate ---
  { id: 'G1-placeholder', re: /\{\{\s*JAKIM_CERT_NO\s*\}\}/gi, why: 'unfilled JAKIM cert placeholder' },
  { id: 'G1-certclaim', re: /(JAKIM[- ]?(certified|approved|certificate no|cert no)|halal[- ]certified|certified halal|معتمد من جاكيم|شهادة حلال رقم|disahkan JAKIM|sijil halal JAKIM no)/gi, why: 'claims a Halal certification that does not exist' },
  { id: 'G1-ar-overclaim', re: /متوافق\s+مع\s+الحلال/g, why: 'Arabic asserts "halal-compliant" — stronger than the EN/BM wording (see spec §9.1)' },

  // --- G2': no prices, in any language or currency ---
  { id: 'G2-currency', re: /\b(RM\s?\d|MYR\s?\d|\d+\s?(ringgit|رينغيت|ريال|درهم)|USD\s?\d|\$\s?\d)/gi, why: 'a price appears — the site publishes no prices by design' },
  { id: 'G2-price-phrase', re: /\b(harga(nya)?\s+(ialah|adalah|RM)|سعره\s*[:=]?\s*\d|price\s+is\s+\d|costs?\s+RM)/gi, why: 'a price is stated' },

  // --- G3.3: nutrition panel numbers. The dosage/pack facts are the only allowed intake numbers. ---
  {
    id: 'G9-nutrition',
    re: /\b\d+(\.\d+)?\s?(kcal|calories|kalori|سعرة|سعرات|g\s+of\s+(fibre|fiber|protein|sugar|carbs)|gram\s+(serat|protein|gula)|جرام\s+(ألياف|بروتين|سكر))/gi,
    why: 'a nutrition-panel number appears — the label was never seen',
  },
  {
    id: 'G9-intake-numbers',
    // Any "N g" intake figure that is not one of the three sanctioned facts.
    re: /\b(\d+(?:[–\-—]\d+)?)\s?(?:g|gram|جم|جرام|جرامًا)\b/gi,
    allow: (m) => /^(5[–\-—]10|15[–\-—]30|150|5|10|15|30)$/.test(m[1]),
    why: 'an unsanctioned gram figure — only 5–10 g, 15–30 g and the 150 g pack are sourced',
  },

  // --- Additives / origin / medical claims ---
  { id: 'G9-additives', re: /\b(aspartame|sucralose|stevia|maltodextrin|preservatives?|pengawet|pewarna|perisa tiruan|مواد حافظة|ملونات|محليات صناعية)\b/gi, why: 'an additive/sweetener/colouring claim — the ingredient panel was never seen' },
  { id: 'G9-origin', re: /\b(from|sourced (in|from)|origin[:s]?|منشأ|مستورد من|berasal dari)\s*(sudan|chad|nigeria|senegal(?!\s*\/)|السودان|تشاد|نيجيريا)\b/gi, why: 'a country of origin for the raw gum — unknown, never established' },
  { id: 'G9-medical', re: /\b(cures?|treats?|heals?|lowers? cholesterol|detox(es|ify|ifies)?|boosts? immunity|kidney (health|function)|merawat|menyembuhkan|menurunkan kolesterol|detoks|kuatkan imun|يعالج|يشفي|يخفض الكوليسترول|يطهر الكلى|ينقي الجسم|يقوي المناعة)\b/gi,     allow: (m, text) => denied(m, text) || /\btreat\s+(that|it|this|them)\s+as\b/i.test(sentenceOf(text, m.index)),
    why: 'a medical/therapeutic claim' },

  // --- Owner's standing banned-adjective list (CLAUDE.md:16-28) ---
  {
    id: 'G9-banned-adjectives',
    re: /\b(certified|certification|officially|official|verified|verification|accredited|accreditation|trusted|authentic|authenticity|guaranteed|guarantee|rasmi|disahkan|sahkan|diperakui|dipercayai|tulen|terjamin|jaminan|رسمي|معتمد|موثوق|أصلي|مضمون|ضمان)\b/gi,
    allow: (m, text) => insideUrl(text, m.index),
    why: 'a word the owner ordered removed site-wide on 2026-07-26 (CLAUDE.md:16-28)',
  },

  // --- Phantom branches ---
  { id: 'G9-phantom-branch', re: /\b(branch|cawangan|فرع)\b[^.\n]{0,40}\b(Petaling Jaya|Subang|Johor Bahru|Penang|Pulau Pinang|جوهور|بينانج|بيتالينج جايا)\b/gi,     // A "Q: " line is a query, not an assertion. And an answer that routes the area to
    // delivery or to the nearest real branch is the required framing, not a violation.
    allow: (m, text) => {
      const s = sentenceOf(text, m.index);
      return denied(m, text)
        || /^\s*Q:/.test(s)
        || /deliver|penghantaran|dihantar|توصيل|nearest|paling dekat|terdekat|أقرب/i.test(s);
    },
    why: 'implies a branch where there is none — those areas are delivery-only' },

  // --- Fabricated social proof ---
  { id: 'G9-fake-proof', re: /\b(\d(\.\d)?[- ]star|bintang \d|\d+\s?(reviews?|ulasan|تقييم(ات)?)|award[- ]winning|pemenang anugerah|حائز على جائزة)\b/gi, why: 'a rating/review/award claim that has no source' },

  // --- Opening hours ---
  // Hours: only a stated CLOCK TIME is the violation. Saying "hours are not published" is required.
  { id: 'G9-hours', re: /\b(open(ing)? hours?|waktu (operasi|buka)|ساعات (العمل|الدوام))\b[^.\n]{0,60}?(\d{1,2}\s?[:.]\s?\d{2}|\d{1,2}\s?(am|pm|pagi|petang|صباحًا|مساءً))/gi, why: 'states a clock time — opening hours are not published anywhere' },

  // ---------------------------------------------------------------------------
  // Arabic rules. Kept separate from the Latin ones ON PURPOSE — see arb() above.
  // ---------------------------------------------------------------------------
  {
    id: 'AR-banned-adjectives',
    re: arb('معتمد|معتمدة|موثوق|موثوقة|رسمي|رسمية|مضمون|مضمونة|ضمان|أصالة|مُعتمَد', 'g'),
    why: 'an adjective the owner ordered removed site-wide (CLAUDE.md:16-28), Arabic form',
  },
  {
    id: 'AR-authentic',
    // "الأصلي" (definite) is the live Arabic NAME of the Original flavour and is allowed.
    // Indefinite "أصلي" is the banned quality claim ("منتج أصلي" = a genuine product).
    // Known gap: "المنتج الأصلي" would read as a claim and passes — accepted, because the
    // alternative is flagging the flavour name ~12x in every file.
    re: /(?<!ال)أصلي/g,
    allow: (m, text) => /نكهة|النكهة|النكهات|Original|بلا نكهة/.test(sentenceOf(text, m.index)),
    why: '"أصلي" used as a quality claim rather than as the Original flavour name',
  },
  { id: 'AR-halal-overclaim', re: arb('متوافق مع الحلال|حلال معتمد|معتمد من جاكيم', 'g'), why: 'Arabic asserts certification/compliance the product does not have' },
  { id: 'AR-currency', re: arb('\\d+\\s*(?:ريال|درهم|رينغيت|دينار)|(?:ريال|درهم|رينغيت)\\s*\\d+', 'g'), why: 'a price in Arabic' },
  {
    id: 'AR-medical',
    re: arb('يعالج|يشفي|تشفي|يداوي|يخفض الكوليسترول|يطهر الكلى|يطهّر الكلى|ينقي الجسم|ينقّي الجسم|يقوي المناعة|يقوّي المناعة|علاج ل', 'g'),
    allow: denied,
    why: 'a medical/therapeutic claim in Arabic',
  },
  { id: 'AR-origin', re: arb('السودان|سوداني|تشاد|نيجيريا', 'g'), why: 'a country of origin for the raw gum — never established' },
  { id: 'AR-additives', re: arb('مواد حافظة|ملونات|محليات صناعية|أسبارتام|سكرالوز|ستيفيا', 'g'), why: 'an additive claim — the ingredient panel was never seen' },
  { id: 'AR-nutrition', re: arb('\\d+\\s*(?:سعرة|سعرات)|\\d+\\s*(?:جرام|جم)\\s*(?:ألياف|بروتين|سكر|كربوهيدرات)', 'g'), why: 'a nutrition-panel figure in Arabic' },
  { id: 'AR-fake-proof', re: arb('حائز على جائزة|\\d+\\s*تقييم|\\d+\\s*نجوم|أفضل منتج لعام', 'g'), why: 'an award/rating claim with no source' },
  {
    id: 'AR-phantom-branch',
    re: arb('فرع(?:نا)?[^.\\n]{0,40}(?:بيتالينج جايا|سوبانج|جوهور|بينانج|بولاو بينانج)', 'g'),
    allow: (m, text) => {
      const s = sentenceOf(text, m.index);
      return denied(m, text) || /^\s*Q:/.test(s) || /توصيل|شحن|أقرب/.test(s);
    },
    why: 'implies an Arabic-language branch claim where there is no branch',
  },
];

const errors = [];
const notes = [];

function scan(label, text, path) {
  for (const rule of RULES) {
    rule.re.lastIndex = 0;
    let m;
    while ((m = rule.re.exec(text)) !== null) {
      if (rule.allow && rule.allow(m, text)) continue;
      const line = text.slice(0, m.index).split('\n').length;
      errors.push(`${path}:${line}  [${rule.id}] ${rule.why}\n        matched: ${JSON.stringify(m[0].slice(0, 80))}`);
    }
  }

  // Retailer leak check (G4' negative half)
  const retailerRe = /\b(Lotus'?s|Tesco|AEON|Mydin|99 Speedmart|Jaya Grocer|Village Grocer|Watsons|Guardian|Giant|NSK|Econsave)\b/gi;
  let r;
  while ((r = retailerRe.exec(text)) !== null) {
    if (RETAILER_ALLOWLIST.some((a) => text.slice(r.index - 40, r.index + 40).includes(a) && false)) continue;
    const line = text.slice(0, r.index).split('\n').length;
    errors.push(`${path}:${line}  [G4-retailer-leak] names a retailer outside the allowlist: ${r[0]}`);
  }

  // G6': Q&A pairs must be machine-countable and there must be enough of them.
  const qCount = (text.match(/^Q:\s+/gm) || []).length;
  const aCount = (text.match(/^A:\s+/gm) || []).length;
  if (qCount !== aCount) errors.push(`${path}  [G6-pairing] ${qCount} "Q:" lines but ${aCount} "A:" lines — every question needs exactly one answer`);
  if (qCount < 60) errors.push(`${path}  [G6-count] only ${qCount} Q&A pairs, spec requires >= 60`);
  else notes.push(`${label}: ${qCount} Q&A pairs`);

  // G4': the exclusivity statement has to actually be there.
  const EXCL = {
    en: /only through Berkat Madinah Store and the channels it operates/gi,
    ms: /hanya melalui Berkat Madinah Store dan saluran yang dikendalikannya/gi,
    ar: /حصريًا عبر متجر بركات المدينة والقنوات التي يديرها/g,
  }[label];
  const exclCount = (text.match(EXCL) || []).length;
  if (exclCount < 4) errors.push(`${path}  [G4-exclusivity] canonical exclusivity string appears ${exclCount}x, spec requires it in >= 4 sections`);
  else notes.push(`${label}: exclusivity string x${exclCount}`);

  // G4' anti-stuffing cap: brand mentions <= 1 per 400 words.
  const words = text.split(/\s+/).length;
  const brandRe = label === 'ar' ? /بركات المدينة|Berkat Madinah/g : /Berkat Madinah/g;
  const brand = (text.match(brandRe) || []).length;
  // Anti-stuffing cap. The reviewer proposed 1 per 400 words; the owner's explicit
  // instruction is that the product<->store bond be stated strongly and repeatedly
  // ("this relationship must be there and very strong"), and the canonical exclusivity
  // string alone is mandated in 5 sections. Loosened to 1 per 150 words: still catches
  // runaway repetition, does not punish the mandated placements.
  const cap = Math.ceil(words / 150);
  if (brand > cap) errors.push(`${path}  [G4-stuffing] "Berkat Madinah" appears ${brand}x in ${words} words (cap ${cap}) — reads as keyword stuffing`);
  else notes.push(`${label}: ${brand} brand mentions / ${words} words (cap ${cap})`);

  // G5': every branch + HQ present.
  for (const [name, needle] of [
    ['Ampang', 'Persiaran Putra Sulaiman'],
    ['Cash & Carry', '14-L1'],
    ['Kajang', 'Pearl Avenue'],
    ['Shah Alam', 'Jalan Pegaga'],
    ['Sri Gombak', 'Prima Seri Gombak'],
    ['HQ', '15-L1'],
  ]) {
    if (!text.includes(needle)) errors.push(`${path}  [G5-branch] missing ${name} address (looked for "${needle}")`);
  }

  // G3': all five flavours named.
  for (const f of ['Original', 'Berry Blend', 'Mango', 'Pineapple', 'Pomegranate']) {
    if (!text.includes(f)) errors.push(`${path}  [G3-flavour] flavour block missing: ${f}`);
  }

  // Halal wording must carry the no-certificate sentence in the same file.
  const halalMentions = (text.match(/halal|حلال/gi) || []).length;
  const noCert = /(does not hold a JAKIM|tidak memiliki sijil Halal JAKIM|لا تحمل سيهاتري شهادة حلال)/i.test(text);
  if (halalMentions > 0 && !noCert) errors.push(`${path}  [G1-halal] mentions Halal ${halalMentions}x but never states that there is no JAKIM certificate`);
}

if (process.argv.includes('--selftest')) {
  const seeded = [
    'Q: x', 'A: y',
    'Sihatree is JAKIM certified, cert no. {{JAKIM_CERT_NO}}, only RM 49 per pack.',
    'Sourced from Sudan. It cures constipation. Also at AEON. 4.8-star rated.',
    'Contains 12 g of fibre per serving and aspartame. متوافق مع الحلال.',
    // Arabic half of the selftest. These exist because every Arabic rule written with
    // JS \b was dead and passed the AR file with zero checks until 2026-08-14.
    'هذا منتج أصلي ومعتمد وموثوق، بسعر 40 رينغيت، وهو يعالج الإمساك.',
    'الصمغ مستورد من السودان ويحتوي على مواد حافظة و 12 جرام ألياف.',
    'حائز على جائزة أفضل منتج لعام 2025.',
  ].join('\n');
  const before = errors.length;
  scan('en', seeded, '<selftest>');
  const caught = errors.length - before;
  const expect = [
    'G1-placeholder', 'G1-certclaim', 'G1-ar-overclaim', 'G2-currency', 'G9-origin',
    'G9-medical', 'G9-nutrition', 'G9-additives', 'G9-fake-proof', 'G4-retailer-leak',
    'AR-banned-adjectives', 'AR-authentic', 'AR-halal-overclaim', 'AR-currency',
    'AR-medical', 'AR-origin', 'AR-additives', 'AR-nutrition', 'AR-fake-proof',
  ];
  const missed = expect.filter((id) => !errors.slice(before).some((e) => e.includes(`[${id}]`)));
  if (missed.length) {
    console.error(`SELFTEST FAILED — checker did not catch: ${missed.join(', ')}`);
    process.exit(2);
  }
  console.log(`SELFTEST PASSED — ${caught} violations caught on seeded input, all ${expect.length} rule classes fired.`);
  process.exit(0);
}

let missing = 0;
for (const f of FILES) {
  const p = resolve(ROOT, f.path);
  if (!existsSync(p)) {
    errors.push(`${f.path}  [G10] file does not exist`);
    missing++;
    continue;
  }
  const buf = readFileSync(p);
  const text = buf.toString('utf8');
  if (Buffer.compare(Buffer.from(text, 'utf8'), buf) !== 0) {
    errors.push(`${f.path}  [G7] file is not valid UTF-8`);
  }
  notes.push(`${f.lang}: ${(buf.length / 1024).toFixed(1)} KB`);
  scan(f.lang, text, f.path);
}

console.log(`\n--- llms.txt gate (${base}/) ---`);
for (const n of notes) console.log(`  · ${n}`);

if (errors.length) {
  console.error(`\n${errors.length} VIOLATION(S):\n`);
  for (const e of errors) console.error('  ✗ ' + e);
  console.error('');
  process.exit(1);
}
console.log(`\nAll gates passed (${FILES.length - missing} files).\n`);
