# /expertise/edtech-learning · hero

Slot: the hero beside the copy, on paper, rendered about 600px wide, and the card cover on /expertise at about 360px.
`hero.svg`, viewBox 860.3 × 571.7 (1.50:1), written by `build.mjs` beside it (`node build.mjs`).

## Candidate ideas (all built on the hub's books and graduation cap)

1. **A staircase of books.** The hub's books rise as a staircase toward the graduation cap, a learner climbs it and
   reaches for the next step, and a phone beside it shows that same next step as one lime button.
2. **The cap on a phone.** The hub's books and cap sit on a phone lying flat, with one lime lesson card rising out of
   the screen toward the learner. (This was the stopped first draft.)
3. **The teacher's shelf.** On a teacher's laptop each learner is a pile of books growing toward a cap, and the one
   short pile that has stalled is flagged, so the teacher sees who is stuck.

## The pick: idea 1, polished (v8)

It is the most literal reading of the page's lead ("learners get a clear next step, even on a phone"), and it answers
Jatin's note on round 3 ("you can't see that a student is learning"): the learner stands mid-climb on the second step,
studying the course on a tablet, with the next book a step above. The hub's object is kept whole and made into the
path, so a visitor coming from /expertise knows the field at once.

The family check on batch 1 found that v5 repeated healthtech's formula (hub object on the left, blue phone on the
right, lime pill button). In v6 the product is no longer a separate device beside the stairs: it is in the learner's
hand, part of the climb. The tablet shows two lessons ticked and the next lesson as one lime row, and a short dashed
line runs from behind that row to the lime book, so the next lesson in the app is the next step up.

- **Idea, as a buyer would say it:** "They design learning apps where the next lesson is the learner's next step up."
- **Hero object:** the hub's books and cap, as the staircase. The product is the learner's tablet, held, not a second
  hero standing beside it.
- **Accent:** lime twice, as the two halves of one idea joined by the dashed line: the next book and the tablet's
  next-lesson row (a rounded row, not a pill button).
- **Family (§9a):** healthtech's plate exactly (545 × 402, 22-pitch brandeis-500 dots at 0.38, the 0.07 inset 45 in,
  the 10/8 dashed edge at 1.8), the same way round (545 along x, 402 along y); the staircase centred on it, at the
  scale of healthtech's open case (piles of two to five books, 50 tall each, plus the cap) with 64 of plate front and
  back along the climb; the learner built exactly as healthtech's pawns (body radius 22, body 62, head 16, arm 11 with its
  outline); nothing floats (the tablet is in the learner's hand, over the learner's own step); one screen; 1.49:1;
  reads at 360.

## Parts

- The family floor: healthtech's plate (pattern id `ed-dots`), 545 along x and 402 along y, as healthtech's.
- Four piles of books (two, three, four and five books, 50 tall each, 130 × 64 footprint, 70 apart), climbing along −y
  toward the back right, in one straight line, the whole stair centred on the plate (x 205–340 of 545, y 64–338 of
  402). Each book is built
  as in `expertise.svg`: light covers (brandeis-100 top, 200 and 300 sides), a white page block with two page lines on
  the front face. The books in a pile stagger slightly so they read as books, not slabs.
- The next step: the top book of the third pile, lime, seated square on the book below it. It turns its spine to the
  learner: one solid lime face from cover to cover rising straight from the back edge of the learner's step, with
  its pages showing white between lime covers on the right side.
- The hub's graduation cap on the fourth (top) pile: a dark blue crown, a solid blue board, a white button and tassel.
- The learner (a client's user): a white pawn with a blue outline at healthtech's size, standing on the second step.
- The tablet: solid blue with a dark blue side, 56 × 42, its white screen facing the viewer: a title bar, two ticked
  lesson rows and one lime next-lesson row with a dark bar. It is held at the learner's right at chest height, over
  the learner's own step (the generator refuses a tablet that runs past the step's side or front).
- The arm: healthtech's client arm (light core, blue outline, one weight), short, from the shoulder to the tablet's
  left edge, the hand closing over the bezel and clear of the screen's ticks.
- The tie: a dashed brandeis-500 line (4/4) along −y from behind the tablet's lime row to the lime book's top front
  edge, ending in a small dot. It leaves from the tablet's right part, so most of it shows between the tablet and the
  book, and it is drawn under the tablet, so it never crosses the screen.
- No Tcules figure: the idea is about what the learner gets (STYLE §5).

## Alt

