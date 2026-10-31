export const meta = {
  name: 'flat-drawings-pages',
  description: 'Draw every still flat drawing a page is missing, one designer per page, blind-checked per page',
  whenToUse:
    'Filling empty Sketch plates (placeholders) page by page: a "What you get" band or any band of still drawings. args: {pages:[{page, slug, file?, scenes?:[...]}], maxRounds?: 2} (file defaults to components/Sketch/wyg-<slug>.tsx; scenes default to every key in that file, in order); each item’s title and words are the comment above its scene in the page file. Each page owns one file (components/Sketch/wyg-<page>.tsx) whose scene names are already wired (lib/page-scenes.ts, content/sources/offer-scenes-pages.ts). For moving tile drawings use flat-drawings instead. Needs `npm run dev` running in the checkout.',
  phases: [
    { title: 'Draw', detail: 'one designer per page: an idea per item in words, draw the set, capture, self-check' },
    { title: 'Check', detail: 'blind critic per page on its contact sheet, fix loop on the failing items' },
  ],
}

/*
 * The batched sibling of flat-drawings.js, for still plates (owner, 1 Nov 2026: "any page that already
 * has a placeholder"). One designer per page keeps a page's drawings one set and costs a fraction of a
 * designer per drawing; the critic reads the page's contact sheet (one image) blind, then the titles.
 *   docs/research/flat-graphics/drawing-brief.md        the rules
 *   npm run sketch:frames -- --page=<route> --sheet=<n> <scenes...>   captures from the live page
 *   .shots/frames/sheet-guides-still.png                the approved What-you-get plates (product design)
 */

const BRIEF = 'docs/research/flat-graphics/drawing-brief.md'
const GUIDE_CMD =
  'npm run sketch:frames -- --sheet=guides-still outcome-brief outcome-rules team-product-design needs-product-design stops-product-design'
const MAX = args.maxRounds ?? 2

const DRAWN = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: { scene: { type: 'string' }, idea: { type: 'string' } },
        required: ['scene', 'idea'],
      },
    },
    notes: { type: 'string' },
  },
  required: ['items'],
}
const REVIEW = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          n: { type: 'number' },
          scene: { type: 'string' },
          blindRead: { type: 'string', description: '<= 8 words, written before reading the titles' },
          pass: { type: 'boolean' },
          fix: { type: 'string', description: 'concrete change in drawing units, empty if pass' },
        },
        required: ['n', 'scene', 'blindRead', 'pass', 'fix'],
      },
    },
    setNote: { type: 'string', description: 'repeats or inconsistencies across the page' },
  },
  required: ['items'],
}

const fileOf = p => p.file ?? `src/components/Sketch/wyg-${p.slug}.tsx`
const ALL = null // every scene key in the page's file, in file order
const list = scenes =>
  scenes === ALL ? '(every scene key in the file, in file order)' : scenes.map((sc, i) => `${i + 1}. \`${sc}\``).join('\n')
const cmd = (p, scenes, sheet) =>
  `npm run sketch:frames -- --page=${p.page} --sheet=${sheet} ${scenes === ALL ? `<every scene key in ${fileOf(p)}, in file order>` : scenes.join(' ')}`

