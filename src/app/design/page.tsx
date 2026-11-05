import Link from 'next/link';

import { Cluster, Layout, Section } from '@/components';

/**
 * The proving ground index.
 *
 * Grouped by tier, and the grouping is read from what actually exists rather than from folder
 * structure — a specimen route is registered here by hand when its component is built, which
 * keeps this list honest about coverage.
 *
 * The rule: nothing gets a page route before it has a route here.
 */
const SPECIMENS = [
  {
    tier: 'Foundations',
    items: [
      {
        href: '/design/typography',
        name: 'Typography',
        note: 'every --text-* role, the ladders under them, title and running-text wrap at the CU04 ceilings, and the Prose rich-text flow',
      },
    ],
  },
  {
    tier: 'Primitives',
    items: [
      {
        href: '/design/section',
        name: 'Section',
        note: 'band, content column, vertical rhythm',
      },
      {
        href: '/design/layout',
        name: 'Layout',
        note: 'columnar axis — tracks, the two seams, a leading item, and the scroll row (until-md | always)',
      },
      { href: '/design/cluster', name: 'Cluster', note: 'inline axis — wrapping rows' },
      {
        href: '/design/island',
        name: 'Island',
        note: 'a bounded ground inside a band, set per instance — paper or tint, never its band’s own; 8 radius, no edge, the band’s air as its inset, the page gutter kept at 390; texture inside; 4 pairings',
      },
      {
        href: '/design/button',
        name: 'Button',
        note: 'a showcase — blue solid (the page’s one main action) + blue ghost partner + link, in a page; sizes, states, icons, the outline stepper, chrome-only neutral, 4 surfaces',
      },
      {
        href: '/design/input',
        name: 'Input',
        note: 'native input and textarea, box and line appearances, rest · invalid · disabled for both shapes and both appearances on 4 surfaces',
      },
      { href: '/design/icon', name: 'Icon', note: 'the glyph set, 4 size roles, currentColor' },
      {
        href: '/design/media',
        name: 'Media',
        note: 'the image asset — 4 kinds × 4 surfaces, cut-out shadow and panels, srcset, intrinsic vs fill, photograph ratio · focus · radius, stress shapes',
      },
      {
        href: '/design/clip',
        name: 'Clip',
        note: 'the silent film — wide and tall renditions, wide only, a narrow column; plays once in view, pause / play again, no autoplay under reduced motion',
      },
      {
        href: '/design/chip',
        name: 'Chip',
        note: 'one choice in a set — a real checkbox or radio drawn as a pill; edge at rest, blue fill and tick when checked, a lift on hover; rest · checked · disabled on 4 surfaces, long labels wrapping; and look=index, the rail entry (no pill, the blue start-edge bar when checked) the insights finder’s filters are, on 4 surfaces',
      },
      {
        href: '/design/tag',
        name: 'Tag',
        note: 'inert mark and filter chip — one box, inverted enclosure, four surfaces, held state',
      },
      {
        href: '/design/logo',
        name: 'Logo',
        note: 'the wordmark — 3 heights, 2 bar treatments, 4 surfaces',
      },
      {
        href: '/design/client-mark',
        name: 'ClientMark',
        note: "a client's logo in a set — mask in the ground's ink, equal area of ink by measured density, capped 40 tall, 240 wide guard, ±15% correction, 4 surfaces",
      },
      {
        href: '/design/sketch',
        name: 'Sketch',
        note: 'a small drawing on its 16:9 plate, one scene per service (seven), a stand-in for an illustration in the home and About selectors; 3 surfaces',
      },
      {
        href: '/design/situation-figure',
        name: 'SituationFigure',
        note: 'the home gateway’s six isometric drawings, each a situation in two states (rest the problem, end solved), played as one motion when its link is hovered or focused; rest and end side by side, and live; paper only',
      },
      {
        href: '/design/brand-mark',
        name: 'BrandMark',
        note: 'third-party marks (LinkedIn, YouTube, Clutch) at their own proportions, monochrome, 4 surfaces',
      },
      {
        href: '/design/rating-badge',
        name: 'RatingBadge',
        note: 'a third-party score and its source as one outline pill, mark passed in, 4 surfaces',
      },
      {
        href: '/design/star-rating',
        name: 'StarRating',
        note: 'one review score as five stars — filled, half, empty — glyph passed in, md and sm, 4 surfaces',
      },
      {
        href: '/design/stat',
        name: 'Stat',
        note: 'one figure, its unit and what it counts — lg and md, start or centred, beside its label below 768, ink numeral, blue mark on the opening rule, 3 surfaces',
      },
      {
        href: '/design/arena',
        name: 'Arena',
        note: 'the home hero drawing — the field of apps, one rising onto the studio floor, looping; fetched after paint, paused out of view, still under reduced motion; 1024/720 and the square phone cut',
      },
      {
        href: '/design/texture',
        name: 'Texture',
        note: 'the pixel grid through placed, blurred shapes — 4 anchors, 4 surfaces, dark-ground candidates',
      },
      {
        href: '/design/typography',
        name: 'Prose',
        note: 'the rich-text flow — specimen lives on the typography route',
      },
    ],
  },
  {
    tier: 'Patterns',
    items: [
      {
        href: '/design/breadcrumbs',
        name: 'Breadcrumbs',
        note: 'the ancestor trail — depth ladder, collapse, 4 surfaces, its own band',
      },
      {
        href: '/design/filter-panel',
        name: 'FilterPanel',
        note: 'a listing’s filters in a side panel — groups of chips, Reset and Apply by GET, a popover with no script; in effect, none, one group, 4 surfaces',
      },
      {
        href: '/design/index-rail',
        name: 'IndexRail',
        note: 'a curated listing page’s rail beside its content — views (switching the whole column, held in ?view=; the case-study index’s BY STAGE / BY INDUSTRY), a picker of sibling pages, and controls: the insights finder’s search and filter groups in the rail’s place, one Filters button on a phone',
      },
      {
        href: '/design/teaser',
        name: 'Teaser',
        note: 'one linked piece without an edge — stack, beside and row; four title steps; cover, drawn scene or typographic; date anchor, play mark, compact phone row; 4 surfaces',
      },
      {
        href: '/design/table-of-contents',
        name: 'TableOfContents',
        note: 'the outline of a long-form document — sticky rail, live mark, 2 arrangements, 4 surfaces',
      },
      {
        href: '/design/content-section',
        name: 'ContentSection',
        note: 'one CMS section as one band — stacked | beside | media (split-head retired), align center, aside, actions, footer, 4 surfaces, stress copy, absent slots, 390',
      },
      {
        href: '/design/banner',
        name: 'Banner',
        note: 'the I band and the announcement strip — below (stacked head over 3:1) | beside (3:2 or illustration, both sides) | strip, absent slots, stress, 3 surfaces',
      },
      {
        href: '/design/statement',
        name: 'Statement',
        note: 'the J band — one sentence at the h1 role as h2 | p (display retired), one uniform ink, graphic slot, eyebrow directly above it, start | center, head-half and corner texture, action, 3 surfaces',
      },
      {
        href: '/design/kit/banner',
        name: 'Kit · cmp-banner',
        note: 'the family page — every Banner, Statement and strip variation as a page would place it',
      },
      {
        href: '/design/cta-row',
        name: 'CtaRow',
        note: 'a band’s one link action — rule, note, centred cap, narrow tracks, 4 surfaces, in a band',
      },
      {
        href: '/design/slider',
        name: 'Slider',
        note: 'a row you move — Layout scroll, perView 1 | 2 | 3 | 4, align start | center, C-image-5+ and G bands, unfocusable slides, edge counts, 4 surfaces',
      },
      {
        href: '/design/cta-section',
        name: 'CtaSection',
        note: 'the commercial close — 3 arrangements, accepted ask ladder, 4 surfaces',
      },
      {
        href: '/design/enquiry-form',
        name: 'EnquiryForm',
        note: 'enquiry, audit, contact and compact field sets — async lifecycle, 4 surfaces',
      },
      {
        href: '/design/process-flow',
        name: 'ProcessFlow',
        note: 'stages in order with their items, arrows between, an optional lane held throughout — 4 surfaces',
      },
      {
        href: '/design/thread',
        name: 'Thread',
        note: 'stages one decision passes through on one blue line — 2 to 12 stages, the return arc, vertical below 1024, 3 surfaces',
      },
      {
        href: '/design/kit/how-we-work',
        name: 'EngagementModel',
        note: 'the "How we work" USP band — one chart over time keyed by three points; full and compact, paper and tint, stress copy',
      },
      {
        href: '/design/steps',
        name: 'Steps',
        note: "ListCard's set mode, the approved F body — 2 to 5 numbered rows, one title size, one title track, two body budgets",
      },
      {
        href: '/design/list-card',
        name: 'ListCard',
        note: 'the ruled row — 2 arrangements, 3 marker fills, linked states, 4 surfaces, the ReadDown set (1 or 2 columns, the photo form, the rail)',
      },
      {
        href: '/design/block-card',
        name: 'BlockCard',
        note: 'the borderless card — cover media via Media, text-only sets, the featured set, the set-stated crop and the phone pair, 4 surfaces; the panel (a piece with no picture), the date at the label line’s end and the topic tag under the copy',
      },
      {
        href: '/design/contrast',
        name: 'Contrast',
        note: 'the N band body — two opposite lists in peer halves, check blue and cross quiet ink, unequal sides, stress, with a CtaRow, 4 surfaces',
      },
      {
        href: '/design/accordion',
        name: 'Accordion',
        note: 'the native disclosure set — multi-open behavior, rich answers, 4 surfaces; size=sm with composed bodies, the insights finder’s filter groups (label heads, neutral chevrons)',
      },
      {
        href: '/design/proof',
        name: 'Proof',
        note: 'the evidence block — display (start | center), compact, featured portrait, case, group, rating-led, checked figures, 4 surfaces',
      },
      {
        href: '/design/profile-card',
        name: 'ProfileCard',
        note: 'a person (square or circle portrait, name, position, bio, LinkedIn foot) in the testimonial panel, and ProfileFollow, the one follow banner under a set; 3 surfaces',
      },
      {
        href: '/design/contributors',
        name: 'Contributors',
        note: 'the people behind a piece, after its content — about the author(s), in this episode; portrait or outlined initials, name, role, more-from link; 3 surfaces',
      },
      {
        href: '/design/testimonial',
        name: 'Testimonial',
        note: 'the rated testimonial card (md box, sm unboxed), the wall (row of peers, column stacks, staggered), beside its case, 4 surfaces',
      },
      {
        href: '/design/case-card',
        name: 'CaseCard',
        note: "one featured case as one card — the 16:9 cover beside its claim, the whole card the case's link; reverse, a story with its own link, no eyebrow with a long claim, the 326 track, 4 surfaces. No testimonial (22 Oct 2026)",
      },
      {
        href: '/design/offer-sheet',
        name: 'OfferSheet',
        note: 'what you get, as one offer — four promises beside the anchored testimonial, no aside, the six ceiling, paper and tint',
      },
      {
        href: '/design/offer-parts',
        name: 'OfferParts',
        note: 'what you get as four rows in a label column — the deliverables as a drawn strip, then who does the work, what we need and where our part stops each a 16:9 drawing beside its words; five, four and six deliverables, two parts, one part, an undrawn part, tint',
      },
      {
        href: '/design/collage',
        name: 'Collage',
        note: "a band's words in one corner and six studio photographs round them in an L — home's people behind Tcules with the owner's crops, one paragraph, four paragraphs (stress), tint",
      },
      {
        href: '/design/bento',
        name: 'Bento',
        note: 'linked tiles of two sizes on four tracks, each its drawing on the plate inside the card — the six-tile diagonal (home What we do), four single, two wide, tint, ink and blue',
      },
      {
        href: '/design/reasons',
        name: 'Reasons',
        note: 'why choose us — four argued reasons 2×2, each with an isometric drawing of its claim; open, boxed (the set in one rounded frame) and beside, the longest copy, three and six reasons, a bare head, tint',
      },
      {
        href: '/design/claim-set',
        name: 'ClaimSet',
        note: "a page's hard parts — tabs on a stage (one slide moving as one piece, autoplay with no control), four of five without an example, two claims, and the page layout, ruled",
      },
      {
        href: '/design/voice-ledger',
        name: 'VoiceLedger',
        note: "complaints in the customer's words, each answered by where we start — five rows, a lead, a linked reply, a wrapping complaint, paper and tint",
      },
      {
        href: '/design/case-spread',
        name: 'CaseSpread',
        note: 'one worked example — problem, what we did and the result on one rail (blue at the result) beside its sticky 16:9 evidence; three steps, no action, paper and tint',
      },
      {
        href: '/design/engagement-options',
        name: 'EngagementOptions',
        note: 'ways to work with us — image cards two by two, each scope drawing on its 16:9 plate, and a note; alternating rows explored; three options, one with no drawing, shared terms as one plain row under the set, paper and tint',
      },
      {
        href: '/design/trace-plates',
        name: 'TracePlates',
        note: 'one screen followed through every hand-over — a drawn plate per stage (design, handoff, code, running product, sign-off) and one dashed trace through them; across and down, three stages, paper and tint',
      },
      {
        href: '/design/callout',
        name: 'Callout',
        note: 'the quiet scope note — semantic routing, placement equivalence, narrow tracks, 4 surfaces',
      },
      {
        href: '/design/figure',
        name: 'Figure',
        note: 'the captioned image — slot ladder, 3 intrinsic ratios uncropped, the empty state, 4 surfaces, a row per Media kind',
      },
      {
        href: '/design/data-table',
        name: 'DataTable',
        note: 'the comparison table, always boxed — 1 to 5 data columns, column behaviour, marks, the stacked order at 326 and 392, a split record that joins below 1024, 4 surfaces',
      },
      {
        href: '/design/page-hero',
        name: 'PageHero',
        note: 'the page opening — stacked · beside × every media kind, CU04 budgets, slot and paragraph ladders, 4 surfaces, 326',
      },
      {
        href: '/design/kit/hero',
        name: 'Kit · Hero family',
        note: 'the nine hero shapes — illustration, photograph 5:4, no media, centred comparison — with texture, tags and an announcement, measured at 1470 × 830',
      },
      {
        href: '/design/site-nav',
        name: 'SiteNav',
        note: 'the header — bar, the morphing plate at 3 widths, the mobile sheet, 4 surfaces',
      },
      {
        href: '/design/site-footer',
        name: 'SiteFooter',
        note: 'the footer — 5 bands, the directory and its accordions, the rating badge, 4 surfaces',
      },
    ],
  },
  {
    tier: 'Kit',
    items: [
      {
        href: '/design/kit/media-split',
        name: 'Kit · Media split',
        note: 'band B: 4:5 photo beside H-full and tiles, either side, two tiles + a pinned CtaRow, head + CtaRow centred, counterweight texture, studio against stock',
      },
    ],
  },
  {
    tier: 'Templates',
    items: [
      {
        href: '/design/listing-index',
        name: 'ListingIndex',
        note: 'the one listing page type: the insights hub, curated BY TYPE until something is picked in the finder (the filters in the rail: ?type=articles&topic=… — the picks as chips over a three-track grid of results, Show more in place, Nothing matches keeps the picks) and the case-study index (?data=cases: BY STAGE / BY INDUSTRY, each group its featured cases as the card-less horizontal lead, one to a row, then the same three-track grid as the hub) — one hero, rail, section head and close; ?state=sparse thins either, ?state=empty has nothing to list',
      },
      {
        href: '/design/case-story',
        name: 'CaseStory',
        note: 'a case study as a story — chapters with a still marker column, steps, pull quotes, a principle band and annotated figures — at the Benchmark Gensuite case copied locally from Strapi',
      },
      {
        href: '/design/about-ideal',
        name: 'StudioPage',
        note: 'the About page with its copy edited for consumption (fixtures/ideal/about.ts): one idea per band, a different arrangement each — compare with /about',
      },
      {
        href: '/design/service-page',
        name: 'ServicePage',
        note: 'the six service lines, designed from their own content rather than the CMS translation; ?slots=1 shows the images each is designed to carry',
      },
      {
        href: '/design/corpus-page',
        name: 'CorpusPage',
        note: 'the templates the _pages corpus renders through: HomePage for /, OfferPage for a service, an audit or an expertise page, LongformPage for a case, an article, a term or a free tool and the grouped case-study index, each shown with the plan that decided its bands',
      },
      {
        href: '/design/share-cards',
        name: 'Share cards',
        note: "every page's Open Graph image at feed size, generated from its H1 and eyebrow (ch10 Part C layout T), grouped by kind — the hero cuts are reviewed here",
      },
    ],
  },
  {
    tier: 'Kit families',
    items: [
      {
        href: '/design/kit/process',
        name: 'Kit · process and stats',
        note: 'F process (Steps: 4 / 5 / example / CtaRow), S stats (4 centred, 3 + CtaRow), the D stat aside, Stat sizes, a Thread E band, ProcessFlow for comparison',
      },
      {
        href: '/design/kit/how-we-work',
        name: 'Kit · How we work',
        note: 'EngagementModel, the USP band: the engagement model drawn as one chart keyed by three points — full (paper, tint with an action, stress copy) and compact for service pages (paper, tint)',
      },
      {
        href: '/design/kit/logos',
        name: 'Kit · Client logos',
        note: 'band H, the boxed grid (r7): context line, led by the rating badge, beside a short h4 heading, 12 cells, open edges, surfaces',
      },
      {
        href: '/design/kit/logos',
        name: 'LogoGrid',
        note: 'client marks in boxed hairline cells (closed by default, open the alternative); columns from the count so rows are full at 8, 9 and 12; two across on a phone; a missing SVG as a typeset wordmark beside drawn marks',
      },
      {
        href: '/design/kit/gateway',
        name: 'Gateway',
        note: 'home’s six situations. G.0 board (home since round 11): all six at once on paper, drawing, title and sentence, the whole item a link that plays its SituationFigure. G.1–G.3: the earlier selector on paper and tint, and the expanding rows',
      },
      {
        href: '/design/kit/facts',
        name: 'Kit · Facts and figures',
        note: 'never combine proof types: the rating on its own (score size, badge as source) and the studio record on its own (three figures on tint, two beside the head), plain stats',
      },
      {
        href: '/design/kit/cta',
        name: 'Kit · CTA',
        note: 'the K offer (photo, icon, plain and beside) and the L close (form, no points, two actions) as finished bands, the closing texture, and CtaRow inside two ContentSections',
      },
      {
        href: '/design/kit/testimonials',
        name: 'Testimonials (G)',
        note: 'typographic, G-case, featured portrait, groups of 2 and 3, slider, rating-led — each with and without a CtaRow, on tint, at 1470 and 390',
      },
      {
        href: '/design/kit/video-testimonial',
        name: 'VideoTestimonial',
        note: 'a client interview on film: featured (16:9 poster in [3, 2], display quote beside) under a head on paper and alone on tint, and wide (3:1 poster across the column, opening to 16:9 on play; quote and credit in one row below), and portrait (9:16 poster beside the quote from 768, 4:5 crop opening to 9:16 below; paper captioned, tint uncaptioned, ink proof); one film per band and the band’s only testimonial; poster, play disc, captions track slot, no autoplay, focus hand-off, reduced motion',
      },
      {
        href: '/design/kit/form',
        name: 'Kit · Form',
        note: 'the enquiry form family — the L close beside copy, the compact form beside a 4:5 photo (both sides), standalone under a centred and a beside head, the offer, every variant, error and success',
      },
      {
        href: '/design/kit/feature',
        name: 'Kit · Feature',
        note: 'the feature family (C) and resources (M) — image, text, icon and pair sets on ContentSection, mixed sets and stand-ins, the Slider at six, the phone scroll row',
      },
      {
        href: '/design/kit/readdown',
        name: 'Kit · read-down, FAQ and contrast',
        note: 'D read-down (ReadDown: 1 or 2 columns, the photo form or a stat aside, CtaRow, rail on the photo side), D-faq (5 centred, 4 + CtaRow, each followed by an image band), N contrast (4 + 4, with a CtaRow), D on tint',
      },
      {
        href: '/design/kit/service-list',
        name: 'Kit · Service list',
        note: 'the service router in three forms — icon (C-icon-6 and C-icon-4 + CtaRow, photo aside), image (three centred, four with per-card CTAs, six as a Slider) and list (thumbnail rows beside a head with actions) — every link from routes.ts',
      },
      {
        href: '/design/kit/home',
        name: 'Kit showcase · Home',
        note: 'the home page composed from the kit, warm family, 12 bands — the strip and the 5:4 photograph hero, the real marks and rating, three services under a stacked head, a two-tone statement, the wireframe wall at the photograph weight with two tiles, the client slider on tint, four stats centred, the method beside its photograph, one 3:1 studio banner, questions, two pieces of writing and the close with its contact strip; texture head-half / closing',
      },
      {
        href: '/design/kit/about',
        name: 'Kit showcase · About',
        note: 'the studio page from the reviewed components, each once, 7 bands alternating stacked / split / centred — the Holi panorama hero (one solid, its ghost), a week of hairline tiles beside the studio board, the statement with its graphic slot, the engagement model compact, one wide video testimonial on tint, the rating on its own, and the open close',
      },
      {
        href: '/design/kit/services',
        name: 'Kit · Services',
        note: 'r7-cards — sections of clickable cards: eyebrow, heading and body, then three, four or six cards; icon cards with the glyph at the title em, numbered text cards on tint, cta-cued audits and six text cards under a centred head; no decorative image, no boxes',
      },
      {
        href: '/design/kit/services-index',
        name: 'Kit showcase · Services index',
        note: 'the services index composed from the kit, cool family, 11 bands — the title-led hero with a 4:1 panorama, the six-service router, a statement with head-half, four audits, fit beside a photograph, two cases over the horizon, the real rating on tint, the sprint offer, questions, a 3:1 banner and the open close',
      },
    ],
  },
] as const;

export default function DesignIndexPage() {
  return (
    <Section>
      <Layout rowGap="stack">
        <Layout rowGap="block">
          <h1>Proving ground</h1>
          <p>
            Every component and every arrangement, rendered. Nothing gets a page route before it
            has a route here, and the list is registered by hand so it stays honest about what
            is actually covered.
          </p>
        </Layout>

        {SPECIMENS.map((group) => (
          <Layout key={group.tier} rowGap="block">
            <h2>{group.tier}</h2>
            {/* Every tier has a specimen now, so there is no empty branch; a tier with none yet is
                left out of SPECIMENS until it has one. */}
            <Layout as="ul" rowGap="tight">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Cluster colGap="tight" align="baseline">
                    <Link href={item.href}>{item.name}</Link>
                    <span>— {item.note}</span>
                  </Cluster>
                </li>
              ))}
            </Layout>
          </Layout>
        ))}
      </Layout>
    </Section>
  );
}
