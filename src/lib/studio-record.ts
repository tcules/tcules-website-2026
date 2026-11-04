/**
 * The studio's record line ("Founded 2017 · More than 90 projects · Clients in 19 countries · Studio
 * in Ahmedabad, India") as figures: the number large, what it counts small (owner, 29 Oct 2026:
 * "we should show stats like stats?"; decisions/2026-10-29-studio-record-is-figures). Wherever the
 * copy sets the line, a page shows it as figures, never as a mono run-on line of facts.
 *
 * Named here, once, so every reader of the line (the corpus hero, home, the offer pages, contact,
 * the case-study listing) splits it by one table and cannot drift. A leaf: it imports nothing.
 *
 * The split designs the words and never rewords the information: "More than 90" is set as "90+"
 * (proposal P33 asks the content team to confirm the form). THREE figures, not four (owner, home
 * round 2: "remove the 'based in India' stat"): a place is not a measure of the studio, so a `null`
 * form is a fact the figures deliberately leave out; the FAQ and the footer still name India.
 */

/** One figure: structurally PageHero's `HeroStat` (the value, an optional unit, the label). */
export type RecordFigure = { value: string; unit?: string; label: string };

const RECORD_FORMS: Readonly<Record<string, RecordFigure | null>> = {
  'Founded 2017': { value: '2017', label: 'Founded' },
  'More than 90 projects': { value: '90+', label: 'Projects' },
  'Clients in 19 countries': { value: '19', label: 'Countries with clients' },
  'Based in Ahmedabad, India': null,
  /* The 26 Oct copy's wording of the same fact (component-map § E home 1). */
  'Studio in Ahmedabad, India': null,
};

/** The facts of a line written "a · b · c", trimmed, blanks dropped. */
const factsOf = (line: string) =>
  line
    .split(' · ')
    .map((fact) => fact.trim())
    .filter(Boolean);

/**
 * Whether a line is the studio's record: facts joined by a middle dot, no "Label:" before them
 * ("Selected work: …" is a proof line, not a record), and at least one fact the table knows.
 */
export function isStudioRecord(line: string): boolean {
  const text = line.trim();
  if (!text.includes(' · ') || /^[^·]*:/.test(text)) return false;
  return factsOf(text).some((fact) => fact in RECORD_FORMS);
}

/**
 * The record's figures, in the line's order. A fact the table does not know still renders, its
 * number as the figure and its words as the label, and says so in development so the table catches
 * up. Empty for a line that is not the record.
 */
export function recordFigures(line: string): RecordFigure[] {
  if (!isStudioRecord(line)) return [];
  return factsOf(line).flatMap((fact) => {
    const known = RECORD_FORMS[fact];
    if (known !== undefined) return known ? [known] : [];
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`studio-record: fact "${fact}" has no figure form; add it to RECORD_FORMS.`);
    }
    return [{ value: /\d[\d.,]*/.exec(fact)?.[0] ?? fact, label: fact }];
  });
}
