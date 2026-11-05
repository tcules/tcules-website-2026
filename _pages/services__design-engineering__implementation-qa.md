---
route: /services/design-engineering/implementation-qa
slug: implementation-qa
page_name: Implementation QA
page_type: service
seo:
  title: 'Design QA Services: Check the Build Before Release | Tcules'
  description: 'Design QA for SaaS releases: we compare your working product with the agreed design, sort every difference and give engineers a clear fix list.'
  canonical: https://www.tcules.com/services/design-engineering/implementation-qa
  robots: index,follow
social:
  og_title: 'Design QA Services: Check the Build Before Release | Tcules'
  og_description: 'Design QA for SaaS releases: we compare your working product with the agreed design, sort every difference and give engineers a clear fix list.'
  og_image: IMAGE_ASSET_REQUIRED
  og_image_alt: IMAGE_ASSET_REQUIRED
  og_type: website
  og_url: https://www.tcules.com/services/design-engineering/implementation-qa
  og_site_name: Tcules
  og_locale: en_GB
  twitter_card: summary_large_image
  twitter_title: 'Design QA Services: Check the Build Before Release | Tcules'
  twitter_description: 'Design QA for SaaS releases: we compare your working product with the agreed design, sort every difference and give engineers a clear fix list.'
  twitter_image: IMAGE_ASSET_REQUIRED
search_context:
  primary_intent: design implementation QA for SaaS and complex products
  primary_buyer_question: Which runtime differences are defects, legitimate adaptations or product questions that need a new decision?
  supporting_questions:
  - Is implementation QA the same as visual QA?
  - How is this different from a Design-to-Code Audit?
  - What do you need from us?
  - Do you check that fixes worked?
  primary_query: design QA
  secondary_queries:
  - design QA services
  - what is design QA
  - design QA for product teams
  - design QA checklist
  - Figma vs build comparison
  - design QA process
  - implementation QA vs design-to-code audit
  - visual QA
  - UI design QA
  - design QA before release
  - do you check that fixes worked
navigation:
  breadcrumb:
  - name: Home
    url: /
  - name: Services
    url: /services
  - name: Design Engineering
    url: /services/design-engineering
  - name: Implementation QA
    url: /services/design-engineering/implementation-qa
conversion:
  form: project_enquiry
  anchor: enquiry
  visible_fields:
  - Email
  - What are you working on?
  - Product or company URL
  optional_fields:
  - Product or company URL
  submit_label: Request a call
  hidden_context: origin_route, placement, family, service_or_audit, referrer, campaign
  on_success:
    heading: Thanks. Your request has reached us.
    body: We'll reply within one business day to arrange the call, sometimes with a question or two first.
    retain_entered_data: true
    post_submit_scheduling: optional_only_if_runtime_supports
  processor: cms_record_and_notify
render:
  band_order:
  - what-you-get
  - selected-work
  - finding
  - compare
  - testimonials
  - how-we-work-together
  - why-tcules
  - industries
  - faq
  - enquiry
