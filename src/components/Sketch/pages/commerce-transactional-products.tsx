import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /expertise/commerce-transactional-products · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Research from support emails and search terms: Research from support emails, search terms and abandoned baskets, and from watching staff handle orders */
  'wyg-commerce-transactional-products-research-from-support-emails': undefined,
  /* Product pages that answer fit: Navigation, search and product pages that answer fit, variant, stock, delivery and warranty beside the price */
  'wyg-commerce-transactional-products-product-pages-answer-fit': undefined,
  /* A checkout with the checks your products need: A checkout with the measuring, approvals and checks your products need before payment */
  'wyg-commerce-transactional-products-checkout-checks-products-need': undefined,
  /* Order, production and delivery status: Order, production and delivery status that customers and staff can both follow */
  'wyg-commerce-transactional-products-order-production-delivery-status': undefined,
  /* One set of components: One set of components and a style guide shared by the store and the back office, so a repeated interaction is agreed once with engineering */
  'wyg-commerce-transactional-products-one-set-components': undefined,
  /* Prototypes tested with buyers: Prototypes tested with buyers who know the part number and buyers still comparing */
  'wyg-commerce-transactional-products-prototypes-tested-buyers': undefined,
  /* The store built on Shopify or Magento: The store built on Shopify or Magento by our developers, or specs for your own team */
  'wyg-commerce-transactional-products-store-built-shopify-or': undefined,
  /* Who does the work: Your lead is a senior product designer who also does the design, with an account lead keeping the work on track. Researchers join for the ob */
  'team-commerce-transactional-products': undefined,
  /* What we need from you: Support emails, search terms and analytics, and time with the staff who handle orders. Buyers or trade accounts to test with, access to the  */
  'needs-commerce-transactional-products': undefined,
  /* Where our part stops: Ads, email campaigns and testing programmes stay with your performance marketing specialists. Consumer rules and payment authentication stay */
  'stops-commerce-transactional-products': undefined,
};