Isometric illustration for EdTech product design. Piles of books rise as a staircase on a dotted floor, one book higher each step, toward a graduation cap on the top pile. A learner stands on the second step holding a blue tablet that shows the course: two lessons ticked and the next lesson as one lime row. The book on the next step up is lime too, and a dashed line runs from the tablet’s lime row to it, so the next lesson in the app is the learner’s next step up.

## Rounds

- v0 (the stopped draft, `preview/v0-staircase-on-flat-phone.png`): book steps on a phone lying flat. The phone was a
  large empty plate, the books read as slabs and the cap's crown was hidden.
- v1: an upright phone and three book piles climbing along +x. In iso the height gain cancels out against the
  piles moving down the screen, so the stairs looked flat, and the two halves were far apart.
- v2: the stairs turned to climb along −y (up and to the right on screen), so the climb reads at once.
- v3: four steps, thicker books, and the next book's cover in lime. The phone was moved forward to stand beside the
  top pile, so the drawing is one group, and it is now drawn after the piles because it is nearer the viewer. The
  floor was trimmed.
- v4: a smaller cap set back so the lime cover shows, a larger learner, a tighter stair pitch and floor, joins checked
  at 2000px (the arm meets the body, the cap's crown sits under the board, and the phone overlaps the top pile in the
  right order).
- v5 (fix pass after the blind read and critic; before: `preview/v4-before-fix.png`): the learner moved down to the
  second step, reaching up for the lime book on the third, and the cap now sits on plain books on the fourth, so the
  learner is visibly mid-climb rather than arriving. The phone is about 80% of its height, stands clear to the right
  of the stairs with its face in line with the third pile, and a dashed line runs along −x from its lime button to
  the lime book's cover. The quiz block on the screen became a four-step progress row (two done). The floor and the
  stair pitch were tightened so the stairs and the learner hold up at 360. Joins checked at 2000px: the hand on the
  cover's edge, the line's dot on the cover corner, the tassel clear of the phone, the line clear of the top pile.
- v6 (family polish after batch 1; before: `preview/v5-before-polish.png`): the side phone and its lime pill are gone
  (healthtech's formula). The product is now the learner's tablet, held in front of the learner on the second step,
  its lime next-lesson row joined by a dashed line to the lime book. The lime book sits square on the book below,
  with lime (not dark lime) on its front faces, so it no longer seems to hover. The floor is healthtech's exactly and
  holds the whole staircase with air on every side. Books grew to 40 tall so the staircase carries the drawing alone
  at the family's scale; the learner is at healthtech's people scale. Joins checked at 2000px: the arm into the body,
  the hand on the tablet's edge, the line leaving the tablet from behind and its dot on the cover's front corner, the
  cap seated on its pile. Seen beside healthtech at 600 and 360.
- v7 (family fix; before: `preview/v6-before-family-fix.png` and `.at-360.png`): the family check found the book
  stacks several times the hub's scale and filling a narrow strip of floor edge to edge, and the tablet floating past
  the step. Now: healthtech's plate exactly (545 × 402), turned so its long side runs along the climb; the staircase
  cut to the scale of healthtech's case (books 130 × 64 × 46, piles 70 apart, a little drift along −x) and set on the
  plate with at least 50 of air on every side; the learner and arm rebuilt at healthtech's people scale; the tablet
  moved beside the learner, over the learner's own step, with a short visible arm whose hand closes over its left edge.
  The tie now leaves from the tablet's right part, so it shows. The stair sits toward the back of the plate because the
  box must stay within 3:2 with only the cap rising above the plate; the open plate in front is the approach to the
  climb. Joins checked at 4–9×: the arm into the body, the hand on the bezel (clear of the ticks), the tie's dot on the
  lime book's top front edge, the cap seated on its pile. Seen beside healthtech and the hub at 600 and 360.
- v8 (final polish; before: `preview/v7-before-centre.png` and `.at-360.png`): the plate was turned (402 × 545) and the
  stair sat in its back corner with a large empty front. Now the plate is healthtech's the same way round (545 × 402)
  and the stair is centred on it; the piles lost their drift along −x, so the stair is one straight climb. To keep the
  box within 3:2 on the wider, shallower plate, each pile is one book taller (two to five books) and the books 50 tall.
  The lime book read as sliding out and floating (a lime board over white pages, its base hidden behind the learner
  and tablet): it now shows its spine to the learner, one solid lime face from cover to cover standing on the back
  edge of the learner's step, so it reads as one whole book seated there. Joins checked at 3000 px: the spine's
  foot on the step, the tie's dot on the spine's top edge, the hand on the tablet's bezel, the arm into the body, the
  cap on its pile. Seen beside healthtech at 600 and 360: the same plate at the same size.
