import { Layout, Media, Prose, Section } from '@/components';
import {
  Accordion,
  Collage,
  ContentSection,
  ContentSectionText,
  CtaRow,
  CtaSection,
  EnquiryForm,
  ListCard,
  OfferSheet,
  type HeroMedia,
} from '@/patterns';
import { ENQUIRY_SKETCH_TO_SHIPPED } from '@/lib/enquiry-illustrations';
import { ENDPOINTS } from '@/lib/routes';
import type { CareersPageModel } from './published-careers-model';
import { PublishedHero } from './PublishedHome';
import { labelWithoutArrow } from './text';
export function PublishedCareers({
  page,
  fallbackMedia,
}: {
  page: CareersPageModel;
  fallbackMedia?: HeroMedia;
}) {
  return (
    <>
      <PublishedHero hero={page.hero} fallbackMedia={fallbackMedia} />
      {page.sections.map((section) => {
        const head = {
          id: section.anchorId,
          heading: section.heading,
          headingId: section.headingId,
        };
        switch (section.__typename) {
          case 'ComponentSharedCollageSection':
            return (
              <Section
                key={section.key}
                id={head.id}
                data-band="B-collage"
                aria-labelledby={head.headingId}
              >
                <Collage
                  heading={head.heading}
                  headingId={head.headingId}
                  photos={section.photos}
                >
                  <Prose html={section.html} />
                </Collage>
              </Section>
            );
          case 'ComponentSharedEditorialSection': {
            /* The overhaul's text bands (O.22): words beside a studio photograph ("media"), or
               beside the heading with the band's one link under them ("head beside"). */
            const link = section.link ? (
              <CtaRow
                rule={false}
                actions={[{ ...section.link, label: labelWithoutArrow(section.link.label) }]}
              />
            ) : undefined;
            const words = (
              <ContentSectionText>
                <Prose html={section.blocks.join('')} />
              </ContentSectionText>
            );
            if (section.editorialPresentation === 'media' && section.art)
              return (
                <ContentSection
                  key={section.key}
                  {...head}
                  surface={section.surface ?? 'paper'}
                  data-band="C-media"
                  arrangement="media"
                  media={{ image: section.art, side: 'end' }}
                  actions={link}
                >
                  {words}
                </ContentSection>
              );
            if (section.editorialPresentation === 'head_beside')
              return (
                <ContentSection
                  key={section.key}
                  {...head}
                  surface={section.surface ?? 'paper'}
                  data-band="C-text"
                  arrangement="beside"
                  footer={link}
                >
                  {words}
                </ContentSection>
              );
            return (
              <ContentSection
                key={section.key}
                {...head}
                surface={section.surface ?? 'paper'}
                data-band="C-text"
                arrangement="stacked"
              >
                {section.editorialPresentation === 'peer_columns' ? (
                  <Layout columns={{ base: 1, lg: 2 }} colGap="column" rowGap="text">
                    {section.blocks.map((html, i) => (
                      <Prose key={i} html={html} />
                    ))}
                  </Layout>
                ) : (
                  <Layout rowGap="stack">
                    {section.blocks.map((html, i) => (
                      <ContentSectionText key={i}>
                        <Prose html={html} />
                      </ContentSectionText>
                    ))}
                  </Layout>
                )}
              </ContentSection>
            );
          }
          case 'ComponentSharedOfferSheetSection':
            return (
              <OfferSheet
                key={section.key}
                {...head}
                surface="paper"
                arrangement="list"
                lead={section.description}
                items={section.items}
                note={
                  section.action ? (
                    <CtaRow rule={false} actions={[section.action]} />
                  ) : undefined
                }
              />
            );
          case 'ComponentSharedChecklistSection':
            /* The overhaul's two-up checklist (O.22; owner, 19 Nov 2026): the heading over the band,
               the qualities in two columns from 1280 at the size for a set of four rows or more,
               the closing note under them. */
            return (
              <ContentSection
                key={section.key}
                {...head}
                surface={section.surface ?? 'paper'}
                data-band="D-rows"
              >
                <Layout rowGap="block">
                  <Layout as="ul" columns={{ base: 1, xl: 2 }} colGap="column" rowGap="none">
                    {section.entries.map((entry, i) => (
                      <ListCard
                        key={i}
                        size="sm"
                        columns={2}
                        titleAs="h3"
                        title={entry.text}
                        arrangement={entry.icon ? 'hanging' : undefined}
                        marker={entry.icon ? { type: 'icon', name: entry.icon } : undefined}
                      />
                    ))}
                  </Layout>
                  {section.closingHtml ? (
                    <ContentSectionText>
                      <Prose html={section.closingHtml} />
                    </ContentSectionText>
                  ) : null}
                </Layout>
              </ContentSection>
            );
          case 'ComponentSharedJobListing':
            return (
              <OfferSheet
                key={section.key}
                {...head}
                surface={section.surface ?? 'paper'}
                /* The count of open roles as the lead (the overhaul's "4 roles"), counted from the
                   active jobs so it never goes stale; the CMS description replaces it when set. */
                lead={
                  section.description ||
                  `${section.jobs.length} ${section.jobs.length === 1 ? 'role' : 'roles'}`
                }
                arrangement="rows"
                items={section.jobs.map((job) => ({
                  id: job.documentId,
                  title: job.title,
                  facts: [job.department, job.employmentType, job.location],
                  href: '#apply',
                  choice: job.choiceValue,
                }))}
              />
            );
          case 'ComponentSharedCta': {
            const form = section.form;
            if (!form) throw Error('Missing Careers form');
            const jobs =
              page.sections.find((s) => s.anchorId === form.roleListingAnchor)?.jobs ?? [];
            return (
              <CtaSection
                key={section.key}
                {...head}
                data-band="L"
                island={section.island === 'ink' ? 'ink' : 'blue'}
                islandArrangement="halves"
                islandTexture="flow"
                /* The "no matching role" line is a note to the ask, on a hairline under the lead
                   (owner, 19 Nov 2026), not a footnote under the band. */
                note={section.disclaimer}
                /* Set to ink in the CMS, the application close is the ink band, with no drawing
                   (decisions/2026-11-18-enquiry-close-is-an-ink-band; owner, 20 Nov 2026). */
                {...(section.island === 'ink'
                  ? { frame: 'band' as const, art: undefined }
                  : { art: <Media image={section.art ?? ENQUIRY_SKETCH_TO_SHIPPED} sizes="300px" /> })}
                body={[
                  <span
                    key="lead"
                    dangerouslySetInnerHTML={{ __html: section.descriptionHtml }}
                  />,
                ]}
                form={
                  <EnquiryForm
                    variant="enquiry"
                    formType="careers"
                    label={form.formLabel}
                    submitLabel={form.submitLabel}
                    workLabel={form.showWork ? undefined : null}
                    urlLabel={form.urlLabel}
                    urlRequired={form.urlRequired}
                    success={form.success}
                    action={ENDPOINTS.enquiry}
                    dress={{
                      kind: 'card',
                      role: {
                        question: form.roleQuestion,
                        options: [
                          ...jobs.map((job) => ({ value: job.choiceValue, label: job.title })),
                          {
                            value: form.otherRoleLabel
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, '-'),
                            label: form.otherRoleLabel,
                          },
                        ],
                      },
                    }}
                    fieldScale="md"
                    submit="inline"
                    context={{
                      originRoute: '/careers',
                      placement: 'application',
                      family: 'careers',
                      serviceOrAudit: 'careers',
                      referrer: '',
                      campaign: '',
                    }}
                  />
                }
              />
            );
          }
          case 'ComponentSharedFaqSection':
            return (
              <ContentSection
                key={section.key}
                {...head}
                surface="paper"
                data-band="D-faq"
                arrangement="beside"
              >
                <Accordion items={section.faqs} />
              </ContentSection>
            );
          default:
            throw Error('Unsupported Careers section ' + section.__typename);
        }
      })}
    </>
  );
}
