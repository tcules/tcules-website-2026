---
title: "A head's end action is vertically centred on the heading; the lead sits under that row"
date: 2026-10-29
status: superseded
area: [layout, components]
source: "Owner review, 29 Oct 2026 (feat/new-copy, home \"A product design partner for ambitious SaaS teams\" · \"Why teams choose Tcules →\")"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "structure (one head Layout per pattern: `columns={{ lg: [1, 'auto'] }}`, `align=\"center\"`, children heading → action → lead)"
---

Where a section head carries an action at its end, the heading and the action share ONE row from 1024,
"vertically centred" on each other, a `column` (64) apart; the lead sits under that row, in the
heading's track. The eyebrow keeps its own line above. Below 1024 the head is one track: heading, the
action a `block` under it, then the lead. Every head with an end action follows it: ContentSection
`actionsAt="end"`, Banner `actionsAt="end"`, Reasons, CaseSpread, EngagementOptions and the listing
sections' "See more".

**Why.** The owner looked at the built home page: the action read as part of the heading's line only
when centred on it. This overturns the same morning's placement (commit 614e6095, not logged as a
ruling), where the action's top sat on the heading's first line and the heading and lead shared one
track beside it.

**The mistake it prevents.** "Why teams choose Tcules →" hung from the heading's top edge, or pinned to
the head's foot beside the lead's last line; one pattern aligning its end action differently from the
others because each writes its own head.

**How to apply.** `src/patterns/ContentSection` (`actionsAt="end"`), `Banner` (`actionsAt="end"`),
`Reasons`, `CaseSpread`, `EngagementOptions` (`action`), and `ListingIndex`'s section head (`align`
center). Specimens: /design/content-section 13b, /design/banner 2b, /design/reasons, /design/case-spread,
/design/engagement-options 0.
