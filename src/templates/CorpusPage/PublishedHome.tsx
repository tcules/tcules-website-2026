import {
  BrandMark,
  Button,
  Cluster,
  Icon,
  Layout,
  Media,
  Prose,
  RatingBadge,
  Sketch,
  Tag,
} from '@/components';
import { HOME_ARENA, HOME_AI_SCENES } from '@/lib/home-illustrations';
import { ENQUIRY_DESK, ENQUIRY_SKETCH_TO_SHIPPED } from '@/lib/enquiry-illustrations';
import { ENDPOINTS, ROUTES } from '@/lib/routes';
import { sketchForRoute } from '@/lib/sketches';
import { heroTrail } from '@/lib/trail';
import {
  Accordion,
  BlockCard,
  Breadcrumbs,
  CaseCard,
  ContentSection,
  CtaRow,
  CtaSection,
  EngagementOptions,
  EnquiryForm,
  GatewayPaths,
  LogoGrid,
  OfferParts,
  OfferSheet,
  PageHero,
  Proof,
  ReadDown,
  Slider,
  Teaser,
  TestimonialWall,
  TEASER_FORMAT_ICON,
  type HeroMedia,
  type EnquiryContextBase,
  type PageHeroProps,
  type TeaserFormat,
} from '@/patterns';

import type {
  HomeAction,
  HomePageModel,
  HomeRating,
  HomeSection as Section,
} from './published-home-model';
import { labelWithoutArrow } from './text';

function ReviewBadge({ rating }: { rating: HomeRating }) {
  const { mark, ...props } = rating;
  return (
    <RatingBadge
      {...props}
      icon={<Icon name="star" size="sm" />}
      mark={mark === 'clutch' ? <BrandMark name="clutch" /> : undefined}
    />
  );
}

/* The link control draws its own arrow, so an authored trailing "→" ("See all industries →") goes
   rather than printing twice (text.ts `labelWithoutArrow`; presentation only, the words stay). */
function link(action: HomeAction | undefined) {
  return action ? (
    <CtaRow
      rule={false}
      note={action.description}
      actions={[{ ...action, label: labelWithoutArrow(action.label) }]}
    />
  ) : undefined;
}

function prose(html: string | undefined) {
  return html ? <Prose html={html} /> : undefined;
}

