import { Fragment } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  Button,
  Cluster,
  Icon,
  Layout,
  Prose,
  Section,
  Tag,
  type LayoutProps,
  type SectionSurface,
} from '@/components';
import {
  getServicePage,
  type ServiceAction,
  type ServiceBlock,
  type ServiceContentColumn,
  type ServiceSection,
} from '@/content';
import { OfferRoute, isCorpusOffer, offerMetadata, offerSlugs } from '@/app/_corpus/offer';
import { heroNeedsMedia } from '@/lib/hero-media';
import { placeholderImage } from '@/lib/placeholders';
import { serviceIllustration } from '@/lib/service-illustrations';
import { ROUTES, servicePath } from '@/lib/routes';
import { eyebrowBesideTrail, heroTrail, pageName, slugLabel } from '@/lib/trail';
import {
  Accordion,
  BlockCard,
  Breadcrumbs,
  Callout,
  ContentSection,
  ContentSectionText,
  CtaSection,
  DataTable,
  Figure,
  ListCard,
  PageHero,
  Proof,
  type BreadcrumbItem,
  type HeroAction,
} from '@/patterns';

import { withShareImage } from '../../_og';

type HeroActions = readonly [] | readonly [HeroAction] | readonly [HeroAction, HeroAction];

function requestedSlug(slug: readonly string[]): string {
  return slug
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/');
}

function firstTwoHeroActions(actions: readonly ServiceAction[]): HeroActions {
  const first = actions[0];
  const second = actions[1];
  if (!first) return [];
  return second ? [first, second] : [first];
}

function cardColumns(count: 1 | 2 | 3 | 4): LayoutProps['columns'] {
  switch (count) {
    case 1:
      return { base: 1 };
    case 3:
      return { base: 1, md: 2, lg: 3 };
    case 4:
      return { base: 1, md: 2, lg: 4 };
    default:
      return { base: 1, md: 2 };
  }
}

function renderColumn(column: ServiceContentColumn) {
  return (
    <Layout key={column.id} rowGap="block">
      <Layout rowGap="tight">
        {column.eyebrow ? <p>{column.eyebrow}</p> : null}
        <h3>{column.heading}</h3>
        {column.bodyHtml ? <Prose html={column.bodyHtml} /> : null}
      </Layout>

      {column.items.length > 0 ? (
        <Layout as="ul" rowGap="none">
          {column.items.map((item) => (
            <ListCard
              key={`${column.id}-${item.title}`}
              title={item.title}
              body={item.body}
              titleAs="h4"
              arrangement="stacked"
              href={item.href}
            />
          ))}
        </Layout>
      ) : null}

      {column.links.length > 0 ? (
        /* A column's links STACK (owner, 7 Oct 2026): link buttons never sit side by side. */
        <Layout rowGap="text" justifyItems="start">
          {column.links.map((link) => (
            <Button
              key={`${column.id}-${link.href}-${link.label}`}
              as="a"
              href={link.href}
              emphasis="link"
              tone="primary"
              size="md"
              extendHitArea
              icon={<Icon name="arrow-right" />}
            >
              {link.label}
            </Button>
          ))}
        </Layout>
      ) : null}
    </Layout>
  );
}

