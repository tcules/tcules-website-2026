import { Layout, Section, Sketch, type SectionSurface, type SketchName } from '@/components';

import { Specimen } from '../_specimen/Specimen';

const NAMES: readonly SketchName[] = [
  'new-product',
  'product-design',
  'product-modernisation',
  'design-systems',
  'ai-product-ux',
  'design-engineering',
  'software-development',
  'audits',
];
/** The OFFER scenes drawn for the 26 Oct copy's specialist services (owner, 29 Oct 2026, Q7). */
const SPECIALIST: readonly SketchName[] = [
  'specialist-research',
  'specialist-ia',
  'specialist-ui',
  'specialist-dataviz',
  'specialist-prototype',
  'specialist-new-product',
  'specialist-audit',
  'specialist-readiness',
];
/** Every non-story scene that can sit on a tile: each makes one move on hover (S.7). */
const TILE: readonly SketchName[] = [
  'new-product',
  'specialist-research',
  'specialist-ia',
  'specialist-ui',
  'specialist-dataviz',
  'specialist-prototype',
  'specialist-new-product',
  'specialist-audit',
  'specialist-ai-copilots',
  'specialist-ai-search',
  'specialist-ai-hitl',
  'specialist-ai-trust',
  'specialist-ai-readiness',
  'specialist-ai-engineering',
  'specialist-ds-strategy',
  'specialist-ds-implementation',
  'specialist-ds-alignment',
  'specialist-ds-governance',
  'specialist-ds-audit',
  'specialist-redesign',
  'specialist-legacy',
  'specialist-replatforming',
  'specialist-modernisation-assessment',
  'specialist-saas-app',
  'specialist-frontend',
  'specialist-backend',
  'specialist-maintenance',
  'specialist-mobile',
  'specialist-prototype-review',
];
/** The article scenes: each drawn for one insight, its cover until a real one exists. */
const ARTICLE: readonly SketchName[] = [
  'code-review',
  'security-checklist',
  'prototype-to-production',
];
/** The kit scenes: EngagementOptions' scopes and TracePlates' stages, in the same grammar. */
const KIT: readonly SketchName[] = [
  'scope-feature',
  'scope-area',
  'scope-embedded',
  'scope-build',
  'scope-start',
  'scope-direct',
  'scope-inside',
  'scope-overlap',
  'scope-commercial',
  'trace-design',
  'trace-handoff',
  'trace-code',
  'trace-product',
  'trace-signoff',
];
/** The offer scenes What you get draws, one per promise. */
const OUTCOME: readonly SketchName[] = [
  'outcome-explain',
  'outcome-rules',
  'outcome-build',
  'outcome-finished',
  'outcome-brief',
];
/** The term scenes of "What you get" (round 6): what we need from you, and where our part stops. */
const TERMS: readonly SketchName[] = [
  'needs-product-design',
  'needs-ai-product-ux',
  'needs-design-engineering',
  'needs-design-systems',
  'needs-new-product',
  'needs-product-modernisation',
  'needs-software-development',
  'stops-product-design',
  'stops-ai-product-ux',
  'stops-design-engineering',
  'stops-design-systems',
  'stops-new-product',
  'stops-product-modernisation',
  'stops-software-development',
];
/** About's working terms (owner, 1 Nov 2026): one scene per term, drawn as a set. */
const WORKING_TERMS: readonly SketchName[] = [
  'scope-who',
  'scope-communication',
  'scope-response',
  'scope-getting-started',
  'scope-turnaround',
  'scope-hours',
];
/** "Who does the work" (round 7): our team frame with the roles beside it, one per service page. */
const TEAM: readonly SketchName[] = [
  'team-product-design',
  'team-ai-product-ux',
  'team-design-engineering',
  'team-design-systems',
  'team-new-product',
  'team-product-modernisation',
  'team-software-development',
];
/** The L1 outcome scenes of the six service lines' "What you get": all twenty-one, every redraw visible here. */
const L1_OUTCOME: readonly SketchName[] = [
  'outcome-ai-steps',
  'outcome-ai-checks',
  'outcome-tried-in-code',
  'outcome-hard-component',
  'outcome-code-in-repo',
  'outcome-ds-tokens',
  'outcome-ds-docs',
  'outcome-ds-first-release',
  'outcome-ds-route-for-change',
  'outcome-five-choices',
  'outcome-build-parts',
  'outcome-break-points',
  'outcome-part-calls',
  'outcome-habits-record',
  'outcome-one-workflow',
  'outcome-old-new',
  'outcome-small-releases',
  'outcome-release-checks',
  'outcome-release-support',
  'outcome-designed-first',
  'outcome-launch-support',
];
const SURFACES: readonly SectionSurface[] = ['paper', 'tint', 'ink'];
/** The scenes with a STORY drawing: the six the home bento shows, and Audits (About's eighth tile). */
const STORY: readonly SketchName[] = NAMES.filter((name) => name !== 'new-product');

