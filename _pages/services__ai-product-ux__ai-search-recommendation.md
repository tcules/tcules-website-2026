---
route: /services/ai-product-ux/ai-search-recommendation
slug: ai-search-recommendation
page_name: AI Search & Recommendation
page_type: service
seo:
  title: 'AI Search UX Design for Answers and Recommendations | Tcules'
  description: 'AI search UX design for SaaS and knowledge products: answers with visible sources, explained recommendations and results people can check and act on.'
  canonical: https://www.tcules.com/services/ai-product-ux/ai-search-recommendation
  robots: index,follow
social:
  og_title: 'AI Search UX Design for Answers and Recommendations | Tcules'
  og_description: 'AI search UX design for SaaS and knowledge products: answers with visible sources, explained recommendations and results people can check and act on.'
  og_image: IMAGE_ASSET_REQUIRED
  og_image_alt: IMAGE_ASSET_REQUIRED
  og_type: website
  og_url: https://www.tcules.com/services/ai-product-ux/ai-search-recommendation
  og_site_name: Tcules
  og_locale: en_GB
  twitter_card: summary_large_image
  twitter_title: 'AI Search UX Design for Answers and Recommendations | Tcules'
  twitter_description: 'AI search UX design for SaaS and knowledge products: answers with visible sources, explained recommendations and results people can check and act on.'
  twitter_image: IMAGE_ASSET_REQUIRED
search_context:
  primary_intent: AI search and recommendation UX design
  primary_buyer_question: How should users express intent, judge what the system surfaced and act without confusing retrieval, ranking and generation?
  supporting_questions:
  - How is AI search different from ordinary search?
  - Should AI search always give a generated answer?
  - How should a recommendation explain itself?
  primary_query: AI search UX design
  secondary_queries:
  - AI search UX
  - AI search vs ordinary search
  - AI answers with sources
  - recommendation UX design
  - RAG UX design
  - explain a recommendation
  - should AI search always generate an answer
  - search results users can check
navigation:
  breadcrumb:
  - name: Home
    url: /
  - name: Services
    url: /services
  - name: AI Product UX
    url: /services/ai-product-ux
  - name: AI Search & Recommendation
    url: /services/ai-product-ux/ai-search-recommendation
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
  - search-jobs
  - testimonials
  - how-we-work-together
  - why-tcules
  - industries
  - faq
  - enquiry
page_composition:
  visual_plan: intent_sources_retrieval_ranking_recommendation_verification_action
  media_bindings:
  - id: ai_search_eden
    role: demonstrate
    supports_section: selected-work
    asset_uri: https://res.cloudinary.com/dbay1gb0s/image/upload/v1773124788/Eden_AI_2_f04afef6ad.webp
    alt_intent: Eden AI's workflow builder start, with one search box for templates and capabilities, AI-assisted creation as a separate mode, and preview cards for checking a capability before adding it.
    source: current public Tcules case media
    status: BOUND_EXISTING_PUBLIC_ASSET
  - id: ai_search_buildtwin_sources
    role: demonstrate
    supports_section: selected-work
    asset_uri: https://res.cloudinary.com/dbay1gb0s/image/upload/v1785918366/buildtwin_05_continuous_review_60aeb8e46c.gif
    alt_intent: BuildTwin's review feed, where each AI check on a structural drawing shows its drawing reference, source document, observation and conclusion in one reading path.
    source: current public Tcules case media
    status: BOUND_EXISTING_PUBLIC_ASSET
  testimonial_ids:
  - DRAFT-EDEN-PLATFORM
  - DRAFT-PRIMELIS-TEAM
  - DRAFT-CONNECTX-SCENARIOS
  client_recognition:
    component_type: curated_client_recognition
    clients:
    - Eden AI
    - BuildTwin
    - Omny AI
    placement: compact_hero_followup
    label: Selected Tcules client relationships across the practice
    source_note: Only named cases prove this route-specific work; other names establish studio breadth. Logo asset rights need confirmation. Use approved name-only fallback.
  institutional_trust:
    component_type: institutional_fact_row
    facts:
    - founded_2017
    - projects_90plus
    - client_countries_19
    - studio_ahmedabad
    placement: hero
    claim_policy: Verify these institution-level facts at publication. Reuse their sources, not hardcoded display values.
  independent_reputation:
    component_type: linked_review_marker
    source: https://clutch.co/profile/tcules-saas-product-design-studio
    snapshot_date: '2026-10-08'
    rating: 4.8
    displayed_reviews: 13
    placement: testimonials
    publication_gate: REVERIFY_LIVE_RATING_AND_COUNTS
  proof_claim_policy: EDEN_SEARCH_WORKFLOW_PROOF;NO_SEARCH_SUCCESS_METRIC;BUILDTWIN_OMNY_LABELLED_CLOSEST_RELATED
  content_composition:
    primary_intent: AI search UX design
    signature_model_type: search-to-commit-flow
    proof_component: source_bound_named_case_or_explicit_proof_gap
    testimonial_component: verbatim_quote_with_source_scope_in_cms
    form_anchor: enquiry
    mobile_table_policy: stack_as_labelled_rows
  signature_explanatory_object:
    type: search-to-commit-flow
    sequence:
    - Result
    - Why this result
    - Compare alternatives
    - Accept or refine
    - Continue workflow
    label: Editorial explanatory diagram; not a client artefact
    media_rights: Conceptual only; real project visuals require approval
  testimonial_context: CURATED_VERBATIM_CLIENT_VOICE
  source_evidence_boundary: Tcules can design search and recommendation UX; ranking/model quality, source coverage and production retrieval architecture require verified engineering responsibility.
  editorial_proof_review: REVIEW_IF_SOURCE_PROOF_SECTION_ALREADY_HAS_CAVEAT; NEVER_ATTRIBUTE_METRICS_FROM_GENERIC_TESTIMONIAL
  signature_proposition: Users need ways to interpret, reject or amend an AI result before it becomes part of their work.
