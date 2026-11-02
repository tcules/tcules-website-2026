import type { InlineRun } from './inline';

/**
 * View models for the `_pages/` corpus — presentation-agnostic, and typed against what a PAGE
 * consumes rather than against the markdown or its YAML.
 *
 * One `CorpusPage` per file. Inline markdown is always structured (`InlineRun[]`, from
 * `@/lib/inline`), never a raw string: a pattern renders runs, it never parses markdown.
 *
 * The body is a list of BANDS in document order — that order is the narrative, set by the content
 * team, and nothing here reorders it. `bandOrder` is the frontmatter's `render.band_order`, carried
 * verbatim so a check can prove the two agree.
 */

export type CorpusSeo = {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  ogImageAlt: string | null;
};

export type CorpusBreadcrumb = { name: string; url: string };

export type CorpusConversion = {
  /** `project_enquiry` and friends: which form the page carries. */
  form: string;
  /** The band id the form lives in (`enquiry`, `workspace`…). */
  anchor: string;
  visibleFields: string[];
  optionalFields: string[];
  submitLabel: string;
  hiddenContext: string[];
  onSuccess: { heading: string; body: string; retainEnteredData: boolean } | null;
  processor: string | null;
  schedulingLabel: string | null;
};

/**
 * A media slot's `status`, as the copy (26 Oct 2026) authors it. Only BOUND_EXISTING_PUBLIC_ASSET
 * (and SATISFIED_BY_EXISTING_ASSET, which names an asset bound elsewhere) carries a URL; the three
 * REQUIRED states are open slots, `asset_uri` null. The string fallback keeps an unknown state
 * parseable; `corpus:census` lists every slot that is not bound.
 */
export type CorpusMediaStatus =
  | 'BOUND_EXISTING_PUBLIC_ASSET'
  | 'SATISFIED_BY_EXISTING_ASSET'
  | 'IMAGE_ASSET_REQUIRED'
  | 'ASSET_REQUIRED'
  | 'SCREEN_REQUIRED'
  | (string & {});

/** One image slot the frontmatter binds. `bound` is true only for an existing public asset. */
export type CorpusMediaBinding = {
  id: string;
  role: string;
  /** The band id the image supports (`supports_section`). */
  supportsSection: string;
  /** The card the image belongs to inside that band (`card`: a case slug on selected work), or null. */
  card: string | null;
  /** The asset URL as authored, or null when the slot has none yet. */
  assetUri: string | null;
  altIntent: string | null;
  status: CorpusMediaStatus;
  /** `status === BOUND_EXISTING_PUBLIC_ASSET` with a real URL: use it. Otherwise it is a placeholder. */
  bound: boolean;
  source: string | null;
  caption: string | null;
  attribution: string | null;
};

/** `page_composition.client_recognition`: the logo strip a page declares. */
export type CorpusClientRecognition = {
  componentType: string | null;
  /** The band id (or position) the strip sits in, as authored. */
  placement: string | null;
  clients: string[];
  label: string | null;
  assetPolicy: string | null;
};

export type CorpusComposition = {
  visualPlan: string | null;
  mediaBindings: CorpusMediaBinding[];
  /** Client names for the logo strip (`client_recognition.clients` / `logo_client_ids`). */
  logoClients: string[];
  /** The full `client_recognition` block, or null when the page declares none. */
  clientRecognition: CorpusClientRecognition | null;
  /**
   * Case-study slugs the page cites (`selected_work`, `case_study_slugs`, `featured_case_slugs`),
   * in authored order, de-duplicated. Every one must resolve to a live case's slug.
   */
  caseSlugs: string[];
  /**
   * Testimonial ids the page cites, in the order its quotes appear: `page_composition.testimonial_ids`,
   * or `page_composition.commercial_system.testimonial_ids` where a page files them there (About).
   */
  testimonialIds: string[];
  /** A case study's hero metadata (`page_composition.case_meta`), as authored. */
  caseMeta: Record<string, unknown> | null;
  /** Everything else under `page_composition`, untouched, for a stage that needs a key not modelled. */
  raw: Record<string, unknown>;
};

/** What precedes the first band: eyebrow, title, lede, the asks and the proof line. */
export type CorpusHero = {
  /** `*Case study · Benchmark Gensuite*` — the italic line above the title. */
  eyebrow: InlineRun[] | null;
  title: InlineRun[];
  titleText: string;
  /** Lede paragraphs, in order. */
  lede: InlineRun[][];
  /** Link-only lines: the hero's asks (`[Start a conversation](#enquiry)`). */
  actions: CorpusLink[];
  /** Italic-only or bold-only lines after the title: `*Selected work: …*`, a byline, `**Founded 2017 · …**`. */
  proofLines: InlineRun[][];
  /** Anything else found before the first band (none expected; kept so nothing is dropped). */
  extra: CorpusBlock[];
};

export type CorpusLink = { href: string; label: InlineRun[]; labelText: string };

