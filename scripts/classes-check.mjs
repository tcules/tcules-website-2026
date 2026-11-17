#!/usr/bin/env node
/**
 * Assert that every CSS Module class a component READS is actually DEFINED.
 *
 * `styles.foo` where the module has no `.foo` is `undefined`, and `cx()` drops it —
 * `parts.filter(Boolean).join(' ')`. So the element renders with one fewer class, looks unstyled,
 * and NOTHING complains: not `tsc` (there is no typed-CSS-modules plugin, and adding one is a
 * fourth dependency), not `eslint`, not `tokens:check`, not the browser.
 *
 * This is not hypothetical and it is not rare. A rehearsal build of a spec'd component used
 * `s.label` and `s.sub` on a 491-line specimen page; neither existed in the specimen harness,
 * eighteen labels rendered unstyled, and all four checks passed green. The instruction "list the
 * classes before you use them" was then added to the build command in three places — and worked
 * the next time, on an agent who followed it. This script is what makes it hold for an agent who
 * does not.
 *
 * Only STATIC dot access is checked, and these forms pass unexamined:
 *   styles[size]          computed from a prop union — a deliberate pattern here (Button's sizes)
 *   styles['label']       bracket access with a literal
 *   const { a } = styles  destructuring
 *   const t = styles      an alias through a local variable
 * `tsc` cannot see any of them either, so the honest statement is that this closes the common case
 * and not the class. The uncommon ones are worth knowing when a rule mysteriously does not apply.
 *
 * What it does NOT do is fail open. An imported binding read as `X.key` that cannot be resolved to
 * a stylesheet is reported, because a checker that quietly stops checking is worse than no checker.
 */
import { readFileSync, globSync, existsSync, statSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';

const SOURCES = 'src/**/*.tsx';

const read = (f) => readFileSync(f, 'utf8');
/* Blank comments rather than deleting them, so a line number stays a line number. */
const stripCss = (css) => css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
const stripTs = (ts) =>
  ts.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')).replace(/\/\/[^\n]*/g, '');

/** Class names a stylesheet defines. `.a.b`, `.a:hover` and `.a > svg` all yield their own names. */
const classesIn = (css) =>
  new Set([...stripCss(css).matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]));

/**
 * Bindings that ARE accessed as `X.key` and are legitimately not stylesheets. Keep this short and
 * justified — same discipline as JS_INJECTED in tokens-check.mjs.
 */
const KNOWN_NON_SHEET = new Set([
  'LEDGER_BANDS', // A set of section IDs. Callers use Set.has to choose an arrangement.
]);

/** Which files a module re-exports a stylesheet through, name → sheet. Memoised per path. */
const exportCache = new Map();

function classesFor(path) {
  return { path, classes: classesIn(read(path)) };
}

/* Node's own resolution order. The bare candidate must be tested for being a FILE: `../_specimen`
   names a real directory, and returning it produces an EISDIR the moment anything reads it. */
const isFile = (p) => existsSync(p) && statSync(p).isFile();

function resolveModule(fromDir, spec) {
  return ['', '.tsx', '.ts', '/index.tsx', '/index.ts']
    .map((e) => resolvePath(fromDir, spec + e))
    .find(isFile);
}

/**
 * Every stylesheet binding a module exposes, following re-export chains to a depth of 4.
 *
 * One hop is not enough, and the reason is specific to this repo: every folder here has an
 * `index.ts` barrel, so `_specimen/` acquiring one would put the harness two hops from every design
 * route. A one-hop resolver would then silently stop checking the exact call sites that produced the
 * original bug, while still reporting success. A checker that fails open is worse than no checker,
 * because it is believed.
 */
function resolveExports(path, depth = 0) {
  if (depth > 4) return new Map();
  if (exportCache.has(path)) return exportCache.get(path);
  exportCache.set(path, new Map()); // cycle guard, replaced below
  const src = stripTs(read(path));
  const dir = dirname(path);
  const own = new Map();

  for (const m of src.matchAll(/import\s+(\w+)\s+from\s+['"]([^'"]+\.module\.css)['"]/g)) {
    const target = resolvePath(dir, m[2]);
    if (isFile(target)) own.set(m[1], classesFor(target));
  }
  /* Named imports from a local module, so a barrel can pass a sheet through. */
  for (const m of src.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"](\.[^'"]+)['"]/g)) {
    const target = resolveModule(dir, m[2]);
    if (!target) continue;
    const upstream = resolveExports(target, depth + 1);
    for (const raw of m[1].split(',')) {
      const [orig, local] = raw.split(/\s+as\s+/).map((x) => x.trim().replace(/^type\s+/, ''));
      if (upstream.has(orig)) own.set(local ?? orig, upstream.get(orig));
    }
  }
  /* `export * from './x'` and `export { a as b } from './x'` — the barrel forms. */
  for (const m of src.matchAll(/export\s+\*\s+from\s+['"](\.[^'"]+)['"]/g)) {
    const target = resolveModule(dir, m[1]);
    if (target) for (const [k, v] of resolveExports(target, depth + 1)) own.set(k, v);
  }
  for (const m of src.matchAll(/export\s*\{([^}]+)\}\s*from\s*['"](\.[^'"]+)['"]/g)) {
    const target = resolveModule(dir, m[2]);
    if (!target) continue;
    const upstream = resolveExports(target, depth + 1);
    for (const raw of m[1].split(',')) {
      const [orig, local] = raw.split(/\s+as\s+/).map((x) => x.trim().replace(/^type\s+/, ''));
      if (upstream.has(orig)) own.set(local ?? orig, upstream.get(orig));
    }
  }
  /* Local re-binding: `export { styles as specimenStyles }`. */
  const exported = new Map(own);
  for (const m of src.matchAll(/export\s*\{\s*(\w+)\s+as\s+(\w+)\s*\}/g)) {
    if (own.has(m[1])) exported.set(m[2], own.get(m[1]));
  }
  exportCache.set(path, exported);
  return exported;
}

