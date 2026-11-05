import type { CaseStudyListingImage } from '../../types.ts';

/**
 * The V1 case covers (owner, 3 Nov 2026: the product's UI cut out over its own full dashboard at
 * 13%, on paper, one shadow), keyed by the case's LIVE slug. Each wins over the case's Strapi
 * thumbnail in `getCaseStudyListingPage` (source.ts), so every place that shows a case's cover (the
 * /case-studies index, home, a service page citing the case) shows this one.
 *
 * Delivered as "Casestudy Images design (4).zip" (5 Nov 2026), drawn from its @2x masters into
 * `public/case-covers/` at 2560, 1600 and 960 wide. Two live cases have no entry and keep their
 * Strapi thumbnail: Kirana store payments (owner, 5 Nov 2026: it stays as the live site has it) and
 * Ringier (not in the delivery).
 *
 * The alt stays Strapi's: the record's own words for the picture.
 */
const cover = (file: string): Omit<CaseStudyListingImage, 'alt'> => ({
  src: `/case-covers/${file}.webp`,
  width: 2560,
  height: 1440,
  sources: [
    { src: `/case-covers/${file}-960.webp`, width: 960 },
    { src: `/case-covers/${file}-1600.webp`, width: 1600 },
    { src: `/case-covers/${file}.webp`, width: 2560 },
  ],
});

export const CASE_COVERS: Readonly<Record<string, Omit<CaseStudyListingImage, 'alt'>>> = {
  'consumer-grade-ux-in-enterprise-saas-a-case-study-on-mvp-design-for-cpq-software':
    cover('auxentious'),
  'legacy-saas-modernisation-information-architecture': cover('benchmark'),
  'ai-quality-control-expert-review-buildtwin': cover('builtwin'),
  'ux-ui-design-and-development-for-magento-of-a-silver-chain-store': cover('chain-hut'),
  'insurance-workflow-software-ux-chestnut': cover('chestnut'),
  'ai-native-building-energy-product-connectx': cover('connect-x'),
  'enterprise-workflow-redesign-dealpath-real-estate': cover('dealpath'),
  'doodle-case-study-automating-enterprise-meeting-scheduling': cover('doodle'),
  'unifying-workflow-creation-through-intelligent-search': cover('eden-ai'),
  'boosting-web-to-print-sales-and-efficiency-by-modernising-legacy-erp-ux':
    cover('gold-image-printing'),
  'redesigning-for-a-shopify-website-ux-design': cover('gt-tools'),
  'saas-ux-ui-case-study-ai-for-market-research-automation': cover('novus'),
  'optimising-microlending-fintech-app-for-a-y-combinator-batch-startup': cover('octify'),
  'designing-trust-how-tcules-helped-omnyai-reframe-their-ai-human-relationship': cover('omny'),
  'fintech-ux-design-crypto-exchange-phoenix': cover('phoenix'),
  'ux-revamp-for-a-saas-product-in-marketing-automation-vertical': cover('ryzeo'),
  'saas-ux-ui-case-study-research-and-object-oriented-ux-for-staffing-agencies-software':
    cover('scissors'),
  'transforming-an-edtech-platform-into-an-engaging-learning-experience':
    cover('wandering-raven'),
};