export type CorpusFormField = { label: InlineRun[]; labelText: string; optional: boolean };

/**
 * Everything a body contains, as a discriminated union on `type`.
 *
 *   paragraph  prose
 *   labelled   a paragraph that opens with a bold run ending in `.` `:` or `?`: `**Our role:** …`,
 *              `**A product that needs less explaining.** …`. `label` is the bold run's content
 *              (punctuation included), `body` the rest. A labelled item is a shape of its own.
 *   list       ordered or unordered, each item a run list
 *   table      `header` then `rows`, every cell a run list. The first row is markdown's header even
 *              where the content is key/value (an "At a glance" table) — the page decides how to show it
 *   quote      `paragraphs` and `attribution`; `pendingSignoff` is true when `<!-- awaiting client
 *              sign-off -->` precedes it (render as written). `testimonialId` is the frontmatter's
 *              testimonial id for this quote (`testimonial_ids`, matched in document order by the
 *              loader when the page cites exactly one id per quote), or null when it cannot be
 *              matched. It keys per-review data such as a rating; it is never shown
 *   item       a `###` / `####` subhead with its following blocks (`level` 3 or 4; a `####` nests
 *              inside its `###`)
 *   links      a line made only of links (and `·` separators): a CTA when one, a link row when several
 *   form       the `**Enquiry form**` spec at the foot of a page
 *   comment    an HTML comment that is not a sign-off flag (an authoring note)
 */
export type CorpusBlock =
  | { type: 'paragraph'; runs: InlineRun[] }
  | { type: 'labelled'; label: InlineRun[]; body: InlineRun[] }
  | { type: 'list'; ordered: boolean; items: InlineRun[][] }
  | { type: 'table'; header: InlineRun[][]; rows: InlineRun[][][] }
  | {
      type: 'quote';
      paragraphs: InlineRun[][];
      attribution: InlineRun[] | null;
      pendingSignoff: boolean;
      testimonialId: string | null;
      /**
       * The speaker's star rating, set by the loader from the speaker's name: one person, one rating,
       * on every quote of theirs site-wide (owner, 2 Nov 2026). Null only before the loader runs.
       */
      rating: TestimonialRating | null;
    }
  | {
      type: 'item';
      level: 3 | 4;
      id: string | null;
      heading: InlineRun[];
      headingText: string;
      blocks: CorpusBlock[];
    }
  | { type: 'links'; links: CorpusLink[] }
  | {
      type: 'form';
      fields: CorpusFormField[];
      submit: InlineRun[] | null;
      after: InlineRun[] | null;
    }
  | { type: 'comment'; text: string };

export type CorpusBand = {
  /** The `{#id}` on the `##`, or a slug of the heading when none was authored. */
  id: string;
  /** True when the `{#id}` was authored on the `##`; false when `id` is a slug of the heading. */
  anchored: boolean;
  heading: InlineRun[];
  headingText: string;
  blocks: CorpusBlock[];
};

/** `search_context`: the query and buyer question a page answers. Never rendered; it steers SEO. */
export type CorpusSearchContext = {
  primaryIntent: string | null;
  primaryBuyerQuestion: string | null;
  supportingQuestions: string[];
  primaryQuery: string | null;
  secondaryQueries: string[];
  keyEntities: string[];
};

/** `structured_data`: the schema.org types a page emits, and its other keys as authored. */
export type CorpusStructuredData = {
  types: string[];
  organizationRef: string | null;
  /** Everything else (`article_authors`, `has_part_routes`…), untouched. */
  raw: Record<string, unknown>;
};

export type CorpusPage = {
  route: string;
  slug: string;
  name: string;
  /** `page`, `service`, `audit`, `case_study`, `expertise`, `tool`, `article`, `defined_term`… */
  pageType: string;
  seo: CorpusSeo;
  breadcrumb: CorpusBreadcrumb[];
  /** The enquiry form the page carries, or null when it has none. */
  conversion: CorpusConversion | null;
  /**
   * `render.band_order`, verbatim. Document order is `bands`; the two are checked to agree. Empty
   * when the page authors none (the legal pages, the authors index): document order stands.
   */
  bandOrder: string[];
  searchContext: CorpusSearchContext;
  structuredData: CorpusStructuredData;
  composition: CorpusComposition;
  release: { contentState: string | null; siteReleaseState: string | null };
  hero: CorpusHero;
  bands: CorpusBand[];
  /** The whole frontmatter, untyped, for a stage that needs a key not modelled above. */
  frontmatter: Record<string, unknown>;
  /** The source file, relative to the repo root. */
  file: string;
};

