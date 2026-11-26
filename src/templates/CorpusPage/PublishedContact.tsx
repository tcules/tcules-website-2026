import type { IconName } from '@/components';
import { ROUTES } from '@/lib/routes';
import { BlockCardSet, ContentSection } from '@/patterns';

import { LinksIsland } from './LinksIsland';
import type {
  ContactChannel,
  ContactChannelKind,
  ContactPageModel,
  ContactSection,
} from './published-contact-model';
import { PublishedCta, PublishedHero, PublishedSection } from './PublishedHome';

/* One Solar glyph per kind of channel, heading its tile (an icon heads its card). */
const CHANNEL_GLYPHS = {
  email: 'letter',
  partners: 'hand-shake',
  careers: 'users-group-rounded',
  studio: 'map-point',
} as const satisfies Record<ContactChannelKind, IconName>;

/**
 * The other ways to reach the studio (tracker 2.56; owner's Contact A, 3 Nov 2026): one filled tile
 * per route, glyph then title then its one action as a labelled outline, the mailbox or the page
 * itself as the label. The tile does not answer the pointer; the action does.
 */
function Channels({
  section,
}: {
  section: Extract<ContactSection, { type: 'channels' }>;
}) {
  const { id, heading, headingId, channels } = section;
  if (channels.length === 0) return null;
  return (
    <ContentSection id={id} data-band="C-channels" heading={heading} headingId={headingId}>
      <BlockCardSet
        lead="none"
        across={channels.length >= 4 ? 4 : 3}
        frame="tile"
        linkScope="cta"
        ctaEmphasis="outline"
        /* One tile after another on a phone, never a swipe row (owner, 5 Nov 2026). */
        scroll="never"
        items={channels.map((channel: ContactChannel) => ({
          id: channel.kind,
          title: channel.title,
          icon: CHANNEL_GLYPHS[channel.kind],
          body: channel.body,
          href: channel.href,
          ctaLabel: channel.action,
        }))}
      />
    </ContentSection>
  );
}

/**
 * TIER 3 — /contact from the CMS Contact Page. The hero centred with the studio's record as figures,
 * the enquiry form island inside it where an image would be (owner, 31 Oct 2026), then the CMS's
 * sections in their order: the other ways to reach the studio, the profiles, the questions.
 */
export function PublishedContact({ page }: { page: ContactPageModel }) {
  const { hero, sections } = page;
  /* The first form CTA is the hero's panel; any other CTA renders as its own band. */
  const enquiry = sections.find(
    (section): section is Extract<ContactSection, { type: 'cta' }> =>
      section.type === 'cta' && section.variant === 'form',
  );
  return (
    <>
      <PublishedHero
        hero={{ ...hero, arrangement: hero.arrangement ?? 'centred' }}
        panel={
          enquiry ? <PublishedCta section={enquiry} route={ROUTES.contact} inBand /> : undefined
        }
      />
      {sections.map((section) => {
        if (section === enquiry) return null;
        switch (section.type) {
          case 'channels':
            return <Channels key={section.key} section={section} />;
          case 'links':
            return (
              <LinksIsland
                key={section.key}
                id={section.id ?? section.headingId}
                band="C-links"
                heading={section.heading}
                links={section.links}
              />
            );
          default:
            return <PublishedSection key={section.key} section={section} route={ROUTES.contact} />;
        }
      })}
    </>
  );
}