function renderServiceBlock(block: ServiceBlock) {
  switch (block.type) {
    case 'rich-text':
      /* Running text reads at the body measure; every other block keeps the full track. */
      return (
        <ContentSectionText>
          <Prose html={block.html} />
        </ContentSectionText>
      );

    case 'card-grid':
      return (
        <Layout
          as="ul"
          columns={cardColumns(block.columns)}
          colGap="gutter"
          rowGap="column"
          equalRows
        >
          {block.cards.map((card) => (
            <BlockCard
              key={`${block.id}-${card.title}`}
              title={card.title}
              body={card.body}
              href={card.href}
            />
          ))}
        </Layout>
      );

    case 'comparison-cards':
      return (
        <Layout as="ul" columns="fit" minTrack="sm" colGap="gutter" rowGap="column" equalRows>
          {block.cards.map((card) => (
            <BlockCard key={`${block.id}-${card.title}`} title={card.title} body={card.body} />
          ))}
        </Layout>
      );

    case 'table':
      return <DataTable {...block.table} />;

    case 'quote':
      return (
        <Layout rowGap="block">
          <Proof arrangement="compact" quote={block.quote} />
          {block.source ? (
            <Cluster>
              <Button
                as="a"
                href={block.source.href}
                emphasis="link"
                tone="primary"
                size="md"
                extendHitArea
                icon={<Icon name="arrow-right" />}
              >
                {block.source.label}
              </Button>
            </Cluster>
          ) : null}
        </Layout>
      );

    case 'callout':
      return <Callout html={block.html} />;

    case 'labelled-list': {
      const numbered = block.displayStyle === 'numbered';
      return (
        <Layout as={numbered ? 'ol' : 'ul'} rowGap="none">
          {block.items.map((item, index) => (
            <ListCard
              key={`${block.id}-${item.title}`}
              title={item.title}
              body={item.body}
              marker={numbered ? { type: 'number', value: index + 1 } : undefined}
              titleAs="h3"
              href={item.href}
            />
          ))}
        </Layout>
      );
    }

    case 'two-column': {
      const columns = [block.left, block.right].filter(
        (column): column is ServiceContentColumn => column !== undefined,
      );
      return (
        <Layout
          columns={columns.length > 1 ? { base: 1, lg: 2 } : { base: 1 }}
          colGap={columns.length > 1 ? 'column' : undefined}
          rowGap="stack"
          align="start"
        >
          {columns.map(renderColumn)}
        </Layout>
      );
    }

    case 'link-group':
      return (
        <Layout rowGap="block">
          <Layout rowGap="tight">
            <h3>{block.heading}</h3>
            {block.description ? <p>{block.description}</p> : null}
          </Layout>
          <Layout as="ul" rowGap="none">
            {block.links.map((link) => (
              <ListCard
                key={`${block.id}-${link.href}-${link.title}`}
                title={link.title}
                body={link.body}
                titleAs="h4"
                href={link.href}
              />
            ))}
          </Layout>
        </Layout>
      );

    case 'media':
      return (
        <Layout rowGap="block">
          <Figure image={block.image} caption={block.caption} />
          {block.download ? (
            <Cluster>
              <Button
                as="a"
                href={block.download.href}
                emphasis="link"
                tone="primary"
                size="md"
                extendHitArea
              >
                {block.download.label}
              </Button>
            </Cluster>
          ) : null}
        </Layout>
      );
  }
}

/**
 * Does this section exist to carry EVIDENCE, and nothing else?
 *
 * The one signal for "this band matters" that the content actually carries. A section holding a
 * single quote and no other block is a standalone testimonial — an author put a heading on it and
 * gave it nothing but the quotation, which is a placement decision rather than an inference. On
 * product-design that is "A client's view of the working relationship"; across the twelve service
 * pages it fires exactly once, and it cannot fire twice on a page that does not have two of them.
 *
 * It is deliberately narrow. A quote sitting among cards and prose is punctuation inside an
 * argument, not the argument, so it does not qualify — which is why this tests the section's whole
 * block list rather than asking whether a quote is present anywhere in it.
 *
 * A PROXY, and honest about being one: importance is editorial, and reading it from block shape is
 * what you do while the CMS has no field to read instead.
 */
function isProofBand(section: ServiceSection): boolean {
  const [only] = section.blocks;
  return section.blocks.length === 1 && only?.type === 'quote';
}

/**
 * The ground for every content band, decided for the whole run at once rather than per section.
 *
 * It has to be the whole run, because the rule that matters is an ADJACENCY rule and a section
 * cannot see its neighbours. Two tint bands stacked are not two bands: they are one 400px block of
 * tint with a seam invisible inside it, which is the same failure `Section` documents for `blue`
 * ("never adjacent to an ink section"). Product-design is exactly this case — its proof band is
 * the LAST section, and every band that can follow the run (FAQ, capabilities, close) is tint. So
 * the accent is dropped there and the close keeps it, because the page's ask is the thing that
 * should be marked if only one of the two can be.
 *
 * Everything not marked is paper. There is no alternation: a long paper run is answered by varying
 * the arrangement of the blocks inside it, never the ground behind them.
 */
function sectionSurfaces(
  sections: readonly ServiceSection[],
  tintFollowsRun: boolean,
): SectionSurface[] {
  return sections.map((section, index) => {
    if (!isProofBand(section)) return 'paper';
    const isLast = index === sections.length - 1;
    return isLast && tintFollowsRun ? 'paper' : 'tint';
  });
}