export interface CorpusContentSource {
  /** One page by route (`/`, `/services/product-design`); null when the corpus has none. */
  getCorpusPage(route: string): Promise<CorpusPage | null>;
  /** Every page, in route order, optionally only one `pageType`. */
  listCorpusPages(type?: string): Promise<CorpusPage[]>;
  /**
   * One page's RECORD by route, including a piece filed under a format (`/insights/podcasts/…`),
   * which the corpus authors but no corpus route renders: a page that links it reads its format and
   * length from it (`getInsightRefs`). Null when the corpus has no file for the route.
   */
  getCorpusRecord(route: string): Promise<CorpusPage | null>;
}

/**
 * A case a page cites, as that case's OWN corpus page describes it. The content seam builds it
 * (`getCaseRefs`) so a template never reads another page: `title` is the case page's h1 (the
 * content team's words for that case), `cover` its first bound asset (the pre-existing image the
 * corpus already points at), null when the case binds none.
 */
export type CorpusCaseRef = {
  route: string;
  title: string;
  cover: CorpusMediaBinding | null;
  /**
   * The live case's own Strapi thumbnail, the picture its record carries, for a case whose corpus
   * page binds no asset. Read at the seam, so a case shows ONE cover on every route that cites it
   * (review 29 Oct: Auxentios on home, Gold Image Printing on /services). Null when the live list
   * has no record or no thumbnail for it.
   */
  thumbnail: {
    src: string;
    alt: string;
    width: number;
    height: number;
    sources?: readonly { src: string; width: number }[];
  } | null;
};

/**
 * An insight a page links, as that piece's OWN corpus page describes it (home's "Selected thinking",
 * 29 Oct 2026): its format, from `page_type`, and its length as the piece displays it
 * (`editorial.reading_time_as_displayed`, "12 min read"). Read at the seam (`getInsightRefs`), so a
 * template never reads another page and never writes a length nobody authored. Null where the piece
 * authors none.
 */
export type CorpusInsightRef = {
  route: string;
  /** `article`, `guide`, `podcast`, `research`, `video`: the piece's `page_type`, verbatim. */
  format: string;
  /** "12 min read", as authored; null when the piece's page carries none. */
  length: string | null;
};

/**
 * A star rating for one testimonial, keyed by testimonial id at the content seam
 * (`getTestimonialRatings`). `value` is out of 5, in half steps. `placeholder` is true for a rating
 * nobody has sourced yet (home round 2, 10 Oct 2026: the owner asked for 4–5 placeholders until the
 * real per-review ratings arrive); a page renders it the same way, and the flag exists so a check or
 * a launch list can find every one that must be replaced.
 */
export type TestimonialRating = { value: number; placeholder: boolean };

/**
 * A speaker's portrait for a testimonial's circular avatar, keyed by testimonial id at the content
 * seam (`getTestimonialAvatars`, home round 3, 11 Oct 2026). Structurally the image record a card
 * renders (src, intrinsic size, derived widths). `placeholder` is true for a stand-in portrait that
 * is NOT the speaker (the owner asked to see avatars on about half the cards to judge the look); a
 * real photograph of the person, supplied with their consent, replaces it.
 */
export type TestimonialAvatarRecord = {
  src: string;
  width: number;
  height: number;
  sources?: readonly { src: string; width: number }[];
  placeholder: boolean;
};

/**
 * Stand-in reasons for a "why us" band drawn as the Reasons pattern (`getPlaceholderReasons`, owner
 * 19 Oct 2026). The band is designed for four short reasons 2×2 (owner, 22 Oct 2026), each with a
 * drawing of its claim (docs/content-proposals.md P48); the corpus authors four longer ones with
 * quotes, so the
 * band shows P48's length-guide set until the content team writes its own. The heading and the
 * closing link stay the corpus's. `placeholder` is always true.
 */
export type PlaceholderReasons = {
  /** The band the reasons are shown in, by its id. */
  band: string;
  items: readonly {
    title: string;
    body: string;
    /** The drawing, exported on the band's ground; decorative, so it carries no alt. */
    figure: { src: string; width: number; height: number };
  }[];
  placeholder: true;
};

/**
 * Eyebrows PROPOSED for a page's bands, keyed by band id (`getProposedEyebrows`). The corpus authors
 * no band eyebrows; these are design additions the owner asked for (home gateway, round 11,
 * 19 Oct 2026), logged in docs/content-proposals.md for the content team to keep, reword or drop.
 */
export type ProposedEyebrows = Readonly<Record<string, string>>;

/**
 * One sector of the case-study index's BY INDUSTRY view (`getCaseIndustries`): its name and the
 * case routes filed under it, in order. PROPOSED until the case record carries an industry
 * (docs/content-proposals.md P50).
 */
export type CaseIndustry = { label: string; cases: readonly string[] };

/**
 * One stage of the case-study index's BY STAGE view (`getCaseStages`), its default: where the
 * client's product stood when the work began, and the case routes filed under it, in order.
 * PLACEHOLDER until the owner supplies the stage names and the case record carries a stage
 * (docs/content-proposals.md P51).
 */
export type CaseStage = { label: string; cases: readonly string[] };
