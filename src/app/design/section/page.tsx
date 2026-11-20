import { Layout, Section, type SectionDensity, type SectionSurface } from '@/components';

import { Box, Specimen, specimenStyles as s } from '../_specimen/Specimen';

const SURFACE_NOTES = {
  paper: 'The default and the origin — every other surface is a delta from it.',
  tint: 'Alternating rows, quote blocks, table headers. The rules step one deeper against the deeper ground — and so do the two muted inks, because neutral-600 on paper-deep is 4.39:1 and fails AA.',
  ink: 'The footer and the closing panel. Blue holds at 500 as a field, and lifts to 200 as text, because blue ink on neutral-950 reaches only 2.7:1.',
  blue: 'A pivot — one appearance per page, and it never touches an ink section. Blue cannot accent itself, so the accent goes to paper.',
} as const;

type SeamBand = {
  label: string;
  note: string;
  surface: SectionSurface;
  density?: SectionDensity;
  flush?: boolean;
  continues?: boolean;
};

/**
 * The seam sequence (2.17; the single seam reverted 30 Sep 2026). Order matters — every note describes the seam
 * between this band and the one before it, so the list is the proof and cannot be sorted.
 */
const SEAMS: readonly SeamBand[] = [
  {
    label: 'Seam · after a flush band — full air',
    note: 'The band above is flush: it has no bottom padding to serve as the seam, and it is flush because it hands the air to the next band. So this band keeps its top 96.',
    surface: 'paper',
  },
  {
    label: 'Seam · paper + paper — both paddings, 96 + 96',
    note: 'Follows a paper band and keeps its own top padding: the seam is 192. On one ground the air is what separates two arguments (reverted from the single seam, 30 Sep 2026).',
    surface: 'paper',
  },
  {
    label: 'Seam · paper continues paper — one padding, 96',
    note: 'continues (owner and Jatin, 19 Nov 2026): an article body under its hero takes no air above its content, so the seam is the band above\'s foot alone. Articles only; every other pair keeps both paddings.',
    surface: 'paper',
    continues: true,
  },
  {
    label: 'Seam · paper → tint — full air, 96 + 96',
    note: 'The surface changes, so the tone marks the boundary and both bands keep their full air. Different grounds are never merged.',
    surface: 'tint',
  },
  {
    label: 'Seam · tint + tint — both paddings, 96 + 96',
    note: 'The same on every surface: nothing merges.',
    surface: 'tint',
  },
  {
    label: 'Seam · tint → ink — full air again',
    note: 'The surface changes back; both sides keep their air.',
    surface: 'ink',
  },
];

/**
 * Section specimen. The dashed outline on the bands below is measuring chrome — it marks where
 * the band's content column starts and ends, which is otherwise invisible without colour.
 */
