export const meta = {
  name: 'flat-drawings',
  description: 'Redraw, blind-check and polish flat Sketch drawings so each reads in one second and moves on a line',
  whenToUse:
    'Drawing, checking or polishing Sketch scenes (the flat drawings). args: {scenes:[{scene,file,title,line,page,set?,still?,triage?}], set?: "band name", maxRounds?: 2}. `set` (per scene or for the run) names the band of sibling drawings that must stay distinct; `triage: true` checks a scene first and redraws only if it fails. Needs `npm run dev` running in the checkout and every scene on /design/sketch (tile scenes in S.7).',
  phases: [
    { title: 'Draw', detail: 'one designer per scene: idea in words, draw, capture, self-check' },
    { title: 'Check', detail: 'blind critic per scene, fix loop until it passes' },
    { title: 'Set', detail: 'one pass over the whole set for consistency and the gates' },
  ],
}

/*
 * The brief, the bar and the tools live in the repo, not in this script:
 *   docs/research/flat-graphics/drawing-brief.md   the rules every agent reads (one idea, motion on a line, polish)
 *   npm run sketch:frames -- <scene>               rest | mid | moved strip, @1x image, motion numbers
 *   Sketch TraceIn / GrowIn                        the line that draws on hover, and what arrives with it
 * Piloted 31 Oct 2026 on the seven /services/product-design#services-on-their-own tiles: 19 agents, all
 * seven passed the blind check (two after one fix round). Then the owner's four-pattern rule
 * (decisions/2026-10-31-tile-drawings-move-in-four-patterns) went into the brief and the critic.
 */

const BRIEF = 'docs/research/flat-graphics/drawing-brief.md'
const GUIDES = 'product-design design-systems design-engineering software-development'
const scenes = args.scenes
const MAX = args.maxRounds ?? 2
const setOf = s => s.set ?? args.set ?? 'one band'
const siblings = s => scenes.filter(o => setOf(o) === setOf(s)).map(o => `${o.scene} ("${o.title}")`).join(', ')
const bandOf = s => `the "${setOf(s)}" band`

const DESIGN = {
  type: 'object',
  properties: {
    scene: { type: 'string' },
    concept: { type: 'string', description: 'the one-sentence idea, rest -> hover (or the still picture)' },
    kind: { type: 'string', enum: ['new concept', 'polish only'] },
    metrics: { type: 'string', description: 'the JSON line sketch:frames printed' },
    notes: { type: 'string' },
  },
  required: ['scene', 'concept', 'kind', 'metrics'],
}
const VERDICT = {
  type: 'object',
  properties: {
    blindRead: { type: 'string', description: 'what the drawing shows in <= 8 words, written BEFORE reading the title' },
    readsAsTitle: { type: 'boolean' },
    motionIsLine: { type: 'boolean', description: 'motion follows the four-pattern rule (a line, if present, draws); true for a still scene' },
    motionNoticeable: { type: 'boolean', description: 'true for a still scene' },
    patternsUsed: { type: 'array', items: { type: 'string', enum: ['line draws', 'circle grows or fills', 'highlight', 'cursor to button', 'OTHER'] }, description: 'every motion seen between rest and moved; empty for a still scene' },
    polishIssues: { type: 'array', items: { type: 'string' } },
    pass: { type: 'boolean' },
    fix: { type: 'string', description: 'the specific changes needed, empty if pass' },
  },
  required: ['blindRead', 'readsAsTitle', 'patternsUsed', 'motionIsLine', 'motionNoticeable', 'polishIssues', 'pass', 'fix'],
}

const where = s =>
  `Scene \`${s.scene}\`, drawn in \`${s.file}\`. It sits next to the title "${s.title}" (line under it: "${s.line}") on ${s.page}, in ${bandOf(s)} with: ${siblings(s)}.`
const shared = `Other agents are editing OTHER scenes in the same files right now: change only your own scene's function and its drawn-box entry, with Edit (never Write a shared file); if an Edit fails because the file changed, re-read and retry. If \`npm run sketch:frames\` errors because the page is mid-recompile from someone else's edit, wait a few seconds and rerun. Do not commit.`
const stillNote = s =>
  s.still
    ? 'This scene is STILL (a plate: it never moves). Ignore the motion bar; the finished picture alone must carry the idea. A route in it is a plain TraceIn or line, drawn.'
    : 'This scene is a TILE inside a link: it moves on hover, and its rest and end states must visibly differ. Motion comes ONLY from the four patterns in the brief (§ How it moves): a line draws (TraceIn), a circle grows from 0 (GrowIn) or fills (release), a highlight as in Audits (halo GrowIn + block), a cursor glides to the button (Glide + press). At most TWO patterns; no Move nudges or small scales. If there is a line, it draws. Nothing but the start port is blue at rest.'

function designPrompt(s, feedback) {
  return `You are drawing one flat drawing for the Tcules site. Read ${BRIEF} whole first, then the grammar and helpers it points to. The four guiding scenes are in src/components/Sketch/stories.tsx; their frames are .shots/frames/<name>.png for ${GUIDES} (run \`npm run sketch:frames -- ${GUIDES}\` only if those files are missing).

${where(s)}
${stillNote(s)}

${feedback ? `A blind critic rejected the current drawing:\n${feedback}\nFix exactly that, keeping what already works.` : `1. Look at the current drawing (\`npm run sketch:frames -- ${s.scene}\`, view .shots/frames/${s.scene}.png). Does its idea read as the title in one second, and is it distinct from its siblings above? If yes, keep the idea and fix only motion and polish. If no, find a new idea.
2. Write the idea as ONE sentence before any geometry.`}
3. Draw it. Update the scene's drawn-box entry if its extent changes, and the comment above the function to state the idea.
4. Run \`npm run sketch:frames -- ${s.scene}\`, view the strip and the @1x, check against every rule in the brief, zooming into joins. Iterate until it reads in one second at 1x${s.still ? '' : ', rest and moved clearly differ, changed >= 25 (and traceUnits >= 80 if it has a line)'}. Also view \`--surface=ink\` once: the accent is peridot there and must still read. Make sure \`npx tsc --noEmit\` shows no error in your file.
${shared}
Return the idea, whether it is a new concept, and the final metrics line.`
}

