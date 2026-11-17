import { Layout } from '@/components';
import { placeholderImage } from '@/lib/placeholders';
import { expertisePath } from '@/lib/routes';
import { serviceIllustration } from '@/lib/service-illustrations';
import { BlockCardSet, ContentSection, VoiceLedger, type BlockCardSetItem } from '@/patterns';

import { BandBody } from './CopyBands';
import styles from './CorpusPage.module.css';
import type {
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

/** The question/role ledger (VoiceLedger): each question beside the role that asks it. */
export function QuestionLedgerBand({ section }: { section: QuestionLedgerSection }) {
  return (
    <VoiceLedger
      id={section.id}
      heading={section.heading}
      headingId={section.headingId}
      lead={section.lead}
      surface={section.surface}
      items={section.items}
      note={
        section.after.length > 0 ? (
          <BandBody blocks={section.after} labelledBy={section.headingId} />
        ) : undefined
      }
    />
  );
}
