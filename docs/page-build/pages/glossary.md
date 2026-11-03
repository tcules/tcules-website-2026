# /glossary and the 19 term pages — design pass, 4 Nov 2026 (built on design/audits-tools-glossary, awaiting owner approval)

The hub was seven text bands with no visual relief (lowest score on 29 Oct, 4/10; tracker 2.39). It now uses
the insights listing's structure (listings share one structure, owner 16 Oct); each term page is the article
shell with the term's own drawing. Every word is the copy's, in its order.

## /glossary hub → ListingIndex (`templates/ListingIndex/glossary.tsx`)
| Band | Kind / component | Notes |
|---|---|---|
| hero | ListingIndex masthead | title, both lede paragraphs, texture field; no eyebrow (it would repeat the crumb); the studio-photo placeholder is gone |
| how-to-use | index · ListingIndex `lead` | the h2 and three paragraphs as one prose flow at the body measure, beside the rail; MethodBand's decorative numbers are gone |
| five term groups | index · ListingSection | every term the same vertical BlockCard (sm, cue title) with its own term drawing and its definition at every width; rows of three, a final pair on two tracks (`termRows`); h2 the whole authored line, the rail the words before the colon (`railLabel`) |
| design-and-code note | ListingSection `note` | the prototype-hardening card keeps its first sentence; the linked second sentence sits under the group with its links |
| structure ask | ListingIndex `closing` | the open ink island, "Talk to us", id `structure-onward` |
| faq | D-faq | after the island |
| phone rail | IndexRail single-view collapse | "Jump to" plus the section in view as a dropdown, like the term pages' "On this page" |

## Term pages → LongformPage `family="term"`
| Part | Component | Notes |
|---|---|---|
| hero | PageHero with the term's drawing beside the definition | same place on every term page |
| statement | Statement (`figure` optional) | only a line of 16 words or fewer with no link (`isStatementLine`); five terms keep one: coded-prototype, prototype-hardening, user-journey-mapping, workflow-design, design-system-drift. Longer paragraphs open the reading column at body size, links kept |
| comparison tables | DataTable keyless, `pickColumn` on the term's column, `narrow="read-down"` | reads down on a phone, the term's head in the highlight colour |
| related terms | BlockCardSet of term cards, sm, h3 | the hub's card size |
| lone link lines | CtaRow, rule off | rendered in place, never dropped |
| close | TermClose: sentences with their links, then the destination's wide ServiceTile | one shape on every term page |
| outline rail | short `navigation.section_labels` (≤26 chars) | written by the run, not the copywriter: Devagya to read; a proposed Strapi field |

## Proposed rulings (decisions/, status proposed)
2026-11-04-glossary-hub-is-a-listing · -statement-holds-one-short-line · -term-page-closes-in-one-shape ·
-comparison-picks-its-term (with -worksheet-tables-read-down-on-a-phone). This reverses the 29 Oct critic fix
that set how-to-use as a numbered method.

## Drawings
19 term scenes (components/Sketch/wyg-glossary.tsx) and 6 destination scenes (wyg-glossary-destinations.tsx), all
drawn. The final gate applied the blind check's fixes: AI-native product design (the person neutral at rest,
the held row carries the person's glyph, scene centred), coded prototype, design intent and user journey
mapping (centred on the plate), design system drift (trail clear of the rows).

## Open for the owner
- Statement gate on case pages: CasePage's thesis is not gated the same way; it would change approved case pages.
- The run's short outline labels for 19 terms and the hub (owner or content team to read).
- Some term drawings still share the kit's motifs (design system adoption and governance; a blue disc badge on
  AI Product UX, Human in the loop, Design to code, AI-assisted); a set-level blind check across all 19 has
  not been run.
- The AI Copilots and Agents close drawing (`specialist-ai-copilots`) is drawn as two blank cards; it is shared
  beyond the glossary and was left alone.
