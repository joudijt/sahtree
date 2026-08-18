#!/usr/bin/env node
/**
 * coverage.mjs — what you filled in, what you left blank, and what each
 * blank actually costs. Never fails; this is a report, not a gate.
 *
 * Usage:  node scripts/coverage.mjs [--facts AI-FACTS.yml]
 */

import { loadFacts, coverage, REQUIRED } from '../../lib/facts.mjs';

const argv = process.argv.slice(2);
const i = argv.indexOf('--facts');
const FACTS_PATH = i !== -1 && argv[i + 1] ? argv[i + 1] : 'AI-FACTS.yml';

const { facts, missingRequired, error } = loadFacts(FACTS_PATH);

if (error) {
  console.error(`\n  ${FACTS_PATH} not found. Copy it from the kit into this project.\n`);
  process.exit(1);
}

const rows = coverage(facts);
const filled = rows.filter(r => r.present);
const blank = rows.filter(r => !r.present);
const blankRequired = blank.filter(r => r.required);
const blankOptional = blank.filter(r => !r.required);

const LAYER_NAME = {
  0: 'Entity definition',
  1: 'Access',
  2: 'Machine-readable files',
  3: 'Entity graph',
  4: 'Extractable answers',
  6: 'Freshness',
};

const pct = Math.round((filled.length / rows.length) * 100);

console.log(`\n  Coverage — ${FACTS_PATH}`);
console.log(`  ${'='.repeat(64)}`);
console.log(`  ${filled.length} of ${rows.length} fields answered  (${pct}%)\n`);

if (blankRequired.length) {
  console.log(`  BLOCKED — these three are the only hard requirements:\n`);
  for (const r of blankRequired) {
    console.log(`    x  ${r.path}`);
    console.log(`       ${r.cost}\n`);
  }
} else {
  console.log(`  All required fields answered. The build will run.\n`);
}

if (blankOptional.length) {
  console.log(`  Left blank — here is what each one costs:\n`);
  const byLayer = {};
  for (const r of blankOptional) (byLayer[r.layer] ??= []).push(r);
  for (const layer of Object.keys(byLayer).sort()) {
    console.log(`  Layer ${layer} — ${LAYER_NAME[layer] ?? ''}`);
    for (const r of byLayer[layer]) {
      const sev = /high impact|highest-value|biggest|notably|forfeit|strongest/i.test(r.cost) ? '!!' : '  ';
      console.log(`    ${sev} ${r.path}`);
      console.log(`       ${r.cost}`);
    }
    console.log('');
  }
  console.log(`  Lines marked !! are the ones worth going back for.`);
  console.log(`  Everything else degrades gracefully — the build skips it silently.\n`);
} else {
  console.log(`  Nothing left blank.\n`);
}

console.log(`  Next:  node scripts/build.mjs --out public\n`);
