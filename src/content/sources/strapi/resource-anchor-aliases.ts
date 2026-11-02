/** Retired heading links still present in published body copy, verified against native sections. */
export const RESOURCE_ANCHOR_ALIASES: Readonly<
  Record<string, Readonly<Record<string, string>>>
> = {
  'ai-search-in-saas-should-search-and-the-ai-assistant-be-one-input': {
    // One field, two modes: how Tcules redesigned Eden AI's workflow search.
    'one-field-two-modes-our-eden-ai-redesign': 'toc-7',
  },
  'best-design-system-agencies-and-consultants': {
    // Best when the system has to grow out of the product and hold in its code.
    'grow-the-system-out-of-product-work': 'toc-5',
  },
  'compare-two-interaction-models-at-equal-depth': {
    // Running the sessions: design and order.
    'running-the-comparison': 'toc-6',
  },
  'hiring-a-ui-ux-design-studio-in-india-for-a-saas-product': {
    // Product thinking, design craft and working software together; questions for every studio.
    'complex-saas-already-live': 'toc-3',
    'questions-to-ask': 'toc-9',
  },
};
