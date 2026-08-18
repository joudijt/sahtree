#!/usr/bin/env node
/**
 * surfaces.mjs — regenerates the AI-visibility surfaces that live in public/.
 *
 * Runs as `prebuild`, not postbuild: Vite copies public/ into dist/ at
 * renderStart, so anything written after the Vite build exits 0 while shipping
 * nothing.
 *
 * What it does:
 *   1. runs the kit build into .beacon-out/ (git-ignored staging)
 *   2. copies ONLY about.md, faq.md and AGENTS.md into public/
 *   3. rebuilds public/llms-full.txt from the three hand-written briefs
 *
 * What it deliberately does NOT do: overwrite public/llms.txt, public/ms/llms.txt
 * or public/ar/llms.txt. Those three are hand-written natively per language
 * (66/67/69 Q&A, no shared body text) and are far richer than anything
 * AI-FACTS.yml can generate. The kit's own llms.txt output is written into
 * .beacon-out/ and thrown away.
 *
 * Run:  node scripts/ai/surfaces.mjs
 */

import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const STAGE = '.beacon-out';
const ADOPT = ['about.md', 'faq.md', 'AGENTS.md'];

execFileSync(process.execPath, ['scripts/ai/build.mjs', '--out', STAGE], { stdio: 'inherit' });

for (const f of ADOPT) {
  const src = join(STAGE, f);
  if (!existsSync(src)) {
    console.error(`  MISSING  ${src} — a fact block in AI-FACTS.yml went blank`);
    process.exit(1);
  }
  copyFileSync(src, join('public', f));
  console.log(`  adopted   public/${f}`);
}

execFileSync(process.execPath, ['scripts/ai/llms-full.mjs'], { stdio: 'inherit' });