export default function SectionSpecimenPage() {
  return (
    <>
      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h1>Section</h1>
            <p>
              The full-width band. Insets its content to the one shared content column, applies
              the system-owned vertical rhythm, and provides the positioning context for
              full-bleed layers.
            </p>
            <p>
              One declaration does three jobs:{' '}
              <code>padding-inline: max(--sec-gutter, (100% - --sec-container) / 2)</code>.
              Below the cap the gutter wins; past it the centring term does. Both values, and
              the vertical air, come from the --sec-* token layer — this component states no
              distance of its own.
            </p>
          </Layout>

          <Specimen
            title="Vertical air — --sec-padding-y, 96 flat"
            note="One value per width (owner, 7 Oct 2026): 96 (--gap-section) from 768, 64 (--gap-column) below. The page's first band takes less above its content below 1024 — 48 on a tablet, 32 on a phone — so the hero does not open on a void under the nav. Besides it only strip (24, the announcement strip) and flush (0). There is no tight or open band. Two adjacent bands keep both paddings, on any surface; see the seam sequence below."
          >
            <div className={s.ruler}>content sits inside the vertical air</div>
          </Specimen>

          <Specimen
            title="Gutter — --sec-gutter, 32 flat · container — --sec-container, 1240"
            note="Narrow the window and the content edge holds a 32px gutter at every width. Widen past 1240 and the content stops growing and centres instead."
          >
            <div className={s.ruler}>content column — capped at 1240px</div>
          </Specimen>
        </Layout>
      </Section>

      <Section className={s.bandOutline}>
        <Layout rowGap="text">
          <p className={s.specTitle}>Two stacked Sections — the band boundary</p>
          <p className={s.specNote}>
            The dashed outline is chrome, not a border the primitive draws. Bands are separated
            by ground and whitespace, never by a rule — the surface specimens below show the
            tone doing that work. This band follows the paper band above and precedes another,
            and each seam is BOTH bands&apos; air: 96 + 96 on one ground.
          </p>
          <Box>band A</Box>
        </Layout>
      </Section>

      <Section className={s.bandOutline}>
        <Layout rowGap="text">
          <p className={s.specTitle}>The second band</p>
          <Box>band B</Box>
        </Layout>
      </Section>

      <Section flush className={s.bandOutline}>
        <Layout rowGap="text">
          <p className={s.specTitle}>flush — vertical rhythm zeroed</p>
          <p className={s.specNote}>
            For a composition that supplies its own vertical space; a full-bleed immersive hero
            is the case that needs it. Overrides density. The gutter and the content cap are
            unaffected.
          </p>
          <Box>flush band</Box>
        </Layout>
      </Section>

      {/* ── The seam between bands ─────────────────────────────────────────────────────────────
          Each band states its own surface and density, and its note says what the seam ABOVE it
          measures. Read the sequence top to bottom: the dashed outlines are the band edges. */}
      {SEAMS.map((band) => (
        <Section
          key={band.label}
          surface={band.surface}
          density={band.density}
          flush={band.flush}
          continues={band.continues}
          className={s.bandOutline}
        >
          <Layout rowGap="text">
            <p className={s.specTitle}>{band.label}</p>
            <p className={s.specNote}>{band.note}</p>
            <Box>
              surface=&quot;{band.surface}&quot;
              {band.density ? ` · density="${band.density}"` : ''}
              {band.flush ? ' · flush' : ''}
              {band.continues ? ' · continues' : ''}
            </Box>
          </Layout>
        </Section>
      ))}

      {(['paper', 'tint', 'ink', 'blue'] as const).map((surface) => (
        <Section key={surface} surface={surface}>
          <Layout rowGap="block">
            <Layout rowGap="tight">
              <p className={s.specTitle}>surface=&quot;{surface}&quot;</p>
              <p className={s.specNote}>
                {SURFACE_NOTES[surface]} Every --sec-* role is remapped in the token layer, so
                the heading, the muted note, the hairlines and the accent below all adapt
                without this page saying anything about colour.
              </p>
            </Layout>
            <h3>A heading on {surface}</h3>
            <Layout columns={3} colGap="block" rowGap="block">
              <Box>ink-muted on this ground</Box>
              <Box accent>accent</Box>
              <Box>hairline</Box>
            </Layout>
          </Layout>
        </Section>
      ))}

      <Section density="strip" surface="tint" className={s.bandOutline}>
        <Layout rowGap="text">
          <p className={s.specTitle}>density=&quot;strip&quot; — 24, the announcement strip</p>
          <Box>strip band (one line; Banner form=&quot;strip&quot; is its only caller)</Box>
        </Layout>
      </Section>

      <Section density="strip" flush className={s.bandOutline}>
        <Layout rowGap="text">
          <p className={s.specTitle}>density=&quot;strip&quot; flush — flush wins, 0</p>
          <Box>flush overrides every density, strip included</Box>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="text">
          <p className={s.specTitle}>as=&quot;div&quot; — the element is a prop</p>
          <p className={s.specNote}>
            Defaults to a semantic &lt;section&gt;. Use div / header / footer where the
            semantics call for it.
          </p>
          <Box>rendered as a div</Box>
        </Layout>
      </Section>
    </>
  );
}