/**
 * The service's whole trail, every level named, the page's own included, and what is left of the
 * CMS eyebrow for the hero.
 *
 * The leaf is the page's NAME ("Product design", "Trust, Control and Recovery"), never its
 * `title`: the title is a headline, which `heroTrail` would drop, ending the trail at the parent
 * (fix round, 6 Oct 2026). `pageName` (`@/lib/trail`) chooses the name, from the eyebrow where it
 * spells the slug's name, from the slug otherwise. The parent passed to it is the named parent
 * service, never the Services index. The record's short `name` replaces all of this when it
 * exists (`docs/strapi-changes.md` § 16).
 */
function serviceTrail(
  slug: string,
  eyebrow: string | undefined,
): { crumbs: BreadcrumbItem[]; eyebrow: string | undefined } {
  const segments = slug.split('/').filter(Boolean);
  const parents = segments.slice(0, -1).map((segment, index) => ({
    label: slugLabel(segment),
    href: servicePath(segments.slice(0, index + 1).join('/')),
  }));
  const page = pageName({
    name: slugLabel(segments.at(-1) ?? ''),
    eyebrow,
    parent: parents.at(-1)?.label,
  });

  return {
    crumbs: [
      { label: 'Home', href: ROUTES.home },
      { label: 'Services', href: ROUTES.services },
      ...parents,
      { label: page.label, href: servicePath(slug) },
    ],
    eyebrow: page.eyebrow,
  };
}

function jsonLdMarkup(data: Record<string, unknown> | unknown[]): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}

export function generateStaticParams() {
  return offerSlugs('/services').map((slug) => ({ slug: slug.split('/') }));
}

/**
 * The page's metadata with its share card attached. A catch-all segment cannot hold an
 * `opengraph-image` file (Turbopack refuses one after `[...slug]`), so this family's cards are
 * served by `/og/[...path]` and named here instead (`_og/index.ts`).
 */
export async function generateMetadata({
  params,
}: PageProps<'/services/[...slug]'>): Promise<Metadata> {
  const { slug } = await params;
  return withShareImage(await pageMetadata(slug), `/services/${requestedSlug(slug)}`);
}

