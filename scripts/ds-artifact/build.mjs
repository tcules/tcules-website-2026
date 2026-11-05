#!/usr/bin/env node
/**
 * Build the Design System artifact's files from this repo. The repo is the source of truth
 * (owner, 20 Oct 2026): every path this script writes is overwritten on the next sync, whatever
 * was edited on the artifact page meanwhile.
 *
 *   node scripts/ds-artifact/build.mjs                 build .design-sync/out/ and its publish plan
 *   node scripts/ds-artifact/build.mjs --mark-published   record the last build as live
 *
 * What it writes, under .design-sync/out/project/ (the artifact's own `project/` tree):
 *
 *   components/bundle.js · bundle.css     every tier barrel on window.Tcules, the token layer and
 *                                         every CSS Module in one stylesheet
 *   components/lib/react.js · react-dom.js React 19, packed — the type's default is React 18
 *   components/index.d.ts                  the declarations, as documentation
 *   components/<Name>/README.md            the component's own doc comment + its props
 *   components/<Name>/<Name>.d.ts · spec.md
 *   components/<Name>/preview.html         its design/ SPECIMEN, compiled against window.Tcules —
 *                                         the proving ground is the preview, so there is no
 *                                         second set of hand-written stories to keep current
 *   tokens.json                            generated from src/styles/tokens (tokens.mjs)
 *   README.md                              .design-sync/conventions.md + a generated roster
 *   vocabulary.md                          docs/vocabulary.md
 *   brand/**                               docs/brand (the brand framework chapters)
 *   site/**                                public/, which the previews' images point at
 *   assets/Logos/*                         the wordmarks, uploaded to the asset store
 *
 * It then compares every file with what was last published (.design-sync/.cache/ds-published.json)
 * and writes .design-sync/out/plan.json: the changed files in batches the Artifact tool accepts,
 * the paths to remove, and the assets to upload. Publishing is Claude's step (/ds-publish), because
 * only the Artifact tool can write to the artifact.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import * as esbuild from 'esbuild';

import { buildTokens, readTokenLayer } from './tokens.mjs';

const ROOT = resolve(import.meta.dirname, '../..');
const OUT = join(ROOT, '.design-sync/out');
const PROJECT = join(OUT, 'project');
const TMP = join(OUT, '.tmp');
const STATE = join(ROOT, '.design-sync/.cache/ds-published.json');
const NAMESPACE = 'Tcules';
const TIERS = [
  { dir: 'components', group: 'Primitives' },
  { dir: 'patterns', group: 'Patterns' },
  { dir: 'templates', group: 'Templates' },
];
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&family=Public+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Geist+Mono:wght@400;500;600&display=swap';
/* One call to the Artifact tool carries at most 255 paths and 16 MiB (the type's cap). */
const BATCH_FILES = 200;
const BATCH_BYTES = 14 * 1024 * 1024;

const rel = (p) => relative(ROOT, p);
const sha = (buf) => createHash('sha256').update(buf).digest('hex');
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const write = (path, data) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, data);
};
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.name.startsWith('.') ? [] : e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );

