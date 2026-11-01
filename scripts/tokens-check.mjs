#!/usr/bin/env node
/**
 * Assert that every custom property a stylesheet READS is actually DEFINED — either in the
 * token layer, or locally in the same file. Also flag raw hex colours outside the token layer.
 *
 * This exists because the token system's first rule ("if the value you need has no token, add
 * the token") has a silent failure mode: `var(--lay-gap-xl)` where the real token is
 * `--lay-gap-2xl` does not error — it computes to nothing. A collapsed gap or an unpainted
 * ground then looks like a layout bug and gets debugged as one. A plausible-but-wrong token
 * name is exactly the mistake a design tool suggesting names will make.
 */
import { readFileSync, globSync } from 'node:fs';

const TOKEN_GLOB = 'src/styles/tokens/**/*.css';
const CONSUMER_GLOBS = ['src/**/*.module.css', 'src/app/globals.css', 'src/styles/reset.css'];

/**
 * Custom properties set from JavaScript, via an inline style object, so no stylesheet declares
 * them. Keep this list SHORT and justified — it is a hole in the check, and every entry has to
 * name the file that writes it.
 *
 * --tmpl-{base,md,lg,xl}  written by columnsToVars() in src/components/Layout/Layout.tsx.
 *   Layout's column template cannot be a class: it takes an arbitrary count or fr ratio, so
 *   there is no finite set of classes to enumerate. Each is pinned to `initial` when unused so
 *   the var() fallback chain resolves to a single track rather than inheriting an ancestor's.
 *
 * --cmark-{src,ratio,ratio-root,correction,optical}  written by src/components/ClientMark/ClientMark.tsx.
 *   Per-asset data: the client's SVG URL and its intrinsic ratio are continuous values from the
 *   CMS, so they cannot be classes. √ratio is computed there rather than with CSS sqrt(), which
 *   is below Next 16's Chrome 111 floor.
 *
 * --media-focus  written by src/components/Media/Media.tsx from the record's focal point (or the
 *   placement's `focus` override). Per-asset and continuous — any point 0 to 1 on two axes — so it
 *   cannot be a class. Media.module.css also declares a local default on .fill and .crop (the
 *   stylesheet's anchor where the record names none), but the inline write is the source, and it is
 *   listed here so the check does not depend on that default happening to exist.
 *
 * --toc-marker-offset, --toc-marker-size  written by src/patterns/TableOfContents/TableOfContents.tsx
 *   from the current row's offsetTop and offsetHeight, so its one marker can slide. The token layer
 *   declares their rests, but the inline write is the source.
 */
const JS_INJECTED = new Set([
  '--tmpl-base',
  '--tmpl-md',
  '--tmpl-lg',
  '--tmpl-xl',
  '--view-base', // Layout scroll mode's per-view counts (viewVars in Layout.tsx)
  '--view-md',
  '--view-lg',
  '--view-xl',
  '--toc-marker-offset', // TableOfContents: the current row's box, measured in TableOfContents.tsx
  '--toc-marker-size',
  '--slider-count', // Slider: the slide count, and the scroll progress it writes on scroll
  '--slider-progress',
  '--slider-bleed', // Slider `bleed`: the measured distance from its end edge to the viewport's
  '--blockcardset-count', // BlockCardSet: the card count, for the phone scroll row's rail thumb
  '--cmark-src',
  '--cmark-ratio',
  '--cmark-ratio-root',
  '--cmark-correction',
  '--cmark-optical',
  '--media-focus',
]);

const read = (f) => readFileSync(f, 'utf8');
const strip = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');
/* Same, but keeps the line count — a comment becomes blank lines rather than disappearing. Any
   check that reports `file:line` from a stripped stream needs this one, or it points at the wrong
   line: a 20-line header comment shifts every finding below it by 20. */
const stripKeepLines = (css) =>
  css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
