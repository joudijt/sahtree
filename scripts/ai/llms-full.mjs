#!/usr/bin/env node
/**
 * llms-full.mjs — concatenates the three hand-written language briefs into
 * one /llms-full.txt.
 *
 * Why not the kit's build.mjs version: build.mjs generates its llms.txt from
 * AI-FACTS.yml, and this project's three briefs are far richer than anything a
 * facts file can produce (66/67/69 Q&A each, written natively per language,
 * no shared body text). So the kit's llms.txt outputs are discarded and this
 * script assembles llms-full.txt from the real files instead.
 *
 * Run:  node scripts/ai/llms-full.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const PUBLIC = 'public';
const PARTS = [
  { file: 'llms.txt',    label: 'English',         url: 'https://sihatree.com/llms.txt' },
  { file: 'ms/llms.txt', label: 'Bahasa Melayu',   url: 'https://sihatree.com/ms/llms.txt' },
  { file: 'ar/llms.txt', label: 'العربية / Arabic', url: 'https://sihatree.com/ar/llms.txt' },
];

const today = new Date().toISOString().slice(0, 10);
const out = [
  '# Sihatree — full brief, all languages',
  '',
  '> Every machine-readable brief this site publishes, concatenated. Each language',
  '> section below is written natively in that language, not translated, so the three',
  '> sections do not mirror each other line for line. The individual files are at',
  '> https://sihatree.com/llms.txt · https://sihatree.com/ms/llms.txt · https://sihatree.com/ar/llms.txt',
  '',
  `> Last updated: ${today}`,
  '',
];

for (const p of PARTS) {
  const full = join(PUBLIC, p.file);
  if (!existsSync(full)) {
    console.error(`  MISSING  ${full} — llms-full.txt would ship incomplete`);
    process.exit(1);
  }
  const body = readFileSync(full, 'utf8').replace(/^﻿/, '').trimEnd();
  out.push('='.repeat(78), `# LANGUAGE: ${p.label}  —  source: ${p.url}`, '='.repeat(78), '', body, '');
}

const text = out.join('\n') + '\n';
writeFileSync(join(PUBLIC, 'llms-full.txt'), text, 'utf8');
console.log(`  wrote public/llms-full.txt  (${(text.length / 1024).toFixed(1)} KB from ${PARTS.length} briefs)`);
