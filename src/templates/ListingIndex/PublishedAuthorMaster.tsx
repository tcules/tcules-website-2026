import { Layout, Media, Section } from '@/components';
import { ENDPOINTS, ROUTES } from '@/lib/routes';
import { heroTrail } from '@/lib/trail';
import { Breadcrumbs, EnquiryForm, PageHero, ProfileCard } from '@/patterns';

import { ListingClose } from './ListingIndex';
import type { AuthorMasterPage, AuthorMasterSection } from './published-author-master-model';

function Close({ section }: { section: Extract<AuthorMasterSection, { type: 'cta' }> }) {
  const form = section.form;
  return (
    <ListingClose
      closing={{
        id: section.id,
        heading: section.heading,
        eyebrow: section.eyebrow,
        body: section.lead,
        action: section.variant === 'button' ? section.actions[0] : undefined,
        island: {
          surface: section.island ?? 'blue',
          art: section.image ? <Media image={section.image} sizes="300px" /> : undefined,
        },
        form:
          section.variant === 'form' && form ? (
            <EnquiryForm
              variant={form.variant}
              action={ENDPOINTS.enquiry}
              urlLabel={form.urlLabel}
              dress={{ kind: 'card', reply: form.reply ?? '' }}
              fieldScale="md"
              submit="inline"
              submitLabel={form.submitLabel}
              caption={form.caption ?? null}
              success={form.success}
              nextSteps={form.nextSteps}
              scheduleHref={form.scheduleHref}
              context={{
                originRoute: ROUTES.authors,
                placement: 'authors-index',
                family: 'insights',
                serviceOrAudit: '',
                referrer: '',
                campaign: '',
              }}
            />
          ) : undefined,
      }}
    />
  );
}

export function PublishedAuthorMaster({ page }: { page: AuthorMasterPage }) {
  const { hero } = page;
  return (
    <>
      <PageHero
        data-fold-hero=""
        surface="paper"
        texture
        title={hero.title}
        body={hero.body}
        arrangement={hero.arrangement ?? 'centred'}
        eyebrow={hero.eyebrow}
        media={hero.media}
        actions={hero.actions}
        stats={hero.stats}
        tags={hero.tags}
        trail={heroTrail(hero.breadcrumbs, hero.title, (props) => (
          <Breadcrumbs {...props} />
        ))}
      />
      {page.sections.map((section) =>
        section.type === 'authors' ? (
          <Section key={section.key} id={section.id} surface="paper" aria-label={section.label}>
            <Layout as="ul" columns={{ base: 1, md: 2, lg: 3 }} colGap="gutter" rowGap="gutter">
              {section.people.map(({ slug, ...person }) => (
                <ProfileCard key={slug} {...person} />
              ))}
            </Layout>
          </Section>
        ) : (
          <Close key={section.key} section={section} />
        ),
      )}
    </>
  );
}
