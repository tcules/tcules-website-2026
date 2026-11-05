import {
  ClientMark,
  Cluster,
  Layout,
  Section,
  type ClientMarkProps,
  type LayoutProps,
} from '@/components';
import { cx } from '@/lib/cx';

import { Specimen, specimenStyles as s } from '../_specimen/Specimen';
import * as C from '../_specimen/clients';

/**
 * ClientMark specimen — the client set at one visual weight, on four grounds.
 *
 * What this page has to show:
 *   1. equal AREA OF INK, not equal width or equal box: a 7:1 hairline wordmark and a 3:1 bold
 *      lockup read as the same weight because each is sized by its measured density, and the
 *      ~40px height cap (ruling P2) holds, and the 240px width guard holds before a correction;
 *   2. one colour, the ground's ink, from ONE file per mark on every surface — any mark on ink or
 *      blue that renders light proves the mask is doing it, not the file;
 *   3. the strip is a Cluster of marks, not a component: the Cluster owns the gap;
 *   4. the recommended composition for a set of known size: equal cells in a Layout, with a count
 *      that fills every row at every breakpoint (tracker 2.17) — still not a component;
 *   5. the ink is one step quieter than the section's heading ink, so a strip sits under its
 *      heading rather than competing with it (tracker 2.17) — every surface band has a heading.
 *
 * The strip is the REAL client set (public/clients/*.svg), the files the previous site's logo
 * wall carried. ch05 §10 requires written client approval, filed with the asset, before any
 * PUBLIC use; this route is the proving ground, and a page placing these checks that record.
 * Blueghost and Rudo are left out: their files paint knock-outs as white instead of carrying
 * them as holes, so a mask fills them solid (spec §14) — the fix is a corrected client file.
 *
 * Every real mark is a wordmark between 3:1 and 7.4:1, so the shapes the set does not have yet —
 * a square symbol, a stacked lockup, a 12:1 wordmark, heavy and hairline strokes — are FICTIONAL
 * stress files (public/design/client-mark-*.svg), drawn black and labelled as such.
 */

type Mark = Omit<ClientMarkProps, 'className'> & { shape: string };

const STRESS_DIR = '/design';

/* The real set and its measured densities live in ../_specimen/clients.ts, shared with the kit's H
   family, so a size judged on one specimen is the one rendered on the other. Here each record also
   carries its shape label: ratio, then ink density. */
const label = (mark: C.ClientRecord): Mark => {
  const { width, height, correction, density } = mark;
  const k = correction
    ? `, ${correction > 0 ? '+' : '−'}${Math.round(Math.abs(correction) * 100)}%`
    : '';
  const d = density ? `, ink ${density.toFixed(2)}` : '';
  return { ...mark, shape: `${(width / height).toFixed(1)}:1${d}${k}` };
};

const OMNY = label(C.OMNY);
const LATITUDEPAY = label(C.LATITUDEPAY);
const QUOTER = label(C.QUOTER);
const KNOVOS = label(C.KNOVOS);
const DOODLE = label(C.DOODLE);

const STRIP: readonly Mark[] = C.CLIENTS.map(label);

/* The grid's set: all nine (visual-direction § 5.9, 6 Oct 2026). Nine fill 3 × 3 at md, sit 5 + 4
   from lg and leave the last mark alone at base — a start-aligned grid reads that as the end of the
   list, not a hole. The kit's H band (/design/kit/logos) composes it in every placement. */
const GRID_SET: readonly Mark[] = STRIP;

/* Fictional stress shapes — see the header. */
const SQUARE: Mark = {
  name: 'Brightwell',
  src: `${STRESS_DIR}/client-mark-square.svg`,
  width: 64,
  height: 64,
  shape: 'fictional · square symbol, 1:1',
};
const TALL: Mark = {
  name: 'Cobalt Row',
  src: `${STRESS_DIR}/client-mark-tall.svg`,
  width: 64,
  height: 80,
  shape: 'fictional · stacked lockup, 4:5',
};
const HEAVY: Mark = {
  name: 'Eskerfield',
  src: `${STRESS_DIR}/client-mark-heavy.svg`,
  width: 144,
  height: 48,
  correction: -0.1,
  shape: 'fictional · heavy strokes, 3:1, −10%',
};
const LIGHT: Mark = {
  name: 'Fenwright',
  src: `${STRESS_DIR}/client-mark-light.svg`,
  width: 144,
  height: 48,
  correction: 0.12,
  shape: 'fictional · hairline strokes, 3:1, +12%',
};
/* The 12:1 file, recorded as the sparse wordmark it is, so the guard has something to stop:
   at 0.16 it would be 56 × 1.32 × √12 = 257 wide. */
