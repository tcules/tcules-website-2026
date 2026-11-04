import type { TestimonialRating } from '../../corpus-types.ts';

/**
 * PLACEHOLDER — per-testimonial star ratings, keyed by testimonial id (the frontmatter's
 * `testimonial_ids`).
 *
 * NOT REAL DATA. The owner asked on 10 Oct 2026 (home review, round 2) for the rated testimonial
 * card to show "ratings from 4 to 5 for each testimonial for now". Every value below was chosen to
 * fill that brief, varied in half steps; none was read off a review. A star rating printed beside
 * a named client's words is a claim about what that client said, so these MUST be replaced with
 * each review's own published rating (the 13 Clutch reviews carry one each) or removed before the
 * site launches. docs/content-proposals.md P36 tracks it; `placeholder: true` is how a check finds
 * every one that is left.
 *
 * FLOOR 4.5 (owner, 19 Oct 2026, superseding "4 to 5"): since every value here is invented, none is
 * ever shown below 4.5. `rating()` throws on one that is, so the floor cannot drift. It binds the
 * placeholders only: a real review's published rating is shown as published.
 *
 * Read only through `getTestimonialRatings` (source.ts). A testimonial with no entry renders with no
 * stars, never a default score.
 */
const PLACEHOLDER = true;

/** The lowest placeholder score that may be shown (owner, 19 Oct 2026). */
const PLACEHOLDER_FLOOR = 4.5;
/** The only scores a placeholder may take (owner, 2 Nov 2026: "either 4.5 or 5, never less"). */
const PLACEHOLDER_SCORES: readonly number[] = [4.5, 5];

const rating = (value: number): TestimonialRating => {
  if (PLACEHOLDER && (value < PLACEHOLDER_FLOOR || !PLACEHOLDER_SCORES.includes(value))) {
    throw new Error(
      `testimonial-ratings: placeholder ${value} is below the ${PLACEHOLDER_FLOOR} floor.`,
    );
  }
  return { value, placeholder: PLACEHOLDER };
};

export const TESTIMONIAL_RATINGS: Readonly<Record<string, TestimonialRating>> = {
  /* Home: selected work */
  'FP-DOODLE-EFFICIENCY': rating(5),
  'FP-EDEN-DEVELOPERS': rating(4.5),
  /* Home: why teams choose Tcules; /services/product-design */
  'CL-VIDEOPLASTY-DECISIONS': rating(5),
  'CL-AUX-COMPLEXITY': rating(4.5),
  'DRAFT-PRIMELIS-TEAM': rating(5),
  /* Home: what clients say; /about */
  'CL-RINGIER-COLLAB': rating(5),
  'UW-JOVE-INTEGRATION': rating(4.5),
  'DRAFT-KNOVOS-CANDOUR': rating(4.5),
  'DRAFT-CURAMCARE-RESEARCH-BUILD': rating(5),
  'DRAFT-DOODLE-RESEARCH': rating(4.5),
  'DRAFT-EDEN-PLATFORM': rating(5),
  'FP-EDEN-USERS': rating(4.5),
  /* /expertise/healthtech */
  'DRAFT-CURAMCARE-ONEILL': rating(5),
  /* /case-studies */
  'SSOT-TRISHANYA-RAJU-FOUNDER-THE-WANDERING-RAV': rating(5),
  /* The 26 Oct copy's review routes (/, /about, /contact, /services, /services/product-design,
     /expertise, /audits), 29 Oct 2026: same brief, same floor, same P36 replacement. */
  'DRAFT-CONNECTX-SCENARIOS': rating(5),
  'DRAFT-EDENAI-SPECS': rating(4.5),
  'CLUTCH-RINGIER-SAILER': rating(5),
  'FP-AUXENTIOS-RESEARCH': rating(4.5),
  'SSOT-ASHOK-MOHANTY-FOUNDER-AUXENTIOS': rating(5),
  'DRAFT-VOVISTO-GOMES': rating(4.5),
  'DRAFT-CURAMCARE-APPS': rating(5),
  'FP-GOLDIMAGE-NAVIGATION': rating(4.5),
  'FP-WANDERING-PICTURE': rating(5),
  'DRAFT-NOVUS-RESEARCHER': rating(4.5),
  'CL-KNOVOS-CANDOUR': rating(5),
  'UW-RAZEO-METHOD': rating(4.5),
};

/**
 * ONE RATING PER PERSON (owner, 2 Nov 2026; decisions/2026-11-02-one-person-one-rating): "testimonials
 * should always appear with star ratings, one named person gives one rating across the website despite
 * different quotes." Keyed by the speaker's name as the copy attributes it (the text before the first
 * comma of the bold sign-off). The corpus loader sets every quote's rating from this table and throws
 * on a quoted person missing from it, so no quote renders without stars and no person carries two
 * scores. Still PLACEHOLDERS (P36): each is replaced by the person's own published review.
 */
export const RATINGS_BY_PERSON: Readonly<Record<string, TestimonialRating>> = {
  'Akshay Vyas': rating(5),
  'Aldrin Gomes': rating(4.5),
  'Amin Nordin': rating(5),
  'Ashok Mohanty': rating(5),
  'Clément Contamine': rating(5),
  'David Aghaei': rating(4.5),
  'Dhanur Aashray Majety': rating(5),
  'Eagles Security Aruba & Hotel California Aruba': rating(4.5),
  "Jody O'Neill": rating(5),
  'Kalpesh Gohill': rating(4.5),
  'Pranjal Dev Goswami': rating(5),
  'Pratik Ghoshal': rating(5),
  'Roland Sailer': rating(5),
  'Russell Miler': rating(4.5),
  'Samy Melaine': rating(5),
  'Stephanie Leue': rating(5),
  'Trishanya Raju': rating(5),
  'Tushar G': rating(4.5),
};
