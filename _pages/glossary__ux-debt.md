---
route: /glossary/ux-debt
slug: ux-debt
page_name: UX Debt
page_type: defined_term
seo:
  title: 'What is UX debt? Meaning, causes and measurement | Tcules'
  description: 'What is UX debt? Past product choices that make users'' work and later changes harder: causes, examples, how to measure it and how it differs from tech debt.'
  canonical: https://www.tcules.com/glossary/ux-debt
  robots: index,follow
social:
  og_title: 'What is UX debt? Meaning, causes and measurement | Tcules'
  og_description: 'What is UX debt? Past product choices that make users'' work and later changes harder: causes, examples, how to measure it and how it differs from tech debt.'
  og_image: https://www.tcules.com/assets/og/glossary.png
  og_image_alt: Tcules social card headed Glossary, on a white background with the Tcules wordmark.
  og_type: website
  og_url: https://www.tcules.com/glossary/ux-debt
  og_site_name: Tcules
  og_locale: en_GB
  twitter_card: summary_large_image
  twitter_title: 'What is UX debt? Meaning, causes and measurement | Tcules'
  twitter_description: 'What is UX debt? Past product choices that make users'' work and later changes harder: causes, examples, how to measure it and how it differs from tech debt.'
  twitter_image: https://www.tcules.com/assets/og/glossary.png
search_context:
  primary_query: 'what is UX debt'
  secondary_queries:
  - 'UX debt'
  - 'UX debt examples'
  - 'UX debt vs technical debt'
  - 'design debt'
  - 'how to measure UX debt'
  primary_intent: what is ux debt
  primary_buyer_question: What is UX debt?
  key_entities:
  - UX Debt
  buyer_question_evidence:
    status: PHRASE_MAP_V2_23_OCT
navigation:
  breadcrumb:
  - name: Home
    url: /
  - name: Glossary
    url: /glossary
  - name: UX Debt
    url: /glossary/ux-debt
render:
  band_order:
  - practice
  - debt-types
  - comparison
  - measure
  - faq
  - next
structured_data:
  types:
  - WebPage
  - DefinedTerm
  - FAQPage
  - BreadcrumbList
  organization_ref: https://www.tcules.com/#organization
  page_creator_ref: https://www.tcules.com/#organization
  defined_term_set_ref: https://www.tcules.com/glossary#glossary
release:
  content_state: CONTENT_READY
  site_release_state: SITE_RELEASE_HOLD
  composition: NOT_COMPOSITION_VALIDATED
  production: NOT_PRODUCTION_VALIDATED
  free_audit_role: DOES_NOT_DEPEND_ON_FREE_AUDIT
  site_dependencies:
  - SITE_PRODUCTION_QA
  - MIGRATION_EXECUTION
  - SITEMAP_DEPLOYMENT
  - SOCIAL_IMAGE_ASSET_VALIDATION
  - HUMAN_MARKETING_REVIEW
  route_dependencies:
  - CLAIM_EVIDENCE_VERIFICATION
  feature_dependencies: []
  legal_dependencies: []
migration:
  redirects_from: []
content_governance:
  v10_role: canonical_concept_definition
  commercialisation: none
  master_contract: Tcules Website V11, Editorial Embodiment & Visual Proof Pass
  repair_pass: V10.1_AUDIT_REPAIR
  editorial_pass: V11_EDITORIAL_EMBODIMENT_VISUAL_PROOF
  pre_review_repair: V11.1_PRE_REVIEW_REPAIR
  language: en-GB
page_composition:
  editorial_review:
    section_components:
      practice: argument_thesis
      comparison: artefact_proof
      next: argument_thesis
      debt-types: comparison_decision
      measure: method_process
      faq: faq
  media_bindings: []
  commercial_system:
    testimonial_ids: []
    version: commercial-v11
    composition_rule: semantic_jobs_and_evidence_not_fixed_counts
  cms_contract:
    version: semantic-v11
---

*Glossary · UX Debt*

# What is UX debt? Meaning, causes and how to measure it

