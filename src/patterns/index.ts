/**
 * TIER 2 — patterns.
 *
 * Composed blocks built FROM primitives: a reusable commercial close, page heroes, an enquiry
 * form, and cards.
 * Content-shaped but route-blind and data-blind — a pattern receives everything it renders as
 * props, so the same pattern serves a fixture today and a CMS response later.
 *
 * A pattern may import from @/components. It may not import a template or @/content.
 *
 * Breadcrumbs is the third kind here: not chrome like the nav and the footer, and not a block a
 * page is built out of, but a STATEMENT OF POSITION — an ordered list of the pages above this one.
 * It is a pattern for two independent reasons: it consumes a content shape (`{ label, href }` from
 * frontmatter), and it arranges itself with Cluster, which a primitive may not import. It owns no
 * band (since 5 Oct 2026): it is placed in PageHero's `trail` slot and reads the hero's ground.
 *
 * PageHero is the first of the fourth kind — an OPENING: the one block every page begins with,
 * carrying its single h1 and, in its `trail` slot, the Breadcrumbs. Like SiteNav and SiteFooter it
 * owns its band and takes `surface` as a prop, and for the same reason (a pattern that paints a
 * band has no ancestor to read data-surface from); unlike them, it is a block a page is built out
 * of rather than apparatus around one.
 *
 * CtaSection is its bookend — a CLOSE, the page's ask made once, carrying an h2 and never an h1.
 * It is the third pattern here to take `surface` as a prop, for the same reason as the other two,
 * with one distinction worth knowing: it hands the value to Section and paints nothing itself, so
 * taking the prop is not the same as owning the ground. It is also the only pattern that appears
 * TWICE on a route — a mid-page offer and a closing block are both this component.
 *
 * EnquiryForm is a BEHAVIOURAL FORM: route-blind in what it renders, but responsible for the
 * blur-validation and asynchronous lifecycle shared by every page that collects an enquiry.
 *
 * ProcessFlow is a DIAGRAM OF ORDER: stages the work passes through, each with its items, and an
 * optional lane for what another party holds throughout. A pattern because it takes a content
 * shape and composes Layout, Cluster and Icon; not steps (ListCard rows) and not peers (tiles).
 *
 * ListCard is the fifth kind, and the only one here that is not a block: it is a ROW, and the
 * smallest thing in this tier. It owns no band, takes no `surface`, paints no ground at rest, and renders a
 * bare <li> — the list element belongs to the caller, as a Layout with rowGap="none", because the
 * row finishes itself with its own block-end rule and a gap would break the ladder. It is a pattern
 * for the usual two reasons (it consumes a content shape, and it arranges with Cluster and Layout).
 * Its two SET MODES live in its folder: `Steps` (a method, an <ol> of numbered rows) and `ReadDown`
 * (the D body, a <ul> of peer rows in one column or two) own the list element because they own the
 * count — the type step and the ceilings — while each row inside them is still the bare <li>.
 * BlockCard is its sibling OBJECT: a borderless tile that fills a parent-owned grid track, with no
 * edge and no ground; its title scale, cover media and position make the object. BlockCardSet is its
 * set, the one place that knows the count and so the one place the featured first card is decided.
 * Accordion is a DISCLOSURE SET: one continuous rule ladder of native details/summary pairs. It
 * owns a CMS-shaped question/answer array and composes Layout, Cluster, Icon and Prose while
 * leaving surface and surrounding page rhythm to its caller.
 * Proof is EVIDENCE: an attributed quotation in six arrangements, checked figures, or both. It
 * composes Layout, Cluster, Prose, Button, Media, Icon, BrandMark and RatingBadge, takes the work
 * and the footer as slots, and leaves the ground and its position in a page argument to the caller.
 * Callout is a SCOPE NOTE: a quiet, unattributed boundary on the claim immediately before it. It
 * composes Prose inside a semantic note while leaving the ground and the claim-to-note seam to
 * its caller. It is not a quotation, alert, card or second rich-text variant.
 *
 * ContentSection is a BAND, and the only pattern here whose reason for existing is a distance:
 * one CMS section — eyebrow, heading, lead, then a run of blocks the caller supplies as children.
 * It takes `surface` like the other band-owning patterns and paints nothing itself. What it owns
 * is the grouping: the head is one group at 24 (eyebrow → heading → lead) so it reads as one
 * object, and the blocks are a separate 48 beat beneath it. One flat Layout cannot say that, which
 * is why this is a component and not three lines at a call site repeated on every route. It has
 * four arrangements of those beats — the head above the blocks; beside them from 1024 up, with an
 * aside or actions in the head track; split across the top as one row (the H-row); or a copy column
 * beside a photograph (the media split) — and a centred alignment of the first. Every one is
 * Layout's props rather than a second component.
 *
 * CtaRow is a band's FOOT: a hairline and one link action, with an optional note — the
 * section-level action the kit's families share (visual-direction § 3.1, § 1.4). It owns no band and
 * no ground, and is placed in ContentSection's `footer` or, with its rule off, its `actions`: a
 * ReactNode slot, because a pattern does not import a pattern. It is a pattern for the usual two
 * reasons — a content shape (`{ label, href }`) and a composition of Button, Icon, Cluster and Layout.
 *
 * Slider is a ROW YOU MOVE: slides in a sideways-scrolling, snapping row (Layout `scroll="always"`),
 * with previous / next controls and a progress rail (fdn-scroll, 6 Oct 2026; visual-direction
 * § 1.4 — an image set of five or more is a Slider showing three). It owns no band and no ground,
 * sits in a band's body and reads data-surface from it. Its slides are the caller's `<li>`s — a
 * BlockCard, or a testimonial wrapped in one — so it takes children rather than records, and it
 * is a pattern because it composes Layout, Cluster and Icon. It is a client component, like SiteNav,
 * TableOfContents and EnquiryForm, for a ref, listeners and the controls' state; the scrolling itself is CSS, so the row
 * swipes and snaps before it hydrates.
 *
 * Figure is the quietest thing in the tier and the first to hold an IMAGE as its subject rather
 * than as a marker: an asset, its caption and an optional quieter note, filling whatever inline
 * space it is handed and asking nothing of the container. It is presentational to the letter —
 * no state, no interactive node, no ARIA, no id — and it is a pattern for the usual two reasons.
 * Its one departure from every sibling above is that the image is NOT sized here: whether a
 * screenshot runs the width of the text or the width of the section is the page's decision, and
 * building it in would give two places the power to disagree.
 *
 * TableOfContents is the newest kind, and the only component in this repo whose rendered output is
 * not a function of its props alone: it is an OUTLINE — one short marker per section of one page,
 * marking the section the reader is currently in with one sliding line (owner, 26 Oct 2026). That
 * mark is the whole reason it is a component; without it a rail of links is a Layout and a list. It
 * is a client component reading where the page is scrolled to at every width: a rail beside the body
 * from 1024, a sticky bar naming the section in view below it. Like ListCard it owns no band and takes no `surface` — it is a TRACK, not
 * a band, and reads data-surface from the Section it sits inside. It is a pattern for the usual two
 * reasons and for a third that is stronger than either: it resolves ids that live outside its own
 * subtree, in the page's body, which is the strongest possible form of knowing something above
 * itself.
 *
 * It is not navigation and not the ancestor trail. SiteNav is how you reach another page;
 * Breadcrumbs says where this page sits in the site and ends in this page. This says what is inside
 * the page and ends in its last section, and its `#${string}` href type forbids it from ever
 * leaving the current document.
 *
 * The two are unrelated despite the word they share, and this barrel is where that collision is
 * visible: a `ProofFigure` is a CHECKED STATISTIC — a value, a label and the date it was verified
 * — while `Figure` is a captioned image. Neither renders the other, and nothing but the noun is
 * common to them.
 *
 * DataTable is TABULAR DATA, and the one case in the component audit that qualified as new on
 * markup and behaviour rather than on look: options against dimensions, whose semantics are a
 * `<table>` with scoped header cells that no card can express honestly. It owns no band and no
 * ground, composes Layout and Prose, and changes reading order — row by row, each value under its
 * column head — when the track it is given is narrower than the md content column.
 *
 * Banner and Statement are two BANDS of the kit (cmp-banner, 6 Oct 2026; visual-direction § 3.4 I
 * and J). Each owns its band and ground, and composes Section and Layout. Banner gives one
 * photograph (or an illustration) the band's whole weight under or beside a head, or renders the
 * one-line announcement strip at Section's `strip` density; Statement sets one sentence at the h1
 * role in the two-thirds track with a blue mark and, optionally, the head-half texture. Both take
 * their action as a ReactNode slot, because a pattern does not import a pattern.
 *
 * Contrast is a PAIR OF OPPOSITES (cmp-readdown, 6 Oct 2026; visual-direction § 3.4 N): what the
 * work is for beside what it is not, two ruled lists in peer halves whose glyphs carry the polarity.
 * Promoted from the service page's approved Fit. A block, not a band — it sits in a ContentSection
 * body — and a pattern because it consumes a content shape and composes Layout, Cluster and Icon.
 */
