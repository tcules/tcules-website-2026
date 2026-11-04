/**
 * What a share card says, decided from a page's own words — ch10 Part C (v1.0, 25 Sep 2026) with the
 * rulings logged since. Pure: no I/O, no rendering, so the copy rules can be read and tested apart from
 * the drawing (`render.tsx`) and from where the words come from (`resolve.ts`).
 *
 * The three things that survive a 500px feed card (C1): one mono meta line, the hero, the wordmark —
 * plus an action line on the types C4 gives one.
 */

import type { ShareMedia } from './media';

/** The page types the site has. ch10 C4 names twelve; the rest map onto the nearest (see KINDS). */
export type ShareKind =
  | 'home'
  | 'company'
  | 'listing'
  | 'service'
  | 'audit'
  | 'expertise'
  | 'case'
  | 'article'
  | 'guide'
  | 'podcast'
  | 'video'
  | 'event'
  | 'glossary'
  | 'tool'
  | 'author'
  | 'legal';

export type ShareGround = 'paper' | 'paper-deep';

export type ShareSource = 'own' | 'hub' | 'banner' | 'cover' | 'none';

/** A hero rung (A3): 88 holds 40 characters, 72 holds 55. Nothing between, nothing below. */
export type ShareRung = 88 | 72;

export type ShareCard = {
  path: string;
  kind: ShareKind;
  /** The meta line as two runs: what kind of thing this is, then its one fact (may be empty). */
  meta: { kind: string; fact: string };
  hero: string;
  rung: ShareRung;
  ground: ShareGround;
  /** The action line, on the four types C4 gives one; null everywhere else. */
  action: string | null;
  /** The page's picture — its hero drawing (or its hub's), its banner or its cover — or null. */
  media: ShareMedia | null;
  /**
   * Where the picture came from, for `npm run share:census`: the page's own drawing, its family hub's
   * drawing (until its own lands), a case banner, an article cover, or none (the title alone).
   */
  source: ShareSource;
  /** JPEG when the card carries a banner or a cover (over 1 MB as PNG; ch10 C1), else PNG. */
  format: 'png' | 'jpeg';
  /** og:image:alt — what the card says, in a sentence. */
  alt: string;
  /** The versioned id ch10 C1 asks for: `tcules-og-{type}-{slug}-v01`. A redesign bumps VERSION. */
  id: string;
};

/**
 * Bumped on a redesign of the card itself. A change of CONTENT (a new drawing, a new title) changes
 * the URL on its own through the content hash in the id; this marks a change of the design.
 */
const VERSION = 'v01';

/**
 * Per kind: the ground (C4: paper for detail pages and home, paper-deep for the evergreen listings),
 * the default rung, and the action line.
 *
 * Kinds ch10 does not name, mapped by Claude (4 Nov 2026) and open to the owner:
 * service, expertise, author and legal pages read as Company / Core; glossary terms and tools are
 * article-shaped pages (decisions/2026-11-04-tools-are-article-shaped) and take Article's 72 rung;
 * every listing, not only the three C4 names, is an evergreen listing on paper-deep.
 *
 * Layouts D, P, M and F wait on their assets: case detail defaults to P (a cut-out of the UI, which
 * arrives with the V1 case covers), podcast and video to F (the guest, the episode's drawing), event to M (date, place, format). Until
 * then each takes layout T, which C3 calls "the only layout that needs nothing but words".
 */
const KINDS: Readonly<
  Record<ShareKind, { ground: ShareGround; rung: ShareRung; action: string | null }>
> = {
  home: { ground: 'paper', rung: 88, action: null },
  company: { ground: 'paper', rung: 88, action: null },
  listing: { ground: 'paper-deep', rung: 88, action: null },
  service: { ground: 'paper', rung: 88, action: null },
  audit: { ground: 'paper', rung: 88, action: 'Describe the decision' },
  expertise: { ground: 'paper', rung: 88, action: null },
  case: { ground: 'paper', rung: 88, action: null },
  article: { ground: 'paper', rung: 72, action: null },
  guide: { ground: 'paper', rung: 72, action: 'Read the guide' },
  podcast: { ground: 'paper', rung: 72, action: null },
  video: { ground: 'paper', rung: 72, action: null },
  event: { ground: 'paper', rung: 88, action: 'Connect now' },
  glossary: { ground: 'paper', rung: 72, action: null },
  tool: { ground: 'paper', rung: 72, action: null },
  author: { ground: 'paper', rung: 88, action: null },
  legal: { ground: 'paper', rung: 88, action: null },
};

