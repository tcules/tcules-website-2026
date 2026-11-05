---
route: /tools/ai-trust-control-canvas
slug: ai-trust-control-canvas
page_name: AI Trust and Control Canvas
page_type: tool
seo:
  title: 'AI Trust and Control Canvas: Free Template | Tcules'
  description: 'A free AI trust and control canvas: plan what people can check, approve and undo around one AI output, then download a control brief for your team.'
  canonical: https://www.tcules.com/tools/ai-trust-control-canvas
  robots: index,follow
social:
  og_title: 'AI Trust and Control Canvas: Free Template | Tcules'
  og_description: 'A free AI trust and control canvas: plan what people can check, approve and undo around one AI output, then download a control brief for your team.'
  og_image: https://www.tcules.com/assets/og/tools.png
  og_image_alt: Tcules social card headed Tools, on a white background with the Tcules wordmark.
  og_type: website
  og_url: https://www.tcules.com/tools/ai-trust-control-canvas
  og_site_name: Tcules
  og_locale: en_GB
  twitter_card: summary_large_image
  twitter_title: 'AI Trust and Control Canvas: Free Template | Tcules'
  twitter_description: 'A free AI trust and control canvas: plan what people can check, approve and undo around one AI output, then download a control brief for your team.'
  twitter_image: https://www.tcules.com/assets/og/tools.png
search_context:
  primary_intent: design trust and control for an AI output
  primary_buyer_question: What must a person inspect and control before this AI output changes something?
  supporting_questions:
  - What evidence should I record?
  - How should I interpret an unknown or a gap?
  - What can I take into the next team review?
  key_entities:
  - AI trust
  - calibrated trust
  - override
  - recovery
  - evidence
  answer_unit_strategy: utility decision; worked interpretation; limitations; related practice
  buyer_question_evidence:
    source_registry: _system/buyer-question-coverage-v7.yaml
    editorial_method: manual_readthrough_in_v7
    questions_retained_or_exposed:
    - What evidence should I record?
    - How should I interpret an unknown or a gap?
    - What can I take into the next team review?
    questions_withheld: []
  primary_query: AI trust and control canvas
  secondary_queries:
  - AI trust canvas
  - what users must check before AI acts
  - AI output control template
  - AI trust framework for product teams
  - AI governance canvas for features
  - design brief for AI controls
  - AI approval and undo checklist
  - AI control brief template
  - free AI trust template
navigation:
  breadcrumb:
  - name: Home
    url: /
  - name: Tools
    url: /tools
  - name: AI Trust and Control Canvas
    url: /tools/ai-trust-control-canvas
  section_labels:
    example: Worked example
    who-its-for: Who it suits
    start: How to use it
    workspace: Seven parts
    reading-your-canvas: Reading the canvas
    test: Testing the controls
    next: Design brief
    faq: FAQs
render:
  band_order:
  - example
  - who-its-for
  - start
  - workspace
  - reading-your-canvas
  - test
  - next
  - faq
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
page_composition:
  visual_plan: tool_record_and_worked_example
  tool:
    id: ai-trust-control-canvas
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
      example: argument_thesis
      who-its-for: buyer_situation
      start: method_process
      workspace: argument_thesis
      reading-your-canvas: argument_thesis
      test: argument_thesis
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
content_governance:
  master_contract: Tcules Website V11, Editorial Embodiment & Visual Proof Pass
  repair_pass: V10.1_AUDIT_REPAIR
  editorial_pass: V11_EDITORIAL_EMBODIMENT_VISUAL_PROOF
  pre_review_repair: V11.1_PRE_REVIEW_REPAIR
  language: en-GB
---

*Free tool · AI controls*

# AI trust and control canvas: plan what people check, approve and undo

The AI Trust and Control Canvas is a free template that maps what a person must be able to inspect, approve, change or recover before an AI output turns into an action. A suggested paragraph, a changed account record and a sent customer message each need different controls.

The canvas starts from what can happen once someone accepts the output. The result is a control brief your designer and engineer can work through together.

