---
route: /tools/ai-product-ux-readiness-check
slug: ai-product-ux-readiness-check
page_name: AI Product UX Readiness Check
page_type: tool
seo:
  title: 'AI Feature Readiness Checklist: Free Worksheet | Tcules'
  description: 'A free AI feature readiness checklist for one use case: what the AI may do, what users can see and check, and how mistakes get put right.'
  canonical: https://www.tcules.com/tools/ai-product-ux-readiness-check
  robots: index,follow
social:
  og_title: 'AI Feature Readiness Checklist: Free Worksheet | Tcules'
  og_description: 'A free AI feature readiness checklist for one use case: what the AI may do, what users can see and check, and how mistakes get put right.'
  og_image: https://www.tcules.com/assets/og/tools.png
  og_image_alt: Tcules social card headed Tools, on a white background with the Tcules wordmark.
  og_type: website
  og_url: https://www.tcules.com/tools/ai-product-ux-readiness-check
  og_site_name: Tcules
  og_locale: en_GB
  twitter_card: summary_large_image
  twitter_title: 'AI Feature Readiness Checklist: Free Worksheet | Tcules'
  twitter_description: 'A free AI feature readiness checklist for one use case: what the AI may do, what users can see and check, and how mistakes get put right.'
  twitter_image: https://www.tcules.com/assets/og/tools.png
search_context:
  primary_intent: check whether an AI feature is ready to build
  primary_buyer_question: Which product decisions and interaction tests remain open for this AI use case?
  supporting_questions:
  - What evidence should I record?
  - How should I interpret an unknown or a gap?
  - What can I take into the next team review?
  key_entities:
  - AI product UX
  - human oversight
  - AI failure and recovery
  - evaluation
  - AI feature design
  answer_unit_strategy: utility decision; worked interpretation; limitations; related practice
  buyer_question_evidence:
    source_registry: _system/buyer-question-coverage-v7.yaml
    editorial_method: manual_readthrough_in_v7
    questions_retained_or_exposed:
    - What evidence should I record?
    - How should I interpret an unknown or a gap?
    - What can I take into the next team review?
    questions_withheld: []
  primary_query: AI feature readiness checklist
  secondary_queries:
  - AI product readiness checklist
  - AI feature launch checklist
  - AI use case worksheet
  - AI feature risk assessment
  - AI product UX checklist
  - is our AI feature ready to build
  - what the AI may do
  - what users can see and check
  - how AI mistakes get put right
navigation:
  breadcrumb:
  - name: Home
    url: /
  - name: Tools
    url: /tools
  - name: AI Product UX Readiness Check
    url: /tools/ai-product-ux-readiness-check
render:
  band_order:
  - who-its-for
  - how-to-use-it
  - workspace
  - example
  - marking
  - specialists
  - next
  - faq
page_composition:
  visual_plan: tool_record_and_worked_example
  tool:
    id: ai-product-ux-readiness-check
    mount_anchor: workspace
    mode: manual_evidence_record
    processing: browser_only
    persistence: none
    export: markdown
    method_version: '2026-09-08'
  cms_contract:
    version: semantic-v11
  editorial_review:
    section_components:
      who-its-for: buyer_situation
      how-to-use-it: method_process
      workspace: argument_thesis
      example: argument_thesis
      marking: argument_thesis
      specialists: argument_thesis
      next: argument_thesis
      faq: faq
  media_bindings: []
  commercial_system:
    testimonial_ids: []
    version: commercial-v11
    composition_rule: semantic_jobs_and_evidence_not_fixed_counts
  visual_requirements:
  - id: v11_tool_interface
    status: ASSET_REQUIRED
    supports_section: workspace
    communication_job: Show the actual tool or a representative interactive state.
    asset_uri: null
    alt_caption_intent: Describe what the artefact demonstrates, not merely what it looks like.
    mobile_treatment: Preserve the decision-relevant detail; use a crop or progressive reveal instead of shrinking dense artefacts below readable size.
structured_data:
  types:
  - WebPage
  - BreadcrumbList
  - FAQPage
  organization_ref: https://www.tcules.com/#organization
  page_creator_ref: https://www.tcules.com/#organization
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
  feature_dependencies:
  - TOOL_PRODUCTION_ACCEPTANCE
  legal_dependencies: []
migration:
  redirects_from: []
content_governance:
  master_contract: Tcules Website V11, Editorial Embodiment & Visual Proof Pass
  repair_pass: V10.1_AUDIT_REPAIR
  editorial_pass: V11_EDITORIAL_EMBODIMENT_VISUAL_PROOF
  pre_review_repair: V11.1_PRE_REVIEW_REPAIR
  language: en-GB
---

*Free tool · AI features*

# AI feature readiness checklist: agree what the AI may do before launch

A free checklist for one AI feature: what it may do, what users can check, how mistakes get fixed. You end with a clear list of what stops your team explaining, checking and correcting what the feature does.

An AI feature that drafts a reply and one that sends it are different products to the person who answers for that customer.

Bring someone who knows the task well and someone who can say what the feature does. You leave with the open questions and the tests to take to your next product review.

