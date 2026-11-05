# /expertise/healthtech · hero

Slot: hero beside the copy, paper ground, renders about 600px wide and as the /expertise card cover at 360.
`hero.svg`, viewBox 865 × 651 (about 1.33:1), built by `gen.mjs` (`node gen.mjs` rewrites `hero.svg`).

This drawing is the family standard (STYLE §9a): its floor and its scale are the ones the other industry heroes
match, and it owns the "hub object + blue phone + lime pill" arrangement.

## Candidate ideas (5 Nov rework)

1. **The care kit becomes an app, and the people it serves stand beside it.** The phone rises from the hub's open
   medical case; the clinician, the carer and the patient stand by it, the patient holding the same app.
2. **One next step, reached by wires.** The pilot as it was: a dashed line from the lime button drops to each person.
3. **Safety reviewed early.** A Tcules designer and the client's clinical safety lead stand at the phone together,
   the lead ticking a screen.

**Pick: 1.** It keeps the pilot's idea and arrangement (the owner: "blue phone is fine") and says the copy's
"each person gets a clear next step" without wiring: the lime step on the big screen comes back on the patient's
own phone. Idea 2 is the version Jatin found "not very clear" (the lines looped over the people like wiring).
Idea 3 adds a second idea on top of the first and would need a fourth figure.

Checked against the siblings drawn so far: fintech (blue card beside a light phone, no people), climatetech
(turbine and battery wired to a wall screen, a blue figure at it), edtech (book stairs, a figure climbing,
a phone beside), proptech (house on a lime tile, laptop and a tablet, a site worker). None stands the product inside
the object or puts a group of the product's users beside it.

## The drawing

- **Idea:** "They turn care into an app that gives the patient, the carer and the clinician each a clear next step."
- **Drawn:** the family's dotted floor with a dashed edge and a soft inset. A white medical case with a blue cross
  on its front stands open, its lid up behind. A solid blue phone stands inside it and rises out of it, showing a
  small cross badge and a title bar, a consent card with one ticked box and two short bars, and one lime next-step
  button. Around the case stand three white client pawns, not in a line: the patient by
  the case's front-left face holding a small blue phone that shows the same cross and the same lime step, the carer
  (a large blue heart on the body) at the patient's shoulder, a pair as on a home visit, and the clinician (a large
  blue cross) across from them by the case's front corner. The lid's inner face is plain white with a solid
  brandeis-200 rim and a small blue clasp, so it reads as a case lid.
- **Alt:** Isometric illustration for HealthTech product design. A white medical case with a blue cross stands open
  on a dotted floor, its lid up, and a solid blue phone rises out of it showing a care app: a cross badge, a plain
  consent request with a ticked box, and one lime next-step button. Around the case stand the three people the app
  serves: a patient holding the same app on a small phone with the same lime next step, a carer marked with a heart
  at the patient's shoulder, and a clinician marked with a cross across from them.

## What changed from the pilot

- **No wiring.** The dashed line from the button and its three drops over the people are gone. The link between the
  big screen and the people is now the patient's own phone showing the same lime step (a second lime is allowed
  under STYLE §4 when both halves of one idea need it).
- **Badges read at 600 and 360.** Pawns are larger (body 44 wide, 62 high, head r16, up from 36 / 42 / r13) and the
  cross and heart are about 22 units, up from about 15.
- **People rules (§5).** All three are clients, so they are white with a blue outline. The patient's arm grows from
  the shoulder: a white core inside a blue outline, 11 units thick overall (a quarter of the body), round cap and a
  round hand (r 8.8). The hand grips the phone's lower bezel and leaves the lime step visible. No Tcules figure:
  the idea is who the app is for, not how Tcules works with the client, so §9a's "at least one person" is met by
  the three users.
- **Placement.** The row stands on the inset in front-left of the case, clear of the case's cross face, so the
  floor's front is no longer empty.
- **Unchanged:** the floor, the open case and the blue phone are the approved pilot geometry, kept verbatim in
  `gen.mjs` (`BASE`). The projection is the family's 2:1 iso, `x = -144 + 0.9(u - v)`, `y = 27 + 0.45(u + v) - h`.

Rounds (5 Nov rework): r1 removed the wiring and enlarged the pawns (the patient's hand hid behind the phone);
r2 put the hand in front (it covered the lime step); r3 lengthened the arm; r4 raised the phone so the hand grips
the bezel; r5 moved the row forward onto the inset and checked at 600 and 360.

## Fix pass (5 Nov, after the blind read and the critic)

- **Not a queue.** The blind reader saw three pawns in single file as people waiting, the opposite of the page.
  Now the carer stands at the patient's shoulder (a pair by the case's front-left face) and the clinician stands
  across from them at the case's front corner, so the three surround the care. Floor positions (u, v): carer
  (130, 285), patient (215, 272), clinician (420, 345); all on the brandeis-50 inset, none over the case's cross
  or the lime pill. Sizes, badges and the patient's arm and hand on the small phone are unchanged.
- **The lid reads as a lid, not glass.** The pale inner inset panel is gone; the inner face is white, the top edge
  and its thickness are solid brandeis-200, and a small blue clasp hangs from the rim right of the phone. The lid's
  angle and size are unchanged. Applied in `gen.mjs` as a checked replacement on `BASE` (it throws if the pilot
  geometry ever moves).
- **Unchanged:** the case, the blue phone, its screen (cross badge, ticked consent card, lime next-step pill), the
  floor and the viewBox (865 × 651, about 1.33): every pawn stays inside the old extent. No connectors.
- **Checked:** 600 and 360 (heart, cross, the small phone's lime bar all read at 360); joins zoomed at 2400: the
  rim corners, the clasp against the rim, the patient's hand on the small phone's lower bezel, and the clinician's
  head clear of the case's lower edge (no blue line crosses a white body).
