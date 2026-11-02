/**
 * TIER 3 — templates.
 *
 * Whole page-type layouts: the article shape, the service-page shape. A template makes the
 * arrangement decisions for a page TYPE once, so thirty pages of that type cannot each get one
 * decision subtly different — which is the failure mode that produces pages reading as bugs
 * when seen second.
 *
 * A template may import from @/patterns and @/components. It may not import @/content — the
 * page reads content and passes it in.
 */
export {
  AuthorPieces,
  InsightResources,
  ListingClose,
  ListingIndex,
  caseFinder,
  caseViews,
  insightFinder,
  insightViews,
} from './ListingIndex';
export type {
  CaseGroup,
  CaseItem,
  CaseView,
  FinderGroup,
  FinderOption,
  FinderPick,
  InsightFormat,
  InsightItem,
  InsightKind,
  ListingBands,
  ListingClosing,
  ListingFinder,
  ListingHero,
  ListingIndexProps,
  ListingOffer,
  ListingSection,
  ListingView,
} from './ListingIndex';
export { CaseStory } from './CaseStory';
export type {
  CaseStoryChapterProps,
  CaseStoryFigureProps,
  CaseStoryPartProps,
  CaseStoryProps,
} from './CaseStory';
export { StudioPage } from './StudioPage';
export type { StudioPageContent, StudioPageProps } from './StudioPage';
export { ServicePage } from './ServicePage';
export type { ServicePageProps } from './ServicePage';
export {
  AboutPage,
  ContactPage,
  CorpusBandView,
  HomePage,
  PlainPage,
  LongformPage,
  OfferPage,
  ToolPage,
  corpusEnquiryForm,
  coverFor,
  gatewayBoardItems,
  gatewayItems,
  gatewayPaths,
  whyTcules,
  kindOf,
  planOffer,
  proofQuote,
  slugOf,
  testimonialItem,
  ENQUIRY_DESK,
  ENQUIRY_SKETCH_TO_SHIPPED,
  ENQUIRY_DRESS,
} from './CorpusPage';
export type {
  AboutPageProps,
  ContactPageProps,
  CorpusBandViewProps,
  HomePageProps,
  PlainPageProps,
  LongformFamily,
  LongformPageProps,
  OfferPageProps,
  ToolPageProps,
  OfferKind,
  OfferPart,
  OfferUnit,
  RatingsById,
} from './CorpusPage';