[Use the checklist](#workspace)

## Who the AI feature readiness checklist suits {#who-its-for}

It suits a product team adding AI to software people already rely on: a product manager, a designer and an engineer, joined by someone who knows the task well. Run it before the build, while answers are still cheap to change, or before launch, to see what is still open.

One record covers one use case. A product with several AI features gets a record for each, starting with the feature whose mistakes would reach a customer first. Once the feature is live or in beta, testing it on real tasks shows more than a worksheet can.

AI features are moving from drafting to acting: agents that update records, send messages and chain steps across tools. Each step up in authority adds weight to the Authority and Recovery areas below, so run the check again whenever the feature is given more to do.

## How to use the AI feature readiness checklist {#how-to-use-it}

1. **Choose one use case.** Pick the one where a wrong output would cost the most, such as a reply that reaches a customer or a change to an account. One use case per record keeps every question answerable.

2. **Work down the six areas.** Fill in the table below with what you know and what you could show. Leave a gap blank where nobody knows yet.

3. **Mark every check.** Use the four marks set out further down, and keep each unknown open with a note of what would close it.

4. **Test the gap that worries you most.** Run the example built to fail, such as an out-of-date record, and watch whether a person catches it.

5. **Download the record and hand out the questions.** Give each open question one owner, then bring the list to the meeting where launch gets agreed.

## Six areas to answer for one AI feature {#workspace}

Start by naming the user, the task and the change the AI is meant to make. Write down how the person does that work today. Then go through each area.

| Area | Questions to answer | What to bring |
|---|---|---|
| Purpose | What gets better for the user? What would make the AI version worse than their current way of working? | A real task and a plan to compare the two |
| Authority | Does the AI suggest, prepare or act? Which actions need approval? Who answers for the result? | The rules for each role and the real confirmation step |
| Basis | What data is the output built on? What happens when sources are missing, out of date or contradict each other? | Typical inputs, and how the product shows its sources |
| Failure | Which wrong result would matter most? How would anyone spot it and stop it spreading? | An example built to fail, or one that could go either way |
| Recovery | What can be corrected? What can't be undone? Who deals with the knock-on changes? | A recovery path you have tried, and the person responsible for it |
| After release | What will you watch? When should the feature be limited or switched off? | Test cases, who monitors them and the point at which you would act |

Write each open question on its own line. Then the permission rule can go to one owner and the recovery test to another.

## AI feature risk assessment: an assistant using an out-of-date record {#example}

*Illustration, not client work.* A support assistant drafts a reply from a customer's account record. The record may be out of date, and the screen gives no sign of when it was last refreshed.

That is a case nobody has tested: the assistant working from out-of-date information. The test is to give the assistant an old record and watch whether the reviewer spots the mistake and fixes it before sending. The product question is what the assistant should do when it can't tell how fresh its data is.

## Mark each check and keep unknowns open until someone answers them {#marking}

Give each check one of four marks: "evidence available", "decision only", "open" or "not applicable". A written decision still needs a test to show the interaction works, so "decision only" stays on your list.

Leave an unknown open until someone can answer it, and note what would close it: the evidence, the owner or the product decision it is waiting for.

Then choose where to start. Resolve open questions about authority and recovery before the AI can take actions that change things. Purpose questions need a task comparison, missing sources need typical inputs to test with, and a decision without a test joins the queue for evaluation.

## What the checklist covers, and what goes to specialists {#specialists}

The questions draw on [Microsoft's human-AI interaction guidelines](https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/) and on the measurement and responsibility concerns in the [NIST AI RMF playbook](https://airc.nist.gov/airmf-resources/playbook/).

This check owns the interaction around the model: the part users see and answer for. Model performance, security, privacy and regulatory compliance run their own reviews, and what they find can change what the feature may do. The launch decision brings both together, so take your finished record into that product review.

## After the checklist: test the live feature or get design help {#next}

For the output that could do the most harm, the [AI Trust and Control Canvas](/tools/ai-trust-control-canvas) sets out what people can check, approve and undo.

If the feature is live or in beta, the [AI UX Audit](/audits/ai-product-ux-readiness) tests it on real tasks and gives you a ranked list of what to fix first. For help answering the questions in your own product, talk to us about [AI Product UX](/services/ai-product-ux).

## AI feature readiness checklist FAQs {#faq}

### Is there a checklist for whether an AI feature is ready to build?

This page is one: the AI Product UX Readiness Check takes a single AI use case through six areas, from purpose to life after release. It records what is agreed, what is open and what still needs a test. It is free, needs no sign-up and ends in a record you can download.

### What should we decide before shipping an AI feature?

Start with whether the AI suggests, prepares or acts, and what users can see and check before relying on it. Then work out how a mistake gets put right, including anything that can't be undone. Last, agree what you will watch after release, and the point at which you would limit or switch off the feature.

### How do we assess the risk of an AI use case?

Start from the wrong result that would matter most, then ask how anyone would spot it and stop it spreading. Risk rises as the AI moves from suggesting to acting, so check who approves each action and what can be reversed. For the riskiest output, the [AI Trust and Control Canvas](/tools/ai-trust-control-canvas) plans its controls.

### What evidence should we record for an AI feature review?

Use the "What to bring" column: a real task to compare against, the rules for each role and typical inputs. Add an example built to fail, a recovery path you have tried, and test cases with someone watching them. Mark a check "evidence available" only once someone has seen it work.

### Who checks model accuracy, security and compliance?

Your specialists do. This checklist covers how people work with the feature, so accuracy, security, privacy and the law each get a separate review. Their findings can narrow what the feature is allowed to do, so bring them in before anyone agrees the launch.