if (process.argv.includes('--mark-published')) {
  const plan = JSON.parse(readFileSync(join(OUT, 'plan.json'), 'utf8'));
  const prev = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : { files: {}, assets: {} };
  const assets = { ...prev.assets };
  const ids = process.argv.includes('--assets') ? JSON.parse(process.argv[process.argv.indexOf('--assets') + 1]) : {};
  for (const a of plan.assets.all) {
    const blob = ids[a.name] ?? (prev.assets[a.name]?.sha === a.sha ? prev.assets[a.name].blob : undefined);
    if (blob) assets[a.name] = { sha: a.sha, blob, size: a.size, type: a.type };
  }
  write(STATE, JSON.stringify({ commit: plan.commit, at: new Date().toISOString(), files: plan.hashes, assets }, null, 1));
  console.log(`recorded ${Object.keys(plan.hashes).length} files and ${Object.keys(assets).length} assets as published at ${plan.commit}`);
  process.exit(0);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(PROJECT, { recursive: true });
const notes = [];

/* ── inventory: one unit per tier folder ───────────────────────────────────────── */

const units = TIERS.flatMap(({ dir, group }) =>
  readdirSync(join(ROOT, 'src', dir), { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^[A-Z]/.test(e.name))
    .map((e) => ({ name: e.name, folder: e.name, tier: dir, group, src: join(ROOT, 'src', dir, e.name) })),
);

/* ── esbuild plumbing ──────────────────────────────────────────────────────────── */

const SHIMS = join(ROOT, '.design-sync/shims');
/** react / react-dom read the packed globals; the tier barrels read the bundle's global. */
const globals = (map) => ({
  name: 'globals',
  setup(b) {
    const filter = new RegExp(`^(${Object.keys(map).map((k) => k.replace(/[/]/g, '\\/')).join('|')})$`);
    b.onResolve({ filter }, (a) => ({ path: a.path, namespace: 'global' }));
    b.onLoad({ filter: /.*/, namespace: 'global' }, (a) => ({ contents: `module.exports = window.${map[a.path]};`, loader: 'js' }));
  },
});
/** `url(/textures/x.png)` in CSS points at public/: leave it for the rewrite below. */
const publicUrls = {
  name: 'public-urls',
  setup(b) {
    b.onResolve({ filter: /^\//, namespace: 'file' }, (a) => (a.kind === 'url-token' || a.kind === 'import-rule' ? { path: a.path, external: true } : undefined));
  },
};
const common = {
  bundle: true,
  minify: true,
  platform: 'browser',
  target: 'es2020',
  jsx: 'automatic',
  legalComments: 'none',
  charset: 'utf8',
  logLevel: 'silent',
  /* The bundle runs in a browser frame, where `process` does not exist: every `process.env` read the
     library makes is defined here. SITE_URL is unset, so routes.ts takes its own default origin. */
  define: { 'process.env.NODE_ENV': '"production"', 'process.env.SITE_URL': 'undefined' },
  tsconfig: join(ROOT, 'tsconfig.json'),
  alias: {
    'next/link': join(SHIMS, 'next-link.tsx'),
    'next/navigation': join(SHIMS, 'next-navigation.tsx'),
    'next/form': join(SHIMS, 'next-form.tsx'),
  },
  loader: { '.svg': 'dataurl', '.png': 'dataurl', '.webp': 'dataurl', '.jpg': 'dataurl' },
};
const REACT = { react: 'React', 'react-dom': 'ReactDOM', 'react-dom/client': 'ReactDOM' };

/** A classic script inlined by consumers must not end or escape its own <script> element. */
const scriptSafe = (js, label) => {
  const out = js.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
  if (/<\/script|<!--/i.test(out)) throw new Error(`${label}: still holds </script or <!--`);
  return out;
};
/** public/ lives at site/ beside components/, so from components/bundle.css it is ../site/. */
const PUBLIC_DIRS = readdirSync(join(ROOT, 'public')).filter((d) => statSync(join(ROOT, 'public', d)).isDirectory());
const cssToSite = (css, prefix) =>
  css.replace(new RegExp(`url\\((['"]?)/(${PUBLIC_DIRS.join('|')})/`, 'g'), (_, q, d) => `url(${q}${prefix}site/${d}/`);

/* ── 1 · libraries: React 19, packed as the classic scripts previews load ──────── */

const reactVersion = JSON.parse(readFileSync(join(ROOT, 'node_modules/react/package.json'), 'utf8')).version;
for (const [file, contents, plugins] of [
  ['react.js', `window.React = require('react');`, []],
  ['react-dom.js', `window.ReactDOM = Object.assign({}, require('react-dom'), require('react-dom/client'));`, [globals({ react: 'React' })]],
]) {
  const r = await esbuild.build({ ...common, stdin: { contents, resolveDir: ROOT, loader: 'js' }, format: 'iife', write: false, plugins });
  write(join(PROJECT, 'components/lib', file), scriptSafe(r.outputFiles[0].text, file));
}

/* ── 2 · the bundle ─────────────────────────────────────────────────────────────── */

const entry = join(TMP, 'entry.ts');
write(
  entry,
  `import '${join(ROOT, 'src/app/globals.css')}';\n` + TIERS.map((t) => `export * from '@/${t.dir}';`).join('\n') + '\n',
);
const bundle = await esbuild.build({
  ...common,
  entryPoints: [entry],
  outdir: join(TMP, 'bundle'),
  format: 'iife',
  globalName: NAMESPACE,
  write: false,
  plugins: [globals(REACT), publicUrls],
});
const bundleJs = bundle.outputFiles.find((f) => f.path.endsWith('.js')).text;
const bundleCss = bundle.outputFiles.find((f) => f.path.endsWith('.css')).text;

/* Which units really are exports — a folder whose name the barrel does not export gets no card. */
const exported = new Set(
  new Function('window', `${bundleJs}; return Object.keys(${NAMESPACE});`)({ React: {}, ReactDOM: {} }),
);
/* A folder that exports several components under other names (CorpusPage: HomePage, AboutPage…)
   gets a card per PascalCase export of its own index. */
const cards = units.flatMap((u) => {
  if (exported.has(u.name)) return [u];
  const index = join(u.src, 'index.ts');
  const names = existsSync(index)
    ? [...readFileSync(index, 'utf8').matchAll(/\b([A-Z][A-Za-z0-9]*)\b/g)].map((m) => m[1]).filter((n) => exported.has(n))
    : [];
  const own = [...new Set(names)].filter((n) => !units.some((x) => x.name === n));
  if (!own.length) notes.push(`${u.tier}/${u.name}: not exported from the ${u.tier} barrel — no card`);
  return own.map((name) => ({ ...u, name }));
});

const header = `/* @ds-bundle: ${JSON.stringify({ format: 4, namespace: NAMESPACE, components: cards.map((u) => ({ name: u.name })) })} */\n`;
write(join(PROJECT, 'components/bundle.js'), header + scriptSafe(bundleJs, 'bundle.js'));
write(join(PROJECT, 'components/bundle.css'), cssToSite(bundleCss, '../'));

/* ── 3 · declarations ───────────────────────────────────────────────────────────── */

execSync('npx tsc -p .design-sync/tsconfig.dts.json', { cwd: ROOT, stdio: 'inherit' });
const TYPES = join(ROOT, 'dist/types');
const dtsOf = (u) => {
  const dir = join(TYPES, u.tier, u.folder);
  if (!existsSync(dir)) return '';
  return walk(dir)
    .filter((f) => f.endsWith('.d.ts') && !f.endsWith('index.d.ts'))
    .sort((a, b) => (a.endsWith(`${u.folder}.d.ts`) ? -1 : b.endsWith(`${u.folder}.d.ts`) ? 1 : a.localeCompare(b)))
    .map((f) => readFileSync(f, 'utf8').replace(/^import .*;\n/gm, '').replace(/^export \{\};\n/gm, '').trim())
    .filter(Boolean)
    .join('\n\n');
};
let indexDts = `// ${NAMESPACE} — declarations, as documentation. Generated from the repo; not type-checked here.\n`;
for (const u of cards) {
  u.dts = dtsOf(u);
  if (u.dts) {
    write(join(PROJECT, 'components', u.name, `${u.name}.d.ts`), u.dts + '\n');
    indexDts += `\n// ── ${u.name} (${u.group}) ──\n${u.dts}\n`;
  }
}
write(join(PROJECT, 'components/index.d.ts'), indexDts);

/* ── 4 · guidelines: the component's own doc comment, its props, its spec ──────── */

const docComment = (u) => {
  const decl = new RegExp(`export (default )?(async )?(function|const) ${u.name}\\b`);
  const files = walk(u.src).filter((f) => f.endsWith('.tsx'));
  const file = files.find((f) => decl.test(readFileSync(f, 'utf8'))) ?? files.find((f) => f.endsWith(`${u.name}.tsx`));
  if (!file) return '';
  const src = readFileSync(file, 'utf8');
  const at = src.search(decl);
  const before = at >= 0 ? src.slice(0, at) : src;
  const m = [...before.matchAll(/\/\*\*([\s\S]*?)\*\//g)].pop();
  return m ? m[1].replace(/^\s*\* ?/gm, '').trim() : '';
};
for (const u of cards) {
  const doc = docComment(u) || `${u.name} — a ${u.group.toLowerCase().replace(/s$/, '')} of the Tcules site.`;
  const specPath = join(ROOT, 'docs/specs', `${u.name}.md`);
  const specimen = existsSync(join(ROOT, 'src/app/design', kebab(u.name), 'page.tsx'));
  let md = `# ${u.name}\n\n${doc}\n`;
  if (u.dts) md += `\n## Props\n\n\`\`\`ts\n${u.dts}\n\`\`\`\n`;
  md += `\n## Source\n\n- \`src/${u.tier}/${u.name}/\` — ${u.group.toLowerCase()} tier, \`window.${NAMESPACE}.${u.name}\`\n`;
  if (specimen) md += `- Specimen: \`/design/${kebab(u.name)}\` — every arrangement; the preview is this route\n`;
  if (existsSync(specPath)) {
    md += `- Spec: \`spec.md\` beside this file (\`docs/specs/${u.name}.md\`)\n`;
    cpSync(specPath, join(PROJECT, 'components', u.name, 'spec.md'));
  }
  if (Buffer.byteLength(md) > 60_000) md = md.slice(0, 60_000) + '\n\n_(truncated: the full declarations are in the .d.ts beside this file)_\n';
  write(join(PROJECT, 'components', u.name, 'README.md'), md);
}

/* ── 5 · previews: each specimen, compiled against window.Tcules ──────────────── */

const SITE_REWRITE = `(function(){var P=${JSON.stringify(PUBLIC_DIRS)},B='../../site';
function f(u){if(typeof u!=='string')return u;for(var i=0;i<P.length;i++){if(u.indexOf('/'+P[i]+'/')===0)return B+u}return u}
function s(v){if(!P.some(function(d){return v.indexOf('/'+d+'/')>=0}))return v;return v.split(/,\\s+/).map(function(p){var t=p.trim().split(/\\s+/);t[0]=f(t[0]);return t.join(' ')}).join(', ')}
function fix(el){if(!el||el.nodeType!==1)return;['src','poster','href'].forEach(function(a){if(a==='href'&&el.tagName!=='LINK')return;var v=el.getAttribute(a);if(v){var n=f(v);if(n!==v)el.setAttribute(a,n)}});
var ss=el.getAttribute('srcset');if(ss){var n=s(ss);if(n!==ss)el.setAttribute('srcset',n)}
var st=el.getAttribute('style');if(st&&st.indexOf('url(')>=0){var r=st.replace(/url\\((['"]?)(\\/[^'")]+)/g,function(m,q,u){return 'url('+q+f(u)});if(r!==st)el.setAttribute('style',r)}}
var SA=Element.prototype.setAttribute;Element.prototype.setAttribute=function(n,v){if(n==='poster'||n==='src')v=f(v);else if(n==='srcset')v=s(String(v));return SA.call(this,n,v)};
if(typeof window.fetch==='function'){var F=window.fetch;window.fetch=function(u,o){return F.call(this,typeof u==='string'?f(u):u,o)}}
new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==='attributes')fix(m.target);else m.addedNodes.forEach(function(n){if(n.nodeType===1){fix(n);n.querySelectorAll('*').forEach(fix)}})})})
.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src','srcset','poster','style']});})();`;

const MOUNT = `(function(){var R=document.getElementById('root'),P=window.__dsPage;
function fail(e){R.textContent='\\u26a0 '+(e&&e.message||e)}
try{Promise.resolve(typeof P==='function'?P({params:Promise.resolve({}),searchParams:Promise.resolve({})}):null)
.then(function(el){ReactDOM.createRoot(R).render(el)},fail)}catch(e){fail(e)}})();`;

/* The compiled specimen goes in preview.js beside the card (a preview may load ./x.js), so the
   html stays far under the type's 256 KB cap however much fixture data a specimen carries. */
const previewHtml = ({ group, height, css, corpus }) =>
  `<!-- @dsCard group="${group}" height=${height} width=1280 -->
<!doctype html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS_HREF.replace(/&/g, '&amp;')}">
<style>${cssToSite(css, '../../').replace(/<\/style/gi, '<\\/style')}</style>
</head><body>
<div id="root"></div>
${corpus ? '<script src="../corpus.js"></script>\n' : ''}<script src="./preview.js"></script>
</body></html>
`;

const ownedPreviews = join(ROOT, '.design-sync/previews');
/* @content's corpus source reads _pages/*.md with node:fs. In a preview, fs is a stub over a
   snapshot of that folder (components/corpus.js, loaded only by the cards that read it), so the
   corpus templates preview with the real copy rather than not at all. */
let usesCorpus = false;
const nodeStubs = {
  name: 'node-stubs',
  setup(b) {
    b.onResolve({ filter: /^node:(fs|path)$/ }, (a) => {
      usesCorpus = true;
      return { path: a.path, namespace: 'node-stub' };
    });
    b.onLoad({ filter: /.*/, namespace: 'node-stub' }, () => ({
      contents: `const C = () => window.__dsCorpus || {};
const base = (p) => String(p).split('/').pop();
module.exports = {
  readdirSync: () => Object.keys(C()),
  readFileSync: (p) => { const t = C()[base(p)]; if (t == null) throw new Error('not in the corpus snapshot: ' + p); return t; },
  existsSync: (p) => base(p) in C() || base(p) === '_pages',
  join: (...p) => p.join('/'), resolve: (...p) => p.join('/'), dirname: (p) => p, basename: base,
};`,
      loader: 'js',
    }));
  },
};
const corpusDir = join(ROOT, '_pages');
const corpus = Object.fromEntries(readdirSync(corpusDir).filter((f) => f.endsWith('.md')).map((f) => [f, readFileSync(join(corpusDir, f), 'utf8')]));
write(join(PROJECT, 'components/corpus.js'), scriptSafe(`window.__dsCorpus = ${JSON.stringify(corpus)};\n`, 'corpus.js'));

let live = 0;
const floor = [];
for (const u of cards) {
  /* A folder exporting several components (Testimonial, CorpusPage) has one specimen, named for
     the folder: it previews on the folder's first card, and the siblings point at that card. */
  const first = cards.find((c) => c.folder === u.folder);
  const route = [kebab(u.name), ...(u.name !== u.folder && first === u ? [kebab(u.folder)] : [])].find((r) =>
    existsSync(join(ROOT, 'src/app/design', r, 'page.tsx')),
  );
  const specimen = join(ROOT, 'src/app/design', route ?? kebab(u.name), 'page.tsx');
  const owned = join(ownedPreviews, `${u.name}.tsx`);
  /* The specimen is the preview. An owned story file is the fallback for a unit with no route. */
  const source = existsSync(specimen) ? specimen : existsSync(owned) ? owned : null;
  let html;
  if (source) {
    const isSpecimen = source === specimen;
    /* A specimen whose index only links out to [slug] routes (service-page) previews a child route
       instead — the stress story where there is one, since it renders every block. */
    const childDir = isSpecimen && readdirSync(dirname(source)).find((d) => /^\[\w+\]$/.test(d) && existsSync(join(dirname(source), d, 'page.tsx')));
    const child = childDir && /generateStaticParams/.test(readFileSync(join(dirname(source), childDir, 'page.tsx'), 'utf8')) ? join(dirname(source), childDir, 'page.tsx') : null;
    const contents = child
      ? `import Page, { generateStaticParams } from ${JSON.stringify(child)};\n` +
        `window.__dsPage = async (props) => { const all = await generateStaticParams(); ` +
        `const pick = all.find((p) => Object.values(p).some((v) => /stress/i.test(String(v)))) ?? all[0]; ` +
        `return Page({ ...props, params: Promise.resolve(pick) }); };\n`
      : isSpecimen
      ? `import Page from ${JSON.stringify(source)};\nwindow.__dsPage = Page;\n`
      : `import * as S from ${JSON.stringify(source)};\nimport { createElement as h, Fragment } from 'react';\n` +
        `window.__dsPage = () => h('div', { style: { display: 'grid', gap: 48, padding: 32 } }, ...Object.keys(S).filter((k) => /^[A-Z]/.test(k)).map((k) => h(S[k], { key: k })));\n`;
    usesCorpus = false;
    try {
      const r = await esbuild.build({
        ...common,
        stdin: { contents, resolveDir: dirname(source), loader: 'tsx' },
        outdir: join(TMP, 'preview', u.name),
        format: 'iife',
        /* @content reads process.env to pick its source; in a preview it is always the fixtures. */
        banner: { js: `var process = { env: { NODE_ENV: 'production' }, cwd: function () { return '/'; } };` },
        write: false,
        plugins: [
          globals({ ...REACT, '@/components': NAMESPACE, '@/patterns': NAMESPACE, '@/templates': NAMESPACE, 'tcules-website-2026': NAMESPACE }),
          publicUrls,
          nodeStubs,
        ],
      });
      const js = r.outputFiles.find((f) => f.path.endsWith('.js')).text;
      const css = r.outputFiles.find((f) => f.path.endsWith('.css'))?.text ?? '';
      html = previewHtml({ group: u.group, height: isSpecimen ? 1200 : 640, css, corpus: usesCorpus });
      if (Buffer.byteLength(html) > 256 * 1024) {
        notes.push(`${u.name}: preview css is ${Math.round(Buffer.byteLength(html) / 1024)} KB, over the 256 KB cap — floor card instead`);
        html = undefined;
      } else {
        write(join(PROJECT, 'components', u.name, 'preview.js'), `${SITE_REWRITE}\n${scriptSafe(js, `${u.name} preview`)}\n${MOUNT}\n`);
        live++;
      }
    } catch (e) {
      notes.push(`${u.name}: ${rel(source)} did not compile for the browser (${(e.errors?.[0]?.text ?? e.message).slice(0, 140)}) — floor card instead`);
    }
  }
  if (!html) {
    floor.push(u.name);
    html = `<!-- @dsCard group="${u.group}" height=120 floor=static -->
<!doctype html>
<html><head><meta charset="utf-8"></head><body style="margin:0;padding:24px;font:14px/1.5 system-ui;color:#504f49">
<p style="margin:0"><strong>${u.name}</strong> ${first !== u && existsSync(join(ROOT, 'src/app/design', kebab(u.folder), 'page.tsx')) ? `is rendered in the <strong>${first.name}</strong> card, with the rest of <code>src/${u.tier}/${u.folder}/</code>.` : `has no <code>/design</code> specimen yet, so no live preview.`} It is on <code>window.${NAMESPACE}.${u.name}</code>; its README lists its props.</p>
</body></html>
`;
  }
  write(join(PROJECT, 'components', u.name, 'preview.html'), html);
}

/* ── 6 · tokens, README and the further sections ───────────────────────────────── */

const { tokens, skipped } = buildTokens({ ...readTokenLayer(join(ROOT, 'src/styles/tokens')), name: NAMESPACE });
const commit = execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim();
const dirty = execSync('git status --porcelain', { cwd: ROOT }).toString().trim() !== '';
tokens.meta = { source: 'github', repo: 'tcules-website-2026', ref: `${commit}${dirty ? '+dirty' : ''}`, paths: { tokens: ['src/styles/tokens'] }, synced: new Date().toISOString().slice(0, 10) };
write(join(PROJECT, 'tokens.json'), JSON.stringify(tokens, null, 1) + '\n');
for (const s of skipped) notes.push(`token not carried: ${s}`);

const byGroup = (g) => cards.filter((u) => u.group === g).map((u) => `\`${u.name}\``).join(', ');
const roster =
  `## What is on \`window.${NAMESPACE}\`\n\n` +
  TIERS.map((t) => `- **${t.group}** — ${byGroup(t.group)}`).join('\n') +
  `\n\nEach has a folder under \`components/\`: its README (doc comment and props), its declarations, its spec where one exists, and a live preview built from its \`/design\` specimen.\n`;
const conventions = readFileSync(join(ROOT, '.design-sync/conventions.md'), 'utf8');
write(join(PROJECT, 'README.md'), conventions.replace('<!-- ROSTER -->', roster.trim()));
cpSync(join(ROOT, 'docs/vocabulary.md'), join(PROJECT, 'vocabulary.md'));
cpSync(join(ROOT, 'docs/brand'), join(PROJECT, 'brand'), { recursive: true });
cpSync(join(ROOT, 'public'), join(PROJECT, 'site'), { recursive: true });
for (const f of walk(PROJECT).filter((f) => f.endsWith('.DS_Store'))) rmSync(f);

/* ── 7 · assets: the wordmarks, as uploads the index names ─────────────────────── */

const ASSET_GROUPS = { Logos: { from: 'docs/brand', match: /^wordmark.*\.svg$/ } };
write(
  join(PROJECT, 'assets/Logos/README.md'),
  `# Logos\n\nThe Tcules wordmark, from the brand framework (\`brand/\`, chapter 02). Pick by ground:\n\n` +
    `- \`wordmark-marketing.svg\` — brandeis-500 mark with neutral-950 lettering, on paper and tint\n` +
    `- \`wordmark.svg\` — brandeis-500 mark, lettering in \`currentColor\`: inline it to inherit the text colour; as an \`<img>\` the lettering renders black\n` +
    `- \`wordmark-on-ink.svg\` — all white, on the ink ground\n- \`wordmark-on-blue.svg\` — all white, on the blue ground\n` +
    `- \`wordmark-mono-black.svg\` — one ink, neutral-950 · \`wordmark-mono-white.svg\` — one ink, paper (#fffefa)\n\n` +
    `In a page, use the \`Logo\` component rather than these files: it reads the surface and picks the ink itself.\n`,
);
const assetsAll = [];
for (const [group, { from, match }] of Object.entries(ASSET_GROUPS)) {
  for (const f of readdirSync(join(ROOT, from)).filter((n) => match.test(n)).sort()) {
    const buf = readFileSync(join(ROOT, from, f));
    assetsAll.push({ group, name: f, file: rel(join(ROOT, from, f)), sha: sha(buf), size: buf.length, type: 'image/svg+xml' });
  }
}

/* ── plan ───────────────────────────────────────────────────────────────────────── */

rmSync(TMP, { recursive: true, force: true });
const hashes = {};
for (const f of walk(PROJECT)) hashes[`project/${relative(PROJECT, f)}`] = sha(readFileSync(f));
const prev = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : { files: {}, assets: {} };
const changed = Object.keys(hashes).filter((p) => prev.files[p] !== hashes[p]).sort();
const remove = Object.keys(prev.files).filter((p) => !(p in hashes)).sort();
const batches = [];
let cur = { files: [], bytes: 0 };
for (const p of changed) {
  const size = statSync(join(OUT, p)).size;
  if (cur.files.length && (cur.files.length >= BATCH_FILES || cur.bytes + size > BATCH_BYTES)) {
    batches.push(cur);
    cur = { files: [], bytes: 0 };
  }
  cur.files.push(p);
  cur.bytes += size;
}
if (cur.files.length) batches.push(cur);
const assetsChanged = assetsAll.filter((a) => prev.assets?.[a.name]?.sha !== a.sha);

const plan = {
  commit: `${commit}${dirty ? '+dirty' : ''}`,
  root: rel(OUT),
  libraries: [
    { name: 'react', version: reactVersion, global: 'React', file: 'components/lib/react.js' },
    { name: 'react-dom', version: reactVersion, global: 'ReactDOM', file: 'components/lib/react-dom.js' },
  ],
  counts: { files: Object.keys(hashes).length, changed: changed.length, remove: remove.length, cards: cards.length, live, floor: floor.length },
  batches,
  remove,
  assets: { changed: assetsChanged, all: assetsAll },
  notes,
  hashes,
};
write(join(OUT, 'plan.json'), JSON.stringify(plan, null, 1));

/* Each batch as the exact arguments of one Artifact publish call: `file_path` absolute, `files`
   the rest. The tool serves by extension and has no type for .ts or .vtt, so those go as text/plain. */
const TYPED = { '.ts': 'text/plain', '.vtt': 'text/plain' }; // the artifact serves no text/vtt
const typeOf = (p) => Object.entries(TYPED).find(([ext]) => p.endsWith(ext))?.[1];
const calls = batches.map((b) => {
  const first = b.files.find((p) => !typeOf(p)) ?? b.files[0];
  /* The list form: each file is served at its own spelling under root. */
  const files = b.files.filter((p) => p !== first).map((p) => (typeOf(p) ? { path: p, contentType: typeOf(p) } : { path: p }));
  return { file_path: join(OUT, first), files };
});
/* Removals ride on calls of their own, after every file is up, at most 200 paths each. A publish
   needs a file_path, so each re-sends the README, unchanged. */
for (let i = 0; i < remove.length; i += 200) {
  calls.push({ file_path: join(PROJECT, 'README.md'), files: Object.fromEntries(remove.slice(i, i + 200).map((p) => [p, null])) });
}
for (const [i, c] of calls.entries()) write(join(OUT, 'calls', `${i}.json`), JSON.stringify(c));

console.log(`${cards.length} cards (${live} live previews, ${floor.length} floor${floor.length ? `: ${floor.join(', ')}` : ''})`);
console.log(`${plan.counts.files} files · ${changed.length} changed in ${batches.length} batch(es) · ${remove.length} to remove · ${assetsChanged.length} asset(s) to upload`);
for (const n of notes) console.log(`  note: ${n}`);
