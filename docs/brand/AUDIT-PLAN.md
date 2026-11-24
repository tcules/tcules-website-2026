# Digital Branding Framework: full audit plan

The plan for one long session that checks the whole framework, brings it up to date and releases it as
v2.0. Written 24 Nov 2026, after the owner asked for it ("the entire DBF is checked, updated, verified for
inconsistency, incorrectness, etc to make sure the documentation is up to date").

## Why a full audit, not another backlog pass

`/dbf-update` applies only the rulings marked `dbf_status: pending` against a chapter. The 24 Nov pass
(PRs #314 and #315: ch02 1.1, ch04 0.3, ch05 1.1, ch10 1.1) showed that this isn't enough.
- **Some active rulings were never routed to a chapter.** For example, `2026-10-30-ink-solid-is-white`
  and `2026-11-19-section-heading-copy-link` both contradict a chapter, but neither one names it.
- **Rulings contradict each other.** "Never a blue surface" (6 Oct) against the blue island (23 and 29 Oct)
  and the blue social close.
- **The framework describes treatments that are no longer built.** These show up in its mock-ups and its
  stated values.
- **Whole areas have rulings but no chapter.** See the scope decision below.

## The first decision: which chapters exist

`00 Cover and Contents.html` lists fourteen chapters, 00 to 13. Only six files exist: 00 (the cover), 02,
03, 04, 05 and 10. The cover still says v0.1, and it marks 05 and 10 as drafts. Many rulings fall into
chapters that haven't been written.

| № | Chapter | Rulings that already exist for it |
|---|---|---|
| 00 | Foundations (attributes, principles, voice) | design quality, "design the job", proof is a set |
| 01 | Logo | the one-colour wordmark (24 Nov, now only in 02 and 10), client marks capped, logo walls and the ticker |
| 06 | Patterns and graphic devices | pixel-grid and flow-field textures, islands, Sketch plates |
| 07 | Layout and grid | the gap scale, Section padding, the 16 phone gutter, island insets, peer versus split, fold rules |
| 08 | Motion | hover is a move, texture motion, animated drawings, pause controls, reduced motion |
| 09 | Data visualisation | (none yet) |
| 11, 12 | Decks, print | (none yet) |
| 13 | Accessibility | WCAG 2.1 AA, contrast, the aria checks, alt text, form errors on submit |

**The owner decides:** which chapters to write in this session, which to leave listed as "to do", and
which to drop from the contents. The recommendation is to write 01 Logo, 07 Layout and 08 Motion. The
repo already holds their substance in rulings, tokens and `CLAUDE.md`, so they can be written from what
ships rather than invented. Fold 13 into the chapters as an accessibility note in each one, unless a
separate chapter is wanted.

## Sources of truth, in order

1. **Active rulings** in `docs/decisions/`. A later ruling beats an earlier one, and a ruling beats the
   chapter.
2. **The token layer** (`src/styles/tokens/`) and `src/lib/icon-glyphs.ts`. Every value a chapter states
   must match these.
3. **What ships:**
   - the `/design` specimens on `main`;
   - the live pages on `new-cms`;
   - `/Users/devagya/tcules-social` for posts.
4. **The chapter's own text.** It is the last source, because it is the one being checked.

## The checks, per chapter

Each chapter gets five checks.
- **A. Ruling coverage.**
  - Every active ruling whose `area` touches the chapter is reflected in it, whatever its `dbf` field says.
  - Every superseded ruling's wording is gone.
  - Output: a table of rulings and where each one appears, plus the missing ones.
- **B. Values against code.**
  - Every hex, size, radius, line height, glyph name and token name is compared with the token files.
  - This is scripted: extract the values from the HTML, resolve each one against `tokens/`, and list
    mismatches and names that no longer exist.
- **C. Examples against what ships.**
  - Every mock-up, figure and Do or Don't is compared with the current specimen or page.
  - It is redrawn when the chapter's existing classes can draw it.
  - When they can't, it is listed with the styling it would need. No new styling is added without the
    owner's approval.
- **D. Internal and cross-chapter consistency.**
  - Contradictions between sections and between chapters.
  - The same thing named two ways.
  - Broken cross-links and section references.
- **E. House style.**
  - British English, no em dashes (chapter 10 alone has 59 left over), plain words.
  - No client names beyond the approved examples.
  - People named, never pronouns.

## How the session runs

1. **Scope decision** (owner, about 10 minutes): the chapter list above.
2. **Audit** (Claude, read-only).
   - One agent per existing chapter runs checks A to E.
   - One more agent reads all chapters for check D across chapters.
   - Each agent writes its findings to `docs/brand/audit/<chapter>.md`.
   - Nothing is edited yet.
3. **Triage** (Claude). Every finding is sorted into one of two kinds.
   - **Fix:** a stale value, a superseded sentence, a typo, a broken link. These need no decision.
   - **Decide:** two active rulings that disagree, a gap with no ruling, or a mock-up that needs new
     styling.
   - The decisions go into one ranked queue, each with a recommendation.
4. **Decisions** (owner, one sitting). Each answer that changes a rule is logged with `/decide`. Those that
   overturn a ruling use `supersedes`.
5. **Edits** (Claude):
   - Apply all fixes and decisions, one commit per chapter.
   - Write the new chapters agreed in step 1, from the rulings and tokens.
   - Update `00 Cover and Contents.html` and the version table in `README.md`.
6. **Verify** (Claude):
   - Re-run check B's script and `npm run decisions -- --check`.
   - Parse every chapter for balanced markup.
   - Confirm that no ruling in the backlog has `dbf_status: pending`.
7. **Review** (owner). Review the chapters in the browser, using a list of what to look at in each one.
8. **Ship:**
   - two PRs (main and new-cms), per `2026-11-24-every-change-is-two-prs`;
   - then `/ds-publish` once main has merged.
   - Every chapter is released as v2.0.

## Open items already known

These were found in the 24 Nov pass and go straight into the decision queue.
- **Blue surfaces.** Ch02 applies "no blue bands" but not "never a blue surface", because the blue island,
  illustrations on blue and the blue social close all depend on one. Does "never a blue surface" get a
  ruling that supersedes it?
- **"Link in the first comment" on the social close.** The shipped template shows it, but ch10 B2 and B5
  still ban mentioning comments on the canvas.
- **Project banners.** Ch05 §9a now has banners follow the case image. The ruling covered cards only. Do
  illustrated banners stay?
- **Ch02 shows a blue solid button on ink.** `2026-10-30-ink-solid-is-white` says it is white.
- **The copy-link mark after a heading** (`2026-11-19-section-heading-copy-link`) against ch04 §7, "they
  do not decorate a heading".
- **`calendar` carries two meanings in ch04:** book a time, and the event format.
- **Ch05:**
  - The SiteNav rail card's 4 radius was folded into "every image takes 8". Check it in code.
  - The §4c Cutaway example contradicts "things carry up".
  - Sector photographs against §10's "stock photography is not published".
  - The blue column of the §4a palette has values not yet set.
- **Ch10 mock-ups:**
  - Serif list titles, and the italic serif quote.
  - No close drawn on brandeis-500, because `.cv.blue` paints 900.
  - The A3 type ladder predates the template's sizes.
- **The code comment in `src/lib/icon-glyphs.ts`** still names `hamburger-menu` and `close-circle`.
- **Ch03 Typography** has 15 pending rulings and wasn't part of the 24 Nov pass. It is applied in step 5.

## Cost and timing

The audit takes about seven agents, one per chapter plus the check across chapters, then the edits. Run
it when the usage budget has room. The owner's time is concentrated in steps 1, 4 and 7.
