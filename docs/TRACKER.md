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

- [x] **O.1** Pricing may be shown. Supersedes the "plans without prices" design direction (owner, 17 Nov 2026). Logged as decisions/2026-11-19-three-ways-are-priced-plans.
- [x] **O.2** An icon may sit inline with a row's title (owner, 17 Nov 2026). Built as ListCard `titleIcon`; logged as decisions/2026-11-17-row-title-may-carry-inline-icon.
- [x] **O.3** Testimonials on phone may show three and a "See 3 more" button (owner, 17 Nov 2026). Logged as decisions/2026-11-17-testimonial-wall-folds-on-phone; live on every wall (overhaul phase 2).
- [x] **O.4** The client-logo marquee's motion (with O.6): no pause button. Hover or keyboard focus on a logo
      pauses the row and highlights that logo; reduced motion keeps it still, logos wrapped and centred
      (owner, 17 Nov 2026, accepting that this falls short of WCAG 2.2.2).
- [x] **O.4a** decisions/2026-10-19-hover-is-a-move is scoped to cards with an interactive flat drawing;
      it does not govern the marquee, buttons or other controls (owner, 17 Nov 2026). Logged as
      decisions/2026-11-17-hover-is-a-move-for-drawn-cards.

### New components

- [x] **O.5** Chat thread: the client's line, then Tcules' reply, as a conversation. Built from scratch. Live from Strapi (`shared.chat-thread`), Home first.
- [x] **O.5a** Retire `VoiceLedger`: `/expertise/healthtech`'s hard-parts band moves to the existing ruled
      tile set it already looks like; About's unused code path, the specimen and its token layer go. Done
      17 Nov: the component, specimen and tokens are gone; healthtech renders ListTiles.
- [x] **O.6** Client-logo marquee: a `ticker` arrangement of `LogoGrid`. On every live logo band (decisions/2026-11-23-client-logos-are-the-ticker). No hero needs logos (owner, 25 Nov 2026).
- [-] **O.7** ~~The six sides of a B2B product: the wheel and its six annotated sides (SaaS).~~ Dropped: the
      autonomy ladder (O.8) replaces it (owner, 25 Nov 2026).
- [x] **O.8** How much the software does on its own: the autonomy ladder and the AI receipt (SaaS).
      `AutonomyLadder`, from the Expertise zone's Autonomy Ladder section in Strapi.

### Component updates

- [x] **O.9** `ListCard`: the stage rows (stage drawing, link on the right) and the "first step" strip under them. Live as `Stages`; replaces the situation gateway (decisions/2026-11-23-stages-replace-the-situation-gateway).
- [x] **O.10** `EngagementOptions` `plans`: prices, one highlighted plan. Live (decisions/2026-11-19-three-ways-are-priced-plans).
- [x] **O.11** A legend marker for keep / fix / rebuild (MVP "Your prototype is the brief"). Built as `AreaMark`
      (/design/area-mark) and ListCard `verdict`; live on MVP.

### To design

- [x] **O.12** MVP "Your demo works": our own drawing. `ov-mvp-development-underneath`, live on MVP.
- [x] **O.13** MVP "Your prototype is the brief": our own drawing. `ov-mvp-development-prototype-brief`, live on MVP.
- [~] **O.14** How we work "The engagement moves with your product": our own drawing, and a lighter
      arrangement than the 2 × 3 ruled facts. Live (drawing across the band, six tiles under it); the
      drawing needs improving (owner, 25 Nov 2026).
- [x] **O.15** The text-only tile sets on How we work: give each set a shape. The terms keep their drawings
      (decisions/2026-11-24-how-we-work-takes-the-overhaul); What stays the same stays text only
      (decisions/2026-11-25-what-stays-the-same-is-text-only). About's sets move to its new design (O.21)
      and Contact's to its own work (O.23) (owner, 25 Nov 2026).
- [x] **O.16** Stage drawings (about 10 unique across the six stage bands) and the four free-tool drawings.
      All 22 overhaul scenes are drawn (stages for every page, SaaS included); the tool drawings are in
      `wyg-tool-*`.

### Pages

- [x] **O.17** Home Live from Strapi (23 Nov 2026).
- [x] **O.18** The service-page skeleton, then Product Design, MVP Development and Product Modernisation Live from Strapi (decisions/2026-11-24-service-pages-take-the-overhaul).
- [x] **O.19** B2B SaaS expertise from Strapi, without the framework band until the new framework
      (decisions/2026-11-26-b2b-saas-takes-the-overhaul-without-its-framework).
