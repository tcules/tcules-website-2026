import { Layout } from '@/components';
import { placeholderImage } from '@/lib/placeholders';
import { expertisePath } from '@/lib/routes';
import { serviceIllustration } from '@/lib/service-illustrations';
import {
  AutonomyLadder,
  BlockCardSet,
  ContentSection,
  type BlockCardSetItem,
} from '@/patterns';

import { ListTiles } from './blocks';
import { BandBody } from './CopyBands';
import styles from './CorpusPage.module.css';
import type {
  AutonomyLadderSection,
  ExpertiseDirectorySection,
  QuestionLedgerSection,
} from './expertise-sections-model';

/**
 * The grouped Expertise directory as the corpus hub drew it (HubBands `DestinationGroupsBand`, C-image):
 * the band's centred head, then each group a `section` apart, its eyebrow over its h3, one photo card per
 * Expertise record three across, the whole card the link, "Best for" and "How we design for it" its
 * two paragraphs. A missing CMS image takes the reference illustration for its Expertise route.
 */
export function ExpertiseDirectoryBand({
  section,
  route,
}: {
  section: ExpertiseDirectorySection;
  /** The page's route, for a missing image's placeholder slot. */
  route: string;
}) {
  return (
    <ContentSection
      id={section.id}
      heading={section.heading}
      headingId={section.headingId}
      surface={section.surface}
      data-band="C-image"
      lead={section.lead}
      align="center-lg"
    >
      <Layout rowGap="section">
        {section.groups.map((group) => {
          const cards: BlockCardSetItem[] = group.cards.map((card) => ({
            id: card.href ?? card.id,
            title: card.title,
            ...(card.href ? { href: card.href } : {}),
            bodyHtml: card.bodyHtml,
            media: {
              type: 'image' as const,
              image:
                card.image ??
                (card.slug ? serviceIllustration(expertisePath(card.slug)) : undefined) ??
                placeholderImage(route, section.id ?? section.key, card.slug ?? card.id),
            },
          }));
          return (
            <Layout key={group.id} rowGap="block">
              <Layout rowGap="block" className={styles.groupHead}>
                {group.eyebrow ? <p className={styles.groupEyebrow}>{group.eyebrow}</p> : null}
                <h3>{group.heading}</h3>
              </Layout>
              <BlockCardSet items={cards} lead="none" across={3} cue="title" scroll="never" />
            </Layout>
          );
        })}
      </Layout>
    </ContentSection>
  );
}

/**
 * The question/role ledger: each question a ruled tile's title, the role that asks it its body
 * (ListTiles, as the hard-parts band sets the same people; O.5a, 17 Nov 2026: VoiceLedger retired).
 * The ledger's following words under the tiles.
 */
export function QuestionLedgerBand({ section }: { section: QuestionLedgerSection }) {
  const rows = section.items.map((item) => ({ title: item.voice, body: item.reply }));
  return (
    <ContentSection
      id={section.id}
      heading={section.heading}
      headingId={section.headingId}
      surface={section.surface}
      data-band="list-tiles"
      lead={section.lead}
    >
      <Layout rowGap="stack">
        <ListTiles rows={rows} columns={rows.length % 3 === 0 ? 3 : 2} />
        {section.after.length > 0 ? (
          <BandBody blocks={section.after} labelledBy={section.headingId} />
        ) : null}
      </Layout>
    </ContentSection>
  );
}

/**
 * The autonomy ladder as the overhaul's B2B SaaS page drew it: the band's head (eyebrow, heading,
 * lead) over the ladder, its receipt beside it from 1024.
 */
export function AutonomyLadderBand({ section }: { section: AutonomyLadderSection }) {
  return (
    <ContentSection
      id={section.id}
      eyebrow={section.eyebrow}
      heading={section.heading}
      headingId={section.headingId}
      surface={section.surface}
      data-band="autonomy-ladder"
      lead={section.lead}
    >
      <AutonomyLadder
        steps={section.steps}
        legend={section.legend}
        note={section.note}
        receipt={section.receipt}
      />
    </ContentSection>
  );
}