const ULTRAWIDE: Mark = {
  name: 'Gallowmere Holdings',
  src: `${STRESS_DIR}/client-mark-ultrawide.svg`,
  width: 360,
  height: 30,
  density: 0.16,
  shape: 'fictional · ultra-wide wordmark, 12:1, ink 0.16',
};

const STRESS: readonly Mark[] = [SQUARE, TALL, HEAVY, LIGHT];

/* The component's arithmetic, restated so each mark can carry its computed size as a label. The
   three numbers mirror --cmark-target-side / -height-max / -width-max in client-mark.css, and REF
   ClientMark's REFERENCE_DENSITY; if either changes, these labels go stale and the rendering does
   not — the rendering is the truth. */
const SIDE = 56;
const H_MAX = 40;
const W_MAX = 240;
const REF = 0.28;
/* Equal ink: the side scales by √(REF / density). The correction scales the capped size, and only
   the height cap applies again (ch05 §10's order, fix round 2). */
function computed({ width, height, correction = 0, density = REF }: Mark) {
  const r = width / height;
  const k = 1 + Math.max(-0.15, Math.min(0.15, correction));
  const optical = Math.sqrt(REF / Math.max(0.1, Math.min(0.6, density)));
  const fitted = Math.min(SIDE * optical * Math.sqrt(r), H_MAX * r, W_MAX);
  const w = Math.min(fitted * k, H_MAX * r);
  return `${Math.round(w)} × ${Math.round(w / r)}`;
}

/** The same record without its density: sized by its box alone, as before 9 Oct 2026. */
function boxOnly(mark: Mark): Mark {
  return { ...mark, density: undefined, name: `${mark.name} (box only)` };
}

/** A mark's props without its specimen label. */
function bare(mark: Mark): Omit<ClientMarkProps, 'className'> {
  const { shape, ...props } = mark;
  void shape;
  return props;
}

const SURFACES = ['paper', 'tint', 'ink', 'blue'] as const;

/* Labels only — the values live in client-mark.css, and the rendering is the truth. */
const INK: Record<(typeof SURFACES)[number], string> = {
  paper: 'neutral-600, 4.92:1',
  tint: 'neutral-600, 4.39:1',
  ink: 'neutral-300, 11.07:1',
  blue: 'brandeis-200, 3.78:1',
};

/** The composition the site uses: a list of marks in a Cluster, which owns both seams. */
function Strip({ marks }: { marks: readonly Mark[] }) {
  return (
    <Cluster as="ul" colGap="stack" rowGap="stack" align="center">
      {marks.map((mark) => (
        <li key={mark.name}>
          <ClientMark {...bare(mark)} />
        </li>
      ))}
    </Cluster>
  );
}

/**
 * The recommended composition for a set of known size: one equal cell per mark, each mark at its
 * cell's start edge, so the first column lines up with the heading above it and every column
 * starts on a track line. justifyItems stays at its default (stretch) on purpose: the li fills
 * its track, which is what lets a mark wider than the track shrink to it via max-inline-size — a
 * centred li would size to the mark and spill. {base: 2, md: 3, lg: 5} (§ 5.9): two tracks in the
 * 326 column are ~139, three in the 704 column ~202 and five in the 1240 column ~209. LatitudePay,
 * drawn by its density at 201 (158 on a phone), is the one mark that meets its cell: at 390 and
 * between 1024 and ~1130 it letterboxes to the track — the cost of a gapped grid. The boxed grid
 * (LogoGrid, /design/kit/logos) sets its columns so it does not.
 */