export { SiteNav } from './SiteNav';
export type {
  SiteNavProps,
  SiteNavItem,
  SiteNavLink,
  SiteNavGroup,
  SiteNavCard,
  SiteNavCardImage,
  SiteNavRail,
  SiteNavForm,
  SiteNavStatus,
} from './SiteNav';

export { Breadcrumbs } from './Breadcrumbs';
export type { BreadcrumbsProps, BreadcrumbItem } from './Breadcrumbs';

export { TableOfContents } from './TableOfContents';
export type { TableOfContentsProps, TocItem } from './TableOfContents';

export { CtaSection } from './CtaSection';
export type {
  CtaSectionProps,
  CtaPoint,
  CtaIconPoint,
  CtaPointMarker,
  CtaAction,
  CtaMedia,
  CtaMediaSide,
  CtaContact,
} from './CtaSection';

export { EnquiryForm } from './EnquiryForm';
export type {
  AuditUrlLabel,
  EnquiryChoice,
  EnquiryChoiceGroup,
  EnquiryContextBase,
  EnquiryDress,
  EnquiryFormProps,
  EnquiryNextStep,
  EnquiryUrlLabel,
} from './EnquiryForm';

export { ProcessFlow } from './ProcessFlow';
export type {
  ProcessFlowProps,
  ProcessFlowStage,
  ProcessFlowLane,
  ProcessFlowStageHeading,
} from './ProcessFlow';
export { ListCard, ReadDown, Steps } from './ListCard';
export type {
  ListCardProps,
  ListCardMarker,
  ListCardArrangement,
  ListCardForm,
  ListCardFrame,
  ListCardNumberTone,
  ListCardSize,
  ListCardTitleElement,
  Step,
  StepsProps,
  ReadDownRow,
  ReadDownProps,
  ReadDownColumns,
} from './ListCard';

