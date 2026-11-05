# /expertise/healthtech · hero

Slot: hero beside the copy, paper ground, renders about 600px wide. `hero.svg`, viewBox 865 × 651 (about 1.33:1).

## Candidate ideas

1. **One clear next step for everyone around the patient.** A health app shows one plain consent request and one
   next-step button, and that same step reaches the patient, the carer and the clinician.
2. **The care kit becomes an app.** The hub's medical case opens and the phone rises out of it.
3. **Safety reviewed early.** A clinical safety lead ticks the screens of a health app before it ships.

## The pick: ideas 2 and 1 as one picture

Fix pass (5 Nov): the blind reader found the first version generic. The medical case stood beside the phone as a
label with nothing tying them together, and the connectors fanned into one point like puppet strings. Now the case
does the work. The hub's white medical case stands open with its lid up, and the blue phone (the hero object)
rises out of it, so the picture reads as "the care kit, now an app". The cross on the case's front face carries
the health subject, so the cross on the screen shrinks to a small badge. Idea 1 stays as the action. One dashed
line leaves the lime button, runs out of the phone's side along the iso axes and passes over the three people,
then drops to each of them, ending in a dot.

## The drawing

- **Idea:** "They turn care into an app that gives the patient, the carer and the clinician each a clear next step."
- **Drawn:** the family's dotted floor with a dashed edge and a soft inset. A white medical case with a blue cross on
  its front stands open, its lid up behind. A solid blue phone stands inside it and rises out of it, showing a small
  cross badge and a title bar, a consent card with one large ticked box and two short bars, and one lime next-step
  button. A dashed line leaves the button along the iso axes and drops to three white pawns in a row: a patient
  holding a small phone (arm and hand), a carer marked with a heart and a clinician marked with a cross.
- **Alt:** Isometric illustration for HealthTech product design. A white medical case with a blue cross stands open
  on a dotted floor, its lid up, and a solid blue phone rises out of it showing a care app: a cross badge, a plain
  consent request with a ticked box, and one lime next-step button. A dashed line runs from that button to three
  people standing in a row, a patient holding the same app on a small phone, a carer marked with a heart and a
  clinician marked with a cross, and drops to each of them.

## Construction

Everything is projected on the family's true 2:1 iso: `matrix(0.9 0.45 -0.9 0.45)` for the floor and
`matrix(0.9 0.45 0 1)` for upright faces (phone, case front, cross, the patient's phone). Outlines are 1.6 on
objects and 1.2 on inner detail and connectors. The case has a 10-unit rim. Its inside (back wall, left wall and
floor) is drawn before the phone, and its front rim, front face and side face after, so the phone visibly stands
inside it. The connector gets a white casing where it crosses the blue bezel, so the blue dash does not vanish
there.

Rounds: v1–v6 put the case beside the phone, with a fan of lines from the button to three people. v7 (this fix pass) stands the
phone in the open case, re-projects everything on 0.45, brings the strokes down to 1.6 / 1.2, replaces the fan
with one axis-aligned line and three drops, lines the pawns up beside the case facing the screen, gives the
patient a small phone, and cuts the consent card to a ticked box and two bars.
