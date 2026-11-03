---
route: /glossary/human-in-the-loop
slug: human-in-the-loop
page_name: Human in the Loop
page_type: defined_term
seo:
  title: 'What is human in the loop? Meaning and AI examples | Tcules'
  description: 'What is human in the loop? A person reviews, corrects or stops AI output before it takes effect. Meaning, examples and how it differs from human on the loop.'
  canonical: https://www.tcules.com/glossary/human-in-the-loop
  robots: index,follow
social:
  og_title: 'What is human in the loop? Meaning and AI examples | Tcules'
  og_description: 'What is human in the loop? A person reviews, corrects or stops AI output before it takes effect. Meaning, examples and how it differs from human on the loop.'
  og_image: https://www.tcules.com/assets/og/glossary.png
  og_image_alt: Tcules social card headed Glossary, on a white background with the Tcules wordmark.
  og_type: website
  og_url: https://www.tcules.com/glossary/human-in-the-loop
  og_site_name: Tcules
  og_locale: en_GB
  twitter_card: summary_large_image
  twitter_title: 'What is human in the loop? Meaning and AI examples | Tcules'
  twitter_description: 'What is human in the loop? A person reviews, corrects or stops AI output before it takes effect. Meaning, examples and how it differs from human on the loop.'
  twitter_image: https://www.tcules.com/assets/og/glossary.png
search_context:
  primary_query: 'what is human in the loop'
  secondary_queries:
  - 'what is human in the loop AI'
  - 'human in the loop examples'
  - 'HITL meaning'
  - 'human in the loop vs human on the loop'
  primary_intent: what is human in the loop
  primary_buyer_question: What does human in the loop mean in an AI product?
  key_entities:
  - Human in the Loop
  buyer_question_evidence:
    status: PHRASE_MAP_V2_23_OCT
navigation:
  breadcrumb:
  - name: Home
    url: /
  - name: Glossary
    url: /glossary
  - name: Human in the Loop
    url: /glossary/human-in-the-loop
render:
  band_order:
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
      comparison: facts
      next: argument_thesis
      faq: faq
  media_bindings: []
  commercial_system:
    testimonial_ids: []
    version: commercial-v11
    composition_rule: semantic_jobs_and_evidence_not_fixed_counts
  cms_contract:
    version: semantic-v11
---

*Glossary · Human in the Loop*

# What is human in the loop? Meaning and examples in AI products

Human in the loop means a person takes part in an AI system's work, usually by reviewing its output, with the power to correct or stop it. It counts only if the reviewer has the information, authority and time to change the result before it takes effect.

Otherwise the loop is decoration. The phrase, often shortened to HITL, needs testing whenever it appears in a plan.

A confirmation button gives little real oversight if the action has already happened, or if the reviewer cannot see what the result rests on. An engineer reviewing an AI quality-control result needs the source drawing and a clear sign when an input is missing. They also need permission to override or escalate before approving.

Place review where the consequence is highest, the AI is least sure or the action is hardest to undo. [Agentic UX](/glossary/agentic-ux) adds what to design when the AI plans and acts across several steps.

Explore [Human-in-the-Loop Workflows](/services/ai-product-ux/human-in-the-loop-workflows).

## A human in the loop example: AI checks on engineering drawings {#practice}

Human-in-the-loop design matters when a person must still use judgement before AI output becomes a consequential action. In [BuildTwin](/case-studies/ai-quality-control-expert-review-buildtwin), Tcules designed the AI quality-control experience around expert review, the supporting information and the power to override.

BuildTwin's AI checks structural-engineering drawings, and a quality engineer still signs off each one. The redesign let the engineer trace each check to the drawing it came from and see what input was absent. Overruling a check required a reason, which was kept with the record.

The reviewer needs enough information, authority and time to change the outcome. An approval step that makes disagreement hard, or hides what the reviewer needs to judge, is approval in name only.

## Human in the loop vs human on the loop {#comparison}

Human on the loop is a real design choice: the system acts and a person supervises. Approval after the fact is the pattern to watch for, because it looks like oversight without giving the person a way to change the result.

| Human in the loop | Human on the loop | Approval after the fact |
|---|---|---|
| A person can inspect the basis and change the result before it is final | The system acts on its own while a person watches and can pause or step in | A person sees the result after the system has effectively decided |
| The reviewer has defined authority and ways to recover | The supervisor has authority to stop, roll back or take over | Override may be unclear, costly or unavailable |
| Workload and exception routing are part of the design | Monitoring views, alerts and limits are part of the design | Review is a single button |
| Suits actions that are costly or hard to undo | Suits high-volume, low-risk actions where reviewing each one would stall the work | Rarely suits a consequential action |

## Human in the loop questions, answered {#faq}

### What is human in the loop AI?

Human in the loop AI is an AI system designed so a person reviews, corrects or approves its output before that output takes effect. The AI does the first pass, such as checking a drawing or drafting a reply. A person with the right authority then makes the decision, with what they need to judge it in view.

### What are examples of human-in-the-loop systems?

A quality engineer approving AI checks on structural drawings is one. Others include a support agent editing an AI-drafted reply before it goes out, and an analyst confirming flagged payments before an account is frozen. In each case the person can see why the AI suggested something and can overrule it.

### What does HITL mean?

HITL is short for human in the loop. It describes any automated or AI workflow where a person takes part before a result becomes final, usually by reviewing, correcting or approving it. The abbreviation is common in AI research and in product teams' planning documents.

## Related terms, and help designing review steps {#next}

Human review is useful when it carries a real choice, with the information and authority to change the result. As agents take on longer runs of work, review is moving from approving each output to supervising the run: setting limits beforehand, following progress and stepping in where a step matters. [Agentic UX](/glossary/agentic-ux) covers AI that plans and acts across several steps, where on-the-loop supervision is common. [AI Product UX](/glossary/ai-product-ux) is the wider practice of designing how AI behaves inside a product.

Tcules designs review steps, overrides and recovery through Human-in-the-Loop Workflows and [Trust, Control and Recovery](/services/ai-product-ux/trust-control-recovery).

[See Human-in-the-Loop Workflows →](/services/ai-product-ux/human-in-the-loop-workflows)
