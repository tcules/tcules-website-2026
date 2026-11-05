# Callout

## 0 · Front matter

|                     |                                      |
| ------------------- | ------------------------------------ |
| **Component**       | `Callout`                            |
| **Tier**            | 2 pattern (`src/patterns/Callout/`)  |
| **Status**          | implemented                          |
| **Token prefix**    | `--call-*`                           |
| **Designer / date** | Codex / 24 Aug 2026                  |
| **Implements**      | `docs/briefs/16-callout.md`          |
| **Implemented at**  | `src/patterns/Callout/` · `src/styles/tokens/components/callout.css` · specimen `src/app/design/callout/page.tsx` |
| **Amended**         | 29 Sep 2026, tracker 2.17: an optional mono `label` key (owner decision) |

This spec was checked against the current repository vocabulary and the twenty shipped
components. The brief proposes Tier 1, but the hard constraint that rich text “takes Prose” changes
that answer: a primitive may not import another primitive, while a Tier 2 pattern may compose
`Prose`. The owner accepted the new Tier 2 pattern in section 17 question 1; the remaining
non-blocking recommendations are accepted as drafted.

**Amended 29 Sep 2026 — tracker 2.17, an optional mono key.** On the specimen a scope note was
visually identical to a `Figure` caption: quiet sans, body-small, no mark. The owner chose to add an
**optional `label`** — a short key such as "Scope" or "Note", authored in sentence case and presented
in the mono label voice (`--text-eyebrow` + `--text-eyebrow-tracking` + `text-transform:
var(--text-mono-case)`), leading the sentence in a baseline-aligned `Cluster` at `colGap="tight"`
(and `rowGap="tight"` when it wraps). Its ink is a new per-surface `--call-label-ink`, one rung
stronger than the sentence, each ≥ 4.5:1. **Without `label`, the Callout renders exactly as before**
— same DOM, same CSS. **Amended 30 Sep 2026 (owner):** the key sits ABOVE the sentence in a
`Layout rowGap="tight"`, never beside it; a key and a sentence side by side read as two columns of
one thing. `--call-content-min-xs` is retired with the beside arrangement. The rulings that excluded a label (§ 2, § 3, § 14 Don't 8, and § 11's "no
fixed accessible label") are revised in place below and dated; every other exclusion stands.

## 1 · Identity

`Callout` is a quiet, unattributed scope note that immediately follows the claim it limits. It says
what the surrounding argument, example or evidence does not establish. It appears ten times across
eight routes; `/services/product-design` contains three and the other seven routes contain one.

It is a Tier 2 pattern because it owns the semantic boundary around a trusted rich-text field and
composes the Tier 1 `Prose` primitive. The content seam routes a scope limitation to this typed
record, an ordinary quotation into the surrounding `Prose`, and an attributed quotation to
`Proof`. Callout never inspects HTML to decide which one it received.

It is not a quotation. `Prose` owns ordinary unattributed quotations inside a rich-text flow and
renders them at its established quote scale with a leading rule. It is not client evidence:
`Proof` owns a quote with name, role and company, plus optional audited figures. It is not an alert:
there is no warning, error, success, urgency, dismissal or recovery action in the ten records, and
no alert component exists to borrow. It is not a caption: `Figure` owns the note that qualifies an
image and moves with that image.

This is not a `Prose` size prop. Prose has one reading treatment for an arbitrary body flow; adding
a quiet size to it would let any page diminish any paragraph without saying why. Callout makes the
meaning, fixed quiet treatment and note semantics arrive together. It is also not the existing
Prose blockquote: that treatment increases visual weight through quote type and a deck rule, while
this record must recede from the claim it qualifies.

## 2 · Anatomy

| Part | Required | Element / owner | Content and responsibility |
| ---- | -------- | --------------- | -------------------------- |
| root | yes | element with native-equivalent `role="note"` | Establishes one parenthetic scope note. Owns no ground, edge, outer seam or interactive behavior. |
| content | yes | existing `Prose` | One trusted, sanitised rich-text field containing one or two paragraphs and inline rich text. Callout owns its quiet type and ink; Prose owns the HTML seam, internal flow and inline links. |
| label | no — only when `label` is non-blank | `<span>` inside a `Layout rowGap="tight"` that also holds content | A short mono key ("Scope", "Note"). Added 29 Sep 2026, tracker 2.17. `--call-label-ink`, `--text-eyebrow` + tracking + `--text-mono-case`. Above the sentence (30 Sep 2026; it was beside it). |

**Revised 29 Sep 2026 (tracker 2.17, owner decision).** This paragraph originally excluded a label
along with everything else below. The owner reversed that one exclusion: without a key, a scope note
could not be told from a caption. The label is optional, plain text and never a heading — it names
no landmark and adds no outline entry. Everything else stays excluded: there is no eyebrow, heading,
icon, mark, quotation glyph, attribution, portrait, logo,
image, action, dismissal control, severity marker, panel or ground. The claim being limited is not a
slot: it remains a preceding sibling so the content model does not duplicate page prose inside a
note record.

## 3 · Props / API

```ts
export type CalloutProps = {
  /** Trusted, content-seam-sanitised rich text for one scope limitation. */
  html: string;
  /** Optional short key, authored in sentence case; uppercased in CSS only (2.17). */
  label?: string;
};
```

| Prop | Exact type | Default | What it decides |
| ---- | ---------- | ------- | --------------- |
| `html` | `string` | none | The trusted rich-text limitation rendered through `Prose`. A blank value is invalid at runtime. |
| `label` | `string \| undefined` | `undefined` | Whether a mono key leads the sentence. Blank (after trim) is treated as absent: no `Cluster`, no empty span. A plain `string`, so a key cannot carry a link, an icon or markup. Added 29 Sep 2026, tracker 2.17. |

`surface`, tone, severity, size, colour, padding, gap, radius, height, width, heading, icon,
attribution, actions, `children`, `className`, `style`, `id` and arbitrary DOM attributes are not
props. The nearest `Section` owns the surface; the parent owns placement and the seam from the
claim; one content meaning owns the treatment; and the closed string seam prevents a caller from
putting a control, nested landmark or unrelated block into the note.

There are no valid prop combinations beyond one non-blank `html` string, with or without a `label`
string. Omitting `html`, passing a
React node, or passing a second content slot must be a compile error. TypeScript cannot know whether
an HTML string is blank or contains a heading; the content seam guarantees the permitted schema,
and runtime handles only the blank-string failure without sniffing tags or sentence count.

## 4 · Variants × sizes

**`tone="summary"` (owner, 2 Nov 2026; decisions/2026-11-02-insight-summary-is-a-blue-topped-panel).** An
article's TL;DR, mapped from Strapi's `TldrSection`: its heading becomes `label`, its paragraph `html`. The one
tone with a ground: `--call-summary-ground` with a `--call-summary-rule-width` rule in `--call-summary-rule-ink`
across the top, a `gutter` inset, the key 16 above the paragraph (`rowGap="text"`), and the paragraph in
`--text-summary` (22, phone 18) at the lead measure in `--call-summary-content-ink`. The panel is `fit-content`, so
a short summary is a short panel. Picked as direction D on the Insight summary canvas
(https://claude.ai/artifact/WyE7jPCfHurxZoCwNcLRcb): A's hierarchy in B's panel.
