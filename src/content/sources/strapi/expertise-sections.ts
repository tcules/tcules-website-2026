import { parseBlocks } from '../markdown-blocks/parse-body';
import { expertisePath } from '@/lib/routes';
import type {
  AutonomyLadderSection,
  ExpertiseDirectorySection,
  QuestionLedgerSection,
} from '@/templates/CorpusPage/expertise-sections-model';

import { actionHref, image, rows, text } from './home';
import type { CmsImage, Entries } from './home-types';
import { escapeHtml } from './rich-text';

type Text = string | null | undefined;

/**
 * The sections only the Expertise owners' zones hold, as inline fragments to sit beside
 * `SHARED_SECTION_MEMBERS` (which spreads `ServiceFlow` and `PublishedImage`). The live schema gives
 * the ledger section no `anchorId`. The autonomy ladder is tcules-cms-2026's Autonomy Ladder.
 */
export const EXPERTISE_SECTION_MEMBERS = `
      ... on ComponentSharedExpertiseDirectory {
        id heading anchorId description directorySurface: surface
        groups {
          id eyebrow heading
          cards {
            id bestFor approach
            destination {
              id title resolved
              image { ...PublishedImage }
              expertise { documentId name slug routePath previewImage { ...PublishedImage } }
            }
          }
        }
      }
      ... on ComponentSharedQuestionRoleLedger {
        id heading description
        ledger { entries { question role } }
        after { id kind prose { body } }
      }
      ... on ComponentSharedAutonomyLadder {
        id eyebrow heading anchorId description ladderSurface: surface ladderLegend: legend
        steps { id title role example share }
        ladderNote: note { label body }
        receiptTitle receiptRows { id label body } receiptCaption
      }
`;

/** The CMS's own resolution of a placement: override title/image, else the record's. */
type ResolvedExpertise = {
  title?: Text;
  href?: Text;
  image?: CmsImage | null;
};

export type CmsExpertiseDirectory = {
  __typename: 'ComponentSharedExpertiseDirectory';
  id: string;
  heading: Text;
  anchorId: Text;
  description: Text;
  directorySurface: 'paper' | 'tint' | null;
  groups: Entries<{
    id: string;
    eyebrow: Text;
    heading: Text;
    cards: Entries<{
      id: string;
      bestFor: Text;
      approach: Text;
      destination: {
        id: string;
        title: Text;
        resolved: ResolvedExpertise | null;
        image: CmsImage | null;
        expertise: {
          documentId: string;
          name: Text;
          slug: Text;
          routePath: Text;
          previewImage: CmsImage | null;
        } | null;
      } | null;
    }>;
  }>;
};

export type CmsQuestionRoleLedger = {
  __typename: 'ComponentSharedQuestionRoleLedger';
  id: string;
  heading: Text;
  description: Text;
  ledger: { entries: Entries<{ question: Text; role: Text }> } | null;
  after: Entries<{ id: string; kind: string; prose: { body: Text } | null }>;
};

export type CmsAutonomyLadder = {
  __typename: 'ComponentSharedAutonomyLadder';
  id: string;
  eyebrow: Text;
  heading: Text;
  anchorId: Text;
  description: Text;
  ladderSurface: 'paper' | 'tint' | null;
  ladderLegend: Text;
  steps: Entries<{ id: string; title: Text; role: Text; example: Text; share: number | null }>;
  ladderNote: { label: Text; body: Text } | null;
  receiptTitle: Text;
  receiptRows: Entries<{ id: string; label: Text; body: Text }>;
  receiptCaption: Text;
};

const paragraph = (value: Text) => {
  const words = text(value);
  return words ? escapeHtml(words) : undefined;
};

/**
 * The grouped directory: each group in the editor's order, each card one selected Expertise record in
 * the editor's order. Title, route and image come through the relation (the placement's override
 * first, as the CMS resolves it); a card whose record is not published is left out, with a warning.
 */