page_composition:
  visual_plan: match_legitimate_adaptation_defect_missing_state_unresolved_product_decision
  media_bindings:
  - id: qa_dealpath_workflow
    role: demonstrate
    supports_section: selected-work
    asset_uri: https://res.cloudinary.com/dbay1gb0s/image/upload/v1787139518/section_3_ffd1c5cb2a.webp
    alt_intent: 'Dealpath''s redesigned Add to pipeline flow, which asks people to search for and attach an existing deal before creating a new one.'
    source: current public Tcules case media
    status: BOUND_EXISTING_PUBLIC_ASSET
  - id: qa_gt_tools_implemented_header
    role: demonstrate
    supports_section: selected-work
    asset_uri: https://res.cloudinary.com/dbay1gb0s/image/upload/v1766141312/6613c9478a5637f46c429843_rtf_image1_232bdfc9bb.png
    alt_intent: 'GT Tools'' Shopify storefront as built by Tcules from its own design, showing navigation and product discovery.'
    source: current public Tcules case media
    status: BOUND_EXISTING_PUBLIC_ASSET
  testimonial_ids:
  - DRAFT-KNOVOS-CANDOUR
  - DRAFT-CURAMCARE-ONEILL
  - FP-EDEN-DEVELOPERS
  institutional_trust:
    component_type: institutional_fact_row
    facts:
    - founded_2017
    - projects_90plus
    - client_countries_19
    - studio_ahmedabad
    placement: studio_signature_after_proof
    claim_policy: Verify these institution-level facts at publication. Reuse their sources, not hardcoded display values.
  independent_reputation:
    component_type: linked_review_marker
    source: https://clutch.co/profile/tcules-saas-product-design-studio
    snapshot_date: '2026-10-08'
    rating: 4.8
    displayed_reviews: 13
    placement: studio_signature_after_proof
    publication_gate: REVERIFY_LIVE_RATING_AND_COUNTS
  client_recognition:
    component_type: client_recognition
    placement: hero_followup_or_contextual_proof
    clients:
    - Dealpath
    - GT Tools
    - The Chain Hut
    asset_policy: Approved logo rights required; otherwise render accurate client names as text. Relationship does not imply endorsement or identical engagement scope. The Chain Hut is not yet in CLIENTS-REGISTER.
  proof_claim_policy: NO_STANDALONE_QA_CASE;EDEN_SPECS_QUOTE_ADJACENT_ONLY
  content_composition:
    primary_intent: design implementation QA
    recognition_count: 3
    signature_model_type: implementation-difference-triage
    proof_component: source_bound_named_case_or_explicit_proof_gap
    testimonial_component: verbatim_quote_with_source_scope_in_cms
    form_anchor: enquiry
    mobile_table_policy: stack_as_labelled_rows
  signature_explanatory_object:
    type: implementation-difference-triage
    sequence:
    - Design intent
    - Observed behaviour
    - Defect or adaptation?
    - Disposition
    - Verification
    label: Editorial explanatory diagram; not a client artefact
    media_rights: Conceptual only; real project visuals require approval
  testimonial_context: GENERAL_STUDIO_ENDORSEMENT_NOT_ROUTE_SPECIFIC
  source_evidence_boundary: Benchmark and GT Tools support implementation-aware Product Design; neither is proof of a formal separate QA service with measured defect reduction.
  editorial_proof_review: REVIEW_IF_SOURCE_PROOF_SECTION_ALREADY_HAS_CAVEAT; NEVER_ATTRIBUTE_METRICS_FROM_GENERIC_TESTIMONIAL
  signature_proposition: Not every difference is a defect. The valuable work is determining which divergences compromise product meaning and which are intentional changes.
structured_data:
  types:
  - WebPage
  - Service
  - BreadcrumbList
  - FAQPage
  organization_ref: https://www.tcules.com/#organization
  service_provider_ref: https://www.tcules.com/#organization
release:
  content_state: STUDIO_SPINE_ROLLOUT_2026-10-26
  site_release_state: SITE_RELEASE_HOLD
  composition: STATIC_PREVIEW_REQUIRES_FINAL_VISUAL_DESIGN
  production: NOT_PRODUCTION_VERIFIED
  route_dependencies:
  - FORM_ENDPOINT_VERIFICATION
  - CLAIM_EVIDENCE_VERIFICATION
  - IMPLEMENTATION_QA_ARTEFACT_REQUIRED
  - EXACT_OCT1_ASSEMBLED_BODY_DIFF
  - CASE_MEDIA_AND_CLAIM_REVIEW
  - NO_STANDALONE_QA_CASE;EDEN_SPECS_QUOTE_ADJACENT_ONLY
content_governance:
  language: en-GB
  direct_quote_policy: preserve_verbatim_source_checked
  governing_rules: Tcules-VNext-Working-2026-10-08/00_RULEBOOK.md
  source_body: Tcules_Phase10_Canonical_Assembly_and_Publication_Gates_2026-10-08/assembled_authored_74/services__design-engineering__implementation-qa.md
---

*Design Engineering · Implementation QA*

# Design QA services that check your build against the design before release

Your engineers get one sorted fix list from our design QA, and each fix is retested before customers see the release.