export { Contrast } from './Contrast';
export type {
  ContrastProps,
  ContrastList,
  ContrastHeadingElement,
  ContrastEmphasis,
} from './Contrast';

export { BlockCard, BlockCardSet, FEATURED_FROM, SMALL_FROM } from './BlockCard';
export type {
  BlockCardProps,
  BlockCardMedia,
  BlockCardImage,
  BlockCardImageSide,
  BlockCardOrientation,
  BlockCardSize,
  BlockCardTitleElement,
  BlockCardTracks,
  BlockCardCue,
  BlockCardFrame,
  BlockCardLinkScope,
  BlockCardTextureRecipe,
  BlockCardSetProps,
  BlockCardSetItem,
  BlockCardSetLead,
  BlockCardSetAcross,
} from './BlockCard';

export { Accordion } from './Accordion';
export type { AccordionProps, AccordionItem, AccordionQuestionElement } from './Accordion';

export { Proof } from './Proof';
export type {
  ProofProps,
  ProofQuote,
  ProofFigure,
  ProofFigureSize,
  ProofPortrait,
  ProofRating,
  ProofAlign,
} from './Proof';

export { ContentSection, ContentSectionText } from './ContentSection';
export type {
  ContentSectionAlign,
  ContentSectionArrangement,
  ContentSectionMedia,
  ContentSectionMediaSide,
  ContentSectionMediaHeight,
  ContentSectionProps,
  ContentSectionTextProps,
} from './ContentSection';

export { CtaRow } from './CtaRow';
export type { CtaRowProps, CtaRowAction, CtaRowAlign } from './CtaRow';

