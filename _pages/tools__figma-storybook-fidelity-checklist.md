---
route: /tools/figma-storybook-fidelity-checklist
slug: figma-storybook-fidelity-checklist
page_name: Figma to Storybook Fidelity Checklist
page_type: tool
seo:
  title: 'Figma to Storybook Checklist: Free Component QA | Tcules'
  description: 'A free Figma to Storybook checklist: test one component across states, keyboard use and screen readers, then download corrections anyone can repeat.'
  canonical: https://www.tcules.com/tools/figma-storybook-fidelity-checklist
  robots: index,follow
social:
  og_title: 'Figma to Storybook Checklist: Free Component QA | Tcules'
  og_description: 'A free Figma to Storybook checklist: test one component across states, keyboard use and screen readers, then download corrections anyone can repeat.'
  og_image: https://www.tcules.com/assets/og/tools.png
  og_image_alt: Tcules social card headed Tools, on a white background with the Tcules wordmark.
  og_type: website
  og_url: https://www.tcules.com/tools/figma-storybook-fidelity-checklist
  og_site_name: Tcules
  og_locale: en_GB
  twitter_card: summary_large_image
  twitter_title: 'Figma to Storybook Checklist: Free Component QA | Tcules'
  twitter_description: 'A free Figma to Storybook checklist: test one component across states, keyboard use and screen readers, then download corrections anyone can repeat.'
  twitter_image: https://www.tcules.com/assets/og/tools.png
search_context:
  primary_intent: compare Figma component to coded implementation
  primary_buyer_question: How can design and engineering agree that a component implements its intended behaviour?
  supporting_questions:
  - What evidence should I record?
  - How should I interpret an unknown or a gap?
  - What can I take into the next team review?
  key_entities:
  - Figma
  - Storybook
  - component parity
  - design tokens
  - accessibility
  answer_unit_strategy: utility decision; worked interpretation; limitations; related practice
  buyer_question_evidence:
    source_registry: _system/buyer-question-coverage-v7.yaml
    editorial_method: manual_readthrough_in_v7
    questions_retained_or_exposed:
    - What evidence should I record?
    - How should I interpret an unknown or a gap?
    - What can I take into the next team review?
    questions_withheld: []
  primary_query: Figma to Storybook checklist
  secondary_queries:
  - Storybook component review
  - component states checklist
  - Figma vs code component comparison
  - keyboard accessibility component check
  - component corrections list
  - Storybook QA
  - component fidelity checklist
  - design system component review template
  - check a component in every state
navigation:
  breadcrumb:
  - name: Home
    url: /
  - name: Tools
    url: /tools
  - name: Figma to Storybook Fidelity Checklist
    url: /tools/figma-storybook-fidelity-checklist
  section_labels:
    how-to-use-it: How to use it
    workspace: Component states
    compare: Marking checks
    example: Worked example
    who-its-for: Who it suits
    corrections: Corrections list
    next: Next build review
    faq: FAQs
render:
  band_order:
  - how-to-use-it
  - workspace
  - compare
  - example
  - who-its-for
  - corrections
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
    id: figma-storybook-fidelity-checklist
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
      how-to-use-it: method_process
      workspace: argument_thesis
      compare: argument_thesis
      example: argument_thesis
      who-its-for: buyer_situation
      corrections: argument_thesis
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

*Free tool · Component checks*

# Figma to Storybook checklist: test each component in every state

The free Figma to Storybook Fidelity Checklist tests one component past its looks: keyboard paths, empty and error states, and buttons pressed twice. A select field can match Figma perfectly and still trap a keyboard user. A save button can show the right spinner and send the same request twice.

Compare what the component should do with what it does, note what you saw, and leave with corrections someone else can check.

