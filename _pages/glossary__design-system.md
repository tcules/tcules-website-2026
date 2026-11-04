---
route: /glossary/design-system
slug: design-system
page_name: Design System
page_type: defined_term
seo:
  title: 'What is a design system? Meaning and components | Tcules'
  description: 'What is a design system? The shared styles, components, code, guidance and rules products build with, how it differs from a component library, and an example.'
  canonical: https://www.tcules.com/glossary/design-system
  robots: index,follow
social:
  og_title: 'What is a design system? Meaning and components | Tcules'
  og_description: 'What is a design system? The shared styles, components, code, guidance and rules products build with, how it differs from a component library, and an example.'
  og_image: https://www.tcules.com/assets/og/glossary.png
  og_image_alt: Tcules social card headed Glossary, on a white background with the Tcules wordmark.
  og_type: website
  og_url: https://www.tcules.com/glossary/design-system
  og_site_name: Tcules
  og_locale: en_GB
  twitter_card: summary_large_image
  twitter_title: 'What is a design system? Meaning and components | Tcules'
  twitter_description: 'What is a design system? The shared styles, components, code, guidance and rules products build with, how it differs from a component library, and an example.'
  twitter_image: https://www.tcules.com/assets/og/glossary.png
search_context:
  primary_query: 'what is a design system'
  secondary_queries:
  - 'what is a design system in UX'
  - 'design system meaning'
  - 'design system components'
  - 'why use a design system'
  - 'design system vs component library'
  - 'design system vs style guide'
  primary_intent: what is design system
  primary_buyer_question: What is a design system?
  key_entities:
  - Design System
  buyer_question_evidence:
    status: PHRASE_MAP_V2_23_OCT
navigation:
  breadcrumb:
  - name: Home
    url: /
  - name: Glossary
    url: /glossary
  - name: Design System
    url: /glossary/design-system
  section_labels:
    components: What it includes
    practice: Example
    comparison: Vs component library
    faq: FAQs
    next: Where Tcules helps
render:
  band_order:
  - components
  - practice
  - comparison
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
      practice: argument_thesis
      comparison: argument_thesis
      next: argument_thesis
      components: definition
      faq: faq
  media_bindings: []
  commercial_system:
    testimonial_ids: []
    version: commercial-v11
    composition_rule: semantic_jobs_and_evidence_not_fixed_counts
  cms_contract:
    version: semantic-v11
---

*Glossary · Design System*

# What is a design system? Meaning, components and a real example

A design system is the shared kit that several products or teams build with: styles, reusable interface parts in design files and in code, guidance on using them, and rules for how they change. In UX terms, repeated parts look and behave the same way across screens, so people learn them once.

Teams most often need the term when they must work out what is shared and what stays local to one product.

That line between shared and local is the hard part. Component count is easy to measure and says little.

A component library is one part of a design system. A shared status choice, for example, has to carry the same meaning in the design files, the code, the documentation and every product that uses it. A system also needs owners, a way to contribute and a way to migrate.

[Design system governance](/glossary/design-system-governance) explains how shared choices change. [Design system adoption](/glossary/design-system-adoption) asks whether teams use them. [Design system drift](/glossary/design-system-drift) names the unintended gaps that open between them.

Explore [Design Systems](/services/design-systems).

## Design system components: what a design system includes {#components}

Most systems hold the same six layers. Smaller teams may start with two or three and add the rest as more products share them.

| Layer | What it holds |
|---|---|
| **Foundations** | Design tokens: the named colour, spacing, type and motion values every screen uses |
| **Components** | Buttons, fields, tables, menus and the rest, each with its states such as loading, empty, error and disabled |
| **Patterns** | Repeated answers to whole tasks, such as filtering a list, confirming a risky action or showing an empty page |
| **Design files and code** | The Figma library and the coded components, kept in step so designers and engineers use the same parts |
| **Guidance** | When to use each part, how to write its labels and what it needs for accessibility |
| **Rules for change** | Who owns the system, how teams contribute and how products move to a new version |

## Why use a design system? An example from Auxentios {#practice}

A design system pays off when several products or teams keep making the same interface choice. The shared layer carries what needs one answer, and product-specific behaviour can stay local.

In the [Auxentios case](/case-studies/auxentios-cpq-product-mvp-design), Tcules developed components, design tokens and layout guidance from the product model. Design tokens are the shared colour, spacing and type settings. The library followed the product work.

Auxentios expected its product to need more than 200 screens. Designing each one alone would have meant hundreds of separate choices to maintain. Repeated needs became shared components once the core experiences were worked through. That is the usual reason to use a design system: solve a repeated problem once and reuse the answer.

[Matter](/matter-design-system) is a free Figma design system Tcules made and published. It shows how Tcules names design tokens and structures components.

## Design system vs component library and style guide {#comparison}

People use the three terms loosely. Each one usually contains the one before it.

| Style guide | Component library | Design system |
|---|---|---|
| Visual rules such as colour, type, logo use and tone of voice | Reusable interface components | Foundations, components, patterns, design files, code, guidance and rules for change |
| Answers how the product should look and sound | Answers how a shared element looks and works | Also answers what belongs in the shared layer, how it changes and how products adopt it |
| Often a document or a page of examples | Can exist without a way to contribute or migrate | Needs ownership and a route from change to the products that use it |

## Design system questions teams ask {#faq}

### What does a design system mean in UX?

In UX, a design system is what keeps the experience consistent as a product grows. The same action looks and behaves the same way on every screen, so people learn it once. Designers then spend their time on new problems instead of redrawing solved ones.

### Is a Figma library the same as a design system?

A Figma library is one part of a design system: the design assets. A full system also has matching coded components, guidance on when to use each part, and owners who decide how it changes. A library that has drifted away from the code is a common sign that those other parts are missing.

### When does a product team need a design system?

A team needs one when several products, squads or designers keep solving the same interface problem in different ways. Familiar signs are three versions of the same table and review comments about spacing. A single small product can start with a shared component library and grow from there.

### Can a design system be added to a product that already exists?

Yes. Many systems start inside a live product: the team finds the repeated parts and pulls them into shared components, one area at a time. In the [Gold Image Printing modernisation](/case-studies/gold-image-printing-web-to-print-erp-modernisation), Tcules designed components and a style guide, then used them across the online store and the internal ERP.

## Where Tcules plans, builds and repairs design systems {#next}

What the shared system should own, and what should stay local to a product, is the choice behind the definition. Design systems are also becoming something software reads: some teams now write their rules so AI tools can build from them, and a clear, well-described system helps keep generated screens consistent. Two more terms sit close by: [design to code](/glossary/design-to-code), which keeps the build matching the design, and [design engineering](/glossary/design-engineering), the practice of designing directly in code.

Tcules plans, builds and repairs design systems through [Design Systems](/services/design-systems). [Design System Implementation](/services/design-systems/design-system-implementation) puts the system into Figma and code, and [Figma and Storybook Alignment](/services/design-systems/figma-storybook-alignment) brings an existing library and its code back in step.

[See Design Systems →](/services/design-systems)