UX debt is the accumulated cost of past design shortcuts that make future user work and product change harder. The label helps when every change takes longer and workarounds have turned into training material. Naming the debt turns a vague complaint into an item someone owns and can repay.

A team may keep duplicate approval states and export work to a spreadsheet. Each new change gets slower until the underlying model is fixed. A local usability problem with no build-up of change cost is not automatically debt.

UX debt can show up as inconsistent behaviour, duplicated workflows, unclear permissions, or design and code that no longer match. It can also be a model that no longer fits the product. The metaphor works when the team records the cost, an owner and a reason to repay it or accept it.

[Product modernisation](/glossary/product-modernisation) is one way to repay it. The aim is a product where new work ships without the old workarounds. A [UX & Product Audit](/audits/ux-product-audit) or [Product Modernisation Assessment](/audits/product-modernisation-assessment) can tell debt from a contained defect.

## UX debt examples, and what each one costs a team {#practice}

UX debt becomes a useful term once small local choices have piled up and later change is harder. Examples include inconsistent behaviour, duplicated workflows, inaccessible patterns and navigation that no longer reflects the product. Interface workarounds that cover for missing product rules count too. The question that matters is what repeated cost the inconsistency creates.

A [UX & Product Audit](/audits/ux-product-audit) can tell a local fault from a deeper workflow or structural problem before the team chooses a redesign.

## UX debt vs technical debt and design debt {#debt-types}

Many teams use design debt and UX debt as one term. Where they are split, the difference is who feels the cost first.

| Technical debt | UX debt | Design debt |
|---|---|---|
| Shortcuts in the code that make it harder to change safely | Past product and interface choices that make people's work, and later product change, harder | Inconsistency in the design layer, such as duplicated components, off-system styles and out-of-date files |
| Felt first by engineers | Felt first by users, support staff and whoever designs the next change | Felt first by designers and the engineers matching their files |
| Repaid through refactoring, upgrades and tests | Repaid by redesigning workflows, structure or behaviour | Repaid by bringing parts back into a shared [design system](/glossary/design-system) |

## How to tell UX debt from a visual inconsistency {#comparison}

| Visual inconsistency | UX debt |
|---|---|
| Two surfaces look or style the same thing differently | Past product or interface choices create recurring friction, ambiguity or cost of change |
| Can be corrected locally | May need workflow, information architecture, design system or build work |
| Does not necessarily affect the task | Matters when it changes understanding, behaviour, accessibility or delivery effort |

## How to measure UX debt {#measure}

UX debt rarely shows up in one number. Teams measure it by its repeated cost.

1. **List the workarounds.** Collect the spreadsheets, manual steps and support replies people use to get round the product.
2. **Count the repeat cost.** Note how often each workaround happens and who it slows: users, support staff, designers or engineers.
3. **Trace the shared cause.** Group symptoms that come from the same root, such as a missing status or a confusing permission model.
4. **Give each item an owner.** Record the cost, the owner and whether to repay it now, repay it later or accept it.
5. **Check again after each release.** Track whether the workarounds and the related support requests are falling.

## Questions about UX debt {#faq}

### What causes UX debt?

UX debt builds up when teams ship quick fixes under deadline pressure, add features without revisiting the structure around them, or let design and code drift apart. Each choice can be sensible at the time. The debt is the repeated cost those choices leave behind.

### Can UX debt be paid down without a full redesign?

Usually, yes. Most UX debt clusters around a few shared causes, and fixing one cause can remove many symptoms at once. A full redesign is worth it when the product's underlying model no longer fits the work people do.

### Who should own UX debt?

The product owner usually makes the decision to repay or accept it, with design and engineering estimating the cost. Each item needs a named owner and a place in the same backlog as feature work, so it competes for time in the open.

## Find the shared cause of UX debt first {#next}

Find the shared cause before you fund another redesign. A shared cause, where there is one, gives the team a sharper change to make. When AI tools speed up adding features, debt can build sooner if nobody looks after the model underneath, and the remedy stays the same. [Information architecture](/glossary/information-architecture) is often where it sits, and [design system drift](/glossary/design-system-drift) is a common source of design debt.

[See Product Modernisation →](/services/product-modernisation)