const definedIn = (css) =>
  new Set([...strip(css).matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
const usedIn = (css) => [...strip(css).matchAll(/var\(\s*(--[\w-]+)/g)].map((m) => m[1]);
const lineOf = (css, needle) => css.slice(0, css.indexOf(needle)).split('\n').length;

const tokenFiles = globSync(TOKEN_GLOB);
if (tokenFiles.length === 0) {
  console.error(`FAIL  no token files matched ${TOKEN_GLOB}`);
  process.exit(1);
}

const tokens = new Set();
for (const f of tokenFiles) for (const t of definedIn(read(f))) tokens.add(t);

/**
 * REGISTRATION. A component layer that tokens/index.css never @imports does not load in the
 * browser — and is INVISIBLE TO THIS CHECK, because definitions are collected by globbing the
 * folder above. So every var() that reads it resolves here and resolves to nothing at runtime,
 * lint and tsc see nothing, and the symptom is an unpainted control that looks like a CSS bug.
 * Cascade order is the entire reason these files live in tokens/ rather than beside the
 * component; an unregistered file has no order at all.
 */
const entry = read('src/styles/tokens/index.css');
const unregistered = tokenFiles
  .filter((f) => f.includes('/components/'))
  .map((f) => f.slice(f.indexOf('components/')))
  .filter((rel) => !entry.includes(rel));

const consumers = [...new Set(CONSUMER_GLOBS.flatMap((g) => globSync(g)))]
  .filter((f) => !f.includes('/tokens/'))
  .sort();

const problems = [];

for (const rel of unregistered) {
  problems.push(
    `src/styles/tokens/index.css  never @imports ${rel}, so nothing in it loads — ` +
      `every var() that reads it resolves in this check and resolves to nothing in the browser`,
  );
}

for (const file of consumers) {
  const css = read(file);
  const local = definedIn(css);

  for (const v of new Set(usedIn(css))) {
    if (!tokens.has(v) && !local.has(v) && !JS_INJECTED.has(v)) {
      problems.push(
        `${file}:${lineOf(css, v)}  reads ${v}, which no token defines and this file does not declare`,
      );
    }
  }

  for (const hex of new Set(strip(css).match(/#[0-9a-fA-F]{3,8}\b/g) ?? [])) {
    problems.push(
      `${file}:${lineOf(css, hex)}  writes the literal colour ${hex} — colour belongs to the token layer`,
    );
  }

  /**
   * A raw distance, same argument as the literal colour above: the gap scale is the only answer
   * to "how far apart", and a 12px that is neither --gap-tight nor --gap-text is a decision
   * nobody made.
   *
   * Scoped to *.module.css deliberately. reset.css and globals.css are the SHELL, not components,
   * and both carry argued literals — reset.css's scroll-padding is shell geometry that lands an
   * anchor below a future sticky header, and it says so on the line above itself. Widening this
   * to the whole consumer set would fail the build on a value the repo deliberately defends.
   *
   * Comments are already stripped. An at-rule prelude is exempt: a breakpoint is a media QUERY,
   * not a distance, which is the whole point of the scale not shifting responsively. em-relative
   * sizes are not matched either — they scale with their context by design, as Prose's code span
   * does.
   */
  if (file.endsWith('.module.css')) {
    /* An at-rule PRELUDE is exempt — a breakpoint is a media query, not a distance, which is the
       whole point of the scale not shifting responsively. Two subtleties the obvious version gets
       wrong: a prelude can wrap across lines (`@media (min-width: 768px) and\n (max-width: …)`),
       and a whole at-rule can sit on one line, in which case the declarations after its `{` are
       NOT exempt and a 4px inside it would otherwise escape. So: track the prelude across lines,
       and on any at-rule line only skip up to the brace. */
    let inPrelude = false;
    stripKeepLines(css)
      .split('\n')
      .forEach((line, i) => {
        const opensAtRule = /^\s*@(media|supports|container)/.test(line);
        if (opensAtRule || inPrelude) {
          inPrelude = !line.includes('{');
          line = line.includes('{') ? line.slice(line.indexOf('{') + 1) : '';
        }
        const raw = line.match(/(?<![\w-])-?\d*\.?\d+(px|rem)\b/g);
        if (raw) {
          problems.push(
            `${file}:${i + 1}  writes the raw distance ${raw.join(', ')} — a distance comes from ` +
              `the gap scale, or from an optical correction in the token layer with a comment saying so`,
          );
        }
      });
  }
}

/**
 * SURFACE SELF-CONTAINMENT.
 *
 * Every surface block in a component layer must declare every surface-dependent token that
 * any other surface declares. A block carrying only deltas from paper is not self-contained:
 * nest that surface inside a non-paper one and it inherits the enclosing surface's values for
 * whatever it omitted. That produced white ink on a light ground at 1.13:1 before it was fixed,
 * and nothing in CSS complains — which is exactly why it is checked here.
 */
const SURFACES = ['paper', 'tint', 'ink', 'blue'];
const stripComments = strip;

/**
 * Drop at-rule BLOCKS entirely, braces and contents, before attributing declarations to surfaces.
 * The walker below is a flat sweep, so it would otherwise find a `[data-surface="ink"]` block
 * nested inside an `@media` and then report the other three surfaces as omitting whatever that
 * responsive override declares. No component layer uses `@media` today — by rule, the scale does
 * not shift responsively — but the failure would be three confident findings about nothing.
 */
const dropAtRuleBlocks = (css) => {
  let out = '';
  for (let i = 0; i < css.length; i++) {
    if (css[i] !== '@') {
      out += css[i];
      continue;
    }
    const open = css.indexOf('{', i);
    if (open === -1) {
      out += css.slice(i);
      break;
    }
    let depth = 0;
    let j = open;
    for (; j < css.length; j++) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}' && --depth === 0) break;
    }
    i = j;
  }
  return out;
};

for (const file of tokenFiles.filter((f) => f.includes('/components/'))) {
  const css = dropAtRuleBlocks(stripComments(read(file)));
  const perSurface = new Map(SURFACES.map((s) => [s, new Set()]));
  // Walk each top-level block and attribute its declarations to the surfaces in its selector.
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = m[1];
    const decls = [...m[2].matchAll(/(--[\w-]+)\s*:/g)].map((d) => d[1]);
    for (const s of SURFACES) {
      /* Either quote style. Prettier does not format CSS attribute selectors here, so a file
         written with single quotes would otherwise attribute NOTHING to any surface, leave the
         union empty, hit the `continue` below and pass silently — the check would still print
         its reassuring green line while enforcing nothing at all. */
      if (new RegExp(`\\[data-surface=['"]${s}['"]\\]`).test(selector)) {
        decls.forEach((d) => perSurface.get(s).add(d));
      }
    }
  }
  const union = new Set([...perSurface.values()].flatMap((v) => [...v]));
  if (union.size === 0) continue;
  for (const s of SURFACES) {
    const missing = [...union].filter((t) => !perSurface.get(s).has(t)).sort();
    if (missing.length) {
      problems.push(
        `${file}  surface "${s}" omits ${missing.length} token(s) another surface declares, ` +
          `so it inherits them from whatever encloses it: ${missing.join(', ')}`,
      );
    }
  }
}

/**
 * THE PERIDOT GATE (visual-direction § 4.4, 6 Oct 2026).
 *
 * On the website peridot has exactly two uses: `::selection` in globals.css, and the carried item
 * inside an illustration. Everything else it used to paint — a `<mark>` ground, a quote rule on
 * blue, an unused --sec-highlight pair — read as a highlighter, and the website does not highlight
 * text. So nothing outside primitives.css may READ the ramp:
 *   · every token file except primitives.css (whose declarations of the ramp stay), so a component
 *     layer cannot alias it — `--x-mark: var(--color-peridot-300)` is consumption;
 *   · every consumer stylesheet (*.module.css, globals.css, reset.css);
 *   · every .ts/.tsx under src/, so an inline style cannot route around the CSS check.
 * The exemptions are a declaration inside a rule whose selector is `::selection`, in globals.css, and
 * the sketch layer's ink block (flat drawings take peridot as their accent on ink, 31 Oct 2026).
 * Comments are stripped first: a comment that names peridot is not consumption. Illustration SVGs
 * are files in public/ and are not scanned, which is the exemption § 4.4 asks for.
 */
const PERIDOT = /var\(\s*--color-peridot-/;
const peridotFiles = [
  ...tokenFiles.filter((f) => !f.replaceAll('\\', '/').endsWith('/primitives.css')),
  ...consumers,
  ...globSync('src/**/*.{ts,tsx}'),
].sort();
for (const file of peridotFiles) {
  const isCss = file.endsWith('.css');
  /* Strip comments, keeping line numbers. TS/TSX also loses `//` line comments — a crude strip,
     whose only failure is missing a peridot var() written after a `//` inside a string. */
  let code = stripKeepLines(read(file));
  if (!isCss) code = code.replace(/(^|[^:'"`])\/\/[^\n]*/g, (m, pre) => pre);
  if (!PERIDOT.test(code)) continue;
  if (isCss) {
    for (const m of code.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      if (!PERIDOT.test(m[2])) continue;
      const selector = m[1].trim().replace(/\s+/g, ' ');
      /* globSync returns backslashes on Windows; compare in POSIX form. */
      if (file.replaceAll('\\', '/') === 'src/app/globals.css' && selector === '::selection') continue;
      /* The flat drawings' accent on ink (owner, 31 Oct 2026; decisions/2026-10-31-peridot-leads-flat-
         drawings-on-ink): the sketch layer's ink block only. */
      if (file.replaceAll('\\', '/') === 'src/styles/tokens/components/sketch.css' && selector.endsWith("[data-surface='ink']")) continue;
      const line = code.slice(0, m.index + m[0].search(PERIDOT)).split('\n').length;
      problems.push(
        `${file}:${line}  reads the peridot ramp in \`${selector}\` — peridot on the website is ` +
          `::selection (globals.css) and an illustration's carried item only (visual-direction § 4.4)`,
      );
    }
  } else {
    code.split('\n').forEach((l, i) => {
      if (PERIDOT.test(l)) {
        problems.push(
          `${file}:${i + 1}  reads the peridot ramp from script — peridot on the website is ` +
            `::selection (globals.css) and an illustration's carried item only (visual-direction § 4.4)`,
        );
      }
    });
  }
}

console.log(
  `tokens:check — ${tokens.size} tokens defined across ${tokenFiles.length} files, ` +
    `${consumers.length} consumer stylesheets checked`,
);

if (problems.length) {
  console.error(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}

console.log(
  'all custom properties resolve; every component layer is registered; no literal colours or raw distances outside the token layer; peridot read only by ::selection and the drawings on ink',
);
