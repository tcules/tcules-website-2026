---
route: /glossary/design-intent
slug: design-intent
page_name: Design Intent
page_type: defined_term
seo:
  title: 'What is design intent? Meaning and examples | Tcules'
  description: 'What is design intent? The behaviour and meaning a design must keep when it becomes software. Examples, how it differs from requirements, and how teams keep it.'
  canonical: https://www.tcules.com/glossary/design-intent
  robots: index,follow
social:
  og_title: 'What is design intent? Meaning and examples | Tcules'
  og_description: 'What is design intent? The behaviour and meaning a design must keep when it becomes software. Examples, how it differs from requirements, and how teams keep it.'
  og_image: https://www.tcules.com/assets/og/glossary.png
  og_image_alt: Tcules social card headed Glossary, on a white background with the Tcules wordmark.
  og_type: website
  og_url: https://www.tcules.com/glossary/design-intent
  og_site_name: Tcules
  og_locale: en_GB
  twitter_card: summary_large_image
  twitter_title: 'What is design intent? Meaning and examples | Tcules'
  twitter_description: 'What is design intent? The behaviour and meaning a design must keep when it becomes software. Examples, how it differs from requirements, and how teams keep it.'
  twitter_image: https://www.tcules.com/assets/og/glossary.png
search_context:
  primary_intent: what is design intent
  primary_buyer_question: What does design intent include?
  primary_query: 'what is design intent'
  secondary_queries:
  - 'design intent'
  - 'design intent meaning'
  - 'design intent definition'
  - 'design intent examples'
  - 'design intent in software'
  - 'design intent vs requirements'
  key_entities:
  - Design Intent
  buyer_question_evidence:
    status: PHRASE_MAP_V2_23_OCT
navigation:
  breadcrumb:
  - name: Home
    url: /
  - name: Glossary
    url: /glossary
  - name: Design Intent
    url: /glossary/design-intent
render:
  band_order:
  - practice
  - keeping-intent
  - comparison
  - related-terms
  - faq
  - next
structured_data:
  types:
  - WebPage
  - DefinedTerm
  - BreadcrumbList
  - FAQPage
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
  route_dependencies: []
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
      practice: definition
      keeping-intent: method_process
      comparison: comparison_decision
      related-terms: related_link
      faq: faq
      next: argument_thesis
  media_bindings: []
  commercial_system:
    testimonial_ids: []
    version: commercial-v11
    composition_rule: semantic_jobs_and_evidence_not_fixed_counts
  cms_contract:
    version: semantic-v11
---

*Glossary · Design Intent*

# What is design intent? Meaning, examples and how teams keep it

Design intent is the purpose behind a design: the behaviour and meaning it must keep when it becomes software, whatever the content, device or screen size. It matters when a build is checked against the design.

Real content and small screens force changes to a mock-up, and intent is how a team tells a sensible change from a defect.

It covers which information comes first, how the product responds, what feedback people get, what each action leads to, how the layout adapts and how people with different needs can use it. Copying a mock-up pixel for pixel can even work against it, as the example below shows.

[Design to code](/glossary/design-to-code) is how intent becomes software. [Implementation QA](/services/design-engineering/implementation-qa) checks the behaviour in the running product. A [Design-to-Code Audit](/audits/design-to-code-audit) can diagnose wider mismatches between design and build.

## Design intent examples in software {#practice}

A comparison table on desktop may become a stack of labelled records on mobile. The columns change; the intent, letting someone compare options and act on the right one, stays. Reading order and action priority count for more than keeping the columns.

A button's position is a detail. The intent behind it might be that a user can compare alternatives before committing. It might be that a status stays visible after an action, or that an error leaves a way forward. Statements like these give designers and engineers something real to compare when screen and code differ.

## How teams keep design intent through development {#keeping-intent}

- **Write the intent down.** One plain sentence per behaviour that matters: what comes first, what stays visible, where an error leads.
- **Review the build against it.** Check the running product with real content and small screens, using those sentences alongside the mock-up.
- **Agree changes in the open.** When the build has to differ, designer and engineer decide together whether the change keeps the intent, and record it.
- **Trace one behaviour end to end.** When screen and code disagree, follow that behaviour through the design file, the code and the live product.

The [Design-to-Code Audit](/audits/design-to-code-audit) follows one important behaviour through the sources a team uses. That separates a visual difference from a difference in product rules.

## Design intent vs requirements and design specifications {#comparison}

Requirements say what the product must do. A specification says how one design is built. Design intent sits between them: it names what the experience must keep, whatever the screen.

| | Design intent | Requirements | Design specification |
|---|---|---|---|
| What it states | What behaviour, meaning or consequence must survive | What the product must do, for whom and under which rules | How one approved design is to be built |
| When it changes | Stays valid when the exact screen changes | Changes when business rules or scope change | May need rewriting when the build or design system changes |
| How it helps | Helps resolve disagreements between design files and code | Sets what gets built and how it is accepted | Gives engineers a concrete reference for one design |

## Terms related to design intent {#related-terms}

[Design to code](/glossary/design-to-code): turning designs into working software and keeping the two in step, from behaviour and content to accessibility.

[Design engineering](/glossary/design-engineering): exploring, refining and building product experiences directly in code, so the intent is tested where it will run.

[Design system drift](/glossary/design-system-drift): what happens when Figma, code, documentation and live products slowly stop agreeing, often the point where intent is lost across products.

## Design intent FAQs {#faq}

### What is an example of design intent?

On a pricing screen, the intent might be that a buyer can compare plans before choosing one. On desktop that can be a table; on a phone it may become stacked cards. Either layout keeps the intent if the comparison stays easy and the right action stays clear.

### How is design intent different from requirements?

Requirements state what the product must do, for whom and under which rules. Design intent states what the experience must keep when it is built, such as reading order, feedback and what each action leads to. A build can meet every requirement and still lose the intent.

### Why does design intent matter in software?

Software meets real content, many screen sizes and edge cases a mock-up never shows. Written intent tells the team which changes are sensible adaptations and which are defects, so reviews focus on what users will actually notice.

### Who owns design intent on a product team?

The designer usually writes it down, and the product manager agrees it with them. Engineers keep it in the build and raise it when they need to change something. QA, or a design review before release, checks that it survived.

## When the screen and the code disagree {#next}

When intent and running code part ways, tracing one behaviour through both shows where and why.

Written intent matters more now that AI tools generate interface code from designs and prompts. A tool can copy a layout exactly and miss the reason behind it. Intent written as plain statements gives the tool and the reviewer the same thing to check against.

[See the Design-to-Code Audit →](/audits/design-to-code-audit)