export function mapExpertiseDirectory(
  section: CmsExpertiseDirectory,
  route: string,
): ExpertiseDirectorySection | undefined {
  const warn = (message: string) => console.warn(`New CMS ${route}: ${message}`);
  const key = `${section.__typename}-${section.id}`;
  const heading = text(section.heading);
  if (!heading) {
    warn(`${key} has no heading`);
    return undefined;
  }
  const id = text(section.anchorId);
  return {
    key,
    id,
    heading,
    headingId: `${id ?? key}-heading`,
    surface: section.directorySurface ?? undefined,
    type: 'directory',
    lead: text(section.description),
    groups: rows(section.groups).flatMap((group) => {
      const groupHeading = text(group.heading);
      if (!groupHeading) {
        warn(`${key} group ${group.id} has no heading`);
        return [];
      }
      return [
        {
          id: group.id,
          eyebrow: text(group.eyebrow),
          heading: groupHeading,
          cards: rows(group.cards).flatMap((card) => {
            const destination = card.destination;
            const record = destination?.expertise;
            if (!destination || !record) {
              warn(`${key} card ${card.id} selects no published Expertise record`);
              return [];
            }
            const resolved = destination.resolved;
            const title = text(destination.title) ?? text(resolved?.title) ?? text(record.name);
            if (!title) {
              warn(`${key} card ${card.id} has no title`);
              return [];
            }
            const slug = text(record.slug);
            const href =
              actionHref(resolved?.href) ??
              actionHref(record.routePath) ??
              (slug ? expertisePath(slug) : undefined);
            if (!href) warn(`${key} card "${title}" has no route`);
            // Imported "Image to come" uploads mark empty slots, so continue to the next source.
            const cover = [
              image(destination.image),
              image(resolved?.image),
              image(record.previewImage),
            ].find((candidate) => candidate && !/^Image to come:/i.test(candidate.alt));
            if (!cover) warn(`${key} card "${title}" has no image`);
            const bodyHtml = [paragraph(card.bestFor), paragraph(card.approach)].filter(
              (html): html is string => Boolean(html),
            );
            return [{ id: card.id, title, href, bodyHtml, image: cover, slug }];
          }),
        },
      ];
    }),
  };
}

/** The question/role ledger: one row per entry, in order, its following prose after it. */
export function mapQuestionRoleLedger(
  section: CmsQuestionRoleLedger,
  route: string,
): QuestionLedgerSection | undefined {
  const key = `${section.__typename}-${section.id}`;
  const heading = text(section.heading);
  if (!heading) {
    console.warn(`New CMS ${route}: ${key} has no heading`);
    return undefined;
  }
  return {
    key,
    heading,
    headingId: `${key}-heading`,
    type: 'ledger',
    lead: text(section.description),
    items: rows(section.ledger?.entries).flatMap((entry) => {
      const voice = text(entry.question);
      const reply = text(entry.role);
      return voice && reply ? [{ voice, reply }] : [];
    }),
    after: rows(section.after).flatMap((block) => {
      const body = block.kind === 'prose' ? text(block.prose?.body) : undefined;
      return body ? parseBlocks(body) : [];
    }),
  };
}

/**
 * The autonomy ladder: its steps in the editor's order (a step missing a word is left out, with a
 * warning), the labelled note, and the receipt when it has a title and rows. Fewer than two steps
 * cannot draw a ladder, so the section is left out.
 */
export function mapAutonomyLadder(
  section: CmsAutonomyLadder,
  route: string,
): AutonomyLadderSection | undefined {
  const warn = (message: string) => console.warn(`New CMS ${route}: ${message}`);
  const key = `${section.__typename}-${section.id}`;
  const heading = text(section.heading);
  const legend = text(section.ladderLegend);
  if (!heading || !legend) {
    warn(`${key} has no heading or legend`);
    return undefined;
  }
  const steps = rows(section.steps).flatMap((step) => {
    const title = text(step.title);
    const role = text(step.role);
    const example = text(step.example);
    if (!title || !role || !example || typeof step.share !== 'number') {
      warn(`${key} step ${step.id} is incomplete`);
      return [];
    }
    return [{ title, role, example, share: step.share }];
  });
  if (steps.length < 2) {
    warn(`${key} has fewer than two complete steps`);
    return undefined;
  }
  const noteLabel = text(section.ladderNote?.label);
  const noteBody = text(section.ladderNote?.body);
  const receiptTitle = text(section.receiptTitle);
  const receiptRows = rows(section.receiptRows).flatMap((row) => {
    const term = text(row.label);
    const detail = text(row.body);
    return term && detail ? [{ term, detail }] : [];
  });
  const id = text(section.anchorId);
  return {
    key,
    id,
    heading,
    headingId: `${id ?? key}-heading`,
    surface: section.ladderSurface ?? undefined,
    type: 'autonomy-ladder',
    eyebrow: text(section.eyebrow),
    lead: text(section.description),
    legend,
    steps,
    note: noteLabel && noteBody ? { label: noteLabel, body: noteBody } : undefined,
    receipt:
      receiptTitle && receiptRows.length > 0
        ? { title: receiptTitle, rows: receiptRows, caption: text(section.receiptCaption) }
        : undefined,
  };
}
