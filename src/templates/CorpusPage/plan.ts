import type { CorpusBand, CorpusBlock, CorpusPage } from '@/lib/corpus-types';

import { formBeforeFaq } from './order';
import { boldLead, exampleLink, linkLead, plain } from './text';

/**
 * OfferPage's plan: for every band of a corpus page, WHAT SHAPE it is and, from the page's rhythm,
 * how it is laid out. Pure data in, pure data out; `OfferPage.tsx` only places what it is told.
 *
 * The page-mapping (docs/page-mapping.md) is the design; this file is its rules, applied by the
 * words' structure rather than by a table of routes, so thirty more service pages, six audits and
 * twelve expertise pages take the same decisions without a new template.
 *
 *   1. SHAPE. A band is classified by the shape of its blocks (`kindOf`). A few shapes the structure
 *      cannot tell apart are told by the band id, which is the content team's own vocabulary
 *      (`complex-products` and `proof` are both "labelled claims ending in a quote", but one names
 *      products and the other names cases).
 *   2. SPLIT. One band may become two units (page-mapping § 0 rule 3): a head and its closing
 *      sentence; the first principles and the rest. An offer or a case set and the quote it ends on
 *      ARE split (owner, 26 Oct 2026): the quote follows as a `voice` band of its own on tint. A
 *      story's quote stays beside its story. A split's second part keeps the reading order, so no
 *      word moves.
 *   3. RHYTHM. Media sides alternate (the first is at the start); a third media split in a row
 *      becomes a read-down with the photograph aside; the close is tint unless the band above is, and
 *      two tints never touch. (The tint quote bands, and the horizon texture that announced them,
 *      went with the split quotes in home round 2.)
 *
 * Units are emitted in document order, with the one sanctioned exception every corpus template
 * shares (`formBeforeFaq`, order.ts): the enquiry form sits immediately before the FAQ.
 */

export type OfferKind =
  | 'outcomes'
  | 'symptoms'
  | 'record'
  | 'cases'
  | 'tiles'
  | 'router'
  | 'thread'
  | 'table'
  | 'deliverables'
  | 'reasons'
  | 'personas'
  | 'principles'
  | 'caseStories'
  | 'faq'
  | 'enquiry'
  | 'voice'
  /* 29 Oct 2026, the 26 Oct copy (docs/page-build/component-map.md § A, § B). */
  | 'quotes'
  | 'industries'
  | 'catalog'
  | 'challenges'
  | 'method'
  | 'related'
  | 'recognition'
  | 'destinations'
  | 'directory'
  | 'text'
  /** A labelled set of items that is not What you get (31 Oct 2026): the sheet, to design. */
  | 'set'
  | 'note'
  | 'close'
  /** No rule names this band: it renders every block plainly and warns (a planning gap). */
  | 'generic';

/** Which half of a split a unit is. `whole` is a band that did not split. */
export type OfferPart = 'whole' | 'a' | 'b';

/**
 * The visual register a band is drawn in (decisions/2026-10-30-adjacent-bands-change-visual-register):
 * adjacent bands never share one. `figures` is reserved: no offer kind renders figures yet (About's
 * company record would).
 */
export type VisualRegister = 'flat' | 'isometric' | 'photo' | 'proof' | 'figures' | 'none';

export type OfferUnit = {
  /** The unit's anchor: the band's id, and `<id>-2` for a split's second part (page-mapping § 3). */
  id: string;
  band: CorpusBand;
  kind: OfferKind;
  part: OfferPart;
  /** For `caseStories`, which `###` item this unit shows. */
  itemIndex?: number;
  surface: 'paper' | 'tint';
  /**
   * The side a media-carrying unit's photograph sits on, alternating down the page. For a `voice`, the
   * side its portrait takes: the voices alternate among themselves, so two never mirror each other.
   */
  side?: 'start' | 'end';
  /** `reasons` is a media split (`B`) unless a third in a row would follow, then a read-down (`D`). */
  variant?: 'B' | 'D';
  /** Visual (a photograph, artefact, drawing, boxed table, icon set) or text-heavy: page-mapping § 3. */
  visual: boolean;
  /** The register the band is drawn in; adjacent bands change it (a development warning). */
  register: VisualRegister;
};