structured_data:
  types:
  - WebPage
  - Service
  - BreadcrumbList
  - FAQPage
  organization_ref: https://www.tcules.com/#organization
  service_provider_ref: https://www.tcules.com/#organization
release:
  content_state: ROLLOUT_STUDIO_SPINE_2026-10-26
  site_release_state: SITE_RELEASE_HOLD
  composition: STATIC_PREVIEW_REQUIRES_FINAL_VISUAL_DESIGN
  production: NOT_PRODUCTION_VERIFIED
  route_dependencies:
  - FORM_ENDPOINT_VERIFICATION
  - CLAIM_EVIDENCE_VERIFICATION
  - CASE_MEDIA_AND_CLAIM_REVIEW
  - EDEN_SEARCH_WORKFLOW_PROOF;NO_SEARCH_SUCCESS_METRIC
content_governance:
  language: en-GB
  direct_quote_policy: preserve_verbatim_source_checked
  governing_rules: Tcules-VNext-Working-2026-10-08/00_RULEBOOK.md
  source_body: Tcules_Phase10_Canonical_Assembly_and_Publication_Gates_2026-10-08/assembled_authored_74/services__ai-product-ux__ai-search-recommendation.md
---

*AI Product UX · AI search*

# AI search UX design for answers and recommendations users can check

With AI search UX design, every generated answer shows its source and every recommendation its reason. Customers then know which results to act on.

*Selected work: [Eden AI](/case-studies/eden-ai-workflow-builder-search-redesign) · [BuildTwin](/case-studies/ai-quality-control-expert-review-buildtwin) · [Omny AI](/case-studies/omny-ai-suggestion-trust-redesign)*

[Book a call](#enquiry)

**Founded 2017 · More than 90 projects · Clients in 19 countries · Studio in Ahmedabad, India**

## What you get from our AI search UX design {#what-you-get}

The whole path from the search box to the next step in the work, tried on your own content before it is built.

- **The search box.** Exact lookups and plain-language questions in one box, with a one-key switch between them.

- **Results that show their source.** Cards and previews with the source, its date and what it covers.

- **AI answers with sources.** Generated summaries kept visibly apart from the passages behind them, and a plain message when nothing in your content supports an answer.

- **Recommendations that explain themselves.** The reasons behind each pick, what was left out, what happens on accepting it, and preferences people can change.

- **Ways to fix a bad answer.** Exclude a source, fix a name, narrow the search or fall back to the raw results, plus a way to flag a bad answer that your team learns from.

- **Results that open where the work is.** The chosen result carried straight into the screen where the work happens, so nobody copies it across by hand.

- **A test on your own content.** A coded version run against a sample of your documents, showing where answers drift before engineering builds it.

**Who does the work.** Your senior product designer starts from the queries people type today, sorted by the job behind each. A design engineer runs the test on your content, and an account lead handles scheduling.

**What we need from you.** A set of real queries, a sample of your documents, and what people do with a result once they find it.

**Where our part stops.** We design what people see, check and do. Retrieval, ranking and model quality stay with your engineers, or with ours through [AI Product Engineering](/services/software-development/ai-product-engineering).

## Selected AI search UX work {#selected-work}

The nearest work we have is one search redesign, and two AI products where people check what the system found or suggested before it counts.

### Eden AI: search and AI help in one box, as two modes

Eden AI gives developers one platform for hundreds of AI models. We redesigned the start around one search box for templates and capabilities, with AI help as a separate mode. Preview cards and documentation let people inspect a capability before it joins the workflow. [Read the Eden AI case](/case-studies/eden-ai-workflow-builder-search-redesign)

### BuildTwin: every AI result traced to the document behind it

BuildTwin's AI checks structural drawings, and a quality engineer has to trust each result before signing off. In the review design, a check links to its drawing reference, source document, observation and conclusion, and one that could not run names the information it lacked. [Read the BuildTwin case](/case-studies/ai-quality-control-expert-review-buildtwin)

### Omny AI: suggestions that wait beside the work

Omny AI, acquired by Primelis, suggests product benefits and use cases for Amazon listings. We moved its suggestions into a panel beside an empty content area, so a pick reaches the listing only when a person clicks to add it. [Read the Omny AI case](/case-studies/omny-ai-suggestion-trust-redesign)

## AI search vs ordinary search: when each one helps {#search-jobs}

People search for different reasons, and each needs a different kind of result. Sometimes the best AI search keeps the AI out of the way. Eden AI's founder talks through [why to build AI around the user's job](/insights/podcasts/do-ai-not-for-ai-s-sake-but-for-your-user-insights-from-eden-ai-s-ctpo) in our podcast.