function inline(html: string | undefined) {
  if (!html) return undefined;
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export function PublishedHero({
  hero,
  fallbackMedia,
  details,
}: {
  hero: HomePageModel['hero'];
  fallbackMedia?: HeroMedia;
  details?: Pick<PageHeroProps, 'facts' | 'labels' | 'dates'>;
}) {
  const { recognition, breadcrumbs, actionsNote, arrangement, media, ...props } = hero;
  const foot = recognition?.marks.length ? (
    <div id={recognition.id}>
      <LogoGrid
        marks={recognition.marks}
        context={recognition.title}
        contextAs="h2"
        headingId={recognition.id ? `${recognition.id}-heading` : undefined}
        edges="closed"
        density={recognition.compact ? 'compact' : 'default'}
      />
    </div>
  ) : undefined;
  return (
    <PageHero
      {...props}
      {...details}
      data-band="A"
      data-fold-hero=""
      surface="paper"
      arrangement={arrangement ?? 'beside'}
      media={media ?? fallbackMedia}
      trail={heroTrail(breadcrumbs, hero.title, (trail) => (
        <Breadcrumbs {...trail} />
      ))}
      actionsNote={prose(actionsNote)}
      foot={foot}
    />
  );
}

function CaseCards({ section }: { section: Extract<Section, { type: 'cases' }> }) {
  const horizontal = section.presentation === 'horizontal_alternating';
  const covered = section.presentation === 'compact_covered';
  const { id, heading, headingId, lead, surface } = section;
  return (
    <ContentSection
      {...{ id, heading, headingId, lead, surface }}
      data-band="M"
      actionsAt="end"
      actions={link(section.action)}
    >
      <Layout
        rowGap="gutter"
        colGap="gutter"
        columns={horizontal ? 1 : { base: 1, md: 2, lg: 3 }}
        scroll={horizontal ? 'until-md' : undefined}
      >
        {section.cards.map(({ id: key, bodyHtml, href, image, ctaLabel, ...card }, index) =>
          horizontal && href && image ? (
            <CaseCard
              key={key}
              {...card}
              href={href}
              image={image}
              bodyHtml={bodyHtml ? [bodyHtml] : undefined}
              ctaLabel={ctaLabel}
              reverse={(index % 2 === 1) !== (section.side === 'end')}
            />
          ) : (
            <Layout as="ul" key={key}>
              <BlockCard
                {...card}
                size={covered ? 'sm' : 'md'}
                titleAs="h3"
                bodyHtml={bodyHtml ? [bodyHtml] : undefined}
                href={href}
                ctaLabel={ctaLabel}
                cue={ctaLabel ? 'cta' : 'title'}
                media={image ? { type: 'image', image } : undefined}
              />
            </Layout>
          ),
        )}
      </Layout>
    </ContentSection>
  );
}

function Offers({ section }: { section: Extract<Section, { type: 'offer' }> }) {
  const { id, heading, headingId, lead, surface, presentation } = section;
  const list = presentation === 'list';
  const fallbackScenes =
    id === 'ai-native-practice' && section.items.length === HOME_AI_SCENES.length
      ? HOME_AI_SCENES
      : [];
  const items = list
    ? section.items.map((item, index) => ({
        ...item,
        scene: item.scene ?? fallbackScenes[index],
      }))
    : section.cards;
  const note = (
    <>
      {section.after.map((html, index) => (
        <Prose key={index} html={html} />
      ))}
      {link(section.action)}
    </>
  );
  const before = section.before.length
    ? section.before.map((html, index) => <Prose key={index} html={html} />)
    : undefined;
  if (presentation === 'offer_parts') {
    const cards = section.cards.flatMap((item) =>
      item.title ? [{ ...item, title: item.title }] : [],
    );
    return (
      <OfferParts
        {...{ id, heading, headingId, lead, surface }}
        deliverablesTitle=""
        deliverables={[]}
        orderedCards={cards}
        parts={section.parts}
        before={before}
        note={note}
      />
    );
  }
  if (presentation === 'read_down') {
    const rows = items.flatMap(({ title, body, bodyHtml, icon }) =>
      title ? [{ title, body, bodyHtml: bodyHtml ? [bodyHtml] : undefined, icon }] : [],
    );
    return (
      <ContentSection {...{ id, heading, headingId, lead, surface }} footer={note}>
        {before}
        <ReadDown rows={rows} columns={rows.length > 3 ? 2 : 1} />
      </ContentSection>
    );
  }
  return (
    <OfferSheet
      {...{ id, heading, headingId, lead, surface }}
      arrangement={list ? 'list' : 'grid'}
      items={
        presentation === 'plain' ? items.map((item) => ({ ...item, scene: undefined })) : items
      }
      before={before}
      note={section.action || section.after.length ? note : undefined}
    />
  );
}

function Testimonials({ section }: { section: Extract<Section, { type: 'testimonials' }> }) {
  const { id, heading, headingId, surface, presentation, avatarPolicy, rating } = section;
  const wall = presentation === 'wall' || (!presentation && section.items.length >= 6);
  const showAvatars =
    avatarPolicy === 'individual' || section.items.every((item) => item.avatar);
  const items = section.items.map((item) => ({
    ...item,
    avatar: showAvatars ? item.avatar : undefined,
  }));
  const quotes = items.map(({ id, avatar, rating, ...quote }) => (
    <li key={id}>
      <Proof quote={{ ...quote, portrait: avatar, stars: rating }} align="center" />
    </li>
  ));
  return (
    <ContentSection
      {...{ id, heading, headingId, surface }}
      data-band="G"
      headingSize={wall ? undefined : 'eyebrow'}
      align="center"
      footer={
        rating ? (
          <Cluster colGap="tight" rowGap="tight" align="center" justify="center">
            <ReviewBadge rating={rating} />
          </Cluster>
        ) : undefined
      }
    >
      {items.length === 0 ? null : wall ? (
        <TestimonialWall
          items={items}
          avatarPolicy={avatarPolicy === 'individual' ? 'individual' : 'all-or-none'}
        />
      ) : presentation === 'single' || quotes.length === 1 ? (
        <Layout as="ul" rowGap="block">
          {presentation === 'single' ? quotes.slice(0, 1) : quotes}
        </Layout>
      ) : (
        <Slider
          label={heading}
          slideName="testimonial"
          perView={1}
          align="center"
          slideAlign="center"
          autoplay
        >
          {quotes}
        </Slider>
      )}
    </ContentSection>
  );
}

export function PublishedEngagement({
  section,
  imageSizes = '(min-width: 1024px) 33vw, 90vw',
}: {
  section: Extract<Section, { type: 'engagement' }>;
  imageSizes?: string;
}) {
  const { id, heading, headingId, surface, lead, closing } = section;
  const proof = closing?.proof;
  const proofCard = proof ? (
    <Layout as="ul">
      <BlockCard
        title={proof.title}
        eyebrow={closing?.proofEyebrow ?? proof.eyebrow}
        body={proof.body}
        bodyHtml={proof.bodyHtml ? [proof.bodyHtml] : undefined}
        href={proof.href}
        ctaLabel={proof.ctaLabel}
        orientation="horizontal"
        media={proof.image ? { type: 'image', image: proof.image } : undefined}
      />
    </Layout>
  ) : undefined;
  const closingHeading = closing?.heading;
  const [primary, secondary] = closing?.actions ?? [];
  return (
    <EngagementOptions
      {...{ id, heading, headingId, surface }}
      arrangement={section.presentation}
      mediaSide={section.mediaSide}
      lead={lead?.split('<br><br>').map(inline)}
      action={link(section.action)}
      options={section.options.map((option) => {
        const [body, ...more] = option.html?.split('<br><br>') ?? [];
        const button = option.action;
        return {
          title: option.title,
          eyebrow: option.eyebrow,
          anchorId: option.anchorId,
          body: inline(body),
          more: more.map(inline),
          scope: option.scope,
          art: option.illustration?.image ? (
            <Media image={option.illustration.image} sizes={imageSizes} />
          ) : option.illustration?.scene ? (
            <Sketch name={option.illustration.scene} />
          ) : undefined,
          icon: option.icon ? <Icon name={option.icon} size="xl" /> : undefined,
          facts: option.facts.map((fact) => ({
            label: fact.label,
            body: inline(fact.html),
            items: fact.items?.map(inline),
          })),
          checklist: option.checklist.map(inline),
          action: button ? (
            <Button
              as="a"
              href={button.href}
              target={button.external ? '_blank' : undefined}
              rel={button.external ? 'noopener noreferrer' : undefined}
              emphasis="outline"
              size="md"
              icon={<Icon name={button.icon ?? 'arrow-right'} />}
            >
              {button.label}
            </Button>
          ) : undefined,
        };
      })}
      terms={section.terms.map((term) => ({ label: term.label, body: inline(term.html) }))}
      note={
        primary && closingHeading ? (
          <CtaSection
            id={id ? `${id}-ask` : undefined}
            data-band="onward"
            arrangement="open"
            density="compact"
            inBand
            heading={closingHeading}
            body={
              closing?.html
                ? [<span key="body" dangerouslySetInnerHTML={{ __html: closing.html }} />]
                : undefined
            }
            actions={secondary ? [primary, secondary] : [primary]}
            proof={proofCard}
          />
        ) : undefined
      }
      closing={
        !primary && closingHeading
          ? {
              heading: closingHeading,
              lead: inline(closing?.html),
              proof: proofCard,
            }
          : undefined
      }
    />
  );
}

function Cta({
  section,
  route,
  enquiryContext,
}: {
  section: Extract<Section, { type: 'cta' }>;
  route: string;
  enquiryContext?: EnquiryContextBase;
}) {
  const { id, heading, eyebrow, surface, island, points, form, lead, leadHtml, rating } =
    section;
  const body = leadHtml
    ? ([<span key="lead" dangerouslySetInnerHTML={{ __html: leadHtml }} />] as const)
    : lead
      ? ([lead] as const)
      : undefined;
  const [primary, secondary] = section.actions;
  if (section.variant === 'button' && primary) {
    if (section.presentation === 'offer')
      return (
        <CtaSection
          {...{ id, heading, eyebrow, surface, points, body }}
          data-band="K"
          arrangement="offer"
          actions={[primary]}
          media={section.image ? { image: section.image, side: section.side } : undefined}
        />
      );
    return (
      <CtaSection
        {...{ id, heading, eyebrow, surface, island, points, body }}
        data-band="L"
        arrangement="open"
        actions={secondary ? [primary, secondary] : [primary]}
        proof={
          section.image ? (
            <Media image={section.image} sizes="(min-width: 1024px) 40vw, 90vw" />
          ) : undefined
        }
      />
    );
  }
  if (section.variant !== 'form' || !form) {
    return (
      <ContentSection
        id={id}
        heading={heading}
        headingId={section.headingId}
        surface={surface}
        eyebrow={eyebrow}
        lead={lead}
      >
        {prose(leadHtml)}
      </ContentSection>
    );
  }
  const halves = section.presentation === 'form_island';
  const art = section.image ?? (halves ? ENQUIRY_SKETCH_TO_SHIPPED : ENQUIRY_DESK);
  const formProps = {
    action: ENDPOINTS.enquiry,
    context: enquiryContext ?? {
      originRoute: route,
      placement: id ?? '',
      family: 'page',
      serviceOrAudit: route === ROUTES.home ? 'home' : route.slice(1),
      referrer: '',
      campaign: '',
    },
    submitLabel: form.submitLabel,
    caption: form.caption ?? null,
    success: form.success,
    nextSteps: form.nextSteps,
    fieldScale: 'md' as const,
  };
  return (
    <CtaSection
      {...{ id, heading, eyebrow, surface, island, body, points }}
      data-band="L"
      islandArrangement={halves ? 'halves' : 'beside'}
      islandTexture={halves ? 'flow' : 'frame'}
      art={<Media image={art} sizes={halves ? '300px' : '240px'} />}
      footnote={section.footnote}
      footnoteIcon="shield-check"
      contact={section.contacts.length ? section.contacts : undefined}
      rating={rating ? <ReviewBadge rating={rating} /> : undefined}
      form={
        form.variant === 'compact' ? (
          <EnquiryForm variant="compact" {...formProps} />
        ) : (
          <EnquiryForm
            {...formProps}
            variant="enquiry"
            urlLabel={form.urlLabel}
            scheduleHref={form.scheduleHref}
            dress={{ kind: 'card', reply: form.reply ?? form.caption ?? '' }}
          />
        )
      }
    />
  );
}

export function PublishedSection({
  section,
  route = ROUTES.home,
  enquiryContext,
}: {
  section: Section;
  route?: string;
  enquiryContext?: EnquiryContextBase;
}) {
  const { id, heading, headingId, surface } = section;
  const head = { id, heading, headingId, surface };
  switch (section.type) {
    case 'gateway':
      return (
        <ContentSection
          {...head}
          data-band="C-router"
          eyebrow={section.eyebrow}
          lead={section.lead}
          align="center"
        >
          <GatewayPaths
            form="cards"
            paths={section.paths.map(({ exampleHtml, links, ...path }) => ({
              ...path,
              example: prose(exampleHtml),
              links: links.map((action) => ({ ...action, scene: sketchForRoute(action.href) })),
            }))}
            close={
              section.closingLine || section.action
                ? {
                    line: section.closingLine,
                    action: section.action ? (
                      <Button as="a" href={section.action.href} size="md">
                        {section.action.label}
                      </Button>
                    ) : undefined,
                  }
                : undefined
            }
          />
        </ContentSection>
      );
    case 'cases':
      return <CaseCards section={section} />;
    case 'offer':
      return <Offers section={section} />;
    case 'testimonials':
      return <Testimonials section={section} />;
    case 'engagement':
      return <PublishedEngagement section={section} />;
    case 'industries':
      return (
        <ContentSection
          {...head}
          data-band="C-pills"
          actionsAt="end"
          actions={link(section.action)}
        >
          <Cluster as="ul" colGap="tight" rowGap="tight">
            {section.links.map(({ label, href }) => (
              /* Keyed by label, never by href: a key is serialised into the page payload and a
                 path-shaped key is crawled as a URL (/expertise/fintech-5 404s in Search Console). */
              <li key={label}>
                <Tag variant="link" href={href}>
                  {label}
                </Tag>
              </li>
            ))}
          </Cluster>
        </ContentSection>
      );
    case 'resources': {
      const rows = section.presentation !== 'cards';
      return (
        <ContentSection {...head} data-band="K" lead={section.lead}>
          <Layout
            as="ul"
            rowGap={rows ? 'none' : 'gutter'}
            colGap={rows ? 'none' : 'gutter'}
            columns={rows ? 1 : { base: 1, md: 2, lg: 3 }}
          >
            {section.items.map(({ id, label, length, icon, ...item }) => {
              const format = label?.toLowerCase();
              const glyph =
                format && Object.hasOwn(TEASER_FORMAT_ICON, format)
                  ? TEASER_FORMAT_ICON[format as TeaserFormat]
                  : undefined;
              return (
                <Teaser
                  key={id}
                  {...item}
                  arrangement={rows ? 'row' : 'stack'}
                  metaAside={rows}
                  ruled={rows}
                  arrow
                  size="lg"
                  label={label}
                  icon={icon ?? glyph}
                  meta={length ? [length] : undefined}
                />
              );
            })}
          </Layout>
        </ContentSection>
      );
    }
    case 'cta':
      return <Cta section={section} route={route} enquiryContext={enquiryContext} />;
    case 'faq':
      return (
        <ContentSection
          {...head}
          data-band="D-faq"
          eyebrow={section.eyebrow}
          lead={section.lead}
          arrangement="beside"
          split="halves"
        >
          {section.items.length ? <Accordion items={section.items} /> : null}
        </ContentSection>
      );
  }
}

export function PublishedHome({ page }: { page: HomePageModel }) {
  return (
    <>
      <PublishedHero hero={page.hero} fallbackMedia={HOME_ARENA} />
      {page.sections.map((section) => (
        <PublishedSection key={section.key} section={section} />
      ))}
    </>
  );
}