async function pageMetadata(slug: string[]): Promise<Metadata> {
  const corpus = await offerMetadata(`/services/${requestedSlug(slug)}`);
  if (corpus) return corpus;
  const service = await getServicePage(requestedSlug(slug));

  if (!service) {
    return {
      title: 'Service not found | Tcules',
      robots: { index: false, follow: false },
    };
  }

  const title = service.seo?.title || service.title;
  const description = service.seo?.description || service.hero.description;
  const canonical = service.seo?.canonical;

  return {
    title,
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    ...(service.seo?.robots ? { robots: service.seo.robots } : {}),
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

export default async function ServicePage({ params }: PageProps<'/services/[...slug]'>) {
  const { slug } = await params;
  const route = `/services/${requestedSlug(slug)}`;
  if (isCorpusOffer(route)) return <OfferRoute route={route} />;
  const service = await getServicePage(requestedSlug(slug));

  if (!service) notFound();

  const title = service.title || service.hero.highlightedText || '';
  const heroActions = firstTwoHeroActions(service.hero.actions);

  /* Every band that can follow the section run is tint, so the presence of any one of them is
     what tells the last section it cannot take the accent. */
  const tintFollowsRun = Boolean(service.faq || service.capabilitiesCta || service.cta);
  const surfaces = sectionSurfaces(service.sections, tintFollowsRun);

  const { crumbs, eyebrow } = serviceTrail(service.slug, service.hero.eyebrow);
  const drawing = serviceIllustration(route);

  return (
    <>
      {service.seo?.structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMarkup(service.seo.structuredData) }}
        />
      ) : null}

      <PageHero
        trail={heroTrail(crumbs, title, (t) => (
          <Breadcrumbs {...t} />
        ))}
        title={title}
        eyebrow={eyebrowBesideTrail(eyebrow, crumbs)}
        body={[service.hero.description]}
        actions={heroActions}
        surface="paper"
        /* A page with a finished drawing shows it (src/lib/service-illustrations.ts; owner, 30 Oct
           2026). Otherwise a level-1 service is a high-traffic page: its hero always carries an
           illustration or an image (owner, 29 Oct 2026; src/lib/hero-media.ts), the register's
           labelled placeholder until the art arrives. A deeper service with no drawing keeps the
           text hero. */
        {...(drawing
          ? {
              arrangement: 'beside' as const,
              media: {
                type: 'image' as const,
                image: {
                  src: drawing.src,
                  width: drawing.width,
                  height: drawing.height,
                  alt: drawing.alt,
                  kind: drawing.kind,
                },
              },
            }
          : heroNeedsMedia(route)
            ? {
                arrangement: 'beside' as const,
                media: { type: 'image' as const, image: placeholderImage(route, 'hero') },
              }
            : {})}
      >
        {service.hero.tags.length > 0 ? (
          <Cluster as="ul" colGap="text" rowGap="tight">
            {service.hero.tags.map((tag) => (
              <li key={tag}>
                <Tag>{tag}</Tag>
              </li>
            ))}
          </Cluster>
        ) : null}
      </PageHero>

      {/* ONE BAND PER SECTION, and the ground is EARNED rather than alternated.

          Previously all eight sections shared a single paper Section and were separated by a
          `Layout rowGap="section"`. That put the h2 and every block in one flat stack, so 48 was
          the only distance in the page: heading-to-body read exactly as far apart as
          body-to-the-cards-beneath-it. ContentSection owns the internal grouping; the ground is
          this route's decision because only the page knows the sequence.

          The first version of this alternated `index % 2`, which is wrong and worth recording
          as wrong: it put four tint bands on product-design, none of which was an important
          section — they were the even-numbered ones. Tint marks a section that matters and the
          page's asks (FAQ, capabilities, close); a band gets it for a reason, and there are only
          ever one or two per page. Everything else is paper, and the answer to a long paper run
          is to vary the ARRANGEMENT of the blocks inside it, never the ground behind them
          (CLAUDE.md § Design quality).

          Importance is editorial and the CMS has no field for it, so this reads the one signal
          the content actually carries — see `isProofBand` and `sectionSurfaces`. When
          ComponentServiceSectionHeading grows a `surface` field, that helper is deleted and this
          expression becomes `section.surface`; nothing else here changes. */}
      {service.sections.map((section, index) => (
        <ContentSection
          key={section.id}
          heading={section.heading?.text}
          headingId={section.heading?.anchorId}
          lead={section.lead}
          surface={surfaces[index]}
        >
          {section.blocks.map((block) => (
            <Fragment key={block.id}>{renderServiceBlock(block)}</Fragment>
          ))}
        </ContentSection>
      ))}

      {service.faq ? (
        <Section surface="tint" aria-labelledby="service-faq-heading">
          <Layout rowGap="stack">
            <Layout rowGap="block">
              {service.faq.eyebrow ? <p>{service.faq.eyebrow}</p> : null}
              <h2 id="service-faq-heading">{service.faq.heading}</h2>
              {service.faq.description ? <p>{service.faq.description}</p> : null}
            </Layout>
            <Accordion items={service.faq.items} />
          </Layout>
        </Section>
      ) : null}

      {service.capabilitiesCta ? (
        service.cta ? (
          <CtaSection
            arrangement="offer"
            surface="tint"
            heading={service.capabilitiesCta.heading}
            body={service.capabilitiesCta.body}
            points={service.capabilitiesCta.points}
            /* Mid-page, so ONE link (r7-buttons): the offer takes the first action and a second
               is dropped until the model carries one (docs/strapi-changes.md § 17). */
            actions={[service.capabilitiesCta.actions[0]]}
          />
        ) : (
          <CtaSection
            arrangement="open"
            heading={service.capabilitiesCta.heading}
            body={service.capabilitiesCta.body}
            points={service.capabilitiesCta.points}
            actions={service.capabilitiesCta.actions}
          />
        )
      ) : null}

      {service.cta ? (
        <Section surface="tint" aria-labelledby="service-cta-heading">
          <Layout rowGap="stack">
            <h2 id="service-cta-heading">{service.cta.heading}</h2>
            {service.cta.descriptionHtml ? <Prose html={service.cta.descriptionHtml} /> : null}
            {service.cta.disclaimerHtml ? <Callout html={service.cta.disclaimerHtml} /> : null}
          </Layout>
        </Section>
      ) : null}
    </>
  );
}
