import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';
import { SCENES as P_AI_PRODUCTS_DEVELOPER_TOOLS } from './ai-products-developer-tools';
import { SCENES as P_B2B_SAAS_WORKFLOW_SOFTWARE } from './b2b-saas-workflow-software';
import { SCENES as P_CLIMATETECH_ENERGY } from './climatetech-energy';
import { SCENES as P_COMMERCE_TRANSACTIONAL_PRODUCTS } from './commerce-transactional-products';
import { SCENES as P_CONTENT_KNOWLEDGE_DISCOVERY_PLATFORMS } from './content-knowledge-discovery-platforms';
import { SCENES as P_DATA_ANALYTICS_DECISION_PRODUCTS } from './data-analytics-decision-products';
import { SCENES as P_EDTECH_LEARNING } from './edtech-learning';
import { SCENES as P_FINTECH } from './fintech';
import { SCENES as P_FINTECH_INSURTECH } from './fintech-insurtech';
import { SCENES as P_HEALTHTECH } from './healthtech';
import { SCENES as P_MARKETPLACES_MULTI_SIDED_PLATFORMS } from './marketplaces-multi-sided-platforms';
import { SCENES as P_MARTECH_SALESTECH } from './martech-salestech';
import { SCENES as P_PROPTECH_CONTECH_FIELD_OPERATIONS } from './proptech-contech-field-operations';
import { SCENES as P_AI_COPILOTS_AGENTS } from './ai-copilots-agents';
import { SCENES as P_AI_SEARCH_RECOMMENDATION } from './ai-search-recommendation';
import { SCENES as P_HUMAN_IN_THE_LOOP_WORKFLOWS } from './human-in-the-loop-workflows';
import { SCENES as P_TRUST_CONTROL_RECOVERY } from './trust-control-recovery';
import { SCENES as P_CODED_PROTOTYPING } from './coded-prototyping';
import { SCENES as P_DESIGN_TO_CODE } from './design-to-code';
import { SCENES as P_FRONTEND_DESIGN_SYSTEMS } from './frontend-design-systems';
import { SCENES as P_IMPLEMENTATION_QA } from './implementation-qa';
import { SCENES as P_DESIGN_SYSTEM_IMPLEMENTATION } from './design-system-implementation';
import { SCENES as P_DESIGN_SYSTEM_STRATEGY } from './design-system-strategy';
import { SCENES as P_FIGMA_STORYBOOK_ALIGNMENT } from './figma-storybook-alignment';
import { SCENES as P_GOVERNANCE_ADOPTION } from './governance-adoption';
import { SCENES as P_DATA_VISUALISATION } from './data-visualisation';
import { SCENES as P_INFORMATION_ARCHITECTURE_WORKFLOW_DESIGN } from './information-architecture-workflow-design';
import { SCENES as P_PROTOTYPING_USABILITY_TESTING } from './prototyping-usability-testing';
import { SCENES as P_UX_RESEARCH } from './ux-research';
import { SCENES as P_LEGACY_SOFTWARE_MODERNISATION } from './legacy-software-modernisation';
import { SCENES as P_PRODUCT_REDESIGN } from './product-redesign';
import { SCENES as P_REPLATFORMING_PRODUCT_DESIGN } from './replatforming-product-design';
import { SCENES as P_AI_PRODUCT_ENGINEERING } from './ai-product-engineering';
import { SCENES as P_BACKEND_API_DEVELOPMENT } from './backend-api-development';

/** Every level-2 page's What-you-get scenes, one file per page (components/Sketch/pages/*). */
export const PAGES: Partial<Record<PageSceneName, () => ReactNode>> = {
  ...P_AI_PRODUCTS_DEVELOPER_TOOLS,
  ...P_B2B_SAAS_WORKFLOW_SOFTWARE,
  ...P_CLIMATETECH_ENERGY,
  ...P_COMMERCE_TRANSACTIONAL_PRODUCTS,
  ...P_CONTENT_KNOWLEDGE_DISCOVERY_PLATFORMS,
  ...P_DATA_ANALYTICS_DECISION_PRODUCTS,
  ...P_EDTECH_LEARNING,
  ...P_FINTECH,
  ...P_FINTECH_INSURTECH,
  ...P_HEALTHTECH,
  ...P_MARKETPLACES_MULTI_SIDED_PLATFORMS,
  ...P_MARTECH_SALESTECH,
  ...P_PROPTECH_CONTECH_FIELD_OPERATIONS,
  ...P_AI_COPILOTS_AGENTS,
  ...P_AI_SEARCH_RECOMMENDATION,
  ...P_HUMAN_IN_THE_LOOP_WORKFLOWS,
  ...P_TRUST_CONTROL_RECOVERY,
  ...P_CODED_PROTOTYPING,
  ...P_DESIGN_TO_CODE,
  ...P_FRONTEND_DESIGN_SYSTEMS,
  ...P_IMPLEMENTATION_QA,
  ...P_DESIGN_SYSTEM_IMPLEMENTATION,
  ...P_DESIGN_SYSTEM_STRATEGY,
  ...P_FIGMA_STORYBOOK_ALIGNMENT,
  ...P_GOVERNANCE_ADOPTION,
  ...P_DATA_VISUALISATION,
  ...P_INFORMATION_ARCHITECTURE_WORKFLOW_DESIGN,
  ...P_PROTOTYPING_USABILITY_TESTING,
  ...P_UX_RESEARCH,
  ...P_LEGACY_SOFTWARE_MODERNISATION,
  ...P_PRODUCT_REDESIGN,
  ...P_REPLATFORMING_PRODUCT_DESIGN,
  ...P_AI_PRODUCT_ENGINEERING,
  ...P_BACKEND_API_DEVELOPMENT,
};