function drawPrompt(p, scenes, feedback) {
  return `You are drawing the still flat drawings for one page of the Tcules site: ${p.page}, its "What you get" band. Read ${BRIEF} whole first (the drawing rules; these plates are STILL, so the motion section applies only as "plates are held finished": draw the finished picture, a route as a plain TraceIn or line). Then read the helpers in src/components/Sketch/offer.tsx and scenes.tsx and the classes in Sketch.module.css. The approved standard for these plates is .shots/frames/sheet-guides-still.png (product design's What you get; source in src/components/Sketch/offer.tsx and l1-terms.tsx). If that file is missing, run \`${GUIDE_CMD}\`.

You own ONE file: \`${fileOf(p)}\`. It already lists every item's scene name with its words in a comment, set to undefined. Replace each undefined with a function you write in the same file (Write or Edit freely; no one else touches it). Import helpers from './offer', './scenes' and styles from './Sketch.module.css' (same folder: a ../ import fails the tier lint). Do not edit any other file and do not commit.

${feedback ? `A blind critic rejected these items; fix exactly these, keep everything else:\n${feedback}` : `The items, in page order (each one's title and words are the comment above its scene in your file; the last three are usually the terms Who does the work, What we need from you, Where our part stops):\n${list(scenes)}`}

For each item: write its ONE idea as a sentence first, drawn from its own words (what the client receives, or for the three terms: who does the work / what we need from the client / where our part stops, from THIS page's words). Three or four things at most, readable in one second. The drawing sits on the 320 x 180 plate, inside x 30-290 and y 30-150, centred, ports and turns on the 20-unit grid (dots at 10, 30, 50 ...). No two items on this page may share the same picture.
Then run \`${cmd(p, scenes, p.slug)}\`, view .shots/frames/sheet-${p.slug}.png and zoom into individual .shots/frames/<scene>.png for joins. Iterate until every drawing reads in one second and passes the brief's polish rules. Check \`npx tsc --noEmit\` shows no error in your file.
Return each item's idea.`
}

function reviewPrompt(p, scenes) {
  return `You are a blind critic for the still flat drawings of one Tcules page. Do NOT read the source file or any titles before step 2.
1. Run \`${cmd(p, scenes, `${p.slug}-check`)}\` (dev server is running; if it errors mid-recompile, wait and retry). View .shots/frames/sheet-${p.slug}-check.png: the drawings are numbered from 1 in the order you passed them. For each number write what it shows in at most 8 words (blindRead).
2. Now read the titles and words: they are the comments above each scene in \`${fileOf(p)}\` (read only the comments, not the drawing code, until you judge polish). Same order:\n${list(scenes)}
For each: pass only if a visitor reading that title and line would get its point from the picture in one second, it is not confusable with another drawing on this page, and at 2x (.shots/frames/<scene>.png) it passes ${BRIEF}'s polish rules (routes on axes with 6-unit arcs, ends on ports or arrowheads, nothing crossing shapes, halos 6 clear, nothing within 4 units of an untouched mark, centred in x 30-290 y 30-150, no stray marks). An EMPTY plate fails. Be strict: the standard is .shots/frames/sheet-guides-still.png. A failing item gets a concrete fix (what to draw or move, in drawing units).`
}

phase('Draw')
const results = await pipeline(
  args.pages,
  p => agent(drawPrompt(p, p.scenes ?? ALL), { label: `draw:${p.slug}`, phase: 'Draw', schema: DRAWN }),
  async (drawn, p) => {
    let review = null
    let rounds = 0
    let todo = p.scenes ?? ALL
    while (true) {
      review = await agent(reviewPrompt(p, todo), { label: `check:${p.slug}#${rounds + 1}`, phase: 'Check', schema: REVIEW })
      const failing = (review?.items ?? []).filter(r => !r.pass)
      if (!review || failing.length === 0 || rounds >= MAX) break
      rounds++
      const failed = new Set(failing.map(f => f.scene))
      todo = [...failed]
      const feedback = failing.map(f => `- \`${f.scene}\`: blind read "${f.blindRead}". ${f.fix}`).join('\n') +
        (review.setNote ? `\nAcross the page: ${review.setNote}` : '')
      await agent(drawPrompt(p, todo, feedback), { label: `fix:${p.slug}#${rounds}`, phase: 'Check', schema: DRAWN })
    }
    const open = (review?.items ?? []).filter(r => !r.pass)
    if (open.length) log(`${p.page}: ${open.length} still failing after ${rounds} fix rounds`)
    return { page: p.page, fixRounds: rounds, open: open.map(o => `${o.scene}: ${o.fix}`), setNote: review?.setNote ?? '' }
  },
)

return results.filter(Boolean)