- [x] **O.20** How we work Live from Strapi (decisions/2026-11-24-how-we-work-takes-the-overhaul).
- [ ] **O.21** About (deferred until Jatin's update; owner, 24 Nov 2026)
- [x] **O.22** Careers Live from Strapi (decisions/2026-11-24-careers-takes-the-overhaul).
- [ ] **O.23** Contact: built as F.8 in the form system below.

### On hold

- `Accordion`'s circled open/close buttons: not decided.

---

## Now: the form system

From the forms review with Jatin on 26 Nov 2026 (Granola: "Website forms system, CTA strategy, and Figma
seat renewal") and Devagya's answers the same day. The spec it builds on is `docs/specs/EnquiryForms.md`;
everything in it already on `main` (#322 to #327) stays.

**How it ships.** Every step lands on `main` (staging) only. The complete system, P1 and P2, is reviewed
with Jatin once, after P2. Nothing goes to `new-cms` (production) before that approval; then one new-cms
PR per step, in this order.

### P1 · Building blocks

- [x] **F.1** Shared form store. Sent state per form type, sales and careers kept apart, surviving reloads
      and other pages; careers stays out of the sales rule. Sales forgets at the end of the next business
      day (it follows the "We reply within a business day" promise); careers after 30 days (no reply
      promise yet). The prompt names the date it was sent. The page form and the bottom sheet are one
      form, typing included; typed text lives in memory on the page only, never in storage. Each
      submission is tracked once. Storage reads and writes go through one consent check, so the cookie
      banner (backlog) connects in one line. Built in `lib/form-store`, `lib/form-sent` and `lib/storage`
      (decisions/2026-11-27-form-store-sent-and-drafts; #350).
- [x] **F.2** Remove the intent picker: the page and the button pressed are already captured. Supersedes
      decisions/2026-11-25-intent-picker-is-a-dropdown with a new `/decide` entry; `intent_change` goes.
      Intent removed entirely (Devagya, 27 Nov): decisions/2026-11-27-enquiries-carry-no-intent; #351. The site
      no longer reads it; the CMS's intent collection and fields go in tcules-cms-2026 #11 once this is live.
      "Work email" stays as it is.
- [x] **F.3** Smarter fields, in the shared controls so every form gets them: `https://` shown at the start
      of a link field and stripped from a pasted link; the right keyboard and autofill per field; phone
      with a country code, digits only, validated; a suggestion for a mistyped email domain; spaces
      trimmed; a file field states its types and size before upload. Errors still show on submit only.
      Built (decisions/2026-11-27-smarter-form-fields). The file rule is ready for F.7's CV field; the
      phone field shows today only on the contact form variant, which no live page uses yet (F.8).

### P1 · Design first (mocks, owner review, then build)

- [ ] **F.4** Sent, and send another: one experience for the page form, the bottom sheet and any later
      dialog. The sent message, the "You've already sent this, send another?" prompt on a later visit, the
      CTA showing the form was sent, and "How did you hear about us?" after sending, brought back from
      `design/enquiry-popup`.
- [ ] **F.5** Phone: a bottom sheet opens on every CTA, whether or not the page has a form, linked to the
      page's form when it has one. The submit button stays in a footer; the sheet fits the space above the
      keyboard and the field being typed in stays in view.
- [ ] **F.6** Laptop: CTAs scroll to the page's form, as now. Jatin decides whether a dialog replaces that.
      If yes, it opens on every CTA, form on the page or not, linked to the page's form exactly as the
      bottom sheet is, and arrives as a switch on top of F.1 and F.4.
- [ ] **F.7** Careers application experience, designed from scratch. Assumed fields until Jatin gives the
      real ones: CV, portfolio link, phone, two or three qualifying questions, the role. How the role is
      chosen (chips, a dropdown or something else) is decided in this design. Jatin decides the fields.
- [ ] **F.8** Contact page: port the overhaul's design. Its hero form is the page form the bottom sheet
      links to. Job applicants are led to Careers: a clear route on the page before the form, and
      Contact's form is sales only, so applications stop arriving as "New client inquiry".
- [ ] **F.9** Emails per form type (CMS `client-contact-emails.ts`). Internal notifications with their own
      subject, labels and fields for sales, careers and privacy (today a careers application arrives as
      "New client inquiry", with client labels, the role as a slug, the portfolio twice and three "Not
      provided" rows: Jatin's sample in #tcules-website, 26 Nov). Designed HTML acknowledgements for clients
      and candidates. A proposed list of which email goes to whom, Jatin on every one, for Devagya to send
      to Jatin.

### P1 · Build, then waiting on Jatin

- [ ] **F.10** Private CV storage: a private R2 bucket, not the public media bucket. Code plus a one-page
      setup sheet (bucket, a token scoped to it, Railway variables, a lifecycle rule that deletes CVs after
      six months) for Devagya and Jatin to follow, as Jatin owns Cloudflare. Six months is a proposal;
      Jatin decides. Until it is set up, the careers form works on staging with uploads off.
- [ ] **F.11** Analytics catch-up: events for the bottom sheet opening and closing, the "already sent"
      prompt and send another; `intent_change` removed (F.2).

### P2 · CTAs inside Insights articles (after P1)

The options and variations are on the overhaul canvas (`insight-cta`, `insight-cta-var`). Approach B, one
box inside the article, was preferred on 26 Nov. The box variants need more thought before any build.

- [ ] **F.12** The box inside the article: variants that suit the content best. Not the author card (B2):
      it promises a conversation with the author we cannot keep (Jatin, 26 Nov).
- [ ] **F.13** Strapi rich-text support so editors place the box where it fits.
- [ ] **F.14** Links in the text that jump to the form carry a marker (A1's down-arrow ring).
- [ ] **F.15** The phone's bottom bar steps aside while the box or the form at the end is on screen.
- [ ] **F.16** Insights rich-text layout improvements.

### Then

- [ ] **F.17** One review of the whole system with Jatin on staging. After approval, a new-cms PR per step.

### Waiting on others

- Jatin: the careers fields; dialog yes or no; the email recipient list; how long CVs are kept; the
  Cloudflare setup with Devagya.
- Cookie consent banner (backlog): F.1 is built ready for it.

### Not now

- Google Sheets copy of careers applications: skipped for now (Devagya, 26 Nov).

---

## Follow-ups from 26 Nov 2026

- [x] Prerender pages, refreshed by the CMS webhook (#334, new-cms #339). Railway confirmed: replicas 1,
      default build command, `CMS_REVALIDATION_SECRET` set, build log shows `build-preflight: CMS readable`.
- [ ] Staging's own Strapi webhook (`<staging>/api/revalidate`, staging's secret). Staging did not pick
      up the B2B SaaS publish; production did. Needed before #334, which keeps pages until a webhook
      expires them.
- [-] What `kinds:check` surfaced once pages were prerendered (#334). Dropped: `_pages` and `kinds:check`
      are removed (#341, new-cms #342; decisions/2026-11-26-pages-corpus-removed).
- [ ] `npm run test:cms-cache` still expects 413 at the old 256 KB webhook limit; #272 raised it to 8 MB.
      Update the test.
- [x] `_pages` removed from both branches; `/contact` and share cards read the CMS (#341, new-cms #342).
      The CMS Contact Page query made public, published only (tcules-cms-2026 #10). The `main` slug guard
      from #341 taken out again (#343, new-cms #344): unpublishing in the CMS is the control.
- [ ] Remove the corpus page templates nothing renders any more: `HomePage`, `AboutPage`, `OfferPage`,
      their planning code (`plan.ts`, `kinds.ts`, `CopyBands`, `OfferBands`, `BandView`) and whatever
      only they import. Two PRs (main, new-cms); prove the blast radius (no route changes).
- [ ] Node 22 on Railway: `sanitize-html@2.18.1` needs Node 22.12+, Railway builds on 20.20.2 because
      `engines` says `>=20.11.1`. Raise `engines.node` to `>=22.12.0` (two PRs), then check the next
      staging and production deploys, rich text pages first.
- [ ] CMS content gaps the build log reports (CMS edits, not code): no client logo for Doodle, Knovos
      and SafeXpay on `/case-studies`; the six "why" cards have no illustration on about 40 service,
      expertise and audit pages; `/careers` form success copy is missing; three `/expertise` directory
      cards (Content, Knowledge & Discovery; EdTech & Learning; ClimateTech & Energy) have no image.
- [ ] tcules-cms-2026: four tests fail on the deployed branch (`migration/case-study-staging-20261104`):
      Client Grid, Offer Sheet, Service Card, Shared Hero. They failed before #10.
- [ ] B2B SaaS: compare the overhaul with the live page band by band, every field, after the content script
      missed the testimonial band's Clutch rating (fixed 26 Nov). The ladder caption's "Hand over, Govern
      and Grow" stays for now (Devagya, 26 Nov).
- [ ] `new-cms` has no branch protection; 46 commits reached it without a PR. Protecting it like `main`
      is Devagya's call, after telling Mihir.

---

## Backlog — after the overhaul

- [ ] Level-2 sub-services, 26 pages (`/services/<line>/<service>`), from existing components (owner, 4 Nov 2026).
- [ ] Branded case study cards, an experiment on Linear's concept (owner, 3 Nov 2026).
- [ ] Tools in the listings, looking like tools rather than standard cards (owner, 3 Nov 2026).
- [-] CTA modal: the enquiry form in a dialog on desktop, a bottom sheet on mobile (owner, 5 Nov 2026).
      Moved into the form system as F.5 and F.6.
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
