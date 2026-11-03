import { serviceSceneFor, type SketchName } from '@/lib/sketches';

/* SCAFFOLDING — the copy the flat-frames exploration (/design/flat-frames) sets, as authored in
   _pages/home.md and _pages/services__product-design.md on 3 Nov 2026. */

export type FramesVariant = { key: 'today' | 'plates' | 'tiles'; label: string; name: string };

export const FRAMES_VARIANTS: readonly FramesVariant[] = [
  { key: 'today', label: '0', name: 'Today' },
  { key: 'plates', label: 'A', name: 'Everything on plates' },
  { key: 'tiles', label: 'B', name: 'Links are tiles, the rest plates' },
];

export function framesVariantOf(v: string | string[] | undefined): FramesVariant {
  const key = Array.isArray(v) ? v[0] : v;
  return FRAMES_VARIANTS.find((x) => x.key === key) ?? FRAMES_VARIANTS[0]!;
}

const scene = (href: string) => serviceSceneFor(href) as SketchName | undefined;

export const PATHS = [
  {
    id: 'new',
    title: 'Creating a new product',
    body: [
      'You can picture the product, maybe in a deck, maybe in a prototype you built over a weekend. What you need now is a first release customers choose, built on choices that still hold when the second release arrives.',
      'We shape it with you and carry it all the way to launch.',
    ],
    links: [
      { label: 'Design and launch your MVP', href: '/services/mvp-development' },
      {
        label: 'Check whether your prototype is ready for customers',
        href: '/audits/prototype-readiness-review',
      },
    ],
  },
  {
    id: 'established',
    title: 'Taking an established product further',
    body: [
      'Your product works, customers rely on it, and the business wants it to do more: a new market, AI that people trust, a decade of features made coherent. We find what holds it back and redesign it in stages, so customers keep their bearings while the product takes its next step.',
    ],
    links: [
      { label: 'Redesign how your product works', href: '/services/product-design' },
      { label: 'Modernise a product customers rely on', href: '/services/product-modernisation' },
      { label: 'Add AI features to your product', href: '/services/ai-product-ux' },
    ],
  },
].map((p) => ({ ...p, links: p.links.map((l) => ({ ...l, scene: scene(l.href) })) }));

export const STUDIO = [
  { title: 'Product Design', href: '/services/product-design' },
  { title: 'Design Systems', href: '/services/design-systems' },
  { title: 'Design Engineering', href: '/services/design-engineering' },
  { title: 'Software Development', href: '/services/software-development' },
].map((s) => ({ ...s, scene: scene(s.href) }));

export const STUDIO_LEAD =
  'Product Design is the centre of everything we do: research, product thinking, interaction design and visual craft, applied to the people and systems behind the screens.';

export const OWN_HIRE = [
  ['UX Research', '/services/product-design/ux-research', 'Teams about to spend on an assumption nobody has tested'],
  ['Information Architecture & Workflow Design', '/services/product-design/information-architecture-workflow-design', 'Products where work passes between people, or the menu keeps growing'],
  ['Interaction & UI Design', '/services/product-design/interaction-ui-design', 'Products whose structure works but whose screens confuse people'],
  ['Data Visualisation', '/services/product-design/data-visualisation', 'Dashboards that people export to a spreadsheet'],
  ['Prototyping & Usability Testing', '/services/product-design/prototyping-usability-testing', 'Choosing between directions before engineers start'],
  ['Design-led MVP Development', '/services/mvp-development', 'Founders turning an idea or prototype into an MVP'],
  ['UX & Product Audit', '/audits/ux-product-audit', 'Teams who know something is wrong but not yet what'],
].map(([title, href, body]) => ({ title: title!, href: href!, body: body!, scene: scene(href!) }));

export const WYG: readonly { title: string; body: string; scene: SketchName }[] = [
  { title: 'A tested brief', body: 'What goes in, what waits and what stays out, checked against the people who use the product.', scene: 'outcome-brief' },
  { title: 'A model', body: 'A model of roles, records, permissions and workflows, drawn before the screens, so every screen agrees with the next.', scene: 'outcome-rules' },
  { title: 'Interaction & Visual Design', body: 'Interaction and visual design for every screen and state, inside your design system if you have one, down to the empty and error screens nobody demos.', scene: 'outcome-finished' },
  { title: 'Prototypes', body: 'Clickable or coded prototypes, tested with people who match your users.', scene: 'symptom-test' },
  { title: 'Ready to build', body: 'Designs ready to build, and our review of what your engineers ship.', scene: 'outcome-build' },
];