/* ── Shape signatures ───────────────────────────────────────────────────────────── */

type Sig = 'Q' | 'F' | 'T' | 'I' | 'K' | 'U' | 'L' | 'A' | 'P';

function sigOf(block: CorpusBlock): Sig | null {
  switch (block.type) {
    case 'quote':
      return 'Q';
    case 'form':
      return 'F';
    case 'table':
      return 'T';
    case 'item':
      return 'I';
    case 'links':
      return 'K';
    case 'list':
      return 'U';
    case 'labelled':
      return 'L';
    case 'comment':
      return null;
    case 'paragraph':
      if (boldLead(block.runs)) return 'L';
      if (linkLead(block)) return 'A';
      return 'P';
  }
}

/** A band's shape: one letter per block (comments skipped). Read by `npm run corpus:census` too. */
export function signature(band: CorpusBand): string {
  return band.blocks
    .map(sigOf)
    .filter((sig): sig is Sig => sig !== null)
    .join('');
}

const QUOTE_MARK = /^["“‘']/;

/** A table whose second column is a quoted voice: its rows are people, not data compared across rows. */
function isPersonaTable(block: CorpusBlock | undefined): boolean {
  if (block?.type !== 'table' || block.header.length !== 2) return false;
  return (
    block.rows.length > 0 && block.rows.every((row) => QUOTE_MARK.test(plain(row[1] ?? [])))
  );
}

/** A labelled claim whose label is a quoted customer voice (`**"Customers keep getting stuck."** …`). */
function labelIsQuoted(block: CorpusBlock): boolean {
  const label =
    block.type === 'labelled'
      ? block.label
      : block.type === 'paragraph'
        ? boldLead(block.runs)?.label
        : undefined;
  return label !== undefined && QUOTE_MARK.test(plain(label));
}

/** The kind a band takes when its id alone does not decide it: read from the band's shape. */
type ShapeRule = (band: CorpusBand, sig: string) => OfferKind;

/** A band whose list items each open on a bold label ("**Who you work with.** One senior…"). */
const boldLedList = (band: CorpusBand): boolean =>
  band.blocks.some(
    (block) =>
      block.type === 'list' &&
      block.items.every((runs) => boldLead(runs) !== null),
  );

const personaOrChallenges: ShapeRule = (band) =>
  isPersonaTable(band.blocks.find((b) => b.type === 'table')) ? 'personas' : 'challenges';
/** A term index (`A` lines) where the copy uses the same id for a tool group (`L` + `P`). */
const termsOrTools: ShapeRule = (_band, sig) => (/^A+P?$/.test(sig) ? 'related' : 'directory');

/**
 * THE LOOKUP, SECTION ID FIRST (component-map § A and § B, 29 Oct 2026). The content team's band ids
 * are its own vocabulary for what a band IS, so a band is classified by its id before its shape: a
 * `testimonials` band is the proof wall whatever its paragraph count. Each entry names the kind, or
 * (for the few ids the copy spells in more than one shape) a rule over the shape. A band whose id is
 * not here falls back to `kindByShape`, and one that matches neither is `generic`, which renders every
 * block plainly and warns, in development and in the census.
 */
export const BAND_KINDS: Readonly<Record<string, OfferKind | ShapeRule>> = {
  /* ── § A · common bands ── */
  faq: 'faq',
  'frequently-asked-questions': 'faq',
  enquiry: 'enquiry',
  testimonials: 'quotes',
  'selected-work': 'cases',
  'why-tcules': 'reasons',
  'how-we-work-together': 'tiles',
  industries: 'industries',
  'what-you-get': (_band, sig) => (/^T/.test(sig) ? 'table' : 'outcomes'),
  'related-reading': (_band, sig) => (/^P+$/.test(sig) ? 'text' : 'related'),
  'related-terms': 'related',
  'hard-parts': personaOrChallenges,
  'what-we-design': 'catalog',
  compare: 'table',
  routes: 'table',
  articles: 'related',
  'client-recognition': 'recognition',
  method: 'method',
  scope: (_band, sig) =>
    /U/.test(sig) && /L/.test(sig) ? 'outcomes' : /T/.test(sig) ? 'table' : 'text',
  deliverables: 'deliverables',
  'services-on-their-own': 'router',
  /* ── G11 · option and record tables ── */
  'company-record': 'table',
  'gap-map': 'table',
  'client-list': 'table',
  'design-run': 'table',
  autonomy: 'table',
  authority: 'table',
  'search-jobs': 'table',
  'review-options': 'table',
  recovery: 'table',
  fidelity: 'table',
  handoff: 'table',
  'which-check': 'table',
  'component-contract': 'table',
  'which-do-you-need': 'table',
  finding: 'table',
  'status-example': 'table',
  'one-component': 'table',
  'which-service': 'table',
  'which-first': 'table',
  mapping: 'table',
  'which-job': 'table',
  'change-path': 'table',
  models: 'table',
  options: 'table',
  'hand-offs': 'table',
  'cross-check': 'table',
  strategies: 'table',
  continuity: 'table',
  transition: 'table',
  contracts: 'table',
  states: 'table',
  platforms: 'table',
  alternatives: 'table',
  /* ── G12 · hub routers: a 3-column table stays a table with linked keys (Q6 default) ── */
  choose: 'table',
  'service-guide': 'table',
  services: (_band, sig) => (/^[KU]$/.test(sig) ? 'router' : 'text'),
  /* ── G13 · labelled claim sets ── */
  /* About's working terms, bold-led bullets: a drawn set of how the work runs (owner, 31 Oct 2026). */
  'how-we-work': (band, sig) =>
    /^UK?$/.test(sig) && boldLedList(band) ? 'tiles' : /[ULI]/.test(sig) ? 'outcomes' : 'text',
  'what-we-look-for': 'outcomes',
  'people-decide': 'outcomes',
  contents: 'outcomes',
  'hard-cases': 'outcomes',
  format: 'outcomes',
  'change-types': 'outcomes',
  brief: (_band, sig) => (/^U/.test(sig) ? 'outcomes' : 'text'),
  /* ── G14 · steps and stages ── */
  trace: 'thread',
  'next-steps': 'method',
  'how-it-runs': 'method',
  decisions: 'method',
  'every-number': 'method',
  discovery: 'method',
  /* ── G15 · argued item sets ── */
  /* About's five stances on why Tcules over another studio: reasons to choose us (owner, 31 Oct 2026). */
  difference: 'reasons',
  'who-uses-tcules': 'outcomes',
  'product-responsibility': 'outcomes',
  'why-join': 'outcomes',
  'who-we-are-looking-for': 'outcomes',
  'what-youll-gain': 'outcomes',
  'what-youll-do': 'outcomes',
  essentials: 'outcomes',
  'engagement-shapes': 'tiles',
  /* Why Tcules' principles are reasons to choose us, so they take Reasons (treatment rules § 6). */
  principles: (_band, sig) => (/I/.test(sig) ? 'reasons' : 'text'),
  /* ── G16 · destinations ── */
  'what-we-do': 'destinations',
  /* Two titled card sets with the pages' photographs (G16, § E /expertise; HubBands). */
  'product-types': 'destinations',
  'design-work': 'destinations',
  'ai-interfaces': 'destinations',
  'product-situations': 'destinations',
  /* ── G18 · open roles · G6 term indexes ── */
  'open-roles': 'related',
  'ai-in-products': 'related',
  'ai-in-practice': 'related',
  'design-and-code': 'related',
  structure: 'related',
  /* ── G23 · tool hub groups, or a term index where the same id names one ── */
  ai: termsOrTools,
  'design-systems': termsOrTools,
  modernisation: termsOrTools,
  prototypes: 'directory',
  /* ── G19 · prose bands on composed pages ── */
  /* /audits: the sixth audit, one linked row under its lead (§ E /audits). */
  prototype: 'related',
  ahmedabad: 'text',
  'product-work': 'text',
  'ai-fluency': 'text',
  'returning-clients': 'text',
  direction: 'text',
  threshold: 'text',
  'your-team': 'text',
  'working-loop': 'text',
  'design-to-release': 'text',
  'product-knowledge': 'text',
  'what-stays': 'text',
  'whats-next': 'text',
  use: 'text',
  'beyond-the-file': 'text',
  'every-state': 'text',
  testing: 'text',
  knowledge: 'text',
  'build-loop': 'text',
  studio: 'text',
  /* Three instructions as plain paragraphs: numbered steps (MethodBand), so the glossary opens on a
     shape before its five term groups (review 29 Oct). */
  'how-to-use': 'method',
  /* ── G20 · closes and notes ── */
  'work-with-tcules': 'close',
  lab: 'close',
  apply: 'close',
  'case-studies': (_band, sig) => (/^P$/.test(sig) ? 'close' : 'text'),
  purpose: 'close',
  promotion: 'close',
  join: 'close',
  'artefact-access': 'close',
  'your-rules': 'close',
  talk: 'close',
  confidentiality: 'note',
  /* ── G21 · one worked example; and the ids the earlier copy used ── */
  'signature-work': 'record',
  'complex-products': 'cases',
  proof: 'cases',
  'worked-example': 'record',
  engagement: 'tiles',
  approach: 'principles',
  /* ── G24 · home's own bands (HomePage composes them; this is the shared fallback) ── */
  'product-design': 'destinations',
  people: 'text',
  'ai-native-practice': 'text',
  insights: 'related',
  expertise: 'industries',
};

/**
 * The ids a page's own template composes itself, by route (HomePage `BANDS`, AboutPage
 * `ABOUT_BANDS`, each typed against this list). Every other band of those pages renders as
 * `BAND_KINDS` names it; the census reads this to know a band is drawn and not skipped.
 */
export const TEMPLATE_BANDS = {
  '/': [
    'client-recognition',
    'product-situations',
    'product-design',
    'selected-work',
    'testimonials',
    'people',
    'ai-native-practice',
    'expertise',
    'insights',
  ],
  '/about': ['what-we-do', 'who-uses-tcules', 'leadership', 'company-record', 'work-with-tcules'],
  /* ContactPage (component-map § E /contact): the brief and the next steps as one band of peer halves. */
  '/contact': ['brief', 'next-steps', 'confidentiality'],
  /* The listings (ListingIndex): the list's own bands are the template's; the rest (client wall,
     proof wall, FAQ, enquiry) render by the plan's kind around it (component-map C13). */
  '/insights': [
    'new-product',
    'ai-product-ux',
    'design-systems',
    'modernisation',
    'saas-ux',
    'formats',
    'talk',
  ],
  '/case-studies': [
    'featured',
    'new-products',
    'established-products',
    'ai-products',
    'designed-and-built',
    'enquiry',
  ],
} as const satisfies Readonly<Record<string, readonly string[]>>;

/** The kind the id table gives a band, or undefined when its id is not in the table. */
export function kindById(band: CorpusBand): OfferKind | undefined {
  const rule = BAND_KINDS[band.id];
  if (rule === undefined) return undefined;
  return typeof rule === 'function' ? rule(band, signature(band)) : rule;
}

/**
 * A band's kind: its id first (`BAND_KINDS`), then its shape. A form is always the enquiry. The shape
 * rules are the fallback for a band the content team named outside the table; `generic` is what
 * neither recognises.
 */
export function kindOf(band: CorpusBand): OfferKind {
  const sig = signature(band);
  if (sig.includes('F')) return 'enquiry';
  const kind = kindById(band) ?? kindByShape(band, sig);
  /* "What you get" is one band, four parts (OfferParts); any other labelled set the copy calls by
     another name is a set of items (31 Oct 2026, kinds:check on the composed pages). */
  return kind === 'outcomes' && band.id !== 'what-you-get' ? 'set' : kind;
}

/** The shape fallback: the rules OfferPage applied before the id table, still right for an unnamed band. */
export function kindByShape(band: CorpusBand, sig: string = signature(band)): OfferKind {
  const items = band.blocks.filter(
    (b): b is Extract<CorpusBlock, { type: 'item' }> => b.type === 'item',
  );
  if (items.length >= 2 && sig === 'I'.repeat(items.length)) {
    return items.every((item) =>
      item.blocks.every(
        (b) => b.type === 'paragraph' || b.type === 'list' || b.type === 'comment',
      ),
    )
      ? 'faq'
      : 'caseStories';
  }

  if (/^A{3,}$/.test(sig)) return 'router';

  const labelled = band.blocks.filter((b) => sigOf(b) === 'L');
  if (labelled.length >= 3 && labelled.every(labelIsQuoted) && /^L+$/.test(sig))
    return 'symptoms';

  if (/^PT/.test(sig))
    return isPersonaTable(band.blocks.find((b) => b.type === 'table')) ? 'personas' : 'table';
  if (/^L{3,6}Q?$/.test(sig)) return 'outcomes';
  if (/^P?Q+L?$/.test(sig)) return 'quotes';
  if (/^P+K?$/.test(sig)) return 'text';
  /* Prose with a list in it (the legal pages, /how-we-work/ai-transparency) is still prose. */
  if (/^[PU]+K?$/.test(sig)) return 'text';
  return 'generic';
}

/* ── Planning ───────────────────────────────────────────────────────────────────── */

/* Product-design round 6 (11 Oct 2026, page-mapping § 23): `symptoms` (VoiceLedger), `record`
   (CaseSpread) and `tiles` (EngagementOptions) no longer carry a photograph beside their copy, so they
   take no side in the alternation. `record` keeps its evidence image, always at the end of its claim. */
const MEDIA_KINDS: ReadonlySet<OfferKind> = new Set([
  'deliverables',
  'reasons',
  'principles',
  'caseStories',
]);

/** Kinds that read as visual in the rhythm (a photograph, artefact, drawing, boxed table, icon set, covers). */
const VISUAL: ReadonlySet<OfferKind> = new Set([
  'symptoms',
  'record',
  'cases',
  'tiles',
  'router',
  'thread',
  'table',
  'deliverables',
  'reasons',
  'personas',
  'principles',
  'caseStories',
  'industries',
  'recognition',
  'destinations',
  'directory',
]);

/**
 * The register a band is drawn in, from its kind, whether the page draws it (`drawn`, the scenes it was
 * given) and whether a photograph is bound to it. Claims and reasons take isometric illustrations,
 * items take flat drawings, proof is cases and records (decisions/2026-10-30-claim-visual-depicts-the-claim).
 */
export function registerOf(
  kind: OfferKind,
  band: CorpusBand,
  page: CorpusPage,
  drawn: ReadonlySet<string>,
): VisualRegister {
  const bound = page.composition.mediaBindings.some(
    (m) => m.bound && m.supportsSection === band.id,
  );
  switch (kind) {
    case 'cases':
    case 'caseStories':
    case 'record':
    case 'recognition':
      return 'proof';
    case 'router':
    case 'tiles':
    case 'thread':
      return 'flat';
    case 'reasons':
    case 'challenges':
    case 'enquiry':
      return 'isometric';
    case 'industries':
    case 'destinations':
      return 'photo';
    case 'deliverables':
      return bound ? 'photo' : 'none';
    case 'outcomes':
    case 'set':
    case 'catalog':
    case 'symptoms':
    case 'table':
    case 'method':
    case 'text':
      return drawn.has(band.id) ? 'flat' : bound ? 'photo' : 'none';
    default:
      return 'none';
  }
}

type Draft = Omit<OfferUnit, 'surface' | 'side' | 'variant'> & {
  variant?: OfferUnit['variant'];
};

/**
 * Bands their template always sets with a photograph, bound or not (HomePage's `ai-native-practice`
 * Banner takes its placeholder studio photo until the shoot), so the rhythm check reads them as the
 * visual band they render as.
 */
const PHOTOGRAPH_BANDS: ReadonlySet<string> = new Set(['ai-native-practice']);

function drafts(page: CorpusPage, drawn: ReadonlySet<string>): Draft[] {
  const units: Draft[] = [];
  const unit = (
    band: CorpusBand,
    kind: OfferKind,
    part: OfferPart,
    extra: Partial<Draft> = {},
  ) => {
    units.push({
      id: part === 'b' ? `${band.id}-2` : band.id,
      band,
      kind,
      part,
      register: part === 'b' ? 'none' : registerOf(kind, band, page, drawn),
      /* A prose band or the hard parts with a photograph of their own read as visual, and so do hard
         parts that cite examples: each row is drawn with its case's cover (round 5, 30 Oct). */
      visual:
        kind === 'generic'
          ? false
          : VISUAL.has(kind) ||
            PHOTOGRAPH_BANDS.has(band.id) ||
            drawn.has(band.id) ||
            band.blocks.some(
              (block) =>
                block.type === 'paragraph' &&
                /^illustration, not client work$/i.test(plain(block.runs).trim()),
            ) ||
            ((kind === 'challenges' || kind === 'text') &&
              page.composition.mediaBindings.some(
                (m) => m.bound && m.supportsSection === band.id,
              )) ||
            (kind === 'challenges' &&
              band.blocks.some((block) =>
                block.type === 'paragraph'
                  ? exampleLink(block.runs) !== undefined
                  : block.type === 'item' &&
                    block.blocks.some(
                      (inner) =>
                        inner.type === 'paragraph' && exampleLink(inner.runs) !== undefined,
                    ),
              )),
      ...extra,
    });
  };

  for (const band of formBeforeFaq(page.bands)) {
    const kind = kindOf(band);
    const quoted = band.blocks.some((block) => block.type === 'quote');
    switch (kind) {
      /* The client's words get a band of their own, on tint, right after the band they support
         (owner, 26 Oct 2026, product-design page): a quote beside an offer or a set of cases, or a
         line under it, "reads as noise", and a case card never holds one (22 Oct). The offer and the
         cases keep their order; the voice follows them. */
      case 'outcomes':
      case 'set':
      case 'cases':
        unit(band, kind, 'whole');
        /* A quote at display size is the band's one picture, not a body of words (§ 3). */
        if (quoted) unit(band, 'voice', 'whole', { id: `${band.id}-voice`, visual: true });
        break;
      case 'personas':
        unit(band, 'personas', 'a');
        unit(band, 'personas', 'b', { visual: false });
        break;
      case 'principles':
        unit(band, 'principles', 'a');
        unit(band, 'principles', 'b', { visual: false });
        break;
      case 'caseStories': {
        const items = band.blocks.filter((b) => b.type === 'item');
        items.forEach((_, index) =>
          unit(band, 'caseStories', index === 0 ? 'a' : 'b', {
            itemIndex: index,
            id: index === 0 ? band.id : `${band.id}-${index + 1}`,
          }),
        );
        /* A story's quote is set BESIDE its story, in the story's own band (OfferBands caseStories),
           never after the last story as a band of its own (home round 2, 10 Oct 2026). */
        break;
      }
      default:
        unit(band, kind, 'whole');
    }
  }
  return units;
}

/**
 * The page's units, with surfaces, media sides and texture decided from the whole sequence.
 */
export function planOffer(
  page: CorpusPage,
  drawn: ReadonlySet<string> = new Set(),
  hero?: VisualRegister,
): OfferUnit[] {
  const raw = drafts(page, drawn);
  const planned: OfferUnit[] = [];
  /* The side the next media-carrying unit takes: the first is at the start, then they alternate. */
  let side: 'start' | 'end' = 'start';
  /* How many media splits (B) have come in a row. A read-down with a photograph aside (D) is a
     media unit for the sides but ends the run, as does any band with no photograph. */
  let bRun = 0;

  /* Which side the next voice's portrait takes: the first at the start, then they alternate. */
  let voiceSide: 'start' | 'end' = 'start';

  for (const draft of raw) {
    /* Tint is the proof band (page-mapping § 1.7): a voice always sits on it. The close is home's
       island on a paper band (owner, 26 Oct 2026), so it takes no tint of its own. */
    const surface: OfferUnit['surface'] =
      draft.kind === 'voice' || draft.kind === 'quotes' ? 'tint' : 'paper';
    if (draft.kind === 'voice') {
      planned.push({ ...draft, surface, side: voiceSide });
      voiceSide = voiceSide === 'start' ? 'end' : 'start';
      continue;
    }

    const carriesMedia =
      MEDIA_KINDS.has(draft.kind) && !(draft.kind === 'principles' && draft.part === 'b');
    /* Two media splits already in a row: a third would be a third B. A read-down with the
       photograph beside its head says the same thing in a different shape (page-mapping M11). */
    const variant: OfferUnit['variant'] =
      draft.kind === 'reasons' ? (bRun >= 2 ? 'D' : 'B') : undefined;
    const isB = carriesMedia && draft.kind !== 'symptoms' && variant !== 'D';

    let unitSide: OfferUnit['side'];
    if (carriesMedia) {
      unitSide = side;
      side = side === 'start' ? 'end' : 'start';
    }
    bRun = isB ? bRun + 1 : 0;

    planned.push({ ...draft, surface, side: unitSide, variant });
  }

  /* A worked example is a story on its own ground: tint, unless a neighbour is already tint (two tints
     never touch). */
  planned.forEach((unit, index) => {
    if (unit.kind !== 'record' && unit.kind !== 'close') return;
    const touches = [planned[index - 1], planned[index + 1]].some((n) => n?.surface === 'tint');
    if (!touches) unit.surface = 'tint';
  });

  /* Rhythm: never two text-heavy bands adjacent (page-mapping § 3). A warning, not a refusal: the
     page renders as written and the fault is visible on it. */
  if (process.env.NODE_ENV !== 'production') {
    /* A band no rule names is a planning gap, not a design: it says so (the census flags it too). */
    for (const unit of planned) {
      if (unit.kind === 'generic') {
        console.warn(
          `OfferPage ${page.route}: band "${unit.id}" (${signature(unit.band)}) reaches 'generic'; name it in BAND_KINDS (plan.ts).`,
        );
      }
    }
    /* Adjacent bands change register (decisions/2026-10-30-adjacent-bands-change-visual-register). */
    const run: { id: string; register: VisualRegister }[] = [
      ...(hero ? [{ id: 'hero', register: hero }] : []),
      ...planned,
    ];
    run.forEach((a, index) => {
      const b = run[index + 1];
      if (b && a.register === b.register && a.register !== 'none') {
        console.warn(
          `OfferPage ${page.route}: two adjacent bands share the ${a.register} register (${a.id}, ${b.id}); decisions/2026-10-30-adjacent-bands-change-visual-register.`,
        );
      }
    });
    planned.forEach((unit, index) => {
      const next = planned[index + 1];
      if (
        next &&
        !unit.visual &&
        !next.visual &&
        unit.kind !== 'enquiry' &&
        next.kind !== 'enquiry'
      ) {
        console.warn(
          `OfferPage ${page.route}: two text-heavy bands adjacent (${unit.id}, ${next.id}). Mark the exception in docs/page-mapping.md.`,
        );
      }
    });
  }
  return planned;
}