/** The sheets visible INSIDE one file: its own imports, plus anything it pulls through a chain. */
function resolveSheets(file, src) {
  const sheets = new Map();
  const dir = dirname(file);
  for (const m of src.matchAll(/import\s+(\w+)\s+from\s+['"]([^'"]+\.module\.css)['"]/g)) {
    const target = resolvePath(dir, m[2]);
    if (isFile(target)) sheets.set(m[1], classesFor(target));
    else problems.push(`${file}  imports ${m[2]}, which does not exist`);
  }
  for (const m of src.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"](\.[^'"]+)['"]/g)) {
    const target = resolveModule(dir, m[2]);
    if (!target) continue;
    const upstream = resolveExports(target);
    for (const raw of m[1].split(',')) {
      const [orig, local] = raw.split(/\s+as\s+/).map((x) => x.trim().replace(/^type\s+/, ''));
      if (upstream.has(orig)) sheets.set(local ?? orig, upstream.get(orig));
    }
  }
  for (const m of src.matchAll(/export\s*\{\s*(\w+)\s+as\s+(\w+)\s*\}/g)) {
    if (sheets.has(m[1])) sheets.set(m[2], sheets.get(m[1]));
  }
  return sheets;
}

const problems = [];
let checked = 0;
let files = 0;

for (const file of globSync(SOURCES).sort()) {
  const src = stripTs(read(file));

  /* Every stylesheet this file can see, by the local name it was bound to — resolved TRANSITIVELY.
     See resolveExports() below for why the chain, not one hop. */
  const sheets = resolveSheets(file, src);

  /**
   * The fail-open trap, closed.
   *
   * An unresolved binding used as `X.key` is the dangerous case: it looks exactly like a stylesheet
   * read, and if we cannot resolve it we check NOTHING and still print green. In this codebase a
   * member access on a locally-imported binding is a styles object essentially always — components
   * are used as `<Component/>`, not `Component.x` — so an unresolvable one is reported rather than
   * skipped. If a legitimate non-stylesheet case ever appears, it belongs in KNOWN_NON_SHEET with a
   * reason, following the JS_INJECTED precedent in tokens-check.mjs.
   */
  for (const m of src.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"](\.[^'"]+)['"]/g)) {
    for (const raw of m[1].split(',')) {
      const local = (raw.split(/\s+as\s+/)[1] ?? raw.split(/\s+as\s+/)[0] ?? '').trim().replace(/^type\s+/, '');
      if (!local || sheets.has(local) || KNOWN_NON_SHEET.has(local)) continue;
      if (!new RegExp(`\\b${local}\\.[A-Za-z_]`).test(src)) continue;
      problems.push(
        `${file}  reads ${local}.<key> but ${local} could not be resolved to a stylesheet through ` +
          `${m[2]} — so nothing about those reads is verified. Add the hop this script cannot follow, ` +
          `or add ${local} to KNOWN_NON_SHEET with a reason.`,
      );
    }
  }

  if (sheets.size === 0) continue;
  files++;

  for (const [local, sheet] of sheets) {
    for (const m of src.matchAll(new RegExp(`\\b${local}\\.([A-Za-z_][\\w]*)\\b`, 'g'))) {
      const key = m[1];
      checked++;
      if (!sheet.classes.has(key)) {
        const line = src.slice(0, m.index).split('\n').length;
        problems.push(
          `${file}:${line}  reads ${local}.${key}, which ${sheet.path.replace(process.cwd() + '/', '')} does not define — ` +
            `it is undefined at run time, cx() drops it, and the element renders unstyled`,
        );
      }
    }
  }
}

console.log(`classes:check — ${checked} static class reads across ${files} files`);

if (problems.length) {
  console.error(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error('\nThe TSX is authoritative for the class list. Add the rule, or fix the name.');
  process.exit(1);
}

console.log('every statically-read CSS Module class is defined');