| Result | What users see | Best for |
|---|---|---|
| **Exact results** | Fast matches for the words they typed | Finding a known record, file or customer |
| **Generated summary** | A short answer, each statement linked to the passage behind it | Understanding a topic spread across several sources |
| **Side-by-side comparison** | Options with the criteria visible and adjustable | Weighing a handful of options |
| **Recommendation** | One pick, why it was chosen, what was left out and what happens on accepting it | Choosing one and moving on |

The hard cases are mixed lists and missing sources. When exact matches and AI guesses share a list, users cannot tell a record that matched their words from one the system guessed at. When an answer shows no source, nobody knows whether a sentence came from a document or the model.

We keep each apart, and an honest "nothing found" beats a confident guess.

In many products the search box is becoming the front door. A person describes what they need, and the product gathers the records and offers the next step. We design the first release with room for answers, actions and the sources between them, so each new capability has a place to land.

## What clients say {#testimonials}

> “Eden AI gives developers one way into hundreds of AI models, so the product has to be easy to find your way around. Tcules understood that quickly. Our developers had specs they could build from, and our users told us they loved the new design without being asked.”  
> **Samy Melaine, Founder & CPTO, Eden AI**

> “For three years Tcules has designed every one of our products. They work like part of our product team, improving them continuously and helping us shape AI features our customers can check and trust.”  
> **Clément Contamine, CPO, Primelis**

> “Tcules turned our early ideas into eight scenarios, built around the questions our operators, finance leaders and sustainability leads actually ask. Their coded demo let us see each question with its data and the digital twin in one view, before any live integration.”  
> **Pratik Ghoshal, CEO, ConnectX**

**4.8 on Clutch.** [Read the reviews](https://clutch.co/profile/tcules-saas-product-design-studio)

## Three ways to work with us {#how-we-work-together}

**A pilot project.** Optional: one flow, one hard question or an audit, at a fixed price agreed up front.

**A defined project.** A first release, a redesign or a design system, scoped and priced before we start.

**An ongoing partnership.** A senior designer leads, specialists join as the work needs, and you can change the team with two weeks' notice.

You keep the product decisions, and what we make is yours once it's paid for.

We overlap four to five hours with US working days, and extend that whenever the work needs it.

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

[PropTech and ConTech](/expertise/proptech-contech-field-operations) · [ClimateTech](/expertise/climatetech-energy) · [AI products](/expertise/ai-products-developer-tools) · [Content platforms](/expertise/content-knowledge-discovery-platforms) · [MarTech](/expertise/martech-salestech) · [Commerce](/expertise/commerce-transactional-products) · [See all industries →](/expertise)

## Questions about AI search UX design {#faq}

### How is AI search different from ordinary search?

AI search understands a plain-language request, and it can summarise, recommend or answer as well as list matches. So the interface has to show which parts came straight from a source and which the system worked out or wrote.

### How should AI search show where its answer came from?

By linking each statement to the passage that supports it, with the document's title and date in view. Tcules keeps quoted text and the AI's own summary visibly apart, and shows a plain message when nothing in your content supports an answer.

### Should AI search always give a generated answer?

No. Where users need to compare or verify, Tcules recommends a ranked list or a side-by-side comparison, which is quicker to check. A generated answer earns its place when it spares the user from reading several sources.

### How should a recommendation explain itself?

By naming the few criteria that most affected it, in plain words, and letting users adjust the ones they are entitled to change. Long technical explanations slow people down when they are trying to choose.

### Do you design for RAG-based search?

Yes. Retrieval-augmented generation, or RAG, finds passages in your content before the model writes an answer. The design work is showing those passages, saying when they are thin or out of date, and letting people search the sources directly.

### When does conversational search help?

It helps when people refine a loose request over several turns, such as narrowing a set of documents. When people already know what they want, a filter is quicker than a sentence, so Tcules keeps filters and results in view beside the conversation.

## Tell us what your users search for {#enquiry}

Share what the AI returns, or what you want it to return, and what people do with the result.

**Enquiry form**

- Email
- What are you working on?
- Product or company URL (optional)

**Submit:** Request a call

**After sending:** We'll reply within one business day to arrange the call.