/** The meta line's kind word where the page's own eyebrow does not supply one (CMS-only pages). */
export const KIND_LABEL: Readonly<Record<ShareKind, string>> = {
  home: 'Product design studio',
  company: 'Studio',
  listing: 'Index',
  service: 'Service',
  audit: 'Audit',
  expertise: 'Expertise',
  case: 'Case study',
  article: 'Article',
  guide: 'Guide',
  podcast: 'Podcast',
  video: 'Video',
  event: 'Event',
  glossary: 'Glossary',
  tool: 'Free tool',
  author: 'Author',
  legal: 'Legal',
};

const LISTINGS = new Set([
  '/services',
  '/audits',
  '/expertise',
  '/case-studies',
  '/insights',
  '/insights/articles',
  '/insights/guides',
  '/insights/podcasts',
  '/insights/videos',
  '/insights/events',
  '/insights/authors',
  '/glossary',
  '/tools',
]);

const LEGAL = new Set(['/privacy-policy', '/terms-of-use', '/cookie-policy', '/sitemap']);

/** A page's kind, from its path. One table, so a new family is one line here. */
export function kindOf(path: string): ShareKind {
  if (path === '/') return 'home';
  if (LISTINGS.has(path)) return 'listing';
  if (LEGAL.has(path)) return 'legal';
  const [, family, second] = path.split('/');
  switch (family) {
    case 'services':
      return 'service';
    case 'audits':
      return 'audit';
    case 'expertise':
      return 'expertise';
    case 'case-studies':
      return 'case';
    case 'glossary':
      return 'glossary';
    case 'tools':
      return 'tool';
    case 'insights':
      if (second === 'authors') return 'author';
      if (second === 'events') return 'event';
      if (second === 'podcasts') return 'podcast';
      if (second === 'videos') return 'video';
      if (second === 'guides') return 'guide';
      return 'article';
    default:
      return 'company';
  }
}

/* ── The hero ─────────────────────────────────────────────────────────────────────────────── */

/** A cut that leaves less than this has lost the sentence; try the next rule instead. */
const MIN_HERO = 18;

/** A question this short still stands as a hero ("What is UX debt?"). */
const MIN_QUESTION = 8;

/** How far past the ceiling a title with no clean break may run rather than lose its last words. */
const OVERRUN = 12;

/**
 * Where a long title may be cut, so what is left still reads as a phrase: before a clause or a
 * qualifier, never inside one.
 */
const BREAKS = [
  ', ',
  ' — ',
  ' – ',
  '; ',
  ' that ',
  ' with ',
  ' before ',
  ' from ',
  ' for ',
  ' so ',
  ' where ',
  ' when ',
  ' who ',
  ' which ',
  ' without ',
];

const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** The longest prefix that fits and ends before a break, else the longest whole-word prefix. */
function cutAtPhrase(text: string, max: number): string {
  let best = -1;
  for (const mark of BREAKS) {
    let at = text.indexOf(mark);
    while (at !== -1) {
      if (at <= max && at >= MIN_HERO && at > best) best = at;
      at = text.indexOf(mark, at + 1);
    }
  }
  if (best !== -1) return text.slice(0, best).replace(/[,;:]$/, '');
  /* No clean break: dropping the last word or two of a title leaves it mid-phrase ("…in AI-first
     User"), which reads worse than a line that runs a little long, so a near miss stays whole. */
  if (text.length <= max + OVERRUN) return text;
  const words = text.slice(0, max + 1).split(' ');
  if (text.length > max) words.pop();
  return words.join(' ');
}

/**
 * Kinds whose meta line already names the subject (an audit's name, a case's client, a tool's area),
 * so a colon title gives its PROMISE to the hero. Everywhere else the subject before the colon is
 * what a reader recognises ("Silent UI regressions"), and the hero keeps it.
 */
const PROMISE_FIRST: ReadonlySet<ShareKind> = new Set([
  'audit',
  'case',
  'tool',
  'service',
  'expertise',
  'company',
  'legal',
]);

/**
 * The page's H1, verbatim or cut (C1): "copy past the ceiling is cut, not accommodated" (A3).
 *
 * The site's H1s are written for search — a subject, a colon, then the promise — and run 55 to 95
 * characters against a ceiling of 55. The cut only removes words; it never rewrites them:
 *   1. a question ends the hero ("What is agentic UX? Meaning, examples…" → "What is agentic UX?");
 *   2. it fits — verbatim;
 *   3. a colon splits it into a subject and a promise; the kind decides which leads (PROMISE_FIRST),
 *      and the other half is the fallback when the first is too short to stand;
 *   4. otherwise the longest phrase that fits, cut before a clause.
 * A page whose cut still reads badly takes an authored cut in `HERO_CUTS` (resolve.ts).
 */
