import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ComposedRoute, composedMetadata, isComposedRoute } from '@/app/_corpus/composed';

import { Button, Cluster, Icon, Layout, Prose, Section, Tag } from '@/components';
import { getServicesMasterPage, type ServicesMasterAction } from '@/content';
import { ROUTES } from '@/lib/routes';
import { heroTrail } from '@/lib/trail';
import { BlockCard, Breadcrumbs, CtaSection, PageHero, type HeroAction } from '@/patterns';

const SERVICES_SLUG = ROUTES.services.slice(1);

type PageActions = readonly [] | readonly [HeroAction] | readonly [HeroAction, HeroAction];

function firstTwoActions(actions: readonly ServicesMasterAction[]): PageActions {
  const first = actions[0];
  const second = actions[1];
  if (!first) return [];
  return second ? [first, second] : [first];
}

function jsonLdMarkup(data: Record<string, unknown> | unknown[]): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}

export async function generateMetadata(): Promise<Metadata> {
  /* The 26 Oct copy, where the composed allowlist names this route (component-map C12). */
  const composed = await composedMetadata(ROUTES.services);
  if (composed) return composed;

  const page = await getServicesMasterPage(SERVICES_SLUG);

  if (!page) {
    return {
      title: 'Services not found | Tcules',
      robots: { index: false, follow: false },
    };
  }

  const title = page.seo?.title || page.hero.heading;
  const description = page.seo?.description || page.hero.body[0];
  const canonical = page.seo?.canonical;

  return {
    title,
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    ...(page.seo?.robots ? { robots: page.seo.robots } : {}),
    openGraph: {
      title,
      description,
      type: 'website',
      ...(canonical ? { url: canonical } : {}),
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [],
    },
  };
}

export default async function ServicesPage() {
  if (isComposedRoute(ROUTES.services)) return <ComposedRoute route={ROUTES.services} />;

  const page = await getServicesMasterPage(SERVICES_SLUG);

  if (!page) notFound();

  const heroActions = firstTwoActions(page.hero.actions);

  return (
    <>
      {page.seo?.structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMarkup(page.seo.structuredData) }}
        />
      ) : null}

      <PageHero
        trail={heroTrail(
          [
            { label: 'Home', href: ROUTES.home },
            { label: 'Services', href: ROUTES.services },
          ],
          page.hero.heading,
          (t) => (
            <Breadcrumbs {...t} />
          ),
        )}
        title={page.hero.heading}
        body={page.hero.body}
        actions={heroActions}
        surface="paper"
      >
        {page.hero.labels.length > 0 ? (
          <Cluster as="ul" colGap="text" rowGap="tight">
            {page.hero.labels.map((label) => (
              <li key={label}>
                <Tag>{label}</Tag>
              </li>
            ))}
          </Cluster>
        ) : null}
      </PageHero>

      {page.sections.map((section, sectionIndex) => {
        const headingId = `services-section-${section.id}`;

        return (
          <Section
            key={section.id}
            surface={sectionIndex % 2 === 0 ? 'tint' : 'paper'}
            aria-labelledby={headingId}
          >
            <Layout rowGap="stack">
              <Layout rowGap="block">
                {section.serviceName ? <p>{section.serviceName}</p> : null}
                <Cluster colGap="tight" rowGap="tight" align="center">
                  {section.icon ? (
                    /* eslint-disable-next-line @next/next/no-img-element -- CMS-authored section mark */
                    <img
                      src={section.icon.src}
                      alt={section.icon.alt}
                      width={section.icon.width}
                      height={section.icon.height}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  <h2 id={headingId}>{section.heading}</h2>
                </Cluster>
                {section.body.length > 0 ? (
                  <Layout rowGap="text">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </Layout>
                ) : null}
              </Layout>

              {section.cards.length > 0 ? (
                <Layout
                  as="ul"
                  columns={{ base: 1, md: 2, lg: section.cards.length >= 3 ? 3 : 2 }}
                  colGap="gutter"
                  rowGap="column"
                  equalRows
                >
                  {section.cards.map((card) =>
                    card.pointsHtml ? (
                      <Layout as="li" key={card.id} rowGap="block">
                        {card.icon ? (
                          /* eslint-disable-next-line @next/next/no-img-element -- CMS-authored card mark */
                          <img
                            src={card.icon.src}
                            alt={card.icon.alt}
                            width={card.icon.width}
                            height={card.icon.height}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : null}
                        <Layout rowGap="tight">
                          <h3>{card.title}</h3>
                          {card.description ? <p>{card.description}</p> : null}
                        </Layout>
                        <Prose html={card.pointsHtml} />
                        {card.action ? (
                          <Cluster>
                            <Button
                              as="a"
                              href={card.action.href}
                              emphasis="link"
                              tone="primary"
                              size="md"
                              extendHitArea
                              icon={<Icon name="arrow-right" />}
                            >
                              {card.action.label}
                            </Button>
                          </Cluster>
                        ) : null}
                      </Layout>
                    ) : (
                      <BlockCard
                        key={card.id}
                        title={card.title}
                        body={card.description}
                        media={card.icon ? { type: 'image', image: card.icon } : undefined}
                        href={card.action?.href}
                        ctaLabel={card.action?.label}
                      />
                    ),
                  )}
                </Layout>
              ) : null}

              {section.action ? (
                <Cluster>
                  <Button
                    as="a"
                    href={section.action.href}
                    emphasis="link"
                    tone="primary"
                    size="md"
                    extendHitArea
                    icon={<Icon name="arrow-right" />}
                  >
                    {section.action.label}
                  </Button>
                </Cluster>
              ) : null}
            </Layout>
          </Section>
        );
      })}

      {page.closingCta ? (
        page.closingCta.actions.length > 0 ? (
          <CtaSection
            arrangement="open"
            heading={page.closingCta.heading}
            body={page.closingCta.body}
            points={page.closingCta.points}
            actions={
              firstTwoActions(page.closingCta.actions) as Exclude<PageActions, readonly []>
            }
          />
        ) : (
          <Section surface="tint" aria-labelledby="services-closing-heading">
            <Layout rowGap="block">
              <h2 id="services-closing-heading">{page.closingCta.heading}</h2>
              {page.closingCta.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Layout>
          </Section>
        )
      ) : null}
    </>
  );
}