export default function SketchSpecimen() {
  return (
    <>
      <Section>
        <Layout rowGap="block">
          <h1>Sketch</h1>
          <p>
            A small drawing on its 16:9 plate, a stand-in where a block needs a visual subject
            and no illustration exists: one scene per service (home and About selectors), in the
            plate language of EngagementOptions and TracePlates. Decorative. The
            selector&rsquo;s answer on the ideal About leads with it.
          </p>
        </Layout>
      </Section>
      {SURFACES.map((surface) => (
        <Section key={surface} surface={surface}>
          <Specimen title={`S.1 · the service scenes · ${surface}`}>
            <Layout columns={{ base: 1, md: 2, lg: 3 }} colGap="gutter" rowGap="gutter">
              {NAMES.map((name) => (
                <Layout key={name} rowGap="tight">
                  <Sketch name={name} />
                  <code>{name}</code>
                </Layout>
              ))}
            </Layout>
          </Specimen>
          <Specimen
            title={`S.2 · the article scenes · ${surface}`}
            note="Owner, 13 Oct 2026: each drawn for ONE insight from its own argument, its cover until a real one exists, and assigned to it by name in data. Never a service scene as a cover. Each faces left, toward the copy it sits beside."
          >
            <Layout columns={{ base: 1, md: 2, lg: 3 }} colGap="gutter" rowGap="gutter">
              {ARTICLE.map((name) => (
                <Layout key={name} rowGap="tight">
                  <Sketch name={name} />
                  <code>{name}</code>
                </Layout>
              ))}
            </Layout>
          </Specimen>
          <Specimen
            title={`S.4 · the kit scenes · ${surface}`}
            note="Owner, 26 Oct 2026 (S2): EngagementOptions' scopes and TracePlates' stages, drawn by Sketch in the same grammar as the service and article scenes, so the flat families cannot drift apart. The trace stages share one screen; its action sits on the trace's line at (110, 110)."
          >
            <Layout columns={{ base: 1, md: 2, lg: 3 }} colGap="gutter" rowGap="gutter">
              {KIT.map((name) => (
                <Layout key={name} rowGap="tight">
                  <Sketch name={name} />
                  <code>{name}</code>
                </Layout>
              ))}
            </Layout>
          </Specimen>
          <Specimen
            title={`S.5 · the specialist services · ${surface}`}
            note="Owner, 26 Oct 2026, and 29 Oct 2026 (Q7): the product-design page's services you can hire on their own, each drawn from its own Best for line, drawn bare on the bento's tiles and held still. New Product Design (the prototype that holds everything made the release that holds one job for one person, what it leaves out hatched) and the UX & Product Audit (the lens finding what is wrong on the screen) joined the five. Plate above, bare (as the bento sets them) below."
          >
            <Layout columns={{ base: 1, md: 2, lg: 3 }} colGap="gutter" rowGap="gutter">
              {SPECIALIST.map((name) => (
                <Layout key={name} rowGap="tight">
                  <Sketch name={name} />
                  <Sketch name={name} frame="bare" />
                  <code>{name}</code>
                </Layout>
              ))}
            </Layout>
          </Specimen>
          <Specimen
            title={`S.3 · the story drawings, rest and solved · ${surface}`}
            note="Owner, 25 Oct 2026: the bento's service drawings, redrawn to the flat-graphics grammar, the problem at rest and solved when the link they sit in is hovered or focused, in one move on the owner's hover curve. Left: at rest (hover it). Right: held solved. Bare frame, as the bento sets them. On a plate the same drawing is held solved and does not move (S.1)."
          >
            <Layout columns={{ base: 1, md: 2 }} colGap="gutter" rowGap="gutter">
              {STORY.map((name) => (
                <Layout key={name} rowGap="tight">
                  <Layout columns={2} colGap="gutter" rowGap="tight">
                    <a
                      href={`#story-${surface}-${name}`}
                      id={`story-${surface}-${name}`}
                      aria-label={`Hover: ${name}`}
                    >
                      <Sketch name={name} frame="bare" story />
                    </a>
                    <Sketch name={name} frame="bare" story end />
                  </Layout>
                  <code>{name}</code>
                </Layout>
              ))}
            </Layout>
          </Specimen>
          <Specimen
            title={`S.7 · the tile drawings, rest and moved · ${surface}`}
            note="Owner, 30 Oct 2026 (decisions/2026-10-30-service-tile-drawing-moves-on-hover): every tile drawing makes ONE transform-only move when its link is hovered or focused, on the tile's curve: a part moves (Move) or arrives (GrowIn). Left: at rest (hover it). Right: held moved. Bare frame, as the bento sets them; a plate never moves. Reduced motion holds rest."
          >
            <Layout columns={{ base: 1, md: 2, lg: 3 }} colGap="gutter" rowGap="gutter">
              {TILE.map((name) => (
                <Layout key={name} rowGap="tight">
                  <Layout columns={2} colGap="gutter" rowGap="tight">
                    <a
                      href={`#tile-${surface}-${name}`}
                      id={`tile-${surface}-${name}`}
                      aria-label={`Hover: ${name}`}
                    >
                      <Sketch name={name} frame="bare" story />
                    </a>
                    <Sketch name={name} frame="bare" story end />
                  </Layout>
                  <code>{name}</code>
                </Layout>
              ))}
            </Layout>
          </Specimen>
          <Specimen
            title={`S.6 · the What you get scenes · ${surface}`}
            note="The offer scenes a service page's promises carry (owner, 26 Oct 2026). outcome-brief was drawn 29 Oct 2026 for the 26 Oct copy's first deliverable on /services/product-design, a tested brief: the person's route arrives at what goes in (the one check), what waits sits in a quiet panel with its clock, what stays out is hatched."
          >
            <Layout columns={{ base: 1, md: 2, lg: 3 }} colGap="gutter" rowGap="gutter">
              {OUTCOME.map((name) => (
                <Layout key={name} rowGap="tight">
                  <Sketch name={name} />
                  <code>{name}</code>
                </Layout>
              ))}
            </Layout>
          </Specimen>
          <Specimen
            title={`S.7 · the term scenes · ${surface}`}
            note="Round 6, 30 Oct 2026 (decisions/2026-10-30-what-you-get-titled-terms-four-parts). needs-* is the handover, read left to right: the client's inputs on their panel routed into our frame, the decisive input lit. stops-* is the boundary: our last piece routed to our check on its own card, what stays theirs on their panel (the same ground as the client panel), no route into it. Round 7: the dashed wall is gone. One pair per service page, drawn from that page's own words."
          >
            <Layout columns={{ base: 1, md: 2, lg: 3 }} colGap="gutter" rowGap="gutter">
              {TERMS.map((name) => (
                <Layout key={name} rowGap="tight">
                  <Sketch name={name} />
                  <code>{name}</code>
                </Layout>
              ))}
            </Layout>
          </Specimen>
          <Specimen
            title={`S.8 · who does the work · ${surface}`}
            note="Round 7, 30 Oct 2026 (decisions/2026-10-30-what-you-get-label-rows). Our team frame, the senior designer lit and the account lead; roles always in the team are solid and routed in, specialists who join when needed are dashed with an open end."
          >
            <Layout columns={{ base: 1, md: 2, lg: 3 }} colGap="gutter" rowGap="gutter">
              {TEAM.map((name) => (
                <Layout key={name} rowGap="tight">
                  <Sketch name={name} />
                  <code>{name}</code>
                </Layout>
              ))}
            </Layout>
          </Specimen>
          <Specimen
            title={`S.10 · the working terms · ${surface}`}
            note="Owner, 1 Nov 2026: About's six terms of how Tcules works with clients, one scene per term from its own sentence, drawn as one set."
          >
            <Layout columns={{ base: 1, md: 2, lg: 3 }} colGap="gutter" rowGap="gutter">
              {WORKING_TERMS.map((name) => (
                <Layout key={name} rowGap="tight">
                  <Sketch name={name} />
                  <code>{name}</code>
                </Layout>
              ))}
            </Layout>
          </Specimen>
          <Specimen
            title={`S.9 · the L1 outcomes · ${surface}`}
            note="All twenty-one outcome scenes of the six service lines, redrawn in round 7 so every mark sits in a frame and every route runs from one frame's edge to another's."
          >
            <Layout columns={{ base: 1, md: 2, lg: 3 }} colGap="gutter" rowGap="gutter">
              {L1_OUTCOME.map((name) => (
                <Layout key={name} rowGap="tight">
                  <Sketch name={name} />
                  <code>{name}</code>
                </Layout>
              ))}
            </Layout>
          </Specimen>
        </Section>
      ))}
    </>
  );
}