function criticPrompt(s) {
  return `You are a blind critic for one flat drawing on the Tcules site. Do NOT read the scene's source code or its comment before step 3: the test is whether the picture alone carries the idea.
1. Run \`npm run sketch:frames -- ${s.scene}\` (dev server is running; if the page is mid-recompile, wait and retry). View .shots/frames/${s.scene}@1x.png (real size, finished state). Write what it shows in at most 8 words: that is blindRead. Only then read on.
2. The title next to it is "${s.title}" ("${s.line}"), in ${bandOf(s)} with: ${siblings(s)}. readsAsTitle = would a visitor reading that title get its point from this picture in one second, and could it NOT be mistaken for a sibling?
3. ${s.still ? 'This is a still scene: set motionIsLine and motionNoticeable true.' : `View .shots/frames/${s.scene}.png (rest | mid | moved, 2x). List patternsUsed: every change between rest and moved, as one of the four patterns (line draws; circle grows from 0 or fills; highlight as in Audits; cursor glides to the button) or OTHER (a nudge, a small scale, anything else). motionIsLine = no OTHER, at most two patterns, and any line present draws. motionNoticeable = rest and moved clearly differ and someone hovering would see it without being told. Rest must give nothing away (no blue answer before the line). Check the printed numbers against the bar in ${BRIEF}.`}
4. Read ${BRIEF} and check polish at 2x: routes on axes with true 6-unit arcs, ends on ports/arrowheads, ports where a route crosses a frame, nothing crossing shapes, halos 6 clear, nothing within 4 units of an untouched mark, weights, stray marks, crop. Now you may read the source to confirm.
pass only if readsAsTitle, motionIsLine and motionNoticeable are all true and no polish issue is more than cosmetic. Be strict: the standard is the four home #product-design tiles. If failing, give a concrete fix (what to draw or move, in drawing units).`
}

phase('Draw')
const results = await pipeline(
  scenes,
  async s => {
    /* Triage: check the drawing as it stands; a pass skips the designer entirely. */
    if (s.triage) {
      const first = await agent(criticPrompt(s), { label: `triage:${s.scene}`, phase: 'Draw', schema: VERDICT })
      if (first?.pass) return { triaged: first }
      return agent(designPrompt(s, `blind read: "${first?.blindRead}". ${first?.fix} Polish: ${(first?.polishIssues ?? []).join('; ')}`), { label: `draw:${s.scene}`, phase: 'Draw', schema: DESIGN })
    }
    return agent(designPrompt(s), { label: `draw:${s.scene}`, phase: 'Draw', schema: DESIGN })
  },
  async (design, s) => {
    if (design?.triaged) return { scene: s.scene, title: s.title, design: { concept: '(unchanged: passed triage)', kind: 'polish only', metrics: '' }, verdict: design.triaged, fixRounds: 0 }
    let verdict = null
    let rounds = 0
    let last = design
    while (true) {
      verdict = await agent(criticPrompt(s), { label: `check:${s.scene}#${rounds + 1}`, phase: 'Check', schema: VERDICT })
      if (!verdict || verdict.pass || rounds >= MAX) break
      rounds++
      last =
        (await agent(
          designPrompt(s, `blind read: "${verdict.blindRead}". ${verdict.fix} Polish: ${verdict.polishIssues.join('; ')}`),
          { label: `fix:${s.scene}#${rounds}`, phase: 'Check', schema: DESIGN },
        )) ?? last
    }
    if (verdict && !verdict.pass) log(`${s.scene}: still failing after ${rounds} fix rounds — left for the owner`)
    return { scene: s.scene, title: s.title, design: last, verdict, fixRounds: rounds }
  },
)

phase('Set')
const done = results.filter(Boolean)
const set = await agent(
  `These flat drawings were just redrawn, grouped by band (${[...new Set(scenes.map(setOf))].join('; ')}): ${done.map(r => `${r.scene} ("${r.title}") — ${r.design?.concept}`).join('; ')}.
Run \`npm run sketch:frames -- ${done.map(r => r.scene).join(' ')}\` and view every strip side by side. Read ${BRIEF}. Check them as one hand (weights, spacing, scale, accent use) and each band as a set: no two siblings opening on the same glyph or picture, no blue answer at rest, every tile's rest and end clearly different, motion only from the four patterns and at most two per drawing. Fix small inconsistencies directly (Edit only, the scene functions and drawn boxes). Then run \`npm run lint && npm run typecheck && npm run tokens:check\` and fix anything the edits broke. Do not commit. Return a short report: what you changed, the gate results, and any drawing that still falls short and why.`,
  { label: 'set-check', phase: 'Set' },
)

return {
  results: done.map(r => ({
    scene: r.scene,
    concept: r.design?.concept,
    kind: r.design?.kind,
    metrics: r.design?.metrics,
    pass: r.verdict?.pass,
    blindRead: r.verdict?.blindRead,
    patterns: r.verdict?.patternsUsed,
    fixRounds: r.fixRounds,
    open: r.verdict?.pass ? '' : r.verdict?.fix,
  })),
  set,
}