export function cutHero(title: string, max: number, kind: ShareKind): string {
  const text = title.trim().replace(/\s+/g, ' ');

  const question = text.indexOf('?');
  if (question + 1 >= MIN_QUESTION && question + 1 <= max) return text.slice(0, question + 1);
  if (text.length <= max) return text;

  const colon = text.indexOf(': ');
  if (colon !== -1) {
    const subject = text.slice(0, colon);
    const promise = capitalise(text.slice(colon + 2));
    const order = PROMISE_FIRST.has(kind) ? [promise, subject] : [subject, promise];
    const fits = order.find((half) => half.length >= MIN_HERO && half.length <= max);
    if (fits) return fits;
    const long = order.find((half) => half.length >= MIN_HERO);
    if (long) return cutAtPhrase(long, max);
  }

  return cutAtPhrase(text, max);
}

/** The rung and the hero together: 88 when the copy fits 40 and the kind allows it, else 72 (A3). */
export function setHero(title: string, kind: ShareKind): { hero: string; rung: ShareRung } {
  const at88 = cutHero(title, 40, kind);
  const fits88 = KINDS[kind].rung === 88 && at88 === title.trim();
  return fits88 ? { hero: at88, rung: 88 } : { hero: cutHero(title, 55, kind), rung: 72 };
}

/* ── The meta line ────────────────────────────────────────────────────────────────────────── */

/** A3: an eyebrow holds one line, 44 characters. */
const META_MAX = 44;

/**
 * The meta line from the page's own eyebrow: "what kind of thing this is plus one fact" (C2).
 *
 * The word Tcules does not appear on it — the wordmark is in the action row and one mark is
 * enough — so a segment naming the studio is dropped; "Insights ·" is the site's section, not the
 * thing, and goes too. A fact past the ceiling is cut at a phrase, like the hero.
 */
export function setMeta(
  eyebrow: string | null,
  kind: ShareKind,
  name: string,
): { kind: string; fact: string } {
  if (!eyebrow) return { kind: KIND_LABEL[kind], fact: '' };
  let segments = eyebrow
    .split(' · ')
    .map((part) => part.trim())
    .filter(Boolean);

  const updated = segments[0]?.match(/^Last updated:\s*(.+)$/i);
  if (updated) segments = [KIND_LABEL.legal, `Updated ${updated[1]}`];
  if (segments[0] === 'Insights' && segments.length > 1) segments = segments.slice(1);
  segments = segments.map((part) => part.replace(/^About Tcules$/, 'About'));
  const withoutStudio = segments.filter((part) => !/\bTcules\b/.test(part));
  segments = withoutStudio.length > 0 ? withoutStudio : [name.replace(/\bTcules\b\s*/g, '').trim()];
  if (segments.length === 0 || !segments[0]) segments = [KIND_LABEL[kind]];

  const [first = KIND_LABEL[kind], ...rest] = segments;
  let fact = rest.join(' · ');
  const room = META_MAX - first.length - 3;
  if (fact && fact.length > room) fact = room >= 8 ? cutAtPhrase(fact, room) : '';
  return { kind: first, fact };
}

/* ── The card ─────────────────────────────────────────────────────────────────────────────── */

/**
 * Eight hex characters of FNV-1a over the card's content: its words and its picture. In the id, so a
 * new drawing, a new banner or an edited title gives the card a new URL — the only way past an
 * unfurler's cache, which keys by URL and rarely re-fetches (ch10 C1). Pure, so card.ts stays free of
 * I/O; collisions only matter between two states of one page.
 */
function shortHash(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

/** The page's own slug, without its family (the kind already names it): `/services/a/b` → `a-b`. */
const slugOf = (path: string) => {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return 'home';
  return (segments.length > 1 ? segments.slice(1) : segments).join('-');
};

export function shareCard(input: {
  path: string;
  title: string;
  eyebrow: string | null;
  name: string;
  /** An authored cut (`HERO_CUTS`): words of the H1, chosen by hand where the rules read badly. */
  cut?: string;
  media?: ShareMedia | null;
  source?: ShareSource;
  /**
   * What the picture IS — a hash of the drawing file's bytes, or the CMS image URL — so the card's URL
   * changes when its picture does (see `id`).
   */
  fingerprint?: string;
}): ShareCard {
  const kind = kindOf(input.path);
  const { hero, rung } = setHero(input.cut ?? input.title, kind);
  const meta = setMeta(input.eyebrow, kind, input.name);
  const { ground, action } = KINDS[kind];
  const label = meta.fact ? `${meta.kind} · ${meta.fact}` : meta.kind;
  return {
    path: input.path,
    kind,
    meta,
    hero,
    rung,
    ground,
    action,
    media: input.media ?? null,
    source: input.source ?? 'none',
    format: input.media?.kind === 'capture' ? 'jpeg' : 'png',
    alt: `${label}: ${hero}`,
    id: `tcules-og-${kind}-${slugOf(input.path)}-${VERSION}-${shortHash(
      [hero, label, action ?? '', input.fingerprint ?? ''].join('\n'),
    )}`,
  };
}