[Use the checklist](#workspace)

## How to run a Storybook component review with this checklist {#how-to-use-it}

1. **Open both versions.** Put the Figma design beside the matching Storybook story, and note the version of each.

2. **List the states it can really reach.** Empty, long, loading, error, read-only: only the ones your product can produce.

3. **Try each state by hand.** Use the keyboard, press buttons twice, let a request fail and listen with a screen reader.

4. **Mark every check.** Pass, gap, untested or not applicable, each with a note of what you saw.

5. **Order the corrections.** Put blockers first, and give each one an owner and a check anyone can repeat.

## Component states checklist: try it the way people will use it {#workspace}

For each state that applies, record the action, what should happen, what did happen and how you saw it.

| Area | Try | Keep a note of |
|---|---|---|
| Structure and design values | Required variants, content slots, themes and the colour and spacing values behind them | Which Figma and Storybook versions you used, and any agreed differences |
| Content and state | Empty, long, missing, loading, error, selected and read-only content | The state or sample data that shows the result |
| Interaction | The keyboard path, pressing twice, a request still pending and a request that fails | The action and what should happen next, including where focus goes |
| Accessibility | What a screen reader announces: names, roles, linked error messages and status updates | What you saw by hand, plus any automated results |
| Product context | The component inside a real form, dialog or dense table | Whether the surrounding workflow keeps the behaviour |

Test the states the component can really get into. A long list of states it never reaches makes acceptance harder to follow.

## Compare Figma and code: agree the versions, then mark each check {#compare}

Open the Figma design and the matching Storybook story, which is the component previewed in isolation. Note their versions, the theme and the content you are using, and who can resolve a disagreement about how it should behave.

Figma and code can name things differently. Write down which Figma option matches which code setting, so both describe the same behaviour. Where nobody has agreed how something should behave, record an open requirement: a build can only fall short of a rule someone agreed.

Mark each check "pass", "gap", "untested" or "not applicable". A pass needs something you saw. "Not applicable" needs a reason. A gap is a mismatch against an agreed expectation, and "untested" covers anything nobody has checked yet.

## Keyboard accessibility component check: a dialog that loses focus {#example}

*Illustration, not client work.* A dialog looks right and opens from the right button. Press Escape and it closes, but focus jumps to the top of the page when it should return to the button that opened it.

Note the keyboard path and where focus landed. The acceptance check: close the dialog in its real workflow and confirm focus goes back to the control that opened it. A fresh screenshot can't close this one.

## For designers and developers who sign off shared components {#who-its-for}

Use it when a component is about to join the shared library, after a Figma library update, or when a component looks right and still behaves wrongly in the product. It suits a designer and a front-end developer working side by side, with QA or an accessibility specialist joining for the screen reader checks.

Run it one component at a time. For a whole library, start with the components people use most, and keep the checklist as the design system component review template the team repeats on each.

Components written or edited by AI coding tools need this check most. A prompt rarely mentions a failed request, a second click or where focus should land, so those are the states generated code skips first.

## Turn what you found into a component corrections list {#corrections}

Put first anything that blocks an essential action or shows an important state wrongly. Keep untested and disputed states on their own list, with a note of what would show whether the design, the code or the expectation should change.

Give each correction an owner and a check anyone can repeat, and close it when that check passes.

[Storybook's testing guidance](https://storybook.js.org/docs/writing-tests) treats appearance and interaction as separate checks. Its [accessibility testing guidance](https://storybook.js.org/docs/writing-tests/accessibility-testing) adds automated checks, which still need a person to judge them in the real workflow. Run those tests alongside this checklist. The checklist gives the people doing the work a shared record of what was accepted.

## Take the Storybook QA results to the next build review {#next}

Take the downloaded checks to the designer and the developer who look after the component. If the component passes on its own and the product still differs, the [Design System Drift Checker](/tools/design-system-drift-checker) follows the version the product actually uses.

When the disagreement spans design, code and the running product, the [Design-to-Code Audit](/audits/design-to-code-audit) traces each gap from the approved design to what users see and shows where its fix belongs.

If the same kinds of gap keep appearing between your Figma library and your coded components, [Figma & Storybook Alignment](/services/design-systems/figma-storybook-alignment) is the service that brings the two back together.

## Figma to Storybook checklist FAQs {#faq}

### Is there a checklist to compare a Figma component with Storybook?

This page is one, and it is free. You record each state the component can reach, try it by hand and mark what you saw against the Figma design and the agreed behaviour. The result downloads as a list of corrections.

### How do we check a component in every state?

Start with the states it can really get into: empty, long, missing, loading, error, selected and read-only content. Try each with realistic data, then try the interaction around it, such as a request that fails or a button pressed twice. Leave out states the product never produces.

### What should a component review cover beyond visuals?

Keyboard paths, where focus goes, what a screen reader announces, and how the component behaves inside a real form, dialog or dense table. A perfect visual match can still hide a keyboard trap, so behaviour gets its own checks.

### Is there a free Storybook QA checklist?

This checklist works as one. Run it alongside Storybook's own visual, interaction and accessibility tests. The automated checks catch some problems, and a person still needs to judge the results in the real workflow.

### How does this checklist differ from the drift checker?

This checklist tests one component against its design, on its own and inside a real workflow. The [Design System Drift Checker](/tools/design-system-drift-checker) follows the version a product actually uses, so it suits a component that passes here and still looks different in the product.
