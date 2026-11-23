# Tracker

**The one list of what's next.** Work top to bottom unless a task says otherwise. Update it in the same
PR as the work: tick the box and add the PR number.

`[ ]` todo · `[~]` in progress · `[x]` done · `[-]` dropped (say why)

**Every task is done when:** `npm run verify` passes · the specimen is updated · it has been checked at
1440 and 390 · the fix lives in the component or its tokens, not in a route.

The handoff and launch tracker (Stages 0–6, closed 17 Nov 2026) is in git history:
`git show e17fb37c:docs/TRACKER.md`.

---

## Now — the page overhaul (9 pages)

Jatin's new copy and layouts for Home, Product Design, Design-led MVP Development, Product
Modernisation, B2B SaaS expertise, How we work, About, Careers and Contact, laptop and phone:
https://claude.ai/artifact/RJaNv6S6sQf9qQj7JsB4HP (the top rows are the final picks; the archive below
them is superseded). The pages are built on their real routes on staging (`main`), with fixture content;
Strapi is updated when the designs go to production (owner, 17 Nov 2026).

### Rulings (each logged with `/decide` in the PR that applies it)

- [ ] **O.1** Pricing may be shown. Supersedes the "plans without prices" design direction (owner, 17 Nov 2026).
- [ ] **O.2** An icon may sit inline with a row's title (owner, 17 Nov 2026).
- [x] **O.3** Testimonials on phone may show three and a "See 3 more" button (owner, 17 Nov 2026). Logged as decisions/2026-11-17-testimonial-wall-folds-on-phone; live on every wall (overhaul phase 2).
- [ ] **O.4** The client-logo marquee's motion (with O.6): no pause button. Hover or keyboard focus on a logo
      pauses the row and highlights that logo; reduced motion keeps it still, logos wrapped and centred
      (owner, 17 Nov 2026, accepting that this falls short of WCAG 2.2.2).
- [ ] **O.4a** decisions/2026-10-19-hover-is-a-move is scoped to cards with an interactive flat drawing;
      it does not govern the marquee, buttons or other controls (owner, 17 Nov 2026).

### New components

- [ ] **O.5** Chat thread: the client's line, then Tcules' reply, as a conversation. Built from scratch.
- [ ] **O.5a** Retire `VoiceLedger`: `/expertise/healthtech`'s hard-parts band moves to the existing ruled
      tile set it already looks like; About's unused code path, the specimen and its token layer go.
- [ ] **O.6** Client-logo marquee: a `ticker` arrangement of `LogoGrid`.
- [ ] **O.7** The six sides of a B2B product: the wheel and its six annotated sides (SaaS).
- [ ] **O.8** How much the software does on its own: the autonomy ladder and the AI receipt (SaaS).

### Component updates

- [ ] **O.9** `ListCard`: the stage rows (stage drawing, link on the right) and the "first step" strip under them.
- [ ] **O.10** `EngagementOptions` `plans`: prices, one highlighted plan.
- [ ] **O.11** A legend marker for keep / fix / rebuild (MVP "Your prototype is the brief").

### To design

- [ ] **O.12** MVP "Your demo works": our own drawing.
- [ ] **O.13** MVP "Your prototype is the brief": our own drawing.
- [ ] **O.14** How we work "The engagement moves with your product": our own drawing, and a lighter
      arrangement than the 2 × 3 ruled facts.
- [ ] **O.15** The text-only tile sets (What stays the same, The terms, What we believe, How Tcules works
      with clients, What happens after you get in touch): give each set a shape.
- [ ] **O.16** Stage drawings (about 10 unique across the six stage bands) and the four free-tool drawings.

### Pages

- [ ] **O.17** Home
- [ ] **O.18** The service-page skeleton, then Product Design, MVP Development and Product Modernisation
- [ ] **O.19** B2B SaaS expertise (after O.7, O.8)
- [ ] **O.20** How we work
- [ ] **O.21** About
- [ ] **O.22** Careers
- [ ] **O.23** Contact (after the form decision below)

### On hold

- Enquiry form changes, including the Careers application form on the ink band (owner confirming, 18 Nov).
- `Accordion`'s circled open/close buttons: not decided.
- Contact's hero form: the Contact redesign and Jatin's "new Contact page" proposal, both awaiting a decision.

---

## Backlog — after the overhaul

- [ ] Level-2 sub-services, 26 pages (`/services/<line>/<service>`), from existing components (owner, 4 Nov 2026).
- [ ] Branded case study cards, an experiment on Linear's concept (owner, 3 Nov 2026).
- [ ] Tools in the listings, looking like tools rather than standard cards (owner, 3 Nov 2026).
- [ ] CTA modal: the enquiry form in a dialog on desktop, a bottom sheet on mobile (owner, 5 Nov 2026).
- [ ] Cookie consent banner: not designed yet (owner, 31 Oct 2026).
- [ ] From the Jatin review, 22 Oct: a Stripe-like bento of visual-heavy vertical cards · an "Ask AI" feature
      for learning about Tcules on the site · the reply-style form redesigned as an AI chat window.
- [ ] /contact: an animation that celebrates a sent enquiry as the panel turns into the next steps
      (owner, 1 Nov 2026). Reduced motion and decisions/2026-10-19-hover-is-a-move apply; anything beyond
      transform-only motion needs a new ruling.
- [ ] /contact: pre-fill the form from the page the visitor came from (owner, 31 Oct 2026).
- [ ] Rewrite ch05 §9 placement specs from the shipped components (addendum B6; owner, 4 Nov 2026).

**Content asks, addressed later.** The design is content-agnostic, so nothing here blocks the work:
`TESTIMONIAL-REGISTER-V10.csv` (quote text behind the v10 quote IDs) · anything logged in
`docs/content-changes.md`.
