---
route: /glossary/agentic-ux
slug: agentic-ux
page_name: Agentic UX
page_type: defined_term
seo:
  title: 'What is agentic UX? Meaning, examples, principles | Tcules'
  description: 'What is agentic UX? The design of how people hand a goal to an AI that plans and acts, then approve, check and stop it. Examples, principles and FAQs.'
  canonical: https://www.tcules.com/glossary/agentic-ux
  robots: index,follow
social:
  og_title: 'What is agentic UX? Meaning, examples, principles | Tcules'
  og_description: 'What is agentic UX? The design of how people hand a goal to an AI that plans and acts, then approve, check and stop it. Examples, principles and FAQs.'
  og_image: https://www.tcules.com/assets/og/glossary.png
  og_image_alt: Tcules social card headed Glossary, on a white background with the Tcules wordmark.
  og_type: website
  og_url: https://www.tcules.com/glossary/agentic-ux
  og_site_name: Tcules
  og_locale: en_GB
  twitter_card: summary_large_image
  twitter_title: 'What is agentic UX? Meaning, examples, principles | Tcules'
  twitter_description: 'What is agentic UX? The design of how people hand a goal to an AI that plans and acts, then approve, check and stop it. Examples, principles and FAQs.'
  twitter_image: https://www.tcules.com/assets/og/glossary.png
search_context:
  primary_intent: what is agentic ux
  primary_buyer_question: What is agentic UX?
  primary_query: 'what is agentic UX'
  secondary_queries:
  - 'agentic UX meaning'
  - 'agentic UX examples'
  - 'agentic UX vs conversational UX'
  - 'agentic UX design principles'
  - 'what is agentic UX design'
  key_entities:
  - Agentic UX
  buyer_question_evidence:
    status: PHRASE_MAP_V2_23_OCT
navigation:
  breadcrumb:
  - name: Home
    url: /
  - name: Glossary
    url: /glossary
  - name: Agentic UX
    url: /glossary/agentic-ux
  section_labels:
    examples: Examples
    practice: Principles
    comparison: Vs conversational UX
    related-terms: Related terms
    faq: FAQs
    next: How much it does
render:
  band_order:
  - examples
  - practice
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
      examples: definition
      practice: argument_thesis
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

*Glossary · Agentic UX*

# What is agentic UX? Meaning, examples and design principles

Agentic UX is the design of how people give an AI a goal, then approve, check and stop its steps. It matters once an AI feature moves from suggesting a change to making one. The product then needs clear limits on what the AI may do, and a way back when it gets something wrong.

Agentic UX is one part of [AI Product UX](/glossary/ai-product-ux), which covers the wider relationship between people and AI. See how Tcules approaches [AI Copilots and Agents](/services/ai-product-ux/ai-copilots-agents).

## Agentic UX examples: an AI that changes records {#examples}

An AI might prepare updates across several customer records. Agentic UX sets which steps need approval and how the product shows that only some updates went through. It also sets how the operator reverses a wrong one. A [human-in-the-loop review](/glossary/human-in-the-loop) counts only when that operator has the information, time and permission to step in.

ConnectX shows how those limits work in an AI building-energy workspace. A request in plain words is matched to one of eight scenarios agreed in advance, and only permitted tools retrieve the data, so the AI adapts inside product rules. [Read the ConnectX case](/case-studies/ai-native-building-energy-product-connectx).

## Agentic UX design principles: limits, approval and a way back {#practice}

Agentic UX applies once an AI can carry on after a single reply. The team chooses the goal the person hands over, the tools and records the agent may touch, and the actions that need confirmation. It also plans for a task that only partly succeeds.

Those choices shape the interface as much as the model does.

A few principles follow. Show the plan before the agent acts. Ask first where a step is hard to reverse or affects someone else. Report progress in the person's own terms, failed steps included. Keep an undo, or a clear repair route, for every change the agent makes.

A useful review starts with one task. Follow the agent from the person's request through its plan, its actions, what it shows and the route back. The [AI Copilots and Agents service](/services/ai-product-ux/ai-copilots-agents) applies that walk-through to product work.

## Agentic UX vs conversational UX: acting compared with answering {#comparison}

Conversational UX shapes an exchange of messages: what the system says and how the person replies. Agentic UX shapes a run of actions, and the person's control over it.

A basic chatbot returns text. An agent makes a plan, uses other tools, changes records and keeps going after the first step. The product has to show the plan, ask for permission, report progress and offer an undo.

| Interaction | What the system does | What the product must make clear |
|---|---|---|
| Conversational or chatbot reply | Returns information or written content | Where it came from, how sure it is, whether the person can edit it and what to do next |
| Agentic interaction | Plans and carries out several steps across tools or records | The goal it was given, what it may do, progress, approval points, what happens when a step fails and how to undo it |

## Terms related to agentic UX {#related-terms}

[AI Product UX](/glossary/ai-product-ux): the design of how people understand, direct, check and undo what an AI does inside a product.

[Human in the loop](/glossary/human-in-the-loop): a person reviewing an AI's work who has the information, authority and time to stop the result before it takes effect.

[Workflow design](/glossary/workflow-design): how work moves between roles, rules and handoffs. An agent joins that flow as one more participant, so its steps need the same care.

## Agentic UX FAQs {#faq}

### What is agentic UX design?

Agentic UX design shapes how people hand a goal to an AI that plans and acts over several steps. It covers the limits the agent works within, the points where it asks first, how it reports progress and the route back from a wrong change.

### How is agentic UX different from chatbot UX?

Chatbot UX shapes the exchange of replies: where each answer came from, how sure it is and what the person can do with it. Agentic UX shapes a sequence of actions across tools and records. So it adds permissions, progress, approval points and undo, and needs more of each as the AI does more on its own.

### What are examples of agentic UX?

One example is an AI that prepares updates across several customer records, then asks before applying the ones that matter. The [ConnectX case](/case-studies/ai-native-building-energy-product-connectx) shows how those limits work: the AI may only use permitted tools inside eight agreed scenarios. In both, the design sets what the AI may do without asking.

### What principles guide agentic UX design?

Make the plan visible before the agent acts, and ask first where a step is hard to reverse. Report partial failures plainly. Give people an undo, and a say in how much the agent may do over time.

## How much should the agent do on its own? {#next}

We design for an agent that takes whole tasks off a customer's hands, inside limits they set and can change. How much work it carries, and what a person keeps, is the product question underneath the definition.

That balance will keep moving. As models plan better, products will hand agents whole jobs, and the design work shifts from approving each step to setting limits, following the run and repairing what went wrong.

[See AI Copilots and Agents →](/services/ai-product-ux/ai-copilots-agents)
