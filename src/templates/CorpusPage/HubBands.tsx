import { Layout } from '@/components';
import { BlockCardSet, ContentSection, type BlockCardSetItem } from '@/patterns';
import type { CorpusBand, CorpusBlock, CorpusPage } from '@/lib/corpus-types';
import { inlineToHtml, type InlineRun } from '@/lib/inline';
import { getKitPhoto, HOME_SECTOR_PHOTOS } from '@/lib/photos';
import { placeholderImage } from '@/lib/placeholders';

import { head } from './blocks';
import { BandBody } from './CopyBands';
import { slugOf } from './images';
import { hasLink, plain } from './text';

/**
 * The hubs' own band (component-map § E Hubs, G16; 29 Oct 2026). Kept out of CopyBands so the five
 * hub routes add one file rather than reshape a renderer every corpus page shares.
 */

type ItemBlock = Extract<CorpusBlock, { type: 'item' }>;
type TableBlock = Extract<CorpusBlock, { type: 'table' }>;

const content = (band: CorpusBand) => band.blocks.filter((block) => block.type !== 'comment');

const isGroup = (block: CorpusBlock): block is ItemBlock =>
  block.type === 'item' && block.blocks.some((inner) => inner.type === 'table');

/** True for a destinations band told as `###` groups, each a table whose key column links a page. */
export function hasDestinationGroups(band: CorpusBand): boolean {
  return content(band).some(isGroup);
}

/** A linked card's body is plain text: the whole card is the link, and a link may not hold another. */
const plainHtml = (runs: readonly InlineRun[]) =>
  inlineToHtml(hasLink(runs) ? [{ type: 'text', text: plain(runs) }] : runs);

function linkOf(runs: readonly InlineRun[]): Extract<InlineRun, { type: 'link' }> | undefined {
  for (const run of runs) {
    if (run.type === 'link') return run;
    if ('children' in run) {
      const inner = linkOf(run.children);
      if (inner) return inner;
    }
  }
  return undefined;
}

/**
 * `/expertise` `product-types` (G16): two `###` groups, each a table of six pages (key = the linked
 * page, then "Best for" and "How we design for it"). Each group is its h3 over one card per page,
 * three across under the band's full-width head: the page's photograph as the 16:9 cover (home's
 * approved sector photographs, else the marked placeholder until the missing four arrive), the
 * linked name as the title, and the two cells as the card's two paragraphs, in order. A
 * spreadsheet of twelve rows becomes twelve places to go, which is the band's job.
 */
export function DestinationGroupsBand({ page, band }: { page: CorpusPage; band: CorpusBand }) {
  const blocks = content(band);
  const firstGroup = blocks.findIndex(isGroup);
  const before = blocks.slice(0, firstGroup);
  const [leadBlock, ...intro] = before;
  const leadText =
    leadBlock?.type === 'paragraph' && !hasLink(leadBlock.runs)
      ? plain(leadBlock.runs)
      : undefined;
  const opening = leadText ? intro : before;
  const groups = blocks.slice(firstGroup).filter(isGroup);
  const rest = blocks.slice(firstGroup).filter((block) => !isGroup(block));

  const image = (href: string, title: string) => {
    const photo = HOME_SECTOR_PHOTOS[href];
    return photo ? getKitPhoto(photo) : placeholderImage(page.route, band.id, slugOf(title));
  };

  return (
    <ContentSection {...head(band)} data-band="C-image" lead={leadText}>
      {/* The groups sit a `section` (96) apart: each group's cards are a borderless set whose rows are
          a `column` (64) apart, so at `stack` (48) the second group's head read as one more row of the
          first set (owner, 2 Nov 2026, /expertise). Two groups are two regions; their head stays a
          `block` from its own cards. */}
      <Layout rowGap="section">
        {opening.length > 0 ? <BandBody blocks={opening} /> : null}
        {groups.map((group) => {
          const table = group.blocks.find(
            (inner): inner is TableBlock => inner.type === 'table',
          );
          const others = group.blocks.filter((inner) => inner.type !== 'table');
          const cards: BlockCardSetItem[] = (table?.rows ?? []).flatMap((row) => {
            const [key = [], ...cells] = row;
            const link = linkOf(key);
            const title = plain(link ? link.children : key);
            return [
              {
                id: link?.href ?? title,
                title,
                ...(link ? { href: link.href } : {}),
                bodyHtml: cells.map((cell) => plainHtml(cell)),
                media: {
                  type: 'image' as const,
                  image: image(link?.href ?? '', title),
                },
              },
            ];
          });
          return (
            <Layout key={group.headingText} rowGap="block">
              <h3 id={group.id ?? undefined}>{group.headingText}</h3>
              {others.length > 0 ? <BandBody blocks={others} /> : null}
              <BlockCardSet items={cards} lead="none" across={3} cue="title" scroll="never" />
            </Layout>
          );
        })}
        {rest.length > 0 ? <BandBody blocks={rest} /> : null}
      </Layout>
    </ContentSection>
  );
}
