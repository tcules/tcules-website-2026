# Enquiry forms: types, pickers, buttons and tracking

## 0 · Front matter

|                     |                                                                                                                                                                                                                                                                                                                       |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Scope**           | Site-wide behaviour. Touches `EnquiryForm` (pattern), the buttons that lead to it, `LongformPage` (the legal pages' close), the `/contact` page's form, the API route, Strapi and the GTM data layer                                                                                       |
| **Status**          | `draft`. Two open questions in § 12, one BLOCKING                                                                                                                                                                                                                                                                     |
| **Source**          | Jatin's "Form & CTA Experience Prototype" (`tcules-form-experience-live-style.html`, 20 Nov 2026) for the behaviour. Devagya's answers of 25 Nov 2026 for what to take from it. The look comes from our design system |
| **Written**         | 25 Nov 2026, by Claude Code for Devagya                                                                                                                                                                                                                                                                               |
| **Rulings it keeps** | 2026-10-16 form errors on submit only · 2026-10-19 form choices are chips · 2026-10-28 enquiry card has no title and no placeholders · 2026-10-29 forms only on the island · 2026-11-20 buyer pages close on the form                                                                                              |

## 1 · The problem, in one paragraph

A reader decides to get in touch at a specific moment: a service page's "Start with a pilot", a guide
about UX audits, an open role. Today every one of those buttons lands on the same form, which knows the
page it sits on but not what the reader clicked or meant. Sales sees "an enquiry". Careers and privacy
requests either borrow the sales form or have nowhere to go. And nothing tells us how many people
click, start, give up or send. This work makes each form know **what the reader came for**, lets them
**correct it** when there is a real choice, sends **privacy requests** through their own form, and
**measures the journey** from the click to an accepted send.

## 2 · Behaviour: what a button does

**Every ask takes the reader to a form on a page.**

| The button is… | What happens |
| --- | --- |
| An ask (a call to action) on a page **that has its own form** | Scrolls to the page's form, selects the button's intent in the picker (§ 4), and moves focus to the form's picker group (the phone keyboard stays closed until the reader picks a field). The URL hash becomes `#enquiry`, so the back button returns the reader to where they were |
| An ask on a page **with no form of its own** | Goes to `/contact`, carrying the intent and where the reader came from in the URL (`/contact?intent=start-pilot&from=/services/product-design&placement=hero`). `/contact` selects that intent and records the origin |
| The **nav's ask** ("Book a free product review") | Same rule as any ask: scrolls on a page with a form, goes to `/contact` on one without |
| The nav's **Contact** menu item, and the footer's | Always goes to `/contact`. It names a page and is not an ask (rule already in code since 18 Nov) |

Every ask stays a real link (`#enquiry` or `/contact?…`). A new tab, a modified click, a crawler or a
page whose script never loaded all still reach a form. The scroll and the preselection are an
enhancement on top of a link that already works.

**Which pages have their own form.** Every buyer page closes on the form already (2026-11-20): services,
audits, tools, glossary, About, home, and the insights family. **Insight articles get the form at the
bottom with a relevant default** (§ 4). Careers keeps its application form. The legal pages gain the
privacy form (§ 6). The build starts by listing every route and whether it has a form, and the list
goes in the PR, so "a page with no form" is a known list rather than a guess.

## 3 · Form types

One `EnquiryForm`, configured by type. A type decides the fields, the picker's options, the submit
label and how the submission is tagged.

| Type | Lives on | Fields | Picker | Submit label |
| --- | --- | --- | --- | --- |
| **Sales** | Every buyer page and `/contact` | Name, email, "What are you working on?", link (optional). As today | Ways to work with us (§ 4) | As today |
| **Careers** | `/careers` | As today's application: name, email, link to work (required) | Open roles, plus **General application, always** | As today |
| **Privacy** | Privacy policy, cookie policy, terms of use | Name, email, "What do you need help with?" | Hidden while it has one option; appears by itself when the CMS gets a second (§ 4) | "Send" |

The privacy form follows the forms-only-on-the-island ruling: the legal pages close on the island,
with no drawing. The 28 Oct ruling also holds: the form card carries no title and no placeholders. The
privacy close's heading and line sit on the island beside the form, as on every other close.

"How did you hear about us?" keeps its place; Devagya supplies its options.

## 4 · The picker

**The pattern, from the prototype's dropdowns.** Each form type has its own short list of **intents**.
An intent is what the reader wants to do, in their words, never a product name. Every button carries
one intent. Every page has a default intent for when the reader arrives without a button. The form opens
with that intent already chosen, and the reader can change it.

**Shown only when there is a choice.** A type with two or more options shows the picker. A type with
one option shows nothing: no picker and no "your selected interest" line. The one intent is recorded
silently. The rule is computed from the option count, so adding a second privacy option in Strapi makes
the privacy picker appear with no code change.

**Sales options, starting list** (from the prototype, editable in Strapi; see § 12, question 2):

1. Discuss a project
2. Start with a pilot
3. Scope a project
4. Embedded design team
5. Discuss a UX audit
6. Discuss a paid prototype review
7. Request an introductory call

**Careers options:** one per open role, taken from the roles the careers page already lists, then
**General application**, always last and always present. With no roles open, General application is
the only option, so the picker hides and the form still takes applications.

**Defaults:**

| Page | Default intent |
| --- | --- |
| A service page | Discuss a project |
| An audit page | Discuss a UX audit or Discuss a paid prototype review, chosen per audit in Strapi |
| An insight article | Its own default, set per article in Strapi; falls back to Discuss a project. A UX audit guide defaults to Discuss a UX audit |
| Home, About, hubs, `/contact` with no `?intent` | Discuss a project |
| `/careers` | The role whose button was pressed, else the first open role, else General application |

A button's intent always beats the page default. A reader's own change always beats both, until the
page is left.

**How it looks.** Single-select **chips** per the 2026-10-19 ruling, above the fields, with the
chosen chip filled. The selected chip is the visible echo of what the button promised, so no separate
"your selected interest" line is needed. Seven sales options wrap to two or three rows. **Confirm in § 12,
question 1.**

## 5 · What gets recorded with every submission

Kept as today: `origin_route`, `placement`, `family`, `service_or_audit`, `referrer`, `campaign`.

Added:

| Field | Holds |
| --- | --- |
| `form_type` | `sales`, `careers` or `privacy` |
| `intent` | The intent at submit |
| `intent_initial` | The intent the form opened with, so we can see when readers correct it |
| `cta_id` | The button pressed: `{page}_{placement}_{intent}`, or `direct` when the reader scrolled to the form themselves |
| `entry_route` | For `/contact` only: the page the reader came from (the `from` parameter) |

All of them reach HubSpot as properties. HubSpot needs new properties for `form_type`, `intent`,
`intent_initial` and `cta_id` (Devagya creates them; I list the exact names in the PR).

**Where privacy requests go:** to hello@tcules.com like every enquiry, tagged `form_type = privacy` so
they can be filtered out of sales reports. The site itself sends no email: every submission is saved as
a Strapi client-contact entry and sent to HubSpot (`src/app/api/_client-contact.ts`). Whatever reaches
hello@ today is set up in HubSpot or Strapi, outside this repo. A privacy submission takes the same
path, so it lands wherever enquiries land now. *To check before launch: that this notification
exists and isn't filtered by form or intent.*

## 6 · Analytics events

Pushed to the GTM data layer that the site already loads. **Events carry names and IDs only;** what
the reader types stays in the form.

| Event | Fires when | Parameters |
| --- | --- | --- |
| `cta_click` | An ask is pressed | `cta_id`, `placement`, `intent`, `page`, `destination` (`inline` or `contact`) |
| `form_view` | A form is at least half in view, once per page view | `form_type`, `intent`, `page`, `trigger` (`cta` or `scroll`) |
| `intent_change` | The reader picks another chip | `form_type`, `from`, `to` |
| `form_start` | First focus or input in a field, once per page view | `form_type`, `intent`, `field_name` |
| `form_submit_attempt` | Send pressed | `form_type`, `intent` |
| `form_validation_error` | Send held by errors | `form_type`, `field_names` |
| `submission_accepted` | The API answers success. Never before | `form_type`, `intent`, `intent_initial`, `cta_id` |
| `generate_lead` | With `submission_accepted`, sales only | as above |
| `application_submitted` | With `submission_accepted`, careers only | as above |

GA4 conversions, tags and reports are set up in GTM by whoever owns it. This work only pushes the
events and documents them.

## 7 · Strapi changes

Built the proper way, through fields and components (no workarounds), in `tcules-cms-2026`. Devagya
deploys.

- **Enquiry intent** (collection): `label`, `key` (stable, used in tracking), `formType` (`sales | careers | privacy`), `order`. Seeded with the § 4 lists and one privacy intent.
- **The CTA button component** gains an optional `intent` relation. Empty means the page default.
- **Pages that carry a form** (service, audit, insight, home and so on) gain an optional `defaultIntent` relation.
- **Careers roles** stay where they are. The careers form's options are built from them, plus General application.
- The API accepts `form_type` and the new fields, and rejects an `intent` key it does not know, so a stale link cannot write junk into HubSpot.

## 8 · Accessibility

- The picker is a `fieldset` with a `legend` ("What would you like to do?", visually hidden as today), over real radio inputs. Arrow keys move between options.
- When a button scrolls to the form, focus moves to the picker group, and the selected option is announced. Where there is no picker, focus moves to the form's first field label group without opening a keyboard.
- Errors stay as ruled: on send only, all at once, focus to the first.
- Targets for WCAG 2.1 AA: chips at least 24 by 24, contrast as the existing chip tokens on each surface.

## 9 · Edge cases to build against

- A link with an unknown `?intent=`: the page default is used and the bad key is dropped.
- A button pointing at an intent of another type (a sales intent on the careers form): the page default is used.
- Careers with no open roles: General application only, no picker.
- The reader changes the intent, scrolls away and presses another ask: the new button's intent wins, because it is a fresh statement of what they want.
- A page with two forms (none today): each keeps its own intent. The build refuses a second `#enquiry` anchor.
- Script blocked: links still land on `#enquiry` or `/contact?…`, and the form posts with the page default.

## 10 · Proving it

- `/design/enquiry-form` gains every case: each type, picker shown and hidden, preselected, changed, errors, on each surface.
- `npm run verify`, then `npm run build && npm run aria:check`, then `/audit-component EnquiryForm`, then `npm run shots -- enquiry-form`.
- A data-layer log on the dev server for one journey per type. I'll paste the event list in the PR so the events can be checked without opening GTM.
- Blast radius: build the base and the branch, diff every page, and list each page that changed.

## 11 · Open questions

1. **BLOCKING. Chips or a dropdown for the picker?** The prototype uses a dropdown. The 2026-10-19 ruling says pick-questions are chips. I recommend **chips**: the ruling stands, every option is visible with no tap to open, and the selected chip shows the reader what they asked for. The cost is height: seven sales chips take two or three rows, more on a phone. A dropdown would supersede the ruling and needs a new one logged.
2. **The sales intents' wording.** The seven in § 4 are the prototype's. They live in Strapi, so they can change after launch without a deploy, and this does not block the build. Do you want them reviewed first, by you or Jatin?

## 12 · Build order

Each step ships as two PRs, one to `main` and one to `new-cms`, as every change does.

1. **Analytics events** (§ 6), on the forms as they are. No visual change, so nothing waits on § 11.
2. **Strapi:** the intent collection, the button and page fields, the API (§ 5, § 7).
3. **Picker and button behaviour** (§ 2, § 4), for sales and careers, including General application.
4. **Privacy form** on the three legal pages (§ 3).

Each rule above gets logged with `/decide` in the PR that applies it: an ask scrolls to the page form,
else goes to `/contact`; the picker shows only with a choice; careers always offers General
application; privacy forms on the legal pages.
