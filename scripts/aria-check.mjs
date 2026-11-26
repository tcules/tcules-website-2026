#!/usr/bin/env node
/**
 * Assert that every ARIA idref in the RENDERED output points at an element that exists.
 *
 * This is the one defect class in this repo that survives every other check. A rehearsal build of
 * a spec'd component shipped 95 dangling `aria-controls` on one specimen page — the panel was
 * conditionally rendered, the attribute was not — and `lint`, `typecheck`, `tokens:check` and
 * `next build` were all clean. A broken ARIA graph is invisible to a type system (the attribute
 * takes any string), invisible to a grep (the id is computed), and invisible in a browser unless
 * you are driving a screen reader.
 *
 * `SiteNav` already answers it correctly and is the precedent to copy:
 *
 *     aria-controls={isOpen ? panelId(item.key) : undefined}
 *
 * The attribute exists only while its target does. Pointing an idref at an element that is not in
 * the DOM is worse than omitting it: a screen reader announces a relationship and then finds
 * nothing at the other end of it.
 *
 * Reads the prerendered HTML under .next/server/app, so it needs a build first:
 *
 *     npm run build && npm run aria:check
 *
 * Deliberately NOT part of `npm run verify` — verify must stay fast and build-free. Run it before
 * shipping anything interactive.
 */
import { readFileSync } from 'node:fs';

import { prerenderedPages } from './prerendered-floor.mjs';

const IDREF_ATTRS = ['aria-controls', 'aria-labelledby', 'aria-describedby', 'aria-owns', 'for'];

/* Fails below a floor, not only on zero: a build that prerenders almost nothing leaves this check
   almost nothing to read (prerendered-floor.mjs). */
const files = prerenderedPages('.next/server/app', 'aria:check');

const problems = [];
let refs = 0;

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const allIds = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const ids = new Set(allIds);

  /* A DUPLICATED id is the subtler half of the same defect: every idref naming it still "resolves",
     and points at whichever element the browser found first — so the label of field 3 can end up
     describing field 1. A specimen page rendering 77 instances of one control is exactly where an
     id built from a fixed string instead of a per-instance one shows up. */
  const seen = new Set();
  for (const id of allIds) {
    if (seen.has(id)) {
      problems.push(`${file}  id="${id}" appears more than once — an idref naming it resolves to whichever came first`);
    }
    seen.add(id);
  }

  for (const attr of IDREF_ATTRS) {
    for (const m of html.matchAll(new RegExp(`\\s${attr}="([^"]+)"`, 'g'))) {
      /* An idref list is space-separated, and every token in it has to resolve. */
      for (const target of m[1].trim().split(/\s+/)) {
        if (!target) continue;
        refs++;
        if (!ids.has(target)) {
          problems.push(`${file}  ${attr}="${target}" names an id that nothing in the page carries`);
        }
      }
    }
  }
}

/* One page can repeat the same broken pair dozens of times — a specimen renders every variant — so
   report the distinct pairs and the count, or the output buries the finding in its own repetition. */
const distinct = [...new Set(problems)];

console.log(`aria:check — ${files.length} prerendered pages, ${refs} idrefs followed`);

if (distinct.length) {
  console.error(`\n${distinct.length} distinct dangling reference(s), ${problems.length} total:\n`);
  for (const p of distinct) console.error(`  ${p}`);
  console.error(
    '\nEmit the attribute only while its target is rendered — see SiteNav:\n' +
      '  aria-controls={isOpen ? panelId(item.key) : undefined}',
  );
  process.exit(1);
}

console.log('every ARIA idref resolves to an element on its own page');