export { Slider } from './Slider';
export type { SliderProps, SliderPerView, SliderAlign } from './Slider';

export { Callout } from './Callout';
export type { CalloutProps, CalloutTone } from './Callout';

export { DataTable } from './DataTable';
export type {
  DataTableProps,
  DataTableKeyColumn,
  DataTableColumn,
  DataTableRow,
  DataTableNodeCell,
  DataTableKeyBehaviour,
  DataTableColumnBehaviour,
} from './DataTable';

export { Figure } from './Figure';
export type { FigureProps, FigureImage } from './Figure';

export { PageHero } from './PageHero';
export type {
  PageHeroProps,
  HeroCredit,
  HeroPerson,
  HeroPortrait,
  HeroCreditRole,
  HeroDates,
  HeroFact,
  HeroAction,
  HeroActions,
  HeroArrangement,
  HeroMedia,
  HeroImage,
  HeroImageShape,
  HeroVideo,
  HeroTrail,
  HeroAnnouncement,
  HeroCut,
  HeroCutItem,
  HeroRating,
  HeroStat,
} from './PageHero';

export { SiteFooter } from './SiteFooter';
export type {
  SiteFooterProps,
  SiteFooterBrand,
  SiteFooterGroup,
  SiteFooterLink,
  SiteFooterMetaItem,
  SiteFooterNewsletter,
  SiteFooterSocial,
} from './SiteFooter';
export { Banner } from './Banner';
export type { BannerProps, BannerForm, BannerMediaSide, BannerLink, BannerBandHead } from './Banner';
export { Statement } from './Statement';
export type {
  StatementProps,
  StatementElement,
  StatementAlign,
  StatementTexture,
} from './Statement';

/* Thread — stages one decision passes through, on one blue line, with a return path (E band). */
export { Thread, type ThreadProps, type ThreadStage, type ThreadStageHeading } from './Thread';

/**
 * EngagementModel is the "How we work" USP band (r7-howwework, 9 Oct 2026): the engagement model
 * drawn as one chart over time, its three points keyed to the drawing's three marks. `full` for
 * its own page, `compact` for a service page.
 */
export { EngagementModel } from './EngagementModel';
export type {
  EngagementModelProps,
  EngagementModelArrangement,
  EngagementPoint,
  EngagementAction,
} from './EngagementModel';
/* VideoTestimonial — a client interview on film: poster, play control, pulled quote (r7-video). */
export {
  VideoTestimonial,
  type VideoTestimonialProps,
  type VideoTestimonialVariant,
  type VideoTestimonialFilm,
  type VideoTestimonialSource,
  type VideoTestimonialCaptions,
} from './VideoTestimonial';

/* LogoGrid — client marks in equal hairline cells, with an optional badge and context line (H band). */
export {
  LogoGrid,
  logoGridColumns,
  type LogoGridProps,
  type LogoGridMark,
  type LogoGridMarkArt,
  type LogoGridMarkName,
  type LogoGridTrack,
} from './LogoGrid';

/* CaseCard — one featured case as one card: the 16:9 cover beside its claim, the whole card the case's
   link (home's selected work, the case index's featured cases; no testimonial, 22 Oct 2026). */
export { CaseCard, type CaseCardProps } from './CaseCard';

/* Testimonial — the rated testimonial card: stars, the client's words, the speaker; a wall of them;
   and one beside the case it is about (home round 2, 10 Oct 2026). Every testimonial GROUP uses it. */
export {
  TestimonialBeside,
  TestimonialCard,
  TestimonialWall,
  type TestimonialAvatar,
  type TestimonialBesideArrangement,
  type TestimonialBesideProps,
  type TestimonialCardProps,
  type TestimonialFrame,
  type TestimonialItem,
  type TestimonialSize,
  type TestimonialWallProps,
} from './Testimonial';

/* Gateway — the situation selector: six reader situations, one lit, its answer beside it (home
   "What do you need next?", round 6, 11 Oct 2026). */
export { Gateway, type GatewayArrangement, type GatewayItem, type GatewayProps } from './Gateway';
/* GatewayPaths — the two-door form: two paths, each its drawing, words and links (home, 29 Oct 2026). */
export { GatewayPaths, type GatewayPath, type GatewayPathsProps } from './Gateway';

