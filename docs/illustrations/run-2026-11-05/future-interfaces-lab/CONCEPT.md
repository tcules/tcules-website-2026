# /future-interfaces-lab · hero

Slot: the hero beside the copy, paper ground, renders about 560 to 620px wide. `hero.svg` has a viewBox of 864 × 578
(1.50:1), built by `gen.mjs` (`node gen.mjs` rewrites `hero.svg`). It uses the expertise family's floor (545 × 402
world units, healthtech's dotted plate, inset and dashed edge) and healthtech's 2:1 projection,
`x = -144 + 0.9(u - v)`, `y = 27 + 0.45(u + v) - h`. Pawns match healthtech's size (body r 22, height 60, head 15.5).

Copy, as written: "Tcules Future Interfaces Lab: experiments in how AI changes software" / "The Lab is where Tcules works on
the software that comes next…". The page also says an experiment "needs room to change shape, or to show that an idea is
a dead end".

## Candidate ideas

1. **A test bench of interface prototypes.** Two Tcules people try small AI interface prototypes on a lab bench. One
   works (lime), and a dead end sits faded and crossed out on the lab shelf beside the bench.
2. **A flask pouring out interfaces.** A large lab flask with UI cards bubbling out of it. Rejected: it is a metaphor
   that needs explaining, and nobody is doing anything.
3. **A board of experiments in three columns** (trying / works / parked), with a person moving a card. Rejected: it
   reads as a kanban tool, not a lab, and it is a diagram rather than a place.

**Pick: 1.** It is literal and reads in three seconds: a lab bench, people trying prototypes, one that works and one set
aside. "Parked as a dead end" is drawn as a real lab action, *shelving* an idea, so it needs no explaining.

## The drawing

- **Idea:** "Tcules people try out new AI interfaces in their own lab: some work, and some get shelved."
- **Read left to right as one line of work:** the shelf (where dead ends are parked), then the bench of prototypes
  under test, then a person trying one. The bench and the shelf stand in one row, so parking reads as a step.
- **Hero object:** the test bench, solid brandeis-500 with a 600/700 thickness edge and blue legs, 352 × 132 world
  units on the healthtech floor.
- **On the bench**, three prototypes on small white test stands (scaled 1.3×, so the badge, tick and waveform read at
  360), each a different kind of AI interface:
  - left: a conversation whose answer (a blue bubble) carries the **AI badge** (what the AI made);
  - middle, **works**: a small app whose one **lime** button is ticked (the drawing's one accent);
  - right: a voice interface, a waveform in a round field.
- **The shelf**, at the bench's left end and in line with it: two boards and a top on four posts set in from the
  board corners, a pale back panel, the flask on top as the one "lab" cue. Lowered by a tier and given one job: on its
  lower board, facing front with nothing over it, the **dead end**, a whole prototype at the bench prototypes' size,
  drawn in brandeis-300 on brandeis-50 with one cross over its entire face.
- **People** (STYLE §5: solid blue, white edge, short solid arm from the shoulder, round hand, one weight), two Tcules
  figures, each with a clear role:
  - **parking:** in front of the shelf, between it and the bench, a hand on the dead end as it is set down;
  - **testing:** at the bench's front-right corner, clear of the leg, a hand on the voice prototype's face.
- **No words:** text is bars; the only lettering is the AI badge, drawn as paths (no `<text>`).

**Alt:** Isometric illustration of the Tcules Future Interfaces Lab. On a dotted floor stands a solid blue test bench
with three interface prototypes under test: on the left a conversation whose answer is marked AI, in the middle a small
app with a lime button ticked as working, and on the right a voice interface with a waveform. A Tcules person at the
bench's front-right corner tries the voice prototype with a hand on its screen. At the bench's left end stands an open
lab shelf with a flask on top, and a second Tcules person sets a faded, crossed-out prototype on its shelf: an idea
parked as a dead end.

## Rounds

1. A bench along the floor with three prototypes; the dead end on a crate on the floor. Too wide (1.86:1), the first
   figure was hidden behind a screen, and the second raised a long arm like a wave.
2. Added a raised shelf on the bench's back for the dead end and a flask, which gave the height. The arms were long
   sticks, and the front-left floor was empty.
3–5. People moved to the bench ends with short arms. Tried database cylinders for "datasets" on the empty floor and
   cut them: they added a second subject and floated as an extra.
6. Rebuilt: smaller prototypes, a freestanding shelf at the bench's left end, people behind the bench. The shelf's
   full-depth side panels hid the dead end.
7. Open shelving on four posts; the first figure moved to the front of the bench's left end.
8–9. Prototypes scaled 1.2×, bench 350 × 122, shelf 236 tall, so the scene fills the plate and lands at 1.46:1.
10. Polish: the top board now sits on the posts (they had poked through it), and the first figure moved closer so its
    arm is short.

11. Fix pass on the blind read and critic. The dead end was a small X card tucked behind a post: now a whole
    prototype at full size, crossed corner to corner, on a lowered two-board shelf that stands in line with the
    bench, and a figure is setting it down, so "some get shelved" is an action, not decoration. The second figure
    moved from behind the bench (hand on the voice screen's back) to its front-right corner with a hand on the
    screen's face: a tester. Prototypes 1.2× → 1.3× on a bench pulled forward (y 190–322) and right, so the group
    fills about 60% of the frame height and the front-right wedge is taken by the tester. Polish: the shelf's posts
    are set 2 units in from the boards' rounded corners (no side-face sliver above the top board); the dead end has
    clear air from every post; the front figure stands clear of the bench's legs. A first try with the shelf at
    the bench's right end left the plate at 1.97:1 (nothing rose above the floor), so the tall shelf stays at the back
    left, where it gives the hero its height.

**Checked:** 600 and 360 (at 360 the AI badge, the lime tick, the waveform and the crossed-out dead end all read).
Joins zoomed at 2400: both shoulders, the parking hand on the dead end's lower left edge, the testing hand on the voice
screen's lower right face (clear of the figure's own head), the shelf's posts under all three boards, the flask on the
top board, the bench legs. SVG: no `<text>`, no `<style>`, no width or height; ids are prefixed (`fil-dots`, `filFig1`,
`filFig2`).

**Open for the owner:** the three screens are deliberately familiar interface kinds (chat, app, voice) so they read at
360; if the owner wants them to look more speculative, that is a change to their contents, not the scene.