function Grid({
  marks,
  columns = { base: 2, md: 3, lg: 5 },
}: {
  marks: readonly Mark[];
  columns?: LayoutProps['columns'];
}) {
  return (
    <Layout as="ul" columns={columns} colGap="stack" rowGap="stack" align="center">
      {marks.map((mark) => (
        <li key={mark.name}>
          <ClientMark {...bare(mark)} />
        </li>
      ))}
    </Layout>
  );
}

export default function ClientMarkSpecimenPage() {
  return (
    <>
      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h1>ClientMark</h1>
            <p>
              One client&rsquo;s logo in a set. The client&rsquo;s SVG is drawn as a{' '}
              <strong>mask</strong> filled with <code>--cmark-ink</code>, so every mark in a set
              is one colour, the ground&rsquo;s ink, from one file on every surface. Each is
              sized to <strong>equal visual weight</strong>: the same area of ink, not the same
              width or the same box — its box scaled by its measured density — then capped at 40
              tall (ruling P2), with a 240 guard for the ultra-wide (ch05 §10).
            </p>
            <p>
              A logo strip is <strong>not</strong> a component. It is <code>ClientMark</code> ×
              n in a <code>Cluster</code>, which owns the gap. The strip is the real client set;
              the shapes it does not have yet are fictional stress files, drawn in black, and
              labelled so. A mark that renders light on ink proves the mask is doing the colour,
              not the file.
            </p>
          </Layout>

          <Specimen
            title="The strip — nine clients, one weight"
            note='Cluster as="ul", colGap and rowGap "stack" (48), align center. The marks set no spacing of their own. Ratios run from 3.4:1 (GT Tools) to 7.4:1 (LatitudePay), and no two are the same width.'
          >
            <Strip marks={STRIP} />
          </Specimen>

          <Specimen
            title="Equal cells — the grid"
            note='The grid of § 5.9. Layout as="ul", columns {{ base: 2, md: 3, lg: 5 }}, colGap and rowGap "stack", align "center", justifyItems left at stretch: one equal cell per mark, each at its cell’s start edge, so the columns line up with the heading. Nine marks sit 5 + 4 here, 3 × 3 at md and two to a row at 390. Still not a component: it is ClientMark × n in a Layout. Every H-band placement is composed at /design/kit/logos.'
          >
            <Grid marks={GRID_SET} />
          </Specimen>

          <Specimen
            title="The arithmetic, per mark"
            note="width = 56 × √(0.28 ÷ density) × √ratio (equal INK, 56² × 0.28 px² of it), capped so height ≤ 40 and width ≤ 240, then × (1 + correction) of that capped size, and the height cap again (P2). LatitudePay, the sparsest at 0.16, is drawn 201 wide; Doodle, the densest at 0.40, 97. The fictional square and stacked lockup carry no density, so they size as at 0.28, and reach the height cap first: the cap outranks the area, in ch05's order."
          >
            <Layout rowGap="block">
              {[...STRIP, SQUARE, TALL].map((mark) => (
                <Cluster key={mark.name} colGap="text" rowGap="tight" align="center">
                  <span className={s.ruler}>{computed(mark)}</span>
                  <ClientMark
                    src={mark.src}
                    name={mark.name}
                    width={mark.width}
                    height={mark.height}
                    correction={mark.correction}
                    density={mark.density}
                  />
                  <span className={s.specNote}>
                    {mark.name} · {mark.shape}
                  </span>
                </Cluster>
              ))}
            </Layout>
          </Specimen>

          <Specimen
            title="Citation size (sm)"
            note='size="xs" sets the same arithmetic on its own small step (target 40, height cap 24, width cap 120), one value at every width: Doodle about 70 × 16, Eden AI about 76 × 24. It is the mark in a claim&rsquo;s citation line, the case&rsquo;s own title beside it as the one link, with a moving arrow (decisions/2026-10-30-claim-citation, proposed).'
          >
            <Layout rowGap="block">
              {[C.DOODLE, C.EDEN_AI].map((c) => (
                <Cluster key={c.name} colGap="block" rowGap="tight" align="center">
                  <ClientMark
                    src={c.src}
                    name={c.name}
                    width={c.width}
                    height={c.height}
                    density={c.density}
                    size="xs"
                  />
                  <span className={s.specNote}>{c.name} · sm</span>
                </Cluster>
              ))}
              <Cluster colGap="block" rowGap="tight" align="center">
                <ClientMark
                  src={C.DOODLE.src}
                  name={C.DOODLE.name}
                  width={C.DOODLE.width}
                  height={C.DOODLE.height}
                  density={C.DOODLE.density}
                  size="xs"
                />
                <a href="#doodle-case">
                  Doodle enterprise scheduling UX: finding meeting times people will keep
                </a>
              </Cluster>
            </Layout>
          </Specimen>

          <Specimen
            title="Equal ink, against equal box"
            note="The four marks the 9 Oct review named. Above, each without its density: sized by its box alone, as before, and LatitudePay’s tracked hairline capitals and Quoter’s name inside its pill read about half the mass of Knovos and Doodle. Below, with it: the same files at the same area of ink. Quoter is measured with its pill left out — a frame is a container, not mass."
          >
            <Layout rowGap="stack">
              <Strip marks={[LATITUDEPAY, QUOTER, KNOVOS, DOODLE].map(boxOnly)} />
              <Strip marks={[LATITUDEPAY, QUOTER, KNOVOS, DOODLE]} />
            </Layout>
          </Specimen>

          <Specimen
            title="Shapes the set does not have yet"
            note="Fictional stress files among real marks: a square symbol, a stacked lockup, heavy strokes (−10%) and hairline strokes (+12%). They must sit in the strip at the same weight when a client like them arrives."
          >
            <Strip marks={[OMNY, ...STRESS.slice(0, 2), QUOTER, ...STRESS.slice(2), KNOVOS]} />
          </Specimen>

          <Specimen
            title="The weight correction, with and without"
            note="Fictional files, so the pairs read at a glance (the real set carries none since its densities were measured: the correction is for what a measurement cannot see). Same files, correction 0 on the left of each pair and the recorded value on the right. A heavy mark comes down, a hairline mark comes up. The last pair passes 0.4: it is clamped to +0.15 and warned in development."
          >
            <Layout rowGap="block">
              <Cluster colGap="stack" rowGap="stack" align="center">
                <ClientMark
                  src={HEAVY.src}
                  name={HEAVY.name}
                  width={HEAVY.width}
                  height={HEAVY.height}
                />
                <ClientMark {...bare(HEAVY)} />
                <span className={s.specNote}>heavy · 0 → −0.1</span>
              </Cluster>
              <Cluster colGap="stack" rowGap="stack" align="center">
                <ClientMark
                  src={LIGHT.src}
                  name={LIGHT.name}
                  width={LIGHT.width}
                  height={LIGHT.height}
                />
                <ClientMark {...bare(LIGHT)} />
                <span className={s.specNote}>hairline · 0 → +0.12</span>
              </Cluster>
              <Cluster colGap="stack" rowGap="stack" align="center">
                <ClientMark
                  src={LIGHT.src}
                  name={LIGHT.name}
                  width={LIGHT.width}
                  height={LIGHT.height}
                  correction={0.15}
                />
                <ClientMark
                  src={LIGHT.src}
                  name={LIGHT.name}
                  width={LIGHT.width}
                  height={LIGHT.height}
                  correction={0.4}
                />
                <span className={s.specNote}>
                  +0.15 beside 0.4 (clamped to +0.15) — identical
                </span>
              </Cluster>
            </Layout>
          </Specimen>

          <Specimen
            title="The width guard"
            note={`A sparse 12:1 wordmark would be ${Math.round(SIDE * Math.sqrt(REF / 0.16) * Math.sqrt(12))} wide at the target ink. It stops at 240, and its height follows (${computed(ULTRAWIDE)}). Shown beside LatitudePay, the widest real mark at 7.4:1 and ${computed(LATITUDEPAY)}: the guard stops the ultra-wide, and no real mark reaches it.`}
          >
            <Strip marks={[LATITUDEPAY, ULTRAWIDE]} />
          </Specimen>

          <Specimen
            title="A lone mark"
            note="One mark, still in the ground's ink and still at the set's size. ch05 §10 lets a mark shown alone beside its own case study be the client's full-colour version — that is the client's file in a Figure, not this component."
          >
            <ClientMark {...bare(OMNY)} />
          </Specimen>

          <Specimen
            title="Inside a link"
            note="Wrapped in a link to a case study, the mark stays --cmark-ink, not link blue: the colour is the ground's ink by token, not currentColor. The link takes its accessible name from the mark."
          >
            <Cluster colGap="stack" rowGap="stack" align="center">
              {/* A specimen-only anchor to nowhere on this page; a real one comes from @/lib/routes. */}
              <a href="#inside-a-link" id="inside-a-link">
                <ClientMark {...bare(LATITUDEPAY)} />
              </a>
              <a href="#inside-a-link">
                <ClientMark {...bare(DOODLE)} />
              </a>
            </Cluster>
          </Specimen>

          <Specimen
            title="A file that fails to load"
            note="The middle mark's src 404s. Its box is reserved at the computed size (here 97 × 32) and paints nothing; the name is still announced. It is deliberately NOT the name set as text: that would retype the client's name in our face, which ch05 §10 forbids. A missing src, an empty name or a zero size render nothing at all."
          >
            <Cluster as="ul" colGap="stack" rowGap="stack" align="center">
              <li>
                <ClientMark {...bare(OMNY)} />
              </li>
              <li className={s.bandOutline}>
                <ClientMark src="/clients/missing.svg" name="Hollins" width={120} height={40} />
              </li>
              <li>
                <ClientMark {...bare(QUOTER)} />
              </li>
            </Cluster>
          </Specimen>

          <Specimen
            title="Desktop and phone sizes, side by side"
            note="Below 768 the three sizes step down together (target side 56 → 44, height cap 40 → 32, width cap 160 → 128), so a 4:1 wordmark is 88 × 22. The upper row is the desktop size, the lower the phone step, rendered here at one viewport by swapping in the -m tokens."
          >
            <Layout rowGap="stack">
              <Strip marks={STRIP} />
              <div className={s.cmarkPhone}>
                <Strip marks={STRIP} />
              </div>
            </Layout>
          </Specimen>

          <Specimen
            title="The 326 column, at the phone sizes"
            note="The strip in the phone's content column, at the -m sizes a 390 window renders. It wraps into rows; the Cluster's rowGap is the seam between them, and no mark shrinks to stay on one line."
          >
            <div className={cx(s.trackMobile, s.cmarkPhone)}>
              <Strip marks={STRIP} />
            </div>
          </Specimen>

          <Specimen
            title="The 326 column, equal cells"
            note="The § 5.9 grid at base: two tracks, ~139 wide, at the phone sizes. The widest mark, LatitudePay at 137, fits its cell, so equal area holds at 390."
          >
            <div className={cx(s.trackMobile, s.cmarkPhone)}>
              {/* Two tracks at every width: the frame is 326 wide inside a wide window, so the
                  viewport breakpoints would otherwise give it five. */}
              <Grid marks={GRID_SET} columns={{ base: 2 }} />
            </div>
          </Specimen>
        </Layout>
      </Section>

      {/* Same markup on every ground, under a section heading, because the ink is judged against
          the heading: one step quieter than --sec-ink on each (client-mark.css, tracker 2.17). */}
      {SURFACES.map((surface) => (
        <Section key={surface} surface={surface}>
          <Specimen
            title={`surface="${surface}"`}
            note={`Same markup, no colour prop, same files. The ink is --cmark-ink for this ground: ${INK[surface]}. The heading is the section's full ink; the marks sit a step under it.`}
          >
            <Layout rowGap="stack">
              <h2>Teams we have shipped with</h2>
              <Grid marks={GRID_SET} />
            </Layout>
          </Specimen>
        </Section>
      ))}

      <Section surface="ink">
        <Specimen
          title="Nested: a tint band inside an ink band"
          note="The tint block in client-mark.css restates --cmark-ink, so marks inside a tint band nested in ink paint neutral-600, not ink's neutral-300."
        >
          <Section surface="tint">
            <Strip marks={STRIP} />
          </Section>
        </Specimen>
      </Section>
    </>
  );
}
