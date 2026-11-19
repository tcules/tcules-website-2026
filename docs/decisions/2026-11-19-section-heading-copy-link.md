---
title: "A long-form section heading carries a copy-link control after its last word, confirmed by a toast"
date: 2026-11-19
status: active
area: [components, iconography]
source: "Article bug report, P3 #5 (\"copy-link icon on each H2\"), built 19 Nov 2026 on fix/heading-copy-link for Devagya's review"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "AnchorHeading, rendered for every heading block on insight articles and case studies"
---

Every section heading in an insight article or a case study's body (an h2 from a heading block) ends in a copy-link
control: the chrome link mark, always visible in the prose's muted ink, glued to the heading's last word so it never
starts a line alone. Pressing it copies the page address with that section's fragment, and a "Link copied" toast
shows at the foot of the viewport for two seconds; screen readers hear the same message. Where the clipboard is
refused, the fragment goes into the address bar and the toast says so.

**Why.** Readers share a section, not an article, and the only way to get a section's link was the table of contents
and then the address bar. The control is always visible because a hover-only reveal is a fade (no fades) and touch
has no hover.

**The mistake it prevents.** A link icon that appears only on hover, a glyph laid in the heading's left gutter (there
is no gutter at 390: 16px), or a heading whose accessible name reads "Title, Copy link: Title". The heading keeps its
authored title as its name (aria-label); the control is a button, because the action is copying.

**How to apply.** `AnchorHeading` (tier 1) for a heading the page renders from a block; its type stays Prose's h2.
Case-study chapter headings (CaseStory) and markdown h2s are not covered: no article or case study has a markdown h2
today (1,199 h2s across 184 pages, all heading blocks). On promotion to active, ch04 gains the `chrome-link` mark.