*Selected work: [Dealpath](/case-studies/enterprise-workflow-redesign-dealpath-real-estate) · [GT Tools](/case-studies/gt-tools-shopify-product-discovery) · [The Chain Hut](/case-studies/ux-ui-design-and-development-for-magento-of-a-silver-chain-store)*

[Book a call](#enquiry)

**Founded 2017 · More than 90 projects · Clients in 19 countries · Studio in Ahmedabad, India**

## What you get from design QA {#what-you-get}

A check of the working product against the agreed design, starting with the tasks where a miss would cost your users most.

- **The build checked screen by screen.** A Figma vs build comparison of layout and components, including your design system. Then the loading, empty, error and disabled states, each user role, and small or resized windows. Then keyboard use, focus order and screen-reader labels, and real content: long names, missing data, large numbers.

- **Every difference sorted.** Each one typed as a defect, a justified change, a missing state or an open question, with a named owner.

- **A fix list engineers can act on.** Each finding states what was expected, what happened, how to reproduce it, why it matters to users, and who owns it.

- **Retests until it closes.** Each fix is checked in the build, and anything still failing goes back to its owner with the new result.

- **Fixes, if you want them.** Our design engineers can correct interface issues in your code, or hand every finding to your team.

**Who does the work.** Design engineers who know why the design is the way it is, so a finding explains the reason as well as the bug. An account lead plans the order of checks around your release date.

**What we need from you.** The agreed designs and rules for this release, a test environment, the release date, the areas you are least sure about, and someone who can make product decisions on open questions.

**Where our part stops.** You choose who fixes what, and product decisions on open questions stay with your product owner. When the same mismatches return release after release, the [Design-to-Code Audit](/audits/design-to-code-audit) looks at why.

## Selected design QA work {#selected-work}

The nearest work is projects where we compared a design with what a build or a platform would allow. No case study yet covers a QA pass on its own, and our UI and UX troubleshooting for Knovos, an AI software firm, has no case page.

### Dealpath: an audit that found the one step to change

Our audit of Dealpath's listing workflow traced the trouble to one assumption: that every listing should become a new deal. The redesign changed that step, Add to pipeline, and Dealpath's team owned implementation, with us answering the product questions it raised. [Read the Dealpath case](/case-studies/enterprise-workflow-redesign-dealpath-real-estate)

### GT Tools: our own design, carried through our own build

We designed GT Tools' Shopify store and then developed it, with custom work wherever the design needed more than the platform gives by default. Price and add-to-cart stay in view on long product pages, as designed. [Read the GT Tools case](/case-studies/gt-tools-shopify-product-discovery)

### The Chain Hut: what the platform sets, and what design can change

We mapped shopper journeys against Magento's default workflow before building The Chain Hut's store. Magento's core purchase flow stayed intact, with clearer navigation and search and a simpler checkout around it. [Read The Chain Hut case](/case-studies/ux-ui-design-and-development-for-magento-of-a-silver-chain-store)

## Our design QA process: findings engineers can act on {#finding}

Screenshot tools are good at spotting change and poor at judging it. A long list of pixel differences tells nobody which ones users will notice, so each difference gets a type and a next step.

| Type | What it means | What happens next |
|---|---|---|
| Defect | Something agreed was lost in the build | Engineering fixes it |
| Justified change | The build changed for a good reason | The design is updated to match |
| Missing state | Nobody designed this case | Design it, then build it |
| Open question | The build exposed a product question | Your product owner decides |

If a shared component is wrong across the whole product, the finding says so and names who owns the fix. Our article explains [why interface regressions cost confidence before any metric shows it](/insights/silent-ui-regression-debt-erodes-adoption-before-it-shows).

*Illustration, not client work*

One entry from a fix list for a SaaS product's account settings release.

| Field | Entry |
|---|---|
| Expected | A missing required field shows an error next to that field |
| Actual | A general banner appears at the top of the form, and the field is unmarked |
| To reproduce | Leave "Company name" empty and select Save on a narrow screen |
| Why it matters | On a phone, the banner scrolls out of view and users cannot see which field failed |
| Type and owner | Defect, frontend team |

## Design QA or a design-to-code audit: when each fits {#compare}

| Check | What it covers | Best for |
|---|---|---|
| **Visual QA** | Screenshot comparisons that flag pixel changes between builds | Catching unintended visual change on every commit |
| **Design QA** | The build against the agreed design: states, behaviour, roles, keyboard use and real content | One release or product area before it goes out |
| **[Design-to-Code Audit](/audits/design-to-code-audit)** | Where your process changes the design on its way into the build | Mismatches that keep coming back across releases |
| **[Usability testing](/services/product-design/prototyping-usability-testing)** | Whether people can complete their tasks | Questions about whether the design itself works |

## What clients say {#testimonials}

> “Tcules told us what was really wrong, including the things we didn't want to hear, and then fixed them with us.”  
> **Akshay Vyas, Creative Head, Knovos**

> “Tcules started by asking our families and carers what got in their way, turned it into a clear product plan, then redesigned our web platform and both apps. Their developers built the frontend from those designs, so nothing got lost in the handover.”  
> **Jody O'Neill, CEO & Co-founder, CuramCare**

> “Our developers enjoyed working on the platform with the right UI/UX specs.”  
> **Samy Melaine, Founder & CPTO, Eden AI**

**4.8 on Clutch.** [Read the reviews](https://clutch.co/profile/tcules-saas-product-design-studio)

## Three ways to work with us {#how-we-work-together}

**Pilot project.** Try us on one real problem

- One flow, one feature or an audit
- Fixed price, agreed up front
- The work is yours, whatever you decide

[Start with a pilot](#enquiry)

**Defined project.** One goal, one scope, one price

- A first release, a redesign or a design system
- Scope and price fixed before we start
- Designers and engineers work on it together

[Get your project scoped](#enquiry)

**Ongoing partnership.** A design team without the hiring

- A senior designer leads your product
- Specialists join when the work needs them
- Month to month, two weeks' notice

[Get your design team](#enquiry)

Not sure which suits you? Tell us about the product, and we'll suggest one.

[Book a call](#enquiry) · [See how we work →](/how-we-work)

## Why founders and product teams choose Tcules {#why-tcules}

- **Fluent in SaaS.** Roles, permissions and data-heavy screens need no explaining to us.

- **Idea to launch.** Bring an idea or your own prototype. Designers lead it through to launch.

- **Craft people notice.** Your product stands out from lookalike software and feels effortless to use.

- **Evidence before screens.** We test your assumptions with real users before they become expensive mistakes.

- **Seen your problem before.** Senior designers who've solved problems like yours lead your product and do the work.

- **Start small.** An optional fixed-price pilot lets you try us first, and ongoing work has no minimum term.

[See why teams choose Tcules →](/why-tcules)

## Industries we know well {#industries}

[B2B SaaS](/expertise/b2b-saas-workflow-software) · [PropTech and ConTech](/expertise/proptech-contech-field-operations) · [AI products](/expertise/ai-products-developer-tools) · [Content platforms](/expertise/content-knowledge-discovery-platforms) · [Commerce](/expertise/commerce-transactional-products) · [HealthTech](/expertise/healthtech) · [See all industries →](/expertise)

## Questions about design QA {#faq}

### What is design QA, and who is it for?

Design QA checks a built product against its agreed design before customers see it, covering behaviour and states as well as looks. It suits product teams with a release coming, and anyone tired of finding design bugs after launch.

### What should a design QA checklist include?

Every state of each screen as well as its look: empty, loading, error, long content, each user role and keyboard use. Each finding records where the build differs, why it matters to users and who owns the fix.

### Is implementation QA the same as visual QA?

Visual checks are one part of Tcules' implementation QA. We also check states, behaviour, keyboard use, user roles and real content, which is where users tend to run into trouble. Tools flag the visual changes on every release, and our design engineers sort what they find.

### Do you check that fixes worked?

Yes. Tcules retests each finding after the fix and closes it once the product behaves as agreed. Anything that still fails goes back to its owner with the new result.

## Show us the build before your customers see it {#enquiry}

Send the product area, the agreed designs and the screens you're least sure about.

**Enquiry form**

- Email
- What are you working on?
- Product or company URL (optional)

**Submit:** Request a call

**After sending:** We'll reply within one business day to arrange the call.