/* Product-design round 6 (11 Oct 2026, page-mapping § 23): four bands designed for their job. */
/* OfferSheet — what the buyer gets, as one offer, the client's words anchored beside it. */
export {
  OfferSheet,
  type OfferSheetItem,
  type OfferSheetProps,
  type OfferSheetTerm,
} from './OfferSheet';

/* OfferParts — "What you get" in four parts: the deliverables across, three peer parts under them. */
export {
  OfferParts,
  type OfferPart,
  type OfferPartsDeliverable,
  type OfferPartsProps,
} from './OfferParts';

/* Reasons — why choose us: argued reasons, each with a drawing of its claim, in three arrangements. */
export {
  Reasons,
  type ReasonsArrangement,
  type ReasonsFigure,
  type ReasonsItem,
  type ReasonsMark,
  type ReasonsProof,
  type ReasonsProps,
} from './Reasons';

/* VoiceLedger — complaints in the customer's own words, each answered by where we start. */
export { VoiceLedger, type VoiceLedgerItem, type VoiceLedgerProps } from './VoiceLedger';

/* CaseSpread — one worked example: the outcome as the claim beside its evidence, the story under. */
export { CaseSpread, type CaseSpreadPart, type CaseSpreadProps } from './CaseSpread';

/* EngagementOptions — ways to work with us, comparable at a glance through one scope drawing each. */
export {
  EngagementOptions,
  type EngagementArrangement,
  type EngagementOption,
  type EngagementOptionsProps,
  type EngagementScope,
} from './EngagementOptions';

/* TracePlates — one screen followed from the approved design to what users see, a drawn plate per
   stage and one trace through them (the design-to-code audit's "What we trace", 11 Oct 2026). */
export { TracePlates, type TracePlatesProps, type TraceScene, type TraceStage } from './TracePlates';

/* ProfileCard — a person (portrait, name, position, bio, LinkedIn) and the follow banner (about, 12 Oct 2026). */
export { ProfileCard, ProfileFollow, type ProfileCardProps, type ProfileFollowProps, type ProfileLink } from './ProfileCard';

/* Contributors — the people behind a piece, after its content (byline board G, 30 Oct 2026). */
export { Contributors, type Contributor, type ContributorLink, type ContributorsProps } from './Contributors';

/* IndexRail — a curated listing page's rail beside its content: a BY TYPE / BY TOPIC switch that
   changes the whole view (held in the URL), or a picker of sibling pages (insights, 16 Oct 2026). */
export { IndexRail, type IndexRailItem, type IndexRailMode, type IndexRailProps } from './IndexRail';

/* FilterPanel — a listing's filters in a side panel: groups of chips, Reset and Apply, by GET. */
export {
  FilterPanel,
  type FilterPanelGroup,
  type FilterPanelOption,
  type FilterPanelProps,
} from './FilterPanel';

/* Teaser — one linked piece held without an edge: picture or date or meta line at its head, in a
   stack, beside, or as a row with an end thumbnail (insights hub and format pages, 16 Oct 2026). */
export {
  Teaser,
  TEASER_FORMAT_ICON,
  type TeaserArrangement,
  type TeaserDate,
  type TeaserFormat,
  type TeaserImage,
  type TeaserMedia,
  type TeaserProps,
  type TeaserSize,
} from './Teaser';

/* Bento — linked tiles of two sizes on four tracks, each a name, a line and its drawing, over one
   continuous texture per row (home "What we do", owner 19 Oct 2026). */
/* ServiceTile is one bento tile on its own, for a named service sitting as a card in another set
   (an insights shelf's related service), 29 Oct 2026. */
export {
  Bento,
  ServiceTile,
  type BentoItem,
  type BentoProps,
  type BentoCta,
  type BentoCtaAction,
  type BentoCtaRoute,
  type ServiceTileProps,
} from './Bento';
/* ClaimSet — a page's hard parts: one claim at a time on a stage (tabs), or every claim on the page,
   ruled (owner, 31 Oct 2026; docs/page-build/hard-parts-brief.md). */
export {
  ClaimSet,
  type ClaimSetItem,
  type ClaimSetProps,
  type ClaimExample,
} from './ClaimSet';