[Use the canvas](#workspace)

## Worked example: an AI-drafted notice to a customer {#example}

*Illustration, not client work.* An assistant drafts a notice about a change to a customer's account. Before it goes, the reviewer sees the recipient, the proposed change and the account record behind it, and can edit or reject the draft.

After it goes, recovery means correcting the account where needed and sending the recipient a correction. Deleting the message from the sender's screen leaves its effect in place. The canvas names that limit, and the person responsible for the correction.

## An AI trust framework for product teams, one feature at a time {#who-its-for}

The canvas suits a product manager, a designer and an engineer working on a feature where AI output becomes an action: a message sent, a record changed, a request approved. Bring the person who would answer for a wrong result, too.

Teams that report to a risk or governance group can use the finished canvas as an AI governance canvas for features, showing where a person can still step in.

Agents raise the stakes. One run can chain several actions across tools, each with its own point of no return. The canvas takes them one at a time: give each point where a draft becomes an action its own canvas, and together they become the control plan for the whole run.

The canvas works best once the use case is clear. If you are still working out whether the feature is ready at all, start with the [AI Product UX Readiness Check](/tools/ai-product-ux-readiness-check).

## How to use the AI trust canvas on one output {#start}

Name the output exactly as the user meets it. Then follow the action it can trigger: what changes, who is affected and which consequences can still be put right.

"Human approval" works only when the reviewer has the information, the time and the authority to say no. Record what that person can see and do.

Where a control is still unclear, write down what is missing: the information to check, the authority to act, a way to reverse it, a route for escalation or how it will be built. Then name who will decide it, and what must be true before the output goes any further.

From there, the canvas runs in three steps:

1. **Fill in the seven parts.** Work down the canvas below, from the consequence to the review record, and write "unclear" wherever a control is still open.

2. **Read the pattern.** The table under the canvas shows which control to work out first.

3. **Try it with a wrong answer.** Run the plan with a plausible wrong output, then download the brief and give each open control an owner.

## Seven parts of the canvas to fill in {#workspace}

| Part of the interaction | What to set out |
|---|---|
| Output and consequence | The proposal, the action it leads to, who or what it affects, and whether it can be reversed |
| Evidence | Sources the user can inspect, how fresh they are, and anything relevant that is missing |
| Uncertainty | Known limits or conflicting information the interface shows the user |
| Authority | Who may accept, edit, reject, do the job by hand or escalate |
| Commitment | The exact point where a draft becomes an action, and what must be confirmed there |
| Recovery | How a mistake is spotted, corrected and reported, and what happens to actions that depend on it |
| Review record | What to keep so the action can be pieced together later, and who may see it |

Show sources people can open, and state the limits plainly. An AI-written explanation can sound convincing about a wrong answer. Show a confidence measure only once you know what it means for this task and that it helps people judge.

## Read the finished canvas to see which control comes first {#reading-your-canvas}

| If the canvas shows | Decide this next |
|---|---|
| An action with real consequences and no working review or way back | Who has authority, and how a mistake is contained, before the action is switched on |
| An approval step with nothing useful to review | Whether the reviewer can spot a typical wrong proposal |
| A harmless, editable draft behind heavy confirmation | Whether lighter controls keep what matters |
| A correction that leaves linked records wrong | How the correction reaches linked records and who is told, including anything that can't be reversed |

## Test the AI controls with a plausible wrong answer {#test}

Run the interaction with a plausible wrong output, missing information and a reviewer who disagrees. Watch whether the person can find and use the controls in time.

The canvas draws on [Microsoft's human-AI interaction guidelines](https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/). It gives the specialists who judge model accuracy, legal requirements and acceptable risk a precise picture of where people can step in.

## Turn the canvas into a design brief for AI controls {#next}

Download the canvas and turn each open control into a check the finished feature must pass. The [BuildTwin case](/case-studies/ai-quality-control-expert-review-buildtwin) shows our design work around expert review of AI-generated analysis.

To have a live or beta AI feature tested on real tasks, see the [AI UX Audit](/audits/ai-product-ux-readiness). For help designing the controls themselves, see [Trust, Control & Recovery](/services/ai-product-ux/trust-control-recovery).

## AI trust and control canvas FAQs {#faq}

### Is there a template for deciding what users can check and undo around AI output?

This canvas is one. It follows a single AI output to the action it can trigger, then records what people can inspect, approve, change or recover along the way. It is free, and you download the result as a control brief.

### How do we plan controls around one AI output?

Start from what happens once someone accepts the output. Then work through the seven parts: consequence, evidence, uncertainty, authority, commitment, recovery and the review record. Finish by running the plan with a plausible wrong answer and a reviewer who disagrees.

### What should a brief for AI controls include?

For each control, the brief names what the reviewer can see, who may accept or reject, where a draft becomes an action and how a mistake gets corrected. Each open control gets an owner and a check the finished feature must pass, so the brief stays useful through the build.

### Is there a free AI trust framework for product teams?

The canvas works as one, applied a feature at a time. It draws on Microsoft's human-AI interaction guidelines and turns them into questions about one output in your product, ready to sit beside your organisation's AI policy.

### When is a confidence score worth showing to users?

Show one only when you know what it means for this task and that it helps people judge. Sources people can open give a reviewer something to check; an explanation written by AI can sound sure of a wrong answer. [Why AI earns trust when the review step hands control back to people](/insights/confidence-scores-dont-fix-trust-when-review-step-never) goes further.
